'use server';

import { prisma } from '@/lib/prisma';
import { CategoryStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { CategoryFormValues } from '@/types/category';

export async function createCategory(data: CategoryFormValues) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized: Only admins can create categories');
  }

  try {
    const category = await prisma.category.create({
      data,
    });

    revalidatePath('/categories');

    return { success: true, category };
  } catch (error) {
    console.error('Failed to create category:', error);
    return { success: false, error: 'Failed to create category' };
  }
}

export async function updateCategory(categoryId: string, data: CategoryFormValues) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized: Only admins can update categories');
  }

  try {
    const category = await prisma.category.update({
      where: { id: categoryId },
      data,
    });

    revalidatePath('/categories');

    return { success: true, category };
  } catch (error) {
    console.error('Failed to update category:', error);
    return { success: false, error: 'Failed to update category' };
  }
}

export async function updateCategoryStatus(categoryId: string, status: CategoryStatus) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized: Only admins can update category status');
  }

  try {
    const category = await prisma.category.update({
      where: { id: categoryId },
      data: { status },
    });

    revalidatePath('/categories');

    return { success: true, category };
  } catch (error) {
    console.error('Failed to update category status:', error);
    return { success: false, error: 'Failed to update category status' };
  }
}

export async function deleteCategory(categoryId: string) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized: Only admins can delete categories');
  }

  try {
    // Soft delete by setting deletedAt
    const category = await prisma.category.update({
      where: { id: categoryId },
      data: {
        deletedAt: new Date(),
        status: 'INACTIVE',
      },
    });

    revalidatePath('/categories');

    return { success: true, category };
  } catch (error) {
    console.error('Failed to delete category:', error);
    return { success: false, error: 'Failed to delete category' };
  }
}
