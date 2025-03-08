import { Badge } from '@/components/ui/badge';

export function getStatusBadge(status: string) {
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

export function getRoleBadge(role: string) {
  switch (role) {
    case 'ADMIN':
      return <Badge className="bg-purple-500">Admin</Badge>;
    case 'CLIENT':
      return <Badge className="bg-blue-500">Client</Badge>;
    case 'PROVIDER':
      return <Badge className="bg-orange-500">Provider</Badge>;
    default:
      return <Badge>{role}</Badge>;
  }
}
