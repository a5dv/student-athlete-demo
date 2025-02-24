/* eslint-disable @typescript-eslint/no-unused-vars */
// TODO: remove unused variables
"use client"

import { useState } from "react"
import type { Booking, User } from "@prisma/client"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

type BookingWithUsers = Booking & {
  client: User
  provider: User
}

interface ManualPaymentTableProps {
  initialData: BookingWithUsers[]
}

export function ManualPaymentTable({ initialData }: ManualPaymentTableProps) {
  const [data, _setData] = useState(initialData)
  const [search, setSearch] = useState("")
  const [_filters, _setFilters] = useState({})
  const [_dateFilters, _setDateFilters] = useState({})
  const [pageSize, setPageSize] = useState(15)
  const [selectedBookings, setSelectedBookings] = useState<string[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"PAID" | "PENDING" | "FAILED">("PAID")
  const router = useRouter()

  // Implement search, filter, and pagination logic here

  const handleManualPayment = async () => {
    // Implement manual payment logic here
    setIsModalOpen(false)
    router.refresh()
  }

  return (
    <div>
      <div className="flex space-x-2 mb-4">
        <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
        {/* Add filter dropdowns here */}
        {/* Add date pickers here */}
        <Select value={pageSize.toString()} onValueChange={(value:string) => setPageSize(Number(value))}>
          <option value="15">15 per page</option>
          <option value="50">50 per page</option>
        </Select>
        <Button disabled={selectedBookings.length === 0} onClick={() => setIsModalOpen(true)}>
          Manual Payment
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Select</TableHead>
            <TableHead>Booking ID</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Creation Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>
                <Checkbox
                  checked={selectedBookings.includes(booking.id)}
                  onCheckedChange={(checked: boolean) => {
                    if (checked) {
                      setSelectedBookings([...selectedBookings, booking.id])
                    } else {
                      setSelectedBookings(selectedBookings.filter((id) => id !== booking.id))
                    }
                  }}
                />
              </TableCell>
              <TableCell>{booking.id}</TableCell>
              <TableCell>{booking.client.name}</TableCell>
              <TableCell>{booking.provider.name}</TableCell>
              <TableCell>{booking.location}</TableCell>
              <TableCell>{booking.category}</TableCell>
              <TableCell>{booking.dateTime.toLocaleString()}</TableCell>
              <TableCell>{booking.price}</TableCell>
              <TableCell>{booking.createdAt.toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Add pagination controls here */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manual Payment</DialogTitle>
          </DialogHeader>
          <div>
            <h3>Selected Bookings:</h3>
            <ul>
              {selectedBookings.map((id) => (
                <li key={id}>{id}</li>
              ))}
            </ul>
            <div className="mt-4">
              <label>Payment Method:</label>
              <Input value="ADMIN:MANUAL" disabled />
            </div>
            <div className="mt-4">
              <label>Payment Status:</label>
              <Select
                value={paymentStatus}
                onValueChange={(value: "PAID" | "PENDING" | "FAILED") => setPaymentStatus(value)}
              >
                <option value="PAID">Paid</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleManualPayment}>Confirm Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}