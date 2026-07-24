# Horus Heresy — site de règles/liste d'armée

Site statique (HTML/CSS/JS vanilla, pas de build) pour Warhammer: The Horus
Heresy 2.0. Pages dans `pages/`, logique dans `js/`, données de jeu dans
`js/unites-data.js` (unités), `js/armes-data.js` (Arsenal, tables d'armes) et
`js/regles-data.js` (glossaire des Règles Spéciales, info-bulles). Tout le
contenu de jeu est en français ; c'est toujours le livre (ou le PDF fourni)
qui fait référence en cas de doute.

## Unités Legacy (Warhammer: The Horus Heresy — Legacies of the Age of Darkness)

Le proprio va fournir, légion par légion, un PDF `<legion>.pdf` (fiches
d'unité) et souvent un `<legion>_wargear.pdf` (« Legacy Wargear » : options
d'armurerie additionnelles). Ces PDF sont **en anglais uniquement** (pas de
VF officielle) : la traduction est entièrement à ma charge, en réutilisant le
vocabulaire déjà établi ci-dessous plutôt qu'en improvisant à chaque fois.

### Marche à suivre

1. **Comparer avant de créer.** Chercher le nom de l'unité dans
   `js/unites-data.js` (`Grep` sur son nom) : si elle existe déjà (souvent
   une reconstruction approximative faute de scan), corriger plutôt que
   dupliquer. Idem pour les armes dans `js/armes-data.js` — beaucoup
   d'armes « Legacy » existent déjà telles quelles (ex : Canon d'assaut
   Iliastus, Paire de poings énergétiques Gravis, Marteau Thunder forgé)
   car elles étaient déjà utilisées par une unité du livre de base.
2. **Chaque nouvelle unité Legacy reçoit `legacy: true`** — c'est ce
   champ qui affiche la mention « (Legacies) » après son nom dans le menu
   déroulant « Unité à ajouter » (voir `libelle` dans
   `initialiserChoixUnite`, `js/unites.js`), sur le même principe que
   « Garde Sanguinienne ».
3. **Champ `legion`** : code romain (voir table plus bas) qui réserve
   l'unité à cette Légion dans l'organigramme (`Organigramme.legionActuelle()
   === unite.legion`, voir `uniteAccessible` dans `js/unites.js`).
4. **Demander la `categorie`** si elle n'est pas évidente plutôt que de
   deviner — le proprio la connaît souvent déjà et corrige sinon après
   coup (vécu sur Iron Warriors/Salamanders). Valeurs déjà utilisées :
   `Quartier Général`, `État-major`, `Troupes`, `Elite`, `Assaut Lourd`,
   `Appui`, `Reco`, `Attaque Rapide`, `Suites`, `Blindés`,
   `Transports Lourds`, `Transports`, `Engins de Guerre`,
   `Seigneur de Guerre` (Primarques), `Seigneurs des Batailles`
   (super-lourds/Titans/Chevaliers — Lords of War).
5. **Attention à `effectif: { base, max, cout }`** : `max` est l'effectif
   TOTAL de l'unité (base + renforts), jamais seulement le nombre de
   renforts. Piège récurrent : une fiche qui dit « peut inclure jusqu'à
   3 Modèles supplémentaires » avec une composition de base à 1 donne
   `max: 4`, pas `max: 3`. `cout` est le prix par figurine
   supplémentaire (`(instance.effectif - base) * cout`).
