import { Scale, Heart, Brain, Wallet, Dumbbell, Shirt, PawPrint, Leaf, LucideIcon } from 'lucide-react';

export type MiniAppStatus = 'active' | 'draft' | 'testing';
export type CategoryStatus = 'active' | 'testing' | 'draft';
export type EscalationPriority = 'critical' | 'high' | 'medium' | 'low';

export interface MiniApp {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  status: MiniAppStatus;
  stats: {
    requests: number;
    rating: number | null;
  };
  tenants: {
    gpb: boolean;
    wb: boolean;
    mec: boolean;
  };
}

export interface Category {
  id: string;
  name: string;
  description: string;
  questions: number;
  escalations: number;
  escalationRate: number;
  status: CategoryStatus;
}

export interface EscalationRule {
  id: string;
  condition: string;
  enabled: boolean;
  priority: EscalationPriority;
}

export interface LinkedExpert {
  id: string;
  name: string;
  avatar: string;
  specialization: string;
  online: boolean;
}

export interface TenantSettings {
  id: string;
  name: string;
  enabled: boolean;
  customPrompt: string | null;
  limit: number | null; // null = unlimited
  used: number;
}

export interface MiniAppConfig {
  id: string;
  aiSettings: {
    systemPrompt: string;
    model: string;
    temperature: number;
    maxTokens: number;
    useRag: boolean;
    useWhisper: boolean;
    confidenceThreshold: number;
  };
  restrictions: {
    forbiddenTopics: string;
    requireDocConfirmation: boolean;
  };
  categories: Category[];
  escalationRules: EscalationRule[];
  linkedExperts: LinkedExpert[];
  tenantSettings: TenantSettings[];
  analytics: {
    requestsMonth: number;
    requestsTrend: number;
    avgConfidence: number;
    confidenceTrend: number;
    escalations: number;
    escalationRate: number;
    escalationTrend: number;
    dailyData: { date: string; requests: number }[];
    categoryData: { name: string; value: number }[];
  };
}

export const miniApps: MiniApp[] = [
  {
    id: 'lawyer',
    name: 'Юрист',
    description: 'AI-консультант по семейному, трудовому, жилищному праву',
    icon: Scale,
    color: 'text-blue-500',
    status: 'active',
    stats: { requests: 1847, rating: 4.7 },
    tenants: { gpb: true, wb: true, mec: true },
  },
  {
    id: 'doctor',
    name: 'Врач',
    description: 'Первичная консультация, симптомы, направления',
    icon: Heart,
    color: 'text-red-500',
    status: 'active',
    stats: { requests: 1203, rating: 4.8 },
    tenants: { gpb: true, wb: false, mec: true },
  },
  {
    id: 'psychologist',
    name: 'Психолог',
    description: 'Поддержка, стресс, тревожность, отношения',
    icon: Brain,
    color: 'text-purple-500',
    status: 'active',
    stats: { requests: 892, rating: 4.9 },
    tenants: { gpb: true, wb: true, mec: false },
  },
  {
    id: 'financier',
    name: 'Финансист',
    description: 'Бюджет, инвестиции, налоги, кредиты',
    icon: Wallet,
    color: 'text-green-500',
    status: 'active',
    stats: { requests: 567, rating: 4.5 },
    tenants: { gpb: true, wb: false, mec: false },
  },
  {
    id: 'fitness',
    name: 'Фитнес',
    description: 'Тренировки, питание, восстановление',
    icon: Dumbbell,
    color: 'text-orange-500',
    status: 'active',
    stats: { requests: 1340, rating: 4.8 },
    tenants: { gpb: false, wb: true, mec: false },
  },
  {
    id: 'stylist',
    name: 'Стилист',
    description: 'Гардероб, подбор образов, шопинг-листы',
    icon: Shirt,
    color: 'text-pink-500',
    status: 'active',
    stats: { requests: 780, rating: 4.6 },
    tenants: { gpb: false, wb: true, mec: false },
  },
  {
    id: 'veterinarian',
    name: 'Ветеринар',
    description: 'Здоровье питомцев, вакцинация, питание',
    icon: PawPrint,
    color: 'text-teal-500',
    status: 'draft',
    stats: { requests: 0, rating: null },
    tenants: { gpb: false, wb: false, mec: false },
  },
  {
    id: 'gardener',
    name: 'Сад/огород',
    description: 'Рассада, удобрения, борьба с вредителями',
    icon: Leaf,
    color: 'text-lime-500',
    status: 'testing',
    stats: { requests: 0, rating: null },
    tenants: { gpb: false, wb: false, mec: false },
  },
];

// Generate daily data for analytics
const generateDailyData = () => {
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }),
      requests: Math.floor(Math.random() * 40) + 40,
    });
  }
  return data;
};

