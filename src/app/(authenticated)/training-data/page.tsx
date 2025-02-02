import { getServerSession } from "next-auth/next"
import { authOptions } from "../../api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { TrainingDataTable } from "@/components/TrainingDataTable"

async function getUserId(email: string | null | undefined) {
  if (!email) return null
  const user = await prisma.user.findUnique({ where: { email } })
  return user?.id
}

export default async function TrainingData() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return null
  }

  const userId = await getUserId(session.user.email)

  if (!userId) {
    return null
  }

  const trainingData = await prisma.trainingData.findMany({
    where: { userId, deletedAt: null },
    orderBy: { date: "desc" },
    take: 10,
  })

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Training Data</h1>
      <TrainingDataTable data={trainingData} />
    </div>
  )
}

