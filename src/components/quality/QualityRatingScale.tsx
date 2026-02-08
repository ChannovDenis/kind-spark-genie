import { cn } from '@/lib/utils';
import { CaseRating } from '@/data/trainingData';

interface QualityRatingScaleProps {
  ratings?: CaseRating;
  onChange?: (ratings: CaseRating) => void;
  readonly?: boolean;
}

const ratingLabels = {
  accuracy: 'Точность',
  completeness: 'Полнота',
  tone: 'Тон',
};

const ratingDescriptions = {
  accuracy: 'Фактическая правильность исправления',
  completeness: 'Все важные аспекты учтены',
  tone: 'Соответствие тону и эмпатии',
};

function RatingRow({
  label,
  description,
  value,
  onChange,
  readonly,
}: {
  label: string;
  description: string;
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-xs text-muted-foreground">{value}/5</span>
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
      <div className="flex gap-1 mt-1">
        {[1, 2, 3, 4, 5].map((score) => (
          <button
            key={score}
            type="button"
            disabled={readonly}
            onClick={() => onChange?.(score)}
            className={cn(
              "w-8 h-8 rounded-md text-sm font-medium transition-all",
              score <= value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80",
              readonly && "cursor-default",
              !readonly && score > value && "hover:bg-primary/20"
            )}
          >
            {score}
          </button>
        ))}
      </div>
    </div>
  );
}

export function QualityRatingScale({ ratings, onChange, readonly = false }: QualityRatingScaleProps) {
  const currentRatings = ratings || { accuracy: 0, completeness: 0, tone: 0 };

  const handleChange = (key: keyof CaseRating, value: number) => {
    if (readonly || !onChange) return;
    onChange({ ...currentRatings, [key]: value });
  };

  const averageRating = ratings
    ? ((ratings.accuracy + ratings.completeness + ratings.tone) / 3).toFixed(1)
    : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Оценка качества исправления</h4>
        {averageRating && (
          <div className="flex items-center gap-1">
            <span className="text-lg font-bold text-primary">{averageRating}</span>
            <span className="text-xs text-muted-foreground">/5</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {(Object.keys(ratingLabels) as Array<keyof CaseRating>).map((key) => (
          <RatingRow
            key={key}
            label={ratingLabels[key]}
            description={ratingDescriptions[key]}
            value={currentRatings[key]}
            onChange={(value) => handleChange(key, value)}
            readonly={readonly}
          />
        ))}
      </div>
    </div>
  );
}

// Compact version for card preview
export function CompactRating({ ratings }: { ratings?: CaseRating }) {
  if (!ratings) return null;
  
  const avg = ((ratings.accuracy + ratings.completeness + ratings.tone) / 3).toFixed(1);
  
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={cn(
              "text-xs",
              star <= Math.round(Number(avg)) ? "text-warning" : "text-muted"
            )}
          >
            ★
          </span>
        ))}
      </div>
      <span className="text-xs text-muted-foreground">{avg}</span>
    </div>
  );
}
