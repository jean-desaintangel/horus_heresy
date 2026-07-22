/* ============================================================
   organigramme.js — Assistant de Sélection d'Armée (unites.html)
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
    detachements: [],
  };

  // Légions temporairement grisées malgré la présence d'unités qui
  // leur sont réservées (ex. transcription en cours de relecture).
  // Retirer l'entrée ici suffit à réactiver la sélection.
  const LEGIONS_INDISPONIBLES = [];

  // Factions du menu « Faction » (p. 282, « Armée » au Livre de Règles) :
  // Legio Astartes, Legio Titanicus et Chevaliers Questoris sont
  // activées, les autres restent grisées en attendant leur livre
  // d'armée respectif. Chevaliers Questoris n'a pas encore d'unité
  // transcrite (voir MAISONNEES/SKINS_MAISONNEE ci-dessous) : le menu
  // « Maisonnée » qui remplace le menu Légion pour cette Faction pose
  // seulement le cadre (skin, état, organigramme vierge) en attendant.
  const FACTIONS = [
    ["legio-astartes", "Legio Astartes", true],
    ["legio-titanicus", "Legio Titanicus", true],
    ["chevaliers-questoris", "Chevaliers Questoris", true],
    ["legio-custodes", "Legio Custodes", false],
    ["solar-auxilia", "Solar Auxilia", false],
    ["mechanicum", "Mechanicum", false],
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

  // Types de Maisonnée du livre d'armée Chevaliers Questoris, choisis
  // à la place d'une Légion pour cette Faction (menu « Maisonnée »,
  // voir construireParametres) : à la différence d'une Légion, le
  // type de Maisonnée n'impose pas d'Allégeance (le joueur la choisit
  // librement via le menu Allégeance, comme pour toute autre Faction).
  const MAISONNEES = [
    ["imperialis", "Questoris Imperialis"],
    ["mechanicum", "Questoris Mechanicum"],
    ["mendicus", "Questoris Mendicus"],
  ];

  /* Skins thématiques (page unites.html) : quand une Légion listée ici
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
     pages/unites.html). */
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

  /* Blasons de Légion (assets/logo_legions/*.png) : bannières
     héraldiques officielles, une par Légion. La clé est le slug
     `icone` de SKINS_LEGION ci-dessus ; la valeur est le nom de
     fichier réel sous assets/logo_legions/ (quelques fichiers ont une
     coquille dans leur nom — ex. "scpace_wolves.png",
     "salamenders.png", conservées telles quelles pour ne pas casser
     le lien vers le fichier). */
  const LOGOS_LEGION = {
    "dark-angels": "dark_angels",
    "emperors-children": "emperor_children",
    "iron-warriors": "iron_warriors",
    "white-scars": "white_scars",
    "space-wolves": "scpace_wolves",
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
    salamanders: "salamenders",
    "raven-guard": "raven_guards",
    "alpha-legion": "alpha_legion",
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

  // id du type de Détachement Principal correspondant à la Faction
  // actuelle (etat.faction) : "principal" (Legiones Astartes) ou
  // "ordinal-titanique" (Legio Titanicus, livre d'armée Legio
  // Titanicus). Consommé partout où le Détachement Principal était
  // jusqu'ici codé en dur sous l'id "principal" (initialiser,
  // reinitialiserArmeeAvecConfirmation).
  function idDetachementPrincipal() {
    if (etat.faction === "legio-titanicus") return "ordinal-titanique";
    if (etat.faction === "chevaliers-questoris") return "maisonnees-chevaliers";
    return "principal";
  }

  // Ce type de Détachement doit-il être proposé/accepté pour la Faction
  // actuelle (etat.faction) ? Même règle par défaut que caseAccepte()
  // pour les unités : `factionLibre` dispense de la vérification,
  // sinon le type est réservé à `faction` (ou à Legio Astartes si ce
  // champ est absent, voir MODÈLE DE DONNÉES dans organigramme-data.js).
  // Utilisé par construireAjoutDetachements() et suggestionPourRole().
  function typeDisponiblePourFaction(type) {
    return (
      type.factionLibre || (type.faction || "legio-astartes") === etat.faction
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
     Auxiliaires au lieu d'un seul. */
  function valeurOfficierDeLigne(occ) {
    for (const regle of varianteDe(occ).regles || []) {
      const m = /officier de ligne\s*\((\d+)\)/i.exec(regle);
      if (m) return Number(m[1]);
    }
    return 1;
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
    } else if (factionUnite !== (type.faction || "legio-astartes")) {
      return false;
    }
    // Légion (p. 283) : une unité réservée à une Légion (champ
    // `legion`, js/unites-data.js) ne peut occuper une Case que dans un
    // détachement de SA Légion — celle de l'Armée (Principal, Seigneur
    // de Guerre/des Batailles, Auxiliaires, Apex), ou celle propre au
    // Détachement Allié qui l'accueille (menu « Légion Alliée » de sa
    // carte, vide tant qu'elle n'est pas choisie).
    if (unite.legion && !type.legionLibre) {
      const legionRequise =
        type.id === "allie" ? det.legionAlliee : etat.legion;
      if (unite.legion !== legionRequise) return false;
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
      (caseOrga.principale ? " ★" : "") +
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
        if (caseOrga.uniteUid === uniteUid && caseOrga.principale) {
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
              ? valeurOfficierDeLigne(occ)
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
     Demi-compagnie Reco). Chaque unité ne débloque qu'UN détachement. */
  function debloqueursDisponibles(type) {
    if (!type.deblocage) return Infinity;
    if (
      type.deblocage.allegeance &&
      etat.allegeance !== type.deblocage.allegeance
    )
      return 0;
    let presentes = 0;
    for (const det of etat.detachements) {
      for (const caseOrga of det.cases) {
        if (caseOrga.role !== type.deblocage.caseRole) continue;
        const occ = occupant(caseOrga);
        if (occ && type.deblocage.uniteIds.includes(occ.unite.id))
          presentes += 1;
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
    if (
      type.requiertAvantage &&
      !etat.detachements.some((d) =>
        d.cases.some((c) => c.avantage === type.requiertAvantage),
      )
    ) {
      const avantage = avantageParId(type.requiertAvantage);
      return {
        possible: false,
        raison:
          "Nécessite l'Avantage Principal « " +
          (avantage ? avantage.nom : type.requiertAvantage) +
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
      if (type.deblocage && debloqueursDisponibles(type) <= 0) {
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

  // Coût des Unités exemptées de la Limite de Points (Détachement
  // Narratif) : affiché à part dans construireBarre() pour ne pas
  // laisser croire que ces points ont disparu sans trace.
  function coutExempteLimite() {
    return hooks
      .getArmee()
      .reduce(
        (somme, i) =>
          estExempteLimite(i.uid)
            ? somme + hooks.coutInstance(hooks.trouverUnite(i.uniteId), i)
            : somme,
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
    // Seigneur des Batailles peut alors consommer tous les Points.
    const seigneurs = coutSeigneurs();
    const plafond25 = Math.ceil(etat.limite * 0.25);
    const quotaSeigneursIgnore =
      idDetachementPrincipal() === "ordinal-titanique";
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
        !etat.detachements.some((d) =>
          d.cases.some((c) => c.avantage === type.requiertAvantage),
        )
      ) {
        const avantage = avantageParId(type.requiertAvantage);
        erreurs.push(
          "« " +
            type.nom +
            " » nécessite l'Avantage Principal « " +
            (avantage ? avantage.nom : type.requiertAvantage) +
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
      if (avantage.unParArmee && parIdArmee[avantage.id] > 1) {
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
    for (const avantage of AVANTAGES_PRINCIPAUX) {
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
      const extraIdx = det.cases.findIndex((c) => c.extra);
      if (extraIdx !== -1) {
        if (det.cases[extraIdx].uniteUid !== null) {
          return (
            "La case ajoutée par « " +
            ancienAvantage.nom +
            " » est occupée : retirez ou déplacez d'abord son unité."
          );
        }
        det.cases.splice(extraIdx, 1);
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
      // dans cette liste est alors préaffecté directement.
      const rolesPossibles = nouvelAvantage.rolesCaseAjoutee;
      det.cases.push({
        role:
          rolesPossibles && rolesPossibles.length === 1
            ? rolesPossibles[0]
            : null,
        principale: false,
        uniteUid: null,
        avantage: "aucun",
        extra: true,
        origineAvantage: nouvelId,
      });
    }
    retirerDetachementsAvantageInvalide();
    actualiser();
    return null;
  }

  /* Retire tout Détachement dont la condition `requiertAvantage` n'est
     plus remplie nulle part dans l'Armée (ex : Serre d'Armigères,
     débloqué par Preux Aspirant) après un changement d'Avantage
     Principal — contrairement à requiertAllegeance/requiertRiteDeGuerre,
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
        if (
          !type.requiertAvantage ||
          etat.detachements.some((d) =>
            d.cases.some((c) => c.avantage === type.requiertAvantage),
          )
        )
          continue;
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
          detachements: etat.detachements.map((d) => ({
            typeId: d.typeId,
            factionAlliee: d.factionAlliee || null,
            legionAlliee: d.legionAlliee || null,
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
        // Case supplémentaire d'un Avantage `ajouteCase` éventuelle
        // (Bénéfice Logistique, Le Salaire de la Traîtrise).
        const extraSauvee = casesSauvees.find((c) => c && c.extra);
        if (extraSauvee) {
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
        det.cases.forEach((caseOrga, indice) => {
          const sauvee = caseOrga.extra ? extraSauvee : casesSauvees[indice];
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
    } catch {
      /* JSON invalide : on repart de zéro */
    }
  }

  /* Réconciliation après restauration : on retire les références à
     des unités disparues, les doublons, et les placements devenus
     illégaux (données altérées ou fiche d'unité modifiée). */
  function reconcilier() {
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
      const extraIdx = det.cases.findIndex((c) => c.extra);
      if (extraIdx === -1) continue;
      const origine =
        det.cases[extraIdx].origineAvantage || "benefice-logistique";
      const encoreAccorde = det.cases.some(
        (c) => !c.extra && c.avantage === origine,
      );
      if (!encoreAccorde) det.cases.splice(extraIdx, 1);
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
  function construireBadge(caseOrga) {
    const role = ROLES_TACTIQUES[caseOrga.role];
    const badge = el(
      "span",
      "orga-badge" + (caseOrga.principale ? " orga-badge--principale" : ""),
      role ? role.abrev : "?",
    );
    badge.tabIndex = 0;
    if (role) {
      badge.appendChild(
        el(
          "span",
          "tooltip",
          role.livre +
            (caseOrga.principale ? " (Case Principale)" : "") +
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
    selectAllegeance.value = etat.allegeance;
    selectAllegeance.disabled = Boolean(allegeanceForcee);
    if (allegeanceForcee) {
      selectAllegeance.title =
        "Allégeance imposée par le Rite de Guerre « " + riteActif.nom + " ».";
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
    // blason (sprite <symbol> de pages/unites.html) sur le titre de
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
    const skinLegion = SKINS_LEGION[etat.legion];
    activerBandeauMagnus(etat.legion === "XV");
    const skinTitan =
      etat.faction === "legio-titanicus" ? SKIN_TITANICUS : null;
    const skinMaison = SKINS_MAISONNEE[etat.maisonnee] || null;
    const titre = document.querySelector("h1.titre-page");
    if (titre) {
      // querySelectorAll (pas querySelector) : Legio Titanicus pose DEUX
      // blasons sur le titre (gauche + droite ci-dessous), contre un
      // seul pour une Légion Astartes — il faut retirer les deux au
      // changement de Faction/Légion, pas juste le premier trouvé.
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
            " · Monde Natal : " +
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
      // Rouage Mechanicum décoratif (héraldique Titanicus) : purement
      // ornemental, comme les blasons ci-dessus (aria-hidden).
      const rouage = el("span", "legion-titan-cog", "⚙");
      rouage.setAttribute("aria-hidden", "true");
      entete.appendChild(rouage);
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
    }
  }

  /* Barre de points + compteurs + erreurs (aria-live : les lecteurs
     d'écran annoncent les violations de règles en temps réel). */
  function construireBarre(conteneur) {
    conteneur.replaceChildren();
    const total = coutTotalArmee();
    const totalExempte = coutExempteLimite();
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
          : coutSeigneurs() +
            " / " +
            Math.ceil(etat.limite * 0.25) +
            " pts (25 %)") +
        (totalExempte > 0
          ? " · Détachement Narratif : " + totalExempte + " pts (hors Limite)"
          : ""),
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
     uniquement pour une Armée Legio Titanicus (pour une Armée Legio
     Astartes, la Faction Alliée reste "legio-astartes" — seule la
     Légion varie, via construireSelectLegionAlliee ci-dessous, comme
     avant l'ajout de ce menu). Legio Titanicus n'ayant pas de
     subdivision en Légions, la Faction de l'Armée elle-même y est
     exclue (une Faction Alliée doit différer de celle du Détachement
     Principal, p. 283). Changer la sélection retire toutes les unités
     déjà placées dans ce Détachement (leur Faction ne correspondrait
     plus forcément à la nouvelle). */
  function construireSelectFactionAlliee(det) {
    const ligne = el("p", "orga-detachement-faction");
    const label = el("label", null, "Faction Alliée ");
    const select = document.createElement("select");
    select.setAttribute("aria-label", "Faction du Détachement Allié");
    ajouterOption(select, "", "— Choisir la Faction Alliée —");
    for (const [valeur, texte, disponible] of FACTIONS) {
      const memeQueArmee = valeur === etat.faction;
      const dispo = disponible && !memeQueArmee;
      const opt = ajouterOption(
        select,
        valeur,
        texte +
          (memeQueArmee
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
      det.legionAlliee = "";
      actualiser();
    });
    label.appendChild(select);
    ligne.appendChild(label);
    return ligne;
  }

  /* Menu « Légion Alliée » d'une carte de Détachement Allié (p. 283 :
     Faction différente de celle du Détachement Principal). Suit
     exactement la logique du menu « Légion » des paramètres de la
     partie (construireParametres) : seules les Légions ayant des
     unités transcrites sont sélectionnables, et on y exclut en plus la
     Légion de l'Armée elle-même. Changer la sélection retire du
     détachement les unités réservées à l'ancienne Légion Alliée (les
     unités génériques restent, elles ne dépendent d'aucune Légion). */
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
    select.addEventListener("change", () => {
      const nouvelle = select.value;
      if (nouvelle === det.legionAlliee) return;
      const casesConcernees = det.cases.filter((c) => {
        if (c.uniteUid === null) return false;
        const occ = occupant(c);
        return Boolean(
          occ && occ.unite.legion && occ.unite.legion !== nouvelle,
        );
      });
      if (
        casesConcernees.length > 0 &&
        !window.confirm(
          "Changer la Légion Alliée retire " +
            casesConcernees.length +
            " unité(s) réservée(s) à l'ancienne Légion de ce Détachement. Continuer ?",
        )
      ) {
        select.value = det.legionAlliee || "";
        return;
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
        if (
          occCase &&
          occCase.unite.traits.includes(avantageActuel.traitRequis)
        )
          continue;
        if (
          SKINS_LEGION[nouvelle] &&
          SKINS_LEGION[nouvelle].nom === avantageActuel.traitRequis
        )
          continue;
        if (avantageActuel.ajouteCase) {
          const extraIdx = det.cases.findIndex((x) => x.extra);
          if (extraIdx !== -1 && det.cases[extraIdx].uniteUid !== null)
            continue;
          if (extraIdx !== -1) det.cases.splice(extraIdx, 1);
        }
        c.avantage = "aucun";
      }
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
    const nomEtInfo = el("span", "regle-tag");
    nomEtInfo.tabIndex = 0;
    nomEtInfo.appendChild(document.createTextNode(type.nom));
    nomEtInfo.appendChild(el("span", "tooltip", type.texte));
    titre.appendChild(nomEtInfo);
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
      if (etat.faction === "legio-titanicus") {
        carte.appendChild(construireSelectFactionAlliee(det));
      }
      if (det.factionAlliee === "legio-astartes") {
        carte.appendChild(construireSelectLegionAlliee(det));
      }
    }

    const liste = el("ul", "orga-cases-liste");
    det.cases.forEach((caseOrga, indice) => {
      const li = el(
        "li",
        "orga-case" + (caseOrga.uniteUid !== null ? " orga-case--occupee" : ""),
      );
      li.appendChild(construireBadge(caseOrga));

      const contenu = el("div", "orga-case-contenu");
      const role = ROLES_TACTIQUES[caseOrga.role];
      contenu.appendChild(
        el(
          "p",
          "orga-case-role",
          (role ? role.livre : caseOrga.role || "Rôle à choisir") +
            (caseOrga.principale ? " — Case Principale" : "") +
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
      if (caseOrga.extra || caseOrga.libre) {
        const origineExtra = avantageParId(caseOrga.origineAvantage);
        const rolesPossiblesExtra = caseOrga.libre
          ? Object.keys(ROLES_TACTIQUES)
          : (origineExtra && origineExtra.rolesCaseAjoutee) ||
            Object.keys(ROLES_TACTIQUES).filter(
              (cle) => !ROLES_INTERDITS_LOGISTIQUE.includes(cle),
            );
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

        // Avantage Principal (cases principales occupées, p. 283).
        if (caseOrga.principale) {
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
        const retirerCase = el(
          "button",
          "unite-retirer",
          "Retirer cette case",
        );
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
          if (caseOrga.uniteUid !== null) hooks.retirerInstance(caseOrga.uniteUid);
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
      const groupe = document.createElement("details");
      groupe.className = "orga-ajout-groupe";
      groupe.dataset.famille = famille;
      groupe.open = famille in etatsOuverts ? etatsOuverts[famille] : false;
      groupe.appendChild(el("summary", null, titreFamille));
      const ligne = el("div", "orga-ajout-boutons");
      for (const type of TYPES_DETACHEMENTS.filter(
        (t) =>
          t.famille === famille &&
          (!t.legion || t.legion === etat.legion) &&
          typeDisponiblePourFaction(t),
      )) {
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
              (caseOrga.principale ? " ★" : "") +
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
    // Le tutoriel de construction d'armée (unites.html) ne décrit que
    // l'Organigramme de Force des Legiones Astartes (Détachement
    // Principal de Croisade, États-Majors…) : sans objet pour Legio
    // Titanicus, qui suit son propre Détachement Principal (Ordinal
    // Titanique). Entièrement masqué, comme Légion/Rite de Guerre
    // ci-dessous, plutôt que simplement grisé.
    const sectionTutoriel = document.getElementById("construction-armee");
    if (sectionTutoriel) {
      sectionTutoriel.hidden = etat.faction !== "legio-astartes";
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
    // Maisonnée choisie dans les paramètres de la partie ("" = aucune,
    // Faction Chevaliers Questoris uniquement) : consommée par
    // js/unites.js pour verrouiller le sélecteur « Unité à ajouter »
    // tant qu'aucune Maisonnée n'est choisie, comme legionActuelle()
    // ci-dessus pour Legio Astartes.
    maisonneeActuelle: () => etat.maisonnee,
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
    // Un Détachement Narratif est-il présent dans l'Armée ? Consommée
    // par js/unites.js (uniteAccessible) pour lever, dès qu'il est
    // présent, les vérifications de Faction/Légion/Allégeance du
    // sélecteur « Unité à ajouter » — ce Détachement acceptant
    // n'importe quelle Unité (caseAccepte() reste seul juge du
    // placement réel dans les AUTRES détachements de l'Armée).
    narratifPresent: () =>
      etat.detachements.some((d) => typeDe(d).id === "narratif"),
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
    // « Vider la liste » : libère toutes les cases (les détachements
    // restent, mais leurs cases supplémentaires de Bénéfice Logistique
    // n'ont plus lieu d'être puisque plus aucune case n'est occupée).
    toutLiberer() {
      for (const det of etat.detachements) {
        for (const caseOrga of det.cases) {
          caseOrga.uniteUid = null;
          caseOrga.avantage = "aucun";
        }
        det.cases = det.cases.filter((c) => !c.extra);
      }
      actualiser();
    },
    actualiser,
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
