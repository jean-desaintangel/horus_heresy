// lib/ajustements-html.js — corrections HTML propres à la version EN,
// appliquées par construire.js après la réinjection (le JSON-LD de
// l'accueil n'est pas couvert par l'extracteur).
module.exports = function (rel, src) {
  // jsPDF/AutoTable : la copie de la racine sert aux deux langues.
  src = src.split('src="../js/vendor/').join('src="../../js/vendor/');
  if (rel === "index.html") {
    src = src.replace(/"name": "Horus Heresy — Guide d’initiation"/, '"name": "Horus Heresy — Beginner\'s Guide"');
    src = src.replace(
      /"description": "Guide non officiel pour le jeu de figurines Warhammer: The Horus Heresy 3e édition\."/,
      '"description": "Unofficial guide to the Warhammer: The Horus Heresy 3rd edition miniatures game."',
    );
  }
  return src;
};
