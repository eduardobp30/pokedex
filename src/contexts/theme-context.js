import { createContext, useState } from "react";

export const themes = {
  light: {
    color: "#3F4739",
    background: "#BACBA9",
    button_color: "#92AD94",
    hover_color: "#E1F4CB",
  },
  dark: {
    color: "#ffffff",
    background: "#333333",
    button_color: "#515052",
    hover_color: "#6a6a6a",
  },
};

export const ThemeContext = createContext({});

export const ThemeProvider = (props) => {
  const [theme, setTheme] = useState(themes.dark);
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {props.children}
    </ThemeContext.Provider>
  );
};
