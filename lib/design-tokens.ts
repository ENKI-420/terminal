// Design tokens for the AIDEN application
export const colors = {
  // Primary palette
  primary: {
    50: "#e6f7ff",
    100: "#bae7ff",
    200: "#91d5ff",
    300: "#69c0ff",
    400: "#40a9ff",
    500: "#1890ff",
    600: "#096dd9",
    700: "#0050b3",
    800: "#003a8c",
    900: "#002766",
  },
  // Secondary accent color (red for alerts/warnings)
  accent: {
    50: "#fff1f0",
    100: "#ffccc7",
    200: "#ffa39e",
    300: "#ff7875",
    400: "#ff4d4f",
    500: "#f5222d",
    600: "#cf1322",
    700: "#a8071a",
    800: "#820014",
    900: "#5c0011",
  },
  // Neutral colors for backgrounds, text, etc.
  neutral: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#e5e5e5",
    300: "#d9d9d9",
    400: "#bfbfbf",
    500: "#8c8c8c",
    600: "#595959",
    700: "#434343",
    800: "#262626",
    900: "#141414",
    950: "#0a0a0a",
  },
  // Success, warning, error states
  success: "#52c41a",
  warning: "#faad14",
  error: "#f5222d",
  info: "#1890ff",
}

export const shadows = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
  outline: "0 0 0 3px rgba(24, 144, 255, 0.5)",
  none: "none",
}

export const transitions = {
  fast: "150ms cubic-bezier(0.4, 0, 0.2, 1)",
  medium: "300ms cubic-bezier(0.4, 0, 0.2, 1)",
  slow: "500ms cubic-bezier(0.4, 0, 0.2, 1)",
}

export const zIndices = {
  hide: -1,
  auto: "auto",
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
}

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
}
