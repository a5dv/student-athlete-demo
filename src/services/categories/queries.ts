'use server';

import { prisma } from '@/lib/prisma';
import { Prisma, Category, CategoryStatus } from '@prisma/client';
import { PaginationOptions, PaginatedResult } from '@/types/common/pagination';

export interface CategoryFilters {
  search?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  minDuration?: number;
  maxDuration?: number;
  minCapacity?: number;
  maxCapacity?: number;
}

export async function getCategories(
  filters: CategoryFilters = {},
  pagination: PaginationOptions = { page: 1, perPage: 15 }
): Promise<PaginatedResult<Category>> {
  const page = Math.max(1, pagination.page);
  const perPage = Math.min(Math.max(pagination.perPage, 15), 50);
  const skip = (page - 1) * perPage;

  // Build where clause
  const where: Prisma.CategoryWhereInput = {};
  const { search, status, minDuration, maxDuration, minCapacity, maxCapacity } = filters;

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (status) where.status = status;

  if (minDuration) where.minDurationInMinutes = { gte: minDuration };
  if (maxDuration) where.maxDurationInMinutes = { lte: maxDuration };

  if (minCapacity) where.minClients = { gte: minCapacity };
  if (maxCapacity) where.maxClients = { lte: maxCapacity };

  // Count total records for pagination
  const total = await prisma.category.count({ where });
  const totalPages = Math.ceil(total / perPage);

  // Get categories with filters and pagination
  const data = await prisma.category.findMany({
    where,
    skip,
    take: perPage,
    orderBy: {
      createdAt: 'desc',
    },
  });

  return {
    data,
    pagination: {
      total,
      totalPages,
      currentPage: page,
      perPage,
    },
  };
}

export async function getCategoryById(id: string): Promise<Category | null> {
  return prisma.category.findUnique({
    where: { id },
  });
}

export async function getCategoryStatuses() {
  return Object.values(CategoryStatus);
}
