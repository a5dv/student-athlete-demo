import { Suspense } from 'react';
import { getCategories } from '@/services/categories/queries';
import { CategoriesContent } from './components/CategoriesContent';
import { Skeleton } from '@/components/ui/skeleton';
import { Metadata } from 'next';
import { CategoryStatus } from '@prisma/client';

export const metadata: Metadata = {
  title: 'Admin | Category Management',
  description: 'View and manage training categories',
};

// Main page with search params
export default async function CategoriesPage({
  searchParams: asyncSearchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await asyncSearchParams;

  // Default values

  const page = Number(searchParams.page) || 1;
  const perPage = Number(searchParams.per_page) || 15;

  // Build filters
  const filters = {
    search: (searchParams.search as string) || '',
    status: searchParams.status as CategoryStatus,
    minDuration: searchParams.min_duration
      ? Number(searchParams.min_duration as string)
      : undefined,
    maxDuration: searchParams.max_duration
      ? Number(searchParams.max_duration as string)
      : undefined,
    minCapacity: searchParams.min_capacity
      ? Number(searchParams.min_capacity as string)
      : undefined,
    maxCapacity: searchParams.max_capacity
      ? Number(searchParams.max_capacity as string)
      : undefined,
  };

  // Fetch categories with pagination and filters
  const { data: categories, pagination } = await getCategories(filters, { page, perPage });

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <p className="text-sm text-muted-foreground">Manage your training categories</p>
      </div>

      <Suspense fallback={<CategoriesTableSkeleton />}>
        <CategoriesContent
          initialCategories={categories}
          initialPagination={pagination}
          initialFilters={filters}
        />
      </Suspense>
    </div>
  );
}

function CategoriesTableSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
