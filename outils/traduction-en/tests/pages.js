// Charge chaque page FR et EN dans le navigateur : aucune erreur JS,
// aucune ressource en 404, menu construit (avec le lien de langue).
const fs = require("fs");
const path = require("path");
const { RACINE, demarrerServeur, lancerNavigateur } = require("./commun");

(async () => {
  const { serveur, base } = await demarrerServeur();
  const nav = await lancerNavigateur();
  const pages = ["index.html", ...fs.readdirSync(path.join(RACINE, "pages")).filter((f) => f.endsWith(".html")).map((f) => "pages/" + f)];
  let echecs = 0;
  for (const langue of ["", "en/"]) {
    for (const p of pages) {
      const page = await nav.newPage();
      const pbs = [];
      page.on("pageerror", (e) => pbs.push("erreur JS : " + e.message.split("\n")[0]));
      page.on("response", (r) => { if (r.status() >= 400) pbs.push(r.status() + " " + r.url()); });
      await page.goto(base + langue + p, { waitUntil: "networkidle0", timeout: 30000 }).catch((e) => pbs.push(e.message));
      const lang = await page.evaluate(() => document.documentElement.lang);
      if (lang !== (langue ? "en" : "fr")) pbs.push("lang=" + lang);
      const menu = await page.$$eval(".nav-menu a", (as) => as.length);
      // choix-legion.html ne charge pas main.js : pas de menu, c'est voulu.
      if (!p.endsWith("choix-legion.html") && menu < 2) pbs.push("menu vide");
      if (pbs.length) echecs++;
      console.log((pbs.length ? "✗ " : "✓ ") + langue + p + (pbs.length ? "\n    " + [...new Set(pbs)].join("\n    ") : ""));
      await page.close();
    }
  }
  await nav.close();
  serveur.close();
  process.exitCode = echecs ? 1 : 0;
})();
