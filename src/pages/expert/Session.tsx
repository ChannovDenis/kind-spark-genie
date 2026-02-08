import { useState } from 'react';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Monitor, 
  MessageSquare,
  FileText,
  AlertCircle,
  Sparkles,
  Send,
  Clock,
  User,
  Calendar,
  Briefcase,
  Heart,
  ChevronLeft,
  MoreVertical,
  Volume2,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

// Mock client data
const clientData = {
  name: 'Иван Петров',
  age: 34,
  gender: 'Мужской',
  phone: '+7 (999) 123-45-67',
  email: 'ivan.petrov@company.ru',
  company: 'ООО «ТехноСтарт»',
  position: 'Руководитель отдела',
  topic: 'Расторжение трудового договора',
  previousSessions: 2,
  notes: [
    { date: '2026-02-01', text: 'Первичная консультация по вопросам ТК РФ' },
    { date: '2026-02-05', text: 'Обсуждение вариантов увольнения по соглашению сторон' },
  ],
  documents: [
    { name: 'Трудовой договор.pdf', size: '245 КБ' },
    { name: 'Допсоглашение.pdf', size: '89 КБ' },
  ],
};

// AI suggestions
const aiSuggestions = [
  {
    id: 1,
    type: 'legal',
    title: 'Статья 77 ТК РФ',
    content: 'При расторжении по соглашению сторон работодатель обязан выплатить все причитающиеся суммы в день увольнения (ст. 140 ТК РФ).',
    confidence: 95,
  },
  {
    id: 2,
    type: 'tip',
    title: 'Рекомендация',
    content: 'Уточните у клиента, есть ли невыплаченные отпускные — это часто упускается при обсуждении компенсаций.',
    confidence: 88,
  },
  {
    id: 3,
    type: 'warning',
    title: 'Внимание',
    content: 'Клиент упоминал «давление со стороны руководства» — это может быть признаком принуждения к увольнению (ст. 5.27 КоАП).',
    confidence: 72,
  },
];

// Chat history
const chatHistory = [
  { role: 'client', text: 'Добрый день! Мне нужна консультация по увольнению.' },
  { role: 'expert', text: 'Здравствуйте, Иван! Расскажите подробнее о вашей ситуации.' },
  { role: 'client', text: 'Руководство предложило уволиться по соглашению сторон, но я не уверен, стоит ли соглашаться...' },
];

