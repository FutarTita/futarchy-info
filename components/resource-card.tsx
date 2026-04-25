"use client"
import { ExternalLink, FileText, Mic, Video, TrendingUp, BookOpen, Calendar, Eye, Star, ThumbsUp, ThumbsDown } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Resource } from "@/lib/resources-data"

interface ResourceCardProps {
  resource: Resource
  viewCount: number
  score: number
  onView: () => void
  onVote: (type: 'like' | 'dislike') => void
}

export function ResourceCard({ resource, viewCount, score, onView, onVote }: ResourceCardProps) {
  const getIcon = () => {
    switch (resource.type) {
      case "paper": return FileText
      case "podcast": return Mic
      case "video": return Video
      case "news": return TrendingUp
      default: return BookOpen
    }
  }

  const getTypeColor = () => {
    switch (resource.type) {
      case "paper": return "bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
      case "podcast": return "bg-purple-50 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300"
      case "video": return "bg-red-50 text-red-700 dark:bg-red-900/50 dark:text-red-300"
      case "news": return "bg-red-50 text-red-700 dark:bg-red-900/50 dark:text-red-300" // Changed from green to red
      default: return "bg-gray-50 text-gray-700 dark:bg-gray-900/50 dark:text-gray-300"
    }
  }

  const Icon = getIcon()

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <Badge className={`gap-1 ${getTypeColor()}`}>
            <Icon className="h-4 w-4" />
            {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
          </Badge>
          {resource.featured && <Badge className="bg-red-600 text-white">Featured</Badge>}
        </div>
        <h3 className="mt-2 text-lg font-semibold line-clamp-2">{resource.title}</h3>
      </CardHeader>

      <CardContent className="flex flex-col flex-1">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium">{resource.author}</span>
            <span>•</span>
            <Calendar className="h-4 w-4" />
            <span>{resource.date}</span>
          </div>

          {resource.description && (
            <p className="text-sm text-muted-foreground line-clamp-3">{resource.description}</p>
          )}
        </div>

        {resource.tags && resource.tags.length > 0 && (
          <div className="mt-auto pt-3">
            <div className="flex flex-wrap gap-1">
              {resource.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs border-red-200 text-red-700 dark:border-red-800 dark:text-red-300">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-wrap items-center justify-between gap-4 border-t pt-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Eye className="h-4 w-4" /> {viewCount}</span>
          <span className="flex items-center gap-1"><Star className="h-4 w-4" /> {score}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white flex-shrink-0" 
            onClick={() => onVote('like')}
          >
            <ThumbsUp className="h-4 w-4 mr-1" /> Like
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white flex-shrink-0" 
            onClick={() => onVote('dislike')}
          >
            <ThumbsDown className="h-4 w-4 mr-1" /> Dislike
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 flex-shrink-0" 
            onClick={onView}
          >
            Read More
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}