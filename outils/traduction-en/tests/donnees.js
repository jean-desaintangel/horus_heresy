// Tests sans navigateur sur les fichiers de données FR et EN :
// - chaque règle citée par une arme a une définition (comme en FR) ;
// - chaque « NomLigne: Type » d'un type multi-profils désigne un profil
//   existant (comme en FR) ;
// - les clés de ROLES_TACTIQUES couvrent toutes les catégories d'unités.
const { chargerDonnees } = require("./commun");

let echecs = 0;
const verifier = (nom, fr, en) => {
  const ok = JSON.stringify(fr) === JSON.stringify(en);
  if (!ok) echecs++;
  console.log((ok ? "✓ " : "✗ ") + nom + " — FR " + JSON.stringify(fr) + " / EN " + JSON.stringify(en));
};

const norm = (s) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/(?:\s*\([^)]*\))+\s*$/, "").trim();
const reglesOrphelines = (langue) => {
  const d = chargerDonnees(langue, ["regles-data.js", "armes-data.js"], "({ R: [...REGLES_ARMES, ...REGLES_DIVERSES], A: [...ARMES_TIR, ...ARMES_MELEE] })");
  const noms = new Set(d.R.map((r) => norm(r.nom)));
  let n = 0;
  for (const cat of d.A) for (const a of cat.armes) for (const r of String(a.regles || "").split(/,\s*(?![^(]*\))/)) {
    if (!r || r === "-") continue;
    const b = norm(r);
    if (!noms.has(b) && !(b.endsWith("e") && noms.has(b.slice(0, -1)))) n++;
  }
  return n;
};
verifier("références de règles d'armes sans définition", reglesOrphelines(""), reglesOrphelines("en"));

const segmentsOrphelins = (langue, sep) => {
  const U = chargerDonnees(langue, ["unites-data.js"], "UNITES");
  let n = 0;
  for (const u of U) for (const v of u.variantes || []) {
    if (!v.profils || !v.type || !v.type.includes("·")) continue;
    const noms = v.profils.map((p) => p.nom);
    for (const seg of v.type.split("·")) {
      const i = seg.indexOf(sep);
      if (!noms.includes(i === -1 ? null : seg.slice(0, i).trim())) n++;
    }
  }
  return n;
};
verifier("segments de type multi-profils sans profil", segmentsOrphelins("", " : "), segmentsOrphelins("en", ": "));

const rolesManquants = (langue) => {
  const d = chargerDonnees(langue, ["organigramme-data.js", "unites-data.js"], "({ R: ROLES_TACTIQUES, U: UNITES })");
  return [...new Set(d.U.map((u) => u.categorie))].filter((c) => !d.R[c]).length;
};
verifier("catégories d'unités absentes de ROLES_TACTIQUES", rolesManquants(""), rolesManquants("en"));

process.exitCode = echecs ? 1 : 0;
