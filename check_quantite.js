/* ============================================================
   check_quantite.js — Script de contrôle qualité des données
   Auteur : Jean · Rôle : outil de MAINTENANCE, hors site
   ============================================================

   À QUOI ÇA SERT
   Le configurateur (js/unites.js) traite différemment une option qui
   AJOUTE de l'équipement et une option qui le REMPLACE. Une option de
   type "quantite" dont le libellé dit « à la place de », « échange »
   ou « remplace » mais qui oublie le champ `remplace` /
   `remplaceIntegral` produit un bug silencieux : la figurine se
   retrouve avec les DEUX armes, et le coût en points est faux.
   Sur 480 unités transcrites à la main, l'œil ne suffit plus. Ce
   script relit toutes les données et signale ces incohérences.

   COMMENT L'EXÉCUTER (depuis la racine du projet) :
       node check_quantite.js
   Il n'écrit rien : il affiche la liste des unités suspectes.
   Ce fichier ne fait PAS partie du site — aucune page ne le charge,
   il ne part jamais chez le visiteur.

   POURQUOI TOUS CES `global.…` CI-DESSOUS (le point intéressant)
   js/unites-data.js a été écrit pour le NAVIGATEUR : il est chargé par
   une balise <script> et compte sur le fait que les autres scripts
   (js/organigramme-data.js, js/armes-data.js…) ont déjà déposé leurs
   constantes dans l'objet global `window`. Il n'utilise ni `import`
   ni `require` — c'est un choix du projet : zéro build, zéro
   dépendance.

   Node, lui, n'a pas de `window` et ne charge pas ces fichiers. Si on
   faisait directement `require("./js/unites-data.js")`, l'exécution
   planterait sur la première constante inconnue
   (« LISTES_EQUIPEMENT is not defined »).

   D'où la technique employée ici : on SIMULE l'environnement du
   navigateur (on parle de « mock », ou bouchon). On déclare à
   l'avance, dans l'objet `global` de Node (l'équivalent de `window`),
   une version vide de chaque constante et de chaque fonction attendue.
   Les valeurs n'ont aucune importance — un tableau vide, un objet
   vide, une fonction qui ne renvoie rien : elles servent uniquement à
   ce que le fichier de données puisse être évalué jusqu'au bout.
   Seule la constante UNITES nous intéresse ensuite.

   LIMITE À CONNAÎTRE : ajouter une nouvelle fonction utilitaire dans
   js/unites-data.js sans l'ajouter à cette liste casse le script. Le
   message d'erreur nomme la fonction manquante — il suffit de la
   déclarer ci-dessous sur le même modèle.
   ============================================================ */

