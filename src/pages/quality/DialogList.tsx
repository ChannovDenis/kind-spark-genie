import { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, UserPlus, Keyboard } from 'lucide-react';
import { toast } from 'sonner';

import { DialogQuickFilters } from '@/components/quality/DialogQuickFilters';
import { DialogSearchBar } from '@/components/quality/DialogSearchBar';
import { DialogTable } from '@/components/quality/DialogTable';
import { DialogBulkActions } from '@/components/quality/DialogBulkActions';
import { DialogFiltersPanel } from '@/components/quality/DialogFiltersPanel';
import { AssignReviewerDialog } from '@/components/quality/AssignReviewerDialog';
import { SaveFilterDialog } from '@/components/quality/SaveFilterDialog';
import { KeyboardShortcutsHelp } from '@/components/quality/KeyboardShortcutsHelp';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

import { 
  qualityDialogs, 
  savedFilters as initialSavedFilters,
  dialogStats,
  DialogFilters,
  defaultFilters,
  SavedFilter,
  QualityDialog
} from '@/data/dialogsData';

export default function DialogList() {
  const navigate = useNavigate();
  
  // State
  const [filters, setFilters] = useState<DialogFilters>(defaultFilters);
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>(initialSavedFilters);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(0);
  
  // Dialog states
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [saveFilterDialogOpen, setSaveFilterDialogOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [assignTarget, setAssignTarget] = useState<string[]>([]);

  // Filter dialogs
  const filteredDialogs = useMemo(() => {
    return qualityDialogs.filter(dialog => {
      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(dialog.status)) {
        return false;
      }
      
      // Service filter
      if (filters.services.length > 0 && !filters.services.includes(dialog.service)) {
        return false;
      }
      
      // Score range filter
      if (dialog.aiScore < filters.scoreRange[0] || dialog.aiScore > filters.scoreRange[1]) {
        return false;
      }
      
      // Has issues filter
      if (filters.hasIssues === true && dialog.issues.length === 0) {
        return false;
      }
      
      // Issue categories filter
      if (filters.issueCategories.length > 0) {
        const dialogCategories = dialog.issues.map(i => i.category);
        if (!filters.issueCategories.some(c => dialogCategories.includes(c as any))) {
          return false;
        }
      }
      
      // Priority filter
      if (filters.priority.length > 0 && !filters.priority.includes(dialog.priority)) {
        return false;
      }
      
      // Assigned to filter
      if (filters.assignedTo === 'unassigned' && dialog.assignedTo) {
        return false;
      }
      if (filters.assignedTo && filters.assignedTo !== 'unassigned' && filters.assignedTo !== 'current_user') {
        if (dialog.assignedTo !== filters.assignedTo) {
          return false;
        }
      }
      
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesId = dialog.id.toLowerCase().includes(searchLower);
        const matchesUser = dialog.userName.toLowerCase().includes(searchLower);
        if (!matchesId && !matchesUser) {
          return false;
        }
      }
      
      return true;
    });
  }, [filters]);

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.status.length > 0) count++;
    if (filters.services.length > 0) count++;
    if (filters.scoreRange[0] !== 0 || filters.scoreRange[1] !== 100) count++;
    if (filters.hasIssues !== null) count++;
    if (filters.issueCategories.length > 0) count++;
    if (filters.priority.length > 0) count++;
    if (filters.assignedTo) count++;
    if (filters.dateRange) count++;
    return count;
  }, [filters]);

  // Handlers
  const handleAssign = (dialogId: string) => {
    setAssignTarget([dialogId]);
    setAssignDialogOpen(true);
  };

  const handleBulkAssign = () => {
    setAssignTarget(selectedIds);
    setAssignDialogOpen(true);
  };

  const handleAssignConfirm = (reviewerId: string, comment: string) => {
    toast.success(`Назначено ${assignTarget.length} диалогов`);
    setSelectedIds([]);
  };

  const handleSendToTraining = (dialogId: string) => {
    toast.success('Диалог отправлен в дообучение');
  };

  const handleBulkSendToTraining = () => {
    toast.success(`${selectedIds.length} диалогов отправлено в дообучение`);
    setSelectedIds([]);
  };

  const handleMarkReviewed = () => {
    toast.success(`${selectedIds.length} диалогов помечено как обработанные`);
    setSelectedIds([]);
  };

  const handleSaveFilter = (name: string, isDefault: boolean) => {
    const newFilter: SavedFilter = {
      id: `sf-${Date.now()}`,
      name,
      filters,
      createdBy: 'user',
      isDefault,
    };
    setSavedFilters([...savedFilters, newFilter]);
    toast.success('Фильтр сохранён');
  };

  const handleLoadFilter = (filter: SavedFilter) => {
    setFilters(filter.filters);
    toast.info(`Применён фильтр "${filter.name}"`);
  };

  // Keyboard shortcuts
  const shortcuts = useMemo(() => [
    {
      key: 'ArrowUp',
      action: () => setFocusedIndex(i => Math.max(0, i - 1)),
      description: 'Предыдущий диалог',
    },
    {
      key: 'ArrowDown',
      action: () => setFocusedIndex(i => Math.min(filteredDialogs.length - 1, i + 1)),
      description: 'Следующий диалог',
    },
    {
      key: 'Enter',
      action: () => {
        const dialog = filteredDialogs[focusedIndex];
        if (dialog) navigate(`/quality/dialogs/${dialog.id}`);
      },
      description: 'Открыть диалог',
    },
    {
      key: ' ',
      action: () => {
        const dialog = filteredDialogs[focusedIndex];
        if (dialog) {
          setSelectedIds(ids => 
            ids.includes(dialog.id) 
              ? ids.filter(id => id !== dialog.id)
              : [...ids, dialog.id]
          );
        }
      },
      description: 'Выбрать/снять выбор',
    },
    {
      key: 's',
      action: () => {
        if (selectedIds.length > 0) handleBulkSendToTraining();
      },
      description: 'В дообучение',
    },
    {
      key: 'd',
      action: () => {
        if (selectedIds.length > 0) handleMarkReviewed();
      },
      description: 'Пометить обработанным',
    },
    {
      key: 'f',
      action: () => setFiltersOpen(true),
      description: 'Открыть фильтры',
    },
    {
      key: 'Escape',
      action: () => setSelectedIds([]),
      description: 'Сбросить выбор',
    },
    {
      key: '?',
      shift: true,
      action: () => setShortcutsOpen(true),
      description: 'Показать клавиши',
    },
  ], [filteredDialogs, focusedIndex, selectedIds, navigate]);

  useKeyboardShortcuts(shortcuts, true);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="px-6 pt-6">
        <PageHeader
          title="Диалоги на разбор"
          description={`${filteredDialogs.length} из ${qualityDialogs.length} диалогов`}
          actions={
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    Сохранённые фильтры
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {savedFilters.map(filter => (
                    <DropdownMenuItem 
                      key={filter.id}
                      onClick={() => handleLoadFilter(filter)}
                    >
                      {filter.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button 
                variant="outline" 
                onClick={() => handleBulkAssign()}
                disabled={selectedIds.length === 0}
                className="gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Назначить
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShortcutsOpen(true)}
              >
                <Keyboard className="h-4 w-4" />
              </Button>
            </div>
          }
        />
      </div>

      <DialogSearchBar
        filters={filters}
        onFiltersChange={setFilters}
        onOpenAdvancedFilters={() => setFiltersOpen(true)}
        activeFiltersCount={activeFiltersCount}
      />

      <div className="flex flex-1 overflow-hidden">
        <DialogQuickFilters
          filters={filters}
          onFiltersChange={setFilters}
          stats={dialogStats}
          savedFilters={savedFilters}
          onSaveFilter={() => setSaveFilterDialogOpen(true)}
          onLoadFilter={handleLoadFilter}
        />
        
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <DialogTable
              dialogs={filteredDialogs}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
              onAssign={handleAssign}
              onSendToTraining={handleSendToTraining}
              focusedIndex={focusedIndex}
              onFocusChange={setFocusedIndex}
            />
          </ScrollArea>
        </div>
      </div>

      {/* Bulk actions bar */}
      <DialogBulkActions
        selectedCount={selectedIds.length}
        onMarkReviewed={handleMarkReviewed}
        onSendToTraining={handleBulkSendToTraining}
        onAssign={handleBulkAssign}
        onClearSelection={() => setSelectedIds([])}
      />

      {/* Dialogs */}
      <DialogFiltersPanel
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        filters={filters}
        onFiltersChange={setFilters}
        onSaveFilter={() => {
          setFiltersOpen(false);
          setSaveFilterDialogOpen(true);
        }}
      />

      <AssignReviewerDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        dialogIds={assignTarget}
        onAssign={handleAssignConfirm}
      />

      <SaveFilterDialog
        open={saveFilterDialogOpen}
        onOpenChange={setSaveFilterDialogOpen}
        currentFilters={filters}
        onSave={handleSaveFilter}
      />

      <KeyboardShortcutsHelp
        open={shortcutsOpen}
        onOpenChange={setShortcutsOpen}
        shortcuts={shortcuts.map(s => ({
          key: s.key === ' ' ? 'Space' : s.key,
          shift: s.shift,
          description: s.description,
          action: s.action,
        }))}
      />
    </div>
  );
}
