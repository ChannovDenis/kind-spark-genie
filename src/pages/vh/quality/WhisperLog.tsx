import { useState } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Filter, Calendar } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface WhisperLogEntry {
  id: string;
  timestamp: string;
  type: 'supervisor_to_agent' | 'agent_decision';
  message: string;
  confidence: number;
  result: 'accepted' | 'rejected';
}

const mockWhisperLog: WhisperLogEntry[] = [
  {
    id: 'wl-001',
    timestamp: '2026-02-08T14:23:01',
    type: 'supervisor_to_agent',
    message: 'Клиент спрашивает о возврате товара. Рекомендую уточнить срок покупки и наличие чека.',
    confidence: 0.92,
    result: 'accepted',
  },
  {
    id: 'wl-002',
    timestamp: '2026-02-08T14:22:45',
    type: 'agent_decision',
    message: 'Применяю шаблон ответа "Возврат товара - базовая информация"',
    confidence: 0.88,
    result: 'accepted',
  },
  {
    id: 'wl-003',
    timestamp: '2026-02-08T14:21:30',
    type: 'supervisor_to_agent',
    message: 'Обнаружена потенциальная эскалация. Клиент выражает недовольство качеством товара.',
    confidence: 0.76,
    result: 'accepted',
  },
  {
    id: 'wl-004',
    timestamp: '2026-02-08T14:20:15',
    type: 'agent_decision',
    message: 'Предлагаю скидку 10% на следующую покупку',
    confidence: 0.45,
    result: 'rejected',
  },
  {
    id: 'wl-005',
    timestamp: '2026-02-08T14:19:00',
    type: 'supervisor_to_agent',
    message: 'Клиент упомянул юридические термины. Рекомендую направить к специалисту.',
    confidence: 0.82,
    result: 'accepted',
  },
  {
    id: 'wl-006',
    timestamp: '2026-02-08T14:17:30',
    type: 'agent_decision',
    message: 'Инициирую эскалацию к юристу',
    confidence: 0.91,
    result: 'accepted',
  },
  {
    id: 'wl-007',
    timestamp: '2026-02-08T14:15:45',
    type: 'supervisor_to_agent',
    message: 'Клиент интересуется медицинскими рекомендациями. Внимание: не давать диагнозы.',
    confidence: 0.95,
    result: 'accepted',
  },
  {
    id: 'wl-008',
    timestamp: '2026-02-08T14:14:20',
    type: 'agent_decision',
    message: 'Рекомендую записаться на приём к врачу',
    confidence: 0.89,
    result: 'accepted',
  },
  {
    id: 'wl-009',
    timestamp: '2026-02-08T14:12:00',
    type: 'supervisor_to_agent',
    message: 'Подозрение на галлюцинацию в предыдущем ответе. Проверьте факты.',
    confidence: 0.35,
    result: 'rejected',
  },
  {
    id: 'wl-010',
    timestamp: '2026-02-08T14:10:30',
    type: 'agent_decision',
    message: 'Корректирую ответ на основе актуальной базы знаний',
    confidence: 0.87,
    result: 'accepted',
  },
];

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 0.7) return 'text-success';
  if (confidence >= 0.4) return 'text-warning';
  return 'text-destructive';
};

const getConfidenceBg = (confidence: number) => {
  if (confidence >= 0.7) return 'bg-success/10';
  if (confidence >= 0.4) return 'bg-warning/10';
  return 'bg-destructive/10';
};

export default function WhisperLog() {
  const [resultFilter, setResultFilter] = useState<string>('all');
  const [confidenceFilter, setConfidenceFilter] = useState<string>('all');

  const filteredLog = mockWhisperLog.filter((entry) => {
    const matchesResult = resultFilter === 'all' || entry.result === resultFilter;
    const matchesConfidence =
      confidenceFilter === 'all' ||
      (confidenceFilter === 'high' && entry.confidence >= 0.7) ||
      (confidenceFilter === 'medium' && entry.confidence >= 0.4 && entry.confidence < 0.7) ||
      (confidenceFilter === 'low' && entry.confidence < 0.4);
    return matchesResult && matchesConfidence;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Лог шёпота"
        description="Мониторинг решений AI Supervisor в реальном времени"
      />

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select value={resultFilter} onValueChange={setResultFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Результат" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все результаты</SelectItem>
            <SelectItem value="accepted">Принято</SelectItem>
            <SelectItem value="rejected">Отклонено</SelectItem>
          </SelectContent>
        </Select>

        <Select value={confidenceFilter} onValueChange={setConfidenceFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Confidence" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все уровни</SelectItem>
            <SelectItem value="high">Высокий (≥0.7)</SelectItem>
            <SelectItem value="medium">Средний (0.4-0.7)</SelectItem>
            <SelectItem value="low">Низкий (&lt;0.4)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Timeline Log */}
      <div className="glass-card p-4">
        <div className="space-y-4">
          {filteredLog.map((entry) => (
            <div
              key={entry.id}
              className={cn(
                'p-4 rounded-lg border-l-4 font-mono text-sm',
                entry.result === 'accepted' ? 'border-l-success/50' : 'border-l-destructive/50',
                getConfidenceBg(entry.confidence)
              )}
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(entry.timestamp), 'dd.MM.yyyy HH:mm:ss', { locale: ru })}
                  </span>
                  <span
                    className={cn(
                      'text-xs px-2 py-0.5 rounded',
                      entry.type === 'supervisor_to_agent'
                        ? 'bg-primary/20 text-primary'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {entry.type === 'supervisor_to_agent' ? 'Supervisor → Agent' : 'Agent decision'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn('text-xs font-medium', getConfidenceColor(entry.confidence))}>
                    {(entry.confidence * 100).toFixed(0)}%
                  </span>
                  <span
                    className={cn(
                      'text-xs px-2 py-0.5 rounded',
                      entry.result === 'accepted'
                        ? 'bg-success/20 text-success'
                        : 'bg-destructive/20 text-destructive'
                    )}
                  >
                    {entry.result === 'accepted' ? 'Принято' : 'Отклонено'}
                  </span>
                </div>
              </div>
              <p className="text-foreground">{entry.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
