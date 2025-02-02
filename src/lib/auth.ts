import { type AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session }) {
      // if (session.user) {
      //   session.user.id = user.id
      // }
      return session
    },
    async signIn({ user }) {
      console.log(user);
      if (user) {
        await prisma.user.upsert({
          where: { id: user.id },
          create: { id: user.id, lastLogin: new Date() },
          update: { lastLogin: new Date() },
        })
      }
      return true
    },
  },
}