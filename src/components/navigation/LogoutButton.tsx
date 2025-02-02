"use client"

import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

export function LogoutButton() {

  return (
    <Button
      variant="ghost"
      className="w-full justify-start"
      onClick={() => signOut()}
    >
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  )
}