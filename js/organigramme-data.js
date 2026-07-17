/* ============================================================
   organigramme-data.js — Données de la Sélection d'Armée
   Auteur : Jean · Créé : 2026-07-17
   Rôle   : encode l'Organigramme de Force de Croisade du Livre de
   Règles « l'Âge des Ténèbres » (p. 282-285) et les Détachements
   Auxiliaires propres aux Legiones Astartes (livre d'armée).
   Aucune logique : les données sont consommées par
   js/organigramme.js (page unites.html).
   Dépend : aucun. Doit être chargé avant js/organigramme.js.
   Transcription manuelle : en cas de doute, c'est toujours le
   livre qui fait référence.
   ============================================================

   MODÈLE DE DONNÉES (pour les étudiants) :

   Un Rôle Tactique = clé de ROLES_TACTIQUES. La clé reprend
   exactement la `categorie` de js/unites-data.js (c'est elle qui
   fait le lien unité ↔ case) ; `livre` donne le nom officiel du
   Livre de Règles (p. 285) et `texte` sa description (info-bulle).

   Un type de détachement = {
     id        : identifiant unique,
     nom       : nom affiché,
     famille   : "principal" | "additionnel" | "auxiliaire" | "apex",
     texte     : description (info-bulle),
     max       : nombre maximal par armée (absent = illimité),
     cases     : [{ role, principale }, ...] — l'organigramme du
                 détachement, dans l'ordre du livre. `principale:
                 true` = Case Principale (symbole étoilé, p. 283),
     restrictions : { role: [ids d'unités autorisées] } — certains
                 détachements auxiliaires n'acceptent que des
                 unités précises dans certaines cases,
     deblocage : condition d'accès PARTICULIÈRE (en plus du crédit
                 Auxiliaire/Apex standard) :
                 { caseRole, uniteIds, allegeance? } = une unité
                 listée doit occuper une case de ce rôle,
     pointsMin : limite de points minimale de la partie (Seigneur
                 de Guerre : 3000 pts, p. 283),
     indisponible : si présent, le détachement est proposé mais
                 grisé, avec ce message d'explication (choix
                 assumé : les données du site ne couvrent que les
                 Legiones Astartes).
   }
   ============================================================ */

/* ----------------------------------------------------------
   RÔLES TACTIQUES (Livre de Règles p. 285)
   Clé = categorie de unites-data.js ; abrev = badge affiché dans
   l'organigramme (les icônes du livre sont la propriété de Games
   Workshop : on utilise des badges textuels équivalents).
   ---------------------------------------------------------- */
const ROLES_TACTIQUES = {
  "Seigneur de Guerre": {
    livre: "Seigneur de Guerre",
    abrev: "SG",
    texte:
      "Les 18 Primarques et une poignée de puissants guerriers. Aucune armée ne peut dépenser plus de 25 % de sa Limite de Points pour les Rôles Tactiques Seigneur de Guerre et Seigneur des Batailles (quota combiné).",
  },
  "Quartier Général": {
    livre: "Quartier Général",
    abrev: "QG",
    texte: "Les officiers les plus haut gradés d'une armée.",
  },
  "État-major": {
    livre: "État-major",
    abrev: "ÉM",
    texte: "Les officiers de ligne de l'armée.",
  },
  Suites: {
    livre: "Suite",
    abrev: "SU",
    texte: "Les guerriers chargés de protéger les officiers de l'armée.",
  },
  Elite: {
    livre: "Élite",
    abrev: "ÉL",
    texte: "Les plus redoutables guerriers d'une armée.",
  },
  "Engins de Guerre": {
    livre: "Engin de Guerre",
    abrev: "EG",
    texte:
      "Les Dreadnoughts des Legiones Astartes et autres machines de guerre similaires.",
  },
  Troupes: {
    livre: "Troupes",
    abrev: "TR",
    texte:
      "Les troupes de ligne qui tiennent le terrain et permettent aux généraux de vaincre.",
  },
  Appui: {
    livre: "Appui",
    abrev: "AP",
    texte:
      "Des troupes d'appui qui aident les autres guerriers à mener à bien leur mission.",
  },
  "Seigneurs des Batailles": {
    livre: "Seigneur des Batailles",
    abrev: "SB",
    texte:
      "Les unités les plus imposantes et puissantes d'une armée. Même quota combiné de 25 % que le Seigneur de Guerre.",
  },
  Transports: {
    livre: "Transport",
    abrev: "T",
    texte: "Les unités chargées de convoyer les troupes vulnérables.",
  },
  "Assaut Lourd": {
    livre: "Assaut Lourd",
    abrev: "AL",
    texte:
      "Des unités d'assaut lourdes chargées de briser les lignes ennemies.",
  },
  "Transports Lourds": {
    livre: "Transport Lourd",
    abrev: "TL",
    texte: "Les transports les plus lourds et les mieux protégés d'une armée.",
  },
  Blindés: {
    livre: "Blindés",
    abrev: "BL",
    texte:
      "Des véhicules blindés équipés des armes les plus puissantes que l'on puisse déployer sur le terrain.",
  },
  Reco: {
    livre: "Reco.",
    abrev: "RC",
    texte:
      "Des soldats et cavaliers légers chargés de harceler, poursuivre et pister l'ennemi.",
  },
  "Attaque Rapide": {
    livre: "Attaque Rapide",
    abrev: "AR",
    texte:
      "Des unités rapides capables de frapper l'ennemi et de se replier à grande vitesse.",
  },
};

