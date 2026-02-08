// Mock data for super-admin module

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  description: string;
  status: 'active' | 'draft';
  services: {
    name: string;
    enabled: boolean;
    limit: number | null;
  }[];
  miniApps: string[];
  maxUsers: number | null;
  overagePolicy: 'block' | 'charge' | 'notify';
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  channel: 'push' | 'email' | 'sms' | 'in-app';
  status: 'active' | 'paused' | 'draft' | 'completed';
  sent: number;
  opened: number;
  ctr: number;
  createdAt: string;
  scheduledAt?: string;
}

export interface Expert {
  id: string;
  name: string;
  specialization: string;
  rating: number;
  sessionsCount: number;
  tenants: string[];
  status: 'active' | 'inactive' | 'pending';
  avatar: string;
  email: string;
}

export interface TenantDetail {
  id: string;
  name: string;
  domain: string;
  contact: string;
  email: string;
  plan: string;
  status: 'active' | 'trial' | 'suspended';
  connectedAt: string;
  services: {
    name: string;
    enabled: boolean;
    limit: number;
    used: number;
  }[];
  branding: {
    primaryColor: string;
    appName: string;
    logo?: string;
  };
}

export interface AnalyticsData {
  dau: number;
  wau: number;
  mau: number;
  mrr: number;
  dauTrend: number;
  wauTrend: number;
  mauTrend: number;
  mrrTrend: number;
  tenantActivity: {
    date: string;
    gpb: number;
    wb: number;
    gosuslugi: number;
    demo: number;
  }[];
  serviceDistribution: {
    name: string;
    value: number;
  }[];
  mrrHistory: {
    month: string;
    value: number;
  }[];
}

export const mockPricingPlans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 29000,
    description: 'Для небольших компаний. Базовый набор AI-сервисов.',
    status: 'active',
    services: [
      { name: 'AI-консультант', enabled: true, limit: 1000 },
      { name: 'Эскалации к экспертам', enabled: true, limit: 50 },
      { name: 'Видеогенерация', enabled: false, limit: null },
      { name: 'Quality Center', enabled: false, limit: null },
      { name: 'API доступ', enabled: false, limit: null },
    ],
    miniApps: ['Чат-бот'],
    maxUsers: 100,
    overagePolicy: 'block',
  },
  {
    id: 'business',
    name: 'Business',
    price: 89000,
    description: 'Для среднего бизнеса. Расширенный функционал.',
    status: 'active',
    services: [
      { name: 'AI-консультант', enabled: true, limit: 5000 },
      { name: 'Эскалации к экспертам', enabled: true, limit: 200 },
      { name: 'Видеогенерация', enabled: true, limit: 50 },
      { name: 'Quality Center', enabled: true, limit: null },
      { name: 'API доступ', enabled: true, limit: 10000 },
    ],
    miniApps: ['Чат-бот', 'Запись к эксперту', 'База знаний'],
    maxUsers: 500,
    overagePolicy: 'charge',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 249000,
    description: 'Для крупных корпораций. Полный доступ без ограничений.',
    status: 'active',
    services: [
      { name: 'AI-консультант', enabled: true, limit: null },
      { name: 'Эскалации к экспертам', enabled: true, limit: null },
      { name: 'Видеогенерация', enabled: true, limit: null },
      { name: 'Quality Center', enabled: true, limit: null },
      { name: 'API доступ', enabled: true, limit: null },
    ],
    miniApps: ['Чат-бот', 'Запись к эксперту', 'База знаний', 'Видеолента', 'Аналитика'],
    maxUsers: null,
    overagePolicy: 'notify',
  },
  {
    id: 'gpb-custom',
    name: 'ГПБ Кастом',
    price: 450000,
    description: 'Специальный тариф для Газпромбанка.',
    status: 'active',
    services: [
      { name: 'AI-консультант', enabled: true, limit: null },
      { name: 'Эскалации к экспертам', enabled: true, limit: null },
      { name: 'Видеогенерация', enabled: true, limit: null },
      { name: 'Quality Center', enabled: true, limit: null },
      { name: 'API доступ', enabled: true, limit: null },
    ],
    miniApps: ['Чат-бот', 'Запись к эксперту', 'База знаний', 'Видеолента', 'Аналитика', 'Кастомные интеграции'],
    maxUsers: null,
    overagePolicy: 'notify',
  },
];

export const mockCampaigns: Campaign[] = [
  {
    id: 'c-001',
    title: 'Запуск нового AI-консультанта',
    description: 'Информируем пользователей о новых возможностях AI',
    channel: 'push',
    status: 'active',
    sent: 15420,
    opened: 4280,
    ctr: 12.4,
    createdAt: '2026-02-05',
    scheduledAt: '2026-02-08',
  },
  {
    id: 'c-002',
    title: 'Акция: бесплатная консультация',
    description: 'Промо-кампания для новых пользователей',
    channel: 'email',
    status: 'completed',
    sent: 8900,
    opened: 2670,
    ctr: 8.2,
    createdAt: '2026-01-28',
  },
  {
    id: 'c-003',
    title: 'Напоминание о записи',
    description: 'Триггерная рассылка за день до консультации',
    channel: 'sms',
    status: 'active',
    sent: 3240,
    opened: 2916,
    ctr: 45.6,
    createdAt: '2026-02-01',
  },
  {
    id: 'c-004',
    title: 'Новые видео в ленте',
    description: 'Уведомление о свежем контенте',
    channel: 'in-app',
    status: 'paused',
    sent: 22100,
    opened: 8840,
    ctr: 18.3,
    createdAt: '2026-02-03',
  },
  {
    id: 'c-005',
    title: 'NPS-опрос февраль',
    description: 'Ежемесячный опрос удовлетворённости',
    channel: 'email',
    status: 'draft',
    sent: 0,
    opened: 0,
    ctr: 0,
    createdAt: '2026-02-08',
    scheduledAt: '2026-02-15',
  },
];

