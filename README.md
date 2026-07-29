# Horus Heresy · Guide d'initiation

Site statique **non officiel** servant de guide d'initiation au jeu de figurines **Warhammer : The Horus Heresy** (3ᵉ édition), en français. Pensé pour être consulté **sur téléphone pendant une partie** : règles résumées, tables de référence interactives et configurateur de liste d'armée.

## Aperçu

<!-- TODO : remplacer par une vraie capture d'écran du site
     (ex : docs/screenshot.png, prise sur mobile ET bureau) -->

![Page d'accueil du guide](assets/img/hero.webp)

## Démo en ligne

👉 **[lagrandecroisade.fr](https://lagrandecroisade.fr/)**

## Fonctionnalités principales

- **Règles résumées par phase** : construction d'armée, tour de jeu, mouvement, tir, assaut, défi, statuts & réactions.
- **Tables de référence interactives** (CC, Blessure, CT) : surbrillance ligne/colonne au survol, épinglage d'une case au tap sur mobile, première colonne figée au défilement horizontal.
- **Glossaire des règles spéciales** avec recherche instantanée (insensible aux accents).
- **Arsenal** : tables d'armes filtrables, avec info-bulle de définition sur chaque règle spéciale.
- **Configurateur d'unités** : composez votre liste (variantes, options d'armement), coût en points recalculé en direct, fiche récap imprimable, export **PDF** et **Word** en un clic, sauvegarde locale (`localStorage`).
- **Choix de la Légion** : grille interactive des dix-huit Primarques (page dédiée `pages/choix-legion.html`) pour démarrer directement une liste dans le configurateur.
- **Assistant de Sélection d'Armée**, six Factions jouables — **Legio Astartes**, **Legio Titanicus**, **Chevaliers Questoris**, **Mechanicum**, **Solar Auxilia**, **Conclaves Skitarii** : organigramme de détachements conforme aux livres d'armée respectifs (Détachement Principal, Auxiliaires, Apex, Détachements Additionnels de Maisonnée, quotas Seigneur de Guerre/Seigneurs des Batailles, Alliés…), validation en temps réel des règles de construction.
- **Pages de règles dédiées** : Véhicules (blindage, transports, Sous-types Rapide/Stable/Super-lourd/Titan/Chevalier), Titans (Legio Titanicus) et Chevaliers Questoris (Paradigmes de Maisonnée, Vœux Questoris, Réactions Avancées).
- **Téléchargements** : aides de jeu maison et documents communautaires.
- **Progressive Web App** : installable sur mobile et bureau (`manifest.json`), Service Worker (`service-worker.js`) précachant l'app shell (pages, CSS, JS, données de jeu, polices, blasons) pour une consultation **hors ligne** en boutique/tournoi.
- **Accessibilité soignée** : lien d'évitement, `aria-current`, `aria-expanded`, contrastes WCAG AA vérifiés, focus visible, tooltips accessibles au clavier, déclaration d'accessibilité dédiée (`pages/accessibilite.html`).
- **RGPD** : polices auto-hébergées, aucune requête vers un tiers, aucune donnée collectée, mentions légales dédiées (`pages/mentions-legales.html`).

## Arborescence du projet

```text
horus_heresy/
├── index.html               # Page d'accueil (hero + navigation)
├── manifest.json            # Manifeste PWA (installation mobile/bureau)
├── service-worker.js        # Cache hors ligne de l'app shell
├── pages/                   # Pages secondaires (une par section)
│   ├── tour.html            # Les 5 phases d'un tour de jeu (timeline)
│   ├── mouvement.html       # Phase de Mouvement
│   ├── tir.html             # Phase de Tir + tables de référence
│   ├── assaut.html          # Phase d'Assaut + tables de référence
│   ├── defi.html            # Sous-phase de Défi (Postures, Concentration…)
│   ├── statuts-reactions.html # Statuts tactiques et réactions
│   ├── vehicule.html        # Règles des Véhicules (blindage, transports,
│   │                        # Sous-types dont Chevalier…)
│   ├── titan.html           # Règles des Titans (Legio Titanicus)
│   ├── psy.html             # Aptitudes Psychiques (Pouvoirs, Périls du Warp…)
│   ├── regles.html          # Glossaire des règles spéciales (recherche)
│   ├── armes.html           # Arsenal : tables d'armes filtrables
│   ├── unites.html          # Configurateur de liste d'armée
│   ├── choix-legion.html    # Grille des 18 Primarques (page autonome)
│   ├── telechargement.html  # Documents à télécharger
│   ├── contact.html         # Formulaire de signalement (Formspree)
│   ├── mentions-legales.html # Mentions légales (LCEN)
│   └── accessibilite.html   # Déclaration d'accessibilité (RGAA)
├── css/
│   ├── style.css            # Feuille de style commune, mobile-first,
│   │                        # variables CSS nommées par rôle
│   └── choix-legion.css     # Styles propres à la page Choix de la Légion
├── js/                      # JavaScript vanilla, sans dépendance
│   ├── main.js              # Commun : nav/pied de page, menu burger,
│   │                        # accordéons, timeline, tooltips, Service Worker
│   ├── tables.js            # Tables de référence 2D (tir, assaut)
│   ├── regles.js            # Rendu + recherche des règles spéciales
│   ├── regles-data.js       # Données : textes des règles spéciales
│   ├── armes.js             # Rendu + filtrage des tables d'armes
│   ├── armes-data.js        # Données : caractéristiques des armes
│   ├── unites.js            # Logique du configurateur d'unités
│   ├── unites-data.js       # Données : fiches d'unités + équipements
│   ├── organigramme.js      # Assistant de Sélection d'Armée (détachements,
│   │                        # 6 Factions)
│   ├── organigramme-data.js # Données : détachements, avantages, quotas
│   ├── choix-legion.js      # Page autonome de choix de la Légion
│   ├── contact.js           # Envoi AJAX du formulaire de signalement
│   └── vendor/               # jsPDF + AutoTable, auto-hébergées (export PDF)
└── assets/
    ├── fonts/               # Cinzel & Lato auto-hébergées (WOFF2)
    ├── img/                 # Illustrations (hero, logos hors Légion…)
    ├── favicon/              # Favicon par Légion (WEBP)
    ├── logo_legions/        # Logos/blasons des Légions Astartes et
    │                        # portraits des Primarques
    ├── logo_titan/          # Blasons Legio Titanicus
    ├── logo_chevaliers/     # Blasons des Maisonnées Chevaliers Questoris
    ├── logo_mechanicum/     # Logos Mechanicum
    ├── logo_solar_auxilia/  # Logos Solar Auxilia
    ├── pwa/                 # Icônes de l'application installable
    └── documents/           # Fichiers proposés au téléchargement
```

**Convention** : les fichiers `*-data.js` ne contiennent **que des données** (transcriptions des livres) ; la logique de rendu vit dans le fichier du même nom sans suffixe. Pour corriger une valeur de jeu, on ne touche donc qu'aux `-data.js`.

## Technologies utilisées

- **HTML5 / CSS3 / JavaScript vanilla** — aucun framework, aucune étape de build. Seule exception : [jsPDF](https://github.com/parallax/jsPDF) + [AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable) (`js/vendor/`, MIT), auto-hébergées comme les polices, pour l'export PDF du configurateur d'unités. L'export Word ne nécessite aucune dépendance (fichier `.doc` au format HTML).
- **Mobile-first** : les styles de base ciblent le petit écran, les media queries `min-width` enrichissent pour le bureau.
- **Sécurité** : tout le texte est injecté via `textContent` (jamais `innerHTML`) — réflexe anti-XSS.
- Hébergement : **GitHub Pages**.

## Installation locale

```bash
# 1. Cloner le dépôt
git clone https://github.com/jean-desaintangel/horus_heresy.git
cd horus_heresy

# 2a. Ouvrir directement index.html dans un navigateur (aucun serveur requis)
# ou
# 2b. Servir le dossier avec un serveur statique :
npx serve .
# puis ouvrir http://localhost:3000
```

Le site fonctionne intégralement en `file://` : c'est un choix assumé (voir ci-dessous).

## Choix techniques assumés

- **Polices auto-hébergées** (`assets/fonts/`, issues du paquet npm `@fontsource`) plutôt que Google Fonts : aucune IP de visiteur transmise à un tiers (RGPD / CNIL) et chargement plus rapide.
- **Nav et pied de page centralisés en JS** (`js/main.js`, tableau `LIENS_NAV`) : chaque page ne porte qu'un conteneur vide (`<ul class="nav-menu">`, `<footer>`), rempli au chargement — évite la duplication tout en restant consultable en `file://` (une inclusion via `fetch()` échouerait à cause de CORS). Toute nouvelle page doit être ajoutée à `LIENS_NAV` pour apparaître dans le menu. Le site compte **18 pages** (`index.html` + les 17 pages de `pages/`) ; `pages/choix-legion.html` est volontairement autonome (pas de nav/pied de page commun, voir `js/choix-legion.js`) et n'apparaît donc pas dans `LIENS_NAV`.
- **Pas de Content-Security-Policy en `<meta>`** : la source `'self'` est inopérante en `file://`. GitHub Pages ne permettant pas de définir des en-têtes HTTP personnalisés, une CSP devra attendre un éventuel changement d'hébergeur.
- **Open Graph** : les balises `og:` sont présentes, mais `og:image` exige une URL absolue — à compléter maintenant que le domaine est connu.
- **Service Worker en cache-first pour l'app shell** (`service-worker.js`) : précharge pages/CSS/JS/données de jeu/polices/blasons dès la première visite en ligne pour une consultation possible sans réseau ensuite (utile en boutique/tournoi) ; `RACINE_SITE` (`js/main.js`) garde l'enregistrement valide aussi bien en local qu'en sous-chemin GitHub Pages.

## Formulaire de signalement (Formspree)

La page `pages/contact.html` permet aux visiteurs de signaler une erreur ou de proposer une amélioration. Le site étant **statique** (GitHub Pages, aucun serveur PHP), l'envoi du mail est délégué à [Formspree](https://formspree.io).

## Contribuer

Les contributions sont bienvenues : correction d'une valeur de jeu, faute d'orthographe, nouvelle unité dans le configurateur, amélioration d'accessibilité…

1. **Forkez** le dépôt (bouton _Fork_ en haut de la page GitHub) — étape technique imposée par le workflow de Pull Request de GitHub.
2. Créez une branche : `git checkout -b correction-profil-praetor`.
3. Faites vos modifications (les fichiers `js/*-data.js` sont le point d'entrée le plus fréquent).
4. Ouvrez une **Pull Request** en décrivant le changement et, pour une valeur de jeu, la **page du livre** qui fait référence.

Voir [CONTRIBUTING.md](CONTRIBUTING.md) pour le détail.

## Licence

Ce code est publié **à titre de démonstration et de consultation uniquement** — voir [LICENSE](LICENSE). Aucune licence libre ou open source n'est accordée : sauf autorisation écrite préalable de l'auteur, copier, redistribuer ou réutiliser tout ou partie de ce dépôt (code, données de jeu transcrites, assets) dans un autre projet est interdit. Consulter le code, signaler un bug ou proposer une correction via Pull Request reste bien sûr bienvenu.

⚠️ Par ailleurs, les noms, l'univers et les valeurs de jeu de _Warhammer : The Horus Heresy_ restent la propriété intellectuelle de **Games Workshop Ltd**. Les documents du dossier `assets/documents/` conservent la licence de leurs auteurs respectifs.

## Contact / crédits

- **Auteur** : Jean — [ouvrir une issue](https://github.com/jean-desaintangel/horus_heresy/issues) pour toute question ou suggestion.
- **Communauté** : groupe Facebook [Horus Heresy France](https://www.facebook.com/groups/1881902328756053).
- Merci à **Sgt Furius** pour la fiche « Postures de défi ».

---

_Guide non officiel réalisé par des fans bénévoles francophones. Horus Heresy, Warhammer : The Horus Heresy et tous les noms associés sont des marques déposées de Games Workshop Ltd. Ce site n'est ni affilié ni approuvé par Games Workshop._
