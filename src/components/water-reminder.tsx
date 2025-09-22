'use client';
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
import { Switch } from '@/components/ui/switch';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Droplets, Minus, Plus } from 'lucide-react';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { useTranslation } from '@/hooks/use-translation';
import { useToast } from '@/hooks/use-toast';

const GLASS_ML = 250;
const BOTTLE_ML = 500;

export default function WaterReminder() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isEnabled, setIsEnabled] = useState(true);
  const [interval, setInterval] = useState('2'); // in hours
  const [intake, setIntake] = useState(0);
  const [waterGoal, setWaterGoal] = useState(2000);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (isEnabled && Notification.permission === 'granted') {
      const intervalInMs = parseInt(interval) * 60 * 60 * 1000;
      timer = setInterval(() => {
        new Notification(t('water_reminder_title'), {
          body: t('water_notification_body'),
          icon: '/logo.svg', // Assuming you have a logo in public
        });
      }, intervalInMs);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isEnabled, interval, t]);

  useEffect(() => {
    if (isEnabled && Notification.permission !== 'granted') {
      Notification.requestPermission().then((permission) => {
        if (permission !== 'granted') {
          toast({
            title: t('notification_permission_denied_title'),
            description: t('notification_permission_denied_description'),
            variant: 'destructive',
          });
          setIsEnabled(false);
        }
      });
    }
  }, [isEnabled, toast, t]);

  const handleAddWater = (amount: number) => {
    setIntake((prev) => Math.min(prev + amount, waterGoal * 2)); // Cap at 2x goal
  };

  const handleReset = () => {
    setIntake(0);
  };

  const handleGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newGoal = parseInt(e.target.value, 10);
    if (!isNaN(newGoal) && newGoal > 0) {
      setWaterGoal(newGoal);
    } else if (e.target.value === '') {
      setWaterGoal(0);
    }
  };

  const progressPercentage = waterGoal > 0 ? (intake / waterGoal) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">
          {t('water_reminder_title')}
        </CardTitle>
        <CardDescription>{t('water_reminder_description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="water-reminder-switch">
              {t('enable_reminders_label')}
            </Label>
            <Switch
              id="water-reminder-switch"
              checked={isEnabled}
              onCheckedChange={setIsEnabled}
            />
          </div>
          {isEnabled && (
            <div className="flex items-center justify-between">
              <Label htmlFor="water-interval-select">
                {t('remind_me_every_label')}
              </Label>
              <Select value={interval} onValueChange={setInterval}>
                <SelectTrigger id="water-interval-select" className="w-[180px]">
                  <SelectValue placeholder={t('select_interval_placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">{t('interval_1_hour')}</SelectItem>
                  <SelectItem value="2">{t('interval_2_hours')}</SelectItem>
                  <SelectItem value="3">{t('interval_3_hours')}</SelectItem>
                  <SelectItem value="4">{t('interval_4_hours')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{t('todays_intake_title')}</h3>
            <div className="flex items-center gap-2">
              <Label
                htmlFor="water-goal"
                className="text-sm text-muted-foreground"
              >
                {t('goal_label')}:
              </Label>
              <Input
                id="water-goal"
                type="number"
                value={waterGoal}
                onChange={handleGoalChange}
                className="w-24 h-8"
                min="1"
                step="100"
              />
              <span className="text-sm text-muted-foreground">ml</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-primary">{intake}ml</p>
          </div>
          <Progress value={progressPercentage} />
          <div>
            <p className="text-center text-sm text-muted-foreground">
              {t('log_water_intake_label')}
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => handleAddWater(GLASS_ML)}
              >
                <Plus className="mr-2" /> {t('add_a_glass_button')} ({GLASS_ML}
                ml)
              </Button>
              <Button
                variant="outline"
                onClick={() => handleAddWater(BOTTLE_ML)}
              >
                <Plus className="mr-2" /> {t('add_a_bottle_button')} (
                {BOTTLE_ML}ml)
              </Button>
            </div>
            <div className="mt-2">
              <Button
                variant="link"
                className="w-full text-muted-foreground"
                onClick={handleReset}
              >
                {t('reset_intake_button')}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
