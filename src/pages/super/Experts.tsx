import { useState } from 'react';
import { Search, MoreVertical, Edit, UserX, UserCheck, Star } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge, type Status } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { mockExperts, expertSpecializations } from '@/data/superData';

const statusConfig: Record<string, { label: string; status: Status }> = {
  active: { label: 'Активен', status: 'success' },
  inactive: { label: 'Неактивен', status: 'pending' },
  pending: { label: 'На модерации', status: 'warning' },
};

export default function Experts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredExperts = mockExperts.filter((expert) => {
    const matchesSearch = expert.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpec = specializationFilter === 'all' || expert.specialization === specializationFilter;
    const matchesStatus = statusFilter === 'all' || expert.status === statusFilter;
    return matchesSearch && matchesSpec && matchesStatus;
  });

  const handleActivate = (id: string) => {
    toast.success(`Эксперт ${id} активирован`);
  };

  const handleDeactivate = (id: string) => {
    toast.success(`Эксперт ${id} деактивирован`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Эксперты"
        description="Реестр экспертов платформы"
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по имени..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Специализация" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все специализации</SelectItem>
            {expertSpecializations.map((spec) => (
              <SelectItem key={spec} value={spec}>{spec}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Статус" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="active">Активные</SelectItem>
            <SelectItem value="inactive">Неактивные</SelectItem>
            <SelectItem value="pending">На модерации</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="glass-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Эксперт</TableHead>
              <TableHead>Специализация</TableHead>
              <TableHead className="text-center">Рейтинг</TableHead>
              <TableHead className="text-center">Сессий</TableHead>
              <TableHead>Тенанты</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExperts.map((expert) => (
              <TableRow key={expert.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={expert.avatar} alt={expert.name} />
                      <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{expert.name}</p>
                      <p className="text-xs text-muted-foreground">{expert.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{expert.specialization}</TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-4 w-4 text-warning fill-warning" />
                    <span className="font-medium">{expert.rating}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center font-medium">
                  {expert.sessionsCount.toLocaleString('ru-RU')}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {expert.tenants.length > 0 ? (
                      expert.tenants.slice(0, 2).map((tenant) => (
                        <span
                          key={tenant}
                          className="text-xs px-2 py-0.5 rounded bg-muted"
                        >
                          {tenant}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                    {expert.tenants.length > 2 && (
                      <span className="text-xs px-2 py-0.5 rounded bg-muted">
                        +{expert.tenants.length - 2}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge
                    status={statusConfig[expert.status].status}
                    label={statusConfig[expert.status].label}
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
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Редактировать
                      </DropdownMenuItem>
                      {expert.status === 'active' ? (
                        <DropdownMenuItem onClick={() => handleDeactivate(expert.id)}>
                          <UserX className="h-4 w-4 mr-2" />
                          Деактивировать
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => handleActivate(expert.id)}>
                          <UserCheck className="h-4 w-4 mr-2" />
                          Активировать
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
