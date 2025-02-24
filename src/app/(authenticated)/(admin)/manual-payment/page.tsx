import { prisma } from "@/lib/prisma"
import { ManualPaymentTable } from "./components/ManualPaymentTable"

export default async function ManualPaymentPage() {  

  const pendingBookings = await prisma.booking.findMany({
    where: {
      paymentStatus: "PENDING",
    },
    include: {
      client: true,
      provider: true,
    },
    take: 15,
  })

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Manual Payment</h1>
      <ManualPaymentTable initialData={pendingBookings} />
    </div>
  )
}

