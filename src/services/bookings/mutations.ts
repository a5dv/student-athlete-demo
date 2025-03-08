'use server';

import { prisma } from '@/lib/prisma';
import { BookingStatus, PaymentStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * Updates a booking's status
 *
 * @param bookingId - The ID of the booking to update
 * @param status - The new booking status
 * @returns The updated booking
 */
export async function updateBookingStatus(bookingId: string, status: BookingStatus) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      throw new Error('Unauthorized: Only admins can update booking status');
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status,
        // Update related time slot if status is CANCELLED
        ...(status === 'CANCELLED' && {
          timeslot: {
            update: {
              currentBookings: {
                decrement: 1,
              },
            },
          },
        }),
      },
      include: {
        client: true,
        provider: true,
        category: true,
        location: true,
        timeslot: true,
      },
    });

    // Revalidate any pages that show bookings data
    revalidatePath('/bookings');
    revalidatePath(`/bookings/${bookingId}`);
    revalidatePath('/admin/bookings');

    return updatedBooking;
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw new Error('Failed to update booking status');
  }
}

/**
 * Updates a booking's payment status
 *
 * @param bookingId - The ID of the booking to update
 * @param paymentStatus - The new payment status
 * @returns The updated booking
 */
export async function updateBookingPaymentStatus(bookingId: string, paymentStatus: PaymentStatus) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      throw new Error('Unauthorized: Only admins can update payment status');
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        paymentStatus,
        ...(paymentStatus === 'PAID' && {
          paymentDate: new Date(),
        }),
      },
      include: {
        client: true,
        provider: true,
        category: true,
        location: true,
        timeslot: true,
      },
    });

    // Revalidate any pages that show bookings data
    revalidatePath('/bookings');
    revalidatePath(`/bookings/${bookingId}`);
    revalidatePath('/admin/bookings');

    return updatedBooking;
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw new Error('Failed to update payment status');
  }
}

/**
 * Soft delete a booking
 */
export async function deleteBooking(bookingId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      throw new Error('Unauthorized: Only admins can delete bookings');
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { timeslot: true },
    });

    if (!booking) {
      throw new Error('Booking not found');
    }

    // Soft delete the booking
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        deletedAt: new Date(),
        // Decrement booking count in timeslot
        timeslot: {
          update: {
            currentBookings: {
              decrement: 1,
            },
          },
        },
      },
    });

    // Revalidate paths
    revalidatePath('/bookings');
    revalidatePath('/admin/bookings');

    return { success: true };
  } catch (error) {
    console.error('Error deleting booking:', error);
    return { success: false, error: 'Failed to delete booking' };
  }
}
