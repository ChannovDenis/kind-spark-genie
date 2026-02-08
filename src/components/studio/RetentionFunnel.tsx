import { Progress } from '@/components/ui/progress';
import { retentionBenchmarks } from '@/data/studioData';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface RetentionFunnelProps {
  hookRate: number;
  retention10s: number;
  retention30s: number;
  completionRate: number;
  showBenchmarks?: boolean;
}

export function RetentionFunnel({ 
  hookRate, 
  retention10s, 
  retention30s, 
  completionRate,
  showBenchmarks = true 
}: RetentionFunnelProps) {
  const stages = [
    { 
      label: '0-3 сек (Hook)', 
      value: hookRate, 
      benchmark: retentionBenchmarks.hookRate,
      description: 'Удержание на хуке'
    },
    { 
      label: '3-10 сек', 
      value: retention10s, 
      benchmark: retentionBenchmarks.retention10s,
      description: 'Вовлечение'
    },
    { 
      label: '10-30 сек', 
      value: retention30s, 
      benchmark: retentionBenchmarks.retention30s,
      description: 'Основной контент'
    },
    { 
      label: '30+ сек', 
      value: completionRate, 
      benchmark: retentionBenchmarks.completionRate,
      description: 'До конца'
    },
  ];

  const getValueColor = (value: number, benchmark: number) => {
    const diff = value - benchmark;
    if (diff >= 5) return 'text-success';
    if (diff >= -5) return 'text-warning';
    return 'text-destructive';
  };

  const getProgressColor = (value: number, benchmark: number) => {
    const diff = value - benchmark;
    if (diff >= 5) return '[&>div]:bg-success';
    if (diff >= -5) return '[&>div]:bg-warning';
    return '[&>div]:bg-destructive';
  };

  const getTrendIcon = (value: number, benchmark: number) => {
    const diff = value - benchmark;
    if (diff >= 5) return <TrendingUp className="h-3 w-3 text-success" />;
    if (diff >= -5) return <Minus className="h-3 w-3 text-warning" />;
    return <TrendingDown className="h-3 w-3 text-destructive" />;
  };

  return (
    <div className="space-y-4">
      {stages.map((stage, idx) => (
        <div key={idx} className="space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium">{stage.label}</span>
              {showBenchmarks && getTrendIcon(stage.value, stage.benchmark)}
            </div>
            <div className="flex items-center gap-2">
              <span className={cn("font-semibold", getValueColor(stage.value, stage.benchmark))}>
                {stage.value}%
              </span>
              {showBenchmarks && (
                <span className="text-xs text-muted-foreground">
                  / {stage.benchmark}%
                </span>
              )}
            </div>
          </div>
          <Progress 
            value={stage.value} 
            className={cn("h-2", getProgressColor(stage.value, stage.benchmark))}
          />
        </div>
      ))}

      {showBenchmarks && (
        <div className="pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Сравнение с бенчмарками ниши. Зелёный — выше среднего, жёлтый — в норме, красный — требует улучшения.
          </p>
        </div>
      )}
    </div>
  );
}
