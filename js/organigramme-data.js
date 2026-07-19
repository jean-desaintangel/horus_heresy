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
     requiertUniteArmee : [ids d'UNITES] — condition de sélection
                 portant sur l'Armée entière (une unité listée doit
                 être présente n'importe où, indépendamment de la Case
                 qu'elle occupe) : contrairement à `deblocage`
                 ci-dessus, ne consomme aucun crédit et n'est pas liée
                 à une Case précise — juste un prérequis de composition
                 (ex : Avant-garde de Medusa, qui exige un Révérend de
                 Fer ou Ferrus Manus dans l'Armée ; Le Marteau
                 d'Olympia, qui exige un Forgeguerre ou Perturabo).
     indisponible : si présent, le détachement est proposé mais
                 grisé, avec ce message d'explication (choix
                 assumé : les données du site ne couvrent que les
                 Legiones Astartes).
     legion    : id LEGIONS (js/organigramme.js) réservant ce type à
                 une seule Légion (ex : Détachements Auxiliaires de
                 l'Arsenal d'une Légion) — entièrement MASQUÉ (pas
                 seulement grisé) tant que cette Légion n'est pas
                 choisie dans les paramètres de la partie, comme les
                 unités réservées de js/unites-data.js. Absent =
                 disponible pour toutes les Légions.
     requiertAllegeance : "loyaliste" | "renegat" — condition de
                 composition sur l'Armée entière (etat.allegeance,
                 menu Allégeance des paramètres de la partie), grisée
                 tant qu'elle n'est pas remplie et signalée en erreur
                 si elle cesse de l'être après coup (ex : Conclave
                 Exalté des Word Bearers, réservé aux Armées
                 Renégates).
     requiertAvantage : id d'AVANTAGES_PRINCIPAUX qui doit être choisi
                 sur au moins une Case de l'Armée (n'importe quel
                 détachement) — même mécanique que requiertAllegeance
                 ci-dessus (ex : Conclave Exalté, qui exige Vrais
                 Croyants).
     avantagesAutorises : [ids d'AVANTAGES_PRINCIPAUX] — restreint
                 l'Avantage Principal sélectionnable sur TOUTES les
                 Cases Principales de ce Détachement à cette liste
                 (« Aucun avantage choisi » reste toujours permis) ;
                 vérifié par avantagesPossibles() dans
                 js/organigramme.js, qui grise les autres options du
                 menu déroulant de la Case (ex : Chasse Atramentar des
                 Night Lords, qui n'autorise que l'Avantage Atramentar).
     requiertRiteDeGuerre : id d'un Rite de Guerre de RITES_DE_GUERRE
                 (ci-dessous) qui doit être choisi dans les paramètres
                 de la partie (menu « Rite de Guerre », affiché
                 uniquement pour une Légion qui figure dans
                 RITES_DE_GUERRE) — même mécanique de déblocage/
                 grisage que `requiertAllegeance`.
     excluAvec : [ids de TYPES_DETACHEMENTS] — indisponible tant qu'un
                 Détachement de l'un de ces types est déjà présent
                 dans l'Armée (même mécanique que le champ `excluAvec`
                 des unités, js/unites-data.js/js/unites.js). À
                 déclarer sur LES DEUX types pour une exclusion
                 symétrique (ex : Confrérie du Phénix et Détachement de
                 Seigneur de Guerre, mutuellement exclusifs).
     pasDeCredit : si true, les Cases de Quartier Général et
                 d'État-major de ce Détachement ne débloquent AUCUN
                 Détachement Auxiliaire ou d'Apex supplémentaire
                 (vérifié par calculerCredits() dans
                 js/organigramme.js, qui ignore alors entièrement ce
                 Détachement dans le calcul des crédits — ex :
                 Confrérie du Phénix, dont les Cases QG/État-major ne
                 doivent débloquer aucun Auxiliaire/Apex).
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
    // Confrérie du Phénix (Emperor's Children, Rite de Guerre Legio
    // Hereticus) se sélectionne À LA PLACE de ce Détachement.
    excluAvec: ["confrerie-du-phenix"],
    texte:
      "Un seul par armée, même Faction que le Détachement Principal, uniquement si la Limite de Points est d'au moins 3000 pts. Doit inclure au moins 1 figurine de Type Parangon. Quota combiné Seigneur de Guerre + Seigneur des Batailles : 25 % de la Limite de Points.",
    cases: [
      _caseOrga("Seigneur de Guerre"),
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
      "Nombre libre. Chaque Légion Astartes compte comme une Faction distincte : ce Détachement doit donc porter une Légion différente de celle du Détachement Principal (menu « Légion Alliée » sur sa carte). Il partage forcément la même Allégeance que le reste de l'Armée (un seul réglage Allégeance par partie). Le coût total des unités alliées ne peut pas dépasser 50 % de la Limite de Points (arrondi supérieur). Chaque Case d'État-major alliée remplie débloque 1 Détachement Auxiliaire, comme une Case d'État-major du Détachement Principal.",
    cases: [
      _caseOrga("État-major", true),
      _caseOrga("État-major"),
      _caseOrga("Troupes"),
      _caseOrga("Troupes"),
      _caseOrga("Troupes"),
      _caseOrga("Troupes"),
    ],
    // Faction = Légion (choix de Jean) : chaque Détachement Allié porte
    // sa propre Légion (`legionAlliee` sur l'instance, choisie sur sa
    // carte — voir js/organigramme.js), qui doit différer de la Légion
    // de l'Armée (etat.legion). Les unités réservées à une Légion
    // (champ `legion`, js/unites-data.js) sont filtrées en conséquence
    // par caseAccepte() : Légion de l'Armée pour tout détachement non
    // Allié, Légion propre à chaque Détachement Allié pour les siennes.
    // L'Allégeance (Loyaliste/Renégat), elle, reste un réglage UNIQUE
    // pour toute l'Armée (menu « Allégeance » des paramètres de la
    // partie) : Principal et Alliés la partagent donc automatiquement,
    // ce qui satisfait la règle « même Allégeance » sans champ dédié.
    // Simplification assumée : les Détachements Auxiliaires débloqués
    // par une Case d'État-major alliée piochent dans le même crédit
    // partagé que ceux du Détachement Principal (voir calculerCredits())
    // sans être eux-mêmes rattachés à la Légion de cet Allié.
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
  /* Premier Détachement d'Apex réservé à une Légion sur le site.
     Composition confirmée par Jean : 4 Cases (Troupes principale ×2,
     Elite ×2), sans restriction d'unité. Condition de sélection du
     livre : Allégeance Renégate (« Traitre » dans le menu Allégeance
     des paramètres de la partie, voir etat.allegeance) ET au moins 1
     Avantage Principal Vrais Croyants choisi sur une Case de l'Armée
     — vérifiée par `requiertAllegeance`/`requiertAvantage`
     (disponibilite()/validerArmee(), js/organigramme.js). */
  {
    id: "conclave-exalte",
    nom: "Conclave Exalté",
    famille: "apex",
    texte:
      "Des Troupes et des unités d'Élite corrompues par le Warp. Réservé aux Armées d'Allégeance Renégate (Traitre) ayant choisi l'Avantage Principal Vrais Croyants sur au moins une Case.",
    requiertAllegeance: "renegat",
    requiertAvantage: "vrais-croyants",
    cases: [
      _caseOrga("Troupes", true),
      _caseOrga("Troupes", true),
      _caseOrga("Elite"),
      _caseOrga("Elite"),
    ],
    legion: "XVII",
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
      "Débloqué quand un Champion de Légion — à pied ou Monté (Motard / Motojet Scimitar) — occupe une Case d'État-major (à la place d'un Détachement Auxiliaire standard).",
    // « Champion sur Scimitar » (js/unites-data.js) compte comme une
    // Unité de Champion de Légion pour ce déblocage (voir sa note).
    deblocage: { caseRole: "État-major", uniteIds: ["champion", "champion-monte"] },
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
      _caseOrga("Reco"),
      _caseOrga("Reco"),
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
      _caseOrga("Appui"),
      _caseOrga("Appui"),
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
      _caseOrga("Appui"),
      _caseOrga("Appui"),
      _caseOrga("Appui"),
      _caseOrga("Appui"),
      _caseOrga("Appui"),
    ],
  },

  /* ---------- Détachements Auxiliaires réservés à une Légion
     (Arsenal de chaque Légion, voir js/unites-data.js) : masqués tant
     que la Légion correspondante n'est pas choisie (champ `legion`,
     voir la note du modèle de données plus haut). ---------- */
  {
    id: "ost-revelation",
    nom: "Ost de la Révélation",
    famille: "auxiliaire",
    texte:
      "Les Cases de Troupes de ce Détachement ne peuvent accueillir que des Escouades d'Assaut. Les Cases d'Élite ne peuvent accueillir que des Cohortes Éoclastes ou des Escouades de Vétérans d'Assaut.",
    // « Cohorte Éoclaste » n'est pas encore transcrite sur le site :
    // seule l'Escouade de Vétérans d'Assaut peut occuper les Cases
    // d'Élite pour l'instant.
    restrictions: {
      Troupes: ["escouade-assaut"],
      Elite: ["cohorte-eoclaste", "escouade-veterans-assaut"],
    },
    cases: [
      _caseOrga("Troupes", true),
      _caseOrga("Troupes"),
      _caseOrga("Elite"),
      _caseOrga("Elite"),
    ],
    legion: "IX",
  },
  {
    id: "cadre-decapitation",
    nom: "Cadre de Décapitation",
    famille: "auxiliaire",
    texte:
      "Les Cases de Reco de ce Détachement ne peuvent accueillir que des Escouades de Reconnaissance. Les Cases d'Élite ne peuvent accueillir que des Escouades de Vétérans d'Assaut ou de Furies Noires.",
    restrictions: {
      Reco: ["escouade-reconnaissance"],
      Elite: ["escouade-veterans-assaut", "escouade-furies-noires"],
    },
    cases: [
      _caseOrga("Reco"),
      _caseOrga("Reco"),
      _caseOrga("Elite"),
      _caseOrga("Elite"),
    ],
    legion: "XIX",
  },
  {
    // NOTE (hypothèse de transcription) : le livre ne restreint
    // explicitement que les 2 Cases de Blindé (Predator/Vindicator).
    // Les 2 Cases de Troupes, sans restriction indiquée sur la photo,
    // sont une supposition raisonnable à partir des icônes — à
    // corriger si le livre dit autre chose.
    id: "cenacle-immolation",
    nom: "Cénacle de l'Immolation",
    famille: "auxiliaire",
    texte:
      "Les Cases de Blindé de ce Détachement ne peuvent accueillir que des Predator ou des Vindicator.",
    restrictions: { Blindés: ["predator", "vindicator"] },
    cases: [
      _caseOrga("Appui", true),
      _caseOrga("Appui"),
      _caseOrga("Blindés"),
      _caseOrga("Blindés"),
    ],
    legion: "XVIII",
  },
  {
    id: "bande-guerriere-chogorienne",
    nom: "Bande Guerrière Chogorienne",
    famille: "auxiliaire",
    texte:
      "Les Cases d'Attaque Rapide de ce Détachement ne peuvent accueillir que des Escadrons de Motojets Scimitar. Les Cases de Reco ne peuvent accueillir que des Escadrons de Motards.",
    restrictions: {
      "Attaque Rapide": ["escadron-scimitar"],
      Reco: ["escadron-motards"],
    },
    cases: [
      _caseOrga("Attaque Rapide", true),
      _caseOrga("Attaque Rapide"),
      _caseOrga("Reco"),
      _caseOrga("Reco"),
    ],
    legion: "V",
  },
  {
    id: "cadre-berserkers",
    nom: "Cadre de Berserkers",
    famille: "auxiliaire",
    texte:
      "Réservé au Rite de Guerre Legio Astartes World Eaters. Les Cases d'Assaut Lourd de ce Détachement ne peuvent accueillir que des Escouades Saccageuses.",
    requiertRiteDeGuerre: "legio-astartes-world-eaters",
    restrictions: { "Assaut Lourd": ["escouade-saccageuse"] },
    cases: [
      _caseOrga("Troupes", true),
      _caseOrga("Assaut Lourd"),
      _caseOrga("Assaut Lourd"),
      _caseOrga("Elite"),
    ],
    legion: "XII",
  },
  {
    // Même mécanique que Délégation de l'Apothecarion (icônes
    // Techmarine + Apothicaire pour le déblocage), en version
    // World Eaters ; ses propres Cases d'Appui restent réservées aux
    // Apothicaires.
    id: "fils-de-bodt",
    nom: "Fils de Bodt",
    famille: "auxiliaire",
    texte:
      "Réservé au Rite de Guerre Legio Hereticus World Eaters. Débloqué quand un Techmarine ou un Apothicaire occupe une Case d'Appui. Les Cases d'Appui de ce détachement ne peuvent accueillir que des Apothicaires.",
    requiertRiteDeGuerre: "legio-hereticus-world-eaters",
    deblocage: { caseRole: "Appui", uniteIds: ["techmarine", "apothicaire"] },
    restrictions: { Appui: ["apothicaire"] },
    cases: [
      _caseOrga("Appui", true),
      _caseOrga("Appui", true),
      _caseOrga("Troupes"),
      _caseOrga("Troupes"),
      _caseOrga("Troupes"),
    ],
    legion: "XII",
  },
  /* NOTE (hypothèse de transcription) : sur la photo du livre, seule
     la restriction de Troupes (Escouade Brécheuse) est du texte lisible ;
     les 4 icônes de rôle ont été identifiées par comparaison avec la
     légende des Rôles Tactiques (p. 285) — 2 Troupes (icône simple,
     répétée) + 2 Assaut Lourd (icône à l'armure plus large). Aucune
     condition de déblocage particulière (confirmé par Jean : « même
     règle que pour les détachements auxiliaires classiques »), donc
     pas de champ `deblocage`, comme Cadre de Berserkers ou Cénacle de
     l'Immolation. À corriger si le livre dit autre chose. */
  {
    id: "gantelet-de-siege",
    nom: "Gantelet de Siège",
    famille: "auxiliaire",
    texte:
      "Les Cases de Troupes de ce Détachement ne peuvent servir qu'à sélectionner des Unités d'Escouade Brécheuse.",
    restrictions: { Troupes: ["escouade-brecheuse"] },
    cases: [
      _caseOrga("Troupes", true),
      _caseOrga("Troupes"),
      _caseOrga("Assaut Lourd"),
      _caseOrga("Assaut Lourd"),
    ],
    legion: "VII",
  },
  /* Icônes identifiées par comparaison avec la légende des Rôles
     Tactiques (p. 285) : char (Blindés), transport (Transport Lourd),
     figurine simple (Troupes) — confirmé par le texte (« détachements
     de chars et troupes mécanisées en transports lourds »). */
  {
    id: "phalange-fer-de-lance",
    nom: "Phalange Fer de Lance",
    famille: "auxiliaire",
    texte:
      "Les Iron Hands étaient des parangons du combat de blindés, mêlant détachements de chars et troupes mécanisées en transports lourds. Les Cases de Transport Lourd de ce Détachement ne peuvent servir qu'à sélectionner des Unités de Porteur Land Raider ou de Spartan.",
    restrictions: { "Transports Lourds": ["porteur-land-raider", "spartan"] },
    cases: [
      _caseOrga("Transports Lourds"),
      _caseOrga("Blindés"),
      _caseOrga("Assaut Lourd"),
    ],
    legion: "X",
  },
  /* Icônes identifiées par comparaison avec la légende des Rôles
     Tactiques (p. 285) : État-major, Elite (×2), Appui, Engin de
     Guerre — confirmé par le texte (« phalanges d'implacables
     Terminators [Elite] accompagnés de Dreadnoughts [Engin de Guerre]
     et appuyés par des guerriers augmentés cybernétiquement
     [Appui] »). La Case d'État-major est réservée à une Unité de
     Praevius (voir js/unites-data.js, unité réservée à l'Iron Hands).
     `requiertUniteArmee` : condition de sélection portant sur l'Armée
     entière (unité présente n'importe où, indépendamment de la Case
     qu'elle occupe), vérifiée par disponibilite()/validerArmee() dans
     js/organigramme.js — contrairement à `deblocage`, qui ne compte
     que les occupants d'une Case précise et consomme un crédit. */
  {
    id: "avant-garde-medusa",
    nom: "Avant-garde de Medusa",
    famille: "apex",
    texte:
      "Les assauts des Iron Hands étaient typiquement menés par des phalanges d'implacables Terminators accompagnés de Dreadnoughts et appuyés par des guerriers augmentés cybernétiquement. La Case d'État-major de ce Détachement ne peut servir qu'à sélectionner une Unité de Praevius. Sélectionnable uniquement si l'Armée comprend aussi une Unité de Révérend de Fer ou de Ferrus Manus.",
    restrictions: { "État-major": ["praevius"] },
    requiertUniteArmee: ["reverend-de-fer", "ferrus-manus"],
    cases: [
      _caseOrga("État-major", true),
      _caseOrga("Assaut Lourd"),
      _caseOrga("Assaut Lourd"),
      _caseOrga("Appui"),
      _caseOrga("Engins de Guerre"),
    ],
    legion: "X",
  },
  /* Icônes identifiées par comparaison avec la légende des Rôles
     Tactiques (p. 285) : État-major, Troupes (×2), Transport, Attaque
     Rapide — le bullet du livre (« La Case d'État-major ... Optae »)
     confirme la première icône. */
  {
    id: "demi-compagnie-primus",
    nom: "Demi-Compagnie Primus",
    famille: "auxiliaire",
    texte:
      "Les Ultramarines déployaient leurs forces selon diverses formations standardisées. La Case d'État-major de ce Détachement ne peut servir qu'à sélectionner une Unité d'Optae.",
    restrictions: { "État-major": ["optae"] },
    cases: [
      _caseOrga("État-major", true),
      _caseOrga("Troupes"),
      _caseOrga("Troupes"),
      _caseOrga("Transports"),
      _caseOrga("Attaque Rapide"),
    ],
    legion: "XIII",
  },
  /* Icônes identifiées par comparaison avec la légende des Rôles
     Tactiques (p. 285) : 2 Troupes (icône simple, répétée) + 2 Assaut
     Lourd (icône à l'armure plus large) — même ambiguïté visuelle que
     Gantelet de Siège (Imperial Fists), résolue par le bullet du livre
     (« Les Cases de Troupes ... Meute de Tueurs Gris »). */
  {
    id: "griffe-ensanglantee",
    nom: "Griffe Ensanglantée",
    famille: "auxiliaire",
    texte:
      "Les Space Wolves n'ont jamais rechigné face à des assauts frontaux et pourtant sanglants. Les Cases de Troupes de ce Détachement ne peuvent servir qu'à sélectionner des Unités de Meute de Tueurs Gris.",
    restrictions: { Troupes: ["meute-tueurs-gris"] },
    cases: [
      _caseOrga("Troupes", true),
      _caseOrga("Troupes"),
      _caseOrga("Assaut Lourd"),
      _caseOrga("Assaut Lourd"),
    ],
    legion: "VI",
  },
  /* Icônes identifiées par comparaison avec la légende des Rôles
     Tactiques (p. 285) : figurine simple (Troupes, ×2) + transport
     (Transports, ×2). Aucun bullet de restriction visible sous
     l'encadré (contrairement aux autres Détachements Auxiliaires
     Dark Angels ci-dessous) : aucune restriction transcrite. */
  {
    id: "levee-stormwing",
    nom: "Levée de la Stormwing",
    famille: "auxiliaire",
    texte:
      "Les combattants de la Stormwing sont des artistes de la destruction, dont les pinceaux sont les tirs qu'ils déchaînent sur la toile du champ de bataille, et ils forment le cœur de la Légion des Dark Angels. Les Levées de la Stormwing appliquent des tactiques d'infanterie lourde combinant la puissance de chaque guerrier en une marée inexorable.",
    cases: [
      _caseOrga("Troupes", true),
      _caseOrga("Troupes", true),
      _caseOrga("Transports"),
      _caseOrga("Transports"),
    ],
    legion: "I",
  },
  /* Icônes identifiées par comparaison avec la légende des Rôles
     Tactiques (p. 285) : véhicule rapide (Attaque Rapide, ×2) + figurine
     à la lance (Reco, ×2) — confirmé par le bullet (« Escadron de
     Motards », catégorie Reco). */
  {
    id: "lance-ravenwing",
    nom: "Lance de la Ravenwing",
    famille: "auxiliaire",
    texte:
      "« La flèche connaît la voie. » Un dicton lourd de sens pour les maîtres de la Ravenwing, formation connue pour ses étranges credo mais aussi pour ses succès sur le terrain. Les Cases de Reco de ce Détachement ne peuvent servir qu'à sélectionner des Unités d'Escadron de Motards.",
    restrictions: { Reco: ["escadron-motards"] },
    cases: [
      _caseOrga("Attaque Rapide", true),
      _caseOrga("Attaque Rapide"),
      _caseOrga("Reco"),
      _caseOrga("Reco"),
    ],
    legion: "I",
  },
  /* Icônes identifiées par comparaison avec la légende des Rôles
     Tactiques (p. 285) : Suite (icône du sabre vertical, ×1) + Elite
     (figurine à l'arme d'hast, ×2). Aucun bullet de restriction visible
     sous l'encadré : aucune restriction transcrite. */
  {
    id: "conclave-deathwing",
    nom: "Conclave de la Deathwing",
    famille: "auxiliaire",
    texte:
      "Le fardeau du devoir pèse lourdement sur les guerriers de la Deathwing, qui firent autrefois le serment de ne reculer devant aucun obstacle pour accomplir leur mission. Les Conclaves de la Deathwing comptent parmi les divisions les plus puissantes de la Ire Légion.",
    cases: [_caseOrga("Suites", true), _caseOrga("Elite"), _caseOrga("Assaut Lourd")],
    legion: "I",
  },
  /* Icônes identifiées par comparaison avec la légende des Rôles
     Tactiques (p. 285) : Elite (figurine à l'arme d'hast, ×4) —
     confirmé par le bullet (« Escouade Traqueuse », catégorie Elite). */
  {
    id: "echelon-firewing",
    nom: "Échelon de la Firewing",
    famille: "auxiliaire",
    texte:
      "Les Échelons de la Firewing regroupent les meilleurs chasseurs-tueurs de la Légion, aussi mortels que précis. Les Cases d'Élite de ce Détachement ne peuvent servir qu'à sélectionner des Unités d'Escouade Traqueuse.",
    restrictions: { Elite: ["escouade-traqueuse"] },
    cases: [
      _caseOrga("Reco", true),
      _caseOrga("Reco"),
      _caseOrga("Elite"),
      _caseOrga("Elite"),
    ],
    legion: "I",
  },
  /* Icônes identifiées par comparaison avec la légende des Rôles
     Tactiques (p. 285) : char (Blindés, ×4). Aucun bullet de
     restriction visible sous l'encadré : aucune restriction transcrite. */
  {
    id: "gantelet-ironwing",
    nom: "Gantelet de l'Ironwing",
    famille: "auxiliaire",
    texte:
      "L'Ironwing régit les immenses arsenaux des Dark Angels, et donc une force d'engins de guerre qui surpasse celle de toute autre Légion. Les Gantelets de l'Ironwing constituent une force tactiquement flexible de chars et de transports blindés.",
    cases: [
      _caseOrga("Blindés"),
      _caseOrga("Blindés"),
      _caseOrga("Blindés"),
      _caseOrga("Blindés"),
    ],
    legion: "I",
  },
  /* Icônes identifiées par comparaison avec la légende des Rôles
     Tactiques (p. 285) : transport + figurine (Appui, ×3) — confirmé
     par le bullet (« Interemptors de la Dreadwing » ou « Batterie de
     Rapier », toutes deux catégorie Appui). */
  {
    id: "cadre-dreadwing",
    nom: "Cadre de la Dreadwing",
    famille: "auxiliaire",
    texte:
      "Quand le Lion décrète qu'un monde doit périr, il confie le commandement de cette funeste opération aux vétérans de la Dreadwing. Les Cases d'Appui de ce Détachement ne peuvent servir qu'à sélectionner des Unités d'Interemptors de la Dreadwing ou des Unités de Batterie de Rapier.",
    restrictions: { Appui: ["interemptors-dreadwing", "batterie-rapier"] },
    cases: [_caseOrga("Appui", true), _caseOrga("Appui"), _caseOrga("Appui")],
    legion: "I",
  },
  /* Composition confirmée par Jean : 4 Cases (Troupes principale ×2,
     Assaut Lourd, Elite), sans restriction d'unité. */
  {
    id: "cadre-suprematie",
    nom: "Cadre de Suprématie",
    famille: "auxiliaire",
    texte: "Des Troupes, une unité d'Assaut Lourd et une unité d'Élite.",
    cases: [
      _caseOrga("Troupes", true),
      _caseOrga("Troupes", true),
      _caseOrga("Assaut Lourd"),
      _caseOrga("Elite"),
    ],
    legion: "XVI",
  },
  /* --- Arsenal de l'Alpha Legion (XXe Légion) : Léviathan de
     Chasseurs de Têtes (voir js/unites-data.js, id "chasseur-de-
     tetes", unité réservée à cette Légion). --- */
  {
    id: "leviathan-chasseurs-tetes",
    nom: "Léviathan de Chasseurs de Têtes",
    famille: "auxiliaire",
    texte:
      "Les Cases d'Élite de ce Détachement ne peuvent servir qu'à sélectionner des Unités d'Escouade Traqueuse ou de Chasseur de Têtes.",
    restrictions: { Elite: ["escouade-traqueuse", "chasseur-de-tetes"] },
    cases: [
      _caseOrga("Reco", true),
      _caseOrga("Reco", true),
      _caseOrga("Elite"),
      _caseOrga("Elite"),
    ],
    legion: "XX",
  },
  /* --- Arsenal de la Death Guard (XIVe Légion) : Ost Moissonneur. --- */
  {
    id: "ost-moissonneur",
    nom: "Ost Moissonneur",
    famille: "auxiliaire",
    texte:
      "Les Cases de Troupes de ce Détachement ne peuvent servir qu'à sélectionner des Unités d'Escouade d'Assaut.",
    restrictions: { Troupes: ["escouade-assaut"] },
    cases: [
      _caseOrga("Troupes", true),
      _caseOrga("Troupes"),
      _caseOrga("Appui"),
      _caseOrga("Assaut Lourd"),
    ],
    legion: "XIV",
  },
  /* --- Arsenal des Iron Warriors (IVe Légion) : La Cohorte de Feu de
     Fer. --- */
  {
    id: "cohorte-feu-de-fer",
    nom: "La Cohorte de Feu de Fer",
    famille: "auxiliaire",
    texte:
      "Les Cases de Blindés de ce Détachement ne peuvent servir qu'à sélectionner des Unités de Bombarde Arquitor.",
    restrictions: { Blindés: ["arquitor"] },
    cases: [
      _caseOrga("Blindés", true),
      _caseOrga("Blindés"),
      _caseOrga("Appui"),
      _caseOrga("Appui"),
    ],
    legion: "IV",
  },
  /* --- Arsenal des Iron Warriors (IVe Légion) : Le Marteau
     d'Olympia. --- */
  {
    id: "marteau-olympia",
    nom: "Le Marteau d'Olympia",
    famille: "apex",
    texte:
      "Sélectionnable uniquement si l'Armée comprend aussi une Unité de Forgeguerre ou de Perturabo.",
    requiertUniteArmee: ["forgeguerre", "perturabo"],
    cases: [
      _caseOrga("Assaut Lourd", true),
      _caseOrga("Assaut Lourd"),
      _caseOrga("Transports Lourds"),
      _caseOrga("Troupes", true),
      _caseOrga("Troupes"),
    ],
    legion: "IV",
  },
  /* --- Arsenal des Night Lords (VIIIe Légion) : Assaut de Terreur. --- */
  {
    id: "assaut-de-terreur",
    nom: "Assaut de Terreur",
    famille: "auxiliaire",
    texte:
      "Les Cases de Troupes de ce Détachement ne peuvent servir qu'à sélectionner des Unités d'Escouade Terreur.",
    restrictions: { Troupes: ["escouade-terreur"] },
    cases: [
      _caseOrga("Troupes", true),
      _caseOrga("Troupes"),
      _caseOrga("Attaque Rapide"),
      _caseOrga("Attaque Rapide"),
    ],
    legion: "VIII",
  },
  /* --- Arsenal des Night Lords (VIIIe Légion) : Chasse Atramentar.
     Les 2 Cases d'Assaut Lourd sont TOUTES DEUX des Cases Principales
     (confirmé par Jean), contrairement à la plupart des autres
     Détachements à 2 Cases de même Rôle Tactique (une seule
     Principale). `avantagesAutorises` (voir js/organigramme.js,
     avantagesPossibles) restreint l'Avantage Principal sélectionnable
     sur les Cases Principales de ce Détachement au seul Atramentar
     (voir plus haut dans AVANTAGES_PRINCIPAUX) — toute autre valeur
     que « aucun » est grisée dans le menu déroulant de la Case. */
  {
    id: "chasse-atramentar",
    nom: "Chasse Atramentar",
    famille: "apex",
    texte:
      "La Case de Suite de ce Détachement ne peut servir qu'à sélectionner une Unité d'Escouade d'État-major Terminator Cataphractii ou Tartaros. Les Cases d'Assaut Lourd ne peuvent servir qu'à sélectionner des Unités d'Escouade Terminator Cataphractii ou Tartaros. Seul l'Avantage Principal Atramentar peut être choisi sur les Cases Principales de ce Détachement.",
    restrictions: {
      Suites: ["escouade-etat-major-cataphractii", "escouade-etat-major-tartaros"],
      "Assaut Lourd": ["terminators-cataphractii", "terminators-tartaros"],
    },
    avantagesAutorises: ["atramentar"],
    cases: [
      _caseOrga("Suites", true),
      _caseOrga("Assaut Lourd", true),
      _caseOrga("Assaut Lourd", true),
    ],
    legion: "VIII",
  },
  /* --- Arsenal des Thousand Sons (XVe Légion) : Convocation de
     Prospero. --- */
  {
    id: "convocation-de-prospero",
    nom: "Convocation de Prospero",
    famille: "auxiliaire",
    texte: "Des Troupes, une unité d'Attaque Rapide, une unité d'Élite et une unité de Transport Lourd.",
    cases: [
      _caseOrga("Troupes", true),
      _caseOrga("Attaque Rapide"),
      _caseOrga("Elite"),
      _caseOrga("Transports Lourds"),
    ],
    legion: "XV",
  },
  /* --- Arsenal des Emperor's Children (IIIe Légion) : Escadre de
     Primauté, réservée au Rite de Guerre Legio Astartes (voir
     RITES_DE_GUERRE ci-dessous). --- */
  {
    id: "escadre-de-primaute",
    nom: "Escadre de Primauté",
    famille: "auxiliaire",
    texte:
      "Réservé au Rite de Guerre Legio Astartes Emperor's Children. Une Suite, une Élite et deux unités d'Attaque Rapide.",
    requiertRiteDeGuerre: "legio-astartes-emperors-children",
    cases: [
      _caseOrga("Suites"),
      _caseOrga("Elite"),
      _caseOrga("Attaque Rapide"),
      _caseOrga("Attaque Rapide"),
    ],
    legion: "III",
  },
  /* --- Arsenal des Emperor's Children (IIIe Légion) : Confrérie du
     Phénix, réservée au Rite de Guerre Legio Hereticus (voir
     RITES_DE_GUERRE ci-dessous). Se sélectionne À LA PLACE du
     Détachement de Seigneur de Guerre (`excluAvec`, déclaré aussi sur
     ce dernier plus haut) : mêmes contraintes de points (3000 pts
     minimum, `pointsMin`) et de quota Seigneur de Guerre/Seigneur des
     Batailles (25 % combiné, appliqué automatiquement à toute unité
     de Rôle Tactique Seigneur de Guerre logée dans sa Case). Ses
     Cases QG/État-major sont exclues du calcul des crédits
     Auxiliaire/Apex (`pasDeCredit`, voir js/organigramme.js,
     calculerCredits). Fulgrim Transfiguré n'est PAS un prérequis à la
     sélection du Détachement (contrairement à `requiertUniteArmee`,
     qui bloquerait l'ajout tant qu'il n'est pas déjà dans l'Armée) :
     c'est l'inverse, sa Case de Seigneur de Guerre lui est réservée
     (`restrictions`), comme n'importe quelle autre Case restreinte —
     rien n'empêche de créer le Détachement avec cette Case vide. */
  {
    id: "confrerie-du-phenix",
    nom: "Confrérie du Phénix",
    famille: "additionnel",
    max: 1,
    pointsMin: 3000,
    requiertRiteDeGuerre: "legio-hereticus-emperors-children",
    excluAvec: ["seigneur-guerre"],
    pasDeCredit: true,
    restrictions: { "Seigneur de Guerre": ["fulgrim-transfigure"] },
    texte:
      "Réservé au Rite de Guerre Legio Hereticus Emperor's Children. Se sélectionne à la place du Détachement de Seigneur de Guerre (l'Armée ne peut pas inclure les deux). Uniquement si la Limite de Points est d'au moins 3000 pts. Sa Case de Seigneur de Guerre ne peut accueillir qu'une Unité de Fulgrim Transfiguré. Les Cases de Quartier Général et d'État-major de ce Détachement ne débloquent aucun Détachement Auxiliaire ou d'Apex supplémentaire.",
    cases: [
      _caseOrga("Seigneur de Guerre"),
      _caseOrga("Quartier Général", true),
      _caseOrga("Quartier Général"),
      _caseOrga("Quartier Général"),
      _caseOrga("État-major"),
    ],
    legion: "III",
  },
];

