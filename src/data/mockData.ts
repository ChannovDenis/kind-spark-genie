// Сервисы платформы
export const services = [
  { id: 'lawyer', name: 'Юрист', icon: '⚖️', color: '#3B82F6' },
  { id: 'doctor', name: 'Врач', icon: '🩺', color: '#10B981' },
  { id: 'psychologist', name: 'Психолог', icon: '🧠', color: '#8B5CF6' },
  { id: 'financier', name: 'Финансист', icon: '💰', color: '#F59E0B' },
  { id: 'fitness', name: 'Фитнес', icon: '💪', color: '#EC4899' },
  { id: 'nutrition', name: 'Нутрициолог', icon: '🥗', color: '#14B8A6' },
];

// Статусы эскалаций
export type EscalationStatus = 'pending' | 'in_progress' | 'resolved' | 'cancelled';

export interface Escalation {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  service: string;
  topic: string;
  status: EscalationStatus;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  expertName?: string;
}

// Mock-эскалации
export const mockEscalations: Escalation[] = [
  {
    id: 'esc-1',
    userId: 'u-1',
    userName: 'Иван Сидоров',
    userAvatar: '',
    service: 'lawyer',
    topic: 'Расторжение договора аренды',
    status: 'pending',
    priority: 'high',
    createdAt: '2026-02-08T10:30:00',
  },
  {
    id: 'esc-2',
    userId: 'u-2',
    userName: 'Мария Козлова',
    userAvatar: '',
    service: 'doctor',
    topic: 'Консультация по результатам анализов',
    status: 'in_progress',
    priority: 'medium',
    createdAt: '2026-02-08T09:15:00',
    expertName: 'Др. Смирнов А.В.',
  },
  {
    id: 'esc-3',
    userId: 'u-3',
    userName: 'Алексей Новиков',
    userAvatar: '',
    service: 'psychologist',
    topic: 'Тревожное расстройство',
    status: 'in_progress',
    priority: 'high',
    createdAt: '2026-02-07T16:45:00',
    expertName: 'Волкова Е.С.',
  },
  {
    id: 'esc-4',
    userId: 'u-4',
    userName: 'Елена Федорова',
    userAvatar: '',
    service: 'financier',
    topic: 'Оптимизация налогов для ИП',
    status: 'resolved',
    priority: 'low',
    createdAt: '2026-02-06T14:20:00',
    expertName: 'Петров И.М.',
  },
  {
    id: 'esc-5',
    userId: 'u-5',
    userName: 'Дмитрий Орлов',
    userAvatar: '',
    service: 'lawyer',
    topic: 'Защита прав потребителя',
    status: 'pending',
    priority: 'medium',
    createdAt: '2026-02-08T08:00:00',
  },
];

// Пользователи партнёра
export interface PartnerUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  department: string;
  role: string;
  lastActive: string;
  totalRequests: number;
  status: 'active' | 'inactive';
}

export const mockUsers: PartnerUser[] = [
  {
    id: 'pu-1',
    name: 'Сергей Васильев',
    email: 's.vasilev@company.ru',
    avatar: '',
    department: 'Отдел продаж',
    role: 'Менеджер',
    lastActive: '2026-02-08T11:30:00',
    totalRequests: 47,
    status: 'active',
  },
  {
    id: 'pu-2',
    name: 'Ольга Миронова',
    email: 'o.mironova@company.ru',
    avatar: '',
    department: 'HR',
    role: 'Специалист',
    lastActive: '2026-02-08T10:15:00',
    totalRequests: 23,
    status: 'active',
  },
  {
    id: 'pu-3',
    name: 'Андрей Кузнецов',
    email: 'a.kuznetsov@company.ru',
    avatar: '',
    department: 'IT',
    role: 'Разработчик',
    lastActive: '2026-02-07T18:45:00',
    totalRequests: 12,
    status: 'active',
  },
  {
    id: 'pu-4',
    name: 'Наталья Белова',
    email: 'n.belova@company.ru',
    avatar: '',
    department: 'Бухгалтерия',
    role: 'Главный бухгалтер',
    lastActive: '2026-02-06T09:00:00',
    totalRequests: 89,
    status: 'inactive',
  },
  {
    id: 'pu-5',
    name: 'Виктор Соколов',
    email: 'v.sokolov@company.ru',
    avatar: '',
    department: 'Маркетинг',
    role: 'Директор',
    lastActive: '2026-02-08T12:00:00',
    totalRequests: 156,
    status: 'active',
  },
];

