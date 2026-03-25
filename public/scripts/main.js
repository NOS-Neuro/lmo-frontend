document.addEventListener("DOMContentLoaded", () => {
  // ------------------------------------------------------------
  // Register Service Worker for offline support and caching
  // ------------------------------------------------------------
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('[SW] Service Worker registered:', registration.scope);
        })
        .catch((error) => {
          console.log('[SW] Service Worker registration failed:', error);
        });
    });
  }

  // ------------------------------------------------------------
  // Scan button routing
  // ------------------------------------------------------------
  document.querySelectorAll("[data-role='scan-button']").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const isAnchor = btn.tagName.toLowerCase() === "a";
      if (!isAnchor) e.preventDefault();
      window.location.href = "/scan";
    });
  });

  // ------------------------------------------------------------
  // Coming Soon modal
  // ------------------------------------------------------------
  document.querySelectorAll("[data-coming-soon]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      showComingSoon();
    });
  });

  // ------------------------------------------------------------
  // Scroll reveal (adds "alive" feeling as you move down page)
  // ------------------------------------------------------------
  setupScrollReveal();

  // ------------------------------------------------------------
  // Subtle orb parallax on scroll (hero feels "breathing")
  // ------------------------------------------------------------
  setupOrbParallax();

});

// -------------------------
// Simple Coming Soon modal
// -------------------------
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

// -------------------------
// Scroll reveal
// -------------------------
function setupScrollReveal() {
  // Choose elements you already have in your layout
  const targets = document.querySelectorAll(
    ".section-title, .section-subtitle, .two-column > div, .panel, .pricing-card, .why-card, .pillar-card, .step-card, .delivery-card, .cta-band, .output-shell"
  );

  if (!targets.length) return;

  targets.forEach((el) => el.classList.add("reveal"));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach((el) => io.observe(el));
}

// -------------------------
// Hero orb parallax
// -------------------------
function setupOrbParallax() {
  const orb = document.querySelector(".hero-orb");
  if (!orb) return;

  let ticking = false;

  const onScroll = () => {
    if (ticking) return;
    ticking = true;

    window.requestAnimationFrame(() => {
      const y = window.scrollY || 0;
      // small movement only
      const translate = Math.min(18, y * 0.03);
      orb.style.transform = `translateY(${translate}px)`;
      ticking = false;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

