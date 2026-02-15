import type { Escalation } from '@/data/mockData';

// ——— МЕТРИКИ ДАШБОРДА ———

export const dashboardMetrics: Record<string, {
  aiRequests: { value: number; change: number };
  escalations: { value: number; change: number };
  nps: { value: number; change: number };
  avgTime: { value: number; change: number };
}> = {
  dobroservice: {
    aiRequests: { value: 2847, change: 12.5 },
    escalations: { value: 234, change: -3.2 },
    nps: { value: 78, change: 4.1 },
    avgTime: { value: 2.3, change: -15.0 },
  },
  gazprombank: {
    aiRequests: { value: 8420, change: 18.3 },
    escalations: { value: 612, change: -5.7 },
    nps: { value: 82, change: 2.8 },
    avgTime: { value: 1.8, change: -22.0 },
  },
  wildberries: {
    aiRequests: { value: 15230, change: 24.1 },
    escalations: { value: 1105, change: -1.4 },
    nps: { value: 74, change: 6.2 },
    avgTime: { value: 3.1, change: -8.5 },
  },
  mes: {
    aiRequests: { value: 1560, change: 8.7 },
    escalations: { value: 198, change: -4.5 },
    nps: { value: 71, change: 3.3 },
    avgTime: { value: 2.9, change: -11.0 },
  },
  alfa: {
    aiRequests: { value: 6340, change: 15.9 },
    escalations: { value: 445, change: -6.1 },
    nps: { value: 80, change: 3.7 },
    avgTime: { value: 2.0, change: -18.5 },
  },
  pochtarf: {
    aiRequests: { value: 3890, change: 10.2 },
    escalations: { value: 367, change: -2.8 },
    nps: { value: 69, change: 5.5 },
    avgTime: { value: 3.5, change: -7.2 },
  },
};

// ——— ГРАФИК АКТИВНОСТИ (30 дней) ———

const dobroActivityBase = [
  { date: '17.01', aiRequests: 78, escalations: 6 },
  { date: '18.01', aiRequests: 85, escalations: 7 },
  { date: '19.01', aiRequests: 62, escalations: 5 },
  { date: '20.01', aiRequests: 91, escalations: 8 },
  { date: '21.01', aiRequests: 88, escalations: 7 },
  { date: '22.01', aiRequests: 95, escalations: 8 },
  { date: '23.01', aiRequests: 82, escalations: 6 },
  { date: '24.01', aiRequests: 84, escalations: 7 },
  { date: '25.01', aiRequests: 90, escalations: 7 },
  { date: '26.01', aiRequests: 55, escalations: 4 },
  { date: '27.01', aiRequests: 58, escalations: 5 },
  { date: '28.01', aiRequests: 93, escalations: 8 },
  { date: '29.01', aiRequests: 97, escalations: 8 },
  { date: '30.01', aiRequests: 92, escalations: 7 },
  { date: '31.01', aiRequests: 99, escalations: 8 },
  { date: '01.02', aiRequests: 96, escalations: 8 },
  { date: '02.02', aiRequests: 60, escalations: 5 },
  { date: '03.02', aiRequests: 65, escalations: 5 },
  { date: '04.02', aiRequests: 101, escalations: 8 },
  { date: '05.02', aiRequests: 105, escalations: 9 },
  { date: '06.02', aiRequests: 98, escalations: 8 },
  { date: '07.02', aiRequests: 108, escalations: 9 },
  { date: '08.02', aiRequests: 103, escalations: 8 },
  { date: '09.02', aiRequests: 68, escalations: 5 },
  { date: '10.02', aiRequests: 63, escalations: 5 },
  { date: '11.02', aiRequests: 110, escalations: 9 },
  { date: '12.02', aiRequests: 115, escalations: 9 },
  { date: '13.02', aiRequests: 112, escalations: 9 },
  { date: '14.02', aiRequests: 118, escalations: 10 },
  { date: '15.02', aiRequests: 120, escalations: 10 },
];

