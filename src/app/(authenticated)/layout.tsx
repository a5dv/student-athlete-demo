import type React from "react"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { Sidebar } from "@/components/navigation/Sidebar"

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  // console.log('SESSION ON AUTH LAYOUT', session.user)

  if (session.user.status !== "APPROVED") {
    redirect("/auth/register")
  }

  return (
    <div className="flex h-screen">
      <Sidebar role={session.user.role} />
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  )
}