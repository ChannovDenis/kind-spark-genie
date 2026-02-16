import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  ChevronLeft, 
  User, 
  Clock, 
  Bot, 
  Star,
  AlertTriangle,
  Send,
  CheckCircle,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/shared/StatusBadge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Mock dialog data
const dialogData = {
  id: '4520',
  user: 'Пользователь #4520',
  service: 'Врач',
  date: '2026-02-08T09:15:00',
  duration: '8:45',
  aiScore: 45,
  tokens: 2340,
  avgResponseTime: '1.2s',
  status: 'needs_review',
};

const chatMessages = [
  { 
    id: 1, 
    role: 'user', 
    text: 'Здравствуйте, у меня уже неделю болит голова, особенно по утрам. Что это может быть?',
    time: '09:15'
  },
  { 
    id: 2, 
    role: 'ai', 
    text: 'Здравствуйте! Головная боль по утрам может быть связана с несколькими факторами. Расскажите подробнее: боль локализуется в какой-то определённой области? Есть ли другие симптомы?',
    time: '09:15',
    score: 92
  },
  { 
    id: 3, 
    role: 'user', 
    text: 'Давит в висках и затылке. Иногда тошнит.',
    time: '09:16'
  },
  { 
    id: 4, 
    role: 'ai', 
    text: 'Судя по описанию, это похоже на мигрень с аурой. Рекомендую принимать ибупрофен 400мг при приступах.',
    time: '09:16',
    score: 45,
    flagged: true,
    issue: 'Преждевременный диагноз без достаточного анамнеза. Не уточнено АД, режим сна, наличие стрессов.'
  },
  { 
    id: 5, 
    role: 'user', 
    text: 'А это точно мигрень? Мне не нужно к врачу идти?',
    time: '09:17'
  },
  { 
    id: 6, 
    role: 'ai', 
    text: 'При регулярных головных болях, особенно с тошнотой, рекомендую обратиться к неврологу для очного осмотра и при необходимости — дополнительных обследований (МРТ головного мозга). До приёма врача ведите дневник головной боли.',
    time: '09:17',
    score: 88
  },
];

const errorCategories = [
  { value: 'inaccuracy', label: 'Неточность' },
  { value: 'hallucination', label: 'Галлюцинация' },
  { value: 'empathy', label: 'Недостаток эмпатии' },
  { value: 'protocol', label: 'Нарушение протокола' },
  { value: 'safety', label: 'Нарушение безопасности' },
];

export default function DialogReview() {
  const { id } = useParams();
  const [selectedMessage, setSelectedMessage] = useState<number | null>(4);
  const [rating, setRating] = useState(2);
  const [category, setCategory] = useState('inaccuracy');
  const [comment, setComment] = useState('');

  const handleSendToTraining = () => {
    toast.success('Диалог отправлен на дообучение');
  };

  const handleApprove = () => {
    toast.success('Диалог помечен как обработанный');
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col -m-6">
      {/* Header */}
      <div className="h-14 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/quality">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Диалог #{dialogData.id}</span>
              <StatusBadge status="warning" label="На проверке" />
            </div>
            <div className="text-sm text-muted-foreground">{dialogData.service} • {dialogData.user}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleApprove}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Обработан
          </Button>
          <Button onClick={handleSendToTraining}>
            <Send className="h-4 w-4 mr-2" />
            В дообучение
          </Button>
        </div>
      </div>

      {/* Three Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Session Info */}
        <div className="w-72 border-r border-border bg-sidebar shrink-0 p-4 space-y-4">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Информация</h3>
            
            <div className="p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-2 mb-1">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Пользователь</span>
              </div>
              <div className="font-medium">{dialogData.user}</div>
            </div>

            <div className="p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Сервис</span>
              </div>
              <div className="font-medium">{dialogData.service}</div>
            </div>

            <div className="p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Дата и время</span>
              </div>
              <div className="font-medium">
                {new Date(dialogData.date).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Статистика</h3>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-lg bg-muted/30 text-center">
                <div className={cn(
                  "text-2xl font-bold",
                  dialogData.aiScore >= 80 ? "text-success" :
                  dialogData.aiScore >= 60 ? "text-warning" : "text-destructive"
                )}>
                  {dialogData.aiScore}%
                </div>
                <div className="text-xs text-muted-foreground">AI Score</div>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 text-center">
                <div className="text-2xl font-bold">{dialogData.duration}</div>
                <div className="text-xs text-muted-foreground">Длительность</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-lg bg-muted/30 text-center">
                <div className="text-lg font-semibold">{dialogData.tokens.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Токенов</div>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 text-center">
                <div className="text-lg font-semibold">{dialogData.avgResponseTime}</div>
                <div className="text-xs text-muted-foreground">Ср. ответ</div>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Chat */}
        <div className="flex-1 flex flex-col bg-background">
          <ScrollArea className="flex-1 p-4">
            <div className="max-w-2xl mx-auto space-y-4">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-3",
                    msg.role === 'user' ? "flex-row-reverse" : ""
                  )}
                >
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className={cn(
                      msg.role === 'user' ? "bg-primary/10 text-primary" : "bg-muted"
                    )}>
                      {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>

                  <div 
                    className={cn(
                      "max-w-[80%] rounded-2xl p-4 cursor-pointer transition-all",
                      msg.role === 'user' 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted/50",
                      msg.flagged && "ring-2 ring-destructive bg-destructive/10",
                      selectedMessage === msg.id && !msg.flagged && "ring-2 ring-primary"
                    )}
                    onClick={() => msg.role === 'ai' && setSelectedMessage(msg.id)}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    
                    {msg.role === 'ai' && (
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/30">
                        <span className="text-xs text-muted-foreground">{msg.time}</span>
                        {msg.score && (
                          <span className={cn(
                            "text-xs font-medium",
                            msg.score >= 80 ? "text-success" :
                            msg.score >= 60 ? "text-warning" : "text-destructive"
                          )}>
                            {msg.score}%
                          </span>
                        )}
                        {msg.flagged && (
                          <AlertTriangle className="h-3 w-3 text-destructive" />
                        )}
                      </div>
                    )}

                    {msg.flagged && msg.issue && (
                      <div className="mt-2 p-2 rounded-lg bg-destructive/20 text-xs text-destructive">
                        <strong>Проблема:</strong> {msg.issue}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Right: QA Tools */}
        <div className="w-80 border-l border-border bg-sidebar shrink-0 p-4 space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Инструменты QA</h3>

          {/* Rating */}
          <div className="space-y-2">
            <Label>Оценка ответа</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star 
                    className={cn(
                      "h-6 w-6",
                      star <= rating ? "fill-warning text-warning" : "text-muted-foreground"
                    )} 
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Error Category */}
          <div className="space-y-2">
            <Label>Категория ошибки</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {errorCategories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label>Комментарий</Label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Опишите проблему подробнее..."
              className="min-h-[120px]"
            />
          </div>

          {/* Selected Message Info */}
          {selectedMessage && (
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <div className="text-xs text-primary mb-1">Выбранное сообщение</div>
              <div className="text-sm font-medium">Сообщение #{selectedMessage}</div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2 pt-4">
            <Button className="w-full" onClick={handleSendToTraining}>
              <Send className="h-4 w-4 mr-2" />
              Отправить в дообучение
            </Button>
            <Button variant="outline" className="w-full" onClick={handleApprove}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Пометить обработанным
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
