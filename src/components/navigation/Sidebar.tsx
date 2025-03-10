'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Calendar,
  // CreditCard,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Users,
  FolderArchive,
  MapPin,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const adminNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: FolderArchive, label: 'Category Management', href: '/admin/categories' },
  { icon: MapPin, label: 'Location Management', href: '/admin/locations' },
  { icon: Calendar, label: 'Booking Management', href: '/admin/bookings' },
  { icon: Users, label: 'User Management', href: '/admin/users' },
  // { icon: CreditCard, label: 'Manual Payment', href: '/admin/manual-payment' },
];

const clientNavItems = [{ icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' }];

export function Sidebar({ role }: { role: string }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  let navItems;

  if (role === 'ADMIN') {
    navItems = adminNavItems;
  } else {
    navItems = clientNavItems;
  }
  return (
    <div
      className={cn(
        'bg-background h-full border-r flex flex-col transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex items-center justify-end h-14 px-4 border-b">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      <div className="flex-1 py-4">
        <nav className="space-y-2 px-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn('w-full justify-start', pathname === item.href && 'bg-secondary')}
              >
                <item.icon className="h-4 w-4" />
                {!collapsed && <span className="ml-2">{item.label}</span>}
              </Button>
            </Link>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t ">
        <Button variant="ghost" className="w-full justify-start" onClick={() => signOut()}>
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </div>
  );
}
