'use server'

import { prisma } from "@/lib/prisma"
import { UserStatus, Role } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function updateUserStatus(userId: string, status: UserStatus) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized: Only admins can update user status')
  }

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { status }
    })
    
    revalidatePath('/users')
    
    return { success: true, user }
  } catch (error) {
    console.error("Failed to update user status:", error)
    return { success: false, error: "Failed to update user status" }
  }
}

export async function updateUserRole(userId: string, role: Role) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized: Only admins can update user roles')
  }

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role }
    })
    
    revalidatePath('/users')
    
    return { success: true, user }
  } catch (error) {
    console.error("Failed to update user role:", error)
    return { success: false, error: "Failed to update user role" }
  }
}
