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

const CACHE_VERSION = "v7";
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
  "pages/contact.html",
  "pages/defi.html",
  "pages/mouvement.html",
  "pages/psy.html",
  "pages/regles.html",
  "pages/statuts-reactions.html",
  "pages/telechargement.html",
  "pages/tir.html",
  "pages/titan.html",
  "pages/tour.html",
  "pages/unites.html",
  "pages/vehicule.html",

  // CSS
  "css/style.css",

  // JS (site + vendor jsPDF, auto-hébergé)
  "js/armes-data.js",
  "js/armes.js",
  "js/contact.js",
  "js/main.js",
  "js/organigramme-data.js",
  "js/organigramme.js",
  "js/regles-data.js",
  "js/regles.js",
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
  "assets/favicon/favicon_alpha_legion.jpg",
  "assets/favicon/favicon_blood_angels.jpg",
  "assets/favicon/favicon_dark_angels.jpg",
  "assets/favicon/favicon_death_guards.webp",
  "assets/favicon/favicon_emperors_children.jpg",
  "assets/favicon/favicon_imperial_fists.jpg",
  "assets/favicon/favicon_iron_hands.jpg",
  "assets/favicon/favicon_iron_warriors.png",
  "assets/favicon/favicon_mechanicum.jpg",
  "assets/favicon/favicon_night_lords.webp",
  "assets/favicon/favicon_raven_guards.jpg",
  "assets/favicon/favicon_salamanders.png",
  "assets/favicon/favicon_sons_of_horus.png",
  "assets/favicon/favicon_space_wolves.png",
  "assets/favicon/favicon_thousand_sons.png",
  "assets/favicon/favicon_ultramarine.png",
  "assets/favicon/favicon_white_scars.png",
  "assets/favicon/favicon_word_bearer.jpg",
  "assets/favicon/favicon_world_eaters.jpg",

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
  "assets/documents/feuille_aide_regles_speciales.docx",
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
    caches.open(CACHE_PRECACHE).then((cache) =>
      Promise.all(
        PRECACHE_URLS.map((url) =>
          cache.add(url).catch((erreur) => {
            console.warn("[SW] Échec de précache :", url, erreur);
          })
        )
      )
    ).then(() => self.skipWaiting())
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
            .map((nom) => caches.delete(nom))
        )
      )
      .then(() => self.clients.claim())
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
        .catch(() => caches.match(requete).then((r) => r || caches.match("index.html")))
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
    })
  );
});
