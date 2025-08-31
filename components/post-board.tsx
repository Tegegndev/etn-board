"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Clock, User, Pin, TrendingUp, Crown } from "lucide-react"

interface Post {
  id: number
  title: string
  content: string
  link?: string
  author?: string
  timestamp: Date
  isPinned?: boolean
  amount?: number
  txHash?: string
  pinExpiry?: Date
}

interface PostBoardProps {
  posts: Post[]
}

export function PostBoard({ posts }: PostBoardProps) {
  const [displayedPosts, setDisplayedPosts] = useState<Post[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const observerRef = useRef<HTMLDivElement>(null)
  const POSTS_PER_LOAD = 10

  const loadMorePosts = () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)

    // Simulate loading delay
    setTimeout(() => {
      const currentLength = displayedPosts.length
      const nextPosts = posts.slice(currentLength, currentLength + POSTS_PER_LOAD)

      setDisplayedPosts((prev) => [...prev, ...nextPosts])
      setHasMore(currentLength + nextPosts.length < posts.length)
      setIsLoading(false)
    }, 500)
  }

  useEffect(() => {
    const initialPosts = posts.slice(0, POSTS_PER_LOAD)
    setDisplayedPosts(initialPosts)
    setHasMore(initialPosts.length < posts.length)
  }, [posts])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMorePosts()
        }
      },
      { threshold: 0.1 },
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => observer.disconnect()
  }, [hasMore, isLoading, displayedPosts.length])

  const isCurrentlyPinned = (post: Post) => {
    if (!post.isPinned || !post.pinExpiry) return false
    return post.pinExpiry > new Date()
  }

  const getTimeRemaining = (pinExpiry: Date) => {
    const now = new Date()
    const diff = pinExpiry.getTime() - now.getTime()

    if (diff <= 0) return "Expired"

    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(minutes / 60)

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m left`
    }
    return `${minutes}m left`
  }

  const getPostRank = (post: Post) => {
    if (!post.amount) return null
    const sortedByAmount = posts.filter((p) => p.amount).sort((a, b) => (b.amount || 0) - (a.amount || 0))
    const rank = sortedByAmount.findIndex((p) => p.id === post.id) + 1
    return rank <= 3 ? rank : null
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground text-lg mb-2">No posts yet</div>
        <div className="text-sm text-muted-foreground">Be the first to create a post!</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-foreground">Posts</h2>
        <div className="text-sm text-muted-foreground">{posts.length} total posts</div>
      </div>

      {displayedPosts.map((post) => {
        const currentlyPinned = isCurrentlyPinned(post)
        const rank = getPostRank(post)

        return (
          <Card
            key={post.id}
            className={`border-border transition-all duration-300 hover-scale slide-up ${
              currentlyPinned
                ? "bg-accent/5 border-accent/30 shadow-lg glow-accent float"
                : rank === 1
                  ? "bg-yellow-500/5 border-yellow-500/30 glow-accent"
                  : "bg-card hover:bg-card/80 hover:glow-green"
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3
                    className={`text-lg font-semibold text-card-foreground text-balance ${rank === 1 ? "gradient-text" : ""}`}
                  >
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1 transition-colors duration-200 hover:text-accent">
                      <User className="w-4 h-4" />
                      <span>{post.author || "Anonymous"}</span>
                    </div>
                    <div className="flex items-center gap-1 transition-colors duration-200 hover:text-accent">
                      <Clock className="w-4 h-4" />
                      <span>{post.timestamp.toLocaleTimeString()}</span>
                    </div>
                    {post.amount && (
                      <div className="flex items-center gap-1 transition-colors duration-200 hover:text-accent">
                        <TrendingUp className="w-4 h-4" />
                        <span className="font-semibold">{post.amount} ETN</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 items-end">
                  {currentlyPinned && (
                    <Badge
                      variant="secondary"
                      className="bg-accent text-accent-foreground flex items-center gap-1 pulse-accent"
                    >
                      <Pin className="w-3 h-3" />
                      Pinned
                    </Badge>
                  )}

                  {rank === 1 && !currentlyPinned && (
                    <Badge
                      variant="secondary"
                      className="bg-yellow-500 text-yellow-900 flex items-center gap-1 glow-accent-strong"
                    >
                      <Crown className="w-3 h-3" />
                      Top Paid
                    </Badge>
                  )}

                  {rank && rank <= 3 && rank > 1 && !currentlyPinned && (
                    <Badge variant="outline" className="border-accent/50 text-accent flex items-center gap-1">
                      #{rank}
                    </Badge>
                  )}

                  {post.isPinned && post.pinExpiry && (
                    <div className="text-xs text-muted-foreground">
                      {currentlyPinned ? getTimeRemaining(post.pinExpiry) : "Pin expired"}
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <p className="text-card-foreground text-pretty mb-4 leading-relaxed">{post.content}</p>

              {post.link && (
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-accent hover:text-accent/80 text-sm font-medium transition-all duration-200 hover:glow-accent hover:scale-105"
                >
                  <ExternalLink className="w-4 h-4" />
                  Visit Link
                </a>
              )}

              {post.txHash && (
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="text-xs text-muted-foreground">
                    Transaction: <span className="font-mono">{post.txHash}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}

      {hasMore && (
        <div ref={observerRef} className="py-8 text-center">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
              Loading more posts...
            </div>
          ) : (
            <div className="text-muted-foreground text-sm">Scroll to load more posts</div>
          )}
        </div>
      )}

      {!hasMore && displayedPosts.length > 0 && (
        <div className="py-8 text-center text-muted-foreground text-sm">You've reached the end of the board</div>
      )}
    </div>
  )
}
