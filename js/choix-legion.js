/* ============================================================
   choix-legion.js — Page de choix de la Légion (pages/choix-legion.html)
   Auteur : Jean · Extrait du HTML : 2026-07-27
   Rôle   : construit la grille des dix-huit Primarques, ouvre la
   modale d'agrandissement, et renvoie vers pages/construction-liste.html avec la
   Légion choisie en paramètre d'URL.
   Dépend : js/sequence-clavier.js (chargé avant, voir la balise
   <script> de pages/choix-legion.html) — stylé par css/choix-legion.css.
   Cette page ne charge PAS js/main.js : elle est autonome (pas de barre
   de navigation ni de pied de page communs). C'est précisément pour
   cela que la reconnaissance du mot-clé au clavier a été sortie dans
   son propre fichier : elle est nécessaire ici ET dans main.js, sans
   qu'aucun des deux ne puisse dépendre de l'autre.
   Sécurité : textContent partout, jamais innerHTML (anti-XSS).
   ============================================================ */

const PRIMARQUES = [
  {
    id: 1,
    nom: "Lion El'Jonson",
    legion: "I – Dark Angels",
    legionId: "I",
    image: "../assets/logo_legions/lion.webp",
  },
  {
    id: 2,
    nom: "Inconnue",
    legion: "II – Expurgée",
    image: "../assets/logo_legions/II_legion.webp",
    expurgee: true,
  },
  {
    id: 3,
    nom: "Fulgrim",
    legion: "III – Emperor's Children",
    legionId: "III",
    image: "../assets/logo_legions/fulgrim.webp",
  },
  {
    id: 4,
    nom: "Perturabo",
    legion: "IV – Iron Warriors",
    legionId: "IV",
    image: "../assets/logo_legions/perturabo.webp",
  },
  {
    id: 5,
    nom: "Jaghatai Khan",
    legion: "V – White Scars",
    legionId: "V",
    image: "../assets/logo_legions/khan.webp",
  },
  {
    id: 6,
    nom: "Leman Russ",
    legion: "VI – Space Wolves",
    legionId: "VI",
    image: "../assets/logo_legions/russ.webp",
  },
  {
    id: 7,
    nom: "Rogal Dorn",
    legion: "VII – Imperial Fists",
    legionId: "VII",
    image: "../assets/logo_legions/dorn.webp",
  },
  {
    id: 8,
    nom: "Konrad Curze",
    legion: "VIII – Night Lords",
    legionId: "VIII",
    image: "../assets/logo_legions/konrad.webp",
  },
  {
    id: 9,
    nom: "Sanguinius",
    legion: "IX – Blood Angels",
    legionId: "IX",
    image: "../assets/logo_legions/sanguinius.webp",
  },
  {
    id: 10,
    nom: "Ferrus Manus",
    legion: "X – Iron Hands",
    legionId: "X",
    image: "../assets/logo_legions/ferrus.webp",
  },
  {
    id: 11,
    nom: "Inconnue",
    legion: "XI – Expurgée",
    image: "../assets/logo_legions/XI_legion.webp",
    expurgee: true,
  },
  {
    id: 12,
    nom: "Angron",
    legion: "XII – World Eaters",
    legionId: "XII",
    image: "../assets/logo_legions/angron.webp",
  },
  {
    id: 13,
    nom: "Roboute Guilliman",
    legion: "XIII – Ultramarines",
    legionId: "XIII",
    image: "../assets/logo_legions/guilliman.webp",
    infoBulle: "Toujours en train d'écrire un nouveau Codex quelque part.",
  },
  {
    id: 14,
    nom: "Mortarion",
    legion: "XIV – Death Guard",
    legionId: "XIV",
    image: "../assets/logo_legions/mortarion.webp",
  },
  {
    id: 15,
    nom: "Magnus le Rouge",
    legion: "XV – Thousand Sons",
    legionId: "XV",
    image: "../assets/logo_legions/magnus.webp",
  },
  {
    id: 16,
    nom: "Horus Lupercal",
    legion: "XVI – Sons of Horus",
    legionId: "XVI",
    image: "../assets/logo_legions/horus.webp",
  },
  {
    id: 17,
    nom: "Lorgar",
    legion: "XVII – Word Bearers",
    legionId: "XVII",
    image: "../assets/logo_legions/lorgar.webp",
  },
  {
    id: 18,
    nom: "Vulkan",
    legion: "XVIII – Salamanders",
    legionId: "XVIII",
    image: "../assets/logo_legions/vulkan.webp",
  },
  {
    id: 19,
    nom: "Corvus Corax",
    legion: "XIX – Raven Guard",
    legionId: "XIX",
    image: "../assets/logo_legions/corvus.webp",
  },
  {
    id: 200,
    nom: "Alpharius Omegon",
    legion: "XX – Alpha Legion",
    legionId: "XX",
    image: "../assets/logo_legions/alpharius.webp",
  },
];

