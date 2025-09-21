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
import { useState } from 'react';

export default function WaterReminder() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [interval, setInterval] = useState('2'); // in hours

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Water Reminder</CardTitle>
        <CardDescription>
          Stay hydrated throughout the day.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="water-reminder-switch">Enable Reminders</Label>
          <Switch
            id="water-reminder-switch"
            checked={isEnabled}
            onCheckedChange={setIsEnabled}
          />
        </div>
        {isEnabled && (
          <div className="flex items-center justify-between">
            <Label htmlFor="water-interval-select">Remind me every</Label>
            <Select value={interval} onValueChange={setInterval}>
              <SelectTrigger id="water-interval-select" className="w-[180px]">
                <SelectValue placeholder="Select interval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 hour</SelectItem>
                <SelectItem value="2">2 hours</SelectItem>
                <SelectItem value="3">3 hours</SelectItem>
                <SelectItem value="4">4 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
