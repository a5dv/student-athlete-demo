import { User as PrismaUser } from '@prisma/client'
import 'next-auth'

declare module 'next-auth' {
  interface User extends PrismaUser {
    role: string
  }
  interface Session {
    user: User
  }
  // interface AdapterUser extends PrismaUser {
  //   role: string
  // }
}
