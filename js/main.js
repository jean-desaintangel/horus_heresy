/* ============================================================
   main.js — Scripts communs à toutes les pages
   Auteur : Jean · Modifié : 2026-07-25
   Rôle   : menu mobile, accordéons, timeline, sections repliables,
   tableau de jet de blessure flottant, et utilitaires partagés par
   les autres scripts (normalisation de texte, fabrique DOM, tables
   de référence, définitions des règles spéciales).
   Dépend : aucun (vanilla JS) — stylé par css/style.css.
   Chargé en defer AVANT les autres scripts : ses fonctions globales
   sont donc disponibles pour js/regles.js, js/armes.js, js/tables.js,
   js/organigramme.js et js/unites.js.
   ============================================================ */

/* ----------------------------------------------------------
   UTILITAIRES PARTAGÉS
   Regroupés ici (fichier chargé sur toutes les pages) plutôt que
   copiés dans chaque script : une seule implémentation à maintenir,
   un seul endroit où corriger un bug.
   ---------------------------------------------------------- */

/**
 * Retire les accents pour une recherche plus tolérante
 * ("brèche" = "breche") et passe en minuscules.
 * .normalize("NFD") décompose chaque lettre accentuée en deux
 * caractères (ex : "è" devient "e" + un accent grave séparé) ;
 * \p{Diacritic} supprime ensuite uniquement ces accents isolés.
 * Utilisée par les barres de recherche (regles.js, armes.js,
 * unites.js) et par l'index des définitions ci-dessous.
 * @param {string} texte
 * @returns {string}
 */
