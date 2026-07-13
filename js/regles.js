/* ============================================================
   regles.js — Règles spéciales (page regles.html)
   Les règles sont encodées en JS, rendues dynamiquement,
   et filtrées en temps réel par la barre de recherche.
   ============================================================ */

/* ----------------------------------------------------------
   DONNÉES : chaque règle = { nom, texte, exemple (optionnel) }
   ---------------------------------------------------------- */

// --- Règles spécifiques aux armes ---
const REGLES_ARMES = [
  {
    nom: "Sonner (X)",
    texte:
      "Si l'arme inflige une touche, la cible fait un test de Sang-froid avec un malus de X.",
    exemple:
      "Une arme Sonner (2) touche : la cible teste son Sang-froid à −2. En cas d'échec, elle devient Sonnée et ne peut plus réagir.",
  },
  {
    nom: "Neutralisation (X)",
    texte:
      "Si l'arme inflige une touche, la cible fait un test de Sang-froid avec un malus de X. En cas d'échec, elle est Neutralisée.",
    exemple:
      "Une escouade Neutralisée ne peut plus tirer qu'au jugé.",
  },
  {
    nom: "Fixation (X)",
    texte:
      "Si l'arme inflige une blessure (que des dégâts soient infligés ou non), la cible fait un test de Sang-froid avec un malus de X.",
    exemple:
      "Même une blessure sauvegardée déclenche le test : la pression suffit à Fixer l'ennemi sur place.",
  },
  {
    nom: "Panique (X)",
    texte:
      "Si l'arme inflige une blessure (dégâts infligés ou non), la cible fait un test de Commandement avec un malus de X.",
    exemple:
      "En cas d'échec, l'unité part En déroute. Les lance-flammes qui sèment la Panique sont efficaces contre l'infanterie légère.",
  },
  {
    nom: "Brèche (X)",
    texte:
      "Si le jet de blessure est supérieur ou égal à X, la Pénétration d'Armure (PA) de l'attaque devient 2.",
    exemple:
      "Brèche (5) : sur un jet de blessure de 5 ou 6, même une armure Terminator (2+) est menacée.",
  },
  {
    nom: "Empoisonné (X)",
    texte:
      "Le jet de blessure se fait toujours sur X, quelle que soit l'Endurance de la cible.",
    exemple:
      "Empoisonné (4+) blesse un Primarque aussi facilement qu'un simple légionnaire, quelle que soit l'Endurance de la cible.",
  },
  {
    nom: "Fléau des blindages",
    texte:
      "Contre un véhicule, une touche superficielle devient une touche pénétrante.",
    exemple:
      "Le trait typique des armes anti-char : chaque touche superficielle devient une touche pénétrante contre un véhicule.",
  },
  {
    nom: "Fusion (X)",
    texte:
      "Si la cible est à portée de X, les Dégâts sont doublés et l'arme gagne Fléau des blindages.",
    exemple:
      "Un Multi-fusion à mi-portée double ses Dégâts et gagne Fléau des blindages contre un véhicule.",
  },
  {
    nom: "Impact (X)",
    texte: "Lors d'une charge, la figurine gagne +1 à la caractéristique X.",
    exemple:
      "Impact (Force) : la figurine frappe plus fort au premier round de mêlée après une charge.",
  },
  {
    nom: "Lacération (X)",
    texte:
      "Si le jet de blessure est supérieur ou égal à X : +1 dégât (sauf sur un jet de pénétration de blindage).",
    exemple: "Lacération (5) : un jet de blessure de 5 ou 6 inflige un dégât supplémentaire.",
  },
  {
    nom: "Lourde (X)",
    texte: "Si le tireur est à l'arrêt : +1 à la caractéristique X.",
    exemple:
      "Un canon Lourde (Cadence) tire un coup de plus si la figurine n'a pas bougé ce tour-ci.",
  },
  {
    nom: "Précision (X)",
    texte:
      "Si le jet de touche est supérieur ou égal à X, c'est l'attaquant qui choisit quelle figurine subit la blessure.",
    exemple:
      "Sur un jet suffisant, l'attaquant peut cibler directement le sergent adverse ou le porteur d'arme spéciale.",
  },
  {
    nom: "Touche critique (X)",
    texte:
      "Un jet de touche élevé (X ou plus, avant modificateur) devient une Touche Critique : elle blesse automatiquement, sans jet de blessure, et inflige 1 dégât de plus.",
    exemple:
      "Un tir suffisamment précis transforme le coup en frappe fatale, portée droit au défaut de la cuirasse.",
  },
  {
    nom: "Vulnérante (X)",
    texte:
      "Un jet de touche élevé (X ou plus, avant modificateur) devient une Touche Vulnérante : elle blesse automatiquement, sans jet de blessure, en gardant la PA et les Dégâts de l'arme.",
    exemple:
      "Une lame ou une munition si tranchante qu'elle ouvre la chair sans effort, quelle que soit la robustesse de la cible.",
  },
  {
    nom: "Antiaérien",
    texte:
      "Contre un Aéronef, l'arme touche normalement avec la CT du tireur au lieu de tirer au jugé — y compris en Réaction. Sans effet si l'unité tireuse a un statut tactique.",
    exemple:
      "Une DCA dédiée garde toute sa précision contre les appareils volants, là où les autres armes tirent à l'aveuglette.",
  },
  {
    nom: "Artillerie (X)",
    texte:
      "Double la valeur de la caractéristique X si le tireur est resté à l'arrêt au tour précédent (une PA devient PA2 au lieu d'être doublée).",
    exemple:
      "Une pièce d'artillerie lourde frappe bien plus fort une fois mise en batterie, immobile.",
  },
  {
    nom: "Atout du Duelliste (X)",
    texte: "Donne un bonus de X au jet de Concentration pendant un Défi.",
    exemple:
      "Une lame de duel parfaitement équilibrée fait souvent la différence à l'étape de Concentration.",
  },
  {
    nom: "Barrage (X)",
    texte:
      "Permet de tirer sur une cible sans ligne de vue (tir indirect). Combinée à Explosion, un jet de déviation détermine où retombe le tir en cas d'échec.",
    exemple: "Un mortier peut pilonner une unité cachée derrière un bâtiment.",
  },
  {
    nom: "Choc (X)",
    texte:
      "Contre un Véhicule ou un Marcheur, un jet de touche de 5 ou 6 (avant modificateur) inflige un statut tactique — lequel dépend de X — même sans percer le blindage.",
    exemple:
      "Une décharge électromagnétique peut stopper un char sans même l'endommager.",
  },
  {
    nom: "Combi",
    texte:
      "L'arme peut tirer avec plusieurs profils en même temps lors de la même Attaque de Tir.",
    exemple: "Un combi-arme associe un bolter et une arme spéciale sur la même détente.",
  },
  {
    nom: "Déflagration (X)",
    texte:
      "Chaque blessure non sauvegardée peut déclencher des touches supplémentaires sur la même cible.",
    exemple:
      "Une arme volkite qui enchaîne les décharges sur des rangs entiers d'ennemis massés.",
  },
  {
    nom: "Détonation",
    texte:
      "Ne peut attaquer que des Véhicules, des figurines dont la caractéristique de Mouvement est 0, ou des décors/bâtiments.",
    exemple:
      "Une charge conçue pour être fixée sur une cible immobile par nature, pas pour le combat mouvant.",
  },
  {
    nom: "En Feu (X)",
    texte:
      "Si l'attaque blesse la cible, son unité est « en feu » : elle subit un malus supplémentaire de X à son Commandement pour les tests liés à ce Combat.",
    exemple: "Une lame incandescente sème une panique durable dans les rangs touchés.",
  },
  {
    nom: "Explosion (X)",
    texte:
      "Utilise un gabarit pour toucher plusieurs figurines d'un coup, avec un seul jet de touche pour tout le gabarit (à ne pas confondre avec Explose (X), qui décrit une figurine qui explose).",
    exemple: "Un obus explosif frappe un groupe entier plutôt qu'une seule figurine.",
  },
  {
    nom: "Force (X)",
    texte:
      "Un Psyker peut tenter un test de Volonté pour doubler la caractéristique X de l'arme, au risque de subir les Périls du Warp sur un double.",
    exemple:
      "Canaliser le Warp démultiplie la puissance d'une arme, mais peut se retourner contre son porteur.",
  },
  {
    nom: "Limitée (X)",
    texte: "L'arme ne peut servir à attaquer que X fois au total sur toute la bataille.",
    exemple:
      "Une charge de démolition unique : mieux vaut viser juste, on ne pourra pas la réutiliser.",
  },
  {
    nom: "Phage (X)",
    texte:
      "Chaque blessure non sauvegardée réduit d'1, de façon permanente pour la bataille, une caractéristique de la cible.",
    exemple: "Un poison corrosif affaiblit durablement quiconque y survit.",
  },
  {
    nom: "Pistolet",
    texte: "Une figurine peut attaquer avec deux armes Pistolet en même temps.",
    exemple:
      "Un duelliste dégaine un pistolet dans chaque main pour doubler sa cadence de tir.",
  },
  {
    nom: "Poursuite Rapide",
    texte:
      "Améliore la réaction Interception : l'arme peut être utilisée même si elle n'est pas une arme défensive.",
    exemple:
      "Un viseur perfectionné permet d'accrocher une cible qui vient tout juste d'apparaître sur le champ de bataille.",
  },
  {
    nom: "Sélecteur de Tir",
    texte:
      "Au début d'une Attaque de Tir, l'arme peut gagner Panique (1), Brèche (4+) ou Neutralisation (2) jusqu'à la fin de l'attaque.",
    exemple: "Une arme à munitions interchangeables s'adapte à la cible du moment.",
  },
  {
    nom: "Souffle",
    texte:
      "Utilise un gabarit de flammes : pas de jet de touche, chaque figurine sous le gabarit est automatiquement touchée.",
    exemple:
      "Un lance-flammes embrase tout ce qui se trouve dans son cône, sans avoir besoin de viser.",
  },
  {
    nom: "Surcharge (X)",
    texte:
      "Un jet de touche trop bas (X ou moins, avant modificateur) inflige une touche à la figurine qui tire.",
    exemple:
      "Une arme instable qui peut se retourner contre son utilisateur en cas de surchauffe.",
  },
];

