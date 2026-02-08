// Типы и данные для Контент-студии: тренды и аналитика удержания

// === ТИПЫ ===

export type Platform = 'youtube' | 'tiktok' | 'instagram';
export type HookType = 'question' | 'statement' | 'shock' | 'promise';
export type SourceType = 'channel' | 'hashtag' | 'keyword';

export interface TrendVideo {
  id: string;
  platform: Platform;
  title: string;
  thumbnail: string;
  channelName: string;
  channelAvatar: string;
  views: number;
  viewsGrowth24h: number;  // в %
  hookRate: number;        // % удержания 0-3 сек
  retention10s: number;    // % удержания на 10 сек
  hookText: string;        // транскрипт первых слов
  hookType: HookType;
  niche: string;
  publishedAt: string;
  duration: string;
}

export interface TrendSource {
  id: string;
  type: SourceType;
  platform: Platform;
  name: string;
  url?: string;
  isActive: boolean;
}

export interface VideoWithRetention {
  id: number;
  title: string;
  thumbnail: string;
  duration: string;
  status: 'ready' | 'processing' | 'error';
  views: number;
  createdAt: string;
  service: string;
  error?: string;
  // Retention метрики
  hookRate: number;      // % удержания 0-3 сек
  retention10s: number;  // % удержания на 10 сек
  retention30s: number;  // % удержания на 30 сек
  completionRate: number; // % досмотревших до конца
  avgWatchTime: string;  // среднее время просмотра
  retentionCurve: RetentionPoint[];
  dropOffPoints: DropOffPoint[];
}

export interface RetentionPoint {
  time: number;  // секунды
  retention: number; // %
}

export interface DropOffPoint {
  time: string;
  drop: number; // %
  reason: string;
}

// === КОНСТАНТЫ ===

export const hookTypeLabels: Record<HookType, string> = {
  question: 'Вопрос',
  statement: 'Утверждение',
  shock: 'Шок',
  promise: 'Обещание',
};

export const platformLabels: Record<Platform, string> = {
  youtube: 'YouTube',
  tiktok: 'TikTok',
  instagram: 'Instagram',
};

export const platformColors: Record<Platform, string> = {
  youtube: '#FF0000',
  tiktok: '#000000',
  instagram: '#E4405F',
};

export const niches = [
  { id: 'finance', name: 'Финансы', emoji: '💰' },
  { id: 'health', name: 'Здоровье', emoji: '🏥' },
  { id: 'psychology', name: 'Психология', emoji: '🧠' },
  { id: 'law', name: 'Право', emoji: '⚖️' },
  { id: 'fitness', name: 'Фитнес', emoji: '💪' },
  { id: 'nutrition', name: 'Питание', emoji: '🥗' },
];

// === MOCK ДАННЫЕ: ТРЕНДЫ ===

