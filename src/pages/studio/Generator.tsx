import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Sparkles, 
  Video,
  Clock,
  User,
  Mic,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageHeader } from '@/components/shared/PageHeader';
import { services } from '@/data/mockData';
import { toast } from 'sonner';

// Voice options
const voiceOptions = [
  { id: 'anna', name: 'Анна', gender: 'female', style: 'спокойный' },
  { id: 'dmitry', name: 'Дмитрий', gender: 'male', style: 'уверенный' },
  { id: 'maria', name: 'Мария', gender: 'female', style: 'энергичный' },
  { id: 'alexey', name: 'Алексей', gender: 'male', style: 'нейтральный' },
];

// Style options
const styleOptions = [
  { id: 'informative', name: 'Информативный', description: 'Факты и цифры' },
  { id: 'friendly', name: 'Дружелюбный', description: 'Простой язык' },
  { id: 'professional', name: 'Профессиональный', description: 'Деловой тон' },
];

export default function StudioGenerator() {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Form state
  const [selectedService, setSelectedService] = useState('');
  const [topic, setTopic] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('');
  const [duration, setDuration] = useState([3]);
  const [style, setStyle] = useState('informative');

  const isFormValid = selectedService && topic.trim().length > 0 && selectedVoice;

  // Get selected entities for preview
  const currentService = services.find(s => s.id === selectedService);
  const currentVoice = voiceOptions.find(v => v.id === selectedVoice);

  // Estimated generation time (mock: ~30sec per minute of video)
  const estimatedTime = Math.ceil(duration[0] * 0.5);

  const handleGenerate = () => {
    if (!isFormValid) return;
    
    setIsGenerating(true);
    toast.success('Генерация видео запущена!', {
      description: `Расчётное время: ${estimatedTime} мин`,
    });
    
    setTimeout(() => {
      navigate('/studio');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Генератор видео"
        description="Создайте AI-видео для вашего сервиса"
        actions={
          <Button variant="outline" asChild>
            <Link to="/studio">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад к видео
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Form */}
        <div className="glass-card p-6 space-y-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Параметры видео
          </h2>

          {/* Service Select */}
          <div className="space-y-2">
            <Label htmlFor="service">Сервис</Label>
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger id="service">
                <SelectValue placeholder="Выберите сервис" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    <span className="flex items-center gap-2">
                      <span>{service.icon}</span>
                      <span>{service.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Topic Textarea */}
          <div className="space-y-2">
            <Label htmlFor="topic">Тема видео</Label>
            <Textarea
              id="topic"
              placeholder="Например: Как оформить налоговый вычет за лечение в 2026 году..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              {topic.length}/500 символов
            </p>
          </div>

          {/* Voice Select */}
          <div className="space-y-2">
            <Label htmlFor="voice">Голос AI</Label>
            <Select value={selectedVoice} onValueChange={setSelectedVoice}>
              <SelectTrigger id="voice">
                <SelectValue placeholder="Выберите голос" />
              </SelectTrigger>
              <SelectContent>
                {voiceOptions.map((voice) => (
                  <SelectItem key={voice.id} value={voice.id}>
                    <span className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>
                        {voice.name} ({voice.gender === 'female' ? 'ж' : 'м'}, {voice.style})
                      </span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Duration Slider */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Длительность</Label>
              <span className="text-sm font-medium text-primary">
                {duration[0]} мин
              </span>
            </div>
            <Slider
              value={duration}
              onValueChange={setDuration}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 мин</span>
              <span>10 мин</span>
            </div>
          </div>

          {/* Style RadioGroup */}
          <div className="space-y-3">
            <Label>Стиль подачи</Label>
            <RadioGroup value={style} onValueChange={setStyle} className="space-y-2">
              {styleOptions.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer"
                >
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                    <span className="font-medium">{option.name}</span>
                    <span className="text-muted-foreground ml-2 text-sm">
                      — {option.description}
                    </span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Generate Button */}
          <Button 
            onClick={handleGenerate} 
            disabled={!isFormValid || isGenerating}
            className="w-full"
            size="lg"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {isGenerating ? 'Генерация...' : 'Сгенерировать видео'}
          </Button>
        </div>

        {/* Right Column - Preview */}
        <div className="glass-card p-6 space-y-6 border-2 border-primary/20">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Video className="h-5 w-5 text-primary" />
            Превью
          </h2>

          {/* Video Placeholder */}
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5" />
            <div className="relative flex flex-col items-center gap-3 text-muted-foreground">
              <Video className="h-16 w-16 opacity-30" />
              <span className="text-sm">Предпросмотр видео</span>
            </div>
            
            {/* Duration badge */}
            <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/70 text-white text-xs font-mono">
              ~{duration[0]}:00
            </div>
          </div>

          {/* Preview Info */}
          <div className="space-y-4">
            {/* Topic Preview */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Тема</p>
              <p className="text-sm font-medium line-clamp-2">
                {topic.trim() || 'Введите тему видео...'}
              </p>
            </div>

            {/* Parameters Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Сервис</p>
                <p className="text-sm font-medium flex items-center gap-2">
                  {currentService ? (
                    <>
                      <span>{currentService.icon}</span>
                      <span>{currentService.name}</span>
                    </>
                  ) : (
                    <span className="text-muted-foreground">Не выбран</span>
                  )}
                </p>
              </div>

              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Голос</p>
                <p className="text-sm font-medium flex items-center gap-2">
                  <Mic className="h-4 w-4" />
                  {currentVoice ? currentVoice.name : (
                    <span className="text-muted-foreground">Не выбран</span>
                  )}
                </p>
              </div>

              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Длительность</p>
                <p className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {duration[0]} мин
                </p>
              </div>

              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Стиль</p>
                <p className="text-sm font-medium">
                  {styleOptions.find(s => s.id === style)?.name}
                </p>
              </div>
            </div>

            {/* Generation Time Estimate */}
            <div className="p-4 rounded-lg border border-border bg-background">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Расчётное время генерации</p>
                  <p className="text-xs text-muted-foreground">
                    Зависит от длительности видео
                  </p>
                </div>
                <div className="text-2xl font-bold text-primary">
                  ~{estimatedTime} мин
                </div>
              </div>
            </div>

            {/* Status */}
            <div className={`p-3 rounded-lg text-center text-sm font-medium ${
              isFormValid 
                ? 'bg-success/10 text-success border border-success/30' 
                : 'bg-muted text-muted-foreground'
            }`}>
              {isFormValid ? '✓ Готово к генерации' : 'Заполните все обязательные поля'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
