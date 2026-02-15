import { useState } from 'react';
import { Plus, Download, FileText, Table, FileSpreadsheet, Calendar, Loader2 } from 'lucide-react';
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

function downloadCSV(report: Report) {
  const csvContent =
    'Дата,Сервис,AI-обращений,Эскалаций,CSAT\n' +
    '2026-01-15,Юрист,245,18,82%\n' +
    '2026-01-15,Психолог,189,12,91%\n' +
    '2026-01-15,Финансист,134,8,87%\n' +
    '2026-01-15,Врач,167,11,89%\n' +
    '2026-01-16,Юрист,258,20,81%\n' +
    '2026-01-16,Психолог,195,14,90%\n' +
    '2026-01-16,Финансист,142,9,86%\n' +
    '2026-01-16,Врач,171,12,88%\n' +
    '2026-01-17,Юрист,231,16,83%\n' +
    '2026-01-17,Психолог,178,10,92%\n' +
    '2026-01-17,Финансист,128,7,88%\n' +
    '2026-01-17,Врач,159,10,90%\n' +
    '2026-01-18,Юрист,267,22,80%\n' +
    '2026-01-18,Психолог,201,15,89%\n' +
    '2026-01-18,Финансист,148,10,85%\n' +
    '2026-01-18,Врач,183,13,87%\n' +
    '2026-01-19,Юрист,112,6,84%\n' +
    '2026-01-19,Психолог,89,4,93%\n' +
    '2026-01-19,Финансист,56,3,90%\n' +
    '2026-01-19,Врач,78,5,91%\n';

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${report.name.replace(/\s+/g, '_')}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast.success('Отчёт скачан');
}

export default function AdminReports() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [selectedServices, setSelectedServices] = useState<string[]>(['all']);
  const [newReportType, setNewReportType] = useState<Report['type']>('usage');
  const [newReportFormat, setNewReportFormat] = useState<Report['format']>('pdf');

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

  const handleCreateReport = () => {
    const newId = `rep-gen-${Date.now()}`;
    const newReport: Report = {
      id: newId,
      name: `${typeLabels[newReportType]} — ${new Date().toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}`,
      type: newReportType,
      createdAt: new Date().toISOString(),
      format: newReportFormat,
      size: '—',
      status: 'generating',
    };
    setReports(prev => [newReport, ...prev]);
    setIsCreateOpen(false);

    setTimeout(() => {
      setReports(prev =>
        prev.map(r =>
          r.id === newId ? { ...r, status: 'ready', size: '1.2 МБ' } : r
        )
      );
    }, 2000);
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
            {reports.map((report) => (
              <tr key={report.id}>
                <td>
                  <div className="flex items-center gap-3">
                    {report.status === 'generating' ? (
                      <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
                    ) : (
                      typeIcons[report.type]
                    )}
                    <span className={`font-medium ${report.status === 'generating' ? 'text-muted-foreground' : ''}`}>
                      {report.status === 'generating' ? 'Формируется...' : report.name}
                    </span>
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
                  {report.status !== 'generating' && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => downloadCSV(report)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
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
              <Select value={newReportType} onValueChange={(v) => setNewReportType(v as Report['type'])}>
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
              <Select value={newReportFormat} onValueChange={(v) => setNewReportFormat(v as Report['format'])}>
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
            <Button onClick={handleCreateReport}>
              Сформировать
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
