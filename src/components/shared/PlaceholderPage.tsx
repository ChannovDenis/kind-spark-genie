import { Construction } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';

interface PlaceholderPageProps {
  title: string;
  description?: string;
  emoji?: string;
}

export function PlaceholderPage({ title, description, emoji = '🚧' }: PlaceholderPageProps) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} />
      
      <div className="glass-card p-12 text-center">
        <div className="text-6xl mb-4">{emoji}</div>
        <h2 className="text-xl font-semibold mb-2">В разработке</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Этот раздел находится в активной разработке и скоро будет доступен. 
          Следите за обновлениями!
        </p>
      </div>
    </div>
  );
}
