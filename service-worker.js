/* ============================================================
   service-worker.js — Mode hors ligne
   Auteur : Jean · Créé : 2026-07-26
   Rôle   : permettre de consulter tout le site (fiches d'unités,
   Arsenal, glossaire des Règles Spéciales, tables de référence...)
   sans connexion — utile en boutique, où il n'y a ni Wi-Fi ni
   réseau mobile. Le site reste 100% statique : ce fichier ne fait
   qu'ajouter un cache local géré par le navigateur.

   Deux stratégies de cache, séparées volontairement :
   1. PRECACHE (installé dès la première visite en ligne) : tout
      l'« app shell » nécessaire pour jouer — pages HTML, CSS, JS,
      données de jeu, polices, blasons de Légion/Maisonnée, et les
      documents de format raisonnable (feuilles d'aide, postures de
      défi). Volontairement complet mais léger (~11 Mo) : on préfère
      tout précharger une fois plutôt que de risquer un fichier
      manquant en boutique.
   2. RUNTIME CACHE (à la demande) : tout le reste, notamment les
      deux gros guides de peinture (~14 Mo chacun, assets/documents/
      guide_peinture_*.pdf). Pas préchargés (inutiles
      pendant une partie, coûteux à télécharger d'un coup) : mis en
      cache la première fois qu'ils sont ouverts, donc disponibles
      hors ligne ENSUITE si le proprio les a déjà consultés une fois
      avec une connexion.

   Cache renouvelé en changeant CACHE_VERSION ci-dessous : le nom du
   cache change, l'ancien est purgé à l'activation, le navigateur
   retélécharge tout au prochain passage en ligne.
   ============================================================ */

