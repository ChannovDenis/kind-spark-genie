import { mockEscalations, services } from '@/data/mockData';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatRelativeDate } from '@/lib/formatters';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function RecentEscalations() {
  const getServiceInfo = (serviceId: string) => 
    services.find(s => s.id === serviceId) || { name: serviceId, icon: '📋' };

  return (
    <div className="space-y-3">
      {mockEscalations.slice(0, 5).map((escalation) => {
        const service = getServiceInfo(escalation.service);
        const initials = escalation.userName
          .split(' ')
          .map(n => n[0])
          .join('');

        return (
          <div 
            key={escalation.id} 
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
          >
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm truncate">
                  {escalation.userName}
                </span>
                <span className="text-sm">{service.icon}</span>
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {escalation.topic}
              </p>
            </div>
            
            <div className="flex flex-col items-end gap-1">
              <StatusBadge status={escalation.status} />
              <span className="text-xs text-muted-foreground">
                {formatRelativeDate(escalation.createdAt)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
