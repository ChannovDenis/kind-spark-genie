import { Users, Activity, TrendingUp, DollarSign } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';

import { PageHeader } from '@/components/shared/PageHeader';
import { MetricCard } from '@/components/shared/MetricCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockAnalyticsData } from '@/data/superData';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export default function Analytics() {
  const data = mockAnalyticsData;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Аналитика"
        description="Глобальные метрики платформы"
      />

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="DAU"
          value={data.dau.toLocaleString('ru-RU')}
          change={data.dauTrend}
          changeLabel="vs вчера"
          icon={<Users className="h-5 w-5" />}
        />
        <MetricCard
          title="WAU"
          value={data.wau.toLocaleString('ru-RU')}
          change={data.wauTrend}
          changeLabel="vs прошлая неделя"
          icon={<Activity className="h-5 w-5" />}
        />
        <MetricCard
          title="MAU"
          value={data.mau.toLocaleString('ru-RU')}
          change={data.mauTrend}
          changeLabel="vs прошлый месяц"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <MetricCard
          title="MRR"
          value={`${(data.mrr / 1000000).toFixed(2)} M ₽`}
          change={data.mrrTrend}
          changeLabel="vs прошлый месяц"
          icon={<DollarSign className="h-5 w-5" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tenant Activity - Stacked Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Активность по тенантам</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.tenantActivity}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="gpb" name="ГПБ" stackId="a" fill="hsl(var(--primary))" />
                  <Bar dataKey="wb" name="Wildberries" stackId="a" fill="hsl(var(--chart-2))" />
                  <Bar dataKey="gosuslugi" name="ГосУслуги" stackId="a" fill="hsl(var(--chart-3))" />
                  <Bar dataKey="demo" name="Demo" stackId="a" fill="hsl(var(--chart-4))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Service Distribution - Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Распределение по сервисам</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.serviceDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                    labelLine={false}
                  >
                    {data.serviceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* MRR History - Area Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">MRR по месяцам</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.mrrHistory}>
                <defs>
                  <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis
                  className="text-xs"
                  tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`${value.toLocaleString('ru-RU')} ₽`, 'MRR']}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  fill="url(#mrrGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
