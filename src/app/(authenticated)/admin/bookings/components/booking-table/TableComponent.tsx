import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { format } from 'date-fns';

import { BookingStatus, PaymentStatus } from '@prisma/client';
import { BookingWithRelations } from '@/types/bookings';
import { getStatusBadge, getPaymentStatusBadge, getPaymentMethodBadge } from './Badges';
import { BookingActions } from './BookingActions';

interface TableComponentProps {
  bookings: BookingWithRelations[];
  updateBookingStatus: (bookingId: string, status: BookingStatus) => Promise<void>;
  updatePaymentStatus: (bookingId: string, paymentStatus: PaymentStatus) => Promise<void>;
}

export function TableComponent({
  bookings,
  updateBookingStatus,
  updatePaymentStatus,
}: TableComponentProps) {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                No bookings found.
              </TableCell>
            </TableRow>
          ) : (
            bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">{booking.id.substring(0, 8)}</TableCell>
                <TableCell>{booking.client.name}</TableCell>
                <TableCell>{booking.provider.name}</TableCell>
                <TableCell>
                  {booking.dateTime ? format(new Date(booking.dateTime), 'MMM dd, yyyy') : 'N/A'}
                </TableCell>
                <TableCell>{booking.category.name}</TableCell>
                <TableCell>
                  <div className="flex flex-col text-xs">
                    <span>{booking.location.city}</span>
                    <span className="text-muted-foreground">
                      {booking.location.address.substring(0, 15)}
                      {booking.location.address.length > 15 ? '...' : ''}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(booking.status)}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {getPaymentMethodBadge(booking.paymentMethod)}
                    {getPaymentStatusBadge(booking.paymentStatus)}
                  </div>
                </TableCell>
                <TableCell>
                  <BookingActions
                    bookingId={booking.id}
                    status={booking.status}
                    paymentStatus={booking.paymentStatus}
                    updateBookingStatus={updateBookingStatus}
                    updatePaymentStatus={updatePaymentStatus}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
