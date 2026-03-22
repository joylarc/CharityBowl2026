import * as React from "react";
import { useAppState } from "./state";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import StripedTableRow from "./StripedTableRow";

const { useMemo } = React;

interface LeaderboardProps {
  query: string;
}

export default function Leaderboard({ query }: LeaderboardProps) {
  const { donations } = useAppState();
  const rows = useMemo(() => {
    const rows = [];
    for (const key in donations) {
      rows.push({
        rank: 0,
        school: key,
        amount: donations[key],
      });
    }
    rows.sort((a, b) => b.amount - a.amount);
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
              <TableCell>School</TableCell>
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
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
