import { useState } from 'react';
import { Download, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { billingQuotas } from '@/data/mockData';
import { formatNumber } from '@/lib/formatters';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { BurndownChart } from '@/components/charts/BurndownChart';

export default function AdminBilling() {
  const [autoExtend, setAutoExtend] = useState(true);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Биллинг и квоты"
        description="Управление лимитами и расходами"
        actions={
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Выгрузить счёт
          </Button>
        }
      />

      {/* Burn-down Chart */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Потребление за месяц</h2>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-muted-foreground">Факт</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-muted-foreground" />
              <span className="text-muted-foreground">План</span>
            </div>
          </div>
        </div>
        <BurndownChart />
      </div>

      {/* Quotas Grid */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold mb-4">Квоты по сервисам</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {billingQuotas.map((quota) => {
            const percentage = (quota.used / quota.limit) * 100;
            const isWarning = percentage > 70 && percentage <= 90;
            const isCritical = percentage > 90;
            
            return (
              <div key={quota.service} className="space-y-3 p-4 rounded-lg bg-muted/20">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{quota.service}</span>
                  {isCritical && <AlertTriangle className="h-4 w-4 text-destructive" />}
                  {isWarning && <TrendingDown className="h-4 w-4 text-warning" />}
                  {!isWarning && !isCritical && <CheckCircle className="h-4 w-4 text-success" />}
                </div>
                
                <Progress 
                  value={Math.min(percentage, 100)} 
                  className={`h-3 ${isCritical ? '[&>div]:bg-destructive' : isWarning ? '[&>div]:bg-warning' : ''}`}
                />
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {typeof quota.used === 'number' && quota.used < 100 
                      ? quota.used.toFixed(1) 
                      : formatNumber(quota.used)} / {formatNumber(quota.limit)} {quota.unit}
                  </span>
                  <span className={`font-medium ${isCritical ? 'text-destructive' : isWarning ? 'text-warning' : 'text-success'}`}>
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Settings */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold mb-4">Настройки перерасхода</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <Label htmlFor="auto-extend" className="font-medium">
                Автопродление квот
              </Label>
              <p className="text-sm text-muted-foreground">
                Автоматически увеличивать квоту при достижении лимита
              </p>
            </div>
            <Switch 
              id="auto-extend" 
              checked={autoExtend} 
              onCheckedChange={setAutoExtend} 
            />
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div>
              <Label htmlFor="notifications" className="font-medium">
                Уведомления о квотах
              </Label>
              <p className="text-sm text-muted-foreground">
                Получать уведомления при достижении 80% лимита
              </p>
            </div>
            <Switch 
              id="notifications" 
              checked={notifications} 
              onCheckedChange={setNotifications} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
