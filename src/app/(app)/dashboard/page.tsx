'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { useTranslation } from '@/hooks/use-translation';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, Bot, BellRing, BarChart3 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { useReminders } from '@/hooks/use-reminders';
import { format, addDays } from 'date-fns';

const ML_PER_GLASS = 250;

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { medicines, waterReminder } = useReminders();
  const welcomeImage = PlaceHolderImages.find(
    (img) => img.id === 'dashboard-welcome'
  );
  
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    if (hour < 12) {
      setGreeting(t('greeting_morning'));
    } else if (hour < 18) {
      setGreeting(t('greeting_afternoon'));
    } else {
      setGreeting(t('greeting_evening'));
    }
  }, [t]);


  const quickLinks = [
    {
      href: '/chatbot',
      title: t('quick_link_assistant_title'),
      description: t('quick_link_assistant_description'),
      icon: <Bot className="w-6 h-6 text-primary" />,
      cta: t('quick_link_assistant_cta'),
    },
    {
      href: '/reminders',
      title: t('quick_link_reminders_title'),
      description: t('quick_link_reminders_description'),
      icon: <BellRing className="w-6 h-6 text-primary" />,
      cta: t('quick_link_reminders_cta'),
    },
    {
      href: '/history',
      title: t('quick_link_history_title'),
      description: t('quick_link_history_description'),
      icon: <BarChart3 className="w-6 h-6 text-primary" />,
      cta: t('quick_link_history_cta'),
    },
  ];

  const { dosesTaken, totalDoses } = useMemo(() => {
    const today = new Date();
    const dateString = format(today, 'yyyy-MM-dd');
    let taken = 0;
    let total = 0;

    medicines.forEach((med) => {
      const startDate = new Date(med.startDate);
      const endDate = addDays(startDate, med.duration);
      if (today >= startDate && today <= endDate) {
        total += med.times.length;
        const takenRecord = med.taken[dateString];
        if (takenRecord) {
          taken += takenRecord.filter(Boolean).length;
        }
      }
    });
    return { dosesTaken: taken, totalDoses: total };
  }, [medicines]);

  const waterIntake = useMemo(() => {
    const glassesDrunk = Math.round(waterReminder.intake / ML_PER_GLASS);
    const goalGlasses = Math.round(waterReminder.goal / ML_PER_GLASS);
    return { glassesDrunk, goalGlasses };
  }, [waterReminder.intake, waterReminder.goal]);


  return (
    <div className="space-y-8">
      <Card className="overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="p-8">
            <h1 className="text-3xl font-headline font-bold text-foreground">
              {greeting}, {user?.displayName || 'User'}!
            </h1>
            <p className="mt-2 text-muted-foreground">
             {t('dashboard_welcome_message')}
            </p>
          </div>
          {welcomeImage && (
            <div className="relative h-48 md:h-full">
              <Image
                src={welcomeImage.imageUrl}
                alt={welcomeImage.description}
                data-ai-hint={welcomeImage.imageHint}
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
      </Card>

      <div>
        <h2 className="text-2xl font-headline font-semibold mb-4">
          {t('quick_actions_title')}
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((link) => (
            <Link href={link.href} key={link.href} className="group">
              <Card className="h-full hover:border-primary transition-colors">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="font-headline text-lg">
                      {link.title}
                    </CardTitle>
                    <CardDescription>{link.description}</CardDescription>
                  </div>
                  {link.icon}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-primary group-hover:underline">
                    {link.cta}
                    <ArrowRight className="ml-1 w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">{t('todays_summary_title')}</CardTitle>
          <CardDescription>{t('todays_summary_description')}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
            <Card className='bg-secondary'>
                <CardHeader>
                    <CardTitle className='text-lg'>{t('medicine_status_title')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className='text-3xl font-bold'>{dosesTaken} / {totalDoses}</p>
                    <p className='text-muted-foreground'>{t('doses_taken_today')}</p>
                </CardContent>
            </Card>
            <Card className='bg-secondary'>
                <CardHeader>
                    <CardTitle className='text-lg'>{t('water_intake_title')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className='text-3xl font-bold'>{waterIntake.glassesDrunk} / {waterIntake.goalGlasses}</p>
                    <p className='text-muted-foreground'>{t('glasses_drunk_today')}</p>
                </CardContent>
            </Card>
        </CardContent>
      </Card>

    </div>
  );
}
