import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "@fontsource/montserrat/300.css";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/700.css";

const { useState, useEffect } = React;

const EVENT_START = new Date("2026-04-20T10:00:00-05:00");

const preEventTheme = createTheme({
  typography: {
    fontFamily: "'Montserrat', sans-serif",
  },
});

function getTimeLeft() {
  const now = Date.now();
  const diff = EVENT_START.getTime() - now;
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <Box sx={{ textAlign: "center", minWidth: 60 }}>
      <Typography variant="h2" fontWeight="bold" color="#000" sx={{ fontVariantNumeric: "tabular-nums" }}>
        {String(value).padStart(2, "0")}
      </Typography>
      <Typography variant="caption" color="#000" sx={{ textTransform: "uppercase" }}>
        {label}
      </Typography>
    </Box>
  );
}

export default function PreEvent() {
  const isSmall = useMediaQuery("(max-width:500px)");
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  useEffect(() => {
    const id = setInterval(() => {
      const t = getTimeLeft();
      if (t === null) clearInterval(id);
      setTimeLeft(t);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <ThemeProvider theme={preEventTheme}>
      <Box
        sx={{
          backgroundColor: "#00feff",
          minHeight: "calc(100vh - 40vh)",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Container
          maxWidth="md"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: isSmall ? "2rem 1rem" : "3rem 1rem",
            gap: "1.5rem",
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Typography variant={isSmall ? "h4" : "h3"} fontWeight="bold" color="#000">
              2026 Charitibundi Bowl
            </Typography>
            <Typography variant={isSmall ? "h5" : "h4"} fontWeight="bold" fontStyle="italic" color="#000" sx={{ marginTop: "1.5rem" }}>
              Coming Soon
            </Typography>
          </Box>
          {timeLeft ? (
            <Box sx={{ display: "flex", gap: isSmall ? "0.75rem" : "1.5rem", marginTop: "0.5rem" }}>
              <CountdownUnit value={timeLeft.days} label="Days" />
              <CountdownUnit value={timeLeft.hours} label="Hours" />
              <CountdownUnit value={timeLeft.minutes} label="Min" />
              <CountdownUnit value={timeLeft.seconds} label="Sec" />
            </Box>
          ) : (
            <Typography variant="h5" fontWeight="bold" color="#000">
              The event has started!
            </Typography>
          )}
          <Box sx={{ display: "flex", gap: "1rem", marginTop: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
            <Button
              variant="contained"
              size="large"
              href="https://newamericanpathways.org/"
              target="_blank"
              sx={{ backgroundColor: "#000", color: "#00feff", "&:hover": { backgroundColor: "#333" } }}
            >
              About New American Pathways
            </Button>
            <Button
              variant="contained"
              size="large"
              href={import.meta.env.BASE_URL + "about.html"}
              sx={{ backgroundColor: "#000", color: "#00feff", "&:hover": { backgroundColor: "#333" } }}
            >
              About Money Cannon
            </Button>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