// --- Règles diverses ---
const REGLES_DIVERSES = [
  {
    nom: "Avance Implacable",
    texte:
      "Toutes les armes de la figurine sont considérées comme Assaut (sauf Lourde et Artillerie).",
    exemple:
      "Une figurine avec ce trait peut se déplacer et tirer normalement avec la plupart de ses armes.",
  },
  {
    nom: "Avant-garde (X)",
    texte:
      "L'unité ne marque que 1 point de victoire sur un objectif, + X si elle est retirée comme perte ou fait battre en retraite une unité ennemie.",
    exemple:
      "Une unité pensée pour l'attaque, pas pour tenir durablement un objectif.",
  },
  {
    nom: "Charge désordonnée",
    texte:
      "L'unité ne bénéficie ni du mouvement de positionnement ni de l'attaque de mêlée bonus lors de la charge.",
    exemple:
      "Une charge lancée à travers un terrain difficile arrive souvent désorganisée.",
  },
  {
    nom: "Écran de fumée (réaction)",
    texte: "Jet de mitigation de dégâts de Dissimulation (5+) contre les tirs.",
    exemple:
      "Un nuage de fumée rend l'unité (par exemple un Rhino) plus difficile à toucher.",
  },
  {
    nom: "Explose (X)",
    texte:
      "Quand la figurine explose, toute unité à 6 pouces subit un nombre de jets de touche égal aux PV de base de la figurine qui explose (Force 8, Dégâts 1).",
    exemple: "Rester à proximité d'un véhicule détruit expose aux dégâts de son explosion.",
  },
  {
    nom: "Frappe en profondeur",
    texte:
      "Arrivée aux tours 2, 3 ou 4, maximum 1 unité par tour. Placement à plus de 1 pouce de tout, l'unité groupée à 6 pouces autour de la première figurine. Elle ne peut ensuite ni se déplacer ni charger ce tour-là.",
    exemple:
      "Les Terminators peuvent se téléporter derrière les lignes ennemies, mais restent immobiles au tour de leur arrivée.",
  },
  {
    nom: "Haine (X)",
    texte: "+1 au jet de blessure au combat contre les cibles de type X.",
    exemple:
      "Haine (World Eaters) : bonus au jet de blessure au combat contre les unités World Eaters.",
  },
  {
    nom: "Infiltration (X)",
    texte:
      "Se déploie n'importe où sauf dans la zone de déploiement adverse et à plus de X pouces de l'ennemi. Ne peut pas charger au premier tour.",
    exemple:
      "Les unités de Reconnaissance peuvent commencer la partie déjà positionnées au centre de la table.",
  },
  {
    nom: "Léger",
    texte: "+2 pouces pour Foncer, et peut tirer au jugé après avoir foncé.",
    exemple:
      "L'infanterie légère se déplace d'un couvert à l'autre tout en conservant sa capacité de tir.",
  },
  {
    nom: "Lent et méthodique",
    texte: "Ne peut pas poursuivre un ennemi en fuite.",
    exemple:
      "Les unités en armure lourde ne peuvent pas rattraper un ennemi qui bat en retraite.",
  },
  {
    nom: "Lourd",
    texte:
      "+1 en Sang-froid, ne peut pas Foncer, mouvement de positionnement (charge) sans Initiative.",
    exemple:
      "Le trait typique des Terminators : résistants au moral, mais peu mobiles.",
  },
  {
    nom: "Marcheur",
    texte:
      "Tire avec toutes ses armes (sauf Volée). Compte comme ses PV de base pour la résolution de combat.",
    exemple: "Un Dreadnought tire avec l'ensemble de son armement à chaque activation.",
  },
  {
    nom: "Massif (X)",
    texte: "Compte comme X figurines dans un véhicule (capacité de transport).",
    exemple:
      "Massif (2) : la figurine occupe deux places dans la capacité de transport d'un véhicule.",
  },
  {
    nom: "Mouvement à couvert",
    texte: "Ignore les malus de mouvement dus aux couverts.",
    exemple:
      "Cette unité se déplace en terrain difficile (ruines, forêts, décombres) sans pénalité.",
  },
  {
    nom: "Peur (X)",
    texte:
      "Les unités ennemies à 12 pouces subissent un malus de X à leurs caractéristiques de Commandement, Sang-froid, Volonté et Intelligence.",
    exemple:
      "Peur (2) : les unités ennemies à proximité subissent un malus de −2 sur leurs tests de moral.",
  },
  {
    nom: "Unité d'appui (X)",
    texte: "Ne marque que X points de victoire en tenant un objectif.",
    exemple:
      "Les unités d'appui soutiennent la ligne, mais marquent moins de points de victoire que les Troupes.",
  },
  {
    nom: "Âpre Devoir",
    texte:
      "Une figurine avec cette règle ne peut rejoindre que des unités qui l'ont aussi, et réciproquement.",
    exemple:
      "Certains guerriers, mis au ban à cause de leur réputation, ne combattent qu'entre eux.",
  },
  {
    nom: "Attaque de Flanc",
    texte:
      "Une unité entièrement composée de figurines avec cette règle peut entrer en jeu depuis les Réserves n'importe où sur le bord de table (hors zone de déploiement adverse et à plus de 7 pouces de l'ennemi).",
    exemple:
      "Des éclaireurs rapides surgissent sur un flanc inattendu plutôt que de traverser toute la table.",
  },
  {
    nom: "Autoréparation (X)",
    texte:
      "Bonus aux Jets de Réparation d'un Véhicule : on réussit sur X ou plus, au lieu du 6 habituel.",
    exemple: "Un équipage capable de rafistoler sa machine en plein combat.",
  },
  {
    nom: "Bouclier Void (X)",
    texte:
      "Une figurine avec X boucliers void ignore les touches pénétrantes (Dégâts ramenés à 0) tant qu'il lui en reste ; chaque touche pénétrante en consomme un.",
    exemple:
      "Un champ de force antique absorbe les coups jusqu'à ce qu'il finisse par céder.",
  },
  {
    nom: "Dissimulation (X)",
    texte:
      "Jet de mitigation de dégâts supplémentaire, en plus d'une sauvegarde, réussi sur X ou plus.",
    exemple:
      "Un nuage de fumée ou un brouilleur électromagnétique rend la cible plus difficile à achever.",
  },
  {
    nom: "Fauchage (X)",
    texte:
      "Si la figurine est en infériorité numérique en Combat, elle gagne un bonus de X Attaques.",
    exemple: "Un guerrier acculé se bat avec une énergie décuplée face au nombre.",
  },
  {
    nom: "Guerrier Éternel (X)",
    texte: "Réduit de X les Dégâts de chaque blessure non sauvegardée (minimum 1).",
    exemple: "Certains guerriers encaissent des coups qui tueraient n'importe qui d'autre.",
  },
  {
    nom: "Guerrier-artisan (X)",
    texte:
      "En Phase de Mouvement, peut tenter de réparer ou rétablir une figurine de Type Véhicule/Automate amie à 6 pouces.",
    exemple:
      "Un technicien de combat maintient les machines de guerre opérationnelles au cœur de la bataille.",
  },
  {
    nom: "Insensible à la Douleur (X)",
    texte:
      "Jet de mitigation de dégâts supplémentaire, en plus d'une sauvegarde, réussi sur X ou plus.",
    exemple:
      "Un guerrier berserk à peine ralenti par des blessures qui arrêteraient n'importe qui d'autre.",
  },
  {
    nom: "Ligne (X)",
    texte:
      "L'unité contrôle mieux les objectifs : bonus de X Points de Victoire quand elle en contrôle un, et compte plus dans l'Effectif Tactique.",
    exemple: "Une troupe de ligne, vigilante et fiable, tient durablement le terrain conquis.",
  },
  {
    nom: "Médic (X)",
    texte:
      "Détermine la difficulté des Jets de Rétablissement (le nombre à atteindre) pour cette unité, sans en accorder par elle-même.",
    exemple: "Un apothicaire expérimenté rend les soins de terrain plus fiables.",
  },
  {
    nom: "Négligence",
    texte: "L'unité ne peut jamais contrôler ni contester un Objectif.",
    exemple:
      "Des guerriers uniquement tournés vers le combat, indifférents aux objectifs de la bataille.",
  },
  {
    nom: "Officier de ligne (X)",
    texte:
      "Permet de sélectionner un nombre de Détachements Auxiliaires égal à X pour la Case d'État-major concernée, au lieu d'un seul.",
    exemple:
      "Un Centurion ayant Officier de ligne (2) débloque deux Détachements Auxiliaires au lieu d'un — voir la page Construction d'armée.",
  },
  {
    nom: "Orage de Feu",
    texte:
      "L'unité n'est pas limitée au tir au jugé lors d'une attaque de volée : elle tire normalement.",
    exemple:
      "Une unité entraînée à décharger tout son armement à bout portant, sans perdre en précision.",
  },
  {
    nom: "Ouverture à l'Impact",
    texte:
      "Les portes du véhicule sont ouvertes dès son déploiement ; toute unité embarquée doit débarquer aussitôt, et personne ne peut plus embarquer ensuite.",
    exemple:
      "Un module de largage s'ouvre à l'atterrissage pour laisser sortir ses troupes sans attendre.",
  },
  {
    nom: "Protocoles de Tir (X)",
    texte: "La figurine peut attaquer avec X armes de tir différentes au lieu d'une seule.",
    exemple:
      "Un système de ciblage avancé permet de faire feu avec plusieurs armes à la fois.",
  },
  {
    nom: "Sacrifiable (X)",
    texte:
      "Réduit de X (minimum 1) les Points de Victoire marqués par l'adversaire quand cette unité est détruite.",
    exemple:
      "Des troupes considérées comme du matériel consommable, dont la perte ne pèse pas lourd.",
  },
  {
    nom: "Transport Léger",
    texte: "Ne peut pas transporter de figurines ayant la règle Massif (X).",
    exemple:
      "Un transport léger n'a tout simplement pas la place pour des guerriers en armure Terminator.",
  },
  {
    nom: "Véhicule d'Assaut",
    texte:
      "Une unité qui débarque de ce véhicule peut charger ce tour-ci sans que la charge soit désordonnée.",
    exemple:
      "Une rampe d'assaut permet aux troupes de foncer au combat dès la sortie du véhicule.",
  },
  {
    nom: "Véhicule d'Assaut Orbital",
    texte: "Doit obligatoirement se déployer en Frappe en profondeur.",
    exemple: "Un module de largage n'a qu'une utilité : livrer ses troupes depuis l'orbite.",
  },
  {
    nom: "Vif (X)",
    texte:
      "Une unité entièrement composée de figurines avec cette règle gagne un bonus de X pouces en Foncer, et de X au Jet de Charge.",
    exemple: "Des guerriers véloces qui couvrent le terrain plus vite que les autres.",
  },
  {
    nom: "Bouclier d'Abordage",
    texte:
      "Confère une Sauvegarde Invulnérable de 5+, le Trait Bouclier et le Sous-type Lourd.",
    exemple:
      "Une ligne de boucliers d'abordage forme un mur presque impénétrable en Zone Mortalis.",
  },
  {
    nom: "Bouclier de Combat",
    texte:
      "Confère une Sauvegarde Invulnérable de 5+ contre les attaques de mêlée, et un bonus de +1 au Jet de Concentration en Défi.",
    exemple:
      "Pratique pour un champion qui aime les Défis : la sauvegarde encaisse les coups, le bonus aide à gagner l'Avantage.",
  },
  {
    nom: "Champ de Diffraction Thermique",
    texte:
      "Réduit de 1 la Force de toute touche infligée par une arme ayant le trait Laser, Plasma, Fusion ou Flammes.",
    exemple: "Un bouclier thermique dilue l'impact des armes à énergie les plus courantes.",
  },
  {
    nom: "Cognis-signum",
    texte:
      "Au lieu de tirer, la figurine peut tenter un test d'Intelligence pour désigner une unité ennemie visible : la prochaine attaque de tir de la phase utilisant une arme Barrage (X) contre cette cible touche normalement, même sans ligne de vue.",
    exemple:
      "Un porteur de cognis-signum guide les tirs indirects de ses camarades avec une précision inégalée.",
  },
  {
    nom: "Contrôleur de Cortex",
    texte:
      "Permet aux figurines de Type Automate de l'unité de déclarer des Réactions, ce qui leur est normalement interdit.",
    exemple:
      "Un opérateur relié directement à ses machines peut leur faire réagir à temps, comme s'il pensait à leur place.",
  },
  {
    nom: "Cyber-familier",
    texte: "Bonus de −2 au résultat des Tests d'Intelligence de la figurine.",
    exemple: "Un servo-crâne chuchote des informations tactiques à l'oreille de son maître.",
  },
];

