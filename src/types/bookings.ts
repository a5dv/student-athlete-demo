import { Booking, User, BookingStatus, Category, PaymentMethod, PaymentStatus } from "@prisma/client"
import { PaginationOptions, PaginatedResult } from "./common/pagination"

export type BookingWithRelations = Booking & {
  client: User;
  provider: User;
};

export interface BookingFilters {
  search?: string;
  status?: BookingStatus;
  category?: Category;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
}

// Re-export if needed for backward compatibility
export type { PaginationOptions, PaginatedResult }