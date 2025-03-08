import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { Category, CategoryStatus } from '@prisma/client';
import { getStatusBadge } from './Badges';
import { CategoryActions } from './CategoryActions';

interface TableComponentProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onUpdateStatus: (categoryId: string, status: CategoryStatus) => Promise<void>;
}

export function TableComponent({
  categories,
  onEdit,
  onDelete,
  onUpdateStatus,
}: TableComponentProps) {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Duration (min)</TableHead>
            <TableHead>Capacity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                No categories found.
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.id.substring(0, 8)}</TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>
                  {category.description
                    ? category.description.length > 50
                      ? category.description.substring(0, 50) + '...'
                      : category.description
                    : 'N/A'}
                </TableCell>
                <TableCell>
                  {category.minDurationInMinutes} - {category.maxDurationInMinutes}
                </TableCell>
                <TableCell>
                  {category.minClients} - {category.maxClients}
                </TableCell>
                <TableCell>{getStatusBadge(category.status)}</TableCell>
                <TableCell>{format(new Date(category.createdAt), 'MMM dd, yyyy')}</TableCell>
                <TableCell>
                  <CategoryActions
                    categoryId={category.id}
                    status={category.status}
                    onEdit={() => onEdit(category)}
                    onDelete={() => onDelete(category)}
                    updateCategoryStatus={onUpdateStatus}
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
