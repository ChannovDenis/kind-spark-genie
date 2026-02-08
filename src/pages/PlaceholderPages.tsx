import { PlaceholderPage } from '@/components/shared/PlaceholderPage';

// Expert pages
// ExpertSchedule moved to src/pages/expert/Schedule.tsx

export function ExpertSessions() {
  return <PlaceholderPage title="Сессии" description="История и текущие сессии" emoji="💬" />;
}

export function ExpertConclusions() {
  return <PlaceholderPage title="Заключения" description="Медицинские и юридические заключения" emoji="📋" />;
}

// Quality pages - DialogList moved to src/pages/quality/DialogList.tsx
export function SuperPricing() {
  return <PlaceholderPage title="Тарифы" description="Конструктор тарифных планов" emoji="💰" />;
}

export function SuperSettings() {
  return <PlaceholderPage title="Настройки" description="Глобальные настройки платформы" emoji="⚙️" />;
}

export function SuperBuilder() {
  return <PlaceholderPage title="Конструктор" description="Визуальный конструктор мини-аппов" emoji="🛠️" />;
}

// Studio pages - StudioGenerator moved to src/pages/studio/Generator.tsx
