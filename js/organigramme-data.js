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
     calculerCredits). */
  {
    id: "confrerie-du-phenix",
    nom: "Confrérie du Phénix",
    famille: "additionnel",
    max: 1,
    pointsMin: 3000,
    requiertRiteDeGuerre: "legio-hereticus-emperors-children",
    requiertUniteArmee: ["fulgrim-transfigure"],
    excluAvec: ["seigneur-guerre"],
    pasDeCredit: true,
    texte:
      "Réservé au Rite de Guerre Legio Hereticus Emperor's Children. Se sélectionne à la place du Détachement de Seigneur de Guerre (l'Armée ne peut pas inclure les deux). Uniquement si la Limite de Points est d'au moins 3000 pts, et nécessite une Unité de Fulgrim Transfiguré dans l'Armée. Les Cases de Quartier Général et d'État-major de ce Détachement ne débloquent aucun Détachement Auxiliaire ou d'Apex supplémentaire.",
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
   - typeInfanterie : l'unité doit inclure le Type Infanterie (ex :
                 Les Défavorisés, Iron Warriors) — vérifié comme
                 `sergent`/`etatMajor` ci-dessus, via aSousType.
   - ajouteCase   : ajoute une case au détachement (tout Rôle Tactique
                 sauf QG, État-major, Seigneur de Guerre et Seigneurs
                 des Batailles — voir ROLES_INTERDITS_LOGISTIQUE), comme
                 Bénéfice Logistique et Le Salaire de la Traîtrise (une
                 seule case ajoutée à la fois par détachement, quel que
                 soit l'Avantage qui l'a créée — voir changerAvantage,
                 js/organigramme.js).
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
    typeInfanterie: true,
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
];

/* Rôles interdits à la case supplémentaire du Bénéfice Logistique
   (p. 283). */
const ROLES_INTERDITS_LOGISTIQUE = [
  "Quartier Général",
  "État-major",
  "Seigneur de Guerre",
  "Seigneurs des Batailles",
];
