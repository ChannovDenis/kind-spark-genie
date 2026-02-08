import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: ReactNode;
  className?: string;
}

export function MetricCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  className,
}: MetricCardProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;
  const isNeutral = change === 0;

  return (
    <div className={cn("metric-card", className)}>
      <div className="flex items-start justify-between mb-4">
        <span className="text-sm text-muted-foreground">{title}</span>
        {icon && (
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        
        {change !== undefined && (
          <div className="flex items-center gap-1.5">
            {isPositive && (
              <span className="flex items-center gap-1 text-success text-sm">
                <TrendingUp className="h-4 w-4" />
                +{change}%
              </span>
            )}
            {isNegative && (
              <span className="flex items-center gap-1 text-destructive text-sm">
                <TrendingDown className="h-4 w-4" />
                {change}%
              </span>
            )}
            {isNeutral && (
              <span className="flex items-center gap-1 text-muted-foreground text-sm">
                <Minus className="h-4 w-4" />
                0%
              </span>
            )}
            {changeLabel && (
              <span className="text-xs text-muted-foreground">
                {changeLabel}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
