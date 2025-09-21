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
import { Button } from './ui/button';
import { Droplets, Minus, Plus } from 'lucide-react';
import { Progress } from './ui/progress';
import { Input } from './ui/input';

const GLASS_ML = 250;
const BOTTLE_ML = 500;

export default function WaterReminder() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [interval, setInterval] = useState('2'); // in hours
  const [intake, setIntake] = useState(0);
  const [waterGoal, setWaterGoal] = useState(2000);

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
        <CardTitle className="font-headline">Water Reminder & Log</CardTitle>
        <CardDescription>
          Stay hydrated and track your intake throughout the day.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
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
        </div>

        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Today's Intake</h3>
             <div className="flex items-center gap-2">
              <Label htmlFor="water-goal" className="text-sm text-muted-foreground">Goal:</Label>
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
              Log your water intake:
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => handleAddWater(GLASS_ML)}
              >
                <Plus className="mr-2" /> Add a Glass ({GLASS_ML}ml)
              </Button>
              <Button
                variant="outline"
                onClick={() => handleAddWater(BOTTLE_ML)}
              >
                <Plus className="mr-2" /> Add a Bottle ({BOTTLE_ML}ml)
              </Button>
            </div>
            <div className="mt-2">
              <Button
                variant="link"
                className="w-full text-muted-foreground"
                onClick={handleReset}
              >
                Reset Intake
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
