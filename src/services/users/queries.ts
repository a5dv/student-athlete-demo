'use server';

import { prisma } from '@/lib/prisma';
import { Prisma, User } from '@prisma/client';
import { UserFilters, PaginationOptions, PaginatedResult } from '@/types/users';

export async function getUsers(
  filters: UserFilters = {},
  pagination: PaginationOptions = { page: 1, perPage: 15 }
): Promise<PaginatedResult<User>> {
  const page = Math.max(1, pagination.page);
  const perPage = Math.min(Math.max(pagination.perPage, 15), 50);
  const skip = (page - 1) * perPage;

  // Build where clause
  const where: Prisma.UserWhereInput = {};
  const { search, status, role } = filters;

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (status) where.status = status;
  if (role) where.role = role;

  // Count total records for pagination
  const total = await prisma.user.count({ where });
  const totalPages = Math.ceil(total / perPage);

  // Get users with filters and pagination
  const data = await prisma.user.findMany({
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
      perPage: perPage,
    },
  };
}

export async function getUserById(id: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { id },
  });
}