// Данные графика активности (30 дней)
export const activityChartData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date('2026-02-08');
  date.setDate(date.getDate() - (29 - i));
  return {
    date: date.toISOString().split('T')[0],
    aiRequests: Math.floor(Math.random() * 500) + 200,
    escalations: Math.floor(Math.random() * 30) + 5,
  };
});

// Использование по сервисам
export const serviceUsage = [
  { service: 'Юрист', requests: 3420, quota: 5000, escalations: 145 },
  { service: 'Врач', requests: 2890, quota: 4000, escalations: 98 },
  { service: 'Психолог', requests: 1560, quota: 2000, escalations: 234 },
  { service: 'Финансист', requests: 890, quota: 1500, escalations: 45 },
  { service: 'Фитнес', requests: 2100, quota: 3000, escalations: 12 },
  { service: 'Нутрициолог', requests: 780, quota: 1000, escalations: 28 },
];

// Биллинг: квоты
export const billingQuotas = [
  { service: 'AI-запросы', used: 11640, limit: 15000, unit: 'запросов' },
  { service: 'Эскалации к экспертам', used: 562, limit: 1000, unit: 'сессий' },
  { service: 'Хранилище документов', used: 4.2, limit: 10, unit: 'ГБ' },
  { service: 'API вызовы', used: 45000, limit: 100000, unit: 'вызовов' },
];

// Отчёты
export interface Report {
  id: string;
  name: string;
  type: 'usage' | 'billing' | 'quality' | 'users';
  createdAt: string;
  format: 'pdf' | 'xlsx' | 'csv';
  size: string;
}

export const mockReports: Report[] = [
  {
    id: 'rep-1',
    name: 'Отчёт по использованию за январь 2026',
    type: 'usage',
    createdAt: '2026-02-01T10:00:00',
    format: 'pdf',
    size: '2.4 МБ',
  },
  {
    id: 'rep-2',
    name: 'Биллинг Q4 2025',
    type: 'billing',
    createdAt: '2026-01-15T14:30:00',
    format: 'xlsx',
    size: '1.1 МБ',
  },
  {
    id: 'rep-3',
    name: 'Качество AI-ответов — декабрь',
    type: 'quality',
    createdAt: '2026-01-05T09:00:00',
    format: 'pdf',
    size: '3.8 МБ',
  },
];

// ============================================
// EXPERT MODULE DATA
// ============================================

export type SessionStatus = 'completed' | 'scheduled' | 'cancelled' | 'in_progress';

export interface ExpertSession {
  id: string;
  clientName: string;
  topic: string;
  date: string;
  duration: number; // minutes
  rating: number | null;
  status: SessionStatus;
  service: string;
  conclusionId: string | null;
}

export const expertSessions: ExpertSession[] = [
  { id: 'ses-1', clientName: 'Иван Петров', topic: 'Расторжение трудового договора', date: '2026-02-08T14:00:00', duration: 18, rating: 4.8, status: 'completed', service: 'lawyer', conclusionId: 'con-1' },
  { id: 'ses-2', clientName: 'Мария Козлова', topic: 'Консультация по аренде', date: '2026-02-07T15:30:00', duration: 25, rating: 5.0, status: 'completed', service: 'lawyer', conclusionId: 'con-2' },
  { id: 'ses-3', clientName: 'Алексей Новиков', topic: 'Оптимизация налогов', date: '2026-02-06T10:00:00', duration: 12, rating: 4.5, status: 'completed', service: 'financier', conclusionId: 'con-3' },
  { id: 'ses-4', clientName: 'Елена Сидорова', topic: 'Консультация по давлению', date: '2026-02-05T11:30:00', duration: 22, rating: 4.9, status: 'completed', service: 'doctor', conclusionId: 'con-4' },
  { id: 'ses-5', clientName: 'Дмитрий Орлов', topic: 'Тревожные состояния', date: '2026-02-04T16:00:00', duration: 35, rating: 5.0, status: 'completed', service: 'psychologist', conclusionId: 'con-5' },
  { id: 'ses-6', clientName: 'Анна Белова', topic: 'Защита прав потребителя', date: '2026-02-08T17:00:00', duration: 0, rating: null, status: 'scheduled', service: 'lawyer', conclusionId: null },
  { id: 'ses-7', clientName: 'Сергей Васильев', topic: 'Наследственные вопросы', date: '2026-02-09T10:00:00', duration: 0, rating: null, status: 'scheduled', service: 'lawyer', conclusionId: null },
  { id: 'ses-8', clientName: 'Ольга Миронова', topic: 'Стресс на работе', date: '2026-02-03T14:00:00', duration: 0, rating: null, status: 'cancelled', service: 'psychologist', conclusionId: null },
];

