// Types
export type ErrorCategory = 'hallucination' | 'inaccuracy' | 'empathy' | 'protocol';

export interface ContextMessage {
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
}

export interface CaseRating {
  accuracy: number;      // 1-5
  completeness: number;  // 1-5
  tone: number;          // 1-5
}

export interface Reviewer {
  userId: string;
  name: string;
  decision: 'approve' | 'reject';
  comment?: string;
  ratedAt: string;
}

export interface TrainingCase {
  id: string;
  dialogId: string;
  messageId: string;
  userMessage: string;
  aiResponse: string;
  errorCategory: ErrorCategory;
  errorDescription: string;
  correctedResponse: string;
  status: 'pending' | 'approved' | 'rejected' | 'trained';
  service: string;
  createdAt: string;
  createdBy: string;
  reviewedBy?: string;
  reviewedAt?: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  tags: string[];
  // NEW: Enhanced fields for better annotation
  confidenceScore: number;           // AI confidence (0-1)
  contextMessages: ContextMessage[]; // Dialog history
  ratings?: CaseRating;
  reviewers?: Reviewer[];
  similarCaseIds?: string[];
}

export interface TrainingBatch {
  id: string;
  name: string;
  status: 'draft' | 'ready' | 'training' | 'completed' | 'failed';
  casesCount: number;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  progress?: number;
  metrics?: {
    accuracy: number;
    improvement: number;
  };
}

export interface TrainingStats {
  totalCases: number;
  pendingReview: number;
  approvedCases: number;
  trainedCases: number;
  byCategory: Record<ErrorCategory, number>;
  byService: Record<string, number>;
}

export const errorCategoryLabels: Record<ErrorCategory, string> = {
  hallucination: 'Галлюцинация',
  inaccuracy: 'Неточность',
  empathy: 'Недостаток эмпатии',
  protocol: 'Нарушение протокола',
};

export const errorCategoryColors: Record<ErrorCategory, string> = {
  hallucination: 'bg-destructive/10 text-destructive border-destructive/30',
  inaccuracy: 'bg-warning/10 text-warning border-warning/30',
  empathy: 'bg-purple-500/10 text-purple-600 border-purple-500/30',
  protocol: 'bg-orange-500/10 text-orange-600 border-orange-500/30',
};

export const serviceLabels: Record<string, string> = {
  lawyer: 'Юрист',
  doctor: 'Врач',
  psychologist: 'Психолог',
  financier: 'Финансист',
};

