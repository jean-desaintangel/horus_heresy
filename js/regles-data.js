/* ============================================================
   regles-data.js — Données des règles spéciales
   Auteur : Jean · Créé : 2026-07-15
   Rôle   : encode les règles spéciales en JS ({ nom, texte }), sans
   aucune logique de rendu ni de recherche. Partagé par :
   - js/regles.js  (page regles.html : cartes de référence)
   - js/armes.js   (page armes.html : info-bulles sur les tables d'armes)
   Dépend : aucun (vanilla JS). Doit être chargé avant les scripts
   ci-dessus.
   ============================================================ */

// --- Règles spécifiques aux armes ---
const REGLES_ARMES = [
  {
    nom: "Sonner (X)",
    texte:
      "Si l'arme inflige une touche, la cible fait un test de Sang-froid avec un malus de X.",
  },
  {
    nom: "Neutralisation (X)",
    texte:
      "Si l'arme inflige une touche, la cible fait un test de Sang-froid avec un malus de X. En cas d'échec, elle est Neutralisée.",
  },
  {
    nom: "Fixation (X)",
    texte:
      "Si l'arme inflige une blessure (que des dégâts soient infligés ou non), la cible fait un test de Sang-froid avec un malus de X.",
  },
  {
    nom: "Panique (X)",
    texte:
      "Si l'arme inflige une blessure (dégâts infligés ou non), la cible fait un test de Commandement avec un malus de X.",
  },
  {
    nom: "Brèche (X)",
    texte:
      "Si le jet de blessure est supérieur ou égal à X, la Pénétration d'Armure (PA) de l'attaque devient 2.",
  },
  {
    nom: "Empoisonné (X)",
    texte:
      "Le jet de blessure se fait toujours sur X, quelle que soit l'Endurance de la cible.",
  },
  {
    nom: "Fléau des blindages",
    texte:
      "Contre un véhicule, une touche superficielle devient une touche pénétrante.",
  },
  {
    nom: "Fusion (X)",
    texte:
      "Si la cible est à portée de X, les Dégâts sont doublés et l'arme gagne Fléau des blindages.",
  },
  {
    nom: "Impact (X)",
    texte: "Lors d'une charge, la figurine gagne +1 à la caractéristique X.",
  },
  {
    nom: "Lacération (X)",
    texte:
      "Si le jet de blessure est supérieur ou égal à X : +1 dégât (sauf sur un jet de pénétration de blindage).",
  },
  {
    nom: "Lourde (X)",
    texte: "Si le tireur est à l'arrêt : +1 à la caractéristique X.",
  },
  {
    nom: "Précision (X)",
    texte:
      "Si le jet de touche est supérieur ou égal à X, c'est l'attaquant qui choisit quelle figurine subit la blessure.",
  },
  {
    nom: "Touche critique (X)",
    texte:
      "Un jet de touche élevé (X ou plus, avant modificateur) devient une Touche Critique : elle blesse automatiquement, sans jet de blessure, et inflige 1 dégât de plus.",
  },
  {
    nom: "Vulnérante (X)",
    texte:
      "Un jet de touche élevé (X ou plus, avant modificateur) devient une Touche Vulnérante : elle blesse automatiquement, sans jet de blessure, en gardant la PA et les Dégâts de l'arme.",
  },
  {
    nom: "Antiaérien",
    texte:
      "Contre un Aéronef, l'arme touche normalement avec la CT du tireur au lieu de tirer au jugé — y compris en Réaction. Sans effet si l'unité tireuse a un statut tactique.",
  },
  {
    nom: "Artillerie (X)",
    texte:
      "Double la valeur de la caractéristique X si le tireur est resté à l'arrêt au tour précédent (une PA devient PA2 au lieu d'être doublée).",
  },
  {
    nom: "Atout du Duelliste (X)",
    texte: "Donne un bonus de X au jet de Concentration pendant un Défi.",
  },
  {
    nom: "Barrage (X)",
    texte:
      "Permet de tirer sur une cible sans ligne de vue (tir indirect). Combinée à Explosion, un jet de déviation détermine où retombe le tir en cas d'échec.",
  },
  {
    nom: "Choc (X)",
    texte:
      "Contre un Véhicule ou un Marcheur, un jet de touche de 5 ou 6 (avant modificateur) inflige un statut tactique — lequel dépend de X — même sans percer le blindage.",
  },
  {
    nom: "Combi",
    texte:
      "L'arme peut tirer avec plusieurs profils en même temps lors de la même Attaque de Tir.",
  },
  {
    nom: "Déflagration (X)",
    texte:
      "Chaque blessure non sauvegardée peut déclencher des touches supplémentaires sur la même cible.",
  },
  {
    nom: "Détonation",
    texte:
      "Ne peut attaquer que des Véhicules, des figurines dont la caractéristique de Mouvement est 0, ou des décors/bâtiments.",
  },
  {
    nom: "En Feu (X)",
    texte:
      "Si l'attaque blesse la cible, son unité est « en feu » : elle subit un malus supplémentaire de X à son Commandement pour les tests liés à ce Combat.",
  },
  {
    nom: "Explosion (X)",
    texte:
      "Utilise un gabarit pour toucher plusieurs figurines d'un coup, avec un seul jet de touche pour tout le gabarit (à ne pas confondre avec Explose (X), qui décrit une figurine qui explose).",
  },
  {
    nom: "Force (X)",
    texte:
      "Un Psyker peut tenter un test de Volonté pour doubler la caractéristique X de l'arme, au risque de subir les Périls du Warp sur un double.",
  },
  {
    nom: "Limitée (X)",
    texte:
      "L'arme ne peut servir à attaquer que X fois au total sur toute la bataille.",
  },
  {
    nom: "Phage (X)",
    texte:
      "Chaque blessure non sauvegardée réduit d'1, de façon permanente pour la bataille, une caractéristique de la cible.",
  },
  {
    nom: "Pistolet",
    texte: "Une figurine peut attaquer avec deux armes Pistolet en même temps.",
  },
  {
    nom: "Poursuite Rapide",
    texte:
      "Améliore la réaction Interception : l'arme peut être utilisée même si elle n'est pas une arme défensive.",
  },
  {
    nom: "Sélecteur de Tir",
    texte:
      "Au début d'une Attaque de Tir, l'arme peut gagner Panique (1), Brèche (4+) ou Neutralisation (2) jusqu'à la fin de l'attaque.",
  },
  {
    nom: "Souffle",
    texte:
      "Utilise un gabarit de flammes : pas de jet de touche, chaque figurine sous le gabarit est automatiquement touchée.",
  },
  {
    nom: "Surcharge (X)",
    texte:
      "Un jet de touche trop bas (X ou moins, avant modificateur) inflige une touche à la figurine qui tire.",
  },
  /* --- Arsenal des Maisonnées de Chevaliers et des Legios
     Titaniques. --- */
  {
    nom: "Brise-blindage (X)",
    texte:
      "Si le Jet de Pénétration de Blindage est supérieur ou égal à X, la Touche Pénétrante inflige 1 point de Dégâts supplémentaire.",
  },
  {
    nom: "Brise-bouclier (X)",
    texte:
      "Une attaque qui abat un bouclier Void en abat X à la fois au lieu d'un seul.",
  },
  {
    nom: "Macro-Auspex",
    texte:
      "Contre une cible qui n'est pas un Titan, un Chevalier, un Super-lourd ou une figurine d'au moins 10 Points de Vie de Base, l'arme doit Tirer au Jugé.",
  },
];

