import { motion } from "framer-motion"
import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface BenefitProps {
  text: string
  checked: boolean
}

const Benefit = ({ text, checked }: BenefitProps) => {
  return (
    <div className="flex items-center gap-3">
      {checked ? (
        <span className="grid size-4 place-content-center rounded-full bg-white text-sm text-zinc-900">
          <Check className="size-3" />
        </span>
      ) : (
        <span className="grid size-4 place-content-center rounded-full bg-zinc-800 text-sm text-zinc-500">
          <X className="size-3" />
        </span>
      )}
      <span className="text-sm text-zinc-300">{text}</span>
    </div>
  )
}

interface PricingCardProps {
  tier: string
  price: string
  bestFor: string
  CTA: string
  href?: string
  benefits: Array<{ text: string; checked: boolean }>
  className?: string
}

export const PricingCard = ({
  tier,
  price,
  bestFor,
  CTA,
  href,
  benefits,
  className,
}: PricingCardProps) => {
  return (
    <motion.div
      initial={{ filter: "blur(2px)" }}
      whileInView={{ filter: "blur(0px)" }}
      transition={{ duration: 0.5, ease: "easeInOut", delay: 0.25 }}
    >
      <Card
        className={cn(
          "relative h-full w-full overflow-hidden",
          "bg-gradient-to-br from-zinc-950/50 to-zinc-900/80",
          "p-6",
          className,
        )}
      >
        <div className="flex flex-col items-center pb-6">
          <span className="mb-6 inline-block text-zinc-50">
            {tier}
          </span>
          <span className="mb-3 inline-block text-4xl font-medium text-white">
            {price}
          </span>
          <span className="bg-gradient-to-br from-zinc-200 to-zinc-500 bg-clip-text text-center text-transparent text-sm">
            {bestFor}
          </span>
        </div>
        <div className="space-y-4 py-9">
          {benefits.map((benefit, index) => (
            <Benefit key={index} {...benefit} />
          ))}
        </div>
        {href ? (
          <a
            href={href}
            className={cn(
              "flex items-center justify-center w-full h-10 rounded-md text-sm font-medium transition-colors no-underline",
              tier === "Foundation"
                ? "bg-white text-zinc-900 hover:bg-zinc-200"
                : "bg-zinc-800/50 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            )}
          >
            {CTA}
          </a>
        ) : (
          <Button
            className="w-full"
            variant={tier === "Foundation" ? "default" : "ghost"}
          >
            {CTA}
          </Button>
        )}
      </Card>
    </motion.div>
  )
}
