'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/chatbot': 'Health Assistant',
  '/reminders': 'Reminders & Logs',
  '/history': 'Health History',
};

export default function Header() {
  const pathname = usePathname();
  const title = pageTitles[pathname] || 'MediMind';

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-8">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <h1 className="flex-1 text-xl font-headline font-semibold">{title}</h1>
    </header>
  );
}
