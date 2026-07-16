/* ============================================================
   unites-data.js — Données des unités QG / État-major
   Auteur : Jean · Créé : 2026-07-16
   Rôle   : encode les fiches d'unités du livre d'armée des
   Legiones Astartes (Quartier Général et État-major) ainsi que
   les Listes d'Équipement (p. 21). Aucune logique de rendu :
   les données sont consommées par js/unites.js (page unites.html).
   Dépend : aucun (vanilla JS). Doit être chargé avant js/unites.js.
   Transcription manuelle depuis le livre d'armée : en cas de
   doute, c'est toujours le livre qui fait référence.
   ============================================================

   MODÈLE DE DONNÉES (pour les étudiants) :

   Une unité = {
     id          : identifiant unique (sert aux ancres et au DOM),
     nom         : nom affiché,
     categorie   : "Quartier Général" ou "État-major",
     cout        : coût de base en Points,
     composition : rappel de la composition d'unité,
     traits      : liste de chaînes,
     equipement  : équipement de départ (liste de chaînes),
     variantes   : [{ nom, cout, profil, regles, type }, ...]
                   (au moins 1 ; ex : Praetor / Praetor à Réacteurs),
     options     : liste d'options (voir ci-dessous).
   }

   Un profil = { M, CC, CT, F, E, PV, I, A, Cd, Sf, Vo, Int, Sv, Inv }
   Un profil de véhicule = { M, CT, avant, flanc, arriere, PC, transport }

   Types d'options :
   - "choix" : menu déroulant. `remplace` = équipement retiré quand
     un choix (autre que « conserver ») est sélectionné. Chaque choix
     = { nom, cout } (+ éventuellement `remplace` propre au choix).
     `ajoute: true` = le choix s'ajoute sans rien remplacer.
   - "case"  : case à cocher simple. { cout, ajoute }.
   - "paire" : case à cocher qui remplace PLUSIEURS équipements
     à la fois (ex : paire de griffes Lightning). { cout, ajoute,
     remplaceListe: [...] }.
   - "multi" : plusieurs cases à cocher, limitées à `max` choix
     (ex : Disciplines Psychiques de l'Archiviste).
   Champs communs facultatifs :
   - variantesExclues : indices de variantes qui n'ont PAS accès
     à l'option (ex : cyber-familier interdit aux Réacteurs).
   ============================================================ */

/* ----------------------------------------------------------
   LISTES D'ÉQUIPEMENT (p. 21)
   Réutilisées par plusieurs unités via leurs options.
   ---------------------------------------------------------- */
const LISTES_EQUIPEMENT = {
  officier: {
    nom: "Équipement d'Officier de Légion",
    items: [
      { nom: "Pistolet bolter", cout: 0 },
      { nom: "Épée tronçonneuse", cout: 0 },
      { nom: "Bolter", cout: 0 },
      { nom: "Serpentine volkite", cout: 5 },
      { nom: "Lance-flammes léger", cout: 5 },
      { nom: "Pistolet à plasma", cout: 5 },
      { nom: "Pistolet désintégrateur", cout: 5 },
      { nom: "Hache tronçonneuse", cout: 0 },
      { nom: "Sabre charnabal", cout: 5 },
      { nom: "Arme énergétique", cout: 10 },
      { nom: "Gantelet énergétique", cout: 15 },
      { nom: "Griffe Lightning", cout: 10 },
      { nom: "Marteau Thunder", cout: 15 },
      { nom: "Bouclier de combat", cout: 0 },
      { nom: "Bouclier d'abordage", cout: 5 },
    ],
  },
  meleeTerminator: {
    nom: "Armes de Mêlée de Terminator de Légion",
    items: [
      { nom: "Griffe Lightning", cout: 5 },
      { nom: "Gantelet énergétique", cout: 10 },
      { nom: "Poing tronçonneur", cout: 10 },
      { nom: "Marteau Thunder", cout: 10 },
    ],
  },
  meleeSergent: {
    nom: "Armes de Mêlée de Sergent de Légion",
    items: [
      { nom: "Épée tronçonneuse", cout: 0 },
      { nom: "Hache tronçonneuse", cout: 0 },
      { nom: "Sabre charnabal", cout: 5 },
      { nom: "Arme énergétique", cout: 10 },
      { nom: "Marteau Thunder", cout: 15 },
      { nom: "Gantelet énergétique", cout: 15 },
      { nom: "Griffe Lightning", cout: 10 },
    ],
  },
  pistolets: {
    nom: "Pistolets de Légion",
    items: [
      { nom: "Pistolet à plasma", cout: 5 },
      { nom: "Lance-flammes léger", cout: 5 },
      { nom: "Serpentine volkite", cout: 5 },
    ],
  },
  combinees: {
    nom: "Armes Combinées de Légion",
    items: [
      { nom: "Combi-bolter", cout: 5 },
      { nom: "Combi-lance-flammes", cout: 10 },
      { nom: "Combi-fuseur", cout: 10 },
      { nom: "Combi-plasma", cout: 10 },
      { nom: "Combi-volkite", cout: 10 },
      { nom: "Combi-lance-grenades", cout: 10 },
      { nom: "Combi-désintégrateur", cout: 10 },
      { nom: "Combi-grav", cout: 10 },
    ],
  },
  speciales: {
    nom: "Armes Spéciales de Légion",
    items: [
      { nom: "Lance-flammes", cout: 5 },
      { nom: "Fusil à plasma", cout: 10 },
      { nom: "Fuseur", cout: 15 },
      { nom: "Chargeur volkite", cout: 5 },
      { nom: "Arquebuse volkite", cout: 10 },
      { nom: "Canon rotor", cout: 10 },
    ],
  },
  lourdes: {
    nom: "Armes Lourdes de Légion",
    items: [
      { nom: "Bolter lourd", cout: 10 },
      { nom: "Lance-flammes lourd", cout: 10 },
      { nom: "Autocanon", cout: 20 },
      { nom: "Lance-missiles", cout: 15 },
      { nom: "Multi-fuseur", cout: 25 },
      { nom: "Canon à plasma", cout: 20 },
      { nom: "Couleuvrine volkite", cout: 15 },
      { nom: "Canon laser", cout: 25 },
    ],
  },
  pivot: {
    nom: "Armes sur Pivot de Légion",
    items: [
      { nom: "Combi-bolter sur Pivot", cout: 5 },
      { nom: "Combi-lance-flammes sur Pivot", cout: 10 },
      { nom: "Combi-plasma sur Pivot", cout: 10 },
      { nom: "Combi-fuseur sur Pivot", cout: 10 },
      { nom: "Combi-volkite sur Pivot", cout: 10 },
      { nom: "Lanceur Havoc sur Pivot", cout: 5 },
      { nom: "Bolter lourd sur Pivot", cout: 10 },
      { nom: "Lance-flammes lourd sur Pivot", cout: 10 },
      { nom: "Multi-fuseur sur Pivot", cout: 25 },
    ],
  },
};

/* ----------------------------------------------------------
   PETITES FABRIQUES (évitent le copier-coller)
   ---------------------------------------------------------- */

// Copie les items d'une ou plusieurs listes d'équipement en un
// tableau de choix pour une option "choix".
function depuisListes(...listes) {
  const choix = [];
  for (const liste of listes) {
    for (const item of liste.items) {
      choix.push({ nom: item.nom + " (liste " + liste.nom + ")", cout: item.cout });
    }
  }
  return choix;
}

