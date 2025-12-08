class CustomNavbar extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(5, 6, 10, 0.9);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--border-subtle);
        }
        nav {
          max-width: var(--max-width);
          margin: 0 auto;
          padding: 0 16px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .logo-mark {
          width: 26px;
          height: 26px;
          border-radius: 999px;
          background: radial-gradient(circle at 30% 20%, #fff, #b39cff 30%, #7b5cff 70%, #05060a 100%);
          box-shadow: 0 0 24px rgba(123, 92, 255, 0.55);
        }
        .logo-text {
          font-weight: 700;
          font-size: 1.1rem;
          letter-spacing: 0.03em;
          background: linear-gradient(120deg, #7b5cff, #b39cff);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .nav-links {
          display: flex;
          gap: 22px;
        }
        .nav-links a {
          font-size: 0.9rem;
          color: var(--muted);
          transition: color 0.15s ease, opacity 0.15s ease;
        }
        .nav-links a:hover {
          color: var(--text);
          opacity: 0.9;
        }
        .cta {
          padding: 7px 14px;
          border-radius: 999px;
          border: 1px solid rgba(179, 156, 255, 0.4);
          color: #fff;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .cta span.icon {
          font-size: 0.9rem;
        }
        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }
        }
      </style>
      <nav>
        <a href="index.html" class="brand">
          <div class="logo-mark"></div>
          <div class="logo-text">VizAI</div>
        </a>
        <div class="nav-links">
          <a href="index.html">Home</a>
          <a href="scan.html">Run VizAI Scan</a>
          <a href="index.html#pricing">Pricing</a>
          <a href="index.html#contact">Contact</a>
          <a href="scan.html" class="cta">
            <span>Run Scan</span>
            <span class="icon">↗</span>
          </a>
        </div>
      </nav>
    `;
  }
}
customElements.define("custom-navbar", CustomNavbar);

