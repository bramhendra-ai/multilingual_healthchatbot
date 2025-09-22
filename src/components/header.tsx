'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useTranslation } from '@/hooks/use-translation';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const getTitle = () => {
    switch (pathname) {
      case '/dashboard':
        return t('sidebar_dashboard');
      case '/chatbot':
        return t('sidebar_health_assistant');
      case '/reminders':
        return t('sidebar_reminders');
      case '/history':
        return t('sidebar_history');
      case '/profile':
        return t('sidebar_profile');
      default:
        return 'MediMind';
    }
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-8">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <h1 className="flex-1 text-xl font-headline font-semibold">{getTitle()}</h1>
    </header>
  );
}
