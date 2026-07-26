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

**Piège vécu deux fois (Sons of Horus, Emperor's Children) : pour une
Unité à plusieurs rôles (Sergent + Troupier), `variantes` reste un
tableau à **UN SEUL** élément contenant `profils` (pluriel, un tableau
de `{ nom, profil }`) + `regles` + `type` partagés. ÉCRIRE DEUX
ÉLÉMENTS DE `variantes` (un par rôle, chacun avec son propre `profil`
singulier) EST FAUX : ça perd `regles`/`type`/`options` pour l'Unité et
casse le rendu de la fiche. Le tableau à deux éléments de `variantes`
n'existe que pour un choix RÉEL de configuration (ex : Centurion normal
OU à Réacteurs, Draykavac normal OU sur Abéant — deux Figurines
différentes qu'on ne prend jamais ensemble), jamais pour Sergent +
Troupier de la même Unité. Après avoir écrit une nouvelle Unité
multi-profils, relire immédiatement le JSON du bloc `variantes` pour
confirmer qu'il n'y a qu'un seul élément.**

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
- Suppressive (X) → Neutralisation (X) (nom seul, pas de texte complet connu)
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
  les autres Unités à réacteur dorsal déjà transcrites. **Le terme reste
  en anglais** (« Jump Pack »/« Jump Packs »), non traduit par « Sac(s)
  de Saut » — demande explicite du proprio (2026-07-24), appliquée
  partout où le terme apparaît (`nom`, `composition`, `notes`) : à
  respecter pour toute nouvelle Unité Legacy à Jump Pack.
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
- Volkite culverin → réutilise « Couleuvrine volkite » (arme d'appui
  lourde) ; Volkite caliver → réutilise « Arquebuse volkite » (arme
  portable) — deux armes Volkite distinctes déjà existantes, ne pas les
  confondre.
- Phoenix rapier (Emperor's Children) → nouvelle arme « Rapière
  Phénix » ; Phoenix power spear → réutilise « Lance énergétique
  Phénix » déjà existante (mêmes règles, ne pas dupliquer).
- Sun Killer → Tueur de Soleils · Headless (nom de Règle Spéciale) →
  Sans Tête (nom seul, pas de texte complet connu) · Designated Quarry
  → Proie Désignée · Vengeful Hate → Haine Vengeresse.
- Firestorm → **Gabarit de Souffle** confirmé applicable partout où le
  nom anglais « Firestorm » apparaît comme Règle Spéciale (pas propre
  aux Salamanders — revu sur les Casters/Speakers montés Space Wolves).
- Speaker of the Dead (Space Wolves) → Porte-Parole des Morts · Caster
  of Runes → Tireur de Runes (Unité déjà existante, variante Sac de
  Saut/Montée/Terminator ajoutée séparément, même nom de base).
- Crozius Arcanum, Narthecium → gardés tels quels (Latin), pas de
  profil d'Arme ni de traduction dans ce fichier.
- Attention aux armes de personnage à NE PAS réutiliser pour une Unité
  générique : « Wolf teeth and claws » de la Meute de Loups Fenrisiens
  est un profil plus faible et distinct de « Crocs et Griffes »
  (l'arme propre à Freki/Geri) malgré un nom anglais quasi identique —
  nouvelle entrée « Crocs et griffes de loup » créée exprès.
- Alchem (Death Guard) → **alchim** (déjà établi : Projecteur alchim,
  Lance-flammes lourd alchim) — Alchem flamer/combi-flamer →
  Lance-flammes/Combi-lance-flammes alchim ; Alchem caster → réutilise
  Projecteur alchim déjà existant (même profil).
- Poison-master → Maître Empoisonneur · Mortus Poisoner → Empoisonneur
  Mortus.
- Diabolist (Word Bearers) → Diaboliste ; Diabolism Discipline → Discipline
  du Diabolisme ; Dark Channeling → Canalisation Ténébreuse ; Hellfire
  (Psychic Weapon) → Feu Infernal ; Damned → Damné (texte intégral
  disponible pour ces quatre, ajoutées à `regles-data.js`/`armes-data.js`).
- Procurator/Procurant (Word Bearers) → gardés tels quels, non traduits
  (Procurateur pour le rôle promu type Sergent, Procurant pour le
  Légionnaire de base — même racine qu'en anglais, se lit naturellement
  en français) ; Flesh Harvester → Moissonneur de Chair (texte intégral
  disponible) ; Bitter Duty → **Devoir Amer** (déjà établi, Death Guard,
  Empoisonneur Mortus) : nom seul réutilisé tel quel, pas de texte
  intégral connu pour cette règle précise.
- Deflagrate (règle d'arme sans paramètre X, distincte de la règle déjà
  établie « Déflagration (X) ») → traduit simplement « Déflagration »
  (sans parenthèse) : `trouverDefinitionRegle` normalise en retirant tout
  suffixe entre parenthèses des deux côtés de la comparaison, donc ce nom
  raccourci retombe bien sur l'entrée existante « Déflagration (X) » du
  glossaire — pas besoin d'une deuxième entrée.
- Tainted (adjectif, Word Bearers) → Souillé(e) (déjà établi via Griffe/
  Serres Souillées) ; Tainted weapon → **Arme Souillée** (nouvelle arme
  Legacy, profil complet dans `armes-data.js`, distincte du générique
  « Force weapon » → **Arme de force** sans profil, texte d'équipement
  simple déjà réutilisé ailleurs dans `unites-data.js`, ex. Diaboliste).
- Warpfire (Word Bearers) → **Feu Warp** (déjà établi via Canon/Brasier
  à Feu Warp du Dreadnought Mhara Gal) ; Warpfire pistol/blaster/
  projector → Pistolet/Blaster/Projecteur à Feu Warp (profils complets
  ajoutés à `armes-data.js` ; Pistolet et Blaster câblés sur des Unités
  précises, Projecteur ajouté à l'Arsenal mais pas encore câblé sur une
  Unité générique de Légion — gap documenté en commentaire, voir plus
  bas la note sur `requiertLegion`).
- **PDF source de la « Legacies of the Age of Darkness » retrouvables en
  local** (confirmé pour Word Bearers et Blood Angels) sous
  `C:\Users\jean\Downloads\legacies\Fait\<legion>.pdf` /
  `<legion>_wargear.pdf` : si le PDF n'est plus dans le contexte de la
  conversation (ex. après une compaction), les relire directement depuis
  ce dossier avec `Read` plutôt que d'improviser des profils/statistiques
  à partir du seul résumé de conversation — la synthèse peut affirmer
  qu'un texte de règle « est disponible » alors qu'il n'est en réalité
  plus dans le contexte courant.
- Ofanim (Blood Angels) : « Court » → **Cour** (« Ofanim Court » → « Cour
  des Ofanim », traduction naturelle plutôt que littérale, sur le même
  principe que « Cercle de Cendres » pour « Ashen Circle ») ; Blade of
  judgement → Lame du Jugement (nouvelle arme, profil complet) ; Shadows
  of Judgement → Ombres du Jugement (texte intégral disponible) ;
  Duellist's Edge (X) → **Atout du Duelliste (X)**, déjà établi (armes de
  personnage Sons of Horus/Ultramarines/Thousand Sons notamment) — ne pas
  créer de nouvelle entrée. Cour des Ofanim et sa variante avec Sacs de
  Saut sont deux Unités **séparées** (pas deux `variantes` d'une seule
  Unité) car ce sont deux fiches distinctes du PDF (titre, coût et
  composition propres), sur le même principe que Diaboliste vs Diaboliste
  en Armure Terminator vs Diaboliste Monté (Word Bearers) — à la
  différence du cas « une Figurine peut être remplacée par X pour +Y
  Points » sur UNE MÊME fiche, qui reste modélisé en 2 `variantes` d'une
  seule Unité (voir Diaboliste avec Jump Pack, Cataphractii/Tartaros).
  Une restriction « 0-1 » à cheval sur les deux fiches (texte : « une
  seule Cour des Ofanim, avec ou sans Sacs de Saut, par Armée ») ne peut
  pas être modélisée par le champ `maxParArmee` existant (qui ne limite
  qu'un `id` à la fois, voir `uniteAccessible`, `js/unites.js`) : chaque
  Unité porte donc son propre `maxParArmee: 1` indépendant — gap
  documenté, rien n'empêche encore de prendre les deux simultanément tant
  que cette restriction croisée n'est pas implémentée dans le moteur.
- **Dawnbreaker Cohort (Blood Angels Legacy Wargear)** : unité mentionnée
  dans le wargear PDF (échange lance énergétique en étoile filante contre
  paire de lames équinoxes) mais **absente de `unites-data.js`** — ni le
  livre de base ni aucune légion précédente ne l'a introduite sous ce nom
  ni sous une traduction plausible (vérifié par recherche). Contrairement
  aux autres unités visées par un wargear PDF (toujours déjà présentes),
  celle-ci n'a pas de fiche à mettre à jour : gap documenté, à combler
  seulement si le proprio fournit la fiche de base de cette unité.
- Red Hand (World Eaters, surnom informel de la marque) → **Main Rouge**
  (nom d'Unité) ; Blood Hand (nom formel de la même marque, dans le texte
  de la Règle Spéciale) → **Main Sanglante** — deux mots anglais distincts
  (Red / Blood) pour la même marque, donc deux traductions distinctes
  conservées volontairement, sur le même principe que la fiche originale
  qui emploie elle-même les deux formulations. Bearers of the Blood Hand
  → Porteurs de la Main Sanglante (texte intégral disponible). Blood
  Bonded (rôle Sergent d'escouade) → **Lié du Sang** ; Ravager (rôle
  Légionnaire de base, World Eaters) → **Ravageur** — même mot français
  que « Reaver » (Sons of Horus, déjà établi) mais mots anglais distincts
  (Ravager ≠ Reaver) et Légions différentes : pas un conflit, juste une
  coïncidence de traduction acceptée.
- **Red Butchers (World Eaters Legacy Wargear)** : comme Dawnbreaker
  Cohort, unité mentionnée dans le wargear PDF (Devoured, échanges de
  haches énergétiques de boucher) mais absente de `unites-data.js` —
  aucune trace sous ce nom ni sous une traduction plausible (« Bouchers
  Rouges », « Dévoré ») : gap documenté, pas de fiche à mettre à jour.
- Destroyer missile launcher (World Eaters, avec Missile Rad) → réutilise
  le profil déjà existant « Lance-missiles de Destructeur — Missile Rad »
  (Dark Angels/Ultramarines Destroyer Squads) : mêmes stats exactement,
  aucun nouveau profil créé.
- Armurerie générique World Eaters (wargear PDF : tout Modèle de
  Sous-type Commandement/Champion/Spécialiste/Sergent peut échanger son
  arme énergétique contre une arme des Caedere, +10 Points) : non câblée
  sur la liste d'équipement générique de Légion, seulement sur les
  Unités qui la mentionnent explicitement (Escouade Saccageuse, Escouades
  de Destructeurs Main Rouge) — même gap que « Tainted weapon » Word
  Bearers, voir plus haut la note sur `requiertLegion`.
- **Escouade de Terminator Deliverers (Raven Guard)** : déjà entièrement
  transcrite lors d'une session précédente (avant celle-ci) — relue
  contre le PDF `raven_guard.pdf` fourni de nouveau et confirmée exacte
  (profils, Règles Spéciales, coûts, toutes les options du wargear déjà
  câblées) : aucune modification nécessaire. Utile de vérifier ainsi
  avant de recréer une Unité qui « semble » nouvelle mais existe déjà.
- Charnabal sabre → réutilise le profil déjà existant « Sabre charnabal »
  (catégorie « Armes Charnabales » de l'Arsenal, Atout du Duelliste (1)) :
  ajouté en option sur l'Escouade de Mor Deythan (Raven Guard), qui n'a
  pas d'arme de mêlée de base.
- Stormseer (White Scars) → **Devin de l'Orage**, unité de base déjà
  établie (`devin-de-lorage`) ; les 3 fiches Legacy (with Jump Pack /
  Mounted / in Terminator Armour) suivent exactement son schéma
  (équipement Bâton de force déjà existant, options Disciplines
  Psychiques `multi` max 2 : Appel de l'Orage/Divination/Thaumaturgie/
  Télépathie — Stormcalling/Divination/Thaumaturgy/Telepathy, déjà
  établies) mais **chaque fiche Legacy indique ses propres coûts pour
  les mêmes Disciplines**, différents de ceux de la fiche de base
  (95 Points) : ne pas essayer de les harmoniser, transcrire tels quels
  fiche par fiche.
- Power lance → Lance énergétique, Power maul → Masse énergétique (tous
  deux déjà existants, armes génériques réutilisées) ; Power glaive →
  **Vouge énergétique** (déjà existant, arme de base du Keshig d'Ébène/
  Ebon Keshig, profil complet réutilisé tel quel — ne pas confondre avec
  une improvisation « Glaive énergétique »).
- Falcon's Claw(s) → **Griffe(s) du Faucon** ; Smokescreen (Trait, pas
  Règle Spéciale à encart) → réutilise « Écran de Fumée », déjà établi
  comme Trait/Règle Spéciale de réaction ; Cyber-hawk → **Cyber-faucon**
  (nom seul, sur le même principe que Cyber-familier, pas de profil
  connu).
- **Piège `remplace` sur une Figurine unique d'une Escouade à plusieurs
  rôles** : `remplace: "Nom exact"` (`choix`) retire ce nom de la liste
  `equipement` **affichée pour toute l'Unité** (un seul tableau plat, pas
  par rôle — voir `retirer()`/`construireEquipement()`,
  `js/unites.js`). Si l'objet visé est partagé par toutes les Figurines
  (ex : « Épée tronçonneuse » sur une Escouade de Destructeurs, «
  Bolter » sur une Escouade d'Éclaireurs) et que l'option ne vise QU'UN
  rôle (ex : le Sergent), poser `remplace` ferait disparaître l'objet de
  la fiche pour toute l'Escouade, pas seulement le Sergent. Le motif
  dominant déjà établi dans ce fichier (dix+ occurrences : Sergent d'
  Escouade Tactique/Support/Recon, Sergent Traqueur, Sergent Vétéran…)
  est `ajoute: true` **sans** `remplace`, avec `prefixeFiche` : l'objet
  de base reste affiché tel quel, et le choix du Sergent s'ajoute en
  ligne séparée préfixée. Ne poser `remplace` que si le nom visé est
  déjà lui-même qualifié comme propre à ce rôle dans `equipement`
  (ex : « Épée tronçonneuse (Sergent Destructeur Némésis seulement) »)
  ou si l'option s'applique réellement à toute l'Unité d'un coup.
  Deux occurrences légataires plus anciennes (Sergent Gardien, Sergent
  Immortel) utilisent encore `remplace` sur un objet partagé — anomalies
  isolées à ne pas reproduire, pas un précédent à suivre.
- Dark Sons of Death (White Scars) → **Fils Sombres de la Mort**
  (surnom informel) ; Karaoghlanlar → gardé tel quel (nom propre/rituel,
  non traduit, sur le principe des titres latins/Légion) ; Dark Son →
  Fils Sombre ; Death's Champion → Champion de la Mort ; Invocation of
  the Razing Tempest → Invocation de la Tempête Ravageuse (texte intégral
  disponible, ajoutée à `regles-data.js` ; cite le Pouvoir Psychique
  « Call of the Wind » → **Appel du Vent** sans lui créer d'entrée dédiée,
  faute de texte intégral connu pour ce Pouvoir précis — même principe
  que les Pouvoirs Psychiques d'Arcane de Prospero, Thousand Sons).
- **Transporteur Thunderhawk (Legacies, générique « Legio Astartes »)** :
  pas de champ `legion` (comme l'Escorteur Thunderhawk et le Falchion
  déjà existants) — accessible à toutes les Légions, pas réservé à une
  Légion précise. Distinct de l'Escorteur Thunderhawk déjà présent
  (Règle Spéciale propre « Baie de Transport Thunderhawk », capacité de
  transport 32) : le Transporteur a sa propre Règle Spéciale « Baies de
  Transport Auxiliaires » (texte intégral disponible, capacité de
  transport 20, peut aussi embarquer des Véhicules Rhino/Land Raider).
  Le PDF source nomme la Règle différemment dans le résumé d'en-tête
  (« Auxiliary Vehicle Bays ») et dans l'encart complet (« Auxiliary
  Transport Bays ») : le nom de l'encart complet fait foi, comme
  toujours dans ces PDF Legacies. Land Raider Carrier → réutilise
  « Porteur Land Raider » déjà existant ; Land Raider Explorator → gardé
  tel quel (déjà existant).
- **Escadron de Motos d'Assaut / Escouade d'Éclaireurs (Legacies,
  génériques « Legio Astartes »)** : comme le Transporteur Thunderhawk,
  pas de champ `legion` — accessibles à toutes les Légions. Fait notable :
  ni « Attack Bike Squadron » ni « Scout Squad » n'existaient déjà dans
  ce fichier avant leur ajout (vérifié par recherche) alors que ce sont
  des unités très courantes du livre de base — preuve que ce fichier ne
  couvre que les unités effectivement utilisées jusqu'ici, pas
  l'intégralité du livre de base. `optionBaionnette()` (fabrique
  existante) réutilisée telle quelle pour l'option baïonnette/baïonnette
  tronçonneuse de l'Escouade d'Éclaireurs.
- **Escouade Terminator de Siège Tartaros / Escouade Terminator
  Indomitus / Escouade de Destructeurs Mortalis / Escouade de
  Destructeurs d'Assaut (Legacies, génériques « Legio Astartes »)** :
  aucune n'existait déjà ; mêmes stats que l'Escouade Terminator Tartaros
  déjà existante réutilisées pour le rôle Tartaros (vérifiées identiques
  contre le PDF). Proteus assault cannon → nouvelle arme **Canon
  d'assaut Proteus** (profil complet ajouté à `armes-data.js`, famille
  Iliastus) ; Proteus pattern storm shield → **Bouclier tempête modèle
  Proteus** (Sauvegarde Invulnérable 4+ et Trait Bouclier déjà établi,
  décrits en texte dans l'option plutôt qu'une entrée `regles-data.js`
  dédiée, faute de mécanique de bonus de Sauvegarde conditionnelle
  modélisable autrement dans ce fichier — même limitation que les
  promotions Procurateur/Sergent déjà rencontrées). « Legion Equipment
  list » (Nuncio-vox/Scanner augure) réutilisée par analogie avec les
  options « Équipement de Légion (2e Vétéran) » déjà établies ailleurs,
  faute de liste dédiée nommée dans `LISTES_EQUIPEMENT`.

- **Basilisk de Légion / Medusa de Légion (Legacies, génériques « Legio
  Astartes »)** : distincts des « Char d'Artillerie Basilisk »/« Char
  d'Artillerie Medusa » déjà existants (`sa-basilisk`/`sa-medusa`,
  `faction: "solar-auxilia"`) — même nom d'arme mais Figurine et
  faction différentes (BS3/PC5 chez Solar Auxilia contre BS4/PC4 ici),
  d'où un nom distinct « ... de Légion » pour éviter un doublon de `nom`
  dans le sélecteur d'Unité. Canon Earthshaker et Mortier Medusa déjà
  existants dans `armes-data.js` (stats identiques vérifiées contre le
  PDF) : aucune nouvelle arme créée, juste réutilisés avec le suffixe
  « d'Axe Central » déjà établi.

