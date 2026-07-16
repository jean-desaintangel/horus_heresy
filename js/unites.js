/* ============================================================
   unites.js — Fiches récap d'unités (page unites.html)
   Auteur : Jean · Créé : 2026-07-16
   Rôle   : le visiteur compose sa liste : il ajoute des unités,
   choisit une variante (ex : Praetor / Praetor à Réacteurs) et
   ses options d'armement ; le coût en Points de chaque unité et
   le total de la liste sont recalculés à chaque changement. Une
   fiche récap (profil, équipement final, règles) est générée
   pour chaque unité, et la liste est imprimable (Ctrl+P ou
   bouton dédié — voir les styles @media print de css/style.css).
   Dépend : js/unites-data.js (chargé avant ce script).
   Sécurité : textContent partout, jamais innerHTML (anti-XSS).
   Persistance : la liste est mémorisée dans localStorage pour
   survivre au rechargement de la page (aucune donnée envoyée
   à un serveur).
   ============================================================ */

/* ----------------------------------------------------------
   ÉTAT
   Une « instance » = une unité ajoutée à la liste :
   { uid, uniteId, variante (indice), valeurs: { idOption: valeur } }
   Valeur selon le type d'option :
   - "choix" : indice du <option> sélectionné (0 = conserver)
   - "case" / "paire" : booléen
   - "multi" : tableau d'indices cochés
   ---------------------------------------------------------- */
let armee = [];
let compteurUid = 0;

const CLE_STOCKAGE = "hh-fiche-unites";

// En-têtes du profil d'infanterie et du profil de véhicule.
const ENTETES_PROFIL = ["M", "CC", "CT", "F", "E", "PV", "I", "A", "Cd", "Sf", "Vo", "Int", "Sv", "Inv"];
const ENTETES_VEHICULE = ["M", "CT", "Blindage Avant", "Flanc", "Arrière", "PC", "Capacité de Transport"];

/* ----------------------------------------------------------
   OUTILS DONNÉES
   ---------------------------------------------------------- */

// Retrouve la fiche d'une unité par son id.
function trouverUnite(id) {
  return UNITES.find((u) => u.id === id);
}

// Retire " (liste Pistolets de Légion)" etc. du nom d'un choix :
// l'origine de l'objet est utile dans le menu, pas sur la fiche.
function nomCourt(nom) {
  return nom.replace(/\s*\(liste [^)]*\)$/, "");
}

// Valeurs par défaut des options d'une unité.
function valeursParDefaut(unite) {
  const valeurs = {};
  for (const opt of unite.options) {
    if (opt.type === "choix") valeurs[opt.id] = 0;
    else if (opt.type === "multi") valeurs[opt.id] = [];
    else if (opt.type === "quantite") valeurs[opt.id] = 0;
    else valeurs[opt.id] = false; // case, paire
  }
  return valeurs;
}

/* Budget d'une option "quantite" (escouades) : nombre maximal
   d'échanges autorisés. `parTranche: 5` = 1 échange (ou
   `parTrancheMax`) par tranche de 5 figurines dans l'unité. */
function budgetQuantite(unite, instance, opt) {
  if (opt.parTranche) {
    return Math.floor((instance.effectif || 1) / opt.parTranche) * (opt.parTrancheMax || 1);
  }
  return opt.max || 0;
}

/* Quantité déjà consommée sur ce budget. Les options partageant
   un même `groupe` puisent dans le même budget (ex : « par
   tranche de cinq, UN Légionnaire peut prendre X OU Y »). */
function quantiteUtilisee(unite, instance, opt) {
  if (!opt.groupe) return instance.valeurs[opt.id];
  let total = 0;
  for (const autre of unite.options) {
    if (autre.type === "quantite" && autre.groupe === opt.groupe) {
      total += instance.valeurs[autre.id];
    }
  }
  return total;
}

// Une option est-elle accessible à la variante choisie ?
function optionPermise(opt, instance) {
  return !(opt.variantesExclues && opt.variantesExclues.includes(instance.variante));
}

/* Équipement final d'une instance : équipement de départ, puis
   application de chaque option active. `sansOption` permet de
   calculer « l'équipement si cette option n'existait pas » (sert
   à savoir si une option est encore réalisable : on ne peut pas
   remplacer un bolter déjà remplacé par ailleurs). */
