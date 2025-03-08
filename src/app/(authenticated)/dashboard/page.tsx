import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import AdminDashboard from './components/AdminDashboard';
import ClientDashboard from './components/ClientDashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'User Landing Page',
};

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;

  switch (role) {
    case 'ADMIN':
      return <AdminDashboard session={session} />;
    default:
      return <ClientDashboard session={session} />;
  }
}
