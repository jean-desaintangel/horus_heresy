/* ============================================================
   tables.js — Tables de référence (pages tir.html et assaut.html)
   Auteur : Jean · Modifié : 2026-07-25
   Rôle   : encode les tables 2D propres à ces deux pages (CC, CT,
   positionnement) et les rend en HTML accessible (caption, scope)
   avec surbrillance ligne/colonne au survol/tap.
   Dépend : js/main.js (VALEURS, TABLE_BLESSURE, creerTable,
   insererDansScroll, construireMatrice, activerSurbrillanceColonnes —
   la table de blessure et son rendu matriciel sont partagés avec le
   tableau flottant de toutes les autres pages, une seule source pour
   cette donnée de jeu), chargé avant en defer.
   Sécurité : tout le texte est injecté via textContent (jamais
   innerHTML), réflexe anti-XSS à conserver si les données viennent un
   jour d'une source externe (API, JSON, URL).
   ============================================================ */

/* ----------------------------------------------------------
   DONNÉES
   ---------------------------------------------------------- */

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
   creerTable/insererDansScroll/construireMatrice viennent de
   js/main.js (chargé avant en defer) : voir sa section « TABLES DE
   RÉFÉRENCE PARTAGÉES ».
   ---------------------------------------------------------- */

/** Construit la table CT (2 lignes : normal / au jugé). */
function construireTableCT(idConteneur) {
  const table = creerTable(
    "Jet de touche au tir (selon la CT du tireur)",
    "table-matrice",
  );

  // En-tête : CT de 10+ à 1
  const thead = document.createElement("thead");
  const ligneEntete = document.createElement("tr");
  const coin = document.createElement("th");
  coin.textContent = "CT";
  ligneEntete.appendChild(coin);
  COLONNES_CT.forEach((v) => {
    const th = document.createElement("th");
    th.scope = "col"; // Accessibilité (WCAG 1.3.1 / RGAA 5.7)
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
      if (j === 0) cellule.scope = "row"; // Accessibilité (WCAG 1.3.1 / RGAA 5.7)
      cellule.textContent = valeur;
      if (valeur === "Éch.") cellule.classList.add("impossible");
      tr.appendChild(cellule);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  insererDansScroll(idConteneur, table);
}

/** Construit la petite table de positionnement. */
function construireTablePositionnement(idConteneur) {
  const table = creerTable("Mouvement de positionnement (mise au contact)");

  // En-tête : deux colonnes fixes
  const thead = document.createElement("thead");
  const ligneEntete = document.createElement("tr");
  ["Initiative + Mouvement", "Positionnement"].forEach((libelle) => {
    const th = document.createElement("th");
    th.scope = "col"; // Accessibilité (WCAG 1.3.1 / RGAA 5.7)
    th.textContent = libelle;
    ligneEntete.appendChild(th);
  });
  thead.appendChild(ligneEntete);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  TABLE_POSITIONNEMENT.forEach(([plage, distance]) => {
    const tr = document.createElement("tr");
    [plage, distance].forEach((valeur) => {
      const td = document.createElement("td");
      td.textContent = valeur;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  insererDansScroll(idConteneur, table);
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
