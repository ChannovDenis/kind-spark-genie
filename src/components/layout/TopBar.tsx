import { ChevronRight, Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { TenantSelector } from '@/components/shared/TenantSelector';
import { UserMenu } from '@/components/shared/UserMenu';

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

export function TopBar() {
  const location = useLocation();
  const path = location.pathname;
  
  // Определяем секцию
  const sectionPath = '/' + path.split('/')[1];
  const sectionName = sectionNames[sectionPath] || '';
  const pageName = breadcrumbMap[path] || '';
  const isSubPage = path !== sectionPath;

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
          <TenantSelector />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
