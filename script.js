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

      const businessName = document.getElementById("businessName").value.trim();
      const website = document.getElementById("website").value.trim();
      const models = Array.from(
        form.querySelectorAll("input[name='models']:checked")
      ).map((c) => c.value);

      if (!businessName || !website) return;

      submitBtn.disabled = true;
      submitBtn.classList.add("opacity-70", "cursor-wait");
      submitLabel.textContent = "Scanning with VizAI…";

      try {
        const response = await fetch(
          "https://lmo-backend.onrender.com/run_scan",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              businessName,
              website,
              models,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        // Show results panel
        resultsContainer.classList.remove("hidden");

        const findingsList = (data.findings || [])
          .map((f) => `<li class="mb-1">${f}</li>`)
          .join("");

        resultsContent.innerHTML = `
          <div class="grid gap-4 md:grid-cols-3">
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div class="text-xs uppercase tracking-wide text-slate-500 mb-1">Discovery</div>
              <div class="text-3xl font-semibold text-slate-900">${data.discovery_score}</div>
              <p class="mt-1 text-xs text-slate-500">How reliably AI can find and recognize your brand.</p>
            </div>
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div class="text-xs uppercase tracking-wide text-slate-500 mb-1">Accuracy</div>
              <div class="text-3xl font-semibold text-slate-900">${data.accuracy_score}</div>
              <p class="mt-1 text-xs text-slate-500">How closely AI’s description matches how you’d describe yourself.</p>
            </div>
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div class="text-xs uppercase tracking-wide text-slate-500 mb-1">Authority</div>
              <div class="text-3xl font-semibold text-slate-900">${data.authority_score}</div>
              <p class="mt-1 text-xs text-slate-500">How strongly models prefer your info over other sources.</p>
            </div>
          </div>

          <div class="border-t border-slate-200 pt-4 mt-4">
            <h3 class="text-sm font-semibold text-slate-900 mb-2">Key findings</h3>
            <ul class="list-disc pl-5 text-sm text-slate-700">
              ${findingsList}
            </ul>
          </div>

          <div class="border-t border-slate-200 pt-4 mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <p class="text-xs text-slate-500">
              These scores are an AI-assisted estimate based on your business name and domain. The full VizAI service includes
              a deeper, multi-model audit plus an LMO Truth File and ecosystem seeding.
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

