"use client"

import { useState, useEffect } from "react"

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

const DEMO_POSTS: Omit<Post, "id" | "timestamp">[] = [
  {
    title: "🚀 ETN Network Launch Announcement",
    content:
      "The ETN Network is officially live! Join us in revolutionizing decentralized communications with our bulletin board system. First 100 users get bonus rewards!",
    link: "https://etn.network",
    author: "ETN Team",
    isPinned: true,
    amount: 25,
    txHash: "0x1234...abcd",
  },
  {
    title: "DeFi Summer 2.0 is Here",
    content:
      "New yield farming opportunities are emerging across multiple chains. Share your strategies and alpha in the comments. DYOR as always!",
    author: "CryptoAnalyst",
    isPinned: true,
    amount: 15,
    txHash: "0x5678...efgh",
  },
  {
    title: "NFT Collection Drop Tomorrow",
    content:
      "Excited to announce our new generative art collection dropping tomorrow at 3PM UTC. 10,000 unique pieces with utility in our metaverse.",
    link: "https://opensea.io/collection/example",
    author: "ArtistDAO",
    isPinned: false,
    amount: 12,
    txHash: "0x9abc...ijkl",
  },
  {
    title: "Web3 Developer Meetup - Virtual Event",
    content:
      "Join us for a virtual meetup discussing the latest in smart contract development, Layer 2 solutions, and cross-chain protocols. Free for all attendees!",
    author: "DevCommunity",
    isPinned: false,
    amount: 8,
    txHash: "0xdef0...mnop",
  },
  {
    title: "Market Analysis: Bull Run Incoming?",
    content:
      "Technical analysis suggests we might be entering a new bull cycle. Key resistance levels to watch and potential breakout scenarios discussed.",
    author: "TradingPro",
    isPinned: false,
    amount: 6,
    txHash: "0x1111...2222",
  },
]

export function usePostManager() {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    const demoPosts = DEMO_POSTS.map((post, index) => ({
      ...post,
      id: Date.now() + index,
      timestamp: new Date(Date.now() - index * 30 * 60 * 1000), // Stagger timestamps by 30 minutes
      pinExpiry: post.isPinned ? new Date(Date.now() + 60 * 60 * 1000) : undefined, // 1 hour from now
    }))
    setPosts(demoPosts)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setPosts((currentPosts) =>
        currentPosts.map((post) => {
          if (post.isPinned && post.pinExpiry && post.pinExpiry <= new Date()) {
            console.log("[v0] Pin expired for post:", post.title)
            return { ...post, isPinned: false }
          }
          return post
        }),
      )
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  const addPost = (newPost: Omit<Post, "id" | "timestamp">) => {
    const post: Post = {
      ...newPost,
      id: Date.now(),
      timestamp: new Date(),
      pinExpiry: newPost.isPinned ? new Date(Date.now() + 60 * 60 * 1000) : undefined, // 1 hour from now
    }

    setPosts((prev) => {
      const updated = [post, ...prev]
      console.log("[v0] Added new post:", post.title, "Pinned:", post.isPinned, "Amount:", post.amount)
      return updated
    })
  }

  const deletePost = (postId: number) => {
    setPosts((prev) => prev.filter((post) => post.id !== postId))
  }

  const getSortedPosts = () => {
    return [...posts].sort((a, b) => {
      const now = new Date()

      // Check if posts are currently pinned (not expired)
      const aIsPinned = a.isPinned && a.pinExpiry && a.pinExpiry > now
      const bIsPinned = b.isPinned && b.pinExpiry && b.pinExpiry > now

      // Pinned posts first
      if (aIsPinned && !bIsPinned) return -1
      if (!aIsPinned && bIsPinned) return 1

      // If both pinned, sort by amount (higher first), then timestamp
      if (aIsPinned && bIsPinned) {
        if ((a.amount || 0) !== (b.amount || 0)) {
          return (b.amount || 0) - (a.amount || 0)
        }
        return b.timestamp.getTime() - a.timestamp.getTime()
      }

      // If both not pinned, sort by amount (higher first), then timestamp
      if (!aIsPinned && !bIsPinned) {
        if ((a.amount || 0) !== (b.amount || 0)) {
          return (b.amount || 0) - (a.amount || 0)
        }
        return b.timestamp.getTime() - a.timestamp.getTime()
      }

      return 0
    })
  }

  const getPostStats = () => {
    const now = new Date()
    const pinnedPosts = posts.filter((post) => post.isPinned && post.pinExpiry && post.pinExpiry > now)
    const totalRevenue = posts.reduce((sum, post) => sum + (post.amount || 0), 0)

    return {
      totalPosts: posts.length,
      pinnedPosts: pinnedPosts.length,
      totalRevenue,
      averagePayment: posts.length > 0 ? totalRevenue / posts.length : 0,
    }
  }

  return {
    posts,
    addPost,
    deletePost,
    getSortedPosts,
    getPostStats,
  }
}
