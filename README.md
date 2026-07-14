# Horus Heresy · Guide d'initiation

Site statique non officiel servant de guide d'initiation au jeu de figurines **Horus Heresy** (3e édition). Pensé pour être consulté sur téléphone pendant une partie.

## Contenu

- **Accueil** ([index.html](index.html)) — présentation et navigation vers les différentes sections.
- **Construction d'armée** ([pages/armee.html](pages/armee.html)) — détachement principal de croisade, détachements auxiliaires et d'Apex, rôles tactiques, cases principales.
- **Déroulement d'un tour** ([pages/tour.html](pages/tour.html)) — les 5 phases de jeu et leurs sous-phases.
- **Phase de Mouvement** ([pages/mouvement.html](pages/mouvement.html)) — types de mouvement et règles associées.
- **Phase de Tir** ([pages/tir.html](pages/tir.html)) — séquence de tir et aptitude au tir.
- **Phase d'Assaut** ([pages/assaut.html](pages/assaut.html)) — séquence de charge, combat et réactions de charge.
- **Statuts & Réactions** ([pages/statuts-reactions.html](pages/statuts-reactions.html)) — les 4 statuts tactiques et la liste des réactions déclenchables.
- **Règles spéciales** ([pages/regles.html](pages/regles.html)) — glossaire des règles spéciales avec recherche instantanée.
- **Pense-bête** ([pages/pense-bete.html](pages/pense-bete.html)) — fiches d'aide à télécharger (feuille d'aide des règles spéciales en Word/PowerPoint/Excel, posture de défi en PDF).

## Structure du projet

```text
index.html
pages/
  armee.html
  tour.html
  mouvement.html
  tir.html
  assaut.html
  statuts-reactions.html
  regles.html
  pense-bete.html
assets/
  img/         # logo, icônes et illustrations (hero.webp + hero.jpg en repli)
  fonts/       # Cinzel et Lato auto-hébergées (WOFF2, sous-ensemble latin)
  pense-bete/  # fiches téléchargeables (feuille d'aide, posture de défi)
css/
  style.css    # mobile-first ; variables de couleurs nommées par rôle
js/
  main.js      # menu mobile, accordéons, timeline, sections repliables
  tables.js    # tables de référence (tir.html et assaut.html)
  regles.js    # recherche/filtrage des règles spéciales
```

Site en HTML/CSS/JS vanilla, sans dépendance ni étape de build.

## Choix techniques assumés

- **Polices auto-hébergées** (`assets/fonts/`, fichiers issus du paquet npm `@fontsource`) plutôt que Google Fonts : aucune IP de visiteur transmise à un tiers (RGPD / recommandations CNIL) et chargement plus rapide.
- **Nav et footer dupliqués dans chaque page** : dette assumée pour rester en statique pur, consultable en `file://` sans serveur ni étape de build (une inclusion via `fetch()` échouerait en `file://` à cause de CORS). Toute modification du menu doit donc être répercutée sur les 9 pages.
- **Pas de Content-Security-Policy en `<meta>`** pour la même raison : la source `'self'` est inopérante en `file://`. À configurer via les en-têtes HTTP de l'hébergeur au moment de la mise en ligne (`default-src 'self'`).
- **Open Graph** : les balises `og:` sont présentes, mais `og:image` exige une URL absolue — à compléter avec le domaine définitif à la mise en ligne.

## Lancer le site en local

Ouvrir simplement [index.html](index.html) dans un navigateur, ou servir le dossier avec un serveur statique, par exemple :

```bash
npx serve .
```

## Avertissement

Guide non officiel réalisé par des fans, pour les nouveaux joueurs. Horus Heresy est une marque de Games Workshop. Ce site ne contient aucun matériel officiel.
