/* ============================================================
   armes-data.js — Données des tables d'armes (Arsenal)
   Auteur : Jean · Créé : 2026-07-16
   Rôle   : encode les caractéristiques d'armes du livre de règles
   (Tir et Mêlée). Aucune logique de rendu : ces données sont
   consommées par js/armes.js (page armes.html) pour construire les
   tables de l'Arsenal, et par js/unites.js (page unites.html) pour
   afficher les caractéristiques de chaque arme sur la fiche récap
   d'une unité, sous forme de table (correspondance par nom — voir
   trouverArmeDansTexte dans unites.js).
   Doit être chargé avant js/armes.js et js/unites.js.
   Transcription manuelle depuis le livre de règles : en cas de
   doute, c'est toujours le livre qui fait référence.
   ============================================================ */

/* ----------------------------------------------------------
   DONNÉES — ARMES DE TIR
   Colonnes communes : P, PF, FT, PA, D
   Chaque arme = { nom, stats: [P,PF,FT,PA,D], regles, traits }
   ---------------------------------------------------------- */
const ENTETES_TIR = ["P", "PF", "FT", "PA", "D"];

const ARMES_TIR = [
  {
    titre: "Pièce d'Artillerie",
    armes: [
      {
        nom: "Canon Demolisher",
        stats: ["24", "1", "12", "3", "3"],
        regles: 'Explosion (3"), Brèche (5+), Artillerie (D), Sonner (1)',
        traits: "-",
      },
      {
        nom: "Bombarde Morbus — Obus HE",
        stats: ["36", "1", "9", "4", "1"],
        regles:
          'Artillerie (D), Explosion (5"), Barrage (2), Brèche (6+), Fixation (1)',
        traits: "-",
      },
      {
        nom: "Bombarde Morbus — Obus à phosphex*",
        stats: ["24", "1", "5", "3", "1"],
        regles:
          'Explosion (5"), Barrage (1), Panique (3), Empoisonnée (3+), Brèche (5+)',
        traits: "Phosphex",
      },
      {
        nom: "Lanceur quadruple — Frag",
        stats: ["60", "1", "5", "5", "1"],
        regles: 'Lourde (PF), Explosion (5"), Barrage (2)',
        traits: "-",
      },
      {
        nom: "Lanceur quadruple — Brisant",
        stats: ["36", "4", "7", "4", "1"],
        regles: "Lourde (D), Fléau des Blindages",
        traits: "-",
      },
      {
        nom: "Lanceur quadruple — Cartouches à phosphex*",
        stats: ["24", "1", "5", "3", "1"],
        regles:
          'Explosion (3"), Barrage (1), Panique (3), Empoisonnée (3+), Brèche (5+)',
        traits: "Phosphex",
      },
      {
        nom: "Canon de siège Dreadhammer",
        stats: ["24", "1", "12", "3", "3"],
        regles: 'Artillerie (D), Explosion (5"), Brèche (5+), Sonner (1)',
        traits: "-",
      },
      /* --- Arsenal des Solar Auxilia (Liber Auxilia) : les Unités
         Solar Auxilia doivent utiliser cette version des armes ci-
         dessous, quand elle est déjà présente dans l'Arsenal des
         Legiones Astartes. --- */
      {
        nom: "Canon Demolisher (Solar Auxilia)",
        stats: ["24", "1", "12", "3", "3"],
        regles: 'Explosion (3"), Brèche (5+), Artillerie (D), Sonner (1)',
        traits: "-",
      },
      {
        nom: "Lanceur quadruple (Solar Auxilia) — Frag",
        stats: ["60", "1", "5", "5", "1"],
        regles: 'Lourde (PF), Explosion (5"), Barrage (2)',
        traits: "-",
      },
      {
        nom: "Lanceur quadruple (Solar Auxilia) — Brisant",
        stats: ["36", "4", "7", "4", "1"],
        regles: "Lourde (D), Fléau des Blindages",
        traits: "-",
      },
      {
        nom: "Canon Earthshaker",
        stats: ["240", "1", "5", "4", "2"],
        regles:
          'Artillerie (FT), Explosion (5"), Barrage (2), Brèche (6+), Fixation (1)',
        traits: "-",
      },
      {
        nom: "Mortier Medusa",
        stats: ["36", "1", "5", "4", "2"],
        regles:
          'Artillerie (FT), Explosion (5"), Barrage (2), Brèche (5+), Fixation (2)',
        traits: "-",
      },
    ],
  },
  {
    titre: "Pistolet Archéotech",
    armes: [
      {
        nom: "Pistolet archéotech",
        stats: ["12", "1", "6", "4", "2"],
        regles: "Pistolet, Brèche (3+)",
        traits: "Assaut",
      },
      {
        // Arsenal des Solar Auxilia (Liber Auxilia) : les Unités Solar
        // Auxilia doivent utiliser cette version de l'arme.
        nom: "Pistolet archéotech (Solar Auxilia)",
        stats: ["12", "1", "6", "4", "2"],
        regles: "Pistolet, Brèche (3+)",
        traits: "Assaut",
      },
      {
        // Arsenal des Taghmata du Mechanicum (Liber Mechanicum) : les
        // Unités Taghmata doivent utiliser cette version de l'arme.
        nom: "Pistolet archéotech (Mechanicum)",
        stats: ["12", "1", "6", "4", "2"],
        regles: "Pistolet, Brèche (3+)",
        traits: "Assaut",
      },
      {
        nom: "Pistolet archéotech jumelé",
        stats: ["12", "2", "6", "4", "2"],
        regles: "Pistolet, Brèche (3+)",
        traits: "Assaut",
      },
    ],
  },
  {
    titre: "Armes Auto",
    armes: [
      {
        nom: "Fusil à pompe Astartes",
        stats: ["12", "2", "4", "-", "1"],
        regles: "Sonner (0)",
        traits: "Assaut, Auto",
      },
      {
        nom: "Canon rotor",
        stats: ["24", "3", "3", "-", "1"],
        regles: "Lourde (PF), Neutralisation (1)",
        traits: "Auto",
      },
      {
        nom: "Autocanon",
        stats: ["48", "2", "7", "4", "2"],
        regles: "Brèche (6+), Lourde (PF)",
        traits: "Auto",
      },
      {
        nom: "Autocanon Reaper",
        stats: ["36", "2", "6", "4", "2"],
        regles: "Brèche (6+), Lourde (PF)",
        traits: "Auto",
      },
      {
        nom: "Canon d'assaut Kheres",
        stats: ["24", "5", "6", "4", "1"],
        regles: "Brèche (6+), Lourde (PF)",
        traits: "Auto",
      },
      {
        // Arsenal des Blood Angels : option pour Vétérans Tactiques,
        // Escouade d'État-major de Centurion, Terminator Cataphractii,
        // Predator, Dreadnought Leviathan ayant le Trait Blood Angels
        // (voir aussi le Dreadnought Contemptor-Incaendius et les
        // Paladins Écarlates, unités réservées à cette Légion).
        nom: "Canon d'assaut Iliastus — Tir soutenu",
        stats: ["24", "3", "6", "4", "1"],
        regles: "Lourde (PF), Brèche (6+)",
        traits: "Auto",
      },
      {
        nom: "Canon d'assaut Iliastus — Tir maximal",
        stats: ["24", "5", "6", "4", "1"],
        regles: "Lourde (PF), Brèche (6+), Surcharge (1)",
        traits: "Auto",
      },
      {
        nom: "Canon d'assaut Iliastus jumelé — Tir soutenu",
        stats: ["24", "6", "6", "4", "1"],
        regles: "Lourde (PF), Brèche (6+)",
        traits: "Auto",
      },
      {
        nom: "Canon d'assaut Iliastus jumelé — Tir maximal",
        stats: ["24", "8", "6", "4", "1"],
        regles: "Lourde (PF), Brèche (6+), Surcharge (1)",
        traits: "Auto",
      },
      /* Décurion Sagittar (livre d'armée, Legiones Astartes ayant le
         Trait Imperial Fists, voir optionsDecurionLegion dans
         js/unites-data.js) : le canon d'assaut Iliastus sur Pivot
         qu'accorde cette amélioration gagne Antiaérien et Précision
         (6+) en plus de son profil standard — nom distinct de la
         version ci-dessus ("sur Pivot") pour que construireTablesArmes
         (js/unites.js) ne fusionne pas les deux tables de
         caractéristiques sous un même montage. */
      {
        nom: "Canon d'assaut Iliastus sur Pivot — Tir soutenu",
        stats: ["24", "3", "6", "4", "1"],
        regles: "Lourde (PF), Brèche (6+), Antiaérien, Précision (6+)",
        traits: "Auto",
      },
      {
        nom: "Canon d'assaut Iliastus sur Pivot — Tir maximal",
        stats: ["24", "5", "6", "4", "1"],
        regles:
          "Lourde (PF), Brèche (6+), Surcharge (1), Antiaérien, Précision (6+)",
        traits: "Auto",
      },
      {
        nom: "Autocanon Gravis",
        stats: ["48", "3", "8", "4", "2"],
        regles: "Brèche (6+), Lourde (PF)",
        traits: "Auto",
      },
      {
        nom: "Batterie d'autocanons Gravis",
        stats: ["48", "5", "8", "4", "2"],
        regles: "Brèche (6+), Lourde (PF)",
        traits: "Auto",
      },
      {
        nom: "Canon Predator",
        stats: ["48", "3", "8", "4", "2"],
        regles: "Brèche (6+), Lourde (PF)",
        traits: "Auto",
      },
      {
        nom: "Canon rotatif Punisher",
        stats: ["36", "8", "6", "4", "1"],
        regles: "Artillerie (PF), Neutralisation (2)",
        traits: "Auto",
      },
      {
        nom: "Autocanon accélérateur jumelé",
        stats: ["48", "6", "7", "4", "2"],
        regles: "Brèche (6+), Poursuite Rapide, Antiaérien",
        traits: "Auto",
      },
      {
        nom: "Autocanon accélérateur quadritube",
        stats: ["48", "10", "7", "4", "2"],
        regles: "Brèche (6+), Poursuite Rapide, Antiaérien",
        traits: "Auto",
      },
      {
        nom: "Canon accélérateur Fellblade — Obus HE",
        stats: ["100", "1", "8", "3", "2"],
        regles: 'Explosion (5"), Sonner (2)',
        traits: "Auto",
      },
      {
        nom: "Canon accélérateur Fellblade — Obus AE",
        stats: ["100", "1", "12", "2", "3"],
        regles: 'Explosion (3"), Artillerie (D)',
        traits: "Auto",
      },
      {
        nom: "Batterie Skyreaper",
        stats: ["48", "6", "7", "4", "2"],
        regles: "Poursuite Rapide, Antiaérien",
        traits: "Auto",
      },
      {
        nom: "Batterie d'autocanons Anvilus",
        stats: ["48", "6", "8", "4", "2"],
        regles: "Brèche (5+), Poursuite Rapide, Antiaérien",
        traits: "Auto",
      },
      {
        nom: "Autocanon court Anvilus",
        stats: ["24", "3", "7", "4", "2"],
        regles: "Brèche (5+)",
        traits: "Auto",
      },
      {
        nom: "Quadritube Leviathan",
        stats: ["24", "4", "7", "4", "2"],
        regles: "Lourde (PF), Brèche (5+)",
        traits: "Auto",
      },
      {
        nom: "Obusier Kratos — Obus HE",
        stats: ["36", "1", "8", "4", "1"],
        regles: 'Artillerie (D), Explosion (5"), Sonner (1)',
        traits: "Auto",
      },
      {
        nom: "Obusier Kratos — Obus PA",
        stats: ["36", "1", "8", "2", "2"],
        regles: "Artillerie (D), Fléau des Blindages",
        traits: "Auto",
      },
      {
        nom: "Obusier Kratos — Obus Brûleurs*",
        stats: ["24", "1", "9", "2", "3"],
        regles: "Artillerie (D), Fléau des Blindages, Surcharge (1)",
        traits: "Auto",
      },
      /* --- Arsenal des Maisonnées de Chevaliers et des Legios
         Titaniques : armes montées sur Chevaliers Questoris et
         Titans. --- */
      {
        nom: "Mitrailleuse",
        stats: ["36", "3", "4", "6", "1"],
        regles: "-",
        traits: "Auto",
      },
      {
        nom: "Autocanon Icarus jumelé",
        stats: ["48", "4", "7", "4", "2"],
        regles: "Lourde (PF), Brèche (6+), Antiaérien, Poursuite Rapide",
        traits: "Auto",
      },
      {
        nom: "Autocanon Phaëton",
        stats: ["30", "3", "7", "3", "2"],
        regles: "Artillerie (PF), Brèche (5+)",
        traits: "Auto",
      },
      {
        nom: "Obusier à tir rapide",
        stats: ["48", "1", "8", "4", "2"],
        regles: 'Lourde (PF & PA), Explosion (3"), Fixation (1)',
        traits: "Auto",
      },
      {
        nom: "Canon gatling Avenger",
        stats: ["36", "7", "6", "4", "1"],
        regles: "Artillerie (PF), Brèche (6+), Neutralisation (2)",
        traits: "Auto",
      },
      /* --- Arsenal des Solar Auxilia (Liber Auxilia) : les Unités
         Solar Auxilia doivent utiliser cette version des armes ci-
         dessous, quand elle est déjà présente dans l'Arsenal des
         Legiones Astartes. --- */
      {
        nom: "Mitrailleuse (Solar Auxilia)",
        stats: ["36", "3", "4", "6", "1"],
        regles: "-",
        traits: "Auto",
      },
      {
        nom: "Autocanon (Solar Auxilia)",
        stats: ["48", "2", "7", "4", "2"],
        regles: "Brèche (6+), Lourde (PF)",
        traits: "Auto",
      },
      {
        nom: "Autocanon Gravis (Solar Auxilia)",
        stats: ["48", "3", "8", "4", "2"],
        regles: "Brèche (6+), Lourde (PF)",
        traits: "Auto",
      },
      {
        nom: "Obusier",
        stats: ["48", "2", "8", "4", "2"],
        regles: 'Lourde (PA), Explosion (3"), Fixation (1)',
        traits: "Auto",
      },
      {
        nom: "Obusier jumelé",
        stats: ["48", "2", "8", "4", "2"],
        regles: 'Lourde (PA), Explosion (3"), Fixation (1)',
        traits: "Auto",
      },
      {
        nom: "Canon Vanquisher",
        stats: ["72", "1", "10", "2", "3"],
        regles: "Lourde (D), Touche Critique (6+)",
        traits: "Auto",
      },
      {
        nom: "Canon Stormhammer",
        stats: ["72", "1", "9", "3", "3"],
        regles: 'Explosion (5"), Sonner (2)',
        traits: "Auto",
      },
      /* --- Arsenal des Taghmata du Mechanicum (Liber Mechanicum). --- */
      {
        nom: "Canon rotor jumelé",
        stats: ["24", "5", "4", "-", "1"],
        regles: "Lourde (PF), Neutralisation (2)",
        traits: "Auto",
      },
      {
        nom: "Canon gatling Kytan",
        stats: ["36", "12", "6", "4", "1"],
        regles: "Fixation (1), Lacération (6+)",
        traits: "Auto",
      },
      {
        nom: "Canon Scorpion",
        stats: ["30", "15", "5", "4", "1"],
        regles: "Lacération (6+), Fixation (0)",
        traits: "Auto",
      },
      {
        nom: "Canon boucher",
        stats: ["36", "4", "8", "4", "2"],
        regles: "Brèche (6+)",
        traits: "Auto",
      },
    ],
  },
  {
    titre: "Armes à Bolts",
    armes: [
      {
        nom: "Pistolet bolter",
        stats: ["12", "1", "4", "5", "1"],
        regles: "Pistolet",
        traits: "Assaut, Bolts",
      },
      {
        nom: "Bolter",
        stats: ["24", "2", "4", "5", "1"],
        regles: "-",
        traits: "Bolts",
      },
      {
        // Arsenal des Taghmata du Mechanicum (Liber Mechanicum) : les
        // Unités Taghmata doivent utiliser cette version des armes
        // ci-dessous.
        nom: "Pistolet bolter (Mechanicum)",
        stats: ["12", "1", "4", "5", "1"],
        regles: "Pistolet",
        traits: "Assaut, Bolts",
      },
      {
        nom: "Bolter (Mechanicum)",
        stats: ["24", "2", "4", "5", "1"],
        regles: "-",
        traits: "Bolts",
      },
      {
        nom: "Bolter Maxima",
        stats: ["18", "3", "4", "5", "1"],
        regles: "-",
        traits: "Assaut, Bolts",
      },
      {
        nom: "Bolter Maxima jumelé",
        stats: ["18", "5", "4", "5", "1"],
        regles: "Lacération (6+)",
        traits: "Bolts",
      },
      {
        nom: "Canon à bolts Mauler",
        stats: ["24", "4", "6", "4", "1"],
        regles: "Fixation (0), Lacération (5+)",
        traits: "Bolts",
      },
      {
        nom: "Bolter jumelé",
        stats: ["24", "4", "4", "5", "1"],
        regles: "-",
        traits: "Bolts",
      },
      {
        nom: "Combi-bolter",
        stats: ["24", "4", "4", "5", "1"],
        regles: "-",
        traits: "Bolts",
      },
      {
        nom: "Bolter Kraken",
        stats: ["30", "2", "4", "4", "1"],
        regles: "Précision (4+), Sélecteur de Tir",
        traits: "Bolts",
      },
      {
        nom: "Bolter Némésis",
        stats: ["48", "1", "4", "5", "1"],
        regles: "Lourde (FT), Brèche (5+), Fixation (1), Précision (4+)",
        traits: "Bolts",
      },
      {
        nom: "Fusil Némésis",
        stats: ["48", "1", "6", "3", "1"],
        regles: "Lourde (D), Brèche (5+), Fixation (1), Précision (4+)",
        traits: "Bolts",
      },
      {
        nom: "Bolter lourd",
        stats: ["36", "3", "5", "4", "1"],
        regles: "Lourde (PF)",
        traits: "Bolts",
      },
      {
        nom: "Bolter lourd jumelé",
        stats: ["36", "6", "5", "4", "1"],
        regles: "-",
        traits: "Bolts",
      },
      {
        nom: "Canon à bolts Gravis",
        stats: ["36", "6", "5", "4", "2"],
        regles: "Lourde (PF)",
        traits: "Bolts",
      },
      {
        nom: "Batterie de b. lourds Gravis",
        stats: ["36", "8", "5", "4", "1"],
        regles: "Neutralisation (2)",
        traits: "Bolts",
      },
      /* --- Arsenal des Solar Auxilia (Liber Auxilia) : les Unités
         Solar Auxilia doivent utiliser cette version de l'arme. --- */
      {
        nom: "Bolter lourd (Solar Auxilia)",
        stats: ["36", "3", "5", "4", "1"],
        regles: "Lourde (PF)",
        traits: "Bolts",
      },
      {
        nom: "Batterie de bolters lourds Gravis (Solar Auxilia)",
        stats: ["36", "8", "5", "4", "1"],
        regles: "Neutralisation (2)",
        traits: "Bolts",
      },
      {
        nom: "Canon à bolts Avenger jumelé",
        stats: ["36", "10", "6", "3", "1"],
        regles: "Neutralisation (2)",
        traits: "Bolts",
      },
      {
        // Arme de la Keshig d'Or (White Scars).
        nom: "Disperse-bolts",
        stats: ["Souffle", "1", "5", "4", "1"],
        regles: "Souffle, Lacération (6+), Fixation (1)",
        traits: "Bolts, Assaut",
      },
      {
        // Arme de personnage (Rogal Dorn, Primarque des Imperial Fists).
        nom: "La Voix de Terra",
        stats: ["24", "3", "5", "3", "1"],
        regles: "Brèche (5+)",
        traits: "Bolts, Assaut",
      },
      {
        // Arme de personnage (Roboute Guilliman, Primarque des
        // Ultramarines).
        nom: "L'Arbitrator",
        stats: ["18", "2", "6", "3", "1"],
        regles: "Brèche (5+)",
        traits: "Bolts, Assaut",
      },
      {
        // Arme de personnage (Leman Russ, Primarque des Space Wolves).
        nom: "Crache-mépris",
        stats: ["12", "3", "4", "3", "1"],
        regles: "Brèche (6+)",
        traits: "Assaut, Bolts",
      },
      {
        // Arme de personnage (Shadrak Meduson, Iron Hands).
        nom: "Ire de la Tempête",
        stats: ["24", "3", "5", "4", "1"],
        regles: "Brèche (6+)",
        traits: "Bolts, Assaut",
      },
      /* --- Arsenal des Sons of Horus (XVIe Légion) : munitions
         Banestrike (page « Arsenal des Sons of Horus », voir
         js/unites-data.js, unités réservées à cette Légion). --- */
      {
        nom: "Bolter Banestrike",
        stats: ["18", "2", "4", "4", "1"],
        regles: "Brèche (6+)",
        traits: "Bolts",
      },
      {
        nom: "Combi-bolter Banestrike",
        stats: ["18", "4", "4", "4", "1"],
        regles: "Brèche (6+)",
        traits: "Bolts",
      },
      {
        // Arme de personnage (Vheren Ashurhaddon, Sons of Horus).
        nom: "Paire de Pistolets Banestrike",
        stats: ["10", "4", "5", "4", "1"],
        regles: "Pistolet, Brèche (6+)",
        traits: "Assaut, Bolts",
      },
      {
        // Arme de personnage (Horus Lupercal / Horus Exalté, Sons of
        // Horus). Profil de Tir : possède aussi un profil de Mêlée
        // (voir Armes Énergétiques ci-dessous, même mécanique que
        // L'Épée Noire — note en fin de section).
        nom: "La Serre du Maître de Guerre",
        stats: ["24", "5", "5", "3", "1"],
        regles: "Brèche (6+)",
        traits: "Bolts, Assaut",
      },
      {
        // Décurion Lanius (livre d'armée, Legiones Astartes ayant le
        // Trait Sons of Horus, voir optionsDecurionLegion dans
        // js/unites-data.js) : arme sur Pivot accordée par cette
        // amélioration.
        nom: "Canon à bolts Banestrike",
        stats: ["24", "4", "6", "4", "2"],
        regles: "Brèche (6+)",
        traits: "Bolts",
      },
      /* --- Arsenal des Maisonnées de Chevaliers et des Legios
         Titaniques. --- */
      {
        nom: "Canon à bolts Mauler jumelé",
        stats: ["24", "6", "6", "4", "1"],
        regles: "Fixation (2), Lacération (4+)",
        traits: "Bolts",
      },
      {
        // Arsenal des Taghmata du Mechanicum (Liber Mechanicum) : les
        // Unités Taghmata doivent utiliser cette version de l'arme.
        nom: "Canon à bolts Mauler jumelé (Mechanicum)",
        stats: ["24", "6", "6", "4", "1"],
        regles: "Fixation (2), Lacération (4+)",
        traits: "Bolts",
      },
      {
        nom: "Canon à bolts de Castigateur jumelé",
        stats: ["36", "10", "6", "3", "1"],
        regles: "Artillerie (D), Neutralisation (2)",
        traits: "Bolts",
      },
    ],
  },
  {
    titre: "Armes Combinées",
    armes: [
      {
        nom: "Combi-arme — Bolter (Principal)",
        stats: ["24", "2", "4", "5", "1"],
        regles: "Combi",
        traits: "Bolts",
      },
      {
        nom: "Combi-lance-flammes — L.-flammes (Secondaire)",
        stats: ["Souffle", "1", "4", "5", "1"],
        regles: "Souffle, Panique (1), Limitée (1), Combi",
        traits: "Flammes",
      },
      {
        nom: "Combi-fuseur — Fuseur (Secondaire)",
        stats: ["12", "1", "8", "2", "3"],
        regles: "Fusion (6), Limitée (1), Combi",
        traits: "Fusion",
      },
      {
        nom: "Combi-plasma — Fusil à plasma (Secondaire)",
        stats: ["24", "2", "6", "4", "1"],
        regles: "Brèche (6+), Limitée (1), Combi",
        traits: "Plasma",
      },
      {
        nom: "Combi-volkite — Chargeur volkite (Secondaire)",
        stats: ["15", "2", "5", "5", "1"],
        regles: "Déflagration (5), Combi",
        traits: "Volkite",
      },
      {
        nom: "Combi-lance-grenades — Krak (Secondaire)",
        stats: ["24", "1", "6", "4", "2"],
        regles: "Combi",
        traits: "-",
      },
      {
        nom: "Combi-désintégrateur — Désintégrateur (Secondaire)",
        stats: ["24", "1", "4", "3", "2"],
        regles: "Surcharge (1), Limitée (1), Combi",
        traits: "Désintégrateur",
      },
      {
        nom: "Combi-grav — Fusil à gravitons (Secondaire)",
        stats: ["18", "1", "6", "4", "1"],
        regles:
          'Explosion (3"), Brèche (6+), Choc (Fixée), Fixation (1), Limitée (1), Combi',
        traits: "Gravitons",
      },
    ],
  },
  {
    titre: "Armes à Conversion",
    armes: [
      {
        nom: "Canon à conversion (< 15 pas)",
        stats: ["<15", "1", "6", "4", "1"],
        regles: 'Lourde (FT), Explosion (3")',
        traits: "Conversion",
      },
      {
        nom: "Canon à conversion (15-30 pas)",
        stats: ["15-30", "1", "7", "3", "2"],
        regles: 'Lourde (FT), Explosion (3")',
        traits: "Conversion",
      },
      {
        nom: "Canon à conversion (> 30-45 pas)",
        stats: [">30-45", "1", "8", "2", "3"],
        regles: 'Lourde (FT), Explosion (3")',
        traits: "Conversion",
      },
      {
        nom: "Canon à conversion lourd (< 15 pas)",
        stats: ["<15", "1", "6", "4", "1"],
        regles: 'Lourde (FT), Explosion (5")',
        traits: "Conversion",
      },
      {
        nom: "Canon à conversion lourd (15-30 pas)",
        stats: ["15-30", "1", "7", "3", "2"],
        regles: 'Lourde (FT), Explosion (5")',
        traits: "Conversion",
      },
      {
        nom: "Canon à conversion lourd (> 30-45 pas)",
        stats: [">30-45", "1", "8", "2", "3"],
        regles: 'Lourde (FT), Explosion (5")',
        traits: "Conversion",
      },
      {
        nom: "Canon à inversion (< 15 pas)",
        stats: ["<15", "1", "8", "2", "3"],
        regles: 'Lourde (FT), Explosion (5")',
        traits: "Conversion",
      },
      {
        nom: "Canon à inversion (15-30 pas)",
        stats: ["15-30", "1", "7", "3", "2"],
        regles: 'Lourde (FT), Explosion (5")',
        traits: "Conversion",
      },
      /* --- Arsenal des Maisonnées de Chevaliers et des Legios
         Titaniques. --- */
      {
        nom: "Faisceau de conversion Moirax (< 15 pas)",
        stats: ["<15", "1", "6", "4", "1"],
        regles: 'Lourde (FT), Explosion (3"), Neutralisation (1)',
        traits: "Conversion",
      },
      {
        nom: "Faisceau de conversion Moirax (15-30 pas)",
        stats: ["15-30", "1", "7", "3", "2"],
        regles: 'Lourde (FT), Explosion (3"), Neutralisation (1)',
        traits: "Conversion",
      },
      {
        nom: "Faisceau de conversion Moirax (> 30-45 pas)",
        stats: [">30-45", "1", "8", "2", "3"],
        regles: 'Lourde (FT), Explosion (3"), Neutralisation (1)',
        traits: "Conversion",
      },
      /* --- Arsenal des Taghmata du Mechanicum (Liber Mechanicum) : les
         Unités Taghmata doivent utiliser cette version des armes
         ci-dessous, quand elle est déjà présente dans l'Arsenal des
         Maisonnées de Chevaliers et des Legios Titaniques. --- */
      {
        nom: "Faisceau de conversion (< 15 pas)",
        stats: ["<15", "1", "5", "4", "1"],
        regles: 'Lourde (FT), Explosion (3")',
        traits: "Conversion",
      },
      {
        nom: "Faisceau de conversion (15-30 pas)",
        stats: ["15-30", "1", "6", "3", "2"],
        regles: 'Lourde (FT), Explosion (3")',
        traits: "Conversion",
      },
      {
        nom: "Faisceau de conversion Moirax (Mechanicum) (< 15 pas)",
        stats: ["<15", "1", "6", "4", "1"],
        regles: 'Lourde (FT), Explosion (3"), Neutralisation (1)',
        traits: "Conversion",
      },
      {
        nom: "Faisceau de conversion Moirax (Mechanicum) (15-30 pas)",
        stats: ["15-30", "1", "7", "3", "2"],
        regles: 'Lourde (FT), Explosion (3"), Neutralisation (1)',
        traits: "Conversion",
      },
      {
        nom: "Faisceau de conversion Moirax (Mechanicum) (> 30-45 pas)",
        stats: [">30-45", "1", "8", "2", "3"],
        regles: 'Lourde (FT), Explosion (3"), Neutralisation (1)',
        traits: "Conversion",
      },
      {
        nom: "Affût à conversion Desolator (< 18 pas)",
        stats: ["<18", "2", "8", "4", "2"],
        regles: 'Artillerie (D), Explosion (7")',
        traits: "Conversion",
      },
      {
        nom: "Affût à conversion Desolator (18-42 pas)",
        stats: ["18-42", "2", "9", "3", "3"],
        regles: 'Artillerie (D), Explosion (7")',
        traits: "Conversion",
      },
      {
        nom: "Affût à conversion Desolator (> 42-72 pas)",
        stats: [">42-72", "2", "10", "2", "4"],
        regles: 'Artillerie (D), Explosion (7")',
        traits: "Conversion",
      },
    ],
  },
  {
    titre: "Armes Désintégratrices",
    armes: [
      {
        nom: "Pistolet désintégrateur",
        stats: ["12", "1", "4", "3", "2"],
        regles: "Pistolet, Surcharge (1)",
        traits: "Assaut, Désintégrateur",
      },
      {
        // Arsenal des Taghmata du Mechanicum (Liber Mechanicum) : les
        // Unités Taghmata doivent utiliser cette version de l'arme.
        nom: "Pistolet désintégrateur (Mechanicum)",
        stats: ["12", "1", "4", "3", "2"],
        regles: "Pistolet, Surcharge (1)",
        traits: "Assaut, Désintégrateur",
      },
      {
        nom: "Fusil désintégrateur",
        stats: ["24", "1", "4", "3", "2"],
        regles: "Surcharge (1)",
        traits: "Désintégrateur",
      },
      {
        nom: "Éclateur désintégrateur",
        stats: ["18", "1", "5", "2", "2"],
        regles: "Surcharge (1)",
        traits: "Désintégrateur",
      },
      {
        nom: "Désintégrateur lourd",
        stats: ["24", "1", "6", "2", "2"],
        regles: "Lourde (PF), Surcharge (1)",
        traits: "Désintégrateur",
      },
      {
        nom: "Désintégrateur lourd jumelé",
        stats: ["24", "2", "7", "2", "2"],
        regles: "Surcharge (2)",
        traits: "Désintégrateur",
      },
      {
        nom: "Canon désintégrateur",
        stats: ["24", "2", "9", "2", "3"],
        regles: "Surcharge (2)",
        traits: "Désintégrateur",
      },
    ],
  },
  {
    titre: "Armes à Gravitons",
    armes: [
      {
        nom: "Fusil à gravitons",
        stats: ["18", "1", "6", "4", "1"],
        regles: 'Explosion (3"), Brèche (6+), Choc (Fixée), Fixation (1)',
        traits: "Gravitons",
      },
      {
        // Arsenal des Taghmata du Mechanicum (Liber Mechanicum) : les
        // Unités Taghmata doivent utiliser cette version de l'arme.
        nom: "Fusil à gravitons (Mechanicum)",
        stats: ["18", "1", "6", "4", "1"],
        regles: 'Explosion (3"), Brèche (6+), Choc (Fixée), Fixation (1)',
        traits: "Gravitons",
      },
      {
        nom: "Fusil à gravitons jumelé",
        stats: ["18", "1", "6", "4", "1"],
        regles: 'Explosion (5"), Brèche (6+), Choc (Fixée), Fixation (1)',
        traits: "Gravitons",
      },
      {
        nom: "Marteaux à gravitons",
        stats: ["12", "4", "6", "4", "2"],
        regles: "Brèche (5+), Choc (Fixée), Fixation (0)",
        traits: "Gravitons",
      },
      {
        nom: "Canon à gravitons",
        stats: ["36", "1", "8", "3", "1"],
        regles:
          'Lourde (D), Explosion (3"), Brèche (6+), Choc (Fixée), Fixation (2)',
        traits: "Gravitons",
      },
      {
        nom: "Canon à charge-graviton",
        stats: ["24", "1", "9", "3", "2"],
        regles:
          'Lourde (D), Explosion (5"), Barrage (1), Brèche (6+), Choc (Fixée), Fixation (3)',
        traits: "Gravitons",
      },
      {
        nom: "Bombarde à graviflux",
        stats: ["18", "1", "7", "4", "1"],
        regles:
          'Lourde (D), Explosion (5"), Brèche (6+), Choc (Fixée), Fixation (2)',
        traits: "Gravitons",
      },
      {
        nom: "Pulvériseur à gravitons",
        stats: ["18", "1", "9", "3", "3"],
        regles:
          'Lourde (D), Explosion (3"), Brèche (6+), Choc (Fixée), Fixation (3)',
        traits: "Gravitons",
      },
      /* --- Arsenal des Maisonnées de Chevaliers et des Legios
         Titaniques. --- */
      {
        nom: "Pulsar à gravitons",
        stats: ["24", "2", "6", "3", "1"],
        regles:
          'Lourde (D), Explosion (3"), Brèche (6+), Choc (Fixée), Fixation (2)',
        traits: "Gravitons",
      },
      {
        // Arsenal des Taghmata du Mechanicum (Liber Mechanicum) : les
        // Unités Taghmata doivent utiliser cette version de l'arme.
        nom: "Pulsar à gravitons (Mechanicum)",
        stats: ["24", "2", "6", "3", "1"],
        regles:
          'Lourde (D), Explosion (3"), Brèche (6+), Choc (Fixée), Fixation (2)',
        traits: "Gravitons",
      },
      {
        nom: "Canon à singularité graviton",
        stats: ["36", "1", "9", "2", "8"],
        regles:
          'Explosion (5"), Lourde (D), Surcharge (1), Fléau des Blindages, Touche Critique (6+)',
        traits: "Gravitons",
      },
    ],
  },
  {
    titre: "Armes à Flammes",
    armes: [
      {
        nom: "Lance-flammes léger",
        stats: ["Souffle", "1", "3", "-", "1"],
        regles: "Souffle, Pistolet",
        traits: "Assaut, Flammes",
      },
      {
        nom: "Lance-flammes",
        stats: ["Souffle", "1", "4", "5", "1"],
        regles: "Souffle, Panique (1)",
        traits: "Flammes",
      },
      {
        nom: "Lance-flammes lourd",
        stats: ["Souffle", "1", "5", "4", "1"],
        regles: "Souffle, Panique (1)",
        traits: "Flammes",
      },
      {
        // Arsenal des Taghmata du Mechanicum (Liber Mechanicum) : les
        // Unités Taghmata doivent utiliser cette version de l'arme.
        nom: "Lance-flammes (Mechanicum)",
        stats: ["Souffle", "1", "4", "5", "1"],
        regles: "Souffle, Panique (1)",
        traits: "Flammes",
      },
      {
        nom: "Lance-flammes lourd (Mechanicum)",
        stats: ["Souffle", "1", "5", "4", "1"],
        regles: "Souffle, Panique (1)",
        traits: "Flammes",
      },
      {
        // Arsenal des Solar Auxilia (Liber Auxilia) : les Unités Solar
        // Auxilia doivent utiliser cette version de l'arme.
        nom: "Lance-flammes léger (Solar Auxilia)",
        stats: ["Souffle", "1", "3", "-", "1"],
        regles: "Souffle, Pistolet",
        traits: "Flammes",
      },
      {
        nom: "Lance-flammes lourd (Solar Auxilia)",
        stats: ["Souffle", "1", "5", "4", "1"],
        regles: "Souffle, Panique (1)",
        traits: "Flammes",
      },
      {
        nom: "Lance-flammes lourd jumelé",
        stats: ["Souffle", "1", "5", "4", "1"],
        regles: "Souffle, Panique (2)",
        traits: "Flammes",
      },
      {
        nom: "Canon Flamestorm",
        stats: ["Souffle", "1", "6", "4", "2"],
        regles: "Souffle, Panique (2)",
        traits: "Flammes",
      },
      {
        nom: "Incinérateur photonique",
        stats: ["Souffle", "1", "6", "4", "1"],
        regles: "Souffle, Panique (2)",
        traits: "Assaut, Flammes",
      },
      /* --- Arsenal des Word Bearers (XVIIe Légion) : Escouade du
         Cercle de Cendres, Kor Phaeron, Dreadnought Mhara Gal (voir
         js/unites-data.js, unités réservées à cette Légion). --- */
      {
        // Arme de l'Escouade du Cercle de Cendres (Word Bearers).
        nom: "Lance-flammes Léger Akkadique",
        stats: ["Souffle", "1", "4", "4", "1"],
        regles: "Souffle, Pistolet, Panique (2)",
        traits: "Assaut, Flammes",
      },
      {
        // Arme de l'Iconoclaste de l'Escouade du Cercle de Cendres
        // (option, Word Bearers).
        nom: "Pistolet Inferno",
        stats: ["6", "1", "8", "2", "1"],
        regles: "Pistolet, Fusion (3)",
        traits: "Assaut, Fusion",
      },
      {
        // Arme de Kor Phaeron (Word Bearers).
        nom: "Digi-lance-flammes",
        stats: ["Souffle", "1", "4", "-", "1"],
        regles: "Souffle",
        traits: "Flammes, Assaut",
      },
      {
        // Arme du Dreadnought Mhara Gal (Word Bearers).
        nom: "Canon à Feu Warp",
        stats: ["36", "1", "6", "4", "2"],
        regles: 'Lourde (FT), Explosion (3"), Brèche (4+), Lacération (6+)',
        traits: "Plasma",
      },
      {
        // Arme du Dreadnought Mhara Gal (Word Bearers).
        nom: "Brasier Warp",
        stats: ["Souffle", "1", "5", "4", "1"],
        regles: "Souffle, Panique (2), Brèche (4+), Lacération (6+)",
        traits: "Flammes",
      },
      {
        // Arsenal des Maisonnées de Chevaliers et des Legios Titaniques.
        nom: "Canon Infernus d'Achéron",
        stats: ["Souffle", "1", "7", "4", "1"],
        regles:
          "Souffle (Fournaise), Lourde (PA), Lacération (5+), Panique (2)",
        traits: "Flammes",
      },
      /* --- Arsenal des Solar Auxilia (Liber Auxilia). --- */
      {
        nom: "Incinérateur lourd",
        stats: ["Souffle", "1", "6", "4", "1"],
        regles: "Souffle, Panique (1), Lacération (4+)",
        traits: "Flammes",
      },
      {
        nom: "Canon Infernus",
        stats: ["Souffle", "1", "6", "4", "2"],
        regles: "Souffle (Fournaise), Lourde (PA), Panique (2)",
        traits: "Flammes",
      },
    ],
  },
  {
    titre: "Armes Laser",
    armes: [
      {
        nom: "Canon laser",
        stats: ["48", "1", "9", "2", "1"],
        regles: "Lourde (D), Fléau des Blindages",
        traits: "Laser",
      },
      {
        nom: "Canon laser jumelé",
        stats: ["48", "2", "9", "2", "1"],
        regles: "Lourde (D), Fléau des Blindages",
        traits: "Laser",
      },
      {
        // Arsenal des Solar Auxilia (Liber Auxilia) : les Unités Solar
        // Auxilia doivent utiliser cette version de l'arme.
        nom: "Canon laser (Solar Auxilia)",
        stats: ["48", "1", "9", "2", "1"],
        regles: "Lourde (D), Fléau des Blindages",
        traits: "Laser",
      },
      {
        nom: "Canon laser jumelé (Solar Auxilia)",
        stats: ["48", "2", "9", "2", "1"],
        regles: "Lourde (D), Fléau des Blindages",
        traits: "Laser",
      },
      {
        nom: "Affût de canons laser",
        stats: ["48", "2", "9", "2", "3"],
        regles: "Fléau des Blindages",
        traits: "Laser",
      },
      {
        nom: "Batterie laser lourde Arachnus",
        stats: ["48", "2", "9", "2", "4"],
        regles: "Lourde (FT), Fléau des Blindages, Antiaérien",
        traits: "Laser",
      },
      {
        nom: "Destructeur laser",
        stats: ["36", "2", "10", "2", "2"],
        regles: "Lourde (D), Fléau des Blindages",
        traits: "Laser",
      },
      {
        // Arsenal des Solar Auxilia (Liber Auxilia) : les Unités Solar
        // Auxilia doivent utiliser cette version de l'arme. Profil
        // repris identique au Destructeur laser ci-dessus (relevé
        // incertain sur le scan fourni — à revérifier au besoin).
        nom: "Destructeur laser (Solar Auxilia)",
        stats: ["36", "2", "10", "2", "2"],
        regles: "Lourde (D), Fléau des Blindages",
        traits: "Laser",
      },
      {
        nom: "Magnadestructeur laser",
        stats: ["36", "2", "10", "2", "3"],
        regles: "Artillerie (D), Fléau des Blindages",
        traits: "Laser",
      },
      {
        nom: "Laser à neutrons",
        stats: ["24", "1", "9", "2", "2"],
        regles: "Artillerie (D), Fléau des Blindages, Choc (Neutralisée)",
        traits: "Laser",
      },
      {
        // Arsenal des Solar Auxilia (Liber Auxilia) : les Unités Solar
        // Auxilia doivent utiliser cette version de l'arme. Profil
        // repris identique au Laser à neutrons ci-dessus (relevé
        // incertain sur le scan fourni — à revérifier au besoin).
        nom: "Laser à neutrons (Solar Auxilia)",
        stats: ["24", "1", "9", "2", "2"],
        regles: "Artillerie (D), Fléau des Blindages, Choc (Neutralisée)",
        traits: "Laser",
      },
      {
        nom: "Éclateur à neutrons",
        stats: ["24", "1", "9", "2", "3"],
        regles: "Fléau des Blindages, Choc (Neutralisée), Surcharge (1)",
        traits: "Laser",
      },
      {
        nom: "Batterie laser à neutrons",
        stats: ["72", "3", "10", "2", "3"],
        regles:
          "Artillerie (D), Fléau des Blindages, Choc (Neutralisée), Surcharge (1)",
        traits: "Laser",
      },
      {
        nom: "Canon à onde neutronique",
        stats: ["120", "2", "12", "2", "4"],
        regles: "Artillerie (D), Fléau des Blindages, Choc (Sonnée)",
        traits: "Laser",
      },
      {
        nom: "Destructeur turbo-laser",
        stats: ["96", "1", "12", "2", "6"],
        regles: 'Explosion (3"), Fléau des Blindages',
        traits: "Laser",
      },
      /* --- Arsenal des Maisonnées de Chevaliers et des Legios
         Titaniques. --- */
      {
        nom: "Multi-laser",
        stats: ["36", "3", "6", "6", "1"],
        regles: "Neutralisation (1)",
        traits: "Laser",
      },
      {
        // Arsenal des Solar Auxilia (Liber Auxilia) : les Unités Solar
        // Auxilia doivent utiliser cette version de l'arme.
        nom: "Multi-laser (Solar Auxilia)",
        stats: ["36", "3", "6", "6", "1"],
        regles: "Neutralisation (1)",
        traits: "Laser",
      },
      {
        nom: "Batterie à onde neutronique",
        stats: ["120", "4", "12", "2", "4"],
        regles: "Artillerie (D), Fléau des Blindages, Choc (Sonnée)",
        traits: "Laser",
      },
      /* --- Arsenal des Solar Auxilia (Liber Auxilia). --- */
      {
        nom: "Pistolet laser",
        stats: ["12", "1", "3", "-", "1"],
        regles: "Pistolet",
        traits: "Assaut, Laser",
      },
      {
        nom: "Rifle laser — Salve",
        stats: ["30", "1", "3", "6", "1"],
        regles: "Lourde (PF)",
        traits: "Laser",
      },
      {
        nom: "Rifle laser — Surchargeur",
        stats: ["18", "1", "4", "4", "1"],
        regles: "Vulnérante (6+), Lacération (6+)",
        traits: "Laser",
      },
      {
        nom: "Pistolet laser éclateur",
        stats: ["9", "2", "4", "4", "1"],
        regles: "Pistolet, Vulnérante (6+), Lacération (6+)",
        traits: "Assaut, Laser",
      },
      {
        nom: "Batterie de multi-laser Gravis",
        stats: ["36", "6", "6", "6", "2"],
        regles: "Neutralisation (1)",
        traits: "Laser",
      },
      /* --- Arsenal des Taghmata du Mechanicum (Liber Mechanicum). --- */
      {
        nom: "Mousquet laser",
        stats: ["18", "1", "4", "6", "1"],
        regles: "-",
        traits: "Laser",
      },
      {
        nom: "Pulseur à photons",
        stats: ["24", "2", "8", "2", "1"],
        regles: "Fléau des Blindages, Neutralisation (1), Brise-blindage (5+)",
        traits: "Laser",
      },
      {
        nom: "Pulsar pilonneur",
        stats: ["36", "2", "9", "2", "3"],
        regles: "Artillerie (PF), Neutralisation (2)",
        traits: "Laser",
      },
      {
        nom: "Canon Darkfire",
        stats: ["36", "2", "8", "2", "1"],
        regles: "Lourde (D), Neutralisation (2)",
        traits: "Laser",
      },
      {
        nom: "Laser lourd Sollex",
        stats: ["48", "2", "10", "2", "2"],
        regles: "Artillerie (D), Choc (Neutralisée), Fléau des Blindages",
        traits: "Laser",
      },
    ],
  },
  {
    titre: "Armes à Fusion",
    armes: [
      {
        nom: "Fuseur",
        stats: ["12", "1", "8", "2", "3"],
        regles: "Fusion (6)",
        traits: "Fusion",
      },
      {
        // Arsenal des Taghmata du Mechanicum (Liber Mechanicum) : les
        // Unités Taghmata doivent utiliser cette version de l'arme.
        nom: "Fuseur (Mechanicum)",
        stats: ["12", "1", "8", "2", "3"],
        regles: "Fusion (6)",
        traits: "Fusion",
      },
      {
        // Arsenal des Blood Angels : échange contre un pistolet à
        // plasma pour toute Figurine ayant le Trait Blood Angels,
        // +5 Points par Figurine.
        nom: "Pistolet Inferno",
        stats: ["6", "1", "8", "2", "1"],
        regles: "Pistolet, Fusion (3)",
        traits: "Assaut, Fusion",
      },
      {
        // Arsenal des Solar Auxilia (Liber Auxilia) : les Unités Solar
        // Auxilia doivent utiliser cette version de l'arme.
        nom: "Pistolet Inferno (Solar Auxilia)",
        stats: ["6", "1", "8", "2", "1"],
        regles: "Pistolet, Fusion (3)",
        traits: "Assaut, Fusion",
      },
      {
        // Arme de personnage (Sanguinius, Primarque des Blood Angels).
        nom: "Infernus",
        stats: ["18", "2", "8", "2", "3"],
        regles: "Fusion (12), Limitée (1)",
        traits: "Fusion, Assaut",
      },
      {
        nom: "Multi-fuseur",
        stats: ["24", "1", "8", "2", "3"],
        regles: "Lourde (FT), Fusion (8)",
        traits: "Fusion",
      },
      {
        nom: "Multi-fuseur (Mechanicum)",
        stats: ["24", "1", "8", "2", "3"],
        regles: "Lourde (FT), Fusion (8)",
        traits: "Fusion",
      },
      {
        nom: "Multi-fuseur jumelé",
        stats: ["24", "1", "9", "2", "3"],
        regles: "Lourde (FT), Fusion (8)",
        traits: "Fusion",
      },
      {
        nom: "Canon à fusion Gravis",
        stats: ["24", "1", "9", "2", "4"],
        regles: "Lourde (FT), Fusion (8)",
        traits: "Fusion",
      },
      {
        nom: "Magnacanon à fusion",
        stats: ["36", "1", "9", "2", "4"],
        regles: "Lourde (FT), Fusion (8)",
        traits: "Fusion",
      },
      {
        nom: "Lance à fusion cyclonique",
        stats: ["12", "3", "8", "2", "3"],
        regles: "Lourde (FT), Fusion (12)",
        traits: "Fusion",
      },
      {
        nom: "Affût à fusion de siège",
        stats: ["12", "1", "10", "2", "4"],
        regles: "Lourde (FT), Fusion (8)",
        traits: "Fusion",
      },
      {
        nom: "Découpeurs à fusion",
        stats: ["6", "1", "8", "2", "3"],
        regles: 'Lourde (FT), Explosion (5"), Fusion (6)',
        traits: "Fusion",
      },
      {
        nom: "Fuseur-éclateur",
        stats: ["36", "2", "9", "2", "4"],
        regles: 'Lourde (FT), Explosion (3"), Fusion (3)',
        traits: "Fusion",
      },
      {
        nom: "Affût à fusion de Sentinelle",
        stats: ["18", "2", "8", "2", "2"],
        regles: "Lourde (FT), Fusion (8)",
        traits: "Fusion",
      },
      /* --- Arsenal des Maisonnées de Chevaliers et des Legios
         Titaniques. --- */
      {
        nom: "Lance thermique",
        stats: ["24", "1", "9", "2", "4"],
        regles: "Lourde (FT), Fusion (12)",
        traits: "Fusion",
      },
      {
        nom: "Canon thermique",
        stats: ["36", "1", "10", "2", "6"],
        regles: 'Lourde (FT), Explosion (3"), Fusion (12)',
        traits: "Fusion",
      },
      /* --- Arsenal des Solar Auxilia (Liber Auxilia). --- */
      {
        nom: "Lance à fusion",
        stats: ["18", "1", "9", "2", "4"],
        regles: "Lourde (FT), Fléau des Blindages",
        traits: "Fusion",
      },
    ],
  },
  {
    titre: "Armes à Missiles",
    armes: [
      {
        nom: "Lance-missiles — Frag",
        stats: ["48", "1", "4", "6", "1"],
        regles: 'Lourde (FT), Explosion (3")',
        traits: "Missile",
      },
      {
        nom: "Lance-missiles — Krak",
        stats: ["48", "1", "8", "3", "1"],
        regles: "Lourde (D)",
        traits: "Missile",
      },
      {
        nom: "Lance-missiles — Flak",
        stats: ["48", "1", "8", "4", "1"],
        regles: "Lourde (D), Antiaérien",
        traits: "Missile",
      },
      {
        nom: "Lanceur Vengeance",
        stats: ["48", "1", "7", "4", "1"],
        regles: 'Explosion (5")',
        traits: "Missile",
      },
      {
        nom: "Lanceur Havoc",
        stats: ["48", "1", "5", "5", "1"],
        regles: 'Explosion (3"), Sonner (1)',
        traits: "Missile",
      },
      {
        nom: "Missile traqueur",
        stats: ["48", "1", "9", "3", "3"],
        regles: "Fléau des Blindages, Limitée (1)",
        traits: "Missile Guidé",
      },
      {
        nom: "Missile Hellstrike",
        stats: ["48", "1", "9", "3", "3"],
        regles: "Fléau des Blindages, Limitée (1)",
        traits: "Missile",
      },
      {
        // Arsenal des Taghmata du Mechanicum (Liber Mechanicum) : les
        // Unités Taghmata doivent utiliser cette version de l'arme.
        nom: "Missile traqueur (Mechanicum)",
        stats: ["48", "1", "9", "3", "3"],
        regles: "Fléau des Blindages",
        traits: "Missile",
      },
      /* --- Arsenal des Solar Auxilia (Liber Auxilia) : les Unités
         Solar Auxilia doivent utiliser cette version de l'arme. --- */
      {
        nom: "Missile traqueur (Solar Auxilia)",
        stats: ["48", "1", "9", "3", "3"],
        regles: "Fléau des Blindages, Limitée (1)",
        traits: "Missile",
      },
      {
        nom: "Missile Hellstrike (Solar Auxilia)",
        stats: ["48", "1", "9", "3", "3"],
        regles: "Fléau des Blindages, Limitée (1)",
        traits: "Missile Guidé",
      },
      {
        nom: "Lance-missiles Deathstorm",
        stats: ["18", "D3", "6", "4", "1"],
        regles: "Fixation (1)",
        traits: "Missile",
      },
      {
        nom: "Lance-missiles Kharybdis",
        stats: ["18", "5", "6", "4", "1"],
        regles: "Fixation (1)",
        traits: "Missile",
      },
      {
        nom: "Lance-missiles rotatif",
        stats: ["48", "3", "8", "2", "2"],
        regles: "Brèche (6+), Limitée (1)",
        traits: "Missile Guidé",
      },
      {
        nom: "Missile Sabre",
        stats: ["36", "1", "7", "4", "2"],
        regles: "Fléau des Blindages, Limitée (1)",
        traits: "Missile",
      },
      {
        nom: "Roquette Tempest",
        stats: ["48", "1", "7", "4", "3"],
        regles: 'Lourde (PF), Explosion (3"), Barrage (1)',
        traits: "Missile",
      },
      {
        nom: "Lance-missiles Aiolos",
        stats: ["60", "1", "6", "4", "1"],
        regles: "Limitée (1), Antiaérien, Poursuite Rapide",
        traits: "Missile",
      },
      {
        nom: "Missile antiaérien Boreas",
        stats: ["48", "1", "8", "2", "3"],
        regles: 'Explosion (7"), Barrage (2), Neutralisation (1)',
        traits: "Missile",
      },
      {
        nom: "Système de roquettes Spicula",
        stats: ["72", "1", "7", "4", "1"],
        regles: "-",
        traits: "Missile",
      },
      {
        nom: "Lance-missiles Arcus — Ogives Arcus",
        stats: ["36", "5", "8", "2", "2"],
        regles: "Antiaérien, Fléau des Blindages, Poursuite Rapide",
        traits: "Missile",
      },
      {
        nom: "Lance-missiles Arcus — Ogives Skyspear",
        stats: ["36", "3", "8", "2", "2"],
        regles: 'Explosion (5"), Panique (1)',
        traits: "Missile",
      },
      {
        nom: "Lance-missiles Arcus — Ogives Pyrax",
        stats: ["36", "1", "5", "4", "1"],
        regles: "Choc (Neutralisée)",
        traits: "Missile",
      },
      {
        nom: "Lance-missiles Arcus — Ogives à flux de neutrons",
        stats: ["36", "3", "7", "4", "1"],
        regles: 'Lourde (FT), Explosion (5")',
        traits: "Missile",
      },
      {
        nom: "Lance-missiles Cyclone — Frag",
        stats: ["48", "1", "4", "6", "1"],
        regles: "Lourde (D)",
        traits: "Missile",
      },
      {
        nom: "Lance-missiles Cyclone — Krak",
        stats: ["48", "2", "8", "3", "1"],
        regles: "Lourde (D), Antiaérien",
        traits: "Missile",
      },
      {
        nom: "Lance-missiles Cyclone — Flak",
        stats: ["48", "2", "8", "4", "1"],
        regles: 'Lourde (PF), Explosion (3"), Barrage (2)',
        traits: "Missile",
      },
      {
        // Arsenal des Taghmata du Mechanicum (Liber Mechanicum) : les
        // Unités Taghmata doivent utiliser cette version de l'arme.
        nom: "Lance-missiles Cyclone (Mechanicum) — Frag",
        stats: ["48", "1", "4", "6", "1"],
        regles: 'Lourde (FT), Explosion (5")',
        traits: "Missile",
      },
      {
        nom: "Lance-missiles Cyclone (Mechanicum) — Krak",
        stats: ["48", "2", "8", "3", "1"],
        regles: "Lourde (D)",
        traits: "Missile",
      },
      {
        nom: "Lance-missiles Cyclone (Mechanicum) — Flak",
        stats: ["48", "2", "8", "4", "1"],
        regles: "Lourde (D), Antiaérien, Limitée (1)",
        traits: "Missile",
      },
      {
        nom: "Lance-missiles Scorpius",
        stats: ["48", "1", "8", "4", "1"],
        regles: "Brèche (5+)",
        traits: "Missile",
      },
      {
        nom: "Lance-missiles Whirlwind — Missiles HE",
        stats: ["48", "1", "6", "4", "1"],
        regles: 'Explosion (5"), Sonner (1), Barrage (1)',
        traits: "Missile",
      },
      {
        nom: "Lance-missiles Whirlwind — Missiles Pyrax*",
        stats: ["48", "1", "5", "5", "1"],
        regles: 'Explosion (5"), Panique (1), Barrage (1)',
        traits: "Missile",
      },
      {
        nom: "Lance-missiles Hyperios",
        stats: ["48", "3", "7", "3", "2"],
        regles: "Antiaérien, Poursuite Rapide",
        traits: "Missile",
      },
      {
        nom: "Missile Frag Orias",
        stats: ["48", "1", "6", "5", "1"],
        regles: 'Barrage (3), Explosion (5"), Limitée (1)',
        traits: "Missile",
      },
      /* --- Arsenal des Maisonnées de Chevaliers et des Legios
         Titaniques. --- */
      {
        nom: "Nacelle lance-missiles Ironstorm",
        stats: ["72", "1", "5", "4", "1"],
        regles: 'Artillerie (D), Explosion (5")',
        traits: "Missile",
      },
      {
        nom: "Batterie lance-missiles Ironstorm",
        stats: ["72", "2", "5", "4", "1"],
        regles: 'Artillerie (D), Explosion (5")',
        traits: "Missile",
      },
      {
        nom: "Nacelle lance-roquettes Stormspear",
        stats: ["48", "3", "7", "3", "1"],
        regles: "-",
        traits: "Missile",
      },
      /* --- Arsenal des Solar Auxilia (Liber Auxilia). --- */
      {
        nom: "Batterie de missiles traqueurs",
        stats: ["48", "2", "9", "3", "3"],
        regles: "Fléau des Blindages, Limitée (2)",
        traits: "Missile Guidé",
      },
      {
        nom: "Batterie de missiles Aethon",
        stats: ["30", "1", "4", "5", "2"],
        regles: 'Explosion (5"), Barrage (1), Sonner (1)',
        traits: "Missile",
      },
    ],
  },
  {
    titre: "Armes à Particules",
    armes: [
      {
        nom: "Lacérateur à particules",
        stats: ["Souffle", "1", "6", "3", "1"],
        regles: "Souffle, Brèche (6+), Surcharge (1)",
        traits: "Assaut, Particules",
      },
      {
        nom: "Lacérateur à particules lourd",
        stats: ["Souffle", "1", "6", "3", "2"],
        regles: "Souffle, Brèche (6+), Surcharge (1)",
        traits: "Assaut, Particules",
      },
    ],
  },
  {
    titre: "Armes à Phosphex",
    armes: [
      {
        nom: "Bombe à phosphex",
        stats: ["6", "1", "5", "3", "1"],
        regles: 'Explosion (3"), Empoisonnée (3+), Panique (3), Brèche (5+)',
        traits: "Phosphex",
      },
      {
        nom: "Déchargeur à phosphex",
        stats: ["18", "1", "5", "3", "1"],
        regles:
          'Explosion (3"), Limitée (3), Empoisonnée (3+), Panique (3), Brèche (5+)',
        traits: "Phosphex",
      },
    ],
  },
  /* --- Arsenal des Solar Auxilia (Liber Auxilia). --- */
  {
    titre: "Armes à Aiguilles",
    armes: [
      {
        nom: "Pistolet à aiguilles",
        stats: ["12", "2", "2", "-", "1"],
        regles: "Empoisonnée (3+), Pistolet, Fixation (1)",
        traits: "Assaut, Aiguilles",
      },
    ],
  },
  {
    titre: "Armes à Plasma",
    armes: [
      {
        nom: "Pistolet à plasma — Tir soutenu",
        stats: ["12", "1", "6", "4", "1"],
        regles: "Pistolet, Brèche (6+)",
        traits: "Assaut, Plasma",
      },
      {
        nom: "Pistolet à plasma — Tir maximal",
        stats: ["12", "1", "7", "4", "1"],
        regles: "Pistolet, Brèche (5+), Surcharge (1)",
        traits: "Assaut, Plasma",
      },
      {
        // Arsenal des Taghmata du Mechanicum (Liber Mechanicum) : les
        // Unités Taghmata doivent utiliser cette version de l'arme.
        nom: "Pistolet à plasma (Mechanicum) — Tir soutenu",
        stats: ["12", "1", "6", "4", "1"],
        regles: "Pistolet, Brèche (6+)",
        traits: "Assaut, Plasma",
      },
      {
        nom: "Pistolet à plasma (Mechanicum) — Tir maximal",
        stats: ["12", "1", "7", "4", "1"],
        regles: "Pistolet, Brèche (5+), Surcharge (1)",
        traits: "Assaut, Plasma",
      },
      /* --- Arsenal des Solar Auxilia (Liber Auxilia) : les Unités
         Solar Auxilia doivent utiliser cette version de l'arme. --- */
      {
        nom: "Pistolet à plasma (Solar Auxilia) — Tir soutenu",
        stats: ["12", "1", "6", "4", "1"],
        regles: "Pistolet, Brèche (6+)",
        traits: "Assaut, Plasma",
      },
      {
        nom: "Pistolet à plasma (Solar Auxilia) — Tir maximal",
        stats: ["12", "1", "7", "4", "1"],
        regles: "Pistolet, Brèche (5+), Surcharge (1)",
        traits: "Assaut, Plasma",
      },
      {
        nom: "Pistolet à plasma suralimenté",
        stats: ["12", "3", "8", "4", "1"],
        regles: "Pistolet, Brèche (4+), Surcharge (1)",
        traits: "Assaut, Plasma",
      },
      {
        nom: "Fusil à plasma — Tir soutenu",
        stats: ["24", "2", "6", "4", "1"],
        regles: "Brèche (6+)",
        traits: "Plasma",
      },
      {
        nom: "Fusil à plasma — Tir maximal",
        stats: ["24", "2", "7", "4", "1"],
        regles: "Brèche (5+), Surcharge (1)",
        traits: "Plasma",
      },
      {
        nom: "Fusil à plasma jumelé — Tir soutenu",
        stats: ["24", "2", "6", "4", "1"],
        regles: "Brèche (5+)",
        traits: "Plasma",
      },
      {
        nom: "Fusil à plasma jumelé — Tir maximal",
        stats: ["24", "2", "7", "4", "1"],
        regles: "Brèche (4+), Surcharge (1)",
        traits: "Plasma",
      },
      {
        nom: "Bombarde à plasma — Tir soutenu",
        stats: ["24", "1", "6", "4", "1"],
        regles: 'Explosion (3"), Barrage (1), Brèche (6+)',
        traits: "Plasma",
      },
      {
        nom: "Bombarde à plasma — Tir maximal",
        stats: ["24", "1", "7", "4", "1"],
        regles: 'Explosion (3"), Barrage (1), Brèche (5+), Surcharge (2)',
        traits: "Plasma",
      },
      {
        nom: "Bombarde à plasma lourde — Tir soutenu",
        stats: ["36", "1", "7", "4", "2"],
        regles: 'Explosion (5"), Barrage (1), Brèche (6+)',
        traits: "Plasma",
      },
      {
        nom: "Bombarde à plasma lourde — Tir maximal",
        stats: ["36", "1", "8", "4", "2"],
        regles: 'Explosion (5"), Barrage (1), Brèche (5+), Surcharge (2)',
        traits: "Plasma",
      },
      {
        nom: "Canon à plasma — Tir soutenu",
        stats: ["36", "1", "6", "4", "1"],
        regles: 'Lourde (FT), Explosion (3"), Brèche (6+)',
        traits: "Plasma",
      },
      {
        nom: "Canon à plasma — Tir maximal",
        stats: ["36", "1", "6", "4", "1"],
        regles: 'Lourde (FT), Explosion (3"), Brèche (5+), Surcharge (2)',
        traits: "Plasma",
      },
      {
        nom: "Canon à plasma Gravis — Tir soutenu",
        stats: ["36", "1", "7", "4", "1"],
        regles: 'Lourde (FT), Explosion (5"), Brèche (6+)',
        traits: "Plasma",
      },
      {
        nom: "Canon à plasma Gravis — Tir maximal",
        stats: ["36", "1", "7", "4", "2"],
        regles: 'Lourde (FT), Explosion (5"), Brèche (5+), Surcharge (1)',
        traits: "Plasma",
      },
      {
        nom: "Éclateur à plasma — Tir soutenu",
        stats: ["18", "2", "7", "4", "1"],
        regles: "Brèche (6+)",
        traits: "Plasma",
      },
      {
        nom: "Éclateur à plasma — Tir maximal",
        stats: ["18", "2", "8", "4", "1"],
        regles: "Brèche (5+), Surcharge (1)",
        traits: "Plasma",
      },
      {
        nom: "Destructeur à plasma Executioner — Tir soutenu",
        stats: ["36", "1", "8", "4", "1"],
        regles: 'Explosion (5"), Brèche (5+)',
        traits: "Plasma",
      },
      {
        nom: "Destructeur à plasma Executioner — Tir maximal",
        stats: ["36", "1", "8", "4", "2"],
        regles: 'Explosion (5"), Brèche (4+), Surcharge (1)',
        traits: "Plasma",
      },
      /* --- Arsenal des Solar Auxilia (Liber Auxilia) : les Unités
         Solar Auxilia doivent utiliser cette version de l'arme. --- */
      {
        nom: "Destructeur à plasma Executioner (Solar Auxilia) — Tir soutenu",
        stats: ["36", "1", "8", "4", "1"],
        regles: 'Explosion (5"), Brèche (5+)',
        traits: "Plasma",
      },
      {
        nom: "Destructeur à plasma Executioner (Solar Auxilia) — Tir maximal",
        stats: ["36", "1", "8", "4", "2"],
        regles: 'Explosion (5"), Brèche (4+), Surcharge (1)',
        traits: "Plasma",
      },
      {
        nom: "Canonnade à plasma Hellfire — Tir soutenu",
        stats: ["36", "6", "6", "4", "1"],
        regles: "Lourde (FT), Brèche (5+)",
        traits: "Plasma",
      },
      {
        nom: "Canonnade à plasma Hellfire — Tir maximal",
        stats: ["36", "1", "7", "4", "2"],
        regles: 'Lourde (FT), Explosion (5"), Brèche (4+), Surcharge (1)',
        traits: "Plasma",
      },
      {
        nom: "Affût à plasma Omega — Tir soutenu",
        stats: ["36", "6", "7", "4", "2"],
        regles: "Brèche (5+)",
        traits: "Plasma",
      },
      {
        nom: "Affût à plasma Omega — Tir maximal",
        stats: ["36", "1", "8", "4", "2"],
        regles: 'Explosion (5"), Brèche (4+), Surcharge (1)',
        traits: "Plasma",
      },
      {
        // Arme de personnage (Lion El'Jonson, Primarque des Dark
        // Angels).
        nom: "Le Fusil Actinaeus",
        stats: ["18", "2", "7", "3", "2"],
        regles: "Brèche (4+)",
        traits: "Assaut, Plasma",
      },
      {
        nom: "Brûleur à plasma — Tir soutenu",
        stats: ["Souffle", "1", "5", "4", "1"],
        regles: "Souffle, Brèche (6+)",
        traits: "Plasma",
      },
      {
        nom: "Brûleur à plasma — Tir maximal",
        stats: ["Souffle", "1", "6", "4", "1"],
        regles: "Souffle, Brèche (5+), Surcharge (1)",
        traits: "Plasma",
      },
      {
        nom: "Incinérateur à plasma — Tir soutenu",
        stats: ["Souffle", "1", "5", "4", "2"],
        regles: "Souffle, Brèche (6+)",
        traits: "Plasma",
      },
      {
        nom: "Incinérateur à plasma — Tir maximal",
        stats: ["Souffle", "1", "6", "4", "2"],
        regles: "Souffle, Brèche (5+), Surcharge (1)",
        traits: "Plasma",
      },
      {
        // Arme des Chevaliers du Cercle Intérieur (Dark Angels) : arme
        // digitale compacte, montée sur avant-bras pour préserver la
        // liberté de mouvement en mêlée.
        nom: "Lance-plasma — Tir soutenu",
        stats: ["Souffle", "1", "4", "4", "1"],
        regles: "Souffle, Brèche (6+)",
        traits: "Plasma",
      },
      {
        nom: "Lance-plasma — Tir maximal",
        stats: ["Souffle", "1", "4", "4", "1"],
        regles: "Souffle, Brèche (5+), Surcharge (1)",
        traits: "Plasma",
      },
      {
        // Arsenal des Maisonnées de Chevaliers et des Legios Titaniques.
        nom: "Fusil à plasma phasé",
        stats: ["24", "3", "5", "3", "1"],
        regles: "Brèche (5+)",
        traits: "Plasma",
      },
      /* --- Arsenal des Taghmata du Mechanicum (Liber Mechanicum). --- */
      {
        // Les Unités Taghmata doivent utiliser cette version de l'arme.
        nom: "Fusil à plasma phasé (Mechanicum)",
        stats: ["24", "3", "5", "3", "1"],
        regles: "Brèche (5+)",
        traits: "Plasma",
      },
      {
        nom: "Fusil à plasma phasé jumelé",
        stats: ["24", "4", "5", "3", "1"],
        regles: "Brèche (4+)",
        traits: "Plasma",
      },
      {
        nom: "Mortier à plasma",
        stats: ["36", "1", "8", "4", "2"],
        regles: 'Artillerie (P), Brèche (5+), Explosion (5"), Barrage (2)',
        traits: "Plasma",
      },
    ],
  },
  {
    titre: "Armes Rad",
    armes: [
      {
        nom: "Grenades Rad",
        stats: ["8", "1", "4", "3", "1"],
        regles: "Empoisonnée (2+), Phage (E)",
        traits: "Rad",
      },
      {
        // Arsenal des Taghmata du Mechanicum (Liber Mechanicum) : les
        // Unités Taghmata doivent utiliser cette version de l'arme.
        nom: "Grenades Rad (Mechanicum)",
        stats: ["8", "1", "4", "3", "1"],
        regles: "Empoisonnée (2+), Phage (E)",
        traits: "Rad",
      },
      {
        // Arme des Interemptors de la Dreadwing (Dark Angels) : profil
        // Missile Rad, voir aussi Missile à stase ci-dessous.
        nom: "Lance-missiles de Destructeur — Missile Rad",
        stats: ["24", "2", "4", "3", "1"],
        regles: "Empoisonnée (2+), Phage (E)",
        traits: "Assaut, Rad",
      },
      {
        // Arme des Interemptors de la Dreadwing (Dark Angels) : profil
        // Missile à stase, voir aussi Missile Rad ci-dessus.
        nom: "Lance-missiles de Destructeur — Missile à stase",
        stats: ["24", "1", "4", "-", "2"],
        regles: 'Explosion (3"), Sonner (3)',
        traits: "Assaut, Stase",
      },
      /* --- Arsenal des Ultramarines (XIIIe Légion) : Escouade
         Terminator Fulmentarus, Escouade de Destructeurs Némésis (voir
         js/unites-data.js, unités réservées à cette Légion). --- */
      {
        nom: "Bolter mortifère",
        stats: ["18", "2", "4", "5", "1"],
        regles: "Panique (1)",
        traits: "Bolts",
      },
      {
        // Arme de l'Unité Terminator Fulmentarus (Ultramarines) : profil
        // Missiles à éclats, voir aussi Missiles à plasma Hellfire
        // ci-dessous.
        nom: "Batterie de missiles Fulmentarus — Missiles à éclats",
        stats: ["36", "4", "4", "5", "1"],
        regles: "Suppressif (1)",
        traits: "Missile",
      },
      {
        // Arme de l'Unité Terminator Fulmentarus (Ultramarines) : profil
        // Missiles à plasma Hellfire, voir aussi Missiles à éclats
        // ci-dessus.
        nom: "Batterie de missiles Fulmentarus — Missiles à plasma Hellfire",
        stats: ["36", "2", "7", "4", "1"],
        regles: "Brèche (5+)",
        traits: "Missile, Plasma",
      },
      /* --- Arsenal des Maisonnées de Chevaliers et des Legios
         Titaniques. --- */
      {
        nom: "Irradieur",
        stats: ["Souffle", "1", "2", "5", "1"],
        regles: "Souffle, Panique (1), Phage (E), Empoisonnée (2+)",
        traits: "Rad",
      },
      {
        nom: "Radioactiveur",
        stats: ["Souffle", "1", "5", "4", "2"],
        regles:
          "Souffle, Panique (2), Phage (E), Empoisonnée (2+), Brèche (6+)",
        traits: "Rad",
      },
      {
        nom: "Mortier Karacnos",
        stats: ["60", "1", "6", "4", "1"],
        regles:
          'Explosion (3"), Barrage (2), Phage (E), Fixation (3), Empoisonnée (2+)',
        traits: "Rad",
      },
      /* --- Arsenal des Taghmata du Mechanicum (Liber Mechanicum). --- */
      {
        // Les Unités Taghmata doivent utiliser cette version de l'arme.
        nom: "Irradieur (Mechanicum)",
        stats: ["Souffle", "1", "2", "5", "1"],
        regles: "Souffle, Phage (E), Empoisonnée (2+), Panique (1)",
        traits: "Rad",
      },
      {
        nom: "Engin à irradiation",
        stats: ["Souffle", "1", "4", "5", "1"],
        regles:
          "Souffle, Lourde (PA), Phage (E), Empoisonnée (2+), Panique (1)",
        traits: "Rad",
      },
      {
        nom: "Lance-missiles Vultarax — Explosion aérienne",
        stats: ["36", "1", "6", "4", "1"],
        regles: 'Explosion (5"), Phage (E), Panique (0)',
        traits: "Rad",
      },
      {
        nom: "Lance-missiles Vultarax — Charge creuse",
        stats: ["36", "2", "10", "2", "2"],
        regles: "Phage (E), Panique (0), Choc (Sonnée)",
        traits: "Rad",
      },
      {
        nom: "Batterie de mortiers Karacnos",
        stats: ["60", "1", "6", "4", "1"],
        regles:
          'Explosion (5"), Barrage (2), Empoisonnée (2+), Phage (E), Fixation (3)',
        traits: "Rad",
      },
      {
        nom: "Éclateur à irradiation",
        stats: ["16", "1", "2", "4", "2"],
        regles:
          'Explosion (5"), Artillerie (D), Choc (Sonnée), Phage (E), Empoisonnée (2+), Panique (2)',
        traits: "Rad",
      },
    ],
  },
  {
    titre: "Armes Soniques",
    armes: [
      {
        nom: "Résonateur à commotion",
        stats: ["Souffle", "2", "6", "5", "1"],
        regles: "Souffle, Surcharge (1), Sonner (2)",
        traits: "Assaut, Sonique",
      },
    ],
  },
  {
    titre: "Armes Volkites",
    armes: [
      {
        nom: "Serpentine volkite",
        stats: ["10", "2", "5", "5", "1"],
        regles: "Pistolet, Déflagration (5)",
        traits: "Assaut, Volkite",
      },
      {
        nom: "Serpentine volkite suralimentée",
        stats: ["10", "4", "6", "5", "1"],
        regles: "Pistolet, Déflagration (5), Surcharge (1)",
        traits: "Assaut, Volkite",
      },
      {
        // Arme de personnage (Dominion Zephon, Blood Angels).
        nom: "Lamentation et Chagrin",
        stats: ["10", "6", "5", "5", "1"],
        regles: "Déflagration (5), Sonner (1)",
        traits: "Assaut, Volkite",
      },
      {
        nom: "Chargeur volkite",
        stats: ["15", "2", "5", "5", "1"],
        regles: "Déflagration (5)",
        traits: "Volkite",
      },
      {
        nom: "Chargeur volkite jumelé",
        stats: ["15", "3", "5", "5", "1"],
        regles: "Déflagration (5)",
        traits: "Volkite",
      },
      {
        // Arme de personnage (Evander Garrius, Imperial Fists).
        nom: "Incineratus",
        stats: ["15", "4", "5", "5", "1"],
        regles: "Déflagration (6)",
        traits: "Volkite",
      },
      {
        nom: "Arquebuse volkite",
        stats: ["30", "2", "6", "5", "1"],
        regles: "Déflagration (6)",
        traits: "Volkite",
      },
      {
        nom: "Arquebuse volkite jumelée",
        stats: ["30", "3", "6", "5", "1"],
        regles: "Déflagration (6)",
        traits: "Volkite",
      },
      {
        nom: "Couleuvrine volkite",
        stats: ["45", "3", "6", "5", "1"],
        regles: "Lourde (PF), Déflagration (6)",
        traits: "Volkite",
      },
      {
        nom: "Couleuvrine volkite jumelée",
        stats: ["45", "6", "6", "5", "1"],
        regles: "Lourde (PF), Déflagration (6)",
        traits: "Volkite",
      },
      {
        nom: "Fauconneau volkite",
        stats: ["45", "10", "7", "5", "1"],
        regles: "Lourde (PF), Déflagration (6)",
        traits: "Volkite",
      },
      {
        nom: "Sacre volkite",
        stats: ["25", "6", "6", "5", "1"],
        regles: "Déflagration (7), Fixation (2)",
        traits: "Volkite",
      },
      {
        nom: "Macro-sacre volkite",
        stats: ["45", "8", "6", "5", "1"],
        regles: "Déflagration (6)",
        traits: "Volkite",
      },
      {
        nom: "Carronade volkite",
        stats: ["45", "12", "8", "3", "2"],
        regles: "Déflagration (6)",
        traits: "Volkite",
      },
      {
        nom: "Cardanelle volkite",
        stats: ["45", "12", "7", "5", "2"],
        regles: "Déflagration (7), Neutralisation (1)",
        traits: "Volkite",
      },
      /* --- Arsenal des Maisonnées de Chevaliers et des Legios
         Titaniques. --- */
      {
        nom: "Veuglaire volkite",
        stats: ["30", "5", "7", "5", "1"],
        regles: "Lourde (PF), Déflagration (6)",
        traits: "Volkite",
      },
      {
        nom: "Chieorovile volkite",
        stats: ["45", "5", "7", "4", "2"],
        regles: "Lourde (PF), Déflagration (7)",
        traits: "Volkite",
      },
      /* --- Arsenal des Solar Auxilia (Liber Auxilia) : les Unités
         Solar Auxilia doivent utiliser cette version de l'arme. --- */
      {
        nom: "Serpentine volkite (Solar Auxilia)",
        stats: ["10", "2", "5", "5", "1"],
        regles: "Pistolet, Déflagration (5)",
        traits: "Assaut, Volkite",
      },
      {
        nom: "Chargeur volkite (Solar Auxilia)",
        stats: ["15", "2", "5", "5", "1"],
        regles: "Déflagration (5)",
        traits: "Assaut, Volkite",
      },
      {
        nom: "Arquebuse volkite (Solar Auxilia)",
        stats: ["30", "2", "5", "5", "1"],
        regles: "Déflagration (6)",
        traits: "Volkite",
      },
      {
        nom: "Couleuvrine volkite (Solar Auxilia)",
        stats: ["45", "3", "6", "5", "1"],
        regles: "Lourde (PF), Déflagration (6)",
        traits: "Volkite",
      },
      {
        nom: "Macro-sacre volkite (Solar Auxilia)",
        stats: ["45", "8", "6", "5", "2"],
        regles: "Déflagration (6)",
        traits: "Volkite",
      },
    ],
  },
  {
    titre: "Armes Exotiques et Diverses (Tir)",
    armes: [
      {
        nom: "Harnais à grenades",
        stats: ["6", "1", "5", "6", "1"],
        regles: 'Explosion (3"), Limitée (1)',
        traits: "-",
      },
      {
        nom: "Grenades Frag",
        stats: ["6", "1", "3", "6", "1"],
        regles: 'Explosion (3")',
        traits: "Assaut",
      },
      {
        nom: "Lance-grenades — Frag",
        stats: ["24", "1", "3", "6", "1"],
        regles: "-",
        traits: "-",
      },
      {
        nom: "Lance-grenades — Krak",
        stats: ["24", "1", "6", "4", "2"],
        regles: 'Explosion (3")',
        traits: "-",
      },
      {
        // Arme des Larmes de l'Ange (Blood Angels).
        nom: "Lance-grenades Erelim",
        stats: ["18", "2", "4", "4", "1"],
        regles: "Empoisonnée (2+), Phage (E)",
        traits: "Missile, Rad",
      },
      {
        nom: "Découpeur laser¹",
        stats: ["8", "1", "10", "2", "2"],
        regles: "Artillerie (D), Fléau des Blindages",
        traits: "-",
      },
      {
        // Arme de personnage (Kaedes Nex, Raven Guard) : profil de Tir,
        // voir aussi son profil de Mêlée dans Armes de Mêlée ci-dessous.
        nom: "Canons de poing Fulcrum (Tir)",
        stats: ["12", "5", "6", "4", "1"],
        regles: "Lourde (PF), Brèche (6+), Sonner (0)",
        traits: "Assaut, Auto",
      },
      {
        // Arme de personnage (Corvus Corax, Primarque de la Raven Guard).
        nom: "Colère et Justice",
        stats: ["14", "6", "5", "4", "1"],
        regles: "Brèche (6+)",
        traits: "Assaut",
      },
      {
        // Arme Psychique (Devin de l'Orage, Discipline Appel de l'Orage,
        // White Scars).
        nom: "Foudre Invisible",
        stats: ["36", "1", "4", "4", "1"],
        regles: 'Explosion (5"), Barrage (2), Sonner (2), Force (FT)',
        traits: "Psychique",
      },
      {
        // Arme de personnage (Jaghatai Khan, Primarque des White Scars).
        nom: "Voix de l'Orage",
        stats: ["12", "2", "6", "4", "2"],
        regles: "Brèche (5+), Déflagration (6), Sonner (1)",
        traits: "Assaut",
      },
      {
        // Arme de personnage (Angron, Primarque des World Eaters).
        nom: "Le Fourneau de Hargne",
        stats: ["12", "2", "7", "2", "2"],
        regles: "-",
        traits: "Plasma, Assaut",
      },
      {
        // Arme de personnage (Lotara Sarrin, World Eaters).
        nom: "Pistolet de dotation",
        stats: ["12", "1", "3", "-", "1"],
        regles: "Pistolet",
        traits: "Assaut",
      },
      {
        // Arme de personnage (Vulkan, Primarque des Salamanders).
        nom: "Le Cœur du Fourneau",
        stats: ["18", "1", "7", "2", "3"],
        regles: "Panique (1)",
        traits: "Volkite",
      },
      {
        // Arme de personnage (Vulkan, Primarque des Salamanders).
        nom: "Gantelet Souffle de Dragon",
        stats: ["Souffle", "1", "6", "4", "1"],
        regles: "Souffle, Panique (2)",
        traits: "Flammes",
      },
      {
        // Arme de l'Escouade Pyroclaste (Salamanders) : profil Dispersé,
        // voir aussi Focalisé ci-dessous.
        nom: "Projecteur à flammes Pyroclaste — Dispersé",
        stats: ["Souffle", "1", "6", "4", "1"],
        regles: "Souffle, Panique (1)",
        traits: "Flammes, Fusion",
      },
      {
        // Arme de l'Escouade Pyroclaste (Salamanders) : profil Focalisé,
        // voir aussi Dispersé ci-dessus.
        nom: "Projecteur à flammes Pyroclaste — Focalisé",
        stats: ["12", "1", "8", "2", "2"],
        regles: "Fusion (6)",
        traits: "Flammes, Fusion",
      },
      {
        // Arme de l'Escouade Sanctifier (Salamanders, Legacy) : profil
        // Munitions Standard, voir aussi Munitions Obsidite ci-dessous.
        // « Suppressif (X) » : texte complet non donné dans l'extrait
        // Legacy fourni, à compléter depuis le livre au besoin.
        nom: "Canon rotor Obsidite — Munitions Standard",
        stats: ["24", "3", "3", "-", "1"],
        regles: "Lourde (PF), Suppressif (1)",
        traits: "Auto",
      },
      {
        // Arme de l'Escouade Sanctifier (Salamanders, Legacy) : profil
        // Munitions Obsidite, voir aussi Munitions Standard ci-dessus.
        nom: "Canon rotor Obsidite — Munitions Obsidite",
        stats: ["18", "2", "3", "5", "1"],
        regles: "Lourde (PF), Surcharge (1), Brèche (6+), Touche Critique (6+)",
        traits: "Auto",
      },
      {
        // Arme de personnage (Seigneur Commandant Eidolon, Emperor's
        // Children).
        nom: "Cri Mortel",
        stats: ["Souffle", "1", "3", "5", "1"],
        regles: "Souffle, Brèche (6+), Fixation (0)",
        traits: "Sonique, Assaut",
      },
      {
        // Arsenal des Emperor's Children (IIIe Légion) : équipement
        // optionnel (Escouade Terminator Phénix, Capitaine Lucius).
        nom: "Lance sonique",
        stats: ["Souffle", "1", "2", "5", "1"],
        regles: "Souffle, Brèche (6+)",
        traits: "Sonique, Assaut",
      },
      {
        // Arme de personnage (Ferrus Manus, Primarque des Iron Hands) :
        // profil Alpha-12, voir aussi Epsilon-415 et Phi-71 ci-dessous.
        nom: "La Carapace de Medusa — Alpha-12",
        stats: ["18", "2", "7", "4", "1"],
        regles: "Brèche (4+)",
        traits: "Plasma",
      },
      {
        // Arme de personnage (Ferrus Manus, Primarque des Iron Hands) :
        // profil Epsilon-415, voir aussi Alpha-12 et Phi-71.
        nom: "La Carapace de Medusa — Epsilon-415",
        stats: ["18", "2", "6", "3", "1"],
        regles: "Choc (Fixée), Fixation (1)",
        traits: "Gravitons",
      },
      {
        // Arme de personnage (Ferrus Manus, Primarque des Iron Hands) :
        // profil Phi-71, voir aussi Alpha-12 et Epsilon-415.
        nom: "La Carapace de Medusa — Phi-71",
        stats: ["Souffle", "1", "6", "4", "1"],
        regles: "Souffle, Panique (2)",
        traits: "Flammes",
      },
      /* --- Arsenal de la Death Guard (XIVe Légion) : Mortarion,
         Calas Typhon, Escouade Terminator du Linceul, Garde-tombe
         (voir js/unites-data.js, unités réservées à cette Légion).
         --- */
      {
        // Arme de personnage (Mortarion, Primarque de la Death Guard).
        nom: "La Lanterne",
        stats: ["10", "1", "8", "2", "3"],
        regles: "Fléau des Blindages",
        traits: "Assaut",
      },
      {
        // Arme de personnage (Calas Typhon, Death Guard).
        nom: "Rassasieuse",
        stats: ["Souffle", "1", "3", "-", "1"],
        regles: "Souffle, Pistolet, Empoisonnée (2+), Panique (1)",
        traits: "Assaut",
      },
      {
        // Arme de l'Escouade Terminator du Linceul (Death Guard).
        nom: "Projecteur alchim",
        stats: ["Souffle", "1", "3", "-", "1"],
        regles: "Souffle, Pistolet, Empoisonnée (2+)",
        traits: "Assaut",
      },
      {
        // Arme de l'Unité Garde-tombe (Death Guard) : profil Krak, voir
        // aussi Toxine ci-dessous.
        nom: "Lance-grenades d'assaut — Krak",
        stats: ["18", "2", "6", "4", "2"],
        regles: "-",
        traits: "Assaut",
      },
      {
        // Arme de l'Unité Garde-tombe (Death Guard) : profil Toxine,
        // voir aussi Krak ci-dessus.
        nom: "Lance-grenades d'assaut — Toxine",
        stats: ["18", "3", "6", "5", "1"],
        regles: "Empoisonnée (3+)",
        traits: "Assaut",
      },
      {
        // Arme d'un Garde-tombe de l'Unité Garde-tombe (Death Guard),
        // par tranche de cinq Figurines (option, à la place du
        // lance-grenades d'assaut).
        nom: "Lance-flammes lourd alchim",
        stats: ["Souffle", "5", "4", "1", "1"],
        regles: "Souffle, Empoisonnée (2+)",
        traits: "Assaut",
      },
      /* --- Arsenal des Thousand Sons (XVe Légion) : Magnus le Rouge,
         Magistus Amon, Castellax-Achea (voir js/unites-data.js, unités
         réservées à cette Légion). --- */
      {
        // Arme de personnage (Magnus le Rouge, Primarque des Thousand
        // Sons).
        nom: "Serpentine à feu psychique",
        stats: ["15", "3", "6", "2", "1"],
        regles: "-",
        traits: "Psychique, Assaut",
      },
      {
        // Arme de personnage (Magistus Amon, Thousand Sons) : profil de
        // Tir, voir aussi son profil de Mêlée dans Armes Énergétiques
        // ci-dessous.
        nom: "Le Reliquaire de Cendres",
        stats: ["12", "2D6", "1", "6", "1"],
        regles: "Empoisonnée (5+), Brèche (5+), Sonner (3), Limitée (1)",
        traits: "Psychique, Assaut",
      },
      {
        // Arme du Castellax-Achea (Thousand Sons).
        nom: "Canon à bolts Asphyx",
        stats: ["24", "4", "5", "4", "1"],
        regles: "Vulnérante (4+)",
        traits: "Psychique, Assaut",
      },
      {
        // Arme du Castellax-Achea (Thousand Sons), option à la place du
        // canon à bolts Asphyx.
        nom: "Canon à étherfeu",
        stats: ["24", "1", "6", "4", "2"],
        regles: 'Explosion (3"), Brèche (6+)',
        traits: "Psychique, Assaut",
      },
      {
        // Arme Psychique (Arcane de Prospero Pavoni, Thousand Sons).
        nom: "Ébullition Sanguine",
        stats: ["12", "1", "4", "2", "2"],
        regles: "Empoisonnée (2+)",
        traits: "Psychique",
      },
      {
        // Arme Psychique (Arcane de Prospero Athanéen, Thousand Sons).
        nom: "Manifestation de l'Effroi",
        stats: ["24", "3", "4", "-", "1"],
        regles: "Panique (1)",
        traits: "Psychique",
      },
      {
        // Arme Psychique (Arcane de Prospero Raptora, Thousand Sons).
        nom: "Force Écrasante",
        stats: ["12", "1", "9", "4", "2"],
        regles: "Force (D), Fléau des Blindages",
        traits: "Psychique",
      },
      /* --- Arsenal de l'Alpha Legion (XXe Légion) : Alpharius, Exodus,
         Saboteur (voir js/unites-data.js, unités réservées à cette
         Légion). --- */
      {
        // Arme de personnage (Alpharius, Primarque de l'Alpha Legion).
        nom: "La Hargne de l'Hydre",
        stats: ["18", "2", "7", "3", "1"],
        regles: "Brèche (4+)",
        traits: "Plasma, Assaut",
      },
      {
        // Arme de personnage (Exodus, Alpha Legion) : profil Mode
        // rapide, voir aussi Mode Exécution ci-dessous.
        nom: "L'Instrument — Mode rapide",
        stats: ["24", "3", "6", "3", "1"],
        regles: "-",
        traits: "Assaut",
      },
      {
        // Arme de personnage (Exodus, Alpha Legion) : profil Mode
        // Exécution, voir aussi Mode rapide ci-dessus.
        nom: "L'Instrument — Mode Exécution",
        stats: ["72", "1", "8", "2", "1"],
        regles: "Lourde (D), Fixation (1)",
        traits: "-",
      },
      {
        // Arme de l'Unité Saboteur (Alpha Legion).
        nom: "Fusil à pompe Banestrike",
        stats: ["12", "2", "4", "4", "1"],
        regles: "Brèche (6+), Lacération (6+), Sonner (0)",
        traits: "Assaut",
      },
      {
        // Arsenal de l'Alpha Legion (XXe Légion) : équipement optionnel
        // réservé aux Sous-types État-major ou Champion ayant le Trait
        // Alpha Legion (+5 Points par Figurine).
        nom: "Sphères à venin",
        stats: ["8", "1", "1", "-", "1"],
        regles: 'Explosion (3"), Empoisonnée (4+)',
        traits: "Assaut",
      },
      /* --- Arsenal des Iron Warriors (IVe Légion) : Perturabo,
         Manipule du Cercle de Fer, Escouade Terminator Tyrans de Siège
         (voir js/unites-data.js, unités réservées à cette Légion). --- */
      {
        // Arme de personnage (Perturabo, Primarque des Iron Warriors) :
        // profil de Tir, voir aussi son profil de Mêlée dans Armes de
        // Parangon ci-dessous.
        nom: "L'Arsenal du Logos",
        stats: ["30", "6", "6", "3", "1"],
        regles: "Lacération (4+), Neutralisation (1)",
        traits: "Bolts, Assaut",
      },
      {
        // Arme du Domitar-Ferrum (Manipule du Cercle de Fer, Iron
        // Warriors).
        nom: "Canon à shrapnels jumelé",
        stats: ["36", "6", "5", "5", "1"],
        regles: "Fixation (1), Lacération (5+)",
        traits: "Bolts",
      },
      {
        // Arme de l'Unité Tyran de Siège (Iron Warriors) : profil
        // Saturateur, voir aussi Briseur ci-dessous.
        nom: "Lance-roquettes Tyran — Saturateur",
        stats: ["48", "3", "5", "6", "1"],
        regles: "Lourde (PF), Brèche (6+)",
        traits: "Missile",
      },
      {
        // Arme de l'Unité Tyran de Siège (Iron Warriors) : profil
        // Briseur, voir aussi Saturateur ci-dessus.
        nom: "Lance-roquettes Tyran — Briseur",
        stats: ["48", "1", "9", "3", "1"],
        regles: "Lourde (D), Fléau des Blindages",
        traits: "Missile",
      },
      /* --- Iron Warriors Legacy Wargear (iron_warriors_wargear.pdf) :
         armement additionnel disponible à toute Figurine ayant le
         Trait Iron Warriors (Pistolet/Bolter à shrapnels en échange
         du pistolet bolter/bolter, Masse à gravitons sur les listes
         d'Officier/Sergent de Légion, Canon à shrapnels ajouté aux
         listes d'Armes Sponson/sur Pivot de Légion). Câblé sur les
         Unités Iron Warriors des livres d'armée qui ont l'équipement
         de base correspondant (voir js/unites-data.js : Forgeguerre en
         Armure Artificer, Nârik Dreygur, Iron Havocs, Le Tourmenteur)
         — pas encore proposé aux Unités génériques de Légion (Escouade
         Tactique, Escouade de Soutien, etc.) même quand leur Trait de
         Légion est Iron Warriors, faute d'un mécanisme de liste
         d'équipement conditionnelle par Légion dans ce fichier ; ni au
         Canon à shrapnels sur la liste générique des Armes Lourdes de
         Légion (LISTES_EQUIPEMENT.lourdes), qu'aucune Unité IV Légion
         de ce fichier n'utilise directement pour l'instant. --- */
      {
        nom: "Pistolet à shrapnels",
        stats: ["10", "1", "4", "-", "1"],
        regles: "Fixation (0)",
        traits: "Assaut, Bolts",
      },
      {
        nom: "Bolter à shrapnels",
        stats: ["18", "2", "4", "-", "1"],
        regles: "Fixation (0)",
        traits: "Bolts",
      },
      {
        // Arme de l'Unité Iron Havocs (Iron Warriors) : profil donné
        // tel quel sur sa fiche (encart WARGEAR) — identique au Canon
        // à shrapnels jumelé du Domitar-Ferrum ci-dessus, hormis
        // Fixation (0) au lieu de (1) (arme non jumelée).
        nom: "Canon à shrapnels",
        stats: ["36", "3", "5", "5", "1"],
        regles: "Fixation (0), Lacération (6+)",
        traits: "Bolts",
      },
      {
        // Arme du Tormentor (Iron Warriors) : Shadowsword converti,
        // profil donné tel quel sur sa fiche — distinct des Canons
        // Volcano titaniques de l'Arsenal des Titans (pas de Trait
        // Stratégique, pas de règle Énergivore).
        nom: "Canon Volcano (Shadowsword)",
        stats: ["120", "1", "13", "2", "12"],
        regles: 'Explosion (3"), Macro-auspex',
        traits: "Laser",
      },
      /* --- Arsenal des Night Lords (VIIIe Légion) : Konrad Curze,
         Escouade Terminator Contekar (voir js/unites-data.js, unités
         réservées à cette Légion). --- */
      {
        // Arme de personnage (Konrad Curze, Primarque des Night
        // Lords).
        nom: "Les Endeuilleurs",
        stats: ["12", "3", "4", "5", "1"],
        regles: "Brèche (4+)",
        traits: "Assaut",
      },
      {
        // Arme de l'Unité Terminator Contekar (Night Lords).
        nom: "Caviteur volkite",
        stats: ["10", "4", "6", "5", "1"],
        regles: "Déflagration (6)",
        traits: "Volkite, Assaut",
      },
      /* --- Arsenal des Emperor's Children (IIIe Légion) : Fulgrim,
         Escouade Kakophoni (voir js/unites-data.js, unités réservées à
         cette Légion). --- */
      {
        // Arme de personnage (Fulgrim, Primarque des Emperor's
        // Children).
        nom: "Flambeau",
        stats: ["15", "2", "6", "2", "1"],
        regles: "Lacération (5+), Déflagration (6)",
        traits: "Volkite, Assaut",
      },
      {
        // Arme de l'Unité Escouade Kakophoni (Emperor's Children).
        nom: "La Cacophonie",
        stats: ["36", "3", "6", "5", "1"],
        regles: "Surcharge (1), Sonner (2), Touche Critique (6+)",
        traits: "Sonique",
      },
      /* --- Arsenal des Solar Auxilia (Liber Auxilia). --- */
      {
        nom: "Lance-grenade Hermes — Frag",
        stats: ["18", "1", "3", "6", "1"],
        regles: 'Explosion (3"), Sonner (1)',
        traits: "-",
      },
      {
        nom: "Lance-grenade Hermes — Krak",
        stats: ["18", "2", "7", "4", "2"],
        regles: "-",
        traits: "-",
      },
      /* --- Arsenal des Taghmata du Mechanicum (Liber Mechanicum) :
         armes de personnages/Unités uniques (Scorpion d'Airain, Engin
         Démon Kytan, Decimator, Archimagos Draykavac). --- */
      {
        // Arme du Scorpion d'Airain.
        nom: "Canon Despoiler",
        stats: ["24", "1", "9", "3", "3"],
        regles: "Lourde (D), Fléau des Blindages",
        traits: "-",
      },
      {
        // Arme du Scorpion d'Airain.
        nom: "Canon Hellmaw jumelé",
        stats: ["18", "4", "7", "4", "2"],
        regles: "-",
        traits: "Flammes",
      },
      {
        // Arme optionnelle du Massacreur de Sang.
        nom: "Harpon empaleur",
        stats: ["12", "1", "6", "3", "2"],
        regles: "Fléau des Blindages",
        traits: "-",
      },
      {
        // Arme optionnelle du Decimator.
        nom: "Pétard brûlemânes",
        stats: ["8", "1", "5", "3", "1"],
        regles: 'Explosion (3"), Empoisonnée (3+)',
        traits: "Assaut",
      },
      {
        // Arme de personnage (Archimagos Draykavac) : profil détaillé
        // dans sa Règle Spéciale « Assaut au Liquifractor ».
        nom: "Liquifractor",
        stats: ["1", "3", "2", "6", "1"],
        regles: "Phage (E & F), Empoisonnée (2+), Brèche (4+)",
        traits: "-",
      },
      {
        // Arme principale du Krios Venator.
        nom: "Pulsar plombeur",
        stats: ["24", "1", "9", "3", "2"],
        regles: "Lourde (D), Fléau des Blindages, Antiaérien",
        traits: "-",
      },
      {
        nom: "Incinérateur volkite",
        stats: ["15", "1", "6", "3", "2"],
        regles: "Déflagration (6)",
        traits: "Volkite",
      },
      {
        nom: "Fusil à foudre",
        stats: ["24", "1", "7", "3", "2"],
        regles:
          'Explosion (3"), Lacération (5+), Brèche (5+), Neutralisation (0)',
        traits: "Électro",
      },
    ],
    note: "¹ Notez que cette Arme possède à la fois un profil de Tir et de Mêlée (voir Armes de Mêlée ci-dessous).",
  },
  /* ============================================================
     Arsenal des Maisonnées de Chevaliers et des Legios Titaniques :
     armes montées sur les Chevaliers Questoris et les Titans.
     ============================================================ */
  {
    titre: "Électro-armes",
    armes: [
      {
        nom: "Lanceur galvanique",
        stats: ["24", "3", "3", "6", "1"],
        regles: "Lacération (5+), Vulnérante (5+)",
        traits: "Électro, Assaut",
      },
      {
        nom: "Électropistolet",
        stats: ["12", "2", "6", "5", "1"],
        regles: "Pistolet, Neutralisation (1), Choc (Neutralisée)",
        traits: "Électro, Assaut",
      },
      {
        // Profil de Tir : possède aussi un profil de Mêlée (voir Armes
        // de Mêlée ci-dessous).
        nom: "Lance-choc (Tir)",
        stats: ["18", "6", "7", "3", "1"],
        regles: "Sonner (2)",
        traits: "Électro",
      },
      /* --- Arsenal des Taghmata du Mechanicum (Liber Mechanicum). --- */
      {
        nom: "Fusil à électro",
        stats: ["18", "1", "5", "5", "1"],
        regles: "Lacération (6+), Neutralisation (0)",
        traits: "Assaut, Électro",
      },
      {
        nom: "Électro-éclateur",
        stats: ["24", "6", "6", "5", "1"],
        regles: "Neutralisation (1), Choc (Neutralisée)",
        traits: "Électro",
      },
    ],
  },
  {
    titre: "Armes à Foudre",
    armes: [
      {
        nom: "Mousquet à foudre",
        stats: ["36", "1", "7", "3", "2"],
        regles:
          'Explosion (3"), Brèche (5+), Lacération (5+), Neutralisation (0)',
        traits: "Électro",
      },
      {
        nom: "Canon à foudre",
        stats: ["36", "1", "7", "3", "2"],
        regles:
          'Explosion (5"), Brèche (5+), Lacération (5+), Neutralisation (1)',
        traits: "Électro",
      },
      {
        // Arsenal des Taghmata du Mechanicum (Liber Mechanicum) : les
        // Unités Taghmata doivent utiliser cette version de l'arme.
        nom: "Mousquet à foudre (Mechanicum)",
        stats: ["36", "1", "7", "3", "2"],
        regles:
          'Explosion (3"), Lacération (5+), Brèche (5+), Neutralisation (0)',
        traits: "Électro",
      },
      {
        nom: "Canon à foudre (Mechanicum)",
        stats: ["36", "1", "7", "3", "2"],
        regles:
          'Explosion (5"), Lacération (5+), Brèche (5+), Neutralisation (1)',
        traits: "Électro",
      },
    ],
  },
  {
    titre: "Outils de Découpe du Mechanicum",
    armes: [
      {
        // Profil de Tir : possède aussi un profil de Mêlée (voir Armes
        // de Mêlée ci-dessous).
        nom: "Impulseur laser (Tir)",
        stats: ["8", "1", "9", "2", "4"],
        regles: "Artillerie (D), Fléau des Blindages",
        traits: "Laser",
      },
      {
        nom: "Découpeur de phase Atrapos (Tir)",
        stats: ["12", "1", "10", "2", "6"],
        regles: "Artillerie (D), Fléau des Blindages",
        traits: "Laser",
      },
    ],
  },
  {
    titre: "Armes Tactiques Titaniques",
    armes: [
      {
        nom: "Autocanon Defensor",
        stats: ["48", "3", "7", "4", "2"],
        regles: "Brèche (6+), Antiaérien",
        traits: "Auto, Tactique",
      },
      {
        nom: "Canon à bolts Defensor",
        stats: ["36", "6", "5", "4", "1"],
        regles: "-",
        traits: "Bolts, Tactique",
      },
      {
        nom: "Canon laser Defensor",
        stats: ["48", "2", "9", "2", "2"],
        regles: "Fléau des Blindages",
        traits: "Laser, Tactique",
      },
    ],
  },
  {
    titre: "Armes Stratégiques Titaniques",
    armes: [
      {
        nom: "Méga-bolter Vulcan",
        stats: ["48", "12", "7", "3", "2"],
        regles: "Neutralisation (3)",
        traits: "Bolts, Stratégique",
      },
      {
        nom: "Canon Inferno titanique",
        stats: ["Souffle", "1", "7", "3", "3"],
        regles: "Souffle (Fournaise), Panique (3)",
        traits: "Flammes, Stratégique",
      },
      {
        nom: "Éclateur à plasma titanique — Tir soutenu",
        stats: ["60", "1", "8", "2", "5"],
        regles: 'Explosion (3")',
        traits: "Plasma, Stratégique",
      },
      {
        nom: "Éclateur à plasma titanique — Tir maximal",
        stats: ["60", "1", "9", "2", "7"],
        regles: 'Explosion (5"), Énergivore',
        traits: "Plasma, Stratégique",
      },
      {
        nom: "Destructeur turbo-laser titanique",
        stats: ["96", "1", "12", "2", "6"],
        regles: 'Explosion (3"), Fléau des Blindages',
        traits: "Laser, Stratégique",
      },
      {
        nom: "Éclateur gatling titanique",
        stats: ["82", "5", "9", "2", "4"],
        regles: "Fléau des Blindages",
        traits: "Auto, Stratégique",
      },
      {
        nom: "Éclateur laser titanique",
        stats: ["82", "3", "10", "2", "5"],
        regles: "Fléau des Blindages",
        traits: "Laser, Stratégique",
      },
      {
        nom: "Canon à fusion titanique",
        stats: ["60", "1", "12", "2", "8"],
        regles: 'Explosion (5"), Fusion (48)',
        traits: "Fusion, Stratégique",
      },
      {
        nom: "Canon Volcano titanique",
        stats: ["120", "1", "13", "2", "12"],
        regles: 'Explosion (3"), Énergivore, Macro-auspex',
        traits: "Laser, Stratégique",
      },
      {
        nom: "Lance-missiles Apocalypse",
        stats: ["150", "1", "9", "3", "4"],
        regles: 'Explosion (10"), Brise-bouclier (3)',
        traits: "Missile, Stratégique",
      },
      {
        nom: "Canon sismique Némésis",
        stats: ["150", "1", "12", "2", "10"],
        regles: 'Explosion (5"), Énergivore, Macro-auspex',
        traits: "Laser, Stratégique",
      },
      {
        nom: "Canon Volcano Némésis",
        stats: ["150", "1", "13", "2", "12"],
        regles: 'Explosion (3"), Énergivore, Macro-auspex',
        traits: "Auto, Stratégique",
      },
      {
        nom: "Canon sismique Mori",
        stats: ["150", "1", "12", "2", "10"],
        regles: 'Explosion (5"), Macro-auspex',
        traits: "Laser, Stratégique",
      },
      {
        nom: "Canon Volcano Belicosa",
        stats: ["150", "1", "13", "2", "12"],
        regles: 'Explosion (3"), Macro-auspex',
        traits: "Auto, Stratégique",
      },
      {
        nom: "Macro-éclateur gatling",
        stats: ["96", "5", "10", "2", "5"],
        regles: "Fléau des Blindages, Macro-auspex",
        traits: "Auto, Stratégique",
      },
      {
        nom: "Annihilateur à plasma Sunfury — Tir soutenu",
        stats: ["82", "1", "9", "2", "6"],
        regles: 'Explosion (5"), Macro-auspex',
        traits: "Plasma, Stratégique",
      },
      {
        nom: "Annihilateur à plasma Sunfury — Tir maximal",
        stats: ["82", "1", "12", "2", "9"],
        regles: 'Explosion (7"), Énergivore, Macro-auspex',
        traits: "Plasma, Stratégique",
      },
    ],
  },
  {
    titre: "Armes de Frappe Titaniques",
    armes: [
      {
        nom: "Poing énergétique titanique",
        stats: ["6", "1", "12", "2", "10"],
        regles: "Fléau des Blindages",
        traits: "Frappe",
      },
      {
        nom: "Griffe énergétique Arioch",
        stats: ["8", "1", "13", "2", "12"],
        regles: "Fléau des Blindages",
        traits: "Frappe",
      },
    ],
  },
];

