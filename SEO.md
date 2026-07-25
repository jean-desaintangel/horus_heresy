# Migration du site vers `grande-croisade.fr`

Guide opérationnel pour faire passer le site
`jean-desaintangel.github.io/horus_heresy/` sur le nom de domaine
**`grande-croisade.fr`** (achat prévu le **mercredi 29 juillet 2026**), tout en
profitant de l'opération pour combler les manques SEO.

Hébergement cible : **GitHub Pages, inchangé**. Seule l'adresse publique change.
URL canonique retenue : **l'apex `https://grande-croisade.fr/`** (le `www`
redirigera vers lui).

---

## 0. Vue d'ensemble

| Phase | Quand | Durée | Bloquant ? |
|---|---|---|---|
| A. Préparer le repo (avant l'achat) | dès maintenant | ~1 h | non |
| B. Acheter le domaine | mercredi | 15 min | oui |
| C. Configurer les DNS | mercredi, juste après | 10 min | oui |
| D. Déclarer le domaine dans GitHub Pages | après propagation DNS | 5 min | oui |
| E. Activer HTTPS | 1 h à 24 h après D | 2 min | non |
| F. Basculer les URL absolues du code | après E | 20 min | non |
| G. Search Console + indexation | après F | 30 min | non |

Point important : **ne rien pousser dans le repo tant que le domaine n'est pas
acheté**. Un `CNAME` pointant vers un domaine qui ne t'appartient pas encore
casse le site (GitHub Pages sert alors une 404 sur l'ancienne adresse).

---

## 1. État réel du dépôt (audit du 25/07/2026)

### Déjà en place — rien à faire

- 16 pages HTML (`index.html` + 15 dans `pages/`), toutes avec un `<title>`
  descriptif suffixé `— Horus Heresy` et une `<meta name="description">`
  rédigée. *(Le précédent brouillon de ce guide affirmait que les titres
  étaient « trop courts » : c'est faux, ils ont été enrichis depuis.)*
- Open Graph complet sur les 16 pages (`og:type`, `og:locale`, `og:title`,
  `og:description`, `og:image`).
- Polices auto-hébergées (aucune requête Google Fonts → RGPD OK).
- Hiérarchie de titres H1/H2/H3 propre, lien d'évitement, `lang="fr"`.
- **Tous les chemins internes sont relatifs** (`../css/style.css`,
  `assets/img/...`) et `js/main.js` calcule sa racine dynamiquement
  (`RACINE_SITE = document.currentScript.src.replace(/js\/main\.js.*$/, "")`).
  → Le passage du sous-chemin `/horus_heresy/` à la racine `/` **ne cassera
  aucun lien interne**. C'est le principal risque de ce type de migration, et
  il est déjà écarté.

### À corriger / créer

| Manque | Fichier(s) | Priorité |
|---|---|---|
| Pas de `CNAME` | racine | ★★★ (bloquant) |
| Pas de `robots.txt` | racine | ★★★ |
| Pas de `sitemap.xml` | racine | ★★★ |
| Pas de `<link rel="canonical">` | les 16 pages | ★★★ |
| `og:image` en dur sur `github.io` | les 16 pages | ★★☆ |
| `og:url` absent partout sauf `index.html` | les 15 pages de `pages/` | ★★☆ |
| Pas de page `404.html` | racine | ★★☆ |
| Pas de JSON-LD (données structurées) | `index.html` | ★☆☆ |
| Pas de `twitter:card` | les 16 pages | ★☆☆ |
| Liens `github.io` dans la doc | `README.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md` | ★☆☆ |

Inventaire exact des occurrences à remplacer (36 au total) :

```
index.html            : og:image (l. 41), og:url (l. 45), commentaire Statcounter (l. 119)
pages/*.html (×15)    : og:image (l. 35, sauf choix-legion.html l. 24)
                        + commentaire Statcounter en fin de fichier
README.md             : l. 14
CONTRIBUTING.md       : l. 35
SECURITY.md           : l. 11
CODE_OF_CONDUCT.md    : l. 31
js/main.js            : l. 495 (commentaire seulement, aucun impact fonctionnel)
```

---

## 2. Phase B — acheter `grande-croisade.fr` (mercredi)

Points de vigilance propres au `.fr` (registre AFNIC) :

1. **Éligibilité** : le `.fr` exige une adresse dans l'Union européenne, l'Islande,
   le Liechtenstein, la Norvège ou la Suisse. En tant que particulier français,
   aucune formalité supplémentaire.
2. **Protection des données WHOIS** : pour un particulier, l'AFNIC masque par
   défaut les coordonnées. Vérifie quand même que l'option « vie privée » /
   « WHOIS protection » est bien active chez le registrar — c'est gratuit sur
   `.fr`, ne paie pas pour ça.
3. **Renouvellement automatique** : active-le. Un domaine expiré = site mort +
   risque de rachat par un squatteur.
4. **Registrar** : n'importe lequel convient (OVHcloud, Gandi, Infomaniak,
   Namecheap…). Le seul critère technique ici est de pouvoir **éditer
   librement la zone DNS** (enregistrements A, AAAA, CNAME, TXT) — c'est le cas
   partout, mais évite les offres « domaine + hébergement » où la zone est
   verrouillée.
5. Note l'identifiant de connexion à l'interface DNS : tu en auras besoin dans
   les 10 minutes qui suivent.

---

## 3. Phase C — configurer la zone DNS

Dans l'interface DNS du registrar, crée exactement ceci :

### Apex (`grande-croisade.fr`) — 4 enregistrements A

| Type | Nom / Hôte | Valeur | TTL |
|---|---|---|---|
| A | `@` | `185.199.108.153` | 3600 |
| A | `@` | `185.199.109.153` | 3600 |
| A | `@` | `185.199.110.153` | 3600 |
| A | `@` | `185.199.111.153` | 3600 |

*Pourquoi 4 ?* Répartition de charge et tolérance de panne côté GitHub : le
résolveur choisit une IP au hasard parmi les quatre. En mettre une seule
« marche » mais te rend dépendant d'un unique point de défaillance.

*Pourquoi des A et pas un CNAME ?* La RFC 1034 interdit un CNAME à l'apex
d'une zone (il coexisterait avec les enregistrements SOA/NS obligatoires). Si
ton registrar propose un `ALIAS` ou `ANAME` (Gandi, DNSimple…), c'est une
alternative propriétaire acceptable et même préférable — elle suit les
changements d'IP de GitHub automatiquement.

### IPv6 (facultatif mais recommandé) — 4 enregistrements AAAA

| Type | Nom | Valeur |
|---|---|---|
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |

*(À revérifier sur la doc GitHub le jour J — ces IP peuvent évoluer.)*

### `www` — 1 enregistrement CNAME

| Type | Nom | Valeur |
|---|---|---|
| CNAME | `www` | `jean-desaintangel.github.io.` |

Attention : la valeur est le **domaine GitHub Pages du compte**
(`jean-desaintangel.github.io`), **sans** `/horus_heresy` et **sans** `https://`.
Le point final est facultatif selon les interfaces.

GitHub servira alors le site sur les deux adresses et redirigera
`www.grande-croisade.fr` → `grande-croisade.fr` (puisque c'est l'apex qui sera
déclaré comme domaine personnalisé).

### Ne crée PAS

- d'enregistrement joker `*.grande-croisade.fr` → risque de prise de contrôle
  de sous-domaine ;
- d'enregistrement A vers une IP « parking » du registrar (souvent créé par
  défaut : **supprime-le**, il entrerait en conflit) ;
- de redirection web / « web forwarding » du registrar : ce n'est pas la même
  chose qu'un vrai DNS et ça casse le HTTPS de GitHub.

### Vérifier la propagation

```bash
# Sous Windows (PowerShell)
Resolve-DnsName grande-croisade.fr -Type A
Resolve-DnsName www.grande-croisade.fr -Type CNAME

# Sous Linux/macOS/WSL
dig grande-croisade.fr +noall +answer
dig www.grande-croisade.fr +noall +answer
```

Tu dois voir les 4 IP `185.199.10x.153`. Compte de 10 minutes à quelques heures
(le TTL de la zone parente est de 24 h au pire). Utile pour vérifier depuis
l'extérieur de ton FAI : `https://dnschecker.org`.

---

## 4. Phase D — déclarer le domaine dans GitHub Pages

**Passe par l'interface, pas par un fichier `CNAME` écrit à la main** : l'UI
lance en plus le contrôle DNS et le certificat.

1. Repo `jean-desaintangel/horus_heresy` → **Settings** → **Pages**.
2. Section *Custom domain* : saisir `grande-croisade.fr` → **Save**.
3. GitHub crée automatiquement un fichier `CNAME` à la racine du dépôt,
   contenant une seule ligne :
   ```
   grande-croisade.fr
   ```
   → pense à faire un `git pull` en local, sinon ton prochain push écrasera ce
   fichier et cassera le domaine (piège classique).
4. Attends le message vert « DNS check successful ». S'il reste rouge, c'est
   la propagation DNS : reviens 30 min plus tard.

### Vérification de domaine (anti-takeover) — 5 min, à faire

Profil GitHub → **Settings** → **Pages** → *Add a domain*. GitHub donne un
enregistrement TXT à créer (`_github-pages-challenge-jean-desaintangel`).
Une fois vérifié, personne d'autre sur GitHub ne peut réclamer ton domaine si
tu le retires un jour de ce repo. Gratuit, définitif, aucune raison de s'en
priver.

---

## 5. Phase E — HTTPS

Une fois le contrôle DNS validé, GitHub demande un certificat Let's Encrypt.
Cela prend de quelques minutes à 24 h.

- Settings → Pages → coche **Enforce HTTPS** dès que la case est cliquable
  (elle est grisée tant que le certificat n'est pas émis).
- Si au bout de 24 h le certificat n'arrive pas : retire le domaine
  personnalisé, sauvegarde, remets-le. C'est le remède officiel, il relance
  l'émission.
- Symptôme fréquent pendant la transition : erreur de certificat sur
  `www.grande-croisade.fr`. Normal, GitHub émet un certificat par nom ; attends.

À partir de là, **GitHub redirige automatiquement (301)**
`jean-desaintangel.github.io/horus_heresy/*` vers `grande-croisade.fr/*`.
Aucune redirection manuelle à écrire, et le « jus SEO » de l'ancienne adresse
est transmis. C'est aussi ce qui évite le contenu dupliqué.

---

## 6. Phase F — mettre à jour les URL absolues du code

### 6.1 Remplacement global

Depuis la racine du repo, dans Git Bash / WSL :

```bash
# Vérifier d'abord ce qui sera touché
grep -rln "jean-desaintangel.github.io/horus_heresy" --include="*.html" --include="*.md" --include="*.js" .

# Puis remplacer
grep -rl "jean-desaintangel.github.io/horus_heresy" \
  --include="*.html" --include="*.md" --include="*.js" . \
| xargs sed -i 's|https://jean-desaintangel\.github\.io/horus_heresy|https://grande-croisade.fr|g'
```

Attention au piège : l'ancienne URL comportait un segment de chemin
(`/horus_heresy`), la nouvelle non. Le motif ci-dessus supprime bien les deux
d'un coup. Vérifie ensuite qu'il ne reste aucun `//assets` :

```bash
grep -rn "grande-croisade.fr//" .
```

En PowerShell, l'équivalent :

```powershell
Get-ChildItem -Recurse -Include *.html,*.md,*.js |
  ForEach-Object {
    (Get-Content $_ -Raw) -replace 'https://jean-desaintangel\.github\.io/horus_heresy','https://grande-croisade.fr' |
      Set-Content $_ -NoNewline
  }
```

Ne touche pas aux liens `https://github.com/jean-desaintangel/horus_heresy`
(dépôt, issues) : eux restent valides et le motif ci-dessus ne les vise pas.

### 6.2 Ajouter `canonical` + `og:url` dans chaque page

Le `canonical` dit à Google « voici l'adresse officielle de cette page ». Il
protège contre le contenu dupliqué (`www` vs apex, `?utm_source=…`,
ancienne adresse `github.io` encore indexée quelque temps).

Dans `index.html`, juste après le `<title>` :

```html
<link rel="canonical" href="https://grande-croisade.fr/" />
```

Dans chaque `pages/xxx.html`, en adaptant le nom de fichier :

```html
<link rel="canonical" href="https://grande-croisade.fr/pages/regles.html" />
```

Et dans le bloc Open Graph de chaque page de `pages/` (seul `index.html` a
aujourd'hui un `og:url`) :

```html
<meta property="og:url" content="https://grande-croisade.fr/pages/regles.html" />
```

Script pour générer les 15 lignes sans les taper à la main :

```bash
for f in pages/*.html; do
  echo "$f → https://grande-croisade.fr/$f"
done
```

### 6.3 Twitter Card (bonus 2 min)

Les métadonnées Open Graph suffisent à Discord et Facebook, mais X/Twitter
exige `twitter:card` pour afficher une grande vignette. À ajouter dans les 16
pages, à la suite du bloc `og:` :

```html
<meta name="twitter:card" content="summary_large_image" />
```

---

## 7. Phase F (suite) — les 3 fichiers à créer à la racine

### `robots.txt`

```
User-agent: *
Allow: /

Sitemap: https://grande-croisade.fr/sitemap.xml
```

*Pédagogique* : `robots.txt` ne protège rien (il est public et purement
déclaratif) — c'est une convention respectée par les robots honnêtes.
N'y mets jamais de chemin « secret » : ce serait précisément le publier.

### `sitemap.xml`

Les 16 URL réelles du site. `<lastmod>` est le seul champ que Google prend
encore en compte (il ignore `priority` et `changefreq` depuis 2023) ; mets une
date au format ISO et pense à la rafraîchir lors des grosses mises à jour.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://grande-croisade.fr/</loc><lastmod>2026-07-29</lastmod></url>
  <url><loc>https://grande-croisade.fr/pages/unites.html</loc><lastmod>2026-07-29</lastmod></url>
  <url><loc>https://grande-croisade.fr/pages/tour.html</loc><lastmod>2026-07-29</lastmod></url>
  <url><loc>https://grande-croisade.fr/pages/mouvement.html</loc><lastmod>2026-07-29</lastmod></url>
  <url><loc>https://grande-croisade.fr/pages/tir.html</loc><lastmod>2026-07-29</lastmod></url>
  <url><loc>https://grande-croisade.fr/pages/assaut.html</loc><lastmod>2026-07-29</lastmod></url>
  <url><loc>https://grande-croisade.fr/pages/defi.html</loc><lastmod>2026-07-29</lastmod></url>
  <url><loc>https://grande-croisade.fr/pages/armes.html</loc><lastmod>2026-07-29</lastmod></url>
  <url><loc>https://grande-croisade.fr/pages/statuts-reactions.html</loc><lastmod>2026-07-29</lastmod></url>
  <url><loc>https://grande-croisade.fr/pages/regles.html</loc><lastmod>2026-07-29</lastmod></url>
  <url><loc>https://grande-croisade.fr/pages/psy.html</loc><lastmod>2026-07-29</lastmod></url>
  <url><loc>https://grande-croisade.fr/pages/vehicule.html</loc><lastmod>2026-07-29</lastmod></url>
  <url><loc>https://grande-croisade.fr/pages/titan.html</loc><lastmod>2026-07-29</lastmod></url>
  <url><loc>https://grande-croisade.fr/pages/choix-legion.html</loc><lastmod>2026-07-29</lastmod></url>
  <url><loc>https://grande-croisade.fr/pages/telechargement.html</loc><lastmod>2026-07-29</lastmod></url>
  <url><loc>https://grande-croisade.fr/pages/contact.html</loc><lastmod>2026-07-29</lastmod></url>
</urlset>
```

### `404.html`

GitHub Pages sert automatiquement un fichier `404.html` placé à la racine.
Sans lui, tes visiteurs tombent sur la page 404 générique de GitHub — sans ta
navigation ni ta charte. À créer sur le modèle d'une page existante (reprends
l'en-tête de `index.html`, garde `<meta name="robots" content="noindex">`) :

```html
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Page introuvable — Horus Heresy</title>
    <meta name="robots" content="noindex" />
    <link rel="stylesheet" href="/css/style.css" />
    <link rel="icon" type="image/png" href="/assets/img/eye-of-horus.png" />
    <script src="/js/main.js" defer></script>
  </head>
  <body>
    <header class="nav"><div class="nav-inner">
      <a class="nav-logo" href="/index.html">Horus Heresy <span>· Guide d’initiation</span></a>
      <ul class="nav-menu"></ul>
    </div></header>
    <main id="contenu">
      <h1>Cette page s’est perdue dans la Dissonance</h1>
      <p>L’adresse demandée n’existe pas (ou plus).
         <a href="/index.html">Retour à l’accueil</a>.</p>
    </main>
    <footer></footer>
  </body>
</html>
```

Particularité : cette page peut être servie depuis **n'importe quelle**
profondeur d'URL (`/pages/n-importe-quoi.html`), donc ses chemins doivent être
**absolus depuis la racine** (`/css/style.css`) et non relatifs — c'est la
seule page du site dans ce cas. Elle ne fonctionne d'ailleurs correctement
qu'une fois le domaine personnalisé actif (avant, le site vit dans
`/horus_heresy/`).

---

## 8. Données structurées (facultatif, ★☆☆)

Un bloc JSON-LD dans `index.html` aide Google à comprendre la nature du site
et peut faire apparaître un fil d'Ariane / une boîte de recherche. À placer
avant `</head>` :

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Horus Heresy — Guide d’initiation",
    "alternateName": "Grande Croisade",
    "url": "https://grande-croisade.fr/",
    "inLanguage": "fr-FR",
    "description": "Guide non officiel pour le jeu de figurines Warhammer: The Horus Heresy 3e édition."
  }
</script>
```

Ne déclare pas de `"@type": "Organization"` avec un logo tant que le site reste
un projet personnel non officiel : autant rester exact. Valide le bloc sur
`https://validator.schema.org/`.

---

## 9. Services tiers à reconfigurer

| Service | Où | Action |
|---|---|---|
| **Formspree** (`pages/contact.html`, form `mwvgodaq`) | dashboard Formspree → *Form settings* | Si tu as restreint le formulaire à un domaine autorisé, ajoute `grande-croisade.fr` — sinon les signalements seront rejetés silencieusement. Teste un envoi réel après bascule. |
| **Statcounter** (projet 13337655) | Project config | Le comptage se fait par identifiant de projet : il continue de fonctionner sans rien faire. Mets quand même à jour l'URL du projet pour que les rapports affichent le bon domaine. La rupture de série dans les stats est normale. |
| **Google Search Console** | voir §10 | Nouvelle propriété à créer. |

---

## 10. Phase G — indexation

1. **Google Search Console** → *Ajouter une propriété* → type **Domaine**
   (et non « préfixe d'URL ») : elle couvre l'apex, le `www` et le HTTP/HTTPS
   d'un coup. Vérification par enregistrement **TXT** dans la zone DNS — tu la
   contrôles déjà, c'est la voie la plus simple.
2. Soumets `https://grande-croisade.fr/sitemap.xml` dans *Sitemaps*.
3. *Inspection d'URL* → demande l'indexation manuelle de 3 pages, pas plus
   (quota journalier) : l'accueil, `pages/regles.html` et `pages/unites.html`
   (tes deux pages les plus utiles, et les plus recherchées : « règles
   spéciales » et « construction d'armée »).
4. **Bing Webmaster Tools** : propose l'import direct depuis Search Console,
   30 secondes. Bing alimente aussi DuckDuckGo et Ecosia — non négligeable.
5. Patience : compte 3 à 15 jours pour une indexation significative, plus
   longtemps pour que les anciennes URL `github.io` disparaissent des SERP
   (elles redirigent en attendant, donc aucun visiteur perdu).

---

## 11. Vérifications finales

```bash
# 1. Les 4 A sont bien servis
dig grande-croisade.fr +short

# 2. HTTPS valide et pas de chaîne de redirections
curl -sIL https://grande-croisade.fr/ | grep -i "^HTTP\|^location"

# 3. www redirige bien vers l'apex (301, une seule étape)
curl -sIL https://www.grande-croisade.fr/ | grep -i "^HTTP\|^location"

# 4. L'ancienne adresse redirige
curl -sIL https://jean-desaintangel.github.io/horus_heresy/pages/regles.html | grep -i "^HTTP\|^location"

# 5. robots et sitemap accessibles
curl -s https://grande-croisade.fr/robots.txt
curl -sI https://grande-croisade.fr/sitemap.xml | head -1

# 6. La 404 personnalisée sort bien
curl -sI https://grande-croisade.fr/page-qui-n-existe-pas | head -1   # attendu : 404
```

Puis, dans le navigateur :

- **Lighthouse** (DevTools → Lighthouse) sur l'accueil et `regles.html` :
  onglets *SEO* et *Accessibilité*. Vise 100 en SEO ; les points restants après
  cette migration seront surtout des détails de contraste.
- **Partage** : colle `https://grande-croisade.fr/pages/regles.html` dans un
  message Discord et vérifie que la vignette `hero.webp` s'affiche. Si Discord
  garde l'ancienne image en cache, utilise le *Facebook Sharing Debugger* pour
  forcer un rafraîchissement.
- `site:grande-croisade.fr` dans Google, une fois par semaine, pour suivre le
  nombre de pages indexées (16 attendues).

---

## 12. Plan de repli

Si quelque chose tourne mal (site inaccessible, certificat bloqué) :

1. Settings → Pages → vider le champ *Custom domain* → **Save**.
2. Supprimer le fichier `CNAME` en local et pousser.
3. Le site redevient immédiatement disponible sur
   `jean-desaintangel.github.io/horus_heresy/`.

Rien n'est irréversible : le domaine et l'hébergement sont découplés. Le seul
vrai coût d'un aller-retour est un peu de confusion côté index Google.

---

## 13. Checklist mercredi

```
[ ] Domaine grande-croisade.fr acheté, renouvellement auto activé
[ ] Enregistrement A parking du registrar supprimé
[ ] 4 enregistrements A (+ 4 AAAA) sur @
[ ] CNAME www → jean-desaintangel.github.io
[ ] dig confirme la propagation
[ ] Settings → Pages → Custom domain = grande-croisade.fr, DNS check vert
[ ] git pull (récupérer le fichier CNAME créé par GitHub)
[ ] Domaine vérifié dans les Settings du profil GitHub (TXT anti-takeover)
[ ] Enforce HTTPS coché
[ ] sed de remplacement des URL absolues (36 occurrences)
[ ] canonical ajouté sur les 16 pages
[ ] og:url ajouté sur les 15 pages de pages/
[ ] twitter:card ajouté (facultatif)
[ ] robots.txt créé
[ ] sitemap.xml créé (16 URL)
[ ] 404.html créé (chemins absolus !)
[ ] JSON-LD ajouté sur index.html (facultatif)
[ ] Formspree : domaine autorisé mis à jour + test d'envoi réel
[ ] Statcounter : URL du projet mise à jour
[ ] Search Console : propriété Domaine + TXT + sitemap soumis
[ ] Bing Webmaster Tools : import depuis Search Console
[ ] Les 6 vérifications curl/dig passent
[ ] Lighthouse SEO = 100 sur index.html et regles.html
```

---

## 14. Questions restées ouvertes

- **Le nom `grande-croisade.fr` ne contient pas « Horus Heresy »**, qui est ton
  principal mot-clé de recherche. Ce n'est pas grave (Google ne pondère plus le
  nom de domaine depuis la mise à jour EMD de 2012), mais cela renforce
  l'importance des `<title>` et du `<h1>`, qui eux le contiennent déjà.
  Pense à ce que la balise `og:site_name` (absente aujourd'hui) porte les deux :
  `<meta property="og:site_name" content="Grande Croisade — Guide Horus Heresy" />`.
- **Marque déposée** : « Horus Heresy » et « Warhammer » appartiennent à Games
  Workshop. Ton domaine n'en reprend aucun — c'est précisément ce qui rend
  `grande-croisade.fr` plus prudent qu'un `horus-heresy.fr`. Garde la mention
  « guide non officiel » visible en pied de page.
- **Renommer le repo** en `grande-croisade` : possible plus tard, sans effet sur
  le site une fois le domaine personnalisé actif. À ne pas faire le même jour
  que la migration (une variable à la fois).

---

Sources : [Managing a custom domain for your GitHub Pages site](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) · [About custom domains and GitHub Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages) · [Securing your GitHub Pages site with HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https) · [Troubleshooting custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/troubleshooting-custom-domains-and-github-pages)