/* ----------------------------------------------------------
   RITES DE GUERRE (livre d'armée Legiones Astartes)
   Certaines Légions imposent au joueur un choix de Rite de Guerre
   (menu « Rite de Guerre » des paramètres de la partie,
   js/organigramme.js, affiché uniquement pour une Légion présente
   ici). Ce choix conditionne l'accès à certains Détachements (champ
   `requiertRiteDeGuerre` de TYPES_DETACHEMENTS ci-dessus) et peut
   verrouiller l'Allégeance de l'Armée sur une valeur précise
   (`allegeanceForcee` : le menu Allégeance est alors grisé et forcé
   sur cette valeur — ex : Legio Hereticus, qui impose l'Allégeance
   Renégate). Légion absente d'ici = pas de choix de Rite de Guerre.
   Clé = id LEGIONS (js/organigramme.js).
   ---------------------------------------------------------- */
const RITES_DE_GUERRE = {
  III: [
    {
      id: "legio-astartes-emperors-children",
      nom: "Legio Astartes Emperor's Children",
    },
    {
      id: "legio-hereticus-emperors-children",
      nom: "Legio Hereticus Emperor's Children",
      allegeanceForcee: "renegat",
    },
  ],
  XII: [
    {
      id: "legio-astartes-world-eaters",
      nom: "Legio Astartes World Eaters",
    },
    {
      id: "legio-hereticus-world-eaters",
      nom: "Legio Hereticus World Eaters",
      allegeanceForcee: "renegat",
    },
  ],
};

