/* ============================================================
   unites.js — Fiches récap d'unités (page unites.html)
   Auteur : Jean · Créé : 2026-07-16
   Rôle   : le visiteur compose sa liste : il ajoute des unités,
   choisit une variante (ex : Praetor / Praetor à Réacteurs) et
   ses options d'armement ; le coût en Points de chaque unité et
   le total de la liste sont recalculés à chaque changement. Une
   fiche récap (profil, équipement final, règles) est générée
   pour chaque unité ; la liste est imprimable (Ctrl+P — voir les
   styles @media print de css/style.css) et téléchargeable au
   format « carte d'unité », au choix en PDF (bouton « Télécharger
   en PDF », voir genererPDF) ou en Word (bouton « Télécharger en
   Word », voir genererWordHTML).
   Depuis 2026-07-17, chaque unité ajoutée doit occuper une Case
   de l'Organigramme de Force (règles de Sélection d'Armée,
   p. 282-285) : la structure de l'armée et sa validation sont
   déléguées à js/organigramme.js (API window.Organigramme).
   Dépend : js/main.js (normaliserTexte, el, trouverDefinitionRegle),
   js/regles-data.js, js/armes-data.js, js/unites-data.js,
   js/organigramme-data.js et js/organigramme.js (chargés avant ce
   script), js/vendor/jspdf.umd.min.js et
   js/vendor/jspdf.plugin.autotable.min.js (export PDF, voir
   js/vendor/LICENCES.txt).
   Sécurité : textContent partout, jamais innerHTML — à l'exception
   du HTML du fichier Word (genererWordHTML/carteWordHTML), construit
   uniquement pour un téléchargement local et dont chaque valeur
   dynamique est échappée via echapperHTML.
   Persistance : la liste est mémorisée dans localStorage pour
   survivre au rechargement de la page (aucune donnée envoyée
   à un serveur).
   ============================================================ */

/* ----------------------------------------------------------
   ÉTAT
   Une « instance » = une unité ajoutée à la liste :
   { uid, uniteId, variante (indice), valeurs: { idOption: valeur } }
   Valeur selon le type d'option :
   - "choix" : indice du <option> sélectionné (0 = conserver)
   - "case" / "paire" : booléen
   - "multi" : tableau d'indices cochés
   ---------------------------------------------------------- */
let armee = [];
let compteurUid = 0;
// Vrai une fois window.Organigramme initialisé : évite d'actualiser
// l'organigramme pendant la restauration initiale des cartes.
let orgaPret = false;

const CLE_STOCKAGE = "hh-fiche-unites";

// En-têtes du profil d'infanterie et du profil de véhicule.
const ENTETES_PROFIL = [
  "M",
  "CC",
  "CT",
  "F",
  "E",
  "PV",
  "I",
  "A",
  "Cd",
  "Sf",
  "Vo",
  "Int",
  "Sv",
  "Inv",
];
const ENTETES_VEHICULE = [
  "M",
  "CT",
  "Blindage Avant",
  "Flanc",
  "Arrière",
  "PC",
  "Capacité de Transport",
];

// Ordre d'affichage des catégories dans le menu de sélection,
// indépendant de leur ordre d'apparition dans UNITES. Une catégorie
// absente de cette liste est simplement affichée après les autres.
const ORDRE_CATEGORIES = [
  "Seigneur de Guerre",
  "Quartier Général",
  "État-major",
  "Suites",
  "Elite",
  "Assaut Lourd",
  "Troupes",
  "Appui",
  "Engins de Guerre",
  "Transports",
  "Transports Lourds",
  "Reco",
  "Attaque Rapide",
  "Blindés",
  "Seigneurs des Batailles",
];

/* ----------------------------------------------------------
   OUTILS DONNÉES
   ---------------------------------------------------------- */

// Retrouve la fiche d'une unité par son id.
function trouverUnite(id) {
  return UNITES.find((u) => u.id === id);
}

/* Un « personnage nommé » (ex : Khârn le Sanglant, Raldoron…) porte
   le sous-type « Unique » (voir js/unites-data.js, champ `type` des
   variantes) : les règles n'autorisent qu'un seul exemplaire de ce
   personnage dans l'Armée. */
function estPersonnageNomme(unite) {
  return unite.variantes.some((v) => v.type && v.type.includes("Unique"));
}

/* Une unité réservée à une Légion (champ `legion`, ex : Corvus Corax,
   Kaedes Nex, Escouades de Mor Deythan/Furies Noires — voir js/unites-
   data.js) n'est proposable que si cette Légion est actuellement
   choisie dans les paramètres de la partie (js/organigramme.js), OU
   si elle est la Légion Alliée d'un Détachement Allié de l'Armée (p.
   283 : Faction distincte de celle du Détachement Principal — voir
   Organigramme.legionsAlliees()). Sans Légion précisée sur l'unité,
   elle reste universellement disponible.
   De même, une unité au Trait « Loyaliste » ou « Renégat » (champ
   `traits`, ex : Primarques, Maîtres de Légion) n'est proposable que
   si l'Allégeance de l'Armée (js/organigramme.js) correspond : ce
   changement d'Allégeance retire aussi les unités devenues
   incompatibles déjà présentes dans la liste (voir le gestionnaire
   du menu Allégeance dans js/organigramme.js).
   Un champ `excluAvec: [idUnite, ...]` (ex : Angron / Angron
   Transfiguré, deux formes du même Primarque) rend l'unité
   indisponible tant qu'une des unités listées est déjà dans la liste.
   Un personnage nommé (sous-type « Unique ») déjà présent dans la
   liste devient lui aussi indisponible, pour empêcher un doublon.
   Un champ `maxParArmee: N` (ex : Escouade de Terminator Deliverers,
   « 0-1 » du livre) généralise cette même mécanique de quota aux
   unités d'escouade (pas seulement aux personnages nommés) : l'unité
   disparaît du sélecteur dès que N exemplaires sont déjà dans la liste.
   Ne s'applique qu'au sélecteur « Unité à ajouter » : une unité déjà
   dans la liste reste affichée si la Légion change ensuite, ou si
   l'unité exclusive avec laquelle elle a été ajoutée est retirée
   entre-temps (elle redevient alors non disponible pour un second
   ajout, comme n'importe quelle unité déjà présente). */
function uniteAccessible(unite) {
  if (unite.legion) {
    if (!orgaPret || typeof Organigramme === "undefined") return false;
    const legionOk =
      Organigramme.legionActuelle() === unite.legion ||
      Organigramme.legionsAlliees().includes(unite.legion);
    if (!legionOk) return false;
  }
  if (
    unite.traits &&
    (unite.traits.includes("Loyaliste") || unite.traits.includes("Renégat"))
  ) {
    if (!orgaPret || typeof Organigramme === "undefined") return false;
    const allegeance = Organigramme.allegeanceActuelle();
    if (unite.traits.includes("Loyaliste") && allegeance !== "loyaliste")
      return false;
    if (unite.traits.includes("Renégat") && allegeance !== "renegat")
      return false;
  }
  if (
    unite.excluAvec &&
    unite.excluAvec.some((id) => armee.some((inst) => inst.uniteId === id))
  )
    return false;
  if (
    unite.maxParArmee &&
    armee.filter((inst) => inst.uniteId === unite.id).length >=
      unite.maxParArmee
  )
    return false;
  if (
    estPersonnageNomme(unite) &&
    armee.some((inst) => inst.uniteId === unite.id)
  )
    return false;
  return true;
}

// Retire " (liste Pistolets de Légion)" etc. du nom d'un choix : sert
// à la fois aux menus déroulants (construireConfig) et à la fiche
// récap, aucun des deux ne gagnant à afficher la liste d'origine.
function nomCourt(nom) {
  return nom.replace(/\s*\(liste [^)]*\)$/, "");
}

// Valeurs par défaut des options d'une unité.
function valeursParDefaut(unite) {
  const valeurs = {};
  for (const opt of unite.options) {
    if (opt.type === "choix") valeurs[opt.id] = 0;
    else if (opt.type === "multi") valeurs[opt.id] = [];
    else if (opt.type === "quantite") valeurs[opt.id] = 0;
    else valeurs[opt.id] = false; // case, paire
  }
  return valeurs;
}

/* Budget d'une option "quantite" (escouades) : nombre maximal
   d'échanges autorisés. `parTranche: 5` = 1 échange (ou
   `parTrancheMax`) par tranche de 5 figurines dans l'unité. */
function budgetQuantite(unite, instance, opt) {
  if (opt.parTranche) {
    return (
      Math.floor((instance.effectif || 1) / opt.parTranche) *
      (opt.parTrancheMax || 1)
    );
  }
  return opt.max || 0;
}

/* Quantité déjà consommée sur ce budget. Les options partageant
   un même `groupe` puisent dans le même budget (ex : « par
   tranche de cinq, UN Légionnaire peut prendre X OU Y »). */
function quantiteUtilisee(unite, instance, opt) {
  if (!opt.groupe) return instance.valeurs[opt.id];
  let total = 0;
  for (const autre of unite.options) {
    if (autre.type === "quantite" && autre.groupe === opt.groupe) {
      total += instance.valeurs[autre.id];
    }
  }
  return total;
}

// Une option est-elle accessible à la variante choisie ?
function optionPermise(opt, instance) {
  return !(
    opt.variantesExclues && opt.variantesExclues.includes(instance.variante)
  );
}

/* Équipement final d'une instance : équipement de départ, puis
   application de chaque option active. `sansOption` permet de
   calculer « l'équipement si cette option n'existait pas » (sert
   à savoir si une option est encore réalisable : on ne peut pas
   remplacer un bolter déjà remplacé par ailleurs). */
function equipementFinal(unite, instance, sansOption = null) {
  const equip = [...unite.equipement];
  const retirer = (nom) => {
    const i = equip.indexOf(nom);
    if (i !== -1) equip.splice(i, 1);
  };

  for (const opt of unite.options) {
    if (opt.id === sansOption || !optionPermise(opt, instance)) continue;
    const val = instance.valeurs[opt.id];

    if (opt.type === "choix") {
      // `obligatoire: true` : l'indice 0 est un vrai choix (ex :
      // « toutes les figurines DOIVENT prendre une Arme Spéciale »),
      // il apparaît donc aussi sur la fiche.
      if (!val && !opt.obligatoire) continue; // indice 0 = conserver
      const choix = opt.choix[val];
      const cible = choix.remplace || opt.remplace;
      if (!opt.ajoute && cible) retirer(cible);
      // prefixeFiche : précise qui porte l'objet dans une escouade
      // (ex : "Sergent : Arme énergétique").
      equip.push((opt.prefixeFiche || "") + nomCourt(choix.nom));
    } else if (opt.type === "case") {
      if (val && opt.ajoute) equip.push(opt.ajoute);
    } else if (opt.type === "paire") {
      if (val) {
        opt.remplaceListe.forEach(retirer);
        equip.push(opt.ajoute);
      }
    } else if (opt.type === "multi") {
      for (const i of val) equip.push((opt.prefixe || "") + opt.choix[i].nom);
    } else if (opt.type === "quantite") {
      if (val > 0) equip.push(val + " × " + opt.ajoute);
    }
  }
  return equip;
}