function normaliserTexte(texte) {
  return texte
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

/**
 * Fabrique DOM minimaliste : crée un élément avec classe et texte
 * optionnels. textContent uniquement (jamais innerHTML) : le texte
 * n'est pas interprété comme du HTML — réflexe anti-XSS.
 * Utilisée par js/organigramme.js et js/unites.js.
 * @param {string} balise - nom de la balise (ex : "p", "span")
 * @param {string} [classe] - classe(s) CSS
 * @param {string} [texte]  - contenu textuel
 * @returns {HTMLElement}
 */
function el(balise, classe, texte) {
  const noeud = document.createElement(balise);
  if (classe) noeud.className = classe;
  if (texte !== undefined) noeud.textContent = texte;
  return noeud;
}

/**
 * Ajoute une <option> (valeur + texte) à un <select> : variante de
 * el() dédiée à ce cas précis, répété une dizaine de fois entre
 * js/organigramme.js et js/unites.js. Retourne l'élément créé pour lui
 * ajouter d'autres propriétés ensuite (disabled…) si besoin.
 * @param {HTMLSelectElement} select
 * @param {string} valeur
 * @param {string} texte
 * @returns {HTMLOptionElement}
 */
function ajouterOption(select, valeur, texte) {
  const opt = document.createElement("option");
  opt.value = valeur;
  opt.textContent = texte;
  select.appendChild(opt);
  return opt;
}

/* ----------------------------------------------------------
   TABLES DE RÉFÉRENCE PARTAGÉES
   La table de jet de blessure (Force vs Endurance) et le nécessaire
   pour la rendre en <table> accessible (caption, scope, surbrillance
   ligne/colonne au survol/tap) : utilisés à la fois par js/tables.js
   (table complète de tir.html/assaut.html) et par le petit tableau
   flottant plus bas dans ce fichier (activerTableauFlottant) — une
   seule source pour cette donnée de jeu plutôt que deux copies à
   tenir synchronisées. js/tables.js garde ses propres tables (CC, CT,
   positionnement), qui n'ont besoin d'être affichées nulle part
   ailleurs que sur leurs pages dédiées.
   Sécurité : tout le texte est injecté via textContent (jamais
   innerHTML), comme le reste de ce fichier.
   ---------------------------------------------------------- */

// Étiquettes des grandes tables matricielles (valeurs 1 à 10+) :
// aussi utilisée par TABLE_CC (js/tables.js).
const VALEURS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"];

/* Table de blessure : Endurance de la cible (lignes) vs Force de la
   touche (colonnes) — même orientation que la table de référence du
   livre de règles (Endurance en ligne, Force en colonne). '-' =
   blessure impossible. */
const TABLE_BLESSURE = [
  // F:    1     2     3     4     5     6     7     8     9     10+
  ["4+", "3+", "2+", "2+", "2+", "2+", "2+", "2+", "2+", "2+"], // End 1
  ["5+", "4+", "3+", "2+", "2+", "2+", "2+", "2+", "2+", "2+"], // End 2
  ["6+", "5+", "4+", "3+", "2+", "2+", "2+", "2+", "2+", "2+"], // End 3
  ["6+", "6+", "5+", "4+", "3+", "2+", "2+", "2+", "2+", "2+"], // End 4
  ["-", "6+", "6+", "5+", "4+", "3+", "2+", "2+", "2+", "2+"], // End 5
  ["-", "-", "6+", "6+", "5+", "4+", "3+", "2+", "2+", "2+"], // End 6
  ["-", "-", "-", "6+", "6+", "5+", "4+", "3+", "2+", "2+"], // End 7
  ["-", "-", "-", "-", "6+", "6+", "5+", "4+", "3+", "2+"], // End 8
  ["-", "-", "-", "-", "-", "6+", "6+", "5+", "4+", "3+"], // End 9
  ["-", "-", "-", "-", "-", "-", "6+", "6+", "5+", "4+"], // End 10+
];

/**
 * Crée une <table> munie de son <caption>.
 * @param {string} titre  - texte du caption (titre au-dessus de la table)
 * @param {string} classe - classe CSS optionnelle de la table
 * @returns {HTMLTableElement}
 */
function creerTable(titre, classe = "") {
  const table = document.createElement("table");
  if (classe) table.className = classe;
  const caption = document.createElement("caption");
  caption.textContent = titre;
  table.appendChild(caption);
  return table;
}

/**
 * Enrobe la table dans un conteneur .table-scroll (défilement
 * horizontal sur mobile) et l'insère dans le conteneur cible.
 * @param {string} idConteneur - id de la div où insérer la table
 * @param {HTMLTableElement} table
 */
function insererDansScroll(idConteneur, table) {
  const conteneur = document.getElementById(idConteneur);
  if (!conteneur) return;
  const scroll = document.createElement("div");
  scroll.className = "table-scroll";
  scroll.appendChild(table);
  conteneur.appendChild(scroll);
}

/**
 * Légende « ↓ Lignes · → Colonnes » affichée juste au-dessus d'une
 * table-matrice (CC, Blessure) : sur mobile, la cellule de coin du
 * tableau (voir construireMatrice) partage la largeur étroite de la
 * colonne figée et peut ne pas suffire, une fois repliée sur deux
 * lignes, à lever toute ambiguïté sur quel intitulé désigne les
 * lignes et lequel désigne les colonnes. Cette phrase, hors de la
 * zone de défilement horizontal (voir insererDansScroll), reste
 * toujours entièrement visible et lisible, quelle que soit la largeur
 * de l'écran.
 * @param {string} labelLigne
 * @param {string} labelCol
 * @returns {HTMLParagraphElement}
 */
function construireLegendeAxes(labelLigne, labelCol) {
  const p = el("p", "matrice-legende");
  p.appendChild(
    el("span", "matrice-legende-axe", "↓ " + labelLigne + " (lignes)"),
  );
  p.appendChild(document.createTextNode(" · "));
  p.appendChild(
    el("span", "matrice-legende-axe", "→ " + labelCol + " (colonnes)"),
  );
  return p;
}

/**
 * Construit une table "matrice" (CC ou Blessure).
 * @param {string} idConteneur - id de la div où insérer la table
 * @param {string} titre       - texte du caption
 * @param {string} labelLigne  - libellé des lignes (ex: "CC attaquant")
 * @param {string} labelCol    - libellé des colonnes (ex: "CC défenseur")
 * @param {Array}  donnees     - tableau 2D des valeurs
 */
function construireMatrice(idConteneur, titre, labelLigne, labelCol, donnees) {
  const table = creerTable(titre, "table-matrice");

  // --- En-tête : coin + valeurs de colonnes ---
  const thead = document.createElement("thead");
  const ligneEntete = document.createElement("tr");

  const coin = document.createElement("th");
  // Deux lignes empilées plutôt qu'un seul "Attaquant \ Défenseur" à
  // plat (ex-comportement) : sur un écran étroit, cette cellule de
  // coin se coupait de façon ambiguë et donnait l'impression que
  // l'ordre de lecture indiquait quel intitulé est la ligne et lequel
  // est la colonne. Une flèche verticale/horizontale à côté de chaque
  // libellé lève l'ambiguïté même si la cellule doit se replier sur
  // plusieurs lignes (voir aussi construireLegendeAxes, qui répète la
  // même information en toutes lettres au-dessus du tableau).
  coin.appendChild(el("span", "matrice-coin-axe", labelLigne + " ↓"));
  coin.appendChild(el("span", "matrice-coin-axe", labelCol + " →"));
  ligneEntete.appendChild(coin);

  VALEURS.forEach((v) => {
    const th = document.createElement("th");
    th.scope = "col"; // Accessibilité (WCAG 1.3.1 / RGAA 5.7) : association colonne
    th.textContent = v;
    ligneEntete.appendChild(th);
  });
  thead.appendChild(ligneEntete);
  table.appendChild(thead);

  // --- Corps : une ligne par valeur d'attaquant / de force ---
  const tbody = document.createElement("tbody");
  donnees.forEach((ligne, i) => {
    const tr = document.createElement("tr");

    // Première cellule = en-tête de ligne
    const th = document.createElement("th");
    th.scope = "row"; // Accessibilité (WCAG 1.3.1 / RGAA 5.7) : association ligne
    th.textContent = VALEURS[i];
    tr.appendChild(th);

    ligne.forEach((valeur) => {
      const td = document.createElement("td");
      td.textContent = valeur;
      if (valeur === "-") td.classList.add("impossible"); // grise les impossibles
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  const conteneur = document.getElementById(idConteneur);
  if (conteneur)
    conteneur.appendChild(construireLegendeAxes(labelLigne, labelCol));
  insererDansScroll(idConteneur, table);
}

/* ----------------------------------------------------------
   SURBRILLANCE LIGNE + COLONNE AU SURVOL / AU TOUCHER
   La ligne est gérée en CSS (tr:hover, souris uniquement). Pour la
   colonne, on ajoute une classe à toutes les cellules du même index.

   Un seul écouteur par <table> (plutôt qu'un par <td>) suffit :
   c'est de la "délégation d'événements". evenement.target est la
   cellule réellement survolée ; .closest("td") la retrouve même
   si le survol démarre sur un enfant de la cellule.

   Sur téléphone il n'existe pas de survol : un écran tactile ne
   déclenche ni mouseover ni mouseout de façon fiable — mais par
   compatibilité, un tap déclenche quand même un mouseover juste avant
   le click. On garde donc, en plus des classes CSS, une référence
   explicite "celluleFigee" par table : c'est elle (et non l'état des
   classes, qui peut déjà avoir été posé par ce mouseover fantôme) qui
   fait foi pour savoir si un tap doit épingler ou désépingler une case.
   Cela évite qu'un tap sur téléphone n'allume puis n'éteigne aussitôt
   la surbrillance dans la même série d'événements.

   Résultat : au clic (souris) comme au tap (tactile), la case touchée
   reste surlignée jusqu'au prochain tap — pratique pour garder un
   repère pendant qu'on lit le tableau en jouant. Un second tap sur la
   même case, un tap sur une autre case, ou un tap en dehors du
   tableau, la désépingle.

   `racine` (optionnel, document entier par défaut) restreint le
   câblage à un seul conteneur : utile pour une table construite APRÈS
   ce premier passage (ex : le tableau flottant, construit à la
   demande au premier clic, bien après le DOMContentLoaded qui câble
   les tables déjà présentes dans la page).
   ---------------------------------------------------------- */
function surlignerColonne(table, cellule) {
  const index = cellule.cellIndex;
  table.querySelectorAll("tr").forEach((tr) => {
    const c = tr.cells[index];
    if (c) c.classList.add("colonne-active");
  });
  cellule.classList.add("case-active");
}

function effacerSurbrillance(table) {
  table.querySelectorAll(".colonne-active, .case-active").forEach((c) => {
    c.classList.remove("colonne-active", "case-active");
  });
}

function activerSurbrillanceColonnes(racine) {
  // table -> cellule épinglée par un clic/tap (absente si aucune).
  // Stockée en dehors de la boucle pour que le nettoyage "tap en
  // dehors du tableau" ci-dessous puisse aussi oublier l'épingle,
  // et pas seulement retirer les classes CSS.
  const casesEpinglees = new Map();

  (racine || document).querySelectorAll("table").forEach((table) => {
    // Aperçu en direct pendant le survol (souris uniquement, ignoré si
    // une case est déjà épinglée pour ne pas la perturber).
    table.addEventListener("mouseover", (evenement) => {
      if (casesEpinglees.get(table)) return;
      const cellule = evenement.target.closest("td");
      if (!cellule) return;
      surlignerColonne(table, cellule);
    });

    table.addEventListener("mouseout", () => {
      if (!casesEpinglees.get(table)) effacerSurbrillance(table);
    });

    // Souris ET tactile : un clic/tap épingle la surbrillance sur la case
    table.addEventListener("click", (evenement) => {
      const cellule = evenement.target.closest("td");
      if (!cellule) return;

      effacerSurbrillance(table);
      if (casesEpinglees.get(table) === cellule) {
        casesEpinglees.delete(table); // même case retouchée : on désépingle
      } else {
        casesEpinglees.set(table, cellule);
        surlignerColonne(table, cellule);
      }
    });
  });

  // Un tap en dehors de toute table (de `racine`) désépingle la
  // surbrillance (on réutilise effacerSurbrillance plutôt que de
  // redupliquer le retrait des classes).
  document.addEventListener("click", (evenement) => {
    if (evenement.target.closest("table")) return;
    casesEpinglees.clear();
    (racine || document).querySelectorAll("table").forEach(effacerSurbrillance);
  });
}

/* Index des définitions de règles spéciales (REGLES_ARMES +
   REGLES_DIVERSES, voir js/regles-data.js), indexées par nom de
   base sans le "(X)" final : les tables d'armes et les fiches
   d'unités portent une valeur concrète (ex : "Brèche (5+)") alors
   que le lexique les nomme avec un "(X)" générique.
   Construit PARESSEUSEMENT au premier appel : main.js est aussi
   chargé sur des pages sans regles-data.js, où REGLES_ARMES
   n'existe pas — l'index n'y est simplement jamais construit. */
let indexDefinitionsRegles = null;

/**
 * Retrouve la définition d'une règle spéciale ou d'un trait à partir
 * de son intitulé concret (ex : "Brèche (5+)" → texte de "Brèche (X)").
 * En repli, on retire un "e" final du nom de base pour absorber les
 * rares accords grammaticaux (ex : "Empoisonnée" dans les tables
 * d'armes vs "Empoisonné" dans le lexique des règles).
 * Utilisée par js/armes.js (info-bulles de l'Arsenal) et
 * js/unites.js (info-bulles des fiches récap).
 * @param {string} intitule
 * @returns {string|null} définition, ou null si inconnue
 */
function trouverDefinitionRegle(intitule) {
  if (!indexDefinitionsRegles) {
    if (
      typeof REGLES_ARMES === "undefined" ||
      typeof REGLES_DIVERSES === "undefined"
    ) {
      return null; // page sans js/regles-data.js
    }
    indexDefinitionsRegles = new Map();
    [...REGLES_ARMES, ...REGLES_DIVERSES].forEach((regle) => {
      const base = normaliserTexte(regle.nom.replace(/\s*\([^)]*\)\s*$/, ""));
      indexDefinitionsRegles.set(base, regle.texte);
    });
  }
  const base = normaliserTexte(intitule.replace(/\s*\([^)]*\)\s*$/, ""));
  if (indexDefinitionsRegles.has(base)) return indexDefinitionsRegles.get(base);
  if (base.endsWith("e") && indexDefinitionsRegles.has(base.slice(0, -1))) {
    return indexDefinitionsRegles.get(base.slice(0, -1));
  }
  return null;
}

/**
 * Cellule "Règles spéciales" d'une ligne d'arme : chaque règle
 * (séparée par une virgule dans la donnée brute) est habillée d'un
 * .regle-tag portant sa définition (trouverDefinitionRegle) en
 * info-bulle. Utilisée par les tables de l'Arsenal (js/armes.js) et
 * les fiches récap d'unité (js/unites.js) — même colonne, même rendu.
 * @param {string} regles
 * @returns {HTMLTableCellElement}
 */
function construireCelluleReglesArme(regles) {
  const td = el("td", "gauche");
  if (!regles || regles === "-") {
    td.textContent = "-";
    return td;
  }
  regles.split(",").forEach((token, i) => {
    const intitule = token.trim();
    if (i > 0) td.appendChild(document.createTextNode(", "));
    const definition = trouverDefinitionRegle(intitule);
    if (!definition) {
      td.appendChild(document.createTextNode(intitule));
      return;
    }
    td.appendChild(creerRegleTag(intitule, definition));
  });
  return td;
}

/**
 * Construit un .regle-tag focalisable portant sa définition en
 * info-bulle (voir cablerInfoBulles/trouverDefinitionRegle) : motif
 * répété partout où une Règle Spéciale, un Trait ou une arme reconnue
 * doit être signalée sur une fiche (js/unites.js, js/organigramme.js).
 * @param {string} texte - libellé affiché
 * @param {string} definition - texte de l'info-bulle
 * @returns {HTMLSpanElement}
 */
function creerRegleTag(texte, definition) {
  const tag = el("span", "regle-tag", texte);
  tag.tabIndex = 0;
  tag.appendChild(el("span", "tooltip", definition));
  return tag;
}

/* ----------------------------------------------------------
   ACCESSIBILITÉ — info-bulles (WCAG 1.3.1 / 4.1.2)
   Chaque case .orga-boite (organigramme, unites.html) et chaque
   .regle-tag (règles spéciales des tables d'armes, armes.html) est
   focalisable (tabindex="0") et révèle une description au focus. On
   associe la description à son déclencheur via aria-describedby pour
   qu'un lecteur d'écran l'annonce.
   Pas de role="button" : un « bouton » devrait réagir à Entrée/Espace
   (WCAG 2.1.1) alors qu'ici la bulle s'affiche dès la prise de focus —
   c'est le pattern « tooltip », pas « bouton ». Annoncer un bouton
   inerte serait une promesse non tenue pour l'utilisateur d'AT.
   Exposée sur window : js/armes.js construit ses .regle-tag après le
   DOMContentLoaded de ce fichier (scripts chargés en defer, exécutés
   dans l'ordre du document) et doit pouvoir relancer le câblage une
   fois ses éléments en place.
   ---------------------------------------------------------- */
let compteurInfoBulle = 0;
function cablerInfoBulles(racine) {
  (racine || document)
    .querySelectorAll(".orga-boite, .regle-tag, .orga-badge")
    .forEach((declencheur) => {
      const bulle = declencheur.querySelector(".tooltip");
      if (!bulle) return;
      if (!bulle.id) bulle.id = "tooltip-" + compteurInfoBulle++;
      bulle.setAttribute("role", "tooltip");
      declencheur.setAttribute("aria-describedby", bulle.id);
    });
}
window.cablerInfoBulles = cablerInfoBulles;

/* ----------------------------------------------------------
   CLIN D'ŒIL — Erebus
   Tape "Erebus" (accents/majuscules ignorés) dans le champ « Unité à
   ajouter » d'unites.html (#choix-unite, PAS les barres de recherche
   d'armes.html/regles.html #recherche) : son portrait apparaît dans une
   popup par-dessus la page. Purement décoratif — un simple écouteur
   "input" de plus sur ce champ, sans toucher à sa propre logique de
   filtre (unites.js). Une seule popup partagée pour tout le site
   (peu importe combien de champs la déclenchent, si d'autres s'y
   ajoutent un jour), fermable au clic en dehors, via Échap ou en
   effaçant le texte du champ qui l'a ouverte.
   ---------------------------------------------------------- */
function activerClinDoeilErebus() {
  const champs = document.querySelectorAll("#choix-unite");
  if (!champs.length) return;

  const overlay = document.createElement("div");
  overlay.className = "erebus-popup-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Erebus");
  overlay.hidden = true;

  const image = document.createElement("img");
  image.src = RACINE_SITE + "assets/img/erebus.webp";
  image.alt = "Erebus";
  image.className = "erebus-popup-image";
  overlay.appendChild(image);

  document.body.appendChild(overlay);

  const fermer = () => {
    overlay.hidden = true;
  };

  overlay.addEventListener("click", fermer);

  document.addEventListener("keydown", (evenement) => {
    if (evenement.key === "Escape" && !overlay.hidden) fermer();
  });

  champs.forEach((champ) => {
    champ.addEventListener("input", () => {
      const correspond = normaliserTexte(champ.value.trim()) === "erebus";
      overlay.hidden = !correspond;
    });
  });
}

/* ----------------------------------------------------------
   CLIN D'ŒIL — Nuit Éternelle (Konrad Curze)
   Taper "night lords" au clavier (accents/majuscules ignorés, n'importe
   où sur le site) bascule un thème sombre en hommage aux Night Lords et
   à leur philosophie de la peur comme outil de contrôle. Purement
   décoratif — une seule classe sur <body> ; la palette est entièrement
   gérée par CSS (voir "Nuit Éternelle" dans css/style.css).
   Buffer des N dernières touches tapées (comme un code Konami), ignoré
   tant que le focus est dans un champ de saisie (input, textarea,
   contenteditable) pour ne pas basculer le thème pendant qu'on tape
   "night lords" dans une barre de recherche par coïncidence.
   Remis à zéro après un basculement pour ne pas re-basculer en boucle
   si l'utilisateur laisse la séquence au clavier.
   État persisté dans sessionStorage (pas localStorage : contrairement à
   "hh-armee-organigramme" plus bas, ce thème doit survivre à un
   rafraîchissement/changement de page MAIS s'arrêter à la fermeture du
   site — sessionStorage est vidé par le navigateur à la fermeture de
   l'onglet/fenêtre, exactement ce qu'il faut ici).
   ---------------------------------------------------------- */
function activerNuitEternelle() {
  const CLE_STOCKAGE = "hh-nuit-eternelle";
  const SEQUENCE = "night lords".split("");
  let buffer = [];

  try {
    if (sessionStorage.getItem(CLE_STOCKAGE) === "1") {
      document.body.classList.add("nuit-eternelle");
    }
  } catch {
    // stockage indisponible : le thème reste réactivable au clavier,
    // simplement pas mémorisé d'une page à l'autre.
  }

  document.addEventListener("keydown", (evenement) => {
    const cible = evenement.target;
    const dansChampDeSaisie =
      cible &&
      (cible.tagName === "INPUT" ||
        cible.tagName === "TEXTAREA" ||
        cible.isContentEditable);
    // e.key.length === 1 ne garde que les caractères imprimables
    // (rejette Shift, Tab, Escape, flèches...) — inclut l'espace.
    if (dansChampDeSaisie || evenement.key.length !== 1) return;

    buffer.push(evenement.key.toLowerCase());
    if (buffer.length > SEQUENCE.length) buffer.shift();

    if (buffer.join("") === SEQUENCE.join("")) {
      const actif = document.body.classList.toggle("nuit-eternelle");
      try {
        sessionStorage.setItem(CLE_STOCKAGE, actif ? "1" : "0");
      } catch {
        // stockage indisponible : le basculement reste effectif pour
        // cette page, juste pas mémorisé.
      }
      buffer = [];
    }
  });
}

/* ----------------------------------------------------------
   CLIN D'ŒIL — Archives sous scellement
   Visiter tour.html, puis mouvement.html, puis tir.html, dans cet
   ordre précis, affiche un message classifié dans une pop-up façon
   terminal qui grésille (voir "ARCHIVES SOUS SCELLEMENT" dans
   css/style.css). D'autres pages peuvent être visitées ENTRE les
   trois (seules elles comptent pour la progression, le reste de la
   navigation est ignoré) ; revisiter l'une des trois hors de son tour
   (ex : mouvement.html deux fois de suite) remet la progression à
   zéro — sauf tour.html, qui (re)démarre toujours une séquence.
   Progression mémorisée dans sessionStorage, comme
   activerNuitEternelle ci-dessus et pour la même raison : elle ne
   doit pas se terminer dans un autre onglet, ni survivre à la
   fermeture du site.
   ---------------------------------------------------------- */
const SEQUENCE_ARCHIVES = ["tour.html", "mouvement.html", "tir.html"];

function activerArchivesScellees() {
  const CLE_STOCKAGE = "hh-etape-archives";
  const page = location.pathname.split("/").pop();
  const indexPage = SEQUENCE_ARCHIVES.indexOf(page);
  if (indexPage === -1) return; // page hors séquence : n'affecte pas la progression

  let etape = 0;
  try {
    etape = parseInt(sessionStorage.getItem(CLE_STOCKAGE), 10) || 0;
  } catch {
    // stockage indisponible : la progression ne peut simplement pas
    // survivre au changement de page, la séquence reste injouable.
  }

  if (indexPage === 0) {
    etape = 1; // tour.html (re)démarre toujours la séquence
  } else if (indexPage === etape) {
    etape += 1; // page suivante attendue : la séquence progresse
  } else {
    etape = 0; // mauvais ordre : on repart de zéro
  }

  if (etape === SEQUENCE_ARCHIVES.length) {
    afficherMessageArchives();
    etape = 0; // rejouable
  }

  try {
    sessionStorage.setItem(CLE_STOCKAGE, String(etape));
  } catch {
    // stockage indisponible : rien à mémoriser d'une page à l'autre.
  }
}

/**
 * Pop-up "terminal" affichant le message des Archives sous scellement.
 * `inert` sur tous les autres enfants de <body> le temps de l'affichage
 * (même mécanisme que `grid.inert` dans la modale de portraits de
 * pages/choix-legion.html) plutôt qu'un piège de focus manuel : promet
 * qu'aucun contrôle caché derrière le voile noir ne reste focalisable
 * (WCAG 2.4.3 / RGAA 12.8). Le focus revient ensuite à l'élément qui
 * avait le focus avant l'ouverture.
 */
function afficherMessageArchives() {
  const declencheur = document.activeElement;
  const enfantsBody = Array.from(document.body.children);

  const fond = el("div", "archives-fond");
  const terminal = el("div", "archives-terminal");
  terminal.setAttribute("role", "alertdialog");
  terminal.setAttribute("aria-modal", "true");
  terminal.tabIndex = -1;

  const titre = el(
    "h2",
    "archives-titre",
    "Archives sous scellement de l’Empereur",
  );
  titre.id = "archives-titre";
  terminal.setAttribute("aria-labelledby", titre.id);

  const texte = el(
    "p",
    "archives-texte",
    "Transmettre ce code à l’Administratum : Hydra Dominatus.",
  );

  const boutonFermer = document.createElement("button");
  boutonFermer.type = "button";
  boutonFermer.className = "archives-fermer";
  boutonFermer.textContent = "Fermer";

  function fermer() {
    fond.remove();
    enfantsBody.forEach((enfant) => {
      enfant.inert = false;
    });
    document.removeEventListener("keydown", surEchap);
    if (declencheur && document.contains(declencheur)) declencheur.focus();
  }

  function surEchap(evenement) {
    if (evenement.key === "Escape") fermer();
  }

  boutonFermer.addEventListener("click", fermer);
  fond.addEventListener("click", (evenement) => {
    if (evenement.target === fond) fermer();
  });
  document.addEventListener("keydown", surEchap);

  terminal.append(titre, texte, boutonFermer);
  fond.appendChild(terminal);
  enfantsBody.forEach((enfant) => {
    enfant.inert = true;
  });
  document.body.appendChild(fond);
  terminal.focus();
}

/* ----------------------------------------------------------
   RACINE DU SITE
   Déduite de l'URL réelle de ce script (résolue en absolu par le
   navigateur) plutôt que codée en dur : fonctionne aussi bien depuis
   index.html (racine) que depuis pages/*.html, et quel que soit le
   sous-chemin d'hébergement (ex : GitHub Pages, jean-desaintangel.
   github.io/horus_heresy/). Posée hors DOMContentLoaded, au plus tôt
   (script en defer, donc document.currentScript encore valide).
   Consommée par construireNavigation/construirePiedDePage ci-dessous
   et par le skin de Légion plus bas.
   ---------------------------------------------------------- */
const RACINE_SITE = document.currentScript.src.replace(/js\/main\.js.*$/, "");

/* ----------------------------------------------------------
   MODE HORS LIGNE — enregistrement du Service Worker
   Utile en boutique : aucun Wi-Fi ni réseau mobile là où se jouent
   les parties. Le Service Worker (service-worker.js, racine du
   site) précharge tout l'app shell (pages, CSS, JS, données de jeu,
   polices, blasons) dès la première visite en ligne, pour une
   consultation ensuite possible hors ligne — voir les commentaires
   de service-worker.js pour le détail des deux stratégies de cache.
   `RACINE_SITE` (ci-dessus) donne l'URL absolue de la racine du
   site : indispensable pour que l'enregistrement fonctionne aussi
   bien en local que sous un sous-chemin d'hébergement (GitHub
   Pages, jean-desaintangel.github.io/horus_heresy/) — un chemin en
   dur "/service-worker.js" pointerait à la racine du DOMAINE, pas du
   site, et échouerait sous ce sous-chemin. `scope` explicite pour
   couvrir aussi bien index.html que pages/*.html.
   Posé hors DOMContentLoaded (script en defer) ; `serviceWorker` est
   absent sur http:// non sécurisé — sans incidence ici (GitHub
   Pages et localhost sont tous deux des contextes sécurisés).
   ---------------------------------------------------------- */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(RACINE_SITE + "service-worker.js", { scope: RACINE_SITE })
      .catch((erreur) => {
        console.warn("[SW] Échec de l'enregistrement :", erreur);
      });
  });
}

