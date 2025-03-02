import { z } from 'zod'

// Validation schema
export const registerSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
})

// Form values type
export type RegisterFormValues = z.infer<typeof registerSchema>

// Server action response type
export interface RegisterResponse {
  success: boolean
  user?: {
    id: string
    email: string
    firstName: string
    lastName: string
    status: string
  }
  error?: string
}
