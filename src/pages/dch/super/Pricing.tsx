import { useState } from 'react';
import { Plus, Check, Save } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { mockPricingPlans, type PricingPlan } from '@/data/superData';

export default function SuperPricing() {
  const [selectedPlanId, setSelectedPlanId] = useState<string>(mockPricingPlans[0].id);
  const selectedPlan = mockPricingPlans.find((p) => p.id === selectedPlanId) || mockPricingPlans[0];

  const [name, setName] = useState(selectedPlan.name);
  const [price, setPrice] = useState(selectedPlan.price.toString());
  const [description, setDescription] = useState(selectedPlan.description);
  const [services, setServices] = useState(selectedPlan.services);
  const [miniApps, setMiniApps] = useState(selectedPlan.miniApps);
  const [maxUsers, setMaxUsers] = useState(selectedPlan.maxUsers?.toString() || '');
  const [overagePolicy, setOveragePolicy] = useState(selectedPlan.overagePolicy);

  const handlePlanSelect = (planId: string) => {
    const plan = mockPricingPlans.find((p) => p.id === planId);
    if (plan) {
      setSelectedPlanId(planId);
      setName(plan.name);
      setPrice(plan.price.toString());
      setDescription(plan.description);
      setServices(plan.services);
      setMiniApps(plan.miniApps);
      setMaxUsers(plan.maxUsers?.toString() || '');
      setOveragePolicy(plan.overagePolicy);
    }
  };

  const toggleService = (index: number) => {
    const updated = [...services];
    updated[index] = { ...updated[index], enabled: !updated[index].enabled };
    setServices(updated);
  };

  const updateServiceLimit = (index: number, limit: string) => {
    const updated = [...services];
    updated[index] = { ...updated[index], limit: limit === '' ? null : parseInt(limit) };
    setServices(updated);
  };

  const allMiniApps = [
    'Чат-бот',
    'Запись к эксперту',
    'База знаний',
    'Видеолента',
    'Аналитика',
    'Кастомные интеграции',
  ];

  const toggleMiniApp = (app: string) => {
    if (miniApps.includes(app)) {
      setMiniApps(miniApps.filter((a) => a !== app));
    } else {
      setMiniApps([...miniApps, app]);
    }
  };

  const handleSave = () => {
    toast.success(`Тариф "${name}" сохранён`);
  };

  const handleNewPlan = () => {
    toast.info('Создание нового тарифа...');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Тарифные планы"
        description="Управление тарифами и лимитами платформы"
      />

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* LEFT - Plan List */}
        <div className="space-y-2">
          {mockPricingPlans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => handlePlanSelect(plan.id)}
              className={cn(
                'p-4 rounded-lg border cursor-pointer transition-colors',
                selectedPlanId === plan.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{plan.name}</span>
                <div
                  className={cn(
                    'h-2 w-2 rounded-full',
                    plan.status === 'active' ? 'bg-success' : 'bg-muted-foreground'
                  )}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {plan.price.toLocaleString('ru-RU')} ₽/мес
              </p>
            </div>
          ))}

          <Button variant="outline" className="w-full" onClick={handleNewPlan}>
            <Plus className="h-4 w-4 mr-2" />
            Новый тариф
          </Button>
        </div>

        {/* RIGHT - Plan Editor */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="glass-card p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Название</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Цена (₽/мес)</Label>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Описание</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
            </div>
          </div>

          {/* Services & Limits */}
          <div className="glass-card p-6">
            <h3 className="font-medium mb-4">Сервисы и лимиты</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Сервис</TableHead>
                  <TableHead className="text-center">Включён</TableHead>
                  <TableHead className="text-right">Лимит</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{service.name}</TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={service.enabled}
                        onCheckedChange={() => toggleService(index)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        value={service.limit?.toString() || ''}
                        onChange={(e) => updateServiceLimit(index, e.target.value)}
                        placeholder="∞"
                        className="w-24 text-right ml-auto"
                        disabled={!service.enabled}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mini Apps */}
          <div className="glass-card p-6">
            <h3 className="font-medium mb-4">Мини-приложения</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {allMiniApps.map((app) => (
                <div key={app} className="flex items-center space-x-2">
                  <Checkbox
                    id={app}
                    checked={miniApps.includes(app)}
                    onCheckedChange={() => toggleMiniApp(app)}
                  />
                  <Label htmlFor={app} className="text-sm cursor-pointer">
                    {app}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Conditions */}
          <div className="glass-card p-6">
            <h3 className="font-medium mb-4">Условия</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Политика перерасхода</Label>
                <Select value={overagePolicy} onValueChange={(v) => setOveragePolicy(v as 'block' | 'charge' | 'notify')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="block">Блокировать</SelectItem>
                    <SelectItem value="charge">Списывать доп. оплату</SelectItem>
                    <SelectItem value="notify">Только уведомлять</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Макс. пользователей</Label>
                <Input
                  type="number"
                  value={maxUsers}
                  onChange={(e) => setMaxUsers(e.target.value)}
                  placeholder="Без ограничений"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Сохранить тариф
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
