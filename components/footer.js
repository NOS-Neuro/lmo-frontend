class CustomFooter extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          background: var(--bg-elevated);
          padding: 32px 16px 24px;
          border-top: 1px solid var(--border-subtle);
          margin-top: 64px;
        }
        .footer-container {
          max-width: var(--max-width);
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 32px;
        }
        .footer-column h3 {
          font-size: 0.95rem;
          margin-bottom: 16px;
          color: var(--text);
        }
        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .footer-links a {
          color: var(--muted);
          font-size: 0.9rem;
          transition: color 0.15s ease;
        }
        .footer-links a:hover {
          color: var(--accent-strong);
        }
        .copyright {
          max-width: var(--max-width);
          margin: 24px auto 0;
          text-align: center;
          font-size: 0.8rem;
          color: var(--muted);
        }
        @media (max-width: 768px) {
          .footer-container {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }
      </style>
      <div class="footer-container">
        <div class="footer-column">
          <h3>VizAI</h3>
          <div class="footer-links">
            <a href="index.html">Home</a>
            <a href="scan.html">Run VizAI Scan</a>
            <a href="index.html#pricing">Pricing</a>
          </div>
        </div>
        <div class="footer-column">
          <h3>Resources</h3>
          <div class="footer-links">
            <a href="#">What is LMO?</a>
            <a href="#">LMO for Agencies</a>
            <a href="#">FAQ</a>
          </div>
        </div>
        <div class="footer-column">
          <h3>Company</h3>
          <div class="footer-links">
            <a href="index.html#contact">Contact</a>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </div>
      <div class="copyright">
        © ${new Date().getFullYear()} VizAI. AI visibility diagnostics for modern businesses.
      </div>
    `;
  }
}
customElements.define("custom-footer", CustomFooter);