/* Une option est-elle actuellement réalisable ? (grise le champ
   sinon). Exemples : la baïonnette exige de conserver le bolter ;
   la paire de griffes exige que bolter ET pistolet soient encore
   là ; le cyber-familier est interdit à la variante à Réacteurs ;
   `requiertAbsenceUnite: idUnite` interdit l'option tant que cette
   autre unité fait partie de la liste (ex : Khârn ne peut échanger
   La Trancheuse contre La Carnassière Reforgée que si Angron n'est
   pas dans la même Armée). */
function optionRealisable(unite, instance, opt) {
  if (!optionPermise(opt, instance)) return false;
  if (
    opt.requiertAbsenceUnite &&
    armee.some((i) => i.uniteId === opt.requiertAbsenceUnite)
  )
    return false;
  const equipSansElle = equipementFinal(unite, instance, opt.id);
  // requiertEquip est comparé en « contient » : "combi-bolter"
  // reconnaît aussi "Poing énergétique Gravis et combi-bolter".
  if (
    opt.requiertEquip &&
    !equipSansElle.some((e) => e.includes(opt.requiertEquip))
  )
    return false;
  if (
    opt.type === "choix" &&
    opt.remplace &&
    !equipSansElle.includes(opt.remplace)
  )
    return false;
  if (
    opt.type === "paire" &&
    !opt.remplaceListe.every((e) => equipSansElle.includes(e))
  )
    return false;
  return true;
}

// Coût total d'une instance : base + variante + figurines
// supplémentaires + options. `parFigurine: true` multiplie le
// coût d'une option par la taille de l'unité (ex : baïonnettes).
function coutInstance(unite, instance) {
  const nbFigurines = instance.effectif || 1;
  let total = unite.cout + unite.variantes[instance.variante].cout;
  if (unite.effectif) {
    total += (instance.effectif - unite.effectif.base) * unite.effectif.cout;
  }
  for (const opt of unite.options) {
    if (!optionPermise(opt, instance)) continue;
    const val = instance.valeurs[opt.id];
    if (opt.type === "choix")
      total += opt.choix[val].cout * (opt.parFigurine ? nbFigurines : 1);
    else if ((opt.type === "case" || opt.type === "paire") && val)
      total += opt.cout * (opt.parFigurine ? nbFigurines : 1);
    else if (opt.type === "multi")
      for (const i of val) total += opt.choix[i].cout;
    else if (opt.type === "quantite") total += val * opt.cout;
  }
  return total;
}

// Coût total de la liste.
function coutArmee() {
  return armee.reduce(
    (somme, inst) => somme + coutInstance(trouverUnite(inst.uniteId), inst),
    0,
  );
}

/* ----------------------------------------------------------
   PERSISTANCE (localStorage)
   ---------------------------------------------------------- */
function sauvegarder() {
  try {
    localStorage.setItem(CLE_STOCKAGE, JSON.stringify(armee));
  } catch {
    /* stockage indisponible (navigation privée…) : on ignore */
  }
}

function restaurer() {
  try {
    const brut = localStorage.getItem(CLE_STOCKAGE);
    if (!brut) return;
    const donnees = JSON.parse(brut);
    if (!Array.isArray(donnees)) return;
    // On revalide chaque entrée : les données du navigateur ne sont
    // jamais considérées comme sûres (elles ont pu être altérées).
    for (const entree of donnees) {
      const unite = trouverUnite(entree.uniteId);
      if (!unite) continue;
      // uid stable d'une session à l'autre : l'organigramme
      // (js/organigramme.js) référence les unités par cet uid dans
      // sa propre sauvegarde. On refuse les doublons (données
      // altérées) en retombant sur un uid neuf.
      let uid =
        Number.isInteger(entree.uid) && entree.uid > 0
          ? entree.uid
          : ++compteurUid;
      if (armee.some((i) => i.uid === uid)) uid = ++compteurUid;
      compteurUid = Math.max(compteurUid, uid);
      const instance = {
        uid,
        uniteId: unite.id,
        variante:
          Number.isInteger(entree.variante) && unite.variantes[entree.variante]
            ? entree.variante
            : 0,
        effectif: unite.effectif
          ? Number.isInteger(entree.effectif)
            ? Math.min(
                unite.effectif.max,
                Math.max(unite.effectif.base, entree.effectif),
              )
            : unite.effectif.base
          : null,
        valeurs: valeursParDefaut(unite),
      };
      for (const opt of unite.options) {
        const v = entree.valeurs ? entree.valeurs[opt.id] : undefined;
        if (opt.type === "choix" && Number.isInteger(v) && opt.choix[v])
          instance.valeurs[opt.id] = v;
        else if (
          (opt.type === "case" || opt.type === "paire") &&
          typeof v === "boolean"
        )
          instance.valeurs[opt.id] = v;
        else if (opt.type === "multi" && Array.isArray(v))
          instance.valeurs[opt.id] = v
            .filter((i) => Number.isInteger(i) && opt.choix[i])
            .slice(0, opt.max);
        else if (opt.type === "quantite" && Number.isInteger(v) && v >= 0)
          instance.valeurs[opt.id] = v; // ramené au budget par actualiserCarte
      }
      armee.push(instance);
    }
  } catch {
    /* JSON invalide : on repart d'une liste vide */
  }
}

/* ----------------------------------------------------------
   RENDU — la fabrique DOM el() (textContent uniquement, anti-XSS)
   est partagée avec js/organigramme.js : voir js/main.js.
   ---------------------------------------------------------- */

// Libellé d'un coût : "Gratuit", "+5 pts"…
function libelleCout(cout) {
  return cout > 0 ? "+" + cout + " pts" : "Gratuit";
}

/* ----------------------------------------------------------
   BONUS D'AVANTAGES PRINCIPAUX SUR LE PROFIL (p. 283)
   Maître-sergent, Vétérans de Combat et Parangon de Bataille
   modifient concrètement les caractéristiques affichées sur la
   fiche récap. js/organigramme.js reste seul responsable de la
   légalité du choix (avantagesPossibles) ; ici on ne fait
   qu'appliquer le texte de l'avantage aux chiffres du profil.
   ---------------------------------------------------------- */

// Sous-types de la ligne de profil nomLigne ("Sergent", "Légionnaire"…),
// lus dans variante.type. Pour un profil à une seule figurine
// (nomLigne === null), c'est le type entier de la variante qui fait foi.
// Format d'un type à plusieurs figurines :
// "Sergent : Infanterie (Sergent) · Légionnaire : Infanterie".
function sousTypesLigne(variante, nomLigne) {
  if (nomLigne === null) return variante.type;
  for (const segment of variante.type.split("·")) {
    const separateur = segment.indexOf(" : ");
    if (separateur === -1) continue;
    if (segment.slice(0, separateur).trim() === nomLigne) {
      return segment.slice(separateur + 3);
    }
  }
  return "";
}

// Bonus (nombre) qu'un Avantage Principal apporte à une caractéristique
// d'une ligne de profil donnée, 0 si l'avantage ne s'applique pas ici.
function bonusAvantagePrincipal(avantageId, variante, nomLigne, car) {
  if (avantageId === "veterans-combat") {
    // Toutes les figurines de l'unité (p. 283) : Cd, Sf, Vo, Int.
    return ["Cd", "Sf", "Vo", "Int"].includes(car) ? 1 : 0;
  }
  if (avantageId === "maitre-sergent") {
    if (!sousTypesLigne(variante, nomLigne).includes("Sergent")) return 0;
    if (car === "A" || car === "CC") return 1;
    // Gagne aussi le Sous-type Champion ; s'il l'a déjà, +1 Cd de plus
    // à la place (le Sous-type ne peut pas être gagné deux fois).
    if (car === "Cd") {
      return sousTypesLigne(variante, nomLigne).includes("Champion") ? 2 : 1;
    }
    return 0;
  }
  if (avantageId === "parangon-bataille") {
    if (!sousTypesLigne(variante, nomLigne).includes("État-major")) return 0;
    return car === "A" || car === "CC" || car === "CT" ? 1 : 0;
  }
  return 0;
}

// Applique le bonus à une valeur de caractéristique (seules M, CC, CT,
// F, E, PV, I, A, Cd, Sf, Vo, Int sont numériques ; Sv/Inv, en chaîne,
// ne reçoivent jamais de bonus). Vétérans de Combat plafonne à 10.
function appliquerBonusPrincipal(avantageId, variante, nomLigne, car, valeur) {
  const bonus = bonusAvantagePrincipal(avantageId, variante, nomLigne, car);
  if (bonus === 0 || typeof valeur !== "number") return valeur;
  const plafond = avantageId === "veterans-combat" ? 10 : Infinity;
  return Math.min(plafond, valeur + bonus);
}

// Table de profil (infanterie ou véhicule) de la variante choisie.
function construireTableProfil(unite, instance) {
  const variante = unite.variantes[instance.variante];
  const avantageId =
    orgaPret && window.Organigramme
      ? window.Organigramme.avantageDe(instance.uid)
      : "aucun";
  const conteneur = el("div", "table-scroll");
  const table = el("table", "table-profil");
  const enTete = document.createElement("thead");
  const corps = document.createElement("tbody");
  const ligneTitres = document.createElement("tr");

  /* Trois formes de profil :
     - véhicule (profilVehicule) : colonnes blindage, une ligne ;
     - escouade (profils)        : une ligne par profil, libellée
       (ex : Légionnaire / Sergent) ;
     - figurine seule (profil)   : une ligne sans libellé. */
  let entetes;
  let lignes; // [{ libelle: string|null, valeurs: [...] }]
  if (variante.profilVehicule) {
    const p = variante.profilVehicule;
    entetes = ENTETES_VEHICULE;
    lignes = [
      {
        libelle: null,
        valeurs: [p.M, p.CT, p.avant, p.flanc, p.arriere, p.PC, p.transport],
      },
    ];
  } else if (variante.profils) {
    entetes = [""].concat(ENTETES_PROFIL);
    lignes = variante.profils.map((p) => ({
      libelle: p.nom,
      valeurs: ENTETES_PROFIL.map((c) =>
        appliquerBonusPrincipal(avantageId, variante, p.nom, c, p.profil[c]),
      ),
    }));
  } else {
    entetes = ENTETES_PROFIL;
    lignes = [
      {
        libelle: null,
        valeurs: ENTETES_PROFIL.map((c) =>
          appliquerBonusPrincipal(
            avantageId,
            variante,
            null,
            c,
            variante.profil[c],
          ),
        ),
      },
    ];
  }
  for (const titre of entetes) {
    const th = document.createElement("th");
    th.scope = "col";
    th.textContent = titre;
    ligneTitres.appendChild(th);
  }
  lignes.forEach((ligne, indiceLigne) => {
    const tr = document.createElement("tr");
    if (ligne.libelle !== null) {
      const th = document.createElement("th");
      th.scope = "row";
      th.textContent = ligne.libelle;
      tr.appendChild(th);
    }
    const nomLigne = variante.profils ? ligne.libelle : null;
    ligne.valeurs.forEach((v, indiceCol) => {
      // Les bonus d'Avantages Principaux ne portent que sur des
      // caractéristiques d'infanterie (A, CC, Cd, CT) : les colonnes
      // de profilVehicule n'ont pas la même signification à index égal.
      const car = variante.profilVehicule ? null : ENTETES_PROFIL[indiceCol];
      const td = el("td", null, String(v));
      if (
        car &&
        bonusAvantagePrincipal(avantageId, variante, nomLigne, car) !== 0
      ) {
        const avantage = AVANTAGES_PRINCIPAUX.find((a) => a.id === avantageId);
        td.className = "profil-bonus";
        if (avantage) td.title = "Bonus « " + avantage.nom + " »";
      }
      tr.appendChild(td);
    });
    corps.appendChild(tr);
  });
  enTete.appendChild(ligneTitres);
  table.appendChild(enTete);
  table.appendChild(corps);
  conteneur.appendChild(table);
  return conteneur;
}