export default function ExpertSession() {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isCallActive, setIsCallActive] = useState(true);
  const [aiPrompt, setAiPrompt] = useState('');
  const [selectedSuggestion, setSelectedSuggestion] = useState<number | null>(null);

  const sessionDuration = '12:34';

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col -m-6">
      {/* Session Header */}
      <div className="h-14 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/expert">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{clientData.name}</span>
              <StatusBadge status="in_progress" label="В эфире" />
            </div>
            <div className="text-sm text-muted-foreground">{clientData.topic}</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-mono">{sessionDuration}</span>
          </div>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Three Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Client Dossier */}
        <div className="w-80 border-r border-border bg-sidebar shrink-0 flex flex-col">
          <Tabs defaultValue="profile" className="flex-1 flex flex-col">
            <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent p-0 h-auto">
              <TabsTrigger 
                value="profile" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
              >
                <User className="h-4 w-4 mr-2" />
                Профиль
              </TabsTrigger>
              <TabsTrigger 
                value="history"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
              >
                <FileText className="h-4 w-4 mr-2" />
                История
              </TabsTrigger>
              <TabsTrigger 
                value="docs"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
              >
                <Briefcase className="h-4 w-4 mr-2" />
                Файлы
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="flex-1">
              <TabsContent value="profile" className="p-4 m-0 space-y-4">
                {/* Client Avatar & Name */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-primary/10 text-primary text-xl">
                      ИП
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{clientData.name}</h3>
                    <p className="text-sm text-muted-foreground">{clientData.position}</p>
                  </div>
                </div>

                {/* Info Cards */}
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-muted/30">
                    <div className="text-xs text-muted-foreground mb-1">Компания</div>
                    <div className="font-medium">{clientData.company}</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-lg bg-muted/30">
                      <div className="text-xs text-muted-foreground mb-1">Возраст</div>
                      <div className="font-medium">{clientData.age} лет</div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30">
                      <div className="text-xs text-muted-foreground mb-1">Пол</div>
                      <div className="font-medium">{clientData.gender}</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/30">
                    <div className="text-xs text-muted-foreground mb-1">Телефон</div>
                    <div className="font-medium">{clientData.phone}</div>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/30">
                    <div className="text-xs text-muted-foreground mb-1">Email</div>
                    <div className="font-medium text-sm">{clientData.email}</div>
                  </div>
                </div>

                {/* Topic */}
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="text-xs text-primary mb-1">Тема обращения</div>
                  <div className="font-medium">{clientData.topic}</div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{clientData.previousSessions} сессии</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="history" className="p-4 m-0 space-y-3">
                {clientData.notes.map((note, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-muted/30">
                    <div className="text-xs text-muted-foreground mb-1">
                      {new Date(note.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                    </div>
                    <div className="text-sm">{note.text}</div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="docs" className="p-4 m-0 space-y-2">
                {clientData.documents.map((doc, idx) => (
                  <div 
                    key={idx} 
                    className="p-3 rounded-lg bg-muted/30 flex items-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <FileText className="h-5 w-5 text-primary" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{doc.name}</div>
                      <div className="text-xs text-muted-foreground">{doc.size}</div>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>

        {/* Center: Video */}
        <div className="flex-1 flex flex-col bg-black/50">
          {/* Video Area */}
          <div className="flex-1 relative flex items-center justify-center">
            {isCallActive ? (
              <>
                {/* Main Video (Client) */}
                <div className="w-full h-full bg-gradient-to-br from-muted/20 to-muted/5 flex items-center justify-center">
                  {isVideoOff ? (
                    <div className="text-center">
                      <Avatar className="h-32 w-32 mx-auto mb-4">
                        <AvatarFallback className="bg-primary/10 text-primary text-4xl">
                          ИП
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-muted-foreground">Камера отключена</p>
                    </div>
                  ) : (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                      <Avatar className="h-40 w-40">
                        <AvatarFallback className="bg-primary/10 text-primary text-5xl">
                          ИП
                        </AvatarFallback>
                      </Avatar>
                      {/* Simulated video overlay */}
                      <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-black/50 text-white text-sm flex items-center gap-2">
                        <Volume2 className="h-4 w-4" />
                        Иван Петров
                      </div>
                    </div>
                  )}
                </div>

                {/* Self Video (Expert) */}
                <div className="absolute top-4 right-4 w-48 h-36 rounded-xl overflow-hidden border-2 border-border bg-muted/50 flex items-center justify-center">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-primary/10 text-primary text-xl">
                      АС
                    </AvatarFallback>
                  </Avatar>
                </div>
              </>
            ) : (
              <div className="text-center">
                <Phone className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">Звонок завершён</p>
                <p className="text-muted-foreground">Длительность: {sessionDuration}</p>
              </div>
            )}
          </div>

          {/* Video Controls */}
          <div className="h-20 bg-background/80 backdrop-blur-sm border-t border-border flex items-center justify-center gap-3">
            <Button
              variant={isMuted ? "destructive" : "secondary"}
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>

            <Button
              variant={isVideoOff ? "destructive" : "secondary"}
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={() => setIsVideoOff(!isVideoOff)}
            >
              {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
            </Button>

            <Button
              variant="secondary"
              size="icon"
              className="h-12 w-12 rounded-full"
            >
              <Monitor className="h-5 w-5" />
            </Button>

            <Button
              variant="secondary"
              size="icon"
              className="h-12 w-12 rounded-full"
            >
              <MessageSquare className="h-5 w-5" />
            </Button>

            <Button
              variant={isCallActive ? "destructive" : "default"}
              size="icon"
              className="h-14 w-14 rounded-full ml-4"
              onClick={() => setIsCallActive(!isCallActive)}
            >
              {isCallActive ? <PhoneOff className="h-6 w-6" /> : <Phone className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Right: AI Prompter */}
        <div className="w-96 border-l border-border bg-sidebar shrink-0 flex flex-col">
          <div className="h-12 border-b border-border flex items-center px-4 gap-2 shrink-0">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-semibold">AI-суфлёр</span>
            <div className="ml-auto">
              <StatusBadge status="success" label="Активен" />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-3">
              {aiSuggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className={cn(
                    "p-4 rounded-xl border transition-all cursor-pointer",
                    suggestion.type === 'warning' 
                      ? "bg-warning/10 border-warning/30 hover:border-warning/50" 
                      : suggestion.type === 'legal'
                      ? "bg-primary/10 border-primary/30 hover:border-primary/50"
                      : "bg-muted/30 border-border hover:border-primary/30",
                    selectedSuggestion === suggestion.id && "ring-2 ring-primary"
                  )}
                  onClick={() => setSelectedSuggestion(
                    selectedSuggestion === suggestion.id ? null : suggestion.id
                  )}
                >
                  <div className="flex items-start gap-2 mb-2">
                    {suggestion.type === 'warning' ? (
                      <AlertCircle className="h-4 w-4 text-warning mt-0.5" />
                    ) : suggestion.type === 'legal' ? (
                      <FileText className="h-4 w-4 text-primary mt-0.5" />
                    ) : (
                      <Sparkles className="h-4 w-4 text-muted-foreground mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium text-sm">{suggestion.title}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {suggestion.confidence}%
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {suggestion.content}
                  </p>
                  
                  {selectedSuggestion === suggestion.id && (
                    <div className="mt-3 pt-3 border-t border-border/50 flex gap-2">
                      <Button size="sm" variant="secondary" className="flex-1 text-xs">
                        Использовать
                      </Button>
                      <Button size="sm" variant="ghost" className="text-xs">
                        Скрыть
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* AI Chat History */}
          <div className="border-t border-border">
            <div className="p-3 bg-muted/20">
              <div className="text-xs font-medium text-muted-foreground mb-2">Транскрипция</div>
              <ScrollArea className="h-32">
                <div className="space-y-2">
                  {chatHistory.map((msg, idx) => (
                    <div key={idx} className="text-sm">
                      <span className={cn(
                        "font-medium",
                        msg.role === 'client' ? "text-primary" : "text-success"
                      )}>
                        {msg.role === 'client' ? 'Клиент: ' : 'Вы: '}
                      </span>
                      <span className="text-muted-foreground">{msg.text}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* AI Input */}
          <div className="p-3 border-t border-border shrink-0">
            <div className="relative">
              <Input
                placeholder="Спросить AI..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="pr-10"
              />
              <Button 
                size="icon" 
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                disabled={!aiPrompt.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
