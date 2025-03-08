'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { User, UserStatus, Role } from '@prisma/client';
import { UserActions } from './UserActions';
import { getStatusBadge, getRoleBadge } from './Badges';

interface TableComponentProps {
  users: User[];
  updateUserStatus: (userId: string, status: UserStatus) => Promise<void>;
  updateUserRole: (userId: string, role: Role) => Promise<void>;
}

export function TableComponent({ users, updateUserStatus, updateUserRole }: TableComponentProps) {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                No users found
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.email}</TableCell>
                <TableCell>
                  {user.firstName || user.lastName
                    ? `${user.firstName || ''} ${user.lastName || ''}`
                    : 'Not provided'}
                </TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell className="text-right">
                  <UserActions
                    userId={user.id}
                    status={user.status}
                    role={user.role}
                    updateUserStatus={updateUserStatus}
                    updateUserRole={updateUserRole}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
