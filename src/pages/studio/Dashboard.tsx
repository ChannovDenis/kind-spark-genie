import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Video, 
  Play, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  Plus,
  MoreVertical,
  Eye,
  Download,
  Trash2,
  Filter,
  Search,
  Target,
  Zap,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MetricCard } from '@/components/shared/MetricCard';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RetentionFunnel } from '@/components/studio/RetentionFunnel';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { 
  mockVideosWithRetention, 
  calculateAverageRetention, 
  getTopPerformers, 
  getBottomPerformers,
  retentionBenchmarks 
} from '@/data/studioData';

const statusConfig = {
  ready: { label: 'Готов', status: 'success' as const },
  processing: { label: 'Генерация...', status: 'in_progress' as const },
  error: { label: 'Ошибка', status: 'error' as const },
};

export default function StudioDashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleRetry = (id: number) => {
    toast.success(`Перезапуск генерации видео #${id}`);
  };

  const filteredVideos = mockVideosWithRetention.filter(video => 
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate average retention metrics
  const avgRetention = calculateAverageRetention(mockVideosWithRetention);
  const topPerformers = getTopPerformers(mockVideosWithRetention);
  const bottomPerformers = getBottomPerformers(mockVideosWithRetention);

  const getHookRateColor = (rate: number) => {
    if (rate >= retentionBenchmarks.hookRate) return 'text-success';
    if (rate >= retentionBenchmarks.hookRate - 10) return 'text-warning';
    return 'text-destructive';
  };

  const getRetentionProgressColor = (rate: number) => {
    if (rate >= retentionBenchmarks.hookRate) return '[&>div]:bg-success';
    if (rate >= retentionBenchmarks.hookRate - 10) return '[&>div]:bg-warning';
    return '[&>div]:bg-destructive';
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Контент-студия"
        description="Генерация и управление AI-видео для клиентов"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate('/studio/trends')}>
              <TrendingUp className="h-4 w-4 mr-2" />
              Тренды
            </Button>
            <Button onClick={() => navigate('/studio/generator')}>
              <Plus className="h-4 w-4 mr-2" />
              Создать видео
            </Button>
          </div>
        }
      />

      {/* Metrics - Updated with Retention */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <MetricCard
          title="Всего видео"
          value="156"
          change={12}
          changeLabel="за неделю"
          icon={<Video className="h-5 w-5" />}
        />
        <MetricCard
          title="Просмотров"
          value="89.4K"
          change={18.5}
          changeLabel="за неделю"
          icon={<Eye className="h-5 w-5" />}
        />
        <MetricCard
          title="Ср. Retention"
          value={`${avgRetention.hookRate}%`}
          change={avgRetention.hookRate - retentionBenchmarks.hookRate}
          changeLabel="vs бенчмарк"
          icon={<Target className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="Hook Rate"
          value={`${avgRetention.hookRate}%`}
          change={4}
          changeLabel="за месяц"
          icon={<Zap className="h-5 w-5 text-warning" />}
        />
        <MetricCard
          title="Ср. время"
          value="2.5 мин"
          change={-15}
          changeLabel="ускорение"
          icon={<Clock className="h-5 w-5" />}
        />
      </div>

      {/* Retention Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Retention Funnel */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Воронка удержания
              </CardTitle>
              <span className="text-xs text-muted-foreground">За 7 дней</span>
            </div>
          </CardHeader>
          <CardContent>
            <RetentionFunnel 
              hookRate={avgRetention.hookRate}
              retention10s={avgRetention.retention10s}
              retention30s={avgRetention.retention30s}
              completionRate={avgRetention.completionRate}
            />
          </CardContent>
        </Card>

        {/* Top / Bottom Performers */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Топ и требуют улучшения</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-success mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Лучшие по удержанию
              </h4>
              <div className="space-y-2">
                {topPerformers.map((video, idx) => (
                  <div 
                    key={video.id}
                    className="flex items-center justify-between p-2 rounded bg-success/10 cursor-pointer hover:bg-success/20 transition-colors"
                    onClick={() => navigate(`/studio/video/${video.id}`)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-4">{idx + 1}.</span>
                      <span className="text-sm truncate max-w-[200px]">{video.title}</span>
                    </div>
                    <span className="text-sm font-semibold text-success">{video.hookRate}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-destructive mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Требуют улучшения
              </h4>
              <div className="space-y-2">
                {bottomPerformers.map((video, idx) => (
                  <div 
                    key={video.id}
                    className="flex items-center justify-between p-2 rounded bg-destructive/10 cursor-pointer hover:bg-destructive/20 transition-colors"
                    onClick={() => navigate(`/studio/video/${video.id}`)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-4">{idx + 1}.</span>
                      <span className="text-sm truncate max-w-[200px]">{video.title}</span>
                    </div>
                    <span className="text-sm font-semibold text-destructive">{video.hookRate}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Поиск видео..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Фильтры
        </Button>
      </div>

      {/* Video Grid - Updated with Retention */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVideos.map((video) => (
          <div 
            key={video.id}
            className="glass-card overflow-hidden group cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
            onClick={() => video.status === 'ready' && navigate(`/studio/video/${video.id}`)}
          >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-muted overflow-hidden">
              <img 
                src={video.thumbnail} 
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Duration Badge */}
              <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/70 text-white text-xs font-mono">
                {video.duration}
              </div>

              {/* Status Overlay for processing/error */}
              {video.status !== 'ready' && (
                <div className={cn(
                  "absolute inset-0 flex items-center justify-center",
                  video.status === 'processing' && "bg-black/50",
                  video.status === 'error' && "bg-destructive/30"
                )}>
                  {video.status === 'processing' && (
                    <div className="flex flex-col items-center gap-2 text-white">
                      <div className="h-8 w-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm">Генерация...</span>
                    </div>
                  )}
                  {video.status === 'error' && (
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="h-8 w-8 text-destructive" />
                      <Button size="sm" variant="secondary" onClick={(e) => {
                        e.stopPropagation();
                        handleRetry(video.id);
                      }}>
                        Повторить
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Play Button on Hover */}
              {video.status === 'ready' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center">
                    <Play className="h-6 w-6 text-primary-foreground ml-1" />
                  </div>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm line-clamp-2 leading-tight mb-1">
                    {video.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{video.service}</span>
                    <span>•</span>
                    <span>
                      {new Date(video.createdAt).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </span>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate(`/studio/video/${video.id}`)}>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Аналитика
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      Просмотреть
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="h-4 w-4 mr-2" />
                      Скачать
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Удалить
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Stats & Status */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  <span>{video.views.toLocaleString('ru-RU')}</span>
                </div>
                <StatusBadge 
                  status={statusConfig[video.status].status} 
                  label={statusConfig[video.status].label} 
                />
              </div>

              {/* Retention Bar - NEW */}
              {video.status === 'ready' && video.hookRate > 0 && (
                <div className="mt-3 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Retention</span>
                    <span className={cn("font-medium", getHookRateColor(video.hookRate))}>
                      {video.hookRate}%
                    </span>
                  </div>
                  <Progress 
                    value={video.hookRate} 
                    className={cn("h-1.5", getRetentionProgressColor(video.hookRate))}
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Hook: {video.hookRate}%</span>
                    <span>@10s: {video.retention10s}%</span>
                  </div>
                </div>
              )}

              {/* Error message */}
              {video.error && (
                <div className="mt-2 p-2 rounded bg-destructive/10 text-xs text-destructive">
                  {video.error}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
