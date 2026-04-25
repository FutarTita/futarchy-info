"use client";

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ModeToggle } from "@/components/mode-toggle"
import { Badge } from "@/components/ui/badge"
import Image from 'next/image'

interface LibraryHeroProps {
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
}

export function LibraryHero({ search, setSearch }: LibraryHeroProps) {
  return (
    <section className="relative overflow-hidden border-b min-h-[400px] bg-gradient-to-b from-background to-muted/50">
      {/* Background Image with improved opacity and overlay */}
      <div className="absolute inset-0">
        <Image
          src="https://pbs.twimg.com/profile_banners/1635493703996395521/1711436799/1500x500"
          alt="Abstract tunnel visualization"
          fill
          className="object-cover opacity-30 filter brightness-75"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background/40" />
      </div>

      <div className="container relative mx-auto px-4 py-20 lg:py-32 z-10">
        <div className="absolute top-4 right-4">
          <ModeToggle />
        </div>
        <div className="mx-auto max-w-4xl text-center space-y-8">
          <Badge variant="outline" className="border-red-600/30 bg-red-600/10 text-red-400 px-4 py-1.5 text-sm font-medium">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
            </span>
            Research Digital Library
          </Badge>

          <h1 className="text-5xl font-bold tracking-tight lg:text-6xl">
            Futarchy Knowledge Center
          </h1>

          <p className="text-lg text-muted-foreground lg:text-xl max-w-3xl mx-auto">
            A comprehensive collection of research, analysis, and insights on prediction markets, futarchy governance,
            and the MetaDAO ecosystem—from foundational papers to cutting-edge developments.
          </p>

          <div className="mx-auto max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search papers, articles, podcasts..."
                className="h-12 rounded-full pl-12 pr-4 text-base shadow-md focus-visible:ring-2 focus-visible:ring-red-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}