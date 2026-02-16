import { useState } from 'react';
import { toast } from 'sonner';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Plus, Save } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge, Status } from '@/components/shared/StatusBadge';
import { MetricCard } from '@/components/shared/MetricCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { miniApps, getMiniAppConfig, modelOptions, priorityOptions, MiniAppStatus, CategoryStatus, EscalationPriority } from '@/data/miniAppsData';
import { cn } from '@/lib/utils';

const getStatusBadgeProps = (status: MiniAppStatus): { status: Status; label: string } => {
  switch (status) {
    case 'active':
      return { status: 'success', label: 'Активен' };
    case 'draft':
      return { status: 'cancelled', label: 'Черновик' };
    case 'testing':
      return { status: 'warning', label: 'Тестирование' };
  }
};

const getCategoryStatusIcon = (status: CategoryStatus) => {
  switch (status) {
    case 'active':
      return '✅';
    case 'testing':
      return '🟡';
    case 'draft':
      return '⚪';
  }
};

const getPriorityLabel = (priority: EscalationPriority) => {
  return priorityOptions.find(p => p.value === priority)?.label || priority;
};

export default function MiniAppConfig() {
  const { id } = useParams<{ id: string }>();
  const appId = id || 'lawyer';
  
  const app = miniApps.find(a => a.id === appId) || miniApps[0];
  const config = getMiniAppConfig(appId);
  
  const [activeTab, setActiveTab] = useState('ai-settings');
  const [whisperEnabled, setWhisperEnabled] = useState(config.aiSettings.useWhisper);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  
  const Icon = app.icon;
  const statusProps = getStatusBadgeProps(app.status);

  const tokenCount = Math.round(config.aiSettings.systemPrompt.length / 4);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/super/mini-apps">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center bg-muted/50",
            app.color
          )}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{app.name}</h1>
              <StatusBadge {...statusProps} />
            </div>
            <p className="text-sm text-muted-foreground">{app.description}</p>
          </div>
        </div>
        <Button onClick={() => toast.success('Настройки сохранены')}>
          <Save className="h-4 w-4 mr-2" />
          Сохранить
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="ai-settings">AI-настройки</TabsTrigger>
          <TabsTrigger value="categories">Категории</TabsTrigger>
          <TabsTrigger value="escalation">Эскалация</TabsTrigger>
          <TabsTrigger value="tenants">Тенанты</TabsTrigger>
          <TabsTrigger value="analytics">Аналитика</TabsTrigger>
        </TabsList>

        {/* TAB: AI Settings */}
        <TabsContent value="ai-settings" className="space-y-6 mt-6">
          {/* System Prompt */}
          <div className="glass-card p-4 space-y-3">
            <Label className="text-base font-medium">System Prompt</Label>
            <Textarea
              defaultValue={config.aiSettings.systemPrompt}
              className="min-h-[200px] font-mono text-[13px] bg-muted/30"
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Токенов: ~{tokenCount}
              </span>
              <Button variant="ghost" size="sm">
                <Sparkles className="h-4 w-4 mr-1.5" />
                Улучшить с AI
              </Button>
            </div>
          </div>

          {/* Model & Parameters */}
          <div className="glass-card p-4 space-y-4">
            <Label className="text-base font-medium">Модель и параметры</Label>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Модель</Label>
                <Select defaultValue={config.aiSettings.model}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {modelOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Temperature</Label>
                <span className="text-sm text-muted-foreground">{config.aiSettings.temperature}</span>
              </div>
              <Slider
                defaultValue={[config.aiSettings.temperature]}
                min={0}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Max tokens ответа</Label>
                <span className="text-sm text-muted-foreground">{config.aiSettings.maxTokens}</span>
              </div>
              <Slider
                defaultValue={[config.aiSettings.maxTokens]}
                min={256}
                max={4096}
                step={128}
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <Label className="text-sm">Использовать RAG</Label>
              <Switch defaultChecked={config.aiSettings.useRag} />
            </div>

            <div className="flex items-center justify-between py-2">
              <Label className="text-sm">Шёпот супервайзера</Label>
              <Switch 
                checked={whisperEnabled} 
                onCheckedChange={setWhisperEnabled}
              />
            </div>

            {whisperEnabled && (
              <div className="space-y-3 pl-4 border-l-2 border-muted">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Confidence threshold</Label>
                  <span className="text-sm text-muted-foreground">{config.aiSettings.confidenceThreshold}</span>
                </div>
                <Slider
                  defaultValue={[config.aiSettings.confidenceThreshold]}
                  min={0}
                  max={1}
                  step={0.05}
                  className="w-full"
                />
              </div>
            )}
          </div>

          {/* Restrictions */}
          <div className="glass-card p-4 space-y-4">
            <Label className="text-base font-medium">Ограничения</Label>
            
            <div className="space-y-2">
              <Label className="text-sm">Запрещённые темы</Label>
              <Textarea
                defaultValue={config.restrictions.forbiddenTopics}
                className="min-h-[60px] text-sm"
                placeholder="Перечислите темы через запятую..."
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <Label className="text-sm">Требовать подтверждение перед советом по документам</Label>
              <Switch defaultChecked={config.restrictions.requireDocConfirmation} />
            </div>
          </div>
        </TabsContent>

        {/* TAB: Categories */}
        <TabsContent value="categories" className="space-y-6 mt-6">
          <div className="glass-card p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Категория</TableHead>
                  <TableHead>Описание</TableHead>
                  <TableHead className="text-right">Вопросов</TableHead>
                  <TableHead className="text-right">Эскалаций</TableHead>
                  <TableHead className="text-center">Статус</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {config.categories.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell className="font-medium">{cat.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {cat.description}
                    </TableCell>
                    <TableCell className="text-right">{cat.questions}</TableCell>
                    <TableCell className="text-right">
                      {cat.escalations} ({cat.escalationRate}%)
                    </TableCell>
                    <TableCell className="text-center">
                      {getCategoryStatusIcon(cat.status)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <Button variant="ghost" className="w-full mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Добавить категорию
            </Button>
          </div>
        </TabsContent>

        {/* TAB: Escalation */}
        <TabsContent value="escalation" className="space-y-6 mt-6">
          {/* Escalation Rules */}
          <div className="glass-card p-4 space-y-4">
            <Label className="text-base font-medium">Правила эскалации к живому эксперту</Label>
            
            <div className="space-y-3">
              {config.escalationRules.map((rule) => (
                <div key={rule.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Switch defaultChecked={rule.enabled} />
                  <span className="flex-1 text-sm">{rule.condition}</span>
                  <Select defaultValue={rule.priority}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>

            <Button variant="ghost" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Добавить правило
            </Button>
          </div>

          {/* Linked Experts */}
          <div className="glass-card p-4 space-y-4">
            <Label className="text-base font-medium">Привязанные эксперты</Label>
            
            <div className="space-y-3">
              {config.linkedExperts.map((expert) => (
                <div key={expert.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">{expert.avatar}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-sm">{expert.name}</span>
                  <span className="text-sm text-muted-foreground">{expert.specialization}</span>
                  <div className="ml-auto">
                    <span className={cn(
                      "inline-block w-2 h-2 rounded-full",
                      expert.online ? "bg-green-500" : "bg-muted-foreground"
                    )} />
                  </div>
                </div>
              ))}
            </div>

            <Button variant="ghost" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Привязать эксперта
            </Button>
          </div>
        </TabsContent>

        {/* TAB: Tenants */}
        <TabsContent value="tenants" className="space-y-6 mt-6">
          <div className="glass-card p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Тенант</TableHead>
                  <TableHead className="text-center">Включён</TableHead>
                  <TableHead className="text-center">Промпт</TableHead>
                  <TableHead className="text-right">Лимит</TableHead>
                  <TableHead className="text-right">Использовано</TableHead>
                  <TableHead className="w-[120px]">Прогресс</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {config.tenantSettings.map((tenant) => {
                  const usage = tenant.limit ? (tenant.used / tenant.limit) * 100 : 0;
                  const progressColor = usage >= 90 ? 'bg-red-500' : usage >= 60 ? 'bg-yellow-500' : 'bg-green-500';

                  return (
                    <TableRow key={tenant.id}>
                      <TableCell className="font-medium">{tenant.name}</TableCell>
                      <TableCell className="text-center">
                        <Switch defaultChecked={tenant.enabled} />
                      </TableCell>
                      <TableCell className="text-center">
                        {tenant.customPrompt ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                Посмотреть
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Кастомный промпт — {tenant.name}</DialogTitle>
                              </DialogHeader>
                              <Textarea
                                value={tenant.customPrompt}
                                readOnly
                                className="min-h-[150px] font-mono text-[13px]"
                              />
                            </DialogContent>
                          </Dialog>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {tenant.limit ? `${tenant.limit} мин` : '∞'}
                      </TableCell>
                      <TableCell className="text-right">
                        {tenant.used} мин
                      </TableCell>
                      <TableCell>
                        {tenant.limit ? (
                          <div className="space-y-1">
                            <Progress 
                              value={usage} 
                              className="h-2"
                            />
                            <span className="text-xs text-muted-foreground">
                              {Math.round(usage)}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* TAB: Analytics */}
        <TabsContent value="analytics" className="space-y-6 mt-6">
          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title="Обращений (мес)"
              value={config.analytics.requestsMonth.toLocaleString('ru-RU')}
              change={config.analytics.requestsTrend}
            />
            <MetricCard
              title="Ср. confidence"
              value={config.analytics.avgConfidence.toFixed(2)}
              change={config.analytics.confidenceTrend * 100}
              changeLabel=""
            />
            <MetricCard
              title="Эскалаций"
              value={`${config.analytics.escalations} (${config.analytics.escalationRate}%)`}
              change={config.analytics.escalationTrend}
            />
          </div>

          {/* Daily Chart */}
          <div className="glass-card p-4">
            <h3 className="font-medium mb-4">Обращений по дням</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={config.analytics.dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 11 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis 
                    tick={{ fontSize: 11 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="requests"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary) / 0.2)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Chart */}
          <div className="glass-card p-4">
            <h3 className="font-medium mb-4">По категориям</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={config.analytics.categoryData} 
                  layout="vertical"
                  margin={{ left: 120 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    type="number"
                    tick={{ fontSize: 11 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis 
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                    stroke="hsl(var(--muted-foreground))"
                    width={110}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
