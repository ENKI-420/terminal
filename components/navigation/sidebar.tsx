"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  IconHome,
  IconDna,
  IconMessage,
  IconUser,
  IconSettings,
  IconLogout,
  IconMenu2,
  IconFlask,
  // Fix for IconBrandEpic import error - using direct import instead of barrel import
  IconShieldLock,
  IconBuildingHospital, // Replace IconBrandEpic with IconBuildingHospital
} from "@tabler/icons-react"
// Remove this line
// import { IconBrandEpic } from "@tabler/icons-react/dist/esm/icons/IconBrandEpic"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/auth-provider"
import { cn } from "@/lib/utils"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const { signOut } = useAuth()

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  // Then replace all instances of IconBrandEpic with IconBuildingHospital in the navItems array
  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: IconHome,
    },
    {
      name: "Genomics",
      href: "/genomics",
      icon: IconDna,
    },
    {
      name: "Laboratory",
      href: "/laboratory",
      icon: IconFlask,
    },
    {
      name: "Epic Integration",
      href: "/epic-integration",
      icon: IconBuildingHospital, // Changed from IconBrandEpic
    },
    {
      name: "Chat",
      href: "/chat",
      icon: IconMessage,
    },
    {
      name: "Patients",
      href: "/patients",
      icon: IconUser,
    },
    {
      name: "Admin",
      href: "/admin",
      icon: IconShieldLock,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: IconSettings,
    },
  ]

  return (
    <>
      {/* Mobile sidebar toggle */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button variant="outline" size="icon" onClick={toggleSidebar}>
          <IconMenu2 className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile overlay */}
      {!collapsed && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden" onClick={toggleSidebar} />
      )}

      {/* Sidebar */}
      <motion.div
        className={cn(
          "fixed top-0 left-0 z-50 h-full bg-card border-r border-border transition-all duration-300 md:relative",
          collapsed ? "w-[70px]" : "w-[250px]",
          className,
        )}
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center space-x-2">
              <div className="bg-primary/20 p-2 rounded-full">
                <IconDna className="h-5 w-5 text-primary" />
              </div>
              {!collapsed && <h1 className="text-xl font-bold">AGENT 2.0</h1>}
            </div>
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hidden md:flex">
              <IconMenu2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-2">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link href={item.href}>
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        className={cn("w-full justify-start", collapsed ? "px-2" : "px-3")}
                      >
                        <item.icon className="h-5 w-5 mr-2" />
                        {!collapsed && <span>{item.name}</span>}
                      </Button>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-2 border-t border-border">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10",
                collapsed ? "px-2" : "px-3",
              )}
              onClick={signOut}
            >
              <IconLogout className="h-5 w-5 mr-2" />
              {!collapsed && <span>Logout</span>}
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  )
}

