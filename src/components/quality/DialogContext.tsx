import { MessageSquare, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ContextMessage } from '@/data/trainingData';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface DialogContextProps {
  messages: ContextMessage[];
  currentMessage: string;
  className?: string;
}

export function DialogContext({ messages, currentMessage, className }: DialogContextProps) {
  if (!messages.length) {
    return null;
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
        <MessageSquare className="h-3 w-3" />
        <span>Контекст диалога ({messages.length} сообщений до)</span>
      </div>

      <div className="space-y-1.5 pl-2 border-l-2 border-muted">
        {messages.map((msg, index) => (
          <div key={index} className="flex items-start gap-2">
            <div
              className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                msg.role === 'user' ? "bg-muted" : "bg-primary/10"
              )}
            >
              {msg.role === 'user' ? (
                <User className="h-3 w-3 text-muted-foreground" />
              ) : (
                <Bot className="h-3 w-3 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground line-clamp-2">{msg.content}</p>
            </div>
            <span className="text-[10px] text-muted-foreground/60 shrink-0">
              {format(new Date(msg.timestamp), 'HH:mm', { locale: ru })}
            </span>
          </div>
        ))}

        {/* Current message highlight */}
        <div className="flex items-start gap-2 pt-1 border-t border-dashed border-muted">
          <div className="w-5 h-5 rounded-full bg-warning/20 flex items-center justify-center shrink-0 mt-0.5">
            <User className="h-3 w-3 text-warning" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium">{currentMessage}</p>
            <span className="text-[10px] text-warning">← текущее сообщение</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Compact version showing just message count
export function DialogContextBadge({ messageCount }: { messageCount: number }) {
  if (!messageCount) return null;
  
  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
      <MessageSquare className="h-3 w-3" />
      <span>+{messageCount}</span>
    </span>
  );
}
