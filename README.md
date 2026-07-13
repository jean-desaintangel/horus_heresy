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
- **Tables de référence** ([pages/tables.html](pages/tables.html)) — jets de touche, jets de blessure, aptitude au tir, tir instinctif.

## Structure du projet

```
index.html
pages/
  armee.html
  tour.html
  mouvement.html
  tir.html
  assaut.html
  statuts-reactions.html
  regles.html
  tables.html
assets/
  img/         # logo, icône et illustrations
css/
  style.css
js/
  main.js      # menu mobile, accordéons, timeline
  tables.js    # logique des tables de référence
  regles.js    # recherche/filtrage des règles spéciales
```

Site en HTML/CSS/JS vanilla, sans dépendance ni étape de build.

## Lancer le site en local

Ouvrir simplement [index.html](index.html) dans un navigateur, ou servir le dossier avec un serveur statique, par exemple :

```
npx serve .
```

## Avertissement

Guide non officiel réalisé par des fans, pour les nouveaux joueurs. Horus Heresy est une marque de Games Workshop. Ce site ne contient aucun matériel officiel.
