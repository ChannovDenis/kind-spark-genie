import { TrendVideo, hookTypeLabels, platformLabels } from '@/data/studioData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Copy, Eye, Clock, TrendingUp, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface TrendAnalysisPanelProps {
  video: TrendVideo | null;
  onUseAsTemplate?: (video: TrendVideo) => void;
}

export function TrendAnalysisPanel({ video, onUseAsTemplate }: TrendAnalysisPanelProps) {
  if (!video) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center py-12">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Eye className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-medium mb-2">Выберите видео для анализа</h3>
          <p className="text-sm text-muted-foreground">
            Кликните на карточку трендового видео слева, чтобы увидеть детальный анализ
          </p>
        </CardContent>
      </Card>
    );
  }

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(0)}K`;
    return views.toString();
  };

  const handleCopyHook = () => {
    navigator.clipboard.writeText(video.hookText);
    toast.success('Хук скопирован в буфер обмена');
  };

  const hookStructure = {
    question: ['Вопрос', 'Интрига', 'Ответ'],
    statement: ['Факт', 'Доказательство', 'Вывод'],
    shock: ['Шок-заявление', 'Контекст', 'Решение'],
    promise: ['Обещание', 'Доказательство', 'CTA'],
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg leading-tight line-clamp-2">
              {video.title}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">{platformLabels[video.platform]}</Badge>
              <span className="text-sm text-muted-foreground">{video.channelName}</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="shrink-0">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Thumbnail Preview */}
        <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
          <img 
            src={video.thumbnail} 
            alt={video.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/70 text-white text-xs font-mono">
            {video.duration}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <Eye className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <div className="text-lg font-semibold">{formatViews(video.views)}</div>
            <div className="text-xs text-muted-foreground">Просмотров</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <TrendingUp className="h-4 w-4 mx-auto mb-1 text-success" />
            <div className="text-lg font-semibold text-success">+{video.viewsGrowth24h}%</div>
            <div className="text-xs text-muted-foreground">За 24ч</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <Clock className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <div className="text-lg font-semibold">{video.duration}</div>
            <div className="text-xs text-muted-foreground">Длина</div>
          </div>
        </div>

        {/* Retention Metrics */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Удержание аудитории</h4>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Hook Rate (0-3 сек)</span>
              <span className="font-semibold text-success">{video.hookRate}%</span>
            </div>
            <Progress value={video.hookRate} className="h-2 [&>div]:bg-success" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Retention @10s</span>
              <span className="font-semibold">{video.retention10s}%</span>
            </div>
            <Progress value={video.retention10s} className="h-2" />
          </div>
        </div>

        {/* Hook Analysis */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Хук (первые 3 сек)</h4>
            <Badge>{hookTypeLabels[video.hookType]}</Badge>
          </div>
          
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm italic">"{video.hookText}"</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Структура:</span>
            {hookStructure[video.hookType].map((step, idx) => (
              <span key={idx} className="flex items-center text-xs">
                <Badge variant="outline" className="text-xs">
                  {step}
                </Badge>
                {idx < hookStructure[video.hookType].length - 1 && (
                  <span className="mx-1 text-muted-foreground">→</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-border">
          <Button 
            className="flex-1"
            onClick={() => onUseAsTemplate?.(video)}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Использовать как шаблон
          </Button>
          <Button variant="outline" onClick={handleCopyHook}>
            <Copy className="h-4 w-4 mr-2" />
            Копировать хук
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
