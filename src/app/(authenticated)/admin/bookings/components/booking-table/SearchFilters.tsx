import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { BookingStatus, PaymentMethod, PaymentStatus } from '@prisma/client';
import { X, Search, CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { getCategories, getLocations } from '@/services/bookings/queries';

// Constants for dropdowns
const BOOKING_STATUSES = Object.values(BookingStatus);
const PAYMENT_METHODS = Object.values(PaymentMethod);
const PAYMENT_STATUSES = Object.values(PaymentStatus);

interface SearchFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  locationFilter: string;
  setLocationFilter: (value: string) => void;
  paymentMethodFilter: string;
  setPaymentMethodFilter: (value: string) => void;
  paymentStatusFilter: string;
  setPaymentStatusFilter: (value: string) => void;
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
  applyFilters: () => void;
  clearFilters: () => void;
}

export function SearchFilters({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  locationFilter,
  setLocationFilter,
  paymentMethodFilter,
  setPaymentMethodFilter,
  paymentStatusFilter,
  setPaymentStatusFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  applyFilters,
  clearFilters,
}: SearchFiltersProps) {
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [locations, setLocations] = useState<
    Array<{ id: string; address: string; city: string; state: string }>
  >([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);

  // Fetch categories and locations on component mount
  useEffect(() => {
    async function fetchFilterOptions() {
      try {
        setIsLoadingCategories(true);
        setIsLoadingLocations(true);

        const categoriesData = await getCategories();
        setCategories(categoriesData);

        const locationsData = await getLocations();
        setLocations(locationsData);
      } catch (error) {
        console.error('Error fetching filter options:', error);
      } finally {
        setIsLoadingCategories(false);
        setIsLoadingLocations(false);
      }
    }

    fetchFilterOptions();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        {/* Search input */}
        <div className="flex-1 space-y-1">
          <label className="text-sm font-medium">Search</label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by ID, client, provider..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
              className="pl-8"
            />
          </div>
        </div>

        {/* Booking Status Filter */}
        <div className="w-full md:w-48 space-y-1">
          <label className="text-sm font-medium">Status</label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {BOOKING_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category Filter */}
        <div className="w-full md:w-48 space-y-1">
          <label className="text-sm font-medium">Category</label>
          <Select
            value={categoryFilter}
            onValueChange={setCategoryFilter}
            disabled={isLoadingCategories}
          >
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Location Filter */}
        <div className="w-full md:w-48 space-y-1">
          <label className="text-sm font-medium">Location</label>
          <Select
            value={locationFilter}
            onValueChange={setLocationFilter}
            disabled={isLoadingLocations}
          >
            <SelectTrigger>
              <SelectValue placeholder="All locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All locations</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {location.city}, {location.state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        {/* Payment Method Filter */}
        <div className="w-full md:w-48 space-y-1">
          <label className="text-sm font-medium">Payment Method</label>
          <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All methods" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All methods</SelectItem>
              {PAYMENT_METHODS.map((method) => (
                <SelectItem key={method} value={method}>
                  {method.replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Payment Status Filter */}
        <div className="w-full md:w-48 space-y-1">
          <label className="text-sm font-medium">Payment Status</label>
          <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All payment statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All payment statuses</SelectItem>
              {PAYMENT_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Range Selector - Start */}
        <div className="w-full md:w-48 space-y-1">
          <label className="text-sm font-medium">Start Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !startDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, 'PPP') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        {/* Date Range Selector - End */}
        <div className="w-full md:w-48 space-y-1">
          <label className="text-sm font-medium">End Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !endDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, 'PPP') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
                disabled={(date) => (startDate ? date < startDate : false)}
              />
            </PopoverContent>
          </Popover>
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
