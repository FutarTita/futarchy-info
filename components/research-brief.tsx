"use client"

import { ArrowRight, CalendarDays, Layers, Radio, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { resources } from "@/lib/resources-data"

const focusAreas = [
  {
    label: "Ownership coins",
    detail: "Legal structure, treasury controls, bid walls, and market-protected launches.",
  },
  {
    label: "Launch record",
    detail: "Avici, Umbra, Loyal, Paystream, Solomon, Ranger, P2P, Hurupay, and more.",
  },
  {
    label: "Public broadcasts",
    detail: "Ownership FM, Roadshow, X Spaces, podcasts, interviews, and market commentary.",
  },
]

const latestIcos = resources
  .filter((resource) => resource.tags?.includes("Fundraise") || resource.tags?.includes("ICO") || resource.tags?.includes("IDO"))
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 5)

export function ResearchBrief() {
  const formatDate = (date: string) =>
    new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(`${date}T00:00:00Z`))

  return (
    <section className="border-b bg-muted/30">
      <div className="container mx-auto grid gap-8 px-4 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:py-10">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
              Special investigation
            </Badge>
            <span className="text-sm text-muted-foreground">{resources.length} indexed resources</span>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">MetaDAO ecosystem map</h2>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground md:text-base">
              This library is organized as a research file: original papers, market-governance theory, ICO and ownership-coin pages,
              project launches, public broadcasts, and external analysis ordered by publication or event date.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {focusAreas.map((area) => (
              <div key={area.label} className="border-l-2 border-primary bg-background/70 px-4 py-3">
                <div className="text-sm font-semibold">{area.label}</div>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{area.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <CalendarDays className="h-4 w-4 text-primary" />
            Recent launch trail
          </div>
          <div className="divide-y rounded-sm border bg-background">
            {latestIcos.map((resource) => (
              <a
                key={resource.id}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-muted/60"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{resource.title}</div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatDate(resource.date)}</span>
                    <span className="flex items-center gap-1">
                      <Layers className="h-3 w-3" />
                      {resource.tags?.[0] ?? resource.type}
                    </span>
                    {resource.type === "podcast" && (
                      <span className="flex items-center gap-1">
                        <Radio className="h-3 w-3" />
                        audio
                      </span>
                    )}
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Dates reflect publication, broadcast, ICO start, or ICO close when a source confirms it.
          </div>
        </div>
      </div>
    </section>
  )
}
