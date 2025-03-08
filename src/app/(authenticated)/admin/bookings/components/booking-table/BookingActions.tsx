'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { BookingStatus, PaymentStatus } from '@prisma/client';
import { Eye, MoreHorizontal, CreditCard, Calendar } from 'lucide-react';

interface BookingActionsProps {
  bookingId: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => Promise<void>;
  updatePaymentStatus: (bookingId: string, status: PaymentStatus) => Promise<void>;
}

export function BookingActions({
  bookingId,
  status,
  paymentStatus,
  updateBookingStatus,
  updatePaymentStatus,
}: BookingActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => (window.location.href = `/bookings/${bookingId}`)}>
          <Eye className="mr-2 h-4 w-4" /> View Details
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Calendar className="mr-2 h-4 w-4" /> Update Status
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem
              onClick={() => updateBookingStatus(bookingId, 'PENDING')}
              disabled={status === 'PENDING'}
            >
              Mark as Pending
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => updateBookingStatus(bookingId, 'CONFIRMED')}
              disabled={status === 'CONFIRMED'}
            >
              Mark as Confirmed
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => updateBookingStatus(bookingId, 'COMPLETED')}
              disabled={status === 'COMPLETED'}
            >
              Mark as Completed
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => updateBookingStatus(bookingId, 'CANCELLED')}
              disabled={status === 'CANCELLED'}
            >
              Mark as Cancelled
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <CreditCard className="mr-2 h-4 w-4" /> Update Payment
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem
              onClick={() => updatePaymentStatus(bookingId, 'PAID')}
              disabled={paymentStatus === 'PAID'}
            >
              Mark as Paid
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => updatePaymentStatus(bookingId, 'PENDING')}
              disabled={paymentStatus === 'PENDING'}
            >
              Mark as Pending
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => updatePaymentStatus(bookingId, 'REFUNDED')}
              disabled={paymentStatus === 'REFUNDED'}
            >
              Mark as Refunded
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => updatePaymentStatus(bookingId, 'CANCELLED')}
              disabled={paymentStatus === 'CANCELLED'}
            >
              Mark as Cancelled
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => updatePaymentStatus(bookingId, 'FAILED')}
              disabled={paymentStatus === 'FAILED'}
            >
              Mark as Failed
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
