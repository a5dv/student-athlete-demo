// src/app/page.tsx
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';

export default async function App() {
  // try {
  //   const session = await getServerSession(authOptions)

  //   if (session) {
  //     redirect("/dashboard")
  //   }

  //   redirect("/auth/signin")
  // } catch (error) {
  //   // Log the error to your error monitoring service
  //   console.error("Authentication error:", error)
  //   // Redirect to signin page as a fallback
  //   redirect("/auth/signin")
  // }
  const session = await getServerSession(authOptions);

  // console.log("APP PAGE")

  if (!session) {
    redirect('/auth/signin');
  }

  redirect('/dashboard');
}
