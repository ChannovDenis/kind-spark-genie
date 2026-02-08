

## Унификация формата дат в графиках с использованием date-fns

### Проблема
В проекте даты в графиках форматируются разными способами:
1. **`toLocaleDateString('ru-RU', { month: 'short' })`** — выдаёт сокращения вроде "февр." или "8 февр."
2. **Ручные строки** — `"1 фев"`, `"Фев 2026"` (не консистентно)
3. **`format(date, 'd MMM', { locale: ru })`** из date-fns — выдаёт "8 фев" (правильный формат)

### Решение
Добавить в `src/lib/formatters.ts` новую функцию `formatChartDate()` с использованием date-fns и русской локали, затем применить её во всех графиках и генераторах mock-данных.

---

### Изменения

#### 1. Файл: `src/lib/formatters.ts`

Добавить новую функцию для форматирования дат в графиках:

```typescript
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
```

---

#### 2. Файл: `src/components/charts/ActivityChart.tsx`

**Было:**
```typescript
dateLabel: new Date(item.date).toLocaleDateString('ru-RU', { 
  day: 'numeric', 
  month: 'short' 
}),
```

**Станет:**
```typescript
import { formatChartDate } from '@/lib/formatters';
// ...
dateLabel: formatChartDate(item.date),
```

---

#### 3. Файл: `src/data/miniAppsData.ts`

**Было (строка ~181):**
```typescript
date: date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }),
```

**Станет:**
```typescript
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
// ...
date: format(date, 'd MMM', { locale: ru }),
```

---

#### 4. Файл: `src/components/charts/BurndownChart.tsx`

Этот файл уже использует правильный формат (`"1 фев"`, `"2 фев"` и т.д.), но для консистентности заменим на date-fns:

**Было:**
```typescript
day: `${day} фев`,
```

**Станет:**
```typescript
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
// ...
const date = new Date(2026, 1, day); // Февраль 2026
day: format(date, 'd MMM', { locale: ru }),
```

---

### Файлы для изменения

| Файл | Изменение |
|------|-----------|
| `src/lib/formatters.ts` | Добавить `formatChartDate()` и `formatChartMonth()` |
| `src/components/charts/ActivityChart.tsx` | Использовать `formatChartDate()` |
| `src/components/charts/BurndownChart.tsx` | Использовать date-fns вместо ручного формата |
| `src/data/miniAppsData.ts` | Использовать date-fns в `generateDailyData()` |

---

### Формат вывода date-fns

С локалью `ru` формат `d MMM` выдаёт:
- 1 → "1 янв"
- 8 → "8 фев"  
- 15 → "15 мар"

Формат `LLL yyyy` для месяцев:
- "Янв 2026"
- "Фев 2026"

---

### Что не меняем

Следующие файлы уже корректно используют date-fns с русской локалью:
- `src/pages/studio/Feed.tsx` — `format(date, 'd MMM', { locale: ru })`
- `src/components/quality/DialogSearchBar.tsx` — `format(date, 'd MMM', { locale: ru })`
- `src/pages/expert/Conclusions.tsx` — `format(date, 'dd.MM.yy', { locale: ru })`
- `src/components/quality/DocumentProperties.tsx` — `format(date, 'd MMM yyyy', { locale: ru })`
- `src/pages/super/Campaigns.tsx` — `format(date, 'd MMM yyyy', { locale: ru })`

