import { Check, X, Edit, Keyboard, ToggleLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { 
  TrainingCase, 
  errorCategoryLabels, 
  errorCategoryColors,
  serviceLabels,
  CaseRating
} from '@/data/trainingData';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useState } from 'react';
import { SideBySideComparison } from './SideBySideComparison';
import { DialogContext } from './DialogContext';
import { QualityRatingScale } from './QualityRatingScale';
import { KeyboardShortcut } from '@/hooks/useKeyboardShortcuts';
import { KeyboardShortcutsHelp } from './KeyboardShortcutsHelp';

interface TrainingCaseDetailProps {
  trainingCase: TrainingCase | null;
  onApprove: (trainingCase: TrainingCase) => void;
  onReject: (trainingCase: TrainingCase) => void;
  onEdit: (trainingCase: TrainingCase) => void;
  shortcuts?: KeyboardShortcut[];
}

export function TrainingCaseDetail({ 
  trainingCase, 
  onApprove, 
  onReject,
  onEdit,
  shortcuts = []
}: TrainingCaseDetailProps) {
  const [showDiff, setShowDiff] = useState(true);
  const [ratings, setRatings] = useState<CaseRating | undefined>(trainingCase?.ratings);

  if (!trainingCase) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground p-8">
        <div className="text-center">
          <p className="text-lg mb-2">Выберите кейс</p>
          <p className="text-sm">Кликните на кейс слева для просмотра деталей</p>
          {shortcuts.length > 0 && (
            <div className="mt-6 p-4 bg-muted/50 rounded-lg text-left">
              <KeyboardShortcutsHelp shortcuts={shortcuts} />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Header with actions */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={cn("border", errorCategoryColors[trainingCase.errorCategory])}>
                {errorCategoryLabels[trainingCase.errorCategory]}
              </Badge>
              <Badge variant="outline">
                {serviceLabels[trainingCase.service]}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Диалог #{trainingCase.dialogId} • {format(new Date(trainingCase.createdAt), 'd MMMM yyyy, HH:mm', { locale: ru })}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Keyboard shortcuts help */}
            {shortcuts.length > 0 && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Keyboard className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64" align="end">
                  <KeyboardShortcutsHelp shortcuts={shortcuts} />
                </PopoverContent>
              </Popover>
            )}

            {trainingCase.status === 'pending' && (
              <>
                <Button variant="outline" size="sm" onClick={() => onReject(trainingCase)}>
                  <X className="h-4 w-4 mr-1" />
                  Отклонить
                  <kbd className="ml-2 text-xs opacity-50">R</kbd>
                </Button>
                <Button size="sm" onClick={() => onApprove(trainingCase)}>
                  <Check className="h-4 w-4 mr-1" />
                  Одобрить
                  <kbd className="ml-2 text-xs opacity-50">A</kbd>
                </Button>
              </>
            )}
          </div>
        </div>

        <Separator />

        {/* Dialog Context */}
        {trainingCase.contextMessages.length > 0 && (
          <DialogContext
            messages={trainingCase.contextMessages}
            currentMessage={trainingCase.userMessage}
          />
        )}

        {/* User Message */}
        <div>
          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">👤</span>
            Сообщение пользователя
          </h3>
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm">{trainingCase.userMessage}</p>
          </div>
        </div>

        {/* Error Description */}
        <div>
          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-warning/10 flex items-center justify-center text-xs">⚠️</span>
            Описание ошибки
          </h3>
          <div className="bg-warning/5 border border-warning/20 rounded-lg p-4">
            <p className="text-sm">{trainingCase.errorDescription}</p>
          </div>
        </div>

        {/* Toggle for diff view */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Сравнение ответов</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Подсветка изменений</span>
            <Switch checked={showDiff} onCheckedChange={setShowDiff} />
          </div>
        </div>

        {/* Side-by-Side Comparison */}
        <SideBySideComparison
          originalResponse={trainingCase.aiResponse}
          correctedResponse={trainingCase.correctedResponse}
          confidenceScore={trainingCase.confidenceScore}
          showDiff={showDiff}
        />

        {/* Edit button */}
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={() => onEdit(trainingCase)}>
            <Edit className="h-3 w-3 mr-1" />
            Редактировать исправление
            <kbd className="ml-2 text-xs opacity-50">E</kbd>
          </Button>
        </div>

        <Separator />

        {/* Quality Rating */}
        <QualityRatingScale
          ratings={ratings || trainingCase.ratings}
          onChange={setRatings}
          readonly={trainingCase.status !== 'pending'}
        />

        <Separator />

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Создал</p>
            <p className="font-medium">{trainingCase.createdBy}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Дата создания</p>
            <p className="font-medium">
              {format(new Date(trainingCase.createdAt), 'd MMM yyyy, HH:mm', { locale: ru })}
            </p>
          </div>
          {trainingCase.reviewedBy && (
            <>
              <div>
                <p className="text-muted-foreground">Проверил</p>
                <p className="font-medium">{trainingCase.reviewedBy}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Дата проверки</p>
                <p className="font-medium">
                  {trainingCase.reviewedAt && format(new Date(trainingCase.reviewedAt), 'd MMM yyyy, HH:mm', { locale: ru })}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Tags */}
        {trainingCase.tags.length > 0 && (
          <div>
            <p className="text-sm text-muted-foreground mb-2">Теги</p>
            <div className="flex flex-wrap gap-1">
              {trainingCase.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
