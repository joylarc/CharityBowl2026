import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import ShareIcon from "@mui/icons-material/Share";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { useAppState } from "./state";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import useMediaQuery from "@mui/material/useMediaQuery";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import StripedTableRow from "./StripedTableRow";

const { useCallback, useMemo, useRef, useState } = React;

const MAX_HEAD_TO_HEAD_TEAMS = 100;

function fallbackCopyTextToClipboard(text: string): boolean {
  const textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    return document.execCommand("copy");
  } catch (err) {
    console.error("Fallback: unable to copy", err);
    return false;
  } finally {
    document.body.removeChild(textArea);
  }
}

function copyTextToClipboard(text: string): Promise<boolean> {
  if (!navigator.clipboard) {
    const success = fallbackCopyTextToClipboard(text);
    return Promise.resolve(success);
  }
  return navigator.clipboard.writeText(text).then(
    () => true,
    (err) => {
      console.error("Async: Could not copy text: ", err);
      return fallbackCopyTextToClipboard(text);
    }
  );
}

export default function HeadToHead() {
  const { donations } = useAppState();
  const ref = useRef<HTMLDivElement>(null);
  const isSmall = useMediaQuery("(max-width:500px)");
  const url = new URL(window.location.href);
  const cQuery = url.searchParams.get("c") || "";
  const [showCopyTooltip, setShowCopyTooltip] = useState(false);
  if (showCopyTooltip) {
    setTimeout(() => {
      setShowCopyTooltip(false);
    }, 3000);
  }
  const [schools, setSchoolsState] = useState<string[]>(
    cQuery.split("|").filter((v) => v !== "")
  );
  const setSchools = useCallback(
    (q: string[]) => {
      const url = new URL(window.location.href);
      setSchoolsState(q);
      if (q.length === 0) {
        url.searchParams.delete("c");
      } else {
        url.searchParams.set("c", q.join("|"));
      }
      window.history.replaceState({}, "", url);
    },
    [setSchoolsState]
  );
  const rows = useMemo(() => {
    const rows = [];
    for (const name of schools) {
      rows.push({
        rank: 0,
        school: name,
        amount: donations[name],
      });
    }
    rows.sort((a, b) => b.amount - a.amount);
    for (const [i, row] of rows.entries()) {
      row.rank = i + 1;
    }
    return rows;
  }, [donations, schools]);

  const options = useMemo(() => {
    const options = Object.keys(donations).filter((school) => {
      return !schools.includes(school);
    });
    options.sort();
    return options;
  }, [donations, schools]);

  return (
    <Card ref={ref}>
      {schools.length < MAX_HEAD_TO_HEAD_TEAMS && (
        <Box sx={{ padding: "1rem" }}>
          <Autocomplete
            autoComplete
            autoHighlight
            disableClearable
            clearOnBlur
            clearOnEscape
            openOnFocus
            blurOnSelect={true}
            options={options}
            renderInput={(params) => (
              <TextField {...params} label="Add school" />
            )}
            value={""}
            onFocus={() => {
              const cur = ref.current;
              if (cur != null && isSmall) {
                cur.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }}
            onChange={(_, value) => {
              if (value != null) {
                setSchools([...schools, value]);
              }
            }}
          />
        </Box>
      )}
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
            {rows.map((row) => (
              <StripedTableRow key={row.rank}>
                <TableCell>{row.rank}</TableCell>
                <TableCell>{row.school}</TableCell>
                <TableCell>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    $
                    {Math.round(row.amount).toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                    <span
                      className="delete-button"
                      style={{ visibility: "hidden" }}
                    >
                      <IconButton
                        aria-label="delete"
                        color="error"
                        onClick={() => {
                          setSchools(
                            schools.filter((school) => school !== row.school)
                          );
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </span>
                  </div>
                </TableCell>
              </StripedTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ padding: "16px", marginBottom: "2rem" }}>
        <Box
          sx={{
            marginTop: "0.5rem",
            display: "flex",
            alignItems: "end",
            gap: "0.5rem",
          }}
        >
          <span>Like what you see?</span>{" "}
          <Tooltip open={showCopyTooltip} placement="top" title="Copied!">
            <Button
              variant="contained"
              onClick={() => {
                copyTextToClipboard(window.location.href).then((success) => {
                  setShowCopyTooltip(success);
                });
              }}
            >
              <ShareIcon /> Share this score!
            </Button>
          </Tooltip>
        </Box>
        <Box
          sx={{
            marginTop: "0.5rem",
            display: "flex",
            alignItems: "end",
            gap: "0.5rem",
          }}
        >
          <span>Don't like what you see?</span>{" "}
          <Button
            variant="contained"
            href="http://edsbscharitybowl.com"
            target="_blank"
          >
            Donate
          </Button>
        </Box>
      </Box>
    </Card>
  );
}
