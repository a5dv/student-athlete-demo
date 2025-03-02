'use server'

import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { BookingFilters, PaginationOptions, PaginatedResult, BookingWithRelations } from "@/types/bookings"

/**
 * Get bookings with pagination and filters
 */
export async function getBookings(
  filters: BookingFilters = {},
  pagination: PaginationOptions = { page: 1, perPage: 15 }
): Promise<PaginatedResult<BookingWithRelations>> {
  try {
    // Validate and normalize pagination
    const page = Math.max(1, pagination.page)
    const perPage = Math.min(Math.max(pagination.perPage, 15), 50)
    const skip = (page - 1) * perPage
    
    // Build where clause based on filters
    const where: Prisma.BookingWhereInput = {}
    const { search, status, category, paymentMethod, paymentStatus } = filters
    
    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { client: { name: { contains: search, mode: 'insensitive' } } },
        { provider: { name: { contains: search, mode: 'insensitive' } } },
      ]
    }
    
    if (status) where.status = status
    if (category) where.category = category
    if (paymentMethod) where.paymentMethod = paymentMethod
    if (paymentStatus) where.paymentStatus = paymentStatus

    // Count total records for pagination
    const total = await prisma.booking.count({ where })
    const totalPages = Math.ceil(total / perPage)

    // Get bookings with filters and pagination
    const data = await prisma.booking.findMany({
      where,
      include: {
        client: true,
        provider: true,
      },
      skip,
      take: perPage,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return {
      data,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        perPage,
      }
    }
  } catch (error) {
    console.error("Error fetching bookings:", error)
    throw new Error("Failed to fetch bookings")
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
      },
    })
    
    return booking
  } catch (error) {
    console.error(`Error fetching booking ${id}:`, error)
    throw new Error(`Failed to fetch booking ${id}`)
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
      paidBookings
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'PENDING' } }),
      prisma.booking.count({ where: { status: 'CONFIRMED' } }),
      prisma.booking.count({ where: { status: 'COMPLETED' } }),
      prisma.booking.count({ where: { status: 'CANCELLED' } }),
      prisma.booking.count({ where: { paymentStatus: 'PENDING' } }),
      prisma.booking.count({ where: { paymentStatus: 'PAID' } }),
    ])

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
      }
    }
  } catch (error) {
    console.error("Error fetching booking stats:", error)
    throw new Error("Failed to fetch booking statistics")
  }
}