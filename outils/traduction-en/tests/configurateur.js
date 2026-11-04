// Parité FR/EN du configurateur d'armée (pages/construction-liste.html).
// Bloquant (code 1 en cas d'écart) :
//  - coût de chaque unité, de chaque option basculée et de chaque variante ;
//  - pour chaque Faction puis chaque Légion, détachements ajoutés :
//    accessibilité et nombre de cases libres de chaque unité ;
//  - aucune erreur JS.
// Informatif : écarts de rendu des fiches (lignes de profils d'armes,
// étiquettes de règles) — l'anglais reconnaît parfois une arme que le
// français manque, ou l'inverse ; à surveiller s'il grimpe.
const { demarrerServeur, lancerNavigateur } = require("./commun");

const LEGIONS = ["I", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX"];

async function mesurer(nav, base, langue) {
  const page = await nav.newPage();
  const erreurs = [];
  page.on("pageerror", (e) => erreurs.push(e.message.split("\n")[0]));
  page.on("dialog", (d) => d.accept());
  await page.goto(base + langue + "pages/construction-liste.html", { waitUntil: "networkidle0" });

  const couts = await page.evaluate(() => {
    const res = {};
    for (const u of UNITES) {
      const base = { uid: 1, uniteId: u.id, variante: 0, effectif: u.effectif ? u.effectif.base : null, valeurs: valeursParDefaut(u) };
      const ligne = [coutInstance(u, base)];
      for (const [cle, v] of Object.entries(base.valeurs)) {
        if (typeof v !== "boolean" && typeof v !== "number") continue;
        const inst = JSON.parse(JSON.stringify(base));
        inst.valeurs[cle] = typeof v === "boolean" ? !v : v + 1;
        try { ligne.push(coutInstance(u, inst)); } catch { ligne.push("ERR"); }
      }
      (u.variantes || []).forEach((_, i) => { if (i) { try { ligne.push(coutInstance(u, { ...base, variante: i })); } catch { ligne.push("ERR"); } } });
      res[u.id] = ligne.join(" ");
    }
    return res;
  });

  const cle = langue ? "hh-en-fiche-unites" : "hh-fiche-unites";
  const ids = await page.evaluate(() => UNITES.map((u) => u.id));
  const rendu = [];
  for (let i = 0; i < ids.length; i += 60) {
    await page.evaluate((cle, paquet) => {
      localStorage.setItem(cle, JSON.stringify(paquet.map((id, k) => { const u = UNITES.find((x) => x.id === id); return { uid: k + 1, uniteId: id, variante: 0, effectif: u.effectif ? u.effectif.base : null, valeurs: valeursParDefaut(u) }; })));
    }, cle, ids.slice(i, i + 60));
    await page.reload({ waitUntil: "networkidle0" });
    rendu.push(...(await page.evaluate(() => [...document.querySelectorAll("#liste-unites > *")].map((c) => c.querySelectorAll("tr").length + "/" + c.querySelectorAll(".regle-tag").length))));
  }
  await page.evaluate((cle) => localStorage.removeItem(cle), cle);

  const orga = {};
  const configurer = async (faction, legion) => {
    await page.evaluate(() => localStorage.clear()); // repartir d'une Armée vierge
    await page.reload({ waitUntil: "networkidle0" });
    await page.evaluate((faction, legion) => {
      const f = document.getElementById("faction-jeu");
      f.value = faction;
      f.dispatchEvent(new Event("change", { bubbles: true }));
      if (legion) { const l = document.getElementById("legion-armee"); l.value = legion; l.dispatchEvent(new Event("change", { bubbles: true })); }
    }, faction, legion);
    for (let passe = 0; passe < 3; passe++) {
      await page.evaluate(() => {
        for (const s of document.querySelectorAll("select")) {
          if (s.id === "choix-legion-unite" || s.value !== "" || s.options.length < 2 || !s.offsetParent) continue;
          s.value = s.id === "legion-armee" ? "XVI" : s.options[1].value;
          s.dispatchEvent(new Event("change", { bubbles: true }));
        }
      });
    }
    const n = await page.$$eval(".orga-ajout-bouton:not(.orga-ajout-bouton--narratif)", (bs) => bs.filter((b) => b.offsetParent && !b.disabled).length);
    for (let i = 0; i < n; i++) await page.evaluate((i) => { const bs = [...document.querySelectorAll(".orga-ajout-bouton:not(.orga-ajout-bouton--narratif)")].filter((b) => b.offsetParent && !b.disabled); if (bs[i]) bs[i].click(); }, i);
    return page.evaluate(() => UNITES.map((u) => { try { return uniteAccessible(u) ? Organigramme.casesLibresPour(u).length : "x"; } catch (e) { return "ERR"; } }).join(","));
  };
  const factions = await page.$$eval("#faction-jeu option", (os) => os.map((o) => o.value));
  for (const f of factions) orga[f] = await configurer(f, null);
  for (const l of LEGIONS) orga["Légion " + l] = await configurer("legio-astartes", l);
  await page.evaluate(() => localStorage.clear());
  await page.close();
  return { couts, rendu, orga, erreurs, ids };
}

(async () => {
  const { serveur, base } = await demarrerServeur();
  const nav = await lancerNavigateur();
  const fr = await mesurer(nav, base, "");
  const en = await mesurer(nav, base, "en/");
  await nav.close();
  serveur.close();
  let echecs = 0;
  const ecartsCout = Object.keys(fr.couts).filter((id) => fr.couts[id] !== en.couts[id]);
  console.log((ecartsCout.length ? "✗" : "✓") + " coûts : " + Object.keys(fr.couts).length + " unités, " + ecartsCout.length + " écart(s) " + ecartsCout.slice(0, 5).join(" "));
  if (ecartsCout.length) echecs++;
  for (const k of Object.keys(fr.orga)) {
    const a = fr.orga[k].split(","), b = en.orga[k].split(",");
    const diff = a.map((v, i) => (v !== b[i] ? fr.ids[i] : null)).filter(Boolean);
    const err = b.filter((v) => v === "ERR").length;
    if (diff.length || err) echecs++;
    console.log((diff.length || err ? "✗" : "✓") + " organigramme " + k + " : " + a.filter((v) => v !== "x").length + " unités accessibles, " + diff.length + " écart(s) " + diff.slice(0, 4).join(" "));
  }
  const ecartsRendu = fr.rendu.filter((r, i) => r !== en.rendu[i]).length;
  console.log("ℹ rendu des fiches : " + ecartsRendu + " fiche(s) sur " + fr.rendu.length + " avec un nombre différent de lignes d'armes ou d'étiquettes de règles");
  const err = [...new Set(en.erreurs)];
  if (err.length) echecs++;
  console.log((err.length ? "✗" : "✓") + " erreurs JS EN : " + (err.join(" | ") || "aucune") + " (FR : " + ([...new Set(fr.erreurs)].join(" | ") || "aucune") + ")");
  process.exitCode = echecs ? 1 : 0;
})();
