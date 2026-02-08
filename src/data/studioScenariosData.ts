// Mock data for studio scenarios and feed

export interface Scene {
  id: string;
  order: number;
  textOnScreen: string;
  videoPrompt: string;
  voiceover: string;
  badge?: 'hook' | 'cta';
}

export interface Scenario {
  id: string;
  title: string;
  type: 'reels' | 'vsl' | 'story' | 'shorts';
  category: string;
  tenant: string;
  scenesCount: number;
  status: 'draft' | 'ready' | 'generating' | 'published';
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
  scenes: Scene[];
}

export interface FeedItem {
  id: string;
  title: string;
  category: string;
  tenant: string;
  publishedAt: string;
  views: number;
  aiClicks: number;
  channels: ('app' | 'youtube' | 'vk' | 'telegram')[];
  status: 'active' | 'paused' | 'archived';
  thumbnail: string;
}

export interface RecentVideo {
  id: string;
  title: string;
  status: 'draft' | 'generating' | 'ready' | 'published';
  progress?: number;
  channels: ('app' | 'youtube' | 'vk' | 'telegram')[];
  thumbnail: string;
  createdAt: string;
}

export const mockScenarios: Scenario[] = [
  {
    id: 'sc-001',
    title: 'Как получить налоговый вычет за лечение',
    type: 'reels',
    category: 'Финансы',
    tenant: 'Газпромбанк',
    scenesCount: 5,
    status: 'published',
    createdAt: '2026-02-05',
    updatedAt: '2026-02-07',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=200&fit=crop',
    scenes: [
      { id: 's1', order: 1, textOnScreen: 'Знали ли вы?', videoPrompt: 'Человек удивленно смотрит на документы', voiceover: 'Знали ли вы, что можно вернуть до 15 600 рублей за лечение?', badge: 'hook' },
      { id: 's2', order: 2, textOnScreen: 'Шаг 1: Соберите документы', videoPrompt: 'Папка с документами на столе', voiceover: 'Первый шаг — собрать чеки и справки из клиники' },
      { id: 's3', order: 3, textOnScreen: 'Шаг 2: Заполните декларацию', videoPrompt: 'Человек заполняет форму на компьютере', voiceover: 'Заполните декларацию 3-НДФЛ через личный кабинет' },
      { id: 's4', order: 4, textOnScreen: 'Шаг 3: Отправьте в ФНС', videoPrompt: 'Отправка документов онлайн', voiceover: 'Отправьте документы и ждите решения' },
      { id: 's5', order: 5, textOnScreen: 'Получите деньги!', videoPrompt: 'Счастливый человек с телефоном', voiceover: 'Деньги поступят на ваш счёт в течение 4 месяцев. Нужна помощь? Напишите нашему AI-консультанту!', badge: 'cta' },
    ],
  },
  {
    id: 'sc-002',
    title: 'Что делать при головной боли',
    type: 'shorts',
    category: 'Здоровье',
    tenant: 'Газпромбанк',
    scenesCount: 4,
    status: 'ready',
    createdAt: '2026-02-06',
    updatedAt: '2026-02-08',
    thumbnail: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=300&h=200&fit=crop',
    scenes: [
      { id: 's1', order: 1, textOnScreen: 'Болит голова?', videoPrompt: 'Человек держится за голову', voiceover: 'Головная боль мешает жить? Вот 4 проверенных способа помочь себе', badge: 'hook' },
      { id: 's2', order: 2, textOnScreen: '1. Выпейте воды', videoPrompt: 'Стакан воды', voiceover: 'Часто головная боль — признак обезвоживания' },
      { id: 's3', order: 3, textOnScreen: '2. Проветрите помещение', videoPrompt: 'Открытое окно', voiceover: 'Свежий воздух улучшает кровообращение' },
      { id: 's4', order: 4, textOnScreen: 'Нужна консультация врача?', videoPrompt: 'Врач онлайн', voiceover: 'Если боль не проходит, запишитесь к нашему врачу прямо сейчас!', badge: 'cta' },
    ],
  },
  {
    id: 'sc-003',
    title: 'VSL: Кредитная карта с кешбэком',
    type: 'vsl',
    category: 'Продукты',
    tenant: 'Газпромбанк',
    scenesCount: 8,
    status: 'generating',
    createdAt: '2026-02-07',
    updatedAt: '2026-02-08',
    thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop',
    scenes: [],
  },
  {
    id: 'sc-004',
    title: 'Как оформить возврат товара',
    type: 'reels',
    category: 'Права потребителя',
    tenant: 'Wildberries',
    scenesCount: 5,
    status: 'draft',
    createdAt: '2026-02-04',
    updatedAt: '2026-02-04',
    thumbnail: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=300&h=200&fit=crop',
    scenes: [],
  },
  {
    id: 'sc-005',
    title: 'Что делать если товар не пришёл',
    type: 'story',
    category: 'Доставка',
    tenant: 'Wildberries',
    scenesCount: 4,
    status: 'published',
    createdAt: '2026-02-01',
    updatedAt: '2026-02-03',
    thumbnail: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=300&h=200&fit=crop',
    scenes: [],
  },
  {
    id: 'sc-006',
    title: 'Симптомы ОРВИ: когда идти к врачу',
    type: 'reels',
    category: 'Здоровье',
    tenant: 'ГосУслуги',
    scenesCount: 6,
    status: 'ready',
    createdAt: '2026-02-02',
    updatedAt: '2026-02-06',
    thumbnail: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=300&h=200&fit=crop',
    scenes: [],
  },
  {
    id: 'sc-007',
    title: 'Как записаться к врачу онлайн',
    type: 'shorts',
    category: 'Услуги',
    tenant: 'ГосУслуги',
    scenesCount: 3,
    status: 'draft',
    createdAt: '2026-02-08',
    updatedAt: '2026-02-08',
    thumbnail: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&h=200&fit=crop',
    scenes: [],
  },
  {
    id: 'sc-008',
    title: 'Права при увольнении',
    type: 'vsl',
    category: 'Трудовое право',
    tenant: 'Газпромбанк',
    scenesCount: 7,
    status: 'published',
    createdAt: '2026-01-28',
    updatedAt: '2026-02-02',
    thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=300&h=200&fit=crop',
    scenes: [],
  },
];