// Bloc « Étiquette : valeur, valeur… » de la fiche récap.
function construireLigneFiche(titre, elements) {
  const p = el("p", "fiche-ligne");
  p.appendChild(el("strong", null, titre + " : "));
  p.appendChild(document.createTextNode(elements.join(" · ")));
  return p;
}

/* ----------------------------------------------------------
   RÈGLES SPÉCIALES ET TRAITS D'UNITÉS (js/regles-data.js) — les
   lignes "Règles spéciales" et "Traits" de la fiche récap habillent
   chaque entrée reconnue d'une info-bulle reprenant sa définition,
   exactement comme la colonne "Règles spéciales" des tables d'armes
   (page armes.html). La recherche de définition
   (trouverDefinitionRegle) est partagée : voir js/main.js. Certaines
   entrées n'ont pas de définition connue (ex : "Aucune", ou des
   traits encore non documentés comme "Psyker") — le texte reste
   alors affiché tel quel, sans info-bulle.
   ---------------------------------------------------------- */

// Comme construireLigneFiche, mais pour une liste de règles/traits :
// habille chaque entrée reconnue d'un .regle-tag portant sa définition
// (voir ci-dessus). Utilisée pour les lignes "Règles spéciales" et
// "Traits" de la fiche récap.
function construireLigneRegles(titre, regles) {
  const p = el("p", "fiche-ligne");
  p.appendChild(el("strong", null, titre + " : "));
  regles.forEach((regle, i) => {
    if (i > 0) p.appendChild(document.createTextNode(" · "));
    const definition = trouverDefinitionRegle(regle);
    if (!definition) {
      p.appendChild(document.createTextNode(regle));
      return;
    }
    const tag = el("span", "regle-tag", regle);
    tag.tabIndex = 0;
    tag.appendChild(el("span", "tooltip", definition));
    p.appendChild(tag);
  });
  return p;
}

/* ----------------------------------------------------------
   CARACTÉRISTIQUES D'ARMES (js/armes-data.js) — affichées sur la
   fiche récap sous forme de table (une par jeu d'en-têtes rencontré :
   Tir ENTETES_TIR / Mêlée ENTETES_MELEE), au même titre que la table
   de profil de l'unité : ainsi visibles à l'impression, contrairement
   à une info-bulle qui n'apparaît qu'au survol.
   Correspondance par sous-chaîne (insensible à la casse, nom le
   plus long d'abord pour préférer « Bolter lourd » à « Bolter ») :
   certains noms d'armes propres aux véhicules ne correspondent pas
   exactement à l'Arsenal (pluriels, montage spécifique) — dans ce
   cas l'arme n'apparaît simplement dans aucune table.
   ---------------------------------------------------------- */
let indexArmes = null;

// Échappe les caractères spéciaux d'une regex (certains noms d'armes
// portent des parenthèses, astérisques ou points, ex : « Obus à
// phosphex* », « Canon à conversion (< 15 pas) »).
function echapperRegex(texte) {
  return texte.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Motif de recherche tolérant au pluriel français régulier : les
// options d'équipement écrivent souvent « Deux couleuvrines volkites
// Latérales », qui doit tout de même reconnaître l'arme « Couleuvrine
// volkite » de l'Arsenal. Chaque espace du nom devient "s? " dans le
// motif (un « s » optionnel avant l'espace), et un « s » final
// optionnel est toléré après le dernier mot.
function construireRegexArme(nomMinuscule) {
  return new RegExp(echapperRegex(nomMinuscule).split(" ").join("s? ") + "s?");
}

// Certaines armes de l'Arsenal ont plusieurs profils au tir partageant
// le même montage : munitions ou cadence différentes après un tiret
// cadratin (« Obusier Kratos — Obus HE » / « — Obus PA » / « — Obus
// Brûleurs* », « Fusil à plasma — Tir soutenu » / « — Tir maximal »),
// ou bande de portée entre parenthèses (« Canon à conversion lourd
// (< 15 pas) » / « (15-30 pas) » / « (> 30-45 pas) »). Le nom affiché
// sur la fiche d'unité ne mentionne que le montage lui-même (« Obusier
// Kratos de Tourelle », « Fusil à plasma », « Canon à conversion lourd
// de Tourelle »), jamais le profil précis. `nomBase` (débarrassé du
// tiret et de la parenthèse finale) sert donc à la fois à la recherche
// dans l'équipement et à regrouper tous les profils d'un même montage
// dans la table de caractéristiques (voir construireTablesArmes).
function construireIndexArmes() {
  const index = [];
  const ajouter = (categories, entetes) => {
    for (const categorie of categories) {
      for (const arme of categorie.armes) {
        const separateur = arme.nom.indexOf(" — ");
        const nomBase = (separateur === -1 ? arme.nom : arme.nom.slice(0, separateur))
          .replace(/\s*\([^)]*\)\s*$/, "");
        index.push({
          nom: arme.nom,
          nomBase,
          entetes,
          stats: arme.stats,
          regles: arme.regles,
          traits: arme.traits,
          regex: construireRegexArme(nomBase.toLowerCase()),
        });
      }
    }
  };
  if (typeof ARMES_TIR !== "undefined") ajouter(ARMES_TIR, ENTETES_TIR);
  if (typeof ARMES_MELEE !== "undefined") ajouter(ARMES_MELEE, ENTETES_MELEE);
  index.sort((a, b) => b.nomBase.length - a.nomBase.length);
  return index;
}

// Cherche l'arme de l'Arsenal la plus pertinente apparaissant dans
// `texte` : l'occurrence la plus à gauche l'emporte (le nom de l'arme
// réellement équipée vient toujours avant tout texte parenthétique
// du type « (à la place de… ) »), et à position égale, le nom le plus
// long l'emporte (« Bolter lourd » plutôt que « Bolter »).
// Retourne { avant, trouve, apres, arme } (segments pour reconstruire
// le texte autour du nom d'arme) ou null si aucune arme ne correspond.
function trouverArmeDansTexte(texte) {
  if (!indexArmes) indexArmes = construireIndexArmes();
  const brut = texte.toLowerCase();
  let meilleur = null;
  for (const arme of indexArmes) {
    const correspondance = arme.regex.exec(brut);
    if (!correspondance) continue;
    const i = correspondance.index;
    if (
      !meilleur ||
      i < meilleur.i ||
      (i === meilleur.i && arme.nom.length > meilleur.arme.nom.length)
    ) {
      meilleur = { i, longueur: correspondance[0].length, arme };
    }
  }
  if (!meilleur) return null;
  const { i, longueur, arme } = meilleur;
  return {
    avant: texte.slice(0, i),
    trouve: texte.slice(i, i + longueur),
    apres: texte.slice(i + longueur),
    arme,
  };
}

// Cellule "Règles spéciales" d'une ligne d'arme : chaque règle est
// séparée par une virgule et habillée d'un .regle-tag portant sa
// définition (voir trouverDefinitionRegle dans js/main.js), exactement
// comme la colonne "Règles spéciales" des tables d'armes de l'Arsenal
// (page armes.html, voir construireCategorieArmes dans js/armes.js).
function construireCelluleReglesArme(regles) {
  const td = el("td", "gauche");
  if (!regles || regles === "-") {
    td.textContent = "-";
    return td;
  }
  regles.split(",").forEach((token, i) => {
    const intitule = token.trim();
    if (i > 0) td.appendChild(document.createTextNode(", "));
    const definition = trouverDefinitionRegle(intitule);
    if (!definition) {
      td.appendChild(document.createTextNode(intitule));
      return;
    }
    const tag = el("span", "regle-tag", intitule);
    tag.tabIndex = 0;
    tag.appendChild(el("span", "tooltip", definition));
    td.appendChild(tag);
  });
  return td;
}

// Table des caractéristiques d'un groupe d'armes partageant le même
// jeu d'en-têtes (Tir ou Mêlée), sur le modèle de construireTableProfil.
function construireTableArmes(entetes, armes) {
  const conteneur = el("div", "table-scroll");
  const table = el("table", "table-profil table-armes");
  const enTete = document.createElement("thead");
  const corps = document.createElement("tbody");
  const ligneTitres = document.createElement("tr");

  const thArme = document.createElement("th");
  thArme.scope = "col";
  thArme.className = "gauche";
  thArme.textContent = "Arme";
  ligneTitres.appendChild(thArme);
  for (const titre of entetes.concat(["Règles spéciales", "Traits"])) {
    const th = document.createElement("th");
    th.scope = "col";
    if (titre === "Règles spéciales" || titre === "Traits")
      th.className = "gauche";
    th.textContent = titre;
    ligneTitres.appendChild(th);
  }
  enTete.appendChild(ligneTitres);
  table.appendChild(enTete);

  for (const arme of armes) {
    const tr = document.createElement("tr");
    const th = document.createElement("th");
    th.scope = "row";
    th.className = "gauche";
    th.textContent = arme.nom;
    tr.appendChild(th);
    for (const valeur of arme.stats) tr.appendChild(el("td", null, valeur));
    tr.appendChild(construireCelluleReglesArme(arme.regles));
    tr.appendChild(
      el(
        "td",
        "gauche",
        arme.traits && arme.traits !== "-" ? arme.traits : "-",
      ),
    );
    corps.appendChild(tr);
  }
  table.appendChild(corps);
  conteneur.appendChild(table);
  return conteneur;
}

