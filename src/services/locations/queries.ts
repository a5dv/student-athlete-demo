'use server';

import { prisma } from '@/lib/prisma';
import { Prisma, SessionLocation } from '@prisma/client';
import { LocationFilters, PaginationOptions, PaginatedResult } from '@/types/locations';

export async function getLocations(
  filters: LocationFilters = {},
  pagination: PaginationOptions = { page: 1, perPage: 15 }
): Promise<PaginatedResult<SessionLocation>> {
  const page = Math.max(1, pagination.page);
  const perPage = Math.min(Math.max(pagination.perPage, 15), 50);
  const skip = (page - 1) * perPage;

  // Build where clause
  const where: Prisma.SessionLocationWhereInput = {
    deletedAt: null, // Only include non-deleted locations
  };

  const { search, status, approvalStatus, state, country, minCapacity, maxCapacity } = filters;

  if (search) {
    where.OR = [
      { address: { contains: search, mode: 'insensitive' } },
      { city: { contains: search, mode: 'insensitive' } },
      { state: { contains: search, mode: 'insensitive' } },
      { zipCode: { contains: search, mode: 'insensitive' } },
      { country: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (status) where.status = status;
  if (approvalStatus) where.approvalStatus = approvalStatus;
  if (state) where.state = { contains: state, mode: 'insensitive' };
  if (country) where.country = { contains: country, mode: 'insensitive' };

  if (minCapacity !== undefined || maxCapacity !== undefined) {
    where.capacity = {};
    if (minCapacity !== undefined) where.capacity.gte = minCapacity;
    if (maxCapacity !== undefined) where.capacity.lte = maxCapacity;
  }

  // Count total records for pagination
  const total = await prisma.sessionLocation.count({ where });
  const totalPages = Math.ceil(total / perPage);

  // Get locations with filters and pagination
  const data = await prisma.sessionLocation.findMany({
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
export async function getLocationById(id: string): Promise<SessionLocation | null> {
  return prisma.sessionLocation.findUnique({
    where: { id },
  });
}

export async function getCountries(): Promise<string[]> {
  const countries = await prisma.sessionLocation.findMany({
    select: {
      country: true,
    },
    distinct: ['country'],
    where: {
      deletedAt: null,
    },
    orderBy: {
      country: 'asc',
    },
  });

  return countries.map((c) => c.country);
}

export async function getStates(country?: string): Promise<string[]> {
  const statesQuery = {
    select: {
      state: true,
    },
    distinct: [Prisma.SessionLocationScalarFieldEnum.state],
    where: {
      deletedAt: null,
      ...(country ? { country } : {}),
    },
    orderBy: {
      state: 'asc',
    },
  };

  const states = await prisma.sessionLocation.findMany(statesQuery);
  return states.map((s) => s.state);
}
