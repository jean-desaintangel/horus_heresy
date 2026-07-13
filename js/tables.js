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
   SURBRILLANCE LIGNE + COLONNE AU SURVOL
   La ligne est gérée en CSS (tr:hover). Pour la colonne,
   on ajoute une classe à toutes les cellules du même index.

   Un seul écouteur par <table> (plutôt qu'un par <td>) suffit :
   c'est de la "délégation d'événements". evenement.target est la
   cellule réellement survolée ; .closest("td") la retrouve même
   si le survol démarre sur un enfant de la cellule.
   ---------------------------------------------------------- */
function activerSurbrillanceColonnes() {
  document.querySelectorAll("table").forEach((table) => {
    table.addEventListener("mouseover", (evenement) => {
      const cellule = evenement.target.closest("td");
      if (!cellule) return;

      const index = cellule.cellIndex; // position de la colonne

      // Surligne toutes les cellules de cette colonne (corps + en-tête)
      table.querySelectorAll("tr").forEach((tr) => {
        const c = tr.cells[index];
        if (c) c.classList.add("colonne-active");
      });

      // La cellule exacte (croisement ligne/colonne) est mise en évidence
      cellule.classList.add("case-active");
    });

    table.addEventListener("mouseout", () => {
      // On nettoie tout en quittant la cellule
      table.querySelectorAll(".colonne-active, .case-active").forEach((c) => {
        c.classList.remove("colonne-active", "case-active");
      });
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
