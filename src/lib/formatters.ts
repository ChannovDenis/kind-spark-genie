import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

/**
 * Форматирование даты для графиков (8 фев)
 */
export function formatChartDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'd MMM', { locale: ru });
}

/**
 * Форматирование даты для графиков с годом (Янв 2026)
 */
export function formatChartMonth(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'LLL yyyy', { locale: ru });
}

/**
 * Форматирование числа с пробелами (123456 → "123 456")
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('ru-RU');
}

/**
 * Форматирование суммы в рублях (123456 → "123 456 ₽")
 */
export function formatCurrency(amount: number): string {
  return `${formatNumber(amount)} ₽`;
}

/**
 * Форматирование даты на русском (2026-02-08 → "8 февраля 2026")
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Форматирование короткой даты (2026-02-08 → "08.02.2026")
 */
export function formatShortDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Форматирование времени (14:30)
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Относительная дата (сегодня, вчера, 3 дня назад)
 */
export function formatRelativeDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return 'сегодня';
  if (days === 1) return 'вчера';
  if (days < 7) return `${days} ${pluralize(days, 'день', 'дня', 'дней')} назад`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `${weeks} ${pluralize(weeks, 'неделю', 'недели', 'недель')} назад`;
  }
  return formatShortDate(d);
}

/**
 * Склонение слов (1 день, 2 дня, 5 дней)
 */
export function pluralize(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;

  if (mod100 >= 11 && mod100 <= 14) return many;
  if (mod10 === 1) return one;
  if (mod10 >= 2 && mod10 <= 4) return few;
  return many;
}

/**
 * Форматирование процентов (0.156 → "15.6%")
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Сокращение больших чисел (12500 → "12.5K")
 */
export function formatCompactNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

/**
 * Форматирование времени в минутах/секундах (125 сек → "2:05")
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