const grille = document.getElementById("legion-grille");
const modale = document.getElementById("legion-modale");
const modaleImage = document.getElementById("legion-modale-image");
const modaleTitre = document.getElementById("legion-modale-titre");
const modaleFermer = document.getElementById("legion-modale-fermer");
const modaleFond = document.getElementById("legion-modale-fond");
const boutonValider = document.getElementById("legion-valider");
const motifExpurgee = document.getElementById("legion-motif-expurgee");

let primarqueSelectionne = null;

// Création des cartes
PRIMARQUES.forEach((p) => {
  const carte = document.createElement("button");
  carte.className = "legion-carte";
  carte.setAttribute("type", "button");
  // Accessibilité (WCAG 2.4.6 / RGAA 6.1) : la Légion figure bien dans
  // .legion-carte-etiquette… mais cette étiquette est en `display: none`,
  // ce qui la masque AUSSI aux lecteurs d'écran. L'ancien libellé
  // n'annonçait donc que le nom du Primarque — alors que c'est bien une
  // LÉGION que l'utilisateur est en train de choisir, et que rien ne lui
  // permettait de savoir laquelle. On la remet dans le nom accessible.
  carte.setAttribute(
    "aria-label",
    `${p.nom} — ${p.legion} — afficher en grand`,
  );
  carte.dataset.id = p.id;
  if (p.infoBulle) carte.title = p.infoBulle;

  if (p.expurgee) {
    carte.classList.add("legion-carte--expurgee");
    carte.setAttribute("aria-disabled", "true");
  }

  // Sécurité : construction par createElement + textContent plutôt
  // que par innerHTML. C'était le SEUL innerHTML du site, alors que
  // tous les autres fichiers JS revendiquent explicitement en
  // en-tête « textContent partout, jamais innerHTML (anti-XSS) ».
  // Aujourd'hui les données viennent du tableau `PRIMARQUES` juste
  // au-dessus, donc le risque est nul ; mais le jour où elles
  // arriveront d'un JSON, d'une API ou d'un paramètre d'URL, un
  // nom contenant <img onerror=...> serait interprété comme du
  // HTML et exécuté. textContent, lui, ne peut RIEN exécuter :
  // il pose du texte, point. C'est le réflexe à garder même quand
  // la source paraît sûre — parce qu'elle ne le reste pas toujours.
  const image = document.createElement("img");
  image.src = p.image;
  image.alt = "Portrait du Primarque " + p.nom;
  image.loading = "lazy";
  image.decoding = "async";
  image.width = 400;
  image.height = 600;

  const etiquette = document.createElement("span");
  etiquette.className = "legion-carte-etiquette";

  const nom = document.createElement("span");
  nom.className = "legion-carte-nom";
  nom.textContent = p.nom;

  const legion = document.createElement("span");
  legion.className = "legion-carte-legion";
  legion.textContent = p.legion;

  etiquette.append(nom, legion);
  carte.append(image, etiquette);

  carte.addEventListener("click", () => {
    // Relue depuis le DOM et non depuis `p.image` : l'easter egg
    // « chaos » a pu remplacer le portrait par sa version démoniaque.
    const imageActuelle = carte.querySelector("img");
    ouvrirModale(p, imageActuelle.src, imageActuelle.alt);
  });

  grille.appendChild(carte);
});

