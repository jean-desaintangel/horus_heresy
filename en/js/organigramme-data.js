/* ============================================================
   organigramme-data.js — Données de la Sélection d'Armée
   Auteur : Jean · Créé : 2026-07-17
   Rôle   : encode l'Organigramme de Force de Croisade du Livre de
   Règles « l'Âge des Ténèbres » (p. 282-285) et les Détachements
   Auxiliaires propres aux Legiones Astartes (livre d'armée).
   Aucune logique : les données sont consommées par
   js/organigramme.js (page construction-liste.html).
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
     famille   : "principal" | "additionnel" | "auxiliaire" | "apex" |
                 "narratif",
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
     faction   : id FACTIONS (js/organigramme.js) réservant ce type à
                 une seule Faction (ex : Ordinal Titanique, réservé à
                 Legio Titanicus) — entièrement MASQUÉ tant que cette
                 Faction n'est pas choisie dans les paramètres de la
                 partie. Absent = même défaut que les unités sans
                 champ `faction` (js/unites-data.js) : réservé à Legio
                 Astartes (comportement historique de ce fichier, qui
                 ne couvre que les Legiones Astartes en dehors de
                 l'Ordinal Titanique). Vérifié par caseAccepte(),
                 construireAjoutDetachements() et suggestionPourRole()
                 dans js/organigramme.js.
     factionLibre : true — dispense ce type de la vérification de
                 Faction faite par caseAccepte() (accepte des unités de
                 n'importe quelle Faction sur ses Cases) : Détachement
                 de Seigneur des Batailles (« un Titan Legio Titanicus
                 peut prendre place dans un Détachement de Seigneur des
                 Batailles d'une Armée d'une autre Faction », livre
                 d'armée Legio Titanicus) et Détachement Allié — ce
                 dernier porte en réalité sa propre Faction
                 (`factionAlliee` sur l'instance, menu « Faction
                 Alliée » de sa carte, voir js/organigramme.js) :
                 caseAccepte() la vérifie précisément malgré
                 `factionLibre` ici. SANS `faction` posé à côté, ce
                 Détachement reste aussi proposé quelle que soit la
                 Faction choisie (typeDisponiblePourFaction() dans js/
                 organigramme.js) — Seigneur des Batailles, Détachement
                 Allié, Détachement Narratif, Appui Lourd. AVEC `faction`
                 posé à côté (ex : Tercio de Fer, Serre d'Automates,
                 Maisnie Roturière), `faction` reprend la main sur la
                 visibilité : le Détachement reste MASQUÉ hors de sa
                 propre Faction, `factionLibre` ne dispensant plus que
                 caseAccepte() — utile quand seules les CASES doivent
                 accepter une autre Liste d'Armée (Unités Mechanicum/
                 Solar Auxilia), pas le Détachement lui-même.
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
     requiertMaisonnee : "mechanicum" | "mendicus" | "imperialis" —
                 voie de déblocage ALTERNATIVE à `requiertAvantage`
                 (livre d'armée Chevaliers Questoris, Paradigmes de
                 Maisonnée) : ce Détachement devient accessible même
                 sans l'Avantage Principal de Rang de Maisonnée requis
                 dès qu'un Détachement Principal de Maisonnées de
                 Chevaliers ou un Détachement de Seigneur des Batailles
                 dont la Maisonnée pertinente
                 (maisonneePertinentePourDetachement(), js/
                 organigramme.js) est celle-ci contient au moins une
                 Figurine de Sous-type Chevalier — vérifié par
                 detachementDebloque() (js/organigramme.js), qui
                 remplace l'ancien test `requiertAvantage` nu aux 3
                 emplacements où il était dupliqué (disponibilite,
                 validerArmee, retirerDetachementsAvantageInvalide).
                 Toujours posé À CÔTÉ de `requiertAvantage` (jamais
                 seul), les deux voies restant valides en parallèle
                 (ex : Serre d'Automates, débloquée par Précepteur OU
                 par la Maisonnée Mechanicum).
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
     requiertDoctrineCohorte : id de DOCTRINES_DE_COHORTE qui doit être
                 choisi dans les paramètres de la partie (menu
                 « Doctrine de Cohorte », Faction Solar Auxilia
                 uniquement) — même mécanique de déblocage/grisage que
                 `requiertAllegeance` (ex : Tercio de Fer, débloqué par
                 la Doctrine de Cohorte de Fer sans Case d'État-major à
                 occuper, contrairement aux 5 autres Tercios).
     parTypeDetachement : id de TYPES_DETACHEMENTS — Détachement
                 Auxiliaire accordé « pour chaque » Détachement de ce
                 type présent dans l'Armée, SANS consommer de crédit
                 Auxiliaire (aucune Case d'État-major à remplir) et lié
                 au même Parent que lui (ex : Tercio Hilote, un par
                 Tercio Veletaris avec la Doctrine de Cohorte Oblitum) —
                 vérifié par liesRestants()/disponibilite()/
                 validerArmee() dans js/organigramme.js.
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
     legionLibre : true — dispense ce type de la vérification de
                 Légion faite pour les unités réservées (champ
                 `legion`, js/unites-data.js) : accepte n'importe quelle
                 Légion sur n'importe quelle Case, quelle que soit la
                 Légion choisie dans les paramètres de la partie
                 (vérifié par caseAccepte() dans js/organigramme.js —
                 seul le Détachement Narratif l'utilise à ce jour).
     exempteLimite : true — les Unités placées dans ce Détachement ne
                 comptent ni dans la Limite de Points de la partie
                 (coutTotalArmee()), ni dans le quota combiné Seigneur
                 de Guerre + Seigneur des Batailles (coutSeigneurs()),
                 ni dans la restriction « aucun Seigneur de Guerre sous
                 3000 pts » (validerArmee(), js/organigramme.js) : un
                 pur bac à sable sans impact sur le budget de la
                 partie (Détachement Narratif).
     casesLibres : true — ce Détachement démarre sans Case (`cases: []`
                 ci-dessous) et le joueur en ajoute/retire librement
                 depuis sa carte (bouton « + Ajouter une case »,
                 construireDetachementDOM() dans js/organigramme.js),
                 chacune avec un Rôle Tactique choisi une à une parmi
                 TOUS les Rôles (aucune exclusion, contrairement aux
                 Cases ajoutées par l'Avantage Bénéfice Logistique) —
                 seul le Détachement Narratif l'utilise à ce jour.
   }
   ============================================================ */

/* ----------------------------------------------------------
   RÔLES TACTIQUES (Livre de Règles p. 285)
   Clé = categorie de unites-data.js ; abrev = badge affiché dans
   l'organigramme (les icônes du livre sont la propriété de Games
   Workshop : on utilise des badges textuels équivalents).
   ---------------------------------------------------------- */
