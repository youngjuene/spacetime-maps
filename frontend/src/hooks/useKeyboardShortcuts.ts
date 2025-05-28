import { useEffect, useCallback, useState } from "react";
import { ViewSettings, toggleSetting } from "../viewSettings";

export interface KeyboardShortcut {
  key: string;
  description: string;
  action: () => void;
  category: "Animation" | "Visual" | "Navigation" | "Advanced";
}

export interface UseKeyboardShortcutsProps {
  viewSettings: ViewSettings;
  setViewSettings: (settings: ViewSettings) => void;
  timeness: number;
  setTimeness: (timeness: number) => void;
  isMenuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  onInteraction?: () => void; // Optional callback for when user interacts
}

export const useKeyboardShortcuts = ({
  viewSettings,
  setViewSettings,
  timeness,
  setTimeness,
  isMenuOpen,
  setMenuOpen,
  onInteraction,
}: UseKeyboardShortcutsProps) => {
  const [showHelp, setShowHelp] = useState(false);

  const toggleViewSetting = useCallback(
    (setting: keyof ViewSettings) => {
      setViewSettings(toggleSetting(viewSettings, setting));
    },
    [viewSettings, setViewSettings]
  );

  const adjustTimeness = useCallback(
    (delta: number) => {
      const newTimeness = Math.max(0, Math.min(1, timeness + delta));
      setTimeness(newTimeness);
    },
    [timeness, setTimeness]
  );

  const shortcuts: KeyboardShortcut[] = [
    // Animation Controls
    {
      key: "Space",
      description: "Toggle auto-animation",
      action: () => toggleViewSetting("animate"),
      category: "Animation",
    },
    {
      key: "←/→",
      description: "Adjust time position (±5%)",
      action: () => {}, // Handled in keydown
      category: "Animation",
    },
    {
      key: "0",
      description: "Reset to space view (0%)",
      action: () => setTimeness(0),
      category: "Animation",
    },
    {
      key: "1",
      description: "Jump to time view (100%)",
      action: () => setTimeness(1),
      category: "Animation",
    },

    // Visual Controls
    {
      key: "A",
      description: "Toggle arrows",
      action: () => toggleViewSetting("showSpringArrows"),
      category: "Visual",
    },
    {
      key: "G",
      description: "Toggle grid",
      action: () => toggleViewSetting("showGrid"),
      category: "Visual",
    },
    {
      key: "P",
      description: "Toggle grid points",
      action: () => toggleViewSetting("showGridPoints"),
      category: "Visual",
    },
    {
      key: "N",
      description: "Toggle grid numbers",
      action: () => toggleViewSetting("showGridNumbers"),
      category: "Visual",
    },

    // Navigation
    {
      key: "M",
      description: "Toggle menu",
      action: () => setMenuOpen(!isMenuOpen),
      category: "Navigation",
    },
    {
      key: "Esc",
      description: "Close menu/help",
      action: () => {
        setMenuOpen(false);
        setShowHelp(false);
      },
      category: "Navigation",
    },
    {
      key: "?",
      description: "Show/hide keyboard shortcuts",
      action: () => setShowHelp(!showHelp),
      category: "Navigation",
    },

    // Advanced
    {
      key: "H",
      description: "Toggle focus on hover",
      action: () => toggleViewSetting("focusOnHover"),
      category: "Advanced",
    },
    {
      key: "D",
      description: "Toggle distance filtering",
      action: () => toggleViewSetting("showSpringsByDistance"),
      category: "Advanced",
    },
  ];

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const key = event.key;
      const code = event.code;

      // Handle special keys
      switch (key) {
        case " ":
          event.preventDefault();
          toggleViewSetting("animate");
          onInteraction?.();
          break;
        case "ArrowLeft":
          event.preventDefault();
          adjustTimeness(-0.05);
          onInteraction?.();
          break;
        case "ArrowRight":
          event.preventDefault();
          adjustTimeness(0.05);
          onInteraction?.();
          break;
        case "0":
          event.preventDefault();
          setTimeness(0);
          break;
        case "1":
          event.preventDefault();
          setTimeness(1);
          break;
        case "Escape":
          event.preventDefault();
          setMenuOpen(false);
          setShowHelp(false);
          break;
        case "?":
          event.preventDefault();
          setShowHelp(!showHelp);
          break;
        case "m":
        case "M":
          event.preventDefault();
          setMenuOpen(!isMenuOpen);
          break;
        case "a":
        case "A":
          event.preventDefault();
          toggleViewSetting("showSpringArrows");
          break;
        case "g":
        case "G":
          event.preventDefault();
          toggleViewSetting("showGrid");
          break;
        case "p":
        case "P":
          event.preventDefault();
          toggleViewSetting("showGridPoints");
          break;
        case "n":
        case "N":
          event.preventDefault();
          toggleViewSetting("showGridNumbers");
          break;
        case "h":
        case "H":
          event.preventDefault();
          toggleViewSetting("focusOnHover");
          break;
        case "d":
        case "D":
          event.preventDefault();
          toggleViewSetting("showSpringsByDistance");
          break;
      }
    },
    [
      toggleViewSetting,
      adjustTimeness,
      setTimeness,
      setMenuOpen,
      setShowHelp,
      isMenuOpen,
      showHelp,
      onInteraction,
    ]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return {
    shortcuts,
    showHelp,
    setShowHelp,
  };
};
