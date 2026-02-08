import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  MoreHorizontal, 
  ExternalLink, 
  UserPlus, 
  BookOpen,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Scale,
  Stethoscope,
  Brain,
  Wallet,
  AlertCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  QualityDialog, 
  serviceLabels, 
  statusLabels,
  getScoreColor,
  getScoreBgColor,
  getStatusColor,
  formatDate,
  issueCategoryLabels 
} from '@/data/dialogsData';

interface DialogTableProps {
  dialogs: QualityDialog[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onAssign: (dialogId: string) => void;
  onSendToTraining: (dialogId: string) => void;
  focusedIndex: number;
  onFocusChange: (index: number) => void;
}

type SortField = 'createdAt' | 'aiScore' | 'status' | 'service' | 'priority';
type SortDirection = 'asc' | 'desc';

const serviceIcons: Record<string, React.ReactNode> = {
  lawyer: <Scale className="h-4 w-4" />,
  doctor: <Stethoscope className="h-4 w-4" />,
  psychologist: <Brain className="h-4 w-4" />,
  financier: <Wallet className="h-4 w-4" />,
};

const severityIcons: Record<string, React.ReactNode> = {
  critical: <AlertCircle className="h-3 w-3 text-destructive" />,
  warning: <AlertTriangle className="h-3 w-3 text-warning" />,
  info: <Info className="h-3 w-3 text-muted-foreground" />,
};

export function DialogTable({
  dialogs,
  selectedIds,
  onSelectionChange,
  onAssign,
  onSendToTraining,
  focusedIndex,
  onFocusChange,
}: DialogTableProps) {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedDialogs = [...dialogs].sort((a, b) => {
    const modifier = sortDirection === 'asc' ? 1 : -1;
    switch (sortField) {
      case 'createdAt':
        return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * modifier;
      case 'aiScore':
        return (a.aiScore - b.aiScore) * modifier;
      case 'priority':
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return (priorityOrder[a.priority] - priorityOrder[b.priority]) * modifier;
      default:
        return 0;
    }
  });

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(i => i !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === dialogs.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(dialogs.map(d => d.id));
    }
  };

  const handleRowClick = (dialog: QualityDialog) => {
    navigate(`/quality/dialogs/${dialog.id}`);
  };

  const SortHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-foreground transition-colors"
    >
      {children}
      {sortField === field ? (
        sortDirection === 'asc' ? (
          <ArrowUp className="h-3 w-3" />
        ) : (
          <ArrowDown className="h-3 w-3" />
        )
      ) : (
        <ArrowUpDown className="h-3 w-3 opacity-50" />
      )}
    </button>
  );

  return (
    <div className="relative">
      <Table>
        <TableHeader className="sticky top-0 bg-background z-10">
          <TableRow>
            <TableHead className="w-[40px]">
              <Checkbox
                checked={selectedIds.length === dialogs.length && dialogs.length > 0}
                onCheckedChange={toggleSelectAll}
              />
            </TableHead>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Пользователь</TableHead>
            <TableHead>
              <SortHeader field="service">Сервис</SortHeader>
            </TableHead>
            <TableHead>
              <SortHeader field="aiScore">AI Score</SortHeader>
            </TableHead>
            <TableHead>Проблемы</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>
              <SortHeader field="createdAt">Дата</SortHeader>
            </TableHead>
            <TableHead>Назначено</TableHead>
            <TableHead className="w-[50px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedDialogs.map((dialog, index) => (
            <TableRow
              key={dialog.id}
              className={cn(
                "cursor-pointer transition-colors",
                focusedIndex === index && "bg-accent",
                selectedIds.includes(dialog.id) && "bg-muted/50"
              )}
              onClick={() => handleRowClick(dialog)}
              onMouseEnter={() => onFocusChange(index)}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedIds.includes(dialog.id)}
                  onCheckedChange={() => toggleSelect(dialog.id)}
                />
              </TableCell>
              <TableCell className="font-mono text-sm text-muted-foreground">
                #{dialog.id.split('-')[1]}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-xs">
                      {dialog.userName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{dialog.userName}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-muted-foreground">
                  {serviceIcons[dialog.service]}
                  <span className="text-sm">{serviceLabels[dialog.service]}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className={cn("h-2 w-2 rounded-full", getScoreBgColor(dialog.aiScore))} />
                  <span className={cn("text-sm font-medium", getScoreColor(dialog.aiScore))}>
                    {dialog.aiScore}%
                  </span>
                </div>
              </TableCell>
              <TableCell>
                {dialog.issues.length > 0 ? (
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className="text-xs gap-1">
                      {severityIcons[dialog.issues[0]?.severity || 'info']}
                      {dialog.flaggedMessagesCount}
                    </Badge>
                    {dialog.issues.length > 1 && (
                      <span className="text-xs text-muted-foreground">
                        +{dialog.issues.length - 1}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={cn("text-xs", getStatusColor(dialog.status))}>
                  {statusLabels[dialog.status]}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(dialog.createdAt)}
              </TableCell>
              <TableCell>
                {dialog.assignedToName ? (
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {dialog.assignedToName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleRowClick(dialog)}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Открыть
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAssign(dialog.id)}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Назначить
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onSendToTraining(dialog.id)}>
                      <BookOpen className="h-4 w-4 mr-2" />
                      В дообучение
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {dialogs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <p className="text-lg">Нет диалогов по заданным фильтрам</p>
          <p className="text-sm">Попробуйте изменить параметры поиска</p>
        </div>
      )}
    </div>
  );
}
