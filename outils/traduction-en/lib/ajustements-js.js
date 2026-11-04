/* ============================================================
   lib/ajustements-js.js — corrections de CODE propres à la version EN
   Appliquées par construire.js après la réinjection des traductions.
   Couvre ce qu'une traduction de chaînes ne peut pas faire seule :
   clés d'objet (rôles), regex visant du texte de jeu français,
   grammaire (élision, pluriels), typographie, abréviations de
   caractéristiques, nom de fichier exporté…
   Chaque motif attendu est VÉRIFIÉ : si la source FR change au point
   qu'un motif n'existe plus, la construction s'arrête avec un message
   (« ajustement : … ») au lieu de produire en silence une version
   anglaise cassée. Il suffit alors d'adapter le motif ici.
   ============================================================ */
const LIBELLES = { CC: "WS", CT: "BS", F: "S", E: "T", PV: "W", Cd: "LD", Sf: "CL", Vo: "WP", Int: "IN", Sv: "SAV", Inv: "INV", PC: "HP" };

function remplacerExact(src, avant, apres, nom) {
  if (!src.includes(avant)) throw new Error("ajustement : motif introuvable dans " + nom + " : " + avant.slice(0, 80));
  return src.replace(avant, apres);
}

// Expressions régulières du code qui visent du texte de jeu français :
// réécrites pour viser le texte anglais correspondant.
const REGEX = {
  "unites-data.js": [
    ["/arme énergétique/gi", "/power weapon/gi"],
  ],
  "unites.js": [
    ["/\\s*\\(liste [^)]*\\)$/", "/\\s*\\(list: [^)]*\\)$/"],
    ["/^toute[s]?\\b/i", "/^(toute[s]?|all|any|entire)\\b/i"],
    ["/^Guerrier Éternel \\(\\d+\\)$/", "/^Eternal Warrior \\(\\d+\\)$/"],
    ["/^Ligne \\((\\d+)\\)$/", "/^Line \\((\\d+)\\)$/"],
    ["/^Avant-garde \\((\\d+)\\)$/", "/^Vanguard \\((\\d+)\\)$/"],
  ],
  "organigramme.js": [["/officier de ligne\\s*\\((\\d+)\\)/i", "/line officer\\s*\\((\\d+)\\)/i"]],
};

