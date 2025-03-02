'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Schema for validation
const registerSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
})

export async function registerUser(formData: {
  email: string
  firstName: string
  lastName: string
}) {
  try {
    // Validate the input data
    const validatedData = registerSchema.parse(formData)

    // Update the user record
    const updatedUser = await prisma.user.update({
      where: { email: validatedData.email },
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        status: 'APPROVED',
      },
    })

    // Revalidate relevant paths
    revalidatePath('/dashboard')
    revalidatePath('/users')
    
    return { 
      success: true, 
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        status: updatedUser.status,
      } 
    }
  } catch (error) {
    console.error("Registration error:", error)
    
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Invalid input data' }
    }
    
    return { success: false, error: 'Registration failed' }
  }
}
