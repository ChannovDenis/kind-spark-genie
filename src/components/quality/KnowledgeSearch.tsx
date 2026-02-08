import { useState } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface KnowledgeSearchProps {
  value: string;
  onChange: (value: string) => void;
  filters: {
    types: string[];
    services: string[];
    status: string[];
  };
  onFiltersChange: (filters: { types: string[]; services: string[]; status: string[] }) => void;
}

const typeOptions = [
  { id: 'document', label: 'Документы' },
  { id: 'faq', label: 'FAQ' },
  { id: 'protocol', label: 'Протоколы' },
];

const serviceOptions = [
  { id: 'lawyer', label: 'Юрист' },
  { id: 'doctor', label: 'Врач' },
  { id: 'psychologist', label: 'Психолог' },
  { id: 'financier', label: 'Финансист' },
];

const statusOptions = [
  { id: 'active', label: 'Активные' },
  { id: 'draft', label: 'Черновики' },
  { id: 'archived', label: 'Архив' },
];

export function KnowledgeSearch({ value, onChange, filters, onFiltersChange }: KnowledgeSearchProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const activeFiltersCount = 
    filters.types.length + 
    filters.services.length + 
    filters.status.length;

  const toggleFilter = (category: 'types' | 'services' | 'status', id: string) => {
    const current = filters[category];
    const updated = current.includes(id)
      ? current.filter(item => item !== id)
      : [...current, id];
    onFiltersChange({ ...filters, [category]: updated });
  };

  const clearFilters = () => {
    onFiltersChange({ types: [], services: [], status: [] });
  };

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Поиск по документам и FAQ..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-9 pr-9"
        />
        {value && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
            onClick={() => onChange('')}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="relative">
            <Filter className="h-4 w-4" />
            {activeFiltersCount > 0 && (
              <Badge 
                className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
              >
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72" align="end">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Фильтры</span>
              {activeFiltersCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Сбросить
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Тип</Label>
              <div className="space-y-2">
                {typeOptions.map(option => (
                  <div key={option.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`type-${option.id}`}
                      checked={filters.types.includes(option.id)}
                      onCheckedChange={() => toggleFilter('types', option.id)}
                    />
                    <Label htmlFor={`type-${option.id}`} className="text-sm font-normal">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Сервис</Label>
              <div className="space-y-2">
                {serviceOptions.map(option => (
                  <div key={option.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`service-${option.id}`}
                      checked={filters.services.includes(option.id)}
                      onCheckedChange={() => toggleFilter('services', option.id)}
                    />
                    <Label htmlFor={`service-${option.id}`} className="text-sm font-normal">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Статус</Label>
              <div className="space-y-2">
                {statusOptions.map(option => (
                  <div key={option.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`status-${option.id}`}
                      checked={filters.status.includes(option.id)}
                      onCheckedChange={() => toggleFilter('status', option.id)}
                    />
                    <Label htmlFor={`status-${option.id}`} className="text-sm font-normal">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
