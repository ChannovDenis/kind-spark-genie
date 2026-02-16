import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, MoreVertical, Edit, Copy, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { mockScenarios, scenarioTypes, scenarioCategories } from '@/data/studioScenariosData';

const statusConfig = {
  draft: { label: 'Черновик', status: 'pending' as const },
  ready: { label: 'Готов', status: 'success' as const },
  generating: { label: 'Генерация', status: 'in_progress' as const },
  published: { label: 'Опубликован', status: 'completed' as const },
};

export default function Scenarios() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredScenarios = mockScenarios.filter((scenario) => {
    const matchesSearch = scenario.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || scenario.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || scenario.status === statusFilter;
    const matchesType = typeFilter === 'all' || scenario.type === typeFilter;
    return matchesSearch && matchesCategory && matchesStatus && matchesType;
  });

  const handleNewScenario = () => {
    toast.success('Создание нового сценария...');
    navigate('/studio/scenarios/new');
  };

  const handleDuplicate = (id: string) => {
    toast.success(`Сценарий ${id} дублирован`);
  };

  const handleDelete = (id: string) => {
    toast.success(`Сценарий ${id} удалён`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Сценарии"
        description="Библиотека сценариев для видеогенерации"
        actions={
          <Button onClick={handleNewScenario}>
            <Plus className="h-4 w-4 mr-2" />
            Новый сценарий
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск сценариев..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Категория" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все категории</SelectItem>
            {scenarioCategories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Статус" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="draft">Черновик</SelectItem>
            <SelectItem value="ready">Готов</SelectItem>
            <SelectItem value="generating">Генерация</SelectItem>
            <SelectItem value="published">Опубликован</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Тип" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все типы</SelectItem>
            {scenarioTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="glass-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">Превью</TableHead>
              <TableHead>Название</TableHead>
              <TableHead>Тип</TableHead>
              <TableHead>Категория</TableHead>
              <TableHead>Тенант</TableHead>
              <TableHead className="text-center">Сцен</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredScenarios.map((scenario) => (
              <TableRow
                key={scenario.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => navigate(`/studio/scenarios/${scenario.id}`)}
              >
                <TableCell>
                  <div className="w-12 h-8 rounded overflow-hidden bg-muted">
                    {scenario.thumbnail && (
                      <img
                        src={scenario.thumbnail}
                        alt={scenario.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium max-w-[250px] truncate">
                  {scenario.title}
                </TableCell>
                <TableCell>
                  <span className="text-xs px-2 py-1 rounded bg-muted">
                    {scenarioTypes.find(t => t.value === scenario.type)?.label}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">{scenario.category}</TableCell>
                <TableCell className="text-muted-foreground">{scenario.tenant}</TableCell>
                <TableCell className="text-center">{scenario.scenesCount}</TableCell>
                <TableCell>
                  <StatusBadge
                    status={statusConfig[scenario.status].status}
                    label={statusConfig[scenario.status].label}
                  />
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {format(new Date(scenario.updatedAt), 'd MMM', { locale: ru })}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/studio/scenarios/${scenario.id}`);
                      }}>
                        <Edit className="h-4 w-4 mr-2" />
                        Редактировать
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicate(scenario.id);
                      }}>
                        <Copy className="h-4 w-4 mr-2" />
                        Дублировать
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(scenario.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Удалить
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
