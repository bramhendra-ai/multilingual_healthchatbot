import AuthForm from '@/components/auth-form';
import { Pill } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <Pill className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-headline font-bold text-foreground">
              MediMind
            </h1>
          </Link>
          <p className="mt-2 text-muted-foreground">
            Your personal health assistant awaits.
          </p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
}
