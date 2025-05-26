export const modernTheme = {
  primary: {
    50: "#f0f9ff", // Light blue
    100: "#e0f2fe",
    200: "#bae6fd",
    300: "#7dd3fc",
    400: "#38bdf8",
    500: "#3b82f6", // Main blue
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a", // Dark blue
  },
  accent: {
    50: "#faf5ff",
    100: "#f3e8ff",
    200: "#e9d5ff",
    300: "#d8b4fe",
    400: "#c084fc",
    500: "#8b5cf6", // Purple
    600: "#7c3aed", // Dark purple
    700: "#6d28d9",
    800: "#5b21b6",
    900: "#4c1d95",
  },
  neutral: {
    50: "#f8fafc", // Almost white
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b", // Dark slate
    900: "#0f172a", // Very dark
  },
  success: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
  },
  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
  },
  error: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
  },
} as const;

export type ThemeColors = typeof modernTheme;

// Semantic color mappings for easier usage
export const semanticColors = {
  background: {
    primary: modernTheme.neutral[50],
    secondary: modernTheme.neutral[100],
    tertiary: modernTheme.neutral[200],
    inverse: modernTheme.neutral[900],
  },
  text: {
    primary: modernTheme.neutral[900],
    secondary: modernTheme.neutral[700],
    tertiary: modernTheme.neutral[500],
    inverse: modernTheme.neutral[50],
    accent: modernTheme.primary[600],
  },
  border: {
    light: modernTheme.neutral[200],
    medium: modernTheme.neutral[300],
    dark: modernTheme.neutral[400],
  },
  interactive: {
    primary: modernTheme.primary[500],
    primaryHover: modernTheme.primary[600],
    secondary: modernTheme.accent[500],
    secondaryHover: modernTheme.accent[600],
  },
} as const;
