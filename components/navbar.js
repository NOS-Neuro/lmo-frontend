class CustomNavbar extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
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
        .logo {
          font-weight: 700;
          font-size: 1.2rem;
          background: linear-gradient(120deg, #7b5cff, #b39cff);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .nav-links {
          display: flex;
          gap: 24px;
        }
        .nav-links a {
          font-size: 0.9rem;
          transition: opacity 0.2s;
        }
        .nav-links a:hover {
          opacity: 0.8;
        }
        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }
        }
      </style>
      <nav>
        <a href="index.html" class="logo">LuminAI</a>
        <div class="nav-links">
          <a href="index.html">Home</a>
          <a href="scan.html">Run Scan</a>
          <a href="index.html#pricing">Pricing</a>
          <a href="index.html#contact">Contact</a>
        </div>
      </nav>
    `;
  }
}

customElements.define('custom-navbar', CustomNavbar);
