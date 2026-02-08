import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Send, Clock, Zap } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const steps = [
  { id: 1, title: 'Сегмент', icon: '👥' },
  { id: 2, title: 'Сообщение', icon: '✉️' },
  { id: 3, title: 'Расписание', icon: '📅' },
  { id: 4, title: 'Запуск', icon: '🚀' },
];

export default function CampaignEditor() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Segment
  const [campaignName, setCampaignName] = useState('');
  const [segmentType, setSegmentType] = useState('all');

  // Step 2: Message
  const [channel, setChannel] = useState('push');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [cta, setCta] = useState('');

  // Step 3: Schedule
  const [scheduleType, setScheduleType] = useState('now');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleLaunch = () => {
    toast.success('Кампания запущена!');
    navigate('/super/campaigns');
  };

  const handleSaveDraft = () => {
    toast.success('Черновик сохранён');
    navigate('/super/campaigns');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/super/campaigns')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Новая кампания</h1>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-center gap-2">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors',
                currentStep === step.id
                  ? 'bg-primary text-primary-foreground'
                  : currentStep > step.id
                  ? 'bg-primary/20 text-primary'
                  : 'bg-muted text-muted-foreground'
              )}
              onClick={() => currentStep > step.id && setCurrentStep(step.id)}
            >
              <span>{step.icon}</span>
              <span className="text-sm font-medium">{step.title}</span>
              {currentStep > step.id && <Check className="h-4 w-4" />}
            </div>
            {index < steps.length - 1 && (
              <div className="w-8 h-0.5 bg-muted mx-1" />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="max-w-2xl mx-auto">
        {/* Step 1: Segment */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Настройка сегмента</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Название кампании</Label>
                <Input
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="Например: Акция февраля"
                />
              </div>

              <div className="space-y-2">
                <Label>Целевая аудитория</Label>
                <Select value={segmentType} onValueChange={setSegmentType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все пользователи</SelectItem>
                    <SelectItem value="active">Активные (за 7 дней)</SelectItem>
                    <SelectItem value="inactive">Неактивные (30+ дней)</SelectItem>
                    <SelectItem value="new">Новые (до 7 дней)</SelectItem>
                    <SelectItem value="premium">Premium-подписка</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Предварительный охват</p>
                <p className="text-2xl font-bold">~15 420 пользователей</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Message */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Создание сообщения</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Канал</Label>
                <Select value={channel} onValueChange={setChannel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="push">Push-уведомление</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="in-app">In-App сообщение</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Заголовок</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Заголовок сообщения"
                />
              </div>

              <div className="space-y-2">
                <Label>Текст сообщения</Label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Текст сообщения..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>CTA (кнопка)</Label>
                <Input
                  value={cta}
                  onChange={(e) => setCta(e.target.value)}
                  placeholder="Например: Узнать больше"
                />
              </div>

              {/* Preview */}
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground mb-2">Превью</p>
                <div className="p-3 rounded bg-background border">
                  <p className="font-medium text-sm">{title || 'Заголовок'}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {message || 'Текст сообщения...'}
                  </p>
                  {cta && (
                    <Button size="sm" className="mt-2">
                      {cta}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Schedule */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Расписание отправки</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup value={scheduleType} onValueChange={setScheduleType}>
                <div className="flex items-center space-x-3 p-4 rounded-lg border hover:border-primary/50 cursor-pointer">
                  <RadioGroupItem value="now" id="now" />
                  <Label htmlFor="now" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Send className="h-4 w-4" />
                    <div>
                      <p className="font-medium">Отправить сейчас</p>
                      <p className="text-xs text-muted-foreground">Сообщение будет отправлено немедленно</p>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-4 rounded-lg border hover:border-primary/50 cursor-pointer">
                  <RadioGroupItem value="scheduled" id="scheduled" />
                  <Label htmlFor="scheduled" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Clock className="h-4 w-4" />
                    <div>
                      <p className="font-medium">По расписанию</p>
                      <p className="text-xs text-muted-foreground">Выберите дату и время отправки</p>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-4 rounded-lg border hover:border-primary/50 cursor-pointer">
                  <RadioGroupItem value="trigger" id="trigger" />
                  <Label htmlFor="trigger" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Zap className="h-4 w-4" />
                    <div>
                      <p className="font-medium">По триггеру</p>
                      <p className="text-xs text-muted-foreground">Отправка при наступлении события</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>

              {scheduleType === 'scheduled' && (
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="space-y-2">
                    <Label>Дата</Label>
                    <Input
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Время</Label>
                    <Input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 4: Launch */}
        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Подтверждение запуска</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Название</span>
                  <span className="font-medium">{campaignName || '—'}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Канал</span>
                  <span className="font-medium">{channel.toUpperCase()}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Охват</span>
                  <span className="font-medium">~15 420 пользователей</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Отправка</span>
                  <span className="font-medium">
                    {scheduleType === 'now'
                      ? 'Сейчас'
                      : scheduleType === 'scheduled'
                      ? `${scheduleDate} ${scheduleTime}`
                      : 'По триггеру'}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                <p className="text-sm">
                  ⚠️ После запуска кампанию нельзя будет отменить. Убедитесь, что все настройки корректны.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button variant="outline" onClick={handlePrev} disabled={currentStep === 1}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад
          </Button>

          <div className="flex items-center gap-2">
            {currentStep === 4 ? (
              <>
                <Button variant="outline" onClick={handleSaveDraft}>
                  Сохранить черновик
                </Button>
                <Button onClick={handleLaunch}>
                  <Send className="h-4 w-4 mr-2" />
                  Запустить кампанию
                </Button>
              </>
            ) : (
              <Button onClick={handleNext}>
                Далее
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