// v31 : js/unites-data.js et js/unites.js modifiés (Unités montées
// Outrider/Motojet Scimitar — équipement conditionnel par monture,
// nouvelles Unités Centurion/Ésotériste/Chapelain/Héraut sur moto,
// renommages, tri alphabétique des menus déroulants de choix). Sans
// ce bump, un visiteur déjà venu continue de recevoir les anciens
// js/unites*.js depuis son cache local malgré un rechargement forcé
// (le Service Worker sert ces fichiers en cache-d'abord).
// v26 : favicons en WebP (les chemins .png/.jpg n'existent plus —
// sans changement de version, un visiteur déjà venu resservirait
// depuis son cache une liste d'icônes toutes en 404), extraction du
// CSS/JS de choix-legion.html, pages légales.
// v25 : audit accessibilité/qualité (titres des panneaux dépliables,
// zones de tableau défilables au clavier, palette du thème sombre,
// og:url). Le CSS, les scripts et les 16 pages ayant changé, il FAUT
// incrémenter cette version : sinon un visiteur déjà venu continue de
// recevoir indéfiniment les anciens fichiers depuis son cache local,
// et ne verra aucune des corrections.
// v36 : Arsenals de Légion pour Thousand Sons, Word Bearers, Iron
// Hands, Dark Angels, Space Wolves, White Scars, Raven Guard, Blood
// Angels (js/unites-data.js, js/armes-data.js, js/organigramme-data.js,
// js/unites.js).
// v40 : correctif du bouton « Ajouter à la liste » qui plantait
// silencieusement sur 4 Unités Legio Custodes (options manquant, voir
// CLAUDE.md), corrections de fidélité sur deux Règles Spéciales Legio
// Custodes, et nouvelle Faction Anathema Psykana (4 Unités, js/
// unites-data.js, js/armes-data.js, js/regles-data.js, js/
// organigramme.js, js/organigramme-data.js, js/unites.js).
// v41 : correctif d'une fuite d'Unités entre Factions dans le
// sélecteur « Unité à ajouter » (js/unites.js, uniteAccessible) —
// voir CLAUDE.md.
// v42 : tutoriel « Voir le tutoriel » ajouté pour Conclaves Skitarii,
// Legio Custodes et Anathema Psykana (pages/construction-liste.html,
// js/organigramme.js) — voir CLAUDE.md.
// v43 : tutoriel Legio Custodes affiné avec ses Postures de Défi,
// Réaction Avancée et Avantages Principaux propres
// (pages/construction-liste.html) — voir CLAUDE.md.
// v44 : tutoriel Conclaves Skitarii affiné avec ses Sous-factions
// (Traits de Faction) et sa Réaction Avancée Maréchal Élu
// (pages/construction-liste.html) — voir CLAUDE.md.
// v45 : tutoriel Anathema Psykana affiné avec son Point de Réaction
// Bonus et sa Tactica de Divisio Anathème, et correction d'un texte de
// Règle Spéciale (js/regles-data.js, pages/construction-liste.html) —
// voir CLAUDE.md.
// v46 : skin couleurs seules (sans blason) pour les Factions Legio
// Custodes, Anathema Psykana et Conclaves Skitarii (js/organigramme.js,
// js/main.js, css/style.css) — voir CLAUDE.md.
// v47 : page de garde PDF/Word enrichie pour Chevaliers Questoris
// (identité de Maisonnée + Paradigme), Legio Custodes, Anathema
// Psykana et Conclaves Skitarii (js/unites.js, js/organigramme.js) ;
// bloc « Voir le tutoriel » déplacé sous les paramètres de la partie
// pour toutes les Factions (pages/construction-liste.html) — voir
// CLAUDE.md.
// v48 : bouton "Dupliquer" sur chaque carte d'unité de la liste
// (js/unites.js, css/style.css) — voir CLAUDE.md.
// v49 : frise « Ordre de déploiement » mise à jour — Legio Custodes et
// Anathema Psykana passées en Phase I, Divisio Assassinorum ajoutée en
// Phase II (index.html) — voir CLAUDE.md.
// v50 : tampon d'inquisition du PDF ramené à sa taille d'origine mais
// repositionné deux fois plus près du haut de page (js/unites.js) —
// voir CLAUDE.md.
// v55 : suppléments Journal Tactica Zone Mortalis, The Forges of Saturn
// et Dropsite (nouvelles Unités et Armes Legio Astartes/Solar Auxilia/
// Mechanicum/Word Bearers, Détachements Auxiliaires/d'Apex Maelstrom
// Sentry Battery/Linebreaker Echelon/Fer de Lance de Chute), et nouveau
// sélecteur de Chart de Détachement Principal Zone Mortalis dans les
// paramètres de la partie (js/organigramme.js, js/organigramme-data.js)
// — voir CLAUDE.md.
// v56 : compositions corrigées des Détachements Zone Mortalis Strike
// Force/Bulwark/Linebreaker et Linebreaker Echelon/Maelstrom Sentry
// Battery, confirmées par le proprio contre le livre
// (js/organigramme-data.js) — voir CLAUDE.md.
// v57 : corrige la Baïonnette générique et les Bombes à fusion (Solar
// Auxilia), qui héritaient par erreur de copier-coller de « Fléau des
// Blindages »/du Trait Baïonnette d'une arme voisine
// (js/armes-data.js) — voir CLAUDE.md.
// v58 : corrige le MI de l'Épée énergétique générique ("1" au lieu de
// "I", signalé par le proprio) (js/armes-data.js) — voir CLAUDE.md.
// v59 : tri alphabétique des Unités dans chaque catégorie du menu
// « Unité à ajouter » (js/unites.js) ; nouvelle Unité Champion de
// Légion en Armure Terminator (js/unites-data.js, js/
// organigramme-data.js) ; renommages (Unités Zone Mortalis/Forges of
// Saturn/Dropsite marquées de leur supplément source, Unités "Monté"
// devenues "à moto") ; menu « Chart de Détachement Principal »
// renommé « Choix de Détachement Principal » et étendu à toute
// Faction sauf Legio Titanicus ; restrictions Zone Mortalis (Unités
// Aéronef et Véhicules à plus de 2 PC indisponibles quand un Chart
// Zone Mortalis est sélectionné, js/unites.js) ; Maître de la
// Descente n'est plus verrouillé aux Word Bearers ; 3 nouvelles
// sources Journal Tactica ajoutées (js/main.js) — voir CLAUDE.md.
// v60 : corrige la capitalisation « Zone mortalis » → « Zone Mortalis »
// dans le nom de 4 Unités (js/unites-data.js) — voir CLAUDE.md.
// v66 : explication Export/Import (sauvegarde d'une liste pour la
// reprendre plus tard, à distinguer du PDF/Word) ajoutée sous la barre
// d'actions (pages/construction-liste.html, css/style.css).
// v68 : corrige l'Avantage Principal Préfet (Legio Custodes), qui ne
// s'appliquait pas en vrai (+1 PV, Officier de Ligne (2)), et supprime
// un doublon de l'Avantage Principal Castellan (Imperial Fists) trouvé
// pendant l'audit (js/unites.js, js/organigramme-data.js).
// v69 : corrige le calcul des crédits de Détachements Auxiliaires, qui
// ignorait la Règle Officier de Ligne (X) accordée par un Avantage
// Principal (Préfet) au lieu d'une Unité (js/organigramme.js).
// v70 : ajoute le tutoriel « Voir le tutoriel » de la Faction Démons de
// la Tempête de la Ruine (pages/construction-liste.html,
// js/organigramme.js).
// v71 : ajoute la Faction Légions Brisées (choix de 2-3 Légions, Trait
// de remplacement, Tactiques Mutables) — pages/construction-liste.html,
// js/organigramme.js, js/unites.js, js/regles-data.js, css/style.css.
// v72 : ajoute la Faction Blackshields (Endryd Haar, Rite de Guerre,
// Serments du Moment) et met à jour la frise de la page d'accueil —
// pages/construction-liste.html, js/organigramme.js, js/unites.js,
// js/unites-data.js, js/armes-data.js, js/regles-data.js, index.html.
// v73 : câble mécaniquement les Serments du Moment (Blackshields) et
// les Armureries de Légion (Légions Brisées) au lieu de les laisser en
// texte de référence seul — pages/construction-liste.html,
// js/organigramme.js, js/organigramme-data.js, js/unites.js,
// js/unites-data.js, css/style.css.
// v74 : ajoute les skins couleurs seules pour Démons de la Tempête de
// la Ruine/Légions Brisées/Blackshields et 3 sources dans le pied de
// page — js/organigramme.js, js/main.js, js/unites.js, css/style.css.
// v75 : ajoute le glossaire de « Chercheur d'Expiation » (Hibou Khan),
// corrige un bug de résolution des popups de Règles Spéciales à double
// qualificatif entre parenthèses (js/main.js) et traduit « Aflame (2) »
// resté en anglais (js/unites-data.js) — js/regles-data.js, js/main.js,
// js/unites-data.js.
// v76 : corrige trois options de l'Escouade d'Assaut (Liber Astartes) —
// js/unites-data.js.
// v77 : préfixe chaque ligne de la table de caractéristiques d'Armes de
// la fiche récap du nombre de Figurines qui la portent (ex : « 9 Fusil
// bolter »), avec soustraction exacte pour les échanges `quantite`
// (armes spéciales/lourdes) — js/unites.js.
// v78 : ajoute le Dreadnought Contemptor-Osiron (Thousand Sons) et la
// Cohorte Éoclaste (Blood Angels, résout le gap « Dawnbreaker Cohort »),
// câble les options Legacy Wargear manquantes des 18 Légions
// (legacie_wargear.pdf) sur les listes d'équipement génériques et les
// unités déjà présentes — js/unites-data.js, js/armes-data.js,
// js/regles-data.js, js/organigramme-data.js.
// v83 : audit d'accessibilité — <caption> sur les 18 tableaux écrits à
// la main, retrait des rôles ARIA menu/menuitem non tenus, contraste des
// étiquettes de règle au survol, titre de choix-legion.html, et
// extraction du nouveau fichier js/sequence-clavier.js (partagé par les
// trois clins d'œil au clavier). Ce dernier point est la raison pour
// laquelle CETTE version DOIT être incrémentée : un visiteur ayant déjà
// le site installé garderait sinon un précache v82 sans ce fichier, et
// se retrouverait hors ligne avec un HTML qui le réclame — main.js
// planterait au chargement, emportant la navigation et le pied de page
// avec lui. Toute nouvelle dépendance JS/CSS impose donc deux gestes :
// l'ajouter à la liste ci-dessous ET changer ce numéro.
// v95 : corrige le MI de la Baïonnette tronçonneuse ("1" au lieu de "I",
// signalé par le proprio) (js/armes-data.js).
// v96 : corrige la Cohorte de Thallax (profils, option d'armement individuelle)
// (js/unites-data.js).
const CACHE_VERSION = "v98";
const CACHE_PRECACHE = `horus-heresy-precache-${CACHE_VERSION}`;
const CACHE_RUNTIME = `horus-heresy-runtime-${CACHE_VERSION}`;
const CACHES_CONNUS = [CACHE_PRECACHE, CACHE_RUNTIME];

