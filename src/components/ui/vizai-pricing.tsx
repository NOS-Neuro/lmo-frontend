import { PricingCard } from "@/components/ui/dark-gradient-pricing"

export function VizAIPricing() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative z-10 mx-auto max-w-5xl px-4 py-20 md:px-8">
        <div className="mb-12 space-y-3">
          <p className="text-center text-xs uppercase tracking-widest text-zinc-500 font-medium">
            Transparent Pricing
          </p>
          <h2 className="text-center text-3xl font-semibold leading-tight text-white sm:text-4xl sm:leading-tight">
            Choose Your Level of Control
          </h2>
          <p className="text-center text-base text-zinc-400 md:text-lg">
            From free awareness to comprehensive governance. All pricing in CAD.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <PricingCard
            tier="Snapshot"
            price="$495"
            bestFor="One-time AI analysis + registry entry"
            CTA="Request Snapshot"
            href="/contact"
            benefits={[
              { text: "Human-reviewed AI analysis", checked: true },
              { text: "Test ChatGPT, Claude, Perplexity", checked: true },
              { text: "Confusion flags & source analysis", checked: true },
              { text: "Written recommendations", checked: true },
              { text: "VizAI Business Registry entry", checked: true },
              { text: "Monthly monitoring", checked: false },
              { text: "Schema.org implementation", checked: false },
              { text: "Managed corrections", checked: false },
            ]}
          />
          <PricingCard
            tier="Foundation"
            price="$650/mo"
            bestFor="$1,950 setup · Fix, verify, and maintain"
            CTA="Discuss Scope"
            href="/contact"
            benefits={[
              { text: "Verified Business Profile", checked: true },
              { text: "Premium verification badge", checked: true },
              { text: "Schema.org implementation", checked: true },
              { text: "Monthly AI monitoring", checked: true },
              { text: "Drift detection alerts", checked: true },
              { text: "Canonical Truth File", checked: true },
              { text: "Additional AI surfaces", checked: false },
              { text: "Executive reporting", checked: false },
            ]}
          />
          <PricingCard
            tier="Reinforcement"
            price="$2,250/mo"
            bestFor="$3,750 setup · Strengthen your signals"
            CTA="Discuss Scope"
            href="/contact"
            benefits={[
              { text: "Everything in Foundation", checked: true },
              { text: "2-3 additional AI surfaces", checked: true },
              { text: "Bi-weekly monitoring", checked: true },
              { text: "Before/after verification", checked: true },
              { text: "Multi-platform coverage", checked: true },
              { text: "Source authority building", checked: true },
              { text: "Managed corrections", checked: false },
              { text: "Executive reporting", checked: false },
            ]}
          />
          <PricingCard
            tier="Governance"
            price="Custom"
            bestFor="Starting $4,950/mo · We manage it for you"
            CTA="Contact Us"
            href="/contact"
            benefits={[
              { text: "Everything in Reinforcement", checked: true },
              { text: "4-5 authority placements", checked: true },
              { text: "Managed corrections", checked: true },
              { text: "Executive reporting", checked: true },
              { text: "Dedicated account manager", checked: true },
              { text: "Custom monitoring cadence", checked: true },
              { text: "Competitive intelligence", checked: true },
              { text: "Quarterly strategy reviews", checked: true },
            ]}
          />
        </div>
        <div className="mt-8 flex flex-col items-center gap-4">
          <a
            href="/packages"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors no-underline bg-zinc-800/50 rounded-md px-5 py-2.5 hover:bg-zinc-800"
          >
            See Full Pricing & Comparison <span>→</span>
          </a>
          <p className="text-xs text-zinc-500">
            All pricing in CAD. USD equivalents available on request.
          </p>
        </div>
      </div>
    </section>
  )
}
