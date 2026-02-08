import { Play, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrainingBatch } from '@/data/trainingData';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface TrainingBatchCardProps {
  batch: TrainingBatch;
  onStart?: (batch: TrainingBatch) => void;
}

const statusConfig = {
  draft: { label: 'Черновик', icon: Clock, className: 'bg-muted text-muted-foreground' },
  ready: { label: 'Готов', icon: Play, className: 'bg-primary/10 text-primary' },
  training: { label: 'Обучение', icon: Loader2, className: 'bg-warning/10 text-warning' },
  completed: { label: 'Завершён', icon: CheckCircle, className: 'bg-green-500/10 text-green-600' },
  failed: { label: 'Ошибка', icon: XCircle, className: 'bg-destructive/10 text-destructive' },
};

export function TrainingBatchCard({ batch, onStart }: TrainingBatchCardProps) {
  const status = statusConfig[batch.status];
  const StatusIcon = status.icon;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium truncate">{batch.name}</h4>
            <p className="text-sm text-muted-foreground">
              {batch.casesCount} кейсов • {format(new Date(batch.createdAt), 'd MMM yyyy', { locale: ru })}
            </p>
          </div>
          <Badge className={cn("shrink-0", status.className)}>
            <StatusIcon className={cn("h-3 w-3 mr-1", batch.status === 'training' && "animate-spin")} />
            {status.label}
          </Badge>
        </div>

        {batch.status === 'training' && batch.progress !== undefined && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Прогресс</span>
              <span>{batch.progress}%</span>
            </div>
            <Progress value={batch.progress} className="h-2" />
          </div>
        )}

        {batch.status === 'completed' && batch.metrics && (
          <div className="grid grid-cols-2 gap-3 mb-3 p-2 bg-muted/50 rounded-md">
            <div className="text-center">
              <p className="text-lg font-semibold text-primary">{Math.round(batch.metrics.accuracy * 100)}%</p>
              <p className="text-xs text-muted-foreground">Точность</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-primary">+{Math.round(batch.metrics.improvement * 100)}%</p>
              <p className="text-xs text-muted-foreground">Улучшение</p>
            </div>
          </div>
        )}

        {batch.status === 'ready' && onStart && (
          <Button className="w-full" size="sm" onClick={() => onStart(batch)}>
            <Play className="h-4 w-4 mr-2" />
            Запустить обучение
          </Button>
        )}

        {batch.completedAt && (
          <p className="text-xs text-muted-foreground text-center">
            Завершён {format(new Date(batch.completedAt), 'd MMM yyyy, HH:mm', { locale: ru })}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