// --- Règles diverses ---
const REGLES_DIVERSES = [
  {
    nom: "Avance Implacable",
    texte:
      "Toutes les armes de la figurine sont considérées comme Assaut (sauf Lourde et Artillerie).",
  },
  {
    nom: "Avant-garde (X)",
    texte:
      "L'unité ne marque que 1 point de victoire sur un objectif, + X si elle est retirée comme perte ou fait battre en retraite une unité ennemie.",
  },
  {
    nom: "Réacteurs",
    texte:
      "Gagne le Sous-type Antigrav, une Valeur de Mouvement de 12 pouces, et les Règles Spéciales « Massif (2) » et « Frappe en Profondeur », contre un coût en Points supplémentaire (généralement +20).",
  },
  {
    nom: "Bouclier",
    texte:
      "Trait qui donne accès à la Réaction avancée des Legiones Astartes « Mur de Bouclier » (coût 1 Point d'Attribution de Réactions), déclarable au début de l'Étape 3 d'une Attaque de Tir ou de l'Étape 4 (Attaques de Volée) d'une Charge faite par l'adversaire : si la majorité des Figurines de l'Unité visée ont ce Trait, l'Unité gagne +1 en Endurance pour la durée de la Phase.",
  },
  {
    nom: "Charge désordonnée",
    texte:
      "L'unité ne bénéficie ni du mouvement de positionnement ni de l'attaque de mêlée bonus lors de la charge.",
  },
  {
    nom: "Écran de fumée (réaction)",
    texte:
      "Donne un Jet de Mitigation de Dégâts de Dissimulation contre les tirs. Le Joueur Réactif peut déclarer cette Réaction Avancée à la Phase de Tir, au début de l'Étape 3 d'une Attaque de Tir faite par le Joueur Actif, pour une Figurine qui a le Trait Écran de Fumée (coût : 1 Point d'Attribution de Réactions). Pour la durée de cette Attaque de Tir, toutes les Figurines de l'Unité ciblée qui ont majoritairement ce Trait gagnent un Jet de Mitigation de Dégâts de Dissimulation de 5+ contre les Blessures, Touches Pénétrantes ou Touches Superficielles infligées.",
  },
  {
    nom: "Explose (X)",
    texte:
      "Quand la figurine explose, toute unité à 6 pouces subit un nombre de jets de touche égal aux PV de base de la figurine qui explose (Force 8, Dégâts 1).",
  },
  {
    nom: "Frappe en profondeur",
    texte:
      "Arrivée aux tours 2, 3 ou 4, maximum 1 unité par tour. Placement à plus de 1 pouce de tout, l'unité groupée à 6 pouces autour de la première figurine. Elle ne peut ensuite ni se déplacer ni charger ce tour-là.",
  },
  {
    nom: "Fureur de la Légion",
    texte:
      "Quand une Figurine de cette Unité fait une Attaque de Tir avec un bolter, le bolter gagne la Règle Spéciale Lourde (PF) jusqu'à ce que l'Attaque de Tir soit complètement résolue.",
  },
  {
    nom: "Haine (X)",
    texte: "+1 au jet de blessure au combat contre les cibles de type X.",
  },
  {
    nom: "Infiltration (X)",
    texte:
      "Se déploie n'importe où sauf dans la zone de déploiement adverse et à plus de X pouces de l'ennemi. Ne peut pas charger au premier tour.",
  },
  {
    nom: "Léger",
    texte:
      "Une Unité entièrement composée de Figurines de Sous-type Léger gagne +2 à son Initiative pour déterminer la distance dont elle peut Foncer (cumulable avec d'autres bonus), et peut faire des Attaques de Tir après avoir Foncé, mais uniquement en tant que Tirs au Jugé.",
  },
  {
    nom: "Lent et méthodique",
    texte: "Ne peut pas poursuivre un ennemi en fuite.",
  },
  {
    nom: "Lourd",
    texte:
      "Une Unité entièrement composée de Figurines de Sous-type Lourd gagne +1 en Sang-froid aux Tests pour éviter un Statut Tactique. Une Unité qui inclut la moindre Figurine de Sous-type Lourd ne peut pas Foncer, et n'utilise que sa Caractéristique de Mouvement — sans ajouter son Initiative — pour un Mouvement de Positionnement.",
  },
  {
    nom: "Marcheur",
    texte:
      "Ignore la Règle Spéciale Empoisonnée (X) sauf sur un Jet de Blessure de 6 non modifié, quelle que soit la valeur de X. Peut attaquer avec toutes ses Armes à chaque Attaque de Tir, y compris en Réaction (sans permettre aux Armes dépourvues du Trait Assaut d'attaquer en Attaque de Volée). Compte comme sa Valeur de Points de Vie de Base pour la résolution d'un Combat.",
  },
  {
    nom: "Massif (X)",
    texte: "Compte comme X figurines dans un véhicule (capacité de transport).",
  },
  {
    nom: "Mouvement à couvert",
    texte: "Ignore les malus de mouvement dus aux couverts.",
  },
  {
    nom: "Peur (X)",
    texte:
      "Les unités ennemies à 12 pouces subissent un malus de X à leurs caractéristiques de Commandement, Sang-froid, Volonté et Intelligence.",
  },
  {
    nom: "Unité d'appui (X)",
    texte: "Ne marque que X points de victoire en tenant un objectif.",
  },
  {
    nom: "Âpre Devoir",
    texte:
      "Une figurine avec cette règle ne peut rejoindre que des unités qui l'ont aussi, et réciproquement.",
  },
  {
    nom: "Attaque de Flanc",
    texte:
      "Une unité entièrement composée de figurines avec cette règle peut entrer en jeu depuis les Réserves n'importe où sur le bord de table (hors zone de déploiement adverse et à plus de 7 pouces de l'ennemi).",
  },
  {
    nom: "Autoréparation (X)",
    texte:
      "Bonus aux Jets de Réparation d'un Véhicule : on réussit sur X ou plus, au lieu du 6 habituel.",
  },
  {
    nom: "Bouclier Void (X)",
    texte:
      "Une figurine avec X boucliers void ignore les touches pénétrantes (Dégâts ramenés à 0) tant qu'il lui en reste ; chaque touche pénétrante en consomme un.",
  },
  {
    nom: "Dissimulation (X)",
    texte:
      "Jet de mitigation de dégâts supplémentaire, en plus d'une sauvegarde, réussi sur X ou plus.",
  },
  {
    nom: "Fauchage (X)",
    texte:
      "Si la figurine est en infériorité numérique en Combat, elle gagne un bonus de X Attaques.",
  },
  {
    nom: "Guerrier Éternel (X)",
    texte:
      "Réduit de X les Dégâts de chaque blessure non sauvegardée (minimum 1).",
  },
  {
    nom: "Guerrier-artisan (X)",
    texte:
      "En Phase de Mouvement, peut tenter de réparer ou rétablir une figurine de Type Véhicule/Automate amie à 6 pouces.",
  },
  {
    nom: "Insensible à la Douleur (X)",
    texte:
      "Jet de mitigation de dégâts supplémentaire, en plus d'une sauvegarde, réussi sur X ou plus.",
  },
  {
    nom: "Ligne (X)",
    texte:
      "L'unité contrôle mieux les objectifs : bonus de X Points de Victoire quand elle en contrôle un, et compte plus dans l'Effectif Tactique.",
  },
  {
    nom: "Maître de la Légion",
    texte: "Donne une réaction supplémentaire.",
  },
  {
    // Escouade Iron Havocs (IVe Légion, Iron Warriors) : viseurs
    // spécialisés recoupant flux de données, conditions atmosphériques
    // et mouvements prédictifs des cibles (voir js/unites-data.js).
    nom: "Ferrum Occularis",
    texte:
      "Les Blessures infligées par une Figurine ayant cette Règle Spéciale peuvent ignorer les Sauvegardes de Couvert. Les Sauvegardes de Couvert ne peuvent pas être utilisées contre des blessures non sauvegardées infligées par une Attaque de Tir faite par une Figurine ayant cette Règle Spéciale, si cette Figurine faisait partie d'une Unité restée Stationnaire lors de la Phase de Mouvement précédente de son Joueur en Contrôle.",
  },
  {
    // 0-1 Cohorte de Dominators (IVe Légion, Iron Warriors) : anciens
    // gardes du corps de Perturabo, supplantés par les automates du
    // Cercle de Fer (voir js/unites-data.js).
    nom: "Ceux Jadis Honorés",
    texte:
      "Les Cohortes de Dominators existent au purgatoire, dépouillées des honneurs jadis accordés par leur Primarque et condamnées à servir en première ligne des assauts les plus éprouvants. Autrefois gardes du corps de Perturabo lui-même et tenus en haute estime par leur Primarque et leur Légion, leur échec à la Bataille de Phall les réduisit à l'état misérable dans lequel ils se trouvaient durant l'Hérésie d'Horus. Les automates du Cercle de Fer, qui les avaient remplacés comme garde du corps de Perturabo, leur rappelaient sans cesse leurs échecs lors des premiers combats de l'Hérésie d'Horus et devinrent la cible d'un dédain malveillant. Une Unité qui inclut des Figurines ayant cette Règle Spéciale ne peut jamais être rejointe par une Figurine de Perturabo.",
  },
  {
    // Le Tourmenteur (IVe Légion, Iron Warriors) : Shadowsword converti
    // en centre de commandement mobile de Perturabo (voir
    // js/unites-data.js).
    nom: "Antre du Tyran de Fer",
    texte:
      "Perturabo était connu pour utiliser Le Tourmenteur comme centre de commandement mobile, ses automates gardes du corps se logeant dans des compartiments de transport spécialement modifiés à l'intérieur de sa coque pendant qu'il dirigeait ses forces. Seules les Figurines de Perturabo ou de Domitar-Ferrum peuvent Embarquer sur une Figurine ayant cette Règle Spéciale.",
  },
  {
    // Perturabo, Primarque des Iron Warriors (voir js/unites-data.js) :
    // Réaction propre au Défi.
    nom: "Le Briseur",
    texte:
      "Perturabo s'intéressait rarement aux notions d'honneur sur le champ de bataille pour se consacrer aux sinistres mathématiques du carnage. Même quand un champion ennemi tentait de le provoquer en duel, Perturabo préférait souvent ordonner à ses troupes de crépiter l'impudent de bolts au lieu de s'abaisser à l'abattre lui-même. Cette Réaction permet à une Unité amie de faire une Attaque de Tir ciblant une Figurine en Défi avec Perturabo. Tant qu'une Figurine ayant cette Règle Spéciale est en Défi, son Joueur en Contrôle peut choisir cette Posture : Le Briseur — on ne peut choisir cette Posture qu'à la première Étape de Confrontation d'un Défi. Si elle adopte cette Posture, cette Figurine ne fait pas d'attaques à l'Étape de Frappe qui suit ; à la place, le Joueur en Contrôle de cette Figurine peut choisir une seule Unité amie composée de Figurines ayant le Trait Iron Warriors, située à 12\" de cette Figurine ennemie impliquée dans ce Défi et non Verrouillée en Combat, et faire une Attaque de Tir avec cette Unité. Les attaques se résolvent en tant que Tirs au Jugé, ne peuvent pas utiliser d'Armes ayant la Règle Spéciale Explosion (X) ou la Caractéristique de Portée Souffle, et on ne peut allouer les Blessures de cette Attaque de Tir qu'à la Figurine adverse du Défi.",
  },
  {
    // Perturabo, Primarque des Iron Warriors (voir js/unites-data.js) :
    // Règle Spéciale d'Armée.
    nom: "Sire des Iron Warriors",
    texte:
      "Sur son monde d'adoption, Perturabo était un seigneur de guerre et un stratège hors pair, et il était considéré comme étant un des meilleurs artificiers parmi les Primarques. Cependant, au combat, c'était son implacable sens de la discipline qui influait le plus sur sa Légion, car ceux qui combattaient à ses côtés ne connaissaient que trop bien le prix de l'échec ou la couardise aux yeux du Seigneur de Fer. Si une Figurine ayant cette Règle Spéciale fait partie d'une Armée, le Joueur en Contrôle peut appliquer les Règles Spéciales supplémentaires suivantes à tous les Détachements Principaux, Auxiliaires et d'Apex qui ont le même Trait de Faction que la Figurine ayant cette Règle Spéciale : si au moins quatre Cases de Rôle Tactique Troupes du Détachement Principal de cette Armée sont occupées par des Unités d'Escouade Tactique et/ou d'Escouade Brécheuse, on considère que les Cases d'Organigramme de Force de Rôle Tactique Troupes du Détachement Principal de cette Armée sont toutes des Cases Principales. En outre, si une Figurine ayant cette Règle Spéciale fait partie d'une Armée, on confère la Règle Spéciale suivante à toutes les Figurines de la même Armée qui ont le Trait Infanterie et le Trait Iron Warriors : jusqu'à la fin du premier Tour de Bataille, toutes les Figurines de Type Infanterie de cette Armée qui ont le Trait Iron Warriors ont la Règle Spéciale Sacrifiable (1) ; si elles ont déjà la Règle Spéciale Sacrifiable (X), la Valeur de X augmente de 1.",
  },
  {
    // Cassian Dracos Ressuscité (XVIIIe Légion, Salamanders) : voir
    // js/unites-data.js.
    nom: "Armure Écaille de Drac",
    texte:
      "Vulkan forgea personnellement les plaques de l'armure de Cassian Dracos, lui conférant une robustesse bien supérieure à celle des Dreadnoughts plus ordinaires. Sa surface complexe pouvait résister à la chaleur et aux radiations bien mieux que toute autre armure. Les Blessures portant un Trait Flammes, Plasma, Fuseur ou Volkite allouées à une Figurine ayant cette Règle Spéciale ont leur caractéristique de Dégâts ramenée à 1.",
  },
  {
    // Cassian Dracos Ressuscité (XVIIIe Légion, Salamanders) : voir
    // js/unites-data.js.
    nom: "Murmures d'Isstvan",
    texte:
      "Enseveli sous la surface d'Isstvan V pendant près d'un an, Cassian Dracos fut tourmenté par la solitude et la connaissance de ses propres échecs. À son émergence, il était transformé, doté d'un nouveau pouvoir sur l'animus des machines et des volontés faibles. Cassian Dracos Ressuscité a le Trait Cybertheurge et ne peut utiliser que le Rite Cybertheurgique Infection de Code-Rebut (voir Liber Mechanicum, page 65). Quand ce Rite Cybertheurgique est invoqué pour Cassian Dracos, celui-ci est considéré comme ayant le Trait Hétérodoxe même s'il n'a pas le Trait Renégat.",
  },
  {
    // Escouade des Adhérents (XVIIIe Légion, Salamanders) : voir
    // js/unites-data.js.
    nom: "Credo de la Flamme",
    texte:
      "La signification rituelle de la flamme purificatrice était centrale pour les nombreuses sous-sectes du Culte Promethéen qui émergèrent dans le sillage du Massacre de la Zone de Largage, employées avec des résultats effroyables sur les champs de bataille de l'Hérésie d'Horus. Les Figurines ayant cette Règle Spéciale peuvent faire des Attaques de Volée avec les Armes ayant le Trait Flammes. Toute arme ayant le Trait Flammes que possède une Figurine ayant cette Règle Spéciale gagne aussi le Trait Assaut, et ignore les effets de la Règle Spéciale Limitée (X) lors des Attaques de Volée.",
  },
  {
    // Ætos Dios (VIIe Légion, Imperial Fists) : voir js/unites-data.js.
    nom: "Ætos Praetoria",
    texte:
      "Le Ætos Dios ne peut être inclus que dans une Armée qui inclut également Rogal Dorn. Si le Ætos Dios est inclus dans une Armée de cette façon, Rogal Dorn doit commencer la bataille Embarqué à son bord.",
  },
  {
    // Atramentar Écorchés (VIIIe Légion, Night Lords) : voir
    // js/unites-data.js.
    nom: "Enveloppé de Meurtre",
    texte:
      "Pour les guerriers des Atramentar, aucun acte n'est en dessous d'eux, et tout semblant de combat honorable a depuis longtemps été abandonné. Ne cherchant qu'à achever leur ennemi de la manière la plus douloureuse et la plus indigne possible, ils usent de duperie et de ruse pour porter des attaques perfides et déloyales, ne faisant jamais face à leur adversaire dans un engagement loyal, allant même jusqu'à pousser leurs propres frères devant un coup fatal pour se ménager une contre-attaque. Quand le Joueur en Contrôle désigne comme Cible d'une Charge faite par une Unité entièrement composée de Figurines ayant cette Règle Spéciale une Unité ennemie déjà Verrouillée en Combat, les Figurines ayant cette Règle Spéciale modifient leur Distance de Mouvement de Mise en Place de +1\", jusqu'à un maximum de 6\", jusqu'à la résolution de ce Mouvement de Charge.",
  },
  {
    // Atramentar Écorchés (VIIIe Légion, Night Lords) : voir
    // js/unites-data.js.
    nom: "Fidélité Jurée",
    texte:
      "Les Atramentar n'avaient pas juré fidélité à leur Légion ni à leur Primarque, mais à Sevatar seul. Au combat, ils suivaient ses ordres sans discussion, sans remords ni hésitation. C'était un rare exemple de loyauté au sein d'une Légion réputée pour sa traîtrise et son absence d'honneur. Quand elle est incluse dans une Armée où une Figurine de Sevatar a été sélectionnée dans le Détachement Principal et se trouve sur le champ de bataille, le Joueur en Contrôle d'une Unité Atramentar Écorchés peut toujours utiliser la Caractéristique de Commandement de Base de Sevatar à la place de celle de l'Unité pour tout Test de Commandement de cette Unité.",
  },
  {
    // Autilon Skorr (XXe Légion, Alpha Legion) : voir js/unites-data.js.
    nom: "Consul-Delegatus",
    texte:
      "Les exigences de la Grande Croisade nécessitaient parfois que de jeunes officiers au sein des Légions se voient accorder des niveaux d'autorité extraordinaires pour mener à bien leurs objectifs. Se voyant habituellement confier la juridiction sur des forces plus importantes, voire des forces qui relèveraient normalement du contrôle des plus hauts échelons du commandement ou même des Primarques eux-mêmes, de tels guerriers firent leurs preuves maintes et maintes fois. Une Armée ne peut jamais inclure plus d'une Figurine ayant cette Règle Spéciale. Si une Figurine ayant cette Règle Spéciale occupe une Case de Quartier Général ou d'État-major d'un Détachement de l'Organigramme de Force de Croisade, le Joueur en Contrôle peut choisir un Détachement Apex au lieu du Détachement Auxiliaire habituellement débloqué par cette Case. De plus, une Figurine ayant cette Règle Spéciale compte comme un Choix de Haut Commandement pour toute version de l'Objectif Secondaire Éliminer le Seigneur de Guerre (X).",
  },
  {
    // Cadre de Perturbation Effrit (XXe Légion, Alpha Legion) : voir
    // js/unites-data.js.
    nom: "Hurlement de l'Hydre",
    texte:
      "Projetées depuis des réseaux de perturbation confiés aux équipes d'infiltration avancée d'élite, les Hurlements de l'Hydre sont un ensemble d'ondes ciblées et de signaux perturbateurs sur une multitude de fréquences. Utilisant des systèmes que l'on croit dérivés d'Intelligences Abominables proscrites datant de l'Âge des Ténèbres, ces émissions peuvent submerger les communications, les réseaux de balayage et de coordination ennemis, ce qui, à moins d'être spécifiquement contré, rend inutilisables des pans entiers de l'équipement standard de la Légion. Pour tout Test de Sang-froid ou d'Intelligence fait par une Unité ayant au moins une Figurine à moins de 12\" d'au moins une Figurine ennemie ayant cette Règle Spéciale, le Joueur en Contrôle doit lancer un Dé supplémentaire et défausser le résultat le plus faible.",
  },
  {
    // Escouade d'Assaut Locutarus (XIIIe Légion, Ultramarines) : voir
    // js/unites-data.js.
    nom: "La Lame de la Sagesse",
    texte:
      "La Lame de la Sagesse est une stratégie d'assaut avancée conçue pour la première fois durant la Grande Croisade. Les Locutarus lancent une Charge parfaitement synchronisée contre des ennemis immobilisés par le tir d'une redoutable précision d'unités Ultramarines en soutien mutuel, et anéantissent rapidement leurs adversaires dans un déluge de coups d'épée experts. Les Figurines ayant cette Règle Spéciale gagnent un bonus quand elles sont Verrouillées en Combat avec des Unités ayant des Statuts Tactiques : quand elles sont Verrouillées en Combat avec une Unité qui inclut au moins une Figurine ayant un Statut Tactique quelconque, les Figurines ayant cette Règle Spéciale dans ce Combat gagnent un modificateur supplémentaire de +1 à leur caractéristique d'Attaques jusqu'à la fin de la Phase.",
  },
  {
    // Cenobium de Chevaliers du Cercle Intérieur — Ordre des Griffes
    // Brisées (Ire Légion, Dark Angels) : voir js/unites-data.js.
    nom: "Ordre des Griffes Brisées",
    texte:
      "De tous les guerriers de la Ire Légion, l'Ordre des Griffes Brisées était le plus expérimenté dans la lutte contre les formes biologiques monstrueuses des Rangda, endurci à leur horreur indescriptible. Bien que ces chevaliers eussent vu leur nombre décliner au déclenchement de l'Hérésie d'Horus, leur expérience chèrement acquise du combat contre l'inhumain allait se révéler inestimable. Tant qu'une Figurine ayant cette Règle Spéciale fait partie d'une Unité Verrouillée en Combat avec une Unité ennemie qui inclut une ou plusieurs Figurines de Type Marcheur, de Type Automate ou de Sous-type Maléfique : cette Figurine a sa caractéristique d'Endurance modifiée de +1 ; et pour tout Test de Caractéristique utilisant les caractéristiques de Commandement, Sang-froid, Volonté ou Intelligence de cette Figurine, le Joueur en Contrôle peut ignorer les modificateurs négatifs à cette caractéristique.",
  },
  {
    // Excindio (Ire Légion, Dark Angels) : voir js/unites-data.js.
    nom: "Rage Vengeresse",
    texte:
      "Bien que chaque Excindio soit habituellement maintenu sous contrainte technologique, il est nécessaire au combat de relâcher ces restrictions pour libérer toute sa puissance. S'il est suffisamment endommagé cependant, même les garde-fous stricts imposés par ses contrôleurs peuvent être outrepassés par ses systèmes adaptatifs complexes. La fureur qui en résulte est aussi dangereuse pour ses alliés que pour son ennemi, jusqu'à ce qu'elle puisse être ramenée sous contrôle. Tant qu'une Figurine ayant cette Règle Spéciale a une caractéristique de Points de Vie Actuels de 4 ou moins, à chacune des Phases de Tir de son Joueur en Contrôle, elle doit faire une Attaque de Tir ciblant l'Unité amie ou ennemie la plus proche ayant une Ligne de Vue sur la Figurine. Une telle Attaque de Tir doit utiliser toutes les Armes qui sont à portée d'au moins une Figurine de l'Unité Cible.",
  },
  {
    // Excindio (Ire Légion, Dark Angels) : Type de Figurine, voir
    // js/unites-data.js.
    nom: "Artificia",
    texte:
      "Ces créatures ressemblent extérieurement aux automates du Mechanicum, mais sous leur peau de métal, elles n'ont rien de commun avec eux. Les Artificia ne sont pas de grossiers serviteurs de métal, mais un esprit vivant forgé dans l'acier et conditionné à haïr toute autre forme de vie. Les Figurines de Type Artificia ne peuvent gagner aucun Statut Cybertheurgique, mais peuvent gagner des Statuts Tactiques ou d'autres types d'effets de Statut. Quand elle cible une Unité qui inclut des Figurines de Type Artificia, la Règle Spéciale Empoisonnée (X) ne se déclenche que sur un Test de Blessure dont le résultat est un « 6 » avant application des modificateurs, quelle que soit la Valeur de X de cette variante de la Règle Spéciale.",
  },
  {
    // Cabale Enigmatus de la Firewing (Ire Légion, Dark Angels) : voir
    // js/unites-data.js.
    nom: "Marqué pour la Mort (X)",
    texte:
      "Certaines cohortes de guerriers prennent le champ de bataille avec une cible précise désignée pour destruction. Ces actions peuvent être motivées par un désir de vengeance, pour régler un différend, ou simplement résulter des ordres exprès de leurs supérieurs dans l'intérêt d'une stratégie plus large. À la fin de l'Étape de Déclaration des Réserves de la Mission, le Joueur en Contrôle de toute Unité ayant cette Règle Spéciale peut choisir une Unité de l'Armée du Joueur Adverse : cette Unité devient l'Unité « Marquée ». Une fois par Bataille, le Joueur en Contrôle marque des Points de Victoire supplémentaires égaux à la Valeur de X si une Unité amie ayant cette Règle Spéciale marque des Points de Victoire grâce à la Règle Spéciale Avant-garde (X) quand l'Unité ennemie qui remplit les conditions de la Règle Spéciale Avant-garde (X) est l'Unité Marquée.",
  },
  {
    // Escouade des Chefs de Guerre (XVIe Légion, Sons of Horus) : voir
    // js/unites-data.js.
    nom: "Honneur Avant Tout",
    texte:
      "Les Chefs de Guerre des Sons of Horus avaient gagné leur rang par la loyauté, l'honneur et une violence sans merci, leur dévouement et leur qualité éprouvés contre d'innombrables ennemis sans jamais être pris en défaut. Leur devoir était de veiller à ce que nul n'interfère quand leur seigneur cherchait à prouver sa suprématie en combat singulier, abattant quiconque chercherait à porter un coup déshonorant contre celui qu'ils protégeaient. Quand une Figurine ayant rejoint une Unité qui inclut des Figurines ayant cette Règle Spéciale prend part à un Défi, toutes les Figurines de cette Unité ayant cette Règle Spéciale gagnent un bonus de +1 à tous les Tests de Blessure faits durant la Sous-phase de Frappe suivante de cette Phase d'Assaut.",
  },
  {
    // Escouade Terminator Morlock (Xe Légion, Iron Hands) : voir
    // js/unites-data.js.
    nom: "Destinée de la Gorgone",
    texte:
      "Si la mort de Ferrus Manus éveilla une froide fureur dans le cœur de tous les Iron Hands, ceux de sa suite Avernienne la ressentirent plus intensément encore, cherchant les membres de la IIIe Légion pour exercer leur vengeance sur eux. Quand elle fait partie d'une Armée qui n'inclut pas Ferrus Manus, une Figurine ayant cette Règle Spéciale a la Règle Spéciale Haine (Emperor's Children).",
  },
  {
    // Cabale de Numérologistes (XVe Légion, Thousand Sons) : voir
    // js/unites-data.js.
    nom: "Ordre des Numérologistes",
    texte:
      "Les Numérologistes des Thousand Sons étaient membres de l'Ordre de la Ruine, qui remplissait un rôle similaire à celui des Techmarines dans les autres Légions. Ils étaient en outre réputés pour leur acuité tactique, élaborant des stratégies et influençant le cours de la bataille. Une grande part de leur succès pouvait être attribuée aux capacités psychiques des Numérologistes, qui employaient à la fois des capacités de divination et de télépathie pour prédire les mouvements ennemis et relayer ces changements à leurs alliés. Une Figurine ayant cette Règle Spéciale possède les Pouvoirs Psychiques suivants, mais une Unité qui inclut une Figurine ayant cette Règle Spéciale ne peut pas se voir attribuer d'Arcane Prosperine comme normalement. De plus, elle a les Traits Télépathe et Devin : Bénédiction de Prescience (Discipline Divination), Explosion Mentale (Discipline Télépathie).",
  },
  {
    // Cabale de Numérologistes (XVe Légion, Thousand Sons) : voir
    // js/unites-data.js.
    nom: "Gardes de Vie",
    texte:
      "Habituellement déployés avec les éléments arrière de la XVe Légion durant la Grande Croisade, les Numérologistes virent un service bien plus fréquent en première ligne durant l'Hérésie d'Horus. Pour minimiser les risques, ils allaient au combat accompagnés d'un cadre de Gardes de Vie spécialisés chargés de les protéger pendant qu'ils vaquaient à leurs tâches. Tant qu'une Figurine Numérologiste fait partie d'une Unité qui inclut des Figurines ayant cette Règle Spéciale, les Blessures causées dans le cadre d'une Attaque de Tir faite par une Arme ou une Figurine ayant la Règle Spéciale Précision (X) ne peuvent pas être allouées à cette Figurine Numérologiste.",
  },
  {
    // Rylanor l'Inébranlable (IIIe Légion, Emperor's Children) : voir
    // js/unites-data.js.
    nom: "Haine Vengeresse",
    texte:
      "Pour sa loyauté envers l'Empereur, la IIIe Légion désigna Rylanor pour être détruit, mais il refusa de mourir sur Isstvan. Au lieu de cela, sa haine se distilla, et son géniteur en vint à incarner la trahison qu'il avait subie. Rylanor peut prendre part à un Défi quand Fulgrim est le Provocateur. Si une Figurine ayant cette Règle Spéciale est Verrouillée en Combat avec une Unité ennemie qui inclut Fulgrim ou Fulgrim Transfiguré, la Figurine ayant cette Règle Spéciale est considérée comme éligible pour prendre part à un Défi. Dans un tel Défi, si Fulgrim ou Fulgrim Transfiguré est le Provocateur, Rylanor doit être le Provoqué.",
  },
  {
    // Escouade Tueurs de Soleils (IIIe Légion, Emperor's Children) :
    // voir js/unites-data.js.
    nom: "Proie Désignée",
    texte:
      "Les escouades Tueurs de Soleils ne prenaient jamais le champ de bataille sans cibles définies et, quelle que soit l'issue de la bataille, elles considéraient comme un échec de ne pas abattre ces ennemis précis. À de rares occasions, plusieurs escouades de Tueurs de Soleils opéraient dans le même secteur, rivalisant entre elles pour traquer et éliminer le plus grand ennemi. Une fois par Bataille, avant de faire une Attaque de Tir lors de la Phase de Tir de son Joueur en Contrôle, le Joueur en Contrôle d'une Unité ayant cette Règle Spéciale qui n'a pas Bougé lors de la Phase de Mouvement précédente peut choisir une Unité ennemie de Type Véhicule comme Proie Désignée de cette Unité. Quand l'Unité ayant cette Règle Spéciale fait une Attaque de Tir qui cible une Unité ennemie sélectionnée comme sa Proie Désignée, la caractéristique de Capacité de Tir de toutes les Figurines ayant cette Règle Spéciale dans l'Unité faisant l'Attaque de Tir est modifiée de +1 pendant la durée de la Phase en cours.",
  },
  {
    // Meute de Chasseurs Jorlund (VIe Légion, Space Wolves) : voir
    // js/unites-data.js.
    nom: "Tempête Ravageuse",
    texte:
      "Guidées par une foi inébranlable dans les augures des voyants de guerre, les Meutes de Chasseurs Jorlund accompagnent les forces d'avant-garde de la VIe Légion et devancent la ligne de bataille pour incinérer leurs ennemis d'une flamme purificatrice. Quand une Unité qui inclut des Figurines ayant cette Règle Spéciale est sélectionnée pour faire une Attaque de Tir, si cinq Figurines ou plus font des attaques avec des lance-flammes légers, ces lance-flammes légers gagnent la Règle Spéciale Panique (1) jusqu'à la résolution de cette Attaque de Tir.",
  },
  {
    nom: "Médic (X)",
    texte:
      "Détermine la difficulté des Jets de Rétablissement (le nombre à atteindre) pour cette unité, sans en accorder par elle-même.",
  },
  {
    nom: "Négligence",
    texte: "L'unité ne peut jamais contrôler ni contester un Objectif.",
  },
  {
    nom: "Officier de ligne (X)",
    texte:
      "Permet de sélectionner un nombre de Détachements Auxiliaires égal à X pour la Case d'État-major concernée, au lieu d'un seul.",
  },
  {
    nom: "Orage de Feu",
    texte:
      "L'unité n'est pas limitée au tir au jugé lors d'une attaque de volée : elle tire normalement.",
  },
  {
    nom: "Ouverture à l'Impact",
    texte:
      "Les portes du véhicule sont ouvertes dès son déploiement ; toute unité embarquée doit débarquer aussitôt, et personne ne peut plus embarquer ensuite.",
  },
  {
    nom: "Protocoles de Tir (X)",
    texte:
      "La figurine peut attaquer avec X armes de tir différentes au lieu d'une seule.",
  },
  {
    nom: "Sacrifiable (X)",
    texte:
      "Réduit de X (minimum 1) les Points de Victoire marqués par l'adversaire quand cette unité est détruite.",
  },
  {
    nom: "Transport Léger",
    texte: "Ne peut pas transporter de figurines ayant la règle Massif (X).",
  },
  {
    nom: "Véhicule d'Assaut",
    texte:
      "Une unité qui débarque de ce véhicule peut charger ce tour-ci sans que la charge soit désordonnée.",
  },
  {
    nom: "Véhicule d'Assaut Orbital",
    texte: "Doit obligatoirement se déployer en Frappe en profondeur.",
  },
  {
    nom: "Vif (X)",
    texte:
      "Une unité entièrement composée de figurines avec cette règle gagne un bonus de X pouces en Foncer, et de X au Jet de Charge.",
  },
  {
    nom: "Bouclier d'Abordage",
    texte:
      "Confère une Sauvegarde Invulnérable de 5+, le Trait Bouclier et le Sous-type Lourd.",
  },
  {
    nom: "Bouclier de Combat",
    texte:
      "Confère une Sauvegarde Invulnérable de 5+ contre les attaques de mêlée, et un bonus de +1 au Jet de Concentration en Défi.",
  },
  {
    nom: "Champ de Diffraction Thermique",
    texte:
      "Réduit de 1 la Force de toute touche infligée par une arme ayant le trait Laser, Plasma, Fusion ou Flammes.",
  },
  {
    nom: "Cognis-signum",
    texte:
      "Au lieu de tirer, la figurine peut tenter un test d'Intelligence pour désigner une unité ennemie visible : la prochaine attaque de tir de la phase utilisant une arme Barrage (X) contre cette cible touche normalement, même sans ligne de vue.",
  },
  {
    nom: "Contrôleur de Cortex",
    texte:
      "Permet aux figurines de Type Automate de l'unité de déclarer des Réactions, ce qui leur est normalement interdit.",
  },
  {
    nom: "Cyber-familier",
    texte: "Bonus de −2 au résultat des Tests d'Intelligence de la figurine.",
  },

  /* --- Arsenal de la Raven Guard (XIXe Légion) : Corvus Corax, Kaedes
     Nex, Escouade de Mor Deythan, Escouade de Furies Noires (voir
     js/unites-data.js, unités réservées à cette Légion). --- */
  {
    nom: "Frappe Fatale",
    texte:
      "Une fois par Bataille, si une Unité ayant cette Règle Spéciale est restée à l'Arrêt à la Phase de Mouvement précédente, le Joueur en Contrôle peut lui faire exécuter une Frappe Fatale à la Phase de Tir : on ajoute +2 à la Capacité de Tir de toutes les Figurines de l'Unité ayant cette Règle Spéciale, pour la durée de la Phase en cours.",
  },
  {
    nom: "La Corneille Sanglante",
    texte:
      "Kaedes Nex utilise toujours sa Capacité de Tir entière : ses Attaques de Tir ne sont jamais réduites au tir au jugé, et sa Capacité de Tir ne peut jamais être diminuée en dessous de 6 (sauf contre une cible de Sous-type Aéronef). Les Jets de Mitigation de Dégâts de Dissimulation tentés contre les Blessures qu'il inflige par Tir ne réussissent que sur 6+, quelle que soit la version de Dissimulation (X) de la Figurine Cible.",
  },
  {
    nom: "Le Seigneur Ombreux",
    texte:
      "Posture disponible à Corvus Corax tant qu'il est Engagé en Défi : il se bat comme s'il n'avait perdu aucun Point de Vie (les modificateurs négatifs au Jet de Concentration dus à une Caractéristique de Points de Vie inférieure à sa Valeur de Base sont ignorés), à condition de choisir Talionis au début de l'Étape de Concentration. S'il inflige au moins une Touche réussie avec Talionis à l'Étape de Frappe en tant que Joueur Actif, il peut passer à l'Étape de Gloire dès la résolution de l'Étape 4, même sans l'Avantage en Défi.",
  },
  {
    nom: "Sire de la Raven Guard",
    texte:
      "Tant qu'une Figurine ayant cette Règle Spéciale fait partie de l'Armée : si au moins quatre Cases de Rôle Tactique Troupes du Détachement Principal sont occupées par des Escouades Tactiques et/ou d'Assaut, toutes les Cases Troupes de ce Détachement sont considérées comme des Cases Principales ; et jusqu'à la fin du premier Tour de Bataille, toute Figurine de Type Infanterie de l'Armée ayant le Trait Raven Guard gagne la Règle Spéciale Mouvement à Couvert.",
  },
  {
    nom: "Spectres",
    texte:
      "Avantage Principal réservé à une Unité de Rôle Tactique Troupes entièrement composée de Figurines ayant le Trait Raven Guard occupant une Case Principale : ses Figurines gagnent la Règle Spéciale Spectres — après avoir Foncé, un Test de Volonté réussi rend Désordonnée toute Charge ciblant l'Unité au tour de Joueur suivant ; en cas d'échec, l'Unité gagne le Statut Tactique Sonnée à la place.",
  },
  {
    nom: "Caméléolin",
    texte:
      "Si une Unité incluant au moins une Figurine dotée de Caméléolin est visée par une Attaque de Tir dont la distance à l'Unité Attaquante est d'au moins 12 pouces, ses Figurines gagnent la Règle Spéciale Dissimulation (5+), ou améliorent de +1 (jusqu'à un maximum de Dissimulation (4+)) toute version de Dissimulation (X) qu'elles ont déjà par ailleurs.",
  },
  {
    nom: "Réacteurs modèle Corvidé",
    texte:
      "Fixe à 14 la Caractéristique de Mouvement de la Figurine équipée, et remplace toute Règle Spéciale Massif (X) par Massif (3). Les Jets de Terrain Dangereux qu'elle doit faire sont automatiquement réussis.",
  },

  /* --- Arsenal des White Scars (Ve Légion) : Jaghatai Khan, Qin Xa,
     Hibou Khan, Devin de l'Orage, Keshig d'Or, Speeder d'Assaut
     Kyzagan, Keshig d'Ébène (voir js/unites-data.js, unités réservées
     à cette Légion). --- */
  {
    nom: "Chercheur d'Expiation",
    texte:
      "Posture disponible à Hibou Khan tant qu'il est Engagé en Défi : si cette Posture est choisie et qu'il est réduit à 0 Point de Vie à l'Étape 4 de l'Étape de Frappe, son Joueur en Contrôle jette un dé — sur 4+, il n'est pas Retiré comme Perte et demeure Engagé en Défi avec une Caractéristique de Points de Vie de 1, et son Joueur en Contrôle gagne l'Avantage en Défi.",
  },
  {
    nom: "Élu du Khagan",
    texte:
      "Garantit l'arrivée d'une Unité gardée en Réserves : une fois par Bataille, au début de la Sous-phase de Réserves de la Phase de Mouvement, le Joueur en Contrôle de cette Figurine peut choisir une seule Unité en Réserves composée uniquement de Figurines ayant le Trait White Scars — les Jets de Réserves faits pour cette Unité à cette Sous-phase sont automatiquement réussis.",
  },
  {
    nom: "Mort par Mille Coupures",
    texte:
      "Posture disponible tant qu'une Figurine ayant cette Règle Spéciale est Engagée en Défi : à l'Étape de Frappe, la Force des attaques faites par la Figurine ennemie est modifiée de -1 si la Valeur Actuelle de sa Caractéristique de Points de Vie est inférieure à sa Valeur de Base (sans jamais réduire la Force d'une attaque à une Valeur inférieure à 1).",
  },
  {
    nom: "Sire des White Scars",
    texte:
      "Tant qu'une Figurine ayant cette Règle Spéciale fait partie de l'Armée : si au moins quatre Cases de Rôle Tactique Troupes du Détachement Principal sont occupées, ses Cases de Rôle Tactique Transport peuvent être échangées contre des Cases de Rôle Tactique Reco occupées par des Unités de Land Raider Explorator ; et jusqu'à la fin du premier Tour de Bataille, toute Figurine de Type Infanterie ou Parangon de l'Armée ayant le Trait White Scars gagne la Règle Spéciale Vif (2).",
  },
  {
    nom: "Appel de l'Orage",
    texte:
      "Discipline Psychique des White Scars : une Figurine qui la possède gagne la Règle Spéciale Mouvement à Couvert, l'Arme Psychique Foudre Invisible, le Pouvoir Psychique Appel du Vent, et le Trait « Devin de l'Orage ».",
  },
  {
    nom: "Appel du Vent",
    texte:
      "Pouvoir Psychique (Bénédiction), manifesté à la Phase de Mouvement : le Focus est une Figurine avec le Trait Devin de l'Orage de l'Unité qui va se Déplacer ; la Cible est une Unité amie entièrement composée de Figurines ayant le Trait White Scars, à 12 pouces et en Ligne de Vue du Focus. En cas de réussite, l'Unité Cible ne peut pas Foncer ce tour-ci, mais la Caractéristique de Mouvement de chacune de ses Figurines est modifiée d'une valeur égale à sa propre Caractéristique d'Initiative pour son Déplacement normal de cette Phase.",
  },
  {
    nom: "Les Sagyar Mazan",
    texte:
      "Avantage Principal réservé à une Unité entièrement composée de Figurines ayant le Trait White Scars et de Type Infanterie ou Cavalerie occupant une Case Principale : ses Figurines gagnent la Règle Spéciale Sacrifiable (2).",
  },
  {
    nom: "Cyber-faucon",
    texte:
      "Équipement (+10 Points par Figurine) réservé à une Figurine de Sous-type État-major ayant le Trait White Scars : toutes les Figurines d'une Unité incluant au moins un cyber-faucon gagnent la Règle Spéciale Mouvement à Couvert.",
  },

  /* --- Arsenal des Blood Angels (IXe Légion) : Sanguinius, Raldoron,
     Dominion Zephon, Aster Crohne, Paladins Écarlates, Dreadnought
     Contemptor-Incaendius, Les Larmes de l'Ange (voir js/unites-data.js,
     unités réservées à cette Légion). --- */
  {
    nom: "Propulseur Incaendius",
    texte:
      "Quand elle Fonce, une Figurine ayant cette Règle Spéciale gagne le Sous-type Antigrav pour la durée de cette Phase de Mouvement.",
  },
  {
    nom: "Le Sang Perdure",
    texte:
      "Tant que l'Unité dont fait partie une Figurine ayant cette Règle Spéciale est Verrouillée en Combat avec une ou des Unités ennemies totalisant plus de Figurines qu'elle, une Figurine ayant cette Règle Spéciale gagne la Règle Spéciale Insensible à la Douleur (5+). Si l'ennemi est plus de deux fois plus nombreux, les Figurines gagnent à la place Insensible à la Douleur (4+). Une Figurine qui a rejoint l'Unité ne gagne pas cette Règle et ne compte pas pour le calcul du sous-nombre.",
  },
  {
    nom: "Bouclier Énergétique Modèle Coriolis",
    texte:
      "Quand on alloue une Blessure à une Figurine dotée d'un bouclier énergétique modèle Coriolis, la Caractéristique de Dégâts de la Blessure Non Sauvegardée est modifiée de -1 (jusqu'à un minimum de 1). De plus, une Figurine dotée d'un bouclier énergétique modèle Coriolis gagne le Trait Bouclier.",
  },
  {
    nom: "Le Fantôme de Saiph",
    texte:
      "La première fois au cours d'une Bataille qu'une Figurine ayant cette Règle Spéciale est réduite à 0 Point de Vie avant de Retirer cette Figurine comme Perte, le Joueur en Contrôle jette un dé. Sur un résultat de 4+, cette Figurine n'est pas Retirée comme Perte et sa Caractéristique de Points de Vie Actuelle est fixée à 1.",
  },
  {
    nom: "Archein de Sagesse",
    texte:
      "Posture disponible tant qu'une Figurine ayant cette Règle Spéciale est Engagée en Défi : si elle est choisie, le Joueur en Contrôle de cette Figurine gagne un modificateur positif à son Jet de Concentration égal au nombre de Jets de Touche que son adversaire a réussi à la précédente Étape de Frappe du Défi en cours (sans effet si aucune Étape de Frappe n'a encore été résolue).",
  },
  {
    nom: "Descente Angélique",
    texte:
      "Posture disponible tant qu'une Figurine ayant cette Règle Spéciale est Engagée en Défi, uniquement avant le premier Jet de Concentration d'un Défi et seulement si la Figurine a fait une Charge réussie à la même Phase d'Assaut : à l'Étape de Concentration suivante, le Joueur en Contrôle gagne un modificateur positif au Jet de Concentration égal à la variante de Massif (X) que possède la Figurine ennemie Engagée en Défi avec elle.",
  },
  {
    nom: "Sire des Blood Angels",
    texte:
      "Tant qu'une Figurine ayant cette Règle Spéciale fait partie de l'Armée : si au moins quatre Cases de Rôle Tactique Troupes du Détachement Principal sont occupées par des Escouades d'Assaut, toutes les Cases d'Organigramme de Force de Rôle Tactique Troupes de ce Détachement sont considérées comme des Cases Principales. En outre, toutes les Figurines de la même Armée ayant le Trait Blood Angels et la Règle Spéciale Frappe en Profondeur gagnent : une fois par Tour, quand le Joueur en Contrôle d'une Figurine ayant le Trait Blood Angels et la Règle Spéciale Frappe en Profondeur fait un Jet de Réserves pour une Unité composée uniquement de Figurines qui ont le Trait Blood Angels, ce Joueur a le droit de modifier ce Jet de +1. S'il applique ce modificateur, il doit déployer l'Unité concernée selon la Règle Spéciale Frappe en Profondeur avant de faire le Jet de Réserves.",
  },
  {
    nom: "Revenants",
    texte:
      "Avantage Principal réservé à une Unité entièrement composée de Figurines ayant le Trait Blood Angels occupant une Case Principale : ses Figurines gagnent la Règle Spéciale Peur (1).",
  },

  /* --- Arsenal des World Eaters (XIIe Légion) : Angron, Angron
     Transfiguré, Khârn le Sanglant, Lotara Sarrin, Escouade Saccageuse
     (voir js/unites-data.js, unités réservées à cette Légion). --- */
  {
    nom: "Seigneur des Sables Écarlates",
    texte:
      "Angron peut livrer plusieurs Défis successifs en un Tour. Au début de l'Étape de Gloire d'un Défi dont le Protagoniste est une Figurine ayant cette Règle Spéciale, avant de résoudre ladite Étape de Gloire, le Joueur en Contrôle de la Figurine ayant cette Règle Spéciale a le droit de revenir immédiatement à l'Étape de Déclaration de Défi afin de déclarer un autre Défi. Les Figurines ennemies qui ont déjà combattu en Défi à cette Sous-phase ne sont pas éligibles à participer à ce Défi supplémentaire. Quand on résout l'Étape de Gloire à cette Sous-phase de Défi, les joueurs gagnent des Points de Résolution de Combat pour l'ensemble des Défis résolus au cours de cette Sous-phase.",
  },
  {
    nom: "Sire des World Eaters",
    texte:
      "Le Joueur en Contrôle peut appliquer les Règles Spéciales supplémentaires suivantes à tous les Détachements Principaux, Auxiliaires et d'Apex World Eaters de son Armée, tant qu'une Figurine ayant cette Règle Spéciale en fait partie : si au moins quatre Cases de Rôle Tactique Troupes du Détachement Principal de cette Armée sont occupées par des Unités d'Escouade d'Assaut et/ou Nettoyeuse, on les considère comme des Cases Principales. Jusqu'à la fin du premier Tour de Bataille, toutes les Figurines de Type Infanterie ou Parangon qui ont le Trait World Eaters ont la Règle Spéciale Vif (2).",
  },
  {
    nom: "Calme et Posée",
    texte:
      "Une Unité rejointe par Lotara Sarrin peut utiliser ses Caractéristiques pour ôter des Statuts Tactiques. Si une Unité inclut une Figurine ayant cette Règle Spéciale, à la Phase de Début de son Tour en tant que Joueur Actif, le Joueur en Contrôle peut faire un Test pour retirer un seul Statut à toutes les Figurines de l'Unité qui inclut la Figurine ayant cette Règle Spéciale. On fait ce Test sous la Caractéristique appropriée de la Figurine ayant cette Règle Spéciale (à savoir le Sang-froid, sauf pour retirer En Déroute auquel cas c'est le Commandement).",
  },
  {
    nom: "L'Ombre du Conqueror",
    texte:
      "Si une Figurine ayant cette Règle Spéciale fait partie du Détachement Principal de cette Armée et se trouve sur le Champ de Bataille, à la Sous-phase des Effets de la Phase de Début, le Joueur en Contrôle de la Figurine ayant cette Règle Spéciale peut faire un Test d'Intelligence pour ladite Figurine. Si le Test est réussi, le Joueur en Contrôle peut choisir une des options suivantes : Coordonner — une fois à ce Tour, avant de faire un Jet de Réserves pour une Unité en Réserves Aériennes, le Joueur en Contrôle peut modifier de +1 le résultat de ce Jet de Réserves. Annihiler — une fois à la prochaine Phase de Mouvement adverse, le Joueur en Contrôle peut effectuer la Réaction Avancée Canons du Conqueror : le Joueur Réactif peut la déclarer à l'Étape 2 de la Sous-phase de Déplacement si une Unité ennemie finit un Déplacement à 24 pouces et en Ligne de Vue d'une Figurine d'une Unité sous son contrôle qui comprend une Figurine ayant cette Règle Spéciale (Coût : 3 Points de Réactions ; Cible : l'Unité dont le Déplacement déclenche la Réaction). Le Joueur Réactif fait alors une Attaque de Tir contre l'Unité Cible avec le profil Canons du Conqueror (24, 1, 10, 3, 3 — Barrage (2), Explosion (7\"), Brèche (5+), Assaut), dont le Jet de Touche est automatiquement raté ; une fois cette Attaque entièrement résolue, retrait des Pertes inclus, le Joueur Actif finit de résoudre le Déplacement de l'Unité Cible s'il y a lieu.",
  },

  /* --- Arsenal des Salamanders (XVIIIe Légion) : Vulkan, Escouade
     Pyroclaste, Escouade Terminator Pyrodracs (voir js/unites-data.js,
     unités réservées à cette Légion). --- */
  {
    nom: "Écaille de Drac",
    texte:
      "Équipement (+10 Points par Figurine) réservé à une Figurine de Sous-type État-major ou Champion ayant le Trait Salamanders : on fixe à 1 la Caractéristique de Dégâts des Blessures ayant le Trait Flammes, Plasma, Fusion ou Volkite allouées à une Figurine dotée d'Écaille de Drac.",
  },
  {
    nom: "Le Devoir Avant la Mort",
    texte:
      "Avantage Principal réservé à une Unité entièrement composée de Figurines ayant le Trait Salamanders et le Rôle Tactique Troupes occupant une Case Principale : ses Figurines gagnent la Règle Spéciale Insensible à la Douleur (6+).",
  },
  {
    nom: "Le Feu Inextinguible",
    texte:
      "Posture disponible tant qu'une Figurine ayant cette Règle Spéciale est Engagée en Défi : le Joueur en Contrôle de cette Figurine ne peut appliquer aucun modificateur positif au Jet de Concentration à l'Étape 4 de l'Étape de Frappe. Cependant, si cette Figurine n'est pas réduite à 0 Point de Vie avant que les joueurs reprennent l'Étape 2 de la procédure de Défi ou qu'ils passent à l'Étape de Gloire, elle augmente de +D3 la Valeur de sa Caractéristique de Points de Vie Actuelle, jusqu'à concurrence de sa Caractéristique de Points de Vie de Base. Aucun Point de Vie regagné en vertu de cette Règle Spéciale n'affecte le nombre de PV que l'Adversaire a fait perdre pour la Résolution de Combat.",
  },
  {
    nom: "Sire des Salamanders",
    texte:
      "Si une Figurine ayant cette Règle Spéciale fait partie d'une Armée, le Joueur en Contrôle peut appliquer les Règles Spéciales supplémentaires suivantes à tous les Détachements Principaux, Auxiliaires et d'Apex ayant le même Trait de Faction que cette Figurine : si au moins quatre Cases de Rôle Tactique Troupes du Détachement Principal de cette Armée sont occupées et qu'au moins une Figurine de chacune des Unités qui occupent ces Cases a reçu comme amélioration une Arme Forgée, toutes les Cases d'Organigramme de Force de Rôle Tactique Troupes du Détachement Principal sont considérées comme des Cases Principales. En outre, jusqu'à la fin du premier Tour de Bataille, le Joueur en Contrôle peut ignorer tous les modificateurs négatifs aux Caractéristiques de Commandement, de Volonté, de Sang-froid et d'Intelligence de toutes les Figurines de la même Armée ayant le Trait Salamanders.",
  },

  /* --- Arsenal des Emperor's Children (IIIe Légion) : Seigneur
     Commandant Eidolon, Capitaine Lucius, Escouade Terminator Phénix
     (voir js/unites-data.js, unités réservées à cette Légion). --- */
  {
    nom: "Hurleurs soniques",
    texte:
      "Équipement réservé aux Figurines ayant les Traits Emperor's Children et Renégat : quand une Unité qui comprend la moindre Figurine dotée de hurleurs soniques fait un Mouvement de Charge, l'Unité Cible de la Charge en question ne peut pas effectuer de Réactions avant que la Procédure de Charge soit terminée.",
  },
  {
    nom: "La Lame Exemplaire",
    texte:
      "Lucius profite davantage de la Posture Parangon d'Excellence : si une Figurine ayant cette Règle Spéciale adopte cette Posture, on ajoute un Modificateur de +4 au Jet de Concentration au lieu de +2.",
  },
  {
    nom: "Adresse Inégalée",
    texte:
      "Quand elle est Verrouillée en Combat, une Unité qui inclut au moins une Figurine ayant cette Règle Spéciale peut appliquer une Règle Spéciale de plus jusqu'à la fin de la Phase : à la fin de la Sous-phase de Charge, si elle est Verrouillée en Combat avec une ou plusieurs Unités ennemies, son Joueur en Contrôle peut choisir un des effets suivants — La Frappe Parfaite : jusqu'à la fin de cette Phase, la Caractéristique de Capacité de Combat de chaque Figurine de l'Unité ayant cette Règle Spéciale est considérée supérieure d'un point à la normale pour déterminer le résultat dont elle a besoin pour Toucher à l'Étape de Frappe de la Sous-phase de Défi ou à l'Étape Faire les Jets de Touche de l'Étape Résoudre un Rang d'Initiative (sans effet sur les Jets de Touche faits contre elle). La Garde Parfaite : jusqu'à la fin de cette Phase, la Caractéristique de Capacité de Combat de chaque Figurine de l'Unité ayant cette Règle Spéciale est considérée supérieure d'un point à la normale pour déterminer le résultat dont une Figurine adverse a besoin pour la Toucher à l'Étape de Frappe de la Sous-phase de Défi ou à l'Étape Faire les Jets de Touche de l'Étape Résoudre un Rang d'Initiative (sans effet sur les Jets de Touche faits pour ses propres attaques).",
  },

  /* --- Arsenal des Imperial Fists (VIIe Légion) : Rogal Dorn,
     Sigismund, Fafnir Rann, Evander Garrius, Camba Diaz, Alexis Polux,
     Frères Templiers, Escouade de Gardiens du Phalanx (voir
     js/unites-data.js, unités réservées à cette Légion). --- */
  {
    nom: "Sire des Imperial Fists",
    texte:
      "Si une Figurine ayant cette Règle Spéciale fait partie d'une Armée, le Joueur en Contrôle peut appliquer les Règles Spéciales supplémentaires suivantes à tous les Détachements Principaux, Auxiliaires et d'Apex ayant le même Trait de Faction que la Figurine qui a cette Règle Spéciale : si au moins quatre Cases de Rôle Tactique Troupes du Détachement Principal de cette Armée sont occupées par des Escouades Tactiques et/ou des Escouades Brécheuses, toutes les Cases d'Organigramme de Force de Rôle Tactique Troupes du Détachement Principal sont considérées comme des Cases Principales. En outre, si une Figurine ayant cette Règle Spéciale fait partie d'une Armée, toutes les Figurines de Type Infanterie qui ont le Trait Imperial Fists gagnent la Règle Spéciale Défenses Préparées : jusqu'à la fin du premier Tour de Bataille, toutes les Figurines de Type Infanterie de cette Armée qui ont le Trait Imperial Fists ont une Sauvegarde de Couvert de 5+ tant qu'elles se trouvent dans la Zone de Déploiement de leur Joueur en Contrôle.",
  },
  {
    nom: "Rempart de l'Imperium",
    texte:
      "Posture qui permet à Rogal Dorn de se battre sur la défensive. Tant qu'une Figurine ayant cette Règle Spéciale est Engagée en Défi, son Joueur en Contrôle peut choisir cette Posture : Rempart de l'Imperium — tant que cette Posture est choisie, les Jets de Blessure faits contre la Figurine adoptant cette Posture qui donnent un résultat non modifié de 1, 2, 3 ou 4 sont toujours des échecs, quelle que soit la Caractéristique de Force d'une Touche et quelles que soient les Règles Spéciales qui fixent le Nombre Cible pour les Jets de Blessure.",
  },
  {
    nom: "Tueur de Rois",
    texte:
      "Le Joueur en Contrôle de Sigismund doit lancer un Défi si c'est possible, et il choisit quel adversaire le relève. À la Sous-phase de Défi du Joueur en Contrôle, si Sigismund est éligible, il doit être déclaré Protagoniste. S'il y a dans un Combat plus d'une Figurine qui doit être le Protagoniste sous le contrôle du Joueur Actif, celui-ci doit choisir Sigismund comme Protagoniste. De plus, quand le Joueur en Contrôle lance un Défi pour Sigismund (y compris au cours de la Réaction Avancée Intervention Héroïque), il peut choisir l'Antagoniste parmi les Figurines éligibles de l'Adversaire quelconque. Si, pour une raison quelconque, la Figurine ennemie choisie ne peut pas être l'Antagoniste, le Joueur en Contrôle de Sigismund gagne un nombre de Points de Résolution de Combat égal à la Caractéristique de Points de Vie de Base de la Figurine ennemie choisie qui n'est pas devenue l'Antagoniste, puis le Joueur en Contrôle de Sigismund peut choisir une autre Figurine éligible pour relever le Défi.",
  },
  {
    nom: "Champion de la Mort",
    texte:
      "Sigismund porte des attaques plus meurtrières quand cette Posture est choisie. Tant qu'une Figurine ayant cette Règle Spéciale est Engagée en Défi, son Joueur en Contrôle peut choisir cette Posture : Champion de la Mort — si cette Posture est choisie, les attaques faites par cette Figurine à l'Étape de Frappe suivante ont la Règle Spéciale Touche Critique (5+).",
  },
  {
    nom: "Maître du Bouclier",
    texte:
      "Rann est réputé pour son talent singulier à combiner l'emploi de ses haches et d'un bouclier. Fafnir Rann ne subit pas de malus en Défi du fait qu'il porte un bouclier. Le Joueur en Contrôle d'une Figurine ayant cette Règle Spéciale ne subit pas le malus de -1 aux Jets de Concentration dû au fait que cette Figurine est de Sous-type Lourd.",
  },
  {
    nom: "L'Impôt du Bourreau",
    texte:
      "Aussi irrésistible en attaque qu'inflexible en défense, Rann est exceptionnellement agressif pour un membre de la VIIe Légion : même sur la défensive, l'ennemi n'est pas à l'abri du courroux vengeur de son assaut. Fafnir Rann peut subir un modificateur négatif au Jet de Concentration en échange d'attaques améliorées. Tant qu'une Figurine ayant cette Règle Spéciale est Engagée en Défi, son Joueur en Contrôle peut choisir cette Posture : L'Impôt du Bourreau — quand cette Posture est choisie, le Joueur en Contrôle doit jeter un Dé de plus à l'Étape de Concentration et défausser le résultat le plus élevé. Ses Attaques faites à l'Étape de Frappe suivante gagnent la Règle Spéciale Touche Critique (6+).",
  },
  {
    nom: "Les Atours du Tyran",
    texte:
      "Équipement réservé à Evander Garrius : l'armure Terminator Cataphractii dite des Atours du Tyran offre une des meilleures protections accessibles à un seigneur des Legiones Astartes, ses systèmes internes injectant directement des antalgiques dans le flux sanguin du porteur pour atténuer la souffrance que lui causent ses anciennes blessures. Evander Garrius gagne un Jet de Mitigation de Dégâts quand il est Engagé en Défi. Une Figurine ayant cette Règle Spéciale bénéficie de la Règle Spéciale Insensible à la Douleur (5+) contre les Blessures subies quand elle est Engagée en Défi.",
  },
  {
    nom: "La Ligne Intacte",
    texte:
      "Camba Diaz était un tel maître en guerre défensive qu'on disait que dès lors qu'il avait tracé une ligne par terre, aucun ennemi ne pouvait la franchir. Camba Diaz gagne des attaques supplémentaires quand il combat le dernier en Défi. Tant qu'une Figurine ayant cette Règle Spéciale est Engagée en Défi, son Joueur en Contrôle peut choisir cette Posture : La Ligne Intacte — quand cette Posture est choisie et que cette Figurine n'a pas l'Avantage en Défi, on modifie de +2 la Valeur de la Caractéristique d'Attaques de Camba Diaz.",
  },
  {
    nom: "Coup de Marteau",
    texte:
      "La carrure et la force de volonté de Polux étaient telles qu'il était capable de porter un unique coup écrasant de son gantelet énergétique aussi facilement et lestement que ses frères légionnaires portaient un coup d'épée. Alexis Polux peut faire une attaque alternative en Défi. Tant qu'une Figurine ayant cette Règle Spéciale est Engagée en Défi, son Joueur en Contrôle peut choisir cette Posture : Coup de Marteau — tant que cette Posture est choisie, cette Figurine gagne le Profil d'Arme Coup de Marteau et ne peut pas choisir de faire des attaques avec une autre Arme à l'Étape de Frappe.",
  },
  {
    nom: "Commandant Spatial",
    texte:
      "Polux faisait montre d'une aptitude naturelle au combat spatial, et conduisit des formations d'abordage spécialisées dans l'Hérésie d'Horus. Si une Figurine ayant cette Règle Spéciale rejoint une Unité d'Escouade Brécheuse en Réserves, les Figurines de l'Unité en question gagnent la Règle Spéciale Frappe en Profondeur tant que cette Figurine fait partie de l'Unité. De plus, quand une Figurine ayant cette Règle Spéciale est déployée dans le cadre d'une Frappe en Profondeur, ladite Figurine et toutes les autres Figurines de la même Unité gagnent la Règle Spéciale Insensible à la Douleur (5+) jusqu'à la prochaine Sous-phase des Effets du Joueur en Contrôle.",
  },
  {
    nom: "Formation en Phalange",
    texte:
      "Si habiles et agressifs que soient ceux qui en formaient les rangs, c'était avec une discipline rigide et une détermination inflexible que les Gardiens du Phalanx accomplissaient leur devoir. Une Unité qui comprend au moins une Figurine ayant cette Règle Spéciale peut effectuer la Réaction Avancée Mur de Boucliers ! sans dépenser de Point d'Attribution de Réaction de son Joueur en Contrôle, en contrepartie de quoi elle subit des limitations : si aucun Point d'Attribution de Réaction n'est dépensé, l'Unité Réactive gagne le Statut Fixée une fois que la Réaction est résolue.",
  },
  {
    nom: "Assaut Templier",
    texte:
      "Quand les Templiers des Serments de la Légion vont en guerre, rien ne saurait les arrêter : les Templiers frappent avec la force cinglante d'une lame de fond d'armure énergétique, une tactique guère subtile mais dont la méthode irrépressible a maintes fois prouvé son efficacité. Les Frères Templiers lancent l'assaut plus efficacement quand ils chargent après avoir Débarqué. À la Phase d'Assaut de n'importe quel Tour de Joueur auquel elles ont Débarqué d'un Véhicule d'Assaut, les Figurines ayant cette Règle Spéciale peuvent ajouter +2\" à leur Mouvement de Positionnement. Ce modificateur ne s'applique pas si l'Unité a été forcée d'effectuer un Débarquement d'Urgence au même Tour.",
  },

  /* --- Arsenal des Ultramarines (XIIIe Légion) : Roboute Guilliman,
     Remus Ventanus, Escouade de Suzerains Invictarus, Escouade de
     Brécheurs Prétoriens (voir js/unites-data.js, unités réservées à
     cette Légion). --- */
  {
    nom: "Bouclier d'Abordage Modèle Argyrum",
    texte:
      "Confère une Sauvegarde Invulnérable de 5+, qui devient une Sauvegarde Invulnérable de 4+ contre les Blessures infligées par des Armes de Mêlée. Confère également le Trait Bouclier et le Sous-type Lourd.",
  },
  {
    nom: "Icône de Calth",
    texte:
      "Équipement de Remus Ventanus : on modifie de +1 l'Effectif Tactique des Figurines qui ont le Trait Ultramarines d'une Unité incluant au moins une Figurine dotée d'une icône de Calth.",
  },
  {
    nom: "Interconnexion Vox",
    texte:
      "Équipement de Remus Ventanus qui améliore les Jets de Réserves du Joueur en Contrôle. Tant qu'une Figurine dotée d'une interconnexion vox se trouve sur le Champ de Bataille, le Joueur en Contrôle peut ajouter +1 au résultat de ses Jets de Réserves, y compris pour les Réserves Aériennes.",
  },
  {
    nom: "Bretteur Réfléchi",
    texte:
      "Même s'il n'est pas le plus renommé des bretteurs de l'Imperium, Roboute Guilliman ne compte ni sur la force brute ni sur la rapidité d'exécution, mais sur les renseignements collectés pour étudier son adversaire et exploiter ses faiblesses. Guilliman gagne un bonus au Jet de Concentration selon le numéro du Tour de Bataille en cours. Tant qu'une Figurine ayant cette Règle Spéciale est Engagée en Défi, son Joueur en Contrôle peut choisir cette Posture : Bretteur Réfléchi — si cette Posture est choisie, le Joueur en Contrôle de cette Figurine gagne un modificateur positif au Jet de Concentration égal au numéro du Tour de Bataille en cours, jusqu'à un maximum de +4.",
  },
  {
    nom: "Sire des Ultramarines",
    texte:
      "Si une Figurine ayant cette Règle Spéciale fait partie d'une Armée, le Joueur en Contrôle peut appliquer les Règles Spéciales supplémentaires suivantes à tous les Détachements Principaux, Auxiliaires et d'Apex ayant le même Trait de Faction que la Figurine qui a cette Règle Spéciale : si au moins quatre Cases de Rôle Tactique Troupes du Détachement Principal de cette Armée sont occupées par au moins deux Unités d'Escouade d'Assaut et au moins deux Unités d'Escouade Tactique, toutes les Cases d'Organigramme de Force de Rôle Tactique Troupes du Détachement Principal sont considérées comme des Cases Principales. En outre, jusqu'à la fin du premier Tour de Bataille, toutes les Figurines de Type Infanterie de cette Armée qui ont le Trait Ultramarines peuvent Contrôler et Contester des Objectifs même si elles sont sujettes à un Statut Tactique.",
  },
  {
    nom: "Seigneurs d'Ultramar",
    texte:
      "Les Suzerains jouissent déjà d'une indiscutable autorité parmi les rangs subalternes de la Légion, non par la force ou la crainte qu'ils inspirent, mais par respect et admiration. Les Figurines amies à portée peuvent utiliser les Caractéristiques de cette Figurine pour s'ôter un Statut Tactique. À la Sous-phase des Statuts, pour toute Unité amie n'incluant aucune Figurine de Type Véhicule et dont au moins une Figurine se trouve à 12 pouces d'une Figurine ayant cette Règle Spéciale et n'étant elle-même pas sujette à un Statut Tactique, on peut utiliser la Caractéristique non modifiée de la Figurine ayant cette Règle Spéciale pour les Tests visant à retirer des Statuts Tactiques à l'Unité en question.",
  },

  /* --- Arsenal des Dark Angels (Ire Légion) : Lion El'Jonson, Corswain,
     Marduk Sedras, Détachement de Compagnons de la Deathwing,
     Interemptors de la Dreadwing, Cenobium de Chevaliers du Cercle
     Intérieur (voir js/unites-data.js, unités réservées à cette
     Légion). --- */
  {
    nom: "Le Courroux du Lion",
    texte:
      "Quand le Lion partait au combat, rares étaient les adversaires dignes de périr de sa main, et seuls ceux qui se montrent d'une virulence à la hauteur de son hostilité sont témoins du véritable courroux du Premier Primarque. Le Lion gagne un bonus au Jet de Concentration quand il est blessé. Tant qu'une Figurine ayant cette Règle Spéciale est Engagée en Défi, s'il lui reste 2 Points de Vie ou moins, son Joueur en Contrôle peut choisir cette Posture : Le Courroux du Lion — si cette Posture est choisie, le Joueur en Contrôle de cette Figurine ajoute un modificateur de +2 au Jet de Concentration, et ne subit pas le modificateur de -1 par point de différence entre la Caractéristique de Points de Vie de base de cette Figurine et sa Caractéristique de Points de Vie actuelle.",
  },
  {
    nom: "Sire des Dark Angels",
    texte:
      "Si une Figurine ayant cette Règle Spéciale fait partie d'une Armée, le Joueur en Contrôle peut appliquer les Règles Spéciales supplémentaires suivantes à tous les Détachements Principaux, Auxiliaires et d'Apex ayant le même Trait de Faction que la Figurine qui a cette Règle Spéciale : si au moins quatre Cases de Rôle Tactique Troupes du Détachement Principal de cette Armée sont occupées par au moins une Unité d'Escouade d'Assaut, une Unité d'Escouade Tactique et une Unité d'Escouade Brécheuse, toutes les Cases d'Organigramme de Force de Rôle Tactique Troupes du Détachement Principal sont considérées comme des Cases Principales. En outre, si une Figurine ayant cette Règle Spéciale fait partie d'une Armée, toutes les Unités d'Escadron de Motards et toutes les Unités d'Escadron de Motojets Scimitar de la même Armée gagnent la Règle Spéciale suivante : quand le Joueur en Contrôle fait un Jet de Réserves pour une Unité qui a le Trait Dark Angels, une Unité d'Escadron de Motards ou une Unité d'Escadron de Motojets Scimitar composée uniquement de Figurines qui ont le Trait Dark Angels, ce Jet est modifié de +1.",
  },
  {
    nom: "Grenades à Stase",
    texte:
      "Reliques de l'Antique Nuit, les grenades à stase étaient impossibles à reproduire pour les Techmarines de la Première Légion et n'étaient disponibles qu'en petites quantités, pour les cas les plus désespérés ; le Lion pouvait néanmoins les déployer sans restriction. Les grenades à stase réduisent l'Initiative en Combat des ennemis. Une fois par Bataille, la première fois qu'une Charge réussit contre une Figurine dotée de grenades à stase et l'Unité qu'elle a rejointe, l'Initiative en Combat de toutes les Figurines de l'Unité Assaillante est modifiée de -2 pour la durée de la Phase d'Assaut en cours. Ce modificateur n'affecte pas les Figurines de l'Unité Assaillante engagées en Défi.",
  },
  {
    nom: "Armure de la Forêt",
    texte:
      "Armure d'artificier ouvragée dans l'acier de Terra au cœur des forêts de Caliban de la main du Lion en personne, l'Armure de la Forêt réduit les Dégâts des blessures subies en Défi. Quand une Figurine ayant cette Règle Spéciale est Engagée en Défi, on réduit de 1 la Caractéristique de Dégâts de toute Blessure infligée à cette Figurine, jusqu'à un minimum de 1.",
  },
  {
    nom: "Ancien de la Guerre",
    texte:
      "Marduk Sedras combat pour sa Légion depuis plus de deux siècles, un des plus longs services chez les Space Marines ; il s'est battu en présence de tous les Primarques et a observé les autres Légions dans mille et une zones de guerre. Tant que Marduk Sedras fait partie d'une Unité composée uniquement de Figurines qui ont le Trait Dark Angels, toutes les Figurines de ladite Unité gagnent la Règle Spéciale Haine (Renégats).",
  },
  {
    nom: "Compagnons",
    texte:
      "Les Détachements de Compagnons vouent leur vie à ceux qu'ils protègent, et sont prêts au sacrifice suprême pour garantir leur survie sur le champ de bataille. Tant qu'une Figurine qui a le Trait Dark Angels et de Type Parangon ou de Sous-type État-major fait partie d'une Unité incluant au moins une Figurine ayant cette Règle Spéciale, on ne peut pas allouer à cette Figurine de Blessures de Précision infligées par une Attaque de Tir.",
  },
  {
    nom: "Égide Modèle Cytheron",
    texte:
      "Création de la ville disparue de Cytheron sur Mercure, cet appareil dérive des champs de force qui défiaient autrefois l'ardeur de Sol lui-même. Une Figurine dotée d'une égide modèle Cytheron a une Sauvegarde Invulnérable de 5+ et gagne le Trait Bouclier. De plus, le Joueur en Contrôle d'une Unité qui inclut des Figurines dotées d'une égide modèle Cytheron peut déclarer la Réaction Avancée Mur de Boucliers ! pour cette Unité — il s'agit d'une exception aux Règles normales de cette Réaction Avancée.",
  },
  {
    nom: "Parangons de l'Ordre",
    texte:
      "Au sein de la Première Légion coexistent d'innombrables Ordres, chacun voué à un credo guerrier distinct. Quand une Unité incluant au moins une Figurine ayant cette Règle Spéciale est sélectionnée dans un Détachement au cours de la Sélection d'Armée, on doit sélectionner une seule option des Ordres de l'Hekatonystika pour toutes les Figurines de cette Unité.",
  },
  {
    nom: "Augures de Faiblesse",
    texte:
      "Ordre de l'Hekatonystika : quand elles font des attaques ciblant une Unité qui inclut une Figurine de Type Véhicule, les Figurines ayant la Règle Spéciale Parangons de l'Ordre gagnent la Règle Spéciale Fléau des Blindages.",
  },
  {
    nom: "Icônes de Résolution",
    texte:
      "Ordre de l'Hekatonystika : quand elles font partie d'une Unité Chargée avec succès par une Unité ennemie, les Figurines ayant la Règle Spéciale Parangons de l'Ordre fixent leur Caractéristique de Commandement à 10 pour la durée de la Phase d'Assaut en cours.",
  },
  {
    nom: "Tueurs de Rois",
    texte:
      "Ordre de l'Hekatonystika : tant qu'elles font partie d'une Unité Verrouillée en Combat avec une Unité ennemie incluant au moins une Figurine qui a une Caractéristique de Capacité de Combat de 6 ou plus, on peut fixer à 1 la Caractéristique d'Attaques des Figurines ayant la Règle Spéciale Parangons de l'Ordre. Si on utilise cette option, les espadons terraniques de ces Figurines gagnent la Règle Spéciale Touche Critique (6+) jusqu'à la fin du Combat.",
  },
  {
    nom: "Chasseurs de Bêtes",
    texte:
      "Ordre de l'Hekatonystika : tant qu'elles font partie d'une Unité Verrouillée en Combat avec une Unité ennemie incluant au moins une Figurine qui a une Caractéristique d'Endurance de 6 ou plus, on modifie de +1 la Caractéristique de Dégâts des Blessures infligées par les Figurines ayant la Règle Spéciale Parangons de l'Ordre.",
  },
  {
    nom: "Faucheurs d'Osts",
    texte:
      "Ordre de l'Hekatonystika : tant qu'elles font partie d'une Unité Verrouillée en Combat avec une ou plusieurs Unités ennemies qui lui sont supérieures en nombre, toutes les Figurines de cette Unité ayant la Règle Spéciale Parangons de l'Ordre modifient de +1 leur Caractéristique d'Attaques.",
  },
  {
    nom: "Briseurs de Sorciers",
    texte:
      "Ordre de l'Hekatonystika : tant qu'elles font partie d'une Unité Verrouillée en Combat avec une Unité ennemie incluant au moins une Figurine de Sous-type Maléfique ou qui a le Trait Psyker, on modifie de +1 les Jets de Touche et de Blessure faits pour les Figurines ayant la Règle Spéciale Parangons de l'Ordre qui sont impliquées dans ce Combat.",
  },

  /* --- Arsenal des Space Wolves (VIe Légion) : Leman Russ, Hvarl
     Lamerouge, Geigor Main Terrible, Frères Loups de Russ, Meute de
     Tueurs Gris, Meute de Mort-jurés, Escouade Terminator de Gardes
     Loups Varagyr (voir js/unites-data.js, unités réservées à cette
     Légion). --- */
  {
    nom: "Bombes à Stase de Classe Ymira",
    texte:
      "Reliques d'une campagne génocidaire si terrible que seuls le Roi Loup et son cercle intérieur de prêtres ont le droit de s'en souvenir autrement qu'en cauchemar, ces armes dégradent le cours du temps quand elles explosent. Les bombes à stase de classe Ymira obligent le Joueur Adverse à conserver le résultat le plus bas quand il fait un Jet de Charge. Quand l'Unité Cible d'un Mouvement de Charge ennemi n'est pas déjà Verrouillée en Combat et inclut au moins une Figurine dotée de bombes à stase de classe Ymira, tout Jet de Charge se fait en jetant 2D6 et en défaussant le résultat le plus élevé, au lieu de défausser le résultat le plus faible.",
  },
  {
    nom: "Les Songes du Loup Funeste",
    texte:
      "Les seules émotions que les Mort-jurés peuvent encore ressentir sont celles de la tuerie et de la mort qui les guette. Les Mort-jurés font une ultime attaque avant d'être Retirés comme Pertes. Au Rang d'Initiative 1 de tout Combat qui implique au moins une Figurine ayant cette Règle Spéciale, le Joueur en Contrôle peut faire une attaque bonus pour chaque Figurine ayant cette Règle Spéciale qui a été Retirée comme Perte à un quelconque Rang d'Initiative précédent du Combat en cours. Ces attaques peuvent cibler n'importe quelle Unité impliquée dans ce Combat, et se font selon le profil de Frappe d'agonie.",
  },
  {
    nom: "Fléau des Seigneurs",
    texte:
      "Les Varagyr aiment prouver leur supériorité sur les champions ennemis, et cherchent à glorifier leur seigneur en lui ramenant des trophées macabres, dans l'espoir que les scaldes chanteront leur saga. Les Varagyr gagnent un bonus à leur Résultat de Combat si le Thegn survit à un Défi. À l'Étape de Gloire d'un Défi qui implique une Figurine de Thegn ayant cette Règle Spéciale, si cette Figurine n'a pas été Retirée comme Perte lors de ce Défi, pour ce Combat le Joueur en Contrôle gagne à la Sous-phase de Résolution suivante un nombre de Points de Résolution de Combat égal au nombre de Figurines de Varagyr de la même Unité, jusqu'à un maximum de +4.",
  },
  {
    nom: "Frères Loups de Russ",
    texte:
      "Au combat, Leman Russ est parfois accompagné par deux énormes loups du Primarque, que la légende dit être ses frères de portée : ils se tenaient déjà à ses côtés quand, encore à l'état sauvage, il arpentait les désolations de Fenris. Aucune autre Figurine que Leman Russ ne peut rejoindre une Unité qui inclut des Figurines ayant cette Règle Spéciale.",
  },
  {
    nom: "Preneur de Têtes",
    texte:
      "Hvarl n'aimait qu'une chose au combat, la mort de l'ennemi ; il se moquait de la stratégie, de la subtilité du déploiement ou de la manœuvre, et préférait se rapprocher aussi vite que possible de ses ennemis. Cette Posture empêche l'Adversaire de gagner un bonus de Soutien Extérieur au Jet de Concentration. Tant qu'une Figurine ayant cette Règle Spéciale est Engagée en Défi, son Joueur en Contrôle peut choisir cette Posture : Preneur de Têtes — si cette Posture est choisie, l'Adversaire n'a pas droit à un bonus de Soutien Extérieur à l'Étape de Concentration.",
  },
  {
    nom: "Hurlement du Loup Funeste",
    texte:
      "Au combat, Russ n'était pas seulement un guerrier, mais un véritable catalyseur de fureur, de rage et de violence, investi du pouvoir du Loup Funeste, prompt à déchaîner un assaut en règle contre quiconque osait se dresser contre lui. Une fois par Bataille, tant qu'une Figurine ayant cette Règle Spéciale est Engagée en Défi, son Joueur en Contrôle peut choisir cette Posture : Hurlement du Loup Funeste — une fois que cette Posture est choisie et jusqu'à ce qu'elle cesse de faire effet, on ne peut choisir aucune autre Posture pour cette Figurine. Quand cette Posture est choisie, le Joueur en Contrôle de cette Figurine gagne un bonus de +5 au Jet de Concentration suivant et aux Jets de Concentration consécutifs au cours du Défi, jusqu'à ce que cette Figurine ne parvienne pas à infliger une Blessure Non Sauvegardée à l'Étape de Frappe. Dès lors, les effets de cette Posture prennent fin, et le Joueur en Contrôle ne peut plus la choisir de tout le Défi en cours.",
  },
  {
    nom: "Sire des Space Wolves",
    texte:
      "Si une Figurine ayant cette Règle Spéciale fait partie d'une Armée, le Joueur en Contrôle peut appliquer les Règles Spéciales supplémentaires suivantes à tous les Détachements Principaux, Auxiliaires et d'Apex ayant le même Trait de Faction que la Figurine qui a cette Règle Spéciale : si au moins quatre Cases de Rôle Tactique Troupes du Détachement Principal de cette Armée sont occupées par des Unités de Meute de Tueurs Gris, toutes les Cases d'Organigramme de Force de Rôle Tactique Troupes du Détachement Principal sont considérées comme des Cases Principales. En outre, jusqu'à la fin du premier Tour de Bataille, toutes les Figurines de Type Infanterie de cette Armée qui ont le Trait Space Wolves gagnent la Règle Spéciale Mouvement à Couvert.",
  },

  /* --- Arsenal des Iron Hands (Xe Légion) : Ferrus Manus, Shadrak
     Meduson, Révérend de Fer, Escouade Terminator Gorgone, Escouade
     d'Immortels de Medusa (voir js/unites-data.js, unités réservées à
     cette Légion). --- */
  {
    nom: "Armure Terminator Modèle Gorgone",
    texte:
      "Les Sauvegardes d'Armure et Invulnérables réussies peuvent imposer des Statuts Tactiques aux Figurines ennemies. À la fin de l'Étape 4 de la Phase d'Assaut, si la moindre Figurine en armure Terminator modèle Gorgone a réussi au moins un jet de Sauvegarde d'Armure ou de Sauvegarde Invulnérable contre des Blessures causées par des Attaques de Tir ou de Mêlée à la même Phase d'Assaut, l'Unité qui a infligé ces Blessures doit faire un Test de Sang-froid. Si ce Test est raté, l'Unité gagne le Statut Neutralisée.",
  },
  {
    nom: "Seigneur des Automates",
    texte:
      "Nombre de Révérends de Fer étaient initiés aux secrets de la Legio Cybernetica, et accompagnaient même les automates de combat honorés par la Légion sur le champ de bataille, qui agissaient alors comme une extension de sa volonté. Cette Règle Spéciale permet à un Révérend de Fer d'être accompagné d'une Unité d'Automates de Combat : quand une Figurine ayant cette Règle Spéciale est incluse dans un Détachement, on ajoute à ce dernier une Case d'Organigramme de Force additionnelle, qui ne peut être occupée que par une Unité de Manipule d'Automates de Combat Castellax ; celle-ci remplace alors son Trait Cybernetica par Automates Liés et peut rejoindre le Détachement bien qu'elle n'ait pas le même Trait de Faction que ses autres Unités. De plus, une Figurine ayant cette Règle Spéciale peut rejoindre une Unité amie de Type Automate sans réduire la Valeur de ses Caractéristiques de Commandement et de Sang-froid.",
  },
  {
    // NOTE : texte non confirmé sur le livre — reprend la mécanique de
    // Seigneur des Automates (Révérend de Fer), le Praevius étant lui
    // aussi un techno-chamane de la Legio Cybernetica au sein des Iron
    // Hands. À corriger si le livre donne un texte différent.
    nom: "Maître des Automates",
    texte:
      "Les Praevius sont initiés aux secrets de la Legio Cybernetica, chargés de guider au combat les automates honorés par la Légion. Cette Règle Spéciale permet à un Praevius d'être accompagné d'une Unité d'Automates de Combat : quand une Figurine ayant cette Règle Spéciale est incluse dans un Détachement, on ajoute à ce dernier une Case d'Organigramme de Force additionnelle, qui ne peut être occupée que par une Unité de Manipule d'Automates de Combat Castellax ; celle-ci remplace alors son Trait Cybernetica par Automates Liés et peut rejoindre le Détachement bien qu'elle n'ait pas le même Trait de Faction que ses autres Unités. De plus, une Figurine ayant cette Règle Spéciale peut rejoindre une Unité amie de Type Automate sans réduire la Valeur de ses Caractéristiques de Commandement et de Sang-froid.",
  },
  {
    nom: "Trempé par la Guerre",
    texte:
      "La guerre est le creuset dans lequel la Gorgone fut forgée, car rien d'autre ne pouvait engendrer la force et la résistance que Ferrus Manus exigeait de ses guerriers. Tant qu'une Figurine ayant cette Règle Spéciale est Engagée en Défi, son Joueur en Contrôle peut choisir cette Posture : Trempé par la Guerre — quand cette Posture est choisie, la Caractéristique d'Endurance de cette Figurine est fixée à 8 pour la durée de l'Étape de Frappe suivante.",
  },
  {
    nom: "Sire des Iron Hands",
    texte:
      "Si une Figurine ayant cette Règle Spéciale fait partie d'une Armée, le Joueur en Contrôle peut appliquer les Règles Spéciales supplémentaires suivantes à tous les Détachements Principaux, Auxiliaires et d'Apex ayant le même Trait de Faction que la Figurine qui a cette Règle Spéciale : si au moins quatre Cases de Rôle Tactique Troupes du Détachement Principal de cette Armée sont occupées par des Escouades Tactiques et/ou des Escouades Brécheuses, toutes les Cases d'Organigramme de Force de Rôle Tactique Troupes du Détachement Principal sont considérées comme des Cases Principales. En outre, jusqu'à la fin du premier Tour de Bataille, toutes les Figurines de Type Infanterie de cette Armée qui ont le Trait Iron Hands ont la Règle Spéciale Insensible à la Douleur (6+).",
  },

  /* --- Arsenal des Raven Guard (XIXe Légion) : Escouade de Mor
     Deythan, Escouade de Furies Noires, Escouade de Terminator
     Deliverers (voir js/unites-data.js, unités réservées à cette
     Légion). --- */
  {
    nom: "La Honte de Corax",
    texte:
      "En symbole de l'héritage cruel et brutal que Corax hérita en prenant le contrôle de la Raven Guard, les Deliverers ont longtemps été exilés de toute position d'honneur au sein de leur propre Légion. Les Figurines dotées de cette Règle Spéciale subissent des restrictions au sein d'une Armée comprenant Corvus Corax : une Unité qui compte au moins une Figurine dotée de cette Règle Spéciale ne peut pas être rejointe par une Figurine de Corvus Corax. De plus, les Jets de Réserves faits pour une Unité qui compte au moins une Figurine dotée de cette Règle Spéciale sont modifiés de -1 pendant toute Sous-phase de Réserves au cours de laquelle une Figurine de Corvus Corax amie était elle aussi en Réserves au début de cette Sous-phase.",
  },

  /* --- ÉQUIPEMENT GÉNÉRIQUE (p. 313-315) : objets de wargear qui
     confèrent une Règle Spéciale plutôt qu'un profil d'Arme (voir
     js/armes-data.js pour les armes proprement dites). Transcrit
     depuis le glossaire d'Équipement du livre de règles ; utilisé par
     de nombreuses unités à travers tout js/unites-data.js. La ligne
     "Équipement" de la fiche récap (construireFiche, js/unites.js)
     habille chaque entrée reconnue d'une info-bulle reprenant sa
     définition, exactement comme "Règles spéciales" et "Traits". --- */
  {
    nom: "Étendard de Compagnie",
    texte:
      "Donne un bonus à la Résolution de Combat. Quand on résout un Combat à la Sous-phase de Résolution de la Phase d'Assaut, on marque 1 Point de Résolution de Combat pour chaque Unité impliquée dans ce Combat dont au moins une Figurine porte un étendard de Compagnie. De plus, une Figurine qui a un étendard de Compagnie compte comme 5 Figurines supplémentaires pour ce qui est du Soutien Extérieur en Défi.",
  },
  {
    nom: "Étendard de Légion",
    texte:
      "Donne un bonus à la Résolution de Combat. Quand on résout un Combat à la Sous-phase de Résolution de la Phase d'Assaut, on marque 2 Points de Résolution de Combat pour chaque Unité impliquée dans ce Combat dont au moins une Figurine porte un étendard de Légion. De plus, une Figurine qui a un étendard de Légion compte comme 6 Figurines supplémentaires pour ce qui est du Soutien Extérieur en Défi.",
  },
  {
    nom: "Vexillum",
    texte:
      "Donne un bonus à la Résolution de Combat. Quand on résout un Combat à la Sous-phase de Résolution de la Phase d'Assaut, on marque 1 Point de Résolution de Combat pour chaque Unité impliquée dans ce Combat dont au moins une Figurine porte un vexillum.",
  },
  {
    nom: "Lame de Bulldozer",
    texte:
      "Permet aux Figurines d'ignorer le malus au Mouvement du Terrain Difficile. Si le Joueur en Contrôle fait entrer dans une quelconque zone de Terrain Difficile une Figurine dotée d'une lame de bulldozer, l'Unité concernée est dispensée d'appliquer un modificateur à son déplacement à cette Phase.",
  },
  {
    nom: "Narthecium",
    texte:
      "Permet de faire des Jets de Rétablissement à la Sous-phase de Moral. Si une Unité incluant la moindre Figurine dotée d'un narthecium n'est pas Verrouillée en Combat, avant que le Joueur en Contrôle fasse un Test de Caractéristique pour ladite Unité à la Sous-phase de Moral, il peut faire un Jet de Rétablissement pour l'Unité. Si ce Jet de Rétablissement est réussi, le Joueur peut soustraire -2 au résultat du Test de Caractéristique. On ne peut faire ainsi qu'un seul Jet de Rétablissement par Unité à chaque Sous-phase de Moral.",
  },
  {
    nom: "Nuncio-vox",
    texte:
      "Permet aux Unités de retirer des Statuts Tactiques à la Phase de Début. Si une Unité inclut au moins une Figurine dotée d'un nuncio-vox, et s'il y a sur le Champ de Bataille au moins une Figurine de Sous-type État-major, le Joueur en Contrôle peut activer le nuncio-vox à la Phase de Début de son Tour en tant que Joueur Actif. Quand le nuncio-vox est activé, le Joueur en Contrôle peut faire un Test pour retirer un seul Statut Tactique à toutes les Figurines de l'Unité dotée du nuncio-vox. On fait ce Test sous la Caractéristique de Sang-froid (sauf pour tenter de retirer le Statut En Déroute, auquel cas c'est le Commandement) de n'importe quelle Figurine amie de Sous-type État-major sur le Champ de Bataille au choix du Joueur en Contrôle. Un nuncio-vox ne peut être activé qu'une fois par Tour, et chaque Figurine amie de Sous-type État-major ne peut servir à utiliser cette Règle Spéciale qu'une fois par Phase de Début.",
  },
  {
    nom: "Projecteurs",
    texte:
      "Permettent aux attaques d'ignorer les Jets de Mitigation de Dégâts de Dissimulation. On augmente de +1 (jusqu'à un maximum de 6+) le Nombre Cible de tous les Jets de Mitigation de Dégâts de Dissimulation consécutifs aux Blessures, Touches Pénétrantes ou Touches Superficielles infligées par les Attaques de Tir faites par une Figurine dotée de projecteurs qui a Ligne de Vue vers l'Unité Cible. Réciproquement, une Figurine dotée de projecteurs ne peut pas tenter de Jets de Mitigation de Dégâts de Dissimulation pour annuler les Blessures, Touches Pénétrantes ou Touches Superficielles en question.",
  },
  {
    nom: "Scanner Augure",
    texte:
      "Permettent aux attaques d'ignorer les Jets de Mitigation de Dégâts de Dissimulation. Quand une Attaque de Tir faite par une Unité incluant la moindre Figurine dotée d'un scanner augure inflige des Touches (à l'exclusion des Touches d'attaques au Jugé), on ne peut pas tenter de Jets de Mitigation de Dégâts de Dissimulation contre les Touches en question.",
  },
  {
    nom: "Servobras",
    texte:
      "Restaure davantage de Points de Vie ou de Coque quand la Figurine utilise la Règle Spéciale Guerrier-artisan (X). Chaque fois que le Joueur en Contrôle d'une Figurine dotée d'un servobras choisit l'option Réparer quand il active la Règle Spéciale Guerrier-artisan (X) pour cette Figurine, le nombre de Points de Coque ou de Points de Vie que gagne la Figurine Cible augmente de +1.",
  },
  {
    // Arsenal des Taghmata du Mechanicum (Liber Mechanicum), non
    // transcrit ailleurs sur ce site.
    nom: "Panoplie machinator",
    texte:
      "Permet d'utiliser deux fois la Règle Spéciale Guerrier-artisan (X) au même Tour. Chaque fois que le Joueur en Contrôle d'une Figurine dotée d'une panoplie machinator choisit d'utiliser la Règle Spéciale Guerrier-artisan (X), il peut l'utiliser deux fois, sur la même Unité Cible ou sur deux Unités Cibles différentes, avec des effets éventuellement différents (toutes les cibles doivent être valides).",
  },
  {
    nom: "Relais Vox d'État-major",
    texte:
      "Confère un bonus aux Jets de Réserves et peut servir à accorder d'autres bénéfices. Tant qu'une Figurine dotée d'un relais vox d'état-major se trouve sur le Champ de Bataille, avant de faire un Jet de Réserves pour une Unité en Réserves, le Joueur en Contrôle peut faire activer ce relais vox d'état-major par la Figurine : s'il le fait, il peut modifier de +1 le résultat du Jet de Réserves (un seul relais vox d'état-major activable par Jet de Réserves). De plus, à la Sous-phase des Effets de la Phase de Début, le Joueur en Contrôle d'une Figurine dotée d'un relais vox d'état-major peut faire un Test d'Intelligence pour ladite Figurine (Caractéristique d'Intelligence de 8 si elle est de Type Véhicule). Si ce Test est réussi, il peut choisir une Unité amie composée uniquement de Figurines avec le même Trait de Faction que la Figurine dotée du relais vox d'état-major, et lui donner jusqu'à la fin de ce Tour soit la Règle Spéciale Ligne (1) (perdant Avant-garde (X) si elle la possédait), soit Avant-garde (1) (perdant Ligne (X) si elle la possédait).",
  },
  {
    nom: "Bouclier d'Abordage",
    texte:
      "Confère une Sauvegarde Invulnérable de 5+, le Trait Bouclier et le Sous-type Lourd. Une Figurine avec bouclier d'abordage gagne une Sauvegarde Invulnérable de 5+. De plus, elle gagne le Trait Bouclier et le Sous-type Lourd.",
  },
  {
    nom: "Bouclier de Combat",
    texte:
      "Confère une Sauvegarde Invulnérable de 5+ et un bonus aux Jets de Concentration. Une Figurine avec bouclier de combat a une Sauvegarde Invulnérable de 5+ contre les attaques faites avec des Armes de Mêlée. De plus, une Figurine avec bouclier de combat gagne un modificateur de +1 aux Jets de Concentration qu'on fait pour elle.",
  },
  {
    nom: "Champ de Diffraction Thermique",
    texte:
      "Atténue les Dégâts qu'infligent les Armes ayant certains Traits. Une Figurine dotée d'un champ de diffraction thermique réduit de -1 la Force de toutes les Touches qui lui sont infligées par les Armes ayant le Trait Laser, Plasma, Fusion ou Flammes. De plus, quand une Figurine dotée d'un champ de diffraction thermique génère un Groupe d'Incidents en vertu de la Règle Spéciale Surcharge (X), la Règle Spéciale Brèche (X) de ces Touches ne prend effet que sur un résultat de Jet de Blessure de 6+, quelle que soit la valeur de X.",
  },
  {
    nom: "Cognis-signum",
    texte:
      "Permet de porter des attaques plus précises avec les Armes de Barrage. Au lieu de faire une Attaque de Tir avec une Figurine dotée d'un cognis-signum, le Joueur en Contrôle peut faire un Test d'Intelligence. Si le Test est réussi, il peut choisir une seule Unité ennemie en Ligne de Vue de la Figurine dotée d'un cognis-signum : la prochaine fois à la Phase de Tir en cours que l'Unité ennemie choisie est ciblée par une Attaque de Tir incluant au moins une Arme ayant la Règle Spéciale Barrage (X), le Joueur en Contrôle peut faire normalement les Jets de Touche pour ces attaques, en ignorant les limitations de la Règle Spéciale Barrage (X) si l'Unité qui fait l'Attaque de Tir n'a pas de Ligne de Vue vers l'Unité Cible. Si le Test est raté, le cognis-signum n'a aucun effet à ce tour.",
  },
  {
    nom: "Contrôleur de Cortex",
    texte:
      "Permet aux Automates d'effectuer des Réactions. Une Unité incluant la moindre Figurine de Type Automate peut ignorer la restriction sur les Réactions à laquelle le Type Automate est soumis, tant qu'elle inclut au moins une Figurine dotée d'un contrôleur de cortex.",
  },
  {
    nom: "Cyber-familier",
    texte:
      "Donne un bonus aux Tests d'Intelligence. Le Joueur en Contrôle d'une Figurine dotée d'un cyber-familier peut modifier de -2 le résultat des Tests d'Intelligence faits pour ladite Figurine.",
  },

  /* --- Arsenal des Emperor's Children (IIIe Légion) : équipement et
     Règle Spéciale d'Unité (voir js/unites-data.js, unités réservées à
     cette Légion — Seigneur Commandant Eidolon, Capitaine Lucius,
     Escouade Terminator Phénix, Escouade de Lames Palatines, Escouade
     Kakophoni). --- */
  {
    nom: "Hurleurs Soniques",
    texte:
      "Amplifiant les cris et grognements du porteur en déflagrations dissonantes, ces armes étourdissent les combattants ennemis au moyen d'ondes à haute fréquence, ce qui en fait des proies faciles. Quand une Unité qui comprend la moindre Figurine dotée de hurleurs soniques fait un Mouvement de Charge, l'Unité Cible de la Charge en question ne peut pas effectuer de Réactions avant que la Procédure de Charge soit terminée.",
  },
  {
    nom: "Adresse Inégalée",
    texte:
      "Quand elle est Verrouillée en Combat, l'Unité peut appliquer une Règle Spéciale de plus jusqu'à la fin de la Phase. À la fin de la Sous-phase de Charge, si l'Unité est Verrouillée en Combat avec une ou plusieurs Unités ennemies, son Joueur en Contrôle peut choisir un des effets suivants, jusqu'à la fin de la Phase : La Frappe Parfaite — la Capacité de Combat de chaque Figurine de l'Unité ayant cette Règle Spéciale est considérée supérieure d'un point à la normale pour déterminer le résultat dont elle a besoin pour Toucher un adversaire (à l'Étape de Frappe de la Sous-phase de Défi ou à l'Étape Faire les Jets de Touche de l'Étape Résoudre un Rang d'Initiative), sans modifier les Jets de Touche faits par les Figurines adverses contre elle. La Garde Parfaite — inversement, la Capacité de Combat de chaque Figurine de l'Unité ayant cette Règle Spéciale est considérée supérieure d'un point à la normale pour déterminer le résultat dont une Figurine adverse a besoin pour la Toucher, sans modifier les Jets de Touche faits par l'Unité pour ses propres attaques.",
  },

  /* --- Types et Sous-types de Figurine (indiqués entre parenthèses
     après le Type sur chaque profil, ex. « Infanterie (Sergent,
     Lourd) ») : consultées comme des Règles Spéciales ordinaires par
     trouverDefinitionRegle (voir js/main.js), ce qui leur donne une
     info-bulle partout où un Type ou Sous-type de Figurine est cité —
     notamment la ligne « Type » de la fiche récap (js/unites.js) —
     sans nécessiter de page dédiée. Lourd, Léger et Marcheur déjà
     présents ci-dessus (Sous-types les plus fréquemment cités comme
     Règle Spéciale à part entière) ; les Types de Base (Infanterie,
     Cavalerie) et les autres Sous-types les complètent ici. --- */
  {
    nom: "Infanterie",
    texte:
      "Type le plus courant : utilise les Règles de Base sans aucun bonus ni malus. Une Figurine de Type Infanterie peut Embarquer à bord d'une Figurine de Sous-type Transport et en Débarquer.",
  },
  {
    nom: "Cavalerie",
    texte:
      "Lors d'un Mouvement de Retraite, une Figurine de Type Cavalerie se déplace d'une distance égale à son Initiative plus la somme de deux dés. Elle ne bénéficie d'aucune Sauvegarde de Couvert conférée par un Élément ou une Zone de Terrain.",
  },
  {
    nom: "Parangon",
    texte:
      "Alloue lui-même les Touches qu'il inflige, au Tir comme en Mêlée. Peut rejoindre ou quitter une Unité de Type Infanterie (et réciproquement), Embarquer à bord d'une Figurine de Sous-type Transport, Lancer et Relever des Défis, et prêter ses Caractéristiques à son Unité pour tout Test de Caractéristique. Compte comme sa Valeur de Points de Vie de Base pour la résolution d'un Combat.",
  },
  {
    nom: "Automate",
    texte:
      "Ne peut jamais gagner de Statut Tactique et réussit automatiquement tout Test censé le lui éviter — sauf si l'Unité inclut au moins une Figurine qui n'est pas de Type Automate. Ignore la Règle Spéciale Empoisonnée (X) sauf sur un Jet de Blessure de 6 non modifié. Une Unité qui inclut la moindre Figurine de Type Automate ne peut pas effectuer de Réactions.",
  },
  {
    nom: "Tirailleurs",
    texte:
      "Une Unité entièrement composée de Figurines de Sous-type Tirailleurs a une limite de Cohésion d'Unité de 3 pouces au lieu de 2.",
  },
  {
    nom: "Antigrav",
    texte:
      "Une Unité entièrement composée de Figurines de Sous-type Antigrav ignore les effets du Terrain qu'elle franchit et peut survoler le Terrain Infranchissable (sans y commencer ni y terminer son mouvement, et en testant normalement le Terrain Dangereux si elle y commence ou termine son mouvement). Elle ignore les Figurines et Unités quand elle se Déplace, mais doit achever son mouvement à au moins 1 pouce de toute Figurine qui ne fait pas partie de la même Unité si elle franchit une Unité amie, ou de toute Figurine ennemie si elle franchit une Unité ennemie.",
  },
  {
    nom: "Transport",
    texte:
      "Sa Caractéristique de Capacité de Transport fixe le nombre de Figurines pouvant Embarquer à son bord (une Figurine par point, sauf mention contraire de Massif (X)). Seules les Figurines de Type Infanterie ou Parangon du même Trait de Faction peuvent Embarquer ou Débarquer, une seule Unité à la fois et en totalité — jamais d'embarquement partiel. L'Unité Embarquée demeure une Unité séparée du Transport à tous égards.",
  },
  {
    nom: "Spécialiste",
    texte:
      "Une Figurine de Sous-type Spécialiste peut rejoindre et quitter des Unités.",
  },
  {
    nom: "Sergent",
    texte:
      "Le Joueur en Contrôle d'une Unité qui inclut une ou plusieurs Figurines de Sous-type Sergent peut utiliser les Caractéristiques d'une de ces Figurines pour résoudre tout Test de Caractéristique fait pour l'Unité.",
  },
  {
    nom: "État-major",
    texte:
      "Une Figurine de Sous-type État-major peut rejoindre et quitter des Unités, ainsi que Lancer et Relever des Défis. Le Joueur en Contrôle d'une Unité qui en inclut une ou plusieurs peut utiliser ses Caractéristiques pour résoudre tout Test de Caractéristique fait pour l'Unité.",
  },
  {
    nom: "Champion",
    texte:
      "Une Figurine de Sous-type Champion peut Lancer et Relever des Défis.",
  },
  {
    nom: "Unique",
    texte:
      "Une armée ne peut inclure qu'un seul exemplaire d'une Figurine de ce Sous-type. Une Figurine de Sous-type Unique, ou une Unité entièrement composée de telles Figurines, ne peut avoir d'autres options que celles sélectionnées pour elle dans son Profil de Liste d'Armée.",
  },
  /* ============================================================
     Arsenal des Maisonnées de Chevaliers et des Legios Titaniques :
     Règles Spéciales et Équipement propres aux Chevaliers Questoris
     et aux Titans.
     ============================================================ */
  {
    nom: "Énergivore",
    texte:
      "Quand une Arme ayant cette Règle Spéciale est utilisée, toutes les autres Armes de la Figurine sont réduites à Tirer au Jugé pour le reste de l'Attaque de Tir.",
  },
  {
    nom: "Bélier-choc",
    texte:
      "Un Véhicule ayant cette Règle Spéciale inflige D6+3 Touches (au lieu de D6) en traversant une Unité ennemie, et gagne une Sauvegarde Invulnérable de 6+ contre les Réactions La Mort ou la Gloire dont il est la cible.",
  },
  {
    nom: "Tir Indépendant",
    texte:
      "Une Figurine de Type Véhicule ayant cette Règle Spéciale peut tirer sur plusieurs cibles à sa Capacité de Tir entière sans être réduite à Tirer au Jugé.",
  },
  {
    nom: "Boucliers Void Titaniques (X)",
    texte:
      "Une Figurine ayant cette Règle Spéciale possède X boucliers Void (Valeur de Blindage 13) qui absorbent chacun une Touche avant que les suivantes n'atteignent son Profil de Titan.",
  },
  {
    nom: "Bouclier Ionique",
    texte:
      "Sauvegarde Invulnérable de 5+ (Face Avant) ou 6+ (Face Arrière) contre les Attaques de Tir, valable aussi contre les Touches Superficielles.",
  },
  {
    nom: "Bouclier Répulsif Ionique",
    texte:
      "Combine le bouclier ionique (Sauvegarde Invulnérable de 5+/6+ contre les Attaques de Tir, y compris les Touches Superficielles) et le bouclier répulsif (annule Fléau des Blindages contre la Figurine).",
  },
  {
    nom: "Bouclier Magnéto-inverseur",
    texte:
      'Réduit d\'1" (minimum 1") la distance de Charge des Unités ennemies qui chargent une Unité majoritairement équipée, laquelle gagne aussi le Trait Bouclier.',
  },
  {
    nom: "Bouclier Répulsif",
    texte:
      "Les Attaques de Tir qui touchent la Figurine équipée ne bénéficient pas de la Règle Spéciale Fléau des Blindages.",
  },
  {
    nom: "Hommes d'Armes de la Legio",
    texte:
      "Une Unité entièrement composée de Figurines ayant cette Règle Spéciale ignore les malus de Cor Titanique (X) et gagne +1 à son Commandement tant qu'un Titan ami est sur le champ de bataille ; elle fait un Test de Panique si un Titan ami est détruit.",
  },
  {
    nom: "Colosse",
    texte:
      "Une Figurine de Sous-type Chevalier ayant cette Règle Spéciale n'a pas de socle : les distances, Lignes de Vue et Faces Avant/Arrière se déterminent depuis sa Coque, comme pour un Véhicule.",
  },
  {
    nom: "Cor Titanique (X)",
    texte:
      "Une fois par Bataille, réduit de X les Caractéristiques de Commandement, Volonté, Sang-froid et Intelligence des Figurines ennemies à 24\" de la Figurine qui l'active.",
  },
  {
    nom: "Structure Renforcée (X)",
    texte:
      "Réduit de X (minimum 1) les Dégâts des Touches infligées par les Armes dépourvues du Trait Stratégique ou de la Règle Spéciale Artillerie (X).",
  },
  {
    nom: "Réparateurs (X)",
    texte:
      "Un Titan peut se réparer lui-même : à la Sous-phase des Effets de la Phase de Début, il regagne X Points de Coque sur un Profil, sans dépasser sa Valeur de Base.",
  },
  {
    nom: "Fourneau Rad",
    texte:
      "Toute Figurine Verrouillée dans le même Combat qu'une Figurine dotée d'un fourneau Rad réduit de 1 son Endurance pour la durée du Combat.",
  },
  {
    nom: "Grenades Frag",
    texte:
      "À l'Étape de Volée de la Procédure de Charge, une Figurine dotée de grenades Frag peut faire une attaque unique (P6, PF1, FT3, PA6, D1, Explosion (3\"), Assaut) à la place d'une Attaque de Tir normale.",
  },
  {
    nom: "Autres Gabarits",
    texte:
      "Certaines Armes de grande taille utilisent, à la place du Gabarit de Flammes standard, un autre Gabarit de Souffle (par exemple le Gabarit de Fournaise, indiqué entre parenthèses après « Souffle »).",
  },
  /* --- Arsenal des Thousand Sons (XVe Légion) : les cinq Arcanes de
     Prospero (Pavoni, Corvidae, Athanéen, Pyrae, Raptora), voir l'option
     "arcane-prospero" (ARCANE_DE_PROSPERO) dans js/unites-data.js et
     leurs Armes Psychiques dans js/armes-data.js. Chaque Arcane est une
     Discipline Psychique donnant à ses Figurines un Pouvoir/Réaction/
     Arme Psychique et un Trait propres — même principe que la
     Discipline « Appel de l'Orage » des White Scars ci-dessus. */
  {
    nom: "Arcanes de Prospero",
    texte:
      "Chaque Unité qui a le Trait Thousand Sons (sauf les Unités comprenant des Figurines de Type Véhicule ou Automate, ou de Sous-type Unique) peut être nantie d'un des cinq Arcanes suivants pour +10 Points par Unité (et non par Figurine) : Raptora, Pyrae, Pavoni, Corvidae ou Athanéen. Toutes les Figurines de l'Unité en profitent, mais pas celles qui la rejoignent au Déploiement ou en cours de Bataille (qui peuvent recevoir leur propre Arcane, identique ou différent, lors de la composition de la Feuille d'Armée) ; une Unité ne peut être nantie que d'un seul Arcane de Prospero. Une Unité qui a déjà un Arcane de Prospero en vertu de ses propres Règles Spéciales (par exemple la Cabale du Khenetai Occulte) ne peut pas en recevoir un autre de cette liste. Si une Figurine qui Manifeste un Pouvoir Psychique, une Arme Psychique ou une Réaction Psychique conféré par un Arcane de Prospero subit les effets des Périls du Warp, on ne fait pas de jet sur le tableau des Périls du Warp : à la place, l'Unité subit D3 Blessures, chacune avec une PA de 2 et des Dégâts de 1 qui ignorent les Sauvegardes de Couvert et les Jets de Mitigation de Dégâts (Sauvegardes Invulnérables autorisées, Blessures allouées comme si une Attaque de Tir les avait infligées). Si l'Unité dispose d'une Arme Psychique conférée par son Arcane, une seule de ses Figurines peut l'utiliser à chaque fois que l'Unité est choisie pour faire des attaques au cours d'une Attaque de Tir ou d'un Combat.",
  },
  {
    nom: "Pavoni",
    texte:
      "Discipline Psychique (Arcane de Prospero) des Thousand Sons : une Figurine qui la possède gagne la Réaction Psychique Corps de Pierre, l'Arme Psychique Ébullition Sanguine, et le Trait « Pavoni ».",
  },
  {
    nom: "Corps de Pierre",
    texte:
      "Réaction Psychique (Bénédiction) qui accroît la Caractéristique d'Endurance de l'Unité Réactive. Le Joueur Réactif peut la déclarer au début de l'Étape 3 d'une Attaque de Tir faite par le Joueur Actif qui cible une Unité incluant au moins une Figurine ayant le Trait Pavoni (Coût : 1 Point d'Attribution de Réactions, payé seulement si le Test de Volonté est réussi). Le Focus doit être une Figurine ayant le Trait Pavoni de l'Unité ciblée ; la Cible est cette même Unité, entièrement composée de Figurines ayant le Trait Thousand Sons. En cas de réussite, ses effets durent jusqu'à la fin de la Sous-phase : toutes les Figurines de l'Unité Cible gagnent un bonus de +2 à leur Caractéristique d'Endurance.",
  },
  {
    nom: "Corvidae",
    texte:
      "Discipline Psychique (Arcane de Prospero) des Thousand Sons : une Figurine qui la possède gagne les Pouvoirs Psychiques Tirs Fatidiques et Voies de Conséquence, et le Trait « Corvidae ».",
  },
  {
    nom: "Tirs Fatidiques",
    texte:
      "Pouvoir Psychique (Bénédiction) qui rend plus efficaces les Attaques de Tir de l'Unité. Le Joueur Actif peut le Manifester à la Phase de Tir, au début de l'Étape 4 d'une Attaque de Tir faite par une Unité incluant au moins une Figurine ayant le Trait Corvidae. Le Focus doit être une Figurine ayant le Trait Corvidae de l'Unité qui tire ; la Cible est cette même Unité, entièrement composée de Figurines ayant le Trait Thousand Sons. En cas de réussite, ses effets durent jusqu'à la fin de l'Attaque de Tir en cours : toutes les Armes de Tir dont sont dotées les Figurines de l'Unité Cible, sauf celles ayant la Règle Spéciale Explosion (X), gagnent la Règle Spéciale Vulnérante (5+).",
  },
  {
    nom: "Voies de Conséquence",
    texte:
      "Pouvoir Psychique (Malédiction) qui réduit le Mouvement de la Cible et lui impose des Jets de Terrain Dangereux. Le Joueur Actif peut le Manifester à la Sous-phase des Effets de la Phase de Début. Le Focus doit être une Figurine ayant le Trait Corvidae sous le contrôle du Joueur Actif ; la Cible est une Unité ennemie dont au moins une Figurine se trouve à 18 pouces et en Ligne de Vue du Focus. En cas de réussite, ses effets durent jusqu'au début du prochain Tour du Joueur Actif : toutes les Figurines de l'Unité Cible subissent un malus de -2 à leur Caractéristique de Mouvement (jusqu'à un minimum de 0), et la première fois qu'une Figurine de l'Unité Cible se Déplace à une Phase donnée, elle doit faire un Jet de Terrain Dangereux.",
  },
  {
    nom: "Athanéen",
    texte:
      "Discipline Psychique (Arcane de Prospero) des Thousand Sons : une Figurine qui la possède gagne l'Arme Psychique Manifestation de l'Effroi, le Pouvoir Psychique Clarté, et le Trait « Athanéen ».",
  },
  {
    nom: "Clarté",
    texte:
      "Pouvoir Psychique (Bénédiction) qui retire un Statut Tactique à une Unité amie. Le Joueur Actif peut le Manifester à la Sous-phase des Effets de la Phase de Début. Le Focus doit être une Figurine ayant le Trait Athanéen sous le contrôle du Joueur Actif ; la Cible est une Unité amie, entièrement composée de Figurines ayant le Trait Thousand Sons, dont au moins une Figurine se trouve à 18 pouces et en Ligne de Vue du Focus. En cas de réussite, ses effets sont résolus immédiatement : le Joueur en Contrôle choisit un seul Statut Tactique subi par une Figurine de l'Unité Cible, et on le retire immédiatement à toutes les Figurines de l'Unité Cible.",
  },
  {
    nom: "Pyrae",
    texte:
      "Discipline Psychique (Arcane de Prospero) des Thousand Sons : une Figurine qui la possède gagne le Pouvoir Psychique Bouclier Incandescent, l'Arme Psychique Étreinte Brûlante, et le Trait « Pyrae ».",
  },
  {
    nom: "Bouclier Incandescent",
    texte:
      "Pouvoir Psychique (Bénédiction) qui permet à une Unité d'infliger des Touches automatiques à toute Unité qui l'attaque en Mêlée. Le Joueur Actif peut le Manifester à la fin de l'Étape Déclarer les Armes et Définir les Rangs d'Initiative d'un Combat. Le Focus doit être une Figurine ayant le Trait Pyrae impliquée dans ce Combat ; la Cible est son Unité, entièrement composée de Figurines ayant le Trait Thousand Sons. En cas de réussite, ses effets durent jusqu'à la résolution du Combat : toutes les Figurines de l'Unité Cible gagnent la Règle Spéciale Bouclier Incandescent — à la fin de chaque Rang d'Initiative, toute Unité ayant infligé des Touches à une Unité comprenant au moins une Figurine ayant cette Règle Spéciale subit D6 Touches avec une Force de 4, une PA de -, et des Dégâts de 1, allouées par le Joueur en Contrôle de l'Unité qui les subit.",
  },
  {
    nom: "Raptora",
    texte:
      "Discipline Psychique (Arcane de Prospero) des Thousand Sons : une Figurine qui la possède gagne l'Arme Psychique Force Écrasante, la Réaction Psychique Bouclier Télékinétique, et le Trait « Raptora ».",
  },
  {
    nom: "Bouclier Télékinétique",
    texte:
      "Réaction Psychique (Bénédiction) qui donne à une Unité un Jet de Mitigation de Dégâts de Dissimulation. Le Joueur Réactif peut la déclarer au début de l'Étape 3 d'une Attaque de Tir faite par le Joueur Actif qui cible une Unité incluant au moins une Figurine ayant le Trait Raptora (Coût : 1 Point d'Attribution de Réactions, payé seulement si le Test de Volonté est réussi). Le Focus doit être une Figurine ayant le Trait Raptora de l'Unité ciblée ; la Cible est cette même Unité, entièrement composée de Figurines ayant le Trait Thousand Sons. En cas de réussite, ses effets durent jusqu'à la fin de la Sous-phase : toutes les Figurines de l'Unité Cible gagnent un Jet de Mitigation de Dégâts de Dissimulation de 4+ contre toute Blessure subie.",
  },

  /* --- Décurion de Légion (livre d'armée, amélioration de Figurine de
     Type Véhicule sélectionnées : Predator, Sicaran, Char d'Assaut
     Kratos — voir optionsDecurionLegion dans js/unites-data.js et
     pages/unites.html #decurion). Defensor et Locus sont ouverts à
     toute Légion ; Sagittar (Imperial Fists) et Lanius (Sons of
     Horus) sont réservés au Trait de Légion indiqué. --- */
  {
    nom: "Décurion Defensor",
    texte:
      "Amélioration de Décurion de Légion (Predator, Sicaran, Char d'Assaut Kratos), ouverte à toute Légion : requiert que la Figurine soit dotée d'une Arme sur Pivot autre qu'un Lanceur Havoc sur Pivot. Une Figurine qui la possède gagne la Règle Spéciale « Défense de Point ».",
  },
  {
    nom: "Décurion Locus",
    texte:
      "Amélioration de Décurion de Légion (Predator, Sicaran, Char d'Assaut Kratos), ouverte à toute Légion. Une Figurine qui la possède gagne un scanner augure et la Règle Spéciale « Frappe Localisée ».",
  },
  {
    nom: "Décurion Sagittar",
    texte:
      "Amélioration de Décurion de Légion (Predator, Sicaran, Char d'Assaut Kratos), réservée au Trait de Légion Imperial Fists : requiert l'absence de toute Arme sur Pivot. Une Figurine qui la possède gagne un canon d'assaut Iliastus sur Pivot (avec Antiaérien et Précision (6+)) et un scanner augure.",
  },
  {
    nom: "Décurion Lanius",
    texte:
      "Amélioration de Décurion de Légion (Predator, Sicaran, Char d'Assaut Kratos), réservée au Trait de Légion Sons of Horus : requiert l'absence de toute Arme sur Pivot. Une Figurine qui la possède gagne un canon à bolts Banestrike sur Pivot et la Règle Spéciale « Mise au Pas Brutal ».",
  },
  {
    nom: "Défense de Point",
    texte:
      "Quand une Figurine ayant cette Règle Spéciale est la Cible d'une Charge, à l'Étape 4 de la Procédure de Charge, une Figurine ayant cette Règle Spéciale peut faire une Attaque de Volée supplémentaire. Cette Attaque de Volée supplémentaire se fait comme une Attaque de Tir séparée, après avoir résolu sa première Attaque de Volée, et le Joueur en Contrôle ne peut choisir qu'une Arme sur Pivot pour faire des attaques au cours de cette seconde Attaque de Volée. Si la moindre Figurine est Retirée comme Perte suite aux Attaques de Tir de cette Figurine au cours de cette Attaque de Volée, l'Unité Assaillante soustrait 1 au résultat de tout Jet de Charge fait à cette Phase.",
  },
  {
    nom: "Frappe Localisée",
    texte:
      "Quand on effectue une Réaction Répliquer pour une Figurine ayant cette Règle Spéciale, on traite toutes ses Armes de Tourelle comme des Armes Défensives quelles que soient leurs Caractéristiques. Si l'Arme de Tourelle d'une Figurine ayant cette Règle Spéciale est déjà une Arme Défensive, le Joueur en Contrôle de la Figurine peut à la place ajouter +1 aux Jets de Touche faits pour le Groupe de Tirs de l'Arme quand il effectue cette Réaction.",
  },
  {
    nom: "Mise au Pas Brutal",
    texte:
      "Une Figurine ayant cette Règle Spéciale peut cibler une Unité amie avec une Attaque de Tir, et l'Unité ciblée perd le Statut Tactique En Déroute. Au début de la Sous-phase de Déplacement, le Joueur en Contrôle d'une Figurine ayant cette Règle Spéciale peut choisir une Unité de son Armée ayant le Statut Tactique En Déroute qui se trouve à 12 pouces de la Figurine ayant cette Règle Spéciale. S'il le fait, la Figurine ayant cette Règle Spéciale fait immédiatement une Attaque de Tir, qui ne cible que l'Unité choisie, avec le canon à bolts Banestrike seulement. Cette Attaque de Tir n'entraîne aucun Test de Commandement. Une fois cette Attaque de Tir résolue, l'Unité Cible perd le Statut Tactique En Déroute.",
  },

  /* --- Arsenal des Solar Auxilia (Liber Auxilia) : étendards de
     tercio et réseau vox, non transcrits ailleurs sur ce site (voir
     js/organigramme-data.js, Unités Solar Auxilia non transcrites).
     --- */
  {
    nom: "Vexillum Auxilia",
    texte:
      "Un vexillum auxilia fait passer de 25 % à 50 % le seuil de Pertes qui déclenche un Test de Panique pour l'Unité à la Phase de Tir.",
  },
  {
    nom: "Vexillum des Cohortes",
    texte:
      "Un vexillum des cohortes fait passer de 25 % à 50 % le seuil de Pertes qui déclenche un Test de Panique pour l'Unité à la Phase de Tir, et il retire le Statut Tactique En Déroute aux Unités Solar Auxilia quand elles achèvent un Mouvement de Retraite dans les 12 pouces.",
  },
  {
    nom: "Vox Internodal",
    texte:
      "Permet de retirer des Statuts à la Phase de Début. Si une Figurine amie sur le Champ de Bataille est dotée d'un vox d'état-major, le Joueur en Contrôle peut activer un vox internodal une fois par Tour de Joueur pour retirer un seul Statut à toutes les Figurines de l'Unité dotée de ce vox internodal.",
  },
  {
    nom: "Bombardement de Précision",
    texte:
      "Réduit la distance de Déviation des Attaques de Tir faites par les Figurines voisines ayant le Trait Tercio d'Artillerie, en soustrayant la Capacité de Tir de la Figurine attaquante au résultat total des Dés jetés pour connaître la distance de Déviation.",
  },
  {
    nom: "Combat Blindé",
    texte:
      "Les Figurines ayant cette Règle Spéciale confèrent la Règle Spéciale Autoréparation (4+) aux Figurines voisines qui ont le Trait Tercio Blindé.",
  },
  {
    nom: "Lance-leurres",
    texte:
      "Une Figurine dotée de lance-leurres gagne un Jet de Mitigation de Dégâts de Dissimulation de 5+ contre toute Touche infligée au cours d'une Réaction Interception.",
  },

  /* --- Arsenal des Solar Auxilia (Liber Auxilia) : Règles Spéciales
     d'Unité, transcrites depuis des scans à l'impression dense — texte
     condensé au mécanisme central plutôt que reproduit mot pour mot ;
     à revérifier contre le livre en cas de doute. --- */
  {
    nom: "Ordre Serré",
    texte:
      "Une Figurine ayant cette Règle Spéciale et le Trait Tercio d'Infanterie augmente de +1 la valeur de X de la variante Ligne (X) que possèdent les autres Figurines amies de la même Unité.",
  },
  {
    nom: "Tenir la Ligne",
    texte:
      "Une Figurine ayant cette Règle Spéciale et le Trait Tercio Véletaris confère la Règle Spéciale Ligne (X) aux autres Figurines amies de la même Unité, X étant égal au nombre de Figurines de l'Unité.",
  },
  {
    nom: "Frappe Préventive",
    texte:
      "Avant que les unités de manœuvre ennemies n'aient le temps de se déployer, les Sections d'Éclaireurs Hermes qui ont le Trait Tercio d'Éclaireurs gagnent la Règle Spéciale Orage de Feu tant qu'aucune Figurine amie ayant cette Règle Spéciale ne se trouve à moins de 18\" d'une Figurine ennemie.",
  },
  {
    nom: "Lance-grenade Hermes",
    texte:
      "À l'Étape de Volée de la Procédure de Charge, une Figurine dotée d'un lance-grenade Hermes peut faire une attaque unique avec le profil Frag ou Krak de cette Arme, à la place d'une Attaque de Tir normale.",
  },
  {
    nom: "État-major Suprême de Cohorte",
    texte:
      "Si le Détachement Principal d'une Armée est issu de la Liste d'Armée des Solar Auxilia et inclut au moins une Figurine ayant ce Trait, l'Armée gagne un Point de Réaction bonus.",
  },

  /* --- Réactions Avancées et Posture des Solar Auxilia (Liber
     Auxilia, p. 106-108), accessibles à toute Unité/Figurine qui a le
     Trait Solar Auxilia. Condensées au mécanisme central (Déclencheur/
     Coût/Cible/Processus fondus en un seul texte) plutôt que
     reproduites in extenso, comme les autres Réactions Avancées déjà
     présentes ci-dessus (Frappe Fatale, Chercheur d'Expiation…). --- */
  {
    nom: "Formez les Rangs !",
    texte:
      "Réaction Avancée des Solar Auxilia qui resserre les rangs d'une Unité pour lui conférer une Sauvegarde Invulnérable temporaire. Le Joueur Réactif peut la déclarer à la Sous-phase de Déplacement de la Phase de Mouvement pour une Unité sous son contrôle dont la moindre Figurine a le Trait Solar Auxilia (coût : 1 Point d'Attribution de Réactions). Chaque Figurine de l'Unité Réactive se Déplace pour finir en Contact Socle à Socle avec au moins deux autres Figurines de la même Unité ; l'Unité gagne alors une Sauvegarde Invulnérable de 5+ contre toutes les Attaques de Tir pour le reste du Tour du Joueur Actif.",
  },
  {
    nom: "Appui Feu !",
    texte:
      "Réaction Avancée qui éloigne une Unité du danger en ripostant avec une Arme de Barrage amie. Le Joueur Réactif peut la déclarer à l'Étape 3 d'une Attaque de Tir faite par le Joueur Actif contre une Unité sous son contrôle uniquement composée de Figurines qui ont le Trait Solar Auxilia (coût : 1 Point d'Attribution de Réactions) : l'Unité Cible se Déplace de sa Caractéristique d'Initiative en pouces en s'éloignant, puis une seule Figurine amie dotée d'une Arme ayant la Règle Spéciale Barrage (X) et à 12 pouces de la Cible fait aussitôt une Attaque de Tir contre l'Unité qui a déclenché la Réaction.",
  },
  {
    nom: "Baïonnettes aux Canons !",
    texte:
      "Réaction Avancée qui permet à une Unité de Solar Auxilia de riposter à la baïonnette contre une Charge ratée. Le Joueur Réactif peut la déclarer à la fin de l'Étape 5 d'une Charge dont le Jet de Charge a échoué, pour l'Unité qui en était la Cible, composée uniquement de Figurines qui ont le Trait Solar Auxilia (coût : 1 Point d'Attribution de Réactions) : chaque Figurine de l'Unité Réactive dotée d'une Arme ayant le Trait Baïonnette fait ses attaques de mêlée contre l'Unité Assaillante au Rang d'Initiative correspondant, les Figurines Retirées comme Pertes comptant pour la Résolution de Combat.",
  },
  {
    nom: "Salve Méprisante",
    texte:
      "Posture de Défi des Solar Auxilia qui permet de répondre au pistolet plutôt qu'au corps à corps. Une Figurine engagée en Défi qui a le Trait Solar Auxilia peut choisir cette Posture pour faire une unique Attaque de Tir au pistolet contre la Figurine adverse en Défi, dont les Blessures ne peuvent être allouées qu'à cette dernière. Si cette Attaque de Tir la retire comme Perte, on passe directement à l'Étape de Gloire sans Jet de Concentration ; sinon, l'Adversaire gagne automatiquement l'Avantage en Défi.",
  },

  /* --- Doctrines de Cohorte (Liber Auxilia, p. 11-16) : un unique
     choix optionnel par Armée Solar Auxilia (menu « Doctrine de
     Cohorte », js/organigramme.js). Tactica de Cohorte et Détachements
     Additionnels condensés en un seul texte par Doctrine. --- */
  {
    nom: "Cohorte Ultima",
    texte:
      "Doctrine de Cohorte axée sur la masse d'infanterie. Les Figurines ayant le Trait Solar Auxilia d'une Armée qui adhère à cette Doctrine suivent la Règle Spéciale Manœuvres Coordonnées : à chaque Phase de Mouvement, de Tir et d'Assaut, la première Réaction déclarée dont l'Unité Réactive est une Section de Ryeliers a un coût en Points de Réaction modifié de -1 (minimum 0), et une Section de Ryeliers peut effectuer une Réaction de plus par Phase pour un Point d'Attribution de Réactions de moins. Débloque, pour chaque Détachement Auxiliaire de Tercio d'Infanterie de la Feuille d'Armée, un Détachement Auxiliaire de Tercio d'Infanterie supplémentaire sans occuper de Case d'État-major.",
  },
  {
    nom: "Cohorte Solaire",
    texte:
      "Doctrine de Cohorte axée sur l'assaut débarqué. Les Figurines ayant le Trait Solar Auxilia et la Règle Spéciale Avant-garde (X) d'une Armée qui adhère à cette Doctrine ne rendent pas Désordonnée une Charge déclarée pour une Unité entièrement composée de telles Figurines au Tour de Joueur où elle Débarque d'un Dracosan. Débloque, pour chaque Détachement Auxiliaire de Tercio Veletaris de la Feuille d'Armée, un Détachement Auxiliaire de Tercio Veletaris supplémentaire sans occuper de Case d'État-major.",
  },
  {
    nom: "Cohorte de Reconnaissance",
    texte:
      "Doctrine de Cohorte axée sur les escadrons de Sentinelles. Les Figurines de Type Cavalerie ayant le Trait Solar Auxilia d'une Armée qui adhère à cette Doctrine peuvent Contrôler ou Contester des Objectifs, se déplacer plus loin au cours d'une Réaction Se Dérober, et portent leur Caractéristique d'Initiative à 5 pour cette Réaction. Débloque, pour chaque Détachement Auxiliaire de Tercio d'Éclaireurs de la Feuille d'Armée, un Détachement Auxiliaire de Tercio d'Éclaireurs supplémentaire sans occuper de Case d'État-major.",
  },
  {
    nom: "Cohorte Mécanisée",
    texte:
      "Doctrine de Cohorte axée sur le soutien blindé. Les Figurines de Type Véhicule (hors Sous-type Aéronef) ayant le Trait Solar Auxilia d'une Armée qui adhère à cette Doctrine peuvent se Déplacer tout en bénéficiant de la Règle Spéciale Lourde (X) ; si elles ne se déplacent pas de plus de 4 pouces à la Phase de Mouvement et ne Foncent pas, elles comptent comme étant à l'Arrêt ce Tour pour toute variante Lourde (X) de leurs Armes. Débloque, pour chaque Détachement Auxiliaire de Tercio Blindé de la Feuille d'Armée, un Détachement Auxiliaire de Tercio Blindé supplémentaire sans occuper de Case d'État-major.",
  },
  {
    nom: "Cohorte de Siège",
    texte:
      "Doctrine de Cohorte axée sur l'artillerie lourde. Les Figurines ayant le Trait Solar Auxilia d'une Armée qui adhère à cette Doctrine améliorent de +1 la valeur de X de la Règle Spéciale Fixation (X) de leurs Armes ayant la Règle Spéciale Barrage (X), et de toute Arme dotée à la fois de Barrage (X) et Fixation (X). Débloque, pour chaque Détachement Auxiliaire de Tercio d'Artillerie de la Feuille d'Armée, un Détachement Auxiliaire de Tercio d'Artillerie supplémentaire sans occuper de Case d'État-major.",
  },
  {
    nom: "Cohorte de Fer",
    texte:
      "Doctrine de Cohorte qui intègre des automates du Mechanicum aux Sections de Ryeliers. Chaque Figurine d'une Unité de Section de Ryeliers d'une Armée qui adhère à cette Doctrine gagne la Règle Spéciale Sacrifiable (1). Débloque le Détachement Auxiliaire de Tercio de Fer, qui permet de sélectionner des Unités de Manipule Castellax Destructor, de Technoprêtre, de Manipule de Combat Castellax ou de Cohorte Thallax (Liber Mechanicum, non transcrites sur ce site) — les Figurines sélectionnées y remplacent leur Trait [Mechanicum]/Cybernetica/Reductor par le Trait de Faction Tercio de Fer.",
  },

  /* --- Réactions Avancées « Legiones Auxilia » (livre Legiones
     Auxilia intégré au Liber Auxilia, p. 70-84) : accessibles quand une
     Armée Solar Auxilia adopte la Désignation de Legiones Auxilia
     correspondante, réservée aux Détachements Principaux dont la
     moindre Figurine n'a pas d'autre Trait [Legiones Astartes] que
     celui de la Légion indiquée. Non câblées à un sélecteur dédié sur
     ce site (contrairement au Rite de Guerre) : condensées ici en
     référence, une par Légion transcrite dans ce livre. --- */
  {
    nom: "Combinaison Interarmes",
    texte:
      "Réaction Avancée de la Désignation de Legiones Auxilia Haute Garde d'Ultramar (XIIIe Légion, Ultramarines). Le Joueur Réactif peut la déclarer au début de l'Étape 3 d'une Attaque de Tir du Joueur Actif contre une Unité sous son contrôle composée uniquement de Figurines qui ont le Trait Solar Auxilia (coût : 1 Point d'Attribution de Réactions). L'Unité Réactive fait aussitôt une Attaque de Tir contre l'Unité Assaillante ; si elle lui fait perdre au moins un Point de Vie après Sauvegardes et Mitigations, la Charge de cette dernière devient aussitôt une Charge Désordonnée.",
  },
  {
    nom: "Perdurer",
    texte:
      "Réaction Avancée de la Désignation de Legiones Auxilia Ambaxtoi de Barbarus (XIVe Légion, Death Guard). Le Joueur Réactif peut la déclarer à la Phase de Tir, à la fin de l'Étape 11 d'une Attaque de Tir du Joueur Actif qui entraînerait un Test de Panique pour Pertes contre une Unité sous son contrôle composée uniquement de Figurines de Type Infanterie qui ont le Trait Solar Auxilia mais pas la Règle Spéciale Massif (X) (coût : 1 Point d'Attribution de Réactions), pour éviter ce Test : l'Unité Réactive fait ensuite une Attaque de Tir au Jugé contre une Unité ennemie en Ligne de Vue au choix du Joueur Réactif, puis le Test de Panique évité est résolu normalement.",
  },
  {
    nom: "Diversion",
    texte:
      "Réaction Avancée de la Désignation de Legiones Auxilia Vindictaires Sparatoi (XXe Légion, Alpha Legion). Le Joueur Réactif peut la déclarer à l'Étape 3 d'une Attaque de Tir du Joueur Actif contre une Unité sous son contrôle composée uniquement de Figurines de Type Infanterie qui ont le Trait Solar Auxilia mais pas la Règle Spéciale Massif (X) (coût : 1 Point d'Attribution de Réactions), si une autre Unité amie sans Massif (X) se trouve à 12 pouces et est à portée de toutes les Armes déclarées par le Joueur Actif : le Joueur Actif doit aussitôt faire un Test de Sang-froid pour l'Unité Cible d'origine ; s'il échoue, l'Attaque de Tir se poursuit contre cette autre Unité, désormais Cible à sa place.",
  },
  {
    nom: "Déplacement",
    texte:
      "Réaction Avancée de la Désignation de Legiones Auxilia Vélites de Therion (XIXe Légion, Raven Guard). Le Joueur Réactif peut la déclarer au début de l'Étape 4 du processus de Charge de n'importe quelle Charge déclarée par le Joueur Actif qui cible une Unité sous son contrôle composée uniquement de Figurines de Type Infanterie qui ont le Trait Solar Auxilia mais pas la Règle Spéciale Massif (X) (coût : 1 Point d'Attribution de Réactions) : l'Unité Réactive se Déplace jusqu'à sa Caractéristique d'Initiative en pouces en Cohésion, puis fait une Attaque de Volée contre l'Unité qui a déclaré la Charge, ses Armes de Tir gagnant le Trait Assaut pour l'occasion, avant que le Joueur Actif ne passe normalement à l'Étape 4 de la Charge.",
  },
  {
    nom: "Harangue du Maître de Guerre",
    texte:
      "Réaction Avancée de la Désignation de Legiones Auxilia Chasseurs de Têtes Cthoniens (XVIe Légion, Sons of Horus). Le Joueur Réactif peut la déclarer à la Sous-phase de Déroute de la Phase de Mouvement, quand une Unité sous son contrôle composée uniquement de Figurines qui ont le Trait Solar Auxilia fait son Mouvement de Retraite (coût : 1 Point d'Attribution de Réactions) : cette Unité fait un Déplacement vers une ou plusieurs Unités ennemies voisines au lieu de Foncer normalement, puis chaque Unité amie composée uniquement de Figurines ayant le Trait Solar Auxilia à 12 pouces peut à son tour se Déplacer d'un nombre de pouces égal à sa Caractéristique d'Initiative, en Cohésion, ce Déplacement comptant comme une Réaction à ce Tour de Bataille.",
  },
  {
    nom: "Choc Psy",
    texte:
      "Réaction Avancée de la Désignation de Legiones Auxilia Gardespire Prosperienne (XVe Légion, Thousand Sons). Le Joueur Réactif peut la déclarer à la Phase de Tir, à la fin de l'Étape 11 d'une Attaque de Tir du Joueur Actif qui entraînerait un Test de Panique pour Pertes contre une Unité sous son contrôle composée uniquement de Figurines de Type Infanterie qui ont le Trait Solar Auxilia mais pas la Règle Spéciale Massif (X) (coût : 1 Point d'Attribution de Réactions) : l'Unité Réactive subit aussitôt un résultat du Tableau des Périls du Warp, puis on résout immédiatement un autre résultat du Tableau des Périls du Warp contre l'Unité qui a fait l'Attaque de Tir, avant que la Phase de Tir du Joueur Actif ne continue normalement.",
  },

  /* --- Arsenal des Taghmata du Mechanicum (Liber Mechanicum) : Règles
     Spéciales d'Unité citées par les profils du livre. --- */
  {
    nom: "Méditation Martiale",
    texte:
      "Une Figurine ayant cette Règle Spéciale peut relancer un Jet de Concentration raté en Défi, une fois par Défi.",
  },
  {
    nom: "Rite de la Pensée Pure",
    texte:
      "Une Figurine ayant cette Règle Spéciale ignore les effets de la Règle Spéciale Peur (X), et ne peut jamais gagner le Statut Tactique En Déroute : elle est Retirée comme Perte à la place si elle devait le gagner.",
  },
  {
    nom: "Égide de Souffrance",
    texte:
      "Une Figurine ayant cette Règle Spéciale ignore les modificateurs négatifs à ses Caractéristiques dus à une perte de Points de Vie.",
  },
  {
    nom: "Boucliers Réfracteurs Phasés",
    texte:
      "Une Figurine ayant cette Règle Spéciale gagne une Sauvegarde Invulnérable de 5+.",
  },
  {
    nom: "Compact",
    texte:
      "Une Figurine ayant cette Règle Spéciale ne bloque pas les Lignes de Vue, et ne peut être choisie comme Cible d'une Attaque de Tir tant qu'une autre Figurine de Type non-Automate de son Unité est plus proche du tireur et en Ligne de Vue.",
  },
  {
    nom: "Autonomie Limitée",
    texte:
      "Une Unité entièrement composée de Figurines ayant cette Règle Spéciale ne peut jamais Contrôler ni Contester un Objectif, et ne peut pas être choisie comme Cible d'une Charge tant qu'une autre Unité ennemie est une Cible valide.",
  },
  {
    nom: "Automates Réparateurs",
    texte:
      "Au lieu de faire une Attaque de Tir ou de Mêlée, une Figurine ayant cette Règle Spéciale peut tenter de réparer une Figurine amie de Type Véhicule ou Automate à 3 pouces, comme la Règle Spéciale Guerrier-artisan (2).",
  },
  {
    nom: "Maître des Machines",
    texte:
      "Une Figurine ayant cette Règle Spéciale peut relancer une fois par Rite invoqué un Test d'Invocation raté pour un Rite Cybertheurgique qu'elle connaît.",
  },
  {
    nom: "Trône de Commandement",
    texte:
      "Une Figurine ayant cette Règle Spéciale confère un bonus de +1 aux Tests de Commandement des Figurines amies à 12 pouces qui ont un Trait de Faction Mechanicum.",
  },
  {
    // Arme de personnage (Archimagos Draykavac, Mechanicum).
    nom: "Héritage de Ruse",
    texte:
      "Une Figurine ayant cette Règle Spéciale peut être retirée du jeu sans donner de Point de Victoire à l'Adversaire. À la Sous-phase des Effets de la Phase de Fin de n'importe quel Tour où le Joueur en Contrôle est le Joueur Actif, il a le droit d'activer cette Règle Spéciale (impossible si la Figurine est Verrouillée en Combat) : on fait un Test de Sang-froid pour elle, avec +1 par Unité ennemie à 12\", +1 par Statut Tactique (hors En Déroute) auquel elle est sujette, et -2 si elle est sujette au Statut Tactique En Déroute. Si le Test est réussi, la Figurine est aussitôt retirée du jeu sans compter comme Perte ; s'il est raté, il ne se passe rien et on pourra retenter à un Tour ultérieur.",
  },
  {
    // Arme de personnage (Archimagos Draykavac, Mechanicum).
    nom: "Assaut au Liquifractor",
    texte:
      "Posture disponible à une Figurine qui a cette Règle Spéciale tant qu'elle est engagée en Défi. Si elle la choisit, le Joueur en Contrôle jette un Dé additionnel à l'Étape de Concentration et défausse le résultat le plus élevé ; puis, à l'Étape de Frappe, la Figurine fait une Attaque de Tir avec son Liquifractor avant que le protagoniste et l'antagoniste ne fassent la moindre attaque. Cette Attaque de Tir doit cibler la Figurine adverse en Défi et toutes les Blessures infligées doivent lui être allouées ; on considère qu'elle se trouve à une portée de 1\" et en Ligne de Vue.",
  },
  {
    nom: "Contrôleur (X)",
    texte:
      "Une Figurine ayant le Trait Cybertheurge et cette Règle Spéciale peut Invoquer jusqu'à X Rites Cybertheurgiques par Tour de Bataille, au lieu d'un seul.",
  },

  /* --- Cybertheurgie (Liber Mechanicum, p. 53-65) : condensée au
     mécanisme central plutôt que reproduite in extenso — le livre
     reste la référence en cas de doute. --- */
  {
    nom: "Cybertheurge",
    texte:
      "Seule une Figurine qui a ce Trait peut Invoquer un Rite Cybertheurgique, et seulement un Rite qu'elle connaît (listé sur son Profil ou pris en Option). Une fois par Tour de Bataille, en tant que Joueur Actif, elle peut Invoquer un Rite Cybertheurgique qu'elle connaît, avant son propre Déplacement, avant une de ses Attaques de Tir, ou avant de déclarer une Charge pour son Unité — via un Test d'Invocation (Test d'Intelligence modifié par la Difficulté du Rite et divers facteurs de Ligne de Vue/portée/Trait), qui applique les effets du Rite à l'Unité Cible en cas de réussite.",
  },
  {
    nom: "Rétroaction Cybertheurgique",
    texte:
      "Certains Rites ou Statuts Cybertheurgiques infligent une Rétroaction Cybertheurgique à une Unité : chaque Figurine subit 1 Blessure avec une PA de « - » et des Dégâts de 1, sans Jet de Blessure ni Sauvegarde de Couvert/Invulnérable (Sauvegardes d'Armure autorisées). Une Figurine de Type Véhicule ne subit qu'une seule Touche Superficielle par Rétroaction Cybertheurgique, sans Jet de Pénétration de Blindage.",
  },
  {
    nom: "Statut Cybertheurgique : Accélérer",
    texte:
      "Une Figurine sujette à ce Statut gagne +1 à ses Caractéristiques de Mouvement et d'Initiative (ou +3 à sa Caractéristique de Mouvement si elle en a une de Base 0 ou « - », sans effet si elle n'en a pas).",
  },
  {
    nom: "Statut Cybertheurgique : Fortifier",
    texte:
      "Une Figurine sujette à ce Statut gagne +1 à ses Caractéristiques de Force et d'Endurance (ou +1 à la Valeur de Blindage d'une Face choisie par le Joueur en Contrôle si elle n'a pas de Caractéristique d'Endurance, sans dépasser 14).",
  },
  {
    nom: "Statut Cybertheurgique : Guider",
    texte:
      "Une Figurine sujette à ce Statut gagne +1 à ses Caractéristiques de Capacité de Tir et de Capacité de Combat.",
  },
  {
    nom: "Statut Cybertheurgique : Négation",
    texte:
      "Une Figurine sujette à ce Statut Cybertheurgique Hétérodoxe ne gagne ni bonus ni malus. Quand il s'applique à au moins une Figurine d'une Unité, on défausse tous les autres Statuts Cybertheurgiques de l'ensemble des Figurines de ladite Unité (Rétroaction Cybertheurgique immédiate, qu'il y en ait eu ou non), et aucune de ces Figurines ne peut gagner de nouveau Statut Cybertheurgique tant qu'au moins une Figurine de l'Unité reste sujette à Négation.",
  },
  {
    nom: "Hétérodoxe",
    texte:
      "Une Figurine qui a ce Trait doit avoir le Trait d'Allégeance Renégat, et peut sélectionner des Rites/Statuts Cybertheurgiques Hétérodoxes en plus des Rites Standard/de Sous-faction qu'elle connaît déjà. Une Figurine qui a le Trait Malagra ne peut jamais avoir le Trait Hétérodoxe.",
  },
  {
    nom: "Maléfique",
    texte:
      "Une Unité entièrement composée de Figurines de ce Sous-type ne peut jamais gagner de Statut Tactique, et ne peut être Ralliée que par une Figurine qui peut elle-même gagner des Statuts Tactiques et se retrouver En Déroute ; quand elle est censée gagner un Statut Tactique, elle subit à la place D3 Blessures automatiques (PA 2, Dégâts 1, aucune Sauvegarde possible). Les Figurines de ce Sous-type ne sont pas affectées par les Règles Spéciales qui modifient négativement leur Commandement, leur Volonté ou leur Intelligence, et aucune Figurine qui n'est pas elle-même Maléfique ne peut rejoindre, ni être rejointe par, une telle Figurine.",
  },

  /* --- Techno-arcanes Majeurs (Liber Mechanicum, p. 45-51) : chacun
     confère un Bénéfice d'Arcane passif et débloque un Détachement
     d'Apex thématique quand une Figurine de Rôle Tactique Quartier
     Général qui a ce Trait est incluse dans l'Armée (voir js/
     organigramme-data.js — non câblé en Détachement interactif ici,
     le débloqueur étant un Trait choisi en Option et non une Unité
     précise). Options d'Arcane (avantages/postures propres à chaque
     Techno-arcane) condensées dans le même paragraphe. --- */
  {
    nom: "Archimandrite",
    texte:
      "Techno-arcane Majeur : Bénéfice d'Arcane L'Engramme d'Autorité (+1 aux Caractéristiques de Base de Commandement et de Sang-froid, et peut rejoindre des Unités d'un Trait de Faction différent sans pénalité). Option d'Arcane Theurgika Maximus (+10 Points, Quartier Général seulement) : la Figurine peut Invoquer deux Rites Cybertheurgiques par Tour, en ignorant les restrictions de Trait de Faction. Débloque le Détachement d'Apex Le Cœur du Pouvoir (Suites) si une Figurine Archimandrite occupe une Case de Quartier Général.",
  },
  {
    nom: "Cybernetica",
    texte:
      "Techno-arcane Majeur : Bénéfice d'Arcane Le Deus Machina (une Unité qui inclut au moins un Archimagos/Magos/Technoprêtre et une Figurine de Type Automate qui ont ce Trait peut Contrôler ou Contester un Objectif). Avantage Principal du Mechanicum Parangon de Métal (Unité entièrement Cybernetica seulement) : +4 Commandement/Intelligence/Volonté, +1 Initiative/Capacité de Combat et Sous-type Sergent à une Figurine. Débloque le Détachement d'Apex Manipule de Commandement (Elite, Automates uniquement) si une Figurine Cybernetica occupe une Case de Quartier Général.",
  },
  {
    nom: "Lacrymaerta",
    texte:
      "Techno-arcane Majeur : Bénéfice d'Arcane Une Servitude Sans Fin (utilise Guerrier-artisan (X) pour rendre des Points de Vie aux Figurines de Type Infanterie, en plus de Coque/Véhicule/Marcheur/Automate ; les Figurines de Cénacle de Technoserfs ciblées gagnent en outre une option de Réassembler, ajoutant des Figurines à l'Unité). Avantage Principal du Mechanicum Spécimens de Choix (Unité entièrement Lacrymaerta d'Infanterie seulement) : +2 Force, +1 Points de Vie de Base. Débloque le Détachement d'Apex La Panoplie de Cruauté (Assaut Lourd, Unités de Cohorte d'Ursarax uniquement) si une Figurine Lacrymaerta occupe une Case de Quartier Général.",
  },
  {
    nom: "Myrmidax",
    texte:
      "Techno-arcane Majeur : Bénéfice d'Arcane La Force des Âges (+1 Points de Vie de Base, gagne Méditation Martiale et Avance Implacable, et Massif (3) — ou +3 à une valeur de Massif (X) déjà présente — pour le Sous-type Champion). Posture du Mechanicum La Voie du Myrmidon : Attaque de Tir bonus avant les autres attaques en Défi, avec une seule Arme dépourvue d'Explosion (X)/Souffle/Barrage. Débloque le Détachement d'Apex L'Ost de Destruction (Elite, Unités ayant le Trait Myrmidax uniquement) si une Figurine Myrmidax occupe une Case de Quartier Général.",
  },
  {
    nom: "Malagra",
    texte:
      "Techno-arcane Majeur : Bénéfice d'Arcane Même les Immortels Peuvent Avoir Peur (-1 Capacité de Combat/Capacité de Tir aux Figurines ennemies de Sous-type [Maléfique] à 12\" d'une Unité comprenant une Figurine Malagra, sans effet sur les Unités entièrement Maléfique). Posture du Mechanicum Pouvoir de l'Esprit de la Machine (répartit le bonus de la variante Guerrier-artisan (X) de la Figurine sous contrôle entre Capacité de Combat/Force/Attaques/Initiative, après un Test d'Intelligence). Débloque le Détachement d'Apex Supplice du Jugement (Quartier Général, Unités d'Arcuitor Magisterium uniquement, non liées aux Détachements Auxiliaires) si une Figurine Malagra occupe une Case de Quartier Général.",
  },
  {
    nom: "Macrotek",
    texte:
      "Techno-arcane Majeur : Bénéfice d'Arcane Protecteur de Fer (une Figurine amie de Type Véhicule non Super-lourd à 3\" d'une Figurine Macrotek gagne une Sauvegarde Invulnérable de 6+, non cumulable). Avantage Principal du Mechanicum Convoyeur Principal (Unité composée d'une seule Figurine de Type Véhicule non Super-lourd seulement) : +1 Blindage Avant/Flanc (max 14), +2 Points de Coque, et +2 Capacité de Transport si Sous-type Transport. Débloque le Détachement d'Apex Phalange de Fer (Blindés, Figurines de Type Véhicule dotées de l'Avantage Convoyeur Principal uniquement) si une Figurine Macrotek occupe une Case de Quartier Général.",
  },
  {
    nom: "Reductor",
    texte:
      "Techno-arcane Majeur : Bénéfice d'Arcane Brise-muraille (+1 à la Force de toutes les Touches infligées par une Unité comprenant une Figurine Reductor contre un Bâtiment, une Fortification ou un Véhicule à l'Arrêt ; interdit la Réaction Avancée Mur de Boucliers! pour l'Unité Cible). Avantage Principal du Mechanicum Principe Thallaxi (Unité de Cohorte de Thallax seulement) : Sauvegarde Invulnérable de Base à 5+ et +1 Commandement de Base. Débloque le Détachement d'Apex Cohorte de Commandement Thallax (Quartier Général, Unités de Cohorte de Thallax uniquement) si une Figurine Reductor occupe une Case de Quartier Général.",
  },

  /* --- Rites Cybertheurgiques nommés (Liber Mechanicum, p. 56-65) :
     chacun a une Difficulté et une Portée propres au Test d'Invocation
     (voir Cybertheurge ci-dessus), condensées ici avec l'Effet. --- */
  {
    nom: "Rite : Interruption de Programme",
    texte:
      "Rite Cybertheurgique Standard (Difficulté 4, Portée 18\") : cible une Unité amie non Verrouillée en Combat, de Type Automate/Véhicule ou ayant le Trait Cybertheurge, sans Figurine de Sous-type Super-lourd ou Chevalier. Confère à toutes ses Figurines un même Statut Cybertheurgique au choix (Accélérer, Fortifier ou Guider), retiré à la prochaine Phase de Début (avec Rétroaction Cybertheurgique s'il n'a pas servi à une Réaction).",
  },
  {
    nom: "Rite : Purge de Cogitateur",
    texte:
      "Rite Cybertheurgique Standard (Difficulté 3, Portée 12\") : cible une Unité ennemie non Verrouillée en Combat, de Type Automate/Marcheur/Véhicule ou ayant le Trait Cybertheurge. Retire aussitôt tous les Statuts Cybertheurgiques de l'Unité Cible (Rétroaction Cybertheurgique au retrait, infligeant alors 2 Blessures par Figurine au lieu d'une).",
  },
  {
    nom: "Rite : Réacteurs Suralimentés",
    texte:
      'Rite Cybertheurgique Standard (Difficulté 2, Portée 12") : mêmes Cible et effet que le Rite Interruption de Programme (Statut Accélérer, Fortifier ou Guider), mais ne peut pas cibler une Unité qui inclut une Figurine de Sous-type Super-lourd ou Chevalier ; se résout immédiatement.',
  },
  {
    nom: "Rite : Protocoles Oméga",
    texte:
      'Rite Cybertheurgique Lacrymaerta (Difficulté 4, Portée 12") : cible une Unité amie non Verrouillée en Combat, entièrement composée de Figurines Lacrymaerta. Retire tous ses Statuts Cybertheurgiques (Rétroaction Cybertheurgique au retrait) ; si une Figurine de l\'Unité Cible est Retirée comme Perte par cette Rétroaction, toutes les autres Unités présentes à 6" (amies et ennemies) subissent chacune deux Touches de Force 6, PA 5, Dégâts 1, qui ne comptent pas pour la Résolution de Combat.',
  },
  {
    nom: "Rite : Protocoles de la Chair",
    texte:
      'Rite Cybertheurgique Lacrymaerta (Difficulté 2, Portée 12") : cible une Unité amie non Verrouillée en Combat, entièrement composée de Figurines Lacrymaerta. Confère le Statut Cybertheurgique Accélérer ou Fortifier, retiré à la prochaine Phase de Début (Rétroaction Cybertheurgique au retrait).',
  },
  {
    nom: "Rite : Portail Déverrouillé",
    texte:
      "Rite Cybertheurgique Reductor (Difficulté 3, Portée 6\") : cible un Bâtiment, une Fortification, ou une Unité non Verrouillée en Combat composée d'une seule Figurine de Type Véhicule. Force toutes les Figurines Embarquées de l'Unité Cible à Débarquer d'Urgence aussitôt, puis inflige une Rétroaction Cybertheurgique à l'Unité Cible ; se résout immédiatement.",
  },
  {
    nom: "Rite : Coupure d'Antalgique",
    texte:
      'Rite Cybertheurgique Reductor (Difficulté 3, Portée 24") : cible une Unité amie non Verrouillée en Combat, entièrement composée de Figurines Reductor. Confère un même Statut Cybertheurgique au choix (Accélérer, Fortifier ou Guider), retiré à la prochaine Phase de Début (Rétroaction Cybertheurgique au retrait).',
  },
  {
    nom: "Rite : Fureur des Âges",
    texte:
      'Rite Cybertheurgique Ésotérique, réservé aux Cybertheurges Myrmidax (Difficulté 2, Portée 6") : cible une Unité amie composée uniquement de Figurines qui ont le Trait Myrmidax, y compris Verrouillée en Combat. Confère le Statut Cybertheurgique Fortifier ou Guider, retiré à la prochaine Phase de Début (Rétroaction Cybertheurgique au retrait).',
  },
  {
    nom: "Rite : Châtier l'Esprit de la Machine",
    texte:
      "Rite Cybertheurgique Ésotérique, accessible aux Cybertheurges de toute Sous-faction (Difficulté 4, Portée 18\") : cible une Unité ennemie non Verrouillée en Combat, sans Figurine de Type Parangon ni de Sous-type Super-lourd. Confère un même Statut Tactique au choix (Sonnée ou Neutralisée) à toutes les Figurines de l'Unité Cible ; si l'Invocation échoue, l'Unité qui inclut le Focus subit une Rétroaction Cybertheurgique.",
  },
  {
    nom: "Rite : Amplification Éthérique",
    texte:
      'Rite Cybertheurgique Hétérodoxe, +10 Points (Difficulté 2, Portée 6") : cible une Unité amie entièrement composée de Figurines de Sous-type Maléfique, y compris Verrouillée en Combat. Confère un même Statut Cybertheurgique au choix (Accélérer, Fortifier ou Guider), retiré à la prochaine Phase de Début (Rétroaction Cybertheurgique au retrait).',
  },
  {
    nom: "Rite : Infection d'Anticode",
    texte:
      "Rite Cybertheurgique Hétérodoxe, +10 Points (Difficulté 3, Portée 18\") : cible une Unité ennemie non Verrouillée en Combat, comprenant au moins une Figurine sujette à un Statut Cybertheurgique autre que Négation. Confère le Statut Cybertheurgique Négation à toutes les Figurines de l'Unité Cible.",
  },
];
