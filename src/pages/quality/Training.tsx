import { useState, useMemo } from 'react';
import { Plus, Filter, BarChart3, Layers, AlertTriangle, Brain, MessageSquare, Scale } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { MetricCard } from '@/components/shared/MetricCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TrainingCaseCard } from '@/components/quality/TrainingCaseCard';
import { TrainingCaseDetail } from '@/components/quality/TrainingCaseDetail';
import { TrainingBatchCard } from '@/components/quality/TrainingBatchCard';
import { 
  trainingCases, 
  trainingBatches, 
  trainingStats,
  TrainingCase,
  TrainingBatch,
  ErrorCategory,
  errorCategoryLabels,
  serviceLabels
} from '@/data/trainingData';
import { toast } from 'sonner';

export default function Training() {
  const [selectedCase, setSelectedCase] = useState<TrainingCase | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');

  const filteredCases = useMemo(() => {
    return trainingCases.filter(c => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && c.errorCategory !== categoryFilter) return false;
      if (serviceFilter !== 'all' && c.service !== serviceFilter) return false;
      return true;
    });
  }, [statusFilter, categoryFilter, serviceFilter]);

  const handleApprove = (trainingCase: TrainingCase) => {
    toast.success(`Кейс одобрен и добавлен в очередь обучения`);
    setSelectedCase(null);
  };

  const handleReject = (trainingCase: TrainingCase) => {
    toast.info(`Кейс отклонён`);
    setSelectedCase(null);
  };

  const handleEdit = (trainingCase: TrainingCase) => {
    toast.info(`Открыть редактор для кейса ${trainingCase.id}`);
  };

  const handleStartBatch = (batch: TrainingBatch) => {
    toast.success(`Обучение "${batch.name}" запущено`);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="p-6 pb-4">
        <PageHeader
          title="Дообучение"
          description="Кейсы для fine-tuning AI-модели"
          actions={
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Добавить кейс
            </Button>
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          <MetricCard
            title="Всего кейсов"
            value={trainingStats.totalCases}
            icon={<Layers className="h-4 w-4" />}
          />
          <MetricCard
            title="На проверке"
            value={trainingStats.pendingReview}
            icon={<AlertTriangle className="h-4 w-4" />}
            change={-5}
            changeLabel="за неделю"
          />
          <MetricCard
            title="Одобрено"
            value={trainingStats.approvedCases}
            icon={<MessageSquare className="h-4 w-4" />}
          />
          <MetricCard
            title="Обучено"
            value={trainingStats.trainedCases}
            icon={<Brain className="h-4 w-4" />}
            change={12}
            changeLabel="за неделю"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="cases" className="flex-1 flex flex-col min-h-0 px-6">
        <TabsList className="w-fit">
          <TabsTrigger value="cases">Кейсы</TabsTrigger>
          <TabsTrigger value="batches">Пакеты обучения</TabsTrigger>
          <TabsTrigger value="stats">Статистика</TabsTrigger>
        </TabsList>

        {/* Cases Tab */}
        <TabsContent value="cases" className="flex-1 min-h-0 mt-4">
          <div className="h-full grid grid-cols-[350px_1fr] gap-4 border rounded-lg overflow-hidden">
            {/* Left: Cases List */}
            <div className="border-r flex flex-col">
              {/* Filters */}
              <div className="p-3 border-b space-y-2">
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Статус" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все статусы</SelectItem>
                      <SelectItem value="pending">На проверке</SelectItem>
                      <SelectItem value="approved">Одобрено</SelectItem>
                      <SelectItem value="rejected">Отклонено</SelectItem>
                      <SelectItem value="trained">Обучено</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Категория" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все категории</SelectItem>
                      {Object.entries(errorCategoryLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Select value={serviceFilter} onValueChange={setServiceFilter}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Сервис" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все сервисы</SelectItem>
                    {Object.entries(serviceLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Cases */}
              <ScrollArea className="flex-1">
                <div className="p-3 space-y-3">
                  {filteredCases.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Нет кейсов по выбранным фильтрам
                    </p>
                  ) : (
                    filteredCases.map(c => (
                      <TrainingCaseCard
                        key={c.id}
                        trainingCase={c}
                        onSelect={setSelectedCase}
                        onApprove={handleApprove}
                        onReject={handleReject}
                        isSelected={selectedCase?.id === c.id}
                      />
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Right: Case Detail */}
            <TrainingCaseDetail
              trainingCase={selectedCase}
              onApprove={handleApprove}
              onReject={handleReject}
              onEdit={handleEdit}
            />
          </div>
        </TabsContent>

        {/* Batches Tab */}
        <TabsContent value="batches" className="flex-1 min-h-0 mt-4">
          <div className="grid grid-cols-3 gap-4">
            {trainingBatches.map(batch => (
              <TrainingBatchCard
                key={batch.id}
                batch={batch}
                onStart={handleStartBatch}
              />
            ))}
          </div>
        </TabsContent>

        {/* Stats Tab */}
        <TabsContent value="stats" className="flex-1 min-h-0 mt-4">
          <div className="grid grid-cols-2 gap-6">
            {/* By Category */}
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Scale className="h-4 w-4" />
                По категориям ошибок
              </h3>
              <div className="space-y-3">
                {Object.entries(trainingStats.byCategory).map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm">{errorCategoryLabels[category as ErrorCategory]}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${(count / trainingStats.totalCases) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* By Service */}
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                По сервисам
              </h3>
              <div className="space-y-3">
                {Object.entries(trainingStats.byService).map(([service, count]) => (
                  <div key={service} className="flex items-center justify-between">
                    <span className="text-sm">{serviceLabels[service]}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${(count / trainingStats.totalCases) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
