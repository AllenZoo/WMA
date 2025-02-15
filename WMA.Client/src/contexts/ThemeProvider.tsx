import { useColorScheme } from "nativewind";
import { ThemeProvider } from "@react-navigation/native";

import THEMES, { IThemeMode, ThemeMode } from "@/utils/themes";
import { createContext, useContext } from "react";

export const resolveTheme = (colorScheme: IThemeMode = "light") => ({
  dark: colorScheme === ThemeMode.dark,
  colors: {
    primary: THEMES[colorScheme].primary.DEFAULT,
    background: THEMES[colorScheme].background.DEFAULT,
    card: THEMES[colorScheme].background.DEFAULT,
    text: THEMES[colorScheme].foreground.DEFAULT,
    border: THEMES[colorScheme].foreground.DEFAULT,
    notification: THEMES[colorScheme].attention.info,
  },
});

interface IThemeContext {
  colorScheme: IThemeMode;
  setColorScheme: (colorScheme: IThemeMode) => void;
}

const ThemeContext = createContext<IThemeContext>({
  colorScheme: "dark" as IThemeMode,
  setColorScheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

const Provider = ({ children }: { children: React.ReactNode }) => {
  const { colorScheme, setColorScheme } = useColorScheme();
  return (
    <ThemeContext.Provider value={{ colorScheme, setColorScheme }}>
      <ThemeProvider value={resolveTheme(colorScheme)}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default Provider;
