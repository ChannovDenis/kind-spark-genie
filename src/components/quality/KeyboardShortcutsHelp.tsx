import { KeyboardShortcut, formatShortcutKey } from '@/hooks/useKeyboardShortcuts';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface KeyboardShortcutsHelpProps {
  shortcuts: KeyboardShortcut[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function KeyboardShortcutsHelp({ shortcuts, open, onOpenChange }: KeyboardShortcutsHelpProps) {
  const content = (
    <div className="space-y-2">
      <div className="grid gap-1.5">
        {shortcuts.map((shortcut, i) => (
          <div key={i} className="flex items-center justify-between text-sm py-1">
            <span className="text-muted-foreground">{shortcut.description}</span>
            <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
              {formatShortcutKey(shortcut)}
            </kbd>
          </div>
        ))}
      </div>
    </div>
  );

  // If open/onOpenChange provided, render as dialog
  if (open !== undefined && onOpenChange) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Горячие клавиши</DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  // Otherwise render inline
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Горячие клавиши</p>
      {content}
    </div>
  );
}
