import { useState } from 'react';
import { Save, Shield, Plug, Bell, Server } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface SettingItem {
  id: string;
  label: string;
  description: string;
  defaultValue: boolean;
}

interface SettingsGroup {
  id: string;
  title: string;
  icon: typeof Shield;
  items: SettingItem[];
}

const settingsGroups: SettingsGroup[] = [
  {
    id: 'security',
    title: 'Безопасность',
    icon: Shield,
    items: [
      { id: '2fa', label: '2FA для админов', description: 'Обязательная двухфакторная аутентификация', defaultValue: true },
      { id: 'session_timeout', label: 'Автовыход', description: 'Автоматический выход через 30 минут неактивности', defaultValue: true },
      { id: 'ip_whitelist', label: 'IP whitelist', description: 'Ограничение доступа по IP-адресам', defaultValue: false },
    ],
  },
  {
    id: 'integrations',
    title: 'Интеграции',
    icon: Plug,
    items: [
      { id: 'openai', label: 'OpenAI API', description: 'Подключение к языковым моделям', defaultValue: true },
      { id: 'telegram', label: 'Telegram уведомления', description: 'Отправка уведомлений в Telegram', defaultValue: false },
      { id: 'webhooks', label: 'Webhook события', description: 'Отправка событий на внешние URL', defaultValue: true },
    ],
  },
  {
    id: 'notifications',
    title: 'Уведомления',
    icon: Bell,
    items: [
      { id: 'email_alerts', label: 'Email-оповещения', description: 'Отправка критических уведомлений на email', defaultValue: true },
      { id: 'daily_digest', label: 'Ежедневный дайджест', description: 'Сводка активности за день', defaultValue: true },
      { id: 'escalation_alerts', label: 'Уведомления об эскалациях', description: 'Мгновенные уведомления о новых эскалациях', defaultValue: true },
    ],
  },
  {
    id: 'system',
    title: 'Система',
    icon: Server,
    items: [
      { id: 'maintenance', label: 'Режим обслуживания', description: 'Временное отключение платформы для пользователей', defaultValue: false },
      { id: 'debug_logs', label: 'Debug-логи', description: 'Расширенное логирование для отладки', defaultValue: false },
      { id: 'beta_features', label: 'Бета-функции', description: 'Доступ к экспериментальным возможностям', defaultValue: false },
    ],
  },
];

export default function SuperSettings() {
  const [settings, setSettings] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    settingsGroups.forEach((group) => {
      group.items.forEach((item) => {
        initial[item.id] = item.defaultValue;
      });
    });
    return initial;
  });

  const handleToggle = (id: string) => {
    setSettings((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = () => {
    toast.success('Настройки сохранены');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Настройки платформы"
        description="Глобальные настройки и конфигурация системы"
        actions={
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Сохранить
          </Button>
        }
      />

      <div className="grid gap-6">
        {settingsGroups.map((group) => {
          const Icon = group.icon;
          return (
            <Card key={group.id}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Icon className="h-5 w-5 text-primary" />
                  {group.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {group.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-3 border-b last:border-0"
                  >
                    <div className="space-y-0.5">
                      <Label htmlFor={item.id} className="font-medium cursor-pointer">
                        {item.label}
                      </Label>
                      <CardDescription>{item.description}</CardDescription>
                    </div>
                    <Switch
                      id={item.id}
                      checked={settings[item.id]}
                      onCheckedChange={() => handleToggle(item.id)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
