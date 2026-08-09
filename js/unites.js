/* ============================================================
   unites.js — Fiches récap d'unités (page construction-liste.html)
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
// Dernier Avantage Principal connu par uid (voir actualiserSelectsCases) :
// permet de ne reconstruire la fiche récap d'une unité que lorsque son
// Avantage a réellement changé, plutôt qu'à chaque interaction sur
// N'IMPORTE QUELLE carte de l'Armée.
const dernierAvantageParUid = new Map();
// Même principe pour le Trait accordé par le Détachement Auxiliaire
// occupé (ex : Tercio Véletaris) : voir actualiserSelectsCases.
const dernierTraitDetachementParUid = new Map();

const CLE_STOCKAGE = "hh-fiche-unites";

// Détachements dont les Cases piochent, via `restrictions`, dans une
// Liste d'Armée différente de la Faction de l'Armée (`factionLibre`,
// voir js/organigramme-data.js) : Tercio de Fer (Solar Auxilia →
// Mechanicum), Serre d'Automates et Maisnie Roturière (Chevaliers
// Questoris → Mechanicum / Solar Auxilia). Leurs Unités resteraient
// sinon bloquées par la vérification de Faction de uniteAccessible()
// ci-dessous — voir uniteAccessibleParDetachementCroise.
const DETACHEMENTS_CROISES = [
  "tercio-de-fer",
  "serre-automates",
  "maisnie-roturiere",
];

// Cette Unité devient-elle accessible via l'un des DETACHEMENTS_CROISES
// ci-dessus, présent dans l'Armée et dont les `restrictions` incluent
// son id ? Ne suffit pas qu'un AUTRE Détachement croisé accepte cet id
// par coïncidence : chaque Détachement est vérifié avec ses propres
// `restrictions`, pas l'union de toutes.
function uniteAccessibleParDetachementCroise(unite) {
  if (!orgaPret || typeof Organigramme === "undefined") return false;
  for (const typeId of DETACHEMENTS_CROISES) {
    if (!Organigramme.detachementPresent(typeId)) continue;
    const type = TYPES_DETACHEMENTS.find((t) => t.id === typeId);
    if (!type || !type.restrictions) continue;
    if (
      Object.values(type.restrictions).some((liste) => liste.includes(unite.id))
    )
      return true;
  }
  return false;
}

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
// Profil de Véhicule de Sous-type Chevalier (voir pages/vehicule.html
// #sous-types) : CC/F/I/A en plus du profil de véhicule standard, mais
// seulement deux Faces de Blindage (Avant/Arrière, pas de Flanc) — voir
// `profilChevalier` dans js/unites-data.js et construireTableProfil
// ci-dessous.
const ENTETES_CHEVALIER = [
  "M",
  "CC",
  "CT",
  "F",
  "Blindage Avant",
  "Blindage Arrière",
  "I",
  "A",
  "PC",
];
// Profil de Titan (Legio Titanicus) : une ligne par Profil (Tête,
// Carapace, Bras, Jambes…), chacune avec son propre Blindage
// Principal/Exposé — à ne pas confondre avec le profil de véhicule
// standard (une seule ligne, Avant/Flanc/Arrière). Voir `profilsVehicule`
// dans js/unites-data.js et construireTableProfil ci-dessous.
const ENTETES_TITAN = [
  "M",
  "CT",
  "Blindage Principal",
  "Blindage Exposé",
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
  // Détachement Narratif présent dans l'Armée (js/organigramme.js) :
  // ce Détachement acceptant n'importe quelle Unité, sans restriction
  // de Faction/Légion/Allégeance (voir js/organigramme-data.js), les
  // vérifications ci-dessous n'ont plus lieu d'être — caseAccepte()
  // reste seul juge du placement réel dans les AUTRES détachements de
  // l'Armée (un Titan Legio Titanicus reste par ex. inutilisable dans
  // le Détachement Principal Legio Astartes, faute de Case libre).
  const narratifDisponible =
    orgaPret &&
    typeof Organigramme !== "undefined" &&
    Organigramme.narratifPresent();
  if (!narratifDisponible) {
    // Faction réservée (champ `faction`, ex : "legio-titanicus") : sans ce
    // champ, une unité reste réservée à Legio Astartes (livre d'armée
    // transcrit ici depuis le début). Tant que l'organigramme n'est pas
    // prêt (restauration initiale), on suppose Legio Astartes — la
    // valeur par défaut de l'état (js/organigramme.js) — pour ne pas
    // masquer les unités Legio Astartes à ce moment-là.
    // Une unité d'une autre Faction que celle de l'Armée ne doit
    // apparaître dans le sélecteur « Unité à ajouter » que si cette
    // autre Faction a été explicitement amenée dans l'Armée via un
    // Détachement Allié (menu « Faction Alliée » de sa carte) — jamais
    // automatiquement au seul motif qu'une Case de son Rôle Tactique
    // existerait quelque part (ex : Seigneurs des Batailles, Engins de
    // Guerre). Anciennement, un Titan Legio Titanicus ou un Chevalier/
    // Armigère Chevaliers Questoris restaient visibles quelle que soit
    // la Faction de l'Armée dès qu'une Case Seigneurs des Batailles/
    // Engins de Guerre libre existait (le Détachement de Seigneur des
    // Batailles et certains Détachements Auxiliaires étant
    // `factionLibre`, voir js/organigramme-data.js) — corrigé (demande
    // explicite du propriétaire, 2026-08-01) : cette dérogation
    // affichait des unités d'une autre Faction sans que le joueur
    // n'ait rien choisi pour les faire entrer dans son Armée. Pour
    // aligner malgré tout un Titan/Chevalier isolé, il faut désormais
    // passer par un vrai Détachement Allié de la Faction voulue.
    // Dernière exception, CONSERVÉE : les Unités des
    // DETACHEMENTS_CROISES ci-dessus (Tercio de Fer, Serre d'Automates,
    // Maisnie Roturière) restent accessibles tant que le Détachement
    // correspondant est présent dans l'Armée — ce Détachement est lui-
    // même un choix explicite du joueur (contrairement aux Cases
    // Seigneurs des Batailles/Engins de Guerre, présentes par défaut
    // dans l'Organigramme), donc conforme au principe ci-dessus.
    const factionActuelle =
      orgaPret && typeof Organigramme !== "undefined"
        ? Organigramme.factionActuelle()
        : "legio-astartes";
    const factionsAllieesActuelles =
      orgaPret && typeof Organigramme !== "undefined"
        ? Organigramme.factionsAlliees()
        : [];
    // Factions débloquées par une Case ajoutée d'Avantage Principal à
    // Faction imposée (ex : Agent de Clade, Divisio Assassinorum) —
    // cette Faction ne peut jamais être choisie comme Faction d'un
    // Détachement Allié, donc `factionsAllieesActuelles` ne suffit pas
    // à elle seule pour rendre ses Unités visibles ici.
    const factionsDebloqueesAvantage =
      orgaPret && typeof Organigramme !== "undefined"
        ? Organigramme.factionsDebloqueesParAvantage()
        : [];
    const factionUnite = unite.faction || "legio-astartes";
    // Légions Brisées (Legacies of the Age of Darkness : The Shattered
    // Legions) et Blackshields (Legacies of the Age of Darkness :
    // Legiones Astartes Blackshields) : ces deux suppléments réutilisent
    // entièrement la Liste d'Armée Legiones Astartes (aucune Unité
    // propre) — une Unité Legio Astartes générique (`faction` absent)
    // reste donc accessible sous ces Factions, exactement comme sous
    // "legio-astartes" lui-même.
    const legionsBriseesActives = factionActuelle === "legions-brisees";
    const reutiliseLegioAstartes =
      legionsBriseesActives || factionActuelle === "blackshields";
    if (
      factionActuelle !== factionUnite &&
      !(reutiliseLegioAstartes && factionUnite === "legio-astartes") &&
      !factionsAllieesActuelles.includes(factionUnite) &&
      !uniteAccessibleParDetachementCroise(unite) &&
      !factionsDebloqueesAvantage.includes(factionUnite)
    )
      return false;
    // Techno-arcane Majeur Mechanicum (Liber Mechanicum p. 13) : toutes les
    // Unités Mechanicum (fixe ET génériques) sont toujours accessibles dans
    // le sélecteur « Unité à ajouter ». Le vrai filtrage d'uniformité
    // intervient au placement : une Unité générique [Mechanicum] peut
    // choisir librement son Techno-arcane via l'option dédiée, et une Unité
    // à Techno-arcane FIXE s'impose directement. La restriction d'uniformité
    // s'applique seulement aux Détachements Auxiliaires/d'Apex (contrôle dans
    // caseAccepte, js/organigramme.js), pas aux Détachements Principaux/
    // Alliés/de Seigneur des Batailles où les Techno-arcanes peuvent différer
    // (Liber Mechanicum p. 13). Le menu « Techno-arcane Majeur » reste utile
    // pour : affichage sur la page de garde (contenuTraitsFactionMechanicumActuels),
    // pré-sélection de l'option sur les Unités génériques, et documentation
    // du Techno-arcane actif pour cette Armée.
    // Aucun filtrage du sélecteur n'est donc appliqué ici.
    if (unite.legion) {
      if (!orgaPret || typeof Organigramme === "undefined") return false;
      const legionOk =
        Organigramme.legionActuelle() === unite.legion ||
        Organigramme.legionsAlliees().includes(unite.legion) ||
        (legionsBriseesActives &&
          Organigramme.legionsBriseesActuelles().includes(unite.legion));
      if (!legionOk) return false;
    }
    // Blackshields (voir CLAUDE.md) : « no Legion specific Units… may
    // be selected in a Blackshields army » — même sans `unite.legion`
    // fixé, le check ci-dessus l'exclurait déjà naturellement (etat.legion
    // reste vide pour cette Faction), sauf via un Détachement Allié qui a
    // sa propre Légion choisie (ce qui reste correct : cette Unité-là
    // rejoint alors ce Détachement Allié, pas un Détachement Blackshields).
    // Unité réservée à une Faction d'Armée précise (ex : Endryd Haar,
    // uniquement dans une Armée Blackshields) : distinct de `unite.faction`
    // (qui reste "legio-astartes" par défaut pour rester compatible avec
    // le placement en Case dans l'Organigramme de Force de Croisade
    // générique, voir caseAccepte()/factionCroisadeParDefaut()) — un
    // changement de Faction vide toujours l'Armée (reinitialiserArmee-
    // AvecConfirmation), donc ce contrôle au seul niveau du sélecteur
    // suffit, sans contrepartie nécessaire dans caseAccepte().
    if (
      unite.requiertFactionArmee &&
      unite.requiertFactionArmee !== factionActuelle
    )
      return false;
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
  }
  // Choix de Détachement Principal Zone Mortalis (Journal Tactica :
  // Zone Mortalis, js/organigramme-data.js) : quand l'un des 3 Charts
  // alternatifs est sélectionné, les Unités Aéronef et les Véhicules à
  // plus de 2 PC (Points de Coque) deviennent indisponibles, quelle que
  // soit la Faction — restriction non tirée du livre (pas de texte de
  // règle fourni pour ces Charts au-delà de leur composition de Cases),
  // demande explicite du proprio. Vérifié sur `unite.variantes` : une
  // Unité est bloquée dès qu'AU MOINS une de ses variantes est un
  // Aéronef ou un Véhicule trop lourd (ex : une variante Outrider/à
  // pied d'une même Unité ne bloque jamais une variante Véhicule
  // distincte, et réciproquement).
  const chartActuel =
    orgaPret && typeof Organigramme !== "undefined"
      ? Organigramme.chartPrincipalActuel()
      : "";
  if (chartActuel && chartActuel.startsWith("zone-mortalis-")) {
    const estAeronef = unite.variantes.some(
      (v) => v.type && v.type.includes("Aéronef"),
    );
    if (estAeronef) return false;
    const vehiculeTropLourd = unite.variantes.some(
      (v) => v.profilVehicule && Number(v.profilVehicule.PC) > 2,
    );
    if (vehiculeTropLourd) return false;
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
   `parTrancheMax`) par tranche de 5 figurines dans l'unité.
   `requiertEquip` (ex : baïonnette, « seulement si la Figurine a
   encore un Bolter ») plafonne en plus ce budget théorique (basé sur
   l'effectif) au nombre RÉEL de Figurines qui portent encore l'objet
   visé, au cas où un rôle nommé (Sergent...) l'a entre-temps
   partiellement retiré via `remplacePartiel` (calculerEquipementComptes
   ci-dessous) — sans ce plafond, un Sergent qui a échangé son bolter
   contre une arme de mêlée resterait quand même compté dans le budget
   d'une option « seulement si Bolter ». Aucun effet quand rien n'a
   jamais retiré l'objet visé (budget théorique déjà atteint). */
