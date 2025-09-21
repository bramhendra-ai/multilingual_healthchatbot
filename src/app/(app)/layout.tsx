'use client';

import { AuthGuard, useAuth } from '@/hooks/use-auth';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from '@/components/ui/sidebar';
import AppSidebar from '@/components/app-sidebar';
import Header from '@/components/header';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <Sidebar>
          <AppSidebar />
        </Sidebar>
        <SidebarInset>
          <div className="flex flex-col h-screen">
            <Header />
            <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-secondary/50">
              {children}
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
