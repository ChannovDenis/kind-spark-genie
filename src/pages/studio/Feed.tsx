import { useState } from 'react';
import { Search, MoreVertical, BarChart3, Pause, RefreshCw, Youtube, Send, MessageCircle } from 'lucide-react';
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
import { mockFeedItems } from '@/data/studioScenariosData';
import { cn } from '@/lib/utils';

const statusConfig = {
  active: { label: 'Активен', status: 'success' as const },
  paused: { label: 'Пауза', status: 'pending' as const },
  archived: { label: 'Архив', status: 'completed' as const },
};

const ChannelIcon = ({ channel }: { channel: string }) => {
  const iconClass = "h-4 w-4";
  switch (channel) {
    case 'youtube':
      return <Youtube className={cn(iconClass, "text-destructive")} />;
    case 'telegram':
      return <Send className={cn(iconClass, "text-primary")} />;
    case 'vk':
      return <MessageCircle className={cn(iconClass, "text-primary")} />;
    case 'app':
      return (
        <div className={cn(iconClass, "rounded bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary")}>
          A
        </div>
      );
    default:
      return null;
  }
};

export default function Feed() {
  const [searchQuery, setSearchQuery] = useState('');
  const [tenantFilter, setTenantFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const uniqueTenants = [...new Set(mockFeedItems.map(item => item.tenant))];
  const uniqueCategories = [...new Set(mockFeedItems.map(item => item.category))];

  const filteredItems = mockFeedItems.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTenant = tenantFilter === 'all' || item.tenant === tenantFilter;
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesTenant && matchesCategory && matchesStatus;
  });

  const handleViewStats = (id: string) => {
    toast.info(`Открытие статистики для ${id}`);
  };

  const handlePause = (id: string) => {
    toast.success(`Видео ${id} снято с публикации`);
  };

  const handleRepublish = (id: string) => {
    toast.success(`Видео ${id} переопубликовано`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Лента"
        description="Управление опубликованным контентом"
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по названию..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={tenantFilter} onValueChange={setTenantFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Тенант" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все тенанты</SelectItem>
            {uniqueTenants.map((tenant) => (
              <SelectItem key={tenant} value={tenant}>{tenant}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Категория" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все категории</SelectItem>
            {uniqueCategories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Статус" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="active">Активен</SelectItem>
            <SelectItem value="paused">Пауза</SelectItem>
            <SelectItem value="archived">Архив</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="glass-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">Превью</TableHead>
              <TableHead>Заголовок</TableHead>
              <TableHead>Категория</TableHead>
              <TableHead>Тенант</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead className="text-right">Просмотры</TableHead>
              <TableHead className="text-right">Клики AI</TableHead>
              <TableHead>Каналы</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="w-12 h-8 rounded overflow-hidden bg-muted">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium max-w-[200px] truncate">
                  {item.title}
                </TableCell>
                <TableCell className="text-muted-foreground">{item.category}</TableCell>
                <TableCell className="text-muted-foreground">{item.tenant}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {format(new Date(item.publishedAt), 'd MMM', { locale: ru })}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {item.views.toLocaleString('ru-RU')}
                </TableCell>
                <TableCell className="text-right text-primary font-medium">
                  {item.aiClicks.toLocaleString('ru-RU')}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {item.channels.map((channel) => (
                      <ChannelIcon key={channel} channel={channel} />
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge
                    status={statusConfig[item.status].status}
                    label={statusConfig[item.status].label}
                  />
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewStats(item.id)}>
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Статистика
                      </DropdownMenuItem>
                      {item.status === 'active' && (
                        <DropdownMenuItem onClick={() => handlePause(item.id)}>
                          <Pause className="h-4 w-4 mr-2" />
                          Снять
                        </DropdownMenuItem>
                      )}
                      {item.status !== 'active' && (
                        <DropdownMenuItem onClick={() => handleRepublish(item.id)}>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Переопубликовать
                        </DropdownMenuItem>
                      )}
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
