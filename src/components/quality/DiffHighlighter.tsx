import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface DiffHighlighterProps {
  original: string;
  corrected: string;
  showInline?: boolean;
}

interface DiffPart {
  type: 'unchanged' | 'removed' | 'added';
  text: string;
}

// Simple word-level diff algorithm
function computeWordDiff(original: string, corrected: string): { originalParts: DiffPart[]; correctedParts: DiffPart[] } {
  const originalWords = original.split(/(\s+)/);
  const correctedWords = corrected.split(/(\s+)/);
  
  const originalParts: DiffPart[] = [];
  const correctedParts: DiffPart[] = [];
  
  // Create sets for quick lookup
  const originalSet = new Set(originalWords.filter(w => w.trim()));
  const correctedSet = new Set(correctedWords.filter(w => w.trim()));
  
  // Mark words in original
  for (const word of originalWords) {
    if (!word.trim()) {
      originalParts.push({ type: 'unchanged', text: word });
    } else if (correctedSet.has(word)) {
      originalParts.push({ type: 'unchanged', text: word });
    } else {
      originalParts.push({ type: 'removed', text: word });
    }
  }
  
  // Mark words in corrected
  for (const word of correctedWords) {
    if (!word.trim()) {
      correctedParts.push({ type: 'unchanged', text: word });
    } else if (originalSet.has(word)) {
      correctedParts.push({ type: 'unchanged', text: word });
    } else {
      correctedParts.push({ type: 'added', text: word });
    }
  }
  
  return { originalParts, correctedParts };
}

export function DiffHighlighter({ original, corrected, showInline = false }: DiffHighlighterProps) {
  const { originalParts, correctedParts } = useMemo(
    () => computeWordDiff(original, corrected),
    [original, corrected]
  );

  if (showInline) {
    return (
      <div className="text-sm leading-relaxed">
        {originalParts.map((part, i) => (
          <span
            key={`orig-${i}`}
            className={cn(
              part.type === 'removed' && 'bg-destructive/20 text-destructive line-through'
            )}
          >
            {part.text}
          </span>
        ))}
        {' → '}
        {correctedParts.map((part, i) => (
          <span
            key={`corr-${i}`}
            className={cn(
              part.type === 'added' && 'bg-primary/20 text-primary font-medium'
            )}
          >
            {part.text}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Original with removals highlighted */}
      <div className="text-sm leading-relaxed">
        {originalParts.map((part, i) => (
          <span
            key={i}
            className={cn(
              part.type === 'removed' && 'bg-destructive/20 text-destructive px-0.5 rounded'
            )}
          >
            {part.text}
          </span>
        ))}
      </div>
      
      {/* Corrected with additions highlighted */}
      <div className="text-sm leading-relaxed">
        {correctedParts.map((part, i) => (
          <span
            key={i}
            className={cn(
              part.type === 'added' && 'bg-primary/20 text-primary px-0.5 rounded font-medium'
            )}
          >
            {part.text}
          </span>
        ))}
      </div>
    </div>
  );
}

// Simplified version that just highlights key differences
export function SimpleDiffBadge({ hasChanges }: { hasChanges: boolean }) {
  if (!hasChanges) return null;
  
  return (
    <span className="inline-flex items-center gap-1 text-xs">
      <span className="w-2 h-2 rounded-full bg-destructive" />
      <span className="text-muted-foreground">изменено</span>
    </span>
  );
}
