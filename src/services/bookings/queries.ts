'use server';

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import {
  BookingFilters,
  PaginationOptions,
  PaginatedResult,
  BookingWithRelations,
} from '@/types/bookings';

/**
 * Get bookings with pagination and filters
 */
export async function getBookings(
  filters: BookingFilters = {},
  pagination: PaginationOptions = { page: 1, perPage: 15 }
): Promise<PaginatedResult<BookingWithRelations>> {
  try {
    // Validate and normalize pagination
    const page = Math.max(1, pagination.page);
    const perPage = Math.min(Math.max(pagination.perPage, 15), 50);
    const skip = (page - 1) * perPage;

    // Build where clause based on filters
    const where: Prisma.BookingWhereInput = {
      deletedAt: null, // Only include non-deleted bookings
    };

    const {
      search,
      status,
      categoryId,
      locationId,
      paymentMethod,
      paymentStatus,
      startDate,
      endDate,
    } = filters;

    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { client: { name: { contains: search, mode: 'insensitive' } } },
        { provider: { name: { contains: search, mode: 'insensitive' } } },
        { category: { name: { contains: search, mode: 'insensitive' } } },
        { location: { address: { contains: search, mode: 'insensitive' } } },
        { location: { city: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (status) where.status = status;
    if (categoryId) where.categoryId = categoryId;
    if (locationId) where.locationId = locationId;
    if (paymentMethod) where.paymentMethod = paymentMethod;
    if (paymentStatus) where.paymentStatus = paymentStatus;

    // Date range filter
    if (startDate || endDate) {
      where.dateTime = {};
      if (startDate) where.dateTime.gte = startDate;
      if (endDate) where.dateTime.lte = endDate;
    }

    // Count total records for pagination
    const total = await prisma.booking.count({ where });
    const totalPages = Math.ceil(total / perPage);

    // Get bookings with filters and pagination
    const data = await prisma.booking.findMany({
      where,
      include: {
        client: true,
        provider: true,
        category: true,
        location: true,
        timeslot: true,
      },
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
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw new Error('Failed to fetch bookings');
  }
}

/**
 * Get a single booking by id with all relations
 */
export async function getBookingById(id: string): Promise<BookingWithRelations | null> {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        client: true,
        provider: true,
        category: true,
        location: true,
        timeslot: true,
      },
    });

    return booking;
  } catch (error) {
    console.error(`Error fetching booking ${id}:`, error);
    throw new Error(`Failed to fetch booking ${id}`);
  }
}

/**
 * Get booking statistics
 */
export async function getBookingStats() {
  try {
    const [
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      pendingPayments,
      paidBookings,
    ] = await Promise.all([
      prisma.booking.count({ where: { deletedAt: null } }),
      prisma.booking.count({ where: { status: 'PENDING', deletedAt: null } }),
      prisma.booking.count({ where: { status: 'CONFIRMED', deletedAt: null } }),
      prisma.booking.count({ where: { status: 'COMPLETED', deletedAt: null } }),
      prisma.booking.count({ where: { status: 'CANCELLED', deletedAt: null } }),
      prisma.booking.count({ where: { paymentStatus: 'PENDING', deletedAt: null } }),
      prisma.booking.count({ where: { paymentStatus: 'PAID', deletedAt: null } }),
    ]);

    return {
      totalBookings,
      statusCounts: {
        pending: pendingBookings,
        confirmed: confirmedBookings,
        completed: completedBookings,
        cancelled: cancelledBookings,
      },
      paymentCounts: {
        pending: pendingPayments,
        paid: paidBookings,
      },
    };
  } catch (error) {
    console.error('Error fetching booking stats:', error);
    throw new Error('Failed to fetch booking statistics');
  }
}

/**
 * Get all categories for dropdown filters
 */
export async function getCategories() {
  try {
    return await prisma.category.findMany({
      where: { status: 'ACTIVE', deletedAt: null },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }
}

/**
 * Get all locations for dropdown filters
 */
export async function getLocations() {
  try {
    return await prisma.sessionLocation.findMany({
      where: { status: 'ACTIVE', approvalStatus: 'APPROVED', deletedAt: null },
      select: { id: true, address: true, city: true, state: true },
      orderBy: { city: 'asc' },
    });
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw new Error('Failed to fetch locations');
  }
}
