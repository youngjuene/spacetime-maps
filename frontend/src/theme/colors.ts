// Soft Mobility Theme Colors
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export const modernTheme: ThemeColors = {
  primary: "#3B82F6", // Blue for primary actions
  secondary: "#6B7280", // Gray for secondary elements
  accent: "#10B981", // Green for soft mobility (eco-friendly)
  background: "#FFFFFF", // White background
  surface: "#F9FAFB", // Light gray for surfaces
  text: "#111827", // Dark gray for text
  textSecondary: "#6B7280", // Medium gray for secondary text
  border: "#E5E7EB", // Light gray for borders
  success: "#10B981", // Green for success states
  warning: "#F59E0B", // Amber for warnings
  error: "#EF4444", // Red for errors
  info: "#3B82F6", // Blue for info
};

export const semanticColors = {
  // Soft Mobility Mode Colors
  pedestrian: "#8B5CF6", // Purple for pedestrian
  runner: "#F59E0B", // Orange for runner
  cyclist: "#10B981", // Green for cyclist

  // City Colors
  newYork: "#1E40AF", // Blue for New York
  daejeon: "#DC2626", // Red for Daejeon

  // Map States
  normal: "#6B7280", // Gray for normal state
  timeBased: "#3B82F6", // Blue for time-based state
  hover: "#F59E0B", // Orange for hover state

  // Performance Indicators
  excellent: "#10B981", // Green
  good: "#84CC16", // Light green
  fair: "#F59E0B", // Orange
  poor: "#EF4444", // Red
};