// Identifiant DOM-safe à partir d'un nom (accents décomposés puis
// balayés par le filtre [^a-z0-9], comme le reste des caractères
// non ASCII : le résultat n'a pas besoin d'être joli, juste unique).
function slug(texte) {
  return texte
    .normalize("NFD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Copie les items d'une liste d'équipement en un tableau d'options
// "quantite" partageant un même `groupe` : utile quand « Toute
// Figurine peut échanger… » vise plusieurs armes de prix différents
// (à la différence de `depuisListes`, qui suppose un choix unique
// par Figurine dans un menu déroulant).
function quantiteDepuisListe(liste, { groupe, parTranche = 1, remplace = "" } = {}) {
  return liste.items.map((item) => ({
    type: "quantite",
    id: groupe + "-" + slug(item.nom),
    libelle: "Figurines : " + item.nom + (remplace ? " (à la place " + remplace + ")" : ""),
    cout: item.cout,
    parTranche,
    groupe,
    ajoute: item.nom + (remplace ? " (à la place " + remplace + ")" : ""),
  }));
}

/* Options communes aux escouades d'état-major "Champion + Élus /
   Vétérans" (Centurion, Prétorienne, Prétorienne à Réacteurs) : le
   livre leur donne mot pour mot les mêmes échanges de bolter /
   pistolet bolter et la même mêlée pour le champion ; seules les
   dernières lignes (étendard, équipement de Légion) diffèrent
   d'une escouade à l'autre — elles sont passées en arguments
   supplémentaires. */
function optionsEscouadeEtatMajorVeteran(libelleChampion, ...dernieresOptions) {
  return [
    {
      type: "quantite",
      id: "fusil-pompe",
      libelle: "Figurines : fusil à pompe Astartes (à la place du bolter)",
      cout: 2,
      parTranche: 1,
      groupe: "tir",
      ajoute: "Fusil à pompe Astartes (à la place du bolter)",
    },
    {
      type: "quantite",
      id: "fusil-desintegrateur",
      libelle: "Figurines : fusil désintégrateur (à la place du bolter)",
      cout: 5,
      parTranche: 1,
      groupe: "tir",
      ajoute: "Fusil désintégrateur (à la place du bolter)",
    },
    {
      type: "quantite",
      id: "chargeur-volkite",
      libelle: "Figurines : chargeur volkite (à la place du bolter)",
      cout: 2,
      parTranche: 1,
      groupe: "tir",
      ajoute: "Chargeur volkite (à la place du bolter)",
    },
    ...quantiteDepuisListe(LISTES_EQUIPEMENT.combinees, { groupe: "tir", remplace: "du bolter" }),
    ...quantiteDepuisListe(LISTES_EQUIPEMENT.meleeSergent, {
      groupe: "tir",
      remplace: "du bolter, liste Sergent",
    }),
    {
      type: "quantite",
      id: "bouclier-combat",
      libelle:
        "Figurines ayant échangé leur bolter contre une Arme de Mêlée de Sergent de Légion : bouclier de combat (à la place du pistolet bolter)",
      cout: 2,
      parTranche: 1,
      groupe: "pistolet",
      requiertEquip: "liste Sergent",
      ajoute: "Bouclier de combat (à la place du pistolet bolter)",
    },
    {
      type: "quantite",
      id: "pistolets-legion",
      libelle: "Figurines prenant un objet de la liste des Pistolets de Légion (à la place du pistolet bolter)",
      cout: 5,
      parTranche: 1,
      groupe: "pistolet",
      ajoute: "Pistolet de Légion (à la place du pistolet bolter)",
    },
    {
      type: "case",
      id: "champion-pistolet-desintegrateur",
      libelle: libelleChampion + " : pistolet désintégrateur (à la place du pistolet bolter)",
      cout: 5,
      ajoute: libelleChampion + " : pistolet désintégrateur",
    },
    {
      type: "quantite",
      id: "paires-griffes",
      libelle: "Figurines : paire de griffes Lightning (remplace bolter ET pistolet bolter)",
      cout: 10,
      parTranche: 1,
      ajoute: "Paire de griffes Lightning",
    },
    {
      type: "choix",
      id: "baionnettes",
      libelle: "Toute l'unité : baïonnettes (figurines avec bolter)",
      ajoute: true,
      parFigurine: true,
      prefixeFiche: "Toute l'unité : ",
      choix: [
        { nom: "— Aucune —", cout: 0 },
        { nom: "Baïonnette", cout: 1 },
        { nom: "Baïonnette tronçonneuse", cout: 2 },
      ],
    },
    ...dernieresOptions,
  ];
}

// Option récurrente : bombes à fusion (+5 Points).
function optionBombesFusion() {
  return {
    type: "case",
    id: "bombes-fusion",
    libelle: "Bombes à fusion",
    cout: 5,
    ajoute: "Bombes à fusion",
  };
}

// Option récurrente : baïonnette (uniquement si le bolter est conservé).
function optionBaionnette() {
  return {
    type: "choix",
    id: "baionnette",
    libelle: "Baïonnette (uniquement si la Figurine a un bolter)",
    requiertEquip: "Bolter",
    ajoute: true,
    choix: [
      { nom: "Aucune", cout: 0 },
      { nom: "Baïonnette", cout: 1 },
      { nom: "Baïonnette tronçonneuse", cout: 2 },
    ],
  };
}

// Options récurrentes des véhicules Super-lourds (Seigneur de
// Bataille) : missile traqueur de Coque (Avant) et Projecteurs,
// chacun indépendant.
function optionsMissileEtProjecteurs() {
  return [
    {
      type: "case",
      id: "missile-traqueur",
      libelle: "Missile traqueur de Coque (Avant)",
      cout: 5,
      ajoute: "Missile traqueur de Coque (Avant)",
    },
    {
      type: "case",
      id: "projecteurs",
      libelle: "Projecteurs",
      cout: 5,
      ajoute: "Projecteurs",
    },
  ];
}

// Idem, complété par l'objet de la liste des Armes sur Pivot de
// Légion que partagent Falchion, Fellblade, Glaive, Typhon et
// Cerberus.
function optionPivotLegion() {
  return {
    type: "choix",
    id: "pivot",
    libelle: "Objet de la liste des Armes sur Pivot de Légion",
    ajoute: true,
    choix: [{ nom: "— Aucun —", cout: 0 }, ...depuisListes(LISTES_EQUIPEMENT.pivot)],
  };
}

function optionsVehiculeSuperLourdPivot() {
  return [optionPivotLegion(), ...optionsMissileEtProjecteurs()];
}

/* Fin de fiche récurrente des véhicules Blindés (Arquitor, Scorpius,
   Vindicator, Kratos, Sicaran, Sicaran Venator, Predator) : missile
   traqueur (position variable selon le châssis — Coque (Avant) ou
   Tourelle), Projecteurs, et Lame de bulldozer (absente sur certains
   châssis, voir chaque fiche). */
function optionsFinBlinde({ missile = "Coque (Avant)", bulldozer = true } = {}) {
  const options = [
    {
      type: "case",
      id: "missile-traqueur",
      libelle: "Missile traqueur de " + missile,
      cout: 5,
      ajoute: "Missile traqueur de " + missile,
    },
    {
      type: "case",
      id: "projecteurs",
      libelle: "Projecteurs",
      cout: 5,
      ajoute: "Projecteurs",
    },
  ];
  if (bulldozer) {
    options.push({
      type: "case",
      id: "lame-bulldozer",
      libelle: "Lame de bulldozer",
      cout: 5,
      ajoute: "Lame de bulldozer",
    });
  }
  return options;
}

/* ----------------------------------------------------------
   UNITÉS — QUARTIER GÉNÉRAL
   ---------------------------------------------------------- */
const UNITES = [
  {
    id: "praetor",
    nom: "Praetor",
    categorie: "Quartier Général",
    cout: 120,
    composition: "1 Praetor",
    traits: ["[Allégeance]", "[Legiones Astartes]", "Maître de la Légion"],
    equipement: ["Bolter", "Pistolet bolter", "Grenades Frag", "Grenades Krak"],
    variantes: [
      {
        nom: "Praetor",
        cout: 0,
        profil: { M: 7, CC: 6, CT: 5, F: 4, E: 4, PV: 4, I: 5, A: 5, Cd: 10, Sf: 9, Vo: 9, Int: 9, Sv: "2+", Inv: "4+" },
        regles: ["Aucune"],
        type: "Infanterie (État-major)",
      },
      {
        nom: "Praetor à Réacteurs",
        cout: 20,
        profil: { M: 12, CC: 6, CT: 5, F: 4, E: 4, PV: 4, I: 5, A: 5, Cd: 10, Sf: 9, Vo: 9, Int: 9, Sv: "2+", Inv: "4+" },
        regles: ["Massif (2)", "Frappe en Profondeur"],
        type: "Infanterie (État-major, Antigrav)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "bolter",
        libelle: "Remplacer le bolter",
        remplace: "Bolter",
        choix: [
          { nom: "— Conserver le bolter —", cout: 0 },
          { nom: "Lame de parangon", cout: 15 },
          { nom: "Pistolet archéotech", cout: 15 },
          { nom: "Fusil à pompe Astartes", cout: 2 },
          { nom: "Chargeur volkite", cout: 2 },
          ...depuisListes(LISTES_EQUIPEMENT.officier, LISTES_EQUIPEMENT.combinees),
        ],
      },
      {
        type: "choix",
        id: "pistolet",
        libelle: "Remplacer le pistolet bolter",
        remplace: "Pistolet bolter",
        choix: [
          { nom: "— Conserver le pistolet bolter —", cout: 0 },
          { nom: "Lame de parangon", cout: 15 },
          { nom: "Pistolet archéotech", cout: 15 },
          ...depuisListes(LISTES_EQUIPEMENT.officier),
        ],
      },
      {
        type: "paire",
        id: "griffes",
        libelle: "Paire de griffes Lightning (remplace le bolter et le pistolet bolter)",
        cout: 20,
        ajoute: "Paire de griffes Lightning",
        remplaceListe: ["Bolter", "Pistolet bolter"],
      },
      optionBombesFusion(),
      optionBaionnette(),
      {
        type: "case",
        id: "cyber-familier",
        libelle: "Cyber-familier (interdit au Praetor à Réacteurs)",
        cout: 10,
        ajoute: "Cyber-familier",
        variantesExclues: [1],
      },
    ],
  },

  {
    id: "praetor-terminator",
    nom: "Praetor en Armure Terminator",
    categorie: "Quartier Général",
    cout: 145,
    composition: "1 Praetor Cataphractii",
    traits: ["[Allégeance]", "[Legiones Astartes]", "Maître de la Légion"],
    equipement: ["Combi-bolter", "Arme énergétique"],
    variantes: [
      {
        nom: "Praetor Cataphractii",
        cout: 0,
        profil: { M: 6, CC: 6, CT: 5, F: 4, E: 5, PV: 5, I: 5, A: 5, Cd: 10, Sf: 9, Vo: 9, Int: 9, Sv: "2+", Inv: "4+" },
        regles: ["Massif (2)", "Avance Implacable", "Lent et Méthodique"],
        type: "Infanterie (État-major, Lourd)",
      },
      {
        nom: "Praetor Tartaros",
        cout: 10,
        profil: { M: 7, CC: 6, CT: 5, F: 4, E: 5, PV: 5, I: 5, A: 5, Cd: 10, Sf: 9, Vo: 9, Int: 9, Sv: "2+", Inv: "4+" },
        regles: ["Massif (2)", "Avance Implacable"],
        type: "Infanterie (État-major)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "combi-bolter",
        libelle: "Remplacer le combi-bolter",
        remplace: "Combi-bolter",
        choix: [
          { nom: "— Conserver le combi-bolter —", cout: 0 },
          { nom: "Chargeur volkite", cout: 0 },
          ...depuisListes(LISTES_EQUIPEMENT.combinees),
        ],
      },
      {
        type: "choix",
        id: "arme-energetique",
        libelle: "Remplacer l'arme énergétique",
        remplace: "Arme énergétique",
        choix: [
          { nom: "— Conserver l'arme énergétique —", cout: 0 },
          { nom: "Lame de parangon", cout: 15 },
          ...depuisListes(LISTES_EQUIPEMENT.meleeTerminator),
        ],
      },
      {
        type: "paire",
        id: "griffes",
        libelle: "Paire de griffes Lightning (remplace le combi-bolter et l'arme énergétique)",
        cout: 5,
        ajoute: "Paire de griffes Lightning",
        remplaceListe: ["Combi-bolter", "Arme énergétique"],
      },
    ],
  },

  {
    id: "praetor-saturnine",
    nom: "Praetor en Armure Terminator Saturnine",
    categorie: "Quartier Général",
    cout: 200,
    composition: "1 Praetor Saturnine",
    traits: ["[Allégeance]", "[Legiones Astartes]", "Maître de la Légion"],
    equipement: [
      "Hache de guerre Saturnine",
      "Poing disrupteur Saturnine",
      "Champ de diffraction thermique",
    ],
    variantes: [
      {
        nom: "Praetor Saturnine",
        cout: 0,
        profil: { M: 5, CC: 6, CT: 5, F: 4, E: 6, PV: 6, I: 4, A: 4, Cd: 10, Sf: 9, Vo: 9, Int: 9, Sv: "2+", Inv: "4+" },
        regles: ["Massif (4)", "Avance Implacable", "Lent et Méthodique"],
        type: "Infanterie (État-major, Lourd)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "marteau",
        libelle: "Marteau commotionneur Saturnine (remplace la hache OU le poing)",
        choix: [
          { nom: "— Aucun remplacement —", cout: 0 },
          {
            nom: "Marteau commotionneur Saturnine (remplace la hache de guerre)",
            cout: 10,
            remplace: "Hache de guerre Saturnine",
          },
          {
            nom: "Marteau commotionneur Saturnine (remplace le poing disrupteur)",
            cout: 10,
            remplace: "Poing disrupteur Saturnine",
          },
        ],
      },
      {
        type: "case",
        id: "eclateur",
        libelle: "Éclateur à plasma",
        cout: 10,
        ajoute: "Éclateur à plasma",
      },
      {
        type: "case",
        id: "transpondeur",
        libelle:
          "Transpondeur de téléportation Saturnine (donne Frappe en Profondeur)",
        cout: 60,
        ajoute: "Transpondeur de téléportation Saturnine",
      },
    ],
  },

  /* ----------------------------------------------------------
     UNITÉS — ÉTAT-MAJOR
     ---------------------------------------------------------- */
  {
    id: "centurion",
    nom: "Centurion",
    categorie: "État-major",
    cout: 80,
    composition: "1 Centurion",
    traits: ["[Allégeance]", "[Legiones Astartes]"],
    equipement: ["Bolter", "Pistolet bolter", "Grenades Frag", "Grenades Krak"],
    variantes: [
      {
        nom: "Centurion",
        cout: 0,
        profil: { M: 7, CC: 5, CT: 5, F: 4, E: 4, PV: 3, I: 5, A: 4, Cd: 9, Sf: 8, Vo: 8, Int: 8, Sv: "2+", Inv: "5+" },
        regles: ["Officier de Ligne (2)"],
        type: "Infanterie (État-major)",
      },
      {
        nom: "Centurion à Réacteurs",
        cout: 20,
        profil: { M: 12, CC: 5, CT: 5, F: 4, E: 4, PV: 3, I: 5, A: 4, Cd: 9, Sf: 8, Vo: 8, Int: 8, Sv: "2+", Inv: "5+" },
        regles: ["Officier de Ligne (2)", "Massif (2)", "Frappe en Profondeur"],
        type: "Infanterie (État-major, Antigrav)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "bolter",
        libelle: "Remplacer le bolter",
        remplace: "Bolter",
        choix: [
          { nom: "— Conserver le bolter —", cout: 0 },
          { nom: "Fusil à pompe Astartes", cout: 2 },
          { nom: "Chargeur volkite", cout: 2 },
          ...depuisListes(LISTES_EQUIPEMENT.officier, LISTES_EQUIPEMENT.combinees),
        ],
      },
      {
        type: "choix",
        id: "pistolet",
        libelle: "Remplacer le pistolet bolter",
        remplace: "Pistolet bolter",
        choix: [
          { nom: "— Conserver le pistolet bolter —", cout: 0 },
          ...depuisListes(LISTES_EQUIPEMENT.officier),
        ],
      },
      {
        type: "paire",
        id: "griffes",
        libelle: "Paire de griffes Lightning (remplace le bolter et le pistolet bolter)",
        cout: 20,
        ajoute: "Paire de griffes Lightning",
        remplaceListe: ["Bolter", "Pistolet bolter"],
      },
      optionBombesFusion(),
      optionBaionnette(),
      {
        type: "case",
        id: "vexillum",
        libelle: "Vexillum (interdit au Centurion à Réacteurs)",
        cout: 10,
        ajoute: "Vexillum",
        variantesExclues: [1],
      },
      {
        type: "case",
        id: "cyber-familier",
        libelle: "Cyber-familier (interdit au Centurion à Réacteurs)",
        cout: 10,
        ajoute: "Cyber-familier",
        variantesExclues: [1],
      },
    ],
  },

  {
    id: "centurion-terminator",
    nom: "Centurion en Armure Terminator",
    categorie: "État-major",
    cout: 100,
    composition: "1 Centurion Cataphractii",
    traits: ["[Allégeance]", "[Legiones Astartes]"],
    equipement: ["Combi-bolter", "Arme énergétique"],
    variantes: [
      {
        nom: "Centurion Cataphractii",
        cout: 0,
        profil: { M: 6, CC: 5, CT: 5, F: 4, E: 5, PV: 4, I: 5, A: 4, Cd: 9, Sf: 8, Vo: 8, Int: 8, Sv: "2+", Inv: "4+" },
        regles: ["Officier de Ligne (2)", "Massif (2)", "Avance Implacable", "Lent et Méthodique"],
        type: "Infanterie (État-major, Lourd)",
      },
      {
        nom: "Centurion Tartaros",
        cout: 0,
        profil: { M: 7, CC: 5, CT: 5, F: 4, E: 5, PV: 4, I: 5, A: 4, Cd: 9, Sf: 8, Vo: 8, Int: 8, Sv: "2+", Inv: "5+" },
        regles: ["Officier de Ligne (2)", "Massif (2)", "Avance Implacable"],
        type: "Infanterie (État-major)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "combi-bolter",
        libelle: "Remplacer le combi-bolter",
        remplace: "Combi-bolter",
        choix: [
          { nom: "— Conserver le combi-bolter —", cout: 0 },
          { nom: "Chargeur volkite", cout: 0 },
          ...depuisListes(LISTES_EQUIPEMENT.combinees),
        ],
      },
      {
        type: "choix",
        id: "arme-energetique",
        libelle: "Remplacer l'arme énergétique",
        remplace: "Arme énergétique",
        choix: [
          { nom: "— Conserver l'arme énergétique —", cout: 0 },
          ...depuisListes(LISTES_EQUIPEMENT.meleeTerminator),
        ],
      },
      {
        type: "paire",
        id: "griffes",
        libelle: "Paire de griffes Lightning (remplace le combi-bolter et l'arme énergétique)",
        cout: 5,
        ajoute: "Paire de griffes Lightning",
        remplaceListe: ["Combi-bolter", "Arme énergétique"],
      },
    ],
  },

  {
    id: "optae",
    nom: "Optae",
    categorie: "État-major",
    cout: 50,
    composition: "1 Optae",
    traits: ["[Allégeance]", "[Legiones Astartes]"],
    equipement: ["Bolter", "Pistolet bolter", "Grenades Frag", "Grenades Krak"],
    variantes: [
      {
        nom: "Optae",
        cout: 0,
        profil: { M: 7, CC: 5, CT: 4, F: 4, E: 4, PV: 2, I: 5, A: 3, Cd: 9, Sf: 8, Vo: 8, Int: 8, Sv: "3+", Inv: "—" },
        regles: ["Aucune"],
        type: "Infanterie (État-major)",
      },
      {
        nom: "Optae à Réacteurs",
        cout: 20,
        profil: { M: 12, CC: 5, CT: 4, F: 4, E: 4, PV: 2, I: 5, A: 3, Cd: 9, Sf: 8, Vo: 8, Int: 8, Sv: "3+", Inv: "—" },
        regles: ["Massif (2)", "Frappe en Profondeur"],
        type: "Infanterie (État-major, Antigrav)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "bolter",
        libelle: "Remplacer le bolter",
        remplace: "Bolter",
        choix: [
          { nom: "— Conserver le bolter —", cout: 0 },
          { nom: "Fusil à pompe Astartes", cout: 2 },
          { nom: "Chargeur volkite", cout: 2 },
          ...depuisListes(LISTES_EQUIPEMENT.meleeSergent, LISTES_EQUIPEMENT.combinees),
        ],
      },
      {
        type: "choix",
        id: "pistolet",
        libelle: "Remplacer le pistolet bolter",
        remplace: "Pistolet bolter",
        choix: [
          { nom: "— Conserver le pistolet bolter —", cout: 0 },
          { nom: "Pistolet désintégrateur", cout: 5 },
          ...depuisListes(LISTES_EQUIPEMENT.meleeSergent, LISTES_EQUIPEMENT.pistolets),
        ],
      },
      {
        type: "paire",
        id: "griffes",
        libelle: "Paire de griffes Lightning (remplace le bolter et le pistolet bolter)",
        cout: 20,
        ajoute: "Paire de griffes Lightning",
        remplaceListe: ["Bolter", "Pistolet bolter"],
      },
      optionBombesFusion(),
      optionBaionnette(),
    ],
  },

  {
    id: "rhino-damocles",
    nom: "Rhino d'État-major Damocles",
    categorie: "État-major",
    cout: 120,
    composition: "1 Rhino d'État-major Damocles",
    traits: ["[Allégeance]", "[Legiones Astartes]", "Écran de Fumée"],
    /* Le livre liste « Deux bolters sur Pivot » : on l'éclate en
       deux lignes pour pouvoir les remplacer indépendamment. */
    equipement: ["Bolter sur Pivot n°1", "Bolter sur Pivot n°2", "Relais vox d'état-major"],
    notes: "Un Point d'Accès sur chaque Flanc et à l'Arrière.",
    variantes: [
      {
        nom: "Rhino d'État-major Damocles",
        cout: 0,
        profilVehicule: { M: 12, CT: 4, avant: 12, flanc: 11, arriere: 10, PC: 5, transport: 6 },
        regles: ["Transport Léger", "Autoréparation (5+)", "Véhicule d'État-major Mobile"],
        type: "Véhicule (Transport)",
      },
    ],
    options: [
      /* Le livre autorise : chaque bolter sur Pivot → combi-bolter
         sur Pivot (+5), et UN SEUL des deux bolters → un objet de la
         liste des Armes sur Pivot. On modélise donc : pivot n°1 =
         liste complète, pivot n°2 = combi-bolter uniquement. */
      {
        type: "choix",
        id: "pivot-1",
        libelle: "Remplacer le premier bolter sur Pivot",
        remplace: "Bolter sur Pivot n°1",
        choix: [
          { nom: "— Conserver le bolter sur Pivot —", cout: 0 },
          ...depuisListes(LISTES_EQUIPEMENT.pivot),
        ],
      },
      {
        type: "choix",
        id: "pivot-2",
        libelle: "Remplacer le second bolter sur Pivot",
        remplace: "Bolter sur Pivot n°2",
        choix: [
          { nom: "— Conserver le bolter sur Pivot —", cout: 0 },
          { nom: "Combi-bolter sur Pivot", cout: 5 },
        ],
      },
      {
        type: "case",
        id: "projecteurs",
        libelle: "Projecteurs",
        cout: 5,
        ajoute: "Projecteurs",
      },
      {
        type: "case",
        id: "missile",
        libelle: "Missile traqueur de Coque (Avant)",
        cout: 10,
        ajoute: "Missile traqueur de Coque (Avant)",
      },
    ],
  },

  {
    id: "archiviste",
    nom: "Archiviste",
    categorie: "État-major",
    cout: 85,
    composition: "1 Archiviste",
    traits: ["[Allégeance]", "[Legiones Astartes]", "Psyker"],
    equipement: ["Arme de force", "Pistolet bolter", "Grenades Frag", "Grenades Krak"],
    variantes: [
      {
        nom: "Archiviste",
        cout: 0,
        profil: { M: 7, CC: 5, CT: 5, F: 4, E: 4, PV: 3, I: 5, A: 4, Cd: 8, Sf: 7, Vo: 9, Int: 8, Sv: "2+", Inv: "5+" },
        regles: ["Aucune"],
        type: "Infanterie (État-major)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "pistolet",
        libelle: "Remplacer le pistolet bolter",
        remplace: "Pistolet bolter",
        choix: [
          { nom: "— Conserver le pistolet bolter —", cout: 0 },
          ...depuisListes(LISTES_EQUIPEMENT.pistolets),
        ],
      },
      {
        type: "multi",
        id: "disciplines",
        libelle: "Disciplines Psychiques (jusqu'à deux)",
        max: 2,
        prefixe: "Discipline : ",
        choix: [
          { nom: "Biomancie", cout: 20 },
          { nom: "Pyromancie", cout: 10 },
          { nom: "Télékinésie", cout: 20 },
          { nom: "Divination", cout: 20 },
          { nom: "Thaumaturgie", cout: 0 },
          { nom: "Télépathie", cout: 10 },
        ],
      },
    ],
  },

  {
    id: "champion",
    nom: "Champion de Légion",
    categorie: "État-major",
    cout: 105,
    composition: "1 Champion de Légion",
    traits: ["[Allégeance]", "[Legiones Astartes]"],
    equipement: ["Lame de parangon", "Serpentine volkite", "Grenades Frag", "Grenades Krak"],
    variantes: [
      {
        nom: "Champion de Légion",
        cout: 0,
        profil: { M: 7, CC: 6, CT: 5, F: 4, E: 4, PV: 3, I: 5, A: 5, Cd: 8, Sf: 8, Vo: 8, Int: 8, Sv: "2+", Inv: "5+" },
        regles: ["Ne Jamais Céder"],
        type: "Infanterie (État-major)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "serpentine",
        libelle: "Remplacer la serpentine volkite",
        remplace: "Serpentine volkite",
        choix: [
          { nom: "— Conserver la serpentine volkite —", cout: 0 },
          { nom: "Combi-fuseur", cout: 10 },
        ],
      },
      optionBombesFusion(),
    ],
  },

  {
    id: "vigilator",
    nom: "Vigilator",
    categorie: "État-major",
    cout: 95,
    composition: "1 Vigilator",
    traits: ["[Allégeance]", "[Legiones Astartes]", "Écran de Fumée"],
    equipement: ["Fusil Némésis", "Pistolet bolter", "Grenades Frag", "Grenades Krak"],
    variantes: [
      {
        nom: "Vigilator",
        cout: 0,
        profil: { M: 7, CC: 4, CT: 7, F: 4, E: 4, PV: 3, I: 5, A: 3, Cd: 9, Sf: 8, Vo: 8, Int: 8, Sv: "2+", Inv: "5+" },
        regles: ["Infiltration (9)"],
        type: "Infanterie (État-major)",
      },
    ],
    options: [],
  },

  {
    id: "esoteriste",
    nom: "Ésotériste",
    categorie: "État-major",
    cout: 95,
    composition: "1 Ésotériste",
    traits: ["[Allégeance]", "[Legiones Astartes]", "Psyker", "Anathemata"],
    equipement: ["Arme de force", "Pistolet archéotech", "Grenades Frag", "Grenades Krak"],
    variantes: [
      {
        nom: "Ésotériste",
        cout: 0,
        profil: { M: 7, CC: 5, CT: 5, F: 4, E: 4, PV: 3, I: 5, A: 4, Cd: 7, Sf: 8, Vo: 10, Int: 8, Sv: "2+", Inv: "5+" },
        // Connaît d'office la Discipline Psychique Anathemata :
        // Peur (1), Arme Psychique « Dards du Néant », et selon le
        // Trait : Réaction « Sceller le Voile » (Loyaliste) ou
        // Pouvoir « Déchirer le Voile » (Renégat).
        regles: ["Discipline Anathemata"],
        type: "Infanterie (État-major)",
      },
    ],
    options: [],
  },

  {
    id: "maitre-signaux",
    nom: "Maître des Signaux",
    categorie: "État-major",
    cout: 115,
    composition: "1 Maître des Signaux",
    traits: ["[Allégeance]", "[Legiones Astartes]"],
    equipement: ["Pistolet bolter", "Grenades Frag", "Grenades Krak", "Relais vox d'état-major"],
    variantes: [
      {
        nom: "Maître des Signaux",
        cout: 0,
        profil: { M: 7, CC: 5, CT: 5, F: 4, E: 4, PV: 3, I: 5, A: 4, Cd: 8, Sf: 7, Vo: 7, Int: 10, Sv: "2+", Inv: "5+" },
        regles: ["Aucune"],
        type: "Infanterie (État-major)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "pistolet",
        libelle: "Remplacer le pistolet bolter",
        remplace: "Pistolet bolter",
        choix: [
          { nom: "— Conserver le pistolet bolter —", cout: 0 },
          ...depuisListes(LISTES_EQUIPEMENT.pistolets),
        ],
      },
    ],
  },

  {
    id: "praevius",
    nom: "Praevius",
    categorie: "État-major",
    cout: 95,
    composition: "1 Praevius",
    traits: ["[Allégeance]", "[Legiones Astartes]"],
    equipement: [
      "Pistolet bolter",
      "Grenades Frag",
      "Grenades Krak",
      "Contrôleur de cortex",
      "Cyber-familier",
    ],
    variantes: [
      {
        nom: "Praevius",
        cout: 0,
        profil: { M: 7, CC: 5, CT: 5, F: 4, E: 4, PV: 3, I: 5, A: 4, Cd: 9, Sf: 8, Vo: 8, Int: 9, Sv: "2+", Inv: "5+" },
        regles: ["Guerrier-artisan (1)", "Insensible à la Douleur (5+)", "Maître des Automates"],
        type: "Infanterie (État-major)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "pistolet",
        libelle: "Remplacer le pistolet bolter",
        remplace: "Pistolet bolter",
        choix: [
          { nom: "— Conserver le pistolet bolter —", cout: 0 },
          ...depuisListes(LISTES_EQUIPEMENT.pistolets),
        ],
      },
      optionBombesFusion(),
    ],
  },

  {
    id: "moritat",
    nom: "Moritat",
    categorie: "État-major",
    cout: 95,
    composition: "1 Moritat",
    traits: ["[Allégeance]", "[Legiones Astartes]"],
    equipement: [
      "Deux serpentines volkites suralimentées",
      "Grenades Frag",
      "Grenades Krak",
      "Grenades Rad",
    ],
    variantes: [
      {
        nom: "Moritat",
        cout: 0,
        profil: { M: 12, CC: 4, CT: 6, F: 4, E: 4, PV: 3, I: 5, A: 3, Cd: 8, Sf: 9, Vo: 8, Int: 8, Sv: "2+", Inv: "5+" },
        regles: ["Massif (2)", "Frappe en Profondeur", "Orage de Feu"],
        type: "Infanterie (Spécialiste, Antigrav)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "serpentines",
        libelle: "Remplacer les deux serpentines volkites suralimentées",
        remplace: "Deux serpentines volkites suralimentées",
        choix: [
          { nom: "— Conserver les serpentines volkites —", cout: 0 },
          { nom: "Deux pistolets à plasma suralimentés", cout: 10 },
        ],
      },
      optionBombesFusion(),
    ],
  },

  {
    id: "briseur-siege",
    nom: "Briseur de Siège",
    categorie: "État-major",
    cout: 115,
    composition: "1 Briseur de Siège",
    traits: ["[Allégeance]", "[Legiones Astartes]"],
    equipement: [
      "Pistolet bolter",
      "Marteau Thunder",
      "Grenades Frag",
      "Grenades Krak",
      "Bombes à phosphex",
      "Cognis-signum",
      "Scanner augure",
    ],
    variantes: [
      {
        nom: "Briseur de Siège",
        cout: 0,
        profil: { M: 7, CC: 5, CT: 5, F: 4, E: 4, PV: 3, I: 5, A: 4, Cd: 9, Sf: 9, Vo: 8, Int: 8, Sv: "2+", Inv: "5+" },
        regles: ["Aucune"],
        type: "Infanterie (État-major, Lourd)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "pistolet",
        libelle: "Remplacer le pistolet bolter",
        remplace: "Pistolet bolter",
        choix: [
          { nom: "— Conserver le pistolet bolter —", cout: 0 },
          { nom: "Pistolet désintégrateur", cout: 5 },
          ...depuisListes(LISTES_EQUIPEMENT.pistolets),
        ],
      },
      optionBombesFusion(),
    ],
  },

  {
    id: "superviseur",
    nom: "Superviseur",
    categorie: "État-major",
    cout: 85,
    composition: "1 Superviseur",
    traits: ["[Allégeance]", "[Legiones Astartes]"],
    equipement: ["Pistolet bolter", "Fouet énergétique", "Grenades Frag", "Grenades Krak"],
    variantes: [
      {
        nom: "Superviseur",
        cout: 0,
        profil: { M: 7, CC: 5, CT: 5, F: 4, E: 4, PV: 3, I: 5, A: 4, Cd: 9, Sf: 9, Vo: 8, Int: 8, Sv: "2+", Inv: "5+" },
        regles: ["Peur (1)", "Maître des Auxilia"],
        type: "Infanterie (État-major)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "fouet",
        libelle: "Remplacer le fouet énergétique",
        remplace: "Fouet énergétique",
        choix: [
          { nom: "— Conserver le fouet énergétique —", cout: 0 },
          { nom: "Masse énergétique", cout: 0 },
        ],
      },
      {
        type: "choix",
        id: "pistolet",
        libelle: "Remplacer le pistolet bolter",
        remplace: "Pistolet bolter",
        choix: [
          { nom: "— Conserver le pistolet bolter —", cout: 0 },
          ...depuisListes(LISTES_EQUIPEMENT.pistolets),
        ],
      },
      {
        type: "case",
        id: "vexillum",
        libelle: "Vexillum",
        cout: 10,
        ajoute: "Vexillum",
      },
      optionBombesFusion(),
    ],
  },

  {
    id: "heraut",
    nom: "Héraut",
    categorie: "État-major",
    cout: 100,
    composition: "1 Héraut",
    traits: ["[Allégeance]", "[Legiones Astartes]"],
    equipement: [
      "Arme énergétique",
      "Pistolet bolter",
      "Grenades Frag",
      "Grenades Krak",
      "Icône du Primarque",
    ],
    variantes: [
      {
        nom: "Héraut",
        cout: 0,
        profil: { M: 7, CC: 5, CT: 5, F: 4, E: 4, PV: 3, I: 5, A: 4, Cd: 9, Sf: 9, Vo: 8, Int: 8, Sv: "2+", Inv: "5+" },
        regles: ["Peur (1)"],
        type: "Infanterie (État-major)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "arme-energetique",
        libelle: "Remplacer l'arme énergétique",
        remplace: "Arme énergétique",
        choix: [
          { nom: "— Conserver l'arme énergétique —", cout: 0 },
          { nom: "Gantelet énergétique", cout: 10 },
        ],
      },
      optionBombesFusion(),
    ],
  },

  {
    id: "chapelain",
    nom: "Chapelain",
    categorie: "État-major",
    cout: 80,
    composition: "1 Chapelain",
    traits: ["[Allégeance]", "[Legiones Astartes]"],
    equipement: ["Pistolet bolter", "Crozius Arcanum", "Grenades Frag", "Grenades Krak"],
    variantes: [
      {
        nom: "Chapelain",
        cout: 0,
        profil: { M: 7, CC: 5, CT: 4, F: 4, E: 4, PV: 3, I: 5, A: 4, Cd: 9, Sf: 10, Vo: 8, Int: 7, Sv: "2+", Inv: "5+" },
        regles: ["Aucune"],
        type: "Infanterie (État-major)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "pistolet",
        libelle: "Remplacer le pistolet bolter",
        remplace: "Pistolet bolter",
        choix: [
          { nom: "— Conserver le pistolet bolter —", cout: 0 },
          ...depuisListes(LISTES_EQUIPEMENT.pistolets),
        ],
      },
      optionBombesFusion(),
    ],
  },

  /* ----------------------------------------------------------
     UNITÉS — SUITE (ESCOUADES D'ÉTAT-MAJOR)
     Catégorie de Force Organisationnelle "Suite" : escouades
     d'accompagnement (Champion + Élus/Vétérans), à ne pas
     confondre avec les personnages seuls de la catégorie
     "État-major" ci-dessus. Le Centurion et les deux Prétoriennes
     partagent le même gabarit d'options (bolter / pistolet bolter
     / mêlée du champion) via `optionsEscouadeEtatMajorVeteran`,
     complété par les options propres à chaque escouade (étendard,
     équipement de Légion…).
     ---------------------------------------------------------- */
  {
    id: "escouade-etat-major-cataphractii",
    nom: "Escouade d'État-Major Terminator Cataphractii",
    categorie: "Suite",
    cout: 140,
    composition: "1 Champion Élu Cataphractii, 2 Élus Cataphractii",
    effectif: { base: 3, max: 12, cout: 40 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "[Legiones Astartes]"],
    equipement: ["Chargeur volkite", "Arme énergétique"],
    variantes: [
      {
        nom: "Escouade d'État-Major Terminator Cataphractii",
        cout: 0,
        profils: [
          { nom: "Élu Cataphractii", profil: { M: 6, CC: 5, CT: 4, F: 4, E: 5, PV: 2, I: 4, A: 3, Cd: 8, Sf: 8, Vo: 7, Int: 7, Sv: "2+", Inv: "4+" } },
          { nom: "Champion Élu Cataphractii", profil: { M: 6, CC: 5, CT: 4, F: 4, E: 5, PV: 2, I: 4, A: 4, Cd: 8, Sf: 8, Vo: 7, Int: 7, Sv: "2+", Inv: "4+" } },
        ],
        regles: ["Massif (2)", "Avance Implacable", "Lent et Méthodique"],
        type: "Champion Élu Cataphractii : Infanterie (Champion, Sergent, Lourd) · Élu Cataphractii : Infanterie (Lourd)",
      },
    ],
    options: [
      {
        type: "quantite",
        id: "combi-bolter",
        libelle: "Figurines échangeant leur chargeur volkite contre un combi-bolter",
        cout: 0,
        parTranche: 1,
        groupe: "tir",
        ajoute: "Combi-bolter (à la place du chargeur volkite)",
      },
      {
        type: "quantite",
        id: "armes-combinees",
        libelle: "Figurines prenant une Arme Combinée de Légion au choix",
        cout: 10,
        parTranche: 1,
        groupe: "tir",
        ajoute: "Arme Combinée de Légion (à la place du chargeur volkite)",
      },
      ...quantiteDepuisListe(LISTES_EQUIPEMENT.meleeTerminator, { groupe: "melee", remplace: "de l'arme énergétique" }),
      {
        type: "quantite",
        id: "paires-griffes",
        libelle: "Figurines : paire de griffes Lightning (remplace chargeur volkite ET arme énergétique)",
        cout: 10,
        parTranche: 1,
        ajoute: "Paire de griffes Lightning",
      },
      {
        type: "case",
        id: "harnais",
        libelle: "Champion Élu Cataphractii : harnais à grenades",
        cout: 5,
        ajoute: "Champion Élu Cataphractii : harnais à grenades",
      },
      {
        type: "case",
        id: "etendard",
        libelle: "Un Élu Cataphractii : étendard de Légion (à la place du chargeur volkite)",
        cout: 20,
        ajoute: "Un Élu Cataphractii : étendard de Légion (à la place du chargeur volkite)",
      },
    ],
  },

  {
    id: "escouade-etat-major-tartaros",
    nom: "Escouade d'État-Major Terminator Tartaros",
    categorie: "Suite",
    cout: 140,
    composition: "1 Champion Élu Tartaros, 2 Élus Tartaros",
    effectif: { base: 3, max: 10, cout: 40 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "[Legiones Astartes]"],
    equipement: ["Combi-bolter", "Arme énergétique"],
    variantes: [
      {
        nom: "Escouade d'État-Major Terminator Tartaros",
        cout: 0,
        profils: [
          { nom: "Élu Tartaros", profil: { M: 7, CC: 5, CT: 4, F: 4, E: 5, PV: 2, I: 4, A: 3, Cd: 8, Sf: 8, Vo: 7, Int: 7, Sv: "2+", Inv: "5+" } },
          { nom: "Champion Élu Tartaros", profil: { M: 7, CC: 5, CT: 4, F: 4, E: 5, PV: 2, I: 4, A: 4, Cd: 8, Sf: 8, Vo: 7, Int: 7, Sv: "2+", Inv: "5+" } },
        ],
        regles: ["Massif (2)", "Avance Implacable"],
        type: "Champion Élu Tartaros : Infanterie (Champion, Sergent) · Élu Tartaros : Infanterie",
      },
    ],
    options: [
      {
        type: "quantite",
        id: "chargeur-volkite",
        libelle: "Figurines échangeant leur combi-bolter contre un chargeur volkite",
        cout: 0,
        parTranche: 1,
        groupe: "tir",
        ajoute: "Chargeur volkite (à la place du combi-bolter)",
      },
      {
        type: "quantite",
        id: "armes-combinees",
        libelle: "Figurines prenant une Arme Combinée de Légion au choix",
        cout: 10,
        parTranche: 1,
        groupe: "tir",
        ajoute: "Arme Combinée de Légion (à la place du combi-bolter)",
      },
      ...quantiteDepuisListe(LISTES_EQUIPEMENT.meleeTerminator, { groupe: "melee", remplace: "de l'arme énergétique" }),
      {
        type: "quantite",
        id: "paires-griffes",
        libelle: "Figurines : paire de griffes Lightning (remplace combi-bolter ET arme énergétique)",
        cout: 10,
        parTranche: 1,
        ajoute: "Paire de griffes Lightning",
      },
      {
        type: "case",
        id: "harnais",
        libelle: "Champion Élu Tartaros : harnais à grenades",
        cout: 5,
        ajoute: "Champion Élu Tartaros : harnais à grenades",
      },
      {
        type: "case",
        id: "etendard",
        libelle: "Un Élu Tartaros : étendard de Légion (à la place du combi-bolter)",
        cout: 20,
        ajoute: "Un Élu Tartaros : étendard de Légion (à la place du combi-bolter)",
      },
    ],
  },

  {
    id: "escouade-etat-major-centurion",
    nom: "Escouade d'État-Major de Centurion",
    categorie: "Suite",
    cout: 85,
    composition: "1 Champion Vétéran, 4 Vétérans",
    effectif: { base: 5, max: 10, cout: 15 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "[Legiones Astartes]"],
    equipement: ["Bolter", "Pistolet bolter", "Grenades Frag", "Grenades Krak"],
    variantes: [
      {
        nom: "Escouade d'État-Major de Centurion",
        cout: 0,
        profils: [
          { nom: "Vétéran", profil: { M: 7, CC: 5, CT: 4, F: 4, E: 4, PV: 2, I: 4, A: 3, Cd: 8, Sf: 8, Vo: 7, Int: 7, Sv: "3+", Inv: "—" } },
          { nom: "Champion Vétéran", profil: { M: 7, CC: 5, CT: 4, F: 4, E: 4, PV: 2, I: 4, A: 3, Cd: 8, Sf: 8, Vo: 7, Int: 7, Sv: "3+", Inv: "—" } },
        ],
        regles: ["Aucune"],
        type: "Champion Vétéran : Infanterie (Champion, Sergent) · Vétéran : Infanterie",
      },
    ],
    options: optionsEscouadeEtatMajorVeteran(
      "Champion Vétéran",
      ...quantiteDepuisListe(LISTES_EQUIPEMENT.speciales, { groupe: "lourde", parTranche: 5, remplace: "du bolter" }),
      ...quantiteDepuisListe(LISTES_EQUIPEMENT.lourdes, { groupe: "lourde", parTranche: 5, remplace: "du bolter" }),
      {
        type: "choix",
        id: "etendard-veteran",
        libelle: "Un Vétéran : vexillum ou étendard de compagnie",
        ajoute: true,
        prefixeFiche: "Un Vétéran : ",
        choix: [
          { nom: "— Aucun —", cout: 0 },
          { nom: "Vexillum", cout: 10 },
          { nom: "Étendard de Compagnie", cout: 20 },
        ],
      },
      {
        type: "choix",
        id: "equipement-legion-1",
        libelle: "Équipement de Légion (1er Vétéran, deux max dans l'unité)",
        ajoute: true,
        prefixeFiche: "Vétéran : ",
        choix: [
          { nom: "— Aucun —", cout: 0 },
          { nom: "Nuncio-vox", cout: 10 },
          { nom: "Scanner augure", cout: 10 },
        ],
      },
      {
        type: "choix",
        id: "equipement-legion-2",
        libelle: "Équipement de Légion (2e Vétéran)",
        ajoute: true,
        prefixeFiche: "Vétéran : ",
        choix: [
          { nom: "— Aucun —", cout: 0 },
          { nom: "Nuncio-vox", cout: 10 },
          { nom: "Scanner augure", cout: 10 },
        ],
      },
    ),
  },

  {
    id: "escouade-etat-major-pretorienne-reacteurs",
    nom: "Escouade d'État-Major Prétorienne à Réacteurs",
    categorie: "Suite",
    cout: 160,
    composition: "1 Champion Élu à Réacteurs, 4 Élus à Réacteurs",
    effectif: { base: 5, max: 10, cout: 25 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "[Legiones Astartes]"],
    equipement: ["Bolter", "Pistolet bolter", "Grenades Frag", "Grenades Krak"],
    variantes: [
      {
        nom: "Escouade d'État-Major Prétorienne à Réacteurs",
        cout: 0,
        profils: [
          { nom: "Élu à Réacteurs", profil: { M: 12, CC: 5, CT: 4, F: 4, E: 4, PV: 2, I: 4, A: 3, Cd: 8, Sf: 8, Vo: 7, Int: 7, Sv: "2+", Inv: "—" } },
          { nom: "Champion Élu à Réacteurs", profil: { M: 12, CC: 5, CT: 4, F: 4, E: 4, PV: 2, I: 4, A: 4, Cd: 8, Sf: 8, Vo: 7, Int: 7, Sv: "2+", Inv: "—" } },
        ],
        regles: ["Massif (2)", "Frappe en Profondeur"],
        type: "Champion Élu à Réacteurs : Infanterie (Champion, Antigrav, Sergent) · Élu à Réacteurs : Infanterie (Antigrav)",
      },
    ],
    options: optionsEscouadeEtatMajorVeteran("Champion Élu à Réacteurs", {
      type: "case",
      id: "etendard-legion",
      libelle: "Un Élu à Réacteurs : étendard de Légion",
      cout: 20,
      ajoute: "Un Élu à Réacteurs : étendard de Légion",
    }),
  },

  {
    id: "escouade-etat-major-pretorienne",
    nom: "Escouade d'État-Major Prétorienne",
    categorie: "Suite",
    cout: 130,
    composition: "1 Champion Élu, 4 Élu",
    effectif: { base: 5, max: 10, cout: 20 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "[Legiones Astartes]"],
    equipement: ["Bolter", "Pistolet bolter", "Grenades Frag", "Grenades Krak"],
    variantes: [
      {
        nom: "Escouade d'État-Major Prétorienne",
        cout: 0,
        profils: [
          { nom: "Élu", profil: { M: 7, CC: 5, CT: 4, F: 4, E: 4, PV: 2, I: 4, A: 3, Cd: 8, Sf: 8, Vo: 7, Int: 7, Sv: "2+", Inv: "—" } },
          { nom: "Champion Élu", profil: { M: 7, CC: 5, CT: 4, F: 4, E: 4, PV: 2, I: 4, A: 4, Cd: 8, Sf: 8, Vo: 7, Int: 7, Sv: "2+", Inv: "—" } },
        ],
        regles: ["Aucune"],
        type: "Champion Élu : Infanterie (Champion, Sergent) · Élu : Infanterie",
      },
    ],
    options: optionsEscouadeEtatMajorVeteran("Champion Élu", {
      type: "case",
      id: "etendard-legion",
      libelle: "Un Élu : étendard de Légion",
      cout: 20,
      ajoute: "Un Élu : étendard de Légion",
    }),
  },

  /* ----------------------------------------------------------
     UNITÉS — ASSAUT LOURD (escouades Terminator)
     « Toute Figurine peut échanger… » est modélisé en champs
     quantité : le budget (groupe "tir" / "melee") est la taille
     de l'unité (parTranche: 1).
     ---------------------------------------------------------- */
  {
    id: "terminators-cataphractii",
    nom: "Escouade Terminator Cataphractii",
    categorie: "Assaut Lourd",
    cout: 150,
    composition: "1 Sergent Terminator Cataphractii, 4 Terminators Cataphractii",
    effectif: { base: 5, max: 12, cout: 30 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "[Legiones Astartes]"],
    equipement: ["Chargeur volkite", "Arme énergétique"],
    variantes: [
      {
        nom: "Escouade Terminator Cataphractii",
        cout: 0,
        profils: [
          { nom: "Terminator Cataphractii", profil: { M: 6, CC: 4, CT: 4, F: 4, E: 5, PV: 2, I: 4, A: 2, Cd: 8, Sf: 8, Vo: 7, Int: 7, Sv: "2+", Inv: "4+" } },
          { nom: "Sergent Terminator Cataphractii", profil: { M: 6, CC: 4, CT: 4, F: 4, E: 5, PV: 2, I: 4, A: 3, Cd: 8, Sf: 8, Vo: 7, Int: 7, Sv: "2+", Inv: "4+" } },
        ],
        regles: ["Massif (2)", "Avance Implacable", "Lent et Méthodique", "Avant-garde (3)"],
        type: "Sergent : Infanterie (Sergent, Lourd) · Terminator : Infanterie (Lourd)",
      },
    ],
    options: [
      {
        type: "quantite",
        id: "combi-bolters",
        libelle: "Figurines échangeant leur chargeur volkite contre un combi-bolter",
        cout: 0,
        parTranche: 1,
        groupe: "tir",
        ajoute: "Combi-bolter (à la place du chargeur volkite)",
      },
      {
        type: "quantite",
        id: "armes-combinees",
        libelle:
          "Figurines prenant une Arme Combinée de Légion au choix (combi-lance-flammes, combi-fuseur, combi-plasma…)",
        cout: 10,
        parTranche: 1,
        groupe: "tir",
        ajoute: "Arme Combinée de Légion (à la place du chargeur volkite)",
      },
      {
        type: "quantite",
        id: "griffes-l",
        libelle: "Figurines : griffe Lightning (à la place de l'arme énergétique)",
        cout: 5,
        parTranche: 1,
        groupe: "melee",
        ajoute: "Griffe Lightning",
      },
      {
        type: "quantite",
        id: "gantelets",
        libelle: "Figurines : gantelet énergétique (à la place de l'arme énergétique)",
        cout: 10,
        parTranche: 1,
        groupe: "melee",
        ajoute: "Gantelet énergétique",
      },
      {
        type: "quantite",
        id: "poings-t",
        libelle: "Figurines : poing tronçonneur (à la place de l'arme énergétique)",
        cout: 10,
        parTranche: 1,
        groupe: "melee",
        ajoute: "Poing tronçonneur",
      },
      {
        type: "quantite",
        id: "marteaux",
        libelle: "Figurines : marteau Thunder (à la place de l'arme énergétique)",
        cout: 10,
        parTranche: 1,
        groupe: "melee",
        ajoute: "Marteau Thunder",
      },
      {
        type: "quantite",
        id: "paires-griffes",
        libelle:
          "Figurines : paire de griffes Lightning (remplace chargeur volkite ET arme énergétique)",
        cout: 10,
        parTranche: 1,
        ajoute: "Paire de griffes Lightning",
      },
      {
        type: "case",
        id: "harnais",
        libelle: "Sergent : harnais à grenades",
        cout: 5,
        ajoute: "Sergent : harnais à grenades",
      },
      {
        type: "quantite",
        id: "lance-flammes-lourds",
        libelle: "Terminators : lance-flammes lourd (1 par tranche de 5 figurines)",
        cout: 5,
        parTranche: 5,
        groupe: "lourde",
        ajoute: "Lance-flammes lourd (à la place du chargeur volkite)",
      },
      {
        type: "quantite",
        id: "autocanons-reaper",
        libelle: "Terminators : autocanon Reaper (1 par tranche de 5 figurines)",
        cout: 15,
        parTranche: 5,
        groupe: "lourde",
        ajoute: "Autocanon Reaper (à la place du chargeur volkite)",
      },
      {
        type: "quantite",
        id: "eclateurs",
        libelle: "Terminators : éclateur à plasma (1 par tranche de 5 figurines)",
        cout: 10,
        parTranche: 5,
        groupe: "lourde",
        ajoute: "Éclateur à plasma (à la place du chargeur volkite)",
      },
    ],
  },

  {
    id: "terminators-tartaros",
    nom: "Escouade Terminator Tartaros",
    categorie: "Assaut Lourd",
    cout: 150,
    composition: "1 Sergent Terminator Tartaros, 4 Terminators Tartaros",
    effectif: { base: 5, max: 10, cout: 30 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "[Legiones Astartes]"],
    equipement: ["Combi-bolter", "Arme énergétique"],
    variantes: [
      {
        nom: "Escouade Terminator Tartaros",
        cout: 0,
        profils: [
          { nom: "Terminator Tartaros", profil: { M: 7, CC: 4, CT: 4, F: 4, E: 5, PV: 2, I: 4, A: 2, Cd: 8, Sf: 8, Vo: 7, Int: 7, Sv: "2+", Inv: "5+" } },
          { nom: "Sergent Terminator Tartaros", profil: { M: 7, CC: 4, CT: 4, F: 4, E: 5, PV: 2, I: 4, A: 3, Cd: 8, Sf: 8, Vo: 7, Int: 7, Sv: "2+", Inv: "5+" } },
        ],
        regles: ["Massif (2)", "Avance Implacable", "Avant-garde (3)"],
        type: "Sergent : Infanterie (Sergent) · Terminator : Infanterie",
      },
    ],
    options: [
      {
        type: "quantite",
        id: "chargeurs-volkites",
        libelle: "Figurines échangeant leur combi-bolter contre un chargeur volkite",
        cout: 0,
        parTranche: 1,
        groupe: "tir",
        ajoute: "Chargeur volkite (à la place du combi-bolter)",
      },
      {
        type: "quantite",
        id: "armes-combinees",
        libelle:
          "Figurines prenant une Arme Combinée de Légion au choix (combi-lance-flammes, combi-fuseur, combi-plasma…)",
        cout: 10,
        parTranche: 1,
        groupe: "tir",
        ajoute: "Arme Combinée de Légion (à la place du combi-bolter)",
      },
      {
        type: "quantite",
        id: "griffes-l",
        libelle: "Figurines : griffe Lightning (à la place de l'arme énergétique)",
        cout: 5,
        parTranche: 1,
        groupe: "melee",
        ajoute: "Griffe Lightning",
      },
      {
        type: "quantite",
        id: "gantelets",
        libelle: "Figurines : gantelet énergétique (à la place de l'arme énergétique)",
        cout: 10,
        parTranche: 1,
        groupe: "melee",
        ajoute: "Gantelet énergétique",
      },
      {
        type: "quantite",
        id: "poings-t",
        libelle: "Figurines : poing tronçonneur (à la place de l'arme énergétique)",
        cout: 10,
        parTranche: 1,
        groupe: "melee",
        ajoute: "Poing tronçonneur",
      },
      {
        type: "quantite",
        id: "marteaux",
        libelle: "Figurines : marteau Thunder (à la place de l'arme énergétique)",
        cout: 10,
        parTranche: 1,
        groupe: "melee",
        ajoute: "Marteau Thunder",
      },
      {
        type: "quantite",
        id: "paires-griffes",
        libelle:
          "Figurines : paire de griffes Lightning (remplace combi-bolter ET arme énergétique)",
        cout: 10,
        parTranche: 1,
        ajoute: "Paire de griffes Lightning",
      },
      {
        type: "case",
        id: "harnais",
        libelle: "Sergent : harnais à grenades",
        cout: 5,
        ajoute: "Sergent : harnais à grenades",
      },
      {
        type: "quantite",
        id: "lance-flammes-lourds",
        libelle: "Terminators : lance-flammes lourd (1 par tranche de 5 figurines)",
        cout: 5,
        parTranche: 5,
        groupe: "lourde",
        ajoute: "Lance-flammes lourd (à la place du combi-bolter)",
      },
      {
        type: "quantite",
        id: "autocanons-reaper",
        libelle: "Terminators : autocanon Reaper (1 par tranche de 5 figurines)",
        cout: 15,
        parTranche: 5,
        groupe: "lourde",
        ajoute: "Autocanon Reaper (à la place du combi-bolter)",
      },
      {
        type: "quantite",
        id: "eclateurs",
        libelle: "Terminators : éclateur à plasma (1 par tranche de 5 figurines)",
        cout: 10,
        parTranche: 5,
        groupe: "lourde",
        ajoute: "Éclateur à plasma (à la place du combi-bolter)",
      },
    ],
  },

  {
    id: "terminators-saturnine",
    nom: "Escouade Terminator Saturnine",
    categorie: "Assaut Lourd",
    cout: 200,
    composition: "1 Sergent Terminator Saturnine, 2 Terminators Saturnine",
    effectif: { base: 3, max: 6, cout: 60 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "[Legiones Astartes]"],
    equipement: [
      "Bombarde à plasma",
      "Poing disrupteur Saturnine",
      "Auspex de ciblage Occulix",
      "Champ de diffraction thermique",
    ],
    variantes: [
      {
        nom: "Escouade Terminator Saturnine",
        cout: 0,
        profils: [
          { nom: "Terminator Saturnine", profil: { M: 5, CC: 4, CT: 4, F: 4, E: 6, PV: 3, I: 3, A: 2, Cd: 8, Sf: 8, Vo: 7, Int: 7, Sv: "2+", Inv: "4+" } },
          { nom: "Sergent Terminator Saturnine", profil: { M: 5, CC: 4, CT: 4, F: 4, E: 6, PV: 3, I: 3, A: 2, Cd: 8, Sf: 8, Vo: 7, Int: 7, Sv: "2+", Inv: "4+" } },
        ],
        regles: ["Massif (4)", "Explose (6+)", "Avance Implacable", "Lent et Méthodique"],
        type: "Sergent : Infanterie (Sergent, Lourd) · Terminator : Infanterie (Lourd)",
      },
    ],
    options: [
      {
        type: "quantite",
        id: "bombardes-poing",
        libelle: "Figurines : bombarde à plasma à la place du poing disrupteur (gratuit)",
        cout: 0,
        parTranche: 1,
        groupe: "poing",
        ajoute: "Bombarde à plasma (à la place du poing disrupteur)",
      },
      {
        type: "quantite",
        id: "desintegrateurs-poing",
        libelle: "Figurines : désintégrateur lourd jumelé à la place du poing disrupteur",
        cout: 10,
        parTranche: 1,
        groupe: "poing",
        ajoute: "Désintégrateur lourd jumelé (à la place du poing disrupteur)",
      },
      {
        type: "quantite",
        id: "desintegrateurs-bombarde",
        libelle: "Figurines : désintégrateur lourd jumelé à la place de la bombarde à plasma",
        cout: 10,
        parTranche: 1,
        ajoute: "Désintégrateur lourd jumelé (à la place de la bombarde à plasma)",
      },
      {
        type: "quantite",
        id: "lacerateurs",
        libelle: "Figurines avec poing disrupteur : lacérateur à particules",
        cout: 5,
        parTranche: 1,
        ajoute: "Lacérateur à particules",
      },
    ],
  },

  /* ----------------------------------------------------------
     UNITÉS — TROUPES (escouades à effectif variable)
     Les options du Sergent sont en `ajoute: true` : l'équipement
     de base listé est celui de CHAQUE figurine, la fiche précise
     donc « Sergent : ... » pour ses échanges personnels.
     ---------------------------------------------------------- */
  {
    id: "escouade-tactique",
    nom: "Escouade Tactique",
    categorie: "Troupes",
    cout: 100,
    composition: "1 Sergent, 9 Légionnaires",
    effectif: { base: 10, max: 20, cout: 10 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "[Legiones Astartes]"],
    equipement: ["Bolter", "Pistolet bolter", "Grenades Frag", "Grenades Krak"],
    variantes: [
      {
        nom: "Escouade Tactique",
        cout: 0,
        profils: [
          { nom: "Légionnaire", profil: { M: 7, CC: 4, CT: 4, F: 4, E: 4, PV: 1, I: 4, A: 1, Cd: 7, Sf: 7, Vo: 7, Int: 7, Sv: "3+", Inv: "—" } },
          { nom: "Sergent", profil: { M: 7, CC: 4, CT: 4, F: 4, E: 4, PV: 1, I: 4, A: 1, Cd: 8, Sf: 7, Vo: 7, Int: 7, Sv: "3+", Inv: "—" } },
        ],
        regles: ["Fureur de la Légion", "Ligne (2)"],
        type: "Sergent : Infanterie (Sergent) · Légionnaire : Infanterie",
      },
    ],
    options: [
      {
        type: "choix",
        id: "sergent-bolter",
        libelle: "Sergent : remplacer son bolter",
        ajoute: true,
        prefixeFiche: "Sergent : ",
        choix: [
          { nom: "— Aucun échange —", cout: 0 },
          ...depuisListes(LISTES_EQUIPEMENT.meleeSergent, LISTES_EQUIPEMENT.combinees),
        ],
      },
      {
        type: "choix",
        id: "sergent-pistolet",
        libelle: "Sergent : remplacer son pistolet bolter",
        ajoute: true,
        prefixeFiche: "Sergent : ",
        choix: [
          { nom: "— Aucun échange —", cout: 0 },
          ...depuisListes(LISTES_EQUIPEMENT.meleeSergent, LISTES_EQUIPEMENT.pistolets),
        ],
      },
      {
        type: "case",
        id: "sergent-bombes",
        libelle: "Sergent : bombes à fusion",
        cout: 10,
        ajoute: "Sergent : bombes à fusion",
      },
      {
        type: "case",
        id: "vexillum",
        libelle: "Un Légionnaire : vexillum",
        cout: 10,
        ajoute: "Vexillum (un Légionnaire)",
      },
      {
        type: "choix",
        id: "equipement-legion-1",
        libelle: "Équipement de Légion (1er Légionnaire, deux max dans l'unité)",
        ajoute: true,
        prefixeFiche: "Légionnaire : ",
        choix: [
          { nom: "— Aucun —", cout: 0 },
          { nom: "Nuncio-vox", cout: 10 },
          { nom: "Scanner augure", cout: 10 },
        ],
      },
      {
        type: "choix",
        id: "equipement-legion-2",
        libelle: "Équipement de Légion (2e Légionnaire)",
        ajoute: true,
        prefixeFiche: "Légionnaire : ",
        choix: [
          { nom: "— Aucun —", cout: 0 },
          { nom: "Nuncio-vox", cout: 10 },
          { nom: "Scanner augure", cout: 10 },
        ],
      },
      {
        type: "choix",
        id: "baionnettes",
        libelle: "Toute l'unité : baïonnettes (figurines avec bolter)",
        ajoute: true,
        parFigurine: true,
        prefixeFiche: "Toute l'unité : ",
        choix: [
          { nom: "— Aucune —", cout: 0 },
          { nom: "Baïonnettes", cout: 1 },
          { nom: "Baïonnettes tronçonneuses", cout: 2 },
        ],
      },
    ],
  },

  {
    id: "escouade-nettoyeuse",
    nom: "Escouade Nettoyeuse",
    categorie: "Troupes",
    cout: 100,
    composition: "1 Sergent Nettoyeur, 9 Légionnaires Nettoyeurs",
    effectif: { base: 10, max: 20, cout: 10 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "[Legiones Astartes]"],
    equipement: ["Pistolet bolter", "Épée tronçonneuse", "Grenades Frag", "Grenades Krak"],
    variantes: [
      {
        nom: "Escouade Nettoyeuse",
        cout: 0,
        profils: [
          { nom: "Légionnaire Nettoyeur", profil: { M: 7, CC: 4, CT: 4, F: 4, E: 4, PV: 1, I: 4, A: 2, Cd: 7, Sf: 7, Vo: 7, Int: 7, Sv: "3+", Inv: "—" } },
          { nom: "Sergent Nettoyeur", profil: { M: 7, CC: 4, CT: 4, F: 4, E: 4, PV: 1, I: 4, A: 2, Cd: 8, Sf: 7, Vo: 7, Int: 7, Sv: "3+", Inv: "—" } },
        ],
        regles: ["Ligne (2)"],
        type: "Sergent Nettoyeur : Infanterie (Sergent) · Légionnaire Nettoyeur : Infanterie",
      },
    ],
    options: [
      {
        type: "choix",
        id: "sergent-epee",
        libelle: "Sergent : remplacer son épée tronçonneuse",
        ajoute: true,
        prefixeFiche: "Sergent : ",
        choix: [
          { nom: "— Aucun échange —", cout: 0 },
          ...depuisListes(LISTES_EQUIPEMENT.meleeSergent),
        ],
      },
      {
        type: "choix",
        id: "sergent-pistolet",
        libelle: "Sergent : remplacer son pistolet bolter",
        ajoute: true,
        prefixeFiche: "Sergent : ",
        choix: [
          { nom: "— Aucun échange —", cout: 0 },
          ...depuisListes(LISTES_EQUIPEMENT.meleeSergent, LISTES_EQUIPEMENT.pistolets),
        ],
      },
      {
        type: "case",
        id: "sergent-griffes",
        libelle:
          "Sergent : paire de griffes Lightning (remplace son pistolet bolter et son épée tronçonneuse)",
        cout: 10,
        ajoute: "Sergent : paire de griffes Lightning",
      },
      {
        type: "case",
        id: "sergent-bombes",
        libelle: "Sergent : bombes à fusion",
        cout: 10,
        ajoute: "Sergent : bombes à fusion",
      },
      /* « Par tranche de cinq Figurines, UN Légionnaire Nettoyeur
         peut échanger son épée tronçonneuse contre un des choix
         suivants » : les trois options ci-dessous partagent donc
         le même budget (groupe "epee"). */
      {
        type: "quantite",
        id: "epees-lourdes",
        libelle: "Légionnaires : épée tronçonneuse lourde (1 par tranche de 5 figurines)",
        cout: 5,
        parTranche: 5,
        groupe: "epee",
        ajoute: "Épée tronçonneuse lourde (Légionnaire)",
      },
      {
        type: "quantite",
        id: "armes-energetiques",
        libelle: "Légionnaires : arme énergétique (1 par tranche de 5 figurines)",
        cout: 10,
        parTranche: 5,
        groupe: "epee",
        ajoute: "Arme énergétique (Légionnaire)",
      },
      {
        type: "quantite",
        id: "sabres",
        libelle: "Légionnaires : sabre charnabal (1 par tranche de 5 figurines)",
        cout: 5,
        parTranche: 5,
        groupe: "epee",
        ajoute: "Sabre charnabal (Légionnaire)",
      },
      {
        type: "quantite",
        id: "pistolets-legion",
        libelle:
          "Légionnaires : pistolet de la liste des Pistolets de Légion (1 par tranche de 5 figurines)",
        cout: 5,
        parTranche: 5,
        ajoute: "Pistolet de Légion (Légionnaire)",
      },
      {
        type: "case",
        id: "vexillum",
        libelle: "Un Légionnaire : vexillum",
        cout: 10,
        ajoute: "Vexillum (un Légionnaire)",
      },
      {
        type: "choix",
        id: "equipement-legion-1",
        libelle: "Équipement de Légion (1er Légionnaire, deux max dans l'unité)",
        ajoute: true,
        prefixeFiche: "Légionnaire : ",
        choix: [
          { nom: "— Aucun —", cout: 0 },
          { nom: "Nuncio-vox", cout: 10 },
          { nom: "Scanner augure", cout: 10 },
        ],
      },
      {
        type: "choix",
        id: "equipement-legion-2",
        libelle: "Équipement de Légion (2e Légionnaire)",
        ajoute: true,
        prefixeFiche: "Légionnaire : ",
        choix: [
          { nom: "— Aucun —", cout: 0 },
          { nom: "Nuncio-vox", cout: 10 },
          { nom: "Scanner augure", cout: 10 },
        ],
      },
    ],
  },

  {
    id: "escouade-assaut",
    nom: "Escouade d'Assaut",
    categorie: "Troupes",
    cout: 140,
    composition: "1 Sergent d'Assaut, 9 Légionnaires d'Assaut",
    effectif: { base: 10, max: 20, cout: 12 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "[Legiones Astartes]"],
    equipement: ["Pistolet bolter", "Épée tronçonneuse", "Grenades Frag", "Grenades Krak"],
    variantes: [
      {
        nom: "Escouade d'Assaut",
        cout: 0,
        profils: [
          { nom: "Légionnaire d'Assaut", profil: { M: 12, CC: 4, CT: 4, F: 4, E: 4, PV: 1, I: 4, A: 2, Cd: 7, Sf: 7, Vo: 7, Int: 7, Sv: "3+", Inv: "—" } },
          { nom: "Sergent d'Assaut", profil: { M: 12, CC: 4, CT: 4, F: 4, E: 4, PV: 1, I: 4, A: 2, Cd: 8, Sf: 7, Vo: 7, Int: 7, Sv: "3+", Inv: "—" } },
        ],
        regles: ["Massif (2)", "Frappe en Profondeur", "Avant-garde (2)"],
        type: "Sergent d'Assaut : Infanterie (Sergent, Antigrav) · Légionnaire d'Assaut : Infanterie (Antigrav)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "sergent-epee",
        libelle: "Sergent : remplacer son épée tronçonneuse",
        ajoute: true,
        prefixeFiche: "Sergent : ",
        choix: [
          { nom: "— Aucun échange —", cout: 0 },
          ...depuisListes(LISTES_EQUIPEMENT.meleeSergent),
        ],
      },
      {
        type: "choix",
        id: "sergent-pistolet",
        libelle: "Sergent : remplacer son pistolet bolter",
        ajoute: true,
        prefixeFiche: "Sergent : ",
        choix: [
          { nom: "— Aucun échange —", cout: 0 },
          { nom: "Pistolet désintégrateur", cout: 5 },
          ...depuisListes(LISTES_EQUIPEMENT.meleeSergent, LISTES_EQUIPEMENT.pistolets),
        ],
      },
      {
        type: "case",
        id: "sergent-griffes",
        libelle:
          "Sergent : paire de griffes Lightning (remplace son pistolet bolter et son épée tronçonneuse)",
        cout: 10,
        ajoute: "Sergent : paire de griffes Lightning",
      },
      {
        type: "case",
        id: "sergent-bombes",
        libelle: "Sergent : bombes à fusion",
        cout: 10,
        ajoute: "Sergent : bombes à fusion",
      },
      /* Budget partagé (groupe "melee") : par tranche de cinq
         figurines, UN Légionnaire d'Assaut prend un de ces choix. */
      {
        type: "quantite",
        id: "armes-energetiques",
        libelle: "Légionnaires : arme énergétique (1 par tranche de 5 figurines)",
        cout: 10,
        parTranche: 5,
        groupe: "melee",
        ajoute: "Arme énergétique (Légionnaire)",
      },
      {
        type: "quantite",
        id: "sabres",
        libelle: "Légionnaires : sabre charnabal (1 par tranche de 5 figurines)",
        cout: 5,
        parTranche: 5,
        groupe: "melee",
        ajoute: "Sabre charnabal (Légionnaire)",
      },
      {
        type: "quantite",
        id: "epees-lourdes",
        libelle: "Légionnaires : épée tronçonneuse lourde (1 par tranche de 5 figurines)",
        cout: 5,
        parTranche: 5,
        groupe: "melee",
        ajoute: "Épée tronçonneuse lourde (Légionnaire)",
      },
      {
        type: "quantite",
        id: "haches-lourdes",
        libelle: "Légionnaires : hache tronçonneuse lourde (2 par tranche de 5 figurines)",
        cout: 5,
        parTranche: 5,
        parTrancheMax: 2,
        ajoute: "Hache tronçonneuse lourde (Légionnaire)",
      },
      {
        type: "quantite",
        id: "pistolets-legion",
        libelle:
          "Légionnaires : pistolet de la liste des Pistolets de Légion (1 par tranche de 5 figurines)",
        cout: 5,
        parTranche: 5,
        ajoute: "Pistolet de Légion (Légionnaire)",
      },
      {
        type: "case",
        id: "haches",
        libelle: "Toute l'unité : haches tronçonneuses au lieu des épées tronçonneuses",
        cout: 0,
        ajoute: "Haches tronçonneuses (toute l'unité, remplacent les épées)",
      },
      {
        type: "case",
        id: "boucliers",
        libelle: "Toute l'unité : boucliers de combat au lieu des pistolets bolters",
        cout: 2,
        parFigurine: true,
        ajoute: "Boucliers de combat (toute l'unité, remplacent les pistolets bolters)",
      },
    ],
  },

  {
    id: "escouade-brecheuse",
    nom: "Escouade Brécheuse",
    categorie: "Troupes",
    cout: 140,
    composition: "1 Sergent Brécheur, 9 Légionnaires Brécheurs",
    effectif: { base: 10, max: 20, cout: 12 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "[Legiones Astartes]"],
    equipement: [
      "Bolter",
      "Pistolet bolter",
      "Bouclier d'abordage",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Escouade Brécheuse",
        cout: 0,
        profils: [
          { nom: "Légionnaire Brécheur", profil: { M: 7, CC: 4, CT: 4, F: 4, E: 4, PV: 1, I: 4, A: 1, Cd: 7, Sf: 7, Vo: 7, Int: 7, Sv: "3+", Inv: "5+" } },
          { nom: "Sergent Brécheur", profil: { M: 7, CC: 4, CT: 4, F: 4, E: 4, PV: 1, I: 4, A: 1, Cd: 8, Sf: 7, Vo: 7, Int: 7, Sv: "3+", Inv: "5+" } },
        ],
        regles: ["Ligne (1)"],
        type: "Sergent Brécheur : Infanterie (Sergent, Lourd) · Légionnaire Brécheur : Infanterie (Lourd)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "sergent-bolter",
        libelle: "Sergent : remplacer son bolter",
        ajoute: true,
        prefixeFiche: "Sergent : ",
        choix: [
          { nom: "— Aucun échange —", cout: 0 },
          ...depuisListes(LISTES_EQUIPEMENT.meleeSergent, LISTES_EQUIPEMENT.combinees),
        ],
      },
      {
        type: "choix",
        id: "sergent-pistolet",
        libelle: "Sergent : remplacer son pistolet bolter",
        ajoute: true,
        prefixeFiche: "Sergent : ",
        choix: [
          { nom: "— Aucun échange —", cout: 0 },
          ...depuisListes(LISTES_EQUIPEMENT.pistolets),
        ],
      },
      {
        type: "case",
        id: "sergent-bombes",
        libelle: "Sergent : bombes à fusion",
        cout: 10,
        ajoute: "Sergent : bombes à fusion",
      },
      /* Budget partagé (groupe "bolter") : par tranche de cinq
         figurines, UN Légionnaire Brécheur échange son bolter. */
      {
        type: "quantite",
        id: "fusils-gravitons",
        libelle: "Légionnaires : fusil à gravitons (1 par tranche de 5 figurines)",
        cout: 10,
        parTranche: 5,
        groupe: "bolter",
        ajoute: "Fusil à gravitons (Légionnaire)",
      },
      {
        type: "quantite",
        id: "decoupeurs-laser",
        libelle: "Légionnaires : découpeur laser (1 par tranche de 5 figurines)",
        cout: 10,
        parTranche: 5,
        groupe: "bolter",
        ajoute: "Découpeur laser (Légionnaire)",
      },
      {
        type: "case",
        id: "vexillum",
        libelle: "Un Légionnaire : vexillum",
        cout: 10,
        ajoute: "Vexillum (un Légionnaire)",
      },
      {
        type: "choix",
        id: "equipement-legion-1",
        libelle: "Équipement de Légion (1er Légionnaire, deux max dans l'unité)",
        ajoute: true,
        prefixeFiche: "Légionnaire : ",
        choix: [
          { nom: "— Aucun —", cout: 0 },
          { nom: "Nuncio-vox", cout: 10 },
          { nom: "Scanner augure", cout: 10 },
        ],
      },
      {
        type: "choix",
        id: "equipement-legion-2",
        libelle: "Équipement de Légion (2e Légionnaire)",
        ajoute: true,
        prefixeFiche: "Légionnaire : ",
        choix: [
          { nom: "— Aucun —", cout: 0 },
          { nom: "Nuncio-vox", cout: 10 },
          { nom: "Scanner augure", cout: 10 },
        ],
      },
    ],
  },

  /* ----------------------------------------------------------
     UNITÉS — ATTAQUE RAPIDE
     Les escadrons (Land Speeder, Javelin, Scimitar) sont de la
     Cavalerie Antigrav à profil d'infanterie classique (pas de
     profilVehicule) : `effectif` fonctionne donc exactement comme
     pour une escouade Terminator. Fire Raptor / Storm Eagle /
     Xiphon sont en revanche de vrais véhicules (profilVehicule),
     comme dans la section Transports.
     ---------------------------------------------------------- */
  {
    id: "escadron-land-speeders",
    nom: "Escadron de Land Speeders",
    categorie: "Attaque Rapide",
    cout: 50,
    composition: "1 Land Speeder",
    effectif: { base: 1, max: 5, cout: 50 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "[Legiones Astartes]"],
    equipement: ["Bolter lourd", "Scanner augure"],
    variantes: [
      {
        nom: "Escadron de Land Speeders",
        cout: 0,
        profil: { M: 16, CC: 4, CT: 4, F: 4, E: 5, PV: 3, I: 4, A: 2, Cd: 8, Sf: 8, Vo: 7, Int: 7, Sv: "3+", Inv: "—" },
        regles: ["Massif (4)", "Frappe en Profondeur", "Protocoles de Tir (2)"],
        type: "Cavalerie (Tirailleurs, Antigrav)",
      },
    ],
    options: [
      {
        type: "quantite",
        id: "bolter-lourd-lance-flammes",
        libelle: "Figurines : lance-flammes lourd (à la place du bolter lourd)",
        cout: 0,
        parTranche: 1,
        groupe: "bolter-lourd",
        ajoute: "Lance-flammes lourd (à la place du bolter lourd)",
      },
      {
        type: "quantite",
        id: "bolter-lourd-havoc",
        libelle: "Figurines : lanceur Havoc (à la place du bolter lourd)",
        cout: 5,
        parTranche: 1,
        groupe: "bolter-lourd",
        ajoute: "Lanceur Havoc (à la place du bolter lourd)",
      },
      {
        type: "quantite",
        id: "bolter-lourd-multi-fuseur",
        libelle: "Figurines : multi-fuseur (à la place du bolter lourd)",
        cout: 20,
        parTranche: 1,
        groupe: "bolter-lourd",
        ajoute: "Multi-fuseur (à la place du bolter lourd)",
      },
      {
        type: "quantite",
        id: "bolter-lourd-couleuvrine",
        libelle: "Figurines : couleuvrine volkite (à la place du bolter lourd)",
        cout: 5,
        parTranche: 1,
        groupe: "bolter-lourd",
        ajoute: "Couleuvrine volkite (à la place du bolter lourd)",
      },
      {
        type: "quantite",
        id: "bolter-lourd-plasma",
        libelle: "Figurines : canon à plasma (à la place du bolter lourd)",
        cout: 10,
        parTranche: 1,
        groupe: "bolter-lourd",
        ajoute: "Canon à plasma (à la place du bolter lourd)",
      },
      {
        type: "quantite",
        id: "bolter-lourd-gravitons",
        libelle: "Figurines : fusil à gravitons (à la place du bolter lourd)",
        cout: 10,
        parTranche: 1,
        groupe: "bolter-lourd",
        ajoute: "Fusil à gravitons (à la place du bolter lourd)",
      },
      {
        type: "quantite",
        id: "scanner-lance-flammes",
        libelle: "Figurines : lance-flammes lourd (à la place du scanner augure)",
        cout: 0,
        parTranche: 1,
        groupe: "scanner-augure",
        ajoute: "Lance-flammes lourd (à la place du scanner augure)",
      },
      {
        type: "quantite",
        id: "scanner-bolter-lourd",
        libelle: "Figurines : bolter lourd (à la place du scanner augure)",
        cout: 0,
        parTranche: 1,
        groupe: "scanner-augure",
        ajoute: "Bolter lourd (à la place du scanner augure)",
      },
      {
        type: "quantite",
        id: "scanner-havoc",
        libelle: "Figurines : lanceur Havoc (à la place du scanner augure)",
        cout: 0,
        parTranche: 1,
        groupe: "scanner-augure",
        ajoute: "Lanceur Havoc (à la place du scanner augure)",
      },
      {
        type: "quantite",
        id: "scanner-multi-fuseur",
        libelle: "Figurines : multi-fuseur (à la place du scanner augure)",
        cout: 0,
        parTranche: 1,
        groupe: "scanner-augure",
        ajoute: "Multi-fuseur (à la place du scanner augure)",
      },
      {
        type: "quantite",
        id: "scanner-couleuvrine",
        libelle: "Figurines : couleuvrine volkite (à la place du scanner augure)",
        cout: 20,
        parTranche: 1,
        groupe: "scanner-augure",
        ajoute: "Couleuvrine volkite (à la place du scanner augure)",
      },
      {
        type: "quantite",
        id: "scanner-plasma",
        libelle: "Figurines : canon à plasma (à la place du scanner augure)",
        cout: 5,
        parTranche: 1,
        groupe: "scanner-augure",
        ajoute: "Canon à plasma (à la place du scanner augure)",
      },
      {
        type: "quantite",
        id: "scanner-gravitons",
        libelle: "Figurines : fusil à gravitons (à la place du scanner augure)",
        cout: 10,
        parTranche: 1,
        groupe: "scanner-augure",
        ajoute: "Fusil à gravitons (à la place du scanner augure)",
      },
      {
        type: "quantite",
        id: "missiles-traqueurs",
        libelle: "Figurines : missile traqueur (jusqu'à deux par Figurine)",
        cout: 5,
        parTranche: 1,
        parTrancheMax: 2,
        ajoute: "Missile traqueur",
      },
    ],
  },

  {
    id: "escadron-javelin",
    nom: "Escadron de Javelin",
    categorie: "Attaque Rapide",
    cout: 75,
    composition: "1 Javelin",
    effectif: { base: 1, max: 3, cout: 75 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "[Legiones Astartes]"],
    equipement: ["Bolter lourd", "Lance-missiles Cyclone"],
    variantes: [
      {
        nom: "Escadron de Javelin",
        cout: 0,
        profil: { M: 14, CC: 4, CT: 4, F: 4, E: 6, PV: 4, I: 4, A: 2, Cd: 8, Sf: 8, Vo: 7, Int: 7, Sv: "3+", Inv: "—" },
        regles: ["Massif (5)", "Frappe en Profondeur", "Protocoles de Tir (3)"],
        type: "Cavalerie (Tirailleurs, Antigrav)",
      },
    ],
    options: [
      {
        type: "quantite",
        id: "cyclone-lance-flammes",
        libelle: "Figurines : deux lance-flammes lourds (à la place du lance-missiles Cyclone)",
        cout: 0,
        parTranche: 1,
        groupe: "cyclone",
        ajoute: "Deux lance-flammes lourds (à la place du lance-missiles Cyclone)",
      },
      {
        type: "quantite",
        id: "cyclone-bolters",
        libelle: "Figurines : deux bolters lourds (à la place du lance-missiles Cyclone)",
        cout: 0,
        parTranche: 1,
        groupe: "cyclone",
        ajoute: "Deux bolters lourds (à la place du lance-missiles Cyclone)",
      },
      {
        type: "quantite",
        id: "cyclone-canons-laser",
        libelle: "Figurines : deux canons laser (à la place du lance-missiles Cyclone)",
        cout: 5,
        parTranche: 1,
        groupe: "cyclone",
        ajoute: "Deux canons laser (à la place du lance-missiles Cyclone)",
      },
      {
        type: "quantite",
        id: "cyclone-couleuvrines",
        libelle: "Figurines : deux couleuvrines volkites (à la place du lance-missiles Cyclone)",
        cout: 5,
        parTranche: 1,
        groupe: "cyclone",
        ajoute: "Deux couleuvrines volkites (à la place du lance-missiles Cyclone)",
      },
    ],
  },

  {
    id: "escadron-scimitar",
    nom: "Escadron de Motojets Scimitar",
    categorie: "Attaque Rapide",
    cout: 95,
    composition: "1 Sergent Scimitar, 2 Veneurs Scimitar",
    effectif: { base: 3, max: 10, cout: 30 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "[Legiones Astartes]"],
    equipement: ["Pistolet bolter", "Épée tronçonneuse", "Bolter lourd", "Grenades Frag", "Grenades Krak"],
    variantes: [
      {
        nom: "Escadron de Motojets Scimitar",
        cout: 0,
        profils: [
          { nom: "Veneur Scimitar", profil: { M: 16, CC: 4, CT: 4, F: 4, E: 4, PV: 2, I: 4, A: 1, Cd: 7, Sf: 8, Vo: 7, Int: 7, Sv: "3+", Inv: "—" } },
          { nom: "Sergent Scimitar", profil: { M: 16, CC: 4, CT: 4, F: 4, E: 4, PV: 2, I: 4, A: 1, Cd: 8, Sf: 8, Vo: 7, Int: 7, Sv: "3+", Inv: "—" } },
        ],
        regles: ["Massif (3)", "Frappe en Profondeur"],
        type: "Sergent Scimitar : Cavalerie (Sergent, Antigrav) · Veneur Scimitar : Cavalerie (Antigrav)",
      },
    ],
    options: [
      {
        type: "case",
        id: "scanner-augure",
        libelle: "Un Veneur Scimitar : scanner augure",
        cout: 10,
        ajoute: "Un Veneur Scimitar : scanner augure",
      },
      {
        type: "choix",
        id: "sergent-epee",
        libelle: "Sergent Scimitar : remplacer son épée tronçonneuse",
        ajoute: true,
        prefixeFiche: "Sergent Scimitar : ",
        choix: [
          { nom: "— Aucun échange —", cout: 0 },
          ...depuisListes(LISTES_EQUIPEMENT.meleeSergent),
        ],
      },
      {
        type: "quantite",
        id: "pistolets-legion",
        libelle: "Figurines prenant un objet de la liste des Pistolets de Légion (à la place du pistolet bolter)",
        cout: 5,
        parTranche: 1,
        ajoute: "Pistolet de Légion (à la place du pistolet bolter)",
      },
      {
        type: "quantite",
        id: "bolter-lourd-couleuvrine",
        libelle: "Figurines : couleuvrine volkite (à la place du bolter lourd)",
        cout: 5,
        parTranche: 1,
        groupe: "bolter-lourd",
        ajoute: "Couleuvrine volkite (à la place du bolter lourd)",
      },
      {
        type: "quantite",
        id: "bolter-lourd-multi-fuseur",
        libelle: "Figurines : multi-fuseur (à la place du bolter lourd)",
        cout: 15,
        parTranche: 1,
        groupe: "bolter-lourd",
        ajoute: "Multi-fuseur (à la place du bolter lourd)",
      },
      {
        type: "quantite",
        id: "bolter-lourd-plasma",
        libelle: "Figurines : canon à plasma (à la place du bolter lourd)",
        cout: 10,
        parTranche: 1,
        groupe: "bolter-lourd",
        ajoute: "Canon à plasma (à la place du bolter lourd)",
      },
    ],
  },

  {
    id: "fire-raptor",
    nom: "Fire Raptor",
    categorie: "Attaque Rapide",
    cout: 220,
    composition: "1 Fire Raptor",
    traits: ["[Allégeance]", "[Legiones Astartes]"],
    equipement: [
      "Canon à bolts Avenger jumelé d'Axe Central",
      "Deux batteries de bolters lourds Gravis Latérales",
      "Quatre roquettes Tempest d'Axe Central",
    ],
    variantes: [
      {
        nom: "Fire Raptor",
        cout: 0,
        profilVehicule: { M: 18, CT: 4, avant: 12, flanc: 12, arriere: 12, PC: 6, transport: "—" },
        regles: ["Aucune"],
        type: "Véhicule (Stable, Aéronef)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "batteries-laterales",
        libelle: "Remplacer les deux batteries de bolters lourds Gravis Latérales",
        remplace: "Deux batteries de bolters lourds Gravis Latérales",
        choix: [
          { nom: "— Conserver les bolters lourds Gravis Latérales —", cout: 0 },
          { nom: "Deux batteries d'autocanons Gravis Latérales", cout: 15 },
        ],
      },
      {
        type: "choix",
        id: "roquettes",
        libelle: "Remplacer les quatre roquettes Tempest d'Axe Central",
        remplace: "Quatre roquettes Tempest d'Axe Central",
        choix: [
          { nom: "— Conserver les roquettes Tempest —", cout: 0 },
          { nom: "Quatre missiles Hellstrike d'Axe Central", cout: 20 },
        ],
      },
    ],
  },

  {
    id: "storm-eagle",
    nom: "Storm Eagle",
    categorie: "Attaque Rapide",
    cout: 200,
    composition: "1 Storm Eagle",
    traits: ["[Allégeance]", "[Legiones Astartes]"],
    equipement: [
      "Bolter lourd jumelé d'Axe Central",
      "Lanceur Vengeance d'Axe Central",
      "Quatre roquettes Tempest d'Axe Central",
    ],
    notes: "Cette Figurine a des Points d'Accès sur toutes ses Faces.",
    variantes: [
      {
        nom: "Storm Eagle",
        cout: 0,
        profilVehicule: { M: 18, CT: 4, avant: 12, flanc: 12, arriere: 12, PC: 6, transport: 16 },
        regles: ["Véhicule d'Assaut"],
        type: "Véhicule (Stable, Transport, Aéronef)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "bolter-lourd-jumele",
        libelle: "Remplacer le bolter lourd jumelé d'Axe Central",
        remplace: "Bolter lourd jumelé d'Axe Central",
        choix: [
          { nom: "— Conserver le bolter lourd jumelé —", cout: 0 },
          { nom: "Multi-fuseur jumelé d'Axe Central", cout: 15 },
          { nom: "Lance-missiles Cyclone d'Axe Central", cout: 10 },
        ],
      },
      {
        type: "choix",
        id: "roquettes",
        libelle: "Remplacer les quatre roquettes Tempest d'Axe Central",
        remplace: "Quatre roquettes Tempest d'Axe Central",
        choix: [
          { nom: "— Conserver les roquettes Tempest —", cout: 0 },
          { nom: "Quatre missiles traqueurs d'Axe Central", cout: 15 },
          { nom: "Deux canons laser jumelés d'Axe Central", cout: 30 },
        ],
      },
    ],
  },

  {
    id: "intercepteur-xiphon",
    nom: "Intercepteur Xiphon",
    categorie: "Attaque Rapide",
    cout: 120,
    composition: "1 Intercepteur Xiphon",
    traits: ["[Allégeance]", "[Legiones Astartes]", "Intercepteur"],
    equipement: ["Deux canons laser jumelés d'Axe Central", "Lance-missiles rotatif d'Axe Central"],
    variantes: [
      {
        nom: "Intercepteur Xiphon",
        cout: 0,
        profilVehicule: { M: 20, CT: 4, avant: 11, flanc: 11, arriere: 11, PC: 5, transport: "—" },
        regles: ["Aucune"],
        type: "Véhicule (Aéronef)",
      },
    ],
    options: [],
  },

  /* ----------------------------------------------------------
     UNITÉS — RECO
     ---------------------------------------------------------- */
  {
    id: "land-raider-explorator",
    nom: "Land Raider Explorator",
    categorie: "Reco",
    cout: 220,
    composition: "1 Land Raider Explorator",
    traits: ["[Allégeance]", "[Legiones Astartes]", "Écran de Fumée"],
    equipement: ["Deux canons laser jumelés Latéraux", "Lame de bulldozer"],
    notes: "Cette Figurine a un Point d'Accès sur chaque Flanc.",
    variantes: [
      {
        nom: "Land Raider Explorator",
        cout: 0,
        profilVehicule: { M: 12, CT: 4, avant: 14, flanc: 14, arriere: 14, PC: 8, transport: 10 },
        regles: ["Autoréparation (5+)", "Attaque de Flanc"],
        type: "Véhicule (Transport)",
      },
    ],
    options: [
      optionPivotLegion(),
      {
        type: "choix",
        id: "avant",
        libelle: "Doter la Figurine d'une arme de Coque (Avant)",
        ajoute: true,
        choix: [
          { nom: "— Aucune —", cout: 0 },
          { nom: "Canon laser jumelé de Coque (Avant)", cout: 20 },
          { nom: "Bolter lourd jumelé de Coque (Avant)", cout: 10 },
          { nom: "Lance-flammes lourd jumelé de Coque (Avant)", cout: 10 },
        ],
      },
      ...optionsMissileEtProjecteurs(),
    ],
  },

  {
    id: "escadron-motards",
    nom: "Escadron de Motards",
    categorie: "Reco",
    cout: 85,
    composition: "1 Sergent Motard, 2 Motards",
    effectif: { base: 3, max: 10, cout: 20 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "[Legiones Astartes]"],
    equipement: ["Bolter jumelé", "Pistolet bolter", "Épée tronçonneuse", "Grenades Frag", "Grenades Krak"],
    variantes: [
      {
        nom: "Escadron de Motards",
        cout: 0,
        profils: [
          { nom: "Motard", profil: { M: 14, CC: 4, CT: 4, F: 4, E: 4, PV: 2, I: 4, A: 1, Cd: 7, Sf: 8, Vo: 7, Int: 6, Sv: "3+", Inv: "—" } },
          { nom: "Sergent Motard", profil: { M: 14, CC: 4, CT: 4, F: 4, E: 4, PV: 2, I: 4, A: 1, Cd: 8, Sf: 8, Vo: 7, Int: 6, Sv: "3+", Inv: "—" } },
        ],
        regles: ["Massif (2)", "Avant-garde (1)", "Orage de Feu", "Avance Implacable", "Attaque de Flanc"],
        type: "Sergent Motard : Cavalerie (Sergent) · Motard : Cavalerie",
      },
    ],
    options: [
      {
        type: "choix",
        id: "equipement-legion-1",
        libelle: "Équipement de Légion (1er Motard, deux max dans l'unité)",
        ajoute: true,
        prefixeFiche: "Motard : ",
        choix: [
          { nom: "— Aucun —", cout: 0 },
          { nom: "Nuncio-vox", cout: 10 },
          { nom: "Scanner augure", cout: 10 },
        ],
      },
      {
        type: "choix",
        id: "equipement-legion-2",
        libelle: "Équipement de Légion (2e Motard)",
        ajoute: true,
        prefixeFiche: "Motard : ",
        choix: [
          { nom: "— Aucun —", cout: 0 },
          { nom: "Nuncio-vox", cout: 10 },
          { nom: "Scanner augure", cout: 10 },
        ],
      },
      {
        type: "choix",
        id: "sergent-epee",
        libelle: "Sergent Motard : remplacer son épée tronçonneuse",
        ajoute: true,
        prefixeFiche: "Sergent Motard : ",
        choix: [
          { nom: "— Aucun échange —", cout: 0 },
          ...depuisListes(LISTES_EQUIPEMENT.meleeSergent),
        ],
      },
      {
        type: "quantite",
        id: "pistolets-legion",
        libelle: "Figurines prenant un objet de la liste des Pistolets de Légion (à la place du pistolet bolter)",
        cout: 5,
        parTranche: 1,
        ajoute: "Pistolet de Légion (à la place du pistolet bolter)",
      },
      {
        type: "quantite",
        id: "fusils-plasma",
        libelle: "Toute l'unité : fusil à plasma jumelé (à la place du bolter jumelé)",
        cout: 15,
        parTranche: 1,
        ajoute: "Fusil à plasma jumelé (à la place du bolter jumelé)",
      },
      {
        type: "quantite",
        id: "fusils-pompe",
        libelle: "Figurines échangeant gratuitement leur épée tronçonneuse contre un fusil à pompe Astartes",
        cout: 0,
        parTranche: 1,
        ajoute: "Fusil à pompe Astartes (à la place de l'épée tronçonneuse)",
      },
    ],
  },

  {
    id: "sabre",
    nom: "Sabre",
    categorie: "Reco",
    cout: 80,
    composition: "1 Sabre",
    traits: ["[Allégeance]", "[Legiones Astartes]", "Écran de Fumée"],
    equipement: ["Autocanon court Anvilus d'Axe Central", "Bolter lourd de Coque (Avant)"],
    variantes: [
      {
        nom: "Sabre",
        cout: 0,
        profilVehicule: { M: 16, CT: 4, avant: 12, flanc: 11, arriere: 10, PC: 4, transport: "—" },
        regles: ["Attaque de Flanc"],
        type: "Véhicule (Rapide)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "anvilus",
        libelle: "Remplacer l'autocanon court Anvilus d'Axe Central",
        remplace: "Autocanon court Anvilus d'Axe Central",
        choix: [
          { nom: "— Conserver l'autocanon court Anvilus —", cout: 0 },
          { nom: "Éclateur à neutrons d'Axe Central", cout: 10 },
          { nom: "Sacre volkite d'Axe Central", cout: 0 },
        ],
      },
      {
        type: "choix",
        id: "bolter-lourd-avant",
        libelle: "Remplacer le bolter lourd de Coque (Avant)",
        remplace: "Bolter lourd de Coque (Avant)",
        choix: [
          { nom: "— Conserver le bolter lourd —", cout: 0 },
          { nom: "Multi-fuseur de Coque (Avant)", cout: 25 },
          { nom: "Couleuvrine volkite de Coque (Avant)", cout: 15 },
          { nom: "Lance-flammes lourd de Coque (Avant)", cout: 0 },
        ],
      },
      optionPivotLegion(),
      {
        type: "case",
        id: "projecteurs",
        libelle: "Projecteurs",
        cout: 5,
        ajoute: "Projecteurs",
      },
      {
        type: "quantite",
        id: "missiles-sabre",
        libelle: "Missiles Sabre de Coque (Avant) (jusqu'à quatre)",
        cout: 5,
        max: 4,
        ajoute: "Missile Sabre de Coque (Avant)",
      },
    ],
  },

  {
    id: "escouade-reconnaissance",
    nom: "Escouade de Reconnaissance",
    categorie: "Reco",
    cout: 110,
    composition: "1 Sergent Reco, 4 Légionnaires Reco",
    effectif: { base: 5, max: 10, cout: 17 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "[Legiones Astartes]", "Écran de Fumée"],
    equipement: ["Fusil à pompe Astartes", "Pistolet bolter", "Grenades Frag", "Grenades Krak"],
    variantes: [
      {
        nom: "Escouade de Reconnaissance",
        cout: 0,
        profils: [
          { nom: "Légionnaire Reco", profil: { M: 7, CC: 4, CT: 4, F: 4, E: 4, PV: 1, I: 4, A: 1, Cd: 7, Sf: 7, Vo: 7, Int: 7, Sv: "3+", Inv: "—" } },
          { nom: "Sergent Reco", profil: { M: 7, CC: 4, CT: 4, F: 4, E: 4, PV: 1, I: 4, A: 1, Cd: 8, Sf: 7, Vo: 7, Int: 7, Sv: "3+", Inv: "—" } },
        ],
        regles: ["Infiltration (9)", "Mouvement à Couvert", "Unité d'Appui (2)"],
        type: "Sergent Reco : Infanterie (Sergent, Tirailleurs) · Légionnaire Reco : Infanterie (Tirailleurs)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "sergent-fusil",
        libelle: "Sergent Reco : remplacer son fusil à pompe Astartes",
        ajoute: true,
        prefixeFiche: "Sergent Reco : ",
        choix: [
          { nom: "— Aucun échange —", cout: 0 },
          ...depuisListes(LISTES_EQUIPEMENT.meleeSergent),
        ],
      },
      {
        type: "choix",
        id: "sergent-pistolet-melee",
        libelle: "Sergent Reco : remplacer son pistolet bolter (Armes de Mêlée de Sergent de Légion)",
        ajoute: true,
        prefixeFiche: "Sergent Reco : ",
        choix: [
          { nom: "— Aucun échange —", cout: 0 },
          ...depuisListes(LISTES_EQUIPEMENT.meleeSergent),
        ],
      },
      {
        type: "choix",
        id: "sergent-pistolet-legion",
        libelle: "Sergent Reco : remplacer son pistolet bolter (Pistolets de Légion)",
        ajoute: true,
        prefixeFiche: "Sergent Reco : ",
        choix: [
          { nom: "— Aucun échange —", cout: 0 },
          ...depuisListes(LISTES_EQUIPEMENT.pistolets),
        ],
      },
      {
        type: "choix",
        id: "equipement-legion-1",
        libelle: "Équipement de Légion (1er Légionnaire Reco, deux max dans l'unité)",
        ajoute: true,
        prefixeFiche: "Légionnaire Reco : ",
        choix: [
          { nom: "— Aucun —", cout: 0 },
          { nom: "Nuncio-vox", cout: 10 },
          { nom: "Scanner augure", cout: 10 },
        ],
      },
      {
        type: "choix",
        id: "equipement-legion-2",
        libelle: "Équipement de Légion (2e Légionnaire Reco)",
        ajoute: true,
        prefixeFiche: "Légionnaire Reco : ",
        choix: [
          { nom: "— Aucun —", cout: 0 },
          { nom: "Nuncio-vox", cout: 10 },
          { nom: "Scanner augure", cout: 10 },
        ],
      },
      {
        type: "quantite",
        id: "bolters-nemesis",
        libelle: "Figurines : bolter Némésis (à la place du fusil à pompe Astartes)",
        cout: 5,
        parTranche: 1,
        ajoute: "Bolter Némésis (à la place du fusil à pompe Astartes)",
      },
      {
        type: "case",
        id: "bombes-fusion",
        libelle: "Sergent Reco : bombes à fusion",
        cout: 10,
        ajoute: "Sergent Reco : bombes à fusion",
      },
    ],
  },

  /* ----------------------------------------------------------
     UNITÉS — BLINDÉS
     Note de transcription : l'option « Cette Figurine peut
     échanger [...] contre un objet de la liste des Armes Latérales
     de Légion » (Arquitor, Kratos, Sicaran Venator, Sicaran,
     Predator) n'a pas pu être transcrite — le contenu de cette
     liste d'équipement n'a pas encore été fourni (même liste que
     pour les Seigneurs de Bataille, voir la note dans cette
     section-là). Le reste de chaque fiche est complet.
     ---------------------------------------------------------- */
  {
    id: "arquitor",
    nom: "Bombarde Arquitor",
    categorie: "Blindés",
    cout: 150,
    composition: "1 Bombarde Arquitor",
    traits: ["[Allégeance]", "[Legiones Astartes]", "Écran de Fumée"],
    equipement: ["Bombarde Morbus d'Axe Central", "Deux bolters lourds Latéraux"],
    variantes: [
      {
        nom: "Bombarde Arquitor",
        cout: 0,
        profilVehicule: { M: 8, CT: 4, avant: 13, flanc: 12, arriere: 10, PC: 6, transport: "—" },
        regles: ["Aucune"],
        type: "Véhicule",
      },
    ],
    options: [
      {
        type: "case",
        id: "obus-phosphex",
        libelle:
          "Obus à phosphex (nécessite un Briseur de Siège du même Trait de Faction dans l'Armée)",
        cout: 20,
        ajoute: "Obus à phosphex",
      },
      {
        type: "choix",
        id: "bombarde-morbus",
        libelle: "Remplacer la bombarde Morbus d'Axe Central",
        remplace: "Bombarde Morbus d'Axe Central",
        choix: [
          { nom: "— Conserver la bombarde Morbus —", cout: 0 },
          { nom: "Canon à charge-graviton d'Axe Central", cout: 15 },
          { nom: "Système de roquettes Spicula d'Axe Central", cout: 15 },
        ],
      },
      {
        type: "choix",
        id: "bolters-lateraux",
        libelle: "Remplacer les deux bolters lourds Latéraux",
        remplace: "Deux bolters lourds Latéraux",
        choix: [
          { nom: "— Conserver les bolters lourds Latéraux —", cout: 0 },
          { nom: "Deux autocanons Latéraux", cout: 10 },
        ],
      },
      optionPivotLegion(),
      ...optionsFinBlinde({ bulldozer: false }),
    ],
  },

  {
    id: "scorpius",
    nom: "Char Lance-missiles Scorpius",
    categorie: "Blindés",
    cout: 120,
    composition: "1 Char Lance-missiles Scorpius",
    traits: ["[Allégeance]", "[Legiones Astartes]", "Écran de Fumée"],
    equipement: ["Lance-missiles Scorpius de Tourelle", "Bolter sur Pivot n°1", "Bolter sur Pivot n°2"],
    variantes: [
      {
        nom: "Char Lance-missiles Scorpius",
        cout: 0,
        profilVehicule: { M: 10, CT: 4, avant: 12, flanc: 11, arriere: 10, PC: 5, transport: "—" },
        regles: ["Aucune"],
        type: "Véhicule",
      },
    ],
    options: [
      {
        type: "choix",
        id: "pivot-1",
        libelle: "Remplacer un bolter sur Pivot",
        remplace: "Bolter sur Pivot n°1",
        choix: [
          { nom: "— Conserver le bolter sur Pivot —", cout: 0 },
          ...depuisListes(LISTES_EQUIPEMENT.pivot),
        ],
      },
      ...optionsFinBlinde(),
    ],
  },

  {
    id: "vindicator",
    nom: "Char de Siège Vindicator",
    categorie: "Blindés",
    cout: 140,
    composition: "1 Char de Siège Vindicator",
    traits: ["[Allégeance]", "[Legiones Astartes]", "Écran de Fumée"],
    equipement: ["Canon Demolisher d'Axe Central", "Combi-bolter de Coque (Avant)"],
    variantes: [
      {
        nom: "Char de Siège Vindicator",
        cout: 0,
        profilVehicule: { M: 10, CT: 4, avant: 13, flanc: 13, arriere: 10, PC: 6, transport: "—" },
        regles: ["Aucune"],
        type: "Véhicule",
      },
    ],
    options: [
      {
        type: "choix",
        id: "canon-demolisher",
        libelle: "Remplacer le canon Demolisher d'Axe Central",
        remplace: "Canon Demolisher d'Axe Central",
        choix: [
          { nom: "— Conserver le canon Demolisher —", cout: 0 },
          { nom: "Magnadestructeur laser d'Axe Central", cout: 20 },
        ],
      },
      optionPivotLegion(),
      ...optionsFinBlinde(),
    ],
  },

  {
    id: "kratos",
    nom: "Char d'Assaut Kratos",
    categorie: "Blindés",
    cout: 280,
    composition: "1 Char d'Assaut Kratos",
    traits: ["[Allégeance]", "[Legiones Astartes]", "Écran de Fumée"],
    equipement: [
      "Obusier Kratos de Tourelle",
      "Autocanon coaxial (obusier Kratos)",
      "Deux bolters lourds de Coque (Avant)",
      "Deux bolters lourds Latéraux",
    ],
    variantes: [
      {
        nom: "Char d'Assaut Kratos",
        cout: 0,
        profilVehicule: { M: 8, CT: 4, avant: 14, flanc: 14, arriere: 14, PC: 10, transport: "—" },
        regles: ["Aucune"],
        type: "Véhicule (Stable)",
      },
    ],
    options: [
      {
        type: "case",
        id: "obus-bruleurs",
        libelle: "Obusier Kratos de Tourelle : obus brûleurs",
        cout: 10,
        ajoute: "Obus brûleurs",
      },
      {
        type: "choix",
        id: "obusier-kratos",
        libelle: "Remplacer l'obusier Kratos de Tourelle",
        remplace: "Obusier Kratos de Tourelle",
        choix: [
          { nom: "— Conserver l'obusier Kratos —", cout: 0 },
          { nom: "Cardanelle volkite de Tourelle", cout: 0 },
          { nom: "Fuseur-éclateur de Tourelle", cout: 30 },
        ],
      },
      {
        type: "choix",
        id: "bolters-avant",
        libelle: "Remplacer les deux bolters lourds de Coque (Avant)",
        remplace: "Deux bolters lourds de Coque (Avant)",
        choix: [
          { nom: "— Conserver les bolters lourds de Coque (Avant) —", cout: 0 },
          { nom: "Deux arquebuses volkites de Coque (Avant)", cout: 5 },
          { nom: "Deux autocanons de Coque (Avant)", cout: 10 },
          { nom: "Deux canons laser de Coque (Avant)", cout: 25 },
        ],
      },
      optionPivotLegion(),
      ...optionsFinBlinde({ missile: "Tourelle" }),
    ],
  },

  {
    id: "sicaran-venator",
    nom: "Sicaran Venator",
    categorie: "Blindés",
    cout: 170,
    composition: "1 Sicaran Venator",
    traits: ["[Allégeance]", "[Legiones Astartes]", "Écran de Fumée"],
    equipement: ["Laser à neutrons d'Axe Central", "Bolter lourd de Tourelle", "Deux bolters lourds Latéraux"],
    variantes: [
      {
        nom: "Sicaran Venator",
        cout: 0,
        profilVehicule: { M: 14, CT: 4, avant: 13, flanc: 12, arriere: 12, PC: 6, transport: "—" },
        regles: ["Explose (5+)"],
        type: "Véhicule",
      },
    ],
    options: [optionPivotLegion(), ...optionsFinBlinde({ bulldozer: false })],
  },

  {
    id: "sicaran",
    nom: "Sicaran",
    categorie: "Blindés",
    cout: 160,
    composition: "1 Sicaran",
    traits: ["[Allégeance]", "[Legiones Astartes]", "Écran de Fumée"],
    equipement: ["Autocanon accélérateur jumelé de Tourelle", "Bolter lourd de Coque (Avant)", "Deux bolters lourds Latéraux"],
    variantes: [
      {
        nom: "Sicaran",
        cout: 0,
        profilVehicule: { M: 14, CT: 4, avant: 13, flanc: 12, arriere: 12, PC: 6, transport: "—" },
        regles: ["Aucune"],
        type: "Véhicule",
      },
    ],
    options: [
      {
        type: "choix",
        id: "autocanon",
        libelle: "Remplacer l'autocanon accélérateur jumelé de Tourelle",
        remplace: "Autocanon accélérateur jumelé de Tourelle",
        choix: [
          { nom: "— Conserver l'autocanon accélérateur jumelé —", cout: 0 },
          { nom: "Lance-missiles Arcus de Tourelle", cout: 40 },
          { nom: "Canon rotatif Punisher de Tourelle", cout: 10 },
          { nom: "Affût à plasma Omega de Tourelle", cout: 25 },
        ],
      },
      optionPivotLegion(),
      ...optionsFinBlinde({ missile: "Tourelle", bulldozer: false }),
    ],
  },

  {
    id: "predator",
    nom: "Predator",
    categorie: "Blindés",
    cout: 100,
    composition: "1 Predator",
    traits: ["[Allégeance]", "[Legiones Astartes]", "Écran de Fumée"],
    equipement: ["Canon Predator de Tourelle", "Deux bolters lourds Latéraux"],
    variantes: [
      {
        nom: "Predator",
        cout: 0,
        profilVehicule: { M: 12, CT: 4, avant: 13, flanc: 12, arriere: 10, PC: 5, transport: "—" },
        regles: ["Aucune"],
        type: "Véhicule",
      },
    ],
    options: [
      {
        type: "choix",
        id: "canon-predator",
        libelle: "Remplacer le canon Predator de Tourelle",
        remplace: "Canon Predator de Tourelle",
        choix: [
          { nom: "— Conserver le canon Predator —", cout: 0 },
          { nom: "Canon Flamestorm de Tourelle", cout: 0 },
          { nom: "Destructeur à plasma Executioner de Tourelle", cout: 25 },
          { nom: "Canon à conversion lourd de Tourelle", cout: 30 },
          { nom: "Magnacanon à fusion de Tourelle", cout: 20 },
          { nom: "Canon à gravitons de Tourelle", cout: 20 },
          { nom: "Macro-sacre volkite de Tourelle", cout: 5 },
          { nom: "Éclateur à neutrons de Tourelle", cout: 15 },
          { nom: "Canon laser jumelé de Tourelle", cout: 10 },
        ],
      },
      optionPivotLegion(),
      ...optionsFinBlinde({ missile: "Tourelle" }),
    ],
  },

  /* ----------------------------------------------------------
     UNITÉS — ENGINS DE GUERRE (Dreadnoughts)
     Les bras à choisir sont modélisés comme équipement de base
     (le choix gratuit du livre) + un menu de remplacement par
     bras ; les « paires » à prix spécial du livre sont des
     options de type "paire" qui remplacent les deux bras.
     ---------------------------------------------------------- */
  {
    id: "dreadnought-contemptor",
    nom: "Dreadnought Contemptor",
    categorie: "Engins de Guerre",
    cout: 150,
    composition: "1 Dreadnought Contemptor",
    traits: ["[Allégeance]", "[Legiones Astartes]", "Écran de Fumée"],
    equipement: ["Canon à bolts Gravis (bras n°1)", "Canon à bolts Gravis (bras n°2)"],
    variantes: [
      {
        nom: "Dreadnought Contemptor",
        cout: 0,
        profil: { M: 8, CC: 4, CT: 4, F: 7, E: 7, PV: 6, I: 4, A: 4, Cd: 12, Sf: 10, Vo: 7, Int: 5, Sv: "2+", Inv: "5+" },
        regles: ["Massif (6)", "Explose (5+)", "Avance Implacable"],
        type: "Marcheur",
      },
    ],
    options: [
      {
        type: "choix",
        id: "bras-1",
        libelle: "Bras n°1",
        remplace: "Canon à bolts Gravis (bras n°1)",
        choix: [
          { nom: "— Canon à bolts Gravis (gratuit) —", cout: 0 },
          { nom: "Poing énergétique Gravis et combi-bolter", cout: 5 },
          { nom: "Poing tronçonneur Gravis et combi-bolter", cout: 5 },
          { nom: "Canon à fusion Gravis", cout: 15 },
          { nom: "Autocanon Gravis", cout: 10 },
          { nom: "Canon à plasma Gravis", cout: 10 },
          { nom: "Canon à conversion", cout: 20 },
          { nom: "Couleuvrine volkite jumelée", cout: 15 },
          { nom: "Canon d'assaut Kheres", cout: 15 },
          { nom: "Canon laser jumelé", cout: 15 },
        ],
      },
      {
        type: "choix",
        id: "bras-2",
        libelle: "Bras n°2",
        remplace: "Canon à bolts Gravis (bras n°2)",
        choix: [
          { nom: "— Canon à bolts Gravis (gratuit) —", cout: 0 },
          { nom: "Poing énergétique Gravis et combi-bolter", cout: 5 },
          { nom: "Poing tronçonneur Gravis et combi-bolter", cout: 5 },
          { nom: "Canon à fusion Gravis", cout: 15 },
          { nom: "Autocanon Gravis", cout: 10 },
          { nom: "Canon à plasma Gravis", cout: 10 },
          { nom: "Canon à conversion", cout: 20 },
          { nom: "Couleuvrine volkite jumelée", cout: 15 },
          { nom: "Canon d'assaut Kheres", cout: 15 },
          { nom: "Canon laser jumelé", cout: 15 },
        ],
      },
      {
        type: "paire",
        id: "paire-poings-energetiques",
        libelle: "Paire de poings énergétiques Gravis et deux combi-bolters (les deux bras)",
        cout: 5,
        ajoute: "Paire de poings énergétiques Gravis et deux combi-bolters",
        remplaceListe: ["Canon à bolts Gravis (bras n°1)", "Canon à bolts Gravis (bras n°2)"],
      },
      {
        type: "paire",
        id: "paire-poings-tronconneurs",
        libelle: "Paire de poings tronçonneurs Gravis et deux combi-bolters (les deux bras)",
        cout: 5,
        ajoute: "Paire de poings tronçonneurs Gravis et deux combi-bolters",
        remplaceListe: ["Canon à bolts Gravis (bras n°1)", "Canon à bolts Gravis (bras n°2)"],
      },
      /* Échanges de combi-bolters : uniquement si un bras au moins
         porte un combi-bolter (poings). */
      {
        type: "choix",
        id: "combi-1",
        libelle: "Remplacer un combi-bolter (si un poing en est équipé)",
        ajoute: true,
        requiertEquip: "combi-bolter",
        choix: [
          { nom: "— Aucun échange —", cout: 0 },
          { nom: "Lance-flammes lourd (à la place d'un combi-bolter)", cout: 5 },
          { nom: "Éclateur à plasma (à la place d'un combi-bolter)", cout: 10 },
          { nom: "Fusil à gravitons (à la place d'un combi-bolter)", cout: 10 },
          { nom: "Fuseur (à la place d'un combi-bolter)", cout: 15 },
        ],
      },
      {
        type: "choix",
        id: "combi-2",
        libelle: "Remplacer le second combi-bolter (si présent)",
        ajoute: true,
        requiertEquip: "deux combi-bolters",
        choix: [
          { nom: "— Aucun échange —", cout: 0 },
          { nom: "Lance-flammes lourd (à la place d'un combi-bolter)", cout: 5 },
          { nom: "Éclateur à plasma (à la place d'un combi-bolter)", cout: 10 },
          { nom: "Fusil à gravitons (à la place d'un combi-bolter)", cout: 10 },
          { nom: "Fuseur (à la place d'un combi-bolter)", cout: 15 },
        ],
      },
      {
        type: "case",
        id: "lanceur-havoc",
        libelle: "Lanceur Havoc",
        cout: 5,
        ajoute: "Lanceur Havoc",
      },
    ],
  },

  {
    id: "dreadnought-deredeo",
    nom: "Dreadnought Deredeo",
    categorie: "Engins de Guerre",
    cout: 190,
    composition: "1 Dreadnought Deredeo",
    traits: ["[Allégeance]", "[Legiones Astartes]", "Écran de Fumée"],
    equipement: ["Batterie d'autocanons Anvilus", "Bolter lourd jumelé", "Lance-missiles Aiolos"],
    variantes: [
      {
        nom: "Dreadnought Deredeo",
        cout: 0,
        profil: { M: 7, CC: 4, CT: 4, F: 6, E: 7, PV: 6, I: 4, A: 2, Cd: 12, Sf: 10, Vo: 7, Int: 5, Sv: "2+", Inv: "5+" },
        regles: ["Massif (7)", "Explose (5+)"],
        type: "Marcheur (Lourd)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "batterie",
        libelle: "Remplacer la batterie d'autocanons Anvilus",
        remplace: "Batterie d'autocanons Anvilus",
        choix: [
          { nom: "— Conserver la batterie d'autocanons Anvilus —", cout: 0 },
          { nom: "Canonnade à plasma Hellfire", cout: 15 },
          { nom: "Batterie laser lourde Arachnus", cout: 25 },
          { nom: "Fauconneau volkite", cout: 0 },
        ],
      },
      {
        type: "choix",
        id: "missiles",
        libelle: "Remplacer le lance-missiles Aiolos",
        remplace: "Lance-missiles Aiolos",
        choix: [
          { nom: "— Conserver le lance-missiles Aiolos —", cout: 0 },
          { nom: "Quatre missiles antiaériens Boreas", cout: 0 },
        ],
      },
      {
        type: "choix",
        id: "bolter-lourd",
        libelle: "Remplacer le bolter lourd jumelé",
        remplace: "Bolter lourd jumelé",
        choix: [
          { nom: "— Conserver le bolter lourd jumelé —", cout: 0 },
          { nom: "Lance-flammes lourd jumelé", cout: 0 },
        ],
      },
    ],
  },

  {
    id: "dreadnought-leviathan",
    nom: "Dreadnought Leviathan",
    categorie: "Engins de Guerre",
    cout: 220,
    composition: "1 Dreadnought Leviathan",
    traits: ["[Allégeance]", "[Legiones Astartes]", "Écran de Fumée"],
    equipement: [
      "Pince de siège Leviathan et fuseur (bras n°1)",
      "Pince de siège Leviathan et fuseur (bras n°2)",
      "Deux lance-flammes lourds",
    ],
    variantes: [
      {
        nom: "Dreadnought Leviathan",
        cout: 0,
        profil: { M: 6, CC: 4, CT: 4, F: 8, E: 8, PV: 7, I: 4, A: 4, Cd: 12, Sf: 10, Vo: 7, Int: 5, Sv: "2+", Inv: "5+" },
        regles: ["Massif (7)", "Explose (5+)", "Avance Implacable"],
        type: "Marcheur (Lourd)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "bras-1",
        libelle: "Bras n°1",
        remplace: "Pince de siège Leviathan et fuseur (bras n°1)",
        choix: [
          { nom: "— Pince de siège Leviathan et fuseur (gratuit) —", cout: 0 },
          { nom: "Trépan de siège Leviathan et fuseur", cout: 5 },
          { nom: "Bombarde à graviflux", cout: 10 },
          { nom: "Quadritube Leviathan", cout: 15 },
          { nom: "Lance à fusion cyclonique", cout: 20 },
        ],
      },
      {
        type: "choix",
        id: "bras-2",
        libelle: "Bras n°2",
        remplace: "Pince de siège Leviathan et fuseur (bras n°2)",
        choix: [
          { nom: "— Pince de siège Leviathan et fuseur (gratuit) —", cout: 0 },
          { nom: "Trépan de siège Leviathan et fuseur", cout: 5 },
          { nom: "Bombarde à graviflux", cout: 10 },
          { nom: "Quadritube Leviathan", cout: 15 },
          { nom: "Lance à fusion cyclonique", cout: 20 },
        ],
      },
      {
        type: "paire",
        id: "paire-pinces",
        libelle: "Paire de pinces de siège Leviathan et deux fuseurs (les deux bras)",
        cout: 5,
        ajoute: "Paire de pinces de siège Leviathan et deux fuseurs",
        remplaceListe: [
          "Pince de siège Leviathan et fuseur (bras n°1)",
          "Pince de siège Leviathan et fuseur (bras n°2)",
        ],
      },
      {
        type: "paire",
        id: "paire-trepans",
        libelle: "Paire de trépans de siège Leviathan et deux fuseurs (les deux bras)",
        cout: 5,
        ajoute: "Paire de trépans de siège Leviathan et deux fuseurs",
        remplaceListe: [
          "Pince de siège Leviathan et fuseur (bras n°1)",
          "Pince de siège Leviathan et fuseur (bras n°2)",
        ],
      },
      {
        type: "choix",
        id: "lance-flammes",
        libelle: "Remplacer les deux lance-flammes lourds",
        remplace: "Deux lance-flammes lourds",
        choix: [
          { nom: "— Conserver les deux lance-flammes lourds —", cout: 0 },
          { nom: "Deux arquebuses volkites jumelées", cout: 15 },
        ],
      },
      {
        type: "case",
        id: "dechargeur",
        libelle: "Déchargeur à phosphex",
        cout: 20,
        ajoute: "Déchargeur à phosphex",
      },
    ],
  },

  {
    id: "dreadnought-saturnine",
    nom: "Dreadnought Saturnine",
    categorie: "Engins de Guerre",
    cout: 340,
    composition: "1 Dreadnought Saturnine",
    traits: ["[Allégeance]", "[Legiones Astartes]", "Écran de Fumée"],
    equipement: [
      "Canon désintégrateur",
      "Bombarde à plasma lourde",
      "Deux incinérateurs photoniques",
      "Champ de diffraction thermique",
    ],
    variantes: [
      {
        nom: "Dreadnought Saturnine",
        cout: 0,
        profil: { M: 6, CC: 4, CT: 4, F: 8, E: 8, PV: 8, I: 3, A: 2, Cd: 12, Sf: 10, Vo: 7, Int: 5, Sv: "2+", Inv: "4+" },
        regles: ["Massif (8)", "Explose (4+)"],
        type: "Marcheur (Lourd)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "bombarde",
        libelle: "Remplacer la bombarde à plasma lourde",
        remplace: "Bombarde à plasma lourde",
        choix: [
          { nom: "— Conserver la bombarde à plasma lourde —", cout: 0 },
          { nom: "Canon désintégrateur", cout: 10 },
          { nom: "Canon à inversion", cout: 10 },
          { nom: "Pulvériseur à gravitons", cout: 10 },
        ],
      },
      {
        type: "choix",
        id: "canon",
        libelle: "Remplacer le canon désintégrateur",
        remplace: "Canon désintégrateur",
        choix: [
          { nom: "— Conserver le canon désintégrateur —", cout: 0 },
          { nom: "Bombarde à plasma lourde", cout: 0 },
          { nom: "Canon à inversion", cout: 0 },
          { nom: "Pulvériseur à gravitons", cout: 0 },
        ],
      },
      {
        type: "choix",
        id: "incinerateurs",
        libelle: "Remplacer les deux incinérateurs photoniques",
        remplace: "Deux incinérateurs photoniques",
        choix: [
          { nom: "— Conserver les deux incinérateurs photoniques —", cout: 0 },
          { nom: "Deux résonateurs à commotion", cout: 10 },
          { nom: "Deux lacérateurs à particules lourds", cout: 10 },
        ],
      },
    ],
  },

  /* ----------------------------------------------------------
     UNITÉS — TRANSPORTS
     ---------------------------------------------------------- */
  {
    id: "rhino",
    nom: "Rhino",
    categorie: "Transports",
    cout: 60,
    composition: "1 Rhino",
    traits: ["[Allégeance]", "[Legiones Astartes]", "Écran de Fumée"],
    /* « Deux bolters sur Pivot » éclatés en deux lignes pour les
       remplacer indépendamment (comme le Rhino Damocles). */
    equipement: ["Bolter sur Pivot n°1", "Bolter sur Pivot n°2"],
    notes: "Un Point d'Accès sur chaque Flanc et à l'Arrière.",
    variantes: [
      {
        nom: "Rhino",
        cout: 0,
        profilVehicule: { M: 12, CT: 4, avant: 12, flanc: 11, arriere: 10, PC: 5, transport: 12 },
        regles: ["Transport Léger", "Autoréparation (4+)"],
        type: "Véhicule (Transport)",
      },
    ],
    options: [
      /* Chaque bolter → combi-bolter (+5) ; UN SEUL des deux peut
         prendre la liste des Armes sur Pivot (pivot n°1 ici). */
      {
        type: "choix",
        id: "pivot-1",
        libelle: "Remplacer le premier bolter sur Pivot",
        remplace: "Bolter sur Pivot n°1",
        choix: [
          { nom: "— Conserver le bolter sur Pivot —", cout: 0 },
          ...depuisListes(LISTES_EQUIPEMENT.pivot),
        ],
      },
      {
        type: "choix",
        id: "pivot-2",
        libelle: "Remplacer le second bolter sur Pivot",
        remplace: "Bolter sur Pivot n°2",
        choix: [
          { nom: "— Conserver le bolter sur Pivot —", cout: 0 },
          { nom: "Combi-bolter sur Pivot", cout: 5 },
        ],
      },
      {
        type: "case",
        id: "projecteurs",
        libelle: "Projecteurs",
        cout: 5,
        ajoute: "Projecteurs",
      },
      {
        type: "case",
        id: "missile",
        libelle: "Missile traqueur de Coque (Avant)",
        cout: 10,
        ajoute: "Missile traqueur de Coque (Avant)",
      },
      {
        type: "case",
        id: "lame",
        libelle: "Lame de bulldozer",
        cout: 5,
        ajoute: "Lame de bulldozer",
      },
    ],
  },

  {
    id: "module-largage",
    nom: "Module de Largage",
    categorie: "Transports",
    cout: 50,
    composition: "1 Module de Largage",
    traits: ["[Allégeance]", "[Legiones Astartes]"],
    equipement: ["Combi-bolter sur Pivot"],
    notes: "Des Points d'Accès sur toutes ses Faces.",
    variantes: [
      {
        nom: "Module de Largage",
        cout: 0,
        profilVehicule: { M: "—", CT: 2, avant: 12, flanc: 12, arriere: 12, PC: 4, transport: 10 },
        regles: ["Transport Léger", "Véhicule d'Assaut Orbital", "Ouverture à l'Impact"],
        type: "Véhicule (Transport)",
      },
    ],
    options: [],
  },

  {
    id: "termite",
    nom: "Termite",
    categorie: "Transports",
    cout: 80,
    composition: "1 Termite",
    traits: ["[Allégeance]", "[Legiones Astartes]"],
    equipement: ["Deux combi-bolters sur Pivot", "Découpeurs à fusion d'Axe Central"],
    notes: "Un Point d'Accès sur chaque Flanc.",
    variantes: [
      {
        nom: "Termite",
        cout: 0,
        profilVehicule: { M: 6, CT: 4, avant: 12, flanc: 12, arriere: 10, PC: 5, transport: 12 },
        regles: ["Transport Léger", "Frappe en Profondeur"],
        type: "Véhicule (Transport)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "combi-bolters",
        libelle: "Remplacer les deux combi-bolters sur Pivot",
        remplace: "Deux combi-bolters sur Pivot",
        choix: [
          { nom: "— Conserver les deux combi-bolters sur Pivot —", cout: 0 },
          { nom: "Deux chargeurs volkites jumelés sur Pivot", cout: 10 },
          { nom: "Deux lance-flammes lourds sur Pivot", cout: 5 },
        ],
      },
    ],
  },

  /* ----------------------------------------------------------
     UNITÉS — TRANSPORTS LOURDS
     ---------------------------------------------------------- */
  {
    id: "kharybdis",
    nom: "Griffe d'Assaut Kharybdis",
    categorie: "Transports Lourds",
    cout: 235,
    composition: "1 Griffe d'Assaut Kharybdis",
    traits: ["[Allégeance]", "[Legiones Astartes]"],
    equipement: ["Lance-missiles Kharybdis de Tourelle"],
    notes: "Cette Figurine a des Points d'Accès sur toutes ses Faces.",
    variantes: [
      {
        nom: "Griffe d'Assaut Kharybdis",
        cout: 0,
        profilVehicule: { M: 14, CT: 4, avant: 12, flanc: 12, arriere: 12, PC: 8, transport: 22 },
        regles: ["Transport par Largage Lourd"],
        type: "Véhicule (Aéronef, Transport)",
      },
    ],
    options: [],
  },

  {
    id: "dreadclaw",
    nom: "Module de Largage Dreadclaw",
    categorie: "Transports Lourds",
    cout: 115,
    composition: "1 Module de Largage Dreadclaw",
    traits: ["[Allégeance]", "[Legiones Astartes]"],
    equipement: ["Aucun"],
    notes: "Cette Figurine a des Points d'Accès sur toutes ses Faces.",
    variantes: [
      {
        nom: "Module de Largage Dreadclaw",
        cout: 0,
        profilVehicule: { M: 15, CT: 4, avant: 12, flanc: 12, arriere: 12, PC: 5, transport: 12 },
        regles: ["Transport par Largage"],
        type: "Véhicule (Aéronef, Transport)",
      },
    ],
    options: [],
  },

  {
    id: "module-largage-dreadnought",
    nom: "Module de Largage à Dreadnought",
    categorie: "Transports Lourds",
    cout: 100,
    composition: "1 Module de Largage à Dreadnought",
    traits: ["[Allégeance]", "[Legiones Astartes]"],
    equipement: ["Aucun"],
    notes: "Cette Figurine a des Points d'Accès sur toutes ses Faces.",
    variantes: [
      {
        nom: "Module de Largage à Dreadnought",
        cout: 0,
        profilVehicule: { M: "—", CT: 2, avant: 12, flanc: 12, arriere: 12, PC: 5, transport: 7 },
        regles: ["Transport à Dreadnought", "Véhicule d'Assaut Orbital", "Ouverture à l'Impact"],
        type: "Véhicule (Transport)",
      },
    ],
    options: [],
  },

  {
    id: "spartan",
    nom: "Spartan",
    categorie: "Transports Lourds",
    cout: 400,
    composition: "1 Spartan",
    traits: ["[Allégeance]", "[Legiones Astartes]", "Écran de Fumée"],
    equipement: ["Deux affûts de canons laser Latéraux", "Bolter lourd jumelé de Coque (Avant)"],
    notes: "Cette Figurine a un Point d'Accès sur chaque Flanc et à l'Avant.",
    variantes: [
      {
        nom: "Spartan",
        cout: 0,
        profilVehicule: { M: 10, CT: 4, avant: 14, flanc: 14, arriere: 14, PC: 10, transport: 26 },
        regles: ["Véhicule d'Assaut", "Autoréparation (4+)"],
        type: "Véhicule (Transport)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "affuts-lateraux",
        libelle: "Remplacer les deux affûts de canons laser Latéraux",
        remplace: "Deux affûts de canons laser Latéraux",
        choix: [
          { nom: "— Conserver les affûts de canons laser Latéraux —", cout: 0 },
          { nom: "Deux destructeurs laser Latéraux", cout: 0 },
          { nom: "Deux batteries de bolters lourds Gravis Latérales", cout: 0 },
        ],
      },
      {
        type: "choix",
        id: "bolter-lourd-avant",
        libelle: "Remplacer le bolter lourd jumelé de Coque (Avant)",
        remplace: "Bolter lourd jumelé de Coque (Avant)",
        choix: [
          { nom: "— Conserver le bolter lourd jumelé —", cout: 0 },
          { nom: "Lance-flammes lourd jumelé de Coque (Avant)", cout: 0 },
          { nom: "Canon laser jumelé de Coque (Avant)", cout: 10 },
        ],
      },
      optionPivotLegion(),
      ...optionsMissileEtProjecteurs(),
    ],
  },

  {
    id: "porteur-land-raider",
    nom: "Porteur Land Raider",
    categorie: "Transports Lourds",
    cout: 265,
    composition: "1 Porteur Land Raider",
    traits: ["[Allégeance]", "[Legiones Astartes]", "Écran de Fumée"],
    equipement: ["Deux canons laser jumelés Latéraux", "Bolter lourd jumelé de Coque (Avant)"],
    notes: "Cette Figurine a un Point d'Accès sur chaque Flanc et à l'Avant.",
    variantes: [
      {
        nom: "Porteur Land Raider",
        cout: 0,
        profilVehicule: { M: 10, CT: 4, avant: 14, flanc: 14, arriere: 14, PC: 8, transport: 12 },
        regles: ["Véhicule d'Assaut", "Autoréparation (5+)"],
        type: "Véhicule (Transport)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "bolter-lourd-avant",
        libelle: "Remplacer le bolter lourd jumelé de Coque (Avant)",
        remplace: "Bolter lourd jumelé de Coque (Avant)",
        choix: [
          { nom: "— Conserver le bolter lourd jumelé —", cout: 0 },
          { nom: "Lance-flammes lourd jumelé de Coque (Avant)", cout: 0 },
          { nom: "Canon laser jumelé de Coque (Avant)", cout: 10 },
        ],
      },
      optionPivotLegion(),
      ...optionsMissileEtProjecteurs(),
    ],
  },

  /* ----------------------------------------------------------
     UNITÉS — SEIGNEUR DE BATAILLE (véhicules Super-lourds)
     Note de transcription : l'option « Cette Figurine peut
     échanger [...] contre un objet de la liste des Armes
     Latérales de Légion » (Mastodon, Typhon, Cerberus) n'a pas pu
     être transcrite — le contenu de cette liste d'équipement n'a
     pas encore été fourni. Le reste de chaque fiche est complet.
     ---------------------------------------------------------- */
  {
    id: "mastodon",
    nom: "Transport d'Assaut Super-lourd Mastodon",
    categorie: "Seigneur de Bataille",
    cout: 600,
    composition: "1 Transport d'Assaut Super-lourd Mastodon",
    traits: ["[Allégeance]", "[Legiones Astartes]", "Écran de Fumée"],
    equipement: ["Affût à fusion de siège d'Axe Central", "Batterie Skyreaper de Tourelle"],
    notes: "Cette Figurine a un Point d'Accès à l'Arrière et un Point d'Accès à l'Avant.",
    variantes: [
      {
        nom: "Transport d'Assaut Super-lourd Mastodon",
        cout: 0,
        profilVehicule: { M: 10, CT: 4, avant: 14, flanc: 14, arriere: 14, PC: 20, transport: 42 },
        regles: ["Véhicule d'Assaut", "Baie de Transport Mastodon", "Boucliers Void (2)"],
        type: "Véhicule (Transport, Super-lourd)",
      },
    ],
    // "Doit être dotée de deux objets de la liste des Armes Latérales
    // de Légion" (obligatoire) : voir la note de transcription ci-dessus.
    options: [...optionsMissileEtProjecteurs()],
  },

  {
    id: "stormbird-sokar",
    nom: "Stormbird Sokar",
    categorie: "Seigneur de Bataille",
    cout: 850,
    composition: "1 Stormbird Sokar",
    traits: ["[Allégeance]", "[Legiones Astartes]"],
    equipement: [
      "Deux canons laser jumelés de Coque (Gauche)",
      "Deux canons laser jumelés de Coque (Droite)",
      "Deux bolters lourds jumelés de Tourelle",
      "Bolter lourd jumelé de Coque (Arrière)",
      "Six missiles Hellstrike d'Axe Central",
    ],
    notes: "Si cette Figurine n'a pas de socle, on considère qu'elle a des Points d'Accès sur toutes ses Faces.",
    variantes: [
      {
        nom: "Stormbird Sokar",
        cout: 0,
        profilVehicule: { M: 16, CT: 4, avant: 14, flanc: 14, arriere: 14, PC: 22, transport: 52 },
        regles: ["Baie de Transport Stormbird", "Boucliers Void (2)"],
        type: "Véhicule (Transport, Super-lourd, Aéronef)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "canons-gauche",
        libelle: "Remplacer gratuitement tout canon laser jumelé de Coque (Gauche)",
        remplace: "Deux canons laser jumelés de Coque (Gauche)",
        choix: [
          { nom: "— Conserver les canons laser jumelés (Gauche) —", cout: 0 },
          { nom: "Batterie de bolters lourds Gravis de Coque (Gauche)", cout: 0 },
        ],
      },
      {
        type: "choix",
        id: "canons-droite",
        libelle: "Remplacer gratuitement tout canon laser jumelé de Coque (Droite)",
        remplace: "Deux canons laser jumelés de Coque (Droite)",
        choix: [
          { nom: "— Conserver les canons laser jumelés (Droite) —", cout: 0 },
          { nom: "Batterie de bolters lourds Gravis de Coque (Droite)", cout: 0 },
        ],
      },
    ],
  },

  {
    id: "escorteur-thunderhawk",
    nom: "Escorteur Thunderhawk",
    categorie: "Seigneur de Bataille",
    cout: 685,
    composition: "1 Escorteur Thunderhawk",
    traits: ["[Allégeance]", "[Legiones Astartes]", "Écran de Fumée"],
    equipement: [
      "Destructeur turbo-laser d'Axe Central",
      "Deux bolters lourds jumelés de Tourelle",
      "Deux bolters lourds jumelés Latéraux",
      "Deux canons laser de Coque (Avant)",
      "Six missiles Hellstrike d'Axe Central",
    ],
    notes: "Si cette Figurine n'a pas de socle, on considère qu'elle a des Points d'Accès sur toutes ses Faces.",
    variantes: [
      {
        nom: "Escorteur Thunderhawk",
        cout: 0,
        profilVehicule: { M: 18, CT: 4, avant: 13, flanc: 13, arriere: 13, PC: 18, transport: 32 },
        regles: ["Baie de Transport Thunderhawk"],
        type: "Véhicule (Transport, Super-lourd, Aéronef)",
      },
    ],
    options: [],
  },

  {
    id: "falchion",
    nom: "Chasseur de Chars Super-lourd Falchion",
    categorie: "Seigneur de Bataille",
    cout: 650,
    composition: "1 Chasseur de Chars Super-lourd Falchion",
    traits: ["[Allégeance]", "[Legiones Astartes]", "Écran de Fumée"],
    equipement: ["Canon à onde neutronique d'Axe Central", "Deux affûts de canons laser Latéraux"],
    variantes: [
      {
        nom: "Chasseur de Chars Super-lourd Falchion",
        cout: 0,
        profilVehicule: { M: 10, CT: 4, avant: 14, flanc: 13, arriere: 12, PC: 18, transport: "—" },
        regles: ["Aucune"],
        type: "Véhicule (Super-lourd)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "affuts-lateraux",
        libelle: "Remplacer les deux affûts de canons laser Latéraux",
        remplace: "Deux affûts de canons laser Latéraux",
        choix: [
          { nom: "— Conserver les affûts de canons laser Latéraux —", cout: 0 },
          { nom: "Deux destructeurs laser Latéraux", cout: 0 },
          { nom: "Deux batteries de bolters lourds Gravis Latérales", cout: 0 },
        ],
      },
      ...optionsVehiculeSuperLourdPivot(),
    ],
  },

  {
    id: "fellblade",
    nom: "Char de Combat Super-lourd Fellblade",
    categorie: "Seigneur de Bataille",
    cout: 650,
    composition: "1 Char de Combat Super-lourd Fellblade",
    traits: ["[Allégeance]", "[Legiones Astartes]", "Écran de Fumée"],
    equipement: [
      "Canon accélérateur Fellblade de Tourelle",
      "Bolter lourd jumelé de Coque (Avant)",
      "Canon Demolisher de Coque (Avant)",
      "Deux affûts de canons laser Latéraux",
    ],
    variantes: [
      {
        nom: "Char de Combat Super-lourd Fellblade",
        cout: 0,
        profilVehicule: { M: 10, CT: 4, avant: 14, flanc: 13, arriere: 12, PC: 18, transport: "—" },
        regles: ["Aucune"],
        type: "Véhicule (Super-lourd)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "bolter-lourd-avant",
        libelle: "Remplacer gratuitement le bolter lourd jumelé de Coque (Avant)",
        remplace: "Bolter lourd jumelé de Coque (Avant)",
        choix: [
          { nom: "— Conserver le bolter lourd jumelé —", cout: 0 },
          { nom: "Lance-flammes lourd jumelé de Coque (Avant)", cout: 0 },
        ],
      },
      {
        type: "choix",
        id: "affuts-lateraux",
        libelle: "Remplacer les deux affûts de canons laser Latéraux",
        remplace: "Deux affûts de canons laser Latéraux",
        choix: [
          { nom: "— Conserver les affûts de canons laser Latéraux —", cout: 0 },
          { nom: "Deux destructeurs laser Latéraux", cout: 0 },
          { nom: "Deux batteries de bolters lourds Gravis Latérales", cout: 0 },
        ],
      },
      ...optionsVehiculeSuperLourdPivot(),
    ],
  },

  {
    id: "glaive",
    nom: "Char à Arme Spéciale Super-lourd Glaive",
    categorie: "Seigneur de Bataille",
    cout: 650,
    composition: "1 Char à Arme Spéciale Super-lourd Glaive",
    traits: ["[Allégeance]", "[Legiones Astartes]", "Écran de Fumée"],
    equipement: [
      "Carronade volkite de Tourelle",
      "Bolter lourd jumelé de Coque (Avant)",
      "Deux affûts de canons laser Latéraux",
    ],
    variantes: [
      {
        nom: "Char à Arme Spéciale Super-lourd Glaive",
        cout: 0,
        profilVehicule: { M: 10, CT: 4, avant: 14, flanc: 13, arriere: 12, PC: 18, transport: "—" },
        regles: ["Aucune"],
        type: "Véhicule (Super-lourd)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "bolter-lourd-avant",
        libelle: "Remplacer gratuitement le bolter lourd jumelé de Coque (Avant)",
        remplace: "Bolter lourd jumelé de Coque (Avant)",
        choix: [
          { nom: "— Conserver le bolter lourd jumelé —", cout: 0 },
          { nom: "Lance-flammes lourd jumelé de Coque (Avant)", cout: 0 },
        ],
      },
      {
        type: "choix",
        id: "affuts-lateraux",
        libelle: "Remplacer les deux affûts de canons laser Latéraux",
        remplace: "Deux affûts de canons laser Latéraux",
        choix: [
          { nom: "— Conserver les affûts de canons laser Latéraux —", cout: 0 },
          { nom: "Deux destructeurs laser Latéraux", cout: 0 },
          { nom: "Deux batteries de bolters lourds Gravis Latérales", cout: 0 },
        ],
      },
      ...optionsVehiculeSuperLourdPivot(),
    ],
  },

  {
    id: "typhon",
    nom: "Char de Siège Lourd Typhon",
    categorie: "Seigneur de Bataille",
    cout: 400,
    composition: "1 Char de Siège Lourd Typhon",
    traits: ["[Allégeance]", "[Legiones Astartes]", "Écran de Fumée"],
    equipement: ["Canon de siège Dreadhammer d'Axe Central", "Deux bolters lourds Latéraux"],
    variantes: [
      {
        nom: "Char de Siège Lourd Typhon",
        cout: 0,
        profilVehicule: { M: 10, CT: 4, avant: 14, flanc: 14, arriere: 13, PC: 12, transport: "—" },
        regles: ["Explose (5+)"],
        type: "Véhicule (Super-lourd)",
      },
    ],
    // "Peut échanger ses deux bolters lourds Latéraux contre un objet
    // de la liste des Armes Latérales de Légion" : voir la note de
    // transcription en tête de section.
    options: [...optionsVehiculeSuperLourdPivot()],
  },

  {
    id: "cerberus",
    nom: "Chasseur de Chars Lourd Cerberus",
    categorie: "Seigneur de Bataille",
    cout: 400,
    composition: "1 Chasseur de Chars Lourd Cerberus",
    traits: ["[Allégeance]", "[Legiones Astartes]", "Écran de Fumée"],
    equipement: ["Batterie laser à neutrons d'Axe Central", "Deux bolters lourds Latéraux"],
    variantes: [
      {
        nom: "Chasseur de Chars Lourd Cerberus",
        cout: 0,
        profilVehicule: { M: 10, CT: 4, avant: 14, flanc: 14, arriere: 13, PC: 12, transport: "—" },
        regles: ["Explose (4+)"],
        type: "Véhicule (Super-lourd)",
      },
    ],
    // "Peut échanger ses deux bolters lourds Latéraux contre un objet
    // de la liste des Armes Latérales de Légion" : voir la note de
    // transcription en tête de section.
    options: [...optionsVehiculeSuperLourdPivot()],
  },
];
