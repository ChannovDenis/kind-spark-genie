import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatChartDate } from '@/lib/formatters';

// Генерируем данные для burn-down графика
const generateBurndownData = () => {
  const data = [];
  const totalBudget = 15000;
  let remaining = totalBudget;
  
  for (let day = 1; day <= 28; day++) {
    const planned = totalBudget - (totalBudget / 28) * day;
    const dailyUsage = Math.floor(Math.random() * 200) + 400;
    remaining = Math.max(0, remaining - dailyUsage);
    
    const date = new Date(2026, 1, day); // Февраль 2026
    data.push({
      day: formatChartDate(date),
      planned: Math.round(planned),
      actual: remaining,
    });
  }
  
  return data;
};

const burndownData = generateBurndownData();

export function BurndownChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={burndownData}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="hsl(217, 33%, 25%)" 
            vertical={false}
          />
          <XAxis 
            dataKey="day" 
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
              name === 'planned' ? 'План' : 'Факт'
            ]}
          />
          <Line
            type="monotone"
            dataKey="planned"
            stroke="hsl(215, 20%, 65%)"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="hsl(217, 91%, 60%)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
