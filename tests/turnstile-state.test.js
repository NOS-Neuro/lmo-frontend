import test from "node:test";
import assert from "node:assert/strict";

import { describeTurnstileError } from "../src/lib/turnstile-state.js";

test("unauthorized-host errors identify the exact hostname and block submission", function() {
  const result = describeTurnstileError(
    "110200",
    "preview.example.vercel.app"
  );

  assert.equal(result.blocking, true);
  assert.equal(
    result.message,
    "The security check is not authorized for preview.example.vercel.app."
  );
});

test("invalid site-key errors block submission without exposing implementation details", function() {
  const result = describeTurnstileError("110110");

  assert.equal(result.blocking, true);
  assert.match(result.message, /site configuration is invalid/);
});

test("content-blocking errors remain recoverable", function() {
  const result = describeTurnstileError("200500");

  assert.equal(result.blocking, false);
  assert.match(result.message, /content blocking/);
});

test("unknown errors use a refresh-and-retry fallback", function() {
  const result = describeTurnstileError("300030");

  assert.equal(result.blocking, false);
  assert.match(result.message, /Refresh the page/);
});
