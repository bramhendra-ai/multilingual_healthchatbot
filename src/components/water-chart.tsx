'use client';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartData = [
  { day: 'Mon', glasses: 8 },
  { day: 'Tue', glasses: 7 },
  { day: 'Wed', glasses: 9 },
  { day: 'Thu', glasses: 8 },
  { day: 'Fri', glasses: 10 },
  { day: 'Sat', glasses: 11 },
  { day: 'Sun', glasses: 9 },
];

const chartConfig = {
  glasses: {
    label: 'Glasses',
    color: 'hsl(var(--chart-2))',
  },
};

export default function WaterChart() {
  return (
    <div className="h-80 w-full">
      <ChartContainer config={chartConfig} className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
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
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
