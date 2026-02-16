import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, Plus, Clock, CheckCircle2, Circle, AlertTriangle } from 'lucide-react';

// --- Types ---

type Priority = 'P0' | 'P1' | 'P2' | 'P3';
type Status = 'todo' | 'in_progress' | 'done' | 'blocked';
type Tenant = 'all' | 'core' | 'gpb' | 'wb' | 'mes' | 'alfa' | 'pochtarf' | 'msb';

interface BacklogItem {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  tenant: Tenant;
  assignee: string;
  estimate: string;
  tags: string[];
  createdAt: string;
}

// --- Mock data ---

const BACKLOG_ITEMS: BacklogItem[] = [
  // P0 — Critical
  {
    id: 'BL-001',
    title: 'HTTPS + субдомены для 24dobroservis.ru',
    description: 'Certbot SSL для 7 субдоменов, nginx virtual hosts, HTTP→HTTPS redirect',
    priority: 'P0',
    status: 'done',
    tenant: 'core',
    assignee: 'Claude Code',
    estimate: '2ч',
    tags: ['infra', 'ssl'],
    createdAt: '2026-02-16',
  },
  {
    id: 'BL-002',
    title: 'AI Chat — tenant system prompts',
    description: 'Уникальные system prompts для GPB, WB, MES, Alfa, Pochtarf в FastAPI',
    priority: 'P0',
    status: 'done',
    tenant: 'core',
    assignee: 'Claude Code',
    estimate: '1ч',
    tags: ['ai', 'chat'],
    createdAt: '2026-02-16',
  },
  {
    id: 'BL-003',
    title: 'Feed scoring по тенантам',
    description: 'useFeed() hook — загрузка из Supabase, фильтрация по tenant_id, fallback на mock',
    priority: 'P0',
    status: 'done',
    tenant: 'core',
    assignee: 'Claude Code',
    estimate: '1.5ч',
    tags: ['feed', 'supabase'],
    createdAt: '2026-02-16',
  },
  {
    id: 'BL-004',
    title: 'ГПБ AI-Архитектор мини-приложение',
    description: 'Rework в Lovable. 4-шаговый flow: фото комнаты → AI-анализ → стиль → смета',
    priority: 'P0',
    status: 'blocked',
    tenant: 'gpb',
    assignee: 'Denis (Lovable)',
    estimate: '3ч',
    tags: ['mini-app', 'gpb', 'lovable-rework'],
    createdAt: '2026-02-16',
  },
  {
    id: 'BL-005',
    title: 'МЭС Защита и справедливость',
    description: 'Rework в Lovable. 4-шаговый flow: квитанция → OCR → аудит → жалоба',
    priority: 'P0',
    status: 'blocked',
    tenant: 'mes',
    assignee: 'Denis (Lovable)',
    estimate: '3ч',
    tags: ['mini-app', 'mes', 'lovable-rework'],
    createdAt: '2026-02-16',
  },
  {
    id: 'BL-006',
    title: 'МСБ Каталог AI-скиллов',
    description: 'Rework в Lovable. 6 AI-скиллов: юрист, бухгалтер, HR, маркетолог, продажник, аналитик',
    priority: 'P0',
    status: 'blocked',
    tenant: 'msb',
    assignee: 'Denis (Lovable)',
    estimate: '1.5ч',
    tags: ['mini-app', 'msb', 'lovable-rework'],
    createdAt: '2026-02-16',
  },

  // P0 — In Progress / Todo
  {
    id: 'BL-007',
    title: 'WB AI-Стилист мини-приложение',
    description: 'Rework в Lovable. Анализ фото → подбор образа → карточки товаров WB',
    priority: 'P0',
    status: 'blocked',
    tenant: 'wb',
    assignee: 'Denis (Lovable)',
    estimate: '3ч',
    tags: ['mini-app', 'wb', 'lovable-rework'],
    createdAt: '2026-02-16',
  },
  {
    id: 'BL-008',
    title: 'Бэклог ЕЮС в админке',
    description: 'Страница /project/backlog — Kanban/таблица задач с фильтрацией по тенанту и приоритету',
    priority: 'P0',
    status: 'done',
    tenant: 'core',
    assignee: 'Claude Code',
    estimate: '2ч',
    tags: ['admin', 'management'],
    createdAt: '2026-02-16',
  },

  // P1 — Important
  {
    id: 'BL-009',
    title: 'Бронирование экспертов → Supabase',
    description: 'Перенести localStorage bookings в таблицу bookings, RLS, History.tsx переписать',
    priority: 'P1',
    status: 'todo',
    tenant: 'core',
    assignee: 'Claude Code',
    estimate: '4ч',
    tags: ['booking', 'supabase'],
    createdAt: '2026-02-16',
  },
  {
    id: 'BL-010',
    title: 'ProfileHeader → данные из БД',
    description: 'Заменить mock "Денис Чаннов" на useProfile() → таблица profiles',
    priority: 'P1',
    status: 'todo',
    tenant: 'core',
    assignee: 'Claude Code',
    estimate: '1ч',
    tags: ['profile', 'supabase'],
    createdAt: '2026-02-16',
  },
  {
    id: 'BL-011',
    title: 'Пагинация сообщений чата',
    description: 'useChat.ts: загружать последние 50, useInfiniteQuery для скролла вверх',
    priority: 'P1',
    status: 'todo',
    tenant: 'core',
    assignee: 'Claude Code',
    estimate: '2ч',
    tags: ['chat', 'performance'],
    createdAt: '2026-02-16',
  },
  {
    id: 'BL-012',
    title: 'Content Studio → FastAPI video endpoints',
    description: 'generate-video, generate-voice, check-status → FastAPI + Runway API',
    priority: 'P1',
    status: 'todo',
    tenant: 'core',
    assignee: 'TBD',
    estimate: '8ч',
    tags: ['studio', 'api'],
    createdAt: '2026-02-16',
  },

  // P0 — Done (added 16 feb)
  {
    id: 'BL-017',
    title: 'Self-hosted Supabase на VPS',
    description: 'Docker compose, Kong API Gateway, nginx proxy /supabase/, .env.local override',
    priority: 'P0',
    status: 'done',
    tenant: 'core',
    assignee: 'Claude Code',
    estimate: '4ч',
    tags: ['infra', 'supabase'],
    createdAt: '2026-02-16',
  },
  {
    id: 'BL-018',
    title: 'Seed data для демо',
    description: '5 bookings, 3 topics, 10 messages, 21 feed_items, 7 videos, 5 exercises',
    priority: 'P0',
    status: 'done',
    tenant: 'core',
    assignee: 'Claude Code',
    estimate: '1ч',
    tags: ['data', 'demo'],
    createdAt: '2026-02-16',
  },
  {
    id: 'BL-019',
    title: 'Deploy pipeline: Lovable → GitHub → сервер',
    description: 'git pull → .env.local check → npm build → rm assets → scp → curl verify → Chrome verify',
    priority: 'P0',
    status: 'done',
    tenant: 'core',
    assignee: 'Claude Code',
    estimate: '1ч',
    tags: ['infra', 'deploy'],
    createdAt: '2026-02-16',
  },
  {
    id: 'BL-020',
    title: 'Синхронизация дашборда при завершении задач',
    description: 'Правило в RULES.md: обновлять ProjectDashboard.tsx + Backlog.tsx + TASKS.md при каждом изменении',
    priority: 'P1',
    status: 'done',
    tenant: 'core',
    assignee: 'Claude Code',
    estimate: '0.5ч',
    tags: ['process', 'docs'],
    createdAt: '2026-02-17',
  },

  // P2 — Nice to have
  {
    id: 'BL-013',
    title: 'Дашборд проекта → Supabase',
    description: 'Перенести hardcoded данные дашборда в таблицу project_status, CRUD для обновления',
    priority: 'P2',
    status: 'todo',
    tenant: 'core',
    assignee: 'Claude Code',
    estimate: '3ч',
    tags: ['dashboard', 'supabase'],
    createdAt: '2026-02-16',
  },
  {
    id: 'BL-014',
    title: 'Голосовые агенты (КЦ 2.0)',
    description: 'Web Speech API для голосового ввода + TTS для ответов ассистента',
    priority: 'P2',
    status: 'todo',
    tenant: 'core',
    assignee: 'Хаванский',
    estimate: '16ч',
    tags: ['voice', 'kc'],
    createdAt: '2026-02-16',
  },
  {
    id: 'BL-015',
    title: 'Admin CSV отчёты — UTF-8 BOM',
    description: 'Проверить все 8 типов отчётов, UTF-8 BOM для кириллицы в Excel',
    priority: 'P2',
    status: 'todo',
    tenant: 'core',
    assignee: 'Claude Code',
    estimate: '1ч',
    tags: ['admin', 'reports'],
    createdAt: '2026-02-16',
  },
  {
    id: 'BL-016',
    title: 'React.lazy() для admin секций',
    description: 'Code splitting для /studio, /expert, /super — уменьшить initial load',
    priority: 'P2',
    status: 'todo',
    tenant: 'core',
    assignee: 'Claude Code',
    estimate: '1ч',
    tags: ['admin', 'performance'],
    createdAt: '2026-02-16',
  },
];

