// app/auth/signin/page.tsx
import { getProviders } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "../../api/auth/[...nextauth]/route"
import { LoginButton } from "@/components/auth/LoginButton"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"

export default async function SignIn() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/dashboard")
  }

  const providers = await getProviders()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="flex justify-center">Student Athelete Co Demo App</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <p>Please sign in to continue</p>
        </CardContent>
        <CardFooter className="flex justify-center">
        {providers &&
        Object.values(providers).map((provider) => (
          <LoginButton key={provider.name} provider={provider} />
        ))}
        </CardFooter>
      </Card>
    </main>
  )
}