/* ============================================================
   contact.js — Formulaire de signalement (pages/contact.html)
   Auteur : Jean · Modifié : 2026-07-19
   Rôle   : envoi du formulaire à Formspree en AJAX (sans quitter
   la page), pré-remplissage du champ « Page concernée », et
   messages de succès / d'erreur accessibles.
   Dépend : aucun (vanilla JS) — stylé par css/style.css.

   AMÉLIORATION PROGRESSIVE : si ce script ne se charge pas (ou si
   JavaScript est désactivé), le <form> reste un formulaire HTML
   classique qui poste vers Formspree. L'utilisateur quitte la page
   et voit la confirmation de Formspree : moins agréable, mais le
   message part quand même. On n'intercepte l'envoi que si tout est
   disponible.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-signalement");
  if (!form) return; // script chargé sur une autre page : on sort

  const retour = document.getElementById("form-retour");
  const bouton = form.querySelector('button[type="submit"]');
  const champNom = document.getElementById("nom");

  /* ----------------------------------------------------------
     1. PRÉ-REMPLISSAGE DU CHAMP « PAGE CONCERNÉE »
     document.referrer = l'URL de la page d'où vient le visiteur.
     S'il a cliqué sur « Signalez-la » depuis le pied de page de
     pages/armes.html, on propose « Armes » d'emblée : un champ
     de moins à remplir, et un signalement plus exploitable.
     On ne garde QUE le nom de fichier, et seulement s'il vient du
     même site (même origine) — inutile de recopier une URL externe.
     ---------------------------------------------------------- */
  const champPage = document.getElementById("page");
  if (champPage && !champPage.value && document.referrer) {
    try {
      const url = new URL(document.referrer);
      if (url.origin === window.location.origin) {
        // "/site/pages/armes.html" -> "armes"
        // Cas particuliers : "/" (racine) et "index" désignent l'accueil.
        const fichier = url.pathname
          .split("/")
          .pop()
          .replace(/\.html$/, "");
        if (fichier === "" || fichier === "index") {
          champPage.value = "Accueil";
        } else if (fichier !== "contact") {
          champPage.value = fichier;
        }
      }
    } catch {
      /* referrer inexploitable : on laisse le champ vide */
    }
  }

  /* ----------------------------------------------------------
     CLIN D'ŒIL — Alpha Legion
     Quoi que le visiteur ait tapé (ou pas) dans « Votre nom », le
     champ affiche « Je suis Alpharius » dès qu'il en sort (perte de
     focus) — comme le champ est réellement modifié (pas un habillage
     visuel séparé), c'est aussi cette valeur qui part dans le mail
     Formspree.
     ---------------------------------------------------------- */
  if (champNom) {
    champNom.addEventListener("blur", () => {
      champNom.value = "Je suis Alpharius";
    });
  }

  /* ----------------------------------------------------------
     2. ENVOI EN AJAX
     preventDefault() empêche le navigateur de quitter la page ;
     on envoie nous-mêmes la requête avec fetch(), puis on affiche
     le résultat sur place.

     FormData(form) collecte automatiquement tous les champs
     nommés (name="...") du formulaire, y compris le honeypot et
     les champs cachés « _subject ».

     En-tête Accept: application/json : Formspree répond alors en
     JSON au lieu de renvoyer une page HTML de confirmation.
     ---------------------------------------------------------- */
  form.addEventListener("submit", async (e) => {
    // preventDefault() EN PREMIER, avant tout autre test.
    //
    // L'ordre inverse (checkValidity() d'abord) paraissait logique mais
    // était doublement faux, et c'est une erreur classique qui mérite
    // d'être comprise :
    //
    // 1. Le bloc était MORT. Le navigateur ne déclenche l'événement
    //    "submit" qu'APRÈS avoir lui-même validé les contraintes HTML
    //    (required, minlength, type="email"). Tant que le formulaire
    //    est invalide, il affiche sa bulle d'erreur et n'émet jamais
    //    l'événement — donc !form.checkValidity() ne pouvait pas être
    //    vrai ici. Sauf attribut `novalidate` sur le <form>, absent.
    // 2. S'il avait pu l'être, le `return` sortait SANS avoir coupé le
    //    comportement par défaut : le navigateur poursuivait alors la
    //    soumission native vers Formspree et l'utilisateur quittait la
    //    page — exactement ce que ce fichier cherche à éviter.
    //
    // À retenir : dans un gestionnaire de "submit", preventDefault()
    // se place avant le premier `return` possible, jamais après.
    e.preventDefault();

    // Le garde-fou devient utile pour un envoi déclenché par code
    // (form.requestSubmit()), qui, lui, peut contourner la validation
    // native. On laisse le navigateur afficher sa propre bulle d'erreur
    // plutôt que de réinventer un message : c'est celui que
    // l'utilisateur connaît, et il est traduit et vocalisé nativement.
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Garde-fou anti double-clic : sans cela, un visiteur impatient
    // peut envoyer trois fois le même message.
    bouton.disabled = true;
    bouton.textContent = "Envoi en cours…";
    afficherRetour("", null);

    try {
      const reponse = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (reponse.ok) {
        form.reset();
        afficherRetour(
          "Merci ! Votre message a bien été envoyé. Nous le lirons rapidement.",
          "succes",
        );
      } else {
        // Formspree détaille l'erreur dans le JSON (quota atteint,
        // formulaire désactivé, endpoint inconnu…). On l'affiche
        // telle quelle : c'est ce qui aide le plus au diagnostic.
        const data = await reponse.json().catch(() => ({}));
        const detail = data.errors
          ? data.errors.map((err) => err.message).join(" ")
          : "";
        afficherRetour(
          "L’envoi a échoué. " +
            (detail || "Réessayez plus tard ou contactez-nous autrement."),
          "erreur",
        );
      }
    } catch {
      // fetch() ne rejette QUE sur une panne réseau (hors ligne,
      // DNS, CORS) : une réponse 404 ou 500 passe par le else
      // ci-dessus, pas par ce catch. Erreur classique de débutant.
      afficherRetour(
        "Impossible de joindre le serveur. Vérifiez votre connexion, puis réessayez.",
        "erreur",
      );
    } finally {
      // finally s'exécute que l'envoi ait réussi ou échoué :
      // le bouton est toujours réactivé, jamais bloqué.
      bouton.disabled = false;
      bouton.textContent = "Envoyer";
    }
  });

  /**
   * Affiche un message dans la zone de retour (role="status",
   * aria-live="polite" : annoncé par les lecteurs d'écran).
   * textContent et non innerHTML : le texte n'est jamais interprété
   * comme du HTML — réflexe anti-XSS, d'autant que le message
   * d'erreur peut provenir d'une réponse serveur.
   * @param {string} texte
   * @param {"succes"|"erreur"|null} etat - null pour effacer
   */
  function afficherRetour(texte, etat) {
    retour.textContent = texte;
    retour.className = "form-retour" + (etat ? " form-retour--" + etat : "");
  }
});
