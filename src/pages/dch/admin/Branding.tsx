import { useState } from 'react';
import { Upload, Check, Bot } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTenant } from '@/contexts/TenantContext';
import { cn } from '@/lib/utils';

const colorPresets = [
  { name: 'Синий', value: '#3B82F6' },
  { name: 'Зелёный', value: '#10B981' },
  { name: 'Фиолетовый', value: '#8B5CF6' },
  { name: 'Оранжевый', value: '#F59E0B' },
  { name: 'Розовый', value: '#EC4899' },
  { name: 'Бирюзовый', value: '#14B8A6' },
];

export default function AdminBranding() {
  const { currentTenant } = useTenant();
  const [accentColor, setAccentColor] = useState(currentTenant.accentColor);
  const [appTitle, setAppTitle] = useState(`${currentTenant.name} Помощник`);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Брендинг"
        description="Настройка внешнего вида приложения для пользователей"
        actions={
          <Button onClick={() => toast.success('Изменения сохранены')}>Сохранить изменения</Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings */}
        <div className="space-y-6">
          {/* Logo Upload */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4">Логотип</h2>
            <div 
              className={cn(
                "border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer",
                isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              )}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); }}
            >
              <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                Перетащите логотип сюда или
              </p>
              <Button variant="outline" size="sm">
                Выберите файл
              </Button>
              <p className="text-xs text-muted-foreground mt-4">
                PNG, SVG до 2 МБ. Рекомендуемый размер: 512x512px
              </p>
            </div>
          </div>

          {/* Color Picker */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4">Акцентный цвет</h2>
            
            <div className="grid grid-cols-6 gap-2 mb-4">
              {colorPresets.map((color) => (
                <button
                  key={color.value}
                  className={cn(
                    "w-10 h-10 rounded-lg border-2 transition-all hover:scale-110",
                    accentColor === color.value 
                      ? "border-white ring-2 ring-primary" 
                      : "border-transparent"
                  )}
                  style={{ backgroundColor: color.value }}
                  onClick={() => setAccentColor(color.value)}
                  title={color.name}
                >
                  {accentColor === color.value && (
                    <Check className="h-5 w-5 mx-auto text-white" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Label htmlFor="custom-color">Свой цвет:</Label>
              <Input
                id="custom-color"
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-16 h-10 p-1 cursor-pointer"
              />
              <Input
                value={accentColor.toUpperCase()}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-24 font-mono text-sm"
              />
            </div>
          </div>

          {/* App Name */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4">Название приложения</h2>
            <Input 
              value={appTitle}
              onChange={(e) => setAppTitle(e.target.value)}
              placeholder="Название для пользователей"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Отображается в заголовке мобильного приложения
            </p>
          </div>
        </div>

        {/* 3-Screen Preview */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-4">Предпросмотр</h2>
          
          <div className="flex gap-4 justify-center">
            {/* Splash */}
            <div className="text-center">
              <div className="border border-border rounded-[2rem] aspect-[9/19] max-w-[120px] w-full overflow-hidden bg-background flex flex-col items-center justify-center p-3">
                <Bot className="h-10 w-10 mb-2" style={{ color: accentColor }} />
                <span className="text-[10px] font-semibold text-center leading-tight">{appTitle}</span>
              </div>
              <span className="text-xs text-muted-foreground mt-2 block">Splash</span>
            </div>

            {/* Feed */}
            <div className="text-center">
              <div className="border border-border rounded-[2rem] aspect-[9/19] max-w-[120px] w-full overflow-hidden bg-background flex flex-col">
                {/* Header */}
                <div className="h-8 flex items-center px-3 gap-1.5 shrink-0 text-white" style={{ backgroundColor: accentColor }}>
                  <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[6px]">
                    {currentTenant.logo}
                  </div>
                  <span className="text-[7px] font-semibold truncate">{currentTenant.name}</span>
                </div>
                {/* Cards */}
                <div className="p-2 space-y-1.5 flex-1">
                  <div className="rounded-lg bg-muted h-12" />
                  <div className="rounded-lg bg-muted h-12" />
                  <div className="rounded-lg bg-muted/50 h-8" />
                </div>
              </div>
              <span className="text-xs text-muted-foreground mt-2 block">Лента</span>
            </div>

            {/* Chat */}
            <div className="text-center">
              <div className="border border-border rounded-[2rem] aspect-[9/19] max-w-[120px] w-full overflow-hidden bg-background flex flex-col">
                {/* Header */}
                <div className="h-8 flex items-center px-3 gap-1.5 shrink-0 text-white" style={{ backgroundColor: accentColor }}>
                  <Bot className="h-3 w-3" />
                  <span className="text-[7px] font-semibold">AI Помощник</span>
                </div>
                {/* Messages */}
                <div className="p-2 space-y-1.5 flex-1">
                  {/* Assistant */}
                  <div className="flex gap-1">
                    <div 
                      className="rounded-lg rounded-tl-none p-1.5 max-w-[80px]"
                      style={{ backgroundColor: accentColor + '1A' }}
                    >
                      <p className="text-[6px]">Здравствуйте! Чем могу помочь?</p>
                    </div>
                  </div>
                  {/* User */}
                  <div className="flex justify-end">
                    <div 
                      className="rounded-lg rounded-tr-none p-1.5 max-w-[80px] text-white"
                      style={{ backgroundColor: accentColor }}
                    >
                      <p className="text-[6px]">Вопрос по договору</p>
                    </div>
                  </div>
                </div>
                {/* Input */}
                <div className="px-2 pb-2 shrink-0">
                  <div className="bg-muted rounded-full h-5 flex items-center px-2">
                    <span className="text-[5px] text-muted-foreground">Сообщение...</span>
                  </div>
                </div>
              </div>
              <span className="text-xs text-muted-foreground mt-2 block">Чат</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