/* ----------------------------------------------------------
   CONTENU DU RITE DE GUERRE « LEGIO ASTARTES » (livre d'armée
   Legiones Astartes) : Tactica de Légion, Posture et Réaction
   Avancée propres à chaque Légion (texte reproduit du livre,
   indépendant du choix fait dans RITES_DE_GUERRE ci-dessus —
   consommé par la page de garde du PDF/Word, js/unites.js). Les
   phrases de lore (fluff historique sans effet de jeu) sont omises
   pour gagner de la place sur la page de garde ; seul le texte de
   règle est transcrit. Chaque section est une liste de paragraphes ;
   `style: "bold"` marque les intitulés de règle/sous-règle (ex : le
   nom de la Règle Spéciale, de la Posture ou de la Réaction), le
   reste étant le texte mécanique en romain. Clé = id LEGIONS
   (js/organigramme.js) pour le contenu générique d'une Légion, MAIS
   certaines Légions ont un contenu différent selon le Rite de Guerre
   précis choisi (voir RITES_DE_GUERRE ci-dessus) : dans ce cas, la
   clé est l'id du Rite (ex : "legio-hereticus-world-eaters"), qui
   prime sur l'entrée générique de la Légion (voir la recherche dans
   js/unites.js). Légion/Rite absent d'ici = contenu non encore
   transcrit, rien n'est affiché sur la page de garde. */
