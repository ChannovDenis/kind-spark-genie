import { Link, useNavigate } from 'react-router-dom';
import { 
  Play, 
  Loader, 
  FileEdit, 
  Eye, 
  TrendingUp,
  Sparkles,
  FileText,
  Youtube,
  Send,
  MessageCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MetricCard } from '@/components/shared/MetricCard';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge, type Status } from '@/components/shared/StatusBadge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { mockRecentVideos } from '@/data/studioScenariosData';

const statusConfig: Record<string, { label: string; status: Status }> = {
  draft: { label: 'Черновик', status: 'pending' },
  generating: { label: 'Генерация', status: 'in_progress' },
  ready: { label: 'Готов', status: 'success' },
  published: { label: 'Опубликован', status: 'completed' },
};

const ChannelIcon = ({ channel }: { channel: string }) => {
  const iconClass = "h-3 w-3";
  switch (channel) {
    case 'youtube':
      return <Youtube className={cn(iconClass, "text-destructive")} />;
    case 'telegram':
      return <Send className={cn(iconClass, "text-primary")} />;
    case 'vk':
      return <MessageCircle className={cn(iconClass, "text-primary")} />;
    case 'app':
      return (
        <div className="h-3 w-3 rounded bg-primary/20 flex items-center justify-center text-[8px] font-bold text-primary">
          A
        </div>
      );
    default:
      return null;
  }
};

const quickActions = [
  {
    title: 'Из тренда',
    description: 'Создать видео на основе популярного тренда',
    icon: TrendingUp,
    href: '/studio/trends',
  },
  {
    title: 'По шаблону',
    description: 'Выбрать готовый сценарий из библиотеки',
    icon: FileText,
    href: '/studio/scenarios',
  },
  {
    title: 'VSL с аватаром',
    description: 'Продающее видео с AI-аватаром',
    icon: Sparkles,
    href: '/studio/scenarios?type=vsl',
  },
];

export default function StudioDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Контент-студия"
        description="Генерация и управление AI-видео для клиентов"
      />

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Опубликовано сегодня"
          value="4"
          change={2}
          changeLabel="vs вчера"
          icon={<Play className="h-5 w-5" />}
        />
        <MetricCard
          title="В генерации"
          value="2"
          icon={<Loader className="h-5 w-5 animate-spin" />}
        />
        <MetricCard
          title="Черновики"
          value="7"
          icon={<FileEdit className="h-5 w-5" />}
        />
        <MetricCard
          title="Просмотры (неделя)"
          value="12 340"
          change={18}
          changeLabel="vs прошлая"
          icon={<Eye className="h-5 w-5" />}
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Быстрые действия</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link key={action.title} to={action.href}>
              <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <action.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">{action.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Videos */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Последние ролики</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/studio/feed')}>
            Все ролики
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockRecentVideos.map((video) => (
            <div
              key={video.id}
              className="glass-card overflow-hidden group cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
              onClick={() => video.status === 'published' && navigate(`/studio/video/${video.id}`)}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-muted overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Channel icons */}
                {video.channels.length > 0 && (
                  <div className="absolute top-2 left-2 flex gap-1">
                    {video.channels.map((channel) => (
                      <div key={channel} className="h-5 w-5 rounded bg-background/80 flex items-center justify-center">
                        <ChannelIcon channel={channel} />
                      </div>
                    ))}
                  </div>
                )}

                {/* Generating overlay */}
                {video.status === 'generating' && video.progress !== undefined && (
                  <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center gap-2">
                    <Loader className="h-6 w-6 animate-spin text-primary" />
                    <div className="w-3/4">
                      <Progress value={video.progress} className="h-2" />
                    </div>
                    <span className="text-xs text-muted-foreground">{video.progress}%</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3">
                <h3 className="font-medium text-sm line-clamp-1 mb-2">{video.title}</h3>
                <StatusBadge
                  status={statusConfig[video.status].status}
                  label={statusConfig[video.status].label}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
