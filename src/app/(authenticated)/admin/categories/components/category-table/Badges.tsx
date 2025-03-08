import { Badge } from '@/components/ui/badge';

export function getStatusBadge(status: string) {
  switch (status) {
    case 'ACTIVE':
      return <Badge className="bg-green-500">Active</Badge>;
    case 'INACTIVE':
      return <Badge className="bg-gray-500">Inactive</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
}
