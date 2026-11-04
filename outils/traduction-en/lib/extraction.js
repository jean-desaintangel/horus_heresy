/* ============================================================
   lib/extraction.js — repère les textes traduisibles des sources FR
   Rôle   : renvoie, pour chaque fichier JS ou HTML, la liste des
   chaînes à traduire AVEC leur position exacte dans la source, pour
   que construire.js puisse les remplacer sans jamais toucher au code
   ni au balisage autour.
   - JS   : vrai parseur (acorn), littéraux de chaîne et gabarits
            `...${x}...` (les ${} deviennent des marqueurs ⟦0⟧ ⟦1⟧).
            Les identifiants, sélecteurs CSS, chemins et chaînes de
            3 caractères ou moins sont écartés (voir estTraduisible) ;
            une ligne contenant « i18n-ignore » est ignorée.
            ATTENTION : les clés d'objet non calculées ({ "Troupes": … })
            ne sont pas visitées — voir ajustements-js.js (rôles).
   - HTML : parse5 ; un « bloc » de texte (p, li, td, h2…) dont le
            contenu n'est que du texte et du balisage inline est pris
            en entier, balises comprises, pour que la phrase se traduise
            d'un seul tenant. Plus les attributs lisibles (alt, title,
            aria-label, meta description…).
   ============================================================ */
const fs = require("fs");
const acorn = require("acorn");
const walk = require("acorn-walk");
const parse5 = require("parse5");