export const mockTrendVideos: TrendVideo[] = [
  {
    id: 'trend-1',
    platform: 'youtube',
    title: 'Вот почему вы теряете деньги каждый месяц',
    thumbnail: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=225&fit=crop',
    channelName: 'Финансовый Советник',
    channelAvatar: '',
    views: 2100000,
    viewsGrowth24h: 45,
    hookRate: 85,
    retention10s: 72,
    hookText: 'Скажите, вы знали что 73% россиян теряют деньги просто потому что...',
    hookType: 'question',
    niche: 'finance',
    publishedAt: '2026-02-05T12:00:00',
    duration: '8:45',
  },
  {
    id: 'trend-2',
    platform: 'tiktok',
    title: '3 ошибки при оформлении налогового вычета',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=225&fit=crop',
    channelName: 'Юрист Онлайн',
    channelAvatar: '',
    views: 890000,
    viewsGrowth24h: 128,
    hookRate: 78,
    retention10s: 65,
    hookText: 'Если вы делаете ЭТО — вы потеряете до 50 000 рублей',
    hookType: 'shock',
    niche: 'law',
    publishedAt: '2026-02-06T15:30:00',
    duration: '0:58',
  },
  {
    id: 'trend-3',
    platform: 'youtube',
    title: 'Признаки диабета, которые все игнорируют',
    thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=225&fit=crop',
    channelName: 'Доктор Знает',
    channelAvatar: '',
    views: 1450000,
    viewsGrowth24h: 32,
    hookRate: 82,
    retention10s: 68,
    hookText: 'Эти 5 симптомов говорят о том, что ваш сахар уже выше нормы',
    hookType: 'statement',
    niche: 'health',
    publishedAt: '2026-02-04T10:00:00',
    duration: '12:30',
  },
  {
    id: 'trend-4',
    platform: 'tiktok',
    title: 'Как я избавился от тревожности за неделю',
    thumbnail: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=225&fit=crop',
    channelName: 'Психолог Мария',
    channelAvatar: '',
    views: 567000,
    viewsGrowth24h: 89,
    hookRate: 88,
    retention10s: 74,
    hookText: 'Я расскажу вам технику, которая работает за 3 минуты',
    hookType: 'promise',
    niche: 'psychology',
    publishedAt: '2026-02-07T09:00:00',
    duration: '1:15',
  },
  {
    id: 'trend-5',
    platform: 'youtube',
    title: 'Куда вложить 100 000 рублей в 2026 году',
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=225&fit=crop',
    channelName: 'Инвестор PRO',
    channelAvatar: '',
    views: 3200000,
    viewsGrowth24h: 67,
    hookRate: 81,
    retention10s: 70,
    hookText: 'Через год вы скажете мне спасибо, потому что...',
    hookType: 'promise',
    niche: 'finance',
    publishedAt: '2026-02-03T14:00:00',
    duration: '15:20',
  },
  {
    id: 'trend-6',
    platform: 'instagram',
    title: 'Продукты, которые убивают ваш иммунитет',
    thumbnail: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=225&fit=crop',
    channelName: 'Нутрициолог Анна',
    channelAvatar: '',
    views: 234000,
    viewsGrowth24h: 156,
    hookRate: 76,
    retention10s: 62,
    hookText: 'Вы точно едите это каждый день, и это разрушает...',
    hookType: 'shock',
    niche: 'nutrition',
    publishedAt: '2026-02-07T18:00:00',
    duration: '0:45',
  },
  {
    id: 'trend-7',
    platform: 'youtube',
    title: 'Упражнение которое заменяет час в зале',
    thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=225&fit=crop',
    channelName: 'Фитнес Дома',
    channelAvatar: '',
    views: 780000,
    viewsGrowth24h: 43,
    hookRate: 79,
    retention10s: 66,
    hookText: 'Одно упражнение, 5 минут в день — результат через неделю',
    hookType: 'promise',
    niche: 'fitness',
    publishedAt: '2026-02-06T08:00:00',
    duration: '6:40',
  },
  {
    id: 'trend-8',
    platform: 'tiktok',
    title: 'Что делать если работодатель не платит зарплату',
    thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=225&fit=crop',
    channelName: 'Адвокат Петров',
    channelAvatar: '',
    views: 445000,
    viewsGrowth24h: 234,
    hookRate: 84,
    retention10s: 71,
    hookText: 'Одно заявление — и деньги будут на счету через 3 дня',
    hookType: 'promise',
    niche: 'law',
    publishedAt: '2026-02-08T07:00:00',
    duration: '1:02',
  },
];

export const mockTrendSources: TrendSource[] = [
  { id: 'src-1', type: 'channel', platform: 'youtube', name: 'Финансовый Советник', url: 'https://youtube.com/@finsovet', isActive: true },
  { id: 'src-2', type: 'channel', platform: 'youtube', name: 'Доктор Знает', url: 'https://youtube.com/@doctorknows', isActive: true },
  { id: 'src-3', type: 'channel', platform: 'tiktok', name: 'Юрист Онлайн', url: 'https://tiktok.com/@lawyeronline', isActive: true },
  { id: 'src-4', type: 'hashtag', platform: 'tiktok', name: '#финансы', isActive: true },
  { id: 'src-5', type: 'hashtag', platform: 'tiktok', name: '#здоровье', isActive: false },
  { id: 'src-6', type: 'keyword', platform: 'youtube', name: 'налоговый вычет', isActive: true },
];

// === MOCK ДАННЫЕ: ВИДЕО С RETENTION ===

const generateRetentionCurve = (hookRate: number, duration: number): RetentionPoint[] => {
  const points: RetentionPoint[] = [];
  let retention = 100;
  
  for (let t = 0; t <= duration; t += Math.max(1, Math.floor(duration / 20))) {
    if (t === 0) {
      points.push({ time: 0, retention: 100 });
    } else if (t <= 3) {
      retention = hookRate + (100 - hookRate) * (1 - t / 3);
      points.push({ time: t, retention: Math.round(retention) });
    } else if (t <= 10) {
      retention = retention - (hookRate - 60) / 7 * (t - 3) / 7;
      points.push({ time: t, retention: Math.round(Math.max(retention, 40)) });
    } else {
      retention = retention - Math.random() * 3;
      points.push({ time: t, retention: Math.round(Math.max(retention, 25)) });
    }
  }
  
  return points;
};

