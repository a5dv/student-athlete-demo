'use client';

import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { CreateCategoryForm } from './CreateCategoryForm';
import { EditCategoryForm } from './EditCategoryForm';
import { DeleteCategoryDialog } from './DeleteCategoryDialog';
import { TableComponent } from './category-table/TableComponent';
import { SearchFilters } from './category-table/SearchFilters';
import { PaginationControls } from './category-table/PaginationControls';
import { Category, CategoryStatus } from '@prisma/client';
import { updateCategoryStatus } from '@/services/categories/mutations';
import { getCategories } from '@/services/categories/queries';
import { toast } from 'sonner';

interface CategoriesContentProps {
  initialCategories: Category[];
  initialPagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
  };
  initialFilters: {
    search?: string;
    status?: CategoryStatus;
    minDuration?: number;
    maxDuration?: number;
    minCapacity?: number;
    maxCapacity?: number;
  };
}

export function CategoriesContent({
  initialCategories,
  initialPagination,
  initialFilters,
}: CategoriesContentProps) {
  // Router and search params
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // State for categories and pagination
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [pagination, setPagination] = useState(initialPagination);
  const [_isLoading, setIsLoading] = useState(false);

  // State for filters
  const [search, setSearch] = useState(initialFilters.search || '');
  const [statusFilter, setStatusFilter] = useState(initialFilters.status || '');
  const [minDuration, setMinDuration] = useState(initialFilters.minDuration || 0);
  const [maxDuration, setMaxDuration] = useState(initialFilters.maxDuration || 0);
  const [minCapacity, setMinCapacity] = useState(initialFilters.minCapacity || 0);
  const [maxCapacity, setMaxCapacity] = useState(initialFilters.maxCapacity || 0);

  // State for modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // Function to update URL with current filters and pagination
  const updateUrlWithParams = useCallback(
    (
      newPage?: number,
      newPerPage?: number,
      newSearch?: string,
      newStatus?: string,
      newMinDuration?: number,
      newMaxDuration?: number,
      newMinCapacity?: number,
      newMaxCapacity?: number
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

      if (newMinDuration !== undefined && newMinDuration > 0) {
        params.set('min_duration', newMinDuration.toString());
      } else {
        params.delete('min_duration');
      }

      if (newMaxDuration !== undefined && newMaxDuration > 0) {
        params.set('max_duration', newMaxDuration.toString());
      } else {
        params.delete('max_duration');
      }

      if (newMinCapacity !== undefined && newMinCapacity > 0) {
        params.set('min_capacity', newMinCapacity.toString());
      } else {
        params.delete('min_capacity');
      }

      if (newMaxCapacity !== undefined && newMaxCapacity > 0) {
        params.set('max_capacity', newMaxCapacity.toString());
      } else {
        params.delete('max_capacity');
      }

      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  // Function to fetch categories with updated filters
  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const filters = {
        search,
        status: statusFilter as CategoryStatus,
        minDuration: minDuration > 0 ? minDuration : undefined,
        maxDuration: maxDuration > 0 ? maxDuration : undefined,
        minCapacity: minCapacity > 0 ? minCapacity : undefined,
        maxCapacity: maxCapacity > 0 ? maxCapacity : undefined,
      };

      const result = await getCategories(filters, {
        page: pagination.currentPage,
        perPage: pagination.perPage,
      });

      setCategories(result.data);
      setPagination(result.pagination);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      toast.error('Failed to fetch categories');
    } finally {
      setIsLoading(false);
    }
  }, [
    search,
    statusFilter,
    minDuration,
    maxDuration,
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
      minDuration,
      maxDuration,
      minCapacity,
      maxCapacity
    );
    fetchCategories();
  }, [
    updateUrlWithParams,
    pagination.perPage,
    search,
    statusFilter,
    minDuration,
    maxDuration,
    minCapacity,
    maxCapacity,
    fetchCategories,
  ]);

  const clearFilters = useCallback(() => {
    setSearch('');
    setStatusFilter('');
    setMinDuration(0);
    setMaxDuration(0);
    setMinCapacity(0);
    setMaxCapacity(0);

    updateUrlWithParams(1, pagination.perPage, '', '', 0, 0, 0, 0);
    fetchCategories();
  }, [updateUrlWithParams, pagination.perPage, fetchCategories]);

  // Handlers for pagination
  const handlePageChange = useCallback(
    (page: number) => {
      updateUrlWithParams(page);
      fetchCategories();
    },
    [updateUrlWithParams, fetchCategories]
  );

  const handlePerPageChange = useCallback(
    (perPage: string) => {
      updateUrlWithParams(1, parseInt(perPage));
      fetchCategories();
    },
    [updateUrlWithParams, fetchCategories]
  );

  // Handlers for category actions
  const handleUpdateCategoryStatus = useCallback(
    async (categoryId: string, status: CategoryStatus) => {
      try {
        const result = await updateCategoryStatus(categoryId, status);
        if (result.success) {
          toast.success(`Category status updated to ${status}`);
          fetchCategories();
        } else {
          throw new Error(result.error || 'Failed to update category status');
        }
      } catch (error) {
        console.error('Failed to update category status:', error);
        toast.error('Failed to update category status');
      }
    },
    [fetchCategories]
  );

  // Handlers for modals
  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setEditModalOpen(true);
  };

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Create button */}
      <div className="flex justify-end">
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>

      {/* Filters */}
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

      {/* Categories table */}
      <TableComponent
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onUpdateStatus={handleUpdateCategoryStatus}
      />

      {/* Pagination */}
      <PaginationControls
        totalItems={pagination.total}
        currentPage={pagination.currentPage}
        perPage={pagination.perPage}
        totalPages={pagination.totalPages}
        itemCount={categories.length}
        handlePageChange={handlePageChange}
        handlePerPageChange={handlePerPageChange}
      />

      {/* Modals */}
      <CreateCategoryForm
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSuccess={fetchCategories}
      />

      <EditCategoryForm
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        category={selectedCategory}
        onSuccess={fetchCategories}
      />

      <DeleteCategoryDialog
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        category={selectedCategory}
        onSuccess={fetchCategories}
      />
    </div>
  );
}
