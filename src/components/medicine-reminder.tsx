'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from './ui/button';
import {
  Pill,
  PlusCircle,
  Clock,
  Trash2,
  Bell,
  BellOff,
  X,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from './ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from './ui/input';
import { useState, useEffect } from 'react';
import type { Medicine } from '@/lib/types';
import { addDays, format } from 'date-fns';
import { Checkbox } from './ui/checkbox';
import { useTranslation } from '@/hooks/use-translation';
import { useToast } from '@/hooks/use-toast';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

const timeStringSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format. Use HH:mm');

const medicineSchema = z.object({
  name: z.string().min(1, 'Medicine name is required'),
  dosage: z.string().min(1, 'Dosage is required (e.g., 500mg)'),
  times: z
    .array(timeStringSchema)
    .min(1, 'Please enter at least one time.'),
  duration: z.coerce.number().min(1, 'Duration must be at least 1 day'),
});

const mockMedicines: Medicine[] = [
  {
    id: '1',
    name: 'Paracetamol',
    dosage: '500mg',
    times: ['09:00', '21:00'],
    duration: 7,
    startDate: new Date(),
    taken: {
      [format(new Date(), 'yyyy-MM-dd')]: [false, false],
    },
  },
  {
    id: '2',
    name: 'Vitamin C',
    dosage: '1000mg',
    times: ['12:00'],
    duration: 30,
    startDate: addDays(new Date(), -5),
    taken: {
      [format(new Date(), 'yyyy-MM-dd')]: [true],
    },
  },
];

export default function MedicineReminder() {
  const [medicines, setMedicines] = useState<Medicine[]>(mockMedicines);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const { t } = useTranslation();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof medicineSchema>>({
    resolver: zodResolver(medicineSchema),
    defaultValues: {
      name: '',
      dosage: '',
      times: ['09:00'],
      duration: 7,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'times',
  });

  useEffect(() => {
    if (!remindersEnabled) return;

    const checkReminders = () => {
      const now = new Date();
      const today = format(now, 'yyyy-MM-dd');
      const currentTime = format(now, 'HH:mm');

      medicines.forEach((med) => {
        med.times.forEach((time, index) => {
          const takenToday = med.taken[today] && med.taken[today][index];
          if (time === currentTime && !takenToday) {
            new Notification(t('medicine_notification_title'), {
              body: `${t('medicine_notification_body_part1')} ${med.name} ${
                med.dosage
              } ${t('medicine_notification_body_part2')}`,
              icon: '/logo.svg',
            });
          }
        });
      });
    };

    const interval = setInterval(checkReminders, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [medicines, remindersEnabled, t]);

  const toggleReminders = () => {
    if (!remindersEnabled) {
      if (Notification.permission === 'granted') {
        setRemindersEnabled(true);
        toast({
          title: t('notifications_enabled_title'),
          description: t('notifications_enabled_description'),
        });
      } else {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            setRemindersEnabled(true);
            toast({
              title: t('notifications_enabled_title'),
              description: t('notifications_enabled_description'),
            });
          } else {
            toast({
              variant: 'destructive',
              title: t('notification_permission_denied_title'),
              description: t('notification_permission_denied_description'),
            });
          }
        });
      }
    } else {
      setRemindersEnabled(false);
      toast({
        title: t('notifications_disabled_title'),
        description: t('notifications_disabled_description'),
      });
    }
  };

  const onSubmit = (values: z.infer<typeof medicineSchema>) => {
    const newMedicine: Medicine = {
      id: String(Date.now()),
      name: values.name,
      dosage: values.dosage,
      times: values.times,
      duration: values.duration,
      startDate: new Date(),
      taken: {},
    };
    setMedicines((prev) => [...prev, newMedicine]);
    form.reset();
    setIsDialogOpen(false);
  };

  const removeMedicine = (id: string) => {
    setMedicines((prev) => prev.filter((med) => med.id !== id));
  };

  const handleTakenChange = (
    medId: string,
    date: string,
    timeIndex: number,
    isChecked: boolean
  ) => {
    setMedicines((prevMeds) =>
      prevMeds.map((med) => {
        if (med.id === medId) {
          const newTaken = { ...med.taken };
          if (!newTaken[date]) {
            newTaken[date] = Array(med.times.length).fill(false);
          }
          newTaken[date][timeIndex] = isChecked;
          return { ...med, taken: newTaken };
        }
        return med;
      })
    );
  };

  const today = format(new Date(), 'yyyy-MM-dd');

  const getStatus = (med: Medicine, timeIndex: number) => {
    const doseTaken = med.taken[today]?.[timeIndex];
    if (doseTaken) {
      return <Badge variant="secondary">{t('medicine_status_taken')}</Badge>;
    }

    const now = new Date();
    const [hour, minute] = med.times[timeIndex].split(':');
    const doseTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      parseInt(hour),
      parseInt(minute)
    );

    if (now > doseTime) {
      return <Badge variant="destructive">{t('medicine_status_missed')}</Badge>;
    }

    return <Badge variant="outline">{t('medicine_status_pending')}</Badge>;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-headline">
            {t('medicine_reminders_title')}
          </CardTitle>
          <CardDescription>
            {t('medicine_reminders_description')}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={remindersEnabled ? 'default' : 'outline'}
            size="icon"
            onClick={toggleReminders}
            aria-label={
              remindersEnabled
                ? t('disable_notifications_aria_label')
                : t('enable_notifications_aria_label')
            }
          >
            {remindersEnabled ? (
              <BellOff className="h-4 w-4" />
            ) : (
              <Bell className="h-4 w-4" />
            )}
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                {t('add_medicine_button')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('add_medicine_modal_title')}</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('medicine_name_label')}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('medicine_name_placeholder')}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dosage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('dosage_label')}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('dosage_placeholder')}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <FormLabel>{t('times_label')}</FormLabel>
                    <div className="space-y-2">
                      {fields.map((field, index) => (
                        <FormField
                          key={field.id}
                          control={form.control}
                          name={`times.${index}`}
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center gap-2">
                                <FormControl>
                                  <Input
                                    type="time"
                                    className="w-full"
                                    {...field}
                                  />
                                </FormControl>
                                {fields.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive"
                                    onClick={() => remove(index)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => append('09:00')}
                    >
                      {t('add_time_button')}
                    </Button>
                  </div>

                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('duration_label')}</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">{t('save_medicine_button')}</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('medicine_table_col_medicine')}</TableHead>
              <TableHead>{t('medicine_table_col_dosage')}</TableHead>
              <TableHead>{t('medicine_table_col_schedule')}</TableHead>
              <TableHead className="text-right">
                {t('medicine_table_col_actions')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medicines.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24">
                  {t('no_medicines_message')}
                </TableCell>
              </TableRow>
            ) : (
              medicines.map((med) => (
                <TableRow key={med.id}>
                  <TableCell className="font-medium">{med.name}</TableCell>
                  <TableCell>{med.dosage}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                      {med.times.map((time, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`${med.id}-${time}`}
                            checked={med.taken[today]?.[index] || false}
                            onCheckedChange={(checked) =>
                              handleTakenChange(
                                med.id,
                                today,
                                index,
                                !!checked
                              )
                            }
                          />
                          <label
                            htmlFor={`${med.id}-${time}`}
                            className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              {time}
                            </div>
                            {getStatus(med, index)}
                          </label>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMedicine(med.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
