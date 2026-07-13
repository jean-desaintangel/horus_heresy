# Horus Heresy · Guide d'initiation

Site statique non officiel servant de guide d'initiation au jeu de figurines **Horus Heresy** (3e édition). Pensé pour être consulté sur téléphone pendant une partie.

## Contenu

- **Accueil** ([index.html](index.html)) — présentation et navigation vers les différentes sections.
- **Construction d'armée** ([pages/armee.html](pages/armee.html)) — détachement principal de croisade, détachements auxiliaires et d'Apex, rôles tactiques, cases principales.
- **Déroulement d'un tour** ([pages/tour.html](pages/tour.html)) — les 5 phases de jeu et leurs sous-phases.
- **Statuts & Réactions** ([pages/statuts-reactions.html](pages/statuts-reactions.html)) — les 4 statuts tactiques et la liste des réactions déclenchables.
- **Tables de référence** ([pages/tables.html](pages/tables.html)) — jets de touche, jets de blessure, aptitude au tir, tir instinctif.
- **Règles spéciales** ([pages/regles.html](pages/regles.html)) — glossaire des règles spéciales avec recherche instantanée.

## Structure du projet

```
index.html
pages/
  armee.html
  tour.html
  statuts-reactions.html
  tables.html
  regles.html
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