/* ----------------------------------------------------------
   FAVICON ALÉATOIRE — SITE ENTIER, RENOUVELÉ TOUTES LES 5 MINUTES
   Le <link rel="icon"> statique de chaque page HTML pointe sur
   assets/favicon/favicon_sons_of_horus.png (valeur par défaut, utile
   tant que ce script n'a pas encore tourné, ex : JS désactivé). On le
   remplace ici par un tirage aléatoire parmi tous les blasons de
   assets/favicon/ (un par Légion + Mechanicum), qui ne se répète pas
   avant d'avoir vu passer 2 autres tirages ("pas dans les 2 dernières
   5 minutes"). Persiste dans localStorage (dernier tirage + date)
   pour survivre à un changement de page ; site statique sans backend,
   donc pas de tirage partagé entre visiteurs — chacun a son propre
   historique. `setInterval` maintient la rotation tant que l'onglet
   reste ouvert, sans recharger la page.
   Posé hors DOMContentLoaded, au plus tôt (script en defer, donc
   <head> déjà parsé), pour éviter que l'icône par défaut n'apparaisse
   un instant avant le premier tirage.
   ---------------------------------------------------------- */
(function appliquerFaviconAleatoire() {
  const FAVICONS = [
    "favicon_alpha_legion.jpg",
    "favicon_blood_angels.jpg",
    "favicon_dark_angels.jpg",
    "favicon_death_guards.webp",
    "favicon_emperors_children.jpg",
    "favicon_imperial_fists.jpg",
    "favicon_iron_hands.jpg",
    "favicon_iron_warriors.png",
    "favicon_mechanicum.jpg",
    "favicon_night_lords.webp",
    "favicon_raven_guards.jpg",
    "favicon_salamanders.png",
    "favicon_sons_of_horus.png",
    "favicon_space_wolves.png",
    "favicon_thousand_sons.png",
    "favicon_ultramarine.png",
    "favicon_white_scars.png",
    "favicon_word_bearer.jpg",
    "favicon_world_eaters.png",
  ];
  const DUREE_MS = 5 * 60 * 1000;
  const CLE_STOCKAGE_FAVICON = "horus-heresy-favicon";
  const lienIcone = document.querySelector('link[rel="icon"]');
  if (!lienIcone) return;

  // Historique des 2 derniers tirages + date du dernier, pour savoir
  // s'il faut re-tirer et quoi exclure. localStorage indisponible
  // (navigation privée…) : on retombe simplement sur un tirage à
  // chaque appel, sans mémoire d'une page à l'autre.
  function lireHistorique() {
    try {
      const brut = JSON.parse(localStorage.getItem(CLE_STOCKAGE_FAVICON));
      if (brut && Array.isArray(brut.historique) && brut.depuis) return brut;
    } catch {
      /* stockage indisponible ou corrompu : on ignore */
    }
    return null;
  }

  function ecrireHistorique(historique, depuis) {
    try {
      localStorage.setItem(
        CLE_STOCKAGE_FAVICON,
        JSON.stringify({ historique, depuis }),
      );
    } catch {
      /* stockage indisponible (navigation privée…) : on ignore */
    }
  }

  // Tire un blason au hasard parmi ceux n'apparaissant pas dans les 2
  // derniers tirages (`historique`, déjà limité à 2 entrées).
  function tirer(historique) {
    const candidats = FAVICONS.filter((f) => !historique.includes(f));
    return candidats[Math.floor(Math.random() * candidats.length)];
  }

  function actualiser() {
    const etat = lireHistorique();
    const maintenant = Date.now();
    if (etat && maintenant - etat.depuis < DUREE_MS) {
      lienIcone.href =
        RACINE_SITE +
        "assets/favicon/" +
        etat.historique[etat.historique.length - 1];
      return;
    }
    const historiquePrecedent = etat ? etat.historique : [];
    const nouveau = tirer(historiquePrecedent);
    lienIcone.href = RACINE_SITE + "assets/favicon/" + nouveau;
    ecrireHistorique([...historiquePrecedent, nouveau].slice(-2), maintenant);
  }

  actualiser();
  setInterval(actualiser, 60 * 1000);
})();