// Élément qui a ouvert la modale : mémorisé pour lui rendre le
// focus à la fermeture (voir fermerModale).
let declencheurModale = null;

// Ouvre la modale avec l'image ACTUELLE
function ouvrirModale(p, sourceActuelle, altActuelle) {
  primarqueSelectionne = p;
  declencheurModale = document.activeElement;
  modaleImage.src = sourceActuelle || p.image;
  modaleImage.alt = altActuelle || `Portrait agrandi de ${p.nom}`;
  modaleTitre.textContent = p.legion;
  modale.classList.add("legion-modale--ouverte");
  modale.setAttribute("aria-hidden", "false");
  // Accessibilité (WCAG 2.4.3 / RGAA 12.8) : la modale se déclare
  // aria-modal="true", ce qui promet à l'utilisateur d'un lecteur
  // d'écran que rien d'autre n'existe tant qu'elle est ouverte.
  // Sans `inert` sur la grille, la promesse n'était pas tenue :
  // Tab sortait de la modale et parcourait les dix-huit cartes
  // situées derrière le voile noir, invisibles mais focalisables.
  // `inert` les retire d'un coup du parcours clavier ET de l'arbre
  // d'accessibilité — le même mécanisme que celui déjà utilisé
  // pour les panneaux dépliables fermés (js/main.js).
  grille.inert = true;

  if (p.expurgee) {
    boutonValider.setAttribute("disabled", "true");
    motifExpurgee.textContent =
      "Cette légion a été expurgée des archives. Son choix ne peut être validé.";
  } else {
    boutonValider.removeAttribute("disabled");
    motifExpurgee.textContent = "";
  }

  boutonValider.focus();
}

function fermerModale() {
  modale.classList.remove("legion-modale--ouverte");
  modale.setAttribute("aria-hidden", "true");
  grille.inert = false;
  // Accessibilité (WCAG 2.4.3 « Parcours du focus ») : à la
  // fermeture, le focus était perdu et repartait au tout début du
  // document. Un utilisateur au clavier devait re-parcourir la
  // grille depuis la première carte pour revenir là où il en
  // était. On le rend donc à la carte qui a ouvert la modale.
  if (declencheurModale && document.contains(declencheurModale)) {
    declencheurModale.focus();
  }
  declencheurModale = null;
}

// Fermeture modale
modaleFermer.addEventListener("click", fermerModale);
modaleFond.addEventListener("click", fermerModale);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modale.classList.contains("legion-modale--ouverte"))
    fermerModale();
});

// Validation : redirige vers construction-liste.html en pré-sélectionnant la
// Légion choisie dans le menu déroulant « Choisir Légion »
// (paramètre lu par js/organigramme.js, Organigramme.initialiser).
// Arrivée depuis le menu « Légion Alliée » d'un Détachement Allié
// (construireSelectLegionAlliee, js/organigramme.js) plutôt que du
// menu « Légion » principal des paramètres de la partie : cette
// page reçoit alors elle-même `?cible=allie&det=<indice>`, à
// reporter tel quel sur l'URL de retour pour que construction-liste.html sache
// appliquer le choix à ce Détachement Allié précis, pas à la
// Légion de l'Armée entière.
const paramsArrivee = new URLSearchParams(location.search);
const cibleArrivee = paramsArrivee.get("cible");
const detArrivee = paramsArrivee.get("det");
boutonValider.addEventListener("click", () => {
  if (!primarqueSelectionne) return;
  if (primarqueSelectionne.expurgee) return;
  if (!primarqueSelectionne.legionId) return;
  let url =
    "construction-liste.html?legion=" +
    encodeURIComponent(primarqueSelectionne.legionId);
  if (cibleArrivee === "allie" && detArrivee !== null) {
    url +=
      "&cible=" +
      encodeURIComponent(cibleArrivee) +
      "&det=" +
      encodeURIComponent(detArrivee);
  }
  window.location.href = url;
});

