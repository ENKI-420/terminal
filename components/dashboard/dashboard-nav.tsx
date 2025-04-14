"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Video,
  MessageSquare,
  Activity,
  Pill,
  Bell,
  Settings,
  CreditCard,
  Dna,
  Microscope,
  User,
  Beaker,
} from "lucide-react"

interface DashboardNavProps {
  className?: string
}

export function DashboardNav({ className }: DashboardNavProps) {
  const pathname = usePathname()

  const navItems = [
    {
      title: "Overview",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      title: "AGENT Platform",
      href: "/dashboard/agent",
      icon: <Dna className="h-4 w-4" />,
    },
    {
      title: "Telehealth",
      href: "/dashboard/telehealth",
      icon: <MessageSquare className="h-4 w-4" />,
    },
    {
      title: "Video Consultations",
      href: "/dashboard/video-consults",
      icon: <Video className="h-4 w-4" />,
    },
    {
      title: "Health Tracking",
      href: "/dashboard/health-tracking",
      icon: <Activity className="h-4 w-4" />,
    },
    {
      title: "Medications",
      href: "/dashboard/medications",
      icon: <Pill className="h-4 w-4" />,
    },
    {
      title: "Lab History",
      href: "/dashboard/lab-history",
      icon: <Microscope className="h-4 w-4" />,
    },
    {
      title: "Notifications",
      href: "/dashboard/notifications",
      icon: <Bell className="h-4 w-4" />,
    },
    {
      title: "Billing & Payments",
      href: "/dashboard/billing",
      icon: <CreditCard className="h-4 w-4" />,
    },
    {
      title: "Clinical Trials",
      href: "/dashboard/clinical-trials",
      icon: <Beaker className="h-4 w-4" />,
    },
    {
      title: "My Profile",
      href: "/dashboard/profile",
      icon: <User className="h-4 w-4" />,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="h-4 w-4" />,
    },
  ]

  return (
    <nav className={cn("grid items-start gap-2", className)}>
      {navItems.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className={cn(
            "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            pathname === item.href ? "bg-accent" : "transparent",
          )}
        >
          {item.icon}
          <span className="ml-3">{item.title}</span>
        </Link>
      ))}
    </nav>
  )
}
