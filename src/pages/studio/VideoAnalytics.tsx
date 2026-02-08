import { useParams, useNavigate } from 'react-router-dom';
import { 
  mockVideosWithRetention, 
  retentionBenchmarks,
  VideoWithRetention 
} from '@/data/studioData';
import { PageHeader } from '@/components/shared/PageHeader';
import { RetentionChart } from '@/components/studio/RetentionChart';
import { RetentionFunnel } from '@/components/studio/RetentionFunnel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Download, 
  Play, 
  Clock, 
  Eye, 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  Target,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function VideoAnalytics() {
  const { id } = useParams();
  const navigate = useNavigate();

  const video = mockVideosWithRetention.find(v => v.id === parseInt(id || '0'));

  if (!video) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-xl font-semibold mb-2">Видео не найдено</h2>
        <Button onClick={() => navigate('/studio')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад к видео
        </Button>
      </div>
    );
  }

  const getComparisonColor = (value: number, benchmark: number) => {
    const diff = value - benchmark;
    if (diff >= 5) return 'text-success';
    if (diff >= -5) return 'text-warning';
    return 'text-destructive';
  };

  const getComparisonIcon = (value: number, benchmark: number) => {
    const diff = value - benchmark;
    if (diff >= 0) return <TrendingUp className="h-4 w-4 text-success" />;
    return <TrendingDown className="h-4 w-4 text-destructive" />;
  };

  // Calculate comparison with benchmark
  const retentionDiff = video.hookRate - retentionBenchmarks.hookRate;
  const nicheBenchmark = 58; // Mock niche average
  const top10Benchmark = 82; // Mock top 10%

  return (
    <div className="space-y-6">
      <PageHeader 
        title={video.title}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Скачать
            </Button>
            <Button variant="outline" onClick={() => navigate('/studio')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Video & Info */}
        <div className="space-y-4">
          {/* Video Preview */}
          <Card>
            <CardContent className="p-0">
              <div className="relative aspect-video bg-muted overflow-hidden rounded-t-lg">
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                    <Play className="h-6 w-6 text-primary-foreground ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/70 text-white text-xs font-mono">
                  {video.duration}
                </div>
              </div>
              
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge>{video.service}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {new Date(video.createdAt).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    {video.views.toLocaleString('ru-RU')} просмотров
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {video.avgWatchTime} ср. время
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Ключевые метрики
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Hook Rate (0-3s)</span>
                <div className="flex items-center gap-2">
                  <span className={cn("font-semibold", getComparisonColor(video.hookRate, retentionBenchmarks.hookRate))}>
                    {video.hookRate}%
                  </span>
                  {getComparisonIcon(video.hookRate, retentionBenchmarks.hookRate)}
                  <span className={cn("text-xs", retentionDiff >= 0 ? "text-success" : "text-destructive")}>
                    {retentionDiff >= 0 ? '+' : ''}{retentionDiff}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Retention @10s</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{video.retention10s}%</span>
                  {getComparisonIcon(video.retention10s, retentionBenchmarks.retention10s)}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Retention @30s</span>
                <span className="font-semibold">{video.retention30s}%</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Avg Watch Time</span>
                <span className="font-semibold">{video.avgWatchTime}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Completion Rate</span>
                <span className="font-semibold">{video.completionRate}%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Charts */}
        <div className="lg:col-span-2 space-y-4">
          {/* Retention Curve */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4" />
                График удержания (Retention Curve)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RetentionChart 
                data={video.retentionCurve}
                dropOffPoints={video.dropOffPoints}
                height={250}
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Retention Funnel */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Воронка удержания
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RetentionFunnel 
                  hookRate={video.hookRate}
                  retention10s={video.retention10s}
                  retention30s={video.retention30s}
                  completionRate={video.completionRate}
                />
              </CardContent>
            </Card>

            {/* Benchmark Comparison */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Сравнение с бенчмарком</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Ваш Retention</span>
                    <span className="font-semibold">{video.hookRate}%</span>
                  </div>
                  <Progress value={video.hookRate} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Среднее по нише</span>
                    <span className="font-semibold text-muted-foreground">{nicheBenchmark}%</span>
                  </div>
                  <Progress value={nicheBenchmark} className="h-2 [&>div]:bg-muted-foreground" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Топ 10%</span>
                    <span className="font-semibold text-success">{top10Benchmark}%</span>
                  </div>
                  <Progress value={top10Benchmark} className="h-2 [&>div]:bg-success" />
                </div>

                <div className="pt-3 border-t border-border">
                  <div className={cn(
                    "flex items-center justify-center gap-2 text-lg font-semibold",
                    video.hookRate > nicheBenchmark ? "text-success" : "text-destructive"
                  )}>
                    {video.hookRate > nicheBenchmark ? (
                      <>
                        <TrendingUp className="h-5 w-5" />
                        +{video.hookRate - nicheBenchmark}% к среднему
                      </>
                    ) : (
                      <>
                        <TrendingDown className="h-5 w-5" />
                        {video.hookRate - nicheBenchmark}% к среднему
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
