/* ============================================================
   organigramme.js — Assistant de Sélection d'Armée (construction-liste.html)
   Auteur : Jean · Créé : 2026-07-17
   Rôle   : implémente les règles de Sélection d'Armée du Livre de
   Règles « l'Âge des Ténèbres » (p. 282-285) et du livre d'armée
   Legiones Astartes :
   - Détachement Principal unique (1 QG, 3 État-major, 4 Troupes,
     4 Transports) et respect des Rôles Tactiques ;
   - déblocage des Détachements Auxiliaires / d'Apex par les Cases
     d'État-major et de Quartier Général remplies (une Case QG sert
     à UN SEUL déblocage : Auxiliaire ou Apex, jamais les deux) ;
   - règle « Officier de Ligne (X) » (X Auxiliaires par Case) ;
   - quotas : Seigneur de Guerre + Seigneur des Batailles ≤ 25 %
     combiné, Alliés ≤ 50 %, Seigneur de Guerre ≥ 3000 pts ;
   - Cases Principales et Avantages Principaux (dont Affectation
     Spéciale, Bénéfice Logistique et Vrais Croyants) ;
   - validation en temps réel avec messages d'erreur explicites.
   Dépend : js/main.js (fabrique DOM el), js/organigramme-data.js
   et js/unites-data.js (chargés avant). js/unites.js appelle
   Organigramme.initialiser(...) et consomme l'API publique exposée
   en bas de fichier.
   Sécurité : textContent partout, jamais innerHTML (anti-XSS).
   Persistance : localStorage (aucune donnée envoyée à un serveur).
   ============================================================ */

/* ----------------------------------------------------------
   ÉTAT
   Un détachement = { uid, typeId, cases: [...] }
   Une case = { role, principale, uniteUid, avantage, extra }
   - uniteUid : uid de l'instance d'unité (gérée par js/unites.js)
     qui occupe la case, ou null si la case est libre ;
   - avantage : id d'AVANTAGES_PRINCIPAUX (cases principales) ;
   - extra    : true si la case a été ajoutée par l'avantage
     « Bénéfice Logistique » (role choisi par le joueur).
   ---------------------------------------------------------- */
