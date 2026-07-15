/* ============================================================
   main.js — Scripts communs à toutes les pages
   Auteur : Jean · Modifié : 2026-07-15
   Rôle   : menu mobile, accordéons, timeline, sections repliables.
   Dépend : aucun (vanilla JS) — stylé par css/style.css.
   ============================================================ */

/* ----------------------------------------------------------
   ACCESSIBILITÉ — info-bulles (WCAG 1.3.1 / 4.1.2)
   Chaque case .orga-boite (organigramme, armee.html) et chaque
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
    .querySelectorAll(".orga-boite, .regle-tag")
    .forEach((declencheur) => {
      const bulle = declencheur.querySelector(".tooltip");
      if (!bulle) return;
      if (!bulle.id) bulle.id = "tooltip-" + compteurInfoBulle++;
      bulle.setAttribute("role", "tooltip");
      declencheur.setAttribute("aria-describedby", bulle.id);
    });
}
window.cablerInfoBulles = cablerInfoBulles;

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
      burger.setAttribute("aria-label", ouvert ? "Fermer le menu" : "Ouvrir le menu");
    });
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
        document.activeElement.classList.contains("regle-tag"))
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

     Les Cases Principales (armee.html) et la Timeline des phases
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
  // Principales, dans armee.html, est niché dans un timeline-item) : le
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

  // Cases Principales (armee.html)
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
});