// Mock Data
export const trainingCases: TrainingCase[] = [
  {
    id: 'tc-1',
    dialogId: 'dlg-001',
    messageId: 'msg-005',
    userMessage: 'Могу ли я вернуть телефон через месяц после покупки?',
    aiResponse: 'Да, вы можете вернуть телефон в течение 30 дней с момента покупки, если он вам не подошёл. Просто принесите его в магазин с чеком.',
    errorCategory: 'hallucination',
    errorDescription: 'AI указал срок 30 дней вместо законных 14 дней. Телефон — технически сложный товар, возврат без недостатков невозможен.',
    correctedResponse: 'К сожалению, телефон относится к технически сложным товарам и не подлежит возврату, если он исправен. Вернуть его можно только при наличии существенного недостатка в течение 15 дней, или по гарантии при обнаружении дефекта.',
    status: 'approved',
    service: 'lawyer',
    createdAt: '2026-02-07T14:30:00',
    createdBy: 'Анна Козлова',
    reviewedBy: 'Мария Иванова',
    reviewedAt: '2026-02-08T09:15:00',
    priority: 'critical',
    tags: ['возврат', 'техника', 'ЗоЗПП'],
    confidenceScore: 0.92,
    contextMessages: [
      { role: 'user', content: 'Здравствуйте', timestamp: '2026-02-07T14:25:00' },
      { role: 'ai', content: 'Добрый день! Чем могу помочь?', timestamp: '2026-02-07T14:25:05' },
      { role: 'user', content: 'Купил телефон неделю назад', timestamp: '2026-02-07T14:26:00' },
      { role: 'ai', content: 'Понял. Какой у вас вопрос по покупке?', timestamp: '2026-02-07T14:26:05' },
    ],
    ratings: { accuracy: 5, completeness: 4, tone: 5 },
    similarCaseIds: ['tc-5'],
  },
  {
    id: 'tc-2',
    dialogId: 'dlg-002',
    messageId: 'msg-012',
    userMessage: 'У меня болит голова уже неделю, что делать?',
    aiResponse: 'Принимайте ибупрофен по 400 мг 3 раза в день. Через неделю должно пройти.',
    errorCategory: 'protocol',
    errorDescription: 'AI назначил конкретное лекарство и дозировку, что нарушает протокол. Нельзя давать медицинские назначения.',
    correctedResponse: 'Головная боль, продолжающаяся неделю — это повод обратиться к врачу. Причины могут быть разными: от напряжения до более серьёзных состояний. Рекомендую записаться к терапевту или неврологу для обследования. Хотите, я помогу найти специалиста?',
    status: 'approved',
    service: 'doctor',
    createdAt: '2026-02-07T10:20:00',
    createdBy: 'Алексей Петров',
    reviewedBy: 'Елена Смирнова',
    reviewedAt: '2026-02-07T16:45:00',
    priority: 'critical',
    tags: ['медицина', 'назначения', 'протокол'],
    confidenceScore: 0.88,
    contextMessages: [
      { role: 'user', content: 'Нужна консультация врача', timestamp: '2026-02-07T10:18:00' },
      { role: 'ai', content: 'Конечно, опишите ваши симптомы', timestamp: '2026-02-07T10:18:10' },
    ],
    ratings: { accuracy: 5, completeness: 5, tone: 4 },
    similarCaseIds: ['tc-6'],
  },
  {
    id: 'tc-3',
    dialogId: 'dlg-003',
    messageId: 'msg-008',
    userMessage: 'Мне очень плохо, не вижу смысла продолжать...',
    aiResponse: 'Понимаю, что вам сейчас тяжело. Попробуйте отвлечься — посмотрите фильм или прогуляйтесь.',
    errorCategory: 'empathy',
    errorDescription: 'AI не распознал кризисную ситуацию и дал поверхностный совет вместо немедленной эскалации к специалисту.',
    correctedResponse: 'Я слышу, что вам сейчас очень тяжело, и мне важно, чтобы вы получили поддержку. То, что вы чувствуете — серьёзно, и вы заслуживаете помощи. Давайте я прямо сейчас соединю вас с нашим психологом. Вы не одни.',
    status: 'pending',
    service: 'psychologist',
    createdAt: '2026-02-08T08:00:00',
    createdBy: 'Елена Смирнова',
    priority: 'critical',
    tags: ['кризис', 'эскалация', 'эмпатия'],
    confidenceScore: 0.76,
    contextMessages: [
      { role: 'user', content: 'Хочу поговорить', timestamp: '2026-02-08T07:55:00' },
      { role: 'ai', content: 'Я здесь, чтобы выслушать вас. Что случилось?', timestamp: '2026-02-08T07:55:10' },
      { role: 'user', content: 'Всё навалилось... работа, семья, ничего не получается', timestamp: '2026-02-08T07:57:00' },
      { role: 'ai', content: 'Звучит тяжело. Расскажите подробнее, что вас беспокоит больше всего?', timestamp: '2026-02-08T07:57:15' },
    ],
    similarCaseIds: [],
  },
  {
    id: 'tc-4',
    dialogId: 'dlg-004',
    messageId: 'msg-003',
    userMessage: 'Какой налоговый вычет я могу получить за обучение?',
    aiResponse: 'За своё обучение вы можете получить вычет до 150 000 рублей в год.',
    errorCategory: 'inaccuracy',
    errorDescription: 'Сумма указана неверно. Лимит социального вычета на обучение — 120 000 ₽ (было до 2024), с 2024 года — 150 000 ₽. Но вернуть можно 13% от суммы, т.е. до 19 500 ₽.',
    correctedResponse: 'За своё обучение вы можете получить социальный налоговый вычет. Максимальная сумма расходов, с которой можно получить вычет — 150 000 ₽ в год. Это значит, вернуть можно до 19 500 ₽ (13% от 150 000). Важно: эта сумма общая со всеми социальными вычетами (лечение, фитнес и др.).',
    status: 'approved',
    service: 'financier',
    createdAt: '2026-02-06T11:30:00',
    createdBy: 'Дмитрий Козлов',
    reviewedBy: 'Мария Иванова',
    reviewedAt: '2026-02-06T15:00:00',
    priority: 'high',
    tags: ['налоги', 'вычет', 'обучение'],
    confidenceScore: 0.95,
    contextMessages: [
      { role: 'user', content: 'Вопрос по налогам', timestamp: '2026-02-06T11:28:00' },
      { role: 'ai', content: 'Слушаю вас. Какой у вас вопрос?', timestamp: '2026-02-06T11:28:10' },
    ],
    ratings: { accuracy: 5, completeness: 5, tone: 5 },
    similarCaseIds: [],
  },
  {
    id: 'tc-5',
    dialogId: 'dlg-005',
    messageId: 'msg-007',
    userMessage: 'Работодатель не платит зарплату 2 месяца, что делать?',
    aiResponse: 'Вам нужно написать заявление в трудовую инспекцию. Они разберутся.',
    errorCategory: 'inaccuracy',
    errorDescription: 'Ответ неполный. Не указаны другие важные шаги: приостановка работы (ст. 142 ТК), компенсация, прокуратура, суд.',
    correctedResponse: 'При задержке зарплаты более 15 дней у вас есть несколько вариантов:\n\n1. **Приостановить работу** (ст. 142 ТК РФ) — письменно уведомите работодателя и не выходите на работу до выплаты, сохраняя средний заработок.\n\n2. **Трудовая инспекция** — подайте жалобу онлайн на онлайнинспекция.рф.\n\n3. **Прокуратура** — если нарушение систематическое.\n\n4. **Суд** — можете взыскать зарплату + компенсацию 1/150 ставки ЦБ за каждый день просрочки.\n\nХотите, чтобы я помог составить заявление?',
    status: 'trained',
    service: 'lawyer',
    createdAt: '2026-02-01T09:00:00',
    createdBy: 'Анна Козлова',
    reviewedBy: 'Мария Иванова',
    reviewedAt: '2026-02-02T10:30:00',
    priority: 'high',
    tags: ['трудовое право', 'зарплата', 'задержка'],
    confidenceScore: 0.84,
    contextMessages: [
      { role: 'user', content: 'Проблема с работодателем', timestamp: '2026-02-01T08:55:00' },
      { role: 'ai', content: 'Расскажите подробнее, что произошло?', timestamp: '2026-02-01T08:55:10' },
      { role: 'user', content: 'Задерживают зарплату уже давно', timestamp: '2026-02-01T08:57:00' },
      { role: 'ai', content: 'Понятно. На сколько задерживают и получали ли вы что-то за это время?', timestamp: '2026-02-01T08:57:15' },
    ],
    ratings: { accuracy: 5, completeness: 5, tone: 4 },
    similarCaseIds: ['tc-1'],
  },
  {
    id: 'tc-6',
    dialogId: 'dlg-006',
    messageId: 'msg-002',
    userMessage: 'Ребёнку 5 лет, температура 39, что дать?',
    aiResponse: 'Дайте парацетамол в дозировке по весу ребёнка. Если не поможет — ибупрофен.',
    errorCategory: 'protocol',
    errorDescription: 'AI дал рекомендацию по лекарству без уточнения веса, не упомянул о необходимости вызова врача при высокой температуре у ребёнка.',
    correctedResponse: 'Температура 39°C у ребёнка 5 лет — это повод для внимания. Общие рекомендации:\n\n• Обильное питьё\n• Лёгкая одежда, не кутать\n• Проветривание комнаты\n\nДля жаропонижающего важен точный вес ребёнка — дозировку должен определить врач или фармацевт. При температуре выше 39°C, особенно если она держится более 3 дней или ребёнку плохо — вызовите врача.\n\nХотите, чтобы я помог записаться к педиатру?',
    status: 'pending',
    service: 'doctor',
    createdAt: '2026-02-08T07:30:00',
    createdBy: 'Алексей Петров',
    priority: 'critical',
    tags: ['педиатрия', 'температура', 'дети'],
    confidenceScore: 0.79,
    contextMessages: [
      { role: 'user', content: 'Срочно нужен совет врача', timestamp: '2026-02-08T07:28:00' },
      { role: 'ai', content: 'Слушаю вас, что случилось?', timestamp: '2026-02-08T07:28:10' },
    ],
    similarCaseIds: ['tc-2'],
  },
];

