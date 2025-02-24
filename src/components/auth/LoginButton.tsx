'use client'

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { GoogleIcon } from "@/components/icons/GoogleIcon"

type Provider = {
  id: string
  name: string
}

type LoginButtonProps = {
  provider: Provider
}

export function LoginButton({ provider }: LoginButtonProps) {
  return (
    <div>
      <Button 
        onClick={() => signIn(provider.id, { callbackUrl: "/dashboard" })} className="w-full"
      >
        <GoogleIcon />
        Sign in with {provider.name}
      </Button>
    </div>
  )
}