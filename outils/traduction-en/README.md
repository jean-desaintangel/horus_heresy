# Version anglaise du site — outil de génération

Le dossier [`en/`](../../en/) à la racine du dépôt est **généré** à partir des
sources françaises par `construire.js`. On ne le modifie **jamais à la main** :
il est entièrement effacé et réécrit à chaque construction.

```
Sources FR (index.html, pages/, js/)  ──┐
memoire/glossaire.json + textes.json  ──┼──>  construire.js  ──>  en/
lib/ajustements-js.js / -html.js      ──┘
```

Ce que fait `construire.js` :

- repère chaque texte traduisible des pages et des scripts, **à sa position
  exacte** (vrai parseur JS et HTML, voir `lib/extraction.js`), et le remplace
  par sa traduction : le code et le balisage autour ne sont jamais touchés ;
- traduit les listes de noms (règles d'une arme, type d'une unité…) **terme par
  terme** via le glossaire, pour que chaque nom reste identique à sa définition
  (info-bulles, profils d'armes, rôles d'organigramme) ;
- applique les ajustements de code propres à l'anglais (`lib/ajustements-js.js`) :
  abréviations de caractéristiques (WS, BS…), regex visant du texte français,
  pluriels, clés d'objet, typographie… Chaque motif est vérifié : si une
  modification FR le fait disparaître, la construction **s'arrête** avec un
  message `ajustement : …` plutôt que de produire une version cassée ;
- réécrit les chemins (CSS, polices, images, documents et jsPDF restent
  **partagés** à la racine), passe `lang="en"`, les URL canoniques en `/en/`,
  et utilise des clés `localStorage` distinctes (`hh-en-…`) pour qu'une liste
  d'armée FR et une liste EN ne se mélangent pas.

## Installation (une fois)

```bash
cd outils/traduction-en
npm install
```

## Après une modification des sources françaises

```bash
cd outils/traduction-en
node a-traduire.js      # reconstruit en/ et liste les textes FR sans traduction
```

- **« Rien à traduire »** : terminé, `en/` est à jour. Commiter `en/` avec la
  modification FR.
- Sinon, compléter le champ `"en"` de chaque entrée de `a-traduire.json` (en
  suivant [GUIDE-TRADUCTION.md](GUIDE-TRADUCTION.md) ; on peut le confier à
  Claude en lui donnant ce guide), puis :

```bash
node integrer.js        # contrôle et verse les traductions dans memoire/
node construire.js      # régénère en/
node tests/tout.js      # vérifie la parité FR/EN (navigateur requis)
```

Tant qu'un texte n'est pas traduit, il apparaît **en français** dans la version
anglaise : le site reste fonctionnel, rien ne casse.

Pour corriger une traduction existante : modifier directement
`memoire/glossaire.json` (termes) ou `memoire/textes.json` (phrases,
fragments HTML) — clé = texte français exact — puis `node construire.js`.
Un terme du glossaire peut apparaître dans de nombreuses chaînes : le changer
ici le change partout de façon cohérente.

## Tests

`node tests/tout.js` (Chrome ou Edge requis ; sinon définir la variable
`CHROME` avec le chemin du navigateur) :

- `tests/donnees.js` — sans navigateur : règles d'armes sans définition, types
  multi-profils, rôles d'organigramme, comparés FR/EN ;
- `tests/pages.js` — chaque page FR et EN se charge sans erreur ni 404 ;
- `tests/configurateur.js` — **parité du configurateur** : coût de chaque unité
  avec chaque option et variante, puis, pour chaque Faction et chaque Légion
  (tous détachements ajoutés), accessibilité et cases libres de chaque unité.
  Tout écart fait échouer le test.

## Fichiers

| Fichier | Rôle |
|---|---|
| `construire.js` | Génère `en/` |
| `a-traduire.js` / `integrer.js` | Lister / intégrer les nouvelles traductions |
| `memoire/glossaire.json` | Termes de jeu FR → EN (noms de règles, armes, unités…) |
| `memoire/textes.json` | Textes FR → EN (règles, notes, interface, HTML) |
| `lib/extraction.js` | Repérage des textes dans le JS (acorn) et le HTML (parse5) |
| `lib/plan.js` | Découpage terme à terme des listes de noms |
| `lib/memoire.js` | Lecture/écriture de la mémoire, termes paramétrés `(X)` |
| `lib/ajustements-js.js` / `-html.js` | Corrections de code propres à l'anglais |
| `GUIDE-TRADUCTION.md` | Terminologie et règles de traduction |

## Limites connues

- Le français écrit « Infanterie (Lourd) » et l'anglais « Infantry (Heavy) » :
  les **listes enregistrées** (export/import JSON) ne passent pas d'une langue à
  l'autre — les identifiants d'options sont dérivés des libellés.
- Les documents téléchargeables (PDF, Word, PowerPoint) restent en français.
- Les commentaires du code des fichiers `en/js/` restent en français (ce sont
  des copies générées, la référence reste `js/`).
