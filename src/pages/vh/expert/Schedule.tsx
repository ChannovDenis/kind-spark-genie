import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Coffee, 
  Play, 
  Settings,
  Plus
} from 'lucide-react';
import { format, startOfWeek, addDays, addWeeks, subWeeks, isSameDay } from 'date-fns';
import { ru } from 'date-fns/locale';

import { PageHeader } from '@/components/shared/PageHeader';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Types
interface TimeSlot {
  id: string;
  date: string;
  time: string;
  type: 'free' | 'booked' | 'break';
  client?: {
    name: string;
    topic: string;
    service: string;
  };
}

// Mock data generator
function generateMockSlots(weekStart: Date): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const times = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
  
  const mockClients = [
    { name: 'Иван Петров', topic: 'Расторжение договора', service: 'Юрист' },
    { name: 'Мария Сидорова', topic: 'Консультация по диагнозу', service: 'Врач' },
    { name: 'Алексей Козлов', topic: 'Налоговый вычет', service: 'Финансист' },
    { name: 'Елена Новикова', topic: 'Семейная терапия', service: 'Психолог' },
    { name: 'Дмитрий Волков', topic: 'Трудовой спор', service: 'Юрист' },
    { name: 'Анна Морозова', topic: 'Профилактический осмотр', service: 'Врач' },
    { name: 'Сергей Лебедев', topic: 'Инвестиции', service: 'Финансист' },
    { name: 'Ольга Федорова', topic: 'Стресс-менеджмент', service: 'Психолог' },
  ];

  for (let dayOffset = 0; dayOffset < 5; dayOffset++) {
    const currentDate = addDays(weekStart, dayOffset);
    const dateStr = format(currentDate, 'yyyy-MM-dd');

    times.forEach((time, timeIndex) => {
      const slotId = `${dateStr}-${time}`;
      
      // Deterministic pattern based on day and time
      const seed = (dayOffset * 10 + timeIndex) % 10;
      
      let slotType: 'free' | 'booked' | 'break';
      let client: TimeSlot['client'] | undefined;

      if (time === '13:00') {
        // Lunch break
        slotType = 'break';
      } else if (seed < 4) {
        // 40% booked
        slotType = 'booked';
        client = mockClients[(dayOffset + timeIndex) % mockClients.length];
      } else {
        // 60% free (minus breaks)
        slotType = 'free';
      }

      slots.push({
        id: slotId,
        date: dateStr,
        time,
        type: slotType,
        client,
      });
    });
  }

  return slots;
}

// Time slot component
function TimeSlotCell({ slot, onSlotClick }: { slot: TimeSlot; onSlotClick: (slot: TimeSlot) => void }) {
  if (slot.type === 'break') {
    return (
      <div className="h-20 rounded-lg bg-muted/30 flex items-center justify-center gap-2 text-muted-foreground">
        <Coffee className="h-4 w-4" />
        <span className="text-xs">Перерыв</span>
      </div>
    );
  }

  if (slot.type === 'booked' && slot.client) {
    return (
      <Link
        to={`/expert/session/${slot.id}`}
        className="h-20 rounded-lg bg-primary/10 border border-primary/30 p-2 flex flex-col justify-between hover:bg-primary/20 transition-colors group"
      >
        <div className="min-w-0">
          <p className="text-xs font-medium truncate">{slot.client.name}</p>
          <p className="text-[10px] text-muted-foreground truncate">{slot.client.topic}</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-primary">{slot.client.service}</span>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Play className="h-3 w-3 text-primary" />
          </div>
        </div>
      </Link>
    );
  }

  // Free slot
  return (
    <button
      onClick={() => onSlotClick(slot)}
      className="h-20 rounded-lg border border-dashed border-muted-foreground/30 flex items-center justify-center hover:border-primary/50 hover:bg-primary/5 transition-colors"
    >
      <span className="text-xs text-muted-foreground">Свободно</span>
    </button>
  );
}

