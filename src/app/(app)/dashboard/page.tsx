'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, Bot, BellRing, BarChart3 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const welcomeImage = PlaceHolderImages.find(
    (img) => img.id === 'dashboard-welcome'
  );
  const now = new Date();
  const greeting =
    now.getHours() < 12
      ? 'Good Morning'
      : now.getHours() < 18
      ? 'Good Afternoon'
      : 'Good Evening';

  const quickLinks = [
    {
      href: '/chatbot',
      title: 'Ask our Assistant',
      description: 'Get answers to your health questions.',
      icon: <Bot className="w-6 h-6 text-primary" />,
    },
    {
      href: '/reminders',
      title: 'Manage Reminders',
      description: 'Set up new medicine or water reminders.',
      icon: <BellRing className="w-6 h-6 text-primary" />,
    },
    {
      href: '/history',
      title: 'View Your History',
      description: 'Check your health reports and progress.',
      icon: <BarChart3 className="w-6 h-6 text-primary" />,
    },
  ];

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="p-8">
            <h1 className="text-3xl font-headline font-bold text-foreground">
              {greeting}, {user?.displayName || 'User'}!
            </h1>
            <p className="mt-2 text-muted-foreground">
              Here&apos;s a quick look at your health dashboard. Stay on top of
              your well-being.
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
          Quick Actions
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
                    Go to {link.title.split(' ')[1]}
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
          <CardTitle className="font-headline">Today&apos;s Summary</CardTitle>
          <CardDescription>A snapshot of your tasks for today.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
            <Card className='bg-secondary'>
                <CardHeader>
                    <CardTitle className='text-lg'>Medicine Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className='text-3xl font-bold'>2 / 4</p>
                    <p className='text-muted-foreground'>Doses taken today</p>
                </CardContent>
            </Card>
            <Card className='bg-secondary'>
                <CardHeader>
                    <CardTitle className='text-lg'>Water Intake</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className='text-3xl font-bold'>5 / 8</p>
                    <p className='text-muted-foreground'>Glasses drunk today</p>
                </CardContent>
            </Card>
        </CardContent>
      </Card>

    </div>
  );
}
