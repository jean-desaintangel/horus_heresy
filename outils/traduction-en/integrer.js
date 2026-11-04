/* ============================================================
   integrer.js — verse les traductions de a-traduire.json en mémoire
   Usage : node integrer.js [fichier.json]   (défaut : a-traduire.json)
   Accepte aussi un simple objet { "français": "English" } (corrections
   ponctuelles, ajoutées à textes.json — ou au glossaire si la clé y
   figure déjà).
   Contrôles avant écriture (une entrée fautive est refusée, les autres
   passent) : mêmes balises HTML, mêmes marqueurs ⟦n⟧ dans le même ordre,
   "(X)" final conservé, mêmes espaces de début et de fin.
   ============================================================ */
const fs = require("fs");
const path = require("path");
const { lire, ecrire, FICHIER_GLOSSAIRE, FICHIER_TEXTES } = require("./lib/memoire");

const fichier = path.resolve(process.argv[2] || path.join(__dirname, "a-traduire.json"));
const donnees = JSON.parse(fs.readFileSync(fichier, "utf8"));
const entrees = Array.isArray(donnees.entrees)
  ? donnees.entrees
  : Object.entries(donnees).map(([fr, en]) => ({ fr, en, type: null }));

const glossaire = lire(FICHIER_GLOSSAIRE);
const textes = lire(FICHIER_TEXTES);

const balises = (s) => (s.match(/<\/?([a-zA-Z0-9]+)/g) || []).map((t) => t.toLowerCase()).sort().join(",");
const marqueurs = (s) => (s.match(/⟦\d+⟧/g) || []).join("");
function probleme(fr, en) {
  if (typeof en !== "string" || !en.trim()) return "vide";
  if (/\(X\)$/.test(fr) && !/\(X\)$/.test(en)) return "doit finir par (X)";
  if (marqueurs(fr) !== marqueurs(en)) return "marqueurs ⟦n⟧ différents ou dans le désordre";
  if (balises(fr) !== balises(en)) return "balises HTML différentes";
  if (/^\s/.test(fr) !== /^\s/.test(en) || /\s$/.test(fr) !== /\s$/.test(en)) return "espaces de début/fin à conserver";
  return null;
}

let ajouts = 0, refus = 0, vides = 0;
for (const { fr, en, type } of entrees) {
  if (!en) { vides++; continue; }
  const pb = probleme(fr, en);
  if (pb) { refus++; console.log("REFUSÉ (" + pb + ") : " + JSON.stringify(fr).slice(0, 90)); continue; }
  const versGlossaire = type === "terme" || (type == null && fr in glossaire);
  (versGlossaire ? glossaire : textes)[fr] = en;
  ajouts++;
}
ecrire(FICHIER_GLOSSAIRE, glossaire);
ecrire(FICHIER_TEXTES, textes);
console.log(ajouts + " traduction(s) intégrée(s), " + refus + " refusée(s), " + vides + " sans traduction.");
if (refus) process.exitCode = 1;
