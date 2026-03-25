'use client'
import { SplineScene } from "@/components/ui/splite"
import { Card } from "@/components/ui/card"
import { Spotlight } from "@/components/ui/spotlight"
import { motion } from "framer-motion"

export function HeroSpline() {
  return (
    <Card className="w-full h-[500px] bg-black/[0.96] relative overflow-hidden rounded-xl">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />

      <div className="flex h-full">
        {/* Left content */}
        <div className="flex-1 p-8 md:p-12 relative z-10 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1
              className="text-6xl md:text-7xl font-black tracking-tighter leading-none select-none"
              style={{
                color: '#e4e4e7',
                textShadow:
                  '0 0 0 rgba(255,255,255,0.1), ' +
                  '0 1px 0 #52525b, ' +
                  '0 2px 0 #3f3f46, ' +
                  '0 3px 0 #27272a, ' +
                  '0 4px 0 #18181b, ' +
                  '0 5px 10px rgba(0,0,0,0.4), ' +
                  '0 8px 20px rgba(0,0,0,0.3)',
                transform: 'perspective(500px) rotateX(2deg)',
              }}
            >
              VizAI
            </h1>
          </motion.div>

          <p className="mt-2 text-sm font-medium tracking-widest uppercase text-zinc-500">
            AI Visibility Governance
          </p>

          <p className="mt-5 text-neutral-300 max-w-lg text-base leading-relaxed">
            40% of customers ask ChatGPT or Claude about companies before visiting their website.
            If AI gets your story wrong, you lose deals you never knew existed.
          </p>
          <div className="flex gap-3 mt-8 flex-wrap">
            <a
              href="/scan"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-white text-black text-sm font-semibold hover:bg-neutral-200 transition-colors no-underline"
            >
              Run Free Scan <span>→</span>
            </a>
            <a
              href="/packages"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-zinc-700 text-neutral-300 text-sm font-medium hover:border-zinc-500 hover:text-white transition-colors no-underline"
            >
              View Pricing <span>→</span>
            </a>
          </div>
          <p className="mt-4 text-xs text-neutral-500">
            Free scan gives you directional scores. Comprehensive analysis starts at $495 CAD.
          </p>
        </div>

        {/* Right content - 3D Scene */}
        <div className="flex-1 relative hidden md:block">
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>
    </Card>
  )
}
