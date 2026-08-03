/* ============================================================
   sequence-clavier.js — reconnaissance d'un mot-clé tapé au clavier
   Auteur : Jean · Créé : 2026-08-03
   Rôle   : brique partagée par tous les « clins d'œil » du site
   (Nuit Éternelle et Zone Mortalis dans js/main.js, les quatre
   primarques démoniaques dans js/choix-legion.js).
   Dépend : aucun. À charger AVANT js/main.js et js/choix-legion.js
   (les deux sont en `defer` : l'ordre d'exécution est celui des
   balises <script> dans le document).
   Expose : window.empreinteSHA256, window.surSequenceClavier.

   POURQUOI CE FICHIER EXISTE
   Ces trois clins d'œil faisaient exactement la même chose — mémoriser
   les N dernières touches et comparer leur empreinte — mais chacun
   avec sa propre copie du code. Trois copies, c'est trois occasions de
   diverger, et elles avaient effectivement divergé : celles de main.js
   ignoraient les champs de saisie (pour ne pas déclencher le thème
   pendant qu'on tape dans une barre de recherche), celle de
   choix-legion.js non. Un même geste de l'utilisateur ne produisait
   donc pas le même résultat selon la page.
   Le vrai coût de la duplication n'est pas les lignes en double : c'est
   qu'une correction doit être retrouvée et réappliquée à N endroits, et
   qu'on en oublie toujours un. Ici, ça compte : la correction
   d'accessibilité prévue (§ audit — exiger la touche Alt pour qu'un
   raccourci de lecteur d'écran ne compose pas la séquence par accident)
   devient une seule ligne à changer, dans ce fichier, au lieu de trois.
   ============================================================ */

/**
 * Empreinte SHA-256 (hexadécimale) d'une chaîne, via l'API SubtleCrypto
 * du navigateur.
 *
 * Pourquoi une empreinte plutôt qu'une simple comparaison de texte ?
 * Parce qu'un mot-clé écrit en clair dans le code se trouve en trois
 * secondes : « Afficher le code source », Ctrl+F, c'est fini. Une
 * fonction de hachage ne fonctionne que dans un sens — on peut vérifier
 * qu'une saisie correspond, mais on ne peut pas retrouver le mot-clé à
 * partir de l'empreinte. Bien essayé, jeune acolyte.
 *
 * @param {string} texte - la chaîne à hacher
 * @returns {Promise<string>} l'empreinte en hexadécimal, ou une chaîne
 *   vide si SubtleCrypto est indisponible (contexte non sécurisé,
 *   navigateur ancien) — une empreinte vide ne correspondra jamais à
 *   rien, le clin d'œil se désactive alors silencieusement.
 */
async function empreinteSHA256(texte) {
  if (!window.crypto || !window.crypto.subtle) return "";
  const donnees = new TextEncoder().encode(texte);
  const empreinte = await crypto.subtle.digest("SHA-256", donnees);
  return Array.from(new Uint8Array(empreinte))
    .map((octet) => octet.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Déclenche une action quand l'utilisateur tape un mot-clé au clavier,
 * n'importe où dans la page (principe du « code Konami »).
 *
 * Fonctionnement : on garde en mémoire les `longueur` dernières touches
 * frappées — une file glissante, où chaque nouvelle touche pousse la
 * plus ancienne dehors. Inutile donc de commencer par la première
 * lettre : le mot-clé est reconnu dès qu'il apparaît dans le flot de
 * frappe. Majuscules et accents sont ignorés (tout est mis en
 * minuscules avant comparaison).
 *
 * @param {number} longueur - nombre de caractères du mot-clé attendu
 * @param {string} empreinteAttendue - son empreinte SHA-256 hexadécimale
 * @param {() => void} action - exécutée quand le mot-clé est reconnu
 */
function surSequenceClavier(longueur, empreinteAttendue, action) {
  let tampon = [];

  document.addEventListener("keydown", async (evenement) => {
    // Échap vide la file : permet de repartir de zéro sans avoir à
    // taper `longueur` touches quelconques pour « chasser » les
    // précédentes.
    if (evenement.key === "Escape") {
      tampon = [];
      return;
    }

    // On ignore la frappe si le focus est dans un champ de saisie :
    // sans cela, écrire le mot-clé dans une barre de recherche
    // déclencherait le clin d'œil par coïncidence, en plein milieu
    // d'une action volontaire de l'utilisateur.
    const cible = evenement.target;
    const dansChampDeSaisie =
      cible &&
      (cible.tagName === "INPUT" ||
        cible.tagName === "TEXTAREA" ||
        cible.isContentEditable);
    // key.length === 1 ne retient que les caractères imprimables et
    // écarte les touches nommées (Shift, Tab, F1, les flèches…), dont
    // le `key` est un mot entier. L'espace passe : son key vaut " ".
    if (dansChampDeSaisie || evenement.key.length !== 1) return;

    tampon.push(evenement.key.toLowerCase());
    if (tampon.length > longueur) tampon.shift();

    if (
      tampon.length === longueur &&
      (await empreinteSHA256(tampon.join(""))) === empreinteAttendue
    ) {
      // Remise à zéro AVANT l'action : sans cela, une touche de plus
      // laisserait la file encore correspondante et re-déclencherait
      // l'action en boucle (visible sur un basculement de thème).
      tampon = [];
      action();
    }
  });
}

// Exposition explicite sur window : ces deux fonctions sont consommées
// par d'autres fichiers, contrairement au reste du code du site qui
// reste local à son fichier. Le rendre visible ici évite d'avoir à
// deviner, en lisant main.js, d'où sort `surSequenceClavier`.
window.empreinteSHA256 = empreinteSHA256;
window.surSequenceClavier = surSequenceClavier;
