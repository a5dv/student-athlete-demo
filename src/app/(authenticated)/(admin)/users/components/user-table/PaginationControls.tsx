"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  totalItems: number;
  currentPage: number;
  perPage: number;
  totalPages: number;
  itemCount: number;
  handlePageChange: (page: number) => void;
  handlePerPageChange: (perPage: string) => void;
}

export function PaginationControls({
  totalItems,
  currentPage,
  perPage,
  totalPages,
  itemCount,
  handlePageChange,
  handlePerPageChange,
}: PaginationControlsProps) {
  const start = (currentPage - 1) * perPage + 1;
  const end = Math.min(start + itemCount - 1, totalItems);

  return (
    <div className="flex flex-col gap-4 py-2">
      {/* Mobile Layout (stacked rows) */}
      <div className="flex flex-col gap-4 sm:hidden">
        {/* Pagination (gets its own row on mobile) */}
        <div className="flex items-center justify-center space-x-2 w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Entries info and Per Page in a row */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Showing {start}-{end} of {totalItems} users
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm">Show</span>
            <Select
              value={perPage.toString()}
              onValueChange={handlePerPageChange}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder={perPage.toString()} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm">per page</span>
          </div>
        </div>
      </div>

      {/* Desktop Layout (horizontal row) */}
      <div className="hidden sm:flex sm:items-center sm:justify-between">
        {/* Entries info */}
        <div className="text-sm text-muted-foreground">
          Showing {start}-{end} of {totalItems} users
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Per page selection */}
        <div className="flex items-center space-x-2">
          <span className="text-sm">Show</span>
          <Select
            value={perPage.toString()}
            onValueChange={handlePerPageChange}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder={perPage.toString()} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm">per page</span>
        </div>
      </div>
    </div>
  );
}