'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { SessionLocation } from '@prisma/client';
import { deleteLocation } from '@/services/locations/mutations';
import { useState } from 'react';

interface DeleteLocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  location: SessionLocation | null;
  onSuccess: () => void;
}

export function DeleteLocationDialog({
  open,
  onOpenChange,
  location,
  onSuccess,
}: DeleteLocationDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!location) return;

    setIsDeleting(true);
    try {
      const result = await deleteLocation(location.id);
      if (result.success) {
        toast.success('Location deleted', {
          description: 'The location has been deleted successfully.',
        });
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error('Error Occurred', {
          description: result.error || 'Failed to delete location',
        });
      }
    } catch (error) {
      console.error(error);
      toast.error('Error Occurred', {
        description: 'An unexpected error occurred',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const locationAddress = location
    ? `${location.address}, ${location.city}, ${location.state}`
    : '';

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will mark the location `&quot;`{locationAddress}`&quot;` as deleted and set
            its status to inactive. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
