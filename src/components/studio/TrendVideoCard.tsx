import { TrendVideo, platformLabels, hookTypeLabels } from '@/data/studioData';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Eye, Clock, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrendVideoCardProps {
  video: TrendVideo;
  isSelected?: boolean;
  onSelect?: (video: TrendVideo) => void;
  onUseAsTemplate?: (video: TrendVideo) => void;
}

const platformBadgeClasses: Record<string, string> = {
  youtube: 'bg-red-500 text-white',
  tiktok: 'bg-black text-white',
  instagram: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
};

export function TrendVideoCard({ video, isSelected, onSelect, onUseAsTemplate }: TrendVideoCardProps) {
  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(0)}K`;
    return views.toString();
  };

  const getHookRateColor = (rate: number) => {
    if (rate >= 80) return 'text-success';
    if (rate >= 70) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden cursor-pointer transition-all hover:ring-2 hover:ring-primary/50",
        isSelected && "ring-2 ring-primary"
      )}
      onClick={() => onSelect?.(video)}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-muted overflow-hidden">
        <img 
          src={video.thumbnail} 
          alt={video.title}
          className="w-full h-full object-cover"
        />
        
        {/* Platform Badge */}
        <Badge 
          className={cn(
            "absolute top-2 left-2 text-xs",
            platformBadgeClasses[video.platform]
          )}
        >
          {platformLabels[video.platform]}
        </Badge>

        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/70 text-white text-xs font-mono">
          {video.duration}
        </div>

        {/* Growth Badge */}
        {video.viewsGrowth24h > 50 && (
          <Badge className="absolute top-2 right-2 bg-success text-success-foreground text-xs">
            <TrendingUp className="h-3 w-3 mr-1" />
            +{video.viewsGrowth24h}%
          </Badge>
        )}
      </div>

      <CardContent className="p-3 space-y-2">
        {/* Title */}
        <h3 className="font-medium text-sm line-clamp-2 leading-tight">
          {video.title}
        </h3>

        {/* Channel & Date */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="truncate">{video.channelName}</span>
          <span>•</span>
          <span className="shrink-0">
            {new Date(video.publishedAt).toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'short'
            })}
          </span>
        </div>

        {/* Hook Rate Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Hook Rate</span>
            <span className={cn("font-medium", getHookRateColor(video.hookRate))}>
              {video.hookRate}%
            </span>
          </div>
          <Progress 
            value={video.hookRate} 
            className="h-1.5"
          />
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {formatViews(video.views)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              @10s: {video.retention10s}%
            </span>
          </div>
          <Badge variant="outline" className="text-xs">
            {hookTypeLabels[video.hookType]}
          </Badge>
        </div>

        {/* Hook Text Preview */}
        <div className="text-xs text-muted-foreground italic line-clamp-2 bg-muted/50 rounded p-2">
          "{video.hookText.substring(0, 60)}..."
        </div>

        {/* Action Button */}
        {onUseAsTemplate && (
          <Button 
            size="sm" 
            variant="secondary" 
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              onUseAsTemplate(video);
            }}
          >
            <Sparkles className="h-3 w-3 mr-1" />
            Использовать как шаблон
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
