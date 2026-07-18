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
  laterales: {
    nom: "Armes Latérales de Légion",
    items: [
      { nom: "Deux bolters lourds Latéraux", cout: 0 },
      { nom: "Deux lance-flammes lourds Latéraux", cout: 0 },
      { nom: "Deux canons laser Latéraux", cout: 20 },
      { nom: "Deux couleuvrines volkites Latérales", cout: 10 },
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
      choix.push({
        nom: item.nom + " (liste " + liste.nom + ")",
        cout: item.cout,
      });
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
function quantiteDepuisListe(
  liste,
  { groupe, parTranche = 1, remplace = "" } = {},
) {
  return liste.items.map((item) => ({
    type: "quantite",
    id: groupe + "-" + slug(item.nom),
    libelle:
      "Figurines : " +
      item.nom +
      (remplace ? " (à la place " + remplace + ")" : ""),
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
    ...quantiteDepuisListe(LISTES_EQUIPEMENT.combinees, {
      groupe: "tir",
      remplace: "du bolter",
    }),
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
      libelle:
        "Figurines prenant un objet de la liste des Pistolets de Légion (à la place du pistolet bolter)",
      cout: 5,
      parTranche: 1,
      groupe: "pistolet",
      ajoute: "Pistolet de Légion (à la place du pistolet bolter)",
    },
    {
      type: "case",
      id: "champion-pistolet-desintegrateur",
      libelle:
        libelleChampion +
        " : pistolet désintégrateur (à la place du pistolet bolter)",
      cout: 5,
      ajoute: libelleChampion + " : pistolet désintégrateur",
    },
    {
      type: "quantite",
      id: "paires-griffes",
      libelle:
        "Figurines : paire de griffes Lightning (remplace bolter ET pistolet bolter)",
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
    choix: [
      { nom: "— Aucun —", cout: 0 },
      ...depuisListes(LISTES_EQUIPEMENT.pivot),
    ],
  };
}

function optionsVehiculeSuperLourdPivot() {
  return [optionPivotLegion(), ...optionsMissileEtProjecteurs()];
}

/* Remplace les deux bolters lourds Latéraux (équipement de départ
   standard des Blindés et de certains Seigneurs des Batailles) par un
   objet de la liste des Armes Latérales de Légion. On exclut de cette
   liste « Deux bolters lourds Latéraux » lui-même : il est déjà
   l'option « conserver » par défaut. `extra` : choix propres à
   l'unité, en plus de la liste générique (ex : Arquitor, qui propose
   aussi des autocanons Latéraux hors liste). */
function optionLaterauxLegion(...extra) {
  return {
    type: "choix",
    id: "bolters-lateraux",
    libelle: "Remplacer les deux bolters lourds Latéraux",
    remplace: "Deux bolters lourds Latéraux",
    choix: [
      { nom: "— Conserver les bolters lourds Latéraux —", cout: 0 },
      ...extra,
      ...depuisListes(LISTES_EQUIPEMENT.laterales).filter(
        (item) => !item.nom.startsWith("Deux bolters lourds Latéraux"),
      ),
    ],
  };
}

/* Fin de fiche récurrente des véhicules Blindés (Arquitor, Scorpius,
   Vindicator, Kratos, Sicaran, Sicaran Venator, Predator) : missile
   traqueur (position variable selon le châssis — Coque (Avant) ou
   Tourelle), Projecteurs, et Lame de bulldozer (absente sur certains
   châssis, voir chaque fiche). */
function optionsFinBlinde({
  missile = "Coque (Avant)",
  bulldozer = true,
} = {}) {
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
        profil: {
          M: 7,
          CC: 6,
          CT: 5,
          F: 4,
          E: 4,
          PV: 4,
          I: 5,
          A: 5,
          Cd: 10,
          Sf: 9,
          Vo: 9,
          Int: 9,
          Sv: "2+",
          Inv: "4+",
        },
        regles: ["Aucune"],
        type: "Infanterie (État-major)",
      },
      {
        nom: "Praetor à Réacteurs",
        cout: 20,
        profil: {
          M: 12,
          CC: 6,
          CT: 5,
          F: 4,
          E: 4,
          PV: 4,
          I: 5,
          A: 5,
          Cd: 10,
          Sf: 9,
          Vo: 9,
          Int: 9,
          Sv: "2+",
          Inv: "4+",
        },
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
          ...depuisListes(
            LISTES_EQUIPEMENT.officier,
            LISTES_EQUIPEMENT.combinees,
          ),
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
        libelle:
          "Paire de griffes Lightning (remplace le bolter et le pistolet bolter)",
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
        profil: {
          M: 6,
          CC: 6,
          CT: 5,
          F: 4,
          E: 5,
          PV: 5,
          I: 5,
          A: 5,
          Cd: 10,
          Sf: 9,
          Vo: 9,
          Int: 9,
          Sv: "2+",
          Inv: "4+",
        },
        regles: ["Massif (2)", "Avance Implacable", "Lent et Méthodique"],
        type: "Infanterie (État-major, Lourd)",
      },
      {
        nom: "Praetor Tartaros",
        cout: 10,
        profil: {
          M: 7,
          CC: 6,
          CT: 5,
          F: 4,
          E: 5,
          PV: 5,
          I: 5,
          A: 5,
          Cd: 10,
          Sf: 9,
          Vo: 9,
          Int: 9,
          Sv: "2+",
          Inv: "4+",
        },
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
        libelle:
          "Paire de griffes Lightning (remplace le combi-bolter et l'arme énergétique)",
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
        profil: {
          M: 5,
          CC: 6,
          CT: 5,
          F: 4,
          E: 6,
          PV: 6,
          I: 4,
          A: 4,
          Cd: 10,
          Sf: 9,
          Vo: 9,
          Int: 9,
          Sv: "2+",
          Inv: "4+",
        },
        regles: ["Massif (4)", "Avance Implacable", "Lent et Méthodique"],
        type: "Infanterie (État-major, Lourd)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "marteau",
        libelle:
          "Marteau commotionneur Saturnine (remplace la hache OU le poing)",
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
     UNITÉ RÉSERVÉE À LA Ve LÉGION (WHITE SCARS)
     `legion: "V"` : n'apparaît dans le sélecteur « Unité à ajouter »
     (js/unites.js, initialiserChoixUnite) que si cette Légion est
     choisie dans les paramètres de la partie (js/organigramme.js).
     ---------------------------------------------------------- */
  {
    id: "qin-xa",
    nom: "Qin Xa",
    categorie: "Quartier Général",
    cout: 210,
    composition: "1 Qin Xa",
    notes: "Maître de la Keshig, Élu du Khagan.",
    traits: ["Loyaliste", "White Scars", "Maître de la Légion"],
    equipement: ["Les Queues du Dragon"],
    variantes: [
      {
        nom: "Qin Xa",
        cout: 0,
        profil: {
          M: 7,
          CC: 6,
          CT: 4,
          F: 4,
          E: 5,
          PV: 4,
          I: 5,
          A: 5,
          Cd: 10,
          Sf: 9,
          Vo: 9,
          Int: 9,
          Sv: "2+",
          Inv: "4+",
        },
        regles: ["Massif (2)", "Élu du Khagan"],
        type: "Infanterie (Unique, État-major)",
      },
    ],
    options: [],
    legion: "V",
  },

  /* ----------------------------------------------------------
     UNITÉ RÉSERVÉE À LA IXe LÉGION (BLOOD ANGELS)
     `legion: "IX"` : n'apparaît dans le sélecteur « Unité à ajouter »
     (js/unites.js, initialiserChoixUnite) que si cette Légion est
     choisie dans les paramètres de la partie (js/organigramme.js).
     ---------------------------------------------------------- */
  {
    id: "raldoron",
    nom: "Maître de Chapitre Raldoron",
    categorie: "Quartier Général",
    cout: 180,
    composition: "1 Raldoron",
    notes:
      "Premier Capitaine des Blood Angels, L'Archein de Sagesse, L'Ange Tranquille.",
    traits: ["Loyaliste", "Blood Angels", "Maître de la Légion"],
    equipement: [
      "La Lame de Guerre Carmin",
      "Combi-lance-flammes",
      "Pistolet bolter",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Raldoron",
        cout: 0,
        profil: {
          M: 7,
          CC: 7,
          CT: 5,
          F: 4,
          E: 4,
          PV: 4,
          I: 5,
          A: 4,
          Cd: 10,
          Sf: 9,
          Vo: 9,
          Int: 9,
          Sv: "2+",
          Inv: "4+",
        },
        regles: ["Archein de Sagesse"],
        type: "Infanterie (Unique, État-major)",
      },
    ],
    options: [],
    legion: "IX",
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
        profil: {
          M: 7,
          CC: 5,
          CT: 5,
          F: 4,
          E: 4,
          PV: 3,
          I: 5,
          A: 4,
          Cd: 9,
          Sf: 8,
          Vo: 8,
          Int: 8,
          Sv: "2+",
          Inv: "5+",
        },
        regles: ["Officier de Ligne (2)"],
        type: "Infanterie (État-major)",
      },
      {
        nom: "Centurion à Réacteurs",
        cout: 20,
        profil: {
          M: 12,
          CC: 5,
          CT: 5,
          F: 4,
          E: 4,
          PV: 3,
          I: 5,
          A: 4,
          Cd: 9,
          Sf: 8,
          Vo: 8,
          Int: 8,
          Sv: "2+",
          Inv: "5+",
        },
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
          ...depuisListes(
            LISTES_EQUIPEMENT.officier,
            LISTES_EQUIPEMENT.combinees,
          ),
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
        libelle:
          "Paire de griffes Lightning (remplace le bolter et le pistolet bolter)",
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
        profil: {
          M: 6,
          CC: 5,
          CT: 5,
          F: 4,
          E: 5,
          PV: 4,
          I: 5,
          A: 4,
          Cd: 9,
          Sf: 8,
          Vo: 8,
          Int: 8,
          Sv: "2+",
          Inv: "4+",
        },
        regles: [
          "Officier de Ligne (2)",
          "Massif (2)",
          "Avance Implacable",
          "Lent et Méthodique",
        ],
        type: "Infanterie (État-major, Lourd)",
      },
      {
        nom: "Centurion Tartaros",
        cout: 0,
        profil: {
          M: 7,
          CC: 5,
          CT: 5,
          F: 4,
          E: 5,
          PV: 4,
          I: 5,
          A: 4,
          Cd: 9,
          Sf: 8,
          Vo: 8,
          Int: 8,
          Sv: "2+",
          Inv: "5+",
        },
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
        libelle:
          "Paire de griffes Lightning (remplace le combi-bolter et l'arme énergétique)",
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
        profil: {
          M: 7,
          CC: 5,
          CT: 4,
          F: 4,
          E: 4,
          PV: 2,
          I: 5,
          A: 3,
          Cd: 9,
          Sf: 8,
          Vo: 8,
          Int: 8,
          Sv: "3+",
          Inv: "—",
        },
        regles: ["Aucune"],
        type: "Infanterie (État-major)",
      },
      {
        nom: "Optae à Réacteurs",
        cout: 20,
        profil: {
          M: 12,
          CC: 5,
          CT: 4,
          F: 4,
          E: 4,
          PV: 2,
          I: 5,
          A: 3,
          Cd: 9,
          Sf: 8,
          Vo: 8,
          Int: 8,
          Sv: "3+",
          Inv: "—",
        },
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
          ...depuisListes(
            LISTES_EQUIPEMENT.meleeSergent,
            LISTES_EQUIPEMENT.combinees,
          ),
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
          ...depuisListes(
            LISTES_EQUIPEMENT.meleeSergent,
            LISTES_EQUIPEMENT.pistolets,
          ),
        ],
      },
      {
        type: "paire",
        id: "griffes",
        libelle:
          "Paire de griffes Lightning (remplace le bolter et le pistolet bolter)",
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
    equipement: [
      "Bolter sur Pivot n°1",
      "Bolter sur Pivot n°2",
      "Relais vox d'état-major",
    ],
    notes: "Un Point d'Accès sur chaque Flanc et à l'Arrière.",
    variantes: [
      {
        nom: "Rhino d'État-major Damocles",
        cout: 0,
        profilVehicule: {
          M: 12,
          CT: 4,
          avant: 12,
          flanc: 11,
          arriere: 10,
          PC: 5,
          transport: 6,
        },
        regles: [
          "Transport Léger",
          "Autoréparation (5+)",
          "Véhicule d'État-major Mobile",
        ],
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
    equipement: [
      "Arme de force",
      "Pistolet bolter",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Archiviste",
        cout: 0,
        profil: {
          M: 7,
          CC: 5,
          CT: 5,
          F: 4,
          E: 4,
          PV: 3,
          I: 5,
          A: 4,
          Cd: 8,
          Sf: 7,
          Vo: 9,
          Int: 8,
          Sv: "2+",
          Inv: "5+",
        },
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
    equipement: [
      "Lame de parangon",
      "Serpentine volkite",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Champion de Légion",
        cout: 0,
        profil: {
          M: 7,
          CC: 6,
          CT: 5,
          F: 4,
          E: 4,
          PV: 3,
          I: 5,
          A: 5,
          Cd: 8,
          Sf: 8,
          Vo: 8,
          Int: 8,
          Sv: "2+",
          Inv: "5+",
        },
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
    equipement: [
      "Fusil Némésis",
      "Pistolet bolter",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Vigilator",
        cout: 0,
        profil: {
          M: 7,
          CC: 4,
          CT: 7,
          F: 4,
          E: 4,
          PV: 3,
          I: 5,
          A: 3,
          Cd: 9,
          Sf: 8,
          Vo: 8,
          Int: 8,
          Sv: "2+",
          Inv: "5+",
        },
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
    equipement: [
      "Arme de force",
      "Pistolet archéotech",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Ésotériste",
        cout: 0,
        profil: {
          M: 7,
          CC: 5,
          CT: 5,
          F: 4,
          E: 4,
          PV: 3,
          I: 5,
          A: 4,
          Cd: 7,
          Sf: 8,
          Vo: 10,
          Int: 8,
          Sv: "2+",
          Inv: "5+",
        },
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
    equipement: [
      "Pistolet bolter",
      "Grenades Frag",
      "Grenades Krak",
      "Relais vox d'état-major",
    ],
    variantes: [
      {
        nom: "Maître des Signaux",
        cout: 0,
        profil: {
          M: 7,
          CC: 5,
          CT: 5,
          F: 4,
          E: 4,
          PV: 3,
          I: 5,
          A: 4,
          Cd: 8,
          Sf: 7,
          Vo: 7,
          Int: 10,
          Sv: "2+",
          Inv: "5+",
        },
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
        profil: {
          M: 7,
          CC: 5,
          CT: 5,
          F: 4,
          E: 4,
          PV: 3,
          I: 5,
          A: 4,
          Cd: 9,
          Sf: 8,
          Vo: 8,
          Int: 9,
          Sv: "2+",
          Inv: "5+",
        },
        regles: [
          "Guerrier-artisan (1)",
          "Insensible à la Douleur (5+)",
          "Maître des Automates",
        ],
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
        profil: {
          M: 12,
          CC: 4,
          CT: 6,
          F: 4,
          E: 4,
          PV: 3,
          I: 5,
          A: 3,
          Cd: 8,
          Sf: 9,
          Vo: 8,
          Int: 8,
          Sv: "2+",
          Inv: "5+",
        },
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
        profil: {
          M: 7,
          CC: 5,
          CT: 5,
          F: 4,
          E: 4,
          PV: 3,
          I: 5,
          A: 4,
          Cd: 9,
          Sf: 9,
          Vo: 8,
          Int: 8,
          Sv: "2+",
          Inv: "5+",
        },
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
    equipement: [
      "Pistolet bolter",
      "Fouet énergétique",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Superviseur",
        cout: 0,
        profil: {
          M: 7,
          CC: 5,
          CT: 5,
          F: 4,
          E: 4,
          PV: 3,
          I: 5,
          A: 4,
          Cd: 9,
          Sf: 9,
          Vo: 8,
          Int: 8,
          Sv: "2+",
          Inv: "5+",
        },
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
        profil: {
          M: 7,
          CC: 5,
          CT: 5,
          F: 4,
          E: 4,
          PV: 3,
          I: 5,
          A: 4,
          Cd: 9,
          Sf: 9,
          Vo: 8,
          Int: 8,
          Sv: "2+",
          Inv: "5+",
        },
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
    equipement: [
      "Pistolet bolter",
      "Crozius Arcanum",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Chapelain",
        cout: 0,
        profil: {
          M: 7,
          CC: 5,
          CT: 4,
          F: 4,
          E: 4,
          PV: 3,
          I: 5,
          A: 4,
          Cd: 9,
          Sf: 10,
          Vo: 8,
          Int: 7,
          Sv: "2+",
          Inv: "5+",
        },
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
     UNITÉ RÉSERVÉE À LA XIXe LÉGION (RAVEN GUARD)
     `legion: "XIX"` : n'apparaît dans le sélecteur « Unité à ajouter »
     (js/unites.js, initialiserChoixUnite) que si cette Légion est
     choisie dans les paramètres de la partie (js/organigramme.js).
     ---------------------------------------------------------- */
  {
    id: "kaedes-nex",
    nom: "Kaedes Nex",
    categorie: "État-major",
    cout: 165,
    composition: "1 Kaedes Nex",
    notes:
      "Le Veneur du Corbeau, « La Corneille Sanglante ». Infanterie (Unique, Spécialiste) : p. 283, seul l'Avantage Principal Bénéfice Logistique lui est accessible s'il occupe une Case Principale.",
    traits: ["Loyaliste", "Raven Guard"],
    equipement: [
      "Canons de poing Fulcrum (Tir)",
      "Canons de poing Fulcrum (Mêlée)",
      "Caméléolin",
      "Grenades Frag",
      "Grenades Krak",
      "Bombes à fusion",
    ],
    variantes: [
      {
        nom: "Kaedes Nex",
        cout: 0,
        profil: {
          M: 8,
          CC: 5,
          CT: 6,
          F: 4,
          E: 4,
          PV: 3,
          I: 5,
          A: 3,
          Cd: 9,
          Sf: 8,
          Vo: 8,
          Int: 8,
          Sv: "3+",
          Inv: "5+",
        },
        regles: [
          "Infiltration (8)",
          "La Corneille Sanglante",
          "Précision (5+)",
        ],
        type: "Infanterie (Unique, Spécialiste)",
      },
    ],
    options: [],
    legion: "XIX",
  },

  /* ----------------------------------------------------------
     UNITÉS RÉSERVÉES À LA Ve LÉGION (WHITE SCARS)
     Voir la note sur Qin Xa, catégorie Quartier Général ci-dessus.
     ---------------------------------------------------------- */
  {
    id: "hibou-khan",
    nom: "Hibou Khan",
    categorie: "État-major",
    cout: 165,
    composition: "1 Hibou Khan",
    notes: "Le Khan Proscrit, Sagyar Mazan, Chercheur d'Expiation.",
    traits: ["Loyaliste", "White Scars"],
    equipement: [
      "Le Souffle de la Tempête",
      "Pistolet bolter",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Hibou Khan",
        cout: 0,
        profil: {
          M: 7,
          CC: 6,
          CT: 5,
          F: 4,
          E: 4,
          PV: 3,
          I: 5,
          A: 4,
          Cd: 10,
          Sf: 8,
          Vo: 8,
          Int: 8,
          Sv: "2+",
          Inv: "5+",
        },
        regles: [
          "Officier de Ligne (2)",
          "Chercheur d'Expiation",
          "Sacrifiable (2)",
        ],
        type: "Infanterie (Unique, État-major)",
      },
    ],
    options: [],
    legion: "V",
  },

  {
    id: "devin-de-lorage",
    nom: "Devin de l'Orage",
    categorie: "État-major",
    cout: 95,
    composition: "1 Devin de l'Orage",
    traits: ["[Allégeance]", "White Scars", "Psyker"],
    equipement: [
      "Bâton de force",
      "Pistolet bolter",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Devin de l'Orage",
        cout: 0,
        profil: {
          M: 7,
          CC: 5,
          CT: 5,
          F: 4,
          E: 4,
          PV: 3,
          I: 5,
          A: 4,
          Cd: 8,
          Sf: 7,
          Vo: 10,
          Int: 8,
          Sv: "2+",
          Inv: "5+",
        },
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
          { nom: "Appel de l'Orage", cout: 10 },
          { nom: "Divination", cout: 10 },
          { nom: "Thaumaturgie", cout: 20 },
          { nom: "Télépathie", cout: 0 },
        ],
      },
    ],
    legion: "V",
  },

  /* ----------------------------------------------------------
     UNITÉS RÉSERVÉES À LA IXe LÉGION (BLOOD ANGELS)
     Voir la note sur Raldoron, catégorie Quartier Général ci-dessus.
     ---------------------------------------------------------- */
  {
    id: "aster-crohne",
    nom: "Aster Crohne",
    categorie: "État-major",
    cout: 155,
    composition: "1 Aster Crohne",
    notes: "Capitaine de la 94e Compagnie, Le Tisseur de Suaire.",
    traits: ["Loyaliste", "Blood Angels"],
    equipement: [
      "Deux lance-flammes légers",
      "Hache saiphaine",
      "Grenades Frag",
      "Grenades Krak",
      "Grenades Rad",
    ],
    variantes: [
      {
        nom: "Aster Crohne",
        cout: 0,
        profil: {
          M: 7,
          CC: 5,
          CT: 5,
          F: 4,
          E: 4,
          PV: 3,
          I: 5,
          A: 3,
          Cd: 9,
          Sf: 8,
          Vo: 8,
          Int: 8,
          Sv: "2+",
          Inv: "4+",
        },
        regles: ["Officier de Ligne (2)", "Le Fantôme de Saiph"],
        type: "Infanterie (Unique, État-major)",
      },
    ],
    options: [],
    legion: "IX",
  },

  {
    id: "dominion-zephon",
    nom: "Dominion Zephon",
    categorie: "État-major",
    cout: 185,
    composition: "1 Dominion Zephon",
    notes:
      "Le Porteur de Tourments, L'Exilé, Le Deux Fois Né, Exarque de l'Ost Supérieur.",
    traits: ["Loyaliste", "Blood Angels"],
    equipement: [
      "Lamentation et Chagrin",
      "Le Spiritum Sanguis",
      "Grenades Rad",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Dominion Zephon",
        cout: 0,
        profil: {
          M: 12,
          CC: 6,
          CT: 5,
          F: 4,
          E: 4,
          PV: 4,
          I: 5,
          A: 4,
          Cd: 10,
          Sf: 9,
          Vo: 9,
          Int: 9,
          Sv: "2+",
          Inv: "4+",
        },
        regles: [
          "Officier de Ligne (2)",
          "Massif (2)",
          "Frappe en Profondeur",
          "Guerrier Éternel (1)",
        ],
        type: "Infanterie (Unique, État-major, Antigrav)",
      },
    ],
    options: [],
    legion: "IX",
  },

  /* ----------------------------------------------------------
     UNITÉS — SUITES (ESCOUADES D'ÉTAT-MAJOR)
     Catégorie de Force Organisationnelle "Suites" : escouades
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
    categorie: "Suites",
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
          {
            nom: "Élu Cataphractii",
            profil: {
              M: 6,
              CC: 5,
              CT: 4,
              F: 4,
              E: 5,
              PV: 2,
              I: 4,
              A: 3,
              Cd: 8,
              Sf: 8,
              Vo: 7,
              Int: 7,
              Sv: "2+",
              Inv: "4+",
            },
          },
          {
            nom: "Champion Élu Cataphractii",
            profil: {
              M: 6,
              CC: 5,
              CT: 4,
              F: 4,
              E: 5,
              PV: 2,
              I: 4,
              A: 4,
              Cd: 8,
              Sf: 8,
              Vo: 7,
              Int: 7,
              Sv: "2+",
              Inv: "4+",
            },
          },
        ],
        regles: ["Massif (2)", "Avance Implacable", "Lent et Méthodique"],
        type: "Champion Élu Cataphractii : Infanterie (Champion, Sergent, Lourd) · Élu Cataphractii : Infanterie (Lourd)",
      },
    ],
    options: [
      {
        type: "quantite",
        id: "combi-bolter",
        libelle:
          "Figurines échangeant leur chargeur volkite contre un combi-bolter",
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
      ...quantiteDepuisListe(LISTES_EQUIPEMENT.meleeTerminator, {
        groupe: "melee",
        remplace: "de l'arme énergétique",
      }),
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
        libelle: "Champion Élu Cataphractii : harnais à grenades",
        cout: 5,
        ajoute: "Champion Élu Cataphractii : harnais à grenades",
      },
      {
        type: "case",
        id: "etendard",
        libelle:
          "Un Élu Cataphractii : étendard de Légion (à la place du chargeur volkite)",
        cout: 20,
        ajoute:
          "Un Élu Cataphractii : étendard de Légion (à la place du chargeur volkite)",
      },
    ],
  },

  {
    id: "escouade-etat-major-tartaros",
    nom: "Escouade d'État-Major Terminator Tartaros",
    categorie: "Suites",
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
          {
            nom: "Élu Tartaros",
            profil: {
              M: 7,
              CC: 5,
              CT: 4,
              F: 4,
              E: 5,
              PV: 2,
              I: 4,
              A: 3,
              Cd: 8,
              Sf: 8,
              Vo: 7,
              Int: 7,
              Sv: "2+",
              Inv: "5+",
            },
          },
          {
            nom: "Champion Élu Tartaros",
            profil: {
              M: 7,
              CC: 5,
              CT: 4,
              F: 4,
              E: 5,
              PV: 2,
              I: 4,
              A: 4,
              Cd: 8,
              Sf: 8,
              Vo: 7,
              Int: 7,
              Sv: "2+",
              Inv: "5+",
            },
          },
        ],
        regles: ["Massif (2)", "Avance Implacable"],
        type: "Champion Élu Tartaros : Infanterie (Champion, Sergent) · Élu Tartaros : Infanterie",
      },
    ],
    options: [
      {
        type: "quantite",
        id: "chargeur-volkite",
        libelle:
          "Figurines échangeant leur combi-bolter contre un chargeur volkite",
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
      ...quantiteDepuisListe(LISTES_EQUIPEMENT.meleeTerminator, {
        groupe: "melee",
        remplace: "de l'arme énergétique",
      }),
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
        libelle: "Champion Élu Tartaros : harnais à grenades",
        cout: 5,
        ajoute: "Champion Élu Tartaros : harnais à grenades",
      },
      {
        type: "case",
        id: "etendard",
        libelle:
          "Un Élu Tartaros : étendard de Légion (à la place du combi-bolter)",
        cout: 20,
        ajoute:
          "Un Élu Tartaros : étendard de Légion (à la place du combi-bolter)",
      },
    ],
  },

  {
    id: "escouade-etat-major-centurion",
    nom: "Escouade d'État-Major de Centurion",
    categorie: "Suites",
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
          {
            nom: "Vétéran",
            profil: {
              M: 7,
              CC: 5,
              CT: 4,
              F: 4,
              E: 4,
              PV: 2,
              I: 4,
              A: 3,
              Cd: 8,
              Sf: 8,
              Vo: 7,
              Int: 7,
              Sv: "3+",
              Inv: "—",
            },
          },
          {
            nom: "Champion Vétéran",
            profil: {
              M: 7,
              CC: 5,
              CT: 4,
              F: 4,
              E: 4,
              PV: 2,
              I: 4,
              A: 3,
              Cd: 8,
              Sf: 8,
              Vo: 7,
              Int: 7,
              Sv: "3+",
              Inv: "—",
            },
          },
        ],
        regles: ["Aucune"],
        type: "Champion Vétéran : Infanterie (Champion, Sergent) · Vétéran : Infanterie",
      },
    ],
    options: optionsEscouadeEtatMajorVeteran(
      "Champion Vétéran",
      ...quantiteDepuisListe(LISTES_EQUIPEMENT.speciales, {
        groupe: "lourde",
        parTranche: 5,
        remplace: "du bolter",
      }),
      ...quantiteDepuisListe(LISTES_EQUIPEMENT.lourdes, {
        groupe: "lourde",
        parTranche: 5,
        remplace: "du bolter",
      }),
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
    categorie: "Suites",
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
          {
            nom: "Élu à Réacteurs",
            profil: {
              M: 12,
              CC: 5,
              CT: 4,
              F: 4,
              E: 4,
              PV: 2,
              I: 4,
              A: 3,
              Cd: 8,
              Sf: 8,
              Vo: 7,
              Int: 7,
              Sv: "2+",
              Inv: "—",
            },
          },
          {
            nom: "Champion Élu à Réacteurs",
            profil: {
              M: 12,
              CC: 5,
              CT: 4,
              F: 4,
              E: 4,
              PV: 2,
              I: 4,
              A: 4,
              Cd: 8,
              Sf: 8,
              Vo: 7,
              Int: 7,
              Sv: "2+",
              Inv: "—",
            },
          },
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
    categorie: "Suites",
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
          {
            nom: "Élu",
            profil: {
              M: 7,
              CC: 5,
              CT: 4,
              F: 4,
              E: 4,
              PV: 2,
              I: 4,
              A: 3,
              Cd: 8,
              Sf: 8,
              Vo: 7,
              Int: 7,
              Sv: "2+",
              Inv: "—",
            },
          },
          {
            nom: "Champion Élu",
            profil: {
              M: 7,
              CC: 5,
              CT: 4,
              F: 4,
              E: 4,
              PV: 2,
              I: 4,
              A: 4,
              Cd: 8,
              Sf: 8,
              Vo: 7,
              Int: 7,
              Sv: "2+",
              Inv: "—",
            },
          },
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
    composition:
      "1 Sergent Terminator Cataphractii, 4 Terminators Cataphractii",
    effectif: { base: 5, max: 12, cout: 30 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "[Legiones Astartes]"],
    equipement: ["Chargeur volkite", "Arme énergétique"],
    variantes: [
      {
        nom: "Escouade Terminator Cataphractii",
        cout: 0,
        profils: [
          {
            nom: "Terminator Cataphractii",
            profil: {
              M: 6,
              CC: 4,
              CT: 4,
              F: 4,
              E: 5,
              PV: 2,
              I: 4,
              A: 2,
              Cd: 8,
              Sf: 8,
              Vo: 7,
              Int: 7,
              Sv: "2+",
              Inv: "4+",
            },
          },
          {
            nom: "Sergent Terminator Cataphractii",
            profil: {
              M: 6,
              CC: 4,
              CT: 4,
              F: 4,
              E: 5,
              PV: 2,
              I: 4,
              A: 3,
              Cd: 8,
              Sf: 8,
              Vo: 7,
              Int: 7,
              Sv: "2+",
              Inv: "4+",
            },
          },
        ],
        regles: [
          "Massif (2)",
          "Avance Implacable",
          "Lent et Méthodique",
          "Avant-garde (3)",
        ],
        type: "Sergent : Infanterie (Sergent, Lourd) · Terminator : Infanterie (Lourd)",
      },
    ],
    options: [
      {
        type: "quantite",
        id: "combi-bolters",
        libelle:
          "Figurines échangeant leur chargeur volkite contre un combi-bolter",
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
        libelle:
          "Figurines : griffe Lightning (à la place de l'arme énergétique)",
        cout: 5,
        parTranche: 1,
        groupe: "melee",
        ajoute: "Griffe Lightning",
      },
      {
        type: "quantite",
        id: "gantelets",
        libelle:
          "Figurines : gantelet énergétique (à la place de l'arme énergétique)",
        cout: 10,
        parTranche: 1,
        groupe: "melee",
        ajoute: "Gantelet énergétique",
      },
      {
        type: "quantite",
        id: "poings-t",
        libelle:
          "Figurines : poing tronçonneur (à la place de l'arme énergétique)",
        cout: 10,
        parTranche: 1,
        groupe: "melee",
        ajoute: "Poing tronçonneur",
      },
      {
        type: "quantite",
        id: "marteaux",
        libelle:
          "Figurines : marteau Thunder (à la place de l'arme énergétique)",
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
        libelle:
          "Terminators : lance-flammes lourd (1 par tranche de 5 figurines)",
        cout: 5,
        parTranche: 5,
        groupe: "lourde",
        ajoute: "Lance-flammes lourd (à la place du chargeur volkite)",
      },
      {
        type: "quantite",
        id: "autocanons-reaper",
        libelle:
          "Terminators : autocanon Reaper (1 par tranche de 5 figurines)",
        cout: 15,
        parTranche: 5,
        groupe: "lourde",
        ajoute: "Autocanon Reaper (à la place du chargeur volkite)",
      },
      {
        type: "quantite",
        id: "eclateurs",
        libelle:
          "Terminators : éclateur à plasma (1 par tranche de 5 figurines)",
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
          {
            nom: "Terminator Tartaros",
            profil: {
              M: 7,
              CC: 4,
              CT: 4,
              F: 4,
              E: 5,
              PV: 2,
              I: 4,
              A: 2,
              Cd: 8,
              Sf: 8,
              Vo: 7,
              Int: 7,
              Sv: "2+",
              Inv: "5+",
            },
          },
          {
            nom: "Sergent Terminator Tartaros",
            profil: {
              M: 7,
              CC: 4,
              CT: 4,
              F: 4,
              E: 5,
              PV: 2,
              I: 4,
              A: 3,
              Cd: 8,
              Sf: 8,
              Vo: 7,
              Int: 7,
              Sv: "2+",
              Inv: "5+",
            },
          },
        ],
        regles: ["Massif (2)", "Avance Implacable", "Avant-garde (3)"],
        type: "Sergent : Infanterie (Sergent) · Terminator : Infanterie",
      },
    ],
    options: [
      {
        type: "quantite",
        id: "chargeurs-volkites",
        libelle:
          "Figurines échangeant leur combi-bolter contre un chargeur volkite",
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
        libelle:
          "Figurines : griffe Lightning (à la place de l'arme énergétique)",
        cout: 5,
        parTranche: 1,
        groupe: "melee",
        ajoute: "Griffe Lightning",
      },
      {
        type: "quantite",
        id: "gantelets",
        libelle:
          "Figurines : gantelet énergétique (à la place de l'arme énergétique)",
        cout: 10,
        parTranche: 1,
        groupe: "melee",
        ajoute: "Gantelet énergétique",
      },
      {
        type: "quantite",
        id: "poings-t",
        libelle:
          "Figurines : poing tronçonneur (à la place de l'arme énergétique)",
        cout: 10,
        parTranche: 1,
        groupe: "melee",
        ajoute: "Poing tronçonneur",
      },
      {
        type: "quantite",
        id: "marteaux",
        libelle:
          "Figurines : marteau Thunder (à la place de l'arme énergétique)",
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
        libelle:
          "Terminators : lance-flammes lourd (1 par tranche de 5 figurines)",
        cout: 5,
        parTranche: 5,
        groupe: "lourde",
        ajoute: "Lance-flammes lourd (à la place du combi-bolter)",
      },
      {
        type: "quantite",
        id: "autocanons-reaper",
        libelle:
          "Terminators : autocanon Reaper (1 par tranche de 5 figurines)",
        cout: 15,
        parTranche: 5,
        groupe: "lourde",
        ajoute: "Autocanon Reaper (à la place du combi-bolter)",
      },
      {
        type: "quantite",
        id: "eclateurs",
        libelle:
          "Terminators : éclateur à plasma (1 par tranche de 5 figurines)",
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
          {
            nom: "Terminator Saturnine",
            profil: {
              M: 5,
              CC: 4,
              CT: 4,
              F: 4,
              E: 6,
              PV: 3,
              I: 3,
              A: 2,
              Cd: 8,
              Sf: 8,
              Vo: 7,
              Int: 7,
              Sv: "2+",
              Inv: "4+",
            },
          },
          {
            nom: "Sergent Terminator Saturnine",
            profil: {
              M: 5,
              CC: 4,
              CT: 4,
              F: 4,
              E: 6,
              PV: 3,
              I: 3,
              A: 2,
              Cd: 8,
              Sf: 8,
              Vo: 7,
              Int: 7,
              Sv: "2+",
              Inv: "4+",
            },
          },
        ],
        regles: [
          "Massif (4)",
          "Explose (6+)",
          "Avance Implacable",
          "Lent et Méthodique",
        ],
        type: "Sergent : Infanterie (Sergent, Lourd) · Terminator : Infanterie (Lourd)",
      },
    ],
    options: [
      {
        type: "quantite",
        id: "bombardes-poing",
        libelle:
          "Figurines : bombarde à plasma à la place du poing disrupteur (gratuit)",
        cout: 0,
        parTranche: 1,
        groupe: "poing",
        ajoute: "Bombarde à plasma (à la place du poing disrupteur)",
      },
      {
        type: "quantite",
        id: "desintegrateurs-poing",
        libelle:
          "Figurines : désintégrateur lourd jumelé à la place du poing disrupteur",
        cout: 10,
        parTranche: 1,
        groupe: "poing",
        ajoute: "Désintégrateur lourd jumelé (à la place du poing disrupteur)",
      },
      {
        type: "quantite",
        id: "desintegrateurs-bombarde",
        libelle:
          "Figurines : désintégrateur lourd jumelé à la place de la bombarde à plasma",
        cout: 10,
        parTranche: 1,
        ajoute:
          "Désintégrateur lourd jumelé (à la place de la bombarde à plasma)",
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
     UNITÉ RÉSERVÉE À LA Ve LÉGION (WHITE SCARS)
     Voir la note sur Qin Xa, catégorie Quartier Général.
     ---------------------------------------------------------- */
  {
    id: "keshig-ebene",
    nom: "Keshig d'Ébène",
    categorie: "Assaut Lourd",
    cout: 200,
    composition: "5 Kharash",
    effectif: { base: 5, max: 10, cout: 35 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "White Scars"],
    notes:
      "Affectation rituelle offrant une chance de rédemption aux White Scars déshonorés : les Kharash sont déployés en première ligne lors des sièges et autres conflits à haute intensité.",
    equipement: ["Vouge énergétique"],
    variantes: [
      {
        nom: "Keshig d'Ébène",
        cout: 0,
        profil: {
          M: 7,
          CC: 4,
          CT: 4,
          F: 4,
          E: 5,
          PV: 2,
          I: 4,
          A: 3,
          Cd: 10,
          Sf: 9,
          Vo: 9,
          Int: 8,
          Sv: "2+",
          Inv: "5+",
        },
        regles: [
          "Massif (2)",
          "Avant-garde (3)",
          "Insensible à la Douleur (6+)",
          "Sacrifiable (2)",
        ],
        type: "Infanterie",
      },
    ],
    options: [],
    legion: "V",
  },

  /* ----------------------------------------------------------
     UNITÉ RÉSERVÉE À LA IXe LÉGION (BLOOD ANGELS)
     Voir la note sur Raldoron, catégorie Quartier Général.
     ---------------------------------------------------------- */
  {
    id: "larmes-de-lange",
    nom: "Les Larmes de l'Ange",
    categorie: "Assaut Lourd",
    cout: 150,
    composition: "1 Archi-Erelim, 4 Erelim",
    effectif: { base: 5, max: 10, cout: 20 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "Blood Angels"],
    notes:
      "Les Larmes de l'Ange, Masques d'Argent et Mains de la Justice, jouent chez les Blood Angels le rôle des Destructeurs des autres Légions : ils se rendent au combat sous le commandement direct de Sanguinius.",
    equipement: [
      "Deux serpentines volkites",
      "Grenades Rad",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Les Larmes de l'Ange",
        cout: 0,
        profils: [
          {
            nom: "Erelim",
            profil: {
              M: 12,
              CC: 4,
              CT: 4,
              F: 4,
              E: 4,
              PV: 1,
              I: 4,
              A: 2,
              Cd: 7,
              Sf: 7,
              Vo: 7,
              Int: 7,
              Sv: "3+",
              Inv: "—",
            },
          },
          {
            nom: "Archi-Erelim",
            profil: {
              M: 12,
              CC: 4,
              CT: 4,
              F: 4,
              E: 4,
              PV: 1,
              I: 4,
              A: 2,
              Cd: 8,
              Sf: 7,
              Vo: 7,
              Int: 7,
              Sv: "3+",
              Inv: "—",
            },
          },
        ],
        regles: [
          "Frappe en Profondeur",
          "Massif (2)",
          "Avant-garde (3)",
          "Âpre Devoir",
          "Orage de Feu",
        ],
        type: "Archi-Erelim : Infanterie (Sergent, Antigrav) · Erelim : Infanterie (Antigrav)",
      },
    ],
    options: [
      {
        type: "quantite",
        id: "lance-grenades",
        libelle:
          "Figurines : lance-grenades Erelim à la place des deux serpentines volkites",
        cout: 10,
        parTranche: 1,
        ajoute:
          "Lance-grenades Erelim (à la place des deux serpentines volkites)",
      },
    ],
    legion: "IX",
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
          {
            nom: "Légionnaire",
            profil: {
              M: 7,
              CC: 4,
              CT: 4,
              F: 4,
              E: 4,
              PV: 1,
              I: 4,
              A: 1,
              Cd: 7,
              Sf: 7,
              Vo: 7,
              Int: 7,
              Sv: "3+",
              Inv: "—",
            },
          },
          {
            nom: "Sergent",
            profil: {
              M: 7,
              CC: 4,
              CT: 4,
              F: 4,
              E: 4,
              PV: 1,
              I: 4,
              A: 1,
              Cd: 8,
              Sf: 7,
              Vo: 7,
              Int: 7,
              Sv: "3+",
              Inv: "—",
            },
          },
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
          ...depuisListes(
            LISTES_EQUIPEMENT.meleeSergent,
            LISTES_EQUIPEMENT.combinees,
          ),
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
          ...depuisListes(
            LISTES_EQUIPEMENT.meleeSergent,
            LISTES_EQUIPEMENT.pistolets,
          ),
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
        libelle:
          "Équipement de Légion (1er Légionnaire, deux max dans l'unité)",
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
    equipement: [
      "Pistolet bolter",
      "Épée tronçonneuse",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Escouade Nettoyeuse",
        cout: 0,
        profils: [
          {
            nom: "Légionnaire Nettoyeur",
            profil: {
              M: 7,
              CC: 4,
              CT: 4,
              F: 4,
              E: 4,
              PV: 1,
              I: 4,
              A: 2,
              Cd: 7,
              Sf: 7,
              Vo: 7,
              Int: 7,
              Sv: "3+",
              Inv: "—",
            },
          },
          {
            nom: "Sergent Nettoyeur",
            profil: {
              M: 7,
              CC: 4,
              CT: 4,
              F: 4,
              E: 4,
              PV: 1,
              I: 4,
              A: 2,
              Cd: 8,
              Sf: 7,
              Vo: 7,
              Int: 7,
              Sv: "3+",
              Inv: "—",
            },
          },
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
          ...depuisListes(
            LISTES_EQUIPEMENT.meleeSergent,
            LISTES_EQUIPEMENT.pistolets,
          ),
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
        libelle:
          "Légionnaires : épée tronçonneuse lourde (1 par tranche de 5 figurines)",
        cout: 5,
        parTranche: 5,
        groupe: "epee",
        ajoute: "Épée tronçonneuse lourde (Légionnaire)",
      },
      {
        type: "quantite",
        id: "armes-energetiques",
        libelle:
          "Légionnaires : arme énergétique (1 par tranche de 5 figurines)",
        cout: 10,
        parTranche: 5,
        groupe: "epee",
        ajoute: "Arme énergétique (Légionnaire)",
      },
      {
        type: "quantite",
        id: "sabres",
        libelle:
          "Légionnaires : sabre charnabal (1 par tranche de 5 figurines)",
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
        libelle:
          "Équipement de Légion (1er Légionnaire, deux max dans l'unité)",
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
    equipement: [
      "Pistolet bolter",
      "Épée tronçonneuse",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Escouade d'Assaut",
        cout: 0,
        profils: [
          {
            nom: "Légionnaire d'Assaut",
            profil: {
              M: 12,
              CC: 4,
              CT: 4,
              F: 4,
              E: 4,
              PV: 1,
              I: 4,
              A: 2,
              Cd: 7,
              Sf: 7,
              Vo: 7,
              Int: 7,
              Sv: "3+",
              Inv: "—",
            },
          },
          {
            nom: "Sergent d'Assaut",
            profil: {
              M: 12,
              CC: 4,
              CT: 4,
              F: 4,
              E: 4,
              PV: 1,
              I: 4,
              A: 2,
              Cd: 8,
              Sf: 7,
              Vo: 7,
              Int: 7,
              Sv: "3+",
              Inv: "—",
            },
          },
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
          ...depuisListes(
            LISTES_EQUIPEMENT.meleeSergent,
            LISTES_EQUIPEMENT.pistolets,
          ),
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
        libelle:
          "Légionnaires : arme énergétique (1 par tranche de 5 figurines)",
        cout: 10,
        parTranche: 5,
        groupe: "melee",
        ajoute: "Arme énergétique (Légionnaire)",
      },
      {
        type: "quantite",
        id: "sabres",
        libelle:
          "Légionnaires : sabre charnabal (1 par tranche de 5 figurines)",
        cout: 5,
        parTranche: 5,
        groupe: "melee",
        ajoute: "Sabre charnabal (Légionnaire)",
      },
      {
        type: "quantite",
        id: "epees-lourdes",
        libelle:
          "Légionnaires : épée tronçonneuse lourde (1 par tranche de 5 figurines)",
        cout: 5,
        parTranche: 5,
        groupe: "melee",
        ajoute: "Épée tronçonneuse lourde (Légionnaire)",
      },
      {
        type: "quantite",
        id: "haches-lourdes",
        libelle:
          "Légionnaires : hache tronçonneuse lourde (2 par tranche de 5 figurines)",
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
        libelle:
          "Toute l'unité : haches tronçonneuses au lieu des épées tronçonneuses",
        cout: 0,
        ajoute: "Haches tronçonneuses (toute l'unité, remplacent les épées)",
      },
      {
        type: "case",
        id: "boucliers",
        libelle:
          "Toute l'unité : boucliers de combat au lieu des pistolets bolters",
        cout: 2,
        parFigurine: true,
        ajoute:
          "Boucliers de combat (toute l'unité, remplacent les pistolets bolters)",
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
          {
            nom: "Légionnaire Brécheur",
            profil: {
              M: 7,
              CC: 4,
              CT: 4,
              F: 4,
              E: 4,
              PV: 1,
              I: 4,
              A: 1,
              Cd: 7,
              Sf: 7,
              Vo: 7,
              Int: 7,
              Sv: "3+",
              Inv: "5+",
            },
          },
          {
            nom: "Sergent Brécheur",
            profil: {
              M: 7,
              CC: 4,
              CT: 4,
              F: 4,
              E: 4,
              PV: 1,
              I: 4,
              A: 1,
              Cd: 8,
              Sf: 7,
              Vo: 7,
              Int: 7,
              Sv: "3+",
              Inv: "5+",
            },
          },
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
          ...depuisListes(
            LISTES_EQUIPEMENT.meleeSergent,
            LISTES_EQUIPEMENT.combinees,
          ),
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
        libelle:
          "Légionnaires : fusil à gravitons (1 par tranche de 5 figurines)",
        cout: 10,
        parTranche: 5,
        groupe: "bolter",
        ajoute: "Fusil à gravitons (Légionnaire)",
      },
      {
        type: "quantite",
        id: "decoupeurs-laser",
        libelle:
          "Légionnaires : découpeur laser (1 par tranche de 5 figurines)",
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
        libelle:
          "Équipement de Légion (1er Légionnaire, deux max dans l'unité)",
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
     UNITÉS — APPUI
     ---------------------------------------------------------- */
  {
    id: "araknae",
    nom: "Plate-forme d'Accélérateur Quadritube Araknae",
    categorie: "Appui",
    cout: 125,
    composition: "1 Plate-forme d'Accélérateur Quadritube Araknae",
    traits: ["[Allégeance]", "[Legiones Astartes]"],
    equipement: [
      "Autocanon accélérateur quadritube de Tourelle",
      "Pavois atomantique",
    ],
    variantes: [
      {
        nom: "Plate-forme d'Accélérateur Quadritube Araknae",
        cout: 0,
        profilVehicule: {
          M: "—",
          CT: 4,
          avant: 12,
          flanc: 12,
          arriere: 12,
          PC: 5,
          transport: "—",
        },
        regles: ["Emplacement d'Arme", "Explose (4+)"],
        type: "Véhicule",
      },
    ],
    options: [],
  },

  {
    id: "module-largage-deathstorm",
    nom: "Module de Largage Deathstorm",
    categorie: "Appui",
    cout: 90,
    composition: "1 Module de Largage Deathstorm",
    traits: ["[Allégeance]", "[Legiones Astartes]"],
    equipement: ["Lance-missiles Deathstorm de Tourelle"],
    variantes: [
      {
        nom: "Module de Largage Deathstorm",
        cout: 0,
        profilVehicule: {
          M: "—",
          CT: 2,
          avant: 12,
          flanc: 12,
          arriere: 12,
          PC: 4,
          transport: "—",
        },
        regles: [
          "Ouverture à l'Impact",
          "Véhicule d'Assaut Orbital",
          "Déluge de Mort",
        ],
        type: "Véhicule",
      },
    ],
    options: [],
  },

  {
    id: "techmarine",
    nom: "Techmarine",
    categorie: "Appui",
    cout: 50,
    composition: "1 Techmarine",
    traits: ["[Allégeance]", "[Legiones Astartes]"],
    equipement: [
      "Pistolet bolter",
      "Hache énergétique",
      "Servobras",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Techmarine",
        cout: 0,
        profil: {
          M: 7,
          CC: 4,
          CT: 4,
          F: 4,
          E: 4,
          PV: 2,
          I: 4,
          A: 2,
          Cd: 7,
          Sf: 7,
          Vo: 7,
          Int: 8,
          Sv: "2+",
          Inv: "—",
        },
        regles: ["Guerrier-artisan (2)"],
        type: "Infanterie (Spécialiste)",
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
      {
        type: "case",
        id: "cyber-familier",
        libelle: "Cyber-familier",
        cout: 10,
        ajoute: "Cyber-familier",
      },
    ],
  },

  {
    id: "apothicaire",
    nom: "Apothicaire",
    categorie: "Appui",
    cout: 30,
    composition: "1 Apothicaire",
    traits: ["[Allégeance]", "[Legiones Astartes]"],
    equipement: [
      "Pistolet bolter",
      "Épée tronçonneuse",
      "Narthecium",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Apothicaire",
        cout: 0,
        profil: {
          M: 7,
          CC: 4,
          CT: 4,
          F: 4,
          E: 4,
          PV: 2,
          I: 4,
          A: 2,
          Cd: 7,
          Sf: 7,
          Vo: 7,
          Int: 8,
          Sv: "3+",
          Inv: "—",
        },
        regles: ["Médic (4+)"],
        type: "Infanterie (Spécialiste)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "epee",
        libelle: "Remplacer l'épée tronçonneuse",
        remplace: "Épée tronçonneuse",
        choix: [
          { nom: "— Conserver l'épée tronçonneuse —", cout: 0 },
          ...depuisListes(LISTES_EQUIPEMENT.meleeSergent),
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
    ],
  },

  {
    id: "batterie-rapier",
    nom: "Batterie de Rapier",
    categorie: "Appui",
    cout: 40,
    composition: "1 Équipage de Rapier (2 Légionnaires, 1 Châssis Rapier)",
    effectif: {
      base: 1,
      max: 4,
      cout: 40,
      libelle:
        "Nombre d'Équipages de Rapier (+40 pts par Équipage au-delà de 1)",
      suffixe: "équipages de Rapier",
    },
    equipementLibelle: "Équipement (par Équipage de Rapier)",
    traits: ["[Allégeance]", "[Legiones Astartes]"],
    equipement: [
      "Légionnaire : Bolter",
      "Légionnaire : Pistolet bolter",
      "Légionnaire : Grenades Frag",
      "Légionnaire : Grenades Krak",
      "Châssis Rapier : Batterie de bolters lourds Gravis",
    ],
    variantes: [
      {
        nom: "Batterie de Rapier",
        cout: 0,
        profils: [
          {
            nom: "Légionnaire",
            profil: {
              M: 7,
              CC: 4,
              CT: 4,
              F: 4,
              E: 4,
              PV: 1,
              I: 4,
              A: 1,
              Cd: 7,
              Sf: 8,
              Vo: 7,
              Int: 7,
              Sv: "3+",
              Inv: "—",
            },
          },
          {
            nom: "Châssis Rapier",
            profil: {
              M: 7,
              CC: 1,
              CT: 4,
              F: 4,
              E: 6,
              PV: 2,
              I: 2,
              A: 1,
              Cd: 1,
              Sf: 1,
              Vo: 1,
              Int: 1,
              Sv: "3+",
              Inv: "—",
            },
          },
        ],
        regles: [
          "Équipage de Rapier",
          "Massif (3) (Châssis Rapier seulement)",
          "Lent et Méthodique",
          "Unité d'Appui (1)",
        ],
        type: "Légionnaire : Infanterie (Sergent) · Châssis Rapier : Infanterie",
      },
    ],
    options: [
      {
        type: "quantite",
        id: "destructeur-laser",
        libelle:
          "Châssis Rapier : destructeur laser (à la place de la batterie de bolters lourds Gravis)",
        cout: 25,
        parTranche: 1,
        groupe: "arme-rapier",
        ajoute:
          "Destructeur laser (à la place de la batterie de bolters lourds Gravis)",
      },
      {
        type: "quantite",
        id: "canon-gravitons",
        libelle:
          "Châssis Rapier : canon à gravitons (à la place de la batterie de bolters lourds Gravis)",
        cout: 20,
        parTranche: 1,
        groupe: "arme-rapier",
        ajoute:
          "Canon à gravitons (à la place de la batterie de bolters lourds Gravis)",
      },
      {
        type: "quantite",
        id: "lanceur-quadruple",
        libelle:
          "Châssis Rapier : lanceur quadruple (à la place de la batterie de bolters lourds Gravis)",
        cout: 20,
        parTranche: 1,
        groupe: "arme-rapier",
        ajoute:
          "Lanceur quadruple (à la place de la batterie de bolters lourds Gravis)",
      },
      {
        type: "quantite",
        id: "phosphex",
        libelle:
          "Châssis Rapier avec lanceur quadruple : cartouches à phosphex (nécessite un Briseur de Siège du même Trait de Faction dans l'Armée)",
        cout: 15,
        parTranche: 1,
        requiertEquip: "Lanceur quadruple",
        ajoute: "Cartouches à phosphex",
      },
    ],
  },

  {
    id: "escouade-soutien",
    nom: "Escouade de Soutien",
    categorie: "Appui",
    cout: 50,
    composition: "1 Sergent, 4 Légionnaires",
    effectif: { base: 5, max: 10, cout: 10 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "[Legiones Astartes]"],
    equipement: ["Pistolet bolter", "Grenades Frag", "Grenades Krak"],
    variantes: [
      {
        nom: "Escouade de Soutien",
        cout: 0,
        profils: [
          {
            nom: "Légionnaire",
            profil: {
              M: 7,
              CC: 4,
              CT: 4,
              F: 4,
              E: 4,
              PV: 1,
              I: 4,
              A: 1,
              Cd: 7,
              Sf: 7,
              Vo: 7,
              Int: 7,
              Sv: "3+",
              Inv: "—",
            },
          },
          {
            nom: "Sergent",
            profil: {
              M: 7,
              CC: 4,
              CT: 4,
              F: 4,
              E: 4,
              PV: 1,
              I: 4,
              A: 1,
              Cd: 8,
              Sf: 7,
              Vo: 7,
              Int: 7,
              Sv: "3+",
              Inv: "—",
            },
          },
        ],
        regles: ["Unité d'Appui (1)"],
        type: "Sergent : Infanterie (Sergent) · Légionnaire : Infanterie",
      },
    ],
    options: [
      {
        type: "choix",
        id: "arme-lourde",
        libelle:
          "Toute l'unité : objet de la liste des Armes Lourdes de Légion (même objet pour toutes les Figurines)",
        ajoute: true,
        obligatoire: true,
        parFigurine: true,
        choix: [...depuisListes(LISTES_EQUIPEMENT.lourdes)],
      },
      {
        type: "choix",
        id: "sergent-melee",
        libelle:
          "Sergent : objet de la liste des Armes de Mêlée de Sergent de Légion",
        ajoute: true,
        prefixeFiche: "Sergent : ",
        choix: [
          { nom: "— Aucun —", cout: 0 },
          ...depuisListes(LISTES_EQUIPEMENT.meleeSergent),
        ],
      },
      {
        type: "case",
        id: "vexillum",
        libelle: "Un Légionnaire : vexillum",
        cout: 10,
        ajoute: "Un Légionnaire : vexillum",
      },
      {
        type: "choix",
        id: "equipement-legion-1",
        libelle:
          "Équipement de Légion (1er Légionnaire, deux max dans l'unité)",
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
    id: "escouade-appui-tactique",
    nom: "Escouade d'Appui Tactique",
    categorie: "Appui",
    cout: 40,
    composition: "1 Sergent, 4 Légionnaires",
    effectif: { base: 5, max: 10, cout: 8 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "[Legiones Astartes]"],
    equipement: ["Pistolet bolter", "Grenades Frag", "Grenades Krak"],
    variantes: [
      {
        nom: "Escouade d'Appui Tactique",
        cout: 0,
        profils: [
          {
            nom: "Légionnaire",
            profil: {
              M: 7,
              CC: 4,
              CT: 4,
              F: 4,
              E: 4,
              PV: 1,
              I: 4,
              A: 1,
              Cd: 7,
              Sf: 7,
              Vo: 7,
              Int: 7,
              Sv: "3+",
              Inv: "—",
            },
          },
          {
            nom: "Sergent",
            profil: {
              M: 7,
              CC: 4,
              CT: 4,
              F: 4,
              E: 4,
              PV: 1,
              I: 4,
              A: 1,
              Cd: 8,
              Sf: 7,
              Vo: 7,
              Int: 7,
              Sv: "3+",
              Inv: "—",
            },
          },
        ],
        regles: ["Aucune"],
        type: "Sergent : Infanterie (Sergent) · Légionnaire : Infanterie",
      },
    ],
    options: [
      {
        type: "choix",
        id: "arme-speciale",
        libelle:
          "Toute l'unité : objet de la liste des Armes Spéciales de Légion (même objet pour toutes les Figurines)",
        ajoute: true,
        obligatoire: true,
        parFigurine: true,
        choix: [...depuisListes(LISTES_EQUIPEMENT.speciales)],
      },
      {
        type: "choix",
        id: "sergent-melee",
        libelle:
          "Sergent : objet de la liste des Armes de Mêlée de Sergent de Légion",
        ajoute: true,
        prefixeFiche: "Sergent : ",
        choix: [
          { nom: "— Aucun —", cout: 0 },
          ...depuisListes(LISTES_EQUIPEMENT.meleeSergent),
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
        ajoute: "Un Légionnaire : vexillum",
      },
      {
        type: "choix",
        id: "equipement-legion-1",
        libelle:
          "Équipement de Légion (1er Légionnaire, deux max dans l'unité)",
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
     UNITÉ RÉSERVÉE À LA Ve LÉGION (WHITE SCARS)
     Voir la note sur Qin Xa, catégorie Quartier Général.
     ---------------------------------------------------------- */
  {
    id: "speeder-kyzagan",
    nom: "Speeder d'Assaut Kyzagan",
    categorie: "Appui",
    cout: 105,
    composition: "1 Kyzagan",
    notes:
      "Plate-forme d'armes lourdes rapide adaptée de la plate-forme Javelin, conservant une puissance de feu similaire aux Predator ou aux Sicaran.",
    traits: ["[Allégeance]", "White Scars"],
    equipement: ["Canon d'assaut Kheres", "Deux autocanons Reaper"],
    variantes: [
      {
        nom: "Kyzagan",
        cout: 0,
        profil: {
          M: 14,
          CC: 4,
          CT: 4,
          F: 4,
          E: 7,
          PV: 4,
          I: 4,
          A: 2,
          Cd: 8,
          Sf: 8,
          Vo: 7,
          Int: 7,
          Sv: "3+",
          Inv: "—",
        },
        regles: ["Massif (5)", "Frappe en Profondeur", "Protocoles de Tir (3)"],
        type: "Cavalerie (Antigrav)",
      },
    ],
    options: [
      {
        type: "quantite",
        id: "missiles-traqueurs",
        libelle: "Missiles traqueurs",
        cout: 5,
        max: 2,
        ajoute: "Missile traqueur",
      },
    ],
    legion: "V",
  },

  /* ----------------------------------------------------------
     UNITÉS — ELITE
     ---------------------------------------------------------- */
  {
    id: "escouade-traqueuse",
    nom: "Escouade Traqueuse",
    categorie: "Elite",
    cout: 105,
    composition: "1 Sergent Traqueur, 4 Traqueurs",
    effectif: { base: 5, max: 10, cout: 18 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "[Legiones Astartes]"],
    equipement: [
      "Bolter Kraken",
      "Pistolet bolter",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Escouade Traqueuse",
        cout: 0,
        profils: [
          {
            nom: "Traqueur",
            profil: {
              M: 7,
              CC: 4,
              CT: 5,
              F: 4,
              E: 4,
              PV: 1,
              I: 4,
              A: 1,
              Cd: 7,
              Sf: 8,
              Vo: 7,
              Int: 7,
              Sv: "3+",
              Inv: "—",
            },
          },
          {
            nom: "Sergent Traqueur",
            profil: {
              M: 7,
              CC: 4,
              CT: 5,
              F: 4,
              E: 4,
              PV: 1,
              I: 4,
              A: 1,
              Cd: 8,
              Sf: 8,
              Vo: 7,
              Int: 7,
              Sv: "3+",
              Inv: "—",
            },
          },
        ],
        regles: ["Infiltration (9)"],
        type: "Sergent Traqueur : Infanterie (Sergent, Tirailleurs) · Traqueur : Infanterie (Tirailleurs)",
      },
    ],
    options: [
      ...quantiteDepuisListe(LISTES_EQUIPEMENT.combinees, {
        groupe: "tir",
        remplace: "du bolter Kraken",
      }),
      {
        type: "choix",
        id: "sergent-bolter",
        libelle: "Sergent Traqueur : remplacer son bolter Kraken",
        ajoute: true,
        prefixeFiche: "Sergent Traqueur : ",
        choix: [
          { nom: "— Aucun échange —", cout: 0 },
          ...depuisListes(LISTES_EQUIPEMENT.meleeSergent),
        ],
      },
      {
        type: "choix",
        id: "sergent-pistolet-melee",
        libelle:
          "Sergent Traqueur : remplacer son pistolet bolter (Armes de Mêlée de Sergent de Légion)",
        ajoute: true,
        prefixeFiche: "Sergent Traqueur : ",
        choix: [
          { nom: "— Aucun échange —", cout: 0 },
          ...depuisListes(LISTES_EQUIPEMENT.meleeSergent),
        ],
      },
      {
        type: "choix",
        id: "sergent-pistolet",
        libelle: "Sergent Traqueur : remplacer son pistolet bolter",
        ajoute: true,
        prefixeFiche: "Sergent Traqueur : ",
        choix: [
          { nom: "— Aucun échange —", cout: 0 },
          { nom: "Pistolet désintégrateur", cout: 5 },
          ...depuisListes(LISTES_EQUIPEMENT.pistolets),
        ],
      },
      {
        type: "choix",
        id: "baionnette",
        libelle: "Baïonnette (uniquement si la Figurine a un bolter Kraken)",
        requiertEquip: "Bolter Kraken",
        ajoute: true,
        choix: [
          { nom: "Aucune", cout: 0 },
          { nom: "Baïonnette", cout: 1 },
          { nom: "Baïonnette tronçonneuse", cout: 2 },
        ],
      },
      {
        type: "case",
        id: "sergent-bombes",
        libelle: "Sergent Traqueur : bombes à fusion",
        cout: 10,
        ajoute: "Sergent Traqueur : bombes à fusion",
      },
      {
        type: "choix",
        id: "equipement-legion-1",
        libelle: "Équipement de Légion (1er Traqueur, deux max dans l'unité)",
        ajoute: true,
        prefixeFiche: "Traqueur : ",
        choix: [
          { nom: "— Aucun —", cout: 0 },
          { nom: "Nuncio-vox", cout: 10 },
          { nom: "Scanner augure", cout: 10 },
        ],
      },
      {
        type: "choix",
        id: "equipement-legion-2",
        libelle: "Équipement de Légion (2e Traqueur)",
        ajoute: true,
        prefixeFiche: "Traqueur : ",
        choix: [
          { nom: "— Aucun —", cout: 0 },
          { nom: "Nuncio-vox", cout: 10 },
          { nom: "Scanner augure", cout: 10 },
        ],
      },
    ],
  },

  {
    id: "escouade-veterans-assaut",
    nom: "Escouade de Vétérans d'Assaut",
    categorie: "Elite",
    cout: 120,
    composition: "1 Sergent Vétéran d'Assaut, 4 Vétérans d'Assaut",
    effectif: { base: 5, max: 10, cout: 22 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "[Legiones Astartes]"],
    equipement: [
      "Pistolet bolter",
      "Épée tronçonneuse",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Escouade de Vétérans d'Assaut",
        cout: 0,
        profils: [
          {
            nom: "Vétéran d'Assaut",
            profil: {
              M: 12,
              CC: 5,
              CT: 4,
              F: 4,
              E: 4,
              PV: 2,
              I: 4,
              A: 3,
              Cd: 8,
              Sf: 8,
              Vo: 7,
              Int: 7,
              Sv: "3+",
              Inv: "—",
            },
          },
          {
            nom: "Sergent Vétéran d'Assaut",
            profil: {
              M: 12,
              CC: 5,
              CT: 4,
              F: 4,
              E: 4,
              PV: 2,
              I: 4,
              A: 3,
              Cd: 8,
              Sf: 8,
              Vo: 7,
              Int: 7,
              Sv: "3+",
              Inv: "—",
            },
          },
        ],
        regles: ["Massif (2)", "Frappe en Profondeur", "Avant-garde (3)"],
        type: "Sergent Vétéran d'Assaut : Infanterie (Sergent, Antigrav) · Vétéran d'Assaut : Infanterie (Antigrav)",
      },
    ],
    options: [
      ...quantiteDepuisListe(LISTES_EQUIPEMENT.meleeSergent, {
        groupe: "melee",
        remplace: "de l'épée tronçonneuse",
      }),
      {
        type: "quantite",
        id: "bouclier-combat",
        libelle:
          "Figurines : bouclier de combat (à la place du pistolet bolter)",
        cout: 2,
        parTranche: 1,
        groupe: "pistolet",
        ajoute: "Bouclier de combat (à la place du pistolet bolter)",
      },
      ...quantiteDepuisListe(LISTES_EQUIPEMENT.pistolets, {
        groupe: "pistolet",
        remplace: "du pistolet bolter",
      }),
      {
        type: "case",
        id: "sergent-pistolet-desintegrateur",
        libelle: "Sergent Vétéran d'Assaut : pistolet désintégrateur",
        cout: 5,
        ajoute: "Sergent Vétéran d'Assaut : pistolet désintégrateur",
      },
      {
        type: "case",
        id: "sergent-bombes",
        libelle: "Sergent Vétéran d'Assaut : bombes à fusion",
        cout: 10,
        ajoute: "Sergent Vétéran d'Assaut : bombes à fusion",
      },
      {
        type: "quantite",
        id: "pistolets-desintegrateurs-tranche",
        libelle:
          "Vétérans d'Assaut : pistolet désintégrateur (1 par tranche de 5 figurines)",
        cout: 5,
        parTranche: 5,
        ajoute: "Pistolet désintégrateur (à la place du pistolet bolter)",
      },
      {
        type: "quantite",
        id: "paires-griffes",
        libelle:
          "Figurines : paire de griffes Lightning (remplace pistolet bolter ET épée tronçonneuse)",
        cout: 10,
        parTranche: 1,
        ajoute: "Paire de griffes Lightning",
      },
      {
        type: "quantite",
        id: "haches-lourdes",
        libelle:
          "Vétérans d'Assaut : hache tronçonneuse lourde (2 par tranche de 5 figurines)",
        cout: 5,
        parTranche: 5,
        parTrancheMax: 2,
        groupe: "epee-lourde",
        ajoute: "Hache tronçonneuse lourde (à la place de l'épée tronçonneuse)",
      },
      {
        type: "quantite",
        id: "epees-lourdes",
        libelle:
          "Vétérans d'Assaut : épée tronçonneuse lourde (2 par tranche de 5 figurines)",
        cout: 5,
        parTranche: 5,
        parTrancheMax: 2,
        groupe: "epee-lourde",
        ajoute: "Épée tronçonneuse lourde (à la place de l'épée tronçonneuse)",
      },
    ],
  },

  {
    id: "escouade-veterans-tactiques",
    nom: "Escouade de Vétérans Tactiques",
    categorie: "Elite",
    cout: 85,
    composition: "1 Sergent Vétéran, 4 Vétérans",
    effectif: { base: 5, max: 10, cout: 15 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "[Legiones Astartes]"],
    equipement: ["Bolter", "Pistolet bolter", "Grenades Frag", "Grenades Krak"],
    variantes: [
      {
        nom: "Escouade de Vétérans Tactiques",
        cout: 0,
        profils: [
          {
            nom: "Vétéran",
            profil: {
              M: 7,
              CC: 4,
              CT: 5,
              F: 4,
              E: 4,
              PV: 2,
              I: 4,
              A: 2,
              Cd: 8,
              Sf: 8,
              Vo: 7,
              Int: 7,
              Sv: "3+",
              Inv: "—",
            },
          },
          {
            nom: "Sergent Vétéran",
            profil: {
              M: 7,
              CC: 4,
              CT: 5,
              F: 4,
              E: 4,
              PV: 2,
              I: 4,
              A: 2,
              Cd: 8,
              Sf: 8,
              Vo: 7,
              Int: 7,
              Sv: "3+",
              Inv: "—",
            },
          },
        ],
        regles: ["Ligne (1)"],
        type: "Sergent Vétéran : Infanterie (Sergent) · Vétéran : Infanterie",
      },
    ],
    options: [
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
      ...quantiteDepuisListe(LISTES_EQUIPEMENT.combinees, {
        groupe: "tir",
        remplace: "du bolter",
      }),
      ...quantiteDepuisListe(LISTES_EQUIPEMENT.speciales, {
        groupe: "lourde",
        parTranche: 5,
        remplace: "du bolter",
      }),
      ...quantiteDepuisListe(LISTES_EQUIPEMENT.lourdes, {
        groupe: "lourde",
        parTranche: 5,
        remplace: "du bolter",
      }),
      {
        type: "quantite",
        id: "eclateur-desintegrateur",
        libelle:
          "Vétérans : éclateur désintégrateur (1 par tranche de 5 figurines)",
        cout: 10,
        parTranche: 5,
        groupe: "lourde",
        ajoute: "Éclateur désintégrateur (à la place du bolter)",
      },
      {
        type: "quantite",
        id: "desintegrateur-lourd",
        libelle:
          "Vétérans : désintégrateur lourd (1 par tranche de 5 figurines)",
        cout: 15,
        parTranche: 5,
        groupe: "lourde",
        ajoute: "Désintégrateur lourd (à la place du bolter)",
      },
      {
        type: "choix",
        id: "sergent-bolter",
        libelle: "Sergent Vétéran : remplacer son bolter",
        ajoute: true,
        prefixeFiche: "Sergent Vétéran : ",
        choix: [
          { nom: "— Aucun échange —", cout: 0 },
          ...depuisListes(LISTES_EQUIPEMENT.meleeSergent),
        ],
      },
      {
        type: "choix",
        id: "sergent-pistolet-melee",
        libelle:
          "Sergent Vétéran : remplacer son pistolet bolter (Armes de Mêlée de Sergent de Légion)",
        ajoute: true,
        prefixeFiche: "Sergent Vétéran : ",
        choix: [
          { nom: "— Aucun échange —", cout: 0 },
          ...depuisListes(LISTES_EQUIPEMENT.meleeSergent),
        ],
      },
      {
        type: "choix",
        id: "sergent-pistolet",
        libelle: "Sergent Vétéran : remplacer son pistolet bolter",
        ajoute: true,
        prefixeFiche: "Sergent Vétéran : ",
        choix: [
          { nom: "— Aucun échange —", cout: 0 },
          { nom: "Pistolet désintégrateur", cout: 5 },
          ...depuisListes(LISTES_EQUIPEMENT.pistolets),
        ],
      },
      {
        type: "case",
        id: "vexillum",
        libelle: "Un Vétéran : vexillum",
        cout: 10,
        ajoute: "Un Vétéran : vexillum",
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
      optionBaionnette(),
    ],
  },

  /* ----------------------------------------------------------
     UNITÉS RÉSERVÉES À LA XIXe LÉGION (RAVEN GUARD)
     `legion: "XIX"` : voir la note sur Kaedes Nex, catégorie
     État-major ci-dessus.
     ---------------------------------------------------------- */
  {
    id: "escouade-mor-deythan",
    nom: "Escouade de Mor Deythan",
    categorie: "Elite",
    cout: 175,
    composition: "1 Ombre Mor Deythan, 4 Mor Deythan",
    effectif: { base: 5, max: 10, cout: 30 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "Raven Guard"],
    notes:
      "« Maîtres des Ombres » : corps restreint d'escouades d'infiltration de la Raven Guard, expertes dans l'art de se déplacer à travers les ombres sans être vues.",
    equipement: [
      "Bolter Némésis",
      "Pistolet bolter",
      "Grenades Frag",
      "Grenades Krak",
      "Caméléolin",
    ],
    variantes: [
      {
        nom: "Escouade de Mor Deythan",
        cout: 0,
        profils: [
          {
            nom: "Mor Deythan",
            profil: {
              M: 7,
              CC: 4,
              CT: 5,
              F: 4,
              E: 4,
              PV: 2,
              I: 4,
              A: 1,
              Cd: 8,
              Sf: 8,
              Vo: 7,
              Int: 7,
              Sv: "3+",
              Inv: "—",
            },
          },
          {
            nom: "Ombre Mor Deythan",
            profil: {
              M: 7,
              CC: 4,
              CT: 5,
              F: 4,
              E: 4,
              PV: 2,
              I: 4,
              A: 1,
              Cd: 9,
              Sf: 8,
              Vo: 7,
              Int: 7,
              Sv: "3+",
              Inv: "—",
            },
          },
        ],
        regles: [
          "Infiltration (8)",
          "Frappe Fatale",
          "Mouvement à Couvert",
          "Unité d'Appui (1)",
        ],
        type: "Ombre Mor Deythan : Infanterie (Sergent, Tirailleurs) · Mor Deythan : Infanterie (Tirailleurs)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "arme-principale",
        libelle: "Toute l'unité : remplacer le bolter Némésis",
        remplace: "Bolter Némésis",
        choix: [
          { nom: "— Conserver le bolter Némésis —", cout: 0 },
          { nom: "Fusil à pompe Astartes", cout: 0 },
        ],
      },
    ],
    legion: "XIX",
  },

  {
    id: "escouade-furies-noires",
    nom: "Escouade de Furies Noires",
    categorie: "Elite",
    cout: 175,
    composition: "1 Sélecteur des Morts, 4 Furies Noires",
    effectif: { base: 5, max: 10, cout: 30 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "Raven Guard"],
    notes:
      "Escouades d'assaut employées par la Raven Guard pour exécuter des frappes de décapitation sur des officiers ennemis désignés, au cœur du champ de bataille.",
    equipement: [
      "Paire de Serres de Corbeau",
      "Grenades Frag",
      "Grenades Krak",
      "Réacteurs modèle Corvidé",
    ],
    variantes: [
      {
        nom: "Escouade de Furies Noires",
        cout: 0,
        profils: [
          {
            nom: "Furie Noire",
            profil: {
              M: 14,
              CC: 5,
              CT: 4,
              F: 4,
              E: 4,
              PV: 2,
              I: 4,
              A: 3,
              Cd: 8,
              Sf: 7,
              Vo: 7,
              Int: 7,
              Sv: "3+",
              Inv: "—",
            },
          },
          {
            nom: "Sélecteur des Morts",
            profil: {
              M: 14,
              CC: 5,
              CT: 4,
              F: 4,
              E: 4,
              PV: 2,
              I: 4,
              A: 3,
              Cd: 9,
              Sf: 7,
              Vo: 7,
              Int: 7,
              Sv: "3+",
              Inv: "—",
            },
          },
        ],
        regles: ["Massif (3)", "Frappe en Profondeur", "Précision (6+)"],
        type: "Sélecteur des Morts : Infanterie (Sergent, Antigrav) · Furie Noire : Infanterie (Antigrav)",
      },
    ],
    options: [
      {
        type: "case",
        id: "selecteur-supplementaire",
        libelle:
          "Remplacer une Furie Noire par un Sélecteur des Morts (nécessite 10 Figurines)",
        cout: 5,
        ajoute: "Une Furie Noire remplacée par un Sélecteur des Morts",
      },
      {
        type: "case",
        id: "selecteur-bombes",
        libelle: "Sélecteur des Morts : bombes à fusion",
        cout: 10,
        ajoute: "Sélecteur des Morts : bombes à fusion",
      },
    ],
    legion: "XIX",
  },

  /* ----------------------------------------------------------
     UNITÉ RÉSERVÉE À LA Ve LÉGION (WHITE SCARS)
     Voir la note sur Qin Xa, catégorie Quartier Général.
     ---------------------------------------------------------- */
  {
    id: "keshig-or",
    nom: "Keshig d'Or",
    categorie: "Elite",
    cout: 140,
    composition: "1 Champion de la Keshig, 2 Cavaliers de la Keshig",
    effectif: { base: 3, max: 6, cout: 40 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "White Scars"],
    notes:
      "Escouades de motojets d'assaut lourdes, briseurs de ligne et forces d'assaut par excellence : elles remplissent des rôles que d'autres Légions attribuent à des blindés ou des Terminators.",
    equipement: [
      "Lance énergétique Kontos",
      "Épée énergétique",
      "Pistolet bolter",
      "Disperse-bolts",
    ],
    variantes: [
      {
        nom: "Keshig d'Or",
        cout: 0,
        profils: [
          {
            nom: "Cavalier de la Keshig",
            profil: {
              M: 16,
              CC: 5,
              CT: 4,
              F: 4,
              E: 4,
              PV: 2,
              I: 4,
              A: 3,
              Cd: 8,
              Sf: 8,
              Vo: 7,
              Int: 7,
              Sv: "2+",
              Inv: "—",
            },
          },
          {
            nom: "Champion de la Keshig",
            profil: {
              M: 16,
              CC: 5,
              CT: 4,
              F: 4,
              E: 4,
              PV: 2,
              I: 4,
              A: 3,
              Cd: 9,
              Sf: 8,
              Vo: 7,
              Int: 7,
              Sv: "2+",
              Inv: "—",
            },
          },
        ],
        regles: ["Frappe en Profondeur", "Massif (3)"],
        type: "Champion de la Keshig : Cavalerie (Sergent, Antigrav) · Cavalier de la Keshig : Cavalerie (Antigrav)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "champion-melee",
        libelle: "Champion de la Keshig : remplacer son épée énergétique",
        ajoute: true,
        prefixeFiche: "Champion de la Keshig : ",
        choix: [
          { nom: "— Aucun échange —", cout: 0 },
          { nom: "Hache énergétique", cout: 0 },
          { nom: "Marteau Thunder", cout: 10 },
        ],
      },
      {
        type: "choix",
        id: "cavaliers-melee",
        libelle: "Tout Cavalier de la Keshig : remplacer son épée énergétique",
        ajoute: true,
        parFigurine: true,
        prefixeFiche: "Cavalier de la Keshig : ",
        choix: [
          { nom: "— Aucun échange —", cout: 0 },
          { nom: "Hache énergétique", cout: 0 },
        ],
      },
    ],
    legion: "V",
  },

  /* ----------------------------------------------------------
     UNITÉ RÉSERVÉE À LA IXe LÉGION (BLOOD ANGELS)
     Voir la note sur Raldoron, catégorie Quartier Général.
     ---------------------------------------------------------- */
  {
    id: "paladins-ecarlates",
    nom: "Paladins Écarlates",
    categorie: "Elite",
    cout: 225,
    composition: "1 Exemple Écarlate, 4 Paladins Écarlates",
    effectif: { base: 5, max: 10, cout: 40 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "Blood Angels"],
    notes:
      "Un des Ordres Guerriers de la Première Sphère : les gardiens des édifices du Primarque, un rempart face à l'ennemi et un bouclier pour les fils de Sanguinius.",
    equipement: ["Épée énergétique et bouclier énergétique modèle Coriolis"],
    variantes: [
      {
        nom: "Paladins Écarlates",
        cout: 0,
        profils: [
          {
            nom: "Paladin Écarlate",
            profil: {
              M: 6,
              CC: 5,
              CT: 4,
              F: 4,
              E: 5,
              PV: 2,
              I: 4,
              A: 3,
              Cd: 8,
              Sf: 8,
              Vo: 7,
              Int: 7,
              Sv: "2+",
              Inv: "4+",
            },
          },
          {
            nom: "Exemple Écarlate",
            profil: {
              M: 6,
              CC: 5,
              CT: 4,
              F: 4,
              E: 5,
              PV: 2,
              I: 4,
              A: 3,
              Cd: 9,
              Sf: 8,
              Vo: 7,
              Int: 7,
              Sv: "2+",
              Inv: "4+",
            },
          },
        ],
        regles: [
          "Massif (2)",
          "Avance Implacable",
          "Lent et Méthodique",
          "Ligne (1)",
          "Frappe en Profondeur",
          "Le Sang Perdure",
        ],
        type: "Exemple Écarlate : Infanterie (Sergent, Lourd) · Paladin Écarlate : Infanterie (Lourd)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "exemple-arme",
        libelle:
          "Exemple Écarlate : échanger son épée énergétique et son bouclier énergétique modèle Coriolis",
        remplace: "Épée énergétique et bouclier énergétique modèle Coriolis",
        prefixeFiche: "Exemple Écarlate : ",
        choix: [
          { nom: "— Conserver l'équipement —", cout: 0 },
          { nom: "Lame de Perdition", cout: 0 },
          { nom: "Hache de Perdition", cout: 0 },
          { nom: "Masse de Perdition", cout: 0 },
          { nom: "Lance de Perdition", cout: 0 },
        ],
      },
      {
        type: "quantite",
        id: "iliastus",
        libelle:
          "Par tranche de cinq Figurines : canon d'assaut Iliastus à la place du bouclier énergétique modèle Coriolis (un Paladin Écarlate)",
        cout: 10,
        parTranche: 5,
        ajoute:
          "Canon d'assaut Iliastus — Tir soutenu (à la place du bouclier énergétique modèle Coriolis, un Paladin Écarlate)",
      },
    ],
    legion: "IX",
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
        profil: {
          M: 16,
          CC: 4,
          CT: 4,
          F: 4,
          E: 5,
          PV: 3,
          I: 4,
          A: 2,
          Cd: 8,
          Sf: 8,
          Vo: 7,
          Int: 7,
          Sv: "3+",
          Inv: "—",
        },
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
        libelle:
          "Figurines : lance-flammes lourd (à la place du scanner augure)",
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
        libelle:
          "Figurines : couleuvrine volkite (à la place du scanner augure)",
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
        profil: {
          M: 14,
          CC: 4,
          CT: 4,
          F: 4,
          E: 6,
          PV: 4,
          I: 4,
          A: 2,
          Cd: 8,
          Sf: 8,
          Vo: 7,
          Int: 7,
          Sv: "3+",
          Inv: "—",
        },
        regles: ["Massif (5)", "Frappe en Profondeur", "Protocoles de Tir (3)"],
        type: "Cavalerie (Tirailleurs, Antigrav)",
      },
    ],
    options: [
      {
        type: "quantite",
        id: "cyclone-lance-flammes",
        libelle:
          "Figurines : deux lance-flammes lourds (à la place du lance-missiles Cyclone)",
        cout: 0,
        parTranche: 1,
        groupe: "cyclone",
        ajoute:
          "Deux lance-flammes lourds (à la place du lance-missiles Cyclone)",
      },
      {
        type: "quantite",
        id: "cyclone-bolters",
        libelle:
          "Figurines : deux bolters lourds (à la place du lance-missiles Cyclone)",
        cout: 0,
        parTranche: 1,
        groupe: "cyclone",
        ajoute: "Deux bolters lourds (à la place du lance-missiles Cyclone)",
      },
      {
        type: "quantite",
        id: "cyclone-canons-laser",
        libelle:
          "Figurines : deux canons laser (à la place du lance-missiles Cyclone)",
        cout: 5,
        parTranche: 1,
        groupe: "cyclone",
        ajoute: "Deux canons laser (à la place du lance-missiles Cyclone)",
      },
      {
        type: "quantite",
        id: "cyclone-couleuvrines",
        libelle:
          "Figurines : deux couleuvrines volkites (à la place du lance-missiles Cyclone)",
        cout: 5,
        parTranche: 1,
        groupe: "cyclone",
        ajoute:
          "Deux couleuvrines volkites (à la place du lance-missiles Cyclone)",
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
    equipement: [
      "Pistolet bolter",
      "Épée tronçonneuse",
      "Bolter lourd",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Escadron de Motojets Scimitar",
        cout: 0,
        profils: [
          {
            nom: "Veneur Scimitar",
            profil: {
              M: 16,
              CC: 4,
              CT: 4,
              F: 4,
              E: 4,
              PV: 2,
              I: 4,
              A: 1,
              Cd: 7,
              Sf: 8,
              Vo: 7,
              Int: 7,
              Sv: "3+",
              Inv: "—",
            },
          },
          {
            nom: "Sergent Scimitar",
            profil: {
              M: 16,
              CC: 4,
              CT: 4,
              F: 4,
              E: 4,
              PV: 2,
              I: 4,
              A: 1,
              Cd: 8,
              Sf: 8,
              Vo: 7,
              Int: 7,
              Sv: "3+",
              Inv: "—",
            },
          },
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
        libelle:
          "Figurines prenant un objet de la liste des Pistolets de Légion (à la place du pistolet bolter)",
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
        profilVehicule: {
          M: 18,
          CT: 4,
          avant: 12,
          flanc: 12,
          arriere: 12,
          PC: 6,
          transport: "—",
        },
        regles: ["Aucune"],
        type: "Véhicule (Stable, Aéronef)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "batteries-laterales",
        libelle:
          "Remplacer les deux batteries de bolters lourds Gravis Latérales",
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
        profilVehicule: {
          M: 18,
          CT: 4,
          avant: 12,
          flanc: 12,
          arriere: 12,
          PC: 6,
          transport: 16,
        },
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
    equipement: [
      "Deux canons laser jumelés d'Axe Central",
      "Lance-missiles rotatif d'Axe Central",
    ],
    variantes: [
      {
        nom: "Intercepteur Xiphon",
        cout: 0,
        profilVehicule: {
          M: 20,
          CT: 4,
          avant: 11,
          flanc: 11,
          arriere: 11,
          PC: 5,
          transport: "—",
        },
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
        profilVehicule: {
          M: 12,
          CT: 4,
          avant: 14,
          flanc: 14,
          arriere: 14,
          PC: 8,
          transport: 10,
        },
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
    equipement: [
      "Bolter jumelé",
      "Pistolet bolter",
      "Épée tronçonneuse",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Escadron de Motards",
        cout: 0,
        profils: [
          {
            nom: "Motard",
            profil: {
              M: 14,
              CC: 4,
              CT: 4,
              F: 4,
              E: 4,
              PV: 2,
              I: 4,
              A: 1,
              Cd: 7,
              Sf: 8,
              Vo: 7,
              Int: 6,
              Sv: "3+",
              Inv: "—",
            },
          },
          {
            nom: "Sergent Motard",
            profil: {
              M: 14,
              CC: 4,
              CT: 4,
              F: 4,
              E: 4,
              PV: 2,
              I: 4,
              A: 1,
              Cd: 8,
              Sf: 8,
              Vo: 7,
              Int: 6,
              Sv: "3+",
              Inv: "—",
            },
          },
        ],
        regles: [
          "Massif (2)",
          "Avant-garde (1)",
          "Orage de Feu",
          "Avance Implacable",
          "Attaque de Flanc",
        ],
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
        libelle:
          "Figurines prenant un objet de la liste des Pistolets de Légion (à la place du pistolet bolter)",
        cout: 5,
        parTranche: 1,
        ajoute: "Pistolet de Légion (à la place du pistolet bolter)",
      },
      {
        type: "quantite",
        id: "fusils-plasma",
        libelle:
          "Toute l'unité : fusil à plasma jumelé (à la place du bolter jumelé)",
        cout: 15,
        parTranche: 1,
        ajoute: "Fusil à plasma jumelé (à la place du bolter jumelé)",
      },
      {
        type: "quantite",
        id: "fusils-pompe",
        libelle:
          "Figurines échangeant gratuitement leur épée tronçonneuse contre un fusil à pompe Astartes",
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
    equipement: [
      "Autocanon court Anvilus d'Axe Central",
      "Bolter lourd de Coque (Avant)",
    ],
    variantes: [
      {
        nom: "Sabre",
        cout: 0,
        profilVehicule: {
          M: 16,
          CT: 4,
          avant: 12,
          flanc: 11,
          arriere: 10,
          PC: 4,
          transport: "—",
        },
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
    equipement: [
      "Fusil à pompe Astartes",
      "Pistolet bolter",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Escouade de Reconnaissance",
        cout: 0,
        profils: [
          {
            nom: "Légionnaire Reco",
            profil: {
              M: 7,
              CC: 4,
              CT: 4,
              F: 4,
              E: 4,
              PV: 1,
              I: 4,
              A: 1,
              Cd: 7,
              Sf: 7,
              Vo: 7,
              Int: 7,
              Sv: "3+",
              Inv: "—",
            },
          },
          {
            nom: "Sergent Reco",
            profil: {
              M: 7,
              CC: 4,
              CT: 4,
              F: 4,
              E: 4,
              PV: 1,
              I: 4,
              A: 1,
              Cd: 8,
              Sf: 7,
              Vo: 7,
              Int: 7,
              Sv: "3+",
              Inv: "—",
            },
          },
        ],
        regles: [
          "Infiltration (9)",
          "Mouvement à Couvert",
          "Unité d'Appui (2)",
        ],
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
        libelle:
          "Sergent Reco : remplacer son pistolet bolter (Armes de Mêlée de Sergent de Légion)",
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
        libelle:
          "Sergent Reco : remplacer son pistolet bolter (Pistolets de Légion)",
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
        libelle:
          "Équipement de Légion (1er Légionnaire Reco, deux max dans l'unité)",
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
        libelle:
          "Figurines : bolter Némésis (à la place du fusil à pompe Astartes)",
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
     Arquitor, Kratos, Sicaran Venator, Sicaran et Predator peuvent
     tous échanger leurs deux bolters lourds Latéraux contre un objet
     de la liste des Armes Latérales de Légion (p. 21) : voir
     optionLaterauxLegion.
     ---------------------------------------------------------- */
  {
    id: "arquitor",
    nom: "Bombarde Arquitor",
    categorie: "Blindés",
    cout: 150,
    composition: "1 Bombarde Arquitor",
    traits: ["[Allégeance]", "[Legiones Astartes]", "Écran de Fumée"],
    equipement: [
      "Bombarde Morbus d'Axe Central",
      "Deux bolters lourds Latéraux",
    ],
    variantes: [
      {
        nom: "Bombarde Arquitor",
        cout: 0,
        profilVehicule: {
          M: 8,
          CT: 4,
          avant: 13,
          flanc: 12,
          arriere: 10,
          PC: 6,
          transport: "—",
        },
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
      optionLaterauxLegion({ nom: "Deux autocanons Latéraux", cout: 10 }),
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
    equipement: [
      "Lance-missiles Scorpius de Tourelle",
      "Bolter sur Pivot n°1",
      "Bolter sur Pivot n°2",
    ],
    variantes: [
      {
        nom: "Char Lance-missiles Scorpius",
        cout: 0,
        profilVehicule: {
          M: 10,
          CT: 4,
          avant: 12,
          flanc: 11,
          arriere: 10,
          PC: 5,
          transport: "—",
        },
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
    equipement: [
      "Canon Demolisher d'Axe Central",
      "Combi-bolter de Coque (Avant)",
    ],
    variantes: [
      {
        nom: "Char de Siège Vindicator",
        cout: 0,
        profilVehicule: {
          M: 10,
          CT: 4,
          avant: 13,
          flanc: 13,
          arriere: 10,
          PC: 6,
          transport: "—",
        },
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
        profilVehicule: {
          M: 8,
          CT: 4,
          avant: 14,
          flanc: 14,
          arriere: 14,
          PC: 10,
          transport: "—",
        },
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
      optionLaterauxLegion(),
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
    equipement: [
      "Laser à neutrons d'Axe Central",
      "Bolter lourd de Tourelle",
      "Deux bolters lourds Latéraux",
    ],
    variantes: [
      {
        nom: "Sicaran Venator",
        cout: 0,
        profilVehicule: {
          M: 14,
          CT: 4,
          avant: 13,
          flanc: 12,
          arriere: 12,
          PC: 6,
          transport: "—",
        },
        regles: ["Explose (5+)"],
        type: "Véhicule",
      },
    ],
    options: [
      optionLaterauxLegion(),
      optionPivotLegion(),
      ...optionsFinBlinde({ bulldozer: false }),
    ],
  },

  {
    id: "sicaran",
    nom: "Sicaran",
    categorie: "Blindés",
    cout: 160,
    composition: "1 Sicaran",
    traits: ["[Allégeance]", "[Legiones Astartes]", "Écran de Fumée"],
    equipement: [
      "Autocanon accélérateur jumelé de Tourelle",
      "Bolter lourd de Coque (Avant)",
      "Deux bolters lourds Latéraux",
    ],
    variantes: [
      {
        nom: "Sicaran",
        cout: 0,
        profilVehicule: {
          M: 14,
          CT: 4,
          avant: 13,
          flanc: 12,
          arriere: 12,
          PC: 6,
          transport: "—",
        },
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
      optionLaterauxLegion(),
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
        profilVehicule: {
          M: 12,
          CT: 4,
          avant: 13,
          flanc: 12,
          arriere: 10,
          PC: 5,
          transport: "—",
        },
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
      optionLaterauxLegion(),
      optionPivotLegion(),
      ...optionsFinBlinde({ missile: "Tourelle" }),
    ],
  },

  /* Char Lance-missiles Whirlwind — Addendum au Liber (ajouté à la
     Liste d'Armée des Legiones Astartes après la publication du
     livre d'armée principal). */
  {
    id: "whirlwind",
    nom: "Char Lance-missiles Whirlwind",
    categorie: "Blindés",
    cout: 100,
    composition: "1 Whirlwind",
    // L'Addendum précise que les Fumigènes donnent le Trait Écran de
    // Fumée, mais son propre encadré TRAITS ne liste que ces deux-là
    // (contrairement aux autres Blindés, qui l'ont directement en
    // Trait sans lister de Fumigènes en Équipement) : transcription
    // fidèle du livre malgré l'incohérence apparente.
    traits: ["[Allégeance]", "[Legiones Astartes]"],
    /* Le livre liste « Deux bolters sur Pivot » : on l'éclate en deux
       lignes pour pouvoir en remplacer un (voir l'option "pivot-1"),
       comme le Scorpius. */
    equipement: [
      "Lance-missiles Whirlwind de Tourelle",
      "Bolter sur Pivot n°1",
      "Bolter sur Pivot n°2",
      "Fumigènes",
    ],
    variantes: [
      {
        nom: "Char Lance-missiles Whirlwind",
        cout: 0,
        profilVehicule: {
          M: 10,
          CT: 4,
          avant: 12,
          flanc: 11,
          arriere: 10,
          PC: 5,
          transport: "—",
        },
        regles: ["Aucune"],
        type: "Véhicule",
      },
    ],
    options: [
      {
        type: "case",
        id: "missiles-pyrax",
        libelle: "Lance-missiles Whirlwind de Tourelle : missiles Pyrax",
        cout: 10,
        ajoute: "Missiles Pyrax",
      },
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
    equipement: [
      "Canon à bolts Gravis (bras n°1)",
      "Canon à bolts Gravis (bras n°2)",
    ],
    variantes: [
      {
        nom: "Dreadnought Contemptor",
        cout: 0,
        profil: {
          M: 8,
          CC: 4,
          CT: 4,
          F: 7,
          E: 7,
          PV: 6,
          I: 4,
          A: 4,
          Cd: 12,
          Sf: 10,
          Vo: 7,
          Int: 5,
          Sv: "2+",
          Inv: "5+",
        },
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
        libelle:
          "Paire de poings énergétiques Gravis et deux combi-bolters (les deux bras)",
        cout: 5,
        ajoute: "Paire de poings énergétiques Gravis et deux combi-bolters",
        remplaceListe: [
          "Canon à bolts Gravis (bras n°1)",
          "Canon à bolts Gravis (bras n°2)",
        ],
      },
      {
        type: "paire",
        id: "paire-poings-tronconneurs",
        libelle:
          "Paire de poings tronçonneurs Gravis et deux combi-bolters (les deux bras)",
        cout: 5,
        ajoute: "Paire de poings tronçonneurs Gravis et deux combi-bolters",
        remplaceListe: [
          "Canon à bolts Gravis (bras n°1)",
          "Canon à bolts Gravis (bras n°2)",
        ],
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
          {
            nom: "Lance-flammes lourd (à la place d'un combi-bolter)",
            cout: 5,
          },
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
          {
            nom: "Lance-flammes lourd (à la place d'un combi-bolter)",
            cout: 5,
          },
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
    equipement: [
      "Batterie d'autocanons Anvilus",
      "Bolter lourd jumelé",
      "Lance-missiles Aiolos",
    ],
    variantes: [
      {
        nom: "Dreadnought Deredeo",
        cout: 0,
        profil: {
          M: 7,
          CC: 4,
          CT: 4,
          F: 6,
          E: 7,
          PV: 6,
          I: 4,
          A: 2,
          Cd: 12,
          Sf: 10,
          Vo: 7,
          Int: 5,
          Sv: "2+",
          Inv: "5+",
        },
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
        profil: {
          M: 6,
          CC: 4,
          CT: 4,
          F: 8,
          E: 8,
          PV: 7,
          I: 4,
          A: 4,
          Cd: 12,
          Sf: 10,
          Vo: 7,
          Int: 5,
          Sv: "2+",
          Inv: "5+",
        },
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
        libelle:
          "Paire de pinces de siège Leviathan et deux fuseurs (les deux bras)",
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
        libelle:
          "Paire de trépans de siège Leviathan et deux fuseurs (les deux bras)",
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
        profil: {
          M: 6,
          CC: 4,
          CT: 4,
          F: 8,
          E: 8,
          PV: 8,
          I: 3,
          A: 2,
          Cd: 12,
          Sf: 10,
          Vo: 7,
          Int: 5,
          Sv: "2+",
          Inv: "4+",
        },
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
     UNITÉ RÉSERVÉE À LA IXe LÉGION (BLOOD ANGELS)
     Voir la note sur Raldoron, catégorie Quartier Général.
     ---------------------------------------------------------- */
  {
    id: "dreadnought-contemptor-incaendius",
    nom: "Dreadnought Contemptor-Incaendius",
    categorie: "Engins de Guerre",
    cout: 200,
    composition: "1 Contemptor-Incaendius",
    traits: ["[Allégeance]", "Blood Angels"],
    notes:
      "Châssis de Dreadnought Contemptor fabriqué exclusivement pour la IXe Légion : un accélérateur externe dorsal ralentit sa chute depuis l'orbite basse ou lui permet un grand bond.",
    equipement: ["Paire de Serres de Perdition", "Deux lance-flammes lourds"],
    variantes: [
      {
        nom: "Contemptor-Incaendius",
        cout: 0,
        profil: {
          M: 8,
          CC: 4,
          CT: 4,
          F: 7,
          E: 7,
          PV: 6,
          I: 4,
          A: 4,
          Cd: 12,
          Sf: 10,
          Vo: 7,
          Int: 5,
          Sv: "2+",
          Inv: "5+",
        },
        regles: [
          "Massif (7)",
          "Explose (4+)",
          "Propulseur Incaendius",
          "Frappe en Profondeur",
        ],
        type: "Marcheur",
      },
    ],
    options: [
      {
        type: "choix",
        id: "armes-principales",
        libelle: "Remplacer les deux lance-flammes lourds",
        remplace: "Deux lance-flammes lourds",
        choix: [
          { nom: "— Conserver les deux lance-flammes lourds —", cout: 0 },
          { nom: "Deux fuseurs", cout: 20 },
          { nom: "Deux canons d'assaut Iliastus — Tir soutenu", cout: 30 },
        ],
      },
    ],
    legion: "IX",
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
        profilVehicule: {
          M: 12,
          CT: 4,
          avant: 12,
          flanc: 11,
          arriere: 10,
          PC: 5,
          transport: 12,
        },
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
        profilVehicule: {
          M: "—",
          CT: 2,
          avant: 12,
          flanc: 12,
          arriere: 12,
          PC: 4,
          transport: 10,
        },
        regles: [
          "Transport Léger",
          "Véhicule d'Assaut Orbital",
          "Ouverture à l'Impact",
        ],
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
    equipement: [
      "Deux combi-bolters sur Pivot",
      "Découpeurs à fusion d'Axe Central",
    ],
    notes: "Un Point d'Accès sur chaque Flanc.",
    variantes: [
      {
        nom: "Termite",
        cout: 0,
        profilVehicule: {
          M: 6,
          CT: 4,
          avant: 12,
          flanc: 12,
          arriere: 10,
          PC: 5,
          transport: 12,
        },
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
        profilVehicule: {
          M: 14,
          CT: 4,
          avant: 12,
          flanc: 12,
          arriere: 12,
          PC: 8,
          transport: 22,
        },
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
        profilVehicule: {
          M: 15,
          CT: 4,
          avant: 12,
          flanc: 12,
          arriere: 12,
          PC: 5,
          transport: 12,
        },
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
        profilVehicule: {
          M: "—",
          CT: 2,
          avant: 12,
          flanc: 12,
          arriere: 12,
          PC: 5,
          transport: 7,
        },
        regles: [
          "Transport à Dreadnought",
          "Véhicule d'Assaut Orbital",
          "Ouverture à l'Impact",
        ],
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
    equipement: [
      "Deux affûts de canons laser Latéraux",
      "Bolter lourd jumelé de Coque (Avant)",
    ],
    notes: "Cette Figurine a un Point d'Accès sur chaque Flanc et à l'Avant.",
    variantes: [
      {
        nom: "Spartan",
        cout: 0,
        profilVehicule: {
          M: 10,
          CT: 4,
          avant: 14,
          flanc: 14,
          arriere: 14,
          PC: 10,
          transport: 26,
        },
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
    equipement: [
      "Deux canons laser jumelés Latéraux",
      "Bolter lourd jumelé de Coque (Avant)",
    ],
    notes: "Cette Figurine a un Point d'Accès sur chaque Flanc et à l'Avant.",
    variantes: [
      {
        nom: "Porteur Land Raider",
        cout: 0,
        profilVehicule: {
          M: 10,
          CT: 4,
          avant: 14,
          flanc: 14,
          arriere: 14,
          PC: 8,
          transport: 12,
        },
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
     UNITÉS — SEIGNEURS DES BATAILLES (véhicules Super-lourds)
     Typhon et Cerberus échangent leurs deux bolters lourds Latéraux
     comme les Blindés (voir optionLaterauxLegion, section Blindés
     ci-dessus). Le Mastodon reste incomplet : voir sa note.
     ---------------------------------------------------------- */
  {
    id: "mastodon",
    nom: "Transport d'Assaut Super-lourd Mastodon",
    categorie: "Seigneurs des Batailles",
    cout: 600,
    composition: "1 Transport d'Assaut Super-lourd Mastodon",
    traits: ["[Allégeance]", "[Legiones Astartes]", "Écran de Fumée"],
    equipement: [
      "Affût à fusion de siège d'Axe Central",
      "Batterie Skyreaper de Tourelle",
    ],
    notes:
      "Cette Figurine a un Point d'Accès à l'Arrière et un Point d'Accès à l'Avant.",
    variantes: [
      {
        nom: "Transport d'Assaut Super-lourd Mastodon",
        cout: 0,
        profilVehicule: {
          M: 10,
          CT: 4,
          avant: 14,
          flanc: 14,
          arriere: 14,
          PC: 20,
          transport: 42,
        },
        regles: [
          "Véhicule d'Assaut",
          "Baie de Transport Mastodon",
          "Boucliers Void (2)",
        ],
        type: "Véhicule (Transport, Super-lourd)",
      },
    ],
    // "Doit être dotée de deux objets de la liste des Armes Latérales
    // de Légion" : contrairement aux Blindés (qui échangent un
    // équipement de départ existant, voir optionLaterauxLegion), le
    // Mastodon n'a PAS de bolters lourds Latéraux dans son équipement
    // de départ — ce sont deux emplacements obligatoires à pourvoir
    // indépendamment. Pas encore modélisé (option "quantite"/"multi"
    // à choix multiples avec doublons autorisés, à confirmer).
    options: [...optionsMissileEtProjecteurs()],
  },

  {
    id: "stormbird-sokar",
    nom: "Stormbird Sokar",
    categorie: "Seigneurs des Batailles",
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
    notes:
      "Si cette Figurine n'a pas de socle, on considère qu'elle a des Points d'Accès sur toutes ses Faces.",
    variantes: [
      {
        nom: "Stormbird Sokar",
        cout: 0,
        profilVehicule: {
          M: 16,
          CT: 4,
          avant: 14,
          flanc: 14,
          arriere: 14,
          PC: 22,
          transport: 52,
        },
        regles: ["Baie de Transport Stormbird", "Boucliers Void (2)"],
        type: "Véhicule (Transport, Super-lourd, Aéronef)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "canons-gauche",
        libelle:
          "Remplacer gratuitement tout canon laser jumelé de Coque (Gauche)",
        remplace: "Deux canons laser jumelés de Coque (Gauche)",
        choix: [
          { nom: "— Conserver les canons laser jumelés (Gauche) —", cout: 0 },
          {
            nom: "Batterie de bolters lourds Gravis de Coque (Gauche)",
            cout: 0,
          },
        ],
      },
      {
        type: "choix",
        id: "canons-droite",
        libelle:
          "Remplacer gratuitement tout canon laser jumelé de Coque (Droite)",
        remplace: "Deux canons laser jumelés de Coque (Droite)",
        choix: [
          { nom: "— Conserver les canons laser jumelés (Droite) —", cout: 0 },
          {
            nom: "Batterie de bolters lourds Gravis de Coque (Droite)",
            cout: 0,
          },
        ],
      },
    ],
  },

  {
    id: "escorteur-thunderhawk",
    nom: "Escorteur Thunderhawk",
    categorie: "Seigneurs des Batailles",
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
    notes:
      "Si cette Figurine n'a pas de socle, on considère qu'elle a des Points d'Accès sur toutes ses Faces.",
    variantes: [
      {
        nom: "Escorteur Thunderhawk",
        cout: 0,
        profilVehicule: {
          M: 18,
          CT: 4,
          avant: 13,
          flanc: 13,
          arriere: 13,
          PC: 18,
          transport: 32,
        },
        regles: ["Baie de Transport Thunderhawk"],
        type: "Véhicule (Transport, Super-lourd, Aéronef)",
      },
    ],
    options: [],
  },

  {
    id: "falchion",
    nom: "Chasseur de Chars Super-lourd Falchion",
    categorie: "Seigneurs des Batailles",
    cout: 650,
    composition: "1 Chasseur de Chars Super-lourd Falchion",
    traits: ["[Allégeance]", "[Legiones Astartes]", "Écran de Fumée"],
    equipement: [
      "Canon à onde neutronique d'Axe Central",
      "Deux affûts de canons laser Latéraux",
    ],
    variantes: [
      {
        nom: "Chasseur de Chars Super-lourd Falchion",
        cout: 0,
        profilVehicule: {
          M: 10,
          CT: 4,
          avant: 14,
          flanc: 13,
          arriere: 12,
          PC: 18,
          transport: "—",
        },
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
    categorie: "Seigneurs des Batailles",
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
        profilVehicule: {
          M: 10,
          CT: 4,
          avant: 14,
          flanc: 13,
          arriere: 12,
          PC: 18,
          transport: "—",
        },
        regles: ["Aucune"],
        type: "Véhicule (Super-lourd)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "bolter-lourd-avant",
        libelle:
          "Remplacer gratuitement le bolter lourd jumelé de Coque (Avant)",
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
    categorie: "Seigneurs des Batailles",
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
        profilVehicule: {
          M: 10,
          CT: 4,
          avant: 14,
          flanc: 13,
          arriere: 12,
          PC: 18,
          transport: "—",
        },
        regles: ["Aucune"],
        type: "Véhicule (Super-lourd)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "bolter-lourd-avant",
        libelle:
          "Remplacer gratuitement le bolter lourd jumelé de Coque (Avant)",
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
    categorie: "Seigneurs des Batailles",
    cout: 400,
    composition: "1 Char de Siège Lourd Typhon",
    traits: ["[Allégeance]", "[Legiones Astartes]", "Écran de Fumée"],
    equipement: [
      "Canon de siège Dreadhammer d'Axe Central",
      "Deux bolters lourds Latéraux",
    ],
    variantes: [
      {
        nom: "Char de Siège Lourd Typhon",
        cout: 0,
        profilVehicule: {
          M: 10,
          CT: 4,
          avant: 14,
          flanc: 14,
          arriere: 13,
          PC: 12,
          transport: "—",
        },
        regles: ["Explose (5+)"],
        type: "Véhicule (Super-lourd)",
      },
    ],
    options: [optionLaterauxLegion(), ...optionsVehiculeSuperLourdPivot()],
  },

  {
    id: "cerberus",
    nom: "Chasseur de Chars Lourd Cerberus",
    categorie: "Seigneurs des Batailles",
    cout: 400,
    composition: "1 Chasseur de Chars Lourd Cerberus",
    traits: ["[Allégeance]", "[Legiones Astartes]", "Écran de Fumée"],
    equipement: [
      "Batterie laser à neutrons d'Axe Central",
      "Deux bolters lourds Latéraux",
    ],
    variantes: [
      {
        nom: "Chasseur de Chars Lourd Cerberus",
        cout: 0,
        profilVehicule: {
          M: 10,
          CT: 4,
          avant: 14,
          flanc: 14,
          arriere: 13,
          PC: 12,
          transport: "—",
        },
        regles: ["Explose (4+)"],
        type: "Véhicule (Super-lourd)",
      },
    ],
    options: [optionLaterauxLegion(), ...optionsVehiculeSuperLourdPivot()],
  },

  /* ----------------------------------------------------------
     UNITÉ RÉSERVÉE À LA XIXe LÉGION (RAVEN GUARD)
     Voir la note sur Kaedes Nex, catégorie État-major.
     ---------------------------------------------------------- */
  {
    id: "corvus-corax",
    nom: "Corvus Corax",
    categorie: "Seigneur de Guerre",
    cout: 440,
    composition: "1 Corvus Corax",
    notes:
      "Primarque de la Raven Guard, Le Libérateur, Celui Qui Choisit les Morts, Le Seigneur Ombreux.",
    traits: ["Loyaliste", "Raven Guard", "Maître de la Légion"],
    equipement: [
      "Colère et Justice",
      "Talionis",
      "Les Serres Corvidées",
      "Caméléolin",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Corvus Corax",
        cout: 0,
        profil: {
          M: 16,
          CC: 7,
          CT: 6,
          F: 6,
          E: 6,
          PV: 6,
          I: 6,
          A: 6,
          Cd: 12,
          Sf: 10,
          Vo: 10,
          Int: 10,
          Sv: "2+",
          Inv: "4+",
        },
        regles: [
          "Sire de la Raven Guard",
          "Massif (6)",
          "Le Seigneur Ombreux",
          "Guerrier Éternel (2)",
          "Frappe en Profondeur",
        ],
        type: "Parangon (Unique, Antigrav)",
      },
    ],
    options: [],
    legion: "XIX",
  },

  /* ----------------------------------------------------------
     UNITÉ RÉSERVÉE À LA Ve LÉGION (WHITE SCARS)
     Voir la note sur Qin Xa, catégorie Quartier Général.
     ---------------------------------------------------------- */
  {
    id: "jaghatai-khan",
    nom: "Jaghatai Khan",
    categorie: "Seigneur de Guerre",
    cout: 440,
    composition: "1 Jaghatai Khan",
    notes: "Primarque des White Scars, Le Faucon, Maître du Firmament d'Azur.",
    traits: ["Loyaliste", "White Scars", "Maître de la Légion"],
    equipement: [
      "Le Dao du Tigre Blanc",
      "Voix de l'Orage",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Jaghatai Khan",
        cout: 0,
        profil: {
          M: 8,
          CC: 7,
          CT: 6,
          F: 6,
          E: 6,
          PV: 6,
          I: 7,
          A: 7,
          Cd: 12,
          Sf: 10,
          Vo: 10,
          Int: 10,
          Sv: "2+",
          Inv: "4+",
        },
        regles: [
          "Sire des White Scars",
          "Massif (4)",
          "Mort par Mille Coupures",
          "Guerrier Éternel (2)",
        ],
        type: "Parangon (Unique)",
      },
    ],
    options: [],
    legion: "V",
  },

  /* ----------------------------------------------------------
     UNITÉ RÉSERVÉE À LA IXe LÉGION (BLOOD ANGELS)
     Voir la note sur Raldoron, catégorie Quartier Général.
     ---------------------------------------------------------- */
  {
    id: "sanguinius",
    nom: "Sanguinius",
    categorie: "Seigneur de Guerre",
    cout: 485,
    composition: "1 Sanguinius",
    notes:
      "Le Grand Ange, Le Plus Brillant, Maître des Osts, Primarque des Blood Angels.",
    traits: ["Loyaliste", "Blood Angels", "Maître de la Légion"],
    equipement: [
      "Infernus",
      "La Lame Carmin",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Sanguinius",
        cout: 0,
        profil: {
          M: 16,
          CC: 8,
          CT: 6,
          F: 6,
          E: 6,
          PV: 6,
          I: 6,
          A: 6,
          Cd: 12,
          Sf: 10,
          Vo: 10,
          Int: 10,
          Sv: "2+",
          Inv: "4+",
        },
        regles: [
          "Sire des Blood Angels",
          "Massif (6)",
          "Descente Angélique",
          "Frappe en Profondeur",
          "Guerrier Éternel (2)",
        ],
        type: "Parangon (Unique, Antigrav)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "arme-principale",
        libelle:
          "Échanger la Lame Carmin contre la Lance de Telesto (et la Lame d'Argent Lunaire, ci-dessous)",
        remplace: "La Lame Carmin",
        choix: [
          { nom: "— Conserver la Lame Carmin —", cout: 0 },
          { nom: "Lance de Telesto", cout: 0 },
        ],
      },
      {
        type: "case",
        id: "lame-argent",
        libelle: "Lame d'Argent Lunaire (uniquement avec la Lance de Telesto)",
        cout: 0,
        ajoute: "Lame d'Argent Lunaire",
      },
    ],
    legion: "IX",
  },

  /* ----------------------------------------------------------
     UNITÉS RÉSERVÉES À LA XIIe LÉGION (WORLD EATERS)
     Angron et Angron Transfiguré (`excluAvec`) sont mutuellement
     exclusifs : deux formes du même Primarque, jamais les deux à la
     fois dans la même Armée (voir uniteAccessible, js/unites.js).
     ---------------------------------------------------------- */
  {
    id: "angron",
    nom: "Angron",
    categorie: "Seigneur de Guerre",
    cout: 450,
    composition: "1 Angron",
    notes:
      "Le plus sanguinaire et le plus sauvage des Primarques, maître de la Légion des World Eaters, Seigneur des Sables Écarlates.",
    traits: ["Renégat", "World Eaters", "Maître de la Légion"],
    equipement: [
      "La Carnivore et la Carnassière",
      "Le Fourneau de Hargne",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Angron",
        cout: 0,
        profil: {
          M: 8,
          CC: 8,
          CT: 6,
          F: 6,
          E: 6,
          PV: 6,
          I: 6,
          A: 6,
          Cd: 12,
          Sf: 10,
          Vo: 10,
          Int: 10,
          Sv: "2+",
          Inv: "4+",
        },
        regles: [
          "Seigneur des Sables Écarlates",
          "Sire des World Eaters",
          "Massif (4)",
          "Impact (F)",
          "Guerrier Éternel (2)",
        ],
        type: "Parangon (Unique)",
      },
    ],
    options: [],
    excluAvec: ["angron-transfigure"],
    legion: "XII",
  },
  {
    id: "angron-transfigure",
    nom: "Angron Transfiguré",
    categorie: "Seigneur de Guerre",
    cout: 600,
    composition: "1 Angron Transfiguré",
    notes:
      "Ascension démoniaque d'Angron : pour le préserver des Clous du Boucher, Lorgar l'a fait basculer au rang de démon, au prix de son asservissement aux puissances du Warp.",
    traits: ["Maître de la Légion"],
    equipement: [
      "Lames de l'Ange Rouge — Éviscération",
      "Lames de l'Ange Rouge — Concassage",
    ],
    variantes: [
      {
        nom: "Angron Transfiguré",
        cout: 0,
        profil: {
          M: 14,
          CC: 8,
          CT: 6,
          F: 7,
          E: 7,
          PV: 7,
          I: 7,
          A: 8,
          Cd: 12,
          Sf: 10,
          Vo: 12,
          Int: 8,
          Sv: "2+",
          Inv: "4+",
        },
        regles: [
          "Massif (7)",
          "Seigneur de la Corruption",
          "Frappe en Profondeur",
          "Guerrier Éternel (2)",
          "Peur (2)",
        ],
        type: "Parangon (Unique, Antigrav, Maléfique)",
      },
    ],
    options: [],
    excluAvec: ["angron"],
    legion: "XII",
  },
  {
    id: "kharn-le-sanglant",
    nom: "Khârn le Sanglant",
    categorie: "Quartier Général",
    cout: 175,
    composition: "1 Khârn le Sanglant",
    notes: "Capitaine de la Huitième Compagnie d'Assaut, Le Deux Fois Rescapé, L'Exterminateur.",
    traits: ["Renégat", "World Eaters", "Maître de la Légion"],
    equipement: [
      "La Trancheuse",
      "Pistolet à plasma — Tir soutenu",
      "Pistolet à plasma — Tir maximal",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Khârn le Sanglant",
        cout: 0,
        profil: {
          M: 7,
          CC: 7,
          CT: 5,
          F: 4,
          E: 4,
          PV: 4,
          I: 5,
          A: 5,
          Cd: 10,
          Sf: 9,
          Vo: 9,
          Int: 9,
          Sv: "2+",
          Inv: "4+",
        },
        regles: ["Fauchage (2)", "Guerrier Éternel (1)", "Précision (5+)"],
        type: "Infanterie (Unique, État-major)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "arme-principale",
        libelle:
          "Échanger La Trancheuse contre La Carnassière Reforgée (uniquement si Angron ne fait pas partie de la même Armée)",
        remplace: "La Trancheuse",
        requiertAbsenceUnite: "angron",
        choix: [
          { nom: "— Conserver La Trancheuse —", cout: 0 },
          { nom: "La Carnassière Reforgée", cout: 10 },
        ],
      },
    ],
    legion: "XII",
  },
  {
    id: "lotara-sarrin",
    nom: "Lotara Sarrin",
    categorie: "État-major",
    cout: 85,
    composition: "1 Lotara Sarrin",
    notes: "Capitaine du Conqueror, Une Rose Baignée de Sang.",
    traits: ["Renégat", "World Eaters"],
    equipement: ["Pistolet de dotation", "La Morsure du Conqueror"],
    variantes: [
      {
        nom: "Lotara Sarrin",
        cout: 0,
        profil: {
          M: 6,
          CC: 3,
          CT: 3,
          F: 3,
          E: 3,
          PV: 2,
          I: 3,
          A: 2,
          Cd: 9,
          Sf: 9,
          Vo: 8,
          Int: 8,
          Sv: "6+",
          Inv: "5+",
        },
        regles: ["Calme et Posée", "L'Ombre du Conqueror"],
        type: "Infanterie (Unique, Sergent, Spécialiste)",
      },
    ],
    options: [],
    legion: "XII",
  },
  {
    id: "escouade-saccageuse",
    nom: "Escouade Saccageuse",
    categorie: "Assaut Lourd",
    cout: 135,
    composition: "1 Champion Saccageur, 4 Saccageurs",
    effectif: { base: 5, max: 15, cout: 22 },
    traits: ["[Allégeance]", "World Eaters"],
    equipement: ["Grenades Frag", "Grenades Krak"],
    variantes: [
      {
        nom: "Escouade Saccageuse",
        cout: 0,
        profils: [
          {
            nom: "Saccageur",
            profil: {
              M: 7,
              CC: 5,
              CT: 4,
              F: 4,
              E: 4,
              PV: 2,
              I: 4,
              A: 2,
              Cd: 8,
              Sf: 8,
              Vo: 7,
              Int: 7,
              Sv: "3+",
              Inv: "—",
            },
          },
          {
            nom: "Champion Saccageur",
            profil: {
              M: 7,
              CC: 5,
              CT: 4,
              F: 4,
              E: 4,
              PV: 2,
              I: 4,
              A: 3,
              Cd: 9,
              Sf: 8,
              Vo: 7,
              Int: 7,
              Sv: "3+",
              Inv: "—",
            },
          },
        ],
        regles: ["Impact (F)", "Avant-garde (3)"],
        type: "Champion Saccageur : Infanterie (Champion, Sergent) · Saccageur : Infanterie",
      },
    ],
    options: [
      {
        type: "choix",
        id: "arme-caedere",
        libelle:
          "Toute l'unité : arme des Caedere (même profil pour toutes les Figurines)",
        ajoute: true,
        obligatoire: true,
        choix: [
          { nom: "Marteau météore", cout: 0 },
          { nom: "Hache tronçonneuse Excoriator", cout: 0 },
          { nom: "Paire de falax", cout: 0 },
          { nom: "Fouet barbelé", cout: 0 },
        ],
      },
    ],
    legion: "XII",
  },

  /* ----------------------------------------------------------
     UNITÉS RÉSERVÉES À LA XVIIIe LÉGION (SALAMANDERS)
     ---------------------------------------------------------- */
  {
    id: "vulkan",
    nom: "Vulkan",
    categorie: "Seigneur de Guerre",
    cout: 465,
    composition: "1 Vulkan",
    notes:
      "Le Primarque des Salamanders, le Feu Prométhéen, Le Marteau du Salut, Régent de Nocturne.",
    traits: ["Loyaliste", "Salamanders", "Maître de la Légion"],
    equipement: [
      "Le Cœur du Fourneau",
      "Gantelet Souffle de Dragon",
      "Amène-l'Aube",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Vulkan",
        cout: 0,
        profil: {
          M: 7,
          CC: 7,
          CT: 6,
          F: 7,
          E: 7,
          PV: 7,
          I: 5,
          A: 6,
          Cd: 12,
          Sf: 10,
          Vo: 10,
          Int: 10,
          Sv: "2+",
          Inv: "4+",
        },
        regles: [
          "Sire des Salamanders",
          "Massif (5)",
          "Le Feu Inextinguible",
          "Guerrier Éternel (3)",
        ],
        type: "Parangon (Unique)",
      },
    ],
    options: [],
    legion: "XVIII",
  },
  {
    id: "escouade-pyroclaste",
    nom: "Escouade Pyroclaste",
    categorie: "Assaut Lourd",
    cout: 175,
    composition: "1 Gardien Pyroclaste, 4 Pyroclastes",
    effectif: { base: 5, max: 10, cout: 30 },
    traits: ["[Allégeance]", "Salamanders"],
    equipement: [
      "Projecteur à flammes Pyroclaste — Dispersé",
      "Projecteur à flammes Pyroclaste — Focalisé",
      "Écaille de Drac",
      "Pistolet bolter",
      "Bombes à fusion",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Escouade Pyroclaste",
        cout: 0,
        profils: [
          {
            nom: "Pyroclaste",
            profil: {
              M: 7,
              CC: 4,
              CT: 4,
              F: 4,
              E: 4,
              PV: 2,
              I: 4,
              A: 1,
              Cd: 8,
              Sf: 8,
              Vo: 8,
              Int: 8,
              Sv: "2+",
              Inv: "6+",
            },
          },
          {
            nom: "Gardien Pyroclaste",
            profil: {
              M: 7,
              CC: 4,
              CT: 4,
              F: 4,
              E: 4,
              PV: 2,
              I: 4,
              A: 2,
              Cd: 9,
              Sf: 8,
              Vo: 8,
              Int: 8,
              Sv: "2+",
              Inv: "6+",
            },
          },
        ],
        regles: ["Avance Implacable"],
        type: "Gardien Pyroclaste : Infanterie (Sergent) · Pyroclaste : Infanterie",
      },
    ],
    options: [
      {
        type: "choix",
        id: "gardien-arme",
        libelle:
          "Le Gardien Pyroclaste peut être doté d'une arme énergétique, d'un gantelet énergétique ou d'un Marteau Thunder",
        ajoute: true,
        prefixeFiche: "Gardien Pyroclaste : ",
        choix: [
          { nom: "— Aucune option —", cout: 0 },
          { nom: "Arme énergétique", cout: 10 },
          { nom: "Gantelet énergétique", cout: 20 },
          { nom: "Marteau Thunder", cout: 25 },
        ],
      },
    ],
    legion: "XVIII",
  },
  {
    id: "escouade-terminator-pyrodracs",
    nom: "Escouade Terminator Pyrodracs",
    categorie: "Elite",
    cout: 250,
    composition: "1 Maître Pyrodrac, 4 Pyrodracs",
    effectif: { base: 5, max: 10, cout: 45 },
    traits: ["[Allégeance]", "Salamanders", "Bouclier"],
    equipement: ["Marteau Thunder forgé", "Écaille de Drac"],
    variantes: [
      {
        nom: "Escouade Terminator Pyrodracs",
        cout: 0,
        profils: [
          {
            nom: "Pyrodrac",
            profil: {
              M: 6,
              CC: 5,
              CT: 4,
              F: 4,
              E: 5,
              PV: 2,
              I: 4,
              A: 2,
              Cd: 9,
              Sf: 8,
              Vo: 8,
              Int: 8,
              Sv: "2+",
              Inv: "4+",
            },
          },
          {
            nom: "Maître Pyrodrac",
            profil: {
              M: 6,
              CC: 5,
              CT: 4,
              F: 4,
              E: 5,
              PV: 2,
              I: 4,
              A: 2,
              Cd: 9,
              Sf: 8,
              Vo: 8,
              Int: 8,
              Sv: "2+",
              Inv: "4+",
            },
          },
        ],
        regles: [
          "Massif (2)",
          "Avance Implacable",
          "Lent et Méthodique",
          "Avant-garde (4)",
        ],
        type: "Maître Pyrodrac : Infanterie (Sergent, Lourd) · Pyrodrac : Infanterie (Lourd)",
      },
    ],
    options: [],
    legion: "XVIII",
  },

  /* ----------------------------------------------------------
     UNITÉS RÉSERVÉES À LA IIIe LÉGION (EMPEROR'S CHILDREN)
     ---------------------------------------------------------- */
  {
    id: "seigneur-commandant-eidolon",
    nom: "Seigneur Commandant Eidolon",
    categorie: "Quartier Général",
    cout: 215,
    composition: "1 Seigneur Commandant Eidolon",
    notes:
      "Le Marteau Aurique, l'Exemplaire, Seigneur Commandant Primus des Emperor's Children.",
    traits: ["Renégat", "Emperor's Children", "Maître de la Légion"],
    equipement: [
      "Gloria Aeterna",
      "Pistolet archéotech",
      "Hurleurs soniques",
      "Cri Mortel",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Seigneur Commandant Eidolon",
        cout: 0,
        profil: {
          M: 12,
          CC: 6,
          CT: 5,
          F: 4,
          E: 4,
          PV: 4,
          I: 5,
          A: 5,
          Cd: 10,
          Sf: 9,
          Vo: 9,
          Int: 9,
          Sv: "2+",
          Inv: "4+",
        },
        regles: ["Impact (A)", "Massif (2)", "Frappe en Profondeur"],
        type: "Infanterie (Unique, État-major, Antigrav)",
      },
    ],
    options: [],
    legion: "III",
  },
  {
    id: "capitaine-lucius",
    nom: "Capitaine Lucius",
    categorie: "État-major",
    cout: 215,
    composition: "1 Capitaine Lucius",
    notes: "La Lame Exemplaire, Capitaine de la 13e Compagnie.",
    traits: ["Renégat", "Emperor's Children"],
    equipement: ["Lames de Lucius", "Pistolet bolter", "Grenades Frag", "Grenades Krak"],
    variantes: [
      {
        nom: "Capitaine Lucius",
        cout: 0,
        profil: {
          M: 7,
          CC: 7,
          CT: 5,
          F: 4,
          E: 4,
          PV: 3,
          I: 6,
          A: 5,
          Cd: 9,
          Sf: 8,
          Vo: 8,
          Int: 7,
          Sv: "2+",
          Inv: "4+",
        },
        regles: ["La Lame Exemplaire"],
        type: "Infanterie (Unique, État-major)",
      },
    ],
    options: [
      {
        type: "case",
        id: "hurleurs-soniques",
        libelle: "Cette Figurine peut être dotée de hurleurs soniques",
        cout: 15,
        ajoute: "Hurleurs soniques",
      },
    ],
    legion: "III",
  },
  {
    id: "escouade-terminator-phenix",
    nom: "Escouade Terminator Phénix",
    categorie: "Suites",
    cout: 200,
    composition: "1 Champion Phénix, 4 Terminators Phénix",
    effectif: { base: 5, max: 10, cout: 35 },
    traits: ["[Allégeance]", "Emperor's Children"],
    equipement: ["Lance énergétique Phénix"],
    variantes: [
      {
        nom: "Escouade Terminator Phénix",
        cout: 0,
        profils: [
          {
            nom: "Terminator Phénix",
            profil: {
              M: 7,
              CC: 5,
              CT: 4,
              F: 4,
              E: 5,
              PV: 2,
              I: 4,
              A: 2,
              Cd: 8,
              Sf: 8,
              Vo: 7,
              Int: 7,
              Sv: "2+",
              Inv: "5+",
            },
          },
          {
            nom: "Champion Phénix",
            profil: {
              M: 7,
              CC: 5,
              CT: 4,
              F: 4,
              E: 5,
              PV: 2,
              I: 4,
              A: 3,
              Cd: 9,
              Sf: 9,
              Vo: 7,
              Int: 7,
              Sv: "2+",
              Inv: "5+",
            },
          },
        ],
        regles: ["Massif (2)", "Adresse Inégalée"],
        type: "Champion Phénix : Infanterie (Champion, Sergent) · Terminator Phénix : Infanterie",
      },
    ],
    options: [
      {
        type: "choix",
        id: "arme-sonique",
        libelle:
          "Si toutes les Figurines de cette Unité ont le Trait Renégat, toute l'unité peut être dotée du même objet (Hurleurs soniques ou Lance sonique)",
        ajoute: true,
        parFigurine: true,
        choix: [
          { nom: "— Aucun —", cout: 0 },
          { nom: "Hurleurs soniques", cout: 5 },
          { nom: "Lance sonique", cout: 5 },
        ],
      },
    ],
    legion: "III",
  },

  /* ----------------------------------------------------------
     UNITÉS RÉSERVÉES À LA VIIe LÉGION (IMPERIAL FISTS)
     ---------------------------------------------------------- */
  {
    id: "rogal-dorn",
    nom: "Rogal Dorn",
    categorie: "Seigneur de Guerre",
    cout: 435,
    composition: "1 Rogal Dorn",
    notes:
      "Primarque des Imperial Fists, Le Vigilant, La Lame de l'Empereur, Prétorien de Terra, L'Inflexible.",
    traits: ["Loyaliste", "Imperial Fists", "Maître de la Légion"],
    equipement: [
      "Dents de la Tempête",
      "La Voix de Terra",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Rogal Dorn",
        cout: 0,
        profil: {
          M: 8,
          CC: 7,
          CT: 6,
          F: 6,
          E: 6,
          PV: 6,
          I: 6,
          A: 6,
          Cd: 12,
          Sf: 10,
          Vo: 10,
          Int: 10,
          Sv: "2+",
          Inv: "4+",
        },
        regles: [
          "Sire des Imperial Fists",
          "Massif (4)",
          "Rempart de l'Imperium",
          "Guerrier Éternel (2)",
        ],
        type: "Parangon (Unique)",
      },
    ],
    options: [],
    legion: "VII",
  },
  {
    id: "sigismund",
    nom: "Sigismund",
    categorie: "Quartier Général",
    cout: 250,
    composition: "1 Sigismund",
    notes:
      "1er Capitaine des Imperial Fists, Champion Martial de Rogal Dorn, Fléau des Rois, Le Maître des Templiers.",
    traits: ["Loyaliste", "Imperial Fists", "Maître de la Légion"],
    equipement: [
      "L'Épée Noire",
      "Pistolet bolter",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Sigismund",
        cout: 0,
        profil: {
          M: 7,
          CC: 7,
          CT: 4,
          F: 4,
          E: 4,
          PV: 4,
          I: 5,
          A: 5,
          Cd: 10,
          Sf: 9,
          Vo: 9,
          Int: 9,
          Sv: "2+",
          Inv: "4+",
        },
        regles: [
          "Précision (4+)",
          "Tueur de Rois",
          "Champion de la Mort",
          "Guerrier Éternel (1)",
        ],
        type: "Infanterie (Unique, État-major)",
      },
    ],
    options: [],
    legion: "VII",
  },
  {
    id: "fafnir-rann",
    nom: "Fafnir Rann",
    categorie: "Quartier Général",
    cout: 175,
    composition: "1 Fafnir Rann",
    notes: "Seigneur Sénéchal, Commandant du Persephone, Capitaine du Premier Cadre d'Assaut.",
    traits: ["Loyaliste", "Imperial Fists", "Maître de la Légion", "Bouclier"],
    equipement: [
      "Le Bourreau et le Chasseur",
      "Pistolet bolter",
      "Grenades Frag",
      "Grenades Krak",
      "Bouclier d'abordage",
    ],
    variantes: [
      {
        nom: "Fafnir Rann",
        cout: 0,
        profil: {
          M: 7,
          CC: 6,
          CT: 4,
          F: 4,
          E: 4,
          PV: 4,
          I: 5,
          A: 4,
          Cd: 9,
          Sf: 8,
          Vo: 8,
          Int: 8,
          Sv: "2+",
          Inv: "4+",
        },
        regles: ["Impact (A)", "Maître du Bouclier", "L'Impôt du Bourreau"],
        type: "Infanterie (Unique, État-major)",
      },
    ],
    options: [],
    legion: "VII",
  },
  {
    id: "evander-garrius",
    nom: "Evander Garrius",
    categorie: "Quartier Général",
    cout: 215,
    composition: "1 Evander Garrius",
    notes: "Capitaine de la 456e Compagnie des Imperial Fists, Le Tyran de Cthonia.",
    traits: ["Loyaliste", "Imperial Fists", "Maître de la Légion"],
    equipement: ["Subjugator", "Incineratus", "Les Atours du Tyran"],
    variantes: [
      {
        nom: "Evander Garrius",
        cout: 0,
        profil: {
          M: 6,
          CC: 6,
          CT: 5,
          F: 4,
          E: 5,
          PV: 4,
          I: 5,
          A: 4,
          Cd: 10,
          Sf: 9,
          Vo: 9,
          Int: 9,
          Sv: "2+",
          Inv: "4+",
        },
        regles: ["Massif (2)", "Avance Implacable", "Lent et Méthodique"],
        type: "Infanterie (Unique, État-major, Lourd)",
      },
    ],
    options: [],
    legion: "VII",
  },
  {
    id: "camba-diaz",
    nom: "Camba Diaz",
    categorie: "État-major",
    cout: 120,
    composition: "1 Camba Diaz",
    notes: "Sauveur du Gyre Hurlant, Capitaine de la 50e Compagnie.",
    traits: ["Loyaliste", "Imperial Fists", "Maître de la Légion"],
    equipement: ["Durenda", "Pistolet bolter", "Grenades Frag", "Grenades Krak"],
    variantes: [
      {
        nom: "Camba Diaz",
        cout: 0,
        profil: {
          M: 7,
          CC: 6,
          CT: 5,
          F: 4,
          E: 4,
          PV: 3,
          I: 5,
          A: 3,
          Cd: 9,
          Sf: 8,
          Vo: 8,
          Int: 8,
          Sv: "2+",
          Inv: "4+",
        },
        regles: ["Officier de Ligne (2)", "La Ligne Intacte"],
        type: "Infanterie (Unique, État-major)",
      },
    ],
    options: [],
    legion: "VII",
  },
  {
    id: "alexis-polux",
    nom: "Alexis Polux",
    categorie: "État-major",
    cout: 185,
    composition: "1 Alexis Polux",
    notes: "Capitaine de la 405e Compagnie des Imperial Fists, Le Poing Écarlate.",
    traits: ["Loyaliste", "Imperial Fists", "Bouclier"],
    equipement: [
      "Gantelet énergétique Solarite",
      "Bouclier Storm modèle Vigil",
      "Combi-fuseur",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Alexis Polux",
        cout: 0,
        profil: {
          M: 7,
          CC: 6,
          CT: 4,
          F: 4,
          E: 4,
          PV: 3,
          I: 5,
          A: 3,
          Cd: 9,
          Sf: 9,
          Vo: 8,
          Int: 8,
          Sv: "2+",
          Inv: "4+",
        },
        regles: [
          "Officier de Ligne (2)",
          "Frappe en Profondeur",
          "Coup de Marteau",
          "Commandant Spatial",
        ],
        type: "Infanterie (Unique, État-major, Lourd)",
      },
    ],
    options: [],
    legion: "VII",
  },
  {
    id: "freres-templiers",
    nom: "Frères Templiers",
    categorie: "Elite",
    cout: 160,
    composition: "1 Champion Templier, 4 Frères Templiers",
    effectif: { base: 5, max: 10, cout: 27 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "Imperial Fists"],
    notes:
      "Gardiens du Temple des Serments à bord du Phalanx, les Templiers sont l'élite de la VIIe Légion.",
    equipement: [
      "Épée énergétique",
      "Pistolet bolter",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Frères Templiers",
        cout: 0,
        profils: [
          {
            nom: "Frère Templier",
            profil: {
              M: 7,
              CC: 5,
              CT: 4,
              F: 4,
              E: 4,
              PV: 2,
              I: 4,
              A: 3,
              Cd: 8,
              Sf: 8,
              Vo: 8,
              Int: 8,
              Sv: "2+",
              Inv: "—",
            },
          },
          {
            nom: "Champion Templier",
            profil: {
              M: 7,
              CC: 5,
              CT: 4,
              F: 4,
              E: 4,
              PV: 2,
              I: 4,
              A: 3,
              Cd: 9,
              Sf: 8,
              Vo: 8,
              Int: 8,
              Sv: "2+",
              Inv: "—",
            },
          },
        ],
        regles: ["Assaut Templier"],
        type: "Champion Templier : Infanterie (Champion, Sergent) · Frère Templier : Infanterie",
      },
    ],
    options: [
      {
        type: "choix",
        id: "champion-arme",
        libelle: "Champion Templier : échanger son épée énergétique",
        remplace: "Épée énergétique",
        prefixeFiche: "Champion Templier : ",
        choix: [
          { nom: "— Conserver l'épée énergétique —", cout: 0 },
          { nom: "Gantelet énergétique Solarite", cout: 15 },
          { nom: "Marteau Thunder", cout: 15 },
        ],
      },
      {
        type: "choix",
        id: "champion-pistolet",
        libelle: "Champion Templier : échanger son pistolet bolter",
        remplace: "Pistolet bolter",
        prefixeFiche: "Champion Templier : ",
        choix: [
          { nom: "— Conserver le pistolet bolter —", cout: 0 },
          { nom: "Pistolet archéotech", cout: 5 },
        ],
      },
      {
        type: "choix",
        id: "bouclier-combat",
        libelle: "Toute Figurine : échanger son pistolet bolter contre un bouclier de combat",
        ajoute: true,
        parFigurine: true,
        prefixeFiche: "Toute l'unité : ",
        choix: [
          { nom: "— Conserver le pistolet bolter —", cout: 0 },
          { nom: "Bouclier de combat (à la place du pistolet bolter)", cout: 2 },
        ],
      },
      {
        type: "choix",
        id: "pistolet-plasma",
        libelle: "Toute Figurine : échanger son pistolet bolter contre un pistolet à plasma",
        ajoute: true,
        parFigurine: true,
        prefixeFiche: "Toute l'unité : ",
        choix: [
          { nom: "— Conserver le pistolet bolter —", cout: 0 },
          { nom: "Pistolet à plasma (à la place du pistolet bolter)", cout: 10 },
        ],
      },
      {
        type: "choix",
        id: "equipement-legion-1",
        libelle: "Équipement de Légion (1er Frère Templier, deux max dans l'unité)",
        ajoute: true,
        prefixeFiche: "Frère Templier : ",
        choix: [
          { nom: "— Aucun —", cout: 0 },
          { nom: "Nuncio-vox", cout: 10 },
          { nom: "Scanner augure", cout: 10 },
        ],
      },
      {
        type: "choix",
        id: "equipement-legion-2",
        libelle: "Équipement de Légion (2e Frère Templier)",
        ajoute: true,
        prefixeFiche: "Frère Templier : ",
        choix: [
          { nom: "— Aucun —", cout: 0 },
          { nom: "Nuncio-vox", cout: 10 },
          { nom: "Scanner augure", cout: 10 },
        ],
      },
      {
        type: "case",
        id: "vexillum",
        libelle: "Un Frère Templier : vexillum",
        cout: 10,
        ajoute: "Vexillum (un Frère Templier)",
      },
      {
        type: "case",
        id: "bombes-fusion-unite",
        libelle: "Toutes les Figurines : bombes à fusion",
        cout: 25,
        ajoute: "Bombes à fusion (toute l'unité)",
      },
    ],
    legion: "VII",
  },
  {
    id: "gardiens-du-phalanx",
    nom: "Escouade de Gardiens du Phalanx",
    categorie: "Assaut Lourd",
    cout: 200,
    composition: "1 Sergent Gardien, 9 Gardiens du Phalanx",
    effectif: { base: 10, max: 20, cout: 18 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "Imperial Fists", "Bouclier"],
    notes:
      "Choisis dans les rangs des escouades de Brécheurs des Imperial Fists, assignée à la défense du vaisseau amiral de la Légion.",
    equipement: [
      "Hache énergétique",
      "Pistolet bolter",
      "Bouclier d'abordage",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Escouade de Gardiens du Phalanx",
        cout: 0,
        profils: [
          {
            nom: "Gardien du Phalanx",
            profil: {
              M: 7,
              CC: 4,
              CT: 4,
              F: 4,
              E: 4,
              PV: 1,
              I: 4,
              A: 2,
              Cd: 7,
              Sf: 7,
              Vo: 7,
              Int: 7,
              Sv: "3+",
              Inv: "5+",
            },
          },
          {
            nom: "Sergent Gardien",
            profil: {
              M: 7,
              CC: 4,
              CT: 4,
              F: 4,
              E: 4,
              PV: 1,
              I: 4,
              A: 2,
              Cd: 8,
              Sf: 8,
              Vo: 7,
              Int: 7,
              Sv: "3+",
              Inv: "5+",
            },
          },
        ],
        regles: ["Formation en Phalange"],
        type: "Sergent Gardien : Infanterie (Sergent, Lourd) · Gardien du Phalanx : Infanterie (Lourd)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "sergent-pistolet",
        libelle: "Sergent Gardien : échanger son pistolet bolter contre un pistolet à plasma",
        remplace: "Pistolet bolter",
        prefixeFiche: "Sergent Gardien : ",
        choix: [
          { nom: "— Conserver le pistolet bolter —", cout: 0 },
          { nom: "Pistolet à plasma", cout: 10 },
        ],
      },
      {
        type: "choix",
        id: "sergent-arme",
        libelle: "Sergent Gardien : échanger sa hache énergétique",
        remplace: "Hache énergétique",
        prefixeFiche: "Sergent Gardien : ",
        choix: [
          { nom: "— Conserver la hache énergétique —", cout: 0 },
          { nom: "Marteau Thunder", cout: 10 },
          { nom: "Gantelet énergétique Solarite", cout: 10 },
        ],
      },
      {
        type: "choix",
        id: "equipement-legion-1",
        libelle: "Équipement de Légion (1er Gardien du Phalanx, deux max dans l'unité)",
        ajoute: true,
        prefixeFiche: "Gardien du Phalanx : ",
        choix: [
          { nom: "— Aucun —", cout: 0 },
          { nom: "Nuncio-vox", cout: 10 },
          { nom: "Scanner augure", cout: 10 },
        ],
      },
      {
        type: "choix",
        id: "equipement-legion-2",
        libelle: "Équipement de Légion (2e Gardien du Phalanx)",
        ajoute: true,
        prefixeFiche: "Gardien du Phalanx : ",
        choix: [
          { nom: "— Aucun —", cout: 0 },
          { nom: "Nuncio-vox", cout: 10 },
          { nom: "Scanner augure", cout: 10 },
        ],
      },
      {
        type: "case",
        id: "vexillum",
        libelle: "Un Gardien du Phalanx : vexillum",
        cout: 10,
        ajoute: "Vexillum (un Gardien du Phalanx)",
      },
      {
        type: "case",
        id: "bombes-fusion-unite",
        libelle: "Toutes les Figurines : bombes à fusion",
        cout: 25,
        ajoute: "Bombes à fusion (toute l'unité)",
      },
    ],
    legion: "VII",
  },
];