function equipementFinal(unite, instance, sansOption = null) {
  const equip = [...unite.equipement];
  const retirer = (nom) => {
    const i = equip.indexOf(nom);
    if (i !== -1) equip.splice(i, 1);
  };

  for (const opt of unite.options) {
    if (opt.id === sansOption || !optionPermise(opt, instance)) continue;
    const val = instance.valeurs[opt.id];

    if (opt.type === "choix") {
      // `obligatoire: true` : l'indice 0 est un vrai choix (ex :
      // « toutes les figurines DOIVENT prendre une Arme Spéciale »),
      // il apparaît donc aussi sur la fiche.
      if (!val && !opt.obligatoire) continue; // indice 0 = conserver
      const choix = opt.choix[val];
      const cible = choix.remplace || opt.remplace;
      if (!opt.ajoute && cible) retirer(cible);
      // prefixeFiche : précise qui porte l'objet dans une escouade
      // (ex : "Sergent : Arme énergétique").
      equip.push((opt.prefixeFiche || "") + nomCourt(choix.nom));
    } else if (opt.type === "case") {
      if (val && opt.ajoute) equip.push(opt.ajoute);
    } else if (opt.type === "paire") {
      if (val) {
        opt.remplaceListe.forEach(retirer);
        equip.push(opt.ajoute);
      }
    } else if (opt.type === "multi") {
      for (const i of val) equip.push((opt.prefixe || "") + opt.choix[i].nom);
    } else if (opt.type === "quantite") {
      if (val > 0) equip.push(val + " × " + opt.ajoute);
    }
  }
  return equip;
}

/* Une option est-elle actuellement réalisable ? (grise le champ
   sinon). Exemples : la baïonnette exige de conserver le bolter ;
   la paire de griffes exige que bolter ET pistolet soient encore
   là ; le cyber-familier est interdit à la variante à Réacteurs. */
function optionRealisable(unite, instance, opt) {
  if (!optionPermise(opt, instance)) return false;
  const equipSansElle = equipementFinal(unite, instance, opt.id);
  // requiertEquip est comparé en « contient » : "combi-bolter"
  // reconnaît aussi "Poing énergétique Gravis et combi-bolter".
  if (opt.requiertEquip && !equipSansElle.some((e) => e.includes(opt.requiertEquip))) return false;
  if (opt.type === "choix" && opt.remplace && !equipSansElle.includes(opt.remplace)) return false;
  if (opt.type === "paire" && !opt.remplaceListe.every((e) => equipSansElle.includes(e))) return false;
  return true;
}

// Coût total d'une instance : base + variante + figurines
// supplémentaires + options. `parFigurine: true` multiplie le
// coût d'une option par la taille de l'unité (ex : baïonnettes).
function coutInstance(unite, instance) {
  const nbFigurines = instance.effectif || 1;
  let total = unite.cout + unite.variantes[instance.variante].cout;
  if (unite.effectif) {
    total += (instance.effectif - unite.effectif.base) * unite.effectif.cout;
  }
  for (const opt of unite.options) {
    if (!optionPermise(opt, instance)) continue;
    const val = instance.valeurs[opt.id];
    if (opt.type === "choix") total += opt.choix[val].cout * (opt.parFigurine ? nbFigurines : 1);
    else if ((opt.type === "case" || opt.type === "paire") && val)
      total += opt.cout * (opt.parFigurine ? nbFigurines : 1);
    else if (opt.type === "multi") for (const i of val) total += opt.choix[i].cout;
    else if (opt.type === "quantite") total += val * opt.cout;
  }
  return total;
}

// Coût total de la liste.
function coutArmee() {
  return armee.reduce((somme, inst) => somme + coutInstance(trouverUnite(inst.uniteId), inst), 0);
}

/* ----------------------------------------------------------
   PERSISTANCE (localStorage)
   ---------------------------------------------------------- */
function sauvegarder() {
  try {
    localStorage.setItem(CLE_STOCKAGE, JSON.stringify(armee));
  } catch {
    /* stockage indisponible (navigation privée…) : on ignore */
  }
}

