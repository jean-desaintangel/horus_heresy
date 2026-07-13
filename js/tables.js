/* ============================================================
   tables.js — Tables de référence (page tables.html)
   Les données sont encodées en tableaux 2D, puis rendues
   dynamiquement en HTML. Vanilla JS, aucune dépendance.
   ============================================================ */

/* ----------------------------------------------------------
   DONNÉES
   ---------------------------------------------------------- */

// Étiquettes communes aux deux grandes tables (valeurs 1 à 10+)
const VALEURS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"];

/* Table CC : jet de touche au corps-à-corps.
   Ligne = CC de l'attaquant, colonne = CC du défenseur. */
const TABLE_CC = [
  // Déf:  1     2     3     4     5     6     7     8     9     10+
  ["4+", "5+", "6+", "6+", "6+", "6+", "6+", "6+", "6+", "6+"], // Att 1
  ["3+", "4+", "5+", "6+", "6+", "6+", "6+", "6+", "6+", "6+"], // Att 2
  ["3+", "3+", "4+", "5+", "6+", "6+", "6+", "6+", "6+", "6+"], // Att 3
  ["2+", "3+", "3+", "4+", "5+", "6+", "6+", "6+", "6+", "6+"], // Att 4
  ["2+", "2+", "3+", "3+", "4+", "5+", "6+", "6+", "6+", "6+"], // Att 5
  ["2+", "2+", "2+", "3+", "3+", "4+", "5+", "6+", "6+", "6+"], // Att 6
  ["2+", "2+", "2+", "2+", "3+", "3+", "4+", "5+", "6+", "6+"], // Att 7
  ["2+", "2+", "2+", "2+", "2+", "3+", "3+", "4+", "5+", "6+"], // Att 8
  ["2+", "2+", "2+", "2+", "2+", "2+", "3+", "3+", "4+", "5+"], // Att 9
  ["2+", "2+", "2+", "2+", "2+", "2+", "2+", "3+", "3+", "4+"], // Att 10+
];

/* Table de blessure : Force de la touche vs Endurance de la cible.
   '-' = blessure impossible. */
const TABLE_BLESSURE = [
  // End:  1     2     3     4     5     6     7     8     9     10+
  ["4+", "5+", "6+", "6+", "-", "-", "-", "-", "-", "-"], // F 1
  ["3+", "4+", "5+", "6+", "6+", "-", "-", "-", "-", "-"], // F 2
  ["2+", "3+", "4+", "5+", "6+", "6+", "-", "-", "-", "-"], // F 3
  ["2+", "2+", "3+", "4+", "5+", "6+", "6+", "-", "-", "-"], // F 4
  ["2+", "2+", "2+", "3+", "4+", "5+", "6+", "6+", "-", "-"], // F 5
  ["2+", "2+", "2+", "2+", "3+", "4+", "5+", "6+", "6+", "-"], // F 6
  ["2+", "2+", "2+", "2+", "2+", "3+", "4+", "5+", "6+", "6+"], // F 7
  ["2+", "2+", "2+", "2+", "2+", "2+", "3+", "4+", "5+", "6+"], // F 8
  ["2+", "2+", "2+", "2+", "2+", "2+", "2+", "3+", "4+", "5+"], // F 9
  ["2+", "2+", "2+", "2+", "2+", "2+", "2+", "2+", "3+", "4+"], // F 10+
];

/* Table CT : jet de touche au tir.
   1re ligne = jet normal, 2e ligne = tir au jugé.
   Colonnes : CT de 10+ (gauche) à 1 (droite), comme sur la feuille d'aide. */
const COLONNES_CT = ["10+", "9", "8", "7", "6", "5", "4", "3", "2", "1"];

const TABLE_CT = [
  // Libellé de ligne, puis les valeurs
  [
    "Jet normal",
    "Auto",
    "Cr 3+",
    "Cr 4+",
    "Cr 5+",
    "Cr 6+",
    "2+",
    "3+",
    "4+",
    "5+",
    "6+",
  ],
  ["Au jugé", "2+", "3+", "3+", "4+", "4+", "5+", "5+", "6+", "6+", "Éch."],
];

/* Table de positionnement (mise au contact) :
   Initiative + Mouvement -> distance de positionnement. */
const TABLE_POSITIONNEMENT = [
  ["1 à 6", '1"'],
  ["7 à 9", '2"'],
  ["10 à 11", '3"'],
  ["12 à 13", '4"'],
  ["14 à 19", '5"'],
  ["20+", '6"'],
];

/* ----------------------------------------------------------
   RENDU DES TABLES
   ---------------------------------------------------------- */

/**
 * Construit une table "matrice" (CC ou Blessure).
 * @param {string} idConteneur - id de la div où insérer la table
 * @param {string} titre       - texte du caption
 * @param {string} labelLigne  - libellé des lignes (ex: "CC attaquant")
 * @param {string} labelCol    - libellé des colonnes (ex: "CC défenseur")
 * @param {Array}  donnees     - tableau 2D des valeurs
 */
