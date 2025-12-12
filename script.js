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

  // Attach to placeholder links
  document.querySelectorAll("[data-coming-soon]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      showComingSoon();
    });
  });
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

