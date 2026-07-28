import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const portalMarkup = await readFile(new URL("../src/pages/portal.astro", import.meta.url), "utf8");
const portalScript = await readFile(new URL("../public/scripts/redesign.js", import.meta.url), "utf8");

const tabNames = [...portalMarkup.matchAll(/data-customer-view="([^"]+)"/g)].map((match) => match[1]);
const pageNames = [...portalMarkup.matchAll(/data-customer-page="([^"]+)"/g)].map((match) => match[1]);
const controlledPanels = [...portalMarkup.matchAll(/aria-controls="portal-([^"]+)"/g)].map((match) => match[1]);

test("customer portal navigation maps every menu item to one customer page", () => {
  assert.equal(tabNames.length, 8);
  assert.deepEqual(tabNames, pageNames);
  assert.deepEqual(tabNames, controlledPanels);
  assert.equal(new Set(tabNames).size, tabNames.length);
  assert.equal(portalMarkup.includes('data-customer-view="owner"'), false);
  assert.equal(portalMarkup.includes('data-customer-page="owner"'), false);
});

test("customer portal starts on overview and supports mouse and keyboard selection", () => {
  assert.match(portalMarkup, /data-customer-view="overview"[^>]+aria-selected="true"[^>]+tabindex="0"/);
  assert.match(portalMarkup, /data-customer-page="overview"/);
  assert.equal(portalScript.includes('addEventListener("click"'), true);
  assert.match(portalScript, /ArrowDown/);
  assert.match(portalScript, /ArrowRight/);
  assert.equal(portalScript.includes("page.hidden = page.dataset.customerPage !== selectedPage"), true);
});