function scaleActivity(base: typeof dobroActivityBase, multiplier: number) {
  return base.map(d => ({
    date: d.date,
    aiRequests: Math.round(d.aiRequests * multiplier),
    escalations: Math.round(d.escalations * multiplier),
  }));
}

export const activityChartData: Record<string, Array<{ date: string; aiRequests: number; escalations: number }>> = {
  dobroservice: dobroActivityBase,
  gazprombank: scaleActivity(dobroActivityBase, 3),
  wildberries: scaleActivity(dobroActivityBase, 5),
  mes: scaleActivity(dobroActivityBase, 0.55),
  alfa: scaleActivity(dobroActivityBase, 2.2),
  pochtarf: scaleActivity(dobroActivityBase, 1.4),
};

// ——— BURN-DOWN ГРАФИК ———

function generateBurndown(limit: number): Array<{ date: string; plan: number; fact: number }> {
  const days = 30;
  const result: Array<{ date: string; plan: number; fact: number }> = [];
  let fact = limit;
  // Slightly faster consumption in first half, slowing in second
  for (let i = 0; i < days; i++) {
    const d = new Date(2026, 0, 17 + i);
    const dateStr = `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}`;
    const plan = Math.round(limit * (1 - (i + 1) / days));
    // First half burns ~55% of limit, second half ~45%
    const dailyBase = limit / days;
    const factor = i < 15 ? 1.12 : 0.88;
    // Add minor deterministic wobble based on day index
    const wobble = 1 + (((i * 7 + 3) % 11) - 5) * 0.02;
    fact = Math.max(0, Math.round(fact - dailyBase * factor * wobble));
    result.push({ date: dateStr, plan, fact });
  }
  return result;
}

export const burndownData: Record<string, Array<{ date: string; plan: number; fact: number }>> = {
  dobroservice: generateBurndown(3000),
  gazprombank: generateBurndown(10000),
  wildberries: generateBurndown(18000),
  mes: generateBurndown(2000),
  alfa: generateBurndown(8000),
  pochtarf: generateBurndown(5000),
};

// ——— ЭСКАЛАЦИИ ———

export const tenantEscalations: Record<string, Escalation[]> = {
  dobroservice: [
    { id: 'esc-d1', userId: 'u-1', userName: 'Клиент 1', userAvatar: '', service: 'lawyer', topic: 'Вопрос по договору аренды', status: 'in_progress', priority: 'high', createdAt: '2026-02-14T10:30:00', expertName: 'Эксперт 1' },
    { id: 'esc-d2', userId: 'u-2', userName: 'Клиент 2', userAvatar: '', service: 'psychologist', topic: 'Стресс на рабочем месте', status: 'pending', priority: 'medium', createdAt: '2026-02-13T14:20:00' },
    { id: 'esc-d3', userId: 'u-3', userName: 'Клиент 3', userAvatar: '', service: 'doctor', topic: 'Консультация по результатам анализов', status: 'resolved', priority: 'low', createdAt: '2026-02-12T09:15:00', expertName: 'Эксперт 2' },
  ],
  gazprombank: [
    { id: 'esc-g1', userId: 'u-10', userName: 'Клиент А', userAvatar: '', service: 'lawyer', topic: 'Спор по кредитному договору', status: 'in_progress', priority: 'high', createdAt: '2026-02-14T09:00:00', expertName: 'Эксперт 3' },
    { id: 'esc-g2', userId: 'u-11', userName: 'Клиент Б', userAvatar: '', service: 'financier', topic: 'Возврат страховки при досрочном погашении', status: 'pending', priority: 'medium', createdAt: '2026-02-13T11:30:00' },
    { id: 'esc-g3', userId: 'u-12', userName: 'Клиент В', userAvatar: '', service: 'lawyer', topic: 'Отказ в реструктуризации', status: 'pending', priority: 'high', createdAt: '2026-02-12T16:45:00' },
  ],
  wildberries: [
    { id: 'esc-w1', userId: 'u-20', userName: 'Клиент Г', userAvatar: '', service: 'lawyer', topic: 'Возврат бракованного товара', status: 'in_progress', priority: 'high', createdAt: '2026-02-14T08:15:00', expertName: 'Эксперт 4' },
    { id: 'esc-w2', userId: 'u-21', userName: 'Клиент Д', userAvatar: '', service: 'lawyer', topic: 'Блокировка личного кабинета продавца', status: 'pending', priority: 'medium', createdAt: '2026-02-13T10:00:00' },
  ],
  mes: [
    { id: 'esc-m1', userId: 'u-30', userName: 'Клиент Е', userAvatar: '', service: 'lawyer', topic: 'Перерасчёт за отопление', status: 'in_progress', priority: 'medium', createdAt: '2026-02-14T11:00:00', expertName: 'Эксперт 5' },
    { id: 'esc-m2', userId: 'u-31', userName: 'Клиент Ж', userAvatar: '', service: 'lawyer', topic: 'Отключение горячей воды без предупреждения', status: 'pending', priority: 'high', createdAt: '2026-02-13T15:30:00' },
  ],
  alfa: [
    { id: 'esc-a1', userId: 'u-40', userName: 'Клиент З', userAvatar: '', service: 'financier', topic: 'Ошибка в начислении процентов', status: 'in_progress', priority: 'high', createdAt: '2026-02-14T10:00:00', expertName: 'Эксперт 6' },
    { id: 'esc-a2', userId: 'u-41', userName: 'Клиент И', userAvatar: '', service: 'lawyer', topic: 'Оспаривание комиссии за обслуживание', status: 'pending', priority: 'medium', createdAt: '2026-02-13T13:45:00' },
  ],
  pochtarf: [
    { id: 'esc-p1', userId: 'u-50', userName: 'Клиент К', userAvatar: '', service: 'lawyer', topic: 'Потеря международной посылки', status: 'in_progress', priority: 'high', createdAt: '2026-02-14T09:30:00', expertName: 'Эксперт 7' },
    { id: 'esc-p2', userId: 'u-51', userName: 'Клиент Л', userAvatar: '', service: 'lawyer', topic: 'Задержка EMS более 30 дней', status: 'pending', priority: 'medium', createdAt: '2026-02-13T12:15:00' },
  ],
};

