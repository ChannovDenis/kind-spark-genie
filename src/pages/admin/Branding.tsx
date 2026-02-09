import { useState } from 'react';
import { Upload, Smartphone, Check } from 'lucide-react';
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
              defaultValue={`${currentTenant.name} Помощник`}
              placeholder="Название для пользователей"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Отображается в заголовке мобильного приложения
            </p>
          </div>
        </div>

        {/* Phone Preview */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-4">Предпросмотр</h2>
          
          <div className="flex justify-center">
            <div className="relative">
              {/* Phone Frame */}
              <div className="w-[280px] h-[580px] bg-black rounded-[40px] p-3 shadow-2xl">
                <div className="w-full h-full bg-background rounded-[32px] overflow-hidden relative">
                  {/* Status Bar */}
                  <div className="h-12 flex items-center justify-center">
                    <div className="w-24 h-6 bg-black rounded-full" />
                  </div>
                  
                  {/* App Header */}
                  <div 
                    className="h-16 flex items-center px-4 gap-3"
                    style={{ backgroundColor: accentColor }}
                  >
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">
                      {currentTenant.logo}
                    </div>
                    <div className="text-white">
                      <div className="font-semibold text-sm">{currentTenant.name}</div>
                      <div className="text-xs opacity-80">AI Помощник</div>
                    </div>
                  </div>

                  {/* Chat Area */}
                  <div className="p-4 space-y-3">
                    <div className="flex gap-2">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs"
                        style={{ backgroundColor: accentColor }}
                      >
                        AI
                      </div>
                      <div className="bg-muted rounded-2xl rounded-tl-none p-3 max-w-[180px]">
                        <p className="text-xs">Здравствуйте! Чем могу помочь?</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 justify-end">
                      <div 
                        className="rounded-2xl rounded-tr-none p-3 max-w-[180px] text-white"
                        style={{ backgroundColor: accentColor }}
                      >
                        <p className="text-xs">Вопрос по трудовому договору</p>
                      </div>
                    </div>
                  </div>

                  {/* Input */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-muted rounded-full h-10 flex items-center px-4">
                      <span className="text-xs text-muted-foreground">Введите сообщение...</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Phone Icon */}
              <Smartphone 
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 h-6 w-6 text-muted-foreground" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