function restaurer() {
  try {
    const brut = localStorage.getItem(CLE_STOCKAGE);
    if (!brut) return;
    const donnees = JSON.parse(brut);
    if (!Array.isArray(donnees)) return;
    // On revalide chaque entrée : les données du navigateur ne sont
    // jamais considérées comme sûres (elles ont pu être altérées).
    for (const entree of donnees) {
      const unite = trouverUnite(entree.uniteId);
      if (!unite) continue;
      const instance = {
        uid: ++compteurUid,
        uniteId: unite.id,
        variante: Number.isInteger(entree.variante) && unite.variantes[entree.variante] ? entree.variante : 0,
        effectif: unite.effectif
          ? Number.isInteger(entree.effectif)
            ? Math.min(unite.effectif.max, Math.max(unite.effectif.base, entree.effectif))
            : unite.effectif.base
          : null,
        valeurs: valeursParDefaut(unite),
      };
      for (const opt of unite.options) {
        const v = entree.valeurs ? entree.valeurs[opt.id] : undefined;
        if (opt.type === "choix" && Number.isInteger(v) && opt.choix[v]) instance.valeurs[opt.id] = v;
        else if ((opt.type === "case" || opt.type === "paire") && typeof v === "boolean") instance.valeurs[opt.id] = v;
        else if (opt.type === "multi" && Array.isArray(v))
          instance.valeurs[opt.id] = v.filter((i) => Number.isInteger(i) && opt.choix[i]).slice(0, opt.max);
        else if (opt.type === "quantite" && Number.isInteger(v) && v >= 0)
          instance.valeurs[opt.id] = v; // ramené au budget par actualiserCarte
      }
      armee.push(instance);
    }
  } catch {
    /* JSON invalide : on repart d'une liste vide */
  }
}

/* ----------------------------------------------------------
   RENDU — petites fabriques DOM (textContent uniquement)
   ---------------------------------------------------------- */
function el(balise, classe, texte) {
  const noeud = document.createElement(balise);
  if (classe) noeud.className = classe;
  if (texte !== undefined) noeud.textContent = texte;
  return noeud;
}

// Libellé d'un coût : "Gratuit", "+5 pts"…
function libelleCout(cout) {
  return cout > 0 ? "+" + cout + " pts" : "Gratuit";
}

// Table de profil (infanterie ou véhicule) de la variante choisie.
function construireTableProfil(unite, instance) {
  const variante = unite.variantes[instance.variante];
  const conteneur = el("div", "table-scroll");
  const table = el("table", "table-profil");
  const enTete = document.createElement("thead");
  const corps = document.createElement("tbody");
  const ligneTitres = document.createElement("tr");

  /* Trois formes de profil :
     - véhicule (profilVehicule) : colonnes blindage, une ligne ;
     - escouade (profils)        : une ligne par profil, libellée
       (ex : Légionnaire / Sergent) ;
     - figurine seule (profil)   : une ligne sans libellé. */
  let entetes;
  let lignes; // [{ libelle: string|null, valeurs: [...] }]
  if (variante.profilVehicule) {
    const p = variante.profilVehicule;
    entetes = ENTETES_VEHICULE;
    lignes = [{ libelle: null, valeurs: [p.M, p.CT, p.avant, p.flanc, p.arriere, p.PC, p.transport] }];
  } else if (variante.profils) {
    entetes = [""].concat(ENTETES_PROFIL);
    lignes = variante.profils.map((p) => ({
      libelle: p.nom,
      valeurs: ENTETES_PROFIL.map((c) => p.profil[c]),
    }));
  } else {
    entetes = ENTETES_PROFIL;
    lignes = [{ libelle: null, valeurs: ENTETES_PROFIL.map((c) => variante.profil[c]) }];
  }
  for (const titre of entetes) {
    const th = document.createElement("th");
    th.scope = "col";
    th.textContent = titre;
    ligneTitres.appendChild(th);
  }
  for (const ligne of lignes) {
    const tr = document.createElement("tr");
    if (ligne.libelle !== null) {
      const th = document.createElement("th");
      th.scope = "row";
      th.textContent = ligne.libelle;
      tr.appendChild(th);
    }
    for (const v of ligne.valeurs) tr.appendChild(el("td", null, String(v)));
    corps.appendChild(tr);
  }
  enTete.appendChild(ligneTitres);
  table.appendChild(enTete);
  table.appendChild(corps);
  conteneur.appendChild(table);
  return conteneur;
}

// Bloc « Étiquette : valeur, valeur… » de la fiche récap.
function construireLigneFiche(titre, elements) {
  const p = el("p", "fiche-ligne");
  p.appendChild(el("strong", null, titre + " : "));
  p.appendChild(document.createTextNode(elements.join(" · ")));
  return p;
}

