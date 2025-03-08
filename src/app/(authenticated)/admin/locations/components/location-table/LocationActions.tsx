'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LocationStatus, LocationApprovalStatus } from '@prisma/client';
import { Edit, MoreHorizontal, Trash, Check, X } from 'lucide-react';

interface LocationActionsProps {
  locationId: string;
  status: LocationStatus;
  approvalStatus: LocationApprovalStatus;
  onEdit: () => void;
  onDelete: () => void;
  updateLocationStatus: (locationId: string, status: LocationStatus) => Promise<void>;

  updateLocationApprovalStatus: (
    locationId: string,
    approvalStatus: LocationApprovalStatus
  ) => Promise<void>;
}

export function LocationActions({
  locationId,
  status,
  approvalStatus,
  onEdit,
  onDelete,
  updateLocationStatus,
  updateLocationApprovalStatus,
}: LocationActionsProps) {
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

        {/* Status actions */}
        {status === 'ACTIVE' ? (
          <DropdownMenuItem onClick={() => updateLocationStatus(locationId, 'INACTIVE')}>
            <X className="mr-2 h-4 w-4" /> Mark as Inactive
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => updateLocationStatus(locationId, 'ACTIVE')}>
            <Check className="mr-2 h-4 w-4" /> Mark as Active
          </DropdownMenuItem>
        )}

        {/* Approval actions */}
        {approvalStatus !== 'APPROVED' && (
          <DropdownMenuItem onClick={() => updateLocationApprovalStatus(locationId, 'APPROVED')}>
            Approve Location
          </DropdownMenuItem>
        )}
        {approvalStatus !== 'REJECTED' && (
          <DropdownMenuItem onClick={() => updateLocationApprovalStatus(locationId, 'REJECTED')}>
            Reject Location
          </DropdownMenuItem>
        )}
        {approvalStatus !== 'PENDING' && (
          <DropdownMenuItem onClick={() => updateLocationApprovalStatus(locationId, 'PENDING')}>
            Mark as Pending
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
