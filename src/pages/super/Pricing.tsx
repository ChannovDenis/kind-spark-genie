import { Plus, Edit, Check, Sparkles } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { pricingPlans } from '@/data/mockData';
import { toast } from 'sonner';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU').format(price);
}

function formatLimit(value: number | null, unit: string): string {
  if (value === null) return 'Безлимит';
  return `${new Intl.NumberFormat('ru-RU').format(value)} ${unit}`;
}

export default function SuperPricing() {
  const handleAddPlan = () => {
    toast.info('Открытие редактора тарифов...');
  };

  const handleEditPlan = (planId: string) => {
    toast.info(`Редактирование плана: ${planId}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Тарифные планы"
        description="Управление тарифами и лимитами платформы"
        actions={
          <Button onClick={handleAddPlan}>
            <Plus className="h-4 w-4 mr-2" />
            Новый план
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pricingPlans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative ${plan.isPopular ? 'border-primary shadow-lg' : ''}`}
          >
            {plan.isPopular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Популярный
                </div>
              </div>
            )}

            <CardHeader className="text-center pb-2">
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription>{plan.support}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">{formatPrice(plan.price)}</span>
                <span className="text-muted-foreground"> ₽/мес</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">AI-запросы</span>
                  <span className="font-medium">{formatLimit(plan.limits.aiRequests, '')}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Эскалации</span>
                  <span className="font-medium">{formatLimit(plan.limits.escalations, '')}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Хранилище</span>
                  <span className="font-medium">{plan.limits.storage} ГБ</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">API вызовы</span>
                  <span className="font-medium">{formatLimit(plan.limits.apiCalls, '')}</span>
                </div>
              </div>

              <div className="space-y-2">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-success" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>

            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleEditPlan(plan.id)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Редактировать
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
