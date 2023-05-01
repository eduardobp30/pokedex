import { createGlobalStyle } from "styled-components";
import { AppRoutes } from "./pages/routes";
import { ThemeProvider } from "./contexts/theme-context";

function App() {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider>
        <AppRoutes />
      </ThemeProvider>
    </>
  );
}

const GlobalStyle = createGlobalStyle`
  * {
    font-size: 16px;
    font-family: 'Roboto', sans-serif;
    text-decoration: none;
    box-sizing: border-box;
    border: none;
    outline: none;
    list-style: none
  }
`;

export default App;
