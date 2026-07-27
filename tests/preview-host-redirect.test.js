import test from "node:test";
import assert from "node:assert/strict";

import { getPreviewHostRedirect } from "../src/lib/preview-host-redirect.js";

test("preview deployments redirect from the unique URL to the stable branch URL", function() {
  assert.deepEqual(
    getPreviewHostRedirect({
      VERCEL_ENV: "preview",
      VERCEL_URL: "app-abc-team.vercel.app",
      VERCEL_BRANCH_URL: "app-git-feature-team.vercel.app"
    }),
    {
      deploymentHost: "app-abc-team.vercel.app",
      branchHost: "app-git-feature-team.vercel.app"
    }
  );
});

test("production deployments never redirect to a branch URL", function() {
  assert.equal(
    getPreviewHostRedirect({
      VERCEL_ENV: "production",
      VERCEL_URL: "app-abc-team.vercel.app",
      VERCEL_BRANCH_URL: "app-git-main-team.vercel.app"
    }),
    null
  );
});

test("local builds and incomplete Vercel metadata do not redirect", function() {
  assert.equal(getPreviewHostRedirect({}), null);
  assert.equal(
    getPreviewHostRedirect({
      VERCEL_ENV: "preview",
      VERCEL_URL: "app-abc-team.vercel.app"
    }),
    null
  );
});
