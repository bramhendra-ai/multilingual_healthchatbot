import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Bot,
  Languages,
  Pill,
  BarChart3,
  Droplets,
  CheckCircle,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const features = [
  {
    icon: <Languages className="w-8 h-8 text-primary" />,
    title: 'Multilingual Chatbot',
    description:
      'Ask health queries in English, Hindi, Telugu, or Tamil and get instant, helpful responses.',
  },
  {
    icon: <Pill className="w-8 h-8 text-primary" />,
    title: 'Medicine Reminders',
    description:
      'Never miss a dose with our smart reminder system. Track your adherence and stay on top of your health.',
  },
  {
    icon: <Droplets className="w-8 h-8 text-primary" />,
    title: 'Water Intake Tracking',
    description:
      'Stay hydrated with gentle reminders throughout the day. Log your water intake effortlessly.',
  },
  {
    icon: <BarChart3 className="w-8 h-8 text-primary" />,
    title: 'Health History',
    description:
      'View your weekly health summary, including medicine adherence and water intake, all in one place.',
  },
  {
    icon: <Bot className="w-8 h-8 text-primary" />,
    title: 'Symptom Checker',
    description:
      'Describe your symptoms and get AI-powered suggestions for possible conditions and next steps.',
  },
  {
    icon: <CheckCircle className="w-8 h-8 text-primary" />,
    title: 'Personalized Dashboard',
    description:
      'Your health, your dashboard. Everything you need, from reminders to reports, tailored to you.',
  },
];

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero');

  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Pill className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-headline font-bold text-foreground">
            MediMind
          </h1>
        </div>
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/login">Sign Up</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-grow">
        <section className="relative py-20 md:py-32 bg-secondary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-6xl font-headline font-bold text-foreground tracking-tight">
              Your Health, Understood
            </h2>
            <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
              MediMind is your personal health assistant, providing multilingual
              support, smart reminders, and AI-powered insights to help you
              manage your well-being.
            </p>
            <div className="mt-10">
              <Button size="lg" asChild>
                <Link href="/login">Get Started for Free</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 md:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h3 className="text-3xl md:text-4xl font-headline font-bold text-foreground">
                A Smarter Way to Stay Healthy
              </h3>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Explore the features that make MediMind an essential tool for
                your health journey.
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card
                  key={feature.title}
                  className="bg-card hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="flex flex-row items-center gap-4">
                    {feature.icon}
                    <CardTitle className="font-headline text-xl">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-secondary py-20 md:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-3xl md:text-4xl font-headline font-bold text-foreground">
              Ready to take control of your health?
            </h3>
            <p className="mt-4 text-lg text-muted-foreground">
              Join MediMind today and experience a new level of personal health
              management.
            </p>
            <div className="mt-8">
              <Button size="lg" asChild>
                <Link href="/login">Sign Up Now</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} MediMind. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