// ——— ИСПОЛЬЗОВАНИЕ СЕРВИСОВ ———

export interface ServiceUsageItem {
  service: string;
  requests: number;
  quota: number;
  escalations: number;
}

export const tenantServiceUsage: Record<string, ServiceUsageItem[]> = {
  dobroservice: [
    { service: 'Юрист', requests: 920, quota: 1200, escalations: 78 },
    { service: 'Врач', requests: 680, quota: 800, escalations: 45 },
    { service: 'Психолог', requests: 540, quota: 600, escalations: 62 },
    { service: 'Финансист', requests: 310, quota: 500, escalations: 22 },
    { service: 'Фитнес', requests: 240, quota: 400, escalations: 8 },
    { service: 'Нутрициолог', requests: 157, quota: 300, escalations: 19 },
  ],
  gazprombank: [
    { service: 'Юрист', requests: 1840, quota: 2000, escalations: 145 },
    { service: 'Финансист', requests: 920, quota: 1000, escalations: 67 },
    { service: 'Психолог', requests: 450, quota: 500, escalations: 34 },
    { service: 'Врач', requests: 380, quota: 500, escalations: 28 },
    { service: 'Безопасность', requests: 210, quota: 300, escalations: 15 },
    { service: 'Ассистент', requests: 620, quota: 1000, escalations: 42 },
  ],
  wildberries: [
    { service: 'Юрист', requests: 4200, quota: 5000, escalations: 320 },
    { service: 'Финансист', requests: 2800, quota: 3000, escalations: 180 },
    { service: 'Психолог', requests: 1500, quota: 2000, escalations: 110 },
    { service: 'Врач', requests: 1200, quota: 1500, escalations: 85 },
    { service: 'Ассистент', requests: 3100, quota: 4000, escalations: 210 },
    { service: 'Нутрициолог', requests: 430, quota: 500, escalations: 20 },
  ],
  mes: [
    { service: 'Юрист', requests: 520, quota: 700, escalations: 68 },
    { service: 'Финансист', requests: 310, quota: 400, escalations: 42 },
    { service: 'Психолог', requests: 180, quota: 300, escalations: 25 },
    { service: 'Врач', requests: 290, quota: 400, escalations: 38 },
    { service: 'Ассистент', requests: 260, quota: 500, escalations: 25 },
  ],
  alfa: [
    { service: 'Юрист', requests: 1450, quota: 1800, escalations: 112 },
    { service: 'Финансист', requests: 1120, quota: 1500, escalations: 78 },
    { service: 'Психолог', requests: 580, quota: 700, escalations: 41 },
    { service: 'Врач', requests: 420, quota: 600, escalations: 30 },
    { service: 'Безопасность', requests: 340, quota: 500, escalations: 22 },
    { service: 'Ассистент', requests: 830, quota: 1200, escalations: 55 },
  ],
  pochtarf: [
    { service: 'Юрист', requests: 1100, quota: 1400, escalations: 98 },
    { service: 'Финансист', requests: 620, quota: 800, escalations: 45 },
    { service: 'Психолог', requests: 380, quota: 500, escalations: 32 },
    { service: 'Врач', requests: 510, quota: 700, escalations: 40 },
    { service: 'Ассистент', requests: 680, quota: 1000, escalations: 52 },
    { service: 'Нутрициолог', requests: 200, quota: 300, escalations: 15 },
  ],
};

