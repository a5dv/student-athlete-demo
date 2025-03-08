import { z } from 'zod';
import { CategoryStatus } from '@prisma/client';

// Validation schema for category form
export const categorySchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    description: z.string().optional(),
    minDurationInMinutes: z.coerce.number().min(1, 'Minimum duration must be at least 1 minute'),
    maxDurationInMinutes: z.coerce.number().min(1, 'Maximum duration must be at least 1 minute'),
    minClients: z.coerce.number().min(1, 'Minimum clients must be at least 1'),
    maxClients: z.coerce.number().min(1, 'Maximum clients must be at least 1'),
    status: z.nativeEnum(CategoryStatus),
  })
  .refine((data) => data.maxDurationInMinutes >= data.minDurationInMinutes, {
    message: 'Maximum duration must be greater than or equal to minimum duration',
    path: ['maxDurationInMinutes'],
  })
  .refine((data) => data.maxClients >= data.minClients, {
    message: 'Maximum clients must be greater than or equal to minimum clients',
    path: ['maxClients'],
  });

// Form values type
export type CategoryFormValues = z.infer<typeof categorySchema>;

// Server response type
export interface CategoryResponse {
  success: boolean;
  category?: {
    id: string;
    name: string;
    description?: string;
    minDurationInMinutes: number;
    maxDurationInMinutes: number;
    minClients: number;
    maxClients: number;
    status: CategoryStatus;
    createdAt: Date;
    updatedAt: Date;
  };
  error?: string;
}

// Filter type
export interface CategoryFilter {
  search?: string;
  status?: CategoryStatus | 'ALL';
  minDuration?: number;
  maxDuration?: number;
  minCapacity?: number;
  maxCapacity?: number;
  page: number;
  perPage: number;
}
