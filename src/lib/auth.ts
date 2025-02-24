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
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      console.log(user)
      if (session.user) {
        session.user.role = user.role
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
    async signIn({ user, account, profile }) {
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email! },
      })

      if (!existingUser) {
        await prisma.user.create({
          data: {
            id: user.id,
            email: user.email,
            lastLogin: new Date(),
          },
        })
        return true
      }
    
      // For existing users, just update their last login
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { lastLogin: new Date() },
      })
      
      if (account?.type === "oauth" && profile?.email && !existingUser.role) {
        return '/auth/signup?error=existing_user'
      }
    
      return true
    },
  },
  pages: {
    signIn: "/auth/signin",
    newUser: "/auth/signup",
  }
}