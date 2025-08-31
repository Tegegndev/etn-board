"use client"

import { PostForm } from "@/components/post-form"
import { PostBoard } from "@/components/post-board"
import { BoardStats } from "@/components/board-stats"
import { usePostManager } from "@/hooks/use-post-manager"

export default function ETNBoard() {
  const { addPost, getSortedPosts, getPostStats } = usePostManager()

  const sortedPosts = getSortedPosts()
  const stats = getPostStats()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">ETN Board</h1>
          <p className="text-muted-foreground">Crypto-native bulletin board • Pay to pin your posts</p>
        </div>

        {/* Board Stats */}
        <BoardStats stats={stats} />

        {/* Post Form */}
        <PostForm onSubmit={addPost} />

        {/* Posts Board */}
        <PostBoard posts={sortedPosts} />
      </div>
    </div>
  )
}
