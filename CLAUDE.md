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
  Mechanicum de `pages/construction-liste.html`) est listé sur la page de garde du
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

- **Unités montées Outrider/Jetbike Scimitar (Praetor, Champion de Légion,
  Maître des Signaux, Seigneur de Forge, Primus Medicae, Delegatus, Devin
  de l'Orage, Tireur de Runes, Porte-Parole des Morts, Diaboliste — et
  désormais Centurion, Ésotériste, Chapelain, Héraut) : bug corrigé
  (2026-07-29) — leur `equipement` listait en dur les DEUX armes propres à
  chaque monture (« Bolter jumelé (Outrider seulement) » ET « Bolter lourd
  (Jetbike Scimitar seulement) »), affichées simultanément sur la fiche
  quelle que soit la `variante` choisie, le texte entre parenthèses n'étant
  que descriptif (comme documenté pour les options `case`) et jamais
  effectivement filtré par le moteur. Corrigé en généralisant la
  convention déjà utilisée sur les OPTIONS (`opt.variantesExclues`) aux
  entrées d'`equipement` elles-mêmes : une entrée peut désormais être un
  objet `{ nom, variantesExclues }` plutôt qu'une simple chaîne (voir
  `equipementFinal`, js/unites.js) — l'entrée disparaît de la fiche si la
  `variante` actuelle figure dans `variantesExclues`, exactement comme
  pour une option. Toutes les Unités listées ci-dessus (dix existantes +
  quatre nouvelles) ont été mises à jour ; leurs options d'échange d'arme
  lourde/jumelée (`fusil-a-plasma-jumele`, `arme-lourde-jetbike`)
  reçoivent au passage `variantesExclues` (grisées sur la mauvaise
  monture) — plusieurs en étaient dépourvues, et certaines (Praetor,
  Devin de l'Orage, Diaboliste) avaient même un `remplace` tronqué (ex :
  `"Bolter lourd"` au lieu de `"Bolter lourd (Jetbike Scimitar
  seulement)"`) qui empêchait l'option de jamais devenir réalisable
  (comparaison stricte dans `equipementFinal`/`optionRealisable`) : corrigé
  au passage. Toute nouvelle Unité Legacy sur ce même moule (Outrider OU
  Jetbike Scimitar) doit reprendre cette forme objet dès sa création.
  Au passage, `champion-monte` (Champion de Légion sur Scimitar) avait une
  Règle Spéciale en trop sur la variante Outrider (« Attaque de Flanc »,
  absente de la fiche source) et une traduction obsolète de Firestorm
  (« Tempête de Feu » au lieu de « Gabarit de Souffle », déjà établi) :
  corrigées. Centurion/Ésotériste/Chapelain/Héraut Montés créés depuis un
  PDF Legacies générique (mêmes gabarits Outrider/Scimitar Jetbike que les
  dix ci-dessus) ; l'Ésotériste Monté n'a, contrairement aux autres, ni
  échange d'arme lourde sur la variante Jetbike Scimitar ni bombes à
  fusion ni Contournement sur sa variante Outrider — fidèle à sa fiche
  source, ne pas essayer de l'harmoniser avec les autres. Héraut Monté
  porte une nouvelle « Icône d'Allégeance » (texte simple, pas d'entrée de
  glossaire, distincte de l'« Icône du Primarque » du Héraut de base).

- **Artifice de Nocturne (Arsenal des Salamanders, Liber Astartes/
  Hereticus p. 263 — livre de base, PAS un PDF Legacies)** : « Toute
  Figurine de Sous-type État-major/Champion/Spécialiste (et Sergent
  pour l'arme énergétique/le gantelet, PAS pour le Marteau Thunder) qui
  a le Trait Salamanders » peut échanger son arme énergétique/gantelet
  énergétique/Marteau Thunder contre sa version forgée (+5/+10/+10
  Points) ; « Toute Figurine de Sous-type Sergent » peut échanger son
  lance-flammes léger/normal/lourd contre sa version forgée (+5/+10/+10
  Points). Les 7 profils forgés existaient déjà dans `armes-data.js`
  (jamais câblés sur aucune Unité générique) — câblés cette session-ci
  sur ~95 sites à travers tout `unites-data.js` (toutes Légions, filtré
  dynamiquement par Légion choisie — voir mécanisme ci-dessous), pas
  seulement les quelques Unités Legacy propres aux Salamanders.
  **Nouveau mécanisme `requiertLegion` sur une entrée de `choix`**
  (`js/unites-data.js`/`js/unites.js`) : généralise `requiertAllegeance`
  (déjà utilisé pour Vindicator/Flagellator, Skitarii) à la Légion
  actuelle de l'Armée plutôt qu'à l'Allégeance — l'entrée est simplement
  absente du `<select>` tant que `Organigramme.legionActuelle()` ne
  correspond pas (`peuplerChoixSelect`), et la valeur enregistrée
  retombe sur l'indice 0 si la Légion change après coup et invalide le
  choix (nouveau bloc générique dans `synchroniserConfig`, sans
  `id` d'option en dur — contrairement au bloc Skitarii existant qui ne
  visait que `trait-skitarii`). `depuisListes()` propage désormais
  `requiertLegion` de l'item source vers l'entrée `choix` générée.
  Nouvelle constante **`LISTES_ARTIFICE_NOCTURNE`** (`officier`,
  `meleeTerminator`, `meleeTerminatorSergent`, `meleeSergent`,
  `pistolets`) : listes À PART de `LISTES_EQUIPEMENT`, jamais consommées
  par `quantiteDepuisListe` (budget partagé entre TOUTES les Figurines
  d'une Unité, y compris rang-et-fichier) — spread uniquement dans des
  options `choix` déjà scopées à un rôle précis (`prefixeFiche` nommé ou
  Unité à profil unique). `CHOIX_ARMES_ENERGETIQUES` lui-même a aussi été
  étendu directement avec les 4 variantes forgées (+5, `requiertLegion:
  "XVIII"`) : sûr, car jamais consommé par la mécanique `quantite`
  partagée (`eclaterQuantiteArmeEnergetique` repart d'`ARMES_ENERGETIQUES`,
  le tableau de noms bruts, non touché).
  **Deux pièges rencontrés en câblant, à surveiller pour toute
  extension future de ce mécanisme :**
  1. Un même nom de liste partagée (« Armes de Mêlée de Sergent de
     Légion ») est parfois consommé par une Unité dont le Sous-type
     RÉEL n'est PAS Sergent (ex : Optae, Fauteur de Guerre — Sous-type
     État-major utilisant quand même la liste `meleeSergent`) : dans ce
     cas la règle du Marteau Thunder forgé (réservée État-major/
     Champion/Spécialiste, PAS Sergent) est sous-desservie par
     simplification volontaire — `meleeSergent`/`meleeTerminatorSergent`
     n'incluent jamais le marteau, quelle que soit l'Unité qui les
     consomme, plutôt que de vérifier le Sous-type réel unité par
     unité. Accepté comme simplification conservatrice (mieux vaut
     sous-servir que sur-accorder).
  2. Plusieurs options `depuisListes(...)` multi-arguments (ex :
     `depuisListes(LISTES_EQUIPEMENT.meleeSergent,
     LISTES_EQUIPEMENT.pistolets)`, écrites sur plusieurs lignes) ne
     matchent PAS le même motif de recherche/remplacement qu'un appel à
     un seul argument sur une seule ligne — plusieurs sites (dont
     l'Escouade Tactique de base, l'Unité la plus commune du fichier)
     ont été manqués au premier passage et corrigés après coup. Un
     `libelle`/`id` commençant par « Toute Figurine » (option partagée
     par tout le rang-et-fichier, pas juste un rôle nommé) est un signal
     qu'il ne faut PAS y ajouter ces entrées forgées, même si la liste
     sous-jacente (`meleeSergent`, `CHOIX_ARMES_ENERGETIQUES` via
     `.map()`/spread direct) le permettrait techniquement — trois cas
     de ce genre ont été détectés et corrigés après un premier passage
     trop large (Escouade d'Attaque Ravageuse ×2, Escouade de Rapaces
     Nocturnes, Escouade de Lames Palatines ×2, Escouade Terminator
     Justaerin).
  **Gap documenté, volontairement non câblé** : les options à budget
  partagé (`quantiteDepuisListe`/`eclaterQuantiteArmeEnergetique`, qui
  autorisent un échange par Figurine mais sans distinguer Sous-type
  éligible/rang-et-fichier dans le même budget — ex : Escouades
  d'État-Major Terminator Cataphractii/Tartaros, Escouades de Vétérans
  d'Assaut/Prétoriennes) restent hors du mécanisme : les y intégrer
  demanderait de restructurer ces options pour isoler la Figurine
  éligible (Sergent/Champion) du reste de l'Unité, ce qui n'a pas été
  fait ici. De même, le lance-flammes normal/lourd forgé n'a aucun site
  générique sûr identifié (toujours accordé à toute l'Unité ou en
  `quantite` partagée, jamais au seul Sergent) : seul le lance-flammes
  LÉGER forgé a été câblé (liste `pistolets`, ~15 sites).

- **Arsenal des Imperial Fists (Liber Astartes/Hereticus, livre de
  base) : Gantelet énergétique Solarite, Bouclier Storm modèle Vigil et
  Avantage Principal Castellan**, câblés sur le même principe que
  l'Artifice de Nocturne Salamanders ci-dessus (nouvelle constante
  `LISTES_ARSENAL_IMPERIAL_FISTS`, `requiertLegion: "VII"`, 81 sites).
  Différences de contraintes de Sous-type à bien distinguer de
  Salamanders : le Gantelet Solarite est réservé État-major/Champion/
  **Sergent** mais exclut le Spécialiste (Primus Medicae, Apothicaire,
  Mortificator — contrairement au Gantelet forgé Salamanders qui inclut
  le Spécialiste) ; le Bouclier Storm modèle Vigil est réservé
  État-major/Champion (échange bouclier d'abordage/combi-bolter +5, ou
  bouclier de combat +10 — une seule entrée à 10 Points dans
  `LISTES_ARSENAL_IMPERIAL_FISTS.officier` puisque les deux chemins
  totalisent le même coût) SAUF pour les Escouades d'État-Major
  Terminator Cataphractii/Tartaros et Escouades Terminator Cataphractii/
  Tartaros (génériques), où « Toute Figurine » est éligible (rang-et-
  fichier compris) : câblé séparément comme quatre nouvelles options
  `quantite` dédiées (`bouclier-storm-vigil`, gratuit pour Cataphractii,
  +5 pour Tartaros, `remplaceIntegral` sur le chargeur volkite/
  combi-bolter de base, même `groupe: "tir"` que les échanges déjà
  existants) plutôt que d'étendre une liste partagée — c'est la première
  fois que `requiertLegion` est posé sur une option `quantite` plutôt
  que sur une entrée de `choix` ou l'option elle-même : fonctionne assez
  qu'il déclenche la même logique de masquage générique dans
  `synchroniserConfig` (js/unites.js), pas seulement les `choix`.
  Bouclier Storm modèle Vigil n'a pas de profil d'Arme dédié (comme le
  Bouclier tempête modèle Proteus déjà existant, Escouade Terminator
  Indomitus) : l'effet (Sauvegarde Invulnérable 4+, Trait Bouclier,
  Sous-type Lourd) est décrit directement dans le nom de l'item, non
  appliqué mécaniquement (même limitation déjà notée pour Proteus).
  **Castellan** (Avantage Principal, réservé au Centurion de base ayant
  le Trait Imperial Fists, occupant une Case Principale) : nouvelle
  entrée dans `AVANTAGES_PRINCIPAUX` (js/organigramme-data.js), sur le
  même principe que Résistance Anormale (Death Guard, déjà existante,
  même Figurine de Centurion) — texte seul, l'échange forcé
  bolter→bolter lourd/autocanon/Canon d'assaut Iliastus et le scanner
  augure gagné ne sont pas appliqués mécaniquement par le site (comme
  Le Salaire de la Traîtrise, Alpha Legion, déjà existant). À la
  différence de Résistance Anormale, ne vise QUE le Centurion de base
  (pas la variante Terminator/Cataphractii) et n'a pas de restriction
  « une seule fois par Armée » — fidèle à la fiche source, ne pas
  l'ajouter par excès de symétrie avec l'entrée Death Guard.
  Découverte pendant l'audit des ~90 sites déjà câblés pour Salamanders :
  plusieurs unités État-major (Optae, Fauteur de Guerre) utilisent en
  réalité la liste `meleeSergent` malgré un Sous-type État-major — sans
  incidence pour le Gantelet Solarite (Sergent aussi éligible), mais
  cela signifie que ces Unités-là restent, comme documenté plus haut,
  sous-desservies pour le Marteau Thunder forgé Salamanders (réservé
  État-major/Champion/Spécialiste, PAS Sergent) puisque `meleeSergent`
  l'exclut systématiquement — gap déjà accepté, juste reconfirmé ici.
