'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SessionLocation, LocationStatus, LocationApprovalStatus } from '@prisma/client';
import { LocationActions } from './LocationActions';
import { getStatusBadge, getApprovalStatusBadge } from './Badges';
import { format } from 'date-fns';

interface TableComponentProps {
  locations: SessionLocation[];
  updateLocationStatus: (locationId: string, status: LocationStatus) => Promise<void>;
  updateLocationApprovalStatus: (
    locationId: string,
    status: LocationApprovalStatus
  ) => Promise<void>;
  onEdit: (location: SessionLocation) => void;
  onDelete: (location: SessionLocation) => void;
}

export function TableComponent({
  locations,
  updateLocationStatus,
  updateLocationApprovalStatus,
  onEdit,
  onDelete,
}: TableComponentProps) {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>City, State</TableHead>
            <TableHead>ZIP Code</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Capacity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Approval</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {locations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-8">
                No locations found
              </TableCell>
            </TableRow>
          ) : (
            locations.map((location) => (
              <TableRow key={location.id}>
                <TableCell className="font-medium">{location.id.substring(0, 8)}...</TableCell>
                <TableCell>{location.address}</TableCell>
                <TableCell>{`${location.city}, ${location.state}`}</TableCell>
                <TableCell>{location.zipCode}</TableCell>
                <TableCell>{location.country}</TableCell>
                <TableCell>{location.capacity}</TableCell>
                <TableCell>{getStatusBadge(location.status)}</TableCell>
                <TableCell>{getApprovalStatusBadge(location.approvalStatus)}</TableCell>
                <TableCell>{format(new Date(location.createdAt), 'MMM d, yyyy')}</TableCell>
                <TableCell className="text-right">
                  <LocationActions
                    locationId={location.id}
                    status={location.status}
                    approvalStatus={location.approvalStatus}
                    updateLocationStatus={updateLocationStatus}
                    updateLocationApprovalStatus={updateLocationApprovalStatus}
                    onEdit={() => onEdit(location)}
                    onDelete={() => onDelete(location)}
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
