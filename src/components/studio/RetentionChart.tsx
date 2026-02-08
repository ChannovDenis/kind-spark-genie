import { RetentionPoint, DropOffPoint, retentionBenchmarks } from '@/data/studioData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { AlertTriangle } from 'lucide-react';

interface RetentionChartProps {
  data: RetentionPoint[];
  dropOffPoints?: DropOffPoint[];
  showBenchmark?: boolean;
  height?: number;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`;
};

export function RetentionChart({ data, dropOffPoints = [], showBenchmark = true, height = 200 }: RetentionChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[200px] text-muted-foreground">
          Нет данных для отображения
        </CardContent>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium">{formatTime(label)}</p>
          <p className="text-sm text-primary">
            Удержание: {payload[0].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-3">
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="retentionGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="time" 
            tickFormatter={formatTime}
            tick={{ fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            domain={[0, 100]}
            tick={{ fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
            width={35}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Benchmark Lines */}
          {showBenchmark && (
            <>
              <ReferenceLine 
                y={retentionBenchmarks.hookRate} 
                stroke="hsl(var(--success))" 
                strokeDasharray="3 3" 
                strokeOpacity={0.5}
              />
              <ReferenceLine 
                y={retentionBenchmarks.retention30s} 
                stroke="hsl(var(--warning))" 
                strokeDasharray="3 3" 
                strokeOpacity={0.5}
              />
            </>
          )}
          
          <Area 
            type="monotone" 
            dataKey="retention" 
            stroke="hsl(var(--primary))" 
            strokeWidth={2}
            fill="url(#retentionGradient)" 
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Drop-off Points */}
      {dropOffPoints.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            Точки оттока зрителей
          </h4>
          <div className="space-y-1">
            {dropOffPoints.map((point, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between text-sm bg-muted/50 rounded px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs bg-background px-2 py-0.5 rounded">
                    {point.time}
                  </span>
                  <span className="text-muted-foreground">{point.reason}</span>
                </div>
                <span className="text-destructive font-medium">-{point.drop}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
