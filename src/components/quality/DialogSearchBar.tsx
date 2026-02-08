import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  SlidersHorizontal, 
  Calendar, 
  X,
  ChevronDown
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { DialogFilters, defaultFilters } from '@/data/dialogsData';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';

interface DialogSearchBarProps {
  filters: DialogFilters;
  onFiltersChange: (filters: DialogFilters) => void;
  onOpenAdvancedFilters: () => void;
  activeFiltersCount: number;
}

export function DialogSearchBar({
  filters,
  onFiltersChange,
  onOpenAdvancedFilters,
  activeFiltersCount,
}: DialogSearchBarProps) {
  const [searchValue, setSearchValue] = useState(filters.search);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== filters.search) {
        onFiltersChange({ ...filters, search: searchValue });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue]);

  // Keyboard shortcut for search focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          searchInputRef.current?.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleDateSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from && range?.to) {
      onFiltersChange({
        ...filters,
        dateRange: [range.from.toISOString(), range.to.toISOString()],
      });
    } else if (!range) {
      onFiltersChange({ ...filters, dateRange: null });
    }
  };

  const clearFilters = () => {
    setSearchValue('');
    setDateRange(undefined);
    onFiltersChange(defaultFilters);
  };

  const hasActiveFilters = activeFiltersCount > 0 || searchValue || dateRange;

  return (
    <div className="flex items-center gap-3 p-4 border-b bg-background">
      {/* Search input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={searchInputRef}
          placeholder="Поиск по ID или пользователю... (/)"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-9 pr-9"
        />
        {searchValue && (
          <button
            onClick={() => setSearchValue('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Advanced filters button */}
      <Button
        variant="outline"
        onClick={onOpenAdvancedFilters}
        className="gap-2"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Фильтры
        {activeFiltersCount > 0 && (
          <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
            {activeFiltersCount}
          </Badge>
        )}
      </Button>

      {/* Date range picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, 'd MMM', { locale: ru })} -{' '}
                  {format(dateRange.to, 'd MMM', { locale: ru })}
                </>
              ) : (
                format(dateRange.from, 'd MMM yyyy', { locale: ru })
              )
            ) : (
              'Период'
            )}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <CalendarComponent
            mode="range"
            selected={dateRange}
            onSelect={handleDateSelect}
            numberOfMonths={2}
            locale={ru}
          />
          <div className="p-3 border-t flex justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const today = new Date();
                const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                setDateRange({ from: startOfDay, to: today });
              }}
            >
              Сегодня
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const today = new Date();
                const weekAgo = new Date(today);
                weekAgo.setDate(weekAgo.getDate() - 7);
                setDateRange({ from: weekAgo, to: today });
              }}
            >
              Неделя
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDateSelect(undefined)}
            >
              Сбросить
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Clear all filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-muted-foreground"
        >
          <X className="h-4 w-4 mr-1" />
          Сбросить
        </Button>
      )}
    </div>
  );
}
