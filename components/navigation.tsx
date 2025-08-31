"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#133A2A] to-[#FFB400] flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[#133A2A]/20">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-[#133A2A] to-[#FFB400] bg-clip-text text-transparent">
                ETN Board
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-1">
            <Link
              href="/"
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative overflow-hidden group",
                pathname === "/"
                  ? "bg-[#133A2A] text-white shadow-lg shadow-[#133A2A]/20"
                  : "text-gray-300 hover:text-white hover:bg-gray-800",
              )}
            >
              <span className="relative z-10">Board</span>
              {pathname === "/" && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#133A2A] to-[#133A2A]/80 animate-pulse" />
              )}
            </Link>

            <Link
              href="/my-posts"
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative overflow-hidden group",
                pathname === "/my-posts"
                  ? "bg-[#133A2A] text-white shadow-lg shadow-[#133A2A]/20"
                  : "text-gray-300 hover:text-white hover:bg-gray-800",
              )}
            >
              <span className="relative z-10">My Posts</span>
              {pathname === "/my-posts" && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#133A2A] to-[#133A2A]/80 animate-pulse" />
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
