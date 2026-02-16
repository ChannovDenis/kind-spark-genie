import { useState } from 'react';
import { Search, Filter, UserPlus, MoreHorizontal, Mail, Phone } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PartnerUser } from '@/data/mockData';
import { tenantUsers } from '@/data/tenantMetrics';
import { useTenant } from '@/contexts/TenantContext';
import { formatRelativeDate } from '@/lib/formatters';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/shared/StatusBadge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function AdminUsers() {
  const { currentTenant } = useTenant();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<PartnerUser | null>(null);

  const users = tenantUsers[currentTenant.id] || tenantUsers.dobroservice;

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Пользователи"
        description="Управление пользователями партнёра"
        actions={
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            Добавить
          </Button>
        }
      />

      {/* Search & Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Поиск по имени, email или отделу..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Фильтры
        </Button>
      </div>

      {/* Users Table */}
      <div className="glass-card overflow-hidden">
        <table className="data-table">
          <thead className="bg-muted/30">
            <tr>
              <th>Пользователь</th>
              <th>Отдел</th>
              <th>Роль</th>
              <th>Запросов</th>
              <th>Активность</th>
              <th>Статус</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => {
              const initials = user.name
                .split(' ')
                .map(n => n[0])
                .join('');

              return (
                <tr 
                  key={user.id} 
                  className="cursor-pointer"
                  onClick={() => setSelectedUser(user)}
                >
                  <td>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{user.department}</td>
                  <td>{user.role}</td>
                  <td>{user.totalRequests}</td>
                  <td className="text-muted-foreground">
                    {formatRelativeDate(user.lastActive)}
                  </td>
                  <td>
                    <StatusBadge 
                      status={user.status === 'active' ? 'success' : 'warning'}
                      label={user.status === 'active' ? 'Активен' : 'Неактивен'}
                    />
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                          Просмотреть
                        </DropdownMenuItem>
                        <DropdownMenuItem>Редактировать</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Деактивировать
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* User Detail Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Профиль пользователя</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {selectedUser.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                  <p className="text-muted-foreground">{selectedUser.role}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedUser.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>+7 (999) 123-45-67</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-muted/30">
                  <div className="text-2xl font-bold">{selectedUser.totalRequests}</div>
                  <div className="text-xs text-muted-foreground">Всего запросов</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <div className="text-2xl font-bold">{selectedUser.department}</div>
                  <div className="text-xs text-muted-foreground">Отдел</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">Написать</Button>
                <Button variant="outline" className="flex-1">Редактировать</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
