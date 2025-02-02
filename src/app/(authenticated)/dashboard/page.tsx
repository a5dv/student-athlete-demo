import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { prisma } from "@/lib/prisma"

async function getUserId(email: string | null | undefined) {
  if (!email) return null
  const user = await prisma.user.findUnique({ where: { email } })
  return user?.id
}

export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return null // This should never happen due to our layout protection
  }

  const userId = await getUserId(session.user.email)

  if (!userId) {
    return null
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={session.user.image || undefined} />
          <AvatarFallback>{session.user.name?.[0]}</AvatarFallback>
        </Avatar>
        <h2 className="text-2xl">Welcome, {session.user.name}</h2>
      </div>
    </div>
  )
}