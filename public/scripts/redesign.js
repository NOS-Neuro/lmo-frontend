const servicePlans = [
  {
    key: "check",
    kicker: "Discover",
    name: "Free AI Representation Check",
    price: "$0",
    cadence: "",
    description: "An automated, directional first look at how clearly your business can be found and represented.",
    features: ["Three high-level indicators", "One or two key findings", "Result delivered by email"],
    cta: "Run the free check",
    href: "/scan"
  },
  {
    key: "snapshot",
    kicker: "Validate",
    name: "Human-Reviewed Snapshot",
    price: "$495 CAD",
    cadence: "once",
    description: "A human-reviewed diagnosis of identity, accuracy, confusion, and source readiness.",
    features: ["Selected AI-system testing", "Source and confusion analysis", "$495 build credit for 30 days"],
    cta: "Request a snapshot",
    href: "/contact"
  },
  {
    key: "build",
    kicker: "Establish",
    name: "Infrastructure Build",
    price: "From $1,950 CAD",
    cadence: "once",
    description: "A verified, structured source of truth for one brand, domain, market, and language.",
    features: ["Canonical profile and JSON record", "Structured data and provenance map", "Baseline monitoring and portal setup"],
    cta: "Discuss a build",
    href: "/contact",
    featured: true
  },
  {
    key: "maintenance",
    kicker: "Maintain",
    name: "Infrastructure Maintenance",
    price: "From $650 CAD",
    cadence: "/month",
    description: "Ongoing validation, fact changes, monitoring, alerts, and maintenance of your Truth Profile.",
    features: ["Weekly technical validation", "Monthly monitoring and summary", "Quarterly review; 3-month initial term"],
    cta: "See maintenance fit",
    href: "/contact",
    dark: true
  },
  {
    key: "managed",
    kicker: "Improve",
    name: "Managed Improvement",
    price: "From $2,250 CAD",
    cadence: "/month",
    description: "A higher-touch program for broader coverage, source gaps, competitors, and implementation work.",
    features: ["Bi-weekly monitoring", "Source-gap and competitor analysis", "Up to two implementation tasks"],
    cta: "Check availability",
    href: "/contact"
  },
  {
    key: "custom",
    kicker: "Scale",
    name: "Custom",
    price: "Custom",
    cadence: "",
    description: "For multi-brand, large-catalog, multilingual, data-feed, or complex workflow requirements.",
    features: ["Multiple brands and markets", "Large product catalogs", "Data-feed integrations"],
    cta: "Talk to VizAI",
    href: "/contact"
  }
];

function serviceCard(plan) {
  const classes = ["service-card", plan.featured ? "featured" : "", plan.dark ? "dark" : ""].filter(Boolean).join(" ");
  const buttonClass = plan.dark ? "button" : "button-secondary";
  return `
    <article class="${classes}">
      <div class="plan-kicker">${plan.kicker}</div>
      <h3>${plan.name}</h3>
      <div class="plan-price">${plan.price} ${plan.cadence ? `<small>${plan.cadence}</small>` : ""}</div>
      <p class="plan-description">${plan.description}</p>
      <ul class="feature-list">${plan.features.map((feature) => `<li>${feature}</li>`).join("")}</ul>
      <a class="${buttonClass}" href="${plan.href}">${plan.cta}</a>
    </article>`;
}

document.querySelectorAll("[data-service-grid]").forEach((grid) => {
  const keys = grid.dataset.serviceGrid ? grid.dataset.serviceGrid.split(",") : servicePlans.map((plan) => plan.key);
  grid.innerHTML = servicePlans.filter((plan) => keys.includes(plan.key)).map(serviceCard).join("");
});

const menuToggle = document.querySelector("[data-menu-toggle]");
const primaryNav = document.querySelector("[data-primary-nav]");

if (menuToggle && primaryNav) {
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    primaryNav.classList.toggle("open", !expanded);
  });

  primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      primaryNav.classList.remove("open");
    });
  });
}

document.querySelectorAll("[data-scan-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const button = form.querySelector("[data-scan-button]");
    const status = form.querySelector("[data-scan-status]");
    if (button) button.textContent = "Preview ready";
    if (status) status.textContent = "Mockup interaction only—no information was submitted.";
  });
});

const customerPortalTabs = Array.from(document.querySelectorAll("[data-customer-view]"));
const customerPortalPages = Array.from(document.querySelectorAll("[data-customer-page]"));

function activateCustomerPortalTab(nextTab, moveFocus = false) {
  const selectedPage = nextTab.dataset.customerView;

  customerPortalTabs.forEach((tab) => {
    const isSelected = tab === nextTab;
    tab.classList.toggle("active", isSelected);
    tab.setAttribute("aria-selected", String(isSelected));
    tab.tabIndex = isSelected ? 0 : -1;
  });

  customerPortalPages.forEach((page) => {
    page.hidden = page.dataset.customerPage !== selectedPage;
  });

  if (moveFocus) nextTab.focus();
}

customerPortalTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => activateCustomerPortalTab(tab));
  tab.addEventListener("keydown", (event) => {
    let nextIndex = null;

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      nextIndex = (index + 1) % customerPortalTabs.length;
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      nextIndex = (index - 1 + customerPortalTabs.length) % customerPortalTabs.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = customerPortalTabs.length - 1;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      activateCustomerPortalTab(customerPortalTabs[nextIndex], true);
    }
  });
});

const registrySearchForm = document.querySelector("[data-registry-search]");

if (registrySearchForm) {
  const registryQueryInput = registrySearchForm.querySelector("[data-registry-query]");
  const registryRecords = Array.from(document.querySelectorAll("[data-registry-record]"));
  const registryStatus = document.querySelector("[data-registry-status]");
  const registryEmptyState = document.querySelector("[data-registry-empty]");

  const filterRegistryRecords = () => {
    const query = registryQueryInput.value.trim().toLowerCase();
    const terms = query.split(/\s+/).filter(Boolean);
    let visibleCount = 0;

    registryRecords.forEach((record) => {
      const searchableText = (record.dataset.search || record.textContent).toLowerCase();
      const isMatch = terms.every((term) => searchableText.includes(term));
      record.hidden = !isMatch;
      if (isMatch) visibleCount += 1;
    });

    registryEmptyState.hidden = visibleCount !== 0;

    if (!query) {
      registryStatus.textContent = `Showing all ${registryRecords.length} illustrative records.`;
    } else {
      const label = visibleCount === 1 ? "record" : "records";
      registryStatus.textContent = `Showing ${visibleCount} illustrative ${label} for “${registryQueryInput.value.trim()}”.`;
    }
  };

  registrySearchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    filterRegistryRecords();
  });

  registryQueryInput.addEventListener("input", filterRegistryRecords);
  registryQueryInput.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && registryQueryInput.value) {
      registryQueryInput.value = "";
      filterRegistryRecords();
    }
  });
}
