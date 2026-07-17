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
    limite: 3000, // Limite de Points de la partie
    allegeance: "loyaliste", // "loyaliste" | "renegat" (Vrais Croyants)
    legion: "", // id LEGIONS ou "" (Choisir Légion)
    detachements: [],
  };

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
      devise:
        "Chevaliers de Caliban, les fils du Lion gardent un secret plus lourd que leurs épées : celui des Frères Déchus qu'ils traquent sans repos.",
    },
    III: {
      classe: "skin-legion-iii",
      icone: "emperors-children",
      nom: "Emperor's Children",
      primarque: "Fulgrim",
      monde: "Chemos",
      devise:
        "Nés dans les brumes toxiques de Chemos, les fils de Fulgrim ne recherchent qu'une chose : la perfection absolue, jusqu'à l'obsession.",
    },
    IV: {
      classe: "skin-legion-iv",
      icone: "iron-warriors",
      nom: "Iron Warriors",
      primarque: "Perturabo",
      monde: "Olympia",
      devise:
        "Rancuniers et increvables, les fils de Perturabo ne connaissent que la guerre de siège : pierre après pierre, bastion après bastion, jusqu'à la victoire.",
    },
    V: {
      classe: "skin-legion-v",
      icone: "white-scars",
      nom: "White Scars",
      primarque: "Jaghatai Khan",
      monde: "Chogoris",
      devise:
        "Cavaliers de Chogoris, les fils de Jaghatai Khan frappent à la vitesse du vent et ne laissent à l'ennemi que la poussière de leur passage.",
    },
    VI: {
      classe: "skin-legion-vi",
      icone: "space-wolves",
      nom: "Space Wolves",
      primarque: "Leman Russ",
      monde: "Fenris",
      devise:
        "Nés dans la glace de Fenris, les fils de Leman Russ chassent en meute et ne connaissent d'autre loi que celle du loup.",
    },
    VII: {
      classe: "skin-legion-vii",
      icone: "imperial-fists",
      nom: "Imperial Fists",
      primarque: "Rogal Dorn",
      monde: "Terra (Inwit)",
      devise:
        "Bâtisseurs increvables, les fils de Rogal Dorn tiennent leurs murs jusqu'au dernier homme : reculer n'est pas un mot qu'ils connaissent.",
    },
    VIII: {
      classe: "skin-legion-viii",
      icone: "night-lords",
      nom: "Night Lords",
      primarque: "Konrad Curze",
      monde: "Nostramo",
      devise:
        "Nés dans l'ombre de Nostramo, les fils de Konrad Curze sèment une terreur si totale que la résistance meurt avant le premier coup.",
    },
    IX: {
      classe: "skin-legion-ix",
      icone: "blood-angels",
      nom: "Blood Angels",
      primarque: "Sanguinius",
      monde: "Baal",
      devise:
        "Hantée par la Soif Rouge et la Rage Noire, la IXe Légion mène la charge avec une noblesse et une fureur qui n'appartiennent qu'à elle.",
    },
    X: {
      classe: "skin-legion-x",
      icone: "iron-hands",
      nom: "Iron Hands",
      primarque: "Ferrus Manus",
      monde: "Medusa",
      devise:
        "Sur Médusa, la chair est faiblesse : les fils de Ferrus Manus remplacent leurs membres par l'acier et ne pleurent jamais leurs pertes.",
    },
    XII: {
      classe: "skin-legion-xii",
      icone: "world-eaters",
      nom: "World Eaters",
      primarque: "Angron",
      monde: "—",
      devise:
        "Rongés par les Clous du Boucher, les fils d'Angron ne connaissent plus la retraite : seule la rage guide leurs haches jusqu'au dernier ennemi debout.",
    },
    XIII: {
      classe: "skin-legion-xiii",
      icone: "ultramarines",
      nom: "Ultramarines",
      primarque: "Roboute Guilliman",
      monde: "Macragge",
      devise:
        "Fils de Guilliman, les Ultramarines incarnent la discipline et la civilisation : chaque bataille suit un plan, chaque plan sert l'Imperium.",
    },
    XIV: {
      classe: "skin-legion-xiv",
      icone: "death-guard",
      nom: "Death Guard",
      primarque: "Mortarion",
      monde: "Barbarus",
      devise:
        "Endurcis par les miasmes de Barbarus, les fils de Mortarion refusent de tomber : leur endurance est aussi implacable que la faux qu'ils portent.",
    },
    XV: {
      classe: "skin-legion-xv",
      icone: "thousand-sons",
      nom: "Thousand Sons",
      primarque: "Magnus le Rouge",
      monde: "Prospero",
      devise:
        "Érudits de Prospero, les fils de Magnus le Rouge manient les arcanes psychiques avec une soif de savoir qui n'a d'égale que leur puissance.",
    },
    XVI: {
      classe: "skin-legion-xvi",
      icone: "sons-of-horus",
      nom: "Sons of Horus",
      primarque: "Horus Lupercal",
      monde: "Cthonia",
      devise:
        "Fils de Cthonia, les Sons of Horus suivent leur Primarque en toute chose — et c'est cette loyauté sans faille qui, un jour maudit, embrasa la galaxie.",
    },
    XVII: {
      classe: "skin-legion-xvii",
      icone: "word-bearers",
      nom: "Word Bearers",
      primarque: "Lorgar",
      monde: "Colchis",
      devise:
        "Nés dans la foi de Colchis, les fils de Lorgar ne se battent pas seulement pour l'Empereur : ils cherchent un dieu à vénérer, et ne s'arrêteront devant rien pour le trouver.",
    },
    XVIII: {
      classe: "skin-legion-xviii",
      icone: "salamanders",
      nom: "Salamanders",
      primarque: "Vulkan",
      monde: "Nocturne",
      devise:
        "Forgés dans les volcans de Nocturne, les fils de Vulkan protègent l'humanité comme un père protège ses enfants — et frappent comme le marteau frappe l'enclume.",
    },
    XIX: {
      classe: "skin-legion-xix",
      icone: "raven-guard",
      nom: "Raven Guard",
      primarque: "Corvus Corax",
      monde: "Deliverance",
      devise:
        "Fils de Corvus Corax, les Raven Guard frappent depuis l'ombre de Deliverance et disparaissent avant que l'ennemi ait pu riposter.",
    },
    XX: {
      classe: "skin-legion-xx",
      icone: "alpha-legion",
      nom: "Alpha Legion",
      primarque: "Alpharius et Omegon",
      monde: "—",
      devise:
        "Légion de l'ombre aux mille visages, les fils d'Alpharius et Omegon frappent partout à la fois : couper une tête n'a jamais suffi à tuer l'hydre.",
    },
  };

  const ESPACE_NOM_SVG = "http://www.w3.org/2000/svg";

  /* Icône <svg><use> pointant vers le sprite de symboles posé dans
     pages/unites.html (<symbol id="icon-...">). Colorée via
     currentColor (voir .legion-stroke du sprite et .legion-icon de
     css/style.css) : elle suit automatiquement --accent du skin actif,
     sans variante par couleur à maintenir. document.createElementNS
     est indispensable ici — document.createElement("svg") ne produit
     pas un élément SVG utilisable. */
  function creerIconeLegion(id, classeSupplementaire) {
    const svg = document.createElementNS(ESPACE_NOM_SVG, "svg");
    svg.setAttribute(
      "class",
      classeSupplementaire ? "legion-icon " + classeSupplementaire : "legion-icon",
    );
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    const use = document.createElementNS(ESPACE_NOM_SVG, "use");
    use.setAttribute("href", "#icon-" + id);
    svg.appendChild(use);
    return svg;
  }

  let compteurDet = 0;
  let hooks = null; // fournis par js/unites.js (voir initialiser)

  const CLE_STOCKAGE_ORGA = "hh-armee-organigramme";

  /* ----------------------------------------------------------
     OUTILS DONNÉES
     ---------------------------------------------------------- */
  function typeDe(det) {
    return TYPES_DETACHEMENTS.find((t) => t.id === det.typeId);
  }

  function trouverDetachement(uid) {
    return etat.detachements.find((d) => d.uid === uid);
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

  /* Sous-types d'une instance, lus dans la ligne « Type » de la
     variante choisie (ex : "Sergent : Infanterie (Sergent) ·
     Légionnaire : Infanterie"). Sert aux conditions des Avantages
     Principaux : Sergent (Maître-sergent), État-major (Parangon de
     Bataille) et Unique (seul Bénéfice Logistique autorisé, p. 283). */
  function aSousType(occ, sousType) {
    const variante =
      occ.unite.variantes[occ.instance.variante] || occ.unite.variantes[0];
    return variante.type.includes(sousType);
  }

  /* Règle « Officier de Ligne (X) » (livre d'armée) : la Case
     d'État-major occupée par cette unité débloque X Détachements
     Auxiliaires au lieu d'un seul. */
  function valeurOfficierDeLigne(occ) {
    const variante =
      occ.unite.variantes[occ.instance.variante] || occ.unite.variantes[0];
    for (const regle of variante.regles || []) {
      const m = /officier de ligne\s*\((\d+)\)/i.exec(regle);
      if (m) return Number(m[1]);
    }
    return 1;
  }

  function creerDetachement(typeId) {
    const type = TYPES_DETACHEMENTS.find((t) => t.id === typeId);
    return {
      uid: ++compteurDet,
      typeId,
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
        if (caseOrga.extra && !caseOrga.role) return; // rôle pas encore choisi
        if (!caseAccepte(det, caseOrga, unite)) return;
        // Une unité de Quartier Général visant une Case Principale
        // d'État-major n'y est légale que via l'Avantage Principal
        // « Affectation Spéciale » (voir assigner et caseAccepte) : on
        // l'indique dans le libellé du sélecteur « Case » pour que ce
        // placement — et son effet (pas de détachement débloqué) —
        // soit visible avant même de le choisir.
        const viaAffectationSpeciale =
          unite.categorie === "Quartier Général" && caseOrga.role === "État-major";
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
              if (extra.uniteUid !== null) hooks.retirerInstance(extra.uniteUid);
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
     du bouton grisé (exigence UX : expliquer pourquoi). */
  function disponibilite(type) {
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
    if (type.pointsMin && etat.limite < type.pointsMin) {
      return {
        possible: false,
        raison:
          "Réservé aux parties d'au moins " + type.pointsMin + " pts (p. 283).",
      };
    }
    const credits = calculerCredits();
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
        const noms = type.deblocage.uniteIds
          .map((id) =>
            hooks.trouverUnite(id) ? hooks.trouverUnite(id).nom : id,
          )
          .join(" ou ");
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

  function coutTotalArmee() {
    return hooks
      .getArmee()
      .reduce(
        (somme, i) =>
          somme + hooks.coutInstance(hooks.trouverUnite(i.uniteId), i),
        0,
      );
  }

  // Coût combiné des Rôles Seigneur de Guerre + Seigneur des Batailles.
  function coutSeigneurs() {
    return hooks.getArmee().reduce((somme, i) => {
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
     ---------------------------------------------------------- */
  function validerArmee() {
    const erreurs = [];
    const credits = calculerCredits();
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
    const seigneurs = coutSeigneurs();
    const plafond25 = Math.ceil(etat.limite * 0.25);
    if (etat.limite >= 3000 && seigneurs > plafond25) {
      erreurs.push(
        "Quota Seigneur de Guerre + Seigneur des Batailles dépassé : " +
          seigneurs +
          " pts pour un maximum combiné de " +
          plafond25 +
          " pts (25 % de la Limite, arrondi supérieur).",
      );
    }
    if (
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
            type.deblocage.uniteIds
              .map((id) => (hooks.trouverUnite(id) || { nom: id }).nom)
              .join(" ou ") +
            ") occupant une Case " +
            type.deblocage.caseRole +
            ".",
        );
      }
    }

    // 6. Avantages Principaux (p. 283).
    for (const det of etat.detachements) {
      const parId = {};
      for (const caseOrga of det.cases) {
        if (caseOrga.avantage !== "aucun")
          parId[caseOrga.avantage] = (parId[caseOrga.avantage] || 0) + 1;
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
    const occ = occupant(caseOrga);
    const resultat = [];
    for (const avantage of AVANTAGES_PRINCIPAUX) {
      let raison = "";
      if (
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
      } else if (avantage.caseEM && caseOrga.role !== "État-major") {
        raison = "Réservé aux Cases d'État-major.";
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
        avantage.id === "affectation-speciale" &&
        occ &&
        occ.unite.categorie === "Quartier Général"
      ) {
        // Une unité QG en case État-major n'est légale QUE via cet
        // avantage : il est alors verrouillé (non désélectionnable).
      }
      resultat.push({ avantage, grise: raison !== "", raison });
    }
    return resultat;
  }

  /* Change l'avantage d'une case. Gère la case supplémentaire du
     Bénéfice Logistique : ajout à la sélection, retrait au
     changement (bloqué si la case ajoutée est occupée). Retourne
     un message d'erreur ou null si tout va bien. */
  function changerAvantage(det, indice, nouvelId) {
    const caseOrga = det.cases[indice];
    const occ = occupant(caseOrga);
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
      caseOrga.avantage === "benefice-logistique" &&
      nouvelId !== "benefice-logistique"
    ) {
      const extraIdx = det.cases.findIndex((c) => c.extra);
      if (extraIdx !== -1) {
        if (det.cases[extraIdx].uniteUid !== null) {
          return "La case ajoutée par le Bénéfice Logistique est occupée : retirez ou déplacez d'abord son unité.";
        }
        det.cases.splice(extraIdx, 1);
      }
    }
    caseOrga.avantage = nouvelId;
    if (nouvelId === "benefice-logistique" && !det.cases.some((c) => c.extra)) {
      det.cases.push({
        role: null,
        principale: false,
        uniteUid: null,
        avantage: "aucun",
        extra: true,
      });
    }
    actualiser();
    return null;
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
          allegeance: etat.allegeance,
          legion: etat.legion,
          detachements: etat.detachements.map((d) => ({
            typeId: d.typeId,
            cases: d.cases.map((c) => ({
              role: c.role,
              uniteUid: c.uniteUid,
              avantage: c.avantage,
              extra: c.extra,
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
      if (!Array.isArray(donnees.detachements)) return;
      // On revalide tout : les données du navigateur ne sont jamais
      // considérées comme sûres.
      for (const brute of donnees.detachements) {
        const type = TYPES_DETACHEMENTS.find((t) => t.id === brute.typeId);
        if (!type) continue;
        const det = creerDetachement(type.id);
        const casesSauvees = Array.isArray(brute.cases) ? brute.cases : [];
        // Case supplémentaire du Bénéfice Logistique éventuelle.
        const extraSauvee = casesSauvees.find((c) => c && c.extra);
        if (extraSauvee) {
          det.cases.push({
            role:
              typeof extraSauvee.role === "string" ? extraSauvee.role : null,
            principale: false,
            uniteUid: null,
            avantage: "aucun",
            extra: true,
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
    // Case supplémentaire de Bénéfice Logistique devenue orpheline
    // (données anciennes/altérées où plus aucune case du détachement
    // ne porte cet avantage) : on la retire, comme le fait déjà
    // `liberer` pour les cas normaux.
    for (const det of etat.detachements) {
      const extraIdx = det.cases.findIndex((c) => c.extra);
      if (extraIdx === -1) continue;
      const encoreAccorde = det.cases.some(
        (c) => !c.extra && c.avantage === "benefice-logistique",
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

  // Paramètres de la partie : Limite de Points + Allégeance.
  function construireParametres(conteneur) {
    conteneur.replaceChildren();
    const ligne = el("div", "orga-parametres");

    const labelLimite = el("label", null, "Limite de Points de la partie ");
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
    ligne.appendChild(labelLimite);
    ligne.appendChild(champLimite);

    const labelAllegeance = el("label", null, "Allégeance ");
    const selectAllegeance = document.createElement("select");
    selectAllegeance.id = "allegeance-armee";
    labelAllegeance.htmlFor = selectAllegeance.id;
    for (const [valeur, texte] of [
      ["loyaliste", "Loyaliste"],
      ["renegat", "Traitre"],
    ]) {
      const opt = document.createElement("option");
      opt.value = valeur;
      opt.textContent = texte;
      selectAllegeance.appendChild(opt);
    }
    selectAllegeance.value = etat.allegeance;
    selectAllegeance.addEventListener("change", () => {
      etat.allegeance = selectAllegeance.value;
      actualiser();
    });
    ligne.appendChild(labelAllegeance);
    ligne.appendChild(selectAllegeance);

    const labelLegion = el("label", null, "Légion ");
    const selectLegion = document.createElement("select");
    selectLegion.id = "legion-armee";
    labelLegion.htmlFor = selectLegion.id;
    const optChoisir = document.createElement("option");
    optChoisir.value = "";
    optChoisir.textContent = "Choisir Legion";
    selectLegion.appendChild(optChoisir);
    for (const [valeur, texte] of LEGIONS) {
      const opt = document.createElement("option");
      opt.value = valeur;
      opt.textContent = texte;
      selectLegion.appendChild(opt);
    }
    selectLegion.value = etat.legion;
    selectLegion.addEventListener("change", () => {
      etat.legion = selectLegion.value;
      actualiser();
    });
    ligne.appendChild(labelLegion);
    ligne.appendChild(selectLegion);

    conteneur.appendChild(ligne);

    // Skin thématique : recolore tout le site (variables CSS), pose le
    // blason (sprite <symbol> de pages/unites.html) sur le titre de
    // page et ajoute un bandeau de contexte historique sous les
    // paramètres.
    for (const info of Object.values(SKINS_LEGION)) {
      document.body.classList.remove(info.classe);
    }
    const skin = SKINS_LEGION[etat.legion];
    const titre = document.querySelector("h1.titre-page");
    if (titre) {
      const ancienneIcone = titre.querySelector(".legion-icon");
      if (ancienneIcone) ancienneIcone.remove();
      if (skin) {
        titre.insertBefore(
          creerIconeLegion(skin.icone, "legion-icon--titre"),
          titre.firstChild,
        );
      }
    }
    if (skin) {
      document.body.classList.add(skin.classe);
      const banniere = el("p", "legion-banniere");
      const entete = el("strong", "legion-item");
      entete.appendChild(creerIconeLegion(skin.icone));
      entete.appendChild(
        document.createTextNode(etat.legion + " – " + skin.nom),
      );
      banniere.appendChild(entete);
      banniere.appendChild(
        document.createTextNode(
          " · Primarque : " + skin.primarque + " · Monde Natal : " + skin.monde,
        ),
      );
      if (skin.devise) banniere.appendChild(el("em", null, skin.devise));
      conteneur.appendChild(banniere);
    }
  }

  /* Barre de points + compteurs + erreurs (aria-live : les lecteurs
     d'écran annoncent les violations de règles en temps réel). */
  function construireBarre(conteneur) {
    conteneur.replaceChildren();
    const total = coutTotalArmee();
    const credits = calculerCredits();
    const erreurs = validerArmee();

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
        " · Quota Seigneurs des Batailles (25 %) : " +
        coutSeigneurs() +
        " / " +
        Math.ceil(etat.limite * 0.25) +
        " pts",
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
        actualiser();
      });
      entete.appendChild(retirer);
    }
    carte.appendChild(entete);

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
            (caseOrga.extra ? " (Bénéfice Logistique)" : ""),
        ),
      );

      // Case supplémentaire du Bénéfice Logistique : choix du Rôle
      // Tactique (tout sauf QG, État-major, Seigneurs — p. 283).
      if (caseOrga.extra) {
        const selectRole = document.createElement("select");
        selectRole.className = "orga-case-role-select";
        selectRole.setAttribute(
          "aria-label",
          "Rôle Tactique de la case ajoutée",
        );
        const optVide = document.createElement("option");
        optVide.value = "";
        optVide.textContent = "— Choisir un Rôle Tactique —";
        selectRole.appendChild(optVide);
        for (const cle of Object.keys(ROLES_TACTIQUES)) {
          if (ROLES_INTERDITS_LOGISTIQUE.includes(cle)) continue;
          const opt = document.createElement("option");
          opt.value = cle;
          opt.textContent = ROLES_TACTIQUES[cle].livre;
          selectRole.appendChild(opt);
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
            const opt = document.createElement("option");
            opt.value = avantage.id;
            opt.textContent = avantage.nom;
            opt.disabled = grise;
            if (grise) opt.title = raison;
            selectAv.appendChild(opt);
          }
          selectAv.value = caseOrga.avantage;
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
      li.appendChild(contenu);
      liste.appendChild(li);
    });
    carte.appendChild(liste);
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
    const familles = [
      ["additionnel", "Détachements additionnels"],
      ["auxiliaire", "Détachements Auxiliaires"],
      ["apex", "Détachements d'Apex"],
    ];
    for (const [famille, titreFamille] of familles) {
      const groupe = document.createElement("details");
      groupe.className = "orga-ajout-groupe";
      groupe.dataset.famille = famille;
      groupe.open =
        famille in etatsOuverts ? etatsOuverts[famille] : false;
      groupe.appendChild(el("summary", null, titreFamille));
      const ligne = el("div", "orga-ajout-boutons");
      for (const type of TYPES_DETACHEMENTS.filter(
        (t) => t.famille === famille,
      )) {
        const { possible, raison } = disponibilite(type);
        const bouton = el(
          "button",
          "bouton-secondaire orga-ajout-bouton",
          "+ " + type.nom,
        );
        bouton.type = "button";
        bouton.disabled = !possible;
        // Info-bulle : description du détachement, ou raison du grisé.
        bouton.title = possible ? type.texte : raison;
        if (!possible) bouton.setAttribute("aria-disabled", "true");
        bouton.addEventListener("click", () => {
          etat.detachements.push(creerDetachement(type.id));
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
          (etat.allegeance === "renegat" ? "Traitre" : "Loyaliste") +
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
      // Le Détachement Principal est obligatoire et unique (p. 283) :
      // on le crée s'il manque, on ne garde que le premier sinon.
      const principaux = etat.detachements.filter(
        (d) => d.typeId === "principal",
      );
      if (principaux.length === 0)
        etat.detachements.unshift(creerDetachement("principal"));
      reconcilier();
      actualiser();
    },
    casesLibresPour,
    assignationDe,
    avantageDe,
    assigner,
    // Retrait d'une unité de la liste : on libère sa case puis on
    // laisse js/unites.js supprimer la carte, avant d'actualiser.
    libererEtActualiser(uniteUid) {
      liberer(uniteUid);
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
    // suggère quels détachements contiennent ce Rôle Tactique.
    suggestionPourRole(categorie) {
      const types = TYPES_DETACHEMENTS.filter(
        (t) =>
          !t.indisponible &&
          t.famille !== "principal" &&
          t.cases.some((c) => c.role === categorie),
      ).map((t) => t.nom);
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