export type ConclusionType = 'consultation' | 'referral' | 'general';
export type ConclusionStatus = 'draft' | 'completed' | 'sent';

export interface ExpertConclusion {
  id: string;
  clientName: string;
  sessionId: string;
  type: ConclusionType;
  date: string;
  status: ConclusionStatus;
  text: string;
}

export const expertConclusions: ExpertConclusion[] = [
  { id: 'con-1', clientName: 'Иван Петров', sessionId: 'ses-1', type: 'consultation', date: '2026-02-08T14:30:00', status: 'completed', text: 'Проведена консультация по расторжению трудового договора. Рекомендовано обратиться в трудовую инспекцию.' },
  { id: 'con-2', clientName: 'Мария Козлова', sessionId: 'ses-2', type: 'consultation', date: '2026-02-07T16:00:00', status: 'sent', text: 'Разъяснены права арендатора при расторжении договора аренды.' },
  { id: 'con-3', clientName: 'Алексей Новиков', sessionId: 'ses-3', type: 'general', date: '2026-02-06T10:30:00', status: 'draft', text: 'Черновик заключения по оптимизации налогообложения для ИП.' },
  { id: 'con-4', clientName: 'Елена Сидорова', sessionId: 'ses-4', type: 'referral', date: '2026-02-05T12:00:00', status: 'completed', text: 'Направление к кардиологу для дополнительного обследования.' },
  { id: 'con-5', clientName: 'Дмитрий Орлов', sessionId: 'ses-5', type: 'consultation', date: '2026-02-04T17:00:00', status: 'completed', text: 'Проведена консультация по управлению тревожностью. Рекомендован курс из 5 сессий.' },
];

// ============================================
// SUPER ADMIN MODULE DATA
// ============================================

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: 'month' | 'year';
  limits: {
    aiRequests: number | null; // null = unlimited
    escalations: number | null;
    storage: number; // GB
    apiCalls: number | null;
  };
  support: string;
  features: string[];
  isPopular?: boolean;
}

export const pricingPlans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 15000,
    period: 'month',
    limits: { aiRequests: 1000, escalations: 50, storage: 5, apiCalls: 10000 },
    support: 'Email-поддержка',
    features: ['3 сервиса', 'Базовая аналитика', 'Email уведомления'],
  },
  {
    id: 'business',
    name: 'Business',
    price: 45000,
    period: 'month',
    limits: { aiRequests: 5000, escalations: 200, storage: 25, apiCalls: 50000 },
    support: 'Приоритетная поддержка',
    features: ['Все сервисы', 'Продвинутая аналитика', 'API доступ', 'Брендирование'],
    isPopular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 120000,
    period: 'month',
    limits: { aiRequests: null, escalations: null, storage: 100, apiCalls: null },
    support: '24/7 + персональный менеджер',
    features: ['Безлимитные запросы', 'SLA 99.9%', 'Выделенная инфраструктура', 'Кастомные интеграции'],
  },
];

export interface MiniApp {
  id: string;
  serviceId: string;
  name: string;
  icon: string;
  usersCount: number;
  status: 'active' | 'draft' | 'disabled';
  createdAt: string;
}

export const miniApps: MiniApp[] = [
  { id: 'app-1', serviceId: 'lawyer', name: 'Юрист AI', icon: '⚖️', usersCount: 12500, status: 'active', createdAt: '2025-06-15' },
  { id: 'app-2', serviceId: 'doctor', name: 'Врач AI', icon: '🩺', usersCount: 8400, status: 'active', createdAt: '2025-07-20' },
  { id: 'app-3', serviceId: 'psychologist', name: 'Психолог AI', icon: '🧠', usersCount: 3200, status: 'active', createdAt: '2025-09-01' },
];
