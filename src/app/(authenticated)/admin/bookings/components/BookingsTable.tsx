'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { BookingStatus, PaymentStatus, PaymentMethod } from '@prisma/client';
import { toast } from 'sonner';

import { SearchFilters } from './booking-table/SearchFilters';
import { TableComponent } from './booking-table/TableComponent';
import { PaginationControls } from './booking-table/PaginationControls';
import { getBookings } from '@/services/bookings/queries';
import { updateBookingStatus, updateBookingPaymentStatus } from '@/services/bookings/mutations';
import { BookingWithRelations } from '@/types/bookings';

interface BookingsTableProps {
  initialData: BookingWithRelations[];
  totalPages: number;
  currentPage: number;
  perPage: number;
}

export default function BookingsTable({
  initialData,
  totalPages,
  currentPage,
  perPage,
}: BookingsTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize state from URL parameters
  const [bookings, setBookings] = useState<BookingWithRelations[]>(initialData);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('categoryId') || '');
  const [locationFilter, setLocationFilter] = useState(searchParams.get('locationId') || '');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState(
    searchParams.get('paymentMethod') || ''
  );
  const [paymentStatusFilter, setPaymentStatusFilter] = useState(
    searchParams.get('paymentStatus') || ''
  );
  const [startDate, setStartDate] = useState<Date | undefined>(
    searchParams.get('startDate') ? new Date(searchParams.get('startDate') as string) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    searchParams.get('endDate') ? new Date(searchParams.get('endDate') as string) : undefined
  );
  const [loading, setLoading] = useState(false);

  // Update local state when search params change
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setStatusFilter(searchParams.get('status') || '');
    setCategoryFilter(searchParams.get('categoryId') || '');
    setLocationFilter(searchParams.get('locationId') || '');
    setPaymentMethodFilter(searchParams.get('paymentMethod') || '');
    setPaymentStatusFilter(searchParams.get('paymentStatus') || '');
    setStartDate(
      searchParams.get('startDate') ? new Date(searchParams.get('startDate') as string) : undefined
    );
    setEndDate(
      searchParams.get('endDate') ? new Date(searchParams.get('endDate') as string) : undefined
    );
  }, [searchParams]);

  // Fetch data when search params change
  useEffect(() => {
    const fetchFilteredData = async () => {
      setLoading(true);
      try {
        // Convert URL parameters to service function parameters
        const page = parseInt(searchParams.get('page') || '1', 10);
        const itemsPerPage = parseInt(searchParams.get('perPage') || '15', 10);

        // Build filters from URL parameters
        const filters = {
          search: searchParams.get('search') || undefined,
          status: (searchParams.get('status') as BookingStatus) || undefined,
          categoryId: searchParams.get('categoryId') || undefined,
          locationId: searchParams.get('locationId') || undefined,
          paymentMethod: (searchParams.get('paymentMethod') as PaymentMethod) || undefined,
          paymentStatus: (searchParams.get('paymentStatus') as PaymentStatus) || undefined,
          startDate: searchParams.get('startDate')
            ? new Date(searchParams.get('startDate') as string)
            : undefined,
          endDate: searchParams.get('endDate')
            ? new Date(searchParams.get('endDate') as string)
            : undefined,
        };

        // Use the service function instead of fetch
        const result = await getBookings(filters, { page, perPage: itemsPerPage });
        setBookings(result.data);
      } catch (error) {
        console.error('Error fetching filtered bookings:', error);
        toast.error('Failed to fetch filtered bookings');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we have search params (skip on initial load since we have initialData)
    if (searchParams.toString()) {
      fetchFilteredData();
    }
  }, [searchParams]);

  // URL query management
  const createQueryString = (params: Record<string, string | null>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === '') {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, value);
      }
    });

    return newSearchParams.toString();
  };

  // Apply filters
  const applyFilters = () => {
    const queryParams: Record<string, string | null> = {
      search: search || null,
      status: statusFilter || null,
      categoryId: categoryFilter || null,
      locationId: locationFilter || null,
      paymentMethod: paymentMethodFilter || null,
      paymentStatus: paymentStatusFilter || null,
      page: '1', // Reset to first page when filters change
      perPage: perPage.toString(),
    };

    // Add date filters if set
    if (startDate) {
      queryParams.startDate = startDate.toISOString();
    }
    if (endDate) {
      queryParams.endDate = endDate.toISOString();
    }

    router.push(`${pathname}?${createQueryString(queryParams)}`);
  };

  // Handle pagination change
  const handlePageChange = (page: number) => {
    router.push(
      `${pathname}?${createQueryString({
        page: page.toString(),
        perPage: perPage.toString(),
      })}`
    );
  };

  // Handle per page change
  const handlePerPageChange = (value: string) => {
    router.push(
      `${pathname}?${createQueryString({
        page: '1', // Reset to first page
        perPage: value,
      })}`
    );
  };

  // Handle status update
  const handleBookingStatusUpdate = async (bookingId: string, status: BookingStatus) => {
    try {
      // Use the service function instead of fetch
      const updatedBooking = await updateBookingStatus(bookingId, status);

      // Update the local state
      setBookings(
        bookings.map((booking) => (booking.id === updatedBooking.id ? updatedBooking : booking))
      );

      toast.success(`Booking status updated to ${status}`);
    } catch (error) {
      toast.error('Failed to update booking status');
      console.error(error);
    }
  };

  // Handle payment status update
  const handlePaymentStatusUpdate = async (bookingId: string, paymentStatus: PaymentStatus) => {
    try {
      // Use the service function instead of fetch
      const updatedBooking = await updateBookingPaymentStatus(bookingId, paymentStatus);

      // Update the local state
      setBookings(
        bookings.map((booking) => (booking.id === updatedBooking.id ? updatedBooking : booking))
      );

      toast.success(`Payment status updated to ${paymentStatus}`);
    } catch (error) {
      toast.error('Failed to update payment status');
      console.error(error);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setCategoryFilter('');
    setLocationFilter('');
    setPaymentMethodFilter('');
    setPaymentStatusFilter('');
    setStartDate(undefined);
    setEndDate(undefined);
    router.push(pathname);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters Component */}
      <SearchFilters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
        paymentMethodFilter={paymentMethodFilter}
        setPaymentMethodFilter={setPaymentMethodFilter}
        paymentStatusFilter={paymentStatusFilter}
        setPaymentStatusFilter={setPaymentStatusFilter}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        applyFilters={applyFilters}
        clearFilters={clearFilters}
      />

      {/* Table Component */}
      {loading ? (
        <div className="flex justify-center p-4">Loading bookings...</div>
      ) : (
        <TableComponent
          bookings={bookings}
          updateBookingStatus={handleBookingStatusUpdate}
          updatePaymentStatus={handlePaymentStatusUpdate}
        />
      )}

      {/* Pagination Controls */}
      <PaginationControls
        totalItems={totalPages * perPage}
        currentPage={currentPage}
        perPage={perPage}
        totalPages={totalPages}
        itemCount={bookings.length}
        handlePageChange={handlePageChange}
        handlePerPageChange={handlePerPageChange}
      />
    </div>
  );
}