6. **Ne jamais inventer le texte d'une Règle Spéciale.** Si son
   intitulé apparaît sur une fiche sans encart de texte complet (ex :
   *Battlesmith*, *Suppressive*, *Firestorm* avant que le proprio ne les
   identifie), l'ajouter tel quel dans `regles:` (rendu en texte brut,
   sans info-bulle — `trouverDefinitionRegle` retombe silencieusement sur
   du texte simple si rien ne correspond dans `regles-data.js`) et ne PAS
   créer d'entrée de glossaire tant que le texte réel n'est pas fourni.
   N'ajouter à `js/regles-data.js` que les règles dont j'ai le texte
   intégral (traduit) — beaucoup de règles du livre de base elles-mêmes
   n'ont pas d'entrée de glossaire (ex : « Unité d'Appui (X) », « Lent et
   Méthodique », « Le Briseur » avant qu'on ne le comble) : ce n'est pas
   une erreur à corriger systématiquement, juste l'état existant du
   fichier.
7. **Vérifier après coup** : `node --check js/unites-data.js` (+
   `armes-data.js`, `regles-data.js` si modifiés). Aucun outil de test
   automatisé au-delà de ça.
8. Ne jamais committer sans que ce soit demandé explicitement.

### Schéma d'une unité (`js/unites-data.js`)

Champs courants : `id`, `nom`, `legacy`, `faction` (par défaut
`legio-astartes` si absent), `categorie`, `cout`, `composition`,
`effectif`, `equipementLibelle`, `traits`, `notes`, `equipement`,
`variantes` (chacune avec soit `profil` (figurine unique) soit `profils`
(plusieurs, ex. Sergent + Troupier) ou `profilVehicule`/`profilsVehicule`
pour un Véhicule, + `regles`, `type`), `options`, `legion`.

**Types d'options** (tableau `options`) :

- `case` : case à cocher, coût fixe, `ajoute` (string ou tableau) affiché
  si cochée. Ne retire RIEN automatiquement de `equipement` — le texte
  « (à la place de X) » dans le libellé/`ajoute` est purement descriptif.
- `choix` : menu déroulant (un seul choix). `remplace: "Nom exact"` doit
  correspondre mot pour mot à une entrée de `equipement` : il est alors
  retiré automatiquement, SAUF si `ajoute: true` est posé (alors pur
  ajout, rien n'est retiré). `prefixeFiche` préfixe l'affichage sur la
  fiche récap (ex : `"Sergent : "`). `obligatoire: true` rend l'indice 0
  un vrai choix affiché (utile pour « toute figurine DOIT choisir X »).
  `parFigurine: true` = un seul choix pour toute l'unité (même objet
  pour tout le monde).
- `quantite` : échange répétable, un jet de figurines à la fois.
  `parTranche: N` = un échange autorisé par tranche de N figurines dans
  l'unité (`parTranche: 1` = jusqu'à une fois par figurine).
  `parTrancheMax` (def. 1) = nombre d'échanges par tranche (ex :
  « jusqu'à deux par Figurine » → `parTranche: 1, parTrancheMax: 2`).
  `groupe` partage un même budget entre plusieurs options `quantite`
  (« par tranche de cinq, UNE figurine peut prendre X OU Y »).
- `paire` : échange un ensemble d'objets listés (`remplaceListe: [...]`,
  retirés automatiquement) contre un seul nouvel objet (`ajoute`).
- `multi` : sélection multiple dans une liste.
- `requiertLegion: "VII"` sur une option (n'importe quel type) la
  réserve à cette Légion même sur une unité générique sans `legion` fixe
  — voir `optionsDecurionLegion` (Décurion Sagittar, réservé Imperial
  Fists) pour un exemple. Piste pas encore exploitée pour rattacher les
  ajouts d'armurerie Legacy (ex : Canon d'assaut Iliastus, Masse à
  gravitons) aux unités génériques de Légion (Escouade de Soutien,
  Escouade Tactique...) — actuellement ces ajouts Legacy ne sont câblés
  que sur les nouvelles unités Legacy elles-mêmes et sur l'unité propre à
  la Légion qui les mentionne explicitement dans son wargear PDF.

**Fabriques utiles** (déjà définies en haut de `unites-data.js`) :
`depuisListes(...listes)`, `quantiteDepuisListe(liste, {groupe,
parTranche, remplace})`, `optionBombesFusion()` /
`optionBombesFusionUnite()`, `optionBaionnette(arme = "Bolter")`,
`optionsDecurionLegion({...})`. Listes partagées dans
`LISTES_EQUIPEMENT` : `officier`, `meleeSergent`, `meleeTerminator`,
`pistolets`, `combinees`, `speciales`, `lourdes`, `pivot`, `laterales`.

