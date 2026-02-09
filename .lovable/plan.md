

## План: Живое демо — уведомления, эскалации, мета

### Обзор
Добавление 3 улучшений для более живого демо:
1. Колокольчик уведомлений в TopBar с выпадающим меню
2. Секция "Входящие запросы" на дашборде эксперта
3. Обновление title и favicon

---

### Задача 1: Уведомления (Bell в TopBar)

**Файл:** `src/components/layout/TopBar.tsx`

**Изменения:**
- Добавить импорт `Bell, AlertTriangle, UserPlus, CheckCircle, Calendar, TrendingUp, CreditCard, FileCheck` из lucide-react
- Добавить импорт `DropdownMenu, DropdownMenuTrigger, DropdownMenuContent` из UI
- Добавить импорт `ScrollArea` и `toast`
- Добавить состояние `notifications` с 7 mock-уведомлениями
- Рядом с `TenantSelector` добавить DropdownMenu:
  - Триггер: кнопка с иконкой Bell + красный бейдж "5" (absolute, -top-1, -right-1)
  - Контент: ширина 380px, max-height 400px
  - Заголовок: "Уведомления" + кнопка "Прочитать все"
  - ScrollArea со списком уведомлений
  - Каждое уведомление: иконка (цветная) + текст + timestamp
  - Непрочитанные: bg-primary/5, точка слева
  - Клик → toast "Перенаправление..."

**Mock-данные уведомлений:**
```typescript
const notifications = [
  { id: 1, icon: AlertTriangle, color: 'text-destructive', text: 'Критичная ошибка в диалоге #847 — галлюцинация', time: '5 мин назад', unread: true },
  { id: 2, icon: UserPlus, color: 'text-warning', text: 'Новая эскалация: клиент запросил юриста', time: '12 мин назад', unread: true },
  { id: 3, icon: CheckCircle, color: 'text-success', text: "Видео 'Упражнения для спины' опубликовано", time: '30 мин назад', unread: true },
  { id: 4, icon: Calendar, color: 'text-primary', text: 'Консультация с Д. Ивановым через 15 мин', time: '45 мин назад', unread: true },
  { id: 5, icon: TrendingUp, color: 'text-warning', text: "Тренд: 'Налоговый вычет' — рекомендуем ролик", time: '1 час назад', unread: true },
  { id: 6, icon: CreditCard, color: 'text-success', text: 'Газпромбанк: квота AI-обращений 80%', time: '2 часа назад', unread: false },
  { id: 7, icon: FileCheck, color: 'text-primary', text: 'Отчёт за январь готов к скачиванию', time: 'вчера', unread: false },
];
```

---

### Задача 2: Очередь эскалаций на дашборде эксперта

**Файл:** `src/pages/expert/Dashboard.tsx`

**Изменения:**
- Добавить импорт `AlertTriangle, Users` из lucide-react
- Добавить импорт `useNavigate` из react-router-dom
- Добавить импорт `toast` из sonner
- Добавить импорт `Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter` для делегирования
- Добавить импорт `Select, SelectTrigger, SelectValue, SelectContent, SelectItem`
- Добавить состояния:
  - `escalations` — 3 карточки
  - `visibleEscalations` — для скрытия отклонённых
  - `delegateDialogOpen` + `selectedEscalation`
- Добавить секцию "Входящие запросы" ПЕРЕД "Ближайшие консультации":
  - Заголовок + бейдж "3 новых" красный
  - 3 карточки glass-card с border-left:
    - Карточка 1: border-destructive, bg-destructive/5, "СРОЧНО", confidence 0.12 красный
    - Карточка 2: border-warning, confidence 0.38 жёлтый  
    - Карточка 3: border-primary, confidence 0.71 зелёный
  - Кнопки: "Принять" → navigate + toast, "Отклонить" → скрыть + toast, "Делегировать" → Dialog