/* ----------------------------------------------------------
   DONNÉES — ARMES DE MÊLÉE
   Colonnes communes : MI, MA, MF, PA, D
   ---------------------------------------------------------- */
const ENTETES_MELEE = ["MI", "MA", "MF", "PA", "D"];

const ARMES_MELEE = [
  {
    titre: "Armes Tronçonneuses",
    armes: [
      {
        nom: "Épée tronçonneuse",
        stats: ["1", "A", "F", "5", "1"],
        regles: "Lacération (6+)",
        traits: "Tronçonneuse",
      },
      {
        nom: "Épée tronçonneuse lourde",
        stats: ["-1", "A", "+2", "4", "1"],
        regles: "Lacération (6+)",
        traits: "Tronçonneuse",
      },
      {
        nom: "Hache tronçonneuse",
        stats: ["-1", "A", "+1", "5", "1"],
        regles: "Lacération (6+)",
        traits: "Tronçonneuse",
      },
      {
        nom: "Hache tronçonneuse lourde",
        stats: ["-2", "A", "+3", "4", "1"],
        regles: "Lacération (6+)",
        traits: "Tronçonneuse",
      },
      {
        nom: "Poing tronçonneur",
        stats: ["-3", "-1", "+6", "2", "2"],
        regles: "Fléau des Blindages, Lacération (6+)",
        traits: "Tronçonneuse",
      },
      {
        nom: "Poing tronçonneur Gravis",
        stats: ["-1", "A", "+4", "2", "3"],
        regles: "Fléau des Blindages, Lacération (6+)",
        traits: "Tronçonneuse",
      },
      {
        nom: "Paire de poings tronçonneurs Gravis",
        stats: ["-1", "A", "+4", "2", "4"],
        regles: "Fléau des Blindages, Lacération (6+)",
        traits: "Tronçonneuse",
      },
      {
        nom: "Baïonnette tronçonneuse",
        stats: ["1", "A", "F", "5", "1"],
        regles: "Lacération (6+)",
        traits: "Baïonnette, Tronçonneuse",
      },
      /* --- Arsenal des Night Lords (VIIIe Légion) : Sevatar, Escouade
         Terminator Contekar, Escouade Terreur, Escouade de Rapaces
         Nocturnes (voir js/unites-data.js, unités réservées à cette
         Légion). --- */
      {
        // Arme de personnage (Sevatar, Night Lords).
        nom: "Murmure de la Nuit",
        stats: ["+1", "A", "+2", "2", "1"],
        regles: "Touche Critique (6+), Lacération (5+)",
        traits: "Tronçonneuse",
      },
      {
        // Arme de l'Unité Terminator Contekar (Night Lords).
        nom: "Lame tronçonneuse",
        stats: ["1", "A", "+1", "3", "1"],
        regles: "Brèche (6+), Lacération (6+)",
        traits: "Tronçonneuse",
      },
      {
        // Arsenal des Night Lords (VIIIe Légion) : échange contre une
        // arme énergétique pour toute Figurine de Sous-type État-major,
        // Champion ou Sergent ayant le Trait Night Lords, +5 Points par
        // Figurine. Arme de l'Escouade Terreur et de l'Escouade de
        // Rapaces Nocturnes (option).
        nom: "Vouge tronçonneur",
        stats: ["1", "A", "+1", "3", "1"],
        regles: "Brèche (6+), Lacération (6+)",
        traits: "Tronçonneuse",
      },
      {
        // Arsenal des Night Lords (VIIIe Légion) : échange contre une
        // arme énergétique pour toute Figurine de Sous-type État-major
        // ayant le Trait Night Lords, +10 Points par Figurine.
        nom: "Hache de bourreau",
        stats: ["-2", "A", "+2", "2", "2"],
        regles: "Touche Critique (6+)",
        traits: "Tronçonneuse",
      },
      /* --- Arsenal des Maisonnées de Chevaliers et des Legios
         Titaniques. --- */
      {
        nom: "Tronçonneur Reaper",
        stats: ["1", "A", "+1", "2", "2"],
        regles: "Fauchage (2), Lacération (5+)",
        traits: "Tronçonneuse",
      },
      {
        nom: "Tronçonneuse Reaper",
        stats: ["-1", "A", "+2", "2", "3"],
        regles: "Fauchage (2), Lacération (4+)",
        traits: "Tronçonneuse",
      },
      {
        nom: "Poing tronçonneur Reaper",
        stats: ["-3", "A", "+3", "2", "6"],
        regles: "Fléau des Blindages",
        traits: "Tronçonneuse",
      },
    ],
  },
  {
    titre: "Armes Charnabales",
    armes: [
      {
        nom: "Sabre charnabal",
        stats: ["+1", "A", "F", "-", "1"],
        regles: "Brèche (6+), Atout du Duelliste (1)",
        traits: "Charnabal",
      },
      {
        nom: "Tabar charnabal",
        stats: ["1", "A", "+1", "-", "1"],
        regles: "Brèche (6+), Atout du Duelliste (1)",
        traits: "Charnabal",
      },
      {
        // Arme de personnage (Saul Tarvitz, Emperor's Children).
        nom: "Espadon charnabal",
        stats: ["1", "A", "+2", "-", "1"],
        regles: "Brèche (5+), Atout du Duelliste (1)",
        traits: "Charnabal",
      },
      /* --- Arsenal des Solar Auxilia (Liber Auxilia) : les Unités
         Solar Auxilia doivent utiliser cette version de l'arme. --- */
      {
        nom: "Sabre charnabal (Solar Auxilia)",
        stats: ["+1", "A", "F", "-", "1"],
        regles: "Brèche (6+), Atout du Duelliste (1)",
        traits: "Charnabal",
      },
      {
        nom: "Tabar charnabal (Solar Auxilia)",
        stats: ["1", "A", "+1", "-", "1"],
        regles: "Brèche (6+), Atout du Duelliste (1)",
        traits: "Charnabal",
      },
    ],
  },
  {
    titre: "Armes de Force",
    armes: [
      {
        nom: "Épée de force",
        stats: ["1", "A", "+1", "3", "1"],
        regles: "Force (D)",
        traits: "Psychique",
      },
      {
        nom: "Hache de force",
        stats: ["-1", "A", "+2", "2", "1"],
        regles: "Force (D)",
        traits: "Psychique",
      },
      {
        nom: "Masse de force",
        stats: ["-1", "A", "+3", "3", "1"],
        regles: "Force (D)",
        traits: "Psychique",
      },
      {
        nom: "Bâton de force",
        stats: ["+1", "A", "+2", "4", "1"],
        regles: "Force (D)",
        traits: "Psychique",
      },
      /* --- Arsenal des Thousand Sons (XVe Légion) : Ahzek Ahriman,
         Sorcier de Prospero (voir js/unites-data.js, unités réservées
         à cette Légion). --- */
      {
        // Arme de personnage (Ahzek Ahriman, Thousand Sons).
        nom: "Le Sceptre Corvidae",
        stats: ["+1", "A", "+1", "2", "1"],
        regles: "Force (D), Touche Critique (6+)",
        traits: "Psychique",
      },
      {
        // Arme de l'Unité Sorcier de Prospero (Thousand Sons).
        nom: "Bâton sorcier de Prospero",
        stats: ["+1", "A", "F", "3", "1"],
        regles: "Force (D), Conduit",
        traits: "Psychique",
      },
    ],
  },
  {
    titre: "Armes Énergétiques",
    armes: [
      {
        nom: "Épée énergétique",
        stats: ["1", "A", "F", "3", "1"],
        regles: "Brèche (6+)",
        traits: "Énergétique",
      },
      {
        // Arme de l'Unité Escouade d'Assaut Locutarus (Ultramarines).
        nom: "Épée énergétique Argean",
        stats: ["I", "A", "F", "3", "1"],
        regles: "Brèche (5+)",
        traits: "Énergétique",
      },
      {
        // Arsenal des Solar Auxilia (Liber Auxilia) : les Unités Solar
        // Auxilia doivent utiliser cette version de l'arme.
        nom: "Épée énergétique (Solar Auxilia)",
        stats: ["1", "A", "F", "3", "1"],
        regles: "Brèche (6+)",
        traits: "Énergétique",
      },
      {
        nom: "Hache énergétique",
        stats: ["-1", "A", "+1", "3", "1"],
        regles: "Brèche (5+)",
        traits: "Énergétique",
      },
      {
        nom: "Masse énergétique",
        stats: ["-1", "A", "+2", "3", "1"],
        regles: "Brèche (6+)",
        traits: "Énergétique",
      },
      {
        nom: "Lance énergétique",
        stats: ["+1", "A", "F", "3", "1"],
        regles: "Précision (6+)",
        traits: "Énergétique",
      },
      {
        nom: "Gantelet énergétique",
        stats: ["-3", "A", "+4", "2", "2"],
        regles: "-",
        traits: "Énergétique",
      },
      {
        // Arsenal des Solar Auxilia (Liber Auxilia) : les Unités Solar
        // Auxilia doivent utiliser cette version de l'arme.
        nom: "Gantelet énergétique (Solar Auxilia)",
        stats: ["-3", "A", "+4", "2", "2"],
        regles: "-",
        traits: "Énergétique",
      },
      {
        nom: "Poing énergétique Gravis",
        stats: ["1", "A", "+3", "2", "3"],
        regles: "-",
        traits: "Énergétique",
      },
      {
        nom: "Paire de poings énergétiques Gravis",
        stats: ["1", "+1", "+3", "2", "3"],
        regles: "-",
        traits: "Énergétique",
      },
      {
        nom: "Marteau Thunder",
        stats: ["-2", "A", "+3", "2", "2"],
        regles: "Brèche (6+)",
        traits: "Énergétique",
      },
      /* --- Arsenal des Solar Auxilia (Liber Auxilia). --- */
      {
        nom: "Hache d'assaut",
        stats: ["-1", "A", "+2", "3", "1"],
        regles: "Brèche (5+), Lacération (5+)",
        traits: "Énergétique",
      },
      {
        nom: "Pinces de Charonite",
        stats: ["1", "A", "7", "3", "2"],
        regles: "Brèche (5+)",
        traits: "Énergétique",
      },
      {
        // Les Unités Solar Auxilia doivent utiliser cette version de
        // l'arme (profil distinct du Marteau Thunder des Legiones
        // Astartes ci-dessus).
        nom: "Marteau Thunder (Solar Auxilia)",
        stats: ["-2", "A", "+3", "2", "2"],
        regles: "-",
        traits: "Énergétique",
      },
      {
        // Arsenal des Imperial Fists : équipement réservé aux Sous-types
        // État-major, Champion ou Sergent ayant le Trait Imperial Fists.
        nom: "Gantelet énergétique Solarite",
        stats: ["-3", "A", "+4", "2", "2"],
        regles: "Touche Critique (6+)",
        traits: "Énergétique",
      },
      {
        // Arme de personnage (Fafnir Rann, Imperial Fists).
        nom: "Le Bourreau et le Chasseur",
        stats: ["1", "A", "+2", "3", "1"],
        regles: "Brèche (4+)",
        traits: "Énergétique",
      },
      {
        // Arme de personnage (Evander Garrius, Imperial Fists).
        nom: "Subjugator",
        stats: ["-2", "A", "+4", "2", "2"],
        regles: "-",
        traits: "Énergétique",
      },
      {
        // Arme de personnage (Camba Diaz, Imperial Fists).
        nom: "Durenda",
        stats: ["1", "A", "+1", "3", "1"],
        regles: "Brèche (5+)",
        traits: "Énergétique",
      },
      {
        // Arme de personnage (Alexis Polux, Imperial Fists) : Profil
        // d'Arme de la Posture Coup de Marteau (voir Règles Spéciales,
        // js/regles-data.js), pas une arme équipée normalement.
        nom: "Coup de Marteau",
        stats: ["1", "1", "10", "2", "3"],
        regles: "Touche Critique (6+)",
        traits: "Énergétique",
      },
      {
        nom: "Crozius Arcanum",
        stats: ["1", "A", "+2", "3", "2"],
        regles: "Vulnérante (6+), Brèche (6+)",
        traits: "Énergétique",
      },
      {
        nom: "Griffe Lightning",
        stats: ["1", "A", "F", "3", "1"],
        regles: "Vulnérante (6+), Brèche (6+)",
        traits: "Énergétique",
      },
      {
        nom: "Paire de griffes Lightning",
        stats: ["1", "+2", "F", "3", "1"],
        regles: "Fauchage (2)",
        traits: "Énergétique",
      },
      {
        nom: "Hache de guerre Saturnine",
        stats: ["1", "A", "+1", "2", "2"],
        regles: "Touche Critique (6+)",
        traits: "Énergétique",
      },
      {
        nom: "Marteau commotionneur Saturnine",
        stats: ["-3", "A", "x2", "2", "3"],
        regles: "-",
        traits: "Énergétique",
      },
      {
        nom: "Poing disrupteur Saturnine",
        stats: ["-2", "A", "+2", "2", "3"],
        regles: "-",
        traits: "Énergétique",
      },
      {
        // Arsenal de la Raven Guard : échange gratuit contre une griffe
        // Lightning pour toute Figurine de Sous-type État-major ayant le
        // Trait Raven Guard.
        nom: "Serre de Corbeau",
        stats: ["1", "A", "F", "3", "1"],
        regles: "Impact (MI), Vulnérante (6+), Brèche (6+)",
        traits: "Énergétique",
      },
      {
        nom: "Paire de Serres de Corbeau",
        stats: ["1", "+2", "F", "3", "1"],
        regles: "Impact (MI), Vulnérante (6+), Brèche (6+)",
        traits: "Énergétique",
      },
      {
        // Arsenal des White Scars : échange contre une arme énergétique
        // pour toute Figurine de Sous-type État-major ayant le Trait
        // White Scars, +10 Points par Figurine.
        nom: "Vouge énergétique",
        stats: ["1", "A", "+1", "3", "1"],
        regles: "Impact (PA), Brèche (5+)",
        traits: "Énergétique",
      },
      {
        // Arme de la Keshig d'Or (White Scars).
        nom: "Lance Énergétique Kontos",
        stats: ["+4", "1", "+5", "3", "2"],
        regles: "Impact (PA), Fléau des Blindages",
        traits: "Énergétique",
      },
      {
        // Arme de personnage (Hibou Khan, White Scars).
        nom: "Le Souffle de la Tempête",
        stats: ["+1", "A", "+2", "3", "1"],
        regles: "Touche Critique (6+), Brèche (4+)",
        traits: "Énergétique",
      },
      {
        // Arme de personnage (Qin Xa, White Scars).
        nom: "Les Queues du Dragon",
        stats: ["1", "A", "+1", "2", "1"],
        regles: "Touche Critique (5+), Précision (3+)",
        traits: "Énergétique",
      },
      {
        // Arme du Dreadnought Contemptor-Incaendius (Blood Angels).
        nom: "Paire de Serres de Perdition",
        stats: ["1", "+2", "F", "2", "2"],
        regles: "En Feu (2)",
        traits: "Énergétique, Flammes",
      },
      {
        // Arme de personnage (Aster Crohne, Blood Angels).
        nom: "Hache Saiphaine",
        stats: ["1", "+1", "+1", "3", "1"],
        regles: "Brèche (4+)",
        traits: "Énergétique",
      },
      {
        // Arme de personnage (Dominion Zephon, Blood Angels).
        nom: "Le Spiritum Sanguis",
        stats: ["1", "A", "+1", "2", "2"],
        regles: "Fauchage (1)",
        traits: "Énergétique",
      },
      {
        // Arme de personnage (Raldoron, Blood Angels).
        nom: "La Lame de Guerre Carmin",
        stats: ["1", "A", "+1", "2", "2"],
        regles: "Impact (MA), Touche Critique (6+)",
        traits: "Énergétique",
      },
      {
        // Arsenal des Blood Angels : échange contre une épée/hache/
        // lance/masse énergétique pour toute Figurine de Sous-type
        // État-major, Champion ou Sergent ayant le Trait Blood Angels,
        // +5 Points par Figurine.
        nom: "Lame de Perdition",
        stats: ["1", "A", "F", "3", "1"],
        regles: "Brèche (6+), En Feu (1)",
        traits: "Énergétique, Flammes",
      },
      {
        nom: "Hache de Perdition",
        stats: ["-1", "A", "+1", "3", "1"],
        regles: "Brèche (5+), En Feu (1)",
        traits: "Énergétique, Flammes",
      },
      {
        nom: "Masse de Perdition",
        stats: ["-1", "A", "+2", "3", "1"],
        regles: "Brèche (6+), En Feu (1)",
        traits: "Énergétique, Flammes",
      },
      {
        nom: "Lance de Perdition",
        stats: ["+1", "A", "F", "3", "1"],
        regles: "Précision (6+), En Feu (1)",
        traits: "Énergétique, Flammes",
      },
      {
        // Arme de personnage (Khârn le Sanglant, World Eaters).
        nom: "La Trancheuse",
        stats: ["I", "A", "+1", "2", "1"],
        regles: "Touche Critique (6+)",
        traits: "Énergétique",
      },
      {
        // Arme de personnage (Khârn le Sanglant, World Eaters) : échange
        // possible contre La Trancheuse si Angron n'est pas dans l'Armée.
        nom: "La Carnassière Reforgée",
        stats: ["I", "A", "+1", "2", "1"],
        regles: "Touche Critique (6+), Lacération (5+)",
        traits: "Tronçonneuse",
      },
      {
        // Arme de personnage (Lotara Sarrin, World Eaters).
        nom: "La Morsure du Conqueror",
        stats: ["1", "A", "F", "2", "1"],
        regles: "-",
        traits: "Énergétique",
      },
      {
        // Arme de l'Escouade Terminator Pyrodracs (Salamanders).
        nom: "Marteau Thunder forgé",
        stats: ["-2", "+1", "+3", "2", "2"],
        regles: "-",
        traits: "Énergétique",
      },
      {
        // Arme de personnage (Seigneur Commandant Eidolon, Emperor's
        // Children).
        nom: "Gloria Aeterna",
        stats: ["-2", "A", "+2", "2", "2"],
        regles: "Touche Critique (6+)",
        traits: "Énergétique",
      },
      {
        // Arsenal des Emperor's Children (IIIe Légion) : échange contre
        // une arme énergétique pour toute Figurine de Sous-type
        // État-major, Champion ou Sergent ayant le Trait Emperor's
        // Children (Escouade Terminator Phénix, +10 Points/Figurine).
        nom: "Lance énergétique Phénix",
        stats: ["+1", "A", "+1", "3", "1"],
        regles: "Impact (D), Brèche (6+)",
        traits: "Énergétique",
      },
      {
        // Arsenal des Ultramarines (XIIIe Légion) : échange contre une
        // hache légatine pour toute Figurine de Sous-type État-major,
        // Champion ou Sergent ayant le Trait Ultramarines, +5 Points
        // par Figurine.
        nom: "Hache légatine",
        stats: ["1", "A", "+1", "3", "1"],
        regles: "Brèche (4+)",
        traits: "Énergétique",
      },
      {
        // Arme de personnage (Remus Ventanus, Ultramarines).
        nom: "Phaeton",
        stats: ["1", "+1", "F", "3", "1"],
        regles: "Brèche (6+), Atout du Duelliste (1)",
        traits: "Énergétique",
      },
      {
        // Arsenal des Dark Angels (Ire Légion) : échange contre une
        // lame de Caliban pour toute Figurine de Sous-type État-major,
        // Champion ou Sergent ayant le Trait Dark Angels, +5 Points
        // par Figurine.
        nom: "Lame de Caliban",
        stats: ["1", "A", "+1", "3", "1"],
        regles: "Brèche (5+)",
        traits: "Épée de l'Ordre",
      },
      {
        // Arsenal des Dark Angels (Ire Légion) : échange gratuit contre
        // un espadon terranique pour toute Figurine de Sous-type
        // État-major ou Champion ayant le Trait Dark Angels. Aussi
        // porté par le Cenobium de Chevaliers du Cercle Intérieur et
        // imposé par l'Avantage Principal Paladin de l'Hekatonystika.
        nom: "Espadon terranique",
        stats: ["-1", "A", "+2", "3", "2"],
        regles: "Brèche (5+)",
        traits: "Épée de l'Ordre",
      },
      {
        // Arme de personnage (Corswain, Dark Angels).
        nom: "La Lame",
        stats: ["1", "A", "+2", "2", "2"],
        regles: "Atout du Duelliste (2)",
        traits: "Énergétique, Épée de l'Ordre",
      },
      {
        // Arsenal des Space Wolves (VIe Légion) : échange contre une
        // épée tronçonneuse pour toute Figurine ayant le Trait Space
        // Wolves, +2 Points par Figurine.
        nom: "Hache de Fenris",
        stats: ["1", "A", "+1", "-", "1"],
        regles: "Fauchage (1)",
        traits: "-",
      },
      {
        // Arsenal des Space Wolves (VIe Légion) : échange contre une
        // arme énergétique pour toute Figurine de Sous-type État-major
        // ou Champion ayant le Trait Space Wolves, +5 Points par
        // Figurine.
        nom: "Épée de givre",
        stats: ["1", "A", "F", "3", "1"],
        regles: "Brèche (5+), Fauchage (1)",
        traits: "Énergétique",
      },
      {
        // Arsenal des Space Wolves (VIe Légion) : voir Épée de givre.
        nom: "Hache de givre",
        stats: ["-1", "A", "+1", "3", "1"],
        regles: "Brèche (4+), Fauchage (1)",
        traits: "Énergétique",
      },
      {
        // Arsenal des Space Wolves (VIe Légion) : échange contre une
        // griffe Lightning pour toute Figurine de Sous-type État-major
        // ou Champion ayant le Trait Space Wolves, +5 Points par
        // Figurine.
        nom: "Griffe de givre",
        stats: ["1", "A", "F", "3", "1"],
        regles: "Brèche (4+), Fauchage (1), Lacération (6+)",
        traits: "Énergétique",
      },
      {
        // Arsenal des Space Wolves (VIe Légion) : échange contre une
        // arme énergétique pour toute Figurine de Sous-type État-major
        // ou Champion ayant le Trait Space Wolves, +10 Points par
        // Figurine.
        nom: "Grande lame de givre",
        stats: ["-2", "A", "+3", "2", "2"],
        regles: "Fauchage (1)",
        traits: "Énergétique",
      },
      {
        // Arme de personnage (Geigor Main Terrible, Space Wolves).
        nom: "La Main Terrible",
        stats: ["1", "A", "F", "3", "1"],
        regles: "Brèche (4+), Lacération (5+)",
        traits: "Énergétique",
      },
      {
        // Arme de personnage (Hvarl Lamerouge, Space Wolves).
        nom: "Fend l'Âtre",
        stats: ["1", "A", "+2", "2", "2"],
        regles: "Fléau des Blindages",
        traits: "Énergétique",
      },
      {
        // Arme de personnage (Shadrak Meduson, Iron Hands).
        nom: "Gladius énergétique albien",
        stats: ["1", "A", "+1", "3", "1"],
        regles: "Brèche (6+)",
        traits: "Énergétique",
      },
      {
        // Arsenal des Iron Hands (Xe Légion) : équipement des Terminators
        // Gorgone et des Révérends de Fer ayant le Trait Iron Hands.
        nom: "Hache énergétique d'artificier",
        stats: ["-1", "A", "+1", "3", "1"],
        regles: "Brèche (5+), Lacération (5+)",
        traits: "Énergétique",
      },
      /* --- Arsenal des Sons of Horus (XVIe Légion) : Émissaire Noir,
         Ezekyle Abaddon, Horus Aximand, Tybalt Marr, Vheren Ashurhaddon
         (voir js/unites-data.js, unités réservées à cette Légion).
         Stats des armes de personnage À VÉRIFIER (pages peu lisibles
         sur les photos, notamment près de la reliure pour Abaddon et
         Aximand). --- */
      {
        // Arme de personnage (Émissaire Noir, Sons of Horus).
        nom: "Sceptre de Sombre Autorité",
        stats: ["1", "A", "+1", "3", "1"],
        regles: "Touche Critique (6+)",
        traits: "Énergétique",
      },
      {
        // Arme de personnage (Ezekyle Abaddon, Sons of Horus).
        nom: "Griffe Énergétique Cthonienne",
        stats: ["-2", "A", "+4", "2", "2"],
        regles: "Lacération (5+)",
        traits: "Énergétique",
      },
      {
        // Arme de personnage (Horus Aximand, « Deuil-de-Tout »,
        // Sons of Horus).
        nom: "Deuil-de-Tout",
        stats: ["1", "A", "+1", "2", "2"],
        regles: "Touche Critique (6+)",
        traits: "Énergétique",
      },
      {
        // Arme de personnage (Tybalt Marr, Sons of Horus).
        nom: "La Lame d'Abattage",
        stats: ["I", "A", "F", "3", "1"],
        regles: "Empoisonné (2+), Touche Critique (6+), Brèche (5+)",
        traits: "-",
      },
      {
        // Arme de personnage (Vheren Ashurhaddon, Sons of Horus).
        nom: "La Hache Serpentis",
        stats: ["+1", "A", "F", "2", "1"],
        regles: "Touche Critique (6+)",
        traits: "Énergétique",
      },
      {
        // Arsenal des Sons of Horus (XVIe Légion) : échange contre une
        // arme énergétique pour toute Figurine ayant le Trait Sons of
        // Horus, +5 Points par Figurine.
        nom: "Hache énergétique carsoraine",
        stats: ["-1", "A", "+1", "3", "1"],
        regles: "Brèche (5+), Lacération (6+)",
        traits: "Énergétique",
      },
      {
        // Arsenal des Sons of Horus (XVIe Légion) : voir Hache
        // énergétique carsoraine, +10 Points par Figurine.
        nom: "Tabar énergétique carsoraine",
        stats: ["-2", "A", "+2", "3", "1"],
        regles: "Brèche (5+), Lacération (5+)",
        traits: "Énergétique",
      },
      /* --- Arsenal des Word Bearers (XVIIe Légion) : Kor Phaeron,
         Erebus, Argel Tal, Zardu Layak, Gal Vorbak, Dreadnought Mhara
         Gal (voir js/unites-data.js, unités réservées à cette
         Légion). --- */
      {
        // Arme de personnage (Kor Phaeron, Word Bearers).
        nom: "Griffes du Patriarche",
        stats: ["1", "A", "F", "2", "1"],
        regles: "Lacération (6+)",
        traits: "Énergétique",
      },
      {
        // Arme de personnage (Erebus, Word Bearers).
        nom: "Crux Malefica",
        stats: ["1", "A", "+3", "2", "2"],
        regles: "Phage (F)",
        traits: "Énergétique, Psychique",
      },
      {
        // Arme de personnage (Argel Tal, Word Bearers).
        nom: "Serres Démoniaques",
        stats: ["1", "A", "F", "2", "2"],
        regles: "-",
        traits: "Psychique",
      },
      {
        // Arme de personnage (Zardu Layak, Word Bearers).
        nom: "L'Azurda Char'is",
        stats: ["+1", "A", "+2", "4", "2"],
        regles: "Force (D)",
        traits: "Psychique",
      },
      {
        // Arme de personnage (Anakatis Kul, compagnon de Zardu Layak,
        // Word Bearers).
        nom: "Épée Anakatis",
        stats: ["1", "A", "F", "3", "2"],
        regles: "Brèche (6+), Phage (F)",
        traits: "Psychique",
      },
      {
        // Arme de l'Unité Gal Vorbak (Word Bearers).
        nom: "Serres Souillées",
        stats: ["1", "A", "F", "3", "1"],
        regles: "Brèche (6+), Lacération (6+), Phage (F)",
        traits: "Psychique",
      },
      {
        // Arme du Dreadnought Mhara Gal (Word Bearers).
        nom: "Griffe Souillée",
        stats: ["1", "A", "+3", "2", "3"],
        regles: "-",
        traits: "Psychique, Énergétique",
      },
      {
        // Arme de l'Escouade du Cercle de Cendres (Word Bearers).
        nom: "Hache-croc",
        stats: ["1", "A", "+1", "3", "1"],
        regles: "Touche Critique (6+), Phage (M)",
        traits: "Tronçonneuse",
      },
      /* --- Arsenal de la Death Guard (XIVe Légion) : Calas Typhon,
         Escouade Terminator du Linceul (voir js/unites-data.js,
         unités réservées à cette Légion). --- */
      {
        // Arme de personnage (Calas Typhon, Death Guard).
        nom: "Lakrimae",
        stats: ["-1", "A", "+2", "2", "2"],
        regles: "Fauchage (3), Empoisonnée (3+)",
        traits: "Énergétique",
      },
      {
        // Arsenal de la Death Guard (XIVe Légion) : arme de l'Escouade
        // Terminator du Linceul, ouverte en option à toute Figurine de
        // Sous-type État-major, Champion, Spécialiste ou Sergent ayant
        // le Trait Death Guard (+10 Pts en échange d'une arme
        // énergétique, +5 Pts en échange d'un gantelet énergétique).
        nom: "Faux énergétique",
        stats: ["-1", "A", "+1", "3", "1"],
        regles: "Fauchage (2), Brèche (5+)",
        traits: "Énergétique",
      },
      /* --- Arsenal des Thousand Sons (XVe Légion) : Castellax-Achea,
         Cabale de Terminators Sekhmet, Cabale du Khenetai Occulte,
         Magistus Amon (voir js/unites-data.js, unités réservées à
         cette Légion). --- */
      {
        // Arme du Castellax-Achea (Thousand Sons).
        nom: "Griffes de force Achea",
        stats: ["1", "A", "+1", "3", "2"],
        regles: "Brèche (5+)",
        traits: "Psychique",
      },
      {
        // Arsenal des Thousand Sons (XVe Légion) : arme de l'Unité
        // Cabale de Terminators Sekhmet, ouverte en option à toute
        // Figurine de Sous-type État-major ou Champion ayant le Trait
        // Thousand Sons (+5 Points par Figurine).
        nom: "Épée de force modèle Achea",
        stats: ["1", "A", "+1", "3", "1"],
        regles: "Brèche (5+)",
        traits: "Psychique",
      },
      {
        // Arme de l'Unité Cabale du Khenetai Occulte (Thousand Sons).
        nom: "Paire d'épées de force Achea",
        stats: ["1", "+1", "+1", "3", "1"],
        regles: "Brèche (5+)",
        traits: "Psychique",
      },
      {
        // Arme de personnage (Magistus Amon, Thousand Sons) : profil de
        // Mêlée, voir aussi son profil de Tir dans Armes Exotiques et
        // Diverses (Tir) ci-dessus. MF transcrit « F » (lettre ambiguë
        // sur la photo, lue « S ») : à vérifier contre le livre.
        nom: "Le Reliquaire de Cendres",
        stats: ["1", "A", "F", "2", "1"],
        regles: "Empoisonnée (2+)",
        traits: "Psychique",
      },
      {
        // Arme Psychique (Arcane de Prospero Pyrae, Thousand Sons).
        nom: "Étreinte Brûlante",
        stats: ["1", "1", "8", "3", "2"],
        regles: "Brèche (5+), Touche Critique (6+), Fléau des Blindages",
        traits: "Psychique",
      },
      /* --- Arsenal de l'Alpha Legion (XXe Légion) : Armillus Dynat,
         Exodus, Chasseur de Têtes, Saboteur (voir js/unites-data.js,
         unités réservées à cette Légion). --- */
      {
        // Arme de personnage (Armillus Dynat, Alpha Legion) : profil Le
        // Prince, voir aussi Le Prophète ci-dessous.
        nom: "Le Prince",
        stats: ["1", "A", "F", "3", "1"],
        regles: "Brèche (5+), Coup de Tonnerre",
        traits: "Énergétique",
      },
      {
        // Arme de personnage (Armillus Dynat, Alpha Legion) : profil Le
        // Prophète, voir aussi Le Prince ci-dessus.
        nom: "Le Prophète",
        stats: ["-2", "-1", "+3", "2", "2"],
        regles: "-",
        traits: "Énergétique",
      },
      {
        // Arsenal de l'Alpha Legion (XXe Légion) : équipement optionnel
        // (échange gratuit) réservé aux Sous-types État-major, Champion
        // ou Sergent ayant le Trait Alpha Legion. Arme de l'Unité
        // Exodus, Chasseur de Têtes et Saboteur (voir js/unites-data.js).
        nom: "Dague énergétique",
        stats: ["+2", "A", "-1", "3", "1"],
        regles: "Brèche (5+)",
        traits: "Énergétique",
      },
      /* --- Arsenal des Iron Warriors (IVe Légion) : équipement
         optionnel réservé aux Sous-types État-major ou Champion ayant
         le Trait Iron Warriors (échange gratuit contre un marteau
         Thunder). Voir js/unites-data.js, unités réservées à cette
         Légion (Forgeguerre, Manipule du Cercle de Fer). --- */
      {
        nom: "Broyeur à gravitons",
        stats: ["-2", "A", "+4", "2", "2"],
        regles: "Fléau des Blindages, Choc (Fixée)",
        traits: "Gravitons",
      },
      {
        // Iron Warriors Legacy Wargear (iron_warriors_wargear.pdf) :
        // ajoutée aux listes d'Équipement d'Officier de Légion et
        // d'Armes de Mêlée de Sergent de Légion pour toute Figurine
        // ayant le Trait Iron Warriors, +15 Points. Câblée pour
        // l'instant sur le Forgeguerre en Armure Artificer ci-dessous
        // uniquement (voir js/unites-data.js) — pas encore ajoutée aux
        // listes génériques LISTES_EQUIPEMENT.officier/meleeSergent.
        nom: "Masse à gravitons",
        stats: ["-1", "A", "+3", "3", "1"],
        regles: "Fléau des Blindages, Choc (Fixée)",
        traits: "Gravitons",
      },
      {
        // Arme de personnage (Nârik Dreygur, Le Fossoyeur, Iron
        // Warriors) : profil donné tel quel sur sa fiche.
        nom: "Gantelet à gravitons",
        stats: ["-3", "A", "+3", "2", "2"],
        regles: "Choc (Fixée)",
        traits: "Gravitons, Énergétique",
      },
      {
        // Arme de l'Unité Terminator Contekar (Night Lords), option à
        // la place de la lame tronçonneuse pour le Dissident.
        nom: "Griffe énergétique Escaton",
        stats: ["-2", "A", "+3", "2", "2"],
        regles: "Lacération (6+)",
        traits: "Énergétique",
      },
      /* --- Arsenal des Maisonnées de Chevaliers et des Legios
         Titaniques. --- */
      {
        nom: "Gantelet Thunderstrike",
        stats: ["-2", "-1", "+3", "2", "4"],
        regles: "Touche Critique (6+), Impact (F), Choc (Neutralisée)",
        traits: "Énergétique",
      },
      {
        nom: "Lame de guerre Tempest",
        stats: ["1", "A", "F", "2", "2"],
        regles: "Fauchage (6), En Feu (2)",
        traits: "Énergétique",
      },
    ],
  },
  {
    titre: "Armes de Parangon",
    armes: [
      {
        nom: "Lame de parangon",
        stats: ["1", "A", "+1", "2", "1"],
        regles: "Touche Critique (6+)",
        traits: "-",
      },
      /* --- Arsenal des Solar Auxilia (Liber Auxilia) : les Unités
         Solar Auxilia doivent utiliser cette version de l'arme. --- */
      {
        nom: "Lame de parangon (Solar Auxilia)",
        stats: ["1", "A", "+1", "2", "1"],
        regles: "Touche Critique (6+)",
        traits: "-",
      },
      {
        // Arme de personnage (Lion El'Jonson, Primarque des Dark
        // Angels).
        nom: "L'Épée du Lion",
        stats: ["1", "A", "+2", "2", "3"],
        regles: "-",
        traits: "Énergétique, Épée de l'Ordre",
      },
      {
        // Arme de personnage (Lion El'Jonson, Primarque des Dark
        // Angels) : échange possible gratuit contre l'Épée du Lion.
        nom: "La Lame du Loup",
        stats: ["1", "A", "F", "3", "1"],
        regles: "Lacération (4+), Brèche (4+), Fauchage (2)",
        traits: "Tronçonneuse, Épée de l'Ordre",
      },
      {
        // Arme de personnage (Leman Russ, Primarque des Space Wolves).
        nom: "L'Épée de Malenuit",
        stats: ["1", "A", "+1", "2", "2"],
        regles: "Touche Critique (5+)",
        traits: "-",
      },
      {
        // Arme de personnage (Leman Russ, Primarque des Space Wolves).
        nom: "La Hache de l'Infernhiver",
        stats: ["1", "A", "+2", "2", "2"],
        regles: "Fléau des Blindages, Fauchage (1)",
        traits: "-",
      },
      {
        // Arme de personnage (Ferrus Manus, Primarque des Iron Hands).
        nom: "Brise-forge",
        stats: ["-1", "A", "+3", "2", "3"],
        regles: "Touche Critique (5+)",
        traits: "Énergétique",
      },
      {
        // Arme de personnage (Corvus Corax, Primarque de la Raven Guard).
        nom: "Talionis",
        stats: ["+4", "3", "F", "3", "2"],
        regles: "Brèche (6+)",
        traits: "Énergétique",
      },
      {
        nom: "Les Serres Corvidées",
        stats: ["+1", "+2", "F", "2", "1"],
        regles: "Touche Critique (6+)",
        traits: "Énergétique",
      },
      {
        // Arme de personnage (Jaghatai Khan, Primarque des White Scars).
        nom: "Le Dao du Tigre Blanc",
        stats: ["+2", "A", "F", "2", "2"],
        regles: "Impact (MA), Atout du Duelliste (1)",
        traits: "Énergétique",
      },
      {
        // Arme de personnage (Sanguinius, Primarque des Blood Angels).
        nom: "La Lame Carmin",
        stats: ["1", "A", "+1", "2", "2"],
        regles: "Touche Critique (5+), Impact (MA)",
        traits: "Énergétique",
      },
      {
        nom: "Lance de Telesto",
        stats: ["-1", "-2", "+3", "2", "2"],
        regles: "Fléau des Blindages, Choc (Neutralisée)",
        traits: "Énergétique",
      },
      {
        nom: "Lame d'Argent Lunaire",
        stats: ["1", "A", "F", "3", "2"],
        regles: "Atout du Duelliste (1)",
        traits: "Énergétique",
      },
      {
        // Arme de personnage (Angron, Primarque des World Eaters).
        nom: "La Carnivore et la Carnassière",
        stats: ["1", "+1", "F", "2", "2"],
        regles: "Touche Critique (6+), Lacération (5+)",
        traits: "Tronçonneuse",
      },
      {
        // Arme de personnage (Angron Transfiguré, World Eaters) : profil
        // Éviscération, voir aussi Concassage ci-dessous.
        nom: "Lames de l'Ange Rouge — Éviscération",
        stats: ["1", "A", "F", "2", "2"],
        regles: "Fauchage (2)",
        traits: "-",
      },
      {
        // Arme de personnage (Angron Transfiguré, World Eaters) : profil
        // Concassage, voir aussi Éviscération ci-dessus.
        nom: "Lames de l'Ange Rouge — Concassage",
        stats: ["-2", "4", "+4", "2", "4"],
        regles: "Touche Critique (6+), Fléau des Blindages",
        traits: "-",
      },
      {
        // Arme de personnage (Vulkan, Primarque des Salamanders).
        nom: "Amène-l'Aube",
        stats: ["1", "A", "+2", "2", "3"],
        regles: "Touche Critique (5+), Fléau des Blindages",
        traits: "Énergétique",
      },
      {
        // Arme de personnage (Rogal Dorn, Primarque des Imperial Fists).
        nom: "Dents de la Tempête",
        stats: ["1", "A", "F", "2", "2"],
        regles: "Lacération (4+), Fauchage (2)",
        traits: "Tronçonneuse",
      },
      {
        // Arme de personnage (Roboute Guilliman, Primarque des
        // Ultramarines).
        nom: "Le Gladius Incandor",
        stats: ["1", "A", "F", "3", "2"],
        regles: "Brèche (5+), Atout du Duelliste (1)",
        traits: "Énergétique",
      },
      {
        // Arme de personnage (Roboute Guilliman, Primarque des
        // Ultramarines).
        nom: "La Main de Domination",
        stats: ["-3", "A", "+4", "2", "3"],
        regles: "Fléau des Blindages",
        traits: "Énergétique",
      },
      {
        // Arme de personnage (Horus Lupercal / Horus Exalté, Primarque
        // des Sons of Horus). Profil de Mêlée : possède aussi un
        // profil de Tir (voir Armes à Bolts ci-dessus).
        nom: "La Serre du Maître de Guerre",
        stats: ["1", "A", "F", "2", "1"],
        regles: "Fauchage (3), Lacération (6+)",
        traits: "Énergétique",
      },
      {
        // Arme de personnage (Horus Lupercal / Horus Exalté, Primarque
        // des Sons of Horus, « Worldbreaker »).
        nom: "Briseuse de Mondes",
        stats: ["-2", "A", "+4", "2", "3"],
        regles: "Touche Critique (5+)",
        traits: "Énergétique",
      },
      {
        // Arme de personnage (Lorgar, Primarque des Word Bearers).
        // MI confirmé "I" par Jean lors d'une précédente relecture ;
        // la capture la plus récente affiche plutôt "1" à cette
        // colonne (police proche) — à confirmer en dernier ressort.
        nom: "Illuminarum",
        stats: ["I", "A", "+2", "2", "3"],
        regles: "Touche Critique (5+), Phage (F), Fauchage (2)",
        traits: "Énergétique",
      },
      {
        // Arme de personnage (Lorgar, Primarque des Word Bearers).
        nom: "Dévotion",
        stats: ["12", "1", "8", "2", "2"],
        regles: "Choc (Fixée), Fixation (0)",
        traits: "Gravitons, Assaut",
      },
      {
        // Arme de personnage (Mortarion, Primarque de la Death Guard).
        // Profil de Mêlée : possède aussi un profil de Tir (voir
        // Armes Exotiques et Diverses (Tir) ci-dessus, La Lanterne).
        nom: "Silence",
        stats: ["-1", "A", "+1", "2", "2"],
        regles: "Fauchage (3), Touche Critique (6+)",
        traits: "Énergétique",
      },
      {
        // Arme de personnage (Magnus le Rouge, Primarque des Thousand
        // Sons). Profil de Mêlée : possède aussi un profil de Tir (voir
        // Armes Exotiques et Diverses (Tir) ci-dessus, Serpentine à feu
        // psychique).
        nom: "La Lame d'Ahn-nunurta",
        stats: ["1", "+1", "F", "2", "2"],
        regles: "Force (D)",
        traits: "Psychique",
      },
      {
        // Arme de personnage (Alpharius, Primarque de l'Alpha Legion).
        nom: "La Lance Pâle",
        stats: ["+1", "A", "+1", "2", "2"],
        regles: "Touche Critique (5+), Fléau des Blindages, Phage (F)",
        traits: "Énergétique",
      },
      {
        // Arme de personnage (Autilon Skorr, Consul-Delegatus de
        // l'Alpha Legion) : profil donné tel quel sur sa fiche, sous
        // l'intitulé « Ranged Weapon » alors que ses colonnes (IM/AM/SM)
        // sont celles d'une arme de Mêlée — coquille du PDF source,
        // transcrite ici dans la bonne table.
        nom: "Rime-shard",
        stats: ["1", "A", "+2", "2", "1"],
        regles: "-",
        traits: "Énergétique",
      },
      {
        // Arme de personnage (Perturabo, Primarque des Iron Warriors) :
        // profil de Mêlée, voir aussi son profil de Tir dans Armes
        // Exotiques et Diverses (Tir) ci-dessus.
        nom: "L'Arsenal du Logos",
        stats: ["1", "+2", "6", "3", "1"],
        regles: "Lacération (4+)",
        traits: "Énergétique",
      },
      {
        // Arme de personnage (Perturabo, Iron Warriors) : jadis celle
        // de Ferrus Manus, Primarque des Iron Hands.
        nom: "Brise-forge Profané",
        stats: ["-2", "A", "+3", "2", "2"],
        regles: "Touche Critique (5+)",
        traits: "Énergétique",
      },
      {
        // Arme de personnage (Konrad Curze, Primarque des Night
        // Lords).
        nom: "Miséricorde et Pardon",
        stats: ["1", "+2", "F", "2", "1"],
        regles: "Touche Critique (5+), Lacération (4+)",
        traits: "Énergétique",
      },
      {
        // Arme de personnage (Fulgrim, Primarque des Emperor's
        // Children).
        nom: "Lame Laërienne",
        stats: ["1", "A", "F", "2", "2"],
        regles: "Atout du Duelliste (1)",
        traits: "-",
      },
      {
        // Arme de personnage (Fulgrim Transfiguré, Emperor's Children) :
        // profil Coups de décapitation, voir aussi Coups de fendoir
        // ci-dessous.
        nom: "Lames du Phénicien — Coups de décapitation",
        stats: ["1", "A", "F", "2", "2"],
        regles: "Touche Critique (6+), Atout du Duelliste (1)",
        traits: "-",
      },
      {
        // Arme de personnage (Fulgrim Transfiguré, Emperor's Children) :
        // profil Coups de fendoir, voir aussi Coups de décapitation
        // ci-dessus.
        nom: "Lames du Phénicien — Coups de fendoir",
        stats: ["-2", "3", "+5", "2", "4"],
        regles: "Touche Critique (6+), Atout du Duelliste (1)",
        traits: "-",
      },
    ],
  },
  {
    // Arsenal des World Eaters (XIIe Légion) : armes rituelles des
    // Saccageurs (Escouade Saccageuse, voir js/unites-data.js, unité
    // réservée à cette Légion). Chaque Figurine équipée d'une arme des
    // Caedere choisit un de ces quatre profils.
    titre: "Armes des Caedere",
    armes: [
      {
        nom: "Marteau météore",
        stats: ["1", "-1", "+2", "3", "2"],
        regles: "Impact (MI)",
        traits: "Énergétique",
      },
      {
        nom: "Hache tronçonneuse Excoriator",
        stats: ["-2", "A", "+2", "3", "1"],
        regles: "Brèche (6+), Lacération (6+)",
        traits: "Tronçonneuse",
      },
      {
        nom: "Paire de falax",
        stats: ["1", "+2", "F", "3", "1"],
        regles: "-",
        traits: "Énergétique",
      },
      {
        nom: "Fouet barbelé",
        stats: ["+1", "A", "F", "3", "1"],
        regles: "Touche Critique (6+), Phage (F)",
        traits: "Énergétique",
      },
    ],
  },
  {
    titre: "Armes Exotiques et Diverses (Mêlée)",
    armes: [
      {
        nom: "Découpeur laser¹",
        stats: ["-3", "1", "12", "2", "4"],
        regles: "-",
        traits: "-",
      },
      {
        // Arme de personnage (Kaedes Nex, Raven Guard) : profil de
        // Mêlée, voir aussi son profil de Tir dans Armes de Tir.
        nom: "Canons de poing Fulcrum (Mêlée)",
        stats: ["1", "+1", "6", "2", "1"],
        regles: "Lacération (5+)",
        traits: "-",
      },
      {
        // Arme de personnage (Capitaine Lucius, Emperor's Children).
        nom: "Lames de Lucius",
        stats: ["1", "A", "F", "2", "2"],
        regles: "Atout du Duelliste (1)",
        traits: "-",
      },
      {
        // Arme de l'Escouade de Lames Palatines (Emperor's Children).
        nom: "Lame palatine",
        stats: ["1", "A", "+1", "3", "1"],
        regles: "Brèche (5+), Atout du Duelliste (1)",
        traits: "-",
      },
      {
        // Arme de personnage (Marduk Sedras, Dark Angels).
        nom: "La Mort des Mondes",
        stats: ["-2", "A", "+5", "2", "3"],
        regles: "-",
        traits: "-",
      },
      {
        // Attaque bonus des Mort-jurés (Space Wolves), voir la Règle
        // Spéciale Les Songes du Loup Funeste.
        nom: "Frappe d'agonie",
        stats: ["1", "1", "+1", "3", "1"],
        regles: "Brèche (5+)",
        traits: "Énergétique",
      },
      {
        // Arme de Freki et Geri, les loups de Leman Russ (Space Wolves).
        nom: "Crocs et Griffes",
        stats: ["1", "A", "F", "4", "2"],
        regles: "Brèche (6+)",
        traits: "-",
      },
      {
        nom: "Grenades Krak",
        stats: ["-3", "1", "6", "4", "2"],
        regles: "-",
        traits: "-",
      },
      {
        nom: "Bombes à fusion",
        stats: ["-3", "1", "9", "2", "4"],
        regles: "Détonation",
        traits: "-",
      },
      {
        nom: "Pince de siège Leviathan",
        stats: ["1", "A", "+2", "2", "3"],
        regles: "Fléau des Blindages, Détonation",
        traits: "-",
      },
      {
        nom: "Paire de pinces de siège Leviathan",
        stats: ["1", "+1", "+2", "2", "3"],
        regles: "-",
        traits: "-",
      },
      {
        nom: "Trépan de siège Leviathan",
        stats: ["-2", "A", "+4", "2", "3"],
        regles: "-",
        traits: "-",
      },
      {
        nom: "Paire de trépans de siège Leviathan",
        stats: ["-2", "A", "+4", "2", "3"],
        regles: "Fléau des Blindages",
        traits: "-",
      },
      {
        nom: "Baïonnette",
        stats: ["1", "A", "F", "5", "1"],
        regles: "Fléau des Blindages",
        traits: "Baïonnette",
      },
      /* --- Arsenal des Solar Auxilia (Liber Auxilia) : les Unités
         Solar Auxilia doivent utiliser cette version de l'arme. --- */
      {
        nom: "Grenades Krak (Solar Auxilia)",
        stats: ["-3", "1", "6", "4", "2"],
        regles: "Détonation",
        traits: "-",
      },
      {
        nom: "Bombes à fusion (Solar Auxilia)",
        stats: ["-3", "1", "9", "2", "4"],
        regles: "Fléau des Blindages, Détonation",
        traits: "Baïonnette",
      },
      {
        nom: "Baïonnette (Solar Auxilia)",
        stats: ["1", "A", "F", "5", "1"],
        regles: "-",
        traits: "-",
      },
      {
        // Arme de personnage (Sigismund, Imperial Fists).
        nom: "L'Épée Noire",
        stats: ["1", "A", "+2", "2", "1"],
        regles: "Touche Critique (6+), Atout du Duelliste (2)",
        traits: "-",
      },
      /* --- Arsenal des Taghmata du Mechanicum (Liber Mechanicum) :
         armes de personnages/Unités uniques. --- */
      {
        // Arme du Scorpion d'Airain.
        nom: "Pinces Hellcrusher",
        stats: ["-3", "3", "+3", "2", "3"],
        regles: "Fléau des Blindages",
        traits: "-",
      },
      {
        // Arme de l'Engin Démon Kytan.
        nom: "Fondoir de massacre",
        stats: ["-2", "4", "+4", "2", "3"],
        regles: "Fléau des Blindages, Lacération (5+)",
        traits: "-",
      },
      {
        nom: "Lames de Massacreur",
        stats: ["1", "4", "+2", "3", "1"],
        regles: "Lacération (5+)",
        traits: "-",
      },
      {
        // Arme par défaut du Decimator (deux exemplaires).
        nom: "Pince Decimator",
        stats: ["-1", "2", "+2", "2", "2"],
        regles: "Fléau des Blindages",
        traits: "-",
      },
      {
        // Arme du Manipule de Combat Domitar.
        nom: "Poings de Domitar",
        stats: ["-2", "A", "+3", "2", "3"],
        regles: "Brèche (6+)",
        traits: "-",
      },
      {
        // Arme de la Cohorte d'Ursarax.
        nom: "Paire de griffes d'Ursarax",
        stats: ["1", "+1", "+2", "3", "2"],
        regles: "Lacération (5+)",
        traits: "-",
      },
      {
        // Arme optionnelle de l'Armigère Moirax.
        nom: "Pince de siège Gyges",
        stats: ["-2", "A", "+3", "2", "3"],
        regles: "Fléau des Blindages, Détonation",
        traits: "-",
      },
      {
        nom: "Vouglaire volkite",
        stats: ["+1", "A", "7", "2", "2"],
        regles: "Déflagration (6)",
        traits: "Volkite",
      },
      {
        // Arme de l'Escadron de Stratos Vultarax.
        nom: "Serres dendrites",
        stats: ["1", "A", "+1", "3", "1"],
        regles: "Lacération (5+)",
        traits: "-",
      },
    ],
    note: "¹ Notez que cette Arme possède à la fois un profil de Tir et de Mêlée (voir Armes de Tir ci-dessus).",
  },
  /* ============================================================
     Arsenal des Maisonnées de Chevaliers et des Legios Titaniques :
     armes montées sur les Chevaliers Questoris et les Titans.
     ============================================================ */
  {
    titre: "Électro-armes",
    armes: [
      {
        // Profil de Mêlée : possède aussi un profil de Tir (voir Armes
        // de Tir ci-dessus).
        nom: "Lance-choc (Mêlée)",
        stats: ["1", "A", "+1", "2", "4"],
        regles: "Impact (MI & D), Choc (Sonnée)",
        traits: "Électro",
      },
      {
        nom: "Électrolance",
        stats: ["+1", "A", "+1", "3", "1"],
        regles: "Précision (6+), Choc (Neutralisée)",
        traits: "Électro",
      },
      {
        nom: "Électromasse",
        stats: ["-1", "A", "+3", "3", "2"],
        regles: "Choc (Neutralisée)",
        traits: "Électro",
      },
    ],
  },
  {
    titre: "Outils de Découpe du Mechanicum",
    armes: [
      {
        // Profil de Mêlée : possède aussi un profil de Tir (voir Armes
        // de Tir ci-dessus).
        nom: "Impulseur laser (Mêlée)",
        stats: ["-3", "-1", "10", "2", "5"],
        regles: "Fléau des Blindages",
        traits: "Laser",
      },
      {
        nom: "Découpeur de phase Atrapos (Mêlée)",
        stats: ["-2", "-1", "12", "2", "6"],
        regles: "Fléau des Blindages",
        traits: "Laser",
      },
    ],
  },
  {
    titre: "Destructeurs de Siège",
    armes: [
      {
        nom: "Pince de siège Gyges",
        stats: ["1", "A", "+5", "3", "3"],
        regles: "Brise-blindage (5+), Brèche (5+)",
        traits: "Énergétique",
      },
      {
        nom: "Paire de pinces de siège Gyges",
        stats: ["1", "A", "+6", "3", "4"],
        regles: "Brise-blindage (5+), Brèche (5+)",
        traits: "Énergétique",
      },
      {
        nom: "Pince de siège Hekaton",
        stats: ["-1", "A", "x2", "3", "3"],
        regles: "Brise-blindage (4+), Brèche (4+), Choc (Fixée)",
        traits: "Énergétique",
      },
    ],
  },
];
