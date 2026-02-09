

## Финальная полировка проекта перед демо

### Обзор
Исправление конкретных UX-проблем, выявленных в аудите. 5 задач выполняются последовательно.

---

### Задача 1: Кнопка "Назад" на детальных страницах

**Анализ текущего состояния:**

| Страница | Кнопка "Назад" | Статус |
|----------|---------------|--------|
| `/quality/dialogs/:id` (DialogReview) | ✅ Есть (строка 115-119) | OK |
| `/expert/session/:id` (Session) | ✅ Есть (строка 123-127) | OK |
| `/studio/scenarios/:id` (ScenarioEditor) | ✅ Есть (строка 165) | OK |
| `/studio/video/:id` (VideoAnalytics) | ✅ Есть (строка 74-77) | OK |

**Результат:** Все детальные страницы уже имеют кнопку "Назад". Изменения не требуются.

---

### Задача 2: Русская локаль в графиках

**Анализ текущего состояния:**

| Компонент | Файл | Текущий формат | Статус |
|-----------|------|----------------|--------|
| ActivityChart | `src/components/charts/ActivityChart.tsx` | `formatChartDate()` с date-fns/ru | ✅ OK |
| BurndownChart | `src/components/charts/BurndownChart.tsx` | `formatChartDate()` с date-fns/ru | ✅ OK |
| MRR AreaChart | `src/pages/super/Analytics.tsx` | Mock-данные уже на русском | ✅ OK |
| BarChart активности | `src/pages/super/Analytics.tsx` | Mock-данные "2 фев", "3 фев" | ✅ OK |
| AreaChart MiniApp | `src/pages/super/MiniAppConfig.tsx` | Использует `miniAppsData.ts` | ✅ OK |

**Проверка mock-данных:**
- `src/data/superData.ts` строки 325-332: даты уже русские ("2 фев", "3 фев" и т.д.)
- `src/data/superData.ts` строки 341-348: месяцы уже русские ("Сен 2025", "Окт 2025" и т.д.)
- `src/data/miniAppsData.ts`: использует `format(date, 'd MMM', { locale: ru })`

**Результат:** Графики уже используют русскую локаль после предыдущих изменений. Изменения не требуются.

---

### Задача 3: Разделитель тысяч

**Анализ:** Большинство мест уже используют `.toLocaleString('ru-RU')`, но нужно проверить и унифицировать.

**Файлы с потенциальными проблемами:**

| Файл | Строка | Текущее | Требуется |
|------|--------|---------|-----------|
| `src/pages/admin/Branding.tsx` | — | Нет чисел >= 1000 | OK |
| `src/pages/super/Pricing.tsx` | 124 | `.toLocaleString('ru-RU')` | ✅ OK |
| `src/pages/super/Analytics.tsx` | 47-49 | `.toLocaleString('ru-RU')` | ✅ OK |
| `src/pages/super/TenantDetail.tsx` | 151-154 | `.toLocaleString('ru-RU')` | ✅ OK |
| `src/pages/super/MiniAppConfig.tsx` | 433 | `.toLocaleString('ru-RU')` | ✅ OK |
| `src/pages/studio/Feed.tsx` | 184, 187 | `.toLocaleString('ru-RU')` | ✅ OK |
| `src/pages/super/Experts.tsx` | 140 | `.toLocaleString('ru-RU')` | ✅ OK |
| `src/pages/super/Campaigns.tsx` | 173-174 | `.toLocaleString('ru-RU')` | ✅ OK |

**Результат:** Все числа >= 1000 уже используют разделитель тысяч. Изменения не требуются.

---

### Задача 4: Toast-уведомления при сохранении

**Анализ текущего состояния:**

