import { getProviders, signIn } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "../../api/auth/[...nextauth]/route"
import { Button } from "@/components/ui/button"

export default async function SignIn() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/dashboard")
  }

  const providers = await getProviders()

  return (
    <div className="flex justify-center items-center min-h-screen">
      {providers &&
        Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <Button onClick={() => signIn(provider.id, { callbackUrl: "/dashboard" })}>
              Sign in with {provider.name}
            </Button>
          </div>
        ))}
    </div>
  )
}