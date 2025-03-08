'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { User, UserStatus, Role } from '@prisma/client';
import { toast } from 'sonner';

import { SearchFilters } from './user-table/SearchFilters';
import { TableComponent } from './user-table/TableComponent';
import { PaginationControls } from './user-table/PaginationControls';
import { updateUserStatus, updateUserRole } from '@/services/users/mutations';
import { getUsers } from '@/services/users/queries';

interface UsersTableProps {
  initialData: User[];
  totalPages: number;
  currentPage: number;
  perPage: number;
}

export default function UsersTable({
  initialData,
  totalPages,
  currentPage,
  perPage,
}: UsersTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize state from URL parameters
  const [users, setUsers] = useState<User[]>(initialData);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [roleFilter, setRoleFilter] = useState(searchParams.get('role') || '');
  const [loading, setLoading] = useState(false);
  const [paginationInfo, setPaginationInfo] = useState({
    total: totalPages * perPage,
    totalPages,
    currentPage,
    perPage,
  });

  // Update local state when search params change
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setStatusFilter(searchParams.get('status') || '');
    setRoleFilter(searchParams.get('role') || '');
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
        const status = (searchParams.get('status') as UserStatus) || undefined;
        const role = (searchParams.get('role') as Role) || undefined;

        const filters = {
          status,
          role,
          search,
        };

        const paginationOptions = {
          page,
          perPage,
        };

        // Call getUsers directly
        const { data, pagination } = await getUsers(filters, paginationOptions);

        setUsers(data);
        setPaginationInfo(pagination);
      } catch (error) {
        console.error('Error fetching filtered users:', error);
        toast.error('Failed to fetch filtered users');
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
    router.push(
      `${pathname}?${createQueryString({
        search: search || '',
        status: statusFilter || '',
        role: roleFilter || '',
        page: '1', // Reset to first page when filters change
        perPage: paginationInfo.perPage.toString(),
      })}`
    );
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
  const handleUpdateUserStatus = async (userId: string, status: UserStatus) => {
    try {
      const result = await updateUserStatus(userId, status);

      if (result.success) {
        // Update the local state
        setUsers(users.map((user) => (user.id === userId ? { ...user, status } : user)));
        toast.success(`User status updated to ${status}`);
      } else {
        throw new Error(result.error || 'Failed to update user status');
      }
    } catch (error) {
      toast.error('Failed to update user status');
      console.error(error);
    }
  };

  // Handle role update
  const handleUpdateUserRole = async (userId: string, role: Role) => {
    try {
      const result = await updateUserRole(userId, role);

      if (result.success) {
        // Update the local state
        setUsers(users.map((user) => (user.id === userId ? { ...user, role } : user)));
        toast.success(`User role updated to ${role}`);
      } else {
        throw new Error(result.error || 'Failed to update user role');
      }
    } catch (error) {
      toast.error('Failed to update user role');
      console.error(error);
    }
  };

  // Clear filters
  const clearFilters = () => {
    // Update the state first
    setSearch('');
    setStatusFilter('');
    setRoleFilter('');

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
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        applyFilters={applyFilters}
        clearFilters={clearFilters}
      />

      {/* Table Component */}
      {loading ? (
        <div className="flex justify-center p-4">Loading users...</div>
      ) : (
        <TableComponent
          users={users}
          updateUserStatus={handleUpdateUserStatus}
          updateUserRole={handleUpdateUserRole}
        />
      )}

      {/* Pagination Controls */}
      <PaginationControls
        totalItems={paginationInfo.total}
        currentPage={paginationInfo.currentPage}
        perPage={paginationInfo.perPage}
        totalPages={paginationInfo.totalPages}
        itemCount={users.length}
        handlePageChange={handlePageChange}
        handlePerPageChange={handlePerPageChange}
      />
    </div>
  );
}
