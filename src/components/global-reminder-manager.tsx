'use client';

import { useEffect, useState } from 'react';
import { useReminders } from '@/hooks/use-reminders';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/use-translation';
import { format } from 'date-fns';

export default function GlobalReminderManager() {
  const {
    medicines,
    medicineRemindersEnabled,
    waterReminder,
    handleTakenChange,
  } = useReminders();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [notificationPermission, setNotificationPermission] = useState('default');

  useEffect(() => {
    setNotificationPermission(Notification.permission);
  }, []);

  // Medicine Reminder Check
  useEffect(() => {
    if (!medicineRemindersEnabled || notificationPermission !== 'granted') return;

    const checkReminders = () => {
      const now = new Date();
      const today = format(now, 'yyyy-MM-dd');
      const currentTime = format(now, 'HH:mm');

      medicines.forEach((med) => {
        med.times.forEach((time, index) => {
          const takenToday = med.taken[today] && med.taken[today][index];
          if (time === currentTime && !takenToday) {
            const notificationBody = `${t('medicine_notification_body_part1')} ${
              med.name
            } ${med.dosage} ${t('medicine_notification_body_part2')}`;

            // In-app toast notification
            toast({
              title: t('medicine_notification_title'),
              description: notificationBody,
            });

            // Browser notification
            new Notification(t('medicine_notification_title'), {
              body: notificationBody,
              icon: '/logo.svg',
            });
          }
        });
      });
    };

    const interval = setInterval(checkReminders, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [
    medicines,
    medicineRemindersEnabled,
    t,
    toast,
    notificationPermission,
    handleTakenChange,
  ]);

  // Water Reminder Check
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (waterReminder.isEnabled && notificationPermission === 'granted') {
      const intervalInMs = parseInt(waterReminder.interval) * 60 * 60 * 1000;
      timer = setInterval(() => {
        toast({
            title: t('water_reminder_title'),
            description: t('water_notification_body'),
        });
        new Notification(t('water_reminder_title'), {
          body: t('water_notification_body'),
          icon: '/logo.svg',
        });
      }, intervalInMs);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [
    waterReminder.isEnabled,
    waterReminder.interval,
    t,
    notificationPermission,
    toast,
  ]);

  return null;
}
