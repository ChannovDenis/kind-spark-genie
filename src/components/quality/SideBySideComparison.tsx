import { AlertTriangle, Sparkles, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface SideBySideComparisonProps {
  originalResponse: string;
  correctedResponse: string;
  confidenceScore: number;
  showDiff?: boolean;
}

// Simple word-level diff for highlighting
function getHighlightedText(original: string, corrected: string, isOriginal: boolean): React.ReactNode {
  const originalWords = new Set(original.toLowerCase().split(/\s+/));
  const correctedWords = new Set(corrected.toLowerCase().split(/\s+/));
  
  const textToProcess = isOriginal ? original : corrected;
  const compareSet = isOriginal ? correctedWords : originalWords;
  
  return textToProcess.split(/(\s+)/).map((word, i) => {
    const cleanWord = word.toLowerCase().trim();
    if (!cleanWord) return word;
    
    const isChanged = !compareSet.has(cleanWord);
    
    if (isChanged) {
      return (
        <span
          key={i}
          className={cn(
            "px-0.5 rounded",
            isOriginal 
              ? "bg-destructive/20 text-destructive" 
              : "bg-primary/20 text-primary font-medium"
          )}
        >
          {word}
        </span>
      );
    }
    
    return word;
  });
}

export function SideBySideComparison({
  originalResponse,
  correctedResponse,
  confidenceScore,
  showDiff = true,
}: SideBySideComparisonProps) {
  const confidencePercent = Math.round(confidenceScore * 100);
  const isHighConfidenceError = confidenceScore > 0.85;

  return (
    <div className="space-y-3">
      {/* Confidence warning */}
      {isHighConfidenceError && (
        <div className="flex items-center gap-2 p-2 bg-warning/10 border border-warning/20 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-medium text-warning">
              Высокая уверенность AI в ошибочном ответе
            </p>
            <p className="text-xs text-muted-foreground">
              Приоритетный кейс для дообучения
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-warning">{confidencePercent}%</div>
            <Progress value={confidencePercent} className="w-16 h-1.5" />
          </div>
        </div>
      )}

      {/* Side-by-side comparison */}
      <div className="grid grid-cols-2 gap-4">
        {/* Original (with error) */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center text-xs">🤖</span>
            <span className="text-sm font-medium">Ответ AI</span>
            <Badge variant="destructive" className="text-xs">С ошибкой</Badge>
          </div>
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 min-h-[120px]">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {showDiff 
                ? getHighlightedText(originalResponse, correctedResponse, true)
                : originalResponse
              }
            </p>
          </div>
          {!isHighConfidenceError && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Уверенность AI:</span>
              <Progress value={confidencePercent} className="w-20 h-1.5" />
              <span>{confidencePercent}%</span>
            </div>
          )}
        </div>

        {/* Corrected */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">
              <Sparkles className="h-3 w-3 text-primary" />
            </span>
            <span className="text-sm font-medium">Исправленный ответ</span>
            <Badge className="text-xs bg-primary/10 text-primary border-primary/30">
              <TrendingUp className="h-3 w-3 mr-1" />
              Улучшен
            </Badge>
          </div>
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 min-h-[120px]">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {showDiff 
                ? getHighlightedText(originalResponse, correctedResponse, false)
                : correctedResponse
              }
            </p>
          </div>
        </div>
      </div>

      {/* Diff legend */}
      {showDiff && (
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-destructive/20" />
            <span>Удалено/Неверно</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-primary/20" />
            <span>Добавлено/Исправлено</span>
          </div>
        </div>
      )}
    </div>
  );
}
