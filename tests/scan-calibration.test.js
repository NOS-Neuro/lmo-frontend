import test from "node:test";
import assert from "node:assert/strict";

import { calibrateScanReport } from "../src/lib/scan-calibration.js";

test("weak evidence stays conservative and recommends rebuilding evidence", function() {
  const result = calibrateScanReport({
    qa_pairs: [
      {
        question: "What services does the business offer?",
        answer: "It likely offers consulting solutions, but the services are not clearly specified."
      },
      {
        question: "Where is the business located?",
        answer: "I could not verify a physical location or headquarters."
      },
      {
        question: "How can customers contact the business?",
        answer: "No email address or phone number was clearly visible."
      }
    ]
  }, { overallScore: 72 });

  assert.equal(result.evidenceStrength, "Weak evidence with material gaps");
  assert.equal(result.bandLabel, "AI visibility: Weak evidence");
  assert.match(result.recommendationTitle, /Rebuild the evidence base/);
  assert.ok(result.unclear.some((item) => item.includes("Service coverage")));
  assert.ok(result.missing.some((item) => item.includes("Location coverage")));
  assert.ok(result.missing.some((item) => item.includes("Contact coverage")));
  assert.match(result.nextStepsHTML, /href="\/contact"/);
  assert.doesNotMatch(result.nextStepsHTML, /stripe|buy\.stripe\.com/i);
});

test("partial evidence stays mixed when one critical signal is still unclear", function() {
  const result = calibrateScanReport({
    qa_pairs: [
      {
        question: "What services does the business offer?",
        answer: "Services include SEO audits, schema implementation, and AI profile management."
      },
      {
        question: "Where is the business located?",
        answer: "The business appears to serve clients across North America, but its exact headquarters is not clear."
      },
      {
        question: "How can customers contact the business?",
        answer: "Contact the team at hello@example.com or call +1 (416) 555-1212."
      },
      {
        question: "Does the business have any case studies?",
        answer: "No case studies were mentioned."
      }
    ]
  }, { overallScore: 84 });

  assert.equal(result.evidenceStrength, "Mixed evidence with some important gaps");
  assert.equal(result.bandLabel, "AI visibility: Mixed evidence");
  assert.match(result.recommendationTitle, /Close evidence gaps/);
  assert.ok(result.verified.some((item) => item.includes("Service coverage")));
  assert.ok(result.verified.some((item) => item.includes("Contact coverage")));
  assert.ok(result.unclear.some((item) => item.includes("Location coverage")));
});

test("false-positive marketing language does not count as proof points", function() {
  const result = calibrateScanReport({
    qa_pairs: [
      {
        question: "Does the business show awards or partnerships?",
        answer: "The company describes itself as award-winning and says it partners with clients to deliver results."
      },
      {
        question: "Are testimonials visible?",
        answer: "The site says it is trusted by leading brands."
      },
      {
        question: "How can customers contact the business?",
        answer: "Visitors are encouraged to contact us for more information."
      }
    ]
  }, { overallScore: 88 });

  assert.ok(!result.verified.some((item) => item.includes("Awards")));
  assert.ok(!result.verified.some((item) => item.includes("Partnerships")));
  assert.ok(!result.verified.some((item) => item.includes("Testimonials")));
  assert.ok(result.unclear.some((item) => item.includes("Awards")));
  assert.ok(result.unclear.some((item) => item.includes("Partnerships")));
  assert.ok(result.unclear.some((item) => item.includes("Testimonials")));
  assert.ok(result.unclear.some((item) => item.includes("Contact coverage")));
});

test("explicit proof points are preserved when they are actually present", function() {
  const result = calibrateScanReport({
    qa_pairs: [
      {
        question: "Does the business list certifications or partnerships?",
        answer: "The company is ISO 27001 certified and is an official HubSpot partner."
      },
      {
        question: "Are there testimonials or case studies?",
        answer: "A case study reports improved conversion rate by 23%, and a testimonial reads \"Their team was exceptional\" - Sarah."
      }
    ]
  }, { overallScore: 61 });

  assert.ok(result.verified.some((item) => item.includes("Certifications")));
  assert.ok(result.verified.some((item) => item.includes("Partnerships")));
  assert.ok(result.verified.some((item) => item.includes("Testimonials")));
  assert.ok(result.verified.some((item) => item.includes("Case studies")));
});
