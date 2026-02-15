import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { burndownData } from '@/data/tenantMetrics';

interface BurndownChartProps {
  tenantId?: string;
}

export function BurndownChart({ tenantId = 'dobroservice' }: BurndownChartProps) {
  const data = burndownData[tenantId] || burndownData.dobroservice;

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="hsl(217, 33%, 25%)" 
            vertical={false}
          />
          <XAxis 
            dataKey="date" 
            tick={{ fill: 'hsl(215, 20%, 65%)', fontSize: 12 }}
            axisLine={{ stroke: 'hsl(217, 33%, 25%)' }}
            tickLine={false}
            interval={3}
          />
          <YAxis 
            tick={{ fill: 'hsl(215, 20%, 65%)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={60}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(217, 33%, 17%)',
              border: '1px solid hsl(217, 33%, 25%)',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            }}
            labelStyle={{ color: 'hsl(210, 40%, 98%)' }}
            formatter={(value: number, name: string) => [
              value.toLocaleString('ru-RU'),
              name === 'plan' ? 'План' : 'Факт'
            ]}
          />
          <Line
            type="monotone"
            dataKey="plan"
            stroke="hsl(215, 20%, 65%)"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="fact"
            stroke="hsl(217, 91%, 60%)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
