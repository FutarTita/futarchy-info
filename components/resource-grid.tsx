"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { ResourceCard } from "@/components/resource-card"
import { resources } from "@/lib/resources-data"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

interface ResourceGridProps {
  activeFilters: string[]
  sortBy: string
  timePeriod: string
  search: string
}

interface Counts {
  views: { [id: string]: number }
  scores: { [id: string]: number }
}

export function ResourceGrid({ activeFilters, sortBy, timePeriod, search }: ResourceGridProps) {
  const { toast } = useToast()
  const [visibleCount, setVisibleCount] = useState(12)
  const [loading, setLoading] = useState(false)
  const [counts, setCounts] = useState<Counts>({ views: {}, scores: {} })
  const [countsLoading, setCountsLoading] = useState(true)
  const [voteModalOpen, setVoteModalOpen] = useState(false)
  const [voteMessage, setVoteMessage] = useState("")
  const [nextVoteDate, setNextVoteDate] = useState("")

  useEffect(() => {
    const fetchCounts = async () => {
      setCountsLoading(true)
      try {
        const res = await fetch('/api/counts')
        if (!res.ok) throw new Error('Failed to fetch counts')
        const data = await res.json()
        setCounts(data)
      } catch (err) {
        console.error(err)
        const defaultCounts: Counts = { views: {}, scores: {} }
        resources.forEach(r => {
          defaultCounts.views[r.id] = 0
          defaultCounts.scores[r.id] = 0
        })
        setCounts(defaultCounts)
      } finally {
        setCountsLoading(false)
      }
    }
    fetchCounts()
  }, [])

  const filteredResources = useMemo(() => {
    let filtered = [...resources]

    if (search.toLowerCase() === "metadao icos") {
      const projects = ["omnipair", "umbra", "avici", "loyal", "paystream", "zklsol", "turbine cash", "solomon", "ranger"]
      filtered = filtered.filter((r) =>
        r.tags?.some((tag) => projects.includes(tag.toLowerCase())) ?? false
      )
    } else if (search) {
      const lowerSearch = search.toLowerCase()
      filtered = filtered.filter((r) =>
        r.title.toLowerCase().includes(lowerSearch) ||
        r.author.toLowerCase().includes(lowerSearch) ||
        (r.description?.toLowerCase().includes(lowerSearch)) ||
        (r.tags?.some((tag) => tag.toLowerCase().includes(lowerSearch)) ?? false)
      )
    }

    if (activeFilters.length > 0) {
      const typeMap: Record<string, string> = {
        papers: "paper",
        articles: "article",
        podcasts: "podcast",
        videos: "video",
        news: "news",
      }
      const selectedTypes = activeFilters.map((f) => typeMap[f])
      filtered = filtered.filter((r) => selectedTypes.includes(r.type))
    }

    if (timePeriod !== "all") {
      if (timePeriod === "foundation") {
        filtered = filtered.filter((r) => {
          const year = new Date(r.date).getFullYear()
          return year >= 1999 && year <= 2013
        })
      } else {
        filtered = filtered.filter((r) => new Date(r.date).getFullYear().toString() === timePeriod)
      }
    }

    filtered.sort((a, b) => {
      if (sortBy === "recent") return new Date(b.date).getTime() - new Date(a.date).getTime()
      if (sortBy === "oldest") return new Date(a.date).getTime() - new Date(b.date).getTime()
      if (sortBy === "popular") return (counts.scores[b.id] || 0) - (counts.scores[a.id] || 0)
      if (sortBy === "relevant") return (counts.views[b.id] || 0) - (counts.views[a.id] || 0)
      return 0
    })

    return filtered
  }, [activeFilters, sortBy, timePeriod, search, counts])

  useEffect(() => {
    setVisibleCount(12)
  }, [activeFilters, timePeriod, search, sortBy])

  const loadMore = () => {
    if (loading || visibleCount >= filteredResources.length) return
    setLoading(true)
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + 12, filteredResources.length))
      setLoading(false)
    }, 500)
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      const docHeight = document.documentElement.scrollHeight
      if (windowHeight + scrollY >= docHeight - 300 && !loading && visibleCount < filteredResources.length) {
        loadMore()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loading, visibleCount, filteredResources.length])

  useEffect(() => {
    const timer = setTimeout(() => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      const docHeight = document.documentElement.scrollHeight
      if (windowHeight + scrollY >= docHeight - 300 && !loading && visibleCount < filteredResources.length) {
        loadMore()
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [filteredResources, visibleCount, loading, countsLoading])

  const handleView = async (id: string) => {
    try {
      const res = await fetch('/api/view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (res.ok) setCounts(prev => ({ ...prev, views: { ...prev.views, [id]: (prev.views[id] || 0) + 1 } }))
    } catch (err) {
      console.error(err)
    }
  }

  const handleVote = async (id: string, type: 'like' | 'dislike') => {
    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, type }),
      })
      const data = await res.json()
      if (!res.ok) {
        setVoteMessage(data.error)
        setNextVoteDate(data.nextVoteDate || '')
        setVoteModalOpen(true)
        return
      }

      setCounts(prev => ({ ...prev, scores: { ...prev.scores, [id]: data.newScore } }))
      setVoteMessage(`Your ${type} has been recorded.`)
      setNextVoteDate(data.nextVoteDate)
      setVoteModalOpen(true)
    } catch (err) {
      console.error(err)
      setVoteMessage('Vote failed')
      setVoteModalOpen(true)
    }
  }

  if (countsLoading) return <div className="text-center py-8">Loading resources...</div>

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredResources.slice(0, visibleCount).map((resource) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            viewCount={counts.views[resource.id] || 0}
            score={counts.scores[resource.id] || 0}
            onView={() => {
              handleView(resource.id)
              window.open(resource.url, '_blank', 'noopener,noreferrer')
            }}
            onVote={(type) => handleVote(resource.id, type)}
          />
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}

      {visibleCount >= filteredResources.length && filteredResources.length > 0 && (
        <p className="text-center text-muted-foreground py-8">
          You've reached the end of the library. {filteredResources.length} resources total.
        </p>
      )}

      {filteredResources.length === 0 && (
        <p className="text-center text-muted-foreground py-8">No resources found matching your criteria.</p>
      )}

      <Dialog open={voteModalOpen} onOpenChange={setVoteModalOpen}>
        <DialogContent className="animate-bounce">
          <DialogHeader>
            <DialogTitle>Vote Information</DialogTitle>
            <DialogDescription>
              {voteMessage}
              {nextVoteDate && ` You can vote again on ${nextVoteDate}.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setVoteModalOpen(false)}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}