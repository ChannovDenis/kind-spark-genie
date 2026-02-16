import { Building2, Users, TrendingUp, Settings } from 'lucide-react';
import { MetricCard } from '@/components/shared/MetricCard';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatNumber, formatCurrency } from '@/lib/formatters';
import { useTenant } from '@/contexts/TenantContext';

export default function SuperDashboard() {
  const { tenants } = useTenant();

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Супер-админ"
        description="Управление тенантами и платформой"
        actions={
          <Button className="gap-2">
            <Building2 className="h-4 w-4" />
            Добавить тенанта
          </Button>
        }
      />

      {/* Platform Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Всего тенантов"
          value={tenants.length}
          icon={<Building2 className="h-5 w-5" />}
        />
        <MetricCard
          title="Активных пользователей"
          value={formatNumber(69100)}
          change={8.5}
          changeLabel="за месяц"
          icon={<Users className="h-5 w-5" />}
        />
        <MetricCard
          title="MRR"
          value={formatCurrency(2850000)}
          change={12.3}
          changeLabel="за месяц"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <MetricCard
          title="API запросов/день"
          value="1.2M"
          change={5.2}
          changeLabel="за неделю"
          icon={<Settings className="h-5 w-5" />}
        />
      </div>

      {/* Tenants Grid */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold mb-4">Тенанты</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tenants.map((tenant) => (
            <div 
              key={tenant.id}
              className="p-4 rounded-xl border border-border/50 hover:border-primary/50 transition-colors cursor-pointer bg-muted/10"
            >
              <div className="flex items-start gap-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${tenant.accentColor}20` }}
                >
                  {tenant.logo}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{tenant.name}</h3>
                    <StatusBadge 
                      status={tenant.status === 'active' ? 'success' : 'warning'}
                      label={tenant.status === 'active' ? 'Активен' : 'Триал'}
                    />
                  </div>
                  
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span>{formatNumber(tenant.usersCount)} пользователей</span>
                    <span>•</span>
                    <span className="capitalize">{tenant.plan}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