/* ----------------------------------------------------------
   NAVIGATION ET PIED DE PAGE — SITE ENTIER
   Identiques sur toutes les pages : générés ici une seule fois plutôt
   que dupliqués dans chaque fichier HTML (une seule liste à tenir à
   jour, un seul ordre à corriger). Chaque page HTML ne garde qu'un
   conteneur vide (<ul class="nav-menu"></ul>, <footer></footer>) que
   ce script remplit au chargement.
   Sécurité : construit via createElement/textContent, jamais
   innerHTML (voir la note Sécurité en tête de fichier).
   ---------------------------------------------------------- */
// Ordre d'affichage des liens du menu principal.
const LIENS_NAV = [
  { href: "unites.html", texte: "Construction d’armée" },
  { href: "tour.html", texte: "Tour" },
  { href: "mouvement.html", texte: "Mouvement" },
  { href: "tir.html", texte: "Tir" },
  { href: "assaut.html", texte: "Assaut" },
  { href: "defi.html", texte: "Défi" },
  { href: "armes.html", texte: "Armes" },
  { href: "statuts-reactions.html", texte: "Statuts & Réactions" },
  { href: "regles.html", texte: "Règles spéciales" },
  { href: "psy.html", texte: "Psychique" },
  { href: "vehicule.html", texte: "Véhicules" },
  { href: "titan.html", texte: "Titans" },
  { href: "telechargement.html", texte: "Téléchargements" },
];

