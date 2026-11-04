# Guide de traduction FR → EN

À suivre pour compléter `a-traduire.json` (voir [README.md](README.md)), que la
traduction soit faite à la main ou confiée à une IA. Les consignes de forme
sont vérifiées par `integrer.js` ; celles de fond ne le sont pas.

## Principe : retrouver l'anglais officiel

Le texte français du site est lui-même une traduction des livres **anglais** de
Games Workshop (Rulebook, Liber Astartes / Hereticus / Auxilia / Mechanicum /
Questoris / Custodes, Journal Tactica, Legacies). On ne traduit donc pas mot à
mot : on **retrouve le terme officiel** (« Brèche (X) » → « Breaching (X) »,
« Escouade Tactique » → « Tactical Squad »). Orthographe britannique (armour,
colour, defence), majuscules des termes de jeu comme chez GW. Les noms déjà en
anglais ou en haut gothique restent tels quels (Praetor, Cataphractii, Kratos…).

## Règles de forme (contrôlées par integrer.js)

- **Termes du glossaire** : un terme présent dans `glossaire` de
  `a-traduire.json` doit être repris **à l'identique** (mêmes mots, même casse).
  Le site rapproche les noms par comparaison de texte (info-bulles de règles,
  profils d'armes, rôles d'organigramme) : une variante casse le lien.
- **`(X)` final** : un terme qui finit par `(X)` garde `(X)` à la fin.
- **Marqueurs `⟦0⟧ ⟦1⟧`** : ils remplacent des valeurs calculées par le code ;
  les garder tous, **dans le même ordre**.
- **Fragments HTML** : garder toutes les balises et leurs attributs (`class`,
  `href`, `tabindex`…) ; traduire le texte et les attributs `title` / `alt` /
  `aria-label`. Dans `<strong class="regle-tag">Nom<span class="tooltip">texte
  </span></strong>`, *Nom* est le nom du glossaire.
- **Espaces de début et de fin** : identiques à l'original (ils servent aux
  concaténations du code).

## Règles de fond

- Typographie anglaise : pas d'espace avant `: ; ! ?`, guillemets “ ” ou " ".
- Nombres, dés (D6, 2D6, 3+), pouces (6"), traits entre crochets
  (`[Legiones Astartes]`) inchangés.
- Montages d'armes : « Bolter lourd de Coque (Avant) » → « Front Hull Mounted
  heavy bolter » (jamais de parenthèse **avant** le nom de l'arme : le site ne
  cherche l'arme qu'avant la première parenthèse). `construire.js` normalise de
  toute façon les formes « Hull (Front) Mounted ».
- Document disponible en français seulement : ajouter « (in French) ».
- Chaîne de code non visible (sélecteur CSS, identifiant, nom de fichier) :
  la recopier telle quelle.

## Vocabulaire de base

| Français | English |
|---|---|
| Figurine / Unité / Armée | Model / Unit / Army |
| Règle Spéciale / Trait / Trait de Faction | Special Rule / Trait / Faction Trait |
| Joueur Actif / Réactif / en Contrôle | Active / Reactive / Controlling Player |
| Réaction (Avancée) | (Advanced) Reaction |
| Tour de Bataille | Battle Turn |
| Phase de Mouvement / de Tir / d'Assaut | Movement / Shooting / Assault Phase |
| Attaque de Tir | Shooting Attack |
| Défi / Posture / Jet de Concentration | Challenge / Gambit / Focus Roll |
| Perte / Verrouillée en Combat / Ligne de Vue | Casualty / Locked in Combat / Line of Sight |
| Jet pour Toucher / de Blessure / de Sauvegarde | Hit Test / Wound Test / Saving Throw |
| Allégeance / Loyaliste / Renégat | Allegiance / Loyalist / Traitor |
| Primarque / Maître de la Légion / Seigneur de Guerre | Primarch / Master of the Legion / Warlord |
| Détachement Principal / Auxiliaire / d'Apex / Allié | Primary / Auxiliary / Apex / Allied Detachment |
| Case / Case Principale / Avantage Principal | Slot / Prime Slot / Prime Advantage |
| Rite de Guerre | Rite of War |
| Quartier Général / État-major / Suites / Elite | High Command / Command / Retinues / Elites |
| Troupes / Appui / Reco / Attaque Rapide | Troops / Support / Recon / Fast Attack |
| Assaut Lourd / Blindés / Engins de Guerre | Heavy Assault / Armour / War-engines |
| Transports (Lourds) / Seigneurs des Batailles | (Heavy) Transports / Lords of War |
| Infanterie / Cavalerie / Véhicule / Aéronef | Infantry / Cavalry / Vehicle / Flyer |
| Blindage Avant / Flanc / Arrière, Points de Coque | Front / Side / Rear Armour, Hull Points |
| Chevaliers Questoris / Maisonnée | Questoris Knights / Household |
| Légions Brisées / Démons de la Tempête de la Ruine | Shattered Legions / Ruinstorm Daemons |

Caractéristiques : M, WS, BS, S, T, W, I, A, LD, CL, WP, IN, SAV, INV ; armes de
tir R, FP, RS, AP, D ; armes de mêlée IM, AM, SM, AP, D. (Elles sont converties
par le code, il n'y a rien à traduire dans les tableaux de profils.)

Pour tout le reste, **le glossaire fait foi** : `memoire/glossaire.json`
(≈ 4 900 termes déjà fixés). Chercher un terme existant avant d'en inventer un.
