/* ============================================================
   armes.js — Arsenal des Legiones Astartes (page armes.html)
   Auteur : Jean · Créé : 2026-07-15
   Rôle   : encode les tables d'armes du livre de règles, les rend
   dynamiquement (une table HTML par catégorie) et les filtre en
   temps réel via la barre de recherche (nom de l'arme uniquement). Chaque
   règle spéciale de la colonne « Règles spéciales » est doublée
   d'une info-bulle reprenant sa définition (voir page regles.html).
   Dépend : js/regles-data.js (texte des règles, chargé avant ce
   script) — stylé par css/style.css.
   Sécurité : textContent partout, jamais innerHTML (anti-XSS).
   Transcription manuelle depuis le livre de règles : en cas de
   doute, c'est toujours le livre qui fait référence (voir encadré
   en haut de la page).
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
        regles: "Explosion (3\"), Brèche (5+), Artillerie (D), Sonner (1)",
        traits: "-",
      },
      {
        nom: "Bombarde Morbus — Obus HE",
        stats: ["36", "1", "9", "4", "1"],
        regles:
          "Artillerie (D), Explosion (5\"), Barrage (2), Brèche (6+), Fixation (1)",
        traits: "-",
      },
      {
        nom: "Bombarde Morbus — Obus à phosphex*",
        stats: ["24", "1", "5", "3", "1"],
        regles:
          "Explosion (5\"), Barrage (1), Panique (3), Empoisonnée (3+), Brèche (5+)",
        traits: "Phosphex",
      },
      {
        nom: "Lanceur quadruple — Frag",
        stats: ["60", "1", "5", "5", "1"],
        regles: "Lourde (PF), Explosion (5\"), Barrage (2)",
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
          "Explosion (3\"), Barrage (1), Panique (3), Empoisonnée (3+), Brèche (5+)",
        traits: "Phosphex",
      },
      {
        nom: "Canon de siège Dreadhammer",
        stats: ["24", "1", "12", "3", "3"],
        regles: "Artillerie (D), Explosion (5\"), Brèche (5+), Sonner (1)",
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
        regles: "Explosion (5\"), Sonner (2)",
        traits: "Auto",
      },
      {
        nom: "Canon accélérateur Fellblade — Obus AE",
        stats: ["100", "1", "12", "2", "3"],
        regles: "Explosion (3\"), Artillerie (D)",
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
        regles: "Artillerie (D), Explosion (5\"), Sonner (1)",
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
          "Explosion (3\"), Brèche (6+), Choc (Fixée), Fixation (1), Limitée (1), Combi",
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
        regles: "Lourde (FT), Explosion (3\")",
        traits: "Conversion",
      },
      {
        nom: "Canon à conversion (15-30 pas)",
        stats: ["15-30", "1", "7", "3", "2"],
        regles: "Lourde (FT), Explosion (3\")",
        traits: "Conversion",
      },
      {
        nom: "Canon à conversion (> 30-45 pas)",
        stats: [">30-45", "1", "8", "2", "3"],
        regles: "Lourde (FT), Explosion (3\")",
        traits: "Conversion",
      },
      {
        nom: "Canon à conversion lourd (< 15 pas)",
        stats: ["<15", "1", "6", "4", "1"],
        regles: "Lourde (FT), Explosion (5\")",
        traits: "Conversion",
      },
      {
        nom: "Canon à conversion lourd (15-30 pas)",
        stats: ["15-30", "1", "7", "3", "2"],
        regles: "Lourde (FT), Explosion (5\")",
        traits: "Conversion",
      },
      {
        nom: "Canon à conversion lourd (> 30-45 pas)",
        stats: [">30-45", "1", "8", "2", "3"],
        regles: "Lourde (FT), Explosion (5\")",
        traits: "Conversion",
      },
      {
        nom: "Canon à inversion (< 15 pas)",
        stats: ["<15", "1", "8", "2", "3"],
        regles: "Lourde (FT), Explosion (5\")",
        traits: "Conversion",
      },
      {
        nom: "Canon à inversion (15-30 pas)",
        stats: ["15-30", "1", "7", "3", "2"],
        regles: "Lourde (FT), Explosion (5\")",
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
        regles: "Explosion (3\"), Brèche (6+), Choc (Fixée), Fixation (1)",
        traits: "Gravitons",
      },
      {
        nom: "Canon à gravitons",
        stats: ["36", "1", "8", "3", "1"],
        regles:
          "Lourde (D), Explosion (3\"), Brèche (6+), Choc (Fixée), Fixation (2)",
        traits: "Gravitons",
      },
      {
        nom: "Canon à charge-graviton",
        stats: ["24", "1", "9", "3", "2"],
        regles:
          "Lourde (D), Explosion (5\"), Barrage (1), Brèche (6+), Choc (Fixée), Fixation (3)",
        traits: "Gravitons",
      },
      {
        nom: "Bombarde à graviflux",
        stats: ["18", "1", "7", "4", "1"],
        regles:
          "Lourde (D), Explosion (5\"), Brèche (6+), Choc (Fixée), Fixation (2)",
        traits: "Gravitons",
      },
      {
        nom: "Pulvériseur à gravitons",
        stats: ["18", "1", "9", "3", "3"],
        regles:
          "Lourde (D), Explosion (3\"), Brèche (6+), Choc (Fixée), Fixation (3)",
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
        regles: "Explosion (3\"), Fléau des Blindages",
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
        regles: "Lourde (FT), Explosion (5\"), Fusion (6)",
        traits: "Fusion",
      },
      {
        nom: "Fuseur-éclateur",
        stats: ["36", "2", "9", "2", "4"],
        regles: "Lourde (FT), Explosion (3\"), Fusion (3)",
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
        regles: "Lourde (FT), Explosion (3\")",
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
        regles: "Explosion (5\")",
        traits: "Missile",
      },
      {
        nom: "Lanceur Havoc",
        stats: ["48", "1", "5", "5", "1"],
        regles: "Explosion (3\"), Sonner (1)",
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
        regles: "Lourde (PF), Explosion (3\"), Barrage (1)",
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
        regles: "Explosion (7\"), Barrage (2), Neutralisation (1)",
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
        regles: "Explosion (5\"), Panique (1)",
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
        regles: "Lourde (FT), Explosion (5\")",
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
        regles: "Lourde (PF), Explosion (3\"), Barrage (2)",
        traits: "Missile",
      },
      {
        nom: "Lance-missiles Scorpius",
        stats: ["48", "1", "8", "4", "1"],
        regles: "Brèche (5+)",
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
        regles: "Barrage (3), Explosion (5\"), Limitée (1)",
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
        regles: "Explosion (3\"), Empoisonnée (3+), Panique (3), Brèche (5+)",
        traits: "Phosphex",
      },
      {
        nom: "Déchargeur à phosphex",
        stats: ["18", "1", "5", "3", "1"],
        regles:
          "Explosion (3\"), Limitée (3), Empoisonnée (3+), Panique (3), Brèche (5+)",
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
        regles: "Explosion (3\"), Barrage (1), Brèche (6+)",
        traits: "Plasma",
      },
      {
        nom: "Bombarde à plasma — Tir maximal",
        stats: ["24", "1", "7", "4", "1"],
        regles: "Explosion (3\"), Barrage (1), Brèche (5+), Surcharge (2)",
        traits: "Plasma",
      },
      {
        nom: "Bombarde à plasma lourde — Tir soutenu",
        stats: ["36", "1", "7", "4", "2"],
        regles: "Explosion (5\"), Barrage (1), Brèche (6+)",
        traits: "Plasma",
      },
      {
        nom: "Bombarde à plasma lourde — Tir maximal",
        stats: ["36", "1", "8", "4", "2"],
        regles: "Explosion (5\"), Barrage (1), Brèche (5+), Surcharge (2)",
        traits: "Plasma",
      },
      {
        nom: "Canon à plasma — Tir soutenu",
        stats: ["36", "1", "6", "4", "1"],
        regles: "Lourde (FT), Explosion (3\"), Brèche (6+)",
        traits: "Plasma",
      },
      {
        nom: "Canon à plasma — Tir maximal",
        stats: ["36", "1", "6", "4", "1"],
        regles: "Lourde (FT), Explosion (3\"), Brèche (5+), Surcharge (2)",
        traits: "Plasma",
      },
      {
        nom: "Canon à plasma Gravis — Tir soutenu",
        stats: ["36", "1", "7", "4", "1"],
        regles: "Lourde (FT), Explosion (5\"), Brèche (6+)",
        traits: "Plasma",
      },
      {
        nom: "Canon à plasma Gravis — Tir maximal",
        stats: ["36", "1", "7", "4", "2"],
        regles: "Lourde (FT), Explosion (5\"), Brèche (5+), Surcharge (1)",
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
        regles: "Explosion (5\"), Brèche (5+)",
        traits: "Plasma",
      },
      {
        nom: "Destructeur à plasma Executioner — Tir maximal",
        stats: ["36", "1", "8", "4", "2"],
        regles: "Explosion (5\"), Brèche (4+), Surcharge (1)",
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
        regles: "Lourde (FT), Explosion (5\"), Brèche (4+), Surcharge (1)",
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
        regles: "Explosion (5\"), Brèche (4+), Surcharge (1)",
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
        regles: "Explosion (3\"), Limitée (1)",
        traits: "-",
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
        regles: "Explosion (3\")",
        traits: "-",
      },
      {
        nom: "Découpeur laser¹",
        stats: ["8", "1", "10", "2", "2"],
        regles: "Artillerie (D), Fléau des Blindages",
        traits: "-",
      },
    ],
    note:
      "¹ Notez que cette Arme possède à la fois un profil de Tir et de Mêlée (voir Armes de Mêlée ci-dessous).",
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
    ],
    note:
      "¹ Notez que cette Arme possède à la fois un profil de Tir et de Mêlée (voir Armes de Tir ci-dessus).",
  },
];

/* ----------------------------------------------------------
   SÉLECTION DES ARMES JOUÉES
   Mémorisée dans le navigateur (localStorage) pour que le joueur
   retrouve sa sélection d'une visite à l'autre.
   ---------------------------------------------------------- */