// Repère, dans l'équipement final, les armes reconnues dans l'Arsenal
// (sans doublon, dans l'ordre d'apparition) et construit une table de
// caractéristiques par jeu d'en-têtes rencontré (Tir / Mêlée).
function construireTablesArmes(equipement) {
  const fragment = document.createDocumentFragment();
  const armesTrouvees = [];
  const noms = new Set();
  for (const texte of equipement) {
    const correspondance = trouverArmeDansTexte(texte);
    if (!correspondance) continue;
    // Un montage identifié entraîne tous ses profils (voir
    // construireIndexArmes), pas seulement celui retenu par
    // trouverArmeDansTexte pour la correspondance.
    const nomBaseMinuscule = correspondance.arme.nomBase.toLowerCase();
    for (const arme of indexArmes) {
      if (arme.nomBase.toLowerCase() !== nomBaseMinuscule) continue;
      if (noms.has(arme.nom)) continue;
      noms.add(arme.nom);
      armesTrouvees.push(arme);
    }
  }

  const groupes = [];
  for (const arme of armesTrouvees) {
    let groupe = groupes.find((g) => g.entetes === arme.entetes);
    if (!groupe) {
      groupe = { entetes: arme.entetes, armes: [] };
      groupes.push(groupe);
    }
    groupe.armes.push(arme);
  }
  for (const groupe of groupes) {
    fragment.appendChild(construireTableArmes(groupe.entetes, groupe.armes));
  }
  return fragment;
}

// Bloc « Définitions », réservé à l'impression (voir .unite-fiche-
// definitions dans css/style.css) : reprend en texte visible la
// définition de chaque règle spéciale et trait de la fiche (unité et
// armes), autrement accessible seulement en info-bulle au survol/
// focus — donc invisible sur une fiche imprimée. Repère les .regle-
// tag déjà posés par construireLigneRegles/construireCelluleReglesArme
// plutôt que de refaire la recherche de définition.
function construireDefinitions(fiche) {
  const definitions = new Map();
  fiche.querySelectorAll(".regle-tag").forEach((tag) => {
    const bulle = tag.querySelector(".tooltip");
    if (!bulle || !tag.firstChild) return;
    const nom = tag.firstChild.textContent;
    if (!definitions.has(nom)) definitions.set(nom, bulle.textContent);
  });
  if (definitions.size === 0) return null;

  const bloc = el("div", "unite-fiche-definitions");
  bloc.appendChild(el("p", "unite-definitions-titre", "Définitions"));
  const liste = document.createElement("ul");
  for (const [nom, texte] of definitions) {
    const li = document.createElement("li");
    li.appendChild(el("strong", null, nom + " — "));
    li.appendChild(document.createTextNode(texte));
    liste.appendChild(li);
  }
  bloc.appendChild(liste);
  return bloc;
}

// Partie « fiche récap » d'une carte (reconstruite à chaque changement).
function construireFiche(unite, instance) {
  const fiche = el("div", "unite-fiche");
  const variante = unite.variantes[instance.variante];

  fiche.appendChild(construireTableProfil(unite, instance));
  if (unite.effectif) {
    fiche.appendChild(
      construireLigneFiche("Effectif", [
        instance.effectif + " " + (unite.effectif.suffixe || "figurines"),
      ]),
    );
  }
  const equipement = equipementFinal(unite, instance);
  fiche.appendChild(
    construireLigneFiche(unite.equipementLibelle || "Équipement", equipement),
  );
  fiche.appendChild(construireTablesArmes(equipement));
  // [Allégeance] et [Legiones Astartes] sont communs à toutes les
  // unités de la Légion : ne pas les afficher sur la fiche évite de
  // les y répéter systématiquement. La ligne disparaît s'il ne reste
  // aucun trait propre à l'unité.
  const traitsAffiches = unite.traits.filter(
    (trait) => trait !== "[Allégeance]" && trait !== "[Legiones Astartes]",
  );
  if (traitsAffiches.length > 0) {
    fiche.appendChild(construireLigneRegles("Traits", traitsAffiches));
  }
  fiche.appendChild(construireLigneRegles("Règles spéciales", variante.regles));
  fiche.appendChild(construireLigneFiche("Type", [variante.type]));
  if (unite.notes)
    fiche.appendChild(construireLigneFiche("Notes", [unite.notes]));
  const definitions = construireDefinitions(fiche);
  if (definitions) fiche.appendChild(definitions);
  return fiche;
}

/* Options devenues irréalisables (on les remet à zéro) puis champs du
   formulaire (valeur + grisé) synchronisés en conséquence. Factorisé
   hors d'actualiserCarte : une option peut devenir irréalisable suite
   à un changement sur UNE AUTRE carte (ex : `requiertAbsenceUnite` —
   l'option de Khârn dépend de la présence d'Angron dans la liste), pas
   seulement suite à une interaction sur sa propre carte — voir l'appel
   depuis actualiserSelectsCases. */
function synchroniserConfig(carte, unite, instance) {
  // 1. Options devenues irréalisables : on les remet à zéro.
  for (const opt of unite.options) {
    if (optionRealisable(unite, instance, opt)) continue;
    if (opt.type === "choix") instance.valeurs[opt.id] = 0;
    else if (opt.type === "multi") instance.valeurs[opt.id] = [];
    else if (opt.type === "quantite") instance.valeurs[opt.id] = 0;
    else instance.valeurs[opt.id] = false;
  }

  // 1 bis. Quantités : si l'effectif a diminué, on ramène chaque
  // option au budget « par tranche de cinq figurines ».
  for (const opt of unite.options) {
    if (opt.type !== "quantite") continue;
    const debordement =
      quantiteUtilisee(unite, instance, opt) -
      budgetQuantite(unite, instance, opt);
    if (debordement > 0) {
      instance.valeurs[opt.id] = Math.max(
        0,
        instance.valeurs[opt.id] - debordement,
      );
    }
  }

  // 2. Synchronise les champs du formulaire (valeur + grisé).
  for (const opt of unite.options) {
    const realisable = optionRealisable(unite, instance, opt);
    if (opt.type === "choix") {
      const select = carte.querySelector("#opt-" + instance.uid + "-" + opt.id);
      select.value = String(instance.valeurs[opt.id]);
      select.disabled = !realisable;
    } else if (opt.type === "multi") {
      const cases = carte.querySelectorAll("[data-multi='" + opt.id + "']");
      const cochees = instance.valeurs[opt.id];
      cases.forEach((c) => {
        const indice = Number(c.value);
        c.checked = cochees.includes(indice);
        // Limite « jusqu'à max » : on grise les cases non cochées
        // quand le quota est atteint.
        c.disabled = !realisable || (!c.checked && cochees.length >= opt.max);
      });
    } else if (opt.type === "quantite") {
      const champ = carte.querySelector("#opt-" + instance.uid + "-" + opt.id);
      const budget = budgetQuantite(unite, instance, opt);
      const dispo = budget - quantiteUtilisee(unite, instance, opt);
      champ.value = String(instance.valeurs[opt.id]);
      // max dynamique : sa propre valeur + ce qui reste du budget
      // (partagé avec les autres options du même groupe).
      champ.max = String(instance.valeurs[opt.id] + Math.max(0, dispo));
      champ.disabled = !realisable || budget === 0;
    } else {
      const caseACocher = carte.querySelector(
        "#opt-" + instance.uid + "-" + opt.id,
      );
      caseACocher.checked = instance.valeurs[opt.id];
      caseACocher.disabled = !realisable;
    }
  }
}

/* Met à jour ce qui dépend des valeurs : points de la carte,
   fiche récap, champs grisés, total général. Appelée après
   chaque interaction, sans reconstruire le formulaire (les
   menus déroulants gardent ainsi leur état et le focus). */
function actualiserCarte(carte, unite, instance) {
  synchroniserConfig(carte, unite, instance);

  // 3. Fiche récap et coût de l'unité.
  const ancienneFiche = carte.querySelector(".unite-fiche");
  ancienneFiche.replaceWith(construireFiche(unite, instance));
  carte.querySelector(".unite-points").textContent =
    coutInstance(unite, instance) + " pts";
  // Les .regle-tag des règles spéciales viennent d'être créées : on
  // relance le câblage d'accessibilité des info-bulles (voir js/main.js).
  if (window.cablerInfoBulles) window.cablerInfoBulles(carte);

  // 4. Total général + sauvegarde.
  actualiserTotal();
  sauvegarder();
}

