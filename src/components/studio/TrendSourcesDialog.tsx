import { useState } from 'react';
import { TrendSource, platformLabels, mockTrendSources } from '@/data/studioData';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Settings, Plus, Trash2, Youtube, Link2 } from 'lucide-react';
import { toast } from 'sonner';

interface TrendSourcesDialogProps {
  trigger?: React.ReactNode;
}

export function TrendSourcesDialog({ trigger }: TrendSourcesDialogProps) {
  const [sources, setSources] = useState<TrendSource[]>(mockTrendSources);
  const [newSource, setNewSource] = useState({
    type: 'channel' as const,
    platform: 'youtube' as const,
    name: '',
    url: '',
  });
  const [isAdding, setIsAdding] = useState(false);

  const handleToggleSource = (id: string) => {
    setSources(prev =>
      prev.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s)
    );
    toast.success('Источник обновлён');
  };

  const handleDeleteSource = (id: string) => {
    setSources(prev => prev.filter(s => s.id !== id));
    toast.success('Источник удалён');
  };

  const handleAddSource = () => {
    if (!newSource.name.trim()) {
      toast.error('Введите название источника');
      return;
    }

    const source: TrendSource = {
      id: `src-${Date.now()}`,
      type: newSource.type,
      platform: newSource.platform,
      name: newSource.name,
      url: newSource.url || undefined,
      isActive: true,
    };

    setSources(prev => [...prev, source]);
    setNewSource({ type: 'channel', platform: 'youtube', name: '', url: '' });
    setIsAdding(false);
    toast.success('Источник добавлен');
  };

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'channel': return <Youtube className="h-4 w-4" />;
      case 'hashtag': return <span className="text-sm font-bold">#</span>;
      case 'keyword': return <Link2 className="h-4 w-4" />;
      default: return null;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'channel': return 'Канал';
      case 'hashtag': return 'Хештег';
      case 'keyword': return 'Ключевое слово';
      default: return type;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Настройки источников
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Источники трендов</DialogTitle>
          <DialogDescription>
            Настройте каналы, хештеги и ключевые слова для мониторинга трендов
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {/* Existing Sources */}
          {sources.map((source) => (
            <div
              key={source.id}
              className="flex items-center justify-between p-3 rounded-lg border border-border bg-card"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  {getSourceIcon(source.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{source.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {platformLabels[source.platform]}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {getTypeLabel(source.type)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={source.isActive}
                  onCheckedChange={() => handleToggleSource(source.id)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => handleDeleteSource(source.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {/* Add New Source Form */}
          {isAdding ? (
            <div className="p-4 rounded-lg border-2 border-dashed border-primary/50 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Тип</Label>
                  <Select
                    value={newSource.type}
                    onValueChange={(v) => setNewSource(prev => ({ ...prev, type: v as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="channel">Канал</SelectItem>
                      <SelectItem value="hashtag">Хештег</SelectItem>
                      <SelectItem value="keyword">Ключевое слово</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Платформа</Label>
                  <Select
                    value={newSource.platform}
                    onValueChange={(v) => setNewSource(prev => ({ ...prev, platform: v as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Название</Label>
                <Input
                  placeholder="Например: Финансовый Советник"
                  value={newSource.name}
                  onChange={(e) => setNewSource(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              {newSource.type === 'channel' && (
                <div className="space-y-2">
                  <Label>URL (опционально)</Label>
                  <Input
                    placeholder="https://youtube.com/@channel"
                    value={newSource.url}
                    onChange={(e) => setNewSource(prev => ({ ...prev, url: e.target.value }))}
                  />
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button onClick={handleAddSource} className="flex-1">
                  Добавить
                </Button>
                <Button variant="outline" onClick={() => setIsAdding(false)}>
                  Отмена
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full border-dashed"
              onClick={() => setIsAdding(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Добавить источник
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
