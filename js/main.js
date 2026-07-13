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
    });
  }

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
  function activerPanneauxDepliables(selecteurBouton, selecteurItem, selecteurContenu) {
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
  activerPanneauxDepliables(".accordeon-titre", ".accordeon-item", ".accordeon-contenu");

  // Timeline des phases (tour.html)
  activerPanneauxDepliables(".timeline-titre", ".timeline-item", ".timeline-details");
});