// Formulaire de configuration d'une carte (construit une seule fois).
function construireConfig(carte, unite, instance) {
  const config = el("div", "unite-config");

  // --- Taille de l'unité (escouades) ---
  if (unite.effectif) {
    const groupe = el("fieldset", "unite-variantes");
    groupe.appendChild(el("legend", null, "Effectif"));
    const ligne = el("div", "option-ligne");
    const label = el(
      "label",
      null,
      // libelle personnalisable (ex : « Équipages de Rapier »)
      unite.effectif.libelle ||
        "Nombre de figurines (+" +
          unite.effectif.cout +
          " pts par figurine au-delà de " +
          unite.effectif.base +
          ")",
    );
    const champ = document.createElement("input");
    champ.type = "number";
    champ.id = "effectif-" + instance.uid;
    champ.min = String(unite.effectif.base);
    champ.max = String(unite.effectif.max);
    champ.value = String(instance.effectif);
    label.htmlFor = champ.id;
    champ.addEventListener("change", () => {
      let v = Number(champ.value);
      if (!Number.isInteger(v)) v = unite.effectif.base;
      v = Math.min(unite.effectif.max, Math.max(unite.effectif.base, v));
      instance.effectif = v;
      champ.value = String(v);
      actualiserCarte(carte, unite, instance);
    });
    ligne.appendChild(label);
    ligne.appendChild(champ);
    groupe.appendChild(ligne);
    config.appendChild(groupe);
  }

  // --- Choix de la variante (si l'unité en propose plusieurs) ---
  if (unite.variantes.length > 1) {
    const groupe = el("fieldset", "unite-variantes");
    groupe.appendChild(el("legend", null, "Variante"));
    unite.variantes.forEach((variante, indice) => {
      const label = el("label", "option-ligne");
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "variante-" + instance.uid;
      radio.value = String(indice);
      radio.checked = instance.variante === indice;
      radio.addEventListener("change", () => {
        instance.variante = indice;
        actualiserCarte(carte, unite, instance);
      });
      label.appendChild(radio);
      label.appendChild(
        document.createTextNode(
          " " +
            variante.nom +
            (variante.cout > 0 ? " (+" + variante.cout + " pts)" : ""),
        ),
      );
      groupe.appendChild(label);
    });
    config.appendChild(groupe);
  }

  // --- Options d'armement / d'équipement ---
  if (unite.options.length > 0) {
    const groupe = el("fieldset", "unite-options");
    groupe.appendChild(el("legend", null, "Options"));

    for (const opt of unite.options) {
      if (opt.type === "choix") {
        const ligne = el("div", "option-ligne");
        const label = el("label", null, opt.libelle);
        const select = document.createElement("select");
        select.id = "opt-" + instance.uid + "-" + opt.id;
        label.htmlFor = select.id;
        opt.choix.forEach((choix, indice) => {
          const optionHtml = document.createElement("option");
          optionHtml.value = String(indice);
          optionHtml.textContent =
            indice === 0 && !opt.obligatoire
              ? nomCourt(choix.nom)
              : nomCourt(choix.nom) +
                " — " +
                libelleCout(choix.cout) +
                (opt.parFigurine && choix.cout > 0 ? "/figurine" : "");
          select.appendChild(optionHtml);
        });
        select.addEventListener("change", () => {
          instance.valeurs[opt.id] = Number(select.value);
          actualiserCarte(carte, unite, instance);
        });
        ligne.appendChild(label);
        ligne.appendChild(select);
        groupe.appendChild(ligne);
      } else if (opt.type === "multi") {
        const sousGroupe = el("div", "option-ligne");
        sousGroupe.appendChild(el("p", "option-multi-titre", opt.libelle));
        opt.choix.forEach((choix, indice) => {
          const label = el("label", "option-multi-case");
          const caseACocher = document.createElement("input");
          caseACocher.type = "checkbox";
          caseACocher.value = String(indice);
          caseACocher.dataset.multi = opt.id;
          caseACocher.addEventListener("change", () => {
            const liste = instance.valeurs[opt.id];
            if (caseACocher.checked) liste.push(indice);
            else liste.splice(liste.indexOf(indice), 1);
            actualiserCarte(carte, unite, instance);
          });
          label.appendChild(caseACocher);
          label.appendChild(
            document.createTextNode(
              " " + choix.nom + " — " + libelleCout(choix.cout),
            ),
          );
          sousGroupe.appendChild(label);
        });
        groupe.appendChild(sousGroupe);
      } else if (opt.type === "quantite") {
        // Nombre de figurines de l'escouade prenant cet échange
        // (budget « par tranche de cinq » géré par actualiserCarte).
        const ligne = el("div", "option-ligne");
        const label = el(
          "label",
          null,
          opt.libelle +
            " — " +
            libelleCout(opt.cout) +
            (opt.cout > 0 ? " par figurine" : ""),
        );
        const champ = document.createElement("input");
        champ.type = "number";
        champ.id = "opt-" + instance.uid + "-" + opt.id;
        champ.min = "0";
        label.htmlFor = champ.id;
        champ.addEventListener("change", () => {
          let v = Number(champ.value);
          if (!Number.isInteger(v) || v < 0) v = 0;
          instance.valeurs[opt.id] = v;
          actualiserCarte(carte, unite, instance);
        });
        ligne.appendChild(label);
        ligne.appendChild(champ);
        groupe.appendChild(ligne);
      } else {
        // "case" et "paire" : simple case à cocher.
        const label = el("label", "option-ligne");
        const caseACocher = document.createElement("input");
        caseACocher.type = "checkbox";
        caseACocher.id = "opt-" + instance.uid + "-" + opt.id;
        caseACocher.addEventListener("change", () => {
          instance.valeurs[opt.id] = caseACocher.checked;
          actualiserCarte(carte, unite, instance);
        });
        label.appendChild(caseACocher);
        label.appendChild(
          document.createTextNode(
            " " +
              opt.libelle +
              " — " +
              libelleCout(opt.cout) +
              (opt.parFigurine && opt.cout > 0 ? "/figurine" : ""),
          ),
        );
        groupe.appendChild(label);
      }
    }
    config.appendChild(groupe);
  }
  return config;
}

// Carte complète d'une unité de la liste.
function construireCarte(instance) {
  const unite = trouverUnite(instance.uniteId);
  const carte = el("article", "unite-carte");
  carte.id = "unite-" + instance.uid;

  // --- En-tête : nom, coût, bouton retirer ---
  const entete = el("header", "unite-carte-entete");
  const titre = el("h3", null, unite.nom);
  const points = el(
    "span",
    "unite-points",
    coutInstance(unite, instance) + " pts",
  );
  const retirer = el("button", "unite-retirer", "Retirer");
  retirer.type = "button";
  retirer.setAttribute("aria-label", "Retirer " + unite.nom + " de la liste");
  retirer.addEventListener("click", () => {
    armee = armee.filter((i) => i.uid !== instance.uid);
    carte.remove();
    sauvegarder();
    // Libère la Case de l'Organigramme de Force qu'occupait l'unité
    // (et revalide les déblocages : un détachement débloqué par cette
    // unité devient invalide et est signalé — voir validerArmee).
    Organigramme.libererEtActualiser(instance.uid);
    actualiserTotal();
  });

  // Repli/dépli : la fiche démarre repliée (seul l'en-tête est visible)
  // pour faciliter le survol de longues listes ; un clic déplie la
  // configuration et la fiche récap. Ignoré à l'impression (voir CSS).
  const bascule = el("button", "unite-bascule", "▸ Détails");
  bascule.type = "button";
  bascule.setAttribute("aria-expanded", "false");
  bascule.setAttribute("aria-label", "Déplier la fiche de " + unite.nom);
  bascule.addEventListener("click", () => {
    const repliee = carte.classList.toggle("unite-carte--repliee");
    bascule.textContent = repliee ? "▸ Détails" : "▾ Réduire";
    bascule.setAttribute("aria-expanded", String(!repliee));
    bascule.setAttribute(
      "aria-label",
      (repliee ? "Déplier" : "Replier") + " la fiche de " + unite.nom,
    );
  });
  entete.appendChild(titre);
  entete.appendChild(points);
  entete.appendChild(bascule);
  entete.appendChild(retirer);
  carte.appendChild(entete);
  carte.classList.add("unite-carte--repliee");

  // --- Case occupée dans l'Organigramme de Force (p. 282) ---
  // Le menu permet d'annuler/modifier le placement sans casser la
  // cohérence : les options sont recalculées par actualiserSelectsCases.
  const affectation = el("div", "unite-affectation");
  const labelCase = el("label", null, "Case occupée ");
  const selectCase = document.createElement("select");
  selectCase.className = "unite-case-select";
  selectCase.id = "case-" + instance.uid;
  labelCase.htmlFor = selectCase.id;
  selectCase.addEventListener("change", () => {
    const [detUid, indice] = selectCase.value.split(":").map(Number);
    if (
      !selectCase.value ||
      !Organigramme.assigner(instance.uid, detUid, indice)
    ) {
      actualiserSelectsCases(); // placement refusé : on resynchronise
    }
  });
  affectation.appendChild(labelCase);
  affectation.appendChild(selectCase);
  carte.appendChild(affectation);

  carte.appendChild(
    el("p", "unite-composition", "Composition d'unité : " + unite.composition),
  );
  carte.appendChild(construireConfig(carte, unite, instance));
  carte.appendChild(construireFiche(unite, instance));

  // Synchronise les champs restaurés depuis localStorage
  // (valeurs + grisés), sans double sauvegarde inutile.
  actualiserCarte(carte, unite, instance);
  return carte;
}

/* ----------------------------------------------------------
   TOTAL GÉNÉRAL + INITIALISATION
   ---------------------------------------------------------- */

// Met à jour le SEUL texte du total (« 3 unités — Total : 450 Points »).
// Factorisé : utilisé par actualiserTotal (avec revalidation de
// l'organigramme) et par retirerInstance (sans revalidation, car c'est
// l'organigramme lui-même qui pilote alors la suppression).
function majTexteTotal() {
  const total = document.getElementById("total-armee");
  const nb = armee.length;
  total.textContent =
    nb === 0
      ? "Aucune unité dans la liste."
      : nb +
        (nb > 1 ? " unités" : " unité") +
        " — Total : " +
        coutArmee() +
        " Points";
}

function actualiserTotal() {
  majTexteTotal();
  // Les points conditionnent les quotas (25 % Seigneurs, 50 % Alliés,
  // limite de la partie) : on fait revalider l'organigramme. Le garde
  // orgaPret évite l'appel pendant la restauration initiale.
  if (orgaPret) Organigramme.actualiser();
}

/* ----------------------------------------------------------
   AFFECTATION AUX CASES DE L'ORGANIGRAMME
   Chaque carte porte un menu « Case » listant sa case actuelle et
   toutes les cases libres compatibles (Rôle Tactique identique, ou
   Case Principale d'État-major via Affectation Spéciale pour un QG
   — la compatibilité est calculée par js/organigramme.js). Une
   unité sans case (ancienne liste restaurée, détachement supprimé)
   est signalée en erreur : les règles imposent qu'une unité occupe
   une Case de l'Organigramme de Force (p. 282).
   ---------------------------------------------------------- */
// Tant qu'aucune Légion n'est choisie dans les paramètres de la partie
// (js/organigramme.js), les unités qui lui sont propres ne peuvent pas
// être identifiées (voir uniteAccessible) : on bloque donc la sélection
// d'unité en amont plutôt que de laisser un menu incomplet ou trompeur.
// Rappelé à chaque actualiserSelectsCases (callback surChangement de
// l'organigramme), donc à chaque changement de Légion.
function actualiserVerrouLegion() {
  const champUnite = document.getElementById("choix-unite");
  const boutonUnite = document.getElementById("choix-unite-bouton");
  const boutonUnite2 = document.getElementById("ajouter-unite");
  const legionChoisie = Organigramme.legionActuelle() !== "";
  champUnite.disabled = !legionChoisie;
  boutonUnite.disabled = !legionChoisie;
  boutonUnite2.disabled = !legionChoisie;
  if (!legionChoisie) {
    document.getElementById("choix-unite-liste").hidden = true;
    champUnite.setAttribute("aria-expanded", "false");
  }
  const messageAjout = document.getElementById("ajout-message");
  if (!legionChoisie) {
    messageAjout.textContent =
      "Choisissez d'abord une Légion dans les paramètres de la partie pour pouvoir ajouter des unités.";
    messageAjout.hidden = false;
  } else if (
    messageAjout.textContent ===
    "Choisissez d'abord une Légion dans les paramètres de la partie pour pouvoir ajouter des unités."
  ) {
    messageAjout.hidden = true;
  }
}

