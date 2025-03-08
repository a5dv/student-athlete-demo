import { Metadata } from 'next';
import BookingsTable from './components/BookingsTable';
import { BookingStatus, PaymentMethod, PaymentStatus } from '@prisma/client';
import { getBookings } from '@/services/bookings/queries';

export const metadata: Metadata = {
  title: 'Admin | Booking Management',
  description: 'Manage bookings and payment statuses',
};

export default async function BookingsPage({
  searchParams: asyncSearchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await asyncSearchParams;

  // Get pagination parameters
  const page = Number(searchParams.page) || 1;
  const perPage = Number(searchParams.perPage) || 15;

  // Get filters
  const search = searchParams.search as string | undefined;
  const status = searchParams.status as BookingStatus | undefined;
  const categoryId = searchParams.categoryId as string | undefined;
  const locationId = searchParams.locationId as string | undefined;
  const paymentMethod = searchParams.paymentMethod as PaymentMethod | undefined;
  const paymentStatus = searchParams.paymentStatus as PaymentStatus | undefined;

  // Parse date filters if present
  const startDate = searchParams.startDate ? new Date(searchParams.startDate as string) : undefined;
  const endDate = searchParams.endDate ? new Date(searchParams.endDate as string) : undefined;

  // Fetch bookings from service
  const filters = {
    search,
    status,
    categoryId,
    locationId,
    paymentMethod,
    paymentStatus,
    startDate,
    endDate,
  };

  const paginationOptions = {
    page,
    perPage,
  };

  const { data, pagination } = await getBookings(filters, paginationOptions);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Booking Management</h1>
        <p className="text-sm text-muted-foreground">
          Manage bookings, update booking statuses, and process payments
        </p>
      </div>

      <BookingsTable
        initialData={data}
        totalPages={pagination.totalPages}
        currentPage={pagination.currentPage}
        perPage={pagination.perPage}
      />
    </div>
  );
}
