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
        // Arsenal des Blood Angels : échange contre un pistolet à
        // plasma pour toute Figurine ayant le Trait Blood Angels,
        // +5 Points par Figurine.
        nom: "Pistolet Inferno",
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
    ],
    note: "¹ Notez que cette Arme possède à la fois un profil de Tir et de Mêlée (voir Armes de Mêlée ci-dessous).",
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
      {
        // Arme de personnage (Sigismund, Imperial Fists).
        nom: "L'Épée Noire",
        stats: ["1", "A", "+2", "2", "1"],
        regles: "Touche Critique (6+), Atout du Duelliste (2)",
        traits: "-",
      },
    ],
    note: "¹ Notez que cette Arme possède à la fois un profil de Tir et de Mêlée (voir Armes de Tir ci-dessus).",
  },
];
