/* ============================================================
   lib/plan.js — découpage d'une chaîne de données en morceaux
   Certains champs de js/*-data.js sont des LISTES de noms que le code
   relit et compare un par un (« Explosion (3"), Brèche (5+) »,
   « Infanterie (État-major, Lourd) »). On les traduit morceau par
   morceau via le glossaire puis on recompose, pour que chaque nom
   reste rigoureusement identique à sa définition ailleurs.
   plan(v, cle, estDonnee) → { pieces: [{ type: "terme"|"texte", fr }], recomposer(traductions[]) }
   ============================================================ */
const { normaliser } = require("./memoire");

const CLES_LISTE = new Set(["regles", "traits", "equipement", "reglesAppliquees"]);

// "Infanterie (État-major, Lourd)" -> "{0} ({1}, {2})" + morceaux
function decouperType(v) {
  const m = v.match(/^([^()]+?) \(([^()]+)\)$/);
  if (!m) return null;
  const sous = m[2].split(", ");
  return { gabarit: "{0} (" + sous.map((_, i) => "{" + (i + 1) + "}").join(", ") + ")", morceaux: [m[1], ...sous] };
}

// Liste séparée par ", " (jamais coupée à l'intérieur de parenthèses).
function decouperListe(v, cle) {
  if (!CLES_LISTE.has(cle) || !/, /.test(v)) return null;
  const morceaux = [];
  let prof = 0, cour = "";
  for (let i = 0; i < v.length; i++) {
    const c = v[i];
    if (c === "(" || c === "[") prof++;
    if (c === ")" || c === "]") prof--;
    if (prof === 0 && c === "," && v[i + 1] === " ") { morceaux.push(cour); cour = ""; i++; continue; }
    cour += c;
  }
  morceaux.push(cour);
  if (morceaux.some((m) => m.length > 80 || /\.\s/.test(m))) return null;
  return morceaux;
}

// Court, sans phrase : un nom plutôt qu'un texte.
function estTerme(v) {
  const t = v.trim();
  if (t.length > 70) return false;
  if (/[.!?:;]\s*$/.test(t) && !/\.\.\.$/.test(t)) return false;
  if (/\.\s+\p{Lu}/u.test(t)) return false;
  return true;
}

function plan(v, cle, estDonnee) {
  const terme = (p) => {
    const n = normaliser(p);
    return { type: "terme", fr: n.base, param: n.param, avant: p.match(/^\s*/)[0], apres: p.match(/\s*$/)[0] };
  };
  // Le glossaire est indexé sans espaces de bord : on les remet ici.
  const remettre = (piece, t) =>
    (piece.avant || "") + (piece.param != null ? t.replace(/\(X\)$/, "(" + piece.param + ")") : t).trim() + (piece.apres || "");
  if (cle === "type") {
    const d = decouperType(v);
    if (d) {
      const pieces = d.morceaux.map(terme);
      return { pieces, recomposer: (tr) => d.gabarit.replace(/\{(\d+)\}/g, (_, i) => remettre(pieces[i], tr[i])) };
    }
  }
  const liste = decouperListe(v, cle);
  if (liste) {
    const pieces = liste.map(terme);
    return { pieces, recomposer: (tr) => pieces.map((p, i) => remettre(p, tr[i])).join(", ") };
  }
  if (estDonnee && estTerme(v)) {
    const p = terme(v);
    return { pieces: [p], recomposer: (tr) => remettre(p, tr[0]) };
  }
  return { pieces: [{ type: "texte", fr: v }], recomposer: (tr) => tr[0] };
}

module.exports = { plan };
