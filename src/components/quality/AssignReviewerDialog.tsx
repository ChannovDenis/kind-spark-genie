import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { reviewers, Reviewer } from '@/data/dialogsData';

interface AssignReviewerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dialogIds: string[];
  onAssign: (reviewerId: string, comment: string) => void;
}

export function AssignReviewerDialog({
  open,
  onOpenChange,
  dialogIds,
  onAssign,
}: AssignReviewerDialogProps) {
  const [selectedReviewer, setSelectedReviewer] = useState<string | null>(null);
  const [comment, setComment] = useState('');

  const handleAssign = () => {
    if (selectedReviewer) {
      onAssign(selectedReviewer, comment);
      setSelectedReviewer(null);
      setComment('');
      onOpenChange(false);
    }
  };

  const dialogCount = dialogIds.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            Назначить ревьюера
            {dialogCount > 1 && (
              <Badge variant="secondary" className="ml-2">
                {dialogCount} диалогов
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div>
            <Label className="text-sm font-medium mb-3 block">Выберите ревьюера</Label>
            <div className="space-y-2">
              {reviewers.map((reviewer) => (
                <ReviewerOption
                  key={reviewer.id}
                  reviewer={reviewer}
                  selected={selectedReviewer === reviewer.id}
                  onClick={() => setSelectedReviewer(reviewer.id)}
                />
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">
              Комментарий <span className="text-muted-foreground">(опционально)</span>
            </Label>
            <Textarea
              placeholder="Добавьте контекст или инструкции для ревьюера..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleAssign} disabled={!selectedReviewer}>
            Назначить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface ReviewerOptionProps {
  reviewer: Reviewer;
  selected: boolean;
  onClick: () => void;
}

function ReviewerOption({ reviewer, selected, onClick }: ReviewerOptionProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between p-3 rounded-lg border transition-colors",
        selected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50 hover:bg-accent/50"
      )}
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarFallback>
            {reviewer.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div className="text-left">
          <p className="text-sm font-medium">{reviewer.name}</p>
          <p className="text-xs text-muted-foreground">
            {reviewer.activeDialogs} активных диалогов
          </p>
        </div>
      </div>
      {selected && (
        <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-primary-foreground" />
        </div>
      )}
    </button>
  );
}
