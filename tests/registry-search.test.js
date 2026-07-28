import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const registryMarkup = await readFile(new URL("../src/pages/registry.astro", import.meta.url), "utf8");
const registryScript = await readFile(new URL("../public/scripts/redesign.js", import.meta.url), "utf8");

const records = [...registryMarkup.matchAll(/data-registry-record data-search="([^"]+)"/g)].map((match) => match[1]);

test("registry search exposes indexed preview records and accessible feedback", () => {
  assert.equal(records.length, 3);
  assert.equal(records.every((record) => record.includes("example")), true);
  assert.equal(registryMarkup.includes("data-registry-search"), true);
  assert.equal(registryMarkup.includes('aria-live="polite"'), true);
  assert.equal(registryMarkup.includes("data-registry-empty"), true);
});

test("registry search filters live, submits safely, and can be cleared", () => {
  assert.equal(registryScript.includes('registrySearchForm.addEventListener("submit"'), true);
  assert.equal(registryScript.includes('registryQueryInput.addEventListener("input"'), true);
  assert.equal(registryScript.includes('event.key === "Escape"'), true);
  assert.equal(registryScript.includes("terms.every"), true);
  assert.equal(registryScript.includes("record.hidden = !isMatch"), true);
});
