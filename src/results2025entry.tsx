import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import {
  ThemeProvider,
  createTheme,
  PaletteOptions,
} from "@mui/material/styles";
import Results2025 from "./Results2025";

const omniPalette: PaletteOptions = {
  primary: {
    light: "#d9fffe",
    main: "#00feff",
    dark: "#00f5fe",
    contrastText: "#000",
  },
  secondary: {
    light: "#279fff",
    main: "#0080ff",
    dark: "#1c5bd8",
    contrastText: "#000",
  },
};

const theme = createTheme({
  palette: omniPalette,
  colorSchemes: {
    dark: { palette: omniPalette },
    light: { palette: omniPalette },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: { padding: 0 },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { fontSize: "1.1rem" },
      },
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme} noSsr>
      <CssBaseline enableColorScheme />
      <Results2025 />
    </ThemeProvider>
  </StrictMode>
);
