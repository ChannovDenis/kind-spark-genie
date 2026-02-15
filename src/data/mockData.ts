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

// Mock-эскалации (демонстрационные данные)
export const mockEscalations: Escalation[] = [
  {
    id: 'esc-1',
    userId: 'u-1',
    userName: 'Клиент 1',
    userAvatar: '',
    service: 'lawyer',
    topic: 'Вопрос по договору',
    status: 'pending',
    priority: 'high',
    createdAt: '2026-02-08T10:30:00',
  },
  {
    id: 'esc-2',
    userId: 'u-2',
    userName: 'Клиент 2',
    userAvatar: '',
    service: 'doctor',
    topic: 'Консультация по результатам',
    status: 'in_progress',
    priority: 'medium',
    createdAt: '2026-02-08T09:15:00',
    expertName: 'Эксперт 1',
  },
  {
    id: 'esc-3',
    userId: 'u-3',
    userName: 'Клиент 3',
    userAvatar: '',
    service: 'psychologist',
    topic: 'Психологическая консультация',
    status: 'in_progress',
    priority: 'high',
    createdAt: '2026-02-07T16:45:00',
    expertName: 'Эксперт 2',
  },
  {
    id: 'esc-4',
    userId: 'u-4',
    userName: 'Клиент 4',
    userAvatar: '',
    service: 'financier',
    topic: 'Финансовая консультация',
    status: 'resolved',
    priority: 'low',
    createdAt: '2026-02-06T14:20:00',
    expertName: 'Эксперт 3',
  },
  {
    id: 'esc-5',
    userId: 'u-5',
    userName: 'Клиент 5',
    userAvatar: '',
    service: 'lawyer',
    topic: 'Защита прав',
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
    name: 'Пользователь 1',
    email: 'user1@example.com',
    avatar: '',
    department: 'Отдел продаж',
    role: 'Менеджер',
    lastActive: '2026-02-08T11:30:00',
    totalRequests: 47,
    status: 'active',
  },
  {
    id: 'pu-2',
    name: 'Пользователь 2',
    email: 'user2@example.com',
    avatar: '',
    department: 'HR',
    role: 'Специалист',
    lastActive: '2026-02-08T10:15:00',
    totalRequests: 23,
    status: 'active',
  },
  {
    id: 'pu-3',
    name: 'Пользователь 3',
    email: 'user3@example.com',
    avatar: '',
    department: 'IT',
    role: 'Разработчик',
    lastActive: '2026-02-07T18:45:00',
    totalRequests: 12,
    status: 'active',
  },
  {
    id: 'pu-4',
    name: 'Пользователь 4',
    email: 'user4@example.com',
    avatar: '',
    department: 'Бухгалтерия',
    role: 'Главный бухгалтер',
    lastActive: '2026-02-06T09:00:00',
    totalRequests: 89,
    status: 'inactive',
  },
  {
    id: 'pu-5',
    name: 'Пользователь 5',
    email: 'user5@example.com',
    avatar: '',
    department: 'Маркетинг',
    role: 'Директор',
    lastActive: '2026-02-08T12:00:00',
    totalRequests: 156,
    status: 'active',
  },
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
  { id: 'ses-1', clientName: 'Клиент A', topic: 'Трудовой договор', date: '2026-02-08T14:00:00', duration: 18, rating: 4.8, status: 'completed', service: 'lawyer', conclusionId: 'con-1' },
  { id: 'ses-2', clientName: 'Клиент B', topic: 'Консультация по аренде', date: '2026-02-07T15:30:00', duration: 25, rating: 5.0, status: 'completed', service: 'lawyer', conclusionId: 'con-2' },
  { id: 'ses-3', clientName: 'Клиент C', topic: 'Налоговая консультация', date: '2026-02-06T10:00:00', duration: 12, rating: 4.5, status: 'completed', service: 'financier', conclusionId: 'con-3' },
  { id: 'ses-4', clientName: 'Клиент D', topic: 'Медицинская консультация', date: '2026-02-05T11:30:00', duration: 22, rating: 4.9, status: 'completed', service: 'doctor', conclusionId: 'con-4' },
  { id: 'ses-5', clientName: 'Клиент E', topic: 'Психологическая поддержка', date: '2026-02-04T16:00:00', duration: 35, rating: 5.0, status: 'completed', service: 'psychologist', conclusionId: 'con-5' },
  { id: 'ses-6', clientName: 'Клиент F', topic: 'Защита прав', date: '2026-02-08T17:00:00', duration: 0, rating: null, status: 'scheduled', service: 'lawyer', conclusionId: null },
  { id: 'ses-7', clientName: 'Клиент G', topic: 'Наследство', date: '2026-02-09T10:00:00', duration: 0, rating: null, status: 'scheduled', service: 'lawyer', conclusionId: null },
  { id: 'ses-8', clientName: 'Клиент H', topic: 'Консультация', date: '2026-02-03T14:00:00', duration: 0, rating: null, status: 'cancelled', service: 'psychologist', conclusionId: null },
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
  { id: 'con-1', clientName: 'Клиент A', sessionId: 'ses-1', type: 'consultation', date: '2026-02-08T14:30:00', status: 'completed', text: 'Проведена консультация по трудовому договору.' },
  { id: 'con-2', clientName: 'Клиент B', sessionId: 'ses-2', type: 'consultation', date: '2026-02-07T16:00:00', status: 'sent', text: 'Разъяснены права арендатора.' },
  { id: 'con-3', clientName: 'Клиент C', sessionId: 'ses-3', type: 'general', date: '2026-02-06T10:30:00', status: 'draft', text: 'Черновик заключения по налогам.' },
  { id: 'con-4', clientName: 'Клиент D', sessionId: 'ses-4', type: 'referral', date: '2026-02-05T12:00:00', status: 'completed', text: 'Направление к специалисту.' },
  { id: 'con-5', clientName: 'Клиент E', sessionId: 'ses-5', type: 'consultation', date: '2026-02-04T17:00:00', status: 'completed', text: 'Консультация завершена.' },
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
