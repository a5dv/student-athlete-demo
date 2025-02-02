"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function NavButton({ 
  href, 
  icon: Icon, 
  label, 
  isActive 
}: { 
  href: string
  icon: any
  label: string
  isActive: boolean 
}) {
  return (
    <Link href={href}>
      <Button 
        variant="ghost" 
        className={cn("w-full justify-start", isActive && "bg-secondary")}
      >
        <Icon className="mr-2 h-4 w-4" />
        {label}
      </Button>
    </Link>
  )
}