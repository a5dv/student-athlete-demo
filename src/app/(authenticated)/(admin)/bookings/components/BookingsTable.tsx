/* eslint-disable @typescript-eslint/no-unused-vars */
// TODO: remove unused variables
"use client"

import { useState } from "react"
import type { Booking, User } from "@prisma/client"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"

type BookingWithUsers = Booking & {
  client: User
  provider: User
}

interface BookingsTableProps {
  initialData: BookingWithUsers[]
}

export function BookingsTable({ initialData }: BookingsTableProps) {
  const [data, _setData] = useState(initialData)
  const [search, setSearch] = useState("")
  const [_filters, _setFilters] = useState({})
  const [_dateFilters, _setDateFilters] = useState({})
  const [pageSize, setPageSize] = useState(15)
  // const router = useRouter()

  // Implement search, filter, and pagination logic here

  return (
    <div>
      <div className="flex space-x-2 mb-4">
        <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
        {/* Add filter dropdowns here */}
        {/* Add date pickers here */}
        <Select value={pageSize.toString()} onValueChange={(value: string) => setPageSize(Number(value))}>
          <option value="15">15 per page</option>
          <option value="50">50 per page</option>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Booking ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Payment Status</TableHead>
            <TableHead>Payment Reference</TableHead>
            <TableHead>Payment Date</TableHead>
            <TableHead>Creation Date</TableHead>
            <TableHead>Rescheduled</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>{booking.id}</TableCell>
              <TableCell>{booking.status}</TableCell>
              <TableCell>{booking.client.name}</TableCell>
              <TableCell>{booking.provider.name}</TableCell>
              <TableCell>{booking.category}</TableCell>
              <TableCell>{booking.dateTime.toLocaleString()}</TableCell>
              <TableCell>{booking.location}</TableCell>
              <TableCell>{booking.price}</TableCell>
              <TableCell>{booking.paymentMethod}</TableCell>
              <TableCell>{booking.paymentStatus}</TableCell>
              <TableCell>{booking.paymentReference}</TableCell>
              <TableCell>{booking.paymentDate?.toLocaleDateString()}</TableCell>
              <TableCell>{booking.createdAt.toLocaleDateString()}</TableCell>
              <TableCell>{booking.isRescheduled ? "Yes" : "No"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Add pagination controls here */}
    </div>
  )
}

