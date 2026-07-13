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
    nom: "Choc (X)",
    texte:
      "Le jet de touche se fait sur 5/6 ; le statut entre parenthèses s'applique aux marcheurs et véhicules.",
    exemple:
      "Une arme conçue pour secouer une machine ennemie plutôt que pour viser précisément.",
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
    texte: "Sur un jet de blessure de 6 : +1 dégât.",
    exemple: "Chaque 6 au jet de blessure inflige un dégât supplémentaire.",
  },
  {
    nom: "Vulnérante (X)",
    texte:
      "S'applique sur un jet de blessure de 6 (voir le profil de l'arme pour l'effet exact).",
    exemple:
      "Un jet de blessure de 6 déclenche l'effet spécial propre à l'arme.",
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

/** Retire les accents pour une recherche plus tolérante ("brèche" = "breche"). */
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