### Table des Légions (`legion:`)

I Dark Angels · III Emperor's Children · IV Iron Warriors · V White Scars
· VI Space Wolves · VII Imperial Fists · VIII Night Lords · IX Blood
Angels · X Iron Hands · XII World Eaters · XIII Ultramarines · XIV Death
Guard · XV Thousand Sons · XVI Sons of Horus · XVII Word Bearers · XVIII
Salamanders · XIX Raven Guard · XX Alpha Legion. (II et XI : Légions
Perdues, non représentées dans les livres d'armée.)

### Glossaire anglais → français déjà établi

Caractéristiques (profil figurine) : `M CC CT F E PV I A Cd Sf Vo Int Sv
Inv` = `M WS BS S T W I A LD CL WP IN SAV INV`.
Armes de Tir (`ENTETES_TIR`) : `P PF FT PA D` = `R FP RS AP D`.
Armes de Mêlée (`ENTETES_MELEE`) : `MI MA MF PA D` = `IM AM SM AP D`.

Règles Spéciales :

- Bulky (X) → Massif (X)
- Implacable Advance → Avance Implacable
- Slow and Purposeful → Lent et Méthodique
- Explodes (X+) → Explose (X+)
- Eternal Warrior (X) → Guerrier Éternel (X)
- Deep Strike → Frappe en Profondeur
- Feel No Pain (X+) → Insensible à la Douleur (X+)
- Hatred (X) → Haine (X)
- Expendable (X) → Sacrifiable (X)
- Vanguard (X) → Avant-garde (X)
- Pinning (X) → Fixation (X)
- Shred (X+) → Lacération (X+)
- Breach(ing) (X+) → Brèche (X+)
- Shock (Pinned) → Choc (Fixée) (et autres statuts : Choc (Neutralisée),
  Choc (Sonnée))
- Snap Shots → Tirs au Jugé
- Volley Attack → Attaque de Volée
- Limited (X) → Limitée (X)
- Support Unit (X) → Unité d'Appui (X)
- Master of the Legion → Maître de la Légion
- Officer of the Line (X) → Officier de Ligne (X)
- Line (X) → Ligne (X)
- Battlesmith (X) → **Guerrier-artisan (X)** (règle déjà existante du
  glossaire, ne PAS créer « Forgeron de Guerre » — confirmé utilisé aussi
  bien par les Iron Warriors que les Salamanders, donc générique)
- Firestorm → Gabarit de Souffle (nom seul, pas de texte complet connu)
- Suppressive (X) → Suppressif (X) (nom seul, pas de texte complet connu)
- Void Shields (X) → Boucliers Void (X) (nom seul — distinct de
  « Boucliers Void Titaniques (X) », propre aux Titans)

Équipement/armes :

- Warsmith → Forgeguerre
- Bolt pistol → Pistolet bolter · Chainsword → Épée tronçonneuse
- Power weapon → Arme énergétique · Power fist → Gantelet énergétique
- Power gauntlet (Solarite) → Gantelet énergétique Solarite
- Thunder hammer → Marteau Thunder · Chainfist → Poing tronçonneur
- Paragon blade → Lame de parangon · Archaeotech pistol → Pistolet
  archéotech · Astartes shotgun → Fusil à pompe Astartes
- Volkite charger → Chargeur volkite · Volkite serpenta → Serpentine
  volkite
- Pair of lightning claws → Paire de griffes Lightning
- Melta bombs → Bombes à fusion · Grenade harness → Harnais à grenades
- Bayonet → Baïonnette · Chain bayonet → Baïonnette tronçonneuse
- Cyber-familiar → Cyber-familier
- Hand flamer → Lance-flammes léger · Heavy flamer → Lance-flammes lourd
- Plasma gun → Fusil à plasma · Meltagun → Fuseur
- Autocannon → Autocanon · Reaper autocannon → Autocanon Reaper
- Missile launcher → Lance-missiles · Lascannon → Canon laser
- Vexilla → Vexillum · Auspex scanner → Scanner augure (Nuncio-vox
  inchangé)
- « Forge-crafted X » → « X forgé » (attention : parfois un profil
  distinct sur la fiche, pas juste un renommage — vérifier avant de
  dupliquer les stats de l'arme de base)
- Hunter-killer missile → Missile traqueur · Searchlights → Projecteurs
- « Two Sponson Mounted X » → « Deux X (Sponsons) »
- « Pintle Mounted X » → « X sur Pivot »
- « Centreline Mounted X » → « X d'Axe Central »
- « Hull (Front) Mounted X » → « X de Coque (Avant) »
- « Turret Mounted X » → « X de Tourelle »
- Twin heavy bolter → Bolter lourd jumelé
- Turbo-laser destructor → Destructeur turbo-laser
- Hellstrike missile → Missile Hellstrike
- (Iliastus) assault cannon → Canon d'assaut Iliastus
- Chainblade (Night Lords, Liber Hereticus p.171) → réutilise le profil
  existant « Lame tronçonneuse » (Escouade Terminator Contekar), pas un
  nouveau nom
- Escaton power claw → réutilise le profil existant « Griffe énergétique
  Escaton »
- Chainglaive → Glaive tronçonneur (ex : Nostraman chainglaive → Glaive
  tronçonneur Nostraman)
- Headsman's axe → Hache du Bourreau
- Plasma blaster → Blaster à plasma (nom seul — aucune fiche
  Warhammer 40000/Horus Heresy consultée ne donne son profil dans les
  extraits fournis jusqu'ici)
- Titres/rangs d'apparence latine ou propre à une Légion (Praetor,
  Trucidor, Consul Praevian, Consul-Delegatus...) : gardés tels quels,
  non traduits.
- Skirmish (type de Figurine) → Tirailleurs
- Power dagger → Dague énergétique · Inferno pistol → Pistolet Inferno
  (les deux existaient déjà, réutilisés tels quels)
- Nemesis (adjectif d'arme) → Némésis (accent French, cf. Canon Volcano
  Némésis) — mais profil non inventé si aucune fiche ne le donne (ex :
  Bolter Némésis, Alpha Legion)
- Command Slot (Force Org Chart) → Case de Quartier Général/d'État-major
  (pas de terme dédié « Case de Commandement » dans ce fichier)
- High Command Choice / Slay the Warlord (X) → Choix de Haut
  Commandement / Objectif Secondaire Éliminer le Seigneur de Guerre (X)
  (traduction directe, pas de terme déjà établi dans le site pour le
  jeu en tournoi/objectifs secondaires)
- Shrouded (Damage Mitigation Rolls) → Dissimulation — terme déjà
  établi (« Jets de Mitigation de Dégâts de Dissimulation »)
- Splinter (missiles) → Éclats (ex : Splinter missiles → Missiles à
  éclats) — coinage, pas de précédent exact
- Toughness dans « Phage (T) » → Phage (E) comme toute autre
  caractéristique (T=Endurance dans ce fichier)
- « Mortifier »/« -mortifère » (Ultramarines Nemesis Destroyer) → X
  mortifère (ex : Mortifier bolter → Bolter mortifère)
- Peritarch (targeter) → Péritarque (ex : Peritarch targeter → Viseur
  Péritarque) ; Targeter → Viseur
- Lascutter → **Découpeur laser** (résolu : profil déjà existant dans
  l'Arsenal, utilisé par l'Escouade d'Immortels de Medusa — corriger si
  vu ailleurs comme « nom seul »)
- Outflank → Contournement (nom seul, pas de texte complet connu)
- Stun (règle d'arme) → Sonner (X) (terme déjà établi, pas un nouveau
  nom)
- Reaping Blow (X) → Fauchage (X) (terme déjà établi)
- Needle (trait d'arme) → Aiguille
- Sword of the Order (trait d'arme) → Épée de l'Ordre (terme déjà
  établi, cf. L'Épée du Lion/La Lame du Loup)
- Un même Statut « Choc (X) » peut avoir plusieurs variantes suivant
  l'arme (Fixée, Neutralisée, Sonnée, Supprimée...) : chercher si la
  variante existe déjà avant d'en traduire une nouvelle.
- Prime Advantage / Prime Force Organisation Slot (Dark Angels
  Terminator Paladin of the Hekatonystika) : mécanique non modélisée
  dans ce fichier, à ne pas confondre avec Cases Principales/Détachement
  Auxiliaire ou d'Apex (js/organigramme-data.js) — non transcrite tant
  qu'aucune Unité concrète n'en a besoin.
- Reaver (Sons of Horus) → Ravageur (terme déjà établi, cf. Escouade
  d'Attaque Ravageuse) ; Chieftain → Chef de Guerre.
- Jump Pack : pas de ligne d'équipement dédiée dans ce fichier — encodé
  uniquement via le Sous-type « Antigrav » du champ `type`, comme pour
  les autres Unités à réacteur dorsal déjà transcrites.
- Deux Unités Legacy peuvent recouper une Unité déjà existante sous un
  nom anglais proche mais distinct (« Reaver ATTACK Squad » du wargear
  PDF ≠ la nouvelle « Reaver AGGRESSOR Squad » du PDF principal, mais
  correspond à l'Escouade d'Attaque Ravageuse déjà présente) : vérifier
  studieusement lequel des deux réceptionne chaque ajout Legacy avant
  d'écrire quoi que ce soit.
- Graviton shredder → Déchiqueteur à gravitons · Volkite culverin →
  réutilise « Couleuvrine volkite » déjà existante (mêmes stats)
  · Legion standard → Étendard de Légion (terme déjà établi)
- Iron Father (Iron Hands) → titre gardé tel quel (pas de « Père de
  Fer »), sur le même principe que Forgeguerre/Warsmith mais non
  traduit — aligné sur l'anglais faute de précédent contraire.
- Une armurerie Legacy peut viser une liste NOMMÉE et bornée d'Unités
  génériques inexistantes dans ce fichier (ex : Armure Terminator
  Gorgone → « Iron Father » + 12 profils « Tartaros [rôle] » : aucun
  des deux n'existe ici en dehors de la variante Legacy elle-même) :
  documenter le gap en commentaire plutôt que d'inventer les Unités
  manquantes ou de forcer l'option sur une Unité qui ne correspond pas
  vraiment (ex : ne pas donner une Armure Terminator à une Figurine en
  Armure Artificer dont c'est justement le trait distinctif).
- **Rending (X+) → Vulnérante (X+), PAS Lacération (X+).** Ce sont deux
  Règles Spéciales distinctes déjà dans le glossaire : Shred (X+) =
  Lacération (+1 dégât si jet de blessure ≥ X) ; Rending (X+) =
  Vulnérante (jet de touche ≥ X blesse automatiquement, sans jet de
  blessure). Bien vérifier le mot anglais exact avant de traduire.
- Æther-fire (Thousand Sons) → **étherfeu** (un seul mot, sans trait
  d'union ni espace), déjà établi (Canon à étherfeu, Castellax-Achea) :
  Æther-fire pistol/blaster/magna-cannon → Pistolet/Blaster/Canon Magna
  à étherfeu.
- `ARCANE_DE_PROSPERO` (constante partagée, `unites-data.js`) est un
  choix de Culte/sous-faction (Raptora, Pyrae, Pavoni, Corvidae,
  Athanéen), PAS une sélection de Pouvoirs Psychiques nommés
  individuels — ce fichier ne modélise pas les Pouvoirs Psychiques un
  par un. Une Unité dont la fiche donne des Pouvoirs Psychiques fixes
  (ex : Numérologiste) n'a pas accès à ce choix ; les noms des Pouvoirs
  eux-mêmes n'ont pas de glossaire dédié, les citer tels quels dans la
  Règle Spéciale qui les accorde suffit.

Cette liste s'allonge à chaque légion : la compléter au fil de l'eau
plutôt que de la laisser devenir obsolète.
