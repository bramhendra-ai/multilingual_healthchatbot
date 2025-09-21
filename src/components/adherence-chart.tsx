'use client';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartData = [
  { day: 'Mon', adherence: 80 },
  { day: 'Tue', adherence: 90 },
  { day: 'Wed', adherence: 75 },
  { day: 'Thu', adherence: 100 },
  { day: 'Fri', adherence: 85 },
  { day: 'Sat', adherence: 95 },
  { day: 'Sun', adherence: 100 },
];

const chartConfig = {
  adherence: {
    label: 'Adherence',
    color: 'hsl(var(--primary))',
  },
};

export default function AdherenceChart() {
  return (
    <div className="h-80 w-full">
      <ChartContainer config={chartConfig} className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
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
              tickFormatter={(value) => `${value}%`}
              domain={[0, 100]}
            />
             <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <Bar
              dataKey="adherence"
              fill="var(--color-adherence)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