/* ----------------------------------------------------------
   RENDU DES RÈGLES
   ---------------------------------------------------------- */

/**
 * Génère les cartes de règles dans le conteneur donné.
 * @param {string} idConteneur - id de la div cible
 * @param {Array}  regles      - liste d'objets règle
 */
function afficherRegles(idConteneur, regles) {
  const conteneur = document.getElementById(idConteneur);
  if (!conteneur) return;

  regles.forEach((regle) => {
    const article = document.createElement("article");
    article.className = "regle";
    // On stocke le texte "brut" en minuscules pour la recherche
    article.dataset.recherche = (regle.nom + " " + regle.texte).toLowerCase();

    const titre = document.createElement("h3");
    titre.textContent = regle.nom;
    article.appendChild(titre);

    const texte = document.createElement("p");
    texte.textContent = regle.texte;
    article.appendChild(texte);

    if (regle.exemple) {
      const exemple = document.createElement("p");
      exemple.className = "exemple";
      exemple.textContent = "→ " + regle.exemple;
      article.appendChild(exemple);
    }

    conteneur.appendChild(article);
  });
}

/* ----------------------------------------------------------
   FILTRE EN TEMPS RÉEL
   À chaque frappe dans la barre de recherche, on masque
   les règles dont le texte ne contient pas la saisie.
   ---------------------------------------------------------- */