export const mockVideosWithRetention: VideoWithRetention[] = [
  {
    id: 1,
    title: 'Как оформить налоговый вычет за лечение',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=225&fit=crop',
    duration: '3:45',
    status: 'ready',
    views: 12453,
    createdAt: '2026-02-08T10:30:00',
    service: 'Юрист',
    hookRate: 82,
    retention10s: 68,
    retention30s: 52,
    completionRate: 38,
    avgWatchTime: '2:12',
    retentionCurve: generateRetentionCurve(82, 225),
    dropOffPoints: [
      { time: '0:12', drop: 15, reason: 'Слабый переход после хука' },
      { time: '1:45', drop: 8, reason: 'Длинное объяснение документов' },
    ],
  },
  {
    id: 2,
    title: 'Первые симптомы диабета: что нужно знать',
    thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=225&fit=crop',
    duration: '4:12',
    status: 'processing',
    views: 0,
    createdAt: '2026-02-08T09:15:00',
    service: 'Врач',
    hookRate: 0,
    retention10s: 0,
    retention30s: 0,
    completionRate: 0,
    avgWatchTime: '0:00',
    retentionCurve: [],
    dropOffPoints: [],
  },
  {
    id: 3,
    title: 'Как справиться с тревожностью: 5 техник',
    thumbnail: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=225&fit=crop',
    duration: '5:30',
    status: 'ready',
    views: 8921,
    createdAt: '2026-02-07T16:45:00',
    service: 'Психолог',
    hookRate: 78,
    retention10s: 64,
    retention30s: 48,
    completionRate: 32,
    avgWatchTime: '2:48',
    retentionCurve: generateRetentionCurve(78, 330),
    dropOffPoints: [
      { time: '0:08', drop: 12, reason: 'Медленное вступление' },
      { time: '2:30', drop: 10, reason: 'Техника показалась сложной' },
    ],
  },
  {
    id: 4,
    title: 'Инвестиции для начинающих: с чего начать',
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=225&fit=crop',
    duration: '6:15',
    status: 'ready',
    views: 15678,
    createdAt: '2026-02-07T14:20:00',
    service: 'Финансист',
    hookRate: 85,
    retention10s: 72,
    retention30s: 58,
    completionRate: 41,
    avgWatchTime: '3:45',
    retentionCurve: generateRetentionCurve(85, 375),
    dropOffPoints: [
      { time: '3:00', drop: 6, reason: 'Технические термины' },
    ],
  },
  {
    id: 5,
    title: 'Права потребителя при возврате товара',
    thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=225&fit=crop',
    duration: '4:00',
    status: 'error',
    views: 0,
    createdAt: '2026-02-07T11:00:00',
    service: 'Юрист',
    error: 'Ошибка синтеза голоса',
    hookRate: 0,
    retention10s: 0,
    retention30s: 0,
    completionRate: 0,
    avgWatchTime: '0:00',
    retentionCurve: [],
    dropOffPoints: [],
  },
  {
    id: 6,
    title: 'Здоровый сон: рекомендации врача',
    thumbnail: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=225&fit=crop',
    duration: '3:20',
    status: 'ready',
    views: 6234,
    createdAt: '2026-02-06T18:30:00',
    service: 'Врач',
    hookRate: 71,
    retention10s: 58,
    retention30s: 44,
    completionRate: 28,
    avgWatchTime: '1:52',
    retentionCurve: generateRetentionCurve(71, 200),
    dropOffPoints: [
      { time: '0:05', drop: 18, reason: 'Слабый хук' },
      { time: '1:20', drop: 12, reason: 'Скучная подача' },
    ],
  },
];

// === АГРЕГИРОВАННЫЕ МЕТРИКИ ===

export const retentionBenchmarks = {
  hookRate: 70,
  retention10s: 60,
  retention30s: 45,
  completionRate: 30,
};

export const calculateAverageRetention = (videos: VideoWithRetention[]) => {
  const readyVideos = videos.filter(v => v.status === 'ready' && v.hookRate > 0);
  if (readyVideos.length === 0) return { hookRate: 0, retention10s: 0, retention30s: 0, completionRate: 0 };
  
  return {
    hookRate: Math.round(readyVideos.reduce((sum, v) => sum + v.hookRate, 0) / readyVideos.length),
    retention10s: Math.round(readyVideos.reduce((sum, v) => sum + v.retention10s, 0) / readyVideos.length),
    retention30s: Math.round(readyVideos.reduce((sum, v) => sum + v.retention30s, 0) / readyVideos.length),
    completionRate: Math.round(readyVideos.reduce((sum, v) => sum + v.completionRate, 0) / readyVideos.length),
  };
};

export const getTopPerformers = (videos: VideoWithRetention[], limit = 3) => {
  return videos
    .filter(v => v.status === 'ready' && v.hookRate > 0)
    .sort((a, b) => b.hookRate - a.hookRate)
    .slice(0, limit);
};

export const getBottomPerformers = (videos: VideoWithRetention[], limit = 2) => {
  return videos
    .filter(v => v.status === 'ready' && v.hookRate > 0)
    .sort((a, b) => a.hookRate - b.hookRate)
    .slice(0, limit);
};
