import { Suspense } from 'react';
import { getLocations } from '@/services/locations/queries';
import { LocationsContent } from './components/LocationsContent';
import { Skeleton } from '@/components/ui/skeleton';
import { Metadata } from 'next';
import { LocationApprovalStatus, LocationStatus } from '@prisma/client';

export const metadata: Metadata = {
  title: 'Admin | Location Management',
  description: 'View and manage session locations',
};

// Main page with search params
export default async function LocationsPage({
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
    status: searchParams.status as LocationStatus,
    approvalStatus: searchParams.approval_status as LocationApprovalStatus,
    state: (searchParams.state as string) || '',
    country: (searchParams.country as string) || '',
    minCapacity: searchParams.min_capacity
      ? Number(searchParams.min_capacity as string)
      : undefined,
    maxCapacity: searchParams.max_capacity
      ? Number(searchParams.max_capacity as string)
      : undefined,
  };

  // Fetch locations with pagination and filters
  const { data: locations, pagination } = await getLocations(filters, { page, perPage });

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Location Management</h1>
        <p className="text-sm text-muted-foreground">
          Manage your location availability for your providers
        </p>
      </div>

      <Suspense fallback={<LocationsTableSkeleton />}>
        <LocationsContent
          initialLocations={locations}
          initialPagination={pagination}
          initialFilters={filters}
        />
      </Suspense>
    </div>
  );
}
function LocationsTableSkeleton() {
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
