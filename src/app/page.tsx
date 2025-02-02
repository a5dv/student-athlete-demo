import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { LoginButton } from "@/components/auth/LoginButton"
import { authOptions } from "./api/auth/[...nextauth]/route"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"

export default async function App() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/dashboard")
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Welcome to My Next.js App</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please sign in to continue</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <LoginButton />
        </CardFooter>
      </Card>
    </main>
  )
}