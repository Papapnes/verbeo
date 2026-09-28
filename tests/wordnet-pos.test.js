const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const context = vm.createContext({});
vm.runInContext(fs.readFileSync("wordnet-pos.js", "utf8"), context);

const classify = (word) => JSON.parse(vm.runInContext(
  `JSON.stringify({ nounOnly: WORDNET_NOUN_ONLY.has(${JSON.stringify(word)}), nounVerb: WORDNET_NOUN_VERBS.has(${JSON.stringify(word)}), untaggedVerb: WORDNET_UNTAGGED_VERBS.has(${JSON.stringify(word)}) })`,
  context,
));

assert.deepEqual(classify("car"), { nounOnly: true, nounVerb: false, untaggedVerb: false });
assert.deepEqual(classify("cat"), { nounOnly: false, nounVerb: true, untaggedVerb: true });
assert.deepEqual(classify("glass"), { nounOnly: false, nounVerb: true, untaggedVerb: true });

for (const verb of ["work", "play", "organize", "seek", "shrink"]) {
  assert.equal(classify(verb).nounOnly, false);
  assert.equal(classify(verb).untaggedVerb, false);
}

console.log("WordNet noun/verb confidence checks passed.");
