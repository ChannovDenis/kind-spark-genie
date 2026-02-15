import { tenantServiceUsage } from '@/data/tenantMetrics';
import { formatNumber } from '@/lib/formatters';
import { Progress } from '@/components/ui/progress';

interface ServiceUsageTableProps {
  tenantId: string;
}

export function ServiceUsageTable({ tenantId }: ServiceUsageTableProps) {
  const items = tenantServiceUsage[tenantId] || tenantServiceUsage.dobroservice;

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const percentage = (item.requests / item.quota) * 100;
        const isOverQuota = percentage > 80;
        
        return (
          <div key={item.service} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{item.service}</span>
              <span className="text-muted-foreground">
                {formatNumber(item.requests)} / {formatNumber(item.quota)}
              </span>
            </div>
            <Progress 
              value={Math.min(percentage, 100)} 
              className={`h-2 ${isOverQuota ? '[&>div]:bg-warning' : ''}`}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{percentage.toFixed(0)}% использовано</span>
              <span>{item.escalations} эскалаций</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