// Partie « fiche récap » d'une carte (reconstruite à chaque changement).
function construireFiche(unite, instance) {
  const fiche = el("div", "unite-fiche");
  const variante = unite.variantes[instance.variante];

  fiche.appendChild(construireTableProfil(unite, instance));
  if (unite.effectif) {
    fiche.appendChild(
      construireLigneFiche("Effectif", [
        instance.effectif + " " + (unite.effectif.suffixe || "figurines"),
      ]),
    );
  }
  fiche.appendChild(
    construireLigneFiche(unite.equipementLibelle || "Équipement", equipementFinal(unite, instance)),
  );
  fiche.appendChild(construireLigneFiche("Traits", unite.traits));
  fiche.appendChild(construireLigneFiche("Règles spéciales", variante.regles));
  fiche.appendChild(construireLigneFiche("Type", [variante.type]));
  if (unite.notes) fiche.appendChild(construireLigneFiche("Notes", [unite.notes]));
  return fiche;
}

/* Met à jour ce qui dépend des valeurs : points de la carte,
   fiche récap, champs grisés, total général. Appelée après
   chaque interaction, sans reconstruire le formulaire (les
   menus déroulants gardent ainsi leur état et le focus). */
function actualiserCarte(carte, unite, instance) {
  // 1. Options devenues irréalisables : on les remet à zéro.
  for (const opt of unite.options) {
    if (optionRealisable(unite, instance, opt)) continue;
    if (opt.type === "choix") instance.valeurs[opt.id] = 0;
    else if (opt.type === "multi") instance.valeurs[opt.id] = [];
    else if (opt.type === "quantite") instance.valeurs[opt.id] = 0;
    else instance.valeurs[opt.id] = false;
  }

  // 1 bis. Quantités : si l'effectif a diminué, on ramène chaque
  // option au budget « par tranche de cinq figurines ».
  for (const opt of unite.options) {
    if (opt.type !== "quantite") continue;
    const debordement =
      quantiteUtilisee(unite, instance, opt) - budgetQuantite(unite, instance, opt);
    if (debordement > 0) {
      instance.valeurs[opt.id] = Math.max(0, instance.valeurs[opt.id] - debordement);
    }
  }

  // 2. Synchronise les champs du formulaire (valeur + grisé).
  for (const opt of unite.options) {
    const realisable = optionRealisable(unite, instance, opt);
    if (opt.type === "choix") {
      const select = carte.querySelector("#opt-" + instance.uid + "-" + opt.id);
      select.value = String(instance.valeurs[opt.id]);
      select.disabled = !realisable;
    } else if (opt.type === "multi") {
      const cases = carte.querySelectorAll("[data-multi='" + opt.id + "']");
      const cochees = instance.valeurs[opt.id];
      cases.forEach((c) => {
        const indice = Number(c.value);
        c.checked = cochees.includes(indice);
        // Limite « jusqu'à max » : on grise les cases non cochées
        // quand le quota est atteint.
        c.disabled = !realisable || (!c.checked && cochees.length >= opt.max);
      });
    } else if (opt.type === "quantite") {
      const champ = carte.querySelector("#opt-" + instance.uid + "-" + opt.id);
      const budget = budgetQuantite(unite, instance, opt);
      const dispo = budget - quantiteUtilisee(unite, instance, opt);
      champ.value = String(instance.valeurs[opt.id]);
      // max dynamique : sa propre valeur + ce qui reste du budget
      // (partagé avec les autres options du même groupe).
      champ.max = String(instance.valeurs[opt.id] + Math.max(0, dispo));
      champ.disabled = !realisable || budget === 0;
    } else {
      const caseACocher = carte.querySelector("#opt-" + instance.uid + "-" + opt.id);
      caseACocher.checked = instance.valeurs[opt.id];
      caseACocher.disabled = !realisable;
    }
  }

  // 3. Fiche récap et coût de l'unité.
  const ancienneFiche = carte.querySelector(".unite-fiche");
  ancienneFiche.replaceWith(construireFiche(unite, instance));
  carte.querySelector(".unite-points").textContent = coutInstance(unite, instance) + " pts";

  // 4. Total général + sauvegarde.
  actualiserTotal();
  sauvegarder();
}