const CLE_SELECTION_ARMES = "hh-armes-selection";

/** Ensemble des clés d'armes cochées (idConteneur::titreCategorie::nom). */
let selectionArmes = new Set();

function chargerSelectionArmes() {
  try {
    const brut = localStorage.getItem(CLE_SELECTION_ARMES);
    return brut ? new Set(JSON.parse(brut)) : new Set();
  } catch (erreur) {
    return new Set();
  }
}

function sauvegarderSelectionArmes() {
  try {
    localStorage.setItem(
      CLE_SELECTION_ARMES,
      JSON.stringify([...selectionArmes]),
    );
  } catch (erreur) {
    /* stockage indisponible (navigation privée, quota…) : on ignore */
  }
}

/* ----------------------------------------------------------
   RENDU DES TABLES D'ARMES
   ---------------------------------------------------------- */

/**
 * Retire les accents pour une recherche plus tolérante ("brèche" = "breche").
 * Voir la même fonction dans js/regles.js pour le détail de la technique.
 */
function normaliserArme(texte) {
  return texte
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

/* ----------------------------------------------------------
   DÉFINITIONS DES RÈGLES SPÉCIALES (pour les info-bulles)
   Les intitulés des tables d'armes portent une valeur concrète
   (ex : "Brèche (5+)") alors que REGLES_ARMES/REGLES_DIVERSES (voir
   js/regles-data.js) les nomment avec un "(X)" générique : on indexe
   donc par nom de base, sans parenthèse.
   ---------------------------------------------------------- */
const DEFINITIONS_REGLES = new Map();
[...REGLES_ARMES, ...REGLES_DIVERSES].forEach((regle) => {
  const base = normaliserArme(regle.nom.replace(/\s*\([^)]*\)\s*$/, ""));
  DEFINITIONS_REGLES.set(base, regle.texte);
});

