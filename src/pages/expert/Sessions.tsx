import { useState } from 'react';
import { Download, Filter, Star, Clock, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { expertSessions, type SessionStatus } from '@/data/mockData';
import { toast } from 'sonner';

const statusConfig: Record<SessionStatus, { variant: 'success' | 'warning' | 'info' | 'cancelled'; label: string }> = {
  completed: { variant: 'success', label: 'Завершена' },
  scheduled: { variant: 'warning', label: 'Запланирована' },
  in_progress: { variant: 'info', label: 'В процессе' },
  cancelled: { variant: 'cancelled', label: 'Отменена' },
};

export default function ExpertSessions() {
  const [activeTab, setActiveTab] = useState('all');

  const filteredSessions = expertSessions.filter((session) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'completed') return session.status === 'completed';
    if (activeTab === 'scheduled') return session.status === 'scheduled';
    return true;
  });

  const handleExport = () => {
    toast.success('Экспорт начат. Файл будет загружен автоматически.');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="История сессий"
        description="Все консультации и запланированные встречи"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Фильтры
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Экспорт
            </Button>
          </div>
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Все ({expertSessions.length})</TabsTrigger>
          <TabsTrigger value="completed">
            Завершённые ({expertSessions.filter((s) => s.status === 'completed').length})
          </TabsTrigger>
          <TabsTrigger value="scheduled">
            Запланированные ({expertSessions.filter((s) => s.status === 'scheduled').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <div className="glass-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Дата
                    </div>
                  </TableHead>
                  <TableHead>Клиент</TableHead>
                  <TableHead>Тема</TableHead>
                  <TableHead className="w-[100px]">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Длит.
                    </div>
                  </TableHead>
                  <TableHead className="w-[100px]">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      Рейтинг
                    </div>
                  </TableHead>
                  <TableHead className="w-[130px]">Статус</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">
                      {format(new Date(session.date), 'dd.MM.yy', { locale: ru })}
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(session.date), 'HH:mm')}
                      </div>
                    </TableCell>
                    <TableCell>{session.clientName}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{session.topic}</TableCell>
                    <TableCell>
                      {session.duration > 0 ? `${session.duration} мин` : '—'}
                    </TableCell>
                    <TableCell>
                      {session.rating ? (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-warning fill-warning" />
                          <span>{session.rating.toFixed(1)}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        status={statusConfig[session.status].variant}
                        label={statusConfig[session.status].label}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
