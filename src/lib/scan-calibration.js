function asArray(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (typeof value === "string" && value.trim()) {
    return [value.trim()];
  }

  if (value && typeof value === "object") {
    return [value];
  }

  return [];
}

function normalizeText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function lower(value) {
  return normalizeText(value).toLowerCase();
}

function unique(items) {
  return Array.from(new Set(items.filter(Boolean)));
}

function firstText() {
  for (var i = 0; i < arguments.length; i += 1) {
    var value = arguments[i];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return "";
}

function collectTextItems(data, keys) {
  var items = [];

  keys.forEach(function(key) {
    asArray(data[key]).forEach(function(entry) {
      if (typeof entry === "string") {
        items.push(normalizeText(entry));
        return;
      }

      if (entry && typeof entry === "object") {
        var text = firstText(
          entry.text,
          entry.summary,
          entry.title,
          entry.label,
          entry.value,
          entry.message,
          entry.name
        );
        if (text) {
          items.push(text);
        }
      }
    });
  });

  return unique(items);
}

function buildQaCorpus(data) {
  return asArray(data.qa_pairs).map(function(pair) {
    var question = normalizeText(pair && pair.question);
    var answer = normalizeText(pair && pair.answer);
    return {
      question: question,
      answer: answer,
      combined: lower(question + " " + answer)
    };
  });
}

function findQaEntries(corpus, keywords) {
  return corpus.filter(function(entry) {
    return keywords.some(function(keyword) {
      return entry.combined.includes(keyword);
    });
  });
}

function hasPattern(text, patterns) {
  return patterns.some(function(pattern) { return pattern.test(text); });
}

function extractMatches(text, patterns) {
  var matches = [];
  patterns.forEach(function(pattern) {
    var result = text.match(pattern);
    if (result) {
      matches.push(normalizeText(result[0]));
    }
  });
  return unique(matches);
}

var CATEGORY_DEFS = [
  {
    key: "services",
    label: "Service coverage",
    critical: true,
    keywords: ["service", "services", "offering", "offerings", "product", "products", "specialties", "specialties"],
    directKeys: ["services", "service_offerings", "products", "offerings"],
    positivePatterns: [
      /\b(services include|offers|provides|specializes in|specialises in|focuses on)\b[^.]{8,}/i,
      /\b[a-z][a-z\s&/-]+,\s*[a-z][a-z\s&/-]+(?:,\s*[a-z][a-z\s&/-]+)?/i
    ],
    weakPatterns: [
      /\b(likely|appears to|seems to|may|might|possibly|probably)\b/i,
      /\bconsulting|solutions|support|not clear|unclear\b/i
    ],
    negativePatterns: [
      /\b(could not verify|unable to verify|not specified|not described|not mentioned|no clear service information)\b/i
    ]
  },
  {
    key: "location",
    label: "Location coverage",
    critical: true,
    keywords: ["location", "address", "headquarters", "head office", "where", "based", "city", "region", "country"],
    directKeys: ["location", "locations", "address", "regions_served"],
    positivePatterns: [
      /\b\d{1,5}\s+[a-z0-9.\-'\s]+(?:street|st|road|rd|avenue|ave|boulevard|blvd|drive|dr|lane|ln|way)\b/i,
      /\b(?:toronto|vancouver|montreal|calgary|ottawa|new york|san francisco|london|chicago|canada|united states|usa|uk|united kingdom|ontario|alberta|british columbia)\b/i,
      /\b(headquartered|based|located)\s+in\b[^.]{3,}/i
    ],
    weakPatterns: [
      /\b(serves|supports|works with)\s+(clients|customers)\s+(across|in)\b/i,
      /\b(north america|globally|worldwide|not clear|unclear)\b/i
    ],
    negativePatterns: [
      /\b(could not verify|unable to verify|no address|no location|not listed|not mentioned)\b/i
    ]
  },
  {
    key: "contact",
    label: "Contact coverage",
    critical: true,
    keywords: ["contact", "email", "phone", "telephone", "reach", "call", "contact us"],
    directKeys: ["contact", "contact_details", "email", "phone"],
    positivePatterns: [
      /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
      /\+?\d[\d\s().-]{7,}\d/,
      /\b(contact form|book a call|schedule a call|call us|email us)\b/i
    ],
    weakPatterns: [
      /\b(contact us|get in touch|reach out)\b/i
    ],
    negativePatterns: [
      /\b(could not verify|unable to verify|no contact information|no email|no phone|not listed|not mentioned)\b/i
    ]
  },
  {
    key: "certifications",
    label: "Certifications",
    critical: false,
    keywords: ["certification", "certifications", "certified", "accreditation", "accredited", "iso", "soc 2"],
    directKeys: ["certifications", "accreditations"],
    positivePatterns: [
      /\b(iso\s?\d{3,5}|soc\s?2|hipaa|pci[-\s]?dss|google partner|microsoft partner|hubspot partner|certified)\b/i
    ],
    weakPatterns: [
      /\b(compliant|experienced|qualified)\b/i
    ],
    negativePatterns: [
      /\b(no certifications|no certification|none found|could not verify certification|not mentioned)\b/i
    ]
  },
  {
    key: "awards",
    label: "Awards",
    critical: false,
    keywords: ["award", "awards", "recognition", "winner", "best of", "top company"],
    directKeys: ["awards", "recognition"],
    positivePatterns: [
      /\b(won|winner of|received|named)\b[^.]{0,50}\baward\b/i,
      /\b(best of|top \d+|recognized by)\b[^.]{0,50}/i
    ],
    weakPatterns: [
      /\baward-winning\b/i
    ],
    negativePatterns: [
      /\b(no awards|none found|could not verify awards|not mentioned)\b/i
    ]
  },
  {
    key: "partnerships",
    label: "Partnerships",
    critical: false,
    keywords: ["partner", "partnership", "alliance", "integration partner", "technology partner"],
    directKeys: ["partnerships", "partners"],
    positivePatterns: [
      /\b(certif(?:ied)? partner|technology partner|integration partner|official partner|strategic partner)\b/i,
      /\bofficial\s+[a-z0-9&+\-.\s]{2,40}\s+partner\b/i,
      /\bpartner(?:ship)?\s+with\b[^.]{3,}/i
    ],
    weakPatterns: [
      /\bpartner with clients\b/i,
      /\bwork closely with\b/i
    ],
    negativePatterns: [
      /\b(no partnerships|none found|could not verify partnerships|not mentioned)\b/i
    ]
  },
  {
    key: "testimonials",
    label: "Testimonials",
    critical: false,
    keywords: ["testimonial", "testimonials", "review", "reviews", "rating", "ratings", "customer quote"],
    directKeys: ["testimonials", "reviews"],
    positivePatterns: [
      /\b(testimonial|review|rated\s+\d(?:\.\d)?)\b/i,
      /["“][^"”]{15,}["”]\s*[-–]\s*[A-Z][a-z]+/i
    ],
    weakPatterns: [
      /\btrusted by|loved by\b/i
    ],
    negativePatterns: [
      /\b(no testimonials|none found|could not verify testimonials|not mentioned)\b/i
    ]
  },
  {
    key: "caseStudies",
    label: "Case studies",
    critical: false,
    keywords: ["case study", "case studies", "success story", "success stories", "results", "outcomes"],
    directKeys: ["case_studies", "caseStudies", "success_stories"],
    positivePatterns: [
      /\b(case study|success story|customer story|project highlight)\b/i,
      /\b(increased|reduced|improved|grew)\b[^.]{0,40}\b\d+%/i
    ],
    weakPatterns: [
      /\b(results-driven|proven results)\b/i
    ],
    negativePatterns: [
      /\b(no case studies|none found|could not verify case studies|not mentioned)\b/i
    ]
  }
];

function evaluateFromDirectItems(def, data) {
  var items = collectTextItems(data, def.directKeys);
  if (!items.length) {
    return null;
  }

  return {
    status: "verified",
    item: def.label + " verified from explicit source data: " + items.slice(0, 2).join("; ")
  };
}

function evaluateFromQa(def, corpus) {
  var relevantEntries = findQaEntries(corpus, def.keywords);
  if (!relevantEntries.length) {
    return null;
  }

  var verifiedItems = [];
  var hasWeak = false;
  var hasNegative = false;

  relevantEntries.forEach(function(entry) {
    if (hasPattern(entry.answer, def.negativePatterns)) {
      hasNegative = true;
      return;
    }

    if (hasPattern(entry.answer, def.positivePatterns) && !hasPattern(entry.answer, def.weakPatterns)) {
      var proofs = extractMatches(entry.answer, def.positivePatterns);
      if (proofs.length) {
        verifiedItems = verifiedItems.concat(proofs.map(function(proof) {
          return def.label + " verified: " + proof;
        }));
      } else {
        verifiedItems.push(def.label + " verified from explicit AI-cited details.");
      }
      return;
    }

    if (hasPattern(entry.answer, def.positivePatterns) || hasPattern(entry.answer, def.weakPatterns)) {
      hasWeak = true;
    }
  });

  if (verifiedItems.length) {
    return { status: "verified", item: unique(verifiedItems)[0] };
  }

  if (hasNegative) {
    return {
      status: def.critical ? "missing" : "unclear",
      item: def.label + " could not be verified from the AI response."
    };
  }

  if (hasWeak) {
    return {
      status: "unclear",
      item: def.label + " was implied, but the scan did not surface a concrete proof point."
    };
  }

  return {
    status: def.critical ? "missing" : "unclear",
    item: def.label + " was not clearly evidenced in the AI response."
  };
}

function evaluateCategory(def, data, corpus) {
  var directResult = evaluateFromDirectItems(def, data);
  if (directResult) {
    return directResult;
  }

  return evaluateFromQa(def, corpus) || {
    status: def.critical ? "missing" : "not_detected",
    item: def.label + " was not detected in the scan payload."
  };
}

function classifyLegacyFindings(findings) {
  return findings.reduce(function(groups, item) {
    var text = normalizeText(item);
    if (!text) return groups;

    var normalized = text.toLowerCase();
    if (/(missing|not detected|absent|not found|lack|without|gap)/.test(normalized)) {
      groups.missing.push(text);
    } else if (/(verified|found|clear|consistent|present|strong|accurate)/.test(normalized)) {
      groups.verified.push(text);
    } else {
      groups.unclear.push(text);
    }
    return groups;
  }, { verified: [], unclear: [], missing: [] });
}

function mergeEvidence(calibratedItems, payloadItems, fallbackItems) {
  return unique([].concat(calibratedItems, payloadItems, fallbackItems));
}

function buildRecommendation(summary) {
  var criticalMissing = summary.categories.filter(function(category) {
    return category.critical && category.status === "missing";
  }).length;
  var criticalUnclear = summary.categories.filter(function(category) {
    return category.critical && category.status === "unclear";
  }).length;
  var optionalVerified = summary.categories.filter(function(category) {
    return !category.critical && category.status === "verified";
  }).length;
  var totalGaps = summary.unclear.length + summary.missing.length;

  if (criticalMissing >= 2 || (criticalMissing >= 1 && totalGaps >= 4)) {
    return {
      bandLabel: "AI visibility: Weak evidence",
      recommendationTitle: "Recommended next fix: Rebuild the evidence base",
      recommendationText: "Critical business details are missing or weakly supported. VizAI should first establish a clearer truth source, add structured contact and location data, and then validate supporting proof points before expecting reliable AI answers.",
      nextStepsHTML:
        '<p style="color: var(--text-muted); margin-bottom: 16px; line-height: 1.6;">The scan found multiple evidence gaps in the core business profile. That makes omission, confusion, and low-confidence AI answers more likely.</p>' +
        '<p style="color: var(--text-muted); margin-bottom: 16px; line-height: 1.6;"><strong>Recommended next step from VizAI:</strong> Start with Tier 0 to identify the exact contradictions and missing proof points, then move into foundational fixes.</p>' +
        '<ul style="margin: 0 0 16px; padding-left: 20px; color: var(--text-muted); font-size: 0.9rem; line-height: 1.7;">' +
          '<li><strong>Tier 0 ($495 CAD):</strong> Human-reviewed diagnosis of conflicting, missing, and weak evidence — <a href="https://buy.stripe.com/eVqfZad4zc3SapnfhgcMM00" target="_blank" rel="noopener noreferrer" style="color: var(--accent); text-decoration: underline;">Purchase snapshot</a></li>' +
          '<li><strong>Then Tier 1 ($1,950 + $650/mo):</strong> Build canonical truth, deploy schema, and repair the evidence base — <a href="https://buy.stripe.com/9B6bIU7Kf7NC2WVc54cMM01" target="_blank" rel="noopener noreferrer" style="color: var(--accent); text-decoration: underline;">Get started</a></li>' +
        '</ul>'
    };
  }

  if (criticalMissing + criticalUnclear >= 1 || totalGaps >= 3 || optionalVerified < 2) {
    return {
      bandLabel: "AI visibility: Mixed evidence",
      recommendationTitle: "Recommended next fix: Close evidence gaps",
      recommendationText: "The scan found some usable evidence, but enough important details remain unclear that AI systems may still return incomplete or inconsistent answers. VizAI should strengthen missing proof and reduce ambiguity before relying on the current result.",
      nextStepsHTML:
        '<p style="color: var(--text-muted); margin-bottom: 16px; line-height: 1.6;">The scan found partial support, but there are still enough unclear or missing signals to limit confidence.</p>' +
        '<p style="color: var(--text-muted); margin-bottom: 16px; line-height: 1.6;"><strong>Recommended next step from VizAI:</strong> Use Tier 0 to confirm the weak spots, then ship the highest-value fixes into canonical pages and structured data.</p>' +
        '<ul style="margin: 0 0 16px; padding-left: 20px; color: var(--text-muted); font-size: 0.9rem; line-height: 1.7;">' +
          '<li><strong>Tier 0 ($495 CAD):</strong> Validate which claims are real, weak, or unsupported — <a href="https://buy.stripe.com/eVqfZad4zc3SapnfhgcMM00" target="_blank" rel="noopener noreferrer" style="color: var(--accent); text-decoration: underline;">Purchase snapshot</a></li>' +
          '<li><strong>Then Tier 1 ($1,950 + $650/mo):</strong> Add structured signals and authoritative proof to reduce ambiguity — <a href="https://buy.stripe.com/9B6bIU7Kf7NC2WVc54cMM01" target="_blank" rel="noopener noreferrer" style="color: var(--accent); text-decoration: underline;">Get started</a></li>' +
        '</ul>'
    };
  }

  return {
    bandLabel: "AI visibility: Evidence-backed",
    recommendationTitle: "Recommended next fix: Protect against drift",
    recommendationText: "The scan found explicit support for core business details and several supporting proof points. VizAI should focus on monitoring, minor hardening, and catching drift before answers regress.",
    nextStepsHTML:
      '<p style="color: var(--text-muted); margin-bottom: 16px; line-height: 1.6;">The scan found evidence-backed support for the core business profile. The main risk now is answer drift, not basic discoverability.</p>' +
      '<p style="color: var(--text-muted); margin-bottom: 16px; line-height: 1.6;"><strong>Recommended next step from VizAI:</strong> Harden canonical sources and monitor changes over time.</p>' +
      '<ul style="margin: 0; padding-left: 20px; color: var(--text-muted); font-size: 0.9rem; line-height: 1.7;">' +
        '<li><strong>Tier 1 - Foundation ($1,950 setup + $650/mo):</strong> Canonical Truth File, schema deployment, and monitoring — <a href="https://buy.stripe.com/9B6bIU7Kf7NC2WVc54cMM01" target="_blank" rel="noopener noreferrer" style="color: var(--accent); text-decoration: underline;">Get started</a></li>' +
      '</ul>'
  };
}

export function calibrateScanReport(data, metrics) {
  var corpus = buildQaCorpus(data);
  var categories = CATEGORY_DEFS.map(function(def) {
    var result = evaluateCategory(def, data, corpus);
    return {
      key: def.key,
      label: def.label,
      critical: def.critical,
      status: result.status,
      item: result.item
    };
  });

  var payloadVerified = collectTextItems(data, [
    "verified_by_ai",
    "what_ai_could_verify",
    "verified_findings",
    "verified_signals",
    "strengths"
  ]);
  var payloadUnclear = collectTextItems(data, [
    "what_ai_could_not_verify",
    "unclear_or_weakly_supported",
    "unclear_findings",
    "weak_signals"
  ]);
  var payloadMissing = collectTextItems(data, [
    "missing_signals",
    "missing_evidence",
    "evidence_gaps",
    "missing_or_not_detected",
    "not_detected",
    "gaps"
  ]);

  var legacyFindings = collectTextItems(data, ["findings", "key_findings"]);
  var classifiedLegacy = classifyLegacyFindings(legacyFindings);

  var verified = mergeEvidence(
    categories.filter(function(category) { return category.status === "verified"; }).map(function(category) { return category.item; }),
    payloadVerified,
    classifiedLegacy.verified
  );
  var unclear = mergeEvidence(
    categories.filter(function(category) { return category.status === "unclear"; }).map(function(category) { return category.item; }),
    payloadUnclear,
    classifiedLegacy.unclear
  );
  var missing = mergeEvidence(
    categories.filter(function(category) { return category.status === "missing"; }).map(function(category) { return category.item; }),
    payloadMissing,
    classifiedLegacy.missing
  );

  var criticalVerified = categories.filter(function(category) {
    return category.critical && category.status === "verified";
  }).length;
  var criticalIssues = categories.filter(function(category) {
    return category.critical && category.status !== "verified";
  }).length;
  var optionalVerified = categories.filter(function(category) {
    return !category.critical && category.status === "verified";
  }).length;

  var evidenceStrength;
  var visibilityStatus;
  var headline;
  var summary;

  if (criticalVerified === 3 && optionalVerified >= 2 && missing.length <= 1) {
    evidenceStrength = "Stronger evidence with explicit proof points";
    visibilityStatus = "Core business details are clearly evidenced";
    headline = "AI could verify the core business profile with explicit supporting proof.";
    summary = "The scan found explicit support for services, location, contact details, and several secondary proof points. The main job now is protecting against drift rather than filling basic evidence gaps.";
  } else if (criticalVerified >= 2 && criticalIssues <= 1) {
    evidenceStrength = "Mixed evidence with some important gaps";
    visibilityStatus = "Partially visible, but not fully evidenced";
    headline = "AI could verify part of the business profile, but some important claims remain weakly supported.";
    summary = "The scan surfaced usable evidence, but confidence is still limited by at least one unclear or missing core business signal and incomplete supporting proof.";
  } else {
    evidenceStrength = "Weak evidence with material gaps";
    visibilityStatus = "Low-confidence visibility";
    headline = "AI could not clearly verify enough core business details to trust the result.";
    summary = "The scan did not surface enough explicit support for core coverage. Conservative interpretation is appropriate until stronger evidence is published and rechecked.";
  }

  if (typeof data.evidence_strength === "string" && data.evidence_strength.trim()) {
    evidenceStrength = data.evidence_strength.trim();
  }

  if (typeof data.visibility_status === "string" && data.visibility_status.trim()) {
    visibilityStatus = data.visibility_status.trim();
  }

  if (typeof data.assessment_headline === "string" && data.assessment_headline.trim()) {
    headline = data.assessment_headline.trim();
  }

  if (typeof data.assessment_summary === "string" && data.assessment_summary.trim()) {
    summary = data.assessment_summary.trim();
  }

  var recommendation = buildRecommendation({
    categories: categories,
    verified: verified,
    unclear: unclear,
    missing: missing,
    overallScore: metrics && metrics.overallScore
  });

  return {
    categories: categories,
    verified: verified,
    unclear: unclear,
    missing: missing,
    evidenceStrength: evidenceStrength,
    visibilityStatus: visibilityStatus,
    headline: headline,
    summary: summary,
    bandLabel: recommendation.bandLabel,
    recommendationTitle: recommendation.recommendationTitle,
    recommendationText: recommendation.recommendationText,
    nextStepsHTML: recommendation.nextStepsHTML,
    noteTitle: data.disclaimer ? "Disclaimer" : "Scan limitations",
    noteText: firstText(
      data.disclaimer,
      data.limitations,
      data.scan_warning,
      data.warning,
      collectTextItems(data, ["warnings"]).join(" ")
    )
  };
}
