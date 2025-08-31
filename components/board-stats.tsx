"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Pin, TrendingUp, MessageSquare, Coins } from "lucide-react"

interface BoardStatsProps {
  stats: {
    totalPosts: number
    pinnedPosts: number
    totalRevenue: number
    averagePayment: number
  }
}

export function BoardStats({ stats }: BoardStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <Card className="border-border bg-card">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <MessageSquare className="w-5 h-5 text-accent" />
          </div>
          <div className="text-2xl font-bold text-card-foreground">{stats.totalPosts}</div>
          <div className="text-xs text-muted-foreground">Total Posts</div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Pin className="w-5 h-5 text-accent" />
          </div>
          <div className="text-2xl font-bold text-card-foreground">{stats.pinnedPosts}</div>
          <div className="text-xs text-muted-foreground">Pinned Now</div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Coins className="w-5 h-5 text-accent" />
          </div>
          <div className="text-2xl font-bold text-card-foreground">{stats.totalRevenue.toFixed(1)}</div>
          <div className="text-xs text-muted-foreground">Total ETN</div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="w-5 h-5 text-accent" />
          </div>
          <div className="text-2xl font-bold text-card-foreground">{stats.averagePayment.toFixed(1)}</div>
          <div className="text-xs text-muted-foreground">Avg Payment</div>
        </CardContent>
      </Card>
    </div>
  )
}
