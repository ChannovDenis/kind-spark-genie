import { useState } from 'react';
import { Plus, Download, FileText, Table, FileSpreadsheet, Calendar, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { mockReports, Report } from '@/data/mockData';
import { formatDate } from '@/lib/formatters';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const typeIcons: Record<Report['type'], React.ReactNode> = {
  usage: <Table className="h-5 w-5 text-primary" />,
  billing: <FileSpreadsheet className="h-5 w-5 text-success" />,
  quality: <FileText className="h-5 w-5 text-warning" />,
  users: <FileText className="h-5 w-5 text-muted-foreground" />,
};

const typeLabels: Record<Report['type'], string> = {
  usage: 'Использование',
  billing: 'Биллинг',
  quality: 'Качество',
  users: 'Пользователи',
};

export default function AdminReports() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>(['all']);

  const toggleService = (service: string) => {
    if (service === 'all') {
      setSelectedServices(['all']);
    } else {
      const newServices = selectedServices.filter(s => s !== 'all');
      if (newServices.includes(service)) {
        setSelectedServices(newServices.filter(s => s !== service));
      } else {
        setSelectedServices([...newServices, service]);
      }
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Отчёты"
        description="Сформированные отчёты и аналитика"
        actions={
          <Button className="gap-2" onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            Создать отчёт
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Тип отчёта" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все типы</SelectItem>
            <SelectItem value="usage">Использование</SelectItem>
            <SelectItem value="billing">Биллинг</SelectItem>
            <SelectItem value="quality">Качество</SelectItem>
          </SelectContent>
        </Select>
        
        <Button variant="outline" className="gap-2">
          <Calendar className="h-4 w-4" />
          Период
        </Button>
      </div>

      {/* Reports List */}
      <div className="glass-card overflow-hidden">
        <table className="data-table">
          <thead className="bg-muted/30">
            <tr>
              <th>Название</th>
              <th>Тип</th>
              <th>Дата</th>
              <th>Формат</th>
              <th>Размер</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {mockReports.map((report) => (
              <tr key={report.id}>
                <td>
                  <div className="flex items-center gap-3">
                    {typeIcons[report.type]}
                    <span className="font-medium">{report.name}</span>
                  </div>
                </td>
                <td>
                  <span className="text-muted-foreground">
                    {typeLabels[report.type]}
                  </span>
                </td>
                <td className="text-muted-foreground">
                  {formatDate(report.createdAt)}
                </td>
                <td>
                  <span className="uppercase text-xs font-medium px-2 py-1 rounded bg-muted">
                    {report.format}
                  </span>
                </td>
                <td className="text-muted-foreground">{report.size}</td>
                <td>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Report Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Создать отчёт</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Тип отчёта</Label>
              <Select defaultValue="usage">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usage">Отчёт по использованию</SelectItem>
                  <SelectItem value="billing">Финансовый отчёт</SelectItem>
                  <SelectItem value="quality">Отчёт по качеству</SelectItem>
                  <SelectItem value="users">Отчёт по пользователям</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Период</Label>
              <Select defaultValue="month">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Последняя неделя</SelectItem>
                  <SelectItem value="month">Последний месяц</SelectItem>
                  <SelectItem value="quarter">Последний квартал</SelectItem>
                  <SelectItem value="custom">Произвольный период</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Сервисы</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'all', label: 'Все сервисы' },
                  { id: 'lawyer', label: 'Юрист' },
                  { id: 'doctor', label: 'Врач' },
                  { id: 'psychologist', label: 'Психолог' },
                  { id: 'financier', label: 'Финансист' },
                  { id: 'fitness', label: 'Фитнес' },
                ].map((service) => (
                  <div key={service.id} className="flex items-center gap-2">
                    <Checkbox 
                      id={service.id}
                      checked={selectedServices.includes(service.id)}
                      onCheckedChange={() => toggleService(service.id)}
                    />
                    <Label htmlFor={service.id} className="font-normal cursor-pointer">
                      {service.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Формат</Label>
              <Select defaultValue="pdf">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Отмена
            </Button>
            <Button onClick={() => {
              toast.success('Отчёт формируется...');
              setIsCreateOpen(false);
            }}>
              Сформировать
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