/* Petit raccourci d'écriture des cases : c("Troupes", true) =
   Case Principale de Troupes. */
function _caseOrga(role, principale = false) {
  return { role, principale };
}

/* ----------------------------------------------------------
   TYPES DE DÉTACHEMENTS
   Organigramme de Force de Croisade (p. 284) + Détachements
   Auxiliaires des Legiones Astartes (livre d'armée).
   ---------------------------------------------------------- */
const TYPES_DETACHEMENTS = [
  /* ---------- Détachement Principal (p. 282) ----------
     Obligatoire et unique : 1 QG, 3 État-major, 4 Troupes,
     4 Transports. Une seule Case d'État-major et une seule Case de
     Troupes sont des Cases Principales (symbole étoilé sur
     l'organigramme p. 282) ; la Case de Quartier Général n'en est
     jamais une. */
  {
    id: "principal",
    nom: "Détachement Principal de Croisade",
    famille: "principal",
    max: 1,
    texte:
      "Obligatoire et unique. Chaque Case de Quartier Général remplie débloque 1 Détachement Auxiliaire OU d'Apex ; chaque Case d'État-major remplie débloque 1 Détachement Auxiliaire.",
    cases: [
      _caseOrga("Quartier Général"),
      _caseOrga("État-major", true),
      _caseOrga("État-major"),
      _caseOrga("État-major"),
      _caseOrga("Troupes", true),
      _caseOrga("Troupes"),
      _caseOrga("Troupes"),
      _caseOrga("Troupes"),
      _caseOrga("Transports"),
      _caseOrga("Transports"),
      _caseOrga("Transports"),
      _caseOrga("Transports"),
    ],
  },

  /* ---------- Détachements Additionnels (p. 283-284) ---------- */
  {
    id: "seigneur-guerre",
    nom: "Détachement de Seigneur de Guerre",
    famille: "additionnel",
    max: 1,
    pointsMin: 3000, // p. 283 : sélectionnable uniquement à 3000 pts et +
    texte:
      "Un seul par armée, même Faction que le Détachement Principal, uniquement si la Limite de Points est d'au moins 3000 pts. Doit inclure au moins 1 figurine de Type Parangon. Quota combiné Seigneur de Guerre + Seigneur des Batailles : 25 % de la Limite de Points.",
    cases: [
      _caseOrga("Seigneur de Guerre", true),
      _caseOrga("Suites"),
      _caseOrga("Transports Lourds"),
    ],
  },
  {
    id: "seigneur-batailles",
    nom: "Détachement de Seigneur des Batailles",
    famille: "additionnel",
    max: 1, // p. 283 : « un seul détachement de Seigneur des Batailles »
    texte:
      "Un seul par armée, de n'importe quelle Faction. Le coût total des unités de Rôle Seigneur de Guerre + Seigneur des Batailles ne doit pas dépasser 25 % de la Limite de Points (quota combiné, arrondi à l'entier supérieur).",
    cases: [
      _caseOrga("Seigneurs des Batailles"),
      _caseOrga("Seigneurs des Batailles"),
    ],
  },
  {
    id: "allie",
    nom: "Détachement Allié",
    famille: "additionnel",
    texte:
      "Nombre libre, mais toutes les unités alliées doivent être d'une Faction différente de celle du Détachement Principal, et leur coût total ne peut pas dépasser 50 % de la Limite de Points (arrondi supérieur). Chaque Case d'État-major alliée remplie débloque 1 Détachement Auxiliaire.",
    cases: [
      _caseOrga("Quartier Général", true),
      _caseOrga("État-major", true),
      _caseOrga("Troupes"),
      _caseOrga("Troupes"),
      _caseOrga("Troupes"),
      _caseOrga("Troupes"),
    ],
    // Choix assumé (réponse de Jean) : les fiches du site ne couvrent
    // que les Legiones Astartes → aucune Faction différente possible.
    indisponible:
      "Les fiches du site ne couvrent que les Legiones Astartes : aucune unité d'une Faction différente n'est disponible pour un Détachement Allié.",
  },

  /* ---------- Détachements Auxiliaires standard (p. 284) ---------- */
  {
    id: "poing-blinde",
    nom: "Poing Blindé",
    famille: "auxiliaire",
    texte:
      "Une colonne de Transports et de Transports Lourds pour motoriser l'armée.",
    cases: [
      _caseOrga("Transports"),
      _caseOrga("Transports"),
      _caseOrga("Transports"),
      _caseOrga("Transports"),
      _caseOrga("Transports Lourds"),
      _caseOrga("Transports Lourds"),
      _caseOrga("Transports Lourds"),
      _caseOrga("Transports Lourds"),
    ],
  },
  {
    id: "appui-tactique",
    nom: "Appui Tactique",
    famille: "auxiliaire",
    texte:
      "Des Troupes et des unités d'Appui supplémentaires pour tenir le terrain.",
    cases: [
      _caseOrga("Troupes"),
      _caseOrga("Troupes"),
      _caseOrga("Appui"),
      _caseOrga("Appui"),
    ],
  },
  {
    id: "appui-blinde",
    nom: "Appui Blindé",
    famille: "auxiliaire",
    texte: "Des véhicules Blindés lourdement armés pour l'appui-feu.",
    cases: [
      _caseOrga("Blindés"),
      _caseOrga("Blindés"),
      _caseOrga("Blindés"),
      _caseOrga("Blindés"),
    ],
  },
  {
    id: "appui-lourd",
    nom: "Appui Lourd",
    famille: "auxiliaire",
    texte: "Un Engin de Guerre (Dreadnought ou machine similaire).",
    cases: [_caseOrga("Engins de Guerre")],
  },
  {
    id: "pionniers-combat",
    nom: "Pionniers de Combat",
    famille: "auxiliaire",
    texte: "Des unités de Reconnaissance pour harceler et pister l'ennemi.",
    cases: [_caseOrga("Reco"), _caseOrga("Reco")],
  },
  {
    id: "assaut-de-choc",
    nom: "Assaut de Choc",
    famille: "auxiliaire",
    texte: "Des unités d'Assaut Lourd chargées de briser les lignes ennemies.",
    cases: [_caseOrga("Assaut Lourd"), _caseOrga("Assaut Lourd")],
  },
  {
    id: "premiere-frappe",
    nom: "Première Frappe",
    famille: "auxiliaire",
    texte:
      "Des unités d'Attaque Rapide qui frappent vite et se replient aussitôt.",
    cases: [_caseOrga("Attaque Rapide"), _caseOrga("Attaque Rapide")],
  },

  /* ---------- Détachements d'Apex (p. 284) ----------
     1 par Case de Quartier Général remplie (à la place d'un
     Détachement Auxiliaire, jamais les deux — p. 283). */
  {
    id: "escorte-combat",
    nom: "Escorte de Combat",
    famille: "apex",
    texte:
      "Des unités de Suite : les gardes du corps des officiers de l'armée.",
    cases: [
      _caseOrga("Suites", true),
      _caseOrga("Suites"),
      _caseOrga("Suites"),
    ],
  },
  {
    id: "cadre-officiers",
    nom: "Cadre d'Officiers",
    famille: "apex",
    texte:
      "Des officiers supplémentaires (Quartier Général). Chaque Case de Quartier Général remplie dans ce détachement débloque à son tour 1 Détachement Auxiliaire ou d'Apex.",
    cases: [_caseOrga("Quartier Général", true), _caseOrga("Quartier Général")],
  },
  {
    id: "avant-garde",
    nom: "Avant-garde d'Armée",
    famille: "apex",
    texte: "Des unités d'Élite, les guerriers les plus redoutables de l'armée.",
    cases: [_caseOrga("Elite", true), _caseOrga("Elite"), _caseOrga("Elite")],
  },

  /* ---------- Détachements Auxiliaires des Legiones Astartes
     (livre d'armée) : débloqués par une unité PRÉCISE occupant une
     case donnée, « à la place des options disponibles dans
     l'Organigramme de Force de Croisade ». ---------- */
  {
    id: "cadre-veterans",
    nom: "Cadre de Vétérans",
    famille: "auxiliaire",
    texte:
      "Débloqué quand un Champion de Légion occupe une Case d'État-major (à la place d'un Détachement Auxiliaire standard).",
    deblocage: { caseRole: "État-major", uniteIds: ["champion"] },
    cases: [_caseOrga("Suites"), _caseOrga("Elite"), _caseOrga("Transports")],
  },
  {
    id: "demi-compagnie-reco",
    nom: "Demi-compagnie Reco",
    famille: "auxiliaire",
    texte:
      "Débloqué quand un Vigilator occupe une Case d'État-major. Les Cases de Reco ne peuvent accueillir que des Escouades de Reconnaissance.",
    deblocage: { caseRole: "État-major", uniteIds: ["vigilator"] },
    restrictions: { Reco: ["escouade-reconnaissance"] },
    cases: [
      _caseOrga("Reco", true),
      _caseOrga("Reco", true),
      _caseOrga("Reco", true),
      _caseOrga("Attaque Rapide"),
    ],
  },
  {
    id: "batterie-orage",
    nom: "Batterie Orage",
    famille: "auxiliaire",
    texte:
      "Débloqué quand un Briseur de Siège occupe une Case d'État-major. Cases d'Appui : Batteries de Rapier uniquement ; Cases de Blindés : Bombardes Arquitor ou Chars de Siège Vindicator uniquement.",
    deblocage: { caseRole: "État-major", uniteIds: ["briseur-siege"] },
    restrictions: {
      Appui: ["batterie-rapier"],
      Blindés: ["arquitor", "vindicator"],
    },
    cases: [
      _caseOrga("Appui"),
      _caseOrga("Appui"),
      _caseOrga("Blindés"),
      _caseOrga("Blindés"),
    ],
  },
  {
    id: "manifestation-demoniaque",
    nom: "Manifestation Démoniaque",
    famille: "auxiliaire",
    texte:
      "Débloqué quand un Ésotériste d'Allégeance Renégate occupe une Case d'État-major. Les Cases d'Assaut Lourd n'acceptent que des Brutes Démoniaques de la Tempête de la Ruine.",
    deblocage: {
      caseRole: "État-major",
      uniteIds: ["esoteriste"],
      allegeance: "renegat",
    },
    restrictions: { "Assaut Lourd": [] }, // aucune unité Démon transcrite
    cases: [
      _caseOrga("Assaut Lourd"),
      _caseOrga("Assaut Lourd"),
      _caseOrga("Assaut Lourd"),
    ],
    indisponible:
      "Les Brutes Démoniaques (Liste d'Armée des Démons de la Tempête de la Ruine) ne sont pas encore transcrites dans les fiches du site.",
  },
  /* NOTE (hypothèse de transcription) : sur les photos du livre, le
     texte de déblocage du Cénacle et de la Délégation est hors
     cadrage ; seules leurs restrictions sont lisibles. Comme le
     Techmarine et l'Apothicaire sont des unités d'APPUI dans le
     livre d'armée, on les débloque ici par une unité occupant une
     Case d'Appui (même mécanique « à la place des options »). À
     corriger si le livre dit autre chose. */
  {
    id: "cenacle-techmarines",
    nom: "Cénacle de Techmarines",
    famille: "auxiliaire",
    texte:
      "Débloqué quand un Techmarine occupe une Case d'Appui. Les Cases d'Appui de ce détachement ne peuvent accueillir que des Techmarines.",
    deblocage: { caseRole: "Appui", uniteIds: ["techmarine"] },
    restrictions: { Appui: ["techmarine"] },
    cases: [
      _caseOrga("Appui", true),
      _caseOrga("Appui", true),
      _caseOrga("Appui", true),
      _caseOrga("Appui"),
      _caseOrga("Appui"),
      _caseOrga("Appui"),
    ],
  },
  {
    id: "delegation-apothecarion",
    nom: "Délégation de l'Apothecarion",
    famille: "auxiliaire",
    texte:
      "Débloqué quand un Apothicaire occupe une Case d'Appui. Les Cases d'Appui de ce détachement ne peuvent accueillir que des Apothicaires.",
    deblocage: { caseRole: "Appui", uniteIds: ["apothicaire"] },
    restrictions: { Appui: ["apothicaire"] },
    cases: [
      _caseOrga("Appui", true),
      _caseOrga("Appui", true),
      _caseOrga("Appui", true),
      _caseOrga("Appui"),
      _caseOrga("Appui"),
      _caseOrga("Appui"),
    ],
  },
];