| Страница | Кнопка | Toast | Статус |
|----------|--------|-------|--------|
| `/super/tenants/:id` | "Сохранить" | ✅ `toast.success('Настройки тенанта сохранены')` | OK |
| `/super/pricing` | "Сохранить тариф" | ✅ `toast.success('Тариф "..." сохранён')` | OK |
| `/super/mini-apps/:id/config` | "Сохранить" | ❌ Нет toast | **Требуется** |
| `/super/campaigns/new` | "Запустить кампанию" | ✅ `toast.success('Кампания запущена!')` | OK |
| `/super/campaigns/new` | "Сохранить черновик" | ✅ `toast.success('Черновик сохранён')` | OK |
| `/studio/scenarios/:id` | "Сгенерировать видео" | ✅ `toast.success('Видео сгенерировано!')` | OK |
| `/studio/scenarios/:id` | "Сохранить черновик" | ✅ `toast.success('Черновик сохранён')` | OK |
| `/admin/branding` | "Сохранить изменения" | ❌ Нет toast | **Требуется** |
| `/admin/reports` | "Сформировать" | ❌ Нет toast | **Требуется** |

**Изменения:**

#### Файл: `src/pages/super/MiniAppConfig.tsx`
- Добавить импорт `toast` из sonner (если нет)
- Добавить обработчик `handleSave` с `toast.success('Настройки сохранены')`
- Привязать к кнопке "Сохранить"

#### Файл: `src/pages/admin/Branding.tsx`
- Добавить импорт `toast` из sonner
- Добавить обработчик `handleSave` с `toast.success('Изменения сохранены')`
- Привязать к кнопке "Сохранить изменения"

#### Файл: `src/pages/admin/Reports.tsx`
- Добавить `toast.success('Отчёт формируется...')` в кнопку "Сформировать" в диалоге

---

### Задача 5: Поиск — подключить фильтрацию

**Анализ текущего состояния:**

| Страница | Поиск | Фильтрация | Статус |
|----------|-------|------------|--------|
| `/studio/scenarios` | ✅ Есть | ✅ Работает (строки 49-55) | OK |
| `/studio/feed` | ✅ Есть | ✅ Работает (строки 70-76) | OK |
| `/super/experts` | ✅ Есть | ✅ Работает (строки 44-48) | OK |
| `/super/campaigns` | ❌ Нет поиска | — | Опционально |
| `/admin/reports` | ❌ Нет поиска | — | Опционально |
| `/expert/sessions` | ❌ Нет поиска | — | Опционально |
| `/expert/conclusions` | ✅ Есть | ✅ Работает (строки 30-42) | OK |

**Результат:** Все страницы с полем поиска уже имеют работающую фильтрацию. Изменения не требуются.

---

### Итоговый список изменений

| # | Файл | Изменение |
|---|------|-----------|
| 1 | `src/pages/super/MiniAppConfig.tsx` | Добавить toast при нажатии "Сохранить" |
| 2 | `src/pages/admin/Branding.tsx` | Добавить toast при нажатии "Сохранить изменения" |
| 3 | `src/pages/admin/Reports.tsx` | Добавить toast при нажатии "Сформировать" |

---

### Технические детали

#### 1. MiniAppConfig.tsx
```typescript
// Добавить импорт
import { toast } from 'sonner';

// Добавить обработчик
const handleSave = () => {
  toast.success('Настройки сохранены');
};

// Изменить кнопку (строка ~116)
<Button onClick={handleSave}>
  <Save className="h-4 w-4 mr-2" />
  Сохранить
</Button>
```

#### 2. Branding.tsx
```typescript
// Добавить импорт
import { toast } from 'sonner';

// Добавить обработчик
const handleSave = () => {
  toast.success('Изменения сохранены');
};

// Изменить кнопку (строка ~30)
<Button onClick={handleSave}>Сохранить изменения</Button>
```

#### 3. Reports.tsx
```typescript
// Изменить кнопку в DialogFooter (строка ~217-218)
<Button onClick={() => {
  toast.success('Отчёт формируется...');
  setIsCreateOpen(false);
}}>
  Сформировать
</Button>
```

---

### Что не требует изменений (уже реализовано)

1. **Кнопки "Назад"** — все детальные страницы уже имеют навигацию
2. **Русская локаль в графиках** — реализовано через `formatChartDate()` и date-fns
3. **Разделитель тысяч** — везде используется `.toLocaleString('ru-RU')`
4. **Фильтрация поиска** — все поля поиска уже фильтруют данные

