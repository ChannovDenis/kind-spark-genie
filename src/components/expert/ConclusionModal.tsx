import { useState } from 'react';
import { FileText, Save, Send } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface ConclusionModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientName: string;
  topic: string;
  onComplete: () => void;
}

const templates = {
  consultation: {
    label: 'Консультация',
    text: `Проведена консультация по обращению клиента.

Суть обращения:
[описание проблемы]

Результат консультации:
[основные выводы и разъяснения]

Правовая основа:
[ссылки на НПА, если применимо]`,
  },
  referral: {
    label: 'Направление к специалисту',
    text: `По результатам первичной консультации рекомендовано направление к профильному специалисту.

Причина направления:
[описание необходимости специализированной помощи]

Рекомендуемый специалист:
[тип специалиста]

Подготовительные действия для клиента:
[список документов/действий]`,
  },
  general: {
    label: 'Общее заключение',
    text: `Заключение по обращению клиента.

Описание ситуации:
[краткое изложение]

Выводы:
[основные выводы]

Рекомендации:
[рекомендуемые действия]`,
  },
};

export function ConclusionModal({ 
  isOpen, 
  onClose, 
  clientName, 
  topic,
  onComplete 
}: ConclusionModalProps) {
  const [template, setTemplate] = useState<keyof typeof templates | ''>('');
  const [conclusion, setConclusion] = useState('');
  const [recommendations, setRecommendations] = useState('');

  const handleTemplateChange = (value: keyof typeof templates) => {
    setTemplate(value);
    setConclusion(templates[value].text);
  };

  const handleSaveDraft = () => {
    toast.success('Черновик сохранён');
  };

  const handleComplete = () => {
    toast.success('Заключение отправлено, сессия завершена');
    onComplete();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Записать заключение
          </DialogTitle>
          <DialogDescription>
            {clientName} — {topic}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Шаблон заключения</Label>
            <Select value={template} onValueChange={handleTemplateChange}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите шаблон..." />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(templates).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Заключение</Label>
            <Textarea
              value={conclusion}
              onChange={(e) => setConclusion(e.target.value)}
              placeholder="Введите текст заключения..."
              className="min-h-[200px] font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label>Рекомендации клиенту</Label>
            <Textarea
              value={recommendations}
              onChange={(e) => setRecommendations(e.target.value)}
              placeholder="Дополнительные рекомендации..."
              className="min-h-[80px]"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleSaveDraft}>
            <Save className="h-4 w-4 mr-2" />
            Сохранить черновик
          </Button>
          <Button onClick={handleComplete} disabled={!conclusion.trim()}>
            <Send className="h-4 w-4 mr-2" />
            Завершить и отправить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
