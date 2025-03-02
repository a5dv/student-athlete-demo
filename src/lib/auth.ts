import { type AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "./prisma"

// const prisma = new PrismaClient()

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true
    }),
  ],
  callbacks: {
    async session({ session, user }) {
    
      if (session.user) {
        session.user.name = user.name
        session.user.image = user.image
        session.user.role = user.role
        session.user.status = user.status
        session.user.firstName = user.firstName
        session.user.lastName = user.lastName
      }
      return session
    },
    async jwt({ token, user }) {

      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async signIn({ user, profile }) {
      // console.log('user', user)
      // console.log('profile', profile)
      // console.log('account', account)
      // console.log('email', email)
      // console.log('credentials', credentials)
      // console.log('SignIn callback called')
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email! },
      })

      if (!existingUser) {
        // Create new user with basic info
        await prisma.user.create({
          data: {
            id: user.id,
            email: user.email,
            image: profile?.picture || profile?.image,
            lastLogin: new Date(),
            status: 'PENDING'
          },
        })
      } else {
        // Update last login time
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { lastLogin: new Date() },
        })
      }
      
      return true
    },
  },
  pages: {
    signIn: "/auth/signin",
    // newUser: "/auth/register",
  }
}