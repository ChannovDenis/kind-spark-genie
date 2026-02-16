import { useState } from 'react';
import { Headphones, Calendar, Video, Star, Clock, AlertTriangle, Users, Building2, BarChart3 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { MetricCard } from '@/components/shared/MetricCard';
import { PageHeader } from '@/components/shared/PageHeader';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const upcomingSessions = [
  { id: 1, client: 'Иван Петров', topic: 'Расторжение трудового договора', time: '14:00', type: 'lawyer' },
  { id: 2, client: 'Мария Сидорова', topic: 'Консультация по давлению', time: '15:30', type: 'doctor' },
  { id: 3, client: 'Алексей Козлов', topic: 'Тревожные состояния', time: '17:00', type: 'psychologist' },
];

const escalationsData = [
  { 
    id: 1, 
    urgent: true, 
    time: '2 мин назад',
    text: 'Клиент спрашивает про уголовное дело — AI отказал, клиент настаивает',
    service: 'Юрист', 
    tenant: 'ГПБ', 
    confidence: 0.12,
    borderColor: 'border-l-destructive',
    bgColor: 'bg-destructive/5'
  },
  { 
    id: 2, 
    urgent: false, 
    time: '8 мин назад',
    text: 'Вопрос по разделу ипотечной квартиры — AI ответил, клиент не удовлетворён',
    service: 'Юрист', 
    tenant: 'ГПБ', 
    confidence: 0.38,
    borderColor: 'border-l-warning',
    bgColor: ''
  },
  { 
    id: 3, 
    urgent: false, 
    time: '23 мин назад',
    text: 'Запрос на консультацию по трудовому спору — клиент хочет живого юриста',
    service: 'Юрист', 
    tenant: 'WB', 
    confidence: 0.71,
    borderColor: 'border-l-primary',
    bgColor: ''
  },
];

const experts = [
  { id: 1, name: 'Мария Иванова (Юрист)' },
  { id: 2, name: 'Дмитрий Козлов (Юрист)' },
  { id: 3, name: 'Елена Петрова (Юрист)' },
];

export default function ExpertDashboard() {
  const navigate = useNavigate();
  const [visibleEscalations, setVisibleEscalations] = useState(escalationsData.map(e => e.id));
  const [delegateDialogOpen, setDelegateDialogOpen] = useState(false);
  const [selectedEscalation, setSelectedEscalation] = useState<number | null>(null);
  const [selectedExpert, setSelectedExpert] = useState<string>('');

  const handleAccept = (id: number) => {
    toast.success('Запрос принят — переход к сессии');
    navigate(`/expert/session/${id}`);
  };

  const handleReject = (id: number) => {
    setVisibleEscalations(prev => prev.filter(eId => eId !== id));
    toast.info('Запрос отклонён');
  };

  const handleDelegateClick = (id: number) => {
    setSelectedEscalation(id);
    setDelegateDialogOpen(true);
  };

  const handleDelegate = () => {
    if (selectedExpert) {
      const expert = experts.find(e => e.id.toString() === selectedExpert);
      toast.success(`Запрос делегирован: ${expert?.name}`);
      setVisibleEscalations(prev => prev.filter(eId => eId !== selectedEscalation));
      setDelegateDialogOpen(false);
      setSelectedExpert('');
      setSelectedEscalation(null);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence < 0.3) return 'text-destructive';
    if (confidence < 0.6) return 'text-warning';
    return 'text-success';
  };

  const filteredEscalations = escalationsData.filter(e => visibleEscalations.includes(e.id));

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

      {/* Incoming Escalations */}
      {filteredEscalations.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold">Входящие запросы</h2>
              <Badge variant="destructive" className="text-xs">
                {filteredEscalations.length} новых
              </Badge>
            </div>
          </div>

          <div className="space-y-3">
            {filteredEscalations.map((escalation) => (
              <div 
                key={escalation.id}
                className={`glass-card p-4 border-l-4 ${escalation.borderColor} ${escalation.bgColor}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {escalation.urgent && (
                      <Badge variant="destructive" className="text-xs gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        СРОЧНО
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{escalation.time}</span>
                </div>
                
                <p className="text-sm mb-3">{escalation.text}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {escalation.service}
                    </span>
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      {escalation.tenant}
                    </span>
                    <span className={`flex items-center gap-1 font-medium ${getConfidenceColor(escalation.confidence)}`}>
                      <BarChart3 className="h-3 w-3" />
                      {escalation.confidence.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={() => handleAccept(escalation.id)}>
                      Принять
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleReject(escalation.id)}>
                      Отклонить
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelegateClick(escalation.id)}>
                      Делегировать
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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

      {/* Delegate Dialog */}
      <Dialog open={delegateDialogOpen} onOpenChange={setDelegateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Делегировать запрос</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">Выберите эксперта</label>
            <Select value={selectedExpert} onValueChange={setSelectedExpert}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите эксперта..." />
              </SelectTrigger>
              <SelectContent>
                {experts.map((expert) => (
                  <SelectItem key={expert.id} value={expert.id.toString()}>
                    {expert.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDelegateDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleDelegate} disabled={!selectedExpert}>
              Делегировать
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
