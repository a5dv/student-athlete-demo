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
import { LocationStatus, LocationApprovalStatus } from '@prisma/client';
import { useState, useEffect } from 'react';
import { getCountries, getStates } from '@/services/locations/queries';

// Define location statuses and approval statuses for dropdown options
const LOCATION_STATUSES = Object.values(LocationStatus);
const APPROVAL_STATUSES = Object.values(LocationApprovalStatus);

interface SearchFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  approvalStatusFilter: string;
  setApprovalStatusFilter: (value: string) => void;
  stateFilter: string;
  setStateFilter: (value: string) => void;
  countryFilter: string;
  setCountryFilter: (value: string) => void;
  minCapacity: number | undefined;
  setMinCapacity: (value: number | undefined) => void;
  maxCapacity: number | undefined;
  setMaxCapacity: (value: number | undefined) => void;
  applyFilters: () => void;
  clearFilters: () => void;
}

export function SearchFilters({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  approvalStatusFilter,
  setApprovalStatusFilter,
  stateFilter,
  setStateFilter,
  countryFilter,
  setCountryFilter,
  minCapacity,
  setMinCapacity,
  maxCapacity,
  setMaxCapacity,
  applyFilters,
  clearFilters,
}: SearchFiltersProps) {
  // States for dropdown options
  const [countries, setCountries] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);

  // Helper function to get display value for selects
  const getSelectValue = (value: string) => value || 'all';

  // Fetch country and state options
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const countriesList = await getCountries();
        setCountries(countriesList);

        // Get states based on selected country or all states
        const statesList = await getStates(countryFilter || undefined);
        setStates(statesList);
      } catch (error) {
        console.error('Failed to fetch filter options:', error);
      }
    };

    fetchOptions();
  }, [countryFilter]);

  // Update states when country changes
  useEffect(() => {
    if (countryFilter) {
      getStates(countryFilter).then(setStates).catch(console.error);
      // Reset state filter when country changes
      setStateFilter('');
    }
  }, [countryFilter, setStateFilter]);

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
              placeholder="Search by address, city, state, or zip code..."
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
        <div className="w-full md:w-40 space-y-1">
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
              {LOCATION_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Approval Status Filter */}
        <div className="w-full md:w-40 space-y-1">
          <label className="text-sm font-medium">Approval</label>
          <Select
            value={getSelectValue(approvalStatusFilter)}
            onValueChange={(value) => {
              setApprovalStatusFilter(value === 'all' ? '' : value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="All approvals" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Approvals</SelectItem>
              {APPROVAL_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Additional filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        {/* Country Filter */}
        <div className="w-full md:w-48 space-y-1">
          <label className="text-sm font-medium">Country</label>
          <Select
            value={getSelectValue(countryFilter)}
            onValueChange={(value) => {
              setCountryFilter(value === 'all' ? '' : value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="All countries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* State/Region Filter */}
        <div className="w-full md:w-48 space-y-1">
          <label className="text-sm font-medium">State/Region</label>
          <Select
            value={getSelectValue(stateFilter)}
            onValueChange={(value) => {
              setStateFilter(value === 'all' ? '' : value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="All states" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              {states.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Min Capacity */}
        <div className="w-full md:w-32 space-y-1">
          <label className="text-sm font-medium">Min Capacity</label>
          <Input
            type="number"
            placeholder="Min"
            value={minCapacity === undefined ? '' : minCapacity}
            onChange={(e) => {
              const val = e.target.value === '' ? undefined : parseInt(e.target.value);
              setMinCapacity(val);
            }}
            min={1}
          />
        </div>

        {/* Max Capacity */}
        <div className="w-full md:w-32 space-y-1">
          <label className="text-sm font-medium">Max Capacity</label>
          <Input
            type="number"
            placeholder="Max"
            value={maxCapacity === undefined ? '' : maxCapacity}
            onChange={(e) => {
              const val = e.target.value === '' ? undefined : parseInt(e.target.value);
              setMaxCapacity(val);
            }}
            min={1}
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