// --- Helpers ---

const priorityConfig: Record<Priority, { label: string; color: string; bg: string }> = {
  P0: { label: 'P0 Critical', color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30' },
  P1: { label: 'P1 High', color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30' },
  P2: { label: 'P2 Medium', color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  P3: { label: 'P3 Low', color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-900/30' },
};

const statusConfig: Record<Status, { label: string; icon: React.ElementType; color: string }> = {
  todo: { label: 'TODO', icon: Circle, color: 'text-gray-400' },
  in_progress: { label: 'В работе', icon: Clock, color: 'text-blue-500' },
  done: { label: 'Готово', icon: CheckCircle2, color: 'text-green-500' },
  blocked: { label: 'Заблокировано', icon: AlertTriangle, color: 'text-red-500' },
};

const tenantLabels: Record<Tenant, string> = {
  all: 'Все',
  core: 'Ядро',
  gpb: 'ГПБ',
  wb: 'WB',
  mes: 'МЭС',
  alfa: 'Альфа',
  pochtarf: 'Почта',
  msb: 'МСБ',
};

// --- Component ---

export default function Backlog() {
  const [search, setSearch] = useState('');
  const [filterTenant, setFilterTenant] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filtered = BACKLOG_ITEMS.filter((item) => {
    if (search && !item.title.toLowerCase().includes(search.toLowerCase()) && !item.description.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterTenant !== 'all' && item.tenant !== filterTenant) return false;
    if (filterPriority !== 'all' && item.priority !== filterPriority) return false;
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    return true;
  });

  const stats = {
    total: BACKLOG_ITEMS.length,
    done: BACKLOG_ITEMS.filter((i) => i.status === 'done').length,
    inProgress: BACKLOG_ITEMS.filter((i) => i.status === 'in_progress').length,
    todo: BACKLOG_ITEMS.filter((i) => i.status === 'todo').length,
    blocked: BACKLOG_ITEMS.filter((i) => i.status === 'blocked').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Бэклог ЕЮС</h1>
          <p className="text-muted-foreground text-sm">
            Управление задачами проекта Добросервис 2.0
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> Добавить задачу
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Всего', value: stats.total, color: 'text-foreground' },
          { label: 'Готово', value: stats.done, color: 'text-green-500' },
          { label: 'В работе', value: stats.inProgress, color: 'text-blue-500' },
          { label: 'TODO', value: stats.todo, color: 'text-gray-400' },
          { label: 'Блокеры', value: stats.blocked, color: 'text-red-500' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-4 pb-3 px-4 text-center">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4 pb-4 px-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по названию или описанию..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterTenant} onValueChange={setFilterTenant}>
                <SelectTrigger className="w-[130px]">
                  <Filter className="w-3 h-3 mr-1" />
                  <SelectValue placeholder="Тенант" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(tenantLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Приоритет" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все</SelectItem>
                  <SelectItem value="P0">P0 Critical</SelectItem>
                  <SelectItem value="P1">P1 High</SelectItem>
                  <SelectItem value="P2">P2 Medium</SelectItem>
                  <SelectItem value="P3">P3 Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все</SelectItem>
                  <SelectItem value="todo">TODO</SelectItem>
                  <SelectItem value="in_progress">В работе</SelectItem>
                  <SelectItem value="done">Готово</SelectItem>
                  <SelectItem value="blocked">Блокеры</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task list */}
      <div className="space-y-2">
        {filtered.map((item) => {
          const priority = priorityConfig[item.priority];
          const status = statusConfig[item.status];
          const StatusIcon = status.icon;

          return (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-4 pb-4 px-4">
                <div className="flex items-start gap-3">
                  <StatusIcon className={`w-5 h-5 mt-0.5 ${status.color} shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs text-muted-foreground font-mono">{item.id}</span>
                      <Badge variant="outline" className={`text-[10px] ${priority.color} ${priority.bg} border-0`}>
                        {item.priority}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px]">
                        {tenantLabels[item.tenant]}
                      </Badge>
                    </div>
                    <h3 className="text-sm font-semibold">{item.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{item.description}</p>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span className="text-[10px] text-muted-foreground">👤 {item.assignee}</span>
                      <span className="text-[10px] text-muted-foreground">⏱ {item.estimate}</span>
                      <span className="text-[10px] text-muted-foreground">📅 {item.createdAt}</span>
                      <div className="flex gap-1">
                        {item.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-[9px] px-1.5 py-0">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>Задачи не найдены по текущим фильтрам</p>
        </div>
      )}
    </div>
  );
}
