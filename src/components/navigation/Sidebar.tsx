"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Dumbbell } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LogoutButton } from "@/components/navigation/LogoutButton"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Dumbbell, label: "Training Data", href: "/training-data" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-background h-full border-r flex flex-col">
      <div className="flex-1 py-4">
        <nav className="space-y-2 px-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button variant="ghost" className={cn("w-full justify-start", pathname === item.href && "bg-secondary")}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t">
        <LogoutButton />
      </div>
    </div>
  )
}

