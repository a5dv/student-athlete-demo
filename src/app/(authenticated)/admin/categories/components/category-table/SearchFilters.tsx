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
import { CategoryStatus } from '@prisma/client';

// Define category statuses for dropdown options
const CATEGORY_STATUSES = Object.values(CategoryStatus);

interface SearchFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  minDuration: number;
  setMinDuration: (value: number) => void;
  maxDuration: number;
  setMaxDuration: (value: number) => void;
  minCapacity: number;
  setMinCapacity: (value: number) => void;
  maxCapacity: number;
  setMaxCapacity: (value: number) => void;
  applyFilters: () => void;
  clearFilters: () => void;
}

export function SearchFilters({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  minDuration,
  setMinDuration,
  maxDuration,
  setMaxDuration,
  minCapacity,
  setMinCapacity,
  maxCapacity,
  setMaxCapacity,
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
              placeholder="Search by name or description..."
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
              {CATEGORY_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        {/* Duration Range */}

        <div className="w-full md:w-48 space-y-1">
          <label className="text-sm font-medium">Min Duration (min)</label>
          <Input
            type="number"
            value={minDuration || ''}
            onChange={(e) => setMinDuration(parseInt(e.target.value) || 0)}
            placeholder="Min"
            min={0}
          />
        </div>

        <div className="w-full md:w-48 space-y-1">
          <label className="text-sm font-medium">Max Duration (min)</label>
          <Input
            type="number"
            value={maxDuration || ''}
            onChange={(e) => setMaxDuration(parseInt(e.target.value) || 0)}
            placeholder="Max"
            min={0}
          />
        </div>

        {/* Capacity Range */}

        <div className="w-full md:w-48 space-y-1">
          <label className="text-sm font-medium">Min Capacity</label>
          <Input
            type="number"
            value={minCapacity || ''}
            onChange={(e) => setMinCapacity(parseInt(e.target.value) || 0)}
            placeholder="Min"
            min={0}
          />
        </div>

        <div className="w-full md:w-48 space-y-1">
          <label className="text-sm font-medium">Max Capacity</label>
          <Input
            type="number"
            value={maxCapacity || ''}
            onChange={(e) => setMaxCapacity(parseInt(e.target.value) || 0)}
            placeholder="Max"
            min={0}
          />
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
