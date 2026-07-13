/* ============================================================
   main.js — Scripts communs à toutes les pages
   (menu mobile, accordéons, timeline)
   Vanilla JS, aucune dépendance.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  /* ----------------------------------------------------------
     1. MENU BURGER (mobile)
     Le bouton .nav-burger affiche/masque la liste .nav-menu
     ---------------------------------------------------------- */
  const burger = document.querySelector(".nav-burger");
  const menu = document.querySelector(".nav-menu");

  if (burger && menu) {
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
     ACCESSIBILITÉ — fermeture des info-bulles au clavier (WCAG 1.4.13)
     Une info-bulle .orga-boite s'affiche au survol/focus ; la touche
     Échap doit permettre de la masquer sans quitter la page. On retire
     le focus de la case active, ce qui referme le tooltip (piloté en CSS).
     ---------------------------------------------------------- */
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      document.activeElement &&
      document.activeElement.classList.contains("orga-boite")
    ) {
      document.activeElement.blur();
    }
  });

  /* ----------------------------------------------------------
     2. PANNEAUX DÉPLIABLES (Accordéon + Timeline)

     Les Cases Principales (armee.html) et la Timeline des phases
     (tour.html) sont deux habillages différents du même
     comportement : un bouton-titre qui révèle un bloc de contenu
     en dessous de lui. On factorise donc la logique une seule
     fois ci-dessous, et on l'applique aux deux composants avec
     des sélecteurs différents plutôt que de dupliquer le code.

     Technique d'ouverture : le CSS ne peut pas animer une
     transition vers "height: auto", donc on anime "max-height"
     à la place (voir css/style.css). Il faut alors une valeur en
     pixels à viser : contenu.scrollHeight donne la hauteur réelle
     du contenu, qu'on écrit directement dans le style de l'élément.
     ---------------------------------------------------------- */
  function activerPanneauxDepliables(
    selecteurBouton,
    selecteurItem,
    selecteurContenu,
  ) {
    document.querySelectorAll(selecteurBouton).forEach((bouton) => {
      bouton.addEventListener("click", () => {
        const item = bouton.closest(selecteurItem);
        const contenu = item.querySelector(selecteurContenu);
        const dejaOuvert = item.classList.contains("ouvert");

        if (dejaOuvert) {
          item.classList.remove("ouvert");
          contenu.style.maxHeight = null; // referme (max-height: 0 via CSS)
        } else {
          item.classList.add("ouvert");
          contenu.style.maxHeight = contenu.scrollHeight + "px";
        }
        bouton.setAttribute("aria-expanded", !dejaOuvert);
      });
    });
  }

  // Cases Principales (armee.html)
  activerPanneauxDepliables(
    ".accordeon-titre",
    ".accordeon-item",
    ".accordeon-contenu",
  );

  // Timeline des phases (tour.html)
  activerPanneauxDepliables(
    ".timeline-titre",
    ".timeline-item",
    ".timeline-details",
  );

  /* ----------------------------------------------------------
     3. SECTIONS REPLIABLES (pages de détail : assaut, mouvement,
     tir, statuts-reactions, tables)

     Ici les sections sont FERMÉES par défaut (pas de classe
     .ouvert dans le HTML ; .section-corps est à max-height: 0 via
     le CSS tant que cette classe est absente). On ne calcule une
     hauteur en pixels qu'au moment du clic : ça évite de figer au
     chargement une hauteur qui serait fausse pour tables.html,
     dont certains tableaux sont encore vides à cet instant
     (remplis ensuite par tables.js). Une fois l'ouverture
     terminée, on repasse en max-height: none pour que la section
     reste libre de grandir (ex : redimensionnement de fenêtre).
     ---------------------------------------------------------- */
  document.querySelectorAll(".section-toggle").forEach((bouton) => {
    bouton.addEventListener("click", () => {
      const section = bouton.closest("section");
      const corps = section.querySelector(":scope > .section-corps");
      const ouverte = section.classList.contains("ouvert");

      if (ouverte) {
        corps.style.maxHeight = corps.scrollHeight + "px";
        // Force le navigateur à prendre en compte la valeur ci-dessus
        // avant de la faire retomber à 0, sinon les deux changements
        // sont fusionnés et il n'y a pas d'animation.
        corps.offsetHeight;
        section.classList.remove("ouvert");
        corps.style.maxHeight = "0px";
      } else {
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