function actualiserSelectsCases() {
  actualiserVerrouLegion();
  for (const instance of armee) {
    const carte = document.getElementById("unite-" + instance.uid);
    if (!carte) continue;
    const select = carte.querySelector(".unite-case-select");
    if (!select) continue;
    const unite = trouverUnite(instance.uniteId);
    const actuelle = Organigramme.assignationDe(instance.uid);
    select.replaceChildren();
    if (!actuelle) {
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = "⚠ Non placée — choisir une case";
      select.appendChild(opt);
    }
    if (actuelle) {
      const opt = document.createElement("option");
      opt.value = actuelle.detUid + ":" + actuelle.indice;
      opt.textContent = actuelle.libelle;
      select.appendChild(opt);
    }
    for (const libre of Organigramme.casesLibresPour(unite)) {
      const opt = document.createElement("option");
      opt.value = libre.detUid + ":" + libre.indice;
      opt.textContent = libre.libelle;
      select.appendChild(opt);
    }
    select.value = actuelle ? actuelle.detUid + ":" + actuelle.indice : "";
    // Alerte visuelle : carte sans case = liste non conforme.
    carte.classList.toggle("unite-carte--sans-case", !actuelle);

    // Les options d'une carte peuvent dépendre d'une AUTRE carte (ex :
    // `requiertAbsenceUnite` — l'option de Khârn dépend de la présence
    // d'Angron dans la liste) : on resynchronise le formulaire ici,
    // pas seulement lors d'une interaction sur sa propre carte.
    synchroniserConfig(carte, unite, instance);

    // La fiche récap dépend elle aussi de l'Avantage Principal de la
    // case (bonus de Maître-sergent, Vétérans de Combat, Parangon de
    // Bataille) : on la reconstruit pour qu'elle reste à jour même
    // quand le changement vient d'ailleurs (une autre carte,
    // l'organigramme).
    const ancienneFiche = carte.querySelector(".unite-fiche");
    if (ancienneFiche)
      ancienneFiche.replaceWith(construireFiche(unite, instance));
    carte.querySelector(".unite-points").textContent =
      coutInstance(unite, instance) + " pts";
    if (window.cablerInfoBulles) window.cablerInfoBulles(carte);
  }
  // Le coût d'une unité a pu changer (option remise à zéro par
  // synchroniserConfig ci-dessus) : total à jour, sans redéclencher
  // Organigramme.actualiser (actualiserSelectsCases EST son callback
  // surChangement — le rappeler ici boucherait indéfiniment).
  majTexteTotal();
  sauvegarder();
}

// Retrait d'une instance à la demande de l'organigramme (suppression
// d'un détachement contenant des unités). Ne ré-actualise PAS
// l'organigramme : c'est lui qui pilote et actualisera ensuite.
function retirerInstance(uid) {
  armee = armee.filter((i) => i.uid !== uid);
  const carte = document.getElementById("unite-" + uid);
  if (carte) carte.remove();
  majTexteTotal();
  sauvegarder();
}

/* ----------------------------------------------------------
   TÉLÉCHARGEMENT DE LA LISTE (PDF et Word)
   Plutôt que de rejouer toute la logique de coût/équipement, on
   relit directement le DOM déjà construit (cartes + résumé de
   l'organigramme) et on le restructure en blocs typés
   ({type:"table"|"ligne"|"definitions", …}) : le PDF et le Word
   restent ainsi toujours fidèles à l'écran/l'impression (fiche au
   format « carte d'unité », sur le modèle d'une fiche officielle),
   sans double maintenance. .textContent fonctionne même sur une
   fiche repliée (display:none n'empêche pas la lecture du texte,
   contrairement à .innerText).
   ---------------------------------------------------------- */

// .textContent d'un élément, sans le texte des info-bulles (.tooltip)
// qu'il contient : un .regle-tag porte à la fois son libellé visible
// et, en enfant caché (visibility:hidden, pas display:none), la
// définition de la règle — .textContent lit les deux à la suite sans
// séparateur ("Maître de la LégionDonne une réaction…"). Utilisée
// partout où une règle/trait peut apparaître (lignes et tables de la
// fiche récap) ; le bloc « Définitions » reprend déjà ces définitions
// proprement mises en forme.
function texteSansInfobulles(element) {
  const clone = element.cloneNode(true);
  clone.querySelectorAll(".tooltip").forEach((bulle) => bulle.remove());
  return clone.textContent.trim();
}

// Une table de profil ou d'armes → { entetes, lignes } (chaque ligne
// est un tableau de cellules texte, dans l'ordre des colonnes).
function donneesTable(table) {
  const entetes = Array.from(table.querySelectorAll("thead th")).map((th) =>
    th.textContent.trim(),
  );
  const lignes = Array.from(table.querySelectorAll("tbody tr")).map((tr) =>
    Array.from(tr.children).map(texteSansInfobulles),
  );
  return { type: "table", entetes, lignes };
}

// Une ligne « Étiquette : valeur, valeur… » (Effectif, Équipement,
// Traits, Règles spéciales, Type, Notes) → { titre, texte }.
function donneesLigne(p) {
  const clone = p.cloneNode(true);
  clone.querySelectorAll(".tooltip").forEach((bulle) => bulle.remove());
  const strong = clone.querySelector("strong");
  const titre = strong ? strong.textContent.replace(/\s*:\s*$/, "").trim() : "";
  if (strong) strong.remove();
  return { type: "ligne", titre, texte: clone.textContent.trim() };
}

// Le bloc « Définitions » (réservé à l'impression, voir
// construireDefinitions) → { items: [{ nom, texte }] }.
function donneesDefinitions(bloc) {
  const items = Array.from(bloc.querySelectorAll("li")).map((li) => {
    const clone = li.cloneNode(true);
    const strong = clone.querySelector("strong");
    const nom = strong ? strong.textContent.replace(/\s*—\s*$/, "").trim() : "";
    if (strong) strong.remove();
    return { nom, texte: clone.textContent.trim() };
  });
  return { type: "definitions", items };
}

// Contenu de .unite-fiche (profil, équipement, armes, règles…), dans
// l'ordre d'affichage, sous forme de blocs typés.
function donneesFiche(fiche) {
  const blocs = [];
  for (const enfant of fiche.children) {
    if (enfant.classList.contains("table-scroll")) {
      const table = enfant.querySelector("table");
      if (table) blocs.push(donneesTable(table));
    } else if (enfant.classList.contains("fiche-ligne")) {
      blocs.push(donneesLigne(enfant));
    } else if (enfant.classList.contains("unite-fiche-definitions")) {
      blocs.push(donneesDefinitions(enfant));
    }
  }
  return blocs;
}

// Une carte d'unité entière : en-tête, case occupée, composition,
// puis la fiche récap.
function donneesCarte(carte) {
  const nom = carte.querySelector(".unite-carte-entete h3").textContent.trim();
  const points = carte.querySelector(".unite-points").textContent.trim();
  const composition = carte.querySelector(".unite-composition");
  const compositionTexte = composition ? composition.textContent.trim() : "";
  const caseSelect = carte.querySelector(".unite-case-select");
  const optionActuelle = caseSelect && caseSelect.selectedOptions[0];
  const caseTexte =
    optionActuelle && optionActuelle.value
      ? optionActuelle.textContent.trim()
      : "";
  const fiche = carte.querySelector(".unite-fiche");
  return {
    nom,
    points,
    compositionTexte,
    caseTexte,
    blocs: fiche ? donneesFiche(fiche) : [],
  };
}

// Résumé de la structure d'armée (#orga-resume, voir construireResume
// dans js/organigramme.js) : un bloc par détachement, avec le libellé
// de ses Cases occupées.
function donneesResume(conteneur) {
  return Array.from(
    conteneur.querySelectorAll(".orga-resume-detachement"),
  ).map((bloc) => {
    const h3 = bloc.querySelector("h3");
    return {
      titre: h3 ? h3.textContent.trim() : "",
      items: Array.from(bloc.querySelectorAll("li")).map((li) =>
        li.textContent.trim(),
      ),
    };
  });
}

/* ---------- Export PDF (js/vendor/jspdf*, voir LICENCES.txt) ----------
   Une page par unité (mise en page « carte » : cadre, en-tête nom +
   points, table de profil, tables d'armes, lignes de règles, bloc
   Définitions), précédée d'une page de garde reprenant le total et la
   structure de l'armée (résumé des détachements). */

// Les polices standard de jsPDF (Times, Helvetica…) n'embarquent que
// l'encodage WinAnsi (Latin-1) : un glyphe hors de cet ensemble n'est
// pas simplement absent, il est SILENCIEUSEMENT remplacé par un autre
// caractère du jeu (ex : "★", qui marque une Case Principale dans le
// résumé de l'armée, devient "&"). On substitue ici les quelques
// symboles utilisés ailleurs sur le site par un équivalent ASCII AVANT
// tout appel à doc.text/splitTextToSize/autoTable, pour ne jamais
// laisser passer un contresens silencieux sur une fiche imprimée.
function assainirPDF(texte) {
  return String(texte)
    .replace(/★/g, "*")
    .replace(/⚠/g, "!");
}

function genererPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const MARGE = 36;
  const PAD = 10;
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const contentX = MARGE + PAD;
  const contentW = pageW - 2 * (MARGE + PAD);
  const basPage = pageH - MARGE - PAD;
  let y = MARGE + PAD;
  let pageOuverte = false; // la 1ère page de jsPDF existe déjà par défaut

  function nouvellePage() {
    if (pageOuverte) doc.addPage();
    pageOuverte = true;
    y = MARGE + PAD + 4;
  }

  function assurerEspace(hauteur) {
    if (y + hauteur > basPage) nouvellePage();
  }

  function titreSection(texte, taille) {
    assurerEspace(taille + 6);
    doc.setFont("times", "bold");
    doc.setFontSize(taille);
    doc.text(assainirPDF(texte), contentX, y);
    y += taille + 4;
  }

  function paragraphe(texte, taille, style) {
    doc.setFont("times", style || "normal");
    doc.setFontSize(taille);
    const interligne = taille * 1.3;
    for (const ligne of doc.splitTextToSize(assainirPDF(texte), contentW)) {
      assurerEspace(interligne);
      doc.text(ligne, contentX, y);
      y += interligne;
    }
  }

  // "Titre : texte" avec le titre en gras et le texte en romain,
  // repliable sur plusieurs lignes (utilisée pour les lignes de
  // fiche et pour chaque entrée du bloc Définitions).
  function ligneEtiquette(titre, texte, separateur) {
    const taille = 9;
    const interligne = taille * 1.3;
    doc.setFontSize(taille);
    const prefixe = assainirPDF(titre) + (separateur || " : ");
    texte = assainirPDF(texte);
    doc.setFont("times", "bold");
    const largeurPrefixe = doc.getTextWidth(prefixe);
    doc.setFont("times", "normal");
    const largeurRestante = contentW - largeurPrefixe;
    const lignes = doc.splitTextToSize(
      texte,
      largeurRestante > 60 ? largeurRestante : contentW,
    );
    assurerEspace(interligne);
    doc.setFont("times", "bold");
    doc.text(prefixe, contentX, y);
    doc.setFont("times", "normal");
    if (lignes[0]) doc.text(lignes[0], contentX + largeurPrefixe, y);
    y += interligne;
    for (let i = 1; i < lignes.length; i++) {
      assurerEspace(interligne);
      doc.text(lignes[i], contentX, y);
      y += interligne;
    }
  }

  function tableauPDF(bloc) {
    assurerEspace(30);
    doc.autoTable({
      startY: y,
      margin: { left: contentX, right: MARGE + PAD },
      tableWidth: contentW,
      head: [bloc.entetes.map(assainirPDF)],
      body: bloc.lignes.map((ligne) => ligne.map(assainirPDF)),
      theme: "grid",
      styles: {
        font: "times",
        fontSize: 8,
        cellPadding: 3,
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
        textColor: [0, 0, 0],
      },
      headStyles: { fillColor: [40, 40, 40], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [242, 242, 242] },
    });
    y = doc.lastAutoTable.finalY + 8;
  }

  function definitionsPDF(items) {
    assurerEspace(20);
    y += 4;
    doc.setDrawColor(120);
    doc.setLineWidth(0.5);
    doc.line(contentX, y, pageW - MARGE - PAD, y);
    y += 10;
    titreSection("Définitions", 10);
    for (const item of items) ligneEtiquette(item.nom, item.texte, " — ");
  }

  function cartePDF(donnees) {
    nouvellePage();
    const nom = assainirPDF(donnees.nom);
    const points = assainirPDF(donnees.points);
    doc.setFont("times", "bold");
    doc.setFontSize(15);
    doc.text(nom, contentX, y);
    doc.setFontSize(13);
    const largeurPoints = doc.getTextWidth(points);
    doc.text(points, pageW - MARGE - PAD - largeurPoints, y);
    y += 16;
    if (donnees.compositionTexte) {
      doc.setFont("times", "italic");
      doc.setFontSize(9.5);
      for (const ligne of doc.splitTextToSize(
        assainirPDF(donnees.compositionTexte),
        contentW,
      )) {
        assurerEspace(13);
        doc.text(ligne, contentX, y);
        y += 13;
      }
    }
    if (donnees.caseTexte) {
      assurerEspace(12);
      doc.setFont("times", "italic");
      doc.setFontSize(8.5);
      doc.text("Case occupée : " + assainirPDF(donnees.caseTexte), contentX, y);
      y += 12;
    }
    y += 4;
    doc.setDrawColor(0);
    doc.setLineWidth(0.75);
    doc.line(contentX, y, pageW - MARGE - PAD, y);
    y += 10;

    for (const bloc of donnees.blocs) {
      if (bloc.type === "table") tableauPDF(bloc);
      else if (bloc.type === "ligne" && bloc.texte) {
        ligneEtiquette(bloc.titre, bloc.texte);
        y += 2;
      } else if (bloc.type === "definitions" && bloc.items.length > 0) {
        definitionsPDF(bloc.items);
      }
    }
  }

  // --- Page de garde : titre, total, structure de l'armée ---
  nouvellePage();
  doc.setFont("times", "bold");
  doc.setFontSize(18);
  doc.text("Liste d'armée — Horus Heresy", contentX, y);
  y += 26;
  const total = document.getElementById("total-armee");
  if (total) paragraphe(total.textContent.trim(), 11, "bold");
  paragraphe("Générée le " + new Date().toLocaleDateString("fr-FR"), 9, "italic");
  y += 6;
  const resume = document.getElementById("orga-resume");
  if (resume && resume.textContent.trim()) {
    titreSection("Structure de l'armée", 12);
    for (const detachement of donneesResume(resume)) {
      paragraphe(detachement.titre, 10, "bold");
      for (const item of detachement.items) paragraphe("• " + item, 9);
      y += 4;
    }
  }

  // --- Une carte par unité ---
  for (const carte of document.querySelectorAll("#liste-unites .unite-carte")) {
    cartePDF(donneesCarte(carte));
  }

  // Cadre de carte, posé après coup sur chaque page générée (y
  // compris la page de garde) : plus simple et plus robuste que de
  // calculer sa hauteur à l'avance quand le contenu peut déborder sur
  // une page suivante (table ou bloc Définitions trop longs).
  doc.setDrawColor(0);
  doc.setLineWidth(1);
  for (let i = 1; i <= doc.getNumberOfPages(); i++) {
    doc.setPage(i);
    doc.rect(MARGE, MARGE, pageW - 2 * MARGE, pageH - 2 * MARGE);
  }

  return doc;
}

function telechargerPDF() {
  const doc = genererPDF();
  const date = new Date().toISOString().slice(0, 10);
  doc.save("armee-horus-heresy-" + date + ".pdf");
}

/* ---------- Export Word (.doc) ----------
   Aucune dépendance : un fichier .doc au format HTML (astuce classique,
   reconnue par Microsoft Word), avec ses styles intégrés — la même
   mise en forme « carte d'unité » que le PDF, mais éditable dans
   Word. */
function echapperHTML(texte) {
  const div = document.createElement("div");
  div.textContent = texte;
  return div.innerHTML;
}

function carteWordHTML(donnees) {
  let html = '<div class="carte">';
  html +=
    '<div class="entete"><span>' +
    echapperHTML(donnees.nom) +
    "</span><span>" +
    echapperHTML(donnees.points) +
    "</span></div>";
  if (donnees.compositionTexte) {
    html += "<p class=\"composition\">" + echapperHTML(donnees.compositionTexte) + "</p>";
  }
  if (donnees.caseTexte) {
    html +=
      '<p class="composition">Case occupée : ' +
      echapperHTML(donnees.caseTexte) +
      "</p>";
  }
  html += "<hr>";
  for (const bloc of donnees.blocs) {
    if (bloc.type === "table") {
      html += "<table><thead><tr>";
      for (const entete of bloc.entetes) html += "<th>" + echapperHTML(entete) + "</th>";
      html += "</tr></thead><tbody>";
      for (const ligne of bloc.lignes) {
        html +=
          "<tr>" +
          ligne.map((cellule) => "<td>" + echapperHTML(cellule) + "</td>").join("") +
          "</tr>";
      }
      html += "</tbody></table>";
    } else if (bloc.type === "ligne" && bloc.texte) {
      html +=
        '<p class="ligne"><strong>' +
        echapperHTML(bloc.titre) +
        " : </strong>" +
        echapperHTML(bloc.texte) +
        "</p>";
    } else if (bloc.type === "definitions" && bloc.items.length > 0) {
      html += '<div class="definitions"><p><strong>Définitions</strong></p>';
      for (const item of bloc.items) {
        html +=
          "<p><strong>" +
          echapperHTML(item.nom) +
          " — </strong>" +
          echapperHTML(item.texte) +
          "</p>";
      }
      html += "</div>";
    }
  }
  html += "</div>";
  return html;
}

function genererWordHTML() {
  const style = `
    body { font-family: 'Times New Roman', serif; font-size: 11pt; color: #000; }
    h1 { font-size: 20pt; margin-bottom: 4pt; }
    h2 { font-size: 14pt; margin: 14pt 0 4pt; border-bottom: 1pt solid #000; padding-bottom: 2pt; }
    .carte { border: 1pt solid #000; padding: 10pt; margin-bottom: 16pt; page-break-inside: avoid; }
    .entete { font-weight: bold; font-size: 14pt; }
    .entete span:last-child { float: right; }
    .composition { font-style: italic; font-size: 10pt; margin: 2pt 0 8pt; }
    table { border-collapse: collapse; width: 100%; margin: 6pt 0; font-size: 9pt; }
    th, td { border: 1pt solid #000; padding: 3pt 5pt; text-align: center; }
    th { background: #e6e6e6; }
    p.ligne { margin: 4pt 0; font-size: 9.5pt; }
    .definitions { margin-top: 8pt; border-top: 1pt solid #999; padding-top: 6pt; }
    .definitions p { margin: 3pt 0; font-size: 9pt; }
    hr { border: none; border-top: 1pt solid #000; margin: 6pt 0 10pt; }
  `;
  let corps = "<h1>Liste d'armée — Horus Heresy</h1>";
  const total = document.getElementById("total-armee");
  if (total) corps += "<p><strong>" + echapperHTML(total.textContent.trim()) + "</strong></p>";
  corps +=
    "<p><em>Générée le " +
    echapperHTML(new Date().toLocaleDateString("fr-FR")) +
    "</em></p>";
  const resume = document.getElementById("orga-resume");
  if (resume && resume.textContent.trim()) {
    corps += "<h2>Structure de l'armée</h2>";
    for (const detachement of donneesResume(resume)) {
      corps += "<p><strong>" + echapperHTML(detachement.titre) + "</strong></p><ul>";
      for (const item of detachement.items) corps += "<li>" + echapperHTML(item) + "</li>";
      corps += "</ul>";
    }
  }
  for (const carte of document.querySelectorAll("#liste-unites .unite-carte")) {
    corps += carteWordHTML(donneesCarte(carte));
  }
  return (
    "<!DOCTYPE html><html xmlns:o='urn:schemas-microsoft-com:office:office' " +
    "xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>" +
    "<head><meta charset=\"utf-8\"><title>Liste d'armée — Horus Heresy</title>" +
    "<style>" +
    style +
    "</style></head><body>" +
    corps +
    "</body></html>"
  );
}

// Déclenche le téléchargement d'un fichier via une URL blob éphémère
// (révoquée juste après le clic simulé).
function telechargerBlob(nomFichier, contenu, type) {
  const blob = new Blob([contenu], { type });
  const url = URL.createObjectURL(blob);
  const lien = document.createElement("a");
  lien.href = url;
  lien.download = nomFichier;
  document.body.appendChild(lien);
  lien.click();
  lien.remove();
  URL.revokeObjectURL(url);
}

function telechargerWord() {
  const date = new Date().toISOString().slice(0, 10);
  // BOM ("﻿") : force Word à détecter l'encodage UTF-8 (sinon les
  // accents peuvent s'afficher mal à l'ouverture).
  telechargerBlob(
    "armee-horus-heresy-" + date + ".doc",
    "﻿" + genererWordHTML(),
    "application/msword;charset=utf-8",
  );
}

/* Combobox « Unité à ajouter » : un champ de recherche filtre, au fil
   de la frappe, une liste déroulante d'unités groupées par catégorie
   (remplace un <select> à <optgroup>, dont le texte n'est pas
   filtrable). Retourne un accesseur donnant l'unité actuellement
   retenue (dernière choisie via clic/Entrée), utilisé par le bouton
   « Ajouter à la liste ». */