export const mockFeedItems: FeedItem[] = [
  {
    id: 'f-001',
    title: 'Как получить налоговый вычет за лечение',
    category: 'Финансы',
    tenant: 'Газпромбанк',
    publishedAt: '2026-02-07',
    views: 4520,
    aiClicks: 234,
    channels: ['app', 'telegram'],
    status: 'active',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=200&fit=crop',
  },
  {
    id: 'f-002',
    title: 'Права при увольнении — полный гайд',
    category: 'Трудовое право',
    tenant: 'Газпромбанк',
    publishedAt: '2026-02-02',
    views: 8934,
    aiClicks: 567,
    channels: ['app', 'youtube', 'vk'],
    status: 'active',
    thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=300&h=200&fit=crop',
  },
  {
    id: 'f-003',
    title: 'Что делать если товар не пришёл',
    category: 'Доставка',
    tenant: 'Wildberries',
    publishedAt: '2026-02-03',
    views: 12450,
    aiClicks: 892,
    channels: ['app', 'telegram', 'vk'],
    status: 'active',
    thumbnail: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=300&h=200&fit=crop',
  },
  {
    id: 'f-004',
    title: 'Симптомы ОРВИ: когда идти к врачу',
    category: 'Здоровье',
    tenant: 'ГосУслуги',
    publishedAt: '2026-02-06',
    views: 3200,
    aiClicks: 145,
    channels: ['app'],
    status: 'active',
    thumbnail: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=300&h=200&fit=crop',
  },
  {
    id: 'f-005',
    title: 'Как оформить больничный лист',
    category: 'Здоровье',
    tenant: 'ГосУслуги',
    publishedAt: '2026-01-25',
    views: 15600,
    aiClicks: 1023,
    channels: ['app', 'youtube', 'telegram'],
    status: 'paused',
    thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300&h=200&fit=crop',
  },
  {
    id: 'f-006',
    title: 'Возврат товара: пошаговая инструкция',
    category: 'Права потребителя',
    tenant: 'Wildberries',
    publishedAt: '2026-01-20',
    views: 21300,
    aiClicks: 1567,
    channels: ['app', 'vk'],
    status: 'archived',
    thumbnail: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=300&h=200&fit=crop',
  },
  {
    id: 'f-007',
    title: 'Кешбэк: как получить максимум',
    category: 'Финансы',
    tenant: 'Газпромбанк',
    publishedAt: '2026-02-01',
    views: 7840,
    aiClicks: 412,
    channels: ['app', 'telegram'],
    status: 'active',
    thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop',
  },
  {
    id: 'f-008',
    title: 'Страхование жизни: нужно ли вам?',
    category: 'Страхование',
    tenant: 'Газпромбанк',
    publishedAt: '2026-01-15',
    views: 5600,
    aiClicks: 287,
    channels: ['youtube'],
    status: 'active',
    thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=300&h=200&fit=crop',
  },
];