- **Escouade de Vétérans Breacher / Escouade de Vétérans d'Appui
  Lourd (Legacies, génériques « Legio Astartes »)** : Breacher (rôle de
  Vétéran) **reste en anglais**, non traduit — demande explicite du
  proprio, renommé depuis le coinage initial « Perce-lignes » (sens :
  « linebreaker », toujours visible dans le texte de fluff : « employés
  offensivement comme briseurs de ligne »), sur le même principe que
  « Jump Pack » resté en anglais (voir plus haut). Disintegrator blaster →
  réutilise **Éclateur désintégrateur** déjà existant (même famille que
  Éclateur à plasma = Plasma blaster, confirmant que « Éclateur » est
  déjà le terme établi pour « blaster » dans ce fichier, pas seulement
  pour le plasma) ; Heavy disintegrator → **Désintégrateur lourd** déjà
  existant. « Up to two Breacher Veterans/Support Veterans... for every
  five Models » → `parTranche: 5, parTrancheMax: 2`, exemple concret de
  la fabrique déjà documentée dans ce fichier (voir plus haut, section
  Schéma d'une Unité). « Legion Equipment list » → même solution de
  repli Nuncio-vox/Scanner augure que pour l'Escouade de Destructeurs
  Mortalis.

- **Escouade de Commandement Prétorienne sur Jetbikes Scimitar / Outrider
  (Legacies, génériques « Legio Astartes »)** : Chosen (rôle de Suite
  d'État-major) → réutilise **Élu** déjà établi (Escouade d'État-Major
  Cataphractii/Tartaros/à Réacteurs/Prétorienne) ; Praetorian → **Prétorien(ne)**
  déjà établi. Attention au Type : ni la Championne Scimitar ni la
  Championne Outrider n'ont le Sous-type Sergent sur leur fiche (juste
  Champion), à la différence des autres Escouades d'État-Major du
  fichier qui ont presque toutes Champion+Sergent — vérifié deux fois
  contre le PDF avant de conclure que ce n'était pas un oubli de
  transcription.

