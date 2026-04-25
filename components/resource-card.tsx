"use client"

import { ExternalLink, FileText, Mic, Video, TrendingUp, BookOpen, Calendar, Eye, Star, ThumbsUp, ThumbsDown, UserRound } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Resource } from "@/lib/resources-data"

interface ResourceCardProps {
  resource: Resource
  viewCount: number
  score: number
  onView: () => void
  onVote: (type: "like" | "dislike") => void
}

export function ResourceCard({ resource, viewCount, score, onView, onVote }: ResourceCardProps) {
  const formattedDate = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${resource.date}T00:00:00Z`))

  const typeLabel = {
    paper: "Paper",
    article: "Article",
    podcast: "Podcast",
    video: "Video",
    news: "News",
  }[resource.type]

  const getIcon = () => {
    switch (resource.type) {
      case "paper":
        return FileText
      case "podcast":
        return Mic
      case "video":
        return Video
      case "news":
        return TrendingUp
      default:
        return BookOpen
    }
  }

  const getTypeColor = () => {
    switch (resource.type) {
      case "paper":
        return "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300"
      case "podcast":
        return "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
      case "video":
        return "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
      case "news":
        return "bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
      default:
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
    }
  }

  const Icon = getIcon()

  return (
    <Card className="group flex h-full flex-col overflow-hidden border-border/70 bg-card/95 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg">
      <CardHeader className="border-b bg-muted/20 pb-4">
        <div className="flex items-center justify-between">
          <Badge className={`gap-1 rounded-md px-2.5 py-1 ${getTypeColor()}`}>
            <Icon className="h-4 w-4" />
            {typeLabel}
          </Badge>
          {resource.featured && <Badge className="rounded-md bg-primary text-primary-foreground">Featured</Badge>}
        </div>
        <h3 className="mt-3 text-lg font-semibold leading-snug line-clamp-2">{resource.title}</h3>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col pt-5">
        <div className="space-y-4">
          <div className="grid gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <UserRound className="h-4 w-4 text-primary" />
              <span className="font-medium text-foreground">{resource.author}</span>
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{formattedDate}</span>
            </span>
          </div>

          {resource.description && <p className="text-sm leading-6 text-muted-foreground line-clamp-4">{resource.description}</p>}
        </div>

        {resource.tags && resource.tags.length > 0 && (
          <div className="mt-auto pt-5">
            <div className="flex flex-wrap gap-1">
              {resource.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="rounded-md border-primary/25 text-xs text-foreground/80">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-wrap items-center justify-between gap-4 border-t bg-muted/10 pt-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4" /> {viewCount}
          </span>
          <span className="flex items-center gap-1">
            <Star className="h-4 w-4" /> {score}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="flex-shrink-0 border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground" onClick={() => onVote("like")}>
            <ThumbsUp className="mr-1 h-4 w-4" /> Like
          </Button>
          <Button variant="outline" size="sm" className="flex-shrink-0 border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground" onClick={() => onVote("dislike")}>
            <ThumbsDown className="mr-1 h-4 w-4" /> Dislike
          </Button>
          <Button variant="ghost" size="sm" className="flex-shrink-0 text-primary hover:text-primary" onClick={onView}>
            Source
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
