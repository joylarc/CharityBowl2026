import * as React from "react";
import "./App.css";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import InputAdornment from "@mui/material/InputAdornment";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { LIGHTS_OUT, PRE_EVENT } from "./constants.ts";
import { useTheme } from "@mui/material/styles";

import HeadToHead from "./HeadToHead";
import PreEvent from "./PreEvent";
import Leaderboard from "./Leaderboard";
import Navigation, { TabType } from "./Navigation";
import Rivalries from "./Rivalries";
import { AppContext, useAppState, createState } from "./state";

const { Suspense, useCallback, useRef, useState, use } = React;

interface SearchProps {
  query: string;
  setQuery: (q: string) => void;
  placeholder?: string;
}
function Search({ query, setQuery, placeholder = "Search for a team" }: SearchProps) {
  const isSmall = useMediaQuery("(max-width:500px)");
  const ref = useRef<HTMLElement>(null);
  return (
    <Box ref={ref} sx={{ margin: isSmall ? "0 1rem 1rem 1rem" : "0 0 1rem 0" }}>
      <TextField
        placeholder={placeholder}
        value={query}
        fullWidth
        onFocus={() => {
          const cur = ref.current;
          if (cur != null && isSmall) {
            cur.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }}
        onChange={(e) => setQuery(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment:
              query === "" ? null : (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="clear"
                    onClick={() => {
                      setQuery("");
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </InputAdornment>
              ),
          },
        }}
        variant="standard"
      />
    </Box>
  );
}

const DVD_COLORS = ["#fed426", "#ff6b6b", "#51cf66", "#339af0", "#cc5de8", "#ff922b", "#20c997"];

function DvdBouncer({ onClose, isSmall }: { onClose: () => void; isSmall: boolean }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const speed = isSmall ? 0.8 : 1.5;
  const posRef = useRef({ x: 100, y: 100 });
  const velRef = useRef({ x: speed, y: speed * 0.8 });
  const colorRef = useRef(0);
  const animRef = useRef(0);
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  // Escape key dismissal
  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Bounce animation (skip if reduced motion)
  React.useEffect(() => {
    if (prefersReducedMotion) return;
    const animate = () => {
      const el = boxRef.current;
      if (!el) return;
      const w = window.innerWidth - el.offsetWidth;
      const h = window.innerHeight - el.offsetHeight;
      const pos = posRef.current;
      const vel = velRef.current;

      pos.x += vel.x;
      pos.y += vel.y;

      let bounced = false;
      if (pos.x <= 0 || pos.x >= w) { vel.x *= -1; pos.x = Math.max(0, Math.min(w, pos.x)); bounced = true; }
      if (pos.y <= 0 || pos.y >= h) { vel.y *= -1; pos.y = Math.max(0, Math.min(h, pos.y)); bounced = true; }
      if (bounced) { colorRef.current = (colorRef.current + 1) % DVD_COLORS.length; el.style.color = DVD_COLORS[colorRef.current]; el.style.borderColor = DVD_COLORS[colorRef.current]; }

      el.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [prefersReducedMotion]);

  const staticStyle = prefersReducedMotion ? {
    position: "fixed" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 10000,
  } : {};

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 10000, pointerEvents: "none" }}>
      <div
        ref={boxRef}
        role="dialog"
        aria-label="Dark match announcement"
        onClick={onClose}
        tabIndex={0}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "auto",
          cursor: "pointer",
          padding: isSmall ? "1rem" : "1.5rem 2rem",
          border: "2px solid #fed426",
          borderRadius: 8,
          backgroundColor: "rgba(0,0,0,0.9)",
          color: "#fed426",
          textAlign: "center",
          maxWidth: isSmall ? "85vw" : "400px",
          fontSize: isSmall ? "0.9rem" : "1.1rem",
          lineHeight: 1.6,
          userSelect: "none",
          ...staticStyle,
        }}
      >
        <div style={{ fontSize: isSmall ? "1.2rem" : "1.5rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
          DARK MATCH ACTIVATED
        </div>
        It's a #CharitibundiBowl free-for-all&nbsp;...&nbsp;with&nbsp;the&nbsp;lights&nbsp;out.
        <br />
        Team names are hidden.
        <br />
        Donate as fast as you can, as often as you like, until 11:59 PM&nbsp;ET Sunday night.
        <br />
        <strong>GO GO GO GO GO GO GO</strong>
        <br />
        <a href="https://www.edsbscharitybowl.com" target="_blank" style={{ color: "inherit" }}>
          EDSBSCHARITYBOWL.COM
        </a>
        <div style={{ marginTop: "0.75rem", fontSize: "0.85rem", fontWeight: "bold", opacity: 0.6 }}>
          click to dismiss
        </div>
      </div>
    </div>
  );
}

function Content() {
  const url = new URL(window.location.href);
  const tQuery = (url.searchParams.get("t") || "leaderboard") as TabType;
  const isSmall = useMediaQuery("(max-width:500px)");
  const [tab, setTab] = useState<TabType>(LIGHTS_OUT ? "leaderboard" : tQuery);
  const { rivalries, conferences } = useAppState();
  const [showLightsOutDialog, setShowLightsOutDialog] = useState(LIGHTS_OUT);
  const [query, setQueryState] = useState<string>(
    url.searchParams.get("q") || ""
  );
  const setQuery = useCallback(
    (q: string) => {
      const url = new URL(window.location.href);
      setQueryState(q);
      if (q === "") {
        url.searchParams.delete("q");
      } else {
        url.searchParams.set("q", q);
      }
      window.history.replaceState({}, "", url);
    },
    [setQueryState]
  );
  return (
    <Container
      maxWidth="lg"
      sx={{
        display: "flex",
        justifyContent: "center",
        padding: isSmall ? "0 0 2rem 0" : "0 0.5rem",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            width: "100%",
            padding: "0.75rem 0",
          }}
        >
          <a
            href={LIGHTS_OUT ? "https://fundraise.givesmart.com/form/9bJ4vg?vid=1pu113" : "/about.html"}
            target={LIGHTS_OUT ? "_blank" : undefined}
            style={{
              display: "inline-block",
              color: LIGHTS_OUT ? "#fed426" : "#666",
              textDecoration: "none",
              fontSize: "0.875rem",
              fontWeight: LIGHTS_OUT ? "bold" : 500,
              textTransform: "uppercase",
              letterSpacing: "0.02857em",
              padding: "0.5rem 1.25rem",
              border: `1px solid ${LIGHTS_OUT ? "#fed426" : "#999"}`,
              borderRadius: "4px",
            }}
          >
            {LIGHTS_OUT ? "Donate" : "About Money Cannon"}
          </a>
        </Box>
        {!LIGHTS_OUT && <Navigation tab={tab} setTab={setTab} />}
        <CustomTabPanel value={tab} index="leaderboard">
          {!LIGHTS_OUT && <Search query={query} setQuery={setQuery} />}
          <Leaderboard query={query} />
        </CustomTabPanel>
        {!LIGHTS_OUT && (
          <>
            <CustomTabPanel value={tab} index="rivalries">
              <Search query={query} setQuery={setQuery} placeholder="Search for a team or rivalry" />
              <Rivalries data={rivalries} query={query} />
            </CustomTabPanel>
            <CustomTabPanel value={tab} index="conferences">
              <Search query={query} setQuery={setQuery} placeholder="Search for a team or conference" />
              <Rivalries data={conferences} query={query} />
            </CustomTabPanel>
            <CustomTabPanel value={tab} index="head-to-head">
              <HeadToHead />
            </CustomTabPanel>
          </>
        )}
      </Box>

      {showLightsOutDialog && <DvdBouncer onClose={() => setShowLightsOutDialog(false)} isSmall={isSmall} />}
    </Container>
  );
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: string;
  value: string;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index } = props;

  return (
    <div role="tabpanel" hidden={value !== index} style={{ width: "100%" }}>
      {value === index && <Box sx={{ marginTop: 3 }}>{children}</Box>}
    </div>
  );
}

function DataContent() {
  const state = use(createState());
  return (
    <AppContext.Provider value={state}>
      <Content />
    </AppContext.Provider>
  );
}

function Loading() {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", padding: 2 }}>
      <CircularProgress />
    </Box>
  );
}

export default function App() {
  const theme = useTheme();
  return (
    <>
      <header
        style={{
          backgroundColor: LIGHTS_OUT ? "#000" : theme.palette.primary.main,
          display: "flex",
          justifyContent: "center",
          maxHeight: "40vh",
        }}
      >
        <a href="https://www.edsbscharitybowl.com" style={{ display: "inline-block" }}>
          <img
            style={{ objectFit: "contain", width: "100%", height: "100%" }}
            src={import.meta.env.BASE_URL + (LIGHTS_OUT ? "logo-dark.png" : "logo.png")}
            alt="CharitiBundi Bowl 2026 - Supporting New American Pathways"
          />
        </a>
      </header>
      {PRE_EVENT && Date.now() < new Date("2026-04-20T10:00:00-04:00").getTime() && new URL(window.location.href).searchParams.get("mode") !== "live" ? (
        <PreEvent />
      ) : (
        <Suspense fallback={<Loading />}>
          <DataContent />
        </Suspense>
      )}
    </>
  );
}
