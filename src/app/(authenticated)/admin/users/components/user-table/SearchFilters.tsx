'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import { UserStatus, Role } from '@prisma/client';

// Define user statuses and roles for dropdown options
const USER_STATUSES = Object.values(UserStatus);
const USER_ROLES = Object.values(Role);

interface SearchFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  roleFilter: string;
  setRoleFilter: (value: string) => void;
  applyFilters: () => void;
  clearFilters: () => void;
}

export function SearchFilters({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  roleFilter,
  setRoleFilter,
  applyFilters,
  clearFilters,
}: SearchFiltersProps) {
  // Helper function to get display value for selects
  const getSelectValue = (value: string) => value || 'all';

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        {/* Search input */}
        <div className="flex-1 space-y-1">
          <label className="text-sm font-medium">Search</label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by email, first name, or last name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 w-full"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  applyFilters();
                }
              }}
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-48 space-y-1">
          <label className="text-sm font-medium">Status</label>
          <Select
            value={getSelectValue(statusFilter)}
            onValueChange={(value) => {
              setStatusFilter(value === 'all' ? '' : value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {USER_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Role Filter */}
        <div className="w-full md:w-48 space-y-1">
          <label className="text-sm font-medium">Role</label>
          <Select
            value={getSelectValue(roleFilter)}
            onValueChange={(value) => {
              setRoleFilter(value === 'all' ? '' : value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {USER_ROLES.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
        <div className="flex gap-2">
          <Button onClick={applyFilters} className="flex-1 sm:flex-none">
            Apply Filters
          </Button>
          <Button onClick={clearFilters} variant="outline" className="flex-1 sm:flex-none">
            <X className="h-4 w-4 mr-1" /> Clear
          </Button>
        </div>
      </div>
    </div>
  );
}
