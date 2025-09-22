'use client';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useReminders } from '@/hooks/use-reminders';
import { useMemo } from 'react';
import { format, subDays } from 'date-fns';

const chartConfig = {
  glasses: {
    label: 'Glasses',
    color: 'hsl(var(--chart-2))',
  },
  goal: {
    label: 'Goal',
    color: 'hsl(var(--foreground))',
  },
};

const ML_PER_GLASS = 250;

export default function WaterChart() {
  const { waterReminder } = useReminders();
  const { history, goal } = waterReminder;

  const chartData = useMemo(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateString = format(date, 'yyyy-MM-dd');
      const dayLabel = format(date, 'E');

      const intakeInMl = history[dateString] || 0;
      const glasses = Math.round(intakeInMl / ML_PER_GLASS);
      data.push({
        day: dayLabel,
        glasses: glasses,
        goal: Math.round(goal / ML_PER_GLASS),
      });
    }
    return data;
  }, [history, goal]);

  return (
    <div className="h-80 w-full">
      <ChartContainer config={chartConfig} className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 20, left: -10, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              type="monotone"
              dataKey="glasses"
              stroke="var(--color-glasses)"
              strokeWidth={2}
              dot={{
                fill: 'var(--color-glasses)',
                r: 4,
              }}
            />
            <Line
              type="monotone"
              dataKey="goal"
              stroke="var(--color-goal)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