// ——— БИЛЛИНГ КВОТЫ ———

export interface BillingQuota {
  service: string;
  used: number;
  limit: number;
  unit: string;
}

export const tenantBillingQuotas: Record<string, BillingQuota[]> = {
  dobroservice: [
    { service: 'AI-запросы', used: 2847, limit: 4000, unit: 'запросов' },
    { service: 'Эскалации к экспертам', used: 234, limit: 400, unit: 'сессий' },
    { service: 'Хранилище документов', used: 2.1, limit: 5, unit: 'ГБ' },
    { service: 'API вызовы', used: 12400, limit: 30000, unit: 'вызовов' },
  ],
  gazprombank: [
    { service: 'AI-запросы', used: 8420, limit: 10000, unit: 'запросов' },
    { service: 'Эскалации к экспертам', used: 612, limit: 800, unit: 'сессий' },
    { service: 'Хранилище документов', used: 6.8, limit: 15, unit: 'ГБ' },
    { service: 'API вызовы', used: 67000, limit: 100000, unit: 'вызовов' },
  ],
  wildberries: [
    { service: 'AI-запросы', used: 15230, limit: 20000, unit: 'запросов' },
    { service: 'Эскалации к экспертам', used: 1105, limit: 1500, unit: 'сессий' },
    { service: 'Хранилище документов', used: 12.4, limit: 25, unit: 'ГБ' },
    { service: 'API вызовы', used: 142000, limit: 200000, unit: 'вызовов' },
  ],
  mes: [
    { service: 'AI-запросы', used: 1560, limit: 2500, unit: 'запросов' },
    { service: 'Эскалации к экспертам', used: 198, limit: 300, unit: 'сессий' },
    { service: 'Хранилище документов', used: 1.2, limit: 3, unit: 'ГБ' },
    { service: 'API вызовы', used: 8900, limit: 20000, unit: 'вызовов' },
  ],
  alfa: [
    { service: 'AI-запросы', used: 6340, limit: 8000, unit: 'запросов' },
    { service: 'Эскалации к экспертам', used: 445, limit: 600, unit: 'сессий' },
    { service: 'Хранилище документов', used: 4.5, limit: 10, unit: 'ГБ' },
    { service: 'API вызовы', used: 48000, limit: 80000, unit: 'вызовов' },
  ],
  pochtarf: [
    { service: 'AI-запросы', used: 3890, limit: 5000, unit: 'запросов' },
    { service: 'Эскалации к экспертам', used: 367, limit: 500, unit: 'сессий' },
    { service: 'Хранилище документов', used: 3.1, limit: 8, unit: 'ГБ' },
    { service: 'API вызовы', used: 28000, limit: 50000, unit: 'вызовов' },
  ],
};
