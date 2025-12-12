document.addEventListener("DOMContentLoaded", () => {
  // Make any element with data-role="scan-button" go to scan page
  document.querySelectorAll("[data-role='scan-button']").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      // allow plain <a href="scan.html"> links to work without double navigation
      const isAnchor = btn.tagName.toLowerCase() === "a";
      if (!isAnchor) e.preventDefault();
      window.location.href = "scan.html";
    });
  });

  const form = document.getElementById("scanForm");
  if (form) {
    const submitBtn = document.getElementById("scanSubmit");
    const submitLabel = document.getElementById("scanSubmitLabel");
    const resultsContainer = document.getElementById("resultsContainer");
    const resultsContent = document.getElementById("scanResultsContent");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const businessName = document.getElementById("businessName")?.value.trim();
      const website = document.getElementById("website")?.value.trim();

      // Optional: only works if you add <input id="contactEmail" ...> in scan.html
      const contactEmailEl = document.getElementById("contactEmail");
      const contactEmail = contactEmailEl ? contactEmailEl.value.trim() : null;

      if (!businessName || !website) return;

      submitBtn.disabled = true;
      submitBtn.classList.add("opacity-70", "cursor-wait");
      submitLabel.textContent = "Running real AI audit… (10–30s)";

      // Show a "working" panel immediately
      resultsContainer.classList.remove("hidden");
      resultsContent.innerHTML = `
        <div class="p-4 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-700">
          <div class="font-medium text-slate-900 mb-1">Scan in progress</div>
          <div>We’re checking your website’s structured data and public sources that AI systems rely on.</div>
        </div>
      `;

      try {
        const response = await fetch("https://lmo-backend.onrender.com/run_scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            businessName,
            website,
            models: [], // kept for backend compatibility; no longer implying multi-model
            contactEmail: contactEmail || null,
          }),
        });

        if (!response.ok) {
          const txt = await response.text().catch(() => "");
          throw new Error(`API error: ${response.status} ${txt}`);
        }

        const data = await response.json();

        const findingsList = (data.findings || [])
          .map((f) => `<li class="mb-1">${f}</li>`)
          .join("");

        resultsContent.innerHTML = `
          <div class="grid gap-4 md:grid-cols-3">
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div class="text-xs uppercase tracking-wide text-slate-500 mb-1">Discovery</div>
              <div class="text-3xl font-semibold text-slate-900">${data.discovery_score}</div>
              <p class="mt-1 text-xs text-slate-500">How reliably AI systems can find and identify your brand using public sources.</p>
            </div>
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div class="text-xs uppercase tracking-wide text-slate-500 mb-1">Accuracy</div>
              <div class="text-3xl font-semibold text-slate-900">${data.accuracy_score}</div>
              <p class="mt-1 text-xs text-slate-500">How machine-readable and well-structured your website is (schema, About page, metadata).</p>
            </div>
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div class="text-xs uppercase tracking-wide text-slate-500 mb-1">Authority</div>
              <div class="text-3xl font-semibold text-slate-900">${data.authority_score}</div>
              <p class="mt-1 text-xs text-slate-500">Whether trusted external sources exist that AI is likely to cite.</p>
            </div>
          </div>

          <div class="border-t border-slate-200 pt-4 mt-4">
            <h3 class="text-sm font-semibold text-slate-900 mb-2">Key findings</h3>
            <ul class="list-disc pl-5 text-sm text-slate-700">
              ${findingsList || "<li>No findings returned.</li>"}
            </ul>
          </div>

          <div class="border-t border-slate-200 pt-4 mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <p class="text-xs text-slate-500">
              This scan is generated from real signals: your website’s structured data + publicly available sources commonly used by AI systems.
              For deeper improvements, VizAI includes a Truth File, schema deployment, and ecosystem seeding to reduce hallucinations.
            </p>
            <a href="index.html#pricing"
               class="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800">
              View VizAI plans
            </a>
          </div>
        `;
      } catch (err) {
        console.error(err);
        resultsContainer.classList.remove("hidden");
        resultsContent.innerHTML = `
          <div class="p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-800">
            Something went wrong while running your VizAI Scan. Please try again in a moment.
          </div>
        `;
      } finally {
        submitBtn.disabled = false;
        submitBtn.classList.remove("opacity-70", "cursor-wait");
        submitLabel.textContent = "Run VizAI Scan";
      }
    });
  }
});

// Simple Coming Soon modal
function showComingSoon() {
  const box = document.createElement("div");
  box.innerHTML = `
    <div style="
      position: fixed; inset: 0; background: rgba(0,0,0,0.55);
      display: flex; align-items: center; justify-content: center;
      z-index: 99999;
    ">
      <div style="
        background: #fff; color: #111; border-radius: 12px;
        padding: 24px 28px; max-width: 340px; text-align: center;
        box-shadow: 0 12px 28px rgba(0,0,0,0.25);
        font-family: system-ui, sans-serif;
      ">
        <h3 style="font-size: 1.1rem; margin-bottom: 8px; font-weight: 600;">
          Coming Soon
        </h3>
        <p style="font-size: 0.9rem; margin-bottom: 16px;">
          This VizAI page is being built and will be available shortly.
        </p>
        <button id="cs-close" style="
          padding: 8px 16px; border-radius: 6px; border: none;
          background: #111; color: #fff; cursor: pointer;
        ">OK</button>
      </div>
    </div>
  `;
  document.body.appendChild(box);
  box.querySelector("#cs-close").onclick = () => box.remove();
}

// Attach to placeholder links
document.querySelectorAll("[data-coming-soon]").forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    showComingSoon();
  });
});