// Remplit .nav-menu et corrige le lien du logo (utile depuis index.html
// comme depuis pages/*.html, sans distinguer les deux cas au cas par
// cas). aria-current="page" est posé sur l'entrée qui correspond à la
// page actuellement affichée (comparaison sur le nom de fichier).
function construireNavigation() {
  const logo = document.querySelector(".nav-logo");
  if (logo) logo.href = RACINE_SITE + "index.html";

  const menu = document.querySelector(".nav-menu");
  if (!menu) return;
  menu.replaceChildren();
  const pageActuelle = location.pathname.split("/").pop();
  for (const lien of LIENS_NAV) {
    const a = document.createElement("a");
    a.href = RACINE_SITE + "pages/" + lien.href;
    a.textContent = lien.texte;
    if (lien.href === pageActuelle) a.setAttribute("aria-current", "page");
    const li = document.createElement("li");
    li.appendChild(a);
    menu.appendChild(li);
  }
}

// Lien externe accessible (nouvel onglet + mention "(nouvelle fenêtre)"
// pour les lecteurs d'écran, WCAG 3.2.5) : factorisé ici, répété pour
// chaque source du pied de page ci-dessous.
function lienExterne(href, texte) {
  const a = document.createElement("a");
  a.href = href;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.append(texte + " ", el("span", "sr-only", "(nouvelle fenêtre)"));
  return a;
}

// Sources ayant servi à la retranscription du site (livres d'armée,
// blasons) : voir le pied de page ci-dessous.
const SOURCES_SITE = [
  {
    texte: "Livre de Règles",
    href: "https://www.warhammer.com/fr-FR/shop/horus-heresy-age-of-darkness-rulebook-2025-fre",
  },
  {
    texte: "Liber Astartes",
    href: "https://www.warhammer.com/fr-FR/shop/horus-heresy-liber-astartes-2025-fre",
  },
  {
    texte: "Liber Hereticus",
    href: "https://www.warhammer.com/fr-FR/shop/horus-heresy-liber-hereticus-2025-fre",
  },
  {
    texte: "Liber Questoris",
    href: "https://www.warhammer.com/fr-FR/shop/horus-heresy-liber-questoris-2025-fre",
  },
  {
    texte: "Liber Auxilia",
    href: "https://www.warhammer.com/fr-FR/shop/horus-heresy-liber-auxilia-2025-fre",
  },
  {
    texte: "Liber Mechanicum",
    href: "https://www.warhammer.com/fr-FR/shop/horus-heresy-liber-mechanicum-2025-fre",
  },
  {
    texte: "Unités Legacies",
    href: "https://assets.warhammer-community.com/eng_30-10_thehorusheresy_aod_legacies-rosvjdnd1o-gqos8xkdx7.pdf",
  },
  {
    texte: "logos des Légions",
    href: "https://fr.pinterest.com/pin/512143788883678481/",
  },
  {
    texte: "logo Legio Titanicus",
    href: "https://fr.pinterest.com/pin/53409945577919499/",
  },
  {
    texte: "Images des Primarques",
    href: "https://www.facebook.com/groups/769030825014568/user/100000271415071/",
  },
];

// Remplit le <footer> (lien de signalement + mentions légales + sources).
function construirePiedDePage() {
  const pied = document.querySelector("footer");
  if (!pied) return;
  pied.replaceChildren();

  const pSignalement = el("p", "footer-signalement");
  pSignalement.append("Une erreur, une suggestion ? ");
  const lienContact = document.createElement("a");
  lienContact.href = RACINE_SITE + "pages/contact.html";
  lienContact.textContent = "Signalez-la";
  pSignalement.append(lienContact, ".");
  pied.appendChild(pSignalement);

  const pDisclaimer = el("p", "footer-disclaimer");
  const strong = el(
    "strong",
    null,
    "Guide non officiel réalisé par des fans bénévoles francophones.",
  );
  pDisclaimer.append(
    strong,
    " Horus Heresy, Warhammer : The Horus Heresy et tous les noms" +
      " associés sont des marques déposées de ",
    lienExterne("https://www.games-workshop.com", "Games Workshop Ltd"),
    ". Ce site n’est ni affilié ni approuvé par Games Workshop." +
      " Aucun défi à leur statut n’est intentionné.",
  );
  pied.appendChild(pDisclaimer);

  // Sources : livres d'armée officiels utilisés pour la retranscription
  // des règles, ainsi que les blasons/logos réutilisés (voir
  // SOURCES_SITE ci-dessus).
  const pSources = el("p", "footer-sources");
  pSources.append("Sources : ");
  SOURCES_SITE.forEach((source, indice) => {
    pSources.append(lienExterne(source.href, source.texte));
    pSources.append(indice < SOURCES_SITE.length - 1 ? ", " : ".");
  });
  pied.appendChild(pSources);
}

document.addEventListener("DOMContentLoaded", () => {
  construireNavigation();
  construirePiedDePage();
});

/* ----------------------------------------------------------
   SKIN DE LÉGION / FACTION — SITE ENTIER
   js/organigramme.js pose une classe "skin-legion-*" sur <body>
   (voir "Skins de Légion" dans css/style.css) mais uniquement sur
   pages/unites.html, la seule page qui le charge. On relit ici la
   même clé localStorage ("hh-armee-organigramme", voir
   CLE_STOCKAGE_ORGA dans organigramme.js — dupliquée car ce fichier
   n'est pas chargé partout) pour poser la même classe sur TOUTES les
   pages : la palette (--accent…) et le(s) blason(s) suivent alors le
   joueur d'une page à l'autre.
   Posé hors DOMContentLoaded, au plus tôt (script en defer, donc DOM
   déjà prêt) pour éviter un flash de la palette par défaut. Le(s)
   blason(s) devant h1.titre-page attendent DOMContentLoaded (élément
   pas forcément déjà présent dans <head>-relative timing, et moins
   critique côté flash vu leur petite taille).
   Trois skins possibles, mutuellement exclusifs (une Armée Legio
   Titanicus ou Chevaliers Questoris n'a pas de Légion, `legion` reste
   "" dans la sauvegarde) :
   - Légion Astartes : un seul blason (assets/logo_legions/*.png, voir
     LOGOS_LEGION dans organigramme.js pour la légende des coquilles de
     noms de fichiers conservées telles quelles), posé à gauche.
   - Faction Legio Titanicus (SKIN_TITANICUS, organigramme.js) : deux
     blasons (assets/logo_titan/1.png et 2.png), posés à gauche ET à
     droite du titre.
   - Faction Chevaliers Questoris (SKINS_MAISONNEE, organigramme.js) :
     un seul blason (assets/logo_chevaliers/*.png, un fichier par
     Maisonnée), posé à gauche, comme une Légion.
   ---------------------------------------------------------- */
