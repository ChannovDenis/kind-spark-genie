import { useState } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Download, Calendar } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { MetricCard } from '@/components/shared/MetricCard';
import { StatusBadge, type Status } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface EarningRecord {
  id: string;
  date: string;
  client: string;
  service: string;
  duration: number;
  amount: number;
  status: 'paid' | 'pending' | 'processing';
}

const mockEarnings: EarningRecord[] = [
  { id: 'e-001', date: '2026-02-08', client: 'Иван Петров', service: 'Консультация юриста', duration: 45, amount: 4500, status: 'paid' },
  { id: 'e-002', date: '2026-02-07', client: 'Мария Сидорова', service: 'Врач-терапевт', duration: 30, amount: 2500, status: 'paid' },
  { id: 'e-003', date: '2026-02-06', client: 'Алексей Козлов', service: 'Финансовый консультант', duration: 60, amount: 5500, status: 'paid' },
  { id: 'e-004', date: '2026-02-05', client: 'Елена Новикова', service: 'Психолог', duration: 50, amount: 4000, status: 'processing' },
  { id: 'e-005', date: '2026-02-04', client: 'Дмитрий Волков', service: 'Консультация юриста', duration: 40, amount: 3500, status: 'pending' },
];

const statusConfig: Record<string, { label: string; status: Status }> = {
  paid: { label: 'Выплачено', status: 'success' },
  pending: { label: 'Ожидает', status: 'pending' },
  processing: { label: 'Обработка', status: 'in_progress' },
};

export default function Earnings() {
  const [period, setPeriod] = useState('february');

  const totalAmount = mockEarnings.reduce((sum, e) => sum + e.amount, 0);
  const consultationsCount = mockEarnings.length;
  const averageAmount = Math.round(totalAmount / consultationsCount);

  const handleExport = () => {
    const header = 'Дата,Клиент,Сервис,Длительность (мин),Сумма (₽),Статус\n';
    const rows = mockEarnings.map(r =>
      `${r.date},${r.client},${r.service},${r.duration},${r.amount},${statusConfig[r.status].label}`
    ).join('\n');
    const blob = new Blob(['\uFEFF' + header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'earnings_export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Файл earnings_export.csv скачан');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Доходы"
        description="Отслеживание заработка за консультации"
        actions={
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[160px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="february">Февраль 2026</SelectItem>
              <SelectItem value="january">Январь 2026</SelectItem>
              <SelectItem value="december">Декабрь 2025</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="За февраль"
          value={`${totalAmount.toLocaleString('ru-RU')} ₽`}
          icon={<span className="text-xl">💰</span>}
        />
        <MetricCard
          title="Консультаций"
          value={consultationsCount.toString()}
          icon={<span className="text-xl">📋</span>}
        />
        <MetricCard
          title="Средняя"
          value={`${averageAmount.toLocaleString('ru-RU')} ₽`}
          icon={<span className="text-xl">📊</span>}
        />
      </div>

      {/* Table */}
      <div className="glass-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Дата</TableHead>
              <TableHead>Клиент</TableHead>
              <TableHead>Сервис</TableHead>
              <TableHead className="text-center">Длительность</TableHead>
              <TableHead className="text-right">Сумма</TableHead>
              <TableHead>Статус</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockEarnings.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="text-muted-foreground">
                  {format(new Date(record.date), 'd MMM', { locale: ru })}
                </TableCell>
                <TableCell className="font-medium">{record.client}</TableCell>
                <TableCell className="text-muted-foreground">{record.service}</TableCell>
                <TableCell className="text-center">{record.duration} мин</TableCell>
                <TableCell className="text-right font-medium">
                  {record.amount.toLocaleString('ru-RU')} ₽
                </TableCell>
                <TableCell>
                  <StatusBadge
                    status={statusConfig[record.status].status}
                    label={statusConfig[record.status].label}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-border">
          <div className="text-sm">
            <span className="text-muted-foreground">Итого за период: </span>
            <span className="font-semibold text-lg">{totalAmount.toLocaleString('ru-RU')} ₽</span>
          </div>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Выгрузить отчёт
          </Button>
        </div>
      </div>
    </div>
  );
}
