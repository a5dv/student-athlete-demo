import { prisma } from "@/lib/prisma"
import { BookingsTable } from "./components/BookingsTable"

export default async function BookingsPage() {
  const bookings = await prisma.booking.findMany({
    include: {
      client: true,
      provider: true,
    },
    take: 15,
  })

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Bookings</h1>
      <BookingsTable initialData={bookings} />
    </div>
  )
}