export default function ExpertSchedule() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => 
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  const slots = useMemo(() => generateMockSlots(currentWeekStart), [currentWeekStart]);

  const weekDays = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => addDays(currentWeekStart, i));
  }, [currentWeekStart]);

  const times = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

  // Statistics
  const stats = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const todaySlots = slots.filter(s => s.date === today && s.type === 'booked').length;
    const weekBooked = slots.filter(s => s.type === 'booked').length;
    const weekFree = slots.filter(s => s.type === 'free').length;
    return { todaySlots, weekBooked, weekFree };
  }, [slots]);

  const handlePrevWeek = () => setCurrentWeekStart(prev => subWeeks(prev, 1));
  const handleNextWeek = () => setCurrentWeekStart(prev => addWeeks(prev, 1));
  const handleToday = () => {
    const today = new Date();
    setCurrentWeekStart(startOfWeek(today, { weekStartsOn: 1 }));
    setSelectedDate(today);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setCurrentWeekStart(startOfWeek(date, { weekStartsOn: 1 }));
    }
  };

  const handleSlotClick = (slot: TimeSlot) => {
    toast.success(`Слот ${slot.time} выбран`, {
      description: `Дата: ${format(new Date(slot.date), 'd MMMM yyyy', { locale: ru })}`,
    });
  };

  const handleAddBreak = () => {
    toast.info('Добавление перерыва', {
      description: 'Функционал будет доступен в следующей версии',
    });
  };

  const handleSettings = () => {
    toast.info('Настройки расписания', {
      description: 'Функционал будет доступен в следующей версии',
    });
  };

  const getSlotForCell = (date: Date, time: string) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return slots.find(s => s.date === dateStr && s.time === time);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Расписание"
        description="Управление вашими консультациями"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrevWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleToday}>
              Сегодня
            </Button>
            <Button variant="outline" size="sm" onClick={handleNextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Left sidebar */}
        <div className="space-y-4">
          {/* Mini calendar */}
          <div className="glass-card p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              locale={ru}
              className="w-full"
            />
          </div>

          {/* Statistics */}
          <div className="glass-card p-4 space-y-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Статистика
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Записей сегодня</span>
                <span className="font-medium">{stats.todaySlots}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">На неделе</span>
                <span className="font-medium">{stats.weekBooked}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Свободных слотов</span>
                <span className="font-medium text-emerald-500 dark:text-emerald-400">{stats.weekFree}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="glass-card p-4 space-y-2">
            <Button variant="outline" className="w-full justify-start" onClick={handleAddBreak}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить перерыв
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={handleSettings}>
              <Settings className="h-4 w-4 mr-2" />
              Настройки
            </Button>
          </div>
        </div>

        {/* Main calendar grid */}
        <div className="glass-card p-4">
          <ScrollArea className="h-[calc(100vh-280px)]">
            {/* Header with days */}
            <div className="grid grid-cols-[60px_repeat(5,1fr)] gap-2 mb-2 sticky top-0 bg-card/80 backdrop-blur-sm pb-2 z-10">
              <div /> {/* Empty corner */}
              {weekDays.map((day) => (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "text-center py-2 rounded-lg",
                    isSameDay(day, new Date()) && "bg-primary/10"
                  )}
                >
                  <div className="text-xs text-muted-foreground uppercase">
                    {format(day, 'EEE', { locale: ru })}
                  </div>
                  <div className={cn(
                    "text-lg font-semibold",
                    isSameDay(day, new Date()) && "text-primary"
                  )}>
                    {format(day, 'd')}
                  </div>
                </div>
              ))}
            </div>

            {/* Time slots grid */}
            <div className="space-y-2">
              {times.map((time) => (
                <div key={time} className="grid grid-cols-[60px_repeat(5,1fr)] gap-2">
                  <div className="text-xs text-muted-foreground flex items-center justify-end pr-2">
                    {time}
                  </div>
                  {weekDays.map((day) => {
                    const slot = getSlotForCell(day, time);
                    return slot ? (
                      <TimeSlotCell
                        key={slot.id}
                        slot={slot}
                        onSlotClick={handleSlotClick}
                      />
                    ) : (
                      <div key={`${day.toISOString()}-${time}`} className="h-20" />
                    );
                  })}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
