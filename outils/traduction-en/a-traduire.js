/* ============================================================
   a-traduire.js — liste les textes FR sans traduction anglaise
   Usage : node a-traduire.js
   Relance construire.js, puis écrit a-traduire.json : un fichier à
   compléter (champ "en" de chaque entrée), avec le contexte de chaque
   texte et les termes du glossaire qu'il contient, à réutiliser tels
   quels. Une fois complété : node integrer.js, puis node construire.js.
   Consignes de traduction : GUIDE-TRADUCTION.md.
   ============================================================ */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { charger } = require("./lib/memoire");

try {
  execFileSync(process.execPath, [path.join(__dirname, "construire.js")], { stdio: "inherit" });
} catch {
  // Code 1 = textes manquants : c'est justement ce qu'on cherche.
}
const manquants = JSON.parse(fs.readFileSync(path.join(__dirname, ".manquants.json"), "utf8"));
const entrees = Object.entries(manquants).map(([fr, { ctx, type }]) => ({ fr, en: "", type, ctx }));
if (!entrees.length) {
  console.log("Rien à traduire : la version anglaise est complète.");
  process.exit(0);
}

// Termes du glossaire présents dans ces textes : à reprendre à l'identique.
const { glossaire } = charger();
const tout = entrees.map((e) => e.fr.toLowerCase()).join("\n");
const pertinents = {};
for (const [fr, en] of glossaire) {
  if (fr.length < 4) continue;
  const base = fr.replace(/ \(X\)$/, "").toLowerCase();
  if (tout.includes(base)) pertinents[fr] = en;
}

const sortie = {
  consignes:
    "Remplir le champ \"en\" de chaque entrée (voir GUIDE-TRADUCTION.md). type \"terme\" = nom de jeu (règle, arme, unité…), type \"texte\" = phrase ou fragment HTML. Les termes de \"glossaire\" sont obligatoires. Puis : node integrer.js && node construire.js",
  glossaire: pertinents,
  entrees,
};
fs.writeFileSync(path.join(__dirname, "a-traduire.json"), JSON.stringify(sortie, null, 1) + "\n");
console.log(entrees.length + " texte(s) à traduire écrits dans a-traduire.json (" + Object.keys(pertinents).length + " termes de glossaire joints).");
