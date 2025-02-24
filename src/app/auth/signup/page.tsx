import { getProviders } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import Link from "next/link"
import { SignUpButton } from "@/components/auth/SignUpButton"

export default async function SignUp({
  searchParams,
}: {
  searchParams: { error: string }
}
  
) {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/dashboard")
  }

  const providers = await getProviders()
  const { error } = await searchParams

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          {
            error === "existing_user" && (
              <p className="text-sm text-red-500 mb-4">
                An account with this email already exists. Please sign in instead.
              </p>
            )
          }
          {
            providers &&
            Object.values(providers).map((provider) => (
              <SignUpButton key={provider.name} provider={provider} />
            ))
          }
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/signin" className="underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

