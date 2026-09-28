const assert = require("node:assert/strict");
const fs = require("node:fs");

const html = fs.readFileSync("index.html", "utf8");
const engine = fs.readFileSync("verified-override.js", "utf8");

assert.match(html, /\[hidden\]\{display:none!important\}/);
assert.match(engine, /function hideConjugation\(\)[\s\S]*?\.forms"\)\.hidden = true/);
assert.match(engine, /function showConjugation\(\)[\s\S]*?\.forms"\)\.hidden = false/);

console.log("Hidden conjugation visibility checks passed.");
