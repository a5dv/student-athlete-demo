import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

type Context = {
  params: Promise<{id: string}>
}

export async function PUT(
  request: Request,
  context: Context
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const { id } = await context.params;
  const body = await request.json()
  const updatedData = await prisma.trainingData.update({
    where: { id },
    data: body,
  })

  return NextResponse.json(updatedData)
}

export async function DELETE(
  request: Request,
  context: Context
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const { id } = await context.params;

  await prisma.trainingData.update({
    where: { id },
    data: { deletedAt: new Date() },
  })

  return new NextResponse(null, { status: 204 })
}