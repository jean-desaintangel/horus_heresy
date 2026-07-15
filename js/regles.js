/* ============================================================
   regles.js — Règles spéciales (page regles.html)
   Auteur : Jean · Modifié : 2026-07-14
   Rôle   : encode les règles en JS, les rend dynamiquement et les
   filtre en temps réel via la barre de recherche.
   Dépend : aucun (vanilla JS) — stylé par css/style.css.
   Sécurité : textContent partout, jamais innerHTML (anti-XSS).
   ============================================================ */

/* ----------------------------------------------------------
   DONNÉES : chaque règle = { nom, texte }
   ---------------------------------------------------------- */

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
    article.dataset.recherche = regle.nom.toLowerCase();

    const titre = document.createElement("h3");
    titre.textContent = regle.nom;
    article.appendChild(titre);

    const texte = document.createElement("p");
    texte.textContent = regle.texte;
    article.appendChild(texte);

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
 * ̀-ͯ = plage Unicode des diacritiques combinants, écrite en
 * échappements plutôt qu'en caractères littéraux (invisibles à l'écran,
 * fragiles au copier-coller : un éditeur peut les re-normaliser sans
 * prévenir et casser silencieusement la regex).
 */
function normaliser(texte) {
  return texte
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
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
        : "";
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
});