const RITE_DE_GUERRE_LEGION = {
  I: {
    nomRite: "Legio Astartes Dark Angels",
    sections: [
      {
        titre: "Tactica de Légion",
        paragraphes: [
          {
            texte:
              "Toutes les Figurines qui ont le Trait Dark Angels (hormis les Figurines de Type Véhicule) sont sujettes à la Règle Spéciale suivante :",
          },
          { texte: "Les Anges de la Mort", style: "bold" },
          {
            texte:
              "Les modificateurs négatifs au Commandement, à la Volonté, au Sang-froid et à l'Intelligence sont limités chez les Dark Angels.",
            style: "bold",
          },
          {
            texte:
              "On ne peut jamais réduire à moins de 6 la Caractéristique de Commandement des Figurines ayant cette Règle Spéciale. De plus, la Règle Spéciale Peur (X) ne peut réduire que de 1 au maximum les Caractéristiques de Commandement, de Volonté, de Sang-froid et d'Intelligence de toute Figurine ayant cette Règle Spéciale, quelle que soit la valeur de X.",
          },
        ],
      },
      {
        titre: "Posture",
        paragraphes: [
          {
            texte:
              "Quand il choisit une Posture, le Joueur en Contrôle d'une Figurine qui a le Trait Dark Angels peut choisir Épée de l'Ordre à la place d'une autre accessible à cette Figurine.",
          },
          { texte: "Épée de l'Ordre", style: "bold" },
          {
            texte:
              "On peut choisir cette Posture quand on utilise des épées en guise d'Armes en Défi.",
            style: "bold",
          },
          {
            texte:
              "Si cette Posture est choisie, tant que la Figurine sous le contrôle de ce Joueur utilise explicitement une épée tronçonneuse, une épée énergétique, une épée de force, une lame de parangon ou une Arme qui a le Trait Épée de l'Ordre, à l'Étape 3 de la Sous-phase de Défi, la Caractéristique de Modificateur d'Attaques de l'Arme est modifiée de -1 et elle gagne la Règle Spéciale Touche Critique (6+), ou bien on améliore de +1 la valeur de X d'une version de Touche Critique (X) qu'elle a déjà.",
          },
        ],
      },
      {
        titre: "Réaction Avancée",
        paragraphes: [
          {
            texte:
              "Le Joueur en Contrôle d'Unités uniquement composées de Figurines qui ont le Trait Dark Angels peut dépenser des Points de Réaction pour effectuer la Réaction Avancée suivante :",
          },
          { texte: "Vengeance de la Première Légion", style: "bold" },
          {
            texte:
              "Cette Réaction donne au Joueur en Contrôle le droit de réitérer la Sous-phase de Combat.",
            style: "bold",
          },
          {
            texte:
              "Déclencheur : Une fois par Bataille, le Joueur Réactif peut déclarer la Réaction Avancée Vengeance de la Première Légion après avoir résolu le dernier Rang d'Initiative d'un Combat qui implique une Unité sous son contrôle uniquement composée de Figurines qui ont le Trait Dark Angels, mais avant l'Étape Faire les Mises au Contact Finales.",
          },
          {
            texte:
              "Coût : Le Joueur Réactif doit dépenser 1 point de son Attribution de Réactions pour déclarer la Réaction Avancée Vengeance de la Première Légion, coût à payer dès la déclaration.",
          },
          {
            texte:
              "Cible : L'Unité Cible est toujours une Unité impliquée dans ce Combat uniquement composée de Figurines qui ont le Trait Dark Angels. L'Unité en question est l'Unité Réactive.",
          },
          {
            texte:
              "Processus : 1) Au lieu de passer à l'Étape Faire les Mises au Contact Finales de ce Combat, les Joueurs doivent revenir à l'Étape 1 de ce Combat et la résoudre une seconde fois, en défaussant les Points de Résolution de Combat gagnés la première fois (mais pas les Points de Résolution de Combat marqués en Défi au cours de ce Combat). 2) Les Figurines de l'Unité Réactive gagnent la Règle Spéciale Lacération (6+) pour leurs Armes qui ont le Trait Épée de l'Ordre.",
          },
        ],
      },
    ],
  },
  IV: {
    nomRite: "Legio Astartes Iron Warriors",
    sections: [
      {
        titre: "Tactica de Légion",
        paragraphes: [
          {
            texte:
              "Toutes les Figurines qui ont le Trait Iron Warriors (sauf les Figurines de Type Véhicule) sont sujettes à la Règle Spéciale suivante :",
          },
          { texte: "Jusqu'au Bout", style: "bold" },
          {
            texte:
              "Si le Joueur en Contrôle fait un Test de Commandement ou un Test de Sang-froid pour une Unité composée en majorité de Figurines ayant cette Règle Spéciale, il peut ignorer les modificateurs négatifs imposés par les Règles Spéciales Panique (X), Fixation (X), Sonner (X) ou Neutralisation (X).",
          },
        ],
      },
      {
        titre: "Posture",
        paragraphes: [
          {
            texte:
              "Quand il choisit une Posture, le Joueur en Contrôle d'une Figurine qui a le Trait Iron Warriors peut choisir Trépas Fielleux à la place d'une autre accessible à cette Figurine.",
          },
          { texte: "Trépas Fielleux", style: "bold" },
          {
            texte:
              "Une Figurine qui adopte cette Posture peut infliger des Touches à son adversaire si elle meurt.",
            style: "bold",
          },
          {
            texte:
              "Quand cette Posture est choisie, si cette Figurine perd son dernier Point de Vie à l'Étape de Frappe suivante, le Joueur en Contrôle a le droit d'infliger immédiatement une seule Touche automatique à la Figurine adverse, résolue avec le Profil d'Arme ci-dessous.",
          },
          {
            texte:
              "Profil d'Arme : MI 1 · MA 1 · MF 6 · PA 4 · D 2 · Règles Spéciales : Brèche (5+).",
          },
        ],
      },
      {
        titre: "Réaction Avancée",
        paragraphes: [
          {
            texte:
              "Le Joueur en Contrôle d'Unités composées uniquement de Figurines qui ont le Trait Iron Warriors peut dépenser des Points de Réaction pour effectuer la Réaction Avancée suivante :",
          },
          { texte: "Amère Fureur", style: "bold" },
          {
            texte:
              "Cette Réaction permet à l'Unité Réactive de faire une Attaque de Tir améliorée, à la manière de Répliquer.",
            style: "bold",
          },
          {
            texte:
              "Déclencheur : Une fois par Bataille, le Joueur Réactif peut déclarer la Réaction Avancée Amère Fureur à la Phase de Tir, à l'Étape 3 de la séquence d'Attaque de Tir d'une Attaque de Tir faite par le Joueur Actif ciblant une Unité composée uniquement de Figurines qui ont le Trait Iron Warriors.",
          },
          {
            texte:
              "Coût : Le Joueur Réactif doit dépenser 1 point de son Attribution de Réactions pour déclarer une Réaction Avancée Amère Fureur, coût à payer dès la déclaration.",
          },
          {
            texte:
              "Cible : L'Unité Cible est toujours l'Unité dont l'Attaque de Tir déclenche la Réaction. L'Unité Réactive est toujours l'Unité déclarée comme cible de l'Attaque de Tir qui déclenche la Réaction.",
          },
          {
            texte:
              "Processus : 1) Une fois que la Réaction Avancée Amère Fureur a été déclarée, le Joueur Actif doit résoudre normalement toutes les Étapes restantes du processus d'Attaque de Tir, jusqu'au début de l'Étape 11. 2) Avant de résoudre l'Étape 11, le Joueur Réactif fait une Attaque de Tir avec l'Unité Réactive (y compris avec les Figurines qui viennent d'être réduites à 0 PV) uniquement contre l'Unité Cible. Au cours de cette Attaque de Tir, les Armes utilisées ont leur Caractéristique de Puissance de Feu modifiée de +1, et elles gagnent la Règle Spéciale Surcharge (1). Si une Arme a déjà la Règle Spéciale Surcharge (X), on modifie de +1 la Valeur de X de ladite Règle Spéciale. 3) Une fois que l'Attaque de Tir faite dans le cadre de cette Réaction a été complètement résolue, retrait des Pertes inclus, le Joueur Actif doit finir de résoudre l'Étape 11 de l'Attaque de Tir originelle qui a déclenché la Réaction.",
          },
        ],
      },
    ],
  },
  VIII: {
    nomRite: "Legio Astartes Night Lords",
    sections: [
      {
        titre: "Tactica de Légion",
        paragraphes: [
          {
            texte:
              "Toutes les Figurines qui ont le Trait Night Lords (sauf les Figurines de Type Véhicule) sont sujettes à la Règle Spéciale suivante :",
          },
          { texte: "Un Talent pour le Meurtre", style: "bold" },
          {
            texte:
              "Les Night Lords ont une Caractéristique de Capacité de Combat améliorée quand ils combattent des Unités sujettes à des Statuts Tactiques.",
            style: "bold",
          },
          {
            texte:
              "Quand elles sont Verrouillées en Combat avec des Unités qui comprennent au moins une Figurine sujette à un quelconque Statut Tactique, les Figurines ayant cette Règle Spéciale impliquées dans ce Combat gagnent un modificateur supplémentaire de +1 à leur Caractéristique de Capacité de Combat jusqu'à la fin de la Phase.",
          },
        ],
      },
      {
        titre: "Posture",
        paragraphes: [
          {
            texte:
              "Quand il choisit une Posture, le Joueur en Contrôle d'une Figurine qui a le Trait Night Lords peut choisir Courage Nostramien à la place d'une autre accessible à cette Figurine.",
          },
          { texte: "Courage Nostramien", style: "bold" },
          {
            texte:
              "Cette Posture permet au Joueur en Contrôle d'intervertir la Figurine qui se bat en Défi.",
            style: "bold",
          },
          {
            texte:
              "On ne peut choisir cette Posture qu'une fois par Défi. Si on l'adopte, au début de l'Étape de Concentration, le Joueur en Contrôle de cette Figurine peut immédiatement rendre la Figurine à son Unité comme si elle était à la Sous-phase de Résolution. Si le Joueur en Contrôle choisit de le faire, il doit choisir une autre Figurine de cette Unité (ce peut être une Figurine qui n'est normalement pas éligible à participer à un Défi). La Figurine choisie est retirée de l'Unité et devient la Figurine du Protagoniste ou d'Antagoniste à la place de la Figurine de Protagoniste ou d'Antagoniste d'origine qui vient d'être rendue à l'Unité.",
          },
        ],
      },
      {
        titre: "Réaction Avancée",
        paragraphes: [
          {
            texte:
              "Le Joueur en Contrôle d'Unités composées uniquement de Figurines qui ont le Trait Night Lords peut dépenser des Points de Réaction pour effectuer la Réaction Avancée suivante :",
          },
          { texte: "La Première des Vertus", style: "bold" },
          {
            texte:
              "Cette Réaction permet à une Unité de Battre en Retraite quand elle est la Cible d'une Charge.",
            style: "bold",
          },
          {
            texte:
              "Déclencheur : Le Joueur Réactif peut déclarer la Réaction Avancée La Première des Vertus à l'Étape 4 du processus de Charge d'une Charge déclarée par le Joueur Actif ciblant une Unité composée uniquement de Figurines qui ont le Trait Night Lords.",
          },
          {
            texte:
              "Coût : Le Joueur Réactif doit dépenser 1 point de son Attribution de Réactions pour déclarer une Réaction Avancée La Première des Vertus, coût à payer dès la déclaration.",
          },
          {
            texte:
              "Cible : L'Unité Cible est toujours l'Unité dont la Charge déclenche la Réaction. L'Unité Réactive est toujours l'Unité déclarée cible de la Charge qui déclenche cette Réaction.",
          },
          {
            texte:
              "Processus : 1) Une fois cette Réaction déclarée, l'Unité Réactive doit immédiatement faire un Mouvement de Retraite comme si elle était sujette au Statut Tactique En Déroute. 2) Une fois ce Mouvement de Retraite effectué, l'Unité Réactive ne gagne pas le Statut Tactique En Déroute.",
          },
        ],
      },
    ],
  },
  VII: {
    nomRite: "Legio Astartes Imperial Fists",
    sections: [
      {
        titre: "Tactica de Légion",
        paragraphes: [
          {
            texte:
              "Toutes les Figurines qui ont le Trait Imperial Fists (sauf les Figurines de Type Véhicule) sont sujettes à la Règle Spéciale suivante :",
          },
          { texte: "Discipline de Tir", style: "bold" },
          {
            texte:
              "Les Imperial Fists gagnent un bonus de +1 quand ils font des Jets de Touche avec plusieurs Armes à Bolts et Auto.",
            style: "bold",
          },
          {
            texte:
              "Quand on fait une Attaque de Tir pour une Unité uniquement composée de Figurines ayant cette Règle Spéciale, on ajoute +1 au résultat des Jets de Touche faits pour les attaques de tout Groupe de Tirs qui totalise plus de cinq Dés ou attaques et qui a le Trait Bolts ou Auto.",
          },
        ],
      },
      {
        titre: "Posture",
        paragraphes: [
          {
            texte:
              "Quand il choisit une Posture, le Joueur en Contrôle d'une Figurine qui a le Trait Imperial Fists peut choisir Un Mur Inexpugnable à la place d'une autre accessible à cette Figurine.",
          },
          { texte: "Un Mur Inexpugnable", style: "bold" },
          {
            texte: "Le Joueur en Contrôle peut limiter les Dégâts subis en Défi.",
            style: "bold",
          },
          {
            texte:
              "Tant que cette Posture est choisie, le Joueur en Contrôle n'ajoute pas son Initiative en Combat au résultat du Jet de Concentration, mais il gagne la Règle Spéciale Guerrier Éternel (1) pour la durée de l'Étape de Frappe.",
          },
        ],
      },
      {
        titre: "Réaction Avancée",
        paragraphes: [
          {
            texte:
              "Le Joueur en Contrôle d'Unités composées uniquement de Figurines qui ont le Trait Imperial Fists peut dépenser des Points de Réaction pour effectuer la Réaction Avancée suivante :",
          },
          { texte: "Bastion de Feu", style: "bold" },
          {
            texte:
              "Cette Réaction permet à l'Unité Réactive de faire une Attaque de Tir contre une Unité ennemie qui se Déplace à portée.",
            style: "bold",
          },
          {
            texte:
              "Déclencheur : Une fois par Bataille, le Joueur Réactif peut déclarer la Réaction Avancée Bastion de Feu à l'Étape 2 du processus de la Sous-phase de Déplacement, si une Unité ennemie finit un Déplacement à 10\" et en Ligne de Vue d'une Unité sous le contrôle du Joueur Réactif, Unité qui est en mesure de faire une Attaque de Tir avec au moins une Arme contre l'Unité ennemie. L'Unité Réactive doit être une Unité sous le contrôle du Joueur Réactif uniquement composée de Figurines qui ont le Trait Imperial Fists, et de Type autre que Véhicule.",
          },
          {
            texte:
              "Coût : Le Joueur Réactif doit dépenser 1 point de son Attribution de Réactions pour déclarer la Réaction Avancée Bastion de Feu, coût à payer dès la déclaration.",
          },
          {
            texte:
              "Cible : L'Unité Cible est toujours l'Unité dont le Déplacement déclenche la Réaction.",
          },
          {
            texte:
              "Processus : 1) Une fois déclarée la Réaction Avancée Bastion de Feu, le Joueur Réactif fait une Attaque de Tir avec l'Unité Réactive, en ne ciblant que l'Unité ennemie qui déclenche la Réaction. 2) Une fois que l'Attaque de Tir faite dans le cadre de cette Réaction a été résolue, y compris le retrait des pertes, le Joueur Actif doit reprendre et achever sa Phase de Mouvement.",
          },
        ],
      },
    ],
  },
  XV: {
    nomRite: "Legio Astartes Thousand Sons",
    sections: [
      {
        titre: "Tactica de Légion",
        paragraphes: [
          {
            texte:
              "Toutes les Figurines qui ont le Trait Thousand Sons (sauf les Figurines de Type Véhicule) sont sujettes à la Règle Spéciale suivante :",
          },
          { texte: "Arcanes du Culte", style: "bold" },
          {
            texte:
              "Toutes les Figurines qui ont le Trait Thousand Sons sont des Psykers et ont une Caractéristique de Volonté supérieure à ce qu'indique leur profil.",
            style: "bold",
          },
          {
            texte:
              "Les Figurines ayant cette Règle Spéciale gagnent un bonus de +1 à la Valeur de Base de leur Caractéristique de Volonté, et elles gagnent le Trait Psyker.",
          },
        ],
      },
      {
        titre: "Posture",
        paragraphes: [
          {
            texte:
              "Quand il choisit une Posture, le Joueur en Contrôle d'une Figurine qui a le Trait Thousand Sons peut choisir Duelliste Prophétique à la place d'une autre accessible à cette Figurine.",
          },
          { texte: "Duelliste Prophétique", style: "bold" },
          {
            texte:
              "Quand cette Posture est choisie, le Joueur en Contrôle peut utiliser la Caractéristique de Volonté de sa Figurine à la place du résultat d'un Jet de Concentration.",
            style: "bold",
          },
          {
            texte:
              "Si cette Posture est choisie, immédiatement après avoir fait son Jet de Concentration à l'Étape de Concentration, le Joueur en Contrôle a le droit de remplacer le résultat de son Jet de Concentration (après modificateurs) par la Valeur de la Caractéristique de Volonté de cette Figurine.",
          },
        ],
      },
      {
        titre: "Réaction Avancée",
        paragraphes: [
          {
            texte:
              "Le Joueur en Contrôle d'Unités composées uniquement de Figurines qui ont le Trait Thousand Sons peut dépenser des Points de Réaction pour effectuer la Réaction Avancée suivante :",
          },
          { texte: "Forteresse Mentale", style: "bold" },
          {
            texte:
              "Cette Réaction donne à l'Unité Réactive une Sauvegarde supplémentaire contre les attaques qui la ciblent.",
            style: "bold",
          },
          {
            texte:
              "Déclencheur : Une fois par Bataille, le Joueur Réactif peut déclarer la Réaction Avancée Forteresse Mentale à l'Étape 4 du processus d'Attaque de Tir d'une Attaque de Tir déclarée par le Joueur Actif qui cible une Unité composée uniquement de Figurines qui ont le Trait Thousand Sons et ne comprend aucune Figurine de Type Véhicule.",
          },
          {
            texte:
              "Coût : Le Joueur Réactif doit dépenser 1 point de son Attribution de Réactions pour déclarer la Réaction Avancée Forteresse Mentale, coût à payer dès la déclaration.",
          },
          {
            texte:
              "Cible : L'Unité Cible est toujours l'Unité dont l'Attaque de Tir déclenche la Réaction. L'Unité Réactive est toujours l'Unité déclarée comme cible de l'Attaque de Tir qui déclenche cette Réaction.",
          },
          {
            texte:
              "Processus : 1) Une fois que la Réaction Avancée Forteresse Mentale a été déclarée, le Joueur Réactif doit faire un Test de Volonté pour l'Unité Réactive. 2) Si le Test de Volonté est réussi, l'Unité Réactive gagne une Sauvegarde Invulnérable de 3+ contre toutes les Blessures infligées par l'Attaque de Tir qui a déclenché la Réaction. 3) Si le Test de Volonté est raté, l'Unité Réactive gagne une Sauvegarde Invulnérable de 5+ contre toutes les Blessures infligées par l'Attaque de Tir qui a déclenché la Réaction. De plus, l'Unité Réactive ainsi que l'Unité Cible subissent le résultat Rupture Warp du tableau des Périls du Warp, qui doit se résoudre immédiatement après l'Étape 11 de la Phase de Tir.",
          },
        ],
      },
    ],
  },
  XVIII: {
    nomRite: "Legio Astartes Salamanders",
    sections: [
      {
        titre: "Tactica de Légion",
        paragraphes: [
          {
            texte:
              "Toutes les Figurines qui ont le Trait Salamanders (sauf les Figurines de Type Véhicule) sont sujettes aux Règles Spéciales suivantes :",
          },
          { texte: "Endurance Prométhéenne", style: "bold" },
          {
            texte:
              "Les Jets de Blessure faits contre des Salamanders échouent sur un résultat non modifié de 1 ou 2.",
            style: "bold",
          },
          {
            texte:
              "Les Jets de Blessure qui donnent un résultat de 1 ou 2 alors qu'ils ciblent une Unité composée uniquement de Figurines ayant cette Règle Spéciale sont toujours des échecs, quelle que soit la Caractéristique de Force d'une Touche et malgré les Règles Spéciales qui fixent un Nombre Cible pour les Jets de Blessure. Cette Règle Spéciale n'affecte pas les Jets de Pénétration de Blindage.",
          },
          { texte: "Sang de Feu", style: "bold" },
          {
            texte:
              "Les Unités de Salamanders peuvent ignorer les Tests de Statut Tactique provoqués par des Armes à Flammes.",
            style: "bold",
          },
          {
            texte:
              "Une Unité composée uniquement de Figurines ayant cette Règle Spéciale est immunisée à toutes les variantes de la Règle Spéciale Panique (X) des Armes qui ont le Trait Flammes.",
          },
        ],
      },
      {
        titre: "Posture",
        paragraphes: [
          {
            texte:
              "Quand il choisit une Posture, le Joueur en Contrôle d'une Figurine qui a le Trait Salamanders peut choisir Sacrifice par Devoir à la place d'une autre accessible à cette Figurine.",
          },
          { texte: "Sacrifice par Devoir", style: "bold" },
          {
            texte:
              "Cette Posture permet au Joueur de subir des Blessures en échange d'un bonus à son propre Jet de Concentration.",
            style: "bold",
          },
          {
            texte:
              "Si cette Posture est choisie, le Joueur en Contrôle peut ajouter un bonus de 1, 2 ou 3 à son Jet de Concentration. À l'Étape Appliquer les Dégâts des Blessures Non Sauvegardées de l'Étape de Frappe adverse, la Figurine qui adopte cette Posture subit un nombre de Blessures égal au bonus que cette Posture octroya au Jet de Concentration. Chacune de ces Blessures a une Caractéristique de PA de 5 et une Caractéristique de Dégâts de 1, et on peut tenter contre elle des Sauvegardes d'Armures, des Sauvegardes Invulnérables et des Jets de Mitigation de Dégâts normalement.",
          },
        ],
      },
      {
        titre: "Réaction Avancée",
        paragraphes: [
          {
            texte:
              "Le Joueur en Contrôle d'Unités composées uniquement de Figurines qui ont le Trait Salamanders peut dépenser des Points de Réaction pour effectuer la Réaction Avancée suivante :",
          },
          { texte: "Fardeau de l'Abnégation", style: "bold" },
          {
            texte:
              "Cette Réaction permet à l'Unité Réactive d'augmenter certaines Caractéristiques durant la Phase d'Assaut.",
            style: "bold",
          },
          {
            texte:
              "Déclencheur : Une fois par Bataille, le Joueur Réactif peut déclarer la Réaction Avancée Fardeau de l'Abnégation, au début de l'Étape 3 d'une Charge que le Joueur Actif déclare contre une Unité sous le contrôle du Joueur Réactif composée uniquement de Figurines qui ont le Trait Salamanders sans être de Type Véhicule.",
          },
          {
            texte:
              "Coût : Le Joueur Réactif doit dépenser 1 point de son Attribution de Réactions pour déclarer la Réaction Avancée Fardeau de l'Abnégation, coût à payer dès la déclaration.",
          },
          {
            texte:
              "Cible : Pour une Réaction Avancée Fardeau de l'Abnégation, l'Unité Réactive est toujours l'Unité que cible la Charge qui déclenche cette Réaction.",
          },
          {
            texte:
              "Processus : 1) On modifie de +1 les Caractéristiques de Capacité de Combat, de Force et d'Attaques de toutes les Figurines de l'Unité Réactive, jusqu'à la fin de la Phase d'Assaut en cours. 2) À la Sous-phase des Statuts suivante, le Joueur Réactif doit jeter un D6 pour chaque Figurine de l'Unité Réactive. À chaque résultat de 1 obtenu, l'Unité Réactive subit 1 Blessure automatique avec une Caractéristique de Dégâts de 1 et une de PA de 5 contre laquelle on peut tenter des Jets de Sauvegarde et de Mitigation de Dégâts normalement.",
          },
        ],
      },
    ],
  },
  XIII: {
    nomRite: "Legio Astartes Ultramarines",
    sections: [
      {
        titre: "Tactica de Légion",
        paragraphes: [
          {
            texte:
              "Toutes les Figurines qui ont le Trait Ultramarines (sauf les Figurines de Type Véhicule) sont sujettes à la Règle Spéciale suivante :",
          },
          { texte: "Flexibilité Tactique", style: "bold" },
          {
            texte:
              "Une Armée d'Ultramarines peut abaisser le coût d'une Réaction à chaque Tour.",
            style: "bold",
          },
          {
            texte:
              "Une fois par Tour, quand il déclare une Réaction pour une Unité uniquement composée de Figurines ayant cette Règle Spéciale, le Joueur en Contrôle a le droit d'activer la Règle Spéciale Flexibilité Tactique. Quand il le fait, on modifie de -1 le coût en Points de Réaction de la Réaction déclarée, jusqu'à un minimum de 0.",
          },
        ],
      },
      {
        titre: "Posture",
        paragraphes: [
          {
            texte:
              "Quand il choisit une Posture, le Joueur en Contrôle d'une Figurine qui a le Trait Ultramarines peut choisir Égide de la Sagesse à la place d'une autre accessible à cette Figurine.",
          },
          { texte: "Égide de la Sagesse", style: "bold" },
          {
            texte:
              "Cette Posture permet aux Figurines de gagner des bonus au Jet de Concentration.",
            style: "bold",
          },
          {
            texte:
              "Quand cette Posture est choisie, le Joueur en Contrôle ne gagne aucun bonus de Soutien Extérieur à son Jet de Concentration, mais à la place il ajoute un modificateur de +1 à son Jet de Concentration pour chaque Figurine amie de Sous-type État-major qui a le Trait Ultramarines présente sur le Champ de Bataille, sans compter la Figurine pour laquelle on a choisi cette Posture.",
          },
        ],
      },
      {
        titre: "Réaction Avancée",
        paragraphes: [
          {
            texte:
              "Le Joueur en Contrôle d'Unités composées uniquement de Figurines qui ont le Trait Ultramarines peut dépenser des Points de Réaction pour effectuer la Réaction Avancée suivante :",
          },
          { texte: "Frappe en Riposte", style: "bold" },
          {
            texte:
              "Cette Réaction permet à une Unité de répliquer à une Attaque de Tir dirigée contre une Unité amie.",
            style: "bold",
          },
          {
            texte:
              "Déclencheur : Une fois par Bataille, le Joueur Réactif peut déclarer la Réaction Avancée Frappe en Riposte à la Phase de Tir, à l'Étape 3 de la séquence d'Attaque de Tir de n'importe quelle Attaque de Tir faite par le Joueur Actif qui cible une Unité uniquement composée de Figurines qui ont le Trait Ultramarines.",
          },
          {
            texte:
              "Coût : Le Joueur Réactif doit dépenser 1 point de son Attribution de Réactions pour déclarer la Réaction Avancée Frappe en Riposte, coût à payer dès la déclaration.",
          },
          {
            texte:
              "Cible : Pour la Réaction Avancée Frappe en Riposte, l'Unité Cible est toujours l'Unité dont l'Attaque de Tir déclenche la Réaction. Le Joueur Réactif peut choisir l'Unité Réactive, tant qu'elle est conforme aux critères suivants : elle n'est pas la cible de l'Attaque de Tir ennemie qui déclenche cette Réaction ; au moins une Figurine de l'Unité a Ligne de Vue vers l'Unité ennemie qui déclenche cette Réaction ; elle est éligible à effectuer une Réaction ; elle est éligible à faire une Attaque de Tir ; elle est entièrement composée de Figurines qui ont le Trait Ultramarines.",
          },
          {
            texte:
              "Processus : 1) Une fois l'Unité Réactive choisie, le Joueur Actif doit résoudre normalement les Étapes restantes du processus d'Attaque de Tir, jusqu'au début de l'Étape 11. 2) Avant de résoudre l'Étape 11, le Joueur Réactif fait une Attaque de Tir avec l'Unité Réactive, uniquement contre l'Unité Cible. 3) Une fois cette Attaque de Tir résolue, y compris le retrait des Pertes, les Joueurs doivent finir de résoudre l'Étape 11 de l'Attaque de Tir qui a déclenché la Réaction à l'origine.",
          },
        ],
      },
    ],
  },
  VI: {
    nomRite: "Legio Astartes Space Wolves",
    sections: [
      {
        titre: "Tactica de Légion",
        paragraphes: [
          {
            texte:
              "Toutes les Figurines qui ont le Trait Space Wolves (sauf les Figurines de Type Véhicule) sont sujettes à la Règle Spéciale suivante :",
          },
          { texte: "La Frappe du Chasseur", style: "bold" },
          {
            texte:
              "Les Space Wolves font un Mouvement de Positionnement plus long.",
            style: "bold",
          },
          {
            texte:
              "Les Figurines ayant cette Règle Spéciale doivent ajouter +2\" à la distance de tout Mouvement de Positionnement, jusqu'à un maximum de 6\".",
          },
        ],
      },
      {
        titre: "Posture",
        paragraphes: [
          {
            texte:
              "Quand il choisit une Posture, le Joueur en Contrôle d'une Figurine qui a le Trait Space Wolves peut choisir une des Postures suivantes à la place d'une autre accessible à cette Figurine.",
          },
          { texte: "Nulle Proie ne s'Échappe", style: "bold" },
          {
            texte:
              "Cette Posture implique que le Défi ne prend fin qu'avec le Retrait comme Pertes de l'une ou des deux Figurines.",
            style: "bold",
          },
          {
            texte:
              "Quand cette Posture est choisie, l'Adversaire n'a jamais le choix de passer à l'Étape de Gloire, quel que soit le Joueur qui a l'Avantage en Défi, le Joueur Actif ou les effets de toute autre Posture ou Règle Spéciale, jusqu'à ce qu'au moins une des Figurines soit Retirée comme Perte.",
          },
          { texte: "Une Saga Tissée de Gloire", style: "bold" },
          {
            texte:
              "Cette Posture augmente la Caractéristique d'Attaques d'une Unité qui accompagne une Figurine en Défi.",
            style: "bold",
          },
          {
            texte:
              "Si une Figurine adoptant cette Posture remporte le Défi et que la Figurine adverse est Retirée comme Perte, toutes les Figurines de la même Unité que la Figurine adoptant cette Posture gagnent un modificateur de +1 à leur Caractéristique d'Attaques à la Sous-phase de Combat suivante.",
          },
        ],
      },
      {
        titre: "Réaction Avancée",
        paragraphes: [
          {
            texte:
              "Le Joueur en Contrôle d'Unités composées uniquement de Figurines qui ont le Trait Space Wolves peut dépenser des Points de Réaction pour effectuer la Réaction Avancée suivante :",
          },
          { texte: "Sauvagerie Bestiale", style: "bold" },
          {
            texte:
              "Cette Réaction accorde à l'Unité Réactive un Jet de Mitigation de Dégâts contre les Blessures à la Phase de Tir, et d'avancer vers une Unité ennemie.",
            style: "bold",
          },
          {
            texte:
              "Déclencheur : Une fois par Bataille, le Joueur Réactif peut déclarer la Réaction Avancée Sauvagerie Bestiale à la Phase de Tir, à l'Étape 3 de n'importe quelle Attaque de Tir faite par le Joueur Actif ciblant une Unité uniquement composée de Figurines qui ont le Trait Space Wolves.",
          },
          {
            texte:
              "Coût : Le Joueur Réactif doit dépenser 1 point de son Attribution de Réactions pour déclarer la Réaction Avancée Sauvagerie Bestiale, coût à payer dès la déclaration.",
          },
          {
            texte:
              "Cible : L'Unité Cible est toujours l'Unité dont l'Attaque de Tir déclenche la Réaction. L'Unité Réactive est toujours l'Unité Cible de l'Attaque de Tir qui déclenche la Réaction.",
          },
          {
            texte:
              "Processus : 1) Une fois que la Réaction Avancée Sauvagerie Bestiale a été déclarée, le Joueur Actif doit résoudre normalement les Étapes restantes du processus d'Attaque de Tir. Les Figurines de l'Unité Réactive gagnent la Règle Spéciale Insensible à la Douleur (5+) pour la durée de cette Phase de Tir. 2) Aussitôt résolue l'Étape 11 de l'Attaque de Tir qui a déclenché cette Réaction, l'Unité Réactive doit se Déplacer selon la procédure de Mouvement de Positionnement, comme si l'Unité Cible était la Cible d'une Charge. 3) Si ce Déplacement suffit à amener au moins une Figurine en Contact Socle à Socle avec l'ennemi, l'Unité Réactive compte comme ayant réussi une Charge à la Phase d'Assaut suivante, puis à la Sous-phase de Moral suivante elle réussit automatiquement tous les Tests qu'elle est amenée à faire, en considérant que le Joueur en Contrôle tire un double 1 à chaque Test requis.",
          },
        ],
      },
    ],
  },
  XVI: {
    nomRite: "Legio Astartes Sons of Horus",
    sections: [
      {
        titre: "Tactica de Légion",
        paragraphes: [
          {
            texte:
              "Toutes les Figurines qui ont le Trait Sons of Horus (sauf les Figurines de Type Véhicule) sont sujettes à la Règle Spéciale suivante :",
          },
          { texte: "Semeurs de Mort", style: "bold" },
          {
            texte:
              "Les Sons of Horus font les Attaques de Volée avec leur Caractéristique de Capacité de Tir entière.",
            style: "bold",
          },
          {
            texte:
              "Quand une Figurine ayant cette Règle Spéciale fait des Attaques de Volée, elle n'est pas réduite à Tirer au Jugé.",
          },
        ],
      },
      {
        titre: "Posture",
        paragraphes: [
          {
            texte:
              "Quand il choisit une Posture, le Joueur en Contrôle d'une Figurine qui a le Trait Sons of Horus peut choisir Frappe Sans Merci à la place d'une autre accessible à cette Figurine.",
          },
          { texte: "Frappe Sans Merci", style: "bold" },
          {
            texte:
              "Quand cette Posture est choisie, la Figurine du Joueur en Contrôle gagne la Règle Spéciale Phage (E).",
            style: "bold",
          },
          {
            texte:
              "On ne peut choisir cette Posture qu'à la première Étape de Confrontation d'un Défi impliquant cette Figurine. Tant que cette Posture est adoptée, toute Arme que cette Figurine utilise au cours de ce Défi gagne la Règle Spéciale Phage (E) pour la durée de cette Étape de Frappe.",
          },
        ],
      },
      {
        titre: "Réaction Avancée",
        paragraphes: [
          {
            texte:
              "Le Joueur en Contrôle d'Unités composées uniquement de Figurines qui ont le Trait Sons of Horus peut dépenser des Points de Réaction pour effectuer la Réaction Avancée suivante :",
          },
          { texte: "Orgueil du Guerrier", style: "bold" },
          {
            texte:
              "Cette Réaction permet à l'Unité Réactive d'ignorer les Défis d'un adversaire dont la Caractéristique de Capacité de Combat est inférieure.",
            style: "bold",
          },
          {
            texte:
              "Déclencheur : Le Joueur Réactif peut déclarer cette Réaction Avancée Orgueil du Guerrier quand une Unité composée de Figurines qui ont le Trait Sons of Horus est en Combat avec une Unité ennemie et que le Joueur Actif choisit une Figurine pour en faire le Protagoniste.",
          },
          {
            texte:
              "Coût : Le Joueur Réactif doit dépenser 1 point de son Attribution de Réactions pour déclarer une Réaction Avancée Orgueil du Guerrier, coût à payer dès la déclaration.",
          },
          {
            texte:
              "Cible : Pour une Réaction Avancée Orgueil du Guerrier, l'Unité Cible est toujours l'Unité qui inclut la Figurine ennemie choisie comme Protagoniste. L'Unité Réactive est l'Unité comprenant au moins une Figurine qui a le Trait Sons of Horus susceptible d'être choisie comme Antagoniste.",
          },
          {
            texte:
              "Processus : Si la Caractéristique de Capacité de Combat du Protagoniste a une Valeur de Base inférieure à celle de toutes les Figurines de l'Unité Réactive potentiellement éligibles à relever le Défi, le Joueur Réactif a le droit de ne pas relever le Défi. Dans ce cas, la Sous-phase de Défi prend immédiatement fin et aucune Figurine n'est sujette au Statut Tactique En Disgrâce.",
          },
        ],
      },
    ],
  },
  XVII: {
    nomRite: "Legio Astartes Word Bearers",
    sections: [
      {
        titre: "Tactica de Légion",
        paragraphes: [
          {
            texte:
              "Toutes les Figurines qui ont le Trait Word Bearers (sauf les Figurines de Type Véhicule) sont sujettes à la Règle Spéciale suivante :",
          },
          { texte: "Conviction Inébranlable", style: "bold" },
          {
            texte:
              "Les Word Bearers gagnent des Points de Résolution de Combat bonus.",
            style: "bold",
          },
          {
            texte:
              "Quand on résout un Combat à la Sous-phase de Résolution de la Phase d'Assaut, on marque 1 Point de Résolution de Combat si au moins une Figurine amie impliquée dans ce Combat a le Trait Word Bearers.",
          },
        ],
      },
      {
        titre: "Posture",
        paragraphes: [
          {
            texte:
              "Quand il choisit une Posture, le Joueur en Contrôle d'une Figurine qui a le Trait Word Bearers peut choisir Supplier les Dieux à la place d'une autre accessible à cette Figurine.",
          },
          { texte: "Supplier les Dieux", style: "bold" },
          {
            texte:
              "Cette Posture permet au Joueur en Contrôle de faire un Test de Volonté pour modifier ses Caractéristiques.",
            style: "bold",
          },
          {
            texte:
              "On ne peut choisir cette Posture qu'à la première Étape de Confrontation d'un Défi impliquant cette Figurine. Si cette Posture est choisie, le Joueur en Contrôle fait immédiatement un Test de Volonté pour cette Figurine. Si le Test est réussi, jusqu'à la fin de cette Sous-phase de Défi, cette Figurine ajoute +1 à ses Caractéristiques de Force et d'Attaques. Si le Test est raté, cette Figurine subit 1 Blessure avec une Caractéristique de PA de 2 et une Caractéristique de Dégâts de 1. On ne peut tenter aucun Jet de Sauvegarde ni de Mitigation de Dégâts pour défausser cette Blessure.",
          },
        ],
      },
      {
        titre: "Réaction Avancée",
        paragraphes: [
          {
            texte:
              "Le Joueur en Contrôle d'Unités composées uniquement de Figurines qui ont le Trait Word Bearers peut dépenser des Points de Réaction pour effectuer la Réaction Avancée suivante :",
          },
          { texte: "Glorieux Martyre", style: "bold" },
          {
            texte:
              "Cette Réaction permet au Joueur en Contrôle d'allouer toutes les Blessures infligées par un Groupe de Tirs à une seule et même Figurine de son choix.",
            style: "bold",
          },
          {
            texte:
              "Déclencheur : Une fois par Bataille, le Joueur Réactif peut déclarer la Réaction Avancée Glorieux Martyre à la Phase de Tir, à l'Étape 5 de la séquence d'Attaque de Tir de n'importe quelle Attaque de Tir faite par le Joueur Actif ciblant une Unité composée uniquement de Figurines qui ont le Trait Word Bearers.",
          },
          {
            texte:
              "Coût : Le Joueur Réactif doit dépenser 1 point de son Attribution de Réactions pour déclarer la Réaction Avancée Glorieux Martyre, coût à payer dès la déclaration.",
          },
          {
            texte:
              "Cible : Pour la Réaction Avancée Glorieux Martyre, l'Unité Réactive est toujours l'Unité Cible de l'Attaque de Tir qui déclenche la Réaction.",
          },
          {
            texte:
              "Processus : À l'Étape 5 de la séquence d'Attaque de Tir, le Joueur Réactif doit choisir une Figurine de l'Unité Réactive. Jusqu'à ce que le Groupe de Tirs en cours et les éventuels Groupes de Tirs qui en découlent soient résolus, seule la Figurine choisie peut être la Figurine Cible. Si cette Figurine est Retirée comme Perte, on défausse le reste du Groupe de Tirs et des éventuels Groupes de Tirs qui en découlent, puis le Joueur Actif passe à l'Étape 10 de l'Attaque de Tir.",
          },
        ],
      },
    ],
  },
  XIV: {
    nomRite: "Legio Astartes Death Guard",
    sections: [
      {
        titre: "Tactica de Légion",
        paragraphes: [
          {
            texte:
              "Toutes les Figurines qui ont le Trait Death Guard (sauf les Figurines de Type Véhicule) sont sujettes à la Règle Spéciale suivante :",
          },
          { texte: "Avance Résolue", style: "bold" },
          {
            texte:
              "Les Figurines ayant cette Règle Spéciale peuvent se Déplacer et bénéficier de la Règle Spéciale Lourde (X).",
            style: "bold",
          },
          {
            texte:
              "Une Figurine ayant cette Règle Spéciale qui ne s'est pas Déplacée de plus de 4\" à la Phase de Mouvement et n'a pas Foncé peut malgré cela bénéficier d'une quelconque variante de la Règle Spéciale Lourde (X) des Armes dont elle dispose. De plus, le Joueur en Contrôle d'une Figurine ayant cette Règle Spéciale peut ignorer les Modificateurs négatifs à la Caractéristique de Mouvement de cette Figurine dus au déplacement en Terrain Difficile.",
          },
        ],
      },
      {
        titre: "Posture",
        paragraphes: [
          {
            texte:
              "Quand il choisit une Posture, le Joueur en Contrôle d'une Figurine qui a le Trait Death Guard peut choisir Résistance Inébranlable à la place d'une autre accessible à cette Figurine.",
          },
          { texte: "Résistance Inébranlable", style: "bold" },
          {
            texte:
              "Cette Posture permet à une Figurine d'augmenter sa Caractéristique d'Endurance.",
            style: "bold",
          },
          {
            texte:
              "Si cette Posture est choisie, on remplace la Caractéristique d'Endurance de la Figurine qui l'adopte par la Valeur de Base de la Caractéristique de Capacité de Combat de la Figurine adverse pour la durée de l'Étape de Frappe suivante.",
          },
        ],
      },
      {
        titre: "Réaction Avancée",
        paragraphes: [
          {
            texte:
              "Le Joueur en Contrôle d'Unités composées uniquement de Figurines qui ont le Trait Death Guard peut dépenser des Points de Réaction pour effectuer la Réaction Avancée suivante :",
          },
          { texte: "Endurance de Barbarus", style: "bold" },
          {
            texte:
              "Cette Réaction confère à l'Unité Réactive un Jet de Mitigation de Dégâts et lui permet de se remettre des Statuts Tactiques.",
            style: "bold",
          },
          {
            texte:
              "Déclencheur : Une fois par Bataille, le Joueur Réactif peut déclarer la Réaction Avancée Endurance de Barbarus à l'Étape 4 de toute Attaque de Tir déclarée par le Joueur Actif à la Phase de Tir, qui cible une Unité composée uniquement de Figurines qui ont le Trait Death Guard sans être de Type Véhicule.",
          },
          {
            texte:
              "Coût : Le Joueur Réactif doit dépenser 1 point de son Attribution de Réactions pour déclarer la Réaction Avancée Endurance de Barbarus, coût à payer dès la déclaration.",
          },
          {
            texte:
              "Cible : L'Unité Cible est toujours l'Unité dont l'Attaque de Tir déclenche la Réaction. L'Unité Réactive est toujours l'Unité déclarée comme cible de l'Attaque de Tir qui déclenche cette Réaction.",
          },
          {
            texte:
              "Processus : 1) Toutes les Figurines de l'Unité Réactive sont immédiatement soulagées de tous les Statuts Tactiques. 2) Pour la durée de la Phase de Tir en cours, toutes les Figurines de l'Unité Réactive gagnent la Règle Spéciale Insensible à la Douleur (5+). 3) Pour la durée de la Phase de Tir en cours, le Joueur Réactif réussit automatiquement tout Test de Sang-froid ou Test de Commandement fait pour l'Unité Réactive.",
          },
        ],
      },
    ],
  },
  XIX: {
    nomRite: "Legio Astartes Raven Guard",
    sections: [
      {
        titre: "Tactica de Légion",
        paragraphes: [
          {
            texte:
              "Toutes les Figurines qui ont le Trait Raven Guard (sauf les Figurines de Type Véhicule) sont sujettes à la Règle Spéciale suivante :",
          },
          { texte: "Marcheurs de l'Ombre", style: "bold" },
          {
            texte:
              "Les Attaques de Tir à grande distance ont plus de mal à toucher les Figurines de la Raven Guard.",
            style: "bold",
          },
          {
            texte:
              "Quand une Unité composée uniquement de Figurines ayant cette Règle Spéciale est la cible d'une Attaque de Tir, toutes les attaques doivent se faire au Jugé dès lors que la distance entre l'Unité Cible et la plus proche Figurine de l'Unité Attaquante est d'au moins 18\".",
          },
        ],
      },
      {
        titre: "Posture",
        paragraphes: [
          {
            texte:
              "Quand il choisit une Posture, le Joueur en Contrôle d'une Figurine qui a le Trait Raven Guard peut choisir Frappe de Décapitation à la place d'une autre accessible à cette Figurine.",
          },
          { texte: "Frappe de Décapitation", style: "bold" },
          {
            texte:
              "Cette Posture permet à la Figurine de porter une attaque en premier, puis de la faire suivre par les attaques restantes si la première est réussie.",
            style: "bold",
          },
          {
            texte:
              "On peut choisir cette Posture une fois par Défi. Quand on la choisit, on ne fait pas de Jet de Concentration, au lieu de quoi le Joueur en Contrôle de la Figurine qui adopte cette Posture fait une seule attaque à la fin de l'Étape de Concentration. Si le Jet de Touche et le Jet de Blessure faits pour cette attaque réussissent tous les deux (à savoir qu'ils atteignent leur Nombre Cible), le Joueur en Contrôle de la Figurine qui adopte cette Posture peut alors faire le reste des attaques que ladite Figurine a le droit de faire à l'Étape de Frappe en cours, moins l'unique attaque déjà faite. Si le Jet de Touche ou le Jet de Blessure pour l'attaque initiale échoue, la Figurine qui adopte cette Posture ne peut plus faire d'Attaques à cette Étape de Frappe.",
          },
        ],
      },
      {
        titre: "Réaction Avancée",
        paragraphes: [
          {
            texte:
              "Le Joueur en Contrôle d'Unités composées uniquement de Figurines qui ont le Trait Raven Guard peut dépenser des Points de Réaction pour effectuer la Réaction Avancée suivante :",
          },
          { texte: "Voile d'Ombre", style: "bold" },
          {
            texte:
              "Cette Réaction permet à l'Unité Réactive de se Déplacer quand une Attaque de Tir la cible, et de gagner un Jet de Mitigation de Dégâts pour la durée de la Phase de Tir.",
            style: "bold",
          },
          {
            texte:
              "Déclencheur : Une fois par Bataille, le Joueur Réactif peut déclarer la Réaction Avancée Voile d'Ombre quand le Joueur Actif cible avec une Attaque de Tir une Unité sous son contrôle composée uniquement de Figurines qui ont le Trait Raven Guard sans être de Type Véhicule.",
          },
          {
            texte:
              "Coût : Le Joueur Réactif doit dépenser 1 point de son Attribution de Réactions pour déclarer la Réaction Avancée Voile d'Ombre, coût à payer dès la déclaration.",
          },
          {
            texte:
              "Cible : Pour une Réaction Avancée Voile d'Ombre, l'Unité Réactive est toujours l'Unité cible de l'Attaque de Tir qui déclenche cette Réaction.",
          },
          {
            texte:
              "Processus : 1) On peut Déplacer selon les règles normales toutes les Figurines de l'Unité Réactive d'une distance égale à la Valeur de leur Caractéristique d'Initiative, mais sans avoir le droit de les faire Foncer. Si, après ce Déplacement, il s'avère qu'aucune Figurine de l'Unité Cible n'est en Ligne de Vue et/ou à Portée de la moindre Figurine de l'Unité Attaquante, le Joueur Actif n'a pas le droit de choisir une autre cible pour cette Unité Attaquante à la Phase de Tir en cours. 2) Une fois que le Joueur Réactif a résolu ce Déplacement, les Figurines de l'Unité Réactive gagnent toutes la Règle Spéciale Dissimulation (5+) pour le reste de la Phase de Tir en cours, et le Joueur Actif peut passer à l'Étape 2 de la séquence d'Attaque de Tir.",
          },
        ],
      },
    ],
  },
  V: {
    nomRite: "Legio Astartes White Scars",
    sections: [
      {
        titre: "Tactica de Légion",
        paragraphes: [
          {
            texte:
              "Toutes les Figurines qui ont le Trait White Scars (sauf les Figurines de Type Véhicule) sont sujettes à la Règle Spéciale suivante :",
          },
          { texte: "Prompts à Agir", style: "bold" },
          {
            texte:
              "Le Joueur White Scars peut augmenter la Caractéristique de Mouvement de ses Figurines.",
            style: "bold",
          },
          {
            texte:
              "Au début de n'importe lequel de ses Tours de Joueur, le Joueur en Contrôle a le droit d'augmenter la Caractéristique de Mouvement de toute Figurine ayant cette Règle Spéciale et une Caractéristique de Mouvement d'une Valeur de Base d'au moins 1, en appliquant un modificateur de +2 à cette Caractéristique jusqu'à la fin de ce Tour de Joueur.",
          },
        ],
      },
      {
        titre: "Posture",
        paragraphes: [
          {
            texte:
              "Quand il choisit une Posture, le Joueur en Contrôle d'une Figurine qui a le Trait White Scars peut choisir La Voie du Guerrier à la place d'une autre accessible à cette Figurine.",
          },
          { texte: "La Voie du Guerrier", style: "bold" },
          {
            texte:
              "Le Joueur en Contrôle peut tenter de gagner un bonus au Jet de Concentration.",
            style: "bold",
          },
          {
            texte:
              "Quand cette Posture est choisie, avant de faire le Jet de Concentration, le Joueur en Contrôle doit déclarer s'il choisit de « Frapper Bas » (prédire que le résultat du prochain Jet de Concentration sera de 1 à 3 avant tout modificateur) ou de « Frapper Haut » (prédire que le résultat du prochain Jet de Concentration sera de 4 à 6 avant tout modificateur). Si le résultat du Jet de Concentration correspond à son pronostic, il peut ignorer tous les modificateurs négatifs et n'appliquer que les modificateurs positifs à son Jet de Concentration.",
          },
        ],
      },
      {
        titre: "Réaction Avancée",
        paragraphes: [
          {
            texte:
              "Le Joueur en Contrôle d'Unités composées uniquement de Figurines qui ont le Trait White Scars peut dépenser des Points de Réaction pour effectuer la Réaction Avancée suivante :",
          },
          { texte: "À la Poursuite du Vent", style: "bold" },
          {
            texte:
              "Cette Réaction Avancée permet au Joueur en Contrôle de faire un Déplacement de plus avec l'Unité Réactive.",
            style: "bold",
          },
          {
            texte:
              "Déclencheur : Le Joueur Réactif peut déclarer une Réaction Avancée À la Poursuite du Vent à l'Étape 2 du processus de la Sous-phase de Déplacement, si une Unité ennemie finit un Déplacement à 12\" et en Ligne de Vue d'une Unité uniquement composée de Figurines qui ont le Trait White Scars sous le contrôle du Joueur Réactif.",
          },
          {
            texte:
              "Coût : Le Joueur Réactif doit dépenser 1 point de son Attribution de Réactions pour déclarer une Réaction Avancée À la Poursuite du Vent, coût à payer dès la déclaration.",
          },
          {
            texte:
              "Cible : L'Unité Cible est toujours l'Unité dont le Déplacement déclenche la Réaction Avancée. Une fois le coût payé, le Joueur Réactif doit choisir une Unité sous son contrôle uniquement composée de Figurines qui ont le Trait White Scars, à 12\" et en Ligne de Vue de l'Unité Cible. L'Unité choisie est l'Unité Réactive.",
          },
          {
            texte:
              "Processus : 1) Une fois que l'Unité Cible a fini son Déplacement, le Joueur Réactif peut en faire un avec l'Unité Réactive, selon les Règles normales de Mouvement, en appliquant les éventuels modificateurs dus au Terrain Difficile et en faisant le cas échéant des Jets de Terrain Dangereux, mais l'Unité Réactive ne peut pas Foncer. 2) Une fois que l'Unité Réactive s'est déplacée, le Joueur Actif doit reprendre et achever sa Phase de Mouvement.",
          },
        ],
      },
    ],
  },
  IX: {
    nomRite: "Legio Astartes Blood Angels",
    sections: [
      {
        titre: "Tactica de Légion",
        paragraphes: [
          {
            texte:
              "Toutes les Figurines qui ont le Trait Blood Angels (sauf les Figurines de Type Véhicule) sont sujettes à la Règle Spéciale suivante :",
          },
          { texte: "Fureur Carmin", style: "bold" },
          {
            texte:
              "Quand les Blood Angels Chargent avec succès, la Force de leurs Attaques augmente.",
            style: "bold",
          },
          {
            texte:
              "À n'importe quel Tour auquel les Figurines ayant cette Règle Spéciale ont fait un Mouvement de Charge, on modifie de +1 la Valeur de leur Caractéristique de Force jusqu'à la fin du Tour.",
          },
        ],
      },
      {
        titre: "Posture",
        paragraphes: [
          {
            texte:
              "Quand il choisit une Posture, le Joueur en Contrôle d'une Figurine qui a le Trait Blood Angels peut choisir Asservi à la Soif Rouge à la place d'une autre accessible à cette Figurine.",
          },
          { texte: "Asservi à la Soif Rouge", style: "bold" },
          {
            texte:
              "Cette Figurine peut ignorer les modificateurs dus aux PV perdus, mais elle ne gagne pas de Soutien Extérieur.",
            style: "bold",
          },
          {
            texte:
              "Si cette Posture est choisie, la Figurine qui l'adopte peut ignorer tous les modificateurs négatifs au Jet de Concentration dus aux Points de Vie perdus, et on modifie de +1 la Caractéristique de Dégâts de chaque Blessure infligée à l'adversaire. Tant que la Figurine adopte cette Posture, elle ne gagne aucun bonus au Jet de Concentration dû au Soutien Extérieur.",
          },
        ],
      },
      {
        titre: "Réaction Avancée",
        paragraphes: [
          {
            texte:
              "Le Joueur en Contrôle d'Unités uniquement composées de Figurines qui ont le Trait Blood Angels peut dépenser des Points de Réaction pour effectuer la Réaction Avancée suivante :",
          },
          { texte: "Le Courroux des Anges", style: "bold" },
          {
            texte:
              "Cette Réaction permet à l'Unité Réactive d'avancer vers une Unité ennemie qui la cible avec une Attaque de Tir.",
            style: "bold",
          },
          {
            texte:
              "Déclencheur : Une fois par Bataille, le Joueur Réactif peut déclarer la Réaction Avancée Le Courroux des Anges à la Phase de Tir, à l'Étape 4 de la séquence d'Attaque de Tir de toute Attaque de Tir faite par le Joueur Actif qui cible une Unité sous le contrôle du Joueur Réactif composée uniquement de Figurines qui ont le Trait Blood Angels.",
          },
          {
            texte:
              "Coût : Le Joueur Réactif doit dépenser 1 point de son Attribution de Réactions pour déclarer la Réaction Avancée Le Courroux des Anges, coût à payer dès la déclaration.",
          },
          {
            texte:
              "Cible : L'Unité Cible est toujours l'Unité dont l'Attaque de Tir déclenche la Réaction. L'Unité Réactive est toujours l'Unité ciblée par l'Attaque de Tir qui déclenche la Réaction.",
          },
          {
            texte:
              "Processus : 1) Une fois que la Réaction Avancée Le Courroux des Anges a été déclarée, le Joueur Actif doit résoudre normalement les Étapes restantes du processus d'Attaque de Tir, jusqu'au début de l'Étape 11. 2) Sitôt résolue l'Étape 11 de l'Attaque de Tir qui a déclenché cette Réaction, chaque Figurine de l'Unité Réactive doit se Déplacer selon la procédure d'un Déplacement normal, droit vers la plus proche Figurine de l'Unité Cible, en parcourant la distance maximum possible tout en restant à au moins 1\" de toute Figurine ennemie. 3) Après avoir résolu ce Déplacement, si au moins une Figurine de l'Unité Réactive est à 6\" d'une Figurine de l'Unité Cible, le Joueur en Contrôle de l'Unité Cible doit faire pour elle un Test de Sang-froid à la Sous-phase de Moral du même Tour de Joueur. Si ce Test est un échec, toutes les Figurines de l'Unité Cible gagnent le Statut Fixée.",
          },
        ],
      },
    ],
  },
  X: {
    nomRite: "Legio Astartes Iron Hands",
    sections: [
      {
        titre: "Tactica de Légion",
        paragraphes: [
          {
            texte:
              "Toutes les Figurines qui ont le Trait Iron Hands (hormis Figurines de Type Véhicule) sont sujettes à la Règle Spéciale suivante :",
          },
          { texte: "Les Écailles de la Gorgone", style: "bold" },
          {
            texte:
              "Les Attaques de Tir qui ciblent les Iron Hands subissent un malus à la Force.",
            style: "bold",
          },
          {
            texte:
              "On modifie de -1 la Force de Tir des attaques faites au cours d'une Attaque de Tir quand on résout les Jets de Blessure contre une Unité composée uniquement de Figurines ayant cette Règle Spéciale.",
          },
        ],
      },
      {
        titre: "Posture",
        paragraphes: [
          {
            texte:
              "Quand il choisit une Posture, le Joueur en Contrôle d'une Figurine qui a le Trait Iron Hands peut choisir Une Légion à Lui Seul à la place d'une autre accessible à cette Figurine.",
          },
          { texte: "Une Légion à Lui Seul", style: "bold" },
          {
            texte:
              "La Figurine bénéficie davantage du Soutien Extérieur quand elle adopte cette Posture.",
            style: "bold",
          },
          {
            texte:
              "Quand on choisit cette Posture, la Figurine qui l'adopte gagne le double du bonus normal à son Jet de Concentration que lui vaut le Soutien Extérieur dont elle bénéficie. De plus, quand elle adopte cette Posture, son adversaire ne peut gagner au maximum qu'un bonus de +2 du fait de son propre Soutien Extérieur.",
          },
        ],
      },
      {
        titre: "Réaction Avancée",
        paragraphes: [
          {
            texte:
              "Le Joueur en Contrôle d'Unités uniquement composées de Figurines qui ont le Trait Iron Hands peut dépenser des Points de Réaction pour effectuer la Réaction Avancée suivante :",
          },
          { texte: "Animosité de la Gorgone", style: "bold" },
          {
            texte:
              "Cette Réaction permet à l'Unité Réactive de faire une Attaque de Tir ciblant une Unité en Charge.",
            style: "bold",
          },
          {
            texte:
              "Déclencheur : Une fois par Bataille, le Joueur Réactif peut déclarer la Réaction Avancée Animosité de la Gorgone au début de l'Étape 3 du processus de Charge de n'importe quelle Charge déclarée par le Joueur Actif qui cible une Unité sous le contrôle du Joueur Réactif, Unité composée uniquement de Figurines qui ont le Trait Iron Hands.",
          },
          {
            texte:
              "Coût : Le Joueur Réactif doit dépenser 1 point de son Attribution de Réactions pour déclarer la Réaction Avancée Animosité de la Gorgone, coût à payer dès la déclaration.",
          },
          {
            texte:
              "Cible : L'Unité Cible est toujours l'Unité dont la Charge déclenche la Réaction Avancée. L'Unité Réactive est toujours l'Unité déclarée comme cible de la Charge qui déclenche cette Réaction.",
          },
          {
            texte:
              "Processus : 1) Une fois que la Réaction Avancée Animosité de la Gorgone a été déclarée, le Joueur Réactif fait une Attaque de Tir avec l'Unité Réactive. 2) Cette Attaque de Tir doit cibler l'Unité Cible. Elle se fait à la Capacité de Tir entière et non au Jugé, et peut se faire avec n'importe quelle Arme de Tir. Jusqu'à ce que cette Attaque de Tir soit résolue, on modifie de +1 la Caractéristique de Puissance de Feu des Armes choisies pour l'exécuter, et elles gagnent la Règle Spéciale Surcharge (1). Si elles ont déjà la Règle Spéciale Surcharge (X), on augmente de +1 la valeur de X de ladite Règle Spéciale. 3) Après avoir résolu cette Attaque de Tir, le Joueur Actif passe à l'Étape 3 de la Charge normalement. Le Joueur Réactif ne peut pas faire d'Attaques de Volée à l'Étape 4 de la Charge, même si le Joueur Actif choisit de le faire.",
          },
        ],
      },
    ],
  },
  "legio-astartes-emperors-children": {
    nomRite: "Legio Astartes Emperor's Children",
    sections: [
      {
        titre: "Tactica de Légion",
        paragraphes: [
          {
            texte:
              "Toutes les Figurines qui ont le Trait Emperor's Children (sauf les Figurines de Type Véhicule) sont sujettes à la Règle Spéciale suivante :",
          },
          { texte: "Exécution Impeccable", style: "bold" },
          {
            texte:
              "Les Emperor's Children gagnent un bonus à l'Initiative quand ils Chargent avec succès.",
            style: "bold",
          },
          {
            texte:
              "À chaque Tour auquel elles ont fait un Mouvement de Charge, les Figurines ayant cette Règle Spéciale gagnent un modificateur additionnel de +1 à leur Initiative en Combat jusqu'à la fin de la Phase.",
          },
        ],
      },
      {
        titre: "Posture",
        paragraphes: [
          {
            texte:
              "Quand il choisit une Posture, le Joueur en Contrôle d'une Figurine qui a le Trait Emperor's Children peut choisir Parangon d'Excellence à la place d'une autre accessible à cette Figurine.",
          },
          { texte: "Parangon d'Excellence", style: "bold" },
          {
            texte:
              "Cette Posture accorde au Joueur en Contrôle un bonus au Jet de Concentration au premier round d'un Défi.",
            style: "bold",
          },
          {
            texte:
              "On ne peut choisir cette Posture qu'à la première Étape de Confrontation d'un Défi impliquant cette Figurine. Tant que cette Posture est adoptée, à l'Étape de Concentration, le Joueur en Contrôle gagne un modificateur de +2 au Jet de Concentration.",
          },
        ],
      },
      {
        titre: "Réaction Avancée",
        paragraphes: [
          {
            texte:
              "Le Joueur en Contrôle d'Unités composées uniquement de Figurines qui ont le Trait Emperor's Children peut dépenser des Points de Réaction pour effectuer la Réaction Avancée suivante :",
          },
          { texte: "Parade Parfaite", style: "bold" },
          {
            texte:
              "Cette Réaction permet à l'Unité Réactive de Charger une Unité ennemie qui vient elle-même de Charger.",
            style: "bold",
          },
          {
            texte:
              "Déclencheur : Une fois par Bataille, le Joueur Réactif peut déclarer la Réaction Avancée Parade Parfaite à la fin de l'Étape 3 du processus de Charge d'une quelconque Charge déclarée par le Joueur Actif qui cible une Unité sous le contrôle du Joueur Réactif composée uniquement de Figurines qui ont le Trait Emperor's Children.",
          },
          {
            texte:
              "Coût : Le Joueur Réactif doit dépenser 1 point de son Attribution de Réactions pour déclarer la Réaction Avancée Parade Parfaite, coût à payer dès la déclaration.",
          },
          {
            texte:
              "Cible : L'Unité Cible est toujours l'Unité dont la Charge déclenche la Réaction. L'Unité Réactive est toujours l'Unité déclarée comme cible de la Charge qui déclenche cette Réaction.",
          },
          {
            texte:
              "Processus : 1) Une fois cette Réaction déclarée, le Joueur Réactif doit faire un Jet de Charge pour l'Unité Réactive. 2) Si le résultat du Jet de Charge s'avère suffisant pour amener une Figurine de l'Unité Réactive en Contact Socle à Socle avec une Figurine de l'Unité Cible, on fait un Mouvement de Charge et les Unités sont Verrouillées en Combat. Aucune Figurine de l'Unité Cible ne peut revendiquer de bonus dû à une Règle Spéciale qui exige d'avoir réussi une Charge, tandis que les Figurines de l'Unité Réactive gagnent les bonus des éventuelles Règles Spéciales qui s'appliquent à ladite Unité en cas de Charge réussie. 3) Si le résultat du Jet de Charge n'est pas suffisant pour amener la moindre Figurine de l'Unité Réactive en Contact Socle à Socle avec une Figurine de l'Unité Cible, on ne fait aucun Mouvement de Charge et les Joueurs passent à l'Étape 4 du processus de Charge.",
          },
        ],
      },
    ],
  },
  "legio-hereticus-emperors-children": {
    nomRite: "Legio Hereticus Emperor's Children",
    sections: [
      {
        titre: "Tactica de Légion",
        paragraphes: [
          {
            texte:
              "Toutes les Figurines qui ont le Trait Emperor's Children (sauf les Figurines de Type Véhicule) sont sujettes à la Règle Spéciale suivante :",
          },
          { texte: "Seigneurs de la Prodigalité", style: "bold" },
          {
            texte:
              "Le Joueur en Contrôle a le droit de rendre une Unité Stupéfiée quand elle est la cible d'une Attaque de Tir.",
            style: "bold",
          },
          {
            texte:
              "Après qu'on ait résolu une Attaque de Tir qui cible une Unité composée uniquement de Figurines ayant cette Règle Spéciale, le Joueur en Contrôle de ladite Unité a le droit de la rendre Stupéfiée.",
          },
          { texte: "Stupéfiée", style: "bold" },
          {
            texte:
              "Quand une Unité devient Stupéfiée, on retire tous les Statuts Tactiques qui l'affectent. De plus, tant qu'une Unité est Stupéfiée : les Figurines de l'Unité ont la Règle Spéciale Insensible à la Douleur (6+) ; on modifie de +1 la Caractéristique de Force des Figurines de l'Unité ; les Figurines de l'Unité ne peuvent gagner aucun Statut Tactique ; le Joueur en Contrôle d'une Unité Stupéfiée ne peut déclarer aucune Réaction pour ladite Unité, et il doit faire au jugé toutes les Attaques de Tir qu'il ferait pour elle ; à la Sous-phase des Effets de fin de Phase de Fin, le Joueur en Contrôle doit faire un Test de Sang-froid pour chaque Unité de son Armée qui est Stupéfiée — si le Test réussit, l'Unité concernée n'est plus Stupéfiée.",
          },
        ],
      },
      {
        titre: "Posture",
        paragraphes: [
          {
            texte:
              "Quand il choisit une Posture, le Joueur en Contrôle d'une Figurine qui a le Trait Emperor's Children peut choisir Le Miroir Brisé à la place d'une autre accessible à cette Figurine.",
          },
          { texte: "Le Miroir Brisé", style: "bold" },
          {
            texte:
              "Quand cette Posture est choisie, le Joueur en Contrôle double le bonus que lui confère le Soutien Extérieur, en sus d'un autre bonus quand l'Unité est Stupéfiée.",
            style: "bold",
          },
          {
            texte:
              "Si cette Posture est choisie, on double le modificateur normal de Soutien Extérieur dont la Figurine bénéficie à l'Étape de Concentration. Si l'Unité dont cette Figurine fait partie est Stupéfiée, on ajoute un modificateur supplémentaire de +1.",
          },
        ],
      },
      {
        titre: "Réaction Avancée",
        paragraphes: [
          {
            texte:
              "Le Joueur en Contrôle d'Unités composées uniquement de Figurines qui ont le Trait Emperor's Children peut dépenser des Points de Réaction pour effectuer la Réaction Avancée suivante :",
          },
          { texte: "Désir Retors", style: "bold" },
          {
            texte:
              "Cette Réaction permet à l'Unité Réactive de devenir Stupéfiée quand elle est Chargée.",
            style: "bold",
          },
          {
            texte:
              "Déclencheur : Le Joueur Réactif peut déclarer la Réaction Avancée Désir Retors à la fin de l'Étape 2 d'une Charge déclarée par le Joueur Actif qui cible une Unité sous le contrôle du Joueur Réactif composée uniquement de Figurines qui ont le Trait Emperor's Children.",
          },
          {
            texte:
              "Coût : Le Joueur Réactif doit dépenser 1 point de son Attribution de Réactions pour déclarer la Réaction Avancée Désir Retors, coût à payer dès la déclaration.",
          },
          {
            texte:
              "Cible : L'Unité Cible est toujours l'Unité dont la Charge déclenche cette Réaction. L'Unité Réactive est toujours l'Unité déclarée cible de la Charge qui déclenche cette Réaction.",
          },
          {
            texte:
              "Processus : Une fois cette Réaction déclarée, l'Unité Réactive devient Stupéfiée, et pour la durée de cette Phase d'Assaut, les Figurines de ladite Unité gagnent la Règle Spéciale Insensible à la Douleur (5+).",
          },
        ],
      },
    ],
  },
  "legio-astartes-world-eaters": {
    nomRite: "Legio Astartes World Eaters",
    sections: [
      {
        titre: "Tactica de Légion",
        paragraphes: [
          {
            texte:
              "Toutes les Figurines qui ont le Trait World Eaters (sauf les Figurines de Type Véhicule) sont sujettes à la Règle Spéciale suivante :",
          },
          { texte: "Violence Incarnée", style: "bold" },
          {
            texte:
              "Quand ils Chargent, les World Eaters ont un bonus de +1 à leur Caractéristique d'Attaques.",
            style: "bold",
          },
          {
            texte:
              "À chaque Tour auquel elles ont fait un Mouvement de Charge, les Figurines ayant cette Règle Spéciale modifient de +1 la Valeur de leur Caractéristique d'Attaques jusqu'à la fin de la Phase.",
          },
        ],
      },
      {
        titre: "Posture",
        paragraphes: [
          {
            texte:
              "Quand il choisit une Posture, le Joueur en Contrôle d'une Figurine qui a le Trait World Eaters peut choisir Tuerie Débordante à la place d'une autre accessible à cette Figurine.",
          },
          { texte: "Tuerie Débordante", style: "bold" },
          {
            texte:
              "Cette Posture permet d'allouer des blessures aux Figurines ennemies hors du Défi quand l'adversaire est Retiré comme Perte.",
            style: "bold",
          },
          {
            texte:
              "Si cette Posture est choisie, quand cette Figurine fait des attaques à l'Étape de Frappe, si la Figurine qu'elle affronte en Défi est Retirée comme Perte, les blessures en excès doivent être allouées à d'autres Figurines ennemies éligibles impliquées dans le même Combat selon les Règles normales.",
          },
        ],
      },
      {
        titre: "Réaction Avancée",
        paragraphes: [
          {
            texte:
              "Le Joueur en Contrôle d'Unités composées uniquement de Figurines qui ont le Trait World Eaters peut dépenser des Points de Réaction pour effectuer la Réaction Avancée suivante :",
          },
          { texte: "Déferlante Brutale", style: "bold" },
          {
            texte:
              "Cette Réaction permet à l'Unité Réactive de Charger une Unité qui la cible avec une Attaque de Tir.",
            style: "bold",
          },
          {
            texte:
              "Déclencheur : Une fois par Bataille, le Joueur Réactif peut déclarer la Réaction Avancée Déferlante Brutale à l'Étape 4 d'une Attaque de Tir ciblant une Unité composée uniquement de Figurines qui ont le Trait World Eaters et ne sont pas de Type Véhicule.",
          },
          {
            texte:
              "Coût : Le Joueur Réactif doit dépenser 1 point de son Attribution de Réactions.",
          },
          {
            texte:
              "Processus : 1) Pour la durée de la Phase de Tir en cours, toutes les Figurines de l'Unité Réactive gagnent la Règle Spéciale Guerrier Éternel (1). 2) Sitôt résolue l'Étape 11 de l'Attaque de Tir qui a déclenché cette Réaction, le Joueur Réactif doit faire un Jet de Charge pour l'Unité Réactive. 3) Si le résultat du Jet de Charge n'est pas suffisant pour amener la moindre Figurine de l'Unité Réactive en Contact Socle à Socle avec une Figurine de l'Unité Cible, on ne fait aucun Mouvement de Charge.",
          },
        ],
      },
    ],
  },
  "legio-hereticus-world-eaters": {
    nomRite: "Legio Hereticus World Eaters",
    sections: [
      {
        titre: "Tactica de Légion",
        paragraphes: [
          {
            texte:
              "Toutes les Figurines qui ont le Trait World Eaters (sauf les Figurines de Type Véhicule) sont sujettes à la Règle Spéciale suivante :",
          },
          { texte: "La Morsure des Clous", style: "bold" },
          {
            texte:
              "Le Joueur en Contrôle peut Livrer aux Clous une Unité de World Eaters qui rate un Test de Commandement.",
            style: "bold",
          },
          {
            texte:
              "Quand une Unité composée uniquement de Figurines ayant cette Règle Spéciale rate un Test de Commandement, son joueur en Contrôle a le droit de la Livrer aux Clous.",
          },
          { texte: "Livrée aux Clous", style: "bold" },
          {
            texte:
              "Quand une Unité devient Livrée aux Clous, on retire tous les Statuts Tactiques qui l'affectent. De plus, tant qu'une Unité est Livrée aux Clous : les Figurines de l'Unité peuvent ajouter +1\" à la distance parcourue lors d'un Mouvement de Positionnement ; on modifie de +1 la Valeur de la Caractéristique d'Attaques des Figurines de l'Unité ; on considère que les Figurines de l'Unité ont une Caractéristique de Commandement, de Sang-froid et de Volonté de 10 (sauf si elle est plus élevée normalement) ; au début de la Sous-phase de Charge du joueur en Contrôle, si elle se trouve à 12\" de la moindre Figurine ennemie, l'Unité doit faire un Mouvement de Charge (s'il y a plusieurs Unités ennemies à 12\", le joueur en Contrôle de l'Unité doit désigner l'Unité ennemie la plus proche).",
          },
          {
            texte:
              "Au début de la Sous-phase de Charge du joueur en Contrôle, s'il n'y a aucune Unité ennemie à 12\" d'une Unité Livrée aux Clous, cette dernière n'est plus Livrée aux Clous.",
          },
        ],
      },
      {
        titre: "Posture",
        paragraphes: [
          {
            texte:
              "Quand il choisit une Posture, le Joueur en Contrôle d'une Figurine qui a le Trait World Eaters peut choisir Démembrement Brutal à la place d'une autre accessible à cette Figurine.",
          },
          { texte: "Démembrement Brutal", style: "bold" },
          {
            texte:
              "Tant que cette Posture est adoptée, si la Figurine ennemie est Retirée comme Perte à l'Étape de Frappe, à l'Étape de Gloire suivante, le Joueur en Contrôle gagne 2 Points de Résolution de Combat en plus.",
          },
        ],
      },
      {
        titre: "Réaction Avancée",
        paragraphes: [
          {
            texte:
              "Le Joueur en Contrôle d'Unités composées uniquement de Figurines qui ont le Trait World Eaters peut dépenser des Points de Réaction pour effectuer la Réaction Avancée suivante :",
          },
          { texte: "Charge Furieuse", style: "bold" },
          {
            texte:
              "Cette Réaction permet à l'Unité Réactive de se Livrer aux Clous après l'Étape de Volée d'une Charge.",
            style: "bold",
          },
          {
            texte:
              "Déclencheur : Le Joueur Réactif peut déclarer une Réaction Avancée Charge Furieuse à la fin de l'Étape 4 d'une Charge déclarée par le Joueur Actif ciblant une Unité composée uniquement de Figurines qui ont le Trait World Eaters, si au moins une Figurine de l'Unité Cible a été Retirée comme Perte suite aux Attaques de Volée.",
          },
          {
            texte:
              "Coût : Le Joueur Réactif doit dépenser 1 point de son Attribution de Réactions.",
          },
          {
            texte:
              "Processus : 1) Une fois cette Réaction déclarée, l'Unité Cible devient Livrée aux Clous. 2) Le Joueur Réactif doit alors faire un Jet de Charge pour l'Unité Réactive. 3) Si le résultat du Jet de Charge n'est pas suffisant pour amener la moindre Figurine de l'Unité Réactive en Contact Socle à Socle avec une Figurine de l'Unité Cible, on ne fait aucun Mouvement de Charge et les Joueurs passent à l'Étape 5 de la procédure de Charge.",
          },
        ],
      },
    ],
  },
  XX: {
    nomRite: "Legio Astartes Alpha Legion",
    sections: [
      {
        titre: "Tactica de Légion",
        paragraphes: [
          {
            texte:
              "Toutes les Figurines qui ont le Trait Alpha Legion (sauf les Figurines de Type Véhicule) sont sujettes à la Règle Spéciale suivante :",
          },
          { texte: "Mensonges et Obscurcissement", style: "bold" },
          {
            texte:
              "Les Figurines de l'Alpha Legion comptent comme se trouvant plus loin qu'elles ne le sont en réalité.",
            style: "bold",
          },
          {
            texte:
              "On considère toujours qu'une Figurine ayant cette Règle Spéciale se trouve à 2\" plus loin qu'en réalité, quand on mesure la portée qui sépare cette Figurine ennemie pour ce qui est de résoudre une Attaque de Tir, une Charge ou lorsqu'on déclare une Réaction déclarée par la Figurine ou Unité ennemie (cela se cumule à tous les autres modificateurs à la portée imposés par des Règles Spéciales).",
          },
        ],
      },
      {
        titre: "Posture",
        paragraphes: [
          {
            texte:
              "Quand il choisit une Posture, le Joueur en Contrôle d'une Figurine qui a le Trait Alpha Legion peut choisir Je Suis Alpharius à la place de toute autre accessible à cette Figurine.",
          },
          { texte: "Je Suis Alpharius", style: "bold" },
          {
            texte:
              "Quand on choisit cette Posture, on réduit l'Initiative en Combat de la Figurine du Joueur Adverse.",
            style: "bold",
          },
          {
            texte:
              "On ne peut choisir cette Posture qu'à la première Étape de Confrontation d'un Défi impliquant cette Figurine. Si cette Posture est choisie, l'Initiative en Combat de la Figurine adverse en Défi est fixée à « 1 » jusqu'à la fin de cette Étape de Frappe.",
          },
        ],
      },
      {
        titre: "Réaction Avancée",
        paragraphes: [
          {
            texte:
              "Le Joueur en Contrôle d'Unités composées uniquement de Figurines qui ont le Trait Alpha Legion peuvent effectuer la Réaction Avancée suivante, dépensant des Points de Réactions pour cela :",
          },
          { texte: "De la Poudre aux Yeux", style: "bold" },
          {
            texte:
              "Cette Réaction change le Nombre Cible des Jets de Touche de Précision faits contre l'Unité Réactive.",
            style: "bold",
          },
          {
            texte:
              "Déclencheur : Le Joueur Réactif peut déclarer cette Réaction De la Poudre aux Yeux à la Phase de Tir, à l'Étape 3 de la séquence d'Attaque de Tir de n'importe quelle Attaque de Tir faite par le Joueur Actif qui cible une Unité composée uniquement de Figurines qui ont le Trait Alpha Legion.",
          },
          {
            texte:
              "Coût : Le Joueur Réactif doit dépenser 1 point de son Attribution de Réactions pour déclarer cette Réaction Avancée De la Poudre aux Yeux, coût à payer dès la déclaration.",
          },
          {
            texte:
              "Cible : L'Unité Cible est toujours l'Unité dont l'Attaque de Tir déclenche la Réaction. Le Joueur Réactif est toujours l'Unité déclarée comme cible de l'Attaque de Tir qui déclenche la Réaction.",
          },
          {
            texte:
              "Processus : Une fois cette Réaction déclarée, jusqu'à ce que l'Attaque de Tir de l'Unité Cible soit résolue, les Attaques de Tir ayant la Règle Spéciale Précision (X) n'infligent les effets de celle-ci que sur un Jet de Touche de 6+.",
          },
        ],
      },
    ],
  },
};

