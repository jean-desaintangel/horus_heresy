/* ============================================================
   armes-data.js — Données des tables d'armes (Arsenal)
   Auteur : Jean · Créé : 2026-07-16
   Rôle   : encode les caractéristiques d'armes du livre de règles
   (Tir et Mêlée). Aucune logique de rendu : ces données sont
   consommées par js/armes.js (page armes.html) pour construire les
   tables de l'Arsenal, et par js/unites.js (page construction-liste.html) pour
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
const ENTETES_TIR = ["R", "FP", "RS", "AP", "D"];

const ARMES_TIR = [
  /* --- Pièce d'Artillerie — 13 entrées --- */
  {
    titre: "Artillery Piece",
    armes: [
      {
        nom: "Demolisher cannon",
        stats: ["24", "1", "12", "3", "3"],
        regles: "Blast (3\"), Breaching (5+), Ordnance (D), Stun (1)",
        traits: "-",
      },
      {
        nom: "Morbus bombard — HE shells",
        stats: ["36", "1", "9", "4", "1"],
        regles:
          "Ordnance (D), Blast (5\"), Barrage (2), Breaching (6+), Pinning (1)",
        traits: "-",
      },
      {
        nom: "Morbus bombard — Phosphex shells*",
        stats: ["24", "1", "5", "3", "1"],
        regles:
          "Blast (5\"), Barrage (1), Panic (3), Poisoned (3+), Breaching (5+)",
        traits: "Phosphex",
      },
      {
        nom: "Quad launcher — Frag",
        stats: ["60", "1", "5", "5", "1"],
        regles: "Heavy (FP), Blast (5\"), Barrage (2)",
        traits: "-",
      },
      {
        nom: "Quad launcher — Shatter",
        stats: ["36", "4", "7", "4", "1"],
        regles: "Heavy (D), Armourbane",
        traits: "-",
      },
      {
        nom: "Quad launcher — Phosphex canisters*",
        stats: ["24", "1", "5", "3", "1"],
        regles:
          "Blast (3\"), Barrage (1), Panic (3), Poisoned (3+), Breaching (5+)",
        traits: "Phosphex",
      },
      {
        nom: "Dreadhammer siege cannon",
        stats: ["24", "1", "12", "3", "3"],
        regles: "Ordnance (D), Blast (5\"), Breaching (5+), Stun (1)",
        traits: "-",
      },
      {
        nom: "Earthshaker cannon",
        stats: ["240", "1", "5", "4", "2"],
        regles:
          "Ordnance (RS), Blast (5\"), Barrage (2), Breaching (6+), Pinning (1)",
        traits: "-",
      },
      {
        // Arme du Minotaur Artillery Tank (Legacies, Solar Auxilia) :
        // profil jumelé du Canon Earthshaker ci-dessus.
        nom: "Twin Earthshaker cannon",
        stats: ["240", "2", "5", "4", "2"],
        regles:
          "Ordnance (RS), Blast (5\"), Barrage (2), Breaching (6+), Pinning (1)",
        traits: "-",
      },
      {
        // Arme du Banehammer Super-heavy Assault Tank (Legacies, Solar
        // Auxilia).
        nom: "Tremor cannon",
        stats: ["60", "1", "6", "4", "1"],
        regles: "Blast (10\"), Pinning (2), Suppressive (2), Stun (2)",
        traits: "-",
      },
      {
        // Arme du Stormsword Super-heavy Siege Tank (Legacies, Solar
        // Auxilia).
        nom: "Stormsword siege cannon",
        stats: ["18", "1", "12", "3", "6"],
        regles: "Blast (5\"), Ordnance (R), Stun (2)",
        traits: "-",
      },
      {
        // Arme du Marauder Bomber (Legacies, Solar Auxilia).
        nom: "Macro-bomb cluster",
        stats: ["18", "1", "8", "4", "2"],
        regles: "Blast (10\"), Pinning (2), Limited (1)",
        traits: "-",
      },
      {
        nom: "Medusa mortar",
        stats: ["36", "1", "5", "4", "2"],
        regles:
          "Ordnance (RS), Blast (5\"), Barrage (2), Breaching (5+), Pinning (2)",
        traits: "-",
      },
    ],
  },
  /* --- Pistolet Archéotech — 2 entrées --- */
  {
    titre: "Archaeotech Pistol",
    armes: [
      {
        nom: "Archaeotech pistol",
        stats: ["12", "1", "6", "4", "2"],
        regles: "Pistol, Breaching (3+)",
        traits: "Assault",
      },
      {
        nom: "Twin archaeotech pistol",
        stats: ["12", "2", "6", "4", "2"],
        regles: "Pistol, Breaching (3+)",
        traits: "Assault",
      },
    ],
  },
  /* --- Armes Auto — 52 entrées --- */
  {
    titre: "Auto Weapons",
    armes: [
      {
        nom: "Astartes shotgun",
        stats: ["12", "2", "4", "-", "1"],
        regles: "Stun (0)",
        traits: "Assault, Auto",
      },
      {
        // Arme de la Section de Raiders Veletaris (Solar Auxilia,
        // Journal Tactica : Zone Mortalis).
        nom: "Breacher shotgun",
        stats: ["10", "1", "5", "4", "1"],
        regles: "Breaching (6+)",
        traits: "Assault, Auto",
      },
      {
        nom: "Rotor cannon",
        stats: ["24", "3", "3", "-", "1"],
        regles: "Heavy (FP), Suppressive (1)",
        traits: "Auto",
      },
      {
        nom: "Autocannon",
        stats: ["48", "2", "7", "4", "2"],
        regles: "Breaching (6+), Heavy (FP)",
        traits: "Auto",
      },
      {
        nom: "Reaper autocannon",
        stats: ["36", "2", "6", "4", "2"],
        regles: "Breaching (6+), Heavy (FP)",
        traits: "Auto",
      },
      {
        nom: "Kheres assault cannon",
        stats: ["24", "5", "6", "4", "1"],
        regles: "Breaching (6+), Heavy (FP)",
        traits: "Auto",
      },
      {
        // Arsenal des Blood Angels : option pour Vétérans Tactiques,
        // Escouade d'État-major de Centurion, Terminator Cataphractii,
        // Predator, Dreadnought Leviathan ayant le Trait Blood Angels
        // (voir aussi le Dreadnought Contemptor-Incaendius et les
        // Paladins Écarlates, unités réservées à cette Légion).
        nom: "Iliastus assault cannon — Sustained fire",
        stats: ["24", "3", "6", "4", "1"],
        regles: "Heavy (FP), Breaching (6+)",
        traits: "Auto",
      },
      {
        nom: "Iliastus assault cannon — Maximal fire",
        stats: ["24", "5", "6", "4", "1"],
        regles: "Heavy (FP), Breaching (6+), Overload (1)",
        traits: "Auto",
      },
      {
        nom: "Twin Iliastus assault cannon — Sustained fire",
        stats: ["24", "6", "6", "4", "1"],
        regles: "Heavy (FP), Breaching (6+)",
        traits: "Auto",
      },
      {
        nom: "Twin Iliastus assault cannon — Maximal fire",
        stats: ["24", "8", "6", "4", "1"],
        regles: "Heavy (FP), Breaching (6+), Overload (1)",
        traits: "Auto",
      },
      {
        // Arme de l'Escouade Terminator Indomitus (Legacies, générique
        // Legiones Astartes).
        nom: "Proteus assault cannon",
        stats: ["24", "3", "6", "4", "1"],
        regles: "Heavy (FP), Breaching (6+)",
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
        nom: "Pintle Mounted Iliastus assault cannon — Sustained fire",
        stats: ["24", "3", "6", "4", "1"],
        regles: "Heavy (FP), Breaching (6+), Skyfire, Precision (6+)",
        traits: "Auto",
      },
      {
        nom: "Pintle Mounted Iliastus assault cannon — Maximal fire",
        stats: ["24", "5", "6", "4", "1"],
        regles:
          "Heavy (FP), Breaching (6+), Overload (1), Skyfire, Precision (6+)",
        traits: "Auto",
      },
      // Arsenal des Blood Angels (IXe Légion) : « Au lieu d'être dotée
      // d'une option de la liste des Armes sur Pivot de Légion, toute
      // Figurine de Type Véhicule ayant le Trait Blood Angels peut être
      // dotée d'un canon d'assaut Iliastus sur Pivot pour +20 Points par
      // Figurine. » Profil PLAIN (sans Antiaérien/Précision (6+)),
      // distinct du montage ci-dessus réservé au Décurion Sagittar
      // (Imperial Fists) — nom suffixé « (Blood Angels) » pour éviter
      // que construireTablesArmes (js/unites.js) ne fusionne les deux
      // tables sous un même nom, sur le même principe que « Missile
      // traqueur (Mechanicum) »/« Missile traqueur (Skitarii) ».
      {
        nom: "Pintle Mounted Iliastus assault cannon (Blood Angels) — Sustained fire",
        stats: ["24", "3", "6", "4", "1"],
        regles: "Heavy (FP), Breaching (6+)",
        traits: "Auto",
      },
      {
        nom: "Pintle Mounted Iliastus assault cannon (Blood Angels) — Maximal fire",
        stats: ["24", "5", "6", "4", "1"],
        regles: "Heavy (FP), Breaching (6+), Overload (1)",
        traits: "Auto",
      },
      // Même profil, réservé aux Imperial Fists (legacie_wargear.pdf,
      // p. 6) — voir la note sur le montage Blood Angels ci-dessus.
      {
        nom: "Pintle Mounted Iliastus assault cannon (Imperial Fists) — Sustained fire",
        stats: ["24", "3", "6", "4", "1"],
        regles: "Heavy (FP), Breaching (6+)",
        traits: "Auto",
      },
      {
        nom: "Pintle Mounted Iliastus assault cannon (Imperial Fists) — Maximal fire",
        stats: ["24", "5", "6", "4", "1"],
        regles: "Heavy (FP), Breaching (6+), Overload (1)",
        traits: "Auto",
      },
      {
        nom: "Gravis autocannon",
        stats: ["48", "3", "8", "4", "2"],
        regles: "Breaching (6+), Heavy (FP)",
        traits: "Auto",
      },
      {
        // Arme de l'Arlatax Battle Maniple (Legacies, Mechanicum) : les
        // deux canons montés forment un seul profil jumelé, voir
        // js/unites-data.js.
        nom: "Paired light autocannon",
        stats: ["36", "4", "6", "4", "1"],
        regles: "Breaching (6+)",
        traits: "Auto",
      },
      {
        nom: "Gravis autocannon battery",
        stats: ["48", "5", "8", "4", "2"],
        regles: "Breaching (6+), Heavy (FP)",
        traits: "Auto",
      },
      {
        nom: "Predator cannon",
        stats: ["48", "3", "8", "4", "2"],
        regles: "Breaching (6+), Heavy (FP)",
        traits: "Auto",
      },
      {
        nom: "Punisher rotary cannon",
        stats: ["36", "8", "6", "4", "1"],
        regles: "Ordnance (FP), Suppressive (2)",
        traits: "Auto",
      },
      {
        nom: "Twin accelerator autocannon",
        stats: ["48", "6", "7", "4", "2"],
        regles: "Breaching (6+), Swift Pursuit, Skyfire",
        traits: "Auto",
      },
      {
        nom: "Quad accelerator autocannon",
        stats: ["48", "10", "7", "4", "2"],
        regles: "Breaching (6+), Swift Pursuit, Skyfire",
        traits: "Auto",
      },
      {
        nom: "Fellblade accelerator cannon — HE shells",
        stats: ["100", "1", "8", "3", "2"],
        regles: "Blast (5\"), Stun (2)",
        traits: "Auto",
      },
      {
        nom: "Fellblade accelerator cannon — AE shells",
        stats: ["100", "1", "12", "2", "3"],
        regles: "Blast (3\"), Ordnance (D)",
        traits: "Auto",
      },
      {
        nom: "Skyreaper battery",
        stats: ["48", "6", "7", "4", "2"],
        regles: "Swift Pursuit, Skyfire",
        traits: "Auto",
      },
      {
        nom: "Anvilus autocannon battery",
        stats: ["48", "6", "8", "4", "2"],
        regles: "Breaching (5+), Swift Pursuit, Skyfire",
        traits: "Auto",
      },
      {
        nom: "Anvilus short autocannon",
        stats: ["24", "3", "7", "4", "2"],
        regles: "Breaching (5+)",
        traits: "Auto",
      },
      {
        nom: "Leviathan quad-cannon",
        stats: ["24", "4", "7", "4", "2"],
        regles: "Heavy (FP), Breaching (5+)",
        traits: "Auto",
      },
      {
        nom: "Kratos battlecannon — HE shells",
        stats: ["36", "1", "8", "4", "1"],
        regles: "Ordnance (D), Blast (5\"), Stun (1)",
        traits: "Auto",
      },
      {
        nom: "Kratos battlecannon — AP shells",
        stats: ["36", "1", "8", "2", "2"],
        regles: "Ordnance (D), Armourbane",
        traits: "Auto",
      },
      {
        nom: "Kratos battlecannon — Flashburn shells*",
        stats: ["24", "1", "9", "2", "3"],
        regles: "Ordnance (D), Armourbane, Overload (1)",
        traits: "Auto",
      },
      /* --- Arsenal des Maisonnées de Chevaliers et des Legios
         Titaniques : armes montées sur Chevaliers Questoris et
         Titans. --- */
      {
        nom: "Heavy stubber",
        stats: ["36", "3", "4", "6", "1"],
        regles: "-",
        traits: "Auto",
      },
      {
        nom: "Twin Icarus autocannon",
        stats: ["48", "4", "7", "4", "2"],
        regles: "Heavy (FP), Breaching (6+), Skyfire, Swift Pursuit",
        traits: "Auto",
      },
      {
        nom: "Phaeton autocannon",
        stats: ["30", "3", "7", "3", "2"],
        regles: "Ordnance (FP), Breaching (5+)",
        traits: "Auto",
      },
      {
        nom: "Rapid-fire battlecannon",
        stats: ["48", "1", "8", "4", "2"],
        regles: "Heavy (FP & AP), Blast (3\"), Pinning (1)",
        traits: "Auto",
      },
      {
        nom: "Avenger gatling cannon",
        stats: ["36", "7", "6", "4", "1"],
        regles: "Ordnance (FP), Breaching (6+), Suppressive (2)",
        traits: "Auto",
      },
      /* --- Arsenal des Solar Auxilia (Liber Auxilia) : les Unités
         Solar Auxilia doivent utiliser cette version des armes ci-
         dessous, quand elle est déjà présente dans l'Arsenal des
         Legiones Astartes. --- */
      {
        // Profil jumelé (« heavy stubber », plusieurs Super-lourds
        // Solar Auxilia Legacies : Macharius, Baneblade, Crassus...).
        nom: "Twin heavy stubber (Solar Auxilia)",
        stats: ["36", "6", "4", "6", "1"],
        regles: "-",
        traits: "Auto",
      },
      {
        nom: "Battlecannon",
        stats: ["48", "2", "8", "4", "2"],
        regles: "Heavy (AP), Blast (3\"), Pinning (1)",
        traits: "Auto",
      },
      {
        nom: "Twin battlecannon",
        stats: ["48", "2", "8", "4", "2"],
        regles: "Heavy (AP), Blast (3\"), Pinning (1)",
        traits: "Auto",
      },
      {
        nom: "Vanquisher cannon",
        stats: ["72", "1", "10", "2", "3"],
        regles: "Heavy (D), Critical Hit (6+)",
        traits: "Auto",
      },
      {
        // Option du Macharius Heavy Tank (Legacies, Solar Auxilia) :
        // profil jumelé du Canon Vanquisher ci-dessus.
        nom: "Twin Vanquisher cannon",
        stats: ["72", "2", "10", "2", "3"],
        regles: "Heavy (D), Critical Hit (6+)",
        traits: "Auto",
      },
      {
        // Arme du Baneblade/Hellhammer Super-heavy Battle Tank
        // (Legacies, Solar Auxilia).
        nom: "Baneblade cannon",
        stats: ["82", "1", "8", "3", "2"],
        regles: "Blast (7\"), Pinning (1)",
        traits: "Auto",
      },
      {
        // Arme du Hellhammer Super-heavy Battle Tank (Legacies, Solar
        // Auxilia) : remplace le Canon Baneblade ci-dessus sur ce
        // variant, portée réduite contre pénétration de blindage accrue.
        nom: "Hellhammer cannon",
        stats: ["24", "1", "10", "3", "3"],
        regles: "Blast (5\"), Stun (1)",
        traits: "Auto",
      },
      {
        // Arme du Marauder Destroyer (Legacies, Solar Auxilia) :
        // stats différentes de la Batterie d'autocanons Gravis déjà
        // existante (Fixe(FP) en moins, Force de Feu plus élevée), nom
        // distinct pour ne pas les confondre.
        nom: "Gravis autocannon array",
        stats: ["48", "8", "8", "4", "2"],
        regles: "Breaching (6+)",
        traits: "Auto",
      },
      {
        // Arme du Marauder Destroyer (Legacies, Solar Auxilia).
        nom: "Twin rotary defence cannon",
        stats: ["36", "6", "4", "4", "1"],
        regles: "Breaching (6+)",
        traits: "Auto",
      },
      {
        nom: "Stormhammer cannon",
        stats: ["72", "1", "9", "3", "3"],
        regles: "Blast (5\"), Stun (2)",
        traits: "Auto",
      },
      /* --- Arsenal des Taghmata du Mechanicum (Liber Mechanicum). --- */
      {
        nom: "Twin rotor cannon",
        stats: ["24", "5", "4", "-", "1"],
        regles: "Heavy (FP), Suppressive (2)",
        traits: "Auto",
      },
      {
        nom: "Kytan gatling cannon",
        stats: ["36", "12", "6", "4", "1"],
        regles: "Pinning (1), Rending (6+)",
        traits: "Auto",
      },
      {
        nom: "Scorpion cannon",
        stats: ["30", "15", "5", "4", "1"],
        regles: "Rending (6+), Pinning (0)",
        traits: "Auto",
      },
      {
        nom: "Butcher cannon",
        stats: ["36", "4", "8", "4", "2"],
        regles: "Breaching (6+)",
        traits: "Auto",
      },
    ],
  },
  /* --- Armes à Bolts — 31 entrées --- */
  {
    titre: "Bolt Weapons",
    armes: [
      {
        nom: "Bolt pistol",
        stats: ["12", "1", "4", "5", "1"],
        regles: "Pistol",
        traits: "Assault, Bolt",
      },
      {
        nom: "Bolter",
        stats: ["24", "2", "4", "5", "1"],
        regles: "-",
        traits: "Bolt",
      },
      {
        nom: "Maxima bolter",
        stats: ["18", "3", "4", "5", "1"],
        regles: "-",
        traits: "Assault, Bolt",
      },
      {
        nom: "Twin Maxima bolter",
        stats: ["18", "5", "4", "5", "1"],
        regles: "Rending (6+)",
        traits: "Bolt",
      },
      {
        nom: "Mauler bolt cannon",
        stats: ["24", "4", "6", "4", "1"],
        regles: "Pinning (0), Rending (5+)",
        traits: "Bolt",
      },
      {
        nom: "Twin bolter",
        stats: ["24", "4", "4", "5", "1"],
        regles: "-",
        traits: "Bolt",
      },
      {
        nom: "Combi-bolter",
        stats: ["24", "4", "4", "5", "1"],
        regles: "-",
        traits: "Bolt",
      },
      {
        nom: "Kraken bolter",
        stats: ["30", "2", "4", "4", "1"],
        regles: "Precision (4+), Shot Selector",
        traits: "Bolt",
      },
      {
        // Arme des Knights-Errant (PDF « Knight-Errant » — Nathaniel
        // Garro, Tylos Rubio) : « Paragon bolter ».
        nom: "Paragon bolter",
        stats: ["24", "2", "5", "4", "1"],
        regles: "Rending (6+)",
        traits: "Bolt",
      },
      {
        nom: "Nemesis bolter",
        stats: ["48", "1", "4", "5", "1"],
        regles: "Heavy (RS), Breaching (5+), Pinning (1), Precision (4+)",
        traits: "Bolt",
      },
      {
        nom: "Nemesis rifle",
        stats: ["48", "1", "6", "3", "1"],
        regles: "Heavy (D), Breaching (5+), Pinning (1), Precision (4+)",
        traits: "Bolt",
      },
      {
        nom: "Heavy bolter",
        stats: ["36", "3", "5", "4", "1"],
        regles: "Heavy (FP)",
        traits: "Bolt",
      },
      {
        nom: "Twin heavy bolter",
        stats: ["36", "6", "5", "4", "1"],
        regles: "-",
        traits: "Bolt",
      },
      {
        nom: "Gravis bolt cannon",
        stats: ["36", "6", "5", "4", "2"],
        regles: "Heavy (FP)",
        traits: "Bolt",
      },
      {
        nom: "Gravis heavy bolter battery",
        stats: ["36", "8", "5", "4", "1"],
        regles: "Suppressive (2)",
        traits: "Bolt",
      },
      /* --- Arsenal des Solar Auxilia (Liber Auxilia) : les Unités
         Solar Auxilia doivent utiliser cette version de l'arme. --- */
      {
        nom: "Gravis heavy bolter battery (Solar Auxilia)",
        stats: ["36", "8", "5", "4", "1"],
        regles: "Suppressive (2)",
        traits: "Bolt",
      },
      {
        nom: "Twin Avenger bolt cannon",
        stats: ["36", "10", "6", "3", "1"],
        regles: "Suppressive (2)",
        traits: "Bolt",
      },
      {
        // Arme de l'Avenger Strike Fighter (Legacies, Solar Auxilia) :
        // profil simple, voir Canon à bolts Avenger jumelé ci-dessus
        // pour la version montée sur le Macharius Heavy Tank.
        nom: "Avenger bolt cannon",
        stats: ["36", "5", "6", "3", "1"],
        regles: "Suppressive (1)",
        traits: "Bolt",
      },
      {
        // Arme du Stormlord Super-heavy Assault Tank (Legacies, Solar
        // Auxilia) : mêmes stats que le Méga-bolter Vulcan titanique
        // (voir Armes Stratégiques Titaniques ci-dessous), mais sans
        // Trait Stratégique — nom distinct pour ne pas le lui prêter,
        // sur le même principe que Canon Volcano (Shadowsword).
        nom: "Vulcan mega-bolter (Stormlord)",
        stats: ["48", "12", "7", "3", "2"],
        regles: "Suppressive (3)",
        traits: "Bolt",
      },
      {
        // Arme de la Keshig d'Or (White Scars).
        nom: "Scatterbolt",
        stats: ["Template", "1", "5", "4", "1"],
        regles: "Template, Rending (6+), Pinning (1)",
        traits: "Bolt, Assault",
      },
      {
        // Arme de personnage (Rogal Dorn, Primarque des Imperial Fists).
        nom: "The Voice of Terra",
        stats: ["24", "3", "5", "3", "1"],
        regles: "Breaching (5+)",
        traits: "Bolt, Assault",
      },
      {
        // Arme de personnage (Roboute Guilliman, Primarque des
        // Ultramarines).
        nom: "The Arbitrator",
        stats: ["18", "2", "6", "3", "1"],
        regles: "Breaching (5+)",
        traits: "Bolt, Assault",
      },
      {
        // Arme de personnage (Leman Russ, Primarque des Space Wolves).
        nom: "Scornspitter",
        stats: ["12", "3", "4", "3", "1"],
        regles: "Breaching (6+)",
        traits: "Assault, Bolt",
      },
      {
        // Arme de personnage (Shadrak Meduson, Iron Hands).
        nom: "Wrath of the Storm",
        stats: ["24", "3", "5", "4", "1"],
        regles: "Breaching (6+)",
        traits: "Bolt, Assault",
      },
      /* --- Arsenal des Sons of Horus (XVIe Légion) : munitions
         Banestrike (page « Arsenal des Sons of Horus », voir
         js/unites-data.js, unités réservées à cette Légion). Câblage
         fait via une douzaine de sites individuels (options ad hoc sur
         chaque Unité) plutôt que LISTES_EQUIPEMENT, faute d'entrée
         partagée pour ce montage précis à l'époque.
         Alpha Legion Legacy Wargear (legacie_wargear.pdf, p. 19) : même
         nom de munitions (« Banestrike bolter »/« Banestrike
         combi-bolter », Liber Hereticus p.245/300), ajoutées à la liste
         d'Armes Combinées de Légion pour toute Figurine Alpha Legion
         (+5/+10 Points) — seul le Chasseur de Têtes (Alpha Legion) a
         reçu ce câblage jusqu'ici (son propre équipement de base +
         option "combi-legacy", voir js/unites-data.js), pas étendu au
         reste du roster générique de Légion : même ampleur de chantier
         que le câblage Sons of Horus ci-dessus (des dizaines de sites à
         traiter un par un), non fait dans cette session — gap
         documenté plutôt que traité partiellement. --- */
      {
        nom: "Banestrike bolter",
        stats: ["18", "2", "4", "4", "1"],
        regles: "Breaching (6+)",
        traits: "Bolt",
      },
      {
        nom: "Banestrike combi-bolter",
        stats: ["18", "4", "4", "4", "1"],
        regles: "Breaching (6+)",
        traits: "Bolt",
      },
      {
        // Arme de personnage (Vheren Ashurhaddon, Sons of Horus).
        nom: "Pair of Banestrike Pistols",
        stats: ["10", "4", "5", "4", "1"],
        regles: "Pistol, Breaching (6+)",
        traits: "Assault, Bolt",
      },
      {
        // Arme de personnage (Horus Lupercal / Horus Exalté, Sons of
        // Horus). Profil de Tir : possède aussi un profil de Mêlée
        // (voir Armes Énergétiques ci-dessous, même mécanique que
        // L'Épée Noire — note en fin de section).
        nom: "The Warmaster's Talon",
        stats: ["24", "5", "5", "3", "1"],
        regles: "Breaching (6+)",
        traits: "Bolt, Assault",
      },
      {
        // Décurion Lanius (livre d'armée, Legiones Astartes ayant le
        // Trait Sons of Horus, voir optionsDecurionLegion dans
        // js/unites-data.js) : arme sur Pivot accordée par cette
        // amélioration.
        nom: "Banestrike bolt cannon",
        stats: ["24", "4", "6", "4", "2"],
        regles: "Breaching (6+)",
        traits: "Bolt",
      },
      /* --- Arsenal des Maisonnées de Chevaliers et des Legios
         Titaniques. --- */
      {
        nom: "Twin Mauler bolt cannon",
        stats: ["24", "6", "6", "4", "1"],
        regles: "Pinning (2), Rending (4+)",
        traits: "Bolt",
      },
      {
        nom: "Twin Castigator bolt cannon",
        stats: ["36", "10", "6", "3", "1"],
        regles: "Ordnance (D), Suppressive (2)",
        traits: "Bolt",
      },
    ],
  },
  /* --- Armes Combinées — 8 entrées --- */
  {
    titre: "Combi-weapons",
    armes: [
      {
        nom: "Combi-weapon — Bolter (Primary)",
        stats: ["24", "2", "4", "5", "1"],
        regles: "Combi",
        traits: "Bolt",
      },
      {
        nom: "Combi-flamer — Flamer (Secondary)",
        stats: ["Template", "1", "4", "5", "1"],
        regles: "Template, Panic (1), Limited (1), Combi",
        traits: "Flame",
      },
      {
        nom: "Combi-melta — Meltagun (Secondary)",
        stats: ["12", "1", "8", "2", "3"],
        regles: "Melta (6), Limited (1), Combi",
        traits: "Melta",
      },
      {
        nom: "Combi-plasma — Plasma gun (Secondary)",
        stats: ["24", "2", "6", "4", "1"],
        regles: "Breaching (6+), Limited (1), Combi",
        traits: "Plasma",
      },
      {
        nom: "Combi-volkite — Volkite charger (Secondary)",
        stats: ["15", "2", "5", "5", "1"],
        regles: "Deflagrate (5), Combi",
        traits: "Volkite",
      },
      {
        nom: "Combi-grenade launcher — Krak (Secondary)",
        stats: ["24", "1", "6", "4", "2"],
        regles: "Combi",
        traits: "-",
      },
      {
        nom: "Combi-disintegrator — Disintegrator (Secondary)",
        stats: ["24", "1", "4", "3", "2"],
        regles: "Overload (1), Limited (1), Combi",
        traits: "Disintegrator",
      },
      {
        nom: "Combi-grav — Graviton gun (Secondary)",
        stats: ["18", "1", "6", "4", "1"],
        regles:
          "Blast (3\"), Breaching (6+), Shock (Pinned), Pinning (1), Limited (1), Combi",
        traits: "Graviton",
      },
    ],
  },
  /* --- Armes à Conversion — 16 entrées --- */
  {
    titre: "Conversion Weapons",
    armes: [
      {
        nom: "Conversion beam cannon (< 15\")",
        stats: ["<15", "1", "6", "4", "1"],
        regles: "Heavy (RS), Blast (3\")",
        traits: "Conversion",
      },
      {
        nom: "Conversion beam cannon (15-30\")",
        stats: ["15-30", "1", "7", "3", "2"],
        regles: "Heavy (RS), Blast (3\")",
        traits: "Conversion",
      },
      {
        nom: "Conversion beam cannon (> 30-45\")",
        stats: [">30-45", "1", "8", "2", "3"],
        regles: "Heavy (RS), Blast (3\")",
        traits: "Conversion",
      },
      {
        nom: "Heavy conversion beam cannon (< 15\")",
        stats: ["<15", "1", "6", "4", "1"],
        regles: "Heavy (RS), Blast (5\")",
        traits: "Conversion",
      },
      {
        nom: "Heavy conversion beam cannon (15-30\")",
        stats: ["15-30", "1", "7", "3", "2"],
        regles: "Heavy (RS), Blast (5\")",
        traits: "Conversion",
      },
      {
        nom: "Heavy conversion beam cannon (> 30-45\")",
        stats: [">30-45", "1", "8", "2", "3"],
        regles: "Heavy (RS), Blast (5\")",
        traits: "Conversion",
      },
      {
        nom: "Inversion cannon (< 15\")",
        stats: ["<15", "1", "8", "2", "3"],
        regles: "Heavy (RS), Blast (5\")",
        traits: "Conversion",
      },
      {
        nom: "Inversion cannon (15-30\")",
        stats: ["15-30", "1", "7", "3", "2"],
        regles: "Heavy (RS), Blast (5\")",
        traits: "Conversion",
      },
      /* --- Arsenal des Maisonnées de Chevaliers et des Legios
         Titaniques. --- */
      {
        nom: "Moirax conversion beamer (< 15\")",
        stats: ["<15", "1", "6", "4", "1"],
        regles: "Heavy (RS), Blast (3\"), Suppressive (1)",
        traits: "Conversion",
      },
      {
        nom: "Moirax conversion beamer (15-30\")",
        stats: ["15-30", "1", "7", "3", "2"],
        regles: "Heavy (RS), Blast (3\"), Suppressive (1)",
        traits: "Conversion",
      },
      {
        nom: "Moirax conversion beamer (> 30-45\")",
        stats: [">30-45", "1", "8", "2", "3"],
        regles: "Heavy (RS), Blast (3\"), Suppressive (1)",
        traits: "Conversion",
      },
      /* --- Arsenal des Taghmata du Mechanicum (Liber Mechanicum) : les
         Unités Taghmata doivent utiliser cette version des armes
         ci-dessous, quand elle est déjà présente dans l'Arsenal des
         Maisonnées de Chevaliers et des Legios Titaniques. --- */
      {
        nom: "Conversion beamer (< 15\")",
        stats: ["<15", "1", "5", "4", "1"],
        regles: "Heavy (RS), Blast (3\")",
        traits: "Conversion",
      },
      {
        nom: "Conversion beamer (15-30\")",
        stats: ["15-30", "1", "6", "3", "2"],
        regles: "Heavy (RS), Blast (3\")",
        traits: "Conversion",
      },
      {
        nom: "Desolator conversion array (< 18\")",
        stats: ["<18", "2", "8", "4", "2"],
        regles: "Ordnance (D), Blast (7\")",
        traits: "Conversion",
      },
      {
        nom: "Desolator conversion array (18-42\")",
        stats: ["18-42", "2", "9", "3", "3"],
        regles: "Ordnance (D), Blast (7\")",
        traits: "Conversion",
      },
      {
        nom: "Desolator conversion array (> 42-72\")",
        stats: [">42-72", "2", "10", "2", "4"],
        regles: "Ordnance (D), Blast (7\")",
        traits: "Conversion",
      },
    ],
  },
  /* --- Armes Désintégratrices — 6 entrées --- */
  {
    titre: "Disintegrator Weapons",
    armes: [
      {
        nom: "Disintegrator pistol",
        stats: ["12", "1", "4", "3", "2"],
        regles: "Pistol, Overload (1)",
        traits: "Assault, Disintegrator",
      },
      {
        nom: "Disintegrator rifle",
        stats: ["24", "1", "4", "3", "2"],
        regles: "Overload (1)",
        traits: "Disintegrator",
      },
      {
        nom: "Disintegrator blaster",
        stats: ["18", "1", "5", "2", "2"],
        regles: "Overload (1)",
        traits: "Disintegrator",
      },
      {
        nom: "Heavy disintegrator",
        stats: ["24", "1", "6", "2", "2"],
        regles: "Heavy (FP), Overload (1)",
        traits: "Disintegrator",
      },
      {
        nom: "Twin heavy disintegrator",
        stats: ["24", "2", "7", "2", "2"],
        regles: "Overload (2)",
        traits: "Disintegrator",
      },
      {
        nom: "Disintegrator cannon",
        stats: ["24", "2", "9", "2", "3"],
        regles: "Overload (2)",
        traits: "Disintegrator",
      },
    ],
  },
  /* --- Armes à Gravitons — 12 entrées --- */
  {
    titre: "Graviton Weapons",
    armes: [
      {
        nom: "Graviton gun",
        stats: ["18", "1", "6", "4", "1"],
        regles: "Blast (3\"), Breaching (6+), Shock (Pinned), Pinning (1)",
        traits: "Graviton",
      },
      {
        // Iron Hands Legacy Wargear (legacie_wargear.pdf, p. 9) : ajouté
        // à la liste des Armes Spéciales de Légion (LISTES_EQUIPEMENT.
        // speciales, requiertLegion "X", +15 Points) pour toute
        // Figurine ayant le Trait Iron Hands. Arme de l'Escouade
        // Terminator Gorgone/Escouade d'Immortels de Medusa (voir
        // js/unites-data.js).
        nom: "Graviton shredder",
        stats: ["18", "2", "6", "4", "1"],
        regles: "Breaching (6+), Shock (Pinned), Pinning (1)",
        traits: "Assault, Graviton",
      },
      {
        // Arsenal des Iron Hands (Xe Légion) : échange contre un
        // pistolet à plasma pour toute Figurine de Sous-type État-major
        // ou Champion ayant le Trait Iron Hands (+5 Points/Figurine).
        nom: "Graviton pistol",
        stats: ["12", "2", "6", "4", "1"],
        regles: "Pistol, Breaching (6+), Shock (Pinned), Pinning (1)",
        traits: "Assault, Graviton",
      },
      {
        nom: "Twin graviton gun",
        stats: ["18", "1", "6", "4", "1"],
        regles: "Blast (5\"), Breaching (6+), Shock (Pinned), Pinning (1)",
        traits: "Graviton",
      },
      {
        nom: "Graviton hammers",
        stats: ["12", "4", "6", "4", "2"],
        regles: "Breaching (5+), Shock (Pinned), Pinning (0)",
        traits: "Graviton",
      },
      {
        nom: "Graviton cannon",
        stats: ["36", "1", "8", "3", "1"],
        regles:
          "Heavy (D), Blast (3\"), Breaching (6+), Shock (Pinned), Pinning (2)",
        traits: "Graviton",
      },
      {
        nom: "Graviton-charge cannon",
        stats: ["24", "1", "9", "3", "2"],
        regles:
          "Heavy (D), Blast (5\"), Barrage (1), Breaching (6+), Shock (Pinned), Pinning (3)",
        traits: "Graviton",
      },
      {
        nom: "Graviflux bombard",
        stats: ["18", "1", "7", "4", "1"],
        regles:
          "Heavy (D), Blast (5\"), Breaching (6+), Shock (Pinned), Pinning (2)",
        traits: "Graviton",
      },
      {
        nom: "Graviton pulveriser",
        stats: ["18", "1", "9", "3", "3"],
        regles:
          "Heavy (D), Blast (3\"), Breaching (6+), Shock (Pinned), Pinning (3)",
        traits: "Graviton",
      },
      /* --- Arsenal des Maisonnées de Chevaliers et des Legios
         Titaniques. --- */
      {
        nom: "Graviton pulsar",
        stats: ["24", "2", "6", "3", "1"],
        regles:
          "Heavy (D), Blast (3\"), Breaching (6+), Shock (Pinned), Pinning (2)",
        traits: "Graviton",
      },
      {
        nom: "Graviton singularity cannon",
        stats: ["36", "1", "9", "2", "8"],
        regles:
          "Blast (5\"), Heavy (D), Overload (1), Armourbane, Critical Hit (6+)",
        traits: "Graviton",
      },
      {
        // Arme du Macrocarid Explorator (Legacies, Mechanicum) : voir
        // js/unites-data.js.
        nom: "Graviton imploder",
        stats: ["18", "1", "9", "2", "3"],
        regles: "Shock (Pinned), Pinning (3)",
        traits: "Graviton",
      },
    ],
  },
  /* --- Armes à Flammes — 19 entrées --- */
  {
    titre: "Flame Weapons",
    armes: [
      {
        nom: "Hand flamer",
        stats: ["Template", "1", "3", "-", "1"],
        regles: "Template, Pistol",
        traits: "Assault, Flame",
      },
      {
        nom: "Flamer",
        stats: ["Template", "1", "4", "5", "1"],
        regles: "Template, Panic (1)",
        traits: "Flame",
      },
      {
        nom: "Heavy flamer",
        stats: ["Template", "1", "5", "4", "1"],
        regles: "Template, Panic (1)",
        traits: "Flame",
      },
      {
        // Arme du Manipule Castellax Infernus (Mechanicum, Journal
        // Tactica : Zone Mortalis).
        nom: "Incinerator purge",
        stats: ["Template", "1", "6", "4", "1"],
        regles: "Template, Breaching (6+), Panic (1)",
        traits: "Flame",
      },
      {
        // Arsenal des Salamanders (XVIIIe Légion), page « Artifice de
        // Nocturne » : échange contre un lance-flammes léger, réservé
        // aux Figurines de Sous-type Sergent ayant le Trait Salamanders.
        nom: "Forge-crafted hand flamer",
        stats: ["Template", "1", "3", "-", "2"],
        regles: "Template, Pistol",
        traits: "Assault, Flame",
      },
      {
        // Arsenal des Salamanders (XVIIIe Légion) : échange contre un
        // lance-flammes, réservé aux Figurines de Sous-type Sergent
        // ayant le Trait Salamanders.
        nom: "Forge-crafted flamer",
        stats: ["Template", "1", "4", "5", "2"],
        regles: "Template, Panic (1)",
        traits: "Flame",
      },
      {
        // Arsenal des Salamanders (XVIIIe Légion) : échange contre un
        // lance-flammes lourd, réservé aux Figurines de Sous-type
        // Sergent ayant le Trait Salamanders (voir aussi le Dreadnought
        // Cassian Dracos et l'Escouade Terminator Pyrodracs,
        // js/unites-data.js).
        nom: "Forge-crafted heavy flamer",
        stats: ["Template", "1", "5", "4", "2"],
        regles: "Template, Panic (2)",
        traits: "Flame",
      },
      {
        // Arsenal des Solar Auxilia (Liber Auxilia) : les Unités Solar
        // Auxilia doivent utiliser cette version de l'arme.
        nom: "Hand flamer (Solar Auxilia)",
        stats: ["Template", "1", "3", "-", "1"],
        regles: "Template, Pistol",
        traits: "Flame",
      },
      {
        nom: "Twin heavy flamer",
        stats: ["Template", "1", "5", "4", "1"],
        regles: "Template, Panic (2)",
        traits: "Flame",
      },
      {
        nom: "Flamestorm cannon",
        stats: ["Template", "1", "6", "4", "2"],
        regles: "Template, Panic (2)",
        traits: "Flame",
      },
      {
        nom: "Photonic incinerator",
        stats: ["Template", "1", "6", "4", "1"],
        regles: "Template, Panic (2)",
        traits: "Assault, Flame",
      },
      /* --- Arsenal des Word Bearers (XVIIe Légion) : Escouade du
         Cercle de Cendres, Kor Phaeron, Dreadnought Mhara Gal (voir
         js/unites-data.js, unités réservées à cette Légion). --- */
      {
        // Arme de l'Escouade du Cercle de Cendres (Word Bearers).
        nom: "Akkadic Hand Flamer",
        stats: ["Template", "1", "4", "4", "1"],
        regles: "Template, Pistol, Panic (2)",
        traits: "Assault, Flame",
      },
      {
        // Arme de l'Iconoclaste de l'Escouade du Cercle de Cendres
        // (option, Word Bearers).
        nom: "Inferno pistol",
        stats: ["6", "1", "8", "2", "1"],
        regles: "Pistol, Melta (3)",
        traits: "Assault, Melta",
      },
      {
        // Arme de Kor Phaeron (Word Bearers).
        nom: "Digi-flamer",
        stats: ["Template", "1", "4", "-", "1"],
        regles: "Template",
        traits: "Flame, Assault",
      },
      {
        // Arme du Dreadnought Mhara Gal (Word Bearers).
        nom: "Warpfire cannon",
        stats: ["36", "1", "6", "4", "2"],
        regles: "Heavy (RS), Blast (3\"), Breaching (4+), Rending (6+)",
        traits: "Plasma",
      },
      {
        // Arme du Dreadnought Mhara Gal (Word Bearers).
        nom: "Warp Brazier",
        stats: ["Template", "1", "5", "4", "1"],
        regles: "Template, Panic (2), Breaching (4+), Rending (6+)",
        traits: "Flame",
      },
      {
        // Arsenal des Maisonnées de Chevaliers et des Legios Titaniques.
        nom: "Acheron Infernus cannon",
        stats: ["Template", "1", "7", "4", "1"],
        regles:
          "Template (Furnace), Heavy (AP), Rending (5+), Panic (2)",
        traits: "Flame",
      },
      /* --- Arsenal des Solar Auxilia (Liber Auxilia). --- */
      {
        nom: "Heavy incinerator",
        stats: ["Template", "1", "6", "4", "1"],
        regles: "Template, Panic (1), Rending (4+)",
        traits: "Flame",
      },
      {
        nom: "Infernus cannon",
        stats: ["Template", "1", "6", "4", "2"],
        regles: "Template (Furnace), Heavy (AP), Panic (2)",
        traits: "Flame",
      },
    ],
  },
  /* --- Armes Laser — 25 entrées --- */
  {
    titre: "Las Weapons",
    armes: [
      {
        nom: "Lascannon",
        stats: ["48", "1", "9", "2", "1"],
        regles: "Heavy (D), Armourbane",
        traits: "Las",
      },
      {
        nom: "Twin lascannon",
        stats: ["48", "2", "9", "2", "1"],
        regles: "Heavy (D), Armourbane",
        traits: "Las",
      },
      {
        nom: "Lascannon array",
        stats: ["48", "2", "9", "2", "3"],
        regles: "Armourbane",
        traits: "Las",
      },
      {
        nom: "Arachnus heavy lascannon battery",
        stats: ["48", "2", "9", "2", "4"],
        regles: "Heavy (RS), Armourbane, Skyfire",
        traits: "Las",
      },
      {
        nom: "Laser destructor",
        stats: ["36", "2", "10", "2", "2"],
        regles: "Heavy (D), Armourbane",
        traits: "Las",
      },
      {
        // Arme du Destroyer Tank Hunter (Legacies, Solar Auxilia) :
        // proche du Destructeur laser ci-dessus mais avec Surcharge (1)
        // en plus (matériaux moins coûteux, moins fiable) — nom
        // distinct, voir le texte d'ambiance du PDF.
        nom: "Proteus laser destroyer",
        stats: ["36", "2", "10", "2", "2"],
        regles: "Heavy (D), Armourbane, Overload (1)",
        traits: "Las",
      },
      {
        // Journal Tactica : Battle of Tallarn (Section de Rapier).
        nom: "Mole mortar",
        stats: ["36", "2", "7", "3", "2"],
        regles:
          "Heavy (D), Barrage (0), Armourbane, Pinning (1), Subterranean",
        traits: "-",
      },
      {
        nom: "Laser magna-destructor",
        stats: ["36", "2", "10", "2", "3"],
        regles: "Ordnance (D), Armourbane",
        traits: "Las",
      },
      {
        nom: "Neutron laser",
        stats: ["36", "2", "10", "2", "2"],
        regles: "Ordnance (D), Armourbane, Shock (Suppressed)",
        traits: "Las",
      },
      {
        nom: "Neutron blaster",
        stats: ["24", "1", "9", "2", "3"],
        regles: "Armourbane, Shock (Suppressed), Overload (1)",
        traits: "Las",
      },
      {
        nom: "Neutron laser battery",
        stats: ["72", "3", "10", "2", "3"],
        regles:
          "Ordnance (D), Armourbane, Shock (Suppressed), Overload (1)",
        traits: "Las",
      },
      {
        nom: "Neutron wave cannon",
        stats: ["120", "2", "12", "2", "4"],
        regles: "Ordnance (D), Armourbane, Shock (Stunned)",
        traits: "Las",
      },
      {
        nom: "Turbo-laser destructor",
        stats: ["96", "1", "12", "2", "6"],
        regles: "Blast (3\"), Armourbane",
        traits: "Las",
      },
      /* --- Arsenal des Maisonnées de Chevaliers et des Legios
         Titaniques. --- */
      {
        nom: "Multi-laser",
        stats: ["36", "3", "6", "6", "1"],
        regles: "Suppressive (1)",
        traits: "Las",
      },
      {
        // Option du Carnodon Strike Tank (Legacies, Solar Auxilia) :
        // profil jumelé du Multi-laser ci-dessus.
        nom: "Twin multi-laser (Solar Auxilia)",
        stats: ["36", "6", "6", "6", "1"],
        regles: "Suppressive (1)",
        traits: "Las",
      },
      {
        nom: "Neutron wave battery",
        stats: ["120", "4", "12", "2", "4"],
        regles: "Ordnance (D), Armourbane, Shock (Stunned)",
        traits: "Las",
      },
      /* --- Arsenal des Solar Auxilia (Liber Auxilia). --- */
      {
        nom: "Laspistol",
        stats: ["12", "1", "3", "-", "1"],
        regles: "Pistol",
        traits: "Assault, Las",
      },
      {
        nom: "Lasrifle — Volley",
        stats: ["30", "1", "3", "6", "1"],
        regles: "Heavy (FP)",
        traits: "Las",
      },
      {
        // Errata Liber Auxilia : « Blast-charger* » (astérisque ajouté).
        nom: "Lasrifle — Overcharge*",
        stats: ["18", "1", "4", "4", "1"],
        regles: "Wounding (6+), Rending (6+)",
        traits: "Las",
      },
      {
        nom: "Las-blaster",
        stats: ["9", "2", "4", "4", "1"],
        regles: "Pistol, Wounding (6+), Rending (6+)",
        traits: "Assault, Las",
      },
      {
        nom: "Gravis multi-laser battery",
        stats: ["36", "6", "6", "6", "2"],
        regles: "Suppressive (1)",
        traits: "Las",
      },
      /* --- Arsenal des Taghmata du Mechanicum (Liber Mechanicum). --- */
      {
        nom: "Lasmusket",
        stats: ["18", "1", "4", "6", "1"],
        regles: "-",
        traits: "Las",
      },
      {
        nom: "Photon thruster",
        stats: ["24", "2", "8", "2", "1"],
        regles: "Armourbane, Suppressive (1), Armour-breaker (5+)",
        traits: "Las",
      },
      {
        nom: "Pounding pulsar",
        stats: ["36", "2", "9", "2", "3"],
        regles: "Ordnance (FP), Suppressive (2)",
        traits: "Las",
      },
      {
        nom: "Darkfire cannon",
        stats: ["36", "2", "8", "2", "1"],
        regles: "Heavy (D), Suppressive (2)",
        traits: "Las",
      },
      {
        nom: "Sollex heavy laser",
        stats: ["48", "2", "10", "2", "2"],
        regles: "Ordnance (D), Shock (Suppressed), Armourbane",
        traits: "Las",
      },
    ],
  },
  /* --- Armes à Fusion — 17 entrées --- */
  {
    titre: "Melta Weapons",
    armes: [
      {
        nom: "Meltagun",
        stats: ["12", "1", "8", "2", "3"],
        regles: "Melta (6)",
        traits: "Melta",
      },
      {
        // Arsenal des Blood Angels : échange contre un pistolet à
        // plasma pour toute Figurine ayant le Trait Blood Angels,
        // +5 Points par Figurine.
        nom: "Inferno pistol",
        stats: ["6", "1", "8", "2", "1"],
        regles: "Pistol, Melta (3)",
        traits: "Assault, Melta",
      },
      {
        // Arme de personnage (Sanguinius, Primarque des Blood Angels).
        nom: "Infernus",
        stats: ["18", "2", "8", "2", "3"],
        regles: "Melta (12), Limited (1)",
        traits: "Melta, Assault",
      },
      {
        nom: "Multi-melta",
        stats: ["24", "1", "8", "2", "3"],
        regles: "Heavy (RS), Melta (8)",
        traits: "Melta",
      },
      {
        nom: "Twin multi-melta",
        stats: ["24", "1", "9", "2", "3"],
        regles: "Heavy (RS), Melta (8)",
        traits: "Melta",
      },
      {
        nom: "Gravis melta cannon",
        stats: ["24", "1", "9", "2", "4"],
        regles: "Heavy (RS), Melta (8)",
        traits: "Melta",
      },
      {
        // Arme du Dreadnought Castra Ferrum (Legacies, générique
        // Legiones Astartes).
        nom: "Gravis missile launcher — Frag",
        stats: ["48", "1", "4", "6", "1"],
        regles: "Heavy (RS), Blast (5\")",
        traits: "Missile",
      },
      {
        nom: "Gravis missile launcher — Krak",
        stats: ["48", "2", "8", "3", "1"],
        regles: "Heavy (D)",
        traits: "Missile",
      },
      {
        nom: "Magna-melta cannon",
        stats: ["36", "1", "9", "2", "4"],
        regles: "Heavy (RS), Melta (12)",
        traits: "Melta",
      },
      {
        nom: "Cyclonic melta lance",
        stats: ["12", "3", "8", "2", "3"],
        regles: "Heavy (RS), Melta (8)",
        traits: "Melta",
      },
      {
        nom: "Siege melta array",
        stats: ["12", "1", "10", "2", "4"],
        regles: "Heavy (RS), Blast (5\"), Melta (6)",
        traits: "Melta",
      },
      {
        nom: "Melta cutters",
        stats: ["6", "1", "8", "2", "3"],
        regles: "Heavy (RS), Blast (3\"), Melta (6)",
        traits: "Melta",
      },
      {
        nom: "Melta blaster",
        stats: ["36", "2", "9", "2", "4"],
        regles: "Heavy (RS), Melta (24)",
        traits: "Melta",
      },
      {
        nom: "Sentry melta array",
        stats: ["18", "2", "8", "2", "2"],
        regles: "Heavy (RS), Melta (8)",
        traits: "Melta",
      },
      /* --- Arsenal des Maisonnées de Chevaliers et des Legios
         Titaniques. --- */
      {
        nom: "Thermal lance",
        stats: ["24", "1", "9", "2", "4"],
        regles: "Heavy (RS), Melta (12)",
        traits: "Melta",
      },
      {
        nom: "Thermal cannon",
        stats: ["36", "1", "10", "2", "6"],
        regles: "Heavy (RS), Blast (3\"), Melta (12)",
        traits: "Melta",
      },
      /* --- Arsenal des Solar Auxilia (Liber Auxilia). --- */
      {
        nom: "Melta lance",
        stats: ["18", "1", "9", "2", "4"],
        regles: "Heavy (RS), Armourbane",
        traits: "Melta",
      },
    ],
  },
  /* --- Armes à Missiles — 41 entrées --- */
  {
    titre: "Missile Weapons",
    armes: [
      {
        nom: "Missile launcher — Frag",
        stats: ["48", "1", "4", "6", "1"],
        regles: "Heavy (RS), Blast (3\")",
        traits: "Missile",
      },
      {
        nom: "Missile launcher — Krak",
        stats: ["48", "1", "8", "3", "1"],
        regles: "Heavy (D)",
        traits: "Missile",
      },
      {
        nom: "Missile launcher — Flak",
        stats: ["48", "1", "8", "4", "1"],
        regles: "Heavy (D), Skyfire",
        traits: "Missile",
      },
      {
        nom: "Vengeance launcher",
        stats: ["48", "1", "7", "4", "1"],
        regles: "Blast (5\")",
        traits: "Missile",
      },
      {
        nom: "Havoc launcher",
        stats: ["48", "1", "5", "5", "1"],
        regles: "Blast (3\"), Stun (1)",
        traits: "Missile",
      },
      {
        nom: "Hunter-killer missile",
        stats: ["48", "1", "9", "3", "3"],
        regles: "Armourbane, Limited (1)",
        traits: "Guided Missile",
      },
      {
        nom: "Hellstrike missile",
        stats: ["48", "1", "9", "3", "3"],
        regles: "Armourbane, Limited (1)",
        traits: "Missile",
      },
      {
        // Arsenal des Taghmata du Mechanicum (Liber Mechanicum) : les
        // Unités Taghmata doivent utiliser cette version de l'arme.
        nom: "Hunter-killer missile (Mechanicum)",
        stats: ["48", "1", "9", "3", "3"],
        regles: "Armourbane",
        traits: "Missile",
      },
      /* --- Arsenal des Solar Auxilia (Liber Auxilia) : les Unités
         Solar Auxilia doivent utiliser cette version de l'arme. --- */
      {
        nom: "Hunter-killer missile (Solar Auxilia)",
        stats: ["48", "1", "9", "3", "3"],
        regles: "Armourbane, Limited (1)",
        traits: "Missile",
      },
      {
        nom: "Hellstrike missile (Solar Auxilia)",
        stats: ["48", "1", "9", "3", "3"],
        regles: "Armourbane, Limited (1)",
        traits: "Guided Missile",
      },
      {
        nom: "Deathstorm missile launcher",
        stats: ["18", "D3", "6", "4", "1"],
        regles: "Pinning (1)",
        traits: "Missile",
      },
      {
        nom: "Kharybdis missile launcher",
        stats: ["18", "5", "6", "4", "1"],
        regles: "Pinning (1)",
        traits: "Missile",
      },
      {
        nom: "Rotary missile launcher",
        stats: ["48", "3", "8", "2", "2"],
        regles: "-",
        traits: "Guided Missile",
      },
      {
        nom: "Sabre missile",
        stats: ["36", "1", "7", "4", "2"],
        regles: "Breaching (6+), Limited (1)",
        traits: "Missile",
      },
      {
        nom: "Tempest rocket",
        stats: ["48", "1", "7", "4", "3"],
        regles: "Armourbane, Limited (1)",
        traits: "Missile",
      },
      {
        nom: "Aiolos missile launcher",
        stats: ["60", "1", "6", "4", "1"],
        regles: "Heavy (FP), Blast (3\"), Barrage (1)",
        traits: "Missile",
      },
      {
        nom: "Boreas air defence missile",
        stats: ["48", "1", "8", "2", "3"],
        regles: "Limited (1), Skyfire, Swift Pursuit",
        traits: "Missile",
      },
      {
        nom: "Spicula rocket system",
        stats: ["72", "1", "7", "4", "1"],
        regles: "Blast (7\"), Barrage (2), Suppressive (1)",
        traits: "Missile",
      },
      {
        nom: "Arcus missile launcher — Arcus warheads",
        stats: ["36", "5", "8", "2", "2"],
        regles: "-",
        traits: "Missile",
      },
      {
        nom: "Arcus missile launcher — Skyspear warheads",
        stats: ["36", "3", "8", "2", "2"],
        regles: "Skyfire, Armourbane, Swift Pursuit",
        traits: "Missile",
      },
      {
        nom: "Arcus missile launcher — Pyrax warheads",
        stats: ["36", "1", "5", "4", "1"],
        regles: "Blast (5\"), Panic (1)",
        traits: "Missile",
      },
      {
        nom: "Arcus missile launcher — Neutron-flux warheads",
        stats: ["36", "3", "7", "4", "1"],
        regles: "Shock (Suppressed)",
        traits: "Missile",
      },
      {
        nom: "Cyclone missile launcher — Frag",
        stats: ["48", "1", "4", "6", "1"],
        regles: "Heavy (RS), Blast (5\")",
        traits: "Missile",
      },
      {
        nom: "Cyclone missile launcher — Krak",
        stats: ["48", "2", "8", "3", "1"],
        regles: "Heavy (D)",
        traits: "Missile",
      },
      {
        nom: "Cyclone missile launcher — Flak",
        stats: ["48", "2", "8", "4", "1"],
        regles: "Heavy (D), Skyfire",
        traits: "Missile",
      },
      {
        // Arsenal des Taghmata du Mechanicum (Liber Mechanicum) : les
        // Unités Taghmata doivent utiliser cette version de l'arme.
        nom: "Cyclone missile launcher (Mechanicum) — Frag",
        stats: ["48", "1", "4", "6", "1"],
        regles: "Heavy (RS), Blast (5\")",
        traits: "Missile",
      },
      {
        nom: "Cyclone missile launcher (Mechanicum) — Krak",
        stats: ["48", "2", "8", "3", "1"],
        regles: "Heavy (D)",
        traits: "Missile",
      },
      {
        nom: "Cyclone missile launcher (Mechanicum) — Flak",
        stats: ["48", "2", "8", "4", "1"],
        regles: "Heavy (D), Skyfire",
        traits: "Missile",
      },
      {
        nom: "Scorpius missile launcher",
        stats: ["48", "1", "8", "4", "1"],
        regles: "Heavy (FP), Blast (3\"), Barrage (2), Breaching (5+)",
        traits: "Missile",
      },
      {
        nom: "Whirlwind missile launcher — HE missiles",
        stats: ["48", "1", "6", "4", "1"],
        regles: "Blast (5\"), Stun (1), Barrage (1)",
        traits: "Missile",
      },
      {
        nom: "Whirlwind missile launcher — Pyrax missiles*",
        stats: ["48", "1", "5", "5", "1"],
        regles: "Blast (5\"), Panic (1), Barrage (1)",
        traits: "Missile",
      },
      {
        nom: "Hyperios missile launcher",
        stats: ["48", "3", "7", "3", "2"],
        regles: "Skyfire, Swift Pursuit",
        traits: "Missile",
      },
      {
        nom: "Orias Frag missile",
        stats: ["48", "1", "6", "5", "1"],
        regles: "Barrage (3), Blast (5\"), Limited (1)",
        traits: "Missile",
      },
      /* --- Arsenal des Maisonnées de Chevaliers et des Legios
         Titaniques. --- */
      {
        nom: "Ironstorm missile pod",
        stats: ["72", "1", "5", "4", "1"],
        regles: "Ordnance (D), Blast (5\")",
        traits: "Missile",
      },
      {
        nom: "Ironstorm missile battery",
        stats: ["72", "2", "5", "4", "1"],
        regles: "Ordnance (D), Blast (5\")",
        traits: "Missile",
      },
      {
        nom: "Stormspear rocket pod",
        stats: ["48", "3", "7", "3", "1"],
        regles: "-",
        traits: "Missile",
      },
      /* --- Arsenal des Solar Auxilia (Liber Auxilia). --- */
      {
        nom: "Hunter-killer missile battery",
        stats: ["48", "2", "9", "3", "3"],
        regles: "Armourbane, Limited (2)",
        traits: "Guided Missile",
      },
      {
        nom: "Aethon missile battery",
        stats: ["30", "1", "4", "5", "2"],
        regles: "Blast (5\"), Barrage (1), Stun (1)",
        traits: "Missile",
      },
      /* --- Arsenal du Mechanicum (Legacies, Liber Mechanicum) : Batterie
         Tarantula, voir js/unites-data.js. --- */
      {
        nom: "Hyperios missile launcher",
        stats: ["48", "3", "7", "3", "2"],
        regles: "Skyfire, Swift Pursuit",
        traits: "Missile",
      },
      {
        nom: "Orias fragmentation missile",
        stats: ["48", "1", "6", "5", "1"],
        regles: "Barrage (3), Blast (5\"), Limited (1)",
        traits: "Missile",
      },
      {
        // Arme du Praetor Armoured Assault Launcher (Legacies, Solar
        // Auxilia).
        nom: "Praetor launcher",
        stats: ["72", "1", "8", "5", "2"],
        regles: "Blast (7\"), Barrage (2), Suppressive (2)",
        traits: "Missile",
      },
    ],
  },
  /* --- Armes à Particules — 2 entrées --- */
  {
    titre: "Particle Weapons",
    armes: [
      {
        nom: "Particle lacerator",
        stats: ["Template", "1", "6", "3", "1"],
        regles: "Template, Breaching (6+), Overload (1)",
        traits: "Assault, Particle",
      },
      {
        nom: "Heavy particle lacerator",
        stats: ["Template", "1", "6", "3", "2"],
        regles: "Template, Breaching (6+), Overload (1)",
        traits: "Assault, Particle",
      },
    ],
  },
  /* --- Armes à Phosphex — 2 entrées --- */
  {
    titre: "Phosphex Weapons",
    armes: [
      {
        nom: "Phosphex bomb",
        stats: ["6", "1", "5", "3", "1"],
        regles: "Blast (3\"), Poisoned (3+), Panic (3), Breaching (5+)",
        traits: "Phosphex",
      },
      {
        nom: "Phosphex discharger",
        stats: ["18", "1", "5", "3", "1"],
        regles:
          "Blast (3\"), Limited (3), Poisoned (3+), Panic (3), Breaching (5+)",
        traits: "Phosphex",
      },
    ],
  },
  /* --- Arsenal des Solar Auxilia (Liber Auxilia). --- */
  {
    titre: "Needle Weapons",
    armes: [
      {
        nom: "Needle pistol",
        stats: ["12", "2", "2", "-", "1"],
        regles: "Poisoned (3+), Pistol, Pinning (1)",
        traits: "Assault, Needles",
      },
    ],
  },
  /* --- Armes à Plasma — 46 entrées --- */
  {
    titre: "Plasma Weapons",
    armes: [
      {
        nom: "Plasma pistol — Sustained fire",
        stats: ["12", "1", "6", "4", "1"],
        regles: "Pistol, Breaching (6+)",
        traits: "Assault, Plasma",
      },
      {
        nom: "Plasma pistol — Maximal fire",
        stats: ["12", "1", "7", "4", "1"],
        regles: "Pistol, Breaching (5+), Overload (1)",
        traits: "Assault, Plasma",
      },
      {
        nom: "Overcharged plasma pistol",
        stats: ["12", "3", "8", "4", "1"],
        regles: "Pistol, Breaching (4+), Overload (1)",
        traits: "Assault, Plasma",
      },
      {
        nom: "Plasma gun — Sustained fire",
        stats: ["24", "2", "6", "4", "1"],
        regles: "Breaching (6+)",
        traits: "Plasma",
      },
      {
        nom: "Plasma gun — Maximal fire",
        stats: ["24", "2", "7", "4", "1"],
        regles: "Breaching (5+), Overload (1)",
        traits: "Plasma",
      },
      {
        nom: "Twin plasma gun — Sustained fire",
        stats: ["24", "2", "6", "4", "1"],
        regles: "Breaching (5+)",
        traits: "Plasma",
      },
      {
        nom: "Twin plasma gun — Maximal fire",
        stats: ["24", "2", "7", "4", "1"],
        regles: "Breaching (4+), Overload (1)",
        traits: "Plasma",
      },
      {
        nom: "Plasma bombard — Sustained fire",
        stats: ["24", "1", "6", "4", "1"],
        regles: "Blast (3\"), Barrage (1), Breaching (6+)",
        traits: "Plasma",
      },
      {
        nom: "Plasma bombard — Maximal fire",
        stats: ["24", "1", "7", "4", "1"],
        regles: "Blast (3\"), Barrage (1), Breaching (5+), Overload (2)",
        traits: "Plasma",
      },
      {
        nom: "Heavy plasma bombard — Sustained fire",
        stats: ["36", "1", "7", "4", "2"],
        regles: "Blast (5\"), Barrage (1), Breaching (6+)",
        traits: "Plasma",
      },
      {
        nom: "Heavy plasma bombard — Maximal fire",
        stats: ["36", "1", "8", "4", "2"],
        regles: "Blast (5\"), Barrage (1), Breaching (5+), Overload (2)",
        traits: "Plasma",
      },
      {
        nom: "Plasma cannon — Sustained fire",
        stats: ["36", "1", "6", "4", "1"],
        regles: "Heavy (RS), Blast (3\"), Breaching (6+)",
        traits: "Plasma",
      },
      {
        nom: "Plasma cannon — Maximal fire",
        stats: ["36", "1", "6", "4", "1"],
        regles: "Heavy (RS), Blast (3\"), Breaching (5+), Overload (2)",
        traits: "Plasma",
      },
      {
        nom: "Gravis plasma cannon — Sustained fire",
        stats: ["36", "1", "7", "4", "1"],
        regles: "Heavy (RS), Blast (5\"), Breaching (6+)",
        traits: "Plasma",
      },
      {
        nom: "Gravis plasma cannon — Maximal fire",
        stats: ["36", "1", "7", "4", "2"],
        regles: "Heavy (RS), Blast (5\"), Breaching (5+), Overload (1)",
        traits: "Plasma",
      },
      {
        nom: "Plasma blaster — Sustained fire",
        stats: ["18", "2", "7", "4", "1"],
        regles: "Breaching (6+)",
        traits: "Plasma",
      },
      {
        nom: "Plasma blaster — Maximal fire",
        stats: ["18", "2", "8", "4", "1"],
        regles: "Breaching (5+), Overload (1)",
        traits: "Plasma",
      },
      {
        nom: "Executioner plasma destructor — Sustained fire",
        stats: ["36", "1", "8", "4", "1"],
        regles: "Blast (5\"), Breaching (5+)",
        traits: "Plasma",
      },
      {
        nom: "Executioner plasma destructor — Maximal fire",
        stats: ["36", "1", "8", "4", "2"],
        regles: "Blast (5\"), Breaching (4+), Overload (1)",
        traits: "Plasma",
      },
      {
        nom: "Hellfire plasma cannonade — Sustained fire",
        stats: ["36", "6", "6", "4", "1"],
        regles: "Heavy (RS), Breaching (5+)",
        traits: "Plasma",
      },
      {
        nom: "Hellfire plasma cannonade — Maximal fire",
        stats: ["36", "1", "7", "4", "2"],
        regles: "Heavy (RS), Blast (5\"), Breaching (4+), Overload (1)",
        traits: "Plasma",
      },
      {
        nom: "Omega plasma array — Sustained fire",
        stats: ["36", "6", "7", "4", "2"],
        regles: "Breaching (5+)",
        traits: "Plasma",
      },
      {
        nom: "Omega plasma array — Maximal fire",
        stats: ["36", "1", "8", "4", "2"],
        regles: "Blast (5\"), Breaching (4+), Overload (1)",
        traits: "Plasma",
      },
      {
        // Arme de personnage (Lion El'Jonson, Primarque des Dark
        // Angels).
        nom: "The Actinaeus Rifle",
        stats: ["18", "2", "7", "3", "2"],
        regles: "Breaching (4+)",
        traits: "Assault, Plasma",
      },
      {
        nom: "Plasma burner — Sustained fire",
        stats: ["Template", "1", "5", "4", "1"],
        regles: "Template, Breaching (6+)",
        traits: "Plasma",
      },
      {
        nom: "Plasma burner — Maximal fire",
        stats: ["Template", "1", "6", "4", "1"],
        regles: "Template, Breaching (5+), Overload (1)",
        traits: "Plasma",
      },
      {
        nom: "Plasma incinerator — Sustained fire",
        stats: ["Template", "1", "5", "4", "2"],
        regles: "Template, Breaching (6+)",
        traits: "Plasma",
      },
      {
        nom: "Plasma incinerator — Maximal fire",
        stats: ["Template", "1", "6", "4", "2"],
        regles: "Template, Breaching (5+), Overload (1)",
        traits: "Plasma",
      },
      {
        // Arme des Chevaliers du Cercle Intérieur (Dark Angels) : arme
        // digitale compacte, montée sur avant-bras pour préserver la
        // liberté de mouvement en mêlée.
        nom: "Plasma lance — Sustained fire",
        stats: ["Template", "1", "4", "4", "1"],
        regles: "Template, Breaching (6+)",
        traits: "Plasma",
      },
      {
        nom: "Plasma lance — Maximal fire",
        stats: ["Template", "1", "4", "4", "1"],
        regles: "Template, Breaching (5+), Overload (1)",
        traits: "Plasma",
      },
      /* --- Dark Angels Legacy Wargear (dark_angels_wargear.pdf) :
         ajouté à la liste des Armes Spéciales de Légion (LISTES_
         EQUIPEMENT.speciales, requiertLegion "I") pour toute Figurine
         ayant le Trait Dark Angels (+15 Points). --- */
      {
        nom: "Plasma repeater — Sustained fire",
        stats: ["12", "3", "5", "4", "1"],
        regles: "Breaching (6+)",
        traits: "Plasma",
      },
      {
        nom: "Plasma repeater — Maximal fire",
        stats: ["12", "3", "6", "4", "1"],
        regles: "Breaching (5+), Overload (1)",
        traits: "Plasma",
      },
      /* --- Arsenal des Dark Angels (Ire Légion) : Excindio, Cabale
         Enigmatus de la Firewing (voir js/unites-data.js, unités
         réservées à cette Légion). --- */
      {
        // Arme de l'Unité Excindio (Dark Angels).
        nom: "Athanax phosphex canister launcher",
        stats: ["24", "1", "6", "4", "1"],
        regles:
          "Blast (3\"), Barrage (2), Pinning (3), Poisoned (2+), Phage (T)",
        traits: "Rad",
      },
      {
        // Arme de l'Unité Excindio (Dark Angels).
        nom: "Tyrhenius nerve induction shredder",
        stats: ["18", "10", "1", "-", "1"],
        regles: "Poisoned (2+), Panic (1)",
        traits: "Assault",
      },
      {
        // Arme de l'Unité Excindio (Dark Angels).
        nom: "Magaron atomantic pulse cannon",
        stats: ["24", "3", "8", "2", "1"],
        regles: "Armourbane, Shock (Suppressed)",
        traits: "Assault",
      },
      {
        // Arme de l'Unité Excindio (Dark Angels).
        nom: "Cytheron graviton flux projector",
        stats: ["Template", "1", "7", "4", "2"],
        regles: "Template, Breaching (5+), Shock (Pinned), Pinning (3)",
        traits: "Assault, Graviton",
      },
      {
        // Arme de l'Unité Excindio (Dark Angels).
        nom: "Irad cleanser",
        stats: ["Template", "1", "2", "5", "1"],
        regles: "Template, Phage (T), Poisoned (2+), Panic (1)",
        traits: "Rad",
      },
      {
        // Arme de l'Unité Cabale Enigmatus de la Firewing (Dark Angels).
        nom: "Needle pistol",
        stats: ["12", "2", "2", "-", "1"],
        regles: "Poisoned (3+), Pistol, Pinning (1)",
        traits: "Assault, Needle",
      },
      {
        // Arme de l'Unité Cabale Enigmatus de la Firewing (Dark Angels) :
        // profil Frag, voir aussi Krak et Stase ci-dessous.
        nom: "Enigmatus missile launcher — Frag",
        stats: ["24", "1", "3", "6", "1"],
        regles: "Blast (3\")",
        traits: "Assault",
      },
      {
        // Profil Krak, voir aussi Frag ci-dessus et Stase ci-dessous.
        nom: "Enigmatus missile launcher — Krak",
        stats: ["24", "1", "6", "4", "2"],
        regles: "-",
        traits: "Assault",
      },
      {
        // Profil Stase, voir aussi Frag et Krak ci-dessus.
        nom: "Enigmatus missile launcher — Stasis",
        stats: ["24", "1", "4", "-", "2"],
        regles: "Blast (3\"), Stun (3)",
        traits: "Assault, Stasis",
      },
      {
        // Arsenal des Maisonnées de Chevaliers et des Legios Titaniques.
        nom: "Phased plasma-fusil",
        stats: ["24", "3", "5", "3", "1"],
        regles: "Breaching (5+)",
        traits: "Plasma",
      },
      {
        nom: "Twin phased plasma-fusil",
        stats: ["24", "4", "5", "3", "1"],
        regles: "Breaching (4+)",
        traits: "Plasma",
      },
      {
        nom: "Plasma mortar",
        stats: ["36", "1", "8", "4", "2"],
        regles: "Ordnance (R), Breaching (5+), Blast (5\"), Barrage (2)",
        traits: "Plasma",
      },
      {
        // Arme du Stormblade Super-heavy Tank (Legacies, Solar
        // Auxilia).
        nom: "Plasma blastgun — Sustained fire",
        stats: ["60", "1", "8", "2", "5"],
        regles: "Blast (3\")",
        traits: "Plasma",
      },
      {
        nom: "Plasma blastgun — Maximal fire",
        stats: ["60", "1", "9", "2", "7"],
        regles: "Blast (5\"), Overload (1)",
        traits: "Plasma",
      },
    ],
  },
  /* --- Armes Rad — 16 entrées --- */
  {
    titre: "Rad Weapons",
    armes: [
      {
        nom: "Rad grenades",
        stats: ["8", "1", "4", "3", "1"],
        regles: "Poisoned (2+), Phage (T)",
        traits: "Rad",
      },
      {
        // Arme du Macrocarid Explorator (Legacies, Mechanicum) : profil
        // jumelé du Nettoyeur irad (voir plus loin dans cette liste),
        // voir js/unites-data.js.
        nom: "Twin irad cleanser",
        stats: ["Template", "1", "2", "5", "2"],
        regles: "Template, Phage (T), Poisoned (2+), Panic (1)",
        traits: "Rad",
      },
      {
        // Arme des Interemptors de la Dreadwing (Dark Angels) : profil
        // Missile Rad, voir aussi Missile à stase ci-dessous.
        nom: "Destroyer missile launcher — Rad missile",
        stats: ["24", "2", "4", "3", "1"],
        regles: "Poisoned (2+), Phage (T)",
        traits: "Assault, Rad",
      },
      {
        // Arme des Interemptors de la Dreadwing (Dark Angels) : profil
        // Missile à stase, voir aussi Missile Rad ci-dessus.
        nom: "Destroyer missile launcher — Stasis missile",
        stats: ["24", "1", "4", "-", "2"],
        regles: "Blast (3\"), Stun (3)",
        traits: "Assault, Stasis",
      },
      /* --- Arsenal des Ultramarines (XIIIe Légion) : Escouade
         Terminator Fulmentarus, Escouade de Destructeurs Némésis (voir
         js/unites-data.js, unités réservées à cette Légion). --- */
      {
        nom: "Mortifier bolter",
        stats: ["18", "2", "4", "5", "1"],
        regles: "Panic (1)",
        traits: "Bolt",
      },
      {
        // Arme de l'Unité Terminator Fulmentarus (Ultramarines) : profil
        // Missiles à éclats, voir aussi Missiles à plasma Hellfire
        // ci-dessous.
        nom: "Fulmentarus missile array — Splinter missiles",
        stats: ["36", "4", "4", "5", "1"],
        regles: "Suppressive (1)",
        traits: "Missile",
      },
      {
        // Arme de l'Unité Terminator Fulmentarus (Ultramarines) : profil
        // Missiles à plasma Hellfire, voir aussi Missiles à éclats
        // ci-dessus.
        nom: "Fulmentarus missile array — Hellfire plasma missiles",
        stats: ["36", "2", "7", "4", "1"],
        regles: "Breaching (5+)",
        traits: "Missile, Plasma",
      },
      /* --- Arsenal des Maisonnées de Chevaliers et des Legios
         Titaniques. --- */
      {
        nom: "Irradiator",
        stats: ["Template", "1", "2", "5", "1"],
        regles: "Template, Panic (1), Phage (T), Poisoned (2+)",
        traits: "Rad",
      },
      {
        nom: "Rad-cannon",
        stats: ["Template", "1", "5", "4", "2"],
        regles:
          "Template, Panic (2), Phage (T), Poisoned (2+), Breaching (6+)",
        traits: "Rad",
      },
      {
        nom: "Karacnos mortar",
        stats: ["60", "1", "6", "4", "1"],
        regles:
          "Blast (3\"), Barrage (2), Phage (T), Pinning (3), Poisoned (2+)",
        traits: "Rad",
      },
      /* --- Arsenal des Taghmata du Mechanicum (Liber Mechanicum). --- */
      {
        // Les Unités Taghmata doivent utiliser cette version de l'arme.
        nom: "Irradiator (Mechanicum)",
        stats: ["Template", "1", "2", "5", "1"],
        regles: "Template, Phage (T), Poisoned (2+), Panic (1)",
        traits: "Rad",
      },
      {
        nom: "Irradiation engine",
        stats: ["Template", "1", "4", "5", "1"],
        regles:
          "Template, Heavy (AP), Phage (T), Poisoned (2+), Panic (1)",
        traits: "Rad",
      },
      {
        nom: "Vultarax missile launcher — Airburst",
        stats: ["36", "1", "6", "4", "1"],
        regles: "Blast (5\"), Phage (T), Panic (0)",
        traits: "Rad",
      },
      {
        nom: "Vultarax missile launcher — Shaped charge",
        stats: ["36", "2", "10", "2", "2"],
        regles: "Phage (T), Panic (0), Shock (Stunned)",
        traits: "Rad",
      },
      {
        nom: "Karacnos mortar battery",
        stats: ["60", "1", "6", "4", "1"],
        regles:
          "Blast (5\"), Barrage (2), Poisoned (2+), Phage (T), Pinning (3)",
        traits: "Rad",
      },
      {
        nom: "Irradiation blaster",
        stats: ["16", "1", "2", "4", "2"],
        regles:
          "Blast (5\"), Ordnance (D), Shock (Stunned), Phage (T), Poisoned (2+), Panic (2)",
        traits: "Rad",
      },
    ],
  },
  /* --- Armes Soniques — 1 entrée --- */
  {
    titre: "Sonic Weapons",
    armes: [
      {
        nom: "Concussion resonator",
        stats: ["Template", "2", "6", "5", "1"],
        regles: "Template, Overload (1), Stun (2)",
        traits: "Assault, Sonic",
      },
    ],
  },
  /* --- Armes Volkites — 20 entrées --- */
  {
    titre: "Volkite Weapons",
    armes: [
      {
        nom: "Volkite serpenta",
        stats: ["10", "2", "5", "5", "1"],
        regles: "Pistol, Deflagrate (5)",
        traits: "Assault, Volkite",
      },
      {
        nom: "Overcharged volkite serpenta",
        stats: ["10", "4", "6", "5", "1"],
        regles: "Pistol, Deflagrate (5), Overload (1)",
        traits: "Assault, Volkite",
      },
      {
        // Arme de personnage (Dominion Zephon, Blood Angels).
        nom: "Lament and Sorrow",
        stats: ["10", "6", "5", "5", "1"],
        regles: "Deflagrate (5), Stun (1)",
        traits: "Assault, Volkite",
      },
      {
        nom: "Volkite charger",
        stats: ["15", "2", "5", "5", "1"],
        regles: "Deflagrate (5)",
        traits: "Volkite",
      },
      {
        nom: "Twin volkite charger",
        stats: ["15", "3", "5", "5", "1"],
        regles: "Deflagrate (5)",
        traits: "Volkite",
      },
      {
        // Arme de personnage (Evander Garrius, Imperial Fists).
        nom: "Incineratus",
        stats: ["15", "4", "5", "5", "1"],
        regles: "Deflagrate (6)",
        traits: "Volkite",
      },
      {
        nom: "Volkite caliver",
        stats: ["30", "2", "6", "5", "1"],
        regles: "Deflagrate (6)",
        traits: "Volkite",
      },
      {
        nom: "Twin volkite caliver",
        stats: ["30", "3", "6", "5", "1"],
        regles: "Heavy (FP), Deflagrate (6)",
        traits: "Volkite",
      },
      {
        nom: "Volkite culverin",
        stats: ["45", "3", "6", "5", "1"],
        regles: "Heavy (FP), Deflagrate (6)",
        traits: "Volkite",
      },
      {
        nom: "Twin volkite culverin",
        stats: ["45", "6", "6", "5", "1"],
        regles: "Heavy (FP), Deflagrate (6)",
        traits: "Volkite",
      },
      {
        nom: "Volkite falconet",
        stats: ["45", "10", "7", "5", "1"],
        regles: "Deflagrate (7), Pinning (2)",
        traits: "Volkite",
      },
      {
        nom: "Volkite saker",
        stats: ["25", "6", "6", "5", "1"],
        regles: "Deflagrate (6)",
        traits: "Volkite",
      },
      {
        nom: "Volkite macro-saker",
        stats: ["45", "8", "6", "5", "2"],
        regles: "Deflagrate (6)",
        traits: "Volkite",
      },
      {
        nom: "Volkite carronade",
        stats: ["45", "12", "8", "3", "2"],
        regles: "Deflagrate (8)",
        traits: "Volkite",
      },
      {
        nom: "Volkite cardanelle",
        stats: ["45", "12", "7", "5", "2"],
        regles: "Deflagrate (7), Suppressive (1)",
        traits: "Volkite",
      },
      /* --- Arsenal des Maisonnées de Chevaliers et des Legios
         Titaniques. --- */
      {
        nom: "Volkite veuglaire",
        stats: ["30", "5", "7", "5", "1"],
        regles: "Heavy (FP), Deflagrate (6)",
        traits: "Volkite",
      },
      {
        nom: "Volkite chieorovile",
        stats: ["45", "5", "7", "4", "2"],
        regles: "Heavy (FP), Deflagrate (7)",
        traits: "Volkite",
      },
      /* --- Arsenal des Solar Auxilia (Liber Auxilia) : les Unités
         Solar Auxilia doivent utiliser cette version de l'arme. --- */
      {
        nom: "Volkite charger (Solar Auxilia)",
        stats: ["15", "2", "5", "5", "1"],
        regles: "Deflagrate (5)",
        traits: "Assault, Volkite",
      },
      {
        nom: "Volkite caliver (Solar Auxilia)",
        stats: ["30", "2", "5", "5", "1"],
        regles: "Deflagrate (6)",
        traits: "Volkite",
      },
      {
        nom: "Volkite macro-saker (Solar Auxilia)",
        stats: ["45", "8", "6", "5", "2"],
        regles: "Deflagrate (6)",
        traits: "Volkite",
      },
    ],
  },
  /* --- Armes Exotiques et Diverses (Tir) — 79 entrées --- */
  {
    titre: "Exotic and Miscellaneous Weapons (Ranged)",
    armes: [
      {
        nom: "Grenade harness",
        stats: ["6", "1", "5", "6", "1"],
        regles: "Blast (3\"), Limited (1)",
        traits: "-",
      },
      {
        nom: "Frag Grenades",
        stats: ["6", "1", "3", "6", "1"],
        regles: "Blast (3\")",
        traits: "Assault",
      },
      {
        nom: "Grenade launcher — Frag",
        stats: ["24", "1", "3", "6", "1"],
        regles: "Blast (3\")",
        traits: "-",
      },
      {
        nom: "Grenade launcher — Krak",
        stats: ["24", "1", "6", "4", "2"],
        regles: "-",
        traits: "-",
      },
      {
        // Option de la Companion Section (Legacies, Solar Auxilia) :
        // répartition des Règles Spéciales Frag/Krak inversée par
        // rapport au Lance-grenades ci-dessus, voir js/unites-data.js.
        nom: "Grenade launcher (Solar Auxilia) — Frag",
        stats: ["24", "1", "3", "6", "1"],
        regles: "Blast (3\")",
        traits: "-",
      },
      {
        nom: "Grenade launcher (Solar Auxilia) — Krak",
        stats: ["24", "1", "6", "4", "2"],
        regles: "-",
        traits: "-",
      },
      {
        // Arme des Larmes de l'Ange (Blood Angels).
        nom: "Erelim grenade launcher",
        stats: ["18", "2", "4", "4", "1"],
        regles: "Poisoned (2+), Phage (T)",
        traits: "Missile, Rad",
      },
      {
        // Arme de la Cohorte Éoclaste (Blood Angels), profil Frag — voir
        // aussi Krak ci-dessous.
        nom: "Grenade discharger — Frag",
        stats: ["12", "1", "4", "6", "1"],
        regles: "Blast (3\")",
        traits: "Assault",
      },
      {
        nom: "Grenade discharger — Krak",
        stats: ["12", "1", "6", "4", "1"],
        regles: "-",
        traits: "Assault",
      },
      {
        nom: "Lascutter¹",
        stats: ["8", "1", "10", "2", "2"],
        regles: "Ordnance (D), Armourbane",
        traits: "-",
      },
      {
        // Arme de personnage (Kaedes Nex, Raven Guard) : profil de Tir,
        // voir aussi son profil de Mêlée dans Armes de Mêlée ci-dessous.
        nom: "Fulcrum fist cannons (Ranged)",
        stats: ["12", "5", "6", "4", "1"],
        regles: "Heavy (FP), Breaching (6+), Stun (0)",
        traits: "Assault, Auto",
      },
      {
        // Arme de personnage (Corvus Corax, Primarque de la Raven Guard).
        nom: "Wrath and Justice",
        stats: ["14", "6", "5", "4", "1"],
        regles: "Breaching (6+)",
        traits: "Assault",
      },
      {
        // Arme Psychique (Devin de l'Orage, Discipline Appel de l'Orage,
        // White Scars).
        nom: "Unseen Lightning",
        stats: ["36", "1", "4", "4", "1"],
        regles: "Blast (5\"), Barrage (2), Stun (2), Force (RS)",
        traits: "Psychic",
      },
      {
        // Arme Psychique (Discipline du Diabolisme, Word Bearers).
        nom: "Hellfire",
        stats: ["12", "D3", "7", "4", "1"],
        regles: "Breaching (6+), Deflagrate, Force (D)",
        traits: "Psychic",
      },
      {
        // Arme Psychique (Discipline Anathemata : Ésotériste, Lorgar,
        // Erebus, option Tradition Ardente des Word Bearers).
        nom: "Void Darts",
        stats: ["18", "D6", "5", "4", "1"],
        regles: "Rending (5+), Force (D)",
        traits: "Psychic",
      },
      /* --- Disciplines Psychiques du livre de règles (p. 341-346) :
         Armes Psychiques de Tir (voir DISCIPLINES_PSYCHIQUES,
         js/unites.js). --- */
      {
        // Arme Psychique (Discipline Pyromancie).
        nom: "Firestorm",
        stats: ["18", "1", "4", "4", "1"],
        regles: "Panic (1), Blast (5\"), Force (RS)",
        traits: "Psychic",
      },
      {
        // Arme Psychique (Discipline Télékinésie).
        nom: "Immovable Force",
        stats: ["18", "3", "6", "4", "1"],
        regles: "Pinning (2), Force (FP)",
        traits: "Psychic",
      },
      {
        // Arme Psychique (Discipline Télépathie). « Sonner (-) » tel
        // qu'imprimé dans le livre.
        nom: "Cursed Whispers",
        stats: ["18", "2D6", "3", "-", "1"],
        regles: "Stun (-)",
        traits: "Psychic",
      },
      {
        // Arme Psychique (Discipline Runomancie, Space Wolves — livre
        // d'armée p. 173).
        nom: "Wrath of the Deathwolf",
        stats: ["Template", "1", "6", "4", "1"],
        regles: "Template, Stun (1), Force (D)",
        traits: "Psychic, Assault",
      },
      {
        // Arme Psychique (Discipline Navis Astrologis, Expeditionary
        // Navigator, Legacies Solar Auxilia) : voir js/unites-data.js.
        nom: "Lidless Stare",
        stats: ["Template", "1", "2", "3", "1"],
        regles: "Template, Force (D), Panic (1)",
        traits: "Psychic",
      },
      {
        // Legacy Wargear Word Bearers : ajouté à la liste des Pistolets
        // de Légion pour toute Figurine du Trait Word Bearers.
        nom: "Warpfire pistol",
        stats: ["12", "1", "5", "4", "1"],
        regles: "Pistol, Breaching (5+), Rending (6+)",
        traits: "Assault, Plasma",
      },
      {
        // Legacy Wargear Word Bearers : ajouté à la liste des Armes
        // Spéciales de Légion pour toute Figurine du Trait Word Bearers.
        nom: "Warpfire blaster",
        stats: ["24", "2", "5", "4", "1"],
        regles: "Breaching (5+), Rending (6+)",
        traits: "Plasma",
      },
      {
        // Legacy Wargear Word Bearers : ajouté à la liste des Armes
        // Lourdes de Légion pour toute Figurine du Trait Word Bearers.
        // Non encore câblé sur une Unité générique de Légion (voir
        // CLAUDE.md, section Word Bearers).
        nom: "Warpfire projector",
        stats: ["36", "1", "5", "4", "1"],
        regles: "Heavy (RS), Blast (3\"), Breaching (5+), Rending (6+)",
        traits: "Plasma",
      },
      {
        // Arme de personnage (Jaghatai Khan, Primarque des White Scars).
        nom: "Voice of the Storm",
        stats: ["12", "2", "6", "4", "2"],
        regles: "Breaching (5+), Deflagrate (6), Stun (1)",
        traits: "Assault",
      },
      {
        // Arme de personnage (Angron, Primarque des World Eaters).
        nom: "The Furnace of Spite",
        stats: ["12", "2", "7", "2", "2"],
        regles: "-",
        traits: "Plasma, Assault",
      },
      {
        // Arme de personnage (Lotara Sarrin, World Eaters).
        nom: "Service pistol",
        stats: ["12", "1", "3", "-", "1"],
        regles: "Pistol",
        traits: "Assault",
      },
      {
        // Arme de personnage (Vulkan, Primarque des Salamanders).
        nom: "The Heart of the Furnace",
        stats: ["18", "1", "7", "2", "3"],
        regles: "Panic (1)",
        traits: "Volkite",
      },
      {
        // Arme de personnage (Vulkan, Primarque des Salamanders).
        nom: "Dragon's Breath gauntlet",
        stats: ["Template", "1", "6", "4", "1"],
        regles: "Template, Panic (2)",
        traits: "Flame",
      },
      {
        // Arme de l'Escouade Pyroclaste (Salamanders) : profil Dispersé,
        // voir aussi Focalisé ci-dessous.
        nom: "Pyroclast flame projector — Dispersed",
        stats: ["Template", "1", "6", "4", "1"],
        regles: "Template, Panic (1)",
        traits: "Flame, Melta",
      },
      {
        // Arme de l'Escouade Pyroclaste (Salamanders) : profil Focalisé,
        // voir aussi Dispersé ci-dessus.
        nom: "Pyroclast flame projector — Focused",
        stats: ["12", "1", "8", "2", "2"],
        regles: "Melta (6)",
        traits: "Flame, Melta",
      },
      {
        // Arme de l'Escouade Sanctifier (Salamanders, Legacy) : profil
        // Munitions Standard, voir aussi Munitions Obsidite ci-dessous.
        // « Neutralisation (X) » : texte complet non donné dans l'extrait
        // Legacy fourni, à compléter depuis le livre au besoin.
        nom: "Obsidite rotor cannon — Standard rounds",
        stats: ["24", "3", "3", "-", "1"],
        regles: "Heavy (FP), Suppressive (1)",
        traits: "Auto",
      },
      {
        // Arme de l'Escouade Sanctifier (Salamanders, Legacy) : profil
        // Munitions Obsidite, voir aussi Munitions Standard ci-dessus.
        nom: "Obsidite rotor cannon — Obsidite rounds",
        stats: ["18", "2", "3", "5", "1"],
        regles: "Heavy (FP), Overload (1), Breaching (6+), Critical Hit (6+)",
        traits: "Auto",
      },
      {
        // Arme de personnage (Seigneur Commandant Eidolon, Emperor's
        // Children).
        nom: "Deathcry",
        stats: ["Template", "1", "3", "5", "1"],
        regles: "Template, Breaching (6+), Pinning (0)",
        traits: "Sonic, Assault",
      },
      {
        // Arsenal des Emperor's Children (IIIe Légion) : équipement
        // optionnel (Escouade Terminator Phénix, Capitaine Lucius).
        nom: "Sonic lance",
        stats: ["Template", "1", "2", "5", "1"],
        regles: "Template, Breaching (6+)",
        traits: "Sonic, Assault",
      },
      {
        // Arme de personnage (Ferrus Manus, Primarque des Iron Hands) :
        // profil Alpha-12, voir aussi Epsilon-415 et Phi-71 ci-dessous.
        nom: "The Medusan Carapace — Alpha-12",
        stats: ["18", "2", "7", "4", "1"],
        regles: "Breaching (4+)",
        traits: "Plasma",
      },
      {
        // Arme de personnage (Ferrus Manus, Primarque des Iron Hands) :
        // profil Epsilon-415, voir aussi Alpha-12 et Phi-71.
        nom: "The Medusan Carapace — Epsilon-415",
        stats: ["18", "2", "6", "3", "1"],
        regles: "Shock (Pinned), Pinning (1)",
        traits: "Graviton",
      },
      {
        // Arme de personnage (Ferrus Manus, Primarque des Iron Hands) :
        // profil Phi-71, voir aussi Alpha-12 et Epsilon-415.
        nom: "The Medusan Carapace — Phi-71",
        stats: ["Template", "1", "6", "4", "1"],
        regles: "Template, Panic (2)",
        traits: "Flame",
      },
      /* --- Arsenal de la Death Guard (XIVe Légion) : Mortarion,
         Calas Typhon, Escouade Terminator du Linceul, Garde-tombe
         (voir js/unites-data.js, unités réservées à cette Légion).
         --- */
      {
        // Arme de personnage (Mortarion, Primarque de la Death Guard).
        nom: "The Lantern",
        stats: ["10", "1", "8", "2", "3"],
        regles: "Armourbane",
        traits: "Assault",
      },
      {
        // Arme de personnage (Calas Typhon, Death Guard).
        nom: "Glutton",
        stats: ["Template", "1", "3", "-", "1"],
        regles: "Template, Pistol, Poisoned (2+), Panic (1)",
        traits: "Assault",
      },
      {
        // Arme de l'Escouade Terminator du Linceul (Death Guard). Aussi
        // « Alchem caster » de l'armurerie Legacy générale de la Death
        // Guard (Liber Hereticus p.208, +5 Points, listes d'Officier et
        // de Pistolets de Légion) : même profil, réutilisé tel quel.
        nom: "Alchem caster",
        stats: ["Template", "1", "3", "-", "1"],
        regles: "Template, Pistol, Poisoned (2+)",
        traits: "Assault",
      },
      {
        // Death Guard Legacy Wargear (death_guards_wargear.pdf) :
        // ajouté à la liste des Armes Spéciales de Légion pour toute
        // Figurine ayant le Trait Death Guard (+5 Points). Arme de
        // l'Escouade des Empoisonneurs Mortus (voir js/unites-data.js).
        nom: "Alchem flamer",
        stats: ["Template", "4", "5", "1", "1"],
        regles: "Template, Poisoned (2+)",
        traits: "Assault",
      },
      {
        // Death Guard Legacy Wargear : profil Bolter, voir aussi Lance-
        // flammes alchim (Secondaire) ci-dessous. Ajouté à la liste des
        // Armes Combinées de Légion pour toute Figurine Death Guard
        // (+10 Points).
        nom: "Alchem combi-flamer — Bolter (Primary)",
        stats: ["24", "2", "4", "5", "1"],
        regles: "Combi",
        traits: "Bolt",
      },
      {
        // Profil Lance-flammes alchim (Secondaire), voir aussi Bolter
        // (Principal) ci-dessus.
        nom: "Alchem combi-flamer — Alchem flamer (Secondary)",
        stats: ["Template", "4", "5", "1", "1"],
        regles: "Template, Poisoned (2+), Limited (1), Combi",
        traits: "Assault",
      },
      {
        // Arme de l'Unité Garde-tombe (Death Guard) : profil Krak, voir
        // aussi Toxine ci-dessous.
        nom: "Assault grenade launcher — Krak",
        stats: ["18", "2", "6", "4", "2"],
        regles: "-",
        traits: "Assault",
      },
      {
        // Arme de l'Unité Garde-tombe (Death Guard) : profil Toxine,
        // voir aussi Krak ci-dessus.
        nom: "Assault grenade launcher — Toxin",
        stats: ["18", "3", "6", "5", "1"],
        regles: "Poisoned (3+)",
        traits: "Assault",
      },
      {
        // Arme d'un Garde-tombe de l'Unité Garde-tombe (Death Guard),
        // par tranche de cinq Figurines (option, à la place du
        // lance-grenades d'assaut).
        nom: "Heavy alchem flamer",
        stats: ["Template", "5", "4", "1", "1"],
        regles: "Template, Poisoned (2+)",
        traits: "Assault",
      },
      /* --- Arsenal des Thousand Sons (XVe Légion) : Magnus le Rouge,
         Magistus Amon, Castellax-Achea (voir js/unites-data.js, unités
         réservées à cette Légion). --- */
      {
        // Arme de personnage (Magnus le Rouge, Primarque des Thousand
        // Sons).
        nom: "Psyfire serpenta",
        stats: ["15", "3", "6", "2", "1"],
        regles: "-",
        traits: "Psychic, Assault",
      },
      {
        // Arme de personnage (Magistus Amon, Thousand Sons) : profil de
        // Tir, voir aussi son profil de Mêlée dans Armes Énergétiques
        // ci-dessous.
        nom: "The Reliquary of Ash",
        stats: ["12", "2D6", "1", "6", "1"],
        regles: "Poisoned (5+), Breaching (5+), Stun (3), Limited (1)",
        traits: "Psychic, Assault",
      },
      {
        // Arme du Castellax-Achea (Thousand Sons).
        nom: "Asphyx bolt cannon",
        stats: ["24", "4", "5", "4", "1"],
        regles: "Wounding (4+)",
        traits: "Psychic, Assault",
      },
      {
        // Arme du Castellax-Achea (Thousand Sons), option à la place du
        // canon à bolts Asphyx.
        nom: "Æther-fire cannon",
        stats: ["24", "1", "6", "4", "2"],
        regles: "Blast (3\"), Breaching (6+)",
        traits: "Psychic, Assault",
      },
      /* --- Thousand Sons Legacy Wargear (legacie_wargear.pdf, p. 14) :
         Pistolet/Bolter Asphyx ajoutés en échange du pistolet
         bolter/bolter pour toute Figurine ayant le Trait Thousand Sons
         (+2/+3 Points par Figurine) — câblés pour l'instant seulement
         sur les Unités Thousand Sons nommées qui ont l'équipement de
         base correspondant (voir js/unites-data.js, Cabale de
         Numérologistes, Cabale d'Intercession Occulte Ammitara, Cabale
         du Khenetai Occulte), pas encore étendu à tout le rang-et-
         fichier générique de Légion (même gap que le Pistolet/Bolter à
         shrapnels Iron Warriors, voir plus haut). Pistolet à étherfeu
         (Officier/Pistolets de Légion, +10), Blaster à étherfeu
         (Armes Spéciales de Légion, +15) et Canon Magna à étherfeu
         (Armes Lourdes de Légion, +20) désormais ajoutés génériquement
         (LISTES_EQUIPEMENT.*, requiertLegion "XV", voir js/unites-
         data.js) en plus de leur usage déjà existant sur ces mêmes
         Unités nommées. --- */
      {
        nom: "Asphyx pistol",
        stats: ["8", "1", "4", "5", "1"],
        regles: "Pistol, Wounding (6+)",
        traits: "Assault, Bolt",
      },
      {
        nom: "Asphyx bolter",
        stats: ["18", "2", "4", "5", "1"],
        regles: "Wounding (6+)",
        traits: "Bolt",
      },
      {
        nom: "Æther-fire pistol",
        stats: ["10", "1", "6", "4", "2"],
        regles: "Pistol, Breaching (6+)",
        traits: "Assault, Psychic",
      },
      {
        nom: "Æther-fire blaster",
        stats: ["18", "2", "6", "4", "2"],
        regles: "Breaching (6+)",
        traits: "Psychic",
      },
      {
        // Ajouté à la liste des Armes Lourdes de Légion (Legacy Wargear,
        // +20 Points). Distinct du Canon à étherfeu ci-dessus.
        nom: "Æther-fire magna-cannon",
        stats: ["24", "1", "6", "4", "2"],
        regles: "Blast (5\"), Breaching (6+)",
        traits: "Psychic",
      },
      {
        // Arme Psychique (Arcane de Prospero Pavoni, Thousand Sons).
        nom: "Blood Boil",
        stats: ["12", "1", "4", "2", "2"],
        regles: "Poisoned (2+)",
        traits: "Psychic",
      },
      {
        // Arme Psychique (Arcane de Prospero Athanéen, Thousand Sons).
        nom: "Manifestation of Dread",
        stats: ["24", "3", "4", "-", "1"],
        regles: "Panic (1)",
        traits: "Psychic",
      },
      {
        // Arme Psychique (Arcane de Prospero Raptora, Thousand Sons).
        nom: "Crushing Force",
        stats: ["12", "1", "9", "4", "2"],
        regles: "Force (D), Armourbane",
        traits: "Psychic",
      },
      /* --- Arsenal de l'Alpha Legion (XXe Légion) : Alpharius, Exodus,
         Saboteur (voir js/unites-data.js, unités réservées à cette
         Légion). --- */
      {
        // Arme de personnage (Alpharius, Primarque de l'Alpha Legion).
        nom: "The Hydra's Spite",
        stats: ["18", "2", "7", "3", "1"],
        regles: "Breaching (4+)",
        traits: "Plasma, Assault",
      },
      {
        // Arme de personnage (Exodus, Alpha Legion) : profil Mode
        // rapide, voir aussi Mode Exécution ci-dessous.
        nom: "The Instrument — Rapid mode",
        stats: ["24", "3", "6", "3", "1"],
        regles: "-",
        traits: "Assault",
      },
      {
        // Arme de personnage (Exodus, Alpha Legion) : profil Mode
        // Exécution, voir aussi Mode rapide ci-dessus.
        nom: "The Instrument — Execution Mode",
        stats: ["72", "1", "8", "2", "1"],
        regles: "Heavy (D), Pinning (1)",
        traits: "-",
      },
      {
        // Arme de l'Unité Saboteur (Alpha Legion).
        nom: "Banestrike shotgun",
        stats: ["12", "2", "4", "4", "1"],
        regles: "Breaching (6+), Rending (6+), Stun (0)",
        traits: "Assault",
      },
      {
        // Arsenal de l'Alpha Legion (XXe Légion) : équipement optionnel
        // réservé aux Sous-types État-major ou Champion ayant le Trait
        // Alpha Legion (+5 Points par Figurine).
        nom: "Venom spheres",
        stats: ["8", "1", "1", "-", "1"],
        regles: "Blast (3\"), Poisoned (4+)",
        traits: "Assault",
      },
      /* --- Arsenal des Iron Warriors (IVe Légion) : Perturabo,
         Manipule du Cercle de Fer, Escouade Terminator Tyrans de Siège
         (voir js/unites-data.js, unités réservées à cette Légion). --- */
      {
        // Arme de personnage (Perturabo, Primarque des Iron Warriors) :
        // profil de Tir, voir aussi son profil de Mêlée dans Armes de
        // Parangon ci-dessous.
        nom: "The Arsenal of the Logos",
        stats: ["30", "6", "6", "3", "1"],
        regles: "Rending (4+), Suppressive (1)",
        traits: "Bolt, Assault",
      },
      {
        // Arme du Domitar-Ferrum (Manipule du Cercle de Fer, Iron
        // Warriors).
        nom: "Twin shrapnel cannon",
        stats: ["36", "6", "5", "5", "1"],
        regles: "Pinning (1), Rending (5+)",
        traits: "Bolt",
      },
      {
        // Arme de l'Unité Tyran de Siège (Iron Warriors) : profil
        // Saturateur, voir aussi Briseur ci-dessous.
        nom: "Tyrant rocket launcher — Saturator",
        stats: ["48", "3", "5", "6", "1"],
        regles: "Heavy (FP), Breaching (6+)",
        traits: "Missile",
      },
      {
        // Arme de l'Unité Tyran de Siège (Iron Warriors) : profil
        // Briseur, voir aussi Saturateur ci-dessus.
        nom: "Tyrant rocket launcher — Breaker",
        stats: ["48", "1", "9", "3", "1"],
        regles: "Heavy (D), Armourbane",
        traits: "Missile",
      },
      /* --- Iron Warriors Legacy Wargear (legacie_wargear.pdf, p. 3) :
         armement additionnel disponible à toute Figurine ayant le
         Trait Iron Warriors. Canon à shrapnels désormais ajouté aux
         listes génériques Armes Lourdes/sur Pivot de Légion
         (LISTES_EQUIPEMENT.lourdes/.pivot, requiertLegion "IV", voir
         js/unites-data.js) : disponible sur toute Unité générique de
         Légion qui consomme déjà ces listes, dès lors que la Légion
         choisie est Iron Warriors. Pistolet/Bolter à shrapnels (échange
         du pistolet bolter/bolter, « toute Figurine d'une Unité
         entièrement composée de Modèles Iron Warriors ») restent
         câblés seulement sur les Unités Iron Warriors nommées qui ont
         l'équipement de base correspondant (Forgeguerre en Armure
         Artificer, Nârik Dreygur, Iron Havocs, Le Tourmenteur) : les
         étendre à TOUTES les Unités génériques de Légion (rang-et-
         fichier compris, sur le modèle de la Hache de Fenris/Sons of
         Horus) demanderait un chantier à part (des dizaines de sites
         Bolter/Pistolet bolter à travers ce fichier), non fait ici.
         Two Sponson Mounted shrapnel cannon (+10 Points, Legion Sponson
         Weapons list) reste un gap documenté : ce fichier n'a pas de
         mécanisme de « liste de Sponson de Légion » partagé entre
         Véhicules (contrairement à optionPivotLegion pour le Pivot),
         chaque Véhicule à Sponsons ayant ses propres options bespoke ;
         même gap déjà documenté pour Imperial Fists/Blood Angels
         (Canon d'assaut Iliastus), voir js/unites-data.js. --- */
      {
        nom: "Shrapnel pistol",
        stats: ["10", "1", "4", "-", "1"],
        regles: "Pinning (0)",
        traits: "Assault, Bolt",
      },
      {
        nom: "Shrapnel bolter",
        stats: ["18", "2", "4", "-", "1"],
        regles: "Pinning (0)",
        traits: "Bolt",
      },
      {
        // Arme de l'Unité Iron Havocs (Iron Warriors) : profil donné
        // tel quel sur sa fiche (encart WARGEAR) — identique au Canon
        // à shrapnels jumelé du Domitar-Ferrum ci-dessus, hormis
        // Fixation (0) au lieu de (1) (arme non jumelée).
        nom: "Shrapnel cannon",
        stats: ["36", "3", "5", "5", "1"],
        regles: "Pinning (0), Rending (6+)",
        traits: "Bolt",
      },
      {
        // Arme du Tormentor (Iron Warriors) : Shadowsword converti,
        // profil donné tel quel sur sa fiche — distinct des Canons
        // Volcano titaniques de l'Arsenal des Titans (pas de Trait
        // Stratégique, pas de règle Énergivore).
        nom: "Volcano cannon (Shadowsword)",
        stats: ["120", "1", "13", "2", "12"],
        regles: "Blast (3\"), Macro-auspex",
        traits: "Las",
      },
      /* --- Arsenal des Night Lords (VIIIe Légion) : Konrad Curze,
         Escouade Terminator Contekar (voir js/unites-data.js, unités
         réservées à cette Légion). --- */
      {
        // Arme de personnage (Konrad Curze, Primarque des Night
        // Lords).
        nom: "The Mourners",
        stats: ["12", "3", "4", "5", "1"],
        regles: "Breaching (4+)",
        traits: "Assault",
      },
      {
        // Arme de l'Unité Terminator Contekar (Night Lords).
        nom: "Volkite cavitor",
        stats: ["10", "4", "6", "5", "1"],
        regles: "Deflagrate (6)",
        traits: "Volkite, Assault",
      },
      /* --- Arsenal des Emperor's Children (IIIe Légion) : Fulgrim,
         Escouade Kakophoni (voir js/unites-data.js, unités réservées à
         cette Légion). --- */
      {
        // Arme de personnage (Fulgrim, Primarque des Emperor's
        // Children).
        nom: "Torch",
        stats: ["15", "2", "6", "2", "1"],
        regles: "Rending (5+), Deflagrate (6)",
        traits: "Volkite, Assault",
      },
      {
        // Arme de l'Unité Escouade Kakophoni (Emperor's Children).
        nom: "The Cacophony",
        stats: ["36", "3", "6", "5", "1"],
        regles: "Overload (1), Stun (2), Critical Hit (6+)",
        traits: "Sonic",
      },
      /* --- Arsenal des Solar Auxilia (Liber Auxilia). --- */
      {
        nom: "Hermes grenade launcher — Frag",
        stats: ["18", "1", "3", "6", "1"],
        regles: "Blast (3\"), Stun (1)",
        traits: "-",
      },
      {
        nom: "Hermes grenade launcher — Krak",
        stats: ["18", "2", "7", "4", "2"],
        regles: "-",
        traits: "-",
      },
      /* --- Arsenal des Taghmata du Mechanicum (Liber Mechanicum) :
         armes de personnages/Unités uniques (Scorpion d'Airain, Engin
         Démon Kytan, Decimator, Archimagos Draykavac). --- */
      {
        // Arme du Scorpion d'Airain.
        nom: "Despoiler cannon",
        stats: ["24", "1", "9", "3", "3"],
        regles: "Heavy (D), Armourbane",
        traits: "-",
      },
      {
        // Arme du Scorpion d'Airain.
        nom: "Twin Hellmaw cannon",
        stats: ["18", "4", "7", "4", "2"],
        regles: "-",
        traits: "Flame",
      },
      {
        // Arme optionnelle du Massacreur de Sang.
        nom: "Impaler harpoon",
        stats: ["12", "1", "6", "3", "2"],
        regles: "Armourbane",
        traits: "-",
      },
      {
        // Arme optionnelle du Decimator.
        nom: "Soulburner petard",
        stats: ["8", "1", "5", "3", "1"],
        regles: "Blast (3\"), Poisoned (3+)",
        traits: "Assault",
      },
      {
        // Arme de personnage (Archimagos Draykavac) : profil détaillé
        // dans sa Règle Spéciale « Assaut au Liquifractor ».
        nom: "Liquifractor",
        stats: ["1", "3", "2", "6", "1"],
        regles: "Phage (T & S), Poisoned (2+), Breaching (4+)",
        traits: "-",
      },
      {
        // Arme principale du Krios Venator.
        nom: "Plunging pulsar",
        stats: ["24", "1", "9", "3", "2"],
        regles: "Heavy (D), Armourbane, Skyfire",
        traits: "-",
      },
      {
        nom: "Volkite incinerator",
        stats: ["15", "1", "6", "3", "2"],
        regles: "Deflagrate (6)",
        traits: "Volkite",
      },
    ],
    note: "¹ Note that this Weapon has both a Ranged and a Melee profile (see Melee Weapons below).",
  },
  /* ============================================================
     Arsenal des Maisonnées de Chevaliers et des Legios Titaniques :
     armes montées sur les Chevaliers Questoris et les Titans.
     ============================================================ */
  /* --- Électro-armes — 5 entrées --- */
  {
    titre: "Arc Weapons",
    armes: [
      {
        nom: "Galvanic launcher",
        stats: ["24", "3", "3", "6", "1"],
        regles: "Rending (5+), Wounding (5+)",
        traits: "Arc, Assault",
      },
      {
        nom: "Arc pistol",
        stats: ["12", "2", "6", "5", "1"],
        regles: "Pistol, Suppressive (1), Shock (Suppressed)",
        traits: "Arc, Assault",
      },
      {
        // Profil de Tir : possède aussi un profil de Mêlée (voir Armes
        // de Mêlée ci-dessous).
        nom: "Shock lance (Ranged)",
        stats: ["18", "6", "7", "3", "1"],
        regles: "Stun (2)",
        traits: "Arc",
      },
      /* --- Arsenal des Taghmata du Mechanicum (Liber Mechanicum). --- */
      {
        nom: "Arc rifle",
        stats: ["18", "1", "5", "5", "1"],
        regles: "Rending (6+), Suppressive (0)",
        traits: "Assault, Arc",
      },
      {
        nom: "Arc blaster",
        stats: ["24", "6", "6", "5", "1"],
        regles: "Suppressive (1), Shock (Suppressed)",
        traits: "Arc",
      },
    ],
  },
  /* --- Armes à Foudre — 5 entrées --- */
  {
    titre: "Lightning Weapons",
    armes: [
      {
        nom: "Lightning gun",
        stats: ["18", "3", "5", "5", "1"],
        regles: "Rending (6+), Suppressive (0)",
        traits: "Assault, Arc",
      },
      {
        nom: "Lightning musket",
        stats: ["36", "1", "7", "3", "2"],
        regles:
          "Blast (3\"), Breaching (5+), Rending (5+), Suppressive (0)",
        traits: "Arc",
      },
      {
        nom: "Lightning cannon",
        stats: ["36", "1", "7", "3", "2"],
        regles:
          "Blast (5\"), Breaching (5+), Rending (5+), Suppressive (1)",
        traits: "Arc",
      },
      {
        // Arsenal des Taghmata du Mechanicum (Liber Mechanicum) : les
        // Unités Taghmata doivent utiliser cette version de l'arme.
        nom: "Lightning musket (Mechanicum)",
        stats: ["36", "1", "7", "3", "2"],
        regles:
          "Blast (3\"), Rending (5+), Breaching (5+), Suppressive (0)",
        traits: "Arc",
      },
      {
        nom: "Lightning cannon (Mechanicum)",
        stats: ["36", "1", "7", "3", "2"],
        regles:
          "Blast (5\"), Rending (5+), Breaching (5+), Suppressive (1)",
        traits: "Arc",
      },
    ],
  },
  /* --- Outils de Découpe du Mechanicum — 2 entrées --- */
  {
    titre: "Mechanicum Cutting Tools",
    armes: [
      {
        // Profil de Tir : possède aussi un profil de Mêlée (voir Armes
        // de Mêlée ci-dessous).
        nom: "Las-impulsor (Ranged)",
        stats: ["8", "1", "9", "2", "4"],
        regles: "Ordnance (D), Armourbane",
        traits: "Las",
      },
      {
        nom: "Atrapos phase cutter (Ranged)",
        stats: ["12", "1", "10", "2", "6"],
        regles: "Ordnance (D), Armourbane",
        traits: "Las",
      },
    ],
  },
  /* --- Armes Tactiques Titaniques — 3 entrées --- */
  {
    titre: "Titanic Tactical Weapons",
    armes: [
      {
        nom: "Defensor autocannon",
        stats: ["48", "3", "7", "4", "2"],
        regles: "Breaching (6+), Skyfire",
        traits: "Auto, Tactical",
      },
      {
        nom: "Defensor bolt cannon",
        stats: ["36", "6", "5", "4", "1"],
        regles: "-",
        traits: "Bolt, Tactical",
      },
      {
        nom: "Defensor lascannon",
        stats: ["48", "2", "9", "2", "2"],
        regles: "Armourbane",
        traits: "Las, Tactical",
      },
    ],
  },
  /* --- Armes Stratégiques Titaniques — 20 entrées --- */
  {
    titre: "Titanic Strategic Weapons",
    armes: [
      {
        nom: "Vulcan mega-bolter",
        stats: ["48", "12", "7", "3", "2"],
        regles: "Suppressive (3)",
        traits: "Bolt, Strategic",
      },
      {
        nom: "Titanic inferno cannon",
        stats: ["Template", "1", "7", "3", "3"],
        regles: "Template (Furnace), Panic (3)",
        traits: "Flame, Strategic",
      },
      {
        nom: "Titanic plasma blaster — Sustained fire",
        stats: ["60", "1", "8", "2", "5"],
        regles: "Blast (3\")",
        traits: "Plasma, Strategic",
      },
      {
        nom: "Titanic plasma blaster — Maximal fire",
        stats: ["60", "1", "9", "2", "7"],
        regles: "Blast (5\"), Power Drain",
        traits: "Plasma, Strategic",
      },
      {
        nom: "Titanic turbo-laser destructor",
        stats: ["96", "1", "12", "2", "6"],
        regles: "Blast (3\"), Armourbane",
        traits: "Las, Strategic",
      },
      {
        nom: "Titanic gatling blaster",
        stats: ["82", "5", "9", "2", "4"],
        regles: "Armourbane",
        traits: "Auto, Strategic",
      },
      {
        nom: "Titanic laser blaster",
        stats: ["82", "3", "10", "2", "5"],
        regles: "Armourbane",
        traits: "Las, Strategic",
      },
      {
        nom: "Titanic melta cannon",
        stats: ["60", "1", "12", "2", "8"],
        regles: "Blast (5\"), Melta (48)",
        traits: "Melta, Strategic",
      },
      {
        nom: "Titanic Volcano cannon",
        stats: ["120", "1", "13", "2", "12"],
        regles: "Blast (3\"), Power Drain, Macro-auspex",
        traits: "Las, Strategic",
      },
      {
        nom: "Apocalypse missile launcher",
        stats: ["150", "1", "9", "3", "4"],
        regles: "Blast (10\"), Shieldbane (3)",
        traits: "Missile, Strategic",
      },
      {
        nom: "Nemesis quake cannon",
        stats: ["150", "1", "12", "2", "10"],
        regles: "Blast (5\"), Power Drain, Macro-auspex",
        traits: "Las, Strategic",
      },
      {
        nom: "Nemesis Volcano cannon",
        stats: ["150", "1", "13", "2", "12"],
        regles: "Blast (3\"), Power Drain, Macro-auspex",
        traits: "Auto, Strategic",
      },
      {
        nom: "Mori quake cannon",
        stats: ["150", "1", "12", "2", "10"],
        regles: "Blast (5\"), Macro-auspex",
        traits: "Las, Strategic",
      },
      {
        nom: "Belicosa Volcano cannon",
        stats: ["150", "1", "13", "2", "12"],
        regles: "Blast (3\"), Macro-auspex",
        traits: "Auto, Strategic",
      },
      {
        nom: "Macro-gatling blaster",
        stats: ["96", "5", "10", "2", "5"],
        regles: "Armourbane, Macro-auspex",
        traits: "Auto, Strategic",
      },
      {
        nom: "Sunfury plasma annihilator — Sustained fire",
        stats: ["82", "1", "9", "2", "6"],
        regles: "Blast (5\"), Macro-auspex",
        traits: "Plasma, Strategic",
      },
      {
        nom: "Sunfury plasma annihilator — Maximal fire",
        stats: ["82", "1", "12", "2", "9"],
        regles: "Blast (7\"), Power Drain, Macro-auspex",
        traits: "Plasma, Strategic",
      },
      /* --- Arsenal des Ordinatus du Mechanicum (Legacies, Liber
         Mechanicum) : Ordinatus Ulator/Sagittar/Aktaeus, voir
         js/unites-data.js. Le Canon Volcano Belicosa ci-dessus (arme
         d'axe central de l'Ordinatus Sagittar) est déjà défini plus
         haut dans cette même liste, réutilisé tel quel. --- */
      {
        nom: "Sonic destructor — Dispersed blast",
        stats: ["72", "1", "7", "3", "1"],
        regles: "Blast (7\"), Rending (4+), Panic (4), Breaching (6+)",
        traits: "Sonic, Strategic",
      },
      {
        nom: "Sonic destructor — Focused charge",
        stats: ["72", "1", "10", "2", "8"],
        regles: "Macro-auspex, Armourbane, Panic (4)",
        traits: "Sonic, Strategic",
      },
      {
        nom: "Seismic macro-drill",
        stats: ["36", "1", "-", "-", "-"],
        regles: "Blast (5\"), Barrage, Seismic Macro-drill, Limited (1)",
        traits: "Seismic, Strategic",
      },
    ],
  },
  /* --- Armes de Frappe Titaniques — 2 entrées --- */
  {
    titre: "Titanic Strike Weapons",
    armes: [
      {
        nom: "Titanic power fist",
        stats: ["6", "1", "12", "2", "10"],
        regles: "Armourbane",
        traits: "Strike",
      },
      {
        nom: "Arioch power claw",
        stats: ["8", "1", "13", "2", "12"],
        regles: "Armourbane",
        traits: "Strike",
      },
    ],
  },
  /* --- Arsenal des Conclaves Skitarii. --- */
  {
    titre: "Skitarii Conclave Weapons",
    armes: [
      {
        nom: "Volt pistol",
        stats: ["10", "1", "5", "5", "1"],
        regles: "Pistol, Deflagrate (5)",
        traits: "Volkite, Assault",
      },
      {
        nom: "Volt caliver¹",
        stats: ["20", "2", "5", "5", "1"],
        regles: "Deflagrate (5)",
        traits: "Volkite",
      },
      {
        nom: "Rad charges",
        stats: ["8", "1", "4", "-", "1"],
        regles: "Phage (T)",
        traits: "Rad, Assault",
      },
      {
        nom: "Disruptor grenades",
        stats: ["8", "1", "4", "-", "1"],
        regles: "Shock (Stunned)",
        traits: "Disruption, Assault",
      },
      /* Mêmes stats/Règles que « Missile traqueur (Solar Auxilia) »,
         mais entrée distincte : le Trait « Missile » (au lieu de
         « Missile Guidé » sur la version bare) doit apparaître sans
         faire porter à tort l'étiquette « (Solar Auxilia) » sur une
         fiche Skitarii — même principe que « Missile traqueur
         (Mechanicum) » ci-dessus, qui a sa propre entrée pour la même
         raison. */
      {
        nom: "Hunter-killer missile (Skitarii)",
        stats: ["48", "1", "9", "3", "3"],
        regles: "Armourbane, Limited (1)",
        traits: "Missile",
      },
    ],
    note: "¹ Note that this Weapon has both a Ranged and a Melee profile (see Melee Weapons below).",
  },
  /* --- Arsenal des Forces de l'Empereur (Legio Custodes), page
     d'Arsenal dédiée fournie par le propriétaire : complète les
     Armes déjà transcrites ci-dessous (Lance adrasite/pyrithite,
     Arquebuse à bolts Adrastus, La Lance Apollonienne). --- */
  /* --- Armes Cinétiques — 1 entrée --- */
  {
    titre: "Kinetic Weapons",
    armes: [
      {
        nom: "Kinetic destructor",
        stats: ["12", "3", "7", "4", "1"],
        regles: "Breaching (5+)",
        traits: "Assault",
      },
    ],
  },
  /* --- Armes à Bolts Lastrum — 3 entrées --- */
  {
    titre: "Lastrum Bolt Weapons",
    armes: [
      {
        nom: "Lastrum storm bolter",
        stats: ["24", "4", "5", "4", "1"],
        regles: "Rending (5+)",
        traits: "Bolt",
      },
      {
        nom: "Lastrum bolt cannon",
        stats: ["36", "3", "6", "4", "2"],
        regles: "-",
        traits: "Bolt",
      },
      {
        nom: "Twin Lastrum bolt cannon",
        stats: ["36", "6", "6", "4", "2"],
        regles: "-",
        traits: "Bolt",
      },
    ],
  },
  /* --- Armes à Cascade de Neutronium — 2 entrées --- */
  {
    titre: "Neutronium Cascade Weapons",
    armes: [
      {
        nom: "Twin neutronium cascade projector",
        stats: ["Template", "1", "7", "3", "2"],
        regles: "Template, Breaching (6+), Cascading Annihilation (7), Phage (T)",
        traits: "Assault",
      },
      {
        nom: "Neutronium magna-cascade cannon",
        stats: ["Template", "1", "10", "3", "3"],
        regles:
          "Template (Furnace), Breaching (4+), Cascading Annihilation (10), Phage (T)",
        traits: "-",
      },
    ],
  },
  /* --- Armes Adrathiques — 3 entrées --- */
  {
    titre: "Adrathic Weapons",
    armes: [
      {
        nom: "Adrathic combi-destructor",
        stats: ["12", "2", "5", "2", "2"],
        regles: "Wounding (6+)",
        traits: "Disintegrator",
      },
      {
        nom: "Adrathic devastator",
        stats: ["18", "1", "6", "2", "4"],
        regles: "Wounding (5+)",
        traits: "Disintegrator",
      },
      {
        nom: "Adrathic desolator",
        stats: ["24", "2", "7", "2", "4"],
        regles: "Wounding (4+)",
        traits: "Disintegrator",
      },
    ],
  },
  /* --- Armes Laser Arachnus — 10 entrées --- */
  {
    titre: "Arachnus Las Weapons",
    armes: [
      {
        nom: "Twin Arachnus blaze cannon — Focused fire",
        stats: ["48", "2", "9", "2", "2"],
        regles: "Heavy (D), Armourbane",
        traits: "Las",
      },
      {
        nom: "Twin Arachnus blaze cannon — Burst fire",
        stats: ["36", "5", "6", "3", "1"],
        regles: "Heavy (FP)",
        traits: "Las",
      },
      {
        nom: "Twin Arachnus blaze carronade — Focused fire",
        stats: ["72", "2", "10", "2", "2"],
        regles: "Ordnance (D), Armourbane",
        traits: "Las",
      },
      {
        nom: "Twin Arachnus blaze carronade — Burst fire",
        stats: ["48", "6", "7", "3", "2"],
        regles: "Heavy (FP)",
        traits: "Las",
      },
      {
        nom: "Twin Arachnus storm carronade — Focused fire",
        stats: ["30", "2", "10", "2", "2"],
        regles: "Heavy (D), Armourbane",
        traits: "Las",
      },
      {
        nom: "Twin Arachnus storm carronade — Burst fire",
        stats: ["24", "6", "7", "3", "2"],
        regles: "Heavy (FP)",
        traits: "Las",
      },
      {
        nom: "Arachnus storm cannon — Focused fire",
        stats: ["30", "2", "9", "2", "3"],
        regles: "Heavy (FP), Armourbane",
        traits: "Las",
      },
      {
        nom: "Arachnus storm cannon — Burst fire",
        stats: ["24", "4", "6", "3", "2"],
        regles: "Heavy (FP)",
        traits: "Las",
      },
      // Journal Tactica : The Battle for the Signus Cluster (Liber
      // Addenda, Sodalité de Motojets Gyrfalcon).
      {
        nom: "Arachnus volley cannon — Focused fire",
        stats: ["36", "1", "8", "2", "2"],
        regles: "Armourbane",
        traits: "Las",
      },
      {
        nom: "Arachnus volley cannon — Burst fire",
        stats: ["24", "3", "5", "3", "1"],
        regles: "-",
        traits: "Las",
      },
    ],
  },
  /* --- Armes de Gardien — 6 entrées --- */
  {
    titre: "Guardian Weapons",
    armes: [
      {
        nom: "Guardian spear (Ranged)",
        stats: ["18", "2", "4", "4", "1"],
        regles: "Rending (5+)",
        traits: "Assault, Bolt",
      },
      {
        nom: "Sentinel blade (Ranged)",
        stats: ["8", "3", "4", "4", "1"],
        regles: "Rending (6+)",
        traits: "Assault, Bolt",
      },
      {
        nom: "Verutum spear (Ranged)",
        stats: ["8", "1", "5", "4", "1"],
        regles: "Stun (1)",
        traits: "Assault",
      },
      {
        nom: "Achillus dreadspear (Ranged)",
        stats: ["18", "1", "10", "3", "2"],
        regles: "Armourbane, Armour-breaker (4+)",
        traits: "Las",
      },
      {
        nom: "Galatus warblade (Ranged)",
        stats: ["Template", "1", "6", "4", "2"],
        regles: "Template, Panic (2)",
        traits: "Flame",
      },
      {
        nom: "Eternity Spear (Ranged)",
        stats: ["18", "2", "4", "3", "1"],
        regles: "Rending (5+)",
        traits: "Assault, Bolt",
      },
    ],
    note: "These Weapons have both a Ranged and a Melee profile (see Melee Weapons below).",
  },
  /* --- Lanceurs Spiculus — 2 entrées --- */
  {
    titre: "Spiculus Launchers",
    armes: [
      {
        nom: "Spiculus missile launcher",
        stats: ["36", "6", "5", "4", "1"],
        regles: "Breaching (6+), Suppressive (2)",
        traits: "Missile",
      },
      {
        nom: "Spiculus heavy missile pod",
        stats: ["48", "4", "6", "4", "2"],
        regles: "Breaching (5+), Suppressive (1)",
        traits: "Missile",
      },
    ],
  },
  {
    /* Le Pistolet archéotech, le Pistolet bolter, le Bolter et le
       Lance-flammes de cette page sont les mêmes profils génériques
       déjà présents plus haut (catégories Pistolet Archéotech/Armes à
       Bolts/Armes à Flammes) : non dupliqués ici. */
    titre: "Silent Sisterhood Weapons",
    armes: [
      {
        nom: "Hellion heavy cannon array",
        stats: ["24", "6", "7", "4", "1"],
        regles: "Suppressive (1)",
        traits: "Auto",
      },
      {
        nom: "Heavy vratine missiles",
        stats: ["48", "1", "4", "5", "1"],
        regles: "Blast (3\"), Panic (1), Psychic Shock, Limited (1)",
        traits: "Missile",
      },
    ],
  },
  /* --- Armes Laser Corvae — 1 entrée --- */
  {
    titre: "Corvae Las Weapons",
    armes: [
      {
        nom: "Twin Corvae las-pulser",
        stats: ["18", "1", "10", "3", "3"],
        regles: "Armourbane, Armour-breaker (4+)",
        traits: "Las",
      },
    ],
  },
  /* --- Armes à Flammes Infernus — 3 entrées --- */
  {
    titre: "Infernus Flame Weapons",
    armes: [
      {
        nom: "Infernus incinerator",
        stats: ["Template", "1", "6", "4", "1"],
        regles: "Template, Panic (1)",
        traits: "Flame",
      },
      {
        nom: "Infernus firepike",
        stats: ["Template", "1", "6", "4", "1"],
        regles: "Template, Panic (2)",
        traits: "Flame",
      },
      {
        nom: "Infernus bomb clusters",
        stats: ["18", "1", "6", "4", "2"],
        regles: "Blast (7\"), Panic (2), Limited (1)",
        traits: "Flame",
      },
    ],
  },
  /* --- Armes Accélératrices Iliastus — 3 entrées --- */
  {
    titre: "Iliastus Accelerator Weapons",
    armes: [
      {
        nom: "Twin Iliastus accelerator rifle",
        stats: ["24", "4", "7", "3", "2"],
        regles: "Breaching (6+), Swift Pursuit",
        traits: "Auto",
      },
      {
        nom: "Twin Iliastus accelerator cannon",
        stats: ["60", "6", "8", "3", "2"],
        regles: "Breaching (6+), Swift Pursuit",
        traits: "Auto",
      },
      {
        nom: "Iliastus accelerator culverin",
        stats: ["36", "4", "9", "3", "2"],
        regles: "Breaching (5+), Swift Pursuit",
        traits: "Auto",
      },
    ],
  },
  /* --- Arsenal de la Legio Custodes. --- */
  {
    titre: "Legio Custodes Weapons",
    armes: [
      {
        nom: "Adrasite spear¹",
        stats: ["12", "1", "5", "2", "2"],
        regles: "Wounding (6+)",
        traits: "Assault, Disintegrator",
      },
      {
        nom: "Pyrithite spear¹",
        stats: ["6", "1", "8", "2", "2"],
        regles: "Melta (3)",
        traits: "Assault, Melta",
      },
      {
        nom: "Adrastus bolt caliver — Bolt volley (Primary)",
        stats: ["36", "2", "6", "4", "2"],
        regles: "Heavy (FP), Combi",
        traits: "Bolt",
      },
      {
        nom: "Adrastus bolt caliver — Adrathic beam (Secondary)",
        stats: ["24", "1", "6", "2", "2"],
        regles: "Wounding (6+), Limited (I), Combi",
        traits: "Disintegrator",
      },
      {
        nom: "The Apollonian Spear (Ranged)",
        stats: ["18", "2", "5", "2", "2"],
        regles: "Suppressive (1)",
        traits: "Assault, Bolt",
      },
    ],
    note: "¹ Note that this Weapon has both a Ranged and a Melee profile (see Melee Weapons below).",
  },
  /* --- Arsenal de la Divisio Assassinorum (Clade Adamus/Callidus). --- */
  {
    titre: "Divisio Assassinorum Weapons",
    armes: [
      {
        nom: "Needle blaster — Bolt pistol (Primary)",
        stats: ["12", "1", "4", "5", "1"],
        regles: "Pistol, Combi",
        traits: "Assault, Bolt",
      },
      {
        nom: "Needle blaster — Needler (Secondary)",
        stats: ["12", "3", "6", "4", "1"],
        regles: "Precision (2+), Breaching (5+), Phage (T), Limited (1), Combi",
        traits: "Assault, Needles",
      },
      {
        nom: "Neuro-lacerator",
        stats: ["Template", "1", "3", "3", "1"],
        regles: "Template, Pinning (3)",
        traits: "Assault",
      },
      {
        nom: "Poisoned blades",
        stats: ["12", "3", "2", "5", "1"],
        regles: "Precision (3+), Poisoned (3+), Breaching (4+), Limited (1)",
        traits: "Assault",
      },
      {
        nom: "Animus speculum",
        stats: ["Template", "1", "5", "4", "1"],
        regles: "Template, Breaching (5+), Panic (1), Psychic Shock",
        traits: "Assault",
      },
      {
        nom: "Executioner pistol — Bolt pistol (Primary)",
        stats: ["12", "1", "4", "5", "1"],
        regles: "Pistol, Combi",
        traits: "Assault, Bolt",
      },
      {
        nom: "Executioner pistol — Needle pistol (Secondary)",
        stats: ["12", "2", "2", "-", "1"],
        regles: "Poisoned (3+), Pistol, Pinning (1), Combi",
        traits: "Assault, Needles",
      },
      {
        nom: "Toxin ejector",
        stats: ["Template", "1", "5", "4", "1"],
        regles: "Template, Breaching (5+), Poisoned (3+), Armourbane",
        traits: "Assault",
      },
      {
        nom: "Poison orbs",
        stats: ["8", "1", "1", "3", "2"],
        regles: "Blast (3\"), Poisoned (3+), Panic (1), Limited (1)",
        traits: "Assault",
      },
      {
        nom: "Exitus rifle",
        stats: ["100", "1", "7", "-", "2"],
        regles: "Ordnance (AP), Precision (2+), Pinning (1)",
        traits: "Assault",
      },
      {
        nom: "Exitus pistol",
        stats: ["12", "3", "6", "3", "1"],
        regles: "Pistol, Precision (4+)",
        traits: "-",
      },
    ],
  },
  /* --- Arsenal des Démons de la Tempête de la Ruine (« Legacies of the
     Age of Darkness : Daemons of the Ruinstorm »). --- */
  /* --- Armes des Démons de la Tempête de la Ruine — 4 entrées --- */
  {
    titre: "Ruinstorm Daemon Weapons",
    armes: [
      {
        nom: "Immaterial projectiles",
        stats: ["18", "1", "4", "5", "1"],
        regles: "-",
        traits: "Assault, Immaterial",
      },
      {
        nom: "Vile deluge",
        stats: ["Template", "1", "4", "5", "1"],
        regles: "Template, Heavy (FP)",
        traits: "Assault, Immaterial",
      },
      {
        // Ironlash, moitié Tir de l'Armement de Ka'bandha (voir Hache-
        // Fléau, Armes de Mêlée ci-dessous, pour la moitié Mêlée).
        nom: "Ironlash",
        stats: ["6", "5", "8", "3", "2"],
        regles: "-",
        traits: "Assault, Immaterial",
      },
      {
        // Noxious vomit (Cor'bax Utterblight).
        nom: "Noxious vomit",
        stats: ["Template", "1", "5", "4", "2"],
        regles: "Template, Poisoned (5+), Panic (1)",
        traits: "Assault, Immaterial",
      },
    ],
  },
  /* --- Armes de tir des Démons de Tzeentch (Journal Tactica :
     Prospero Burns, traduction maison) — 3 entrées. --- */
  {
    titre: "Daemons of Tzeentch Weapons",
    armes: [
      {
        // Changefire (Incendiaires de Tzeentch).
        nom: "Changing fire",
        stats: ["Template", "1", "5", "5", "1"],
        regles: "Template, Panic (1), Heavy (FP)",
        traits: "Assault, Immaterial",
      },
      {
        // Warpfire (Horreurs de Tzeentch).
        nom: "Warpfire",
        stats: ["15", "1", "5", "5", "1"],
        regles: "Deflagrate (3), Heavy (FP)",
        traits: "Assault, Immaterial",
      },
      {
        // Baleful glare (Seigneur du Changement).
        nom: "Baleful gaze",
        stats: ["Template", "1", "8", "4", "1"],
        regles: "Template, Breaching (4+), Force (FP), Warpflame",
        traits: "Assault, Immaterial",
      },
    ],
  },
  /* --- Arme Psychique des Démons de Slaanesh (Journal Tactica : The
     Battle for the Signus Cluster, traduction maison) — 1 entrée. --- */
  {
    titre: "Daemons of Slaanesh Weapons",
    armes: [
      {
        // Malignity, Arme Psychique de la Discipline Ravissement : PF,
        // FT, PA et D copiés sur une arme de tir de l'Unité Cible.
        nom: "Malignancy",
        stats: ["12", "*", "*", "*", "*"],
        regles: "Malignancy",
        traits: "Psychic",
      },
    ],
  },
  {
    // Legacies of the Age of Darkness : Legiones Astartes Blackshields
    // (Third Edition, Version 1.1) — armes des Serments du Moment « La
    // Souillure Xenos » (Deathlock/Doomlock) et « Les Armes du
    // Désespoir » (Autofusil/Autopistolet/Fusil laser/Pistolet laser/
    // Fusil à pompe/Stubber lourd récupérés), et Arme Psychique
    // Torrent Warp de la Discipline Malfaisance (Serment « L'Héritage
    // de Nikaea »). Ces Serments du Moment ne sont pas câblés comme
    // options sélectionnables sur une Unité générique (voir CLAUDE.md,
    // gap documenté) : profils ajoutés pour référence dans l'Arsenal.
    titre: "Blackshields Weapons",
    armes: [
      {
        nom: "Deathlock",
        stats: ["18", "2", "6", "2", "1"],
        regles: "Rending (6+), Overload (2)",
        traits: "Xenos",
      },
      {
        nom: "Doomlock",
        stats: ["9", "2", "6", "2", "1"],
        regles: "Pistol, Rending (6+), Overload (2)",
        traits: "Xenos, Assault",
      },
      {
        nom: "Reclaimed autogun",
        stats: ["18", "3", "3", "-", "1"],
        regles: "Pistol",
        traits: "Auto, Assault",
      },
      {
        nom: "Reclaimed autopistol",
        stats: ["9", "3", "3", "-", "1"],
        regles: "Pistol",
        traits: "Auto, Assault",
      },
      {
        nom: "Reclaimed lasgun",
        stats: ["24", "2", "3", "6", "1"],
        regles: "Pistol",
        traits: "Las, Assault",
      },
      {
        nom: "Reclaimed laspistol",
        stats: ["12", "2", "3", "6", "1"],
        regles: "Pistol",
        traits: "Las, Assault",
      },
      {
        nom: "Reclaimed shotgun",
        stats: ["12", "2", "4", "-", "1"],
        regles: "Stun (0)",
        traits: "Auto, Assault",
      },
      {
        nom: "Reclaimed heavy stubber",
        stats: ["36", "5", "4", "-", "1"],
        regles: "Suppressive (0)",
        traits: "Auto, Assault",
      },
      {
        // Deux profils partageant une même Arme (encart du livre) : le
        // profil « Malfaisance » se choisit à la place du profil de
        // base « Torrent » (nom de la Discipline Psychique — voir
        // js/regles-data.js), même convention que Canon d'assaut
        // Iliastus — Tir soutenu/maximal ci-dessus.
        nom: "Warp Torrent — Torrent",
        stats: ["12", "4", "5", "4", "1"],
        regles: "Deflagrate (5), Overload (1), Force (FP)",
        traits: "Assault",
      },
      {
        nom: "Warp Torrent — Malignant",
        stats: ["12", "1", "5", "2", "2"],
        regles: "Deflagrate (5), Overload (2), Force (RS)",
        traits: "Assault",
      },
    ],
  },
];

