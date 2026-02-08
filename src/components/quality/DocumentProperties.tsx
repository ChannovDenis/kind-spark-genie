import { Calendar, User, Clock, MessageSquare, TrendingUp, Copy, Archive, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { KnowledgeDocument } from '@/data/knowledgeData';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface DocumentPropertiesProps {
  document: KnowledgeDocument | null;
  onDuplicate: (document: KnowledgeDocument) => void;
  onArchive: (document: KnowledgeDocument) => void;
}

const serviceNames: Record<string, string> = {
  lawyer: 'Юрист',
  doctor: 'Врач',
  psychologist: 'Психолог',
  financier: 'Финансист',
};

const priorityLabels: Record<string, string> = {
  high: 'Высокий',
  medium: 'Средний',
  low: 'Низкий',
};

const typeLabels: Record<string, string> = {
  document: 'Документ',
  faq: 'FAQ',
  protocol: 'Протокол',
};

export function DocumentProperties({ document, onDuplicate, onArchive }: DocumentPropertiesProps) {
  if (!document) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground p-4">
        <p className="text-sm text-center">Выберите документ для просмотра свойств</p>
      </div>
    );
  }

  const relevancePercent = Math.round(document.usageStats.relevanceScore * 100);

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        {/* Status */}
        <div>
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Статус
          </h3>
          <Badge 
            variant={document.status === 'active' ? 'default' : 'secondary'}
            className="w-full justify-center py-1"
          >
            {document.status === 'active' ? 'Активен' : document.status === 'draft' ? 'Черновик' : 'В архиве'}
          </Badge>
        </div>

        <Separator />

        {/* Metadata */}
        <div className="space-y-3">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Информация
          </h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">Тип:</span>
              <span className="ml-auto">{typeLabels[document.type]}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">Приоритет:</span>
              <span className="ml-auto">{priorityLabels[document.priority]}</span>
            </div>

            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">Автор:</span>
              <span className="ml-auto truncate max-w-[120px]" title={document.author}>
                {document.author}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">Создан:</span>
              <span className="ml-auto">
                {format(new Date(document.createdAt), 'd MMM yyyy', { locale: ru })}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">Изменён:</span>
              <span className="ml-auto">
                {format(new Date(document.updatedAt), 'd MMM yyyy', { locale: ru })}
              </span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Services */}
        <div>
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Сервисы
          </h3>
          <div className="flex flex-wrap gap-1">
            {document.services.map(serviceId => (
              <Badge key={serviceId} variant="outline">
                {serviceNames[serviceId] || serviceId}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Usage Stats */}
        <div className="space-y-3">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Использование
          </h3>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <span>Диалогов:</span>
              <span className="ml-auto font-medium">
                {document.usageStats.dialogsCount.toLocaleString('ru-RU')}
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span>Релевантность</span>
                <span className="font-medium">{relevancePercent}%</span>
              </div>
              <Progress value={relevancePercent} className="h-2" />
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Последнее:</span>
              <span className="ml-auto text-muted-foreground">
                {format(new Date(document.usageStats.lastUsed), 'd MMM, HH:mm', { locale: ru })}
              </span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div className="space-y-2">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Действия
          </h3>
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            size="sm"
            onClick={() => onDuplicate(document)}
          >
            <Copy className="h-4 w-4 mr-2" />
            Дублировать
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            size="sm"
            onClick={() => onArchive(document)}
          >
            <Archive className="h-4 w-4 mr-2" />
            {document.status === 'archived' ? 'Восстановить' : 'В архив'}
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
}
