/* ============================================================
   armes.js — Arsenal des Legiones Astartes (page armes.html)
   Auteur : Jean · Créé : 2026-07-15
   Rôle   : encode les tables d'armes du livre de règles, les rend
   dynamiquement (une table HTML par catégorie) et les filtre en
   temps réel via la barre de recherche (nom, règles, traits).
   Dépend : aucun (vanilla JS) — stylé par css/style.css.
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
    intro:
      "Fonctionnant en général sur les mêmes principes que l'armement à bolts ou auto, ces armes sont traitées à part en vertu de leur calibre démesuré, d'où découle le format prodigieux des pièces elles-mêmes, telles qu'elles ont servi à abattre les forteresses de quiconque s'opposait à l'Empereur. Prévues pour traiter des cibles à des portées extrêmes et pour venir à bout des ennemis que leur armure et leur résilience intrinsèques rendent à l'épreuve de tirs moins puissants, ces pièces lourdes recourent à des charges explosives énormes ou à une technologie perce-blindage avancée pour se donner le potentiel que les autres armes n'égalent pas.",
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
    intro:
      "Malgré le renouveau de la puissance humaine dans la galaxie que la Grande Croisade a suscité, les arts et la grandeur passée du genre humain relèvent en grande part de la mythologie, hormis quelques reliques qui ont bravé les ténèbres étouffantes de l'Antique Nuit. Ces reliques comptent notamment des armes de poing dont l'élégance le dispute à la puissance de feu.",
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
    intro:
      "Une arme auto propulse un projectile plein au moyen d'une déflagration chimique. On ne rencontre presque plus chez les Legiones Astartes de vieux fusils automatiques, mais les autocanons demeurent en service de par la fiabilité que confère leur simplicité, et cette catégorie comprend aussi des instruments plus sophistiqués comme les canons d'assaut et les canons accélérateurs magnétiques.",
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
    intro:
      "Branche de l'armement devenue commune chez les Legiones Astartes, les armes à bolts tirent une munition autopropulsée sans étui munie d'un détonateur réagissant à la masse de la cible, largement capable d'éviscérer la plupart des adversaires. Leur succès fut tel qu'elles supplantèrent leurs homologues plus complexes de facture martienne qui régnaient jadis sur les arsenaux des Legiones Astartes.",
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
    intro:
      "Cette innovation terrienne d'antan associe un bolter à une autre arme secondaire de sorte à conférer aux formations de guerriers d'élite un surcroît de puissance de feu au moment décisif de la bataille. Chaque Arme Combinée est faite de deux composants : un bolter en guise de composant Principal, et un composant Secondaire (lance-flammes, fuseur, fusil à plasma, chargeur volkite, lance-grenades à Krak, désintégrateur ou fusil à gravitons).",
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
    intro:
      "Ces armes à énergie ésotériques tirent un faisceau qui provoque une implosion subatomique dans la cible, le faisceau gagnant en puissance avec la distance jusqu'à atteindre son seuil d'instabilité final. Très ardues à utiliser, elles servent surtout à des opérateurs spécialisés (Techmarines, Destructors du Mechanicum) pour ouvrir des brèches lors d'un siège ou d'un abordage d'astronef. La colonne « P » indique la tranche de distance à laquelle correspond chaque profil.",
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
    intro:
      "Ces armes terriennes brutales dissocient les molécules de la cible, qui vole tout simplement en éclats qu'elle soit faite de chair ou de céramite. Courantes pendant l'Antique Nuit, ces armes étaient appréciées aussi bien pour leur impact psychologique que pour l'efficacité de leurs décharges foudroyantes.",
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
    intro:
      "Domaine mal connu même chez les technoprêtres de Mars, les armes dites « à gravitons » forment une famille de projecteurs si sophistiqués que les quelques exemplaires encore en service sont des reliques d'un âge perdu. À pleine puissance, elles peuvent broyer les organes et briser les os à l'intérieur même d'une armure, mais leur fonction première est d'entraver les actions de l'ennemi et d'endommager les machineries sans provoquer d'explosions secondaires.",
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
    intro:
      "Le feu est une des plus anciennes armes en usage chez les Legiones Astartes, car il a toujours été radical contre les créatures qui rôdent dans le noir. De nombreuses Légions jugent le pouvoir purificateur des flammes crucial pour leur arsenal, et l'aptitude de ces armes à chasser l'ennemi de ses positions retranchées a fait basculer plus d'une bataille.",
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
    intro:
      "Dans l'Imperium, le terme « laser » s'applique à une gamme d'armes à particules aussi simples que l'omniprésent canon laser, ou aussi complexes et meurtrières que le canon à onde neutronique. De par leur aptitude à projeter une grande quantité d'énergie, on les rencontre souvent sous forme d'armes antichars chez les Legiones Astartes.",
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
    intro:
      "Capables de focaliser des micro-ondes en faisceaux qui liquéfient les meilleurs blindages, les plus terribles armes antichars accessibles aux guerriers de l'Empereur comptent parmi les armes à fusion, en service chez les Legiones Astartes dès leur fondation.",
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
    intro:
      "Des missiles aux roquettes explosives, les Legiones Astartes font usage d'un éventail de munitions à moteur-fusée, le plus souvent avec l'humble lance-missiles d'infanterie, mais il existe aussi des lanceurs montés sur véhicule servant de pièces d'artillerie ou antiaériennes.",
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
    intro:
      "Le flux de particules puissamment chargées que ces armes projettent érode l'ennemi atome par atome.",
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
    intro:
      "Le phosphex est un composé corrosif, toxique et incendiaire rare qui présente un danger drastique pour toute forme de vie. Au contact de l'air, il forme un brouillard fluide qui se consume dans d'étranges flammes blanc vert que le moindre mouvement attire ; rien ne peut les éteindre hormis le vide complet. Les Légions de Space Marines la conservent dans leurs arsenaux en dernier recours.",
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
    intro:
      "Ces armes que seuls les technoprêtres de Mars maîtrisent déchaînent des projectiles de plasma porté à une température suffocante pour fondre les armures aussi facilement que la chair. Confiné dans des bouteilles magnétiques capricieuses, le plasma qui alimente ces armes est aussi dangereux pour l'utilisateur que pour l'ennemi : les fuites, voire les explosions, ne sont pas rares. La plupart des armes à plasma proposent deux profils : Tir soutenu (plus sûr) et Tir maximal (plus puissant, mais Surcharge).",
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
    intro:
      "En dotation uniquement contre les xénoformes les plus dangereuses, les grenades et ogives dites « Rad » émettent en détonant un flux de radiations brèves et intenses dont les retombées contaminent les abords immédiats. Outre les dégâts directs, on peut s'en servir en bombardement de zone afin d'affaiblir une cible pour la rendre vulnérable à d'autres attaques.",
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
    intro:
      "Au moyen de puissantes ondes sonores concentrées, les armes soniques pilonnent brutalement leurs victimes jusqu'à la reddition, en fracturant les plaques d'armure, en brisant les os et en réduisant les organes en bouillie.",
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
    intro:
      "Le terme « volkite » est un obscur vocable martien qui recouvre diverses armes à rayon dont l'origine remonte à l'Ère des Luttes. Douées d'une puissance meurtrière considérable, les armes volkites étaient difficiles à manufacturer, même pour les forges du Mechanicum les mieux pourvues ; leur usage avait décliné au moment où survint l'Hérésie d'Horus, au profit du bolter terrien plus pratique et polyvalent.",
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
    intro:
      "Les Legiones Astartes emploient aussi diverses armes qui ne relèvent pas d'une catégorie en particulier.",
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
    intro:
      "Ces armes féroces remontent aux tréfonds sanglants des guerres d'Unification de Terra, et se caractérisent par leur tranchant fait d'une série de dents acérées bruyamment mises en mouvement par un puissant moteur intégré à leur épaisse poignée. Aptes à déchiqueter aussi bien les armures que les chairs entre les mains d'utilisateurs compétents, et pratiquement inutilisables par d'autres.",
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
    intro:
      "On peut faire remonter l'origine de ces armes élégantes et meurtrières aux sociétés duellistes, aux sectes d'assassins et à la pratique de la vendetta au sein des anciennes Cours de Terra à l'Ère des Luttes, et leur létalité est question de prestesse et de dextérité davantage que de force brute.",
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
    intro:
      "Incrustées de circuits conducteurs psychiques et forgées dans des alliages rares, ces armes ressemblent trompeusement à de banales armes de mêlée. Elles permettent à quiconque sait manier la puissance du Warp de canaliser ses pouvoirs psychiques pour infliger de terribles blessures. Si une Figurine a une arme de force dans son Équipement, vous pouvez la doter d'un des choix suivants.",
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
    intro:
      "Ces armes de mêlée sont auréolées d'un champ de disruption qui leur permet de fendre les armures comme du papier et de sectionner sans peine la chair et l'os. Ardues à maîtriser, coûteuses à produire et à entretenir, elles sont réservées aux meilleurs guerriers des Legiones Astartes. Si une Figurine a une arme énergétique dans son Équipement, vous pouvez la doter d'un des choix suivants.",
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
    intro:
      "Qu'il s'agisse d'armes forgées par des artistes accomplis ou de reliques irremplaçables de l'antique grandeur du Moyen-Âge Technologique, les lames de parangon sont peu nombreuses et peuvent prendre diverses formes. Quelle que soit leur forme, elles sont inestimables aux yeux des guerriers de l'Imperium.",
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
    intro:
      "Les Legiones Astartes emploient aussi diverses armes qui ne relèvent pas d'une catégorie en particulier.",
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

/**
 * Construit la table HTML d'une catégorie d'armes et l'insère dans le
 * conteneur cible, précédée de son titre (h3) et de son texte d'intro.
 * @param {string} idConteneur - id de la div où insérer la catégorie
 * @param {Array}  entetes     - libellés des colonnes de stats (ex: ["P","PF","FT","PA","D"])
 * @param {Object} categorie   - { titre, intro, armes, note }
 */