// Bouchons (« mocks ») : versions vides des constantes et fonctions que
// js/unites-data.js s'attend à trouver déjà définies. Voir l'en-tête.
global.ROLES_TACTIQUES = [];
global.TYPES_DETACHEMENTS = [];
global.ARMES = [];
global.REGLES_DIVERSES = {};
global.REGLES_ARMES = {};
global.LISTES_EQUIPEMENT = {};
global.LISTES_AUXILIA = {};
global.LISTES_MECHANICUM = {};
global.LISTES_ARSENAL_BLOOD_ANGELS = {};
global.LISTES_ARSENAL_DARK_ANGELS = {};
global.LISTES_ARSENAL_SPACE_WOLVES = {};
global.LISTES_ARSENAL_WHITE_SCARS = {};
global.LISTES_ARSENAL_RAVEN_GUARD = {};
global.LISTES_ARSENAL_IRON_HANDS = {};
global.LISTES_ARSENAL_SALAMANDERS = {};
global.LISTES_ARSENAL_IMPERIAL_FISTS = {};
global.LISTES_ARSENAL_IRON_WARRIORS = {};
global.LISTES_ARSENAL_NIGHT_LORDS = {};
global.LISTES_ARSENAL_SONS_OF_HORUS = {};
global.LISTES_ARSENAL_DEATH_GUARD = {};
global.LISTES_ARSENAL_EMPEROR_CHILDREN = {};
global.LISTES_ARSENAL_THOUSAND_SONS = {};
global.LISTES_ARSENAL_ULTRAMARINES = {};
global.LISTES_ARSENAL_WORD_BEARERS = {};
global.LISTES_ARTIFICE_NOCTURNE = {};
global.CHOIX_ARMES_ENERGETIQUES = [];
global.ARMES_ENERGETIQUES = [];
global.UNITES = [];
global.LISTES_SKITARII = {};
global.LISTES_MECHANICUM = {};
global.LISTES_FACTEUR_MOIRAX = [];
global.DECURION = {};
global.ARMES_MOIRAX = [];
global.RITES_CYBERTHEURGIQUES = () => [];
global.ARCANE_DE_PROSPERO = {};
global.TRAITS_FACTION_SKITARII = [];
global.TRAITS_FACTION_MECHANICUM = [];
global.SERMENTS_DU_MOMENT = [];
global.optionBombesFusion = () => ({});
global.optionBombesFusionUnite = () => ({});
global.optionBaionnette = () => ({});
global.optionsEquipementLegion = () => ({});
global.depuisListes = () => [];
global.quantiteDepuisListe = () => [];
global.optionTypeArmeEnergetique = () => [];
global.eclaterQuantiteArmeEnergetique = (opt) => [opt];
global.optionsDecurionLegion = () => [];
global.optionPivotLegion = () => ({});
global.optionsMissileEtProjecteurs = () => [];
global.optionSpheresVenin = () => ({});
global.optionTropheesDuJugement = () => ({});
global.optionArmesSoniques = () => ({});
global.optionBouclierArgyrum = () => ({});
global.optionCyberFaucon = () => ({});
global.optionReacteursCorvide = () => ({});
global.optionReacteursLegion = () => ({});
global.optionReacteursSkitarii = () => ({});
global.optionTechnoArcane = () => ({});
global.optionTraitSkitarii = () => ({});
global.optionArmatusNecrotechnika = () => ({});
global.optionTheurgikaMaximus = () => ({});
global.optionsMagos = () => [];
global.optionSponsonsLascanonSA = () => ({});
global.optionSponsonsLascanonLR = () => ({});
global.optionsponsonsLascanonSuperlourds = () => ({});
global.optionProjecteurs = () => ({});
global.optionMissileTracqueur = () => ({});
global.optionTraditionArdente = () => ({});
global.optionTechnoArcane = () => ({});
global.optionArmeEnergetique = () => ({});

// Une fois les bouchons en place, le fichier de données s'évalue sans
// erreur et dépose la constante UNITES dans `global`.
require('./js/unites-data.js');

/** Unités dont une option "quantite" semble oublier son remplacement. */
const problematic = [];

// Double boucle : chaque unité, puis chacune de ses options.
// (Un `for…of` plutôt qu'un `forEach` : on pourrait avoir besoin d'un
//  `break`, et la pile d'erreur reste lisible.)

for (const unite of UNITES) {
  for (const opt of unite.options) {
    // Seules les options "quantite" (« X figurines peuvent… ») sont
    // concernées : les types "choix" et "paire" portent toujours
    // explicitement leur remplacement.
    if (opt.type === 'quantite') {
      // `opt.libelle || ''` : garde-fou contre une option sans libellé —
      // appeler .toLowerCase() sur undefined ferait planter le script.
      const libelle = (opt.libelle || '').toLowerCase();
      const hasRemplace = opt.remplace || opt.remplaceIntegral;

      // Détecte les options qui semblent remplacer quelque chose
      if (!hasRemplace &&
          (libelle.includes('à la place') ||
           libelle.includes('échange') ||
           libelle.includes('remplace'))) {
        problematic.push({
          unite: unite.nom,
          optId: opt.id,
          libelle: opt.libelle,
          categorie: unite.categorie
        });
      }
    }
  }
}

// --- Rapport à l'écran ---------------------------------------------
console.log('Problème : options quantite sans remplaceIntegral:');
console.log('='.repeat(70));
for (const p of problematic) {
  console.log(`\n${p.unite} (${p.categorie})`);
  console.log(`  ID: ${p.optId}`);
  console.log(`  "${p.libelle}"`);
}
console.log('\n' + '='.repeat(70));
console.log(`Total: ${problematic.length} problème(s) trouvé(s)`);
