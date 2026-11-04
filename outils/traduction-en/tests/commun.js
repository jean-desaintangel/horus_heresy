// Outils communs aux tests : serveur statique local du site et
// navigateur Chrome/Edge sans interface (puppeteer-core).
const http = require("http");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const RACINE = path.resolve(__dirname, "..", "..", "..");
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".webp": "image/webp", ".png": "image/png", ".woff2": "font/woff2", ".pdf": "application/pdf" };

function demarrerServeur() {
  return new Promise((ok) => {
    const serveur = http.createServer((req, res) => {
      let p = decodeURIComponent(req.url.split("?")[0]);
      if (p.endsWith("/")) p += "index.html";
      fs.readFile(path.join(RACINE, p), (err, data) => {
        if (err) { res.writeHead(404); res.end(); return; }
        res.writeHead(200, { "Content-Type": TYPES[path.extname(p)] || "application/octet-stream" });
        res.end(data);
      });
    });
    serveur.listen(0, () => ok({ serveur, base: "http://localhost:" + serveur.address().port + "/" }));
  });
}

function cheminNavigateur() {
  const candidats = [
    process.env.CHROME,
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ].filter(Boolean);
  const trouve = candidats.find((c) => fs.existsSync(c));
  if (!trouve) throw new Error("Navigateur introuvable : définir la variable CHROME (chemin de chrome/msedge).");
  return trouve;
}

async function lancerNavigateur() {
  const puppeteer = require("puppeteer-core");
  return puppeteer.launch({ executablePath: cheminNavigateur(), headless: true });
}

// Charge des fichiers de données JS dans un bac à sable (sans navigateur).
function chargerDonnees(langue, fichiers, expression) {
  const ctx = {};
  vm.createContext(ctx);
  for (const f of fichiers) vm.runInContext(fs.readFileSync(path.join(RACINE, langue, "js", f), "utf8"), ctx);
  return vm.runInContext(expression, ctx);
}

module.exports = { RACINE, demarrerServeur, lancerNavigateur, chargerDonnees };