function construireCategorieArmes(idConteneur, entetes, categorie) {
  const conteneur = document.getElementById(idConteneur);
  if (!conteneur) return;

  const section = document.createElement("div");
  section.className = "groupe-armes";

  const h3 = document.createElement("h3");
  h3.textContent = categorie.titre;
  section.appendChild(h3);

  if (categorie.intro) {
    const intro = document.createElement("p");
    intro.className = "arme-intro";
    intro.textContent = categorie.intro;
    section.appendChild(intro);
  }

  const table = document.createElement("table");
  const caption = document.createElement("caption");
  caption.className = "sr-only";
  caption.textContent = categorie.titre;
  table.appendChild(caption);

  // --- En-tête ---
  const thead = document.createElement("thead");
  const trEntete = document.createElement("tr");

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
    tr.dataset.recherche = normaliserArme(
      [arme.nom, arme.regles, arme.traits].join(" "),
    );

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
    tdRegles.textContent = arme.regles || "-";
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
   FILTRE EN TEMPS RÉEL
   Filtre chaque ligne d'arme, puis masque une catégorie entière
   (titre + intro + table) si plus aucune de ses armes ne
   correspond, puis masque une grande section (Tir/Mêlée) si plus
   aucune de ses catégories n'est visible.
   ---------------------------------------------------------- */
function activerRechercheArmes() {
  const champ = document.getElementById("recherche");
  const compteur = document.getElementById("compteur");
  if (!champ) return;

  champ.addEventListener("input", () => {
    const requete = normaliserArme(champ.value.trim());
    let visibles = 0;

    document.querySelectorAll(".groupe-armes tbody tr").forEach((ligne) => {
      const correspond = ligne.dataset.recherche.includes(requete);
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
      compteur.textContent = requete
        ? visibles + " arme(s) trouvée(s) sur " + total
        : "";
    }
  });
}

/* ----------------------------------------------------------
   INITIALISATION
   ---------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  afficherArmes("armes-tir", ENTETES_TIR, ARMES_TIR);
  afficherArmes("armes-melee", ENTETES_MELEE, ARMES_MELEE);
  activerRechercheArmes();
});
