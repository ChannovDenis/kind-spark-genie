// Единая таксономия проекта Добросервис 2.0
// Все ID, названия и метаданные — ОДНО место правды.
// Дашборд, бэклог, документация используют ТОЛЬКО эти константы.

// --- Итерации ---

export const ITERATIONS = {
  'ITER-0': { name: 'Git + Документация + Монорепо', dates: '16 фев' },
  'ITER-1': { name: 'Полировка ядра (Feed, Services, Chat, HTTPS)', dates: '16-18 фев' },
  'ITER-2': { name: 'Мини-аппы GPB + МЭС', dates: '19-21 фев' },
  'ITER-3': { name: 'Content Studio + AI Outreach', dates: '22-24 фев' },
  'ITER-4': { name: 'Интеграции + Аналитика', dates: '25-27 фев' },
  'ITER-5': { name: 'Production Hardening', dates: '28 фев' },
} as const;

export type IterationId = keyof typeof ITERATIONS;

// --- Уровни зрелости ---

export const MATURITY_LEVELS = {
  L0: { name: 'Stub', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', progress: 0 },
  L1: { name: 'Demo-ready', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', progress: 33 },
  L2: { name: 'Pilot', color: 'bg-green-500/20 text-green-400 border-green-500/30', progress: 66 },
  L3: { name: 'Prod', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', progress: 100 },
} as const;

export type MaturityLevel = keyof typeof MATURITY_LEVELS;

// --- Группы направлений ---

export const DIRECTION_GROUPS = {
  core: { label: 'Ядро платформы' },
  'mini-app': { label: 'Мини-приложения клиентов' },
  management: { label: 'Управление' },
} as const;

export type DirectionGroup = keyof typeof DIRECTION_GROUPS;

// --- 12 направлений ---

export interface DirectionDef {
  id: string;
  name: string;
  level: MaturityLevel;
  target: MaturityLevel;
  iteration: string;
  group: DirectionGroup;
  iconName: string; // lucide icon name
}

export const DIRECTIONS: Record<string, DirectionDef> = {
  'CORE-FEED':     { id: 'CORE-FEED',     name: 'Feed (TikTok-лента)',      level: 'L1', target: 'L2', iteration: 'ITER-1 \u2705', group: 'core',       iconName: 'Smartphone' },
  'CORE-SERVICES': { id: 'CORE-SERVICES', name: 'Сервисы (Hub)',            level: 'L1', target: 'L2', iteration: 'ITER-1 \u2705', group: 'core',       iconName: 'Target' },
  'CORE-CHAT':     { id: 'CORE-CHAT',     name: 'AI Chat (9 ассистентов)', level: 'L1', target: 'L2', iteration: 'ITER-1 \u2705', group: 'core',       iconName: 'MessageSquare' },
  'CORE-HTTPS':    { id: 'CORE-HTTPS',    name: 'HTTPS + субдомены',       level: 'L1', target: 'L1', iteration: 'ITER-1 \u2705', group: 'core',       iconName: 'Globe' },
  'MINI-GPB':      { id: 'MINI-GPB',      name: 'ГПБ AI-Архитектор',       level: 'L0', target: 'L1', iteration: 'Lovable',       group: 'mini-app',   iconName: 'Building2' },
  'MINI-MES':      { id: 'MINI-MES',      name: 'МЭС Защита',             level: 'L0', target: 'L1', iteration: 'Lovable',       group: 'mini-app',   iconName: 'Shield' },
  'MINI-WB':       { id: 'MINI-WB',       name: 'WB AI-Стилист',          level: 'L0', target: 'L1', iteration: 'Lovable',       group: 'mini-app',   iconName: 'Palette' },
  'MINI-MSB':      { id: 'MINI-MSB',      name: 'МСБ (AI-скиллы)',        level: 'L0', target: 'L1', iteration: 'Lovable',       group: 'mini-app',   iconName: 'Lightbulb' },
  'MGMT-ADMIN':    { id: 'MGMT-ADMIN',    name: 'Админка + КЦ 2.0',       level: 'L1', target: 'L2', iteration: 'ITER-1 \u2705', group: 'management', iconName: 'Headphones' },
  'MGMT-STUDIO':   { id: 'MGMT-STUDIO',   name: 'Контент-студия',         level: 'L1', target: 'L2', iteration: 'ITER-3',        group: 'management', iconName: 'Video' },
  'MGMT-DASHBOARD':{ id: 'MGMT-DASHBOARD',name: 'Дашборд проекта',        level: 'L1', target: 'L1', iteration: 'ITER-1 \u2705', group: 'management', iconName: 'BarChart3' },
  'MGMT-BACKLOG':  { id: 'MGMT-BACKLOG',  name: 'Бэклог ЕЮС',            level: 'L1', target: 'L1', iteration: 'ITER-4 \u2705', group: 'management', iconName: 'ListTodo' },
} as const;

// --- Зоны ответственности ---

export const OWNERS = {
  'OWNER-DCH': { name: 'Денис Чаннов', role: 'Архитектор, AI-оператор', emoji: '\u{1F468}\u200D\u{1F4BB}' },
  'OWNER-VKH': { name: 'Владимир Хаванский', role: 'КЦ 2.0, голосовые агенты', emoji: '\u{1F3A7}' },
  'OWNER-AI':  { name: 'Claude Code', role: 'Основной разработчик', emoji: '\u{1F916}' },
} as const;

export type OwnerId = keyof typeof OWNERS;

// --- Статусы задач ---

export const STATUSES = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
  BLOCKED: 'BLOCKED',
} as const;

export type TaskStatus = keyof typeof STATUSES;

// --- Текущая итерация (обновлять при переходе) ---

export const CURRENT_ITERATION: IterationId = 'ITER-1';

// --- Метрики проекта (обновлять после каждого спринта) ---

export const PROJECT_METRICS = {
  tasksCompleted: 78,
  aiHours: 18,
  manualHours: 620,
  aiCostRub: 4000,
  ratePerHour: 3500,
  demoDate: '2026-03-01',
  lastUpdated: '2026-02-16',
} as const;

// --- Задачи текущей фазы ---

export interface PhaseTask {
  name: string;
  done: boolean;
}

export const CURRENT_PHASE_TASKS: PhaseTask[] = [
  { name: 'HTTPS + субдомены (7 поддоменов + SSL)', done: true },
  { name: 'AI Chat — tenant system prompts', done: true },
  { name: 'Feed scoring по тенанту', done: true },
  { name: 'Self-hosted Supabase + seed data', done: true },
  { name: 'Дашборд проекта + Бэклог ЕЮС', done: true },
  { name: 'ГПБ / МЭС / WB / МСБ — rework в Lovable', done: false },
  { name: 'Deploy pipeline: Lovable \u2192 GitHub \u2192 сервер', done: true },
];

// --- Вычисляемые метрики ---

export function getSpeedup(): number {
  return Math.round(PROJECT_METRICS.manualHours / PROJECT_METRICS.aiHours);
}

export function getSavingsRub(): number {
  return Math.round((PROJECT_METRICS.manualHours - PROJECT_METRICS.aiHours) * PROJECT_METRICS.ratePerHour);
}

export function getRoi(): number {
  return Math.round(getSavingsRub() / PROJECT_METRICS.aiCostRub);
}

export function getDaysUntilDemo(): number {
  const demo = new Date(PROJECT_METRICS.demoDate);
  const now = new Date();
  const diff = demo.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function getOverallProgress(): number {
  const directionsArr = Object.values(DIRECTIONS);
  const l1Count = directionsArr.filter(d => d.level !== 'L0').length;
  return Math.round((l1Count / directionsArr.length) * 100);
}
