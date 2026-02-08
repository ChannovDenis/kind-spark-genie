import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
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
import { mockTenantDetail } from '@/data/superData';

export default function TenantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const tenant = mockTenantDetail;

  const [name, setName] = useState(tenant.name);
  const [domain, setDomain] = useState(tenant.domain);
  const [contact, setContact] = useState(tenant.contact);
  const [email, setEmail] = useState(tenant.email);
  const [plan, setPlan] = useState(tenant.plan);
  const [status, setStatus] = useState(tenant.status);
  const [primaryColor, setPrimaryColor] = useState(tenant.branding.primaryColor);
  const [appName, setAppName] = useState(tenant.branding.appName);

  const handleSave = () => {
    toast.success('Настройки тенанта сохранены');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/super')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{tenant.name}</h1>
          <p className="text-sm text-muted-foreground">{tenant.domain}</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Сохранить
        </Button>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList>
          <TabsTrigger value="basic">Основное</TabsTrigger>
          <TabsTrigger value="services">Сервисы</TabsTrigger>
          <TabsTrigger value="branding">Брендинг</TabsTrigger>
          <TabsTrigger value="limits">Лимиты</TabsTrigger>
        </TabsList>

        {/* Basic Tab */}
        <TabsContent value="basic" className="space-y-6">
          <div className="glass-card p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Название</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Домен</Label>
                <Input value={domain} onChange={(e) => setDomain(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Контактное лицо</Label>
                <Input value={contact} onChange={(e) => setContact(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Тариф</Label>
                <Select value={plan} onValueChange={setPlan}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Starter">Starter</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                    <SelectItem value="ГПБ Кастом">ГПБ Кастом</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Статус</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as 'active' | 'trial' | 'suspended')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Активен</SelectItem>
                    <SelectItem value="trial">Триал</SelectItem>
                    <SelectItem value="suspended">Приостановлен</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Дата подключения: {new Date(tenant.connectedAt).toLocaleDateString('ru-RU')}
              </p>
            </div>
          </div>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services">
          <div className="glass-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Сервис</TableHead>
                  <TableHead className="text-center">Включён</TableHead>
                  <TableHead className="text-right">Лимит</TableHead>
                  <TableHead className="text-right">Использовано</TableHead>
                  <TableHead className="w-[200px]">Прогресс</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenant.services.map((service, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{service.name}</TableCell>
                    <TableCell className="text-center">
                      <Switch checked={service.enabled} />
                    </TableCell>
                    <TableCell className="text-right">
                      {service.limit.toLocaleString('ru-RU')}
                    </TableCell>
                    <TableCell className="text-right">
                      {service.used.toLocaleString('ru-RU')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={(service.used / service.limit) * 100}
                          className="flex-1"
                        />
                        <span className="text-xs text-muted-foreground w-10">
                          {Math.round((service.used / service.limit) * 100)}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Branding Tab */}
        <TabsContent value="branding" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card p-6 space-y-6">
              <div className="space-y-2">
                <Label>Основной цвет</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="h-10 w-20 rounded border border-input cursor-pointer"
                  />
                  <Input
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Название в приложении</Label>
                <Input value={appName} onChange={(e) => setAppName(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Логотип</Label>
                <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors">
                  <p className="text-sm text-muted-foreground">
                    Перетащите файл или нажмите для загрузки
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, SVG до 1MB</p>
                </div>
              </div>
            </div>

            {/* Mobile Preview */}
            <div className="glass-card p-6">
              <h3 className="font-medium mb-4">Превью мобильного экрана</h3>
              <div className="mx-auto w-[280px] h-[500px] bg-background rounded-[2rem] border-4 border-muted overflow-hidden">
                <div
                  className="h-16 flex items-center justify-center"
                  style={{ backgroundColor: primaryColor }}
                >
                  <span className="text-white font-semibold">{appName}</span>
                </div>
                <div className="p-4 space-y-3">
                  <div className="h-24 rounded-lg bg-muted animate-pulse" />
                  <div className="h-12 rounded-lg bg-muted animate-pulse" />
                  <div className="h-12 rounded-lg bg-muted animate-pulse" />
                  <div className="h-12 rounded-lg bg-muted animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Limits Tab */}
        <TabsContent value="limits">
          <div className="glass-card p-6">
            <h3 className="font-medium mb-4">Биллинг тенанта (read-only)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tenant.services.map((service, index) => (
                <div key={index} className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">{service.name}</p>
                  <p className="text-2xl font-bold">
                    {service.used.toLocaleString('ru-RU')}
                    <span className="text-sm font-normal text-muted-foreground">
                      {' '}/ {service.limit.toLocaleString('ru-RU')}
                    </span>
                  </p>
                  <Progress
                    value={(service.used / service.limit) * 100}
                    className="mt-2"
                  />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
