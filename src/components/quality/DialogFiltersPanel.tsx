import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  DialogFilters, 
  defaultFilters,
  serviceLabels,
  statusLabels,
  issueCategoryLabels,
  reviewers 
} from '@/data/dialogsData';

interface DialogFiltersPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: DialogFilters;
  onFiltersChange: (filters: DialogFilters) => void;
  onSaveFilter: () => void;
}

export function DialogFiltersPanel({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
  onSaveFilter,
}: DialogFiltersPanelProps) {
  const [localFilters, setLocalFilters] = useState<DialogFilters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleApply = () => {
    onFiltersChange(localFilters);
    onOpenChange(false);
  };

  const handleReset = () => {
    setLocalFilters(defaultFilters);
  };

  const toggleArrayItem = (
    key: 'services' | 'status' | 'issueCategories' | 'priority',
    value: string
  ) => {
    const current = localFilters[key];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    setLocalFilters({ ...localFilters, [key]: updated });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Расширенные фильтры</SheetTitle>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* Services */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Сервисы</Label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(serviceLabels).map(([key, label]) => (
                <label
                  key={key}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Checkbox
                    checked={localFilters.services.includes(key)}
                    onCheckedChange={() => toggleArrayItem('services', key)}
                  />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <Separator />

          {/* Statuses */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Статусы</Label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(statusLabels).map(([key, label]) => (
                <label
                  key={key}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Checkbox
                    checked={localFilters.status.includes(key)}
                    onCheckedChange={() => toggleArrayItem('status', key)}
                  />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <Separator />

          {/* AI Score Range */}
          <div>
            <Label className="text-sm font-medium mb-3 block">
              AI Score: {localFilters.scoreRange[0]}% - {localFilters.scoreRange[1]}%
            </Label>
            <Slider
              value={localFilters.scoreRange}
              onValueChange={(value) => 
                setLocalFilters({ 
                  ...localFilters, 
                  scoreRange: value as [number, number] 
                })
              }
              min={0}
              max={100}
              step={5}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          <Separator />

          {/* Issue Categories */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Категории ошибок</Label>
            <div className="space-y-2">
              {Object.entries(issueCategoryLabels).map(([key, label]) => (
                <label
                  key={key}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Checkbox
                    checked={localFilters.issueCategories.includes(key)}
                    onCheckedChange={() => toggleArrayItem('issueCategories', key)}
                  />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <Separator />

          {/* Has Issues */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={localFilters.hasIssues === true}
                onCheckedChange={(checked) => 
                  setLocalFilters({ 
                    ...localFilters, 
                    hasIssues: checked ? true : null 
                  })
                }
              />
              <span className="text-sm">Только с проблемами</span>
            </label>
          </div>

          <Separator />

          {/* Priority */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Приоритет</Label>
            <div className="grid grid-cols-2 gap-2">
              {['critical', 'high', 'medium', 'low'].map((priority) => (
                <label
                  key={priority}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Checkbox
                    checked={localFilters.priority.includes(priority)}
                    onCheckedChange={() => toggleArrayItem('priority', priority)}
                  />
                  <span className="text-sm">
                    {priority === 'critical' && 'Критичный'}
                    {priority === 'high' && 'Высокий'}
                    {priority === 'medium' && 'Средний'}
                    {priority === 'low' && 'Низкий'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <Separator />

          {/* Assigned To */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Назначено на</Label>
            <Select
              value={localFilters.assignedTo || 'all'}
              onValueChange={(value) => 
                setLocalFilters({ 
                  ...localFilters, 
                  assignedTo: value === 'all' ? null : value 
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Все ревьюеры" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все ревьюеры</SelectItem>
                <SelectItem value="unassigned">Не назначены</SelectItem>
                <SelectItem value="current_user">Мои</SelectItem>
                {reviewers.map(reviewer => (
                  <SelectItem key={reviewer.id} value={reviewer.id}>
                    {reviewer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <SheetFooter className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            Сбросить
          </Button>
          <Button variant="outline" onClick={onSaveFilter}>
            Сохранить как пресет
          </Button>
          <Button onClick={handleApply}>
            Применить
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
