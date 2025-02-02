import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const body = await req.json()
  const updatedData = await prisma.trainingData.update({
    where: { id: params.id },
    data: body,
  })

  return NextResponse.json(updatedData)
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  await prisma.trainingData.update({
    where: { id: params.id },
    data: { deletedAt: new Date() },
  })

  return new NextResponse(null, { status: 204 })
}