/* ----------------------------------------------------------
   Liste de precache — chemins relatifs à la racine du site (ce
   fichier vit lui-même à la racine, donc ces chemins se résolvent
   correctement aussi bien en local que sous un sous-dossier
   d'hébergement type GitHub Pages, ex : /horus_heresy/).
   Générée à partir de l'arborescence réelle du site (pages/, js/,
   css/, assets/) le 2026-07-26 : à tenir à jour si de nouvelles
   pages ou données de jeu sont ajoutées (voir CLAUDE.md).
   ---------------------------------------------------------- */
const PRECACHE_URLS = [
  "./",
  "index.html",
  "manifest.json",

  // Pages
  "pages/armes.html",
  "pages/assaut.html",
  "pages/choix-legion.html",
  "pages/accessibilite.html",
  "pages/contact.html",
  "pages/defi.html",
  "pages/mentions-legales.html",
  "pages/mouvement.html",
  "pages/psy.html",
  "pages/regles.html",
  "pages/statuts-reactions.html",
  "pages/telechargement.html",
  "pages/tir.html",
  "pages/titan.html",
  "pages/tour.html",
  "pages/construction-liste.html",
  "pages/vehicule.html",

  // CSS
  "css/style.css",
  "css/choix-legion.css",

  // JS (site + vendor jsPDF, auto-hébergé)
  "js/armes-data.js",
  "js/armes.js",
  "js/choix-legion.js",
  "js/contact.js",
  "js/main.js",
  "js/organigramme-data.js",
  "js/organigramme.js",
  "js/regles-data.js",
  "js/regles.js",
  "js/sequence-clavier.js",
  "js/tables.js",
  "js/unites-data.js",
  "js/unites.js",
  "js/vendor/jspdf.plugin.autotable.min.js",
  "js/vendor/jspdf.umd.min.js",

  // Polices auto-hébergées
  "assets/fonts/cinzel-latin-500-normal.woff2",
  "assets/fonts/cinzel-latin-600-normal.woff2",
  "assets/fonts/cinzel-latin-700-normal.woff2",
  "assets/fonts/cinzel-latin-900-normal.woff2",
  "assets/fonts/ebgaramond-latin-400-italic.woff2",
  "assets/fonts/ebgaramond-latin-400-normal.woff2",
  "assets/fonts/ebgaramond-latin-500-normal.woff2",
  "assets/fonts/ebgaramond-latin-600-normal.woff2",
  "assets/fonts/lato-latin-400-italic.woff2",
  "assets/fonts/lato-latin-400-normal.woff2",
  "assets/fonts/lato-latin-700-normal.woff2",

  // Icônes PWA + favicons (tirage aléatoire, voir js/main.js)
  "assets/pwa/icon-192.png",
  "assets/pwa/icon-512.png",
  "assets/pwa/apple-touch-icon.png",
  "assets/favicon/favicon_alpha_legion.webp",
  "assets/favicon/favicon_blood_angels.webp",
  "assets/favicon/favicon_dark_angels.webp",
  "assets/favicon/favicon_death_guards.webp",
  "assets/favicon/favicon_emperors_children.webp",
  "assets/favicon/favicon_imperial_fists.webp",
  "assets/favicon/favicon_iron_hands.webp",
  "assets/favicon/favicon_iron_warriors.webp",
  "assets/favicon/favicon_mechanicum.webp",
  "assets/favicon/favicon_night_lords.webp",
  "assets/favicon/favicon_raven_guards.webp",
  "assets/favicon/favicon_salamanders.webp",
  "assets/favicon/favicon_sons_of_horus.webp",
  "assets/favicon/favicon_space_wolves.webp",
  "assets/favicon/favicon_thousand_sons.webp",
  "assets/favicon/favicon_ultramarine.webp",
  "assets/favicon/favicon_white_scars.webp",
  "assets/favicon/favicon_word_bearer.webp",
  "assets/favicon/favicon_world_eaters.webp",

  // Images d'illustration (accueil, skin Night Lords...)
  "assets/img/erebus.webp",
  "assets/img/hero.webp",
  "assets/img/logo_inquisition.png",
  "assets/img/night_lords.webp",

  // Blasons de Légion (construction d'armée, choix-legion.html)
  "assets/logo_legions/II_legion.webp",
  "assets/logo_legions/XI_legion.webp",
  "assets/logo_legions/alpha_legion.png",
  "assets/logo_legions/alpharius.webp",
  "assets/logo_legions/angron.webp",
  "assets/logo_legions/angron_demon.webp",
  "assets/logo_legions/blood_angels.png",
  "assets/logo_legions/corvus.webp",
  "assets/logo_legions/dark_angels.png",
  "assets/logo_legions/death_guards.png",
  "assets/logo_legions/dorn.webp",
  "assets/logo_legions/emperor_children.png",
  "assets/logo_legions/ferrus.webp",
  "assets/logo_legions/fulgrim.webp",
  "assets/logo_legions/fulgrim_demon.webp",
  "assets/logo_legions/guilliman.webp",
  "assets/logo_legions/horus.webp",
  "assets/logo_legions/imperial_fists.png",
  "assets/logo_legions/iron_hands.png",
  "assets/logo_legions/iron_warriors.png",
  "assets/logo_legions/khan.webp",
  "assets/logo_legions/konrad.webp",
  "assets/logo_legions/lion.webp",
  "assets/logo_legions/lorgar.webp",
  "assets/logo_legions/magnus.webp",
  "assets/logo_legions/magnus_demon.webp",
  "assets/logo_legions/mortarion.webp",
  "assets/logo_legions/mortarion_demon.webp",
  "assets/logo_legions/night_lords.png",
  "assets/logo_legions/perturabo.webp",
  "assets/logo_legions/raven_guards.png",
  "assets/logo_legions/russ.webp",
  "assets/logo_legions/salamanders.png",
  "assets/logo_legions/sanguinius.webp",
  "assets/logo_legions/sons_of_horus.png",
  "assets/logo_legions/space_wolves.png",
  "assets/logo_legions/thousand_sons.png",
  "assets/logo_legions/ultramarines.png",
  "assets/logo_legions/vulkan.webp",
  "assets/logo_legions/white_scars.png",
  "assets/logo_legions/word_bearers.png",
  "assets/logo_legions/world_eaters.png",

  // Blasons Chevaliers / Mechanicum / Solar Auxilia / Titan
  "assets/logo_chevaliers/logo.png",
  "assets/logo_chevaliers/logo_2.png",
  "assets/logo_chevaliers/logo_3.png",
  "assets/logo_mechanicum/1.png",
  "assets/logo_mechanicum/2.png",
  "assets/logo_solar_auxilia/ambaxtoi_de_barbarus.png",
  "assets/logo_solar_auxilia/chasseur_calibanite.png",
  "assets/logo_solar_auxilia/chasseur_tete_chnotien.png",
  "assets/logo_solar_auxilia/damnatii_nostariens.png",
  "assets/logo_solar_auxilia/elevatii_saiphains.png",
  "assets/logo_solar_auxilia/gardespire_prosperien.png",
  "assets/logo_solar_auxilia/haute_garde_ultramar.png",
  "assets/logo_solar_auxilia/kaerls_fenrissiens.png",
  "assets/logo_solar_auxilia/limitanei_chogoriens.png",
  "assets/logo_solar_auxilia/palatin_archites.png",
  "assets/logo_solar_auxilia/phalangites_inwit.png",
  "assets/logo_solar_auxilia/suaire_de_chaine_stheneen.png",
  "assets/logo_solar_auxilia/thorakites_selucides.png",
  "assets/logo_solar_auxilia/thraexii_nagrakals.png",
  "assets/logo_solar_auxilia/velite_therion.png",
  "assets/logo_solar_auxilia/vindictaire_sparatoi.png",
  "assets/logo_titan/1.png",
  "assets/logo_titan/2.png",

  // Documents de format raisonnable (pense-bêtes utiles en partie)
  "assets/documents/feuille_aide_generale.pptx",
  "assets/documents/feuille_aide_generale.pdf",
  "assets/documents/feuille_aide_regles_speciales.docx",
  "assets/documents/feuille_aide_regles_speciales.pdf",
  "assets/documents/postures_de_defi.pdf",
];

