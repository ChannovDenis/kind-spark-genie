import { Plus, Settings, Users } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { miniApps, services } from '@/data/mockData';
import { toast } from 'sonner';

function formatUsers(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

export default function SuperBuilder() {
  const handleCreateApp = () => {
    toast.info('Открытие мастера создания мини-приложения...');
  };

  const handleConfigureApp = (appId: string) => {
    toast.info(`Настройка приложения: ${appId}`);
  };

  const handleAddService = (serviceId: string) => {
    toast.success(`Сервис "${serviceId}" добавлен в очередь создания`);
  };

  // Сервисы, которые ещё не активированы как мини-приложения
  const availableServices = services.filter(
    (service) => !miniApps.some((app) => app.serviceId === service.id)
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Конструктор"
        description="Управление мини-приложениями платформы"
        actions={
          <Button onClick={handleCreateApp}>
            <Plus className="h-4 w-4 mr-2" />
            Создать мини-апп
          </Button>
        }
      />

      {/* Активные мини-приложения */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Активные мини-приложения</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {miniApps.map((app) => (
            <Card key={app.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="text-4xl">{app.icon}</div>
                  <StatusBadge
                    status={app.status === 'active' ? 'success' : 'warning'}
                    label={app.status === 'active' ? 'Активно' : 'Черновик'}
                  />
                </div>
                <CardTitle className="text-lg mt-2">{app.name}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {formatUsers(app.usersCount)} пользователей
                </CardDescription>
              </CardHeader>
              <CardFooter className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleConfigureApp(app.id)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Настроить
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Шаблоны для добавления */}
      {availableServices.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4">Доступные шаблоны</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableServices.map((service) => (
              <Card
                key={service.id}
                className="border-dashed hover:border-primary hover:shadow-md transition-all cursor-pointer"
                onClick={() => handleAddService(service.id)}
              >
                <CardHeader className="pb-2">
                  <div className="text-4xl opacity-60">{service.icon}</div>
                  <CardTitle className="text-lg mt-2 text-muted-foreground">
                    {service.name}
                  </CardTitle>
                  <CardDescription>Новый шаблон</CardDescription>
                </CardHeader>
                <CardFooter className="pt-2">
                  <Button variant="ghost" size="sm" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