// --- EASTER EGG : taper un mot-clé précis -> 4 démons ---
// Le mot-clé n'est jamais écrit en clair ici (bien essayé, jeune
// acolyte) : seule son empreinte SHA-256 est comparée à ce qui est
// tapé au clavier.
//
// La mécanique de reconnaissance (file glissante des N dernières
// touches + empreinte) vit désormais dans js/sequence-clavier.js,
// partagée avec les deux clins d'œil de js/main.js. Ce fichier en
// avait sa propre copie, à un détail près qui n'était pas voulu :
// elle ne vérifiait pas si le focus était dans un champ de saisie,
// contrairement aux deux autres. Sans conséquence sur cette page
// (elle n'a aucun champ), mais c'est le genre d'écart qui devient un
// bug le jour où on ajoute une barre de recherche — et personne ne
// pense à aller relire les trois copies.
//
// Nuance de comportement assumée au passage : l'ancienne version ne
// retenait que les lettres a-z et ignorait purement et simplement
// chiffres et ponctuation ; la version partagée retient tout
// caractère imprimable. Concrètement, taper le mot-clé d'une traite
// donne exactement le même résultat — seul un mot-clé entrecoupé
// d'un chiffre ne déclenche plus, ce qui est le comportement voulu.

const EMPREINTE_CHAOS =
  "5d5bddb577102d0a960bcf6fea9050c10fe5e9feddcb5c2170ccab872db9ee87";
const LONGUEUR_CHAOS = 5;

const CIBLES_CHAOS = [
  {
    selecteur: '.legion-carte[data-id="15"] img',
    nouvelleSource: "../assets/logo_legions/magnus_demon.webp",
    nouvelleAlt: "Portrait démoniaque de Magnus le Rouge",
  },
  {
    selecteur: '.legion-carte[data-id="3"] img',
    nouvelleSource: "../assets/logo_legions/fulgrim_demon.webp",
    nouvelleAlt: "Portrait démoniaque de Fulgrim",
  },
  {
    selecteur: '.legion-carte[data-id="12"] img',
    nouvelleSource: "../assets/logo_legions/angron_demon.webp",
    nouvelleAlt: "Portrait démoniaque d'Angron",
  },
  {
    selecteur: '.legion-carte[data-id="14"] img',
    nouvelleSource: "../assets/logo_legions/mortarion_demon.webp",
    nouvelleAlt: "Portrait démoniaque de Mortarion",
  },
];

// Filet de sécurité : si js/sequence-clavier.js n'a pas pu être chargé,
// on renonce au clin d'œil plutôt que de lever une ReferenceError qui
// emporterait le reste de ce fichier — c'est-à-dire la grille des dix-huit
// légions et sa modale, soit toute la raison d'être de la page.
if (typeof surSequenceClavier === "function") {
  surSequenceClavier(LONGUEUR_CHAOS, EMPREINTE_CHAOS, () => {
    CIBLES_CHAOS.forEach((t) => {
      const image = document.querySelector(t.selecteur);
      if (image) {
        // On met à jour l'alternative textuelle EN MÊME TEMPS que la
        // source : une image qui change sans que son alt suive ment aux
        // lecteurs d'écran (WCAG 1.1.1 / RGAA 1.1).
        image.src = t.nouvelleSource;
        image.alt = t.nouvelleAlt;
      }
    });
  });
}