export const miniAppConfigs: Record<string, MiniAppConfig> = {
  lawyer: {
    id: 'lawyer',
    aiSettings: {
      systemPrompt: `Ты — AI-юрист платформы Добросервис. Отвечай на вопросы по российскому законодательству: семейное, трудовое, жилищное, наследственное право. Ссылайся на конкретные статьи законов. Если вопрос выходит за рамки компетенции — предложи запись к живому эксперту. Не давай рекомендаций по уголовному праву.`,
      model: 'gpt-4o',
      temperature: 0.3,
      maxTokens: 1024,
      useRag: true,
      useWhisper: true,
      confidenceThreshold: 0.5,
    },
    restrictions: {
      forbiddenTopics: 'Уголовное право, обход законодательства, налоговые схемы',
      requireDocConfirmation: false,
    },
    categories: [
      { id: 'family', name: 'Семейное право', description: 'Развод, алименты, раздел имущества', questions: 523, escalations: 28, escalationRate: 5.4, status: 'active' },
      { id: 'labor', name: 'Трудовое право', description: 'Увольнение, отпуск, зарплата', questions: 412, escalations: 19, escalationRate: 4.6, status: 'active' },
      { id: 'housing', name: 'Жилищное право', description: 'Аренда, ЖКХ, соседи, перепланировка', questions: 289, escalations: 12, escalationRate: 4.2, status: 'active' },
      { id: 'inheritance', name: 'Наследство', description: 'Завещание, доли, сроки', questions: 201, escalations: 8, escalationRate: 4.0, status: 'active' },
      { id: 'consumer', name: 'Защита прав потребителей', description: 'Возврат товара, гарантия', questions: 178, escalations: 6, escalationRate: 3.4, status: 'active' },
      { id: 'auto', name: 'Автоправо', description: 'ДТП, штрафы, страховка', questions: 134, escalations: 14, escalationRate: 10.4, status: 'testing' },
      { id: 'migration', name: 'Миграционное право', description: 'Гражданство, ВНЖ, регистрация', questions: 0, escalations: 0, escalationRate: 0, status: 'draft' },
    ],
    escalationRules: [
      { id: 'r1', condition: 'Если confidence < 0.4 → предложить запись к эксперту', enabled: true, priority: 'high' },
      { id: 'r2', condition: 'Если тема = Уголовное право → немедленная эскалация', enabled: true, priority: 'critical' },
      { id: 'r3', condition: 'Если пользователь запросил "живого юриста" → предложить запись', enabled: true, priority: 'medium' },
      { id: 'r4', condition: 'Если 3+ сообщения без решения → предложить запись', enabled: false, priority: 'low' },
    ],
    linkedExperts: [
      { id: 'e1', name: 'Алексей Петров', avatar: 'АП', specialization: 'Семейное право', online: true },
      { id: 'e2', name: 'Елена Новикова', avatar: 'ЕН', specialization: 'Трудовое право', online: false },
    ],
    tenantSettings: [
      { id: 'gpb', name: 'Газпромбанк', enabled: true, customPrompt: 'Ты — AI-юрист для клиентов Газпромбанка. Учитывай что клиенты могут спрашивать про банковские продукты. В таких случаях направляй в поддержку банка.', limit: 200, used: 87 },
      { id: 'wb', name: 'Wildberries', enabled: true, customPrompt: null, limit: 100, used: 62 },
      { id: 'mec', name: 'МЭЦ', enabled: true, customPrompt: null, limit: 50, used: 48 },
      { id: 'dobro', name: 'Добросервис', enabled: true, customPrompt: null, limit: null, used: 234 },
    ],
    analytics: {
      requestsMonth: 1847,
      requestsTrend: 12,
      avgConfidence: 0.87,
      confidenceTrend: 0.03,
      escalations: 73,
      escalationRate: 3.9,
      escalationTrend: -0.5,
      dailyData: generateDailyData(),
      categoryData: [
        { name: 'Семейное право', value: 523 },
        { name: 'Трудовое право', value: 412 },
        { name: 'Жилищное право', value: 289 },
        { name: 'Наследство', value: 201 },
        { name: 'Защита прав', value: 178 },
        { name: 'Автоправо', value: 134 },
      ],
    },
  },
  doctor: {
    id: 'doctor',
    aiSettings: {
      systemPrompt: `Ты — AI-консультант по здоровью платформы Добросервис. Помогай с первичной оценкой симптомов, давай общие рекомендации по здоровью, направляй к нужным специалистам. Не ставь диагнозов и не назначай лечение. При серьёзных симптомах рекомендуй обратиться к врачу.`,
      model: 'gpt-4o',
      temperature: 0.2,
      maxTokens: 1024,
      useRag: true,
      useWhisper: true,
      confidenceThreshold: 0.6,
    },
    restrictions: {
      forbiddenTopics: 'Назначение лекарств, постановка диагнозов, рецепты',
      requireDocConfirmation: true,
    },
    categories: [
      { id: 'symptoms', name: 'Оценка симптомов', description: 'Первичная оценка жалоб', questions: 456, escalations: 34, escalationRate: 7.5, status: 'active' },
      { id: 'prevention', name: 'Профилактика', description: 'Здоровый образ жизни', questions: 312, escalations: 8, escalationRate: 2.6, status: 'active' },
      { id: 'specialists', name: 'Направление к врачу', description: 'Выбор специалиста', questions: 245, escalations: 22, escalationRate: 9.0, status: 'active' },
      { id: 'medications', name: 'Вопросы о лекарствах', description: 'Общая информация', questions: 190, escalations: 28, escalationRate: 14.7, status: 'testing' },
    ],
    escalationRules: [
      { id: 'r1', condition: 'Если confidence < 0.5 → предложить запись к врачу', enabled: true, priority: 'high' },
      { id: 'r2', condition: 'Если симптомы = острые/опасные → немедленная эскалация', enabled: true, priority: 'critical' },
      { id: 'r3', condition: 'Если пользователь запросил рецепт → эскалация', enabled: true, priority: 'high' },
    ],
    linkedExperts: [
      { id: 'e1', name: 'Мария Козлова', avatar: 'МК', specialization: 'Терапевт', online: true },
      { id: 'e2', name: 'Андрей Смирнов', avatar: 'АС', specialization: 'Педиатр', online: true },
    ],
    tenantSettings: [
      { id: 'gpb', name: 'Газпромбанк', enabled: true, customPrompt: null, limit: 150, used: 98 },
      { id: 'wb', name: 'Wildberries', enabled: false, customPrompt: null, limit: 0, used: 0 },
      { id: 'mec', name: 'МЭЦ', enabled: true, customPrompt: null, limit: 100, used: 67 },
      { id: 'dobro', name: 'Добросервис', enabled: true, customPrompt: null, limit: null, used: 189 },
    ],
    analytics: {
      requestsMonth: 1203,
      requestsTrend: 8,
      avgConfidence: 0.82,
      confidenceTrend: 0.02,
      escalations: 92,
      escalationRate: 7.6,
      escalationTrend: -1.2,
      dailyData: generateDailyData(),
      categoryData: [
        { name: 'Оценка симптомов', value: 456 },
        { name: 'Профилактика', value: 312 },
        { name: 'Направление к врачу', value: 245 },
        { name: 'Вопросы о лекарствах', value: 190 },
      ],
    },
  },
};

