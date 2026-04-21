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
import { useTheme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import StripedTableRow from "./StripedTableRow";

const { Suspense, useMemo, useRef, useState, use } = React;

type DonationMap = { [school: string]: number };

function unwrap(text: string): string {
  if (text.startsWith('"') && text.endsWith('"')) return text.slice(1, -1);
  return text;
}

function readFullcastData(text: string): [DonationMap, string] {
  const lines = text.split("\n");
  const timestamp = unwrap(lines.shift() || "");
  const donations: DonationMap = {};
  for (const line of lines) {
    const parts = line.split(",");
    if (parts.length !== 2) continue;
    const school = unwrap(parts[0].trim());
    const amount = parseFloat(unwrap(parts[1].trim()));
    if (school === "" || isNaN(amount) || amount <= 0) continue;
    donations[school] = (donations[school] || 0) + amount;
  }
  return [donations, timestamp];
}

let cachedLoad: Promise<{ donations: DonationMap; timestamp: string }> | null = null;
function loadFullcastData() {
  if (cachedLoad) return cachedLoad;
  cachedLoad = fetch("/fullcast.csv")
    .then((res) => res.text())
    .then((text) => {
      const [donations, timestamp] = readFullcastData(text);
      return { donations, timestamp };
    });
  return cachedLoad;
}

function Search({ query, setQuery }: { query: string; setQuery: (q: string) => void }) {
  const isSmall = useMediaQuery("(max-width:500px)");
  const ref = useRef<HTMLElement>(null);
  return (
    <Box ref={ref} sx={{ margin: isSmall ? "0 1rem 1rem 1rem" : "0 0 1rem 0" }}>
      <TextField
        placeholder="Search for a team"
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
                  <IconButton aria-label="clear" onClick={() => setQuery("")}>
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

function Leaderboard({ donations, query }: { donations: DonationMap; query: string }) {
  const rows = useMemo(() => {
    const rows = [];
    for (const key in donations) {
      rows.push({ rank: 0, school: key, amount: donations[key] });
    }
    rows.sort((a, b) => b.amount - a.amount || a.school.localeCompare(b.school));
    for (const [i, row] of rows.entries()) {
      row.rank = i + 1;
    }
    return rows;
  }, [donations]);

  const filteredRows = rows.filter((row) =>
    row.school.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Card>
      <TableContainer component={CardContent}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Rank</TableCell>
              <TableCell>Team</TableCell>
              <TableCell>Donations</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row) => (
              <StripedTableRow key={row.rank}>
                <TableCell>{row.rank}</TableCell>
                <TableCell>{row.school}</TableCell>
                <TableCell>
                  $
                  {Math.round(row.amount).toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}
                </TableCell>
              </StripedTableRow>
            ))}
            {filteredRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} sx={{ textAlign: "center", padding: "2rem" }}>
                  {Object.keys(donations).length === 0
                    ? "No donations in this window yet"
                    : "No matching teams"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}

function Content() {
  const isSmall = useMediaQuery("(max-width:500px)");
  const data = use(loadFullcastData());
  const [query, setQuery] = useState("");

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
        <Box sx={{ width: "100%", marginTop: 3 }}>
          <Search query={query} setQuery={setQuery} />
          <Leaderboard donations={data.donations} query={query} />
        </Box>
      </Box>
    </Container>
  );
}

function Loading() {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", padding: 2 }}>
      <CircularProgress />
    </Box>
  );
}

function getFullcastStart(): number {
  // 2 PM ET today
  const now = new Date();
  const today = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  today.setHours(14, 0, 0, 0);
  // Convert back to UTC timestamp
  const offset = now.getTime() - new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" })).getTime();
  return today.getTime() + offset;
}

export default function FullcastApp() {
  const theme = useTheme();
  const fullcastStart = getFullcastStart();
  const forceMode = new URL(window.location.href).searchParams.get("mode") === "live";
  const isLive = forceMode || Date.now() >= fullcastStart;

  React.useEffect(() => {
    if (!isLive) {
      const timer = setTimeout(() => window.location.reload(), fullcastStart - Date.now());
      return () => clearTimeout(timer);
    }
  }, [isLive, fullcastStart]);

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
        <img
          style={{ objectFit: "contain", width: "100%", height: "100%" }}
          src={import.meta.env.BASE_URL + "fullcast-logo.png"}
          alt="Fullcast Leaderboard"
        />
      </header>
      {isLive ? (
        <Suspense fallback={<Loading />}>
          <Content />
        </Suspense>
      ) : (
        <Box sx={{
          textAlign: "center",
          padding: "3rem",
          fontSize: "4rem",
          fontWeight: "bold",
          color: "#fff",
          textShadow: "-2px -2px 0 #fed426, 2px -2px 0 #fed426, -2px 2px 0 #fed426, 2px 2px 0 #fed426, 0 -2px 0 #fed426, 0 2px 0 #fed426, -2px 0 0 #fed426, 2px 0 0 #fed426",
        }}>
          WATCH THIS SPACE
        </Box>
      )}
    </>
  );
}
