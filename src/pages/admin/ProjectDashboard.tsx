import {
  Rocket, Clock, Users, Bot, Zap, CheckCircle2, Circle,
  ArrowUpRight, Target, TrendingUp, Calendar, Shield,
  Smartphone, Headphones, Video, BarChart3, ListTodo,
  Globe, Palette, MessageSquare, ShoppingBag, Building2,
  Lightbulb, Wrench
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// --- Data ---

interface Direction {
  id: number;
  name: string;
  level: 'L0' | 'L1' | 'L2' | 'L3';
  target: 'L1' | 'L2' | 'L3';
  icon: React.ElementType;
  iteration: string;
  group: 'core' | 'mini-app' | 'management';
}

const directions: Direction[] = [
  { id: 1, name: 'Feed (TikTok-лента)', level: 'L1', target: 'L2', icon: Smartphone, iteration: 'Iter1', group: 'core' },
  { id: 2, name: 'Сервисы (Hub)', level: 'L1', target: 'L2', icon: Target, iteration: '-', group: 'core' },
  { id: 3, name: 'AI Chat (9 ассистентов)', level: 'L1', target: 'L2', icon: MessageSquare, iteration: 'Iter1', group: 'core' },
  { id: 4, name: 'HTTPS + субдомены', level: 'L0', target: 'L1', icon: Globe, iteration: 'Iter1', group: 'core' },
  { id: 5, name: 'ГПБ AI-Архитектор', level: 'L0', target: 'L1', icon: Building2, iteration: 'Iter2', group: 'mini-app' },
  { id: 6, name: 'МЭС Защита', level: 'L0', target: 'L1', icon: Shield, iteration: 'Iter2', group: 'mini-app' },
  { id: 7, name: 'WB AI-Стилист', level: 'L0', target: 'L1', icon: Palette, iteration: 'Iter3', group: 'mini-app' },
  { id: 8, name: 'МСБ (AI-скиллы)', level: 'L0', target: 'L1', icon: Lightbulb, iteration: 'Iter3', group: 'mini-app' },
  { id: 9, name: 'Админка + КЦ 2.0', level: 'L1', target: 'L2', icon: Headphones, iteration: 'Iter1', group: 'management' },
  { id: 10, name: 'Контент-студия', level: 'L1', target: 'L2', icon: Video, iteration: 'Iter3', group: 'management' },
  { id: 11, name: 'Дашборд проекта', level: 'L0', target: 'L1', icon: BarChart3, iteration: 'Iter1', group: 'management' },
  { id: 12, name: 'Бэклог ЕЮС', level: 'L0', target: 'L1', icon: ListTodo, iteration: 'Iter4', group: 'management' },
];

interface TeamMember {
  name: string;
  role: string;
  emoji: string;
}

const team: TeamMember[] = [
  { name: 'Денис Чаннов', role: 'Архитектор, AI-оператор', emoji: '👨‍💻' },
  { name: 'Claude Code', role: 'Основной разработчик', emoji: '🤖' },
  { name: 'Владимир Хаванский', role: 'КЦ 2.0, голосовые агенты', emoji: '🎧' },
];

interface IterationTask {
  name: string;
  done: boolean;
}

const currentIterationTasks: IterationTask[] = [
  { name: 'HTTPS + субдомены (ждём DNS)', done: false },
  { name: 'AI Chat — tenant system prompts', done: false },
  { name: 'Feed scoring по тенанту', done: false },
  { name: 'Admin code splitting', done: false },
  { name: 'Дашборд проекта ЕЮС', done: true },
];

// --- Helpers ---

const levelColors: Record<string, string> = {
  L0: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  L1: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  L2: 'bg-green-500/20 text-green-400 border-green-500/30',
  L3: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

const levelProgress: Record<string, number> = {
  L0: 0,
  L1: 33,
  L2: 66,
  L3: 100,
};

const groupLabels: Record<string, string> = {
  core: 'Ядро платформы',
  'mini-app': 'Мини-приложения клиентов',
  management: 'Управление',
};

function getDaysUntilDemo(): number {
  const demo = new Date('2026-03-01');
  const now = new Date();
  const diff = demo.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function getOverallProgress(): number {
  const l1Count = directions.filter(d => d.level !== 'L0').length;
  return Math.round((l1Count / directions.length) * 100);
}

// --- Component ---

export default function ProjectDashboard() {
  const daysLeft = getDaysUntilDemo();
  const progress = getOverallProgress();
  const tasksCompleted = 47;
  const aiHours = 10;
  const manualHours = 336;
  const speedup = Math.round(manualHours / aiHours);
  const savingsRub = Math.round((manualHours - aiHours) * 3500);
  const aiCostRub = 2000;
  const roi = Math.round(savingsRub / aiCostRub);

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
                12 направлений · 5 итераций до демо
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
            <span>L0: Stub</span>
            <span>L1: Demo-ready</span>
            <span>L2: Pilot</span>
            <span>L3: Prod</span>
          </div>
        </div>
      </div>

      {/* === БЛОК 2: 12 НАПРАВЛЕНИЙ === */}
      <div className="space-y-4">
        {(['core', 'mini-app', 'management'] as const).map(group => (
          <div key={group}>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              {groupLabels[group]}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {directions.filter(d => d.group === group).map(d => {
                const Icon = d.icon;
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
                      <Badge variant="outline" className={cn("text-xs font-mono", levelColors[d.level])}>
                        {d.level}
                      </Badge>
                      <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
                      <Badge variant="outline" className={cn("text-xs font-mono", levelColors[d.target])}>
                        {d.target}
                      </Badge>
                    </div>
                    <Progress value={levelProgress[d.level]} className="h-1.5" />
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
          Расчёт: {manualHours}ч ручной работы (14 суток) x 3 500 руб/ч = {(manualHours * 3500).toLocaleString('ru-RU')} руб.
          Стоимость AI: ~{aiCostRub.toLocaleString('ru-RU')} руб (Claude Max + API).
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
            {team.map((member) => (
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
              <h2 className="text-lg font-semibold">Итерация 1: Полировка ядра</h2>
              <p className="text-xs text-muted-foreground">16-18 февраля 2026</p>
            </div>
          </div>
          <div className="space-y-2">
            {currentIterationTasks.map((task, i) => (
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
            {currentIterationTasks.filter(t => t.done).length}/{currentIterationTasks.length} задач выполнено
          </div>
        </div>
      </div>
    </div>
  );
}
