import { Check, X, Edit, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { 
  TrainingCase, 
  errorCategoryLabels, 
  errorCategoryColors,
  serviceLabels 
} from '@/data/trainingData';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface TrainingCaseDetailProps {
  trainingCase: TrainingCase | null;
  onApprove: (trainingCase: TrainingCase) => void;
  onReject: (trainingCase: TrainingCase) => void;
  onEdit: (trainingCase: TrainingCase) => void;
}

export function TrainingCaseDetail({ 
  trainingCase, 
  onApprove, 
  onReject,
  onEdit 
}: TrainingCaseDetailProps) {
  if (!trainingCase) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground p-8">
        <div className="text-center">
          <p className="text-lg mb-2">Выберите кейс</p>
          <p className="text-sm">Кликните на кейс слева для просмотра деталей</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Header */}
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
          
          {trainingCase.status === 'pending' && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onReject(trainingCase)}>
                <X className="h-4 w-4 mr-1" />
                Отклонить
              </Button>
              <Button size="sm" onClick={() => onApprove(trainingCase)}>
                <Check className="h-4 w-4 mr-1" />
                Одобрить
              </Button>
            </div>
          )}
        </div>

        <Separator />

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

        {/* AI Response (with error) */}
        <div>
          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center text-xs">🤖</span>
            Ответ AI 
            <Badge variant="destructive" className="text-xs">С ошибкой</Badge>
          </h3>
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
            <p className="text-sm">{trainingCase.aiResponse}</p>
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

        {/* Arrow */}
        <div className="flex justify-center">
          <ArrowRight className="h-6 w-6 text-primary rotate-90" />
        </div>

        {/* Corrected Response */}
        <div>
          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">✨</span>
            Исправленный ответ
            <Button variant="ghost" size="sm" className="ml-auto h-6" onClick={() => onEdit(trainingCase)}>
              <Edit className="h-3 w-3 mr-1" />
              Редактировать
            </Button>
          </h3>
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <p className="text-sm whitespace-pre-wrap">{trainingCase.correctedResponse}</p>
          </div>
        </div>

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
