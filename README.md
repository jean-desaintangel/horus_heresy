# Horus Heresy · Guide d'initiation

Site statique **non officiel** servant de guide d'initiation au jeu de figurines **Warhammer : The Horus Heresy** (3ᵉ édition), en français. Pensé pour être consulté **sur téléphone pendant une partie** : règles résumées, tables de référence interactives et configurateur de liste d'armée.

👉 **En ligne : [lagrandecroisade.fr](https://lagrandecroisade.fr/)**

![Page d'accueil du guide](assets/img/hero.webp)

---

## 📚 Pour les étudiants : à quoi sert ce dépôt

Ce site est aussi un **support de cours**. Il a été écrit en HTML / CSS / JavaScript **purs**, sans framework et **sans étape de compilation** : le code que vous lisez dans l'éditeur est exactement celui que reçoit le navigateur. Rien n'est caché derrière un outil de build.

Chaque fichier porte un **en-tête commenté** qui explique son rôle, ses dépendances et les choix techniques retenus. Les commentaires expliquent le **pourquoi**, pas le *quoi* : `font-weight: 700` n'a pas besoin d'être traduit, mais le motif d'un contraste, d'un `aria-*` ou d'un ordre de chargement, si.

### Par où commencer

| Étape | Fichier à ouvrir | Ce que vous y verrez |
|---|---|---|
| 1 | `index.html` | Structure d'une page HTML5, balises `<meta>`, chargement des scripts en `defer`, lien d'évitement |
| 2 | `css/style.css` (en-tête) | Mobile-first, variables CSS, organisation d'une feuille de 5 000 lignes |
| 3 | `js/main.js` | Manipulation du DOM, fabrique d'éléments, menu accessible, enregistrement du Service Worker |
| 4 | `js/tables.js` + `pages/tir.html` | Générer un tableau depuis des données plutôt que l'écrire à la main |
| 5 | `js/regles.js` + `js/regles-data.js` | **Séparation données / logique**, recherche insensible aux accents |
| 6 | `js/armes.js` | Filtrage en temps réel, `localStorage`, info-bulles accessibles |
| 7 | `js/unites.js` | Le gros morceau : état applicatif, formulaires dynamiques, export PDF/Word côté client |
| 8 | `service-worker.js` | Fonctionnement hors ligne, cycle de vie et stratégies de cache d'une PWA |

### Notions du programme BTS SIO illustrées

- **Développement web front-end** — HTML sémantique, CSS mobile-first, DOM, événements, `fetch`.
- **Structures de données** — les fichiers `*-data.js` sont des tableaux d'objets ; toute la logique du configurateur consiste à les parcourir, filtrer et agréger.
- **Cybersécurité** — le site n'écrit **jamais** dans `innerHTML` : tout texte passe par `textContent`. C'est le réflexe anti-**XSS** de base, et la raison en est commentée à chaque fois. Voir aussi l'absence de CSP (expliquée plus bas) : savoir *pourquoi* on n'a pas mis une protection fait partie du travail.
- **Stockage client** — `localStorage` pour la sauvegarde de liste, avec `try/catch` systématique (navigation privée, quota dépassé).
- **Accessibilité (RGAA / WCAG)** — `aria-current`, `aria-expanded`, `aria-live`, `:focus-visible`, contrastes vérifiés, `prefers-reduced-motion`. Chaque règle cite son critère.
- **RGPD** — polices auto-hébergées pour ne transmettre aucune IP à un tiers, aucune collecte, mentions légales rédigées.
- **Qualité & outillage** — Prettier pour le format, un script Node de contrôle des données (`check_quantite.js`), modèles d'issue et de Pull Request dans `.github/`.

### Conventions à respecter si vous modifiez le code

1. **Français partout** : noms de classes, de variables, de fonctions et commentaires.
2. **`textContent`, jamais `innerHTML`.** Aucune exception dans ce projet.
3. **Données ≠ logique** : un fichier `*-data.js` ne contient **que** des données. Pour corriger une valeur de jeu, on ne touche qu'à lui.
4. **Aucun `style="…"` ni `onclick="…"` dans le HTML** : la présentation vit dans `css/`, le comportement dans `js/`.
5. **Toute nouvelle page** doit être ajoutée au tableau `LIENS_NAV` (`js/main.js`) pour apparaître dans le menu, **et** à la liste de précache de `service-worker.js` pour rester consultable hors ligne.

---

## Fonctionnalités principales

- **Règles résumées par phase** : construction d'armée, tour de jeu, mouvement, tir, assaut, défi, statuts & réactions, missions.
- **Tables de référence interactives** (CC, Blessure, CT) : surbrillance ligne/colonne au survol, épinglage d'une case au tap sur mobile, première colonne figée au défilement horizontal.
- **Glossaire des règles spéciales** avec recherche instantanée (insensible aux accents).
- **Arsenal** : tables d'armes filtrables, avec info-bulle de définition sur chaque règle spéciale.
- **Configurateur d'unités** : composez votre liste (variantes, options d'armement), coût en points recalculé en direct, fiche récap imprimable, export **PDF** et **Word** en un clic, sauvegarde locale (`localStorage`).
- **Choix de la Légion** : grille interactive des dix-huit Primarques (page dédiée `pages/choix-legion.html`) pour démarrer directement une liste dans le configurateur.
- **Assistant de Sélection d'Armée**, plusieurs Factions jouables — **Legio Astartes**, **Legio Titanicus**, **Chevaliers Questoris**, **Mechanicum**, **Solar Auxilia**, **Conclaves Skitarii**, **Légions Brisées**, **Blackshields**… : organigramme de détachements conforme aux livres d'armée respectifs (Détachement Principal, Auxiliaires, Apex, Détachements Additionnels de Maisonnée, quotas Seigneur de Guerre / Seigneurs des Batailles, Alliés…), validation en temps réel des règles de construction.
- **Pages de règles dédiées** : Véhicules (blindage, transports, Sous-types Rapide/Stable/Super-lourd/Titan/Chevalier), Titans (Legio Titanicus) et Chevaliers Questoris (Paradigmes de Maisonnée, Vœux Questoris, Réactions Avancées).
- **Téléchargements** : aides de jeu maison et documents communautaires.
- **Progressive Web App** : installable sur mobile et bureau (`manifest.json`), Service Worker (`service-worker.js`) précachant l'app shell (pages, CSS, JS, données de jeu, polices, blasons) pour une consultation **hors ligne** en boutique/tournoi.
- **Accessibilité soignée** : lien d'évitement, `aria-current`, `aria-expanded`, contrastes WCAG AA vérifiés, focus visible, tooltips accessibles au clavier, déclaration d'accessibilité dédiée (`pages/accessibilite.html`).
- **RGPD** : polices auto-hébergées, aucune requête vers un tiers, aucune donnée collectée, mentions légales dédiées (`pages/mentions-legales.html`).

---

## Arborescence du projet

```text
horus_heresy/
├── index.html               # Page d'accueil (hero + navigation)
├── 404.html                 # Page d'erreur (chemins ABSOLUS, voir sa fiche)
├── manifest.json            # Manifeste PWA (installation mobile/bureau)
├── service-worker.js        # Cache hors ligne de l'app shell
├── check_quantite.js        # Script Node de contrôle qualité des données
│                            # (hors site : `node check_quantite.js`)
├── robots.txt / sitemap.xml # Référencement
├── CNAME                    # Domaine personnalisé GitHub Pages
├── LICENSE                  # Licence restrictive (voir plus bas)
├── CODE_OF_CONDUCT.md       # Règles de la communauté du dépôt
├── .github/                 # Modèles d'issue et de Pull Request
├── .prettierrc.json         # Format du code (Prettier)
│
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
│   ├── missions.html        # Scénarios et conditions de victoire
│   ├── regles.html          # Glossaire des règles spéciales (recherche)
│   ├── armes.html           # Arsenal : tables d'armes filtrables
│   ├── construction-liste.html # Configurateur de liste d'armée
│   ├── choix-legion.html    # Grille des 18 Primarques (page autonome)
│   ├── telechargement.html  # Documents à télécharger
│   ├── contact.html         # Formulaire de signalement (Formspree)
│   ├── mentions-legales.html # Mentions légales (LCEN)
│   └── accessibilite.html   # Déclaration d'accessibilité (RGAA)
│
├── css/
│   ├── style.css            # Feuille de style commune, mobile-first,
│   │                        # variables CSS nommées par rôle + 18 « skins »
│   │                        # de Légion (voir l'en-tête du fichier)
│   └── choix-legion.css     # Styles propres à la page Choix de la Légion
│
├── js/                      # JavaScript vanilla, sans dépendance
│   ├── main.js              # Commun : nav/pied de page, menu burger,
│   │                        # accordéons, timeline, tooltips, Service Worker
│   ├── sequence-clavier.js  # Détection de mots-clés tapés au clavier
│   │                        # (clins d'œil ; chargé avant main.js)
│   ├── tables.js            # Tables de référence 2D (tir, assaut)
│   ├── regles.js            # Rendu + recherche des règles spéciales
│   ├── regles-data.js       # Données : textes des règles spéciales
│   ├── armes.js             # Rendu + filtrage des tables d'armes
│   ├── armes-data.js        # Données : caractéristiques des armes
│   ├── unites.js            # Logique du configurateur d'unités
│   ├── unites-data.js       # Données : fiches d'unités + équipements
│   ├── organigramme.js      # Assistant de Sélection d'Armée (détachements)
│   ├── organigramme-data.js # Données : détachements, avantages, quotas
│   ├── choix-legion.js      # Page autonome de choix de la Légion
│   ├── contact.js           # Envoi AJAX du formulaire de signalement
│   └── vendor/              # jsPDF + AutoTable, auto-hébergées (export PDF)
│
└── assets/
    ├── fonts/               # Cinzel, Lato & EB Garamond auto-hébergées (WOFF2)
    ├── img/                 # Illustrations (hero, logos hors Légion…)
    ├── favicon/             # Favicon par Légion (WEBP)
    ├── logo_legions/        # Logos/blasons des Légions Astartes et
    │                        # portraits des Primarques
    ├── logo_titan/          # Blasons Legio Titanicus
    ├── logo_chevaliers/     # Blasons des Maisonnées Chevaliers Questoris
    ├── logo_mechanicum/     # Logos Mechanicum
    ├── logo_solar_auxilia/  # Logos Solar Auxilia
    ├── pwa/                 # Icônes de l'application installable
    └── documents/           # Fichiers proposés au téléchargement
```

**Convention centrale** : les fichiers `*-data.js` ne contiennent **que des données** (transcriptions des livres) ; la logique de rendu vit dans le fichier du même nom sans suffixe. Pour corriger une valeur de jeu, on ne touche donc qu'aux `-data.js`. Ces fichiers sont volumineux (`unites-data.js` dépasse 43 000 lignes) : chaque entrée est précédée d'une **bannière de commentaire** `/* --- Nom · Catégorie · coût --- */` qui les rend navigables en repliant le code ou via la recherche de l'éditeur.

---

## Technologies utilisées

- **HTML5 / CSS3 / JavaScript vanilla** — aucun framework, aucune étape de build. Seule exception : [jsPDF](https://github.com/parallax/jsPDF) + [AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable) (`js/vendor/`, MIT), auto-hébergées comme les polices, pour l'export PDF du configurateur d'unités. L'export Word ne nécessite aucune dépendance (fichier `.doc` au format HTML).
- **Mobile-first** : les styles de base ciblent le petit écran, les media queries `min-width` enrichissent pour le bureau.
- **Sécurité** : tout le texte est injecté via `textContent` (jamais `innerHTML`) — réflexe anti-XSS.
- **Hébergement** : GitHub Pages, domaine personnalisé via `CNAME`.

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

Le site fonctionne intégralement en `file://` : c'est un choix assumé (voir ci-dessous). **Attention** cependant : le Service Worker (mode hors ligne) et la page 404 ne fonctionnent qu'à travers un serveur — pour les tester, utilisez l'option **2b**.

### Vérifier les données

```bash
node check_quantite.js
```

Relit les 480 fiches d'unités et signale les options d'armement qui semblent oublier leur remplacement. Doit afficher `Total: 0 problème(s) trouvé(s)`.

---

## Choix techniques assumés

- **Polices auto-hébergées** (`assets/fonts/`, issues du paquet npm `@fontsource`) plutôt que Google Fonts : aucune IP de visiteur transmise à un tiers (RGPD / CNIL) et chargement plus rapide.
- **Nav et pied de page centralisés en JS** (`js/main.js`, tableau `LIENS_NAV`) : chaque page ne porte qu'un conteneur vide (`<ul class="nav-menu">`, `<footer>`), rempli au chargement — évite la duplication tout en restant consultable en `file://` (une inclusion via `fetch()` échouerait à cause de CORS). Le site compte **18 pages** dans `pages/` plus `index.html` et `404.html` ; `pages/choix-legion.html` est volontairement autonome (pas de nav ni de pied de page commun, voir `js/choix-legion.js`) et n'apparaît donc pas dans `LIENS_NAV`.
- **Thèmes par variables CSS** : les dix-huit « skins » de Légion ne dupliquent pas la feuille de style — ils redéfinissent une poignée de variables sur `<body>` (voir la section SKINS de `css/style.css`). C'est l'exemple type de ce qu'apportent les variables CSS natives par rapport à un préprocesseur.
- **Pas de Content-Security-Policy en `<meta>`** : la source `'self'` est inopérante en `file://`. GitHub Pages ne permettant pas de définir des en-têtes HTTP personnalisés, une CSP devra attendre un éventuel changement d'hébergeur. *(Point de discussion utile en cours : une protection qu'on ne peut pas déployer correctement vaut mieux qu'une protection mal déployée qui donne une fausse impression de sécurité.)*
- **Service Worker en cache-first pour l'app shell** (`service-worker.js`) : précharge pages/CSS/JS/données de jeu/polices/blasons dès la première visite en ligne pour une consultation possible sans réseau ensuite (utile en boutique/tournoi) ; `RACINE_SITE` (`js/main.js`) garde l'enregistrement valide aussi bien en local qu'en sous-chemin GitHub Pages. Pensez à incrémenter le numéro de version du cache après toute modification, sinon les visiteurs gardent l'ancienne version.

## Formulaire de signalement (Formspree)

La page `pages/contact.html` permet aux visiteurs de signaler une erreur ou de proposer une amélioration. Le site étant **statique** (GitHub Pages, aucun serveur PHP), l'envoi du mail est délégué à [Formspree](https://formspree.io). C'est le contournement classique du « je n'ai pas de back-end » : le formulaire poste vers un service tiers qui relaie le message par courriel.

## Contribuer

Les contributions sont bienvenues : correction d'une valeur de jeu, faute d'orthographe, nouvelle unité dans le configurateur, amélioration d'accessibilité…

1. **Forkez** le dépôt (bouton _Fork_ en haut de la page GitHub) — étape technique imposée par le workflow de Pull Request de GitHub.
2. Créez une branche : `git checkout -b correction-profil-praetor`.
3. Faites vos modifications (les fichiers `js/*-data.js` sont le point d'entrée le plus fréquent) en respectant les cinq conventions listées plus haut.
4. Lancez `node check_quantite.js` et vérifiez la page concernée dans le navigateur.
5. Ouvrez une **Pull Request** en décrivant le changement et, pour une valeur de jeu, la **page du livre** qui fait référence.

Le dépôt fournit des modèles d'issue et de Pull Request dans `.github/`, ainsi qu'un [code de conduite](CODE_OF_CONDUCT.md).

## Licence

Ce code est publié **à titre de démonstration et de consultation uniquement** — voir [LICENSE](LICENSE). Aucune licence libre ou open source n'est accordée : sauf autorisation écrite préalable de l'auteur, copier, redistribuer ou réutiliser tout ou partie de ce dépôt (code, données de jeu transcrites, assets) dans un autre projet est interdit. Consulter le code, signaler un bug ou proposer une correction via Pull Request reste bien sûr bienvenu.

⚠️ Par ailleurs, les noms, l'univers et les valeurs de jeu de _Warhammer : The Horus Heresy_ restent la propriété intellectuelle de **Games Workshop Ltd**. Les documents du dossier `assets/documents/` conservent la licence de leurs auteurs respectifs.

## Contact / crédits

- **Auteur** : Jean — [ouvrir une issue](https://github.com/jean-desaintangel/horus_heresy/issues) pour toute question ou suggestion.
- **Communauté** : groupe Facebook [Horus Heresy France](https://www.facebook.com/groups/1881902328756053).
- Merci à **Sgt Furius** pour la fiche « Postures de défi ».

---

_Guide non officiel réalisé par des fans bénévoles francophones. Horus Heresy, Warhammer : The Horus Heresy et tous les noms associés sont des marques déposées de Games Workshop Ltd. Ce site n'est ni affilié ni approuvé par Games Workshop._