- **Arsenal des Iron Warriors (Liber Astartes/Hereticus, livre de
  base) : broyeur à gravitons**, plus petit chantier que Salamanders/
  Imperial Fists (une seule Figurine d'arme, gratuite, État-major/
  Champion SEULEMENT — ni Spécialiste, ni Sergent). Le profil et le
  commentaire d'éligibilité existaient déjà dans `armes-data.js` (déjà
  câblé en équipement fixe sur Forgeguerre/Manipule du Cercle de Fer,
  mais pas encore en option générique) ; **Les Défavorisés** (Avantage
  Principal, Infanterie 100% Trait Iron Warriors → Sacrifiable (1))
  était lui déjà entièrement implémenté dans `AVANTAGES_PRINCIPAUX`
  (js/organigramme-data.js) — rien à faire, juste vérifié conforme à la
  page. Nouvelle constante `LISTES_ARSENAL_IRON_WARRIORS` (`officier`
  coût 15, `meleeTerminator` coût 10 — coût absolu identique à celui du
  Marteau Thunder dans chaque liste, l'échange étant gratuit) ; PAS de
  variante `meleeSergent` (Sergent non éligible ici, à la différence du
  Gantelet Solarite Imperial Fists) : câblée sur les mêmes 26 sites
  `officier`/6 sites `meleeTerminator` déjà identifiés pour Imperial
  Fists, avec RETRAIT MANUEL du site Sergent-only (Sergent Terminator
  Tartaros, Escouade Terminator de Siège Tartaros) qui avait pourtant
  hérité du Gantelet Solarite (Sergent éligible côté Imperial Fists,
  mais pas côté Iron Warriors) — piège à surveiller à chaque nouvel
  Arsenal de Légion : les contraintes de Sous-type diffèrent d'un
  Arsenal à l'autre pour un même site partagé, l'éligibilité doit être
  revérifiée à chaque fois plutôt que supposée identique.
  Découverte incidente en auditant les sites `officier`/`meleeTerminator`
  pour Iron Warriors : Seigneur de Forge/Seigneur de Forge Monté/en
  Armure Terminator n'utilisent PAS ces listes partagées pour leur
  Marteau Thunder (option bespoke « Remplacer la hache énergétique »,
  { nom: "Marteau Thunder", cout: 5 } en dur) — ratés par le câblage
  Imperial Fists précédent (pas de Gantelet Solarite là, mais ce n'est
  pas un manque : ces Figurines n'ont pas de gantelet énergétique à la
  base, donc la Règle 1 ne s'y applique de toute façon pas) mais
  repérés et couverts ici pour le Broyeur à gravitons, qui lui s'y
  applique bel et bien (+5 Points, même coût que le Marteau Thunder
  dans cette option précise).
- **Arsenal de l'Alpha Legion (Liber Astartes/Hereticus, livre de
  base) : Dague énergétique et Sphères à venin.** Sphères à venin
  (profil déjà transcrit dans `armes-data.js`) et **Le Salaire de la
  Traîtrise** (Avantage Principal) étaient déjà entièrement présents ;
  seule la Dague énergétique (nouveau profil : MI+2/MA A/MF-1/PA3/D1,
  Brèche (5+), Énergétique) et le câblage générique des deux options
  manquaient.
  **Dague énergétique** (échange GRATUIT d'une arme énergétique,
  État-major/Champion/Sergent — PAS Spécialiste) : ajoutée à
  `CHOIX_ARMES_ENERGETIQUES` (coût 0, comme les 4 armes de base) ET à
  une nouvelle `LISTES_ARSENAL_ALPHA_LEGION` (`officier`/
  `meleeTerminator`/`meleeSergent`, coût 0 dans les trois puisque
  l'échange est gratuit partout). Câblée sur 78 sites en réutilisant les
  ancres déjà posées pour Iron Warriors/Imperial Fists/Salamanders.
  **Piège découvert en vérifiant** : ajouter une entrée à
  `CHOIX_ARMES_ENERGETIQUES` directement (plutôt qu'à une liste à part)
  la propage automatiquement à TOUT site qui la spread — y compris
  Primus Medicae en Armure Terminator, qui spread `CHOIX_ARMES_ENERGETIQUES`
  en dur pour résoudre son placeholder « Arme énergétique » et est
  Sous-type Spécialiste (non éligible ici, à la différence de
  l'Artifice de Nocturne Salamanders qui inclut le Spécialiste et n'a
  donc jamais posé ce problème) : corrigé par un
  `.filter((c) => c.requiertLegion !== "XX")` sur ce site précis plutôt
  que de retirer l'entrée de la constante partagée. Un second cas
  identique (Apothicaire, chaîné après `LISTES_ARTIFICE_NOCTURNE.meleeSergent`)
  a été détecté et corrigé de la même manière — **règle à retenir** :
  chaîner une nouvelle entrée après celle d'un Arsenal aux contraintes
  de Sous-type PLUS LARGES (ex : Salamanders, qui inclut le Spécialiste)
  ne garantit pas que les mêmes sites conviennent pour un Arsenal aux
  contraintes plus étroites — revérifier l'éligibilité à chaque fois,
  y compris via `CHOIX_ARMES_ENERGETIQUES` qui n'est pourtant jamais
  concerné par la mécanique `quantite` partagée (donc « sûr » au sens
  déjà établi) mais PEUT l'être vis-à-vis d'un Sous-type Spécialiste.
  **Sphères à venin** (+5 Points, AJOUT et non échange — État-major/
  Champion SEULEMENT, ni Spécialiste ni Sergent) : nouvelle fabrique
  `optionSpheresVenin()` (case, `requiertLegion: "XX"` posé sur
  l'option elle-même comme les Décurions Sagittar/Lanius, pas sur une
  entrée de `choix`), insérée comme première option de 19 Unités
  État-major à profil unique (Praetor/Centurion/Delegatus/Fauteur de
  Guerre/Pisteur/Optae/Armistos/Seigneur de Forge/Iron Father/
  Forgeguerre, toutes variantes de base/Terminator/montée confondues) —
  identifiées et insérées par script Python plutôt qu'Edit un par un, la
  position d'insertion (première ligne après `options: [`) différant
  d'une Unité à l'autre (certaines commencent par `ARCANE_DE_PROSPERO`,
  d'autres non). Gap documenté, volontairement non couvert : les rôles
  Champion au sein d'Escouades mixtes (Chef de Frappe Locutarus,
  Prefector Palatin, etc.) sont également éligibles au texte de la
  page mais n'ont pas reçu cette option, faute de `prefixeFiche`/
  prix par Figurine déjà en place à réutiliser comme pour les échanges
  de liste — à ajouter ultérieurement si demandé.
- **Arsenal des Night Lords (Liber Astartes/Hereticus, livre de base) :
  Vouge tronçonneur, Hache de bourreau, Trophées du Jugement.** Les
  trois profils/mécaniques existaient déjà (`armes-data.js` pour les
  deux armes, avec commentaires d'éligibilité déjà exacts ; l'Avantage
  Principal Atramentar dans `AVANTAGES_PRINCIPAUX` — voir plus bas la
  divergence relevée dessus) — seul le câblage générique manquait.
  **Vouge tronçonneur** (échange +5, État-major/Champion/Sergent) et
  **Hache de bourreau** (échange +10, État-major SEULEMENT) : ajoutés à
  `CHOIX_ARMES_ENERGETIQUES` (5/10, coût de base 0) et à une nouvelle
  `LISTES_ARSENAL_NIGHT_LORDS` (`officier` 15/20, `meleeSergent` 15
  Vouge seul, `meleeTerminatorSergent` 5 Vouge seul — Hache absente des
  deux dernières, réservée État-major). Corrige au passage
  `atramentar-ecorches` (Escouade Atramentar Écorchés, déjà existante) :
  son option « hache-bourreau » utilisait le libellé « Hache **du**
  Bourreau » (capitale, « du ») écrit avant que le profil ne soit connu
  (l'ancien commentaire disait explicitement « profil non donné dans
  l'extrait ») — aligné sur le nom exact du profil désormais connu
  (« Hache **de** bourreau ») pour que la table d'Armes de la fiche le
  retrouve (`trouverArmeDansTexte`, recherche par sous-chaîne insensible
  à la casse mais qui exige quand même la bonne chaîne).
  **Trophées du Jugement** (+10 Points, AJOUT et non échange,
  État-major/Champion SEULEMENT, accorde Peur (1) décrite en texte
  dans l'`ajoute`, non appliquée mécaniquement — même limite que
  Sphères à venin/Bouclier tempête modèle Proteus) : nouvelle fabrique
  `optionTropheesDuJugement()`, insérée juste après `optionSpheresVenin()`
  sur les mêmes 19 Unités État-major à profil unique (script Python).
  **Vrai bug découvert et corrigé en vérifiant ce câblage** (touchait
  déjà l'Artifice de Nocturne Salamanders ET la Dague énergétique Alpha
  Legion, pas seulement Night Lords) : `optionTypeArmeEnergetique()`
  (fabrique utilisée par ~9 sites — Escouades d'État-Major Terminator
  Cataphractii/Tartaros, Escouades Terminator Cataphractii/Tartaros,
  Escouade Terminator de Siège Tartaros, et des Escouades similaires
  d'autres Légions) spread `CHOIX_ARMES_ENERGETIQUES` **en entier**, sans
  filtrage, dans un choix `obligatoire` marqué « chaque Figurine non
  autrement équipée » — c'est-à-dire un choix UNIQUE partagé par TOUTE
  l'Unité, rang-et-fichier compris (ex : Élu Cataphractii, sans
  Sous-type, à côté du Champion Élu Cataphractii/Sergent). Comme ce
  choix n'a pas de `prefixeFiche` pour isoler un rôle, toutes les
  entrées `requiertLegion` de `CHOIX_ARMES_ENERGETIQUES` (armes forgées
  Salamanders, Dague Alpha Legion, Vouge/Hache Night Lords) étaient
  donc accessibles au rang-et-fichier non éligible sur ces Escouades
  génériques — fuite silencieuse, non détectée par la première version
  (plus permissive) du script de vérification utilisé pour Salamanders/
  Imperial Fists/Iron Warriors/Alpha Legion, qui testait l'éligibilité
  sur la chaîne `type` CONCATÉNÉE de toute l'Unité plutôt que sur
  chaque profil séparément (un mot-clé éligible n'importe où dans la
  chaîne suffisait à faire passer le test, y compris quand seule LA
  MOITIÉ des profils l'avait réellement). Corrigé en filtrant
  `.filter((c) => !c.requiertLegion)` DANS la fabrique elle-même (sûr,
  car ses ~9 appelants sont TOUS de ce type d'Escouade mixte — aucun
  n'est une Unité à profil unique, qui construit son propre `choix` en
  dur séparément) ; script de vérification durci en conséquence
  (checkLegion ci-après vérifie maintenant que TOUS les segments `type`
  d'une Unité sont éligibles quand l'option n'a pas de `prefixeFiche`,
  pas qu'au moins un mot-clé apparaisse dans la chaîne complète) — à
  RÉUTILISER TEL QUEL pour tout futur Arsenal de Légion plutôt que de
  réécrire une vérification ad hoc.
  **Divergence non résolue, signalée au propriétaire** : la photo de
  cette session pour l'Avantage Principal Atramentar liste 4 Unités
  (Centurion en Armure Terminator, Escouade d'État-major Terminator
  Cataphractii, Escouade Terminator Cataphractii, Escouade Terminator
  Tartaros) — SANS l'Escouade d'État-major Terminator Tartaros,
  asymétrie surprenante mais transcrite telle quelle sans la
  « corriger » par supposition. L'entrée déjà existante dans
  `AVANTAGES_PRINCIPAUX` (`id: "atramentar"`) avait été RECONSTITUÉE
  lors d'une session antérieure à partir d'une photo différente,
  manifestement mal océrisée (répétition de « Tartaros », Cataphractii
  mentionné une seule fois pour le Centurion) et incluait PAR SYMÉTRIE
  les deux Escouades d'État-Major (Cataphractii ET Tartaros) — non
  modifiée cette session-ci tant que la divergence n'est pas tranchée
  par le propriétaire contre le livre.

- **Arsenal des Sons of Horus (Liber Astartes/Hereticus, livre de
  base) : Bolters Banestrike (Bolter/Combi-bolter), Haches Énergétiques
  Carsoraines (Hache/Tabar).** Les profils Bolter Banestrike et
  Combi-bolter Banestrike existaient déjà dans `armes-data.js` (déjà
  utilisés en équipement fixe sur plusieurs Figurines nommées Sons of
  Horus — Ezekyle Abaddon-like Chef de Guerre, Escouade Terminator
  Justaerin, Alpha Legion Headhunter Kill Team) ; seule leur **écriture
  générique** (échange sur une Unité de base, +5 Points) manquait. Deux
  bugs de transcription corrigés au passage sur « Hache/Tabar
  énergétique carsorain(e) » (`armes-data.js`), signalés à l'utilisateur
  via AskUserQuestion puis corrigés sur son choix explicite : MI `-1`
  → `-2` (Hache), et « Tabar énergétique carsoraine » (accord féminin,
  copié-collé fautif depuis Hache) → **« Tabar énergétique carsorain »**
  (masculin, « un tabar »). Suprématie Martiale (Avantage Principal,
  déjà existant dans `AVANTAGES_PRINCIPAUX`) vérifiée conforme à la
  photo, aucune modification nécessaire.
  **Bolters Banestrike** (échange +5 Points, réservé État-major/
  Champion) : câblé en objet brut `{ nom, cout: 5, requiertLegion: "XVI" }`
  directement dans le `choix` de l'option « bolter »/« combi-bolter »
  de chaque Unité à profil unique concernée — PAS via une constante
  `LISTES_ARSENAL_SONS_OF_HORUS` façon Night Lords/Alpha Legion/Iron
  Warriors/Imperial Fists, car cette règle ne remplace QUE le Bolter ou
  QUE le Combi-bolter, jamais le pistolet bolter — alors que les listes
  partagées `officier`/`meleeSergent` sont consommées à la fois par
  l'option « Remplacer le bolter » ET « Remplacer le pistolet bolter »
  (fidèle au fonctionnement déjà établi de la liste « Officer of the
  Legion » du livre de base, qui autorise un remplacement de l'un OU
  l'autre par un item de la même liste — mais Bolter Banestrike n'est
  pas un item de cette liste générique, juste une règle Sons of Horus
  à part qui ne vise que le Bolter/Combi-bolter lui-même). Câblé sur 8
  sites « bolter » (Praetor, Centurion, Delegatus, Fauteur de Guerre,
  Pisteur, Optae, Iron Father en Armure Artificer, Forgeguerre en
  Armure Artificer) et 5 sites « combi-bolter » (Praetor/Centurion/
  Delegatus/Fauteur de Guerre/Seigneur de Forge en Armure Terminator).
  Volontairement exclus : les variantes montées (Praetor/Centurion/
  Delegatus/Seigneur de Forge sur Motojet — leur arme de tir est
  « Bolter jumelé »/« Bolter lourd », pas un Bolter/Combi-bolter nu),
  Armistos et Seigneur de Forge de base (aucun des deux n'a de Bolter/
  Combi-bolter nu dans son équipement), et Primus Medicae/Mortificator
  en Armure Terminator (Sous-type Spécialiste, non éligible — même
  logique d'exclusion que pour tous les Arsenals précédents).
  **Haches Énergétiques Carsoraines** (échange Hache +5/Tabar +10,
  « Toute Figurine ayant le Trait Sons of Horus » — SANS restriction de
  Sous-type, seul Arsenal de Légion jusqu'ici à s'appliquer y compris au
  rang-et-fichier) : nouveau marqueur **`toutesFigurines: true`** ajouté
  sur ces deux entrées de `CHOIX_ARMES_ENERGETIQUES`, consommé par
  `optionTypeArmeEnergetique()` (dont le filtre `.filter((c) =>
  !c.requiertLegion || c.toutesFigurines)` a été étendu en conséquence)
  et par le filtre manuel du Primus Medicae en Armure Terminator — pour
  laisser passer ces deux entrées même sur les Escouades mixtes/
  Spécialistes où tout autre `requiertLegion` reste filtré. Escouade
  Terminator Justaerin (déjà existante, Trait Sons of Horus fixe) avait
  déjà « Hache énergétique carsoraine » codée en dur dans son option
  « arme-cac » : Tabar énergétique carsorain ajouté juste à côté au
  même endroit (+10 Points), pas besoin de `requiertLegion` ici
  puisque l'Unité elle-même est déjà réservée à cette Légion par ses
  `traits`.
  **Bolters Banestrike, cas particuliers en `quantite` partagée** :
  Escouade Traqueuse (échange GRATUIT Bolter Kraken → Bolter
  Banestrike, `parTranche: 1`, `groupe: "tir"`) et Escouade de Vétérans
  Tactiques (échange +5 Bolter → Bolter Banestrike, même structure) —
  toutes deux déjà existantes, Trait Sons of Horus fixe, `requiertLegion`
  posé quand même par cohérence avec le reste du fichier bien que non
  strictement nécessaire (Unité déjà réservée à la Légion).
  Vérification : script Node dédié confirmant qu'aucune des 13 Unités
  ciblées n'a fui vers une Unité non éligible (Spécialiste, montée, ou
  sans Bolter/Combi-bolter nu) et que le mécanisme `toutesFigurines`
  laisse bien passer Hache/Tabar carsorain sur les sites mixtes/
  Spécialiste sans y laisser fuir les `requiertLegion` des cinq autres
  Arsenals déjà câblés ; vérification live par navigateur (Sons of
  Horus vs Dark Angels) confirmant l'affichage correct de Bolter
  Banestrike/Combi-bolter Banestrike/Hache et Tabar carsorain et leur
  absence totale hors Sons of Horus, sans erreur console.

- **Arsenal de la Death Guard (XIVe Légion, Liber Astartes/Hereticus,
  livre de base) : Faux Énergétiques, Résistance Anormale, Néfos.**
  Contrairement aux six Arsenals précédents, le profil de la Faux
  énergétique (`armes-data.js`), l'Avantage Principal Résistance
  Anormale (`AVANTAGES_PRINCIPAUX`, réservé Centurion/Centurion
  Cataphractii, +1 PV base + Guerrier Éternel (2), une fois par Armée)
  et le texte intégral de Néfos (`regles-data.js`) existaient déjà,
  vérifiés mot pour mot conformes à la photo sans aucune correction
  nécessaire — seul le **câblage générique** de la Faux énergétique sur
  le reste du roster manquait (le profil n'était utilisé qu'en
  équipement fixe par l'Escouade Terminator du Linceul/Deathshroud et
  par le Chimiarque du Garde-tombe, ce dernier ayant déjà son propre
  échange Sergent-only gantelet→faux).
  **Faux Énergétiques** (« Toute Figurine de Sous-type État-major,
  Champion, Spécialiste OU SERGENT ayant le Trait Death Guard » —
  premier Arsenal de Légion à inclure ces QUATRE Sous-types pour la
  même arme, aucun des six précédents n'en excluait aucun) : +10 Points
  en échange d'une arme énergétique, +5 Points en échange d'un gantelet
  énergétique. Ajoutée à `CHOIX_ARMES_ENERGETIQUES` (+10, requiertLegion
  "XIV" — couvre tous les contextes Terminator où le placeholder
  « Arme énergétique » est gratuit) et à une nouvelle
  `LISTES_ARSENAL_DEATH_GUARD` (`officier`/`meleeSergent` à +20 — coût
  de base de l'arme remplacée dans ces listes, 10 pour une arme
  énergétique ou 15 pour un gantelet, plus le surcoût de la page,
  aboutissant au même total absolu dans les deux cas ; `meleeTerminatorSergent`
  à +10, sans coût de base à ajouter, sur le même principe que Night
  Lords). Chaînée après `LISTES_ARSENAL_NIGHT_LORDS` sur les 22 sites
  `officier` + 40 sites `meleeSergent` + 1 site `meleeTerminatorSergent`
  déjà identifiés pour les Arsenals précédents (script d'insertion
  automatique, vérifié safe car ce Sous-type est un sur-ensemble de
  tous les précédents). **Incluant le Spécialiste** (comme seul
  l'Artifice de Nocturne Salamanders le faisait jusqu'ici) : 5 sites
  supplémentaires identifiés et câblés à la main, faute d'ancre
  Night Lords à chaîner dessus (ces sites n'avaient jamais reçu aucun
  Arsenal de Légion État-major/Champion/Sergent-only auparavant) —
  Primus Medicae et Primus Medicae Monté (options `pistolet`/
  `epee-tronconneuse`, liste `officier`), Apothicaire (option `epee`,
  liste `meleeSergent`), et le filtre de Primus Medicae en Armure
  Terminator (`arme-energetique`, étendu de
  `c.requiertLegion === "XVIII"` à `... || c.requiertLegion === "XIV"`,
  sur le même principe que l'exception `toutesFigurines` déjà en place
  pour Sons of Horus). Mortificator en Armure Terminator vérifié non
  concerné (aucune arme énergétique/gantelet à échanger, équipement
  fixe Bâton Corposant/Servobras).
  **Gap documenté, volontairement accepté** : l'unique site où
  `CHOIX_ARMES_ENERGETIQUES` est spread pour remplacer un **gantelet
  énergétique déjà fixe** plutôt que le placeholder « Arme énergétique »
  (Escouade Terminator Indomitus, option `arme-energetique-sergent`,
  Sergent Terminator Indomitus) affiche donc la Faux énergétique à +10
  au lieu des +5 que la page prévoit pour un échange depuis un gantelet
  — recherché exhaustivement (seuls Escouade Terminator Indomitus,
  Garde-tombe et Escouade Terminator Tyrans de Siège Iron Warriors ont
  un gantelet énergétique fixe dans tout le fichier ; le Garde-tombe a
  déjà son propre échange Chimiarque-only correct à +5, Tyrans de
  Siège est verrouillé Iron Warriors donc jamais concerné) : corriger
  ce seul site demanderait une distinction par contexte que
  `CHOIX_ARMES_ENERGETIQUES` ne permet pas nativement (le même tableau
  sert indifféremment de résolution de placeholder ET de remplacement
  de gantelet fixe selon le site) — accepté comme simplification
  conservatrice (le joueur paie plus cher que prévu, jamais moins).
  Vérification : audit Node dédié confirmant 75 sites au total offrant
  la Faux énergétique (68 chaînages explicites + 7 sites où elle
  apparaît automatiquement via le spread direct de
  `CHOIX_ARMES_ENERGETIQUES`), coûts corrects (+20 officier/meleeSergent,
  +10 arme-energetique/meleeTerminatorSergent), zéro fuite vers un
  Sous-type non éligible (script de vérification étendu à "XIV" avec
  reconnaissance du Spécialiste comme éligible, sur le même principe
  que "XVIII") ; vérification live par navigateur (Death Guard vs Dark
  Angels) confirmant l'affichage et les coûts corrects sur Praetor
  (bolter/pistolet, terminator) et l'absence totale hors Death Guard,
  sans erreur console.

- **Arsenal des Emperor's Children (IIIe Légion, Liber Astartes/
  Hereticus, livre de base) : Augmentations Chirurgicales (Hurleurs
  soniques/Lance sonique), Lances Énergétiques Phénix, Garde Phénix.**
  Comme pour la Death Guard, les trois profils/mécaniques (Lance
  sonique et Lance énergétique Phénix dans `armes-data.js`, l'Avantage
  Principal Garde Phénix dans `AVANTAGES_PRINCIPAUX`, le texte intégral
  de « Hurleurs soniques »/« Adresse Inégalée » dans `regles-data.js`)
  existaient déjà, vérifiés mot pour mot conformes aux deux photos sans
  aucune correction — seul le câblage générique de la Lance énergétique
  Phénix manquait, plus une mécanique entièrement nouvelle pour
  Hurleurs soniques/Lance sonique.
  **Lances Énergétiques Phénix** (échange arme énergétique +10 Points,
  État-major/Champion/Sergent — Spécialiste explicitement exclu, à la
  différence de la Faux énergétique Death Guard) : ajoutée à
  `CHOIX_ARMES_ENERGETIQUES` (+10, requiertLegion "III") et à une
  nouvelle `LISTES_ARSENAL_EMPERORS_CHILDREN` (officier/meleeSergent
  +20, meleeTerminatorSergent +10 — même logique de coût absolu que les
  Arsenals précédents), chaînée sur exactement les mêmes 22 sites
  officier + 40 sites meleeSergent + 1 site meleeTerminatorSergent que
  Night Lords/Death Guard. **Piège rencontré en chaînant** : un premier
  passage automatique (ancré sur les lignes `LISTES_ARSENAL_DEATH_GUARD`
  plutôt que `LISTES_ARSENAL_NIGHT_LORDS`, pour rester à jour après le
  chantier Death Guard) a chaîné Emperor's Children sur 26 sites
  officier et 41 sites meleeSergent au lieu de 22/40 — les 4 + 1 sites
  en trop étaient précisément les sites Spécialiste-only (Primus
  Medicae, Primus Medicae Monté, Apothicaire) que Death Guard seul
  avait rejoints (Spécialiste inclus) et que Night Lords avait toujours
  exclus : retirés individuellement après détection par script (aucun
  ancrage Night Lords à proximité), confirmant la mise en garde déjà
  documentée plus haut — chaîner après l'Arsenal le plus récent ne
  garantit pas la bonne portée de Sous-type pour le suivant, à
  revérifier systématiquement.
  **Hurleurs soniques / Lance sonique** (« Toute Figurine de Sous-type
  État-major ou Champion qui a les Traits Emperor's Children ET
  Renégat » — AJOUT optionnel au choix entre les deux, +15/+10 Points,
  premier Arsenal de Légion à exiger une Allégeance en plus de la
  Légion) : nouvelle fabrique `optionArmesSoniques()`, avec
  `requiertLegion`/`requiertAllegeance` posés sur l'OPTION elle-même
  (pas sur une entrée de `choix`) pour masquer la ligne entière tant
  que les deux conditions ne sont pas réunies — mécanisme
  `requiertAllegeance` au niveau option qui n'existait pas encore dans
  `js/unites.js` (jusqu'ici seulement au niveau d'une entrée de `choix`,
  ex. Vindicator/Flagellator Skitarii) : ajouté `optionAllegeanceOk()`
  (miroir exact d'`optionLegionOk()`), branché dans `optionRealisable()`
  et dans le bloc de masquage de ligne de `synchroniserConfig` (désormais
  déclenché par `opt.requiertLegion || opt.requiertAllegeance`). Au
  passage, généralisé le repli sur l'indice 0 quand la valeur enregistrée
  devient invalide (déjà en place pour `choix.requiertLegion` sur une
  entrée) à `choix.requiertAllegeance` également — gap latent découvert
  en écrivant cette option (aurait aussi affecté Vindicator/Flagellator :
  si l'Allégeance de l'Armée changeait après coup sans que la Légion ne
  change, la valeur enregistrée restait invalide sans jamais retomber
  sur « — Aucun — »). Ajoutée comme 20e option (juste après
  `optionTropheesDuJugement()`) sur les 19 mêmes Unités État-major à
  profil unique que Sphères à venin/Trophées du Jugement. **Même gap
  documenté que ces deux options** : les rôles Champion au sein
  d'Escouades mixtes (Chef de Frappe Locutarus, Escouade de Lames
  Palatines, etc.) restent hors périmètre, faute de `prefixeFiche`/prix
  par Figurine déjà en place à réutiliser.
  **Prix distinct déjà en place, non modifié** : l'Escouade Terminator
  Phénix a sa propre option `arme-sonique` (Hurleurs soniques/Lance
  sonique à +5 Points chacune, `parFigurine: true`, condition « si
  toutes les Figurines de l'Unité ont le Trait Renégat ») — prix et
  condition différents de la page générale ci-dessus (+15/+10,
  Figurine par Figurine, sans condition d'uniformité d'Unité). Faute de
  la photo source de cette Unité pour trancher si c'est un rabais de
  Legacy Wargear intentionnel ou une transcription antérieure à
  corriger, laissé tel quel sans y toucher — à vérifier contre le livre
  si le proprio a un doute.
  Vérification : audit Node dédié confirmant les 22/40/1/19 sites
  attendus (après retrait des 5 sites Spécialiste en trop), zéro fuite
  vers un Sous-type non éligible sur les 8 Arsenals désormais dans le
  fichier, et aucune fuite de `armes-soniques` vers une Escouade mixte ;
  vérification live par navigateur (Dark Angels vs Emperor's Children
  Loyaliste vs Emperor's Children Renégat) confirmant que la Lance
  énergétique Phénix apparaît dès que la Légion correspond (peu importe
  l'Allégeance) alors que Hurleurs soniques/Lance sonique n'apparaissent
  QUE si les deux conditions sont réunies, sans erreur console.

- **Arsenal des Iron Hands (Xe Légion, Liber Astartes/Hereticus, livre
  de base) : Armatus Necrotechnika, Hache Énergétique d'Artificier,
  Pistolet à Graviton, Bardé de Fer.** Comme pour Death Guard/Emperor's
  Children, la Hache énergétique d'artificier (profil dans
  `armes-data.js`, déjà utilisée par le Terminator Gorgone/Révérends de
  Fer) et l'Avantage Principal Bardé de Fer (`AVANTAGES_PRINCIPAUX`)
  existaient déjà, vérifiés mot pour mot conformes à la photo — aucune
  correction. **Pas de phrase générique d'échange donnée pour la Hache
  énergétique d'artificier sur cette page** (contrairement à toutes les
  autres armes d'Arsenal jusqu'ici) : rien câblé pour elle au-delà de
  l'existant, conformément à la règle de ne jamais inventer un
  droit d'accès non fourni par la photo.
  **Pistolet à Graviton** (échange **pistolet à plasma** — pas le
  pistolet bolter — contre un pistolet à graviton, +5 Points,
  État-major OU Champion SEULEMENT, ni Sergent ni Spécialiste) :
  nouveau profil (`armes-data.js`, catégorie Armes à Gravitons,
  distinct du Déchiqueteur à gravitons Legacy déjà existant — portée 12
  au lieu de 18, Trait Pistolet). Câblée via une nouvelle
  `LISTES_ARSENAL_IRON_HANDS.pistolets` (+10 = 5 Pistolet à plasma dans
  la liste + 5 Points de la page), chaînée UNIQUEMENT dans les options
  « Remplacer le pistolet bolter » (pas « Remplacer le bolter », un
  pistolet n'y ayant pas sa place) — première fois qu'un ajout
  d'Arsenal ne vise qu'un seul des deux slots officier. Câblée sur les
  14 sites déjà identifiés comme chaînant `LISTES_EQUIPEMENT.officier`
  dans leur option `pistolet` ; 2 d'entre eux (Primus Medicae, Primus
  Medicae Monté — Spécialiste, chaînent `officier` pour leur équipement
  de base sans être éligibles aux ajouts d'Arsenal État-major/Champion)
  détectés en trop et retirés après audit — même piège que celui déjà
  rencontré et documenté pour Emperor's Children.
  **Armatus Necrotechnika** (ajout, +10 Points, « Toute Figurine de
  **Type Véhicule** » — premier Arsenal de Légion à porter sur le TYPE
  d'une Figurine plutôt que son Sous-type, donc sans lien avec
  État-major/Champion/Sergent/Spécialiste) : nouvelle fabrique
  `optionArmatusNecrotechnika()` (`case`, +10, `requiertLegion: "X"`,
  gagne Autoréparation (5+) — le bonus conditionnel de +1 au Jet de
  Réparation si des pertes ont eu lieu à 6" n'est pas appliqué
  automatiquement, décrit en texte dans l'`ajoute`, même limite que
  Bouclier tempête modèle Proteus). Câblée sur les 37 Unités génériques
  « Legio Astartes » (faction absente/`"legio-astartes"`, sans `legion`
  fixe) de Type « Véhicule » du fichier — **volontairement exclus les
  Marcheurs** (Dreadnoughts Contemptor/Castra Ferrum/Deredeo/Leviathan/
  Saturnine, Type « Marcheur » dans ce fichier) : la page dit « Type
  Véhicule », pas « Véhicule ou Marcheur », et ce fichier traite déjà
  ces deux Types comme distincts ailleurs — à ne pas étendre aux
  Marcheurs sans confirmation contraire. Les 100 Unités de Type
  Véhicule toutes factions confondues ont d'abord été recensées puis
  réduites à 37 en excluant Legio Custodes/Titanicus/Chevaliers/Solar
  Auxilia/Mechanicum/Skitarii (factions distinctes, jamais concernées
  par un Trait de Légion Astartes).
  **Bugs de câblage rencontrés et corrigés** (chantier le plus large à
  ce jour, 37 sites sur des Unités entières plutôt que 60-90 sites sur
  ~20 Unités) : le script d'insertion automatique cherchait, pour
  chaque Unité cible, la première ligne `options: [` ou `options: [],`
  après sa ligne `id:` — trois Unités (Mastodon, Typhon, Cerbère) ont un
  `options: [...]` compact sur une seule ligne avec du contenu, ne
  matchant aucun des deux motifs : le script a donc dépassé leur propre
  bloc et le premier motif suivant trouvé dans le fichier a reçu
  l'insertion à leur place, produisant un DOUBLE insertion sur le
  Stormbird Sokar (dont la ligne `options: [` a ainsi été visée deux
  fois par deux Unités cibles différentes en cascade) et une insertion
  ERRONÉE sur Corvus Corax (Primarque Raven Guard, `legion: "XIX"`,
  aucun rapport avec les Iron Hands) dont le `options: []` vide a fini
  par absorber la dernière insertion de la cascade. Détecté par un
  script d'audit dédié (comptage direct via l'array `UNITES` parsé,
  pas une recherche de motif sur le texte source) comparant le nombre
  d'occurrences réelles de l'option à la liste des 37 id ciblés ;
  corrigé en retirant le doublon sur Stormbird Sokar, en retirant
  l'insertion sur Corvus Corax, et en traitant Mastodon/Typhon/Cerbère
  manuellement (insertion directe dans leur unique ligne `options: [...]`
  existante). **Leçon à retenir pour toute Unité à `options` sur une
  seule ligne avec contenu** (motif déjà vu mais pas systématisé) :
  un script d'insertion automatique par motif de ligne doit soit gérer
  explicitement ce troisième cas, soit signaler un échec exploitable
  (au lieu de continuer à chercher plus loin dans le fichier) — la
  vérification finale doit toujours recompter directement sur les
  données parsées (`UNITES`), jamais seulement sur le nombre de lignes
  insérées par le script, pour détecter ce genre de dérive en cascade.
  Vérification : audit Node confirmant les 37 Unités correctes sans
  doublon ni extra (après correction), zéro fuite sur les 9 Arsenals
  désormais dans le fichier ; vérification live par navigateur (Dark
  Angels vs Iron Hands) confirmant Pistolet à graviton sur le Praetor
  et Armatus Necrotechnika sur le Rhino, tous deux masqués hors Iron
  Hands, sans erreur console.

- **Arsenal des Ultramarines (XIIIe Légion, Liber Astartes/Hereticus,
  livre de base) : Hache Légatine, Bouclier d'Abordage Modèle Argyrum,
  Logisticae.** Comme pour les quatre Arsenals précédents, les trois
  éléments (profil de la Hache légatine dans `armes-data.js`, déjà
  utilisé par l'Escouade de Suzerains Invictarus ; texte intégral du
  Bouclier d'Abordage Modèle Argyrum dans `regles-data.js` ; Avantage
  Principal Logisticae dans `AVANTAGES_PRINCIPAUX`, y compris son
  mécanisme `rolesCaseAjoutee` à deux choix Transport/Transport Lourd)
  existaient déjà, vérifiés mot pour mot conformes à la photo — seul le
  câblage générique manquait.
  **Hache Légatine** (échange arme énergétique +5 Points, État-major/
  Champion/Sergent — Spécialiste exclu, même portée que la Vouge
  tronçonneur Night Lords) : ajoutée à `CHOIX_ARMES_ENERGETIQUES` (+5,
  requiertLegion "XIII") et à une nouvelle `LISTES_ARSENAL_ULTRAMARINES`
  (officier/meleeSergent +15, meleeTerminatorSergent +5), chaînée sur
  les mêmes 22/40/1 sites que les Arsenals précédents (ancrée après
  Emperor's Children cette fois, déjà nettoyé de ses fuites Spécialiste
  — donc directement fiable comme point d'ancrage, contrairement au
  chantier Death Guard → Emperor's Children où l'ancrage avait fui).
  **Bouclier d'Abordage Modèle Argyrum** (ajout, +15 Points, État-major
  OU Champion SEULEMENT — ni Sergent ni Spécialiste) : nouvelle
  fabrique `optionBouclierArgyrum()`, insérée comme 21e option (juste
  après `optionArmesSoniques()`) sur les mêmes 19 Unités État-major à
  profil unique que Sphères à venin/Trophées du Jugement/Hurleurs
  soniques. Même gap déjà documenté pour ces trois options : les rôles
  Champion au sein d'Escouades mixtes restent hors périmètre.
  Vérification : audit Node confirmant zéro fuite sur les 10 Arsenals
  désormais dans le fichier (aucune régression du nettoyage Iron
  Hands/Emperor's Children) ; vérification live par navigateur (Dark
  Angels vs Ultramarines) confirmant Hache légatine sur le Praetor
  (bolter et pistolet) et Bouclier d'Abordage Modèle Argyrum (avec son
  info-bulle de glossaire), tous deux masqués hors Ultramarines, sans
  erreur console.

- **Application automatique des Avantages Principaux « purs » (champ
  `reglesAppliquees`, `AVANTAGES_PRINCIPAUX` dans
  `js/organigramme-data.js`)** : jusqu'ici, TOUS les Avantages
  Principaux spécifiques à une Légion/à un Rang de Maisonnée Chevaliers
  Questoris étaient volontairement « texte seul », à appliquer
  manuellement par le joueur (documenté à chaque entrée du tableau).
  Bug signalé (2026-07-31) : Spectres (Raven Guard) n'ajoutait pas la
  Règle Spéciale correspondante sur la fiche de l'Unité concernée — pas
  un cas isolé, mais le même comportement que ~20 autres entrées.
  Décision du proprio (confirmée par question posée) : automatiser
  uniquement les Avantages « purs » (accordent UNE OU DES Règles
  Spéciales à TOUTE l'Unité, sans échange d'arme, bonus de
  Caractéristique ni gain de Sous-type) — nouveau champ
  `reglesAppliquees: [noms de Règles Spéciales]`, posé sur 14 entrées
  (Assaut Zélé, Déplacement Télékinétique, Les Défavorisés, Atramentar,
  Revenants, Le Devoir Avant la Mort, Les Sagyar Mazan, Spectres, et les
  Rangs de Maisonnée Précepteur/Uhlan/Auctellier/Endeuilleur/Preux
  Implacable/Preux Aspirant). Consommé par `reglesAvantagePrincipalDe`
  (js/unites.js), qui lit `Organigramme.avantageDe(instance.uid)` et
  ajoute les noms à la ligne « Règles spéciales » de `construireFiche` —
  sans revérifier l'éligibilité (Rôle/Trait/Type/Sous-type), déjà
  garantie par `avantagesPossibles` avant que le choix ne soit permis.
  Les Avantages plus complexes (Castellan, Garde Phénix, Paladin de
  l'Hekatonystika, Thegn de Meute, Résistance Anormale, Enchaînés, Bardé
  de Fer, Logisticae, Suprématie Martiale…) restent, eux, appliqués
  manuellement — leur effet mêle échange d'équipement/bonus de profil/
  gain de Sous-type/choix d'une seconde Unité, qu'aucun mécanisme unique
  ne peut représenter fidèlement.
  Bug annexe corrigé au passage : l'entrée de glossaire « Spectres »
  (`js/regles-data.js`) recopiait tout le texte de l'Avantage Principal
  (« Avantage Principal réservé à… ») au lieu de décrire seulement le
  mécanisme de la Règle Spéciale — devenu visible dès que la Règle
  s'affiche réellement sur la fiche (via `reglesAppliquees`), corrigé en
  ne gardant que la phrase mécanique.
  Bug sans rapport corrigé dans la même session : la ligne « Équipement »
  de la fiche récap (`construireLigneRegles`/`ajouterRegleFiche`,
  js/unites.js) ne reconnaissait jamais un objet ajouté avec un
  préfixe de rôle (`prefixeFiche`, ex : « Sergent : Nuncio-vox »,
  « Inductii : Scanner augure ») — la recherche de définition
  (`trouverDefinitionRegle`/`trouverArmeDansTexte`) portait sur la
  chaîne ENTIÈRE, préfixe inclus, qui ne correspond jamais à rien.
  Touchait potentiellement toutes les occurrences de
  `optionsEquipementLegion`/options « Équipement de Légion » à
  `prefixeFiche` non vide à travers le fichier (Nuncio-vox/Scanner
  augure très majoritairement, mais le correctif est générique : tout
  objet préfixé par un rôle). Corrigé en retentant la résolution sur la
  partie après le premier « : » quand la chaîne entière échoue, le
  préfixe restant affiché en texte brut devant le tag.
  Et un troisième bug identifié en creusant celui-ci : l'arme
  générique « Batterie de bolters lourds Gravis » (`js/armes-data.js`)
  portait un nom abrégé fautif (« Batterie de b. lourds Gravis », jamais
  reconnu dans le texte des Unités qui l'utilisent, toujours orthographié
  en toutes lettres) — de fait, `construireTablesArmes` retombait
  toujours sur le seul profil restant partageant le même nom de base une
  fois les parenthèses retirées, celui réservé au Solar Auxilia (« …
  (Solar Auxilia) »), et l'affichait à tort sur des Unités Legio Astartes
  (Batterie de Rapier, Fire Raptor, un Aéronef de type Stormbird).
  Corrigé en réécrivant le nom générique en toutes lettres ; la
  priorisation par Faction dans `construireTablesArmes` prend alors le
  relais normalement (aucune autre modification nécessaire, le
  mécanisme de repli documenté juste au-dessus dans le code n'est plus
  jamais sollicité pour ce montage).

- **Arsenal des Thousand Sons (XVe Légion, Liber Astartes/Hereticus,
  livre de base) : Épées de Force Modèle Achea, Déplacement
  Télékinétique.** Comme pour les Arsenals précédents, le profil de
  l'Épée de force modèle Achea (`armes-data.js`, déjà utilisé par la
  Cabale de Terminators Sekhmet) et l'Avantage Principal Déplacement
  Télékinétique (`AVANTAGES_PRINCIPAUX`, déjà équipé de
  `reglesAppliquees: ["Déplacement Télékinétique"]` — appliqué
  automatiquement sur la fiche, voir l'entrée juste au-dessus sur ce
  mécanisme) existaient déjà, vérifiés mot pour mot conformes à la
  photo — seul le câblage générique de l'épée manquait.
  **Épée de Force Modèle Achea** (échange arme énergétique +5 Points,
  État-major OU CHAMPION SEULEMENT — ni Sergent ni Spécialiste,
  contrairement à Ultramarines/Night Lords/Emperor's Children, qui
  incluent tous le Sergent) : ajoutée à `CHOIX_ARMES_ENERGETIQUES` (+5,
  requiertLegion "XV") et à une nouvelle `LISTES_ARSENAL_THOUSAND_SONS`
  (`officier` +15 SEULEMENT — pas de variante `meleeSergent`/
  `meleeTerminatorSergent`, sur le même principe que le Broyeur à
  gravitons Iron Warriors, également État-major/Champion uniquement),
  chaînée sur les 22 sites officier déjà identifiés.
  **Fuite détectée et corrigée** : l'option `arme-energetique-sergent`
  de l'Escouade Terminator Indomitus (Sergent Terminator Indomitus,
  qui remplace son gantelet énergétique fixe par un spread BRUT et non
  filtré de `CHOIX_ARMES_ENERGETIQUES` — déjà signalé comme site
  fragile lors du chantier Death Guard) exposait l'Épée de force Achea
  au Sergent alors que l'Arsenal l'exclut explicitement. Contrairement
  à Death Guard (qui inclut le Sergent, donc sans problème sur ce
  site), corrigé cette fois en filtrant `c.requiertLegion !== "XV"`
  directement dans le spread de cette option précise — ne retire que
  Thousand Sons, laisse intacts Death Guard/tous les autres. À
  revérifier systématiquement pour tout futur Arsenal État-major/
  Champion-only : ce site spécifique est le seul de tout le fichier à
  spreader `CHOIX_ARMES_ENERGETIQUES` sans aucun filtre pour un rôle
  Sergent, donc le seul à risque pour ce genre de fuite.
  Vérification : audit Node confirmant zéro fuite sur les 11 Arsenals
  désormais dans le fichier (eligibilité État-major/Champion-only
  vérifiée spécifiquement, en plus des vérifications Spécialiste
  habituelles) ; vérification live par navigateur (Dark Angels vs
  Thousand Sons, plus Optae en Thousand Sons pour confirmer l'exclusion
  Sergent) confirmant l'affichage correct et l'absence totale hors
  Thousand Sons et sur les rôles Sergent, sans erreur console.

- **Arsenal des Word Bearers (XVIIe Légion, Liber Astartes/Hereticus,
  livre de base) : Tradition Ardente, Assaut Zélé.** Assaut Zélé
  (Avantage Principal, Troupes/Word Bearers, `reglesAppliquees:
  ["Impact (F)"]` déjà appliqué automatiquement) existait déjà,
  vérifié conforme à la photo — aucune modification. Erebus (Unité
  nommée déjà existante) a déjà « Psyker »/« Anathemata » en `traits`
  fixes et « Discipline Anathemata » en `regles` fixe : rien à faire
  pour lui non plus, la Discipline Anathemata étant déjà son
  fonctionnement normal. L'Ésotériste (Unité générique État-major
  Psyker de base, toutes Légions confondues) a lui aussi « Psyker »/
  « Anathemata »/« Discipline Anathemata » déjà en dur — vérifié SANS
  RAPPORT avec l'Arsenal Word Bearers (Discipline par défaut de ce
  rôle générique dans ce fichier, pas un privilège propre à une
  Légion) : ne pas y toucher.
  **Tradition Ardente** (« Toute Figurine de RÔLE TACTIQUE QUARTIER
  GÉNÉRAL ayant le Trait Word Bearers », +40 Points, peut être dotée du
  Trait Psyker et de la Discipline Psychique Anathemata) — **premier
  Arsenal de Légion à porter sur la CATÉGORIE/Rôle Tactique d'une
  Unité plutôt que sur le Sous-type OU le Type d'une Figurine** (les
  deux dimensions déjà rencontrées jusqu'ici — voir Armatus
  Necrotechnika Iron Hands pour le Type). Nouvelle fabrique
  `optionTraditionArdente()` (`case`, +40, `requiertLegion: "XVII"`,
  effet non appliqué mécaniquement — même limite que les Pouvoirs
  Psychiques d'Arcane de Prospero/Thousand Sons, ce fichier ne
  modélisant pas les Pouvoirs Psychiques un par un). Câblée sur les 4
  Unités Quartier Général **génériques** (sans `legion` fixe) qui
  utilisent ce rôle dans ce fichier : Praetor, Praetor en Armure
  Terminator, Praetor sur moto, Praetor en Armure Terminator Saturnine
  (cette dernière découverte au passage sans les options Sphères à
  venin/Trophées du Jugement/Hurleurs soniques/Bouclier Argyrum déjà
  posées sur les 19 autres Unités État-major — jamais incluse dans ce
  lot, contrairement à ce que son rôle Quartier Général aurait pu
  laisser supposer ; corrigé seulement pour Tradition Ardente ici, les
  quatre autres options restant hors périmètre de cette session).
  **Volontairement exclues** : Iron Father/Forgeguerre en Armure
  Artificer (également Quartier Général générique en apparence, mais
  chacun verrouillé `legion: "X"`/`"IV"` — jamais accessibles à une
  Armée Word Bearers, contrairement aux quatre chaînages précédents
  d'Arsenal officier/meleeSergent qui les touchaient systématiquement
  sans incidence réelle puisque ces deux Figurines ne peuvent de toute
  façon apparaître que dans leur propre Légion) ; Kor Phaeron et Argel
  Tal (Figurines nommées Word Bearers, Trait déjà fixe — ce fichier
  n'étend pas les ajouts d'Arsenal génériques aux Figurines uniques,
  cohérent avec l'absence d'ajout similaire sur les autres Figurines
  nommées d'autres Légions dans les dix Arsenals précédents).
  Vérification : audit Node confirmant zéro fuite (ni de Sous-type sur
  les 11 Arsenals précédents, ni de Catégorie/verrouillage de Légion
  sur Tradition Ardente) ; vérification live par navigateur (Dark
  Angels vs Word Bearers, plus Centurion en Word Bearers pour confirmer
  que la restriction de Catégorie — pas seulement de Légion — est bien
  respectée) confirmant l'affichage correct, sans erreur console.

- **Quatre Arsenals en une session : Dark Angels (Ire), Space Wolves
  (VIe), White Scars (Ve), Raven Guard (XIXe Légion, tous Liber
  Astartes/Hereticus, livre de base).** Comme pour les cinq Arsenals
  précédents, la quasi-totalité des profils/textes/Avantages Principaux
  existaient déjà (transcrits lors de sessions antérieures aux côtés
  des Unités propres à chaque Légion) — seul le câblage générique
  manquait, sauf mention contraire ci-dessous.
  **Dark Angels — Lame de Caliban** (échange arme énergétique +5,
  État-major/Champion/Sergent) et **Espadon terranique** (échange
  GRATUIT d'un **gantelet énergétique** — pas la même arme source,
  État-major/Champion SEULEMENT) : Lame de Caliban ajoutée à
  `CHOIX_ARMES_ENERGETIQUES` et `LISTES_ARSENAL_DARK_ANGELS` (officier/
  meleeSergent/meleeTerminatorSergent) ; Espadon terranique ajouté
  SEULEMENT à `officier` (jamais Sergent-tier, donc sûr sans filtre).
  **Paladin de l'Hekatonystika** (Avantage Principal, déjà existant) :
  l'hypothèse de transcription antérieure sur le nom manuscrit de la
  Règle Spéciale gagnée (« Parangon de l'Ordre ») est CONFIRMÉE exacte
  par cette nouvelle photo plus lisible — commentaire mis à jour pour
  retirer la mise en garde. Brûleur/Incinérateur à plasma : profils
  déjà corrects, aucune phrase d'échange générique donnée sur cette
  page (comme la Hache Énergétique d'Artificier, Iron Hands) — rien
  câblé au-delà de l'existant.
  **Space Wolves — Épée/Hache/Griffe/Grande lame de givre** (État-major
  OU Champion SEULEMENT, ni Sergent ni Spécialiste — Griffe de givre
  remplaçant une Griffe Lightning plutôt qu'une arme énergétique de
  base, traitée comme une résolution alternative du même placeholder
  sur le même principe que la Hache Légatine Ultramarines) ajoutées à
  `CHOIX_ARMES_ENERGETIQUES` et `LISTES_ARSENAL_SPACE_WOLVES.officier`
  SEULEMENT (jamais meleeSergent/meleeTerminatorSergent). **Hache de
  Fenris** (échange GRATUIT+2 d'une Épée tronçonneuse, « Toute
  Figurine » — SANS restriction de Sous-type, seul autre Arsenal avec
  Sons of Horus à s'appliquer aussi au Spécialiste) : nouvelle clé
  `toutesFigurines` sur `LISTES_ARSENAL_SPACE_WOLVES` (distincte du
  marqueur `toutesFigurines: true` sur une entrée de
  CHOIX_ARMES_ENERGETIQUES — ici une liste PARALLÈLE ne contenant que
  la Hache de Fenris, chaînée spécifiquement sur les 5 sites
  Spécialiste-only en plus des 22/40 sites officier/meleeSergent
  habituels).
  **Bug pré-existant découvert et corrigé en câblant Space Wolves/
  Thousand Sons** : l'option `arme-energetique-sergent` de l'Escouade
  Terminator Indomitus (Sergent Terminator Indomitus, qui spread
  `CHOIX_ARMES_ENERGETIQUES` sans filtre pour remplacer son gantelet
  énergétique fixe) exposait déjà « Hache de bourreau » (Night Lords,
  État-major SEULEMENT) au Sergent AVANT ce chantier — fuite non
  détectée lors de la session Night Lords faute d'y avoir alors prêté
  attention. Le filtre ponctuel `requiertLegion !== "XV"` posé lors du
  chantier Thousand Sons a été généralisé en un filtre PAR NOM D'ARME
  (`["Hache de bourreau", "Épée de force modèle Achea", "Épée de
  givre", "Hache de givre", "Griffe de givre", "Grande lame de givre",
  "Vouge énergétique"]`) plutôt que par code de Légion : un même code
  de Légion peut mélanger des entrées éligibles et inéligibles au
  Sergent (Night Lords VIII en est la preuve — Vouge tronçonneur inclut
  le Sergent, Hache de bourreau non), donc filtrer par `requiertLegion`
  seul est structurellement insuffisant dès qu'un Arsenal introduit
  plus d'une entrée avec des portées de Sous-type différentes. À
  réutiliser tel quel (ajouter le nom de toute nouvelle arme
  État-major/Champion-only à cette liste) pour tout Arsenal futur.
  **White Scars — Vouge Énergétique** (échange arme énergétique +10,
  **ÉTAT-MAJOR SEULEMENT** — ni Champion ni Sergent, la contrainte la
  plus étroite rencontrée à ce jour) ajoutée à `CHOIX_ARMES_ENERGETIQUES`
  et `LISTES_ARSENAL_WHITE_SCARS.officier`, également ajoutée à la
  liste d'exclusion par nom du site Sergent Terminator Indomitus.
  **Cyber-faucon** (ajout +10, État-major SEULEMENT, accorde Mouvement
  à Couvert à toute l'Unité — texte intégral déjà dans regles-data.js) :
  nouvelle fabrique `optionCyberFaucon()`, ajoutée comme 22e option sur
  les 19 Unités État-major à profil unique déjà utilisées pour Sphères
  à venin/Trophées du Jugement/Hurleurs soniques/Bouclier Argyrum.
  **Raven Guard — Serre de Corbeau** (échange GRATUIT d'une Griffe
  Lightning, État-major SEULEMENT) ajoutée à
  `LISTES_ARSENAL_RAVEN_GUARD.officier` (coût = coût de base de la
  Griffe Lightning dans cette liste, 10, + 0 de surcoût). **Gap
  documenté** : la Paire de Serres de Corbeau (échange GRATUIT d'une
  Paire de griffes Lightning, État-major SEULEMENT) n'est PAS câblée
  génériquement — contrairement à un simple ajout de liste, elle
  remplacerait un ensemble de DEUX objets différents selon l'Unité
  (Bolter+Pistolet bolter ou Combi-bolter+Arme énergétique), que le
  mécanisme de liste partagée (`depuisListes`) ne permet pas de
  représenter sans une option `paire` dédiée par site (12 sites déjà
  identifiés, structure non uniforme) — à faire au cas par cas si
  demandé. **Réacteurs Modèle Corvidé** (+10, liste NOMMÉE de variantes
  plutôt qu'une contrainte de Sous-type — Praetor à Réacteurs, Centurion
  à Réacteurs, Optae à Réacteurs, Moritat) : nouvelle fabrique
  `optionReacteursCorvide()`, posée avec `variantesExclues: [0]` sur
  Praetor/Centurion/Optae (leur variante 0, sans réacteurs, reste
  grisée) et sans exclusion sur Moritat (une seule variante, toujours
  Antigrav) — vérifié via bascule de variante en direct (radio bouton
  `variante-<uid>`, PAS un `<select>`) que l'option passe bien de grisée
  à активable au changement de variante. **Spectres** (Avantage
  Principal, déjà existant avec `reglesAppliquees` posé lors d'une
  session antérieure) : vérifié conforme, aucune modification.
  Vérification : audit Node étendu à ces quatre nouveaux codes de
  Légion (I/VI/V/XIX, avec la contrainte État-major SEULEMENT pour V et
  XIX) confirmant zéro fuite sur les 15 Arsenals désormais dans le
  fichier ; vérification live par navigateur (Dark Angels, Space
  Wolves avec Apothicaire Spécialiste, White Scars, Raven Guard avec
  bascule de variante Praetor à Réacteurs) confirmant l'affichage, les
  coûts et les états grisé/actif corrects, sans erreur console.

- **Arsenal des Blood Angels (IXe Légion, Liber Astartes/Hereticus,
  livre de base) : Pistolet Inferno, Armes de Perdition, Canon
  d'assaut Iliastus, Revenants.** Comme d'habitude, tous les profils
  (Pistolet Inferno — avec un doublon pré-existant inoffensif signalé
  plus bas —, les 4 Armes de Perdition, Canon d'assaut Iliastus/jumelé)
  et l'Avantage Principal Revenants (`reglesAppliquees: ["Peur (1)"]`
  déjà posé) existaient déjà, conformes à la photo — seul le câblage
  générique manquait, et celui-ci s'est révélé être le plus large et
  le plus varié à ce jour (une seule page couvrant CINQ mécanismes
  distincts).
  **Pistolet Inferno** (échange +5, « Toute Figurine » — SANS
  restriction de Sous-type, comme Sons of Horus/Hache de Fenris) et
  **Armes de Perdition** (échange arme énergétique +5, État-major/
  Champion/Sergent, quatre résolutions distinctes comme l'Artifice de
  Nocturne Salamanders) : câblés respectivement via une nouvelle clé
  `toutesFigurines` et les clés `officier`/`meleeSergent`/
  `meleeTerminatorSergent` habituelles de `LISTES_ARSENAL_BLOOD_ANGELS`,
  chaînés sur les mêmes 22/40/1/5 sites que les Arsenals précédents.
  **Canon d'assaut Iliastus**, câblé en QUATRE mécanismes séparés :
  (1) Escouade de Vétérans Tactiques + Escouade d'État-Major de
  Centurion — échange du lance-flammes lourd (+10, coût absolu 20),
  nouvelle clé `lourdes` chaînée via `quantiteDepuisListe` sur les deux
  sites concernés ; (2) Predator — échange GRATUIT du Canon Predator de
  Tourelle contre la version jumelée de Tourelle, ajouté directement à
  son option `canon-predator` ; (3) toute Figurine de Type Véhicule —
  version sur Pivot (+20), ajoutée directement dans la fabrique PARTAGÉE
  `optionPivotLegion()` (donc automatiquement répercutée sur ses 13
  sites plutôt que chaînée site par site, la première fois qu'un
  Arsenal modifie une fabrique partagée au lieu d'ajouter à une liste) —
  nécessite un **nouveau profil** « Canon d'assaut Iliastus sur Pivot
  (Blood Angels) » (armes-data.js), distinct du montage Décurion
  Sagittar (Imperial Fists) déjà existant sous le même nom de base mais
  avec Antiaérien/Précision (6+) en plus, sur le principe déjà établi
  du « Missile traqueur (Mechanicum) »/« (Skitarii) » ; (4) Dreadnought
  Leviathan — échange de ses deux lance-flammes lourds contre deux
  canons d'assaut Iliastus pour +30, ajouté à son option `lance-flammes`
  existante. **Gap documenté** : « Tout Terminator Cataphractii » (même
  échange que Vétérans Tactiques/État-Major de Centurion) non câblé —
  aucune Escouade Terminator Cataphractii générique n'existe dans ce
  fichier avec une option lance-flammes lourd (seule l'Escouade
  d'État-Major Terminator Cataphractii existe, sans arme lourde).
  **Bug de fond découvert et corrigé, portée plus large que Blood
  Angels** : `quantiteDepuisListe()` (fabrique générant les options
  `type: "quantite"` à partir d'une liste d'items) ignorait
  silencieusement `item.requiertLegion` — le champ n'était tout
  simplement jamais recopié sur l'option générée. Les Canons d'assaut
  Iliastus de l'Escouade de Vétérans Tactiques/de l'Escouade d'État-
  Major de Centurion se seraient donc affichés pour N'IMPORTE QUELLE
  Légion, pas seulement Blood Angels. Corrigé en propageant
  `item.requiertLegion` sur l'option générée elle-même (un `quantite`
  n'a pas d'entrées de `choix` où le poser séparément), lu par
  `optionLegionOk`/`optionRealisable` (déjà génériques à tout type
  d'option, comme pour les Avantages Sphères à venin/Trophées du
  Jugement/etc.). Vérifié que cette fabrique n'avait jamais été
  utilisée auparavant avec une liste `LISTES_ARSENAL_*` dans les
  quinze Arsenals précédents (uniquement avec des listes non
  restreintes de LISTES_EQUIPEMENT) : bug isolé à ce chantier, sans
  régression à corriger ailleurs.
  **Doublon pré-existant signalé, non corrigé** : « Pistolet Inferno »
  a deux entrées identiques dans `armes-data.js` (une pour
  l'Iconoclaste de l'Escouade du Cercle de Cendres, Word Bearers ; une
  pour l'Arsenal des Blood Angels), mêmes stats exactement — probablement
  transcrites indépendamment lors de deux sessions différentes sans
  remarquer le doublon. Sans incidence fonctionnelle connue (stats
  identiques), laissé tel quel plutôt que de risquer de casser une
  référence existante en supprimant l'un des deux ; à fusionner si le
  proprio le souhaite.
  Vérification : audit Node confirmant zéro fuite sur les 16 Arsenals
  désormais dans le fichier (les alertes du script sur les
  emplacements Type Véhicule/Figurine nommée sont des faux positifs
  déjà attendus, ce script ne distinguant pas les contraintes de
  Sous-type des contraintes de Type/Unité nommée) ; vérification
  directe des quatre sites Canon d'assaut Iliastus après le correctif
  `quantiteDepuisListe` confirmant `requiertLegion: "IX"` bien présent
  partout ; vérification live par navigateur (Dark Angels vs Blood
  Angels) confirmant Perdition/Pistolet Inferno sur le Praetor, sans
  erreur console — les sites Predator/Escouade de Vétérans Tactiques/
  Dreadnought Leviathan nécessitaient un Détachement supplémentaire non
  obtenu de façon fiable via l'interface pendant cette session, mais
  vérifiés directement sur les données structurées.

- **Arsenal des World Eaters (XIIe Légion, Liber Astartes/Hereticus,
  livre de base) : Lames des Arènes, Armes des Caedere, Enchaînés —
  session de VÉRIFICATION SEULE, aucune modification de code.**
  Contrairement aux seize Arsenals précédents, cette photo plus claire
  ne révèle aucun écart : les 4 profils d'Armes des Caedere (Marteau
  météore, Hache tronçonneuse Excoriator, Paire de falax, Fouet
  barbelé — `armes-data.js`) et l'Avantage Principal Enchaînés (avec le
  texte intégral de Frères de Chaîne déjà présent dans son `texte`,
  `organigramme-data.js`) sont déjà mot pour mot conformes ; le
  câblage de l'échange d'Armes des Caedere était déjà en place depuis
  une session antérieure sur les deux seules Unités qui commencent
  avec une telle arme en équipement de base (Escouade Saccageuse —
  choix obligatoire de tout l'Unité, plus un échange propre au Champion
  Saccageur ; Escouades de Destructeurs Main Rouge Mortalis/d'Assaut —
  échange `quantite` par Figurine, +10) : aucun `requiertLegion` posé
  sur ces sites, sans besoin puisque les deux Unités sont déjà
  verrouillées `legion: "XII"`.
  **Lames des Arènes** (« Dans toute Unité composée uniquement de
  Figurines qui ont le Trait World Eaters, toute Figurine peut
  échanger GRATUITEMENT son épée tronçonneuse contre une hache
  tronçonneuse » — AUCUNE restriction de Sous-type, y compris le
  rang-et-fichier) : **volontairement non câblé**, car cet échange est
  déjà mécaniquement possible SANS AUCUNE restriction de Légion
  partout où `LISTES_EQUIPEMENT.officier`/`meleeSergent` sont
  consommées — Épée tronçonneuse et Hache tronçonneuse y sont déjà
  toutes deux gratuites, de simples alternatives interchangeables dans
  la même liste, jamais réservées à une Légion précise dans ce
  fichier. La seule vraie plus-value de cette page pour World Eaters
  est d'étendre ce même échange gratuit au rang-et-fichier hors
  État-major/Champion/Sergent (Légionnaires de base, qui n'ont
  normalement aucune option d'échange d'arme) — **gap documenté**,
  volontairement non câblé, l'ampleur d'un tel câblage (chaque
  Escouade de Troupes/Assaut du fichier) dépassant largement la
  portée des Arsenals de Légion traités jusqu'ici (qui touchent
  toujours un ensemble de sites délimité, jamais le rang-et-fichier
  générique dans son intégralité) — même logique de simplification déjà
  acceptée pour la Hache de Fenris (Space Wolves)/le Pistolet Inferno
  (Blood Angels), mais poussée plus loin ici faute d'ancrage
  État-major/Champion/Sergent existant à réutiliser.
  **Distinction notée avec un gap déjà documenté plus tôt** : cette
  page (livre de base) décrit un échange LATÉRAL entre deux Armes des
  Caedere (réservé aux Figurines qui EN ONT DÉJÀ une) — différent de
  « l'Armurerie générique World Eaters » du wargear PDF déjà signalée
  comme gap plus haut (échanger une arme énergétique CONTRE une arme
  des Caedere, ouvrant l'accès à qui n'en a pas) : les deux mécaniques
  sont distinctes et non redondantes, ce document ne comble que la
  première (déjà faite), la seconde reste un gap séparé.

- **Roster Legio Custodes complété (livre d'armée officiel, GW 2026,
  déjà en français)** : les 16 Unités restantes de
  `project_legio_custodes_roster` (mémoire de session, désormais
  satisfaite/à retirer) ajoutées à la suite des 3 Unités déjà
  existantes (Sodalités de Gardes Adrasites/Pyrithites/Sagittarii) —
  Constantin Valdor, Tribun, Capitaine-rempart, Sodalité de Terminators
  Aquilon, Sodalité de Gardes Custodiens, Sodalité de Gardes
  Sentinelles, Dreadnought Contemptor-Achillus/-Galatus/Lourd Telemon,
  Graviporteur Coronus, Sodalité de Venatari, Sodalité de Motojets
  Gyrfalcon, Antigrav d'Attaque Pallas, Char Antigrav Caladius,
  Escorteur Ares, Navette d'Assaut Orion. Faction **dégrisée** dans le
  menu « Faction » (`FACTIONS`, js/organigramme.js — le plombage de
  l'Organigramme de Force partagé avec Legio Astartes/Solar Auxilia/
  Mechanicum/Skitarii était déjà préparé par anticipation, rien à
  ajouter côté organigramme.js/-data.js au-delà de ce commutateur et
  des deux nouveaux Avantages Principaux ci-dessous).
  **Gap volontaire, le plus large de ce fichier à ce jour** : aucune
  page d'Arsenal (tableau de caractéristiques d'Armes) Legio Custodes
  n'a été fournie pour ce lot de fiches, seulement les fiches d'Unité
  elles-mêmes — contrairement aux 3 Unités précédentes, dont les 3
  profils d'Armes (Lance adrasite/pyrithite, Arquebuse à bolts
  Adrastus) provenaient d'une page d'Arsenal fournie lors d'une session
  antérieure. Une bonne trentaine de noms d'Armes nouveaux (Pique de
  feu Infernus, Destructeur cinétique, Lance de Gardien, Canon à bolts
  Lastrum, toute la famille Carronade/Canon Arachnus, Lance-missiles
  Spiculus, Ceste de Telemon, Lame de Galatus, etc.) restent donc du
  texte d'équipement brut, sans entrée `armes-data.js` — conformément à
  la règle 6 (ne jamais inventer un profil), étendue par analogie aux
  profils d'Armes eux-mêmes. Seule exception : **La Lance Apollonienne**
  (Constantin Valdor), profil complet (Tir ET Mêlée) donné en encart
  dédié sur sa fiche, ajouté à `armes-data.js` sous ce nom tel quel
  (matché par le moteur via `nomBase`, qui retire déjà tout suffixe
  entre parenthèses des deux côtés de la comparaison — pas besoin du
  marqueur « ¹ » utilisé pour Lance adrasite/pyrithite). Le Bocle Tarsus
  et les deux Boucliers Praesidium (base et Gravis, ce dernier réservé
  au Dreadnought Contemptor-Galatus) ont eux un texte de règle complet
  (encarts dédiés dans le livre) : ajoutés à `js/regles-data.js` plutôt
  qu'à `armes-data.js`, même principe que le Bouclier tempête modèle
  Proteus déjà existant — le texte du Bouclier Praesidium de base
  (non-Gravis) vient d'une annotation manuscrite du propriétaire
  (« invulnérable 5+ / trait bouclier »), traitée comme faisant foi au
  même titre qu'un texte tapé en conversation, et mise en forme par
  analogie directe avec l'encart complet du Bouclier Praesidium Gravis
  (même famille d'objet, ne diffère que par le palier).
  Tactica de Legio (**Seule la Mort**), Réaction Avancée (**La Lame se
  Scinde**) et les 4 Postures de Défi (**Élan du Rapace**, **Frappe des
  Cieux**, **Fléau du Serpent du Monde**, **Égide de la Pierre**)
  ajoutées à `regles-data.js` pour référence (texte intégral fourni)
  mais **non injectées automatiquement** dans les `regles` des 19
  Unités Legio Custodes : aucun mécanisme de rattachement Trait → Règle
  Spéciale automatique n'existe sur ce site pour le Trait générique
  `[Legio Custodes]` (à la différence de `reglesAppliquees`, réservé
  aux Avantages Principaux d'une Case Principale) — gap accepté,
  cohérent avec le fait que `[Legiones Astartes]` lui-même n'est
  jamais injecté ligne à ligne dans aucune Unité de ce fichier.
  **Deux nouveaux Avantages Principaux** (`AVANTAGES_PRINCIPAUX`,
  js/organigramme-data.js) : **Préfet** (`uniteRequise: [{ id:
  "custodes-capitaine-rempart" }]`, +1 PV de Base et Officier de Ligne
  (2) — texte seul, non appliqué mécaniquement, même limite que
  Castellan/Bardé de Fer) ; **Garde Hetaeron** (`unParArmee: true`,
  porte à 2 la valeur de X de Guerrier Éternel (X) des Figurines
  Infanterie/Cavalerie Legio Custodes — texte seul également).
  **Gap accepté sur Garde Hetaeron** : le livre lève la restriction
  0-1 par Armée une fois par Figurine à Trait Exemple d'Or présente
  dans l'Armée (mécanique de comptage fin, sans équivalent
  `exempteUnParArmeeSiMaisonnee`-like déjà prêt à l'emploi pour un
  comptage à N exemplaires plutôt qu'un booléen) : non implémentée,
  seule la restriction de base `unParArmee: true` est appliquée,
  l'exception restant décrite en texte seul.
  Les deux nouveaux Avantages utilisent `traitRequis: "[Legio
  Custodes]"` (le Trait générique BRACKETÉ littéral, pas
  "Legio Custodes" sans crochets) : cette Faction n'a pas de mécanisme
  `SKINS_LEGION`-like de substitution Trait générique → nom de Légion
  choisie (elle n'a qu'une seule Légion), donc `avantagesPossibles()`
  compare directement contre la chaîne littérale déjà posée sur les 19
  Unités — poser `traitRequis: "Legio Custodes"` (sans crochets)
  n'aurait jamais matché aucune Unité de ce fichier.
  **Deux divergences transcrites telles quelles depuis les fiches,
  sans « correction » par supposition de symétrie** : le Dreadnought
  Lourd Telemon liste « Fumigènes » en équipement mais SEULEMENT
  « Loyaliste »/« Legio Custodes » en Traits, sans « Écran de Fumée »
  (à la différence des deux autres Dreadnoughts Custodes, qui l'ont
  bien) ; « Affrelance Achillus » (arme de mêlée du Dreadnought
  Contemptor-Achillus) est le nom exact imprimé sur la fiche fournie,
  conservé tel quel malgré sa sonorité inhabituelle plutôt que
  substitué par une traduction plus attendue (Griffe/Serre Achillus) —
  à vérifier contre le livre si le propriétaire a un doute sur l'un ou
  l'autre point.
  **Bug critique découvert après coup (2026-08-01), à surveiller pour
  toute future Unité** : Constantin Valdor, Dreadnought Contemptor-
  Galatus, Escorteur Ares et Navette d'Assaut Orion avaient été écrits
  sans champ `options` du tout (au lieu de `options: []`) — sur ce
  fichier, TOUTE Unité doit porter ce champ même vide, car
  `valeursParDefaut()` (js/unites.js) fait `for (const opt of
  unite.options)` sans jamais vérifier que le tableau existe. Résultat :
  le bouton « Ajouter à la liste » plantait silencieusement (`TypeError:
  unite.options is not iterable`) dès qu'on choisissait une de ces
  Unités, sans aucun message d'erreur visible sur la page — repéré
  seulement en reproduisant le clic dans un DOM headless (jsdom) après
  signalement du propriétaire, `node --check` ne détectant évidemment
  rien puisque le JSON est syntaxiquement valide. Corrigé en ajoutant
  `options: []` aux quatre Unités ; vérifié qu'aucune autre Unité du
  fichier (Legio Custodes ou non) n'a le même défaut via un script
  Node dédié (`Array.isArray(u.options)` sur tout `UNITES`). Relire
  systématiquement ce champ après avoir écrit une nouvelle Unité SANS
  option (Figurine unique, Véhicule sans échange), le cas qui l'omet
  le plus facilement puisqu'aucune option n'est du tout nécessaire.
  Deux Règles Spéciales de ce chantier ont aussi été corrigées après
  relecture d'une photo plus nette envoyée une seconde fois par le
  propriétaire : **Frappe des Cieux** (Posture) ne précise dans le
  livre AUCUN sens d'arrondi pour la division par deux de la
  Caractéristique d'Attaques — « arrondi au supérieur » avait été
  inventé, retiré ; **La Lame se Scinde** (Réaction Avancée) omettait
  la condition de la section « Cible » (Unité Réactive uniquement
  composée de Figurines à Traits Legio Custodes ET La Sodalité, au
  moins six Figurines) — réintégrée. Retenir de cet épisode : relire
  une transcription face à une photo plus nette quand le propriétaire
  la renvoie, même si le contenu semble être « le même » qu'une session
  précédente — ce n'est pas une répétition superflue.

- **Nouvelle Faction « Anathema Psykana » (livre d'armée officiel, la
  Sororité Silencieuse)** : 4 Unités ajoutées (Jenetia Krole → Quartier
  Général, Chevalière Centura → État-major, Cadre Anathema → Troupes,
  Acquisitor Modèle Kharon → Transports Lourds), catégories données
  explicitement par le propriétaire plutôt que devinées. Faction
  enregistrée dans `FACTIONS` (js/organigramme.js, activée `true`
  d'emblée : contrairement à Legio Custodes qui était restée grisée
  faute de roster complet à l'origine, les 4 Unités couvrent ici tout
  ce qui a été fourni) et dans `factionCroisadeParDefaut()` (partage
  l'Organigramme de Force de Croisade générique avec Legio Astartes/
  Mechanicum/Solar Auxilia/Skitarii/Legio Custodes, sur le même
  principe déjà établi) ; `LIBELLES_FACTION` (js/unites.js) complété.
  Comme la Legio Custodes, cette Liste d'Armée n'a pas de variante
  Renégate (toutes les Unités ont le Trait fixe « Loyaliste ») : les
  QUATRE points de forçage Allégeance→Loyaliste déjà identifiés pour
  Legio Custodes (restauration depuis localStorage, changement de
  Faction, verrouillage + info-bulle du `<select>` Allégeance) ont
  chacun été étendus à `anathema-psykana` en même temps que le
  changement de Faction lui-même, plutôt que découverts un par un au
  fil de bugs signalés plus tard — dupliquer ce chantier "4 points de
  forçage" pour toute future Faction Loyaliste-only.
  Toutes les Unités portent le Trait générique `[Anathema Psykana]`
  (même mécanique de masquage sur la fiche récap que `[Legio
  Custodes]`/`[Legiones Astartes]`, ajouté au filtre de
  `construireFiche`, js/unites.js) et le Trait organisationnel
  générique « Serres de l'Empereur » (pas de texte intégral fourni,
  laissé en texte brut, comme « La Sodalité » l'a longtemps été pour
  Legio Custodes avant que son texte ne soit connu). « Ex Oblivio »
  (Chevalière Centura, Jenetia Krole) n'a lui non plus aucun texte
  connu : nom seul dans `regles`, conformément à la règle 6.
  Nouvelles Règles Spéciales ajoutées à `regles-data.js` (texte
  intégral fourni) : **Anathème** (Tactica de Divisio : ignore les
  Aptitudes/Armes Psychiques, blessée seulement sur 5+ par une Arme
  Psychique/Immatérielle, immunité aux échecs 1-4 non modifiés sur les
  Jets de Blessure d'Unités entièrement Anathème contre Anathème — sans
  effet sur la Pénétration de Blindage), **La Reine Sans Âme** (Posture
  de Défi de Jenetia Krole, nommée « Frappe Abyssale » dans le texte
  détaillé, sur le même principe de Posture nommée que les Primarques/
  personnages uniques déjà transcrits), et **Investigatus-Militant**
  (Trait accordant un Point de Réaction bonus au Détachement Principal,
  calqué sur l'entrée déjà existante « État-major Suprême de Cohorte »,
  Solar Auxilia, même mécanique non simulée mécaniquement — texte
  informatif seul, comme son modèle).
  Nouvelle Arme **L'Épée de l'Oubli** (Jenetia Krole, Mêlée seule,
  profil complet donné en encart dédié sur sa fiche) ajoutée à
  `armes-data.js`, nouvelle catégorie « Armes de l'Anathema Psykana » —
  seule Arme de ce lot à avoir un profil connu ; toutes les autres
  (Arroi de canons lourd Hellion, missiles vratins lourds, Espadon
  d'exécution) restent du texte d'équipement brut, même gap déjà
  documenté pour le reste du roster Legio Custodes.
  **Fluff omis pour les 4 Unités, gap volontaire découvert en
  relisant mon propre travail avant de le livrer** : les paragraphes de
  fluff transcrits depuis des photos pivotées (donc plus difficiles à
  lire) contenaient des passages clairement incohérents une fois
  relus (ex : « quilon les liasse rivre » n'est pas du français) —
  signe d'un remplissage de trous plutôt que d'une lecture fidèle.
  Retirés entièrement plutôt que corrigés au jugé (sauf l'information
  mécanique utile qu'ils contenaient, comme le Point d'Accès de
  l'Acquisitor Kharon, reformulée séparément en une phrase neutre).
  Lire deux fois son propre paragraphe de fluff avant de le committer
  quand la photo source est pivotée ou difficile à lire : une phrase
  qui ne se relit pas comme du français correct n'est jamais une bonne
  transcription, même approximative.
  Vérification : audit Node dédié confirmant qu'aucune Unité du
  fichier (toutes Factions confondues, 442 au total après cet ajout)
  n'a de champ `options` manquant ; test fonctionnel en DOM headless
  (jsdom) confirmant que les 4 Unités s'ajoutent sans erreur à une
  Armée Anathema Psykana à 2000 pts et que l'Allégeance reste
  verrouillée sur Loyaliste.

- **Bug corrigé (2026-08-01) : fuite d'Unités entre Factions dans le
  sélecteur « Unité à ajouter »**, signalé par le propriétaire en
  testant l'Anathema Psykana (des Chevaliers Cerastus/Questoris
  Chevaliers Questoris apparaissaient dans une Armée Anathema Psykana
  sans qu'aucun Détachement Allié Chevaliers Questoris n'ait été
  ajouté). Cause : `uniteAccessible()` (js/unites.js) avait deux
  dérogations qui rendaient certaines Unités visibles quelle que soit
  la Faction de l'Armée, sans passer par un Détachement Allié — un
  Titan Legio Titanicus OU un Chevalier Questoris (catégorie
  « Seigneurs des Batailles »), et un Armigère Chevaliers Questoris
  (catégorie « Engins de Guerre ») — dès qu'une Case libre de ce Rôle
  Tactique existait quelque part dans l'Armée (le Détachement de
  Seigneur des Batailles et certains Détachements Auxiliaires étant
  `factionLibre`, voir js/organigramme-data.js). Ces deux dérogations
  ne dépendaient d'AUCUNE action du joueur : elles s'appliquaient dès
  que l'Organigramme de base incluait une telle Case, ce qui est
  quasiment toujours le cas. Retirées entièrement sur demande
  explicite du propriétaire : « je ne dois pas voir les unités d'une
  autre Faction à moins que cette autre Faction soit choisie en
  Détachement Allié, et cette logique doit s'appliquer à toutes les
  Factions » — désormais seule la logique Détachement Allié
  (`factionsAllieesActuelles.includes(factionUnite)`, déjà existante)
  gouverne la visibilité d'une Unité d'une autre Faction. La dérogation
  DETACHEMENTS_CROISES (Tercio de Fer, Serre d'Automates, Maisnie
  Roturière) est CONSERVÉE : contrairement aux deux ci-dessus, elle
  exige que le joueur ait explicitement ajouté ce Détachement précis à
  son Armée, ce qui reste conforme au principe « rien sans action
  explicite du joueur ». Pour aligner malgré tout un Titan/Chevalier/
  Armigère isolé d'une autre Faction, il faut désormais ajouter un vrai
  Détachement Allié de la Faction voulue (le Rôle Tactique factionLibre
  de la Case visée continue d'accepter n'importe quelle Faction pour le
  PLACEMENT une fois l'Unité rendue accessible, `caseAccepte()` n'a pas
  eu besoin d'être modifié). Vérifié par test fonctionnel en DOM
  headless (jsdom) dans les deux sens : 0 résultat pour « Chevalier
  Cerastus »/« Titan Warlord » dans une Armée Anathema Psykana sans
  Détachement Allié, puis 4 résultats après ajout d'un Détachement
  Allié Chevaliers Questoris — sans régression sur les tests
  fonctionnels Legio Custodes/Anathema Psykana déjà en place.

- **Tutoriel « Voir le tutoriel » ajouté pour Conclaves Skitarii, Legio
  Custodes et Anathema Psykana** (pages/construction-liste.html),
  demande explicite du propriétaire, à partir du tutoriel Legio
  Astartes déjà existant (`construction-armee`) : ces trois Factions
  partagent le même Organigramme de Force de Croisade générique (voir
  `factionCroisadeParDefaut`, js/organigramme.js), donc quasiment tout
  le contenu (Détachement Principal, Détachements auxiliaires/d'apex,
  diagramme interactif de l'Organigramme, table des Rôles Tactiques,
  accordéon des Avantages Principaux Maître-sergent/Vétérans de
  Combat/Parangon de Bataille/Affectation Spéciale/Bénéfice
  Logistique) est **strictement identique et vrai pour les trois**,
  copié tel quel plutôt que réécrit. Deux adaptations propres à chaque
  Faction : (1) le panneau **« Décurion de Légion »** (Predator/
  Sicaran/Char d'Assaut Kratos, verrouillé par Trait de Légion) est
  entièrement retiré des trois nouvelles copies — mécanique propre aux
  Legiones Astartes, sans équivalent pour ces trois Factions ; (2) les
  exemples d'Unités concrètes (encadré de composition, exemple de
  Détachement Principal, conseils pratiques Maître-sergent/Parangon de
  Bataille, exemple d'Officier de Ligne (2)) remplacés par des Unités
  réellement transcrites pour chaque Faction plutôt que laissés en
  Praetor/Centurion/Escouade Tactique. **Deux gaps honnêtement
  documentés plutôt que masqués par un faux exemple** : ni Skitarii ni
  Legio Custodes ni Anathema Psykana n'ont de Rôle Tactique « Transport »
  (léger) transcrit sur ce site (seul « Transports Lourds » existe pour
  ces trois) — le conseil pratique le dit explicitement plutôt que
  d'inventer un véhicule ; et aucune Unité Legio Custodes transcrite
  n'a de Sous-type Sergent (contrairement à l'Ordinator Skitarii et à
  la Maîtresse du Néant Anathema Psykana, qui en ont), donc le conseil
  Maître-sergent de sa copie le signale au lieu de citer une Unité
  inexistante. Un exemple exact et vérifié a pu être trouvé pour
  Officier de Ligne (2) côté Legio Custodes : le Capitaine-rempart doté
  de l'Avantage Principal **Préfet** (déjà existant, voir plus haut)
  gagne réellement cette Règle Spéciale.
  Implémentation : les 3 nouvelles copies ont été générées par script
  Node à partir du bloc HTML Legio Astartes (lignes 114-1035 avant cet
  ajout) plutôt que retapées à la main, pour garantir une fidélité
  strictement identique au texte de règles partagé (aucune coquille de
  copier-coller possible) ; seuls les ids (`construction-armee-<faction>`,
  `construction-armee-<faction>-corps`, et les ids internes de
  `timeline-item` type "principal"/"organigramme"/"roles"/
  "cases-principales") ont été rendus uniques pour rester du HTML
  valide, sans que cela n'ait d'incidence fonctionnelle connue (aucune
  règle CSS ni script ne référençait ces ids internes avant cet ajout).
  Bascule d'affichage ajoutée dans `actualiser()` (js/organigramme.js),
  même mécanique `.hidden` déjà en place pour Questoris/Titanicus/Solar
  Auxilia/Mechanicum. Vérifié par test fonctionnel en DOM headless
  (jsdom) sur les 8 Factions du site : exactement une section de
  tutoriel visible à la fois, celle attendue pour chacune, sans
  régression sur les tests Legio Custodes/Anathema Psykana/fuite de
  Factions déjà en place.
  **Item 1 de la même demande du propriétaire (ne pas afficher un Rôle
  Tactique vide dans le sélecteur « Unité à ajouter »)** : vérifié déjà
  résolu par le correctif de fuite entre Factions ci-dessus (le
  regroupement par catégorie du sélecteur, `filtrer()` dans
  js/unites.js, n'affichait déjà l'en-tête d'une catégorie que si au
  moins une Unité y est accessible) — confirmé par le même test
  fonctionnel headless sur Anathema Psykana/Legio Custodes/Skitarii,
  chacun n'affichant que ses catégories réellement peuplées ; aucun
  changement de code supplémentaire nécessaire pour ce point précis.

- **Tutoriel Legio Custodes affiné avec son contenu propre à la
  Faction** (pages/construction-liste.html, section
  `construction-armee-legio-custodes`), demande explicite du
  propriétaire à partir des mêmes 4 photos déjà transcrites dans
  `regles-data.js`/`organigramme-data.js` (Postures de Défi, Réaction
  Avancée « La Lame se Scinde », Avantages Principaux Additionnels
  Préfet/Garde Hetaeron, Tactica de Legio « Seule la Mort »). Contenu
  du tutoriel générique laissé intact (Détachement Principal,
  Organigramme, Rôles Tactiques, 5 Avantages Principaux communs), deux
  ajouts propres à cette seule copie du tutoriel (pas les 7 autres
  Factions) :
  1. **Accordéon « Les cases Principales »** complété de 2 entrées
     supplémentaires (Préfet, Garde Hetaeron), l'intro de ce panneau
     mise à jour (« au choix parmi les 5 ci-dessous, plus 2 propres à
     la Legio Custodes ») — reformulées en langage pédagogique
     (« Conseil pratique » comme les 5 entrées déjà existantes) plutôt
     que recopiées mot pour mot depuis `organigramme-data.js`, mais
     sans rien perdre du mécanisme (Préfet réservé au Capitaine-
     rempart uniquement, +1 PV de Base + Officier de Ligne (2) ; Garde
     Hetaeron ouvert à toute Unité de Case Principale, Guerrier Éternel
     (X) porté à 2, restriction 0-1 par Armée sauf Figurines à Trait
     Exemple d'Or).
  2. **3 nouveaux panneaux de timeline**, ajoutés à la toute fin (à
     l'emplacement qu'occupait « Décurion de Légion » avant d'en être
     retiré pour cette Faction) : « Tactica de Legio : Seule la Mort »,
     « Postures de Défi de la Legio Custodes » (accordéon des 4
     Postures : Élan du Rapace, Frappe des Cieux, Fléau du Serpent du
     Monde, Égide de la Pierre), et « Réaction Avancée : La Lame se
     Scinde ». Même traitement : texte de règle condensé en prose
     pédagogique + tooltips `.regle-tag` réutilisant le texte exact déjà
     validé dans `regles-data.js` (ex : Guerrier Éternel (X), Touche
     critique (X) — cette dernière entrée du glossaire est en fait
     « Touche critique » avec un « c » minuscule, à ne pas confondre
     avec une typo lors d'une future réutilisation), plus un « Conseil
     pratique » nommant des Unités réellement transcrites (Capitaine-
     rempart, Sodalité de Motojets Gyrfalcon, Char Antigrav Caladius,
     les 3 Sodalités de Gardes de base) plutôt que des exemples
     génériques.
  Vérifié par test fonctionnel headless : les 8 chaînes de texte
  attendues (Seule la Mort, les 4 Postures, La Lame se Scinde, Préfet,
  Garde Hetaeron) sont bien présentes dans la section Legio Custodes ;
  HTML entièrement bien formé (parseur de balises, 0 erreur, aucune
  balise orpheline) ; aucune régression sur les tests d'ajout d'Unité
  Legio Custodes/Anathema Psykana ni sur la fuite de Factions déjà
  vérifiés plus haut.

- **Tutoriel Conclaves Skitarii affiné avec son contenu propre à la
  Faction** (pages/construction-liste.html, section
  `construction-armee-skitarii`), demande explicite du propriétaire à
  partir du PDF officiel « Conclaves Skitarii » (GW 2025, déjà en
  français — pas une transcription manuelle depuis une photo). Avant
  d'écrire quoi que ce soit, vérifié que le tutoriel **Mechanicum**
  existant (`construction-armee-mechanicum`) suit un tout autre moule
  que le tutoriel générique Legio Astartes copié pour Skitarii/Legio
  Custodes/Anathema Psykana : un tutoriel entièrement sur-mesure
  centré sur SES mécaniques propres (Traits de Faction/Techno-arcanes
  Majeurs, Détachements Auxiliaires additionnels, Cybertheurgie,
  Renégats/Hétérodoxes), sans reprendre l'Organigramme/les Rôles
  Tactiques génériques déjà couverts ailleurs. Faute d'une refonte
  complète (hors demande explicite), retenu le même compromis que pour
  Legio Custodes : conserver le tronc commun générique déjà en place
  (Détachement Principal, Organigramme, Rôles Tactiques, 5 Avantages
  Principaux communs) et y AJOUTER deux nouveaux panneaux de timeline,
  à l'emplacement qu'occupait « Décurion de Légion » avant d'en être
  retiré pour cette Faction :
  1. **« Sous-factions des Conclaves Skitarii »** : explique le
     mécanisme du Trait générique « [Skitarii] » remplacé par un des 4
     Traits de Faction (Acquisitor → Ligne (1) ; Expurgator →
     Avant-garde (3) ; Vindicator, réservé Loyaliste → +1 à toute
     Déflagration (X) ; Flagellator, réservé Renégat → +1" de Mouvement
     de Positionnement jusqu'à 6" max), présenté en accordéon comme les
     5 Avantages Principaux du tronc commun, avec la contrainte
     d'uniformité par Détachement. Complété d'un encadré séparé pour
     « Vassaux des Seigneurs des Forges » (un Détachement Allié
     Conclaves Skitarii d'une Armée Taghmata du Mechanicum ne compte
     pas dans le plafond de 50 % de la Limite de Points réservé aux
     Alliés) — règle utile pour qui joue Mechanicum/Skitarii ensemble,
     absente du tronc commun.
  2. **« Réaction Avancée : Maréchal Élu »** : reprend le texte déjà
     validé de `regles-data.js` (Réaction Avancée qui promeut un
     Ordinator au Sous-type État-major et lui accorde Icône d'Autorité
     sur une Arme de Mêlée, quand le Maréchal des Pérégrins de Combat
     Skitarii amie tombe à 0 PV), condensé en prose pédagogique avec
     tooltips `.regle-tag` réutilisant mot pour mot les textes déjà en
     place (Icône d'Autorité, Ligne (X), Avant-garde (X)).
  PDF vérifié en même temps contre les 3 Unités déjà transcrites
  (Maréchal des Pérégrins de Combat Skitarii, Corpus de Pérégrins de
  Combat Skitarii, Ost de Glaneurs) et les 5 autres (Automate-stratos
  Vultarax, Convoyeur Blindé Triaros, Char d'Assaut Karacnos, Char de
  Combat Krios, Chasseur de Chars Krios Venator) : aucun écart trouvé
  avec `unites-data.js`/`armes-data.js` (déjà exacts depuis la session
  de transcription initiale), rien à corriger côté données de jeu —
  seul le tutoriel manquait ce contenu.
  Vérifié par test fonctionnel headless : les 7 chaînes de texte
  attendues (Acquisitor, Expurgator, Vindicator, Flagellator, Vassaux
  des Seigneurs des Forges, Maréchal Élu, Icône d'Autorité) sont bien
  présentes dans la section Skitarii ; HTML entièrement bien formé (0
  erreur) ; aucune régression sur les tests déjà en place (tutoriels
  des 8 Factions, ajout d'Unité Legio Custodes/Anathema Psykana, fuite
  de Factions).

- **Tutoriel Anathema Psykana affiné avec son contenu propre à la
  Faction** (pages/construction-liste.html, section
  `construction-armee-anathema-psykana`), demande explicite du
  propriétaire à partir des mêmes photos déjà utilisées pour créer la
  Faction. Deux nouveaux panneaux ajoutés à la toute fin (à
  l'emplacement qu'occupait « Décurion de Légion »), même principe que
  Legio Custodes/Skitarii :
  1. **« L'Anathema Psykana en Guerre »** : rappelle que cette Liste
     d'Armée n'a pas de variante Renégate (Trait fixe Loyaliste, déjà
     appliqué en dur dans le moteur) et détaille l'encadré « Point de
     Réaction Bonus » (un Point de Réaction bonus pour le Détachement
     Principal s'il inclut une Unité à Trait Investigatus-Militant —
     Chevalière Centura ou Jenetia Krole), déjà transcrit dans
     `regles-data.js` mais absent du tutoriel jusqu'ici.
  2. **« Tactica de Divisio : Anathème »** : même traitement que
     « Seule la Mort » (Legio Custodes) — prose pédagogique + tooltip
     `.regle-tag` reprenant le texte exact de `regles-data.js`, plus un
     Conseil pratique reliant la Règle à Haine (Psykers, Maléfiques),
     déjà présente sur la plupart des Unités de cette Faction.
  **Vraie correction trouvée en relisant une photo plus nette de « La
  Sororité Silencieuse »** (pas seulement une reformulation pour le
  tutoriel) : l'entrée de glossaire « Anathème » elle-même
  (`regles-data.js`) omettait que la clause d'immunité aux Jets de
  Blessure non modifiés de 1 à 4 contre une Unité entièrement Anathème
  ne s'applique QUE via une Arme ayant le Trait Psychique ou
  Immatériel — ma transcription précédente disait « les Jets de
  Blessure faits pour des Attaques… » (n'importe quelle Attaque),
  perdant cette restriction essentielle. Corrigée en « les Jets de
  Blessure faits pour des Armes qui ont le Trait Psychique ou
  Immatériel… », conforme au texte du livre. Aucune Unité ne référence
  encore cette Règle Spéciale ligne à ligne (même gap déjà documenté
  pour Seule la Mort/les Postures Legio Custodes : pas de mécanisme de
  rattachement Trait → Règle Spéciale automatique sur ce site), donc
  cette correction ne touchait que le texte de glossaire lui-même, pas
  une Unité.
  Vérifié par test fonctionnel headless : les 4 chaînes attendues
  (Point de Réaction Bonus, Investigatus-Militant, Anathème, Aptitudes
  Psychiques) sont bien présentes dans la section ; `node --check`
  passe sur `regles-data.js` après la correction ; HTML entièrement
  bien formé (0 erreur) ; aucune régression sur les tests déjà en
  place (tutoriels des 8 Factions, ajout d'Unité Legio Custodes/
  Anathema Psykana, fuite de Factions).

- **Skins couleurs seules pour Legio Custodes, Anathema Psykana et
  Conclaves Skitarii** (`SKIN_LEGIO_CUSTODES`/`SKIN_ANATHEMA_PSYKANA`/
  `SKIN_SKITARII`, `js/organigramme.js`) : sur le même principe que
  `SKIN_MECHANICUM` (classe CSS sur `<body>`, bannière avec devise) mais
  **sans blason** — confirmé par AskUserQuestion (« Palette de couleurs
  seule, sans blason (recommandé) ») faute d'image officielle fournie ou
  à inventer pour ces trois Factions. Palettes choisies et validées
  WCAG 1.4.3/RGAA 3.2 (contraste `--accent-clair` sur fond blanc ≥4.5:1,
  script Node de luminance relative en scratchpad, même méthode que pour
  Questoris Imperialis/Mendicus) : Legio Custodes = or impérial
  (`--accent: #7d5c17`, `--accent-clair: #916d1c`, 6.15:1/4.76:1) ;
  Anathema Psykana = gris graphite froid (`#3d3e44`/`#54555c`,
  10.65:1/7.42:1) ; Conclaves Skitarii = cuivre/rouille (`#7a4a1e`/
  `#9c611c`, 7.43:1/5.07:1). Blocs CSS `body.skin-legion-legio-custodes`/
  `-anathema-psykana`/`-skitarii` ajoutés à `css/style.css` juste après
  celui de Mechanicum, même structure (accent, accent-clair,
  fond-secondaire, carte-hover, dégradés radiaux teintés). Bannière
  ajoutée dans `js/organigramme.js` (nouvelles branches `else if
  (skinLegioCustodes)`/`(skinAnathemaPsykana)`/`(skinSkitarii)` juste
  après celle de Mechanicum, sans logique d'icône puisqu'aucun blason)
  et propagée aux autres pages via 3 nouvelles branches dans
  `appliquerSkinLegionGlobal()` (`js/main.js`), sans hook
  `DOMContentLoaded` d'insertion de logo (contrairement aux skins à
  blason). Pas de hook page de garde PDF/Word ajouté non plus, cohérent
  avec Mechanicum qui n'en a pas. `couleursExport()` (js/unites.js) lit
  déjà `--accent`/`--accent-clair` directement depuis le style calculé
  du `<body>` : aucune modification nécessaire là pour que l'export
  PDF/Word hérite de la nouvelle palette. Vérifié par test jsdom dédié
  (bascule de Faction dans les paramètres de la partie, lecture des
  classes CSS et des variables calculées) : les trois palettes
  s'appliquent correctement et n'affectent pas la Faction Legio Astartes
  par défaut.

- **Page de garde PDF/Word enrichie pour Chevaliers Questoris (identité
  de Maisonnée), Legio Custodes, Anathema Psykana et Conclaves
  Skitarii** (`js/unites.js` : `genererPDF`/`genererWordHTML`) —
  demande explicite du proprio de s'inspirer de la mise en forme déjà
  en place pour une Légion Legio Astartes (blason + nom centrés, devise/
  identité centrée en dessous). Avant cette session, SEULES les
  Légions/Legio Titanicus/Solar Auxilia (Désignation+Doctrine de
  Cohorte) avaient un tel bloc d'identité sur la 1ère page ; Chevaliers
  Questoris, Legio Custodes, Anathema Psykana et Conclaves Skitarii
  n'avaient RIEN (page de garde qui sautait direct au total de
  l'Armée) — vérifié en lisant le code avant de conclure, pas supposé.
  Nouveaux accesseurs `Organigramme.skinMaisonActuel()`/
  `cheminLogoMaisonActuel()` (miroir exact de `skinDesignationActuel`/
  `cheminLogoDesignationActuel`) et `skinLegioCustodesActuel()`/
  `skinAnathemaPsykanaActuel()`/`skinSkitariiActuel()` (miroir de
  `skinActuel`, mais sans blason — renvoient directement
  `SKIN_LEGIO_CUSTODES`/`SKIN_ANATHEMA_PSYKANA`/`SKIN_SKITARII` déjà
  posés pour le skin couleurs seules ci-dessus). Nouvelle constante
  `DETACHEMENT_PARADIGME_MAISONNEE` (`js/organigramme.js`, table de
  correspondance imperialis→Maisnie Roturière/mechanicum→Serre
  d'Automates/mendicus→Serre d'Armigères, reprise telle quelle du
  commentaire CLAUDE.md ci-dessus, pas inventée) : sert uniquement à
  NOMMER sur la page de garde le Détachement Additionnel débloqué par
  le Paradigme choisi, sans texte de règle complet (aucun paragraphe de
  Paradigme n'existe dans `REGLES_DIVERSES`, contrairement à une
  Doctrine de Cohorte Solar Auxilia — se limiter à ce qui est sûr plutôt
  que de rédiger un résumé de mécanique inventé). Bloc Maisonnée : logo
  et nom (Questoris Imperialis/Mechanicum/Mendicus) centrés, devise de
  `SKINS_MAISONNEE` centrée en dessous, puis « Paradigme de Maisonnée :
  débloque le Détachement Additionnel X » en italique. Bloc Legio
  Custodes/Anathema Psykana/Conclaves Skitarii : nom seul centré en gras
  (pas de logo, cohérent avec leur skin couleurs seules), devise centrée
  en dessous — même structure que le repli « nom de Cohorte seul » déjà
  utilisé par Solar Auxilia sans Désignation. Les quatre nouveaux blocs
  s'intercalent dans la chaîne `if (skin) {...} else if (skinTitan)
  {...} else if (skinMaison) {...} else if (skinSansBlason) {...} else
  {...Solar Auxilia...}` du PDF et du Word, sans toucher aux branches
  Légion/Titan/Solar Auxilia déjà existantes. Vérifié par test jsdom
  dédié (`genererWordHTML`/`genererPDF` appelés directement pour les 7
  Factions concernées, y compris les 3 Maisonnées une par une) : chaque
  page de garde affiche le bon bloc, aucune exception, aucune
  régression sur Legio Astartes/Chevaliers Questoris déjà en place.

- **Bloc « Voir le tutoriel » déplacé sous les paramètres de la partie,
  pour les 8 Factions** (`pages/construction-liste.html`) — demande
  explicite du proprio (capture d'écran à l'appui) : les 8 `<section
  id="construction-armee...">` (une par Faction, ~6235 lignes au
  total) se trouvaient toutes AVANT la section « Paramètres de la
  partie » (`#orga-parametres`, généré par
  `Organigramme.construireParametres`) ; déplacées en bloc pour se
  trouver maintenant APRÈS elle, sans aucune autre modification de leur
  contenu interne. Manipulation faite par script Node (découpage par
  index de ligne plutôt qu'Edit à la main, vu la taille du bloc) :
  vérifié avant tout par relecture précise des lignes pivot (début/fin
  du bloc tutoriel, début/fin de la section Paramètres) pour ne perdre
  ni dupliquer aucune ligne (compte de lignes identique avant/après).
  Sûr car `actualiser()` (js/organigramme.js) ne retrouve chaque section
  QUE par `document.getElementById(...)`, jamais par position/voisinage
  DOM — confirmé par grep avant de faire le déplacement. Vérifié après
  coup : HTML toujours bien formé (vérificateur Python de balances, 0
  erreur) ; test jsdom existant (bascule des 8 Factions, visibilité de
  section, contenu Anathema Psykana) toujours au vert sans aucune
  régression.

- **Bouton « Dupliquer » sur chaque carte d'unité** (`js/unites.js` :
  `construireCarte`/nouvelle fonction `dupliquerUnite`, entre
  « ▸ Détails » et « Retirer » dans l'en-tête de carte, demande
  explicite du proprio) : nouvel exemplaire avec EXACTEMENT la même
  configuration (`variante`, `effectif`, `valeurs` des options) que
  l'original — pas une unité « neuve » repartant des valeurs par
  défaut. Copie profonde de `valeurs` (les tableaux d'une option
  `multi` ne doivent pas rester partagés entre original et copie,
  sinon cocher/décocher une entrée sur l'un affecterait l'autre).
  Refusé (avec le même message d'aide que « Ajouter à la liste »,
  réutilise `#ajout-message`) si un exemplaire de plus n'est pas
  réellement autorisé par les règles — RÉUTILISE TELLES QUELLES les
  deux vérifications déjà faites pour un ajout normal, sans les
  dupliquer : `uniteAccessible(unite)` (quota `maxParArmee`,
  `excluAvec`, personnage nommé déjà présent, Faction/Légion/
  Allégeance en vigueur) puis `Organigramme.casesLibresPour(unite)`
  (Case libre compatible avec le Rôle Tactique de l'unité, dans un
  Détachement déjà présent dans l'Armée) — si aucune Case libre,
  message `Organigramme.suggestionPourRole(unite)`, identique à celui
  affiché après un clic sur « Ajouter » sans Case libre. La nouvelle
  carte est insérée juste APRÈS l'originale (`insertAdjacentElement`)
  plutôt qu'en fin de liste, pour rester visible sans avoir à faire
  défiler — contrairement à l'ajout normal, qui vise `#liste-unites`
  directement. Bouton stylé `.unite-dupliquer` (même gabarit que
  `.unite-bascule`/`.unite-retirer`, css/style.css), masqué à
  l'impression comme les deux autres. Vérifié par test jsdom dédié
  (recherche + sélection d'une Escouade Tactique via le combobox —
  piège : la sélection à la souris se fait sur `mousedown`, pas
  `click`, voir `initialiserChoixUnite` — puis ajout et 4 tentatives de
  duplication successives) : la duplication réussit tant qu'une Case
  Troupes reste libre dans le Détachement Principal (max 4), puis est
  refusée avec le message exact attendu (« Aucune Case libre pour le
  Rôle Tactique « Troupes »… ») dès que le quota est atteint, sans
  créer de 5ᵉ carte.

- **Tampon d'inquisition du PDF repositionné** (`js/unites.js`,
  `genererPDF` — tampon décoratif `assets/img/logo_inquisition.png`
  posé sur la page de garde) : demande initiale du proprio (l'agrandir,
  `TAILLE_TAMPON` doublée de 130 à 260) revenue sur elle-même la
  session suivante — le proprio voulait en fait le même agrandi mais
  déplacé, la bonne demande étant de le rapprocher du haut de page.
  `TAILLE_TAMPON` ramenée à 130 (taille d'origine, inchangée), et la
  coordonnée Y divisée par deux (`(MARGE + 40) / 2` au lieu de
  `MARGE + 40`) pour le rapprocher deux fois plus près du haut de la
  page. Ne pas réappliquer l'agrandissement : la demande retenue au
  final ne porte que sur la position, pas la taille.
- **Frise « Ordre de déploiement » mise à jour** (`index.html`) :
  Legio Custodes et Anathema Psykana déplacées de la Phase II (« En
  approche ») vers la Phase I (« Déployée »), cohérent avec leur
  transcription complète lors d'une session précédente ; Divisio
  Assassinorum ajoutée en Phase II.

- **Page d'Arsenal « Forces de l'Empereur » (Legio Custodes) transcrite
  depuis des photos fournies par le propriétaire** — comble le plus
  gros gap documenté jusqu'ici (voir plus haut, section roster Legio
  Custodes : « aucune page d'Arsenal n'a été fournie pour ce lot de
  fiches »). Nouvelles catégories dans `js/armes-data.js`, Tir et
  Mêlée : Armes Cinétiques, Armes à Bolts Lastrum, Armes à Cascade de
  Neutronium, Armes Adrathiques, Armes Laser Arachnus, Armes de Gardien
  (profil double Tir/Mêlée, convention `(Tir)`/`(Mêlée)` comme « La
  Lance Apollonienne » plutôt que le marqueur ¹ de Lance adrasite/
  pyrithite, car les noms bruts déjà utilisés dans `unites-data.js`
  — Lance de Gardien, Lame de Sentinelle, Lance Verutum, Affrelance
  Achillus, Lame de Galatus, Lance d'Éternité — n'ont pas ce marqueur),
  Lanceurs Spiculus, Armes Laser Corvae, Armes à Flammes Infernus,
  Armes Accélératrices Iliastus, Armes d'Éternité (Lame d'Éternité,
  Mêlée seule), Armes Solarites, Armes Diverses (Mine à cascade de
  Neutronium) et Armes de la Sororité Silencieuse (Tir : Arroi de
  canons lourd Hellion, Missiles vratins lourds ; Mêlée : Espadon
  d'exécution) — ces deux dernières profitent en fait à l'Anathema
  Psykana (Jenetia Krole/Chevalière Centura/Acquisitor Kharon), dont le
  wargear restait en texte brut faute de profil. La page « Armes à
  Plasma » de ce même chantier s'est révélée être exactement l'Arsenal
  générique déjà présent dans ce fichier (mêmes noms, mêmes stats) :
  rien à dupliquer. Pistolet archéotech/Pistolet bolter/Bolter/
  Lance-flammes de la page Sororité Silencieuse, idem (génériques déjà
  existants, non dupliqués).
  **Bug de transcription corrigé** : « Lame de parangon » (arme
  générique Legiones Astartes déjà utilisée par une quinzaine
  d'Unités) portait `traits: "-"` au lieu de `"Énergétique"` — corrigé
  d'après cette nouvelle page qui la liste avec ce Trait, cohérent avec
  toutes les autres armes énergétiques du fichier.
  Règles Spéciales (`js/regles-data.js`) : ajoutées Annihilation en
  Cascade (X), Ex Oblivio (texte intégral, remplace l'entrée « nom seul »
  posée lors de la création de l'Anathema Psykana), Coups Éclairs,
  Vexillum du Magisterium (distincte du Vexillum générique déjà
  existant — bonus de Résolution de Combat — qui est une tout autre
  Règle malgré le nom proche, comme Vexillum des Cohortes/Vexillum
  Auxilia déjà coexistants), Misericordia (avec le profil de « La Lame
  de Miséricorde » décrit en prose, faute de mécanique de profil
  variable-par-Figurine modélisable autrement dans ce fichier), Bouclier
  éclipse, Fumigènes ; complétées avec le texte intégral désormais
  disponible : Choc (X), Combi, Orage de Feu, Anathème (ajoute les
  clauses d'immunité aux Pouvoirs/Armes/Réactions Psychiques et Périls
  du Warp qui manquaient depuis la création de l'Anathema Psykana).
  **Collision de nom relevée et volontairement non résolue** : la
  Règle Spéciale d'Arme « Choc Psy » (Missiles vratins lourds) porte
  exactement le même nom que la Réaction Avancée « Choc Psy » de la
  Désignation Gardespire Prosperienne (Thousand Sons, Solar Auxilia)
  déjà transcrite — `trouverDefinitionRegle` (js/main.js) indexe par
  nom normalisé dans une seule Map partagée par tout le site (tables
  d'Armes et Règles Spéciales d'Unité confondues), donc une seconde
  entrée sous ce nom écraserait silencieusement l'une des deux
  définitions sans distinction de contexte possible : non ajoutée,
  gap documenté en commentaire dans `regles-data.js` à cet endroit
  précis plutôt que de deviner laquelle des deux mérite le nom.
  Panique (X)/Négligence/Détonation/Bocle Tarsus/Bouclier Praesidium/
  Dissimulation (X)/Brise-blindage (X)/Poursuite Rapide déjà exacts,
  vérifiés conformes sans modification.

- **Nouvelle Faction « Divisio Assassinorum » (livre d'armée officiel),
  1ʳᵉ Unité — Assassin Adamus (Appui, 125 Points)** : architecture
  fondamentalement différente des Factions précédentes (Legio Custodes/
  Anathema Psykana/Skitarii), le livre précisant explicitement qu'« un
  Détachement ne peut jamais être de la Faction Divisio Assassinorum ».
  `faction: "divisio-assassinorum"` volontairement **ABSENTE** de
  `FACTIONS` (js/organigramme.js) : pas de menu Faction, pas de
  Détachement Allié possible, pas de skin/tutoriel dédié. Les Unités de
  cette Liste d'Armée ne sont accessibles que via le nouvel Avantage
  Principal **Agent de Clade** (`js/organigramme-data.js`,
  `AVANTAGES_PRINCIPAUX`) : réservé à une Unité d'Allégeance Loyaliste
  sur une Case Principale du Détachement Principal (une fois par
  Armée), il ajoute une Case de Rôle Tactique Appui réservée à la
  Divisio Assassinorum — quelle que soit la Faction du Détachement qui
  la porte (Legio Custodes, Legio Astartes...). Le livre autorise
  d'ajouter TROIS Cases d'un coup ; par cohérence avec la
  simplification déjà assumée pour Bénéfice Logistique/Le Salaire de la
  Traîtrise (« un seul détachement ne porte jamais plus d'une case
  ajoutée à la fois »), une seule est modélisée ici.
  Trois mécanismes génériques nouveaux, réutilisables pour toute future
  Faction du même genre (« Prime Advantage » de Faction hors
  organigramme normal, à ne pas confondre avec les Avantages Principaux
  de Cases Principales déjà existants) :
  1. `loyaliste: true` sur un Avantage Principal (miroir exact de
     `renegat: true` déjà existant, ex. Vrais Croyants) — grisé si
     `etat.allegeance !== "loyaliste"` (`avantagesPossibles`,
     js/organigramme.js).
  2. `principalUniquement: true` — grisé si la Case n'est pas dans un
     Détachement de `famille: "principal"` (nouveau champ, aucun
     Avantage précédent n'avait cette restriction).
  3. `factionCaseAjoutee: "<id Faction>"` sur un Avantage `ajouteCase` —
     la Case AJOUTÉE (pas la Case qui porte l'Avantage) n'accepte que
     cette Faction précise, vérifié par un nouveau garde-fou en tête de
     `caseAccepte()` (`caseOrga.extra && caseOrga.origineAvantage`,
     lookup de l'Avantage d'origine) qui court-circuite le filtre de
     Faction habituel (celui du Détachement) pour cette seule Case.
     Nouvelle méthode `Organigramme.factionsDebloqueesParAvantage()`
     (miroir de `factionsAlliees()`) : scanne toutes les Cases
     `extra` de l'Armée et retourne les Factions ainsi débloquées,
     consommée par `uniteAccessible()` (js/unites.js) en plus de
     `factionsAllieesActuelles`/`uniteAccessibleParDetachementCroise` —
     nécessaire précisément parce que cette Faction ne peut JAMAIS être
     un Détachement Allié (donc invisible sans ce 3ᵉ chemin
     d'accessibilité).
  Assassin Adamus : Trait fixe « Divisio Assassinorum » (SANS crochets,
  contrairement à « [Legio Custodes]»/« [Anathema Psykana]» — le livre
  ne le présente pas comme un Trait générique à substituer, donc pas
  masqué sur la fiche récap) + « Serres de l'Empereur » (même Trait
  organisationnel générique déjà utilisé par l'Anathema Psykana, sans
  texte connu). Tactica de Divisio **Némésis** (texte intégral dans
  `js/regles-data.js`) volontairement NON injectée automatiquement dans
  `regles` — même gap déjà documenté pour Seule la Mort/Anathème (pas de
  mécanisme de rattachement Trait → Règle Spéciale générique). Équipement :
  Éclateur à aiguilles (arme Combi à 2 profils, Pistolet bolter
  Principal + Lance-aiguilles Secondaire — même convention de nommage
  « — X (Principal/Secondaire) » qu'Arquebuse à bolts Adrastus déjà
  existante), Lame Nemesii (profil Mêlée simple), Grenades Nemesii
  (texte de règle seul, pas de profil d'Arme — Charge systématiquement
  Désordonnée + Terrain Dangereux). Règles Spéciales propres : Artisan
  de Mort (Posture de Défi « Forme Miroir », texte intégral) et
  Négligence (déjà existante, réutilisée telle quelle). Nouvelle
  catégorie d'Arsenal « Armes de la Divisio Assassinorum »
  (`armes-data.js`, Tir et Mêlée).
  Vérifié par test fonctionnel en DOM headless (jsdom, installé
  temporairement dans le scratchpad de session — pas de dépendance npm
  dans ce dépôt) : Assassin Adamus absent du sélecteur « Unité à
  ajouter » par défaut (Legio Astartes ET Legio Custodes sans Agent de
  Clade), apparaît et s'ajoute correctement dès qu'Agent de Clade est
  choisi sur la Case Principale d'une Sodalité de Gardes Custodiens
  dans un Détachement Principal Legio Custodes.

- **2ᵉ Unité Divisio Assassinorum — Assassin Callidus (Appui, 125
  Points)** : même profil de base que l'Assassin Adamus (M8/CC5/CT5/
  F4/E4/PV3/I5/A4/Cd10/Sf10/Vo7/Int7/Sv4+/Inv4+ — les deux Clades
  d'Assassins partagent apparemment ce socle), mêmes Traits (Loyaliste/
  Divisio Assassinorum/Serres de l'Empereur), accessible par le même
  mécanisme Agent de Clade déjà en place (aucun changement de moteur
  nécessaire, seulement de nouvelles données). Équipement : Neuro-
  lacérateur (Souffle, nouveau profil), Lames empoisonnées (nouveau
  profil, Trait Assaut), Épée de phase (nouveau profil Mêlée, Trait
  Énergétique) — tous ajoutés à la catégorie d'Arsenal « Armes de la
  Divisio Assassinorum » déjà créée pour l'Assassin Adamus. Règles
  Spéciales propres ajoutées à `regles-data.js` : **Polymorphine**
  (ne peut être ciblée par Tir/Charge sauf si elle a déjà attaqué ou
  si un Test d'Intelligence la démasque à 3 pouces), **La Confusion
  Règne** (la première Unité chargée par la Figurine au cours de la
  Bataille est Sonnée), **Décalage de Phase (X)** (Règle Spéciale
  d'Arme portée par l'Épée de phase : ignore Mitigation de Dégâts et
  Sauvegarde si le Jet de Blessure ≥ X). Cette dernière transcrite à
  partir d'une photo partiellement obscurcie par une ombre : le
  passage décrivant précisément l'effet contenait une répétition/
  incohérence OCR (fragment de phrase de habillage flavor mélangé à la
  phrase mécanique) — reformulé en ne gardant que le mécanisme
  effectivement lisible (ignore Mitigation de Dégâts/Sauvegarde au-delà
  du seuil X, ne se déclenche que sur un Jet de Blessure, sans effet
  sur un Jet de Pénétration de Blindage) plutôt que de recopier tel
  quel le texte confus. Vérifié par le même test fonctionnel headless
  que l'Assassin Adamus (recherche « Assassin Callidus » avant/après
  Agent de Clade) : comportement identique.

- **3ᵉ Unité Divisio Assassinorum — Assassin Culexus (Appui, 140
  Points)** : même mécanisme Agent de Clade, aucun changement de
  moteur. Profil légèrement différent des deux autres Clades (Vo 10 au
  lieu de 7, cohérent avec sa thématique anti-psyker). Équipement :
  Animus speculum (nouveau profil de Tir, Trait Assaut — porte la
  Règle Spéciale d'Arme « Choc Psy », qui retombe donc sur le même gap
  de collision de nom déjà documenté pour les Missiles vratins lourds
  de la Legio Custodes : reste sans info-bulle, aucune nouvelle entrée
  ajoutée) et Grenades anti-psy (nouveau profil, **Mêlée** malgré le
  nom — le livre la modélise comme une Arme de Mêlée avec un profil
  MI/MA/MF propre, pas comme une grenade lancée classique). Règles
  Spéciales propres : **Etherium** (texte intégral, réduit de 1 les
  Dégâts d'une Blessure Non Sauvegardée subie par Tir, minimum 1) ;
  Anathème et Ex Oblivio réutilisées telles quelles (déjà établies pour
  l'Anathema Psykana — cohérent, l'Assassin Culexus étant lui aussi un
  Pariah anti-psyker). Paragraphe de fluff omis (même raison que
  l'Assassin Callidus ci-dessus : photo pivotée, texte incohérent
  après OCR). Vérifié par le même test headless : présent seulement
  après sélection d'Agent de Clade.

- **4ᵉ Unité Divisio Assassinorum — Assassin Eversor (Appui, 125
  Points)** : même mécanisme Agent de Clade. Profil distinct des trois
  autres Clades (M6/CT4 au lieu de M8/CT5 — brute de mêlée plus lente
  et moins précise au tir que les autres Assassins). Équipement :
  Pistolet Executioner (arme Combi à 2 profils, même convention de
  nommage « — X (Principal/Secondaire) » que l'Éclateur à aiguilles de
  l'Assassin Adamus), Neuro-gantelet (nouveau profil Mêlée,
  Vulnérante (4+)/Empoisonnée (4+), cohérent avec son thème de toxines
  décrit sur la fiche), Épée énergétique — **réutilise le profil
  générique déjà existant** (Brèche (6+), utilisé par des dizaines
  d'Unités), pas de nouvelle entrée : la photo ne mentionne aucune
  variante propre à ce point pour cette arme précise, à la différence
  du Neuro-gantelet dont le texte de fluff mentionne explicitement un
  poison. Règle Spéciale propre : **Frenzon** (Posture de Défi
  Surcharge Biologique — +3 Attaques et +3 au Jet de Concentration en
  Défi, au prix d'une Blessure automatique par résultat de 1 obtenu à
  un Jet de Touche). Texte reconstruit à partir d'une photo partagée
  avec des répétitions OCR (fragments de phrase dupliqués) : gardé
  seulement le mécanisme clairement identifiable, sur le même principe
  que Décalage de Phase (X) plus haut. Fluff omis (même raison que les
  Assassins Callidus/Culexus). Vérifié par le même test headless.

- **5ᵉ Unité Divisio Assassinorum — Assassin Infocyte Vanus (Appui,
  105 Points)** : même mécanisme Agent de Clade. Seule Unité du Clade
  sans Sous-type Champion (`Type: "Infanterie (Léger)"`, contre
  « Infanterie (Champion, Léger) » pour les quatre autres Assassins) —
  transcrit tel quel depuis la fiche, pas une omission. Équipement :
  deux pistolets laser (**réutilise le profil générique déjà
  existant**, Arsenal des Solar Auxilia — stats identiques vérifiées
  avant tout ajout, aucune nouvelle entrée créée) et Datapics syntones
  (nouveau profil Mêlée). Règles Spéciales propres ajoutées à
  `regles-data.js` : **Infocyte** (donne accès aux Réactions Avancées
  Auspectre et Dérivation de Signum) et **Servomembres Autotomiques**
  (choisit toujours l'option de Répercussions Se Désengager après un
  Combat, quel que soit le vainqueur). Les deux Réactions Avancées
  elles-mêmes (**Auspectre** : intercepte le placement d'un Aéronef
  ennemi sortant des Réserves Aériennes ; **Dérivation de Signum** :
  inflige Neutralisée ou Fixée à une Unité ennemie sortant des Réserves
  à 12 pouces) reconstruites à partir d'une photo avec un texte de
  fluff assez dégradé par l'OCR mais dont la partie mécanique
  (Déclencheur/Coût/Cible/Processus) restait cohérente une fois
  recoupée entre les deux Réactions — condensées en un seul paragraphe
  chacune, même convention que les autres Réactions Avancées déjà
  transcrites dans ce fichier (ex. Maréchal Élu, Skitarii). Fluff de
  l'Unité elle-même omis (même raison que les Assassins précédents).
  Vérifié par le même test headless.

- **6ᵉ et dernière Unité Divisio Assassinorum — Assassin Venenum
  (Appui, 125 Points) : roster des 6 Clades d'Assassins désormais
  complet** (Adamus, Callidus, Culexus, Eversor, Vanus, Venenum).
  Même mécanisme Agent de Clade, profil de base identique à Adamus/
  Callidus/Venenum (M8/CC5/CT5/F4/E4/PV3/I5/A4/Cd10/Sf10/Vo7/Int7/
  Sv4+/Inv4+). Équipement : Éjecteur de toxines et Globes de poison
  (deux nouveaux profils de Tir) et Crochet (nouveau profil Mêlée,
  porte la Règle Spéciale d'Arme « Le Venem »). Règles Spéciales
  propres ajoutées à `regles-data.js` : **Conditionnement
  Contre-nature** (immunise contre Phage (X) et Empoisonnée (X), texte
  intégral clair) et **Le Venem** (poison à retardement : Jet
  d'Endurance à la fin de chaque Tour de Bataille sous peine d'une
  nouvelle Blessure sans Sauvegarde ni Mitigation possible, y compris
  contre une Figurine Embarquée ou en Réserves) — reconstruite à
  partir d'un texte assez répétitif après OCR, en ne gardant que le
  mécanisme clairement identifiable, même principe que Décalage de
  Phase (X)/Frenzon plus haut. Fluff omis (même raison que les
  Assassins précédents). Vérifié par le même test headless.
  **Bilan du chantier Divisio Assassinorum** : nouvelle Faction
  volontairement absente de `FACTIONS` (js/organigramme.js, accès
  exclusivement via le nouvel Avantage Principal Agent de Clade),
  3 nouveaux champs génériques sur les Avantages Principaux
  (`loyaliste`, `principalUniquement`, `factionCaseAjoutee`)
  réutilisables pour toute future Faction du même genre, nouvelle
  méthode `Organigramme.factionsDebloqueesParAvantage()`, et 6 Unités
  Appui complètes avec leurs Armes/Règles Spéciales propres dans
  `armes-data.js`/`regles-data.js`. Chaque nouvelle arme a été vérifiée
  contre les profils déjà existants avant ajout (plusieurs génériques
  déjà en place ont été réutilisées telles quelles — Pistolet bolter,
  Pistolet archéotech, Bolter, Lance-flammes, deux pistolets laser,
  Épée énergétique — évitant ainsi tout doublon).

- **7ᵉ Unité Divisio Assassinorum — Assassin Vindicare (Appui, 150
  Points)** : un 7ᵉ Clade d'Assassin s'ajoute donc au bilan ci-dessus
  (le roster n'était pas complet à 6 en fait). Même mécanisme Agent de
  Clade. Profil distinct des autres (CT7/A2 — meilleur tireur mais
  piètre combattant au contact, cohérent avec le thème sniper). Fluff
  transcrit intégralement cette fois : photo nettement plus lisible que
  les Assassins précédents, sans incohérence de répétition OCR
  détectée à la relecture. Équipement : Fusil Extius et Pistolet
  Extius (deux nouveaux profils de Tir, portée 100 pas pour le Fusil),
  Lame d'Assassin (nouveau profil Mêlée). Règles Spéciales propres :
  **Tir Fatal** (ignore la Dissimulation (X) en tirant, et permet de
  doter toutes les Armes de la Figurine de Meurtrière (5+), Lacération
  (5+) ou Choc (Fixée, Neutralisée) au choix pour l'Attaque de Tir en
  cours) et **Meurtrière (X)** — nouvelle Règle Spéciale d'Arme
  générique ajoutée à `REGLES_ARMES` (pas `REGLES_DIVERSES`, à la
  différence des Règles propres aux Unités) : ignore Guerrier Éternel
  (X) sur un Jet de Blessure ≥ X. Les deux reconstruites à partir d'un
  texte source avec des répétitions OCR, même principe que les Règles
  Spéciales des Assassins précédents (gardé seulement le mécanisme
  clairement identifiable). Vérifié par le même test headless.

- **Trois suppléments « Journal Tactica » (Zone Mortalis, The Forges of
  Saturn, Dropsite) transcrits dans une même session (2026-08-02).**
  Chaque Unité Legio Astartes générique ajoutée sans champ `legion`
  sauf mention contraire ; catégories/restrictions Légion demandées
  explicitement par le proprio, suivies telles quelles même quand elles
  divergeaient du texte du PDF (ex : Char à Missiles Hyperios en
  Seigneurs des Batailles malgré un gabarit de Blindé standard, Maître
  de la Descente réservé Word Bearers malgré un texte de règle
  générique) — confirmées par AskUserQuestion avant d'écrire quoi que
  ce soit de surprenant plutôt que de « corriger » silencieusement.
  **Zone Mortalis** : Escouade de Vétérans Breacher (Zone Mortalis)
  (Elite, doublon volontaire de l'entrée Legacies existante avec des
  coûts différents — créée en Unité séparée sur demande explicite,
  cf. entrée Legacies plus haut), Escouade de Vétérans Despoiler
  (Elite), Section Technicien de Combat Auxilia (Appui, Solar Auxilia),
  Section de Raiders Veletaris (Elite, Solar Auxilia), Manipule
  Castellax Infernus (Appui, Mechanicum, 3ᵉ variante de Castellax).
  **The Forges of Saturn** : Centurion/Escouade de Commandement
  Terminator Saturnine (État-major/Suites, génériques) et Conclave des
  Phraetus Oints (Elite, Word Bearers Renégat) — nouvelle Arme Paire de
  poings disrupteurs Saturnine, Détachement d'Apex Linebreaker Echelon
  et Détachement Auxiliaire Maelstrom Sentry Battery (ce dernier avec
  un gap documenté : aucune Unité Legio Astartes « Batterie Tarantula »
  n'existe encore dans ce fichier pour ses Cases de Reco).
  **Dropsite** : Char à Missiles Hyperios, Escouade de Commandement et
  de Contrôle Augure (Suites), Maître de la Descente (État-major, Word
  Bearers) — Détachement Auxiliaire Fer de Lance de Chute débloqué par
  ce dernier. Page « Additional Prime Advantage » (Cadres
  d'Interdiction) documentée en glossaire texte seul, non modélisée
  mécaniquement : mécanique anglaise du « Prime Slot », déjà notée
  ailleurs dans ce fichier comme non implémentée sur ce site (distincte
  des Avantages Principaux de Cases Principales).
  **Nouveau moteur : sélecteur de Chart de Détachement Principal**
  (`etat.chartPrincipal`, js/organigramme.js) — les trois Charts
  alternatifs de la page « Zone Mortalis Primary Detachments »
  (Strike Force/Bulwark/Linebreaker, `famille: "principal"` dans
  organigramme-data.js, sans condition de Mission Zone Mortalis — non
  modélisée sur ce site) sont désormais sélectionnables via un nouveau
  menu dans les paramètres de la partie (Legio Astartes seulement),
  à la place du Détachement Principal de Croisade standard, sur le
  même principe que le menu Légion/Rite de Guerre. Persisté dans
  localStorage (sauvegarde + validation à la restauration, comme
  `doctrineCohorte`). **Bug trouvé et corrigé pendant le test
  fonctionnel** : le premier jet ne swappait pas réellement le
  Détachement Principal au changement de menu, car `actualiser()` seul
  ne réévalue jamais le type de Détachement Principal attendu (seule
  l'initialisation de page le fait, dans `initialiser()`) —
  contrairement au menu Doctrine de Cohorte (qui ne change jamais le
  résultat d'`idDetachementPrincipal()`), un changement de
  `chartPrincipal` DOIT reconstruire `etat.detachements` explicitement
  avec `creerDetachement(idDetachementPrincipal())`, sur le même
  principe que le handler de changement de Faction.
  **Compositions corrigées (2026-08-02)** après confirmation du
  proprio contre le livre — toutes les premières lectures d'icônes de
  cette session s'étaient révélées imprécises : Zone Mortalis Strike
  Force = 1 QG, 1 État-major, 2 Assaut Lourd, 4 Troupes (Case
  Principale) ; Zone Mortalis Bulwark = 1 QG, 1 État-major, 2 Engins de
  Guerre, 2 Appui, 2 Troupes (Case Principale) ; Zone Mortalis
  Linebreaker = 1 QG, 1 État-major, 2 Assaut Lourd, 2 Troupes, 2 Elite
  (Case Principale) — aucune des trois ne marque la Case État-major
  comme Principale, à la différence du Détachement Principal de
  Croisade. Linebreaker Echelon (Apex, The Forges of Saturn, voir plus
  haut) corrigé en 2 Assaut Lourd (Case Principale) + 1 Suite + 1 Engin
  de Guerre (la première lecture avait retenu 2 Suites + 2 Assaut Lourd
  sans Engin de Guerre). Maelstrom Sentry Battery (Auxiliaire, voir
  plus haut) confirmé exact (2 Appui, 3 Reco) mais sans Case Principale
  (celle posée par erreur sur la première Case d'Appui retirée).
  Vérifié par test fonctionnel jsdom (page réelle) : les 4 options du
  sélecteur, la composition exacte de Cases rendue pour chacun des 3
  Charts, et la disponibilité de Linebreaker Echelon (après Case QG
  remplie) et Maelstrom Sentry Battery (après Maître des Signaux en
  Case d'État-major) dans le panneau « Ajouter un détachement ».

- **Bug de copier-coller corrigé (2026-08-02, signalé par le proprio) :
  Baïonnette générique et Bombes à fusion (Solar Auxilia)**
  (`js/armes-data.js`). La Baïonnette générique portait « Fléau des
  Blindages » (regles), hérité par erreur de la Paire de trépans de
  siège Leviathan juste au-dessus dans le fichier — retiré
  (`regles: "-"`). En vérifiant l'entrée voisine, même artefact trouvé
  sur les Bombes à fusion (Solar Auxilia) : Trait `"Baïonnette"` sans
  aucun sens pour une grenade — retiré aussi (`traits: "-"`). À
  garder en tête pour toute future relecture d'un cluster d'armes
  proches dans ce fichier : un copier-coller depuis l'entrée
  précédente peut laisser une Règle Spéciale ou un Trait orphelin.

- **Bug corrigé (2026-08-02, signalé par le proprio) : MI de l'Épée
  énergétique générique** (`js/armes-data.js`) — valait `"1"` (valeur
  brute sans signe), incohérent avec le reste du fichier (`"+1"` pour
  un vrai bonus d'Initiative comme la Lance énergétique, `"I"` pour un
  profil qui utilise l'Initiative propre au porteur sans modification,
  déjà le cas de l'Épée énergétique Argean juste en dessous — même
  famille d'arme). Corrigé en `"I"`.

- **Session de finition post-suppléments (2026-08-02)**, demandes
  successives du proprio après les chantiers Zone Mortalis/Forges of
  Saturn/Dropsite :
  - **Tri alphabétique** du menu « Unité à ajouter » : chaque
    catégorie trie désormais ses Unités par `nom` (`localeCompare`
    locale "fr") plutôt que par ordre d'apparition dans
    `js/unites-data.js` (`initialiserChoixUnite`, js/unites.js).
  - **Nouvelle Unité Champion de Légion en Armure Terminator**
    (État-major, générique Legio Astartes, 135 Points, deux variantes
    Cataphractii/Tartaros échangeables gratuitement, Ne Jamais Céder
    déjà établi) — compte comme un Champion de Légion pour le
    Détachement Auxiliaire Cadre de Vétérans, dont `deblocage.uniteIds`
    a été complété en conséquence.
  - **Renommages par supplément source**, sur demande explicite du
    proprio pour distinguer les Unités par PDF d'origine dans le
    sélecteur : suffixe « (Zone mortalis) » sur Escouade de Vétérans
    Despoiler/Section Technicien de Combat Auxilia/Section de Raiders
    Veletaris/Manipule Castellax Infernus ; « (Dropsite massacre) » sur
    Char à Missiles Hyperios/Escouade de Commandement et de Contrôle
    Augure/Maître de la Descente ; « (Forges of Saturn) » sur
    Centurion/Escouade de Commandement Terminator Saturnine/Conclave
    des Phraetus Oints. Renommé aussi les 8 Unités « Monté » (Maître
    des Signaux, Seigneur de Forge, Primus Medicae, Delegatus, Devin de
    l'Orage, Tireur de Runes, Porte-Parole des Morts, Diaboliste) en
    « à moto », sur le même principe que « Champion sur moto »/
    « Centurion sur moto » déjà établis — seul le `nom` affiché change,
    jamais l'`id`.
  - **Bug corrigé : Maître de la Descente verrouillé à tort aux Word
    Bearers.** Une session précédente avait posé `legion: "XVII"` sur
    demande explicite, mais en révisant la fiche son texte de règle ne
    mentionne en réalité aucune restriction de Légion — retiré, l'Unité
    est maintenant accessible à toute Légion.
  - **Menu « Chart de Détachement Principal » renommé « Choix de
    Détachement Principal » et étendu à toute Faction sauf Legio
    Titanicus** (auparavant Legio Astartes seulement) — y compris
    Chevaliers Questoris, où ce choix prend désormais le pas sur son
    Détachement Principal de Maisonnées habituel
    (`idDetachementPrincipal()`, js/organigramme.js : `chartPrincipal`
    vérifié avant le cas Chevaliers Questoris, seul Legio Titanicus
    reste prioritaire et non contournable). Le menu lui-même a été
    déplacé hors du bloc de rendu propre à Legio Astartes vers un bloc
    partagé juste avant le menu Allégeance.
  - **Nouvelles restrictions Zone Mortalis** : quand un des 3 Charts
    alternatifs est sélectionné, les Unités Aéronef et les Véhicules à
    plus de 2 PC (Points de Coque) deviennent indisponibles à la
    sélection, quelle que soit la Faction — règle demandée par le
    proprio, sans texte du livre au-delà de la composition des Cases de
    ces Charts. Nouvel accesseur `Organigramme.chartPrincipalActuel()`
    et nouvelle vérification dans `uniteAccessible()` (js/unites.js),
    évaluée sur `unite.variantes` (Aéronef détecté par sous-chaîne dans
    `type`, PC lu dans `profilVehicule.PC`) : une Unité avec plusieurs
    variantes n'est bloquée que si AU MOINS une variante correspond,
    jamais à cause d'une variante sans rapport de la même Unité.
    Vérifié par test fonctionnel jsdom (page réelle) : Fire Raptor,
    Char à Missiles Hyperios et Rhino disparaissent bien du sélecteur
    dès qu'un Chart Zone Mortalis est actif (Praetor, Infanterie, reste
    disponible), et réapparaissent au retour au Détachement Principal
    de Croisade standard.
  - **3 nouvelles sources** ajoutées à `SOURCES_SITE` (js/main.js),
    juste après Liber Mechanicum : Journal Tactica The Isstvan V
    Dropsite Massacre, Journal Tactica The Forges of Saturn, Journal
    Tactica Zone Mortalis (liens boutique warhammer.com/fr-FR).

- **Nouvelle Faction « Démons de la Tempête de la Ruine » (`faction:
  "daemons-ruinstorm"`, PDF « Legacies of the Age of Darkness : Daemons
  of the Ruinstorm », Third Edition v1.0)** : Faction complète (comme
  Legio Custodes/Anathema Psykana/Skitarii/Divisio Assassinorum), **PAS**
  des ajouts Legacy sur un roster de Légion existant — `legacy: true`
  volontairement absent des 14 Unités, cohérent avec le précédent déjà
  établi pour ces autres Factions complètes tirées d'un PDF « Legacies »
  (voir la note « legacy:true ≠ PDF Legacies », mémoire auto). Traduction
  « Démons de la Tempête de la Ruine »/« Brutes Démoniaques de la Tempête
  de la Ruine » **retrouvée telle quelle déjà en dur** dans
  `organigramme-data.js` (Détachement Auxiliaire « Manifestation
  Démoniaque », préparé par anticipation lors d'une session antérieure,
  avec un `indisponible` signalant l'absence des Unités) : réutilisée
  sans invention, et ce gap comblé (`factionLibre: true` ajouté au
  Détachement — il lui manquait pour accepter des Unités d'une Faction
  différente de celle de l'Armée, sur le même principe que « Tercio de
  Fer » (Solar Auxilia/Mechanicum) — `restrictions` pointe maintenant
  vers `ruinstorm-brutes`, `indisponible` retiré).
  **Allégeance verrouillée sur Renégat** (aucune variante Loyaliste dans
  ce livre d'armée) : miroir exact et inversé du verrouillage Loyaliste
  déjà en place pour Legio Custodes/Anathema Psykana — mêmes 4 points de
  forçage (restauration localStorage, changement de Faction, verrouillage
  + info-bulle du `<select>` Allégeance) dupliqués en sens inverse dans
  `js/organigramme.js`. Toutes les Unités portent le Trait fixe
  « Renégat » (traduction retenue pour le Trait « Traitor » du PDF — seul
  mot-clé reconnu par `uniteAccessible`, pas de nouveau mot-clé
  « Traître » introduit).
  **Mécanisme « Dominion Éthérique » (Æthetic Dominion, p. 3-6)** :
  8 Traits nommés (Ruine Rampante/Massacre Insouciant/Corruption
  Putride/Sensation Extatique/Distorsion Informe/Tempête Infernale/
  Dissolution Vorace/Artifice Malveillant), choisis **UNE SEULE FOIS
  POUR TOUTE L'ARMÉE** (le livre l'exige au niveau Armée, pas par
  Détachement comme le Techno-arcane Mechanicum, ni par Unité comme le
  Trait Skitarii) — nouveau menu « Dominion Éthérique » dans les
  paramètres de la partie (`etat.dominion`, simple chaîne = le nom
  français choisi, pas un id séparé — choix de simplicité), sur le
  même moule que le menu Légion/Maisonnée mais SANS confirmation de
  réinitialisation de l'Armée au changement (ce choix ne change jamais
  quelles Unités sont accessibles, seulement le Trait affiché sur leur
  fiche). Nouvelle fonction `dominionEtheriqueDe(unite)`
  (js/unites.js, miroir simplifié de `traitFactionMechanicumDe`/
  `traitFactionSkitariiDe`) : résout le placeholder « [Dominion
  Éthérique] » en le choix d'Armée (pas d'option par Unité), retourne le
  Trait déjà fixe pour Ka'bandha/Cor'bax Utterblight/Samus (Dominion
  imposé par leur fiche, non remplaçable — respecte la règle du livre).
  Pas de hook `caseAccepte`/uniformité par Détachement nécessaire
  (contrairement à Mechanicum/Skitarii) : un seul choix d'Armée est
  déjà uniforme par construction. **Gap volontairement non modélisé** :
  l'octroi conditionnel du Trait Psyker + Disciplines Psychiques (payant,
  réservé État-major/Champion) à une Figurine ayant un Dominion Éthérique
  n'est pas appliqué mécaniquement (texte transcrit intégralement dans
  `regles-data.js` mais ce fichier ne modélise déjà les Pouvoirs
  Psychiques d'aucune autre Faction individuellement) ; de même pour le
  Prime Advantage « Paragon of Malevolence » (Malevolent Artifice, p. 6 —
  mécanique de Prime Slot déjà non modélisée sur ce site, voir Legio
  Custodes/Inductii) et pour la règle d'Armée « Additional Reaction
  Point » (p. 6, texte informatif seul dans `regles-data.js`, entrée
  « Champion de la Tempête de la Ruine » — même limite que État-major
  Suprême de Cohorte/Investigatus-Militant).
  **14 Unités transcrites** : Souverain/Hiérarque/Héraut Démoniaques
  (avec/sans Ailes en 2 `variantes` pour les deux premiers, motif déjà
  établi Centurion à Réacteurs), Brutes/Démons Mineurs/Essaims/Grande
  Bête/Bêtes/Béhémoth/Harceleurs/Cavaliers Démoniaques (génériques,
  Rôles Tactiques Assaut Lourd/Troupes ×2/Appui ×2/Engins de
  Guerre/Reco/Attaque Rapide), et Ka'bandha/Cor'bax Utterblight/Samus
  (Seigneurs des Batailles, Dominion fixe, Type `Parangon (Unique, …)`
  déjà établi ce nom pour Paragon plutôt qu'inventé). Nouvelle
  catégorie d'Arsenal « Armes des Démons de la Tempête de la Ruine »
  (Tir et Mêlée, `armes-data.js`) : toutes les armes de ce PDF ont un
  profil complet donné (aucun gap de profil manquant, cas rare). Trait
  d'Arme « Immaterial » → **Immatériel** (nouveau, jamais utilisé
  ailleurs dans ce fichier). Armement de Ka'bandha (Baneaxe + Ironlash,
  un seul WARGEAR mais deux profils Mêlée/Tir) → **Hache-Fléau** +
  **Lanière de Fer**, listés séparément dans `equipement` pour que les
  deux tables d'Armes s'affichent sur la fiche (Cor'bax a lui deux
  WARGEAR distincts dès le livre : Reaping claws/Noxious vomit →
  **Griffes Moissonneuses**/**Vomissure Nauséabonde**). Deux réutilisations
  de Règles Spéciales déjà établies plutôt que doublons : Aflame (X) →
  **En Feu (X)** (mécanique identique : blessure en Mêlée → malus de
  Commandement) et Armour-breaker (X) → **Brise-blindage (X)** (déjà
  établi pour les Arsenals Chevaliers/Titans) — aucune des deux n'étant
  en fait utilisée par une Unité/Arme de ce PDF, non ajoutées comme
  entrées séparées de `regles-data.js` (auraient pu prêter à confusion
  avec un futur « vrai » Aflame/Armour-breaker distinct si jamais requis
  ailleurs). « Template » (Range + Règle Spéciale, gabarit non-flamme
  générique) → réutilise **Souffle** déjà établi (même mécanique :
  gabarit posé sans Jet de Touche), pas de nouvelle entrée « Gabarit ».
  Vérifié par test fonctionnel en DOM headless (jsdom, scratchpad) :
  bascule de Faction verrouillant l'Allégeance sur Renégat, menu
  Dominion Éthérique peuplé de ses 8 choix, Démons Mineurs (générique)
  accessibles et ajoutables avec le Dominion choisi résolu sur la fiche
  + options fonctionnelles (échange Griffes→Lame/Grande Lame Infernale,
  Projectiles Immatériels, Totem de Dominion), Ka'bandha accessible une
  fois un Détachement de Seigneur des Batailles ajouté avec son
  Dominion fixe et ses deux tables d'Armes (Hache-Fléau/Lanière de Fer)
  correctement résolues, et absence totale d'une Unité Legio Astartes
  (Escouade Tactique) dans le sélecteur tant qu'aucun Détachement Allié
  ne débloque cette Faction — confirmant qu'aucune fuite entre Factions
  n'a été introduite.

- **Bug corrigé (2026-08-02, signalé par le proprio) : l'Avantage
  Principal Préfet (Legio Custodes) ne s'appliquait pas en vrai.**
  Contrairement à ce que documente la note « Application automatique
  des Avantages Principaux "purs" » plus haut, Préfet n'est pas un
  Avantage « pur » (il combine un bonus de Caractéristique ET un gain
  de Règle Spéciale) — mais le proprio l'a explicitement demandé
  malgré tout, à la différence des autres Avantages du même type
  (Résistance Anormale, Paladin de l'Hekatonystika…) restés texte seul
  par choix de conception documenté ailleurs dans ce fichier. Corrigé
  en deux temps : (1) `bonusAvantagePrincipal` (js/unites.js) reçoit un
  nouveau cas `"custodes-prefet"` (+1 PV, sans restriction de
  Sous-type — à la différence de Maître-sergent/Parangon de Bataille,
  qui eux ciblent un Sous-type précis), sur le même mécanisme déjà en
  place pour Maître-sergent/Vétérans de Combat/Parangon de Bataille ;
  (2) `reglesAppliquees: ["Officier de Ligne (2)"]` ajouté à l'entrée
  (js/organigramme-data.js), réutilisant le mécanisme déjà existant
  (reglesAvantagePrincipalDe). Vérifié par test fonctionnel jsdom
  (Capitaine-rempart, Legio Custodes) : PV passe de 3 à 4 et « Officier
  de Ligne (2) » apparaît bien dans les Règles Spéciales de la fiche
  dès que Préfet est choisi sur sa Case Principale.
  **Audit complet des 39 Avantages Principaux du fichier fait dans la
  foulée** (script Node dédié : ids en double, `uniteRequise` pointant
  vers un id/variante d'Unité inexistant) : un second bug réel trouvé
  et corrigé, sans rapport direct avec Préfet — **« Castellan »
  (Imperial Fists) existait deux fois** dans `AVANTAGES_PRINCIPAUX`
  (même id, ajoutées lors de deux sessions différentes : une première
  version sans restriction de variante, une seconde plus précise avec
  `variante: 0` et la référence de page). Comme
  `avantageParId()`/`.find()` (js/organigramme.js) ne retiennent que la
  PREMIÈRE entrée trouvée pour un id donné, la seconde définition
  n'était en réalité jamais consultée — seul le doublon obsolète,
  plus permissif, faisait foi. Doublon obsolète supprimé, la version
  précise conservée ; revérifié par test fonctionnel jsdom (Centurion,
  Imperial Fists) que le menu ne propose plus qu'une seule entrée
  « Castellan » et affiche le bon texte (avec la référence p. 188).
  Tous les autres Avantages sans `reglesAppliquees` restent texte seul
  par choix de conception déjà documenté (échange d'équipement, gain
  de Sous-type, choix d'une seconde Unité — voir la note MODÈLE DE
  DONNÉES sur `reglesAppliquees` plus haut) : aucune autre anomalie
  structurelle trouvée par l'audit (aucun autre id en double, aucune
  autre référence `uniteRequise` cassée).

- **Bug corrigé (2026-08-02, suite au signalement précédent) : la
  Règle Spéciale Officier de Ligne (X) accordée par Préfet ne comptait
  pas dans le calcul des crédits de déblocage de Détachements
  Auxiliaires.** `reglesAppliquees` ne fait qu'ajouter le nom de la
  Règle à l'affichage de la fiche (`reglesAvantagePrincipalDe`,
  js/unites.js) — le calcul des crédits (`calculerCredits`/
  `valeurOfficierDeLigne`, js/organigramme.js, p. 283-284) est un code
  entièrement séparé qui ne lisait QUE `variante.regles` (les Règles
  Spéciales fixes de l'unité dans js/unites-data.js, ex : Centurion,
  Chef de Guerre…), jamais celles accordées dynamiquement par
  l'Avantage Principal de la Case. Un Capitaine-rempart avec Préfet
  affichait donc « Officier de Ligne (2) » sur sa fiche sans qu'aucun
  second Détachement Auxiliaire ne soit réellement débloqué.
  `valeurOfficierDeLigne(occ, caseOrga)` reçoit maintenant aussi
  `caseOrga` et complète les Règles à inspecter avec
  `avantageParId(caseOrga.avantage).reglesAppliquees` (le plus grand X
  trouvé l'emporte si les deux sources en portent une, cas
  hypothétique) ; seul son unique appelant (`calculerCredits`) a été
  mis à jour pour lui passer `caseOrga`, déjà dans sa portée. Vérifié
  par test fonctionnel jsdom en deux temps : (1) Capitaine-rempart
  (Legio Custodes) sans Préfet — le bouton « + Pionniers de Combat »
  (Détachement Auxiliaire générique) se grise après un premier ajout,
  comme attendu avec 1 seul crédit ; en sélectionnant Préfet sur sa
  Case, le bouton redevient actif et un second Détachement s'ajoute
  sans déclencher l'erreur « Trop de Détachements Auxiliaires » ;
  (2) non-régression sur le cas déjà existant avant ce chantier
  (Centurion générique, Officier de Ligne (2) fixe dans ses `regles`) :
  toujours 2 Détachements Auxiliaires disponibles comme avant. Aucune
  autre entrée de `AVANTAGES_PRINCIPAUX` ne porte
  `"Officier de Ligne"` dans `reglesAppliquees` à ce jour — seul Préfet
  était concerné par ce bug.

- **Nouvelle Faction « Légions Brisées » (`faction: "legions-brisees"`,
  « Legacies of the Age of Darkness : The Shattered Legions », Third
  Edition v1.0)** : architecture fondamentalement différente de toutes
  les Factions précédentes — ce supplément n'introduit AUCUNE Unité
  propre, il réutilise ENTIÈREMENT la Liste d'Armée Legiones Astartes
  (Liber Astartes/Hereticus) avec un Trait de Faction de remplacement.
  Pas de nouvelles entrées dans `js/unites-data.js` : tout le travail
  est dans le moteur (`js/organigramme.js`, `js/unites.js`) et le
  glossaire (`js/regles-data.js`).
  **Principe retenu** : `etat.faction === "legions-brisees"` se
  comporte comme `"legio-astartes"` pour tout ce qui gouverne
  l'accessibilité des Unités/Détachements génériques (Unités sans champ
  `faction`, Détachements sans champ `faction` explicite) — patché à
  trois endroits précis plutôt que d'ajouter "legions-brisees" à
  `factionCroisadeParDefaut()` (qui casserait l'égalité attendue
  ailleurs) : (1) `typeDisponiblePourFaction()` (js/organigramme.js) —
  ajout d'un OU explicite `etat.faction === "legions-brisees"`, sinon
  aucun Détachement Auxiliaire/d'Apex générique (Poing Blindé, Appui
  Tactique…) n'était proposé ; (2) `uniteAccessible()` (js/unites.js) —
  `factionUnite === "legio-astartes"` explicitement accepté quand
  `legionsBriseesActives`, sinon aucune Unité Legio Astartes générique
  n'apparaissait dans le sélecteur ; (3) `caseAccepte()`
  (js/organigramme.js) — le contrôle de Faction lui-même (ligne
  `factionUnite !== (type.faction || factionCroisadeParDefaut())`)
  n'a PAS eu besoin de patch (les deux valeurs retombent déjà sur
  "legio-astartes" pour cette Faction), seul le contrôle de LÉGION en
  a eu besoin (voir plus bas).
  **Sélection de 2 ou 3 Légions pour toute l'Armée** (p. 2 du PDF,
  remplace le menu Légion unique de Legio Astartes) : nouveau champ
  `etat.legionsBrisees` (tableau de 0 à 3 codes `LEGIONS`, persisté/
  restauré comme `etat.dominion` mais avec validation de cardinalité
  ≤ 3 et d'unicité) et nouveau bloc UI dans `construireParametres()` —
  18 cases à cocher (`LEGIONS`), la 4ᵉ case se grise automatiquement
  dès que 3 sont déjà cochées (règle du livre : 2 OU 3, jamais plus),
  chaque bascule passe par `reinitialiserArmeeAvecConfirmation` comme
  un changement de Légion classique. Nouvel accesseur public
  `Organigramme.legionsBriseesActuelles()`. Toute Unité réservée à une
  Légion (`unite.legion`) devient accessible dès que sa Légion figure
  dans ce tableau — patché dans `uniteAccessible()` (legion check) ET
  `caseAccepte()` (même check, hors Détachement Allié qui garde son
  propre `legionAlliee` indépendant). **Gap volontairement accepté** :
  `etat.legion` (singulier) reste vide pour cette Faction — toutes les
  options d'Arsenal de Légion déjà câblées sur ce site via
  `requiertLegion` (Artifice de Nocturne Salamanders, Gantelet Solarite
  Imperial Fists, etc.) ainsi que le panneau Décurion de Légion
  (Predator/Sicaran/Kratos) restent donc invisibles pour une Armée
  Légions Brisées, même si le joueur a coché la bonne Légion — la
  mécanique « Legion Armouries » du PDF (jusqu'à une Légion différente
  par Modèle, parmi les 2-3 choisies) demanderait une refonte de
  `requiertLegion` (actuellement lié à un unique `etat.legion` global)
  qui dépasse la portée de ce chantier ; documenté dans le tutoriel
  plutôt que masqué.
  **5 Commandants nommés déjà existants** (Hibou Khan/White Scars,
  Alexis Polux/Imperial Fists, Shadrak Meduson/Iron Hands, Saul
  Tarvitz/Emperor's Children, Garviel Loken/Sons of Horus) : aucune
  modification nécessaire — le check générique `unite.legion` déjà en
  place suffit à les rendre accessibles dès que leur Légion est cochée,
  sans mécanisme dédié.
  **Contenu non modélisé mécaniquement** (texte de référence seul dans
  `js/regles-data.js`, même principe que les Rites de Guerre/Tactica de
  Légion déjà en place ailleurs sur ce site) : Tactica de Légion
  Tactiques Mutables (bonus par Légion choisie, 18 entrées + Liés par
  le Sang si seulement 2 Légions), Réaction Avancée Faire Payer le
  Prix, Gambit Frappe Vindicative, et l'Avantage Principal (Prime
  Advantage, mécanique de Case d'Organigramme de Force Suprême non
  modélisée sur ce site, voir Cadres d'Interdiction/Inductii) Parangons
  de la Légion + sa Règle Spéciale Spécialistes de Légion. Traduction
  « Shrouded (6+) » (bonus Raven Guard) volontairement PAS mappée sur
  « Dissimulation (X) » (Damage Mitigation Rolls déjà établie) malgré
  le nom anglais identique — collision déjà documentée pour Raven
  Guard/Anathema Psykana, note explicite ajoutée dans le texte de
  regles-data.js et dans le tutoriel plutôt qu'un nouveau nom inventé.
  Nouveau tutoriel « Voir le tutoriel » (`construction-armee-legions-
  brisees`, pages/construction-liste.html) sur le moule des copies
  génériques (Legio Custodes/Anathema Psykana/Skitarii/Ruinstorm — même
  Organigramme de Force de Croisade, pas de panneau Décurion de Légion)
  avec 4 panneaux propres : Le Trait Légions Brisées, Armureries de
  Légion (gap documenté), Commandants des Légions Brisées, Rite de
  Guerre : Les Légions Brisées (accordéon des 18 Tactiques Mutables +
  Réaction Avancée + Gambit). Vérifié par test fonctionnel jsdom :
  bascule de Faction, 18 cases à cocher avec plafond à 3, accessibilité
  d'une Unité générique (Escouade Tactique) et d'un Commandant nommé
  (Hibou Khan) avant/après cocher sa Légion, Cases libres trouvées pour
  un Praetor (générique) et Hibou Khan (réservé à une Légion) dans le
  Détachement Principal — sans régression sur les Factions précédentes.

- **Nouvelle Faction « Blackshields » (`faction: "blackshields"`,
  « Legacies of the Age of Darkness : Legiones Astartes Blackshields »,
  Third Edition v1.1)** : même principe architectural que les Légions
  Brisées ci-dessus (aucun roster propre, réutilise entièrement la
  Liste d'Armée Legiones Astartes), mais plus simple sur un point clé —
  pas de choix de Légion(s) du tout : le PDF exclut purement et
  simplement toute Unité propre à une Légion d'un Détachement
  Blackshields (« no Legion specific Units may be selected »), ce qui
  tombe déjà juste par défaut puisque `etat.legion` reste vide pour
  cette Faction (le check `unite.legion` existant dans
  `uniteAccessible()`/`caseAccepte()` refuse alors automatiquement
  toute Unité à Légion fixe, sans code supplémentaire à écrire pour
  cette exclusion précise). Seuls deux patchs déjà posés pour Légions
  Brisées ont dû être étendus à `"blackshields"` : `uniteAccessible()`
  (js/unites.js, variable renommée `reutiliseLegioAstartes` — Unités
  Legio Astartes génériques accessibles) et `typeDisponiblePourFaction()`
  (js/organigramme.js — Détachements Auxiliaires/d'Apex génériques
  disponibles). `caseAccepte()` n'a nécessité AUCUN patch supplémentaire
  (le check de Légion existant, sans dérogation, suffit déjà à exclure
  les Unités à Légion fixe). Allégeance laissée entièrement libre
  (Loyaliste ou Renégat, comme Legio Astartes) — aucun forçage ajouté,
  contrairement à Legio Custodes/Anathema Psykana (Loyaliste forcé) ou
  Démons de la Tempête de la Ruine (Renégat forcé).
  **Nouveau mécanisme `unite.requiertFactionArmee`** (js/unites-data.js/
  js/unites.js) : première Unité de ce fichier réservée à une Faction
  d'Armée précise SANS déroger au Trait Faction générique de placement
  en Case — contrairement à `unite.faction` (qui gouverne aussi
  `caseAccepte()` et doit donc rester "legio-astartes" par défaut pour
  qu'une telle Unité reste compatible avec l'Organigramme de Force de
  Croisade générique), ce nouveau champ n'est vérifié QUE dans
  `uniteAccessible()` (visibilité du sélecteur « Unité à ajouter »).
  Sûr sans contrepartie dans `caseAccepte()` car un changement de
  Faction vide toujours l'Armée au préalable
  (`reinitialiserArmeeAvecConfirmation`) : aucun état incohérent où une
  Unité resterait sur la fiche avec une Faction d'Armée différente de
  celle exigée. Posé sur **Endryd Haar** (`requiertFactionArmee:
  "blackshields"`), seul personnage nommé de ce PDF à profil complet
  (Le Molosse Déchiré, Praetor du Blackshield — ancien World Eaters,
  165 Points, Quartier Général, Type Infanterie (Unique, État-major)) :
  Règles Spéciales Crocs de l'Empereur (Infiltration (12) à tout le
  Détachement Principal s'il en est le seul Choix de Quartier Général),
  Le Molosse Déchiré (Gambit à +4 Force/+2 Dégâts pour une seule
  attaque), Haine (World Eaters), Guerrier Éternel (1) ; nouvelle arme
  Gantelet énergétique modèle Terrawatt (`armes-data.js`).
  **Rite de Guerre Blackshields** : Tactica Fils Bâtards du Destin
  (+1, ou +2, Endurance/Force sous Fixée/Neutralisée/Sonnée) et Gambit
  Redevable à Personne (D3 blessures en retour si vaincu par un Modèle
  à Trait Unique/Type Parangon) — ajoutés à `regles-data.js`. Point de
  Réaction Bonus lié au Trait déjà existant **Maître de la Légion**
  (texte générique déjà en place, réutilisé tel quel plutôt que dupliqué
  — condition précise décrite en prose dans le tutoriel plutôt que dans
  une nouvelle entrée de glossaire).
  **Les Serments du Moment (Oaths of Moment)** : mécanique la plus
  riche rencontrée à ce jour pour un supplément de ce type — 15 Serments
  sélectionnables par Détachement (2 pour un Détachement Principal, 1
  pour un Détachement Allié, obligatoirement partagés par les
  Détachements Auxiliaires/d'Apex rattachés), certains restructurant
  profondément l'Organigramme (Cases de Troupes → Élite ou → Quartier
  Général, Cases → Cases d'Organigramme de Force Suprême...). Décision
  délibérée de NE PAS les câbler comme mécanique sélectionnable par
  Détachement (contrairement à la Doctrine de Cohorte/au Techno-arcane
  Majeur/au Trait de Faction Skitarii/au Dominion Éthérique, qui sont
  chacun UN SEUL choix simple) — l'ampleur du chantier (potentiellement
  plusieurs nouveaux types de Détachement, une UI de sélection multiple
  par Détachement, une resynchronisation des Cases à chaque changement)
  dépasse largement la portée d'une session, et la plupart de ces effets
  sont de toute façon des bonus de combat conditionnels que ce site ne
  simule déjà pas ailleurs. Les 15 Serments + leurs sous-règles nommées
  (Piller les Morts (X), Unités à Cogitateurs Liés, Baie de Transport
  Augmétique, Malfaisance, Clone, Aberrant, Petit Seigneur de Guerre,
  Héroïsme Funeste (X), Combattre et Mourir Seul) ajoutés à
  `regles-data.js` comme texte de référence seul, avec un encadré
  « Non simulé sur ce site » explicite dans le tutoriel — même principe
  que les 18 Tactiques Mutables des Légions Brisées.
  Nouvelle catégorie d'Arsenal « Armes des Blackshields » (Tir et
  Mêlée, `armes-data.js`) pour les armes mentionnées par les Serments
  Souillure Xenos (Deathlock, Doomlock, Lame de Halo) et Armes du
  Désespoir (Autofusil/Autopistolet/Fusil laser/Pistolet laser/Fusil à
  pompe/Stubber lourd récupérés) et l'Arme Psychique Torrent Warp de la
  Discipline Malfaisance — profils complets donnés par le PDF, ajoutés
  pour référence même si aucune Unité générique ne les propose encore
  en option sélectionnable (même limite que les Serments eux-mêmes).
  « Las » (Trait) volontairement PAS utilisé pour les armes laser
  récupérées : ce fichier utilise déjà « Laser » en toutes lettres
  (vérifié avant traduction, cf. catégorie « Armes Laser » déjà
  existante) — à ne pas confondre pour un futur ajout.
  Nouveau tutoriel « Voir le tutoriel » (`construction-armee-
  blackshields`, pages/construction-liste.html) sur le moule des
  Légions Brisées (même Organigramme de Force de Croisade générique,
  pas de panneau Décurion de Légion — les options d'Arsenal de Légion
  `requiertLegion` restent hors de portée ici aussi, `etat.legion`
  n'étant jamais renseigné pour cette Faction) avec 5 panneaux propres :
  Le Trait Blackshields, Point de Réaction Bonus, Rite de Guerre :
  Blackshields, Les Serments du Moment (accordéon des 15), Commandant :
  Endryd Haar. Frise « Ordre de déploiement » (`index.html`) mise à
  jour : Blackshields et Légion brisée (renommé depuis « Shattered
  Legion », qui n'était qu'un nom de collection PDF jamais aligné sur
  le nom réel du site « Légions Brisées » — demande explicite du
  proprio de le renommer ainsi malgré l'écart de nombre avec la Faction
  plurielle) déplacés de la Phase II (« En approche ») vers la Phase I
  (« Déployée »).
  Vérifié par test fonctionnel jsdom : bascule de Faction, Endryd Haar
  accessible sous Blackshields et invisible sous Legio Astartes (dans
  les deux sens), Unité générique (Escouade Tactique) toujours
  accessible, Unité à Légion fixe (Hibou Khan) correctement EXCLUE sous
  Blackshields, Allégeance non verrouillée, Cases libres trouvées pour
  Endryd Haar (Quartier Général) dans le Détachement Principal, contenu
  du tutoriel présent — sans régression sur les Factions précédentes.

- **Câblage mécanique complet des Serments du Moment (Blackshields) et
  des Armureries de Légion (Légions Brisées)** — demande explicite du
  proprio (2026-08-02) de ne plus laisser ces mécaniques en texte de
  référence seul : le principe par défaut de ce fichier (« bonus de
  combat conditionnel non simulé, cette page ne sert que de
  référence ») ne s'applique plus à ces deux mécaniques précises. Reste
  vrai partout ailleurs (Rites de Guerre/Tactica de Légion classiques,
  Tactiques Mutables des Légions Brisées elles-mêmes) : ne pas
  généraliser à tort ce chantier à tout le fichier.
  **Armureries de Légion (Légions Brisées)** : `legionRequiseSatisfaite`
  (js/unites.js, remplace l'ancien nom plus étroit) centralise
  désormais 4 sources de satisfaction pour un `requiertLegion` (Légion
  unique Legio Astartes, Légion Alliée, 2-3 Légions Brisées, Légion du
  Serment Panoplie d'Antan) — toute option d'Arsenal de Légion déjà
  câblée sur ce site (`requiertLegion`, ~12 Légions) devient donc
  automatiquement disponible sous ces trois mécaniques sans travail
  supplémentaire par Légion. Simplification assumée et documentée dans
  le tutoriel : contrairement au livre, ce site ne limite pas une
  figurine à l'Armurerie d'UNE SEULE Légion parmi celles accessibles.
  **Serments du Moment (Blackshields)** : nouveau système complet.
  `det.serments`/`det.serimentsRattaches` (js/organigramme.js,
  `creerDetachement`) — choix direct sur un Détachement Principal (max
  2)/Allié (max 1) via une nouvelle UI de cases à cocher
  (`construireSelectSermentsDetachement`, réutilise le style
  `.orga-legions-brisees` déjà en place) ; tout Détachement Auxiliaire/
  d'Apex choisit à qui il est « Rattaché à »
  (`construireSelectSermentsRattaches`) faute de lien formel Case →
  Détachement débloqué déjà existant dans ce fichier
  (`debloqueursDisponibles` ne fait qu'un décompte global, jamais de
  lien figé — nouveau champ `serimentsRattaches`, un uid d'un AUTRE
  Détachement, sauvegardé comme un INDICE dans le tableau JSON plutôt
  qu'un uid brut car `compteurDet` repart de zéro à chaque restauration
  de session — voir la deuxième passe de résolution dans
  `restaurerOrga`). Nouvelle donnée `SERMENTS_DU_MOMENT`
  (js/organigramme-data.js, 15 entrées) et fonctions de résolution
  `sermentsActifsDe(det)`/`sermentsDe(uniteUid)`/`legionPanoplieDe`/
  `choixCloneAberrantDe` (js/organigramme.js, exposées via
  `Organigramme.*`).
  Effets réellement appliqués sur la fiche récap (`reglesFinales`,
  `traitsSermentsDe`, `typeAfficheSermentsDe`, `bonusSermentDuMoment`,
  js/unites.js) : Règles Spéciales/Traits accordés (avec filtre
  Sous-type/Type Véhicule), transformation Ligne (X)/Avant-garde (X) →
  Piller les Morts/Héroïsme Funeste ou suppression pure (regex sur le
  nom de la Règle, voir `appliquerTransformationLigneVanguard`),
  remplacement Infanterie → Automate + Tactica Fils Bâtards du Destin →
  Unités à Cogitateurs Liés (La Chair est Faible), bonus/malus de
  Caractéristiques hors Sous-type État-major/Champion/Spécialiste/
  Sergent (L'Hélice Brisée, réutilise le plafond/la mécanique déjà en
  place pour les Avantages Principaux plutôt que d'en inventer une
  seconde). **Découverte en testant** : la Tactica de base elle-même
  (« Fils Bâtards du Destin ») n'était accordée à AUCUNE Unité avant ce
  correctif — seulement documentée au Glossaire — corrigé en l'ajoutant
  automatiquement à toute Figurine non-Véhicule d'une Armée Blackshields
  dans `reglesFinales`, avant tout traitement de Serment (pour que La
  Chair est Faible puisse encore la remplacer).
  Effets sur l'Organigramme (`caseAccepte`/`avantagesPossibles`/
  `construireDetachementDOM`, js/organigramme.js) : blocage total des
  Cases Quartier Général/État-major (Dans la Disgrâce, Tous sont Égaux),
  reconversion du Rôle Tactique ACCEPTÉ (pas affiché — même
  simplification déjà en place pour « Sire des White Scars », voir plus
  haut) d'une Case Troupes vers Élite (La Fierté est Notre Armure) ou
  État-major restreint aux seuls Centurion/Centurion en Armure
  Terminator (Seuls et Oubliés — **piège de traduction corrigé en
  cours de route** : « Command Slots »/« Command Choices » de ce PDF se
  traduisent par Cases/Choix d'État-major sur ce site, PAS Quartier
  Général, malgré la tentation — voir ROLES_TACTIQUES, Quartier Général
  = High Command, État-major = Command ; régles-data.js et le tutoriel
  ont été corrigés après une première traduction fautive), interdiction
  totale des Choix de Troupes hors Case reconvertie (`interditTroupes`),
  restriction à un seul Rôle Tactique occupable dans tout le Détachement
  (`restreintRoleUnique`, Seuls et Oubliés). Nouvel Avantage Principal
  **Petit Seigneur de Guerre** (`AVANTAGES_PRINCIPAUX`) qui n'existe que
  sous Dans la Disgrâce, Tous sont Égaux (toute Case ordinaire du
  Détachement y devient une Case d'Organigramme de Force Suprême,
  `avantagesPossibles` y masque tous les autres Avantages sauf « Aucun »)
  — bonus de Caractéristiques identique à Maître-sergent, réutilisé tel
  quel (`bonusAvantagePrincipal`) plutôt que dupliqué.
  Armes débloquées (La Souillure Xenos/Les Armes du Désespoir) : nouveau
  champ `requiertSerment` sur une entrée `choix`, même mécanique que
  `requiertLegion` (nouvelle fonction `optionSermentOk`, câblée aux
  3 mêmes points de contrôle qu'`optionLegionOk`) — Deathlock/Doomlock
  ajoutés à `LISTES_EQUIPEMENT.speciales`, Lame de Halo et les 7 Armes
  du Désespoir (gratuites) à `LISTES_EQUIPEMENT.officier`, propagé par
  `depuisListes()` (étendu pour transporter `requiertSerment` en plus de
  `requiertLegion`). **Gap documenté, accepté** : seuls `.officier` et
  `.speciales` ont reçu ces entrées (les listes les plus utilisées à
  travers le fichier) — `.meleeSergent`/`.meleeTerminator`/`.pistolets`/
  `.combinees` n'ont pas été auditées site par site, contrairement au
  travail exhaustif déjà fait par Légion pour les Arsenals (~90 sites
  chacun) : combler si demandé.
  **Parangons de la Légion (Prime Advantage des Légions Brisées) reste
  volontairement NON câblé**, seul point non traité de cette demande :
  contrairement à Petit Seigneur de Guerre (qui CRÉE lui-même ses Cases
  d'Organigramme de Force Suprême, donc autonome), Parangons de la
  Légion s'applique à une Case qui est DÉJÀ une Case d'Organigramme de
  Force Suprême selon la règle de BASE du livre (p. 278 du Livre de
  Règles, jamais fournie à ce fichier) — combien de telles Cases une
  Armée a normalement, et lesquelles. Deviner cette règle violerait la
  règle 6 de ce fichier (ne jamais inventer un texte de règle) : à
  combler seulement si le proprio fournit cette page. Même blocage pour
  les autres mentions déjà connues de ce fichier (Paladin de
  l'Hekatonystika, Cadres d'Interdiction, Inductii) — pas un nouveau
  problème introduit ici, juste non résolu par ce chantier.
  Vérifié par tests fonctionnels jsdom dédiés (cardinalité 2/1 et
  incompatibilités des Serments, La Vendetta Éternelle → Haine
  accordée, Les Dépouilles de la Victoire → Ligne (X) remplacée par
  Piller les Morts (X) avec suppression de la Règle d'origine, La Chair
  est Faible → Type Automate affiché + Tactica remplacée, Dans la
  Disgrâce → Case Quartier Général bloquée pour un second Praetor,
  Seuls et Oubliés → Centurion accepté en Case Troupes reconvertie avec
  Combattre et Mourir Seul/Insouciant accordés puis Escouade Tactique
  refusée sur cette même Case, Panoplie d'Antan → Légion choisie
  débloquant une entrée `requiertLegion` normalement inaccessible) et
  non-régression (Legio Astartes classique toujours sans Fils Bâtards
  du Destin, Légions Brisées toujours fonctionnel).

- **Skins couleurs seules pour Démons de la Tempête de la Ruine,
  Légions Brisées et Blackshields** (`SKIN_DAEMONS_RUINSTORM`/
  `SKIN_LEGIONS_BRISEES`/`SKIN_BLACKSHIELDS`, js/organigramme.js) :
  dernières Factions de `FACTIONS` sans skin dédié, comblées sur le
  même principe que Legio Custodes/Anathema Psykana/Conclaves Skitarii
  (classe posée sur `<body>`, recolore `--accent`/`--accent-clair`/
  `--fond-secondaire`/`--carte-hover`, sans blason faute d'asset
  sourcé). Palettes choisies et validées WCAG 1.4.3/RGAA 3.2 (contraste
  `--accent`/`--accent-clair` sur fond blanc ≥4.5:1, script Node de
  luminance relative en scratchpad, même méthode que les palettes
  précédentes) : Démons de la Tempête de la Ruine = violet warp
  (`--accent: #5b2a6e`, `--accent-clair: #7a3a91`, 10.49:1/7.39:1) ;
  Légions Brisées = gris-bleu ardoise (`#3a4a5c`/`#4f6478`,
  9.08:1/6.13:1) ; Blackshields = noir-rouge charbonneux (`#3a2020`/
  `#5c2f2f`, 14.92:1/11.04:1, thématique au blason noirci du nom).
  Blocs CSS ajoutés à `css/style.css` juste après celui de Skitarii,
  même structure. Bannière ajoutée dans `construireParametres()`
  (nouvelles branches `else if (skinRuinstorm)`/`(skinLegionsBrisees)`/
  `(skinBlackshields)` juste après celle de Skitarii) et propagée aux
  autres pages via 3 nouvelles branches dans `appliquerSkinLegionGlobal()`
  (`js/main.js`). Nouveaux accesseurs `Organigramme.skinRuinstormActuel()`/
  `skinLegionsBriseesActuel()`/`skinBlackshieldsActuel()` branchés sur
  la page de garde PDF/Word (`genererPDF`/`genererWordHTML`,
  js/unites.js — chaîne `skinSansBlason` déjà en place pour Legio
  Custodes/Anathema Psykana/Skitarii, étendue avec 3 `||` de plus).
  Vérifié par test fonctionnel jsdom dédié (bascule sur les 3
  Factions : classe `<body>` correcte, bannière affichée avec la bonne
  devise, retour propre à Legio Astartes sans classe résiduelle).
- **3 nouvelles sources** ajoutées à `SOURCES_SITE` (js/main.js), juste
  après « Unités Legacies » : Légions Brisées, Blackshields et Démons
  de la Tempête de la Ruine, toutes trois vers la page de téléchargement
  officielle des suppléments Legacies of the Age of Darkness
  (warhammer-community.com/en-gb/downloads/warhammer-the-horus-heresy/,
  ces trois PDF n'étant pas vendus en boutique contrairement aux Liber/
  Journaux Tactica).

Cette liste s'allonge à chaque légion : la compléter au fil de l'eau
plutôt que de la laisser devenir obsolète.
