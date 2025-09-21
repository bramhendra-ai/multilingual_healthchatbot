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
import { Pill, PlusCircle, Clock } from 'lucide-react';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from './ui/input';
import { useState } from 'react';
import type { Medicine } from '@/lib/types';
import { addDays, format } from 'date-fns';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';

const medicineSchema = z.object({
  name: z.string().min(1, 'Medicine name is required'),
  dosage: z.string().min(1, 'Dosage is required (e.g., 500mg)'),
  times: z.string().min(1, 'Please enter at least one time (e.g., 08:00, 20:00)'),
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

  const form = useForm<z.infer<typeof medicineSchema>>({
    resolver: zodResolver(medicineSchema),
    defaultValues: {
      name: '',
      dosage: '',
      times: '',
      duration: 7,
    },
  });

  const onSubmit = (values: z.infer<typeof medicineSchema>) => {
    const newMedicine: Medicine = {
      id: String(Date.now()),
      name: values.name,
      dosage: values.dosage,
      times: values.times.split(',').map((t) => t.trim()),
      duration: values.duration,
      startDate: new Date(),
      taken: {},
    };
    setMedicines((prev) => [...prev, newMedicine]);
    form.reset();
    setIsDialogOpen(false);
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-headline">Medicine Reminders</CardTitle>
          <CardDescription>
            Manage your medication schedule for today.
          </CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Medicine
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Medicine</DialogTitle>
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
                      <FormLabel>Medicine Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Paracetamol" {...field} />
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
                      <FormLabel>Dosage</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 500mg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="times"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Times (24h format, comma-separated)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 08:00, 20:00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (in days)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Save Medicine</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Medicine</TableHead>
              <TableHead>Dosage</TableHead>
              <TableHead>Schedule for Today</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medicines.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center h-24">
                  No medicines added yet.
                </TableCell>
              </TableRow>
            ) : (
              medicines.map((med) => (
                <TableRow key={med.id}>
                  <TableCell className="font-medium">{med.name}</TableCell>
                  <TableCell>{med.dosage}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-4">
                      {med.times.map((time, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`${med.id}-${time}`}
                            checked={med.taken[today]?.[index] || false}
                            onCheckedChange={(checked) =>
                              handleTakenChange(med.id, today, index, !!checked)
                            }
                          />
                          <label
                            htmlFor={`${med.id}-${time}`}
                            className="flex items-center gap-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            {time}
                          </label>
                        </div>
                      ))}
                    </div>
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
