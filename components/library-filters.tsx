"use client";

import type { Dispatch, SetStateAction } from "react"
import { Filter, Calendar, BookOpen, Mic, Video, FileText, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { resources } from "@/lib/resources-data"

interface LibraryFiltersProps {
  activeFilters: string[]
  setActiveFilters: Dispatch<SetStateAction<string[]>>
  sortBy: string
  setSortBy: Dispatch<SetStateAction<string>>
  timePeriod: string
  setTimePeriod: Dispatch<SetStateAction<string>>
}

export function LibraryFilters({
  activeFilters,
  setActiveFilters,
  sortBy,
  setSortBy,
  timePeriod,
  setTimePeriod,
}: LibraryFiltersProps) {
  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) => (prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]))
  }

  const filterCategories = [
    { id: "papers", label: "Academic Papers", icon: FileText, count: resources.filter((r) => r.type === "paper").length },
    { id: "articles", label: "Articles & Analysis", icon: BookOpen, count: resources.filter((r) => r.type === "article").length },
    { id: "podcasts", label: "Podcasts", icon: Mic, count: resources.filter((r) => r.type === "podcast").length },
    { id: "videos", label: "Videos", icon: Video, count: resources.filter((r) => r.type === "video").length },
    { id: "news", label: "News Coverage", icon: TrendingUp, count: resources.filter((r) => r.type === "news").length },
  ]

  return (
    <div className="mb-8 space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Filter Resources</h2>
          {activeFilters.length > 0 && (
            <Badge variant="secondary" className="ml-2 bg-red-900/30 text-black dark:text-red-300">
              {activeFilters.length} active
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="relevant">Most Relevant</SelectItem>
            </SelectContent>
          </Select>

          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="2026">2026</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="foundation">1999-2013</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {filterCategories.map((category) => {
          const Icon = category.icon
          const isActive = activeFilters.includes(category.id)

          return (
            <Button key={category.id} variant={isActive ? "default" : "outline"} className="gap-2" onClick={() => toggleFilter(category.id)}>
              <Icon className="h-4 w-4" />
              {category.label}
              <Badge variant="secondary" className="bg-red-900/30 text-black dark:text-red-300">
                {category.count}
              </Badge>
            </Button>
          )
        })}
      </div>

      {activeFilters.length > 0 && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {activeFilters.map((filter) => (
            <Badge key={filter} variant="secondary" className="cursor-pointer bg-red-900/30 text-black dark:text-red-300" onClick={() => toggleFilter(filter)}>
              {filterCategories.find((c) => c.id === filter)?.label} ×
            </Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={() => setActiveFilters([])}>
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
}