/* ----------------------------------------------------------
   DONNÉES — ARMES DE MÊLÉE
   Colonnes communes : MI, MA, MF, PA, D
   ---------------------------------------------------------- */
const ENTETES_MELEE = ["IM", "AM", "SM", "AP", "D"];

const ARMES_MELEE = [
  /* --- Armes Tronçonneuses — 15 entrées --- */
  {
    titre: "Chain Weapons",
    armes: [
      {
        nom: "Chainsword",
        stats: ["I", "A", "S", "5", "1"],
        regles: "Rending (6+)",
        traits: "Chain",
      },
      {
        nom: "Heavy chainsword",
        stats: ["-1", "A", "+2", "4", "1"],
        regles: "Rending (6+)",
        traits: "Chain",
      },
      {
        nom: "Chainaxe",
        stats: ["-1", "A", "+1", "5", "1"],
        regles: "Rending (6+)",
        traits: "Chain",
      },
      {
        nom: "Heavy chainaxe",
        stats: ["-2", "A", "+3", "4", "1"],
        regles: "Rending (6+)",
        traits: "Chain",
      },
      {
        nom: "Chainfist",
        stats: ["-3", "-1", "+6", "2", "2"],
        regles: "Armourbane, Rending (6+)",
        traits: "Chain",
      },
      {
        nom: "Gravis chainfist",
        stats: ["-1", "A", "+4", "2", "3"],
        regles: "Armourbane, Rending (6+)",
        traits: "Chain",
      },
      {
        nom: "Pair of Gravis chainfists",
        stats: ["-1", "A", "+4", "2", "4"],
        regles: "Armourbane, Rending (6+)",
        traits: "Chain",
      },
      {
        nom: "Chain bayonet",
        stats: ["I", "A", "S", "5", "1"],
        regles: "Rending (6+)",
        traits: "Bayonet, Chain",
      },
      /* --- Arsenal des Night Lords (VIIIe Légion) : Sevatar, Escouade
         Terminator Contekar, Escouade Terreur, Escouade de Rapaces
         Nocturnes (voir js/unites-data.js, unités réservées à cette
         Légion). --- */
      {
        // Arme de personnage (Sevatar, Night Lords).
        nom: "Whisper of the Night",
        stats: ["+1", "A", "+2", "2", "1"],
        regles: "Critical Hit (6+), Rending (5+)",
        traits: "Chain",
      },
      {
        // Arme de l'Unité Terminator Contekar (Night Lords).
        nom: "Chainblade",
        stats: ["1", "A", "+1", "3", "1"],
        regles: "Breaching (6+), Rending (6+)",
        traits: "Chain",
      },
      {
        // Arsenal des Night Lords (VIIIe Légion) : échange contre une
        // arme énergétique pour toute Figurine de Sous-type État-major,
        // Champion ou Sergent ayant le Trait Night Lords, +5 Points par
        // Figurine. Arme de l'Escouade Terreur et de l'Escouade de
        // Rapaces Nocturnes (option).
        nom: "Chainglaive",
        stats: ["1", "A", "+1", "3", "1"],
        regles: "Breaching (6+), Rending (6+)",
        traits: "Chain",
      },
      {
        // Arsenal des Night Lords (VIIIe Légion) : échange contre une
        // arme énergétique pour toute Figurine de Sous-type État-major
        // ayant le Trait Night Lords, +10 Points par Figurine.
        nom: "Executioner axe",
        stats: ["-2", "A", "+2", "2", "2"],
        regles: "Critical Hit (6+)",
        traits: "Chain",
      },
      /* --- Arsenal des Maisonnées de Chevaliers et des Legios
         Titaniques. --- */
      {
        nom: "Reaper chain-cleaver",
        stats: ["1", "A", "+1", "2", "2"],
        regles: "Reaping Blow (2), Rending (5+)",
        traits: "Chain",
      },
      {
        nom: "Reaper chainsword",
        stats: ["-1", "A", "+2", "2", "3"],
        regles: "Reaping Blow (2), Rending (4+)",
        traits: "Chain",
      },
      {
        nom: "Reaper chainfist",
        stats: ["-3", "A", "+3", "2", "6"],
        regles: "Armourbane",
        traits: "Chain",
      },
    ],
  },
  /* --- Armes Charnabales — 3 entrées --- */
  {
    titre: "Charnabal Weapons",
    armes: [
      {
        nom: "Charnabal sabre",
        stats: ["+1", "A", "S", "-", "1"],
        regles: "Breaching (6+), Duellist's Edge (1)",
        traits: "Charnabal",
      },
      {
        nom: "Charnabal tabar",
        stats: ["1", "A", "+1", "-", "1"],
        regles: "Breaching (6+), Duellist's Edge (1)",
        traits: "Charnabal",
      },
      {
        // Arme de personnage (Saul Tarvitz, Emperor's Children).
        nom: "Charnabal greatsword",
        stats: ["1", "A", "+2", "-", "1"],
        regles: "Breaching (5+), Duellist's Edge (1)",
        traits: "Charnabal",
      },
    ],
  },
  /* --- Armes de la Section Exaltée (Solar Auxilia, Journal Tactica :
     The Battle for the Signus Cluster) — 2 entrées --- */
  {
    titre: "Exalted Section Weapons",
    armes: [
      {
        nom: "Hook-whip",
        stats: ["+2", "+2", "S", "-", "1"],
        regles: "Phage (WP)",
        traits: "Immaterial",
      },
      {
        nom: "Razor claw",
        stats: ["I", "A", "S", "3", "1"],
        regles: "Wounding (6+), Breaching (6+), Phage (WP)",
        traits: "Immaterial",
      },
    ],
  },
  /* --- Armes de Force — 6 entrées --- */
  {
    titre: "Force Weapons",
    armes: [
      {
        nom: "Force sword",
        stats: ["1", "A", "+1", "3", "1"],
        regles: "Force (D)",
        traits: "Psychic",
      },
      {
        nom: "Force axe",
        stats: ["-1", "A", "+2", "2", "1"],
        regles: "Force (D)",
        traits: "Psychic",
      },
      {
        nom: "Force maul",
        stats: ["-1", "A", "+3", "3", "1"],
        regles: "Force (D)",
        traits: "Psychic",
      },
      {
        nom: "Force staff",
        stats: ["+1", "A", "+2", "4", "1"],
        regles: "Force (D)",
        traits: "Psychic",
      },
      /* --- Arsenal des Thousand Sons (XVe Légion) : Ahzek Ahriman,
         Sorcier de Prospero (voir js/unites-data.js, unités réservées
         à cette Légion). --- */
      {
        // Arme de personnage (Ahzek Ahriman, Thousand Sons).
        nom: "The Corvidae Sceptre",
        stats: ["+1", "A", "+1", "2", "1"],
        regles: "Force (D), Critical Hit (6+)",
        traits: "Psychic",
      },
      {
        // Arme de l'Unité Sorcier de Prospero (Thousand Sons).
        nom: "Prosperine sorcerer's staff",
        stats: ["+1", "A", "S", "3", "1"],
        regles: "Force (D), Conduit",
        traits: "Psychic",
      },
    ],
  },
  /* --- Armes Énergétiques — 104 entrées --- */
  {
    titre: "Power Weapons",
    armes: [
      {
        // Corrigé (2026-08-02, signalé par le proprio) : MI valait "1"
        // (bare, sans signe) au lieu de "I" (utilise l'Initiative
        // propre au porteur, sans modificateur — comme l'Épée
        // énergétique Argean juste en dessous, même famille d'arme).
        nom: "Power sword",
        stats: ["I", "A", "S", "3", "1"],
        regles: "Breaching (6+)",
        traits: "Power",
      },
      {
        // Arme de l'Unité Escouade d'Assaut Locutarus (Ultramarines).
        nom: "Argean power sword",
        stats: ["I", "A", "S", "3", "1"],
        regles: "Breaching (5+)",
        traits: "Power",
      },
      {
        nom: "Power axe",
        stats: ["-1", "A", "+1", "3", "1"],
        regles: "Breaching (5+)",
        traits: "Power",
      },
      {
        nom: "Power maul",
        stats: ["-1", "A", "+2", "3", "1"],
        regles: "Breaching (6+)",
        traits: "Power",
      },
      {
        // Arme de la Section de Raiders Veletaris (Solar Auxilia,
        // Journal Tactica : Zone Mortalis). Le texte complet de la
        // Règle Spéciale d'Arme « Concussive » n'est pas fourni par ce
        // PDF (nom seul, non traduit — voir règle 6 de CLAUDE.md).
        nom: "Storm club",
        stats: ["-1", "A", "+2", "4", "1"],
        regles: "Concussive (0)",
        traits: "Power",
      },
      {
        nom: "Power lance",
        stats: ["+1", "A", "S", "3", "1"],
        regles: "Precision (6+)",
        traits: "Power",
      },
      {
        // Arsenal des Salamanders (XVIIIe Légion), page « Artifice de
        // Nocturne » : échange contre une épée énergétique, réservé aux
        // Figurines de Sous-type État-major, Champion, Spécialiste ou
        // Sergent ayant le Trait Salamanders.
        nom: "Forge-crafted power sword",
        stats: ["1", "+1", "S", "3", "1"],
        regles: "Breaching (6+)",
        traits: "Power",
      },
      {
        // Arsenal des Salamanders (XVIIIe Légion) : échange contre une
        // hache énergétique, mêmes Figurines éligibles que ci-dessus.
        nom: "Forge-crafted power axe",
        stats: ["-1", "+1", "+1", "3", "1"],
        regles: "Breaching (5+)",
        traits: "Power",
      },
      {
        // Arsenal des Salamanders (XVIIIe Légion) : échange contre une
        // masse énergétique, mêmes Figurines éligibles que ci-dessus.
        nom: "Forge-crafted power maul",
        stats: ["-1", "+1", "+2", "3", "1"],
        regles: "Breaching (6+)",
        traits: "Power",
      },
      {
        // Arsenal des Salamanders (XVIIIe Légion) : échange contre une
        // lance énergétique, mêmes Figurines éligibles que ci-dessus.
        nom: "Forge-crafted power lance",
        stats: ["+1", "+1", "S", "3", "1"],
        regles: "Precision (6+)",
        traits: "Power",
      },
      {
        nom: "Power fist",
        stats: ["-3", "A", "+4", "2", "2"],
        regles: "-",
        traits: "Power",
      },
      {
        // Arsenal des Salamanders (XVIIIe Légion), page « Artifice de
        // Nocturne » : échange contre un gantelet énergétique, réservé
        // aux Figurines de Sous-type État-major, Champion, Spécialiste
        // ou Sergent ayant le Trait Salamanders.
        nom: "Forge-crafted power fist",
        stats: ["-3", "A", "+4", "2", "3"],
        regles: "-",
        traits: "Power",
      },
      {
        nom: "Gravis power fist",
        stats: ["1", "A", "+3", "2", "3"],
        regles: "-",
        traits: "Power",
      },
      {
        nom: "Pair of Gravis power fists",
        stats: ["1", "+1", "+3", "2", "3"],
        regles: "-",
        traits: "Power",
      },
      {
        nom: "Thunder hammer",
        stats: ["-2", "A", "+3", "2", "2"],
        regles: "-",
        traits: "Power",
      },
      /* --- Arsenal des Solar Auxilia (Liber Auxilia). --- */
      {
        nom: "Assault axe",
        stats: ["-1", "A", "+2", "3", "1"],
        regles: "Breaching (5+), Rending (5+)",
        traits: "Power",
      },
      {
        nom: "Charonite claws",
        stats: ["1", "A", "7", "3", "2"],
        regles: "Breaching (5+)",
        traits: "Power",
      },
      /* Journal Tactica : Battle of Tallarn (Section d'Ogryns
         Charonites, échanges de pinces). */
      {
        nom: "Charonite blade",
        stats: ["1", "A", "5", "3", "1"],
        regles: "Breaching (6+), Reaping Blow (2)",
        traits: "Power",
      },
      {
        nom: "Charonite crusher",
        stats: ["-1", "-2", "10", "2", "2"],
        regles: "Armourbane, Armour-breaker (4+)",
        traits: "Power",
      },
      {
        nom: "Charonite shredder",
        stats: ["1", "A", "6", "4", "2"],
        regles: "Rending (4+), Wounding (4+)",
        traits: "Power",
      },
      {
        // Les Unités Solar Auxilia doivent utiliser cette version de
        // l'arme (profil distinct du Marteau Thunder des Legiones
        // Astartes ci-dessus).
        nom: "Thunder hammer (Solar Auxilia)",
        stats: ["-2", "A", "+3", "2", "2"],
        regles: "-",
        traits: "Power",
      },
      {
        // Arsenal des Imperial Fists : équipement réservé aux Sous-types
        // État-major, Champion ou Sergent ayant le Trait Imperial Fists.
        nom: "Solarite power gauntlet",
        stats: ["-3", "A", "+4", "2", "2"],
        regles: "Critical Hit (6+)",
        traits: "Power",
      },
      {
        // Legacies of the Age of Darkness : Legiones Astartes Blackshields
        // (p. 14) — équipement fixe d'Endryd Haar.
        nom: "Terrawatt-pattern power gauntlet",
        stats: ["2", "-1", "+4", "2", "3"],
        regles: "-",
        traits: "Power",
      },
      {
        // Arsenal de l'Alpha Legion (XXe Légion) : échange GRATUIT d'une
        // arme énergétique, réservé aux Sous-types État-major, Champion
        // ou Sergent ayant le Trait Alpha Legion.
        nom: "Power dagger",
        stats: ["+2", "A", "-1", "3", "1"],
        regles: "Breaching (5+)",
        traits: "Power",
      },
      {
        // Arme de personnage (Fafnir Rann, Imperial Fists).
        nom: "The Executioner and the Hunter",
        stats: ["1", "A", "+2", "3", "1"],
        regles: "Breaching (4+)",
        traits: "Power",
      },
      {
        // Arme de personnage (Evander Garrius, Imperial Fists).
        nom: "Subjugator",
        stats: ["-2", "A", "+4", "2", "2"],
        regles: "-",
        traits: "Power",
      },
      {
        // Arme de personnage (Camba Diaz, Imperial Fists).
        nom: "Durenda",
        stats: ["1", "A", "+1", "3", "1"],
        regles: "Breaching (5+)",
        traits: "Power",
      },
      {
        // Arme de personnage (Alexis Polux, Imperial Fists) : Profil
        // d'Arme de la Posture Coup de Marteau (voir Règles Spéciales,
        // js/regles-data.js), pas une arme équipée normalement.
        nom: "Hammerblow",
        stats: ["1", "1", "10", "2", "3"],
        regles: "Critical Hit (6+)",
        traits: "Power",
      },
      {
        nom: "Crozius Arcanum",
        stats: ["I", "A", "+2", "3", "2"],
        regles: "Breaching (6+)",
        traits: "Power",
      },
      {
        nom: "Lightning claw",
        stats: ["I", "A", "S", "3", "1"],
        regles: "Wounding (6+), Breaching (6+)",
        traits: "Power",
      },
      {
        nom: "Pair of lightning claws",
        stats: ["I", "+2", "S", "3", "1"],
        regles: "Wounding (6+), Breaching (6+)",
        traits: "Power",
      },
      {
        nom: "Saturnine war axe",
        stats: ["I", "A", "+1", "2", "2"],
        regles: "Reaping Blow (2)",
        traits: "Power",
      },
      {
        nom: "Saturnine concussion hammer",
        stats: ["-3", "A", "x2", "2", "3"],
        regles: "Critical Hit (6+)",
        traits: "Power",
      },
      {
        nom: "Saturnine disruptor fist",
        stats: ["-2", "A", "+2", "2", "3"],
        regles: "-",
        traits: "Power",
      },
      {
        // Journal Tactica : The Forges of Saturn — équipement de base de
        // la Saturnine Terminator Command Squad/Phraetus Anointed
        // Conclave, profil donné en encart dédié (seule différence avec
        // le Poing disrupteur Saturnine simple : AM +1 au lieu de
        // inchangé, sur le même principe que Griffe Lightning/Paire de
        // griffes Lightning).
        nom: "Pair of Saturnine disruptor fists",
        stats: ["-2", "+1", "+2", "2", "3"],
        regles: "-",
        traits: "Power",
      },
      {
        // Arsenal de la Raven Guard : échange gratuit contre une griffe
        // Lightning pour toute Figurine de Sous-type État-major ayant le
        // Trait Raven Guard.
        nom: "Raven Talon",
        stats: ["1", "A", "S", "3", "1"],
        regles: "Impact (IM), Wounding (6+), Breaching (6+)",
        traits: "Power",
      },
      {
        nom: "Pair of Raven Talons",
        stats: ["1", "+2", "S", "3", "1"],
        regles: "Impact (IM), Wounding (6+), Breaching (6+)",
        traits: "Power",
      },
      {
        // Arsenal des White Scars : échange contre une arme énergétique
        // pour toute Figurine de Sous-type État-major ayant le Trait
        // White Scars, +10 Points par Figurine.
        nom: "Power glaive",
        stats: ["1", "A", "+1", "3", "1"],
        regles: "Impact (AP), Breaching (5+)",
        traits: "Power",
      },
      {
        // Arme de la Keshig d'Or (White Scars).
        nom: "Kontos Power Lance",
        stats: ["+4", "1", "+5", "3", "2"],
        regles: "Impact (AP), Armourbane",
        traits: "Power",
      },
      {
        // Arme de personnage (Hibou Khan, White Scars).
        nom: "The Breath of the Storm",
        stats: ["+1", "A", "+2", "3", "1"],
        regles: "Critical Hit (6+), Breaching (4+)",
        traits: "Power",
      },
      {
        // Arme de personnage (Qin Xa, White Scars).
        nom: "The Dragon's Tails",
        stats: ["1", "A", "+1", "2", "1"],
        regles: "Critical Hit (5+), Precision (3+)",
        traits: "Power",
      },
      {
        // Arme du Dreadnought Contemptor-Incaendius (Blood Angels).
        nom: "Pair of Perdition Talons",
        stats: ["1", "+2", "S", "2", "2"],
        regles: "Aflame (2)",
        traits: "Power, Flame",
      },
      {
        // Arme de personnage (Aster Crohne, Blood Angels).
        nom: "Saiphaine Axe",
        stats: ["1", "+1", "+1", "3", "1"],
        regles: "Breaching (4+)",
        traits: "Power",
      },
      {
        // Arme de personnage (Dominion Zephon, Blood Angels).
        nom: "The Spiritum Sanguis",
        stats: ["1", "A", "+1", "2", "2"],
        regles: "Reaping Blow (1)",
        traits: "Power",
      },
      {
        // Arme de personnage (Raldoron, Blood Angels).
        nom: "The Crimson Warblade",
        stats: ["1", "A", "+1", "2", "2"],
        regles: "Impact (AM), Critical Hit (6+)",
        traits: "Power",
      },
      {
        // Arme de l'Unité Cour des Ofanim (Blood Angels, Legacy).
        nom: "Blade of judgement",
        stats: ["1", "A", "+2", "3", "1"],
        regles: "Breaching (5+), Critical Hit (6+)",
        traits: "Power",
      },
      {
        // Arsenal des Blood Angels : échange contre une épée/hache/
        // lance/masse énergétique pour toute Figurine de Sous-type
        // État-major, Champion ou Sergent ayant le Trait Blood Angels,
        // +5 Points par Figurine.
        nom: "Blade of Perdition",
        stats: ["1", "A", "S", "3", "1"],
        regles: "Breaching (6+), Aflame (1)",
        traits: "Power, Flame",
      },
      {
        nom: "Axe of Perdition",
        stats: ["-1", "A", "+1", "3", "1"],
        regles: "Breaching (5+), Aflame (1)",
        traits: "Power, Flame",
      },
      {
        nom: "Maul of Perdition",
        stats: ["-1", "A", "+2", "3", "1"],
        regles: "Breaching (6+), Aflame (1)",
        traits: "Power, Flame",
      },
      {
        nom: "Spear of Perdition",
        stats: ["+1", "A", "S", "3", "1"],
        regles: "Precision (6+), Aflame (1)",
        traits: "Power, Flame",
      },
      {
        // Arme de la Cohorte Éoclaste (Blood Angels, ex-« Dawnbreaker
        // Cohort »). « Impact (ME) » sur la fiche source retranscrit en
        // « Impact (MF) » : seule lecture cohérente avec la convention
        // déjà établie dans ce fichier (Impact référence une colonne du
        // propre profil de l'Arme — MI/MA/PA/D déjà vus ailleurs — et
        // cette Arme a une colonne MF, pas de colonne « ME »).
        nom: "Shooting Star power lance",
        stats: ["+1", "A", "S", "3", "1"],
        regles: "Impact (SM), Breaching (5+)",
        traits: "Power",
      },
      {
        // Arme de personnage (Khârn le Sanglant, World Eaters).
        nom: "The Cleaver",
        stats: ["I", "A", "+1", "2", "1"],
        regles: "Critical Hit (6+)",
        traits: "Power",
      },
      {
        // Arme de personnage (Khârn le Sanglant, World Eaters) : échange
        // possible contre La Trancheuse si Angron n'est pas dans l'Armée.
        nom: "Gorechild Reforged",
        stats: ["I", "A", "+1", "2", "1"],
        regles: "Critical Hit (6+), Rending (5+)",
        traits: "Chain",
      },
      {
        // Arme de personnage (Lotara Sarrin, World Eaters).
        nom: "The Conqueror's Bite",
        stats: ["1", "A", "S", "2", "1"],
        regles: "-",
        traits: "Power",
      },
      {
        // Arme de l'Escouade Terminator Pyrodracs (Salamanders).
        nom: "Forge-crafted thunder hammer",
        stats: ["-2", "+1", "+3", "2", "2"],
        regles: "-",
        traits: "Power",
      },
      {
        // Arme de personnage (Seigneur Commandant Eidolon, Emperor's
        // Children).
        nom: "Gloria Aeterna",
        stats: ["-2", "A", "+2", "2", "2"],
        regles: "Critical Hit (6+)",
        traits: "Power",
      },
      {
        // Arsenal des Emperor's Children (IIIe Légion) : échange contre
        // une arme énergétique pour toute Figurine de Sous-type
        // État-major, Champion ou Sergent ayant le Trait Emperor's
        // Children (Escouade Terminator Phénix, +10 Points/Figurine).
        nom: "Phoenix power spear",
        stats: ["+1", "A", "+1", "3", "1"],
        regles: "Impact (D), Breaching (6+)",
        traits: "Power",
      },
      {
        // Emperor's Children Legacy Wargear
        // (emperors_children_wargear.pdf) : ajoutée aux listes
        // d'Équipement d'Officier de Légion et d'Armes de Mêlée de
        // Sergent de Légion pour toute Figurine ayant le Trait
        // Emperor's Children (+15 Points). Aussi portée par l'Escouade
        // de Lames Palatines Aquilae — voir js/unites-data.js.
        nom: "Phoenix rapier",
        stats: ["1", "A", "S", "3", "1"],
        regles: "Impact (D), Breaching (6+)",
        traits: "Power",
      },
      {
        // Arsenal des Ultramarines (XIIIe Légion) : échange contre une
        // hache légatine pour toute Figurine de Sous-type État-major,
        // Champion ou Sergent ayant le Trait Ultramarines, +5 Points
        // par Figurine.
        nom: "Legatine axe",
        stats: ["I", "A", "+1", "3", "1"],
        regles: "Breaching (4+)",
        traits: "Power",
      },
      {
        // Arme de personnage (Remus Ventanus, Ultramarines).
        nom: "Phaeton",
        stats: ["1", "+1", "S", "3", "1"],
        regles: "Breaching (6+), Duellist's Edge (1)",
        traits: "Power",
      },
      {
        // Arsenal des Dark Angels (Ire Légion) : échange contre une
        // lame de Caliban pour toute Figurine de Sous-type État-major,
        // Champion ou Sergent ayant le Trait Dark Angels, +5 Points
        // par Figurine.
        nom: "Caliban blade",
        stats: ["1", "A", "+1", "3", "1"],
        regles: "Breaching (5+)",
        traits: "Sword of the Order",
      },
      {
        // Arsenal des Dark Angels (Ire Légion) : échange gratuit contre
        // un espadon terranique pour toute Figurine de Sous-type
        // État-major ou Champion ayant le Trait Dark Angels. Aussi
        // porté par le Cenobium de Chevaliers du Cercle Intérieur et
        // imposé par l'Avantage Principal Paladin de l'Hekatonystika.
        nom: "Terranic greatsword",
        stats: ["-1", "A", "+2", "3", "2"],
        regles: "Breaching (5+)",
        traits: "Sword of the Order",
      },
      {
        // Arme de personnage (Corswain, Dark Angels).
        nom: "The Blade",
        stats: ["1", "A", "+2", "2", "2"],
        regles: "Duellist's Edge (2)",
        traits: "Power, Sword of the Order",
      },
      {
        // Arme de l'Unité Excindio (Dark Angels).
        nom: "Excindio claws",
        stats: ["1", "A", "+1", "3", "2"],
        regles: "Breaching (5+), Reaping Blow (2)",
        traits: "Power",
      },
      {
        // Arme de l'Unité Cabale Enigmatus de la Firewing (Dark Angels) :
        // profil Non chargée, voir aussi Chargée ci-dessous.
        nom: "Calibanite charge-blade — Uncharged",
        stats: ["+2", "A", "S", "4", "1"],
        regles: "-",
        traits: "Sword of the Order",
      },
      {
        // Profil Chargée, voir aussi Non chargée ci-dessus.
        nom: "Calibanite charge-blade — Charged",
        stats: ["-1", "A", "+1", "3", "1"],
        regles: "Breaching (6+)",
        traits: "Sword of the Order",
      },
      {
        // Arsenal des Space Wolves (VIe Légion) : échange contre une
        // épée tronçonneuse pour toute Figurine ayant le Trait Space
        // Wolves, +2 Points par Figurine.
        nom: "Fenrisian axe",
        stats: ["1", "A", "+1", "-", "1"],
        regles: "Reaping Blow (1)",
        traits: "-",
      },
      {
        // Arsenal des Space Wolves (VIe Légion) : échange contre une
        // arme énergétique pour toute Figurine de Sous-type État-major
        // ou Champion ayant le Trait Space Wolves, +5 Points par
        // Figurine.
        nom: "Frost sword",
        stats: ["1", "A", "S", "3", "1"],
        regles: "Breaching (5+), Reaping Blow (1)",
        traits: "Power",
      },
      {
        // Arsenal des Space Wolves (VIe Légion) : voir Épée de givre.
        nom: "Frost axe",
        stats: ["-1", "A", "+1", "3", "1"],
        regles: "Breaching (4+), Reaping Blow (1)",
        traits: "Power",
      },
      {
        // Arsenal des Space Wolves (VIe Légion) : échange contre une
        // griffe Lightning pour toute Figurine de Sous-type État-major
        // ou Champion ayant le Trait Space Wolves, +5 Points par
        // Figurine.
        nom: "Frost claw",
        stats: ["1", "A", "S", "3", "1"],
        regles: "Breaching (4+), Reaping Blow (1), Rending (6+)",
        traits: "Power",
      },
      {
        // Arsenal des Space Wolves (VIe Légion) : échange contre une
        // arme énergétique pour toute Figurine de Sous-type État-major
        // ou Champion ayant le Trait Space Wolves, +10 Points par
        // Figurine.
        nom: "Great frost blade",
        stats: ["-2", "A", "+3", "2", "2"],
        regles: "Reaping Blow (1)",
        traits: "Power",
      },
      {
        // Arme de personnage (Geigor Main Terrible, Space Wolves).
        nom: "The Terrible Hand",
        stats: ["1", "A", "S", "3", "1"],
        regles: "Breaching (4+), Rending (5+)",
        traits: "Power",
      },
      {
        // Arme de personnage (Hvarl Lamerouge, Space Wolves).
        nom: "Hearthsplitter",
        stats: ["1", "A", "+2", "2", "2"],
        regles: "Armourbane",
        traits: "Power",
      },
      {
        // Arme de personnage (Shadrak Meduson, Iron Hands).
        nom: "Albian power gladius",
        stats: ["1", "A", "+1", "3", "1"],
        regles: "Breaching (6+)",
        traits: "Power",
      },
      {
        // Arsenal des Iron Hands (Xe Légion) : équipement des Terminators
        // Gorgone et des Révérends de Fer ayant le Trait Iron Hands.
        nom: "Artificer power axe",
        stats: ["-1", "A", "+1", "3", "1"],
        regles: "Breaching (5+), Rending (5+)",
        traits: "Power",
      },
      /* --- Arsenal des Sons of Horus (XVIe Légion) : Émissaire Noir,
         Ezekyle Abaddon, Horus Aximand, Tybalt Marr, Vheren Ashurhaddon
         (voir js/unites-data.js, unités réservées à cette Légion).
         Stats des armes de personnage À VÉRIFIER (pages peu lisibles
         sur les photos, notamment près de la reliure pour Abaddon et
         Aximand). --- */
      {
        // Arme de personnage (Émissaire Noir, Sons of Horus).
        nom: "Staff of Dark Authority",
        stats: ["1", "A", "+1", "3", "1"],
        regles: "Critical Hit (6+)",
        traits: "Power",
      },
      {
        // Arme de personnage (Ezekyle Abaddon, Sons of Horus).
        nom: "Cthonian Power Claw",
        stats: ["-2", "A", "+4", "2", "2"],
        regles: "Rending (5+)",
        traits: "Power",
      },
      {
        // Arme de personnage (Horus Aximand, « Deuil-de-Tout »,
        // Sons of Horus).
        nom: "Allmourn",
        stats: ["1", "A", "+1", "2", "2"],
        regles: "Critical Hit (6+)",
        traits: "Power",
      },
      {
        // Arme de personnage (Tybalt Marr, Sons of Horus).
        nom: "The Culling Blade",
        stats: ["I", "A", "S", "3", "1"],
        regles: "Poisoned (2+), Critical Hit (6+), Breaching (5+)",
        traits: "-",
      },
      {
        // Arme de personnage (Vheren Ashurhaddon, Sons of Horus).
        nom: "The Serpentis Axe",
        stats: ["+1", "A", "S", "2", "1"],
        regles: "Critical Hit (6+)",
        traits: "Power",
      },
      {
        // Arsenal des Sons of Horus (XVIe Légion) : échange contre une
        // arme énergétique pour toute Figurine ayant le Trait Sons of
        // Horus, +5 Points par Figurine.
        nom: "Carsoran power axe",
        stats: ["-2", "A", "+1", "3", "1"],
        regles: "Breaching (5+), Rending (6+)",
        traits: "Power",
      },
      {
        // Arsenal des Sons of Horus (XVIe Légion) : voir Hache
        // énergétique carsoraine, +10 Points par Figurine.
        nom: "Carsoran power tabar",
        stats: ["-2", "A", "+2", "3", "1"],
        regles: "Breaching (5+), Rending (5+)",
        traits: "Power",
      },
      /* --- Arsenal des Word Bearers (XVIIe Légion) : Kor Phaeron,
         Erebus, Argel Tal, Zardu Layak, Gal Vorbak, Dreadnought Mhara
         Gal (voir js/unites-data.js, unités réservées à cette
         Légion). --- */
      {
        // Arme de personnage (Kor Phaeron, Word Bearers).
        nom: "Patriarch's claws",
        stats: ["1", "A", "S", "2", "1"],
        regles: "Rending (6+)",
        traits: "Power",
      },
      {
        // Arme de personnage (Erebus, Word Bearers).
        nom: "Crux Malefica",
        stats: ["1", "A", "+3", "2", "2"],
        regles: "Phage (S)",
        traits: "Power, Psychic",
      },
      {
        // Arme de personnage (Argel Tal, Word Bearers).
        nom: "Daemonic Talons",
        stats: ["1", "A", "S", "2", "2"],
        regles: "-",
        traits: "Psychic",
      },
      {
        // Arme de personnage (Zardu Layak, Word Bearers).
        nom: "The Azurda Char'is",
        stats: ["+1", "A", "+2", "4", "2"],
        regles: "Force (D)",
        traits: "Psychic",
      },
      {
        // Arme de personnage (Anakatis Kul, compagnon de Zardu Layak,
        // Word Bearers).
        nom: "Anakatis blade",
        stats: ["1", "A", "S", "3", "2"],
        regles: "Breaching (6+), Phage (S)",
        traits: "Psychic",
      },
      {
        // Arme de l'Unité Gal Vorbak (Word Bearers).
        nom: "Tainted Talons",
        stats: ["1", "A", "S", "3", "1"],
        regles: "Breaching (6+), Rending (6+), Phage (S)",
        traits: "Psychic",
      },
      {
        // Legacy Wargear Word Bearers : ajoutée à la liste d'Équipement
        // d'Officier de Légion et à la liste des Armes de Mêlée de
        // Sergent de Légion pour toute Figurine du Trait Word Bearers.
        // Non encore câblée sur une Unité générique de Légion (voir
        // CLAUDE.md, section Word Bearers).
        nom: "Tainted weapon",
        stats: ["1", "A", "S", "3", "1"],
        regles: "Breaching (6+), Phage (S)",
        traits: "Psychic",
      },
      {
        // Arme du Dreadnought Mhara Gal (Word Bearers).
        nom: "Tainted Claw",
        stats: ["1", "A", "+3", "2", "3"],
        regles: "-",
        traits: "Psychic, Power",
      },
      {
        // Arme de l'Escouade du Cercle de Cendres (Word Bearers).
        nom: "Fang-axe",
        stats: ["1", "A", "+1", "3", "1"],
        regles: "Critical Hit (6+), Phage (M)",
        traits: "Chain",
      },
      /* --- Arsenal de la Death Guard (XIVe Légion) : Calas Typhon,
         Escouade Terminator du Linceul (voir js/unites-data.js,
         unités réservées à cette Légion). --- */
      {
        // Arme de personnage (Calas Typhon, Death Guard).
        nom: "Lakrimae",
        stats: ["-1", "A", "+2", "2", "2"],
        regles: "Reaping Blow (3), Poisoned (3+)",
        traits: "Power",
      },
      {
        // Arsenal de la Death Guard (XIVe Légion) : arme de l'Escouade
        // Terminator du Linceul, ouverte en option à toute Figurine de
        // Sous-type État-major, Champion, Spécialiste ou Sergent ayant
        // le Trait Death Guard (+10 Pts en échange d'une arme
        // énergétique, +5 Pts en échange d'un gantelet énergétique).
        nom: "Power scythe",
        stats: ["-1", "A", "+1", "3", "1"],
        regles: "Reaping Blow (2), Breaching (5+)",
        traits: "Power",
      },
      /* --- Arsenal des Thousand Sons (XVe Légion) : Castellax-Achea,
         Cabale de Terminators Sekhmet, Cabale du Khenetai Occulte,
         Magistus Amon (voir js/unites-data.js, unités réservées à
         cette Légion). --- */
      {
        // Arme du Castellax-Achea (Thousand Sons).
        nom: "Achea force claws",
        stats: ["I", "A", "+1", "3", "2"],
        regles: "Breaching (5+)",
        traits: "Psychic",
      },
      {
        // Arsenal des Thousand Sons (XVe Légion) : arme de l'Unité
        // Cabale de Terminators Sekhmet, ouverte en option à toute
        // Figurine de Sous-type État-major ou Champion ayant le Trait
        // Thousand Sons (+5 Points par Figurine).
        nom: "Achea pattern force sword",
        stats: ["I", "A", "+1", "3", "1"],
        regles: "Breaching (5+)",
        traits: "Psychic",
      },
      {
        // Arme de l'Unité Cabale du Khenetai Occulte (Thousand Sons).
        nom: "Pair of Achea force swords",
        stats: ["I", "+1", "+1", "3", "1"],
        regles: "Breaching (5+)",
        traits: "Psychic",
      },
      {
        // Arme de personnage (Magistus Amon, Thousand Sons) : profil de
        // Mêlée, voir aussi son profil de Tir dans Armes Exotiques et
        // Diverses (Tir) ci-dessus. MF transcrit « F » (lettre ambiguë
        // sur la photo, lue « S ») : à vérifier contre le livre.
        nom: "The Reliquary of Ash",
        stats: ["I", "A", "S", "2", "1"],
        regles: "Poisoned (2+)",
        traits: "Psychic",
      },
      {
        // Arme Psychique (Arcane de Prospero Pyrae, Thousand Sons).
        nom: "Burning Embrace",
        stats: ["I", "1", "8", "3", "2"],
        regles: "Breaching (5+), Critical Hit (6+), Armourbane",
        traits: "Psychic",
      },
      {
        // Arme du Dreadnought Contemptor-Osiron (Thousand Sons, livre
        // d'armée p. 236).
        nom: "Gravis force blade",
        stats: ["I", "A", "+2", "2", "2"],
        regles: "Force (D), Reaping Blow (2)",
        traits: "Psychic",
      },
      /* --- Disciplines Psychiques du livre de règles (p. 341-345) :
         Armes Psychiques de Mêlée. --- */
      {
        // Arme Psychique (Discipline Biomancie).
        nom: "Biomantic Slam",
        stats: ["-3", "1", "12", "2", "2"],
        regles: "Armourbane, Force (D)",
        traits: "Psychic",
      },
      {
        // Arme Psychique (Discipline Pyromancie).
        nom: "Conflagration",
        stats: ["-1", "6+D3", "5", "4", "1"],
        regles: "Deflagrate (5)",
        traits: "Psychic",
      },
      /* --- Arsenal de l'Alpha Legion (XXe Légion) : Armillus Dynat,
         Exodus, Chasseur de Têtes, Saboteur (voir js/unites-data.js,
         unités réservées à cette Légion). --- */
      {
        // Arme de personnage (Armillus Dynat, Alpha Legion) : profil Le
        // Prince, voir aussi Le Prophète ci-dessous.
        nom: "The Prince",
        stats: ["1", "A", "S", "3", "1"],
        regles: "Breaching (5+), Thunderclap",
        traits: "Power",
      },
      {
        // Arme de personnage (Armillus Dynat, Alpha Legion) : profil Le
        // Prophète, voir aussi Le Prince ci-dessus.
        nom: "The Prophet",
        stats: ["-2", "-1", "+3", "2", "2"],
        regles: "-",
        traits: "Power",
      },
      {
        // Arsenal de l'Alpha Legion (XXe Légion) : équipement optionnel
        // (échange gratuit) réservé aux Sous-types État-major, Champion
        // ou Sergent ayant le Trait Alpha Legion. Arme de l'Unité
        // Exodus, Chasseur de Têtes et Saboteur (voir js/unites-data.js).
        nom: "Power dagger",
        stats: ["+2", "A", "-1", "3", "1"],
        regles: "Breaching (5+)",
        traits: "Power",
      },
      /* --- Arsenal des Iron Warriors (IVe Légion) : équipement
         optionnel réservé aux Sous-types État-major ou Champion ayant
         le Trait Iron Warriors (échange gratuit contre un marteau
         Thunder). Voir js/unites-data.js, unités réservées à cette
         Légion (Forgeguerre, Manipule du Cercle de Fer). --- */
      {
        nom: "Graviton crusher",
        stats: ["-2", "A", "+4", "2", "2"],
        regles: "Armourbane, Shock (Pinned)",
        traits: "Graviton",
      },
      {
        // Iron Warriors Legacy Wargear (legacie_wargear.pdf, p. 3) :
        // ajoutée aux listes d'Équipement d'Officier de Légion et
        // d'Armes de Mêlée de Sergent de Légion (LISTES_EQUIPEMENT.
        // officier/meleeSergent, requiertLegion "IV"), +15 Points.
        nom: "Graviton mace",
        stats: ["-1", "A", "+3", "3", "1"],
        regles: "Armourbane, Shock (Pinned)",
        traits: "Graviton",
      },
      {
        // Arme de personnage (Nârik Dreygur, Le Fossoyeur, Iron
        // Warriors) : profil donné tel quel sur sa fiche.
        nom: "Graviton gauntlet",
        stats: ["-3", "A", "+3", "2", "2"],
        regles: "Shock (Pinned)",
        traits: "Graviton, Power",
      },
      {
        // Arme de l'Unité Terminator Contekar (Night Lords), option à
        // la place de la lame tronçonneuse pour le Dissident. Aussi
        // ajoutée à la liste générique d'Équipement d'Officier de
        // Légion (legacie_wargear.pdf, p. 7, requiertLegion "VIII",
        // +25 Points — voir LISTES_EQUIPEMENT.officier).
        nom: "Escaton power claw",
        stats: ["-2", "A", "+3", "2", "2"],
        regles: "Rending (6+)",
        traits: "Power",
      },
      /* --- Arsenal des Maisonnées de Chevaliers et des Legios
         Titaniques. --- */
      {
        nom: "Thunderstrike gauntlet",
        stats: ["-2", "-1", "+3", "2", "4"],
        regles: "Critical Hit (6+), Impact (S), Shock (Suppressed)",
        traits: "Power",
      },
      {
        nom: "Tempest warblade",
        stats: ["1", "A", "S", "2", "2"],
        regles: "Reaping Blow (6), Aflame (2)",
        traits: "Power",
      },
    ],
  },
  /* --- Armes de Parangon — 34 entrées --- */
  {
    titre: "Paragon Weapons",
    armes: [
      {
        nom: "Paragon blade",
        stats: ["I", "A", "+1", "2", "1"],
        regles: "Critical Hit (6+)",
        traits: "-",
      },
      {
        // Arme de personnage (Lion El'Jonson, Primarque des Dark
        // Angels).
        nom: "The Lion Sword",
        stats: ["1", "A", "+2", "2", "3"],
        regles: "-",
        traits: "Power, Sword of the Order",
      },
      {
        // Arme de personnage (Lion El'Jonson, Primarque des Dark
        // Angels) : échange possible gratuit contre l'Épée du Lion.
        nom: "The Wolf Blade",
        stats: ["1", "A", "S", "3", "1"],
        regles: "Rending (4+), Breaching (4+), Reaping Blow (2)",
        traits: "Chain, Sword of the Order",
      },
      {
        // Arme de personnage (Leman Russ, Primarque des Space Wolves).
        nom: "The Sword of Nightfall",
        stats: ["1", "A", "+1", "2", "2"],
        regles: "Critical Hit (5+)",
        traits: "-",
      },
      {
        // Arme de personnage (Leman Russ, Primarque des Space Wolves).
        nom: "The Axe of Helwinter",
        stats: ["1", "A", "+2", "2", "2"],
        regles: "Armourbane, Reaping Blow (1)",
        traits: "-",
      },
      {
        // Arme de personnage (Ferrus Manus, Primarque des Iron Hands).
        nom: "Forgebreaker",
        stats: ["-1", "A", "+3", "2", "3"],
        regles: "Critical Hit (5+)",
        traits: "Power",
      },
      {
        // Arme de personnage (Corvus Corax, Primarque de la Raven Guard).
        nom: "Talionis",
        stats: ["+4", "3", "S", "3", "2"],
        regles: "Breaching (6+)",
        traits: "Power",
      },
      {
        nom: "The Raven's Talons",
        stats: ["+1", "+2", "S", "2", "1"],
        regles: "Critical Hit (6+)",
        traits: "Power",
      },
      {
        // Arme de personnage (Jaghatai Khan, Primarque des White Scars).
        nom: "The White Tiger Dao",
        stats: ["+2", "A", "S", "2", "2"],
        regles: "Impact (AM), Duellist's Edge (1)",
        traits: "Power",
      },
      {
        // Arme de personnage (Sanguinius, Primarque des Blood Angels).
        nom: "The Blade Encarmine",
        stats: ["1", "A", "+1", "2", "2"],
        regles: "Critical Hit (5+), Impact (AM)",
        traits: "Power",
      },
      {
        nom: "Spear of Telesto",
        stats: ["-1", "-2", "+3", "2", "2"],
        regles: "Armourbane, Shock (Suppressed)",
        traits: "Power",
      },
      {
        nom: "Moonsilver Blade",
        stats: ["1", "A", "S", "3", "2"],
        regles: "Duellist's Edge (1)",
        traits: "Power",
      },
      {
        // Arme de personnage (Angron, Primarque des World Eaters).
        nom: "Gorefather and Gorechild",
        stats: ["1", "+1", "S", "2", "2"],
        regles: "Critical Hit (6+), Rending (5+)",
        traits: "Chain",
      },
      {
        // Arme de personnage (Angron Transfiguré, World Eaters) : profil
        // Éviscération, voir aussi Concassage ci-dessous.
        nom: "Blades of the Red Angel — Evisceration",
        stats: ["1", "A", "S", "2", "2"],
        regles: "Reaping Blow (2)",
        traits: "-",
      },
      {
        // Arme de personnage (Angron Transfiguré, World Eaters) : profil
        // Concassage, voir aussi Éviscération ci-dessus.
        nom: "Blades of the Red Angel — Crushing",
        stats: ["-2", "4", "+4", "2", "4"],
        regles: "Critical Hit (6+), Armourbane",
        traits: "-",
      },
      {
        // Arme de personnage (Vulkan, Primarque des Salamanders).
        nom: "Dawnbringer",
        stats: ["1", "A", "+2", "2", "3"],
        regles: "Critical Hit (5+), Armourbane",
        traits: "Power",
      },
      {
        // Arme de personnage (Rogal Dorn, Primarque des Imperial Fists).
        nom: "Teeth of the Storm",
        stats: ["1", "A", "S", "2", "2"],
        regles: "Rending (4+), Reaping Blow (2)",
        traits: "Chain",
      },
      {
        // Arme de personnage (Roboute Guilliman, Primarque des
        // Ultramarines).
        nom: "The Gladius Incandor",
        stats: ["1", "A", "S", "3", "2"],
        regles: "Breaching (5+), Duellist's Edge (1)",
        traits: "Power",
      },
      {
        // Arme de personnage (Roboute Guilliman, Primarque des
        // Ultramarines).
        nom: "The Hand of Dominion",
        stats: ["-3", "A", "+4", "2", "3"],
        regles: "Armourbane",
        traits: "Power",
      },
      {
        // Arme de personnage (Horus Lupercal / Horus Exalté, Primarque
        // des Sons of Horus). Profil de Mêlée : possède aussi un
        // profil de Tir (voir Armes à Bolts ci-dessus).
        nom: "The Warmaster's Talon",
        stats: ["1", "A", "S", "2", "1"],
        regles: "Reaping Blow (3), Rending (6+)",
        traits: "Power",
      },
      {
        // Arme de personnage (Horus Lupercal / Horus Exalté, Primarque
        // des Sons of Horus, « Worldbreaker »).
        nom: "Worldbreaker",
        stats: ["-2", "A", "+4", "2", "3"],
        regles: "Critical Hit (5+)",
        traits: "Power",
      },
      {
        // Arme de personnage (Lorgar, Primarque des Word Bearers).
        // MI confirmé "I" par Jean lors d'une précédente relecture ;
        // la capture la plus récente affiche plutôt "1" à cette
        // colonne (police proche) — à confirmer en dernier ressort.
        nom: "Illuminarum",
        stats: ["I", "A", "+2", "2", "3"],
        regles: "Critical Hit (5+), Phage (S), Reaping Blow (2)",
        traits: "Power",
      },
      {
        // Arme de personnage (Lorgar, Primarque des Word Bearers).
        nom: "Devotion",
        stats: ["12", "1", "8", "2", "2"],
        regles: "Shock (Pinned), Pinning (0)",
        traits: "Graviton, Assault",
      },
      {
        // Arme de personnage (Mortarion, Primarque de la Death Guard).
        // Profil de Mêlée : possède aussi un profil de Tir (voir
        // Armes Exotiques et Diverses (Tir) ci-dessus, La Lanterne).
        nom: "Silence",
        stats: ["-1", "A", "+1", "2", "2"],
        regles: "Reaping Blow (3), Critical Hit (6+)",
        traits: "Power",
      },
      {
        // Arme de personnage (Magnus le Rouge, Primarque des Thousand
        // Sons). Profil de Mêlée : possède aussi un profil de Tir (voir
        // Armes Exotiques et Diverses (Tir) ci-dessus, Serpentine à feu
        // psychique).
        nom: "The Blade of Ahn-nunurta",
        stats: ["I", "A", "+1", "2", "2"],
        regles: "Force (D)",
        traits: "Psychic",
      },
      {
        // Arme de personnage (Alpharius, Primarque de l'Alpha Legion).
        nom: "The Pale Spear",
        stats: ["+1", "A", "+1", "2", "2"],
        regles: "Critical Hit (5+), Armourbane, Phage (S)",
        traits: "Power",
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
        traits: "Power",
      },
      {
        // Arme de personnage (Perturabo, Primarque des Iron Warriors) :
        // profil de Mêlée, voir aussi son profil de Tir dans Armes
        // Exotiques et Diverses (Tir) ci-dessus.
        // Corrigé (2026-11-07, signalé par le proprio) : MI valait "1"
        // au lieu de "I" (Initiative du porteur, sans modificateur).
        nom: "The Arsenal of the Logos",
        stats: ["I", "+2", "6", "3", "1"],
        regles: "Rending (4+)",
        traits: "Power",
      },
      {
        // Arme de personnage (Perturabo, Iron Warriors) : jadis celle
        // de Ferrus Manus, Primarque des Iron Hands.
        nom: "Profaned Forgebreaker",
        stats: ["-2", "A", "+3", "2", "2"],
        regles: "Critical Hit (5+)",
        traits: "Power",
      },
      {
        // Arme de personnage (Konrad Curze, Primarque des Night
        // Lords).
        nom: "Mercy and Forgiveness",
        stats: ["1", "+2", "S", "2", "1"],
        regles: "Critical Hit (5+), Rending (4+)",
        traits: "Power",
      },
      {
        // Arme de personnage (Fulgrim, Primarque des Emperor's
        // Children).
        nom: "Laerian Blade",
        stats: ["1", "A", "S", "2", "2"],
        regles: "Duellist's Edge (1)",
        traits: "-",
      },
      {
        // Arme de personnage (Fulgrim Transfiguré, Emperor's Children) :
        // profil Coups de décapitation, voir aussi Coups de fendoir
        // ci-dessous.
        nom: "Blades of the Phoenician — Decapitating strikes",
        stats: ["1", "A", "S", "2", "2"],
        regles: "Critical Hit (6+), Duellist's Edge (1)",
        traits: "-",
      },
      {
        // Arme de personnage (Fulgrim Transfiguré, Emperor's Children) :
        // profil Coups de fendoir, voir aussi Coups de décapitation
        // ci-dessus.
        nom: "Blades of the Phoenician — Cleaving strikes",
        stats: ["-2", "3", "+5", "2", "4"],
        regles: "Critical Hit (6+), Duellist's Edge (1)",
        traits: "-",
      },
      {
        // Arme de personnage (Nathaniel Garro, Knight-Errant — PDF
        // « Knight-Errant »). Nom propre (Latin), gardé tel quel.
        nom: "Libertas",
        stats: ["1", "A", "+1", "2", "1"],
        regles: "Critical Hit (6+), Duellist's Edge (2)",
        traits: "Power",
      },
    ],
  },
  {
    // Arsenal des World Eaters (XIIe Légion) : armes rituelles des
    // Saccageurs (Escouade Saccageuse, voir js/unites-data.js, unité
    // réservée à cette Légion). Chaque Figurine équipée d'une arme des
    // Caedere choisit un de ces quatre profils.
    titre: "Caedere Weapons",
    armes: [
      {
        nom: "Meteor hammer",
        stats: ["1", "-1", "+2", "3", "2"],
        regles: "Impact (IM)",
        traits: "Power",
      },
      {
        nom: "Excoriator chainaxe",
        stats: ["-2", "A", "+2", "3", "1"],
        regles: "Breaching (6+), Rending (6+)",
        traits: "Chain",
      },
      {
        nom: "Pair of falax blades",
        stats: ["1", "+2", "S", "3", "1"],
        regles: "-",
        traits: "Power",
      },
      {
        nom: "Barbed whip",
        stats: ["+1", "A", "S", "3", "1"],
        regles: "Critical Hit (6+), Phage (S)",
        traits: "Power",
      },
    ],
  },
  /* --- Armes Exotiques et Diverses (Mêlée) — 33 entrées --- */
  {
    titre: "Exotic and Miscellaneous Weapons (Melee)",
    armes: [
      {
        nom: "Lascutter¹",
        stats: ["-3", "1", "12", "2", "4"],
        regles: "-",
        traits: "-",
      },
      {
        // Arme de personnage (Surgeon-Primus Aevos Jovan, Legacies
        // Solar Auxilia).
        nom: "Phase lancet",
        stats: ["+1", "A", "2", "3", "2"],
        regles: "Wounding (6+)",
        traits: "-",
      },
      {
        // Arme de personnage (Davinite Lodge Priest, Legacies Solar
        // Auxilia) : Force de Mêlée donnée « S » (Spécial) sur la
        // fiche — l'arme ne blesse jamais par sa Force, uniquement via
        // Empoisonnée (5+), d'où le « - » ci-dessous plutôt qu'une
        // valeur numérique ou « F » (comme user's Strength).
        nom: "Davinite Blade",
        stats: ["+1", "A", "-", "-", "1"],
        regles: "Poisoned (5+)",
        traits: "-",
      },
      {
        // Arme du Mortificator (Legacies, générique Legiones Astartes) :
        // voir js/unites-data.js.
        nom: "Corposant stave",
        stats: ["1", "A", "+1", "3", "1"],
        regles: "Shock (Pinned, Stunned, Suppressed)",
        traits: "-",
      },
      {
        // Arme de personnage (Kaedes Nex, Raven Guard) : profil de
        // Mêlée, voir aussi son profil de Tir dans Armes de Tir.
        nom: "Fulcrum fist cannons (Melee)",
        stats: ["1", "+1", "6", "2", "1"],
        regles: "Rending (5+)",
        traits: "-",
      },
      {
        // Arme de personnage (Capitaine Lucius, Emperor's Children).
        nom: "Blades of Lucius",
        stats: ["1", "A", "S", "2", "2"],
        regles: "Duellist's Edge (1)",
        traits: "-",
      },
      {
        // Arme de l'Escouade de Lames Palatines (Emperor's Children).
        nom: "Palatine blade",
        stats: ["1", "A", "+1", "3", "1"],
        regles: "Breaching (5+), Duellist's Edge (1)",
        traits: "-",
      },
      {
        // Arme de personnage (Marduk Sedras, Dark Angels).
        nom: "The Death of Worlds",
        stats: ["-2", "A", "+5", "2", "3"],
        regles: "-",
        traits: "-",
      },
      {
        // Attaque bonus des Mort-jurés (Space Wolves), voir la Règle
        // Spéciale Les Songes du Loup Funeste.
        nom: "Agony strike",
        stats: ["1", "1", "+1", "3", "1"],
        regles: "Breaching (5+)",
        traits: "Power",
      },
      {
        // Arme de Freki et Geri, les loups de Leman Russ (Space Wolves).
        nom: "Fangs and Claws",
        stats: ["1", "A", "S", "4", "2"],
        regles: "Breaching (6+)",
        traits: "-",
      },
      {
        // Arme de l'Unité Meute de Loups Fenrisiens (Space Wolves) :
        // profil plus modeste que celui de Freki/Geri ci-dessus.
        nom: "Wolf teeth and claws",
        stats: ["1", "A", "S", "5", "1"],
        regles: "-",
        traits: "-",
      },
      {
        nom: "Krak grenades",
        stats: ["-3", "1", "6", "4", "2"],
        regles: "Detonation",
        traits: "-",
      },
      {
        nom: "Melta bombs",
        stats: ["-3", "1", "9", "2", "4"],
        regles: "Detonation, Armourbane",
        traits: "-",
      },
      {
        nom: "Leviathan siege claw",
        stats: ["I", "A", "+2", "2", "3"],
        regles: "-",
        traits: "-",
      },
      {
        nom: "Pair of Leviathan siege claws",
        stats: ["I", "+1", "+2", "2", "3"],
        regles: "-",
        traits: "-",
      },
      {
        nom: "Leviathan siege drill",
        stats: ["-2", "A", "+4", "2", "3"],
        regles: "Armourbane",
        traits: "-",
      },
      {
        nom: "Pair of Leviathan siege drills",
        stats: ["-2", "A", "+4", "2", "4"],
        regles: "Armourbane",
        traits: "-",
      },
      {
        // Corrigée (2026-08-02, signalé par le proprio) : héritait par
        // erreur de copier-coller de « Fléau des Blindages » depuis la
        // Paire de trépans de siège Leviathan juste au-dessus, sans
        // rapport avec une simple baïonnette.
        nom: "Bayonet",
        stats: ["I", "A", "S", "5", "1"],
        regles: "-",
        traits: "Bayonet",
      },
      /* --- Arsenal des Solar Auxilia (Liber Auxilia) : les Unités
         Solar Auxilia doivent utiliser cette version de l'arme. --- */
      {
        nom: "Krak grenades (Solar Auxilia)",
        stats: ["-3", "1", "6", "4", "2"],
        regles: "Detonation",
        traits: "-",
      },
      {
        // Corrigé au passage (même copier-coller fautif que la
        // Baïonnette ci-dessus) : des Bombes à fusion n'ont aucune
        // raison de porter le Trait Baïonnette.
        nom: "Melta bombs (Solar Auxilia)",
        stats: ["-3", "1", "9", "2", "4"],
        regles: "Armourbane, Detonation",
        traits: "-",
      },
      {
        nom: "Bayonet (Solar Auxilia)",
        stats: ["I", "A", "S", "5", "1"],
        regles: "-",
        traits: "-",
      },
      {
        // Arme de personnage (Sigismund, Imperial Fists).
        nom: "The Black Sword",
        stats: ["1", "A", "+2", "2", "1"],
        regles: "Critical Hit (6+), Duellist's Edge (2)",
        traits: "-",
      },
      /* --- Arsenal des Taghmata du Mechanicum (Liber Mechanicum) :
         armes de personnages/Unités uniques. --- */
      {
        // Arme du Scorpion d'Airain.
        nom: "Hellcrusher claws",
        stats: ["-3", "3", "+3", "2", "3"],
        regles: "Armourbane",
        traits: "-",
      },
      {
        // Arme de l'Engin Démon Kytan.
        nom: "Slaughter cleaver",
        stats: ["-2", "4", "+4", "2", "3"],
        regles: "Armourbane, Rending (5+)",
        traits: "-",
      },
      {
        nom: "Slaughterer's Blades",
        stats: ["1", "4", "+2", "3", "1"],
        regles: "Rending (5+)",
        traits: "-",
      },
      {
        // Arme par défaut du Decimator (deux exemplaires).
        nom: "Decimator claw",
        stats: ["-1", "2", "+2", "2", "2"],
        regles: "Armourbane",
        traits: "-",
      },
      {
        // Arme du Manipule de Combat Domitar.
        nom: "Domitar fists",
        stats: ["-2", "A", "+3", "2", "3"],
        regles: "Breaching (6+)",
        traits: "-",
      },
      {
        // Arme de la Cohorte d'Ursarax.
        nom: "Pair of Ursarax claws",
        stats: ["1", "+1", "+2", "3", "2"],
        regles: "Rending (5+)",
        traits: "-",
      },
      {
        // Arme optionnelle de l'Armigère Moirax.
        nom: "Gyges siege claw",
        stats: ["-2", "A", "+3", "2", "3"],
        regles: "Armourbane, Detonation",
        traits: "-",
      },
      {
        nom: "Volkite vouglaire",
        stats: ["+1", "A", "7", "2", "2"],
        regles: "Deflagrate (6)",
        traits: "Volkite",
      },
      {
        // Arme de l'Escadron de Stratos Vultarax.
        nom: "Dendrite talons",
        stats: ["1", "A", "+1", "3", "1"],
        regles: "Rending (5+)",
        traits: "-",
      },
      {
        // Arme de l'Arlatax Battle Maniple (Legacies, Mechanicum), en
        // échange de sa paire de lames énergétiques et de son autocanon
        // léger jumelé (voir js/unites-data.js).
        nom: "Pair of arc scourges",
        stats: ["-", "+1", "+2", "3", "2"],
        regles: "Shock (Suppressed)",
        traits: "Arc",
      },
      {
        // Arme de l'Escouade Inductii Night Lords (Legacies, Legiones
        // Inductii) : lame improvisée, sans design standardisé.
        nom: "Killer's blade",
        stats: ["I", "A", "S", "-", "1"],
        regles: "Breaching (6+), Precision (6+)",
        traits: "-",
      },
    ],
    note: "¹ Note that this Weapon has both a Ranged and a Melee profile (see Ranged Weapons above).",
  },
  /* ============================================================
     Arsenal des Maisonnées de Chevaliers et des Legios Titaniques :
     armes montées sur les Chevaliers Questoris et les Titans.
     ============================================================ */
  /* --- Électro-armes — 3 entrées --- */
  {
    titre: "Arc Weapons",
    armes: [
      {
        // Profil de Mêlée : possède aussi un profil de Tir (voir Armes
        // de Tir ci-dessus).
        nom: "Shock lance (Melee)",
        stats: ["1", "A", "+1", "2", "4"],
        regles: "Impact (IM & D), Shock (Stunned)",
        traits: "Arc",
      },
      {
        nom: "Arc lance",
        stats: ["+1", "A", "+1", "3", "1"],
        regles: "Precision (6+), Shock (Suppressed)",
        traits: "Arc",
      },
      {
        nom: "Arc maul",
        stats: ["-1", "A", "+3", "3", "2"],
        regles: "Shock (Suppressed)",
        traits: "Arc",
      },
    ],
  },
  /* --- Outils de Découpe du Mechanicum — 2 entrées --- */
  {
    titre: "Mechanicum Cutting Tools",
    armes: [
      {
        // Profil de Mêlée : possède aussi un profil de Tir (voir Armes
        // de Tir ci-dessus).
        nom: "Las-impulsor (Melee)",
        stats: ["-3", "-1", "10", "2", "5"],
        regles: "Armourbane",
        traits: "Las",
      },
      {
        nom: "Atrapos phase cutter (Melee)",
        stats: ["-2", "-1", "12", "2", "6"],
        regles: "Armourbane",
        traits: "Las",
      },
    ],
  },
  /* --- Destructeurs de Siège — 3 entrées --- */
  {
    titre: "Siege Destructors",
    armes: [
      {
        nom: "Gyges siege claw",
        stats: ["1", "A", "+5", "3", "3"],
        regles: "Armour-breaker (5+), Breaching (5+)",
        traits: "Power",
      },
      {
        nom: "Pair of Gyges siege claws",
        stats: ["1", "A", "+6", "3", "4"],
        regles: "Armour-breaker (5+), Breaching (5+)",
        traits: "Power",
      },
      {
        nom: "Hekaton siege claw",
        stats: ["-1", "A", "x2", "3", "3"],
        regles: "Armour-breaker (4+), Breaching (4+), Shock (Pinned)",
        traits: "Power",
      },
    ],
  },
  /* --- Arsenal des Conclaves Skitarii. --- */
  {
    titre: "Skitarii Conclave Weapons",
    armes: [
      {
        nom: "Auctorite sceptre",
        stats: ["I", "A", "+1", "4", "1"],
        regles: "Breaching (6+), Icon of Authority",
        traits: "Power",
      },
      {
        nom: "Phase claw",
        stats: ["-3", "A", "+3", "2", "2"],
        regles: "Wounding (6+)",
        traits: "Power",
      },
      {
        nom: "Lightning staff",
        stats: ["I", "A", "+1", "3", "1"],
        regles: "Shock (Pinned, Stunned, Suppressed)",
        traits: "-",
      },
      {
        nom: "Volt caliver¹",
        stats: ["I", "A", "+1", "4", "1"],
        regles: "Impact (I)",
        traits: "-",
      },
      {
        nom: "Dendrite talons (Skitarii)",
        stats: ["I", "A", "S", "4", "2"],
        regles: "Breaching (6+)",
        traits: "-",
      },
    ],
    note: "¹ Note that this Weapon has both a Ranged and a Melee profile (see Ranged Weapons above).",
  },
  /* --- Arsenal des Forces de l'Empereur (Legio Custodes), suite
     (voir la note miroir côté Armes de Tir ci-dessus). --- */
  /* --- Armes de Gardien — 6 entrées --- */
  {
    titre: "Guardian Weapons",
    armes: [
      {
        nom: "Guardian spear (Melee)",
        stats: ["I", "A", "+1", "2", "1"],
        regles: "Impact (AM)",
        traits: "Power",
      },
      {
        nom: "Sentinel blade (Melee)",
        stats: ["I", "A", "S", "2", "1"],
        regles: "-",
        traits: "Power",
      },
      {
        nom: "Verutum spear (Melee)",
        stats: ["I", "A", "+1", "2", "1"],
        regles: "Precision (5+), Impact (AM)",
        traits: "Power",
      },
      {
        nom: "Achillus dreadspear (Melee)",
        stats: ["I", "A", "+3", "2", "3"],
        regles: "Armourbane, Impact (AM)",
        traits: "Power",
      },
      {
        nom: "Galatus warblade (Melee)",
        stats: ["I", "A", "S", "2", "2"],
        regles: "Aflame (2), Reaping Blow (3)",
        traits: "Power",
      },
      {
        nom: "Eternity Spear (Melee)",
        stats: ["I", "A", "+1", "2", "1"],
        regles:
          "Aflame (2), Critical Hit (6+), Impact (AM), Rending (5+)",
        traits: "-",
      },
    ],
    note: "These Weapons have both a Ranged and a Melee profile (see Ranged Weapons above).",
  },
  /* --- Armes Diverses — 1 entrée --- */
  {
    titre: "Miscellaneous Weapons",
    armes: [
      {
        nom: "Neutronium Cascade mine",
        stats: ["-3", "1", "9", "3", "3"],
        regles: "Armourbane, Detonation, Cascading Annihilation (9)",
        traits: "-",
      },
    ],
  },
  /* --- Armes de la Sororité Silencieuse — 1 entrée --- */
  {
    titre: "Silent Sisterhood Weapons",
    armes: [
      {
        nom: "Execution greatsword",
        stats: ["I", "A", "+1", "3", "1"],
        regles: "Wounding (6+), Breaching (6+)",
        traits: "Power",
      },
    ],
  },
  /* --- Armes d'Éternité — 1 entrée --- */
  {
    titre: "Eternity Weapons",
    armes: [
      {
        nom: "Eternity Blade",
        stats: ["+1", "A", "+1", "2", "1"],
        regles:
          "Aflame (2), Critical Hit (6+), Rending (4+), Duellist's Edge (1)",
        traits: "-",
      },
    ],
  },
  /* --- Épée des voûtes (« Vaultsword ») — Journal Tactica : The Battle
     for the Signus Cluster (Venatari-Proconsul Ephoroi) et Journal
     Tactica : Prospero Burns (Sodalité Adjutorum). --- */
  {
    titre: "Vault Weapons",
    armes: [
      {
        nom: "Vault sword",
        stats: ["+1", "+2", "S", "2", "1"],
        regles: "Duellist's Edge (1), Precision (4+)",
        traits: "Power",
      },
    ],
  },
  /* --- Armes Solarites — 5 entrées --- */
  {
    titre: "Solarite Weapons",
    armes: [
      {
        nom: "Solarite power talon",
        stats: ["1", "A", "S", "2", "1"],
        regles: "Critical Hit (6+), Reaping Blow (2)",
        traits: "Power",
      },
      {
        nom: "Solarite power lance — Charging strike",
        stats: ["+4", "0", "+5", "2", "3"],
        regles: "Impact (AM), Critical Hit (6+), Armourbane",
        traits: "Power",
      },
      {
        nom: "Solarite power lance — Defensive strike",
        stats: ["-1", "A", "S", "2", "1"],
        regles: "Critical Hit (6+)",
        traits: "Power",
      },
      {
        nom: "Telemon caestus",
        stats: ["1", "A", "+3", "2", "3"],
        regles: "Critical Hit (6+), Shock (Pinned), Armourbane",
        traits: "Power",
      },
      {
        nom: "Pair of Telemon caestus",
        stats: ["1", "+1", "+3", "2", "4"],
        regles: "Critical Hit (6+), Shock (Pinned), Armourbane",
        traits: "Power",
      },
    ],
  },
  /* --- Arsenal de la Legio Custodes. --- */
  {
    titre: "Legio Custodes Weapons",
    armes: [
      {
        nom: "Adrasite spear¹",
        stats: ["1", "A", "+1", "2", "1"],
        regles: "Impact (AM)",
        traits: "Power",
      },
      {
        nom: "Pyrithite spear¹",
        stats: ["1", "A", "+1", "2", "1"],
        regles: "Impact (AM)",
        traits: "Power",
      },
      {
        nom: "The Apollonian Spear (Melee)",
        stats: ["1", "A", "+2", "2", "2"],
        regles: "Critical Hit (5+), Duellist's Edge (2), Impact (AM)",
        traits: "Power",
      },
    ],
    note: "¹ Note that this Weapon has both a Ranged and a Melee profile (see Ranged Weapons above).",
  },
  /* --- Arsenal de l'Anathema Psykana. --- */
  {
    titre: "Anathema Psykana Weapons",
    armes: [
      {
        nom: "The Blade of Oblivion",
        stats: ["1", "A", "+2", "2", "2"],
        regles: "Critical Hit (6+), Duellist's Edge (2)",
        traits: "-",
      },
    ],
  },
  /* --- Arsenal de la Divisio Assassinorum (Clade Adamus/Callidus). --- */
  {
    titre: "Divisio Assassinorum Weapons",
    armes: [
      {
        nom: "Nemesii Blade",
        stats: ["1", "A", "S", "2", "1"],
        regles: "Critical Hit (5+), Rending (5+)",
        traits: "-",
      },
      {
        nom: "Phase sword",
        stats: ["+2", "A", "S", "2", "1"],
        regles: "Precision (5+), Wounding (6+), Phase Shift (6+)",
        traits: "Power",
      },
      {
        nom: "Psyk-out grenades",
        stats: ["1", "3", "5", "3", "2"],
        regles: "Aflame (2), Wounding (6+), Precision (6+), Limited (3)",
        traits: "-",
      },
      {
        nom: "Neuro-gauntlet",
        stats: ["+1", "+1", "S", "3", "2"],
        regles: "Wounding (4+), Poisoned (4+)",
        traits: "Power",
      },
      {
        nom: "Synthonic datapicks",
        stats: ["+1", "+2", "S", "3", "1"],
        regles: "Wounding (6+), Precision (6+), Shock (Stunned)",
        traits: "-",
      },
      {
        nom: "Hook",
        stats: ["+1", "A", "S", "3", "1"],
        regles: "Wounding (6+), Precision (2+), The Venem",
        traits: "-",
      },
      {
        nom: "Assassin's Blade",
        stats: ["1", "A", "S", "3", "1"],
        regles: "Breaching (6+)",
        traits: "Power",
      },
    ],
  },
  /* --- Arsenal des Démons de la Tempête de la Ruine (« Legacies of the
     Age of Darkness : Daemons of the Ruinstorm »), tables « Immaterial
     Blades » et « Forms of Ruin ». --- */
  /* --- Armes des Démons de la Tempête de la Ruine — 16 entrées --- */
  {
    titre: "Ruinstorm Daemon Weapons",
    armes: [
      {
        nom: "Sovereign blade",
        stats: ["1", "A", "S", "2", "2"],
        regles: "Phage (S), Reaping Blow (1)",
        traits: "Immaterial",
      },
      {
        nom: "Sovereign greatblade",
        stats: ["-2", "A", "+3", "2", "3"],
        regles: "Phage (S), Reaping Blow (2)",
        traits: "Immaterial",
      },
      {
        nom: "Hierarch blade",
        stats: ["1", "A", "S", "2", "2"],
        regles: "Duellist's Edge (1), Critical Hit (6+)",
        traits: "Immaterial",
      },
      {
        nom: "Hierarch greatblade",
        stats: ["-2", "A", "+2", "2", "2"],
        regles: "Critical Hit (5+)",
        traits: "Immaterial",
      },
      {
        nom: "Harbinger blade",
        stats: ["1", "A", "S", "3", "1"],
        regles: "Breaching (5+), Rending (6+)",
        traits: "Immaterial",
      },
      {
        nom: "Immaterial armaments",
        stats: ["I", "A", "S", "3", "2"],
        regles: "Breaching (5+)",
        traits: "Immaterial",
      },
      {
        nom: "Daemon claws",
        stats: ["I", "A", "S", "5", "1"],
        regles: "Rending (5+)",
        traits: "Immaterial",
      },
      {
        nom: "Infernal blade",
        stats: ["I", "-1", "S", "4", "1"],
        regles: "Breaching (6+)",
        traits: "Immaterial",
      },
      {
        nom: "Infernal greatblade",
        stats: ["-1", "-1", "+2", "3", "2"],
        regles: "Breaching (6+)",
        traits: "Immaterial",
      },
      {
        nom: "Infernal lance",
        stats: ["+1", "1", "S", "4", "1"],
        regles: "Breaching (6+)",
        traits: "Immaterial",
      },
      {
        nom: "Maw & talon",
        stats: ["I", "A", "S", "4", "2"],
        regles: "Breaching (6+)",
        traits: "Immaterial",
      },
      {
        nom: "Great maw & talon",
        stats: ["I", "A", "S", "4", "2"],
        regles: "Breaching (5+)",
        traits: "Immaterial",
      },
      {
        nom: "Pulverising limbs",
        stats: ["I", "A", "S", "5", "2"],
        regles: "-",
        traits: "Immaterial",
      },
      {
        // Baneaxe, moitié Mêlée de l'Armement de Ka'bandha (voir
        // Lanière de fer, Armes de Tir plus haut, pour la moitié Tir).
        nom: "Baneaxe",
        stats: ["I", "A", "S", "2", "2"],
        regles: "Critical Hit (5+)",
        traits: "Immaterial",
      },
      {
        nom: "Reaping claws",
        stats: ["I", "A", "S", "3", "2"],
        regles: "Reaping Blow (2), Breaching (6+)",
        traits: "Immaterial",
      },
      {
        nom: "Blade of Samus",
        stats: ["I", "A", "S", "2", "2"],
        regles: "Critical Hit (6+)",
        traits: "Immaterial",
      },
    ],
  },
  /* --- Armes de mêlée des Démons de Tzeentch (Journal Tactica :
     Prospero Burns, traduction maison) — 7 entrées. --- */
  {
    titre: "Daemons of Tzeentch Weapons",
    armes: [
      {
        // Changeblade (Seigneur Ascendant de Tzeentch).
        nom: "Changeblade",
        stats: ["I", "A", "S", "2", "2"],
        regles: "Duellist's Edge (1), Critical Hit (6+)",
        traits: "Immaterial",
      },
      {
        nom: "Great Changeblade",
        stats: ["-2", "A", "+2", "2", "2"],
        regles: "Critical Hit (5+)",
        traits: "Immaterial",
      },
      {
        // Ætherblade (Héraut de Tzeentch).
        nom: "Ethereal blade",
        stats: ["I", "+2", "S", "3", "1"],
        regles: "Breaching (5+), Force (D)",
        traits: "Immaterial",
      },
      {
        // Staff of Change (Héraut de Tzeentch).
        nom: "Staff of Change",
        stats: ["-3", "A", "+3", "2", "1"],
        regles: "Warp Bane",
        traits: "Immaterial",
      },
      {
        // Razorspines (Hurleurs de Tzeentch).
        nom: "Razor spines",
        stats: ["I", "A", "S", "-", "1"],
        regles: "Impact (S), Breaching (6+)",
        traits: "Immaterial",
      },
      {
        // Coruscating grasp (Horreurs de Tzeentch).
        nom: "Glimmering grasp",
        stats: ["I", "A", "S", "-", "1"],
        regles: "Wounding (6+), Rending (6+)",
        traits: "Immaterial",
      },
      {
        // Staff of Tzeentch (Seigneur du Changement).
        nom: "Staff of Tzeentch",
        stats: ["I", "A", "S", "2", "2"],
        regles: "Reaping Blow (3), Force (S), Critical Hit (6+)",
        traits: "Immaterial",
      },
    ],
  },
  /* --- Armes de mêlée des Démons de Slaanesh (Journal Tactica : The
     Battle for the Signus Cluster, traduction maison) — 7 entrées.
     Phage (WP) → Phage (Vo). --- */
  {
    titre: "Daemons of Slaanesh Weapons",
    armes: [
      {
        // Tormentor blade (Seigneur Ascendant de Slaanesh).
        nom: "Torment Blade",
        stats: ["+1", "A", "S", "2", "2"],
        regles: "Duellist's Edge (1), Critical Hit (6+), Phage (WP)",
        traits: "Immaterial",
      },
      {
        nom: "Great Torment Blade",
        stats: ["-2", "A", "+2", "2", "2"],
        regles: "Critical Hit (5+), Phage (WP)",
        traits: "Immaterial",
      },
      {
        // Ripclaws (Héraut de Slaanesh).
        nom: "Rending claws",
        stats: ["I", "+2", "S", "3", "1"],
        regles: "Wounding (6+), Breaching (6+), Force (D), Phage (WP)",
        traits: "Immaterial",
      },
      {
        // Razorclaws (Démonettes, Veneuses de Slaanesh).
        nom: "Razor claws",
        stats: ["I", "+1", "S", "3", "1"],
        regles: "Wounding (6+), Breaching (6+), Phage (WP)",
        traits: "Immaterial",
      },
      {
        // Great razorclaws (Bêtes de Slaanesh).
        nom: "Great razor claws",
        stats: ["I", "+1", "S", "3", "2"],
        regles: "Wounding (6+), Breaching (6+), Phage (WP)",
        traits: "Immaterial",
      },
      {
        // Shimmerblade (Gardien des Secrets).
        nom: "Mirror Blade",
        stats: ["I", "A", "S", "2", "2"],
        regles: "Critical Hit (5+), Force (S), Phage (WP)",
        traits: "Immaterial",
      },
      {
        // Shimmerspear & shield (Gardien des Secrets).
        nom: "Mirror Lance and shield",
        stats: ["+1", "-1", "S", "2", "2"],
        regles:
          "Impact (I), Critical Hit (6+), Force (S), Phage (WP), Deviation",
        traits: "Immaterial",
      },
    ],
  },
  {
    // Legacies of the Age of Darkness : Legiones Astartes Blackshields
    // — voir le commentaire de tête de la catégorie « Armes des
    // Blackshields » (Armes de Tir plus haut) pour le contexte complet.
    titre: "Blackshields Weapons",
    armes: [
      {
        nom: "Halo blade",
        stats: ["I", "A", "+2", "2", "1"],
        regles: "Rending (5+)",
        traits: "Xenos",
      },
      {
        nom: "Reclaimed melee weapon",
        stats: ["-1", "A", "+1", "5", "1"],
        regles: "Wounding (6+)",
        traits: "-",
      },
    ],
  },
  /* --- Armes de Zone Mortalis — 1 entrée --- */
  {
    titre: "Zone Mortalis Weapons",
    armes: [
      {
        nom: "Sapper charges",
        stats: ["0", "1", "10", "-", "D3+3"],
        regles: "-",
        traits: "-",
      },
    ],
  },
];