function estTraduisible(s) {
  if (!s || !/\p{L}/u.test(s)) return false;
  const t = s.trim();
  if (t.length <= 3 && !/[^\x00-\x7F]/.test(t)) return false; // CC, CT, "Sv"
  if (/^(https?:|\/\/|mailto:|data:)/.test(t)) return false;
  if (/^[\w.\-\/]+\.(html|js|css|png|webp|jpg|pdf|docx|pptx|json|woff2)(#.*)?$/.test(t)) return false;
  if (/^[#.]?[a-z][\w-]*([\s>+~,]+[#.]?[a-z][\w\-\[\]="]*)*$/.test(t) && !/\s/.test(t)) return false;
  if (/^[a-z0-9_\-:]+$/.test(t)) return false; // identifiants en minuscules
  if (/^[a-zA-Z0-9_]+$/.test(t) && /[a-z][A-Z]/.test(t)) return false; // camelCase
  if (/[^\x00-\x7F]/.test(t)) return true;
  if (/\s/.test(t)) return true;
  if (/^[A-Z]/.test(t)) return true;
  return false;
}

// Nom de la propriété (ou de l'appel, de la variable) qui contient le
// littéral : sert à reconnaître les champs de données (`regles`,
// `equipement`, `type`…) dont le contenu est découpé terme à terme.
function cleParente(ancetres) {
  for (let i = ancetres.length - 2; i >= 0; i--) {
    const a = ancetres[i];
    if (a.type === "Property") return a.key.type === "Identifier" ? a.key.name : String(a.key.value);
    if (a.type === "ArrayExpression") continue;
    if (a.type === "VariableDeclarator") return "var:" + a.id.name;
    if (a.type === "CallExpression") {
      const c = a.callee;
      return "call:" + (c.property ? c.property.name : c.name);
    }
    if (["BinaryExpression", "TemplateLiteral", "ConditionalExpression", "LogicalExpression"].includes(a.type)) continue;
    return a.type;
  }
  return "?";
}

function extraireJs(fichier, rel) {
  const src = fs.readFileSync(fichier, "utf8");
  const lignes = src.split("\n");
  const ignore = (n) => /i18n-ignore/.test(lignes[n.loc.start.line - 1]);
  const ast = acorn.parse(src, { ecmaVersion: "latest", sourceType: "script", locations: true });
  const sortie = [];
  walk.ancestor(ast, {
    Literal(n, _s, anc) {
      if (typeof n.value !== "string" || ignore(n) || !estTraduisible(n.value)) return;
      sortie.push({ f: rel, s: n.start, e: n.end, l: n.loc.start.line, k: "lit", key: cleParente(anc), v: n.value });
    },
    TemplateLiteral(n, _s, anc) {
      if (anc.some((a, i) => i < anc.length - 1 && a.type === "TaggedTemplateExpression")) return;
      const parts = n.quasis.map((q) => q.value.cooked);
      if (!estTraduisible(parts.join(" "))) return;
      const v = parts.map((p, i) => (i < parts.length - 1 ? p + "⟦" + i + "⟧" : p)).join("");
      sortie.push({ f: rel, s: n.start, e: n.end, l: n.loc.start.line, k: "tpl", key: cleParente(anc), v, quasis: n.quasis.map((q) => [q.start, q.end]) });
    },
  });
  return { src, lignes, unites: sortie };
}

const INLINE = new Set(["a", "strong", "em", "b", "i", "span", "sup", "sub", "abbr", "code", "kbd", "br", "small", "mark", "q", "cite", "u", "s", "wbr", "time", "dfn", "var", "bdi"]);
const SAUTER = new Set(["script", "style", "noscript", "template"]);
const ATTRIBUTS = new Set(["alt", "title", "aria-label", "placeholder", "data-alt-defaut", "data-alt-appui", "aria-description", "aria-roledescription", "label", "data-titre", "data-texte", "data-label", "data-libelle", "data-confirm"]);
const METAS = new Set(["description", "og:title", "og:description", "twitter:title", "twitter:description", "og:image:alt", "twitter:image:alt"]);

function extraireHtml(fichier, rel) {
  const src = fs.readFileSync(fichier, "utf8");
  const doc = parse5.parse(src, { sourceCodeLocationInfo: true });
  const sortie = [];
  const aDuTexte = (n) => (n.nodeName === "#text" ? /\p{L}/u.test(n.value) : !!n.childNodes && n.childNodes.some(aDuTexte));
  const toutInline = (n) => n.childNodes.every((c) => c.nodeName === "#text" || c.nodeName === "#comment" || (INLINE.has(c.nodeName) && toutInline(c)));
  const ajouter = (s, e, k, extra) => {
    const v = src.slice(s, e);
    if (/\p{L}/u.test(v.replace(/<[^>]*>/g, ""))) sortie.push({ f: rel, s, e, k, v, ...extra });
  };
  const sansBords = (s, e, k) => {
    const brut = src.slice(s, e);
    ajouter(s + brut.match(/^\s*/)[0].length, e - brut.match(/\s*$/)[0].length, k);
  };
  const attributs = (n) => {
    if (!n.attrs || !n.sourceCodeLocation || !n.sourceCodeLocation.attrs) return;
    const meta = n.nodeName === "meta" && (n.attrs.find((a) => a.name === "name" || a.name === "property") || {}).value;
    const typeInput = (n.attrs.find((a) => a.name === "type") || {}).value || "";
    for (const at of n.attrs) {
      const ok = ATTRIBUTS.has(at.name) || (meta && at.name === "content" && METAS.has(meta)) || (n.nodeName === "input" && at.name === "value" && /submit|button|reset/.test(typeInput));
      if (!ok || !/\p{L}/u.test(at.value)) continue;
      const loc = n.sourceCodeLocation.attrs[at.name];
      const m = src.slice(loc.startOffset, loc.endOffset).match(/^[^=]+=\s*(["']?)/);
      ajouter(loc.startOffset + m[0].length, loc.endOffset - (m[1] ? 1 : 0), "attr", { attr: at.name });
    }
  };
  const visiter = (n) => {
    if (SAUTER.has(n.nodeName)) return;
    attributs(n);
    if (!n.childNodes) return;
    const loc = n.sourceCodeLocation;
    if (n.nodeName === "title" && loc && loc.startTag) return ajouter(loc.startTag.endOffset, loc.endTag.startOffset, "html");
    const bloc = !["#document", "html", "body", "head"].includes(n.nodeName) && !INLINE.has(n.nodeName);
    if (bloc && loc && loc.startTag && loc.endTag && aDuTexte(n) && toutInline(n)) return sansBords(loc.startTag.endOffset, loc.endTag.startOffset, "html");
    for (const c of n.childNodes) {
      if (c.nodeName === "#text") {
        if (/\p{L}/u.test(c.value) && c.sourceCodeLocation) sansBords(c.sourceCodeLocation.startOffset, c.sourceCodeLocation.endOffset, "html");
      } else if (c.nodeName !== "#comment") {
        if (INLINE.has(c.nodeName) && c.childNodes && aDuTexte(c) && toutInline(c) && c.sourceCodeLocation && c.sourceCodeLocation.endTag) {
          attributs(c);
          ajouter(c.sourceCodeLocation.startTag.endOffset, c.sourceCodeLocation.endTag.startOffset, "html");
        } else visiter(c.content || c);
      }
    }
  };
  visiter(doc);
  return { src, unites: sortie };
}

module.exports = { extraireJs, extraireHtml, estTraduisible };
