/* ============================================================
   regles.js — Règles spéciales (page regles.html)
   Auteur : Jean · Modifié : 2026-07-17
   Rôle   : rend dynamiquement les règles (REGLES_ARMES,
   REGLES_DIVERSES) et les filtre en temps réel via la barre de
   recherche.
   Dépend : js/main.js (normaliserTexte) et js/regles-data.js
   (données { nom, texte }), chargés avant ce script — stylé par
   css/style.css.
   Sécurité : textContent partout, jamais innerHTML (anti-XSS).
   ============================================================ */

/* ----------------------------------------------------------
   RENDU DES RÈGLES
   ---------------------------------------------------------- */

/**
 * Génère les cartes de règles dans le conteneur donné.
 * @param {string} idConteneur - id de la div cible
 * @param {Array}  regles      - liste d'objets règle
 */
function afficherRegles(idConteneur, regles) {
  const conteneur = document.getElementById(idConteneur);
  if (!conteneur) return;

  regles.forEach((regle) => {
    const article = document.createElement("article");
    article.className = "regle";
    // On stocke le nom DÉJÀ normalisé (sans accents, en minuscules) :
    // la normalisation coûte un parcours de chaîne par règle, et le
    // filtre s'exécute à CHAQUE frappe. La faire ici, une seule fois au
    // chargement, plutôt que dans la boucle du filtre, évite de la
    // rejouer sur les ~250 règles à chaque touche tapée.
    article.dataset.recherche = normaliserTexte(regle.nom);

    const titre = document.createElement("h3");
    titre.textContent = regle.nom;
    article.appendChild(titre);

    const texte = document.createElement("p");
    texte.textContent = regle.texte;
    article.appendChild(texte);

    conteneur.appendChild(article);
  });
}

/* ----------------------------------------------------------
   FILTRE EN TEMPS RÉEL
   À chaque frappe dans la barre de recherche, on masque les règles dont
   le NOM ne contient pas la saisie (et non leur texte de définition :
   chercher « unité » remonterait sinon la moitié du lexique).
   La normalisation (accents, casse) est assurée par normaliserTexte,
   partagée par toutes les barres de recherche du site (voir
   js/main.js) ; elle est appliquée aux noms une fois pour toutes au
   rendu, voir afficherRegles ci-dessus.
   ---------------------------------------------------------- */
function activerRecherche() {
  const champ = document.getElementById("recherche");
  const compteur = document.getElementById("compteur");
  if (!champ) return;

  champ.addEventListener("input", () => {
    const requete = normaliserTexte(champ.value.trim());
    let visibles = 0;

    document.querySelectorAll(".regle").forEach((regle) => {
      const correspond = regle.dataset.recherche.includes(requete);
      regle.classList.toggle("cachee", !correspond);
      if (correspond) visibles++;
    });

    // Les titres de section disparaissent si leur section est vide
    document.querySelectorAll(".groupe-regles").forEach((groupe) => {
      const resteVisible = groupe.querySelector(".regle:not(.cachee)") !== null;
      groupe.style.display = resteVisible ? "" : "none";
    });

    // Petit compteur de résultats
    if (compteur) {
      const total = document.querySelectorAll(".regle").length;
      compteur.textContent = requete
        ? visibles + " règle(s) trouvée(s) sur " + total
        : "";
    }
  });
}

/* ----------------------------------------------------------
   INITIALISATION
   ---------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  afficherRegles("regles-armes", REGLES_ARMES);
  afficherRegles("regles-diverses", REGLES_DIVERSES);
  activerRecherche();
});
