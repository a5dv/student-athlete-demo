'use client';

import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { CreateLocationForm } from './CreateLocationForm';
import { EditLocationForm } from './EditLocationForm';
import { DeleteLocationDialog } from './DeleteLocationDialog';
import { TableComponent } from './location-table/TableComponent';
import { SearchFilters } from './location-table/SearchFilters';
import { PaginationControls } from './location-table/PaginationControls';
import { SessionLocation, LocationStatus, LocationApprovalStatus } from '@prisma/client';
import { updateLocationStatus, updateLocationApprovalStatus } from '@/services/locations/mutations';
import { getLocations } from '@/services/locations/queries';
import { LocationFilters } from '@/types/locations';

interface LocationsContentProps {
  initialLocations: SessionLocation[];
  initialPagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
  };
  initialFilters: LocationFilters;
}

export function LocationsContent({
  initialLocations,
  initialPagination,
  initialFilters,
}: LocationsContentProps) {
  // Router and search params
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // State for locations and pagination
  const [locations, setLocations] = useState<SessionLocation[]>(initialLocations);
  const [pagination, setPagination] = useState(initialPagination);
  const [_isLoading, setIsLoading] = useState(false);

  // State for filters
  const [search, setSearch] = useState(initialFilters.search || '');
  const [statusFilter, setStatusFilter] = useState(initialFilters.status || '');
  const [approvalStatusFilter, setApprovalStatusFilter] = useState(
    initialFilters.approvalStatus || ''
  );
  const [stateFilter, setStateFilter] = useState(initialFilters.state || '');
  const [countryFilter, setCountryFilter] = useState(initialFilters.country || '');
  const [minCapacity, setMinCapacity] = useState<number | undefined>(initialFilters.minCapacity);
  const [maxCapacity, setMaxCapacity] = useState<number | undefined>(initialFilters.maxCapacity);

  // State for modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<SessionLocation | null>(null);

  // Function to update URL with current filters and pagination
  const updateUrlWithParams = useCallback(
    (
      newPage?: number,
      newPerPage?: number,
      newSearch?: string,
      newStatus?: string,
      newApprovalStatus?: string,
      newState?: string,
      newCountry?: string,
      newMinCapacity?: number | undefined,
      newMaxCapacity?: number | undefined
    ) => {
      const params = new URLSearchParams(searchParams.toString());

      // Update pagination params
      if (newPage !== undefined) params.set('page', newPage.toString());
      if (newPerPage !== undefined) params.set('per_page', newPerPage.toString());

      // Update filter params
      if (newSearch !== undefined) {
        if (newSearch) params.set('search', newSearch);
        else params.delete('search');
      }

      if (newStatus !== undefined) {
        if (newStatus) params.set('status', newStatus);
        else params.delete('status');
      }

      if (newApprovalStatus !== undefined) {
        if (newApprovalStatus) params.set('approval_status', newApprovalStatus);
        else params.delete('approval_status');
      }

      if (newState !== undefined) {
        if (newState) params.set('state', newState);
        else params.delete('state');
      }

      if (newCountry !== undefined) {
        if (newCountry) params.set('country', newCountry);
        else params.delete('country');
      }

      if (newMinCapacity !== undefined) {
        if (newMinCapacity) params.set('min_capacity', newMinCapacity.toString());
        else params.delete('min_capacity');
      }

      if (newMaxCapacity !== undefined) {
        if (newMaxCapacity) params.set('max_capacity', newMaxCapacity.toString());
        else params.delete('max_capacity');
      }

      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  // Function to fetch locations with updated filters
  const fetchLocations = useCallback(async () => {
    setIsLoading(true);
    try {
      const filters: LocationFilters = {
        search,
        status: statusFilter as LocationStatus,
        approvalStatus: approvalStatusFilter as LocationApprovalStatus,
        state: stateFilter,
        country: countryFilter,
        minCapacity,
        maxCapacity,
      };

      const result = await getLocations(filters, {
        page: pagination.currentPage,
        perPage: pagination.perPage,
      });

      setLocations(result.data);
      setPagination(result.pagination);
    } catch (error) {
      console.error('Failed to fetch locations:', error);
    } finally {
      setIsLoading(false);
    }
  }, [
    search,
    statusFilter,
    approvalStatusFilter,
    stateFilter,
    countryFilter,
    minCapacity,
    maxCapacity,
    pagination.currentPage,
    pagination.perPage,
  ]);

  // Handlers for filters
  const applyFilters = useCallback(() => {
    updateUrlWithParams(
      1, // Reset to first page when applying filters
      pagination.perPage,
      search,
      statusFilter,
      approvalStatusFilter,
      stateFilter,
      countryFilter,
      minCapacity,
      maxCapacity
    );
    fetchLocations();
  }, [
    updateUrlWithParams,
    pagination.perPage,
    search,
    statusFilter,
    approvalStatusFilter,
    stateFilter,
    countryFilter,
    minCapacity,
    maxCapacity,
    fetchLocations,
  ]);

  const clearFilters = useCallback(() => {
    setSearch('');
    setStatusFilter('');
    setApprovalStatusFilter('');
    setStateFilter('');
    setCountryFilter('');
    setMinCapacity(undefined);
    setMaxCapacity(undefined);

    updateUrlWithParams(1, pagination.perPage, '', '', '', '', '', undefined, undefined);
    fetchLocations();
  }, [updateUrlWithParams, pagination.perPage, fetchLocations]);

  // Handlers for pagination
  const handlePageChange = useCallback(
    (page: number) => {
      updateUrlWithParams(page);
      fetchLocations();
    },
    [updateUrlWithParams, fetchLocations]
  );

  const handlePerPageChange = useCallback(
    (perPage: string) => {
      updateUrlWithParams(1, parseInt(perPage));
      fetchLocations();
    },
    [updateUrlWithParams, fetchLocations]
  );

  // Handlers for location actions
  const handleUpdateLocationStatus = useCallback(
    async (locationId: string, status: LocationStatus) => {
      try {
        await updateLocationStatus(locationId, status);
        fetchLocations();
      } catch (error) {
        console.error('Failed to update location status:', error);
      }
    },
    [fetchLocations]
  );

  const handleUpdateLocationApprovalStatus = useCallback(
    async (locationId: string, approvalStatus: LocationApprovalStatus) => {
      try {
        await updateLocationApprovalStatus(locationId, approvalStatus);
        fetchLocations();
      } catch (error) {
        console.error('Failed to update location approval status:', error);
      }
    },
    [fetchLocations]
  );

  // Handlers for modals
  const handleEdit = (location: SessionLocation) => {
    setSelectedLocation(location);
    setEditModalOpen(true);
  };

  const handleDelete = (location: SessionLocation) => {
    setSelectedLocation(location);
    setDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Create button */}
      <div className="flex justify-end">
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Location
        </Button>
      </div>

      {/* Filters */}
      <SearchFilters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        approvalStatusFilter={approvalStatusFilter}
        setApprovalStatusFilter={setApprovalStatusFilter}
        stateFilter={stateFilter}
        setStateFilter={setStateFilter}
        countryFilter={countryFilter}
        setCountryFilter={setCountryFilter}
        minCapacity={minCapacity}
        setMinCapacity={setMinCapacity}
        maxCapacity={maxCapacity}
        setMaxCapacity={setMaxCapacity}
        applyFilters={applyFilters}
        clearFilters={clearFilters}
      />

      {/* Locations table */}
      <TableComponent
        locations={locations}
        // isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        updateLocationStatus={handleUpdateLocationStatus}
        updateLocationApprovalStatus={handleUpdateLocationApprovalStatus}
      />

      {/* Pagination */}
      <PaginationControls
        totalItems={pagination.total}
        currentPage={pagination.currentPage}
        perPage={pagination.perPage}
        totalPages={pagination.totalPages}
        itemCount={locations.length}
        handlePageChange={handlePageChange}
        handlePerPageChange={handlePerPageChange}
      />

      {/* Modals */}
      <CreateLocationForm
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSuccess={fetchLocations}
      />

      <EditLocationForm
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        location={selectedLocation}
        onSuccess={fetchLocations}
      />

      <DeleteLocationDialog
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        location={selectedLocation}
        onSuccess={fetchLocations}
      />
    </div>
  );
}
