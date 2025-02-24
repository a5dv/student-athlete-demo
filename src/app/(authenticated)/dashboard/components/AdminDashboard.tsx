import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default async function AdminDashboard({ ...props }) {
  const { session } = props;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={session.user.image || undefined} />
          <AvatarFallback>{session.user.name?.[0]}</AvatarFallback>
        </Avatar>
        <h2 className="text-2xl">Welcome, {session.user.name}</h2>
      </div>
    </div>
  )
}