import type { Escalation, PartnerUser } from '@/data/mockData';

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

// ——— ПОЛЬЗОВАТЕЛИ ПО ТЕНАНТАМ ———

export const tenantUsers: Record<string, PartnerUser[]> = {
  gazprombank: [
    { id: 'gpu-1', name: 'Пользователь 1', email: 'user1@example.com', avatar: '', department: 'Ипотечный центр', role: 'Менеджер', lastActive: '2026-02-15T09:30:00', totalRequests: 340, status: 'active' },
    { id: 'gpu-2', name: 'Пользователь 2', email: 'user2@example.com', avatar: '', department: 'Ипотечный центр', role: 'Старший менеджер', lastActive: '2026-02-14T16:20:00', totalRequests: 285, status: 'active' },
    { id: 'gpu-3', name: 'Пользователь 3', email: 'user3@example.com', avatar: '', department: 'Розничный бизнес', role: 'Руководитель', lastActive: '2026-02-15T11:00:00', totalRequests: 198, status: 'active' },
    { id: 'gpu-4', name: 'Пользователь 4', email: 'user4@example.com', avatar: '', department: 'Розничный бизнес', role: 'Менеджер', lastActive: '2026-02-13T14:45:00', totalRequests: 167, status: 'active' },
    { id: 'gpu-5', name: 'Пользователь 5', email: 'user5@example.com', avatar: '', department: 'Розничный бизнес', role: 'Аналитик', lastActive: '2026-02-12T10:30:00', totalRequests: 142, status: 'active' },
    { id: 'gpu-6', name: 'Пользователь 6', email: 'user6@example.com', avatar: '', department: 'Корпоративный блок', role: 'Руководитель', lastActive: '2026-02-15T08:15:00', totalRequests: 256, status: 'active' },
    { id: 'gpu-7', name: 'Пользователь 7', email: 'user7@example.com', avatar: '', department: 'Корпоративный блок', role: 'Менеджер', lastActive: '2026-02-14T12:00:00', totalRequests: 89, status: 'active' },
    { id: 'gpu-8', name: 'Пользователь 8', email: 'user8@example.com', avatar: '', department: 'Корпоративный блок', role: 'Старший менеджер', lastActive: '2026-02-11T17:30:00', totalRequests: 124, status: 'active' },
    { id: 'gpu-9', name: 'Пользователь 9', email: 'user9@example.com', avatar: '', department: 'Риск-менеджмент', role: 'Аналитик', lastActive: '2026-02-15T10:45:00', totalRequests: 78, status: 'active' },
    { id: 'gpu-10', name: 'Пользователь 10', email: 'user10@example.com', avatar: '', department: 'Риск-менеджмент', role: 'Руководитель', lastActive: '2026-02-14T09:00:00', totalRequests: 210, status: 'active' },
    { id: 'gpu-11', name: 'Пользователь 11', email: 'user11@example.com', avatar: '', department: 'Юридический департамент', role: 'Менеджер', lastActive: '2026-02-13T15:20:00', totalRequests: 56, status: 'active' },
    { id: 'gpu-12', name: 'Пользователь 12', email: 'user12@example.com', avatar: '', department: 'Юридический департамент', role: 'Старший менеджер', lastActive: '2026-02-10T11:45:00', totalRequests: 312, status: 'active' },
    { id: 'gpu-13', name: 'Пользователь 13', email: 'user13@example.com', avatar: '', department: 'Ипотечный центр', role: 'Аналитик', lastActive: '2026-02-15T13:30:00', totalRequests: 45, status: 'active' },
    { id: 'gpu-14', name: 'Пользователь 14', email: 'user14@example.com', avatar: '', department: 'Розничный бизнес', role: 'Менеджер', lastActive: '2026-01-28T16:00:00', totalRequests: 12, status: 'inactive' },
    { id: 'gpu-15', name: 'Пользователь 15', email: 'user15@example.com', avatar: '', department: 'Корпоративный блок', role: 'Аналитик', lastActive: '2026-01-20T09:30:00', totalRequests: 23, status: 'inactive' },
  ],
  wildberries: [
    { id: 'wbu-1', name: 'Пользователь 1', email: 'user1@example.com', avatar: '', department: 'Поддержка продавцов', role: 'Менеджер', lastActive: '2026-02-15T10:00:00', totalRequests: 280, status: 'active' },
    { id: 'wbu-2', name: 'Пользователь 2', email: 'user2@example.com', avatar: '', department: 'Поддержка продавцов', role: 'Старший менеджер', lastActive: '2026-02-14T15:30:00', totalRequests: 315, status: 'active' },
    { id: 'wbu-3', name: 'Пользователь 3', email: 'user3@example.com', avatar: '', department: 'Поддержка продавцов', role: 'Руководитель', lastActive: '2026-02-15T08:45:00', totalRequests: 190, status: 'active' },
    { id: 'wbu-4', name: 'Пользователь 4', email: 'user4@example.com', avatar: '', department: 'Логистика', role: 'Менеджер', lastActive: '2026-02-13T11:20:00', totalRequests: 145, status: 'active' },
    { id: 'wbu-5', name: 'Пользователь 5', email: 'user5@example.com', avatar: '', department: 'Логистика', role: 'Аналитик', lastActive: '2026-02-14T14:00:00', totalRequests: 98, status: 'active' },
    { id: 'wbu-6', name: 'Пользователь 6', email: 'user6@example.com', avatar: '', department: 'Логистика', role: 'Руководитель', lastActive: '2026-02-12T09:15:00', totalRequests: 220, status: 'active' },
    { id: 'wbu-7', name: 'Пользователь 7', email: 'user7@example.com', avatar: '', department: 'Клиентский сервис', role: 'Менеджер', lastActive: '2026-02-15T12:30:00', totalRequests: 167, status: 'active' },
    { id: 'wbu-8', name: 'Пользователь 8', email: 'user8@example.com', avatar: '', department: 'Клиентский сервис', role: 'Старший менеджер', lastActive: '2026-02-14T10:45:00', totalRequests: 234, status: 'active' },
    { id: 'wbu-9', name: 'Пользователь 9', email: 'user9@example.com', avatar: '', department: 'Клиентский сервис', role: 'Руководитель', lastActive: '2026-02-11T16:00:00', totalRequests: 56, status: 'active' },
    { id: 'wbu-10', name: 'Пользователь 10', email: 'user10@example.com', avatar: '', department: 'Маркетинг', role: 'Менеджер', lastActive: '2026-02-15T09:00:00', totalRequests: 78, status: 'active' },
    { id: 'wbu-11', name: 'Пользователь 11', email: 'user11@example.com', avatar: '', department: 'Маркетинг', role: 'Аналитик', lastActive: '2026-01-30T14:30:00', totalRequests: 34, status: 'inactive' },
    { id: 'wbu-12', name: 'Пользователь 12', email: 'user12@example.com', avatar: '', department: 'Маркетинг', role: 'Руководитель', lastActive: '2026-02-13T17:15:00', totalRequests: 112, status: 'active' },
  ],
  dobroservice: [
    { id: 'dbu-1', name: 'Пользователь 1', email: 'user1@example.com', avatar: '', department: 'Отдел продаж', role: 'Менеджер', lastActive: '2026-02-15T09:30:00', totalRequests: 156, status: 'active' },
    { id: 'dbu-2', name: 'Пользователь 2', email: 'user2@example.com', avatar: '', department: 'Отдел продаж', role: 'Старший менеджер', lastActive: '2026-02-14T14:00:00', totalRequests: 89, status: 'active' },
    { id: 'dbu-3', name: 'Пользователь 3', email: 'user3@example.com', avatar: '', department: 'HR', role: 'Руководитель', lastActive: '2026-02-13T11:30:00', totalRequests: 210, status: 'active' },
    { id: 'dbu-4', name: 'Пользователь 4', email: 'user4@example.com', avatar: '', department: 'HR', role: 'Специалист', lastActive: '2026-02-12T16:45:00', totalRequests: 47, status: 'active' },
    { id: 'dbu-5', name: 'Пользователь 5', email: 'user5@example.com', avatar: '', department: 'IT', role: 'Разработчик', lastActive: '2026-02-15T10:00:00', totalRequests: 23, status: 'active' },
    { id: 'dbu-6', name: 'Пользователь 6', email: 'user6@example.com', avatar: '', department: 'IT', role: 'Аналитик', lastActive: '2026-02-11T09:15:00', totalRequests: 67, status: 'active' },
    { id: 'dbu-7', name: 'Пользователь 7', email: 'user7@example.com', avatar: '', department: 'Бухгалтерия', role: 'Главный бухгалтер', lastActive: '2026-02-14T08:30:00', totalRequests: 134, status: 'active' },
    { id: 'dbu-8', name: 'Пользователь 8', email: 'user8@example.com', avatar: '', department: 'Бухгалтерия', role: 'Бухгалтер', lastActive: '2026-01-25T15:00:00', totalRequests: 18, status: 'inactive' },
    { id: 'dbu-9', name: 'Пользователь 9', email: 'user9@example.com', avatar: '', department: 'Маркетинг', role: 'Директор', lastActive: '2026-02-15T12:00:00', totalRequests: 245, status: 'active' },
    { id: 'dbu-10', name: 'Пользователь 10', email: 'user10@example.com', avatar: '', department: 'Маркетинг', role: 'Специалист', lastActive: '2026-02-13T13:20:00', totalRequests: 56, status: 'active' },
  ],
  mes: [
    { id: 'meu-1', name: 'Пользователь 1', email: 'user1@example.com', avatar: '', department: 'Теплоснабжение', role: 'Менеджер', lastActive: '2026-02-15T09:00:00', totalRequests: 120, status: 'active' },
    { id: 'meu-2', name: 'Пользователь 2', email: 'user2@example.com', avatar: '', department: 'Теплоснабжение', role: 'Руководитель', lastActive: '2026-02-14T15:30:00', totalRequests: 185, status: 'active' },
    { id: 'meu-3', name: 'Пользователь 3', email: 'user3@example.com', avatar: '', department: 'Электросети', role: 'Менеджер', lastActive: '2026-02-13T10:45:00', totalRequests: 78, status: 'active' },
    { id: 'meu-4', name: 'Пользователь 4', email: 'user4@example.com', avatar: '', department: 'Электросети', role: 'Аналитик', lastActive: '2026-02-12T14:00:00', totalRequests: 45, status: 'active' },
    { id: 'meu-5', name: 'Пользователь 5', email: 'user5@example.com', avatar: '', department: 'Абонентский отдел', role: 'Старший менеджер', lastActive: '2026-02-15T11:30:00', totalRequests: 210, status: 'active' },
    { id: 'meu-6', name: 'Пользователь 6', email: 'user6@example.com', avatar: '', department: 'Абонентский отдел', role: 'Менеджер', lastActive: '2026-02-14T09:15:00', totalRequests: 34, status: 'active' },
    { id: 'meu-7', name: 'Пользователь 7', email: 'user7@example.com', avatar: '', department: 'Диспетчерская', role: 'Руководитель', lastActive: '2026-02-11T16:00:00', totalRequests: 156, status: 'active' },
    { id: 'meu-8', name: 'Пользователь 8', email: 'user8@example.com', avatar: '', department: 'Диспетчерская', role: 'Менеджер', lastActive: '2026-01-22T10:00:00', totalRequests: 12, status: 'inactive' },
  ],
  alfa: [
    { id: 'alu-1', name: 'Пользователь 1', email: 'user1@example.com', avatar: '', department: 'Розничный бизнес', role: 'Менеджер', lastActive: '2026-02-15T10:30:00', totalRequests: 267, status: 'active' },
    { id: 'alu-2', name: 'Пользователь 2', email: 'user2@example.com', avatar: '', department: 'Розничный бизнес', role: 'Руководитель', lastActive: '2026-02-14T13:00:00', totalRequests: 198, status: 'active' },
    { id: 'alu-3', name: 'Пользователь 3', email: 'user3@example.com', avatar: '', department: 'Кредитный отдел', role: 'Старший менеджер', lastActive: '2026-02-13T09:45:00', totalRequests: 312, status: 'active' },
    { id: 'alu-4', name: 'Пользователь 4', email: 'user4@example.com', avatar: '', department: 'Кредитный отдел', role: 'Менеджер', lastActive: '2026-02-15T08:00:00', totalRequests: 145, status: 'active' },
    { id: 'alu-5', name: 'Пользователь 5', email: 'user5@example.com', avatar: '', department: 'Инвестиции', role: 'Аналитик', lastActive: '2026-02-12T15:30:00', totalRequests: 89, status: 'active' },
    { id: 'alu-6', name: 'Пользователь 6', email: 'user6@example.com', avatar: '', department: 'Инвестиции', role: 'Руководитель', lastActive: '2026-02-14T11:00:00', totalRequests: 178, status: 'active' },
    { id: 'alu-7', name: 'Пользователь 7', email: 'user7@example.com', avatar: '', department: 'Комплаенс', role: 'Менеджер', lastActive: '2026-02-15T12:45:00', totalRequests: 56, status: 'active' },
    { id: 'alu-8', name: 'Пользователь 8', email: 'user8@example.com', avatar: '', department: 'Комплаенс', role: 'Старший менеджер', lastActive: '2026-02-11T14:20:00', totalRequests: 234, status: 'active' },
    { id: 'alu-9', name: 'Пользователь 9', email: 'user9@example.com', avatar: '', department: 'IT', role: 'Разработчик', lastActive: '2026-01-29T10:00:00', totalRequests: 15, status: 'inactive' },
    { id: 'alu-10', name: 'Пользователь 10', email: 'user10@example.com', avatar: '', department: 'IT', role: 'Аналитик', lastActive: '2026-02-13T16:30:00', totalRequests: 67, status: 'active' },
  ],
  pochtarf: [
    { id: 'pru-1', name: 'Пользователь 1', email: 'user1@example.com', avatar: '', department: 'Сортировка', role: 'Менеджер', lastActive: '2026-02-15T08:30:00', totalRequests: 134, status: 'active' },
    { id: 'pru-2', name: 'Пользователь 2', email: 'user2@example.com', avatar: '', department: 'Сортировка', role: 'Руководитель', lastActive: '2026-02-14T10:00:00', totalRequests: 189, status: 'active' },
    { id: 'pru-3', name: 'Пользователь 3', email: 'user3@example.com', avatar: '', department: 'Доставка', role: 'Менеджер', lastActive: '2026-02-13T14:15:00', totalRequests: 98, status: 'active' },
    { id: 'pru-4', name: 'Пользователь 4', email: 'user4@example.com', avatar: '', department: 'Доставка', role: 'Старший менеджер', lastActive: '2026-02-15T11:00:00', totalRequests: 245, status: 'active' },
    { id: 'pru-5', name: 'Пользователь 5', email: 'user5@example.com', avatar: '', department: 'Клиентский сервис', role: 'Руководитель', lastActive: '2026-02-14T16:30:00', totalRequests: 312, status: 'active' },
    { id: 'pru-6', name: 'Пользователь 6', email: 'user6@example.com', avatar: '', department: 'Клиентский сервис', role: 'Менеджер', lastActive: '2026-02-12T09:45:00', totalRequests: 67, status: 'active' },
    { id: 'pru-7', name: 'Пользователь 7', email: 'user7@example.com', avatar: '', department: 'Логистика', role: 'Аналитик', lastActive: '2026-02-15T13:00:00', totalRequests: 156, status: 'active' },
    { id: 'pru-8', name: 'Пользователь 8', email: 'user8@example.com', avatar: '', department: 'Логистика', role: 'Руководитель', lastActive: '2026-02-11T15:20:00', totalRequests: 78, status: 'active' },
    { id: 'pru-9', name: 'Пользователь 9', email: 'user9@example.com', avatar: '', department: 'Сортировка', role: 'Менеджер', lastActive: '2026-01-26T11:00:00', totalRequests: 21, status: 'inactive' },
  ],
};