export const mockRecentVideos: RecentVideo[] = [
  {
    id: 'rv-001',
    title: 'Как получить налоговый вычет',
    status: 'published',
    channels: ['app', 'telegram'],
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=200&fit=crop',
    createdAt: '2026-02-07',
  },
  {
    id: 'rv-002',
    title: 'VSL: Кредитная карта',
    status: 'generating',
    progress: 60,
    channels: [],
    thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop',
    createdAt: '2026-02-08',
  },
  {
    id: 'rv-003',
    title: 'Симптомы ОРВИ',
    status: 'ready',
    channels: ['app'],
    thumbnail: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=300&h=200&fit=crop',
    createdAt: '2026-02-06',
  },
  {
    id: 'rv-004',
    title: 'Возврат товара в WB',
    status: 'draft',
    channels: [],
    thumbnail: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=300&h=200&fit=crop',
    createdAt: '2026-02-04',
  },
  {
    id: 'rv-005',
    title: 'Права при увольнении',
    status: 'published',
    channels: ['app', 'youtube', 'vk'],
    thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=300&h=200&fit=crop',
    createdAt: '2026-02-02',
  },
  {
    id: 'rv-006',
    title: 'Запись к врачу онлайн',
    status: 'draft',
    channels: [],
    thumbnail: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&h=200&fit=crop',
    createdAt: '2026-02-08',
  },
];

export const scenarioTypes = [
  { value: 'reels', label: 'Reels' },
  { value: 'vsl', label: 'VSL с аватаром' },
  { value: 'story', label: 'Stories' },
  { value: 'shorts', label: 'Shorts' },
];

export const scenarioCategories = [
  'Финансы',
  'Здоровье',
  'Права потребителя',
  'Трудовое право',
  'Доставка',
  'Продукты',
  'Страхование',
  'Услуги',
];

export const voiceOptions = [
  { value: 'female-1', label: 'Алиса (женский)' },
  { value: 'male-1', label: 'Дмитрий (мужской)' },
  { value: 'female-2', label: 'Мария (женский)' },
  { value: 'male-2', label: 'Артём (мужской)' },
];

export const musicOptions = [
  { value: 'upbeat', label: 'Бодрая' },
  { value: 'calm', label: 'Спокойная' },
  { value: 'corporate', label: 'Корпоративная' },
  { value: 'none', label: 'Без музыки' },
];

export const subtitleStyles = [
  { value: 'modern', label: 'Современный' },
  { value: 'classic', label: 'Классический' },
  { value: 'bold', label: 'Жирный' },
  { value: 'minimal', label: 'Минималистичный' },
];
