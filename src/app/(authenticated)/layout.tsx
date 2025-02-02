import type React from "react"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { Sidebar } from "@/components/navigation/Sidebar"
import { prisma } from "@/lib/prisma"

async function getUserId(email: string | null | undefined) {
  if (!email) return null
  const user = await prisma.user.findUnique({ where: { email } })
  return user?.id
}

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const userId = await getUserId(session.user?.email)

  if (!userId) {
    redirect("/auth/signin")
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  )
}