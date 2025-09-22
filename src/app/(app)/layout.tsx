'use client';

import { AuthGuard } from '@/hooks/use-auth';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from '@/components/ui/sidebar';
import AppSidebar from '@/components/app-sidebar';
import Header from '@/components/header';
import { ReminderProvider } from '@/hooks/use-reminders';
import GlobalReminderManager from '@/components/global-reminder-manager';
import { TooltipProvider } from '@/components/ui/tooltip';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <ReminderProvider>
        <TooltipProvider>
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
          <GlobalReminderManager />
        </TooltipProvider>
      </ReminderProvider>
    </AuthGuard>
  );
}