(function appliquerSkinLegionGlobal() {
  const LOGOS_LEGION = {
    I: "dark_angels",
    III: "emperor_children",
    IV: "iron_warriors",
    V: "white_scars",
    VI: "space_wolves",
    VII: "imperial_fists",
    VIII: "night_lords",
    IX: "blood_angels",
    X: "iron_hands",
    XII: "world_eaters",
    XIII: "ultramarines",
    XIV: "death_guards",
    XV: "thousand_sons",
    XVI: "sons_of_horus",
    XVII: "word_bearers",
    XVIII: "salamanders",
    XIX: "raven_guards",
    XX: "alpha_legion",
  };

  // Blasons de Désignation de Legiones Auxilia (LOGOS_DESIGNATION_AUXILIA,
  // js/organigramme.js) — dupliqués ici pour la même raison que
  // LOGOS_LEGION ci-dessus (ce fichier n'est chargé que sur
  // pages/unites.html). Clé = id DESIGNATIONS_LEGIONES_AUXILIA
  // (js/organigramme-data.js), valeur = nom de fichier réel sous
  // assets/logo_solar_auxilia/ (plusieurs ont une coquille ou un
  // raccourci par rapport à l'id établi, conservées telles quelles).
  const LOGOS_DESIGNATION_AUXILIA = {
    "chasseurs-calibanites": "chasseur_calibanite",
    "palatins-archites": "palatin_archites",
    "thorakites-selucides": "thorakites_selucides",
    "limitanei-chogoriens": "limitanei_chogoriens",
    "kaerls-fenrissiens": "kaerls_fenrissiens",
    "phalangites-dinwit": "phalangites_inwit",
    "damnatii-nostramiens": "damnatii_nostariens",
    "elevatii-saiphains": "elevatii_saiphains",
    "suaire-de-chaines-medusien": "suaire_de_chaine_stheneen",
    "thraexii-nagrakals": "thraexii_nagrakals",
    "haute-garde-dultramar": "haute_garde_ultramar",
    "ambaxtoi-de-barbarus": "ambaxtoi_de_barbarus",
    "gardespire-prosperienne": "gardespire_prosperien",
    "chasseurs-de-tetes-cthoniens": "chasseur_tete_chnotien",
    "velites-de-therion": "velite_therion",
    "vindictaires-sparatoi": "vindictaire_sparatoi",
  };

  let donnees;
  try {
    const brut = localStorage.getItem("hh-armee-organigramme");
    if (!brut) return;
    donnees = JSON.parse(brut);
  } catch {
    return; // stockage indisponible ou corrompu : palette par défaut
  }

  const creerBlason = (dossier, fichier, classeSupplementaire) => {
    const img = document.createElement("img");
    img.className = classeSupplementaire
      ? "legion-icon " + classeSupplementaire
      : "legion-icon";
    img.src = RACINE_SITE + "assets/" + dossier + "/" + fichier + ".png";
    img.alt = "";
    img.setAttribute("aria-hidden", "true");
    img.loading = "lazy";
    return img;
  };

  const legion = donnees.legion;
  if (typeof legion === "string" && LOGOS_LEGION[legion]) {
    document.body.classList.add("skin-legion-" + legion.toLowerCase());
    document.addEventListener("DOMContentLoaded", () => {
      const titre = document.querySelector("h1.titre-page");
      if (!titre || titre.querySelector(".legion-icon")) return;
      titre.insertBefore(
        creerBlason("logo_legions", LOGOS_LEGION[legion], "legion-icon--titre"),
        titre.firstChild,
      );
    });
  } else if (donnees.faction === "legio-titanicus") {
    document.body.classList.add("skin-legion-titanicus");
    document.addEventListener("DOMContentLoaded", () => {
      const titre = document.querySelector("h1.titre-page");
      if (!titre || titre.querySelector(".legion-icon")) return;
      titre.insertBefore(
        creerBlason("logo_titan", "1", "legion-icon--titre"),
        titre.firstChild,
      );
      titre.appendChild(
        creerBlason(
          "logo_titan",
          "2",
          "legion-icon--titre legion-icon--titre-droite",
        ),
      );
    });
  } else if (
    donnees.faction === "chevaliers-questoris" &&
    ["imperialis", "mechanicum", "mendicus"].includes(donnees.maisonnee)
  ) {
    // Maisonnée Questoris (SKINS_MAISONNEE, organigramme.js) : même
    // logique de blason qu'une Légion, avec le fichier propre à chaque
    // Maisonnée (assets/logo_chevaliers/*.png).
    const LOGOS_MAISONNEE = {
      imperialis: "logo",
      mechanicum: "logo_2",
      mendicus: "logo_3",
    };
    document.body.classList.add("skin-legion-questoris-" + donnees.maisonnee);
    document.addEventListener("DOMContentLoaded", () => {
      const titre = document.querySelector("h1.titre-page");
      if (!titre || titre.querySelector(".legion-icon")) return;
      titre.insertBefore(
        creerBlason(
          "logo_chevaliers",
          LOGOS_MAISONNEE[donnees.maisonnee],
          "legion-icon--titre",
        ),
        titre.firstChild,
      );
    });
  } else if (donnees.faction === "mechanicum") {
    // Faction Mechanicum (SKIN_MECHANICUM, organigramme.js) : deux
    // blasons comme Legio Titanicus ci-dessus (assets/logo_mechanicum/
    // 1.png et 2.png).
    document.body.classList.add("skin-legion-mechanicum");
    document.addEventListener("DOMContentLoaded", () => {
      const titre = document.querySelector("h1.titre-page");
      if (!titre || titre.querySelector(".legion-icon")) return;
      titre.insertBefore(
        creerBlason("logo_mechanicum", "1", "legion-icon--titre"),
        titre.firstChild,
      );
      titre.appendChild(
        creerBlason(
          "logo_mechanicum",
          "2",
          "legion-icon--titre legion-icon--titre-droite",
        ),
      );
    });
  } else if (
    donnees.faction === "solar-auxilia" &&
    typeof donnees.designationAuxilia === "string" &&
    LOGOS_DESIGNATION_AUXILIA[donnees.designationAuxilia]
  ) {
    // Désignation de Legiones Auxilia Solar Auxilia (SKINS_DESIGNATION_
    // AUXILIA, organigramme.js) : un seul blason à gauche du titre,
    // comme une Légion Astartes ci-dessus (assets/logo_solar_auxilia/).
    document.body.classList.add(
      "skin-legion-solar-" + donnees.designationAuxilia,
    );
    document.addEventListener("DOMContentLoaded", () => {
      const titre = document.querySelector("h1.titre-page");
      if (!titre || titre.querySelector(".legion-icon")) return;
      titre.insertBefore(
        creerBlason(
          "logo_solar_auxilia",
          LOGOS_DESIGNATION_AUXILIA[donnees.designationAuxilia],
          "legion-icon--titre",
        ),
        titre.firstChild,
      );
    });
  }
})();

/* ----------------------------------------------------------
   TABLEAU DE BLESSURE FLOTTANT — TOUTES LES PAGES SAUF
   index.html, choix-legion.html (ne charge pas main.js, donc jamais
   concernée) ET unites.html (organigramme déjà dense, pas la peine
   d'y ajouter un widget de plus).
   Un petit bouton rond (position: fixed) déplaçable à la souris comme
   au doigt (Pointer Events, unifie souris/tactile/stylet) ; un simple
   clic/tap (sans déplacement) bascule un panneau reprenant la table
   de jet de blessure (VALEURS/TABLE_BLESSURE/construireMatrice, voir
   plus haut dans ce fichier) — même rendu et même surbrillance au
   survol/tap que sur tir.html/assaut.html, construite une seule fois
   à la demande (premier clic) plutôt qu'au chargement de la page.
   ---------------------------------------------------------- */
