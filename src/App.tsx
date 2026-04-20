import * as React from "react";
import "./App.css";
import Paper, { PaperProps } from "@mui/material/Paper";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import InputAdornment from "@mui/material/InputAdornment";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
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

function DialogBody(props: PaperProps) {
  return <Paper {...props} elevation={0} variant="outlined" />;
}

function Content() {
  const url = new URL(window.location.href);
  const tQuery = (url.searchParams.get("t") || "leaderboard") as TabType;
  const isSmall = useMediaQuery("(max-width:500px)");
  const [tab, setTab] = useState<TabType>(tQuery);
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
            href="/about.html"
            style={{
              display: "inline-block",
              color: "#666",
              textDecoration: "none",
              fontSize: "0.875rem",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.02857em",
              padding: "0.5rem 1.25rem",
              border: "1px solid #999",
              borderRadius: "4px",
            }}
          >
            About Money Cannon
          </a>
        </Box>
        <Navigation tab={tab} setTab={setTab} />
        <CustomTabPanel value={tab} index="leaderboard">
          <Search query={query} setQuery={setQuery} />
          <Leaderboard query={query} />
        </CustomTabPanel>
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
      </Box>

      <Dialog
        open={showLightsOutDialog}
        maxWidth="lg"
        PaperComponent={DialogBody}
        onClose={() => setShowLightsOutDialog(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <IconButton
          aria-label="clear"
          onClick={() => setShowLightsOutDialog(false)}
          sx={{ position: "absolute", right: 0, top: 0 }}
        >
          <CloseIcon />
        </IconButton>
        <DialogTitle
          id="responsive-dialog-title"
          sx={{ textAlign: "center", fontSize: isSmall ? "1.25rem" : "1.5rem" }}
        >
          <div style={{ color: "#fed426" }}>DARK MODE ACTIVATED</div>
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
              color: "#fed426",
              textAlign: "center",
              fontSize: isSmall ? "1rem" : "1.2rem",
            }}
          >
            It's a #CharitibundiBowl free-for-all ... with the lights out.
            <br />
            Leaderboard updates are paused.
            <br />
            Donate as fast as you can, as often as you like, until 11:59PM ET
            Sunday night.
            <br />
            Winners announced Monday.
            <br />
            <strong>GO GO GO GO GO GO GO</strong>
            <br />
            <a href="https://www.edsbscharitybowl.com" target="_blank">
              EDSBSCHARITYBOWL.COM
            </a>
          </DialogContentText>
        </DialogContent>
      </Dialog>
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
          backgroundColor: theme.palette.primary.main,
          display: "flex",
          justifyContent: "center",
          maxHeight: "40vh",
        }}
      >
        <a href="https://www.edsbscharitybowl.com" style={{ display: "inline-block" }}>
          <img
            style={{ objectFit: "contain", width: "100%", height: "100%" }}
            src={import.meta.env.BASE_URL + "logo.png"}
            alt="CharitiBundi Bowl 2026 - Supporting New American Pathways"
          />
        </a>
      </header>
      {PRE_EVENT && Date.now() < new Date("2026-04-20T06:45:00-04:00").getTime() && new URL(window.location.href).searchParams.get("mode") !== "live" ? (
        <PreEvent />
      ) : (
        <Suspense fallback={<Loading />}>
          <DataContent />
        </Suspense>
      )}
    </>
  );
}
