export const ThemeMode = {
  dark: "dark",
  light: "light",
  system: "system",
} as const;
export type IThemeMode = (typeof ThemeMode)[keyof typeof ThemeMode];

const THEMES = {
  dark: {
    accent: {
      DEFAULT: "#ffffff",
    },
    attention: {
      success: "#a0ff90",
      error: "#ff8a8a",
      info: "#ae9eff",
      warning: "#ffc080",
    },
    background: {
      DEFAULT: "#05080a",
      [100]: "#1e2123",
    },
    border: {
      DEFAULT: "#e1eb95",
      [100]: "#cbd486",
    },
    foreground: {
      DEFAULT: "#ebeff4",
      [100]: "#d4d7dc",
    },
    primary: {
      DEFAULT: "#e1eb95",
      [100]: "#cbd486",
    },
    secondary: {
      DEFAULT: "#64616c",
      [100]: "#5a5761",
    },
  },
  light: {
    accent: {
      DEFAULT: "#386bf6",
    },
    attention: {
      success: "#a0ff90",
      error: "#ff8a8a",
      info: "#ae9eff",
      warning: "#ffc080",
    },
    background: {
      DEFAULT: "#ebeff4",
      [100]: "#d4d7dc",
    },
    border: {
      DEFAULT: "#613eea",
      [100]: "#5738d3",
    },
    foreground: {
      DEFAULT: "#05080a",
      [100]: "#1e2123",
    },
    primary: {
      DEFAULT: "#613eea",
      [100]: "#5738d3",
    },
    secondary: {
      DEFAULT: "#64616c",
      [100]: "#85828d",
    },
  },
} as Partial<Record<IThemeMode, Record<string, Record<string, string>>>>;
export default THEMES as Record<
  IThemeMode,
  Record<string, Record<string, string>>
>;
