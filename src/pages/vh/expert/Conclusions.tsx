import { useState } from 'react';
import { Download, Search, FileText, Send, Clock, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { expertConclusions, type ConclusionType, type ConclusionStatus } from '@/data/mockData';
import { toast } from 'sonner';

const typeLabels: Record<ConclusionType, string> = {
  consultation: 'Консультация',
  referral: 'Направление',
  general: 'Общее',
};

const statusConfig: Record<ConclusionStatus, { variant: 'success' | 'warning' | 'default'; label: string; icon: typeof CheckCircle }> = {
  completed: { variant: 'success', label: 'Готово', icon: CheckCircle },
  sent: { variant: 'success', label: 'Отправлено', icon: Send },
  draft: { variant: 'warning', label: 'Черновик', icon: Clock },
};

export default function ExpertConclusions() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConclusions = expertConclusions.filter((conclusion) => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'consultation' && conclusion.type === 'consultation') ||
      (activeTab === 'referral' && conclusion.type === 'referral');

    const matchesSearch =
      !searchQuery ||
      conclusion.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conclusion.text.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const handleExport = () => {
    const header = 'Клиент,Тип,Дата,Статус,Текст\n';
    const rows = filteredConclusions.map(c =>
      `${c.clientName},${typeLabels[c.type]},${format(new Date(c.date), 'dd.MM.yyyy')},${statusConfig[c.status].label},"${c.text.replace(/"/g, '""')}"`
    ).join('\n');
    const blob = new Blob(['\uFEFF' + header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'conclusions_export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Файл conclusions_export.csv скачан');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Заключения"
        description="Архив всех оформленных заключений"
        actions={
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Экспорт
          </Button>
        }
      />

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по клиенту или тексту..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Все ({expertConclusions.length})</TabsTrigger>
          <TabsTrigger value="consultation">
            Консультации ({expertConclusions.filter((c) => c.type === 'consultation').length})
          </TabsTrigger>
          <TabsTrigger value="referral">
            Направления ({expertConclusions.filter((c) => c.type === 'referral').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <div className="glass-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">#</TableHead>
                  <TableHead>Клиент</TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead className="w-[100px]">Дата</TableHead>
                  <TableHead className="w-[130px]">Статус</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredConclusions.map((conclusion, index) => {
                  const StatusIcon = statusConfig[conclusion.status].icon;
                  return (
                    <TableRow key={conclusion.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-mono text-muted-foreground">
                        {expertConclusions.length - index}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          {conclusion.clientName}
                        </div>
                      </TableCell>
                      <TableCell>{typeLabels[conclusion.type]}</TableCell>
                      <TableCell>
                        {format(new Date(conclusion.date), 'dd.MM.yy', { locale: ru })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <StatusIcon className={`h-4 w-4 ${
                            conclusion.status === 'draft' ? 'text-warning' : 'text-success'
                          }`} />
                          <span className={
                            conclusion.status === 'draft' ? 'text-warning' : 'text-success'
                          }>
                            {statusConfig[conclusion.status].label}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
