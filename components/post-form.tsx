"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { WalletConnect } from "@/components/wallet-connect"

interface PostFormProps {
  onSubmit: (post: {
    title: string
    content: string
    link?: string
    author?: string
    isPinned: boolean
    amount: number
    txHash: string
  }) => void
}

export function PostForm({ onSubmit }: PostFormProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [link, setLink] = useState("")
  const [author, setAuthor] = useState("")
  const [customAmount, setCustomAmount] = useState("0.001")
  const [amountError, setAmountError] = useState("")
  const [showWalletConnect, setShowWalletConnect] = useState(false)

  const validateAmount = (value: string) => {
    const numValue = Number.parseFloat(value)
    if (isNaN(numValue) || numValue < 0.001) {
      setAmountError("Minimum payment is 0.001 TON")
      return false
    }
    setAmountError("")
    return true
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !content.trim()) {
      return
    }

    if (!validateAmount(customAmount)) {
      return
    }

    setShowWalletConnect(true)
  }

  const handlePaymentSuccess = (txHash: string, amount: number) => {
    const postData = {
      title: title.trim(),
      content: content.trim(),
      link: link.trim() || undefined,
      author: author.trim() || undefined,
      isPinned: true,
      amount,
      txHash,
    }

    onSubmit(postData)

    setTitle("")
    setContent("")
    setLink("")
    setAuthor("")
    setCustomAmount("0.001")
    setAmountError("")
    setShowWalletConnect(false)
  }

  const handleCancel = () => {
    setShowWalletConnect(false)
  }

  if (showWalletConnect) {
    return (
      <div className="mb-8">
        <WalletConnect
          onPaymentSuccess={handlePaymentSuccess}
          onCancel={handleCancel}
          requiredAmount={Number.parseFloat(customAmount)}
        />
      </div>
    )
  }

  return (
    <Card className="mb-8 border-border bg-card hover-scale transition-all duration-300 focus-glow">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-card-foreground">Create New Post</CardTitle>
        <p className="text-sm text-muted-foreground">Pay 0.001+ TON to pin your post for 1 hour</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-card-foreground">
              Title *
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title..."
              required
              className="bg-input border-border text-foreground placeholder:text-muted-foreground focus-glow transition-all duration-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-sm font-medium text-card-foreground">
              Post *
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              required
              rows={4}
              className="bg-input border-border text-foreground placeholder:text-muted-foreground resize-none focus-glow transition-all duration-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="link" className="text-sm font-medium text-card-foreground">
              Link (optional)
            </Label>
            <Input
              id="link"
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://example.com"
              className="bg-input border-border text-foreground placeholder:text-muted-foreground focus-glow transition-all duration-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author" className="text-sm font-medium text-card-foreground">
              Your Name (optional)
            </Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Anonymous"
              className="bg-input border-border text-foreground placeholder:text-muted-foreground focus-glow transition-all duration-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium text-card-foreground">
              Payment Amount (TON) *
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.001"
              min="0.001"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value)
                if (e.target.value) {
                  validateAmount(e.target.value)
                }
              }}
              placeholder="0.001"
              required
              className={`bg-input border-border text-foreground placeholder:text-muted-foreground focus-glow transition-all duration-200 ${
                amountError ? "border-red-500 focus:border-red-500" : ""
              }`}
            />
            {amountError && <p className="text-sm text-red-500 mt-1">{amountError}</p>}
            <p className="text-xs text-muted-foreground">Higher amounts get better ranking after pin expires</p>
          </div>

          <Button
            type="submit"
            disabled={!title.trim() || !content.trim() || !!amountError}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold py-3 transition-all duration-200 hover:glow-accent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Payment
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
