"use client"

import { Shield, Menu, X, Bell, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface HeaderProps {
  username?: string
  notifications?: number
  onMenuToggle?: () => void
}

export default function Header({ username = "Guest", notifications = 0, onMenuToggle }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen)
    if (onMenuToggle) onMenuToggle()
  }

  return (
    <header className="bg-neutral-900/80 backdrop-blur-md border-b border-primary-600/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo and title */}
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" onClick={handleMenuToggle} className="md:hidden">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>

          <div className="flex items-center">
            <Shield className="h-6 w-6 text-primary-500 mr-2" />
            <span className="text-lg font-semibold text-white hidden sm:inline">AIDEN</span>
            <span className="text-xs text-primary-400 ml-2 hidden lg:inline">
              Adaptive Integrated Defense and Execution Node
            </span>
          </div>
        </div>

        {/* Navigation - hidden on mobile */}
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-neutral-300 hover:text-white transition-colors">
            Dashboard
          </a>
          <a href="#" className="text-neutral-300 hover:text-white transition-colors">
            Analytics
          </a>
          <a href="#" className="text-neutral-300 hover:text-white transition-colors">
            Terminal
          </a>
          <a href="#" className="text-neutral-300 hover:text-white transition-colors">
            Documentation
          </a>
        </nav>

        {/* User controls */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Button variant="ghost" size="icon" className="text-neutral-300 hover:text-white">
              <Bell size={18} />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-accent-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications > 9 ? "9+" : notifications}
                </span>
              )}
            </Button>
          </div>

          <Button variant="ghost" size="icon" className="text-neutral-300 hover:text-white">
            <Settings size={18} />
          </Button>

          <div className="hidden sm:flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-primary-700 flex items-center justify-center text-white">
              {username.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-neutral-300">{username}</span>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-neutral-900 border-b border-primary-600/20 animate-fade-in">
          <nav className="container mx-auto px-4 py-3 flex flex-col space-y-3">
            <a href="#" className="text-neutral-300 hover:text-white transition-colors py-2">
              Dashboard
            </a>
            <a href="#" className="text-neutral-300 hover:text-white transition-colors py-2">
              Analytics
            </a>
            <a href="#" className="text-neutral-300 hover:text-white transition-colors py-2">
              Terminal
            </a>
            <a href="#" className="text-neutral-300 hover:text-white transition-colors py-2">
              Documentation
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
