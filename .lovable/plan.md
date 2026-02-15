

# Замена всех Math.random() на стабильные данные

## Обзор

Все динамические данные в админ-панели сейчас генерируются через `Math.random()` или захардкожены без привязки к тенантам. При каждом рендере числа меняются -- это недопустимо для демо. Нужно создать единый файл стабильных данных и подключить его ко всем компонентам.

Также есть критический баг: ID тенантов в `TenantContext` (`tenant-a`, `tenant-b`, `tenant-c`) не совпадают с ключами в `Dashboard.tsx` (`gazprombank`, `wildberries`, `mec`). Это будет исправлено в рамках задачи.

---

## Что будет сделано

### 1. Обновить TenantContext -- привести ID тенантов в соответствие

Файл: `src/contexts/TenantContext.tsx`

Заменить анонимные `tenant-a/b/c` на реальные ID из задания:
- `tenant-a` -> `gazprombank` (Газпромбанк)
- `tenant-b` -> `wildberries` (Wildberries)
- `tenant-c` -> `mes` (МЭС)

Добавить два новых тенанта:
- `alfa` (Альфа)
- `pochtarf` (Почта РФ)

### 2. Создать файл `src/data/tenantMetrics.ts`

Содержит ВСЕ стабильные данные, привязанные к тенантам:

**a) `dashboardMetrics`** -- метрики дашборда (6 тенантов x 4 метрики с value + change), точно по указанным числам из задания.

**b) `activityChartData`** -- 30 дней данных для каждого тенанта с фиксированными числами:
- Для dobroservice: будни 78-120, выходные 50-70, тренд вверх ~5-8%/неделю
- Для gazprombank: ~3x от dobroservice
- Для wildberries: ~5x от dobroservice
- Для остальных: пропорционально dashboardMetrics
- Escalations = ~7-9% от aiRequests

**c) `burndownData`** -- 30 дней burn-down для каждого тенанта:
- dobroservice: лимит 3000
- gazprombank: лимит 10000
- wildberries: лимит 18000
- mes: лимит 2000
- alfa: лимит 8000
- pochtarf: лимит 5000
- Plan = линейно от лимита до 0
- Fact = с реалистичными отклонениями (чуть быстрее к середине, выравнивание к концу)

**d) `tenantEscalations`** -- по 2-3 эскалации на тенант, из задания:
- ГПБ: "Спор по кредитному договору" (high), "Возврат страховки..." (medium), "Отказ в реструктуризации" (high)
- WB: "Возврат бракованного товара" (high), "Блокировка ЛК продавца" (medium)
- Почта РФ: "Потеря международной посылки" (high), "Задержка EMS..." (medium)
- МЭС: "Перерасчёт за отопление" (medium), "Отключение горячей воды..." (high)
- Dobroservice и Alfa: по 2-3 тематических эскалации

**e) `tenantServiceUsage`** -- по тенантам, только релевантные сервисы:
- ГПБ: Юрист (1840/2000), Финансист (920/1000), Психолог (450/500), Врач (380/500), Безопасность (210/300), Ассистент (620/1000)
- WB, МЭС, Почта РФ, Alfa, Dobroservice -- каждый со своим набором

**f) `tenantBillingQuotas`** -- квоты по сервисам для Billing-страницы, по тенантам.

### 3. Обновить `src/pages/admin/Dashboard.tsx`

- Убрать локальный объект `metrics` с хардкодом
- Импортировать `dashboardMetrics` из `tenantMetrics.ts`
- Брать метрики по `currentTenant.id`
- Использовать `change` из данных вместо хардкода `12.5`, `-8.2` и т.д.

### 4. Обновить `src/components/charts/ActivityChart.tsx`

- Принимать `tenantId` как проп
- Импортировать `activityChartData` из `tenantMetrics.ts`
- Брать массив по `tenantId` вместо глобального `activityChartData` из `mockData.ts`

### 5. Обновить `src/components/charts/BurndownChart.tsx`

- Принимать `tenantId` как проп
- Убрать `generateBurndownData()` с `Math.random()`
- Импортировать `burndownData` из `tenantMetrics.ts`
- Брать массив по `tenantId`

### 6. Обновить `src/components/admin/RecentEscalations.tsx`

- Принимать `tenantId` как проп
- Импортировать `tenantEscalations` из `tenantMetrics.ts`
- Показывать эскалации текущего тенанта

### 7. Обновить `src/components/admin/ServiceUsageTable.tsx`

- Принимать `tenantId` как проп
- Импортировать `tenantServiceUsage` из `tenantMetrics.ts`
- Показывать сервисы текущего тенанта

### 8. Обновить `src/pages/admin/Billing.tsx`

- Импортировать `tenantBillingQuotas` из `tenantMetrics.ts`
- Брать квоты по `currentTenant.id`
- Передавать `tenantId` в `BurndownChart`

### 9. Убрать неиспользуемые экспорты из `src/data/mockData.ts`

Удалить `activityChartData`, `serviceUsage`, `billingQuotas` из mockData.ts (они переезжают в `tenantMetrics.ts`). Оставить: `mockEscalations` (для обратной совместимости других модулей), `services`, `mockUsers`, `mockReports`, expert data.

---

## Что НЕ затрагивается

- Роутинг и навигация
- Авторизация (AuthContext)
- UI-компоненты (shadcn)
- Структура страниц
- Модули expert, quality, studio, super

---

## Технические детали

### Структура `tenantMetrics.ts` (ключевые типы)

```text
dashboardMetrics: Record<string, { aiRequests/escalations/nps/avgTime: { value, change } }>
activityChartData: Record<string, Array<{ date, aiRequests, escalations }>>
burndownData: Record<string, Array<{ date, plan, fact }>>
tenantEscalations: Record<string, Escalation[]>
tenantServiceUsage: Record<string, ServiceUsageItem[]>
tenantBillingQuotas: Record<string, BillingQuota[]>
```

### Порядок реализации

1. Обновить `TenantContext.tsx` (исправить ID тенантов)
2. Создать `src/data/tenantMetrics.ts` (все стабильные данные)
3. Обновить Dashboard, ActivityChart, BurndownChart, RecentEscalations, ServiceUsageTable, Billing
4. Убрать лишнее из `mockData.ts`