function activerTableauFlottant() {
  const PAGES_SANS_TABLEAU_FLOTTANT = ["", "index.html", "unites.html"];
  const pageActuelle = location.pathname.split("/").pop();
  if (PAGES_SANS_TABLEAU_FLOTTANT.includes(pageActuelle)) return;

  const conteneur = el("div", "table-flottante");

  const bouton = document.createElement("button");
  bouton.type = "button";
  bouton.className = "table-flottante-bouton";
  bouton.title = "Jet de blessure";
  bouton.setAttribute("aria-expanded", "false");
  bouton.setAttribute("aria-label", "Afficher le tableau de jet de blessure");
  bouton.textContent = "†";

  const panneau = el("div", "table-flottante-panneau");
  panneau.id = "table-flottante-panneau";
  panneau.hidden = true;
  panneau.setAttribute("role", "region");
  bouton.setAttribute("aria-controls", panneau.id);

  const entete = el("div", "table-flottante-entete");
  const titre = el("h2", null, "Jet de blessure");
  titre.id = "table-flottante-titre";
  panneau.setAttribute("aria-labelledby", titre.id);
  // Même convention que .modal-close (pages/choix-legion.html) : glyphe
  // "×" en texte visible + aria-label pour l'accessible name (le
  // libellé prime sur le texte affiché, WCAG 4.1.2).
  const boutonFermer = document.createElement("button");
  boutonFermer.type = "button";
  boutonFermer.className = "table-flottante-fermer";
  boutonFermer.setAttribute(
    "aria-label",
    "Fermer le tableau de jet de blessure",
  );
  boutonFermer.textContent = "×";
  entete.append(titre, boutonFermer);

  const corps = el("div", "table-flottante-corps");
  corps.id = "table-flottante-corps";
  panneau.append(entete, corps);

  conteneur.append(bouton, panneau);
  document.body.appendChild(conteneur);

  /* --- Ouverture/fermeture --- */
  let tableConstruite = false;
  function ouvrir() {
    if (!tableConstruite) {
      construireMatrice(
        corps.id,
        "Jet de blessure (Endurance de la cible contre Force de la touche)",
        "Endurance",
        "Force",
        TABLE_BLESSURE,
      );
      activerSurbrillanceColonnes(panneau);
      tableConstruite = true;
    }
    panneau.hidden = false;
    positionnerPanneau();
    bouton.setAttribute("aria-expanded", "true");
    bouton.setAttribute("aria-label", "Masquer le tableau de jet de blessure");
  }
  function fermerPanneau() {
    panneau.hidden = true;
    bouton.setAttribute("aria-expanded", "false");
    bouton.setAttribute("aria-label", "Afficher le tableau de jet de blessure");
  }
  function basculer() {
    if (panneau.hidden) ouvrir();
    else fermerPanneau();
  }

  // Le panneau s'ouvre au-dessus/à gauche du bouton par défaut ; on
  // bascule sous/à droite quand la place manque (bouton glissé près
  // d'un bord par un déplacement, voir plus bas).
  function positionnerPanneau() {
    const rect = conteneur.getBoundingClientRect();
    const largeurPanneau = panneau.offsetWidth || 380;
    const hauteurPanneau = panneau.offsetHeight || 320;
    panneau.classList.toggle(
      "table-flottante-panneau--bas",
      rect.top < hauteurPanneau + 24,
    );
    panneau.classList.toggle(
      "table-flottante-panneau--gauche",
      rect.right - largeurPanneau < 8,
    );
  }

  boutonFermer.addEventListener("click", () => {
    fermerPanneau();
    bouton.focus();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !panneau.hidden) {
      fermerPanneau();
      bouton.focus();
    }
  });
  // Clic/tap en dehors du widget : referme (même esprit que le
  // désépinglage "tap en dehors du tableau" d'activerSurbrillanceColonnes).
  document.addEventListener("click", (e) => {
    if (panneau.hidden || conteneur.contains(e.target)) return;
    fermerPanneau();
  });

  /* --- Déplacement du bouton (souris/tactile/stylet unifiés) ---
     Le conteneur démarre positionné via right/bottom (CSS) ; on ne
     bascule vers left/top en pixels qu'au premier vrai déplacement,
     pour ne jamais figer une position par défaut inutilement. Un
     simple clic/tap (déplacement sous le seuil) bascule le panneau au
     lieu de le déplacer — dissocié via le indicateur `deplace`. */
  let etatDeplacement = null;
  let dernierDeplacement = false;
  const SEUIL_DEPLACEMENT = 6; // px : tolère un léger tremblement du doigt

  bouton.addEventListener("pointerdown", (e) => {
    const rect = conteneur.getBoundingClientRect();
    etatDeplacement = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      origLeft: rect.left,
      origTop: rect.top,
      deplace: false,
    };
    bouton.setPointerCapture(e.pointerId);
  });

  bouton.addEventListener("pointermove", (e) => {
    if (!etatDeplacement || e.pointerId !== etatDeplacement.pointerId) return;
    const dx = e.clientX - etatDeplacement.startX;
    const dy = e.clientY - etatDeplacement.startY;
    if (!etatDeplacement.deplace && Math.hypot(dx, dy) < SEUIL_DEPLACEMENT) {
      return;
    }
    etatDeplacement.deplace = true;
    if (!conteneur.style.left) {
      conteneur.style.right = "auto";
      conteneur.style.bottom = "auto";
    }
    const marge = 4;
    const left = Math.min(
      Math.max(etatDeplacement.origLeft + dx, marge),
      window.innerWidth - conteneur.offsetWidth - marge,
    );
    const top = Math.min(
      Math.max(etatDeplacement.origTop + dy, marge),
      window.innerHeight - conteneur.offsetHeight - marge,
    );
    conteneur.style.left = left + "px";
    conteneur.style.top = top + "px";
    if (!panneau.hidden) positionnerPanneau();
  });

  bouton.addEventListener("pointerup", (e) => {
    if (!etatDeplacement || e.pointerId !== etatDeplacement.pointerId) return;
    dernierDeplacement = etatDeplacement.deplace;
    bouton.releasePointerCapture(e.pointerId);
    etatDeplacement = null;
  });
  bouton.addEventListener("pointercancel", () => {
    etatDeplacement = null;
  });

  // Un simple clic/tap (souris, tactile) ET l'activation clavier
  // (Entrée/Espace, qui ne déclenche jamais d'événement pointer)
  // passent tous les deux par ce seul écouteur "click" ; on ignore
  // seulement celui qui suit immédiatement un vrai déplacement.
  bouton.addEventListener("click", () => {
    if (dernierDeplacement) {
      dernierDeplacement = false;
      return;
    }
    basculer();
  });

  // Reclampe la position dans le viewport après un redimensionnement/
  // une rotation d'écran (seulement si le bouton a déjà été déplacé :
  // sinon right/bottom suivent déjà le viewport tout seuls en CSS).
  window.addEventListener("resize", () => {
    if (!conteneur.style.left) return;
    const rect = conteneur.getBoundingClientRect();
    const marge = 4;
    conteneur.style.left =
      Math.min(
        Math.max(rect.left, marge),
        window.innerWidth - rect.width - marge,
      ) + "px";
    conteneur.style.top =
      Math.min(
        Math.max(rect.top, marge),
        window.innerHeight - rect.height - marge,
      ) + "px";
    if (!panneau.hidden) positionnerPanneau();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  /* ----------------------------------------------------------
     1. MENU BURGER (mobile)
     Le bouton .nav-burger affiche/masque la liste .nav-menu
     ---------------------------------------------------------- */
  const burger = document.querySelector(".nav-burger");
  const menu = document.querySelector(".nav-menu");

  if (burger && menu) {
    // Accessibilité (WCAG 4.1.2 / RGAA 7.1) : relier explicitement le bouton
    // à la liste qu'il pilote via aria-controls.
    if (!menu.id) menu.id = "nav-menu-principal";
    burger.setAttribute("aria-controls", menu.id);

    burger.addEventListener("click", () => {
      menu.classList.toggle("ouvert");
      // Accessibilité : on informe les lecteurs d'écran de l'état du menu
      const ouvert = menu.classList.contains("ouvert");
      burger.setAttribute("aria-expanded", ouvert ? "true" : "false");
      // Le libellé suit l'action réellement disponible (ouvrir / fermer)
      burger.setAttribute(
        "aria-label",
        ouvert ? "Fermer le menu" : "Ouvrir le menu",
      );
    });
  }

  /* ----------------------------------------------------------
     1bis. HAUTEUR RÉELLE DE LA NAV (--nav-height)
     .nav est en position: fixed, donc main réserve un padding-top
     pour ne pas passer dessous. Une valeur fixe en CSS suppose que
     le logo tient sur une seule ligne (mobile) ou deux (bureau) —
     faux si le texte s'agrandit (réglages d'accessibilité, zoom du
     navigateur) et passe sur une ligne de plus : la barre déborde
     alors sur le contenu, avec le bouton burger qui chevauche le
     texte en dessous. On mesure donc la hauteur réelle et on la
     publie en variable CSS, consommée par main/html (voir
     css/style.css).
     On ignore les mesures pendant que le menu mobile est déplié :
     replié, il recouvre déjà le contenu en overlay (comportement
     voulu), pas la peine de repousser tout le reste de la page.
     ---------------------------------------------------------- */
  const nav = document.querySelector(".nav");
  if (nav) {
    const majHauteurNav = () => {
      if (menu && menu.classList.contains("ouvert")) return;
      document.documentElement.style.setProperty(
        "--nav-height",
        `${nav.offsetHeight}px`,
      );
    };
    majHauteurNav();
    // Recalcule aussi au chargement de la police Cinzel (le logo change
    // de largeur une fois la police web appliquée) et à tout redimen-
    // sionnement/rotation de l'écran.
    new ResizeObserver(majHauteurNav).observe(nav);
  }

  /* ----------------------------------------------------------
     ACCESSIBILITÉ — chevrons purement décoratifs (WCAG 1.1.1 / RGAA 1.1)
     Le glyphe « ❯ » ne porte aucune information : on le masque aux
     technologies d'assistance pour éviter qu'il soit vocalisé.
     ---------------------------------------------------------- */
  document
    .querySelectorAll(".chevron")
    .forEach((c) => c.setAttribute("aria-hidden", "true"));

  // Câblage initial : couvre les .orga-boite/.regle-tag déjà présentes
  // dans le HTML au chargement (voir définition de cablerInfoBulles
  // plus haut dans ce fichier).
  cablerInfoBulles();

  activerClinDoeilErebus();
  activerNuitEternelle();
  activerArchivesScellees();

  /* ----------------------------------------------------------
     ACCESSIBILITÉ — fermeture des info-bulles au clavier (WCAG 1.4.13)
     La touche Échap retire le focus de la case active, ce qui referme
     la bulle (pilotée en CSS via :focus).
     ---------------------------------------------------------- */
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      document.activeElement &&
      (document.activeElement.classList.contains("orga-boite") ||
        document.activeElement.classList.contains("regle-tag") ||
        document.activeElement.classList.contains("orga-badge"))
    ) {
      document.activeElement.blur();
    }
  });

  /* ----------------------------------------------------------
     PRÉPARATION COMMUNE D'UN PANNEAU DÉPLIABLE
     - type="button" (le bouton n'est pas un bouton de soumission) ;
     - aria-controls : relie le bouton à son panneau (id généré si besoin) ;
     - inert sur le panneau fermé : le retire du parcours clavier ET de
       l'arbre d'accessibilité tant qu'il est masqué (WCAG 2.4.3 / 4.1.2 /
       RGAA 12.8). Sans cela, les contrôles cachés (boutons imbriqués,
       cases .orga-boite) restaient focalisables alors qu'invisibles.
     ---------------------------------------------------------- */
  let compteurPanneau = 0;
  function preparerBouton(bouton, contenu, ouvert) {
    if (bouton.tagName === "BUTTON" && !bouton.hasAttribute("type")) {
      bouton.setAttribute("type", "button");
    }
    if (contenu) {
      if (!contenu.id) contenu.id = "panneau-depliable-" + compteurPanneau++;
      if (!bouton.hasAttribute("aria-controls")) {
        bouton.setAttribute("aria-controls", contenu.id);
      }
      contenu.inert = !ouvert; // masqué => inerte pour le clavier et l'AT
    }
    bouton.setAttribute("aria-expanded", ouvert ? "true" : "false");
  }

  /* ----------------------------------------------------------
     2. PANNEAUX DÉPLIABLES (Accordéon + Timeline)

     Les Cases Principales (unites.html) et la Timeline des phases
     (tour.html, tir.html, assaut.html, mouvement.html) sont deux
     habillages différents du même comportement : un bouton-titre qui
     révèle un bloc de contenu en dessous de lui. On factorise donc la
     logique une seule fois ci-dessous, et on l'applique aux deux
     composants avec des sélecteurs différents plutôt que de dupliquer
     le code.

     Technique d'ouverture : le CSS ne peut pas animer une transition
     vers "height: auto", donc on anime "max-height" à la place (voir
     css/style.css). contenu.scrollHeight donne la hauteur réelle à viser.
     ---------------------------------------------------------- */
  // Les deux familles de panneaux dépliables (Accordéon et Timeline)
  // peuvent s'imbriquer l'une dans l'autre (ex : l'Accordéon des Cases
  // Principales, dans unites.html, est niché dans un timeline-item) : le
  // recalcul de hauteur des ancêtres doit donc reconnaître les deux.
  const SELECTEUR_ITEM_DEPLIABLE = ".accordeon-item, .timeline-item";

  function activerPanneauxDepliables(
    selecteurBouton,
    selecteurItem,
    selecteurContenu,
  ) {
    document.querySelectorAll(selecteurBouton).forEach((bouton) => {
      const item = bouton.closest(selecteurItem);
      const contenu = item.querySelector(`:scope > ${selecteurContenu}`);

      // État initial (fermé par défaut : pas de classe .ouvert dans le HTML)
      preparerBouton(bouton, contenu, item.classList.contains("ouvert"));

      bouton.addEventListener("click", () => {
        const dejaOuvert = item.classList.contains("ouvert");

        if (dejaOuvert) {
          item.classList.remove("ouvert");
          contenu.style.maxHeight = null; // referme (max-height: 0 via CSS)
          contenu.inert = true; // hors clavier + hors arbre a11y
        } else {
          contenu.inert = false; // rendre focalisable AVANT de mesurer
          item.classList.add("ouvert");
          contenu.style.maxHeight = contenu.scrollHeight + "px";
        }
        bouton.setAttribute("aria-expanded", String(!dejaOuvert));

        // Panneau imbriqué (ex : sous-timeline dans un timeline-item, ou
        // l'Accordéon des Cases Principales dans un timeline-item) : son
        // propre contenu change de hauteur, mais un ancêtre déjà ouvert
        // garde la hauteur figée au moment de SON ouverture. On attend
        // "transitionend" avant de remonter recalculer le max-height de
        // chaque ancêtre ouvert, sinon le nouveau contenu se retrouve
        // coupé. On remonte à travers les DEUX familles de panneaux.
        contenu.addEventListener(
          "transitionend",
          () => {
            let ancetre = item.parentElement?.closest(SELECTEUR_ITEM_DEPLIABLE);
            while (ancetre && ancetre.classList.contains("ouvert")) {
              const contenuAncetre = ancetre.querySelector(
                ":scope > .accordeon-contenu, :scope > .timeline-details",
              );
              contenuAncetre.style.maxHeight =
                contenuAncetre.scrollHeight + "px";
              ancetre = ancetre.parentElement?.closest(
                SELECTEUR_ITEM_DEPLIABLE,
              );
            }
          },
          { once: true },
        );
      });
    });
  }

  // Cases Principales (unites.html)
  activerPanneauxDepliables(
    ".accordeon-titre",
    ".accordeon-item",
    ".accordeon-contenu",
  );

  // Timeline des phases (tour.html, tir.html, assaut.html, mouvement.html)
  activerPanneauxDepliables(
    ".timeline-titre",
    ".timeline-item",
    ".timeline-details",
  );

  /* ----------------------------------------------------------
     3. SECTIONS REPLIABLES (pages statuts-reactions, tables)

     Ici les sections sont FERMÉES par défaut (pas de classe .ouvert
     dans le HTML ; .section-corps est à max-height: 0 via le CSS tant
     que cette classe est absente). On ne calcule une hauteur en pixels
     qu'au moment du clic : ça évite de figer au chargement une hauteur
     qui serait fausse pour les pages dont certains tableaux sont encore
     vides à cet instant (remplis ensuite par tables.js). Une fois
     l'ouverture terminée, on repasse en max-height: none pour que la
     section reste libre de grandir (ex : redimensionnement de fenêtre).
     ---------------------------------------------------------- */
  document.querySelectorAll(".section-toggle").forEach((bouton) => {
    const section = bouton.closest("section");
    const corps = section.querySelector(":scope > .section-corps");

    // État initial (fermé). Respecte l'aria-controls déjà présent dans le HTML.
    preparerBouton(bouton, corps, section.classList.contains("ouvert"));

    bouton.addEventListener("click", () => {
      const ouverte = section.classList.contains("ouvert");

      if (ouverte) {
        corps.style.maxHeight = corps.scrollHeight + "px";
        // Force le navigateur à prendre en compte la valeur ci-dessus
        // avant de la faire retomber à 0, sinon les deux changements
        // sont fusionnés et il n'y a pas d'animation.
        corps.offsetHeight;
        section.classList.remove("ouvert");
        corps.style.maxHeight = "0px";
        corps.inert = true;
      } else {
        corps.inert = false;
        section.classList.add("ouvert");
        corps.style.maxHeight = corps.scrollHeight + "px";
        corps.addEventListener(
          "transitionend",
          () => {
            if (section.classList.contains("ouvert")) {
              corps.style.maxHeight = "none";
            }
          },
          { once: true },
        );
      }
      bouton.setAttribute("aria-expanded", String(!ouverte));
    });
  });

  /* ----------------------------------------------------------
     4. TITRE D'ONGLET EN ABSENCE
     Quand l'utilisateur quitte l'onglet (change d'onglet, minimise),
     document.title devient un message d'ambiance ; il reprend son
     titre d'origine dès le retour sur l'onglet.
     ---------------------------------------------------------- */
  const titreOriginal = document.title;
  document.addEventListener("visibilitychange", () => {
    document.title = document.hidden
      ? "Reviens, faible mortel..."
      : titreOriginal;
  });

  /* ----------------------------------------------------------
     5. TABLEAU DE BLESSURE FLOTTANT
     Voir activerTableauFlottant() plus haut dans ce fichier pour le
     détail (pages concernées, déplacement, ouverture/fermeture).
     ---------------------------------------------------------- */
  activerTableauFlottant();
});
