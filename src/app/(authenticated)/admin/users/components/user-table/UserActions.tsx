'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Check, MoreHorizontal, X } from 'lucide-react';
import { Role, UserStatus } from '@prisma/client';

interface UserActionsProps {
  userId: string;
  status: string;
  role: string;
  updateUserStatus: (userId: string, status: UserStatus) => Promise<void>;
  updateUserRole: (userId: string, role: Role) => Promise<void>;
}

export function UserActions({
  userId,
  status,
  role,
  updateUserStatus,
  updateUserRole,
}: UserActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {status === 'PENDING' && (
          <>
            <DropdownMenuItem
              onClick={() => updateUserStatus(userId, 'APPROVED')}
              className="text-green-600"
            >
              <Check className="mr-2 h-4 w-4" />
              Approve
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => updateUserStatus(userId, 'REJECTED')}
              className="text-red-600"
            >
              <X className="mr-2 h-4 w-4" />
              Reject
            </DropdownMenuItem>
          </>
        )}
        {status === 'REJECTED' && (
          <DropdownMenuItem
            onClick={() => updateUserStatus(userId, 'APPROVED')}
            className="text-green-600"
          >
            <Check className="mr-2 h-4 w-4" />
            Activate
          </DropdownMenuItem>
        )}
        {status === 'APPROVED' && (
          <DropdownMenuItem
            onClick={() => updateUserStatus(userId, 'REJECTED')}
            className="text-red-600"
          >
            <X className="mr-2 h-4 w-4" />
            Deactivate
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={() => updateUserRole(userId, 'CLIENT')}
          disabled={role === 'CLIENT'}
        >
          Set as Client
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => updateUserRole(userId, 'PROVIDER')}
          disabled={role === 'PROVIDER'}
        >
          Set as Provider
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => updateUserRole(userId, 'ADMIN')}
          disabled={role === 'ADMIN'}
          className="text-purple-600"
        >
          Set as Admin
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
