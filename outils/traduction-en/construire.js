/* ============================================================
   construire.js — génère la version anglaise du site dans en/
   Usage (depuis ce dossier) : node construire.js
   Rôle   : relit les sources FRANÇAISES (index.html, pages/*.html,
   js/*.js), remplace chaque texte repéré par lib/extraction.js par sa
   traduction (lib/memoire.js) à sa position exacte, applique les
   ajustements propres à l'anglais (lib/ajustements-*.js) et écrit le
   résultat dans en/ (mêmes noms de fichiers). CSS, polices, images,
   documents et jsPDF restent partagés à la racine.
   en/ est ENTIÈREMENT régénéré à chaque fois : ne jamais y modifier un
   fichier à la main (la modification serait perdue) — corriger la
   source FR, la mémoire (memoire/*.json) ou un ajustement.
   Sortie : la liste des textes sans traduction (restés en français),
   à traiter avec a-traduire.js. Code de sortie 1 s'il en reste.
   ============================================================ */
const fs = require("fs");
const path = require("path");
const { extraireJs, extraireHtml } = require("./lib/extraction");
const { charger, compacter } = require("./lib/memoire");
const { plan } = require("./lib/plan");
const ajustementsJs = require("./lib/ajustements-js");
const ajustementsHtml = require("./lib/ajustements-html");

const RACINE = path.resolve(__dirname, "..", "..");
const EN = path.join(RACINE, "en");
const SITE = "https://lagrandecroisade.fr/";

const { textes, viaGlossaire } = charger();

// Montages d'armes : "Hull (Front) Mounted X" -> "Front Hull Mounted X".
// Le site ne cherche un nom d'arme qu'AVANT la première parenthèse
// (trouverToutesArmesDansTexte, js/unites.js) : la parenthèse du
// montage ne doit donc pas précéder l'arme. Appliqué à TOUTES les
// traductions pour que `remplace` et `equipement` restent identiques.
const MONTAGE = /\b(Hull|Sponson|Dorsal|Turret|Carapace|Arm|Pintle|Centreline|Sponsons)\s*\(([^()]+)\)\s*(Mounted|mounted|-mounted)\b/g;
const normaliserMontage = (s) => s.replace(MONTAGE, (_, lieu, cote, m) => cote.split(/\s*,\s*/).join("/") + " " + lieu + " " + (m === "mounted" ? "mounted" : "Mounted"));

const manquants = new Map();
// type : "terme" (va au glossaire) ou "texte" (va à textes.json).
function traduire(fr, ctx, type = "texte") {
  let t = viaGlossaire(fr);
  if (t == null && textes.has(fr)) t = textes.get(fr);
  if (t == null) {
    if (!manquants.has(fr)) manquants.set(fr, { ctx, type });
    return fr;
  }
  return normaliserMontage(t);
}

function ecrire(rel, contenu) {
  const p = path.join(EN, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, contenu);
}

// Littéraux passés à ces fonctions : sélecteurs, classes, clés… jamais traduits.
const NE_PAS_TRADUIRE = /^call:(querySelector|querySelectorAll|closest|matches|getElementById|add|remove|toggle|contains|getItem|setItem|removeItem|addEventListener|createElement|getAttribute|hasAttribute|removeAttribute)$/;
const echapperGabarit = (s) => s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");

fs.rmSync(EN, { recursive: true, force: true });

