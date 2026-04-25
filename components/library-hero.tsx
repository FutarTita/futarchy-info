"use client";

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ModeToggle } from "@/components/mode-toggle"
import { Badge } from "@/components/ui/badge"
import { resources } from "@/lib/resources-data"
import Image from "next/image"

interface LibraryHeroProps {
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
}

export function LibraryHero({ search, setSearch }: LibraryHeroProps) {
  const totalResources = resources.length
  const projectCount = resources.filter((resource) =>
    resource.tags?.some((tag) => ["Project Page", "Fundraise", "ICO", "IDO"].includes(tag)),
  ).length
  const mediaCount = resources.filter((resource) => ["podcast", "video", "news"].includes(resource.type)).length

  return (
    <section className="relative overflow-hidden border-b bg-background">
      <div className="absolute inset-0">
        <Image
          src="https://pbs.twimg.com/profile_banners/1635493703996395521/1711436799/1500x500"
          alt="MetaDAO visual identity"
          fill
          className="object-cover opacity-35"
          priority
        />
        <div className="absolute inset-0 bg-background/80" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-16 lg:py-24">
        <div className="absolute right-4 top-4">
          <ModeToggle />
        </div>

        <div className="mx-auto max-w-5xl space-y-8">
          <Badge variant="outline" className="border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <span className="relative mr-2 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Research library
          </Badge>

          <h1 className="max-w-4xl text-5xl font-bold tracking-tight lg:text-6xl">
            Futarchy and ownership coin archive
          </h1>

          <p className="max-w-3xl text-lg leading-8 text-muted-foreground lg:text-xl">
            Chronological sources on prediction markets, MetaDAO projects, ownership coins, media appearances,
            radio sessions, and the people building the ecosystem. Dates are publication, broadcast, or ICO dates.
          </p>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="border-l-2 border-primary bg-card/70 p-4">
              <p className="text-3xl font-semibold">{totalResources}</p>
              <p className="text-sm text-muted-foreground">curated sources</p>
            </div>
            <div className="border-l-2 border-primary bg-card/70 p-4">
              <p className="text-3xl font-semibold">{projectCount}</p>
              <p className="text-sm text-muted-foreground">project and ICO entries</p>
            </div>
            <div className="border-l-2 border-primary bg-card/70 p-4">
              <p className="text-3xl font-semibold">{mediaCount}</p>
              <p className="text-sm text-muted-foreground">media items</p>
            </div>
          </div>

          <div className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search projects, people, media, ICOs..."
                className="h-12 rounded-md bg-card/95 pl-12 pr-4 text-base shadow-md focus-visible:ring-2 focus-visible:ring-primary"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
