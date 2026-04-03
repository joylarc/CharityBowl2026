import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import "@fontsource/montserrat/300.css";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/700.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import InfoPage from "./InfoPage";

const theme = createTheme({
  typography: {
    fontFamily: "'Montserrat', sans-serif",
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: { padding: 0 },
      },
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme} noSsr>
      <CssBaseline />
      <InfoPage />
    </ThemeProvider>
  </StrictMode>
);
