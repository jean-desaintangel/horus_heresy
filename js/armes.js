/* ============================================================
   armes.js — Arsenal des Legiones Astartes (page armes.html)
   Auteur : Jean · Créé : 2026-07-15
   Rôle   : rend dynamiquement les tables d'armes (une table HTML
   par catégorie) à partir des données de js/armes-data.js, et les
   filtre en temps réel via la barre de recherche (nom de l'arme
   uniquement). Chaque règle spéciale de la colonne « Règles
   spéciales » est doublée d'une info-bulle reprenant sa définition
   (voir page regles.html).
   Dépend : js/armes-data.js (données ENTETES_TIR/ARMES_TIR/
   ENTETES_MELEE/ARMES_MELEE, chargé avant ce script) et
   js/regles-data.js (texte des règles) — stylé par css/style.css.
   Sécurité : textContent partout, jamais innerHTML (anti-XSS).
   ============================================================ */

/* ----------------------------------------------------------
   SÉLECTION DES ARMES JOUÉES
   Mémorisée dans le navigateur (localStorage) pour que le joueur
   retrouve sa sélection d'une visite à l'autre.
   ---------------------------------------------------------- */
const CLE_SELECTION_ARMES = "hh-armes-selection";

/** Ensemble des clés d'armes cochées (idConteneur::titreCategorie::nom). */
let selectionArmes = new Set();

function chargerSelectionArmes() {
  try {
    const brut = localStorage.getItem(CLE_SELECTION_ARMES);
    return brut ? new Set(JSON.parse(brut)) : new Set();
  } catch (erreur) {
    return new Set();
  }
}

function sauvegarderSelectionArmes() {
  try {
    localStorage.setItem(
      CLE_SELECTION_ARMES,
      JSON.stringify([...selectionArmes]),
    );
  } catch (erreur) {
    /* stockage indisponible (navigation privée, quota…) : on ignore */
  }
}

/* ----------------------------------------------------------
   RENDU DES TABLES D'ARMES
   ---------------------------------------------------------- */

/**
 * Retire les accents pour une recherche plus tolérante ("brèche" = "breche").
 * Voir la même fonction dans js/regles.js pour le détail de la technique.
 */
function normaliserArme(texte) {
  return texte
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

/* ----------------------------------------------------------
   DÉFINITIONS DES RÈGLES SPÉCIALES (pour les info-bulles)
   Les intitulés des tables d'armes portent une valeur concrète
   (ex : "Brèche (5+)") alors que REGLES_ARMES/REGLES_DIVERSES (voir
   js/regles-data.js) les nomment avec un "(X)" générique : on indexe
   donc par nom de base, sans parenthèse.
   ---------------------------------------------------------- */
const DEFINITIONS_REGLES = new Map();
[...REGLES_ARMES, ...REGLES_DIVERSES].forEach((regle) => {
  const base = normaliserArme(regle.nom.replace(/\s*\([^)]*\)\s*$/, ""));
  DEFINITIONS_REGLES.set(base, regle.texte);
});

/**
 * Retrouve la définition d'une règle à partir de son intitulé tel
 * qu'utilisé dans une table d'armes (ex : "Brèche (5+)"). En repli, on
 * retire un "e" final du nom de base pour absorber les rares accords
 * grammaticaux (ex : "Empoisonnée" dans les tables d'armes vs
 * "Empoisonné" dans le lexique des règles).
 * @param {string} intitule
 * @returns {string|null}
 */
function trouverDefinitionRegle(intitule) {
  const base = normaliserArme(intitule.replace(/\s*\([^)]*\)\s*$/, ""));
  if (DEFINITIONS_REGLES.has(base)) return DEFINITIONS_REGLES.get(base);
  if (base.endsWith("e") && DEFINITIONS_REGLES.has(base.slice(0, -1))) {
    return DEFINITIONS_REGLES.get(base.slice(0, -1));
  }
  return null;
}

/**
 * Construit la table HTML d'une catégorie d'armes et l'insère dans le
 * conteneur cible, précédée de son titre (h3).
 * @param {string} idConteneur - id de la div où insérer la catégorie
 * @param {Array}  entetes     - libellés des colonnes de stats (ex: ["P","PF","FT","PA","D"])
 * @param {Object} categorie   - { titre, armes, note }
 */
