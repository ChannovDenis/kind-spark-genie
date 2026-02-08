import { Check, X, Clock, Sparkles, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { 
  TrainingCase, 
  errorCategoryLabels, 
  errorCategoryColors,
  serviceLabels 
} from '@/data/trainingData';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { DialogContextBadge } from './DialogContext';
import { CompactRating } from './QualityRatingScale';

interface TrainingCaseCardProps {
  trainingCase: TrainingCase;
  onSelect: (trainingCase: TrainingCase) => void;
  onApprove?: (trainingCase: TrainingCase) => void;
  onReject?: (trainingCase: TrainingCase) => void;
  isSelected?: boolean;
  isChecked?: boolean;
  onCheckChange?: (checked: boolean) => void;
  showCheckbox?: boolean;
}

const statusConfig = {
  pending: { label: 'На проверке', icon: Clock, className: 'bg-warning/10 text-warning' },
  approved: { label: 'Одобрен', icon: Check, className: 'bg-primary/10 text-primary' },
  rejected: { label: 'Отклонён', icon: X, className: 'bg-destructive/10 text-destructive' },
  trained: { label: 'Обучен', icon: Sparkles, className: 'bg-green-500/10 text-green-600' },
};

const priorityConfig = {
  critical: { label: 'Критический', className: 'bg-destructive text-destructive-foreground' },
  high: { label: 'Высокий', className: 'bg-warning text-warning-foreground' },
  medium: { label: 'Средний', className: 'bg-secondary text-secondary-foreground' },
  low: { label: 'Низкий', className: 'bg-muted text-muted-foreground' },
};

export function TrainingCaseCard({ 
  trainingCase, 
  onSelect, 
  onApprove, 
  onReject,
  isSelected,
  isChecked = false,
  onCheckChange,
  showCheckbox = false
}: TrainingCaseCardProps) {
  const status = statusConfig[trainingCase.status];
  const priority = priorityConfig[trainingCase.priority];
  const StatusIcon = status.icon;
  const confidencePercent = Math.round(trainingCase.confidenceScore * 100);
  const isHighConfidence = trainingCase.confidenceScore > 0.85;

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        isSelected && "ring-2 ring-primary",
        isChecked && "bg-primary/5"
      )}
      onClick={() => onSelect(trainingCase)}
    >
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {showCheckbox && (
              <Checkbox
                checked={isChecked}
                onCheckedChange={(checked) => {
                  onCheckChange?.(checked as boolean);
                }}
                onClick={(e) => e.stopPropagation()}
                className="mr-1"
              />
            )}
            <Badge className={cn("text-xs", status.className)}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {status.label}
            </Badge>
            <Badge className={cn("text-xs border", errorCategoryColors[trainingCase.errorCategory])}>
              {errorCategoryLabels[trainingCase.errorCategory]}
            </Badge>
            {trainingCase.priority === 'critical' && (
              <Badge className={priority.className}>{priority.label}</Badge>
            )}
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
        </div>

        {/* User message preview */}
        <div className="mb-2">
          <p className="text-xs text-muted-foreground mb-1">Запрос пользователя:</p>
          <p className="text-sm line-clamp-2">{trainingCase.userMessage}</p>
        </div>

        {/* Error description preview */}
        <div className="mb-3">
          <p className="text-xs text-muted-foreground mb-1">Ошибка:</p>
          <p className="text-sm text-destructive line-clamp-2">{trainingCase.errorDescription}</p>
        </div>

        {/* Confidence indicator */}
        <div className="mb-3 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Уверенность AI:</span>
          <Progress 
            value={confidencePercent} 
            className={cn("w-16 h-1.5", isHighConfidence && "[&>div]:bg-warning")} 
          />
          <span className={cn("text-xs", isHighConfidence && "text-warning font-medium")}>
            {confidencePercent}%
          </span>
          {isHighConfidence && (
            <Badge variant="outline" className="text-xs text-warning border-warning/30">
              Приоритет
            </Badge>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {serviceLabels[trainingCase.service]}
            </Badge>
            <span>{format(new Date(trainingCase.createdAt), 'd MMM', { locale: ru })}</span>
            <DialogContextBadge messageCount={trainingCase.contextMessages.length} />
            <CompactRating ratings={trainingCase.ratings} />
          </div>
          
          {trainingCase.status === 'pending' && onApprove && onReject && (
            <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-7 px-2 text-destructive hover:text-destructive"
                onClick={() => onReject(trainingCase)}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-7 px-2 text-primary hover:text-primary"
                onClick={() => onApprove(trainingCase)}
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
