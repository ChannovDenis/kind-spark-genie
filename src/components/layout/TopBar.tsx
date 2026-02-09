import { useState } from 'react';
import { ChevronRight, Menu, Bell, AlertTriangle, UserPlus, CheckCircle, Calendar, TrendingUp, CreditCard, FileCheck } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { TenantSelector } from '@/components/shared/TenantSelector';
import { UserMenu } from '@/components/shared/UserMenu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

const breadcrumbMap: Record<string, string> = {
  '/admin': 'Дашборд',
  '/admin/billing': 'Биллинг',
  '/admin/users': 'Пользователи',
  '/admin/branding': 'Брендинг',
  '/admin/reports': 'Отчёты',
  '/expert': 'Кабинет эксперта',
  '/expert/schedule': 'Расписание',
  '/expert/sessions': 'Сессии',
  '/expert/conclusions': 'Заключения',
  '/quality': 'Quality Center',
  '/quality/dialogs': 'Разбор диалогов',
  '/quality/knowledge': 'База знаний',
  '/quality/training': 'Дообучение',
  '/super': 'Тенанты',
  '/super/pricing': 'Тарифы',
  '/super/settings': 'Настройки',
  '/super/builder': 'Конструктор',
};

const sectionNames: Record<string, string> = {
  '/admin': 'Партнёрская панель',
  '/expert': 'Кабинет эксперта',
  '/quality': 'Quality Center',
  '/super': 'Супер-админ',
};

const initialNotifications = [
  { id: 1, icon: AlertTriangle, color: 'text-destructive', text: 'Критичная ошибка в диалоге #847 — галлюцинация', time: '5 мин назад', unread: true },
  { id: 2, icon: UserPlus, color: 'text-warning', text: 'Новая эскалация: клиент запросил юриста', time: '12 мин назад', unread: true },
  { id: 3, icon: CheckCircle, color: 'text-success', text: "Видео 'Упражнения для спины' опубликовано", time: '30 мин назад', unread: true },
  { id: 4, icon: Calendar, color: 'text-primary', text: 'Консультация с Д. Ивановым через 15 мин', time: '45 мин назад', unread: true },
  { id: 5, icon: TrendingUp, color: 'text-warning', text: "Тренд: 'Налоговый вычет' — рекомендуем ролик", time: '1 час назад', unread: true },
  { id: 6, icon: CreditCard, color: 'text-success', text: 'Газпромбанк: квота AI-обращений 80%', time: '2 часа назад', unread: false },
  { id: 7, icon: FileCheck, color: 'text-primary', text: 'Отчёт за январь готов к скачиванию', time: 'вчера', unread: false },
];

export function TopBar() {
  const location = useLocation();
  const path = location.pathname;
  const [notifications, setNotifications] = useState(initialNotifications);
  
  const unreadCount = notifications.filter(n => n.unread).length;
  
  // Определяем секцию
  const sectionPath = '/' + path.split('/')[1];
  const sectionName = sectionNames[sectionPath] || '';
  const pageName = breadcrumbMap[path] || '';
  const isSubPage = path !== sectionPath;

  const handleNotificationClick = (id: number) => {
    toast.info('Перенаправление...');
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, unread: false } : n)
    );
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    toast.success('Все уведомления прочитаны');
  };

  return (
    <header className="h-14 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Menu className="h-4 w-4" />
            </Button>
          </SidebarTrigger>
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">{sectionName}</span>
            {isSubPage && pageName && (
              <>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{pageName}</span>
              </>
            )}
            {!isSubPage && pageName && (
              <>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{pageName}</span>
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications Bell */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-8 w-8">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-medium">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[380px] p-0">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <span className="font-semibold">Уведомления</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-auto py-1 px-2 text-xs text-muted-foreground hover:text-foreground"
                  onClick={handleMarkAllRead}
                >
                  Прочитать все
                </Button>
              </div>
              <ScrollArea className="h-[400px]">
                <div className="py-1">
                  {notifications.map((notification) => {
                    const IconComponent = notification.icon;
                    return (
                      <button
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification.id)}
                        className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left ${
                          notification.unread ? 'bg-primary/5' : ''
                        }`}
                      >
                        {notification.unread && (
                          <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        )}
                        {!notification.unread && <span className="w-2 flex-shrink-0" />}
                        <IconComponent className={`h-5 w-5 flex-shrink-0 mt-0.5 ${notification.color}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm leading-snug">{notification.text}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>

          <TenantSelector />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
