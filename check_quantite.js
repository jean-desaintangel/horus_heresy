// Charge le fichier html pour accéder à UNITES
// Mock du navigateur
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

require('./js/unites-data.js');

const problematic = [];

for (const unite of UNITES) {
  for (const opt of unite.options) {
    if (opt.type === 'quantite') {
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

console.log('Problème : options quantite sans remplaceIntegral:');
console.log('='.repeat(70));
for (const p of problematic) {
  console.log(`\n${p.unite} (${p.categorie})`);
  console.log(`  ID: ${p.optId}`);
  console.log(`  "${p.libelle}"`);
}
console.log('\n' + '='.repeat(70));
console.log(`Total: ${problematic.length} problème(s) trouvé(s)`);
