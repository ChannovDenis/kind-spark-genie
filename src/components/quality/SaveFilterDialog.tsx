import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { DialogFilters } from '@/data/dialogsData';

interface SaveFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentFilters: DialogFilters;
  onSave: (name: string, isDefault: boolean) => void;
}

export function SaveFilterDialog({
  open,
  onOpenChange,
  currentFilters,
  onSave,
}: SaveFilterDialogProps) {
  const [name, setName] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim(), isDefault);
      setName('');
      setIsDefault(false);
      onOpenChange(false);
    }
  };

  // Count active filters for preview
  const activeFiltersCount = 
    currentFilters.status.length +
    currentFilters.services.length +
    currentFilters.issueCategories.length +
    currentFilters.priority.length +
    (currentFilters.hasIssues !== null ? 1 : 0) +
    (currentFilters.assignedTo ? 1 : 0) +
    (currentFilters.dateRange ? 1 : 0) +
    (currentFilters.scoreRange[0] !== 0 || currentFilters.scoreRange[1] !== 100 ? 1 : 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Сохранить фильтр</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div>
            <Label htmlFor="filter-name" className="text-sm font-medium mb-2 block">
              Название фильтра
            </Label>
            <Input
              id="filter-name"
              placeholder="Например: Критичные врачей"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Будет сохранено {activeFiltersCount} активных фильтров
            </p>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={isDefault}
              onCheckedChange={(checked) => setIsDefault(checked === true)}
            />
            <span className="text-sm">Сделать фильтром по умолчанию</span>
          </label>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
