# Politique de sécurité

## À propos de ce projet

Ce dépôt héberge un **site statique** (HTML/CSS/JavaScript vanilla, hébergé sur GitHub Pages, sans serveur ni base de données propres). La surface d'attaque est donc limitée, mais des problèmes restent possibles : faille XSS, dépendance tierce vulnérable (`js/vendor/`), fuite de données via le formulaire de contact (Formspree), etc.

## Signaler une vulnérabilité

Si vous découvrez une faille de sécurité, merci de **ne pas** ouvrir d'issue publique tant qu'elle n'est pas corrigée.

Signalez-la plutôt en privé via le [formulaire de contact du site](https://jean-desaintangel.github.io/horus_heresy/pages/contact.html), ou en contactant directement le mainteneur via son profil GitHub ([@jean-desaintangel](https://github.com/jean-desaintangel)).

Merci d'inclure autant que possible :

- une description du problème et de son impact potentiel ;
- les étapes pour le reproduire ;
- toute suggestion de correctif, si vous en avez une.

## Délai de réponse

Ce projet est maintenu bénévolement sur le temps libre de son auteur. Un accusé de réception sera envoyé dès que possible, et une correction sera publiée dès qu'elle est prête. Il n'y a pas de programme de récompense (bug bounty).

## Versions couvertes

Le site n'a qu'une seule version en production, servie depuis la branche `main`. Seule cette version est couverte par cette politique.