/* ----------------------------------------------------------
   AVANTAGES PRINCIPAUX (p. 283 + Légions Corrompues)
   Un Avantage est choisi pour chaque Case Principale OCCUPÉE.
   `condition` est vérifiée par js/organigramme.js :
   - sergent      : l'unité doit inclure le Sous-type Sergent,
   - etatMajor    : l'unité doit inclure le Sous-type État-major,
   - caseEM       : réservé aux Cases d'État-major,
   - unParDetachement : sélectionnable une seule fois par détachement,
   - renegat      : Allégeance Renégate uniquement (Vrais Croyants).
   Rappel du livre : si l'unité inclut une figurine de Sous-type
   Unique, seul « Bénéfice Logistique » reste disponible.
   ---------------------------------------------------------- */
const AVANTAGES_PRINCIPAUX = [
  {
    id: "aucun",
    nom: "— Aucun avantage choisi —",
    texte:
      "Occuper une Case Principale sans en prendre le bénéfice reste permis.",
  },
  {
    id: "maitre-sergent",
    nom: "Maître-sergent",
    sergent: true,
    unParDetachement: true,
    texte:
      "Une figurine de Sous-type Sergent gagne +1 en Attaques, Capacité de Combat et Commandement, ainsi que le Sous-type Champion (déjà Champion : +1 Cd à la place). Une seule fois par détachement.",
  },
  {
    id: "veterans-combat",
    nom: "Vétérans de Combat",
    texte:
      "Toutes les figurines de l'unité gagnent +1 en Commandement, Sang-froid, Intelligence et Volonté (maximum 10). Ne concerne pas les figurines qui rejoignent l'unité.",
  },
  {
    id: "parangon-bataille",
    nom: "Parangon de Bataille",
    etatMajor: true,
    texte:
      "Une figurine de Sous-type État-major gagne +1 en Attaques, Capacité de Combat et Capacité de Tir.",
  },
  {
    id: "affectation-speciale",
    nom: "Affectation Spéciale",
    caseEM: true,
    texte:
      "Réservé aux Cases d'État-major : la case peut être occupée par une unité de Quartier Général tout en restant une Case d'État-major. En contrepartie, cette case ne débloque AUCUN détachement supplémentaire.",
  },
  {
    id: "benefice-logistique",
    nom: "Bénéfice Logistique",
    unParDetachement: true,
    texte:
      "Ajoute une case au détachement, de n'importe quel Rôle Tactique sauf Quartier Général, État-major, Seigneur de Guerre et Seigneur des Batailles. Une seule fois par détachement. Seul avantage disponible si l'unité inclut le Sous-type Unique.",
  },
  {
    id: "vrais-croyants",
    nom: "Vrais Croyants (Légions Corrompues)",
    renegat: true,
    texte:
      "Armées d'Allégeance Renégate (liste Legiones Astartes) : toutes les figurines de l'unité gagnent le Sous-type Maléfique — elles ignorent les Statuts Tactiques (remplacés par D3 blessures automatiques PA2/Dégâts 1 sans sauvegarde) et les règles réduisant Cd/Sf/Vo/Int, et ne peuvent pas rejoindre ou être rejointes par des unités non-Maléfiques.",
  },
];

/* Rôles interdits à la case supplémentaire du Bénéfice Logistique
   (p. 283). */
const ROLES_INTERDITS_LOGISTIQUE = [
  "Quartier Général",
  "État-major",
  "Seigneur de Guerre",
  "Seigneurs des Batailles",
];
