import { ShieldCheck, AlertTriangle, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { MetricCard } from '@/components/shared/MetricCard';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatRelativeDate } from '@/lib/formatters';

const recentDialogs = [
  { 
    id: 1, 
    user: 'Пользователь #4521', 
    service: 'Юрист', 
    score: 92, 
    status: 'good',
    issue: null,
    time: '2026-02-08T10:30:00'
  },
  { 
    id: 2, 
    user: 'Пользователь #4520', 
    service: 'Врач', 
    score: 45, 
    status: 'bad',
    issue: 'Неточный диагноз',
    time: '2026-02-08T09:15:00'
  },
  { 
    id: 3, 
    user: 'Пользователь #4519', 
    service: 'Психолог', 
    score: 78, 
    status: 'warning',
    issue: 'Недостаточно эмпатии',
    time: '2026-02-08T08:45:00'
  },
  { 
    id: 4, 
    user: 'Пользователь #4518', 
    service: 'Финансист', 
    score: 95, 
    status: 'good',
    issue: null,
    time: '2026-02-07T18:20:00'
  },
  { 
    id: 5, 
    user: 'Пользователь #4517', 
    service: 'Юрист', 
    score: 88, 
    status: 'good',
    issue: null,
    time: '2026-02-07T17:00:00'
  },
];

export default function QualityDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Quality Center"
        description="Мониторинг качества AI-ответов и дообучение моделей"
      />

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <MetricCard
          title="AI Quality Score"
          value="87.3%"
          change={2.1}
          changeLabel="за неделю"
          icon={<ShieldCheck className="h-5 w-5" />}
        />
        <MetricCard
          title="Хорошие ответы"
          value="4,521"
          icon={<CheckCircle className="h-5 w-5 text-success" />}
        />
        <MetricCard
          title="Требуют внимания"
          value="156"
          icon={<AlertTriangle className="h-5 w-5 text-warning" />}
        />
        <MetricCard
          title="Критические"
          value="23"
          icon={<XCircle className="h-5 w-5 text-destructive" />}
        />
        <MetricCard
          title="Дообучено"
          value="89"
          change={34}
          changeLabel="за неделю"
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      {/* Recent Dialogs */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold mb-4">Диалоги на разбор</h2>
        
        <div className="space-y-2">
          {recentDialogs.map((dialog) => (
            <div 
              key={dialog.id}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
            >
              <div className={`w-3 h-3 rounded-full ${
                dialog.status === 'good' ? 'bg-success' :
                dialog.status === 'warning' ? 'bg-warning' : 'bg-destructive'
              }`} />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{dialog.user}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">{dialog.service}</span>
                </div>
                {dialog.issue && (
                  <p className="text-sm text-destructive">{dialog.issue}</p>
                )}
              </div>

              <div className="text-right">
                <div className={`font-bold ${
                  dialog.score >= 80 ? 'text-success' :
                  dialog.score >= 60 ? 'text-warning' : 'text-destructive'
                }`}>
                  {dialog.score}%
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatRelativeDate(dialog.time)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
