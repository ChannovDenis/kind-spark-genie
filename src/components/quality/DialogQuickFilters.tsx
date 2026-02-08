import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowUpCircle,
  BookOpen,
  Scale,
  Stethoscope,
  Brain,
  Wallet,
  Save,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DialogFilters, SavedFilter, DialogStats, serviceLabels } from '@/data/dialogsData';

interface DialogQuickFiltersProps {
  filters: DialogFilters;
  onFiltersChange: (filters: DialogFilters) => void;
  stats: DialogStats;
  savedFilters: SavedFilter[];
  onSaveFilter: () => void;
  onLoadFilter: (filter: SavedFilter) => void;
}

const serviceIcons: Record<string, React.ReactNode> = {
  lawyer: <Scale className="h-4 w-4" />,
  doctor: <Stethoscope className="h-4 w-4" />,
  psychologist: <Brain className="h-4 w-4" />,
  financier: <Wallet className="h-4 w-4" />,
};

export function DialogQuickFilters({
  filters,
  onFiltersChange,
  stats,
  savedFilters,
  onSaveFilter,
  onLoadFilter,
}: DialogQuickFiltersProps) {
  const toggleStatus = (status: string) => {
    const newStatuses = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status];
    onFiltersChange({ ...filters, status: newStatuses });
  };

  const toggleService = (service: string) => {
    const newServices = filters.services.includes(service)
      ? filters.services.filter(s => s !== service)
      : [...filters.services, service];
    onFiltersChange({ ...filters, services: newServices });
  };

  const setScoreRange = (range: [number, number]) => {
    onFiltersChange({ ...filters, scoreRange: range });
  };

  const isScoreRangeActive = (min: number, max: number) => {
    return filters.scoreRange[0] === min && filters.scoreRange[1] === max;
  };

  return (
    <div className="w-[260px] border-r bg-sidebar flex flex-col h-full">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Status filters */}
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
              <BarChart3 className="h-4 w-4" />
              По статусу
            </div>
            <div className="space-y-1">
              <FilterItem
                icon={<Clock className="h-4 w-4" />}
                label="Все"
                count={stats.total}
                active={filters.status.length === 0}
                onClick={() => onFiltersChange({ ...filters, status: [] })}
              />
              <FilterItem
                icon={<Clock className="h-4 w-4 text-warning" />}
                label="Ожидает"
                count={stats.pending}
                active={filters.status.includes('pending')}
                onClick={() => toggleStatus('pending')}
              />
              <FilterItem
                icon={<AlertTriangle className="h-4 w-4 text-blue-500" />}
                label="На проверке"
                count={stats.inReview}
                active={filters.status.includes('in_review')}
                onClick={() => toggleStatus('in_review')}
              />
              <FilterItem
                icon={<CheckCircle2 className="h-4 w-4 text-success" />}
                label="Проверен"
                count={stats.reviewed}
                active={filters.status.includes('reviewed')}
                onClick={() => toggleStatus('reviewed')}
              />
              <FilterItem
                icon={<ArrowUpCircle className="h-4 w-4 text-purple-500" />}
                label="Эскалирован"
                count={stats.escalated}
                active={filters.status.includes('escalated')}
                onClick={() => toggleStatus('escalated')}
              />
              <FilterItem
                icon={<BookOpen className="h-4 w-4 text-primary" />}
                label="В дообучении"
                count={stats.total - stats.pending - stats.inReview - stats.reviewed - stats.escalated}
                active={filters.status.includes('training')}
                onClick={() => toggleStatus('training')}
              />
            </div>
          </div>

          <Separator />

          {/* AI Score filters */}
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
              <BarChart3 className="h-4 w-4" />
              По AI Score
            </div>
            <div className="space-y-1">
              <FilterItem
                label="< 50% (критично)"
                count={stats.byScoreRange.critical}
                active={isScoreRangeActive(0, 50)}
                onClick={() => setScoreRange([0, 50])}
                textColorClass="text-destructive"
              />
              <FilterItem
                label="50-80% (внимание)"
                count={stats.byScoreRange.warning}
                active={isScoreRangeActive(50, 80)}
                onClick={() => setScoreRange([50, 80])}
                textColorClass="text-warning"
              />
              <FilterItem
                label="> 80% (хорошо)"
                count={stats.byScoreRange.good}
                active={isScoreRangeActive(80, 100)}
                onClick={() => setScoreRange([80, 100])}
                textColorClass="text-success"
              />
            </div>
          </div>

          <Separator />

          {/* Service filters */}
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
              🏷️ По сервису
            </div>
            <div className="space-y-1">
              {Object.entries(stats.byService).map(([service, count]) => (
                <FilterItem
                  key={service}
                  icon={serviceIcons[service]}
                  label={serviceLabels[service] || service}
                  count={count}
                  active={filters.services.includes(service)}
                  onClick={() => toggleService(service)}
                />
              ))}
            </div>
          </div>

          <Separator />

          {/* Saved filters */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Save className="h-4 w-4" />
                Сохранённые
              </div>
            </div>
            <div className="space-y-1">
              {savedFilters.map(filter => (
                <FilterItem
                  key={filter.id}
                  label={filter.name}
                  active={false}
                  onClick={() => onLoadFilter(filter)}
                  showBadge={filter.isDefault}
                  badgeText="По умолч."
                />
              ))}
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-muted-foreground"
                onClick={onSaveFilter}
              >
                <Plus className="h-4 w-4 mr-2" />
                Сохранить фильтр
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

interface FilterItemProps {
  icon?: React.ReactNode;
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
  textColorClass?: string;
  showBadge?: boolean;
  badgeText?: string;
}

function FilterItem({ 
  icon, 
  label, 
  count, 
  active, 
  onClick, 
  textColorClass,
  showBadge,
  badgeText 
}: FilterItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors",
        active 
          ? "bg-accent text-accent-foreground font-medium" 
          : "hover:bg-accent/50 text-foreground"
      )}
    >
      <div className="flex items-center gap-2">
        {icon}
        <span>{label}</span>
        {showBadge && (
          <Badge variant="secondary" className="text-xs py-0 px-1.5">
            {badgeText}
          </Badge>
        )}
      </div>
      {count !== undefined && (
        <span className={cn(
          "text-xs tabular-nums",
          textColorClass || "text-muted-foreground"
        )}>
          {count.toLocaleString()}
        </span>
      )}
    </button>
  );
}
