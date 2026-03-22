import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import CssBaseline from "@mui/material/CssBaseline";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { LIGHTS_OUT } from "./constants.ts";
import {
  ThemeProvider,
  createTheme,
  PaletteOptions,
} from "@mui/material/styles";

const omniPalette: PaletteOptions = {
  mode: LIGHTS_OUT ? "dark" : undefined,
  primary: {
    light: "#d9fffe",
    main: "#00ffff",
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
  colorSchemes: LIGHTS_OUT
    ? undefined
    : {
        dark: {
          palette: omniPalette,
        },
        light: {
          palette: omniPalette,
        },
      },
  components: {
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          "&.Mui-selected svg": {
            color: "#00ffff",
          },
          "&.Mui-selected": {
            color: "inherit",
          },
          "&.Mui-selected span": {
            color: "inherit",
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: "1.1rem",
        },
      },
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme} noSsr>
      <CssBaseline enableColorScheme />
      <App />
    </ThemeProvider>
  </StrictMode>
);
