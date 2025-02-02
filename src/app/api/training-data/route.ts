import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

async function getUserId(email: string | null | undefined) {
  if (!email) return null
  const user = await prisma.user.findUnique({ where: { email } })
  return user?.id
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const userId = await getUserId(session.user?.email)
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const body = await req.json()
  const newData = await prisma.trainingData.create({
    data: {
      ...body,
      userId: userId,
    },
  })

  return NextResponse.json(newData)
}

