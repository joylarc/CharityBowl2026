import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled, useTheme } from "@mui/material/styles";

const { Suspense, useMemo, useRef, useState, use } = React;

const StripedTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.background.default,
  },
}));

type DonationMap = { [school: string]: number };

function readDonations(text: string): DonationMap {
  const lines = text.split("\n");
  lines.shift(); // skip timestamp
  const donations: DonationMap = {};
  for (const line of lines) {
    const parts = line.split(",");
    if (parts.length !== 2) continue;
    const unwrap = (s: string) => s.trim().replace(/^"|"$/g, "");
    const school = unwrap(parts[0]);
    const amount = parseFloat(unwrap(parts[1]));
    if (school === "" || isNaN(amount)) continue;
    donations[school] = (donations[school] || 0) + amount;
  }
  return donations;
}

let cached: Promise<DonationMap> | null = null;
function loadDonations(): Promise<DonationMap> {
  if (cached) return cached;
  cached = fetch(import.meta.env.BASE_URL + "donations-2025.csv")
    .then((r) => r.text())
    .then(readDonations);
  return cached;
}

function Leaderboard({ query }: { query: string }) {
  const donations = use(loadDonations());
  const rows = useMemo(() => {
    const rows = [];
    for (const key in donations) {
      rows.push({ rank: 0, school: key, amount: donations[key] });
    }
    rows.sort((a, b) => b.amount - a.amount);
    for (const [i, row] of rows.entries()) {
      row.rank = i + 1;
    }
    return rows;
  }, [donations]);

  const filtered = rows.filter((r) =>
    r.school.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Card>
      <TableContainer component={CardContent}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Rank</TableCell>
              <TableCell>School</TableCell>
              <TableCell>Donations</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((row) => (
              <StripedTableRow key={row.rank}>
                <TableCell>{row.rank}</TableCell>
                <TableCell>{row.school}</TableCell>
                <TableCell>
                  ${Math.round(row.amount).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </TableCell>
              </StripedTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}

export default function Results2025() {
  const theme = useTheme();
  const isSmall = useMediaQuery("(max-width:500px)");
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLElement>(null);

  return (
    <>
      <header
        style={{
          backgroundColor: theme.palette.primary.main,
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          maxHeight: "40vh",
          overflow: "hidden",
        }}
      >
        <img
          style={{ objectFit: "contain", maxWidth: "100%", maxHeight: "40vh" }}
          src={import.meta.env.BASE_URL + "2025results.png"}
          alt="CharitiBundi Bowl 2025"
        />
      </header>
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
          <Typography
            variant={isSmall ? "h5" : "h4"}
            fontWeight="bold"
            sx={{ textAlign: "center", padding: "1.5rem 1rem 1rem" }}
          >
            2025 Charitibundi Bowl Final Standings
          </Typography>
          <Box
            ref={searchRef}
            sx={{ margin: isSmall ? "0 1rem 1rem 1rem" : "0 0 1rem 0", width: isSmall ? "auto" : "100%" }}
          >
            <TextField
              placeholder="Search for a school"
              value={query}
              fullWidth
              onFocus={() => {
                const cur = searchRef.current;
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
          <Box sx={{ marginTop: 3, width: "100%" }}>
            <Suspense
              fallback={
                <Box sx={{ display: "flex", justifyContent: "center", padding: 2 }}>
                  <CircularProgress />
                </Box>
              }
            >
              <Leaderboard query={query} />
            </Suspense>
          </Box>
        </Box>
      </Container>
    </>
  );
}
