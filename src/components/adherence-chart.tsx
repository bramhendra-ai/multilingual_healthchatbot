'use client';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { useReminders } from '@/hooks/use-reminders';
import { useMemo } from 'react';
import { format, subDays } from 'date-fns';

const chartConfig = {
  adherence: {
    label: 'Adherence',
    color: 'hsl(var(--primary))',
  },
};

export default function AdherenceChart() {
  const { medicines } = useReminders();

  const chartData = useMemo(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateString = format(date, 'yyyy-MM-dd');
      const dayLabel = format(date, 'E'); // 'Mon', 'Tue', etc.

      let totalDoses = 0;
      let takenDoses = 0;

      medicines.forEach((med) => {
        // Check if the medicine was active on this day
        const startDate = new Date(med.startDate);
        const endDate = addDays(startDate, med.duration);
        if (date >= startDate && date <= endDate) {
          const dailyDoses = med.times.length;
          totalDoses += dailyDoses;

          const takenRecord = med.taken[dateString];
          if (takenRecord) {
            takenDoses += takenRecord.filter(Boolean).length;
          }
        }
      });

      const adherence = totalDoses > 0 ? (takenDoses / totalDoses) * 100 : 0;
      data.push({ day: dayLabel, adherence: Math.round(adherence) });
    }
    return data;
  }, [medicines]);

  return (
    <div className="h-80 w-full">
      <ChartContainer config={chartConfig} className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 20, left: -10, bottom: 0 }}
          >
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
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
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

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