/* ----------------------------------------------------------
   INSTALL — précharge l'app shell.
   `addAll` échoue en bloc si UNE SEULE requête échoue (404, typo de
   chemin...) : on ajoute plutôt fichier par fichier, en journalisant
   les échecs sans bloquer l'installation du reste. `skipWaiting`
   fait passer le nouveau Service Worker actif dès l'installation,
   sans attendre la fermeture de tous les onglets ouverts.
   ---------------------------------------------------------- */
self.addEventListener("install", (evenement) => {
  evenement.waitUntil(
    caches
      .open(CACHE_PRECACHE)
      .then((cache) =>
        Promise.all(
          PRECACHE_URLS.map((url) =>
            cache.add(url).catch((erreur) => {
              console.warn("[SW] Échec de précache :", url, erreur);
            }),
          ),
        ),
      )
      .then(() => self.skipWaiting()),
  );
});

/* ----------------------------------------------------------
   ACTIVATE — purge les caches d'une version précédente et prend le
   contrôle des onglets déjà ouverts (`clients.claim`) sans attendre
   un rechargement manuel.
   ---------------------------------------------------------- */
self.addEventListener("activate", (evenement) => {
  evenement.waitUntil(
    caches
      .keys()
      .then((noms) =>
        Promise.all(
          noms
            .filter((nom) => !CACHES_CONNUS.includes(nom))
            .map((nom) => caches.delete(nom)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

/* ----------------------------------------------------------
   FETCH
   - Requêtes vers un autre domaine (Statcounter...) : laissées
     passer telles quelles, jamais mises en cache ni interceptées —
     en boutique sans réseau elles échoueront simplement, comme un
     <script async> normal, sans bloquer le reste de la page.
   - Navigation entre pages (HTML) : réseau d'abord, cache en repli.
     Le proprio profite du contenu à jour dès qu'il y a du réseau, et
     de la dernière version connue sinon (ex : nouvelle unité Legacy
     ajoutée entre deux visites en boutique).
   - Tout le reste (CSS/JS/données/images/documents, même origine) :
     cache d'abord, réseau en repli — et on met alors en cache la
     réponse dans CACHE_RUNTIME. C'est ce qui permet aux gros PDF non
     précachés (guides de peinture) de devenir disponibles hors ligne
     dès qu'ils ont été ouverts une fois.
   ---------------------------------------------------------- */
self.addEventListener("fetch", (evenement) => {
  const requete = evenement.request;

  if (requete.method !== "GET") return;

  const url = new URL(requete.url);
  if (url.origin !== self.location.origin) return;

  if (requete.mode === "navigate") {
    evenement.respondWith(
      fetch(requete)
        .then((reponse) => {
          const copie = reponse.clone();
          caches.open(CACHE_RUNTIME).then((cache) => cache.put(requete, copie));
          return reponse;
        })
        .catch(() =>
          caches.match(requete).then((r) => r || caches.match("index.html")),
        ),
    );
    return;
  }

  evenement.respondWith(
    caches.match(requete).then((reponseEnCache) => {
      if (reponseEnCache) return reponseEnCache;
      return fetch(requete).then((reponse) => {
        // Ne cacher que les réponses valides (200 OK, même origine).
        if (!reponse || reponse.status !== 200 || reponse.type !== "basic") {
          return reponse;
        }
        const copie = reponse.clone();
        caches.open(CACHE_RUNTIME).then((cache) => cache.put(requete, copie));
        return reponse;
      });
    }),
  );
});
