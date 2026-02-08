import { Check, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useTenant, Tenant } from '@/contexts/TenantContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function TenantSelector() {
  const { currentTenant, setCurrentTenant, tenants } = useTenant();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="gap-2 h-9 px-3 text-sm font-normal"
        >
          <span className="text-lg">{currentTenant.logo}</span>
          <span className="max-w-[120px] truncate">{currentTenant.name}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[220px]">
        {tenants.map((tenant) => (
          <DropdownMenuItem
            key={tenant.id}
            onClick={() => {
              if (tenant.id !== currentTenant.id) {
                setCurrentTenant(tenant);
                toast.success(`Переключено на ${tenant.name}`);
              }
            }}
            className={cn(
              "flex items-center gap-3 cursor-pointer",
              tenant.id === currentTenant.id && "bg-accent"
            )}
          >
            <span className="text-lg">{tenant.logo}</span>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{tenant.name}</div>
              <div className="text-xs text-muted-foreground">
                {tenant.usersCount.toLocaleString('ru-RU')} пользователей
              </div>
            </div>
            {tenant.id === currentTenant.id && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