**Mock-данные эскалаций:**
```typescript
const escalationsData = [
  { 
    id: 1, 
    urgent: true, 
    time: '2 мин назад',
    text: 'Клиент спрашивает про уголовное дело — AI отказал, клиент настаивает',
    service: 'Юрист', 
    tenant: 'ГПБ', 
    confidence: 0.12,
    borderColor: 'border-l-destructive',
    bgColor: 'bg-destructive/5'
  },
  { 
    id: 2, 
    urgent: false, 
    time: '8 мин назад',
    text: 'Вопрос по разделу ипотечной квартиры — AI ответил, клиент не удовлетворён',
    service: 'Юрист', 
    tenant: 'ГПБ', 
    confidence: 0.38,
    borderColor: 'border-l-warning',
    bgColor: ''
  },
  { 
    id: 3, 
    urgent: false, 
    time: '23 мин назад',
    text: 'Запрос на консультацию по трудовому спору — клиент хочет живого юриста',
    service: 'Юрист', 
    tenant: 'WB', 
    confidence: 0.71,
    borderColor: 'border-l-primary',
    bgColor: ''
  },
];
```

**Диалог делегирования:**
- Select с 3 экспертами: "Мария Иванова (Юрист)", "Дмитрий Козлов (Юрист)", "Елена Петрова (Юрист)"
- Кнопка "Делегировать" → toast.success

---

### Задача 3: Favicon и мета

**Файл:** `index.html`

**Изменения:**
- Заменить `<title>` на "Добросервис 2.0"
- Добавить emoji-favicon через data URI:
```html
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🤖</text></svg>">
```
- Обновить og:title на "Добросервис 2.0"
- Обновить description на "AI-платформа для экспертных консультаций"

---

### Итоговый список файлов

| # | Файл | Изменение |
|---|------|-----------|
| 1 | `src/components/layout/TopBar.tsx` | Добавить Bell с DropdownMenu уведомлений |
| 2 | `src/pages/expert/Dashboard.tsx` | Добавить секцию "Входящие запросы" с 3 карточками |
| 3 | `index.html` | Обновить title, favicon, мета-теги |

---

### Визуальная структура уведомлений

```text
┌─────────────────────────────────────┐
│ Уведомления          [Прочитать все]│
├─────────────────────────────────────┤
│ ● ⚠️ Критичная ошибка...   5 мин   │ ← bg-primary/5
│ ● 👤 Новая эскалация...   12 мин   │ ← bg-primary/5
│ ● ✓ Видео опубликовано    30 мин   │ ← bg-primary/5
│ ● 📅 Консультация через   45 мин   │ ← bg-primary/5
│ ● 📈 Тренд: Налоговый...  1 час    │ ← bg-primary/5
│   💳 Газпромбанк: квота   2 часа   │
│   📄 Отчёт за январь      вчера    │
└─────────────────────────────────────┘
```

---

### Визуальная структура эскалаций

```text
Входящие запросы                [3 новых]
┌──────────────────────────────────────────┐
│▌ [СРОЧНО]                    2 мин назад │ ← border-l-destructive, bg-destructive/5
│▌ Клиент спрашивает про уголовное дело... │
│▌ 🏷️ Юрист  🏢 ГПБ   📊 0.12             │
│▌ [Принять] [Отклонить] [Делегировать]    │
└──────────────────────────────────────────┘
┌──────────────────────────────────────────┐
│▌                             8 мин назад │ ← border-l-warning
│▌ Вопрос по разделу ипотечной квартиры... │
│▌ 🏷️ Юрист  🏢 ГПБ   📊 0.38             │
│▌ [Принять] [Отклонить] [Делегировать]    │
└──────────────────────────────────────────┘
┌──────────────────────────────────────────┐
│▌                            23 мин назад │ ← border-l-primary
│▌ Запрос на консультацию по трудовому...  │
│▌ 🏷️ Юрист  🏢 WB    📊 0.71             │
│▌ [Принять] [Отклонить] [Делегировать]    │
└──────────────────────────────────────────┘
```