/**
 * Retire les accents pour une recherche plus tolérante ("brèche" = "breche").
 * .normalize("NFD") décompose chaque lettre accentuée en deux caractères
 * (ex : "è" devient "e" + un accent grave séparé) ; l'expression régulière
 * supprime ensuite uniquement ces accents désormais isolés.
 */
function normaliser(texte) {
  return texte.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function activerRecherche() {
  const champ = document.getElementById("recherche");
  const compteur = document.getElementById("compteur");
  if (!champ) return;

  champ.addEventListener("input", () => {
    const requete = normaliser(champ.value.trim());
    let visibles = 0;

    document.querySelectorAll(".regle").forEach((regle) => {
      const contenu = normaliser(regle.dataset.recherche);
      const correspond = contenu.includes(requete);
      regle.classList.toggle("cachee", !correspond);
      if (correspond) visibles++;
    });

    // Les titres de section disparaissent si leur section est vide
    document.querySelectorAll(".groupe-regles").forEach((groupe) => {
      const resteVisible = groupe.querySelector(".regle:not(.cachee)") !== null;
      groupe.style.display = resteVisible ? "" : "none";
    });

    // Petit compteur de résultats
    if (compteur) {
      const total = document.querySelectorAll(".regle").length;
      compteur.textContent = requete
        ? visibles + " règle(s) trouvée(s) sur " + total
        : total + " règles au total";
    }
  });
}

/* ----------------------------------------------------------
   INITIALISATION
   ---------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  afficherRegles("regles-armes", REGLES_ARMES);
  afficherRegles("regles-diverses", REGLES_DIVERSES);
  activerRecherche();

  // Affiche le total au chargement
  const compteur = document.getElementById("compteur");
  if (compteur) {
    compteur.textContent =
      document.querySelectorAll(".regle").length + " règles au total";
  }
});