function budgetQuantite(unite, instance, opt) {
  let budget = opt.parTranche
    ? Math.floor((instance.effectif || 1) / opt.parTranche) *
      (opt.parTrancheMax || 1)
    : opt.max || 0;
  if (opt.requiertEquip) {
    const comptes = calculerEquipementComptes(unite, instance, opt.id);
    let compteReel = 0;
    for (const [nom, n] of comptes) {
      if (nom.includes(opt.requiertEquip)) compteReel += n;
    }
    budget = Math.min(budget, compteReel);
  }
  return budget;
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

/* Une option est-elle accessible à la variante choisie, et pas
   verrouillée par une AUTRE option de la même unité ?
   `desactiveSiOptionActive: idOption` (ou tableau d'id) verrouille
   complètement cette option (aucune contribution à l'équipement ni au
   coût, champ grisé et remis à zéro par synchroniserConfig) tant
   qu'UNE des options visées est active — ex : Titan Warlord, Griffe
   énergétique Arioch avec Méga-bolter Vulcan (une seule Arme de Bras
   occupant les deux emplacements) verrouille les deux choix d'Arme de
   Bras normaux tant qu'elle est cochée ; forme tableau utilisée par
   les 4 améliorations de Décurion de Légion, mutuellement exclusives
   entre elles (voir optionsDecurionLegion dans js/unites-data.js).
   Centralisé ici car optionPermise est déjà le filtre commun à
   equipementFinal, coutInstance ET optionRealisable. */
function optionPermise(opt, instance) {
  if (opt.variantesExclues && opt.variantesExclues.includes(instance.variante))
    return false;
  if (opt.desactiveSiOptionActive) {
    const ids = Array.isArray(opt.desactiveSiOptionActive)
      ? opt.desactiveSiOptionActive
      : [opt.desactiveSiOptionActive];
    if (ids.some((id) => instance.valeurs[id])) return false;
  }
  return true;
}

/* Équipement final d'une instance, sous forme d'une Map nom → nombre
   de Figurines qui le portent : équipement de départ, puis
   application de chaque option active. `sansOption` permet de
   calculer « l'équipement si cette option n'existait pas » (sert
   à savoir si une option est encore réalisable : on ne peut pas
   remplacer un bolter déjà remplacé par ailleurs).
   Une entrée de `unite.equipement` peut être un objet
   `{ nom, variantesExclues }` plutôt qu'une simple chaîne : sert aux
   Unités montées Outrider/Jetbike Scimitar (Praetor, Champion de
   Légion sur Scimitar…) dont l'arme de base diffère selon la monture
   choisie (`instance.variante`) — même convention que
   `opt.variantesExclues` (optionPermise, ci-dessus) plutôt qu'un
   nouveau mécanisme séparé.

   Modèle de comptage (sert à préfixer les caractéristiques d'Armes
   de la fiche récap d'un nombre de porteurs, ex : « 9 Fusil bolter » —
   voir construireTablesArmes) :
   - Équipement de base (avant Options) : compte = effectif de
     l'instance — `equipementLibelle` documente déjà cette convention
     (« chaque figurine »).
   - `choix` SANS `ajoute` avec une cible trouvée (échange partagé par
     toute l'Unité, ex : type d'arme énergétique d'une Escouade
     Terminator, où c'est un seul choix pour tout le rang-et-fichier) :
     le nouvel objet reçoit tout l'effectif, l'ancien est intégralement
     retiré — comme avant ce mécanisme de comptage.
   - `choix`/`case`/`paire`/`multi` de type AJOUT (`ajoute: true`, la
     grande majorité des options de rôle — Sergent, Champion...) :
     compte = 1. Ce fichier utilise déjà volontairement `ajoute: true`
     SANS `remplace` fiable pour ces options précisément pour ne pas
     retirer l'objet de base de tout le reste de l'Unité (voir
     CLAUDE.md, piège déjà documenté et corrigé plusieurs fois) : quel
     objet de base précis ce rôle portait avant n'est donc pas modélisé
     de façon fiable ici, l'objet de base reste affiché à son compte
     plein. Simplification conservatrice assumée, cohérente avec le
     reste de ce fichier (mieux vaut sur-compter l'équipement de base
     que d'inventer une soustraction non fiable).
   - `quantite` : l'échange porte déjà un compte EXACT (`val`, Figurine
     par Figurine) — propagé tel quel, et proportionnellement soustrait
     de la cible `remplaceIntegral` le cas échéant (pas seulement une
     fois l'effectif entièrement consommé comme avant ce mécanisme).
   Une entrée dont le compte retombe à 0 (toutes les Figurines qui la
   portaient l'ont échangée) est retirée de la Map, pas seulement mise
   à 0 : la caractéristique correspondante ne doit plus apparaître du
   tout sur la fiche.

   `porteurs` (multiplicateur, défaut 1) : un item d'`equipement`, une
   entrée de `choix`, ou un élément du tableau `ajoute` d'une option
   `case`/`paire` peut être un objet `{ nom, porteurs }` plutôt qu'une
   simple chaîne — multiplie le compte au-delà d'« une par Figurine/
   effectif » quand le NOM porte déjà un nombre qui ne correspond pas
   à un vrai profil d'Arme combiné (ex : « Deux lance-flammes lourds »
   du Dreadnought Leviathan, deux Armes indépendantes, contre « Paire
   de pinces de siège Leviathan », profil d'Arme À PART ENTIÈRE dans
   l'Arsenal représentant les deux bras à la fois — compte 1, pas 2 :
   vérifier si l'Arsenal a un profil "Paire de ..."/combiné distinct
   avant de poser `porteurs` sur un tel item). Voir aussi
   trouverToutesArmesDansTexte (plus bas) qui peut faire correspondre
   PLUSIEURS profils d'Armes différents à une même entrée de texte. */
function calculerEquipementComptes(unite, instance, sansOption = null) {
  const effectif = instance.effectif || 1;
  const comptes = new Map();
  const ajouterCompte = (nom, n) => {
    if (n <= 0) return;
    comptes.set(nom, (comptes.get(nom) || 0) + n);
  };
  const retirer = (nom, n = Infinity) => {
    if (!comptes.has(nom)) return;
    const reste = comptes.get(nom) - n;
    if (reste > 0) comptes.set(nom, reste);
    else comptes.delete(nom);
  };

  for (const item of unite.equipement) {
    if (
      typeof item !== "string" &&
      item.variantesExclues &&
      item.variantesExclues.includes(instance.variante)
    )
      continue;
    // `porteurs` (sur l'item d'équipement, ou sur `choix`/l'option
    // elle-même plus bas) : multiplie le compte au-delà d'« une par
    // Figurine » — sert un objet dont le NOM porte déjà un nombre
    // (« Deux lance-flammes lourds », « Paire de pinces de siège
    // Leviathan et deux fuseurs ») pour que la table de caractéristiques
    // affiche le bon compte de porteurs malgré l'effectif/compteRole
    // habituel (voir Dreadnought Leviathan, js/unites-data.js).
    const porteurs = (typeof item !== "string" && item.porteurs) || 1;
    ajouterCompte(typeof item === "string" ? item : item.nom, effectif * porteurs);
  }

  // Remplacements forcés par les Serments du Moment (Blackshields) :
  // Le Serment « Les Armes du Désespoir » impose le remplacement OBLIGATOIRE
  // et EXCLUSIF du Bolter et du Pistolet Bolter par des armes de récupération.
  // Appliqué AVANT les Options pour que le Bolter/Pistolet bolter soient
  // déjà remplacés quand les Options les évaluent.
  if (instance && instance.uid) {
    try {
      if (typeof window !== "undefined" && window.Organigramme && typeof window.Organigramme.sermentsDe === "function") {
        const serments = window.Organigramme.sermentsDe(instance.uid);
        if (Array.isArray(serments) && serments.includes("armes-desespoir")) {
          if (comptes.has("Bolter")) {
            const compteBolter = comptes.get("Bolter");
            retirer("Bolter", compteBolter);
            ajouterCompte("Autofusil récupéré", compteBolter);
          }
          if (comptes.has("Pistolet bolter")) {
            const comptePistolet = comptes.get("Pistolet bolter");
            retirer("Pistolet bolter", comptePistolet);
            ajouterCompte("Autopistolet récupéré", comptePistolet);
          }
        }
      }
    } catch (e) {
      // Silencieusement ignoré si Organigramme n'est pas disponible
    }
  }

  // Options `quantite` posant `remplaceIntegral` (nom exact d'une
  // entrée d'`equipement`) : plusieurs options distinctes (parfois
  // hors `groupe` commun, ex : Les Larmes de l'Ange, IXe Légion)
  // peuvent viser le même objet de base — leurs `val` sont cumulés ici
  // puis soustraits une seule fois après la boucle. Clé : soit le nom
  // exact (rétrocompatible), soit "alt1|alt2|..." quand la cible est
  // elle-même un tableau d'alternatives (voir resoudreCible ci-dessous).
  const totalRemplaceIntegral = new Map();

  // `cible` (remplace/remplaceListe/remplaceIntegral) est le plus
  // souvent un nom exact, mais peut aussi être un TABLEAU
  // d'alternatives : « n'importe LEQUEL de ces objets, celui qui est
  // effectivement présent » (ex : ARMES_ENERGETIQUES, js/unites-
  // data.js — une fois l'arme énergétique de base résolue en un
  // profil précis par optionTypeArmeEnergetique/le choix fusionné,
  // seul UN des 4 noms est réellement présent, jamais le nom générique
  // d'origine). Retourne le premier trouvé, ou `undefined` si aucun.
  const resoudreCible = (cible) => {
    const alternatives = Array.isArray(cible) ? cible : [cible];
    return alternatives.find((n) => comptes.has(n));
  };

  for (const opt of unite.options) {
    if (opt.id === sansOption || !optionPermise(opt, instance)) continue;
    const val = instance.valeurs[opt.id];
    // Une option (quel que soit son `type`) qui vise TOUTE l'Unité
    // plutôt qu'un rôle unique (Sergent/Champion...) porte soit
    // `parFigurine: true` (déjà utilisé par des `choix` ET des `case`
    // dans unites-data.js), soit — faute de ce champ sur certaines
    // options plus anciennes/générées par fabrique (ex :
    // optionBombesFusionUnite) — un `libelle` commençant par « Toute »/
    // « Toutes » (convention déjà systématique dans ce fichier : «
    // Toute Figurine : ... », « Toute l'unité : ... », « Toutes les
    // Figurines : ... »). Un rôle nommé compte pour 1 Figurine (la
    // simplification déjà documentée plus haut).
    const compteRole =
      opt.parFigurine ||
      (typeof opt.libelle === "string" && /^toute[s]?\b/i.test(opt.libelle))
        ? effectif
        : 1;

    // `horsEquipement: true` (ex : Techno-arcane Majeur Mechanicum,
    // Theurgika Maximus, Rites Cybertheurgiques — js/unites-data.js) :
    // cette option accorde un Trait ou une Règle Spéciale, pas un objet
    // d'Équipement — construireFiche et reglesFinales (ci-dessous) s'en
    // chargent séparément, rien à faire ici. Vérifié avant la répartition
    // par `type` : ce champ ne concernait à l'origine que les `choix`
    // (Techno-arcane), mais vaut désormais aussi pour un `case`
    // (Theurgika Maximus) et un `multi` (Rites) — sans quoi leur `ajoute`
    // atterrirait dans l'Équipement, où construireTablesArmes chercherait
    // en vain un profil d'Arme du même nom.
    if (opt.horsEquipement) continue;

    if (opt.type === "choix") {
      // `obligatoire: true` : l'indice 0 est un vrai choix (ex :
      // « toutes les figurines DOIVENT prendre une Arme Spéciale »),
      // il apparaît donc aussi sur la fiche.
      if (!val && !opt.obligatoire) continue; // indice 0 = conserver
      const choix = opt.choix[val];
      const cible = choix.remplace || opt.remplace;
      // prefixeFiche : précise qui porte l'objet dans une escouade
      // (ex : "Sergent : Arme énergétique") — n'affecte que le texte
      // affiché, pas le compte (voir le modèle de comptage ci-dessus).
      const nomAjoute = (opt.prefixeFiche || "") + nomCourt(choix.nom);
      const porteursChoix = choix.porteurs || 1;
      if (!opt.ajoute && cible) {
        const trouve = resoudreCible(cible);
        if (trouve) retirer(trouve);
        ajouterCompte(nomAjoute, effectif * porteursChoix);
      } else {
        ajouterCompte(nomAjoute, compteRole * porteursChoix);
        // `remplacePartiel` (à la différence de `remplace`/`cible`
        // ci-dessus, qui retirent l'objet visé pour TOUTE l'Unité) ne
        // retire que `compteRole` Figurines — sûr uniquement pour un
        // rôle dont on connaît avec certitude l'effectif exact
        // (typiquement 1, un Sergent/Champion nommé) : contrairement
        // au reste du rang-et-fichier, `compteRole` ici n'est jamais
        // une approximation. Voir CLAUDE.md, piège déjà documenté sur
        // `ajoute: true` sans `remplace` (objet de base qui reste à
        // tort affiché à son compte plein pour tout le monde).
        if (opt.remplacePartiel) {
          // Accepte soit une chaîne, soit un tableau de cibles à retirer
          const cibles = Array.isArray(opt.remplacePartiel)
            ? opt.remplacePartiel
            : [opt.remplacePartiel];
          for (const cible of cibles) {
            const trouve = resoudreCible(cible);
            if (trouve) retirer(trouve, compteRole);
          }
        }
      }
    } else if (opt.type === "case") {
      // `ajoute` accepte aussi un tableau : une amélioration de
      // Décurion de Légion accorde souvent plusieurs objets/Règles
      // Spéciales à la fois (ex : scanner augure + Frappe Localisée
      // pour le Décurion Locus, voir optionsDecurionLegion dans
      // js/unites-data.js). Chaque élément peut aussi être un objet
      // `{ nom, porteurs }` (même convention que `unite.equipement` plus
      // haut) quand un même `ajoute` combine deux objets en nombre
      // différent (ex : une Pince — porteurs implicite 1 — ET deux
      // fuseurs — porteurs 2 — voir Dreadnought Leviathan).
      if (val && opt.ajoute) {
        const items = Array.isArray(opt.ajoute) ? opt.ajoute : [opt.ajoute];
        for (const item of items) {
          const nom = typeof item === "string" ? item : item.nom;
          const porteurs = (typeof item !== "string" && item.porteurs) || 1;
          ajouterCompte(nom, compteRole * porteurs);
        }
      }
      // Support de remplaceIntegral sur les case (ex : paire de griffes qui retire l'épée)
      if (val && opt.remplaceIntegral) {
        const cibles = Array.isArray(opt.remplaceIntegral)
          ? opt.remplaceIntegral
          : [opt.remplaceIntegral];
        for (const cible of cibles) {
          const alternatives = Array.isArray(cible) ? cible : [cible];
          const cle = alternatives.join("|");
          const existant = totalRemplaceIntegral.get(cle) || {
            alternatives,
            total: 0,
          };
          existant.total += compteRole;
          totalRemplaceIntegral.set(cle, existant);
        }
      }
    } else if (opt.type === "paire") {
      if (val) {
        for (const cible of opt.remplaceListe) {
          const trouve = resoudreCible(cible);
          if (trouve) retirer(trouve);
        }
        const items = Array.isArray(opt.ajoute) ? opt.ajoute : [opt.ajoute];
        for (const item of items) {
          const nom = typeof item === "string" ? item : item.nom;
          const porteurs = (typeof item !== "string" && item.porteurs) || 1;
          ajouterCompte(nom, compteRole * porteurs);
        }
      }
    } else if (opt.type === "multi") {
      for (const i of val)
        ajouterCompte((opt.prefixe || "") + opt.choix[i].nom, compteRole);
    } else if (opt.type === "quantite") {
      if (val > 0) {
        ajouterCompte(val + " × " + opt.ajoute, val);
        // `remplaceIntegral` accepte aussi un tableau : une même
        // option peut faire disparaître PLUSIEURS objets de base à la
        // fois (ex : « Paire de griffes Lightning » remplaçant à la
        // fois le bolter ET le pistolet bolter — voir
        // optionsEscouadeEtatMajorVeteran, js/unites-data.js). Chaque
        // élément de ce tableau peut lui-même être un tableau
        // d'alternatives (voir resoudreCible ci-dessus).
        if (opt.remplaceIntegral) {
          const cibles = Array.isArray(opt.remplaceIntegral)
            ? opt.remplaceIntegral
            : [opt.remplaceIntegral];
          for (const cible of cibles) {
            const alternatives = Array.isArray(cible) ? cible : [cible];
            const cle = alternatives.join("|");
            const existant = totalRemplaceIntegral.get(cle) || {
              alternatives,
              total: 0,
            };
            existant.total += val;
            totalRemplaceIntegral.set(cle, existant);
          }
        }
      }
    }
  }

  for (const { alternatives, total } of totalRemplaceIntegral.values()) {
    const trouve = alternatives.find((n) => comptes.has(n));
    if (trouve) retirer(trouve, total);
  }

  return comptes;
}

// Rétrocompatible : simple liste des noms d'équipement présents (compte
// > 0), sans leur nombre de porteurs — consommé par optionRealisable
// (comparaisons de présence/absence) et par la ligne "Équipement" de la
// fiche récap (construireFiche), qui n'affiche pas de compte.
function equipementFinal(unite, instance, sansOption = null) {
  return [...calculerEquipementComptes(unite, instance, sansOption).keys()];
}

// Nom (sans le suffixe "(liste ...)") de l'Arme sur Pivot actuellement
// choisie via l'option "pivot" (optionPivotLegion, js/unites-data.js),
// ou null si « — Aucun — » est sélectionné (ou si l'unité n'a pas
// cette option). Sert aux Décurion Defensor (exige une Arme sur Pivot,
// sauf Lanceur Havoc) et Sagittar/Lanius (exigent l'absence de toute
// Arme sur Pivot), qui dépendent d'une AUTRE option de la même
// Figurine plutôt que de leur propre équipement — voir
// optionsDecurionLegion dans js/unites-data.js.
function armeSurPivotChoisie(unite, instance) {
  const optPivot = unite.options.find((o) => o.id === "pivot");
  if (!optPivot) return null;
  const val = instance.valeurs.pivot;
  return val ? nomCourt(optPivot.choix[val].nom) : null;
}

/* Une option est-elle actuellement réalisable ? (grise le champ
   sinon). Exemples : la baïonnette exige de conserver le bolter ;
   la paire de griffes exige que bolter ET pistolet soient encore
   là ; le cyber-familier est interdit à la variante à Réacteurs ;
   `requiertAbsenceUnite: idUnite` interdit l'option tant que cette
   autre unité fait partie de la liste (ex : Khârn ne peut échanger
   La Trancheuse contre La Carnassière Reforgée que si Angron n'est
   pas dans la même Armée) ; `requiertLegion: idLegion` réserve
   l'option à la Légion (ou une Légion Alliée) indiquée (ex : Décurion
   Sagittar/Lanius, réservés Imperial Fists/Sons of Horus) ;
   `requiertEquipUnDe: [...]` généralise requiertEquip à un « OU » de
   plusieurs objets (ex : Décurion sur Sicaran, ouvert à l'autocanon
   accélérateur jumelé DE BASE ou au canon rotatif Punisher, mais pas
   aux autres remplacements de tourelle) ; `requiertPivotArme`/
   `interditPivotArme` conditionnent l'option à la présence/l'absence
   d'une Arme sur Pivot déjà choisie via l'option "pivot" (voir
   armeSurPivotChoisie ci-dessus). */
// Une Légion requise (`requiertLegion`, sur une option entière ou sur
// une entrée de `choix`) est-elle satisfaite par l'état actuel de
// l'Armée ? Centralise quatre sources possibles :
// 1. La Légion unique de Legio Astartes (etat.legion).
// 2. Une Légion Alliée (`legionsAlliees`, seulement pour les options
//    qui l'acceptent déjà — voir `avecLegionsAlliees`).
// 3. Les 2 ou 3 Légions choisies pour une Armée Légions Brisées
//    (`Organigramme.legionsBriseesActuelles()`) : câblage réel de la
//    Règle « Legion Armouries » du PDF Shattered Legions (p. 3, « The
//    Controlling Player may select from any of the Armoury pages
//    selected as part of the Shattered Legion Faction Trait ») — toute
//    option d'Arsenal de Légion déjà câblée sur ce site devient donc
//    disponible dès que sa Légion figure parmi celles choisies.
//    Simplification assumée (documentée dans CLAUDE.md) : le livre
//    limite chaque Modèle à l'Armurerie d'UNE SEULE Légion parmi celles
//    choisies ; ce site ne verrouille pas ce choix par Modèle et laisse
//    piocher librement parmi les options de chacune des Légions
//    choisies sur un même Modèle.
// 4. La Légion choisie pour le Serment du Moment Panoplie d'Antan
//    (Blackshields, `det.legionPanoplie`) du Détachement qui occupe
//    `instance` — même mécanique « Legion Armouries » que ci-dessus,
//    mais une seule Légion choisie par Détachement plutôt que 2-3 pour
//    toute l'Armée. Ne s'applique que si `instance` est fournie (les
//    entrées de `choix`/options simples n'en ont pas toujours besoin).
function legionRequiseSatisfaite(
  legionRequise,
  { legionsAlliees, instance } = {},
) {
  if (!orgaPret || typeof Organigramme === "undefined") return false;
  if (Organigramme.legionActuelle() === legionRequise) return true;
  if (legionsAlliees && Organigramme.legionsAlliees().includes(legionRequise))
    return true;
  if (
    Organigramme.factionActuelle() === "legions-brisees" &&
    Organigramme.legionsBriseesActuelles().includes(legionRequise)
  )
    return true;
  if (
    instance &&
    Organigramme.factionActuelle() === "blackshields" &&
    Organigramme.legionPanoplieDe(instance.uid) === legionRequise
  )
    return true;
  return false;
}

// La Légion (ou une Légion Alliée) actuelle de l'Armée satisfait-elle
// `opt.requiertLegion` ? Extrait d'optionRealisable pour être réutilisé
// tel quel par synchroniserConfig (ci-dessous), qui masque entièrement
// l'option — plutôt que de la griser comme le reste d'optionRealisable —
// quand la Légion ne correspond pas : une option comme Arcane de
// Prospero (réservée Thousand Sons) est ajoutée à la quasi-totalité des
// Unités État-major génériques, où elle ne serait jamais qu'un grisé
// permanent et inutile pour les 17 autres Légions.
function optionLegionOk(opt, instance) {
  if (!opt.requiertLegion) return true;
  return legionRequiseSatisfaite(opt.requiertLegion, {
    legionsAlliees: true,
    instance,
  });
}

// Même principe qu'optionLegionOk ci-dessus, mais pour `opt.requiertSerment`
// (ex : Deathlock/Doomlock/Lame de Halo, Serment du Moment La Souillure
// Xenos ; armes récupérées, Les Armes du Désespoir — Blackshields,
// js/unites-data.js, LISTES_EQUIPEMENT). Le Serment doit être actif sur
// le Détachement de CETTE instance (voir Organigramme.sermentsDe).
function optionSermentOk(opt, instance) {
  if (!opt.requiertSerment) return true;
  if (!instance || !orgaPret || !window.Organigramme) return false;
  return Organigramme.sermentsDe(instance.uid).includes(opt.requiertSerment);
}

// Même principe qu'optionLegionOk ci-dessus, mais pour `opt.requiertAllegeance`
// (ex : Hurleurs soniques/Lance sonique, Arsenal des Emperor's Children —
// combiné à `opt.requiertLegion` sur la même option, puisque la page exige
// à la fois le Trait Emperor's Children ET Renégat). Pas de repli sur une
// Allégeance « alliée » : cette notion n'existe pas dans ce fichier.
function optionAllegeanceOk(opt) {
  if (!opt.requiertAllegeance) return true;
  if (!orgaPret || typeof Organigramme === "undefined") return false;
  return Organigramme.allegeanceActuelle() === opt.requiertAllegeance;
}

// La Figurine a-t-elle acquis la Règle Spéciale Theurgika Maximus ?
// Soit elle la porte en dur dans les Règles de sa variante (Archimagos
// Scoria), soit elle a coché l'Option d'Arcane Archimandrite du même nom
// (voir optionTheurgikaMaximus, js/unites-data.js). Sert de dérogation à
// technoArcaneOk ci-dessous : Liber Mechanicum p. 45, « on ignore les
// restrictions basées sur les Traits de Faction quand on sélectionne des
// Rites Cybertheurgiques pour une Figurine ayant cette Règle Spéciale ».
function theurgikaMaximusAcquis(unite, instance) {
  if (!instance) return false;
  if (instance.valeurs && instance.valeurs["theurgika-maximus"]) return true;
  const variante = unite.variantes && unite.variantes[instance.variante];
  return Boolean(
    variante && (variante.regles || []).includes("Theurgika Maximus"),
  );
}

// Même principe qu'optionLegionOk ci-dessus, mais pour
// `requiertTechnoArcane` — le Techno-arcane Majeur effectif de la
// Figurine elle-même (fixe dans `traits`, ex. « Cybernetica », ou choisi
// via l'option "techno-arcane" ; voir traitFactionMechanicumDe plus bas),
// et non un état global de l'Armée comme la Légion/l'Allégeance : deux
// Unités du même Détachement peuvent parfaitement avoir des
// Techno-arcanes différents (Liber Mechanicum p. 13). Accepte un nom
// unique ou un tableau de noms. S'applique indifféremment à une option
// entière (`opt.requiertTechnoArcane`) ou à une entrée de `choix`/`multi`
// (`choix.requiertTechnoArcane`), d'où le paramètre générique `cible`.
// Une entrée marquée `theurgikaDeroge: true` (les Rites Cybertheurgiques
// réservés à un Techno-arcane) passe outre dès que la Figurine a
// Theurgika Maximus, conformément au texte de cette Règle Spéciale.
// Une entrée d'option `multi` (case à cocher) est-elle accessible ?
// Pendant, pour les cases à cocher, du filtrage que peuplerChoixSelect
// fait déjà sur les <option> d'un `choix`. Utilisé par les Rites
// Cybertheurgiques : certains réservés à un Techno-arcane, les deux
// Hétérodoxes à l'Allégeance Renégat (js/unites-data.js,
// RITES_CYBERTHEURGIQUES).
function entreeMultiAccessible(choix, unite, instance) {
  return technoArcaneOk(choix, unite, instance) && optionAllegeanceOk(choix);
}

function technoArcaneOk(cible, unite, instance) {
  if (!cible.requiertTechnoArcane) return true;
  if (cible.theurgikaDeroge && theurgikaMaximusAcquis(unite, instance))
    return true;
  const trait = traitFactionMechanicumDe(unite, instance);
  if (!trait) return false;
  const requis = Array.isArray(cible.requiertTechnoArcane)
    ? cible.requiertTechnoArcane
    : [cible.requiertTechnoArcane];
  return requis.includes(trait);
}

// Zone Mortalis : l'option n'est accessible que si le Choix de Détachement
// Principal est l'un des trois Charts Zone Mortalis (Bulwark, Strike Force,
// LineBreaker). Réservé aux options de Legio Astartes en Zone Mortalis.
function optionZoneMortalisOk(opt) {
  if (!opt.requiertZoneMortalis) return true;
  if (!orgaPret || typeof Organigramme === "undefined") return false;
  const chart = Organigramme.chartPrincipalActuel();
  return chart && chart.includes("zone-mortalis");
}

// Bouclier d'abordage : l'option n'est accessible que si la Figurine
// a déjà "Bouclier d'abordage" dans son équipement (via une autre option
// ou équipement fixe). Vérifié sur l'équipement final.
function optionBouclierAbordageOk(unite, instance) {
  if (!instance) return false;
  const finalEquip = equipementFinal(unite, instance);
  return finalEquip.includes("Bouclier d'abordage");
}

function optionRealisable(unite, instance, opt) {
  if (!optionPermise(opt, instance)) return false;
  if (
    opt.requiertAbsenceUnite &&
    armee.some((i) => i.uniteId === opt.requiertAbsenceUnite)
  )
    return false;
  if (!optionLegionOk(opt, instance)) return false;
  if (!optionAllegeanceOk(opt)) return false;
  if (!optionSermentOk(opt, instance)) return false;
  if (!technoArcaneOk(opt, unite, instance)) return false;
  if (!optionZoneMortalisOk(opt)) return false;
  if (opt.requiertBouclierAbordage && !optionBouclierAbordageOk(unite, instance)) return false;
  // Serment du Moment « Les Armes du Désespoir » (Blackshields) : empêche
  // toute option qui tenterait de remplacer le Bolter ou le Pistolet Bolter,
  // car ces deux armes DOIVENT être remplacées par une arme de récupération
  // (exclusivement) quand le Serment est actif.
  if (
    orgaPret &&
    window.Organigramme &&
    instance &&
    instance.uid &&
    Organigramme.sermentsDe(instance.uid).includes("armes-desespoir")
  ) {
    // L'option ne peut pas être une case/paire/choix/multi qui tenterait de remplacer
    // le Bolter ou le Pistolet Bolter (ou les deux pour une paire).
    if (opt.type === "choix" && (opt.remplace || opt.remplacePartiel)) {
      const cibles = Array.isArray(opt.remplace || opt.remplacePartiel)
        ? (opt.remplace || opt.remplacePartiel)
        : [opt.remplace || opt.remplacePartiel];
      if (cibles.some((n) => n === "Bolter" || n === "Pistolet bolter")) {
        return false;
      }
    } else if (opt.type === "paire" && opt.remplaceListe) {
      if (
        opt.remplaceListe.some((cible) => {
          const cibles = Array.isArray(cible) ? cible : [cible];
          return cibles.some((n) => n === "Bolter" || n === "Pistolet bolter");
        })
      )
        return false;
    }
  }
  // `interditSiOption: "<id>"` : option indisponible tant qu'une AUTRE
  // option de la même Unité est renseignée (Liber Mechanicum p. 19/22 :
  // Faisceau de conversion/Fusil à plasma phasé/Irradieur ne sont
  // accessibles que « si on ne dote pas cette Figurine d'un objet de la
  // liste des Armes de Tir du Mechanicum »). Grisée et non masquée : le
  // joueur peut lever la condition depuis la carte elle-même, en
  // reposant l'autre menu sur « — Aucun — ».
  if (opt.interditSiOption) {
    const autre = instance.valeurs[opt.interditSiOption];
    if (Array.isArray(autre) ? autre.length > 0 : Boolean(autre)) return false;
  }
  if (opt.requiertPivotArme) {
    const pivot = armeSurPivotChoisie(unite, instance);
    if (!pivot || pivot.startsWith("Lanceur Havoc sur Pivot")) return false;
  }
  if (opt.interditPivotArme && armeSurPivotChoisie(unite, instance))
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
    opt.requiertEquipUnDe &&
    !opt.requiertEquipUnDe.some((requis) =>
      equipSansElle.some((e) => e.includes(requis)),
    )
  )
    return false;
  // `opt.remplace`/entrées de `opt.remplaceListe` peuvent être un
  // tableau d'alternatives (« n'importe lequel de ces objets » — voir
  // resoudreCible, equipementFinal ci-dessus) plutôt qu'un nom exact.
  if (opt.type === "choix" && opt.remplace) {
    const cibles = Array.isArray(opt.remplace) ? opt.remplace : [opt.remplace];
    if (!cibles.some((n) => equipSansElle.includes(n))) return false;
  }
  if (
    opt.type === "paire" &&
    !opt.remplaceListe.every((cible) => {
      const cibles = Array.isArray(cible) ? cible : [cible];
      return cibles.some((n) => equipSansElle.includes(n));
    })
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
      // `parFigurine` était jusqu'ici honoré par "choix", "case" et
      // "paire" mais pas par "multi", faute d'occurrence : les options
      // Baïonnette/Surchargeur des Solar Auxilia (Liber Auxilia, +1
      // Point PAR FIGURINE chacune, plusieurs cumulables) sont les
      // premières à en avoir besoin.
      for (const i of val)
        total += opt.choix[i].cout * (opt.parFigurine ? nbFigurines : 1);
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
   EXPORT / IMPORT — un simple fichier .json reprenant les deux clés
   déjà utilisées par la persistance localStorage (liste d'unités +
   organigramme), pour transférer une liste d'une machine/navigateur à
   l'autre. L'import réutilise la validation déjà faite par
   restaurer()/Organigramme.initialiser() au chargement de la page :
   on écrit dans localStorage puis on recharge, plutôt que de
   dupliquer cette logique.
   ---------------------------------------------------------- */
// Réduit un libellé à des caractères sûrs pour un nom de fichier (garde
// lettres/chiffres, y compris accentués, tout le reste devient "-") — les
// apostrophes (ex : Emperor's Children) sont retirées plutôt que
// transformées en tiret, pour ne pas couper le mot en deux.
function nomFichierSlug(texte) {
  return texte
    .replace(/['’]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

// Segments identifiant la liste actuelle (Faction, puis sa subdivision
// - Légion/Maisonnée/Doctrine de Cohorte+Désignation de Legiones
// Auxilia selon la Faction -, puis Allégeance) : consommés par
// exporterListe() pour nommer le fichier exporté de façon reconnaissable
// sans avoir à l'ouvrir.
// Pour une Armée Legio Astartes avec une Légion choisie, le nom de la
// Légion remplace entièrement "Legio Astartes" (ex : "Sons of Horus",
// pas "Legio Astartes XVI Sons of Horus") — demande explicite du
// propriétaire (2026-08-03).
function segmentsIdentiteActuelle() {
  const faction = Organigramme.factionActuelle();
  const segments = [];
  if (faction === "legio-astartes" && Organigramme.legionActuelle()) {
    const libelle = Organigramme.libelleLegionActuelle();
    segments.push(libelle ? libelle.replace(/^[^–]+–\s*/, "") : libelle);
  } else {
    segments.push(Organigramme.libelleFactionActuelle());
    if (
      faction === "chevaliers-questoris" &&
      Organigramme.maisonneeActuelle()
    ) {
      segments.push(Organigramme.libelleMaisonneeActuelle());
    } else if (faction === "solar-auxilia") {
      const doctrine = nomDoctrineCohorteActuelle();
      if (doctrine) segments.push(doctrine);
      const idDesignation = Organigramme.designationAuxiliaActuelle
        ? Organigramme.designationAuxiliaActuelle()
        : "";
      const designation = DESIGNATIONS_LEGIONES_AUXILIA.find(
        (d) => d.id === idDesignation,
      );
      if (designation) segments.push(designation.nom);
    } else if (faction === "mechanicum") {
      const technoArcane = Organigramme.technoArcaneActuel();
      if (technoArcane) {
        // Chercher le libellé du Techno-arcane dans la constante TECHNO_ARCANES
        // (voir js/organigramme.js) pour le nommer proprement dans le fichier
        const TECHNO_ARCANES = [
          ["archimandrite", "Archimandrite"],
          ["cybernetica", "Cybernetica"],
          ["lacrymaerta", "Lacrymaerta"],
          ["myrmidax", "Myrmidax"],
          ["reductor", "Reductor"],
          ["malagra", "Malagra"],
          ["macrotek", "Macrotek"],
        ];
        const ta = TECHNO_ARCANES.find(([code]) => code === technoArcane);
        if (ta) segments.push(ta[1]);
      }
    }
  }
  segments.push(
    Organigramme.allegeanceActuelle() === "renegat" ? "renégat" : "loyaliste",
  );
  return segments.filter(Boolean);
}

// Nom de fichier "Faction-Légion-allégeance-XXXX-points.extension", partagé
// par l'Export JSON et les Téléchargements PDF/Word : reconnaissable
// sans avoir à l'ouvrir, voir segmentsIdentiteActuelle() ci-dessus.
function nomFichierArmee(extension) {
  const points = coutArmee() + "-points";
  return (
    segmentsIdentiteActuelle().map(nomFichierSlug).concat(points).join("-") +
    "." +
    extension
  );
}

function exporterListe() {
  const donnees = {
    site: "horus-heresy-listes",
    version: 1,
    armee: JSON.parse(localStorage.getItem(CLE_STOCKAGE) || "[]"),
    organigramme: JSON.parse(
      localStorage.getItem(Organigramme.cleStockageOrga()) || "null",
    ),
  };
  telechargerBlob(
    nomFichierArmee("json"),
    JSON.stringify(donnees, null, 2),
    "application/json;charset=utf-8",
  );
}

// Retourne un message d'erreur si le fichier importé n'a pas la forme
// attendue, ou null s'il est accepté (et déjà écrit dans localStorage).
function importerListe(texte) {
  let donnees;
  try {
    donnees = JSON.parse(texte);
  } catch {
    return "Fichier illisible : ce n'est pas un JSON valide.";
  }
  if (!donnees || !Array.isArray(donnees.armee)) {
    return "Fichier invalide : ce n'est pas une liste exportée depuis ce site.";
  }
  localStorage.setItem(CLE_STOCKAGE, JSON.stringify(donnees.armee));
  localStorage.setItem(
    Organigramme.cleStockageOrga(),
    JSON.stringify(donnees.organigramme || null),
  );
  return null;
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
  // Petit Seigneur de Guerre (Blackshields, Serment du Moment Dans la
  // Disgrâce, Tous sont Égaux) accorde EXACTEMENT le même bonus que
  // Maître-sergent (+1 CC/A, +1 ou +2 Cd) à une Figurine de Sous-type
  // Sergent — même code, pas de logique séparée à écrire.
  if (
    avantageId === "maitre-sergent" ||
    avantageId === "petit-seigneur-de-guerre"
  ) {
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
  if (avantageId === "custodes-prefet") {
    // Toutes les Figurines de l'Unité (p. ex. Capitaine-rempart, une
    // seule Figurine) : pas de restriction de Sous-type, à la
    // différence de Maître-sergent/Parangon de Bataille.
    return car === "PV" ? 1 : 0;
  }
  return 0;
}

// Bonus du Serment du Moment L'Hélice Brisée (Blackshields, choix
// Clone/Aberrant — voir Organigramme.choixCloneAberrantDe) : -1 en
// Commandement/Volonté/Intelligence/Sang-froid pour Clone ET Aberrant,
// +1 Force/Attaques en plus pour Aberrant — sauf Sous-type Sergent/
// Champion/Spécialiste/État-major, exempté par le livre. Séparé de
// bonusAvantagePrincipal (Case Principale) : un Serment s'applique à
// toute Unité du Détachement, pas à une seule Case.
function bonusSermentDuMoment(variante, nomLigne, car, instance) {
  if (!instance || !orgaPret || !window.Organigramme) return 0;
  const choix = Organigramme.choixCloneAberrantDe(instance.uid);
  if (!choix) return 0;
  const exclu = ["Sergent", "Champion", "Spécialiste", "État-major"].some(
    (st) => sousTypesLigne(variante, nomLigne).includes(st),
  );
  if (exclu) return 0;
  if (["Cd", "Vo", "Int", "Sf"].includes(car)) return -1;
  if (choix === "aberrant" && (car === "F" || car === "A")) return 1;
  return 0;
}

// Applique le(s) bonus à une valeur de caractéristique (seules M, CC,
// CT, F, E, PV, I, A, Cd, Sf, Vo, Int sont numériques ; Sv/Inv, en
// chaîne, ne reçoivent jamais de bonus). Vétérans de Combat plafonne à
// 10. `instance` (facultatif) ajoute le bonus des Serments du Moment
// actifs (Blackshields) en plus de celui de l'Avantage Principal —
// les deux peuvent se cumuler (2 Serments possibles par Détachement
// Principal).
function appliquerBonusPrincipal(
  avantageId,
  variante,
  nomLigne,
  car,
  valeur,
  instance,
) {
  const bonus =
    bonusAvantagePrincipal(avantageId, variante, nomLigne, car) +
    bonusSermentDuMoment(variante, nomLigne, car, instance);
  if (bonus === 0 || typeof valeur !== "number") return valeur;
  const plafond = avantageId === "veterans-combat" ? 10 : Infinity;
  return Math.min(plafond, valeur + bonus);
}

// Indice de défilement horizontal pour les tables de profil/armes
// (voir construireTableProfil et construireTableArmes) : sur téléphone,
// ces tables ont plus de colonnes que l'écran n'en montre, et défilent
// DANS .table-scroll plutôt que de casser la page — mais rien ne le
// signale, en particulier sur les navigateurs mobiles qui masquent la
// barre de défilement native tant qu'on ne touche pas l'écran. Masqué
// au-delà de 601px de large (voir .table-scroll-indice, css/style.css),
// où ces tables tiennent normalement sans défiler.
function construireIndiceDefilement() {
  return el(
    "p",
    "table-scroll-indice",
    "◂ Faites glisser le tableau pour voir la suite ▸",
  );
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
  } else if (variante.profilChevalier) {
    const p = variante.profilChevalier;
    entetes = ENTETES_CHEVALIER;
    lignes = [
      {
        libelle: null,
        valeurs: [p.M, p.CC, p.CT, p.F, p.avant, p.arriere, p.I, p.A, p.PC],
      },
    ];
  } else if (variante.profilsVehicule) {
    // Profil de Titan : la CT des Profils de Bras (et de Carapace au-
    // delà du Warhound) dépend de l'Équipage choisi (option "choix"
    // obligatoire id "equipage", indice 0/1/2 = Minoris/Senioris/
    // Majoris — voir js/unites-data.js). `ctParEquipage`, sur les
    // seuls Profils concernés, donne la CT pour chacun des 3 indices ;
    // les Profils sans CT (Tête, Jambes) n'ont pas ce champ et gardent
    // simplement leur `CT` de base ("—").
    const equipageIdx =
      instance.valeurs && typeof instance.valeurs.equipage === "number"
        ? instance.valeurs.equipage
        : 0;
    entetes = [""].concat(ENTETES_TITAN);
    lignes = variante.profilsVehicule.map((p) => {
      const ct = p.ctParEquipage ? p.ctParEquipage[equipageIdx] : p.CT;
      return {
        libelle: p.nom,
        valeurs: [p.M, ct, p.principal, p.expose, p.PC, p.transport || "—"],
        ctEquipageModifiee: !!(p.ctParEquipage && equipageIdx > 0),
      };
    });
  } else if (variante.profils) {
    entetes = [""].concat(ENTETES_PROFIL);
    lignes = variante.profils.map((p) => ({
      libelle: p.nom,
      valeurs: ENTETES_PROFIL.map((c) =>
        appliquerBonusPrincipal(
          avantageId,
          variante,
          p.nom,
          c,
          p.profil[c],
          instance,
        ),
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
            instance,
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
      const car =
        variante.profilVehicule ||
        variante.profilsVehicule ||
        variante.profilChevalier
          ? null
          : ENTETES_PROFIL[indiceCol];
      const td = el("td", null, String(v));
      const bonusSerment = car
        ? bonusSermentDuMoment(variante, nomLigne, car, instance)
        : 0;
      if (
        car &&
        bonusAvantagePrincipal(avantageId, variante, nomLigne, car) !== 0
      ) {
        const avantage = AVANTAGES_PRINCIPAUX.find((a) => a.id === avantageId);
        td.className = "profil-bonus";
        if (avantage) td.title = "Bonus « " + avantage.nom + " »";
      } else if (car && bonusSerment !== 0) {
        td.className = "profil-bonus";
        td.title = "Modifié par le Serment du Moment L’Hélice Brisée";
      } else if (
        variante.profilsVehicule &&
        indiceCol === 1 &&
        ligne.ctEquipageModifiee
      ) {
        td.className = "profil-bonus";
        td.title = "CT modifiée par l'Équipage";
      }
      tr.appendChild(td);
    });
    corps.appendChild(tr);
  });
  enTete.appendChild(ligneTitres);
  table.appendChild(enTete);
  table.appendChild(corps);
  conteneur.appendChild(table);
  const enveloppe = document.createDocumentFragment();
  enveloppe.appendChild(conteneur);
  enveloppe.appendChild(construireIndiceDefilement());
  return enveloppe;
}

// Bloc « Étiquette : valeur, valeur… » de la fiche récap.
// `classeSupplementaire` : voir l'appel pour "Notes" (masquée à
// l'impression, css/style.css, .fiche-ligne--notes).
function construireLigneFiche(titre, elements, classeSupplementaire) {
  const p = el(
    "p",
    classeSupplementaire
      ? "fiche-ligne " + classeSupplementaire
      : "fiche-ligne",
  );
  p.appendChild(el("strong", null, titre + " : "));
  p.appendChild(document.createTextNode(elements.join(" · ")));
  return p;
}

/* ----------------------------------------------------------
   RÈGLES SPÉCIALES, TRAITS ET ÉQUIPEMENT D'UNITÉS (js/regles-data.js)
   — les lignes "Règles spéciales", "Traits" et "Équipement" de la
   fiche récap habillent chaque entrée reconnue d'une info-bulle
   reprenant sa définition, exactement comme la colonne "Règles
   spéciales" des tables d'armes (page armes.html). Les objets
   d'équipement qui confèrent une règle plutôt qu'un profil d'Arme
   (Cognis-signum, Servobras, Cyber-familier…) sont ainsi documentés
   sur la fiche au même titre qu'une Règle Spéciale — voir
   REGLES_DIVERSES dans js/regles-data.js. La recherche de définition
   (trouverDefinitionRegle) est partagée : voir js/main.js. Certaines
   entrées n'ont pas de définition connue (ex : "Aucune", ou des
   traits encore non documentés comme "Psyker") — le texte reste
   alors affiché tel quel, sans info-bulle.
   ---------------------------------------------------------- */

// Comme construireLigneFiche, mais pour une liste de règles/traits/
// équipement : habille chaque entrée reconnue d'un .regle-tag portant
// sa définition (voir ci-dessus). Utilisée pour les lignes "Règles
// spéciales", "Traits" et "Équipement" de la fiche récap.
// `avecArmes` (réservé à la ligne "Équipement", où le fallback ne
// risque pas de tomber sur un faux positif parmi des Traits/Règles
// Spéciales) : si aucune Règle Spéciale/Trait connu ne correspond à
// l'entrée entière, retente sur une arme de l'Arsenal reconnue
// n'importe où dans son texte (trouverArmeDansTexte, comme
// ajouterLibelleOption pour le panneau d'options) — seul le nom de
// l'arme est alors habillé, avec un résumé de son profil (resumeArme)
// en info-bulle ; la table de caractéristiques complète reste
// affichée juste en dessous (construireTablesArmes).
function construireLigneRegles(titre, regles, avecArmes) {
  const p = el("p", "fiche-ligne");
  p.appendChild(el("strong", null, titre + " : "));
  regles.forEach((regle, i) => {
    if (i > 0) p.appendChild(document.createTextNode(" · "));
    ajouterRegleFiche(p, regle, avecArmes);
  });
  return p;
}

// Résout `texte` en une définition de Règle/Trait connue
// (trouverDefinitionRegle) ou, à défaut et si `avecArmes`, une arme de
// l'Arsenal reconnue n'importe où dans le texte (trouverArmeDansTexte).
// Retourne null si rien ne correspond, sinon { avant, texteTag,
// definition, aTagArme, apres } — même forme dans les deux cas pour que
// ajouterRegleFiche n'ait qu'un seul chemin de rendu.
function resoudreRegleFiche(texte, avecArmes) {
  const definition = trouverDefinitionRegle(texte);
  if (definition) {
    return {
      avant: "",
      texteTag: texte,
      definition,
      aTagArme: false,
      apres: "",
    };
  }
  const correspondanceArme = avecArmes ? trouverArmeDansTexte(texte) : null;
  if (correspondanceArme) {
    return {
      avant: correspondanceArme.avant || "",
      texteTag: correspondanceArme.trouve,
      definition: resumeArme(correspondanceArme.arme),
      aTagArme: true,
      apres: correspondanceArme.apres || "",
    };
  }
  return null;
}

// Ajoute une entrée de la ligne "Règles spéciales"/"Traits"/"Équipement"
// à `p`, habillée d'un .regle-tag portant sa définition quand elle est
// reconnue (voir resoudreRegleFiche). Une entrée d'Équipement ajoutée
// via une option `prefixeFiche` (ex : "Sergent : Nuncio-vox", voir
// equipementFinal) ne correspond telle quelle à aucune Règle/Arme
// connue : si la résolution échoue sur le texte entier, on retente sur
// la partie après le premier " : ", en gardant le préfixe en texte brut
// devant le tag.
function ajouterRegleFiche(p, regle, avecArmes) {
  let resultat = resoudreRegleFiche(regle, avecArmes);
  let prefixe = "";
  if (!resultat) {
    const correspondancePrefixe = regle.match(/^(.+? : )(.+)$/);
    if (correspondancePrefixe) {
      resultat = resoudreRegleFiche(correspondancePrefixe[2], avecArmes);
      if (resultat) prefixe = correspondancePrefixe[1];
    }
  }
  if (!resultat) {
    p.appendChild(document.createTextNode(regle));
    return;
  }
  if (prefixe || resultat.avant)
    p.appendChild(document.createTextNode(prefixe + resultat.avant));
  const tag = creerRegleTag(resultat.texteTag, resultat.definition);
  // Marqueur lu par construireDefinitions : cette arme a déjà sa table
  // de caractéristiques complète plus haut sur la fiche (ou dans
  // l'export imprimé), inutile de répéter son résumé dans le bloc
  // « Définitions ».
  if (resultat.aTagArme) tag.classList.add("regle-tag-arme");
  p.appendChild(tag);
  if (resultat.apres) p.appendChild(document.createTextNode(resultat.apres));
}

// Ajoute un nom de Type/Sous-type de Figurine à `parent`, habillé d'un
// .regle-tag portant sa définition (voir REGLES_DIVERSES dans
// js/regles-data.js) s'il en existe une, ou en texte brut sinon —
// utilisé par construireLigneType ci-dessous.
function ajouterTypeTag(parent, nom) {
  const definition = trouverDefinitionRegle(nom);
  if (!definition) {
    parent.appendChild(document.createTextNode(nom));
    return;
  }
  parent.appendChild(creerRegleTag(nom, definition));
}

// Ajoute le libellé d'une option "case"/"paire" (panneau de config
// d'une unité) à son <label>, habillé d'un .regle-tag portant sa
// définition s'il en existe une — comme ajouterTypeTag, mais le
// libellé se termine souvent par une parenthèse de coût/condition
// (ex : « Décurion Defensor (+30 pts, requiert une Arme sur Pivot
// autre qu'un Lanceur Havoc sur Pivot) ») qui doit rester en texte
// brut hors de l'info-bulle : seul le nom avant cette parenthèse
// finale est habillé. Deux sources de définition, dans cet ordre :
// 1) une Règle Spéciale/Trait connu (REGLES_DIVERSES — ex : les 4
//    améliorations de Décurion de Légion, Vexillum, Cyber-familier) ;
// 2) à défaut, une arme de l'Arsenal reconnue n'importe où dans le
//    libellé (trouverArmeDansTexte — ex : Bombes à fusion, Missile
//    traqueur) : seul le nom de l'arme est habillé, avec un résumé de
//    son profil (resumeArme) en info-bulle, la table complète restant
//    réservée à la fiche récap une fois l'option cochée.
function ajouterLibelleOption(label, libelle) {
  const definition = trouverDefinitionRegle(libelle);
  if (definition) {
    const correspondance = libelle.match(/^(.*?)(\s*\([^)]*\))?$/);
    label.appendChild(creerRegleTag(correspondance[1], definition));
    if (correspondance[2])
      label.appendChild(document.createTextNode(correspondance[2]));
    return;
  }
  const correspondanceArme = trouverArmeDansTexte(libelle);
  if (correspondanceArme) {
    if (correspondanceArme.avant)
      label.appendChild(document.createTextNode(correspondanceArme.avant));
    label.appendChild(
      creerRegleTag(
        correspondanceArme.trouve,
        resumeArme(correspondanceArme.arme),
      ),
    );
    if (correspondanceArme.apres)
      label.appendChild(document.createTextNode(correspondanceArme.apres));
    return;
  }
  label.appendChild(document.createTextNode(libelle));
}

// Ajoute le nom d'une variante (fieldset "Variante" du panneau de
// config d'une unité, ex : « Centurion » / « Centurion à Réacteurs »)
// à son <label>, en habillant le suffixe « Réacteurs » d'une info-
// bulle (REGLES_DIVERSES) s'il y figure, pour expliquer ce que la
// variante ajoute sans avoir à la sélectionner d'abord — le reste du
// nom (Sous-type Antigrav, Massif (2), Frappe en Profondeur…) n'est
// visible qu'une fois la variante choisie (ligne "Règles spéciales"
// de la fiche récap). Recherche fixe sur "Réacteurs" (pas de recherche
// générique dans tout le glossaire, contrairement à
// ajouterLibelleOption) : un nom de variante est un nom de Figurine,
// pas un libellé d'option — le risque de faux positif y serait trop
// grand pour une recherche libre.
function ajouterNomVariante(label, nom) {
  const definition = trouverDefinitionRegle("Réacteurs");
  const indice = definition ? nom.indexOf("Réacteurs") : -1;
  if (indice === -1) {
    label.appendChild(document.createTextNode(nom));
    return;
  }
  if (indice > 0)
    label.appendChild(document.createTextNode(nom.slice(0, indice)));
  label.appendChild(
    creerRegleTag(nom.slice(indice, indice + "Réacteurs".length), definition),
  );
  const reste = nom.slice(indice + "Réacteurs".length);
  if (reste) label.appendChild(document.createTextNode(reste));
}

// Ligne "Type" de la fiche récap : habille chaque Type et Sous-type de
// Figurine d'une info-bulle, comme construireLigneRegles pour les
// Règles Spéciales. `typeBrut` (variante.type) suit le format "Type
// (Sous-type, Sous-type)" pour un profil à une seule figurine, ou
// "NomLigne : Type (Sous-type) · NomLigne : Type" pour un profil à
// plusieurs figurines (voir sousTypesLigne) : dans ce dernier cas,
// chaque "NomLigne : " reste en texte brut, seuls les Types et
// Sous-types entre parenthèses reçoivent une info-bulle.
function construireLigneType(typeBrut) {
  const p = el("p", "fiche-ligne");
  p.appendChild(el("strong", null, "Type : "));
  typeBrut.split(" · ").forEach((segment, i) => {
    if (i > 0) p.appendChild(document.createTextNode(" · "));
    let reste = segment;
    const separateur = segment.indexOf(" : ");
    if (separateur !== -1) {
      p.appendChild(document.createTextNode(segment.slice(0, separateur + 3)));
      reste = segment.slice(separateur + 3);
    }
    const correspondance = reste.match(/^(.*?)\s*\(([^)]*)\)\s*$/);
    if (!correspondance) {
      ajouterTypeTag(p, reste);
      return;
    }
    ajouterTypeTag(p, correspondance[1]);
    p.appendChild(document.createTextNode(" ("));
    correspondance[2].split(",").forEach((sousType, j) => {
      if (j > 0) p.appendChild(document.createTextNode(", "));
      ajouterTypeTag(p, sousType.trim());
    });
    p.appendChild(document.createTextNode(")"));
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

// Suffixes entre parenthèses en fin de nom d'Arme qui désignent une
// Faction précise plutôt qu'une bande de portée ou un second profil de
// montage (ex : « Chargeur volkite (Solar Auxilia) », « Pistolet
// bolter (Mechanicum) ») — à ne pas confondre avec « (< 15 pas) »,
// « (Secondaire) », « (Stormlord) »... qui restent groupés ensemble
// quelle que soit la Faction de l'Unité (voir armesDuMemeMontage
// ci-dessous). Basé sur les libellés de FACTIONS (js/organigramme.js).
const SUFFIXES_FACTION_ARMES = {
  "Solar Auxilia": "solar-auxilia",
  Mechanicum: "mechanicum",
  Skitarii: "skitarii",
  "Legio Custodes": "legio-custodes",
  "Legio Titanicus": "legio-titanicus",
  "Chevaliers Questoris": "chevaliers-questoris",
};

// Faction visée par le suffixe entre parenthèses d'un nom d'Arme
// (`arme.nom`, pas `arme.nomBase` qui l'a déjà retiré), ou `null` si
// son suffixe ne désigne pas de Faction connue (ou n'a pas de suffixe).
function suffixeFactionArme(arme) {
  const correspondance = arme.nom.match(/\(([^)]+)\)\s*$/);
  return (correspondance && SUFFIXES_FACTION_ARMES[correspondance[1]]) || null;
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
        const nomBase = (
          separateur === -1 ? arme.nom : arme.nom.slice(0, separateur)
        ).replace(/\s*\([^)]*\)\s*$/, "");
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
// du type « (à la place de… ) »), et à position égale, le texte
// effectivement trouvé le plus long l'emporte (« Bolter lourd » plutôt
// que « Bolter »). Comparer sur la longueur du TEXTE TROUVÉ (nomBase),
// pas sur `arme.nom.length` (nom affiché) : un suffixe cosmétique long
// (« — Frag », « (Solar Auxilia) ») rendrait sinon une arme générique
// arbitrairement « gagnante » face à une arme plus spécifique mais au
// nom affiché plus court (ex : « Lance-grenades Erelim » perdant contre
// « Lance-grenades (Solar Auxilia) — Krak » alors que seul « Lance-
// grenades » est commun aux deux et que Erelim est la vraie correspondance).
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
    const longueur = correspondance[0].length;
    if (
      !meilleur ||
      i < meilleur.i ||
      (i === meilleur.i && longueur > meilleur.longueur)
    ) {
      meilleur = { i, longueur, arme };
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

// Comme trouverArmeDansTexte, mais retourne TOUTES les Armes distinctes
// reconnues dans le texte plutôt que la seule meilleure correspondance —
// une entrée d'équipement combine parfois plusieurs Armes en une seule
// chaîne (ex : « Pince de siège Leviathan et fuseur », « Paire de
// pinces de siège Leviathan et deux fuseurs »), chacune méritant sa
// propre ligne de caractéristiques (voir construireTablesArmes).
// Ne cherche QUE dans la partie du texte AVANT la première parenthèse :
// le suffixe parenthétique (« (à la place de X) », « (bras n°1) »,
// « (liste Équipement d'Officier de Légion (X)) »...) est purement
// descriptif dans ce fichier (voir CLAUDE.md) et mentionne très souvent
// une Arme différente de celle réellement équipée (ex : « Fusil à pompe
// Astartes (à la place du bolter) » ne doit PAS faire apparaître le
// Bolter, déjà affiché séparément) — vérifié par audit sur l'ensemble
// du fichier avant d'écrire cette restriction (sans elle, ~450 entrées
// auraient fait apparaître une Arme non équipée).
// Répète trouverArmeDansTexte sur ce qui reste après avoir retiré
// chaque correspondance déjà trouvée (le texte restant se réduit à
// chaque tour, la boucle termine donc toujours).
function trouverToutesArmesDansTexte(texteComplet) {
  const iParenthese = texteComplet.indexOf("(");
  const texte =
    iParenthese === -1 ? texteComplet : texteComplet.slice(0, iParenthese);
  const trouvees = [];
  let reste = texte;
  let correspondance = trouverArmeDansTexte(reste);
  while (correspondance) {
    trouvees.push(correspondance.arme);
    reste = correspondance.avant + " " + correspondance.apres;
    correspondance = trouverArmeDansTexte(reste);
  }
  return trouvees;
}

// Résumé sur une seule ligne du profil d'une arme trouvée par
// trouverArmeDansTexte (mêmes abréviations d'en-têtes que les tables
// de l'Arsenal, ENTETES_TIR/ENTETES_MELEE) — sert d'info-bulle aux
// options d'équipement (ajouterLibelleOption) : une table complète
// (construireTableArmes) n'a pas sa place dans une info-bulle, la
// table détaillée reste visible sur la fiche récap une fois l'option
// cochée.
function resumeArme(arme) {
  let texte = arme.entetes
    .map((titre, i) => titre + " " + arme.stats[i])
    .join(" · ");
  if (arme.regles && arme.regles !== "-") texte += " — " + arme.regles;
  if (arme.traits && arme.traits !== "-") texte += " [" + arme.traits + "]";
  return texte;
}

// construireCelluleReglesArme (cellule "Règles spéciales" d'une ligne
// d'arme) est partagée avec l'Arsenal — voir js/main.js.

// Pluralise un nom français : pluralise le premier mot (nom principal) et
// le dernier mot s'il se termine par -e (adjectif féminin).
const pluraliser = (nom, compte) => {
  if (compte <= 1 || !nom || nom.endsWith("s")) return nom;
  const words = nom.split(' ');
  // Pluralise le premier mot (nom principal) s'il ne finit pas par 's'
  if (!words[0].endsWith('s')) {
    words[0] = words[0] + 's';
  }
  // Pluralise le dernier mot s'il commence par minuscule, finit par -e et pas -es
  if (words.length > 1) {
    const lastWord = words[words.length - 1];
    if (lastWord[0] === lastWord[0].toLowerCase() &&
        lastWord.endsWith('e') && !lastWord.endsWith('es')) {
      words[words.length - 1] = lastWord + 's';
    }
  }
  return words.join(' ');
};

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

  for (const { arme, compte } of armes) {
    const tr = document.createElement("tr");
    const th = document.createElement("th");
    th.scope = "row";
    th.className = "gauche";
    // Préfixe le nom du nombre de Figurines qui portent cette Arme
    // (ex : « 9 Fusils bolter ») — voir calculerEquipementComptes.
    // Pluralise le nom de l'arme si compte > 1.
    th.textContent = compte + " " + pluraliser(arme.nom, compte);
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
  const enveloppe = document.createDocumentFragment();
  enveloppe.appendChild(conteneur);
  enveloppe.appendChild(construireIndiceDefilement());
  return enveloppe;
}

// Repère, dans l'équipement final, les armes reconnues dans l'Arsenal
// (sans doublon, dans l'ordre d'apparition) et construit une table de
// caractéristiques par jeu d'en-têtes rencontré (Tir / Mêlée), chaque
// ligne préfixée du nombre de Figurines qui portent cette Arme (voir
// calculerEquipementComptes/construireTableArmes ci-dessus).
// `equipementComptes` : Map nom → compte (calculerEquipementComptes).
// `factionUnite` (ex : "solar-auxilia", "legio-astartes" par défaut) :
// écarte les profils réservés à une AUTRE Faction que celle de
// l'Unité affichée (voir suffixeFactionArme) — sans elle, une Unité
// Legio Astartes équipée d'un « Chargeur volkite » verrait aussi
// apparaître « Chargeur volkite (Solar Auxilia) » et « (Mechanicum) »
// dans sa table, qui ne la concernent pas.
function construireTablesArmes(equipementComptes, factionUnite) {
  const faction = factionUnite || "legio-astartes";
  const fragment = document.createDocumentFragment();
  const armesTrouvees = []; // { arme, compte }
  const entrees = new Map(); // cle -> entrée déjà poussée dans armesTrouvees
  for (const [texte, compteTexte] of equipementComptes) {
    // trouverToutesArmesDansTexte (pas seulement la meilleure
    // correspondance) : une entrée d'équipement combine parfois
    // plusieurs Armes en une seule chaîne (ex : « Pince de siège
    // Leviathan et fuseur ») — chacune doit recevoir sa propre ligne de
    // caractéristiques, au même compte de porteurs (`compteTexte`).
    for (const armeTrouvee of trouverToutesArmesDansTexte(texte)) {
      // Un montage identifié entraîne tous ses profils (voir
      // construireIndexArmes), pas seulement celui retenu par
      // trouverToutesArmesDansTexte pour la correspondance.
      const nomBaseMinuscule = armeTrouvee.nomBase.toLowerCase();
      const candidats = indexArmes.filter(
        (arme) => arme.nomBase.toLowerCase() === nomBaseMinuscule,
      );
      // Priorité : le profil propre à la Faction de l'Unité s'il existe
      // (exclut alors le profil générique ET ceux des autres Factions,
      // ex : Unité Solar Auxilia → seul « Chargeur volkite (Solar
      // Auxilia) » compte, pas le « Chargeur volkite » générique) ;
      // sinon le(s) profil(s) générique(s) sans suffixe de Faction (ex :
      // Unité Legio Astartes → seul « Chargeur volkite » compte, pas
      // « (Solar Auxilia) »/« (Mechanicum) ») ; sinon (filet de sécurité,
      // ne devrait plus arriver depuis que « Batterie de bolters lourds
      // Gravis » a un profil générique — voir CLAUDE.md), si l'Arsenal
      // n'a QUE des profils réservés à d'autres Factions pour ce montage,
      // les montrer quand même plutôt que de laisser la table vide.
      const propresFaction = candidats.filter(
        (arme) => suffixeFactionArme(arme) === faction,
      );
      const generiques = candidats.filter((arme) => !suffixeFactionArme(arme));
      let retenus = propresFaction.length
        ? propresFaction
        : generiques.length
          ? generiques
          : candidats;
      // Un composant Secondaire d'Arme Combinée (« Combi » dans `regles`)
      // ne porte pas toujours son propre profil de Bolter (Principal)
      // sous le même nomBase : la plupart des montages de base (Combi-
      // fuseur, Combi-plasma...) partagent un seul profil générique
      // « Combi-arme — Bolter (Principal) » (armes-data.js, catégorie
      // « Armes Combinées ») plutôt que d'en dupliquer un par montage —
      // contrairement à des montages comme Combi-lance-flammes alchim ou
      // Éclateur à aiguilles, qui ont déjà le leur sous le même nomBase
      // (`retenus` le contient alors déjà, ne pas l'ajouter en double).
      // « Principal » (sans la parenthèse fermante, pour matcher aussi
      // l'accord féminin « Principale » de l'Arquebuse à bolts Adrastus).
      const estComposantCombi = retenus.some(
        (arme) => arme.regles && arme.regles.includes("Combi"),
      );
      const aDejaSonPropresPrincipal = retenus.some((arme) =>
        arme.nom.includes("Principal"),
      );
      if (estComposantCombi && !aDejaSonPropresPrincipal) {
        const bolterPrincipalGenerique = indexArmes.find(
          (arme) => arme.nom === "Combi-arme — Bolter (Principal)",
        );
        if (bolterPrincipalGenerique)
          retenus = [...retenus, bolterPrincipalGenerique];
      }
      for (const arme of retenus) {
        // Le dédoublonnage se fait sur `nom` + jeu d'en-têtes (Tir/Mêlée),
        // pas sur `nom` seul : une Arme à la fois « Découpeur laser¹ »
        // (Tir) ET « Découpeur laser¹ » (Mêlée), même intitulé des deux
        // côtés par convention (voir la note « ¹ » sur chaque groupe
        // d'ARMES_TIR/ARMES_MELEE concerné), a deux profils DISTINCTS à
        // conserver malgré le nom identique — dédoublonner sur `nom` seul
        // en ignorerait un des deux silencieusement.
        const cle = arme.nom + "|" + (arme.entetes === ENTETES_TIR ? "T" : "M");
        const existante = entrees.get(cle);
        if (existante) {
          // Deux entrées d'équipement distinctes résolvent la même Arme
          // (ex : un échange `quantite` de la même Arme que celle déjà
          // présente en équipement de base) : leurs comptes s'additionnent
          // plutôt que d'ignorer silencieusement la seconde occurrence.
          existante.compte += compteTexte;
          continue;
        }
        const entree = { arme, compte: compteTexte };
        entrees.set(cle, entree);
        armesTrouvees.push(entree);
      }
    }
  }

  const groupes = [];
  for (const entree of armesTrouvees) {
    let groupe = groupes.find((g) => g.entetes === entree.arme.entetes);
    if (!groupe) {
      groupe = { entetes: entree.arme.entetes, armes: [] };
      groupes.push(groupe);
    }
    groupe.armes.push(entree);
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
// Clé de regroupement = nom de base sans le "(X)" final (ex : "Brèche"
// pour "Brèche (5+)" comme pour "Brèche (6+)") : deux variantes de la
// même Règle Spéciale avec des valeurs de X différentes ne doivent
// apparaître qu'une fois dans ce bloc, pas une entrée par valeur.
function construireDefinitions(fiche) {
  const definitions = new Map();
  fiche.querySelectorAll(".regle-tag").forEach((tag) => {
    // Armes déjà détaillées dans une table de caractéristiques
    // complète plus haut sur la fiche (voir le marqueur posé dans
    // construireLigneRegles) : ne pas les répéter ici.
    if (tag.classList.contains("regle-tag-arme")) return;
    const bulle = tag.querySelector(".tooltip");
    if (!bulle || !tag.firstChild) return;
    const nom = tag.firstChild.textContent;
    const base = nom.replace(/\s*\([^)]*\)\s*$/, "");
    if (!definitions.has(base))
      definitions.set(base, { nom, texte: bulle.textContent });
  });
  if (definitions.size === 0) return null;

  const bloc = el("div", "unite-fiche-definitions");
  bloc.appendChild(el("p", "unite-definitions-titre", "Définitions"));
  const liste = document.createElement("ul");
  for (const { nom, texte } of definitions.values()) {
    const li = document.createElement("li");
    li.appendChild(el("strong", null, nom + " — "));
    li.appendChild(document.createTextNode(texte));
    liste.appendChild(li);
  }
  bloc.appendChild(liste);
  return bloc;
}

// Trait de Faction Mechanicum effectif d'une Unité/instance (un des
// sept TRAITS_FACTION_MECHANICUM, js/unites-data.js) : soit fixe (déjà
// écrit en dur dans `traits`, ex. "Cybernetica" — Unité/Figurine nommée
// propre à ce Techno-arcane), soit choisi globalement via le menu
// Techno-arcane Majeur des paramètres (`traits` contient alors le
// placeholder « [Mechanicum] », remplacé par le choix global à
// l'affichage). Retourne null hors Faction Mechanicum ou si rien ne
// correspond (ne devrait pas arriver, toute Unité Mechanicum ayant l'un
// ou l'autre — voir CLAUDE.md).
function traitFactionMechanicumDe(unite, instance) {
  if (unite.faction !== "mechanicum" || !unite.traits) return null;
  if (unite.traits.includes("[Mechanicum]")) {
    // Unité générique Mechanicum : récupère le choix global du Techno-arcane
    // depuis les paramètres de la partie.
    if (!orgaPret || typeof Organigramme === "undefined") return null;
    const technoChoisi = Organigramme.technoArcaneActuel();
    if (!technoChoisi) return null;
    // Mappe le code du Techno-arcane vers son libellé français : la constante
    // TECHNO_ARCANES n'est pas accessible ici (définie en organigramme.js),
    // donc on mappe manuellement les codes vers les noms (même mappage que
    // TECHNO_ARCANES en organigramme.js).
    const TECHNO_MAPPING = {
      archimandrite: "Archimandrite",
      cybernetica: "Cybernetica",
      lacrymaerta: "Lacrymaerta",
      myrmidax: "Myrmidax",
      reductor: "Reductor",
      malagra: "Malagra",
      macrotek: "Macrotek",
    };
    return TECHNO_MAPPING[technoChoisi] || null;
  }
  // Unité propre à un Techno-arcane fixe : retourne le Trait trouvé dans
  // `traits`.
  return (
    unite.traits.find((t) => TRAITS_FACTION_MECHANICUM.includes(t)) || null
  );
}

// Même mécanique que traitFactionMechanicumDe ci-dessus, pour le Trait
// de Faction [Skitarii] (Conclaves Skitarii, sept TRAITS_FACTION_
// SKITARII — Acquisitor/Expurgator/Vindicator/Flagellator,
// js/unites-data.js) : soit fixe (déjà écrit en dur dans `traits` —
// aucune Unité de ce fichier aujourd'hui, réservé aux futures
// publications propres à un Conclave), soit choisi via l'option
// "trait-skitarii" (`traits` contient alors le placeholder «
// [Skitarii] », voir optionTraitSkitarii, js/unites-data.js). Retourne
// null hors Faction Skitarii ou si rien ne correspond.
function traitFactionSkitariiDe(unite, instance) {
  if (unite.faction !== "skitarii" || !unite.traits) return null;
  if (unite.traits.includes("[Skitarii]")) {
    const opt = unite.options.find((o) => o.id === "trait-skitarii");
    if (!opt) return null;
    return opt.choix[instance.valeurs["trait-skitarii"]].nom;
  }
  return unite.traits.find((t) => TRAITS_FACTION_SKITARII.includes(t)) || null;
}

// Dominion Éthérique effectif d'une Unité (un des 8 DOMINIONS_ETHERIQUES_
// NOMS, js/unites-data.js) : soit fixe (déjà écrit en dur dans `traits`,
// ex. Ka'bandha — « Massacre Insouciant »), soit résolu par le choix
// d'Armée unique (menu « Dominion Éthérique », js/organigramme.js — pas
// d'option par Unité ici, contrairement à traitFactionMechanicumDe/
// traitFactionSkitariiDe ci-dessus, le livre imposant un seul Dominion
// pour toute l'Armée). Retourne null hors Faction Démons de la Tempête
// de la Ruine, ou si aucun Dominion n'a encore été choisi pour l'Armée.
function dominionEtheriqueDe(unite) {
  if (unite.faction !== "daemons-ruinstorm" || !unite.traits) return null;
  if (unite.traits.includes("[Dominion Éthérique]")) {
    return (
      (orgaPret && window.Organigramme && Organigramme.dominionActuel()) || null
    );
  }
  return (
    unite.traits.find((t) => DOMINIONS_ETHERIQUES_NOMS.includes(t)) || null
  );
}

// Règles Spéciales ajoutées à la fiche par l'Avantage Principal choisi
// pour la Case Principale occupée par cette instance (champ
// `reglesAppliquees`, réservé aux Avantages « purs » — voir la
// documentation d'AVANTAGES_PRINCIPAUX, js/organigramme-data.js). Les
// Avantages plus complexes (échange d'arme, bonus de Caractéristique,
// gain de Sous-type…) n'ont pas ce champ et restent appliqués
// manuellement par le joueur, comme documenté à chacun d'eux.
// L'éligibilité (Rôle/Trait/Type/Sous-type) est déjà vérifiée par
// Organigramme.avantagesPossibles avant de permettre le choix : pas
// revérifiée ici.
function reglesAvantagePrincipalDe(instance) {
  if (!orgaPret || !window.Organigramme) return [];
  const avantageId = Organigramme.avantageDe(instance.uid);
  const avantage = AVANTAGES_PRINCIPAUX.find((a) => a.id === avantageId);
  return (avantage && avantage.reglesAppliquees) || [];
}

/* ----------------------------------------------------------
   SERMENTS DU MOMENT (Blackshields) — effets appliqués à la fiche
   récap. Voir SERMENTS_DU_MOMENT (js/organigramme-data.js) pour le
   détail de chaque champ consommé ici. Contrairement à un Avantage
   Principal (une seule Case), un Serment s'applique à TOUTE Unité du
   Détachement (voir Organigramme.sermentsDe) — d'où des fonctions
   séparées plutôt qu'une extension de reglesAvantagePrincipalDe.
   ---------------------------------------------------------- */

// Un Serment s'applique-t-il à cette Figurine ? (Type Véhicule exclu si
// `excluVehicule`, Sous-type filtré si `sousTypesRequis` — vérifié sur
// la chaîne `variante.type` complète, même convention que aSousType,
// js/organigramme.js : imprécis pour un profil à plusieurs lignes
// nommées, mais aucune Unité concernée par les Serments n'en a dans ce
// fichier à ce jour).
function sermentApplicableA(serment, variante) {
  if (serment.excluVehicule && variante.type.includes("Véhicule")) return false;
  if (
    serment.sousTypesRequis &&
    !serment.sousTypesRequis.some((st) => variante.type.includes(st))
  )
    return false;
  return true;
}

// Règles Spéciales/Traits accordés par les Serments du Moment actifs
// sur le Détachement de cette instance, plus la transformation Ligne
// (X)/Avant-garde (X) → Piller les Morts/Héroïsme Funeste (etc.) et le
// remplacement Fils Bâtards du Destin → Unités à Cogitateurs Liés (La
// Chair est Faible). Retourne la liste FINALE de Règles Spéciales à
// afficher (regles de base + Avantage Principal + Serments), prête à
// passer à construireLigneRegles.
// Règles Spéciales accordées par une OPTION cochée plutôt que par un
// objet d'Équipement : ces options portent `horsEquipement: true` (donc
// ignorées par calculerEquipementComptes) et déclarent la Règle gagnée
// dans `ajoute`. Concerne aujourd'hui Theurgika Maximus (Option d'Arcane
// Archimandrite) et, à terme, les Rites Cybertheurgiques — deux
// mécaniques du Liber Mechanicum où la Figurine « connaît » une Règle
// sans rien porter de matériel. Les entrées réservées à un Techno-arcane
// sont revérifiées ici (technoArcaneOk) : synchroniserConfig les décoche
// déjà, mais reglesFinales sert aussi aux exports PDF/Word, qui peuvent
// être générés sans passer par une resynchronisation de carte.
function reglesOptionsDe(unite, instance) {
  const ajoutees = [];
  for (const opt of unite.options || []) {
    // Un `multi` tire les noms de ses ENTRÉES cochées (Rites
    // Cybertheurgiques), pas d'un `ajoute` posé sur l'option : ne pas
    // exiger ce champ dans son cas.
    if (!opt.horsEquipement) continue;
    if (opt.type !== "multi" && !opt.ajoute) continue;
    if (!technoArcaneOk(opt, unite, instance)) continue;
    const val = instance.valeurs[opt.id];
    if (opt.type === "multi") {
      for (const indice of Array.isArray(val) ? val : []) {
        const choix = opt.choix[indice];
        if (choix && entreeMultiAccessible(choix, unite, instance))
          ajoutees.push(choix.nom);
      }
    } else if (val) {
      for (const item of Array.isArray(opt.ajoute) ? opt.ajoute : [opt.ajoute])
        ajoutees.push(typeof item === "string" ? item : item.nom);
    }
  }
  return ajoutees;
}

function reglesFinales(unite, variante, instance) {
  let regles = variante.regles
    .concat(reglesAvantagePrincipalDe(instance))
    .concat(reglesOptionsDe(unite, instance));
  if (!orgaPret || !window.Organigramme) return regles;

  // Bénéfice d'Arcane de Mechanicum : accordé automatiquement à toute
  // Figurine Mechanicum quand ce Techno-arcane est choisi.
  const beneficeArcane = Organigramme.beneficeArcaneActuel();
  if (
    beneficeArcane &&
    (unite.traits.includes("[Mechanicum]") ||
      TRAITS_FACTION_MECHANICUM.some((t) => unite.traits.includes(t))) &&
    !regles.includes(beneficeArcane)
  ) {
    regles = [...regles, beneficeArcane];
  }

  // Option d'Arcane de Mechanicum : accordée automatiquement à toute
  // Figurine Mechanicum quand ce Techno-arcane est choisi.
  const optionArcane = Organigramme.optionArcaneActuel();
  if (
    optionArcane &&
    (unite.traits.includes("[Mechanicum]") ||
      TRAITS_FACTION_MECHANICUM.some((t) => unite.traits.includes(t))) &&
    !regles.includes(optionArcane)
  ) {
    regles = [...regles, optionArcane];
  }

  // Tactica Blackshields de base (« Fils Bâtards du Destin ») : accordée
  // à TOUTE Figurine ayant le Trait Blackshields (sauf Type Véhicule),
  // pas seulement listée au Glossaire — toute Armée de Faction
  // "blackshields" en bénéficie, qu'un Serment du Moment soit actif ou
  // non (voir SERMENTS_DU_MOMENT/La Chair est Faible ci-dessous, qui la
  // REMPLACE plutôt que de s'y ajouter).
  if (
    Organigramme.factionActuelle() === "blackshields" &&
    !variante.type.includes("Véhicule") &&
    !regles.includes("Fils Bâtards du Destin")
  ) {
    regles = [...regles, "Fils Bâtards du Destin"];
  }
  const serments = Organigramme.sermentsDe(instance.uid)
    .map((id) => SERMENTS_DU_MOMENT.find((s) => s.id === id))
    .filter((s) => s && sermentApplicableA(s, variante));
  for (const serment of serments) {
    if (serment.transformeLigneVanguard) {
      regles = appliquerTransformationLigneVanguard(
        regles,
        serment.transformeLigneVanguard,
      );
    }
    if (serment.remplaceReglePar) {
      const { ancienne, nouvelle } = serment.remplaceReglePar;
      regles = regles.map((r) => (r === ancienne ? nouvelle : r));
    }
    if (serment.reglesAppliquees) {
      for (const r of serment.reglesAppliquees) {
        if (!regles.includes(r)) regles.push(r);
      }
    }
    if (
      serment.reglesAppliqueesUniteIds &&
      serment.reglesAppliqueesUniteIds.uniteIds.includes(unite.id)
    ) {
      for (const r of serment.reglesAppliqueesUniteIds.regles) {
        if (!regles.includes(r)) regles.push(r);
      }
    }
    if (
      serment.transportGagneRegle &&
      variante.type.includes("Transport") &&
      !regles.includes(serment.transportGagneRegle)
    ) {
      regles.push(serment.transportGagneRegle);
    }
  }
  return regles;
}

// Traits ajoutés par les Serments du Moment actifs (ex : Psyker,
// L'Héritage de Nikaea) — séparé de reglesFinales ci-dessus car les
// Traits s'affichent sur une ligne distincte de la fiche récap.
function traitsSermentsDe(unite, variante, instance) {
  if (!orgaPret || !window.Organigramme) return [];
  return Organigramme.sermentsDe(instance.uid)
    .map((id) => SERMENTS_DU_MOMENT.find((s) => s.id === id))
    .filter((s) => s && s.traitsAppliques && sermentApplicableA(s, variante))
    .flatMap((s) => s.traitsAppliques);
}

// Un Modèle avec le Trait Légions Brisées/Blackshields de Type
// Infanterie devient-il un Automate ? (Serment La Chair est Faible,
// Blackshields — voir SERMENTS_DU_MOMENT). Consommé par
// construireLigneType pour l'affichage, et par sermentApplicableA
// ci-dessus indirectement via variante.type (non modifié : seul
// l'AFFICHAGE change, la Figurine reste juridiquement Infanterie pour
// les autres calculs de ce fichier — même simplification que déjà
// documentée pour d'autres Serments plus haut).
function typeAfficheSermentsDe(unite, variante, instance) {
  if (!orgaPret || !window.Organigramme) return variante.type;
  const active = Organigramme.sermentsDe(instance.uid)
    .map((id) => SERMENTS_DU_MOMENT.find((s) => s.id === id))
    .some(
      (s) =>
        s &&
        s.remplaceTypeInfanterieParAutomate &&
        variante.type.includes("Infanterie"),
    );
  return active
    ? variante.type.replace("Infanterie", "Automate")
    : variante.type;
}

// Transformation Ligne (X)/Avant-garde (X) → Règle Spéciale de
// remplacement (Piller les Morts/Héroïsme Funeste) ou suppression pure
// (Faucheurs de Vies, `nomRemplacement: null`) — voir
// SERMENTS_DU_MOMENT pour le détail des trois variantes déjà utilisées.
function appliquerTransformationLigneVanguard(regles, transformation) {
  let valeur = null;
  let estAvantGarde = false;
  const restantes = regles.filter((r) => {
    const mLigne = /^Ligne \((\d+)\)$/.exec(r);
    if (mLigne) {
      valeur = Number(mLigne[1]);
      return false;
    }
    const mAvantGarde = /^Avant-garde \((\d+)\)$/.exec(r);
    if (mAvantGarde) {
      valeur = Number(mAvantGarde[1]);
      estAvantGarde = true;
      return false;
    }
    return true;
  });
  if (valeur === null && !transformation.valeurParDefaut) return regles;
  if (!transformation.nomRemplacement) return restantes;
  let x;
  if (valeur === null) {
    x = transformation.valeurParDefaut;
  } else if (transformation.multiplicateur) {
    x = valeur * transformation.multiplicateur;
  } else if (estAvantGarde && transformation.diviseurAvantGarde) {
    x = Math.round(valeur / transformation.diviseurAvantGarde);
  } else {
    x = valeur;
  }
  return [...restantes, transformation.nomRemplacement + " (" + x + ")"];
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
  const equipementComptes = calculerEquipementComptes(unite, instance);
  fiche.appendChild(
    construireLigneRegles(
      unite.equipementLibelle || "Équipement",
      [...equipementComptes.keys()],
      true,
    ),
  );
  fiche.appendChild(construireTablesArmes(equipementComptes, unite.faction));
  // [Allégeance], [Legiones Astartes], [Questoris Familia], [Legio
  // Custodes] et [Anathema Psykana] sont communs à toutes les unités de
  // la Légion/Faction : ne pas les afficher sur la fiche évite de les y
  // répéter systématiquement. La ligne disparaît s'il ne reste aucun
  // trait propre à l'unité.
  // [Mechanicum] et [Skitarii] sont différents : remplacés (pas juste
  // masqués) par le Trait de Faction effectif de cette Unité
  // (traitFactionMechanicumDe/traitFactionSkitariiDe ci-dessus), fixe
  // ou choisi via son option dédiée.
  const traitMechanicum = traitFactionMechanicumDe(unite, instance);
  const traitSkitarii = traitFactionSkitariiDe(unite, instance);
  const traitDominion = dominionEtheriqueDe(unite);
  const traitsAffiches = unite.traits
    .filter(
      (trait) =>
        trait !== "[Allégeance]" &&
        trait !== "[Legiones Astartes]" &&
        trait !== "[Questoris Familia]" &&
        trait !== "[Legio Custodes]" &&
        trait !== "[Anathema Psykana]",
    )
    .map((trait) => {
      if (trait === "[Mechanicum]" && traitMechanicum) return traitMechanicum;
      if (trait === "[Skitarii]" && traitSkitarii) return traitSkitarii;
      if (trait === "[Dominion Éthérique]" && traitDominion)
        return traitDominion;
      return trait;
    });
  // Trait accordé par le Détachement Auxiliaire occupé (ex : Tercio
  // Véletaris), le cas échéant — s'ajoute à ceux propres à l'unité sans
  // les dupliquer (ex : l'Unité d'État-major qui débloque le Détachement
  // porte déjà son Trait Tercio en dur dans unites-data.js).
  const traitDetachement =
    window.Organigramme && Organigramme.traitDetachementDe
      ? Organigramme.traitDetachementDe(instance.uid)
      : null;
  if (traitDetachement && !traitsAffiches.includes(traitDetachement)) {
    traitsAffiches.push(traitDetachement);
  }
  // Traits accordés par un Serment du Moment actif (Blackshields, ex :
  // Psyker via L'Héritage de Nikaea) — voir traitsSermentsDe ci-dessus.
  for (const trait of traitsSermentsDe(unite, variante, instance)) {
    if (!traitsAffiches.includes(trait)) traitsAffiches.push(trait);
  }
  if (traitsAffiches.length > 0) {
    fiche.appendChild(construireLigneRegles("Traits", traitsAffiches));
  }
  fiche.appendChild(
    construireLigneRegles(
      "Règles spéciales",
      reglesFinales(unite, variante, instance),
    ),
  );
  fiche.appendChild(
    construireLigneType(typeAfficheSermentsDe(unite, variante, instance)),
  );
  if (unite.notes)
    fiche.appendChild(
      construireLigneFiche("Notes", [unite.notes], "fiche-ligne--notes"),
    );
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
   depuis actualiserSelectsCases. Retourne true si une valeur d'option a
   réellement été modifiée (donc si la fiche récap de CETTE instance a
   besoin d'être reconstruite pour cette raison — voir
   actualiserSelectsCases). */
function synchroniserConfig(carte, unite, instance) {
  let modifie = false;
  // 1. Options devenues irréalisables : on les remet à zéro.
  for (const opt of unite.options) {
    if (optionRealisable(unite, instance, opt)) continue;
    const ancienneValeur = instance.valeurs[opt.id];
    if (opt.type === "multi") {
      if (ancienneValeur.length !== 0) modifie = true;
      instance.valeurs[opt.id] = [];
    } else if (opt.type === "choix" || opt.type === "quantite") {
      if (ancienneValeur !== 0) modifie = true;
      instance.valeurs[opt.id] = 0;
    } else {
      if (ancienneValeur !== false) modifie = true;
      instance.valeurs[opt.id] = false;
    }
  }

  // 1 bis. Quantités : si l'effectif a diminué, on ramène chaque
  // option au budget « par tranche de cinq figurines ».
  for (const opt of unite.options) {
    if (opt.type !== "quantite") continue;
    const debordement =
      quantiteUtilisee(unite, instance, opt) -
      budgetQuantite(unite, instance, opt);
    if (debordement > 0) {
      const nouvelleValeur = Math.max(
        0,
        instance.valeurs[opt.id] - debordement,
      );
      if (nouvelleValeur !== instance.valeurs[opt.id]) modifie = true;
      instance.valeurs[opt.id] = nouvelleValeur;
    }
  }

  // 1 ter. Techno-arcane Majeur Mechanicum (Trait de Faction) : si
  // l'instance est placée dans un Détachement Auxiliaire/d'Apex qui
  // impose déjà un Trait via d'autres Unités (Liber Mechanicum p. 13 —
  // « toutes les Unités d'un même Détachement Auxiliaire ou d'Apex
  // […] doivent avoir la même variante », voir
  // traitFactionMechanicumRequisPour, js/organigramme.js), on aligne
  // automatiquement le choix dessus plutôt que de laisser coexister
  // deux variantes dans le même Détachement — le select correspondant
  // est aussi grisé ci-dessous tant que cette contrainte s'applique.
  const traitMechanicumRequis =
    window.Organigramme && Organigramme.traitFactionMechanicumRequisPour
      ? Organigramme.traitFactionMechanicumRequisPour(instance.uid)
      : null;
  if (traitMechanicumRequis && "techno-arcane" in instance.valeurs) {
    const indiceRequis = TRAITS_FACTION_MECHANICUM.indexOf(
      traitMechanicumRequis,
    );
    if (
      indiceRequis !== -1 &&
      instance.valeurs["techno-arcane"] !== indiceRequis
    ) {
      instance.valeurs["techno-arcane"] = indiceRequis;
      modifie = true;
    }
  }

  // 1 quater. Trait de Faction [Skitarii] (Conclaves Skitarii) : même
  // alignement automatique que le Techno-arcane Mechanicum ci-dessus,
  // mais sans filtre de famille de Détachement (voir
  // traitFactionSkitariiRequisPour, js/organigramme.js — l'uniformité
  // « Toutes les Unités sélectionnées dans un Détachement donné
  // doivent avoir le même Trait de Faction » s'y applique à TOUT
  // Détachement). S'il n'y a rien à aligner mais que le choix
  // actuellement enregistré (Vindicator/Flagellator) ne correspond
  // plus à l'Allégeance actuelle de l'Armée (changée après coup dans
  // les paramètres), on retombe sur l'entrée 0 (Acquisitor) plutôt que
  // de garder une valeur invalide/masquée dans le <select> (voir le
  // filtre requiertAllegeance posé au moment de peupler ce <select>,
  // plus haut dans construireConfig).
  const traitSkitariiRequis =
    window.Organigramme && Organigramme.traitFactionSkitariiRequisPour
      ? Organigramme.traitFactionSkitariiRequisPour(instance.uid)
      : null;
  if (traitSkitariiRequis && "trait-skitarii" in instance.valeurs) {
    const indiceRequis = TRAITS_FACTION_SKITARII.indexOf(traitSkitariiRequis);
    if (
      indiceRequis !== -1 &&
      instance.valeurs["trait-skitarii"] !== indiceRequis
    ) {
      instance.valeurs["trait-skitarii"] = indiceRequis;
      modifie = true;
    }
  } else if ("trait-skitarii" in instance.valeurs) {
    const optSkitarii = unite.options.find((o) => o.id === "trait-skitarii");
    const choixActuel = optSkitarii.choix[instance.valeurs["trait-skitarii"]];
    if (
      choixActuel.requiertAllegeance &&
      window.Organigramme &&
      Organigramme.allegeanceActuelle() !== choixActuel.requiertAllegeance
    ) {
      instance.valeurs["trait-skitarii"] = 0;
      modifie = true;
    }
  }

  // 1 quinquies. requiertLegion/requiertAllegeance sur une entrée de
  // `choix` (armes forgées Artifice de Nocturne Salamanders,
  // Hurleurs soniques/Lance sonique Emperor's Children — ce dernier
  // combinant les deux champs sur la même entrée) : si la Légion ou
  // l'Allégeance choisie change après coup et que la valeur enregistrée
  // ne correspond plus, retombe sur l'indice 0 plutôt que de garder une
  // valeur invalide — même principe que le repli sur trait-skitarii
  // ci-dessus, mais générique à toute option plutôt que câblé sur un
  // seul id.
  for (const opt of unite.options) {
    if (opt.type !== "choix") continue;
    const choixActuel = opt.choix[instance.valeurs[opt.id]];
    if (
      choixActuel &&
      choixActuel.requiertLegion &&
      !legionRequiseSatisfaite(choixActuel.requiertLegion, { instance })
    ) {
      instance.valeurs[opt.id] = 0;
      modifie = true;
    } else if (
      choixActuel &&
      choixActuel.requiertAllegeance &&
      (!orgaPret ||
        typeof Organigramme === "undefined" ||
        Organigramme.allegeanceActuelle() !== choixActuel.requiertAllegeance)
    ) {
      instance.valeurs[opt.id] = 0;
      modifie = true;
    } else if (
      choixActuel &&
      choixActuel.requiertSerment &&
      !optionSermentOk(choixActuel, instance)
    ) {
      instance.valeurs[opt.id] = 0;
      modifie = true;
    } else if (
      choixActuel &&
      choixActuel.requiertTechnoArcane &&
      !technoArcaneOk(choixActuel, unite, instance)
    ) {
      // Même repli que ci-dessus, mais quand c'est le Techno-arcane
      // Majeur de la Figurine elle-même qui change (menu déroulant
      // "techno-arcane" de la même carte) et invalide l'entrée
      // enregistrée — cas nettement plus fréquent que le changement de
      // Légion/d'Allégeance, ce choix étant à portée de clic sur la carte.
      instance.valeurs[opt.id] = 0;
      modifie = true;
    }
  }

  // 1 sexies. Options et entrées réservées à un Techno-arcane
  // (Theurgika Maximus, Rites Cybertheurgiques) : on les décoche dès que
  // le Techno-arcane change sur la même carte et ne les autorise plus,
  // sinon elles resteraient FACTURÉES tout en étant masquées plus bas.
  // Différence notable avec requiertLegion/requiertAllegeance, qui se
  // contentent d'un repli sur l'indice 0 des `choix` : ici la
  // restriction se lève et se repose à volonté depuis un menu déroulant
  // de la carte elle-même, donc le cas se produit en usage normal et pas
  // seulement après un changement de paramètre d'Armée.
  for (const opt of unite.options) {
    const val = instance.valeurs[opt.id];
    if (opt.type === "multi" && Array.isArray(val)) {
      const gardees = val.filter((indice) => {
        const choix = opt.choix[indice];
        return !choix || entreeMultiAccessible(choix, unite, instance);
      });
      if (gardees.length !== val.length) {
        instance.valeurs[opt.id] = gardees;
        modifie = true;
      }
    } else if (
      opt.requiertTechnoArcane &&
      val &&
      !technoArcaneOk(opt, unite, instance)
    ) {
      instance.valeurs[opt.id] = opt.type === "choix" ? 0 : false;
      modifie = true;
    }
  }

  // 2. Synchronise les champs du formulaire (valeur + grisé).
  for (const opt of unite.options) {
    const realisable = optionRealisable(unite, instance, opt);
    // Une option réservée à une Légion (opt.requiertLegion, ex : Arcane
    // de Prospero/Thousand Sons, Décurion Sagittar/Imperial Fists), à
    // une Allégeance (opt.requiertAllegeance, ex : Hurleurs soniques/
    // Lance sonique, Emperor's Children — combinée à requiertLegion sur
    // la même option) et/ou à un Serment du Moment (opt.requiertSerment,
    // Blackshields) est entièrement masquée si l'une de ces conditions
    // ne correspond pas — contrairement au reste d'optionRealisable, qui
    // ne fait que griser le champ.
    if (
      opt.requiertLegion ||
      opt.requiertAllegeance ||
      opt.requiertSerment ||
      opt.requiertTechnoArcane ||
      opt.requiertZoneMortalis ||
      opt.requiertBouclierAbordage
    ) {
      const controle = carte.querySelector(
        "#opt-" + instance.uid + "-" + opt.id,
      );
      const ligne = controle && controle.closest(".option-ligne");
      if (ligne)
        ligne.hidden =
          !optionLegionOk(opt, instance) ||
          !optionAllegeanceOk(opt) ||
          !optionSermentOk(opt, instance) ||
          !technoArcaneOk(opt, unite, instance) ||
          !optionZoneMortalisOk(opt) ||
          !optionBouclierAbordageOk(unite, instance);
    }
    if (opt.type === "choix") {
      const select = carte.querySelector("#opt-" + instance.uid + "-" + opt.id);
      if (
        opt.choix.some(
          (c) =>
            c.requiertAllegeance ||
            c.requiertLegion ||
            c.requiertSerment ||
            c.requiertTechnoArcane,
        )
      )
        peuplerChoixSelect(select, opt, instance, unite);
      select.value = String(instance.valeurs[opt.id]);
      select.disabled =
        !realisable ||
        (opt.id === "techno-arcane" && Boolean(traitMechanicumRequis)) ||
        (opt.id === "trait-skitarii" && Boolean(traitSkitariiRequis));
    } else if (opt.type === "multi") {
      const cases = carte.querySelectorAll("[data-multi='" + opt.id + "']");
      const cochees = instance.valeurs[opt.id];
      cases.forEach((c) => {
        const indice = Number(c.value);
        c.checked = cochees.includes(indice);
        // Limite « jusqu'à max » : on grise les cases non cochées
        // quand le quota est atteint.
        c.disabled = !realisable || (!c.checked && cochees.length >= opt.max);
        // Entrée réservée à un Techno-arcane que la Figurine n'a pas
        // (Rites Cybertheurgiques, Liber Mechanicum p. 56-65) : masquée
        // plutôt que grisée, comme partout ailleurs dans ce fichier pour
        // une restriction que le joueur ne peut pas lever depuis cette
        // ligne-là. Le décochage a déjà été fait plus haut (étape 1
        // sexies), donc rien n'est facturé pour une entrée masquée.
        const choix = opt.choix[indice];
        const label = c.closest(".option-multi-case");
        if (label && choix)
          label.hidden = !entreeMultiAccessible(choix, unite, instance);
      });
    } else if (opt.type === "quantite") {
      const champ = carte.querySelector("#opt-" + instance.uid + "-" + opt.id);
      let budget = opt.parTranche
        ? Math.floor((instance.effectif || 1) / opt.parTranche) *
          (opt.parTrancheMax || 1)
        : opt.max || 0;
      if (opt.requiertEquip) {
        const comptes = calculerEquipementComptes(unite, instance, opt.id);
        let compteReel = 0;
        for (const [nom, n] of comptes) {
          if (nom.includes(opt.requiertEquip)) compteReel += n;
        }
        budget = Math.min(budget, compteReel);
      }
      const totalUtilise = quantiteUtilisee(unite, instance, opt);
      const dispo = Math.max(0, budget - totalUtilise);
      champ.value = String(instance.valeurs[opt.id]);
      // max dynamique : sa propre valeur + ce qui reste du budget
      // (partagé avec les autres options du même groupe).
      champ.max = String(instance.valeurs[opt.id] + dispo);
      // Ne jamais gris complètement : l'utilisateur doit pouvoir réduire
      // pour libérer du budget pour les autres options du groupe.
      champ.disabled = !realisable;
    } else {
      const caseACocher = carte.querySelector(
        "#opt-" + instance.uid + "-" + opt.id,
      );
      caseACocher.checked = instance.valeurs[opt.id];
      caseACocher.disabled = !realisable;
    }
  }
  return modifie;
}

// Reconstruit la fiche récap (profil, équipement, armes, règles) et le
// texte de points affichés sur une carte, puis recâble les info-bulles
// d'accessibilité de ses nouvelles .regle-tag (voir js/main.js). Met
// aussi à jour le cache dernierAvantageParUid : voir
// actualiserSelectsCases, qui s'en sert pour éviter de reconstruire la
// fiche des unités dont rien n'a changé.
function rafraichirFicheEtPoints(carte, unite, instance) {
  const ancienneFiche = carte.querySelector(".unite-fiche");
  if (ancienneFiche)
    ancienneFiche.replaceWith(construireFiche(unite, instance));
  carte.querySelector(".unite-points").textContent =
    coutInstance(unite, instance) + " pts";
  if (window.cablerInfoBulles) window.cablerInfoBulles(carte);
  if (orgaPret && window.Organigramme) {
    dernierAvantageParUid.set(
      instance.uid,
      window.Organigramme.avantageDe(instance.uid),
    );
    dernierTraitDetachementParUid.set(
      instance.uid,
      window.Organigramme.traitDetachementDe(instance.uid),
    );
  }
}

/* Met à jour ce qui dépend des valeurs : points de la carte,
   fiche récap, champs grisés, total général. Appelée après
   chaque interaction, sans reconstruire le formulaire (les
   menus déroulants gardent ainsi leur état et le focus). */
function actualiserCarte(carte, unite, instance) {
  synchroniserConfig(carte, unite, instance);

  // 3. Fiche récap et coût de l'unité (l'interaction vient de sa propre
  // carte : toujours à reconstruire, contrairement à
  // actualiserSelectsCases qui ne le fait que si nécessaire).
  rafraichirFicheEtPoints(carte, unite, instance);

  // 4. Total général + sauvegarde.
  actualiserTotal();
  sauvegarder();
}

/* Peuple un <select> d'option "choix" avec ses <option> (vide au
   préalable si déjà peuplé — sert aussi bien à la construction initiale
   qu'à un rafraîchissement). requiertAllegeance sur une entrée de
   `choix` (ex : Vindicator/Flagellator, optionTraitSkitarii, js/unites-
   data.js) : n'affiche cette entrée que si elle correspond à
   l'Allégeance actuelle de l'Armée — les indices restent stables
   (l'entrée est juste absente du <select>, pas retirée de opt.choix).
   Appelé depuis synchroniserConfig (pas seulement construireConfig) dès
   qu'une option a au moins une entrée `requiertAllegeance`, pour que le
   menu se remette à jour si l'Allégeance change après coup — sinon les
   <option> resteraient figées sur celles visibles au moment de la
   construction initiale de la carte. */
function peuplerChoixSelect(select, opt, instance, unite) {
  select.replaceChildren();
  const entrees = [];
  opt.choix.forEach((choix, indice) => {
    if (
      choix.requiertAllegeance &&
      (!orgaPret ||
        typeof Organigramme === "undefined" ||
        Organigramme.allegeanceActuelle() !== choix.requiertAllegeance)
    )
      return;
    // requiertLegion sur une entrée de `choix` (ex : armes forgées
    // Artifice de Nocturne, réservées Salamanders — js/unites-data.js) :
    // même principe que requiertAllegeance ci-dessus, mais sur la
    // Légion actuelle de l'Armée plutôt que l'Allégeance. Volontairement
    // sans repli sur les Légions Alliées (contrairement à
    // `opt.requiertLegion`, optionRealisable) : la règle source exige
    // que la Figurine ait elle-même le Trait de la Légion, pas
    // seulement d'être alliée à elle. `instance` permet en revanche le
    // repli Panoplie d'Antan/Légions Brisées (voir legionRequiseSatisfaite) :
    // ces deux mécaniques considèrent explicitement la Figurine comme
    // ayant le Trait de la Légion choisie.
    if (
      choix.requiertLegion &&
      !legionRequiseSatisfaite(choix.requiertLegion, { instance })
    )
      return;
    // requiertSerment sur une entrée de `choix` (ex : Deathlock/Doomlock/
    // Lame de Halo, armes récupérées — Serments du Moment Blackshields,
    // js/unites-data.js) : même principe, sur les Serments actifs du
    // Détachement de cette instance plutôt que sur la Légion/l'Allégeance.
    if (choix.requiertSerment && !optionSermentOk(choix, instance)) return;
    // requiertTechnoArcane sur une entrée de `choix` (Armes/Équipement
    // de Magos réservés à un Techno-arcane précis, Liber Mechanicum
    // p. 45-51) : même principe, mais évalué sur le Techno-arcane de la
    // Figurine elle-même, d'où le besoin d'`unite` en plus d'`instance`
    // (les appelants qui n'ont pas d'entrée concernée peuvent l'omettre).
    if (unite && choix.requiertTechnoArcane && !technoArcaneOk(choix, unite, instance))
      return;
    const texteOption =
      indice === 0 && !opt.obligatoire
        ? nomCourt(choix.nom)
        : nomCourt(choix.nom) +
          " — " +
          libelleCout(choix.cout) +
          (opt.parFigurine && choix.cout > 0 ? "/figurine" : "");
    entrees.push({ indice, texteOption });
  });
  // Tri alphabétique du menu (facilite la recherche dans une liste
  // parfois longue, ex : Équipement d'Officier de Légion) : l'entrée
  // « conserver » en tête (indice 0, sauf `obligatoire: true` où
  // l'indice 0 est un choix comme un autre — voir plus haut) reste
  // toujours première, seul le reste est trié.
  const enTete =
    !opt.obligatoire && entrees[0] && entrees[0].indice === 0
      ? entrees.shift()
      : null;
  entrees.sort((a, b) => a.texteOption.localeCompare(b.texteOption, "fr"));
  if (enTete) entrees.unshift(enTete);
  for (const { indice, texteOption } of entrees) {
    ajouterOption(select, String(indice), texteOption);
  }
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
      label.appendChild(document.createTextNode(" "));
      ajouterNomVariante(label, variante.nom);
      if (variante.cout > 0)
        label.appendChild(
          document.createTextNode(" (+" + variante.cout + " pts)"),
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
        peuplerChoixSelect(select, opt, instance, unite);
        select.addEventListener("change", () => {
          instance.valeurs[opt.id] = Number(select.value);
          actualiserCarte(carte, unite, instance);
          // Le Techno-arcane Majeur choisi ici peut devenir le Trait
          // requis pour d'AUTRES Unités du même Détachement Auxiliaire/
          // d'Apex (voir traitFactionMechanicumRequisPour,
          // js/organigramme.js) : rafraîchissement global en plus de
          // celui, local, ci-dessus, pour qu'elles s'alignent/se
          // grisent immédiatement (actualiserCarte ne touche que
          // CETTE carte).
          if (opt.id === "techno-arcane" || opt.id === "trait-skitarii")
            actualiserSelectsCases();
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
          // Permet à synchroniserConfig de masquer CETTE entrée seule
          // (et pas toute l'option) quand elle est réservée à un
          // Techno-arcane que la Figurine n'a pas — voir technoArcaneOk.
          caseACocher.dataset.multiIndice = String(indice);
          caseACocher.addEventListener("change", () => {
            const liste = instance.valeurs[opt.id];
            if (caseACocher.checked) liste.push(indice);
            else liste.splice(liste.indexOf(indice), 1);
            actualiserCarte(carte, unite, instance);
          });
          // Seul un clic direct sur la case doit la (dé)cocher, pas le
          // reste de la ligne (comportement natif des <label>).
          label.addEventListener("click", (e) => {
            if (e.target !== caseACocher) e.preventDefault();
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
          // Les options dans un même groupe partagent un budget :
          // limiter v au budget disponible pour cette option.
          if (opt.groupe) {
            const budgetTheorique = opt.parTranche
              ? Math.floor((instance.effectif || 1) / opt.parTranche) *
                (opt.parTrancheMax || 1)
              : opt.max || 0;
            const totalGroupeUtilise = quantiteUtilisee(unite, instance, opt);
            const valeurActuelle = instance.valeurs[opt.id] || 0;
            const budgetDisponible = Math.max(
              0,
              budgetTheorique - (totalGroupeUtilise - valeurActuelle)
            );
            v = Math.min(v, valeurActuelle + budgetDisponible);
          }
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
        // Seul un clic direct sur la case doit la (dé)cocher, pas le
        // reste de la ligne (comportement natif des <label>).
        label.addEventListener("click", (e) => {
          if (e.target !== caseACocher) e.preventDefault();
        });
        label.appendChild(caseACocher);
        label.appendChild(document.createTextNode(" "));
        ajouterLibelleOption(label, opt.libelle);
        label.appendChild(
          document.createTextNode(
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
    dernierAvantageParUid.delete(instance.uid);
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
  // Duplication : nouvel exemplaire à l'identique (même variante,
  // effectif, options), sous réserve qu'il soit réellement autorisé —
  // voir dupliquerUnite ci-dessous (mêmes règles que "Ajouter à la
  // liste" : quota/exclusivité/personnage nommé, puis Case libre
  // compatible dans un détachement de l'Armée).
  const dupliquer = el("button", "unite-dupliquer", "Dupliquer");
  dupliquer.type = "button";
  dupliquer.setAttribute("aria-label", "Dupliquer " + unite.nom);
  dupliquer.addEventListener("click", () => {
    dupliquerUnite(instance, carte);
  });

  entete.appendChild(titre);
  entete.appendChild(points);
  entete.appendChild(bascule);
  entete.appendChild(dupliquer);
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

// Duplique une unité déjà présente dans la liste (bouton "Dupliquer"
// de sa carte) : nouvel exemplaire avec EXACTEMENT la même
// configuration (variante, effectif, options choisies) que l'original
// — pas une unité "neuve" à reconfigurer depuis zéro. Refusé, avec un
// message d'aide (réutilise #ajout-message, déjà utilisé par "Ajouter
// à la liste"), si un exemplaire de plus n'est pas autorisé par les
// règles : mêmes vérifications que l'ajout normal — uniteAccessible()
// (quota `maxParArmee`, `excluAvec`, personnage nommé déjà présent,
// Faction/Légion/Allégeance en vigueur), puis une Case libre compatible
// dans un détachement de l'Armée (Organigramme.casesLibresPour). La
// nouvelle carte est insérée juste après l'originale plutôt qu'en fin
// de liste, pour rester visible sans avoir à faire défiler.
function dupliquerUnite(instanceSource, carteSource) {
  const unite = trouverUnite(instanceSource.uniteId);
  if (!unite) return;
  const messageAjout = document.getElementById("ajout-message");
  const afficherMessage = (texte) => {
    if (!messageAjout) return;
    messageAjout.textContent = texte;
    messageAjout.hidden = false;
    messageAjout.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  if (!uniteAccessible(unite)) {
    afficherMessage(
      "Impossible de dupliquer " +
        unite.nom +
        " : les règles de l'armée n'autorisent pas un exemplaire de plus (quota atteint, unité exclusive ou personnage nommé déjà présent).",
    );
    return;
  }
  const libres = Organigramme.casesLibresPour(unite);
  if (libres.length === 0) {
    afficherMessage(Organigramme.suggestionPourRole(unite));
    return;
  }
  if (messageAjout) messageAjout.hidden = true;
  // Copie profonde des valeurs d'options (les tableaux d'une option
  // "multi" ne doivent pas rester partagés entre original et copie).
  const valeurs = {};
  for (const [cle, val] of Object.entries(instanceSource.valeurs)) {
    valeurs[cle] = Array.isArray(val) ? [...val] : val;
  }
  const instance = {
    uid: ++compteurUid,
    uniteId: unite.id,
    variante: instanceSource.variante,
    effectif: instanceSource.effectif,
    valeurs,
  };
  armee.push(instance);
  carteSource.insertAdjacentElement("afterend", construireCarte(instance));
  // Placement automatique dans la première case libre compatible ;
  // modifiable ensuite via le menu « Case occupée » de la carte, comme
  // pour un ajout normal.
  Organigramme.assigner(instance.uid, libres[0].detUid, libres[0].indice);
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
// id de l'unité proposée par défaut dans « Unité à ajouter » avant
// toute saisie/sélection, selon la Faction actuelle (etat.faction,
// js/organigramme.js) : Praetor (Quartier Général générique) pour
// Legio Astartes, Titan Warlord pour Legio Titanicus, Chevalier Acastus
// Astérius pour Chevaliers Questoris. Une Faction sans valeur dédiée ici
// retombe sur la première unité disponible (voir initialiserChoixUnite,
// qui construit la liste réellement affichée).
// Contrairement à uniteAccessible ci-dessus, pas de garde `orgaPret` :
// Organigramme (le module) existe déjà quand ce fichier s'exécute
// (chargé avant, voir organigramme.js), que sa méthode initialiser()
// ait déjà tourné ou non — seule la valeur d'etat.faction qu'elle
// renvoie change (valeur par défaut avant restauration, restaurée
// ensuite). Sans ce calcul immédiat, une Faction Legio Titanicus
// restaurée depuis une session précédente resterait affichée comme
// Praetor le temps d'une interaction supplémentaire.
function idUniteParDefautPourFaction() {
  const faction = Organigramme.factionActuelle();
  if (faction === "legio-titanicus") return "titan-warlord";
  if (faction === "chevaliers-questoris") return "chevalier-acastus-asterius";
  return "praetor";
}

// Rebranché par initialiserChoixUnite() sur sa propre sélection par
// défaut : appelé ici (actualiserVerrouLegion) quand la Faction change
// réellement, pour que « Unité à ajouter » propose Titan Warlord (et
// non plus Praetor) dès qu'on choisit Legio Titanicus, sans effacer la
// recherche en cours à chaque rafraîchissement non lié à la Faction.
let derniereFactionCombobox = null;
let reinitialiserChoixUniteParDefaut = () => {};
let peuplerSelectLegionUniteAlliee = () => {}; // Set by initialiserChoixUnite

// Tant qu'aucune Légion n'est choisie dans les paramètres de la partie
// (js/organigramme.js) POUR UNE ARMÉE LEGIO ASTARTES, les unités qui
// lui sont propres ne peuvent pas être identifiées (voir
// uniteAccessible) : on bloque donc la sélection d'unité en amont
// plutôt que de laisser un menu incomplet ou trompeur. Les autres
// Factions transcrites (Legio Titanicus) n'ont pas de notion de
// Placeholder du champ de recherche d'unité adapté à la Faction courante.
function actualiserPlaceholderUnite() {
  const champUnite = document.getElementById("choix-unite");
  if (!champUnite) return;
  const factionActuelle = Organigramme.factionActuelle();
  const placeholders = {
    "legio-astartes": "Rechercher une unité… (ex : praetor, tactique, rhino)",
    "mechanicum": "Rechercher une unité… (ex : Magos, Technoprêtre, Convoyeur Blindé Triaros)",
    "chevaliers-questoris": "Rechercher une unité… (ex : chevalier, monocanon)",
    "solar-auxilia": "Rechercher une unité… (ex : Ryfliers, Basilisk)",
    "legio-titanicus": "Rechercher une unité… (ex : Warbringer, Reaver)",
    "legio-custodes": "Rechercher une unité… (ex : Sodalité, Valdor)",
    "anathema-psykana": "Rechercher une unité… (ex : Jenetia, Chevalière)",
    "skitarii": "Rechercher une unité… (ex : Ordinator, Corpus)",
    "divisio-assassinorum": "Rechercher une unité… (ex : Assassin, Culexus)",
    "daemons-ruinstorm": "Rechercher une unité… (ex : Brute, Démon)",
    "legions-brisees": "Rechercher une unité… (ex : unité, légion brisée)",
    "blackshields": "Rechercher une unité… (ex : Endryd Haar, unité)",
  };
  champUnite.placeholder =
    placeholders[factionActuelle] || "Rechercher une unité…";
}

// Légion : leur sélection d'unité se débloque dès la Faction choisie.
// Rappelé à chaque actualiserSelectsCases (callback surChangement de
// l'organigramme), donc à chaque changement de Légion ou de Faction.
function actualiserVerrouLegion() {
  const champUnite = document.getElementById("choix-unite");
  const boutonUnite = document.getElementById("choix-unite-bouton");
  const boutonUnite2 = document.getElementById("ajouter-unite");
  const factionActuelle = Organigramme.factionActuelle();
  if (factionActuelle !== derniereFactionCombobox) {
    derniereFactionCombobox = factionActuelle;
    reinitialiserChoixUniteParDefaut();
  }
  // Rafraîchir aussi le sélecteur de Légion Alliée chaque fois que l'organigramme change
  peuplerSelectLegionUniteAlliee();
  // Un Détachement Narratif présent dispense ces verrous (comme
  // uniteAccessible) : toutes les Unités du site y sont sélectionnables
  // sans avoir à choisir de Légion/Maisonnée/Doctrine (voir demande de
  // Jean).
  const narratifDisponible =
    orgaPret &&
    typeof Organigramme !== "undefined" &&
    Organigramme.narratifPresent();
  const legionManquante =
    !narratifDisponible &&
    factionActuelle === "legio-astartes" &&
    Organigramme.legionActuelle() === "";
  // Même verrou que la Légion ci-dessus, pour la Maisonnée (Faction
  // Chevaliers Questoris, menu « Maisonnée » des paramètres de la
  // partie) : les Unités de cette Faction n'ont pas de Trait propre à
  // une Maisonnée (voir uniteAccessible), donc rien ne les filtre
  // automatiquement — le verrou en amont est donc la seule façon
  // d'imposer ce choix avant d'ajouter une Unité.
  const maisonneeManquante =
    !narratifDisponible &&
    factionActuelle === "chevaliers-questoris" &&
    Organigramme.maisonneeActuelle() === "";
  // Même verrou, pour la Doctrine de Cohorte (Faction Solar Auxilia,
  // menu « Doctrine de Cohorte » des paramètres de la partie) : les
  // Unités Solar Auxilia n'ont pas de Trait propre à une Doctrine (voir
  // uniteAccessible), donc rien ne les filtre automatiquement — le
  // verrou en amont est donc la seule façon d'imposer ce choix avant
  // d'ajouter une Unité.
  const doctrineManquante =
    !narratifDisponible &&
    factionActuelle === "solar-auxilia" &&
    Organigramme.doctrineCohorteActuelle() === "";
  // Même verrou, pour le Techno-arcane Majeur (Faction Mechanicum,
  // menu « Techno-arcane » des paramètres de la partie) : les Unités
  // Mechanicum n'ont pas de Trait propre à un Techno-arcane — le verrou
  // en amont est donc la seule façon d'imposer ce choix avant d'ajouter
  // une Unité.
  const technoArcaneManquant =
    !narratifDisponible &&
    factionActuelle === "mechanicum" &&
    Organigramme.technoArcaneActuel() === "";
  // Faction sans aucune unité transcrite pour l'instant (ex : Chevaliers
  // Questoris, en attendant son livre d'armée) : le verrou se déclenche
  // aussi dans ce cas, plutôt que de laisser un champ vide/trompeur et
  // un bouton « Ajouter » sans effet (voir uniteAccessible ci-dessus).
  const aucuneUniteAccessible = !UNITES.some((u) => uniteAccessible(u));
  const peutAjouter =
    !legionManquante &&
    !maisonneeManquante &&
    !doctrineManquante &&
    !technoArcaneManquant &&
    !aucuneUniteAccessible;
  champUnite.disabled = !peutAjouter;
  boutonUnite.disabled = !peutAjouter;
  boutonUnite2.disabled = !peutAjouter;
  if (!peutAjouter) {
    document.getElementById("choix-unite-liste").hidden = true;
    champUnite.setAttribute("aria-expanded", "false");
  }
  const MESSAGE_LEGION_MANQUANTE =
    "Choisissez d'abord une Légion dans les paramètres de la partie pour pouvoir ajouter des unités.";
  const MESSAGE_MAISONNEE_MANQUANTE =
    "Choisissez d'abord une Maisonnée dans les paramètres de la partie pour pouvoir ajouter des unités.";
  const MESSAGE_DOCTRINE_MANQUANTE =
    "Choisissez d'abord une Doctrine de Cohorte dans les paramètres de la partie pour pouvoir ajouter des unités.";
  const MESSAGE_TECHNO_ARCANE_MANQUANT =
    "Choisissez d'abord un Techno-arcane Majeur dans les paramètres de la partie pour pouvoir ajouter des unités.";
  const MESSAGE_AUCUNE_UNITE =
    "Aucune unité n'est encore disponible pour cette Faction.";
  const messageAjout = document.getElementById("ajout-message");
  if (!peutAjouter) {
    messageAjout.textContent = legionManquante
      ? MESSAGE_LEGION_MANQUANTE
      : maisonneeManquante
        ? MESSAGE_MAISONNEE_MANQUANTE
        : doctrineManquante
          ? MESSAGE_DOCTRINE_MANQUANTE
          : technoArcaneManquant
            ? MESSAGE_TECHNO_ARCANE_MANQUANT
            : MESSAGE_AUCUNE_UNITE;
    messageAjout.hidden = false;
  } else if (
    messageAjout.textContent === MESSAGE_LEGION_MANQUANTE ||
    messageAjout.textContent === MESSAGE_MAISONNEE_MANQUANTE ||
    messageAjout.textContent === MESSAGE_DOCTRINE_MANQUANTE ||
    messageAjout.textContent === MESSAGE_TECHNO_ARCANE_MANQUANT ||
    messageAjout.textContent === MESSAGE_AUCUNE_UNITE
  ) {
    messageAjout.hidden = true;
  }
  actualiserPlaceholderUnite();
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
      ajouterOption(select, "", "⚠ Non placée — choisir une case");
    }
    if (actuelle) {
      ajouterOption(
        select,
        actuelle.detUid + ":" + actuelle.indice,
        actuelle.libelle,
      );
    }
    for (const libre of Organigramme.casesLibresPour(unite)) {
      ajouterOption(select, libre.detUid + ":" + libre.indice, libre.libelle);
    }
    select.value = actuelle ? actuelle.detUid + ":" + actuelle.indice : "";
    // Alerte visuelle : carte sans case = liste non conforme.
    carte.classList.toggle("unite-carte--sans-case", !actuelle);

    // Les options d'une carte peuvent dépendre d'une AUTRE carte (ex :
    // `requiertAbsenceUnite` — l'option de Khârn dépend de la présence
    // d'Angron dans la liste) : on resynchronise le formulaire ici,
    // pas seulement lors d'une interaction sur sa propre carte.
    const configModifiee = synchroniserConfig(carte, unite, instance);

    // La fiche récap dépend aussi de l'Avantage Principal de la case
    // (bonus de Maître-sergent, Vétérans de Combat, Parangon de
    // Bataille) : on la reconstruit pour qu'elle reste à jour même
    // quand le changement vient d'ailleurs (une autre carte,
    // l'organigramme) — mais SEULEMENT si quelque chose qui influe sur
    // elle a réellement changé pour CETTE instance (option remise à
    // zéro ci-dessus, ou Avantage différent de la dernière fois) :
    // cette fonction tourne après CHAQUE interaction sur N'IMPORTE
    // QUELLE carte, donc reconstruire la fiche de toute l'Armée à
    // chaque fois (recalcul des tableaux d'armes de chaque unité)
    // serait un gâchis pur pour la quasi-totalité des unités, qui n'ont
    // rien à mettre à jour.
    const avantageActuel = Organigramme.avantageDe(instance.uid);
    const traitDetachementActuel = Organigramme.traitDetachementDe(
      instance.uid,
    );
    if (
      configModifiee ||
      dernierAvantageParUid.get(instance.uid) !== avantageActuel ||
      dernierTraitDetachementParUid.get(instance.uid) !== traitDetachementActuel
    ) {
      rafraichirFicheEtPoints(carte, unite, instance);
    }
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
  dernierAvantageParUid.delete(uid);
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
      const ligne = donneesLigne(enfant);
      // Les Notes (lore/fluff, voir construireFiche dans js/unites.js)
      // ne sont que de la couleur narrative, pas des règles de jeu :
      // on les exclut du PDF/Word exporté, qui ne garde que
      // l'essentiel technique. Elles restent visibles à l'écran.
      if (ligne.titre !== "Notes") blocs.push(ligne);
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
  return Array.from(conteneur.querySelectorAll(".orga-resume-detachement")).map(
    (bloc) => {
      const h3 = bloc.querySelector("h3");
      return {
        titre: h3 ? h3.textContent.trim() : "",
        items: Array.from(bloc.querySelectorAll("li")).map((li) =>
          li.textContent.trim(),
        ),
      };
    },
  );
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
  return String(texte).replace(/★/g, "*").replace(/⚠/g, "!");
}

// Couleurs d'export (PDF + Word) : reprises des variables CSS actives sur
// <body> (--accent/--accent-clair/--titre, voir css/style.css), pour que
// les documents téléchargés reprennent l'identité colorée de la
// Légion/Faction en cours (recolorée par le skin actif) plutôt qu'un rendu
// entièrement noir & blanc — mêmes couleurs qu'à l'écran, y compris leur
// repli par défaut (bordeaux/or, voir :root) quand aucun skin n'est actif.
function couleursExport() {
  const style = getComputedStyle(document.body);
  const lire = (nom, repli) => style.getPropertyValue(nom).trim() || repli;
  return {
    accent: lire("--accent", "#8b0000"),
    accentClair: lire("--accent-clair", "#a13030"),
    or: lire("--titre", "#8a6a2c"),
  };
}

// "#rrggbb" -> [r, g, b] (0-255), pour doc.setTextColor/setDrawColor/
// setFillColor de jsPDF, qui n'acceptent pas les couleurs CSS directement.
function hexVersRGB(hex) {
  const nombre = parseInt(hex.replace("#", ""), 16);
  return [(nombre >> 16) & 255, (nombre >> 8) & 255, nombre & 255];
}

// Éclaircit une couleur RGB en la mélangeant avec du blanc (ratio 0-1 = part
// de blanc) : les couleurs d'accent sont souvent trop sombres (ex. Iron
// Warriors #4a4a4a, Night Lords #10151f) pour servir telles quelles de fond
// de ligne de tableau alternée.
function eclaircirRGB([r, g, b], ratio) {
  return [r, g, b].map((c) => Math.round(c + (255 - c) * ratio));
}

// Charge une image locale (chemin relatif, ex. un blason de Légion
// sous assets/logo_legions/) en Data URL, pour l'incorporer au PDF
// (doc.addImage) ou au Word exporté (<img src="data:...">). Retourne
// null en cas d'échec (Légion sans blason, page ouverte sans serveur
// local...) plutôt que de bloquer l'export.
async function chargerImageDataURL(chemin) {
  if (!chemin) return null;
  try {
    const reponse = await fetch(chemin);
    if (!reponse.ok) return null;
    const blob = await reponse.blob();
    return await new Promise((resolve, reject) => {
      const lecteur = new FileReader();
      lecteur.onload = () => resolve(lecteur.result);
      lecteur.onerror = reject;
      lecteur.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

// Texte "Allégeance : ... · Primarque : ... · Monde natal : ..." pour
// la Légion en cours (partagé par la page de garde PDF et Word).
function texteIdentiteLegion(skin) {
  let texte =
    skin.allegeance === "renegat"
      ? "Allégeance : Renégate"
      : "Allégeance : Loyaliste";
  if (skin.monde && skin.monde !== "—")
    texte += " · Monde natal : " + skin.monde;
  return texte;
}

// Contenu du Rite de Guerre de la Légion choisie (Tactica de Légion,
// Posture, Réaction Avancée — voir RITE_DE_GUERRE_LEGION,
// js/organigramme-data.js), partagé par la page de garde PDF et Word.
// Certaines Légions ont un contenu différent selon le Rite de Guerre
// précis choisi (ex : Legio Hereticus World Eaters) : on cherche
// d'abord une entrée pour ce Rite précis (id RITES_DE_GUERRE), puis on
// retombe sur l'entrée générique de la Légion. Pour une Légion qui
// impose un choix de Rite de Guerre (menu affiché par
// RITES_DE_GUERRE, ex : Emperor's Children/World Eaters) et pour
// laquelle aucun Rite n'a encore été choisi (etat.riteDeGuerre === ""),
// les deux lookups ci-dessus échouent : on retombe alors sur son
// premier Rite listé (toujours la variante Legio Astartes de base,
// jamais Legio Hereticus) plutôt que de laisser la page de garde vide
// — la Tactica de Légion s'applique de toute façon indépendamment du
// Rite de Guerre choisi, contrairement aux Détachements réservés
// (`requiertRiteDeGuerre`) qui eux restent bien verrouillés tant que
// le joueur n'a rien choisi. Retourne undefined pour les Légions/Rites
// dont le contenu n'est pas encore transcrit.
function contenuRiteDeGuerreActuel() {
  const legion = Organigramme.legionActuelle();
  const riteChoisi = Organigramme.riteActuel ? Organigramme.riteActuel() : "";
  const ritesLegion = RITES_DE_GUERRE[legion] || [];
  return (
    RITE_DE_GUERRE_LEGION[riteChoisi] ||
    RITE_DE_GUERRE_LEGION[legion] ||
    (ritesLegion.length > 0
      ? RITE_DE_GUERRE_LEGION[ritesLegion[0].id]
      : undefined)
  );
}

// Contenu de la Doctrine de Cohorte choisie (Armée Solar Auxilia
// uniquement, menu « Doctrine de Cohorte » des paramètres de la
// partie) : Tactica de Cohorte + Détachements Additionnels condensés en
// un seul texte par Doctrine (REGLES_DIVERSES, js/regles-data.js,
// indexé par le nom de la Doctrine — voir DOCTRINES_DE_COHORTE,
// js/organigramme-data.js), partagé par la page de garde PDF et Word —
// même principe que contenuRiteDeGuerreActuel() ci-dessus pour les
// Légions Legio Astartes. Retourne null si aucune Doctrine n'est
// choisie, ou si son texte n'est pas (encore) dans REGLES_DIVERSES.
function contenuDoctrineCohorteActuelle() {
  const id = Organigramme.doctrineCohorteActuelle
    ? Organigramme.doctrineCohorteActuelle()
    : "";
  if (!id) return null;
  const doctrine = DOCTRINES_DE_COHORTE.find(([valeur]) => valeur === id);
  if (!doctrine) return null;
  const regle = REGLES_DIVERSES.find((r) => r.nom === doctrine[1]);
  return regle ? { nom: doctrine[1], regle } : null;
}

// Nom d'affichage de la Doctrine de Cohorte choisie (Armée Solar
// Auxilia), indépendamment de la présence de son texte complet dans
// REGLES_DIVERSES (contrairement à contenuDoctrineCohorteActuelle()
// ci-dessus, qui retourne null tant que ce texte manque) : utilisé pour
// le titre centré de la page de garde PDF/Word (voir plus bas), qui
// doit afficher le nom de la Cohorte même si son texte de Tactica n'est
// pas encore transcrit. Retourne null si aucune Doctrine n'est choisie.
function nomDoctrineCohorteActuelle() {
  const id = Organigramme.doctrineCohorteActuelle
    ? Organigramme.doctrineCohorteActuelle()
    : "";
  if (!id) return null;
  const doctrine = DOCTRINES_DE_COHORTE.find(([valeur]) => valeur === id);
  return doctrine ? doctrine[1] : null;
}

// Traits de Faction Mechanicum (Techno-arcanes Majeurs) réellement
// présents dans l'Armée courante (via traitFactionMechanicumDe
// ci-dessus), un par variante DISTINCTE — partagé par la page de garde
// PDF et Word, même principe que contenuDoctrineCohorteActuelle()
// ci-dessus, mais potentiellement plusieurs entrées : à la différence
// de la Doctrine de Cohorte (un seul choix pour toute l'Armée), le
// Trait de Faction Mechanicum se choisit par Unité (voir js/unites-
// data.js) — rien n'empêche une Armée de mêler plusieurs Techno-
// arcanes. Triées selon TRAITS_FACTION_MECHANICUM plutôt que l'ordre
// d'ajout des Unités. Tableau vide si aucune Unité Mechanicum dans
// l'Armée, ou si le texte d'un Trait n'est pas (encore) dans
// REGLES_DIVERSES.
function contenuTraitsFactionMechanicumActuels() {
  const presents = new Set();
  for (const inst of armee) {
    const unite = trouverUnite(inst.uniteId);
    const trait = unite && traitFactionMechanicumDe(unite, inst);
    if (trait) presents.add(trait);
  }
  return TRAITS_FACTION_MECHANICUM.filter((nom) => presents.has(nom))
    .map((nom) => {
      const regle = REGLES_DIVERSES.find((r) => r.nom === nom);
      return regle ? { nom, regle } : null;
    })
    .filter(Boolean);
}

// Même principe que contenuTraitsFactionMechanicumActuels ci-dessus,
// pour les Traits de Faction [Skitarii] (Acquisitor/Expurgator/
// Vindicator/Flagellator) réellement présents dans l'Armée courante.
function contenuTraitsFactionSkitariiActuels() {
  const presents = new Set();
  for (const inst of armee) {
    const unite = trouverUnite(inst.uniteId);
    const trait = unite && traitFactionSkitariiDe(unite, inst);
    if (trait) presents.add(trait);
  }
  return TRAITS_FACTION_SKITARII.filter((nom) => presents.has(nom))
    .map((nom) => {
      const regle = REGLES_DIVERSES.find((r) => r.nom === nom);
      return regle ? { nom, regle } : null;
    })
    .filter(Boolean);
}

// Désignation de Legiones Auxilia choisie (voir
// DESIGNATIONS_LEGIONES_AUXILIA, js/organigramme-data.js) et le texte
// condensé de sa Réaction Avancée (REGLES_DIVERSES, js/regles-data.js,
// indexé par son nom `reaction`), partagés par la page de garde PDF et
// Word — même principe que contenuRiteDeGuerreActuel() ci-dessus, mais
// sans la structure Tactica/Posture/Réaction complète du Rite de
// Guerre (ce livre ne donne qu'une seule Réaction par Désignation).
// Retourne null si aucune Désignation n'est choisie, ou si son texte
// de Réaction n'est pas (encore) dans REGLES_DIVERSES.
function contenuDesignationAuxiliaActuelle() {
  const id = Organigramme.designationAuxiliaActuelle
    ? Organigramme.designationAuxiliaActuelle()
    : "";
  if (!id) return null;
  const designation = DESIGNATIONS_LEGIONES_AUXILIA.find((d) => d.id === id);
  if (!designation) return null;
  const regle = REGLES_DIVERSES.find((r) => r.nom === designation.reaction);
  return regle ? { designation, regle } : null;
}

// Bénéfice et Option d'Arcane de Mechanicum, affichés sur la page de
// garde du PDF/Word si Mechanicum est la Faction actuelle et qu'un
// Techno-arcane a été choisi. Retourne null sinon.
function contenuBeneficeOptionArcaneActuels() {
  if (!Organigramme.factionActuelle) return null;
  const faction = Organigramme.factionActuelle();
  if (faction !== "mechanicum") return null;

  const benefice = Organigramme.beneficeArcaneActuel();
  const option = Organigramme.optionArcaneActuel();
  if (!benefice || !option) return null;

  const regleBenefice = REGLES_DIVERSES.find((r) => r.nom === benefice);
  const regleOption = REGLES_DIVERSES.find((r) => r.nom === option);

  return regleBenefice && regleOption
    ? { benefice: { nom: benefice, regle: regleBenefice }, option: { nom: option, regle: regleOption } }
    : null;
}

async function genererPDF() {
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

  // Couleurs d'accent (Légion/Faction en cours) et d'or (constante du
  // site, "titres, bordures précieuses"), voir couleursExport().
  const couleurs = couleursExport();
  const accentRGB = hexVersRGB(couleurs.accent);
  const orRGB = hexVersRGB(couleurs.or);
  const ligneClaireRGB = eclaircirRGB(accentRGB, 0.88);

  function nouvellePage() {
    if (pageOuverte) doc.addPage();
    pageOuverte = true;
    y = MARGE + PAD + 4;
  }

  function assurerEspace(hauteur) {
    if (y + hauteur > basPage) nouvellePage();
  }

  function titreSection(texte, taille, couleur) {
    assurerEspace(taille + 6);
    doc.setFont("times", "bold");
    doc.setFontSize(taille);
    doc.setTextColor(...(couleur || accentRGB));
    doc.text(assainirPDF(texte), contentX, y);
    doc.setTextColor(0, 0, 0);
    y += taille + 4;
  }

  function paragraphe(texte, taille, style, couleur) {
    doc.setFont("times", style || "normal");
    doc.setFontSize(taille);
    if (couleur) doc.setTextColor(...couleur);
    const interligne = taille * 1.3;
    for (const ligne of doc.splitTextToSize(assainirPDF(texte), contentW)) {
      assurerEspace(interligne);
      doc.text(ligne, contentX, y);
      y += interligne;
    }
    if (couleur) doc.setTextColor(0, 0, 0);
  }

  // Identique à paragraphe, mais chaque ligne est centrée sur la
  // largeur de contenu (page de garde : identité de Légion).
  function paragrapheCentre(texte, taille, style, couleur) {
    doc.setFont("times", style || "normal");
    doc.setFontSize(taille);
    if (couleur) doc.setTextColor(...couleur);
    const interligne = taille * 1.3;
    for (const ligne of doc.splitTextToSize(assainirPDF(texte), contentW)) {
      assurerEspace(interligne);
      const largeur = doc.getTextWidth(ligne);
      doc.text(ligne, contentX + (contentW - largeur) / 2, y);
      y += interligne;
    }
    if (couleur) doc.setTextColor(0, 0, 0);
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
    doc.setTextColor(...accentRGB);
    doc.text(prefixe, contentX, y);
    doc.setTextColor(0, 0, 0);
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
        halign: "center",
      },
      headStyles: {
        fillColor: accentRGB,
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: ligneClaireRGB },
    });
    y = doc.lastAutoTable.finalY + 8;
  }

  function definitionsPDF(items) {
    assurerEspace(20);
    y += 4;
    doc.setDrawColor(...orRGB);
    doc.setLineWidth(0.75);
    doc.line(contentX, y, pageW - MARGE - PAD, y);
    doc.setDrawColor(0);
    y += 10;
    titreSection("Définitions", 10, orRGB);
    for (const item of items) ligneEtiquette(item.nom, item.texte, " — ");
  }

  function cartePDF(donnees) {
    nouvellePage();
    const nom = assainirPDF(donnees.nom);
    const points = assainirPDF(donnees.points);
    doc.setFont("times", "bold");
    doc.setFontSize(15);
    doc.setTextColor(...accentRGB);
    doc.text(nom, contentX, y);
    doc.setFontSize(13);
    doc.setTextColor(...orRGB);
    const largeurPoints = doc.getTextWidth(points);
    doc.text(points, pageW - MARGE - PAD - largeurPoints, y);
    doc.setTextColor(0, 0, 0);
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
    doc.setDrawColor(...accentRGB);
    doc.setLineWidth(1);
    doc.line(contentX, y, pageW - MARGE - PAD, y);
    doc.setDrawColor(0);
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

  // --- Page de garde : Légion, total, structure de l'armée ---
  nouvellePage();

  // Identité de Légion : blason et nom sur une même ligne centrée,
  // Allégeance/Primarque/Monde natal centrés en dessous (voir
  // Organigramme.skinActuel/cheminLogoActuel, js/organigramme.js).
  const skin = Organigramme.skinActuel ? Organigramme.skinActuel() : null;
  if (skin) {
    const logoDataUrl = await chargerImageDataURL(
      Organigramme.cheminLogoActuel(),
    );
    const nomLegionTexte = assainirPDF(
      Organigramme.legionActuelle() + " – " + skin.nom,
    );
    let largeurLogo = 0;
    let hauteurLogo = 0;
    let proprietes = null;
    if (logoDataUrl) {
      try {
        proprietes = doc.getImageProperties(logoDataUrl);
        hauteurLogo = 50;
        largeurLogo = Math.min(
          (proprietes.width / proprietes.height) * hauteurLogo,
          90,
        );
      } catch {
        // Format d'image non géré par jsPDF (rare) : on continue sans blason.
        proprietes = null;
      }
    }
    const ECART = largeurLogo > 0 ? 10 : 0;
    doc.setFont("times", "bold");
    doc.setFontSize(16);
    doc.setTextColor(...accentRGB);
    const largeurTexte = doc.getTextWidth(nomLegionTexte);
    const largeurBloc = largeurLogo + ECART + largeurTexte;
    const hauteurBloc = Math.max(hauteurLogo, 16);
    assurerEspace(hauteurBloc + 8);
    const xBloc = contentX + (contentW - largeurBloc) / 2;
    if (proprietes) {
      doc.addImage(
        logoDataUrl,
        proprietes.fileType || "PNG",
        xBloc,
        y,
        largeurLogo,
        hauteurLogo,
      );
    }
    doc.text(
      nomLegionTexte,
      xBloc + largeurLogo + ECART,
      y + hauteurBloc / 2 + 6,
    );
    doc.setTextColor(0, 0, 0);
    y += hauteurBloc + 8;

    paragrapheCentre(texteIdentiteLegion(skin), 9.5);
    y += 6;
  } else {
    // Identité de Faction Legio Titanicus : même principe qu'une
    // Légion ci-dessus, mais avec DEUX blasons (gauche et droite du
    // nom, voir SKIN_TITANICUS.blasons/creerIconeTitan dans
    // js/organigramme.js) et sans ligne Allégeance/Monde natal (sans
    // objet pour cette Faction).
    const skinTitan = Organigramme.skinTitanActuel
      ? Organigramme.skinTitanActuel()
      : null;
    if (skinTitan) {
      const HAUTEUR_LOGO = 50;
      const ECART = 10;
      const logos = [];
      for (const chemin of Organigramme.cheminsLogoTitanActuel()) {
        const dataUrl = await chargerImageDataURL(chemin);
        if (!dataUrl) continue;
        try {
          const proprietes = doc.getImageProperties(dataUrl);
          const largeur = Math.min(
            (proprietes.width / proprietes.height) * HAUTEUR_LOGO,
            90,
          );
          logos.push({ dataUrl, proprietes, largeur });
        } catch {
          // Format d'image non géré par jsPDF (rare) : on saute ce blason.
        }
      }
      const nomTitanTexte = assainirPDF(skinTitan.nom);
      doc.setFont("times", "bold");
      doc.setFontSize(16);
      doc.setTextColor(...accentRGB);
      const largeurTexte = doc.getTextWidth(nomTitanTexte);
      const largeurLogos = logos.reduce(
        (somme, logo) => somme + logo.largeur + ECART,
        0,
      );
      const largeurBloc = largeurLogos + largeurTexte;
      const hauteurBloc = Math.max(HAUTEUR_LOGO, 16);
      assurerEspace(hauteurBloc + 8);
      let xBloc = contentX + (contentW - largeurBloc) / 2;
      if (logos[0]) {
        doc.addImage(
          logos[0].dataUrl,
          logos[0].proprietes.fileType || "PNG",
          xBloc,
          y,
          logos[0].largeur,
          HAUTEUR_LOGO,
        );
        xBloc += logos[0].largeur + ECART;
      }
      doc.text(nomTitanTexte, xBloc, y + hauteurBloc / 2 + 6);
      doc.setTextColor(0, 0, 0);
      xBloc += largeurTexte + ECART;
      if (logos[1]) {
        doc.addImage(
          logos[1].dataUrl,
          logos[1].proprietes.fileType || "PNG",
          xBloc,
          y,
          logos[1].largeur,
          HAUTEUR_LOGO,
        );
      }
      y += hauteurBloc + 8;
    } else {
      // Identité de Maisonnée (Faction Chevaliers Questoris) : même
      // principe qu'une Légion ci-dessus — blason + nom de la Maisonnée
      // centrés sur une même ligne (voir Organigramme.skinMaisonActuel/
      // cheminLogoMaisonActuel, js/organigramme.js), devise centrée en
      // dessous (sur le modèle de la ligne Allégeance/Monde natal d'une
      // Légion), puis une ligne nommant le Détachement Additionnel
      // débloqué par le Paradigme de cette Maisonnée (Serre d'Automates/
      // Serre d'Armigères/Maisnie Roturière — DETACHEMENT_PARADIGME_
      // MAISONNEE, js/organigramme.js).
      const skinMaison = Organigramme.skinMaisonActuel
        ? Organigramme.skinMaisonActuel()
        : null;
      if (skinMaison) {
        const logoDataUrl = await chargerImageDataURL(
          Organigramme.cheminLogoMaisonActuel(),
        );
        const nomMaisonTexte = assainirPDF(skinMaison.nom);
        let largeurLogo = 0;
        let hauteurLogo = 0;
        let proprietes = null;
        if (logoDataUrl) {
          try {
            proprietes = doc.getImageProperties(logoDataUrl);
            hauteurLogo = 50;
            largeurLogo = Math.min(
              (proprietes.width / proprietes.height) * hauteurLogo,
              90,
            );
          } catch {
            proprietes = null;
          }
        }
        const ECART = largeurLogo > 0 ? 10 : 0;
        doc.setFont("times", "bold");
        doc.setFontSize(16);
        doc.setTextColor(...accentRGB);
        const largeurTexte = doc.getTextWidth(nomMaisonTexte);
        const largeurBloc = largeurLogo + ECART + largeurTexte;
        const hauteurBloc = Math.max(largeurLogo > 0 ? hauteurLogo : 0, 16);
        assurerEspace(hauteurBloc + 8);
        const xBloc = contentX + (contentW - largeurBloc) / 2;
        if (proprietes) {
          doc.addImage(
            logoDataUrl,
            proprietes.fileType || "PNG",
            xBloc,
            y,
            largeurLogo,
            hauteurLogo,
          );
        }
        doc.text(
          nomMaisonTexte,
          xBloc + largeurLogo + ECART,
          y + hauteurBloc / 2 + 6,
        );
        doc.setTextColor(0, 0, 0);
        y += hauteurBloc + 8;
        if (skinMaison.devise) {
          paragrapheCentre(skinMaison.devise, 9.5);
          y += 6;
        }
        const detachementParadigme =
          Organigramme.detachementParadigmeMaisonActuel
            ? Organigramme.detachementParadigmeMaisonActuel()
            : null;
        if (detachementParadigme) {
          paragrapheCentre(
            "Paradigme de Maisonnée : débloque le Détachement Additionnel " +
              detachementParadigme,
            8.5,
            "italic",
          );
          y += 4;
        }
      } else {
        // Identité couleurs seules (sans blason) pour les Factions Legio
        // Custodes/Anathema Psykana/Conclaves Skitarii/Démons de la
        // Tempête de la Ruine/Légions Brisées/Blackshields (SKIN_LEGIO_
        // CUSTODES/SKIN_ANATHEMA_PSYKANA/SKIN_SKITARII/SKIN_DAEMONS_
        // RUINSTORM/SKIN_LEGIONS_BRISEES/SKIN_BLACKSHIELDS,
        // js/organigramme.js) : nom centré en gras, devise centrée en
        // dessous — même principe que le nom de Cohorte seul ci-dessous
        // quand aucune Désignation
        // n'est choisie.
        const skinSansBlason =
          (Organigramme.skinLegioCustodesActuel &&
            Organigramme.skinLegioCustodesActuel()) ||
          (Organigramme.skinAnathemaPsykanaActuel &&
            Organigramme.skinAnathemaPsykanaActuel()) ||
          (Organigramme.skinSkitariiActuel &&
            Organigramme.skinSkitariiActuel()) ||
          (Organigramme.skinRuinstormActuel &&
            Organigramme.skinRuinstormActuel()) ||
          (Organigramme.skinLegionsBriseesActuel &&
            Organigramme.skinLegionsBriseesActuel()) ||
          (Organigramme.skinBlackshieldsActuel &&
            Organigramme.skinBlackshieldsActuel()) ||
          null;
        if (skinSansBlason) {
          paragrapheCentre(
            assainirPDF(skinSansBlason.nom),
            16,
            "bold",
            accentRGB,
          );
          y += 8;
          if (skinSansBlason.devise) {
            paragrapheCentre(skinSansBlason.devise, 9.5);
            y += 6;
          }
        } else if (Organigramme.factionActuelle() === "mechanicum") {
          // Identité de Mechanicum : « Mechanicum – [Techno-arcane] » centré
          // en gras, Allégeance centré en dessous, sur le modèle de Legio
          // Astartes. Le Techno-arcane est obligatoire (chaîne non vide),
          // contrairement aux Désignations Solar Auxilia.
          const TECHNO_ARCANES = [
            ["archimandrite", "Archimandrite"],
            ["cybernetica", "Cybernetica"],
            ["lacrymaerta", "Lacrymaerta"],
            ["myrmidax", "Myrmidax"],
            ["reductor", "Reductor"],
            ["malagra", "Malagra"],
            ["macrotek", "Macrotek"],
          ];
          const technoArcaneCode = Organigramme.technoArcaneActuel();
          const ta = technoArcaneCode
            ? TECHNO_ARCANES.find(([code]) => code === technoArcaneCode)
            : null;
          if (ta) {
            const nomMechanicum = assainirPDF(
              "Mechanicum – " + ta[1],
            );
            paragrapheCentre(nomMechanicum, 16, "bold", accentRGB);
            y += 8;
            paragrapheCentre(
              "Allégeance : " +
                (Organigramme.allegeanceActuelle() === "renegat"
                  ? "Renégat"
                  : "Loyaliste"),
              9.5,
            );
            y += 6;
          }
        } else {
          // Identité de Désignation de Legiones Auxilia / Doctrine de
          // Cohorte (Faction Solar Auxilia) : même principe qu'une Légion
          // ci-dessus — blason + nom de la Désignation centrés sur une même
          // ligne (voir Organigramme.skinDesignationActuel/
          // cheminLogoDesignationActuel, js/organigramme.js), puis le nom
          // de la Doctrine de Cohorte choisie centré en dessous, sur le
          // modèle de la ligne Allégeance/Monde natal d'une Légion. La
          // Désignation étant facultative (contrairement à la Doctrine,
          // obligatoire), le nom de la Cohorte prend seul la place du titre
          // (même taille/graisse que le nom de Légion/Désignation) quand
          // aucune Désignation n'est choisie, pour que la page de garde
          // Solar Auxilia garde toujours un titre centré.
          const skinDesignation = Organigramme.skinDesignationActuel
            ? Organigramme.skinDesignationActuel()
            : null;
          const nomCohorte = nomDoctrineCohorteActuelle();
          if (skinDesignation) {
            const logoDataUrl = await chargerImageDataURL(
              Organigramme.cheminLogoDesignationActuel(),
            );
            const nomDesignationTexte = assainirPDF(skinDesignation.nom);
            let largeurLogo = 0;
            let hauteurLogo = 0;
            let proprietes = null;
            if (logoDataUrl) {
              try {
                proprietes = doc.getImageProperties(logoDataUrl);
                hauteurLogo = 50;
                largeurLogo = Math.min(
                  (proprietes.width / proprietes.height) * hauteurLogo,
                  90,
                );
              } catch {
                proprietes = null;
              }
            }
            const ECART = largeurLogo > 0 ? 10 : 0;
            doc.setFont("times", "bold");
            doc.setFontSize(16);
            doc.setTextColor(...accentRGB);
            const largeurTexte = doc.getTextWidth(nomDesignationTexte);
            const largeurBloc = largeurLogo + ECART + largeurTexte;
            const hauteurBloc = Math.max(largeurLogo > 0 ? hauteurLogo : 0, 16);
            assurerEspace(hauteurBloc + 8);
            const xBloc = contentX + (contentW - largeurBloc) / 2;
            if (proprietes) {
              doc.addImage(
                logoDataUrl,
                proprietes.fileType || "PNG",
                xBloc,
                y,
                largeurLogo,
                hauteurLogo,
              );
            }
            doc.text(
              nomDesignationTexte,
              xBloc + largeurLogo + ECART,
              y + hauteurBloc / 2 + 6,
            );
            doc.setTextColor(0, 0, 0);
            y += hauteurBloc + 8;
            if (nomCohorte) {
              paragrapheCentre("Cohorte : " + nomCohorte, 9.5);
              y += 6;
            }
          } else if (nomCohorte) {
            paragrapheCentre(nomCohorte, 16, "bold", accentRGB);
            y += 8;
          }
        }
      }
    }
  }

  const total = document.getElementById("total-armee");
  if (total) paragraphe(total.textContent.trim(), 11, "bold", orRGB);
  y += 6;
  const resume = document.getElementById("orga-resume");
  if (resume && resume.textContent.trim()) {
    titreSection("Structure de l'armée", 12);
    for (const detachement of donneesResume(resume)) {
      paragraphe(detachement.titre, 10, "bold", accentRGB);
      for (const item of detachement.items) paragraphe("• " + item, 9);
      y += 4;
    }
  }

  const contenuRite = contenuRiteDeGuerreActuel();
  if (contenuRite) {
    y += 4;
    titreSection("Rite de Guerre : " + contenuRite.nomRite, 12);
    contenuRite.sections.forEach((section, indice) => {
      // Ligne vide entre les blocs Tactica de Légion / Posture /
      // Réaction Avancée (aucune avant le premier).
      if (indice > 0) y += 11.7;
      paragraphe(section.titre, 10.5, "bold", orRGB);
      for (const p of section.paragraphes) {
        paragraphe(p.texte, 9, p.style === "bold" ? "bold" : "normal");
      }
    });
  }

  const contenuDoctrine = contenuDoctrineCohorteActuelle();
  if (contenuDoctrine) {
    y += 4;
    titreSection("Doctrine de Cohorte : " + contenuDoctrine.nom, 12);
    paragraphe(contenuDoctrine.regle.texte, 9);
  }

  for (const contenuTrait of contenuTraitsFactionMechanicumActuels()) {
    y += 4;
    titreSection("Trait de Faction : " + contenuTrait.nom, 12);
    paragraphe(contenuTrait.regle.texte, 9);
  }

  const contenuArcane = contenuBeneficeOptionArcaneActuels();
  if (contenuArcane) {
    y += 4;
    titreSection("Bénéfice d'Arcane : " + contenuArcane.benefice.nom, 12);
    paragraphe(contenuArcane.benefice.regle.texte, 9);
    y += 16;
    titreSection("Option d'Arcane : " + contenuArcane.option.nom, 12);
    paragraphe(contenuArcane.option.regle.texte, 9);
  }

  for (const contenuTrait of contenuTraitsFactionSkitariiActuels()) {
    y += 4;
    titreSection("Trait de Faction : " + contenuTrait.nom, 12);
    paragraphe(contenuTrait.regle.texte, 9);
  }

  const contenuDesignation = contenuDesignationAuxiliaActuelle();
  if (contenuDesignation) {
    y += 4;
    titreSection(
      "Désignation de Legiones Auxilia : " + contenuDesignation.designation.nom,
      12,
    );
    paragraphe(contenuDesignation.regle.nom, 10.5, "bold", orRGB);
    paragraphe(contenuDesignation.regle.texte, 9);
  }

  // --- Une carte par unité ---
  for (const carte of document.querySelectorAll("#liste-unites .unite-carte")) {
    cartePDF(donneesCarte(carte));
  }

  // Tampon « validé » (assets/img/logo_inquisition.png), posé une seule
  // fois sur la page de garde comme un coup de tampon administratif —
  // simple clin d'œil visuel, aucune incidence sur les règles/le calcul
  // de points. doc.setPage(1) cible la page de garde même si la Liste
  // d'Armée a débordé sur d'autres pages entre-temps.
  const tamponDataUrl = await chargerImageDataURL(
    "../assets/img/logo_inquisition.png",
  );
  if (tamponDataUrl) {
    try {
      const proprietesTampon = doc.getImageProperties(tamponDataUrl);
      const TAILLE_TAMPON = 130;
      doc.setPage(1);
      doc.saveGraphicsState();
      doc.setGState(new doc.GState({ opacity: 0.8 }));
      doc.addImage(
        tamponDataUrl,
        proprietesTampon.fileType || "PNG",
        pageW - MARGE - TAILLE_TAMPON - 45,
        (MARGE + 40) / 2,
        TAILLE_TAMPON,
        TAILLE_TAMPON,
        undefined,
        undefined,
        -45,
      );
      doc.restoreGraphicsState();
    } catch {
      // Format d'image non géré par jsPDF (rare) : pas de tampon.
    }
  }

  // Cadre de carte, posé après coup sur chaque page générée (y
  // compris la page de garde) : plus simple et plus robuste que de
  // calculer sa hauteur à l'avance quand le contenu peut déborder sur
  // une page suivante (table ou bloc Définitions trop longs).
  doc.setDrawColor(...accentRGB);
  doc.setLineWidth(1.2);
  for (let i = 1; i <= doc.getNumberOfPages(); i++) {
    doc.setPage(i);
    doc.rect(MARGE, MARGE, pageW - 2 * MARGE, pageH - 2 * MARGE);
  }

  return doc;
}

async function telechargerPDF() {
  const doc = await genererPDF();
  doc.save(nomFichierArmee("pdf"));
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
  // Cadre en <hr> (haut/bas) plutôt qu'une bordure CSS sur .carte :
  // le filtre HTML de Word ne fusionne pas fiablement une bordure de
  // <div> avec le saut de page forcé qui précède chaque carte (la
  // boîte se disloque en autant de fragments que de paragraphes),
  // alors qu'un <hr> autonome traverse un saut de page sans problème.
  let html = '<div class="carte"><hr class="carte-trait">';
  html +=
    '<div class="entete"><span>' +
    echapperHTML(donnees.nom) +
    "</span><span>" +
    echapperHTML(donnees.points) +
    "</span></div>";
  if (donnees.compositionTexte) {
    html +=
      '<p class="composition">' +
      echapperHTML(donnees.compositionTexte) +
      "</p>";
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
      for (const entete of bloc.entetes)
        html += "<th>" + echapperHTML(entete) + "</th>";
      html += "</tr></thead><tbody>";
      for (const ligne of bloc.lignes) {
        html +=
          "<tr>" +
          ligne
            .map((cellule) => "<td>" + echapperHTML(cellule) + "</td>")
            .join("") +
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
  html += '<hr class="carte-trait">';
  html += "</div>";
  return html;
}

async function genererWordHTML() {
  // Couleurs d'accent (Légion/Faction en cours) et d'or (constante du
  // site) reprises telles quelles dans la feuille de style : le filtre
  // HTML de Word ne gère pas fiablement les variables CSS (var(--x)), d'où
  // des valeurs hex injectées en dur — voir couleursExport(), déjà utilisée
  // par le PDF (genererPDF) pour la même teinte.
  const couleurs = couleursExport();
  const accent = couleurs.accent;
  const or = couleurs.or;
  const style = `
    body { font-family: 'Times New Roman', serif; font-size: 11pt; color: #000; }
    h1 { font-size: 20pt; margin-bottom: 4pt; color: ${accent}; }
    h2 { font-size: 14pt; margin: 14pt 0 4pt; border-bottom: 2pt solid ${accent}; padding-bottom: 2pt; color: ${accent}; }
    .carte { margin-bottom: 20pt; page-break-inside: avoid; }
    .carte-trait { border: none; border-top: 2.5pt solid ${accent}; margin: 4pt 0 10pt; }
    .entete { font-weight: bold; font-size: 14pt; color: ${accent}; }
    .entete span:last-child { float: right; color: ${or}; }
    .composition { font-style: italic; font-size: 10pt; margin: 2pt 0 8pt; color: #333; }
    table { border-collapse: collapse; width: 100%; margin: 6pt 0; font-size: 9pt; }
    th, td { border: 1pt solid #000; padding: 3pt 5pt; text-align: center; }
    th { background: ${accent}; color: #fff; }
    p.ligne { margin: 4pt 0; font-size: 9.5pt; }
    p.ligne strong { color: ${accent}; }
    .definitions { margin-top: 8pt; border-top: 1.5pt solid ${or}; padding-top: 6pt; }
    .definitions p { margin: 3pt 0; font-size: 9pt; }
    .definitions p strong { color: ${accent}; }
    hr { border: none; border-top: 1pt solid #000; margin: 6pt 0 10pt; }
    /* Tableau plutôt que flexbox : le moteur HTML de Word ne gère pas
       fiablement flexbox, mais centre correctement une table via
       margin: 0 auto (technique classique HTML compatible Word). */
    .legion-table { border-collapse: collapse; width: auto; margin: 0 auto 6pt; }
    .legion-table td { border: none; padding: 0 6pt; text-align: left; vertical-align: middle; }
    .legion-logo { max-height: 50pt; max-width: 90pt; display: block; }
    .legion-nom { font-size: 16pt; font-weight: bold; color: ${accent}; }
    .legion-identite { text-align: center; font-size: 9.5pt; margin: 0 0 8pt; }
    .cohorte-titre { text-align: center; font-size: 16pt; font-weight: bold; margin: 0 0 8pt; color: ${accent}; }
    .total-armee { color: ${or}; }
    .detachement-titre { color: ${accent}; }
    .rite-titre { font-size: 11pt; margin-top: 8pt; color: ${or}; }
    .rite-sep { margin: 0; font-size: 11pt; line-height: 11pt; }
    .regle-nom { color: ${or}; }
  `;
  let corps = "";

  // Identité de Légion : blason et nom sur une même ligne centrée
  // (tableau à une ligne), Allégeance/Primarque/Monde natal centrés
  // en dessous (voir Organigramme.skinActuel/cheminLogoActuel,
  // js/organigramme.js).
  const skin = Organigramme.skinActuel ? Organigramme.skinActuel() : null;
  if (skin) {
    const logoDataUrl = await chargerImageDataURL(
      Organigramme.cheminLogoActuel(),
    );
    corps += '<table class="legion-table"><tr>';
    if (logoDataUrl) {
      corps +=
        '<td><img class="legion-logo" src="' + logoDataUrl + '" alt=""></td>';
    }
    corps +=
      '<td><span class="legion-nom">' +
      echapperHTML(Organigramme.legionActuelle() + " – " + skin.nom) +
      "</span></td>";
    corps += "</tr></table>";
    corps +=
      '<p class="legion-identite">' +
      echapperHTML(texteIdentiteLegion(skin)) +
      "</p>";
  } else {
    // Identité de Faction Legio Titanicus : même principe qu'une
    // Légion ci-dessus, mais avec DEUX blasons (un par cellule de part
    // et d'autre du nom) et sans ligne Allégeance/Monde natal (sans
    // objet pour cette Faction) — voir SKIN_TITANICUS/creerIconeTitan
    // dans js/organigramme.js.
    const skinTitan = Organigramme.skinTitanActuel
      ? Organigramme.skinTitanActuel()
      : null;
    if (skinTitan) {
      const chemins = Organigramme.cheminsLogoTitanActuel();
      const logosDataUrl = await Promise.all(
        chemins.map((c) => chargerImageDataURL(c)),
      );
      corps += '<table class="legion-table"><tr>';
      if (logosDataUrl[0]) {
        corps +=
          '<td><img class="legion-logo" src="' +
          logosDataUrl[0] +
          '" alt=""></td>';
      }
      corps +=
        '<td><span class="legion-nom">' +
        echapperHTML(skinTitan.nom) +
        "</span></td>";
      if (logosDataUrl[1]) {
        corps +=
          '<td><img class="legion-logo" src="' +
          logosDataUrl[1] +
          '" alt=""></td>';
      }
      corps += "</tr></table>";
    } else {
      // Identité de Maisonnée (Faction Chevaliers Questoris) : même
      // principe qu'une Légion ci-dessus (voir Organigramme.
      // skinMaisonActuel/cheminLogoMaisonActuel, js/organigramme.js) —
      // logo + nom de la Maisonnée, devise en dessous, puis une ligne
      // nommant le Détachement Additionnel débloqué par le Paradigme de
      // cette Maisonnée (DETACHEMENT_PARADIGME_MAISONNEE, même source
      // que le PDF, voir genererPDF ci-dessus).
      const skinMaison = Organigramme.skinMaisonActuel
        ? Organigramme.skinMaisonActuel()
        : null;
      if (skinMaison) {
        const logoDataUrl = await chargerImageDataURL(
          Organigramme.cheminLogoMaisonActuel(),
        );
        corps += '<table class="legion-table"><tr>';
        if (logoDataUrl) {
          corps +=
            '<td><img class="legion-logo" src="' +
            logoDataUrl +
            '" alt=""></td>';
        }
        corps +=
          '<td><span class="legion-nom">' +
          echapperHTML(skinMaison.nom) +
          "</span></td>";
        corps += "</tr></table>";
        if (skinMaison.devise) {
          corps +=
            '<p class="legion-identite">' +
            echapperHTML(skinMaison.devise) +
            "</p>";
        }
        const detachementParadigme =
          Organigramme.detachementParadigmeMaisonActuel
            ? Organigramme.detachementParadigmeMaisonActuel()
            : null;
        if (detachementParadigme) {
          corps +=
            '<p class="legion-identite"><em>Paradigme de Maisonnée : débloque le Détachement Additionnel ' +
            echapperHTML(detachementParadigme) +
            "</em></p>";
        }
      } else {
        // Identité couleurs seules (sans blason) pour les Factions Legio
        // Custodes/Anathema Psykana/Conclaves Skitarii (voir même bloc
        // dans genererPDF ci-dessus) : nom centré en gras (.cohorte-titre,
        // réutilisé tel quel), devise centrée en dessous.
        const skinSansBlason =
          (Organigramme.skinLegioCustodesActuel &&
            Organigramme.skinLegioCustodesActuel()) ||
          (Organigramme.skinAnathemaPsykanaActuel &&
            Organigramme.skinAnathemaPsykanaActuel()) ||
          (Organigramme.skinSkitariiActuel &&
            Organigramme.skinSkitariiActuel()) ||
          (Organigramme.skinRuinstormActuel &&
            Organigramme.skinRuinstormActuel()) ||
          (Organigramme.skinLegionsBriseesActuel &&
            Organigramme.skinLegionsBriseesActuel()) ||
          (Organigramme.skinBlackshieldsActuel &&
            Organigramme.skinBlackshieldsActuel()) ||
          null;
        if (skinSansBlason) {
          corps +=
            '<p class="cohorte-titre">' +
            echapperHTML(skinSansBlason.nom) +
            "</p>";
          if (skinSansBlason.devise) {
            corps +=
              '<p class="legion-identite">' +
              echapperHTML(skinSansBlason.devise) +
              "</p>";
          }
        } else if (Organigramme.factionActuelle() === "mechanicum") {
          // Identité de Mechanicum : « Mechanicum – [Techno-arcane] » centré
          // en gras, Allégeance centré en dessous, sur le modèle de Legio
          // Astartes (voir même bloc dans genererPDF ci-dessus).
          const TECHNO_ARCANES = [
            ["archimandrite", "Archimandrite"],
            ["cybernetica", "Cybernetica"],
            ["lacrymaerta", "Lacrymaerta"],
            ["myrmidax", "Myrmidax"],
            ["reductor", "Reductor"],
            ["malagra", "Malagra"],
            ["macrotek", "Macrotek"],
          ];
          const technoArcaneCode = Organigramme.technoArcaneActuel();
          const ta = technoArcaneCode
            ? TECHNO_ARCANES.find(([code]) => code === technoArcaneCode)
            : null;
          if (ta) {
            corps +=
              '<p class="cohorte-titre">' +
              echapperHTML("Mechanicum – " + ta[1]) +
              "</p>";
            corps +=
              '<p class="legion-identite">' +
              echapperHTML(
                "Allégeance : " +
                  (Organigramme.allegeanceActuelle() === "renegat"
                    ? "Renégat"
                    : "Loyaliste"),
              ) +
              "</p>";
          }
        } else {
          // Identité de Désignation de Legiones Auxilia / Doctrine de
          // Cohorte (Faction Solar Auxilia) : même principe qu'une Légion
          // ci-dessus (voir Organigramme.skinDesignationActuel/
          // cheminLogoDesignationActuel, js/organigramme.js) — logo + nom
          // de la Désignation, puis nom de la Cohorte centré en dessous. La
          // Désignation étant facultative (contrairement à la Doctrine,
          // obligatoire), le nom de la Cohorte prend seul la place du titre
          // (.cohorte-titre, même taille/graisse que .legion-nom) quand
          // aucune Désignation n'est choisie.
          const skinDesignation = Organigramme.skinDesignationActuel
            ? Organigramme.skinDesignationActuel()
            : null;
          const nomCohorte = nomDoctrineCohorteActuelle();
          if (skinDesignation) {
            const logoDataUrl = await chargerImageDataURL(
              Organigramme.cheminLogoDesignationActuel(),
            );
            corps += '<table class="legion-table"><tr>';
            if (logoDataUrl) {
              corps +=
                '<td><img class="legion-logo" src="' +
                logoDataUrl +
                '" alt=""></td>';
            }
            corps +=
              '<td><span class="legion-nom">' +
              echapperHTML(skinDesignation.nom) +
              "</span></td>";
            corps += "</tr></table>";
            if (nomCohorte) {
              corps +=
                '<p class="legion-identite">Cohorte : ' +
                echapperHTML(nomCohorte) +
                "</p>";
            }
          } else if (nomCohorte) {
            corps +=
              '<p class="cohorte-titre">' + echapperHTML(nomCohorte) + "</p>";
          }
        }
      }
    }
  }

  const total = document.getElementById("total-armee");
  if (total)
    corps +=
      '<p class="total-armee"><strong>' +
      echapperHTML(total.textContent.trim()) +
      "</strong></p>";
  const resume = document.getElementById("orga-resume");
  if (resume && resume.textContent.trim()) {
    corps += "<h2>Structure de l'armée</h2>";
    for (const detachement of donneesResume(resume)) {
      corps +=
        '<p class="detachement-titre"><strong>' +
        echapperHTML(detachement.titre) +
        "</strong></p><ul>";
      for (const item of detachement.items)
        corps += "<li>" + echapperHTML(item) + "</li>";
      corps += "</ul>";
    }
  }

  const contenuRite = contenuRiteDeGuerreActuel();
  if (contenuRite) {
    corps +=
      "<h2>Rite de Guerre : " + echapperHTML(contenuRite.nomRite) + "</h2>";
    contenuRite.sections.forEach((section, indice) => {
      // Ligne vide entre les blocs Tactica de Légion / Posture /
      // Réaction Avancée (aucune avant le premier).
      if (indice > 0) corps += '<p class="rite-sep">&nbsp;</p>';
      corps +=
        '<p class="rite-titre"><strong>' +
        echapperHTML(section.titre) +
        "</strong></p>";
      for (const p of section.paragraphes) {
        corps +=
          p.style === "bold"
            ? "<p><strong>" + echapperHTML(p.texte) + "</strong></p>"
            : "<p>" + echapperHTML(p.texte) + "</p>";
      }
    });
  }

  const contenuDoctrine = contenuDoctrineCohorteActuelle();
  if (contenuDoctrine) {
    corps +=
      "<h2>Doctrine de Cohorte : " +
      echapperHTML(contenuDoctrine.nom) +
      "</h2>";
    corps += "<p>" + echapperHTML(contenuDoctrine.regle.texte) + "</p>";
  }

  for (const contenuTrait of contenuTraitsFactionMechanicumActuels()) {
    corps +=
      "<h2>Trait de Faction : " + echapperHTML(contenuTrait.nom) + "</h2>";
    corps += "<p>" + echapperHTML(contenuTrait.regle.texte) + "</p>";
  }

  const contenuArcaneWord = contenuBeneficeOptionArcaneActuels();
  if (contenuArcaneWord) {
    corps +=
      "<h2>Bénéfice d'Arcane : " +
      echapperHTML(contenuArcaneWord.benefice.nom) +
      "</h2>";
    corps +=
      "<p>" + echapperHTML(contenuArcaneWord.benefice.regle.texte) + "</p>";
    corps += "<p>&nbsp;</p>";
    corps +=
      "<h2>Option d'Arcane : " +
      echapperHTML(contenuArcaneWord.option.nom) +
      "</h2>";
    corps +=
      "<p>" + echapperHTML(contenuArcaneWord.option.regle.texte) + "</p>";
  }

  for (const contenuTrait of contenuTraitsFactionSkitariiActuels()) {
    corps +=
      "<h2>Trait de Faction : " + echapperHTML(contenuTrait.nom) + "</h2>";
    corps += "<p>" + echapperHTML(contenuTrait.regle.texte) + "</p>";
  }

  const contenuDesignation = contenuDesignationAuxiliaActuelle();
  if (contenuDesignation) {
    corps +=
      "<h2>Désignation de Legiones Auxilia : " +
      echapperHTML(contenuDesignation.designation.nom) +
      "</h2>";
    corps +=
      '<p class="regle-nom"><strong>' +
      echapperHTML(contenuDesignation.regle.nom) +
      "</strong></p>";
    corps += "<p>" + echapperHTML(contenuDesignation.regle.texte) + "</p>";
  }

  // Une carte par page (comme le PDF, voir nouvellePage/cartePDF) : un
  // <br style="page-break-before:always"> DEVANT la carte (jamais
  // page-break-before sur .carte elle-même — Word éclate alors la
  // bordure du cadre en autant de boîtes que de paragraphes, un bug
  // confirmé du filtre HTML de Word sur les div bordurées).
  for (const carte of document.querySelectorAll("#liste-unites .unite-carte")) {
    corps += '<br style="page-break-before: always">';
    corps += carteWordHTML(donneesCarte(carte));
  }
  return (
    "<!DOCTYPE html><html xmlns:o='urn:schemas-microsoft-com:office:office' " +
    "xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>" +
    '<head><meta charset="utf-8"><title>Liste d\'armée — Horus Heresy</title>' +
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

async function telechargerWord() {
  // BOM ("﻿") : force Word à détecter l'encodage UTF-8 (sinon les
  // accents peuvent s'afficher mal à l'ouverture).
  telechargerBlob(
    nomFichierArmee("doc"),
    "﻿" + (await genererWordHTML()),
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
  const selectLegion = document.getElementById("choix-legion-unite");
  // Décochée par défaut (voir pages/construction-liste.html) : tant qu'elle ne l'est
  // pas, les unités `legacy: true` (js/unites-data.js) restent hors de
  // la liste déroulante ci-dessous, aussi bien à l'ouverture qu'à la
  // frappe.
  const caseLegacies = document.getElementById("afficher-legacies");
  const legaciesAffichees = () => Boolean(caseLegacies && caseLegacies.checked);

  // Peupler le sélecteur de Légion Alliée avec les Légions ayant des unités
  function peuplerSelectLegionAlliee() {
    if (!selectLegion || !orgaPret || typeof Organigramme === "undefined") return;

    const legionsAlliees = Organigramme.legionsAlliees();
    // Supprimer toutes les options sauf la première
    while (selectLegion.options.length > 1) {
      selectLegion.remove(1);
    }

    // Ajouter une option pour chaque Légion Alliée
    for (const legionCode of legionsAlliees) {
      const legionLabel = LEGIONS.find(([code]) => code === legionCode)?.[1] || legionCode;
      const opt = document.createElement("option");
      opt.value = legionCode;
      opt.textContent = legionLabel;
      selectLegion.appendChild(opt);
    }
  }

  // Assignera la fonction à la variable globale pour qu'elle puisse être appelée depuis actualiserVerrouLegion
  peuplerSelectLegionUniteAlliee = peuplerSelectLegionAlliee;

  // Retourne true si l'unité est accessible pour la Légion choisie
  function uniteAccessiblePourLegionChoisie(unite) {
    const legionChoisie = selectLegion ? selectLegion.value : "";

    if (!legionChoisie) {
      // Pas de Légion choisie : utiliser le filtre normal
      return uniteAccessible(unite);
    }

    // Légion choisie : vérifier si l'unité est accessible pour cette Légion
    if (!unite.legion) return unite.faction === "legio-astartes" || !unite.faction;
    return unite.legion === legionChoisie;
  }

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
  // suivi des unités { unite } de cette catégorie, triées par ordre
  // alphabétique de leur nom (plutôt que l'ordre d'apparition dans
  // js/unites-data.js, qui ne reflète que l'ordre de transcription).
  const entrees = [];
  for (const categorie of categories) {
    entrees.push({ groupe: categorie });
    const unitesCategorie = UNITES.filter(
      (u) => u.categorie === categorie,
    ).sort((a, b) => a.nom.localeCompare(b.nom, "fr"));
    for (const unite of unitesCategorie) {
      entrees.push({ unite });
    }
  }

  const libelle = (unite) =>
    unite.nom +
    (unite.legacy ? ` (${unite.legacyLibelle || "Legacies"})` : "") +
    " — " +
    unite.cout +
    " pts";
  const idOption = (unite) => "choix-unite-option-" + unite.id;

  let uniteId = null;
  let visibles = entrees; // sous-ensemble d'`entrees` correspondant à la recherche courante
  let indiceActif = -1; // indice dans les options visibles (hors en-têtes)
  // Catégories (« Attaque Rapide », « État-major »...) repliées par un
  // clic sur leur en-tête — persiste tant que la page reste ouverte,
  // y compris après fermeture/réouverture du menu. Ignoré tant qu'une
  // recherche texte est en cours (voir derniereRecherche) : replier une
  // catégorie ne doit pas masquer un résultat de recherche pertinent.
  // Toutes repliées par défaut (demande du proprio) : la liste complète
  // serait sinon bien trop longue à parcourir à l'ouverture.
  const categoriesRepliees = new Set(categories);
  let derniereRecherche = "";

  // Sélection par défaut avant toute saisie/sélection, dépendante de
  // la Faction (idUniteParDefautPourFaction : Praetor pour Legio
  // Astartes, Titan Warlord pour Legio Titanicus) plutôt que fixée une
  // fois pour toutes à la première entrée du tableau — sinon elle
  // dépendrait juste de l'ordre des catégories. Rebranchée sur
  // reinitialiserChoixUniteParDefaut (module) pour être rappelée par
  // actualiserVerrouLegion à chaque changement de Faction réel.
  function reinitialiserSelectionParDefaut() {
    const idVoulu = idUniteParDefautPourFaction();
    // Uniquement parmi les unités réellement accessibles (uniteAccessible) :
    // une Faction sans unité transcrite (ex : Chevaliers Questoris) ne doit
    // pas retomber sur la première unité du tableau UNITES, forcément
    // inaccessible et donc trompeuse une fois affichée dans le champ.
    const accessibles = entrees.filter(
      (e) =>
        e.unite &&
        uniteAccessiblePourLegionChoisie(e.unite) &&
        (!e.unite.legacy || legaciesAffichees()),
    );
    const defaut =
      accessibles.find((e) => e.unite.id === idVoulu) || accessibles[0];
    uniteId = defaut ? defaut.unite.id : null;
    champ.value = defaut ? libelle(defaut.unite) : "";
  }
  reinitialiserChoixUniteParDefaut = reinitialiserSelectionParDefaut;

  // La normalisation (accents, casse) est assurée par normaliserTexte,
  // partagée par toutes les barres de recherche du site (js/main.js).
  // Filtrée en direct (pas de rebuild d'`entrees` nécessaire) : ouvrir
  // ou retaper dans le champ relit toujours la Légion actuelle.
  // Dans chaque catégorie, les unités de la Faction actuelle remontent
  // avant celles des autres Factions (ex : Titans Legio Titanicus dans
  // une Armée Legio Astartes, cf. l'exception de uniteAccessible en
  // tête de fichier) ; parmi les autres Factions, les unités sont
  // groupées par Faction (ordre canonique du menu « Faction », voir
  // ordreFactions()) plutôt que mélangées ; à Faction égale, les unités
  // propres à la Légion actuelle remontent avant les unités génériques
  // (tri stable : l'ordre d'origine est conservé au sein de chaque
  // sous-groupe).
  function filtrer(requete) {
    const q = normaliserTexte(requete.trim());
    const legionCourante = Organigramme.legionActuelle();
    const factionCourante = Organigramme.factionActuelle();
    const ordreFactions = Organigramme.ordreFactions();
    const resultat = [];
    let groupeCourant = null;
    let uniteesCourantes = [];
    const vider = () => {
      if (uniteesCourantes.length === 0) return;
      uniteesCourantes.sort((a, b) => {
        const factionA = a.unite.faction || "legio-astartes";
        const factionB = b.unite.faction || "legio-astartes";
        const diffFaction =
          (factionA === factionCourante ? 0 : 1) -
          (factionB === factionCourante ? 0 : 1);
        if (diffFaction !== 0) return diffFaction;
        if (factionA !== factionB) {
          return (
            ordreFactions.indexOf(factionA) - ordreFactions.indexOf(factionB)
          );
        }
        return (
          (a.unite.legion === legionCourante ? 0 : 1) -
          (b.unite.legion === legionCourante ? 0 : 1)
        );
      });
      resultat.push(groupeCourant, ...uniteesCourantes);
      uniteesCourantes = [];
    };
    for (const entree of entrees) {
      if (entree.groupe) {
        vider();
        groupeCourant = entree;
        continue;
      }
      if (!uniteAccessiblePourLegionChoisie(entree.unite)) continue;
      if (entree.unite.legacy && !legaciesAffichees()) continue;
      if (q && !normaliserTexte(entree.unite.nom).includes(q)) continue;
      uniteesCourantes.push(entree);
    }
    vider();
    return resultat;
  }

  // Options réellement affichées : hors en-têtes, et hors catégories
  // repliées tant qu'aucune recherche texte n'est en cours (voir
  // categoriesRepliees ci-dessus).
  const options = () => {
    const rechercheActive = derniereRecherche !== "";
    let categorieRepliee = false;
    const resultat = [];
    for (const e of visibles) {
      if (e.groupe) {
        categorieRepliee = categoriesRepliees.has(e.groupe);
        continue;
      }
      if (categorieRepliee && !rechercheActive) continue;
      resultat.push(e);
    }
    return resultat;
  };

  // Une unité par ailleurs accessible (Faction/Légion/Allégeance, voir
  // uniteAccessible) n'est réellement sélectionnable dans ce menu que
  // si au moins une Case libre d'un détachement DÉJÀ présent dans
  // l'Armée peut l'accueillir (règle p. 282 : Rôle Tactique de l'unité
  // = Rôle Tactique de la Case) — sinon elle reste visible mais grisée,
  // avec l'explication de Organigramme.suggestionPourRole en info-bulle
  // (même message que celui affiché après un clic sur « Ajouter » sans
  // Case libre, voir boutonAjouter plus bas, avancé ici pour éviter le
  // clic dans le vide). Par défaut (Organigramme pas encore prêt), on
  // considère l'unité disponible pour ne pas griser tout le menu avant
  // restauration de l'organigramme.
  const uniteDisponiblePourCases = (unite) =>
    !orgaPret ||
    typeof Organigramme === "undefined" ||
    Organigramme.casesLibresPour(unite).length > 0;

  // Prochain indice, dans la direction donnée (1 ou -1), dont l'unité
  // est réellement sélectionnable — permet à la navigation clavier de
  // sauter par-dessus les entrées grisées plutôt que de s'y arrêter.
  // -1 si aucune trouvée dans cette direction.
  function prochainIndiceDisponible(depart, direction) {
    const opts = options();
    let i = depart;
    while (i >= 0 && i < opts.length) {
      if (uniteDisponiblePourCases(opts[i].unite)) return i;
      i += direction;
    }
    return -1;
  }

  // Libellés des Factions (FACTIONS dans js/organigramme.js) affichés
  // en gris à côté du nom d'une unité d'une autre Faction que celle de
  // l'Armée (ex : Titans Legio Titanicus dans une Armée Legio
  // Astartes, cf. l'exception de uniteAccessible en tête de fichier).
  const LIBELLES_FACTION = {
    "legio-astartes": "Legio Astartes",
    "legio-titanicus": "Legio Titanicus",
    "chevaliers-questoris": "Chevaliers Questoris",
    skitarii: "Conclaves Skitarii",
    "legio-custodes": "Legio Custodes",
    "anathema-psykana": "Anathema Psykana",
    "divisio-assassinorum": "Divisio Assassinorum",
    "daemons-ruinstorm": "Démons de la Tempête de la Ruine",
  };

  function rendre() {
    liste.replaceChildren();
    if (visibles.length === 0) {
      liste.appendChild(
        el("li", "unite-combobox-vide", "Aucune unité trouvée."),
      );
      return;
    }
    const factionCourante = Organigramme.factionActuelle();
    // Légion Alliée à utiliser pour teinter les unités Legio Astartes
    // génériques (sans `legion` propre) d'une autre Faction que celle
    // de l'Armée : n'a de sens que s'il n'y en a qu'une seule en jeu
    // (plusieurs Détachements Alliés de Légions différentes rendraient
    // le choix ambigu — on laisse alors la teinte neutre habituelle).
    const legionsAllieesActuelles = Organigramme.legionsAlliees();
    const legionAllieeUnique =
      legionsAllieesActuelles.length === 1 ? legionsAllieesActuelles[0] : null;
    const rechercheActive = derniereRecherche !== "";
    let categorieRepliee = false;
    for (const entree of visibles) {
      if (entree.groupe) {
        const repliee = categoriesRepliees.has(entree.groupe);
        categorieRepliee = repliee;
        const li = document.createElement("li");
        li.className = "unite-combobox-groupe";
        li.setAttribute("role", "presentation");
        // <button> plutôt qu'un simple clic sur le <li> : focalisable au
        // clavier (Tab) sans passer par le système d'aria-activedescendant
        // du combobox (réservé aux unités), Entrée/Espace le déclenchent
        // nativement. mousedown+preventDefault (comme choix-unite-bouton
        // plus bas) pour ne pas voler le focus du champ à la souris.
        const bouton = document.createElement("button");
        bouton.type = "button";
        bouton.className = "unite-combobox-groupe-bouton";
        bouton.setAttribute("aria-expanded", String(!repliee));
        bouton.setAttribute(
          "aria-label",
          (repliee ? "Déplier" : "Replier") + " la catégorie " + entree.groupe,
        );
        bouton.appendChild(
          el("span", "unite-combobox-groupe-chevron", repliee ? "▸" : "▾"),
        );
        bouton.appendChild(document.createTextNode(entree.groupe));
        bouton.addEventListener("mousedown", (evenement) => {
          evenement.preventDefault();
        });
        bouton.addEventListener("click", (evenement) => {
          // stopPropagation obligatoire : rendre() (ci-dessous) retire ce
          // <button> du DOM (liste.replaceChildren()) avant que
          // l'évènement ne finisse de remonter. Sans cela, le
          // gestionnaire "clic en dehors" posé sur `document` (plus bas)
          // ne retrouve plus la cible dans `liste` une fois détachée, et
          // referme le menu à tort (fermer() → liste.hidden = true).
          evenement.stopPropagation();
          if (repliee) categoriesRepliees.delete(entree.groupe);
          else categoriesRepliees.add(entree.groupe);
          rendre();
          surligner(-1);
        });
        li.appendChild(bouton);
        liste.appendChild(li);
        continue;
      }
      if (categorieRepliee && !rechercheActive) continue;
      const factionUnite = entree.unite.faction || "legio-astartes";
      const autreFaction = factionUnite !== factionCourante;
      let classe = "unite-combobox-option";
      if (entree.unite.legion === Organigramme.legionActuelle()) {
        classe += " unite-combobox-option--legion";
      }
      // Teinte de Légion (voir SKINS_LEGION dans js/organigramme.js) :
      // celle propre à l'unité si elle en a une, sinon celle du Détachement
      // Allié Legio Astartes s'il n'y en a qu'un — remplace le fond gris
      // neutre de --autre-faction par la couleur d'identité de la Légion.
      let accentTeinte = null;
      if (autreFaction) {
        classe += " unite-combobox-option--autre-faction";
        if (factionUnite === "legio-astartes") {
          const legionPourTeinte = entree.unite.legion || legionAllieeUnique;
          accentTeinte =
            legionPourTeinte && Organigramme.accentLegion(legionPourTeinte);
        }
      }
      if (accentTeinte) classe += " unite-combobox-option--teinte-legion";
      const disponible = uniteDisponiblePourCases(entree.unite);
      if (!disponible) classe += " unite-combobox-option--indisponible";
      const li = el("li", classe);
      if (accentTeinte) li.style.setProperty("--tinte-legion", accentTeinte);
      li.appendChild(document.createTextNode(libelle(entree.unite)));
      if (autreFaction) {
        li.appendChild(
          el(
            "span",
            "unite-combobox-option-faction",
            " (" + (LIBELLES_FACTION[factionUnite] || factionUnite) + ")",
          ),
        );
      }
      li.id = idOption(entree.unite);
      li.setAttribute("role", "option");
      li.dataset.uniteId = entree.unite.id;
      li.setAttribute("aria-selected", String(entree.unite.id === uniteId));
      li.setAttribute("aria-disabled", String(!disponible));
      if (!disponible) {
        // Bulle .tooltip (même mécanisme que les Règles Spéciales des
        // tables d'armes/l'Organigramme — voir creerRegleTag,
        // js/main.js) plutôt qu'un simple attribut `title` : sur
        // mobile, `title` ne se déclenche jamais au doigt, alors que
        // la bulle s'affiche en bandeau fixé en bas d'écran au focus
        // (CSS), déclenché explicitement au tap (voir mousedown plus
        // bas). tabIndex la rend focalisable, requis pour le focus
        // clavier/tactile.
        li.tabIndex = 0;
        li.appendChild(
          el("span", "tooltip", Organigramme.suggestionPourRole(entree.unite)),
        );
      }
      liste.appendChild(li);
    }
    if (window.cablerInfoBulles) window.cablerInfoBulles(liste);
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
    // Repliées à nouveau à chaque fermeture (clic en dehors, Échap,
    // sélection d'une unité...) : la prochaine ouverture retrouve
    // toutes les catégories réduites, comme à l'ouverture initiale.
    for (const c of categories) categoriesRepliees.add(c);
  }

  function ouvrir(requete) {
    derniereRecherche = requete.trim();
    visibles = filtrer(requete);
    rendre();
    liste.hidden = false;
    champ.setAttribute("aria-expanded", "true");
    surligner(-1);
    // L'ascenseur de la liste ne doit jamais rouvrir sur la position de
    // défilement laissée par une session précédente (ex : sélection
    // faite tout en bas) : toujours remonter en haut à l'ouverture.
    liste.scrollTop = 0;
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
      else {
        const suivant = prochainIndiceDisponible(
          Math.min(indiceActif + 1, options().length - 1),
          1,
        );
        if (suivant !== -1) surligner(suivant);
      }
    } else if (evenement.key === "ArrowUp") {
      evenement.preventDefault();
      if (liste.hidden) ouvrir(champ.value);
      else {
        const precedent = prochainIndiceDisponible(
          Math.max(indiceActif - 1, 0),
          -1,
        );
        if (precedent !== -1) surligner(precedent);
      }
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
      if (cible && uniteDisponiblePourCases(cible.unite)) choisir(cible.unite);
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
    if (li.getAttribute("aria-disabled") === "true") {
      // Cette option porte désormais une bulle .tooltip (voir rendre()
      // ci-dessus) plutôt qu'un `title`, sur le même principe que les
      // Règles Spéciales des tables d'armes : elle s'affiche au focus
      // (CSS), en bandeau fixé en bas d'écran sur mobile — jamais
      // recouverte par la liste ouverte ni par le clavier virtuel,
      // contrairement à `title` (jamais déclenché au doigt) ou à un
      // message inline. preventDefault() ci-dessus empêchant le focus
      // natif du navigateur, on le déclenche nous-mêmes.
      li.focus();
      return;
    }
    const unite = trouverUnite(li.dataset.uniteId);
    if (unite) choisir(unite);
  });

  // Bouton « flèche » : bascule la liste complète, comme la flèche
  // d'un <select>. mousedown + preventDefault (plutôt que click) pour
  // ne pas voler le focus du champ.
  const basculerListe = () => {
    if (liste.hidden) {
      ouvrir("");
      champ.select();
    } else {
      fermer();
    }
    champ.focus();
  };

  bouton.addEventListener("mousedown", (evenement) => {
    evenement.preventDefault();
    basculerListe();
  });

  // Accessibilité (WCAG 2.1.1 « Clavier » / RGAA 7.3) : mousedown ne
  // couvre QUE la souris et le tactile. Un utilisateur au clavier qui
  // atteint ce bouton par Tab puis appuie sur Entrée ou Espace
  // déclenche un « click » — jamais un « mousedown » : le bouton était
  // donc focalisable mais totalement inerte au clavier.
  // Pourquoi ne pas simplement remplacer mousedown par click ? Parce
  // qu'à la souris, click arrive APRÈS mousedown : les deux
  // écouteurs se déclencheraient à la suite et la liste s'ouvrirait
  // puis se refermerait aussitôt. On distingue donc les deux origines
  // avec evenement.detail : c'est le compteur de clics, qui vaut 0
  // quand le « click » a été synthétisé par le clavier, et 1 ou plus
  // quand il vient d'un vrai clic de souris.
  bouton.addEventListener("click", (evenement) => {
    if (evenement.detail !== 0) return; // clic souris : déjà traité
    basculerListe();
  });

  // Case « Afficher les unités Legacies » (pages/construction-liste.html) :
  // rafraîchit la liste déroulante si elle est déjà ouverte (un simple
  // changement de focus au clavier, contrairement à un clic, ne
  // referme pas la liste via le gestionnaire "clic en dehors"
  // ci-dessous — sans ce rafraîchissement explicite, elle resterait
  // affichée avec un contenu périmé). Si l'unité actuellement retenue
  // dans le champ est une unité Legacy qui vient de disparaître (case
  // décochée), on retombe sur la sélection par défaut — même filet de
  // sécurité que reinitialiserSelectionParDefaut ci-dessus, pour éviter
  // qu'un « Ajouter » ajoute une unité qui n'est plus visible dans la
  // liste.
  if (caseLegacies) {
    caseLegacies.addEventListener("change", () => {
      const uniteCourante = trouverUnite(uniteId);
      if (uniteCourante && uniteCourante.legacy && !legaciesAffichees()) {
        reinitialiserSelectionParDefaut();
      }
      if (!liste.hidden) ouvrir(champ.value);
    });
  }

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

  // Sélecteur de Légion Alliée : peupler et ajouter un listener
  peuplerSelectLegionAlliee();
  if (selectLegion) {
    selectLegion.addEventListener("change", () => {
      // Mettre à jour la liste des unités filtrées
      const rechercheActive = derniereRecherche !== "";
      if (!liste.hidden || rechercheActive) {
        ouvrir(champ.value);
      }
      // Réinitialiser la sélection par défaut si le filtre change
      reinitialiserSelectionParDefaut();
    });
  }

  reinitialiserSelectionParDefaut();
  // Évite qu'actualiserVerrouLegion() ne rappelle inutilement
  // reinitialiserSelectionParDefaut() dès son premier passage : on
  // vient de faire l'équivalent ci-dessus, pour la Faction actuelle.
  derniereFactionCombobox =
    orgaPret && typeof Organigramme !== "undefined"
      ? Organigramme.factionActuelle()
      : "legio-astartes";
  actualiserPlaceholderUnite();

  return () => trouverUnite(uniteId);
}

// Petit menu déroulant générique (Téléchargement PDF/Word, Export/Import) :
// un bouton bascule un <ul> masqué par [hidden], refermé au clic
// extérieur, sur Échap, ou dès qu'une option à l'intérieur est cliquée —
// même principe d'ouverture/fermeture que le combobox « Unité à ajouter »
// (initialiserChoixUnite), en plus simple (pas de recherche).
// Accessibilité : c'est le motif « disclosure » (bouton + aria-expanded +
// aria-controls), PAS le motif « menu » d'ARIA. Les rôles menu/menuitem
// ont été retirés du HTML parce qu'ils promettaient une navigation aux
// flèches que cette fonction n'implémente pas (voir le commentaire dans
// pages/construction-liste.html). Si on ajoute un jour cette navigation
// ici, il faudra reposer ces rôles : les deux vont ensemble.
function initialiserMenuDeroulant(idBouton, idListe) {
  const bouton = document.getElementById(idBouton);
  const liste = document.getElementById(idListe);
  if (!bouton || !liste) return;
  const fermer = () => {
    liste.hidden = true;
    bouton.setAttribute("aria-expanded", "false");
  };
  bouton.addEventListener("click", () => {
    const doitOuvrir = liste.hidden;
    fermer();
    if (doitOuvrir) {
      liste.hidden = false;
      bouton.setAttribute("aria-expanded", "true");
    }
  });
  liste.addEventListener("click", (evenement) => {
    if (evenement.target.closest("button")) fermer();
  });
  document.addEventListener("click", (evenement) => {
    if (
      !liste.hidden &&
      evenement.target !== bouton &&
      !liste.contains(evenement.target)
    )
      fermer();
  });
  document.addEventListener("keydown", (evenement) => {
    if (evenement.key === "Escape" && !liste.hidden) fermer();
  });
}

function initialiser() {
  const uniteChoisie = initialiserChoixUnite();
  const boutonAjouter = document.getElementById("ajouter-unite");
  const boutonTelechargerPDF = document.getElementById("telecharger-pdf");
  const boutonTelechargerWord = document.getElementById("telecharger-word");
  const boutonExporter = document.getElementById("exporter-liste");
  const boutonImporter = document.getElementById("importer-liste");
  const champImportFichier = document.getElementById("importer-liste-fichier");
  const messageImport = document.getElementById("import-message");
  const boutonVider = document.getElementById("vider-liste");
  const listeCartes = document.getElementById("liste-unites");
  const messageAjout = document.getElementById("ajout-message");

  initialiserMenuDeroulant(
    "bouton-telechargement",
    "menu-telechargement-liste",
  );
  initialiserMenuDeroulant("bouton-export-import", "menu-export-import-liste");

  boutonAjouter.addEventListener("click", () => {
    // Filet de sécurité : le bouton est normalement désactivé tant que le
    // verrou d'actualiserVerrouLegion() est actif (Légion manquante pour
    // une Armée Legio Astartes, Maisonnée manquante pour une Armée
    // Chevaliers Questoris, Doctrine de Cohorte manquante pour une Armée
    // Solar Auxilia, ou Faction sans aucune unité accessible) — sauf
    // Détachement Narratif présent, qui dispense ces verrous.
    if (
      (!Organigramme.narratifPresent() &&
        ((Organigramme.factionActuelle() === "legio-astartes" &&
          Organigramme.legionActuelle() === "") ||
          (Organigramme.factionActuelle() === "chevaliers-questoris" &&
            Organigramme.maisonneeActuelle() === "") ||
          (Organigramme.factionActuelle() === "solar-auxilia" &&
            Organigramme.doctrineCohorteActuelle() === "") ||
          (Organigramme.factionActuelle() === "mechanicum" &&
            Organigramme.technoArcaneActuel() === ""))) ||
      !UNITES.some((u) => uniteAccessible(u))
    )
      return;
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

  boutonExporter.addEventListener("click", () => exporterListe());
  boutonImporter.addEventListener("click", () => champImportFichier.click());
  champImportFichier.addEventListener("change", () => {
    const fichier = champImportFichier.files[0];
    // Permet de réimporter le même fichier une seconde fois (sinon
    // "change" ne se déclenche plus si la sélection ne change pas).
    champImportFichier.value = "";
    if (!fichier) return;
    if (
      !window.confirm(
        "Importer ce fichier remplacera entièrement la liste et l'organigramme actuels. Continuer ?",
      )
    )
      return;
    const lecteur = new FileReader();
    lecteur.addEventListener("load", () => {
      const erreur = importerListe(String(lecteur.result));
      if (erreur) {
        messageImport.textContent = erreur;
        messageImport.hidden = false;
        return;
      }
      // Recharge la page : restaurer()/Organigramme.initialiser() (déjà
      // exécutés au chargement normal) relisent alors ces données depuis
      // localStorage et les revalident exactement comme une sauvegarde
      // native, sans dupliquer cette logique ici.
      location.reload();
    });
    lecteur.readAsText(fichier);
  });

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
  // orgaPret DOIT passer à true avant Organigramme.initialiser() (pas
  // après) : cet appel restaure lui-même etat.faction/etat.legion depuis
  // le stockage puis déclenche aussitôt surChangement() (actualiserSelectsCases
  // → actualiserVerrouLegion → reinitialiserSelectionParDefaut, plus
  // haut) — donc AVANT que ce code n'atteigne la ligne orgaPret = true
  // ci-dessous si elle restait après cet appel. `hooks` est déjà
  // renseigné à ce moment-là (première ligne de Organigramme.
  // initialiser()), donc aucun appel prématuré à hooks.* ne peut se
  // produire. Sans ce réordonnancement, uniteAccessible() retombait sur
  // la Faction par défaut ("legio-astartes") pendant cet appel-là, et la
  // sélection par défaut du sélecteur « Unité à ajouter » se figeait sur
  // Praetor au lieu de Chevalier Acastus Astérius/Titan Warlord après un
  // rafraîchissement de page ayant restauré une autre Faction.
  orgaPret = true;
  Organigramme.initialiser({
    getArmee: () => armee,
    trouverUnite,
    coutInstance,
    retirerInstance,
    // Résout le Trait de Faction Mechanicum effectif d'une instance
    // (fixe ou choisi) : consommé par caseAccepte/traitFactionMechanicum
    // RequisPour (js/organigramme.js) pour imposer l'uniformité au sein
    // d'un Détachement Auxiliaire/d'Apex, voir CLAUDE.md.
    traitFactionMechanicumDe,
    // Même mécanique que traitFactionMechanicumDe, pour le Trait de
    // Faction [Skitarii] (Conclaves Skitarii) — uniformité exigée dans
    // TOUT Détachement, voir traitFactionSkitariiRequisPour/caseAccepte
    // (js/organigramme.js) et CLAUDE.md.
    traitFactionSkitariiDe,
    surChangement: actualiserSelectsCases,
  });
  actualiserTotal();
}

// main.js, unites-data.js, organigramme-data.js et organigramme.js
// sont chargés avant (defer) : le DOM est prêt.
initialiser();