// Formulaire de configuration d'une carte (construit une seule fois).
function construireConfig(carte, unite, instance) {
  const config = el("div", "unite-config");

  // --- Taille de l'unité (escouades) ---
  if (unite.effectif) {
    const groupe = el("fieldset", "unite-variantes");
    groupe.appendChild(el("legend", null, "Effectif"));
    const ligne = el("div", "option-ligne");
    const label = el(
      "label",
      null,
      // libelle personnalisable (ex : « Équipages de Rapier »)
      unite.effectif.libelle ||
        "Nombre de figurines (+" +
          unite.effectif.cout +
          " pts par figurine au-delà de " +
          unite.effectif.base +
          ")",
    );
    const champ = document.createElement("input");
    champ.type = "number";
    champ.id = "effectif-" + instance.uid;
    champ.min = String(unite.effectif.base);
    champ.max = String(unite.effectif.max);
    champ.value = String(instance.effectif);
    label.htmlFor = champ.id;
    champ.addEventListener("change", () => {
      let v = Number(champ.value);
      if (!Number.isInteger(v)) v = unite.effectif.base;
      v = Math.min(unite.effectif.max, Math.max(unite.effectif.base, v));
      instance.effectif = v;
      champ.value = String(v);
      actualiserCarte(carte, unite, instance);
    });
    ligne.appendChild(label);
    ligne.appendChild(champ);
    groupe.appendChild(ligne);
    config.appendChild(groupe);
  }

  // --- Choix de la variante (si l'unité en propose plusieurs) ---
  if (unite.variantes.length > 1) {
    const groupe = el("fieldset", "unite-variantes");
    groupe.appendChild(el("legend", null, "Variante"));
    unite.variantes.forEach((variante, indice) => {
      const label = el("label", "option-ligne");
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "variante-" + instance.uid;
      radio.value = String(indice);
      radio.checked = instance.variante === indice;
      radio.addEventListener("change", () => {
        instance.variante = indice;
        actualiserCarte(carte, unite, instance);
      });
      label.appendChild(radio);
      label.appendChild(
        document.createTextNode(
          " " + variante.nom + (variante.cout > 0 ? " (+" + variante.cout + " pts)" : ""),
        ),
      );
      groupe.appendChild(label);
    });
    config.appendChild(groupe);
  }

  // --- Options d'armement / d'équipement ---
  if (unite.options.length > 0) {
    const groupe = el("fieldset", "unite-options");
    groupe.appendChild(el("legend", null, "Options"));

    for (const opt of unite.options) {
      if (opt.type === "choix") {
        const ligne = el("div", "option-ligne");
        const label = el("label", null, opt.libelle);
        const select = document.createElement("select");
        select.id = "opt-" + instance.uid + "-" + opt.id;
        label.htmlFor = select.id;
        opt.choix.forEach((choix, indice) => {
          const optionHtml = document.createElement("option");
          optionHtml.value = String(indice);
          optionHtml.textContent =
            indice === 0 && !opt.obligatoire
              ? choix.nom
              : choix.nom +
                " — " +
                libelleCout(choix.cout) +
                (opt.parFigurine && choix.cout > 0 ? "/figurine" : "");
          select.appendChild(optionHtml);
        });
        select.addEventListener("change", () => {
          instance.valeurs[opt.id] = Number(select.value);
          actualiserCarte(carte, unite, instance);
        });
        ligne.appendChild(label);
        ligne.appendChild(select);
        groupe.appendChild(ligne);
      } else if (opt.type === "multi") {
        const sousGroupe = el("div", "option-ligne");
        sousGroupe.appendChild(el("p", "option-multi-titre", opt.libelle));
        opt.choix.forEach((choix, indice) => {
          const label = el("label", "option-multi-case");
          const caseACocher = document.createElement("input");
          caseACocher.type = "checkbox";
          caseACocher.value = String(indice);
          caseACocher.dataset.multi = opt.id;
          caseACocher.addEventListener("change", () => {
            const liste = instance.valeurs[opt.id];
            if (caseACocher.checked) liste.push(indice);
            else liste.splice(liste.indexOf(indice), 1);
            actualiserCarte(carte, unite, instance);
          });
          label.appendChild(caseACocher);
          label.appendChild(document.createTextNode(" " + choix.nom + " — " + libelleCout(choix.cout)));
          sousGroupe.appendChild(label);
        });
        groupe.appendChild(sousGroupe);
      } else if (opt.type === "quantite") {
        // Nombre de figurines de l'escouade prenant cet échange
        // (budget « par tranche de cinq » géré par actualiserCarte).
        const ligne = el("div", "option-ligne");
        const label = el(
          "label",
          null,
          opt.libelle + " — " + libelleCout(opt.cout) + " par figurine",
        );
        const champ = document.createElement("input");
        champ.type = "number";
        champ.id = "opt-" + instance.uid + "-" + opt.id;
        champ.min = "0";
        label.htmlFor = champ.id;
        champ.addEventListener("change", () => {
          let v = Number(champ.value);
          if (!Number.isInteger(v) || v < 0) v = 0;
          instance.valeurs[opt.id] = v;
          actualiserCarte(carte, unite, instance);
        });
        ligne.appendChild(label);
        ligne.appendChild(champ);
        groupe.appendChild(ligne);
      } else {
        // "case" et "paire" : simple case à cocher.
        const label = el("label", "option-ligne");
        const caseACocher = document.createElement("input");
        caseACocher.type = "checkbox";
        caseACocher.id = "opt-" + instance.uid + "-" + opt.id;
        caseACocher.addEventListener("change", () => {
          instance.valeurs[opt.id] = caseACocher.checked;
          actualiserCarte(carte, unite, instance);
        });
        label.appendChild(caseACocher);
        label.appendChild(
          document.createTextNode(
            " " +
              opt.libelle +
              " — " +
              libelleCout(opt.cout) +
              (opt.parFigurine && opt.cout > 0 ? "/figurine" : ""),
          ),
        );
        groupe.appendChild(label);
      }
    }
    config.appendChild(groupe);
  }
  return config;
}

