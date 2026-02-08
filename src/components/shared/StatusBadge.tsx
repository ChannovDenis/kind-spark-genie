import { cn } from '@/lib/utils';

type Status = 'success' | 'warning' | 'error' | 'info' | 'pending' | 'in_progress' | 'resolved' | 'cancelled';

interface StatusBadgeProps {
  status: Status;
  label?: string;
  className?: string;
}

const statusConfig: Record<Status, { className: string; defaultLabel: string }> = {
  success: {
    className: 'status-badge-success',
    defaultLabel: 'Успешно',
  },
  warning: {
    className: 'status-badge-warning',
    defaultLabel: 'Внимание',
  },
  error: {
    className: 'status-badge-error',
    defaultLabel: 'Ошибка',
  },
  info: {
    className: 'status-badge-info',
    defaultLabel: 'Информация',
  },
  pending: {
    className: 'status-badge-warning',
    defaultLabel: 'Ожидает',
  },
  in_progress: {
    className: 'status-badge-info',
    defaultLabel: 'В работе',
  },
  resolved: {
    className: 'status-badge-success',
    defaultLabel: 'Решено',
  },
  cancelled: {
    className: 'bg-muted/50 text-muted-foreground',
    defaultLabel: 'Отменено',
  },
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span className={cn(config.className, className)}>
      {label || config.defaultLabel}
    </span>
  );
}
