"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useTonConnectUI, useTonWallet as useTonWalletSDK } from "@tonconnect/ui-react"
import { beginCell, toNano } from "@ton/ton"

interface TonWallet {
  address: string | null
  isConnected: boolean
  balance: number
}

export function useTonWallet() {
  const [tonConnectUI] = useTonConnectUI()
  const wallet = useTonWalletSDK()
  const [balance, setBalance] = useState(0)
  const [isConnecting, setIsConnecting] = useState(false)
  const pendingTransactionRef = useRef<boolean>(false)
  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const fetchBalance = async () => {
      if (wallet?.account?.address) {
        try {
          // Mock balance for now - in production, you'd fetch from TON API
          setBalance(25.5)
        } catch (error) {
          console.error("[v0] Failed to fetch balance:", error)
          setBalance(0)
        }
      } else {
        setBalance(0)
      }
    }

    fetchBalance()
  }, [wallet?.account?.address])

  useEffect(() => {
    return () => {
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current)
      }
    }
  }, [])

  const connectWallet = useCallback(async () => {
    if (isConnecting || pendingTransactionRef.current) return // Prevent multiple operations

    setIsConnecting(true)
    try {
      // Check if already connected
      if (wallet?.account?.address) {
        console.log("[v0] Wallet already connected")
        setIsConnecting(false)
        return
      }

      if (!tonConnectUI) {
        throw new Error("TON Connect UI not initialized")
      }

      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current)
        connectionTimeoutRef.current = null
      }

      console.log("[v0] Starting wallet connection...")

      connectionTimeoutRef.current = setTimeout(() => {
        console.log("[v0] Connection timeout")
        setIsConnecting(false)
      }, 60000) // Increase to 60 seconds

      await tonConnectUI.openModal()

      let attempts = 0
      const maxAttempts = 30 // 30 seconds
      while (!wallet?.account?.address && attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        attempts++
      }

      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current)
        connectionTimeoutRef.current = null
      }

      if (wallet?.account?.address) {
        console.log("[v0] Wallet connected successfully:", wallet.account.address)
      } else {
        console.log("[v0] Connection attempt completed but no wallet connected")
      }
    } catch (error) {
      console.error("[v0] Failed to connect wallet:", error)

      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current)
        connectionTimeoutRef.current = null
      }
    } finally {
      setIsConnecting(false)
    }
  }, [tonConnectUI, wallet?.account?.address, isConnecting])

  const disconnect = useCallback(async () => {
    if (pendingTransactionRef.current) {
      console.log("[v0] Cannot disconnect during pending transaction")
      return
    }

    try {
      if (tonConnectUI.connected) {
        await tonConnectUI.disconnect()
      }
    } catch (error) {
      console.error("[v0] Failed to disconnect wallet:", error)
      // Don't throw here, just log the error
    }
  }, [tonConnectUI])

  const sendPayment = useCallback(
    async (amount: number) => {
      if (pendingTransactionRef.current) {
        throw new Error("Another transaction is in progress")
      }

      if (!wallet?.account?.address) {
        throw new Error("Wallet not connected")
      }

      if (amount < 0.001) {
        throw new Error("Minimum payment is 0.001 TON")
      }

      if (balance < amount) {
        throw new Error("Insufficient balance")
      }

      pendingTransactionRef.current = true

      const body = beginCell()
        .storeUint(0, 32) // indicates text comment follows
        .storeStringTail("thanks to tegegn dev") // write our text comment
        .endCell()

      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 600,
        messages: [
          {
            address: "0QDn-OHlQytkBhPCW3ZvA8l-Pex8kHTI72JW1f1g2sM0bZwa",
            amount: toNano(amount).toString(),
            payload: body.toBoc().toString("base64"),
          },
        ],
      }

      try {
        // Check if wallet is still connected before sending
        if (!tonConnectUI.connected) {
          throw new Error("Wallet disconnected")
        }

        console.log("[v0] Sending transaction:", transaction)
        const result = await tonConnectUI.sendTransaction(transaction)

        // Update balance after successful transaction
        setBalance((prev) => prev - amount)

        console.log("[v0] Payment sent:", amount, "TON")
        return {
          success: true,
          txHash: result.boc || "tx_" + Date.now(),
          amount,
        }
      } catch (error) {
        console.error("[v0] Transaction failed:", error)

        // Handle specific TON Connect errors
        if (error instanceof Error) {
          if (error.message.includes("Operation aborted") || error.message.includes("User rejected")) {
            throw new Error("Transaction was cancelled by user")
          }
          if (error.message.includes("Insufficient funds")) {
            throw new Error("Insufficient balance")
          }
          if (error.message.includes("timeout")) {
            throw new Error("Transaction timed out. Please try again.")
          }
        }

        throw new Error("Transaction failed. Please try again.")
      } finally {
        pendingTransactionRef.current = false
      }
    },
    [wallet?.account?.address, balance, tonConnectUI],
  )

  return {
    wallet: {
      address: wallet?.account?.address || null,
      isConnected: !!wallet?.account?.address,
      balance,
    },
    isConnecting,
    connectWallet,
    disconnect,
    sendPayment,
  }
}
