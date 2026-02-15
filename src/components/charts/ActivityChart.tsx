import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { activityChartData } from '@/data/tenantMetrics';

interface ActivityChartProps {
  tenantId: string;
}

export function ActivityChart({ tenantId }: ActivityChartProps) {
  const data = activityChartData[tenantId] || activityChartData.dobroservice;

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorEsc" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0} />
            </linearGradient>
          </defs>
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
            interval={4}
          />
          <YAxis 
            tick={{ fill: 'hsl(215, 20%, 65%)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={50}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(217, 33%, 17%)',
              border: '1px solid hsl(217, 33%, 25%)',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            }}
            labelStyle={{ color: 'hsl(210, 40%, 98%)' }}
            itemStyle={{ color: 'hsl(210, 40%, 98%)' }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: 16 }}
            formatter={(value) => (
              <span style={{ color: 'hsl(215, 20%, 65%)' }}>
                {value === 'aiRequests' ? 'AI-запросы' : 'Эскалации'}
              </span>
            )}
          />
          <Area
            type="monotone"
            dataKey="aiRequests"
            name="aiRequests"
            stroke="hsl(217, 91%, 60%)"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorAi)"
          />
          <Area
            type="monotone"
            dataKey="escalations"
            name="escalations"
            stroke="hsl(38, 92%, 50%)"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorEsc)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
