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
     2. ACCORDÉONS (Cases Principales, etc.)
     Chaque .accordeon-titre ouvre/ferme le .accordeon-contenu
     qui le suit. On anime avec max-height.
     ---------------------------------------------------------- */
  document.querySelectorAll(".accordeon-titre").forEach((bouton) => {
    bouton.addEventListener("click", () => {
      const item = bouton.closest(".accordeon-item");
      const contenu = item.querySelector(".accordeon-contenu");
      const dejaOuvert = item.classList.contains("ouvert");

      if (dejaOuvert) {
        item.classList.remove("ouvert");
        contenu.style.maxHeight = null; // referme (max-height: 0 via CSS)
      } else {
        item.classList.add("ouvert");
        // scrollHeight = hauteur réelle du contenu -> animation fluide
        contenu.style.maxHeight = contenu.scrollHeight + "px";
      }
      bouton.setAttribute("aria-expanded", !dejaOuvert);
    });
  });

  /* ----------------------------------------------------------
     3. TIMELINE INTERACTIVE (page tour.html)
     Même principe que l'accordéon : clic sur le titre d'une
     phase -> affichage des détails.
     ---------------------------------------------------------- */
  document.querySelectorAll(".timeline-titre").forEach((bouton) => {
    bouton.addEventListener("click", () => {
      const item = bouton.closest(".timeline-item");
      const details = item.querySelector(".timeline-details");
      const dejaOuvert = item.classList.contains("ouvert");

      if (dejaOuvert) {
        item.classList.remove("ouvert");
        details.style.maxHeight = null;
      } else {
        item.classList.add("ouvert");
        details.style.maxHeight = details.scrollHeight + "px";
      }
      bouton.setAttribute("aria-expanded", !dejaOuvert);
    });
  });
});
