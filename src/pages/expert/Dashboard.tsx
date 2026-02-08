import { Headphones, Calendar, Video, Star, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MetricCard } from '@/components/shared/MetricCard';
import { PageHeader } from '@/components/shared/PageHeader';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatusBadge';

const upcomingSessions = [
  { id: 1, client: 'Иван Петров', topic: 'Расторжение трудового договора', time: '14:00', type: 'lawyer' },
  { id: 2, client: 'Мария Сидорова', topic: 'Консультация по давлению', time: '15:30', type: 'doctor' },
  { id: 3, client: 'Алексей Козлов', topic: 'Тревожные состояния', time: '17:00', type: 'psychologist' },
];

export default function ExpertDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Кабинет эксперта"
        description="Добро пожаловать, Доктор Смирнов!"
      />

      {/* Expert Profile Card */}
      <div className="glass-card p-6">
        <div className="flex items-start gap-6">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-primary/10 text-primary text-2xl">
              АС
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold">Др. Александр Смирнов</h2>
                <p className="text-muted-foreground">Врач-терапевт • Опыт 12 лет</p>
                <div className="flex items-center gap-2 mt-2">
                  <Star className="h-4 w-4 text-warning fill-warning" />
                  <span className="font-medium">4.9</span>
                  <span className="text-muted-foreground text-sm">(256 отзывов)</span>
                </div>
              </div>
              <StatusBadge status="success" label="Онлайн" />
            </div>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Консультаций сегодня"
          value="5"
          icon={<Headphones className="h-5 w-5" />}
        />
        <MetricCard
          title="На этой неделе"
          value="23"
          change={15}
          changeLabel="vs прошлая"
          icon={<Calendar className="h-5 w-5" />}
        />
        <MetricCard
          title="Средний рейтинг"
          value="4.9"
          icon={<Star className="h-5 w-5" />}
        />
        <MetricCard
          title="Среднее время"
          value="18 мин"
          change={-12}
          changeLabel="vs прошлая"
          icon={<Clock className="h-5 w-5" />}
        />
      </div>

      {/* Upcoming Sessions */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Ближайшие консультации</h2>
          <Button variant="outline" size="sm">Все сессии</Button>
        </div>

        <div className="space-y-3">
          {upcomingSessions.map((session) => (
            <div 
              key={session.id}
              className="flex items-center gap-4 p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
            >
              <div className="text-center min-w-[60px]">
                <div className="text-xl font-bold">{session.time}</div>
                <div className="text-xs text-muted-foreground">сегодня</div>
              </div>
              
              <div className="flex-1">
                <div className="font-medium">{session.client}</div>
                <div className="text-sm text-muted-foreground">{session.topic}</div>
              </div>

              <Link to={`/expert/session/${session.id}`}>
                <Button size="sm" className="gap-2">
                  <Video className="h-4 w-4" />
                  Начать
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