const ROLES_TACTIQUES = {
  "Warlord": {
    livre: "Warlord",
    abrev: "SG",
    texte:
      "The 18 Primarchs and a handful of mighty warriors. No army may spend more than 25% of its Points Limit on the Warlord and Lord of War Battlefield Roles (combined allowance).",
  },
  "High Command": {
    livre: "High Command",
    abrev: "QG",
    texte: "The highest-ranking officers of an army.",
  },
  "Command": {
    livre: "Command",
    abrev: "CM",
    texte: "The army's line officers.",
  },
  "Retinues": {
    livre: "Retinue",
    abrev: "SU",
    texte: "The warriors charged with protecting the army's officers.",
  },
  "Elites": {
    livre: "Elites",
    abrev: "EL",
    texte: "The most formidable warriors of an army.",
  },
  "War-engines": {
    livre: "War-engine",
    abrev: "EG",
    texte:
      "Legiones Astartes Dreadnoughts and other similar war machines.",
  },
  "Troops": {
    livre: "Troops",
    abrev: "TR",
    texte:
      "The line troops who hold the field and allow generals to achieve victory.",
  },
  "Support": {
    livre: "Support",
    abrev: "AP",
    texte:
      "Support troops who help other warriors accomplish their mission.",
  },
  "Lords of War": {
    livre: "Lord of War",
    abrev: "SB",
    texte:
      "The largest and most powerful units of an army. Shares the same combined 25% allowance as the Warlord.",
  },
  "Transports": {
    livre: "Transport",
    abrev: "T",
    texte: "The units charged with ferrying vulnerable troops.",
  },
  "Heavy Assault": {
    livre: "Heavy Assault",
    abrev: "AL",
    texte:
      "Heavy assault units charged with breaking enemy lines.",
  },
  "Heavy Transports": {
    livre: "Heavy Transport",
    abrev: "TL",
    texte: "The heaviest and best-protected transports of an army.",
  },
  "Armour": {
    livre: "Armour",
    abrev: "BL",
    texte:
      "Armoured vehicles equipped with the most powerful weapons that can be fielded on the battlefield.",
  },
  "Recon": {
    livre: "Recon",
    abrev: "RC",
    texte:
      "Light infantry and cavalry charged with harassing, pursuing and tracking the enemy.",
  },
  "Fast Attack": {
    livre: "Fast Attack",
    abrev: "AR",
    texte:
      "Fast units able to strike the enemy and fall back at great speed.",
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
    nom: "Crusade Primary Detachment",
    famille: "principal",
    max: 1,
    texte:
      "Mandatory and unique. Each filled High Command Slot unlocks 1 Auxiliary OR Apex Detachment; each filled Command Slot unlocks 1 Auxiliary Detachment.",
    cases: [
      _caseOrga("High Command"),
      _caseOrga("Command", true),
      _caseOrga("Command"),
      _caseOrga("Command"),
      _caseOrga("Troops", true),
      _caseOrga("Troops"),
      _caseOrga("Troops"),
      _caseOrga("Troops"),
      _caseOrga("Transports"),
      _caseOrga("Transports"),
      _caseOrga("Transports"),
      _caseOrga("Transports"),
    ],
  },

  /* ---------- Détachements Principaux alternatifs (Journal Tactica :
     Zone Mortalis, p. 285, « Zone Mortalis Primary Detachments ») :
     facultatifs, sélectionnables via le menu « Choix de Détachement
     Principal » des paramètres de la partie (toute Faction sauf Legio
     Titanicus, y compris Chevaliers Questoris — voir
     idDetachementPrincipal(), js/organigramme.js) à la place du
     Détachement Principal de Croisade ci-dessus. Le livre les réserve
     aux parties jouées sur une Mission Zone Mortalis — condition non
     modélisée sur ce site (aucune notion de type de mission), donc
     laissée au joueur de vérifier lui-même. Compositions confirmées
     par le proprio (2026-08-02), corrigeant une première lecture
     approximative des icônes de la photo. Une seule Case Principale
     par Chart (jamais la Case État-major, à la différence du
     Détachement Principal de Croisade) : la 1ʳᵉ Case du dernier
     groupe listé dans chaque composition. */
  {
    id: "zone-mortalis-strike-force",
    nom: "Zone Mortalis Strike Force",
    famille: "principal",
    texte:
      "Optional alternative to the Crusade Primary Detachment, normally reserved for Zone Mortalis Missions (not checked by this site). 1 High Command Slot, 1 Command Slot, 2 Heavy Assault Slots, 4 Troops Slots (Prime Slot).",
    cases: [
      _caseOrga("High Command"),
      _caseOrga("Command"),
      _caseOrga("Heavy Assault"),
      _caseOrga("Heavy Assault"),
      _caseOrga("Troops", true),
      _caseOrga("Troops"),
      _caseOrga("Troops"),
      _caseOrga("Troops"),
    ],
  },
  {
    id: "zone-mortalis-bulwark",
    nom: "Zone Mortalis Bulwark",
    famille: "principal",
    texte:
      "Optional alternative to the Crusade Primary Detachment, normally reserved for Zone Mortalis Missions (not checked by this site). 1 High Command Slot, 1 Command Slot, 2 War-engines Slots, 2 Support Slots, 2 Troops Slots (Prime Slot).",
    cases: [
      _caseOrga("High Command"),
      _caseOrga("Command"),
      _caseOrga("War-engines"),
      _caseOrga("War-engines"),
      _caseOrga("Support"),
      _caseOrga("Support"),
      _caseOrga("Troops", true),
      _caseOrga("Troops"),
    ],
  },
  {
    id: "zone-mortalis-linebreaker",
    nom: "Zone Mortalis Linebreaker",
    famille: "principal",
    texte:
      "Optional alternative to the Crusade Primary Detachment, normally reserved for Zone Mortalis Missions (not checked by this site). 1 High Command Slot, 1 Command Slot, 2 Heavy Assault Slots, 2 Troops Slots, 2 Elites Slots (Prime Slot).",
    cases: [
      _caseOrga("High Command"),
      _caseOrga("Command"),
      _caseOrga("Heavy Assault"),
      _caseOrga("Heavy Assault"),
      _caseOrga("Troops"),
      _caseOrga("Troops"),
      _caseOrga("Elites", true),
      _caseOrga("Elites"),
    ],
  },

  /* ---------- Détachement Principal de Legio Titanicus ----------
     Livre d'armée Legio Titanicus. Deuxième façon (avec le Titan
     isolé en Détachement de Seigneur des Batailles, voir plus bas)
     d'aligner des Unités de la Liste d'Armée de Legio Titanicus :
     1 Seigneur des Batailles, 1 État-major, 4 Troupes, 4 Transports
     Lourds — masqué tant que la Faction Legio Titanicus n'est pas
     choisie (`faction`, voir MODÈLE DE DONNÉES en tête de fichier).
     Seules des Unités au Trait de Faction Legio Titanicus peuvent
     occuper ses Cases (appliqué par caseAccepte() dans
     js/organigramme.js, via le champ `faction` des unités de
     js/unites-data.js) ; toute autre Faction n'y entre que par un
     Détachement Allié.
     Ignore le quota combiné Seigneur de Guerre + Seigneur des
     Batailles (25 % de la Limite de Points) : un Titan peut à lui
     seul consommer tous les Points disponibles (appliqué par
     validerArmee() dans js/organigramme.js). */
  {
    id: "ordinal-titanique",
    nom: "Titanic Ordinal",
    famille: "principal",
    faction: "legio-titanicus",
    max: 1,
    texte:
      "Mandatory and unique for a Legio Titanicus Army. 1 Lord of War Slot, 1 Command Slot, 4 Troops Slots, 4 Heavy Transports Slots — all reserved for the Legio Titanicus Faction Trait. Ignores the 25% Warlord + Lord of War allowance: a single Lord of War choice may use up all of the Army's Points. A Lord of War Detachment may be added as well, but may then include no Legio Titanicus Units.",
    // Pas de Case Principale (choix de Jean) : contrairement au
    // Détachement Principal de Croisade, l'Ordinal Titanique n'a pas
    // de symbole étoilé sur son organigramme.
    cases: [
      _caseOrga("Lords of War"),
      _caseOrga("Command"),
      _caseOrga("Troops"),
      _caseOrga("Troops"),
      _caseOrga("Troops"),
      _caseOrga("Troops"),
      _caseOrga("Heavy Transports"),
      _caseOrga("Heavy Transports"),
      _caseOrga("Heavy Transports"),
      _caseOrga("Heavy Transports"),
    ],
  },

  /* ---------- Détachement Principal de Maisonnées de Chevaliers ----------
     Livre d'armée Chevaliers Questoris. 4 Cases Seigneurs des Batailles,
     TOUTES Cases Principales (aucune distinction QG/État-major/Troupes,
     contrairement au Détachement Principal de Croisade) — masqué tant
     que la Faction Chevaliers Questoris n'est pas choisie (`faction`).
     Les Unités qui y occupent une Case Principale ne peuvent recevoir
     que des Avantages Principaux de Rang de Maisonnée (avantagesAutorises,
     voir AVANTAGES_PRINCIPAUX plus bas), et l'Armée ne peut inclure ni
     Détachement Allié, ni Détachement de Seigneur de Guerre, ni
     Détachement de Seigneur des Batailles (excluAvec, déclaré aussi sur
     ces trois types ci-dessous pour une exclusion symétrique — voir
     MODÈLE DE DONNÉES). N'ayant aucune Case Quartier Général/État-major,
     il ne débloque naturellement aucun Détachement Auxiliaire/d'Apex :
     seuls les Détachements Additionnels de Maisonnées de Chevaliers
     ci-dessous (débloqués par un Avantage Principal de Rang de Maisonnée
     précis, pas par un crédit) permettent d'agrandir l'Armée. */
  {
    id: "maisonnees-chevaliers",
    nom: "Knight Households Primary Detachment",
    famille: "principal",
    faction: "chevaliers-questoris",
    max: 1,
    excluAvec: ["seigneur-guerre", "seigneur-batailles", "allie"],
    avantagesAutorises: [
      "preux-martial",
      "precepteur",
      "uhlan",
      "auctellier",
      "endeuilleur",
      "preux-implacable",
      "senechal",
      "seigneur-preux",
      "arbaletrier",
      "preux-aspirant",
    ],
    texte:
      "Mandatory and unique for a Questoris Knights Army. 4 Lords of War Slots, all Prime: any number of Points in Units of this Battlefield Role, within the limit of available Slots. Units occupying a Prime Slot here may only receive a Household Rank Prime Advantage. Incompatible with an Allied Detachment, a Warlord Detachment or a Lord of War Detachment.",
    cases: [
      _caseOrga("Lords of War", true),
      _caseOrga("Lords of War", true),
      _caseOrga("Lords of War", true),
      _caseOrga("Lords of War", true),
    ],
  },

  /* ---------- Détachements Additionnels (p. 283-284) ---------- */
  {
    id: "seigneur-guerre",
    nom: "Warlord Detachment",
    famille: "additionnel",
    max: 1,
    pointsMin: 3000, // p. 283 : sélectionnable uniquement à 3000 pts et +
    // Confrérie du Phénix (Emperor's Children, Rite de Guerre Legio
    // Hereticus) se sélectionne À LA PLACE de ce Détachement. Le
    // Détachement Principal de Maisonnées de Chevaliers (Chevaliers
    // Questoris) exclut lui aussi ce Détachement (voir plus bas).
    excluAvec: ["confrerie-du-phenix", "maisonnees-chevaliers"],
    texte:
      "Only one per army, same Faction as the Primary Detachment, only if the Points Limit is at least 3000 pts. Must include at least 1 Paragon Type model. Combined Warlord + Lord of War allowance: 25% of the Points Limit.",
    cases: [
      _caseOrga("Warlord"),
      _caseOrga("Retinues"),
      _caseOrga("Heavy Transports"),
    ],
  },
  {
    id: "seigneur-batailles",
    nom: "Lord of War Detachment",
    famille: "additionnel",
    max: 1, // p. 283 : « un seul détachement de Seigneur des Batailles »
    factionLibre: true, // livre d'armée Legio Titanicus, voir MODÈLE DE DONNÉES
    // Exclu par le Détachement Principal de Maisonnées de Chevaliers
    // (Chevaliers Questoris, voir plus bas) : ses propres Cases
    // Seigneurs des Batailles en tiennent déjà lieu.
    excluAvec: ["maisonnees-chevaliers"],
    // Paradigme de Maisonnée Mendicus (livre d'armée Chevaliers
    // Questoris) : une Unité de Sous-type Chevalier occupant une Case
    // de ce Détachement peut recevoir un Avantage Principal de Rang de
    // Maisonnée comme si sa Case était Principale (voir
    // estCasePrincipale, js/organigramme.js, et le menu « Maisonnée »
    // propre à ce Détachement, construireSelectMaisonneeSeigneurBatailles).
    // `avantagesAutorises` (mêmes ids que maisonnees-chevaliers/
    // banniere-appui ci-dessous) n'a d'effet que dans ce cas précis :
    // tant qu'aucune Case n'est Principale (Armée sans Chevalier, ou
    // Maisonnée différente de Mendicus), cette liste ne change rien.
    avantagesAutorises: [
      "preux-martial",
      "precepteur",
      "uhlan",
      "auctellier",
      "endeuilleur",
      "preux-implacable",
      "senechal",
      "seigneur-preux",
      "arbaletrier",
      "preux-aspirant",
    ],
    texte:
      "Only one per army, of any Faction. The total cost of Warlord + Lord of War Role units must not exceed 25% of the Points Limit (combined allowance, rounded up). With the Titanic Ordinal (Primary Detachment) as the Primary Detachment, it may include no Legio Titanicus Units. Mendicus Household Paradigm: Units of the Knight Sub-type occupying a Slot here may each receive a Household Rank Prime Advantage as if their Slot were Prime (this Detachment's “Household” menu).",
    cases: [
      _caseOrga("Lords of War"),
      _caseOrga("Lords of War"),
    ],
  },
  {
    id: "allie",
    nom: "Allied Detachment",
    famille: "additionnel",
    factionLibre: true, // Faction propre (`factionAlliee`), voir commentaire ci-dessous
    // Exclu par le Détachement Principal de Maisonnées de Chevaliers
    // (Chevaliers Questoris, voir plus bas).
    excluAvec: ["maisonnees-chevaliers"],
    texte:
      "Any number. Must have a different Faction from the Primary Detachment (“Allied Faction” menu on its card). As each Legiones Astartes Legion, Questoris Knights Household and Solar Auxilia Cohort Doctrine counts as a separate Faction, the same Faction as the Primary Detachment may still be chosen provided it differs in that subdivision (“Allied Legion”/“Allied Household”/“Allied Cohort Doctrine” menu, depending on the Allied Faction chosen). Likewise, a Mechanicum Army may include a Mechanicum Allied Detachment as long as none of its Units shares a Techno-arcana with a Unit of the Primary Detachment (“Allied Techno-arcana” menu). It necessarily shares the same Allegiance as the rest of the Army (a single Allegiance setting per game). The total cost of allied units may not exceed 50% of the Points Limit (rounded up). Each filled allied Command Slot unlocks 1 Auxiliary Detachment, just like a Command Slot of the Primary Detachment.",
    cases: [
      _caseOrga("Command", true),
      _caseOrga("Command"),
      _caseOrga("Troops"),
      _caseOrga("Troops"),
      _caseOrga("Troops"),
      _caseOrga("Troops"),
    ],
    // Chaque Détachement Allié porte sa propre Faction (`factionAlliee`
    // sur l'instance, menu « Faction Alliée » de sa carte, affiché pour
    // toute Armée — voir js/organigramme.js) : "legio-astartes" par
    // défaut pour une Armée non Legio Titanicus (comme avant l'ajout de
    // ce menu), vide tant qu'elle n'est pas choisie pour une Armée Legio
    // Titanicus. Elle doit différer de la Faction de l'Armée
    // (etat.faction), SAUF pour les trois Factions ayant une subdivision
    // interne dans ce fichier (FACTIONS_AVEC_SOUS_IDENTITE,
    // js/organigramme.js) : à Faction égale, sa propre subdivision doit
    // alors différer de celle de l'Armée — Légion (`legionAlliee` vs
    // etat.legion, Legio Astartes), Maisonnée (`maisonneeAlliee` vs
    // etat.maisonnee, Chevaliers Questoris) ou Doctrine de Cohorte
    // (`doctrineCohorteAlliee` vs etat.doctrineCohorte, Solar Auxilia),
    // chacune comptant comme une Faction distincte. Les unités réservées
    // à une Faction ou une Légion (champs `faction`/`legion`,
    // js/unites-data.js) sont filtrées en conséquence par caseAccepte() :
    // celles de l'Armée pour tout détachement non Allié, celles propres
    // à chaque Détachement Allié pour les siens (Maisonnée/Doctrine ne
    // filtrent aujourd'hui aucune Unité, faute de champ dédié sur les
    // Unités — purement déclaratives, comme au niveau Armée).
    // L'Allégeance (Loyaliste/Renégat), elle, reste un réglage UNIQUE
    // pour toute l'Armée (menu « Allégeance » des paramètres de la
    // partie) : Principal et Alliés la partagent donc automatiquement,
    // ce qui satisfait la règle « même Allégeance » sans champ dédié.
    // Simplification assumée : les Détachements Auxiliaires débloqués
    // par une Case d'État-major alliée piochent dans le même crédit
    // partagé que ceux du Détachement Principal (voir calculerCredits())
    // sans être eux-mêmes rattachés à la Faction/Légion de cet Allié.
  },

  /* ---------- Détachement Narratif ----------
     Détachement optionnel (un seul par Armée, à côté du Détachement
     Principal habituel qui reste inchangé) pour les Armées purement
     narratives : le joueur y ajoute autant de Cases qu'il veut, chacune
     d'un Rôle Tactique choisi librement (`casesLibres`, voir MODÈLE DE
     DONNÉES), sans restriction de Faction (`factionLibre`) ni de Légion
     (`legionLibre`). Ses Unités sont entièrement exemptées de la Limite
     de Points et des quotas (`exempteLimite`) et ses Cases ne
     débloquent aucun Détachement Auxiliaire/d'Apex (`pasDeCredit`) :
     un pur bac à sable, sans le moindre impact sur le reste de
     l'Armée. */
  {
    id: "narratif",
    nom: "Narrative Detachment",
    famille: "narratif",
    factionLibre: true,
    legionLibre: true,
    exempteLimite: true,
    pasDeCredit: true,
    casesLibres: true,
    max: 1,
    texte:
      "Free-form Detachment for purely narrative Armies: add as many Slots as you like, each with a freely chosen Battlefield Role (Command, Troops, Elites, Retinue…), with no Faction or Legion restriction. Units occupying it are entirely exempt from the game's Points Limit and from all allowances (Warlord + Lord of War 25%, Allies 50%); they unlock no Auxiliary or Apex Detachment. Only one per Army.",
    cases: [],
  },

  /* ---------- Détachements Additionnels de Maisonnées de Chevaliers
     (livre d'armée Chevaliers Questoris) ----------
     À la différence des autres Détachements Additionnels ci-dessus, on
     les ajoute quand un Avantage Principal de Rang de Maisonnée précis
     est sélectionné pour une Unité (`requiertAvantage`, même mécanique
     de déblocage/grisage que requiertAllegeance — voir MODÈLE DE
     DONNÉES), plutôt que via un crédit Auxiliaire/Apex ou un seuil de
     Points. Réservés à la Faction Chevaliers Questoris. */
  {
    id: "serre-armigeres",
    nom: "Armiger Talon",
    famille: "additionnel",
    faction: "chevaliers-questoris",
    requiertAvantage: "preux-aspirant",
    requiertMaisonnee: "mendicus",
    texte:
      "Unlocked when a Unit has the Aspirant Gallant Household Rank Prime Advantage, OR unconditionally for an Army with the Mendicus Household Paradigm whose Knight Households Primary Detachment or a Lord of War Detachment contains at least one Model of the Knight Sub-type. 4 War-engines Slots (Armigers).",
    cases: [
      _caseOrga("War-engines"),
      _caseOrga("War-engines"),
      _caseOrga("War-engines"),
      _caseOrga("War-engines"),
    ],
  },
  {
    id: "banniere-appui",
    nom: "Support Banner",
    famille: "additionnel",
    faction: "chevaliers-questoris",
    requiertAvantage: "preux-martial",
    avantagesAutorises: [
      "preux-martial",
      "precepteur",
      "uhlan",
      "auctellier",
      "endeuilleur",
      "preux-implacable",
      "senechal",
      "seigneur-preux",
      "arbaletrier",
      "preux-aspirant",
    ],
    texte:
      "Unlocked when a Unit has the Martial Gallant Household Rank Prime Advantage. 2 Lords of War Slots, all Prime: Units occupying them may only receive a Household Rank Prime Advantage.",
    cases: [
      _caseOrga("Lords of War", true),
      _caseOrga("Lords of War", true),
    ],
  },
  /* Serre d'Automates et Maisnie Roturière puisent respectivement dans
     la Liste d'Armée du Liber Mechanicum (Manipules de Combat Domitar/
     Castellax, Manipule d'Attaque Vorax, Escadron de Stratos Vultarax)
     et dans celle des Solar Auxilia (Liber Auxilia) — désormais toutes
     deux transcrites sur ce site (la Faction "chevaliers-questoris"
     elle-même reste la seule jouable dans les paramètres de la
     partie). Même mécanique que Tercio de Fer plus haut (voir sa note,
     js/organigramme-data.js) : `factionLibre` dispense caseAccepte()
     (js/organigramme.js) de la vérification de Faction, les
     `restrictions` ci-dessous restant seules juges des Unités
     acceptées par Case, et uniteAccessible() (js/unites.js,
     DETACHEMENTS_CROISES) rend ces mêmes Unités sélectionnables dans le
     menu « Unité à ajouter » tant que le Détachement correspondant est
     présent. Imperialis Militia (mentionnée par le livre en plus des
     Solar Auxilia pour Maisnie Roturière) reste elle non transcrite sur
     ce site — gap documenté, sans bloquer le Détachement puisque les
     Solar Auxilia seules couvrent déjà ses 3 Rôles Tactiques. */
  {
    id: "serre-automates",
    nom: "Automata Talon",
    famille: "additionnel",
    faction: "chevaliers-questoris",
    factionLibre: true,
    requiertAvantage: "precepteur",
    requiertMaisonnee: "mechanicum",
    texte:
      "Unlocked when a Unit has the Preceptor Household Rank Prime Advantage, OR unconditionally for an Army with the Mechanicum Household Paradigm whose Knight Households Primary Detachment or a Lord of War Detachment contains at least one Model of the Knight Sub-type. 1 Elites Slot (Domitar Maniple), 1 Support Slot (Castellax Maniple), 1 Recon Slot (Vorax Maniple), 1 Fast Attack Slot (Vultarax Stratos Squadron) — all from Liber Mechanicum.",
    restrictions: {
      "Elites": ["mech-combat-domitar"],
      "Support": ["mech-combat-castellax"],
      "Recon": ["mech-attaque-vorax"],
      "Fast Attack": ["mech-stratos-vultarax"],
    },
    cases: [
      _caseOrga("Elites"),
      _caseOrga("Support"),
      _caseOrga("Recon"),
      _caseOrga("Fast Attack"),
    ],
  },
  {
    id: "maisnie-roturiere",
    nom: "Commoner Household",
    famille: "additionnel",
    faction: "chevaliers-questoris",
    factionLibre: true,
    requiertAvantage: "seigneur-preux",
    requiertMaisonnee: "imperialis",
    texte:
      "Unlocked when a Unit has the Gallant Lord Household Rank Prime Advantage, OR unconditionally for an Army with the Imperialis Household Paradigm whose Knight Households Primary Detachment or a Lord of War Detachment contains at least one Model of the Knight Sub-type. 2 Troops Slots, 2 Support Slots, 2 Armour Slots — from the Solar Auxilia (and, not transcribed on this site, the Imperialis Militia).",
    restrictions: {
      "Troops": ["sa-ryeliers"],
      "Support": ["sa-rapier", "sa-basilisk", "sa-medusa"],
      "Armour": ["sa-leman-russ-frappe", "sa-leman-russ-assaut", "sa-malcador"],
    },
    cases: [
      _caseOrga("Troops"),
      _caseOrga("Support"),
      _caseOrga("Armour"),
      _caseOrga("Troops"),
      _caseOrga("Support"),
      _caseOrga("Armour"),
    ],
  },

  /* ---------- Cohortes Vagus (Journal Tactica : Battle of Tallarn) ----------
     Détachement Additionnel ouvert à toute Faction et toute Allégeance
     (`factionLibre` sans `faction`), un seul par Armée, dont les Cases
     piochent dans la Liste d'Armée du Mechanicum (`restrictions`,
     accessibles grâce à DETACHEMENTS_CROISES, js/unites.js).
     Composition confirmée par Jean : 12 Cases, toutes Principales.
     Seuls les Avantages Principaux Vagus y sont permis
     (`avantagesAutorises`) ; deux contraintes du livre ne sont PAS
     vérifiées par ce site : chaque Unité doit en recevoir un, et ce
     doit être le même pour toutes les Unités du Détachement. L'option
     « Carnage et Pandémonium » (utilisation comme Détachement Principal
     à 1500 points ou moins) n'est pas modélisée non plus. */
  {
    id: "cohortes-vagus",
    nom: "Vagus Cohorts",
    famille: "additionnel",
    factionLibre: true,
    max: 1,
    avantagesAutorises: [
      "orphelins-du-champ-de-bataille",
      "renforts-egares",
      "programmation-corrompue",
      "influence-maligne",
    ],
    texte:
      "Only one per Army, for any Faction and any Allegiance. 12 Slots, all Prime: 3 Heavy Assault (Castellax Destructor Maniples), 3 Support (Castellax Battle Maniples), 3 Recon (Vorax Strike Maniples), 1 War-engines (Thanatar Siege Maniple), 1 Fast Attack (Vultarax Stratos Squadron), 1 Elites (Domitar Battle Maniple) — from Liber Mechanicum. Each Unit must receive a Vagus Prime Advantage, the same one for all Units in the Detachment (not checked by this site). Models with the Cybernetica Trait replace it with the Vagus Trait. Carnage and Pandemonium: at 1500 points or less, this Detachment may replace the Primary Detachment (with no linked Auxiliary or Apex Detachment, Allies permitted); the player using it this way then scores, in the Victory Sub-phase of each of their turns, 1 VP if at least one enemy Unit has lost its last Model (+2 if one of them had a variant of Line (X)), up to a maximum of 3 VP per turn (not modelled by this site).",
    restrictions: {
      "Heavy Assault": ["mech-castellax-destructor"],
      "Support": ["mech-combat-castellax"],
      "Recon": ["mech-attaque-vorax"],
      "War-engines": ["mech-siege-thanatar"],
      "Fast Attack": ["mech-stratos-vultarax"],
      "Elites": ["mech-combat-domitar"],
    },
    cases: [
      _caseOrga("Heavy Assault", true),
      _caseOrga("Heavy Assault", true),
      _caseOrga("Heavy Assault", true),
      _caseOrga("Support", true),
      _caseOrga("Support", true),
      _caseOrga("Support", true),
      _caseOrga("Recon", true),
      _caseOrga("Recon", true),
      _caseOrga("Recon", true),
      _caseOrga("War-engines", true),
      _caseOrga("Fast Attack", true),
      _caseOrga("Elites", true),
    ],
  },

  /* ---------- Détachements Auxiliaires standard (p. 284) ---------- */
  {
    id: "poing-blinde",
    nom: "Armoured Fist",
    famille: "auxiliaire",
    texte:
      "A column of Transports and Heavy Transports to motorise the army.",
    deblocage: {
      caseRole: ["High Command", "Command"],
    },
    cases: [
      _caseOrga("Transports"),
      _caseOrga("Transports"),
      _caseOrga("Transports"),
      _caseOrga("Transports"),
      _caseOrga("Heavy Transports"),
      _caseOrga("Heavy Transports"),
      _caseOrga("Heavy Transports"),
      _caseOrga("Heavy Transports"),
    ],
  },
  {
    id: "appui-tactique",
    nom: "Tactical Support",
    famille: "auxiliaire",
    texte:
      "Additional Troops and Support Units to hold the field.",
    deblocage: {
      caseRole: ["High Command", "Command"],
    },
    cases: [
      _caseOrga("Troops"),
      _caseOrga("Troops"),
      _caseOrga("Support"),
      _caseOrga("Support"),
    ],
  },
  {
    id: "appui-blinde",
    nom: "Armoured Support",
    famille: "auxiliaire",
    texte: "Heavily armed Armour vehicles for fire support.",
    deblocage: {
      caseRole: ["High Command", "Command"],
    },
    cases: [
      _caseOrga("Armour"),
      _caseOrga("Armour"),
      _caseOrga("Armour"),
      _caseOrga("Armour"),
    ],
  },
  {
    id: "appui-lourd",
    nom: "Heavy Support",
    famille: "auxiliaire",
    // factionLibre (comme "seigneur-batailles" plus bas) : un Engin de
    // Guerre (Dreadnought Legiones Astartes, Armigère Chevaliers
    // Questoris…) n'est pas propre à une seule Faction — seule l'Unité
    // elle-même reste réservée à la sienne (champ `faction`, voir
    // uniteAccessible dans js/unites.js).
    factionLibre: true,
    deblocage: {
      caseRole: ["High Command", "Command"],
    },
    texte: "A War-engine (Dreadnought, Armiger or similar machine).",
    cases: [_caseOrga("War-engines")],
  },
  {
    id: "pionniers-combat",
    nom: "Combat Pioneers",
    famille: "auxiliaire",
    texte: "Recon units to harass and track the enemy.",
    deblocage: {
      caseRole: ["High Command", "Command"],
    },
    cases: [_caseOrga("Recon"), _caseOrga("Recon")],
  },
  {
    id: "assaut-de-choc",
    nom: "Shock Assault",
    famille: "auxiliaire",
    texte: "Heavy Assault units charged with breaking enemy lines.",
    deblocage: {
      caseRole: ["High Command", "Command"],
    },
    cases: [_caseOrga("Heavy Assault"), _caseOrga("Heavy Assault")],
  },
  {
    id: "premiere-frappe",
    nom: "First Strike",
    famille: "auxiliaire",
    texte:
      "Fast Attack units that strike quickly and immediately fall back.",
    deblocage: {
      caseRole: ["High Command", "Command"],
    },
    cases: [_caseOrga("Fast Attack"), _caseOrga("Fast Attack")],
  },
  {
    // Journal Tactica : Dropsite, « Tip of the Spear ». Débloqué par la
    // Règle Spéciale Fer de Lance (Maître de la Descente) quand cette
    // Figurine occupe une Case d'État-major du Détachement Principal —
    // le livre dit « dont le Détachement Principal comprend une
    // Figurine ayant cette Règle Spéciale », sans exiger de Case
    // précise ; `deblocage.caseRole` aligné sur la catégorie du Maître
    // de la Descente (État-major) faute d'un mécanisme de détection
    // « Figurine présente n'importe où dans le Détachement Principal »
    // pour ce type de règle dans ce fichier.
    id: "fer-de-lance-de-chute",
    nom: "Drop Spearhead",
    famille: "auxiliaire",
    texte:
      "Unlocked when a Master of Descent occupies a Command Slot of the Primary Detachment. Retinues Slots: Praetorian Command Squad with Jump Packs only. Elites Slots: Veteran Assault Squad only.",
    deblocage: {
      caseRole: "Command",
      uniteIds: ["maitre-descente"],
    },
    restrictions: {
      "Retinues": ["escouade-etat-major-pretorienne-reacteurs"],
      "Elites": ["escouade-veterans-assaut"],
    },
    cases: [_caseOrga("Retinues", true), _caseOrga("Elites"), _caseOrga("Elites")],
  },
  {
    // Journal Tactica : The Forges of Saturn, « Legiones Astartes
    // Detachments ». Débloqué quand une Unité Maître des Signaux
    // occupe une Case d'État-major (« Command Force Organisation Slot »
    // du PDF — le Maître des Signaux est catégorie "État-major" dans ce
    // fichier, pas "Quartier Général", donc caseRole aligné là-dessus
    // plutôt que sur la traduction littérale du PDF). Restriction des
    // Cases de Reco : le PDF vise les « Tarantula Battery Units », mais
    // aucune Unité Legio Astartes générique de ce nom n'est encore
    // transcrite dans ce fichier (seules des variantes Solar Auxilia/
    // Mechanicum existent, `sa-section-tarantula`/`mech-tarantula`,
    // toutes deux d'une autre Faction) : gap documenté, restriction
    // laissée non câblée sur les Cases de Reco en attendant.
    id: "maelstrom-sentry-battery",
    nom: "Maelstrom Sentry Battery",
    famille: "auxiliaire",
    texte:
      "Unlocked when a Master of Signals occupies a Command Slot. Support Slots: Araknae Quad-tube Accelerator Platforms only. Recon Slots: Mechanicum Tarantula Battery Units only (not yet transcribed for the Legiones Astartes).",
    deblocage: {
      caseRole: "Command",
      uniteIds: ["maitre-signaux", "maitre-signaux-monte"],
    },
    restrictions: {
      "Support": ["araknae"],
    },
    cases: [
      _caseOrga("Support"),
      _caseOrga("Support"),
      _caseOrga("Recon"),
      _caseOrga("Recon"),
      _caseOrga("Recon"),
    ],
  },
  {
    // Legacies of the Age of Darkness (fiche Mortificator, p. 62,
    // encart « Dreadnought Talon [Auxiliary Detachment] ») — traduction
    // « Griffe de Dreadnoughts » déjà établie dans js/regles-data.js
    // (Règle Spéciale du même nom, transcrite lors d'une session
    // antérieure mais jamais câblée ici jusqu'à présent). Débloqué par
    // un Mortificator OU un Mortificator en Armure Terminator occupant
    // une Case d'État-major (les deux Unités sont catégorie État-major
    // dans ce fichier).
    id: "griffe-de-dreadnoughts",
    nom: "Dreadnought Talon",
    famille: "auxiliaire",
    texte:
      "Unlocked when a Mortificator or a Mortificator in Terminator Armour occupies a Command Slot. This Detachment's War-engines Slots may only be used to select Contemptor Dreadnought Units.",
    deblocage: {
      caseRole: "Command",
      uniteIds: ["mortificator", "mortificator-terminator"],
    },
    restrictions: {
      "War-engines": ["dreadnought-contemptor"],
    },
    cases: [
      _caseOrga("War-engines"),
      _caseOrga("War-engines"),
      _caseOrga("War-engines"),
    ],
  },

  /* ---------- Détachements Auxiliaires des Solar Auxilia (Liber
     Auxilia, p. 18-19) : chacun débloqué par une Section d'État-major
     précise occupant une Case d'État-major, à la place des options
     standard ci-dessus — même mécanique que Cadre de Vétérans/Demi-
     compagnie Reco plus haut. `faction` explicite par clarté, bien que
     les Unités de `deblocage.uniteIds` soient déjà propres aux Solar
     Auxilia. ---------- */
  {
    id: "tercio-veletaris",
    nom: "Veletaris Tercio",
    famille: "auxiliaire",
    faction: "solar-auxilia",
    texte:
      "Unlocked when a Veletaris Command Section occupies a Command Slot. Elites Slots: Veletaris Storm or Vanguard Sections only. Support Slots: Hermes Veletaris Squadrons only. All Models in Units placed in this Detachment gain the Veletaris Tercio Trait.",
    traitAccorde: "Veletaris Tercio",
    deblocage: {
      caseRole: "Command",
      uniteIds: ["sa-etat-major-veletaris"],
    },
    restrictions: {
      "Elites": ["sa-assaut-veletaris", "sa-avant-garde-veletaris"],
      "Support": ["sa-hermes-veletaris"],
    },
    cases: [
      _caseOrga("Elites", true),
      _caseOrga("Elites"),
      _caseOrga("Support"),
      _caseOrga("Heavy Transports"),
      _caseOrga("Heavy Transports"),
    ],
  },
  {
    id: "tercio-infanterie",
    nom: "Infantry Tercio",
    famille: "auxiliaire",
    faction: "solar-auxilia",
    texte:
      "Unlocked when a Line Command Section occupies a Command Slot. Troops Slots: Lasrifle Sections only. Recon Slots: Hermes Light Sentinel Squadrons only. All Models in Units placed in this Detachment gain the Infantry Tercio Trait.",
    traitAccorde: "Infantry Tercio",
    deblocage: { caseRole: "Command", uniteIds: ["sa-etat-major-ligne"] },
    restrictions: {
      "Troops": ["sa-ryeliers"],
      "Recon": ["sa-sentinelles-legeres-hermes"],
    },
    cases: [
      _caseOrga("Troops", true),
      _caseOrga("Troops"),
      _caseOrga("Recon"),
      _caseOrga("Heavy Transports"),
      _caseOrga("Heavy Transports"),
    ],
  },
  {
    id: "tercio-artillerie",
    nom: "Artillery Tercio",
    famille: "auxiliaire",
    faction: "solar-auxilia",
    texte:
      "Unlocked when an Artillery Command Section occupies a Command Slot. Support Slots: Rapier Batteries, Basilisk Artillery Tanks or Medusa Artillery Tanks only. All Models in Units placed in this Detachment gain the Artillery Tercio Trait.",
    traitAccorde: "Artillery Tercio",
    deblocage: {
      caseRole: "Command",
      uniteIds: ["sa-etat-major-artillerie"],
    },
    restrictions: {
      "Support": ["sa-rapier", "sa-basilisk", "sa-medusa"],
    },
    cases: [_caseOrga("Support"), _caseOrga("Support"), _caseOrga("Support")],
  },
  {
    id: "tercio-eclaireurs",
    nom: "Scout Tercio",
    famille: "auxiliaire",
    faction: "solar-auxilia",
    texte:
      "Unlocked when a Hermes Command Section occupies a Command Slot. Recon Slots: Hermes Light Sentinel Squadrons only. War-engine Slots: Aethon Heavy Sentinel Squadrons only. All Models in Units placed in this Detachment gain the Scout Tercio Trait.",
    traitAccorde: "Scout Tercio",
    deblocage: { caseRole: "Command", uniteIds: ["sa-etat-major-hermes"] },
    restrictions: {
      "Recon": ["sa-sentinelles-legeres-hermes"],
      "War-engines": ["sa-sentinelles-aethon"],
    },
    cases: [
      _caseOrga("Recon"),
      _caseOrga("Recon"),
      _caseOrga("War-engines"),
    ],
  },
  {
    id: "tercio-blinde",
    nom: "Armoured Tercio",
    famille: "auxiliaire",
    faction: "solar-auxilia",
    texte:
      "Unlocked when an Armoured Command Section occupies a Command Slot. Armour Slots: Leman Russ Strike Tanks, Leman Russ Assault Tanks or Malcador Heavy Tanks only. All Models in Units placed in this Detachment gain the Armoured Tercio Trait.",
    traitAccorde: "Armoured Tercio",
    deblocage: { caseRole: "Command", uniteIds: ["sa-etat-major-blinde"] },
    restrictions: {
      "Armour": ["sa-leman-russ-frappe", "sa-leman-russ-assaut", "sa-malcador"],
    },
    cases: [_caseOrga("Armour"), _caseOrga("Armour"), _caseOrga("Armour")],
  },
  /* Tercio de Fer (Doctrine de Cohorte de Fer, Liber Auxilia p. 16) :
     à la différence des 5 Tercios ci-dessus, débloqué directement par
     le choix de la Doctrine (`requiertDoctrineCohorte`), pas par une
     Section d'État-major occupant une Case d'État-major — aucun champ
     `deblocage` ici. Ses Cases accueillent des Unités du Liber
     Mechanicum (Faction "mechanicum") au lieu des Unités Solar Auxilia
     habituelles : `factionLibre: true` dispense donc ce Détachement de
     la vérification de Faction faite par caseAccepte() (js/
     organigramme.js), les 4 ids listés dans `restrictions` ci-dessous
     restant seuls juges des Unités acceptées sur chacune de ses Cases —
     comportement voulu par le livre (« Cela prend le pas sur les
     restrictions habituelles de Liste d'Armée d'origine »). `faction:
     "solar-auxilia"` reste posé À CÔTÉ de `factionLibre` : ce dernier
     ne dispense que caseAccepte() (placement des 4 Unités Mechanicum),
     pas typeDisponiblePourFaction() (visibilité du Détachement lui-même
     dans le panneau « Ajouter un détachement ») — sans `faction`, ce
     Détachement apparaîtrait grisé pour TOUTE Faction plutôt que
     masqué hors Solar Auxilia (voir typeDisponiblePourFaction, js/
     organigramme.js). Un complément dans uniteAccessible() (js/
     unites.js) rend ces mêmes 4 Unités sélectionnables dans le menu
     « Unité à ajouter » d'une Armée Solar Auxilia dès que ce
     Détachement est présent (sinon bloquées comme toute Unité
     Mechanicum hors Détachement Allié).
     Non modélisé sur ce site (gaps documentés plutôt qu'approximés) :
     - la Figurine placée devrait remplacer son propre Trait de Faction
       ([Mechanicum]/Cybernetica/Reductor) par le Trait de Faction
       « Tercio de Fer » — `traitAccorde` ci-dessous ne fait qu'AJOUTER
       ce Trait sur la fiche récap (même mécanique que les 5 autres
       Tercios), sans retirer le Trait d'origine ;
     - la Règle Spéciale qui autorise une Unité mêlant au moins une
       Figurine Technoprêtre et au moins une Figurine de Type Automate
       à Contrôler/Contester des Objectifs suppose une Unité composée à
       partir de DEUX fiches différentes : ce fichier ne modélise que
       des Unités autonomes à fiche unique (voir MODÈLE DE DONNÉES,
       js/unites-data.js) — aucune Unité de ce type n'est proposée. */
  {
    id: "tercio-de-fer",
    nom: "Iron Tercio",
    famille: "auxiliaire",
    faction: "solar-auxilia",
    factionLibre: true,
    requiertDoctrineCohorte: "fer",
    texte:
      "Unlocked by the Iron Cohort Doctrine (no Command Slot required). Heavy Assault Slots: Castellax Destructor Maniples only. Troops Slots: Tech-priests only. Support Slots: Castellax Battle Maniples or Thallax Cohorts only (Liber Mechanicum). All Models in Units placed in this Detachment gain the Iron Tercio Trait.",
    traitAccorde: "Iron Tercio",
    restrictions: {
      "Heavy Assault": ["mech-castellax-destructor"],
      "Troops": ["mech-technopretre"],
      "Support": ["mech-combat-castellax", "mech-cohorte-thallax"],
    },
    cases: [
      _caseOrga("Heavy Assault"),
      _caseOrga("Troops"),
      _caseOrga("Support"),
    ],
  },
  /* Tercio Hilote (Journal Tactica : Prospero Burns, Doctrine de
     Cohorte Oblitum) : un par Tercio Veletaris de l'Armée, sans Case
     d'État-major à remplir (`parTypeDetachement`), lié au même Parent
     que ce Tercio Veletaris. Ses Cases puisent dans la Liste d'Armée de
     l'Imperialis Militia (`factionLibre`, même mécanique que Tercio de
     Fer) — Liste NON transcrite sur ce site : les ids de `restrictions`
     ci-dessous sont réservés pour ces futures Unités (Cadre de Maîtres
     de Discipline, Troupes d'Infanterie/de Levée, Militia Medicae,
     Troupes d'Appui Feu), aucune Case n'acceptant donc d'Unité tant
     qu'elles n'existent pas. `pasDeCredit` : ses Unités de
     Commandement ne débloquent aucun Détachement Auxiliaire
     supplémentaire. Non modélisé (gap documenté) : les Figurines y
     remplacent le Trait Imperialis Militia par le Trait de Faction
     Solar Auxilia. */
  {
    id: "tercio-hilote",
    nom: "Helot Tercio",
    famille: "auxiliaire",
    faction: "solar-auxilia",
    factionLibre: true,
    requiertDoctrineCohorte: "oblitum",
    parTypeDetachement: "tercio-veletaris",
    pasDeCredit: true,
    texte:
      "Cohort Oblitum Doctrine: one per Veletaris Tercio in the Army, with no Command Slot required, linked to the same Detachment as that Veletaris Tercio. Command Slot: Disciplinarian Cadre only. Troops Slots: Infantry or Levy Troops only. Support Slot: Militia Medicae or Fire Support Troops only — all from the Imperialis Militia Army List (not transcribed on this site). Models here replace the Imperialis Militia Trait with the Solar Auxilia Faction Trait; its Command Units do not unlock any additional Auxiliary Detachment.",
    restrictions: {
      "Command": ["mil-cadre-maitres-discipline"],
      "Troops": ["mil-troupe-infanterie", "mil-troupe-levee"],
      "Support": ["mil-militia-medicae", "mil-troupe-appui-feu"],
    },
    cases: [
      _caseOrga("Command", true),
      _caseOrga("Troops"),
      _caseOrga("Troops"),
      _caseOrga("Support"),
    ],
  },
  /* Détachement Antemasque (Journal Tactica : The Battle for the Signus
     Cluster, Doctrine de Cohorte Sublime) : même mécanique que Tercio
     Hilote ci-dessus — un par Tercio d'Infanterie, sans Case
     d'État-major à remplir, lié au même Parent. Ses Cases n'acceptent
     que des Unités de la Liste d'Armée des Démons de Slaanesh (sous-
     faction "daemons-ruinstorm", voir js/unites-data.js) du Rôle
     Tactique correspondant — accessibles grâce à DETACHEMENTS_CROISES,
     js/unites.js. `pasDeCredit` : son Unité de Commandement ne débloque
     aucun Détachement supplémentaire. */
  {
    id: "antemasque",
    nom: "Antemasque Detachment",
    famille: "auxiliaire",
    faction: "solar-auxilia",
    factionLibre: true,
    requiertDoctrineCohorte: "sublime",
    parTypeDetachement: "tercio-infanterie",
    pasDeCredit: true,
    texte:
      "Sublime Cohort Doctrine: one per Infantry Tercio in the Army, with no Command Slot required, linked to the same Detachment as that Infantry Tercio. All its Slots may only hold Units from the Daemons of Slaanesh Army List; its Command Unit does not unlock any additional Detachment.",
    restrictions: {
      "Command": ["slaanesh-heraut"],
      "Troops": ["slaanesh-demonettes"],
      "Fast Attack": ["slaanesh-chasseresses"],
      "Heavy Assault": ["slaanesh-betes"],
    },
    cases: [
      _caseOrga("Command", true),
      _caseOrga("Troops"),
      _caseOrga("Troops"),
      _caseOrga("Fast Attack"),
      _caseOrga("Heavy Assault"),
    ],
  },

  /* ---------- Détachements Auxiliaires des Taghmata du Mechanicum
     (Liber Mechanicum, p. 16) : accessibles à tout Détachement
     Principal, Allié ou de Seigneur des Batailles de la Liste
     d'Armée des Taghmata du Mechanicum, débloqués quand un des trois
     choix d'État-major (Magos, Magos sur Abéant, Arcuitor Magisterium)
     occupe une Case d'État-major. « Cohorte du Taghmata » : composition
     exacte incertaine sur le scan fourni (icônes peu lisibles) — 4
     Cases d'Appui retenues par défaut, à vérifier contre le livre.
     ---------- */
  {
    id: "cohorte-du-taghmata",
    nom: "Taghmata Cohort",
    famille: "auxiliaire",
    faction: "mechanicum",
    texte:
      "Unlocked when a Magos, a Magos on Abeyant or an Arcuitor Magisterium occupies a Command Slot.",
    deblocage: {
      caseRole: "Command",
      uniteIds: [
        "mech-magos",
        "mech-magos-abeant",
        "mech-arcuitor-magisterium",
      ],
    },
    cases: [
      _caseOrga("Support"),
      _caseOrga("Support"),
      _caseOrga("Support"),
      _caseOrga("Support"),
    ],
  },
  {
    id: "cadre-apprentis",
    nom: "Apprentice Cadre",
    famille: "auxiliaire",
    faction: "mechanicum",
    texte:
      "Unlocked when a Magos, a Magos on Abeyant or an Arcuitor Magisterium occupies a Command Slot. Troops Slots: Tech-priest Units only.",
    deblocage: {
      caseRole: "Command",
      uniteIds: [
        "mech-magos",
        "mech-magos-abeant",
        "mech-arcuitor-magisterium",
      ],
    },
    restrictions: { "Troops": ["mech-technopretre"] },
    cases: [
      _caseOrga("Troops", true),
      _caseOrga("Troops"),
      _caseOrga("Troops"),
      _caseOrga("Troops"),
    ],
  },

  /* ---------- Détachements de la Legio Custodes (livre d'armée) :
     `faction` posé par cohérence avec Tercio de Fer/Cohorte du
     Taghmata ci-dessus (sinon repli implicite sur "legio-astartes" via
     factionCroisadeParDefaut(), js/organigramme.js). Faction encore
     désactivée dans FACTIONS (js/organigramme.js) faute d'unités
     transcrites : ces types restent invisibles tant qu'elle n'est pas
     activée, ajoutés par anticipation. Pas de `deblocage`/
     `restrictions` faute de texte de règle fourni pour ces
     Détachements — à compléter si besoin. ---------- */
  {
    id: "convocation-moritoi",
    nom: "Convocation of Moritoi",
    famille: "apex",
    faction: "legio-custodes",
    texte: "Legio Custodes War-engines.",
    cases: [_caseOrga("War-engines", true), _caseOrga("War-engines")],
  },
  {
    id: "convocation-hykanatoi",
    nom: "Convocation of Hykanatoi",
    famille: "auxiliaire",
    faction: "legio-custodes",
    texte: "Additional Troops and a Heavy Transport.",
    cases: [
      _caseOrga("Troops", true),
      _caseOrga("Troops"),
      _caseOrga("Heavy Transports"),
    ],
  },
  {
    id: "convocation-tharanatoi",
    nom: "Convocation of Tharanatoi",
    famille: "auxiliaire",
    faction: "legio-custodes",
    texte: "Additional Heavy Assault units.",
    cases: [_caseOrga("Heavy Assault", true), _caseOrga("Heavy Assault")],
  },
  {
    id: "convocation-euphoroi",
    nom: "Convocation of Euphoroi",
    famille: "auxiliaire",
    faction: "legio-custodes",
    texte: "Additional Recon units.",
    cases: [_caseOrga("Recon", true), _caseOrga("Recon")],
  },
  {
    id: "convocation-cataphractoi",
    nom: "Convocation of Cataphractoi",
    famille: "auxiliaire",
    faction: "legio-custodes",
    texte:
      "Additional Fast Attack units, a Heavy Transport and an Armour unit.",
    cases: [
      _caseOrga("Fast Attack", true),
      _caseOrga("Heavy Transports"),
      _caseOrga("Armour"),
    ],
  },

  /* ---------- Détachements d'Apex (p. 284) ----------
     1 par Case de Quartier Général remplie (à la place d'un
     Détachement Auxiliaire, jamais les deux — p. 283). */
  {
    id: "escorte-combat",
    nom: "Combat Escort",
    famille: "apex",
    texte:
      "Retinue units: the bodyguards of the army's officers.",
    cases: [
      _caseOrga("Retinues", true),
      _caseOrga("Retinues"),
      _caseOrga("Retinues"),
    ],
  },
  {
    id: "cadre-officiers",
    nom: "Officer Cadre",
    famille: "apex",
    texte:
      "Additional officers (High Command). Each filled High Command Slot in this detachment in turn unlocks 1 Auxiliary or Apex Detachment.",
    cases: [_caseOrga("High Command", true), _caseOrga("High Command")],
  },
  {
    id: "avant-garde",
    nom: "Army Vanguard",
    famille: "apex",
    texte: "Elites units, the most formidable warriors of the army.",
    cases: [_caseOrga("Elites", true), _caseOrga("Elites"), _caseOrga("Elites")],
  },
  {
    // Journal Tactica : The Forges of Saturn, « Legiones Astartes
    // Detachments ». Le livre exige qu'à la sélection de ce Détachement,
    // le joueur choisisse un des trois mots « Saturnine »/
    // « Cataphractii »/« Tartaros », et que les Cases de Suites/Assaut
    // Lourd n'acceptent ensuite que les Unités dont le NOM contient ce
    // mot — mécanisme dynamique de filtrage par sous-chaîne de nom,
    // sans équivalent dans ce fichier (le champ `restrictions` existant
    // ne modélise qu'une liste fixe d'ids, jamais un choix du joueur
    // fait au moment de la sélection du Détachement) : non câblé
    // mécaniquement, gap documenté ici plutôt qu'une approximation
    // trompeuse (ex : autoriser toutes les Unités des trois familles à
    // la fois irait à l'encontre du texte du livre). Composition
    // (2 Assaut Lourd, 1 Suite, 1 Engin de Guerre) confirmée par le
    // proprio (2026-08-02), corrigeant une première lecture des icônes
    // qui avait retenu 2 Suites/2 Assaut Lourd sans Engin de Guerre.
    id: "linebreaker-echelon",
    nom: "Linebreaker Echelon",
    famille: "apex",
    texte:
      "When selecting this Detachment, choose one of the following words: “Saturnine”, “Cataphractii” or “Tartaros”. This Detachment's Retinues and Heavy Assault Slots may only hold Units whose name contains the chosen word (restriction not enforced by this site — check it yourself).",
    cases: [
      _caseOrga("Heavy Assault", true),
      _caseOrga("Heavy Assault"),
      _caseOrga("Retinues"),
      _caseOrga("War-engines"),
    ],
  },
  /* Journal Tactica : Battle of Tallarn, pack de missions Armoured
     Spearhead (voir pages/missions.html#armoured-spearhead). Le livre
     le réserve aux Missions Armoured Spearhead, ouvert à toute Faction
     et toute Allégeance — condition de mission non modélisée sur ce
     site (comme les Détachements Principaux Zone Mortalis plus haut).
     Composition confirmée par Jean : 3 Cases Blindés, toutes
     Principales. Seuls les Avantages Principaux Armoured Spearhead y
     sont permis (`avantagesAutorises`). */
  {
    id: "escadron-commandement-blinde",
    nom: "Armoured Command Squadron",
    famille: "apex",
    texte:
      "Normally reserved for Armoured Spearhead Missions (not checked by this site), for any Faction and any Allegiance. All Slots in this Detachment may only receive the Armoured Spearhead Prime Advantages (Hardened Systems, Suspensor Web Stabilisers).",
    avantagesAutorises: ["systemes-durcis", "stabilisateurs-toile-suspensive"],
    cases: [
      _caseOrga("Armour", true),
      _caseOrga("Armour", true),
      _caseOrga("Armour", true),
    ],
  },
  /* Premier Détachement d'Apex réservé à une Légion sur le site.
     Composition confirmée par Jean : 4 Cases (Troupes principale ×2,
     Elite ×2), sans restriction d'unité. Condition de sélection du
     livre : Allégeance Renégate (menu Allégeance des paramètres de la
     partie, voir etat.allegeance) ET au moins 1
     Avantage Principal Vrais Croyants choisi sur une Case de l'Armée
     — vérifiée par `requiertAllegeance`/`requiertAvantage`
     (disponibilite()/validerArmee(), js/organigramme.js). */
  {
    id: "conclave-exalte",
    nom: "Exalted Conclave",
    famille: "apex",
    texte:
      "Troops and Elites units corrupted by the Warp. Reserved for Traitor Allegiance Armies that have chosen the True Believers Prime Advantage on at least one Slot.",
    requiertAllegeance: "renegat",
    requiertAvantage: "vrais-croyants",
    cases: [
      _caseOrga("Troops", true),
      _caseOrga("Troops", true),
      _caseOrga("Elites"),
      _caseOrga("Elites"),
    ],
    legion: "XVII",
  },

  /* ---------- Détachements d'Apex de Mechanicum (Liber Mechanicum,
     p. 42-49) : un par Techno-arcane, accessibles au Détachement
     Principal/Allié/Seigneur des Batailles de Mechanicum. Toutes les
     Cases sont Principales sauf indication contraire. ---------- */
  {
    id: "le-coeur-du-pouvoir",
    nom: "The Heart of Power",
    famille: "apex",
    faction: "mechanicum",
    requiertTechnoArcane: "archimandrite",
    texte:
      "Apex Detachment reserved for the Archimandrite Techno-arcana. The Engram of Authority grants a Leadership and Cool bonus to any Model with this Arcane Benefit.",
    cases: [
      _caseOrga("High Command", true),
      _caseOrga("High Command"),
      _caseOrga("High Command"),
    ],
  },
  {
    id: "manipule-de-commandement",
    nom: "Command Maniple",
    famille: "apex",
    faction: "mechanicum",
    requiertTechnoArcane: "cybernetica",
    texte:
      "Apex Detachment reserved for the Cybernetica Techno-arcana. The Deus Machina grants bonuses to any controlled Automata Model.",
    cases: [
      _caseOrga("Support", true),
      _caseOrga("Elites", true),
      _caseOrga("War-engines", true),
    ],
  },
  {
    id: "la-panoplie-de-cruaute",
    nom: "The Panoply of Cruelty",
    famille: "apex",
    faction: "mechanicum",
    requiertTechnoArcane: "lacrymaerta",
    texte:
      "Apex Detachment reserved for the Lacrymaerta Techno-arcana. An Endless Servitude grants access to the Battlesmith (X) Special Rule.",
    cases: [
      _caseOrga("Heavy Assault", true),
      _caseOrga("Heavy Assault"),
      _caseOrga("Heavy Assault"),
    ],
  },
  {
    id: "l-ost-de-destruction",
    nom: "The Host of Destruction",
    famille: "apex",
    faction: "mechanicum",
    requiertTechnoArcane: "myrmidax",
    texte:
      "Apex Detachment reserved for the Myrmidax Techno-arcana. The Strength of Ages grants +1 W and Special Rules to any Model with this Arcane Benefit. Only the marked Elites Slot is a Prime Slot.",
    cases: [
      _caseOrga("Elites", true),
      _caseOrga("Elites"),
      _caseOrga("Elites"),
      _caseOrga("Elites"),
    ],
  },
  {
    id: "cohorte-de-commandement-thallax",
    nom: "Thallax Command Cohort",
    famille: "apex",
    faction: "mechanicum",
    requiertTechnoArcane: "reductor",
    texte:
      "Apex Detachment reserved for the Reductor Techno-arcana. Wallbreaker grants a modifier to the Shooting and Combat attacks of Units that include a Model with this Arcane Benefit.",
    cases: [_caseOrga("Support", true), _caseOrga("Support"), _caseOrga("Support")],
  },
  {
    id: "supplice-du-jugement",
    nom: "Torment of Judgement",
    famille: "apex",
    faction: "mechanicum",
    requiertTechnoArcane: "malagra",
    texte:
      "Apex Detachment reserved for the Malagra Techno-arcana. Relentlessly Subtracted Army grants an additional Fortification to Units. No Slot is marked Prime: this Detachment does not unlock a Prime Advantage.",
    cases: [_caseOrga("Support"), _caseOrga("Support"), _caseOrga("Support")],
  },
  {
    id: "phalange-de-fer",
    nom: "Iron Phalanx",
    famille: "apex",
    faction: "mechanicum",
    requiertTechnoArcane: "macrotek",
    texte:
      "Apex Detachment reserved for the Macrotek Techno-arcana. Iron Protector grants a Save modifier to any Vehicle Type Model accompanied by a Model with this Arcane Benefit.",
    cases: [_caseOrga("Support", true), _caseOrga("Support"), _caseOrga("Support")],
  },

  /* ---------- Détachements Auxiliaires des Legiones Astartes
     (livre d'armée) : débloqués par une unité PRÉCISE occupant une
     case donnée, « à la place des options disponibles dans
     l'Organigramme de Force de Croisade ». ---------- */
  {
    id: "cadre-veterans",
    nom: "Veteran Cadre",
    famille: "auxiliaire",
    texte:
      "Unlocked when a Legion Champion — on foot, with Jump Pack, Mounted (Biker / Scimitar Jetbike) or in Terminator Armour — occupies a Command Slot (instead of a standard Auxiliary Detachment).",
    // « Champion sur Scimitar » et « Champion de Légion en Armure
    // Terminator » (js/unites-data.js) comptent tous deux comme une
    // Unité de Champion de Légion pour ce déblocage (voir leur note).
    deblocage: {
      caseRole: "Command",
      uniteIds: [
        "champion",
        "champion-monte",
        "champion-armure-terminator",
        "champion-reacteurs",
      ],
    },
    cases: [
      _caseOrga("Retinues"),
      _caseOrga("Elites"),
      _caseOrga("Heavy Transports"),
    ],
  },
  {
    id: "demi-compagnie-reco",
    nom: "Recon Demi-company",
    famille: "auxiliaire",
    texte:
      "Unlocked when a Vigilator occupies a Command Slot. Recon Slots may only hold Reconnaissance Squads.",
    deblocage: { caseRole: "Command", uniteIds: ["vigilator"] },
    restrictions: { "Recon": ["escouade-reconnaissance"] },
    cases: [
      _caseOrga("Recon", true),
      _caseOrga("Recon"),
      _caseOrga("Recon"),
      _caseOrga("Fast Attack"),
    ],
  },
  {
    id: "batterie-orage",
    nom: "Storm Battery",
    famille: "auxiliaire",
    texte:
      "Unlocked when a Siege Breaker occupies a Command Slot. Support Slots: Rapier Batteries only; Armour Slots: Arquitor Bombards or Vindicator Siege Tanks only.",
    deblocage: {
      caseRole: "Command",
      uniteIds: ["briseur-siege", "briseur-siege-terminator"],
    },
    restrictions: {
      "Support": ["batterie-rapier"],
      "Armour": ["arquitor", "vindicator"],
    },
    cases: [
      _caseOrga("Support"),
      _caseOrga("Support"),
      _caseOrga("Armour"),
      _caseOrga("Armour"),
    ],
  },
  {
    id: "manifestation-demoniaque",
    nom: "Daemonic Manifestation",
    famille: "auxiliaire",
    // factionLibre (comme "tercio-de-fer" plus haut) : ses Cases
    // d'Assaut Lourd accueillent des Unités de la Faction "daemons-
    // ruinstorm" (Liste d'Armée des Démons de la Tempête de la Ruine)
    // au lieu des Unités Legio Astartes habituelles. `faction` posé à
    // côté (comme Tercio de Fer) : Détachement masqué hors Legio
    // Astartes (et des deux Factions qui en réutilisent la Liste
    // d'Armée, voir typeDisponiblePourFaction, js/organigramme.js).
    // Ces Brutes n'entrent dans l'Armée QUE par ce Détachement (voir
    // DETACHEMENTS_CROISES, js/unites.js) : aucun autre Détachement
    // Legio Astartes ne les accepte (vérification de Faction de
    // caseAccepte()).
    faction: "legio-astartes",
    factionLibre: true,
    texte:
      "Unlocked when an Esoterist of Traitor Allegiance occupies a Command Slot. Heavy Assault Slots only accept Ruinstorm Daemon Brutes.",
    deblocage: {
      caseRole: "Command",
      uniteIds: ["esoteriste"],
      allegeance: "renegat",
    },
    restrictions: { "Heavy Assault": ["ruinstorm-brutes"] },
    cases: [
      _caseOrga("Heavy Assault"),
      _caseOrga("Heavy Assault"),
      _caseOrga("Heavy Assault"),
    ],
  },
  /* Incursion Éthérique (Journal Tactica : Prospero Burns, traduction
     maison, « Traitor Legion Auxiliary Detachment ») : même mécanique
     que Manifestation Démoniaque ci-dessus, ouvert à TOUTE Légion
     d'Allégeance Renégate (pas de `legion`). Ses Cases n'acceptent que des Unités dont les
     Figurines ont le Trait Tzeentch (Démons de Tzeentch, Faction
     "daemons-ruinstorm", voir js/unites-data.js) — ici les seules
     Unités Tzeentch de chaque Rôle Tactique concerné. Accessibles
     grâce à DETACHEMENTS_CROISES, js/unites.js. */
  {
    id: "incursion-etherique",
    nom: "Aetheric Incursion",
    famille: "auxiliaire",
    faction: "legio-astartes",
    factionLibre: true,
    texte:
      "Traitor Allegiance Legions only. Unlocked when an Esoterist or a Sorcerer of Prospero of Traitor Allegiance occupies a Command Slot, instead of the Crusade Force Organisation Chart options. Its Slots only accept Units composed of Models with the Tzeentch Trait (Daemons of Tzeentch).",
    deblocage: {
      caseRole: "Command",
      uniteIds: ["esoteriste", "sorcier-de-prospero"],
      allegeance: "renegat",
    },
    restrictions: {
      "Command": ["tzeentch-heraut"],
      "Troops": ["tzeentch-horreurs"],
      "Support": ["tzeentch-incendiaires"],
      "Fast Attack": ["tzeentch-hurleurs"],
    },
    cases: [
      _caseOrga("Command"),
      _caseOrga("Troops"),
      _caseOrga("Troops"),
      _caseOrga("Support"),
      _caseOrga("Fast Attack"),
    ],
  },
  /* Ost Extatique (Journal Tactica : The Battle for the Signus Cluster,
     traduction maison, « Traitor Legion Auxiliary Detachment ») : même
     mécanique que Manifestation Démoniaque/Incursion Éthérique, ouvert
     à TOUTE Légion d'Allégeance Renégate (pas de `legion`). Ses Cases
     n'acceptent que des Unités dont les Figurines ont le Trait Slaanesh
     (Démons de Slaanesh, Faction "daemons-ruinstorm", voir
     js/unites-data.js). Accessibles grâce à DETACHEMENTS_CROISES,
     js/unites.js. */
  {
    id: "ost-extatique",
    nom: "Ecstatic Host",
    famille: "auxiliaire",
    faction: "legio-astartes",
    factionLibre: true,
    texte:
      "Traitor Allegiance Legions only. Unlocked when an Esoterist of Traitor Allegiance occupies a Command Slot, instead of the Crusade Force Organisation Chart options. Its Slots only accept Units composed of Models with the Slaanesh Trait (Daemons of Slaanesh).",
    deblocage: {
      caseRole: "Command",
      uniteIds: ["esoteriste"],
      allegeance: "renegat",
    },
    restrictions: {
      "Command": ["slaanesh-heraut"],
      "Troops": ["slaanesh-demonettes"],
      "Heavy Assault": ["slaanesh-betes"],
      "Fast Attack": ["slaanesh-chasseresses"],
    },
    cases: [
      _caseOrga("Command"),
      _caseOrga("Troops"),
      _caseOrga("Troops"),
      _caseOrga("Heavy Assault"),
      _caseOrga("Fast Attack"),
    ],
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
    nom: "Techmarine Covenant",
    famille: "auxiliaire",
    texte:
      "Unlocked when a High Command or Command Slot is occupied. This detachment's Support Slots may only hold Techmarines.",
    deblocage: { caseRole: ["High Command", "Command"] },
    restrictions: { "Support": ["techmarine"] },
    cases: [
      _caseOrga("Support", true),
      _caseOrga("Support"),
      _caseOrga("Support"),
      _caseOrga("Support"),
      _caseOrga("Support"),
      _caseOrga("Support"),
    ],
  },
  {
    id: "delegation-apothecarion",
    nom: "Apothecarion Delegation",
    famille: "auxiliaire",
    texte:
      "Unlocked when a High Command or Command Slot is occupied. This detachment's Support Slots may only hold Apothecaries.",
    deblocage: { caseRole: ["High Command", "Command"] },
    restrictions: { "Support": ["apothicaire"] },
    cases: [
      _caseOrga("Support", true),
      _caseOrga("Support"),
      _caseOrga("Support"),
      _caseOrga("Support"),
      _caseOrga("Support"),
      _caseOrga("Support"),
    ],
  },

  /* ---------- Détachements Auxiliaires réservés à une Légion
     (Arsenal de chaque Légion, voir js/unites-data.js) : masqués tant
     que la Légion correspondante n'est pas choisie (champ `legion`,
     voir la note du modèle de données plus haut). ---------- */
  {
    id: "ost-revelation",
    nom: "Host of Revelation",
    famille: "auxiliaire",
    texte:
      "This Detachment's Troops Slots may only hold Assault Squads. Elites Slots may only hold Eoclast Cohorts or Veteran Assault Squads.",
    restrictions: {
      "Troops": ["escouade-assaut"],
      "Elites": ["cohorte-eoclaste", "escouade-veterans-assaut"],
    },
    cases: [
      _caseOrga("Troops", true),
      _caseOrga("Troops"),
      _caseOrga("Elites"),
      _caseOrga("Elites"),
    ],
    legion: "IX",
  },
  {
    id: "cadre-decapitation",
    nom: "Decapitation Cadre",
    famille: "auxiliaire",
    texte:
      "This Detachment's Recon Slots may only hold Reconnaissance Squads. Elites Slots may only hold Veteran Assault Squads or Dark Fury Squads.",
    restrictions: {
      "Recon": ["escouade-reconnaissance"],
      "Elites": ["escouade-veterans-assaut", "escouade-furies-noires"],
    },
    cases: [
      _caseOrga("Recon"),
      _caseOrga("Recon"),
      _caseOrga("Elites"),
      _caseOrga("Elites"),
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
    nom: "Immolation Covenant",
    famille: "auxiliaire",
    texte:
      "This Detachment's Armour Slots may only hold Predators or Vindicators.",
    restrictions: { "Armour": ["predator", "vindicator"] },
    cases: [
      _caseOrga("Support", true),
      _caseOrga("Support"),
      _caseOrga("Armour"),
      _caseOrga("Armour"),
    ],
    legion: "XVIII",
  },
  {
    id: "bande-guerriere-chogorienne",
    nom: "Chogorian Warband",
    famille: "auxiliaire",
    texte:
      "This Detachment's Fast Attack Slots may only hold Scimitar Jetbike Squadrons. Recon Slots may only hold Biker Squadrons.",
    restrictions: {
      "Fast Attack": ["escadron-scimitar"],
      "Recon": ["escadron-motards"],
    },
    cases: [
      _caseOrga("Fast Attack", true),
      _caseOrga("Fast Attack"),
      _caseOrga("Recon"),
      _caseOrga("Recon"),
    ],
    legion: "V",
  },
  {
    id: "cadre-berserkers",
    nom: "Berserker Cadre",
    famille: "auxiliaire",
    texte:
      "Reserved for the Legio Astartes World Eaters Rite of War. This Detachment's Heavy Assault Slots may only hold Rampager Squads.",
    requiertRiteDeGuerre: "legio-astartes-world-eaters",
    restrictions: { "Heavy Assault": ["escouade-saccageuse"] },
    cases: [
      _caseOrga("Troops", true),
      _caseOrga("Heavy Assault"),
      _caseOrga("Heavy Assault"),
      _caseOrga("Elites"),
    ],
    legion: "XII",
  },
  {
    // Même mécanique que Délégation de l'Apothecarion (icônes
    // Techmarine + Apothicaire pour le déblocage), en version
    // World Eaters ; ses propres Cases d'Appui restent réservées aux
    // Apothicaires.
    id: "fils-de-bodt",
    nom: "Sons of Bodt",
    famille: "auxiliaire",
    texte:
      "Reserved for the Legio Hereticus World Eaters Rite of War. Unlocked when a Techmarine or an Apothecary occupies a Support Slot. This detachment's Support Slots may only hold Apothecaries.",
    requiertRiteDeGuerre: "legio-hereticus-world-eaters",
    deblocage: { caseRole: "Support", uniteIds: ["techmarine", "apothicaire"] },
    restrictions: { "Support": ["apothicaire"] },
    cases: [
      _caseOrga("Support", true),
      _caseOrga("Support", true),
      _caseOrga("Troops"),
      _caseOrga("Troops"),
      _caseOrga("Troops"),
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
    nom: "Siege Gauntlet",
    famille: "auxiliaire",
    texte:
      "This Detachment's Troops Slots may only be used to select Breacher Squad Units.",
    restrictions: { "Troops": ["escouade-brecheuse"] },
    cases: [
      _caseOrga("Troops", true),
      _caseOrga("Troops"),
      _caseOrga("Heavy Assault"),
      _caseOrga("Heavy Assault"),
    ],
    legion: "VII",
  },
  /* Icônes identifiées par comparaison avec la légende des Rôles
     Tactiques (p. 285) : char (Blindés), transport (Transport Lourd),
     figurine simple (Troupes) — confirmé par le texte (« détachements
     de chars et troupes mécanisées en transports lourds »). */
  {
    id: "phalange-fer-de-lance",
    nom: "Spearhead Phalanx",
    famille: "auxiliaire",
    texte:
      "The Iron Hands were paragons of armoured warfare, combining tank detachments with mechanised troops in heavy transports. This Detachment's Heavy Transport Slots may only be used to select Land Raider Carrier or Spartan Units.",
    restrictions: { "Heavy Transports": ["porteur-land-raider", "spartan"] },
    cases: [
      _caseOrga("Heavy Transports"),
      _caseOrga("Armour"),
      _caseOrga("Heavy Assault"),
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
    nom: "Vanguard of Medusa",
    famille: "apex",
    texte:
      "Iron Hands assaults were typically led by phalanxes of implacable Terminators accompanied by Dreadnoughts and supported by cybernetically augmented warriors. This Detachment's Command Slot may only be used to select a Praevius Unit. May only be selected if the Army also includes an Iron Father or Ferrus Manus Unit.",
    restrictions: { "Command": ["praevius"] },
    requiertUniteArmee: ["reverend-de-fer", "ferrus-manus"],
    cases: [
      _caseOrga("Command", true),
      _caseOrga("Heavy Assault"),
      _caseOrga("Heavy Assault"),
      _caseOrga("Support"),
      _caseOrga("War-engines"),
    ],
    legion: "X",
  },
  /* Icônes identifiées par comparaison avec la légende des Rôles
     Tactiques (p. 285) : État-major, Troupes (×2), Transport, Attaque
     Rapide — le bullet du livre (« La Case d'État-major ... Optae »)
     confirme la première icône. */
  {
    id: "demi-compagnie-primus",
    nom: "Primus Demi-Company",
    famille: "auxiliaire",
    texte:
      "The Ultramarines deployed their forces according to various standardised formations. This Detachment's Command Slot may only be used to select an Optae Unit.",
    restrictions: { "Command": ["optae"] },
    cases: [
      _caseOrga("Command", true),
      _caseOrga("Troops"),
      _caseOrga("Troops"),
      _caseOrga("Transports"),
      _caseOrga("Fast Attack"),
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
    nom: "Bloodied Claw",
    famille: "auxiliaire",
    texte:
      "The Space Wolves never shied away from frontal yet bloody assaults. This Detachment's Troops Slots may only be used to select Grey Slayer Pack Units.",
    restrictions: { "Troops": ["meute-tueurs-gris"] },
    cases: [
      _caseOrga("Troops", true),
      _caseOrga("Troops"),
      _caseOrga("Heavy Assault"),
      _caseOrga("Heavy Assault"),
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
    nom: "Stormwing Muster",
    famille: "auxiliaire",
    texte:
      "The warriors of the Stormwing are artists of destruction, whose brushstrokes are the fire they unleash upon the canvas of the battlefield, and they form the heart of the Dark Angels Legion. Stormwing Musters employ heavy infantry tactics, combining the might of every warrior into an inexorable tide.",
    cases: [
      _caseOrga("Troops", true),
      _caseOrga("Troops", true),
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
    nom: "Ravenwing Lance",
    famille: "auxiliaire",
    texte:
      "“The arrow knows the way.” A saying heavy with meaning for the masters of the Ravenwing, a formation known for its strange creeds but also for its successes in the field. This Detachment's Recon Slots may only be used to select Bike Squadron Units.",
    restrictions: { "Recon": ["escadron-motards"] },
    cases: [
      _caseOrga("Fast Attack", true),
      _caseOrga("Fast Attack"),
      _caseOrga("Recon"),
      _caseOrga("Recon"),
    ],
    legion: "I",
  },
  /* Icônes identifiées par comparaison avec la légende des Rôles
     Tactiques (p. 285) : Suite (icône du sabre vertical, ×1) + Elite
     (figurine à l'arme d'hast, ×2). Aucun bullet de restriction visible
     sous l'encadré : aucune restriction transcrite. */
  {
    id: "conclave-deathwing",
    nom: "Deathwing Conclave",
    famille: "auxiliaire",
    texte:
      "The burden of duty weighs heavily on the warriors of the Deathwing, who long ago swore an oath to let no obstacle stop them from accomplishing their mission. Deathwing Conclaves are among the most powerful divisions of the Ist Legion.",
    cases: [
      _caseOrga("Retinues", true),
      _caseOrga("Elites"),
      _caseOrga("Heavy Assault"),
    ],
    legion: "I",
  },
  /* Icônes identifiées par comparaison avec la légende des Rôles
     Tactiques (p. 285) : Elite (figurine à l'arme d'hast, ×4) —
     confirmé par le bullet (« Escouade Traqueuse », catégorie Elite). */
  {
    id: "echelon-firewing",
    nom: "Firewing Echelon",
    famille: "auxiliaire",
    texte:
      "Firewing Echelons bring together the Legion's finest hunter-killers, as deadly as they are precise. This Detachment's Elites Slots may only be used to select Seeker Squad Units.",
    restrictions: { "Elites": ["escouade-traqueuse"] },
    cases: [
      _caseOrga("Recon", true),
      _caseOrga("Recon"),
      _caseOrga("Elites"),
      _caseOrga("Elites"),
    ],
    legion: "I",
  },
  /* Icônes identifiées par comparaison avec la légende des Rôles
     Tactiques (p. 285), corrigé par Jean : Transports Lourds ×2 +
     Blindés ×2. Aucun bullet de restriction visible sous l'encadré :
     aucune restriction transcrite. */
  {
    id: "gantelet-ironwing",
    nom: "Ironwing Gauntlet",
    famille: "auxiliaire",
    texte:
      "The Ironwing governs the vast arsenals of the Dark Angels, and thus a force of war engines surpassing that of any other Legion. Ironwing Gauntlets form a tactically flexible force of tanks and armoured transports.",
    cases: [
      _caseOrga("Heavy Transports"),
      _caseOrga("Heavy Transports"),
      _caseOrga("Armour"),
      _caseOrga("Armour"),
    ],
    legion: "I",
  },
  /* Icônes identifiées par comparaison avec la légende des Rôles
     Tactiques (p. 285) : transport + figurine (Appui, ×3) — confirmé
     par le bullet (« Interemptors de la Dreadwing » ou « Batterie de
     Rapier », toutes deux catégorie Appui). */
  {
    id: "cadre-dreadwing",
    nom: "Dreadwing Cadre",
    famille: "auxiliaire",
    texte:
      "When the Lion decrees that a world must die, he entrusts command of that grim operation to the veterans of the Dreadwing. This Detachment's Support Slots may only be used to select Dreadwing Interemptors Units or Rapier Battery Units.",
    restrictions: { "Support": ["interemptors-dreadwing", "batterie-rapier"] },
    cases: [_caseOrga("Support", true), _caseOrga("Support"), _caseOrga("Support")],
    legion: "I",
  },
  /* Composition confirmée par Jean : 4 Cases (Troupes principale ×2,
     Assaut Lourd, Elite), sans restriction d'unité. */
  {
    id: "cadre-suprematie",
    nom: "Supremacy Cadre",
    famille: "auxiliaire",
    texte: "Troops, a Heavy Assault unit and an Elites unit.",
    cases: [
      _caseOrga("Troops", true),
      _caseOrga("Troops", true),
      _caseOrga("Heavy Assault"),
      _caseOrga("Elites"),
    ],
    legion: "XVI",
  },
  /* --- Arsenal de l'Alpha Legion (XXe Légion) : Léviathan de
     Chasseurs de Têtes (voir js/unites-data.js, id "chasseur-de-
     tetes", unité réservée à cette Légion). --- */
  {
    id: "leviathan-chasseurs-tetes",
    nom: "Headhunter Leviathan",
    famille: "auxiliaire",
    texte:
      "This Detachment's Elites Slots may only be used to select Seeker Squad or Headhunter Units.",
    restrictions: { "Elites": ["escouade-traqueuse", "chasseur-de-tetes"] },
    cases: [
      _caseOrga("Recon", true),
      _caseOrga("Recon", true),
      _caseOrga("Elites"),
      _caseOrga("Elites"),
    ],
    legion: "XX",
  },
  /* --- Arsenal de la Death Guard (XIVe Légion) : Ost Moissonneur. --- */
  {
    id: "ost-moissonneur",
    nom: "Harvester Host",
    famille: "auxiliaire",
    texte:
      "This Detachment's Troops Slots may only be used to select Assault Squad Units.",
    restrictions: { "Troops": ["escouade-assaut"] },
    cases: [
      _caseOrga("Troops", true),
      _caseOrga("Troops"),
      _caseOrga("Support"),
      _caseOrga("Heavy Assault"),
    ],
    legion: "XIV",
  },
  /* --- Arsenal des Iron Warriors (IVe Légion) : La Cohorte de Feu de
     Fer. --- */
  {
    id: "cohorte-feu-de-fer",
    nom: "The Iron Fire Cohort",
    famille: "auxiliaire",
    texte:
      "This Detachment's Armour Slots may only be used to select Arquitor Bombard Units.",
    restrictions: { "Armour": ["arquitor"] },
    cases: [
      _caseOrga("Armour", true),
      _caseOrga("Armour"),
      _caseOrga("Support"),
      _caseOrga("Support"),
    ],
    legion: "IV",
  },
  /* --- Arsenal des Iron Warriors (IVe Légion) : Le Marteau
     d'Olympia. --- */
  {
    id: "marteau-olympia",
    nom: "The Hammer of Olympia",
    famille: "apex",
    texte:
      "May only be selected if the Army also includes a Warsmith or Perturabo Unit.",
    requiertUniteArmee: ["forgeguerre", "perturabo"],
    cases: [
      _caseOrga("Heavy Assault", true),
      _caseOrga("Heavy Assault"),
      _caseOrga("Heavy Transports"),
      _caseOrga("Troops", true),
      _caseOrga("Troops"),
    ],
    legion: "IV",
  },
  /* --- Arsenal des Night Lords (VIIIe Légion) : Assaut de Terreur. --- */
  {
    id: "assaut-de-terreur",
    nom: "Terror Assault",
    famille: "auxiliaire",
    texte:
      "This Detachment's Troops Slots may only be used to select Terror Squad Units.",
    restrictions: { "Troops": ["escouade-terreur"] },
    cases: [
      _caseOrga("Troops", true),
      _caseOrga("Troops"),
      _caseOrga("Fast Attack"),
      _caseOrga("Fast Attack"),
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
    nom: "Atramentar Hunt",
    famille: "apex",
    texte:
      "This Detachment's Retinue Slot may only be used to select a Cataphractii or Tartaros Terminator Command Squad Unit. Heavy Assault Slots may only be used to select Cataphractii or Tartaros Terminator Squad Units. Only the Atramentar Prime Advantage may be chosen on this Detachment's Prime Slots.",
    restrictions: {
      "Retinues": [
        "escouade-etat-major-cataphractii",
        "escouade-etat-major-tartaros",
      ],
      "Heavy Assault": ["terminators-cataphractii", "terminators-tartaros"],
    },
    avantagesAutorises: ["atramentar"],
    cases: [
      _caseOrga("Retinues", true),
      _caseOrga("Heavy Assault", true),
      _caseOrga("Heavy Assault", true),
    ],
    legion: "VIII",
  },
  /* --- Arsenal des Thousand Sons (XVe Légion) : Convocation de
     Prospero. --- */
  {
    id: "convocation-de-prospero",
    nom: "Convocation of Prospero",
    famille: "auxiliaire",
    texte:
      "Auxiliary Detachment available to an Army that includes a Primary Detachment of the Thousand Sons Faction. The Thousand Sons approached war in the same way as meditation: preparation, balance and calm ensured the victory of their mixed forces where the brute force of other, less subtle Legions would have failed. One Troops Prime Slot, one Fast Attack Slot, one Elites Slot and one Heavy Transports Slot.",
    cases: [
      _caseOrga("Troops", true),
      _caseOrga("Fast Attack"),
      _caseOrga("Elites"),
      _caseOrga("Heavy Transports"),
    ],
    legion: "XV",
  },
  /* --- Arsenal des Emperor's Children (IIIe Légion) : Escadre de
     Primauté, réservée au Rite de Guerre Legio Astartes (voir
     RITES_DE_GUERRE ci-dessous). --- */
  {
    id: "escadre-de-primaute",
    nom: "Primacy Squadron",
    famille: "auxiliaire",
    texte:
      "Reserved for the Legio Astartes Emperor's Children Rite of War. A Retinue, an Elites and two Fast Attack units.",
    requiertRiteDeGuerre: "legio-astartes-emperors-children",
    cases: [
      _caseOrga("Retinues"),
      _caseOrga("Elites"),
      _caseOrga("Fast Attack"),
      _caseOrga("Fast Attack"),
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
    nom: "Brotherhood of the Phoenix",
    famille: "additionnel",
    max: 1,
    pointsMin: 3000,
    requiertRiteDeGuerre: "legio-hereticus-emperors-children",
    excluAvec: ["seigneur-guerre"],
    pasDeCredit: true,
    restrictions: { "Warlord": ["fulgrim-transfigure"] },
    texte:
      "Reserved for the Legio Hereticus Emperor's Children Rite of War. Selected instead of the Warlord Detachment (the Army may not include both). Only if the Points Limit is at least 3000 pts. Its Warlord Slot may only hold a Fulgrim Transfigured Unit. This Detachment's High Command and Command Slots do not unlock any additional Auxiliary or Apex Detachment.",
    cases: [
      _caseOrga("Warlord"),
      _caseOrga("High Command", true),
      _caseOrga("High Command"),
      _caseOrga("High Command"),
      _caseOrga("Command"),
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
  /* --- Légion I — Dark Angels --- */
  I: {
    nomRite: "Legio Astartes Dark Angels",
    sections: [
      {
        titre: "Legion Tactica",
        paragraphes: [
          {
            texte:
              "All Models with the Dark Angels Trait (except Models of the Vehicle Type) are subject to the following Special Rule:",
          },
          { texte: "The Angels of Death", style: "bold" },
          {
            texte:
              "Negative modifiers to Leadership, Willpower, Cool and Intelligence are limited for the Dark Angels.",
            style: "bold",
          },
          {
            texte:
              "The Leadership Characteristic of Models with this Special Rule can never be reduced below 6. In addition, the Fear (X) Special Rule can only reduce the Leadership, Willpower, Cool and Intelligence Characteristics of any Model with this Special Rule by a maximum of 1, regardless of the value of X.",
          },
        ],
      },
      {
        titre: "Gambit",
        paragraphes: [
          {
            texte:
              "When choosing a Gambit, the Controlling Player of a Model with the Dark Angels Trait may choose Sword of the Order instead of another Gambit available to that Model.",
          },
          { texte: "Sword of the Order", style: "bold" },
          {
            texte:
              "This Gambit may be chosen when using swords as Weapons in a Challenge.",
            style: "bold",
          },
          {
            texte:
              "If this Gambit is chosen, as long as the Model controlled by that Player explicitly uses a Chainsword, Power sword, Force sword, Paragon blade or a Weapon with the Sword of the Order Trait, during Step 3 of the Challenge Sub-phase the Weapon's Attacks Modifier Characteristic is modified by -1 and it gains the Critical Hit (6+) Special Rule, or the value of X of any variant of Critical Hit (X) it already has is improved by +1.",
          },
        ],
      },
      {
        titre: "Advanced Reaction",
        paragraphes: [
          {
            texte:
              "The Controlling Player of Units composed only of Models with the Dark Angels Trait may spend Reaction points to make the following Advanced Reaction:",
          },
          { texte: "Vengeance of the First Legion", style: "bold" },
          {
            texte:
              "This Reaction allows the Controlling Player to repeat the Fight Sub-phase.",
            style: "bold",
          },
          {
            texte:
              "Trigger: Once per Battle, the Reactive Player may declare the Vengeance of the First Legion Advanced Reaction after resolving the last Initiative Step of a Combat involving a Unit they control composed only of Models with the Dark Angels Trait, but before the Make Final Pile-in Moves Step.",
          },
          {
            texte:
              "Cost: The Reactive Player must spend 1 point of their Reaction Allotment to declare the Vengeance of the First Legion Advanced Reaction, paid as soon as it is declared.",
          },
          {
            texte:
              "Target: The Target Unit is always a Unit involved in this Combat composed only of Models with the Dark Angels Trait. That Unit is the Reacting Unit.",
          },
          {
            texte:
              "Process: 1) Instead of moving on to the Make Final Pile-in Moves Step of this Combat, the Players must return to Step 1 of this Combat and resolve it a second time, discarding the Combat Resolution Points gained the first time (but not Combat Resolution Points scored in a Challenge during this Combat). 2) Models in the Reacting Unit gain the Shred (6+) Special Rule for their Weapons with the Sword of the Order Trait.",
          },
        ],
      },
    ],
  },
  /* --- Légion IV — Iron Warriors --- */
  IV: {
    nomRite: "Legio Astartes Iron Warriors",
    sections: [
      {
        titre: "Legion Tactica",
        paragraphes: [
          {
            texte:
              "All Models with the Iron Warriors Trait (except Models of the Vehicle Type) are subject to the following Special Rule:",
          },
          { texte: "To the Last", style: "bold" },
          {
            texte:
              "If the Controlling Player makes a Leadership Test or a Cool Test for a Unit composed mostly of Models with this Special Rule, they may ignore negative modifiers imposed by the Panic (X), Pinning (X), Stun (X) or Suppressive (X) Special Rules.",
          },
        ],
      },
      {
        titre: "Gambit",
        paragraphes: [
          {
            texte:
              "When choosing a Gambit, the Controlling Player of a Model with the Iron Warriors Trait may choose Spiteful Demise instead of another Gambit available to that Model.",
          },
          { texte: "Spiteful Demise", style: "bold" },
          {
            texte:
              "A Model that adopts this Gambit may inflict Hits on its opponent if it dies.",
            style: "bold",
          },
          {
            texte:
              "When this Gambit is chosen, if this Model loses its last Wound during the following Strike Step, the Controlling Player may immediately inflict a single automatic Hit on the opposing Model, resolved using the Weapon Profile below.",
          },
          {
            texte:
              "Weapon Profile: IM 1 · AM 1 · SM 6 · AP 4 · D 2 · Special Rules: Breaching (5+).",
          },
        ],
      },
      {
        titre: "Advanced Reaction",
        paragraphes: [
          {
            texte:
              "The Controlling Player of Units composed only of Models with the Iron Warriors Trait may spend Reaction points to make the following Advanced Reaction:",
          },
          { texte: "Bitter Fury", style: "bold" },
          {
            texte:
              "This Reaction allows the Reacting Unit to make an enhanced Shooting Attack, in the manner of Return Fire.",
            style: "bold",
          },
          {
            texte:
              "Trigger: Once per Battle, the Reactive Player may declare the Bitter Fury Advanced Reaction in the Shooting Phase, during Step 3 of the Shooting Attack sequence of a Shooting Attack made by the Active Player targeting a Unit composed only of Models with the Iron Warriors Trait.",
          },
          {
            texte:
              "Cost: The Reactive Player must spend 1 point of their Reaction Allotment to declare a Bitter Fury Advanced Reaction, paid as soon as it is declared.",
          },
          {
            texte:
              "Target: The Target Unit is always the Unit whose Shooting Attack triggers the Reaction. The Reacting Unit is always the Unit declared as the target of the Shooting Attack that triggers the Reaction.",
          },
          {
            texte:
              "Process: 1) Once the Bitter Fury Advanced Reaction has been declared, the Active Player must resolve all remaining Steps of the Shooting Attack process as normal, up to the start of Step 11. 2) Before resolving Step 11, the Reactive Player makes a Shooting Attack with the Reacting Unit (including Models that have just been reduced to 0 Wounds) targeting only the Target Unit. During this Shooting Attack, the Weapons used have their Firepower Characteristic modified by +1, and they gain the Overload (1) Special Rule. If a Weapon already has the Overload (X) Special Rule, the value of X of that Special Rule is modified by +1. 3) Once the Shooting Attack made as part of this Reaction has been fully resolved, including the removal of Casualties, the Active Player must finish resolving Step 11 of the original Shooting Attack that triggered the Reaction.",
          },
        ],
      },
    ],
  },
  /* --- Légion VIII — Night Lords --- */
  VIII: {
    nomRite: "Legio Astartes Night Lords",
    sections: [
      {
        titre: "Legion Tactica",
        paragraphes: [
          {
            texte:
              "All Models with the Night Lords Trait (except Models of the Vehicle Type) are subject to the following Special Rule:",
          },
          { texte: "A Talent for Murder", style: "bold" },
          {
            texte:
              "Night Lords have an improved Weapon Skill Characteristic when fighting Units subject to Tactical Statuses.",
            style: "bold",
          },
          {
            texte:
              "When Locked in Combat with Units that include at least one Model subject to any Tactical Status, Models with this Special Rule involved in that Combat gain an additional +1 modifier to their Weapon Skill Characteristic until the end of the Phase.",
          },
        ],
      },
      {
        titre: "Gambit",
        paragraphes: [
          {
            texte:
              "When choosing a Gambit, the Controlling Player of a Model with the Night Lords Trait may choose Nostraman Courage instead of another Gambit available to that Model.",
          },
          { texte: "Nostraman Courage", style: "bold" },
          {
            texte:
              "This Gambit allows the Controlling Player to swap the Model fighting in the Challenge.",
            style: "bold",
          },
          {
            texte:
              "This Gambit may only be chosen once per Challenge. If it is adopted, at the start of the Focus Step, the Controlling Player of this Model may immediately return the Model to its Unit as if it were the Resolution Sub-phase. If the Controlling Player chooses to do so, they must choose another Model from that Unit (this may be a Model that is not normally eligible to take part in a Challenge). The chosen Model is removed from the Unit and becomes the Challenger or Challenged Model in place of the original Challenger or Challenged Model that has just been returned to the Unit.",
          },
        ],
      },
      {
        titre: "Advanced Reaction",
        paragraphes: [
          {
            texte:
              "The Controlling Player of Units composed only of Models with the Night Lords Trait may spend Reaction points to make the following Advanced Reaction:",
          },
          { texte: "The First of Virtues", style: "bold" },
          {
            texte:
              "This Reaction allows a Unit to Fall Back when it is the Target of a Charge.",
            style: "bold",
          },
          {
            texte:
              "Trigger: The Reactive Player may declare The First of Virtues Advanced Reaction during Step 4 of the Charge process of a Charge declared by the Active Player targeting a Unit composed only of Models with the Night Lords Trait.",
          },
          {
            texte:
              "Cost: The Reactive Player must spend 1 point of their Reaction Allotment to declare The First of Virtues Advanced Reaction, paid as soon as it is declared.",
          },
          {
            texte:
              "Target: The Target Unit is always the Unit whose Charge triggers the Reaction. The Reacting Unit is always the Unit declared as the target of the Charge that triggers this Reaction.",
          },
          {
            texte:
              "Process: 1) Once this Reaction is declared, the Reacting Unit must immediately make a Fall Back Move as if it were subject to the Routed Tactical Status. 2) Once this Fall Back Move has been made, the Reacting Unit does not gain the Routed Tactical Status.",
          },
        ],
      },
    ],
  },
  /* --- Légion VII — Imperial Fists --- */
  VII: {
    nomRite: "Legio Astartes Imperial Fists",
    sections: [
      {
        titre: "Legion Tactica",
        paragraphes: [
          {
            texte:
              "All Models with the Imperial Fists Trait (except Models of the Vehicle Type) are subject to the following Special Rule:",
          },
          { texte: "Fire Discipline", style: "bold" },
          {
            texte:
              "Imperial Fists gain a +1 bonus when making Hit Tests with multiple Bolt and Auto Weapons.",
            style: "bold",
          },
          {
            texte:
              "When making a Shooting Attack for a Unit composed only of Models with this Special Rule, add +1 to the result of Hit Tests made for the attacks of any Fire Group that totals more than five Dice or attacks and has the Bolt or Auto Trait.",
          },
        ],
      },
      {
        titre: "Gambit",
        paragraphes: [
          {
            texte:
              "When choosing a Gambit, the Controlling Player of a Model with the Imperial Fists Trait may choose An Impregnable Wall instead of another Gambit available to that Model.",
          },
          { texte: "An Impregnable Wall", style: "bold" },
          {
            texte:
              "The Controlling Player may limit the Damage suffered in a Challenge.",
            style: "bold",
          },
          {
            texte:
              "While this Gambit is chosen, the Controlling Player does not add their Combat Initiative to the result of the Focus Roll, but instead gains the Eternal Warrior (1) Special Rule for the duration of the Strike Step.",
          },
        ],
      },
      {
        titre: "Advanced Reaction",
        paragraphes: [
          {
            texte:
              "The Controlling Player of Units composed only of Models with the Imperial Fists Trait may spend Reaction points to make the following Advanced Reaction:",
          },
          { texte: "Bastion of Fire", style: "bold" },
          {
            texte:
              "This Reaction allows the Reacting Unit to make a Shooting Attack against an enemy Unit that moves within range.",
            style: "bold",
          },
          {
            texte:
              "Trigger: Once per Battle, the Reactive Player may declare the Bastion of Fire Advanced Reaction during Step 2 of the Move Sub-phase process, if an enemy Unit ends a move within 10\" and in Line of Sight of a Unit controlled by the Reactive Player that is able to make a Shooting Attack with at least one Weapon against the enemy Unit. The Reacting Unit must be a Unit controlled by the Reactive Player composed only of Models with the Imperial Fists Trait, and of a Type other than Vehicle.",
          },
          {
            texte:
              "Cost: The Reactive Player must spend 1 point of their Reaction Allotment to declare the Bastion of Fire Advanced Reaction, paid as soon as it is declared.",
          },
          {
            texte:
              "Target: The Target Unit is always the Unit whose move triggers the Reaction.",
          },
          {
            texte:
              "Process: 1) Once the Bastion of Fire Advanced Reaction is declared, the Reactive Player makes a Shooting Attack with the Reacting Unit, targeting only the enemy Unit that triggered the Reaction. 2) Once the Shooting Attack made as part of this Reaction has been resolved, including the removal of casualties, the Active Player must resume and complete their Movement Phase.",
          },
        ],
      },
    ],
  },
  /* --- Légion XV — Thousand Sons --- */
  XV: {
    nomRite: "Legio Astartes Thousand Sons",
    sections: [
      {
        titre: "Legion Tactica",
        paragraphes: [
          {
            texte:
              "All Models with the Thousand Sons Trait (except Models of the Vehicle Type) are subject to the following Special Rule:",
          },
          { texte: "Arcana of the Cult", style: "bold" },
          {
            texte:
              "All Models with the Thousand Sons Trait are Psykers and have a higher Willpower Characteristic than their profile shows.",
            style: "bold",
          },
          {
            texte:
              "Models with this Special Rule gain a +1 bonus to the Base Value of their Willpower Characteristic, and gain the Psyker Trait.",
          },
        ],
      },
      {
        titre: "Gambit",
        paragraphes: [
          {
            texte:
              "When choosing a Gambit, the Controlling Player of a Model with the Thousand Sons Trait may choose Prophetic Duellist instead of another Gambit available to that Model.",
          },
          { texte: "Prophetic Duellist", style: "bold" },
          {
            texte:
              "When this Gambit is chosen, the Controlling Player may use their Model's Willpower Characteristic instead of the result of a Focus Roll.",
            style: "bold",
          },
          {
            texte:
              "If this Gambit is chosen, immediately after making their Focus Roll during the Focus Step, the Controlling Player may replace the result of their Focus Roll (after modifiers) with the value of that Model's Willpower Characteristic.",
          },
        ],
      },
      {
        titre: "Advanced Reaction",
        paragraphes: [
          {
            texte:
              "The Controlling Player of Units composed only of Models with the Thousand Sons Trait may spend Reaction points to make the following Advanced Reaction:",
          },
          { texte: "Mental Fortress", style: "bold" },
          {
            texte:
              "This Reaction gives the Reacting Unit an additional Save against attacks that target it.",
            style: "bold",
          },
          {
            texte:
              "Trigger: Once per Battle, the Reactive Player may declare the Mental Fortress Advanced Reaction during Step 4 of the Shooting Attack process of a Shooting Attack declared by the Active Player that targets a Unit composed only of Models with the Thousand Sons Trait and that includes no Models of the Vehicle Type.",
          },
          {
            texte:
              "Cost: The Reactive Player must spend 1 point of their Reaction Allotment to declare the Mental Fortress Advanced Reaction, paid as soon as it is declared.",
          },
          {
            texte:
              "Target: The Target Unit is always the Unit whose Shooting Attack triggers the Reaction. The Reacting Unit is always the Unit declared as the target of the Shooting Attack that triggers this Reaction.",
          },
          {
            texte:
              "Process: 1) Once the Mental Fortress Advanced Reaction has been declared, the Reactive Player must make a Willpower Test for the Reacting Unit. 2) If the Willpower Test is passed, the Reacting Unit gains a 3+ Invulnerable Save against all Wounds inflicted by the Shooting Attack that triggered the Reaction. 3) If the Willpower Test is failed, the Reacting Unit gains a 5+ Invulnerable Save against all Wounds inflicted by the Shooting Attack that triggered the Reaction. In addition, both the Reacting Unit and the Target Unit suffer the Warp Rupture result from the Perils of the Warp table, which must be resolved immediately after Step 11 of the Shooting Phase.",
          },
        ],
      },
    ],
  },
  /* --- Légion XVIII — Salamanders --- */
  XVIII: {
    nomRite: "Legio Astartes Salamanders",
    sections: [
      {
        titre: "Legion Tactica",
        paragraphes: [
          {
            texte:
              "All Models with the Salamanders Trait (except Models of the Vehicle Type) are subject to the following Special Rules:",
          },
          { texte: "Promethean Endurance", style: "bold" },
          {
            texte:
              "Wound Tests made against Salamanders fail on an unmodified result of 1 or 2.",
            style: "bold",
          },
          {
            texte:
              "Wound Tests that roll a result of 1 or 2 when targeting a Unit composed only of Models with this Special Rule are always failures, regardless of the Strength Characteristic of a Hit and despite any Special Rules that set a Target Number for Wound Tests. This Special Rule does not affect Armour Penetration Tests.",
          },
          { texte: "Blood of Fire", style: "bold" },
          {
            texte:
              "Salamanders Units may ignore Tactical Status Tests caused by Flame Weapons.",
            style: "bold",
          },
          {
            texte:
              "A Unit composed only of Models with this Special Rule is immune to all variants of the Panic (X) Special Rule on Weapons with the Flame Trait.",
          },
        ],
      },
      {
        titre: "Gambit",
        paragraphes: [
          {
            texte:
              "When choosing a Gambit, the Controlling Player of a Model with the Salamanders Trait may choose Dutiful Sacrifice instead of another Gambit available to that Model.",
          },
          { texte: "Dutiful Sacrifice", style: "bold" },
          {
            texte:
              "This Gambit allows the Player to suffer Wounds in exchange for a bonus to their own Focus Roll.",
            style: "bold",
          },
          {
            texte:
              "If this Gambit is chosen, the Controlling Player may add a bonus of 1, 2 or 3 to their Focus Roll. During the Apply Damage from Unsaved Wounds Step of the opponent's Strike Step, the Model that adopted this Gambit suffers a number of Wounds equal to the bonus this Gambit granted to the Focus Roll. Each of these Wounds has an AP Characteristic of 5 and a Damage Characteristic of 1, and Armour Saves, Invulnerable Saves and Damage Mitigation Rolls may be attempted against them as normal.",
          },
        ],
      },
      {
        titre: "Advanced Reaction",
        paragraphes: [
          {
            texte:
              "The Controlling Player of Units composed only of Models with the Salamanders Trait may spend Reaction points to make the following Advanced Reaction:",
          },
          { texte: "Burden of Abnegation", style: "bold" },
          {
            texte:
              "This Reaction allows the Reacting Unit to increase certain Characteristics during the Assault Phase.",
            style: "bold",
          },
          {
            texte:
              "Trigger: Once per Battle, the Reactive Player may declare the Burden of Abnegation Advanced Reaction at the start of Step 3 of a Charge that the Active Player declares against a Unit controlled by the Reactive Player composed only of Models with the Salamanders Trait that are not of the Vehicle Type.",
          },
          {
            texte:
              "Cost: The Reactive Player must spend 1 point of their Reaction Allotment to declare the Burden of Abnegation Advanced Reaction, paid as soon as it is declared.",
          },
          {
            texte:
              "Target: For a Burden of Abnegation Advanced Reaction, the Reacting Unit is always the Unit targeted by the Charge that triggers this Reaction.",
          },
          {
            texte:
              "Process: 1) The Weapon Skill, Strength and Attacks Characteristics of all Models in the Reacting Unit are modified by +1 until the end of the current Assault Phase. 2) In the following Statuses Sub-phase, the Reactive Player must roll a D6 for each Model in the Reacting Unit. For each result of 1, the Reacting Unit suffers 1 automatic Wound with a Damage Characteristic of 1 and an AP of 5, against which Saving Throws and Damage Mitigation Rolls may be attempted as normal.",
          },
        ],
      },
    ],
  },
  /* --- Légion XIII — Ultramarines --- */
  XIII: {
    nomRite: "Legio Astartes Ultramarines",
    sections: [
      {
        titre: "Legion Tactica",
        paragraphes: [
          {
            texte:
              "All Models with the Ultramarines Trait (except Models of the Vehicle Type) are subject to the following Special Rule:",
          },
          { texte: "Tactical Flexibility", style: "bold" },
          {
            texte:
              "An Ultramarines Army may lower the cost of one Reaction each turn.",
            style: "bold",
          },
          {
            texte:
              "Once per turn, when declaring a Reaction for a Unit composed only of Models with this Special Rule, the Controlling Player may activate the Tactical Flexibility Special Rule. When they do so, the Reaction point cost of the declared Reaction is modified by -1, to a minimum of 0.",
          },
        ],
      },
      {
        titre: "Gambit",
        paragraphes: [
          {
            texte:
              "When choosing a Gambit, the Controlling Player of a Model with the Ultramarines Trait may choose Aegis of Wisdom instead of another Gambit available to that Model.",
          },
          { texte: "Aegis of Wisdom", style: "bold" },
          {
            texte:
              "This Gambit allows Models to gain bonuses to the Focus Roll.",
            style: "bold",
          },
          {
            texte:
              "When this Gambit is chosen, the Controlling Player gains no Outside Support bonus to their Focus Roll, but instead adds a +1 modifier to their Focus Roll for each friendly Model of the Command Sub-type with the Ultramarines Trait on the Battlefield, not counting the Model for which this Gambit was chosen.",
          },
        ],
      },
      {
        titre: "Advanced Reaction",
        paragraphes: [
          {
            texte:
              "The Controlling Player of Units composed only of Models with the Ultramarines Trait may spend Reaction points to make the following Advanced Reaction:",
          },
          { texte: "Riposte Strike", style: "bold" },
          {
            texte:
              "This Reaction allows a Unit to return fire against a Shooting Attack aimed at a friendly Unit.",
            style: "bold",
          },
          {
            texte:
              "Trigger: Once per Battle, the Reactive Player may declare the Riposte Strike Advanced Reaction in the Shooting Phase, during Step 3 of the Shooting Attack sequence of any Shooting Attack made by the Active Player that targets a Unit composed only of Models with the Ultramarines Trait.",
          },
          {
            texte:
              "Cost: The Reactive Player must spend 1 point of their Reaction Allotment to declare the Riposte Strike Advanced Reaction, paid as soon as it is declared.",
          },
          {
            texte:
              "Target: For the Riposte Strike Advanced Reaction, the Target Unit is always the Unit whose Shooting Attack triggers the Reaction. The Reactive Player may choose the Reacting Unit, as long as it meets the following criteria: it is not the target of the enemy Shooting Attack that triggers this Reaction; at least one Model in the Unit has Line of Sight to the enemy Unit that triggers this Reaction; it is eligible to make a Reaction; it is eligible to make a Shooting Attack; it is composed entirely of Models with the Ultramarines Trait.",
          },
          {
            texte:
              "Process: 1) Once the Reacting Unit has been chosen, the Active Player must resolve the remaining Steps of the Shooting Attack process as normal, up to the start of Step 11. 2) Before resolving Step 11, the Reactive Player makes a Shooting Attack with the Reacting Unit, targeting only the Target Unit. 3) Once this Shooting Attack has been resolved, including the removal of Casualties, the Players must finish resolving Step 11 of the Shooting Attack that originally triggered the Reaction.",
          },
        ],
      },
    ],
  },
  /* --- Légion VI — Space Wolves --- */
  VI: {
    nomRite: "Legio Astartes Space Wolves",
    sections: [
      {
        titre: "Legion Tactica",
        paragraphes: [
          {
            texte:
              "All Models with the Space Wolves Trait (except Models of the Vehicle Type) are subject to the following Special Rule:",
          },
          { texte: "The Hunter's Strike", style: "bold" },
          {
            texte:
              "Space Wolves make a longer Set-up Move.",
            style: "bold",
          },
          {
            texte:
              "Models with this Special Rule must add +2\" to the distance of any Set-up Move, up to a maximum of 6\".",
          },
        ],
      },
      {
        titre: "Gambit",
        paragraphes: [
          {
            texte:
              "When choosing a Gambit, the Controlling Player of a Model with the Space Wolves Trait may choose one of the following Gambits instead of another Gambit available to that Model.",
          },
          { texte: "No Prey Escapes", style: "bold" },
          {
            texte:
              "This Gambit means that the Challenge only ends when one or both Models are Removed as Casualties.",
            style: "bold",
          },
          {
            texte:
              "When this Gambit is chosen, the opponent never has the option of moving on to the Glory Step, regardless of which Player has the Challenge Advantage, which is the Active Player, or the effects of any other Gambit or Special Rule, until at least one of the Models is Removed as a Casualty.",
          },
          { texte: "A Saga Woven in Glory", style: "bold" },
          {
            texte:
              "This Gambit increases the Attacks Characteristic of a Unit accompanying a Model in a Challenge.",
            style: "bold",
          },
          {
            texte:
              "If a Model adopting this Gambit wins the Challenge and the opposing Model is Removed as a Casualty, all Models in the same Unit as the Model adopting this Gambit gain a +1 modifier to their Attacks Characteristic in the following Fight Sub-phase.",
          },
        ],
      },
      {
        titre: "Advanced Reaction",
        paragraphes: [
          {
            texte:
              "The Controlling Player of Units composed only of Models with the Space Wolves Trait may spend Reaction points to make the following Advanced Reaction:",
          },
          { texte: "Bestial Savagery", style: "bold" },
          {
            texte:
              "This Reaction grants the Reacting Unit a Damage Mitigation Roll against Wounds in the Shooting Phase, and allows it to advance towards an enemy Unit.",
            style: "bold",
          },
          {
            texte:
              "Trigger: Once per Battle, the Reactive Player may declare the Bestial Savagery Advanced Reaction in the Shooting Phase, during Step 3 of any Shooting Attack made by the Active Player targeting a Unit composed only of Models with the Space Wolves Trait.",
          },
          {
            texte:
              "Cost: The Reactive Player must spend 1 point of their Reaction Allotment to declare the Bestial Savagery Advanced Reaction, paid as soon as it is declared.",
          },
          {
            texte:
              "Target: The Target Unit is always the Unit whose Shooting Attack triggers the Reaction. The Reacting Unit is always the target Unit of the Shooting Attack that triggers the Reaction.",
          },
          {
            texte:
              "Process: 1) Once the Bestial Savagery Advanced Reaction has been declared, the Active Player must resolve the remaining Steps of the Shooting Attack process as normal. Models in the Reacting Unit gain the Feel No Pain (5+) Special Rule for the duration of this Shooting Phase. 2) As soon as Step 11 of the Shooting Attack that triggered this Reaction has been resolved, the Reacting Unit must Move following the Set-up Move procedure, as if the Target Unit were the Target of a Charge. 3) If this Move brings at least one Model into Base Contact with the enemy, the Reacting Unit counts as having made a successful Charge in the following Assault Phase, then in the following Morale Sub-phase it automatically passes all Tests it is required to make, treating the Controlling Player as having rolled a double 1 for each required Test.",
          },
        ],
      },
    ],
  },
  /* --- Légion XVI — Sons of Horus --- */
  XVI: {
    nomRite: "Legio Astartes Sons of Horus",
    sections: [
      {
        titre: "Legion Tactica",
        paragraphes: [
          {
            texte:
              "All Models with the Sons of Horus Trait (except Models of the Vehicle Type) are subject to the following Special Rule:",
          },
          { texte: "Sowers of Death", style: "bold" },
          {
            texte:
              "Sons of Horus make Volley Attacks using their full Ballistic Skill Characteristic.",
            style: "bold",
          },
          {
            texte:
              "When a Model with this Special Rule makes Volley Attacks, it is not reduced to making Snap Shots.",
          },
        ],
      },
      {
        titre: "Gambit",
        paragraphes: [
          {
            texte:
              "When choosing a Gambit, the Controlling Player of a Model with the Sons of Horus Trait may choose Merciless Strike instead of another Gambit available to that Model.",
          },
          { texte: "Merciless Strike", style: "bold" },
          {
            texte:
              "When this Gambit is chosen, the Controlling Player's Model gains the Phage (T) Special Rule.",
            style: "bold",
          },
          {
            texte:
              "This Gambit may only be chosen during the first Face-off Step of a Challenge involving this Model. While this Gambit is adopted, any Weapon this Model uses during this Challenge gains the Phage (T) Special Rule for the duration of that Strike Step.",
          },
        ],
      },
      {
        titre: "Advanced Reaction",
        paragraphes: [
          {
            texte:
              "The Controlling Player of Units composed only of Models with the Sons of Horus Trait may spend Reaction points to make the following Advanced Reaction:",
          },
          { texte: "Warrior's Pride", style: "bold" },
          {
            texte:
              "This Reaction allows the Reacting Unit to ignore Challenges from an opponent with a lower Weapon Skill Characteristic.",
            style: "bold",
          },
          {
            texte:
              "Trigger: The Reactive Player may declare this Warrior's Pride Advanced Reaction when a Unit composed of Models with the Sons of Horus Trait is in Combat with an enemy Unit and the Active Player chooses a Model to be the Challenger.",
          },
          {
            texte:
              "Cost: The Reactive Player must spend 1 point of their Reaction Allotment to declare a Warrior's Pride Advanced Reaction, paid as soon as it is declared.",
          },
          {
            texte:
              "Target: For a Warrior's Pride Advanced Reaction, the Target Unit is always the Unit that includes the enemy Model chosen as the Challenger. The Reacting Unit is the Unit including at least one Model with the Sons of Horus Trait that could be chosen as the Challenged Model.",
          },
          {
            texte:
              "Process: If the Base Value of the Challenger's Weapon Skill Characteristic is lower than that of every Model in the Reacting Unit potentially eligible to accept the Challenge, the Reactive Player may decline the Challenge. In that case, the Challenge Sub-phase immediately ends and no Model becomes subject to the Disgraced Tactical Status.",
          },
        ],
      },
    ],
  },
  /* --- Légion XVII — Word Bearers --- */
  XVII: {
    nomRite: "Legio Astartes Word Bearers",
    sections: [
      {
        titre: "Legion Tactica",
        paragraphes: [
          {
            texte:
              "All Models with the Word Bearers Trait (except Models of the Vehicle Type) are subject to the following Special Rule:",
          },
          { texte: "Unshakeable Conviction", style: "bold" },
          {
            texte:
              "Word Bearers gain bonus Combat Resolution Points.",
            style: "bold",
          },
          {
            texte:
              "When resolving a Combat in the Resolution Sub-phase of the Assault Phase, score 1 Combat Resolution Point if at least one friendly Model involved in that Combat has the Word Bearers Trait.",
          },
        ],
      },
      {
        titre: "Gambit",
        paragraphes: [
          {
            texte:
              "When choosing a Gambit, the Controlling Player of a Model with the Word Bearers Trait may choose Beseech the Gods instead of another Gambit available to that Model.",
          },
          { texte: "Beseech the Gods", style: "bold" },
          {
            texte:
              "This Gambit allows the Controlling Player to make a Willpower Test to modify their Characteristics.",
            style: "bold",
          },
          {
            texte:
              "This Gambit may only be chosen during the first Face-off Step of a Challenge involving this Model. If this Gambit is chosen, the Controlling Player immediately makes a Willpower Test for this Model. If the Test is passed, until the end of this Challenge Sub-phase, this Model adds +1 to its Strength and Attacks Characteristics. If the Test is failed, this Model suffers 1 Wound with an AP Characteristic of 2 and a Damage Characteristic of 1. No Saving Throws or Damage Mitigation Rolls may be attempted to discard this Wound.",
          },
        ],
      },
      {
        titre: "Advanced Reaction",
        paragraphes: [
          {
            texte:
              "The Controlling Player of Units composed only of Models with the Word Bearers Trait may spend Reaction points to make the following Advanced Reaction:",
          },
          { texte: "Glorious Martyrdom", style: "bold" },
          {
            texte:
              "This Reaction allows the Controlling Player to allocate all Wounds inflicted by a Fire Group to a single Model of their choice.",
            style: "bold",
          },
          {
            texte:
              "Trigger: Once per Battle, the Reactive Player may declare the Glorious Martyrdom Advanced Reaction in the Shooting Phase, during Step 5 of the Shooting Attack sequence of any Shooting Attack made by the Active Player targeting a Unit composed only of Models with the Word Bearers Trait.",
          },
          {
            texte:
              "Cost: The Reactive Player must spend 1 point of their Reaction Allotment to declare the Glorious Martyrdom Advanced Reaction, paid as soon as it is declared.",
          },
          {
            texte:
              "Target: For the Glorious Martyrdom Advanced Reaction, the Reacting Unit is always the target Unit of the Shooting Attack that triggers the Reaction.",
          },
          {
            texte:
              "Process: During Step 5 of the Shooting Attack sequence, the Reactive Player must choose a Model in the Reacting Unit. Until the current Fire Group and any Fire Groups resulting from it have been resolved, only the chosen Model can be the Target Model. If this Model is Removed as a Casualty, the remainder of the Fire Group and any Fire Groups resulting from it are discarded, then the Active Player moves on to Step 10 of the Shooting Attack.",
          },
        ],
      },
    ],
  },
  /* --- Légion XIV — Death Guard --- */
  XIV: {
    nomRite: "Legio Astartes Death Guard",
    sections: [
      {
        titre: "Legion Tactica",
        paragraphes: [
          {
            texte:
              "All Models with the Death Guard Trait (except Models of the Vehicle Type) are subject to the following Special Rule:",
          },
          { texte: "Resolute Advance", style: "bold" },
          {
            texte:
              "Models with this Special Rule may Move and still benefit from the Heavy (X) Special Rule.",
            style: "bold",
          },
          {
            texte:
              "A Model with this Special Rule that has not Moved more than 4\" in the Movement Phase and has not Rushed may still benefit from any variant of the Heavy (X) Special Rule on its Weapons. In addition, the Controlling Player of a Model with this Special Rule may ignore negative Modifiers to that Model's Movement Characteristic caused by moving through Difficult Terrain.",
          },
        ],
      },
      {
        titre: "Gambit",
        paragraphes: [
          {
            texte:
              "When choosing a Gambit, the Controlling Player of a Model with the Death Guard Trait may choose Unshakeable Resistance instead of another Gambit available to that Model.",
          },
          { texte: "Unshakeable Resistance", style: "bold" },
          {
            texte:
              "This Gambit allows a Model to increase its Toughness Characteristic.",
            style: "bold",
          },
          {
            texte:
              "If this Gambit is chosen, the Toughness Characteristic of the Model adopting it is replaced by the Base Value of the opposing Model's Weapon Skill Characteristic for the duration of the following Strike Step.",
          },
        ],
      },
      {
        titre: "Advanced Reaction",
        paragraphes: [
          {
            texte:
              "The Controlling Player of Units composed only of Models with the Death Guard Trait may spend Reaction points to make the following Advanced Reaction:",
          },
          { texte: "Endurance of Barbarus", style: "bold" },
          {
            texte:
              "This Reaction grants the Reacting Unit a Damage Mitigation Roll and allows it to recover from Tactical Statuses.",
            style: "bold",
          },
          {
            texte:
              "Trigger: Once per Battle, the Reactive Player may declare the Endurance of Barbarus Advanced Reaction during Step 4 of any Shooting Attack declared by the Active Player in the Shooting Phase that targets a Unit composed only of Models with the Death Guard Trait that are not of the Vehicle Type.",
          },
          {
            texte:
              "Cost: The Reactive Player must spend 1 point of their Reaction Allotment to declare the Endurance of Barbarus Advanced Reaction, paid as soon as it is declared.",
          },
          {
            texte:
              "Target: The Target Unit is always the Unit whose Shooting Attack triggers the Reaction. The Reacting Unit is always the Unit declared as the target of the Shooting Attack that triggers this Reaction.",
          },
          {
            texte:
              "Process: 1) All Models in the Reacting Unit are immediately cleared of all Tactical Statuses. 2) For the duration of the current Shooting Phase, all Models in the Reacting Unit gain the Feel No Pain (5+) Special Rule. 3) For the duration of the current Shooting Phase, the Reactive Player automatically passes any Cool Test or Leadership Test made for the Reacting Unit.",
          },
        ],
      },
    ],
  },
  /* --- Légion XIX — Raven Guard --- */
  XIX: {
    nomRite: "Legio Astartes Raven Guard",
    sections: [
      {
        titre: "Legion Tactica",
        paragraphes: [
          {
            texte:
              "All Models with the Raven Guard Trait (except Models of the Vehicle Type) are subject to the following Special Rule:",
          },
          { texte: "Shadow Walkers", style: "bold" },
          {
            texte:
              "Long-range Shooting Attacks find it harder to hit Raven Guard Models.",
            style: "bold",
          },
          {
            texte:
              "When a Unit composed only of Models with this Special Rule is the target of a Shooting Attack, all attacks must be made as Snap Shots if the distance between the Target Unit and the closest Model of the Attacking Unit is 18\" or more.",
          },
        ],
      },
      {
        titre: "Gambit",
        paragraphes: [
          {
            texte:
              "When choosing a Gambit, the Controlling Player of a Model with the Raven Guard Trait may choose Decapitation Strike instead of another Gambit available to that Model.",
          },
          { texte: "Decapitation Strike", style: "bold" },
          {
            texte:
              "This Gambit allows the Model to make one attack first, then follow it up with its remaining attacks if the first succeeds.",
            style: "bold",
          },
          {
            texte:
              "This Gambit may be chosen once per Challenge. When it is chosen, no Focus Roll is made; instead, the Controlling Player of the Model adopting this Gambit makes a single attack at the end of the Focus Step. If the Hit Test and Wound Test made for this attack both succeed (that is, they reach their Target Number), the Controlling Player of the Model adopting this Gambit may then make the rest of the attacks that Model is entitled to make in the current Strike Step, minus the single attack already made. If the Hit Test or Wound Test for the initial attack fails, the Model adopting this Gambit may make no further Attacks in this Strike Step.",
          },
        ],
      },
      {
        titre: "Advanced Reaction",
        paragraphes: [
          {
            texte:
              "The Controlling Player of Units composed only of Models with the Raven Guard Trait may spend Reaction points to make the following Advanced Reaction:",
          },
          { texte: "Veil of Shadow", style: "bold" },
          {
            texte:
              "This Reaction allows the Reacting Unit to Move when targeted by a Shooting Attack, and to gain a Damage Mitigation Roll for the duration of the Shooting Phase.",
            style: "bold",
          },
          {
            texte:
              "Trigger: Once per Battle, the Reactive Player may declare the Veil of Shadow Advanced Reaction when the Active Player targets with a Shooting Attack a Unit they control composed only of Models with the Raven Guard Trait that are not of the Vehicle Type.",
          },
          {
            texte:
              "Cost: The Reactive Player must spend 1 point of their Reaction Allotment to declare the Veil of Shadow Advanced Reaction, paid as soon as it is declared.",
          },
          {
            texte:
              "Target: For a Veil of Shadow Advanced Reaction, the Reacting Unit is always the target Unit of the Shooting Attack that triggers this Reaction.",
          },
          {
            texte:
              "Process: 1) All Models in the Reacting Unit may Move following the normal rules a distance equal to the value of their Initiative Characteristic, but may not Rush. If, after this Move, no Model in the Target Unit is in Line of Sight and/or in Range of any Model in the Attacking Unit, the Active Player may not choose another target for that Attacking Unit in the current Shooting Phase. 2) Once the Reactive Player has resolved this Move, Models in the Reacting Unit all gain the Shrouded (5+) Special Rule for the rest of the current Shooting Phase, and the Active Player may move on to Step 2 of the Shooting Attack sequence.",
          },
        ],
      },
    ],
  },
  /* --- Légion V — White Scars --- */
  V: {
    nomRite: "Legio Astartes White Scars",
    sections: [
      {
        titre: "Legion Tactica",
        paragraphes: [
          {
            texte:
              "All Models with the White Scars Trait (except Models of the Vehicle Type) are subject to the following Special Rule:",
          },
          { texte: "Quick to Act", style: "bold" },
          {
            texte:
              "The White Scars Player may increase the Movement Characteristic of their Models.",
            style: "bold",
          },
          {
            texte:
              "At the start of any of their Player Turns, the Controlling Player may increase the Movement Characteristic of any Model with this Special Rule and a Movement Characteristic with a Base Value of at least 1, by applying a +2 modifier to that Characteristic until the end of that Player Turn.",
          },
        ],
      },
      {
        titre: "Gambit",
        paragraphes: [
          {
            texte:
              "When choosing a Gambit, the Controlling Player of a Model with the White Scars Trait may choose The Way of the Warrior instead of another Gambit available to that Model.",
          },
          { texte: "The Way of the Warrior", style: "bold" },
          {
            texte:
              "The Controlling Player may attempt to gain a bonus to the Focus Roll.",
            style: "bold",
          },
          {
            texte:
              "When this Gambit is chosen, before making the Focus Roll, the Controlling Player must declare whether they choose to “Strike Low” (predicting that the result of the next Focus Roll will be 1 to 3 before any modifiers) or to “Strike High” (predicting that the result of the next Focus Roll will be 4 to 6 before any modifiers). If the result of the Focus Roll matches their prediction, they may ignore all negative modifiers and apply only positive modifiers to their Focus Roll.",
          },
        ],
      },
      {
        titre: "Advanced Reaction",
        paragraphes: [
          {
            texte:
              "The Controlling Player of Units composed only of Models with the White Scars Trait may spend Reaction points to make the following Advanced Reaction:",
          },
          { texte: "In Pursuit of the Wind", style: "bold" },
          {
            texte:
              "This Advanced Reaction allows the Controlling Player to make an additional Move with the Reacting Unit.",
            style: "bold",
          },
          {
            texte:
              "Trigger: The Reactive Player may declare an In Pursuit of the Wind Advanced Reaction during Step 2 of the Move Sub-phase process, if an enemy Unit ends a Move within 12\" and in Line of Sight of a Unit composed only of Models with the White Scars Trait controlled by the Reactive Player.",
          },
          {
            texte:
              "Cost: The Reactive Player must spend 1 point of their Reaction Allotment to declare an In Pursuit of the Wind Advanced Reaction, paid as soon as it is declared.",
          },
          {
            texte:
              "Target: The Target Unit is always the Unit whose Move triggers the Advanced Reaction. Once the cost has been paid, the Reactive Player must choose a Unit they control composed only of Models with the White Scars Trait, within 12\" and in Line of Sight of the Target Unit. The chosen Unit is the Reacting Unit.",
          },
          {
            texte:
              "Process: 1) Once the Target Unit has finished its Move, the Reactive Player may make one with the Reacting Unit, following the normal Movement Rules, applying any modifiers for Difficult Terrain and making Dangerous Terrain Tests where required, but the Reacting Unit may not Rush. 2) Once the Reacting Unit has moved, the Active Player must resume and complete their Movement Phase.",
          },
        ],
      },
    ],
  },
  /* --- Légion IX — Blood Angels --- */
  IX: {
    nomRite: "Legio Astartes Blood Angels",
    sections: [
      {
        titre: "Legion Tactica",
        paragraphes: [
          {
            texte:
              "All Models with the Blood Angels Trait (except Models of the Vehicle Type) are subject to the following Special Rule:",
          },
          { texte: "Crimson Fury", style: "bold" },
          {
            texte:
              "When Blood Angels Charge successfully, the Strength of their Attacks increases.",
            style: "bold",
          },
          {
            texte:
              "In any turn in which Models with this Special Rule have made a Charge Move, the value of their Strength Characteristic is modified by +1 until the end of the turn.",
          },
        ],
      },
      {
        titre: "Gambit",
        paragraphes: [
          {
            texte:
              "When choosing a Gambit, the Controlling Player of a Model with the Blood Angels Trait may choose Slave to the Red Thirst instead of another Gambit available to that Model.",
          },
          { texte: "Slave to the Red Thirst", style: "bold" },
          {
            texte:
              "This Model may ignore modifiers for lost Wounds, but does not gain Outside Support.",
            style: "bold",
          },
          {
            texte:
              "If this Gambit is chosen, the Model adopting it may ignore all negative modifiers to the Focus Roll for lost Wounds, and the Damage Characteristic of each Wound inflicted on the opponent is modified by +1. While the Model adopts this Gambit, it gains no bonus to the Focus Roll from Outside Support.",
          },
        ],
      },
      {
        titre: "Advanced Reaction",
        paragraphes: [
          {
            texte:
              "The Controlling Player of Units composed only of Models with the Blood Angels Trait may spend Reaction points to make the following Advanced Reaction:",
          },
          { texte: "The Wrath of Angels", style: "bold" },
          {
            texte:
              "This Reaction allows the Reacting Unit to advance towards an enemy Unit that targets it with a Shooting Attack.",
            style: "bold",
          },
          {
            texte:
              "Trigger: Once per Battle, the Reactive Player may declare The Wrath of Angels Advanced Reaction in the Shooting Phase, during Step 4 of the Shooting Attack sequence of any Shooting Attack made by the Active Player that targets a Unit controlled by the Reactive Player composed only of Models with the Blood Angels Trait.",
          },
          {
            texte:
              "Cost: The Reactive Player must spend 1 point of their Reaction Allotment to declare The Wrath of Angels Advanced Reaction, paid as soon as it is declared.",
          },
          {
            texte:
              "Target: The Target Unit is always the Unit whose Shooting Attack triggers the Reaction. The Reacting Unit is always the Unit targeted by the Shooting Attack that triggers the Reaction.",
          },
          {
            texte:
              "Process: 1) Once The Wrath of Angels Advanced Reaction has been declared, the Active Player must resolve the remaining Steps of the Shooting Attack process as normal, up to the start of Step 11. 2) As soon as Step 11 of the Shooting Attack that triggered this Reaction has been resolved, each Model in the Reacting Unit must Move following the procedure for a normal Move, directly towards the closest Model in the Target Unit, covering the maximum possible distance while remaining at least 1\" away from any enemy Model. 3) After resolving this Move, if at least one Model in the Reacting Unit is within 6\" of a Model in the Target Unit, the Controlling Player of the Target Unit must make a Cool Test for it in the Morale Sub-phase of the same Player Turn. If this Test is failed, all Models in the Target Unit gain the Pinned Status.",
          },
        ],
      },
    ],
  },
  /* --- Légion X — Iron Hands --- */
  X: {
    nomRite: "Legio Astartes Iron Hands",
    sections: [
      {
        titre: "Legion Tactica",
        paragraphes: [
          {
            texte:
              "All Models with the Iron Hands Trait (except Models of the Vehicle Type) are subject to the following Special Rule:",
          },
          { texte: "The Scales of the Gorgon", style: "bold" },
          {
            texte:
              "Shooting Attacks that target the Iron Hands suffer a Strength penalty.",
            style: "bold",
          },
          {
            texte:
              "The Strength of attacks made as part of a Shooting Attack is modified by -1 when resolving Wound Tests against a Unit composed only of Models with this Special Rule.",
          },
        ],
      },
      {
        titre: "Gambit",
        paragraphes: [
          {
            texte:
              "When choosing a Gambit, the Controlling Player of a Model with the Iron Hands Trait may choose A Legion Unto Himself instead of another Gambit available to that Model.",
          },
          { texte: "A Legion Unto Himself", style: "bold" },
          {
            texte:
              "The Model benefits more from Outside Support when it adopts this Gambit.",
            style: "bold",
          },
          {
            texte:
              "When this Gambit is chosen, the Model adopting it gains double the normal bonus to its Focus Roll from any Outside Support it benefits from. In addition, while it adopts this Gambit, its opponent can gain at most a +2 bonus from their own Outside Support.",
          },
        ],
      },
      {
        titre: "Advanced Reaction",
        paragraphes: [
          {
            texte:
              "The Controlling Player of Units composed only of Models with the Iron Hands Trait may spend Reaction points to make the following Advanced Reaction:",
          },
          { texte: "Animosity of the Gorgon", style: "bold" },
          {
            texte:
              "This Reaction allows the Reacting Unit to make a Shooting Attack targeting a Charging Unit.",
            style: "bold",
          },
          {
            texte:
              "Trigger: Once per Battle, the Reactive Player may declare the Animosity of the Gorgon Advanced Reaction at the start of Step 3 of the Charge process of any Charge declared by the Active Player that targets a Unit controlled by the Reactive Player composed only of Models with the Iron Hands Trait.",
          },
          {
            texte:
              "Cost: The Reactive Player must spend 1 point of their Reaction Allotment to declare the Animosity of the Gorgon Advanced Reaction, paid as soon as it is declared.",
          },
          {
            texte:
              "Target: The Target Unit is always the Unit whose Charge triggers the Advanced Reaction. The Reacting Unit is always the Unit declared as the target of the Charge that triggers this Reaction.",
          },
          {
            texte:
              "Process: 1) Once the Animosity of the Gorgon Advanced Reaction has been declared, the Reactive Player makes a Shooting Attack with the Reacting Unit. 2) This Shooting Attack must target the Target Unit. It is made using full Ballistic Skill and not as Snap Shots, and may be made with any Ranged Weapon. Until this Shooting Attack has been resolved, the Firepower Characteristic of the Weapons chosen to make it is modified by +1, and they gain the Overload (1) Special Rule. If they already have the Overload (X) Special Rule, the value of X of that Special Rule is increased by +1. 3) After resolving this Shooting Attack, the Active Player moves on to Step 3 of the Charge as normal. The Reactive Player may not make Volley Attacks during Step 4 of the Charge, even if the Active Player chooses to do so.",
          },
        ],
      },
    ],
  },
  /* --- Légion III — Emperor’s Children · Rite « Legio Astartes » --- */
  "legio-astartes-emperors-children": {
    nomRite: "Legio Astartes Emperor's Children",
    sections: [
      {
        titre: "Legion Tactica",
        paragraphes: [
          {
            texte:
              "All Models with the Emperor's Children Trait (except Models of the Vehicle Type) are subject to the following Special Rule:",
          },
          { texte: "Flawless Execution", style: "bold" },
          {
            texte:
              "Emperor's Children gain an Initiative bonus when they Charge successfully.",
            style: "bold",
          },
          {
            texte:
              "In each turn in which they have made a Charge Move, Models with this Special Rule gain an additional +1 modifier to their Combat Initiative until the end of the Phase.",
          },
        ],
      },
      {
        titre: "Gambit",
        paragraphes: [
          {
            texte:
              "When choosing a Gambit, the Controlling Player of a Model with the Emperor's Children Trait may choose Paragon of Excellence instead of another Gambit available to that Model.",
          },
          { texte: "Paragon of Excellence", style: "bold" },
          {
            texte:
              "This Gambit grants the Controlling Player a bonus to the Focus Roll in the first round of a Challenge.",
            style: "bold",
          },
          {
            texte:
              "This Gambit may only be chosen during the first Face-off Step of a Challenge involving this Model. While this Gambit is adopted, during the Focus Step, the Controlling Player gains a +2 modifier to the Focus Roll.",
          },
        ],
      },
      {
        titre: "Advanced Reaction",
        paragraphes: [
          {
            texte:
              "The Controlling Player of Units composed only of Models with the Emperor's Children Trait may spend Reaction points to make the following Advanced Reaction:",
          },
          { texte: "Perfect Parry", style: "bold" },
          {
            texte:
              "This Reaction allows the Reacting Unit to Charge an enemy Unit that has itself just Charged.",
            style: "bold",
          },
          {
            texte:
              "Trigger: Once per Battle, the Reactive Player may declare the Perfect Parry Advanced Reaction at the end of Step 3 of the Charge process of any Charge declared by the Active Player that targets a Unit controlled by the Reactive Player composed only of Models with the Emperor's Children Trait.",
          },
          {
            texte:
              "Cost: The Reactive Player must spend 1 point of their Reaction Allotment to declare the Perfect Parry Advanced Reaction, paid as soon as it is declared.",
          },
          {
            texte:
              "Target: The Target Unit is always the Unit whose Charge triggers the Reaction. The Reacting Unit is always the Unit declared as the target of the Charge that triggers this Reaction.",
          },
          {
            texte:
              "Process: 1) Once this Reaction is declared, the Reactive Player must make a Charge Roll for the Reacting Unit. 2) If the result of the Charge Roll is sufficient to bring a Model of the Reacting Unit into Base Contact with a Model of the Target Unit, a Charge Move is made and the Units are Locked in Combat. No Model in the Target Unit may claim any bonus from a Special Rule that requires a successful Charge, while Models in the Reacting Unit gain the bonuses of any Special Rules that apply to that Unit when it makes a successful Charge. 3) If the result of the Charge Roll is not sufficient to bring any Model of the Reacting Unit into Base Contact with a Model of the Target Unit, no Charge Move is made and the Players move on to Step 4 of the Charge process.",
          },
        ],
      },
    ],
  },
  /* --- Légion III — Emperor’s Children · Rite « Legio Hereticus » --- */
  "legio-hereticus-emperors-children": {
    nomRite: "Legio Hereticus Emperor's Children",
    sections: [
      {
        titre: "Legion Tactica",
        paragraphes: [
          {
            texte:
              "All Models with the Emperor's Children Trait (except Models of the Vehicle Type) are subject to the following Special Rule:",
          },
          { texte: "Lords of Profligacy", style: "bold" },
          {
            texte:
              "The Controlling Player may make a Unit Stupefied when it is the target of a Shooting Attack.",
            style: "bold",
          },
          {
            texte:
              "After a Shooting Attack that targets a Unit composed only of Models with this Special Rule has been resolved, the Controlling Player of that Unit may make it Stupefied.",
          },
          { texte: "Stupefied", style: "bold" },
          {
            texte:
              "When a Unit becomes Stupefied, all Tactical Statuses affecting it are removed. In addition, while a Unit is Stupefied: Models in the Unit have the Feel No Pain (6+) Special Rule; the Strength Characteristic of Models in the Unit is modified by +1; Models in the Unit cannot gain any Tactical Status; the Controlling Player of a Stupefied Unit may not declare any Reactions for that Unit, and must make all Shooting Attacks for it as Snap Shots; in the Effects Sub-phase of the End Phase, the Controlling Player must make a Cool Test for each Stupefied Unit in their Army — if the Test is passed, that Unit is no longer Stupefied.",
          },
        ],
      },
      {
        titre: "Gambit",
        paragraphes: [
          {
            texte:
              "When choosing a Gambit, the Controlling Player of a Model with the Emperor's Children Trait may choose The Broken Mirror instead of another Gambit available to that Model.",
          },
          { texte: "The Broken Mirror", style: "bold" },
          {
            texte:
              "When this Gambit is chosen, the Controlling Player doubles the bonus granted by Outside Support, plus a further bonus when the Unit is Stupefied.",
            style: "bold",
          },
          {
            texte:
              "If this Gambit is chosen, the normal Outside Support modifier the Model benefits from during the Focus Step is doubled. If the Unit this Model belongs to is Stupefied, an additional +1 modifier is added.",
          },
        ],
      },
      {
        titre: "Advanced Reaction",
        paragraphes: [
          {
            texte:
              "The Controlling Player of Units composed only of Models with the Emperor's Children Trait may spend Reaction points to make the following Advanced Reaction:",
          },
          { texte: "Twisted Desire", style: "bold" },
          {
            texte:
              "This Reaction allows the Reacting Unit to become Stupefied when it is Charged.",
            style: "bold",
          },
          {
            texte:
              "Trigger: The Reactive Player may declare the Twisted Desire Advanced Reaction at the end of Step 2 of a Charge declared by the Active Player that targets a Unit controlled by the Reactive Player composed only of Models with the Emperor's Children Trait.",
          },
          {
            texte:
              "Cost: The Reactive Player must spend 1 point of their Reaction Allotment to declare the Twisted Desire Advanced Reaction, paid as soon as it is declared.",
          },
          {
            texte:
              "Target: The Target Unit is always the Unit whose Charge triggers this Reaction. The Reacting Unit is always the Unit declared as the target of the Charge that triggers this Reaction.",
          },
          {
            texte:
              "Process: Once this Reaction is declared, the Reacting Unit becomes Stupefied, and for the duration of this Assault Phase, Models in that Unit gain the Feel No Pain (5+) Special Rule.",
          },
        ],
      },
    ],
  },
  /* --- Légion XII — World Eaters · Rite « Legio Astartes » --- */
  "legio-astartes-world-eaters": {
    nomRite: "Legio Astartes World Eaters",
    sections: [
      {
        titre: "Legion Tactica",
        paragraphes: [
          {
            texte:
              "All Models with the World Eaters Trait (except Models of the Vehicle Type) are subject to the following Special Rule:",
          },
          { texte: "Violence Incarnate", style: "bold" },
          {
            texte:
              "When they Charge, World Eaters gain a +1 bonus to their Attacks Characteristic.",
            style: "bold",
          },
          {
            texte:
              "In each turn in which they have made a Charge Move, Models with this Special Rule modify the value of their Attacks Characteristic by +1 until the end of the Phase.",
          },
        ],
      },
      {
        titre: "Gambit",
        paragraphes: [
          {
            texte:
              "When choosing a Gambit, the Controlling Player of a Model with the World Eaters Trait may choose Overwhelming Carnage instead of another Gambit available to that Model.",
          },
          { texte: "Overwhelming Carnage", style: "bold" },
          {
            texte:
              "This Gambit allows wounds to be allocated to enemy Models outside the Challenge when the opponent is Removed as a Casualty.",
            style: "bold",
          },
          {
            texte:
              "If this Gambit is chosen, when this Model makes attacks during the Strike Step, if the Model it faces in the Challenge is Removed as a Casualty, excess wounds must be allocated to other eligible enemy Models involved in the same Combat following the normal Rules.",
          },
        ],
      },
      {
        titre: "Advanced Reaction",
        paragraphes: [
          {
            texte:
              "The Controlling Player of Units composed only of Models with the World Eaters Trait may spend Reaction points to make the following Advanced Reaction:",
          },
          { texte: "Brutal Onslaught", style: "bold" },
          {
            texte:
              "This Reaction allows the Reacting Unit to Charge a Unit that targets it with a Shooting Attack.",
            style: "bold",
          },
          {
            texte:
              "Trigger: Once per Battle, the Reactive Player may declare the Brutal Onslaught Advanced Reaction during Step 4 of a Shooting Attack targeting a Unit composed only of Models with the World Eaters Trait that are not of the Vehicle Type.",
          },
          {
            texte:
              "Cost: The Reactive Player must spend 1 point of their Reaction Allotment.",
          },
          {
            texte:
              "Process: 1) For the duration of the current Shooting Phase, all Models in the Reacting Unit gain the Eternal Warrior (1) Special Rule. 2) As soon as Step 11 of the Shooting Attack that triggered this Reaction has been resolved, the Reactive Player must make a Charge Roll for the Reacting Unit. 3) If the result of the Charge Roll is not sufficient to bring any Model of the Reacting Unit into Base Contact with a Model of the Target Unit, no Charge Move is made.",
          },
        ],
      },
    ],
  },
  /* --- Légion XII — World Eaters · Rite « Legio Hereticus » --- */
  "legio-hereticus-world-eaters": {
    nomRite: "Legio Hereticus World Eaters",
    sections: [
      {
        titre: "Legion Tactica",
        paragraphes: [
          {
            texte:
              "All Models with the World Eaters Trait (except Models of the Vehicle Type) are subject to the following Special Rule:",
          },
          { texte: "The Bite of the Nails", style: "bold" },
          {
            texte:
              "The Controlling Player may make a World Eaters Unit that fails a Leadership Test Lost to the Nails.",
            style: "bold",
          },
          {
            texte:
              "When a Unit composed only of Models with this Special Rule fails a Leadership Test, its Controlling Player may make it Lost to the Nails.",
          },
          { texte: "Lost to the Nails", style: "bold" },
          {
            texte:
              "When a Unit becomes Lost to the Nails, all Tactical Statuses affecting it are removed. In addition, while a Unit is Lost to the Nails: Models in the Unit may add +1\" to the distance covered during a Set-up Move; the value of the Attacks Characteristic of Models in the Unit is modified by +1; Models in the Unit are treated as having a Leadership, Cool and Willpower Characteristic of 10 (unless it is normally higher); at the start of the Controlling Player's Charge Sub-phase, if it is within 12\" of any enemy Model, the Unit must make a Charge Move (if there are several enemy Units within 12\", the Unit's Controlling Player must nominate the closest enemy Unit).",
          },
          {
            texte:
              "At the start of the Controlling Player's Charge Sub-phase, if there are no enemy Units within 12\" of a Unit that is Lost to the Nails, it is no longer Lost to the Nails.",
          },
        ],
      },
      {
        titre: "Gambit",
        paragraphes: [
          {
            texte:
              "When choosing a Gambit, the Controlling Player of a Model with the World Eaters Trait may choose Brutal Dismemberment instead of another Gambit available to that Model.",
          },
          { texte: "Brutal Dismemberment", style: "bold" },
          {
            texte:
              "While this Gambit is adopted, if the enemy Model is Removed as a Casualty during the Strike Step, in the following Glory Step the Controlling Player gains 2 additional Combat Resolution Points.",
          },
        ],
      },
      {
        titre: "Advanced Reaction",
        paragraphes: [
          {
            texte:
              "The Controlling Player of Units composed only of Models with the World Eaters Trait may spend Reaction points to make the following Advanced Reaction:",
          },
          { texte: "Furious Charge", style: "bold" },
          {
            texte:
              "This Reaction allows the Reacting Unit to become Lost to the Nails after the Volley Step of a Charge.",
            style: "bold",
          },
          {
            texte:
              "Trigger: The Reactive Player may declare a Furious Charge Advanced Reaction at the end of Step 4 of a Charge declared by the Active Player targeting a Unit composed only of Models with the World Eaters Trait, if at least one Model in the Target Unit was Removed as a Casualty as a result of Volley Attacks.",
          },
          {
            texte:
              "Cost: The Reactive Player must spend 1 point of their Reaction Allotment.",
          },
          {
            texte:
              "Process: 1) Once this Reaction is declared, the Target Unit becomes Lost to the Nails. 2) The Reactive Player must then make a Charge Roll for the Reacting Unit. 3) If the result of the Charge Roll is not sufficient to bring any Model of the Reacting Unit into Base Contact with a Model of the Target Unit, no Charge Move is made and the Players move on to Step 5 of the Charge procedure.",
          },
        ],
      },
    ],
  },
  /* --- Légion XX — Alpha Legion --- */
  XX: {
    nomRite: "Legio Astartes Alpha Legion",
    sections: [
      {
        titre: "Legion Tactica",
        paragraphes: [
          {
            texte:
              "All Models with the Alpha Legion Trait (except Models of the Vehicle Type) are subject to the following Special Rule:",
          },
          { texte: "Lies and Obfuscation", style: "bold" },
          {
            texte:
              "Alpha Legion Models count as being further away than they really are.",
            style: "bold",
          },
          {
            texte:
              "A Model with this Special Rule is always treated as being 2\" further away than it really is when measuring the range to it from an enemy Model for the purposes of resolving a Shooting Attack, a Charge, or declaring a Reaction declared by the enemy Model or Unit (this is cumulative with all other range modifiers imposed by Special Rules).",
          },
        ],
      },
      {
        titre: "Gambit",
        paragraphes: [
          {
            texte:
              "When choosing a Gambit, the Controlling Player of a Model with the Alpha Legion Trait may choose I Am Alpharius instead of any other Gambit available to that Model.",
          },
          { texte: "I Am Alpharius", style: "bold" },
          {
            texte:
              "When this Gambit is chosen, the Combat Initiative of the Opposing Player's Model is reduced.",
            style: "bold",
          },
          {
            texte:
              "This Gambit may only be chosen during the first Face-off Step of a Challenge involving this Model. If this Gambit is chosen, the Combat Initiative of the opposing Model in the Challenge is set to “1” until the end of that Strike Step.",
          },
        ],
      },
      {
        titre: "Advanced Reaction",
        paragraphes: [
          {
            texte:
              "The Controlling Player of Units composed only of Models with the Alpha Legion Trait may make the following Advanced Reaction, spending Reaction points to do so:",
          },
          { texte: "Smoke and Mirrors", style: "bold" },
          {
            texte:
              "This Reaction changes the Target Number of Precision Hit Tests made against the Reacting Unit.",
            style: "bold",
          },
          {
            texte:
              "Trigger: The Reactive Player may declare this Smoke and Mirrors Reaction in the Shooting Phase, during Step 3 of the Shooting Attack sequence of any Shooting Attack made by the Active Player that targets a Unit composed only of Models with the Alpha Legion Trait.",
          },
          {
            texte:
              "Cost: The Reactive Player must spend 1 point of their Reaction Allotment to declare this Smoke and Mirrors Advanced Reaction, paid as soon as it is declared.",
          },
          {
            texte:
              "Target: The Target Unit is always the Unit whose Shooting Attack triggers the Reaction. The Reacting Unit is always the Unit declared as the target of the Shooting Attack that triggers the Reaction.",
          },
          {
            texte:
              "Process: Once this Reaction is declared, until the Target Unit's Shooting Attack has been resolved, Shooting Attacks with the Precision (X) Special Rule only inflict its effects on a Hit Test of 6+.",
          },
        ],
      },
    ],
  },
};

/* ----------------------------------------------------------
   DOCTRINES DE COHORTE (livre d'armée Solar Auxilia, Liber Auxilia
   p. 11-16) : menu « Doctrine de Cohorte » des paramètres de la partie
   (js/organigramme.js, Faction Solar Auxilia uniquement) — un unique
   choix obligatoire par Armée avant de pouvoir ajouter des Unités (voir
   actualiserVerrouLegion, js/unites.js). Sans effet sur l'accessibilité
   d'une Unité en particulier (aucun champ Unité ne filtre sur une
   Doctrine précise) — texte de Règle Spéciale (Tactica de Cohorte +
   Détachements Additionnels) indexé par son nom (2e élément de chaque
   paire) dans REGLES_DIVERSES, js/regles-data.js. Constante globale
   (plutôt que locale à Organigramme comme avant) : consommée aussi par
   js/unites.js pour la page de garde PDF/Word, même principe que
   RITE_DE_GUERRE_LEGION et DESIGNATIONS_LEGIONES_AUXILIA ci-dessous.
   ---------------------------------------------------------- */
const DOCTRINES_DE_COHORTE = [
  ["ultima", "Cohort Ultima"],
  ["solaire", "Solar Cohort"],
  ["reconnaissance", "Recon Cohort"],
  ["mecanisee", "Mechanised Cohort"],
  ["siege", "Siege Cohort"],
  ["fer", "Iron Cohort"],
  // Journal Tactica : Prospero Burns — Allégeance Loyaliste uniquement,
  // incompatible avec une Désignation de Legiones Auxilia (vérifié par
  // validerArmee(), js/organigramme.js).
  ["oblitum", "Cohort Oblitum"],
  // Journal Tactica : The Battle for the Signus Cluster — Allégeance
  // Renégate uniquement (vérifié par validerArmee(), js/organigramme.js).
  ["sublime", "Sublime Cohort"],
];

/* ----------------------------------------------------------
   DÉSIGNATIONS DE LEGIONES AUXILIA (livre Legiones Auxilia intégré
   au Liber Auxilia, p. 50-84) : menu « Désignation de Legiones
   Auxilia » des paramètres de la partie (js/organigramme.js, Faction
   Solar Auxilia uniquement), un choix optionnel par Armée — à la
   différence de la Doctrine de Cohorte, aucune Unité n'en dépend pour
   être ajoutable (voir actualiserVerrouLegion, js/unites.js). Chaque
   Désignation donne accès à une Réaction Avancée thématique en partie
   (texte condensé dans REGLES_DIVERSES, js/regles-data.js, indexé par
   son nom `reaction` ci-dessous), en l'échange d'une autre Réaction
   standard qu'elle rend indisponible (texte non reproduit ici — voir
   le livre en cas de doute). `legion` = id LEGIONS. Une par Légion
   couverte par ce livre (16 des 18 Légions de Space Marines ; II et
   XI restent des Légions Perdues, non représentées).
   Non modélisé (gap documenté plutôt qu'une fausse restriction) : la
   règle p. 50 qui interdit cette Désignation dès qu'une Figurine du
   Détachement Principal porte un Trait [Legiones Astartes] d'une
   AUTRE Légion que celle indiquée — ce site ne vérifie pas les Traits
   figurine par figurine (voir la même limitation documentée pour
   `traitRequis` ci-dessous, AVANTAGES_PRINCIPAUX) ; le choix reste
   donc libre ici, à valider soi-même contre le livre.
   ---------------------------------------------------------- */
const DESIGNATIONS_LEGIONES_AUXILIA = [
  {
    id: "chasseurs-calibanites",
    nom: "Calibanite Hunters",
    legion: "I",
    legionNom: "Dark Angels",
    reaction: "Bring Him Down!",
  },
  {
    id: "palatins-archites",
    nom: "Archite Palatines",
    legion: "III",
    legionNom: "Emperor's Children",
    reaction: "Redouble",
  },
  {
    id: "thorakites-selucides",
    nom: "Selucian Thorakites",
    legion: "IV",
    legionNom: "Iron Warriors",
    reaction: "Endure the Torment",
  },
  {
    id: "limitanei-chogoriens",
    nom: "Chogorian Limitanei",
    legion: "V",
    legionNom: "White Scars",
    reaction: "Chosen Ground",
  },
  {
    id: "kaerls-fenrissiens",
    nom: "Fenrisian Kaerls",
    legion: "VI",
    legionNom: "Space Wolves",
    reaction: "Hunter's Strike",
  },
  {
    id: "phalangites-dinwit",
    nom: "Inwit Phalangites",
    legion: "VII",
    legionNom: "Imperial Fists",
    reaction: "Impregnable Bulwark",
  },
  {
    id: "damnatii-nostramiens",
    nom: "Nostraman Damnatii",
    legion: "VIII",
    legionNom: "Night Lords",
    reaction: "Fog of War",
  },
  {
    id: "elevatii-saiphains",
    nom: "Saiphan Elevatii",
    legion: "IX",
    legionNom: "Blood Angels",
    reaction: "Counter-assault",
  },
  {
    id: "suaire-de-chaines-medusien",
    nom: "Medusan Chain Shroud",
    legion: "X",
    legionNom: "Iron Hands",
    reaction: "Cerebral Augmentations",
  },
  {
    id: "thraexii-nagrakals",
    nom: "Nagrakal Thraexii",
    legion: "XII",
    legionNom: "World Eaters",
    reaction: "The Butcher's Due",
  },
  {
    id: "haute-garde-dultramar",
    nom: "High Guard of Ultramar",
    legion: "XIII",
    legionNom: "Ultramarines",
    reaction: "Combined Arms",
  },
  {
    id: "ambaxtoi-de-barbarus",
    nom: "Ambaxtoi of Barbarus",
    legion: "XIV",
    legionNom: "Death Guard",
    reaction: "Endure",
  },
  {
    id: "gardespire-prosperienne",
    nom: "Prosperine Spireguard",
    legion: "XV",
    legionNom: "Thousand Sons",
    reaction: "Psychic Shock",
  },
  {
    id: "chasseurs-de-tetes-cthoniens",
    nom: "Cthonian Headhunters",
    legion: "XVI",
    legionNom: "Sons of Horus",
    reaction: "Warmaster's Harangue",
  },
  {
    id: "velites-de-therion",
    nom: "Velites of Therion",
    legion: "XIX",
    legionNom: "Raven Guard",
    reaction: "Reposition",
  },
  {
    id: "vindictaires-sparatoi",
    nom: "Sparatoi Vindictaires",
    legion: "XX",
    legionNom: "Alpha Legion",
    reaction: "Diversion",
  },
];

/* ----------------------------------------------------------
   AVANTAGES PRINCIPAUX (p. 283 + Légions Corrompues)
   Un Avantage est choisi pour chaque Case Principale OCCUPÉE.
   `condition` est vérifiée par js/organigramme.js :
   - sergent      : l'unité doit inclure le Sous-type Sergent,
   - etatMajor    : l'unité doit inclure le Sous-type État-major,
   - chevalier    : l'unité doit inclure le Sous-type Chevalier (livre
                 d'armée Chevaliers Questoris, Avantages Principaux de
                 Rang de Maisonnée) — même mécanique que sergent/
                 etatMajor ci-dessus, via aSousType (js/organigramme.js)
                 sur la ligne `type` de la variante (ex : "Véhicule
                 (Chevalier)"), voir pages/vehicule.html#sous-types.
   - caseEM       : réservé aux Cases d'État-major,
   - unParDetachement : sélectionnable une seule fois par détachement,
   - renegat      : Allégeance Renégate uniquement (Vrais Croyants).
   - factionRequise : id FACTIONS (js/organigramme.js) — réservé à cette
                 Faction précise (ex : Vrais Croyants, réservé à Legio
                 Astartes — l'Allégeance Renégate existe aussi pour
                 d'autres Factions, comme Solar Auxilia, sans que cet
                 Avantage propre aux Légions Corrompues leur soit
                 ouvert).
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
   - exempteUnParArmeeSiMaisonnee : "mechanicum" | "imperialis" —
                 supprime la restriction `unParArmee` ci-dessus quand
                 la Maisonnée pertinente du Détachement (voir
                 maisonneePertinentePourDetachement(), js/
                 organigramme.js) où cet Avantage est choisi correspond
                 (livre d'armée Chevaliers Questoris, Paradigmes de
                 Maisonnée — ex : Précepteur, dont la restriction 0-1
                 par Armée saute pour le Paradigme Mechanicum).
                 Vérifié par avantagesPossibles() (grisage) et
                 validerArmee() (erreur), simplification assumée dans
                 ce second cas : pas de décompte fin par Détachement,
                 juste « au moins un Détachement de l'Armée a la
                 Maisonnée assortie ».
   - typesRequis  : [Types] — l'unité doit inclure AU MOINS UN des
                 Types listés (logique OU), vérifié comme
                 `sergent`/`etatMajor` ci-dessus via aSousType (ex :
                 Les Défavorisés, Iron Warriors, réservé au seul Type
                 Infanterie ; Les Sagyar Mazan, White Scars, qui
                 acceptent Infanterie OU Cavalerie).
   - detachementsRequis : [ids de TYPES_DETACHEMENTS] — Avantage
                 entièrement MASQUÉ (pas seulement grisé) hors des
                 Détachements de ces types (ex : Avantages Armoured
                 Spearhead, réservés à l'Escadron de Commandement
                 Blindé — voir avantagesPossibles, js/organigramme.js).
   - typesExclus  : [Types] — inverse de `typesRequis` : avantage grisé
                 si l'unité inclut l'un des Types listés (ex : Vrais
                 Croyants, interdit aux Véhicules — FAQ octobre 2026).
   - ajouteCase  : ajoute une case au détachement (tout Rôle Tactique
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
                 seul Rôle dans la liste : préaffecté directement et
                 FIXE — aucun menu déroulant de Rôle Tactique n'est
                 affiché pour la case ajoutée, contrairement au cas à
                 plusieurs Rôles au choix (voir changerAvantage,
                 construireCarteDetachement dans js/organigramme.js).
   - nombreCasesAjoutees : nombre de cases ajoutées d'un coup par
                 `ajouteCase` (défaut 1 si absent — Bénéfice Logistique,
                 Le Salaire de la Traîtrise, Bardé de Fer, Logisticae).
                 Agent de Clade (Divisio Assassinorum, voir plus bas)
                 pose 3 : le livre l'autorise à ajouter trois Cases
                 d'Appui d'un coup, désormais modélisées toutes les
                 trois (changerAvantage/reconcilier/restauration
                 localStorage, js/organigramme.js, traitent ces cases
                 comme un groupe : ajoutées/retirées ensemble).
   Rappel du livre : si l'unité inclut une figurine de Sous-type
   Unique, seul « Bénéfice Logistique » reste disponible.
   - reglesAppliquees : [noms de Règles Spéciales] — pour un Avantage
                 « pur » (accorde uniquement une/des Règles Spéciales à
                 TOUTE l'Unité, sans échange d'arme, bonus de
                 Caractéristique ni gain de Sous-type), ces noms sont
                 ajoutés automatiquement à la ligne « Règles spéciales »
                 de la fiche récap de toute Unité occupant une Case
                 Principale avec cet Avantage sélectionné (voir
                 reglesAvantagePrincipalDe, js/unites.js) — pas besoin de
                 les cocher/ajouter manuellement. Les autres Avantages
                 (Castellan, Garde Phénix, Paladin de l'Hekatonystika,
                 Thegn de Meute, Résistance Anormale, Enchaînés, Bardé de
                 Fer, Logisticae…) restent, comme documenté au fil de ce
                 tableau, appliqués manuellement par le joueur : leur
                 effet mêle échange d'équipement, bonus de profil, gain
                 de Sous-type ou choix d'une seconde Unité, qu'aucun
                 mécanisme unique ne peut représenter fidèlement ici.
                 L'éligibilité (Rôle/Trait/Type/Sous-type) est déjà
                 vérifiée par avantagesPossibles avant de permettre le
                 choix : reglesAvantagePrincipalDe ne la revérifie pas.
   - loyaliste    : Allégeance Loyaliste uniquement (miroir de `renegat`
                 ci-dessus — ex : Agent de Clade, Divisio Assassinorum).
   - principalUniquement : ne peut être choisi que pour une Case du
                 Détachement Principal de l'Armée (`type.famille ===
                 "principal"`), pas dans un Détachement Auxiliaire/
                 d'Apex/Allié/de Seigneur des Batailles (ex : Agent de
                 Clade).
   - factionCaseAjoutee : id FACTIONS — combiné à `ajouteCase`
                 ci-dessus, impose que la Case AJOUTÉE (pas celle qui
                 porte l'Avantage) n'accepte que cette Faction précise
                 au lieu de la Faction du Détachement qui la porte (voir
                 caseAccepte, js/organigramme.js) — ex : Agent de Clade
                 ajoute une Case d'Appui réservée à la Divisio
                 Assassinorum, quelle que soit la Faction du
                 Détachement qui la porte. Cette Faction n'est jamais
                 sélectionnable comme Faction d'Armée ni de Détachement
                 Allié (absente de FACTIONS, js/organigramme.js) :
                 seule cette Case ajoutée y donne accès, via
                 Organigramme.factionsDebloqueesParAvantage() (consommée
                 par uniteAccessible, js/unites.js).
                 Le livre autorise Agent de Clade à ajouter TROIS Cases
                 d'Appui d'un coup : modélisé via `nombreCasesAjoutees: 3`
                 ci-dessus (voir cette entrée pour le détail).
   ---------------------------------------------------------- */
const AVANTAGES_PRINCIPAUX = [
  {
    id: "aucun",
    nom: "— No advantage selected —",
    texte:
      "Occupying a Prime Slot without taking its benefit is still permitted.",
  },
  {
    id: "maitre-sergent",
    nom: "Master-sergeant",
    sergent: true,
    unParDetachement: true,
    texte:
      "A model of the Sergeant Sub-type gains +1 Attacks, Weapon Skill and Leadership, as well as the Champion Sub-type (already a Champion: +1 LD instead). Only once per detachment.",
  },
  {
    id: "veterans-combat",
    nom: "Combat Veterans",
    texte:
      "All models in the unit gain +1 Leadership, Cool, Intelligence and Willpower (maximum 10). Does not apply to models that join the unit.",
  },
  {
    id: "parangon-bataille",
    nom: "Paragon of Battle",
    etatMajor: true,
    texte:
      "A model of the Command Sub-type gains +1 Attacks, Weapon Skill and Ballistic Skill.",
  },
  {
    id: "affectation-speciale",
    nom: "Special Assignment",
    caseEM: true,
    texte:
      "Command Slots only: the slot may be occupied by a High Command unit while remaining a Command Slot. In return, this slot unlocks NO additional detachment.",
  },
  {
    id: "benefice-logistique",
    nom: "Logistical Benefit",
    unParDetachement: true,
    ajouteCase: true,
    texte:
      "Adds a slot to the detachment, of any Battlefield Role except High Command, Command, Warlord and Lord of War. Only once per detachment. The only advantage available if the unit includes the Unique Sub-type.",
  },
  {
    id: "vrais-croyants",
    nom: "True Believers (Corrupted Legions)",
    renegat: true,
    factionRequise: "legio-astartes",
    // FAQ octobre 2026 : ne s'applique pas aux Véhicules.
    typesExclus: ["Vehicle"],
    texte:
      "Traitor Allegiance Armies (Legiones Astartes list): all models in the unit gain the Malefic Sub-type — they ignore Tactical Statuses (replaced by D3 automatic wounds AP 2/Damage 1 with no save) and rules that reduce LD/CL/WP/IN, and cannot join or be joined by non-Malefic units. October 2026 FAQ: does not apply to Vehicles.",
  },
  /* --- Journal Tactica : Battle of Tallarn, Avantages Principaux
     Armoured Spearhead. Le livre les ouvre à toute Unité composée
     uniquement de Véhicules occupant une Case Principale lors d'une
     Mission Armoured Spearhead ; faute de notion de mission sur ce
     site, ils ne sont proposés que dans l'Escadron de Commandement
     Blindé (`detachementsRequis`), le seul endroit où leur usage est
     certain. `typesRequis` approxime « uniquement des Véhicules ». --- */
  {
    id: "systemes-durcis",
    nom: "Hardened Systems (Armoured Spearhead)",
    typesRequis: ["Vehicle"],
    detachementsRequis: ["escadron-commandement-blinde"],
    texte:
      "Armoured Spearhead Missions, Unit composed only of Models of the Vehicle Type: the Model may make Repair Tests during the Effects Sub-phase of its Controlling Player's Start Phase AND during the End Phase.",
  },
  {
    id: "stabilisateurs-toile-suspensive",
    nom: "Suspensor Web Stabilisers (Armoured Spearhead)",
    typesRequis: ["Vehicle"],
    detachementsRequis: ["escadron-commandement-blinde"],
    texte:
      "Armoured Spearhead Missions, Unit composed only of Models of the Vehicle Type: the Model always counts as Stationary for the purposes of the Heavy (X) Special Rule, whether or not it has moved during the Battle Turn.",
  },
  /* --- Journal Tactica : Battle of Tallarn, Avantages Principaux
     Vagus : réservés à une Case Principale occupée par une Unité
     composée uniquement de Figurines ayant le Trait Vagus, c'est-à-dire
     aux Unités des Cohortes Vagus (`detachementsRequis`). Effets
     appliqués manuellement par le joueur (bonus de profil, Réserves,
     déploiement…) : pas de `reglesAppliquees`. --- */
  {
    id: "orphelins-du-champ-de-bataille",
    nom: "Orphans of the Battlefield (Vagus)",
    detachementsRequis: ["cohortes-vagus"],
    texte:
      "All Models in the Unit start the battle in Reserves and gain the Cortex Corruption and Expendable (1) Special Rules. When the Unit is deployed onto the Battlefield, the Base WS and BS of its Models are modified by +1 (maximum 4) and their Base Toughness by -1. In the Effects Sub-phase of the last End Phase of the battle, all Models in the Unit are Removed as Casualties.",
  },
  {
    id: "renforts-egares",
    nom: "Stray Reinforcements (Vagus)",
    detachementsRequis: ["cohortes-vagus"],
    texte:
      "All Models in the Unit gain the Cortex Corruption, Expendable (1) and Infiltrate (9) Special Rules, and must be deployed using Infiltrate (X) — or, if that is impossible, placed in Reserves. If the Unit is deployed with all its Models more than 12\" from any enemy Model, they start the battle with one fewer Wound than their Base value. As soon as it enters play, the Base WS and BS of its Models become 2; then, in the Effects Sub-phase of each of the Controlling Player's Start Phases, they are modified by +1 (maximum 4).",
  },
  {
    id: "programmation-corrompue",
    nom: "Corrupted Programming (Vagus)",
    detachementsRequis: ["cohortes-vagus"],
    texte:
      "All Models in the Unit gain the Cortex Corruption, Expendable (1) and Fear (1) Special Rules, and replace any variant of Explodes (X) with Explodes (4+). In addition, in the Charge Sub-phase of both players' Assault Phases, if the Unit is not Locked in Combat and has not declared a Charge, it immediately suffers Cybertheurgic Feedback.",
  },
  {
    id: "influence-maligne",
    nom: "Malign Influence (Vagus)",
    detachementsRequis: ["cohortes-vagus"],
    texte:
      "All Models in the Unit gain the Cortex Corruption, Expendable (1) and Hatred (all Models that do not have the Automata Type) Special Rules. The Unit may make Shooting Attacks against friendly Units: resolved as normal with all available Weapons, with no Reaction possible for the target, and without either player scoring VP from them. If, at the end of one of the Controlling Player's turns, the Unit has made no attacks during the Shooting Phase or the Assault Phase, it suffers Cybertheurgic Feedback in the Effects Sub-phase of that turn's End Phase.",
  },
  /* --- Arsenal des Sons of Horus (XVIe Légion), page « Suprématie
     Martiale » (voir js/unites-data.js, unités réservées à cette
     Légion). --- */
  {
    id: "supremacie-martiale",
    nom: "Martial Supremacy (Sons of Horus)",
    roleRequis: "Elites",
    traitRequis: "Sons of Horus",
    texte:
      "Reserved for an Elites Battlefield Role Unit composed only of Models with the Sons of Horus Trait: one Model in the Unit gains the Champion Sub-type and the Duellist's Edge (1) Special Rule.",
  },
  /* --- Arsenal des Word Bearers (XVIIe Légion), page « Assaut Zélé »
     (voir js/unites-data.js, unités réservées à cette Légion). --- */
  {
    id: "assaut-zele",
    nom: "Zealous Assault (Word Bearers)",
    roleRequis: "Troops",
    traitRequis: "Word Bearers",
    reglesAppliquees: ["Impact (S)"],
    texte:
      "Reserved for a Troops Battlefield Role Unit composed only of Models with the Word Bearers Trait: Models in the Unit gain the Impact (S) Special Rule.",
  },
  /* --- Arsenal des Thousand Sons (XVe Légion), page « Déplacement
     Télékinétique » (voir js/unites-data.js, unités réservées à cette
     Légion). --- */
  {
    id: "deplacement-telekinetique",
    nom: "Telekinetic Reposition (Thousand Sons)",
    roleRequis: "Troops",
    traitRequis: "Thousand Sons",
    reglesAppliquees: ["Telekinetic Reposition"],
    texte:
      "Reserved for a Troops Battlefield Role Unit composed only of Models with the Thousand Sons Trait: Models in the Unit gain the Telekinetic Reposition Special Rule (when the Unit Rushes, a successful Willpower Test gives it the Antigrav Sub-type and the Move Through Cover Special Rule until the end of the Movement Phase; if it is failed, the Unit cannot Move this turn).",
  },
  /* --- Arsenal de la Death Guard (XIVe Légion), page « Résistance
     Anormale » : réservé au Centurion et au Centurion Cataphractii
     (unités génériques, voir js/unites-data.js, id "centurion" et
     "centurion-terminator" — SEULE la variante Cataphractii de cette
     dernière est concernée, pas le Centurion Tartaros). --- */
  {
    id: "resistance-anormale",
    nom: "Abnormal Resistance (Death Guard)",
    uniteRequise: [
      { id: "centurion" },
      { id: "centurion-terminator", variante: 0 },
    ],
    traitRequis: "Death Guard",
    unParArmee: true,
    texte:
      "Reserved for a Centurion or Cataphractii Centurion Model with the Death Guard Trait: it benefits from a +1 Modifier to the Base Value of its Wounds Characteristic and gains the Eternal Warrior (2) Special Rule. Only once per Army.",
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
    nom: "The Wages of Treachery (Alpha Legion)",
    roleRequis: "Command",
    traitRequis: "Alpha Legion",
    unParDetachement: true,
    ajouteCase: true,
    texte:
      "Reserved for a Command Battlefield Role Unit composed only of Models with the Alpha Legion Trait: adds a slot to the detachment, of any Battlefield Role except High Command, Command, Warlord and Lords of War. The Model occupying this slot must come from the Legiones Astartes Army List, must not have the Alpha Legion Faction Trait and must not include the Unique Sub-type; all Models in its Unit then replace their Faction Trait with “Alpha Legion”.",
  },
  /* --- Arsenal des Iron Warriors (IVe Légion), page « Les
     Défavorisés » (voir js/unites-data.js, unités réservées à cette
     Légion). --- */
  {
    id: "les-defavorises",
    nom: "The Disfavoured (Iron Warriors)",
    typesRequis: ["Infantry"],
    traitRequis: "Iron Warriors",
    reglesAppliquees: ["Expendable (1)"],
    texte:
      "Reserved for an Infantry Type Unit composed only of Models with the Iron Warriors Trait: all Models in the Unit gain the Expendable (1) Special Rule.",
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
    reglesAppliquees: ["Deep Strike", "Impact (I)"],
    texte:
      "Reserved for a Centurion in Terminator Armour (Cataphractii or Tartaros) or Terminator Command Squad (Cataphractii or Tartaros) Model with the Night Lords Trait: Models in the Unit gain the Deep Strike and Impact (I) Special Rules.",
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
    nom: "Phoenix Guard (Emperor's Children)",
    uniteRequise: [{ id: "centurion-terminator", variante: 1 }],
    traitRequis: "Emperor's Children",
    texte:
      "Reserved for a Tartaros Centurion Model with the Emperor's Children Trait: it must exchange its Combi-bolter and Power weapon for a Phoenix power spear at no cost, and gains the Unmatched Skill Special Rule.",
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
    nom: "Enchained (World Eaters)",
    roleRequis: "Command",
    traitRequis: "World Eaters",
    unParArmee: true,
    texte:
      "Reserved for a Command Battlefield Role Unit composed only of Models with the World Eaters Trait, may only be selected once per Army: the Controlling Player must choose another Command Battlefield Role Unit in their Army; one Model in each of the two Units gains the Chain Brothers Special Rule (while it is in Unit Coherency — or in a Challenge within the same Combat — with the other Model with this Special Rule, it gains a +1 bonus to Hit Tests made in the Assault Phase).",
  },
  /* --- Arsenal des Dark Angels (Ire Légion), page « Paladin de
     l'Hekatonystika » (voir js/unites-data.js, id "centurion" —
     variantes 0 « Centurion » et 1 « Centurion à Réacteurs », toutes
     deux admises par le texte du livre). L'échange d'arme et le gain
     de Règle Spéciale ne sont pas appliqués automatiquement par le
     site (comme Garde Phénix, ci-dessus) : à faire manuellement sur
     la fiche de la Figurine concernée.
     « Parangon de l'Ordre » (nom de la Règle Spéciale gagnée) était
     transcrit sous toutes réserves depuis une annotation manuscrite au
     crayon sur une première photo — CONFIRMÉ EXACT depuis une seconde
     photo plus lisible du livre (2026-07-31, chantier Dark Angels/
     Space Wolves/White Scars/Raven Guard). --- */
  {
    id: "paladin-hekatonystika",
    nom: "Paladin of the Hekatonystika (Dark Angels)",
    uniteRequise: [
      { id: "centurion", variante: 0 },
      { id: "centurion", variante: 1 },
    ],
    traitRequis: "Dark Angels",
    unParArmee: true,
    texte:
      "Reserved for a Centurion Model (on foot or with Jump Packs) with the Dark Angels Trait, may only be selected once per Army: the Base Value of its Weapon Skill is modified by +1, it must exchange its Bolter for a Terranic greatsword at no cost, and it gains the Paragon of the Order Special Rule (p. 137).",
  },
  /* --- Arsenal des Imperial Fists (VIIe Légion), page « Castellan »
     (voir js/unites-data.js, id "centurion", variante 0 seulement — le
     livre dit « une Figurine de Centurion » sans mentionner la
     variante à Réacteurs, contrairement à Paladin de l'Hekatonystika
     ci-dessus). Le gain de scanner augure et l'échange d'arme ne sont
     pas appliqués automatiquement par le site : à faire manuellement
     sur la fiche de la Figurine concernée.
     Bug corrigé (2026-08-02, audit suite au signalement Préfet/Legio
     Custodes) : cette entrée existait EN DOUBLE dans ce tableau (même
     id "castellan", ajoutée deux fois lors de deux sessions
     différentes — la première version, sans restriction de variante,
     était strictement antérieure et moins précise). Comme
     avantageParId()/AVANTAGES_PRINCIPAUX.find() (js/organigramme.js)
     ne retiennent que la PREMIÈRE entrée trouvée pour un id donné, la
     seconde (celle-ci, avec `variante: 0` et la référence de page)
     n'était en réalité jamais consultée pour la logique d'éligibilité
     — seul son doublon, plus permissif (aucune restriction de
     variante), faisait foi. Le doublon obsolète a été supprimé plutôt
     que celui-ci. À vérifier systématiquement pour tout futur Avantage
     Principal réutilisant un `id` déjà présent dans ce tableau. */
  {
    id: "castellan",
    nom: "Castellan (Imperial Fists)",
    uniteRequise: [{ id: "centurion", variante: 0 }],
    traitRequis: "Imperial Fists",
    texte:
      "Reserved for a Centurion Model with the Imperial Fists Trait: it gains an Augury scanner, may not choose any of the listed Centurion options and must instead exchange its Bolter for a Heavy bolter, an Autocannon or an Iliastus Assault Cannon at no cost (p. 188).",
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
    nom: "Ironclad (Iron Hands)",
    roleRequis: "Command",
    traitRequis: "Iron Hands",
    unParArmee: true,
    ajouteCase: true,
    rolesCaseAjoutee: ["War-engines"],
    texte:
      "Reserved for a Command Battlefield Role Unit composed only of Models with the Iron Hands Trait, may only be selected once per Army: adds a War-engine Battlefield Role Slot to the Detachment. A Unit selected to occupy this Slot gains the Champion Sub-type if it did not already have it.",
  },
  /* --- Arsenal de la Raven Guard (XIXe Légion), page « Spectres »
     (voir js/unites-data.js, unités réservées à cette Légion). --- */
  {
    id: "spectres",
    nom: "Spectres (Raven Guard)",
    roleRequis: "Troops",
    traitRequis: "Raven Guard",
    reglesAppliquees: ["Spectres"],
    texte:
      "Reserved for a Troops Battlefield Role Unit composed only of Models with the Raven Guard Trait: Models in the Unit gain the Spectres Special Rule (after Rushing, a successful Willpower Test makes Charges targeting the Unit Disordered in the Assault Phase of the following Player Turn; if it is failed, the Unit gains the Stunned Tactical Status instead).",
  },
  /* --- Arsenal des Space Wolves (VIe Légion), page « Thegn de Meute »
     (voir js/unites-data.js, id "optae", unité générique — un seul
     Rôle Tactique et une seule variante, `variante` omis). L'échange
     d'arme n'est pas appliqué automatiquement par le site : à faire
     manuellement sur la fiche de la Figurine concernée. --- */
  {
    id: "thegn-de-meute",
    nom: "Pack Thegn (Space Wolves)",
    uniteRequise: [{ id: "optae" }],
    traitRequis: "Space Wolves",
    texte:
      "Reserved for an Optae Model with the Space Wolves Trait: the Base Values of its Attacks and Weapon Skill Characteristics are modified by +1, and it may exchange its Power sword for a Frost sword or a Frost axe at no cost, or for a Frost claw for +5 Points.",
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
    roleRequis: "Command",
    traitRequis: "Ultramarines",
    ajouteCase: true,
    rolesCaseAjoutee: ["Transports", "Heavy Transports"],
    texte:
      "Reserved for a Command Battlefield Role Unit composed only of Models with the Ultramarines Trait: adds a Transport or Heavy Transport Battlefield Role Slot (player's choice) to the Detachment. The Transport Capacity of a Unit selected to occupy this Slot is modified by +2.",
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
    reglesAppliquees: ["Fear (1)"],
    texte:
      "Reserved for a Unit composed only of Models with the Blood Angels Trait, selected to occupy any Prime Force Organisation Slot: Models in the Unit gain the Fear (1) Special Rule.",
  },
  /* --- Arsenal des Salamanders (XVIIIe Légion), page « Le Devoir
     Avant la Mort » (voir js/unites-data.js, unités réservées à cette
     Légion). --- */
  {
    id: "devoir-avant-la-mort",
    nom: "Duty Before Death (Salamanders)",
    roleRequis: "Troops",
    traitRequis: "Salamanders",
    reglesAppliquees: ["Feel No Pain (6+)"],
    texte:
      "Reserved for a Troops Battlefield Role Unit composed only of Models with the Salamanders Trait: Models in the Unit gain the Feel No Pain (6+) Special Rule.",
  },
  /* --- Arsenal des White Scars (Ve Légion), page « Les Sagyar Mazan »
     (voir js/unites-data.js, unités réservées à cette Légion). Premier
     Avantage de ce type conditionné par le Type de Figurine plutôt que
     par le Rôle Tactique (`typesRequis`, logique OU Infanterie/
     Cavalerie), d'où l'absence de `roleRequis` ici. --- */
  {
    id: "les-sagyar-mazan",
    nom: "The Sagyar Mazan (White Scars)",
    typesRequis: ["Infantry", "Cavalry"],
    traitRequis: "White Scars",
    reglesAppliquees: ["Expendable (2)"],
    texte:
      "Reserved for a Unit composed only of Models with the White Scars Trait and of the Infantry or Cavalry Type: all Models in the Unit gain the Expendable (2) Special Rule.",
  },
  /* --- Avantages Principaux de Rang de Maisonnée (livre d'armée
     Chevaliers Questoris, p. 22) : réservés aux Unités composées
     uniquement de Figurines de Sous-type Chevalier (condition
     `chevalier`, voir aSousType/avantagesPossibles dans
     js/organigramme.js — vérifie que le Type de la variante choisie
     contient « Chevalier », comme pour un Véhicule de Sous-type
     Chevalier sur pages/vehicule.html#sous-types). Sélectionnables sur
     toute Case Principale occupée par un Chevalier : Détachement
     Principal de Maisonnées de Chevaliers et Bannière d'Appui (Cases
     statiquement Principales, `avantagesAutorises` posé sur ces deux
     types restreint leurs Cases aux seuls Avantages de cette liste) ;
     Détachement de Seigneur des Batailles générique UNIQUEMENT pour le
     Paradigme de Maisonnée Mendicus, où ses Cases Seigneurs des
     Batailles occupées par un Chevalier deviennent dynamiquement
     Principales (estCasePrincipale, js/organigramme.js — même
     mécanique que le « Sire des X » des Cases Troupes), avec le même
     `avantagesAutorises` posé sur ce type. Les restrictions de Vœu
     Questoris mentionnées dans le livre (« on ne peut pas déclarer de
     Vœu Questoris autre que… ») sont purement descriptives ici : les
     Vœux Questoris ne sont pas un choix modélisé par ce site (voir le
     tutoriel Chevaliers Questoris sur pages/construction-liste.html).
     Deux de ces Avantages (Précepteur, Seigneur Preux) perdent leur
     restriction 0-1 par Armée pour le Paradigme de Maisonnée assorti
     (`exempteUnParArmeeSiMaisonnee`, voir MODÈLE DE DONNÉES). --- */
  {
    id: "preux-martial",
    nom: "Martial Gallant (Household Rank)",
    chevalier: true,
    texte:
      "Martial Gallants are the standard on which the Unit Profiles of the Questoris Familia Army List are based: this Advantage does not modify the profile of any Model in a Unit for which it is selected. Unlocks the Support Banner Additional Detachment.",
  },
  {
    id: "precepteur",
    nom: "Preceptor (Household Rank)",
    chevalier: true,
    unParArmee: true,
    exempteUnParArmeeSiMaisonnee: "mechanicum",
    // Le bonus d'Intelligence 8 « pour les besoins de la Règle Spéciale
    // Guerrier-artisan (X) » n'est pas une Règle Spéciale nommée : reste
    // texte seul, non appliqué par reglesAvantagePrincipalDe.
    reglesAppliquees: ["Battlesmith (2)"],
    texte:
      "0-1 per Army (restriction lifted for an Army with the Mechanicum Household Paradigm). All Models in the Unit gain the Battlesmith (2) Special Rule and count as having an Intelligence Characteristic of 8 for the purposes of the Battlesmith (X) Special Rule. Unlocks the Automata Talon Additional Detachment.",
  },
  {
    id: "uhlan",
    nom: "Uhlan (Household Rank)",
    chevalier: true,
    unParArmee: true,
    reglesAppliquees: ["Fleet (2)", "Impact (A)"],
    texte:
      "0-1 per Army. All Models in the Unit gain the Fleet (2) and Impact (A) Special Rules. No Questoris Vow other than the Vow of Haste may be declared for a Model in the Unit.",
  },
  {
    id: "auctellier",
    nom: "Auctellier (Household Rank)",
    chevalier: true,
    unParArmee: true,
    reglesAppliquees: ["Precision (5+) (Melee Weapons)"],
    texte:
      "0-1 per Army. All Models in the Unit gain the Precision (5+) Special Rule on their Melee Weapons. No Questoris Vow other than the Vow of Execution may be declared for a Model in the Unit.",
  },
  {
    id: "endeuilleur",
    nom: "Mourner (Household Rank)",
    chevalier: true,
    unParArmee: true,
    reglesAppliquees: ["Fear (2)"],
    texte:
      "0-1 per Army. All Models in the Unit gain the Fear (2) Special Rule. No Questoris Vow other than the Vow of Slaughter may be declared for a Model in the Unit.",
  },
  {
    id: "preux-implacable",
    nom: "Implacable Gallant (Household Rank)",
    chevalier: true,
    unParArmee: true,
    reglesAppliquees: ["Firestorm"],
    texte:
      "0-1 per Army. All Models in the Unit gain the Firestorm Special Rule. No Questoris Vow other than the Vow of Resolve may be declared for a Model in the Unit.",
  },
  {
    id: "senechal",
    nom: "Seneschal (Household Rank)",
    chevalier: true,
    unParArmee: true,
    texte:
      "0-1 per Army. When a Penetrating Hit is allocated to a Model in the Unit, the Damage of the Penetrating Hit is modified by -1 (minimum 1). The Unit counts as a High Command Choice for the purposes of any version of the Slay the Warlord (X) Secondary Objective. If the Knight Households Primary Detachment contains a Unit with this Advantage, the Controlling Player gains a bonus Reaction point.",
  },
  {
    id: "seigneur-preux",
    nom: "Gallant Lord (Household Rank)",
    chevalier: true,
    unParArmee: true,
    exempteUnParArmeeSiMaisonnee: "imperialis",
    texte:
      "0-1 per Army (restriction lifted for an Army with the Imperialis Household Paradigm). All Models in the Unit may benefit from two of the Active Player's Repair Tests in each of their Statuses Sub-phases, instead of one. Unlocks the Commoner Household Additional Detachment.",
  },
  {
    id: "arbaletrier",
    nom: "Arbalester (Household Rank)",
    chevalier: true,
    unParArmee: true,
    texte:
      "0-1 per Army. When a Model in the Unit moves a distance less than or equal to half its Movement Characteristic in the Movement Phase, it still benefits from the variant of the Heavy (X) or Ordnance (X) Special Rule on its Weapons.",
  },
  {
    id: "preux-aspirant",
    nom: "Aspirant Gallant (Household Rank)",
    chevalier: true,
    // Le modificateur -1 à la Règle Spéciale Autoréparation (X) déjà
    // présente sur la Figurine n'est pas un gain de Règle Spéciale :
    // reste texte seul, non appliqué par reglesAvantagePrincipalDe.
    reglesAppliquees: ["Expendable (1)"],
    texte:
      "All Models in the Unit gain the Expendable (1) Special Rule and modify by -1 the value of X of any Auto-repair (X) Special Rule they have. Unlocks the Armiger Talon Additional Detachment.",
  },
  /* --- Legio Custodes (livre d'armée officiel, GW 2026), page
     « Avantages Principaux Additionnels » : réservés à une Unité
     composée uniquement de Figurines qui ont le Trait Legio Custodes
     (traitRequis: "[Legio Custodes]", le Trait générique littéral que
     portent toutes les Unités de cette Faction — voir js/unites-data.js,
     pas de sous-choix de Légion ici contrairement à [Legiones
     Astartes]). --- */
  {
    id: "custodes-prefet",
    nom: "Prefect",
    traitRequis: "[Legio Custodes]",
    uniteRequise: [{ id: "custodes-capitaine-rempart" }],
    // Avantage désormais appliqué en vrai (2026-08-02, bug signalé) :
    // le bonus de +1 PV de Base est appliqué par bonusAvantagePrincipal
    // (js/unites.js, cas "custodes-prefet"), et la Règle Spéciale
    // Officier de Ligne (2) par reglesAppliquees ci-dessous — sur le
    // même principe que Résistance Anormale (Death Guard), qui reste
    // elle en revanche texte seul (voir plus bas) faute d'avoir été
    // signalée comme un bug par le proprio.
    reglesAppliquees: ["Officer of the Line (2)"],
    texte:
      "Reserved for a Prime Slot occupied by a Bastion Captain Unit. All Models in the Unit selected to occupy the Prime Slot granting this Prime Advantage have their Base Wounds Characteristic modified by +1, and gain the Officer of the Line (2) Special Rule.",
  },
  {
    id: "custodes-garde-hetaeron",
    nom: "Hetaeron Guard",
    traitRequis: "[Legio Custodes]",
    unParArmee: 2,
    texte:
      "For the Unit selected to occupy a Prime Slot granting this Prime Advantage, the value of X of the Eternal Warrior (X) Special Rule of Infantry or Cavalry Type Models with the Legio Custodes Trait is raised to 2.",
  },
  /* --- Divisio Assassinorum (livre d'armée officiel). --- */
  {
    id: "agent-de-clade",
    nom: "Clade Agent",
    loyaliste: true,
    unParArmee: true,
    principalUniquement: true,
    ajouteCase: true,
    rolesCaseAjoutee: ["Support"],
    nombreCasesAjoutees: 3,
    factionCaseAjoutee: "divisio-assassinorum",
    texte:
      "Reserved for a Loyalist Allegiance Unit selected to occupy a Prime Force Organisation Slot in an Army's Primary Detachment, only once per Army: adds three Support Battlefield Role Slots to the Detachment, which may only be occupied by a Unit from the Divisio Assassinorum Army List.",
  },
  /* --- Blackshields (« Legacies of the Age of Darkness : Legiones
     Astartes Blackshields »). --- */
  {
    // N'existe QUE sous le Serment du Moment Dans la Disgrâce, Tous sont
    // Égaux (SERMENTS_DU_MOMENT, id "disgrace-egaux") : jamais listé
    // pour une Case Principale ordinaire (voir avantagesPossibles(),
    // js/organigramme.js, filtre `avantage.id === "petit-seigneur-de-
    // guerre"`). Bonus de Caractéristiques identique à Maître-sergent :
    // réutilise le même code (bonusAvantagePrincipal, js/unites.js).
    id: "petit-seigneur-de-guerre",
    nom: "Petty Warlord",
    sergent: true,
    texte:
      "Prime Advantage reserved for the Supreme Force Organisation Slots of the In Disgrace all are Equal Oath of Moment. A Model of the Sergeant Sub-type in the Unit occupying the Slot gains +1 to its Attacks, Weapon Skill and Leadership Characteristics, as well as the Champion Sub-type (if it already has it, it gains an additional +1 Leadership instead). If this Advantage is chosen for a Unit in a Primary or Allied Detachment, an Auxiliary Detachment may be attached to it as if that Unit occupied a High Command Choice; all Slots in that Auxiliary Detachment then themselves become Supreme Force Organisation Slots, reserved for the same Petty Warlord Prime Advantage.",
  },
  /* --- Légions Brisées (« Legacies of the Age of Darkness : The Shattered
     Legions »). Prime Advantage non implémenté mécaniquement sur ce site
     (voir CLAUDE.md, note Parangons de la Légion). --- */
  {
    id: "exemplars-of-the-legion",
    nom: "Exemplars of the Legion",
    factionRequise: "legions-brisees",
    texte:
      "Prime Advantage reserved for Command Battlefield Role Units with the Shattered Legions Trait, occupying a Prime Force Organisation Slot. Adds an additional Slot to the Detachment, of any Battlefield Role except High Command, Command, Warlord and Lord of War. The added Slot must be filled by a generic Legiones Astartes Unit (without the Unique Sub-type) with a Legion Trait matching that of the Unit occupying the Prime Slot. Models in this added Unit lose their original Legion Trait and gain Shattered Legions, as well as the Legion Specialists Special Rule (restriction on benefits from Mutable Tactics). Several Units may select this Advantage for the same Detachment, adding several additional Slots. Not simulated on this site: placement of these added Slots remains manual.",
  },
];

/* Rôles interdits à la case supplémentaire du Bénéfice Logistique
   (p. 283). */
const ROLES_INTERDITS_LOGISTIQUE = [
  "High Command",
  "Command",
  "Warlord",
  "Lords of War",
];

/* ----------------------------------------------------------
   SERMENTS DU MOMENT (Oaths of Moment) — « Legacies of the Age of
   Darkness : Legiones Astartes Blackshields », Third Edition v1.1.
   Choisis sur une carte de Détachement Principal (jusqu'à 2) ou Allié
   (jusqu'à 1) d'une Armée de Faction "blackshields" (voir
   js/organigramme.js, construireCarteDetachement) ; tout Détachement
   Auxiliaire/d'Apex hérite des Serments du Détachement Principal/Allié
   auquel le joueur le rattache explicitement (`det.serimentsRattaches`
   — ce site ne conserve pas de lien formel "quelle Case a débloqué
   quel Détachement", voir CLAUDE.md/debloqueursDisponibles, d'où ce
   choix explicite plutôt qu'une déduction automatique).

   Consommés par js/unites.js :
   - `reglesSermentsDe(unite, instance)` : Règles Spéciales/Traits
     accordés (reglesAppliquees/traitsAppliques, avec filtre optionnel
     `sousTypesRequis`/`excluVehicule`) + transformation Ligne (X)/
     Avant-garde (X) → Règle Spéciale de remplacement
     (`transformeLigneVanguard`).
   - `typeEffectifDe(unite, instance)` : remplacement de Type Infanterie
     → Automate (`remplaceTypeInfanterieParAutomate`).
   - `legionRequiseSatisfaite`/options d'équipement : Légion choisie
     pour le Serment Panoplie d'Antan (`requiertChoixLegion`) et armes
     débloquées par Souillure Xenos/Armes du Désespoir
     (`debloqueArmes`/`imposeEchangeBolters`).
   - `bonusSermentDuMoment` (miroir de `bonusAvantagePrincipal`) :
     modificateurs de Caractéristiques de L'Hélice Brisée
     (`choixCloneAberrant`).

   Consommés par js/organigramme.js (caseAccepte/construireCarteDetachement) :
   - `convertitRoleCase` : { de, vers, restreintUniteIds? } — rôle
     effectif d'une Case ordinaire (non `extra`) réaffecté tant que ce
     Serment est actif sur le Détachement (La Fierté est Notre
     Armure/Seuls et Oubliés).
   - `interditTroupes` : aucune Case de Rôle Troupes ne peut plus être
     occupée dans ce Détachement NI dans un Détachement Auxiliaire/
     d'Apex qui lui est rattaché.
   - `interditQGEtatMajor` + `toutesCasesDeviennentPrime` +
     `avantagePrincipalRestreint` : Dans la Disgrâce, Tous sont Égaux —
     bloque les Cases Quartier Général/État-major, et restreint
     l'Avantage Principal sélectionnable sur toute Case ordinaire du
     Détachement au seul Petit Seigneur de Guerre (mécanisme de Case
     d'Organigramme de Force Suprême propre à ce Serment, qui CRÉE
     lui-même ses Cases Suprêmes plutôt que de dépendre de la règle de
     base du livre — voir la note plus haut sur Parangons de la Légion,
     dont l'équivalent Légions Brisées reste hors de portée de ce
     fichier faute du texte de la règle de base des Cases
     d'Organigramme de Force Suprême).

   `excluAvec` : [id de Serment] — ne peut pas être combiné, dans le
   MÊME Détachement, avec l'un des Serments listés (réciproque, les
   deux entrées se référencent mutuellement) — vérifié par
   `sermentsCompatibles`, js/organigramme.js.
   ---------------------------------------------------------- */
const SERMENTS_DU_MOMENT = [
  {
    id: "vendetta-eternelle",
    nom: "The Eternal Vendetta",
    reglesAppliquees: ["Hatred (Legiones Astartes)"],
  },
  {
    id: "panoplie-antan",
    nom: "Panoply of Old",
    requiertChoixLegion: true,
  },
  {
    id: "seule-la-mort",
    nom: "Only in Death does Duty End",
  },
  {
    id: "depouilles-victoire",
    nom: "The Spoils of Victory",
    excluAvec: ["faucheurs-vies"],
    transformeLigneVanguard: {
      nomRemplacement: "Loot the Dead",
      diviseurAvantGarde: 2,
    },
  },
  {
    id: "eternite-guerre",
    nom: "An Eternity of War",
  },
  {
    id: "chair-est-faible",
    nom: "The Flesh is Weak",
    excluVehicule: true,
    remplaceTypeInfanterieParAutomate: true,
    remplaceReglePar: {
      ancienne: "Bastard Sons of Fate",
      nouvelle: "Linked Cogitator Units",
    },
    transportGagneRegle: "Augmetic Transport Bay",
  },
  {
    id: "heritage-nikaea",
    nom: "The Legacy of Nikaea",
    sousTypesRequis: ["Sergeant", "Champion", "Specialist", "Command"],
    traitsAppliques: ["Psyker"],
    reglesAppliquees: ["Malignant"],
  },
  {
    id: "helice-brisee",
    nom: "The Broken Helix",
    excluVehicule: true,
    choixCloneAberrant: true,
  },
  {
    id: "disgrace-egaux",
    nom: "In Disgrace all are Equal",
    interditQGEtatMajor: true,
    toutesCasesDeviennentPrime: true,
    avantagePrincipalRestreint: "petit-seigneur-de-guerre",
  },
  {
    id: "fierte-armure",
    nom: "Pride is our Armour",
    convertitRoleCase: { de: "Troops", vers: "Elites" },
    interditTroupes: true,
  },
  {
    id: "souillure-xenos",
    nom: "The Taint of the Xenos",
    debloqueArmes: ["Deathlock", "Doomlock", "Halo blade"],
  },
  {
    id: "armes-desespoir",
    nom: "The Weapons of Desperation",
    excluVehicule: true,
    imposeEchangeBolters: true,
  },
  {
    id: "lame-du-juste",
    nom: "The Blade of the Just",
    excluAvec: ["faucheurs-vies", "depouilles-victoire"],
    transformeLigneVanguard: {
      nomRemplacement: "Doomed Heroics",
      multiplicateur: 2,
      valeurParDefaut: 3,
    },
  },
  {
    id: "faucheurs-vies",
    nom: "Reapers of Lives",
    excluAvec: ["depouilles-victoire", "lame-du-juste"],
    transformeLigneVanguard: { nomRemplacement: null },
  },
  {
    id: "seuls-oublies",
    nom: "Alone and Forgotten",
    // "Command Slots" (anglais) = Cases d'État-major sur ce site (voir
    // ROLES_TACTIQUES : Quartier Général = "High Command", État-major =
    // "Command") — pas Quartier Général, malgré la tentation du nom
    // français « Choix de Commandement ».
    convertitRoleCase: {
      de: "Troops",
      vers: "Command",
      restreintUniteIds: ["centurion", "centurion-terminator"],
    },
    // « A Detachment that has this Oath of Moment may only include
    // Command Choices » : au-delà des Cases Troupes reconverties
    // ci-dessus, TOUTE AUTRE Case (Quartier Général, Suite,
    // Transports…) du Détachement reste bloquée — seules les Cases
    // d'État-major (d'origine ou reconverties) restent occupables.
    restreintRoleUnique: "Command",
    reglesAppliqueesUniteIds: {
      uniteIds: ["centurion", "centurion-terminator"],
      regles: ["Reckless", "To Fight and Die Alone"],
    },
  },
];