// ——— ТРАНЗАКЦИИ БИЛЛИНГА ———

export interface Transaction {
  date: string;
  operation: string;
  amount: number;
  balance: number;
}

export const tenantTransactions: Record<string, Transaction[]> = {
  dobroservice: [
    { date: '15.02.2026', operation: 'AI-запросы (юрист)', amount: -45, balance: 1820 },
    { date: '14.02.2026', operation: 'AI-запросы (психолог)', amount: -28, balance: 1865 },
    { date: '14.02.2026', operation: 'Эскалация (юрист)', amount: -3, balance: 1893 },
    { date: '13.02.2026', operation: 'Пополнение квоты', amount: 500, balance: 1896 },
    { date: '13.02.2026', operation: 'AI-запросы (врач)', amount: -38, balance: 1396 },
    { date: '12.02.2026', operation: 'AI-запросы (юрист)', amount: -52, balance: 1434 },
    { date: '12.02.2026', operation: 'Эскалация (психолог)', amount: -2, balance: 1486 },
    { date: '11.02.2026', operation: 'AI-запросы (финансист)', amount: -19, balance: 1488 },
    { date: '11.02.2026', operation: 'AI-запросы (нутрициолог)', amount: -12, balance: 1507 },
    { date: '10.02.2026', operation: 'AI-запросы (юрист)', amount: -41, balance: 1519 },
    { date: '09.02.2026', operation: 'Эскалация (врач)', amount: -1, balance: 1560 },
    { date: '08.02.2026', operation: 'AI-запросы (психолог)', amount: -33, balance: 1561 },
    { date: '07.02.2026', operation: 'AI-запросы (юрист)', amount: -47, balance: 1594 },
    { date: '06.02.2026', operation: 'Пополнение квоты', amount: 300, balance: 1641 },
    { date: '05.02.2026', operation: 'AI-запросы (врач)', amount: -29, balance: 1341 },
  ],
  gazprombank: [
    { date: '15.02.2026', operation: 'AI-запросы (юрист)', amount: -128, balance: 5420 },
    { date: '14.02.2026', operation: 'AI-запросы (финансист)', amount: -85, balance: 5548 },
    { date: '14.02.2026', operation: 'Эскалация (юрист)', amount: -8, balance: 5633 },
    { date: '13.02.2026', operation: 'Пополнение квоты', amount: 2000, balance: 5641 },
    { date: '13.02.2026', operation: 'AI-запросы (безопасность)', amount: -34, balance: 3641 },
    { date: '12.02.2026', operation: 'AI-запросы (юрист)', amount: -142, balance: 3675 },
    { date: '12.02.2026', operation: 'Эскалация (финансист)', amount: -5, balance: 3817 },
    { date: '11.02.2026', operation: 'AI-запросы (ассистент)', amount: -67, balance: 3822 },
    { date: '11.02.2026', operation: 'AI-запросы (психолог)', amount: -42, balance: 3889 },
    { date: '10.02.2026', operation: 'AI-запросы (юрист)', amount: -118, balance: 3931 },
    { date: '09.02.2026', operation: 'Эскалация (юрист)', amount: -6, balance: 4049 },
    { date: '08.02.2026', operation: 'AI-запросы (финансист)', amount: -78, balance: 4055 },
    { date: '07.02.2026', operation: 'AI-запросы (юрист)', amount: -135, balance: 4133 },
    { date: '06.02.2026', operation: 'Пополнение квоты', amount: 1500, balance: 4268 },
    { date: '05.02.2026', operation: 'AI-запросы (врач)', amount: -45, balance: 2768 },
  ],
  wildberries: [
    { date: '15.02.2026', operation: 'AI-запросы (юрист)', amount: -210, balance: 9800 },
    { date: '14.02.2026', operation: 'AI-запросы (ассистент)', amount: -185, balance: 10010 },
    { date: '14.02.2026', operation: 'Эскалация (юрист)', amount: -12, balance: 10195 },
    { date: '13.02.2026', operation: 'Пополнение квоты', amount: 3000, balance: 10207 },
    { date: '13.02.2026', operation: 'AI-запросы (финансист)', amount: -156, balance: 7207 },
    { date: '12.02.2026', operation: 'AI-запросы (юрист)', amount: -198, balance: 7363 },
    { date: '12.02.2026', operation: 'Эскалация (ассистент)', amount: -9, balance: 7561 },
    { date: '11.02.2026', operation: 'AI-запросы (психолог)', amount: -89, balance: 7570 },
    { date: '11.02.2026', operation: 'AI-запросы (нутрициолог)', amount: -24, balance: 7659 },
    { date: '10.02.2026', operation: 'AI-запросы (юрист)', amount: -215, balance: 7683 },
    { date: '09.02.2026', operation: 'Эскалация (финансист)', amount: -7, balance: 7898 },
    { date: '08.02.2026', operation: 'AI-запросы (ассистент)', amount: -172, balance: 7905 },
    { date: '07.02.2026', operation: 'AI-запросы (юрист)', amount: -224, balance: 8077 },
    { date: '06.02.2026', operation: 'Пополнение квоты', amount: 2500, balance: 8301 },
    { date: '05.02.2026', operation: 'AI-запросы (врач)', amount: -68, balance: 5801 },
  ],
  mes: [
    { date: '15.02.2026', operation: 'AI-запросы (юрист)', amount: -28, balance: 1120 },
    { date: '14.02.2026', operation: 'AI-запросы (финансист)', amount: -18, balance: 1148 },
    { date: '14.02.2026', operation: 'Эскалация (юрист)', amount: -2, balance: 1166 },
    { date: '13.02.2026', operation: 'Пополнение квоты', amount: 400, balance: 1168 },
    { date: '13.02.2026', operation: 'AI-запросы (ассистент)', amount: -15, balance: 768 },
    { date: '12.02.2026', operation: 'AI-запросы (юрист)', amount: -31, balance: 783 },
    { date: '12.02.2026', operation: 'Эскалация (финансист)', amount: -1, balance: 814 },
    { date: '11.02.2026', operation: 'AI-запросы (врач)', amount: -22, balance: 815 },
    { date: '11.02.2026', operation: 'AI-запросы (психолог)', amount: -14, balance: 837 },
    { date: '10.02.2026', operation: 'AI-запросы (юрист)', amount: -26, balance: 851 },
    { date: '09.02.2026', operation: 'Эскалация (юрист)', amount: -2, balance: 877 },
    { date: '08.02.2026', operation: 'AI-запросы (финансист)', amount: -19, balance: 879 },
    { date: '07.02.2026', operation: 'AI-запросы (юрист)', amount: -30, balance: 898 },
    { date: '06.02.2026', operation: 'Пополнение квоты', amount: 250, balance: 928 },
    { date: '05.02.2026', operation: 'AI-запросы (ассистент)', amount: -16, balance: 678 },
  ],
  alfa: [
    { date: '15.02.2026', operation: 'AI-запросы (юрист)', amount: -95, balance: 4200 },
    { date: '14.02.2026', operation: 'AI-запросы (финансист)', amount: -72, balance: 4295 },
    { date: '14.02.2026', operation: 'Эскалация (юрист)', amount: -6, balance: 4367 },
    { date: '13.02.2026', operation: 'Пополнение квоты', amount: 1500, balance: 4373 },
    { date: '13.02.2026', operation: 'AI-запросы (безопасность)', amount: -28, balance: 2873 },
    { date: '12.02.2026', operation: 'AI-запросы (юрист)', amount: -108, balance: 2901 },
    { date: '12.02.2026', operation: 'Эскалация (финансист)', amount: -4, balance: 3009 },
    { date: '11.02.2026', operation: 'AI-запросы (ассистент)', amount: -56, balance: 3013 },
    { date: '11.02.2026', operation: 'AI-запросы (психолог)', amount: -38, balance: 3069 },
    { date: '10.02.2026', operation: 'AI-запросы (юрист)', amount: -92, balance: 3107 },
    { date: '09.02.2026', operation: 'Эскалация (юрист)', amount: -5, balance: 3199 },
    { date: '08.02.2026', operation: 'AI-запросы (финансист)', amount: -64, balance: 3204 },
    { date: '07.02.2026', operation: 'AI-запросы (юрист)', amount: -101, balance: 3268 },
    { date: '06.02.2026', operation: 'Пополнение квоты', amount: 1200, balance: 3369 },
    { date: '05.02.2026', operation: 'AI-запросы (врач)', amount: -35, balance: 2169 },
  ],
  pochtarf: [
    { date: '15.02.2026', operation: 'AI-запросы (юрист)', amount: -58, balance: 2650 },
    { date: '14.02.2026', operation: 'AI-запросы (финансист)', amount: -35, balance: 2708 },
    { date: '14.02.2026', operation: 'Эскалация (юрист)', amount: -4, balance: 2743 },
    { date: '13.02.2026', operation: 'Пополнение квоты', amount: 800, balance: 2747 },
    { date: '13.02.2026', operation: 'AI-запросы (ассистент)', amount: -42, balance: 1947 },
    { date: '12.02.2026', operation: 'AI-запросы (юрист)', amount: -62, balance: 1989 },
    { date: '12.02.2026', operation: 'Эскалация (финансист)', amount: -3, balance: 2051 },
    { date: '11.02.2026', operation: 'AI-запросы (врач)', amount: -31, balance: 2054 },
    { date: '11.02.2026', operation: 'AI-запросы (психолог)', amount: -22, balance: 2085 },
    { date: '10.02.2026', operation: 'AI-запросы (юрист)', amount: -55, balance: 2107 },
    { date: '09.02.2026', operation: 'Эскалация (юрист)', amount: -3, balance: 2162 },
    { date: '08.02.2026', operation: 'AI-запросы (нутрициолог)', amount: -12, balance: 2165 },
    { date: '07.02.2026', operation: 'AI-запросы (юрист)', amount: -60, balance: 2177 },
    { date: '06.02.2026', operation: 'Пополнение квоты', amount: 600, balance: 2237 },
    { date: '05.02.2026', operation: 'AI-запросы (ассистент)', amount: -38, balance: 1637 },
  ],
};
