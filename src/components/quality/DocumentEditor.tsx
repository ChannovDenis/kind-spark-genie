import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { KnowledgeDocument, knowledgeCategories } from '@/data/knowledgeData';
import { toast } from 'sonner';

interface DocumentEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: KnowledgeDocument | null;
  onSave: (document: Partial<KnowledgeDocument>) => void;
}

const serviceOptions = [
  { id: 'lawyer', label: 'Юрист' },
  { id: 'doctor', label: 'Врач' },
  { id: 'psychologist', label: 'Психолог' },
  { id: 'financier', label: 'Финансист' },
];

function flattenCategories(categories: typeof knowledgeCategories): Array<{ id: string; name: string; level: number }> {
  const result: Array<{ id: string; name: string; level: number }> = [];
  
  function traverse(cats: typeof knowledgeCategories, level: number) {
    for (const cat of cats) {
      result.push({ id: cat.id, name: cat.name, level });
      if (cat.children) {
        traverse(cat.children, level + 1);
      }
    }
  }
  
  traverse(categories, 0);
  return result;
}

export function DocumentEditor({ open, onOpenChange, document, onSave }: DocumentEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<'document' | 'faq' | 'protocol'>('document');
  const [categoryId, setCategoryId] = useState('');
  const [services, setServices] = useState<string[]>([]);
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [status, setStatus] = useState<'active' | 'draft' | 'archived'>('active');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const flatCategories = flattenCategories(knowledgeCategories);

  useEffect(() => {
    if (document) {
      setTitle(document.title);
      setContent(document.content);
      setType(document.type);
      setCategoryId(document.categoryId);
      setServices(document.services);
      setPriority(document.priority);
      setStatus(document.status);
      setTags(document.tags);
    } else {
      setTitle('');
      setContent('');
      setType('document');
      setCategoryId('');
      setServices([]);
      setPriority('medium');
      setStatus('active');
      setTags([]);
    }
  }, [document, open]);

  const toggleService = (serviceId: string) => {
    setServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(s => s !== serviceId)
        : [...prev, serviceId]
    );
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSave = () => {
    if (!title.trim()) {
      toast.error('Введите заголовок');
      return;
    }
    if (!content.trim()) {
      toast.error('Введите содержимое');
      return;
    }
    if (!categoryId) {
      toast.error('Выберите категорию');
      return;
    }
    if (services.length === 0) {
      toast.error('Выберите хотя бы один сервис');
      return;
    }

    onSave({
      id: document?.id,
      title: title.trim(),
      content: content.trim(),
      type,
      categoryId,
      services,
      priority,
      status,
      tags,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {document ? 'Редактирование документа' : 'Новый документ'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Заголовок</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите заголовок документа"
            />
          </div>

          {/* Type & Category Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Тип</Label>
              <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="document">Документ</SelectItem>
                  <SelectItem value="faq">FAQ</SelectItem>
                  <SelectItem value="protocol">Протокол</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Категория</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {flatCategories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <span style={{ paddingLeft: cat.level * 12 }}>{cat.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Priority & Status Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Приоритет</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as typeof priority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">Высокий</SelectItem>
                  <SelectItem value="medium">Средний</SelectItem>
                  <SelectItem value="low">Низкий</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Статус</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Активен</SelectItem>
                  <SelectItem value="draft">Черновик</SelectItem>
                  <SelectItem value="archived">Архив</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-2">
            <Label>Сервисы</Label>
            <div className="flex flex-wrap gap-3">
              {serviceOptions.map(service => (
                <div key={service.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`service-${service.id}`}
                    checked={services.includes(service.id)}
                    onCheckedChange={() => toggleService(service.id)}
                  />
                  <Label htmlFor={`service-${service.id}`} className="font-normal">
                    {service.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Содержимое (Markdown)</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Введите содержимое документа в формате Markdown..."
              className="min-h-[200px] font-mono text-sm"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Теги</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Добавить тег"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" variant="outline" onClick={addTag}>
                Добавить
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleSave}>
            {document ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
