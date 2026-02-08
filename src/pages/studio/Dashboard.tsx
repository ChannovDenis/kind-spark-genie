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
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MetricCard } from '@/components/shared/MetricCard';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Mock video data
const recentVideos = [
  {
    id: 1,
    title: 'Как оформить налоговый вычет за лечение',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=225&fit=crop',
    duration: '3:45',
    status: 'ready',
    views: 12453,
    createdAt: '2026-02-08T10:30:00',
    service: 'Юрист',
  },
  {
    id: 2,
    title: 'Первые симптомы диабета: что нужно знать',
    thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=225&fit=crop',
    duration: '4:12',
    status: 'processing',
    views: 0,
    createdAt: '2026-02-08T09:15:00',
    service: 'Врач',
  },
  {
    id: 3,
    title: 'Как справиться с тревожностью: 5 техник',
    thumbnail: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=225&fit=crop',
    duration: '5:30',
    status: 'ready',
    views: 8921,
    createdAt: '2026-02-07T16:45:00',
    service: 'Психолог',
  },
  {
    id: 4,
    title: 'Инвестиции для начинающих: с чего начать',
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=225&fit=crop',
    duration: '6:15',
    status: 'ready',
    views: 15678,
    createdAt: '2026-02-07T14:20:00',
    service: 'Финансист',
  },
  {
    id: 5,
    title: 'Права потребителя при возврате товара',
    thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=225&fit=crop',
    duration: '4:00',
    status: 'error',
    views: 0,
    createdAt: '2026-02-07T11:00:00',
    service: 'Юрист',
    error: 'Ошибка синтеза голоса',
  },
  {
    id: 6,
    title: 'Здоровый сон: рекомендации врача',
    thumbnail: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=225&fit=crop',
    duration: '3:20',
    status: 'ready',
    views: 6234,
    createdAt: '2026-02-06T18:30:00',
    service: 'Врач',
  },
];

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

  const filteredVideos = recentVideos.filter(video => 
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Контент-студия"
        description="Генерация и управление AI-видео для клиентов"
        actions={
          <Button onClick={() => navigate('/studio/generator')}>
            <Plus className="h-4 w-4 mr-2" />
            Создать видео
          </Button>
        }
      />

      {/* Metrics */}
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
          title="В обработке"
          value="3"
          icon={<Clock className="h-5 w-5 text-warning" />}
        />
        <MetricCard
          title="Успешно"
          value="98.2%"
          change={1.2}
          changeLabel="за месяц"
          icon={<CheckCircle className="h-5 w-5 text-success" />}
        />
        <MetricCard
          title="Ср. время"
          value="2.5 мин"
          change={-15}
          changeLabel="ускорение"
          icon={<TrendingUp className="h-5 w-5" />}
        />
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

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVideos.map((video) => (
          <div 
            key={video.id}
            className="glass-card overflow-hidden group cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
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
                      <Button size="sm" variant="secondary" onClick={() => handleRetry(video.id)}>
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
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
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
