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
    nom: "Charge désordonnée",
    texte:
      "L'unité ne bénéficie ni du mouvement de positionnement ni de l'attaque de mêlée bonus lors de la charge.",
  },
  {
    nom: "Écran de fumée (réaction)",
    texte: "Jet de mitigation de dégâts de Dissimulation (5+) contre les tirs.",
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
    texte: "+2 pouces pour Foncer, et peut tirer au jugé après avoir foncé.",
  },
  {
    nom: "Lent et méthodique",
    texte: "Ne peut pas poursuivre un ennemi en fuite.",
  },
  {
    nom: "Lourd",
    texte:
      "+1 en Sang-froid, ne peut pas Foncer, mouvement de positionnement (charge) sans Initiative.",
  },
  {
    nom: "Marcheur",
    texte:
      "Tire avec toutes ses armes (sauf Volée). Compte comme ses PV de base pour la résolution de combat.",
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
];
