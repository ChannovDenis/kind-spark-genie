import { Button } from '@/components/ui/button';
import { CheckCircle2, BookOpen, UserPlus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DialogBulkActionsProps {
  selectedCount: number;
  onMarkReviewed: () => void;
  onSendToTraining: () => void;
  onAssign: () => void;
  onClearSelection: () => void;
}

export function DialogBulkActions({
  selectedCount,
  onMarkReviewed,
  onSendToTraining,
  onAssign,
  onClearSelection,
}: DialogBulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
      >
        <div className="flex items-center gap-3 bg-background border rounded-lg shadow-lg px-4 py-3">
          <div className="flex items-center gap-2 pr-3 border-r">
            <span className="text-sm font-medium">{selectedCount} выбрано</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onClearSelection}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onMarkReviewed}
              className="gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              Обработано
              <kbd className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded">D</kbd>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onSendToTraining}
              className="gap-2"
            >
              <BookOpen className="h-4 w-4" />
              В дообучение
              <kbd className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded">S</kbd>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onAssign}
              className="gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Назначить
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
