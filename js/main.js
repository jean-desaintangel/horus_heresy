/* ============================================================
   main.js — Scripts communs à toutes les pages
   Auteur : Jean · Modifié : 2026-07-17
   Rôle   : menu mobile, accordéons, timeline, sections repliables,
   et utilitaires partagés par les autres scripts (normalisation de
   texte, fabrique DOM, définitions des règles spéciales).
   Dépend : aucun (vanilla JS) — stylé par css/style.css.
   Chargé en defer AVANT les autres scripts : ses fonctions globales
   sont donc disponibles pour js/regles.js, js/armes.js,
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
   Tape "Erebus" (accents/majuscules ignorés) dans une barre de
   recherche du site (armes.html #recherche, regles.html #recherche,
   unites.html #choix-unite) : son portrait apparaît sous le champ.
   Purement décoratif — un simple écouteur "input" de plus sur ces
   mêmes champs, sans toucher à leur propre logique de filtre
   (armes.js/regles.js/unites.js).
   ---------------------------------------------------------- */
function activerClinDoeilErebus() {
  document.querySelectorAll("#recherche, #choix-unite").forEach((champ) => {
    const image = document.createElement("img");
    image.src = RACINE_SITE + "assets/img/erebus.jpg";
    image.alt = "Erebus";
    image.className = "erebus-easter-egg";

    const cible = champ.closest(".unite-combobox") || champ;
    cible.insertAdjacentElement("afterend", image);

    champ.addEventListener("input", () => {
      const correspond = normaliserTexte(champ.value.trim()) === "erebus";
      image.classList.toggle("visible", correspond);
    });
  });
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
    VI: "scpace_wolves",
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
    XVIII: "salamenders",
    XIX: "raven_guards",
    XX: "alpha_legion",
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
  }
})();

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
});
