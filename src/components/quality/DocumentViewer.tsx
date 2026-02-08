import { useState } from 'react';
import { Edit, Trash2, Archive, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { KnowledgeDocument, DocumentHistoryEntry, documentHistory } from '@/data/knowledgeData';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { toast } from 'sonner';

interface DocumentViewerProps {
  document: KnowledgeDocument | null;
  onEdit: (document: KnowledgeDocument) => void;
  onDelete: (document: KnowledgeDocument) => void;
  onArchive: (document: KnowledgeDocument) => void;
}

function MarkdownContent({ content }: { content: string }) {
  // Simple markdown rendering (headers, lists, blockquotes, bold, code)
  const lines = content.split('\n');
  
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      {lines.map((line, index) => {
        // Headers
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-xl font-bold mt-4 mb-2">{line.slice(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-lg font-semibold mt-3 mb-2">{line.slice(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-base font-medium mt-2 mb-1">{line.slice(4)}</h3>;
        }
        
        // Blockquote
        if (line.startsWith('> ')) {
          return (
            <blockquote key={index} className="border-l-4 border-primary/50 pl-4 italic text-muted-foreground my-2">
              {line.slice(2)}
            </blockquote>
          );
        }
        
        // Unordered list
        if (line.startsWith('- ')) {
          return (
            <li key={index} className="ml-4 list-disc">
              {formatInlineMarkdown(line.slice(2))}
            </li>
          );
        }
        
        // Ordered list
        const orderedMatch = line.match(/^(\d+)\. /);
        if (orderedMatch) {
          return (
            <li key={index} className="ml-4 list-decimal">
              {formatInlineMarkdown(line.slice(orderedMatch[0].length))}
            </li>
          );
        }
        
        // Empty line
        if (line.trim() === '') {
          return <br key={index} />;
        }
        
        // Regular paragraph
        return <p key={index} className="my-1">{formatInlineMarkdown(line)}</p>;
      })}
    </div>
  );
}

function formatInlineMarkdown(text: string): React.ReactNode {
  // Bold text
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) => 
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  );
}

function HistoryTab({ documentId }: { documentId: string }) {
  const history = documentHistory[documentId] || [];
  
  if (history.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        История изменений пуста
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {history.map((entry: DocumentHistoryEntry) => (
        <div key={entry.id} className="flex gap-3 text-sm">
          <div className="w-20 text-muted-foreground shrink-0">
            {format(new Date(entry.timestamp), 'd MMM', { locale: ru })}
          </div>
          <div>
            <div className="font-medium">
              {entry.action === 'created' && 'Создан'}
              {entry.action === 'updated' && 'Обновлён'}
              {entry.action === 'archived' && 'Архивирован'}
              {entry.action === 'restored' && 'Восстановлен'}
            </div>
            <div className="text-muted-foreground">{entry.author}</div>
            {entry.changes && (
              <div className="text-xs text-muted-foreground mt-1">{entry.changes}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function DocumentViewer({ document, onEdit, onDelete, onArchive }: DocumentViewerProps) {
  const [activeTab, setActiveTab] = useState('content');

  if (!document) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <p className="text-lg mb-2">Выберите документ</p>
          <p className="text-sm">Кликните на документ в дереве слева</p>
        </div>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(document.content);
    toast.success('Скопировано в буфер обмена');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold truncate">{document.title}</h2>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge variant={document.status === 'active' ? 'default' : 'secondary'}>
                {document.status === 'active' ? 'Активен' : document.status === 'draft' ? 'Черновик' : 'Архив'}
              </Badge>
              <Badge variant="outline">{document.type === 'document' ? 'Документ' : document.type === 'faq' ? 'FAQ' : 'Протокол'}</Badge>
              {document.priority === 'high' && <Badge variant="destructive">Высокий</Badge>}
            </div>
          </div>
          <div className="flex gap-1 shrink-0">
            <Button variant="ghost" size="icon" onClick={handleCopy} title="Копировать">
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onEdit(document)} title="Редактировать">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onArchive(document)} title="В архив">
              <Archive className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(document)} title="Удалить" className="text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Tags */}
        {document.tags.length > 0 && (
          <div className="flex gap-1 mt-3 flex-wrap">
            {document.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
        <TabsList className="mx-4 mt-2 w-fit">
          <TabsTrigger value="content">Документ</TabsTrigger>
          <TabsTrigger value="preview">Как видит AI</TabsTrigger>
          <TabsTrigger value="history">История</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="flex-1 min-h-0 m-0">
          <ScrollArea className="h-full">
            <div className="p-4">
              <MarkdownContent content={document.content} />
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="preview" className="flex-1 min-h-0 m-0">
          <ScrollArea className="h-full">
            <div className="p-4">
              <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap">
                {document.content}
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="history" className="flex-1 min-h-0 m-0">
          <ScrollArea className="h-full">
            <div className="p-4">
              <HistoryTab documentId={document.id} />
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
