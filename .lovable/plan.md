

# Доработки интерфейса админки

## Обзор

Четыре задачи: тенант-зависимые пользователи (15 для ГПБ, 12 для WB, 8-10 для остальных), 3-экранное превью брендинга, генерация CSV + расширение отчётов, таблица транзакций в биллинге.

---

## 1. Users: тенант-зависимые наборы (8-15 записей)

### Данные

Файл: `src/data/tenantMetrics.ts` -- добавить `tenantUsers: Record<string, PartnerUser[]>`

- **gazprombank** (15): отделы "Ипотечный центр", "Розничный бизнес", "Корпоративный блок", "Риск-менеджмент", "Юридический департамент"; роли "Менеджер", "Старший менеджер", "Руководитель", "Аналитик"; totalRequests 12-340; 13 active + 2 inactive; lastActive разброс 30 дней; email = user1@example.com ... user15@example.com
- **wildberries** (12): "Поддержка продавцов", "Логистика", "Клиентский сервис", "Маркетинг"
- **dobroservice** (10): "Отдел продаж", "HR", "IT", "Бухгалтерия", "Маркетинг"
- **mes** (8): "Теплоснабжение", "Электросети", "Абонентский отдел", "Диспетчерская"
- **alfa** (10): "Розничный бизнес", "Кредитный отдел", "Инвестиции", "Комплаенс", "IT"
- **pochtarf** (9): "Сортировка", "Доставка", "Клиентский сервис", "Логистика"

### Компонент

Файл: `src/pages/admin/Users.tsx`:
- Импортировать `tenantUsers` из `tenantMetrics.ts` и `useTenant`
- Заменить `mockUsers` на `tenantUsers[currentTenant.id]`
- При переключении тенанта список обновляется автоматически (реактивность через контекст)

### Очистка

Удалить `mockUsers` из `src/data/mockData.ts` (перенесены в tenantMetrics).

---

## 2. Branding: 3-экранное превью

### Компонент

Файл: `src/pages/admin/Branding.tsx`:

Добавить state для `appTitle` (контролируемый input вместо defaultValue).

Заменить секцию "Phone Preview" (строки 118-185) на 3 миниатюры в горизонтальном ряду (`flex gap-6 justify-center`):

**Превью 1 -- "Splash":**
- Рамка: `border border-border rounded-[2rem] aspect-[9/19] max-w-[120px] w-full overflow-hidden bg-background`
- Содержимое: по центру иконка Bot (из lucide-react) цвета accentColor + appTitle под ней
- Подпись "Splash" под рамкой

**Превью 2 -- "Лента":**
- Та же рамка
- Хедер с названием тенанта (фон accentColor), ниже -- карточка-заглушка (прямоугольник с bg-muted)
- Подпись "Лента"

**Превью 3 -- "Чат":**
- Та же рамка
- Хедер ассистента (фон accentColor), 2 пузырька: серый (assistant) с оттенком accentColor/10, и accentColor (user)
- Подпись "Чат"

Все 3 реагируют мгновенно на смену accentColor и appTitle.

---

## 3. Reports: CSV-генерация + расширение моков

### Данные

Файл: `src/data/mockData.ts` -- расширить `mockReports` до 8 записей, добавив 5 новых:
- "Использование AI-сервисов -- Январь 2026" (usage, pdf, "2.1 МБ")
- "Биллинг -- Январь 2026" (billing, xlsx, "856 КБ")
- "Качество обслуживания -- Q4 2025" (quality, pdf, "3.4 МБ")
- "Активность пользователей -- Январь 2026" (usage, csv, "124 КБ")
- "Эскалации -- Январь 2026" (quality, pdf, "1.8 МБ")

Добавить поле `status?: 'ready' | 'generating'` в интерфейс `Report`.

### CSV-генерация

Файл: `src/pages/admin/Reports.tsx`:

Добавить функцию `downloadCSV(report)`:
- Создать csvContent с 20 строками: "Дата,Сервис,AI-обращений,Эскалаций,CSAT\n" + фиксированные данные
- `URL.createObjectURL(new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' }))`
- Программно создать `<a>`, кликнуть, revoke URL
- toast.success("Отчёт скачан")

Привязать к кнопке Download в каждой строке таблицы.

### Создание отчёта с анимацией

Файл: `src/pages/admin/Reports.tsx`:

Добавить state `reports` (useState инициализированный из mockReports).

При нажатии "Сформировать":
1. Закрыть диалог
2. Добавить новую запись в начало `reports` со `status: 'generating'`
3. В таблице: если `status === 'generating'` -- показать Loader2 с анимацией spin + текст "Формируется..."
4. `setTimeout(() => { обновить status на 'ready' }, 2000)`
5. После готовности -- появляется кнопка скачивания

---

## 4. Billing: таблица транзакций

### Данные

Файл: `src/data/tenantMetrics.ts` -- добавить `tenantTransactions: Record<string, Transaction[]>`:

```text
interface Transaction {
  date: string;
  operation: string;
  amount: number;  // отрицательное = списание, положительное = пополнение
  balance: number;
}
```

По 15 записей для каждого тенанта с реалистичными операциями ("AI-запросы (юрист)", "Эскалация (психолог)", "Пополнение квоты").

### Компонент

Файл: `src/pages/admin/Billing.tsx`:

Добавить секцию "История операций" между burn-down и квотами:
- Заголовок "История операций"
- Таблица: Дата | Операция | Количество | Баланс
- Количество: красный текст для списаний, зелёный для пополнений
- Пагинация: показывать первые 10, кнопка "Показать ещё" загружает остальные (useState `showAll`)

---

## Что НЕ затрагивается

- Авторизация и RBAC
- Роутинг
- Навигация (sidebar, topbar)
- TenantContext (уже исправлен)

---

## Технические детали

### Файлы для изменения

1. `src/data/tenantMetrics.ts` -- добавить tenantUsers, tenantTransactions
2. `src/data/mockData.ts` -- удалить mockUsers, расширить mockReports + добавить поле status
3. `src/pages/admin/Users.tsx` -- импорт tenantUsers, useTenant
4. `src/pages/admin/Branding.tsx` -- переделать превью на 3 миниатюры + controlled appTitle
5. `src/pages/admin/Reports.tsx` -- CSV-генерация, динамический список, анимация создания
6. `src/pages/admin/Billing.tsx` -- секция транзакций с пагинацией

### Порядок реализации

1. Расширить tenantMetrics.ts (данные пользователей и транзакций)
2. Обновить mockData.ts (отчёты)
3. Параллельно обновить Users, Branding, Reports, Billing

