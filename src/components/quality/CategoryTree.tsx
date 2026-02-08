import { useState } from 'react';
import { ChevronRight, ChevronDown, FileText, HelpCircle, Zap, Folder } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { KnowledgeCategory } from '@/data/knowledgeData';

interface CategoryTreeProps {
  categories: KnowledgeCategory[];
  selectedCategoryId: string | null;
  onSelectCategory: (category: KnowledgeCategory) => void;
}

function getCategoryIcon(type: KnowledgeCategory['type'], icon: string) {
  // Use emoji if provided, otherwise use Lucide icons
  if (icon.length <= 2) {
    return <span className="text-base">{icon}</span>;
  }
  
  switch (type) {
    case 'faq':
      return <HelpCircle className="h-4 w-4 text-warning" />;
    case 'protocol':
      return <Zap className="h-4 w-4 text-destructive" />;
    case 'service':
      return <Folder className="h-4 w-4 text-primary" />;
    default:
      return <FileText className="h-4 w-4 text-muted-foreground" />;
  }
}

interface CategoryItemProps {
  category: KnowledgeCategory;
  level: number;
  selectedCategoryId: string | null;
  onSelectCategory: (category: KnowledgeCategory) => void;
}

function CategoryItem({ category, level, selectedCategoryId, onSelectCategory }: CategoryItemProps) {
  const [isOpen, setIsOpen] = useState(level === 0);
  const hasChildren = category.children && category.children.length > 0;
  const isSelected = selectedCategoryId === category.id;

  const handleClick = () => {
    onSelectCategory(category);
  };

  if (!hasChildren) {
    return (
      <button
        onClick={handleClick}
        className={cn(
          "flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md hover:bg-accent/50 transition-colors text-left",
          isSelected && "bg-primary/10 border-l-2 border-primary font-medium"
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {getCategoryIcon(category.type, category.icon)}
        <span className="flex-1 truncate">{category.name}</span>
        <Badge variant="secondary" className="text-xs h-5 px-1.5">
          {category.documentCount}
        </Badge>
      </button>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button
          onClick={handleClick}
          className={cn(
            "flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md hover:bg-accent/50 transition-colors text-left",
            isSelected && "bg-primary/10 border-l-2 border-primary font-medium"
          )}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
        >
          {isOpen ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
          )}
          {getCategoryIcon(category.type, category.icon)}
          <span className="flex-1 truncate">{category.name}</span>
          <Badge variant="secondary" className="text-xs h-5 px-1.5">
            {category.documentCount}
          </Badge>
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        {category.children?.map((child) => (
          <CategoryItem
            key={child.id}
            category={child}
            level={level + 1}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={onSelectCategory}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

export function CategoryTree({ categories, selectedCategoryId, onSelectCategory }: CategoryTreeProps) {
  return (
    <ScrollArea className="h-full">
      <div className="p-2 space-y-1">
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            category={category}
            level={0}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={onSelectCategory}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
