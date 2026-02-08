import { KeyboardShortcut, formatShortcutKey } from '@/hooks/useKeyboardShortcuts';

interface KeyboardShortcutsHelpProps {
  shortcuts: KeyboardShortcut[];
}

export function KeyboardShortcutsHelp({ shortcuts }: KeyboardShortcutsHelpProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Горячие клавиши</p>
      <div className="grid gap-1.5">
        {shortcuts.map((shortcut, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{shortcut.description}</span>
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">
              {formatShortcutKey(shortcut)}
            </kbd>
          </div>
        ))}
      </div>
    </div>
  );
}