/* ---------- JS ---------- */
const fichiersJs = fs.readdirSync(path.join(RACINE, "js")).filter((f) => f.endsWith(".js"));
for (const nom of fichiersJs) {
  const rel = "js/" + nom;
  let { src, unites } = extraireJs(path.join(RACINE, rel), rel);
  const estDonnee = /-data\.js$/.test(nom);
  const remplacements = [];
  for (const x of unites) {
    if (NE_PAS_TRADUIRE.test(x.key)) continue;
    const ctx = rel + ":" + x.l;
    if (x.k === "lit") {
      const p = plan(x.v, x.key, estDonnee);
      const t = p.recomposer(p.pieces.map((pc) => traduire(pc.fr, ctx, pc.type)));
      if (t !== x.v) remplacements.push({ s: x.s, e: x.e, t: JSON.stringify(t) });
    } else {
      const morceaux = traduire(x.v, ctx).split(/⟦\d+⟧/);
      if (morceaux.length !== x.quasis.length) { manquants.set(x.v, { ctx: ctx + " (marqueurs ⟦n⟧ incohérents)", type: "texte" }); continue; }
      x.quasis.forEach(([s, e], i) => remplacements.push({ s, e, t: echapperGabarit(morceaux[i]) }));
    }
  }
  remplacements.sort((a, b) => b.s - a.s);
  for (const r of remplacements) src = src.slice(0, r.s) + r.t + src.slice(r.e);
  // Listes enregistrées : clés distinctes, une liste FR et une liste EN
  // ne partagent pas leurs libellés.
  src = src.replace(/"hh-(armee-organigramme|fiche-unites|armes-selection)"/g, '"hh-en-$1"');
  // Assets restés à la racine (en/pages/ -> ../../assets/).
  src = src.replace(/(["'`])\.\.\/assets\//g, "$1../../assets/");
  if (nom === "main.js") {
    src = src.replace(/const RACINE_SITE = (.*);\n/, (m) => m + "// Version anglaise : assets et Service Worker restent à la racine du site.\nconst RACINE_ASSETS = RACINE_SITE + \"../\";\n");
    src = src.replace(/RACINE_SITE \+ "assets\//g, 'RACINE_ASSETS + "assets/');
    src = src.replace(/RACINE_SITE \+ "service-worker\.js", \{ scope: RACINE_SITE \}/, 'RACINE_ASSETS + "service-worker.js", { scope: RACINE_ASSETS }');
    if (!src.includes("RACINE_ASSETS + \"service-worker.js\"")) throw new Error("ajustement : enregistrement du Service Worker introuvable dans main.js");
  }
  ecrire(rel, ajustementsJs(nom, src));
}

/* ---------- HTML ---------- */
const pagesHtml = ["index.html", ...fs.readdirSync(path.join(RACINE, "pages")).filter((f) => f.endsWith(".html")).map((f) => "pages/" + f)];
for (const rel of pagesHtml) {
  let { src, unites } = extraireHtml(path.join(RACINE, rel), rel);
  const remplacements = [];
  for (const x of unites) {
    const fr = compacter(x.v);
    let t = traduire(fr, rel);
    if (t === fr) continue;
    if (x.k === "attr") {
      if (src[x.e] === '"') t = t.replace(/"/g, "&quot;");
      else if (src[x.e] === "'") t = t.replace(/'/g, "&#39;");
    }
    remplacements.push({ s: x.s, e: x.e, t });
  }
  remplacements.sort((a, b) => b.s - a.s);
  for (const r of remplacements) src = src.slice(0, r.s) + r.t + src.slice(r.e);

  const racine = rel.startsWith("pages/") ? "../" : "";
  src = src.replace('<html lang="fr">', '<html lang="en">');
  src = src.replace(/content="fr_FR"/g, 'content="en_GB"');
  src = src.replace(/"inLanguage": "fr-FR"/, '"inLanguage": "en-GB"');
  src = src.replace(/(rel="canonical"\s+href="|property="og:url" content=")https:\/\/lagrandecroisade\.fr\//g, "$1" + SITE + "en/");
  src = src.replace(/("url": ")https:\/\/lagrandecroisade\.fr\//, "$1" + SITE + "en/");
  for (const dossier of ["css/", "assets/"]) {
    const re = new RegExp('((?:href|src|content|data-src-defaut|data-src-appui|srcset)=")' + racine.replace(/\./g, "\\.").replace(/\//g, "\\/") + dossier, "g");
    src = src.replace(re, "$1" + racine + "../" + dossier);
  }
  ecrire(rel, ajustementsHtml(rel, src));
}

/* ---------- Manifeste PWA de la version anglaise ---------- */
const manifeste = JSON.parse(fs.readFileSync(path.join(RACINE, "manifest.json"), "utf8"));
Object.assign(manifeste, {
  name: "Horus Heresy — Beginner's Guide",
  description: "Unofficial guide to Warhammer: The Horus Heresy 3rd edition — army building, reference tables and special rules, available offline during your games.",
  id: manifeste.id.replace(/\/?$/, "/") + "en/",
  lang: "en",
});
manifeste.icons = manifeste.icons.map((i) => ({ ...i, src: "../" + i.src }));
ecrire("manifest.json", JSON.stringify(manifeste, null, 2) + "\n");

fs.writeFileSync(path.join(__dirname, ".manquants.json"), JSON.stringify(Object.fromEntries(manquants), null, 1));
console.log("en/ régénéré : " + fichiersJs.length + " fichiers JS, " + pagesHtml.length + " pages.");
if (manquants.size) {
  console.log(manquants.size + " texte(s) sans traduction, restés en français (voir node a-traduire.js) :");
  for (const [fr, { ctx }] of [...manquants].slice(0, 15)) console.log("  " + ctx + " : " + JSON.stringify(fr).slice(0, 100));
  process.exitCode = 1;
}
