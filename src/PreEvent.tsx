import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

const { useState, useEffect } = React;

const EVENT_START = new Date("2026-04-20T08:00:00-05:00");

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
      <Typography variant="h3" fontWeight="bold" color="#000" sx={{ fontVariantNumeric: "tabular-nums" }}>
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
    <Box
      sx={{
        backgroundColor: "#00ffff",
        minHeight: "calc(100vh - 40vh)",
        display: "flex",
        justifyContent: "center",
      }}
    >
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        padding: isSmall ? "2rem 1rem" : "3rem 1rem",
        gap: "1.5rem",
      }}
    >
      <Typography variant={isSmall ? "h4" : "h3"} fontWeight="bold" color="#000">
        Coming Soon
      </Typography>
      <Typography variant="h6" color="#000">
        The CharitiBundi Bowl 2026 leaderboard is almost here.
      </Typography>
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
      <Typography variant="body1" color="#000" sx={{ maxWidth: 480 }}>
        Donations open April 20, 2026. Follow along as schools compete to raise
        the most for New American Pathways.
      </Typography>
      <Box sx={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        <Button
          variant="contained"
          size="large"
          href="http://edsbscharitybowl.com"
          target="_blank"
          sx={{ backgroundColor: "#000", color: "#00ffff", "&:hover": { backgroundColor: "#333" } }}
        >
          Learn More
        </Button>
      </Box>
    </Container>
    </Box>
  );
}
