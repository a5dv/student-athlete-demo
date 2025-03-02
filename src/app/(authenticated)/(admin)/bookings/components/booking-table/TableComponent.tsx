import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { BookingStatus, PaymentStatus, User, Booking } from "@prisma/client";

type BookingWithRelations = Booking & {
  client: User;
  provider: User;
};

interface TableComponentProps {
  bookings: BookingWithRelations[]; // Bookings with included relations
  updateBookingStatus: (bookingId: string, status: BookingStatus) => Promise<void>;
  updatePaymentStatus: (bookingId: string, paymentStatus: PaymentStatus) => Promise<void>;
}

export function TableComponent({
  bookings,
  updateBookingStatus,
  updatePaymentStatus,
}: TableComponentProps) {
  // Map status to badge variant
  const getStatusBadgeVariant = (status: BookingStatus) => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "CONFIRMED":
        return "success";
      case "COMPLETED":
        return "default";
      case "CANCELLED":
        return "destructive";
      default:
        return "secondary";
    }
  };

  // Map payment status to badge variant
  const getPaymentStatusBadgeVariant = (status: PaymentStatus) => {
    switch (status) {
      case "PAID":
        return "success";
      case "PENDING":
        return "warning";
      case "REFUNDED":
        return "secondary";
      case "CANCELLED":
        return "destructive";
      default:
        return "outline";
    }
  };

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
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
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
                  {booking.dateTime 
                    ? format(new Date(booking.dateTime), "MMM dd, yyyy")
                    : "N/A"}
                </TableCell>
                <TableCell>{booking.category || "N/A"}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(booking.status) as "default" | "destructive" | "secondary" | "outline"}>
                    {booking.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="text-xs text-muted-foreground">{booking.paymentMethod}</div>
                    <Badge variant={getPaymentStatusBadgeVariant(booking.paymentStatus) as "default" | "destructive" | "secondary" | "outline"}>
                      {booking.paymentStatus}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => window.location.href = `/bookings/${booking.id}`}
                      >
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="w-full text-left px-2 py-1.5 text-sm">
                          <div className="flex items-center justify-between">
                            <span>Update Status</span>
                            <ChevronDown className="h-4 w-4" />
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {Object.values(BookingStatus).map((status) => (
                            <DropdownMenuItem 
                              key={status}
                              onClick={() => updateBookingStatus(booking.id, status)}
                            >
                              {status}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="w-full text-left px-2 py-1.5 text-sm">
                          <div className="flex items-center justify-between">
                            <span>Update Payment</span>
                            <ChevronDown className="h-4 w-4" />
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {Object.values(PaymentStatus).map((status) => (
                            <DropdownMenuItem 
                              key={status}
                              onClick={() => updatePaymentStatus(booking.id, status)}
                            >
                              {status}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
