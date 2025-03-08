'use server';

import { prisma } from '@/lib/prisma';
import { LocationStatus, LocationApprovalStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { LocationFormValues } from '@/types/locations';

export async function createLocation(data: LocationFormValues) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized: Only admins can create locations' };
  }

  try {
    const location = await prisma.sessionLocation.create({
      data: {
        zipCode: data.zipCode,
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
        capacity: data.capacity,
        status: data.status,
        approvalStatus: data.approvalStatus,
        ...(data.approvalStatus === 'APPROVED'
          ? {
              approvedAt: new Date(),
              approvedBy: session.user.id,
            }
          : {}),
      },
    });

    revalidatePath('/admin/locations');

    return { success: true, location };
  } catch (error) {
    console.error('Failed to create location:', error);
    return { success: false, error: 'Failed to create location' };
  }
}

export async function updateLocation(id: string, data: LocationFormValues) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized: Only admins can update locations' };
  }

  try {
    // If approvalStatus is being changed to APPROVED, update the approval information
    const approvalInfo =
      data.approvalStatus === 'APPROVED'
        ? { approvedAt: new Date(), approvedBy: session.user.id }
        : {};

    const location = await prisma.sessionLocation.update({
      where: { id },
      data: {
        zipCode: data.zipCode,
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
        capacity: data.capacity,
        status: data.status,
        approvalStatus: data.approvalStatus,
        ...approvalInfo,
      },
    });

    revalidatePath('/admin/locations');

    return { success: true, location };
  } catch (error) {
    console.error('Failed to update location:', error);
    return { success: false, error: 'Failed to update location' };
  }
}

export async function deleteLocation(id: string) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized: Only admins can delete locations' };
  }

  try {
    const location = await prisma.sessionLocation.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: 'INACTIVE',
      },
    });

    revalidatePath('/admin/locations');

    return { success: true, location };
  } catch (error) {
    console.error('Failed to delete location:', error);
    return { success: false, error: 'Failed to delete location' };
  }
}

export async function updateLocationStatus(locationId: string, status: LocationStatus) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized: Only admins can update location status');
  }

  try {
    const location = await prisma.sessionLocation.update({
      where: { id: locationId },
      data: { status },
    });

    revalidatePath('/admin/locations');

    return { success: true, location };
  } catch (error) {
    console.error('Failed to update location status:', error);
    return { success: false, error: 'Failed to update location status' };
  }
}

export async function updateLocationApprovalStatus(
  locationId: string,
  approvalStatus: LocationApprovalStatus
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized: Only admins can update location approval status');
  }

  try {
    // If new status is APPROVED, add approval metadata
    const approvalData =
      approvalStatus === 'APPROVED' ? { approvedAt: new Date(), approvedBy: session.user.id } : {};

    const location = await prisma.sessionLocation.update({
      where: { id: locationId },
      data: {
        approvalStatus,
        ...approvalData,
      },
    });

    revalidatePath('/admin/locations');

    return { success: true, location };
  } catch (error) {
    console.error('Failed to update location approval status:', error);
    return { success: false, error: 'Failed to update location approval status' };
  }
}
