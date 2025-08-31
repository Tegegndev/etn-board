"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Wallet, Loader2, CheckCircle } from "lucide-react"
import { useTonWallet } from "@/hooks/use-ton-wallet"

interface WalletConnectProps {
  onPaymentSuccess: (txHash: string, amount: number) => void
  onCancel: () => void
  requiredAmount?: number
}

export function WalletConnect({ onPaymentSuccess, onCancel, requiredAmount = 0.001 }: WalletConnectProps) {
  const { wallet, isConnecting, connectWallet, sendPayment } = useTonWallet()
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false)

  const handlePayment = async () => {
    if (!wallet.isConnected) return

    setIsPaymentProcessing(true)
    try {
      const result = await sendPayment(requiredAmount)
      onPaymentSuccess(result.txHash, result.amount)
    } catch (error) {
      console.error("[v0] Payment failed:", error)
      alert(error.message || "Payment failed")
    } finally {
      setIsPaymentProcessing(false)
    }
  }

  if (!wallet.isConnected) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="p-6 text-center">
          <div className="mb-4">
            <Wallet className="w-12 h-12 mx-auto text-accent mb-3" />
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Connect TON Wallet</h3>
            <p className="text-sm text-muted-foreground">
              Connect your TON wallet to pay {requiredAmount} TON and pin your post
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={connectWallet}
              disabled={isConnecting}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-200 hover:glow-accent"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  <span className="shimmer">Connecting...</span>
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={onCancel}
              className="w-full border-border text-muted-foreground hover:text-foreground bg-transparent transition-all duration-200 hover:border-accent/50"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-6">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium text-card-foreground">Wallet Connected</span>
          </div>

          <div className="text-xs text-muted-foreground mb-4 font-mono">
            {wallet.address?.slice(0, 8)}...{wallet.address?.slice(-6)}
          </div>

          <div className="mb-4 text-center">
            <div className="text-lg font-semibold text-foreground mb-2">Ready to pay {requiredAmount} TON</div>
            <div className="text-sm text-muted-foreground">This will pin your post for 1 hour</div>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handlePayment}
            disabled={isPaymentProcessing}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-200 hover:glow-accent-strong disabled:opacity-50"
          >
            {isPaymentProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span className="shimmer">Processing Payment...</span>
              </>
            ) : (
              `Pay ${requiredAmount} TON & Post`
            )}
          </Button>

          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isPaymentProcessing}
            className="w-full border-border text-muted-foreground hover:text-foreground bg-transparent transition-all duration-200 hover:border-accent/50"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