function initialiserChoixUnite() {
  const champ = document.getElementById("choix-unite");
  const bouton = document.getElementById("choix-unite-bouton");
  const liste = document.getElementById("choix-unite-liste");

  // Catégories triées selon ORDRE_CATEGORIES (même ordre que l'ancien
  // menu à <optgroup>).
  const categories = [...new Set(UNITES.map((u) => u.categorie))].sort(
    (a, b) => {
      const ia = ORDRE_CATEGORIES.indexOf(a);
      const ib = ORDRE_CATEGORIES.indexOf(b);
      return (
        (ia === -1 ? ORDRE_CATEGORIES.length : ia) -
        (ib === -1 ? ORDRE_CATEGORIES.length : ib)
      );
    },
  );

  // Liste plate, dans l'ordre d'affichage : un en-tête { groupe }
  // suivi des unités { unite } de cette catégorie.
  const entrees = [];
  for (const categorie of categories) {
    entrees.push({ groupe: categorie });
    for (const unite of UNITES.filter((u) => u.categorie === categorie)) {
      entrees.push({ unite });
    }
  }

  const libelle = (unite) => unite.nom + " — " + unite.cout + " pts";
  const idOption = (unite) => "choix-unite-option-" + unite.id;

  // Praetor par défaut (unité HQ générique) plutôt que la première
  // entrée du tableau, qui dépend juste de l'ordre des catégories.
  const premiereUnite =
    entrees.find((e) => e.unite && e.unite.id === "praetor") ||
    entrees.find((e) => e.unite);
  let uniteId = premiereUnite ? premiereUnite.unite.id : null;
  let visibles = entrees; // sous-ensemble d'`entrees` correspondant à la recherche courante
  let indiceActif = -1; // indice dans les options visibles (hors en-têtes)

  // La normalisation (accents, casse) est assurée par normaliserTexte,
  // partagée par toutes les barres de recherche du site (js/main.js).
  // Filtrée en direct (pas de rebuild d'`entrees` nécessaire) : ouvrir
  // ou retaper dans le champ relit toujours la Légion actuelle.
  // Dans chaque catégorie, les unités propres à la Légion actuelle
  // remontent avant les unités génériques (tri stable : l'ordre
  // d'origine est conservé au sein de chaque sous-groupe).
  function filtrer(requete) {
    const q = normaliserTexte(requete.trim());
    const legionCourante = Organigramme.legionActuelle();
    const resultat = [];
    let groupeCourant = null;
    let uniteesCourantes = [];
    const vider = () => {
      if (uniteesCourantes.length === 0) return;
      uniteesCourantes.sort(
        (a, b) =>
          (a.unite.legion === legionCourante ? 0 : 1) -
          (b.unite.legion === legionCourante ? 0 : 1),
      );
      resultat.push(groupeCourant, ...uniteesCourantes);
      uniteesCourantes = [];
    };
    for (const entree of entrees) {
      if (entree.groupe) {
        vider();
        groupeCourant = entree;
        continue;
      }
      if (!uniteAccessible(entree.unite)) continue;
      if (q && !normaliserTexte(entree.unite.nom).includes(q)) continue;
      uniteesCourantes.push(entree);
    }
    vider();
    return resultat;
  }

  const options = () => visibles.filter((e) => e.unite);

  function rendre() {
    liste.replaceChildren();
    if (visibles.length === 0) {
      liste.appendChild(
        el("li", "unite-combobox-vide", "Aucune unité trouvée."),
      );
      return;
    }
    for (const entree of visibles) {
      if (entree.groupe) {
        const li = el("li", "unite-combobox-groupe", entree.groupe);
        li.setAttribute("role", "presentation");
        liste.appendChild(li);
        continue;
      }
      const classe =
        entree.unite.legion === Organigramme.legionActuelle()
          ? "unite-combobox-option unite-combobox-option--legion"
          : "unite-combobox-option";
      const li = el("li", classe, libelle(entree.unite));
      li.id = idOption(entree.unite);
      li.setAttribute("role", "option");
      li.dataset.uniteId = entree.unite.id;
      li.setAttribute("aria-selected", String(entree.unite.id === uniteId));
      liste.appendChild(li);
    }
  }

  function surligner(indice) {
    const actif = liste.querySelector(".unite-combobox-actif");
    if (actif) actif.classList.remove("unite-combobox-actif");
    indiceActif = indice;
    const opts = options();
    if (indice < 0 || indice >= opts.length) {
      champ.removeAttribute("aria-activedescendant");
      return;
    }
    const li = document.getElementById(idOption(opts[indice].unite));
    if (!li) return;
    li.classList.add("unite-combobox-actif");
    champ.setAttribute("aria-activedescendant", li.id);
    li.scrollIntoView({ block: "nearest" });
  }

  function fermer() {
    liste.hidden = true;
    champ.setAttribute("aria-expanded", "false");
    champ.removeAttribute("aria-activedescendant");
    indiceActif = -1;
  }

  function ouvrir(requete) {
    visibles = filtrer(requete);
    rendre();
    liste.hidden = false;
    champ.setAttribute("aria-expanded", "true");
    surligner(-1);
  }

  function choisir(unite) {
    uniteId = unite.id;
    champ.value = libelle(unite);
    fermer();
  }

  champ.addEventListener("input", () => ouvrir(champ.value));
  // Le champ garde le libellé du dernier choix confirmé (voir plus
  // bas) : au focus, on affiche la liste complète plutôt que de la
  // filtrer par ce texte déjà tapé, et on le sélectionne pour qu'une
  // frappe immédiate le remplace au lieu de s'y ajouter — sinon la
  // « liste déroulante » ne montrerait quasiment plus rien à l'ouverture.
  champ.addEventListener("focus", () => {
    ouvrir("");
    champ.select();
  });
  // Un clic alors que le champ a déjà le focus (ex : liste refermée
  // par Échap) ne redéclenche pas l'évènement focus : on la rouvre
  // aussi sur click pour que cliquer dans le champ rouvre toujours
  // la liste, comme un <select>.
  champ.addEventListener("click", () => {
    if (liste.hidden) ouvrir("");
  });

  champ.addEventListener("keydown", (evenement) => {
    if (evenement.key === "ArrowDown") {
      evenement.preventDefault();
      if (liste.hidden) ouvrir(champ.value);
      else surligner(Math.min(indiceActif + 1, options().length - 1));
    } else if (evenement.key === "ArrowUp") {
      evenement.preventDefault();
      if (liste.hidden) ouvrir(champ.value);
      else surligner(Math.max(indiceActif - 1, 0));
    } else if (evenement.key === "Enter") {
      if (liste.hidden) return;
      evenement.preventDefault();
      const opts = options();
      const cible =
        indiceActif >= 0
          ? opts[indiceActif]
          : opts.length === 1
            ? opts[0]
            : null;
      if (cible) choisir(cible.unite);
    } else if (evenement.key === "Escape") {
      fermer();
    }
  });

  // Sélection à la souris/tactile : mousedown (déclenché avant le
  // blur du champ) plutôt que click, pour que la liste ne se
  // referme pas avant d'avoir pu lire l'option ciblée.
  liste.addEventListener("mousedown", (evenement) => {
    const li = evenement.target.closest("[role='option']");
    if (!li) return;
    evenement.preventDefault();
    const unite = trouverUnite(li.dataset.uniteId);
    if (unite) choisir(unite);
  });

  // Bouton « flèche » : bascule la liste complète, comme la flèche
  // d'un <select>. mousedown + preventDefault (plutôt que click) pour
  // ne pas voler le focus du champ.
  bouton.addEventListener("mousedown", (evenement) => {
    evenement.preventDefault();
    if (liste.hidden) {
      ouvrir("");
      champ.select();
    } else {
      fermer();
    }
    champ.focus();
  });

  // Clic en dehors du champ, du bouton et de la liste : on referme, et
  // si le texte tapé ne correspond plus à un choix confirmé, on
  // revient à son libellé (comme un <select>, qui ne peut pas rester
  // sur une saisie invalide).
  document.addEventListener("click", (evenement) => {
    if (
      evenement.target === champ ||
      evenement.target === bouton ||
      liste.contains(evenement.target)
    )
      return;
    fermer();
    const unite = trouverUnite(uniteId);
    if (unite) champ.value = libelle(unite);
  });

  if (premiereUnite) champ.value = libelle(premiereUnite.unite);

  return () => trouverUnite(uniteId);
}

function initialiser() {
  const uniteChoisie = initialiserChoixUnite();
  const boutonAjouter = document.getElementById("ajouter-unite");
  const boutonTelechargerPDF = document.getElementById("telecharger-pdf");
  const boutonTelechargerWord = document.getElementById("telecharger-word");
  const boutonVider = document.getElementById("vider-liste");
  const listeCartes = document.getElementById("liste-unites");
  const messageAjout = document.getElementById("ajout-message");

  boutonAjouter.addEventListener("click", () => {
    // Filet de sécurité : le bouton est normalement désactivé tant
    // qu'aucune Légion n'est choisie (voir actualiserVerrouLegion).
    if (Organigramme.legionActuelle() === "") return;
    const unite = uniteChoisie();
    if (!unite) return;
    // Filet de sécurité : la sélection du champ peut dater d'avant un
    // changement de Légion (le champ n'est pas ré-ouvert à chaque
    // changement). Le sélecteur filtre déjà normalement ce cas.
    if (!uniteAccessible(unite)) return;
    // Règle p. 282 : une unité doit occuper une Case de l'Organigramme
    // de Force dont le Rôle Tactique correspond au sien. Sans case
    // libre compatible, l'ajout est refusé et on explique comment
    // débloquer un détachement adapté (exigence UX).
    const libres = Organigramme.casesLibresPour(unite);
    if (libres.length === 0) {
      messageAjout.textContent = Organigramme.suggestionPourRole(unite);
      messageAjout.hidden = false;
      return;
    }
    messageAjout.hidden = true;
    const instance = {
      uid: ++compteurUid,
      uniteId: unite.id,
      variante: 0,
      effectif: unite.effectif ? unite.effectif.base : null,
      valeurs: valeursParDefaut(unite),
    };
    armee.push(instance);
    listeCartes.appendChild(construireCarte(instance));
    // Placement automatique dans la première case libre compatible ;
    // modifiable ensuite via le menu « Case occupée » de la carte.
    Organigramme.assigner(instance.uid, libres[0].detUid, libres[0].indice);
  });

  boutonTelechargerPDF.addEventListener("click", () => telechargerPDF());
  boutonTelechargerWord.addEventListener("click", () => telechargerWord());

  boutonVider.addEventListener("click", () => {
    armee = [];
    listeCartes.replaceChildren();
    sauvegarder();
    // Libère toutes les Cases de l'organigramme (la structure des
    // détachements, elle, est conservée).
    Organigramme.toutLiberer();
    actualiserTotal();
  });

  // Restaure une éventuelle liste mémorisée, puis branche
  // l'organigramme : il restaure sa propre structure, réconcilie les
  // références (unités disparues, anciennes listes sans organigramme)
  // et nous prévient à chaque changement via surChangement.
  restaurer();
  for (const instance of armee)
    listeCartes.appendChild(construireCarte(instance));
  Organigramme.initialiser({
    getArmee: () => armee,
    trouverUnite,
    coutInstance,
    retirerInstance,
    surChangement: actualiserSelectsCases,
  });
  orgaPret = true;
  actualiserTotal();
}

// main.js, unites-data.js, organigramme-data.js et organigramme.js
// sont chargés avant (defer) : le DOM est prêt.
initialiser();