export const trainingBatches: TrainingBatch[] = [
  {
    id: 'batch-1',
    name: 'Batch #47 — Медицинские протоколы',
    status: 'completed',
    casesCount: 24,
    createdAt: '2026-02-01T10:00:00',
    startedAt: '2026-02-02T02:00:00',
    completedAt: '2026-02-02T06:30:00',
    metrics: {
      accuracy: 0.94,
      improvement: 0.12,
    },
  },
  {
    id: 'batch-2',
    name: 'Batch #48 — Юридические галлюцинации',
    status: 'completed',
    casesCount: 18,
    createdAt: '2026-02-03T14:00:00',
    startedAt: '2026-02-04T02:00:00',
    completedAt: '2026-02-04T05:45:00',
    metrics: {
      accuracy: 0.91,
      improvement: 0.08,
    },
  },
  {
    id: 'batch-3',
    name: 'Batch #49 — Эмпатия и кризисы',
    status: 'training',
    casesCount: 15,
    createdAt: '2026-02-07T09:00:00',
    startedAt: '2026-02-08T02:00:00',
    progress: 67,
  },
  {
    id: 'batch-4',
    name: 'Batch #50 — Финансовые неточности',
    status: 'ready',
    casesCount: 12,
    createdAt: '2026-02-08T08:00:00',
  },
];

export const trainingStats: TrainingStats = {
  totalCases: 156,
  pendingReview: 23,
  approvedCases: 89,
  trainedCases: 44,
  byCategory: {
    hallucination: 42,
    inaccuracy: 56,
    empathy: 28,
    protocol: 30,
  },
  byService: {
    lawyer: 48,
    doctor: 52,
    psychologist: 31,
    financier: 25,
  },
};

// Helper functions
export function getCasesByStatus(status: TrainingCase['status']): TrainingCase[] {
  return trainingCases.filter(c => c.status === status);
}

export function getCasesByCategory(category: ErrorCategory): TrainingCase[] {
  return trainingCases.filter(c => c.errorCategory === category);
}

export function getCasesByService(service: string): TrainingCase[] {
  return trainingCases.filter(c => c.service === service);
}

export function getSimilarCases(caseId: string): TrainingCase[] {
  const targetCase = trainingCases.find(c => c.id === caseId);
  if (!targetCase?.similarCaseIds) return [];
  return trainingCases.filter(c => targetCase.similarCaseIds?.includes(c.id));
}
