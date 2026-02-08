import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge, Status } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { miniApps, MiniAppStatus } from '@/data/miniAppsData';
import { cn } from '@/lib/utils';

const getStatusBadgeProps = (status: MiniAppStatus): { status: Status; label: string } => {
  switch (status) {
    case 'active':
      return { status: 'success', label: 'Активен' };
    case 'draft':
      return { status: 'cancelled', label: 'Черновик' };
    case 'testing':
      return { status: 'warning', label: 'Тестирование' };
  }
};

export default function MiniApps() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Мини-приложения"
        description="Вертикальные AI-сервисы платформы"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {miniApps.map((app) => {
          const Icon = app.icon;
          const statusProps = getStatusBadgeProps(app.status);
          const tenantCount = Object.values(app.tenants).filter(Boolean).length;

          return (
            <div key={app.id} className="glass-card p-4 space-y-3">
              {/* Header: Icon + Title */}
              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center bg-muted/50",
                  app.color
                )}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base">{app.name}</h3>
                  <p className="text-[13px] text-muted-foreground line-clamp-2">
                    {app.description}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Tenants */}
              <div className="flex flex-wrap gap-1.5">
                <Badge 
                  variant={app.tenants.gpb ? "default" : "secondary"}
                  className={cn(
                    "text-xs",
                    app.tenants.gpb 
                      ? "bg-green-500/20 text-green-400 hover:bg-green-500/30" 
                      : "bg-muted/50 text-muted-foreground"
                  )}
                >
                  ГПБ
                </Badge>
                <Badge 
                  variant={app.tenants.wb ? "default" : "secondary"}
                  className={cn(
                    "text-xs",
                    app.tenants.wb 
                      ? "bg-green-500/20 text-green-400 hover:bg-green-500/30" 
                      : "bg-muted/50 text-muted-foreground"
                  )}
                >
                  WB
                </Badge>
                <Badge 
                  variant={app.tenants.mec ? "default" : "secondary"}
                  className={cn(
                    "text-xs",
                    app.tenants.mec 
                      ? "bg-green-500/20 text-green-400 hover:bg-green-500/30" 
                      : "bg-muted/50 text-muted-foreground"
                  )}
                >
                  МЭЦ
                </Badge>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>{app.stats.requests.toLocaleString('ru-RU')} обращений</span>
                <span>•</span>
                <span>
                  {app.stats.rating !== null ? `${app.stats.rating} ⭐` : '— ⭐'}
                </span>
              </div>

              {/* Status + Button */}
              <div className="flex items-center justify-between pt-1">
                <StatusBadge {...statusProps} />
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/super/mini-apps/${app.id}/config`}>
                    <Settings className="h-4 w-4 mr-1.5" />
                    Настроить
                  </Link>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
