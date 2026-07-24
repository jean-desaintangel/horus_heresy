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
   Un profil de Véhicule de Sous-type Chevalier (livre d'armée Chevaliers
   Questoris) : `profilChevalier` sur la variante, { M, CC, CT, F,
   avant, arriere, I, A, PC } — CC/F/I/A en plus du profil de véhicule
   standard, mais seulement deux Faces de Blindage (Avant/Arrière, pas
   de Flanc ni de Capacité de Transport), voir ENTETES_CHEVALIER et
   construireTableProfil dans js/unites.js ainsi que pages/vehicule.html
   #sous-types (règles du Sous-type Chevalier).
   Un profil de Titan (Legio Titanicus) : `profilsVehicule` sur la
   variante, tableau de { nom, M, CT, principal, expose, PC, transport }
   — une ligne par Profil de Titan (Tête, Carapace, Bras, Jambes…),
   chacune avec son propre Blindage Principal/Exposé (voir
   ENTETES_TITAN et construireTableProfil dans js/unites.js). À ne
   pas confondre avec `profilVehicule` (singulier, une seule ligne
   Avant/Flanc/Arrière) ni `profils` (pluriel, lignes de profil
   d'infanterie nommées, ex : Légionnaire/Sergent).
   Champ `ctParEquipage` (facultatif, sur un Profil de `profilsVehicule`
   uniquement) : tableau [Minoris, Senioris, Majoris] de la CT de ce
   Profil selon l'Équipage choisi par l'option "choix" obligatoire
   d'id "equipage" (indice 0/1/2 = Minoris/Senioris/Majoris) — la
   table de profil affichée par js/unites.js (construireTableProfil)
   lit `instance.valeurs.equipage` pour choisir la bonne CT en temps
   réel. Un Profil sans CT (Tête, Jambes) n'a pas ce champ.

   Champ `faction` (facultatif) : réserve l'unité à une Faction du menu
   « Faction » (js/organigramme.js, FACTIONS) autre que Legio Astartes,
   ex : "legio-titanicus". Sans ce champ, une unité reste réservée à
   Legio Astartes (comportement historique de ce fichier). Consommé
   par js/unites.js (uniteAccessible).

   Types d'options :
   - "choix" : menu déroulant. `remplace` = équipement retiré quand
     un choix (autre que « conserver ») est sélectionné. Chaque choix
     = { nom, cout } (+ éventuellement `remplace` propre au choix).
     `ajoute: true` = le choix s'ajoute sans rien remplacer.
   - "case"  : case à cocher simple. { cout, ajoute }. `ajoute` peut
     être un tableau (plusieurs objets/Règles Spéciales accordés à la
     fois, ex : Décurion Locus — scanner augure + Frappe Localisée).
   - "paire" : case à cocher qui remplace PLUSIEURS équipements
     à la fois (ex : paire de griffes Lightning). { cout, ajoute,
     remplaceListe: [...] }.
   - "multi" : plusieurs cases à cocher, limitées à `max` choix
     (ex : Disciplines Psychiques de l'Archiviste).
   Champs communs facultatifs :
   - variantesExclues : indices de variantes qui n'ont PAS accès
     à l'option (ex : cyber-familier interdit aux Réacteurs).
   - desactiveSiOptionActive : id d'une autre option de la même
     unité (ou TABLEAU d'id) qui, une fois active, verrouille
     complètement celle-ci — aucune contribution à l'équipement ni au
     coût, champ grisé et remis à zéro (voir optionPermise dans
     js/unites.js). Sert aux options qui s'excluent mutuellement au
     sein d'une même unité (ex : Titan Warlord, la Griffe énergétique
     Arioch avec Méga-bolter Vulcan occupe à elle seule les deux
     emplacements d'Arme de Bras et verrouille donc les deux choix
     normaux ; forme tableau utilisée par les 4 améliorations de
     Décurion de Légion, mutuellement exclusives entre elles — voir
     optionsDecurionLegion plus bas).
   - requiertLegion : id LEGIONS (js/organigramme.js) réservant
     l'option à cette Légion (ou une Légion Alliée) — ex : Décurion
     Sagittar (VII, Imperial Fists) et Lanius (XVI, Sons of Horus).
   - requiertEquipUnDe : tableau d'objets, généralise `requiertEquip`
     (js/unites.js, optionRealisable) à un « OU » — l'option exige la
     présence d'AU MOINS UN des objets listés dans l'équipement final
     (ex : Décurion sur Sicaran, ouvert seulement à l'autocanon
     accélérateur jumelé de base ou au canon rotatif Punisher).
   - requiertPivotArme / interditPivotArme : conditionnent l'option à
     la présence (hors Lanceur Havoc sur Pivot) ou à l'absence d'une
     Arme sur Pivot déjà choisie via l'option "pivot" de la même unité
     (optionPivotLegion ci-dessous) — voir armeSurPivotChoisie dans
     js/unites.js. Décurion Defensor exige une Arme sur Pivot ;
     Sagittar et Lanius exigent l'absence de toute Arme sur Pivot (ils
     en accordent une propre à l'amélioration).
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

// Variante « toute l'unité » de l'option ci-dessus (une seule case à
// cocher pour toutes les Figurines, coût forfaitaire).
function optionBombesFusionUnite() {
  return {
    type: "case",
    id: "bombes-fusion-unite",
    libelle: "Toutes les Figurines : bombes à fusion",
    cout: 25,
    ajoute: "Bombes à fusion (toute l'unité)",
  };
}

// Option récurrente : baïonnette (uniquement si l'arme donnée est
// conservée — "Bolter" par défaut, ex : "Bolter Kraken" pour les
// unités qui en sont équipées à la place).
function optionBaionnette(arme = "Bolter") {
  const armeMinuscule = arme.charAt(0).toLowerCase() + arme.slice(1);
  return {
    type: "choix",
    id: "baionnette",
    libelle:
      "Baïonnette (uniquement si la Figurine a un " + armeMinuscule + ")",
    requiertEquip: arme,
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
// Cerberus. `verrouillePar` (facultatif) : id d'option (ou tableau)
// qui verrouille ce choix quand elle est active — sert aux Décurion
// Sagittar/Lanius (Predator, Sicaran, Kratos), qui accordent leur
// propre Arme sur Pivot et rendent donc ce choix générique redondant
// une fois sélectionnés (voir optionsDecurionLegion ci-dessous).
function optionPivotLegion(verrouillePar) {
  return {
    type: "choix",
    id: "pivot",
    libelle: "Objet de la liste des Armes sur Pivot de Légion",
    ajoute: true,
    choix: [
      { nom: "— Aucun —", cout: 0 },
      ...depuisListes(LISTES_EQUIPEMENT.pivot),
    ],
    ...(verrouillePar ? { desactiveSiOptionActive: verrouillePar } : {}),
  };
}

function optionsVehiculeSuperLourdPivot() {
  return [optionPivotLegion(), ...optionsMissileEtProjecteurs()];
}

/* Améliorations de Décurion de Légion (livre d'armée, add-on récent) :
   Décurion Defensor, Locus, Sagittar (réservé au Trait Imperial
   Fists) et Décurion Lanius (réservé au Trait Sons of Horus).
   Sélectionnables pour Predator, Sicaran et Char d'Assaut Kratos —
   voir leurs fiches plus bas. Mutuellement exclusives (une seule par
   Figurine, livre d'armée) via desactiveSiOptionActive croisé. Sur
   Sicaran, `sicaran: true` restreint l'amélioration aux Figurines
   ayant conservé l'autocanon accélérateur jumelé de base OU choisi le
   canon rotatif Punisher (requiertEquipUnDe), comme précisé par le
   livre — sans effet sur Predator/Kratos. Coûts en Points : voir
   REGLES_DIVERSES (js/regles-data.js) pour le texte des Règles
   Spéciales accordées, et pages/unites.html #decurion pour le détail
   complet des 4 améliorations. */
function optionsDecurionLegion({ defensor, locus, sagittar, lanius, sicaran }) {
  const idsDecurion = [
    "decurion-defensor",
    "decurion-locus",
    "decurion-sagittar",
    "decurion-lanius",
  ];
  const autres = (id) => idsDecurion.filter((autre) => autre !== id);
  const restrictionSicaran = sicaran
    ? {
        requiertEquipUnDe: [
          "Autocanon accélérateur jumelé",
          "Canon rotatif Punisher",
        ],
      }
    : {};
  return [
    {
      type: "case",
      id: "decurion-defensor",
      libelle:
        "Décurion Defensor (+" +
        defensor +
        " pts, requiert une Arme sur Pivot autre qu'un Lanceur Havoc sur Pivot)",
      cout: defensor,
      ajoute: ["Décurion Defensor", "Défense de Point"],
      requiertPivotArme: true,
      desactiveSiOptionActive: autres("decurion-defensor"),
      ...restrictionSicaran,
    },
    {
      type: "case",
      id: "decurion-locus",
      libelle: "Décurion Locus (+" + locus + " pts)",
      cout: locus,
      ajoute: ["Décurion Locus", "Scanner augure", "Frappe Localisée"],
      desactiveSiOptionActive: autres("decurion-locus"),
      ...restrictionSicaran,
    },
    {
      type: "case",
      id: "decurion-sagittar",
      libelle:
        "Décurion Sagittar (+" +
        sagittar +
        " pts, réservé au Trait Imperial Fists, requiert l'absence de toute Arme sur Pivot)",
      cout: sagittar,
      ajoute: [
        "Décurion Sagittar",
        "Canon d'assaut Iliastus sur Pivot",
        "Scanner augure",
      ],
      requiertLegion: "VII",
      interditPivotArme: true,
      desactiveSiOptionActive: autres("decurion-sagittar"),
      ...restrictionSicaran,
    },
    {
      type: "case",
      id: "decurion-lanius",
      libelle:
        "Décurion Lanius (+" +
        lanius +
        " pts, réservé au Trait Sons of Horus, requiert l'absence de toute Arme sur Pivot)",
      cout: lanius,
      ajoute: [
        "Décurion Lanius",
        "Canon à bolts Banestrike sur Pivot",
        "Mise au Pas Brutal",
      ],
      requiertLegion: "XVI",
      interditPivotArme: true,
      desactiveSiOptionActive: autres("decurion-lanius"),
      ...restrictionSicaran,
    },
  ];
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

/* Arcane de Prospero (livre d'armée Thousand Sons, XVe Légion) :
   option partagée par le Sorcier de Prospero et la Cabale de
   Terminators Sekhmet (voir leurs sections plus bas) — les deux seules
   Unités éligibles parmi celles transcrites (Magnus/Ahriman/Amon sont
   de Sous-type Unique, le Castellax-Achea est un Automate, et la
   Cabale du Khenetai Occulte a déjà son propre Arcane fixe via ses
   Règles Spéciales). Coût volontairement SANS `parFigurine` : +10
   Points par UNITÉ (pas par Figurine), comme indiqué dans le livre
   d'armée. Voir js/regles-data.js pour le détail de chaque Arcane.
   ---------------------------------------------------------- */
const ARCANE_DE_PROSPERO = {
  type: "choix",
  id: "arcane-prospero",
  libelle: "Arcane de Prospero",
  ajoute: true,
  choix: [
    { nom: "— Aucun Arcane de Prospero —", cout: 0 },
    { nom: "Raptora", cout: 10 },
    { nom: "Pyrae", cout: 10 },
    { nom: "Pavoni", cout: 10 },
    { nom: "Corvidae", cout: 10 },
    { nom: "Athanéen", cout: 10 },
  ],
};

// Options communes aux Unités qui ont le Trait de Faction remplaçable
// « [Mechanicum] » (Techno-arcane Majeur, un choix possible par Unité
// — Liber Mechanicum p. 13). Déclarée hors du littéral UNITES (un
// littéral de tableau ne peut contenir que des expressions, pas une
// déclaration de fonction).
const optionTechnoArcane = () => ({
  type: "choix",
  id: "techno-arcane",
  libelle: "Techno-arcane Majeur (Trait de Faction)",
  remplace: "[Mechanicum]",
  choix: [
    { nom: "Archimandrite", cout: 0 },
    { nom: "Cybernetica", cout: 0 },
    { nom: "Lacrymaerta", cout: 0 },
    { nom: "Myrmidax", cout: 0 },
    { nom: "Malagra", cout: 0 },
    { nom: "Macrotek", cout: 0 },
    { nom: "Reductor", cout: 0 },
  ],
});

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
    id: "champion-monte",
    nom: "Champion sur Scimitar",
    legacy: true,
    categorie: "État-major",
    cout: 145,
    composition: "1 Champion de Légion Motard",
    traits: ["[Allégeance]", "[Legiones Astartes]"],
    notes:
      "Où de nombreux Champions de Légion se retrouvent au cœur de la mêlée, parmi les masses de fantassins, certains préfèrent la mobilité qu'offrent motos et motojets pour les porter de combat en combat : si un tel moyen de transport rend peu praticables les préoccupations stratégiques habituelles du champ de bataille, il leur offre en retour la liberté de choisir leurs adversaires à volonté. Cette Unité compte comme une Unité de Champion de Légion pour la sélection du Détachement Auxiliaire Cadre de Vétérans.",
    equipement: [
      "Bolter jumelé (Champion de Légion Motard uniquement)",
      "Bolter lourd (Champion de Légion sur Motojet Scimitar uniquement)",
      "Serpentine volkite",
      "Lame de parangon",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Champion de Légion Motard",
        cout: 0,
        profil: {
          M: 14,
          CC: 6,
          CT: 5,
          F: 4,
          E: 4,
          PV: 4,
          I: 5,
          A: 5,
          Cd: 8,
          Sf: 8,
          Vo: 8,
          Int: 7,
          Sv: "2+",
          Inv: "5+",
        },
        regles: [
          "Massif (2)",
          "Tempête de Feu",
          "Avance Implacable",
          "Attaque de Flanc",
          "Ne Jamais Céder",
        ],
        type: "Cavalerie (État-major)",
      },
      {
        nom: "Champion de Légion sur Motojet Scimitar",
        cout: 10,
        profil: {
          M: 16,
          CC: 6,
          CT: 5,
          F: 4,
          E: 4,
          PV: 4,
          I: 5,
          A: 5,
          Cd: 8,
          Sf: 8,
          Vo: 8,
          Int: 8,
          Sv: "2+",
          Inv: "5+",
        },
        regles: ["Massif (3)", "Frappe en Profondeur", "Ne Jamais Céder"],
        type: "Cavalerie (État-major, Antigrav)",
      },
    ],
    options: [
      optionBombesFusion(),
      {
        type: "choix",
        id: "bolter-jumele",
        libelle: "Champion de Légion Motard : remplacer son bolter jumelé",
        // Doit correspondre EXACTEMENT à l'entrée de `equipement`
        // ci-dessus (equipementFinal/optionRealisable comparent par
        // égalité stricte, contrairement à `requiertEquip`) : la
        // précision entre parenthèses fait donc partie de la chaîne.
        remplace: "Bolter jumelé (Champion de Légion Motard uniquement)",
        variantesExclues: [1],
        choix: [
          { nom: "— Conserver le bolter jumelé —", cout: 0 },
          { nom: "Fusil à plasma jumelé", cout: 15 },
        ],
      },
      {
        type: "choix",
        id: "bolter-lourd",
        libelle:
          "Champion de Légion sur Motojet Scimitar : remplacer son bolter lourd",
        remplace:
          "Bolter lourd (Champion de Légion sur Motojet Scimitar uniquement)",
        variantesExclues: [0],
        choix: [
          { nom: "— Conserver le bolter lourd —", cout: 0 },
          { nom: "Couleuvrine volkite", cout: 10 },
          { nom: "Canon à plasma", cout: 15 },
          { nom: "Multi-fuseur", cout: 20 },
        ],
      },
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
     UNITÉ RÉSERVÉE À LA IXe LÉGION (BLOOD ANGELS)
     Voir la note sur Raldoron, catégorie Quartier Général ci-dessus.
     ---------------------------------------------------------- */
  {
    id: "garde-sanguinienne",
    nom: "Garde Sanguinienne",
    legacy: true,
    categorie: "Suites",
    cout: 205,
    composition: "5 Gardes Sanguiniens",
    effectif: { base: 5, max: 10, cout: 40 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "Blood Angels"],
    notes:
      "Également connue sous le nom d'Ikisat, ou les Brûlantes, la Garde Sanguinienne avait pour charge la sécurité de la personne de Sanguinius. Chaque Séraphin, comme on désignait individuellement un Garde Sanguinien au sein de la Légion, était choisi pour sa dévotion sans faille, juré de suivre son sire au cœur de la bataille quel que soit le danger et de veiller à ce qu'il survive, quel qu'en soit le prix. En de rares occasions, ils furent également assignés à la garde d'autres commandants en signe de la faveur du Grand Ange, ou servirent de hérauts, veillant à ce que ses édits soient exécutés là où Sanguinius ne pouvait être présent.",
    equipement: [
      "Lame de Perdition",
      "Pistolet bolter",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Garde Sanguinienne",
        cout: 0,
        profils: [
          {
            nom: "Garde Sanguinien",
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
        ],
        regles: ["Massif (2)", "Frappe en Profondeur"],
        type: "Infanterie (Antigrav)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "arme-perdition",
        libelle: "Toutes les Figurines : type d'arme de Perdition",
        remplace: "Lame de Perdition",
        choix: [
          { nom: "— Conserver la Lame de Perdition —", cout: 0 },
          { nom: "Hache de Perdition", cout: 0 },
          { nom: "Masse de Perdition", cout: 0 },
          { nom: "Lance de Perdition", cout: 0 },
        ],
      },
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
      {
        type: "quantite",
        id: "pistolet-inferno",
        libelle: "Figurines : Pistolet Inferno (à la place du pistolet bolter)",
        cout: 10,
        parTranche: 1,
        groupe: "pistolet",
        ajoute: "Pistolet Inferno (à la place du pistolet bolter)",
      },
      ...quantiteDepuisListe(LISTES_EQUIPEMENT.pistolets, {
        groupe: "pistolet",
        remplace: "du pistolet bolter",
      }),
      optionBombesFusionUnite(),
      {
        type: "quantite",
        id: "lame-parangon",
        libelle:
          "Par tranche de cinq Figurines : lame de parangon à la place de l'arme de Perdition (une Figurine)",
        cout: 15,
        parTranche: 5,
        ajoute:
          "Lame de parangon (à la place de l'arme de Perdition, une Figurine)",
      },
      {
        type: "case",
        id: "etendard-legion-arme-energetique",
        libelle:
          "Une Figurine : arme de Perdition et pistolet bolter échangés contre un étendard de Légion et une arme énergétique",
        cout: 15,
        ajoute:
          "Étendard de Légion et arme énergétique (à la place de l'arme de Perdition et du pistolet bolter, une Figurine)",
      },
    ],
    legion: "IX",
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
      optionBaionnette("Bolter Kraken"),
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

  {
    id: "escouade-deliverers",
    nom: "Escouade de Terminator Deliverers",
    legacy: true,
    categorie: "Elite",
    cout: 215,
    composition: "1 Chieftain Deliverer, 4 Deliverers",
    effectif: { base: 5, max: 15, cout: 40 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "Raven Guard"],
    notes:
      "Peu de guerriers de la XIXe Légion appréciaient l'usage de l'armure Terminator, et son déploiement régulier était généralement le fait de vétérans Terrans qui avaient longtemps servi dans l'ombre des Luna Wolves. Nombre d'entre eux avaient combattu aux côtés des tristement célèbres Justaerin, et maîtrisaient les tactiques de l'assaut de choc au corps à corps. Les légionnaires de la Raven Guard et des Luna Wolves en vinrent à surnommer ces guerriers les « Deliverers », tant pour le carnage qu'ils infligeaient à l'ennemi que pour leur tendance à être déployés lorsque d'autres assauts de la XIXe Légion s'enlisaient, renversant le cours de la bataille sous un déferlement impitoyable de bolt et de lame. 0-1 : une seule Escouade de Terminator Deliverers est autorisée par Armée.",
    // « 0-1 » du livre (une seule Escouade par Armée) : voir
    // maxParArmee, consommé par uniteAccessible() (js/unites.js), qui
    // masque l'unité du sélecteur « Unité à ajouter » une fois qu'un
    // exemplaire est déjà dans la liste — même mécanique que les
    // personnages nommés (Sous-type Unique), généralisée à une unité
    // d'escouade.
    maxParArmee: 1,
    equipement: ["Combi-bolter", "Arme énergétique"],
    variantes: [
      {
        nom: "Escouade de Terminator Deliverers",
        cout: 0,
        profils: [
          {
            nom: "Deliverer",
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
          {
            nom: "Chieftain Deliverer",
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
          "Avant-garde (3)",
          "Frappe en Profondeur",
          "La Honte de Corax",
        ],
        type: "Chieftain Deliverer : Infanterie (Sergent, Lourd) · Deliverer : Infanterie (Lourd)",
      },
    ],
    options: [
      {
        type: "quantite",
        id: "arme-lourde-lance-flammes",
        libelle:
          "Par tranche de cinq Figurines : lance-flammes lourd à la place du combi-bolter (une Figurine)",
        cout: 10,
        parTranche: 5,
        groupe: "arme-lourde",
        ajoute:
          "Lance-flammes lourd (à la place du combi-bolter, une Figurine)",
      },
      {
        type: "quantite",
        id: "arme-lourde-multi-fuseur",
        libelle:
          "Par tranche de cinq Figurines : multi-fuseur à la place du combi-bolter (une Figurine)",
        cout: 15,
        parTranche: 5,
        groupe: "arme-lourde",
        ajoute: "Multi-fuseur (à la place du combi-bolter, une Figurine)",
      },
      {
        type: "quantite",
        id: "arme-lourde-autocanon-reaper",
        libelle:
          "Par tranche de cinq Figurines : autocanon Reaper à la place du combi-bolter (une Figurine)",
        cout: 15,
        parTranche: 5,
        groupe: "arme-lourde",
        ajoute: "Autocanon Reaper (à la place du combi-bolter, une Figurine)",
      },
      {
        type: "quantite",
        id: "arme-energetique-gantelet",
        libelle:
          "Figurines : gantelet énergétique (à la place de l'arme énergétique)",
        cout: 10,
        parTranche: 1,
        groupe: "arme-energetique",
        ajoute: "Gantelet énergétique (à la place de l'arme énergétique)",
      },
      {
        type: "quantite",
        id: "arme-energetique-poing-troncheur",
        libelle:
          "Figurines : poing tronçonneur (à la place de l'arme énergétique)",
        cout: 10,
        parTranche: 1,
        groupe: "arme-energetique",
        ajoute: "Poing tronçonneur (à la place de l'arme énergétique)",
      },
      ...quantiteDepuisListe(LISTES_EQUIPEMENT.combinees, {
        groupe: "tir",
        remplace: "du combi-bolter",
      }),
      {
        type: "quantite",
        id: "serres-corbeau",
        libelle:
          "Figurines : combi-bolter et arme énergétique échangés contre une paire de Serres de Corbeau",
        cout: 10,
        parTranche: 1,
        ajoute:
          "Paire de Serres de Corbeau (à la place du combi-bolter et de l'arme énergétique)",
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
      optionPivotLegion(["decurion-sagittar", "decurion-lanius"]),
      ...optionsFinBlinde({ missile: "Tourelle" }),
      ...optionsDecurionLegion({
        defensor: 30,
        locus: 40,
        sagittar: 30,
        lanius: 30,
      }),
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
      optionPivotLegion(["decurion-sagittar", "decurion-lanius"]),
      ...optionsFinBlinde({ missile: "Tourelle", bulldozer: false }),
      ...optionsDecurionLegion({
        defensor: 20,
        locus: 30,
        sagittar: 30,
        lanius: 25,
        sicaran: true,
      }),
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
      optionPivotLegion(["decurion-sagittar", "decurion-lanius"]),
      ...optionsFinBlinde({ missile: "Tourelle" }),
      ...optionsDecurionLegion({
        defensor: 20,
        locus: 30,
        sagittar: 30,
        lanius: 25,
      }),
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
    notes:
      "Capitaine de la Huitième Compagnie d'Assaut, Le Deux Fois Rescapé, L'Exterminateur.",
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
    options: [
      // Salamanders Legacy Wargear (salamanders_wargear.pdf), section
      // « Firedrake Terminator Squad ».
      {
        type: "quantite",
        id: "arme-energetique-legacy",
        libelle:
          "Figurines : arme énergétique (Legacy, à la place du Marteau Thunder forgé)",
        cout: 0,
        parTranche: 1,
        groupe: "melee",
        ajoute:
          "Arme énergétique (Legacy) (à la place du Marteau Thunder forgé)",
      },
      {
        type: "quantite",
        id: "gantelet-energetique-legacy",
        libelle:
          "Figurines : gantelet énergétique (Legacy, à la place du Marteau Thunder forgé)",
        cout: 0,
        parTranche: 1,
        groupe: "melee",
        ajoute:
          "Gantelet énergétique (Legacy) (à la place du Marteau Thunder forgé)",
      },
      {
        type: "quantite",
        id: "poing-tronconneur-legacy",
        libelle:
          "Figurines : poing tronçonneur (Legacy, à la place du Marteau Thunder forgé)",
        cout: 5,
        parTranche: 1,
        groupe: "melee",
        ajoute:
          "Poing tronçonneur (Legacy) (à la place du Marteau Thunder forgé)",
      },
      {
        type: "quantite",
        id: "combi-bolter",
        libelle:
          "Figurines : Écaille de Drac contre un combi-bolter (Legacy, perd le Trait Bouclier)",
        cout: 0,
        parTranche: 1,
        groupe: "bouclier",
        ajoute:
          "Combi-bolter (Legacy, à la place de l'Écaille de Drac — perd le Trait Bouclier)",
      },
      ...quantiteDepuisListe(LISTES_EQUIPEMENT.combinees, {
        groupe: "bouclier",
        remplace: "de l'Écaille de Drac (Legacy, perd le Trait Bouclier)",
      }),
      {
        type: "quantite",
        id: "lance-flammes-lourd",
        libelle:
          "Figurines (une par tranche de cinq) : Écaille de Drac contre un lance-flammes lourd forgé (Legacy, +10 Points, perd le Trait Bouclier)",
        cout: 10,
        parTranche: 5,
        ajoute:
          "Lance-flammes lourd forgé (Legacy, à la place de l'Écaille de Drac — perd le Trait Bouclier)",
      },
    ],
    legion: "XVIII",
  },

  /* ----------------------------------------------------------
     UNITÉS LEGACY RÉSERVÉES À LA XVIIIe LÉGION (SALAMANDERS)
     Transcrit depuis salamanders.pdf et salamanders_wargear.pdf
     (Warhammer: The Horus Heresy — Legacies of the Age of Darkness,
     texte uniquement disponible en anglais : traduction maison, à
     recouper avec une version française si elle paraît un jour).
     Marquées legacy: true (comme Garde Sanguinienne) pour s'afficher
     avec la mention « (Legacies) » dans le menu déroulant « Unité à
     ajouter ». Voir js/armes-data.js pour leurs armes propres.
     ---------------------------------------------------------- */
  {
    id: "cassian-dracos-reborn",
    nom: "Cassian Dracos Ressuscité",
    legacy: true,
    categorie: "Quartier Général",
    cout: 220,
    composition: "1 Cassian Dracos",
    traits: ["Loyaliste", "Salamanders", "Écran de Fumée", "Cybertheurge"],
    notes:
      "Seigneur de la XVIIIe Légion aux jours précédant le retour de Vulkan, Cassian fut condamné à la demi-vie éternelle d'un Dreadnought après avoir subi des blessures mortelles lors de la bataille finale de l'ancienne Légion des Salamanders. La coque dans laquelle il fut enchâssé, forgée par Vulkan lui-même, n'a d'égale à nul autre patron de Dreadnought et est capable d'auto-réparations limitées. Au Massacre de la Zone de Largage, Dracos déferla sur les lignes Traîtres, revivant sa première mort tandis que la XVIIIe Légion faisait de nouveau face à l'annihilation. Laissant une traînée de morts derrière lui, Dracos ne fut arrêté que par une frappe de lance orbitale qui vitrifia tout un champ de bataille. Horus et ses généraux quittèrent Isstvan certains que la vie de l'ancien seigneur de guerre s'était achevée avec son Primarque et sa Légion, et pendant un an Dracos resta enseveli dans la poussière vitrifiée de la Dépression d'Urgall. Sauvé par des guerriers de sa propre Légion venus chercher des nouvelles de Vulkan, Cassian Dracos allait renaître, arraché au cœur ténébreux d'Isstvan V et de retour sur le champ de bataille. Il n'était plus celui qu'il avait été, désormais fantasque et imprévisible de tempérament, chargé d'une rage inextinguible et d'un besoin de vengeance. Par sa force brute et un nouveau pouvoir sur l'animus simple des automates de combat, il allait se révéler une épine redoutable dans le flanc des ambitions d'Horus.",
    equipement: [
      "Paire de poings énergétiques Gravis",
      "Deux lance-flammes lourds forgés",
    ],
    variantes: [
      {
        nom: "Cassian Dracos",
        cout: 0,
        profil: {
          M: 6,
          CC: 5,
          CT: 5,
          F: 7,
          E: 7,
          PV: 8,
          I: 3,
          A: 4,
          Cd: 12,
          Sf: 12,
          Vo: 6,
          Int: 8,
          Sv: "2+",
          Inv: "5+",
        },
        regles: [
          "Massif (6)",
          "Explose (5+)",
          "Avance Implacable",
          "Guerrier-artisan (1)",
          "Armure Écaille de Drac",
          "Murmures d'Isstvan",
        ],
        type: "Marcheur (Unique)",
      },
    ],
    options: [],
    legion: "XVIII",
  },
  {
    id: "escouade-adherents",
    nom: "Escouade des Adhérents",
    legacy: true,
    categorie: "Troupes",
    cout: 85,
    composition: "1 Avocat, 4 Adhérents",
    effectif: { base: 5, max: 10, cout: 15 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "Salamanders"],
    notes:
      "Après le Massacre de la Zone de Largage, nombre de Salamanders se tournèrent vers le Culte Promethéen comme source de conviction renouvelée, y compris la secte résurrectionniste apparue sur Nocturne et les tristement célèbres Disciples de la Flamme. Connues sous de nombreux noms, les plus véhémentes de ces « Adhérents » formèrent des unités ad hoc de guerriers fanatiques, semble-t-il avec la bénédiction de leurs officiers commandants. De telles cohortes portèrent leur ferveur sur d'innombrables champs de bataille, livrant les forces Traîtres aux flammes partout où elles pouvaient être trouvées, bien que cette quête de vengeance sans repos en fît un allié imprévisible.",
    equipement: [
      "Combi-lance-flammes",
      "Pistolet bolter",
      "Épée tronçonneuse (Avocat seulement)",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Escouade des Adhérents",
        cout: 0,
        profils: [
          {
            nom: "Adhérent",
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
          {
            nom: "Avocat",
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
              Inv: "—",
            },
          },
        ],
        regles: ["Avant-garde (2)", "Credo de la Flamme"],
        type: "Avocat : Infanterie (Sergent) · Adhérent : Infanterie",
      },
    ],
    options: [
      {
        type: "choix",
        id: "avocat-melee",
        libelle:
          "Avocat : objet de la liste des Armes de Mêlée de Sergent de Légion",
        remplace: "Épée tronçonneuse (Avocat seulement)",
        prefixeFiche: "Avocat : ",
        choix: [
          { nom: "— Conserver l'épée tronçonneuse —", cout: 0 },
          ...depuisListes(LISTES_EQUIPEMENT.meleeSergent),
        ],
      },
      {
        type: "quantite",
        id: "lance-flammes-lourd",
        libelle:
          "Figurines (une par tranche de cinq) : lance-flammes lourd forgé (à la place du combi-lance-flammes)",
        cout: 10,
        parTranche: 5,
        ajoute: "Lance-flammes lourd forgé (à la place du combi-lance-flammes)",
      },
      {
        type: "case",
        id: "bombes-fusion",
        libelle: "Avocat : bombes à fusion",
        cout: 10,
        ajoute: "Avocat : bombes à fusion",
      },
      {
        type: "case",
        id: "vexillum",
        libelle: "Un Adhérent : vexillum",
        cout: 10,
        ajoute: "Un Adhérent : vexillum",
      },
      {
        type: "choix",
        id: "equipement-legion-1",
        libelle: "Équipement de Légion (1er Adhérent, deux max dans l'unité)",
        ajoute: true,
        prefixeFiche: "Adhérent : ",
        choix: [
          { nom: "— Aucun —", cout: 0 },
          { nom: "Nuncio-vox", cout: 10 },
          { nom: "Scanner augure", cout: 10 },
        ],
      },
      {
        type: "choix",
        id: "equipement-legion-2",
        libelle: "Équipement de Légion (2e Adhérent)",
        ajoute: true,
        prefixeFiche: "Adhérent : ",
        choix: [
          { nom: "— Aucun —", cout: 0 },
          { nom: "Nuncio-vox", cout: 10 },
          { nom: "Scanner augure", cout: 10 },
        ],
      },
    ],
    legion: "XVIII",
  },
  {
    id: "escouade-sanctificateurs",
    nom: "Escouade des Sanctificateurs",
    legacy: true,
    categorie: "Elite",
    cout: 90,
    composition: "1 Consécrateur, 4 Sanctificateurs",
    effectif: { base: 5, max: 10, cout: 16 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "Salamanders"],
    notes:
      "L'une des subdivisions apparues pour largement remplacer les Compagnies de Destroyers de l'ancienne XVIIIe Légion, les escouades dites « Sanctificateur » étaient des unités temporaires composées de Légionnaires vétérans, équipés d'un éventail d'armes qui leur permettait une souplesse tactique au-delà de celle des configurations d'escouade standard. Employées là où Vulkan ne tolérait pas le déploiement des derniers Destroyers de sa Légion — la cadre xénos honnie des « Scoria » — les Sanctificateurs étaient spécialisés dans les opérations de pacification et de confinement, appelés à traquer et éliminer leurs ennemis au cœur de ruches labyrinthiques ou de vaisseaux-cavernes.",
    equipement: [
      "Bolter",
      "Pistolet bolter",
      "Épée tronçonneuse (Consécrateur seulement)",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Escouade des Sanctificateurs",
        cout: 0,
        profils: [
          {
            nom: "Sanctificateur",
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
            nom: "Consécrateur",
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
        ],
        regles: ["Gabarit de Souffle", "Avant-garde (3)"],
        type: "Consécrateur : Infanterie (Sergent) · Sanctificateur : Infanterie",
      },
    ],
    options: [
      {
        type: "quantite",
        id: "deux-pistolets-bolter",
        libelle:
          "Figurines : deux pistolets bolter (à la place du bolter et du pistolet bolter)",
        cout: 0,
        parTranche: 1,
        groupe: "tir",
        ajoute:
          "Deux pistolets bolter (à la place du bolter et du pistolet bolter)",
      },
      {
        type: "quantite",
        id: "deux-serpentines-volkites",
        libelle:
          "Figurines : deux serpentines volkites (à la place du bolter et du pistolet bolter)",
        cout: 5,
        parTranche: 1,
        groupe: "tir",
        ajoute:
          "Deux serpentines volkites (à la place du bolter et du pistolet bolter)",
      },
      {
        type: "quantite",
        id: "deux-lance-flammes-legers",
        libelle:
          "Figurines : deux lance-flammes légers (à la place du bolter et du pistolet bolter)",
        cout: 10,
        parTranche: 1,
        groupe: "tir",
        ajoute:
          "Deux lance-flammes légers (à la place du bolter et du pistolet bolter)",
      },
      {
        type: "quantite",
        id: "canon-rotor-obsidite",
        libelle:
          "Figurines (une par tranche de cinq) : canon rotor Obsidite (à la place du bolter)",
        cout: 10,
        parTranche: 5,
        ajoute: "Canon rotor Obsidite (à la place du bolter)",
      },
      ...quantiteDepuisListe(LISTES_EQUIPEMENT.meleeSergent, {
        groupe: "melee-sanctificateur",
        parTranche: 5,
        remplace: "de l'épée tronçonneuse",
      }),
      {
        type: "case",
        id: "consecrateur-lance-flammes",
        libelle:
          "Consécrateur : échanger son bolter et son pistolet bolter contre deux lance-flammes légers forgés",
        cout: 15,
        ajoute:
          "Consécrateur : deux lance-flammes légers forgés (à la place du bolter et du pistolet bolter)",
      },
      {
        type: "choix",
        id: "consecrateur-melee",
        libelle:
          "Consécrateur : objet de la liste des Armes de Mêlée de Sergent de Légion",
        remplace: "Épée tronçonneuse (Consécrateur seulement)",
        prefixeFiche: "Consécrateur : ",
        choix: [
          { nom: "— Conserver l'épée tronçonneuse —", cout: 0 },
          ...depuisListes(LISTES_EQUIPEMENT.meleeSergent),
        ],
      },
      {
        type: "case",
        id: "vexillum",
        libelle: "Un Sanctificateur : vexillum",
        cout: 10,
        ajoute: "Un Sanctificateur : vexillum",
      },
      {
        type: "choix",
        id: "equipement-legion-1",
        libelle:
          "Équipement de Légion (1er Sanctificateur, deux max dans l'unité)",
        ajoute: true,
        prefixeFiche: "Sanctificateur : ",
        choix: [
          { nom: "— Aucun —", cout: 0 },
          { nom: "Nuncio-vox", cout: 10 },
          { nom: "Scanner augure", cout: 10 },
        ],
      },
      {
        type: "choix",
        id: "equipement-legion-2",
        libelle: "Équipement de Légion (2e Sanctificateur)",
        ajoute: true,
        prefixeFiche: "Sanctificateur : ",
        choix: [
          { nom: "— Aucun —", cout: 0 },
          { nom: "Nuncio-vox", cout: 10 },
          { nom: "Scanner augure", cout: 10 },
        ],
      },
      optionBombesFusionUnite(),
    ],
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
    equipement: [
      "Lames de Lucius",
      "Pistolet bolter",
      "Grenades Frag",
      "Grenades Krak",
    ],
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

  /* --- Compléments IIIe Légion (Emperor's Children), transcrits
     depuis photos du livre d'armée : Fulgrim, Fulgrim Transfiguré,
     Saul Tarvitz, Escouade de Lames Palatines et Escouade Kakophoni
     (voir js/armes-data.js pour leurs armes propres et l'Arsenal des
     Emperor's Children). L'équipement « Bolter Némésis » de Saul
     Tarvitz existait déjà dans js/armes-data.js (déjà utilisé par une
     Unité Raven Guard) : aucune arme à ajouter pour lui. --- */
  {
    id: "fulgrim",
    nom: "Fulgrim",
    categorie: "Seigneur de Guerre",
    cout: 425,
    composition: "1 Fulgrim",
    notes:
      "Primarque des Emperor's Children, Le Phénicien, Le Préfector de Chemos. Inconstant et vaniteux, Fulgrim était le Primarque de la Légion des Emperor's Children. Il s'efforçait d'être un exemplaire en toutes choses : stratégie, techniques de combat, gouvernance, raison et initiative, et transmit ces valeurs à sa Légion, qui le sanctuaria sous la forme d'un dévouement implacable à la perfection martiale. Sous son égide, les Emperor's Children se relevèrent des cendres de leur extinction quasi-certaine pour devenir les parangons de la vision qu'avait l'Empereur des Legiones Astartes. Fulgrim établit une chaîne de commandement claire et rigide au sein de la Légion ; ses opinions, ses croyances personnelles, ses opinions et ses désirs furent transmis à tous les échelons sous forme d'une doctrine qui ne saurait être remise en question. Ses fils, pour qui il faut le centre de leurs lettres sanglantes, s'efforçaient d'imiter son exemple pour se montrer à la hauteur de ses ambitions.",
    traits: ["Renégat", "Emperor's Children", "Maître de la Légion"],
    equipement: ["Lame Laërienne", "Flambeau"],
    variantes: [
      {
        nom: "Fulgrim",
        cout: 0,
        profil: {
          M: 8,
          CC: 8,
          CT: 6,
          F: 6,
          E: 6,
          PV: 6,
          I: 8,
          A: 7,
          Cd: 12,
          Sf: 10,
          Vo: 9,
          Int: 10,
          Sv: "2+",
          Inv: "4+",
        },
        regles: [
          "Sire des Emperor's Children",
          "Massif (4)",
          "Sublime Spadassin",
          "Guerrier Éternel (2)",
        ],
        type: "Parangon (Unique)",
      },
    ],
    options: [],
    excluAvec: ["fulgrim-transfigure"],
    legion: "III",
  },
  {
    id: "fulgrim-transfigure",
    nom: "Fulgrim Transfiguré",
    categorie: "Seigneur de Guerre",
    cout: 600,
    composition: "1 Fulgrim Transfiguré",
    notes:
      "Le Phénicien Déifié, Avatar de la Perfection. Fulgrim aspirait à la perfection en tout, ce qui l'exposait au doute et à l'hybris, dont les germes furent cultivés par l'esprit malveillant qui habitait l'Épée des Laërs. Après son apothéose démoniaque dans l'antique citadelle xéno sous le monde déchu de Lydris, Fulgrim a fait muer son corps d'origine en une forme monstrueuse accordée par sa nouvelle divinité tutélaire. Nanti d'une moitié inférieure serpentine, de grandes ailes et d'une seconde paire de bras, la nouvelle corps de Fulgrim éleva un guerrier d'exception à des sommets encore plus élevés, proches de la perfection qu'il désirait tant.",
    traits: ["Renégat", "Emperor's Children", "Maître de la Légion"],
    equipement: ["Lames du Phénicien"],
    variantes: [
      {
        nom: "Fulgrim Transfiguré",
        cout: 0,
        profil: {
          M: 14,
          CC: 8,
          CT: 6,
          F: 7,
          E: 7,
          PV: 8,
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
          "Rejeton de la Corruption",
          "Avatar de la Perfection",
          "Frappe en Profondeur",
          "Guerrier Éternel (2)",
          "Peur (2)",
        ],
        type: "Parangon (Unique, Antigrav, Maléfique)",
      },
    ],
    options: [],
    excluAvec: ["fulgrim"],
    legion: "III",
  },
  {
    id: "saul-tarvitz",
    nom: "Saul Tarvitz",
    categorie: "État-major",
    cout: 215,
    composition: "1 Saul Tarvitz",
    notes:
      "Capitaine de la 10e Compagnie. Saul Tarvitz était un capitaine de compagnie des Emperor's Children respecté de ses subordonnés et pouvant se targuer d'un nombre considérable de victoires. Cependant, il se contentait d'être un officier de ligne, servant sa Légion sur le champ de bataille, et était dépourvu de l'ambition qui habitait nombre de ses camarades. Lorsqu'il découvrit l'étendue de la traîtrise sur Isstvan III, Tarvitz prit l'initiative d'agir et se dirigea vers la surface du monde condamné pour avertir les Loyalistes piégés au sol de l'imminence du massacre et les aider lors de la bataille qui s'annonçait.",
    traits: ["Loyaliste", "Emperor's Children", "Maître de la Légion"],
    equipement: [
      "Espadon charnabal",
      "Bolter Némésis",
      "Pistolet bolter",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Saul Tarvitz",
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
          Sf: 9,
          Vo: 9,
          Int: 9,
          Sv: "2+",
          Inv: "4+",
        },
        regles: ["Haine (Renégats)", "Officier de Ligne (2)", "Un Frère Trahi"],
        type: "Infanterie (Unique, État-major)",
      },
    ],
    options: [],
    legion: "III",
  },
  {
    id: "escouade-lames-palatines",
    nom: "Escouade de Lames Palatines",
    categorie: "Elite",
    cout: 165,
    composition: "1 Prefector Palatin, 4 Guerriers Palatins",
    effectif: { base: 5, max: 10, cout: 28 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "Emperor's Children"],
    notes:
      "Confrérie guerrière regroupant les meilleurs bretteurs de la Légion, les Lames Palatines étaient en dehors de la structure rigide de l'organisation militaire des Emperor's Children. Nombre de guerriers rêvaient de rejoindre cette société de duellistes, que Fulgrim appréciait particulièrement. À la discrétion des commandants de Légion, les membres des Lames Palatines combattaient ensemble sur le champ de bataille, servant d'exemple d'excellence et de perfection dans les arts de la guerre en affrontant les meilleurs guerriers de l'ennemi pour faire la preuve de leur incontestable supériorité.",
    equipement: [
      "Lame palatine",
      "Pistolet bolter",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Escouade de Lames Palatines",
        cout: 0,
        profils: [
          {
            nom: "Guerrier Palatin",
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
            nom: "Prefector Palatin",
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
        ],
        regles: ["Avant-garde (3)"],
        type: "Prefector Palatin : Infanterie (Champion, Sergent) · Guerrier Palatin : Infanterie",
      },
    ],
    options: [
      {
        type: "choix",
        id: "arme-cac",
        libelle: "Toute Figurine : remplacer gratuitement la lame palatine",
        remplace: "Lame palatine",
        choix: [
          { nom: "— Conserver la lame palatine —", cout: 0 },
          {
            nom: "Lance énergétique Phénix (à la place de la lame palatine)",
            cout: 0,
          },
        ],
      },
      {
        type: "choix",
        id: "prefector-pistolet",
        libelle: "Le Prefector Palatin : remplacer son pistolet bolter",
        ajoute: true,
        prefixeFiche: "Prefector Palatin : ",
        choix: [
          { nom: "— Aucun échange —", cout: 0 },
          ...depuisListes(LISTES_EQUIPEMENT.pistolets),
        ],
      },
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
  {
    id: "escouade-kakophoni",
    nom: "Escouade Kakophoni",
    categorie: "Appui",
    cout: 150,
    composition: "1 Orchestrateur, 4 Choristes",
    effectif: { base: 5, max: 10, cout: 25 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["Renégat", "Emperor's Children"],
    notes:
      "Après la traîtrise d'Isstvan III, la terrible puissance s'empara des Emperor's Children, et pour nombre de fils de Fulgrim, la déchéance fut aussi soudaine qu'effrayante. Une des premières manifestations de cette corruption fut la création d'armes psychosoniques qui furent baptisées Cacophonie, ou « Kakophoni » dans sa forme archaïque, des instruments de mort puissants mais imprévisibles. Les premiers modèles furent utilisés sur Isstvan V par des Emperor's Children dont la dégénérescence morale était vouée à connaître une inexorable accélération au cours de l'Hérésie d'Horus.",
    equipement: [
      "La Cacophonie",
      "Hurleurs soniques",
      "Pistolet bolter",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Escouade Kakophoni",
        cout: 0,
        profils: [
          {
            nom: "Choriste",
            profil: {
              M: 7,
              CC: 4,
              CT: 4,
              F: 4,
              E: 4,
              PV: 1,
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
          {
            nom: "Orchestrateur",
            profil: {
              M: 7,
              CC: 4,
              CT: 4,
              F: 4,
              E: 4,
              PV: 1,
              I: 4,
              A: 1,
              Cd: 10,
              Sf: 9,
              Vo: 7,
              Int: 7,
              Sv: "3+",
              Inv: "—",
            },
          },
        ],
        regles: ["Aucune"],
        type: "Orchestrateur : Infanterie (Sergent) · Choriste : Infanterie",
      },
    ],
    options: [],
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
    notes:
      "Seigneur Sénéchal, Commandant du Persephone, Capitaine du Premier Cadre d'Assaut.",
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
    notes:
      "Capitaine de la 456e Compagnie des Imperial Fists, Le Tyran de Cthonia.",
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
    equipement: [
      "Durenda",
      "Pistolet bolter",
      "Grenades Frag",
      "Grenades Krak",
    ],
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
    notes:
      "Capitaine de la 405e Compagnie des Imperial Fists, Le Poing Écarlate.",
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
        libelle:
          "Toute Figurine : échanger son pistolet bolter contre un bouclier de combat",
        ajoute: true,
        parFigurine: true,
        prefixeFiche: "Toute l'unité : ",
        choix: [
          { nom: "— Conserver le pistolet bolter —", cout: 0 },
          {
            nom: "Bouclier de combat (à la place du pistolet bolter)",
            cout: 2,
          },
        ],
      },
      {
        type: "choix",
        id: "pistolet-plasma",
        libelle:
          "Toute Figurine : échanger son pistolet bolter contre un pistolet à plasma",
        ajoute: true,
        parFigurine: true,
        prefixeFiche: "Toute l'unité : ",
        choix: [
          { nom: "— Conserver le pistolet bolter —", cout: 0 },
          {
            nom: "Pistolet à plasma (à la place du pistolet bolter)",
            cout: 10,
          },
        ],
      },
      {
        type: "choix",
        id: "equipement-legion-1",
        libelle:
          "Équipement de Légion (1er Frère Templier, deux max dans l'unité)",
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
      optionBombesFusionUnite(),
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
        libelle:
          "Sergent Gardien : échanger son pistolet bolter contre un pistolet à plasma",
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
        libelle:
          "Équipement de Légion (1er Gardien du Phalanx, deux max dans l'unité)",
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
      optionBombesFusionUnite(),
      // Imperial Fists Legacy Wargear (imperial_fists_wargear.pdf),
      // section « Phalanx Warder Squad ».
      {
        type: "quantite",
        id: "flamer-legacy",
        libelle: "Figurines (une par tranche de cinq) : lance-flammes (Legacy)",
        cout: 5,
        parTranche: 5,
        groupe: "special-legacy",
        ajoute: "Lance-flammes (Legacy)",
      },
      {
        type: "quantite",
        id: "plasma-legacy",
        libelle: "Figurines (une par tranche de cinq) : fusil à plasma (Legacy)",
        cout: 10,
        parTranche: 5,
        groupe: "special-legacy",
        ajoute: "Fusil à plasma (Legacy)",
      },
      {
        type: "quantite",
        id: "fuseur-legacy",
        libelle: "Figurines (une par tranche de cinq) : fuseur (Legacy)",
        cout: 15,
        parTranche: 5,
        groupe: "special-legacy",
        ajoute: "Fuseur (Legacy)",
      },
      {
        type: "quantite",
        id: "marteau-thunder-legacy",
        libelle: "Figurines (une par tranche de cinq) : Marteau Thunder (Legacy)",
        cout: 10,
        parTranche: 5,
        groupe: "special-legacy",
        ajoute: "Marteau Thunder (Legacy)",
      },
      ...quantiteDepuisListe(LISTES_EQUIPEMENT.combinees, {
        groupe: "special-legacy",
        parTranche: 5,
      }),
    ],
    legion: "VII",
  },

  /* ----------------------------------------------------------
     UNITÉS LEGACY RÉSERVÉES À LA VIIe LÉGION (IMPERIAL FISTS)
     Transcrit depuis imperial_fists.pdf et imperial_fists_wargear.pdf
     (Warhammer: The Horus Heresy — Legacies of the Age of Darkness,
     texte uniquement disponible en anglais : traduction maison, à
     recouper avec une version française si elle paraît un jour).
     Marquées legacy: true (comme Garde Sanguinienne) pour s'afficher
     avec la mention « (Legacies) » dans le menu déroulant « Unité à
     ajouter ». Voir js/armes-data.js pour leurs armes propres — le
     Canon d'assaut Iliastus existe déjà dans l'Arsenal (option de
     Décurion Sagittar, voir optionsDecurionLegion ci-dessus) : son
     ajout Legacy aux listes d'Armes Lourdes/Sponson/sur Pivot de
     Légion n'est pas câblé sur une Unité générique de Légion (Escouade
     de Soutien, etc.) faute d'unité Imperial Fists de ce livre qui
     l'utilise directement.
     ---------------------------------------------------------- */
  {
    id: "escorte-terminators-huscarl",
    nom: "Escorte de Terminators Huscarl Imperial Fists",
    legacy: true,
    categorie: "Suites",
    cout: 275,
    composition: "1 Sergent Terminator Huscarl, 4 Terminators Huscarl",
    effectif: { base: 5, max: 10, cout: 50 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "Imperial Fists", "Bouclier"],
    notes:
      "L'une des formations Huscarl chargées de la protection rapprochée des membres éminents des Imperial Fists, dont Rogal Dorn lui-même, les Terminators Huscarl utilisent l'équipement le plus résistant qui soit, combattant revêtus de plaques Terminator Cataphractii et portant de vastes boucliers Storm. Confiants dans cet arsenal presque inviolable, ces Huscarls forment un mur quasi impénétrable entre leur charge et l'ennemi, jouant leur vie pour assurer sa sécurité et abattant quiconque cherche à menacer ceux qu'ils protègent.",
    equipement: ["Arme énergétique", "Bouclier Storm modèle Vigil"],
    variantes: [
      {
        nom: "Escorte de Terminators Huscarl Imperial Fists",
        cout: 0,
        profils: [
          {
            nom: "Terminator Huscarl",
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
            nom: "Sergent Terminator Huscarl",
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
          "Guerrier Éternel (1)",
          "Frappe en Profondeur",
        ],
        type: "Sergent Terminator Huscarl : Infanterie (Sergent, Lourd) · Terminator Huscarl : Infanterie (Lourd)",
      },
    ],
    options: [
      {
        type: "quantite",
        id: "gantelet-solarite",
        libelle: "Figurines : gantelet énergétique Solarite (à la place de l'arme énergétique)",
        cout: 10,
        parTranche: 1,
        ajoute: "Gantelet énergétique Solarite (à la place de l'arme énergétique)",
      },
      {
        type: "case",
        id: "harnais",
        libelle: "Sergent Terminator Huscarl : harnais à grenades",
        cout: 5,
        ajoute: "Sergent Terminator Huscarl : harnais à grenades",
      },
    ],
    legion: "VII",
  },
  {
    id: "aetos-dios",
    nom: "Ætos Dios",
    legacy: true,
    categorie: "Seigneurs des Batailles",
    cout: 700,
    composition: "1 Ætos Dios",
    traits: ["Loyaliste", "Imperial Fists", "Écran de Fumée"],
    notes:
      "Suite à plusieurs tentatives contre la vie de Rogal Dorn après le déclenchement de l'Hérésie d'Horus, le Magos Telluria construisit pour lui un vaisseau d'assaut personnel lourdement personnalisé, destiné à le transporter au combat et à le protéger tandis qu'il menait des missions pour la défense de Terra. Cette Figurine a des Points d'Accès sur toutes les Faces si elle n'a pas de socle.",
    equipement: [
      "Canon turbo-laser destructeur d'Axe Central",
      "Deux bolters lourds jumelés de Tourelle",
      "Deux bolters lourds jumelés (Sponsons)",
      "Deux canons laser de Coque (Avant)",
      "Six missiles Hellstrike d'Axe Central",
    ],
    variantes: [
      {
        nom: "Ætos Dios",
        cout: 0,
        profilVehicule: { M: 18, CT: 4, avant: 13, flanc: 13, arriere: 13, PC: 18, transport: 32 },
        regles: [
          "Baie de Transport Thunderhawk (voir Liber Astartes, page 118)",
          "Boucliers Void (1)",
          "Ætos Praetoria",
        ],
        type: "Véhicule (Unique, Transport, Super-lourd, Volant)",
      },
    ],
    options: [],
    legion: "VII",
  },

  /* ----------------------------------------------------------
     UNITÉS RÉSERVÉES À LA XIIIe LÉGION (ULTRAMARINES)
     ---------------------------------------------------------- */
  {
    id: "roboute-guilliman",
    nom: "Roboute Guilliman",
    categorie: "Seigneur de Guerre",
    cout: 465,
    composition: "1 Roboute Guilliman",
    notes:
      "Primarque des Ultramarines, Le Victorieux, Le Maître d'Ultramar, Régent des Ost, La Lame de l'Unité.",
    traits: ["Loyaliste", "Ultramarines", "Maître de la Légion"],
    equipement: [
      "L'Arbitrator",
      "Le Gladius Incandor",
      "La Main de Domination",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Roboute Guilliman",
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
          "Sire des Ultramarines",
          "Massif (4)",
          "Bretteur Réfléchi",
          "Guerrier Éternel (2)",
        ],
        type: "Parangon (Unique)",
      },
    ],
    options: [],
    legion: "XIII",
  },
  {
    id: "remus-ventanus",
    nom: "Remus Ventanus",
    categorie: "État-major",
    cout: 175,
    composition: "1 Remus Ventanus",
    notes:
      "Commandant de la 4e Compagnie du 1er Chapitre de la Légion des Ultramarines, Le Sauveur de Calth.",
    traits: ["Loyaliste", "Ultramarines"],
    equipement: [
      "Phaeton",
      "Icône de Calth",
      "Interconnexion Vox",
      "Pistolet bolter",
      "Bombes à fusion",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Remus Ventanus",
        cout: 0,
        profil: {
          M: 7,
          CC: 5,
          CT: 5,
          F: 4,
          E: 4,
          PV: 4,
          I: 5,
          A: 3,
          Cd: 10,
          Sf: 9,
          Vo: 9,
          Int: 9,
          Sv: "2+",
          Inv: "4+",
        },
        regles: ["Officier de Ligne (2)"],
        type: "Infanterie (Unique, État-major)",
      },
    ],
    options: [],
    legion: "XIII",
  },
  {
    id: "escouade-suzerains-invictarus",
    nom: "Escouade de Suzerains Invictarus",
    categorie: "Elite",
    cout: 175,
    composition: "5 Suzerains",
    effectif: { base: 5, max: 10, cout: 30 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "Ultramarines", "Bouclier"],
    notes:
      "Classe distincte des unités de ligne Ultramarines, placée directement sous les ordres du Primarque et des Tétrarques : choisis parmi les hommes du rang et équipés d'armures d'artificier et de boucliers d'abordage Argyrum, les Suzerains Invictarus sont des guerriers hors pair, voués à commander.",
    equipement: [
      "Hache légatine",
      "Pistolet bolter",
      "Bouclier d'abordage modèle Argyrum",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Escouade de Suzerains Invictarus",
        cout: 0,
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
          Sf: 9,
          Vo: 8,
          Int: 8,
          Sv: "2+",
          Inv: "5+",
        },
        regles: ["Seigneurs d'Ultramar"],
        type: "Infanterie (Lourd)",
      },
    ],
    options: [
      {
        type: "quantite",
        id: "pistolet-plasma",
        libelle:
          "Suzerains : pistolet à plasma (2 par tranche de 5 Figurines, à la place du pistolet bolter)",
        cout: 10,
        parTranche: 5,
        parTrancheMax: 2,
        ajoute: "Pistolet à plasma (à la place du pistolet bolter)",
      },
      // Ultramarines Legacy Wargear (ultramarines_wargear.pdf), section
      // « Invictarus Suzerain Squad ».
      {
        type: "quantite",
        id: "marteau-thunder-legacy",
        libelle: "Figurines : Marteau Thunder (Legacy, à la place de la hache légatine)",
        cout: 10,
        parTranche: 1,
        ajoute: "Marteau Thunder (Legacy) (à la place de la hache légatine)",
      },
    ],
    legion: "XIII",
  },
  {
    id: "escouade-brecheurs-pretoriens",
    nom: "Escouade de Brécheurs Prétoriens",
    categorie: "Assaut Lourd",
    cout: 115,
    composition: "1 Prétorien Primus, 4 Prétoriens",
    effectif: { base: 5, max: 10, cout: 18 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "Ultramarines", "Bouclier"],
    notes:
      "Escouades d'élite des Prétoriens de la XIIIe Légion, souvent affectées à la sécurité des vaisseaux les plus précieux de la flotte afin de repousser toute tentative d'abordage de l'ennemi : elles forment le fer de lance des formations de Brécheurs et l'enclume sur laquelle l'adversaire se brise.",
    equipement: [
      "Épée énergétique",
      "Pistolet bolter",
      "Bouclier d'abordage",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Escouade de Brécheurs Prétoriens",
        cout: 0,
        profils: [
          {
            nom: "Prétorien",
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
              Sf: 8,
              Vo: 7,
              Int: 7,
              Sv: "3+",
              Inv: "5+",
            },
          },
          {
            nom: "Prétorien Primus",
            profil: {
              M: 7,
              CC: 4,
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
              Inv: "5+",
            },
          },
        ],
        regles: [],
        type: "Prétorien Primus : Infanterie (Sergent, Lourd) · Prétorien : Infanterie (Lourd)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "primus-pistolet",
        libelle:
          "Prétorien Primus : échanger son pistolet bolter contre un pistolet à plasma",
        remplace: "Pistolet bolter",
        prefixeFiche: "Prétorien Primus : ",
        choix: [
          { nom: "— Conserver le pistolet bolter —", cout: 0 },
          { nom: "Pistolet à plasma", cout: 10 },
        ],
      },
      {
        type: "choix",
        id: "primus-arme",
        libelle: "Prétorien Primus : échanger son épée énergétique",
        remplace: "Épée énergétique",
        prefixeFiche: "Prétorien Primus : ",
        choix: [
          { nom: "— Conserver l'épée énergétique —", cout: 0 },
          { nom: "Gantelet énergétique", cout: 15 },
          { nom: "Hache légatine", cout: 5 },
        ],
      },
      {
        type: "choix",
        id: "equipement-legion-1",
        libelle: "Équipement de Légion (1er Prétorien, deux max dans l'unité)",
        ajoute: true,
        prefixeFiche: "Prétorien : ",
        choix: [
          { nom: "— Aucun —", cout: 0 },
          { nom: "Nuncio-vox", cout: 10 },
          { nom: "Scanner augure", cout: 10 },
        ],
      },
      {
        type: "choix",
        id: "equipement-legion-2",
        libelle: "Équipement de Légion (2e Prétorien)",
        ajoute: true,
        prefixeFiche: "Prétorien : ",
        choix: [
          { nom: "— Aucun —", cout: 0 },
          { nom: "Nuncio-vox", cout: 10 },
          { nom: "Scanner augure", cout: 10 },
        ],
      },
      {
        type: "case",
        id: "vexillum",
        libelle: "Un Prétorien : vexillum",
        cout: 10,
        ajoute: "Vexillum (un Prétorien)",
      },
      // Ultramarines Legacy Wargear (ultramarines_wargear.pdf), section
      // « Praetorian Breacher Squad ».
      {
        type: "quantite",
        id: "hache-legatine-legacy",
        libelle: "Figurines (une par tranche de cinq) : hache légatine (Legacy, à la place de l'épée énergétique)",
        cout: 5,
        parTranche: 5,
        ajoute: "Hache légatine (Legacy) (à la place de l'épée énergétique)",
      },
    ],
    legion: "XIII",
  },

  /* ----------------------------------------------------------
     UNITÉS LEGACY RÉSERVÉES À LA XIIIe LÉGION (ULTRAMARINES)
     Transcrit depuis ultramarines.pdf et ultramarines_wargear.pdf
     (Warhammer: The Horus Heresy — Legacies of the Age of Darkness,
     texte uniquement disponible en anglais : traduction maison, à
     recouper avec une version française si elle paraît un jour).
     Marquées legacy: true (comme Garde Sanguinienne) pour s'afficher
     avec la mention « (Legacies) » dans le menu déroulant « Unité à
     ajouter ». Voir js/armes-data.js pour leurs armes propres — le
     Fusil à gravitons, le Canon d'assaut Kheres, le Poing énergétique
     Gravis et le Lance-missiles de Destructeur — Missile Rad
     existaient déjà (réutilisés tels quels).
     ---------------------------------------------------------- */
  {
    id: "escouade-assaut-locutarus",
    nom: "Escouade d'Assaut Locutarus",
    legacy: true,
    categorie: "Elite",
    cout: 200,
    composition: "1 Chef de Frappe Locutarus, 4 Locutarus",
    effectif: { base: 5, max: 10, cout: 38 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "Ultramarines"],
    notes:
      "Là où les unités d'assaut de bien d'autres Légions sont connues pour leur sauvagerie, les Locutarus se distinguent par une discipline et une rigueur universelles. Leur entraînement élève le maniement de la lame au rang d'art, mais au lieu de se concentrer sur l'habileté individuelle de chaque guerrier, les Locutarus s'entraînent en unité dans la synchronicité, pour que chaque coup soit parfaitement calculé et coordonné. Lors des batailles rangées, les escouades d'Assaut Locutarus sont souvent tenues en réserve, leurs officiers attendant le moment parfait pour les engager, et en une seule Charge faisant pencher l'issue du combat en faveur des Ultramarines. La Lame de la Sagesse — La Lame de la Sagesse est une stratégie d'assaut avancée conçue pour la première fois durant la Grande Croisade. Les Locutarus lancent une Charge parfaitement synchronisée contre des ennemis immobilisés par le tir d'une redoutable précision d'unités Ultramarines en soutien mutuel, et anéantissent rapidement leurs adversaires dans un déluge de coups d'épée experts. Épée énergétique Argean — forgée par les maîtres artisans d'Heliopolis sur Macragge, l'épée énergétique Argean que porte chaque Locutarus est une arme d'artificier qui sert autant de marque de courage et d'honneur que d'outil de guerre mortel.",
    equipement: ["Pistolet bolter", "Épée énergétique Argean", "Grenades Frag", "Grenades Krak"],
    variantes: [
      {
        nom: "Escouade d'Assaut Locutarus",
        cout: 0,
        profils: [
          {
            nom: "Locutarus",
            profil: {
              M: 12,
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
              Sv: "2+",
              Inv: "—",
            },
          },
          {
            nom: "Chef de Frappe Locutarus",
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
        ],
        regles: ["Massif (2)", "Frappe en Profondeur", "Précision (6+)", "La Lame de la Sagesse"],
        type: "Chef de Frappe Locutarus : Infanterie (Champion, Antigrav) · Locutarus : Infanterie (Antigrav)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "chef-melee",
        libelle: "Chef de Frappe Locutarus : objet de la liste des Armes de Mêlée de Sergent de Légion",
        ajoute: true,
        prefixeFiche: "Chef de Frappe Locutarus : ",
        choix: [
          { nom: "— Aucun —", cout: 0 },
          ...depuisListes(LISTES_EQUIPEMENT.meleeSergent),
        ],
      },
      ...quantiteDepuisListe(LISTES_EQUIPEMENT.pistolets, {
        parTranche: 5,
        remplace: "du pistolet bolter",
      }),
      {
        type: "choix",
        id: "chef-pistolet",
        libelle: "Chef de Frappe Locutarus : objet de la liste des Pistolets de Légion",
        ajoute: true,
        prefixeFiche: "Chef de Frappe Locutarus : ",
        choix: [
          { nom: "— Aucun —", cout: 0 },
          ...depuisListes(LISTES_EQUIPEMENT.pistolets),
        ],
      },
      {
        type: "case",
        id: "bouclier-combat",
        libelle: "Chef de Frappe Locutarus : bouclier de combat",
        cout: 5,
        ajoute: "Chef de Frappe Locutarus : bouclier de combat",
      },
      {
        type: "case",
        id: "bombes-fusion",
        libelle: "Chef de Frappe Locutarus : bombes à fusion",
        cout: 10,
        ajoute: "Chef de Frappe Locutarus : bombes à fusion",
      },
    ],
    legion: "XIII",
  },
  {
    id: "escouade-terminator-fulmentarus",
    nom: "Escouade Terminator Fulmentarus",
    legacy: true,
    categorie: "Assaut Lourd",
    cout: 290,
    composition: "1 Sergent Fulmentarus, 4 Terminators Fulmentarus",
    effectif: { base: 5, max: 10, cout: 55 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "Ultramarines"],
    notes:
      "Les guerriers des Fulmentarus sont équipés d'armures Terminator modèle Cataphractii, renforcées pour porter tout un ensemble de systèmes de ciblage qui leur permettent à chacun de combiner leurs tirs de façon parfaitement coordonnée. Associés à la Batterie de missiles Fulmentarus, ces capteurs font des Fulmentarus une redoutable unité d'assaut lourd, qui, sans le déclenchement de l'Hérésie d'Horus, aurait peut-être un jour intégré le service à travers toutes les Legiones Astartes. Viseur Péritarque — le viseur péritarque est un système de pistage sophistiqué qui compile les arcs de balayage de multiples unités d'augure portées à travers une escouade pour former une superposition de projections de trajectoire détaillées, garantissant des verrouillages de cible inéluctables. Quand une Unité qui inclut des Figurines dotées d'un Viseur Péritarque est sélectionnée pour faire une Attaque de Tir, si cette Unité est restée Stationnaire lors de la Phase de Mouvement précédente de son Joueur en Contrôle, aucun Jet de Mitigation de Dégâts de Dissimulation ne peut être fait contre les attaques faites dans le cadre de cette Attaque de Tir. De plus, le Joueur en Contrôle peut faire un Test d'Intelligence pour cette Unité : en cas de réussite, jusqu'à la résolution complète de cette Attaque de Tir, la caractéristique de Capacité de Tir de Base des Figurines de cette Unité dotées d'un Viseur Péritarque est modifiée de +1. Batterie de missiles Fulmentarus — conçue à partir de l'étude et du perfectionnement du lance-missiles Cyclone employé pour la première fois par les Tyrans de Siège Terminators, la Batterie de missiles Fulmentarus utilise des missiles à éclats longue portée pour soumettre des ennemis dont le blindage ou l'endurance innée les rendent insensibles aux armes de moindre puissance, ou des missiles à plasma Hellfire avancés qui explosent à l'intérieur de leur cible.",
    equipement: ["Combi-bolter", "Batterie de missiles Fulmentarus", "Viseur Péritarque"],
    variantes: [
      {
        nom: "Escouade Terminator Fulmentarus",
        cout: 0,
        profils: [
          {
            nom: "Terminator Fulmentarus",
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
            nom: "Sergent Fulmentarus",
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
          "Protocoles de Tir (2)",
          "Unité d'Appui (1)",
        ],
        type: "Sergent Fulmentarus : Infanterie (Sergent, Lourd) · Terminator Fulmentarus : Infanterie (Lourd)",
      },
    ],
    options: [
      {
        type: "quantite",
        id: "arme-energetique",
        libelle: "Figurines : arme énergétique (à la place du Viseur Péritarque)",
        cout: 0,
        parTranche: 1,
        groupe: "melee",
        ajoute: "Arme énergétique (à la place du Viseur Péritarque)",
      },
      {
        type: "quantite",
        id: "gantelet-energetique",
        libelle: "Figurines : gantelet énergétique (à la place du Viseur Péritarque)",
        cout: 5,
        parTranche: 1,
        groupe: "melee",
        ajoute: "Gantelet énergétique (à la place du Viseur Péritarque)",
      },
      {
        type: "quantite",
        id: "poing-tronconneur",
        libelle: "Figurines : poing tronçonneur (à la place du Viseur Péritarque)",
        cout: 10,
        parTranche: 1,
        groupe: "melee",
        ajoute: "Poing tronçonneur (à la place du Viseur Péritarque)",
      },
      {
        type: "case",
        id: "marteau-thunder",
        libelle: "Sergent Fulmentarus : Marteau Thunder (à la place du Viseur Péritarque)",
        cout: 10,
        ajoute: "Sergent Fulmentarus : Marteau Thunder (à la place du Viseur Péritarque)",
      },
    ],
    legion: "XIII",
  },
  {
    id: "escouade-destructeurs-nemesis",
    nom: "Escouade de Destructeurs Némésis",
    legacy: true,
    categorie: "Assaut Lourd",
    cout: 165,
    composition: "1 Sergent Destructeur Némésis, 9 Destructeurs Némésis",
    effectif: { base: 10, max: 20, cout: 15 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "Ultramarines"],
    notes:
      "Les escouades de Destructeurs du Chapitre Némésis des Ultramarines jouèrent un rôle déterminant dans la résistance de la Légion à l'assaut des Word Bearers sur Calth. Contrairement à de nombreux cadres de Destructeurs, il était courant pour le Chapitre Némésis de conserver une forte proportion de bolters comme armement principal, complétant leur flexibilité tactique par l'ajout de charges de munitions spécialisées à base de composés chimiques incendiaires ou acides conçus pour semer une destruction telle que la peur briserait l'esprit des survivants.",
    equipement: [
      "Bolter mortifère",
      "Pistolet bolter",
      "Épée tronçonneuse (Sergent Destructeur Némésis seulement)",
      "Grenades Frag",
      "Grenades Krak",
      "Grenades Rad",
    ],
    variantes: [
      {
        nom: "Escouade de Destructeurs Némésis",
        cout: 0,
        profils: [
          {
            nom: "Destructeur Némésis",
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
          {
            nom: "Sergent Destructeur Némésis",
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
              Inv: "—",
            },
          },
        ],
        regles: [],
        type: "Sergent Destructeur Némésis : Infanterie (Sergent) · Destructeur Némésis : Infanterie",
      },
    ],
    options: [
      {
        type: "choix",
        id: "sergent-melee",
        libelle: "Sergent Destructeur Némésis : objet de la liste des Armes de Mêlée de Sergent de Légion",
        remplace: "Épée tronçonneuse (Sergent Destructeur Némésis seulement)",
        prefixeFiche: "Sergent Destructeur Némésis : ",
        choix: [
          { nom: "— Conserver l'épée tronçonneuse —", cout: 0 },
          ...depuisListes(LISTES_EQUIPEMENT.meleeSergent),
        ],
      },
      {
        type: "choix",
        id: "equipement-legion-1",
        libelle: "Équipement de Légion (1er Destructeur Némésis, deux max dans l'unité)",
        ajoute: true,
        prefixeFiche: "Destructeur Némésis : ",
        choix: [
          { nom: "— Aucun —", cout: 0 },
          { nom: "Nuncio-vox", cout: 10 },
          { nom: "Scanner augure", cout: 10 },
        ],
      },
      {
        type: "choix",
        id: "equipement-legion-2",
        libelle: "Équipement de Légion (2e Destructeur Némésis)",
        ajoute: true,
        prefixeFiche: "Destructeur Némésis : ",
        choix: [
          { nom: "— Aucun —", cout: 0 },
          { nom: "Nuncio-vox", cout: 10 },
          { nom: "Scanner augure", cout: 10 },
        ],
      },
      {
        type: "case",
        id: "bombes-fusion",
        libelle: "Sergent Destructeur Némésis : bombes à fusion",
        cout: 10,
        ajoute: "Sergent Destructeur Némésis : bombes à fusion",
      },
      {
        type: "case",
        id: "bombes-phosphex",
        libelle: "Sergent Destructeur Némésis : bombes à phosphex",
        cout: 10,
        ajoute: "Sergent Destructeur Némésis : bombes à phosphex",
      },
      {
        type: "quantite",
        id: "chargeur-volkite",
        libelle: "Figurines (une par tranche de cinq) : chargeur volkite (à la place du bolter mortifère)",
        cout: 5,
        parTranche: 5,
        groupe: "lourd",
        ajoute: "Chargeur volkite (à la place du bolter mortifère)",
      },
      {
        type: "quantite",
        id: "lance-flammes",
        libelle: "Figurines (une par tranche de cinq) : lance-flammes (à la place du bolter mortifère)",
        cout: 5,
        parTranche: 5,
        groupe: "lourd",
        ajoute: "Lance-flammes (à la place du bolter mortifère)",
      },
      {
        type: "quantite",
        id: "fusil-plasma",
        libelle: "Figurines (une par tranche de cinq) : fusil à plasma (à la place du bolter mortifère)",
        cout: 10,
        parTranche: 5,
        groupe: "lourd",
        ajoute: "Fusil à plasma (à la place du bolter mortifère)",
      },
      {
        type: "quantite",
        id: "fuseur",
        libelle: "Figurines (une par tranche de cinq) : fuseur (à la place du bolter mortifère)",
        cout: 15,
        parTranche: 5,
        groupe: "lourd",
        ajoute: "Fuseur (à la place du bolter mortifère)",
      },
      {
        type: "quantite",
        id: "fusil-gravitons",
        libelle: "Figurines (une par tranche de cinq) : fusil à gravitons (à la place du bolter mortifère)",
        cout: 15,
        parTranche: 5,
        groupe: "lourd",
        ajoute: "Fusil à gravitons (à la place du bolter mortifère)",
      },
      {
        type: "quantite",
        // « Lascutter » : profil d'arme non donné dans l'extrait fourni
        // (pas d'encart WARGEAR sur cette fiche) — à compléter depuis le
        // livre au besoin.
        id: "lascutter",
        libelle: "Figurines (une par tranche de cinq) : Lascutter (à la place du bolter mortifère)",
        cout: 15,
        parTranche: 5,
        groupe: "lourd",
        ajoute: "Lascutter (à la place du bolter mortifère)",
      },
      {
        type: "quantite",
        id: "bolter-lourd",
        libelle: "Figurines (une par tranche de cinq) : bolter lourd (à la place du bolter mortifère)",
        cout: 10,
        parTranche: 5,
        groupe: "lourd",
        ajoute: "Bolter lourd (à la place du bolter mortifère)",
      },
      {
        type: "quantite",
        id: "lance-missiles-destructeur",
        libelle: "Figurines (une par tranche de cinq) : Lance-missiles de Destructeur — Missile Rad (à la place du bolter mortifère)",
        cout: 15,
        parTranche: 5,
        groupe: "lourd",
        ajoute: "Lance-missiles de Destructeur — Missile Rad (à la place du bolter mortifère)",
      },
    ],
    legion: "XIII",
  },
  {
    id: "telemechrus-honore",
    nom: "Telemechrus Honoré",
    legacy: true,
    categorie: "Engins de Guerre",
    cout: 170,
    composition: "1 Telemechrus Honoré",
    traits: ["Loyaliste", "Ultramarines", "Écran de Fumée"],
    notes:
      "Telemechrus n'avait servi sa Légion que dix ans quand il fut enchâssé dans un Dreadnought Contemptor. Au moment de la trahison des Word Bearers à Calth, il se trouvait en animation suspendue, hébergé dans la soute d'un vaisseau de transport dans le cadre du contingent. Quand ce vaisseau fut détruit, le caisson de transport contenant son châssis désactivé chuta à travers l'orbite et s'écrasa à la surface. Au lieu d'être détruit par l'impact, Telemechrus fut réveillé par des transmissions vox d'urgence, émergeant de son container fracassé miraculeusement indemne avant de rejoindre les batailles pour repousser l'assaut traître des Word Bearers.",
    equipement: ["Canon d'assaut Kheres", "Poing énergétique Gravis", "Combi-bolter"],
    variantes: [
      {
        nom: "Telemechrus Honoré",
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
        regles: ["Massif (6)", "Explose (5+)", "Avance Implacable", "Haine (Word Bearers)"],
        type: "Marcheur (Unique)",
      },
    ],
    options: [],
    legion: "XIII",
  },

  /* ----------------------------------------------------------
     UNITÉS RÉSERVÉES À LA Ire LÉGION (DARK ANGELS)
     Corswain et Marduk Sedras sont deux Seigneurs d'Ordre distincts
     (Neuvième / Vingt-troisième Ordre) : rien ne les rend mutuellement
     exclusifs, tous deux peuvent coexister dans la même Armée.
     ---------------------------------------------------------- */
  {
    id: "lion-eljonson",
    nom: "Lion El'Jonson",
    categorie: "Seigneur de Guerre",
    cout: 460,
    composition: "1 Lion El'Jonson",
    notes:
      "Le Premier Primarque, Le Lion, Le Fils de la Forêt, Primarque des Dark Angels.",
    traits: ["Loyaliste", "Dark Angels", "Maître de la Légion"],
    equipement: [
      "L'Épée du Lion",
      "Le Fusil Actinaeus",
      "Grenades à stase",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Lion El'Jonson",
        cout: 0,
        profil: {
          M: 8,
          CC: 8,
          CT: 6,
          F: 7,
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
          "Sire des Dark Angels",
          "Massif (4)",
          "Le Courroux du Lion",
          "Guerrier Éternel (2)",
        ],
        type: "Parangon (Unique)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "arme-principale",
        libelle: "Échanger gratuitement l'Épée du Lion contre la Lame du Loup",
        remplace: "L'Épée du Lion",
        choix: [
          { nom: "— Conserver l'Épée du Lion —", cout: 0 },
          { nom: "La Lame du Loup", cout: 0 },
        ],
      },
    ],
    legion: "I",
  },
  {
    id: "corswain",
    nom: "Corswain",
    categorie: "Quartier Général",
    cout: 220,
    composition: "1 Corswain",
    notes: "Paladin du Neuvième Ordre.",
    traits: ["Loyaliste", "Dark Angels", "Maître de la Légion"],
    equipement: [
      "Bolter",
      "Pistolet bolter",
      "La Lame",
      "Armure de la Forêt",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Corswain",
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
        regles: [],
        type: "Infanterie (Unique, État-major)",
      },
    ],
    options: [],
    legion: "I",
  },
  {
    id: "marduk-sedras",
    nom: "Marduk Sedras",
    categorie: "Quartier Général",
    cout: 225,
    composition: "1 Marduk Sedras",
    notes: "Seigneur du Vingt-troisième Ordre.",
    traits: ["Loyaliste", "Dark Angels", "Maître de la Légion"],
    equipement: ["Brûleur à plasma", "Bombes à phosphex", "La Mort des Mondes"],
    variantes: [
      {
        nom: "Marduk Sedras",
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
        regles: [
          "Ancien de la Guerre",
          "Massif (2)",
          "Avance Implacable",
          "Lent et Méthodique",
        ],
        type: "Infanterie (Unique, État-major, Lourd)",
      },
    ],
    options: [],
    legion: "I",
  },
  {
    id: "detachement-compagnons-deathwing",
    nom: "Détachement de Compagnons de la Deathwing",
    categorie: "Suites",
    cout: 175,
    composition: "1 Horkophore de la Deathwing, 4 Compagnons de la Deathwing",
    effectif: { base: 5, max: 10, cout: 30 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "Dark Angels"],
    notes:
      "Les meilleurs guerriers et vétérans de la Deathwing forment les rangs des Compagnons, dont chaque détachement jure de garantir la protection des officiers qui leur sont confiés.",
    equipement: [
      "Lame de Caliban",
      "Bolter",
      "Pistolet bolter",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Détachement de Compagnons de la Deathwing",
        cout: 0,
        profils: [
          {
            nom: "Compagnon de la Deathwing",
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
            nom: "Horkophore de la Deathwing",
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
              Inv: "5+",
            },
          },
        ],
        regles: ["Guerrier Éternel (1)", "Compagnons"],
        type: "Horkophore de la Deathwing : Infanterie (Sergent) · Compagnon de la Deathwing : Infanterie",
      },
    ],
    options: [
      {
        type: "quantite",
        id: "gantelet-energetique",
        libelle:
          "Figurines : gantelet énergétique (à la place de la lame de Caliban)",
        cout: 5,
        parTranche: 1,
        groupe: "arme-cac",
        ajoute: "Gantelet énergétique (à la place de la lame de Caliban)",
      },
      {
        type: "quantite",
        id: "espadon-terranique",
        libelle:
          "Figurines : espadon terranique (à la place de la lame de Caliban)",
        cout: 5,
        parTranche: 1,
        groupe: "arme-cac",
        ajoute: "Espadon terranique (à la place de la lame de Caliban)",
      },
      {
        type: "quantite",
        id: "egide-cytheron",
        libelle:
          "Figurines : égide modèle Cytheron (à la place du pistolet bolter)",
        cout: 10,
        parTranche: 1,
        groupe: "pistolet-bolter-swap",
        ajoute: "Égide modèle Cytheron (à la place du pistolet bolter)",
      },
      {
        type: "quantite",
        id: "pistolet-plasma",
        libelle:
          "Figurines : pistolet à plasma (à la place du pistolet bolter)",
        cout: 10,
        parTranche: 1,
        groupe: "pistolet-bolter-swap",
        ajoute: "Pistolet à plasma (à la place du pistolet bolter)",
      },
      optionBombesFusionUnite(),
    ],
    legion: "I",
  },
  {
    id: "interemptors-dreadwing",
    nom: "Interemptors de la Dreadwing",
    categorie: "Appui",
    cout: 125,
    composition: "1 Préfet Interemptor, 4 Interemptors",
    effectif: { base: 5, max: 10, cout: 20 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "Dark Angels"],
    notes:
      "Même au sein d'une confrérie aussi sinistre que la Dreadwing, les Interemptors ont une funeste réputation du fait de leur fonction unique : l'anéantissement pur et simple de l'ennemi.",
    equipement: [
      "Brûleur à plasma",
      "Pistolet bolter",
      "Grenades Frag",
      "Grenades Krak",
      "Grenades Rad",
    ],
    variantes: [
      {
        nom: "Interemptors de la Dreadwing",
        cout: 0,
        profils: [
          {
            nom: "Interemptor",
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
              Sf: 8,
              Vo: 7,
              Int: 7,
              Sv: "3+",
              Inv: "—",
            },
          },
          {
            nom: "Préfet Interemptor",
            profil: {
              M: 7,
              CC: 4,
              CT: 4,
              F: 4,
              E: 4,
              PV: 1,
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
        regles: ["Âpre Devoir", "Unité d'Appui (1)"],
        type: "Préfet Interemptor : Infanterie (Sergent) · Interemptor : Infanterie",
      },
    ],
    options: [
      {
        type: "quantite",
        id: "lance-missiles-destructeur",
        libelle:
          "Figurines : lance-missiles de Destructeur (1 par tranche de 5, à la place du brûleur à plasma)",
        cout: 15,
        parTranche: 5,
        parTrancheMax: 1,
        groupe: "arme-lourde",
        ajoute:
          "Lance-missiles de Destructeur (à la place du brûleur à plasma)",
      },
      {
        type: "quantite",
        id: "incinerateur-plasma",
        libelle:
          "Figurines : incinérateur à plasma (1 par tranche de 5, à la place du brûleur à plasma)",
        cout: 15,
        parTranche: 5,
        parTrancheMax: 1,
        groupe: "arme-lourde",
        ajoute: "Incinérateur à plasma (à la place du brûleur à plasma)",
      },
    ],
    legion: "I",
  },
  {
    id: "cenobium-chevaliers-cercle-interieur",
    nom: "Cenobium de Chevaliers du Cercle Intérieur",
    categorie: "Elite",
    cout: 275,
    composition: "1 Précepteur de l'Ordre, 4 Cénobites de l'Ordre",
    effectif: { base: 5, max: 10, cout: 50 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "Dark Angels"],
    notes:
      "Les Dark Angels en tant que Légion recèlent une multitude d'Ordres et de Chambres Militantes dédiées à la conservation et au perfectionnement d'une doctrine martiale précise.",
    equipement: [
      "Espadon terranique",
      "Lance-plasma",
      "Harnais à grenades (Précepteur de l'Ordre seulement)",
    ],
    variantes: [
      {
        nom: "Cenobium de Chevaliers du Cercle Intérieur",
        cout: 0,
        profils: [
          {
            nom: "Cénobite de l'Ordre",
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
            nom: "Précepteur de l'Ordre",
            profil: {
              M: 6,
              CC: 6,
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
          "Parangons de l'Ordre",
        ],
        type: "Précepteur de l'Ordre : Infanterie (Sergent, Lourd) · Cénobite de l'Ordre : Infanterie (Lourd)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "ordre-hekatonystika",
        libelle: "Ordre de l'Hekatonystika (toute l'Unité, une seule fois)",
        ajoute: true,
        obligatoire: true,
        choix: [
          { nom: "Augures de Faiblesse", cout: 0 },
          { nom: "Icônes de Résolution", cout: 0 },
          { nom: "Tueurs de Rois", cout: 0 },
          { nom: "Chasseurs de Bêtes", cout: 0 },
          { nom: "Faucheurs d'Osts", cout: 0 },
          { nom: "Briseurs de Sorciers", cout: 0 },
        ],
      },
    ],
    legion: "I",
  },

  /* ----------------------------------------------------------
     UNITÉS RÉSERVÉES À LA VIe LÉGION (SPACE WOLVES)
     ---------------------------------------------------------- */
  {
    id: "meute-tueurs-gris",
    nom: "Meute de Tueurs Gris",
    categorie: "Troupes",
    cout: 145,
    composition: "1 Huscarl, 9 Tueurs Gris",
    effectif: { base: 10, max: 20, cout: 12 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "Space Wolves"],
    notes:
      "Alors que les escouades tactiques typiques de Terra, qui étaient tels les rouages d'une machinerie bien huilée, devenaient de plus en plus rares dans la VIe Légion, les Tueurs Gris étaient, de fait, des bandes de guerriers autonomes sur le champ de bataille.",
    equipement: [
      "Pistolet bolter",
      "Hache de Fenris",
      "Bouclier de combat",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Meute de Tueurs Gris",
        cout: 0,
        profils: [
          {
            nom: "Tueur Gris",
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
            nom: "Huscarl",
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
        type: "Huscarl : Infanterie (Sergent) · Tueur Gris : Infanterie",
      },
    ],
    options: [
      {
        type: "quantite",
        id: "bolter-echange",
        libelle: "Figurines : bolter (à la place du bouclier de combat)",
        cout: 0,
        parTranche: 1,
        ajoute: "Bolter (à la place du bouclier de combat)",
      },
      {
        type: "choix",
        id: "baionnettes",
        libelle: "Toute l'unité : baïonnettes (figurines avec bolter)",
        ajoute: true,
        parFigurine: true,
        requiertEquip: "Bolter",
        prefixeFiche: "Toute l'unité : ",
        choix: [
          { nom: "— Aucune —", cout: 0 },
          { nom: "Baïonnette", cout: 1 },
          { nom: "Baïonnette tronçonneuse", cout: 2 },
        ],
      },
      {
        type: "choix",
        id: "huscarl-arme",
        libelle: "Le Huscarl : échanger sa hache de Fenris",
        remplace: "Hache de Fenris",
        prefixeFiche: "Huscarl : ",
        choix: [
          { nom: "— Conserver la hache de Fenris —", cout: 0 },
          { nom: "Gantelet énergétique", cout: 15 },
          { nom: "Griffe Lightning", cout: 15 },
          { nom: "Marteau Thunder", cout: 15 },
          { nom: "Épée de givre", cout: 15 },
          { nom: "Hache de givre", cout: 15 },
          { nom: "Griffe de givre", cout: 15 },
        ],
      },
      {
        type: "choix",
        id: "huscarl-pistolet",
        libelle: "Le Huscarl : échanger son pistolet bolter",
        remplace: "Pistolet bolter",
        prefixeFiche: "Huscarl : ",
        choix: [
          { nom: "— Conserver le pistolet bolter —", cout: 0 },
          ...depuisListes(LISTES_EQUIPEMENT.pistolets),
        ],
      },
      {
        type: "paire",
        id: "huscarl-paire-griffes",
        libelle:
          "Le Huscarl : paire de griffes Lightning (à la place du bolter, du pistolet bolter et de la hache de Fenris)",
        cout: 15,
        remplaceListe: ["Bolter", "Pistolet bolter", "Hache de Fenris"],
        ajoute: "Huscarl : paire de griffes Lightning",
      },
      {
        type: "case",
        id: "huscarl-bombes-fusion",
        libelle: "Le Huscarl : bombes à fusion",
        cout: 10,
        ajoute: "Bombes à fusion (Huscarl)",
      },
      {
        type: "quantite",
        id: "arme-energetique",
        libelle:
          "Figurines : arme énergétique (à la place de la hache de Fenris)",
        cout: 5,
        parTranche: 1,
        ajoute: "Arme énergétique (à la place de la hache de Fenris)",
      },
      {
        type: "quantite",
        id: "epee-tronconneuse-lourde",
        libelle:
          "Figurines : épée tronçonneuse lourde (1 par tranche de 5, à la place de la hache de Fenris)",
        cout: 2,
        parTranche: 5,
        parTrancheMax: 1,
        groupe: "arme-lourde-tueur",
        ajoute: "Épée tronçonneuse lourde (à la place de la hache de Fenris)",
      },
      {
        type: "quantite",
        id: "gantelet-energetique-tueur",
        libelle:
          "Figurines : gantelet énergétique (1 par tranche de 5, à la place de la hache de Fenris)",
        cout: 20,
        parTranche: 5,
        parTrancheMax: 1,
        groupe: "arme-lourde-tueur",
        ajoute: "Gantelet énergétique (à la place de la hache de Fenris)",
      },
      {
        type: "quantite",
        id: "griffe-lightning-tueur",
        libelle:
          "Figurines : griffe Lightning (1 par tranche de 5, à la place de la hache de Fenris)",
        cout: 10,
        parTranche: 5,
        parTrancheMax: 1,
        groupe: "arme-lourde-tueur",
        ajoute: "Griffe Lightning (à la place de la hache de Fenris)",
      },
      {
        type: "quantite",
        id: "pistolet-plasma-tueur",
        libelle:
          "Figurines : pistolet à plasma (1 par tranche de 5, à la place du pistolet bolter)",
        cout: 5,
        parTranche: 5,
        parTrancheMax: 1,
        groupe: "pistolet-legion-tueur",
        ajoute: "Pistolet à plasma (à la place du pistolet bolter)",
      },
      {
        type: "quantite",
        id: "lance-flammes-leger-tueur",
        libelle:
          "Figurines : lance-flammes léger (1 par tranche de 5, à la place du pistolet bolter)",
        cout: 5,
        parTranche: 5,
        parTrancheMax: 1,
        groupe: "pistolet-legion-tueur",
        ajoute: "Lance-flammes léger (à la place du pistolet bolter)",
      },
      {
        type: "quantite",
        id: "serpentine-volkite-tueur",
        libelle:
          "Figurines : serpentine volkite (1 par tranche de 5, à la place du pistolet bolter)",
        cout: 5,
        parTranche: 5,
        parTrancheMax: 1,
        groupe: "pistolet-legion-tueur",
        ajoute: "Serpentine volkite (à la place du pistolet bolter)",
      },
      {
        type: "case",
        id: "vexillum",
        libelle: "Un Tueur Gris : vexillum",
        cout: 10,
        ajoute: "Vexillum (un Tueur Gris)",
      },
      {
        type: "choix",
        id: "equipement-legion-1",
        libelle: "Équipement de Légion (1er Tueur Gris, deux max dans l'unité)",
        ajoute: true,
        prefixeFiche: "Tueur Gris : ",
        choix: [
          { nom: "— Aucun —", cout: 0 },
          { nom: "Nuncio-vox", cout: 10 },
          { nom: "Scanner augure", cout: 10 },
        ],
      },
      {
        type: "choix",
        id: "equipement-legion-2",
        libelle: "Équipement de Légion (2e Tueur Gris)",
        ajoute: true,
        prefixeFiche: "Tueur Gris : ",
        choix: [
          { nom: "— Aucun —", cout: 0 },
          { nom: "Nuncio-vox", cout: 10 },
          { nom: "Scanner augure", cout: 10 },
        ],
      },
    ],
    legion: "VI",
  },
  {
    id: "meute-mort-jures",
    nom: "Meute de Mort-jurés",
    categorie: "Assaut Lourd",
    cout: 175,
    composition: "5 Mort-jurés",
    effectif: { base: 5, max: 10, cout: 30 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "Space Wolves"],
    notes:
      "Chaque Légion avait des guerriers dont l'âme avait été affligée par les actes sanglants qu'ils avaient commis au cours de la Grande Croisade, au point qu'ils n'étaient plus des Space Marines, mais des êtres ressentant un vide intérieur inhumain et une soif de meurtre insensée. Chez les Space Wolves, ces pulsions étaient mieux comprises : les guerriers concernés devenaient des Mort-jurés.",
    equipement: [
      "Hache énergétique",
      "Pistolet bolter",
      "Grenades Frag",
      "Grenades Krak",
      "Bombes à stase de classe Ymira",
    ],
    variantes: [
      {
        nom: "Meute de Mort-jurés",
        cout: 0,
        profil: {
          M: 7,
          CC: 4,
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
          Sv: "2+",
          Inv: "—",
        },
        regles: ["Les Songes du Loup Funeste", "Âpre Devoir"],
        type: "Infanterie",
      },
    ],
    options: [],
    legion: "VI",
  },
  {
    id: "escouade-terminator-gardes-loups-varagyr",
    nom: "Escouade Terminator de Gardes Loups Varagyr",
    categorie: "Elite",
    cout: 250,
    composition: "1 Thegn, 4 Varagyr",
    effectif: { base: 5, max: 10, cout: 45 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "Space Wolves"],
    notes:
      "Les Gardes Loups Varagyr sont les élus de Leman Russ, choisis au sein de sa propre Grande Compagnie pour former sa garde personnelle et son conseil de guerre.",
    equipement: ["Combi-bolter", "Hache de givre"],
    variantes: [
      {
        nom: "Escouade Terminator de Gardes Loups Varagyr",
        cout: 0,
        profils: [
          {
            nom: "Varagyr",
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
              Sf: 9,
              Vo: 7,
              Int: 7,
              Sv: "2+",
              Inv: "4+",
            },
          },
          {
            nom: "Thegn",
            profil: {
              M: 6,
              CC: 5,
              CT: 4,
              F: 4,
              E: 5,
              PV: 2,
              I: 4,
              A: 4,
              Cd: 9,
              Sf: 9,
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
          "Avant-garde (4)",
          "Peur (1)",
          "Fléau des Seigneurs",
        ],
        type: "Thegn : Infanterie (Champion, Sergent, Lourd) · Varagyr : Infanterie (Lourd)",
      },
    ],
    options: [],
    legion: "VI",
  },
  {
    id: "freres-loups-de-russ",
    nom: "Frères Loups de Russ",
    categorie: "Suites",
    cout: 100,
    composition: "1 Freki, 1 Geri",
    traits: ["Loyaliste", "Space Wolves"],
    notes:
      "On dit que ces deux animaux sont les compagnons du Roi Loup depuis ses premières heures sur le sol gelé de Fenris, et qu'ils le considèrent comme un des leurs.",
    equipement: ["Crocs et Griffes"],
    variantes: [
      {
        nom: "Frères Loups de Russ",
        cout: 0,
        profils: [
          {
            nom: "Freki",
            profil: {
              M: 10,
              CC: 5,
              CT: "—",
              F: 5,
              E: 5,
              PV: 4,
              I: 5,
              A: 4,
              Cd: 8,
              Sf: 5,
              Vo: 5,
              Int: 3,
              Sv: "—",
              Inv: "5+",
            },
          },
          {
            nom: "Geri",
            profil: {
              M: 10,
              CC: 7,
              CT: "—",
              F: 5,
              E: 5,
              PV: 4,
              I: 5,
              A: 3,
              Cd: 8,
              Sf: 5,
              Vo: 3,
              Int: 3,
              Sv: "—",
              Inv: "5+",
            },
          },
        ],
        regles: [
          "Peur (1)",
          "Négligence",
          "Massif (4)",
          "Insensible à la Douleur (5+)",
          "Vif (2)",
          "Frères Loups de Russ",
        ],
        type: "Freki : Infanterie (Unique) · Geri : Infanterie (Unique)",
      },
    ],
    options: [],
    legion: "VI",
  },
  {
    id: "tireur-de-runes",
    nom: "Tireur de Runes",
    categorie: "État-major",
    cout: 110,
    composition: "1 Tireur de Runes",
    traits: ["[Allégeance]", "Space Wolves", "Psyker"],
    notes:
      "Les Tireurs de Runes tiennent leurs pouvoirs de matrices psychiques à la technologie mal comprise, mais aussi de rituels de Fenris, car ils sont les héritiers des cultures chamaniques de leur planète.",
    equipement: [
      "Bâton de force",
      "Hache de givre",
      "Pistolet bolter",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Tireur de Runes",
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
          { nom: "Runomancie", cout: 15 },
          { nom: "Biomancie", cout: 15 },
          { nom: "Divination", cout: 20 },
          { nom: "Télékinésie", cout: 20 },
        ],
      },
    ],
    legion: "VI",
  },
  {
    id: "geigor-main-terrible",
    nom: "Geigor Main Terrible",
    categorie: "État-major",
    cout: 105,
    composition: "1 Geigor Main Terrible",
    notes: "Thegn des Space Wolves, Commandant de la Griffe Brisée.",
    traits: ["Loyaliste", "Space Wolves"],
    equipement: [
      "Bolter",
      "Pistolet bolter",
      "La Main Terrible",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Geigor Main Terrible",
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
          Cd: 10,
          Sf: 8,
          Vo: 9,
          Int: 8,
          Sv: "2+",
          Inv: "5+",
        },
        regles: ["Officier de Ligne (2)"],
        type: "Infanterie (Unique, État-major)",
      },
    ],
    options: [],
    legion: "VI",
  },
  {
    id: "hvarl-lamerouge",
    nom: "Hvarl Lamerouge",
    categorie: "Quartier Général",
    cout: 210,
    composition: "1 Hvarl Lamerouge",
    notes:
      "Jarl de la Quatrième Grande Compagnie, Le Ravageur, Le Bourreau de Koltok.",
    traits: ["Loyaliste", "Space Wolves", "Maître de la Légion"],
    equipement: ["Fend l'Âtre", "Bolter lourd"],
    variantes: [
      {
        nom: "Hvarl Lamerouge",
        cout: 0,
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
        regles: ["Preneur de Têtes", "Massif (2)", "Peur (1)"],
        type: "Infanterie (Unique, État-major)",
      },
    ],
    options: [],
    legion: "VI",
  },
  {
    id: "leman-russ",
    nom: "Leman Russ",
    categorie: "Seigneur de Guerre",
    cout: 450,
    composition: "1 Leman Russ",
    notes:
      "Le Roi Loup de Fenris, Le Seigneur de l'Hiver et de la Ruine, Primarque des Space Wolves.",
    traits: ["Loyaliste", "Space Wolves", "Maître de la Légion"],
    equipement: [
      "La Hache de l'Infernhiver",
      "L'Épée de Malenuit",
      "Crache-mépris",
    ],
    variantes: [
      {
        nom: "Leman Russ",
        cout: 0,
        profil: {
          M: 8,
          CC: 8,
          CT: 6,
          F: 7,
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
          "Sire des Space Wolves",
          "Massif (5)",
          "Hurlement du Loup Funeste",
          "Guerrier Éternel (2)",
        ],
        type: "Parangon (Unique)",
      },
    ],
    options: [],
    legion: "VI",
  },

  /* ----------------------------------------------------------
     UNITÉS RÉSERVÉES À LA Xe LÉGION (IRON HANDS)
     ---------------------------------------------------------- */
  {
    id: "escouade-immortels-medusa",
    nom: "Escouade d'Immortels de Medusa",
    categorie: "Troupes",
    cout: 95,
    composition: "1 Sergent Immortel, 4 Immortels",
    effectif: { base: 5, max: 20, cout: 15 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "Iron Hands", "Bouclier"],
    notes:
      "Pour les Légionnaires Iron Hands qui avaient failli aux critères inflexibles et au rude code de leur sire, en subissant une défaite sur un coup du sort ou en étant diminués par des blessures graves, il restait une alternative si leurs états de service n'étaient pas suffisants pour leur épargner le mépris de leurs frères : rejoindre les rangs des Immortels de Medusa.",
    equipement: [
      "Bolter",
      "Pistolet bolter",
      "Bouclier d'abordage",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Escouade d'Immortels de Medusa",
        cout: 0,
        profils: [
          {
            nom: "Immortel",
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
              Sf: 10,
              Vo: 7,
              Int: 7,
              Sv: "3+",
              Inv: "5+",
            },
          },
          {
            nom: "Sergent Immortel",
            profil: {
              M: 7,
              CC: 4,
              CT: 4,
              F: 4,
              E: 4,
              PV: 1,
              I: 4,
              A: 1,
              Cd: 9,
              Sf: 10,
              Vo: 7,
              Int: 7,
              Sv: "3+",
              Inv: "5+",
            },
          },
        ],
        regles: [
          "Insensible à la Douleur (5+)",
          "Avance Implacable",
          "Sacrifiable (2)",
        ],
        type: "Sergent Immortel : Infanterie (Sergent, Lourd) · Immortel : Infanterie (Lourd)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "sergent-arme",
        libelle: "Le Sergent Immortel : échanger son bolter",
        remplace: "Bolter",
        prefixeFiche: "Sergent Immortel : ",
        choix: [
          { nom: "— Conserver le bolter —", cout: 0 },
          ...depuisListes(
            LISTES_EQUIPEMENT.meleeSergent,
            LISTES_EQUIPEMENT.combinees,
          ),
        ],
      },
      {
        type: "choix",
        id: "sergent-pistolet",
        libelle: "Le Sergent Immortel : échanger son pistolet bolter",
        remplace: "Pistolet bolter",
        prefixeFiche: "Sergent Immortel : ",
        choix: [
          { nom: "— Conserver le pistolet bolter —", cout: 0 },
          ...depuisListes(LISTES_EQUIPEMENT.pistolets),
        ],
      },
      {
        type: "case",
        id: "sergent-bombes-fusion",
        libelle: "Le Sergent Immortel : bombes à fusion",
        cout: 10,
        ajoute: "Bombes à fusion (Sergent Immortel)",
      },
      {
        type: "quantite",
        id: "fusil-gravitons",
        libelle:
          "Figurines : fusil à gravitons (1 par tranche de 5, à la place du bolter)",
        cout: 10,
        parTranche: 5,
        parTrancheMax: 1,
        groupe: "arme-lourde-immortel",
        ajoute: "Fusil à gravitons (à la place du bolter)",
      },
      {
        type: "quantite",
        id: "decoupeur-laser",
        libelle:
          "Figurines : découpeur laser (1 par tranche de 5, à la place du bolter)",
        cout: 10,
        parTranche: 5,
        parTrancheMax: 1,
        groupe: "arme-lourde-immortel",
        ajoute: "Découpeur laser (à la place du bolter)",
      },
    ],
    legion: "X",
  },
  {
    id: "escouade-terminator-gorgone",
    nom: "Escouade Terminator Gorgone",
    categorie: "Assaut Lourd",
    cout: 200,
    composition: "1 Martelier Gorgone, 4 Terminators Gorgones",
    effectif: { base: 5, max: 10, cout: 35 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "Iron Hands"],
    notes:
      "Le modèle d'Armure Tactique Dreadnought Gorgone était une des nombreuses tentatives de Ferrus Manus et de ses Révérends de Fer pour améliorer les différents modèles d'armure Terminator des Legiones Astartes.",
    equipement: [
      "Combi-bolter",
      "Marteau Thunder (Martelier Gorgone seulement)",
      "Harnais à grenades (Martelier Gorgone seulement)",
      "Hache énergétique d'artificier (Terminator Gorgone seulement)",
      "Armure Terminator modèle Gorgone",
    ],
    variantes: [
      {
        nom: "Escouade Terminator Gorgone",
        cout: 0,
        profils: [
          {
            nom: "Terminator Gorgone",
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
              Sf: 7,
              Vo: 9,
              Int: 7,
              Sv: "2+",
              Inv: "5+",
            },
          },
          {
            nom: "Martelier Gorgone",
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
              Vo: 9,
              Int: 8,
              Sv: "2+",
              Inv: "5+",
            },
          },
        ],
        regles: [
          "Massif (2)",
          "Avance Implacable",
          "Insensible à la Douleur (5+)",
          "Avant-garde (3)",
        ],
        type: "Martelier Gorgone : Infanterie (Sergent, Lourd) · Terminator Gorgone : Infanterie (Lourd)",
      },
    ],
    options: [],
    legion: "X",
  },
  {
    id: "reverend-de-fer",
    nom: "Révérend de Fer",
    categorie: "Quartier Général",
    cout: 175,
    composition: "1 Révérend de Fer",
    notes:
      "Reprenant les traditions des ordres techno-chamaniques de Medusa, les Révérends de Fer étaient des forgerons de talent, bien loin de conseillers ou d'arbitres des désaccords entre officiers de Clans différents.",
    traits: ["[Allégeance]", "Iron Hands", "Maître de la Légion"],
    equipement: [
      "Hache énergétique d'artificier",
      "Chargeur volkite",
      "Servobras",
      "Scanner augure",
      "Contrôleur de cortex",
    ],
    variantes: [
      {
        nom: "Révérend de Fer",
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
          Int: 10,
          Sv: "2+",
          Inv: "4+",
        },
        regles: [
          "Massif (2)",
          "Guerrier-artisan (2)",
          "Insensible à la Douleur (5+)",
          "Avance Implacable",
          "Lent et Méthodique",
          "Seigneur des Automates",
        ],
        type: "Infanterie (État-major, Lourd)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "arme-tir",
        libelle: "Échanger le chargeur volkite",
        remplace: "Chargeur volkite",
        choix: [
          { nom: "— Conserver le chargeur volkite —", cout: 0 },
          ...depuisListes(LISTES_EQUIPEMENT.combinees),
        ],
      },
      {
        type: "choix",
        id: "arme-cac",
        libelle: "Échanger la hache énergétique d'artificier",
        remplace: "Hache énergétique d'artificier",
        choix: [
          { nom: "— Conserver la hache énergétique d'artificier —", cout: 0 },
          { nom: "Marteau Thunder", cout: 10 },
          { nom: "Lame de parangon", cout: 15 },
        ],
      },
      {
        type: "case",
        id: "cyber-familier",
        libelle: "Cyber-familier",
        cout: 10,
        ajoute: "Cyber-familier",
      },
    ],
    legion: "X",
  },
  {
    id: "shadrak-meduson",
    nom: "Shadrak Meduson",
    categorie: "Quartier Général",
    cout: 175,
    composition: "1 Shadrak Meduson",
    notes:
      "Chef de Guerre des Iron Hands, Maître des Légions Brisées, Seigneur du Clan Sorrgol.",
    traits: ["Loyaliste", "Iron Hands", "Maître de la Légion"],
    equipement: [
      "Ire de la Tempête",
      "Gladius énergétique albien",
      "Servobras",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Shadrak Meduson",
        cout: 0,
        profil: {
          M: 7,
          CC: 5,
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
        regles: ["Guerrier-artisan (1)"],
        type: "Infanterie (Unique, État-major)",
      },
    ],
    options: [],
    legion: "X",
  },
  {
    id: "ferrus-manus",
    nom: "Ferrus Manus",
    categorie: "Seigneur de Guerre",
    cout: 465,
    composition: "1 Ferrus Manus",
    notes:
      "Maître des Iron Hands, La Gorgone, Tueur de Ver, Le Grand Révérend de Fer.",
    traits: ["Loyaliste", "Iron Hands", "Maître de la Légion"],
    equipement: [
      "Brise-forge",
      "La Carapace de Medusa",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Ferrus Manus",
        cout: 0,
        profil: {
          M: 8,
          CC: 7,
          CT: 6,
          F: 7,
          E: 7,
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
          "Sire des Iron Hands",
          "Massif (5)",
          "Guerrier-artisan (4)",
          "Trempé par la Guerre",
          "Guerrier Éternel (2)",
        ],
        type: "Parangon (Unique)",
      },
    ],
    options: [],
    legion: "X",
  },

  /* ----------------------------------------------------------
     UNITÉS RÉSERVÉES À LA XVIe LÉGION (SONS OF HORUS)
     Transcrit depuis photos du livre d'armée : plusieurs pages sont
     partiellement masquées par la reliure (Ezekyle Abaddon, Horus
     Aximand, Maloghurst le Retors) ou peu lisibles (Horus Lupercal,
     Horus Exalté). Coûts en Points confirmés par Jean : Ezekyle
     Abaddon (250), Horus Aximand (170), Horus Lupercal (530), Horus
     Exalté (850). Les profils et coûts encore marqués « À VÉRIFIER »
     ci-dessous restent une estimation de transcription : à corriger
     contre le livre en cas de doute (voir l'en-tête du fichier).
     Horus et Horus Exalté (`excluAvec`) sont mutuellement exclusifs :
     deux formes du même Primarque, jamais les deux à la fois dans la
     même Armée (voir uniteAccessible, js/unites.js) — même mécanique
     qu'Angron / Angron Transfiguré.
     ---------------------------------------------------------- */
  {
    id: "horus",
    nom: "Horus Lupercal",
    categorie: "Seigneur de Guerre",
    cout: 530,
    composition: "1 Horus",
    notes:
      "Maître de Guerre, Primarque des Sons of Horus, le Tueur de Tyrans, le Fils Favori.",
    traits: ["Renégat", "Sons of Horus", "Maître de la Légion"],
    equipement: [
      "La Serre du Maître de Guerre",
      "Briseuse de Mondes",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Horus Lupercal",
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
          "Sire des Sons of Horus",
          "Massif (6)",
          "Frappe en Profondeur",
          "Maître de la Guerre",
          "Guerrier Éternel (2)",
        ],
        type: "Parangon (Unique)",
      },
    ],
    options: [],
    excluAvec: ["horus-exalte"],
    legion: "XVI",
  },
  {
    id: "horus-exalte",
    nom: "Horus Exalté",
    categorie: "Seigneur de Guerre",
    cout: 850,
    composition: "1 Horus Exalté",
    notes: "Le Roi Jiyuan, Le Fils Félon, Maître de l'Imperium.",
    traits: ["Maître de la Légion"],
    equipement: [
      "La Serre du Maître de Guerre",
      "Briseuse de Mondes",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Horus Exalté",
        cout: 0,
        // Profil À VÉRIFIER (page peu lisible) : forme ascensionnée
        // d'Horus, gabarit rapproché de celui d'Angron Transfiguré.
        profil: {
          M: 10,
          CC: 9,
          CT: 6,
          F: 7,
          E: 7,
          PV: 7,
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
          "Maître Profondeur",
          "Insensible à la Douleur (5+)",
          "Le Maître de Guerre Exalté",
          "L'Ensemble de la Légion",
          "La Corruption se Propage",
          "Guerrier Éternel (2)",
        ],
        type: "Parangon (Unique)",
      },
    ],
    options: [],
    excluAvec: ["horus"],
    legion: "XVI",
  },
  {
    id: "ezekyle-abaddon",
    nom: "Ezekyle Abaddon",
    categorie: "Quartier Général",
    cout: 250,
    composition: "1 Ezekyle Abaddon",
    notes:
      "Premier Capitaine des Sons of Horus, Grand Maréchal des Justaerin. Ezekyle Abaddon était un guerrier hors pair et le commandant des Terminators Justaerin. Semblable à bien des égards à son Primarque, il partageait notamment avec Horus une sauvagerie au combat et un sens inné de la tactique qui lui valurent presque autant de victoires que son Primarque. Jadis considéré comme un héros de l'Imperium, Abaddon était avant tout dévoué à Horus, et il le suivit de plein gré sur la voie de la damnation.",
    traits: ["Renégat", "Sons of Horus", "Maître de la Légion"],
    equipement: [
      "Combi-bolter Banestrike",
      "Harnais à grenades",
      "Griffe Énergétique Cthonienne",
    ],
    variantes: [
      {
        nom: "Ezekyle Abaddon",
        cout: 0,
        profil: {
          M: 6,
          CC: 7,
          CT: 5,
          F: 4,
          E: 5,
          PV: 5,
          I: 5,
          A: 6,
          Cd: 10,
          Sf: 9,
          Vo: 9,
          Int: 9,
          Sv: "2+",
          Inv: "4+",
        },
        regles: [
          "Massif (2)",
          "Avance Implacable",
          "Lent et Méthodique",
          "Frappe en Profondeur",
          "Maître des Justaerin",
          "Guerrier Éternel (1)",
        ],
        type: "Infanterie (Unique, État-major, Lourd)",
      },
    ],
    options: [
      {
        type: "paire",
        id: "lame-parangon",
        libelle:
          "Échanger gratuitement le combi-bolter Banestrike et le harnais à grenades contre une lame de parangon",
        cout: 0,
        ajoute:
          "Lame de parangon (à la place du combi-bolter Banestrike et du harnais à grenades)",
        remplaceListe: ["Combi-bolter Banestrike", "Harnais à grenades"],
      },
    ],
    legion: "XVI",
  },
  {
    id: "horus-aximand",
    nom: "Horus Aximand",
    categorie: "Quartier Général",
    cout: 170,
    composition: "1 Horus Aximand",
    notes:
      "« L'Autre » Horus Aximand, Capitaine de la 5e Compagnie, Demi-lune du Mournival. Surnommé « L'Autre Horus » en raison de sa ressemblance saisissante avec le Maître de Guerre, Aximand était un capitaine de haut rang, membre du Mournival d'Horus. Suite au massacre de ses ex-frères sur Isstvan III, les rêves d'Aximand furent hantés par des apparitions de son frère Garviel Loken, et il en vint à douter en secret du bien-fondé de la cause du Maître de Guerre.",
    traits: ["Renégat", "Sons of Horus", "Maître de la Légion", "Bouclier"],
    equipement: [
      "Deuil-de-Tout",
      "Bolter Banestrike",
      "Pistolet bolter",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Horus Aximand",
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
        regles: ["Hanté", "Impact (I)"],
        type: "Infanterie (Unique, État-major)",
      },
    ],
    options: [],
    legion: "XVI",
  },
  {
    id: "tybalt-marr",
    nom: "Tybalt Marr",
    categorie: "Quartier Général",
    cout: 160,
    composition: "1 Tybalt Marr",
    notes:
      "Capitaine de la 18e Compagnie, « Soit l'Un », Chasseur de l'Iron Heart. Chargé de pourchasser les survivants du Massacre du Site d'Atterrissage d'Isstvan V, Marr était derrière la destruction du Conseil des Clans des Iron Hands sur Oqueth Minor. Il poursuivit sa traque trois années durant, et en vint à respecter Shadrak Meduson autant qu'il le haïssait.",
    traits: ["Renégat", "Sons of Horus", "Maître de la Légion"],
    equipement: [
      "La Lame d'Abattage",
      "Bolter Banestrike",
      "Pistolet bolter",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Tybalt Marr",
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
          Cd: 10,
          Sf: 9,
          Vo: 9,
          Int: 9,
          Sv: "2+",
          Inv: "4+",
        },
        regles: ["Haine (Légions Brisées)"],
        type: "Infanterie (Unique, État-major)",
      },
    ],
    options: [],
    legion: "XVI",
  },
  {
    id: "vheren-ashurhaddon",
    nom: "Vheren Ashurhaddon",
    categorie: "Quartier Général",
    cout: 205,
    composition: "1 Vheren Ashurhaddon",
    notes:
      "Maître des Vrais Fils, Capitaine-cadre des Sons of Horus, Le Premier Ravageur.",
    traits: ["Renégat", "Sons of Horus"],
    equipement: [
      "La Hache Serpentis",
      "Paire de Pistolets Banestrike",
      "Vexillum",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Vheren Ashurhaddon",
        cout: 0,
        profil: {
          M: 7,
          CC: 7,
          CT: 5,
          F: 4,
          E: 4,
          PV: 4,
          I: 4,
          A: 5,
          Cd: 10,
          Sf: 9,
          Vo: 9,
          Int: 9,
          Sv: "2+",
          Inv: "4+",
        },
        regles: [],
        type: "Infanterie (Unique, État-major)",
      },
    ],
    options: [],
    legion: "XVI",
  },
  {
    id: "garviel-loken",
    nom: "Garviel Loken",
    categorie: "Quartier Général",
    cout: 175,
    composition: "1 Garviel Loken",
    notes:
      "Capitaine de la 10e Compagnie, Nouvelle Lune du Mournival, Le Dernier Loup de Luna. Garviel Loken était un des capitaines de la Légion des Luna Wolves (devenue plus tard les Sons of Horus) durant les dernières années de la Grande Croisade. Admiré de ses frères de bataille comme de son Primarque, il eut l'honneur d'être admis au sein du Mournival, les proches conseillers d'Horus en personne. Après la chute d'Horus, on estima que Loken était trop fidèle à l'Empereur et fut placé à la tête des Sons of Horus lors de l'assaut sur Isstvan III.",
    // Loyaliste-né au sein d'une Légion désormais Renégate : Trait
    // figé (comme les autres personnages nommés de cette section),
    // au lieu du [Allégeance] des unités d'escouade génériques.
    traits: ["Loyaliste", "Sons of Horus", "Maître de la Légion"],
    equipement: [
      "Lame de parangon",
      "Pistolet bolter",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Garviel Loken",
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
        regles: ["Haine (Renégats)", "Survivant-né"],
        type: "Infanterie (Unique, État-major)",
      },
    ],
    options: [],
    legion: "XVI",
  },
  {
    id: "emissaire-noir",
    nom: "Émissaire Noir",
    categorie: "État-major",
    cout: 90,
    composition: "1 Émissaire Noir",
    notes:
      "Ces sinistres guerriers étaient les yeux du Maître de Guerre, recrutés parmi les Légionnaires les plus dévoués à sa cause et dépêchés dans les étoiles pour superviser et guider les forces qui faisaient allégeance à Horus. Ils étaient chargés de donner l'exemple en montrant ce que le Maître de Guerre attendait de ses partisans et en exécutant sans pitié ceux qui échouaient. Leur présence était un présage de victoire pour les renégats.",
    traits: ["Renégat", "Sons of Horus"],
    equipement: [
      "Sceptre de Sombre Autorité",
      "Pistolet bolter",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Émissaire Noir",
        cout: 0,
        profil: {
          M: 7,
          CC: 5,
          CT: 5,
          F: 4,
          E: 4,
          PV: 4,
          I: 5,
          A: 4,
          Cd: 10,
          Sf: 10,
          Vo: 9,
          Int: 8,
          Sv: "2+",
          Inv: "5+",
        },
        regles: ["Yeux du Maître de Guerre"],
        type: "Infanterie (Unique, État-major)",
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
    legion: "XVI",
  },
  {
    id: "maloghurst-le-retors",
    nom: "Maloghurst le Retors",
    categorie: "État-major",
    cout: 140,
    composition: "1 Maloghurst le Retors",
    notes:
      "L'Écuyer du Maître de Guerre, Porteur de l'Œil, La Main Dans l'Ombre. Légionnaire vétéran ayant pris part à d'innombrables campagnes, Maloghurst acquit le surnom de « Retors » en raison de sa formidable intelligence, dont il fit la démonstration à de nombreuses reprises dans son rôle d'écuyer du Primarque Horus Lupercal. Ce surnom prit une tournure cruelle lorsque Maloghurst fut grièvement blessé pendant la Grande Croisade, le forçant à se consacrer totalement à servir son maître.",
    traits: ["Renégat", "Sons of Horus"],
    equipement: [
      "Épée énergétique",
      "Bolter Banestrike",
      "Pistolet bolter",
      "Grenades Frag",
      "Grenades Krak",
      "Icône du Maître de Guerre",
    ],
    variantes: [
      {
        nom: "Maloghurst le Retors",
        cout: 0,
        profil: {
          M: 6,
          CC: 5,
          CT: 5,
          F: 4,
          E: 4,
          PV: 4,
          I: 5,
          A: 4,
          Cd: 10,
          Sf: 9,
          Vo: 9,
          Int: 10,
          Sv: "2+",
          Inv: "5+",
        },
        regles: ["Infirme", "Lent et Méthodique"],
        type: "Infanterie (Unique, État-major)",
      },
    ],
    options: [],
    legion: "XVI",
  },
  {
    id: "escouade-terminator-justaerin",
    nom: "Escouade Terminator Justaerin",
    categorie: "Elite",
    cout: 275,
    composition: "5 Justaerin",
    effectif: { base: 5, max: 10, cout: 50 },
    traits: ["[Allégeance]", "Sons of Horus"],
    notes:
      "Une des deux principales formations d'élite des Luna Wolves, et plus tard des Sons of Horus, les Justaerin faisaient la fierté de leur Légion. Chargés de former la « pointe de la lance » des assauts, ils plongeaient au cœur de la mêlée dans le but de détruire le centre du dispositif ennemi, ou pour conduire une frappe décisive contre l'état-major adverse. Nombre d'entre eux portaient des armures Terminator au combat, qu'ils avaient été parmi les premiers à adopter, exploitant le surcroît de résistance qu'elles leur conféraient pour atteindre leur cible sans encombre et l'anéantir sans coup férir.",
    equipement: ["Combi-bolter Banestrike", "Arme énergétique"],
    variantes: [
      {
        nom: "Escouade Terminator Justaerin",
        cout: 0,
        profil: {
          M: 6,
          CC: 5,
          CT: 4,
          F: 4,
          E: 5,
          PV: 2,
          I: 4,
          A: 4,
          Cd: 10,
          Sf: 8,
          Vo: 7,
          Int: 7,
          Sv: "2+",
          Inv: "4+",
        },
        regles: [
          "Massif (2)",
          "Avance Implacable",
          "Lent et Méthodique",
          "Avant-garde (4)",
        ],
        type: "Infanterie (Lourd)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "arme-tir",
        libelle: "Toute Figurine : remplacer le combi-bolter Banestrike",
        remplace: "Combi-bolter Banestrike",
        choix: [
          { nom: "— Conserver le combi-bolter Banestrike —", cout: 0 },
          {
            nom: "Chargeur volkite (à la place du combi-bolter Banestrike)",
            cout: 0,
          },
          ...depuisListes(LISTES_EQUIPEMENT.combinees),
        ],
      },
      {
        type: "choix",
        id: "arme-cac",
        libelle: "Toute Figurine : remplacer l'arme énergétique",
        remplace: "Arme énergétique",
        choix: [
          { nom: "— Conserver l'arme énergétique —", cout: 0 },
          {
            nom: "Griffe Lightning (à la place de l'arme énergétique)",
            cout: 5,
          },
          {
            nom: "Hache énergétique carsoraine (à la place de l'arme énergétique)",
            cout: 5,
          },
          {
            nom: "Gantelet énergétique (à la place de l'arme énergétique)",
            cout: 10,
          },
          {
            nom: "Poing tronçonneur (à la place de l'arme énergétique)",
            cout: 10,
          },
          {
            nom: "Marteau Thunder (à la place de l'arme énergétique)",
            cout: 10,
          },
        ],
      },
      {
        type: "paire",
        id: "paire-griffes-lightning",
        libelle:
          "Toute Figurine peut échanger son combi-bolter Banestrike et son arme énergétique contre une paire de griffes Lightning",
        cout: 10,
        ajoute:
          "Paire de griffes Lightning (à la place du combi-bolter Banestrike et de l'arme énergétique)",
        remplaceListe: ["Combi-bolter Banestrike", "Arme énergétique"],
      },
      {
        type: "quantite",
        id: "arme-lourde-lance-flammes",
        libelle:
          "Par tranche de cinq Figurines : lance-flammes lourd (à la place du combi-bolter Banestrike)",
        cout: 10,
        parTranche: 5,
        groupe: "arme-lourde",
        ajoute: "Lance-flammes lourd (à la place du combi-bolter Banestrike)",
      },
      {
        type: "quantite",
        id: "arme-lourde-multi-fuseur",
        libelle:
          "Par tranche de cinq Figurines : multi-fuseur (à la place du combi-bolter Banestrike)",
        cout: 15,
        parTranche: 5,
        groupe: "arme-lourde",
        ajoute: "Multi-fuseur (à la place du combi-bolter Banestrike)",
      },
      {
        type: "quantite",
        id: "arme-lourde-autocanon-reaper",
        libelle:
          "Par tranche de cinq Figurines : autocanon Reaper (à la place du combi-bolter Banestrike)",
        cout: 15,
        parTranche: 5,
        groupe: "arme-lourde",
        ajoute: "Autocanon Reaper (à la place du combi-bolter Banestrike)",
      },
      {
        type: "quantite",
        id: "arme-lourde-eclateur-plasma",
        libelle:
          "Par tranche de cinq Figurines : éclateur à plasma (à la place du combi-bolter Banestrike)",
        cout: 10,
        parTranche: 5,
        groupe: "arme-lourde",
        ajoute: "Éclateur à plasma (à la place du combi-bolter Banestrike)",
      },
    ],
    legion: "XVI",
  },
  {
    id: "escouade-attaque-ravageuse",
    nom: "Escouade d'Attaque Ravageuse",
    categorie: "Assaut Lourd",
    cout: 135,
    composition: "1 Chef Ravageur, 4 Ravageurs",
    effectif: { base: 5, max: 20, cout: 22 },
    traits: ["[Allégeance]", "Sons of Horus"],
    notes:
      "Évolution des escouades de Nettoyeurs, les Ravageurs constituaient à bien des égards l'archétype des méthodes de combat des Sons of Horus. Influencées par les tribus de Cthonia, les unités Ravageuses étaient spécialisées dans les assauts rapides voués à paralyser l'ennemi en abattant les commandants pour plonger les survivants dans la confusion. Chaque unité Ravageuse était dans les faits une bande de guerre, dont les membres se battaient comme des individus plutôt que comme des soldats. La plus tristement célèbre est sans doute celle des Ravageurs Catuléens, qui se distinguèrent sur Isstvan III et V, où ils massacrèrent nombre de Loyalistes.",
    equipementLibelle: "Équipement (chaque figurine)",
    equipement: [
      "Hache tronçonneuse",
      "Pistolet bolter",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Escouade d'Attaque Ravageuse",
        cout: 0,
        profils: [
          {
            nom: "Ravageur",
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
            nom: "Chef Ravageur",
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
        regles: ["Précision (6+)", "Avant-garde (3)"],
        type: "Chef Ravageur : Infanterie (Sergent) · Ravageur : Infanterie",
      },
    ],
    options: [
      {
        type: "choix",
        id: "arme-cac",
        libelle: "Toute Figurine : remplacer la hache tronçonneuse",
        remplace: "Hache tronçonneuse",
        choix: [
          { nom: "— Conserver la hache tronçonneuse —", cout: 0 },
          {
            nom: "Épée tronçonneuse (à la place de la hache tronçonneuse)",
            cout: 0,
          },
          ...depuisListes(LISTES_EQUIPEMENT.meleeSergent),
        ],
      },
      {
        type: "choix",
        id: "pistolet",
        libelle: "Toute Figurine : remplacer le pistolet bolter",
        remplace: "Pistolet bolter",
        choix: [
          { nom: "— Conserver le pistolet bolter —", cout: 0 },
          ...depuisListes(LISTES_EQUIPEMENT.pistolets),
        ],
      },
      ...quantiteDepuisListe(LISTES_EQUIPEMENT.speciales, {
        groupe: "arme-speciale",
        parTranche: 5,
        remplace: "de la hache tronçonneuse",
      }),
      {
        type: "case",
        id: "vexillum",
        libelle: "Un Ravageur de cette Unité peut être doté d'un vexillum",
        cout: 10,
        ajoute: "Vexillum",
      },
    ],
    legion: "XVI",
  },

  /* ----------------------------------------------------------
     UNITÉS RÉSERVÉES À LA XVIIe LÉGION (WORD BEARERS)
     Transcrit depuis photos du livre d'armée : plusieurs pages sont
     denses en texte de fluff cultiste (Gal Vorbak, Zadu Layak,
     Dreadnought Mhara Gal) et peu lisibles par endroits. Tous les
     coûts en Points et profils sont donc une estimation de
     transcription À VÉRIFIER contre le livre (voir l'en-tête du
     fichier) : plus encore que la section Sons of Horus, ne pas
     considérer cette section comme fiable sans relecture.
     ---------------------------------------------------------- */
  {
    id: "lorgar",
    nom: "Lorgar",
    categorie: "Seigneur de Guerre",
    cout: 445,
    composition: "1 Lorgar",
    notes:
      "Primarque des Word Bearers, L'Aurélien, Le Doré, La Voix de la Vérité. Lorgar Aurélien, le Fils Doré, qui seul parmi ses frères maniait le pouvoir de la dévotion comme une arme, était le seigneur de la Légion des Word Bearers. Il conquit des mondes par la seule force de son verbe et de son charisme, les convertissant à la vénération de l'Empereur, qu'il voyait comme le sauveur divin de l'Humanité.",
    traits: [
      "Renégat",
      "Word Bearers",
      "Psyker",
      "Maître de la Légion",
      "Anathemata",
    ],
    equipement: ["Illuminarum", "Dévotion", "Grenades Frag"],
    variantes: [
      {
        nom: "Lorgar",
        cout: 0,
        profil: {
          M: 8,
          CC: 6,
          CT: 6,
          F: 6,
          E: 6,
          PV: 6,
          I: 6,
          A: 5,
          Cd: 12,
          Sf: 11,
          Vo: 10,
          Int: 10,
          Sv: "2+",
          Inv: "4+",
        },
        regles: [
          "Sire des Word Bearers",
          "Massif (4)",
          "Discipline Anathemata",
          "Haine (Loyalistes)",
          "Le Pouvoir du Verbe",
          "Guerrier Éternel (2)",
        ],
        type: "Parangon (Unique)",
      },
    ],
    options: [],
    legion: "XVII",
  },
  {
    id: "kor-phaeron",
    nom: "Kor Phaeron",
    categorie: "Quartier Général",
    cout: 125,
    composition: "1 Kor Phaeron",
    notes:
      "Premier Capitaine des Word Bearers, Maître de la Foi, Prêtre-roi de Colchis. Méprisé par beaucoup au sein de sa Légion, qui le traitaient de « demi-Astartes », Kor Phaeron était le père adoptif de Lorgar, à qui il inculqua les traditions de Colchis. Quand la XVIIe Légion fut unie à son Primarque, Kor Phaeron était trop vieux pour suivre le processus d'implantation complet, mais son Primarque l'estimait tant qu'il reçut les plus puissantes augmentations biologiques accessibles à un homme de son âge sans en faire un Space Marine, et il fut nommé Premier Capitaine.",
    traits: ["Renégat", "Word Bearers", "Maître de la Légion"],
    equipement: [
      "Griffes du Patriarche",
      "Digi-lance-flammes",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Kor Phaeron",
        cout: 0,
        profil: {
          M: 6,
          CC: 5,
          CT: 4,
          F: 3,
          E: 3,
          PV: 3,
          I: 3,
          A: 4,
          Cd: 10,
          Sf: 10,
          Vo: 9,
          Int: 7,
          Sv: "2+",
          Inv: "5+",
        },
        regles: [
          "Massif (2)",
          "Sombre Éloquence",
          "Commandement Jaloux",
          "Lent et Méthodique",
        ],
        type: "Infanterie (Unique, État-major)",
      },
    ],
    options: [],
    legion: "XVII",
  },
  {
    id: "erebus",
    nom: "Erebus",
    categorie: "Quartier Général",
    // Coût encore À VÉRIFIER (non visible sur les captures fournies).
    cout: 165,
    composition: "1 Erebus",
    notes:
      "Prêtre Noir, Émissaire du Maître de Guerre, Enfant de la Vérité Primordiale.",
    traits: ["Renégat", "Word Bearers", "Psyker", "Anathemata"],
    equipement: [
      "Crux Malefica",
      "Pistolet à plasma",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Erebus",
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
          Cd: 10,
          Sf: 10,
          Vo: 9,
          Int: 7,
          Sv: "2+",
          Inv: "4+",
        },
        regles: [
          "Discipline Anathemata",
          "Seigneur des Bénis",
          "Émissaire du Chaos",
        ],
        type: "Infanterie (Unique, État-major)",
      },
    ],
    options: [],
    legion: "XVII",
  },
  {
    id: "argel-tal",
    nom: "Argel Tal",
    categorie: "Quartier Général",
    cout: 240,
    composition: "1 Argel Tal",
    notes:
      "Le Rédempteur Écarlate, Commandant du Soleil Denté. Argel Tal fut un des premiers à contempler la folie de l'Œil de la Terreur, ce qui lui valut la damnation éternelle quand l'abîme tourmenté le regarda à son tour. Considéré comme l'exemple parfait de ce que son Primarque entendait par la fusion de l'âme humaine et de la puissance du Démon, lui et ses frères des Gal Vorbak jouèrent un rôle décisif dans la tragédie galactique qui frappa le genre humain.",
    traits: ["Renégat", "Word Bearers", "Maître de la Légion"],
    equipement: ["Serres Démoniaques", "Grenades Frag", "Grenades Krak"],
    variantes: [
      {
        nom: "Argel Tal",
        cout: 0,
        profil: {
          M: 14,
          CC: 6,
          CT: 5,
          F: 5,
          E: 5,
          PV: 5,
          I: 5,
          A: 6,
          Cd: 10,
          Sf: 9,
          Vo: 9,
          Int: 8,
          Sv: "2+",
          Inv: "4+",
        },
        regles: [
          "Massif (3)",
          "Frappe en Profondeur",
          "Insensible à la Douleur (5+)",
          "Peur (1)",
        ],
        type: "Infanterie (Unique, État-major, Antigrav, Maléfique)",
      },
    ],
    options: [],
    legion: "XVII",
  },
  {
    id: "zardu-layak",
    nom: "Zardu Layak",
    categorie: "État-major",
    // Coût encore À VÉRIFIER (non visible sur les captures fournies).
    cout: 180,
    composition: "1 Zardu Layak, 1 Anakatis Kul",
    // Anakatis Kul est un second profil (Champion, Maléfique) qui
    // accompagne toujours Zardu Layak dans la même Unité — voir la
    // liste `profils` ci-dessous.
    equipementLibelle: "Équipement (chaque profil)",
    traits: ["Renégat", "Word Bearers", "Psyker (Zardu Layak seulement)"],
    equipement: [
      "L'Azurda Char'is",
      "Pistolet bolter",
      "La Panoplie de Flammes",
      "Grenades Frag",
      "Grenades Krak",
      "Épée Anakatis",
      "Pistolet à plasma",
    ],
    variantes: [
      {
        nom: "Zardu Layak",
        cout: 0,
        profils: [
          {
            nom: "Zardu Layak",
            profil: {
              M: 7,
              CC: 5,
              CT: 5,
              F: 4,
              E: 4,
              PV: 4,
              I: 5,
              A: 3,
              Cd: 11,
              Sf: 10,
              Vo: 9,
              Int: 7,
              Sv: "2+",
              Inv: "4+",
            },
          },
          {
            nom: "Anakatis Kul",
            profil: {
              M: 8,
              CC: 5,
              CT: 4,
              F: 5,
              E: 5,
              PV: 3,
              I: 5,
              A: 3,
              Cd: 10,
              Sf: 9,
              Vo: 4,
              Int: 4,
              Sv: "3+",
              Inv: "—",
            },
          },
        ],
        regles: [
          "Zardu Layak : Haine (Loyalistes)",
          "Zardu Layak : Entraveur d'Âmes",
          "Anakatis Kul : Massif (2)",
          "Anakatis Kul : Insensible à la Douleur (5+)",
          "Anakatis Kul : Explose (6+)",
          "Anakatis Kul : Peur (1)",
        ],
        type: "Zardu Layak : Infanterie (Unique, État-major, Maléfique) · Anakatis Kul : Infanterie (Champion, Maléfique)",
      },
    ],
    options: [],
    legion: "XVII",
  },
  {
    id: "gal-vorbak",
    nom: "Gal Vorbak",
    categorie: "Elite",
    cout: 250,
    composition: "5 Frères Obscurs",
    effectif: { base: 5, max: 10, cout: 50 },
    traits: ["Renégat", "Word Bearers"],
    notes:
      "Les Gal Vorbak sont issus de ce qu'il reste du Chapitre du Soleil Denté de la Légion des Word Bearers, qui explorèrent les profondeurs de l'Œil de la Terreur et en revinrent à jamais transfigurés. Leur psyché infiltrée par des créatures des ténèbres de l'Éther, les survivants furent rebaptisés Gal Vorbak, ou « Fils Bénis » dans la langue de Colchis. Au combat, leurs mains se transforment en serres et leur bouche en gueule écumante garnie de crocs. Avant même que cette transformation se soit achevée, ces tueurs écumants bondissent sur l'ennemi pour le tailler en pièces.",
    equipement: [
      "Serres Souillées",
      "Bolter",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Gal Vorbak",
        cout: 0,
        profil: {
          M: 8,
          CC: 5,
          CT: 4,
          F: 5,
          E: 5,
          PV: 3,
          I: 5,
          A: 3,
          Cd: 9,
          Sf: 8,
          Vo: 7,
          Int: 7,
          Sv: "3+",
          Inv: "—",
        },
        regles: [
          "Massif (2)",
          "Insensible à la Douleur (5+)",
          "Avance Implacable",
          "Avant-garde (3)",
          "Peur (1)",
        ],
        type: "Infanterie (Maléfique)",
      },
    ],
    options: [],
    legion: "XVII",
  },
  {
    id: "dreadnought-mhara-gal",
    nom: "Dreadnought Mhara Gal",
    categorie: "Engins de Guerre",
    cout: 210,
    composition: "1 Dreadnought Mhara Gal",
    notes:
      "Ces êtres impies étaient créés à partir de châssis de Dreadnoughts Contemptor corrompus, dont le blindage noirci fondait comme de la cire pour vomir des flammes noires. Certains écrits religieux les nomment « Mhara Gal », allégorie colchisienne que l'on pourrait traduire par « Ce qui fut béni, mais se trouve désormais faillu à leurs vœux envers l'Octuple Voie » et reçut « la vie par-delà la mort comme châtiment ».",
    traits: ["Renégat", "Word Bearers"],
    equipement: ["Canon à Feu Warp", "Griffe Souillée", "Brasier Warp"],
    variantes: [
      {
        nom: "Dreadnought Mhara Gal",
        cout: 0,
        profil: {
          M: 8,
          CC: 5,
          CT: 4,
          F: 7,
          E: 7,
          PV: 6,
          I: 4,
          A: 4,
          Cd: 12,
          Sf: 10,
          Vo: 8,
          Int: 5,
          Sv: "2+",
          Inv: "5+",
        },
        regles: ["Massif (6)", "Explose (3+)", "Avance Implacable", "Peur (1)"],
        type: "Marcheur (Maléfique)",
      },
    ],
    options: [],
    legion: "XVII",
  },
  {
    id: "escouade-cercle-cendres",
    nom: "Escouade du Cercle de Cendres",
    categorie: "Attaque Rapide",
    cout: 125,
    composition: "1 Iconoclaste, 4 Incendiaires",
    effectif: { base: 5, max: 10, cout: 20 },
    traits: ["[Allégeance]", "Word Bearers"],
    notes:
      "Opérant aux côtés des Destructeurs Word Bearers, le Cercle de Cendres est une formation unique créée dans un seul but : la destruction de la culture, de l'éducation et de la foi. Ces Space Marines sont des iconoclastes, chargés en dehors du champ de bataille de traquer les œuvres des fausses doctrines et ceux qui les diffusent pour les vouer aux flammes purificatrices. Sur le champ de bataille, leur mission est tout aussi importante, car ils traquent les chefs charismatiques, prêtres, bannières et champions pour les jeter à terre avec leurs haches-crocs et les détruire avec une ferveur brutale.",
    equipementLibelle: "Équipement (chaque figurine)",
    equipement: [
      "Lance-flammes Léger Akkadique",
      "Hache-croc",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Escouade du Cercle de Cendres",
        cout: 0,
        profils: [
          {
            nom: "Incendiaire",
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
              Sf: 8,
              Vo: 7,
              Int: 7,
              Sv: "3+",
              Inv: "—",
            },
          },
          {
            nom: "Iconoclaste",
            profil: {
              M: 12,
              CC: 4,
              CT: 4,
              F: 4,
              E: 4,
              PV: 1,
              I: 4,
              A: 3,
              Cd: 9,
              Sf: 9,
              Vo: 7,
              Int: 7,
              Sv: "3+",
              Inv: "—",
            },
          },
        ],
        regles: [
          "Massif (2)",
          "Avant-garde (3)",
          "Frappe en Profondeur",
          "Annonciateurs de la Vérité",
          "Âpre Devoir",
        ],
        type: "Iconoclaste : Infanterie (Sergent, Antigrav) · Incendiaire : Infanterie (Antigrav)",
      },
    ],
    options: [
      {
        type: "case",
        id: "pistolet-inferno",
        libelle:
          "L'Iconoclaste peut échanger son lance-flammes léger akkadique contre un pistolet Inferno",
        cout: 15,
        remplace: "Lance-flammes Léger Akkadique",
        ajoute:
          "Pistolet Inferno (à la place du lance-flammes léger akkadique)",
      },
      {
        type: "case",
        id: "bombes-phosphex",
        libelle: "L'Iconoclaste peut être doté de bombes à phosphex",
        cout: 10,
        ajoute: "Bombes à phosphex",
      },
    ],
    legion: "XVII",
  },

  /* ----------------------------------------------------------
     UNITÉS RÉSERVÉES À LA XIVe LÉGION (DEATH GUARD)
     Transcrit depuis photos du livre d'armée : Mortarion, Calas
     Typhon, Escouade Terminator du Linceul et Garde-tombe (voir
     js/armes-data.js pour leurs armes propres et l'Arsenal de la
     Death Guard — Faux énergétique, notamment). Le nom exact de
     l'unité Chimiarque/Garde-tombe est reconstitué depuis sa
     composition et son texte d'ambiance, le bandeau de titre étant
     hors-cadre sur la photo : à corriger contre le livre en cas de
     doute (voir l'en-tête du fichier).
     ---------------------------------------------------------- */
  {
    id: "mortarion",
    nom: "Mortarion",
    categorie: "Seigneur de Guerre",
    cout: 425,
    composition: "1 Mortarion",
    notes:
      "Primarque de la Death Guard, le Roi Blême, le Voyageur, l'Effroyable Libérateur de Barbarus. Le sinistre et ténébreux Mortarion était le Primarque et Commandant de la Légion de la Death Guard. Il grandit sur un monde cauchemardesque d'horreur et de secrets maléfiques où les humains étaient chassés comme des animaux, et les ténèbres de ce monde s'insinuèrent dans son âme pour ne jamais le quitter. Aussi implacable que déterminé, le Primarque faucheur fit de sa Légion des libérateurs inflexibles, des spectres de la mort et du jugement pour qui nul champ de bataille n'était insurmontable et nul ennemi trop redoutable. Horus le rallia à sa cause en usant de mensonges et de demi-vérités, et le prix que le Primarque et sa Légion payèrent pour leur rôle dans l'Hérésie d'Horus dépassa en horreur les cauchemars les plus inimaginables.",
    traits: ["Renégat", "Death Guard", "Maître de la Légion"],
    equipement: [
      "Silence",
      "La Lanterne",
      "Bombes à phosphex",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Mortarion",
        cout: 0,
        profil: {
          M: 8,
          CC: 7,
          CT: 6,
          F: 7,
          E: 7,
          PV: 7,
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
          "Sire de la Death Guard",
          "Massif (5)",
          "Peur (1)",
          "Ombre du Faucheur",
          "Résistance Surnaturelle",
          "Guerrier Éternel (3)",
          "Néfos",
        ],
        type: "Parangon (Unique)",
      },
    ],
    options: [],
    legion: "XIV",
  },
  {
    id: "calas-typhon",
    nom: "Calas Typhon",
    categorie: "Quartier Général",
    cout: 200,
    composition: "1 Calas Typhon",
    notes:
      "Premier Capitaine de la Death Guard, La Main Gauche de Mortarion, Maître du Terminus Est. Le Premier Capitaine de la Légion de la Death Guard faisait autrefois partie du Librarius de la Légion, mais en raison de la défiance de son Primarque Mortarion envers les psykers, Typhon réprima ses dons et s'efforça de développer ses talents de chef de guerre. Sa force, sa compétence et son comportement lui valurent de gravir les échelons, jusqu'à se retrouver aux commandes du vaisseau spatial Terminus Est et de l'arsenal alchimique qu'il recelait. Bien qu'il eût renoncé à son rôle de psyker, la Warp continuait d'exercer son influence sur Typhon, car il fut un des premiers à succomber aux insidieux murmures des sombres puissances.",
    traits: ["Renégat", "Death Guard", "Psyker", "Maître de la Légion"],
    equipement: ["Lakrimae", "Rassasieuse"],
    variantes: [
      {
        nom: "Calas Typhon",
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
          Cd: 9,
          Sf: 9,
          Vo: 9,
          Int: 9,
          Sv: "2+",
          Inv: "4+",
        },
        regles: [
          "Massif (2)",
          "Avance Implacable",
          "Lent et Méthodique",
          "Guerrier Éternel (1)",
          "Néfos",
          "Sang de Sorcier",
        ],
        type: "Infanterie (Unique, État-major, Lourd)",
      },
    ],
    options: [],
    legion: "XIV",
  },
  {
    id: "escouade-terminator-du-linceul",
    nom: "Escouade Terminator du Linceul",
    categorie: "Suites",
    cout: 100,
    composition: "2 Terminators du Linceul",
    effectif: { base: 2, max: 10, cout: 45 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "Death Guard"],
    notes:
      "Le Linceul est un groupe de guerriers d'élite, revêtus de lourdes armures Terminator et armés de redoutables projecteurs Alchim ainsi que de grandes faux énergétiques. Sélectionnés par Mortarion en personne pour leurs compétences, leur bravoure et leur endurance, ils étaient souvent choisis parce qu'ils étaient les derniers survivants de leur unité. Les Terminators du Linceul étaient les gardes du corps silencieux de Mortarion, et empêchaient quiconque d'importuner leur Primarque en croisant leurs lames et en fixant l'intrus du regard.",
    equipement: ["Projecteur alchim", "Faux énergétique"],
    variantes: [
      {
        nom: "Deathshroud",
        cout: 0,
        profil: {
          M: 7,
          CC: 5,
          CT: 4,
          F: 4,
          E: 5,
          PV: 2,
          I: 4,
          A: 3,
          Cd: 10,
          Sf: 9,
          Vo: 7,
          Int: 7,
          Sv: "2+",
          Inv: "5+",
        },
        regles: ["Massif (2)", "Avance Implacable", "Guerrier Éternel (1)"],
        type: "Infanterie",
      },
    ],
    options: [],
    legion: "XIV",
  },
  {
    id: "garde-tombe",
    nom: "Garde-tombe",
    categorie: "Assaut Lourd",
    cout: 225,
    composition: "1 Chimiarque, 4 Garde-tombe",
    effectif: { base: 5, max: 10, cout: 40 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "Death Guard"],
    notes:
      "La Compagnie Terminator de Calas Typhon était avant tout sous ses ordres, et ses membres lui étaient connus sous le nom de Garde-tombe, aussi bien dans la Légion qu'en dehors. Les Garde-tombe apportaient la promesse d'une mort atroce à quiconque croisait leur route, et quand la Death Guard se déchaîna contre l'Imperium après la rébellion du Maître de Guerre, des armes jusqu'alors réservées aux formes de vie les plus dangereuses et les plus résistantes furent utilisées planète après planète contre l'humanité, si bien que les victimes de la Death Guard se comptèrent bientôt par millions.",
    equipement: [
      "Lance-grenades d'assaut — Krak",
      "Lance-grenades d'assaut — Toxine",
      "Gantelet énergétique",
    ],
    variantes: [
      {
        nom: "Garde-tombe",
        cout: 0,
        profils: [
          {
            nom: "Garde-tombe",
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
          {
            nom: "Chimiarque",
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
          "Néfos",
          "Avant-garde (3)",
        ],
        type: "Chimiarque : Infanterie (Sergent, Lourd) · Garde-tombe : Infanterie (Lourd)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "chimiarque-arme-combinee",
        libelle:
          "La Chimiarque : remplacer gratuitement le lance-grenades d'assaut par une arme de la liste des Armes Combinées de Légion",
        ajoute: true,
        prefixeFiche: "Chimiarque : ",
        choix: [
          { nom: "— Aucun échange —", cout: 0 },
          ...depuisListes(LISTES_EQUIPEMENT.combinees).map((o) => ({
            ...o,
            cout: 0,
          })),
        ],
      },
      {
        type: "choix",
        id: "chimiarque-faux-energetique",
        libelle:
          "La Chimiarque : échanger son gantelet énergétique contre une faux énergétique",
        ajoute: true,
        prefixeFiche: "Chimiarque : ",
        choix: [
          { nom: "— Aucun échange —", cout: 0 },
          {
            nom: "Faux énergétique (à la place du gantelet énergétique)",
            cout: 5,
          },
        ],
      },
      {
        type: "quantite",
        id: "poing-troncon",
        libelle:
          "Figurines : poing tronçonneur (à la place du gantelet énergétique)",
        cout: 5,
        parTranche: 1,
        groupe: "melee",
        ajoute: "Poing tronçonneur (à la place du gantelet énergétique)",
      },
      {
        type: "quantite",
        id: "lance-flammes-lourd-alchim",
        libelle:
          "Par tranche de cinq Figurines : un Garde-tombe échange son lance-grenades d'assaut contre un lance-flammes lourd alchim",
        cout: 5,
        parTranche: 5,
        groupe: "arme-lourde",
        ajoute:
          "Lance-flammes lourd alchim (à la place du lance-grenades d'assaut)",
      },
    ],
    legion: "XIV",
  },

  /* ----------------------------------------------------------
     UNITÉS RÉSERVÉES À LA XVe LÉGION (THOUSAND SONS)
     Transcrit depuis photos du livre d'armée : Magnus le Rouge, Ahzek
     Ahriman, Magistus Amon, Sorcier de Prospero, Cabale de Terminators
     Sekhmet, Cabale du Khenetai Occulte et Castellax-Achea (voir
     js/armes-data.js pour leurs armes propres et l'Arsenal des
     Thousand Sons). Les Réactions/Pouvoirs Psychiques propres au Trait
     Khenetai (Tisselame, Chant Mental des Lames) et les Disciplines
     Psychiques fixes d'Ahriman/Amon/du Sorcier de Prospero ne sont pas
     modélisés en détail (comme pour les autres Légions : seul le nom
     de la Règle Spéciale figure sur la fiche, sans moteur de jeu
     psychique dédié) — voir l'en-tête du fichier.
     Les cinq Arcanes de Prospero (Pavoni, Corvidae, Athanéen, Pyrae,
     Raptora), eux, SONT modélisés : voir l'option "arcane-prospero" du
     Sorcier de Prospero et de la Cabale de Terminators Sekhmet
     ci-dessous (+10 Points par Unité, non par Figurine — cf. le livre
     d'armée), et leurs Règles Spéciales dans js/regles-data.js. Réservé
     aux Unités ayant le Trait Thousand Sons hors Véhicule/Automate/
     Sous-type Unique : la Cabale du Khenetai Occulte a son propre
     Arcane (Khenetai) via ses Règles Spéciales et n'y a donc pas accès ;
     Magnus/Ahriman/Amon (Sous-type Unique) et le Castellax-Achea
     (Automate) en sont exclus.
     ---------------------------------------------------------- */
  {
    id: "magnus-le-rouge",
    nom: "Magnus le Rouge",
    categorie: "Seigneur de Guerre",
    cout: 470,
    composition: "1 Magnus le Rouge",
    notes:
      "Primarque des Thousand Sons. Parmi les Primarques, Magnus le Rouge était le maître incontesté des arts mystiques. En matière de pouvoirs psychiques, il ne le cédait qu'à l'Empereur, et d'aucuns estiment même que certains de ses secrets étaient hors de portée de son père. Magnus le Rouge était l'archétype du guerrier philosophe et l'incarnation de l'action réfléchie : sa présence était pour ses fils le rappel constant qu'il convenait de ne pas céder à l'impulsivité, et de conduire leurs campagnes avec le même soin et la même mesure de doute que leurs méditations psychiques.",
    traits: ["Renégat", "Thousand Sons", "Psyker", "Maître de la Légion"],
    equipement: ["La Lame d'Ahn-nunurta", "Serpentine à feu psychique"],
    variantes: [
      {
        nom: "Magnus le Rouge",
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
          Vo: 11,
          Int: 10,
          Sv: "2+",
          Inv: "4+",
        },
        regles: [
          "Sire des Thousand Sons",
          "Massif (5)",
          "Sorcier Suprême",
          "Dissimulation (6+)",
          "Bataille des Volontés",
          "Guerrier Éternel (2)",
        ],
        type: "Parangon (Unique)",
      },
    ],
    options: [
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
    legion: "XV",
  },
  {
    id: "ahzek-ahriman",
    nom: "Ahzek Ahriman",
    categorie: "Quartier Général",
    cout: 185,
    composition: "1 Ahzek Ahriman",
    notes:
      "Maître Archiviste des Thousand Sons, Archi-magister des Corvidae, Le Fils Immuable. Ahriman fut le premier et dernier Maître Archiviste des Thousand Sons, et le plus doué de leurs psykers. Grâce à sa grande force psychique et à sa profonde intelligence, il se distingua durant les jours les plus sombres de la Légion, et après les retrouvailles avec son Primarque, il devint également le principal disciple et premier lieutenant de Magnus le Rouge. Maître du Culte Corvidae, c'était également un combattant adroit et un officier efficace, fort de deux siècles d'expérience. Au combat, Ahriman jouait souvent un rôle crucial, présidant les manœuvres de l'ennemi et établissant les meilleures stratégies pour remporter la victoire.",
    traits: ["Renégat", "Thousand Sons", "Psyker", "Maître de la Légion"],
    equipement: [
      "Le Sceptre Corvidae",
      "Pistolet bolter",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Ahzek Ahriman",
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
        regles: ["Archi-magister des Corvidae"],
        type: "Infanterie (Unique, État-major)",
      },
    ],
    options: [],
    legion: "XV",
  },
  {
    id: "magistus-amon",
    nom: "Magistus Amon",
    categorie: "Quartier Général",
    cout: 185,
    composition: "1 Magistus Amon",
    notes:
      "Le Caché, Capitaine de la Neuvième Communauté, Tuteur de Magnus, Gardien des Clefs. Il se murmure qu'Amon fut un temps le tuteur de Magnus, avant l'arrivée de l'Empereur sur Prospero, mais si cette rumeur est exacte, cela signifierait qu'il a converti en Space Marine à l'âge adulte et survécu, aidé peut-être en cela par l'intervention directe de Magnus, et devint à la fois un guerrier de talent et un puissant psyker. Maître des services de renseignement de la Légion, les « Cachés », Amon survécut à la Bataille de Prospero, où il fut grièvement blessé, et rongé par l'amertume, il s'isola de plus en plus de ses maîtres et de ses pairs.",
    traits: ["Renégat", "Thousand Sons", "Psyker", "Maître de la Légion"],
    equipement: ["Le Reliquaire de Cendres", "Grenades Frag", "Grenades Krak"],
    variantes: [
      {
        nom: "Magistus Amon",
        cout: 0,
        profil: {
          M: 7,
          CC: 6,
          CT: 5,
          F: 4,
          E: 4,
          PV: 5,
          I: 4,
          A: 5,
          Cd: 10,
          Sf: 9,
          Vo: 9,
          Int: 9,
          Sv: "2+",
          Inv: "4+",
        },
        regles: ["Infiltration (9)", "Magister de la Poussière"],
        type: "Infanterie (Unique, État-major)",
      },
    ],
    options: [],
    legion: "XV",
  },
  {
    id: "sorcier-de-prospero",
    nom: "Sorcier de Prospero",
    categorie: "État-major",
    cout: 105,
    composition: "1 Sorcier de Prospero",
    traits: ["[Allégeance]", "Thousand Sons", "Psyker"],
    notes:
      "Comptant parmi les nombreux cultes des Thousand Sons, les Sortiarae étaient des guerriers qui consacraient leurs facultés à la destruction élémentale. Si leurs frères d'armes pratiquaient la méditation pour conserver leur calme à tout moment, ces pièces d'artillerie vivantes traversaient le maelström des combats en atomisant leurs adversaires à coups d'éclairs blancs de flammes, conjurant des tornades d'énergie destructrice et détruisaient les véhicules lourds par des secousses sismiques. Après la destruction de Prospero, les cabales de sorciers redoublèrent d'ardeur, si certains prirent leurs distances avec eux.",
    equipement: [
      "Bâton sorcier de Prospero",
      "Pistolet bolter",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Sorcier de Prospero",
        cout: 0,
        profil: {
          M: 5,
          CC: 5,
          CT: 4,
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
        regles: ["Sorcellerie de Prospero"],
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
      ARCANE_DE_PROSPERO,
    ],
    legion: "XV",
  },
  {
    id: "cabale-terminators-sekhmet",
    nom: "Cabale de Terminators Sekhmet",
    categorie: "Elite",
    cout: 250,
    composition: "1 Initiateur Sekhmet, 4 Sekhmet",
    effectif: { base: 5, max: 10, cout: 45 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "Thousand Sons", "Psyker"],
    notes:
      "Les Sekhmet étaient l'élite des Thousand Sons, et la garde personnelle de Magnus. Vêtus d'armures Terminator, tous étaient des initiés des Mystères Prosperiens qui avaient sublimé leurs facultés et leurs émotions pour atteindre le summum du contrôle spirituel. Identifiés par le scarabée de jade fixé à leur armure, ils formaient une confrérie dans la confrérie. Capables d'élever leurs esprits jusqu'aux plus hauts niveaux des Énumérations, les Scarabées Occultes combattaient avec une telle coordination et une telle discipline qu'ils semblaient moins être des guerriers de chair et de sang que des automates façonnés à l'image de l'homme.",
    equipement: ["Combi-bolter", "Épée de force modèle Achea"],
    variantes: [
      {
        nom: "Cabale de Terminators Sekhmet",
        cout: 0,
        profils: [
          {
            nom: "Sekhmet",
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
            nom: "Initiateur Sekhmet",
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
              Sf: 9,
              Vo: 8,
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
        type: "Initiateur Sekhmet : Infanterie (Sergent, Lourd) · Sekhmet : Infanterie (Lourd)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "arme-tir",
        libelle: "Toute Figurine : remplacer le combi-bolter",
        remplace: "Combi-bolter",
        choix: [
          { nom: "— Conserver le combi-bolter —", cout: 0 },
          { nom: "Chargeur volkite (à la place du combi-bolter)", cout: 0 },
          ...depuisListes(LISTES_EQUIPEMENT.combinees),
        ],
      },
      {
        type: "choix",
        id: "arme-cac",
        libelle: "Toute Figurine : remplacer l'épée de force modèle Achea",
        remplace: "Épée de force modèle Achea",
        choix: [
          {
            nom: "— Conserver l'épée de force modèle Achea —",
            cout: 0,
          },
          {
            nom: "Griffe Lightning (à la place de l'épée de force modèle Achea)",
            cout: 5,
          },
          {
            nom: "Gantelet énergétique (à la place de l'épée de force modèle Achea)",
            cout: 10,
          },
          {
            nom: "Poing tronçonneur (à la place de l'épée de force modèle Achea)",
            cout: 10,
          },
          {
            nom: "Marteau Thunder (à la place de l'épée de force modèle Achea)",
            cout: 10,
          },
        ],
      },
      ARCANE_DE_PROSPERO,
      {
        type: "quantite",
        id: "arme-lourde-lance-flammes",
        libelle:
          "Par tranche de cinq Figurines : lance-flammes lourd (à la place du combi-bolter)",
        cout: 10,
        parTranche: 5,
        groupe: "arme-lourde",
        ajoute: "Lance-flammes lourd (à la place du combi-bolter)",
      },
      {
        type: "quantite",
        id: "arme-lourde-autocanon-reaper",
        libelle:
          "Par tranche de cinq Figurines : autocanon Reaper (à la place du combi-bolter)",
        cout: 15,
        parTranche: 5,
        groupe: "arme-lourde",
        ajoute: "Autocanon Reaper (à la place du combi-bolter)",
      },
      {
        type: "quantite",
        id: "arme-lourde-eclateur-plasma",
        libelle:
          "Par tranche de cinq Figurines : éclateur à plasma (à la place du combi-bolter)",
        cout: 10,
        parTranche: 5,
        groupe: "arme-lourde",
        ajoute: "Éclateur à plasma (à la place du combi-bolter)",
      },
    ],
    legion: "XV",
  },
  {
    id: "cabale-khenetai-occulte",
    nom: "Cabale du Khenetai Occulte",
    categorie: "Elite",
    cout: 145,
    composition: "1 Maître des Lames Khenetai, 4 Lames Khenetai",
    effectif: { base: 5, max: 10, cout: 24 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "Thousand Sons", "Psyker", "Khenetai"],
    notes:
      "Le Khenetai Occulte était chargé de protéger les Cultes de Prospero, ainsi que leurs reliquaires et leurs sanctuaires. Les guerriers les plus talentueux du Khenetai formaient des cabales de « lames », des bretteurs de talent qui avaient mis leurs pouvoirs psychiques au service de leur maîtrise de l'escrime. Les paires d'épées de force qu'ils maniaient étaient forgées dans des feuilles de céramite rehaussées d'or et gravées de symboles indiquant leurs noms secrets et les victoires de leur porteur. Le Khenetai combattait avec une telle coordination qu'il évoquait davantage plusieurs corps mus par une même volonté qu'un groupe d'individus. Les Figurines de cette Unité ont leur propre Arcane de Prospero (Khenetai), qui leur donne accès à la Réaction Psychique Tisselame, au Pouvoir Psychique Chant Mental des Lames et au Trait « Khenetai ».",
    equipement: [
      "Paire d'épées de force Achea",
      "Pistolet bolter",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Cabale du Khenetai Occulte",
        cout: 0,
        profils: [
          {
            nom: "Lame Khenetai",
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
            nom: "Maître des Lames Khenetai",
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
        regles: ["Guerriers du Khenetai"],
        type: "Maître des Lames Khenetai : Infanterie (Sergent) · Lame Khenetai : Infanterie",
      },
    ],
    options: [
      {
        type: "choix",
        id: "maitre-pistolet",
        libelle: "Le Maître des Lames Khenetai : remplacer son pistolet bolter",
        ajoute: true,
        prefixeFiche: "Maître des Lames Khenetai : ",
        choix: [
          { nom: "— Aucun échange —", cout: 0 },
          ...depuisListes(LISTES_EQUIPEMENT.pistolets),
        ],
      },
    ],
    legion: "XV",
  },
  {
    id: "castellax-achea",
    nom: "Castellax-Achea",
    categorie: "Appui",
    cout: 80,
    composition: "1 Castellax-Achea",
    traits: ["[Allégeance]", "Thousand Sons"],
    notes:
      "Les Castellax-Achea avançaient aux côtés des guerriers de la Légion pour leur apporter un appui feu non négligeable, mais aussi pour servir de paratonnerre psychique. Si un Légionnaire puisait trop d'énergie dans la Warp, l'excédent pouvait être transmis à l'automate, ce qui protégeait le guerrier et augmentait la puissance des armes de ces sentinelles inorganiques.",
    equipement: [
      "Canon à bolts Asphyx",
      "Griffes de force Achea",
      "Deux bolters",
    ],
    variantes: [
      {
        nom: "Castellax-Achea",
        cout: 0,
        profil: {
          M: 6,
          CC: 3,
          CT: 3,
          F: 6,
          E: 6,
          PV: 4,
          I: 3,
          A: 3,
          Cd: 12,
          Sf: 10,
          Vo: 7,
          Int: 7,
          Sv: "3+",
          Inv: "5+",
        },
        regles: [
          "Massif (4)",
          "Explose (6+)",
          "Conduit Psychique",
          "Avance Implacable",
          "Orage de Feu",
          "Protocoles de Tir (3)",
        ],
        type: "Automate",
      },
    ],
    options: [
      {
        type: "choix",
        id: "arme-tir",
        libelle: "Remplacer le canon à bolts Asphyx",
        remplace: "Canon à bolts Asphyx",
        choix: [
          { nom: "— Conserver le canon à bolts Asphyx —", cout: 0 },
          {
            nom: "Canon à étherfeu (à la place du canon à bolts Asphyx)",
            cout: 10,
          },
        ],
      },
    ],
    legion: "XV",
  },

  /* ----------------------------------------------------------
     UNITÉS RÉSERVÉES À LA XXe LÉGION (ALPHA LEGION)
     Transcrit depuis photos du livre d'armée : Alpharius, Armillus
     Dynat, Saboteur, Chasseur de Têtes, Exodus et Escouade Terminator
     Lernéenne (voir js/armes-data.js pour leurs armes propres et
     l'Arsenal de l'Alpha Legion). Contrairement aux Death Guard et
     Thousand Sons transcrites précédemment, le livre laisse ici même
     les Figurines Uniques/Maîtres de la Légion au Trait « [Allégeance]
     » (variable) plutôt que de les verrouiller en Renégat — transcrit
     tel quel. Composition de l'Unité Chasseur de Têtes reconstituée
     depuis ses lignes de profil et son texte d'Options (bandeau de
     titre et éventuelle ligne d'effectif supplémentaire hors-cadre sur
     la photo) : à corriger contre le livre en cas de doute.
     ---------------------------------------------------------- */
  {
    id: "alpharius",
    nom: "Alpharius",
    categorie: "Seigneur de Guerre",
    cout: 465,
    composition: "1 Alpharius",
    traits: [
      "[Allégeance]",
      "Alpha Legion",
      "Écran de Fumée",
      "Maître de la Légion",
    ],
    equipement: [
      "La Lance Pâle",
      "La Hargne de l'Hydre",
      "Les Écailles Pythiennes",
      "Grenades Frag",
      "Grenades Krak",
      "Sphères à venin",
    ],
    variantes: [
      {
        nom: "Alpharius",
        cout: 0,
        profil: {
          M: 8,
          CC: 7,
          CT: 7,
          F: 6,
          E: 6,
          PV: 6,
          I: 7,
          A: 6,
          Cd: 12,
          Sf: 10,
          Vo: 10,
          Int: 11,
          Sv: "2+",
          Inv: "4+",
        },
        regles: [
          "Sire de l'Alpha Legion",
          "Massif (4)",
          "Partout et Nulle Part",
          "Guerrier Éternel (2)",
        ],
        type: "Parangon (Unique, Léger)",
      },
    ],
    options: [],
    legion: "XX",
  },
  {
    id: "armillus-dynat",
    nom: "Armillus Dynat",
    categorie: "Quartier Général",
    cout: 185,
    composition: "1 Armillus Dynat",
    traits: ["[Allégeance]", "Alpha Legion", "Maître de la Légion"],
    equipement: [
      "Le Prince",
      "Le Prophète",
      "Pistolet bolter",
      "Grenades Frag",
      "Grenades Krak",
      "Sphères à venin",
      "Bombes à phosphex",
    ],
    variantes: [
      {
        nom: "Armillus Dynat",
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
          Vo: 8,
          Int: 8,
          Sv: "2+",
          Inv: "4+",
        },
        regles: ["Maître Herseur"],
        type: "Infanterie (Unique, État-major)",
      },
    ],
    options: [],
    legion: "XX",
  },
  {
    id: "saboteur",
    nom: "Saboteur",
    categorie: "État-major",
    cout: 95,
    composition: "1 Saboteur",
    traits: ["[Allégeance]", "Alpha Legion", "Écran de Fumée"],
    equipement: [
      "Fusil à pompe Banestrike",
      "Dague énergétique",
      "Pistolet bolter",
      "Grenades Frag",
      "Grenades Krak",
      "Bombes à fusion",
      "Sphères à venin",
    ],
    variantes: [
      {
        nom: "Saboteur",
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
          Sf: 8,
          Vo: 7,
          Int: 8,
          Sv: "2+",
          Inv: "5+",
        },
        regles: ["Faux Pavillon", "Infiltration (6)"],
        type: "Infanterie (Spécialiste, Tirailleurs)",
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
    legion: "XX",
  },
  {
    id: "chasseur-de-tetes",
    nom: "Chasseur de Têtes",
    categorie: "Elite",
    cout: 135,
    composition: "1 Primat Chasseur de Têtes, 4 Chasseurs de Têtes",
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "Alpha Legion", "Écran de Fumée"],
    equipement: [
      "Combi-bolter Banestrike",
      "Dague énergétique",
      "Pistolet bolter",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Chasseur de Têtes",
        cout: 0,
        profils: [
          {
            nom: "Chasseur de Têtes",
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
              Sf: 7,
              Vo: 7,
              Int: 7,
              Sv: "3+",
              Inv: "—",
            },
          },
          {
            nom: "Primat Chasseur de Têtes",
            profil: {
              M: 7,
              CC: 4,
              CT: 5,
              F: 4,
              E: 4,
              PV: 1,
              I: 4,
              A: 2,
              Cd: 9,
              Sf: 8,
              Vo: 7,
              Int: 7,
              Sv: "3+",
              Inv: "—",
            },
          },
        ],
        regles: ["Précision (4+)", "Haine (État-major)", "Infiltration (9)"],
        type: "Primat Chasseur de Têtes : Infanterie (Sergent, Tirailleurs) · Chasseur de Têtes : Infanterie (Tirailleurs)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "primat-arme-cac",
        libelle: "Le Primat Chasseur de Têtes : remplacer sa dague énergétique",
        ajoute: true,
        prefixeFiche: "Primat Chasseur de Têtes : ",
        choix: [
          { nom: "— Aucun échange —", cout: 0 },
          ...depuisListes(LISTES_EQUIPEMENT.meleeSergent),
        ],
      },
      {
        type: "choix",
        id: "primat-pistolet",
        libelle: "Le Primat Chasseur de Têtes : remplacer son pistolet bolter",
        ajoute: true,
        prefixeFiche: "Primat Chasseur de Têtes : ",
        choix: [
          { nom: "— Aucun échange —", cout: 0 },
          ...depuisListes(LISTES_EQUIPEMENT.pistolets),
        ],
      },
      {
        type: "quantite",
        id: "arme-lourde-bolter-lourd",
        libelle:
          "Par tranche de cinq Figurines : bolter lourd (à la place du combi-bolter Banestrike)",
        cout: 5,
        parTranche: 5,
        groupe: "arme-lourde",
        ajoute: "Bolter lourd (à la place du combi-bolter Banestrike)",
      },
      {
        type: "quantite",
        id: "arme-lourde-multi-fuseur",
        libelle:
          "Par tranche de cinq Figurines : multi-fuseur (à la place du combi-bolter Banestrike)",
        cout: 20,
        parTranche: 5,
        groupe: "arme-lourde",
        ajoute: "Multi-fuseur (à la place du combi-bolter Banestrike)",
      },
      {
        type: "case",
        id: "bombes-fusion",
        libelle: "Toutes les Figurines : bombes à fusion",
        cout: 5,
        parFigurine: true,
        ajoute: "Bombes à fusion",
      },
      // Alpha Legion Legacy Wargear (alpha_legion_wargear.pdf), section
      // « Headhunter Kill Team » — le Bolter Banestrike et le
      // Combi-bolter Banestrike, ajoutés à la liste des Armes Combinées
      // de Légion pour toute Figurine Alpha Legion, sont proposés ici en
      // plus de la liste standard.
      {
        type: "quantite",
        id: "combi-legacy",
        libelle: "Figurines : Bolter Banestrike (Legacy, à la place du combi-bolter Banestrike)",
        cout: 5,
        parTranche: 1,
        groupe: "combi-legacy",
        ajoute: "Bolter Banestrike (Legacy) (à la place du combi-bolter Banestrike)",
      },
      ...quantiteDepuisListe(LISTES_EQUIPEMENT.combinees, {
        groupe: "combi-legacy",
        remplace: "du combi-bolter Banestrike",
      }),
      {
        type: "case",
        id: "primat-pistolet-inferno",
        libelle: "Primat Chasseur de Têtes : Pistolet Inferno (à la place du pistolet bolter)",
        cout: 10,
        ajoute: "Primat Chasseur de Têtes : Pistolet Inferno (à la place du pistolet bolter)",
      },
    ],
    legion: "XX",
  },
  {
    id: "exodus",
    nom: "Exodus",
    categorie: "Elite",
    cout: 165,
    composition: "1 Exodus",
    traits: ["[Allégeance]", "Alpha Legion", "Écran de Fumée"],
    notes:
      "Celui qui est Plusieurs, L'Assassin. Nul ne sait si Exodus est un seul individu ou plusieurs assassins. En tout cas, le nom, ou du moins le nom de code « Exodus », est apparu dans de nombreuses transcriptions de messages vox et archives d'ordres sur plusieurs théâtres d'opérations, parfois simultanément. Cela ne saurait être une erreur, étant donné la maîtrise chez l'Alpha Legion de la tromperie sous toutes ses formes. Quoi qu'il en soit, Exodus est si doué qu'aucuns prétendent qu'il surpasse même les tireurs d'élite du Clade Vindicate par sa capacité à s'infiltrer dans une position ennemie pour délivrer un tir fatal au moment le plus décisif d'une campagne.",
    equipement: [
      "L'Instrument — Mode rapide",
      "L'Instrument — Mode Exécution",
      "Pistolet bolter",
      "Dague énergétique",
      "Sphères à venin",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Exodus",
        cout: 0,
        profil: {
          M: 7,
          CC: 4,
          CT: 8,
          F: 4,
          E: 4,
          PV: 3,
          I: 5,
          A: 2,
          Cd: 9,
          Sf: 10,
          Vo: 7,
          Int: 7,
          Sv: "3+",
          Inv: "5+",
        },
        regles: [
          "Dissimulation (5+)",
          "Infiltration (9)",
          "Tueur Solitaire",
          "Précision (4+)",
          "Unité d'Appui (1)",
        ],
        type: "Infanterie (Léger)",
      },
    ],
    options: [],
    legion: "XX",
  },
  {
    id: "escouade-terminator-lerneenne",
    nom: "Escouade Terminator Lernéenne",
    categorie: "Elite",
    cout: 250,
    composition: "1 Herseur, 4 Lernéens",
    effectif: { base: 5, max: 10, cout: 45 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "Alpha Legion"],
    notes:
      "Les Lernéens sont, à l'instar du monstre qui a inspiré leur nom et l'iconographie de leur Légion, une légende sans forme précise, l'objet d'une terreur sourde. Ils sont les mâchoires venimeuses de l'Hydre, l'assaut féroce venu de tous les côtés à la fois. Et tout comme le monstre mythologique, il est pratiquement impossible de les éliminer. Les Lernéens sont équipés d'armures tactiques Dreadnought Cataphractii ornées de motifs baroques et sont armés de chargeurs volkites, ce qui en fait des unités d'assaut redoutables. Après avoir sécurisé l'objectif, ils le défendent aussi farouchement que le monstre dont ils ont emprunté le symbolique.",
    equipement: ["Chargeur volkite", "Hache énergétique"],
    variantes: [
      {
        nom: "Escouade Terminator Lernéenne",
        cout: 0,
        profils: [
          {
            nom: "Lernéen",
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
            nom: "Herseur",
            profil: {
              M: 6,
              CC: 5,
              CT: 4,
              F: 4,
              E: 5,
              PV: 2,
              I: 4,
              A: 4,
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
          "Ligne (1)",
          "Avance Implacable",
          "Lent et Méthodique",
          "Haine (Legiones Astartes)",
        ],
        type: "Herseur : Infanterie (Sergent, Lourd) · Lernéen : Infanterie (Lourd)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "arme-tir",
        libelle: "Toute Figurine : remplacer le chargeur volkite",
        remplace: "Chargeur volkite",
        choix: [
          { nom: "— Conserver le chargeur volkite —", cout: 0 },
          { nom: "Combi-bolter (à la place du chargeur volkite)", cout: 0 },
          ...depuisListes(LISTES_EQUIPEMENT.combinees),
        ],
      },
      {
        type: "choix",
        id: "arme-cac",
        libelle: "Toute Figurine : remplacer la hache énergétique",
        remplace: "Hache énergétique",
        choix: [
          { nom: "— Conserver la hache énergétique —", cout: 0 },
          {
            nom: "Masse énergétique (à la place de la hache énergétique)",
            cout: 0,
          },
          {
            nom: "Griffe Lightning (à la place de la hache énergétique)",
            cout: 5,
          },
          {
            nom: "Gantelet énergétique (à la place de la hache énergétique)",
            cout: 10,
          },
          {
            nom: "Poing tronçonneur (à la place de la hache énergétique)",
            cout: 10,
          },
          {
            nom: "Marteau Thunder (à la place de la hache énergétique)",
            cout: 10,
          },
        ],
      },
      {
        type: "quantite",
        id: "paire-griffes-lightning",
        libelle:
          "Par tranche de cinq Figurines : un Lernéen échange son chargeur volkite et sa hache énergétique contre une paire de griffes Lightning",
        cout: 10,
        parTranche: 5,
        groupe: "paire-lightning",
        ajoute:
          "Paire de griffes Lightning (à la place du chargeur volkite et de la hache énergétique)",
      },
      {
        type: "quantite",
        id: "arme-lourde-lance-flammes",
        libelle:
          "Par tranche de cinq Figurines : lance-flammes lourd (à la place du chargeur volkite)",
        cout: 10,
        parTranche: 5,
        groupe: "arme-lourde",
        ajoute: "Lance-flammes lourd (à la place du chargeur volkite)",
      },
      {
        type: "quantite",
        id: "arme-lourde-canon-conversion",
        libelle:
          "Par tranche de cinq Figurines : canon à conversion (à la place du chargeur volkite)",
        cout: 15,
        parTranche: 5,
        groupe: "arme-lourde",
        ajoute: "Canon à conversion (à la place du chargeur volkite)",
      },
      {
        type: "quantite",
        id: "arme-lourde-autocanon-reaper",
        libelle:
          "Par tranche de cinq Figurines : autocanon Reaper (à la place du chargeur volkite)",
        cout: 15,
        parTranche: 5,
        groupe: "arme-lourde",
        ajoute: "Autocanon Reaper (à la place du chargeur volkite)",
      },
      {
        type: "quantite",
        id: "arme-lourde-eclateur-plasma",
        libelle:
          "Par tranche de cinq Figurines : éclateur à plasma (à la place du chargeur volkite)",
        cout: 10,
        parTranche: 5,
        groupe: "arme-lourde",
        ajoute: "Éclateur à plasma (à la place du chargeur volkite)",
      },
    ],
    legion: "XX",
  },

  /* ----------------------------------------------------------
     UNITÉS LEGACY RÉSERVÉES À LA XXe LÉGION (ALPHA LEGION)
     Transcrit depuis alpha_legion.pdf et alpha_legion_wargear.pdf
     (Warhammer: The Horus Heresy — Legacies of the Age of Darkness,
     texte uniquement disponible en anglais : traduction maison, à
     recouper avec une version française si elle paraît un jour).
     Marquées legacy: true (comme Garde Sanguinienne) pour s'afficher
     avec la mention « (Legacies) » dans le menu déroulant « Unité à
     ajouter ». Voir js/armes-data.js pour leurs armes propres — le
     Fusil à pompe Banestrike, le Bolter/Combi-bolter Banestrike et le
     Pistolet Inferno existaient déjà (réutilisés tels quels).
     ---------------------------------------------------------- */
  {
    id: "autilon-skorr",
    nom: "Autilon Skorr",
    legacy: true,
    categorie: "État-major",
    cout: 135,
    composition: "1 Autilon Skorr",
    traits: ["Renégat", "Alpha Legion", "Maître de la Légion"],
    notes:
      "Consul-Delegatus de l'Alpha Legion. Autilon Skorr fut fréquemment dépêché pour exiger la Compliance de mondes nouvellement découverts au nom de l'Imperium. Les mondes qui refusaient sombraient invariablement dans le désordre en quelques semaines, et finissaient par capituler. Après le déclenchement de l'Hérésie d'Horus, Skorr continua de jouer ce rôle, jusqu'à la débâcle d'Epsilon-Stranivar IX, où les forces disparates d'une douzaine de groupes de bataille Loyalistes repoussèrent ses forces. Le prestige de Skorr en fut entaché, et il tomba rapidement en disgrâce, tant auprès du Maître de Guerre que de son Primarque. Désespéré de retrouver sa gloire passée, il saisit la campagne de Mezoa comme une chance de rédemption. Rime-shard — l'arme personnelle de Skorr, connue sous le nom de Rime-shard, prend la forme d'une hache à long manche à la lame courbe semi-translucide. Bien qu'incorporant des composants communs issus de Mondes-Forges connus, on suppute que cette arme est une fusion non autorisée de patrons STC impériaux et de technologie xenos prohibée.",
    equipement: ["Rime-shard", "Pistolet bolter", "Grenades Frag", "Grenades Krak"],
    variantes: [
      {
        nom: "Autilon Skorr",
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
        regles: ["Consul-Delegatus"],
        type: "Infanterie (Unique, État-major)",
      },
    ],
    options: [],
    legion: "XX",
  },
  {
    id: "cadre-perturbation-effrit",
    nom: "Cadre de Perturbation Effrit",
    legacy: true,
    categorie: "Reco",
    cout: 145,
    composition: "1 Principal, 4 Disrupteurs",
    effectif: { base: 5, max: 10, cout: 25 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "Alpha Legion", "Écran de Fumée"],
    notes:
      "Bien que désigné officieusement Escouade Furtive Effrit, la réalité de l'organisation et du rôle de cet échelon d'élite de la XXe Légion est bien plus complexe et échappe aux conventions simples. De tels détachements, composés d'individus hautement capables, choisis pour leurs aptitudes innées à la discrétion, à la subterfuge et à la reconnaissance, sont chargés de missions périlleuses sur le champ de bataille, depuis l'observation rapprochée de commandants ennemis jusqu'aux frappes de perturbation contre des machines de guerre vulnérables. Dans ce rôle, ils sont fréquemment infiltrés derrière les lignes ennemies pendant des mois, avec guère plus d'équipement que ce que peuvent transporter des Légionnaires isolés. Hurlement de l'Hydre — projetées depuis des réseaux de perturbation confiés aux équipes d'infiltration avancée d'élite, les Hurlements de l'Hydre sont un ensemble d'ondes ciblées et de signaux perturbateurs sur une multitude de fréquences. Utilisant des systèmes que l'on croit dérivés d'Intelligences Abominables proscrites datant de l'Âge des Ténèbres, ces émissions peuvent submerger les communications, les réseaux de balayage et de coordination ennemis, ce qui, à moins d'être spécifiquement contré, rend inutilisables des pans entiers de l'équipement standard de la Légion.",
    equipement: ["Fusil à pompe Banestrike", "Pistolet bolter", "Grenades Frag", "Grenades Krak"],
    variantes: [
      {
        nom: "Cadre de Perturbation Effrit",
        cout: 0,
        profils: [
          {
            nom: "Disrupteur",
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
              Int: 8,
              Sv: "3+",
              Inv: "—",
            },
          },
          {
            nom: "Principal",
            profil: {
              M: 7,
              CC: 4,
              CT: 5,
              F: 4,
              E: 4,
              PV: 2,
              I: 4,
              A: 2,
              Cd: 9,
              Sf: 8,
              Vo: 7,
              Int: 8,
              Sv: "3+",
              Inv: "—",
            },
          },
        ],
        regles: ["Infiltration (8)", "Hurlement de l'Hydre"],
        type: "Principal : Infanterie (Sergent, Tirailleurs) · Disrupteur : Infanterie (Tirailleurs)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "principal-melee",
        libelle: "Principal : objet de la liste des Armes de Mêlée de Sergent de Légion",
        ajoute: true,
        prefixeFiche: "Principal : ",
        choix: [
          { nom: "— Aucun —", cout: 0 },
          ...depuisListes(LISTES_EQUIPEMENT.meleeSergent),
        ],
      },
      {
        type: "quantite",
        // « Bolter Némésis » : profil d'arme non donné dans l'extrait
        // fourni (pas d'encart WARGEAR sur cette fiche) — à compléter
        // depuis le livre au besoin.
        id: "bolter-nemesis",
        libelle: "Figurines : Bolter Némésis (à la place du fusil à pompe Banestrike)",
        cout: 10,
        parTranche: 1,
        ajoute: "Bolter Némésis (à la place du fusil à pompe Banestrike)",
      },
      {
        type: "quantite",
        id: "dague-energetique",
        libelle: "Figurines : dague énergétique",
        cout: 5,
        parTranche: 1,
        ajoute: "Dague énergétique",
      },
      optionBombesFusionUnite(),
    ],
    legion: "XX",
  },

  /* ----------------------------------------------------------
     UNITÉS RÉSERVÉES À LA IVe LÉGION (IRON WARRIORS)
     Transcrit depuis photos du livre d'armée : Perturabo, Forgeguerre,
     Escouade Terminator Tyrans de Siège et Manipule du Cercle de Fer
     (voir js/armes-data.js pour leurs armes propres et l'Arsenal des
     Iron Warriors). Plusieurs objets d'équipement de Forgeguerre et de
     Perturabo (Combi-grav, Servobras, Contrôleur de cortex,
     Cognis-signum) n'ont pas de profil d'Arme donné dans les photos
     transcrites : ils figurent tels quels sur la fiche, sans table de
     caractéristiques (comme Les Écailles Pythiennes ou le Bouclier de
     combat Karceri) — à compléter si le livre en donne un.
     ---------------------------------------------------------- */
  {
    id: "perturabo",
    nom: "Perturabo",
    categorie: "Seigneur de Guerre",
    cout: 425,
    composition: "1 Perturabo",
    traits: ["Renégat", "Iron Warriors", "Maître de la Légion"],
    equipement: ["L'Arsenal du Logos", "Contrôleur de cortex", "Cognis-signum"],
    variantes: [
      {
        nom: "Perturabo",
        cout: 0,
        profil: {
          M: 7,
          CC: 7,
          CT: 6,
          F: 7,
          E: 6,
          PV: 6,
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
          "Sire des Iron Warriors",
          "Massif (6)",
          "Guerrier-artisan (3)",
          "Le Briseur",
          "Guerrier Éternel (2)",
        ],
        type: "Parangon (Unique)",
      },
    ],
    options: [
      {
        type: "case",
        id: "brise-forge-profane",
        libelle: "Doter cette Figurine du Brise-forge Profané",
        cout: 35,
        ajoute: "Brise-forge Profané",
      },
    ],
    legion: "IV",
  },
  {
    id: "forgeguerre",
    nom: "Forgeguerre",
    categorie: "Quartier Général",
    cout: 155,
    composition: "1 Forgeguerre",
    traits: ["[Allégeance]", "Iron Warriors", "Maître de la Légion"],
    notes:
      "Aussi efficaces pour superviser un pilonnage d'artillerie qu'à mener leurs frères au combat, les Forgeguerres de la IVe Légion furent responsables, durant les dernières années de l'Hérésie d'Horus, de la destruction de nombreuses forteresses.",
    equipement: [
      "Broyeur à gravitons",
      "Combi-grav",
      "Servobras",
      "Contrôleur de cortex",
      "Cognis-signum",
    ],
    variantes: [
      {
        nom: "Forgeguerre",
        cout: 0,
        profil: {
          M: 6,
          CC: 5,
          CT: 4,
          F: 4,
          E: 5,
          PV: 5,
          I: 4,
          A: 5,
          Cd: 10,
          Sf: 9,
          Vo: 9,
          Int: 10,
          Sv: "2+",
          Inv: "4+",
        },
        regles: [
          "Massif (2)",
          "Guerrier-artisan (2)",
          "Avance Implacable",
          "Lent et Méthodique",
        ],
        type: "Infanterie (État-major, Lourd)",
      },
    ],
    options: [
      {
        type: "case",
        id: "cyber-familier",
        libelle: "Doter cette Figurine d'un cyber-familier",
        cout: 10,
        ajoute: "Cyber-familier",
      },
    ],
    legion: "IV",
  },
  {
    id: "escouade-terminator-tyrans-de-siege",
    nom: "Escouade Terminator Tyrans de Siège",
    categorie: "Assaut Lourd",
    cout: 300,
    composition: "1 Maître de Siège, 4 Tyrans",
    effectif: { base: 5, max: 10, cout: 55 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "Iron Warriors"],
    notes:
      "Engoncés dans de lourdes armures Cataphractii et tirant des salves ininterrompues de missiles Saturateurs ou Briseurs grâce à leurs lance-roquettes dorsaux, ces guerriers implacables sont des briseurs de siège inégalés. Le spectacle effroyable de l'avance de ces guerriers abattant tout obstacle devient bientôt synonyme du courroux de Perturabo. Recrutés parmi les Iron Warriors les plus endurcis, les Terminators Tyrans de Siège bravent les bombardements les plus féroces au mépris de leurs vies, car ils ont une conscience encore plus aiguë que leurs frères de bataille de la funeste arithmétique de la guerre.",
    equipement: [
      "Lance-roquettes Tyran — Saturateur",
      "Lance-roquettes Tyran — Briseur",
      "Combi-bolter",
      "Gantelet énergétique",
    ],
    variantes: [
      {
        nom: "Escouade Terminator Tyrans de Siège",
        cout: 0,
        profils: [
          {
            nom: "Tyran",
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
              Sf: 7,
              Vo: 7,
              Int: 7,
              Sv: "2+",
              Inv: "4+",
            },
          },
          {
            nom: "Maître de Siège",
            profil: {
              M: 6,
              CC: 4,
              CT: 4,
              F: 4,
              E: 5,
              PV: 2,
              I: 4,
              A: 2,
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
          "Protocoles de Tir (2)",
          "Unité d'Appui (1)",
        ],
        type: "Maître de Siège : Infanterie (Sergent, Lourd) · Tyran : Infanterie (Lourd)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "arme-tir",
        libelle: "Toute Figurine : remplacer le combi-bolter",
        remplace: "Combi-bolter",
        choix: [
          { nom: "— Conserver le combi-bolter —", cout: 0 },
          ...depuisListes(LISTES_EQUIPEMENT.combinees),
        ],
      },
      {
        type: "case",
        id: "omniscope",
        libelle: "Le Maître de Siège : doter d'un omniscope",
        cout: 10,
        ajoute: "Omniscope",
      },
      // Options additionnelles Iron Warriors Legacy Wargear
      // (iron_warriors_wargear.pdf), section « Tyrant Siege Terminator
      // Squad ».
      {
        type: "case",
        id: "harnais",
        libelle: "Maître de Siège : harnais à grenades",
        cout: 5,
        ajoute: "Maître de Siège : harnais à grenades",
      },
      {
        type: "quantite",
        id: "paires-griffes",
        libelle:
          "Figurines : paire de griffes Lightning (remplace le combi-bolter et le gantelet énergétique)",
        cout: 10,
        parTranche: 1,
        ajoute:
          "Paire de griffes Lightning (à la place du combi-bolter et du gantelet énergétique)",
      },
      {
        type: "quantite",
        id: "poing-tronconneur",
        libelle:
          "Figurines : poing tronçonneur (à la place du gantelet énergétique)",
        cout: 0,
        parTranche: 1,
        ajoute: "Poing tronçonneur (à la place du gantelet énergétique)",
      },
    ],
    legion: "IV",
  },
  {
    id: "manipule-cercle-de-fer",
    nom: "Manipule du Cercle de Fer",
    categorie: "Suites",
    cout: 150,
    composition: "1 Domitar-Ferrum",
    effectif: { base: 1, max: 6, cout: 135 },
    traits: ["[Allégeance]", "Iron Warriors", "Bouclier"],
    notes:
      "Un des produits les plus visibles du génie de Perturabo lorsqu'il fut délivré des contraintes imposées par le Clergé de Mars fut le Cercle de Fer, également appelé Domitar-Ferrum. Ces automates furent initialement déployés en tant que gardes du corps du Primarque après la Bataille de Phall, car il estimait que ses propres fils lui avaient failli. Variantes du modèle Domitar/Conqueror, ils étaient conçus pour être les instruments de la volonté de leur créateur, et adaptés aux méthodes de guerre du Primarque. Initialement déployés aux côtés de leur maître, au fil de leur production, ils furent employés ailleurs au sein de la Légion.",
    equipement: [
      "Broyeur à gravitons",
      "Canon à shrapnels jumelé",
      "Bouclier de combat Karceri",
    ],
    variantes: [
      {
        nom: "Manipule du Cercle de Fer",
        cout: 0,
        profil: {
          M: 7,
          CC: 4,
          CT: 7,
          F: 7,
          E: 7,
          PV: 4,
          I: 3,
          A: 3,
          Cd: 8,
          Sf: 12,
          Vo: 5,
          Int: 5,
          Sv: "2+",
          Inv: "5+",
        },
        regles: [
          "Le Bouclier du Tyran de Fer",
          "Massif (4)",
          "Avance Implacable",
          "Impact (A)",
          "Orage de Feu",
        ],
        type: "Automate (Lourd)",
      },
    ],
    options: [],
    legion: "IV",
  },

  /* ----------------------------------------------------------
     UNITÉS LEGACY RÉSERVÉES À LA IVe LÉGION (IRON WARRIORS)
     Transcrit depuis iron_warriors.pdf et iron_warriors_wargear.pdf
     (Warhammer: The Horus Heresy — Legacies of the Age of Darkness,
     texte uniquement disponible en anglais : traduction maison, à
     recouper avec une version française si elle paraît un jour).
     Marquées legacy: true (comme Garde Sanguinienne) pour s'afficher
     avec la mention « (Legacies) » dans le menu déroulant « Unité à
     ajouter ». Voir js/armes-data.js pour leurs armes propres.
     ---------------------------------------------------------- */
  {
    id: "forgeguerre-armure-artificer",
    nom: "Forgeguerre en Armure Artificer",
    legacy: true,
    categorie: "Quartier Général",
    cout: 140,
    composition: "1 Forgeguerre en Armure Artificer",
    traits: ["[Allégeance]", "Iron Warriors", "Maître de la Légion"],
    notes:
      "Certains Forgeguerres préféraient la mobilité que leur offrait une armure plus légère à celle de leurs frères vêtus de plaques Terminator. Non moins doués pour autant, ces guerriers étaient tout aussi capables d'évaluer une fortification et de la faire tomber. Cette Figurine compte comme une Figurine Forgeguerre pour la sélection du Détachement Apex Le Marteau d'Olympia.",
    equipement: [
      "Bolter",
      "Pistolet bolter",
      "Servobras",
      "Contrôleur de cortex",
      "Cognis-signum",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Forgeguerre en Armure Artificer",
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
          Int: 10,
          Sv: "2+",
          Inv: "4+",
        },
        regles: ["Guerrier-artisan (2)"],
        type: "Infanterie (État-major)",
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
          // Iron Warriors Legacy Wargear (iron_warriors_wargear.pdf) :
          // Masse à gravitons ajoutée à la liste d'Équipement d'Officier
          // de Légion (+15 Points), Bolter à shrapnels en échange direct
          // du bolter pour toute Figurine Iron Warriors (+3 Points).
          { nom: "Masse à gravitons (Legacy)", cout: 15 },
          { nom: "Bolter à shrapnels (Legacy)", cout: 3 },
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
          // Iron Warriors Legacy Wargear : Masse à gravitons (liste
          // d'Officier de Légion, +15 Points), Pistolet à shrapnels en
          // échange direct du pistolet bolter (+2 Points).
          { nom: "Masse à gravitons (Legacy)", cout: 15 },
          { nom: "Pistolet à shrapnels (Legacy)", cout: 2 },
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
        libelle: "Cyber-familier",
        cout: 10,
        ajoute: "Cyber-familier",
      },
    ],
    legion: "IV",
  },
  {
    id: "narik-dreygur",
    nom: "Nârik Dreygur",
    legacy: true,
    categorie: "État-major",
    cout: 115,
    composition: "1 Nârik Dreygur",
    traits: ["Loyaliste", "Iron Warriors"],
    notes:
      "L'Arpenteur des Tombes, le Pion du Revenant. Autrefois commandant respecté, Dreygur mena sa compagnie durant quatre-vingt-dix ans avant d'être abattu sur les champs de bataille d'Isstvan V. Sa défaite lui coûta la faveur de Perturabo, qui écarta le commandant brisé. Ayant perdu la faveur de son Primarque et son corps brisé reconstruit à coups d'augmétiques, il fut initié aux mystères technologiques de l'Apolakron. Dreygur, désormais connu comme l'Arpenteur des Tombes, rejoignit la guerre en tant que Consul Praevian. Rejeté par son Primarque et ses frères, il en vint rapidement à préférer la compagnie de ses charges automates, qui lui montraient plus de loyauté que ceux qu'il appelait ses « frères ». Gantelet à gravitons — incorporé à la plaque de bataille de Dreygur, cet énorme gantelet motorisé est doté de brutales serres de fer en guise de doigts ; le gant tout entier crépite d'un champ d'énergie de perturbation à la volonté de son porteur.",
    equipement: [
      "Gantelet à gravitons",
      "Pistolet bolter",
      "Grenades Frag",
      "Grenades Krak",
      "Contrôleur de cortex",
    ],
    variantes: [
      {
        nom: "Nârik Dreygur",
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
          "Maître des Automates (voir Liber Hereticus, page 37)",
        ],
        type: "Infanterie (Unique, État-major, Lourd)",
      },
    ],
    options: [
      // Iron Warriors Legacy Wargear (iron_warriors_wargear.pdf) :
      // échange générique disponible à toute Figurine Iron Warriors
      // dotée d'un pistolet bolter.
      {
        type: "case",
        id: "pistolet-shrapnels",
        libelle: "Pistolet à shrapnels (Legacy, à la place du pistolet bolter)",
        cout: 2,
        ajoute: "Pistolet à shrapnels (Legacy) (à la place du pistolet bolter)",
      },
    ],
    legion: "IV",
  },
  {
    id: "cohorte-dominators",
    nom: "Cohorte de Dominators Iron Warriors",
    legacy: true,
    categorie: "Suites",
    cout: 255,
    composition: "5 Dominators",
    effectif: { base: 5, max: 10, cout: 45 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "Iron Warriors"],
    notes:
      "Autrefois honorés entre tous comme sans égal parmi leurs frères et investis du rôle de garde rapprochée de leur géniteur, les Dominators, ou Tyranthikos, furent relevés de leur charge la plus prisée après les événements de la Bataille de Phall. Le dévoilement par Perturabo de ses automates du « Cercle de Fer » supplanta l'ancienne garde du corps du Primarque et renvoya les guerriers vétérans en première ligne de la campagne du Maître de Guerre vers Terra. Leur expérience du combat éclipsée par les moteurs logiques calculateurs du Cercle de Fer, et leur honneur souillé, les Dominators devinrent de plus en plus amers.",
    equipement: ["Combi-bolter", "Marteau Thunder"],
    variantes: [
      {
        nom: "Dominator",
        cout: 0,
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
        regles: [
          "Massif (2)",
          "Avance Implacable",
          "Lent et Méthodique",
          "Sacrifiable (1)",
          "Haine (Automates)",
          "Ceux Jadis Honorés",
        ],
        type: "Infanterie (Lourd)",
      },
    ],
    options: [
      {
        type: "quantite",
        id: "lance-flammes-lourd",
        libelle:
          "Figurines (une par tranche de cinq) : lance-flammes lourd (à la place du combi-bolter)",
        cout: 10,
        parTranche: 5,
        groupe: "lourd",
        ajoute: "Lance-flammes lourd (à la place du combi-bolter)",
      },
      {
        type: "quantite",
        id: "multi-fuseur",
        libelle:
          "Figurines (une par tranche de cinq) : multi-fuseur (à la place du combi-bolter)",
        cout: 15,
        parTranche: 5,
        groupe: "lourd",
        ajoute: "Multi-fuseur (à la place du combi-bolter)",
      },
      {
        type: "quantite",
        id: "autocanon-reaper",
        libelle:
          "Figurines (une par tranche de cinq) : Autocanon Reaper (à la place du combi-bolter)",
        cout: 15,
        parTranche: 5,
        groupe: "lourd",
        ajoute: "Autocanon Reaper (à la place du combi-bolter)",
      },
      {
        type: "quantite",
        id: "poing-tronconneur",
        libelle:
          "Figurines : poing tronçonneur (à la place du marteau Thunder)",
        cout: 5,
        parTranche: 1,
        ajoute: "Poing tronçonneur (à la place du marteau Thunder)",
      },
      {
        type: "quantite",
        id: "chargeur-volkite",
        libelle: "Figurines : chargeur volkite (à la place du combi-bolter)",
        cout: 0,
        parTranche: 1,
        groupe: "combi",
        ajoute: "Chargeur volkite (à la place du combi-bolter)",
      },
      ...quantiteDepuisListe(LISTES_EQUIPEMENT.combinees, {
        groupe: "combi",
        remplace: "du combi-bolter",
      }),
    ],
    legion: "IV",
  },
  {
    id: "iron-havocs",
    nom: "Iron Havocs",
    legacy: true,
    categorie: "Appui",
    cout: 135,
    composition: "1 Sergent Iron Havoc, 4 Iron Havocs",
    effectif: { base: 5, max: 10, cout: 25 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "Iron Warriors"],
    notes:
      "Parmi la plupart des Legiones Astartes, le rôle principal des escouades de soutien lourd est de saturer une zone ou une cible ennemie sous un déluge de tir, oblitérant l'ennemi à grand renfort de puissance de feu. Les Iron Havocs de la IVe Légion sont toutefois une formation d'élite ayant élevé ces tactiques presque au rang d'art. Ces guerriers comptent parmi les meilleurs tireurs des Iron Warriors, alliant précision d'obus et de tir explosif tandis qu'ils avancent aux côtés des cadres d'assaut de la Légion. Les Iron Havocs sont souvent rattachés aux éléments de tête de tout assaut, où leur précision inégalée leur permet de nettoyer fortifications et points forts d'infanterie ennemis avec une efficacité meurtrière, ouvrant la voie que les Iron Warriors balaient ensuite de tout survivant.",
    equipement: [
      "Canon à shrapnels",
      "Pistolet bolter",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Iron Havocs",
        cout: 0,
        profils: [
          {
            nom: "Iron Havoc",
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
            nom: "Sergent Iron Havoc",
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
        regles: ["Unité d'Appui (1)", "Ferrum Occularis"],
        type: "Sergent Iron Havoc : Infanterie (Sergent) · Iron Havoc : Infanterie",
      },
    ],
    options: [
      {
        type: "choix",
        id: "sergent-melee",
        libelle:
          "Sergent Iron Havoc : objet de la liste des Armes de Mêlée de Sergent de Légion",
        ajoute: true,
        prefixeFiche: "Sergent Iron Havoc : ",
        choix: [
          { nom: "— Aucun —", cout: 0 },
          ...depuisListes(LISTES_EQUIPEMENT.meleeSergent),
        ],
      },
      {
        type: "case",
        id: "vexillum",
        libelle: "Un Iron Havoc : vexillum",
        cout: 10,
        ajoute: "Un Iron Havoc : vexillum",
      },
      // Iron Warriors Legacy Wargear (iron_warriors_wargear.pdf) :
      // échange générique disponible à toute Figurine Iron Warriors
      // dotée d'un pistolet bolter.
      {
        type: "quantite",
        id: "pistolet-shrapnels",
        libelle:
          "Figurines : pistolet à shrapnels (Legacy, à la place du pistolet bolter)",
        cout: 2,
        parTranche: 1,
        ajoute: "Pistolet à shrapnels (Legacy) (à la place du pistolet bolter)",
      },
      {
        type: "choix",
        id: "equipement-legion-1",
        libelle: "Équipement de Légion (1er Iron Havoc, deux max dans l'unité)",
        ajoute: true,
        prefixeFiche: "Iron Havoc : ",
        choix: [
          { nom: "— Aucun —", cout: 0 },
          { nom: "Nuncio-vox", cout: 10 },
          { nom: "Scanner augure", cout: 10 },
        ],
      },
      {
        type: "choix",
        id: "equipement-legion-2",
        libelle: "Équipement de Légion (2e Iron Havoc)",
        ajoute: true,
        prefixeFiche: "Iron Havoc : ",
        choix: [
          { nom: "— Aucun —", cout: 0 },
          { nom: "Nuncio-vox", cout: 10 },
          { nom: "Scanner augure", cout: 10 },
        ],
      },
      {
        type: "choix",
        id: "arme-lourde-uniforme",
        libelle:
          "Toute l'unité : remplacer le canon à shrapnels (même choix pour toutes les Figurines)",
        ajoute: true,
        parFigurine: true,
        prefixeFiche: "Toute l'unité : ",
        choix: [
          { nom: "— Conserver le canon à shrapnels —", cout: 0 },
          { nom: "Autocanon", cout: 10 },
          { nom: "Lance-missiles", cout: 5 },
          { nom: "Canon laser", cout: 15 },
        ],
      },
    ],
    legion: "IV",
  },
  {
    id: "le-tourmenteur",
    nom: "Le Tourmenteur",
    legacy: true,
    categorie: "Seigneurs des Batailles",
    cout: 700,
    composition: "1 Le Tourmenteur",
    traits: ["Renégat", "Iron Warriors", "Écran de Fumée"],
    notes:
      "Le Tourmenteur est un prodige de conversion d'un char super-lourd Shadowsword, maintenu par la Légion des Iron Warriors même après l'abandon de ce type de véhicule au sein des Légions. Utilisé comme véhicule de commandement mobile, aussi résilient que meurtrier, la superstructure et le moteur du véhicule ont été radicalement remaniés pour accueillir Perturabo à sa juste échelle, ainsi que ses gardes du corps du Cercle de Fer. Aucune machine à tuer plus efficace n'existait dans le parc de véhicules des Iron Warriors. Cette Figurine a des Points d'Accès sur la Face Arrière.",
    equipement: [
      "Canon Volcano (Shadowsword) d'Axe Central",
      "Bolter lourd jumelé de Coque (Avant)",
    ],
    variantes: [
      {
        nom: "Le Tourmenteur",
        cout: 0,
        profilVehicule: {
          M: 10,
          CT: 4,
          avant: 14,
          flanc: 13,
          arriere: 12,
          PC: 16,
          transport: 14,
        },
        regles: ["Antre du Tyran de Fer", "Macro-auspex", "Boucliers Void (1)"],
        type: "Véhicule (Unique, Transport, Super-lourd)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "sponsons",
        libelle: "Doter cette Figurine d'une des options suivantes",
        choix: [
          { nom: "— Aucune —", cout: 0 },
          {
            nom: "Deux canons laser et deux bolters lourds jumelés (Sponsons)",
            cout: 40,
          },
          {
            nom: "Deux canons laser et deux lance-flammes lourds jumelés (Sponsons)",
            cout: 40,
          },
          // Iron Warriors Legacy Wargear (iron_warriors_wargear.pdf) :
          // ajoutée à la liste des Armes Sponson de Légion (+10 Points).
          { nom: "Deux canons à shrapnels (Sponsons, Legacy)", cout: 10 },
        ],
      },
      {
        type: "choix",
        id: "pivot",
        libelle:
          "Doter cette Figurine d'un objet de la liste des Armes sur Pivot de Légion",
        ajoute: true,
        choix: [
          { nom: "— Aucune —", cout: 0 },
          // Iron Warriors Legacy Wargear : ajoutée à la liste des Armes
          // sur Pivot de Légion (+15 Points).
          { nom: "Canon à shrapnels sur Pivot (Legacy)", cout: 15 },
          ...depuisListes(LISTES_EQUIPEMENT.pivot),
        ],
      },
      {
        type: "case",
        id: "hunter-killer",
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
    ],
    legion: "IV",
  },

  /* ----------------------------------------------------------
     UNITÉS RÉSERVÉES À LA VIIIe LÉGION (NIGHT LORDS)
     Transcrit depuis photos du livre d'armée : Konrad Curze, Sevatar,
     Escouade Terminator Contekar, Escouade Terreur et Escouade de
     Rapaces Nocturnes (voir js/armes-data.js pour leurs armes propres
     et l'Arsenal des Night Lords).
     ---------------------------------------------------------- */
  {
    id: "konrad-curze",
    nom: "Konrad Curze",
    categorie: "Seigneur de Guerre",
    cout: 450,
    composition: "1 Konrad Curze",
    notes:
      "Primarque des Night Lords, Hante-la-Nuit, Le Dernier Juge, Le Roi des Terreurs. Surnommé « Hante-la-Nuit » par les habitants de son monde d'adoption Nostramo, Konrad Curze acquit dès ses premiers pas une sinistre réputation. Hante-la-Nuit finit par ramener l'ordre sur Nostramo, en instituant un règne de la terreur qui n'épargnait ni les criminels ni les despotes. Quand l'Empereur le retrouva enfin, Curze avait déjà prédit toute sa vie, de son rôle en tant que Primarque jusqu'à sa fin tragique, et sa raison avait été fort ébranlée par les visions de l'horreur qui allait bientôt engloutir la galaxie. Après avoir pris le commandement de la VIIIe Légion, qu'il baptisa les Night Lords, Curze se mit en devoir d'appliquer ses méthodes à la galaxie. À la seconde demande de son frère, le Maître de Guerre, Curze se rallia aux Renégats, sire cruel désormais dirigée contre ses autres frères et leurs Légions.",
    traits: ["Renégat", "Night Lords", "Maître de la Légion"],
    equipement: ["Miséricorde et Pardon", "Les Endeuilleurs"],
    variantes: [
      {
        nom: "Konrad Curze",
        cout: 0,
        profil: {
          M: 8,
          CC: 7,
          CT: 6,
          F: 6,
          E: 6,
          PV: 7,
          I: 7,
          A: 6,
          Cd: 12,
          Sf: 10,
          Vo: 8,
          Int: 10,
          Sv: "2+",
          Inv: "4+",
        },
        regles: [
          "Sire des Night Lords",
          "Massif (4)",
          "Une Mort Annoncée de Longue Date",
          "Peur (2)",
          "Guerrier Éternel (2)",
        ],
        type: "Parangon (Unique)",
      },
    ],
    options: [],
    legion: "VIII",
  },
  {
    id: "sevatar",
    nom: "Sevatar",
    categorie: "Quartier Général",
    cout: 220,
    composition: "1 Sevatar",
    notes:
      "Premier Capitaine des Night Lords, Le Prince des Corbeaux, et Maître des Atramentar. Jago Sevatarion a le triste honneur d'être le premier Renégat à s'être jamais écrié « Mort au faux Empereur ». Aussi doué qu'arrogant, Sevatar est un combattant cruel, imperméable au concept d'honneur. Cette attitude se reflète dans son apparence, soigneusement étudiée pour inspirer la crainte. Son armure bleu nuit est ornée de peaux écorchées et son heaume est sculpté en forme de crâne grimaçant. Ce visage morbide dissimule non seulement l'âme d'un meurtrier, mais aussi un don de pouvoirs psychiques latents qui, bien qu'il les réprime, permettent à Sevatar d'accroître encore ses capacités de combattant.",
    traits: ["Renégat", "Night Lords", "Maître de la Légion"],
    equipement: [
      "Murmure de la Nuit",
      "Pistolet bolter",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Sevatar",
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
          Vo: 8,
          Int: 8,
          Sv: "2+",
          Inv: "4+",
        },
        regles: [
          "Précision (4+)",
          "Peur (2)",
          "Combattant Déloyal",
          "Songes Ténébreux",
        ],
        type: "Infanterie (Unique, État-major)",
      },
    ],
    options: [],
    legion: "VIII",
  },
  {
    id: "escouade-terminator-contekar",
    nom: "Escouade Terminator Contekar",
    categorie: "Elite",
    cout: 235,
    composition: "1 Dissident, 4 Contekar",
    effectif: { base: 5, max: 15, cout: 40 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "Night Lords"],
    equipement: ["Lame tronçonneuse", "Caviteur volkite"],
    variantes: [
      {
        nom: "Escouade Terminator Contekar",
        cout: 0,
        profils: [
          {
            nom: "Contekar",
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
              Sf: 7,
              Vo: 7,
              Int: 7,
              Sv: "2+",
              Inv: "5+",
            },
          },
          {
            nom: "Dissident",
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
              Sf: 8,
              Vo: 7,
              Int: 7,
              Sv: "2+",
              Inv: "5+",
            },
          },
        ],
        regles: [
          "Massif (2)",
          "Avance Implacable",
          "Frappe en Profondeur",
          "Avant-garde (3)",
          "Peur (1)",
        ],
        type: "Dissident : Infanterie (Sergent) · Contekar : Infanterie",
      },
    ],
    options: [
      {
        type: "choix",
        id: "dissident-arme-cac",
        libelle:
          "Le Dissident : échanger sa lame tronçonneuse contre une griffe énergétique Escaton",
        ajoute: true,
        prefixeFiche: "Dissident : ",
        choix: [
          { nom: "— Aucun échange —", cout: 0 },
          {
            nom: "Griffe énergétique Escaton (à la place de la lame tronçonneuse)",
            cout: 10,
          },
        ],
      },
      {
        type: "choix",
        id: "arme-tir",
        libelle: "Toute Figurine : remplacer gratuitement le caviteur volkite",
        remplace: "Caviteur volkite",
        choix: [
          { nom: "— Conserver le caviteur volkite —", cout: 0 },
          {
            nom: "Lance-flammes lourd (à la place du caviteur volkite)",
            cout: 0,
          },
        ],
      },
    ],
    legion: "VIII",
  },
  {
    id: "escouade-terreur",
    nom: "Escouade Terreur",
    categorie: "Troupes",
    cout: 115,
    composition: "1 Bourreau, 4 Exécuteurs",
    effectif: { base: 5, max: 15, cout: 18 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "Night Lords"],
    notes:
      "Tortionnaires et bourreaux, écorcheurs et mutilateurs, les escouades Terreur accueillent dans leurs rangs les Night Lords les plus calculateurs et les plus imaginatifs. À la fois jugés et bourreaux parés de nuit et d'orage, ils étaient dotés d'un arsenal adapté à leurs effroyables méthodes de combat. Beaucoup arboraient également les gantelets rouges des morts en sursis, condamnés pour des actes répréhensibles mais néanmoins autorisés à continuer de servir tant que leurs talents étaient utiles au maître macabre des Night Lords.",
    equipement: [
      "Épée tronçonneuse",
      "Pistolet bolter",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Escouade Terreur",
        cout: 0,
        profils: [
          {
            nom: "Exécuteur",
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
              Inv: "—",
            },
          },
          {
            nom: "Bourreau",
            profil: {
              M: 7,
              CC: 4,
              CT: 4,
              F: 4,
              E: 4,
              PV: 1,
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
        regles: ["Haine (Infanterie)", "Peur (1)", "Avant-garde (2)"],
        type: "Bourreau : Infanterie (Sergent) · Exécuteur : Infanterie",
      },
    ],
    options: [
      {
        type: "choix",
        id: "arme-cac",
        libelle: "Toute Figurine : remplacer l'épée tronçonneuse",
        remplace: "Épée tronçonneuse",
        choix: [
          { nom: "— Conserver l'épée tronçonneuse —", cout: 0 },
          { nom: "Bolter (à la place de l'épée tronçonneuse)", cout: 0 },
          {
            nom: "Chargeur volkite (à la place de l'épée tronçonneuse)",
            cout: 2,
          },
          { nom: "Canon rotor (à la place de l'épée tronçonneuse)", cout: 5 },
          { nom: "Lance-flammes (à la place de l'épée tronçonneuse)", cout: 5 },
          {
            nom: "Hache tronçonneuse (à la place de l'épée tronçonneuse)",
            cout: 0,
          },
          {
            nom: "Vouge tronçonneur (à la place de l'épée tronçonneuse)",
            cout: 5,
          },
        ],
      },
      {
        type: "choix",
        id: "bourreau-arme-cac",
        libelle: "Le Bourreau : remplacer son épée tronçonneuse",
        ajoute: true,
        prefixeFiche: "Bourreau : ",
        choix: [
          { nom: "— Aucun échange —", cout: 0 },
          ...depuisListes(LISTES_EQUIPEMENT.meleeSergent),
        ],
      },
      {
        type: "choix",
        id: "bourreau-pistolet",
        libelle: "Le Bourreau : remplacer son pistolet bolter",
        ajoute: true,
        prefixeFiche: "Bourreau : ",
        choix: [
          { nom: "— Aucun échange —", cout: 0 },
          {
            nom: "Pistolet désintégrateur (à la place du pistolet bolter)",
            cout: 10,
          },
          ...depuisListes(LISTES_EQUIPEMENT.pistolets),
        ],
      },
      {
        type: "case",
        id: "vexillum",
        libelle: "Un Exécuteur : doter d'un vexillum",
        cout: 10,
        ajoute: "Vexillum (un Exécuteur)",
      },
      optionBaionnette(),
      // Night Lords Legacy Wargear (night_lords_wargear.pdf), section
      // « Terror Squad ».
      {
        type: "quantite",
        id: "lame-tronconneuse-legacy",
        libelle: "Figurines : Lame tronçonneuse (Legacy, voir Liber Hereticus p.171, à la place de l'épée tronçonneuse)",
        cout: 5,
        parTranche: 1,
        ajoute: "Lame tronçonneuse (Legacy) (à la place de l'épée tronçonneuse)",
      },
    ],
    legion: "VIII",
  },
  {
    id: "escouade-rapaces-nocturnes",
    nom: "Escouade de Rapaces Nocturnes",
    categorie: "Attaque Rapide",
    cout: 150,
    composition: "1 Maître de Chasse, 4 Rapaces Nocturnes",
    effectif: { base: 5, max: 15, cout: 25 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "Night Lords"],
    notes:
      "Les Rapaces Nocturnes sont moins une force d'élite qu'une coterie de meurtriers unis par des préférences et des méthodes de combat communes. Les Rapaces Nocturnes éprouvent une joie mauvaise à survoler le champ de bataille tels des oiseaux de proie en quête de victimes et se délectent de l'effroyable moment de lucidité qui s'empare d'une victime quand elle voit la mort fondre sur elle. Au combat, ils s'ornent de trophées morbides et se parent de la peau écorchée de leurs victimes, pour frapper l'effroi dans leurs adversaires.",
    equipement: [
      "Épée tronçonneuse",
      "Pistolet bolter",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Escouade de Rapaces Nocturnes",
        cout: 0,
        profils: [
          {
            nom: "Rapace Nocturne",
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
            nom: "Maître de Chasse",
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
        regles: [
          "Impact (I)",
          "Peur (1)",
          "Avant-garde (4)",
          "Massif (2)",
          "Frappe en Profondeur",
        ],
        type: "Maître de Chasse : Infanterie (Sergent, Antigrav) · Rapace Nocturne : Infanterie (Antigrav)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "arme-cac",
        libelle: "Toute Figurine : remplacer l'épée tronçonneuse",
        remplace: "Épée tronçonneuse",
        choix: [
          { nom: "— Conserver l'épée tronçonneuse —", cout: 0 },
          {
            nom: "Vouge tronçonneur (à la place de l'épée tronçonneuse)",
            cout: 5,
          },
          ...depuisListes(LISTES_EQUIPEMENT.meleeSergent),
        ],
      },
      // Night Lords Legacy Wargear (night_lords_wargear.pdf), section
      // « Night Raptors ».
      {
        type: "quantite",
        id: "lame-tronconneuse-legacy",
        libelle: "Figurines : Lame tronçonneuse (Legacy, voir Liber Hereticus p.171, à la place de l'épée tronçonneuse)",
        cout: 5,
        parTranche: 1,
        ajoute: "Lame tronçonneuse (Legacy) (à la place de l'épée tronçonneuse)",
      },
      {
        type: "quantite",
        id: "paires-griffes-legacy",
        libelle: "Figurines : paire de griffes Lightning (Legacy, à la place du pistolet bolter et de l'épée tronçonneuse)",
        cout: 10,
        parTranche: 1,
        ajoute: "Paire de griffes Lightning (Legacy) (à la place du pistolet bolter et de l'épée tronçonneuse)",
      },
      {
        type: "quantite",
        id: "lance-flammes-legacy",
        libelle: "Figurines (une par tranche de cinq) : lance-flammes (Legacy, à la place du pistolet bolter)",
        cout: 5,
        parTranche: 5,
        groupe: "special-legacy",
        ajoute: "Lance-flammes (Legacy) (à la place du pistolet bolter)",
      },
      {
        type: "quantite",
        id: "fuseur-legacy",
        libelle: "Figurines (une par tranche de cinq) : fuseur (Legacy, à la place du pistolet bolter)",
        cout: 15,
        parTranche: 5,
        groupe: "special-legacy",
        ajoute: "Fuseur (Legacy) (à la place du pistolet bolter)",
      },
      {
        type: "quantite",
        id: "fusil-plasma-legacy",
        libelle: "Figurines (une par tranche de cinq) : fusil à plasma (Legacy, à la place du pistolet bolter)",
        cout: 10,
        parTranche: 5,
        groupe: "special-legacy",
        ajoute: "Fusil à plasma (Legacy) (à la place du pistolet bolter)",
      },
      {
        type: "quantite",
        id: "pistolet-plasma-legacy",
        libelle: "Figurines (une par tranche de cinq) : pistolet à plasma (Legacy, à la place du pistolet bolter)",
        cout: 5,
        parTranche: 5,
        groupe: "special-legacy",
        ajoute: "Pistolet à plasma (Legacy) (à la place du pistolet bolter)",
      },
      {
        type: "quantite",
        id: "serpentine-volkite-legacy",
        libelle: "Figurines (une par tranche de cinq) : serpentine volkite (Legacy, à la place du pistolet bolter)",
        cout: 5,
        parTranche: 5,
        groupe: "special-legacy",
        ajoute: "Serpentine volkite (Legacy) (à la place du pistolet bolter)",
      },
    ],
    legion: "VIII",
  },
  {
    id: "atramentar-ecorches",
    nom: "Atramentar Écorchés",
    legacy: true,
    categorie: "Assaut Lourd",
    cout: 170,
    composition: "1 Atramentar Trucidor, 4 Atramentar",
    effectif: { base: 5, max: 20, cout: 35 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "Night Lords"],
    notes:
      "Membres de la 1ère Compagnie des Night Lords, les Atramentar Écorchés étaient armés des meilleures armes que possédait la Légion et avaient un talent certain pour l'opportunisme meurtrier. Attendant patiemment le moment propice pour frapper, et se servant souvent de leurs propres frères de Légion comme diversion, ils déferlaient sur l'ennemi, l'abattant à coups sauvages. Une telle force ne pouvait être commandée que par ceux capables d'égaler leur irascibilité et leur venin, canalisant ces guerriers d'ordinaire indisciplinés en une force de frappe parfaitement rodée, capable de terrasser quiconque oserait se dresser devant eux.",
    equipement: ["Combi-bolter", "Arme énergétique"],
    variantes: [
      {
        nom: "Atramentar Écorchés",
        cout: 0,
        profils: [
          {
            nom: "Atramentar",
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
            nom: "Atramentar Trucidor",
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
        regles: [
          "Massif (2)",
          "Avance Implacable",
          "Impact (I)",
          "Avant-garde (3)",
          "Fidélité Jurée",
          "Enveloppé de Meurtre",
          "Frappe en Profondeur",
        ],
        type: "Atramentar Trucidor : Infanterie (Sergent) · Atramentar : Infanterie",
      },
    ],
    options: [
      {
        type: "quantite",
        id: "lance-flammes-lourd",
        libelle: "Figurines (une par tranche de cinq) : lance-flammes lourd (à la place du combi-bolter)",
        cout: 10,
        parTranche: 5,
        groupe: "lourd",
        ajoute: "Lance-flammes lourd (à la place du combi-bolter)",
      },
      {
        type: "quantite",
        id: "autocanon-reaper",
        libelle: "Figurines (une par tranche de cinq) : Autocanon Reaper (à la place du combi-bolter)",
        cout: 15,
        parTranche: 5,
        groupe: "lourd",
        ajoute: "Autocanon Reaper (à la place du combi-bolter)",
      },
      {
        type: "quantite",
        id: "blaster-plasma",
        // « Plasma blaster » : profil d'arme non donné dans l'extrait
        // fourni (pas d'encart WARGEAR sur cette fiche) — à compléter
        // depuis le livre au besoin.
        libelle: "Figurines (une par tranche de cinq) : blaster à plasma (à la place du combi-bolter)",
        cout: 15,
        parTranche: 5,
        groupe: "lourd",
        ajoute: "Blaster à plasma (à la place du combi-bolter)",
      },
      {
        type: "quantite",
        id: "chargeur-volkite",
        libelle: "Figurines : chargeur volkite (à la place du combi-bolter)",
        cout: 0,
        parTranche: 1,
        groupe: "combi",
        ajoute: "Chargeur volkite (à la place du combi-bolter)",
      },
      ...quantiteDepuisListe(LISTES_EQUIPEMENT.combinees, {
        groupe: "combi",
        remplace: "du combi-bolter",
      }),
      // Glaive tronçonneur Nostraman et Hache du Bourreau (ci-dessous) :
      // profils d'arme non donnés dans l'extrait fourni (pas d'encart
      // WARGEAR sur cette fiche) — à compléter depuis le livre au besoin.
      {
        type: "quantite",
        id: "chainglaive-nostraman",
        libelle: "Figurines : Glaive tronçonneur Nostraman (à la place de l'arme énergétique)",
        cout: 0,
        parTranche: 1,
        groupe: "melee",
        ajoute: "Glaive tronçonneur Nostraman (à la place de l'arme énergétique)",
      },
      {
        type: "quantite",
        id: "gantelet-energetique",
        libelle: "Figurines : gantelet énergétique (à la place de l'arme énergétique)",
        cout: 5,
        parTranche: 1,
        groupe: "melee",
        ajoute: "Gantelet énergétique (à la place de l'arme énergétique)",
      },
      {
        type: "quantite",
        id: "griffe-lightning",
        libelle: "Figurines : griffe Lightning (à la place de l'arme énergétique)",
        cout: 5,
        parTranche: 1,
        groupe: "melee",
        ajoute: "Griffe Lightning (à la place de l'arme énergétique)",
      },
      {
        type: "quantite",
        id: "poing-tronconneur",
        libelle: "Figurines : poing tronçonneur (à la place de l'arme énergétique)",
        cout: 10,
        parTranche: 1,
        groupe: "melee",
        ajoute: "Poing tronçonneur (à la place de l'arme énergétique)",
      },
      {
        type: "quantite",
        id: "marteau-thunder",
        libelle: "Figurines : Marteau Thunder (à la place de l'arme énergétique)",
        cout: 10,
        parTranche: 1,
        groupe: "melee",
        ajoute: "Marteau Thunder (à la place de l'arme énergétique)",
      },
      {
        type: "quantite",
        id: "paire-griffes-lightning",
        libelle: "Figurines : paire de griffes Lightning (à la place de l'arme énergétique et du combi-bolter)",
        cout: 15,
        parTranche: 1,
        ajoute: "Paire de griffes Lightning (à la place de l'arme énergétique et du combi-bolter)",
      },
      {
        type: "case",
        id: "hache-bourreau",
        libelle: "Atramentar Trucidor : hache du Bourreau (à la place de l'arme énergétique)",
        cout: 10,
        ajoute: "Atramentar Trucidor : Hache du Bourreau (à la place de l'arme énergétique)",
      },
    ],
    legion: "VIII",
  },

  /* ============================================================
     UNITÉS — LEGIO TITANICUS
     Transcription depuis l'Arsenal des Maisonnées de Chevaliers et
     des Legios Titaniques. Faction distincte de Legio Astartes (champ
     `faction: "legio-titanicus"`, voir MODÈLE DE DONNÉES en tête de
     fichier et uniteAccessible dans js/unites.js) : pour l'instant
     grisée dans le menu « Faction » (js/organigramme.js, FACTIONS),
     ces unités restent donc indisponibles au sélecteur « Unité à
     ajouter » tant que ce menu n'est pas activé.

     Les 4 Titans (Warhound/Reaver/Warbringer Némésis/Warlord)
     utilisent `profilsVehicule` (une ligne par Profil de Titan —
     Tête, Carapace, Bras, Jambes — voir le MODÈLE DE DONNÉES et
     ENTETES_TITAN dans js/unites.js), une forme distincte du profil
     de véhicule standard à une seule ligne.

     Limite connue : l'option [Équipage] (Minoris/Senioris/Majoris)
     augmente la CT des Profils de Bras (et de Carapace au-delà du
     Warhound) contre un supplément de Points — ce supplément est
     bien comptabilisé par l'option, mais la table de profil affichée
     n'actualise pas automatiquement la valeur de CT (elle reste
     celle de l'Équipage Minoris, gratuit) : le libellé de chaque
     choix précise la CT obtenue.
     ---------------------------------------------------------- */
  {
    id: "axiarque-secutarius",
    nom: "Axiarque Secutarius",
    categorie: "État-major",
    cout: 95,
    composition: "1 Axiarque",
    traits: ["[Allégeance]", "Legio Titanicus", "Bouclier"],
    equipement: ["Électrolance", "Bouclier magnéto-inverseur", "Grenades Frag"],
    faction: "legio-titanicus",
    variantes: [
      {
        nom: "Axiarque",
        cout: 0,
        profil: {
          M: 6,
          CC: 5,
          CT: 5,
          F: 4,
          E: 3,
          PV: 3,
          I: 4,
          A: 4,
          Cd: 9,
          Sf: 10,
          Vo: 8,
          Int: 9,
          Sv: "2+",
          Inv: "5+",
        },
        regles: ["Hommes d'Armes de la Legio"],
        type: "Infanterie (État-major)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "electrolance",
        libelle: "Remplacer l'électrolance",
        remplace: "Électrolance",
        choix: [
          { nom: "— Conserver l'électrolance —", cout: 0 },
          { nom: "Épée énergétique", cout: 0 },
          { nom: "Électromasse", cout: 0 },
        ],
      },
      {
        type: "case",
        id: "grenades-rad",
        libelle: "Grenades Rad",
        cout: 10,
        ajoute: "Grenades Rad",
      },
      {
        type: "case",
        id: "cyber-familier",
        libelle: "Cyber-familier",
        cout: 5,
        ajoute: "Cyber-familier",
      },
    ],
  },

  {
    id: "cohorte-secutarii",
    nom: "Cohorte de Secutarii",
    categorie: "Troupes",
    cout: 165,
    composition: "9 Secutarii et 1 Secutarius Alpha",
    effectif: { base: 10, max: 20, cout: 15 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "Legio Titanicus", "Bouclier"],
    equipement: ["Électrolance", "Bouclier magnéto-inverseur", "Grenades Frag"],
    faction: "legio-titanicus",
    variantes: [
      {
        nom: "Cohorte de Secutarii",
        cout: 0,
        profils: [
          {
            nom: "Secutarius",
            profil: {
              M: 6,
              CC: 4,
              CT: 4,
              F: 4,
              E: 3,
              PV: 1,
              I: 3,
              A: 2,
              Cd: 7,
              Sf: 8,
              Vo: 7,
              Int: 8,
              Sv: "4+",
              Inv: "6+",
            },
          },
          {
            nom: "Secutarius Alpha",
            profil: {
              M: 6,
              CC: 4,
              CT: 4,
              F: 4,
              E: 3,
              PV: 1,
              I: 3,
              A: 2,
              Cd: 8,
              Sf: 9,
              Vo: 7,
              Int: 8,
              Sv: "4+",
              Inv: "6+",
            },
          },
        ],
        regles: ["Hommes d'Armes de la Legio"],
        type: "Secutarius Alpha : Infanterie (Sergent) · Secutarius : Infanterie",
      },
    ],
    options: [
      {
        type: "paire",
        id: "lanceur-galvanique",
        libelle:
          "Toute l'Unité : échanger électrolance et bouclier magnéto-inverseur contre un lanceur galvanique (l'Unité perd alors le Trait Bouclier et gagne le Trait Écran de Fumée)",
        cout: 0,
        ajoute: "Lanceur galvanique (toute l'Unité)",
        remplaceListe: ["Électrolance", "Bouclier magnéto-inverseur"],
      },
      {
        type: "case",
        id: "grenades-rad",
        libelle: "Toute l'Unité : grenades Rad",
        cout: 2,
        ajoute: "Grenades Rad",
        parFigurine: true,
      },
      {
        type: "multi",
        id: "secutarius-alpha-equip",
        libelle: "Secutarius Alpha : équipement complémentaire",
        prefixe: "Secutarius Alpha : ",
        max: 4,
        choix: [
          { nom: "Épée énergétique", cout: 0 },
          { nom: "Électromasse", cout: 0 },
          { nom: "Serpentine volkite", cout: 2 },
          { nom: "Électropistolet", cout: 5 },
        ],
      },
    ],
  },

  {
    id: "triaros",
    nom: "Convoyeur Blindé Triaros",
    categorie: "Transports Lourds",
    cout: 200,
    composition: "1 Triaros",
    traits: ["[Allégeance]", "Legio Titanicus"],
    equipement: [
      "Deux arquebuses volkites d'Axe Central",
      "Canon à bolts Mauler jumelé sur Pivot",
      "Bouclier répulsif",
      "Projecteurs",
    ],
    notes: "Cette Figurine a un Point d'Accès sur chaque Flanc.",
    faction: "legio-titanicus",
    variantes: [
      {
        nom: "Triaros",
        cout: 0,
        profilVehicule: {
          M: 10,
          CT: 4,
          avant: 14,
          flanc: 12,
          arriere: 12,
          PC: 7,
          transport: 22,
        },
        regles: ["Autoréparation (4+)", "Bélier-choc"],
        type: "Véhicule (Transport)",
      },
    ],
    options: [
      {
        type: "quantite",
        id: "missiles-traqueurs",
        libelle: "Missiles traqueurs de Coque (Avant)",
        cout: 5,
        max: 2,
        ajoute: "Missile traqueur de Coque (Avant)",
      },
    ],
  },

  {
    id: "titan-warhound",
    nom: "Titan Warhound",
    categorie: "Seigneurs des Batailles",
    cout: 750,
    composition: "1 Titan Warhound",
    traits: [
      "[Allégeance]",
      "Legio Titanicus",
      "Titan Éclaireur",
      "[Équipage]",
    ],
    equipement: [],
    faction: "legio-titanicus",
    variantes: [
      {
        nom: "Titan Warhound",
        cout: 0,
        profilsVehicule: [
          {
            nom: "Tête",
            M: "—",
            CT: "—",
            principal: 14,
            expose: 12,
            PC: 8,
            transport: "—",
          },
          {
            nom: "Carapace",
            M: "—",
            CT: "—",
            principal: 14,
            expose: 12,
            PC: 10,
            transport: "—",
          },
          {
            nom: "Bras",
            M: "—",
            CT: 3,
            ctParEquipage: [3, 4, 5],
            principal: 12,
            expose: 10,
            PC: 8,
            transport: "—",
          },
          {
            nom: "Jambes",
            M: 20,
            CT: "—",
            principal: 14,
            expose: 12,
            PC: 10,
            transport: "—",
          },
        ],
        regles: [
          "Cor Titanique (1)",
          "Réparateurs (D3)",
          "Boucliers Void Titaniques (2)",
        ],
        type: "Véhicule (Titan)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "equipage",
        libelle: "Remplacer le Trait [Équipage]",
        ajoute: true,
        obligatoire: true,
        choix: [
          { nom: "Équipage Minoris", cout: 0 },
          { nom: "Équipage Senioris (CT 4 au Profil de Bras)", cout: 50 },
          { nom: "Équipage Majoris (CT 5 au Profil de Bras)", cout: 100 },
        ],
      },
      {
        type: "choix",
        id: "bras-1",
        libelle: "Arme de Bras (1)",
        ajoute: true,
        obligatoire: true,
        choix: [
          { nom: "Méga-bolter Vulcan de Bras", cout: 0 },
          { nom: "Canon Inferno titanique de Bras", cout: 0 },
          { nom: "Éclateur à plasma titanique de Bras", cout: 0 },
          { nom: "Destructeur turbo-laser titanique de Bras", cout: 0 },
        ],
      },
      {
        type: "choix",
        id: "bras-2",
        libelle: "Arme de Bras (2)",
        ajoute: true,
        obligatoire: true,
        choix: [
          { nom: "Méga-bolter Vulcan de Bras", cout: 0 },
          { nom: "Canon Inferno titanique de Bras", cout: 0 },
          { nom: "Éclateur à plasma titanique de Bras", cout: 0 },
          { nom: "Destructeur turbo-laser titanique de Bras", cout: 0 },
        ],
      },
    ],
  },

  {
    id: "titan-reaver",
    nom: "Titan Reaver",
    categorie: "Seigneurs des Batailles",
    cout: 1500,
    composition: "1 Titan Reaver",
    traits: ["[Allégeance]", "Legio Titanicus", "Titan Léger", "[Équipage]"],
    equipement: ["Lance-missiles Apocalypse de Carapace"],
    faction: "legio-titanicus",
    variantes: [
      {
        nom: "Titan Reaver",
        cout: 0,
        profilsVehicule: [
          {
            nom: "Tête",
            M: "—",
            CT: "—",
            principal: 14,
            expose: 12,
            PC: 10,
            transport: "—",
          },
          {
            nom: "Carapace",
            M: "—",
            CT: 3,
            ctParEquipage: [3, 4, 5],
            principal: 15,
            expose: 14,
            PC: 12,
            transport: "—",
          },
          {
            nom: "Bras",
            M: "—",
            CT: 3,
            ctParEquipage: [3, 4, 5],
            principal: 14,
            expose: 12,
            PC: 10,
            transport: "—",
          },
          {
            nom: "Jambes",
            M: 15,
            CT: "—",
            principal: 15,
            expose: 14,
            PC: 12,
            transport: "—",
          },
        ],
        regles: [
          "Cor Titanique (2)",
          "Réparateurs (D3+1)",
          "Boucliers Void Titaniques (4)",
          "Structure Renforcée (1)",
        ],
        type: "Véhicule (Titan)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "equipage",
        libelle: "Remplacer le Trait [Équipage]",
        ajoute: true,
        obligatoire: true,
        choix: [
          { nom: "Équipage Minoris", cout: 0 },
          {
            nom: "Équipage Senioris (CT 4 aux Profils de Bras et de Carapace)",
            cout: 100,
          },
          {
            nom: "Équipage Majoris (CT 5 aux Profils de Bras et de Carapace)",
            cout: 200,
          },
        ],
      },
      {
        type: "choix",
        id: "bras-1",
        libelle: "Arme de Bras (1)",
        ajoute: true,
        obligatoire: true,
        choix: [
          { nom: "Éclateur gatling titanique de Bras", cout: 0 },
          { nom: "Éclateur laser titanique de Bras", cout: 0 },
          { nom: "Canon à fusion titanique de Bras", cout: 0 },
          { nom: "Poing énergétique titanique de Bras", cout: 0 },
          { nom: "Canon Volcano titanique de Bras", cout: 0 },
        ],
      },
      {
        type: "choix",
        id: "bras-2",
        libelle: "Arme de Bras (2)",
        ajoute: true,
        obligatoire: true,
        choix: [
          { nom: "Éclateur gatling titanique de Bras", cout: 0 },
          { nom: "Éclateur laser titanique de Bras", cout: 0 },
          { nom: "Canon à fusion titanique de Bras", cout: 0 },
          { nom: "Poing énergétique titanique de Bras", cout: 0 },
          { nom: "Canon Volcano titanique de Bras", cout: 0 },
        ],
      },
    ],
  },

  {
    id: "titan-warbringer-nemesis",
    nom: "Titan Warbringer Némésis",
    categorie: "Seigneurs des Batailles",
    cout: 2000,
    composition: "1 Titan Warbringer Némésis",
    traits: ["[Allégeance]", "Legio Titanicus", "Titan Moyen", "[Équipage]"],
    equipement: [
      "Deux autocanons Defensor (Carapace)",
      "Deux canons à bolts Defensor (Avant)",
      "Un canon à bolts Defensor (Arrière)",
    ],
    faction: "legio-titanicus",
    variantes: [
      {
        nom: "Titan Warbringer Némésis",
        cout: 0,
        profilsVehicule: [
          {
            nom: "Tête",
            M: "—",
            CT: "—",
            principal: 14,
            expose: 12,
            PC: 12,
            transport: "—",
          },
          {
            nom: "Carapace",
            M: "—",
            CT: 3,
            ctParEquipage: [3, 4, 5],
            principal: 16,
            expose: 14,
            PC: 18,
            transport: "—",
          },
          {
            nom: "Bras",
            M: "—",
            CT: 3,
            ctParEquipage: [3, 4, 5],
            principal: 14,
            expose: 12,
            PC: 12,
            transport: "—",
          },
          {
            nom: "Jambes",
            M: 10,
            CT: "—",
            principal: 15,
            expose: 14,
            PC: 14,
            transport: "—",
          },
        ],
        regles: [
          "Cor Titanique (3)",
          "Réparateurs (D6)",
          "Boucliers Void Titaniques (6)",
          "Structure Renforcée (2)",
        ],
        type: "Véhicule (Titan)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "equipage",
        libelle: "Remplacer le Trait [Équipage]",
        ajoute: true,
        obligatoire: true,
        choix: [
          { nom: "Équipage Minoris", cout: 0 },
          {
            nom: "Équipage Senioris (CT 4 aux Profils de Bras et de Carapace)",
            cout: 200,
          },
          {
            nom: "Équipage Majoris (CT 5 aux Profils de Bras et de Carapace)",
            cout: 350,
          },
        ],
      },
      {
        type: "choix",
        id: "axe-median",
        libelle: "Arme d'Axe Médian",
        ajoute: true,
        obligatoire: true,
        choix: [
          { nom: "Canon sismique Némésis d'Axe Médian", cout: 0 },
          { nom: "Canon Volcano Némésis d'Axe Médian", cout: 0 },
        ],
      },
      {
        type: "choix",
        id: "bras-1",
        libelle: "Arme de Bras (1)",
        ajoute: true,
        obligatoire: true,
        choix: [
          { nom: "Éclateur gatling titanique de Bras", cout: 0 },
          { nom: "Éclateur laser titanique de Bras", cout: 0 },
          { nom: "Canon Volcano titanique de Bras", cout: 0 },
          { nom: "Canon à fusion titanique de Bras", cout: 0 },
        ],
      },
      {
        type: "choix",
        id: "bras-2",
        libelle: "Arme de Bras (2)",
        ajoute: true,
        obligatoire: true,
        choix: [
          { nom: "Éclateur gatling titanique de Bras", cout: 0 },
          { nom: "Éclateur laser titanique de Bras", cout: 0 },
          { nom: "Canon Volcano titanique de Bras", cout: 0 },
          { nom: "Canon à fusion titanique de Bras", cout: 0 },
        ],
      },
    ],
  },

  {
    id: "titan-warlord",
    nom: "Titan Warlord",
    categorie: "Seigneurs des Batailles",
    cout: 3000,
    composition: "1 Titan Warlord",
    traits: ["[Allégeance]", "Legio Titanicus", "Titan Moyen", "[Équipage]"],
    equipement: [
      "Deux canons à bolts Defensor (Avant)",
      "Deux canons laser Defensor (Arrière)",
    ],
    faction: "legio-titanicus",
    variantes: [
      {
        nom: "Titan Warlord",
        cout: 0,
        profilsVehicule: [
          {
            nom: "Tête",
            M: "—",
            CT: "—",
            principal: 14,
            expose: 12,
            PC: 14,
            transport: "—",
          },
          {
            nom: "Carapace",
            M: "—",
            CT: 3,
            ctParEquipage: [3, 4, 5],
            principal: 15,
            expose: 14,
            PC: 18,
            transport: "—",
          },
          {
            nom: "Bras",
            M: "—",
            CT: 3,
            ctParEquipage: [3, 4, 5],
            principal: 14,
            expose: 12,
            PC: 14,
            transport: "—",
          },
          {
            nom: "Jambes",
            M: 12,
            CT: "—",
            principal: 15,
            expose: 14,
            PC: 16,
            transport: "—",
          },
        ],
        regles: [
          "Cor Titanique (4)",
          "Réparateurs (D6+1)",
          "Boucliers Void Titaniques (8)",
          "Structure Renforcée (3)",
        ],
        type: "Véhicule (Titan)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "equipage",
        libelle: "Remplacer le Trait [Équipage]",
        ajoute: true,
        obligatoire: true,
        choix: [
          { nom: "Équipage Minoris", cout: 0 },
          {
            nom: "Équipage Senioris (CT 4 aux Profils de Bras et de Carapace)",
            cout: 300,
          },
          {
            nom: "Équipage Majoris (CT 5 aux Profils de Bras et de Carapace)",
            cout: 500,
          },
        ],
      },
      {
        type: "choix",
        id: "carapace",
        libelle: "Armes de Carapace",
        ajoute: true,
        obligatoire: true,
        choix: [
          { nom: "Deux lance-missiles Apocalypse de Carapace", cout: 0 },
          { nom: "Deux éclateurs laser titaniques de Carapace", cout: 0 },
        ],
      },
      {
        type: "choix",
        id: "bras-1",
        libelle: "Arme de Bras (1)",
        ajoute: true,
        obligatoire: true,
        // Verrouillée par le combo Griffe énergétique Arioch/Méga-
        // bolter Vulcan (option "bras-arioch-combo" ci-dessous), qui
        // occupe à lui seul les deux emplacements d'Arme de Bras.
        desactiveSiOptionActive: "bras-arioch-combo",
        choix: [
          { nom: "Canon sismique Mori de Bras", cout: 0 },
          { nom: "Canon Volcano Belicosa de Bras", cout: 0 },
          { nom: "Macro-éclateur gatling de Bras", cout: 0 },
          { nom: "Annihilateur à plasma Sunfury de Bras", cout: 0 },
        ],
      },
      {
        type: "choix",
        id: "bras-2",
        libelle: "Arme de Bras (2)",
        ajoute: true,
        obligatoire: true,
        desactiveSiOptionActive: "bras-arioch-combo",
        choix: [
          { nom: "Canon sismique Mori de Bras", cout: 0 },
          { nom: "Canon Volcano Belicosa de Bras", cout: 0 },
          { nom: "Macro-éclateur gatling de Bras", cout: 0 },
          { nom: "Annihilateur à plasma Sunfury de Bras", cout: 0 },
        ],
      },
      {
        // Chargement combiné occupant à lui seul les deux emplacements
        // d'Arme de Bras (« ces deux Armes comptent comme un seul
        // choix ») : verrouille bras-1 et bras-2 (desactiveSiOptionActive
        // ci-dessus) tant qu'il est coché, au lieu d'un simple rappel
        // textuel — contrainte appliquée, pas seulement documentée.
        type: "case",
        id: "bras-arioch-combo",
        libelle:
          "Les deux Armes de Bras : Griffe énergétique Arioch avec un Méga-bolter Vulcan (remplace les deux choix d'Arme de Bras ci-dessus)",
        cout: 0,
        ajoute:
          "Griffe énergétique Arioch de Bras avec un Méga-bolter Vulcan de Bras (les deux Bras)",
      },
    ],
  },

  /* ============================================================
     UNITÉS — CHEVALIERS QUESTORIS
     Transcription depuis l'Arsenal des Maisonnées de Chevaliers.
     Faction distincte de Legio Astartes (champ `faction:
     "chevaliers-questoris"`, voir MODÈLE DE DONNÉES en tête de fichier
     et uniteAccessible dans js/unites.js). Aucune Maisonnée (Questoris
     Imperialis/Mechanicum/Mendicus, voir SKINS_MAISONNEE dans
     js/organigramme.js) n'est précisée sur ces unités : comme
     [Legiones Astartes] pour un Dreadnought Contemptor, le Trait
     [Questoris Familia] est un générique valable pour les trois.

     Les 9 Chevaliers (catégorie "Seigneurs des Batailles", placés via
     le Détachement de Seigneur des Batailles — factionLibre, voir
     organigramme-data.js) utilisent `profilChevalier` (M/CC/CT/F +
     Blindage Avant/Arrière + I/A/PC, voir ENTETES_CHEVALIER et
     construireTableProfil dans js/unites.js, ainsi que la règle du
     Sous-type Chevalier sur pages/vehicule.html#sous-types). Les 3
     Armigères (catégorie "Engins de Guerre", Détachement Auxiliaire
     Appui Lourd — rendu factionLibre pour l'occasion) sont de Type
     Marcheur, avec un profil de Figurine standard comme un Dreadnought.

     Limite connue : les caractéristiques de Tir/Mêlée de la plupart
     des armes listées ici (Affût à conversion Desolator, Mortier
     Karacnos, Découpeur de phase Atrapos, Canon Infernus d'Achéron,
     Pince de siège Hekaton…) ne sont pas encore transcrites dans
     l'Arsenal (js/armes-data.js) : elles apparaissent donc dans
     l'Équipement de la fiche, mais sans table de caractéristiques
     (voir trouverArmeDansTexte dans js/unites.js — une arme absente de
     l'Arsenal n'apparaît simplement dans aucune table).
     ---------------------------------------------------------- */
  {
    id: "chevalier-acastus-asterius",
    nom: "Chevalier Acastus Astérius",
    categorie: "Seigneurs des Batailles",
    cout: 750,
    composition: "1 Chevalier Astérius",
    traits: ["[Allégeance]", "[Questoris Familia]"],
    equipement: [
      "Affût à conversion Desolator de Coque (Avant)",
      "Mortier Karacnos Dorsal (Avant)",
      "Deux couleuvrines volkites de Coque (Avant)",
      "Bouclier répulsif ionique",
    ],
    faction: "chevaliers-questoris",
    notes:
      "Le Chevalier Astérius compte parmi les engins de destruction les plus formidables et massifs dont disposent les Maisons, doté d'un armement à conversion lourd pouvant réduire en poussière les plus grands édifices, et même menacer les titans. Les systèmes d'armes secondaires du Chevalier Astérius sont eux aussi redoutables : un mortier Karacnos monté sur sa carapace, capable d'anéantir des phalanges entières de troupes en formation, tout comme les couleuvrines volkites de son torse. Seuls les plus forts d'esprit osent essayer de contrôler le feu rageur qui agite l'esprit de la machine d'un Chevalier Astérius et ne tarde pas à les gagner.",
    variantes: [
      {
        nom: "Chevalier Astérius",
        cout: 0,
        profilChevalier: {
          M: 10,
          CC: 3,
          CT: 4,
          F: 10,
          avant: 14,
          arriere: 11,
          I: 2,
          A: 3,
          PC: 18,
        },
        regles: [
          "Autoréparation (4+)",
          "Colosse",
          "Explose (4+)",
          "Tir Indépendant",
        ],
        type: "Véhicule (Chevalier, Lourd)",
      },
    ],
    options: [],
  },

  {
    id: "chevalier-acastus-porphyrion",
    nom: "Chevalier Acastus Porphyrion",
    categorie: "Seigneurs des Batailles",
    cout: 725,
    composition: "1 Chevalier Porphyrion",
    traits: ["[Allégeance]", "[Questoris Familia]"],
    equipement: [
      "Batterie à onde neutronique de Coque (Avant)",
      "Batterie lance-missiles Ironstorm Dorsale (Avant)",
      "Deux autocanons de Coque (Avant)",
      "Bouclier ionique",
    ],
    faction: "chevaliers-questoris",
    notes:
      "Même au pic de la Grande Croisade, peu de Maisonnées étaient en mesure de mobiliser en service les harnois Acastus les plus lourdement équipés et protégés, l'un des châssis les plus imposants avec lesquels un humain seul pouvait entrer en interface. La variante Porphyrion en particulier servit souvent d'assurance suprême de l'autorité d'une Maisonnée sur ses descendants, même si pour certaines, son poids et son arsenal purement dédié au tir (malgré sa magnitude) étaient des inconvénients qu'on ne pouvait ignorer. D'autres soulignèrent que la taille et la puissance du Porphyrion, rivalisant avec celles d'un titan éclaireur, repoussaient les limites de ce qu'on pouvait raisonnablement confier à une Maisonnée.",
    variantes: [
      {
        nom: "Chevalier Porphyrion",
        cout: 0,
        profilChevalier: {
          M: 10,
          CC: 3,
          CT: 4,
          F: 10,
          avant: 14,
          arriere: 11,
          I: 2,
          A: 3,
          PC: 18,
        },
        regles: [
          "Autoréparation (5+)",
          "Colosse",
          "Explose (5+)",
          "Tir Indépendant",
        ],
        type: "Véhicule (Chevalier, Lourd)",
      },
    ],
    options: [
      {
        type: "paire",
        id: "autocanons-laser",
        libelle:
          "Remplacer les deux autocanons de Coque (Avant) par deux canons laser de Coque (Avant)",
        cout: 10,
        remplaceListe: ["Deux autocanons de Coque (Avant)"],
        ajoute: "Deux canons laser de Coque (Avant)",
      },
      {
        type: "choix",
        id: "dorsale-porphyrion",
        libelle: "Batterie lance-missiles Ironstorm Dorsale (Avant)",
        remplace: "Batterie lance-missiles Ironstorm Dorsale (Avant)",
        choix: [
          {
            nom: "— Batterie lance-missiles Ironstorm Dorsale (Avant) (gratuit) —",
            cout: 0,
          },
          { nom: "Lance-missiles Hyperios Dorsal (Avant)", cout: 10 },
        ],
      },
    ],
  },

  {
    id: "chevalier-cerastus-atrapos",
    nom: "Chevalier Cerastus Atrapos",
    categorie: "Seigneurs des Batailles",
    cout: 600,
    composition: "1 Chevalier Atrapos",
    traits: ["[Allégeance]", "[Questoris Familia]"],
    equipement: [
      "Canon à singularité graviton de Coque (Avant)",
      "Découpeur de phase Atrapos de Coque (Avant)",
      "Bouclier répulsif ionique",
    ],
    faction: "chevaliers-questoris",
    notes:
      "C'est un honneur rare pour une Maisonnée que de compter dans ses rangs un Chevalier Atrapos, un modèle Cerastus de provenance ancienne et d'une puissance ahurissante, qu'il s'agisse d'une relique récupérée des cryptes d'un ennemi vaincu ou d'un don exceptionnel fait par un monde-forge. Lors des guerres catalysmiques de l'Hérésie d'Horus, il fut courant que des harnois Atrapos soient employés contre des Chevaliers ennemis, ou pour aller exécuter des descendants dévoyés de leur Maison, l'appétit de destruction de leur esprit de la machine n'étant rassasié qu'en apportant la ruine à des adversaires aussi prééminents.",
    variantes: [
      {
        nom: "Chevalier Atrapos",
        cout: 0,
        profilChevalier: {
          M: 14,
          CC: 4,
          CT: 4,
          F: 9,
          avant: 13,
          arriere: 11,
          I: 4,
          A: 4,
          PC: 12,
        },
        regles: ["Autoréparation (4+)", "Explose (5+)", "Avant-garde (2)"],
        type: "Véhicule (Chevalier)",
      },
    ],
    options: [],
  },

  {
    id: "chevalier-cerastus-lancier",
    nom: "Chevalier Cerastus Lancier",
    categorie: "Seigneurs des Batailles",
    cout: 480,
    composition: "1 Chevalier Lancier",
    traits: ["[Allégeance]", "[Questoris Familia]"],
    equipement: [
      "Lance-choc de Coque (Avant)",
      "Gantelet-bouclier ionique",
      "Bouclier ionique",
    ],
    faction: "chevaliers-questoris",
    notes:
      "Le Lancier est le plus célèbre des harnois de Chevalier type Cerastus, un châssis hautement sophistiqué, qui surpasse de loin en célérité la classe Questoris plus pesante. Les Chevaliers Cerastus semblent n'avoir été conçus que pour la guerre, non comme protecteurs, mais comme des conquérants et des outils de destruction, marque de la violence qui imprégna les prémices de l'Ère des Luttes. Le Lancier est tenu en haute estime par les preux les plus impétueux des Maisons, son puissant gantelet-bouclier ionique et sa lance-choc étant parfaitement adaptés à affronter l'ennemi face à face, là où un seul coup ajusté sépare le pilote de sa mort.",
    variantes: [
      {
        nom: "Chevalier Lancier",
        cout: 0,
        profilChevalier: {
          M: 14,
          CC: 4,
          CT: 4,
          F: 9,
          avant: 13,
          arriere: 11,
          I: 4,
          A: 4,
          PC: 12,
        },
        regles: ["Autoréparation (5+)", "Explose (6+)", "Avant-garde (2)"],
        type: "Véhicule (Chevalier)",
      },
    ],
    options: [],
  },

  {
    id: "chevalier-cerastus-acheron",
    nom: "Chevalier Cerastus Achéron",
    categorie: "Seigneurs des Batailles",
    cout: 500,
    composition: "1 Chevalier Achéron",
    traits: ["[Allégeance]", "[Questoris Familia]"],
    equipement: [
      "Canon Infernus d'Achéron de Coque (Avant)",
      "Bolter lourd jumelé de Coque (Avant)",
      "Poing tronçonneur Reaper",
      "Bouclier ionique",
    ],
    faction: "chevaliers-questoris",
    notes:
      "Le Chevalier Cerastus Achéron est une vision inquiétante, un faucheur de vies soigneusement conçu pour non seulement détruire mais inspirer la terreur. Sa présence avertit l'ennemi qu'aucun quartier ne lui sera fait, car de telles armes ne sont déployées qu'en mission d'extermination, pour renverser ses ouvrages et passer ses terres à la flamme. Les rares pilotes ayant goût à ces montures lugubres sont des guerriers à la volonté de fer, sachant réprimer les murmures sinistres de leur esprit de la machine, ou des âmes torturées, appréciant les pulsions malveillantes de ce harnois et le carnage qu'il sème sur le champ de bataille.",
    variantes: [
      {
        nom: "Chevalier Achéron",
        cout: 0,
        profilChevalier: {
          M: 14,
          CC: 4,
          CT: 4,
          F: 9,
          avant: 13,
          arriere: 11,
          I: 4,
          A: 4,
          PC: 12,
        },
        regles: ["Autoréparation (5+)", "Explose (4+)", "Avant-garde (2)"],
        type: "Véhicule (Chevalier)",
      },
    ],
    options: [],
  },

  {
    id: "chevalier-cerastus-castigateur",
    nom: "Chevalier Cerastus Castigateur",
    categorie: "Seigneurs des Batailles",
    cout: 480,
    composition: "1 Chevalier Castigateur",
    traits: ["[Allégeance]", "[Questoris Familia]"],
    equipement: [
      "Canon à bolts de Castigateur jumelé de Coque (Avant)",
      "Lame de guerre Tempest",
      "Bouclier ionique",
    ],
    faction: "chevaliers-questoris",
    notes:
      "Armé du redoutable canon à bolts éponyme, le Chevalier Cerastus Castigateur est employé par les Maisonnées face aux hordes d'adversaires infimes qui pourraient submerger même un puissant Chevalier par leur seul nombre. C'est un formidable combattant, capable d'anéantir les formations d'infanterie sous une pluie grondante de projectiles à masse réactive, et d'équarrir avec aisance les véhicules légers à coups de lame énergétique. Parmi ses semblables, le Castigateur est aussi renommé pour la nature sévère des esprits de la machine qui l'habitent, dont la vigueur est délicate à éveiller, mais presque impossible à arrêter.",
    variantes: [
      {
        nom: "Chevalier Castigateur",
        cout: 0,
        profilChevalier: {
          M: 14,
          CC: 4,
          CT: 4,
          F: 9,
          avant: 13,
          arriere: 11,
          I: 4,
          A: 4,
          PC: 12,
        },
        regles: ["Autoréparation (5+)", "Explose (6+)", "Avant-garde (2)"],
        type: "Véhicule (Chevalier)",
      },
    ],
    options: [],
  },

  {
    id: "chevalier-questoris-styrix",
    nom: "Chevalier Questoris Styrix",
    categorie: "Seigneurs des Batailles",
    cout: 455,
    composition: "1 Chevalier Styrix",
    traits: ["[Allégeance]", "[Questoris Familia]"],
    equipement: [
      "Chieorovile volkite de Coque (Avant)",
      "Fusil à gravitons de Coque (Avant)",
      "Radioactiveur de Coque (Avant)",
      "Pince de siège Hekaton",
      "Bouclier répulsif ionique",
    ],
    faction: "chevaliers-questoris",
    notes:
      "Associé aux pires massacres de l'Ère des Luttes et de la Grande Croisade qui suivit, le Styrix flétrit la réputation de tout pilote qui se lie à lui. Au combat, son chieorovile volkite réduit en cendre des pans entiers d'infanterie, et sa pince de siège Hekaton éventre bunkers et véhicules pour exposer encore d'autres victimes que son fusil à gravitons pulvérisera ou que son radioactiveur fera bouillir vives. Cette efficacité macabre dans le massacre à grande échelle des troupes au sol est considérée par certains comme déshonorante pour un vrai chevalier, mais bon nombre de Maisonnées Questoris n'ont pas de tels scrupules.",
    variantes: [
      {
        nom: "Chevalier Styrix",
        cout: 0,
        profilChevalier: {
          M: 10,
          CC: 4,
          CT: 4,
          F: 8,
          avant: 13,
          arriere: 11,
          I: 3,
          A: 4,
          PC: 10,
        },
        regles: ["Autoréparation (4+)", "Explose (5+)", "Avant-garde (2)"],
        type: "Véhicule (Chevalier)",
      },
    ],
    options: [],
  },

  {
    id: "chevalier-questoris-magaera",
    nom: "Chevalier Questoris Magaera",
    categorie: "Seigneurs des Batailles",
    cout: 460,
    composition: "1 Chevalier Magaera",
    traits: ["[Allégeance]", "[Questoris Familia]"],
    equipement: [
      "Canon à foudre de Coque (Avant)",
      "Fusil à plasma phasé de Coque (Avant)",
      "Radioactiveur de Coque (Avant)",
      "Pince de siège Hekaton",
      "Bouclier répulsif ionique",
    ],
    faction: "chevaliers-questoris",
    notes:
      "Le Chevalier Magaera est une merveille technologique rarement vue au-dehors des Maisons vassales du Mechanicum, lequel protège jalousement les secrets de sa création. Armé d'un canon à foudre pulvérisant aussi bien l'infanterie lourde que les véhicules, et d'une griffe de siège pouvant éventrer les fortifications les plus épaisses, le Chevalier Magaera est souvent placé à l'avant des assauts que livrent les Maisonnées. Toutefois, à cause des niveaux excessifs d'irradiation suintant du noyau du réacteur, et du risque d'explosions internes catastrophiques en cas de dégâts lourds, en piloter un est motif de réjouissance autant que d'inquiétude.",
    variantes: [
      {
        nom: "Chevalier Magaera",
        cout: 0,
        profilChevalier: {
          M: 10,
          CC: 4,
          CT: 4,
          F: 8,
          avant: 13,
          arriere: 11,
          I: 3,
          A: 4,
          PC: 10,
        },
        regles: ["Autoréparation (4+)", "Explose (5+)", "Avant-garde (2)"],
        type: "Véhicule (Chevalier)",
      },
    ],
    options: [],
  },

  /* Chevalier Questoris (harnois de base) : deux emplacements d'arme
     obligatoires ("armement-1"/"armement-2", même liste de choix) en
     plus de la mitrailleuse de Coque (Avant, elle-même remplaçable) et
     d'une monture Dorsale facultative — transcrit sur le modèle du
     Dreadnought Contemptor (bras-1/bras-2, voir plus haut), faute d'un
     autre précédent d'« au moins deux choix dans la même liste, doublons
     autorisés » dans ce fichier (voir le MODÈLE DE DONNÉES, type
     "choix"). Le livre ne numérote pas ces deux emplacements : les noms
     d'équipement ci-dessous ajoutent « (Armement 1/2) » uniquement pour
     les distinguer sur la fiche, sans changer leur effet de jeu. */
  {
    id: "chevalier-questoris",
    nom: "Chevalier Questoris",
    categorie: "Seigneurs des Batailles",
    cout: 400,
    composition: "1 Chevalier Questoris",
    traits: ["[Allégeance]", "[Questoris Familia]"],
    equipement: [
      "Mitrailleuse de Coque (Avant)",
      "Bouclier ionique",
      "Tronçonneuse Reaper (Armement 1)",
      "Tronçonneuse Reaper (Armement 2)",
    ],
    faction: "chevaliers-questoris",
    notes:
      "Le Chevalier Questoris était le harnois le plus courant dans l'Imperium du temps où l'Hérésie d'Horus éclata. Sa popularité parmi les nobles descendants des Maisonnées Questoris était telle que le modèle fut reconfiguré avec diverses options d'armes et d'améliorations de coque, d'une myriade de façons, baptisées de noms tels que Paladin, Errant, Vigilant, Galant et Croisé selon les traditions, les lignées et leurs styles de combat. Guère différents des engins antiques emportés vers les astres par les premiers colons de la Longue Marche, les Chevaliers Questoris sont l'incarnation même de l'héritage des Maisonnées de Chevaliers.",
    variantes: [
      {
        nom: "Chevalier Questoris",
        cout: 0,
        profilChevalier: {
          M: 12,
          CC: 4,
          CT: 4,
          F: 8,
          avant: 13,
          arriere: 11,
          I: 4,
          A: 4,
          PC: 10,
        },
        regles: ["Autoréparation (5+)", "Explose (6+)", "Avant-garde (2)"],
        type: "Véhicule (Chevalier)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "mitrailleuse",
        libelle: "Mitrailleuse de Coque (Avant)",
        remplace: "Mitrailleuse de Coque (Avant)",
        choix: [
          { nom: "— Mitrailleuse de Coque (Avant) (gratuit) —", cout: 0 },
          { nom: "Multi-laser de Coque (Avant)", cout: 5 },
          { nom: "Fuseur de Coque (Avant)", cout: 10 },
        ],
      },
      {
        type: "choix",
        id: "armement-1",
        libelle: "Armement 1",
        remplace: "Tronçonneuse Reaper (Armement 1)",
        choix: [
          { nom: "— Tronçonneuse Reaper (Armement 1) (gratuit) —", cout: 0 },
          { nom: "Gantelet Thunderstrike (Armement 1)", cout: 10 },
          { nom: "Impulseur laser de Coque (Avant) (Armement 1)", cout: 15 },
          {
            nom: "Obusier à tir rapide de Coque (Avant) et mitrailleuse Coaxiale (Armement 1)",
            cout: 5,
          },
          {
            nom: "Canon gatling Avenger de Coque (Avant) et lance-flammes lourd Coaxial (Armement 1)",
            cout: 10,
          },
          { nom: "Canon thermique de Coque (Avant) (Armement 1)", cout: 20 },
        ],
      },
      {
        type: "choix",
        id: "armement-2",
        libelle: "Armement 2",
        remplace: "Tronçonneuse Reaper (Armement 2)",
        choix: [
          { nom: "— Tronçonneuse Reaper (Armement 2) (gratuit) —", cout: 0 },
          { nom: "Gantelet Thunderstrike (Armement 2)", cout: 10 },
          { nom: "Impulseur laser de Coque (Avant) (Armement 2)", cout: 15 },
          {
            nom: "Obusier à tir rapide de Coque (Avant) et mitrailleuse Coaxiale (Armement 2)",
            cout: 5,
          },
          {
            nom: "Canon gatling Avenger de Coque (Avant) et lance-flammes lourd Coaxial (Armement 2)",
            cout: 10,
          },
          { nom: "Canon thermique de Coque (Avant) (Armement 2)", cout: 20 },
        ],
      },
      {
        type: "choix",
        id: "monture-dorsale",
        libelle: "Monture Dorsale (facultative)",
        ajoute: true,
        choix: [
          { nom: "— Aucune monture Dorsale —", cout: 0 },
          { nom: "Autocanon Icarus jumelé Dorsal (Avant, Arrière)", cout: 20 },
          {
            nom: "Nacelle lance-missiles Ironstorm Dorsale (Avant, Arrière)",
            cout: 15,
          },
          {
            nom: "Nacelle lance-roquettes Stormspear Dorsale (Avant, Arrière)",
            cout: 10,
          },
        ],
      },
    ],
  },

  /* Armigères : homologues plus agiles et plus légers du Chevalier
     Questoris, catégorie "Engins de Guerre" (Détachement Auxiliaire
     Appui Lourd, factionLibre — voir organigramme-data.js) et Type
     Marcheur, comme un Dreadnought (profil de Figurine standard). */
  {
    id: "armigere-moirax",
    nom: "Armigère Moirax",
    categorie: "Engins de Guerre",
    cout: 165,
    composition: "1 Armigère Moirax",
    traits: ["[Allégeance]", "[Questoris Familia]"],
    equipement: ["Fourneau Rad"],
    faction: "chevaliers-questoris",
    notes:
      "La variante d'Armigère dite Moirax, peu employée avant les heures les plus sombres de l'Hérésie d'Horus, fut le plus fréquemment envoyée au combat par les Maisonnées endenturées au Mechanicum. Le fourneau Rad au cœur de la machine, et les fuites de réacteur et dysfonctionnements ambariques critiques qui en résultaient, menaient très souvent à la contamination de l'esprit de la machine et du pilote, souvent considéré inférieur et sacrifiable par son seigneur. Bien que toute autre faveur leur fût assurée, ces pilotes se voyaient exclus d'une place à la Cour Questoris et du droit de perpétuer leur lignée.",
    variantes: [
      {
        nom: "Armigère Moirax",
        cout: 0,
        profil: {
          M: 8,
          CC: 4,
          CT: 4,
          F: 7,
          E: 7,
          PV: 7,
          I: 3,
          A: 3,
          Cd: 12,
          Sf: 10,
          Vo: 5,
          Int: 5,
          Sv: "3+",
          Inv: "5+",
        },
        regles: [
          "Massif (8)",
          "Explose (5+)",
          "Avance Implacable",
          "Mouvement à Couvert",
        ],
        type: "Marcheur",
      },
    ],
    options: [
      {
        type: "choix",
        id: "armement-1",
        libelle: "Armement 1",
        ajoute: true,
        obligatoire: true,
        desactiveSiOptionActive: "paire-gyges",
        choix: [
          { nom: "Pince de siège Gyges et irradieur (Armement 1)", cout: 0 },
          { nom: "Veuglaire volkite (Armement 1)", cout: 0 },
          { nom: "Mousquet à foudre (Armement 1)", cout: 5 },
          { nom: "Pulsar à gravitons (Armement 1)", cout: 15 },
          { nom: "Faisceau de conversion Moirax (Armement 1)", cout: 20 },
        ],
      },
      {
        type: "choix",
        id: "armement-2",
        libelle: "Armement 2",
        ajoute: true,
        obligatoire: true,
        desactiveSiOptionActive: "paire-gyges",
        choix: [
          { nom: "Pince de siège Gyges et irradieur (Armement 2)", cout: 0 },
          { nom: "Veuglaire volkite (Armement 2)", cout: 0 },
          { nom: "Mousquet à foudre (Armement 2)", cout: 5 },
          { nom: "Pulsar à gravitons (Armement 2)", cout: 15 },
          { nom: "Faisceau de conversion Moirax (Armement 2)", cout: 20 },
        ],
      },
      {
        // Alternative aux deux choix d'Armement ci-dessus (« on doit
        // sélectionner une des options suivantes » : soit Armement 1 +
        // Armement 2, soit cette Paire) : les verrouille tant qu'elle
        // est cochée, sur le modèle de bras-arioch-combo (Titan
        // Warlord, plus haut).
        type: "case",
        id: "paire-gyges",
        libelle:
          "Paire de pinces de siège Gyges et deux irradieurs (remplace les deux Armements ci-dessus)",
        cout: 10,
        ajoute:
          "Paire de pinces de siège Gyges et deux irradieurs (les deux Armements)",
      },
    ],
  },

  {
    id: "armigere-hastaire",
    nom: "Armigère Hastaire",
    categorie: "Engins de Guerre",
    cout: 150,
    composition: "1 Armigère Hastaire",
    traits: ["[Allégeance]", "[Questoris Familia]"],
    equipement: ["Lance thermique", "Mitrailleuse", "Tronçonneur Reaper"],
    faction: "chevaliers-questoris",
    notes:
      "Le Chevalier Armigère est un homologue plus agile et plus léger du Chevalier Questoris, et combattit souvent au côté de tels alliés durant la Grande Croisade, pour éliminer les menaces émanant d'ennemis que les Chevaliers plus grands n'identifiaient pas, comme les essaims d'infanterie tentant de franchir la barrière protectrice de leurs boucliers ioniques afin de venir poser des explosifs directement sur leur armature. Les Armigères Hastaires sont armés de lances thermiques menaçantes et de redoutables tronçonneurs Reaper, bien adaptés à la nature belliqueuse et agressive de leurs pilotes.",
    variantes: [
      {
        nom: "Armigère Hastaire",
        cout: 0,
        profil: {
          M: 10,
          CC: 4,
          CT: 4,
          F: 7,
          E: 7,
          PV: 7,
          I: 4,
          A: 3,
          Cd: 10,
          Sf: 10,
          Vo: 5,
          Int: 5,
          Sv: "3+",
          Inv: "6+",
        },
        regles: [
          "Massif (8)",
          "Explose (6+)",
          "Avance Implacable",
          "Mouvement à Couvert",
          "Attaque de Flanc",
        ],
        type: "Marcheur",
      },
    ],
    options: [
      {
        type: "choix",
        id: "mitrailleuse",
        libelle: "Remplacer la mitrailleuse",
        remplace: "Mitrailleuse",
        choix: [
          { nom: "— Conserver la mitrailleuse —", cout: 0 },
          { nom: "Fuseur", cout: 10 },
        ],
      },
    ],
  },

  {
    id: "armigere-helverien",
    nom: "Armigère Helvérien",
    categorie: "Engins de Guerre",
    cout: 150,
    composition: "1 Armigère Helvérien",
    traits: ["[Allégeance]", "[Questoris Familia]"],
    equipement: ["Deux autocanons Phaëton", "Mitrailleuse"],
    faction: "chevaliers-questoris",
    notes:
      "L'Armigère Helvérien est une plateforme de feu à mouvement rapide emportant une paire d'autocanons Phaëton, et conçue pour lâcher des grêles de tirs lourds en cavalant autour des forces ennemies. Les pilotes chargés de ce devoir protecteur sont rarement issus des lignées principales d'une Maisonnée, et peuvent en être de lointains cousins ayant prouvé leur valeur, lors de tournois ou sur le champ de bataille. Certaines Maisonnées s'abaisseront même à recruter de talentueux prisonniers de guerre, ou les descendants capturés de Maisons rivales, espérant tous atteindre un jour le rang d'Aspirant et rallier la Maisonnée à proprement parler.",
    variantes: [
      {
        nom: "Armigère Helvérien",
        cout: 0,
        profil: {
          M: 10,
          CC: 4,
          CT: 4,
          F: 7,
          E: 7,
          PV: 7,
          I: 4,
          A: 2,
          Cd: 10,
          Sf: 10,
          Vo: 5,
          Int: 5,
          Sv: "3+",
          Inv: "6+",
        },
        regles: [
          "Massif (8)",
          "Explose (6+)",
          "Avance Implacable",
          "Mouvement à Couvert",
          "Attaque de Flanc",
        ],
        type: "Marcheur",
      },
    ],
    options: [
      {
        type: "choix",
        id: "mitrailleuse",
        libelle: "Remplacer la mitrailleuse",
        remplace: "Mitrailleuse",
        choix: [
          { nom: "— Conserver la mitrailleuse —", cout: 0 },
          { nom: "Fuseur", cout: 10 },
        ],
      },
    ],
  },

  /* ============================================================
     LISTE D'ARMÉE DES SOLAR AUXILIA (Liber Auxilia)
     Transcription manuelle depuis des scans à l'impression dense :
     les profils, équipements et traits sont fidèles au livre, mais
     les listes d'Options ont été simplifiées aux accessoires les
     plus consultés (universels aux véhicules : Missile traqueur de
     Coque, Projecteurs, Lame de bulldozer, Bouclier répulsif — coûts
     recoupés sur plusieurs fiches) plutôt que retranscrites intégra-
     lement ; le livre reste la référence en cas de doute. Détache-
     ments Auxiliaires de Tercio, Doctrines de Cohorte et Réactions
     Avancées : voir js/organigramme-data.js et js/regles-data.js.
     ============================================================ */

  /* ---------- Quartier Général ---------- */
  {
    id: "sa-etat-major-legatine",
    nom: "Section d'État-major Tactique Légatine",
    faction: "solar-auxilia",
    categorie: "Quartier Général",
    cout: 125,
    composition: "1 Maréchal Légat, 4 Salvateurs",
    effectif: { base: 5, max: 8, cout: 14 },
    equipementLibelle: "Équipement",
    traits: ["[Allégeance]", "Solar Auxilia", "État-major Suprême de Cohorte"],
    notes:
      "Le Maréchal Légat commande une Cohorte entière de Solar Auxilia : sa présence dans un Détachement Principal accorde un Point de Réaction bonus à l'Armée.",
    equipement: [
      "Rifle laser — Salve (Salvateur seulement)",
      "Pistolet laser (Maréchal Légat seulement)",
      "Sabre charnabal (Maréchal Légat seulement)",
    ],
    variantes: [
      {
        nom: "Section d'État-major Tactique Légatine",
        cout: 0,
        profils: [
          {
            nom: "Maréchal Légat",
            profil: {
              M: 6,
              CC: 5,
              CT: 5,
              F: 4,
              E: 4,
              PV: 2,
              I: 4,
              A: 4,
              Cd: 10,
              Sf: 8,
              Vo: 8,
              Int: 7,
              Sv: "3+",
              Inv: "5+",
            },
          },
          {
            nom: "Salvateur",
            profil: {
              M: 6,
              CC: 4,
              CT: 4,
              F: 3,
              E: 3,
              PV: 1,
              I: 3,
              A: 2,
              Cd: 8,
              Sf: 7,
              Vo: 6,
              Int: 6,
              Sv: "4+",
              Inv: "—",
            },
          },
        ],
        regles: ["Ligne (2)"],
        type: "Maréchal Légat : Infanterie (État-major) · Salvateur : Infanterie",
      },
    ],
    options: [
      {
        type: "case",
        id: "pistolet-archeotech",
        libelle: "Un Salvateur : pistolet archéotech (Solar Auxilia)",
        cout: 10,
        ajoute: "Pistolet archéotech (Solar Auxilia) (un Salvateur)",
      },
      {
        type: "case",
        id: "vox",
        libelle: "Un Salvateur : vox internodal",
        cout: 10,
        ajoute: "Vox internodal (un Salvateur)",
      },
      {
        type: "case",
        id: "scanner",
        libelle: "Un Salvateur : scanner augure",
        cout: 10,
        ajoute: "Scanner augure (un Salvateur)",
      },
      {
        type: "choix",
        id: "vexillum",
        libelle: "Un Salvateur : vexillum",
        choix: [
          { nom: "— Aucun —", cout: 0 },
          { nom: "Vexillum auxilia (un Salvateur)", cout: 5 },
          { nom: "Vexillum des cohortes (un Salvateur)", cout: 15 },
        ],
      },
    ],
  },

  /* ---------- État-major ---------- */
  {
    id: "sa-etat-major-tactique",
    nom: "Section d'État-major Tactique",
    faction: "solar-auxilia",
    categorie: "État-major",
    cout: 100,
    composition: "1 Capitaine Auxilia, 4 Compagnons",
    effectif: { base: 5, max: 8, cout: 12 },
    equipementLibelle: "Équipement",
    traits: ["[Allégeance]", "Solar Auxilia"],
    notes:
      "Le socle de l'encadrement des Cohortes : chaque Tercio d'Infanterie est mené par une Section d'État-major Tactique, ou par un officier plus spécialisé selon l'affectation.",
    equipement: [
      "Rifle laser — Salve (Compagnon seulement)",
      "Pistolet laser (Capitaine Auxilia seulement)",
      "Sabre charnabal (Capitaine Auxilia seulement)",
    ],
    variantes: [
      {
        nom: "Section d'État-major Tactique",
        cout: 0,
        profils: [
          {
            nom: "Capitaine Auxilia",
            profil: {
              M: 6,
              CC: 4,
              CT: 4,
              F: 3,
              E: 3,
              PV: 2,
              I: 4,
              A: 3,
              Cd: 9,
              Sf: 8,
              Vo: 7,
              Int: 6,
              Sv: "4+",
              Inv: "5+",
            },
          },
          {
            nom: "Compagnon",
            profil: {
              M: 6,
              CC: 4,
              CT: 4,
              F: 3,
              E: 3,
              PV: 1,
              I: 3,
              A: 2,
              Cd: 8,
              Sf: 7,
              Vo: 6,
              Int: 6,
              Sv: "3+",
              Inv: "—",
            },
          },
        ],
        regles: ["Ligne (1)"],
        type: "Capitaine Auxilia : Infanterie (État-major) · Compagnon : Infanterie",
      },
    ],
    options: [
      {
        type: "case",
        id: "pistolet-archeotech",
        libelle: "Un Compagnon : pistolet archéotech (Solar Auxilia)",
        cout: 10,
        ajoute: "Pistolet archéotech (Solar Auxilia) (un Compagnon)",
      },
      {
        type: "case",
        id: "vox",
        libelle: "Un Compagnon : vox internodal",
        cout: 10,
        ajoute: "Vox internodal (un Compagnon)",
      },
      {
        type: "case",
        id: "scanner",
        libelle: "Un Compagnon : scanner augure",
        cout: 10,
        ajoute: "Scanner augure (un Compagnon)",
      },
    ],
  },
  {
    id: "sa-etat-major-ligne",
    nom: "Section d'État-major de Ligne",
    faction: "solar-auxilia",
    categorie: "État-major",
    cout: 65,
    composition: "1 Maître de Troupe, 4 Vétérans",
    effectif: { base: 5, max: 9, cout: 10 },
    equipementLibelle: "Équipement",
    traits: ["[Allégeance]", "Solar Auxilia", "Tercio d'Infanterie"],
    notes:
      "Débloque le Détachement Auxiliaire de Tercio d'Infanterie quand cette Unité occupe une Case d'État-major (voir js/organigramme-data.js).",
    equipement: [
      "Rifle laser — Salve (Maître de Troupe seulement)",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Section d'État-major de Ligne",
        cout: 0,
        profils: [
          {
            nom: "Maître de Troupe",
            profil: {
              M: 6,
              CC: 4,
              CT: 4,
              F: 3,
              E: 3,
              PV: 2,
              I: 3,
              A: 3,
              Cd: 8,
              Sf: 8,
              Vo: 7,
              Int: 6,
              Sv: "4+",
              Inv: "—",
            },
          },
          {
            nom: "Vétéran",
            profil: {
              M: 6,
              CC: 3,
              CT: 4,
              F: 3,
              E: 3,
              PV: 1,
              I: 3,
              A: 2,
              Cd: 7,
              Sf: 7,
              Vo: 6,
              Int: 6,
              Sv: "4+",
              Inv: "—",
            },
          },
        ],
        regles: ["Ordre Serré"],
        type: "Maître de Troupe : Infanterie (Sergent) · Vétéran : Infanterie",
      },
    ],
    options: [
      {
        type: "case",
        id: "vox",
        libelle: "Un Vétéran : vox internodal",
        cout: 10,
        ajoute: "Vox internodal (un Vétéran)",
      },
      {
        type: "case",
        id: "scanner",
        libelle: "Un Vétéran : scanner augure",
        cout: 10,
        ajoute: "Scanner augure (un Vétéran)",
      },
    ],
  },
  {
    id: "sa-etat-major-veletaris",
    nom: "Section d'État-major Veletaris",
    faction: "solar-auxilia",
    categorie: "État-major",
    cout: 75,
    composition: "1 Primat-chef, 4 Veletarii",
    effectif: { base: 5, max: 8, cout: 12 },
    equipementLibelle: "Équipement",
    traits: ["[Allégeance]", "Solar Auxilia", "Tercio Véletaris"],
    notes:
      "Débloque le Détachement Auxiliaire de Tercio Veletaris quand cette Unité occupe une Case d'État-major (voir js/organigramme-data.js).",
    equipement: [
      "Chargeur volkite (Primat-chef seulement)",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Section d'État-major Veletaris",
        cout: 0,
        profils: [
          {
            nom: "Primat-chef",
            profil: {
              M: 6,
              CC: 4,
              CT: 4,
              F: 3,
              E: 3,
              PV: 2,
              I: 3,
              A: 3,
              Cd: 8,
              Sf: 8,
              Vo: 7,
              Int: 6,
              Sv: "4+",
              Inv: "—",
            },
          },
          {
            nom: "Veletarius",
            profil: {
              M: 6,
              CC: 4,
              CT: 4,
              F: 3,
              E: 3,
              PV: 1,
              I: 3,
              A: 2,
              Cd: 8,
              Sf: 6,
              Vo: 6,
              Int: 6,
              Sv: "4+",
              Inv: "—",
            },
          },
        ],
        regles: ["Tenir la Ligne"],
        type: "Primat-chef : Infanterie (Sergent) · Veletarius : Infanterie",
      },
    ],
    options: [
      {
        type: "case",
        id: "vox",
        libelle: "Un Veletarius : vox internodal",
        cout: 10,
        ajoute: "Vox internodal (un Veletarius)",
      },
    ],
  },
  {
    id: "sa-etat-major-hermes",
    nom: "Section d'État-major Hermes",
    faction: "solar-auxilia",
    categorie: "État-major",
    cout: 75,
    composition: "1 Leader Hermes, 1 Patrouilleur Hermes",
    effectif: { base: 2, max: 4, cout: 30 },
    equipementLibelle: "Équipement",
    traits: ["[Allégeance]", "Solar Auxilia", "Tercio d'Éclaireurs"],
    notes:
      "Débloque le Détachement Auxiliaire de Tercio d'Éclaireurs quand cette Unité occupe une Case d'État-major (voir js/organigramme-data.js).",
    equipement: [
      "Arquebuse volkite",
      "Grenades Frag",
      "Grenades Krak",
      "Lance-grenade Hermes — Frag",
    ],
    variantes: [
      {
        nom: "Section d'État-major Hermes",
        cout: 0,
        profils: [
          {
            nom: "Leader Hermes",
            profil: {
              M: 10,
              CC: 4,
              CT: 5,
              F: 5,
              E: 3,
              PV: 2,
              I: 8,
              A: 2,
              Cd: 9,
              Sf: 7,
              Vo: 6,
              Int: 7,
              Sv: "4+",
              Inv: "—",
            },
          },
          {
            nom: "Patrouilleur Hermes",
            profil: {
              M: 10,
              CC: 4,
              CT: 5,
              F: 5,
              E: 2,
              PV: 1,
              I: 7,
              A: 2,
              Cd: 8,
              Sf: 6,
              Vo: 6,
              Int: 6,
              Sv: "4+",
              Inv: "—",
            },
          },
        ],
        regles: [
          "Massif (2)",
          "Avance Implacable",
          "Mouvement à Couvert",
          "Attaque de Flanc",
          "Frappe Préventive",
        ],
        type: "Leader Hermes : Cavalerie (Sergent, Léger) · Patrouilleur Hermes : Cavalerie (Léger)",
      },
    ],
    options: [
      {
        type: "case",
        id: "vox",
        libelle: "Le Leader Hermes : vox internodal",
        cout: 10,
        ajoute: "Vox internodal (Leader Hermes)",
      },
    ],
  },
  {
    id: "sa-etat-major-artillerie",
    nom: "Section d'État-major Artillerie",
    faction: "solar-auxilia",
    categorie: "État-major",
    cout: 65,
    composition: "1 Maître d'Artillerie, 4 Vétérans",
    effectif: { base: 5, max: 9, cout: 10 },
    equipementLibelle: "Équipement",
    traits: ["[Allégeance]", "Solar Auxilia", "Tercio d'Artillerie"],
    notes:
      "Débloque le Détachement Auxiliaire de Tercio d'Artillerie quand cette Unité occupe une Case d'État-major (voir js/organigramme-data.js).",
    equipement: [
      "Rifle laser — Salve (Maître d'Artillerie seulement)",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Section d'État-major Artillerie",
        cout: 0,
        profils: [
          {
            nom: "Maître d'Artillerie",
            profil: {
              M: 6,
              CC: 4,
              CT: 4,
              F: 3,
              E: 3,
              PV: 2,
              I: 3,
              A: 2,
              Cd: 8,
              Sf: 7,
              Vo: 8,
              Int: 7,
              Sv: "4+",
              Inv: "—",
            },
          },
          {
            nom: "Vétéran",
            profil: {
              M: 6,
              CC: 3,
              CT: 4,
              F: 3,
              E: 3,
              PV: 1,
              I: 3,
              A: 2,
              Cd: 7,
              Sf: 7,
              Vo: 6,
              Int: 6,
              Sv: "4+",
              Inv: "—",
            },
          },
        ],
        regles: ["Bombardement de Précision"],
        type: "Maître d'Artillerie : Infanterie (Sergent) · Vétéran : Infanterie",
      },
    ],
    options: [
      {
        type: "case",
        id: "scanner",
        libelle: "Un Vétéran : scanner augure",
        cout: 10,
        ajoute: "Scanner augure (un Vétéran)",
      },
    ],
  },
  {
    id: "sa-etat-major-blinde",
    nom: "Section d'État-major Blindé",
    faction: "solar-auxilia",
    categorie: "État-major",
    cout: 150,
    composition: "1 Char d'État-major Blindé",
    traits: [
      "[Allégeance]",
      "Solar Auxilia",
      "Tercio Blindé",
      "Écran de Fumée",
    ],
    notes:
      "Débloque le Détachement Auxiliaire de Tercio Blindé quand cette Unité occupe une Case d'État-major (voir js/organigramme-data.js).",
    equipement: ["Obusier de Tourelle", "Bolter lourd de Coque (Avant)"],
    variantes: [
      {
        nom: "Char d'État-major Blindé",
        cout: 0,
        profilVehicule: {
          M: 10,
          CT: 4,
          avant: 14,
          flanc: 13,
          arriere: 10,
          PC: 6,
          transport: "—",
        },
        regles: ["Autoréparation (4+)", "Combat Blindé"],
        type: "Véhicule",
      },
    ],
    options: [
      {
        type: "case",
        id: "missile",
        libelle: "Missile traqueur (Solar Auxilia) de Coque (Avant)",
        cout: 20,
        ajoute: "Missile traqueur (Solar Auxilia) de Coque (Avant)",
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
        id: "bouclier",
        libelle: "Bouclier répulsif",
        cout: 5,
        ajoute: "Bouclier répulsif",
      },
    ],
  },

  /* ---------- Elite ---------- */
  {
    id: "sa-assaut-veletaris",
    nom: "Section d'Assaut Veletaris",
    faction: "solar-auxilia",
    categorie: "Elite",
    cout: 90,
    composition: "1 Primat-chef Veletaris, 4 Veletarii",
    effectif: { base: 5, max: 15, cout: 8 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "Solar Auxilia"],
    notes:
      "Formées pour l'assaut de rupture, les Sections d'Assaut Veletaris ouvrent la brèche par laquelle déferle le reste de la Cohorte.",
    equipement: ["Chargeur volkite", "Grenades Frag", "Grenades Krak"],
    variantes: [
      {
        nom: "Section d'Assaut Veletaris",
        cout: 0,
        profils: [
          {
            nom: "Primat-chef Veletaris",
            profil: {
              M: 6,
              CC: 4,
              CT: 3,
              F: 3,
              E: 3,
              PV: 2,
              I: 3,
              A: 2,
              Cd: 8,
              Sf: 6,
              Vo: 8,
              Int: 6,
              Sv: "4+",
              Inv: "—",
            },
          },
          {
            nom: "Veletarius",
            profil: {
              M: 6,
              CC: 4,
              CT: 4,
              F: 3,
              E: 3,
              PV: 1,
              I: 3,
              A: 2,
              Cd: 8,
              Sf: 6,
              Vo: 6,
              Int: 6,
              Sv: "4+",
              Inv: "—",
            },
          },
        ],
        regles: ["Avant-garde (3)"],
        type: "Primat-chef Veletaris : Infanterie (Champion, Sergent) · Veletarius : Infanterie",
      },
    ],
    options: [
      {
        type: "choix",
        id: "arme-lourde",
        libelle:
          "Par tranche de cinq Figurines : chargeur volkite d'une Figurine → arme lourde",
        parTranche: 5,
        choix: [
          { nom: "— Conserver le chargeur volkite —", cout: 0 },
          { nom: "Lance-flammes lourd (Solar Auxilia)", cout: 10 },
        ],
      },
    ],
  },
  {
    id: "sa-avant-garde-veletaris",
    nom: "Section d'Avant-garde Veletaris",
    faction: "solar-auxilia",
    categorie: "Elite",
    cout: 100,
    composition: "1 Primat Veletaris, 9 Veletarii",
    effectif: { base: 10, max: 19, cout: 9 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "Solar Auxilia"],
    notes:
      "Déployée en tête de Cohorte pour sonder les lignes ennemies avant que le gros de la force ne s'engage.",
    equipement: ["Rifle laser — Salve", "Grenades Frag", "Grenades Krak"],
    variantes: [
      {
        nom: "Section d'Avant-garde Veletaris",
        cout: 0,
        profils: [
          {
            nom: "Primat Veletaris",
            profil: {
              M: 6,
              CC: 4,
              CT: 3,
              F: 3,
              E: 3,
              PV: 2,
              I: 3,
              A: 2,
              Cd: 8,
              Sf: 9,
              Vo: 9,
              Int: 9,
              Sv: "4+",
              Inv: "—",
            },
          },
          {
            nom: "Veletarius",
            profil: {
              M: 6,
              CC: 4,
              CT: 4,
              F: 3,
              E: 3,
              PV: 1,
              I: 3,
              A: 1,
              Cd: 7,
              Sf: 8,
              Vo: 9,
              Int: 9,
              Sv: "4+",
              Inv: "—",
            },
          },
        ],
        regles: ["Avant-garde (3)"],
        type: "Primat Veletaris : Infanterie (Sergent) · Veletarius : Infanterie",
      },
    ],
    options: [
      {
        type: "case",
        id: "lance-flammes",
        libelle: "Le Primat Veletaris : lance-flammes lourd (Solar Auxilia)",
        cout: 10,
        ajoute: "Lance-flammes lourd (Solar Auxilia) (Primat Veletaris)",
      },
    ],
  },

  /* ---------- Assaut Lourd ---------- */
  {
    id: "sa-ogryn-charonites",
    nom: "Section d'Ogryn Charonites",
    faction: "solar-auxilia",
    categorie: "Assaut Lourd",
    cout: 120,
    composition: "3 Ogryns Charonites",
    effectif: { base: 3, max: 6, cout: 40 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "Solar Auxilia"],
    notes:
      "Bio-augmentés au-delà des limites humaines, les Ogryns Charonites précèdent l'assaut principal pour absorber le pire des tirs ennemis.",
    equipement: ["Pinces de Charonite"],
    variantes: [
      {
        nom: "Section d'Ogryn Charonites",
        cout: 0,
        profils: [
          {
            nom: "Ogryn Charonite",
            profil: {
              M: 7,
              CC: 4,
              CT: 2,
              F: 5,
              E: 4,
              PV: 4,
              I: 2,
              A: 4,
              Cd: 10,
              Sf: 10,
              Vo: 6,
              Int: 2,
              Sv: "4+",
              Inv: "—",
            },
          },
        ],
        regles: [
          "Âpre Devoir",
          "Massif (4)",
          "Sacrifiable (2)",
          "Insensible à la Douleur (5+)",
          "Impact (A)",
        ],
        type: "Infanterie (Tirailleurs)",
      },
    ],
    options: [],
  },

  /* ---------- Troupes ---------- */
  {
    id: "sa-ryeliers",
    nom: "Section de Ryeliers",
    faction: "solar-auxilia",
    categorie: "Troupes",
    cout: 50,
    composition: "1 Sergent Auxiliaire, 9 Auxiliaires",
    effectif: { base: 10, max: 20, cout: 4 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "Solar Auxilia", "Tercio d'Infanterie"],
    notes:
      "Le fer de lance de toute Cohorte de Solar Auxilia : les Sections de Ryeliers tiennent le terrain conquis et forment la masse des Armées d'Auxilia.",
    equipement: ["Rifle laser — Salve", "Grenades Frag", "Grenades Krak"],
    variantes: [
      {
        nom: "Section de Ryeliers",
        cout: 0,
        profils: [
          {
            nom: "Sergent Auxiliaire",
            profil: {
              M: 6,
              CC: 3,
              CT: 3,
              F: 3,
              E: 3,
              PV: 1,
              I: 3,
              A: 2,
              Cd: 7,
              Sf: 7,
              Vo: 6,
              Int: 6,
              Sv: "4+",
              Inv: "—",
            },
          },
          {
            nom: "Auxiliaire",
            profil: {
              M: 6,
              CC: 3,
              CT: 3,
              F: 3,
              E: 3,
              PV: 1,
              I: 3,
              A: 1,
              Cd: 6,
              Sf: 6,
              Vo: 6,
              Int: 6,
              Sv: "4+",
              Inv: "—",
            },
          },
        ],
        regles: ["Ligne (1)"],
        type: "Sergent Auxiliaire : Infanterie (Sergent) · Auxiliaire : Infanterie",
      },
    ],
    options: [
      {
        type: "case",
        id: "arme-lourde",
        libelle: "Par tranche de dix Figurines : mitrailleuse (une Figurine)",
        parTranche: 10,
        cout: 10,
        ajoute: "Mitrailleuse (à la place du rifle laser, une Figurine)",
      },
      {
        type: "case",
        id: "vox",
        libelle: "Le Sergent Auxiliaire : vox internodal",
        cout: 10,
        ajoute: "Vox internodal (Sergent Auxiliaire)",
      },
    ],
  },

  /* ---------- Appui ---------- */
  {
    id: "sa-basilisk",
    nom: "Char d'Artillerie Basilisk",
    faction: "solar-auxilia",
    categorie: "Appui",
    cout: 120,
    composition: "1 Basilisk",
    traits: [
      "[Allégeance]",
      "Solar Auxilia",
      "Tercio d'Artillerie",
      "Écran de Fumée",
    ],
    equipement: ["Canon Earthshaker d'Axe Central"],
    variantes: [
      {
        nom: "Basilisk",
        cout: 0,
        profilVehicule: {
          M: 10,
          CT: 3,
          avant: 12,
          flanc: 12,
          arriere: 10,
          PC: 5,
          transport: "—",
        },
        regles: [],
        type: "Véhicule",
      },
    ],
    options: [
      {
        type: "case",
        id: "projecteurs",
        libelle: "Projecteurs",
        cout: 5,
        ajoute: "Projecteurs",
      },
      {
        type: "case",
        id: "bouclier",
        libelle: "Bouclier répulsif",
        cout: 5,
        ajoute: "Bouclier répulsif",
      },
    ],
  },
  {
    id: "sa-medusa",
    nom: "Char d'Artillerie Medusa",
    faction: "solar-auxilia",
    categorie: "Appui",
    cout: 140,
    composition: "1 Medusa",
    traits: [
      "[Allégeance]",
      "Solar Auxilia",
      "Tercio d'Artillerie",
      "Écran de Fumée",
    ],
    equipement: ["Mortier Medusa d'Axe Central"],
    variantes: [
      {
        nom: "Medusa",
        cout: 0,
        profilVehicule: {
          M: 10,
          CT: 3,
          avant: 12,
          flanc: 12,
          arriere: 10,
          PC: 5,
          transport: "—",
        },
        regles: [],
        type: "Véhicule",
      },
    ],
    options: [
      {
        type: "case",
        id: "projecteurs",
        libelle: "Projecteurs",
        cout: 5,
        ajoute: "Projecteurs",
      },
      {
        type: "case",
        id: "bouclier",
        libelle: "Bouclier répulsif",
        cout: 5,
        ajoute: "Bouclier répulsif",
      },
    ],
  },
  {
    id: "sa-rapier",
    nom: "Section de Rapier",
    faction: "solar-auxilia",
    categorie: "Appui",
    cout: 30,
    composition: "1 Pointeur de Rapier, 1 Chassis Rapier",
    effectif: { base: 2, max: 8, cout: 30 },
    equipementLibelle: "Équipement",
    traits: ["[Allégeance]", "Solar Auxilia", "Tercio d'Artillerie"],
    notes:
      "Le Rapier associe un artilleur et son affût automoteur : les deux Figurines ne forment qu'une seule Unité de Rôle Tactique Appui.",
    equipement: ["Batterie de multi-laser Gravis"],
    variantes: [
      {
        nom: "Section de Rapier",
        cout: 0,
        profils: [
          {
            nom: "Pointeur de Rapier",
            profil: {
              M: 6,
              CC: 3,
              CT: 3,
              F: 3,
              E: 3,
              PV: 1,
              I: 3,
              A: 1,
              Cd: 7,
              Sf: 7,
              Vo: 6,
              Int: 6,
              Sv: "4+",
              Inv: "—",
            },
          },
          {
            nom: "Chassis Rapier",
            profil: {
              M: 6,
              CC: 3,
              CT: 4,
              F: 6,
              E: 4,
              PV: 1,
              I: 1,
              A: 1,
              Cd: 6,
              Sf: 7,
              Vo: 6,
              Int: 6,
              Sv: "3+",
              Inv: "—",
            },
          },
        ],
        regles: ["Massif (4)", "Lent et Méthodique"],
        type: "Pointeur de Rapier : Infanterie (Léger) · Chassis Rapier : Infanterie",
      },
    ],
    options: [
      {
        type: "choix",
        id: "arme",
        libelle: "Remplacer la batterie de multi-laser Gravis",
        remplace: "Batterie de multi-laser Gravis",
        choix: [
          { nom: "— Conserver la batterie de multi-laser Gravis —", cout: 0 },
          { nom: "Laser lourd Sollex", cout: 10 },
        ],
      },
    ],
  },
  {
    id: "sa-hermes-veletaris",
    nom: "Escadron d'Hermes Veletaris",
    faction: "solar-auxilia",
    categorie: "Appui",
    cout: 40,
    composition: "2 Sentinelles Hermes Veletaris",
    effectif: { base: 2, max: 4, cout: 20 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "Solar Auxilia"],
    equipement: ["Arquebuse volkite", "Grenades Frag", "Grenades Krak"],
    variantes: [
      {
        nom: "Sentinelle Hermes Veletaris",
        cout: 0,
        profil: {
          M: 8,
          CC: 4,
          CT: 4,
          F: 4,
          E: 5,
          PV: 2,
          I: 3,
          A: 1,
          Cd: 7,
          Sf: 9,
          Vo: 6,
          Int: 6,
          Sv: "3+",
          Inv: "—",
        },
        regles: [
          "Massif (2)",
          "Avance Implacable",
          "Mouvement à Couvert",
          "Avant-garde (2)",
        ],
        type: "Cavalerie",
      },
    ],
    options: [],
  },

  /* ---------- Engin de Guerre ---------- */
  {
    id: "sa-sentinelles-aethon",
    nom: "Escadron de Sentinelles Lourdes Aethon",
    faction: "solar-auxilia",
    categorie: "Engins de Guerre",
    cout: 60,
    composition: "1 Sentinelle Lourde Aethon",
    effectif: { base: 1, max: 4, cout: 60 },
    equipementLibelle: "Équipement",
    traits: ["[Allégeance]", "Solar Auxilia", "Tercio d'Éclaireurs"],
    equipement: ["Multi-laser (Solar Auxilia)", "Batterie de missiles Aethon"],
    variantes: [
      {
        nom: "Sentinelle Lourde Aethon",
        cout: 0,
        profil: {
          M: 7,
          CC: 3,
          CT: 3,
          F: 6,
          E: 5,
          PV: 2,
          I: 1,
          A: 2,
          Cd: 9,
          Sf: 10,
          Vo: 6,
          Int: 2,
          Sv: "2+",
          Inv: "—",
        },
        regles: ["Massif (6)", "Lent et Méthodique"],
        type: "Marcheur (Tirailleurs)",
      },
    ],
    options: [],
  },

  /* ---------- Transports / Transports Lourds ---------- */
  {
    id: "sa-arvus",
    nom: "Allège Arvus",
    faction: "solar-auxilia",
    categorie: "Transports",
    cout: 75,
    composition: "1 Allège Arvus",
    traits: ["[Allégeance]", "Solar Auxilia"],
    notes:
      "Type de Liste d'Armée « Véhicule (Transport Léger) » : catégorisée ici en Rôle Tactique Transports (et non Transports Lourds) en cohérence avec ce Type — à corriger si le livre l'indique autrement.",
    equipement: ["Bolter lourd sur Pivot"],
    variantes: [
      {
        nom: "Allège Arvus",
        cout: 0,
        profilVehicule: {
          M: 30,
          CT: 3,
          avant: 11,
          flanc: 11,
          arriere: 11,
          PC: 4,
          transport: 12,
        },
        regles: ["Transport Léger"],
        type: "Véhicule (Transport Léger, Aéronef)",
      },
    ],
    options: [],
  },
  {
    id: "sa-dracosan",
    nom: "Transport Blindé Dracosan",
    faction: "solar-auxilia",
    categorie: "Transports Lourds",
    cout: 140,
    composition: "1 Dracosan",
    traits: ["[Allégeance]", "Solar Auxilia", "Écran de Fumée"],
    equipement: ["Canon laser jumelé de Coque (Avant)"],
    variantes: [
      {
        nom: "Dracosan",
        cout: 0,
        profilVehicule: {
          M: 12,
          CT: 3,
          avant: 13,
          flanc: 13,
          arriere: 11,
          PC: 7,
          transport: 22,
        },
        regles: ["Transport Léger"],
        type: "Véhicule (Transport)",
      },
    ],
    options: [
      {
        type: "case",
        id: "projecteurs",
        libelle: "Projecteurs",
        cout: 5,
        ajoute: "Projecteurs",
      },
      {
        type: "case",
        id: "bouclier",
        libelle: "Bouclier répulsif",
        cout: 5,
        ajoute: "Bouclier répulsif",
      },
    ],
  },

  /* ---------- Reco ---------- */
  {
    id: "sa-sentinelles-legeres-hermes",
    nom: "Escadron de Sentinelles Légères Hermes",
    faction: "solar-auxilia",
    categorie: "Reco",
    cout: 32,
    composition: "1 Sentinelle Légère Hermes",
    effectif: { base: 1, max: 4, cout: 32 },
    equipementLibelle: "Équipement",
    traits: ["[Allégeance]", "Solar Auxilia"],
    equipement: [
      "Multi-laser (Solar Auxilia)",
      "Grenades Frag",
      "Grenades Krak",
    ],
    variantes: [
      {
        nom: "Sentinelle Légère Hermes",
        cout: 0,
        profil: {
          M: 10,
          CC: 3,
          CT: 3,
          F: 5,
          E: 5,
          PV: 2,
          I: 3,
          A: 1,
          Cd: 7,
          Sf: 8,
          Vo: 6,
          Int: 6,
          Sv: "4+",
          Inv: "—",
        },
        regles: [
          "Massif (2)",
          "Avance Implacable",
          "Mouvement à Couvert",
          "Attaque de Flanc",
        ],
        type: "Cavalerie (Léger)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "arme",
        libelle: "Remplacer le multi-laser",
        remplace: "Multi-laser (Solar Auxilia)",
        choix: [
          { nom: "— Conserver le multi-laser —", cout: 0 },
          { nom: "Lance-grenade Hermes — Krak", cout: 5 },
        ],
      },
    ],
  },

  /* ---------- Attaque Rapide ---------- */
  {
    id: "sa-primaris-lightning",
    nom: "Chasseur d'Attaque Primaris-Lightning",
    faction: "solar-auxilia",
    categorie: "Attaque Rapide",
    cout: 160,
    composition: "1 Primaris-Lightning",
    traits: ["[Allégeance]", "Solar Auxilia", "Intercepteur"],
    equipement: [
      "Canon laser jumelé d'Axe Central",
      "Six missiles Hellstrike d'Axe Central",
    ],
    variantes: [
      {
        nom: "Primaris-Lightning",
        cout: 0,
        profilVehicule: {
          M: 26,
          CT: 3,
          avant: 11,
          flanc: 11,
          arriere: 11,
          PC: 4,
          transport: "—",
        },
        regles: [],
        type: "Véhicule (Aéronef)",
      },
    ],
    options: [],
  },
  {
    id: "sa-thunderbolt",
    nom: "Chasseur Lourd Thunderbolt",
    faction: "solar-auxilia",
    categorie: "Attaque Rapide",
    cout: 120,
    composition: "1 Thunderbolt",
    traits: ["[Allégeance]", "Solar Auxilia"],
    equipement: [
      "Canon laser jumelé d'Axe Central",
      "Deux autocanons Gravis (Solar Auxilia) d'Axe Central",
    ],
    variantes: [
      {
        nom: "Thunderbolt",
        cout: 0,
        profilVehicule: {
          M: 22,
          CT: 3,
          avant: 12,
          flanc: 12,
          arriere: 12,
          PC: 5,
          transport: "—",
        },
        regles: [],
        type: "Véhicule (Aéronef)",
      },
    ],
    options: [],
  },

  /* ---------- Blindés ---------- */
  {
    id: "sa-leman-russ-frappe",
    nom: "Char de Frappe Leman Russ",
    faction: "solar-auxilia",
    categorie: "Blindés",
    cout: 140,
    composition: "1 Leman Russ",
    traits: [
      "[Allégeance]",
      "Solar Auxilia",
      "Tercio Blindé",
      "Écran de Fumée",
    ],
    equipement: ["Obusier de Tourelle", "Bolter lourd de Coque (Avant)"],
    variantes: [
      {
        nom: "Char de Frappe Leman Russ",
        cout: 0,
        profilVehicule: {
          M: 10,
          CT: 3,
          avant: 14,
          flanc: 13,
          arriere: 10,
          PC: 6,
          transport: "—",
        },
        regles: [],
        type: "Véhicule",
      },
    ],
    options: [
      {
        type: "case",
        id: "missile",
        libelle: "Missile traqueur (Solar Auxilia) de Coque (Avant)",
        cout: 20,
        ajoute: "Missile traqueur (Solar Auxilia) de Coque (Avant)",
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
        id: "bouclier",
        libelle: "Bouclier répulsif",
        cout: 5,
        ajoute: "Bouclier répulsif",
      },
    ],
  },
  {
    id: "sa-leman-russ-assaut",
    nom: "Char d'Assaut Leman Russ",
    faction: "solar-auxilia",
    categorie: "Blindés",
    cout: 140,
    composition: "1 Leman Russ",
    traits: [
      "[Allégeance]",
      "Solar Auxilia",
      "Tercio Blindé",
      "Écran de Fumée",
    ],
    equipement: [
      "Macro-sacre volkite (Solar Auxilia) de Tourelle",
      "Bolter lourd de Coque (Avant)",
    ],
    variantes: [
      {
        nom: "Char d'Assaut Leman Russ",
        cout: 0,
        profilVehicule: {
          M: 10,
          CT: 3,
          avant: 14,
          flanc: 13,
          arriere: 10,
          PC: 6,
          transport: "—",
        },
        regles: [],
        type: "Véhicule",
      },
    ],
    options: [
      {
        type: "case",
        id: "missile",
        libelle: "Missile traqueur (Solar Auxilia) de Coque (Avant)",
        cout: 20,
        ajoute: "Missile traqueur (Solar Auxilia) de Coque (Avant)",
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
        id: "bouclier",
        libelle: "Bouclier répulsif",
        cout: 5,
        ajoute: "Bouclier répulsif",
      },
    ],
  },
  {
    id: "sa-malcador",
    nom: "Char Lourd Malcador",
    faction: "solar-auxilia",
    categorie: "Blindés",
    cout: 215,
    composition: "1 Malcador",
    traits: [
      "[Allégeance]",
      "Solar Auxilia",
      "Tercio Blindé",
      "Écran de Fumée",
    ],
    equipement: ["Obusier de Coque (Avant)"],
    variantes: [
      {
        nom: "Malcador",
        cout: 0,
        profilVehicule: {
          M: 12,
          CT: 3,
          avant: 13,
          flanc: 13,
          arriere: 11,
          PC: 7,
          transport: "—",
        },
        regles: ["Tir Indépendant"],
        type: "Véhicule",
      },
    ],
    options: [
      {
        type: "case",
        id: "missile",
        libelle: "Missile traqueur (Solar Auxilia) de Coque (Avant)",
        cout: 20,
        ajoute: "Missile traqueur (Solar Auxilia) de Coque (Avant)",
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
        id: "bouclier",
        libelle: "Bouclier répulsif",
        cout: 5,
        ajoute: "Bouclier répulsif",
      },
    ],
  },
  {
    id: "sa-malcador-infernus",
    nom: "Char à Arme Spéciale Malcador Infernus",
    faction: "solar-auxilia",
    categorie: "Blindés",
    cout: 240,
    composition: "1 Malcador Infernus",
    traits: [
      "[Allégeance]",
      "Solar Auxilia",
      "Tercio Blindé",
      "Écran de Fumée",
    ],
    equipement: [
      "Canon Infernus d'Axe Central",
      "Deux multi-lasers (Solar Auxilia) Latéraux",
    ],
    variantes: [
      {
        nom: "Malcador Infernus",
        cout: 0,
        profilVehicule: {
          M: 12,
          CT: 3,
          avant: 13,
          flanc: 13,
          arriere: 10,
          PC: 7,
          transport: "—",
        },
        regles: ["Tir Indépendant"],
        type: "Véhicule",
      },
    ],
    options: [
      {
        type: "case",
        id: "projecteurs",
        libelle: "Projecteurs",
        cout: 5,
        ajoute: "Projecteurs",
      },
      {
        type: "case",
        id: "bouclier",
        libelle: "Bouclier répulsif",
        cout: 5,
        ajoute: "Bouclier répulsif",
      },
    ],
  },
  {
    id: "sa-valdor",
    nom: "Chasseur de Chars Valdor",
    faction: "solar-auxilia",
    categorie: "Blindés",
    cout: 225,
    composition: "1 Valdor",
    traits: [
      "[Allégeance]",
      "Solar Auxilia",
      "Tercio Blindé",
      "Écran de Fumée",
    ],
    equipement: [
      "Laser à neutrons (Solar Auxilia) d'Axe Central",
      "Multi-laser (Solar Auxilia) Latéral (Droite)",
    ],
    variantes: [
      {
        nom: "Valdor",
        cout: 0,
        profilVehicule: {
          M: 12,
          CT: 3,
          avant: 13,
          flanc: 13,
          arriere: 11,
          PC: 7,
          transport: "—",
        },
        regles: [],
        type: "Véhicule",
      },
    ],
    options: [
      {
        type: "choix",
        id: "arme-laterale",
        libelle: "Remplacer le multi-laser Latéral (Droite)",
        remplace: "Multi-laser (Solar Auxilia) Latéral (Droite)",
        choix: [
          { nom: "— Conserver le multi-laser Latéral —", cout: 0 },
          {
            nom: "Autocanon Gravis (Solar Auxilia) Latéral (Droite)",
            cout: 10,
          },
          {
            nom: "Lance-flammes lourd (Solar Auxilia) Latéral (Droite)",
            cout: 0,
          },
          { nom: "Canon laser (Solar Auxilia) Latéral (Droite)", cout: 5 },
        ],
      },
      {
        type: "case",
        id: "missile",
        libelle: "Missile traqueur (Solar Auxilia) de Coque (Avant)",
        cout: 20,
        ajoute: "Missile traqueur (Solar Auxilia) de Coque (Avant)",
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
        id: "bouclier",
        libelle: "Bouclier répulsif",
        cout: 5,
        ajoute: "Bouclier répulsif",
      },
    ],
  },
  {
    id: "sa-stormhammer",
    nom: "Char d'Assaut Super-Lourd Stormhammer",
    faction: "solar-auxilia",
    categorie: "Blindés",
    cout: 500,
    composition: "1 Stormhammer",
    traits: ["[Allégeance]", "Solar Auxilia", "Écran de Fumée"],
    equipement: [
      "Canon Stormhammer de Tourelle",
      "Multi-laser coaxial (Canon Stormhammer)",
      "Obusier jumelé de Coque (Avant)",
      "Trois multi-lasers de Coque (Gauche)",
      "Trois multi-lasers de Coque (Droite)",
    ],
    variantes: [
      {
        nom: "Stormhammer",
        cout: 0,
        profilVehicule: {
          M: 10,
          CT: 3,
          avant: 14,
          flanc: 13,
          arriere: 12,
          PC: 16,
          transport: "—",
        },
        regles: [],
        type: "Véhicule (Super-lourd)",
      },
    ],
    options: [
      {
        type: "case",
        id: "missile",
        libelle: "Missile traqueur (Solar Auxilia) de Coque (Avant)",
        cout: 20,
        ajoute: "Missile traqueur (Solar Auxilia) de Coque (Avant)",
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
        id: "bouclier",
        libelle: "Bouclier répulsif",
        cout: 5,
        ajoute: "Bouclier répulsif",
      },
    ],
  },

  /* ============================================================
     LISTE D'ARMÉE DES TAGHMATA DU MECHANICUM (Liber Mechanicum)
     Transcription manuelle depuis des scans à l'impression dense,
     certains pivotés à 90° : profils/équipement/traits fidèles au
     livre, Options simplifiées aux accessoires les plus consultés
     (comme pour la Liste d'Armée des Solar Auxilia ci-dessus) plutôt
     que retranscrites intégralement — le livre reste la référence en
     cas de doute. « Archimagos Scoria » n'a pas de fiche photographiée
     dans les scans fournis : profil reconstruit par cohérence avec les
     autres Archimagi, à vérifier en priorité.
     ============================================================ */

  /* ---------- Quartier Général ---------- */
  {
    id: "mech-archimagos",
    nom: "Archimagos",
    faction: "mechanicum",
    categorie: "Quartier Général",
    cout: 120,
    composition: "1 Archimagos",
    traits: ["[Allégeance]", "[Mechanicum]", "Cybertheurge"],
    equipement: ["Grenades Frag"],
    variantes: [
      {
        nom: "Archimagos",
        cout: 0,
        profil: {
          M: 6,
          CC: 5,
          CT: 6,
          F: 6,
          E: 6,
          PV: 6,
          I: 4,
          A: 4,
          Cd: 9,
          Sf: 10,
          Vo: 9,
          Int: 10,
          Sv: "2+",
          Inv: "4+",
        },
        regles: [
          "Insensible à la Douleur (5+)",
          "Contrôleur (2)",
          "Guerrier-artisan (4)",
          "Protocoles de Tir (2)",
        ],
        type: "Infanterie (État-major)",
      },
    ],
    options: [
      optionTechnoArcane(),
      {
        type: "case",
        id: "faisceau",
        libelle: "Faisceau de conversion",
        cout: 30,
        ajoute: "Faisceau de conversion (< 15 pas)",
      },
      {
        type: "case",
        id: "plasma-phase",
        libelle: "Fusil à plasma phasé",
        cout: 15,
        ajoute: "Fusil à plasma phasé (Mechanicum)",
      },
      {
        type: "case",
        id: "irradieur",
        libelle: "Irradieur",
        cout: 20,
        ajoute: "Irradieur (Mechanicum)",
      },
    ],
  },
  {
    id: "mech-archimagos-abeant",
    nom: "Archimagos sur Abéant",
    faction: "mechanicum",
    categorie: "Quartier Général",
    cout: 150,
    composition: "1 Archimagos sur Abéant",
    traits: ["[Allégeance]", "[Mechanicum]", "Cybertheurge"],
    equipement: ["Grenades Frag"],
    variantes: [
      {
        nom: "Archimagos sur Abéant",
        cout: 0,
        profil: {
          M: 6,
          CC: 5,
          CT: 6,
          F: 6,
          E: 7,
          PV: 3,
          I: 3,
          A: 4,
          Cd: 10,
          Sf: 10,
          Vo: 9,
          Int: 10,
          Sv: "2+",
          Inv: "4+",
        },
        regles: [
          "Massif (3)",
          "Insensible à la Douleur (5+)",
          "Contrôleur (2)",
          "Guerrier-artisan (4)",
          "Protocoles de Tir (2)",
          "Trône de Commandement",
        ],
        type: "Infanterie (État-major, Antigrav)",
      },
    ],
    options: [
      optionTechnoArcane(),
      {
        type: "case",
        id: "faisceau",
        libelle: "Faisceau de conversion",
        cout: 30,
        ajoute: "Faisceau de conversion (< 15 pas)",
      },
      {
        type: "case",
        id: "plasma-phase",
        libelle: "Fusil à plasma phasé",
        cout: 15,
        ajoute: "Fusil à plasma phasé (Mechanicum)",
      },
      {
        type: "case",
        id: "irradieur",
        libelle: "Irradieur",
        cout: 20,
        ajoute: "Irradieur (Mechanicum)",
      },
    ],
  },
  {
    id: "mech-archimagos-scoria",
    nom: "Archimagos Scoria",
    faction: "mechanicum",
    categorie: "Quartier Général",
    cout: 410,
    composition: "1 Scoria",
    traits: ["Renégat", "Archimandrite", "Cybertheurge", "Hétérodoxe"],
    notes:
      "Les détails concernant la vie d'Anacharis Scoria ont disparu, mais des documents fragmentaires indiquent qu'il était un Magos Dominus au service de Xana quelque trente ans avant l'Hérésie d'Horus. On pense qu'il reçut le titre de Magister Vodien, maître d'archive de la doctrine religieuse sur son monde mystérieux, mais quelque temps après il fut renversé, jusqu'à ce qu'une opération secrète des Loyalistes, l'Incursion de Xana, tourne au désastre, ce qui lui permit de lancer un coup d'État pour éliminer le Synode de Xana. Il en ressortit plus puissant que jamais. Archimagos du Domaine Xanain — malgré son apparence monstrueuse, Scoria comptait parmi les meilleurs cybertheurges originaires des mondes-forges du nord-ouest galactique : il a des Rites Cybertheurgiques précis, et connaît les Rites Cybertheurgiques suivants : Réacteurs Suralimentés, Purge de Cogitateur, Infection d'Anticode.",
    equipement: [
      "Serres scoriennes",
      "Le Sceptre Vodien",
      "Pistolet archéotech jumelé",
      "Pulseur à photons",
    ],
    variantes: [
      {
        nom: "Scoria",
        cout: 0,
        profil: {
          M: 9,
          CC: 6,
          CT: 6,
          F: 7,
          E: 6,
          PV: 5,
          I: 5,
          A: 3,
          Cd: 10,
          Sf: 10,
          Vo: 10,
          Int: 10,
          Sv: "2+",
          Inv: "4+",
        },
        regles: [
          "Insensible à la Douleur (5+)",
          "Guerrier Éternel (1)",
          "Guerrier-artisan (4)",
          "Peur (2)",
          "Impact (A)",
          "Theurgika Maxima (voir page 45)",
          "Archimagos du Domaine Xanain",
        ],
        type: "Marcheur (Champion, Unique)",
      },
    ],
    options: [],
  },
  {
    id: "mech-archimagos-draykavac",
    nom: "Archimagos Draykavac",
    faction: "mechanicum",
    categorie: "Quartier Général",
    cout: 200,
    composition: "1 Draykavac",
    notes:
      "Cette Figurine peut être remplacée par 1 Draykavac sur Abéant pour +20 Points. S'il en vint à être un des membres les plus honnis du Mechanicum Noir, Draykavac était globalement inconnu avant que la guerre civile provoquée par la trahison du Maître de Guerre ne déchire l'Imperium.",
    traits: ["Renégat", "Archimandrite", "Cybertheurge", "Hétérodoxe"],
    equipement: [
      "Grenades Frag",
      "Lame de parangon",
      "Fusil à gravitons",
      "Contrôleur de cortex",
      "Panoplie machinator",
    ],
    variantes: [
      {
        nom: "Draykavac",
        cout: 0,
        profils: [
          {
            nom: "Draykavac",
            profil: {
              M: 6,
              CC: 5,
              CT: 6,
              F: 6,
              E: 6,
              PV: 4,
              I: 4,
              A: 4,
              Cd: 10,
              Sf: 9,
              Vo: 9,
              Int: 12,
              Sv: "2+",
              Inv: "4+",
            },
          },
          {
            nom: "Draykavac sur Abéant",
            profil: {
              M: 6,
              CC: 5,
              CT: 6,
              F: 6,
              E: 7,
              PV: 6,
              I: 3,
              A: 4,
              Cd: 10,
              Sf: 9,
              Vo: 9,
              Int: 12,
              Sv: "2+",
              Inv: "4+",
            },
          },
        ],
        regles: [
          "Insensible à la Douleur (5+)",
          "Contrôleur (2)",
          "Guerrier-artisan (4)",
          "Maître des Machines",
          "Protocoles de Tir (2)",
          "Assaut au Liquifractor",
          "Héritage de Ruse",
        ],
        type: "Draykavac : Infanterie (État-major, Unique) · Draykavac sur Abéant : Infanterie (État-major, Unique, Antigrav)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "arme-surcout",
        libelle:
          "Doit être doté d'une des options suivantes sans surcoût en Points",
        remplace: "Fusil à gravitons",
        choix: [
          { nom: "Fusil à gravitons", cout: 0 },
          { nom: "Canon rotor", cout: 0 },
          { nom: "Faisceau de conversion (< 15 pas)", cout: 0 },
          { nom: "Fuseur", cout: 0 },
        ],
      },
    ],
  },

  /* ---------- État-major ---------- */
  {
    id: "mech-magos",
    nom: "Magos",
    faction: "mechanicum",
    categorie: "État-major",
    cout: 100,
    composition: "1 Magos",
    traits: ["[Allégeance]", "[Mechanicum]", "Cybertheurge"],
    equipement: ["Grenades Frag"],
    variantes: [
      {
        nom: "Magos",
        cout: 0,
        profil: {
          M: 6,
          CC: 4,
          CT: 5,
          F: 5,
          E: 5,
          PV: 3,
          I: 3,
          A: 3,
          Cd: 8,
          Sf: 8,
          Vo: 8,
          Int: 9,
          Sv: "2+",
          Inv: "5+",
        },
        regles: [
          "Insensible à la Douleur (5+)",
          "Contrôleur (2)",
          "Maître des Machines",
          "Protocoles de Tir (2)",
        ],
        type: "Infanterie (État-major)",
      },
    ],
    options: [
      optionTechnoArcane(),
      {
        type: "case",
        id: "faisceau",
        libelle: "Faisceau de conversion",
        cout: 30,
        ajoute: "Faisceau de conversion (< 15 pas)",
      },
      {
        type: "case",
        id: "plasma-phase",
        libelle: "Fusil à plasma phasé",
        cout: 15,
        ajoute: "Fusil à plasma phasé (Mechanicum)",
      },
      {
        type: "case",
        id: "irradieur",
        libelle: "Irradieur",
        cout: 20,
        ajoute: "Irradieur (Mechanicum)",
      },
    ],
  },
  {
    id: "mech-magos-abeant",
    nom: "Magos sur Abéant",
    faction: "mechanicum",
    categorie: "État-major",
    cout: 130,
    composition: "1 Magos sur Abéant",
    traits: ["[Allégeance]", "[Mechanicum]", "Cybertheurge"],
    equipement: ["Grenades Frag"],
    variantes: [
      {
        nom: "Magos sur Abéant",
        cout: 0,
        profil: {
          M: 6,
          CC: 4,
          CT: 5,
          F: 5,
          E: 6,
          PV: 4,
          I: 2,
          A: 3,
          Cd: 9,
          Sf: 9,
          Vo: 8,
          Int: 9,
          Sv: "2+",
          Inv: "5+",
        },
        regles: [
          "Massif (7)",
          "Insensible à la Douleur (5+)",
          "Avance Implacable",
          "Contrôleur (2)",
          "Guerrier-artisan (4)",
          "Maître des Machines",
          "Protocoles de Tir (2)",
          "Trône de Commandement",
        ],
        type: "Infanterie (État-major, Antigrav, Lourd)",
      },
    ],
    options: [
      optionTechnoArcane(),
      {
        type: "case",
        id: "faisceau",
        libelle: "Faisceau de conversion",
        cout: 30,
        ajoute: "Faisceau de conversion (< 15 pas)",
      },
      {
        type: "case",
        id: "plasma-phase",
        libelle: "Fusil à plasma phasé",
        cout: 15,
        ajoute: "Fusil à plasma phasé (Mechanicum)",
      },
      {
        type: "case",
        id: "irradieur",
        libelle: "Irradieur",
        cout: 20,
        ajoute: "Irradieur (Mechanicum)",
      },
    ],
  },
  {
    id: "mech-arcuitor-magisterium",
    nom: "Arcuitor Magisterium",
    faction: "mechanicum",
    categorie: "État-major",
    cout: 115,
    composition: "1 Arcuitor",
    traits: ["[Allégeance]", "Malagra", "Cybertheurge"],
    equipement: ["Grenades Frag"],
    variantes: [
      {
        nom: "Arcuitor",
        cout: 0,
        profil: {
          M: 6,
          CC: 6,
          CT: 5,
          F: 5,
          E: 5,
          PV: 4,
          I: 4,
          A: 4,
          Cd: 9,
          Sf: 9,
          Vo: 8,
          Int: 9,
          Sv: "2+",
          Inv: "5+",
        },
        regles: [
          "Insensible à la Douleur (5+)",
          "Maître des Machines",
          "Guerrier-artisan (2)",
          "Protocoles de Tir (2)",
          "Infiltration (9)",
        ],
        type: "Infanterie (État-major)",
      },
    ],
    options: [
      {
        type: "case",
        id: "pistolet",
        libelle: "Objet de la liste des Pistolets du Mechanicum",
        cout: 10,
        ajoute: "Pistolet à plasma (Mechanicum) — Tir soutenu",
      },
      {
        type: "case",
        id: "arme-melee",
        libelle: "Objet de la liste des Armes de Mêlée du Mechanicum",
        cout: 10,
        ajoute: "Épée énergétique",
      },
    ],
  },

  /* ---------- Suites ---------- */
  {
    id: "mech-gardiens-scyllax",
    nom: "Manipule de Gardiens Scyllax",
    faction: "mechanicum",
    categorie: "Suites",
    cout: 100,
    composition: "4 Scyllax",
    effectif: { base: 4, max: 12, cout: 25 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "[Mechanicum]"],
    equipement: ["Panoplie de combat Scyllax", "Fourneau Rad"],
    variantes: [
      {
        nom: "Scyllax",
        cout: 0,
        profil: {
          M: 6,
          CC: 5,
          CT: 5,
          F: 5,
          E: 5,
          PV: 2,
          I: 3,
          A: 3,
          Cd: 8,
          Sf: 8,
          Vo: 8,
          Int: 8,
          Sv: "2+",
          Inv: "5+",
        },
        regles: [
          "Impact (A)",
          "Explose (6+)",
          "Compact",
          "Boucliers Réfracteurs Phasés",
        ],
        type: "Automate",
      },
    ],
    options: [
      optionTechnoArcane(),
      {
        type: "quantite",
        id: "bolter",
        libelle: "Figurines : bolter à la place du Fourneau Rad",
        parTranche: 1,
        cout: 2,
        ajoute:
          "Bolter (Mechanicum) (à la place du Fourneau Rad, une Figurine)",
      },
    ],
  },
  {
    id: "mech-servo-echidnax",
    nom: "Manipule Servo Echidnax",
    faction: "mechanicum",
    categorie: "Suites",
    cout: 40,
    composition: "4 Echidnax",
    effectif: { base: 4, max: 12, cout: 10 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "[Mechanicum]"],
    equipement: ["Servo-harnais"],
    variantes: [
      {
        nom: "Echidnax",
        cout: 0,
        profil: {
          M: 6,
          CC: 3,
          CT: 3,
          F: 5,
          E: 5,
          PV: 2,
          I: 1,
          A: 2,
          Cd: 7,
          Sf: 12,
          Vo: 4,
          Int: 4,
          Sv: "3+",
          Inv: "5+",
        },
        regles: ["Compact", "Autonomie Limitée", "Automates Réparateurs"],
        type: "Automate",
      },
    ],
    options: [optionTechnoArcane()],
  },

  /* ---------- Elite ---------- */
  {
    id: "mech-combat-domitar",
    nom: "Manipule de Combat Domitar",
    faction: "mechanicum",
    categorie: "Elite",
    cout: 100,
    composition: "1 Domitar",
    effectif: { base: 1, max: 4, cout: 100 },
    equipementLibelle: "Équipement",
    traits: ["[Allégeance]", "Cybernetica"],
    equipement: [
      "Lance-missiles Cyclone (Mechanicum) — Frag",
      "Marteaux à gravitons",
      "Poings de Domitar",
    ],
    variantes: [
      {
        nom: "Domitar",
        cout: 0,
        profil: {
          M: 7,
          CC: 4,
          CT: 7,
          F: 7,
          E: 7,
          PV: 4,
          I: 3,
          A: 3,
          Cd: 8,
          Sf: 12,
          Vo: 4,
          Int: 4,
          Sv: "2+",
          Inv: "5+",
        },
        regles: [
          "Massif (4)",
          "Avance Implacable",
          "Explose (6+)",
          "Impact (A)",
          "Avant-garde (2)",
          "Vif (2)",
          "Protocoles de Tir (2)",
          "Orage de Feu",
        ],
        type: "Automate",
      },
    ],
    options: [],
  },
  {
    id: "mech-ost-secutors",
    nom: "Ost de Myrmidons Secutors",
    faction: "mechanicum",
    categorie: "Elite",
    cout: 150,
    composition: "1 Seigneur Secutor, 2 Secutors",
    effectif: { base: 3, max: 10, cout: 45 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "Myrmidax"],
    equipement: ["Hache énergétique", "Bolter Maxima jumelé", "Grenades Frag"],
    variantes: [
      {
        nom: "Ost de Myrmidons Secutors",
        cout: 0,
        profils: [
          {
            nom: "Secutor",
            profil: {
              M: 6,
              CC: 4,
              CT: 4,
              F: 5,
              E: 5,
              PV: 4,
              I: 4,
              A: 2,
              Cd: 7,
              Sf: 9,
              Vo: 9,
              Int: 9,
              Sv: "3+",
              Inv: "5+",
            },
          },
          {
            nom: "Seigneur Secutor",
            profil: {
              M: 6,
              CC: 5,
              CT: 5,
              F: 5,
              E: 5,
              PV: 4,
              I: 4,
              A: 2,
              Cd: 9,
              Sf: 9,
              Vo: 9,
              Int: 9,
              Sv: "3+",
              Inv: "5+",
            },
          },
        ],
        regles: [
          "Massif (3)",
          "Avance Implacable",
          "Avant-garde (2)",
          "Méditation Martiale",
        ],
        type: "Secutor : Infanterie · Seigneur Secutor : Infanterie (Champion, Lourd)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "arme-tir",
        libelle: "Remplacer le bolter Maxima jumelé",
        remplace: "Bolter Maxima jumelé",
        choix: [
          { nom: "— Conserver le bolter Maxima jumelé —", cout: 0 },
          { nom: "Fusil à plasma phasé (Mechanicum)", cout: 5 },
          { nom: "Fusil à gravitons (Mechanicum) jumelé", cout: 10 },
        ],
      },
    ],
  },
  {
    id: "mech-ost-destructors",
    nom: "Ost de Myrmidons Destructors",
    faction: "mechanicum",
    categorie: "Elite",
    cout: 150,
    composition: "1 Seigneur Destructor, 2 Destructors",
    effectif: { base: 3, max: 10, cout: 45 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "Myrmidax"],
    equipement: ["Lance-choc (Tir)", "Couleuvrine volkite", "Grenades Frag"],
    variantes: [
      {
        nom: "Ost de Myrmidons Destructors",
        cout: 0,
        profils: [
          {
            nom: "Destructor",
            profil: {
              M: 6,
              CC: 4,
              CT: 5,
              F: 5,
              E: 5,
              PV: 4,
              I: 2,
              A: 2,
              Cd: 9,
              Sf: 9,
              Vo: 9,
              Int: 9,
              Sv: "3+",
              Inv: "5+",
            },
          },
          {
            nom: "Seigneur Destructor",
            profil: {
              M: 6,
              CC: 4,
              CT: 5,
              F: 5,
              E: 5,
              PV: 4,
              I: 2,
              A: 2,
              Cd: 9,
              Sf: 9,
              Vo: 9,
              Int: 9,
              Sv: "3+",
              Inv: "5+",
            },
          },
        ],
        regles: ["Massif (3)", "Avant-garde (3)", "Méditation Martiale"],
        type: "Destructor : Infanterie (Lourd) · Seigneur Destructor : Infanterie (Champion, Lourd)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "arme-tir",
        libelle: "Remplacer la couleuvrine volkite",
        remplace: "Couleuvrine volkite",
        choix: [
          { nom: "— Conserver la couleuvrine volkite —", cout: 0 },
          { nom: "Canon Darkfire", cout: 15 },
          { nom: "Faisceau de conversion (< 15 pas)", cout: 20 },
        ],
      },
    ],
  },
  {
    id: "mech-decimator",
    nom: "Decimator",
    faction: "mechanicum",
    categorie: "Elite",
    cout: 125,
    composition: "1 Decimator",
    traits: ["Renégat", "Cybernetica"],
    equipement: [
      "Deux lance-flammes lourds",
      "Pince Decimator (deux exemplaires)",
    ],
    variantes: [
      {
        nom: "Decimator",
        cout: 0,
        profil: {
          M: 7,
          CC: 4,
          CT: 7,
          F: 7,
          E: 7,
          PV: 5,
          I: 3,
          A: 4,
          Cd: 8,
          Sf: 12,
          Vo: 7,
          Int: 4,
          Sv: "2+",
          Inv: "5+",
        },
        regles: [
          "Massif (7)",
          "Avance Implacable",
          "Explose (6+)",
          "Impact (A)",
          "Avant-garde (2)",
          "Protocoles de Tir (2)",
        ],
        type: "Automate (Maléfique)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "arme-speciale",
        libelle:
          "Peut être dotée d'un des choix suivants ; si une option est choisie, la Figurine perd un lance-flammes lourd et une pince Decimator",
        choix: [
          { nom: "— Aucune —", cout: 0 },
          { nom: "Canon boucher", cout: 20 },
          { nom: "Pétard brûlemânes", cout: 15 },
        ],
      },
    ],
  },

  /* ---------- Assaut Lourd ---------- */
  {
    id: "mech-castellax-destructor",
    nom: "Manipule Castellax Destructor",
    faction: "mechanicum",
    categorie: "Assaut Lourd",
    cout: 100,
    composition: "2 Castellax",
    effectif: { base: 2, max: 6, cout: 50 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "Cybernetica"],
    equipement: ["Deux bolters", "Canon à bolts Mauler", "Chargeurs-choc"],
    variantes: [
      {
        nom: "Castellax",
        cout: 0,
        profil: {
          M: 6,
          CC: 3,
          CT: 6,
          F: 6,
          E: 6,
          PV: 4,
          I: 3,
          A: 3,
          Cd: 7,
          Sf: 12,
          Vo: 4,
          Int: 4,
          Sv: "2+",
          Inv: "4+",
        },
        regles: [
          "Massif (4)",
          "Avance Implacable",
          "Explose (6+)",
          "Protocoles de Tir (3)",
          "Brise-blindage (4+)",
          "Boucliers Réfracteurs Phasés",
        ],
        type: "Automate",
      },
    ],
    options: [
      {
        type: "case",
        id: "canon-darkfire",
        libelle:
          "Toute Figurine : échanger ses bolts Mauler contre un canon Darkfire",
        cout: 15,
        ajoute: "Canon Darkfire (à la place du canon à bolts Mauler)",
      },
      {
        type: "case",
        id: "multi-fuseur",
        libelle:
          "Toute Figurine : échanger ses bolts Mauler contre un multi-fuseur",
        cout: 10,
        ajoute:
          "Multi-fuseur (Mechanicum) (à la place du canon à bolts Mauler)",
      },
    ],
  },
  {
    id: "mech-cohorte-ursarax",
    nom: "Cohorte d'Ursarax",
    faction: "mechanicum",
    categorie: "Assaut Lourd",
    cout: 150,
    composition: "6 Ursarax",
    effectif: { base: 6, max: 9, cout: 25 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "Lacrymaerta"],
    equipement: [
      "Paire de griffes d'Ursarax",
      "Incinérateur volkite",
      "Grenades Frag",
    ],
    variantes: [
      {
        nom: "Cohorte d'Ursarax",
        cout: 0,
        profils: [
          {
            nom: "Ursarax",
            profil: {
              M: 10,
              CC: 4,
              CT: 4,
              F: 4,
              E: 5,
              PV: 2,
              I: 3,
              A: 2,
              Cd: 7,
              Sf: 12,
              Vo: 6,
              Int: 4,
              Sv: "3+",
              Inv: "6+",
            },
          },
          {
            nom: "Ursarax Alpha",
            profil: {
              M: 10,
              CC: 4,
              CT: 4,
              F: 4,
              E: 5,
              PV: 2,
              I: 3,
              A: 2,
              Cd: 8,
              Sf: 12,
              Vo: 6,
              Int: 4,
              Sv: "3+",
              Inv: "6+",
            },
          },
        ],
        regles: ["Massif (3)", "Avant-garde (3)", "Frappe en Profondeur"],
        type: "Ursarax : Infanterie · Ursarax Alpha : Infanterie (Sergent, Antigrav)",
      },
    ],
    options: [
      {
        type: "case",
        id: "promotion",
        libelle: "Une Figurine par Unité peut être promue Ursarax Alpha",
        cout: 10,
        ajoute: "Promotion Ursarax Alpha",
      },
    ],
  },
  {
    id: "mech-massacreur-de-sang",
    nom: "Massacreur de Sang",
    faction: "mechanicum",
    categorie: "Assaut Lourd",
    cout: 100,
    composition: "2 Massacreurs de Sang",
    effectif: { base: 2, max: 4, cout: 50 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["Renégat", "Cybernetica"],
    equipement: ["Lames de Massacreur"],
    variantes: [
      {
        nom: "Massacreur de Sang",
        cout: 0,
        profil: {
          M: 9,
          CC: 3,
          CT: 3,
          F: 6,
          E: 6,
          PV: 4,
          I: 4,
          A: 4,
          Cd: 8,
          Sf: 12,
          Vo: 4,
          Int: 4,
          Sv: "3+",
          Inv: "6+",
        },
        regles: [
          "Massif (5)",
          "Mouvement à Couvert",
          "Impact (A)",
          "Explose (6+)",
          "Avant-garde (1)",
        ],
        type: "Automate (Maléfique)",
      },
    ],
    options: [
      {
        type: "case",
        id: "harpon",
        libelle: "Toute Figurine : harpon empaleur",
        cout: 10,
        ajoute: "Harpon empaleur",
      },
    ],
  },

  /* ---------- Troupes ---------- */
  {
    id: "mech-technopretre",
    nom: "Technoprêtre",
    faction: "mechanicum",
    categorie: "Troupes",
    cout: 30,
    composition: "1 Technoprêtre",
    effectif: { base: 1, max: 10, cout: 30 },
    equipementLibelle: "Équipement",
    traits: ["[Allégeance]", "[Mechanicum]", "Cybertheurge"],
    equipement: ["Grenades Frag"],
    variantes: [
      {
        nom: "Technoprêtre",
        cout: 0,
        profil: {
          M: 6,
          CC: 4,
          CT: 4,
          F: 4,
          E: 4,
          PV: 1,
          I: 3,
          A: 2,
          Cd: 7,
          Sf: 8,
          Vo: 8,
          Int: 7,
          Sv: "3+",
          Inv: "—",
        },
        regles: [
          "Insensible à la Douleur (6+)",
          "Contrôleur (1)",
          "Maître des Machines",
          "Protocoles de Tir (2)",
        ],
        type: "Infanterie (Sergent, Spécialiste)",
      },
    ],
    options: [
      optionTechnoArcane(),
      {
        type: "case",
        id: "pistolet",
        libelle: "Objet de la liste des Pistolets du Mechanicum",
        cout: 10,
        ajoute: "Pistolet à plasma (Mechanicum) — Tir soutenu",
      },
      {
        type: "case",
        id: "arme-tir",
        libelle: "Objet de la liste des Armes de Tir du Mechanicum",
        cout: 15,
        ajoute: "Fusil à plasma phasé (Mechanicum)",
      },
    ],
  },

  /* ---------- Appui ---------- */
  {
    id: "mech-cenacle-technoserfs",
    nom: "Cénacle de Technoserfs",
    faction: "mechanicum",
    categorie: "Appui",
    cout: 100,
    composition: "10 Technoserfs",
    effectif: { base: 10, max: 30, cout: 10 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "Lacrymaerta"],
    equipement: ["Mousquet laser"],
    variantes: [
      {
        nom: "Technoserf",
        cout: 0,
        profil: {
          M: 5,
          CC: 2,
          CT: 3,
          F: 3,
          E: 3,
          PV: 1,
          I: 2,
          A: 1,
          Cd: 4,
          Sf: 12,
          Vo: 4,
          Int: 4,
          Sv: "6+",
          Inv: "—",
        },
        regles: [
          "Sacrifiable (2)",
          "Rite de la Pensée Pure",
          "Insensible à la Douleur (6+)",
        ],
        type: "Infanterie",
      },
    ],
    options: [],
  },
  {
    id: "mech-cohorte-thallax",
    nom: "Cohorte de Thallax",
    faction: "mechanicum",
    categorie: "Appui",
    cout: 120,
    composition: "3 Thallax, 1 Prétorien Thallax",
    effectif: { base: 4, max: 10, cout: 20 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "Reductor"],
    equipement: ["Fusil à foudre", "Grenades Frag"],
    variantes: [
      {
        nom: "Cohorte de Thallax",
        cout: 0,
        profils: [
          {
            nom: "Thallax",
            profil: {
              M: 10,
              CC: 4,
              CT: 4,
              F: 4,
              E: 5,
              PV: 1,
              I: 2,
              A: 1,
              Cd: 4,
              Sf: 12,
              Vo: 5,
              Int: 5,
              Sv: "4+",
              Inv: "—",
            },
          },
          {
            nom: "Prétorien Thallax",
            profil: {
              M: 10,
              CC: 4,
              CT: 4,
              F: 4,
              E: 5,
              PV: 1,
              I: 2,
              A: 1,
              Cd: 5,
              Sf: 12,
              Vo: 5,
              Int: 5,
              Sv: "4+",
              Inv: "—",
            },
          },
        ],
        regles: ["Massif (3)", "Égide de Souffrance", "Frappe en Profondeur"],
        type: "Thallax : Infanterie (Antigrav) · Prétorien Thallax : Infanterie (Sergent, Antigrav)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "arme-tir",
        libelle: "Toute Figurine : remplacer son fusil à foudre",
        remplace: "Fusil à foudre",
        choix: [
          { nom: "— Conserver le fusil à foudre —", cout: 0 },
          { nom: "Pistolet à plasma (Mechanicum) — Tir soutenu", cout: 0 },
          { nom: "Multi-fuseur (Mechanicum)", cout: 15 },
          { nom: "Fusil à plasma phasé (Mechanicum)", cout: 15 },
        ],
      },
      {
        type: "case",
        id: "promotion",
        libelle: "Un Thallax peut être promu Prétorien Thallax",
        cout: 5,
        ajoute: "Promotion Prétorien Thallax",
      },
    ],
  },
  {
    id: "mech-combat-castellax",
    nom: "Manipule de Combat Castellax",
    faction: "mechanicum",
    categorie: "Appui",
    cout: 100,
    composition: "2 Castellax",
    effectif: { base: 2, max: 10, cout: 50 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "Cybernetica"],
    equipement: ["Deux bolters", "Canon à bolts Mauler", "Chargeurs-choc"],
    variantes: [
      {
        nom: "Castellax",
        cout: 0,
        profil: {
          M: 6,
          CC: 3,
          CT: 6,
          F: 6,
          E: 6,
          PV: 4,
          I: 3,
          A: 3,
          Cd: 7,
          Sf: 12,
          Vo: 4,
          Int: 4,
          Sv: "2+",
          Inv: "4+",
        },
        regles: [
          "Massif (4)",
          "Avance Implacable",
          "Explose (6+)",
          "Protocoles de Tir (3)",
          "Brise-blindage (4+)",
          "Boucliers Réfracteurs Phasés",
        ],
        type: "Automate",
      },
    ],
    options: [
      {
        type: "case",
        id: "lames",
        libelle:
          "Toute Figurine : échanger ses chargeurs-choc contre une paire de lames énergétiques",
        cout: 0,
        ajoute: "Épée énergétique (paire, à la place des chargeurs-choc)",
      },
      {
        type: "quantite",
        id: "lance-flammes",
        libelle:
          "Figurines : bolter par un lance-flammes (jusqu'à deux par Figurine)",
        cout: 5,
        parTranche: 1,
        parTrancheMax: 2,
        ajoute: "Lance-flammes (Mechanicum) (à la place d'un bolter)",
      },
    ],
  },

  /* ---------- Engin de Guerre ---------- */
  {
    id: "mech-siege-thanatar",
    nom: "Manipule de Siège Thanatar",
    faction: "mechanicum",
    categorie: "Engins de Guerre",
    cout: 225,
    composition: "1 Thanatar",
    equipementLibelle: "Équipement",
    traits: ["[Allégeance]", "Cybernetica"],
    equipement: [
      "Chargeurs-choc (deux exemplaires)",
      "Canon à bolts Mauler jumelé",
    ],
    variantes: [
      {
        nom: "Thanatar",
        cout: 0,
        profil: {
          M: 6,
          CC: 3,
          CT: 4,
          F: 8,
          E: 8,
          PV: 10,
          I: 3,
          A: 3,
          Cd: 7,
          Sf: 12,
          Vo: 4,
          Int: 4,
          Sv: "2+",
          Inv: "—",
        },
        regles: [
          "Massif (9)",
          "Avance Implacable",
          "Explose (6+)",
          "Unité d'Appui (1)",
          "Protocoles de Tir (2)",
          "Orage de Feu",
        ],
        type: "Automate (Lourd)",
      },
    ],
    options: [
      {
        type: "choix",
        id: "configuration",
        libelle: "Doit être dotée d'une des deux options suivantes",
        choix: [
          { nom: "Configuration Cavas : mortier à plasma", cout: 0 },
          {
            nom: "Configuration Calix : laser lourd Sollex et bélier à gravitons",
            cout: 20,
          },
        ],
      },
    ],
  },
  {
    id: "mech-armigere-moirax",
    nom: "Armigère Moirax",
    faction: "mechanicum",
    categorie: "Engins de Guerre",
    cout: 165,
    composition: "1 Armigère Moirax",
    traits: ["[Allégeance]", "[Mechanicum]"],
    equipement: ["Fourneau Rad"],
    variantes: [
      {
        nom: "Armigère Moirax",
        cout: 0,
        profil: {
          M: 8,
          CC: 4,
          CT: 4,
          F: 7,
          E: 7,
          PV: 7,
          I: 3,
          A: 3,
          Cd: 12,
          Sf: 10,
          Vo: 5,
          Int: 5,
          Sv: "3+",
          Inv: "5+",
        },
        regles: [
          "Massif (8)",
          "Explose (5+)",
          "Mouvement à Couvert",
          "Avance Implacable",
        ],
        type: "Marcheur",
      },
    ],
    options: [
      optionTechnoArcane(),
      {
        type: "case",
        id: "pinces-gyges",
        libelle: "Deux pinces de siège Gyges et un irradieur",
        cout: 0,
        ajoute: "Deux pinces de siège Gyges et un irradieur",
      },
      {
        type: "case",
        id: "vouglaire",
        libelle: "Vouglaire volkite",
        cout: 5,
        ajoute: "Vouglaire volkite",
      },
      {
        type: "case",
        id: "mousquet-foudre",
        libelle: "Mousquet à foudre (Mechanicum)",
        cout: 15,
        ajoute: "Mousquet à foudre (Mechanicum)",
      },
      {
        type: "case",
        id: "pulsar-gravitons",
        libelle: "Pulsar à gravitons (Mechanicum)",
        cout: 20,
        ajoute: "Pulsar à gravitons (Mechanicum)",
      },
      {
        type: "case",
        id: "faisceau-moirax",
        libelle:
          "Faisceau de conversion Moirax et une paire de pinces de siège Gyges et deux irradieurs",
        cout: 10,
        ajoute:
          "Faisceau de conversion Moirax (< 15 pas), paire de pinces de siège Gyges et deux irradieurs",
      },
    ],
  },

  /* ---------- Transports Lourds ---------- */
  {
    id: "mech-triaros",
    nom: "Convoyeur Blindé Triaros",
    faction: "mechanicum",
    categorie: "Transports Lourds",
    cout: 200,
    composition: "1 Triaros",
    traits: ["[Allégeance]", "[Mechanicum]"],
    notes: "Cette Figurine a un Point d'Accès sur chaque Flanc.",
    equipement: [
      "Arquebuse volkite d'Axe Central (deux exemplaires)",
      "Canon à bolts Mauler jumelé sur Pivot",
      "Bouclier répulsif",
      "Projecteurs",
    ],
    variantes: [
      {
        nom: "Triaros",
        cout: 0,
        profilVehicule: {
          M: 10,
          CT: 4,
          avant: 14,
          flanc: 12,
          arriere: 12,
          PC: 7,
          transport: 22,
        },
        regles: ["Autoréparation (4+)", "Bélier-choc"],
        type: "Véhicule (Transport)",
      },
    ],
    options: [
      {
        type: "case",
        id: "missile",
        libelle: "Deux missiles traqueurs de Coque (Avant)",
        cout: 10,
        ajoute:
          "Missile traqueur (Mechanicum) de Coque (Avant) (deux exemplaires)",
      },
    ],
  },

  /* ---------- Reco ---------- */
  {
    id: "mech-attaque-vorax",
    nom: "Manipule d'Attaque Vorax",
    faction: "mechanicum",
    categorie: "Reco",
    cout: 90,
    composition: "2 Vorax",
    effectif: { base: 2, max: 8, cout: 45 },
    equipementLibelle: "Équipement (chaque figurine)",
    traits: ["[Allégeance]", "Cybernetica"],
    equipement: [
      "Épée énergétique (deux exemplaires)",
      "Canon rotor jumelé",
      "Fusil à foudre",
    ],
    variantes: [
      {
        nom: "Vorax",
        cout: 0,
        profil: {
          M: 10,
          CC: 3,
          CT: 3,
          F: 5,
          E: 5,
          PV: 1,
          I: 4,
          A: 4,
          Cd: 8,
          Sf: 12,
          Vo: 4,
          Int: 4,
          Sv: "3+",
          Inv: "6+",
        },
        regles: [
          "Massif (3)",
          "Avance Implacable",
          "Vif (2)",
          "Impact (A)",
          "Explose (6+)",
          "Protocoles de Tir (2)",
          "Orage de Feu",
          "Boucliers Réfracteurs Phasés",
        ],
        type: "Automate",
      },
    ],
    options: [
      {
        type: "case",
        id: "irradieur",
        libelle: "Une Figurine sur deux : fusil à foudre → irradieur",
        cout: 20,
        ajoute: "Irradieur (Mechanicum) (à la place du fusil à foudre)",
      },
    ],
  },

  /* ---------- Attaque Rapide ---------- */
  {
    id: "mech-stratos-vultarax",
    nom: "Escadron de Stratos Vultarax",
    faction: "mechanicum",
    categorie: "Attaque Rapide",
    cout: 100,
    composition: "1 Vultarax",
    equipementLibelle: "Équipement",
    traits: ["[Allégeance]", "Cybernetica"],
    equipement: [
      "Électro-éclateur",
      "Lance-missiles Vultarax — Explosion aérienne",
      "Serres dendrites",
    ],
    variantes: [
      {
        nom: "Vultarax",
        cout: 0,
        profil: {
          M: 12,
          CC: 3,
          CT: 3,
          F: 5,
          E: 6,
          PV: 1,
          I: 6,
          A: 3,
          Cd: 7,
          Sf: 12,
          Vo: 4,
          Int: 4,
          Sv: "2+",
          Inv: "5+",
        },
        regles: [
          "Massif (6)",
          "Avance Implacable",
          "Explose (6+)",
          "Protocoles de Tir (2)",
          "Orage de Feu",
        ],
        type: "Automate (Antigrav)",
      },
    ],
    options: [],
  },

  /* ---------- Blindés ---------- */
  {
    id: "mech-karacnos",
    nom: "Char d'Assaut Karacnos",
    faction: "mechanicum",
    categorie: "Blindés",
    cout: 235,
    composition: "1 Karacnos",
    traits: ["[Allégeance]", "Macrotek"],
    equipement: [
      "Batterie de mortiers Karacnos de Coque (Avant)",
      "Mousquet à foudre Latéral (deux exemplaires)",
      "Bouclier répulsif",
      "Projecteurs",
    ],
    variantes: [
      {
        nom: "Karacnos",
        cout: 0,
        profilVehicule: {
          M: 10,
          CT: 4,
          avant: 14,
          flanc: 12,
          arriere: 12,
          PC: 7,
          transport: "—",
        },
        regles: ["Autoréparation (4+)", "Bélier-choc", "Explose (6+)"],
        type: "Véhicule",
      },
    ],
    options: [
      {
        type: "case",
        id: "missile",
        libelle: "Deux missiles traqueurs de Coque (Avant)",
        cout: 10,
        ajoute:
          "Missile traqueur (Mechanicum) de Coque (Avant) (deux exemplaires)",
      },
    ],
  },
  {
    id: "mech-krios",
    nom: "Char de Combat Krios",
    faction: "mechanicum",
    categorie: "Blindés",
    cout: 135,
    composition: "1 Krios",
    traits: ["[Allégeance]", "Macrotek"],
    equipement: ["Canon à foudre d'Axe Central"],
    variantes: [
      {
        nom: "Krios",
        cout: 0,
        profilVehicule: {
          M: 14,
          CT: 4,
          avant: 13,
          flanc: 12,
          arriere: 10,
          PC: 5,
          transport: "—",
        },
        regles: ["Autoréparation (4+)"],
        type: "Véhicule (Rapide)",
      },
    ],
    options: [
      {
        type: "case",
        id: "missile",
        libelle: "Deux missiles traqueurs de Coque (Avant)",
        cout: 10,
        ajoute:
          "Missile traqueur (Mechanicum) de Coque (Avant) (deux exemplaires)",
      },
      {
        type: "case",
        id: "arquebuses",
        libelle: "Arquebuse volkite Latérale (deux exemplaires)",
        cout: 15,
        ajoute: "Arquebuse volkite Latérale (deux exemplaires)",
      },
    ],
  },
  {
    id: "mech-krios-venator",
    nom: "Krios Venator",
    faction: "mechanicum",
    categorie: "Blindés",
    cout: 160,
    composition: "1 Krios Venator",
    traits: ["[Allégeance]", "Macrotek"],
    equipement: ["Pulsar plombeur d'Axe Central"],
    variantes: [
      {
        nom: "Krios Venator",
        cout: 0,
        profilVehicule: {
          M: 14,
          CT: 4,
          avant: 13,
          flanc: 12,
          arriere: 10,
          PC: 5,
          transport: "—",
        },
        regles: ["Autoréparation (4+)"],
        type: "Véhicule (Rapide)",
      },
    ],
    options: [
      {
        type: "case",
        id: "missile",
        libelle: "Deux missiles traqueurs de Coque (Avant)",
        cout: 10,
        ajoute:
          "Missile traqueur (Mechanicum) de Coque (Avant) (deux exemplaires)",
      },
      {
        type: "case",
        id: "arquebuses",
        libelle: "Arquebuse volkite Latérale (deux exemplaires)",
        cout: 15,
        ajoute: "Arquebuse volkite Latérale (deux exemplaires)",
      },
    ],
  },

  /* ---------- Seigneurs des Batailles ---------- */
  {
    id: "mech-scorpion-airain",
    nom: "Scorpion d'Airain",
    faction: "mechanicum",
    categorie: "Seigneurs des Batailles",
    cout: 600,
    composition: "1 Scorpion d'Airain",
    traits: ["Renégat", "Archimandrite"],
    equipement: [
      "Canon Scorpion",
      "Canon Despoiler",
      "Canon Hellmaw jumelé",
      "Pinces Hellcrusher",
    ],
    variantes: [
      {
        nom: "Scorpion d'Airain",
        cout: 0,
        profil: {
          M: 9,
          CC: 4,
          CT: 4,
          F: 10,
          E: 8,
          PV: 15,
          I: 4,
          A: 4,
          Cd: 10,
          Sf: 12,
          Vo: 7,
          Int: 4,
          Sv: "2+",
          Inv: "5+",
        },
        regles: [
          "Guerrier Éternel (1)",
          "Avance Implacable",
          "Explose (4+)",
          "Unité d'Appui (1)",
          "Protocoles de Tir (3)",
          "Mouvement à Couvert",
        ],
        type: "Automate (Lourd, Maléfique, Inarrêtable)",
      },
    ],
    options: [],
  },
  {
    id: "mech-kytan",
    nom: "Engin Démon Kytan",
    faction: "mechanicum",
    categorie: "Seigneurs des Batailles",
    cout: 450,
    composition: "1 Kytan",
    traits: ["Renégat", "Archimandrite"],
    equipement: ["Canon gatling Kytan", "Fondoir de massacre"],
    variantes: [
      {
        nom: "Kytan",
        cout: 0,
        profil: {
          M: 12,
          CC: 4,
          CT: 4,
          F: 14,
          E: 4,
          PV: 14,
          I: 4,
          A: 4,
          Cd: 10,
          Sf: 12,
          Vo: 7,
          Int: 4,
          Sv: "2+",
          Inv: "5+",
        },
        regles: [
          "Avance Implacable",
          "Explose (4+)",
          "Unité d'Appui (1)",
          "Vif (2)",
          "Mouvement à Couvert",
        ],
        type: "Automate (Maléfique, Inarrêtable)",
      },
    ],
    options: [],
  },
];
