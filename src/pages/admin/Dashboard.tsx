import { Bot, Users, TrendingUp, Clock } from 'lucide-react';
import { MetricCard } from '@/components/shared/MetricCard';
import { PageHeader } from '@/components/shared/PageHeader';
import { ActivityChart } from '@/components/charts/ActivityChart';
import { ServiceUsageTable } from '@/components/admin/ServiceUsageTable';
import { RecentEscalations } from '@/components/admin/RecentEscalations';
import { useTenant } from '@/contexts/TenantContext';
import { formatNumber } from '@/lib/formatters';

export default function AdminDashboard() {
  const { currentTenant } = useTenant();

  // Метрики зависят от тенанта
  const metrics = {
    dobroservice: { aiRequests: 11640, escalations: 562, nps: 87, avgTime: 45 },
    gazprombank: { aiRequests: 45230, escalations: 1890, nps: 92, avgTime: 38 },
    wildberries: { aiRequests: 8900, escalations: 345, nps: 78, avgTime: 52 },
    mec: { aiRequests: 3420, escalations: 156, nps: 84, avgTime: 41 },
  };

  const currentMetrics = metrics[currentTenant.id as keyof typeof metrics] || metrics.dobroservice;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Дашборд партнёра"
        description={`Статистика использования платформы для ${currentTenant.name}`}
      />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="AI-обращения"
          value={formatNumber(currentMetrics.aiRequests)}
          change={12.5}
          changeLabel="vs прошлый месяц"
          icon={<Bot className="h-5 w-5" />}
        />
        <MetricCard
          title="Эскалации к экспертам"
          value={formatNumber(currentMetrics.escalations)}
          change={-8.2}
          changeLabel="vs прошлый месяц"
          icon={<Users className="h-5 w-5" />}
        />
        <MetricCard
          title="NPS"
          value={`${currentMetrics.nps}%`}
          change={3.1}
          changeLabel="vs прошлый месяц"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <MetricCard
          title="Среднее время ответа"
          value={`${currentMetrics.avgTime} сек`}
          change={-15.3}
          changeLabel="vs прошлый месяц"
          icon={<Clock className="h-5 w-5" />}
        />
      </div>

      {/* Activity Chart */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold mb-4">Активность за 30 дней</h2>
        <ActivityChart />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-4">Использование по сервисам</h2>
          <ServiceUsageTable />
        </div>
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-4">Недавние эскалации</h2>
          <RecentEscalations />
        </div>
      </div>
    </div>
  );
}
