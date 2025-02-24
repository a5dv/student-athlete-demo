import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import AdminDashboard from "./components/AdminDashboard";


export default async function Dashboard() {
  const session = await getServerSession(authOptions)
  const role = session?.user?.role;

  switch (role) {
    case "ADMIN":
      return <AdminDashboard session={session} />
    default:
      return <div>Invalid role</div>
  }
}