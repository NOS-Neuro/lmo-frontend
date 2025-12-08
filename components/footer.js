class CustomFooter extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          background: var(--bg-elevated);
          padding: 32px 16px;
          border-top: 1px solid var(--border-subtle);
          margin-top: 64px;
        }
        .footer-container {
          max-width: var(--max-width);
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }
        .footer-column h3 {
          font-size: 1rem;
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
          transition: color 0.2s;
        }
        .footer-links a:hover {
          color: var(--accent-strong);
        }
        .copyright {
          text-align: center;
          margin-top: 32px;
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
          <h3>Resources</h3>
          <div class="footer-links">
            <a href="what-is-lmo.html">What is LMO?</a>
            <a href="agencies.html">VizAI for Agencies</a>
            <a href="faq.html">FAQ</a>
          </div>
        </div>
        <div class="footer-column">
          <h3>Company</h3>
          <div class="footer-links">
            <a href="contact.html">Contact</a>
            <a href="privacy.html">Privacy</a>
            <a href="terms.html">Terms</a>
          </div>
        </div>
        <div class="footer-column">
          <h3>VizAI</h3>
          <div class="footer-links">
            <a href="index.html">Home</a>
            <a href="scan.html">VizAI Scan</a>
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


