
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Award, BarChart3, UserCircle, LucideIcon } from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/skills', label: 'Skills', icon: BookOpen },
  { href: '/achievements', label: 'Achievements', icon: Award },
  { href: '/analysis', label: 'Analysis', icon: BarChart3 },
  { href: '/profile', label: 'Profile', icon: UserCircle },
];

export function NavMenu() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
 <SidebarMenuItem key={item.href}>
 <Link href={item.href}>
 <SidebarMenuButton
            isActive={pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))}
            tooltip={item.label}
            className={cn(
              (pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href)))
                ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold'
                : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
            )}
 asChild
 >
 <div>
 <item.icon className="shrink-0" />
 <span className="truncate group-data-[collapsible=icon]:hidden">{item.label}</span>
 </div>
 </SidebarMenuButton>
 </Link>
 </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
