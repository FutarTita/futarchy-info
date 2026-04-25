"use client"

import { useState } from "react"
import { LibraryHero } from "@/components/library-hero"
import { LibraryFilters } from "@/components/library-filters"
import { ResourceGrid } from "@/components/resource-grid"
import { ResearchBrief } from "@/components/research-brief"
import { Toaster } from "@/components/ui/toaster"

export default function Page() {
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("recent")
  const [timePeriod, setTimePeriod] = useState("all")
  const [search, setSearch] = useState("")

  return (
    <div className="min-h-screen bg-background">
      <LibraryHero search={search} setSearch={setSearch} />
      <ResearchBrief />
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <LibraryFilters
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
          sortBy={sortBy}
          setSortBy={setSortBy}
          timePeriod={timePeriod}
          setTimePeriod={setTimePeriod}
        />
        <ResourceGrid
          activeFilters={activeFilters}
          sortBy={sortBy}
          timePeriod={timePeriod}
          search={search}
        />
      </div>
      <Toaster />
    </div>
  )
}
