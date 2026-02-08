import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  CreditCard,
  Users,
  Palette,
  FileText,
  Headphones,
  Calendar,
  MessageSquare,
  FileCheck,
  ShieldCheck,
  ListChecks,
  Book,
  Sparkles,
  Wand2,
  Building2,
  Settings,
  BarChart3,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { useTenant } from '@/contexts/TenantContext';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface MenuItem {
  title: string;
  url: string;
  icon: React.ElementType;
}

interface MenuGroup {
  label: string;
  emoji: string;
  basePath: string;
  items: MenuItem[];
}

const menuGroups: MenuGroup[] = [
  {
    label: 'Партнёр',
    emoji: '🏢',
    basePath: '/admin',
    items: [
      { title: 'Дашборд', url: '/admin', icon: LayoutDashboard },
      { title: 'Биллинг', url: '/admin/billing', icon: CreditCard },
      { title: 'Пользователи', url: '/admin/users', icon: Users },
      { title: 'Брендинг', url: '/admin/branding', icon: Palette },
      { title: 'Отчёты', url: '/admin/reports', icon: FileText },
    ],
  },
  {
    label: 'Эксперт',
    emoji: '👨‍⚕️',
    basePath: '/expert',
    items: [
      { title: 'Кабинет', url: '/expert', icon: Headphones },
      { title: 'Расписание', url: '/expert/schedule', icon: Calendar },
      { title: 'Сессии', url: '/expert/sessions', icon: MessageSquare },
      { title: 'Заключения', url: '/expert/conclusions', icon: FileCheck },
    ],
  },
  {
    label: 'Quality Center',
    emoji: '🎯',
    basePath: '/quality',
    items: [
      { title: 'Дашборд', url: '/quality', icon: ShieldCheck },
      { title: 'Разбор диалогов', url: '/quality/dialogs', icon: ListChecks },
      { title: 'База знаний', url: '/quality/knowledge', icon: Book },
      { title: 'Дообучение', url: '/quality/training', icon: Sparkles },
    ],
  },
  {
    label: 'Супер-админ',
    emoji: '⚡',
    basePath: '/super',
    items: [
      { title: 'Тенанты', url: '/super', icon: Building2 },
      { title: 'Тарифы', url: '/super/pricing', icon: BarChart3 },
      { title: 'Настройки', url: '/super/settings', icon: Settings },
      { title: 'Конструктор', url: '/super/builder', icon: Wand2 },
    ],
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { state } = useSidebar();
  const { currentTenant } = useTenant();
  const collapsed = state === 'collapsed';
  
  const [openGroups, setOpenGroups] = useState<string[]>(() => {
    // Открываем группу, соответствующую текущему маршруту
    const currentGroup = menuGroups.find(g => 
      location.pathname.startsWith(g.basePath)
    );
    return currentGroup ? [currentGroup.basePath] : ['/admin'];
  });

  const toggleGroup = (basePath: string) => {
    setOpenGroups(prev => 
      prev.includes(basePath) 
        ? prev.filter(p => p !== basePath)
        : [...prev, basePath]
    );
  };

  const isActive = (url: string) => {
    if (url === '/admin' || url === '/expert' || url === '/quality' || url === '/super') {
      return location.pathname === url;
    }
    return location.pathname.startsWith(url);
  };

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-xl">
            {currentTenant.logo}
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-semibold text-sm">{currentTenant.name}</span>
              <span className="text-xs text-muted-foreground">AI Platform</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        {menuGroups.map((group) => {
          const isOpen = openGroups.includes(group.basePath);
          const hasActiveItem = group.items.some(item => isActive(item.url));

          return (
            <Collapsible
              key={group.basePath}
              open={isOpen || hasActiveItem}
              onOpenChange={() => toggleGroup(group.basePath)}
            >
              <SidebarGroup>
                <CollapsibleTrigger asChild>
                  <SidebarGroupLabel 
                    className={cn(
                      "cursor-pointer hover:bg-sidebar-accent rounded-lg transition-colors px-3 py-2",
                      hasActiveItem && "text-primary"
                    )}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <span>{group.emoji}</span>
                        {!collapsed && <span>{group.label}</span>}
                      </div>
                      {!collapsed && (
                        isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
                      )}
                    </div>
                  </SidebarGroupLabel>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {group.items.map((item) => (
                        <SidebarMenuItem key={item.url}>
                          <SidebarMenuButton
                            asChild
                            isActive={isActive(item.url)}
                            tooltip={collapsed ? item.title : undefined}
                          >
                            <Link to={item.url} className="flex items-center gap-3">
                              <item.icon className="h-4 w-4" />
                              {!collapsed && <span>{item.title}</span>}
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          );
        })}
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        {!collapsed && (
          <div className="text-xs text-muted-foreground text-center">
            Добросервис 2.0 • Demo
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