/* ----------------------------------------------------------
   AVANTAGES PRINCIPAUX (p. 283 + Légions Corrompues)
   Un Avantage est choisi pour chaque Case Principale OCCUPÉE.
   `condition` est vérifiée par js/organigramme.js :
   - sergent      : l'unité doit inclure le Sous-type Sergent,
   - etatMajor    : l'unité doit inclure le Sous-type État-major,
   - caseEM       : réservé aux Cases d'État-major,
   - unParDetachement : sélectionnable une seule fois par détachement,
   - renegat      : Allégeance Renégate uniquement (Vrais Croyants).
   - roleRequis   : réservé aux Cases de ce Rôle Tactique exact (ex :
                 Suprématie Martiale, réservé aux Cases d'Élite),
   - traitRequis  : l'unité doit avoir ce Trait (ex : Suprématie
                 Martiale et Assaut Zélé, réservés aux Traits de
                 Légion Sons of Horus / Word Bearers) — combiné à
                 `roleRequis` ci-dessus, approxime « composée
                 uniquement de Figurines qui ont le Trait X » : le
                 site ne modélise que le Trait au niveau de l'Unité,
                 pas figurine par figurine. Une unité générique (Trait
                 « [Legiones Astartes] », ex : Centurion) compte comme
                 ayant le Trait de la Légion choisie pour la partie
                 (voir avantagesPossibles, js/organigramme.js).
   - uniteRequise : réservé à certaines Figurines précises, par id
                 d'UNITES (js/unites-data.js) et éventuellement indice
                 de variante si une seule variante est concernée (ex :
                 Résistance Anormale, réservé au Centurion et au
                 Centurion Cataphractii — PAS au Centurion Tartaros,
                 autre variante de la même unité).
   - unParArmee   : sélectionnable une seule fois par ARMÉE (tous
                 détachements confondus), à la différence de
                 `unParDetachement` ci-dessus.
   - typesRequis  : [Types] — l'unité doit inclure AU MOINS UN des
                 Types listés (logique OU), vérifié comme
                 `sergent`/`etatMajor` ci-dessus via aSousType (ex :
                 Les Défavorisés, Iron Warriors, réservé au seul Type
                 Infanterie ; Les Sagyar Mazan, White Scars, qui
                 acceptent Infanterie OU Cavalerie).
   - ajouteCase   : ajoute une case au détachement (tout Rôle Tactique
                 sauf QG, État-major, Seigneur de Guerre et Seigneurs
                 des Batailles — voir ROLES_INTERDITS_LOGISTIQUE), comme
                 Bénéfice Logistique et Le Salaire de la Traîtrise (une
                 seule case ajoutée à la fois par détachement, quel que
                 soit l'Avantage qui l'a créée — voir changerAvantage,
                 js/organigramme.js).
   - rolesCaseAjoutee : [clés de ROLES_TACTIQUES] — restreint le Rôle
                 Tactique proposé pour la case ajoutée par `ajouteCase`
                 ci-dessus à cette liste au lieu de « tout Rôle sauf
                 QG/État-major/Seigneurs » (ex : Bardé de Fer, Iron
                 Hands, limité à Engins de Guerre ; Logisticae,
                 Ultramarines, limité à Transport/Transport Lourd). Un
                 seul Rôle dans la liste : préaffecté directement, sans
                 passer par le menu déroulant (voir changerAvantage,
                 construireCarteDetachement dans js/organigramme.js).
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
    ajouteCase: true,
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
  /* --- Arsenal des Sons of Horus (XVIe Légion), page « Suprématie
     Martiale » (voir js/unites-data.js, unités réservées à cette
     Légion). --- */
  {
    id: "supremacie-martiale",
    nom: "Suprématie Martiale (Sons of Horus)",
    roleRequis: "Elite",
    traitRequis: "Sons of Horus",
    texte:
      "Réservé à une Unité de Rôle Tactique Élite composée uniquement de Figurines ayant le Trait Sons of Horus : une Figurine de l'Unité gagne le Sous-type Champion et la Règle Spéciale Atout du Duelliste (1).",
  },
  /* --- Arsenal des Word Bearers (XVIIe Légion), page « Assaut Zélé »
     (voir js/unites-data.js, unités réservées à cette Légion). --- */
  {
    id: "assaut-zele",
    nom: "Assaut Zélé (Word Bearers)",
    roleRequis: "Troupes",
    traitRequis: "Word Bearers",
    texte:
      "Réservé à une Unité de Rôle Tactique Troupes composée uniquement de Figurines ayant le Trait Word Bearers : les Figurines de l'Unité gagnent la Règle Spéciale Impact (F).",
  },
  /* --- Arsenal des Thousand Sons (XVe Légion), page « Déplacement
     Télékinétique » (voir js/unites-data.js, unités réservées à cette
     Légion). --- */
  {
    id: "deplacement-telekinetique",
    nom: "Déplacement Télékinétique (Thousand Sons)",
    roleRequis: "Troupes",
    traitRequis: "Thousand Sons",
    texte:
      "Réservé à une Unité de Rôle Tactique Troupes composée uniquement de Figurines ayant le Trait Thousand Sons : les Figurines de l'Unité gagnent la Règle Spéciale Déplacement Télékinétique (quand l'Unité Fonce, un Test de Volonté réussi lui donne le Sous-type Antigrav et la Règle Spéciale Mouvement à Couvert jusqu'à la fin de la Phase de Mouvement ; s'il est raté, l'Unité ne peut pas se Déplacer ce tour-ci).",
  },
  /* --- Arsenal de la Death Guard (XIVe Légion), page « Résistance
     Anormale » : réservé au Centurion et au Centurion Cataphractii
     (unités génériques, voir js/unites-data.js, id "centurion" et
     "centurion-terminator" — SEULE la variante Cataphractii de cette
     dernière est concernée, pas le Centurion Tartaros). --- */
  {
    id: "resistance-anormale",
    nom: "Résistance Anormale (Death Guard)",
    uniteRequise: [{ id: "centurion" }, { id: "centurion-terminator", variante: 0 }],
    traitRequis: "Death Guard",
    unParArmee: true,
    texte:
      "Réservé à une Figurine de Centurion ou de Centurion Cataphractii ayant le Trait Death Guard : elle bénéficie d'un Modificateur de +1 à la Valeur de Base de sa Caractéristique de Points de Vie et gagne la Règle Spéciale Guerrier Éternel (2). Une seule fois par Armée.",
  },
  /* --- Arsenal de l'Alpha Legion (XXe Légion), page « Le Salaire de
     la Traîtrise » (voir js/unites-data.js, unités réservées à cette
     Légion). Simplification : le livre autorise cet Avantage plusieurs
     fois par détachement (une case ajoutée par sélection) ; le site ne
     modélise qu'une case ajoutée par détachement à la fois, comme pour
     le Bénéfice Logistique (voir `ajouteCase`, changerAvantage dans
     js/organigramme.js). Les conditions d'éligibilité de la Figurine
     qui vient occuper la case ajoutée (issue de la Liste d'Armée des
     Legiones Astartes, sans Trait de Faction Alpha Legion, sans
     Sous-type Unique) et le remplacement de son Trait de Faction par
     « Alpha Legion » ne sont pas non plus vérifiés par le site : à
     appliquer manuellement. --- */
  {
    id: "salaire-traitrise",
    nom: "Le Salaire de la Traîtrise (Alpha Legion)",
    roleRequis: "État-major",
    traitRequis: "Alpha Legion",
    unParDetachement: true,
    ajouteCase: true,
    texte:
      "Réservé à une Unité de Rôle Tactique État-major composée uniquement de Figurines ayant le Trait Alpha Legion : ajoute une case au détachement, de n'importe quel Rôle Tactique sauf Quartier Général, État-major, Seigneur de Guerre et Seigneurs des Batailles. La Figurine qui occupe cette case doit être issue de la Liste d'Armée des Legiones Astartes, ne pas avoir le Trait de Faction Alpha Legion et ne pas inclure de Sous-type Unique ; toutes les Figurines de son Unité remplacent alors leur Trait de Faction par « Alpha Legion ».",
  },
  /* --- Arsenal des Iron Warriors (IVe Légion), page « Les
     Défavorisés » (voir js/unites-data.js, unités réservées à cette
     Légion). --- */
  {
    id: "les-defavorises",
    nom: "Les Défavorisés (Iron Warriors)",
    typesRequis: ["Infanterie"],
    traitRequis: "Iron Warriors",
    texte:
      "Réservé à une Unité de Type Infanterie composée uniquement de Figurines ayant le Trait Iron Warriors : toutes les Figurines de l'Unité gagnent la Règle Spéciale Sacrifiable (1).",
  },
  /* --- Arsenal des Night Lords (VIIIe Légion), page « Atramentar »
     (voir js/unites-data.js, unités réservées à cette Légion). Liste
     des Figurines admises RECONSTITUÉE : le passage transcrit de la
     photo répète deux fois « Escouade Terminator Tartaros » et
     n'évoque qu'une seule fois la variante Cataphractii du Centurion
     Terminator (probablement une erreur d'OCR/de mise en page sur la
     photo). Reconstitution retenue, par symétrie avec les Escouades
     d'État-major Terminator Cataphractii/Tartaros déjà existantes
     (js/unites-data.js, id "centurion-terminator" et "escouade-etat-
     major-cataphractii"/"escouade-etat-major-tartaros") : les deux
     variantes du Centurion Terminator ET les deux Escouades d'État-
     major Terminator sont admises. À corriger contre le livre en cas
     de doute. --- */
  {
    id: "atramentar",
    nom: "Atramentar (Night Lords)",
    uniteRequise: [
      { id: "centurion-terminator", variante: 0 },
      { id: "centurion-terminator", variante: 1 },
      { id: "escouade-etat-major-cataphractii" },
      { id: "escouade-etat-major-tartaros" },
    ],
    traitRequis: "Night Lords",
    texte:
      "Réservé à une Figurine de Centurion en Armure Terminator (Cataphractii ou Tartaros) ou d'Escouade d'État-major Terminator (Cataphractii ou Tartaros) ayant le Trait Night Lords : les Figurines de l'Unité gagnent les Règles Spéciales Frappe en Profondeur et Impact (1).",
  },
  /* --- Arsenal des Emperor's Children (IIIe Légion), page « Garde
     Phénix » (voir js/unites-data.js, unités réservées à cette
     Légion). L'échange gratuit de combi-bolter et d'arme énergétique
     contre une lance énergétique Phénix n'est pas appliqué
     automatiquement par le site (comme pour les autres Avantages qui
     modifient l'équipement d'une Unité) : à faire manuellement sur la
     fiche de la Figurine concernée. --- */
  {
    id: "garde-phenix",
    nom: "Garde Phénix (Emperor's Children)",
    uniteRequise: [{ id: "centurion-terminator", variante: 1 }],
    traitRequis: "Emperor's Children",
    texte:
      "Réservé à une Figurine de Centurion Tartaros ayant le Trait Emperor's Children : elle doit échanger gratuitement son combi-bolter et son arme énergétique contre une lance énergétique Phénix, et gagne la Règle Spéciale Adresse Inégalée.",
  },
  /* --- Arsenal des World Eaters (XIIe Légion), page « Enchaînés »
     (voir js/unites-data.js, unités réservées à cette Légion). Le
     livre demande de choisir une SECONDE Unité d'État-major de
     l'Armée (hors Case Principale) pour recevoir l'autre moitié de
     l'effet : comme les autres Avantages de ce type (ex : Garde
     Phénix, ci-dessus), ce choix et l'application de la Règle
     Spéciale Frères de Chaîne aux Figurines concernées ne sont pas
     automatisés par le site — à gérer manuellement sur les fiches. --- */
  {
    id: "enchaines",
    nom: "Enchaînés (World Eaters)",
    roleRequis: "État-major",
    traitRequis: "World Eaters",
    unParArmee: true,
    texte:
      "Réservé à une Unité de Rôle Tactique État-major composée uniquement de Figurines ayant le Trait World Eaters, sélectionnable une seule fois par Armée : le joueur en Contrôle doit choisir une autre Unité de Rôle Tactique État-major de son Armée ; une Figurine de chacune des deux Unités gagne la Règle Spéciale Frères de Chaîne (tant qu'elle est en Cohésion d'Unité — ou en Défi impliqué dans le même Combat — avec l'autre Figurine ayant cette Règle Spéciale, elle gagne un bonus de +1 aux Jets de Touche faits à la Phase d'Assaut).",
  },
  /* --- Arsenal des Dark Angels (Ire Légion), page « Paladin de
     l'Hekatonystika » (voir js/unites-data.js, id "centurion" —
     variantes 0 « Centurion » et 1 « Centurion à Réacteurs », toutes
     deux admises par le texte du livre). L'échange d'arme et le gain
     de Règle Spéciale ne sont pas appliqués automatiquement par le
     site (comme Garde Phénix, ci-dessus) : à faire manuellement sur
     la fiche de la Figurine concernée.
     HYPOTHÈSE DE TRANSCRIPTION : le nom de la Règle Spéciale gagnée
     est manuscrit (annotation au crayon) sur la photo du livre et
     retranscrit ici sous toutes réserves (« Parangon de l'Ordre ») —
     à corriger contre le livre en cas de doute. --- */
  {
    id: "paladin-hekatonystika",
    nom: "Paladin de l'Hekatonystika (Dark Angels)",
    uniteRequise: [
      { id: "centurion", variante: 0 },
      { id: "centurion", variante: 1 },
    ],
    traitRequis: "Dark Angels",
    unParArmee: true,
    texte:
      "Réservé à une Figurine de Centurion (à pied ou à Réacteurs) ayant le Trait Dark Angels, sélectionnable une seule fois par Armée : la Valeur de Base de sa Capacité de Combat est modifiée de +1, elle doit échanger gratuitement son bolter contre un espadon terranique, et gagne la Règle Spéciale Parangon de l'Ordre (p. 137).",
  },
  /* --- Arsenal des Imperial Fists (VIIe Légion), page « Castellan »
     (voir js/unites-data.js, id "centurion", variante 0 seulement — le
     livre dit « une Figurine de Centurion » sans mentionner la
     variante à Réacteurs, contrairement à Paladin de l'Hekatonystika
     ci-dessus). Le gain de scanner augure et l'échange d'arme ne sont
     pas appliqués automatiquement par le site : à faire manuellement
     sur la fiche de la Figurine concernée. */
  {
    id: "castellan",
    nom: "Castellan (Imperial Fists)",
    uniteRequise: [{ id: "centurion", variante: 0 }],
    traitRequis: "Imperial Fists",
    texte:
      "Réservé à une Figurine de Centurion ayant le Trait Imperial Fists : elle gagne un scanner augure, ne peut choisir aucune des options de Centurion listées et doit à la place échanger gratuitement son bolter contre un Bolter lourd, un Autocanon ou un Canon d'Assaut Iliastus (p. 188).",
  },
  /* --- Arsenal des Iron Hands (Xe Légion), page « Bardé de Fer »
     (voir js/unites-data.js, unités réservées à cette Légion).
     `rolesCaseAjoutee` (voir js/organigramme.js, changerAvantage)
     restreint la case ajoutée par `ajouteCase` au seul Rôle Tactique
     Engin de Guerre, préaffecté directement (liste à un seul élément)
     sans passer par le menu déroulant habituel de Bénéfice
     Logistique/Le Salaire de la Traîtrise. Le gain du Sous-type
     Champion n'est pas appliqué automatiquement par le site : à cocher
     manuellement sur la fiche de l'Unité concernée. --- */
  {
    id: "barde-de-fer",
    nom: "Bardé de Fer (Iron Hands)",
    roleRequis: "État-major",
    traitRequis: "Iron Hands",
    unParArmee: true,
    ajouteCase: true,
    rolesCaseAjoutee: ["Engins de Guerre"],
    texte:
      "Réservé à une Unité de Rôle Tactique État-major composée uniquement de Figurines ayant le Trait Iron Hands, sélectionnable une seule fois par Armée : ajoute une Case de Rôle Tactique Engin de Guerre au Détachement. Une Unité sélectionnée pour occuper cette Case gagne le Sous-type Champion si elle ne l'avait pas déjà.",
  },
  /* --- Arsenal de la Raven Guard (XIXe Légion), page « Spectres »
     (voir js/unites-data.js, unités réservées à cette Légion). --- */
  {
    id: "spectres",
    nom: "Spectres (Raven Guard)",
    roleRequis: "Troupes",
    traitRequis: "Raven Guard",
    texte:
      "Réservé à une Unité de Rôle Tactique Troupes composée uniquement de Figurines ayant le Trait Raven Guard : les Figurines de l'Unité gagnent la Règle Spéciale Spectres (après avoir Foncé, un Test de Volonté réussi rend Désordonnées les Charges qui ciblent l'Unité à la Phase d'Assaut du Tour de Joueur suivant ; en cas d'échec, l'Unité gagne le Statut Tactique Sonnée à la place).",
  },
  /* --- Arsenal des Space Wolves (VIe Légion), page « Thegn de Meute »
     (voir js/unites-data.js, id "optae", unité générique — un seul
     Rôle Tactique et une seule variante, `variante` omis). L'échange
     d'arme n'est pas appliqué automatiquement par le site : à faire
     manuellement sur la fiche de la Figurine concernée. --- */
  {
    id: "thegn-de-meute",
    nom: "Thegn de Meute (Space Wolves)",
    uniteRequise: [{ id: "optae" }],
    traitRequis: "Space Wolves",
    texte:
      "Réservé à une Figurine d'Optae ayant le Trait Space Wolves : les Valeurs de Base de ses Caractéristiques d'Attaques et de Capacité de Combat sont modifiées de +1, et elle peut échanger gratuitement son épée énergétique contre une épée de givre ou une hache de givre, ou l'échanger contre une griffe de givre pour +5 Points.",
  },
  /* --- Arsenal des Ultramarines (XIIIe Légion), page « Logisticae »
     (voir js/unites-data.js, unités réservées à cette Légion).
     `rolesCaseAjoutee` (voir js/organigramme.js, changerAvantage)
     restreint la case ajoutée par `ajouteCase` à Transport ou
     Transport Lourd (au choix du joueur, menu déroulant). Le
     modificateur de Capacité de Transport n'est pas appliqué
     automatiquement par le site : à ajuster manuellement sur la fiche
     de l'Unité concernée. --- */
  {
    id: "logisticae",
    nom: "Logisticae (Ultramarines)",
    roleRequis: "État-major",
    traitRequis: "Ultramarines",
    ajouteCase: true,
    rolesCaseAjoutee: ["Transports", "Transports Lourds"],
    texte:
      "Réservé à une Unité de Rôle Tactique État-major composée uniquement de Figurines ayant le Trait Ultramarines : ajoute une Case de Rôle Tactique Transport ou Transport Lourd (au choix) au Détachement. La Capacité de Transport d'une Unité sélectionnée pour occuper cette Case est modifiée de +2.",
  },
  /* --- Arsenal des Blood Angels (IXe Légion), page « Revenants »
     (voir js/unites-data.js, unités réservées à cette Légion). Aucun
     Rôle Tactique précis n'est exigé par le livre (contrairement aux
     autres Avantages de ce type) : n'importe quelle Case Principale
     convient, d'où l'absence de `roleRequis` ici. --- */
  {
    id: "revenants",
    nom: "Revenants (Blood Angels)",
    traitRequis: "Blood Angels",
    texte:
      "Réservé à une Unité composée uniquement de Figurines ayant le Trait Blood Angels, sélectionnée pour occuper n'importe quelle Case Principale d'Organigramme de Force : les Figurines de l'Unité gagnent la Règle Spéciale Peur (1).",
  },
  /* --- Arsenal des Salamanders (XVIIIe Légion), page « Le Devoir
     Avant la Mort » (voir js/unites-data.js, unités réservées à cette
     Légion). --- */
  {
    id: "devoir-avant-la-mort",
    nom: "Le Devoir Avant la Mort (Salamanders)",
    roleRequis: "Troupes",
    traitRequis: "Salamanders",
    texte:
      "Réservé à une Unité de Rôle Tactique Troupes composée uniquement de Figurines ayant le Trait Salamanders : les Figurines de l'Unité gagnent la Règle Spéciale Insensible à la Douleur (6+).",
  },
  /* --- Arsenal des White Scars (Ve Légion), page « Les Sagyar Mazan »
     (voir js/unites-data.js, unités réservées à cette Légion). Premier
     Avantage de ce type conditionné par le Type de Figurine plutôt que
     par le Rôle Tactique (`typesRequis`, logique OU Infanterie/
     Cavalerie), d'où l'absence de `roleRequis` ici. --- */
  {
    id: "les-sagyar-mazan",
    nom: "Les Sagyar Mazan (White Scars)",
    typesRequis: ["Infanterie", "Cavalerie"],
    traitRequis: "White Scars",
    texte:
      "Réservé à une Unité composée uniquement de Figurines ayant le Trait White Scars et de Type Infanterie ou Cavalerie : toutes les Figurines de l'Unité gagnent la Règle Spéciale Sacrifiable (2).",
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
