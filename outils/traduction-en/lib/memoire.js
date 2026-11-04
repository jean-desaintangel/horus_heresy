/* ============================================================
   lib/memoire.js — mémoire de traduction FR → EN
   Deux dictionnaires { "texte français exact": "English" } :
   - memoire/glossaire.json : TERMES de jeu (noms de règles, d'armes,
     d'unités, traits, rôles…). Un terme paramétré est stocké sous sa
     forme générique « Brèche (X) » → « Breaching (X) » et sert pour
     toutes ses valeurs (« Brèche (4+) » → « Breaching (4+) »).
   - memoire/textes.json : tout le reste (textes de règles, notes,
     interface, fragments HTML avec leurs balises).
   Le glossaire a priorité : une même chaîne reçoit donc toujours la
   même traduction, ce qui préserve les rapprochements par nom faits
   par le code (info-bulles de règles, profils d'armes, rôles…).
   ============================================================ */
const fs = require("fs");
const path = require("path");

const DOSSIER = path.join(__dirname, "..", "memoire");
const FICHIER_GLOSSAIRE = path.join(DOSSIER, "glossaire.json");
const FICHIER_TEXTES = path.join(DOSSIER, "textes.json");

// Paramètre final d'un terme : (5+), (3"), (D), (2), (X+)…
const PARAM_RE = /\s*\(([0-9X+\-"DIA×x\s\/]+|\d+\+?\s*"?|[0-9]+\s*-\s*[0-9]+|X\+?|\d+\s*PC|Toutes?)\)$/;

function normaliser(s) {
  const t = s.trim();
  const m = t.match(PARAM_RE);
  if (m && m[1].trim() !== "X" && t.length - m[0].length > 1) {
    return { base: t.slice(0, t.length - m[0].length) + " (X)", param: m[1].trim() };
  }
  return { base: t, param: null };
}

function lire(fichier) {
  return fs.existsSync(fichier) ? JSON.parse(fs.readFileSync(fichier, "utf8")) : {};
}

function ecrire(fichier, objet) {
  const coll = new Intl.Collator("fr");
  const trie = Object.fromEntries(Object.keys(objet).sort(coll.compare).map((k) => [k, objet[k]]));
  fs.writeFileSync(fichier, JSON.stringify(trie, null, 1) + "\n");
}

function charger() {
  const glossaire = new Map(Object.entries(lire(FICHIER_GLOSSAIRE)));
  const textes = new Map(Object.entries(lire(FICHIER_TEXTES)));
  // Terme connu tel quel, ou sous sa forme paramétrée.
  const viaGlossaire = (v) => {
    const t = v.trim();
    if (glossaire.has(t)) return glossaire.get(t);
    const n = normaliser(t);
    if (n.param != null && glossaire.has(n.base)) return glossaire.get(n.base).replace(/\(X\)$/, "(" + n.param + ")");
    return null;
  };
  return { glossaire, textes, viaGlossaire };
}

const compacter = (s) => s.replace(/\s+/g, " ");

module.exports = { charger, normaliser, compacter, lire, ecrire, FICHIER_GLOSSAIRE, FICHIER_TEXTES };
