# Images sources (pleine résolution)

Ce dossier contient les images **originales**, telles qu'elles étaient
avant l'optimisation du 25 juillet 2026. Il n'est **pas destiné à être
déployé** : aucune page du site n'y fait référence.

## Pourquoi le garder

Une image redimensionnée ne peut pas être « ré-agrandie » : les pixels
supprimés sont perdus. Si un jour il faut :

- un blason en plus grand (page dédiée à une Légion, impression, affiche) ;
- une autre taille pour un écran haute densité (`srcset`) ;
- un recadrage différent d'un portrait de Primarque ;

…c'est ici qu'il faut repartir, jamais des fichiers du site.

## Ce qui a été fait aux images déployées

| Lot | Source | Taille déployée | Pourquoi |
|---|---|---|---|
| Blasons de Légion, Maisonnées, Titanicus, Mechanicum, Solar Auxilia | 1024×1536 | **112 px de haut** | Affichés à `height: 1.8rem` (≈ 29 px) dans le bandeau et `2.2em` sur le titre de page. 112 px couvre un écran à 3× de densité de pixels. |
| Portraits de Primarques (`choix-legion.html`) | 1024×1536 | **800 px de large** | Cartes de 400×600, agrandissement en modale jusqu'à `72vh`. 800 px reste net sur un écran de portable 2×. |
| `erebus.jpg` | 1024×1536 | **640 px de large** | Affiché à `max-width: 320px`. |
| `night_lords.jpg` | 504×600 | **inchangé** | Déjà à la bonne taille. |
| `logo_inquisition.png` | 694×702 | **400 px de large** | Tampon posé à 130 pt dans le PDF exporté. |

Les formats d'origine ont été conservés (un PNG reste un PNG, un JPEG
reste un JPEG) : aucun nom de fichier n'a changé, donc aucune ligne de
code n'a eu à être modifiée. C'était le choix le moins risqué — passer
en WebP n'aurait fait gagner que 1,5 Mo de plus au prix du renommage de
68 fichiers et de la modification de `LOGOS_LEGION` dans `js/main.js` et
`js/organigramme.js`.

## Exclure ce dossier du déploiement

Sur GitHub Pages, tout ce qui est dans le dépôt est publié. Deux façons
de ne pas servir ces 36 Mo aux visiteurs :

1. **Préfixe `_`** — Jekyll, utilisé par défaut par GitHub Pages, ignore
   les dossiers commençant par un tiret bas. C'est la raison du nom
   `_sources`, et ça suffit dans la plupart des cas.
2. **`.nojekyll` présent dans le dépôt** — si ce fichier existe, Jekyll
   est désactivé et la règle du tiret bas ne s'applique plus. Il faut
   alors soit sortir ce dossier du dépôt, soit l'exclure explicitement.

> Remarque importante : ces 36 Mo restent de toute façon dans
> l'**historique Git**, où ils ont été committés depuis le début. Le
> `git clone` du dépôt restera lourd tant que l'historique n'aura pas
> été réécrit (`git filter-repo`) — une opération qui casse tous les
> clones existants, donc à ne faire que sur décision réfléchie. Ce qui
> compte pour les visiteurs, c'est le poids **servi**, et lui a bien été
> divisé par six.
