'use client';

import { useAuth } from '@/hooks/use-auth';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

const languages = [
  { value: 'English', label: 'English' },
  { value: 'Hindi', label: 'हिंदी (Hindi)' },
  { value: 'Telugu', label: 'తెలుగు (Telugu)' },
  { value: 'Tamil', label: 'தமிழ் (Tamil)' },
];

export default function ProfilePage() {
  const { user } = useAuth();
  const { t, setLanguage, language } = useTranslation();
  const { toast } = useToast();
  const [name, setName] = useState(user?.displayName || '');
  const [loading, setLoading] = useState(false);

  const handleSaveChanges = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      // In a real app, you'd update the user profile in your backend
      console.log('Saving profile:', { name, language });
      toast({
        title: t('profile_updated_toast_title'),
        description: t('profile_updated_toast_description'),
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-8">
       <div>
          <h1 className="text-3xl font-headline font-bold">{t('profile_title')}</h1>
          <p className="text-muted-foreground">
            {t('profile_description')}
          </p>
        </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">{t('personal_information_title')}</CardTitle>
          <CardDescription>{t('personal_information_description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('name_label')}</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t('email_label')}</Label>
            <Input id="email" type="email" value={user?.email || ''} disabled />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">{t('preferences_title')}</CardTitle>
          <CardDescription>
            {t('preferences_description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="language">{t('preferred_language_label')}</Label>
             <Select value={language} onValueChange={(value) => setLanguage(value as 'English' | 'Hindi' | 'Telugu' | 'Tamil')}>
                  <SelectTrigger id="language-select" className="w-[180px]">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
          </div>
        </CardContent>
      </Card>
      <div>
        <Button onClick={handleSaveChanges} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t('save_changes_button')}
        </Button>
      </div>
    </div>
  );
}
