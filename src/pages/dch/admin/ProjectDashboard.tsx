import {
  Rocket, Clock, Users, Zap, CheckCircle2, Circle,
  ArrowUpRight, Target, Calendar, Shield,
  Smartphone, Headphones, Video, BarChart3, ListTodo,
  Globe, Palette, MessageSquare, Building2,
  Lightbulb, Wrench
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  DIRECTIONS,
  DIRECTION_GROUPS,
  MATURITY_LEVELS,
  OWNERS,
  PROJECT_METRICS,
  CURRENT_PHASE_TASKS,
  getDaysUntilDemo,
  getOverallProgress,
  getSpeedup,
  getSavingsRub,
  getRoi,
  type DirectionGroup,
  type MaturityLevel,
} from '@/constants/project-taxonomy';

// --- Icon map (lucide name → component) ---

const iconMap: Record<string, React.ElementType> = {
  Smartphone, Target, MessageSquare, Globe,
  Building2, Shield, Palette, Lightbulb,
  Headphones, Video, BarChart3, ListTodo,
};

// --- Component ---

export default function ProjectDashboard() {
  const daysLeft = getDaysUntilDemo();
  const progress = getOverallProgress();
  const { tasksCompleted, aiHours, manualHours, aiCostRub, ratePerHour, lastUpdated } = PROJECT_METRICS;
  const speedup = getSpeedup();
  const savingsRub = getSavingsRub();
  const roi = getRoi();

  const directionsArr = Object.values(DIRECTIONS);
  const groups = Object.keys(DIRECTION_GROUPS) as DirectionGroup[];
  const teamArr = Object.values(OWNERS);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Дашборд проекта"
        description="Добросервис 2.0 — AI-трансформация клиентского сервиса"
      />

      {/* === БЛОК 1: ОБЗОР === */}
      <div className="glass-card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Rocket className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Общий прогресс</h2>
              <p className="text-sm text-muted-foreground">
                {directionsArr.length} направлений · 5 итераций до демо
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Демо: 1 марта</span>
            </div>
            <div className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg border",
              daysLeft <= 7 ? "bg-destructive/10 border-destructive/20 text-destructive" : "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
            )}>
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">Осталось: {daysLeft} дней</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Готовность</span>
            <span className="font-semibold text-primary">{progress}%</span>
          </div>
          <Progress value={progress} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground">
            {(Object.keys(MATURITY_LEVELS) as MaturityLevel[]).map(lvl => (
              <span key={lvl}>{lvl}: {MATURITY_LEVELS[lvl].name}</span>
            ))}
          </div>
        </div>
      </div>

      {/* === БЛОК 2: 12 НАПРАВЛЕНИЙ === */}
      <div className="space-y-4">
        {groups.map(group => (
          <div key={group}>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              {DIRECTION_GROUPS[group].label}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {directionsArr.filter(d => d.group === group).map(d => {
                const Icon = iconMap[d.iconName] || BarChart3;
                const lvlMeta = MATURITY_LEVELS[d.level];
                const tgtMeta = MATURITY_LEVELS[d.target];
                return (
                  <div key={d.id} className="glass-card p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium leading-tight">{d.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={cn("text-xs font-mono", lvlMeta.color)}>
                        {d.level}
                      </Badge>
                      <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
                      <Badge variant="outline" className={cn("text-xs font-mono", tgtMeta.color)}>
                        {d.target}
                      </Badge>
                    </div>
                    <Progress value={lvlMeta.progress} className="h-1.5" />
                    <div className="text-xs text-muted-foreground">{d.iteration}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* === БЛОК 3: ЭКОНОМИЯ AI vs РУЧНАЯ РАЗРАБОТКА === */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
            <Zap className="h-5 w-5 text-green-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Экономия AI vs Ручная разработка</h2>
            <p className="text-sm text-muted-foreground">Метрики эффективности AI-трансформации</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="text-center p-3 rounded-lg bg-muted/30">
            <div className="text-2xl font-bold">{tasksCompleted}</div>
            <div className="text-xs text-muted-foreground mt-1">Задач выполнено</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/30">
            <div className="text-2xl font-bold">{aiHours}ч</div>
            <div className="text-xs text-muted-foreground mt-1">Время AI</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/30">
            <div className="text-2xl font-bold">{manualHours}ч</div>
            <div className="text-xs text-muted-foreground mt-1">Оценка вручную</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-primary/10 border border-primary/20">
            <div className="text-2xl font-bold text-primary">x{speedup}</div>
            <div className="text-xs text-muted-foreground mt-1">Ускорение</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="text-2xl font-bold text-green-400">~{(savingsRub / 1000000).toFixed(1)}M</div>
            <div className="text-xs text-muted-foreground mt-1">Экономия (руб)</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <div className="text-2xl font-bold text-yellow-400">x{roi}</div>
            <div className="text-xs text-muted-foreground mt-1">ROI</div>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-lg bg-muted/20 text-xs text-muted-foreground">
          Расчёт: {manualHours}ч ручной работы ({Math.round(manualHours / 24)} суток) x {ratePerHour.toLocaleString('ru-RU')} руб/ч = {(manualHours * ratePerHour).toLocaleString('ru-RU')} руб.
          Стоимость AI: ~{aiCostRub.toLocaleString('ru-RU')} руб (Claude Max + API). Обновлено: {lastUpdated}.
        </div>
      </div>

      {/* === БЛОК 4 + 5: КОМАНДА + ТЕКУЩАЯ ИТЕРАЦИЯ === */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Команда */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-400" />
            </div>
            <h2 className="text-lg font-semibold">Команда</h2>
          </div>
          <div className="space-y-3">
            {teamArr.map((member) => (
              <div key={member.name} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
                <span className="text-2xl">{member.emoji}</span>
                <div>
                  <div className="text-sm font-medium">{member.name}</div>
                  <div className="text-xs text-muted-foreground">{member.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Текущая итерация */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Wrench className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Текущая фаза: Lovable rework</h2>
              <p className="text-xs text-muted-foreground">Итерации 1-3 завершены · 16-17 февраля 2026</p>
            </div>
          </div>
          <div className="space-y-2">
            {CURRENT_PHASE_TASKS.map((task, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg transition-colors",
                  task.done ? "bg-green-500/10" : "bg-muted/20"
                )}
              >
                {task.done ? (
                  <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
                )}
                <span className={cn(
                  "text-sm",
                  task.done && "line-through text-muted-foreground"
                )}>
                  {task.name}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            {CURRENT_PHASE_TASKS.filter(t => t.done).length}/{CURRENT_PHASE_TASKS.length} задач выполнено
          </div>
        </div>
      </div>
    </div>
  );
}
