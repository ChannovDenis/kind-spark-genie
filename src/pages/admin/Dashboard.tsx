import { Bot, Users, TrendingUp, Clock } from 'lucide-react';
import { MetricCard } from '@/components/shared/MetricCard';
import { PageHeader } from '@/components/shared/PageHeader';
import { ActivityChart } from '@/components/charts/ActivityChart';
import { ServiceUsageTable } from '@/components/admin/ServiceUsageTable';
import { RecentEscalations } from '@/components/admin/RecentEscalations';
import { useTenant } from '@/contexts/TenantContext';
import { formatNumber } from '@/lib/formatters';
import { dashboardMetrics } from '@/data/tenantMetrics';

export default function AdminDashboard() {
  const { currentTenant } = useTenant();

  const m = dashboardMetrics[currentTenant.id] || dashboardMetrics.dobroservice;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Дашборд партнёра"
        description={`Статистика использования платформы для ${currentTenant.name}`}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="AI-обращения"
          value={formatNumber(m.aiRequests.value)}
          change={m.aiRequests.change}
          changeLabel="vs прошлый месяц"
          icon={<Bot className="h-5 w-5" />}
        />
        <MetricCard
          title="Эскалации к экспертам"
          value={formatNumber(m.escalations.value)}
          change={m.escalations.change}
          changeLabel="vs прошлый месяц"
          icon={<Users className="h-5 w-5" />}
        />
        <MetricCard
          title="NPS"
          value={`${m.nps.value}%`}
          change={m.nps.change}
          changeLabel="vs прошлый месяц"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <MetricCard
          title="Среднее время ответа"
          value={`${m.avgTime.value} сек`}
          change={m.avgTime.change}
          changeLabel="vs прошлый месяц"
          icon={<Clock className="h-5 w-5" />}
        />
      </div>

      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold mb-4">Активность за 30 дней</h2>
        <ActivityChart tenantId={currentTenant.id} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-4">Использование по сервисам</h2>
          <ServiceUsageTable tenantId={currentTenant.id} />
        </div>
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-4">Недавние эскалации</h2>
          <RecentEscalations tenantId={currentTenant.id} />
        </div>
      </div>
    </div>
  );
}