function construireMatrice(idConteneur, titre, labelLigne, labelCol, donnees) {
  const conteneur = document.getElementById(idConteneur);
  if (!conteneur) return;

  const table = document.createElement("table");
  table.className = "table-matrice";

  // Caption (titre au-dessus de la table)
  const caption = document.createElement("caption");
  caption.textContent = titre;
  table.appendChild(caption);

  // --- En-tête : coin + valeurs de colonnes ---
  const thead = document.createElement("thead");
  const ligneEntete = document.createElement("tr");

  const coin = document.createElement("th");
  coin.innerHTML = labelLigne + " \\ " + labelCol; // ex: "Attaquant \ Défenseur"
  ligneEntete.appendChild(coin);

  VALEURS.forEach((v) => {
    const th = document.createElement("th");
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

  const scroll = document.createElement("div");
  scroll.className = "table-scroll";
  scroll.appendChild(table);
  conteneur.appendChild(scroll);
}

/** Construit la table CT (2 lignes : normal / au jugé). */
function construireTableCT(idConteneur) {
  const conteneur = document.getElementById(idConteneur);
  if (!conteneur) return;

  const table = document.createElement("table");
  table.className = "table-matrice";

  const caption = document.createElement("caption");
  caption.textContent = "Jet de touche au tir (selon la CT du tireur)";
  table.appendChild(caption);

  // En-tête : CT de 10+ à 1
  const thead = document.createElement("thead");
  const ligneEntete = document.createElement("tr");
  const coin = document.createElement("th");
  coin.textContent = "CT";
  ligneEntete.appendChild(coin);
  COLONNES_CT.forEach((v) => {
    const th = document.createElement("th");
    th.textContent = v;
    ligneEntete.appendChild(th);
  });
  thead.appendChild(ligneEntete);
  table.appendChild(thead);

  // Corps : "Jet normal" puis "Au jugé"
  const tbody = document.createElement("tbody");
  TABLE_CT.forEach((ligne) => {
    const tr = document.createElement("tr");
    ligne.forEach((valeur, j) => {
      // La 1re cellule de chaque ligne est un libellé -> th
      const cellule = document.createElement(j === 0 ? "th" : "td");
      cellule.textContent = valeur;
      if (valeur === "Éch.") cellule.classList.add("impossible");
      tr.appendChild(cellule);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  const scroll = document.createElement("div");
  scroll.className = "table-scroll";
  scroll.appendChild(table);
  conteneur.appendChild(scroll);
}

/** Construit la petite table de positionnement. */
function construireTablePositionnement(idConteneur) {
  const conteneur = document.getElementById(idConteneur);
  if (!conteneur) return;

  const table = document.createElement("table");

  const caption = document.createElement("caption");
  caption.textContent = "Mouvement de positionnement (mise au contact)";
  table.appendChild(caption);

  const thead = document.createElement("thead");
  thead.innerHTML =
    "<tr><th>Initiative + Mouvement</th><th>Positionnement</th></tr>";
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  TABLE_POSITIONNEMENT.forEach(([plage, distance]) => {
    const tr = document.createElement("tr");
    tr.innerHTML = "<td>" + plage + "</td><td>" + distance + "</td>";
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  const scroll = document.createElement("div");
  scroll.className = "table-scroll";
  scroll.appendChild(table);
  conteneur.appendChild(scroll);
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

function activerSurbrillanceColonnes() {
  // table -> cellule épinglée par un clic/tap (absente si aucune).
  // Stockée en dehors de la boucle pour que le nettoyage "tap en
  // dehors du tableau" ci-dessous puisse aussi oublier l'épingle,
  // et pas seulement retirer les classes CSS.
  const casesEpinglees = new Map();

  document.querySelectorAll("table").forEach((table) => {
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

  // Un tap en dehors de toute table désépingle la surbrillance
  document.addEventListener("click", (evenement) => {
    if (evenement.target.closest("table")) return;
    casesEpinglees.clear();
    document.querySelectorAll(".colonne-active, .case-active").forEach((c) => {
      c.classList.remove("colonne-active", "case-active");
    });
  });
}

/* ----------------------------------------------------------
   INITIALISATION
   ---------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  construireMatrice(
    "table-cc",
    "Jet de touche au corps-à-corps (CC contre CC)",
    "Attaquant",
    "Défenseur",
    TABLE_CC,
  );

  construireMatrice(
    "table-blessure",
    "Jet de blessure (Force de la touche contre Endurance de la cible)",
    "Force",
    "Endurance",
    TABLE_BLESSURE,
  );

  construireTableCT("table-ct");
  construireTablePositionnement("table-positionnement");

  activerSurbrillanceColonnes();
});
