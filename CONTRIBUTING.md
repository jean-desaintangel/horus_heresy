# Contribuer

Merci de l'intérêt porté à ce guide d'initiation à **Warhammer : The Horus Heresy** ! Les contributions sont bienvenues : correction d'une valeur de jeu, faute d'orthographe, nouvelle unité dans le configurateur, amélioration d'accessibilité…

En participant à ce projet, vous vous engagez à respecter notre [Code de conduite](CODE_OF_CONDUCT.md).

## Avant de commencer

Ce site est **statique**, sans framework ni étape de build (voir le [README](README.md#technologies-utilisées) pour l'arborescence et les choix techniques). Il n'y a donc rien à installer : ouvrez `index.html` dans un navigateur, ou servez le dossier avec `npx serve .`.

## Signaler un bug ou proposer une amélioration

Ouvrez une [issue](https://github.com/jean-desaintangel/horus_heresy/issues) en utilisant le modèle correspondant (bug ou suggestion). Pour une erreur de valeur de jeu, indiquez si possible la **page du livre de règles** qui fait référence.

## Proposer une modification (pull request)

1. **Forkez** le dépôt (bouton _Fork_ en haut de la page GitHub).
2. Créez une branche descriptive : `git checkout -b correction-profil-praetor`.
3. Faites vos modifications :
   - Pour une **valeur de jeu** (profil d'unité, coût en points, règle spéciale…), modifiez uniquement les fichiers `js/*-data.js` — la logique de rendu vit dans le fichier du même nom sans suffixe.
   - Tout le texte doit être injecté via `textContent` (jamais `innerHTML`), par réflexe anti-XSS.
   - Respectez l'approche mobile-first déjà en place dans `css/style.css`.
   - Toute nouvelle page doit être ajoutée au tableau `LIENS_NAV` de `js/main.js` pour apparaître dans le menu.
4. Vérifiez que le site fonctionne toujours correctement en `file://` (aucune dépendance à un serveur).
5. Ouvrez une **Pull Request** en décrivant le changement et, pour une valeur de jeu, la référence exacte dans le livre.

## Licence de vos contributions

Le code du projet est distribué sous les termes de la [LICENSE](LICENSE) du dépôt. En soumettant une pull request, vous acceptez que votre contribution soit distribuée sous cette même licence.

Les noms, l'univers et les valeurs de jeu de _Warhammer : The Horus Heresy_ restent la propriété intellectuelle de Games Workshop Ltd. ; ce projet est un guide non officiel réalisé par des fans.

## Questions

Pour toute question qui ne relève pas d'un bug ou d'une pull request, utilisez le [formulaire de contact du site](https://jean-desaintangel.github.io/horus_heresy/pages/contact.html) ou le groupe Facebook [Horus Heresy France](https://www.facebook.com/groups/1881902328756053).
