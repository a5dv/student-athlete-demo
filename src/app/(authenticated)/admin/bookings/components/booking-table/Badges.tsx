import { Badge } from '@/components/ui/badge';
import { BookingStatus, PaymentStatus, PaymentMethod } from '@prisma/client';

export function getStatusBadge(status: BookingStatus) {
  switch (status) {
    case 'PENDING':
      return <Badge className="bg-yellow-500">Pending</Badge>;
    case 'CONFIRMED':
      return <Badge className="bg-blue-500">Confirmed</Badge>;
    case 'COMPLETED':
      return <Badge className="bg-green-500">Completed</Badge>;
    case 'CANCELLED':
      return <Badge className="bg-red-500">Cancelled</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
}

export function getPaymentStatusBadge(status: PaymentStatus) {
  switch (status) {
    case 'PAID':
      return <Badge className="bg-green-500">Paid</Badge>;
    case 'PENDING':
      return <Badge className="bg-yellow-500">Pending</Badge>;
    case 'REFUNDED':
      return <Badge className="bg-blue-500">Refunded</Badge>;
    case 'CANCELLED':
      return <Badge className="bg-red-500">Cancelled</Badge>;
    case 'FAILED':
      return <Badge className="bg-red-700">Failed</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
}

export function getPaymentMethodBadge(method: PaymentMethod | null) {
  if (!method) return null;

  switch (method) {
    case 'CREDIT_CARD':
      return <Badge className="bg-purple-500">Credit Card</Badge>;
    case 'PAYPAL':
      return <Badge className="bg-blue-600">PayPal</Badge>;
    case 'BANK_TRANSFER':
      return <Badge className="bg-green-600">Bank Transfer</Badge>;
    case 'ADMIN_MANUAL':
      return <Badge className="bg-gray-600">Manual</Badge>;
    default:
      return <Badge>{method}</Badge>;
  }
}