/**
 * Retrouve la définition d'une règle à partir de son intitulé tel
 * qu'utilisé dans une table d'armes (ex : "Brèche (5+)"). En repli, on
 * retire un "e" final du nom de base pour absorber les rares accords
 * grammaticaux (ex : "Empoisonnée" dans les tables d'armes vs
 * "Empoisonné" dans le lexique des règles).
 * @param {string} intitule
 * @returns {string|null}
 */
function trouverDefinitionRegle(intitule) {
  const base = normaliserArme(intitule.replace(/\s*\([^)]*\)\s*$/, ""));
  if (DEFINITIONS_REGLES.has(base)) return DEFINITIONS_REGLES.get(base);
  if (base.endsWith("e") && DEFINITIONS_REGLES.has(base.slice(0, -1))) {
    return DEFINITIONS_REGLES.get(base.slice(0, -1));
  }
  return null;
}

/**
 * Construit la table HTML d'une catégorie d'armes et l'insère dans le
 * conteneur cible, précédée de son titre (h3).
 * @param {string} idConteneur - id de la div où insérer la catégorie
 * @param {Array}  entetes     - libellés des colonnes de stats (ex: ["P","PF","FT","PA","D"])
 * @param {Object} categorie   - { titre, armes, note }
 */
function construireCategorieArmes(idConteneur, entetes, categorie) {
  const conteneur = document.getElementById(idConteneur);
  if (!conteneur) return;

  const section = document.createElement("div");
  section.className = "groupe-armes";

  const h3 = document.createElement("h3");
  h3.textContent = categorie.titre;
  section.appendChild(h3);

  const table = document.createElement("table");
  const caption = document.createElement("caption");
  caption.className = "sr-only";
  caption.textContent = categorie.titre;
  table.appendChild(caption);

  // --- En-tête ---
  const thead = document.createElement("thead");
  const trEntete = document.createElement("tr");

  const thSelection = document.createElement("th");
  thSelection.scope = "col";
  thSelection.className = "col-selection";
  const libelleSelection = document.createElement("span");
  libelleSelection.className = "sr-only";
  libelleSelection.textContent = "Jouée";
  thSelection.appendChild(libelleSelection);
  trEntete.appendChild(thSelection);

  const thNom = document.createElement("th");
  thNom.scope = "col";
  thNom.className = "gauche";
  thNom.textContent = "Arme";
  trEntete.appendChild(thNom);

  entetes.forEach((libelle) => {
    const th = document.createElement("th");
    th.scope = "col";
    th.textContent = libelle;
    trEntete.appendChild(th);
  });

  const thRegles = document.createElement("th");
  thRegles.scope = "col";
  thRegles.className = "gauche";
  thRegles.textContent = "Règles spéciales";
  trEntete.appendChild(thRegles);

  const thTraits = document.createElement("th");
  thTraits.scope = "col";
  thTraits.className = "gauche";
  thTraits.textContent = "Traits";
  trEntete.appendChild(thTraits);

  thead.appendChild(trEntete);
  table.appendChild(thead);

  // --- Corps : une ligne par arme ---
  const tbody = document.createElement("tbody");
  categorie.armes.forEach((arme) => {
    const tr = document.createElement("tr");
    tr.dataset.recherche = normaliserArme(arme.nom);

    const tdSelection = document.createElement("td");
    tdSelection.className = "col-selection";
    const caseSelection = document.createElement("input");
    caseSelection.type = "checkbox";
    caseSelection.className = "case-selection";
    const cleSelection = idConteneur + "::" + categorie.titre + "::" + arme.nom;
    caseSelection.checked = selectionArmes.has(cleSelection);
    caseSelection.setAttribute("aria-label", "Jouée : " + arme.nom);
    caseSelection.addEventListener("change", () => {
      if (caseSelection.checked) selectionArmes.add(cleSelection);
      else selectionArmes.delete(cleSelection);
      sauvegarderSelectionArmes();
      appliquerFiltresArmes();
    });
    tdSelection.appendChild(caseSelection);
    tr.appendChild(tdSelection);

    const thNomArme = document.createElement("th");
    thNomArme.scope = "row";
    thNomArme.className = "gauche";
    thNomArme.textContent = arme.nom;
    tr.appendChild(thNomArme);

    arme.stats.forEach((valeur) => {
      const td = document.createElement("td");
      td.textContent = valeur;
      tr.appendChild(td);
    });

    const tdRegles = document.createElement("td");
    tdRegles.className = "gauche";
    if (arme.regles && arme.regles !== "-") {
      arme.regles.split(",").forEach((token, i) => {
        const intitule = token.trim();
        if (i > 0) tdRegles.appendChild(document.createTextNode(", "));

        const definition = trouverDefinitionRegle(intitule);
        if (!definition) {
          tdRegles.appendChild(document.createTextNode(intitule));
          return;
        }

        const tag = document.createElement("span");
        tag.className = "regle-tag";
        tag.tabIndex = 0;
        tag.textContent = intitule;

        const bulle = document.createElement("span");
        bulle.className = "tooltip";
        bulle.textContent = definition;
        tag.appendChild(bulle);

        tdRegles.appendChild(tag);
      });
    } else {
      tdRegles.textContent = "-";
    }
    tr.appendChild(tdRegles);

    const tdTraits = document.createElement("td");
    tdTraits.className = "gauche";
    tdTraits.textContent = arme.traits || "-";
    tr.appendChild(tdTraits);

    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  const scroll = document.createElement("div");
  scroll.className = "table-scroll";
  scroll.appendChild(table);
  section.appendChild(scroll);

  if (categorie.note) {
    const note = document.createElement("p");
    note.className = "arme-note";
    note.textContent = categorie.note;
    section.appendChild(note);
  }

  conteneur.appendChild(section);
}

/** Construit toutes les catégories d'un groupe (Tir ou Mêlée). */
function afficherArmes(idConteneur, entetes, categories) {
  categories.forEach((categorie) =>
    construireCategorieArmes(idConteneur, entetes, categorie),
  );
}

/* ----------------------------------------------------------
   FILTRES (recherche + sélection) EN TEMPS RÉEL
   Filtre chaque ligne d'arme selon la recherche textuelle et,
   si activée, la case « N'afficher que les armes sélectionnées »,
   puis masque une catégorie entière (titre + intro + table) si
   plus aucune de ses armes ne correspond, puis masque une grande
   section (Tir/Mêlée) si plus aucune de ses catégories n'est
   visible.
   ---------------------------------------------------------- */
function appliquerFiltresArmes() {
  const champ = document.getElementById("recherche");
  const compteur = document.getElementById("compteur");
  const filtreSelection = document.getElementById("filtre-selection");
  const requete = champ ? normaliserArme(champ.value.trim()) : "";
  const seulementSelection = filtreSelection ? filtreSelection.checked : false;
  let visibles = 0;

  document.querySelectorAll(".groupe-armes tbody tr").forEach((ligne) => {
    const correspondRecherche = ligne.dataset.recherche.includes(requete);
    const estSelectionnee = ligne.querySelector(".case-selection").checked;
    const correspond =
      correspondRecherche && (!seulementSelection || estSelectionnee);
    ligne.classList.toggle("cachee", !correspond);
    if (correspond) visibles++;
  });

  document.querySelectorAll(".groupe-armes").forEach((groupe) => {
    const resteVisible =
      groupe.querySelector("tbody tr:not(.cachee)") !== null;
    groupe.style.display = resteVisible ? "" : "none";
  });

  // Une grande section (Armes de Tir / Armes de Mêlée) disparaît si
  // aucune de ses catégories (.groupe-armes) n'est restée visible.
  document.querySelectorAll(".groupe-regles").forEach((section) => {
    const auMoinsUnGroupeVisible = Array.from(
      section.querySelectorAll(".groupe-armes"),
    ).some((groupe) => groupe.style.display !== "none");
    section.style.display = auMoinsUnGroupeVisible ? "" : "none";
  });

  if (compteur) {
    const total = document.querySelectorAll(".groupe-armes tbody tr").length;
    compteur.textContent =
      requete || seulementSelection
        ? visibles + " arme(s) trouvée(s) sur " + total
        : "";
  }
}

function activerRechercheArmes() {
  const champ = document.getElementById("recherche");
  if (!champ) return;
  champ.addEventListener("input", appliquerFiltresArmes);
}

/** Câble la case « N'afficher que les armes sélectionnées » et le
 * bouton « Tout décocher ». */
function activerControlesSelectionArmes() {
  const filtreSelection = document.getElementById("filtre-selection");
  if (filtreSelection) {
    filtreSelection.addEventListener("change", appliquerFiltresArmes);
  }

  const reinitialiser = document.getElementById("reinitialiser-selection");
  if (reinitialiser) {
    reinitialiser.addEventListener("click", () => {
      selectionArmes.clear();
      sauvegarderSelectionArmes();
      document
        .querySelectorAll(".case-selection")
        .forEach((caseACocher) => (caseACocher.checked = false));
      appliquerFiltresArmes();
    });
  }
}

/* ----------------------------------------------------------
   INITIALISATION
   ---------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  selectionArmes = chargerSelectionArmes();

  afficherArmes("armes-tir", ENTETES_TIR, ARMES_TIR);
  afficherArmes("armes-melee", ENTETES_MELEE, ARMES_MELEE);
  activerRechercheArmes();
  activerControlesSelectionArmes();
  appliquerFiltresArmes();

  // Les .regle-tag viennent d'être créées ci-dessus : on relance le
  // câblage d'accessibilité des info-bulles (voir js/main.js), dont le
  // propre passage au DOMContentLoaded a déjà eu lieu à ce stade.
  if (window.cablerInfoBulles) window.cablerInfoBulles();
});