const Organigramme = (() => {
  let etat = {
    limite: 3000, // Limite de points
    faction: "legio-astartes", // id FACTIONS (seule Legio Astartes est jouable pour l'instant)
    allegeance: "loyaliste", // "loyaliste" | "renegat" (Vrais Croyants)
    legion: "", // id LEGIONS ou "" (Choisir Légion)
    maisonnee: "", // id MAISONNEES ou "" (Choisir Maisonnée, Chevaliers Questoris seulement)
    riteDeGuerre: "", // id d'un RITES_DE_GUERRE[legion] ou "" (aucun choisi)
    doctrineCohorte: "", // id DOCTRINES_DE_COHORTE ou "" (Solar Auxilia seulement)
    designationAuxilia: "", // id DESIGNATIONS_LEGIONES_AUXILIA ou "" (Solar Auxilia seulement, facultatif)
    chartPrincipal: "", // id d'un Détachement Principal alternatif (famille "principal", Journal Tactica : Zone Mortalis) ou "" (Détachement Principal de Croisade standard) — toute Faction sauf Legio Titanicus, facultatif
    dominion: "", // id DOMINIONS_ETHERIQUES ou "" (Choisir un Dominion Éthérique, Démons de la Tempête de la Ruine seulement)
    technoArcane: "", // id TECHNO_ARCANES ou "" (Choisir un Techno-arcane Majeur, Mechanicum seulement)
    legionsBrisees: [], // codes LEGIONS choisis (2 ou 3) — Faction Légions Brisées seulement, remplace etat.legion pour cette Faction
    detachements: [],
  };

  // Légions temporairement grisées malgré la présence d'unités qui
  // leur sont réservées (ex. transcription en cours de relecture).
  // Retirer l'entrée ici suffit à réactiver la sélection.
  const LEGIONS_INDISPONIBLES = [];

  // Factions du menu « Faction » (p. 282, « Armée » au Livre de Règles) :
  // Chevaliers Questoris n'a pas encore d'unité transcrite (voir
  // MAISONNEES/SKINS_MAISONNEE ci-dessous) : le menu « Maisonnée » qui
  // remplace le menu Légion pour cette Faction pose seulement le cadre
  // (skin, état, organigramme vierge) en attendant.
  const FACTIONS = [
    ["legio-astartes", "Legio Astartes", true],
    ["legio-custodes", "Legio Custodes", true],
    ["legio-titanicus", "Legio Titanicus", true],
    ["chevaliers-questoris", "Chevaliers Questoris", true],
    ["mechanicum", "Mechanicum", true],
    ["solar-auxilia", "Solar Auxilia", true],
    ["skitarii", "Conclaves Skitarii", true],
    ["anathema-psykana", "Anathema Psykana", true],
    ["daemons-ruinstorm", "Démons de la Tempête de la Ruine", true],
    ["legions-brisees", "Légions Brisées", true],
    ["blackshields", "Blackshields", true],
  ];

  const LEGIONS = [
    ["I", "I – Dark Angels"],
    ["III", "III – Emperor’s Children"],
    ["IV", "IV – Iron Warriors"],
    ["V", "V – White Scars"],
    ["VI", "VI – Space Wolves"],
    ["VII", "VII – Imperial Fists"],
    ["VIII", "VIII – Night Lords"],
    ["IX", "IX – Blood Angels"],
    ["X", "X – Iron Hands"],
    ["XII", "XII – World Eaters"],
    ["XIII", "XIII – Ultramarines"],
    ["XIV", "XIV – Death Guard"],
    ["XV", "XV – Thousand Sons"],
    ["XVI", "XVI – Sons of Horus"],
    ["XVII", "XVII – Word Bearers"],
    ["XVIII", "XVIII – Salamanders"],
    ["XIX", "XIX – Raven Guard"],
    ["XX", "XX – Alpha Legion"],
  ];

  // Dominions Éthériques (Liber Ruinstorm, « Daemons of the Ruinstorm »,
  // p. 3-6) : Trait choisi UNE FOIS pour toute l'Armée (pas par
  // Détachement ni par Unité, contrairement au Techno-arcane Majeur
  // Mechanicum/au Trait de Faction Skitarii) — le livre impose que
  // toute Unité du Détachement Principal ayant un Dominion Éthérique
  // partage le même. Remplace le placeholder « [Dominion Éthérique] »
  // posé dans `traits` des Unités génériques de cette Faction (voir
  // dominionEtheriqueDe, js/unites.js) ; les Unités/Figurines propres à
  // un Dominion précis (ex : Ka'bandha, Heedless Slaughter) portent leur
  // Trait fixe en dur et ne sont jamais concernées par ce menu.
  const DOMINIONS_ETHERIQUES = [
    "Ruine Rampante",
    "Massacre Insouciant",
    "Corruption Putride",
    "Sensation Extatique",
    "Distorsion Informe",
    "Tempête Infernale",
    "Dissolution Vorace",
    "Artifice Malveillant",
  ];

  // Techno-arcanes Majeurs (Liber Mechanicum, p. 13/45-51) : Trait de
  // Faction choisi UNE FOIS pour toute l'Armée Mechanicum (pas par
  // Détachement ni par Unité) — les Unités génériques portent le
  // placeholder « [Mechanicum] » qui est remplacé par le choix d'Armée ;
  // les Unités propres à un Techno-arcane portent le Trait fixe en dur
  // et restent accessibles seulement si ce Techno-arcane est sélectionné.
  const TECHNO_ARCANES = [
    ["archimandrite", "Archimandrite"],
    ["cybernetica", "Cybernetica"],
    ["lacrymaerta", "Lacrymaerta"],
    ["myrmidax", "Myrmidax"],
    ["reductor", "Reductor"],
    ["malagra", "Malagra"],
    ["macrotek", "Macrotek"],
  ];

  // Options d'Arcane de Mechanicum, une par Techno-arcane, choisies
  // une seule fois pour toute l'Armée (après sélection du Techno-arcane)
  const OPTIONS_ARCANES = {
    archimandrite: [
      ["theurgika-maximus", "Theurgika Maximus"],
    ],
    cybernetica: [
      ["paragon-de-metal", "Paragon de Métal"],
    ],
    lacrymaerta: [
      ["specimens-de-choix", "Spécimens de Choix"],
    ],
    myrmidax: [
      ["la-voie-du-myrmidion", "La Voie du Myrmidion"],
    ],
    reductor: [
      ["principe-thallakii", "Principe Thallakii"],
    ],
    malagra: [
      ["principe-thallakii", "Principe Thallakii"],
    ],
    macrotek: [
      ["convoyeur-principal", "Convoyeur Principal"],
    ],
  };

  // Types de Maisonnée du livre d'armée Chevaliers Questoris, choisis
  // à la place d'une Légion pour cette Faction (menu « Maisonnée »,
  // voir construireParametres) : à la différence d'une Légion, le
  // type de Maisonnée n'impose pas d'Allégeance (le joueur la choisit
  // librement via le menu Allégeance, comme pour toute autre Faction).
  // Factions ayant une subdivision interne dans ce fichier (Légion,
  // Maisonnée, Doctrine de Cohorte) : consommée par
  // construireSelectFactionAlliee, p. 283 « Chaque Légion Astartes
  // comptant comme une Faction distincte » généralisé à ces trois
  // Factions — un Détachement Allié PEUT donc porter la même Faction
  // que le Détachement Principal à condition de différer sur sa
  // subdivision (Légion/Maisonnée/Doctrine Alliée, voir
  // construireSelectLegionAlliee/MaisonneeAlliee/DoctrineAlliee
  // ci-dessous). Les autres Factions (Legio Titanicus, Mechanicum)
  // n'ont pas de subdivision ici : leur Détachement Allié doit porter
  // une Faction strictement différente de celle du Détachement
  // Principal.
  const FACTIONS_AVEC_SOUS_IDENTITE = [
    "legio-astartes",
    "chevaliers-questoris",
    "solar-auxilia",
  ];

  const MAISONNEES = [
    ["imperialis", "Questoris Imperialis"],
    ["mechanicum", "Questoris Mechanicum"],
    ["mendicus", "Questoris Mendicus"],
  ];

  // Doctrines de Cohorte : voir DOCTRINES_DE_COHORTE, js/organigramme-
  // data.js (constante globale, chargée avant ce fichier) — rendu
  // obligatoire dans l'outil avant de pouvoir ajouter des Unités
  // (demande du proprio) — voir le verrou dans actualiserVerrouLegion
  // (js/unites.js), même principe que la Légion/Maisonnée pour les
  // autres Factions.

  /* Skins thématiques (page construction-liste.html) : quand une Légion listée ici
     est choisie, une classe est posée sur <body> (voir appliquerSkin
     Legion) — la palette de couleurs de tout le site (variables CSS
     --accent, --titre…, voir css/style.css) se recolore en
     conséquence, et un bandeau de contexte historique s'affiche sous
     les paramètres de la partie. Légions sans entrée ici : skin par
     défaut inchangé. */
  const SKINS_LEGION = {
    I: {
      classe: "skin-legion-i",
      icone: "dark-angels",
      nom: "Dark Angels",
      primarque: "Lion El'Jonson",
      monde: "Caliban",
      allegeance: "loyaliste",
      // Couleur d'accent (--accent du skin body.skin-legion-* ci-dessous,
      // css/style.css) : dupliquée ici pour teinter la Légion propriétaire
      // d'une unité affichée hors de son propre skin de page (ex : liste
      // « Unité à ajouter », voir js/unites.js).
      accent: "#1f3a24",
      devise:
        "Chevaliers de Caliban, les fils du Lion gardent un secret plus lourd que leurs épées : celui des Frères Déchus qu'ils traquent sans repos.",
    },
    III: {
      classe: "skin-legion-iii",
      icone: "emperors-children",
      nom: "Emperor's Children",
      primarque: "Fulgrim",
      monde: "Chemos",
      allegeance: "renegat",
      accent: "#4a1a5c",
      devise:
        "Nés dans les brumes toxiques de Chemos, les fils de Fulgrim ne recherchent qu'une chose : la perfection absolue, jusqu'à l'obsession.",
    },
    IV: {
      classe: "skin-legion-iv",
      icone: "iron-warriors",
      nom: "Iron Warriors",
      primarque: "Perturabo",
      monde: "Olympia",
      allegeance: "renegat",
      accent: "#4a4a4a",
      devise:
        "Rancuniers et increvables, les fils de Perturabo ne connaissent que la guerre de siège : pierre après pierre, bastion après bastion, jusqu'à la victoire.",
    },
    V: {
      classe: "skin-legion-v",
      icone: "white-scars",
      nom: "White Scars",
      primarque: "Jaghatai Khan",
      monde: "Chogoris",
      allegeance: "loyaliste",
      accent: "#a3341c",
      devise:
        "Cavaliers de Chogoris, les fils de Jaghatai Khan frappent à la vitesse du vent et ne laissent à l'ennemi que la poussière de leur passage.",
    },
    VI: {
      classe: "skin-legion-vi",
      icone: "space-wolves",
      nom: "Space Wolves",
      primarque: "Leman Russ",
      monde: "Fenris",
      allegeance: "loyaliste",
      accent: "#33454e",
      devise:
        "Nés dans la glace de Fenris, les fils de Leman Russ chassent en meute et ne connaissent d'autre loi que celle du loup.",
    },
    VII: {
      classe: "skin-legion-vii",
      icone: "imperial-fists",
      nom: "Imperial Fists",
      primarque: "Rogal Dorn",
      monde: "Terra (Inwit)",
      allegeance: "loyaliste",
      accent: "#5c4712",
      devise:
        "Bâtisseurs increvables, les fils de Rogal Dorn tiennent leurs murs jusqu'au dernier homme : reculer n'est pas un mot qu'ils connaissent.",
    },
    VIII: {
      classe: "skin-legion-viii",
      icone: "night-lords",
      nom: "Night Lords",
      primarque: "Konrad Curze",
      monde: "Nostramo",
      allegeance: "renegat",
      accent: "#10151f",
      devise:
        "Nés dans l'ombre de Nostramo, les fils de Konrad Curze sèment une terreur si totale que la résistance meurt avant le premier coup.",
    },
    IX: {
      classe: "skin-legion-ix",
      icone: "blood-angels",
      nom: "Blood Angels",
      primarque: "Sanguinius",
      monde: "Baal",
      allegeance: "loyaliste",
      accent: "#7a0c0c",
      devise:
        "Hantée par la Soif Rouge et la Rage Noire, la IXe Légion mène la charge avec une noblesse et une fureur qui n'appartiennent qu'à elle.",
    },
    X: {
      classe: "skin-legion-x",
      icone: "iron-hands",
      nom: "Iron Hands",
      primarque: "Ferrus Manus",
      monde: "Medusa",
      allegeance: "loyaliste",
      accent: "#2a1414",
      devise:
        "Sur Médusa, la chair est faiblesse : les fils de Ferrus Manus remplacent leurs membres par l'acier et ne pleurent jamais leurs pertes.",
    },
    XII: {
      classe: "skin-legion-xii",
      icone: "world-eaters",
      nom: "World Eaters",
      primarque: "Angron",
      monde: "Nuceria",
      allegeance: "renegat",
      accent: "#8a3a12",
      devise:
        "Rongés par les Clous du Boucher, les fils d'Angron ne connaissent plus la retraite : seule la rage guide leurs haches jusqu'au dernier ennemi debout.",
    },
    XIII: {
      classe: "skin-legion-xiii",
      icone: "ultramarines",
      nom: "Ultramarines",
      primarque: "Roboute Guilliman",
      monde: "Macragge",
      allegeance: "loyaliste",
      accent: "#1c3a6e",
      devise:
        "Fils de Guilliman, les Ultramarines incarnent la discipline et la civilisation : chaque bataille suit un plan, chaque plan sert l'Imperium.",
    },
    XIV: {
      classe: "skin-legion-xiv",
      icone: "death-guard",
      nom: "Death Guard",
      primarque: "Mortarion",
      monde: "Barbarus",
      allegeance: "renegat",
      accent: "#3a4a2e",
      devise:
        "Endurcis par les miasmes de Barbarus, les fils de Mortarion refusent de tomber : leur endurance est aussi implacable que la faux qu'ils portent.",
    },
    XV: {
      classe: "skin-legion-xv",
      icone: "thousand-sons",
      nom: "Thousand Sons",
      primarque: "Magnus le Rouge",
      monde: "Prospero",
      allegeance: "renegat",
      accent: "#1c2f5c",
      devise:
        "Érudits de Prospero, les fils de Magnus le Rouge manient les arcanes psychiques avec une soif de savoir qui n'a d'égale que leur puissance.",
    },
    XVI: {
      classe: "skin-legion-xvi",
      icone: "sons-of-horus",
      nom: "Sons of Horus",
      primarque: "Horus Lupercal",
      monde: "Cthonia",
      allegeance: "renegat",
      accent: "#3a3020",
      devise:
        "Fils de Cthonia, les Sons of Horus suivent leur Primarque en toute chose — et c'est cette loyauté sans faille qui, un jour maudit, embrasa la galaxie.",
    },
    XVII: {
      classe: "skin-legion-xvii",
      icone: "word-bearers",
      nom: "Word Bearers",
      primarque: "Lorgar",
      monde: "Colchis",
      allegeance: "renegat",
      accent: "#4a1c1c",
      devise:
        "Nés dans la foi de Colchis, les fils de Lorgar ne se battent pas seulement pour l'Empereur : ils cherchent un dieu à vénérer, et ne s'arrêteront devant rien pour le trouver.",
    },
    XVIII: {
      classe: "skin-legion-xviii",
      icone: "salamanders",
      nom: "Salamanders",
      primarque: "Vulkan",
      monde: "Nocturne",
      allegeance: "loyaliste",
      accent: "#2a3a24",
      devise:
        "Forgés dans les volcans de Nocturne, les fils de Vulkan protègent l'humanité comme un père protège ses enfants — et frappent comme le marteau frappe l'enclume.",
    },
    XIX: {
      classe: "skin-legion-xix",
      icone: "raven-guard",
      nom: "Raven Guard",
      primarque: "Corvus Corax",
      monde: "Deliverance",
      allegeance: "loyaliste",
      accent: "#1c1c22",
      devise:
        "Fils de Corvus Corax, les Raven Guard frappent depuis l'ombre de Deliverance et disparaissent avant que l'ennemi ait pu riposter.",
    },
    XX: {
      classe: "skin-legion-xx",
      icone: "alpha-legion",
      nom: "Alpha Legion",
      primarque: "Alpharius et Omegon",
      monde: "—",
      allegeance: "renegat",
      accent: "#123a3c",
      devise:
        "Légion de l'ombre aux mille visages, les fils d'Alpharius et Omegon frappent partout à la fois : couper une tête n'a jamais suffi à tuer l'hydre.",
    },
  };

  /* Skin de la Faction Legio Titanicus (livre d'armée Legio Titanicus) :
     même mécanique que SKINS_LEGION ci-dessus (classe posée sur <body>,
     recolore --accent/--accent-clair/--fond-secondaire/--carte-hover),
     mais rattachée à la FACTION (etat.faction) plutôt qu'à une Légion
     précise — ce livre d'armée n'a pas de subdivision en Légions
     Titanicus dans ce site, contrairement aux Legiones Astartes.
     `classe` reprend volontairement le préfixe "skin-legion-" pour
     hériter des règles partagées body[class*="skin-legion-"] déjà
     définies ci-dessous (liserés, bordures de bouton…) sans les
     dupliquer. `blasons` : les deux bannières héraldiques conservées
     sous assets/logo_titan/ (1.png et 2.png ; les deux autres bannières
     d'origine ont été retirées du site puis celle-ci renumérotée de
     4.png à 2.png) — la première posée à gauche des titres, la
     seconde à droite (voir construireParametres et css/style.css, ainsi
     que appliquerSkinLegionGlobal dans js/main.js pour les pages hors
     pages/construction-liste.html). */
  const SKIN_TITANICUS = {
    classe: "skin-legion-titanicus",
    nom: "Legio Titanicus",
    devise:
      "Dieux de fer arpentant le champ de bataille, les Titans de la Legio Titanicus écrasent blindés et bastions sous des tonnes d'acier sacré, chacun gravé du blason de sa Légion.",
    blasons: [
      { fichier: "1.png", nom: "Ferrum Mori" },
      { fichier: "2.png", nom: "Paladin Argentus" },
    ],
  };

  /* Skin de la Faction Mechanicum (livre d'armée Mechanicum) : même
     mécanique que SKIN_TITANICUS ci-dessus (classe posée sur <body>,
     recolore --accent/--accent-clair/--fond-secondaire/--carte-hover,
     DEUX blasons posés à gauche et à droite des titres — voir
     `blasons`, assets/logo_mechanicum/1.png et 2.png), rattachée à la
     FACTION plutôt qu'à une subdivision — ce livre d'armée n'a pas de
     sous-identité dans ce site (à la différence de Legio Astartes/
     Chevaliers Questoris/Solar Auxilia). */
  const SKIN_MECHANICUM = {
    classe: "skin-legion-mechanicum",
    nom: "Mechanicum",
    devise:
      "Serviteurs de l'Omnimessie, les Adeptes du Mechanicum vénèrent la Machine comme un dieu : chaque rouage, chaque circuit est une prière gravée dans le métal.",
    blasons: [
      { fichier: "1.png", nom: "Adeptus Mechanicus" },
      { fichier: "2.png", nom: "Sigle du Culte Mechanicus" },
    ],
  };

  /* Skins des Factions Legio Custodes, Anathema Psykana et Conclaves
     Skitarii : même mécanique que SKIN_MECHANICUM ci-dessus (classe
     posée sur <body>, recolore --accent/--accent-clair/--fond-
     secondaire/--carte-hover), mais SANS blason — contrairement à
     tous les autres skins de ce fichier, aucun asset d'image n'existe
     pour ces trois Factions (pas de fan-art/héraldique sourcée), et il
     n'est pas possible d'en fabriquer une soi-même. Choix confirmé par
     le propriétaire (2026-08-01) : préférer un skin couleur seule dès
     maintenant plutôt qu'attendre une image, quitte à ajouter les
     blasons plus tard si des fichiers deviennent disponibles (suivre
     alors exactement le modèle blasons: [...] de SKIN_MECHANICUM). Pas
     de hook skinXxxActuel()/cheminLogoXxxActuel() pour la page de garde
     du PDF/Word non plus, par cohérence avec Mechanicum qui n'en a pas
     déjà (aucun texte de Faction sur cette page-là pour l'instant, même
     gap pré-existant). */
  const SKIN_LEGIO_CUSTODES = {
    classe: "skin-legion-legio-custodes",
    nom: "Legio Custodes",
    devise:
      "Gardiens muets du Trône Doré, les Custodiens ne connaissent ni doute ni repos : leur seul serment est de veiller sur l'Empereur, jusqu'à la mort et au-delà.",
  };
  const SKIN_ANATHEMA_PSYKANA = {
    classe: "skin-legion-anathema-psykana",
    nom: "Anathema Psykana",
    devise:
      "Muettes dans le Warp comme dans le silence, les Sœurs du Silence ne craignent ni sorcier ni démon : leur seule voix est celle de l'espadon qui juge.",
  };
  const SKIN_SKITARII = {
    classe: "skin-legion-skitarii",
    nom: "Conclaves Skitarii",
    devise:
      "Vassaux augmentés des Seigneurs des Forges, les Pérégrins de Combat Skitarii marchent sans relâche, corps et âme sacrifiés à la quête des reliques perdues.",
  };
  // Skins couleurs seules des trois Factions ajoutées ensuite (Démons de
  // la Tempête de la Ruine, Légions Brisées, Blackshields) : même
  // mécanique et même absence de blason que les trois ci-dessus (aucun
  // asset d'image sourcé pour ces suppléments Legacies).
  const SKIN_DAEMONS_RUINSTORM = {
    classe: "skin-legion-daemons-ruinstorm",
    nom: "Démons de la Tempête de la Ruine",
    devise:
      "Nées dans la tourmente du Warp, les hordes de la Tempête de la Ruine ne connaissent ni loi ni pitié : leur seul dessein est de faire déferler le chaos sur la galaxie.",
  };
  const SKIN_LEGIONS_BRISEES = {
    classe: "skin-legion-legions-brisees",
    nom: "Légions Brisées",
    devise:
      "Rejetés ou déserteurs de leur Légion d'origine, les guerriers des Légions Brisées ne répondent plus qu'à leurs propres serments, forgés dans l'adversité de l'Hérésie.",
  };
  const SKIN_BLACKSHIELDS = {
    classe: "skin-legion-blackshields",
    nom: "Blackshields",
    devise:
      "Le blason noirci, l'honneur perdu, les Blackshields ne se battent plus pour un Primarque ou un Empereur, mais pour leurs propres et amères raisons.",
  };

  /* Skins des types de Maisonnée (livre d'armée Chevaliers Questoris) :
     même mécanique que SKINS_LEGION (classe posée sur <body>, recolore
     --accent/--accent-clair/--fond-secondaire/--carte-hover, voir
     css/style.css), mais rattachée à etat.maisonnee plutôt qu'à
     etat.legion. `blason` (assets/logo_chevaliers/*.png) est posé sur le
     titre de page comme pour une Légion ou Legio Titanicus, voir
     creerIconeMaisonnee ci-dessous. */
  const SKINS_MAISONNEE = {
    imperialis: {
      classe: "skin-legion-questoris-imperialis",
      nom: "Questoris Imperialis",
      blason: "logo.png",
      devise:
        "Liées par serment à un monde ou une noblesse impériale, ces Maisonnées mettent leurs Chevaliers directement au service de l'Empereur.",
    },
    mechanicum: {
      classe: "skin-legion-questoris-mechanicum",
      nom: "Questoris Mechanicum",
      blason: "logo_2.png",
      devise:
        "Inféodées à un Monde-Forge, ces Maisonnées doivent à l'Adeptus Mechanicus la Manufacture Sacrée de leurs Chevaliers — et leur obéissance.",
    },
    mendicus: {
      classe: "skin-legion-questoris-mendicus",
      nom: "Questoris Mendicus",
      blason: "logo_3.png",
      devise:
        "Sans monde ni serment fixe, ces Maisonnées errantes louent leurs lames au plus offrant, de champ de bataille en champ de bataille.",
    },
  };

  // Détachement Additionnel débloqué par le Paradigme de chaque
  // Maisonnée (livre Chevaliers Questoris, Paradigmes de Maisonnée) —
  // voir maisonneePertinentePourDetachement/detachementDebloque
  // ci-dessous pour le mécanisme complet. Utilisé uniquement pour
  // nommer ce Détachement sur la page de garde du PDF/Word
  // (js/unites.js), pas pour la logique de déblocage elle-même.
  const DETACHEMENT_PARADIGME_MAISONNEE = {
    imperialis: "Maisnie Roturière",
    mechanicum: "Serre d'Automates",
    mendicus: "Serre d'Armigères",
  };

  /* Skins des Désignations de Legiones Auxilia (livre Legiones Auxilia
     intégré au Liber Auxilia p. 50-84) : remplace les anciens skins de
     Doctrine de Cohorte (retirés — six teintes génériques sans rapport
     avec le fluff réel des Cohortes) par un skin par Désignation
     (DESIGNATIONS_LEGIONES_AUXILIA, js/organigramme-data.js), rattachée
     à etat.designationAuxilia plutôt qu'à etat.doctrineCohorte. Ce choix
     restant facultatif (contrairement à la Doctrine de Cohorte), une
     Armée Solar Auxilia sans Désignation choisie garde la palette par
     défaut, sans skin.
     Dérivée de DESIGNATIONS_LEGIONES_AUXILIA plutôt que retranscrite à la
     main : chaque Désignation sert une Légion Astartes précise, la
     couleur d'accent (`accent`) et la devise reprennent donc celles de
     la Légion de tutelle (SKINS_LEGION ci-dessus) — le repère thématique
     le plus naturel en l'absence de couleurs propres à chaque régiment
     auxiliaire. `icone` (slug = id de la Désignation) sert de clé dans
     LOGOS_DESIGNATION_AUXILIA ci-dessous pour retrouver le blason sous
     assets/logo_solar_auxilia/, voir creerIconeDesignationAuxilia. */
  const SKINS_DESIGNATION_AUXILIA = Object.fromEntries(
    DESIGNATIONS_LEGIONES_AUXILIA.map((designation) => [
      designation.id,
      {
        classe: "skin-legion-solar-" + designation.id,
        icone: designation.id,
        nom: designation.nom,
        legionNom: designation.legionNom,
        accent: SKINS_LEGION[designation.legion].accent,
        devise: SKINS_LEGION[designation.legion].devise,
      },
    ]),
  );

  /* Blasons de Légion (assets/logo_legions/*.png) : bannières
     héraldiques officielles, une par Légion. La clé est le slug
     `icone` de SKINS_LEGION ci-dessus ; la valeur est le nom de
     fichier réel sous assets/logo_legions/ (quelques fichiers ont une
     coquille dans leur nom — ex. "raven_guards.png" — conservée telle
     quelle pour ne pas casser le lien vers le fichier ; "space_wolves"
     a été corrigé, l'ancien fichier "scpace_wolves.png" renommé). */
  const LOGOS_LEGION = {
    "dark-angels": "dark_angels",
    "emperors-children": "emperor_children",
    "iron-warriors": "iron_warriors",
    "white-scars": "white_scars",
    "space-wolves": "space_wolves",
    "imperial-fists": "imperial_fists",
    "night-lords": "night_lords",
    "blood-angels": "blood_angels",
    "iron-hands": "iron_hands",
    "world-eaters": "world_eaters",
    ultramarines: "ultramarines",
    "death-guard": "death_guards",
    "thousand-sons": "thousand_sons",
    "sons-of-horus": "sons_of_horus",
    "word-bearers": "word_bearers",
    salamanders: "salamanders",
    "raven-guard": "raven_guards",
    "alpha-legion": "alpha_legion",
  };

  /* Blasons de Désignation de Legiones Auxilia (assets/
     logo_solar_auxilia/*.png) : même principe que LOGOS_LEGION
     ci-dessus (clé = id de SKINS_DESIGNATION_AUXILIA, valeur = nom de
     fichier réel — plusieurs ont une coquille ou un raccourci dans leur
     nom par rapport à l'id établi ci-dessus, ex. "chasseur_calibanite.png"
     pour "chasseurs-calibanites", "damnatii_nostariens.png" pour
     "damnatii-nostramiens" — conservées telles quelles pour ne pas
     casser le lien vers le fichier). */
  const LOGOS_DESIGNATION_AUXILIA = {
    "chasseurs-calibanites": "chasseur_calibanite",
    "palatins-archites": "palatin_archites",
    "thorakites-selucides": "thorakites_selucides",
    "limitanei-chogoriens": "limitanei_chogoriens",
    "kaerls-fenrissiens": "kaerls_fenrissiens",
    "phalangites-dinwit": "phalangites_inwit",
    "damnatii-nostramiens": "damnatii_nostariens",
    "elevatii-saiphains": "elevatii_saiphains",
    "suaire-de-chaines-medusien": "suaire_de_chaine_stheneen",
    "thraexii-nagrakals": "thraexii_nagrakals",
    "haute-garde-dultramar": "haute_garde_ultramar",
    "ambaxtoi-de-barbarus": "ambaxtoi_de_barbarus",
    "gardespire-prosperienne": "gardespire_prosperien",
    "chasseurs-de-tetes-cthoniens": "chasseur_tete_chnotien",
    "velites-de-therion": "velite_therion",
    "vindictaires-sparatoi": "vindictaire_sparatoi",
  };

  /* ----------------------------------------------------------
     CLIN D'ŒIL — « Magnus did nothing wrong »
     Bandeau flottant, purement cosmétique, affiché tant que la Légion
     active de l'Armée est les Thousand Sons (XV) : quelques répliques
     de déni comique du fandom défilent en bas d'écran. Retiré dès
     qu'on change de Légion/Faction.
     construireParametres() (plus bas) est rappelée à chaque
     actualiser(), donc potentiellement très souvent : activerBandeau-
     Magnus() est idempotente pour ne pas relancer le cycle de phrases
     ni empiler les intervalles à chaque re-rendu — seul un changement
     réel d'état (absent -> présent ou l'inverse) a un effet.
     ---------------------------------------------------------- */
  const PHRASES_MAGNUS = [
    "Magnus did nothing wrong.",
    "L'Empereur n'a jamais répondu à ses avertissements.",
    "Tzeentch aussi n'a rien fait de mal.",
    "Prospero ne méritait pas ça.",
    "Il a juste changé de forme, c'est tout.",
  ];
  let intervalleMagnus = null;
  function activerBandeauMagnus(actif) {
    let bandeau = document.getElementById("magnus-banniere");
    if (actif) {
      if (bandeau) return; // déjà affiché : ne pas relancer le cycle
      bandeau = el("p", "magnus-banniere");
      bandeau.id = "magnus-banniere";
      document.body.appendChild(bandeau);
      let indice = 0;
      const afficherPhrase = () => {
        bandeau.classList.remove("visible");
        window.setTimeout(() => {
          bandeau.textContent = PHRASES_MAGNUS[indice];
          bandeau.classList.add("visible");
          indice = (indice + 1) % PHRASES_MAGNUS.length;
        }, 300);
      };
      afficherPhrase();
      intervalleMagnus = window.setInterval(afficherPhrase, 8000);
    } else {
      if (!bandeau) return;
      window.clearInterval(intervalleMagnus);
      intervalleMagnus = null;
      bandeau.remove();
    }
  }

  /* Image du blason (bannière héraldique complète, déjà en couleur :
     contrairement à l'ancien sprite ligne, elle ne suit pas --accent).
     `skin` = une entrée de SKINS_LEGION. Purement décorative dans les
     deux emplacements où elle est posée (le nom de la Légion est
     toujours affiché en texte juste à côté) : alt vide + aria-hidden,
     pour ne pas faire doublon au lecteur d'écran. */
  function creerIconeLegion(skin, classeSupplementaire) {
    const img = document.createElement("img");
    img.className = classeSupplementaire
      ? "legion-icon " + classeSupplementaire
      : "legion-icon";
    img.src =
      "../assets/logo_legions/" +
      (LOGOS_LEGION[skin.icone] || skin.icone) +
      ".png";
    img.alt = "";
    img.setAttribute("aria-hidden", "true");
    img.loading = "lazy";
    return img;
  }

  /* Équivalent de creerIconeLegion ci-dessus pour un blason de
     SKIN_TITANICUS.blasons (assets/logo_titan/*.png). `nom` est posé en
     `title` (pas d'équivalent au texte "Légion – nom" affiché à côté de
     creerIconeLegion, faute de Légion Titanicus sélectionnée) : tooltip
     souris facultatif, l'image reste purement décorative (alt vide +
     aria-hidden) pour le lecteur d'écran. */
  function creerIconeTitan(blason, classeSupplementaire) {
    const img = document.createElement("img");
    img.className = classeSupplementaire
      ? "legion-icon " + classeSupplementaire
      : "legion-icon";
    img.src = "../assets/logo_titan/" + blason.fichier;
    img.title = blason.nom;
    img.alt = "";
    img.setAttribute("aria-hidden", "true");
    img.loading = "lazy";
    return img;
  }

  /* Équivalent de creerIconeTitan ci-dessus pour un blason de
     SKIN_MECHANICUM.blasons (assets/logo_mechanicum/*.png). */
  function creerIconeMechanicum(blason, classeSupplementaire) {
    const img = document.createElement("img");
    img.className = classeSupplementaire
      ? "legion-icon " + classeSupplementaire
      : "legion-icon";
    img.src = "../assets/logo_mechanicum/" + blason.fichier;
    img.title = blason.nom;
    img.alt = "";
    img.setAttribute("aria-hidden", "true");
    img.loading = "lazy";
    return img;
  }

  /* Équivalent de creerIconeLegion ci-dessus pour un blason de
     SKINS_MAISONNEE (assets/logo_chevaliers/*.png). `skin` = une entrée
     de SKINS_MAISONNEE. */
  function creerIconeMaisonnee(skin, classeSupplementaire) {
    const img = document.createElement("img");
    img.className = classeSupplementaire
      ? "legion-icon " + classeSupplementaire
      : "legion-icon";
    img.src = "../assets/logo_chevaliers/" + skin.blason;
    img.alt = "";
    img.setAttribute("aria-hidden", "true");
    img.loading = "lazy";
    return img;
  }

  /* Équivalent de creerIconeLegion ci-dessus pour un blason de
     SKINS_DESIGNATION_AUXILIA (assets/logo_solar_auxilia/*.png, voir
     LOGOS_DESIGNATION_AUXILIA ci-dessus). */
  function creerIconeDesignationAuxilia(skin, classeSupplementaire) {
    const img = document.createElement("img");
    img.className = classeSupplementaire
      ? "legion-icon " + classeSupplementaire
      : "legion-icon";
    img.src =
      "../assets/logo_solar_auxilia/" +
      (LOGOS_DESIGNATION_AUXILIA[skin.icone] || skin.icone) +
      ".png";
    img.alt = "";
    img.setAttribute("aria-hidden", "true");
    img.loading = "lazy";
    return img;
  }

  let compteurDet = 0;
  let hooks = null; // fournis par js/unites.js (voir initialiser)

  const CLE_STOCKAGE_ORGA = "hh-armee-organigramme";

  /* ----------------------------------------------------------
     OUTILS DONNÉES
     ---------------------------------------------------------- */
  function typeParId(typeId) {
    return TYPES_DETACHEMENTS.find((t) => t.id === typeId);
  }

  function typeDe(det) {
    return typeParId(det.typeId);
  }

  // Légion « pertinente » pour les Cases de ce Détachement — celle du
  // Détachement Allié (`legionAlliee`, menu « Légion Alliée » de sa
  // carte) pour ses propres Cases, celle de l'Armée (etat.legion) pour
  // tout autre Détachement. Même règle que caseAccepte() (variable
  // `legionRequise`) pour la Légion requise d'une Unité. Consommée par
  // avantagesPossibles() pour ne proposer les Avantages d'Arsenal de
  // Légion (`traitRequis`) que pour la Légion à laquelle cette Case
  // peut effectivement donner accès.
  function legionPertinentePourCase(det) {
    return typeDe(det).id === "allie" ? det.legionAlliee : etat.legion;
  }

  // Paradigme de Maisonnée pertinent pour un Détachement (livre
  // d'armée Chevaliers Questoris) : celui propre au Détachement de
  // Seigneur des Batailles (`maisonneeSeigneurBatailles`, menu
  // « Maisonnée » de sa carte — seul moyen pour une Armée d'une AUTRE
  // Faction d'y faire valoir un Paradigme, `etat.maisonnee` n'étant
  // réglable que pour la Faction Chevaliers Questoris elle-même) pour
  // ce type de Détachement, sinon celui de l'Armée (etat.maisonnee) —
  // même principe que legionPertinentePourCase ci-dessus. Consommée
  // par detachementDebloque()/estCasePrincipale()/avantagesPossibles()
  // pour le bonus de chaque Paradigme (Serre d'Automates/d'Armigères,
  // Maisnie Roturière, exemption 0-1 par Armée, Cases Seigneurs des
  // Batailles « comme si » Principales pour Mendicus). Le Détachement
  // Allié (qui a lui aussi son propre `maisonneeAlliee`, purement
  // décoratif) est volontairement exclu : les 3 règles de Paradigme ne
  // citent que le Détachement Principal de Maisonnées de Chevaliers et
  // le Détachement de Seigneur des Batailles comme points de
  // rattachement possibles.
  function maisonneePertinentePourDetachement(det) {
    const id = typeDe(det).id;
    if (id === "seigneur-batailles") return det.maisonneeSeigneurBatailles;
    return etat.maisonnee;
  }

  // id du type de Détachement Principal correspondant à la Faction
  // actuelle (etat.faction) : "principal" (Legiones Astartes) ou
  // "ordinal-titanique" (Legio Titanicus, livre d'armée Legio
  // Titanicus). Consommé partout où le Détachement Principal était
  // jusqu'ici codé en dur sous l'id "principal" (initialiser,
  // reinitialiserArmeeAvecConfirmation).
  function idDetachementPrincipal() {
    if (etat.faction === "legio-titanicus") return "ordinal-titanique";
    // Le Choix de Détachement Principal (chartPrincipal, menu des
    // paramètres de la partie) prend le pas sur le Détachement
    // Principal de Maisonnées habituel de Chevaliers Questoris quand
    // il est renseigné — proposé pour toute Faction sauf Legio
    // Titanicus, voir construireParametres().
    if (etat.chartPrincipal) return etat.chartPrincipal;
    if (etat.faction === "chevaliers-questoris") return "maisonnees-chevaliers";
    return "principal";
  }

  // Faction implicite d'un Détachement Type qui ne déclare pas son
  // propre champ `faction` (principal, poing-blinde, seigneur-guerre,
  // avant-garde…) : Legio Astartes, Solar Auxilia (Liber Auxilia),
  // Mechanicum (Liber Mechanicum), Conclaves Skitarii, Legio Custodes ET
  // Anathema Psykana partagent le même Organigramme de Force de
  // Croisade (p. 283) et ses Détachements Auxiliaires/d'Apex standard
  // (Convocations de Moritoi/Hykanatoi/Tharanatoi/Euphoroi/Cataphractoi,
  // js/organigramme-data.js — préparées par anticipation avant même la
  // première Unité Custodes transcrite), contrairement à Legio
  // Titanicus (Ordinal Titanique) et Chevaliers Questoris (Détachement
  // Principal de Maisonnées), qui ont chacun le leur — d'où le repli
  // par défaut sur "legio-astartes" tant que l'Armée n'est ni Solar
  // Auxilia, ni Mechanicum, ni Skitarii, ni Legio Custodes, ni Anathema
  // Psykana. Utilisé par typeDisponiblePourFaction() et caseAccepte().
  function factionCroisadeParDefaut() {
    return etat.faction === "solar-auxilia" ||
      etat.faction === "mechanicum" ||
      etat.faction === "skitarii" ||
      etat.faction === "legio-custodes" ||
      etat.faction === "anathema-psykana" ||
      etat.faction === "daemons-ruinstorm"
      ? etat.faction
      : "legio-astartes";
  }

  // Un Détachement de Seigneur des Batailles Additionnel de l'Armée
  // porte-t-il la Maisonnée requise par `type` (`type.requiertMaisonnee`,
  // voir MODÈLE DE DONNÉES) ? Seul bypass de visibilité connu pour un
  // type par ailleurs réservé à la Faction Chevaliers Questoris (Serre
  // d'Armigères/d'Automates, Maisnie Roturière) : permet à une Armée
  // d'une AUTRE Faction (ex : Legio Astartes) de voir apparaître ce
  // Détachement dès qu'elle a réglé la Maisonnée de son propre
  // Détachement de Seigneur des Batailles sur la bonne valeur — sans
  // exiger qu'un Chevalier y soit déjà placé (la présence effective d'un
  // Chevalier n'est vérifiée qu'ensuite, par detachementDebloque(), pour
  // décider si le bouton est actif ou grisé). Utilisé par
  // typeDisponiblePourFaction() ci-dessous uniquement.
  function maisonneeSeigneurBataillesDebloqueVisibilite(type) {
    return (
      !!type.requiertMaisonnee &&
      etat.detachements.some(
        (d) =>
          typeDe(d).id === "seigneur-batailles" &&
          d.maisonneeSeigneurBatailles === type.requiertMaisonnee,
      )
    );
  }

  // Ce type de Détachement doit-il être proposé/accepté pour la Faction
  // actuelle (etat.faction) ? Même règle par défaut que caseAccepte()
  // pour les unités : `factionLibre` dispense de la vérification,
  // sinon le type est réservé à `faction` (ou à factionCroisadeParDefaut()
  // si ce champ est absent, voir MODÈLE DE DONNÉES dans
  // organigramme-data.js). `faction` prend le pas sur `factionLibre`
  // quand les deux sont posés ensemble (ex : Tercio de Fer, Serre
  // d'Automates, Maisnie Roturière) : ces Détachements restent MASQUÉS
  // hors de leur propre Faction, `factionLibre` ne servant plus alors
  // qu'à dispenser caseAccepte() de la vérification de Faction UNITÉ
  // PAR UNITÉ sur leurs Cases (Unités Mechanicum/Solar Auxilia admises
  // malgré la Faction Chevaliers Questoris/Solar Auxilia du
  // Détachement) — à la différence des `factionLibre` sans `faction`
  // ci-dessous (Seigneur des Batailles, Détachement Allié, Détachement
  // Narratif, Appui Lourd), volontairement proposés dans TOUTE Faction.
  // EXCEPTION supplémentaire (Paradigmes de Maisonnée Chevaliers
  // Questoris) : un type à `faction: "chevaliers-questoris"` qui porte
  // aussi `requiertMaisonnee` reste visible hors Chevaliers Questoris
  // dès que la Maisonnée d'un Détachement de Seigneur des Batailles de
  // l'Armée correspond (voir maisonneeSeigneurBataillesDebloqueVisibilite
  // ci-dessus) — seul moyen de faire apparaître Serre d'Armigères/
  // d'Automates/Maisnie Roturière pour une Armée d'une autre Faction.
  // Utilisé par construireAjoutDetachements() et suggestionPourRole().
  function typeDisponiblePourFaction(type) {
    // Détachements d'Apex de Mechanicum réservés à un Techno-arcane
    if (type.requiertTechnoArcane && type.requiertTechnoArcane !== etat.technoArcane)
      return false;

    if (type.faction)
      return (
        type.faction === etat.faction ||
        maisonneeSeigneurBataillesDebloqueVisibilite(type)
      );
    // Légions Brisées et Blackshields (voir FACTIONS ci-dessus)
    // réutilisent entièrement les Détachements génériques Legiones
    // Astartes (Poing Blindé, Appui Tactique…) — factionCroisadeParDefaut()
    // retombe sur "legio-astartes" pour ces deux Factions (absentes de
    // sa liste spéciale), donc jamais égal à etat.faction sans ce cas
    // particulier.
    return (
      type.factionLibre ||
      factionCroisadeParDefaut() === etat.faction ||
      etat.faction === "legions-brisees" ||
      etat.faction === "blackshields"
    );
  }

  function trouverDetachement(uid) {
    return etat.detachements.find((d) => d.uid === uid);
  }

  // Noms lisibles d'une liste d'ids d'UNITES (js/unites-data.js),
  // joints par « ou » pour les messages de raison (requiertUniteArmee,
  // deblocage.uniteIds) — id brut affiché tel quel si l'unité est
  // introuvable.
  function nomsUnitesParIds(ids) {
    return ids
      .map((id) => (hooks.trouverUnite(id) || { nom: id }).nom)
      .join(" ou ");
  }

  function avantageParId(id) {
    return AVANTAGES_PRINCIPAUX.find((a) => a.id === id);
  }

  // Nom lisible d'un Paradigme de Maisonnée (id de MAISONNEES), pour
  // les messages de raison de detachementDebloque()/disponibilite() —
  // repli sur l'id brut si introuvable (ne devrait pas arriver).
  function nomMaisonnee(id) {
    const trouve = MAISONNEES.find(([v]) => v === id);
    return trouve ? trouve[1] : id;
  }

  // Instance d'unité (js/unites.js) occupant une case, avec sa fiche.
  function occupant(caseOrga) {
    if (caseOrga.uniteUid === null) return null;
    const instance = hooks.getArmee().find((i) => i.uid === caseOrga.uniteUid);
    if (!instance) return null;
    return { instance, unite: hooks.trouverUnite(instance.uniteId) };
  }

  // Variante choisie d'une instance occupant une Case (repli sur la
  // variante 0 si l'indice sauvegardé est invalide/absent).
  function varianteDe(occ) {
    return occ.unite.variantes[occ.instance.variante] || occ.unite.variantes[0];
  }

  /* Sous-types d'une instance, lus dans la ligne « Type » de la
     variante choisie (ex : "Sergent : Infanterie (Sergent) ·
     Légionnaire : Infanterie"). Sert aux conditions des Avantages
     Principaux : Sergent (Maître-sergent), État-major (Parangon de
     Bataille) et Unique (seul Bénéfice Logistique autorisé, p. 283). */
  function aSousType(occ, sousType) {
    return varianteDe(occ).type.includes(sousType);
  }

  /* Règle « Officier de Ligne (X) » (livre d'armée) : la Case
     d'État-major occupée par cette unité débloque X Détachements
     Auxiliaires au lieu d'un seul. Cherche la Règle Spéciale aussi
     bien dans les `regles` fixes de la variante (ex : Chef de Guerre
     déjà nommé « Officier de Ligne (X) » sur sa fiche) que dans celles
     accordées par l'Avantage Principal de la Case (`reglesAppliquees`,
     ex : Préfet, Legio Custodes — bug corrigé 2026-08-02, signalé par
     le proprio : la valeur n'était lue qu'à l'affichage de la fiche,
     jamais par le calcul des crédits de déblocage). Si les deux
     sources en portent une (cas hypothétique), la plus grande valeur
     de X l'emporte plutôt que de les additionner. */
  function valeurOfficierDeLigne(occ, caseOrga) {
    const avantage = caseOrga && avantageParId(caseOrga.avantage);
    const toutesRegles = (varianteDe(occ).regles || []).concat(
      (avantage && avantage.reglesAppliquees) || [],
    );
    let valeur = 1;
    for (const regle of toutesRegles) {
      const m = /officier de ligne\s*\((\d+)\)/i.exec(regle);
      if (m) valeur = Math.max(valeur, Number(m[1]));
    }
    return valeur;
  }

  /* Règle « Sire des X » (livre d'armée, un Primarque par Légion,
     texte complet dans js/regles-data.js) : tant qu'une Figurine
     ayant cette Règle Spéciale fait partie de l'Armée, si au moins
     quatre Cases de Rôle Tactique Troupes du Détachement Principal
     sont occupées par les Unités indiquées, toutes les Cases Troupes
     de ce Détachement sont considérées comme des Cases Principales.
     `condition` reçoit (comptes, total) : `comptes` associe le `nom`
     d'Unité (js/unites-data.js) au nombre de Cases Troupes occupées
     par ce nom, `total` est le nombre de Cases Troupes occupées, tous
     noms confondus. Sire des White Scars a une Règle Spéciale
     différente (échange de Cases Transport contre des Cases Reco,
     pas de déblocage de Case Principale) : volontairement absent de
     cette table. */
  const REGLES_SIRE_TROUPES = [
    {
      nom: "Sire des Iron Warriors",
      condition: (n) =>
        (n["Escouade Tactique"] || 0) + (n["Escouade Brécheuse"] || 0) >= 4,
    },
    {
      nom: "Sire de la Raven Guard",
      condition: (n) =>
        (n["Escouade Tactique"] || 0) + (n["Escouade d'Assaut"] || 0) >= 4,
    },
    {
      nom: "Sire des Blood Angels",
      condition: (n) => (n["Escouade d'Assaut"] || 0) >= 4,
    },
    {
      nom: "Sire des World Eaters",
      condition: (n) =>
        (n["Escouade d'Assaut"] || 0) + (n["Escouade Nettoyeuse"] || 0) >= 4,
    },
    {
      // Exige en plus qu'au moins une Figurine de chacune des Unités
      // occupant ces Cases ait reçu une Arme Forgée : non modélisé
      // (pas de suivi d'amélioration par Figurine individuelle dans ce
      // moteur, seulement au niveau de l'Unité) — condition réduite
      // aux 4 Cases Troupes occupées, sans vérifier l'amélioration.
      // Gap documenté plutôt qu'inventé.
      nom: "Sire des Salamanders",
      condition: (n, total) => total >= 4,
    },
    {
      nom: "Sire des Imperial Fists",
      condition: (n) =>
        (n["Escouade Tactique"] || 0) + (n["Escouade Brécheuse"] || 0) >= 4,
    },
    {
      nom: "Sire des Ultramarines",
      condition: (n) =>
        (n["Escouade d'Assaut"] || 0) >= 2 &&
        (n["Escouade Tactique"] || 0) >= 2,
    },
    {
      nom: "Sire des Dark Angels",
      condition: (n) =>
        (n["Escouade d'Assaut"] || 0) >= 1 &&
        (n["Escouade Tactique"] || 0) >= 1 &&
        (n["Escouade Brécheuse"] || 0) >= 1,
    },
    {
      nom: "Sire des Space Wolves",
      condition: (n) => (n["Meute de Tueurs Gris"] || 0) >= 4,
    },
    {
      nom: "Sire des Iron Hands",
      condition: (n) =>
        (n["Escouade Tactique"] || 0) + (n["Escouade Brécheuse"] || 0) >= 4,
    },
    {
      nom: "Sire des Night Lords",
      condition: (n) =>
        (n["Escouade Terreur"] || 0) + (n["Escouade d'Assaut"] || 0) >= 4,
    },
    {
      nom: "Sire de l'Alpha Legion",
      condition: (n) =>
        (n["Escouade Tactique"] || 0) + (n["Escouade d'Assaut"] || 0) >= 4,
    },
    {
      nom: "Sire des Word Bearers",
      condition: (n) =>
        (n["Escouade Nettoyeuse"] || 0) + (n["Escouade Tactique"] || 0) >= 4,
    },
    {
      // Condition différente des autres : peu importe le nom de
      // l'Unité, seul compte le fait qu'elle soit « nantie d'un
      // Arcane de Prospero » (choisi via l'option ARCANE_DE_PROSPERO,
      // js/unites-data.js, ou fixe — ex. Escouade Inductii Thousand
      // Sons et son Arcane de Prospero Désaccordée). Comptée dans la
      // clé synthétique "[Arcane de Prospero]" de `comptes`, voir
      // comptesTroupesOccupees ci-dessous.
      nom: "Sire des Thousand Sons",
      condition: (n) => (n["[Arcane de Prospero]"] || 0) >= 4,
    },
    {
      nom: "Sire de la Death Guard",
      condition: (n) => (n["Escouade Tactique"] || 0) >= 4,
    },
    {
      nom: "Sire des Emperor's Children",
      condition: (n) =>
        (n["Escouade Tactique"] || 0) + (n["Escouade d'Assaut"] || 0) >= 4,
    },
    {
      nom: "Sire des Sons of Horus",
      condition: (n) =>
        (n["Escouade Tactique"] || 0) + (n["Escouade Nettoyeuse"] || 0) >= 4,
    },
  ];

  // Traits fixes qui valent Arcane de Prospero (livre d'armée Thousand
  // Sons) : les 5 Arcanes nommés, plus l'Arcane de Prospero Désaccordée
  // des Escouades Inductii Thousand Sons (Trait « Désaccordé »).
  const TRAITS_ARCANE_DE_PROSPERO_FIXE = [
    "Raptora",
    "Pyrae",
    "Pavoni",
    "Corvidae",
    "Athanéen",
    "Désaccordé",
  ];

  // Une Unité est-elle « nantie d'un Arcane de Prospero » (Arcane fixe
  // dans ses Traits, ou choisi via l'option ARCANE_DE_PROSPERO) ?
  function estNantiArcaneDeProspero(occ) {
    if (
      occ.unite.traits &&
      occ.unite.traits.some((t) => TRAITS_ARCANE_DE_PROSPERO_FIXE.includes(t))
    ) {
      return true;
    }
    return Boolean(
      occ.instance.valeurs && occ.instance.valeurs["arcane-prospero"],
    );
  }

  // Cases de Rôle Tactique Troupes occupées du Détachement donné :
  // { comptes: { nom d'Unité -> nombre de Cases }, total }.
  function comptesTroupesOccupees(det) {
    const comptes = {};
    let total = 0;
    for (const c of det.cases) {
      if (c.role !== "Troupes") continue;
      const occ = occupant(c);
      if (!occ) continue;
      total++;
      comptes[occ.unite.nom] = (comptes[occ.unite.nom] || 0) + 1;
      if (estNantiArcaneDeProspero(occ)) {
        comptes["[Arcane de Prospero]"] =
          (comptes["[Arcane de Prospero]"] || 0) + 1;
      }
    }
    return { comptes, total };
  }

  // Une Figurine ayant cette Règle Spéciale (nom exact, sans variante
  // (X)) fait-elle partie de l'Armée, dans n'importe quel Détachement ?
  function armeeAFigurineAvecRegle(nomRegle) {
    for (const d of etat.detachements) {
      for (const c of d.cases) {
        const occ = occupant(c);
        if (occ && (varianteDe(occ).regles || []).includes(nomRegle)) {
          return true;
        }
      }
    }
    return false;
  }

  /* Les Cases Troupes de CE Détachement sont-elles dynamiquement
     promues Cases Principales par une Règle « Sire des X » ? Ne
     s'applique qu'au Détachement Principal lui-même — c'est ce que
     dit chaque texte de règle (les mentions de Détachements Auxiliaires/
     d'Apex/Alliés dans certains préambules ne concernent que l'AUTRE
     effet de ces Règles, hors-sujet ici et non modélisé sur ce site). */
  function troupesPrincipalesParSireDe(det) {
    if (det.typeId !== idDetachementPrincipal()) return false;
    const { comptes, total } = comptesTroupesOccupees(det);
    return REGLES_SIRE_TROUPES.some(
      (regle) =>
        armeeAFigurineAvecRegle(regle.nom) && regle.condition(comptes, total),
    );
  }

  // Statut Case Principale effectif d'une Case : son statut fixe
  // (organigramme-data.js) OU un déblocage dynamique « Sire des X »
  // (Cases Troupes du Détachement Principal uniquement) OU — Paradigme
  // de Maisonnée Mendicus (livre d'armée Chevaliers Questoris) — une
  // Case Seigneurs des Batailles du Détachement de Seigneur des
  // Batailles occupée par une Unité de Sous-type Chevalier : les
  // Unités de la Liste d'Armée de Questoris Familia y reçoivent alors
  // un Avantage Principal de Rang de Maisonnée comme si leur Case
  // était Principale (menu « Maisonnée » de ce Détachement, voir
  // construireSelectMaisonneeSeigneurBatailles).
  function estCasePrincipale(det, caseOrga) {
    if (caseOrga.principale) return true;
    if (caseOrga.role === "Troupes" && troupesPrincipalesParSireDe(det))
      return true;
    if (
      typeDe(det).id === "seigneur-batailles" &&
      caseOrga.role === "Seigneurs des Batailles" &&
      maisonneePertinentePourDetachement(det) === "mendicus"
    ) {
      const occ = occupant(caseOrga);
      if (occ && aSousType(occ, "Chevalier")) return true;
    }
    return false;
  }

  // Un Détachement dont le type porte `requiertAvantage` (Serre
  // d'Armigères/d'Automates, Maisnie Roturière) est débloqué soit par
  // la voie normale (cet Avantage Principal choisi n'importe où dans
  // l'Armée), soit — Paradigme de Maisonnée correspondant
  // (`requiertMaisonnee`, livre d'armée Chevaliers Questoris) — quand
  // le Détachement Principal de Maisonnées de Chevaliers ou un
  // Détachement de Seigneur des Batailles dont la Maisonnée pertinente
  // (maisonneePertinentePourDetachement()) est celle-ci contient au
  // moins une Figurine de Sous-type Chevalier. Consolidée ici pour les
  // 3 emplacements qui vérifiaient jusqu'ici `requiertAvantage` seul
  // (disponibilite, validerArmee, retirerDetachementsAvantageInvalide).
  function detachementDebloque(type) {
    if (!type.requiertAvantage) return true;
    if (
      etat.detachements.some((d) =>
        d.cases.some((c) => c.avantage === type.requiertAvantage),
      )
    )
      return true;
    if (!type.requiertMaisonnee) return false;
    return etat.detachements.some(
      (d) =>
        maisonneePertinentePourDetachement(d) === type.requiertMaisonnee &&
        d.cases.some((c) => {
          const occ = occupant(c);
          return occ && aSousType(occ, "Chevalier");
        }),
    );
  }

  function creerDetachement(typeId) {
    const type = typeParId(typeId);
    // Faction propre à ce Détachement Allié (menu « Faction Alliée » sur
    // sa carte, uniquement affiché pour une Armée Legio Titanicus — voir
    // construireDetachementDOM) : pour une Armée Legio Astartes, toujours
    // "legio-astartes" comme avant l'ajout de ce menu (seule la Légion
    // varie, via `legionAlliee` ci-dessous) ; pour une Armée Legio
    // Titanicus, vide tant qu'elle n'est pas choisie. Sans objet (null)
    // pour tout autre type de détachement.
    const factionAllieeDefaut =
      etat.faction === "legio-titanicus" ? "" : "legio-astartes";
    return {
      uid: ++compteurDet,
      typeId,
      factionAlliee: type.id === "allie" ? factionAllieeDefaut : null,
      // Légion (Faction, p. 283) propre à ce Détachement Allié, choisie
      // sur sa carte — voir construireDetachementDOM et caseAccepte().
      // Sans objet (null) pour tout autre type de détachement : ceux-là
      // suivent la Légion de l'Armée (etat.legion). N'a de sens que si
      // `factionAlliee` vaut "legio-astartes" (Legio Titanicus n'a pas
      // de subdivision en Légions).
      legionAlliee: type.id === "allie" ? "" : null,
      // Maisonnée (Faction, p. 283 : chaque Maisonnée compte comme une
      // Faction distincte, même principe que legionAlliee ci-dessus)
      // propre à ce Détachement Allié — n'a de sens que si
      // `factionAlliee` vaut "chevaliers-questoris". Sans objet (null)
      // sinon.
      maisonneeAlliee: type.id === "allie" ? "" : null,
      // Doctrine de Cohorte (Faction, p. 283, même principe) propre à ce
      // Détachement Allié — n'a de sens que si `factionAlliee` vaut
      // "solar-auxilia". Sans objet (null) sinon.
      doctrineCohorteAlliee: type.id === "allie" ? "" : null,
      // Paradigme de Maisonnée (livre d'armée Chevaliers Questoris)
      // propre à ce Détachement de Seigneur des Batailles, indépendant
      // de la Faction de l'Armée — seul moyen pour une Armée d'une
      // AUTRE Faction que Chevaliers Questoris de faire valoir un
      // Paradigme sur les Chevaliers qu'elle y fait entrer (menu
      // « Maisonnée » de sa carte, construireSelectMaisonneeSeigneurBatailles).
      // Sans objet (null) pour tout autre type de détachement — voir
      // maisonneePertinentePourDetachement().
      maisonneeSeigneurBatailles: type.id === "seigneur-batailles" ? "" : null,
      // Serments du Moment (Blackshields, voir SERMENTS_DU_MOMENT,
      // js/organigramme-data.js) : liste d'ids choisis directement sur
      // CE Détachement — n'a de sens que pour un Détachement Principal
      // (max 2) ou Allié (max 1) d'une Armée de Faction "blackshields".
      serments: [],
      // uid du Détachement Principal/Allié dont ce Détachement hérite
      // les Serments du Moment — n'a de sens que pour un Détachement
      // Auxiliaire/d'Apex (le livre : « must use the same Oaths of
      // Moment as the Detachment to which they are attached »). Choisi
      // explicitement par le joueur (menu sur la carte, voir
      // construireSelectSermentsRattaches) : ce site ne conserve pas de
      // lien formel « quelle Case a débloqué quel Détachement » (voir
      // debloqueursDisponibles ci-dessus), donc pas de déduction
      // automatique possible.
      serimentsRattaches: null,
      // Légion choisie pour le Serment du Moment Panoplie d'Antan (une
      // seule pour tout le Détachement, voir CLAUDE.md) — "" tant que
      // rien n'est choisi. Sans objet si "panoplie-antan" n'est pas
      // dans `serments`.
      legionPanoplie: "",
      // Clone/Aberrant choisi pour le Serment du Moment L'Hélice Brisée
      // (un seul choix pour tout le Détachement, tous les Modèles
      // concernés doivent avoir la même Règle Spéciale sélectionnée) —
      // "" tant que rien n'est choisi.
      choixCloneAberrant: "",
      cases: type.cases.map((c) => ({
        role: c.role,
        principale: Boolean(c.principale),
        uniteUid: null,
        avantage: "aucun",
        extra: false,
      })),
    };
  }

  /* ----------------------------------------------------------
     RÈGLES — compatibilité unité ↔ case
     ---------------------------------------------------------- */

  /* Trait de Faction Mechanicum (Techno-arcane Majeur) déjà établi au
     sein d'un Détachement Auxiliaire/d'Apex par les Unités qui
     l'occupent (Liber Mechanicum p. 13 : « toutes les Unités d'un même
     Détachement Auxiliaire ou d'Apex […] doivent avoir la même
     variante » — à la différence d'un Détachement Principal/Allié/de
     Seigneur des Batailles, où rien n'impose l'uniformité, voir
     caseAccepte ci-dessous). `excluUid` ignore une occupante précise
     (sert à demander « que faudrait-il respecter SANS cette Unité-là »,
     ex : traitFactionMechanicumRequisPour ci-dessous, qui exclut
     l'Unité dont on cherche justement la contrainte). Retourne null si
     aucune autre Unité du Détachement n'a encore de Trait résolu.
     hooks.traitFactionMechanicumDe est fourni par js/unites.js
     (Organigramme.initialiser). */
  function traitFactionMechanicumEtabliDe(det, excluUid, excluBeneficeLogistique = false) {
    if (!hooks.traitFactionMechanicumDe) return null;
    for (const c of det.cases) {
      if (c.uniteUid === null || c.uniteUid === excluUid) continue;
      // Exclure les Cases créées par Bénéfice Logistique si demandé
      // (Liber Mechanicum p. 13 : l'Unité sélectionnée via Bénéfice Logistique
      // peut avoir un Techno-arcane différent du reste du Détachement).
      if (excluBeneficeLogistique && c.extra &&
          (c.origineAvantage || "benefice-logistique") === "benefice-logistique") {
        continue;
      }
      const occ = occupant(c);
      if (!occ) continue;
      const trait = hooks.traitFactionMechanicumDe(occ.unite, occ.instance);
      if (trait) return trait;
    }
    return null;
  }

  /* Même mécanique que traitFactionMechanicumEtabliDe ci-dessus, pour
     le Trait de Faction [Skitarii] (Conclaves Skitarii, Acquisitor/
     Expurgator/Vindicator/Flagellator). Différence avec Mechanicum :
     l'uniformité y est exigée dans TOUT Détachement (« Toutes les
     Unités sélectionnées dans un Détachement donné doivent avoir le
     même Trait de Faction »), pas seulement les Auxiliaires/d'Apex —
     voir le bloc caseAccepte ci-dessous, qui n'y restreint donc pas la
     vérification par `type.famille`. hooks.traitFactionSkitariiDe est
     fourni par js/unites.js (Organigramme.initialiser).
     Ne considère qu'une Unité à Trait FIXE (nom en dur dans `traits`,
     PAS « [Skitarii] ») comme « établissant » le Trait du Détachement —
     une Unité générique ne compte jamais ici, exactement comme le bloc
     caseAccepte plus bas ne bloque que sur un Trait fixe différent.
     Sans ce filtre, deux Unités génériques placées ensemble (le cas le
     plus courant ici : aucune Unité Skitarii de ce fichier n'a de Trait
     fixe) s'« établiraient » mutuellement l'une l'autre à chaque
     rafraîchissement — dès qu'on choisit un Trait différent pour l'une
     d'elles, sa propre resynchronisation la retrouve « en conflit »
     avec l'autre (encore à son choix par défaut) et l'annule aussitôt,
     ce qui rend le menu déroulant inutilisable dès que 2 Unités
     génériques partagent un Détachement — voir le test réalisé lors de
     l'ajout de cette Faction. */
  function traitFactionSkitariiEtabliDe(det, excluUid) {
    if (!hooks.traitFactionSkitariiDe) return null;
    for (const c of det.cases) {
      if (c.uniteUid === null || c.uniteUid === excluUid) continue;
      const occ = occupant(c);
      if (!occ) continue;
      if (!occ.unite.traits || occ.unite.traits.includes("[Skitarii]"))
        continue;
      const trait = hooks.traitFactionSkitariiDe(occ.unite, occ.instance);
      if (trait) return trait;
    }
    return null;
  }

  /* Une unité peut-elle occuper cette case ?
     1. Rôle Tactique identique (p. 282 : « Le Rôle Tactique de
        l'Unité doit correspondre à celui de la Case ») ;
     2. OU Avantage « Affectation Spéciale » (p. 283) : une unité de
        Quartier Général peut occuper une Case PRINCIPALE
        d'État-major ;
     3. restrictions d'unités des Détachements Auxiliaires
        spécifiques (ex : Cases Reco de la Demi-compagnie Reco =
        Escouades de Reconnaissance uniquement). */
  function caseAccepte(det, caseOrga, unite) {
    const type = typeDe(det);
    // Faction (champ `faction`, js/unites-data.js — Legio Astartes vs
    // Legio Titanicus etc., à ne pas confondre avec la Légion Astartes
    // ci-dessous) : une unité n'occupe une Case que dans un détachement
    // de SA Faction — celle de l'Armée (etat.faction) pour tout
    // détachement non `factionLibre`. Exceptions (livre d'armée Legio
    // Titanicus) :
    // - Détachement Allié : sa propre Faction (menu « Faction Alliée »
    //   de sa carte, "legio-astartes" par défaut pour une Armée Legio
    //   Astartes — seule la Légion varie alors, comme avant l'ajout de
    //   ce menu — et vide tant qu'elle n'est pas choisie pour une Armée
    //   Legio Titanicus).
    // - Détachement de Seigneur des Batailles : accepte toute Faction,
    //   SAUF qu'il ne peut inclure aucune unité Legio Titanicus tant que
    //   le Détachement Principal de l'Armée est l'Ordinal Titanique
    //   (règle 1 de l'Ordinal Titanique — sinon, un Titan isolé DANS ce
    //   détachement est justement la façon d'en aligner un sans lui).
    const factionUnite = unite.faction || "legio-astartes";
    // Case ajoutée par un Avantage Principal à Faction imposée (ex :
    // Agent de Clade, Divisio Assassinorum, voir `factionCaseAjoutee`
    // dans js/organigramme-data.js) : la Faction requise est celle
    // fixée par l'Avantage lui-même, pas celle du Détachement qui
    // porte la Case ajoutée — cette Faction n'est d'ailleurs jamais
    // sélectionnable comme Faction d'Armée ou de Détachement Allié.
    if (caseOrga.extra && caseOrga.origineAvantage) {
      const avantageOrigine = avantageParId(caseOrga.origineAvantage);
      if (avantageOrigine && avantageOrigine.factionCaseAjoutee) {
        return factionUnite === avantageOrigine.factionCaseAjoutee;
      }
    }
    if (type.id === "allie") {
      if (factionUnite !== (det.factionAlliee || "legio-astartes"))
        return false;
    } else if (type.factionLibre) {
      if (
        type.id === "seigneur-batailles" &&
        factionUnite === "legio-titanicus" &&
        etat.faction === "legio-titanicus"
      ) {
        return false;
      }
    } else if (factionUnite !== (type.faction || factionCroisadeParDefaut())) {
      return false;
    }
    // Légion (p. 283) : une unité réservée à une Légion (champ
    // `legion`, js/unites-data.js) ne peut occuper une Case que dans un
    // détachement de SA Légion — celle de l'Armée (Principal, Seigneur
    // de Guerre/des Batailles, Auxiliaires, Apex), ou celle propre au
    // Détachement Allié qui l'accueille (menu « Légion Alliée » de sa
    // carte, vide tant qu'elle n'est pas choisie).
    if (unite.legion && !type.legionLibre) {
      // Légions Brisées (voir plus haut, FACTIONS) : pas de Légion
      // unique (etat.legion reste vide pour cette Faction), mais un
      // ensemble de 2 ou 3 Légions choisies pour toute l'Armée — une
      // Unité réservée à une Légion est acceptée dès que celle-ci en
      // fait partie, sur tout Détachement non Allié.
      if (
        etat.faction === "legions-brisees" &&
        type.id !== "allie" &&
        etat.legionsBrisees.includes(unite.legion)
      ) {
        // légion acceptée, on continue les autres vérifications
      } else {
        const legionRequise =
          type.id === "allie" ? det.legionAlliee : etat.legion;
        if (unite.legion !== legionRequise) return false;
      }
    }
    // Escouade Inductii (Legacies, Legiones Inductii, p. 1) : Troupe
    // générique par Légion mais volontairement moins expérimentée que
    // les Légionnaires de ligne — ne peut jamais occuper de Case
    // Principale, quelle qu'en soit la Légion (champ `interditCase-
    // Principale`, js/unites-data.js).
    if (unite.interditCasePrincipale && estCasePrincipale(det, caseOrga))
      return false;
    // Serments du Moment (Blackshields) qui restructurent l'Organigramme
    // d'un Détachement (voir SERMENTS_DU_MOMENT, js/organigramme-data.js) :
    // vérifiés avant le test normal `unite.categorie === caseOrga.role`
    // ci-dessous, qui reste inchangé pour tout Détachement sans Serment
    // actif de ce type.
    {
      const sermentsActifs = sermentsActifsDe(det);
      if (sermentsActifs.length > 0) {
        // Dans la Disgrâce, Tous sont Égaux : aucun Choix d'État-major
        // ni de Quartier Général — Cases entièrement bloquées, quelle
        // que soit l'Unité.
        if (
          sermentsActifs.some(
            (id) => sermentParId(id) && sermentParId(id).interditQGEtatMajor,
          ) &&
          (caseOrga.role === "État-major" ||
            caseOrga.role === "Quartier Général")
        ) {
          return false;
        }
        // La Fierté est Notre Armure/Faucheurs analogues : plus aucun
        // Choix de Troupes dans ce Détachement (ni un Auxiliaire/Apex
        // qui lui est rattaché) — les Cases Troupes existantes sont
        // reconverties (convertitRoleCase ci-dessous), donc une Unité
        // de Rôle Troupes n'y a plus sa place nulle part.
        if (
          sermentsActifs.some(
            (id) => sermentParId(id) && sermentParId(id).interditTroupes,
          ) &&
          unite.categorie === "Troupes"
        ) {
          return false;
        }
        // Seuls et Oubliés : plus aucune Case d'un autre Rôle Tactique
        // que celui listé n'est occupable dans ce Détachement (même les
        // Cases jamais reconverties, ex : Quartier Général, Transports).
        for (const id of sermentsActifs) {
          const serment = sermentParId(id);
          if (
            serment &&
            serment.restreintRoleUnique &&
            !caseOrga.extra &&
            !caseOrga.libre &&
            caseOrga.role !== serment.restreintRoleUnique &&
            !(
              serment.convertitRoleCase &&
              serment.convertitRoleCase.de === caseOrga.role &&
              serment.convertitRoleCase.vers === serment.restreintRoleUnique
            )
          ) {
            return false;
          }
        }
        // Rôle effectif d'une Case ordinaire (non extra/libre) reconverti
        // par un Serment (ex : Troupes → Élite, Troupes → État-major
        // réservé aux Centurions) : la Case garde son `role` de base en
        // mémoire (résumé/comptages inchangés, même simplification déjà
        // en place pour « Sire des White Scars » ci-dessus), seule
        // l'acceptation d'Unité en tient compte ici.
        for (const id of sermentsActifs) {
          const serment = sermentParId(id);
          const conv = serment && serment.convertitRoleCase;
          if (
            !conv ||
            conv.de !== caseOrga.role ||
            caseOrga.extra ||
            caseOrga.libre
          )
            continue;
          if (
            conv.restreintUniteIds &&
            !conv.restreintUniteIds.includes(unite.id)
          )
            return false;
          if (unite.categorie === conv.vers) return true;
        }
      }
    }
    // Trait de Faction Mechanicum (Techno-arcane Majeur, Liber
    // Mechanicum p. 13) : uniformité exigée au sein d'un même
    // Détachement Auxiliaire/d'Apex (voir traitFactionMechanicumEtabliDe
    // ci-dessus). Exception : une Unité sélectionnée via Bénéfice
    // Logistique peut avoir un Techno-arcane différent (p. 13). Ne bloque
    // qu'une Unité déjà rattachée à un Techno-arcane FIXE différent (nom
    // en dur dans `traits`, ex. "Cybernetica") ; une Unité générique
    // (« [Mechanicum] » dans `traits`, Techno-arcane choisi par Unité via
    // l'option "techno-arcane") reste toujours acceptée ici — elle
    // s'aligne automatiquement sur le Trait déjà établi, voir
    // traitFactionMechanicumRequisPour et son utilisation dans
    // synchroniserConfig (js/unites.js).
    if (
      (type.famille === "auxiliaire" || type.famille === "apex") &&
      unite.faction === "mechanicum" &&
      unite.traits &&
      !unite.traits.includes("[Mechanicum]")
    ) {
      const traitFixe = unite.traits.find((t) =>
        TRAITS_FACTION_MECHANICUM.includes(t),
      );
      // Si la Case courante est créée par Bénéfice Logistique, pas de restriction
      const estBeneficeLogistique = caseOrga.extra &&
        (caseOrga.origineAvantage || "benefice-logistique") === "benefice-logistique";
      if (!estBeneficeLogistique) {
        // Exclure les Cases Bénéfice Logistique du calcul du Trait établi
        const traitEtabli = traitFixe && traitFactionMechanicumEtabliDe(det, null, true);
        if (traitEtabli && traitFixe !== traitEtabli) return false;
      }
    }
    // Trait de Faction [Skitarii] (Conclaves Skitarii) : « Toutes les
    // Unités sélectionnées dans un Détachement donné doivent avoir le
    // même Trait de Faction » — à la différence du Techno-arcane
    // Mechanicum ci-dessus, cette uniformité s'applique à TOUT
    // Détachement (pas seulement Auxiliaire/d'Apex), d'où l'absence de
    // filtre sur `type.famille` ici. Même logique de blocage/alignement
    // qu'au-dessus sinon : ne bloque qu'une Unité à Trait FIXE différent,
    // une Unité générique (« [Skitarii] » dans `traits`) s'aligne
    // automatiquement (voir traitFactionSkitariiRequisPour plus bas).
    if (
      unite.faction === "skitarii" &&
      unite.traits &&
      !unite.traits.includes("[Skitarii]")
    ) {
      const traitFixeSkitarii = unite.traits.find((t) =>
        TRAITS_FACTION_SKITARII.includes(t),
      );
      const traitEtabliSkitarii =
        traitFixeSkitarii && traitFactionSkitariiEtabliDe(det);
      if (traitEtabliSkitarii && traitFixeSkitarii !== traitEtabliSkitarii)
        return false;
    }
    const restriction = type.restrictions && type.restrictions[caseOrga.role];
    if (restriction && !restriction.includes(unite.id)) return false;
    if (unite.categorie === caseOrga.role) return true;
    // Affectation Spéciale : QG sur Case Principale d'État-major.
    if (
      unite.categorie === "Quartier Général" &&
      caseOrga.role === "État-major" &&
      caseOrga.principale
    ) {
      return true;
    }
    // Règle « Sire des White Scars » (livre d'armée, texte complet dans
    // js/regles-data.js) : tant qu'une Figurine ayant cette Règle
    // Spéciale fait partie de l'Armée, si au moins quatre Cases Troupes
    // du Détachement Principal sont occupées (n'importe quelles
    // Unités), ses Cases Transports peuvent être échangées contre des
    // Cases Reco occupées par des Unités de Land Raider Explorator —
    // modélisé ici en autorisant directement une Unité de Land Raider
    // Explorator à occuper une Case Transports de ce Détachement sous
    // cette condition, plutôt qu'en transformant réellement le Rôle
    // Tactique de la Case (rendu/décompte de coûts inchangés sinon).
    if (
      caseOrga.role === "Transports" &&
      unite.nom === "Land Raider Explorator" &&
      det.typeId === idDetachementPrincipal() &&
      armeeAFigurineAvecRegle("Sire des White Scars") &&
      comptesTroupesOccupees(det).total >= 4
    ) {
      return true;
    }
    return false;
  }

  // Libellé lisible d'une case (menus déroulants, messages, résumé).
  function libelleCase(det, indice) {
    const caseOrga = det.cases[indice];
    const role = ROLES_TACTIQUES[caseOrga.role];
    return (
      typeDe(det).nom +
      " — Case " +
      (role ? role.livre : caseOrga.role) +
      (estCasePrincipale(det, caseOrga) ? " ★" : "") +
      " n°" +
      (indice + 1)
    );
  }

  /* Toutes les cases LIBRES pouvant accueillir cette unité, dans
     tous les détachements de l'armée. Utilisé par js/unites.js au
     moment d'ajouter une unité et pour le sélecteur « Case » de
     chaque carte. */
  function casesLibresPour(unite) {
    const resultat = [];
    for (const det of etat.detachements) {
      det.cases.forEach((caseOrga, indice) => {
        if (caseOrga.uniteUid !== null) return;
        if ((caseOrga.extra || caseOrga.libre) && !caseOrga.role) return; // rôle pas encore choisi
        if (!caseAccepte(det, caseOrga, unite)) return;
        // Une unité de Quartier Général visant une Case Principale
        // d'État-major n'y est légale que via l'Avantage Principal
        // « Affectation Spéciale » (voir assigner et caseAccepte) : on
        // l'indique dans le libellé du sélecteur « Case » pour que ce
        // placement — et son effet (pas de détachement débloqué) —
        // soit visible avant même de le choisir.
        const viaAffectationSpeciale =
          unite.categorie === "Quartier Général" &&
          caseOrga.role === "État-major";
        resultat.push({
          detUid: det.uid,
          indice,
          libelle:
            libelleCase(det, indice) +
            (viaAffectationSpeciale
              ? " — via Affectation Spéciale (aucun détachement débloqué)"
              : ""),
        });
      });
    }
    return resultat;
  }

  /* Avantage Principal appliqué à cette instance (id d'AVANTAGES_
     PRINCIPAUX, "aucun" si aucun ou si l'unité n'occupe pas de Case
     Principale). Consommé par js/unites.js pour appliquer les bonus
     concrets de Maître-sergent, Vétérans de Combat et Parangon de
     Bataille sur la fiche récap. */
  function avantageDe(uniteUid) {
    for (const det of etat.detachements) {
      for (const caseOrga of det.cases) {
        if (
          caseOrga.uniteUid === uniteUid &&
          estCasePrincipale(det, caseOrga)
        ) {
          return caseOrga.avantage;
        }
      }
    }
    return "aucun";
  }

  // Où est placée cette instance ? (null = hors organigramme)
  function assignationDe(uniteUid) {
    for (const det of etat.detachements) {
      const indice = det.cases.findIndex((c) => c.uniteUid === uniteUid);
      if (indice !== -1)
        return { detUid: det.uid, indice, libelle: libelleCase(det, indice) };
    }
    return null;
  }

  /* Trait accordé par le Détachement Auxiliaire occupé par cette
     instance (ex : Tercio Véletaris → Trait « Tercio Véletaris » pour
     toutes les Figurines des Unités placées dans ce Détachement, Liber
     Auxilia p.18-19), null si le Détachement occupé n'en accorde aucun
     ou si l'unité n'occupe aucune Case. Consommé par js/unites.js pour
     compléter la ligne « Traits » de la fiche récap. */
  function traitDetachementDe(uniteUid) {
    for (const det of etat.detachements) {
      if (!det.cases.some((c) => c.uniteUid === uniteUid)) continue;
      const type = typeDe(det);
      return (type && type.traitAccorde) || null;
    }
    return null;
  }

  function sermentParId(id) {
    return SERMENTS_DU_MOMENT.find((s) => s.id === id) || null;
  }

  // Détachement qui occupe cette instance (uid d'unité), null si aucun.
  function detachementDe(uniteUid) {
    return (
      etat.detachements.find((det) =>
        det.cases.some((c) => c.uniteUid === uniteUid),
      ) || null
    );
  }

  /* Serments du Moment (Blackshields, voir SERMENTS_DU_MOMENT,
     js/organigramme-data.js) actifs sur un DÉTACHEMENT : ceux choisis
     directement dessus s'il est Principal/Allié, ou ceux du Détachement
     auquel il est rattaché (`serimentsRattaches`) s'il est Auxiliaire/
     d'Apex/autre. Toujours [] hors Faction Blackshields. Consommée par
     caseAccepte()/avantagesPossibles() (placement/Avantage Principal)
     et par sermentsDe() ci-dessous (fiche récap, js/unites.js). */
  function sermentsActifsDe(det) {
    if (etat.faction !== "blackshields") return [];
    const type = typeDe(det);
    if (type.famille === "principal" || type.id === "allie") {
      return det.serments || [];
    }
    const parent = etat.detachements.find(
      (d) => d.uid === det.serimentsRattaches,
    );
    return (parent && parent.serments) || [];
  }

  // Serments du Moment actifs pour une INSTANCE d'unité (remonte à son
  // Détachement, voir sermentsActifsDe ci-dessus). Consommé par
  // js/unites.js pour appliquer les Règles Spéciales/Traits accordés et
  // les transformations de Règles Spéciales (Ligne (X)/Avant-garde (X)
  // → Piller les Morts/Héroïsme Funeste, etc.).
  function sermentsDe(uniteUid) {
    const det = detachementDe(uniteUid);
    return det ? sermentsActifsDe(det) : [];
  }

  // Légion choisie pour le Serment du Moment Panoplie d'Antan sur le
  // Détachement (ou le Détachement rattaché, pour un Auxiliaire/Apex)
  // qui occupe cette instance — "" si le Serment n'est pas actif ou
  // qu'aucune Légion n'est encore choisie. Consommé par
  // legionRequiseSatisfaite (js/unites.js).
  function legionPanoplieDe(uniteUid) {
    const det = detachementDe(uniteUid);
    if (!det) return "";
    if (!sermentsActifsDe(det).includes("panoplie-antan")) return "";
    const type = typeDe(det);
    if (type.famille === "principal" || type.id === "allie") {
      return det.legionPanoplie || "";
    }
    const parent = etat.detachements.find(
      (d) => d.uid === det.serimentsRattaches,
    );
    return (parent && parent.legionPanoplie) || "";
  }

  // "clone" | "aberrant" | "" — choix fait pour le Serment du Moment
  // L'Hélice Brisée sur le Détachement (ou le Détachement rattaché) qui
  // occupe cette instance. Consommé par bonusSermentDuMoment (js/unites.js).
  function choixCloneAberrantDe(uniteUid) {
    const det = detachementDe(uniteUid);
    if (!det) return "";
    if (!sermentsActifsDe(det).includes("helice-brisee")) return "";
    const type = typeDe(det);
    if (type.famille === "principal" || type.id === "allie") {
      return det.choixCloneAberrant || "";
    }
    const parent = etat.detachements.find(
      (d) => d.uid === det.serimentsRattaches,
    );
    return (parent && parent.choixCloneAberrant) || "";
  }

  // Un Serment du Moment est-il compatible avec ceux déjà choisis sur ce
  // Détachement (hors lui-même) ? Vérifie la liste réciproque
  // `excluAvec` des deux côtés (une seule entrée suffit à documenter
  // l'incompatibilité, mais les deux la portent dans SERMENTS_DU_MOMENT
  // par clarté).
  function sermentCompatible(det, id) {
    const serment = sermentParId(id);
    if (!serment) return false;
    const autres = (det.serments || []).filter((autreId) => autreId !== id);
    return !autres.some((autreId) => {
      const autre = sermentParId(autreId);
      return (
        (serment.excluAvec && serment.excluAvec.includes(autreId)) ||
        (autre && autre.excluAvec && autre.excluAvec.includes(id))
      );
    });
  }

  // Nombre maximal de Serments du Moment sélectionnables pour ce type de
  // Détachement (p. 3 : 2 pour un Détachement Principal, 1 pour un
  // Détachement Allié, 0 — pas de sélection propre — pour tout autre
  // type, qui hérite via `serimentsRattaches` à la place).
  function maxSermentsPour(type) {
    if (type.famille === "principal") return 2;
    if (type.id === "allie") return 1;
    return 0;
  }

  /* Trait de Faction Mechanicum déjà imposé à cette instance par les
     AUTRES Unités de son Détachement Auxiliaire/d'Apex (voir
     traitFactionMechanicumEtabliDe/caseAccepte ci-dessus), null si
     l'Unité n'occupe aucune Case, si son Détachement n'est pas
     Auxiliaire/d'Apex, ou si aucune autre Unité du Détachement n'a
     encore de Trait résolu. Exception : une Unité sur une Case créée
     par Bénéfice Logistique n'impose aucune contrainte (Liber Mechanicum
     p. 13). Consommé par js/unites.js (synchroniserConfig) pour aligner
     et griser le choix de Techno-arcane Majeur d'une Unité générique une
     fois placée aux côtés d'une autre déjà rattachée à un Trait. */
  function traitFactionMechanicumRequisPour(uniteUid) {
    for (const det of etat.detachements) {
      const caseOrga = det.cases.find((c) => c.uniteUid === uniteUid);
      if (!caseOrga) continue;
      const type = typeDe(det);
      if (type.famille !== "auxiliaire" && type.famille !== "apex") return null;
      // Exclure les Cases Bénéfice Logistique du trait imposé
      return traitFactionMechanicumEtabliDe(det, uniteUid, true);
    }
    return null;
  }

  /* Même mécanique que traitFactionMechanicumRequisPour ci-dessus, pour
     le Trait de Faction [Skitarii]. Pas de filtre `type.famille` : la
     règle des Conclaves Skitarii impose l'uniformité dans TOUT
     Détachement (voir traitFactionSkitariiEtabliDe/caseAccepte
     ci-dessus). Consommé par js/unites.js (synchroniserConfig) pour
     aligner et griser le choix de Trait de Faction d'une Unité
     générique une fois placée aux côtés d'une Unité à Trait FIXE (voir
     le filtre dans traitFactionSkitariiEtabliDe ci-dessus — deux
     Unités génériques ne se contraignent jamais l'une l'autre ici). */
  function traitFactionSkitariiRequisPour(uniteUid) {
    for (const det of etat.detachements) {
      const caseOrga = det.cases.find((c) => c.uniteUid === uniteUid);
      if (!caseOrga) continue;
      return traitFactionSkitariiEtabliDe(det, uniteUid);
    }
    return null;
  }

  /* Place une unité dans une case (en la retirant de son ancienne
     case s'il y en a une). Si la case est une Case Principale
     d'État-major et que l'unité est de Quartier Général, l'avantage
     « Affectation Spéciale » est imposé (c'est lui qui rend ce
     placement légal, p. 283). Retourne true si le placement a eu lieu. */
  function assigner(uniteUid, detUid, indice) {
    const det = trouverDetachement(detUid);
    if (!det) return false;
    const caseOrga = det.cases[indice];
    const instance = hooks.getArmee().find((i) => i.uid === uniteUid);
    if (!caseOrga || !instance) return false;
    const unite = hooks.trouverUnite(instance.uniteId);
    if (caseOrga.uniteUid !== null || !caseAccepte(det, caseOrga, unite))
      return false;

    liberer(uniteUid);
    caseOrga.uniteUid = uniteUid;
    if (
      unite.categorie === "Quartier Général" &&
      caseOrga.role === "État-major"
    ) {
      caseOrga.avantage = "affectation-speciale";
    }
    actualiser();
    return true;
  }

  // Libère la case occupée par cette instance (retrait / déplacement).
  // Si la case libérée portait l'avantage « Bénéfice Logistique », la
  // case supplémentaire qu'il avait ajoutée n'a plus lieu d'être : on la
  // retire (en repoussant d'abord l'éventuelle unité qui l'occupait,
  // comme pour la suppression d'un détachement entier).
  function liberer(uniteUid) {
    for (const det of etat.detachements) {
      for (const caseOrga of det.cases) {
        if (caseOrga.uniteUid === uniteUid) {
          const avaitLogistique = caseOrga.avantage === "benefice-logistique";
          caseOrga.uniteUid = null;
          caseOrga.avantage = "aucun";
          if (avaitLogistique) {
            const extraIdx = det.cases.findIndex((c) => c.extra);
            if (extraIdx !== -1) {
              const extra = det.cases[extraIdx];
              if (extra.uniteUid !== null)
                hooks.retirerInstance(extra.uniteUid);
              det.cases.splice(extraIdx, 1);
            }
          }
        }
      }
    }
  }

  /* ----------------------------------------------------------
     RÈGLES — crédits de déblocage (p. 283-284)
     Chaque Case d'État-major remplie      → 1 Détachement Auxiliaire
       (X avec « Officier de Ligne (X) », 0 avec Affectation Spéciale).
     Chaque Case de Quartier Général remplie → 1 Auxiliaire OU 1 Apex
       (jamais les deux pour une même case).
     Les détachements auxiliaires débloqués par une unité PRÉCISE en
     Case d'État-major consomment le crédit « à la place des options
     disponibles » ; ceux débloqués par une Case d'Appui (Cénacle,
     Apothecarion) s'ajoutent sans consommer de crédit.
     ---------------------------------------------------------- */
  function calculerCredits() {
    let creditsEM = 0;
    let qgRemplis = 0;
    for (const det of etat.detachements) {
      if (typeDe(det).pasDeCredit) continue;
      for (const caseOrga of det.cases) {
        const occ = occupant(caseOrga);
        if (!occ) continue;
        if (caseOrga.role === "Quartier Général") qgRemplis += 1;
        if (
          caseOrga.role === "État-major" &&
          caseOrga.avantage !== "affectation-speciale"
        ) {
          // Une unité QG placée via Affectation Spéciale ne compte pas.
          creditsEM +=
            occ.unite.categorie === "État-major"
              ? valeurOfficierDeLigne(occ, caseOrga)
              : 0;
        }
      }
    }
    const nbApex = etat.detachements.filter(
      (d) => typeDe(d).famille === "apex",
    ).length;
    // Auxiliaires consommant un crédit : standard + débloqués via État-major.
    const nbAuxComptables = etat.detachements.filter((d) => {
      const type = typeDe(d);
      return (
        type.famille === "auxiliaire" &&
        !(type.deblocage && type.deblocage.caseRole === "Appui")
      );
    }).length;
    return {
      creditsEM,
      qgRemplis,
      nbApex,
      nbAuxComptables,
      // QG non consommés par un Apex, réutilisables pour un Auxiliaire.
      apexRestants: qgRemplis - nbApex,
      auxRestants:
        creditsEM + Math.max(0, qgRemplis - nbApex) - nbAuxComptables,
    };
  }

  /* Unités « débloqueuses » disponibles pour un détachement
     spécifique (ex : Vigilator en Case d'État-major pour la
     Demi-compagnie Reco). Chaque unité ne débloque qu'UN détachement.
     Si deblocage.uniteIds est absent/vide, compte simplement les Cases
     du rôle occupées. */
  function debloqueursDisponibles(type) {
    if (!type.deblocage) return Infinity;
    if (
      type.deblocage.allegeance &&
      etat.allegeance !== type.deblocage.allegeance
    )
      return 0;
    let presentes = 0;
    const rolesAcceptes = Array.isArray(type.deblocage.caseRole)
      ? type.deblocage.caseRole
      : [type.deblocage.caseRole];
    for (const det of etat.detachements) {
      for (const caseOrga of det.cases) {
        if (!rolesAcceptes.includes(caseOrga.role)) continue;
        const occ = occupant(caseOrga);
        // Si uniteIds est absent/vide, débloque simplement si Case occupée
        if (!type.deblocage.uniteIds || type.deblocage.uniteIds.length === 0) {
          if (occ) presentes += 1;
        } else if (occ && type.deblocage.uniteIds.includes(occ.unite.id)) {
          presentes += 1;
        }
      }
    }
    const dejaPris = etat.detachements.filter(
      (d) => d.typeId === type.id,
    ).length;
    return presentes - dejaPris;
  }

  /* Un type de détachement est-il sélectionnable maintenant ?
     Retourne { possible, raison } — la raison alimente le message
     du bouton grisé (exigence UX : expliquer pourquoi). `credits`
     (calculerCredits()) est calculé une seule fois par le passage de
     rendu appelant (construireAjoutDetachements, qui l'évalue pour
     chaque type de la famille courante) plutôt que recalculé ici à
     chaque appel — recalculé par défaut si omis. */
  function disponibilite(type, credits = calculerCredits()) {
    if (type.famille === "principal")
      return {
        possible: false,
        raison: "Déjà présent (unique et obligatoire).",
      };
    if (type.indisponible)
      return { possible: false, raison: type.indisponible };
    const dejaPris = etat.detachements.filter(
      (d) => d.typeId === type.id,
    ).length;
    if (type.max && dejaPris >= type.max) {
      return {
        possible: false,
        raison: "Maximum atteint : " + type.max + " par armée (p. 283).",
      };
    }
    if (
      type.excluAvec &&
      type.excluAvec.some((id) =>
        etat.detachements.some((d) => d.typeId === id),
      )
    ) {
      const noms = type.excluAvec
        .map((id) => {
          const autre = typeParId(id);
          return autre ? autre.nom : id;
        })
        .join(" ou ");
      return {
        possible: false,
        raison: "Incompatible avec « " + noms + " » déjà présent dans l'Armée.",
      };
    }
    if (
      type.requiertRiteDeGuerre &&
      etat.riteDeGuerre !== type.requiertRiteDeGuerre
    ) {
      const rites = RITES_DE_GUERRE[type.legion] || [];
      const rite = rites.find((r) => r.id === type.requiertRiteDeGuerre);
      return {
        possible: false,
        raison:
          "Réservé au Rite de Guerre « " +
          (rite ? rite.nom : type.requiertRiteDeGuerre) +
          " » (menu « Rite de Guerre » des paramètres de la partie).",
      };
    }
    if (
      type.requiertDoctrineCohorte &&
      etat.doctrineCohorte !== type.requiertDoctrineCohorte
    ) {
      const doctrine = DOCTRINES_DE_COHORTE.find(
        ([v]) => v === type.requiertDoctrineCohorte,
      );
      return {
        possible: false,
        raison:
          "Réservé à la Doctrine de Cohorte « " +
          (doctrine ? doctrine[1] : type.requiertDoctrineCohorte) +
          " » (menu « Doctrine de Cohorte » des paramètres de la partie).",
      };
    }
    if (type.pointsMin && etat.limite < type.pointsMin) {
      return {
        possible: false,
        raison:
          "Réservé aux parties d'au moins " + type.pointsMin + " pts (p. 283).",
      };
    }
    if (
      type.requiertUniteArmee &&
      !hooks
        .getArmee()
        .some((inst) => type.requiertUniteArmee.includes(inst.uniteId))
    ) {
      const noms = nomsUnitesParIds(type.requiertUniteArmee);
      return {
        possible: false,
        raison:
          "Nécessite une Unité de " +
          noms +
          " dans l'Armée (n'importe quelle Case).",
      };
    }
    if (
      type.requiertAllegeance &&
      etat.allegeance !== type.requiertAllegeance
    ) {
      return {
        possible: false,
        raison:
          "Réservé aux Armées d'Allégeance " +
          (type.requiertAllegeance === "renegat" ? "Renégate" : "Loyaliste") +
          ".",
      };
    }
    if (!detachementDebloque(type)) {
      const avantage = avantageParId(type.requiertAvantage);
      const nomAvantage = avantage ? avantage.nom : type.requiertAvantage;
      return {
        possible: false,
        raison: type.requiertMaisonnee
          ? "Nécessite l'Avantage Principal « " +
            nomAvantage +
            " » choisi sur au moins une Case de l'Armée, OU une Armée avec le Paradigme de Maisonnée " +
            nomMaisonnee(type.requiertMaisonnee) +
            " comptant une Figurine de Sous-type Chevalier dans son Détachement Principal de Maisonnées de Chevaliers ou un Détachement de Seigneur des Batailles."
          : "Nécessite l'Avantage Principal « " +
            nomAvantage +
            " » choisi sur au moins une Case de l'Armée.",
      };
    }
    if (type.famille === "apex" && credits.apexRestants <= 0) {
      return {
        possible: false,
        raison:
          "Aucune Case de Quartier Général remplie disponible : chaque Case QG remplie débloque 1 Détachement d'Apex OU 1 Auxiliaire (jamais les deux, p. 283).",
      };
    }
    if (type.famille === "auxiliaire") {
      const consommeCredit = !(
        type.deblocage && type.deblocage.caseRole === "Appui"
      );
      if (consommeCredit && credits.auxRestants <= 0) {
        return {
          possible: false,
          raison:
            "Aucun crédit de Détachement Auxiliaire : remplissez une Case d'État-major (ou une Case QG non utilisée pour un Apex) dans le Détachement Principal (p. 283).",
        };
      }
      if (type.deblocage && type.deblocage.uniteIds && debloqueursDisponibles(type) <= 0) {
        const noms = nomsUnitesParIds(type.deblocage.uniteIds);
        return {
          possible: false,
          raison:
            "Débloqué par une unité « " +
            noms +
            " » occupant une Case " +
            type.deblocage.caseRole +
            (type.deblocage.allegeance ? " (Allégeance Renégate)" : "") +
            " — chaque unité ne débloque qu'un seul détachement de ce type.",
        };
      }
    }
    return { possible: true, raison: "" };
  }

  /* ----------------------------------------------------------
     RÈGLES — coûts et quotas (p. 283)
     ---------------------------------------------------------- */
  function coutInstanceParUid(uid) {
    const instance = hooks.getArmee().find((i) => i.uid === uid);
    if (!instance) return 0;
    return hooks.coutInstance(hooks.trouverUnite(instance.uniteId), instance);
  }

  // Une Unité placée dans un Détachement `exempteLimite` (Détachement
  // Narratif) ne compte ni dans la Limite de Points, ni dans les
  // quotas ci-dessous — voir MODÈLE DE DONNÉES, js/organigramme-data.js.
  function estExempteLimite(uid) {
    return etat.detachements.some(
      (det) =>
        typeDe(det).exempteLimite && det.cases.some((c) => c.uniteUid === uid),
    );
  }

  function coutTotalArmee() {
    return hooks
      .getArmee()
      .reduce(
        (somme, i) =>
          estExempteLimite(i.uid)
            ? somme
            : somme + hooks.coutInstance(hooks.trouverUnite(i.uniteId), i),
        0,
      );
  }

  // Coût combiné des Rôles Seigneur de Guerre + Seigneur des Batailles.
  function coutSeigneurs() {
    return hooks.getArmee().reduce((somme, i) => {
      if (estExempteLimite(i.uid)) return somme;
      const unite = hooks.trouverUnite(i.uniteId);
      if (
        unite.categorie === "Seigneurs des Batailles" ||
        unite.categorie === "Seigneur de Guerre"
      ) {
        return somme + hooks.coutInstance(unite, i);
      }
      return somme;
    }, 0);
  }

  // Coût des unités placées dans des Détachements Alliés (quota 50 %).
  function coutAllies() {
    let total = 0;
    for (const det of etat.detachements) {
      if (typeDe(det).id !== "allie") continue;
      for (const caseOrga of det.cases) {
        if (caseOrga.uniteUid !== null)
          total += coutInstanceParUid(caseOrga.uniteUid);
      }
    }
    return total;
  }

  /* ----------------------------------------------------------
     VALIDATION GLOBALE — recalculée à chaque changement.
     Retourne une liste de messages d'erreur explicites (exigence
     UX). Les placements illégaux sont déjà bloqués à la source :
     cette liste couvre les règles « transversales » (quotas,
     crédits, avantages) qui peuvent devenir fausses après coup
     (ex : on retire le Centurion qui finançait deux Auxiliaires).
     `credits` (calculerCredits()) est calculé une seule fois par
     construireBarre, qui en a de toute façon besoin par ailleurs,
     plutôt que recalculé ici — recalculé par défaut si omis.
     ---------------------------------------------------------- */
  function validerArmee(credits = calculerCredits()) {
    const erreurs = [];
    const total = coutTotalArmee();

    // 1. Limite de Points (p. 282).
    if (total > etat.limite) {
      erreurs.push(
        "Limite de Points dépassée : " +
          total +
          " pts pour " +
          etat.limite +
          " pts autorisés.",
      );
    }

    // 2. Quota combiné Seigneur de Guerre + Seigneur des Batailles (p. 283).
    // Ignoré pour une Armée dont le Détachement Principal est l'Ordinal
    // Titanique (livre d'armée Legio Titanicus) : un seul choix de
    // Seigneur des Batailles peut alors consommer tous les Points. Même
    // exemption pour le Détachement Principal de Maisonnées de Chevaliers
    // (livre d'armée Chevaliers Questoris, p. 20) : « peut inclure
    // n'importe quel nombre de Points en Unités de Rôle Tactique Seigneur
    // des Batailles... jusqu'à concurrence de la Limite de Points de
    // l'Armée » — ses 4 Cases sont toutes de ce Rôle Tactique.
    const seigneurs = coutSeigneurs();
    const plafond25 = Math.ceil(etat.limite * 0.25);
    const quotaSeigneursIgnore =
      idDetachementPrincipal() === "ordinal-titanique" ||
      idDetachementPrincipal() === "maisonnees-chevaliers";
    if (!quotaSeigneursIgnore && etat.limite >= 3000 && seigneurs > plafond25) {
      erreurs.push(
        "Quota Seigneur de Guerre + Seigneur des Batailles dépassé : " +
          seigneurs +
          " pts pour un maximum combiné de " +
          plafond25 +
          " pts (25 % de la Limite, arrondi supérieur).",
      );
    }
    if (
      !quotaSeigneursIgnore &&
      etat.limite < 3000 &&
      seigneurs > 0 &&
      seigneurs >= etat.limite * 0.25
    ) {
      // Sous 3000 pts, le livre exige un coût combiné STRICTEMENT
      // inférieur à 25 % (encart p. 283).
      erreurs.push(
        "Sous 3000 pts, le coût combiné des Seigneurs des Batailles doit rester strictement inférieur à 25 % de la Limite (" +
          seigneurs +
          " pts pour moins de " +
          Math.ceil(etat.limite * 0.25) +
          " pts).",
      );
    }
    // Sous 3000 pts : aucune unité Seigneur de Guerre (p. 283).
    if (etat.limite < 3000) {
      const sdg = hooks
        .getArmee()
        .some(
          (i) =>
            !estExempteLimite(i.uid) &&
            hooks.trouverUnite(i.uniteId).categorie === "Seigneur de Guerre",
        );
      if (sdg)
        erreurs.push(
          "Aucune unité Seigneur de Guerre n'est autorisée sous 3000 pts (p. 283).",
        );
    }

    // 3. Quota Alliés ≤ 50 % (p. 283).
    const allies = coutAllies();
    const plafond50 = Math.ceil(etat.limite * 0.5);
    if (allies > plafond50) {
      erreurs.push(
        "Quota Allié dépassé : " +
          allies +
          " pts pour un maximum de " +
          plafond50 +
          " pts (50 %).",
      );
    }

    // 4. Crédits de déblocage (p. 283-284).
    if (credits.nbApex > credits.qgRemplis) {
      erreurs.push(
        credits.nbApex +
          " Détachement(s) d'Apex pour " +
          credits.qgRemplis +
          " Case(s) de Quartier Général remplie(s) : retirez un Apex ou remplissez un QG.",
      );
    } else if (credits.auxRestants < 0) {
      erreurs.push(
        "Trop de Détachements Auxiliaires : " +
          credits.nbAuxComptables +
          " pris pour " +
          (credits.creditsEM + credits.apexRestants) +
          " crédit(s) (Cases d'État-major remplies + Cases QG non utilisées par un Apex).",
      );
    }

    // 5. Déblocages spécifiques (livre d'armée Legiones Astartes).
    for (const type of TYPES_DETACHEMENTS) {
      if (type.deblocage && debloqueursDisponibles(type) < 0) {
        erreurs.push(
          "« " +
            type.nom +
            " » : il manque une unité débloqueuse (" +
            nomsUnitesParIds(type.deblocage.uniteIds) +
            ") occupant une Case " +
            type.deblocage.caseRole +
            ".",
        );
      }
      // Condition de sélection portant sur l'Armée entière (unité
      // présente n'importe où, pas liée à une Case précise) : contrairement
      // à `deblocage` ci-dessus, ne consomme aucun crédit et ne dépend pas
      // d'une Case — juste un prérequis de composition (ex : Avant-garde
      // de Medusa exige un Révérend de Fer ou Ferrus Manus dans l'Armée).
      if (
        type.requiertUniteArmee &&
        etat.detachements.some((d) => d.typeId === type.id) &&
        !hooks
          .getArmee()
          .some((inst) => type.requiertUniteArmee.includes(inst.uniteId))
      ) {
        erreurs.push(
          "« " +
            type.nom +
            " » nécessite une Unité de " +
            nomsUnitesParIds(type.requiertUniteArmee) +
            " dans l'Armée.",
        );
      }
      // Mêmes conditions de composition d'Armée que ci-dessus, portant
      // cette fois sur l'Allégeance de la partie et/ou un Avantage
      // Principal choisi n'importe où (ex : Conclave Exalté des Word
      // Bearers, réservé aux Armées Renégates ayant choisi Vrais
      // Croyants sur au moins une Case) : un changement d'Allégeance ou
      // la désélection de l'Avantage rend le Détachement déjà présent
      // invalide, signalé ici plutôt que retiré automatiquement.
      if (
        type.requiertAllegeance &&
        etat.detachements.some((d) => d.typeId === type.id) &&
        etat.allegeance !== type.requiertAllegeance
      ) {
        erreurs.push(
          "« " +
            type.nom +
            " » nécessite une Armée d'Allégeance " +
            (type.requiertAllegeance === "renegat" ? "Renégate" : "Loyaliste") +
            ".",
        );
      }
      if (
        type.requiertAvantage &&
        etat.detachements.some((d) => d.typeId === type.id) &&
        !detachementDebloque(type)
      ) {
        const avantage = avantageParId(type.requiertAvantage);
        const nomAvantage = avantage ? avantage.nom : type.requiertAvantage;
        erreurs.push(
          type.requiertMaisonnee
            ? "« " +
                type.nom +
                " » nécessite l'Avantage Principal « " +
                nomAvantage +
                " » choisi sur au moins une Case de l'Armée, OU une Armée avec le Paradigme de Maisonnée " +
                nomMaisonnee(type.requiertMaisonnee) +
                " comptant une Figurine de Sous-type Chevalier dans son Détachement Principal de Maisonnées de Chevaliers ou un Détachement de Seigneur des Batailles."
            : "« " +
                type.nom +
                " » nécessite l'Avantage Principal « " +
                nomAvantage +
                " » choisi sur au moins une Case de l'Armée.",
        );
      }
      // Rite de Guerre choisi dans les paramètres de la partie (menu
      // « Rite de Guerre », affiché pour les Légions de
      // RITES_DE_GUERRE) : un changement de Rite après coup rend le
      // Détachement déjà présent invalide, comme pour l'Allégeance
      // ci-dessus.
      if (
        type.requiertRiteDeGuerre &&
        etat.detachements.some((d) => d.typeId === type.id) &&
        etat.riteDeGuerre !== type.requiertRiteDeGuerre
      ) {
        const rites = RITES_DE_GUERRE[type.legion] || [];
        const rite = rites.find((r) => r.id === type.requiertRiteDeGuerre);
        erreurs.push(
          "« " +
            type.nom +
            " » nécessite le Rite de Guerre « " +
            (rite ? rite.nom : type.requiertRiteDeGuerre) +
            " ».",
        );
      }
      // Doctrine de Cohorte choisie dans les paramètres de la partie
      // (menu « Doctrine de Cohorte », Faction Solar Auxilia
      // uniquement) : un changement de Doctrine après coup rend le
      // Détachement déjà présent invalide, comme pour le Rite de
      // Guerre ci-dessus (ex : Tercio de Fer, réservé à la Doctrine de
      // Cohorte de Fer).
      if (
        type.requiertDoctrineCohorte &&
        etat.detachements.some((d) => d.typeId === type.id) &&
        etat.doctrineCohorte !== type.requiertDoctrineCohorte
      ) {
        const doctrine = DOCTRINES_DE_COHORTE.find(
          ([v]) => v === type.requiertDoctrineCohorte,
        );
        erreurs.push(
          "« " +
            type.nom +
            " » nécessite la Doctrine de Cohorte « " +
            (doctrine ? doctrine[1] : type.requiertDoctrineCohorte) +
            " ».",
        );
      }
      // Exclusion mutuelle entre deux types de Détachement (ex :
      // Confrérie du Phénix / Détachement de Seigneur de Guerre) :
      // signalée une seule fois par paire (type.id < autreId) pour
      // éviter un message en double, l'exclusion étant déclarée sur
      // les deux types.
      if (type.excluAvec) {
        for (const autreId of type.excluAvec) {
          if (autreId <= type.id) continue;
          if (
            etat.detachements.some((d) => d.typeId === type.id) &&
            etat.detachements.some((d) => d.typeId === autreId)
          ) {
            const autre = typeParId(autreId);
            erreurs.push(
              "« " +
                type.nom +
                " » et « " +
                (autre ? autre.nom : autreId) +
                " » ne peuvent pas être sélectionnés dans la même Armée.",
            );
          }
        }
      }
    }

    // 6. Avantages Principaux (p. 283).
    const parIdArmee = {};
    for (const det of etat.detachements) {
      const parId = {};
      for (const caseOrga of det.cases) {
        if (caseOrga.avantage !== "aucun") {
          parId[caseOrga.avantage] = (parId[caseOrga.avantage] || 0) + 1;
          parIdArmee[caseOrga.avantage] =
            (parIdArmee[caseOrga.avantage] || 0) + 1;
        }
      }
      for (const avantage of AVANTAGES_PRINCIPAUX) {
        if (avantage.unParDetachement && parId[avantage.id] > 1) {
          erreurs.push(
            "« " +
              avantage.nom +
              " » ne peut être choisi qu'une fois par détachement (" +
              typeDe(det).nom +
              ").",
          );
        }
      }
    }
    for (const avantage of AVANTAGES_PRINCIPAUX) {
      if (
        avantage.unParArmee &&
        parIdArmee[avantage.id] > 1 &&
        // Paradigme de Maisonnée (livre d'armée Chevaliers Questoris) :
        // la restriction 0-1 par Armée saute pour Précepteur/Seigneur
        // Preux si un Détachement de l'Armée a la Maisonnée assortie —
        // simplification assumée, sans décompte fin par Détachement
        // (voir MODÈLE DE DONNÉES, `exempteUnParArmeeSiMaisonnee`).
        !(
          avantage.exempteUnParArmeeSiMaisonnee &&
          etat.detachements.some(
            (d) =>
              maisonneePertinentePourDetachement(d) ===
              avantage.exempteUnParArmeeSiMaisonnee,
          )
        )
      ) {
        erreurs.push(
          "« " + avantage.nom + " » ne peut être choisi qu'une fois par Armée.",
        );
      }
    }

    // 7. Unités hors organigramme (listes restaurées d'une ancienne
    //    version : chaque unité doit occuper une case).
    for (const instance of hooks.getArmee()) {
      if (!assignationDe(instance.uid)) {
        erreurs.push(
          "« " +
            hooks.trouverUnite(instance.uniteId).nom +
            " » n'occupe aucune Case : choisissez-en une sur sa carte (menu « Case ») ou retirez-la.",
        );
      }
    }
    return erreurs;
  }

  /* Avantages proposés pour une case principale occupée : on grise
     ceux dont la condition n'est pas remplie (exigence UX), avec la
     raison dans le title. Règle p. 283 : Sous-type Unique → seul
     Bénéfice Logistique disponible. */
  function avantagesPossibles(det, caseOrga) {
    const type = typeDe(det);
    const occ = occupant(caseOrga);
    const resultat = [];
    const legionCase = legionPertinentePourCase(det);
    // Dans la Disgrâce, Tous sont Égaux (Blackshields, voir
    // SERMENTS_DU_MOMENT) : sur un Détachement où ce Serment est actif,
    // TOUTE Case ordinaire devient une Case d'Organigramme de Force
    // Suprême — seul l'Avantage Petit Seigneur de Guerre y est
    // sélectionnable (jamais proposé ailleurs, y compris sur une
    // véritable Case Principale d'un autre Détachement).
    const disgraceActive = sermentsActifsDe(det).some(
      (id) => sermentParId(id) && sermentParId(id).toutesCasesDeviennentPrime,
    );
    for (const avantage of AVANTAGES_PRINCIPAUX) {
      if (avantage.id === "petit-seigneur-de-guerre") {
        if (!disgraceActive) continue;
      } else if (disgraceActive && avantage.id !== "aucun") {
        continue;
      }
      // Avantages d'Arsenal réservés à une AUTRE Légion (`traitRequis`,
      // un par Légion) ou Avantages de Rang de Maisonnée réservés à une
      // AUTRE Faction que Chevaliers Questoris (`chevalier`) : masqués
      // entièrement plutôt que grisés — les proposer grisés noierait le
      // menu sous une vingtaine d'options sans rapport avec la partie en
      // cours (p. 283, arsenaux propres à chaque Légion). Une Unité
      // portant elle-même le Trait exigé (ex : figurine réservée à une
      // Légion) reste éligible même si la Légion de l'Armée/du
      // Détachement Allié diffère.
      if (
        avantage.chevalier &&
        (occ.unite.faction || "legio-astartes") !== "chevaliers-questoris"
      ) {
        continue;
      }
      if (
        avantage.traitRequis &&
        !occ.unite.traits.includes(avantage.traitRequis) &&
        !(
          SKINS_LEGION[legionCase] &&
          SKINS_LEGION[legionCase].nom === avantage.traitRequis
        )
      ) {
        continue;
      }
      let raison = "";
      if (
        type.avantagesAutorises &&
        avantage.id !== "aucun" &&
        !type.avantagesAutorises.includes(avantage.id)
      ) {
        raison =
          "Seul l'Avantage Principal « " +
          type.avantagesAutorises
            .map((id) => avantageParId(id).nom)
            .join(" / ") +
          " » peut être choisi pour les Cases de ce Détachement.";
      } else if (
        occ &&
        aSousType(occ, "Unique") &&
        avantage.id !== "benefice-logistique" &&
        avantage.id !== "aucun"
      ) {
        raison =
          "Unité de Sous-type Unique : seul Bénéfice Logistique est disponible (p. 283).";
      } else if (avantage.sergent && occ && !aSousType(occ, "Sergent")) {
        raison = "Exige une figurine de Sous-type Sergent.";
      } else if (avantage.etatMajor && occ && !aSousType(occ, "État-major")) {
        raison = "Exige une figurine de Sous-type État-major.";
      } else if (avantage.chevalier && occ && !aSousType(occ, "Chevalier")) {
        raison = "Exige une Unité de Sous-type Chevalier.";
      } else if (
        avantage.typesRequis &&
        occ &&
        !avantage.typesRequis.some((t) => aSousType(occ, t))
      ) {
        raison =
          "Réservé aux Figurines de Type " +
          avantage.typesRequis.join(" ou ") +
          ".";
      } else if (avantage.caseEM && caseOrga.role !== "État-major") {
        raison = "Réservé aux Cases d'État-major.";
      } else if (avantage.roleRequis && caseOrga.role !== avantage.roleRequis) {
        raison =
          "Réservé aux Cases de Rôle Tactique " + avantage.roleRequis + ".";
      } else if (
        avantage.uniteRequise &&
        !(
          occ &&
          avantage.uniteRequise.some(
            (u) =>
              u.id === occ.unite.id &&
              (u.variante === undefined ||
                u.variante === occ.instance.variante),
          )
        )
      ) {
        // Noms lisibles (dédupliqués) des Figurines/variantes admises,
        // résolus depuis `uniteRequise` via hooks.trouverUnite : pour
        // une variante précise, on prend son propre nom (ex : « Centu-
        // rion Cataphractii », pas « Centurion en Armure Terminator »).
        const noms = [
          ...new Set(
            avantage.uniteRequise.map((u) => {
              const unite = hooks.trouverUnite(u.id);
              if (!unite) return u.id;
              if (u.variante === undefined) return unite.nom;
              const variante = unite.variantes[u.variante];
              return variante ? variante.nom : unite.nom;
            }),
          ),
        ];
        // Élision (« d'Escouade » et non « de Escouade ») devant une
        // voyelle ou un h muet.
        const de = (nom) => (/^[aeiouhàâéèêëîïôùûü]/i.test(nom) ? "d'" : "de ");
        raison =
          "Réservé à une Figurine " +
          noms
            .map((nom, i) => (i === 0 ? "" : "ou ") + de(nom) + nom)
            .join(" ") +
          ".";
      } else if (
        avantage.traitRequis &&
        !(
          occ &&
          (occ.unite.traits.includes(avantage.traitRequis) ||
            // Unité générique (Trait « [Legiones Astartes] ») : compte
            // comme ayant le Trait de la Légion pertinente pour cette
            // Case (ex : Centurion en Armée Death Guard ; Centurion
            // générique dans un Détachement Allié Iron Hands compte
            // comme ayant le Trait Iron Hands, pas celui de l'Armée).
            (occ.unite.traits.includes("[Legiones Astartes]") &&
              SKINS_LEGION[legionCase] &&
              SKINS_LEGION[legionCase].nom === avantage.traitRequis))
        )
      ) {
        raison =
          "Exige une Unité dont les Figurines ont le Trait " +
          avantage.traitRequis +
          ".";
      } else if (
        avantage.id === "affectation-speciale" &&
        occ &&
        occ.unite.categorie !== "Quartier Général"
      ) {
        // Cet avantage n'a d'effet que pour une unité de Quartier
        // Général logée en Case d'État-major (voir assigner) : le
        // proposer pour une unité d'État-major normale n'aurait aucun
        // sens et lui ferait perdre son crédit de déblocage pour rien.
        raison =
          "Réservé aux unités de Quartier Général placées sur une Case d'État-major (voir « Case » sur leur carte).";
      } else if (avantage.renegat && etat.allegeance !== "renegat") {
        raison =
          "Réservé aux armées d'Allégeance Renégate (Légions Corrompues).";
      } else if (avantage.loyaliste && etat.allegeance !== "loyaliste") {
        raison = "Réservé aux armées d'Allégeance Loyaliste.";
      } else if (avantage.principalUniquement && type.famille !== "principal") {
        raison = "Réservé à une Case du Détachement Principal de l'Armée.";
      } else if (
        avantage.factionRequise &&
        etat.faction !== avantage.factionRequise
      ) {
        const texteFaction =
          (FACTIONS.find(([id]) => id === avantage.factionRequise) || [])[1] ||
          avantage.factionRequise;
        raison = "Réservé aux Armées de la Faction " + texteFaction + ".";
      } else if (
        avantage.unParDetachement &&
        caseOrga.avantage !== avantage.id &&
        det.cases.some((c) => c !== caseOrga && c.avantage === avantage.id)
      ) {
        raison =
          "« " +
          avantage.nom +
          " » déjà choisi ailleurs dans ce détachement (une seule fois par détachement).";
      } else if (
        avantage.unParArmee &&
        caseOrga.avantage !== avantage.id &&
        etat.detachements.some((d) =>
          d.cases.some((c) => c !== caseOrga && c.avantage === avantage.id),
        ) &&
        // Paradigme de Maisonnée : voir le bloc analogue de
        // validerArmee() ci-dessus.
        !(
          avantage.exempteUnParArmeeSiMaisonnee &&
          maisonneePertinentePourDetachement(det) ===
            avantage.exempteUnParArmeeSiMaisonnee
        )
      ) {
        raison =
          "« " +
          avantage.nom +
          " » déjà choisi ailleurs dans l'Armée (une seule fois par Armée).";
      }
      // Note : une unité QG en Case d'État-major n'est légale QUE via
      // l'Avantage Affectation Spéciale — il est alors verrouillé (non
      // désélectionnable) par changerAvantage() ci-dessous, pas ici :
      // le proposer grisé ici n'aurait aucun sens puisqu'il reste la
      // seule option valide pour cette Case.
      resultat.push({ avantage, grise: raison !== "", raison });
    }
    // Options disponibles d'abord, grisées ensuite (tri stable : l'ordre
    // relatif au sein de chaque groupe reste celui d'AVANTAGES_PRINCIPAUX,
    // « Aucun avantage choisi » — jamais grisé — reste donc toujours en
    // tête). Purement un tri d'affichage du menu déroulant ci-dessous
    // (construireCarteDetachement) : ne change ni la valeur sélectionnée
    // ni la logique de grisage elle-même.
    resultat.sort((a, b) => (a.grise === b.grise ? 0 : a.grise ? 1 : -1));
    // Faction Chevaliers Questoris : une dizaine d'Avantages de Rang de
    // Maisonnée se partagent le menu, la plupart réservés à 0-1 par
    // Armée (`unParArmee`) — dès qu'un premier est choisi quelque part,
    // presque tous les autres se retrouveraient grisés en même temps et
    // noieraient le menu. On les masque donc entièrement plutôt que de
    // les griser, comme pour les Avantages d'une autre Légion ci-dessus.
    // L'option actuellement choisie sur cette Case reste toujours
    // affichée (même grisée), pour que le menu déroulant continue de
    // refléter fidèlement caseOrga.avantage.
    if (etat.faction === "chevaliers-questoris") {
      return resultat.filter(
        ({ avantage, grise }) => !grise || avantage.id === caseOrga.avantage,
      );
    }
    return resultat;
  }

  /* Change l'avantage d'une case. Gère la case supplémentaire des
     Avantages `ajouteCase` (Bénéfice Logistique, Le Salaire de la
     Traîtrise) : ajout à la sélection, retrait au changement (bloqué
     si la case ajoutée est occupée). Un seul détachement ne porte
     jamais plus d'une case ajoutée à la fois, quel que soit l'Avantage
     qui l'a créée (simplification : le livre autorise Le Salaire de la
     Traîtrise plusieurs fois par détachement, une case par sélection —
     seule la première case ajoutée est modélisée ici). Retourne un
     message d'erreur ou null si tout va bien. */
  function changerAvantage(det, indice, nouvelId) {
    const caseOrga = det.cases[indice];
    const occ = occupant(caseOrga);
    const ancienAvantage = avantageParId(caseOrga.avantage);
    const nouvelAvantage = avantageParId(nouvelId);
    // Verrou Affectation Spéciale (voir assigner).
    if (
      caseOrga.avantage === "affectation-speciale" &&
      occ &&
      occ.unite.categorie === "Quartier Général" &&
      nouvelId !== "affectation-speciale"
    ) {
      return "Cette unité de Quartier Général n'occupe la Case d'État-major que grâce à l'Affectation Spéciale : déplacez d'abord l'unité.";
    }
    if (
      ancienAvantage &&
      ancienAvantage.ajouteCase &&
      caseOrga.avantage !== nouvelId
    ) {
      // Groupe de cases ajoutées par cet Avantage (`nombreCasesAjoutees`,
      // ex : Agent de Clade en ajoute 3 d'un coup) : retirées ensemble,
      // bloqué si au moins une est occupée.
      const extraIndices = [];
      det.cases.forEach((c, i) => {
        if (c.extra && c.origineAvantage === ancienAvantage.id)
          extraIndices.push(i);
      });
      if (extraIndices.some((i) => det.cases[i].uniteUid !== null)) {
        return (
          "La case ajoutée par « " +
          ancienAvantage.nom +
          " » est occupée : retirez ou déplacez d'abord son unité."
        );
      }
      for (let i = extraIndices.length - 1; i >= 0; i--) {
        det.cases.splice(extraIndices[i], 1);
      }
    }
    caseOrga.avantage = nouvelId;
    if (
      nouvelAvantage &&
      nouvelAvantage.ajouteCase &&
      !det.cases.some((c) => c.extra)
    ) {
      // Rôle Tactique de la case ajoutée : libre par défaut (tout sauf
      // QG/État-major/Seigneurs, ROLES_INTERDITS_LOGISTIQUE), sauf si
      // l'Avantage restreint la liste (`rolesCaseAjoutee`, ex : Bardé
      // de Fer, réservé à Engins de Guerre) — un seul Rôle possible
      // dans cette liste est alors préaffecté directement et FIXE (pas
      // de menu déroulant, voir construireCarteDetachement plus bas).
      // `nombreCasesAjoutees` (défaut 1) répète l'ajout, ex : Agent de
      // Clade qui ajoute 3 Cases d'Appui d'un coup.
      const rolesPossibles = nouvelAvantage.rolesCaseAjoutee;
      const roleFixe =
        rolesPossibles && rolesPossibles.length === 1
          ? rolesPossibles[0]
          : null;
      const nombre = nouvelAvantage.nombreCasesAjoutees || 1;
      for (let i = 0; i < nombre; i++) {
        det.cases.push({
          role: roleFixe,
          principale: false,
          uniteUid: null,
          avantage: "aucun",
          extra: true,
          origineAvantage: nouvelId,
        });
      }
    }
    retirerDetachementsAvantageInvalide();
    actualiser();
    return null;
  }

  /* Retire tout Détachement dont la condition `requiertAvantage` n'est
     plus remplie nulle part dans l'Armée (ex : Serre d'Armigères,
     débloqué par Preux Aspirant — OU par le Paradigme de Maisonnée
     Mendicus, voir detachementDebloque()) après un changement
     d'Avantage Principal — contrairement à requiertAllegeance/requiertRiteDeGuerre,
     simplement signalés en erreur par validerArmee() sans retrait
     automatique (choix assumé : un changement d'Allégeance ou de Rite de
     Guerre affecte potentiellement toute l'Armée, alors qu'un Avantage
     ne concerne qu'un Détachement précis). Demande confirmation avant de
     retirer un Détachement non vide (comme le bouton « Retirer le
     détachement », voir construireDetachementDOM) ; si l'utilisateur
     refuse, le Détachement reste en l'état et validerArmee() continue de
     le signaler en erreur. Boucle jusqu'à stabilisation : retirer un
     Détachement retire aussi ses Unités, ce qui peut à son tour invalider
     un AUTRE Détachement dont l'unique Avantage qualifiant s'y trouvait
     (ex : Bannière d'Appui elle-même débloquée par un Avantage porté par
     une Unité de Serre d'Armigères — cas hypothétique, non rencontré
     aujourd'hui, mais couvert par cette boucle). */
  function retirerDetachementsAvantageInvalide() {
    let retire = true;
    while (retire) {
      retire = false;
      for (const det of etat.detachements) {
        const type = typeDe(det);
        if (!type.requiertAvantage || detachementDebloque(type)) continue;
        const occupees = det.cases.filter((c) => c.uniteUid !== null);
        if (
          occupees.length > 0 &&
          !window.confirm(
            "« " +
              type.nom +
              " » n'est plus débloqué (l'Avantage Principal requis a été retiré) et contient " +
              occupees.length +
              " unité(s) : elles seront retirées de la liste. Continuer ?",
          )
        ) {
          continue;
        }
        for (const c of occupees) hooks.retirerInstance(c.uniteUid);
        etat.detachements = etat.detachements.filter((d) => d.uid !== det.uid);
        retire = true;
        break; // etat.detachements muté : on relance une passe propre
      }
    }
  }

  /* Retire les Détachements d'Apex/Auxiliaires devenus surnuméraires
     après le retrait d'une unité de Quartier Général ou d'État-major :
     leur crédit de déblocage (p. 283-284) a disparu avec elle. Appelée
     uniquement quand la Case libérée était bien de ce Rôle (voir
     libererEtActualiser) — un retrait sans rapport avec ces Cases ne
     déclenche jamais ce nettoyage. Retire en priorité les Détachements
     vides, sinon demande confirmation (même message que le bouton
     « Retirer le détachement », voir construireDetachementDOM) ; un
     refus laisse le Détachement en trop, alors signalé en erreur par
     validerArmee(). Boucle jusqu'à stabilisation : retirer un
     Détachement retire aussi ses unités, ce qui peut à son tour libérer
     une AUTRE Case QG/État-major (cas rare mais possible si un
     Détachement Auxiliaire en porte une). */
  function retirerDetachementsCreditInsuffisant() {
    let retire = true;
    while (retire) {
      retire = false;
      const credits = calculerCredits();
      let famille = null;
      if (credits.apexRestants < 0) famille = "apex";
      else if (credits.auxRestants < 0) famille = "auxiliaire";
      if (!famille) continue;
      const candidats = etat.detachements.filter((d) => {
        const type = typeDe(d);
        if (famille === "apex") return type.famille === "apex";
        return (
          type.famille === "auxiliaire" &&
          !(type.deblocage && type.deblocage.caseRole === "Appui")
        );
      });
      if (candidats.length === 0) continue;
      candidats.sort(
        (a, b) =>
          a.cases.filter((c) => c.uniteUid !== null).length -
          b.cases.filter((c) => c.uniteUid !== null).length,
      );
      const cible = candidats[0];
      const type = typeDe(cible);
      const occupees = cible.cases.filter((c) => c.uniteUid !== null);
      if (
        occupees.length > 0 &&
        !window.confirm(
          "Le retrait de cette unité fait perdre le crédit de déblocage de « " +
            type.nom +
            " » (p. 283-284) et ce Détachement contient " +
            occupees.length +
            " unité(s) : elles seront retirées de la liste. Continuer ?",
        )
      ) {
        continue; // refus : le Détachement en trop reste, signalé par validerArmee()
      }
      for (const c of occupees) hooks.retirerInstance(c.uniteUid);
      etat.detachements = etat.detachements.filter((d) => d.uid !== cible.uid);
      retire = true;
    }
  }

  /* ----------------------------------------------------------
     PERSISTANCE (localStorage) — les uid d'unités sont stables :
     js/unites.js les conserve dans sa propre sauvegarde.
     ---------------------------------------------------------- */
  function sauvegarderOrga() {
    try {
      localStorage.setItem(
        CLE_STOCKAGE_ORGA,
        JSON.stringify({
          limite: etat.limite,
          faction: etat.faction,
          allegeance: etat.allegeance,
          legion: etat.legion,
          maisonnee: etat.maisonnee,
          riteDeGuerre: etat.riteDeGuerre,
          doctrineCohorte: etat.doctrineCohorte,
          designationAuxilia: etat.designationAuxilia,
          chartPrincipal: etat.chartPrincipal,
          dominion: etat.dominion,
          technoArcane: etat.technoArcane,
          legionsBrisees: etat.legionsBrisees,
          detachements: etat.detachements.map((d) => ({
            typeId: d.typeId,
            factionAlliee: d.factionAlliee || null,
            legionAlliee: d.legionAlliee || null,
            maisonneeAlliee: d.maisonneeAlliee || null,
            doctrineCohorteAlliee: d.doctrineCohorteAlliee || null,
            maisonneeSeigneurBatailles: d.maisonneeSeigneurBatailles || null,
            serments: d.serments || [],
            legionPanoplie: d.legionPanoplie || "",
            choixCloneAberrant: d.choixCloneAberrant || "",
            // `serimentsRattaches` pointe vers l'uid d'un AUTRE
            // Détachement, jamais stable d'une session à l'autre
            // (compteurDet reparT à zéro à chaque restauration) :
            // sauvegardé comme un INDICE dans ce même tableau
            // `detachements`, résolu en uid réel après coup (voir
            // restaurerOrga, deuxième passe).
            serimentsRattachesIndex:
              d.serimentsRattaches == null
                ? null
                : etat.detachements.findIndex(
                    (autre) => autre.uid === d.serimentsRattaches,
                  ),
            cases: d.cases.map((c) => ({
              role: c.role,
              uniteUid: c.uniteUid,
              avantage: c.avantage,
              extra: c.extra,
              origineAvantage: c.origineAvantage || null,
              libre: c.libre || false,
            })),
          })),
        }),
      );
    } catch {
      /* stockage indisponible : on ignore */
    }
  }

  function restaurerOrga() {
    try {
      const brut = localStorage.getItem(CLE_STOCKAGE_ORGA);
      if (!brut) return;
      const donnees = JSON.parse(brut);
      if (Number.isInteger(donnees.limite) && donnees.limite > 0)
        etat.limite = donnees.limite;
      if (
        typeof donnees.faction === "string" &&
        FACTIONS.some(
          ([v, , disponible]) => v === donnees.faction && disponible,
        )
      ) {
        etat.faction = donnees.faction;
      }
      if (
        donnees.allegeance === "renegat" ||
        donnees.allegeance === "loyaliste"
      ) {
        etat.allegeance = donnees.allegeance;
      }
      if (
        typeof donnees.legion === "string" &&
        (donnees.legion === "" || LEGIONS.some(([v]) => v === donnees.legion))
      ) {
        etat.legion = donnees.legion;
      }
      if (
        typeof donnees.maisonnee === "string" &&
        (donnees.maisonnee === "" ||
          MAISONNEES.some(([v]) => v === donnees.maisonnee))
      ) {
        etat.maisonnee = donnees.maisonnee;
      }
      if (
        typeof donnees.doctrineCohorte === "string" &&
        (donnees.doctrineCohorte === "" ||
          DOCTRINES_DE_COHORTE.some(([v]) => v === donnees.doctrineCohorte))
      ) {
        etat.doctrineCohorte = donnees.doctrineCohorte;
      }
      if (
        typeof donnees.designationAuxilia === "string" &&
        (donnees.designationAuxilia === "" ||
          DESIGNATIONS_LEGIONES_AUXILIA.some(
            (d) => d.id === donnees.designationAuxilia,
          ))
      ) {
        etat.designationAuxilia = donnees.designationAuxilia;
      }
      if (
        typeof donnees.chartPrincipal === "string" &&
        (donnees.chartPrincipal === "" ||
          TYPES_DETACHEMENTS.some(
            (t) =>
              t.id === donnees.chartPrincipal &&
              t.famille === "principal" &&
              t.id !== "principal" &&
              !t.faction,
          ))
      ) {
        etat.chartPrincipal = donnees.chartPrincipal;
      }
      if (
        typeof donnees.dominion === "string" &&
        (donnees.dominion === "" ||
          DOMINIONS_ETHERIQUES.includes(donnees.dominion))
      ) {
        etat.dominion = donnees.dominion;
      }
      if (
        typeof donnees.technoArcane === "string" &&
        (donnees.technoArcane === "" ||
          TECHNO_ARCANES.some(([v]) => v === donnees.technoArcane))
      ) {
        etat.technoArcane = donnees.technoArcane;
      }
      if (
        Array.isArray(donnees.legionsBrisees) &&
        donnees.legionsBrisees.length <= 3 &&
        donnees.legionsBrisees.every(
          (code) =>
            typeof code === "string" && LEGIONS.some(([v]) => v === code),
        ) &&
        new Set(donnees.legionsBrisees).size === donnees.legionsBrisees.length
      ) {
        etat.legionsBrisees = donnees.legionsBrisees;
      }
      const ritesLegion = RITES_DE_GUERRE[etat.legion] || [];
      if (
        typeof donnees.riteDeGuerre === "string" &&
        (donnees.riteDeGuerre === "" ||
          ritesLegion.some((r) => r.id === donnees.riteDeGuerre))
      ) {
        etat.riteDeGuerre = donnees.riteDeGuerre;
      }
      // Cohérence Allégeance/Rite de Guerre (ex : Legio Hereticus
      // impose l'Allégeance Renégate) : re-synchronise au cas où la
      // sauvegarde daterait d'avant l'ajout du champ `allegeanceForcee`.
      const riteActif = ritesLegion.find((r) => r.id === etat.riteDeGuerre);
      if (riteActif && riteActif.allegeanceForcee) {
        etat.allegeance = riteActif.allegeanceForcee;
      }
      // La Legio Custodes et l'Anathema Psykana n'ont pas de variante
      // Renégate (voir le forçage au changement de Faction plus bas) :
      // une sauvegarde antérieure avec une autre Faction en Allégeance
      // Renégate ne doit pas ressusciter en Renégat au rechargement de
      // la page, sinon leurs Unités (Trait fixe « Loyaliste »)
      // disparaissent silencieusement du sélecteur « Unité à ajouter »
      // (uniteAccessible, js/unites.js).
      if (
        etat.faction === "legio-custodes" ||
        etat.faction === "anathema-psykana"
      ) {
        etat.allegeance = "loyaliste";
      }
      // Les Démons de la Tempête de la Ruine n'ont, à l'inverse, aucune
      // variante Loyaliste (toutes leurs Unités portent le Trait fixe
      // « Renégat », voir js/unites-data.js) : même forçage que ci-dessus,
      // en sens inverse.
      if (etat.faction === "daemons-ruinstorm") {
        etat.allegeance = "renegat";
      }
      if (!Array.isArray(donnees.detachements)) return;
      // On revalide tout : les données du navigateur ne sont jamais
      // considérées comme sûres.
      for (const brute of donnees.detachements) {
        const type = typeParId(brute.typeId);
        if (!type) continue;
        const det = creerDetachement(type.id);
        if (type.id === "allie") {
          if (
            typeof brute.factionAlliee === "string" &&
            FACTIONS.some(
              ([v, , disponible]) => v === brute.factionAlliee && disponible,
            )
          ) {
            det.factionAlliee = brute.factionAlliee;
          } else if (
            typeof brute.legionAlliee === "string" &&
            brute.legionAlliee !== ""
          ) {
            // Sauvegarde antérieure au menu « Faction Alliée » : une
            // Légion Alliée déjà choisie signifiait forcément Legio
            // Astartes (seule Faction alliable transcrite à l'époque).
            det.factionAlliee = "legio-astartes";
          }
          if (
            typeof brute.legionAlliee === "string" &&
            (brute.legionAlliee === "" ||
              LEGIONS.some(([v]) => v === brute.legionAlliee))
          ) {
            det.legionAlliee = brute.legionAlliee;
          }
          if (
            typeof brute.maisonneeAlliee === "string" &&
            (brute.maisonneeAlliee === "" ||
              MAISONNEES.some(([v]) => v === brute.maisonneeAlliee))
          ) {
            det.maisonneeAlliee = brute.maisonneeAlliee;
          }
          if (
            typeof brute.doctrineCohorteAlliee === "string" &&
            (brute.doctrineCohorteAlliee === "" ||
              DOCTRINES_DE_COHORTE.some(
                ([v]) => v === brute.doctrineCohorteAlliee,
              ))
          ) {
            det.doctrineCohorteAlliee = brute.doctrineCohorteAlliee;
          }
        } else if (type.id === "seigneur-batailles") {
          if (
            typeof brute.maisonneeSeigneurBatailles === "string" &&
            (brute.maisonneeSeigneurBatailles === "" ||
              MAISONNEES.some(([v]) => v === brute.maisonneeSeigneurBatailles))
          ) {
            det.maisonneeSeigneurBatailles = brute.maisonneeSeigneurBatailles;
          }
        }
        // Serments du Moment (Blackshields) : `serments` n'a de sens que
        // pour Principal/Allié. `serimentsRattachesIndex` (indice dans
        // `donnees.detachements`, pas un uid — voir sauvegarderOrga) est
        // conservé tel quel pour l'instant : résolu en uid réel une fois
        // TOUS les Détachements recréés (deuxième passe juste après
        // cette boucle), puisque `etat.detachements` n'est pas encore au
        // complet ici.
        if (
          Array.isArray(brute.serments) &&
          brute.serments.every(
            (id) =>
              typeof id === "string" &&
              SERMENTS_DU_MOMENT.some((s) => s.id === id),
          )
        ) {
          det.serments = [...new Set(brute.serments)];
        }
        if (
          typeof brute.legionPanoplie === "string" &&
          (brute.legionPanoplie === "" ||
            LEGIONS.some(([v]) => v === brute.legionPanoplie))
        ) {
          det.legionPanoplie = brute.legionPanoplie;
        }
        if (
          brute.choixCloneAberrant === "clone" ||
          brute.choixCloneAberrant === "aberrant"
        ) {
          det.choixCloneAberrant = brute.choixCloneAberrant;
        }
        if (Number.isInteger(brute.serimentsRattachesIndex)) {
          det.serimentsRattachesIndexBrut = brute.serimentsRattachesIndex;
        }
        const casesSauvees = Array.isArray(brute.cases) ? brute.cases : [];
        // Détachement `casesLibres` (Détachement Narratif) : contrairement
        // à l'unique case `extra` ci-dessous, on restaure ICI autant de
        // Cases `libre` que sauvegardées (nombre variable, choisi par le
        // joueur) — det.cases est vide au départ (type.cases: []).
        if (type.casesLibres) {
          for (const sauvee of casesSauvees) {
            if (!sauvee || !sauvee.libre) continue;
            det.cases.push({
              role: typeof sauvee.role === "string" ? sauvee.role : null,
              principale: false,
              uniteUid: Number.isInteger(sauvee.uniteUid)
                ? sauvee.uniteUid
                : null,
              avantage: "aucun",
              extra: false,
              libre: true,
            });
          }
        }
        // Case(s) supplémentaire(s) d'un Avantage `ajouteCase` éventuel
        // (Bénéfice Logistique, Le Salaire de la Traîtrise, Agent de
        // Clade — ce dernier en ajoute plusieurs d'un coup, voir
        // `nombreCasesAjoutees`) : restaurées une par une, dans l'ordre
        // où elles ont été sauvegardées (voir sauvegarderOrga, qui les
        // sérialise dans le même ordre que det.cases).
        const extraSauvees = casesSauvees.filter((c) => c && c.extra);
        for (const extraSauvee of extraSauvees) {
          det.cases.push({
            role:
              typeof extraSauvee.role === "string" ? extraSauvee.role : null,
            principale: false,
            uniteUid: null,
            avantage: "aucun",
            extra: true,
            origineAvantage:
              typeof extraSauvee.origineAvantage === "string"
                ? extraSauvee.origineAvantage
                : "benefice-logistique",
          });
        }
        let indiceExtra = 0;
        det.cases.forEach((caseOrga, indice) => {
          const sauvee = caseOrga.extra
            ? extraSauvees[indiceExtra++]
            : casesSauvees[indice];
          if (!sauvee) return;
          if (AVANTAGES_PRINCIPAUX.some((a) => a.id === sauvee.avantage)) {
            caseOrga.avantage =
              caseOrga.principale || caseOrga.extra ? sauvee.avantage : "aucun";
          }
          if (Number.isInteger(sauvee.uniteUid))
            caseOrga.uniteUid = sauvee.uniteUid;
        });
        etat.detachements.push(det);
      }
      // Deuxième passe : résout serimentsRattachesIndexBrut (indice dans
      // le tableau sauvegardé) en un uid réel, maintenant que tous les
      // Détachements existent avec leurs uids définitifs.
      for (const det of etat.detachements) {
        if (!Number.isInteger(det.serimentsRattachesIndexBrut)) continue;
        const cible = etat.detachements[det.serimentsRattachesIndexBrut];
        det.serimentsRattaches = cible ? cible.uid : null;
        delete det.serimentsRattachesIndexBrut;
      }
    } catch {
      /* JSON invalide : on repart de zéro */
    }
  }

  /* Réconciliation après restauration : on retire les références à
     des unités disparues, les doublons, et les placements devenus
     illégaux (données altérées ou fiche d'unité modifiée). */
  function reconcilier() {
    // Rattachement de Serments du Moment (Blackshields) devenu orphelin
    // (Détachement Principal/Allié cible retiré depuis) : retombe sur
    // « aucun rattachement » plutôt que de garder un uid mort.
    for (const det of etat.detachements) {
      if (
        det.serimentsRattaches !== null &&
        !etat.detachements.some((d) => d.uid === det.serimentsRattaches)
      ) {
        det.serimentsRattaches = null;
      }
    }
    const vus = new Set();
    for (const det of etat.detachements) {
      for (const caseOrga of det.cases) {
        if (caseOrga.uniteUid === null) continue;
        const occ = occupant(caseOrga);
        if (
          !occ ||
          vus.has(caseOrga.uniteUid) ||
          !caseAccepte(det, caseOrga, occ.unite)
        ) {
          caseOrga.uniteUid = null;
          caseOrga.avantage = "aucun";
          continue;
        }
        vus.add(caseOrga.uniteUid);
      }
    }
    // Case supplémentaire d'un Avantage `ajouteCase` devenue orpheline
    // (données anciennes/altérées où plus aucune case du détachement
    // ne porte l'Avantage qui l'a créée) : on la retire, comme le fait
    // déjà `liberer` pour les cas normaux.
    for (const det of etat.detachements) {
      // Regroupées par Avantage d'origine (`origineAvantage`) : un
      // Avantage peut ajouter plusieurs cases d'un coup
      // (`nombreCasesAjoutees`, ex : Agent de Clade → 3 Cases
      // d'Appui), retirées ensemble si l'Avantage n'est plus accordé.
      const origines = new Set(
        det.cases
          .filter((c) => c.extra)
          .map((c) => c.origineAvantage || "benefice-logistique"),
      );
      for (const origine of origines) {
        const encoreAccorde = det.cases.some(
          (c) => !c.extra && c.avantage === origine,
        );
        if (encoreAccorde) continue;
        for (let i = det.cases.length - 1; i >= 0; i--) {
          const c = det.cases[i];
          if (
            c.extra &&
            (c.origineAvantage || "benefice-logistique") === origine
          ) {
            det.cases.splice(i, 1);
          }
        }
      }
    }
    // Case(s) manquante(s) pour un Avantage `ajouteCase` toujours
    // accordé mais dont le nombre de cases ajoutées ne correspond plus
    // à `nombreCasesAjoutees` — ex : une Armée sauvegardée avant
    // l'introduction de ce champ pour Agent de Clade n'a encore qu'une
    // seule Case d'Appui au lieu des trois désormais attendues :
    // complétée ici plutôt que de forcer le joueur à désélectionner
    // puis resélectionner l'Avantage.
    for (const det of etat.detachements) {
      for (const c of det.cases) {
        if (c.extra || c.avantage === "aucun") continue;
        const avantage = avantageParId(c.avantage);
        if (!avantage || !avantage.ajouteCase) continue;
        const attendu = avantage.nombreCasesAjoutees || 1;
        const existantes = det.cases.filter(
          (x) =>
            x.extra &&
            (x.origineAvantage || "benefice-logistique") === avantage.id,
        ).length;
        const manquantes = attendu - existantes;
        if (manquantes <= 0) continue;
        const rolesPossibles = avantage.rolesCaseAjoutee;
        const roleFixe =
          rolesPossibles && rolesPossibles.length === 1
            ? rolesPossibles[0]
            : null;
        for (let i = 0; i < manquantes; i++) {
          det.cases.push({
            role: roleFixe,
            principale: false,
            uniteUid: null,
            avantage: "aucun",
            extra: true,
            origineAvantage: avantage.id,
          });
        }
      }
    }
    // Migration d'une liste créée avant l'organigramme : on tente de
    // placer chaque unité non assignée dans une case libre compatible.
    for (const instance of hooks.getArmee()) {
      if (assignationDe(instance.uid)) continue;
      const libres = casesLibresPour(hooks.trouverUnite(instance.uniteId));
      if (libres.length > 0) {
        const det = trouverDetachement(libres[0].detUid);
        det.cases[libres[0].indice].uniteUid = instance.uid;
      }
    }
  }

  /* ----------------------------------------------------------
     RENDU — la fabrique DOM el() (textContent uniquement,
     anti-XSS) est partagée avec js/unites.js : voir js/main.js.
     ---------------------------------------------------------- */

  // Badge circulaire d'un Rôle Tactique (info-bulle = description du
  // livre, p. 285). Les Cases Principales portent la classe
  // orga-badge--principale (liseré étoilé, voir css/style.css).
  function construireBadge(det, caseOrga) {
    const role = ROLES_TACTIQUES[caseOrga.role];
    const principale = estCasePrincipale(det, caseOrga);
    const badge = el(
      "span",
      "orga-badge" + (principale ? " orga-badge--principale" : ""),
      role ? role.abrev : "?",
    );
    badge.tabIndex = 0;
    if (role) {
      badge.appendChild(
        el(
          "span",
          "tooltip",
          role.livre +
            (principale ? " (Case Principale)" : "") +
            " — " +
            role.texte,
        ),
      );
    }
    return badge;
  }

  /* Vide la liste d'armée et remet à zéro les détachements (seul le
     Détachement Principal, obligatoire, est conservé) — après
     confirmation de l'utilisateur si l'Armée ou les détachements
     sélectionnés ne sont pas déjà vides. Retourne true si la
     réinitialisation a eu lieu (ou n'était pas nécessaire), false si
     l'utilisateur a annulé. Partagée par les menus Faction, Légion et
     Rite de Guerre ci-dessous (construireParametres), dont un
     changement rend invalides les unités/détachements propres à
     l'ancienne valeur. */
  function reinitialiserArmeeAvecConfirmation(message) {
    const idPrincipal = idDetachementPrincipal();
    const armeeNonVide = hooks.getArmee().length > 0;
    const detachementsSupp = etat.detachements.some(
      (d) => d.typeId !== idPrincipal,
    );
    if (!armeeNonVide && !detachementsSupp) return true;
    if (!window.confirm(message)) return false;
    if (armeeNonVide) {
      for (const instance of [...hooks.getArmee()])
        hooks.retirerInstance(instance.uid);
    }
    etat.detachements = [creerDetachement(idPrincipal)];
    return true;
  }

  /* Change l'Allégeance de l'Armée : retire (après confirmation) les
     unités dont le Trait « Loyaliste »/« Renégat » (js/unites-data.js)
     devient incompatible. Retourne true si le changement a été
     appliqué, false si l'utilisateur a annulé. Partagée par le menu
     Allégeance et le menu Rite de Guerre ci-dessous (`allegeanceForcee`,
     RITES_DE_GUERRE, js/organigramme-data.js). */
  function appliquerAllegeance(nouvelleAllegeance) {
    if (nouvelleAllegeance === etat.allegeance) return true;
    const traitRequis =
      nouvelleAllegeance === "renegat" ? "Loyaliste" : "Renégat";
    const incompatibles = hooks.getArmee().filter((inst) => {
      const unite = hooks.trouverUnite(inst.uniteId);
      return unite && unite.traits && unite.traits.includes(traitRequis);
    });
    if (incompatibles.length > 0) {
      const noms = incompatibles
        .map((inst) => (hooks.trouverUnite(inst.uniteId) || {}).nom)
        .join(", ");
      if (
        !window.confirm(
          "Changer d'Allégeance retire de la liste les unités " +
            "incompatibles (Trait « " +
            traitRequis +
            " ») : " +
            noms +
            ". Continuer ?",
        )
      ) {
        return false;
      }
      for (const inst of incompatibles) hooks.retirerInstance(inst.uid);
    }
    etat.allegeance = nouvelleAllegeance;
    return true;
  }

  // Paramètres de la partie : Limite de Points + Allégeance.
  function construireParametres(conteneur) {
    conteneur.replaceChildren();
    const ligne = el("div", "orga-parametres");

    // Regroupe un label et son champ dans un même bloc : l'espacement
    // large entre paramètres (`gap` de .orga-parametres) ne s'applique
    // alors qu'entre blocs, pas entre un label et son propre champ.
    function groupeParametre(label, champ) {
      const groupe = el("span", "orga-parametre");
      groupe.appendChild(label);
      groupe.appendChild(champ);
      return groupe;
    }

    const labelLimite = el("label", null, "Limite de points");
    const champLimite = document.createElement("input");
    champLimite.type = "number";
    champLimite.id = "limite-points";
    champLimite.min = "500";
    champLimite.step = "250";
    champLimite.value = String(etat.limite);
    labelLimite.htmlFor = champLimite.id;
    champLimite.addEventListener("change", () => {
      let v = Number(champLimite.value);
      if (!Number.isInteger(v) || v < 500) v = 3000;
      etat.limite = v;
      champLimite.value = String(v);
      actualiser();
    });
    ligne.appendChild(groupeParametre(labelLimite, champLimite));

    // Faction (p. 282) : Legio Astartes et Legio Titanicus sont
    // transcrites, les autres options restent grisées (FACTIONS,
    // ci-dessus).
    const labelFaction = el("label", null, "Faction");
    const selectFaction = document.createElement("select");
    selectFaction.id = "faction-jeu";
    labelFaction.htmlFor = selectFaction.id;
    for (const [valeur, texte, disponible] of FACTIONS) {
      const opt = ajouterOption(selectFaction, valeur, texte);
      opt.disabled = !disponible;
    }
    selectFaction.value = etat.faction;
    selectFaction.addEventListener("change", () => {
      const nouvelleFaction = selectFaction.value;
      if (nouvelleFaction !== etat.faction) {
        // Les unités et le Détachement Principal d'une Faction ne sont
        // pas ceux d'une autre (champ `faction` dans js/unites-data.js,
        // Ordinal Titanique/Détachement Principal de Croisade) : un
        // changement de Faction repart donc d'une liste et d'un
        // organigramme vierges. Appelé AVANT d'écrire etat.faction, pour
        // que reinitialiserArmeeAvecConfirmation compare encore à
        // l'ancien Détachement Principal (et en recrée un du même type,
        // aussitôt remplacé ci-dessous par celui de la nouvelle Faction).
        if (
          !reinitialiserArmeeAvecConfirmation(
            "Changer de Faction réinitialise la liste d'armée et les " +
              "détachements sélectionnés. Continuer ?",
          )
        ) {
          selectFaction.value = etat.faction;
          return;
        }
        etat.faction = nouvelleFaction;
        etat.detachements = [creerDetachement(idDetachementPrincipal())];
        // Légion/Rite de Guerre (Legio Astartes) et Maisonnée
        // (Chevaliers Questoris) n'ont de sens que pour leur propre
        // Faction : ils repartent à zéro, comme la liste d'armée.
        etat.legion = "";
        etat.riteDeGuerre = "";
        etat.maisonnee = "";
        etat.doctrineCohorte = "";
        etat.designationAuxilia = "";
        etat.chartPrincipal = "";
        etat.dominion = "";
        etat.legionsBrisees = [];
        // La Legio Custodes et l'Anathema Psykana n'ont pas de variante
        // Renégate dans leur livre d'armée (toutes leurs unités portent
        // le Trait fixe « Loyaliste », voir js/unites-data.js) : sans ce
        // forçage, une Allégeance Renégate laissée par une Faction
        // précédente masquait silencieusement TOUTES leurs unités dans
        // le sélecteur « Unité à ajouter » (uniteAccessible, js/unites.js).
        if (
          nouvelleFaction === "legio-custodes" ||
          nouvelleFaction === "anathema-psykana"
        ) {
          etat.allegeance = "loyaliste";
        }
        // Symétrique pour les Démons de la Tempête de la Ruine, qui n'ont
        // à l'inverse aucune variante Loyaliste (Trait fixe « Renégat »).
        if (nouvelleFaction === "daemons-ruinstorm") {
          etat.allegeance = "renegat";
        }
      }
      actualiser();
    });
    ligne.appendChild(groupeParametre(labelFaction, selectFaction));

    // Rite de Guerre actif (RITES_DE_GUERRE, js/organigramme-data.js) :
    // certains imposent l'Allégeance de l'Armée (`allegeanceForcee`),
    // ce qui verrouille le menu Allégeance ci-dessous. Calculé même
    // hors Legio Astartes (etat.legion vaut alors toujours "", donc
    // ritesLegion reste vide) : allegeanceForcee doit être défini avant
    // le menu Allégeance plus bas, qui le lit hors du bloc Légion.
    const ritesLegion = RITES_DE_GUERRE[etat.legion] || [];
    const riteActif = ritesLegion.find((r) => r.id === etat.riteDeGuerre);
    const allegeanceForcee = riteActif && riteActif.allegeanceForcee;

    // Légion et Rite de Guerre n'existent que pour Legio Astartes
    // (livre d'armée Legiones Astartes) : entièrement masqués pour
    // toute autre Faction plutôt que simplement grisés/vidés — ils
    // repartent de toute façon à "" au changement de Faction (voir
    // plus haut).
    if (etat.faction === "legio-astartes") {
      const labelLegion = el("label", null, "Légion");
      const selectLegion = document.createElement("select");
      selectLegion.id = "legion-armee";
      labelLegion.htmlFor = selectLegion.id;
      ajouterOption(selectLegion, "", "Choisir Légion");
      for (const [valeur, texte] of LEGIONS) {
        // Une Légion n'est sélectionnable que si des unités lui sont
        // réservées (champ `legion` dans js/unites-data.js) : les
        // autres restent affichées, grisées, en attendant leur
        // transcription depuis le livre d'armée.
        const disponible =
          UNITES.some((u) => u.legion === valeur) &&
          !LEGIONS_INDISPONIBLES.includes(valeur);
        const opt = ajouterOption(
          selectLegion,
          valeur,
          disponible ? texte : texte + " (prochainement)",
        );
        opt.disabled = !disponible;
      }
      selectLegion.value = etat.legion;
      // Le choix d'une Légion se fait désormais via la galerie de
      // portraits de pages/choix-legion.html plutôt que dans la liste
      // déroulante native : un mousedown intercepté empêche le menu de
      // s'ouvrir, et le clic (qui suit toujours le mousedown) redirige
      // vers cette page. Le retour (voir plus bas, lecture du paramètre
      // ?legion= à l'initialisation) pré-remplit ce même menu.
      selectLegion.addEventListener("mousedown", (e) => {
        e.preventDefault();
      });
      selectLegion.addEventListener("click", () => {
        window.location.href = "choix-legion.html";
      });
      selectLegion.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          window.location.href = "choix-legion.html";
        }
      });
      selectLegion.addEventListener("change", () => {
        const nouvelleLegion = selectLegion.value;
        if (nouvelleLegion !== etat.legion) {
          // Les unités et Détachements Auxiliaires/d'Apex d'une Légion
          // ne sont généralement pas ceux d'une autre (champ `legion`
          // dans js/unites-data.js) : un changement de Légion repart
          // donc d'une liste et d'un organigramme vierges (seul le
          // Détachement Principal, obligatoire, est conservé).
          if (
            !reinitialiserArmeeAvecConfirmation(
              "Changer de Légion réinitialise la liste d'armée et les " +
                "détachements sélectionnés. Continuer ?",
            )
          ) {
            selectLegion.value = etat.legion;
            return;
          }
          // Le Rite de Guerre (RITES_DE_GUERRE) est propre à chaque
          // Légion : il repart lui aussi à zéro, à rechoisir dans le
          // menu ci-dessous s'il en existe un pour la nouvelle Légion.
          etat.riteDeGuerre = "";
        }
        etat.legion = nouvelleLegion;
        // Allégeance par défaut selon la Légion choisie (Loyaliste ou
        // Légion Renégate) : purement indicative, le joueur reste
        // libre de la changer ensuite via le menu Allégeance ci-contre.
        const skinChoisi = SKINS_LEGION[etat.legion];
        if (skinChoisi) etat.allegeance = skinChoisi.allegeance;
        actualiser();
      });
      ligne.appendChild(groupeParametre(labelLegion, selectLegion));

      // Rite de Guerre (livre d'armée Legiones Astartes) : menu
      // affiché uniquement pour une Légion présente dans
      // RITES_DE_GUERRE (js/organigramme-data.js). Conditionne
      // l'accès à certains Détachements (`requiertRiteDeGuerre`) et
      // peut verrouiller l'Allégeance ci-dessus (`allegeanceForcee`,
      // voir riteActif plus haut).
      if (ritesLegion.length > 0) {
        const labelRite = el("label", null, "Rite de Guerre");
        const selectRite = document.createElement("select");
        selectRite.id = "rite-de-guerre-armee";
        labelRite.htmlFor = selectRite.id;
        ajouterOption(selectRite, "", "Choisir un Rite de Guerre");
        for (const rite of ritesLegion) {
          ajouterOption(selectRite, rite.id, rite.nom);
        }
        selectRite.value = etat.riteDeGuerre;
        selectRite.addEventListener("change", () => {
          const nouveauRite = selectRite.value;
          if (nouveauRite !== etat.riteDeGuerre) {
            // Un Détachement réservé à un Rite de Guerre
            // (`requiertRiteDeGuerre`) devient invalide dès qu'on
            // change de Rite (ex : Escadre de Primauté/Confrérie du
            // Phénix, Cadre de Berserkers/Fils de Bodt) : comme un
            // changement de Légion, on repart d'une liste et d'un
            // organigramme vierges (seul le Détachement Principal,
            // obligatoire, est conservé).
            if (
              !reinitialiserArmeeAvecConfirmation(
                "Changer de Rite de Guerre réinitialise la liste d'armée et " +
                  "les détachements sélectionnés. Continuer ?",
              )
            ) {
              selectRite.value = etat.riteDeGuerre;
              return;
            }
          }
          const nouveauRiteInfo = ritesLegion.find((r) => r.id === nouveauRite);
          if (
            nouveauRiteInfo &&
            nouveauRiteInfo.allegeanceForcee &&
            !appliquerAllegeance(nouveauRiteInfo.allegeanceForcee)
          ) {
            selectRite.value = etat.riteDeGuerre;
            return;
          }
          etat.riteDeGuerre = nouveauRite;
          actualiser();
        });
        ligne.appendChild(groupeParametre(labelRite, selectRite));
      }
    } else if (etat.faction === "chevaliers-questoris") {
      // Maisonnée (livre d'armée Chevaliers Questoris) : remplace le
      // menu Légion pour cette Faction (MAISONNEES ci-dessus). Aucune
      // unité n'étant encore transcrite pour Chevaliers Questoris, ce
      // menu pose seulement le skin/état — l'organigramme reste vide
      // d'unités proposables quelle que soit la Maisonnée choisie.
      const labelMaisonnee = el("label", null, "Maisonnée");
      const selectMaisonnee = document.createElement("select");
      selectMaisonnee.id = "maisonnee-armee";
      labelMaisonnee.htmlFor = selectMaisonnee.id;
      ajouterOption(selectMaisonnee, "", "Choisir Maisonnée");
      for (const [valeur, texte] of MAISONNEES) {
        ajouterOption(selectMaisonnee, valeur, texte);
      }
      selectMaisonnee.value = etat.maisonnee;
      selectMaisonnee.addEventListener("change", () => {
        const nouvelleMaisonnee = selectMaisonnee.value;
        if (nouvelleMaisonnee !== etat.maisonnee) {
          if (
            !reinitialiserArmeeAvecConfirmation(
              "Changer de Maisonnée réinitialise la liste d'armée et les " +
                "détachements sélectionnés. Continuer ?",
            )
          ) {
            selectMaisonnee.value = etat.maisonnee;
            return;
          }
        }
        etat.maisonnee = nouvelleMaisonnee;
        actualiser();
      });
      ligne.appendChild(groupeParametre(labelMaisonnee, selectMaisonnee));
    } else if (etat.faction === "daemons-ruinstorm") {
      // Dominion Éthérique (Liber Ruinstorm p. 3-6) : un seul choix pour
      // toute l'Armée (voir DOMINIONS_ETHERIQUES ci-dessus), pas de
      // confirmation de réinitialisation au changement — contrairement à
      // la Faction/Légion/Maisonnée, ce choix ne change jamais quelles
      // Unités sont accessibles, seulement le Trait affiché sur leur
      // fiche (voir dominionEtheriqueDe, js/unites.js).
      const labelDominion = el("label", null, "Dominion Éthérique");
      const selectDominion = document.createElement("select");
      selectDominion.id = "dominion-armee";
      labelDominion.htmlFor = selectDominion.id;
      ajouterOption(selectDominion, "", "Choisir un Dominion Éthérique");
      for (const nom of DOMINIONS_ETHERIQUES) {
        ajouterOption(selectDominion, nom, nom);
      }
      selectDominion.value = etat.dominion;
      selectDominion.addEventListener("change", () => {
        etat.dominion = selectDominion.value;
        actualiser();
      });
      ligne.appendChild(groupeParametre(labelDominion, selectDominion));
    } else if (etat.faction === "legions-brisees") {
      // Légions Brisées (Legacies of the Age of Darkness : The
      // Shattered Legions, p. 2) : remplace le menu Légion unique de
      // Legio Astartes (etat.legion reste vide pour cette Faction) —
      // le livre impose de choisir 2 OU 3 Légions pour toute l'Armée.
      // Une Unité réservée à une Légion (`unite.legion`,
      // js/unites-data.js) devient accessible dès que sa Légion figure
      // parmi celles cochées ici (voir legionsBriseesActuelles
      // ci-dessous et uniteAccessible, js/unites.js).
      const labelLegions = el("label", null, "Légions choisies (2 ou 3)");
      const groupeLegions = el("span", "orga-legions-brisees");
      groupeLegions.setAttribute("role", "group");
      groupeLegions.setAttribute("aria-label", "Légions choisies (2 ou 3)");
      for (const [valeur, texte] of LEGIONS) {
        const idCase = "legion-brisee-" + valeur;
        const caseACocher = document.createElement("input");
        caseACocher.type = "checkbox";
        caseACocher.id = idCase;
        const dejaChoisie = etat.legionsBrisees.includes(valeur);
        caseACocher.checked = dejaChoisie;
        // Une 4e Légion ne peut pas être cochée tant que 3 sont déjà
        // choisies (règle du livre : 2 OU 3, jamais plus) — grisée
        // plutôt que refusée silencieusement au clic.
        caseACocher.disabled = !dejaChoisie && etat.legionsBrisees.length >= 3;
        caseACocher.addEventListener("change", () => {
          const cocheeAvant = etat.legionsBrisees.includes(valeur);
          if (caseACocher.checked === cocheeAvant) return;
          if (
            !reinitialiserArmeeAvecConfirmation(
              "Changer les Légions choisies réinitialise la liste " +
                "d'armée et les détachements sélectionnés. Continuer ?",
            )
          ) {
            caseACocher.checked = cocheeAvant;
            return;
          }
          etat.legionsBrisees = caseACocher.checked
            ? [...etat.legionsBrisees, valeur]
            : etat.legionsBrisees.filter((v) => v !== valeur);
          actualiser();
        });
        const etiquette = el("label", "orga-legions-brisees-item");
        etiquette.htmlFor = idCase;
        etiquette.appendChild(caseACocher);
        etiquette.appendChild(document.createTextNode(" " + texte));
        groupeLegions.appendChild(etiquette);
      }
      ligne.appendChild(groupeParametre(labelLegions, groupeLegions));
      if (etat.legionsBrisees.length < 2) {
        ligne.appendChild(
          el(
            "p",
            "orga-legions-brisees-avertissement",
            "Choisis 2 ou 3 Légions pour débloquer les Unités " +
              "réservées à une Légion.",
          ),
        );
      }
    } else if (etat.faction === "solar-auxilia") {
      // Doctrine de Cohorte (livre d'armée Solar Auxilia, Liber
      // Auxilia p. 11-16) : un unique choix par Armée, obligatoire
      // avant de pouvoir ajouter des Unités (voir le verrou dans
      // actualiserVerrouLegion, js/unites.js). Aucune Unité n'est
      // réservée à une Doctrine précise, mais un changement réinitialise
      // quand même l'Armée (comme Légion/Maisonnée/Rite de Guerre
      // ci-dessus), sur demande explicite du proprio. Son texte de
      // Règle Spéciale (Tactica de Cohorte + Détachements Additionnels)
      // est documenté dans js/regles-data.js plutôt que reproduit ici.
      const labelDoctrine = el("label", null, "Doctrine de Cohorte");
      const selectDoctrine = document.createElement("select");
      selectDoctrine.id = "doctrine-cohorte-armee";
      labelDoctrine.htmlFor = selectDoctrine.id;
      ajouterOption(selectDoctrine, "", "Choisir Doctrine de Cohorte");
      for (const [valeur, texte] of DOCTRINES_DE_COHORTE) {
        ajouterOption(selectDoctrine, valeur, texte);
      }
      selectDoctrine.value = etat.doctrineCohorte;
      selectDoctrine.addEventListener("change", () => {
        const nouvelleDoctrine = selectDoctrine.value;
        if (nouvelleDoctrine !== etat.doctrineCohorte) {
          if (
            !reinitialiserArmeeAvecConfirmation(
              "Changer de Doctrine de Cohorte réinitialise la liste " +
                "d'armée et les détachements sélectionnés. Continuer ?",
            )
          ) {
            selectDoctrine.value = etat.doctrineCohorte;
            return;
          }
        }
        etat.doctrineCohorte = nouvelleDoctrine;
        actualiser();
      });
      ligne.appendChild(groupeParametre(labelDoctrine, selectDoctrine));

      // Désignation de Legiones Auxilia (livre Legiones Auxilia intégré
      // au Liber Auxilia, p. 50-84) : contrairement à la Doctrine de
      // Cohorte ci-dessus, un choix facultatif — pas de verrou d'ajout
      // d'Unité dans actualiserVerrouLegion (js/unites.js) s'il reste
      // vide. Utilisé pour la page de garde du PDF/Word (voir
      // contenuDesignationAuxiliaActuelle, js/unites.js) ; voir la note
      // sur DESIGNATIONS_LEGIONES_AUXILIA (js/organigramme-data.js) pour
      // la restriction de composition du Détachement Principal non
      // vérifiée automatiquement ici.
      const labelDesignation = el(
        "label",
        null,
        "Désignation de Legiones Auxilia",
      );
      const selectDesignation = document.createElement("select");
      selectDesignation.id = "designation-auxilia-armee";
      labelDesignation.htmlFor = selectDesignation.id;
      ajouterOption(
        selectDesignation,
        "",
        "Aucune Désignation de Legiones Auxilia",
      );
      for (const designation of DESIGNATIONS_LEGIONES_AUXILIA) {
        ajouterOption(
          selectDesignation,
          designation.id,
          designation.nom + " (" + designation.legionNom + ")",
        );
      }
      selectDesignation.value = etat.designationAuxilia;
      selectDesignation.addEventListener("change", () => {
        etat.designationAuxilia = selectDesignation.value;
        actualiser();
      });
      ligne.appendChild(groupeParametre(labelDesignation, selectDesignation));
    } else if (etat.faction === "mechanicum") {
      // Techno-arcane Majeur (Liber Mechanicum p. 13/45-51) : un unique
      // choix par Armée, obligatoire avant de pouvoir ajouter des Unités
      // génériques Mechanicum (voir le verrou dans uniteAccessible,
      // js/unites.js) — même principe que legionActuelle() pour Legio
      // Astartes. Les Unités propres à un Techno-arcane fixe restent
      // accessibles seulement si ce Techno-arcane est sélectionné (voir
      // uniteAccessible, js/unites.js). Un changement réinitialise
      // l'Armée (comme Légion/Maisonnée/Rite de Guerre ci-dessus).
      const labelTechnoArcane = el("label", null, "Techno-arcane Majeur");
      const selectTechnoArcane = document.createElement("select");
      selectTechnoArcane.id = "techno-arcane-armee";
      labelTechnoArcane.htmlFor = selectTechnoArcane.id;
      ajouterOption(selectTechnoArcane, "", "Choisir Techno-arcane Majeur");
      for (const [valeur, texte] of TECHNO_ARCANES) {
        ajouterOption(selectTechnoArcane, valeur, texte);
      }
      selectTechnoArcane.value = etat.technoArcane;
      selectTechnoArcane.addEventListener("change", () => {
        const nouveauTechnoArcane = selectTechnoArcane.value;
        if (nouveauTechnoArcane !== etat.technoArcane) {
          if (
            !reinitialiserArmeeAvecConfirmation(
              "Changer de Techno-arcane Majeur réinitialise la liste " +
                "d'armée et les détachements sélectionnés. Continuer ?",
            )
          ) {
            selectTechnoArcane.value = etat.technoArcane;
            return;
          }
        }
        etat.technoArcane = nouveauTechnoArcane;
        actualiser();
      });
      ligne.appendChild(groupeParametre(labelTechnoArcane, selectTechnoArcane));

      // Note : Option d'Arcane et Bénéfice d'Arcane sont appliqués
      // automatiquement selon le Techno-arcane choisi (voir
      // optionArcaneActuel() et beneficeArcaneActuel() ci-dessous,
      // consommés par reglesFinales dans js/unites.js). Aucun menu de
      // sélection d'Option d'Arcane ici — le joueur ne choisit que le
      // Techno-arcane, tout le reste suit automatiquement.
    }

    // Choix de Détachement Principal (Journal Tactica : Zone Mortalis,
    // p. 285) : alternatives facultatives au Détachement Principal de
    // Croisade standard, sans condition de mission (non modélisée sur
    // ce site — voir TYPES_DETACHEMENTS, js/organigramme-data.js).
    // Proposé pour toute Faction SAUF Legio Titanicus (dont le
    // Détachement Principal Ordinal Titanique est propre à sa Liste
    // d'Armée et n'a pas de sens à remplacer) — y compris Chevaliers
    // Questoris, dont le choix prend alors le pas sur le Détachement
    // Principal de Maisonnées habituel (voir idDetachementPrincipal()).
    // Un changement remplace le Détachement Principal comme un
    // changement de Légion/Rite de Guerre ci-dessus.
    if (etat.faction !== "legio-titanicus") {
      const chartsPrincipaux = TYPES_DETACHEMENTS.filter(
        (t) => t.famille === "principal" && t.id !== "principal" && !t.faction,
      );
      if (chartsPrincipaux.length > 0) {
        const labelChart = el("label", null, "Choix de Détachement Principal");
        const selectChart = document.createElement("select");
        selectChart.id = "chart-principal-armee";
        labelChart.htmlFor = selectChart.id;
        ajouterOption(selectChart, "", "Détachement Principal de Croisade");
        for (const chart of chartsPrincipaux) {
          ajouterOption(selectChart, chart.id, chart.nom);
        }
        selectChart.value = etat.chartPrincipal;
        selectChart.addEventListener("change", () => {
          const nouveauChart = selectChart.value;
          if (nouveauChart !== etat.chartPrincipal) {
            if (
              !reinitialiserArmeeAvecConfirmation(
                "Changer de Choix de Détachement Principal réinitialise la " +
                  "liste d'armée et les détachements sélectionnés. Continuer ?",
              )
            ) {
              selectChart.value = etat.chartPrincipal;
              return;
            }
            // reinitialiserArmeeAvecConfirmation() vient de recréer le
            // Détachement Principal avec l'ANCIEN chartPrincipal (lu via
            // idDetachementPrincipal() avant la ligne suivante) : il faut
            // le reconstruire une seconde fois une fois le nouveau choix
            // affecté, sans quoi le Détachement affiché resterait celui
            // d'avant le changement.
            etat.chartPrincipal = nouveauChart;
            etat.detachements = [creerDetachement(idDetachementPrincipal())];
          }
          actualiser();
        });
        ligne.appendChild(groupeParametre(labelChart, selectChart));
      }
    }

    const labelAllegeance = el("label", null, "Allégeance");
    const selectAllegeance = document.createElement("select");
    selectAllegeance.id = "allegeance-armee";
    labelAllegeance.htmlFor = selectAllegeance.id;
    for (const [valeur, texte] of [
      ["loyaliste", "Loyaliste"],
      ["renegat", "Renégat"],
    ]) {
      ajouterOption(selectAllegeance, valeur, texte);
    }
    // La Legio Custodes et l'Anathema Psykana n'ont pas de variante
    // Renégate dans leur livre d'armée : verrouillées sur Loyaliste,
    // comme une Allégeance forcée par un Rite de Guerre (voir le
    // forçage au changement de Faction ci-dessus).
    const allegeanceForceeCustodes =
      etat.faction === "legio-custodes" || etat.faction === "anathema-psykana";
    // Les Démons de la Tempête de la Ruine sont le miroir inverse : verrouillés
    // sur Renégat, aucune variante Loyaliste dans leur livre d'armée.
    const allegeanceForceeRuinstorm = etat.faction === "daemons-ruinstorm";
    selectAllegeance.value = etat.allegeance;
    selectAllegeance.disabled =
      Boolean(allegeanceForcee) ||
      allegeanceForceeCustodes ||
      allegeanceForceeRuinstorm;
    if (allegeanceForcee) {
      selectAllegeance.title =
        "Allégeance imposée par le Rite de Guerre « " + riteActif.nom + " ».";
    } else if (allegeanceForceeCustodes) {
      selectAllegeance.title =
        etat.faction === "anathema-psykana"
          ? "L'Anathema Psykana ne compte aucune unité Renégate."
          : "La Legio Custodes ne compte aucune unité Renégate.";
    } else if (allegeanceForceeRuinstorm) {
      selectAllegeance.title =
        "Les Démons de la Tempête de la Ruine ne comptent aucune unité Loyaliste.";
    }
    selectAllegeance.addEventListener("change", () => {
      const nouvelleAllegeance = selectAllegeance.value;
      if (!appliquerAllegeance(nouvelleAllegeance)) {
        selectAllegeance.value = etat.allegeance;
        return;
      }
      actualiser();
    });
    ligne.appendChild(groupeParametre(labelAllegeance, selectAllegeance));

    conteneur.appendChild(ligne);

    // Skin thématique : recolore tout le site (variables CSS), pose le
    // blason (sprite <symbol> de pages/construction-liste.html) sur le titre de
    // page et ajoute un bandeau de contexte historique sous les
    // paramètres. Legio Titanicus (SKIN_TITANICUS) suit la Faction
    // plutôt qu'une Légion précise (pas de subdivision en Légions
    // Titanicus dans ce site) : skinLegion prime si les deux étaient
    // renseignés (cas impossible aujourd'hui, etat.legion restant vide
    // pour cette Faction).
    for (const info of Object.values(SKINS_LEGION)) {
      document.body.classList.remove(info.classe);
    }
    document.body.classList.remove(SKIN_TITANICUS.classe);
    for (const info of Object.values(SKINS_MAISONNEE)) {
      document.body.classList.remove(info.classe);
    }
    document.body.classList.remove(SKIN_MECHANICUM.classe);
    document.body.classList.remove(SKIN_LEGIO_CUSTODES.classe);
    document.body.classList.remove(SKIN_ANATHEMA_PSYKANA.classe);
    document.body.classList.remove(SKIN_SKITARII.classe);
    document.body.classList.remove(SKIN_DAEMONS_RUINSTORM.classe);
    document.body.classList.remove(SKIN_LEGIONS_BRISEES.classe);
    document.body.classList.remove(SKIN_BLACKSHIELDS.classe);
    for (const info of Object.values(SKINS_DESIGNATION_AUXILIA)) {
      document.body.classList.remove(info.classe);
    }
    const skinLegion = SKINS_LEGION[etat.legion];
    activerBandeauMagnus(etat.legion === "XV");
    const skinTitan =
      etat.faction === "legio-titanicus" ? SKIN_TITANICUS : null;
    const skinMaison = SKINS_MAISONNEE[etat.maisonnee] || null;
    const skinMechanicum =
      etat.faction === "mechanicum" ? SKIN_MECHANICUM : null;
    const skinLegioCustodes =
      etat.faction === "legio-custodes" ? SKIN_LEGIO_CUSTODES : null;
    const skinAnathemaPsykana =
      etat.faction === "anathema-psykana" ? SKIN_ANATHEMA_PSYKANA : null;
    const skinSkitarii = etat.faction === "skitarii" ? SKIN_SKITARII : null;
    const skinRuinstorm =
      etat.faction === "daemons-ruinstorm" ? SKIN_DAEMONS_RUINSTORM : null;
    const skinLegionsBrisees =
      etat.faction === "legions-brisees" ? SKIN_LEGIONS_BRISEES : null;
    const skinBlackshields =
      etat.faction === "blackshields" ? SKIN_BLACKSHIELDS : null;
    const skinDesignation =
      SKINS_DESIGNATION_AUXILIA[etat.designationAuxilia] || null;
    const titre = document.querySelector("h1.titre-page");
    if (titre) {
      // querySelectorAll (pas querySelector) : Legio Titanicus pose DEUX
      // blasons sur le titre (gauche + droite ci-dessous), contre un
      // seul pour une Légion Astartes — il faut retirer les deux au
      // changement de Faction/Légion, pas juste le premier trouvé.
      // Mechanicum (SKIN_MECHANICUM) pose DEUX blasons comme Legio
      // Titanicus (gauche + droite). Désignations de Legiones Auxilia
      // (skinDesignation) posent un seul blason à gauche, comme une
      // Légion Astartes ou une Maisonnée Questoris.
      titre.querySelectorAll(".legion-icon").forEach((icone) => icone.remove());
      if (skinLegion) {
        titre.insertBefore(
          creerIconeLegion(skinLegion, "legion-icon--titre"),
          titre.firstChild,
        );
      } else if (skinTitan) {
        titre.insertBefore(
          creerIconeTitan(skinTitan.blasons[0], "legion-icon--titre"),
          titre.firstChild,
        );
        titre.appendChild(
          creerIconeTitan(
            skinTitan.blasons[1],
            "legion-icon--titre legion-icon--titre-droite",
          ),
        );
      } else if (skinMaison) {
        titre.insertBefore(
          creerIconeMaisonnee(skinMaison, "legion-icon--titre"),
          titre.firstChild,
        );
      } else if (skinMechanicum) {
        titre.insertBefore(
          creerIconeMechanicum(skinMechanicum.blasons[0], "legion-icon--titre"),
          titre.firstChild,
        );
        titre.appendChild(
          creerIconeMechanicum(
            skinMechanicum.blasons[1],
            "legion-icon--titre legion-icon--titre-droite",
          ),
        );
      } else if (skinDesignation) {
        titre.insertBefore(
          creerIconeDesignationAuxilia(skinDesignation, "legion-icon--titre"),
          titre.firstChild,
        );
      }
    }
    if (skinLegion) {
      document.body.classList.add(skinLegion.classe);
      const banniere = el("p", "legion-banniere");
      const entete = el("strong", "legion-item");
      entete.appendChild(creerIconeLegion(skinLegion));
      entete.appendChild(
        document.createTextNode(etat.legion + " – " + skinLegion.nom),
      );
      banniere.appendChild(entete);
      banniere.appendChild(
        document.createTextNode(
          " · Primarque : " +
            skinLegion.primarque +
            " · Monde natal : " +
            skinLegion.monde,
        ),
      );
      if (skinLegion.devise)
        banniere.appendChild(el("em", null, skinLegion.devise));
      conteneur.appendChild(banniere);
    } else if (skinTitan) {
      document.body.classList.add(skinTitan.classe);
      const banniere = el("p", "legion-banniere");
      const entete = el("strong", "legion-item");
      entete.appendChild(creerIconeTitan(skinTitan.blasons[0]));
      entete.appendChild(document.createTextNode(skinTitan.nom));
      // Second blason Legio Titanicus (assets/logo_titan/2.png), à la
      // suite du nom — purement ornemental, comme le premier blason
      // ci-dessus (aria-hidden), remplace l'ancien rouage Mechanicum
      // en texte (⚙).
      entete.appendChild(
        creerIconeTitan(skinTitan.blasons[1], "legion-titan-cog"),
      );
      banniere.appendChild(entete);
      if (skinTitan.devise)
        banniere.appendChild(el("em", null, skinTitan.devise));
      conteneur.appendChild(banniere);
    } else if (skinMaison) {
      document.body.classList.add(skinMaison.classe);
      const banniere = el("p", "legion-banniere");
      const entete = el("strong", "legion-item");
      entete.appendChild(creerIconeMaisonnee(skinMaison));
      entete.appendChild(document.createTextNode(skinMaison.nom));
      banniere.appendChild(entete);
      if (skinMaison.devise)
        banniere.appendChild(el("em", null, skinMaison.devise));
      conteneur.appendChild(banniere);
    } else if (skinMechanicum) {
      // Deux blasons comme Legio Titanicus ci-dessus (assets/
      // logo_mechanicum/1.png et 2.png).
      document.body.classList.add(skinMechanicum.classe);
      const banniere = el("p", "legion-banniere");
      const entete = el("strong", "legion-item");
      entete.appendChild(creerIconeMechanicum(skinMechanicum.blasons[0]));
      entete.appendChild(document.createTextNode(skinMechanicum.nom));
      entete.appendChild(
        creerIconeMechanicum(skinMechanicum.blasons[1], "legion-titan-cog"),
      );
      banniere.appendChild(entete);
      if (skinMechanicum.devise)
        banniere.appendChild(el("em", null, skinMechanicum.devise));
      conteneur.appendChild(banniere);
    } else if (skinLegioCustodes) {
      // Skin couleurs seules, sans blason (voir SKIN_LEGIO_CUSTODES).
      document.body.classList.add(skinLegioCustodes.classe);
      const banniere = el("p", "legion-banniere");
      const entete = el("strong", "legion-item", skinLegioCustodes.nom);
      banniere.appendChild(entete);
      if (skinLegioCustodes.devise)
        banniere.appendChild(el("em", null, skinLegioCustodes.devise));
      conteneur.appendChild(banniere);
    } else if (skinAnathemaPsykana) {
      // Skin couleurs seules, sans blason (voir SKIN_ANATHEMA_PSYKANA).
      document.body.classList.add(skinAnathemaPsykana.classe);
      const banniere = el("p", "legion-banniere");
      const entete = el("strong", "legion-item", skinAnathemaPsykana.nom);
      banniere.appendChild(entete);
      if (skinAnathemaPsykana.devise)
        banniere.appendChild(el("em", null, skinAnathemaPsykana.devise));
      conteneur.appendChild(banniere);
    } else if (skinSkitarii) {
      // Skin couleurs seules, sans blason (voir SKIN_SKITARII).
      document.body.classList.add(skinSkitarii.classe);
      const banniere = el("p", "legion-banniere");
      const entete = el("strong", "legion-item", skinSkitarii.nom);
      banniere.appendChild(entete);
      if (skinSkitarii.devise)
        banniere.appendChild(el("em", null, skinSkitarii.devise));
      conteneur.appendChild(banniere);
    } else if (skinRuinstorm) {
      // Skin couleurs seules, sans blason (voir SKIN_DAEMONS_RUINSTORM).
      document.body.classList.add(skinRuinstorm.classe);
      const banniere = el("p", "legion-banniere");
      const entete = el("strong", "legion-item", skinRuinstorm.nom);
      banniere.appendChild(entete);
      if (skinRuinstorm.devise)
        banniere.appendChild(el("em", null, skinRuinstorm.devise));
      conteneur.appendChild(banniere);
    } else if (skinLegionsBrisees) {
      // Skin couleurs seules, sans blason (voir SKIN_LEGIONS_BRISEES).
      document.body.classList.add(skinLegionsBrisees.classe);
      const banniere = el("p", "legion-banniere");
      const entete = el("strong", "legion-item", skinLegionsBrisees.nom);
      banniere.appendChild(entete);
      if (skinLegionsBrisees.devise)
        banniere.appendChild(el("em", null, skinLegionsBrisees.devise));
      conteneur.appendChild(banniere);
    } else if (skinBlackshields) {
      // Skin couleurs seules, sans blason (voir SKIN_BLACKSHIELDS).
      document.body.classList.add(skinBlackshields.classe);
      const banniere = el("p", "legion-banniere");
      const entete = el("strong", "legion-item", skinBlackshields.nom);
      banniere.appendChild(entete);
      if (skinBlackshields.devise)
        banniere.appendChild(el("em", null, skinBlackshields.devise));
      conteneur.appendChild(banniere);
    } else if (skinDesignation) {
      document.body.classList.add(skinDesignation.classe);
      const banniere = el("p", "legion-banniere");
      const entete = el("strong", "legion-item");
      entete.appendChild(creerIconeDesignationAuxilia(skinDesignation));
      entete.appendChild(
        document.createTextNode(
          skinDesignation.nom + " (" + skinDesignation.legionNom + ")",
        ),
      );
      banniere.appendChild(entete);
      if (skinDesignation.devise)
        banniere.appendChild(el("em", null, skinDesignation.devise));
      conteneur.appendChild(banniere);
    }
  }

  /* Barre de points + compteurs + erreurs (aria-live : les lecteurs
     d'écran annoncent les violations de règles en temps réel). */
  function construireBarre(conteneur) {
    conteneur.replaceChildren();
    const total = coutTotalArmee();
    const credits = calculerCredits();
    const erreurs = validerArmee(credits);

    const texte = el(
      "p",
      "orga-total",
      total +
        " / " +
        etat.limite +
        " pts — Auxiliaires disponibles : " +
        Math.max(0, credits.auxRestants) +
        " · Apex disponibles : " +
        Math.max(0, credits.apexRestants) +
        " · Quota Seigneur de Guerre + Seigneurs des Batailles : " +
        (idDetachementPrincipal() === "ordinal-titanique"
          ? coutSeigneurs() + " pts (ignoré — Ordinal Titanique)"
          : idDetachementPrincipal() === "maisonnees-chevaliers"
            ? coutSeigneurs() + " pts (ignoré — Maisonnées de Chevaliers)"
            : coutSeigneurs() +
              " / " +
              Math.ceil(etat.limite * 0.25) +
              " pts (25 %)"),
    );
    conteneur.appendChild(texte);

    // Barre de progression (alerte visuelle en cas de dépassement).
    const barre = el("div", "orga-jauge");
    barre.setAttribute("role", "progressbar");
    barre.setAttribute("aria-valuemin", "0");
    barre.setAttribute("aria-valuemax", String(etat.limite));
    barre.setAttribute("aria-valuenow", String(total));
    barre.setAttribute("aria-label", "Points utilisés");
    const remplissage = el(
      "div",
      "orga-jauge-remplissage" +
        (total > etat.limite ? " orga-jauge--depassement" : ""),
    );
    remplissage.style.width = Math.min(100, (total / etat.limite) * 100) + "%";
    barre.appendChild(remplissage);
    conteneur.appendChild(barre);

    if (erreurs.length > 0) {
      const bloc = el("div", "orga-erreurs");
      bloc.appendChild(
        el("p", "orga-erreurs-titre", "Règles non respectées :"),
      );
      const liste = document.createElement("ul");
      for (const e of erreurs) liste.appendChild(el("li", null, e));
      bloc.appendChild(liste);
      conteneur.appendChild(bloc);
    } else if (hooks.getArmee().length > 0) {
      conteneur.appendChild(
        el(
          "p",
          "orga-valide",
          "✔ La liste respecte les règles de Sélection d'Armée.",
        ),
      );
    }
  }

  /* Menu « Faction Alliée » d'une carte de Détachement Allié, affiché
     pour toute Armée (peu importe sa propre Faction). Une Faction
     alliée identique à celle du Détachement Principal reste
     sélectionnable quand cette Faction a une subdivision interne dans
     ce fichier (FACTIONS_AVEC_SOUS_IDENTITE : Légion pour Legio
     Astartes, Maisonnée pour Chevaliers Questoris, Doctrine de Cohorte
     pour Solar Auxilia) — la contrainte réelle « Faction Alliée doit
     différer de celle du Détachement Principal » (p. 283, « Chaque
     Légion Astartes comptant comme une Faction distincte ») se joue
     alors sur le sous-menu correspondant (construireSelectLegionAlliee/
     MaisonneeAlliee/DoctrineAlliee ci-dessous). Pour les autres
     Factions (Legio Titanicus, Mechanicum, sans subdivision ici), la
     Faction de l'Armée elle-même reste exclue. Changer la sélection
     retire toutes les unités déjà placées dans ce Détachement (leur
     Faction ne correspondrait plus forcément à la nouvelle). */
  function construireSelectFactionAlliee(det) {
    const ligne = el("p", "orga-detachement-faction");
    const label = el("label", null, "Faction Alliée ");
    const select = document.createElement("select");
    select.setAttribute("aria-label", "Faction du Détachement Allié");
    ajouterOption(select, "", "— Choisir la Faction Alliée —");
    for (const [valeur, texte, disponible] of FACTIONS) {
      const identique = valeur === etat.faction;
      const exclue = identique && !FACTIONS_AVEC_SOUS_IDENTITE.includes(valeur);
      const dispo = disponible && !exclue;
      const opt = ajouterOption(
        select,
        valeur,
        texte +
          (exclue
            ? " (Faction du Détachement Principal)"
            : disponible
              ? ""
              : " (prochainement)"),
      );
      opt.disabled = !dispo;
    }
    select.value = det.factionAlliee || "";
    select.addEventListener("change", () => {
      const nouvelle = select.value;
      if (nouvelle === det.factionAlliee) return;
      const casesConcernees = det.cases.filter((c) => c.uniteUid !== null);
      if (
        casesConcernees.length > 0 &&
        !window.confirm(
          "Changer la Faction Alliée retire " +
            casesConcernees.length +
            " unité(s) de ce Détachement. Continuer ?",
        )
      ) {
        select.value = det.factionAlliee || "";
        return;
      }
      for (const c of casesConcernees) {
        const uid = c.uniteUid;
        liberer(uid);
        hooks.retirerInstance(uid);
      }
      det.factionAlliee = nouvelle;
      // Les trois sous-identités sont mutuellement exclusives selon la
      // Faction Alliée choisie (une seule a un sens à la fois) :
      // réinitialisées ensemble pour ne pas garder une Légion/Maisonnée/
      // Doctrine orpheline d'une Faction Alliée précédente.
      det.legionAlliee = "";
      det.maisonneeAlliee = "";
      det.doctrineCohorteAlliee = "";
      actualiser();
    });
    label.appendChild(select);
    ligne.appendChild(label);
    return ligne;
  }

  /* Applique un changement de Légion Alliée sur `det` : retire les
     unités désormais réservées à une autre Légion, nettoie les
     Avantages d'Arsenal devenus invalides (Trait requis qui ne
     correspond plus), et met à jour det.legionAlliee. Factorisé pour
     être partagé par le menu déroulant ci-dessous (confirmation
     demandée à l'utilisateur si des unités seraient perdues) et par le
     retour depuis pages/choix-legion.html (`initialiser()`, API
     PUBLIQUE plus bas) — le joueur y a déjà validé son choix
     explicitement sur l'autre page, donc `confirmer: false`. Retourne
     false si le changement a été annulé (confirmation refusée), true
     sinon (y compris si `nouvelle` égale déjà det.legionAlliee).*/
  function appliquerLegionAlliee(det, nouvelle, { confirmer } = {}) {
    if (nouvelle === det.legionAlliee) return true;
    const casesConcernees = det.cases.filter((c) => {
      if (c.uniteUid === null) return false;
      const occ = occupant(c);
      return Boolean(occ && occ.unite.legion && occ.unite.legion !== nouvelle);
    });
    if (
      confirmer &&
      casesConcernees.length > 0 &&
      !window.confirm(
        "Changer la Légion Alliée retire " +
          casesConcernees.length +
          " unité(s) réservée(s) à l'ancienne Légion de ce Détachement. Continuer ?",
      )
    ) {
      return false;
    }
    for (const c of casesConcernees) {
      const uid = c.uniteUid;
      liberer(uid);
      hooks.retirerInstance(uid);
    }
    det.legionAlliee = nouvelle;
    // Avantage d'Arsenal devenu invalide (unité générique dont le
    // Trait « [Legiones Astartes] » comptait comme celui de l'ancienne
    // Légion Alliée, voir avantagesPossibles) : retiré, sinon il
    // resterait appliqué (bonus concret sur la fiche, js/unites.js)
    // sans plus apparaître dans le menu déroulant « Avantage
    // Principal » de sa Case. Une case ajoutée (`ajouteCase`) encore
    // occupée n'est pas retirée pour ne pas perdre l'unité qui s'y
    // trouve (même garde que changerAvantage) : l'Avantage reste alors
    // affiché tel quel, à corriger manuellement.
    for (const c of det.cases) {
      if (c.avantage === "aucun") continue;
      const avantageActuel = avantageParId(c.avantage);
      if (!avantageActuel || !avantageActuel.traitRequis) continue;
      const occCase = occupant(c);
      if (occCase && occCase.unite.traits.includes(avantageActuel.traitRequis))
        continue;
      if (
        SKINS_LEGION[nouvelle] &&
        SKINS_LEGION[nouvelle].nom === avantageActuel.traitRequis
      )
        continue;
      if (avantageActuel.ajouteCase) {
        const extraIdx = det.cases.findIndex((x) => x.extra);
        if (extraIdx !== -1 && det.cases[extraIdx].uniteUid !== null) continue;
        if (extraIdx !== -1) det.cases.splice(extraIdx, 1);
      }
      c.avantage = "aucun";
    }
    return true;
  }

  /* Menu « Légion Alliée » d'une carte de Détachement Allié (p. 283 :
     Faction différente de celle du Détachement Principal). Suit
     exactement la logique du menu « Légion » des paramètres de la
     partie (construireParametres), y compris la redirection vers la
     galerie de portraits de pages/choix-legion.html au lieu d'ouvrir la
     liste déroulante native (un mousedown intercepté empêche le menu
     de s'ouvrir) : l'index de `det` dans etat.detachements est passé en
     paramètre `det` de l'URL (`cible=allie`) pour que le retour sache à
     quel Détachement Allié appliquer le choix — voir la lecture de ces
     paramètres dans initialiser() (API PUBLIQUE plus bas). Cet index
     reste stable le temps de l'aller-retour : restaurerOrga() reforme
     etat.detachements dans le même ordre que la sauvegarde, et rien
     d'autre ne peut modifier cette Armée entre-temps (page différente,
     même onglet). Seules les Légions ayant des unités transcrites sont
     sélectionnables, et on y exclut en plus la Légion de l'Armée
     elle-même. */
  function construireSelectLegionAlliee(det) {
    const ligne = el("p", "orga-detachement-legion");
    const label = el("label", null, "Légion Alliée ");
    const select = document.createElement("select");
    select.setAttribute("aria-label", "Légion du Détachement Allié");
    ajouterOption(select, "", "— Choisir la Légion Alliée —");
    for (const [valeur, texteLegion] of LEGIONS) {
      const memeQueArmee = valeur === etat.legion;
      const disponible =
        !memeQueArmee &&
        !LEGIONS_INDISPONIBLES.includes(valeur) &&
        UNITES.some((u) => u.legion === valeur);
      const opt = ajouterOption(
        select,
        valeur,
        texteLegion +
          (memeQueArmee
            ? " (Légion du Détachement Principal)"
            : disponible
              ? ""
              : " (prochainement)"),
      );
      opt.disabled = !disponible;
    }
    select.value = det.legionAlliee || "";
    const versGalerie = () => {
      window.location.href =
        "choix-legion.html?cible=allie&det=" + etat.detachements.indexOf(det);
    };
    select.addEventListener("mousedown", (e) => {
      e.preventDefault();
    });
    select.addEventListener("click", versGalerie);
    select.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        versGalerie();
      }
    });
    // Filet de sécurité (comme selectLegion dans construireParametres) :
    // si le menu s'ouvre malgré tout (mousedown non intercepté par le
    // navigateur/l'OS) et qu'une valeur y est choisie directement, on
    // l'applique quand même plutôt que de la laisser sans effet.
    select.addEventListener("change", () => {
      if (!appliquerLegionAlliee(det, select.value, { confirmer: true })) {
        select.value = det.legionAlliee || "";
        return;
      }
      actualiser();
    });
    label.appendChild(select);
    ligne.appendChild(label);
    return ligne;
  }

  /* Menu « Maisonnée Alliée » d'une carte de Détachement Allié, affiché
     uniquement quand det.factionAlliee vaut "chevaliers-questoris" (p.
     283, même principe que Légion Alliée ci-dessus, généralisé aux
     Maisonnées). Contrairement à Légion Alliée, pas de redirection vers
     une galerie (il n'y en a pas pour les Maisonnées) : menu déroulant
     simple, sur le modèle du menu Maisonnée de construireParametres. Ni
     Chevaliers Questoris ni Maisonnée ne filtrent aujourd'hui la moindre
     Unité (aucun champ `unite.maisonnee`, et aucune Unité Chevaliers
     Questoris transcrite) : changer la sélection ne retire donc aucune
     Unité, à la différence de Légion/Faction Alliée. */
  function construireSelectMaisonneeAlliee(det) {
    const ligne = el("p", "orga-detachement-maisonnee");
    const label = el("label", null, "Maisonnée Alliée ");
    const select = document.createElement("select");
    select.setAttribute("aria-label", "Maisonnée du Détachement Allié");
    ajouterOption(select, "", "— Choisir la Maisonnée Alliée —");
    for (const [valeur, texte] of MAISONNEES) {
      const memeQueArmee = valeur === etat.maisonnee;
      const opt = ajouterOption(
        select,
        valeur,
        texte + (memeQueArmee ? " (Maisonnée du Détachement Principal)" : ""),
      );
      opt.disabled = memeQueArmee;
    }
    select.value = det.maisonneeAlliee || "";
    select.addEventListener("change", () => {
      det.maisonneeAlliee = select.value;
      actualiser();
    });
    label.appendChild(select);
    ligne.appendChild(label);
    return ligne;
  }

  /* Menu « Maisonnée » d'une carte de Détachement de Seigneur des
     Batailles (livre d'armée Chevaliers Questoris, Paradigmes de
     Maisonnée) : affiché inconditionnellement sur ce type de
     Détachement (contrairement à Maisonnée Alliée ci-dessus, qui
     n'apparaît que pour un Détachement Allié de Faction Chevaliers
     Questoris) — c'est le seul moyen, pour une Armée d'une AUTRE
     Faction que Chevaliers Questoris, de déclarer un Paradigme sur les
     Chevaliers qu'elle y fait entrer, `etat.maisonnee` n'étant réglable
     que pour la Faction Chevaliers Questoris elle-même (menu
     « Maisonnée » des paramètres de la partie). Aucune option
     désactivée ici (contrairement à Maisonnée Alliée, qui exclut la
     Maisonnée déjà choisie pour le Détachement Principal) : rien
     n'empêche ce Détachement de partager la même Maisonnée que
     l'Armée si celle-ci est elle-même Chevaliers Questoris — cas
     hypothétique (les deux Détachements sont par ailleurs mutuellement
     exclusifs, voir `excluAvec`), géré sans complication particulière.
     Ne filtre aujourd'hui aucune Unité (comme Maisonnée Alliée) :
     consommée uniquement par maisonneePertinentePourDetachement()
     pour les 3 bonus de Paradigme. */
  function construireSelectMaisonneeSeigneurBatailles(det) {
    const ligne = el("p", "orga-detachement-maisonnee");
    const label = el("label", null, "Maisonnée ");
    const select = document.createElement("select");
    select.setAttribute(
      "aria-label",
      "Maisonnée du Détachement de Seigneur des Batailles",
    );
    ajouterOption(select, "", "— Choisir la Maisonnée —");
    for (const [valeur, texte] of MAISONNEES) {
      ajouterOption(select, valeur, texte);
    }
    select.value = det.maisonneeSeigneurBatailles || "";
    select.addEventListener("change", () => {
      det.maisonneeSeigneurBatailles = select.value;
      actualiser();
    });
    label.appendChild(select);
    ligne.appendChild(label);
    return ligne;
  }

  /* Menu « Légion » du Serment du Moment Panoplie d'Antan (Blackshields) :
     une seule Légion pour tout le Détachement, débloque les options
     d'Armurerie de cette Légion pour toutes ses Unités (voir
     legionRequiseSatisfaite, js/unites.js — étendu à cette source au
     même titre que les Légions Brisées). */
  function construireSelectLegionPanoplie(det) {
    const ligne = el("p", "orga-detachement-serment-sous-choix");
    const label = el("label", null, "Légion (Panoplie d’Antan) ");
    const select = document.createElement("select");
    select.setAttribute(
      "aria-label",
      "Légion choisie pour le Serment du Moment Panoplie d’Antan",
    );
    ajouterOption(select, "", "— Choisir une Légion —");
    for (const [valeur, texte] of LEGIONS) {
      ajouterOption(select, valeur, texte);
    }
    select.value = det.legionPanoplie || "";
    select.addEventListener("change", () => {
      det.legionPanoplie = select.value;
      actualiser();
    });
    label.appendChild(select);
    ligne.appendChild(label);
    return ligne;
  }

  /* Menu Clone/Aberrant du Serment du Moment L'Hélice Brisée
     (Blackshields) : un seul choix pour tout le Détachement (voir
     CLAUDE.md — même principe que Dominion Éthérique/Techno-arcane
     Majeur, un choix unique appliqué à toutes les Unités concernées). */
  function construireSelectCloneAberrant(det) {
    const ligne = el("p", "orga-detachement-serment-sous-choix");
    const label = el("label", null, "Clone ou Aberrant (L’Hélice Brisée) ");
    const select = document.createElement("select");
    select.setAttribute(
      "aria-label",
      "Choix Clone ou Aberrant pour le Serment du Moment L’Hélice Brisée",
    );
    ajouterOption(select, "", "— Choisir —");
    ajouterOption(select, "clone", "Clone");
    ajouterOption(select, "aberrant", "Aberrant");
    select.value = det.choixCloneAberrant || "";
    select.addEventListener("change", () => {
      det.choixCloneAberrant = select.value;
      actualiser();
    });
    label.appendChild(select);
    ligne.appendChild(label);
    return ligne;
  }

  /* Cases à cocher « Serments du Moment » (Blackshields, voir
     SERMENTS_DU_MOMENT, js/organigramme-data.js) d'un Détachement
     Principal (max 2) ou Allié (max 1) : même gabarit que les cases à
     cocher « Légions choisies » des Légions Brisées
     (.orga-legions-brisees, css/style.css), avec sous-menus déclenchés
     par certains Serments. */
  function construireSelectSermentsDetachement(det) {
    const max = maxSermentsPour(typeDe(det));
    const conteneur = el("div", "orga-detachement-serments");
    conteneur.appendChild(
      el(
        "p",
        "orga-detachement-serments-titre",
        "Serments du Moment (jusqu’à " + max + ")",
      ),
    );
    const groupe = el("span", "orga-legions-brisees");
    groupe.setAttribute("role", "group");
    groupe.setAttribute("aria-label", "Serments du Moment du Détachement");
    for (const serment of SERMENTS_DU_MOMENT) {
      const idCase = "serment-" + det.uid + "-" + serment.id;
      const caseACocher = document.createElement("input");
      caseACocher.type = "checkbox";
      caseACocher.id = idCase;
      const dejaChoisi = det.serments.includes(serment.id);
      caseACocher.checked = dejaChoisi;
      const compatible = sermentCompatible(det, serment.id);
      caseACocher.disabled =
        !dejaChoisi && (det.serments.length >= max || !compatible);
      if (!dejaChoisi && !compatible) {
        caseACocher.title =
          "Incompatible avec un Serment du Moment déjà choisi sur ce Détachement.";
      }
      caseACocher.addEventListener("change", () => {
        if (caseACocher.checked) {
          if (
            det.serments.length >= max ||
            !sermentCompatible(det, serment.id)
          ) {
            caseACocher.checked = false;
            return;
          }
          det.serments = [...det.serments, serment.id];
        } else {
          det.serments = det.serments.filter((id) => id !== serment.id);
        }
        actualiser();
      });
      const etiquette = el("label", "orga-legions-brisees-item");
      etiquette.htmlFor = idCase;
      etiquette.appendChild(caseACocher);
      etiquette.appendChild(creerRegleTag(" " + serment.nom, serment.texte));
      groupe.appendChild(etiquette);
    }
    conteneur.appendChild(groupe);
    if (det.serments.includes("panoplie-antan")) {
      conteneur.appendChild(construireSelectLegionPanoplie(det));
    }
    if (det.serments.includes("helice-brisee")) {
      conteneur.appendChild(construireSelectCloneAberrant(det));
    }
    return conteneur;
  }

  /* Menu « Rattaché à » d'un Détachement Auxiliaire/d'Apex (Blackshields) :
     ce site ne conserve pas de lien formel « quelle Case a débloqué quel
     Détachement » (voir debloqueursDisponibles/creerDetachement plus
     haut), donc le rattachement — nécessaire pour hériter des Serments
     du Moment du Détachement Principal/Allié « auquel il est attaché »,
     p. 3 du PDF — est choisi explicitement par le joueur ici. */
  function construireSelectSermentsRattaches(det) {
    const parents = etat.detachements.filter((d) => {
      if (d.uid === det.uid) return false;
      const t = typeDe(d);
      return t.famille === "principal" || t.id === "allie";
    });
    const ligne = el("p", "orga-detachement-serment-sous-choix");
    const label = el("label", null, "Rattaché à (Serments du Moment) ");
    const select = document.createElement("select");
    select.setAttribute(
      "aria-label",
      "Détachement Principal ou Allié dont ce Détachement hérite les Serments du Moment",
    );
    ajouterOption(select, "", "— Aucun (pas de Serment du Moment) —");
    for (const parent of parents) {
      const nomsSerments = (parent.serments || [])
        .map((id) => (sermentParId(id) || {}).nom)
        .filter(Boolean)
        .join(", ");
      ajouterOption(
        select,
        String(parent.uid),
        typeDe(parent).nom +
          " #" +
          parent.uid +
          (nomsSerments
            ? " (" + nomsSerments + ")"
            : " (aucun Serment choisi)"),
      );
    }
    select.value = det.serimentsRattaches ? String(det.serimentsRattaches) : "";
    select.addEventListener("change", () => {
      det.serimentsRattaches = select.value ? Number(select.value) : null;
      actualiser();
    });
    label.appendChild(select);
    ligne.appendChild(label);
    return ligne;
  }

  /* Menu « Doctrine de Cohorte Alliée » d'une carte de Détachement
     Allié, affiché uniquement quand det.factionAlliee vaut
     "solar-auxilia" — même principe que construireSelectMaisonneeAlliee
     ci-dessus, appliqué aux Doctrines de Cohorte (Solar Auxilia). */
  function construireSelectDoctrineAlliee(det) {
    const ligne = el("p", "orga-detachement-doctrine");
    const label = el("label", null, "Doctrine de Cohorte Alliée ");
    const select = document.createElement("select");
    select.setAttribute(
      "aria-label",
      "Doctrine de Cohorte du Détachement Allié",
    );
    ajouterOption(select, "", "— Choisir la Doctrine de Cohorte Alliée —");
    for (const [valeur, texte] of DOCTRINES_DE_COHORTE) {
      const memeQueArmee = valeur === etat.doctrineCohorte;
      const opt = ajouterOption(
        select,
        valeur,
        texte + (memeQueArmee ? " (Doctrine du Détachement Principal)" : ""),
      );
      opt.disabled = memeQueArmee;
    }
    select.value = det.doctrineCohorteAlliee || "";
    select.addEventListener("change", () => {
      det.doctrineCohorteAlliee = select.value;
      actualiser();
    });
    label.appendChild(select);
    ligne.appendChild(label);
    return ligne;
  }

  // Carte d'un détachement : titre, cases, bouton retirer.
  function construireDetachementDOM(det) {
    const type = typeDe(det);
    const carte = el(
      "section",
      "orga-detachement orga-detachement--" + type.famille,
    );

    const entete = el("header", "orga-detachement-entete");
    const titre = el("h3");
    titre.appendChild(creerRegleTag(type.nom, type.texte));
    entete.appendChild(titre);

    if (type.famille !== "principal") {
      const retirer = el("button", "unite-retirer", "Retirer le détachement");
      retirer.type = "button";
      retirer.addEventListener("click", () => {
        const occupees = det.cases.filter((c) => c.uniteUid !== null);
        if (
          occupees.length > 0 &&
          !window.confirm(
            "Ce détachement contient " +
              occupees.length +
              " unité(s) : elles seront retirées de la liste. Continuer ?",
          )
        ) {
          return;
        }
        for (const c of occupees) hooks.retirerInstance(c.uniteUid);
        etat.detachements = etat.detachements.filter((d) => d.uid !== det.uid);
        // Le Détachement Narratif remplace visuellement le Détachement
        // Principal à sa sélection (voir construireAjoutDetachements) :
        // le retirer restaure le Détachement Principal normal de la
        // Faction en cours, pour ne jamais laisser l'Armée sans Case
        // Principale.
        if (
          type.id === "narratif" &&
          !etat.detachements.some((d) => typeDe(d).famille === "principal")
        ) {
          etat.detachements.unshift(creerDetachement(idDetachementPrincipal()));
        }
        actualiser();
      });
      entete.appendChild(retirer);
    }
    carte.appendChild(entete);
    if (type.id === "allie") {
      carte.appendChild(construireSelectFactionAlliee(det));
      if (det.factionAlliee === "legio-astartes") {
        carte.appendChild(construireSelectLegionAlliee(det));
      } else if (det.factionAlliee === "chevaliers-questoris") {
        carte.appendChild(construireSelectMaisonneeAlliee(det));
      } else if (det.factionAlliee === "solar-auxilia") {
        carte.appendChild(construireSelectDoctrineAlliee(det));
      }
    } else if (type.id === "seigneur-batailles") {
      carte.appendChild(construireSelectMaisonneeSeigneurBatailles(det));
    }
    // Serments du Moment (Blackshields, voir SERMENTS_DU_MOMENT) : choix
    // propre sur un Détachement Principal/Allié, ou rattachement à l'un
    // d'eux pour tout autre type (Auxiliaire, Apex...) — jamais les deux
    // sur la même carte.
    if (etat.faction === "blackshields") {
      if (type.famille === "principal" || type.id === "allie") {
        carte.appendChild(construireSelectSermentsDetachement(det));
      } else if (type.famille === "auxiliaire" || type.famille === "apex") {
        // « Other types of Detachment may not have Oaths of Moment
        // selected for them » (p. 3) : Seigneur de Guerre/des Batailles/
        // Narratif n'ont donc ni choix propre ni rattachement.
        carte.appendChild(construireSelectSermentsRattaches(det));
      }
    }

    const liste = el("ul", "orga-cases-liste");
    det.cases.forEach((caseOrga, indice) => {
      const li = el(
        "li",
        "orga-case" + (caseOrga.uniteUid !== null ? " orga-case--occupee" : ""),
      );
      li.appendChild(construireBadge(det, caseOrga));

      const contenu = el("div", "orga-case-contenu");
      const role = ROLES_TACTIQUES[caseOrga.role];
      contenu.appendChild(
        el(
          "p",
          "orga-case-role",
          (role ? role.livre : caseOrga.role || "Rôle à choisir") +
            (estCasePrincipale(det, caseOrga) ? " — Case Principale" : "") +
            (caseOrga.extra
              ? " (" +
                (
                  avantageParId(caseOrga.origineAvantage) || {
                    nom: "Bénéfice Logistique",
                  }
                ).nom +
                ")"
              : ""),
        ),
      );

      // Case supplémentaire d'un Avantage `ajouteCase` (Bénéfice
      // Logistique, Le Salaire de la Traîtrise) : choix du Rôle
      // Tactique (tout sauf QG, État-major, Seigneurs — p. 283), sauf
      // si l'Avantage d'origine restreint la liste à quelques Rôles
      // précis (`rolesCaseAjoutee`, ex : Logisticae des Ultramarines,
      // limité à Transport/Transport Lourd). Une Case `libre` (ajoutée
      // à la demande sur un Détachement `casesLibres`, ex : Détachement
      // Narratif) suit le même principe de sélection, mais SANS
      // exclusion : tous les Rôles Tactiques y sont proposés.
      // Si un seul Rôle est possible (`rolesCaseAjoutee` à un élément,
      // ex : Bardé de Fer, Agent de Clade), le Rôle est déjà préaffecté
      // et FIXE (voir changerAvantage) : pas de menu déroulant, pour ne
      // pas laisser croire qu'il pourrait être changé.
      if (caseOrga.extra || caseOrga.libre) {
        const origineExtra = avantageParId(caseOrga.origineAvantage);
        const rolesPossiblesExtra = caseOrga.libre
          ? Object.keys(ROLES_TACTIQUES)
          : (origineExtra && origineExtra.rolesCaseAjoutee) ||
            Object.keys(ROLES_TACTIQUES).filter(
              (cle) => !ROLES_INTERDITS_LOGISTIQUE.includes(cle),
            );
        if (rolesPossiblesExtra.length !== 1) {
          // Rôle fixe (liste à un seul élément, ex : Bardé de Fer, Agent
          // de Clade) : rien à afficher ici, déjà visible dans la ligne
          // "orga-case-role" ci-dessus, sans menu déroulant.
          const selectRole = document.createElement("select");
          selectRole.className = "orga-case-role-select";
          selectRole.setAttribute(
            "aria-label",
            "Rôle Tactique de la case ajoutée",
          );
          ajouterOption(selectRole, "", "— Choisir un Rôle Tactique —");
          for (const cle of rolesPossiblesExtra) {
            ajouterOption(selectRole, cle, ROLES_TACTIQUES[cle].livre);
          }
          selectRole.value = caseOrga.role || "";
          selectRole.disabled = caseOrga.uniteUid !== null; // rôle figé tant qu'occupée
          selectRole.addEventListener("change", () => {
            caseOrga.role = selectRole.value || null;
            actualiser();
          });
          contenu.appendChild(selectRole);
        }
      }

      const occ = occupant(caseOrga);
      if (occ) {
        const ligneUnite = el("p", "orga-case-unite");
        const lien = el(
          "a",
          null,
          occ.unite.nom + " (" + coutInstanceParUid(occ.instance.uid) + " pts)",
        );
        lien.href = "#unite-" + occ.instance.uid; // ancre vers la carte
        ligneUnite.appendChild(lien);
        contenu.appendChild(ligneUnite);

        // Avantage Principal (cases principales occupées, p. 283) —
        // aussi affiché sur une Case ordinaire occupée si le Serment du
        // Moment Dans la Disgrâce, Tous sont Égaux (Blackshields) est
        // actif sur ce Détachement : toute Case en devient une Case
        // d'Organigramme de Force Suprême (voir avantagesPossibles, qui
        // y restreint déjà le menu au seul Petit Seigneur de Guerre).
        const casePrimeDisgrace =
          !caseOrga.extra &&
          !caseOrga.libre &&
          sermentsActifsDe(det).some(
            (id) =>
              sermentParId(id) && sermentParId(id).toutesCasesDeviennentPrime,
          );
        if (estCasePrincipale(det, caseOrga) || casePrimeDisgrace) {
          const labelAv = el(
            "label",
            "orga-case-avantage-label",
            "Avantage Principal ",
          );
          const selectAv = document.createElement("select");
          selectAv.setAttribute("aria-label", "Avantage Principal de la case");
          for (const { avantage, grise, raison } of avantagesPossibles(
            det,
            caseOrga,
          )) {
            const opt = ajouterOption(selectAv, avantage.id, avantage.nom);
            opt.disabled = grise;
            opt.title = grise ? raison : avantage.texte;
          }
          selectAv.value = caseOrga.avantage;
          selectAv.title = (avantageParId(caseOrga.avantage) || {}).texte || "";
          selectAv.addEventListener("change", () => {
            const erreur = changerAvantage(det, indice, selectAv.value);
            if (erreur) {
              window.alert(erreur);
              selectAv.value = caseOrga.avantage; // annule le changement
            }
          });
          labelAv.appendChild(selectAv);
          contenu.appendChild(labelAv);
          const definition = avantageParId(caseOrga.avantage);
          if (definition && caseOrga.avantage !== "aucun") {
            contenu.appendChild(
              el("p", "orga-case-avantage-texte", definition.texte),
            );
          }
        }
      } else {
        contenu.appendChild(el("p", "orga-case-libre", "— Case libre —"));
      }
      // Case `libre` (Détachement Narratif) : le joueur peut la retirer
      // à tout moment, contrairement à une Case `extra` (liée à un
      // Avantage) que seule liberer() gère automatiquement.
      if (caseOrga.libre) {
        const retirerCase = el("button", "unite-retirer", "Retirer cette case");
        retirerCase.type = "button";
        retirerCase.addEventListener("click", () => {
          if (
            caseOrga.uniteUid !== null &&
            !window.confirm(
              "Cette case contient une unité : elle sera retirée de la liste. Continuer ?",
            )
          ) {
            return;
          }
          if (caseOrga.uniteUid !== null)
            hooks.retirerInstance(caseOrga.uniteUid);
          det.cases.splice(indice, 1);
          actualiser();
        });
        contenu.appendChild(retirerCase);
      }
      li.appendChild(contenu);
      liste.appendChild(li);
    });
    carte.appendChild(liste);

    // Détachement `casesLibres` (Détachement Narratif) : bouton
    // d'ajout d'une Case supplémentaire, en nombre illimité.
    if (type.casesLibres) {
      const ajouterCase = el(
        "button",
        "bouton-secondaire",
        "+ Ajouter une case",
      );
      ajouterCase.type = "button";
      ajouterCase.addEventListener("click", () => {
        det.cases.push({
          role: null,
          principale: false,
          uniteUid: null,
          avantage: "aucun",
          extra: false,
          libre: true,
        });
        actualiser();
      });
      carte.appendChild(ajouterCase);
    }
    return carte;
  }

  // Panneau « Ajouter un détachement » : boutons groupés par famille,
  // grisés avec explication quand la règle l'interdit (exigence UX).
  // Chaque groupe est repliable (<details>) pour alléger la vue quand
  // une famille compte beaucoup de types (Auxiliaires) ; l'état
  // replié/déplié de chaque groupe est relu avant la reconstruction
  // (appelée à chaque interaction via actualiser) pour ne pas se
  // refermer tout seul à chaque clic — replié par défaut.
  function construireAjoutDetachements(conteneur) {
    const etatsOuverts = {};
    conteneur.querySelectorAll("details.orga-ajout-groupe").forEach((d) => {
      etatsOuverts[d.dataset.famille] = d.open;
    });
    conteneur.replaceChildren();
    // Calculé une seule fois pour tous les types de toutes les
    // familles ci-dessous (identique pour chacun tant que l'Armée n'a
    // pas changé), plutôt que recalculé par disponibilite() à chaque
    // type (une quinzaine à une trentaine par rendu).
    const credits = calculerCredits();
    const familles = [
      ["additionnel", "Détachements additionnels"],
      ["auxiliaire", "Détachements Auxiliaires"],
      ["apex", "Détachements d'Apex"],
      ["narratif", "Détachement Narratif"],
    ];
    for (const [famille, titreFamille] of familles) {
      const typesFamille = TYPES_DETACHEMENTS.filter(
        (t) =>
          t.famille === famille &&
          (!t.legion || t.legion === etat.legion) &&
          typeDisponiblePourFaction(t),
      );
      // Aucun type de ce groupe n'est disponible pour la Faction/Légion
      // actuelle (ex. Détachements d'Apex pour Legio Titanicus) : on
      // n'affiche pas un groupe vide, réduit à son seul titre replié.
      if (typesFamille.length === 0) continue;
      const groupe = document.createElement("details");
      groupe.className = "orga-ajout-groupe";
      groupe.dataset.famille = famille;
      groupe.open = famille in etatsOuverts ? etatsOuverts[famille] : false;
      // Un <summary> natif est cliquable sur toute sa largeur (jusqu'au
      // bord droit du panneau, bien au-delà du texte) : on isole le nom
      // dans un <span> et on n'autorise le pli/dépli natif que si le
      // clic tombe dessus, sur le même principe que les étiquettes de
      // case à cocher ailleurs sur ce site (voir plus bas, "case" et
      // "paire" dans construireCarte, js/unites.js).
      const texteSummary = el("span", "orga-ajout-titre-texte", titreFamille);
      const summary = document.createElement("summary");
      summary.appendChild(texteSummary);
      summary.addEventListener("click", (evenement) => {
        if (evenement.target !== texteSummary) evenement.preventDefault();
      });
      groupe.appendChild(summary);
      const ligne = el("div", "orga-ajout-boutons");
      for (const type of typesFamille) {
        const { possible, raison } = disponibilite(type, credits);
        const bouton = el(
          "button",
          "bouton-secondaire orga-ajout-bouton" +
            (type.id === "narratif" ? " orga-ajout-bouton--narratif" : ""),
          "+ " + type.nom,
        );
        bouton.type = "button";
        bouton.disabled = !possible;
        // Info-bulle : description du détachement, ou raison du grisé.
        bouton.title = possible ? type.texte : raison;
        if (!possible) bouton.setAttribute("aria-disabled", "true");
        bouton.addEventListener("click", () => {
          if (type.id === "narratif") {
            // Le Détachement Narratif remplace visuellement le
            // Détachement Principal en cours : sa sélection vide la
            // liste d'armée ET tous les détachements déjà présents
            // (Principal, additionnels, auxiliaires, apex) — voir
            // demande de Jean. Confirmation obligatoire, comme tout
            // changement destructeur du site (Faction, Vider la liste).
            if (
              !window.confirm(
                "Le Détachement Narratif remplace le Détachement Principal et TOUS les autres détachements de l'Armée : la liste d'unités et les détachements en cours seront vidés. Continuer ?",
              )
            ) {
              return;
            }
            for (const instance of [...hooks.getArmee()])
              hooks.retirerInstance(instance.uid);
            etat.detachements = [creerDetachement(type.id)];
          } else {
            etat.detachements.push(creerDetachement(type.id));
          }
          actualiser();
        });
        ligne.appendChild(bouton);
        if (!possible) {
          // La raison est aussi posée en texte visible au survol via
          // .tooltip pour les usages tactiles (title seul ne suffit pas).
          const enveloppe = el("span", "orga-ajout-grise regle-tag");
          enveloppe.tabIndex = 0;
          ligne.removeChild(bouton);
          enveloppe.appendChild(bouton);
          enveloppe.appendChild(el("span", "tooltip", raison));
          ligne.appendChild(enveloppe);
        }
      }
      groupe.appendChild(ligne);
      conteneur.appendChild(groupe);
    }
  }

  /* Résumé final de la liste (affiché à l'écran ET imprimé avec les
     fiches — voir @media print dans css/style.css). */
  function construireResume(conteneur) {
    conteneur.replaceChildren();
    conteneur.appendChild(el("h2", "section-titre", "Structure de l'armée"));
    conteneur.appendChild(
      el(
        "p",
        "orga-resume-entete",
        "Limite : " +
          etat.limite +
          " pts · Allégeance : " +
          (etat.allegeance === "renegat" ? "Renégat" : "Loyaliste") +
          " · Total : " +
          coutTotalArmee() +
          " pts",
      ),
    );
    for (const det of etat.detachements) {
      const bloc = el("div", "orga-resume-detachement");
      const sousTotal = det.cases.reduce(
        (somme, c) =>
          somme + (c.uniteUid !== null ? coutInstanceParUid(c.uniteUid) : 0),
        0,
      );
      bloc.appendChild(
        el("h3", null, typeDe(det).nom + " — " + sousTotal + " pts"),
      );
      const liste = document.createElement("ul");
      for (const caseOrga of det.cases) {
        const occ = occupant(caseOrga);
        if (!occ) continue; // case libre : pas d'intérêt dans le résumé
        const role = ROLES_TACTIQUES[caseOrga.role];
        const avantage = avantageParId(caseOrga.avantage);
        liste.appendChild(
          el(
            "li",
            null,
            (role ? role.livre : "Rôle à choisir") +
              (estCasePrincipale(det, caseOrga) ? " ★" : "") +
              " : " +
              occ.unite.nom +
              " — " +
              coutInstanceParUid(occ.instance.uid) +
              " pts" +
              (caseOrga.avantage !== "aucun" && avantage
                ? " · Avantage : " + avantage.nom
                : ""),
          ),
        );
      }
      bloc.appendChild(liste);
      conteneur.appendChild(bloc);
    }
  }

  /* ----------------------------------------------------------
     ACTUALISATION GLOBALE — re-rend tout ce qui dépend de l'état,
     prévient js/unites.js (sélecteurs « Case » des cartes) et
     sauvegarde. Appelée après chaque interaction.
     ---------------------------------------------------------- */
  function actualiser() {
    // Le tutoriel de construction d'armée (construction-liste.html) ne décrit que
    // l'Organigramme de Force des Legiones Astartes (Détachement
    // Principal de Croisade, États-Majors…) : sans objet pour Legio
    // Titanicus, qui suit son propre Détachement Principal (Ordinal
    // Titanique). Entièrement masqué, comme Légion/Rite de Guerre
    // ci-dessous, plutôt que simplement grisé.
    const sectionTutoriel = document.getElementById("construction-armee");
    if (sectionTutoriel) {
      sectionTutoriel.hidden = etat.faction !== "legio-astartes";
    }
    // Même logique pour le tutoriel Chevaliers Questoris (Détachement
    // Principal de Maisonnées de Chevaliers, paradigmes, vœux…) : masqué
    // entièrement tant que cette Faction n'est pas sélectionnée.
    const sectionTutorielQuestoris = document.getElementById(
      "construction-armee-questoris",
    );
    if (sectionTutorielQuestoris) {
      sectionTutorielQuestoris.hidden = etat.faction !== "chevaliers-questoris";
    }
    // Même logique pour le tutoriel Legio Titanicus (liste d'armée,
    // Ordinal Titanique, allégeance…) : masqué entièrement tant que
    // cette Faction n'est pas sélectionnée.
    const sectionTutorielTitanicus = document.getElementById(
      "construction-armee-titanicus",
    );
    if (sectionTutorielTitanicus) {
      sectionTutorielTitanicus.hidden = etat.faction !== "legio-titanicus";
    }
    // Même logique pour le tutoriel Solar Auxilia (Doctrines de
    // Cohorte, Détachements de Tercio, Réactions/Posture, Désignations
    // de Legiones Auxilia…) : masqué entièrement tant que cette
    // Faction n'est pas sélectionnée.
    const sectionTutorielAuxilia = document.getElementById(
      "construction-armee-solar-auxilia",
    );
    if (sectionTutorielAuxilia) {
      sectionTutorielAuxilia.hidden = etat.faction !== "solar-auxilia";
    }
    // Même logique pour le tutoriel Mechanicum (Techno-arcanes
    // Majeurs, Cybertheurgie, Détachements Auxiliaires…) : masqué
    // entièrement tant que cette Faction n'est pas sélectionnée.
    const sectionTutorielMechanicum = document.getElementById(
      "construction-armee-mechanicum",
    );
    if (sectionTutorielMechanicum) {
      sectionTutorielMechanicum.hidden = etat.faction !== "mechanicum";
    }
    // Même logique pour les tutoriels Conclaves Skitarii, Legio Custodes
    // et Anathema Psykana : ces trois Factions partagent le même
    // Organigramme de Force de Croisade générique que Legio Astartes
    // (voir factionCroisadeParDefaut ci-dessus), donc un tutoriel quasi
    // identique — construction-liste.html en a une copie adaptée par
    // Faction (exemples d'Unités propres, sans le panneau « Décurion de
    // Légion », propre aux Legiones Astartes) plutôt qu'un seul texte
    // générique, pour rester cohérent avec le principe déjà établi ici
    // (un tutoriel entier par Faction, pas de contenu partagé factorisé).
    const sectionTutorielSkitarii = document.getElementById(
      "construction-armee-skitarii",
    );
    if (sectionTutorielSkitarii) {
      sectionTutorielSkitarii.hidden = etat.faction !== "skitarii";
    }
    const sectionTutorielCustodes = document.getElementById(
      "construction-armee-legio-custodes",
    );
    if (sectionTutorielCustodes) {
      sectionTutorielCustodes.hidden = etat.faction !== "legio-custodes";
    }
    const sectionTutorielAnathema = document.getElementById(
      "construction-armee-anathema-psykana",
    );
    if (sectionTutorielAnathema) {
      sectionTutorielAnathema.hidden = etat.faction !== "anathema-psykana";
    }
    // Tutoriel des Démons de la Tempête de la Ruine : partage lui aussi
    // l'Organigramme de Force de Croisade générique (voir
    // factionCroisadeParDefaut ci-dessus), même principe de masquage
    // que Skitarii/Legio Custodes/Anathema Psykana ci-dessus.
    const sectionTutorielRuinstorm = document.getElementById(
      "construction-armee-daemons-ruinstorm",
    );
    if (sectionTutorielRuinstorm) {
      sectionTutorielRuinstorm.hidden = etat.faction !== "daemons-ruinstorm";
    }
    // Tutoriel des Légions Brisées : masqué entièrement tant que cette
    // Faction n'est pas sélectionnée, même principe que ci-dessus.
    const sectionTutorielLegionsBrisees = document.getElementById(
      "construction-armee-legions-brisees",
    );
    if (sectionTutorielLegionsBrisees) {
      sectionTutorielLegionsBrisees.hidden = etat.faction !== "legions-brisees";
    }
    // Tutoriel des Blackshields : masqué entièrement tant que cette
    // Faction n'est pas sélectionnée, même principe que ci-dessus.
    const sectionTutorielBlackshields = document.getElementById(
      "construction-armee-blackshields",
    );
    if (sectionTutorielBlackshields) {
      sectionTutorielBlackshields.hidden = etat.faction !== "blackshields";
    }
    construireParametres(document.getElementById("orga-parametres"));
    construireBarre(document.getElementById("orga-barre"));
    const arbre = document.getElementById("orga-arbre");
    arbre.replaceChildren();
    for (const det of etat.detachements)
      arbre.appendChild(construireDetachementDOM(det));
    construireAjoutDetachements(document.getElementById("orga-ajout"));
    construireResume(document.getElementById("orga-resume"));
    // Câblage accessibilité des info-bulles fraîchement créées.
    if (window.cablerInfoBulles) {
      for (const id of ["orga-barre", "orga-arbre", "orga-ajout"]) {
        window.cablerInfoBulles(document.getElementById(id));
      }
    }
    sauvegarderOrga();
    if (hooks && hooks.surChangement) hooks.surChangement();
  }

  /* ----------------------------------------------------------
     API PUBLIQUE (consommée par js/unites.js)
     ---------------------------------------------------------- */
  return {
    /* À appeler une fois, après la restauration de la liste d'unités.
       hooksFournis = { getArmee, trouverUnite, coutInstance,
       retirerInstance, surChangement }. */
    initialiser(hooksFournis) {
      hooks = hooksFournis;
      restaurerOrga();
      // Retour depuis pages/choix-legion.html (paramètre ?legion=) :
      // pré-remplit directement l'état plutôt que de simuler un clic sur
      // le menu déroulant Légion. Pas de window.confirm ici (ce cas ne
      // survient qu'à l'arrivée sur la page, et le joueur vient de
      // choisir explicitement cette Légion sur l'autre page) : on retire
      // directement les unités et détachements existants dès que la
      // Légion (ou la Faction) change réellement, même logique que
      // reinitialiserArmeeAvecConfirmation mais sans confirmation. Le
      // paramètre est retiré de l'URL une fois appliqué, pour ne pas se
      // réappliquer à un rechargement ultérieur de la même page.
      // `cible=allie&det=<indice>` (voir construireSelectLegionAlliee) :
      // même origine, mais pour la Légion Alliée d'un seul Détachement
      // Allié précis plutôt que pour la Légion de l'Armée entière —
      // `indice` désigne sa position dans etat.detachements au moment du
      // départ vers choix-legion.html, restaurerOrga() ci-dessus ayant
      // reformé ce tableau dans le même ordre que la sauvegarde.
      const paramsUrl = new URLSearchParams(location.search);
      const legionDepuisUrl = paramsUrl.get("legion");
      if (legionDepuisUrl && LEGIONS.some(([v]) => v === legionDepuisUrl)) {
        if (paramsUrl.get("cible") === "allie") {
          const detParam = paramsUrl.get("det");
          const indice = detParam !== null ? Number(detParam) : NaN;
          const det = Number.isInteger(indice)
            ? etat.detachements[indice]
            : undefined;
          if (
            det &&
            typeDe(det).id === "allie" &&
            det.factionAlliee === "legio-astartes" &&
            legionDepuisUrl !== etat.legion
          ) {
            appliquerLegionAlliee(det, legionDepuisUrl, { confirmer: false });
          }
        } else {
          const changeReel =
            etat.faction !== "legio-astartes" ||
            etat.legion !== legionDepuisUrl;
          etat.faction = "legio-astartes";
          etat.legion = legionDepuisUrl;
          const skinChoisi = SKINS_LEGION[etat.legion];
          if (skinChoisi) etat.allegeance = skinChoisi.allegeance;
          if (changeReel) {
            for (const instance of [...hooks.getArmee()])
              hooks.retirerInstance(instance.uid);
            etat.detachements = [creerDetachement(idDetachementPrincipal())];
          }
        }
        history.replaceState(null, "", location.pathname + location.hash);
      }
      // Le Détachement Principal est obligatoire et unique (p. 283) : on
      // le crée s'il manque, ou on le remplace si son type ne correspond
      // plus à la Faction actuelle (ex : partie restaurée après un
      // changement de Faction) — on ne garde que le premier sinon.
      const idAttendu = idDetachementPrincipal();
      const principaux = etat.detachements.filter(
        (d) => typeDe(d).famille === "principal",
      );
      if (principaux.length === 0 || principaux[0].typeId !== idAttendu) {
        etat.detachements = etat.detachements.filter(
          (d) => typeDe(d).famille !== "principal",
        );
        etat.detachements.unshift(creerDetachement(idAttendu));
      }
      reconcilier();
      actualiser();
    },
    casesLibresPour,
    assignationDe,
    avantageDe,
    traitDetachementDe,
    // Serments du Moment (Blackshields) actifs pour une instance d'unité
    // (voir sermentsDe ci-dessus) : consommée par js/unites.js pour
    // appliquer leurs effets sur la fiche récap (Règles Spéciales/
    // Traits accordés, transformation de Ligne (X)/Avant-garde (X)...).
    sermentsDe,
    legionPanoplieDe,
    choixCloneAberrantDe,
    traitFactionMechanicumRequisPour,
    traitFactionSkitariiRequisPour,
    // Faction choisie dans les paramètres de la partie (id FACTIONS) :
    // consommée par js/unites.js (uniteAccessible) pour filtrer les
    // unités réservées à une Faction (champ `faction` dans
    // js/unites-data.js, ex : "legio-titanicus"). Une unité sans ce
    // champ reste réservée à Legio Astartes (comportement historique).
    factionActuelle: () => etat.faction,
    // Légion choisie dans les paramètres de la partie ("" = aucune) :
    // consommée par js/unites.js pour filtrer les unités réservées à
    // une Légion (champ `legion` dans js/unites-data.js).
    legionActuelle: () => etat.legion,
    // Dominion Éthérique choisi dans les paramètres de la partie ("" =
    // aucun, Faction Démons de la Tempête de la Ruine uniquement) :
    // consommé par dominionEtheriqueDe (js/unites.js) pour résoudre le
    // placeholder « [Dominion Éthérique] » des Unités génériques.
    dominionActuel: () => etat.dominion,
    // Légions choisies dans les paramètres de la partie (tableau de 0
    // à 3 codes LEGIONS, Faction Légions Brisées uniquement) :
    // consommée par js/unites.js (uniteAccessible) pour rendre
    // accessible une Unité réservée à une Légion (`unite.legion`) dès
    // que celle-ci figure dans ce tableau, et par caseAccepte()
    // ci-dessus pour le même filtre au niveau d'une Case.
    legionsBriseesActuelles: () => etat.legionsBrisees,
    // Maisonnée choisie dans les paramètres de la partie ("" = aucune,
    // Faction Chevaliers Questoris uniquement) : consommée par
    // js/unites.js pour verrouiller le sélecteur « Unité à ajouter »
    // tant qu'aucune Maisonnée n'est choisie, comme legionActuelle()
    // ci-dessus pour Legio Astartes.
    maisonneeActuelle: () => etat.maisonnee,
    // Doctrine de Cohorte choisie ("" = aucune, Faction Solar Auxilia
    // uniquement) : consommée par js/unites.js pour verrouiller le
    // sélecteur « Unité à ajouter » tant qu'aucune Doctrine n'est
    // choisie, même principe que maisonneeActuelle() ci-dessus pour
    // Chevaliers Questoris.
    doctrineCohorteActuelle: () => etat.doctrineCohorte,
    // Techno-arcane Majeur choisi dans les paramètres de la partie ("" =
    // aucun, Faction Mechanicum uniquement) : consommé par
    // traitFactionMechanicumDe (js/unites.js) pour résoudre le
    // placeholder « [Mechanicum] » des Unités génériques et par
    // uniteAccessible pour filtrer les Unités réservées à un Techno-arcane.
    technoArcaneActuel: () => etat.technoArcane,
    optionArcaneActuel: () => {
      // Option d'Arcane automatiquement retournée selon le Techno-arcane choisi
      if (!etat.technoArcane) return null;
      const options = OPTIONS_ARCANES[etat.technoArcane];
      return (options && options[0] && options[0][0]) || null; // retourne le premier (et unique) id
    },
    beneficeArcaneActuel: () => {
      // Mapping Techno-arcane → Bénéfice d'Arcane
      const mapping = {
        archimandrite: "L'Engrangue d'Autorité",
        cybernetica: "Le Deus Machina",
        lacrymaerta: "Une Servitude Sans Fin",
        myrmidax: "La Force des Âges",
        reductor: "Brise-muralles",
        malagra: "Armée Implacablement Soustraite",
        macrotek: "Protecteur de Fer",
      };
      return (etat.technoArcane && mapping[etat.technoArcane]) || null;
    },
    chartPrincipalActuel: () => etat.chartPrincipal,
    // Désignation de Legiones Auxilia choisie ("" = aucune, Faction
    // Solar Auxilia uniquement, choix facultatif — voir
    // DESIGNATIONS_LEGIONES_AUXILIA, js/organigramme-data.js) :
    // consommée par js/unites.js pour la page de garde du PDF/Word
    // (même principe que riteActuel() ci-dessous pour Legio Astartes),
    // sans effet sur l'accessibilité des Unités ni verrou d'ajout,
    // contrairement à doctrineCohorteActuelle() ci-dessus.
    designationAuxiliaActuelle: () => etat.designationAuxilia,
    // Rite de Guerre choisi (id d'un RITES_DE_GUERRE[legion], ou ""
    // si aucun choisi / Légion sans choix de Rite de Guerre) :
    // consommée par js/unites.js pour la page de garde du PDF/Word,
    // certaines Légions ayant un contenu de Rite de Guerre différent
    // selon le choix fait ici (RITE_DE_GUERRE_LEGION, voir
    // js/organigramme-data.js).
    riteActuel: () => etat.riteDeGuerre,
    // Allégeance de l'Armée ("loyaliste" | "renegat") : consommée par
    // js/unites.js (uniteAccessible) pour n'autoriser que les unités
    // dont le Trait d'Allégeance (« Loyaliste »/« Renégat », champ
    // `traits` de js/unites-data.js) correspond à cette Allégeance.
    allegeanceActuelle: () => etat.allegeance,
    // Identité de la Légion choisie ({ nom, primarque, monde,
    // allegeance, devise, icone, classe }, voir SKINS_LEGION plus
    // haut) ou null si aucune Légion choisie / sans skin dédié.
    // Consommée par js/unites.js pour la page de garde du PDF/Word.
    skinActuel: () => SKINS_LEGION[etat.legion] || null,
    // Chemin (relatif aux pages HTML) du blason de la Légion choisie,
    // ou null si aucun blason disponible. Même construction que
    // creerIconeLegion ci-dessus, exposée pour js/unites.js (export
    // PDF/Word, qui ne peut pas injecter de <img> dans le DOM).
    cheminLogoActuel: () => {
      const skin = SKINS_LEGION[etat.legion];
      if (!skin) return null;
      return (
        "../assets/logo_legions/" +
        (LOGOS_LEGION[skin.icone] || skin.icone) +
        ".png"
      );
    },
    // Équivalent skinActuel/cheminLogoActuel ci-dessus, mais pour la
    // Faction Legio Titanicus (SKIN_TITANICUS) plutôt qu'une Légion :
    // null si la Faction actuelle n'est pas Legio Titanicus. Consommée
    // par js/unites.js pour la page de garde du PDF/Word — à la
    // différence d'une Légion, DEUX blasons sont à poser (gauche et
    // droite du nom, voir SKIN_TITANICUS.blasons et creerIconeTitan).
    skinTitanActuel: () =>
      etat.faction === "legio-titanicus" ? SKIN_TITANICUS : null,
    cheminsLogoTitanActuel: () =>
      SKIN_TITANICUS.blasons.map(
        (blason) => "../assets/logo_titan/" + blason.fichier,
      ),
    // Équivalent skinActuel/cheminLogoActuel ci-dessus, mais pour la
    // Désignation de Legiones Auxilia choisie (SKINS_DESIGNATION_
    // AUXILIA, Faction Solar Auxilia) plutôt qu'une Légion : null si
    // aucune Désignation n'est choisie (choix facultatif, contrairement
    // à la Légion pour Legio Astartes — voir plus haut). Consommée par
    // js/unites.js pour la page de garde du PDF/Word.
    skinDesignationActuel: () =>
      SKINS_DESIGNATION_AUXILIA[etat.designationAuxilia] || null,
    cheminLogoDesignationActuel: () => {
      const skin = SKINS_DESIGNATION_AUXILIA[etat.designationAuxilia];
      if (!skin) return null;
      return (
        "../assets/logo_solar_auxilia/" +
        (LOGOS_DESIGNATION_AUXILIA[skin.icone] || skin.icone) +
        ".png"
      );
    },
    // Équivalent skinActuel/cheminLogoActuel ci-dessus, mais pour la
    // Maisonnée choisie (SKINS_MAISONNEE, Faction Chevaliers Questoris)
    // plutôt qu'une Légion : null si aucune Maisonnée n'est choisie.
    // Consommée par js/unites.js pour la page de garde du PDF/Word.
    skinMaisonActuel: () => SKINS_MAISONNEE[etat.maisonnee] || null,
    cheminLogoMaisonActuel: () => {
      const skin = SKINS_MAISONNEE[etat.maisonnee];
      return skin ? "../assets/logo_chevaliers/" + skin.blason : null;
    },
    // Nom du Détachement Additionnel débloqué par le Paradigme de la
    // Maisonnée choisie (Serre d'Automates/Serre d'Armigères/Maisnie
    // Roturière — voir plus haut maisonneePertinentePourDetachement/
    // detachementDebloque). Simple table de correspondance (pas de texte
    // de règle complet associé au Paradigme lui-même dans ce fichier,
    // seul le nom du Détachement qu'il débloque est sûr à afficher).
    // Retourne null si aucune Maisonnée n'est choisie.
    detachementParadigmeMaisonActuel: () =>
      DETACHEMENT_PARADIGME_MAISONNEE[etat.maisonnee] || null,
    // Skins couleurs seules (SKIN_LEGIO_CUSTODES/SKIN_ANATHEMA_PSYKANA/
    // SKIN_SKITARII ci-dessus, sans blason) : null si la Faction
    // actuelle ne correspond pas. Consommées par js/unites.js pour la
    // page de garde du PDF/Word, sur le même principe qu'une Légion mais
    // sans logo à poser (pas d'appel à chargerImageDataURL).
    skinLegioCustodesActuel: () =>
      etat.faction === "legio-custodes" ? SKIN_LEGIO_CUSTODES : null,
    skinAnathemaPsykanaActuel: () =>
      etat.faction === "anathema-psykana" ? SKIN_ANATHEMA_PSYKANA : null,
    skinSkitariiActuel: () =>
      etat.faction === "skitarii" ? SKIN_SKITARII : null,
    // Skins couleurs seules des trois Factions ajoutées ensuite (Démons
    // de la Tempête de la Ruine, Légions Brisées, Blackshields) — même
    // principe que les trois accesseurs ci-dessus.
    skinRuinstormActuel: () =>
      etat.faction === "daemons-ruinstorm" ? SKIN_DAEMONS_RUINSTORM : null,
    skinLegionsBriseesActuel: () =>
      etat.faction === "legions-brisees" ? SKIN_LEGIONS_BRISEES : null,
    skinBlackshieldsActuel: () =>
      etat.faction === "blackshields" ? SKIN_BLACKSHIELDS : null,
    // Factions des Détachements Alliés actuellement dans l'Armée (une
    // par Détachement Allié dont la Faction a été choisie, doublons
    // possibles). Consommée par js/unites.js (uniteAccessible) pour
    // proposer au sélecteur « Unité à ajouter » les unités de ces
    // Factions-là aussi, en plus de celle du Détachement Principal (ex :
    // unités Legio Astartes dans une Armée Legio Titanicus ayant un
    // Détachement Allié Legio Astartes).
    factionsAlliees: () =>
      etat.detachements
        .filter((d) => typeDe(d).id === "allie" && d.factionAlliee)
        .map((d) => d.factionAlliee),
    // Légions des Détachements Alliés actuellement dans l'Armée (une
    // par Détachement Allié dont la Légion a été choisie, doublons
    // possibles si plusieurs partagent la même — p. 283). Consommée
    // par js/unites.js (uniteAccessible) pour proposer au sélecteur
    // « Unité à ajouter » les unités réservées à ces Légions-là aussi,
    // en plus de celle du Détachement Principal.
    legionsAlliees: () =>
      etat.detachements
        .filter((d) => typeDe(d).id === "allie" && d.legionAlliee)
        .map((d) => d.legionAlliee),
    // Factions débloquées par une Case ajoutée d'Avantage Principal à
    // Faction imposée (`factionCaseAjoutee`, ex : Agent de Clade,
    // Divisio Assassinorum) plutôt que par un Détachement Allié —
    // consommée par js/unites.js (uniteAccessible) pour rendre visibles
    // au sélecteur « Unité à ajouter » les Unités de cette Faction, qui
    // ne peut jamais être choisie comme Faction d'un Détachement Allié.
    factionsDebloqueesParAvantage: () => {
      const factions = [];
      for (const det of etat.detachements) {
        for (const c of det.cases) {
          if (!c.extra || !c.origineAvantage) continue;
          const avantageOrigine = avantageParId(c.origineAvantage);
          if (avantageOrigine && avantageOrigine.factionCaseAjoutee) {
            factions.push(avantageOrigine.factionCaseAjoutee);
          }
        }
      }
      return factions;
    },
    // Un Détachement Narratif est-il présent dans l'Armée ? Consommée
    // par js/unites.js (uniteAccessible) pour lever, dès qu'il est
    // présent, les vérifications de Faction/Légion/Allégeance du
    // sélecteur « Unité à ajouter » — ce Détachement acceptant
    // n'importe quelle Unité (caseAccepte() reste seul juge du
    // placement réel dans les AUTRES détachements de l'Armée).
    narratifPresent: () =>
      etat.detachements.some((d) => typeDe(d).id === "narratif"),
    // Un Détachement de ce type (id de TYPES_DETACHEMENTS) est-il déjà
    // présent dans l'Armée ? Généralisation ponctuelle de narratifPresent
    // ci-dessus, consommée par uniteAccessible() (js/unites.js) pour le
    // Tercio de Fer (Unités Mechanicum exceptionnellement proposables à
    // une Armée Solar Auxilia tant que ce Détachement précis est présent).
    detachementPresent: (typeId) =>
      etat.detachements.some((d) => typeDe(d).id === typeId),
    // Ordre canonique des Factions (menu « Faction » des paramètres de
    // la partie, FACTIONS ci-dessus) : consommé par js/unites.js pour
    // regrouper, dans la liste « Unité à ajouter », les unités d'autres
    // Factions par Faction plutôt que dans un ordre arbitraire.
    ordreFactions: () => FACTIONS.map(([valeur]) => valeur),
    // Couleur d'accent (SKINS_LEGION) de N'IMPORTE QUELLE Légion, pas
    // seulement celle de l'Armée (contrairement à skinActuel()) :
    // consommée par js/unites.js pour teinter, dans la liste « Unité à
    // ajouter », les unités d'une Légion différente de celle affichée
    // par le skin de la page (ex : Légion Alliée d'une Armée Legio
    // Titanicus). Null si la Légion est inconnue ou sans skin dédié.
    accentLegion: (legionId) => {
      const skin = SKINS_LEGION[legionId];
      return skin ? skin.accent : null;
    },
    assigner,
    // Retrait d'une unité de la liste : on libère sa case puis on
    // laisse js/unites.js supprimer la carte, avant d'actualiser. Si la
    // Case libérée était de Rôle Quartier Général ou État-major, le
    // crédit de déblocage qu'elle apportait (p. 283-284) disparaît avec
    // elle : on retire alors le(s) Détachement(s) Auxiliaire(s)/Apex
    // devenu(s) surnuméraire(s) — voir retirerDetachementsCreditInsuffisant.
    libererEtActualiser(uniteUid) {
      const assignation = assignationDe(uniteUid);
      const roleLibere = assignation
        ? trouverDetachement(assignation.detUid).cases[assignation.indice].role
        : null;
      liberer(uniteUid);
      if (roleLibere === "Quartier Général" || roleLibere === "État-major") {
        retirerDetachementsCreditInsuffisant();
      }
      actualiser();
    },
    // « Vider la liste » : libère toutes les cases ET remet les
    // détachements à zéro (seul le Détachement Principal, obligatoire,
    // est conservé) — même réinitialisation que
    // reinitialiserArmeeAvecConfirmation, mais sans confirmation
    // puisque l'Armée est déjà vidée par l'appelant à ce stade.
    toutLiberer() {
      etat.detachements = [creerDetachement(idDetachementPrincipal())];
      actualiser();
    },
    actualiser,
    // Clé localStorage de cet état (voir CLE_STOCKAGE_ORGA plus haut) :
    // exposée pour js/unites.js (export/import de la liste complète, qui
    // doit pouvoir lire/écrire cet état sans dupliquer la constante).
    cleStockageOrga: () => CLE_STOCKAGE_ORGA,
    // Libellés humains (FACTIONS/LEGIONS/MAISONNEES ci-dessus) de la
    // Faction/Légion/Maisonnée actuelles — contrairement à
    // factionActuelle()/legionActuelle()/maisonneeActuelle() plus haut,
    // qui renvoient l'id technique. Consommés par js/unites.js pour
    // nommer le fichier d'export de la liste (voir exporterListe).
    // null si la subdivision ne s'applique pas à la Faction actuelle.
    libelleFactionActuelle: () => {
      const trouvee = FACTIONS.find(([valeur]) => valeur === etat.faction);
      return trouvee ? trouvee[1] : etat.faction;
    },
    libelleLegionActuelle: () => {
      const trouvee = LEGIONS.find(([valeur]) => valeur === etat.legion);
      return trouvee ? trouvee[1] : null;
    },
    libelleMaisonneeActuelle: () => {
      const trouvee = MAISONNEES.find(([valeur]) => valeur === etat.maisonnee);
      return trouvee ? trouvee[1] : null;
    },
    // Message d'aide quand aucune case n'est libre pour une unité :
    // suggère quels détachements contiennent ce Rôle Tactique. Ne
    // retient que les détachements dont au moins une Case de ce Rôle
    // accueillerait VRAIMENT cette unité précise : certains Détachements
    // Auxiliaires restreignent leurs Cases à une liste d'unités précises
    // (`restrictions`, ex : Cadre de Décapitation n'accepte que
    // l'Escouade de Vétérans d'Assaut ou de Furies Noires sur ses Cases
    // d'Élite) — les suggérer pour une autre unité de même Rôle
    // Tactique (ex : Deliverers) induirait le joueur en erreur.
    suggestionPourRole(unite) {
      const categorie = unite.categorie;
      const types = TYPES_DETACHEMENTS.filter((t) => {
        if (t.indisponible || t.famille === "principal") return false;
        if (t.legion && t.legion !== etat.legion) return false;
        if (!typeDisponiblePourFaction(t)) return false;
        return t.cases.some((c) => {
          if (c.role !== categorie) return false;
          const restriction = t.restrictions && t.restrictions[c.role];
          return !restriction || restriction.includes(unite.id);
        });
      }).map((t) => t.nom);
      const role = ROLES_TACTIQUES[categorie];
      return (
        "Aucune Case libre pour le Rôle Tactique « " +
        (role ? role.livre : categorie) +
        " »." +
        (types.length > 0
          ? " Détachements possibles : " +
            types.join(", ") +
            " (voir « Ajouter un détachement »)."
          : "")
      );
    },
  };
})();

window.Organigramme = Organigramme;