// Carte complète d'une unité de la liste.
function construireCarte(instance) {
  const unite = trouverUnite(instance.uniteId);
  const carte = el("article", "unite-carte");
  carte.id = "unite-" + instance.uid;

  // --- En-tête : nom, coût, bouton retirer ---
  const entete = el("header", "unite-carte-entete");
  const titre = el("h3", null, unite.nom);
  const points = el("span", "unite-points", coutInstance(unite, instance) + " pts");
  const retirer = el("button", "unite-retirer", "Retirer");
  retirer.type = "button";
  retirer.setAttribute("aria-label", "Retirer " + unite.nom + " de la liste");
  retirer.addEventListener("click", () => {
    armee = armee.filter((i) => i.uid !== instance.uid);
    carte.remove();
    actualiserTotal();
    sauvegarder();
  });
  entete.appendChild(titre);
  entete.appendChild(points);
  entete.appendChild(retirer);
  carte.appendChild(entete);

  carte.appendChild(el("p", "unite-composition", "Composition d'unité : " + unite.composition));
  carte.appendChild(construireConfig(carte, unite, instance));
  carte.appendChild(construireFiche(unite, instance));

  // Synchronise les champs restaurés depuis localStorage
  // (valeurs + grisés), sans double sauvegarde inutile.
  actualiserCarte(carte, unite, instance);
  return carte;
}

/* ----------------------------------------------------------
   TOTAL GÉNÉRAL + INITIALISATION
   ---------------------------------------------------------- */
function actualiserTotal() {
  const total = document.getElementById("total-armee");
  const nb = armee.length;
  total.textContent =
    nb === 0
      ? "Aucune unité dans la liste."
      : nb + (nb > 1 ? " unités" : " unité") + " — Total : " + coutArmee() + " Points";
}

function initialiser() {
  const selection = document.getElementById("choix-unite");
  const boutonAjouter = document.getElementById("ajouter-unite");
  const boutonImprimer = document.getElementById("imprimer-liste");
  const boutonVider = document.getElementById("vider-liste");
  const listeCartes = document.getElementById("liste-unites");

  // Menu de sélection groupé par catégorie (QG / État-major).
  const categories = [...new Set(UNITES.map((u) => u.categorie))];
  for (const categorie of categories) {
    const groupe = document.createElement("optgroup");
    groupe.label = categorie;
    for (const unite of UNITES.filter((u) => u.categorie === categorie)) {
      const optionHtml = document.createElement("option");
      optionHtml.value = unite.id;
      optionHtml.textContent = unite.nom + " — " + unite.cout + " pts";
      groupe.appendChild(optionHtml);
    }
    selection.appendChild(groupe);
  }

  boutonAjouter.addEventListener("click", () => {
    const unite = trouverUnite(selection.value);
    if (!unite) return;
    const instance = {
      uid: ++compteurUid,
      uniteId: unite.id,
      variante: 0,
      effectif: unite.effectif ? unite.effectif.base : null,
      valeurs: valeursParDefaut(unite),
    };
    armee.push(instance);
    listeCartes.appendChild(construireCarte(instance));
  });

  boutonImprimer.addEventListener("click", () => window.print());

  boutonVider.addEventListener("click", () => {
    armee = [];
    listeCartes.replaceChildren();
    actualiserTotal();
    sauvegarder();
  });

  // Restaure une éventuelle liste mémorisée.
  restaurer();
  for (const instance of armee) listeCartes.appendChild(construireCarte(instance));
  actualiserTotal();
}

// main.js et unites-data.js sont chargés avant (defer) : le DOM est prêt.
initialiser();
