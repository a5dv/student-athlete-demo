import {
  Booking,
  User,
  BookingStatus,
  PaymentMethod,
  PaymentStatus,
  Category,
  SessionLocation,
  TimeSlot,
} from '@prisma/client';
import { PaginationOptions, PaginatedResult } from './common/pagination';

export type BookingWithRelations = Booking & {
  client: User;
  provider: User;
  category: Category;
  location: SessionLocation;
  timeslot: TimeSlot;
};

export interface BookingFilters {
  search?: string;
  status?: BookingStatus;
  categoryId?: string;
  locationId?: string;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  startDate?: Date;
  endDate?: Date;
}

// Re-export if needed for backward compatibility
export type { PaginationOptions, PaginatedResult };
