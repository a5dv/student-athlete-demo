'use server'

import { prisma } from '@/lib/prisma'
import { BookingStatus, PaymentStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"

/**
 * Updates a booking's status
 * 
 * @param bookingId - The ID of the booking to update
 * @param status - The new booking status
 * @returns The updated booking
 */
export async function updateBookingStatus(bookingId: string, status: BookingStatus) {
  try {
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
      include: {
        client: true,
        provider: true,
      }
    })
    
    // Revalidate any pages that show bookings data
    revalidatePath('/bookings')
    revalidatePath(`/bookings/${bookingId}`)
    revalidatePath('/admin/bookings')
    
    return updatedBooking
  } catch (error) {
    console.error("Error updating booking status:", error)
    throw new Error("Failed to update booking status")
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
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { paymentStatus },
      include: {
        client: true,
        provider: true,
      }
    })
    
    // Revalidate any pages that show bookings data
    revalidatePath('/bookings')
    revalidatePath(`/bookings/${bookingId}`)
    revalidatePath('/admin/bookings')
    
    return updatedBooking
  } catch (error) {
    console.error("Error updating payment status:", error)
    throw new Error("Failed to update payment status")
  }
}