function construireCategorieArmes(idConteneur, entetes, categorie) {
  const conteneur = document.getElementById(idConteneur);
  if (!conteneur) return;

  const section = document.createElement("div");
  section.className = "groupe-armes";

  const h3 = document.createElement("h3");
  h3.textContent = categorie.titre;
  section.appendChild(h3);

  const table = document.createElement("table");
  const caption = document.createElement("caption");
  caption.className = "sr-only";
  caption.textContent = categorie.titre;
  table.appendChild(caption);

  // --- En-tête ---
  const thead = document.createElement("thead");
  const trEntete = document.createElement("tr");

  const thSelection = document.createElement("th");
  thSelection.scope = "col";
  thSelection.className = "col-selection";
  const libelleSelection = document.createElement("span");
  libelleSelection.className = "sr-only";
  libelleSelection.textContent = "Jouée";
  thSelection.appendChild(libelleSelection);
  trEntete.appendChild(thSelection);

  const thNom = document.createElement("th");
  thNom.scope = "col";
  thNom.className = "gauche";
  thNom.textContent = "Arme";
  trEntete.appendChild(thNom);

  entetes.forEach((libelle) => {
    const th = document.createElement("th");
    th.scope = "col";
    th.textContent = libelle;
    trEntete.appendChild(th);
  });

  const thRegles = document.createElement("th");
  thRegles.scope = "col";
  thRegles.className = "gauche";
  thRegles.textContent = "Règles spéciales";
  trEntete.appendChild(thRegles);

  const thTraits = document.createElement("th");
  thTraits.scope = "col";
  thTraits.className = "gauche";
  thTraits.textContent = "Traits";
  trEntete.appendChild(thTraits);

  thead.appendChild(trEntete);
  table.appendChild(thead);

  // --- Corps : une ligne par arme ---
  const tbody = document.createElement("tbody");
  categorie.armes.forEach((arme) => {
    const tr = document.createElement("tr");
    tr.dataset.recherche = normaliserArme(arme.nom);

    const tdSelection = document.createElement("td");
    tdSelection.className = "col-selection";
    const caseSelection = document.createElement("input");
    caseSelection.type = "checkbox";
    caseSelection.className = "case-selection";
    const cleSelection = idConteneur + "::" + categorie.titre + "::" + arme.nom;
    caseSelection.checked = selectionArmes.has(cleSelection);
    caseSelection.setAttribute("aria-label", "Jouée : " + arme.nom);
    caseSelection.addEventListener("change", () => {
      if (caseSelection.checked) selectionArmes.add(cleSelection);
      else selectionArmes.delete(cleSelection);
      sauvegarderSelectionArmes();
      appliquerFiltresArmes();
    });
    tdSelection.appendChild(caseSelection);
    tr.appendChild(tdSelection);

    const thNomArme = document.createElement("th");
    thNomArme.scope = "row";
    thNomArme.className = "gauche";
    thNomArme.textContent = arme.nom;
    tr.appendChild(thNomArme);

    arme.stats.forEach((valeur) => {
      const td = document.createElement("td");
      td.textContent = valeur;
      tr.appendChild(td);
    });

    const tdRegles = document.createElement("td");
    tdRegles.className = "gauche";
    if (arme.regles && arme.regles !== "-") {
      arme.regles.split(",").forEach((token, i) => {
        const intitule = token.trim();
        if (i > 0) tdRegles.appendChild(document.createTextNode(", "));

        const definition = trouverDefinitionRegle(intitule);
        if (!definition) {
          tdRegles.appendChild(document.createTextNode(intitule));
          return;
        }

        const tag = document.createElement("span");
        tag.className = "regle-tag";
        tag.tabIndex = 0;
        tag.textContent = intitule;

        const bulle = document.createElement("span");
        bulle.className = "tooltip";
        bulle.textContent = definition;
        tag.appendChild(bulle);

        tdRegles.appendChild(tag);
      });
    } else {
      tdRegles.textContent = "-";
    }
    tr.appendChild(tdRegles);

    const tdTraits = document.createElement("td");
    tdTraits.className = "gauche";
    tdTraits.textContent = arme.traits || "-";
    tr.appendChild(tdTraits);

    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  const scroll = document.createElement("div");
  scroll.className = "table-scroll";
  scroll.appendChild(table);
  section.appendChild(scroll);

  if (categorie.note) {
    const note = document.createElement("p");
    note.className = "arme-note";
    note.textContent = categorie.note;
    section.appendChild(note);
  }

  conteneur.appendChild(section);
}

/** Construit toutes les catégories d'un groupe (Tir ou Mêlée). */
function afficherArmes(idConteneur, entetes, categories) {
  categories.forEach((categorie) =>
    construireCategorieArmes(idConteneur, entetes, categorie),
  );
}

/* ----------------------------------------------------------
   FILTRES (recherche + sélection) EN TEMPS RÉEL
   Filtre chaque ligne d'arme selon la recherche textuelle et,
   si activée, la case « N'afficher que les armes sélectionnées »,
   puis masque une catégorie entière (titre + intro + table) si
   plus aucune de ses armes ne correspond, puis masque une grande
   section (Tir/Mêlée) si plus aucune de ses catégories n'est
   visible.
   ---------------------------------------------------------- */
function appliquerFiltresArmes() {
  const champ = document.getElementById("recherche");
  const compteur = document.getElementById("compteur");
  const filtreSelection = document.getElementById("filtre-selection");
  const requete = champ ? normaliserArme(champ.value.trim()) : "";
  const seulementSelection = filtreSelection ? filtreSelection.checked : false;
  let visibles = 0;

  document.querySelectorAll(".groupe-armes tbody tr").forEach((ligne) => {
    const correspondRecherche = ligne.dataset.recherche.includes(requete);
    const estSelectionnee = ligne.querySelector(".case-selection").checked;
    const correspond =
      correspondRecherche && (!seulementSelection || estSelectionnee);
    ligne.classList.toggle("cachee", !correspond);
    if (correspond) visibles++;
  });

  document.querySelectorAll(".groupe-armes").forEach((groupe) => {
    const resteVisible =
      groupe.querySelector("tbody tr:not(.cachee)") !== null;
    groupe.style.display = resteVisible ? "" : "none";
  });

  // Une grande section (Armes de Tir / Armes de Mêlée) disparaît si
  // aucune de ses catégories (.groupe-armes) n'est restée visible.
  document.querySelectorAll(".groupe-regles").forEach((section) => {
    const auMoinsUnGroupeVisible = Array.from(
      section.querySelectorAll(".groupe-armes"),
    ).some((groupe) => groupe.style.display !== "none");
    section.style.display = auMoinsUnGroupeVisible ? "" : "none";
  });

  if (compteur) {
    const total = document.querySelectorAll(".groupe-armes tbody tr").length;
    compteur.textContent =
      requete || seulementSelection
        ? visibles + " arme(s) trouvée(s) sur " + total
        : "";
  }
}

function activerRechercheArmes() {
  const champ = document.getElementById("recherche");
  if (!champ) return;
  champ.addEventListener("input", appliquerFiltresArmes);
}

/** Câble la case « N'afficher que les armes sélectionnées » et le
 * bouton « Tout décocher ». */
function activerControlesSelectionArmes() {
  const filtreSelection = document.getElementById("filtre-selection");
  if (filtreSelection) {
    filtreSelection.addEventListener("change", appliquerFiltresArmes);
  }

  const reinitialiser = document.getElementById("reinitialiser-selection");
  if (reinitialiser) {
    reinitialiser.addEventListener("click", () => {
      selectionArmes.clear();
      sauvegarderSelectionArmes();
      document
        .querySelectorAll(".case-selection")
        .forEach((caseACocher) => (caseACocher.checked = false));
      appliquerFiltresArmes();
    });
  }
}

/* ----------------------------------------------------------
   INITIALISATION
   ---------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  selectionArmes = chargerSelectionArmes();

  afficherArmes("armes-tir", ENTETES_TIR, ARMES_TIR);
  afficherArmes("armes-melee", ENTETES_MELEE, ARMES_MELEE);
  activerRechercheArmes();
  activerControlesSelectionArmes();
  appliquerFiltresArmes();

  // Les .regle-tag viennent d'être créées ci-dessus : on relance le
  // câblage d'accessibilité des info-bulles (voir js/main.js), dont le
  // propre passage au DOMContentLoaded a déjà eu lieu à ce stade.
  if (window.cablerInfoBulles) window.cablerInfoBulles();
});
