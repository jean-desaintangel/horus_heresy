// Lance tous les tests à la suite : node tests/tout.js
const { execFileSync } = require("child_process");
const path = require("path");
let echecs = 0;
for (const t of ["donnees.js", "pages.js", "configurateur.js"]) {
  console.log("\n=== " + t + " ===");
  try {
    execFileSync(process.execPath, [path.join(__dirname, t)], { stdio: "inherit" });
  } catch {
    echecs++;
  }
}
console.log("\n" + (echecs ? echecs + " test(s) en échec." : "Tous les tests passent."));
process.exitCode = echecs ? 1 : 0;
