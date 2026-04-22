import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import "@fontsource/montserrat/300.css";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/700.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import TestProgressPage from "./TestProgressPage";

const theme = createTheme({
  typography: {
    fontFamily: "'Montserrat', sans-serif",
    h2: { letterSpacing: "0.1em" },
    h3: { letterSpacing: "0.1em" },
    h4: { letterSpacing: "0.1em" },
    h5: { letterSpacing: "0.1em" },
    h6: { letterSpacing: "0.1em" },
  },
  palette: {
    mode: "dark",
    background: {
      default: "#333",
      paper: "#444",
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme} noSsr>
      <CssBaseline />
      <TestProgressPage />
    </ThemeProvider>
  </StrictMode>
);
