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
];
