import React from "react";
import { KeyboardShortcut } from "../hooks/useKeyboardShortcuts";
import { Card, CardHeader, CardTitle, CardContent, Button } from "./ui";
import { cn } from "../utils/cn";

export interface KeyboardShortcutsModalProps {
  shortcuts: KeyboardShortcut[];
  isOpen: boolean;
  onClose: () => void;
}

const KeyboardKey: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <kbd className="px-2 py-1 text-xs font-semibold text-neutral-800 bg-neutral-100 border border-neutral-300 rounded-md shadow-sm">
    {children}
  </kbd>
);

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  shortcuts,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const groupedShortcuts = shortcuts.reduce(
    (acc, shortcut) => {
      if (!acc[shortcut.category]) {
        acc[shortcut.category] = [];
      }
      acc[shortcut.category].push(shortcut);
      return acc;
    },
    {} as Record<string, KeyboardShortcut[]>
  );

  const categoryOrder: Array<keyof typeof groupedShortcuts> = [
    "Navigation",
    "Animation",
    "Visual",
    "Advanced",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fade-in">
      <Card
        className="w-full max-w-2xl max-h-[80vh] overflow-auto bg-white shadow-2xl animate-slide-up"
        variant="elevated"
      >
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold text-neutral-900">
            ⌨️ Keyboard Shortcuts
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700"
          >
            ✕
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {categoryOrder.map((category) => {
            const categoryShortcuts = groupedShortcuts[category];
            if (!categoryShortcuts) return null;

            return (
              <div key={category} className="space-y-3">
                <h3 className="text-lg font-semibold text-neutral-800 border-b border-neutral-200 pb-2">
                  {category}
                </h3>
                <div className="grid gap-3">
                  {categoryShortcuts.map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-neutral-50 transition-colors"
                    >
                      <span className="text-neutral-700 font-medium">
                        {shortcut.description}
                      </span>
                      <KeyboardKey>{shortcut.key}</KeyboardKey>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Tips Section */}
          <div className="pt-4 border-t border-neutral-200">
            <h3 className="text-lg font-semibold text-neutral-800 mb-3">
              💡 Tips
            </h3>
            <div className="space-y-2 text-sm text-neutral-600">
              <p>
                • Press <KeyboardKey>?</KeyboardKey> anytime to show/hide this
                help
              </p>
              <p>
                • Use <KeyboardKey>←</KeyboardKey> and{" "}
                <KeyboardKey>→</KeyboardKey> for fine time control
              </p>
              <p>
                • Press <KeyboardKey>Esc</KeyboardKey> to close any open panels
              </p>
              <p>• All shortcuts work when the map is focused</p>
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-end pt-4">
            <Button onClick={onClose} variant="primary">
              Got it!
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
