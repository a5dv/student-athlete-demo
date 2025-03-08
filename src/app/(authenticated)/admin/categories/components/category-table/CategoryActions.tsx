'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CategoryStatus } from '@prisma/client';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';

interface CategoryActionsProps {
  categoryId: string;
  status: CategoryStatus;
  onEdit: () => void;
  onDelete: () => void;
  updateCategoryStatus: (categoryId: string, status: CategoryStatus) => Promise<void>;
}

export function CategoryActions({
  categoryId,
  status,
  onEdit,
  onDelete,
  updateCategoryStatus,
}: CategoryActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete} className="text-red-600">
          <Trash className="mr-2 h-4 w-4" /> Delete
        </DropdownMenuItem>
        {status === 'ACTIVE' ? (
          <DropdownMenuItem onClick={() => updateCategoryStatus(categoryId, 'INACTIVE')}>
            Mark as Inactive
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => updateCategoryStatus(categoryId, 'ACTIVE')}>
            Mark as Active
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
