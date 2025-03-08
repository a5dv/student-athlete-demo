'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Category, CategoryStatus } from '@prisma/client';
import { toast } from 'sonner';
import { SearchFilters } from './category-table/SearchFilters';
import { TableComponent } from './category-table/TableComponent';
import { PaginationControls } from './category-table/PaginationControls';
import { getCategories, CategoryFilters } from '@/services/categories/queries';
import { updateCategoryStatus } from '@/services/categories/mutations';

interface CategoriesTableProps {
  initialData: Category[];
  totalPages: number;
  currentPage: number;
  perPage: number;
  totalCategories: number;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export default function CategoriesTable({
  initialData,
  totalPages,
  currentPage,
  perPage,
  totalCategories: initialTotal,
  onEdit,
  onDelete,
}: CategoriesTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize state from URL parameters
  const [categories, setCategories] = useState<Category[]>(initialData);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [minDuration, setMinDuration] = useState(parseInt(searchParams.get('minDuration') || '0'));
  const [maxDuration, setMaxDuration] = useState(parseInt(searchParams.get('maxDuration') || '0'));
  const [minCapacity, setMinCapacity] = useState(parseInt(searchParams.get('minCapacity') || '0'));
  const [maxCapacity, setMaxCapacity] = useState(parseInt(searchParams.get('maxCapacity') || '0'));
  const [loading, setLoading] = useState(false);
  const [paginationInfo, setPaginationInfo] = useState({
    total: initialTotal,
    totalPages,
    currentPage,
    perPage,
  });
  // Update local state when search params change
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setStatusFilter(searchParams.get('status') || '');
    setMinDuration(parseInt(searchParams.get('minDuration') || '0'));
    setMaxDuration(parseInt(searchParams.get('maxDuration') || '0'));
    setMinCapacity(parseInt(searchParams.get('minCapacity') || '0'));
    setMaxCapacity(parseInt(searchParams.get('maxCapacity') || '0'));
  }, [searchParams]);

  // Fetch data when search params change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Extract params from URL
        const page = parseInt(searchParams.get('page') || '1');
        const perPage = parseInt(searchParams.get('perPage') || '15');
        const search = searchParams.get('search') || undefined;
        const status = (searchParams.get('status') as CategoryStatus) || undefined;
        const minDuration = searchParams.get('minDuration')
          ? parseInt(searchParams.get('minDuration') || '0')
          : undefined;
        const maxDuration = searchParams.get('maxDuration')
          ? parseInt(searchParams.get('maxDuration') || '0')
          : undefined;
        const minCapacity = searchParams.get('minCapacity')
          ? parseInt(searchParams.get('minCapacity') || '0')
          : undefined;
        const maxCapacity = searchParams.get('maxCapacity')
          ? parseInt(searchParams.get('maxCapacity') || '0')
          : undefined;

        const filters: CategoryFilters = {
          search,
          status,
          minDuration,
          maxDuration,
          minCapacity,
          maxCapacity,
        };

        const paginationOptions = {
          page,
          perPage,
        };

        // Call getCategories directly
        const { data, pagination } = await getCategories(filters, paginationOptions);

        setCategories(data);
        setPaginationInfo(pagination);
      } catch (error) {
        console.error('Error fetching filtered categories:', error);
        toast.error('Failed to fetch filtered categories');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we have search params (skip on initial load since we have initialData)
    if (searchParams.toString()) {
      fetchData();
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
    const params: Record<string, string | null> = {
      search: search || null,
      status: statusFilter || null,
      page: '1', // Reset to first page when filters change
      perPage: paginationInfo.perPage.toString(),
    };

    if (minDuration > 0) params.minDuration = minDuration.toString();
    if (maxDuration > 0) params.maxDuration = maxDuration.toString();
    if (minCapacity > 0) params.minCapacity = minCapacity.toString();
    if (maxCapacity > 0) params.maxCapacity = maxCapacity.toString();

    router.push(`${pathname}?${createQueryString(params)}`);
  };

  // Handle pagination change
  const handlePageChange = (page: number) => {
    router.push(
      `${pathname}?${createQueryString({
        page: page.toString(),
        perPage: paginationInfo.perPage.toString(),
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
  const handleUpdateCategoryStatus = async (categoryId: string, status: CategoryStatus) => {
    try {
      const result = await updateCategoryStatus(categoryId, status);

      if (result.success) {
        // Update the local state
        setCategories(
          categories.map((category) =>
            category.id === categoryId ? { ...category, status } : category
          )
        );
        toast.success(`Category status updated to ${status}`);
      } else {
        throw new Error(result.error || 'Failed to update category status');
      }
    } catch (error) {
      toast.error('Failed to update category status');
      console.error(error);
    }
  };

  // Clear filters
  const clearFilters = () => {
    // Update the state first
    setSearch('');
    setStatusFilter('');
    setMinDuration(0);
    setMaxDuration(0);
    setMinCapacity(0);
    setMaxCapacity(0);

    // Then navigate to the base path without query params
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
        minDuration={minDuration}
        setMinDuration={setMinDuration}
        maxDuration={maxDuration}
        setMaxDuration={setMaxDuration}
        minCapacity={minCapacity}
        setMinCapacity={setMinCapacity}
        maxCapacity={maxCapacity}
        setMaxCapacity={setMaxCapacity}
        applyFilters={applyFilters}
        clearFilters={clearFilters}
      />

      {/* Table Component */}
      {loading ? (
        <div className="flex justify-center p-4">Loading categories...</div>
      ) : (
        <TableComponent
          categories={categories}
          onEdit={onEdit}
          onDelete={onDelete}
          onUpdateStatus={handleUpdateCategoryStatus}
        />
      )}

      {/* Pagination Controls */}
      <PaginationControls
        totalItems={paginationInfo.total}
        currentPage={paginationInfo.currentPage}
        perPage={paginationInfo.perPage}
        totalPages={paginationInfo.totalPages}
        itemCount={categories.length}
        handlePageChange={handlePageChange}
        handlePerPageChange={handlePerPageChange}
      />
    </div>
  );
}
