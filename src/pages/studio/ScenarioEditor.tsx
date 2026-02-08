import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Play,
  Save,
  Send,
} from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  mockScenarios,
  scenarioTypes,
  scenarioCategories,
  voiceOptions,
  musicOptions,
  subtitleStyles,
  type Scene,
} from '@/data/studioScenariosData';

const statusConfig = {
  draft: { label: 'Черновик', status: 'pending' as const },
  ready: { label: 'Готов', status: 'success' as const },
  generating: { label: 'Генерация', status: 'in_progress' as const },
  published: { label: 'Опубликован', status: 'completed' as const },
};

export default function ScenarioEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const existingScenario = mockScenarios.find((s) => s.id === id);

  const [title, setTitle] = useState(existingScenario?.title || '');
  const [type, setType] = useState(existingScenario?.type || 'reels');
  const [category, setCategory] = useState(existingScenario?.category || '');
  const [scenes, setScenes] = useState<Scene[]>(
    existingScenario?.scenes.length
      ? existingScenario.scenes
      : [
          { id: 's1', order: 1, textOnScreen: '', videoPrompt: '', voiceover: '', badge: 'hook' },
        ]
  );

  const [voice, setVoice] = useState('female-1');
  const [speed, setSpeed] = useState([1.0]);
  const [music, setMusic] = useState('upbeat');
  const [subtitles, setSubtitles] = useState(true);
  const [subtitleStyle, setSubtitleStyle] = useState('modern');
  const [ctaPrompt, setCtaPrompt] = useState('');
  const [aiTopic, setAiTopic] = useState('');

  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [generatingProgress, setGeneratingProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const status = existingScenario?.status || 'draft';

  const addScene = () => {
    const newScene: Scene = {
      id: `s${scenes.length + 1}`,
      order: scenes.length + 1,
      textOnScreen: '',
      videoPrompt: '',
      voiceover: '',
    };
    setScenes([...scenes, newScene]);
  };

  const updateScene = (index: number, field: keyof Scene, value: string) => {
    const updated = [...scenes];
    updated[index] = { ...updated[index], [field]: value };
    setScenes(updated);
  };

  const removeScene = (index: number) => {
    if (scenes.length > 1) {
      setScenes(scenes.filter((_, i) => i !== index));
    }
  };

  const duplicateScene = (index: number) => {
    const newScene = { ...scenes[index], id: `s${Date.now()}`, order: scenes.length + 1 };
    setScenes([...scenes, newScene]);
  };

  const moveScene = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === scenes.length - 1)
    ) {
      return;
    }
    const updated = [...scenes];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [updated[index], updated[targetIndex]] = [updated[targetIndex], updated[index]];
    setScenes(updated);
  };

  const handleAiGenerate = () => {
    if (!aiTopic.trim()) {
      toast.error('Введите тему для генерации');
      return;
    }
    toast.success('Генерация сценария по теме: ' + aiTopic);
    setAiTopic('');
  };

  const handleStartGeneration = () => {
    setIsGenerating(true);
    setGeneratingProgress(0);

    const interval = setInterval(() => {
      setGeneratingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          toast.success('Видео сгенерировано!');
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleSaveDraft = () => {
    toast.success('Черновик сохранён');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/studio/scenarios')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Название сценария"
            className="text-xl font-semibold border-none bg-transparent px-0 focus-visible:ring-0"
          />
        </div>
        <StatusBadge status={statusConfig[status].status} label={statusConfig[status].label} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        {/* LEFT - Scenes */}
        <div className="space-y-4">
          {scenes.map((scene, index) => (
            <div
              key={scene.id}
              className={cn(
                'glass-card p-4 space-y-3 border-l-4',
                scene.badge === 'hook' && 'border-l-warning',
                scene.badge === 'cta' && 'border-l-primary',
                !scene.badge && 'border-l-muted-foreground/30'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Сцена {index + 1}
                  </span>
                  {scene.badge === 'hook' && (
                    <span className="text-xs px-2 py-0.5 rounded bg-warning/20 text-warning">
                      Хук
                    </span>
                  )}
                  {scene.badge === 'cta' && (
                    <span className="text-xs px-2 py-0.5 rounded bg-primary/20 text-primary">
                      CTA
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => moveScene(index, 'up')}
                    disabled={index === 0}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => moveScene(index, 'down')}
                    disabled={index === scenes.length - 1}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => duplicateScene(index)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive"
                    onClick={() => removeScene(index)}
                    disabled={scenes.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Текст на экране</Label>
                  <Input
                    value={scene.textOnScreen}
                    onChange={(e) => updateScene(index, 'textOnScreen', e.target.value)}
                    placeholder="Заголовок или текст для титров"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Промпт для видео</Label>
                  <Textarea
                    value={scene.videoPrompt}
                    onChange={(e) => updateScene(index, 'videoPrompt', e.target.value)}
                    placeholder="Описание визуала для AI-генерации"
                    rows={2}
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Озвучка</Label>
                  <Textarea
                    value={scene.voiceover}
                    onChange={(e) => updateScene(index, 'voiceover', e.target.value)}
                    placeholder="Текст для голосового сопровождения"
                    rows={2}
                  />
                </div>
              </div>
            </div>
          ))}

          <Button variant="outline" className="w-full" onClick={addScene}>
            <Plus className="h-4 w-4 mr-2" />
            Добавить сцену
          </Button>

          {/* AI Generation */}
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">AI-генерация сценария</span>
            </div>
            <div className="flex gap-2">
              <Input
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                placeholder="Введите тему..."
                className="flex-1"
              />
              <Button onClick={handleAiGenerate}>Сгенерировать</Button>
            </div>
          </div>
        </div>

        {/* RIGHT - Settings */}
        <div className="space-y-4">
          {/* Basic */}
          <div className="glass-card p-4 space-y-4">
            <h3 className="font-medium text-sm">Основное</h3>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Категория</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {scenarioCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Тип</Label>
              <Select value={type} onValueChange={(v) => setType(v as 'reels' | 'vsl' | 'story' | 'shorts')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {scenarioTypes.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Хронометраж: ~{scenes.length * 8}с
              </Label>
            </div>
          </div>

          {/* Voice */}
          <div className="glass-card p-4 space-y-4">
            <h3 className="font-medium text-sm">Озвучка</h3>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Голос</Label>
              <Select value={voice} onValueChange={setVoice}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {voiceOptions.map((v) => (
                    <SelectItem key={v.value} value={v.value}>
                      {v.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Скорость: {speed[0]}x</Label>
              <Slider value={speed} onValueChange={setSpeed} min={0.5} max={1.5} step={0.1} />
            </div>
          </div>

          {/* Visual */}
          <div className="glass-card p-4 space-y-4">
            <h3 className="font-medium text-sm">Визуал</h3>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Музыка</Label>
              <Select value={music} onValueChange={setMusic}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {musicOptions.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm">Титры</Label>
              <Switch checked={subtitles} onCheckedChange={setSubtitles} />
            </div>

            {subtitles && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Стиль титров</Label>
                <Select value={subtitleStyle} onValueChange={setSubtitleStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {subtitleStyles.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="glass-card p-4 space-y-3">
            <h3 className="font-medium text-sm">CTA в ленте</h3>
            <Textarea
              value={ctaPrompt}
              onChange={(e) => setCtaPrompt(e.target.value)}
              placeholder="Промпт для начала чата после просмотра..."
              rows={2}
            />
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Button className="w-full" onClick={() => setGenerateDialogOpen(true)}>
              <Play className="h-4 w-4 mr-2" />
              Сгенерировать видео
            </Button>
            <Button variant="outline" className="w-full" onClick={handleSaveDraft}>
              <Save className="h-4 w-4 mr-2" />
              Сохранить черновик
            </Button>
          </div>
        </div>
      </div>

      {/* Generation Dialog */}
      <Dialog open={generateDialogOpen} onOpenChange={setGenerateDialogOpen}>
        <DialogContent className="max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Генерация видео</DialogTitle>
            <DialogDescription>
              Создаём видео на основе вашего сценария
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Прогресс генерации</span>
                <span>{generatingProgress}%</span>
              </div>
              <Progress value={generatingProgress} />
            </div>

            <div className="space-y-2">
              {scenes.map((scene, index) => (
                <div
                  key={scene.id}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-lg',
                    generatingProgress > index * (100 / scenes.length)
                      ? 'bg-primary/10'
                      : 'bg-muted/50'
                  )}
                >
                  <span className="text-sm">Сцена {index + 1}</span>
                  <StatusBadge
                    status={
                      generatingProgress > (index + 1) * (100 / scenes.length)
                        ? 'success'
                        : generatingProgress > index * (100 / scenes.length)
                        ? 'in_progress'
                        : 'pending'
                    }
                    label={
                      generatingProgress > (index + 1) * (100 / scenes.length)
                        ? 'Готово'
                        : generatingProgress > index * (100 / scenes.length)
                        ? 'Генерация...'
                        : 'Ожидание'
                    }
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Стоимость генерации</span>
              <span className="font-medium">$0.{(scenes.length * 4).toString().padStart(2, '0')}</span>
            </div>
          </div>

          <DialogFooter>
            {!isGenerating && generatingProgress === 0 && (
              <Button onClick={handleStartGeneration}>Начать генерацию</Button>
            )}
            {generatingProgress === 100 && (
              <>
                <Button variant="outline" onClick={() => setGenerateDialogOpen(false)}>
                  Закрыть
                </Button>
                <Button>
                  <Send className="h-4 w-4 mr-2" />
                  Опубликовать
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
