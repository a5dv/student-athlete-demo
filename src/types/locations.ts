import { LocationStatus, LocationApprovalStatus } from '@prisma/client';
import { PaginationOptions, PaginatedResult } from './common/pagination';
import { z } from 'zod';

export interface LocationFilters {
  search?: string;
  status?: LocationStatus;
  approvalStatus?: LocationApprovalStatus;
  state?: string;
  country?: string;
  minCapacity?: number;
  maxCapacity?: number;
}

export const locationSchema = z.object({
  zipCode: z.string().min(1, 'Zip code is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  capacity: z.number().int().min(1, 'Capacity must be at least 1'),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  approvalStatus: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
});

export type LocationFormValues = z.infer<typeof locationSchema>;

// Re-export if needed for backward compatibility
export type { PaginationOptions, PaginatedResult };
