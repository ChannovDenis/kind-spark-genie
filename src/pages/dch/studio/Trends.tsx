import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  mockTrendVideos, 
  mockTrendSources, 
  TrendVideo, 
  niches,
  platformLabels,
} from '@/data/studioData';
import { PageHeader } from '@/components/shared/PageHeader';
import { TrendVideoCard } from '@/components/studio/TrendVideoCard';
import { TrendAnalysisPanel } from '@/components/studio/TrendAnalysisPanel';
import { TrendSourcesDialog } from '@/components/studio/TrendSourcesDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Search, TrendingUp, Zap, Target, Bookmark } from 'lucide-react';
import { toast } from 'sonner';

type Platform = 'youtube' | 'tiktok' | 'instagram';

export default function Trends() {
  const navigate = useNavigate();
  const [selectedVideo, setSelectedVideo] = useState<TrendVideo | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['youtube', 'tiktok']);
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [period, setPeriod] = useState('7d');
  const [minViews, setMinViews] = useState('100000');

  const togglePlatform = (platform: Platform) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const toggleNiche = (niche: string) => {
    setSelectedNiches(prev => 
      prev.includes(niche) 
        ? prev.filter(n => n !== niche)
        : [...prev, niche]
    );
  };

  const filteredVideos = mockTrendVideos.filter(video => {
    // Platform filter
    if (!selectedPlatforms.includes(video.platform)) return false;
    
    // Niche filter
    if (selectedNiches.length > 0 && !selectedNiches.includes(video.niche)) return false;
    
    // Min views filter
    if (video.views < parseInt(minViews)) return false;
    
    // Search filter
    if (searchQuery && !video.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    return true;
  });

  const handleUseAsTemplate = (video: TrendVideo) => {
    navigate('/studio/generator', { 
      state: { 
        templateFrom: video.id,
        topic: video.title,
        hookType: video.hookType,
        hookText: video.hookText,
      } 
    });
    toast.success('Переход в генератор с шаблоном');
  };

  // Stats for the header
  const avgHookRate = Math.round(
    mockTrendVideos.reduce((sum, v) => sum + v.hookRate, 0) / mockTrendVideos.length
  );
  const topGrowth = Math.max(...mockTrendVideos.map(v => v.viewsGrowth24h));

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Мониторинг трендов"
        description="Анализ вирусных видео для создания хайпового контента"
        actions={
          <div className="flex items-center gap-2">
            <TrendSourcesDialog />
            <Button variant="outline" onClick={() => navigate('/studio')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад к видео
            </Button>
          </div>
        }
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{mockTrendVideos.length}</div>
              <div className="text-xs text-muted-foreground">Трендов за неделю</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Zap className="h-5 w-5 text-success" />
            </div>
            <div>
              <div className="text-2xl font-bold">+{topGrowth}%</div>
              <div className="text-xs text-muted-foreground">Макс. рост за 24ч</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Target className="h-5 w-5 text-warning" />
            </div>
            <div>
              <div className="text-2xl font-bold">{avgHookRate}%</div>
              <div className="text-xs text-muted-foreground">Ср. Hook Rate</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
              <Bookmark className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <div className="text-2xl font-bold">{mockTrendSources.filter(s => s.isActive).length}</div>
              <div className="text-xs text-muted-foreground">Активных источников</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="top" className="space-y-4">
        <TabsList>
          <TabsTrigger value="top">🔥 Топ недели</TabsTrigger>
          <TabsTrigger value="hooks">🎣 Лучшие хуки</TabsTrigger>
          <TabsTrigger value="niches">📊 По нишам</TabsTrigger>
          <TabsTrigger value="sources">📌 Мои источники</TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Поиск по названию..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Platform Filters */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Платформа</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {(['youtube', 'tiktok', 'instagram'] as Platform[]).map((platform) => (
                  <div key={platform} className="flex items-center space-x-2">
                    <Checkbox 
                      id={platform}
                      checked={selectedPlatforms.includes(platform)}
                      onCheckedChange={() => togglePlatform(platform)}
                    />
                    <Label htmlFor={platform} className="text-sm cursor-pointer">
                      {platformLabels[platform]}
                    </Label>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Niche Filters */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Ниша</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {niches.map((niche) => (
                  <div key={niche.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={niche.id}
                      checked={selectedNiches.includes(niche.id)}
                      onCheckedChange={() => toggleNiche(niche.id)}
                    />
                    <Label htmlFor={niche.id} className="text-sm cursor-pointer">
                      {niche.emoji} {niche.name}
                    </Label>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Period & Views */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Фильтры</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Период</Label>
                  <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">Последние 24ч</SelectItem>
                      <SelectItem value="7d">Последние 7 дней</SelectItem>
                      <SelectItem value="30d">Последние 30 дней</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Мин. просмотры</Label>
                  <Select value={minViews} onValueChange={setMinViews}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10000">&gt; 10K</SelectItem>
                      <SelectItem value="50000">&gt; 50K</SelectItem>
                      <SelectItem value="100000">&gt; 100K</SelectItem>
                      <SelectItem value="500000">&gt; 500K</SelectItem>
                      <SelectItem value="1000000">&gt; 1M</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <TabsContent value="top" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Video Grid */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">
                      {filteredVideos.length} видео
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4 max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
                    {filteredVideos.map((video) => (
                      <TrendVideoCard 
                        key={video.id}
                        video={video}
                        isSelected={selectedVideo?.id === video.id}
                        onSelect={setSelectedVideo}
                      />
                    ))}
                    {filteredVideos.length === 0 && (
                      <div className="text-center py-12 text-muted-foreground">
                        Нет видео по заданным фильтрам
                      </div>
                    )}
                  </div>
                </div>

                {/* Analysis Panel */}
                <div className="lg:sticky lg:top-4">
                  <TrendAnalysisPanel 
                    video={selectedVideo}
                    onUseAsTemplate={handleUseAsTemplate}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="hooks" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {[...mockTrendVideos]
                  .sort((a, b) => b.hookRate - a.hookRate)
                  .slice(0, 6)
                  .map((video) => (
                    <TrendVideoCard 
                      key={video.id}
                      video={video}
                      isSelected={selectedVideo?.id === video.id}
                      onSelect={setSelectedVideo}
                      onUseAsTemplate={handleUseAsTemplate}
                    />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="niches" className="mt-0">
              <div className="space-y-6">
                {niches.map((niche) => {
                  const nicheVideos = mockTrendVideos.filter(v => v.niche === niche.id);
                  if (nicheVideos.length === 0) return null;
                  
                  return (
                    <div key={niche.id}>
                      <h3 className="font-medium mb-3 flex items-center gap-2">
                        <span>{niche.emoji}</span>
                        {niche.name}
                        <span className="text-sm text-muted-foreground">({nicheVideos.length})</span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {nicheVideos.map((video) => (
                          <TrendVideoCard 
                            key={video.id}
                            video={video}
                            isSelected={selectedVideo?.id === video.id}
                            onSelect={setSelectedVideo}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="sources" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Мои источники трендов</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockTrendSources.map((source) => (
                      <div 
                        key={source.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-border"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`h-2 w-2 rounded-full ${source.isActive ? 'bg-success' : 'bg-muted'}`} />
                          <span className="font-medium">{source.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {platformLabels[source.platform]}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {source.type === 'channel' ? 'Канал' : source.type === 'hashtag' ? 'Хештег' : 'Ключевое слово'}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <TrendSourcesDialog 
                      trigger={
                        <Button variant="outline" className="w-full">
                          Управление источниками
                        </Button>
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
