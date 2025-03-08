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

export function getApprovalStatusBadge(status: string) {
  switch (status) {
    case 'APPROVED':
      return <Badge className="bg-green-500">Approved</Badge>;
    case 'PENDING':
      return <Badge className="bg-yellow-500">Pending</Badge>;
    case 'REJECTED':
      return <Badge className="bg-red-500">Rejected</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
}