- **Land Raider Achilles / Bélier d'Assaut Caestus (Legacies, génériques
  « Legio Astartes »)** : Quad launcher → réutilise **Lanceur
  quadruple** déjà existant (profil multi-modes Frag/Brisant/Cartouches
  à phosphex, utilisé aussi par un châssis Rapier) ; Magna-melta cannon
  → réutilise **Magnacanon à fusion** déjà existant (aucun encart de
  stats propre fourni sur la fiche Caestus, contrairement à d'autres PDF
  Legacies — reconstitution par correspondance de nom avec un profil
  déjà établi, pas d'invention). `optionPivotLegion()` et
  `optionsMissileEtProjecteurs()` (fabriques déjà existantes, déjà
  utilisées par le Porteur Land Raider) réutilisées telles quelles pour
  la liste d'Armes sur Pivot de Légion + missile traqueur/projecteurs du
  Land Raider Achilles.

- **Praetor sur moto (Legacies, générique « Legio Astartes »)** : « Praetor »
  gardé tel quel, non traduit — confirmé par l'Unité de base `praetor`
  déjà existante (« Praetor », « Praetor en Armure Terminator », etc.,
  jamais « Préteur » dans ce fichier). Paragon blade → Lame de parangon,
  Archaeotech pistol → Pistolet archéotech (tous deux déjà existants,
  réutilisés à l'identique — même liste `LISTES_EQUIPEMENT.officier`
  déjà utilisée par le Praetor de base). `optionBombesFusion()` (fabrique
  existante, +5 Points) réutilisée telle quelle.

- **Dreadnought Castra Ferrum (Legacies, générique « Legio Astartes »)** :
  suit le même schéma « bras n°1/bras n°2 » que le Dreadnought Contemptor
  déjà existant (`equipement` par défaut = deux Canon à bolts Gravis
  gratuits, `choix` par bras avec `remplace`, options `paire` pour les
  combos à prix réduit) — repris quasiment à l'identique, seule
  différence : moins d'options d'armes de tir disponibles par bras
  (pas de Canon à conversion/Couleuvrine volkite jumelée/Canon d'assaut
  Kheres sur cette fiche). Gravis missile launcher → nouvelle arme
  **Lance-missiles Gravis** (profils Frag/Krak, ajoutée à
  `armes-data.js`) ; tous les autres profils d'armes de bras déjà
  existants, réutilisés tels quels.

- **Techno-arcane Majeur / Trait de Faction Mechanicum (Liber
  Mechanicum p. 13/45-51)** : bug corrigé (2026-07-25) — l'option
  `optionTechnoArcane()` (`js/unites-data.js`) posait `remplace:
  "[Mechanicum]"`, mais ce mécanisme (`equipementFinal`,
  `optionRealisable`, js/unites.js) n'opère que sur le tableau
  `equipement`, jamais sur `traits` : comme « [Mechanicum] » n'apparaît
  QUE dans `traits`, `optionRealisable` retournait toujours `false` et
  le menu déroulant restait grisé en permanence sur toute Unité
  générique (Archimagos, Magos, Technoprêtre, Manipule de Gardiens
  Scyllax, Manipule Servo Echidnax, Armigère Moirax — le Convoyeur
  Blindé Triaros avait carrément l'option manquante). Corrigé en
  retirant `remplace` et en ajoutant `horsEquipement: true` (indicateur
  propre à cette option, lu seulement par `equipementFinal` pour la
  sauter entièrement) + `obligatoire: true` (le texte du livre — « les
  Unités sélectionnées doivent avoir une variante du Trait de Faction
  Mechanicum » — en fait un choix obligatoire par Unité, sans entrée
  « — Aucun — »). Le remplacement de « [Mechanicum] » par le
  Techno-arcane effectif (fixe ou choisi) se fait maintenant à
  l'affichage, dans `construireFiche` via le nouvel helper
  `traitFactionMechanicumDe(unite, instance)` (js/unites.js). Toute
  nouvelle Unité Legacy Mechanicum générique doit inclure
  `optionTechnoArcane()` dans ses `options` dès qu'elle porte
  « [Mechanicum] » dans `traits` — sinon même bug que le Triaros.
  Chaque Techno-arcane Majeur distinct présent dans l'Armée (pas
  seulement un par Armée : le choix est par Unité, voir le tutoriel
  Mechanicum de `pages/unites.html`) est listé sur la page de garde du
  PDF/Word avec son texte complet (`contenuTraitsFactionMechanicumActuels`,
  js/unites.js — même principe que Doctrine de Cohorte/Désignation de
  Legiones Auxilia, mais potentiellement plusieurs entrées).
  La contrainte d'uniformité — « toutes les Unités d'un même
  Détachement Auxiliaire ou d'Apex doivent avoir la même variante »
  (mais pas dans un Détachement Principal/Allié/de Seigneur des
  Batailles, où les Unités peuvent différer) — EST vérifiée (demande
  explicite du proprio de rester fidèle à la règle plutôt que de
  simplifier en un choix unique d'Armée façon Légion) :
  `caseAccepte()` (js/organigramme.js) refuse désormais qu'une Unité à
  Techno-arcane FIXE (nom déjà en dur dans `traits`) rejoigne un
  Détachement Auxiliaire/d'Apex dont une autre Unité a déjà établi un
  Trait différent (`traitFactionMechanicumEtabliDe`) ; une Unité
  générique (« [Mechanicum] ») reste toujours acceptée mais
  `synchroniserConfig` (js/unites.js), via le hook
  `traitFactionMechanicumRequisPour` (js/organigramme.js), aligne puis
  grise automatiquement son option "techno-arcane" sur le Trait déjà
  établi par les autres Unités du même Détachement — pas de blocage
  frustrant, juste un alignement forcé. Le changement de Techno-arcane
  d'une Unité déclenche un rafraîchissement global
  (`actualiserSelectsCases`), pas seulement local, pour propager
  immédiatement l'alignement aux autres cartes du même Détachement.

- **Nouvelle Faction « Conclaves Skitarii » (`faction: "skitarii"`,
  PDF officiel GW « Conclaves Skitarii » 2025, déjà en français —
  PAS une traduction Legacies, `legacy` non posé)** : 8 Unités de base
  ajoutées (Maréchal des Pérégrins de Combat Skitarii → État-major,
  Corpus de Pérégrins de Combat Skitarii → Troupes, Ost de Glaneurs →
  Appui, Automate-stratos Vultarax Skitarii → Attaque Rapide, Convoyeur
  Blindé Triaros Skitarii → **Transports Lourds** (piège vécu : la
  `categorie` doit être la forme PLURIELLE déjà établie dans ce
  fichier, pas « Transport Lourd » singulier comme la demande orale du
  proprio le suggérait — sinon aucune Case de l'organigramme ne
  correspond et l'Unité reste indisponible), Char d'Assaut Karacnos
  Skitarii/Char de Combat Krios Skitarii/Chasseur de Chars Krios
  Venator Skitarii → Blindés. Faction enregistrée dans `FACTIONS`
  (js/organigramme.js) et `factionCroisadeParDefaut()` étendue (partage
  l'Organigramme de Force de Croisade générique avec Legio Astartes/
  Mechanicum/Solar Auxilia) ; pas d'entrée dans
  `FACTIONS_AVEC_SOUS_IDENTITE` (pas de subdivision type Légion/
  Maisonnée/Doctrine, comme Mechanicum) ; `LIBELLES_FACTION`
  (js/unites.js) complété.
  Toutes les Unités portent `["[Allégeance]", "[Skitarii]"]` dans
  `traits` — aucune n'a de Trait de Faction FIXE dans ce PDF (réservé
  aux futures publications propres à un Conclave). Le remplacement de
  « [Skitarii] » par un Trait de Faction (Acquisitor/Expurgator/
  Vindicator/Flagellator, PDF p. 3) est modélisé par un mécanisme
  PARALLÈLE et INDÉPENDANT du Techno-arcane Majeur Mechanicum (mêmes
  noms de fonctions transposés : `TRAITS_FACTION_SKITARII`,
  `optionTraitSkitarii()` dans js/unites-data.js ; `traitFactionSkitariiDe`
  dans js/unites.js ; `traitFactionSkitariiEtabliDe`/
  `traitFactionSkitariiRequisPour`/bloc `caseAccepte` dans
  js/organigramme.js) — **volontairement dupliqué plutôt que fusionné**
  avec le mécanisme Mechanicum, cohérent avec la préférence déjà
  établie de ce fichier pour des mécanismes parallèles explicites
  plutôt qu'une abstraction partagée pour ces règles propres à une
  Faction. Différence de portée avec Mechanicum : le PDF Skitarii dit
  « Toutes les Unités sélectionnées dans un Détachement DONNÉ doivent
  avoir le même Trait de Faction » (tout Détachement), alors que la
  règle Mechanicum ne vise que les Détachements Auxiliaires/d'Apex — le
  bloc `caseAccepte` et `traitFactionSkitariiRequisPour` n'ont donc pas
  le filtre `type.famille` que porte leur équivalent Mechanicum.
  Vindicator/Flagellator sont réservés à une Allégeance (Loyaliste/
  Renégat) : nouveau champ `requiertAllegeance` posé sur une entrée
  individuelle de `choix` (pas sur l'option entière, à la différence de
  `requiertLegion`) — filtré à la construction du `<select>` ET
  re-filtré à chaque resynchronisation via le nouvel helper
  `peuplerChoixSelect(select, opt)` (js/unites.js), sinon la liste
  d'`<option>` reste figée sur l'Allégeance en vigueur au moment de la
  création de la carte et ne réagit pas à un changement d'Allégeance
  ultérieur dans les paramètres de la partie ; `synchroniserConfig`
  retombe aussi sur l'indice 0 si la valeur enregistrée n'est plus
  valide pour l'Allégeance courante.
  **Bug découvert et corrigé pendant l'implémentation** (avant de
  committer) : en copiant tel quel le motif d'exclusion de
  `traitFactionMechanicumEtabliDe(det, excluUid)` (qui exclut l'Unité
  demandeuse et retourne le Trait de la première AUTRE Unité), deux
  Unités Skitarii **génériques** placées dans le même Détachement se
  « contraignaient » l'une l'autre en boucle : changer le Trait de
  l'une la faisait aussitôt revenir à l'indice 0 dès la resynchro-
  nisation suivante, car elle se retrouvait « en désaccord » avec
  l'autre Unité encore à sa valeur par défaut — rendant le menu
  déroulant inutilisable dès que 2 Unités génériques cohabitent (le cas
  le plus courant ici, puisqu'aucune Unité Skitarii de ce PDF n'a de
  Trait fixe pour servir d'ancre stable, contrairement au Mechanicum où
  une Unité à Techno-arcane fixe sert presque toujours d'ancre). Corrigé
  en restreignant `traitFactionSkitariiEtabliDe` à ne compter QUE les
  Unités à Trait FIXE (`!occ.unite.traits.includes("[Skitarii]")`)
  comme « établissant » une contrainte — deux Unités génériques ne se
  bloquent/n'alignent donc jamais mutuellement, exactement comme
  `caseAccepte` ne bloquait déjà qu'un Trait fixe différent, jamais une
  Unité générique. À reproduire si un futur mécanisme de Trait de
  Faction par Unité est ajouté pour une Faction sans aucune Unité à
  Trait fixe.
  Armes/règles réutilisées telles quelles (stats identiques au PDF,
  vérifiées avant tout ajout) : Pistolet archéotech, Missile traqueur
  (nouvelle entrée « (Skitarii) » créée quand même, car le Trait
  affiché diffère — « Missile Guidé » sur l'entrée nue contre
  « Missile » ici — même raison que « Missile traqueur (Mechanicum) »
  déjà existant), Canon à bolts Mauler jumelé, Arquebuse volkite,
  Batterie de mortiers Karacnos, Mousquet à foudre, Canon à foudre,
  Éclateur à irradiation, Mousquet laser, Pulsar pilonneur, Électro-
  éclateur, Lance-missiles Vultarax, Épée énergétique. Nouvelles armes
  créées (aucun profil existant ne correspondait) : Arme de poing volt,
  Arquebuse volt¹ (profil Tir ET Mêlée, note de bas de tableau « ¹ »
  déjà établie type Découpeur laser), Charges Rad, Grenades disrup-
  trices, Sceptre auctorite, Griffe de phase, Bâton foudroyant, Serres
  dendrites (Skitarii) (profil Serres dendrites déjà existant, utilisé
  par l'Escadron de Stratos Vultarax, mais stats différentes ici).
  Nouvelles Règles Spéciales (texte intégral déjà dans le PDF, ajoutées
  à `regles-data.js`) : Icône d'Autorité (REGLES_ARMES), Suiveurs
  Zélés, Acquisitor, Expurgator, Vindicator, Flagellator, Maréchal Élu
  (Réaction Avancée, condensée Déclencheur/Coût/Cible/Processus en un
  seul texte comme les autres Réactions Avancées déjà transcrites).
  **Addendum au Liber (même PDF, p. 12) : profil de l'Ost de Myrmidons
  Destructors (Mechanicum, Liber Mechanicum p. 29) mis à jour** —
  CT/Vo/Int en baisse pour Destructor ET Seigneur Destructor (l'ancien
  profil donnait en plus, par erreur, des caractéristiques CC/A
  identiques aux deux rôles alors que le Seigneur Destructor doit être
  strictement supérieur — corrigé au passage), équipement de base
  simplifié (couleuvrine volkite déplacée de l'équipement fixe vers un
  choix d'arme désormais **obligatoire** à 4 options dont Engin à
  irradiation, nouvellement ajouté), et « Méditation Martiale »
  précisée « Seigneur Destructor seulement ». `equipement` garde
  « Lance-choc (Tir) » (nom déjà établi dans l'Arsenal) plutôt que
  « Chargeurs-choc » (nom donné par l'Addendum) : l'Addendum précise
  lui-même qu'aucun nouveau profil d'Arme n'est introduit, donc simple
  reformulation du même objet, pas une Arme distincte.

- **Escouade Inductii (PDF dédié « Legacies of the Age of Darkness : The
  Legiones Inductii », toutes Légions sauf II/XI — 18 Unités
  génériques, une par Légion)** : Troupe volontairement moins
  expérimentée que les Légionnaires de ligne. **PAS `legacy: true`**
  malgré le nom de la collection PDF source (« Legacies of the Age of
  Darkness ») — corrigé après coup sur demande explicite du proprio
  (2026-07-26) : `legacy: true` reste réservé à ce que le proprio
  considère comme des Unités Legacy au sens du site (probablement les
  ajouts vraiment optionnels/de complément), pas à toute Unité dont
  le PDF source porte ce nom de collection — ne pas déduire ce champ
  du seul titre du PDF, redemander en cas de doute plutôt que de
  supposer. Nouveau champ
  **`interditCasePrincipale: true`** (posé sur chacune des 18 Unités,
  `js/unites-data.js`) — demande explicite du proprio : ne peut jamais
  occuper de Case Principale d'Organigramme de Force, quelle qu'en soit
  la Légion. Vérifié dans `caseAccepte()` (js/organigramme.js), juste
  après le filtre de Légion : seul point d'entrée pour la disponibilité
  ET l'assignation d'une Unité à une Case (`casesLibresPour` et
  `assigner` passent tous deux par lui), donc un seul endroit à modifier
  suffit. À réutiliser tel quel pour toute future Unité qui devrait être
  exclue des Cases Principales sans changer sa Catégorie.
  Distinct de la propre Règle Spéciale Inductii du PDF (« ne peut
  jamais servir à choisir un Prime Advantage / remplir un Prime Force
  Organisation Slot ») : cette dernière mécanique n'est **pas**
  modélisée sur ce site (comme déjà noté plus haut à propos du Paladin
  de l'Hekatonystika). Faute de traduction déjà établie pour « Prime
  Advantage »/« Prime Force Organisation Slot », rendus dans le
  glossaire (`js/regles-data.js`) par **« Avantage Principal »**/
  **« Case d'Organigramme de Force Suprême »** — demande explicite du
  proprio (2026-07-26) de réutiliser « Avantage Principal » malgré
  l'homonymie avec les Avantages Principaux des Cases Principales déjà
  modélisés sur ce site (`caseOrga.principale`) : les deux désignent
  bien des mécaniques distinctes (Prime Advantage n'est pas modélisé
  ici), mais partagent volontairement le même nom français. Une
  première version de cette session avait inventé « Avantage Suprême »
  pour éviter la collision — remplacé par cette correction, ne pas
  revenir en arrière.
  Schéma : `variantes` reste à **UN SEUL** élément par Unité — `profil`
  singulier pour 16 des 18 (une seule Figurine « Inductii »),
  `profils` (pluriel) pour Ultramarines (Inductii + Evocatus Intendant)
  et Salamanders (Inductii + Inductii Master) : ces deux rôles restent
  optionnels dans le texte du PDF (« may be replaced... for +X Points »,
  pas une composition mixte obligatoire comme Sergent+Troupier d'une
  Escouade Tactique), mais le PDF lui-même affiche systématiquement les
  deux lignes de profil côte à côte dans son tableau de Caractéristiques
  — `construireTableProfil` (js/unites.js) affiche `profils` sans
  condition liée aux options choisies, donc `profils` reste la
  modélisation fidèle du tableau imprimé, l'option `case` séparée
  (« Un Inductii remplacé par un Evocatus Intendant/Inductii Master »)
  gérant seulement le surcoût. Nouvelle fabrique **`optionsEquipementLegion(prefixeFiche)`**
  (js/unites-data.js, à côté de `optionBaionnette`) : factorise le
  motif « Legion Equipment list » (Nuncio-vox/Scanner augure, jusqu'à
  deux Figurines) déjà écrit à la main une dizaine de fois ailleurs
  dans ce fichier (ex. Escouade Tactique) — les 18 Escouades Inductii
  en avaient toutes besoin à l'identique, d'où la factorisation
  (jugée justifiée ici malgré la préférence habituelle du fichier pour
  la répétition littérale, vu le nombre d'occurrences strictement
  identiques introduites d'un coup). Killer's blade (Night Lords) →
  nouvelle arme **Lame du tueur** (`js/armes-data.js`, catégorie Armes
  Exotiques et Diverses (Mêlée), profil ["I","A","F","-","1"] : notation
  déjà établie pour « utilise les Caractéristiques M/A/F propres au
  porteur, sans modificateur » — voir par ex. Épée énergétique Argean).
  Rotor cannon → réutilise **Canon rotor** déjà existant (profil
  portable de la catégorie Armes Auto, distinct du Canon rotor Punisher/
  de défense). Ravening Madmen (World Eaters, renvoi « voir page 192 du
  Liber Hereticus ») et Heedless → **Insouciant** (World Eaters) : pas
  de texte intégral fourni par ce PDF (juste nommées dans la liste des
  Règles Spéciales, sans encart) — laissées en texte simple dans
  `regles:`, sans entrée de glossaire, conformément à la règle 6
  ci-dessus.

Cette liste s'allonge à chaque légion : la compléter au fil de l'eau
plutôt que de la laisser devenir obsolète.