module.exports = function (nom, src) {
  for (const [avant, apres] of REGEX[nom] || []) {
    if (!src.includes(avant)) throw new Error("ajustement : regex introuvable dans " + nom + " : " + avant);
    src = src.split(avant).join(apres);
  }
  if (nom === "unites-data.js") {
    // Suffixe "(liste X)" des entrées de listes d'équipement : forme fixe
    // "(list: X)" que nomCourt (js/unites.js) sait retirer.
    const avantListe = src;
    src = src.replace(/nom: item\.nom \+ "[^"]*" \+ liste\.nom \+ "\)",/, 'nom: item.nom + " (list: " + liste.nom + ")",');
    if (src === avantListe) throw new Error("ajustement : suffixe (liste X) introuvable");
  }
  // Textes visibles de 3 caractères ou moins, ignorés par l'extracteur.
  if (nom === "main.js") src = remplacerExact(src, '{ href: "tir.html", texte: "Tir" }', '{ href: "tir.html", texte: "Shooting" }', nom);
  if (nom === "unites-data.js") src = src.replace(/libelle: "Un " \+ role \+/g, 'libelle: "One " + role +');
  if (nom === "unites.js") {
    // Typographie anglaise (pas d'espace avant les deux-points) et
    // suffixe "/figurine" trop court pour l'extracteur.
    src = src.split('titre + " : "').join('titre + ": "').split('(separateur || " : ")').join('(separateur || ": ")');
    src = src.split('? "/figurine" : ""').join('? "/model" : ""');
  }
  if (nom === "armes-data.js") {
    src = remplacerExact(src, 'const ENTETES_TIR = ["P", "PF", "FT", "PA", "D"];', 'const ENTETES_TIR = ["R", "FP", "RS", "AP", "D"];', nom);
    src = remplacerExact(src, 'const ENTETES_MELEE = ["MI", "MA", "MF", "PA", "D"];', 'const ENTETES_MELEE = ["IM", "AM", "SM", "AP", "D"];', nom);
  }
  if (nom === "armes-data.js" || nom === "unites-data.js") {
    // Force (F) -> Strength (S) dans les profils d'armes de mêlée.
    src = src.replace(/stats: \[[^\]]*\]/g, (m) => m.replace(/"F([+\-x×]?\d*)"/g, '"S$1"'));
  }
  {
    // Clés d'objet = noms de Rôles Tactiques (ROLES_TACTIQUES,
    // `restrictions` des détachements…) : non visitées par l'extracteur,
    // alors que les cases (_caseOrga) et catégories d'unités auxquelles
    // on les compare sont traduites par le glossaire. On les renomme
    // avec les mêmes noms anglais, partout.
    const ROLES = {
      "Seigneur de Guerre": "Warlord", "Quartier Général": "High Command", "État-major": "Command",
      Suites: "Retinues", Elite: "Elites", "Engins de Guerre": "War-engines", Troupes: "Troops",
      Appui: "Support", "Seigneurs des Batailles": "Lords of War", Transports: "Transports",
      "Assaut Lourd": "Heavy Assault", "Transports Lourds": "Heavy Transports", Blindés: "Armour",
      Reco: "Recon", "Attaque Rapide": "Fast Attack",
    };
    const acorn = require("acorn"), walk = require("acorn-walk");
    const reps = [];
    walk.full(acorn.parse(src, { ecmaVersion: "latest" }), (n) => {
      if (n.type !== "Property" || n.computed || n.shorthand) return;
      const k = n.key.type === "Identifier" ? n.key.name : typeof n.key.value === "string" ? n.key.value : null;
      if (k && Object.prototype.hasOwnProperty.call(ROLES, k)) reps.push([n.key.start, n.key.end, JSON.stringify(ROLES[k])]);
    });
    reps.sort((a, b) => b[0] - a[0]);
    for (const [s, e, t] of reps) src = src.slice(0, s) + t + src.slice(e);
    if (nom === "organigramme-data.js" && reps.length < 15) throw new Error("ajustement : rôles non réindexés");
  }
  if (nom === "organigramme.js" || nom === "unites.js") {
    // Mots de liaison trop courts pour l'extracteur (≤ 3 caractères).
    src = src.replace(/\.join\(" ou "\)/g, '.join(" or ")').replace(/\.join\(" et "\)/g, '.join(" and ")');
    src = src.replace(/\(i === 0 \? "" : "ou "\)/g, '(i === 0 ? "" : "or ")');
    src = src.replace(/\|\| "figurines"\)/g, '|| "models")');
    src = src.replace(/localeCompare\(([^,()]+), "fr"\)/g, 'localeCompare($1, "en")');
  }
  if (nom === "organigramme.js") {
    // Pas d'élision en anglais : "Reserved for a Sergeant or Champion model".
    src = remplacerExact(
      src,
      `const de = (nom) => (/^[aeiouhàâéèêëîïôùûü]/i.test(nom) ? "d'" : "de ");`,
      `const de = () => "";`,
      nom,
    );
  }
  if (nom === "unites.js") {
    src = src.replace('avantage.nom + " »";', "avantage.nom;");
    // Nom de fichier exporté : allégeance en anglais.
    src = remplacerExact(src, ': "loyaliste",\n  );\n  return segments.filter(Boolean);', ': "loyalist",\n  );\n  return segments.filter(Boolean);', nom);
    // Disciplines psychiques : clés cherchées comme sous-chaînes du texte
    // (traduit) de l'équipement et des règles.
    src = src.replace(
      /const ARMES_PSYCHIQUES_DISCIPLINES = \{[\s\S]*?\n\};/,
      (m) => {
        const valeurs = [...m.matchAll(/: "([^"]+)",/g)].map((x) => x[1]);
        if (valeurs.length !== 3) throw new Error("ajustement : ARMES_PSYCHIQUES_DISCIPLINES inattendu");
        return 'const ARMES_PSYCHIQUES_DISCIPLINES = {\n  "Call of the Storm": "' + valeurs[0] + '",\n  Anathemata: "' + valeurs[1] + '",\n  Diabolism: "' + valeurs[2] + '",\n};';
      },
    );
    // Pluriels anglais dans la recherche d'arme : "battery" doit aussi
    // trouver "batteries", "flamer" -> "flamers", "torch" -> "torches".
    src = remplacerExact(
      src,
      'return new RegExp(echapperRegex(nomMinuscule).split(" ").join("s? ") + "s?");',
      'const pluriel = (mot) => (/[^aeiou]y$/.test(mot) ? mot.slice(0, -1) + "(?:y|ies)" : mot + "(?:e?s)?");\n  return new RegExp(echapperRegex(nomMinuscule).split(" ").map(pluriel).join(" "));',
      nom,
    );
    // Types multi-profils "Sergeant: Infantry (Sergeant) · …" : deux-points
    // à l'anglaise (sans espace avant) dans les données traduites.
    const nSep = (src.match(/segment\.indexOf\(" : "\)/g) || []).length;
    if (nSep !== 2 || (src.match(/separateur \+ 3/g) || []).length !== 3) throw new Error("ajustement : séparateurs de type inattendus");
    src = src.replace(/segment\.indexOf\(" : "\)/g, 'segment.indexOf(": ")').replace(/separateur \+ 3/g, "separateur + 2");
    // Pluriel anglais : on accorde le DERNIER mot ("Bolt pistols"), pas le
    // premier comme en français ("Pistolets bolter").
    src = src.replace(
      /const pluraliser = \(nom, compte\) => \{[\s\S]*?\n  return words\.join\(" "\);\n\};/,
      (m) => {
        return `const pluraliser = (nom, compte) => {
  if (compte <= 1 || !nom) return nom;
  const words = nom.split(" ");
  const i = words.length - 1;
  const w = words[i];
  if (/s$/i.test(w) || /[^\\p{L}]$/u.test(w)) return nom;
  words[i] = /[^aeiou]y$/i.test(w) ? w.slice(0, -1) + "ies" : /(x|ch|sh)$/i.test(w) ? w + "es" : w + "s";
  return words.join(" ");
};`;
      },
    );
    // Les en-têtes de profil servent aussi de CLÉS de lecture du profil
    // (variante.profil[c]) : on les garde, et on traduit à l'affichage.
    src = remplacerExact(
      src,
      "    th.textContent = titre;\n    ligneTitres.appendChild(th);",
      "    th.textContent = LIBELLES_CARACTERISTIQUES[titre] || titre;\n    ligneTitres.appendChild(th);",
      nom,
    );
    src = remplacerExact(
      src,
      "const ENTETES_PROFIL = [",
      "// Version anglaise : abréviations GW affichées à la place des clés\n// françaises (qui restent les noms de champs des profils).\nconst LIBELLES_CARACTERISTIQUES = " + JSON.stringify(LIBELLES) + ";\nconst ENTETES_PROFIL = [",
      nom,
    );
  }
  return src;
};