export const mockExperts: Expert[] = [
  {
    id: 'exp-001',
    name: 'Алексей Смирнов',
    specialization: 'Юрист',
    rating: 4.9,
    sessionsCount: 342,
    tenants: ['Газпромбанк', 'ГосУслуги'],
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alexey',
    email: 'a.smirnov@example.com',
  },
  {
    id: 'exp-002',
    name: 'Мария Козлова',
    specialization: 'Врач-терапевт',
    rating: 4.8,
    sessionsCount: 256,
    tenants: ['Газпромбанк', 'ГосУслуги'],
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria',
    email: 'm.kozlova@example.com',
  },
  {
    id: 'exp-003',
    name: 'Дмитрий Волков',
    specialization: 'Финансовый консультант',
    rating: 4.7,
    sessionsCount: 189,
    tenants: ['Газпромбанк'],
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dmitry',
    email: 'd.volkov@example.com',
  },
  {
    id: 'exp-004',
    name: 'Елена Новикова',
    specialization: 'Психолог',
    rating: 4.9,
    sessionsCount: 421,
    tenants: ['Газпромбанк', 'Wildberries', 'ГосУслуги'],
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=elena',
    email: 'e.novikova@example.com',
  },
  {
    id: 'exp-005',
    name: 'Сергей Петров',
    specialization: 'Юрист',
    rating: 4.6,
    sessionsCount: 128,
    tenants: ['Wildberries'],
    status: 'inactive',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sergey',
    email: 's.petrov@example.com',
  },
  {
    id: 'exp-006',
    name: 'Анна Морозова',
    specialization: 'Врач-педиатр',
    rating: 4.8,
    sessionsCount: 0,
    tenants: [],
    status: 'pending',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=anna',
    email: 'a.morozova@example.com',
  },
];

export const mockTenantDetail: TenantDetail = {
  id: 'gpb',
  name: 'Газпромбанк',
  domain: 'gpb.dobroservis.ru',
  contact: 'Иван Иванов',
  email: 'i.ivanov@gpb.ru',
  plan: 'ГПБ Кастом',
  status: 'active',
  connectedAt: '2025-09-15',
  services: [
    { name: 'AI-консультант', enabled: true, limit: 100000, used: 45230 },
    { name: 'Эскалации к экспертам', enabled: true, limit: 5000, used: 1847 },
    { name: 'Видеогенерация', enabled: true, limit: 500, used: 156 },
    { name: 'Quality Center', enabled: true, limit: 10000, used: 3200 },
    { name: 'API доступ', enabled: true, limit: 1000000, used: 234567 },
  ],
  branding: {
    primaryColor: '#1e40af',
    appName: 'ГПБ Помощник',
    logo: undefined,
  },
};

export const mockAnalyticsData: AnalyticsData = {
  dau: 4230,
  wau: 18700,
  mau: 52400,
  mrr: 2450000,
  dauTrend: 5,
  wauTrend: 3,
  mauTrend: 8,
  mrrTrend: 12,
  tenantActivity: [
    { date: '2 фев', gpb: 2100, wb: 1200, gosuslugi: 800, demo: 130 },
    { date: '3 фев', gpb: 2250, wb: 1150, gosuslugi: 850, demo: 145 },
    { date: '4 фев', gpb: 2180, wb: 1280, gosuslugi: 790, demo: 125 },
    { date: '5 фев', gpb: 2420, wb: 1320, gosuslugi: 920, demo: 160 },
    { date: '6 фев', gpb: 2350, wb: 1400, gosuslugi: 880, demo: 140 },
    { date: '7 фев', gpb: 2480, wb: 1450, gosuslugi: 940, demo: 155 },
    { date: '8 фев', gpb: 2520, wb: 1380, gosuslugi: 910, demo: 165 },
  ],
  serviceDistribution: [
    { name: 'AI-консультант', value: 45 },
    { name: 'Эскалации', value: 25 },
    { name: 'Видео', value: 15 },
    { name: 'Quality', value: 10 },
    { name: 'API', value: 5 },
  ],
  mrrHistory: [
    { month: 'Сен 2025', value: 1800000 },
    { month: 'Окт 2025', value: 1950000 },
    { month: 'Ноя 2025', value: 2100000 },
    { month: 'Дек 2025', value: 2250000 },
    { month: 'Янв 2026', value: 2350000 },
    { month: 'Фев 2026', value: 2450000 },
  ],
};

export const channelLabels: Record<string, string> = {
  push: 'Push',
  email: 'Email',
  sms: 'SMS',
  'in-app': 'In-App',
};

export const expertSpecializations = [
  'Юрист',
  'Врач-терапевт',
  'Врач-педиатр',
  'Финансовый консультант',
  'Психолог',
];
