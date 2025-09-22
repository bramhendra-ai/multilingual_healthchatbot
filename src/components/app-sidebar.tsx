'use client';

import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/use-auth';
import {
  LayoutDashboard,
  Bot,
  BellRing,
  BarChart3,
  LogOut,
  Pill,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useTranslation } from '@/hooks/use-translation';

export default function AppSidebar() {
  const pathname = usePathname();
  const { user, signOut, loading } = useAuth();
  const { t } = useTranslation();
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');

  const navItems = [
    { href: '/dashboard', icon: <LayoutDashboard />, label: t('sidebar_dashboard') },
    { href: '/chatbot', icon: <Bot />, label: t('sidebar_health_assistant') },
    { href: '/reminders', icon: <BellRing />, label: t('sidebar_reminders') },
    { href: '/history', icon: <BarChart3 />, label: t('sidebar_history') },
    { href: '/profile', icon: <User />, label: t('sidebar_profile') },
  ];

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('');
  };

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <Pill className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-headline font-bold text-foreground">
            MediMind
          </h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <div className="flex items-center gap-3 p-2">
          <Avatar>
            {userAvatar && <AvatarImage src={userAvatar.imageUrl} />}
            <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold truncate">
              {user?.displayName || 'User'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
          <SidebarMenuButton
            variant="ghost"
            size="icon"
            className="group-data-[collapsible=icon]:hidden text-muted-foreground hover:text-foreground"
            onClick={signOut}
            tooltip={t('sidebar_logout')}
          >
            <LogOut />
          </SidebarMenuButton>
        </div>
      </SidebarFooter>
    </>
  );
}