// Default config for apps without specific config
export const getDefaultConfig = (appId: string): MiniAppConfig => {
  const app = miniApps.find(a => a.id === appId);
  return {
    id: appId,
    aiSettings: {
      systemPrompt: `Ты — AI-консультант платформы Добросервис по направлению "${app?.name || 'Общее'}". Помогай пользователям с их вопросами, будь вежлив и профессионален.`,
      model: 'gpt-4o',
      temperature: 0.3,
      maxTokens: 1024,
      useRag: false,
      useWhisper: false,
      confidenceThreshold: 0.5,
    },
    restrictions: {
      forbiddenTopics: '',
      requireDocConfirmation: false,
    },
    categories: [],
    escalationRules: [],
    linkedExperts: [],
    tenantSettings: [
      { id: 'gpb', name: 'Газпромбанк', enabled: false, customPrompt: null, limit: 100, used: 0 },
      { id: 'wb', name: 'Wildberries', enabled: false, customPrompt: null, limit: 100, used: 0 },
      { id: 'mec', name: 'МЭЦ', enabled: false, customPrompt: null, limit: 50, used: 0 },
      { id: 'dobro', name: 'Добросервис', enabled: true, customPrompt: null, limit: null, used: 0 },
    ],
    analytics: {
      requestsMonth: 0,
      requestsTrend: 0,
      avgConfidence: 0,
      confidenceTrend: 0,
      escalations: 0,
      escalationRate: 0,
      escalationTrend: 0,
      dailyData: [],
      categoryData: [],
    },
  };
};

export const getMiniAppConfig = (appId: string): MiniAppConfig => {
  return miniAppConfigs[appId] || getDefaultConfig(appId);
};

export const modelOptions = [
  { value: 'gpt-4o', label: 'GPT-4o' },
  { value: 'gpt-4o-mini', label: 'GPT-4o-mini' },
  { value: 'claude-3.5-sonnet', label: 'Claude 3.5 Sonnet' },
  { value: 'gigachat-pro', label: 'GigaChat Pro' },
];

export const priorityOptions = [
  { value: 'critical', label: 'Критический' },
  { value: 'high', label: 'Высокий' },
  { value: 'medium', label: 'Средний' },
  { value: 'low', label: 'Низкий' },
];
