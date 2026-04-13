import * as React from "react";
import "./App.css";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import StripedTableRow from "./StripedTableRow";
import { SchoolSet } from "./state";

const { useMemo } = React;

interface RivalriesProps {
  data: SchoolSet[];
  query: string;
}
export default function Rivalries({ data, query }: RivalriesProps) {
  const filteredData = useMemo(
    () =>
      data.filter(
        (rivalry) =>
          rivalry.name.toLowerCase().includes(query.toLowerCase()) ||
          rivalry.schools.some((school) =>
            school.school.toLowerCase().includes(query.toLowerCase())
          )
      ),
    [data, query]
  );

  return (
    <div
      style={{
        display: "grid",
        alignItems: "start",
        gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
        gridGap: "1rem",
      }}
    >
      {filteredData.map((rivalry, i) => (
        <Card key={i}>
          <CardContent>
            <h2>{rivalry.name}</h2>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Rank</TableCell>
                    <TableCell>Team</TableCell>
                    <TableCell>Donations</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rivalry.schools.map((school, j) => (
                    <StripedTableRow key={school.school}>
                      <TableCell>{j + 1}</TableCell>
                      <TableCell>{school.school}</TableCell>
                      <TableCell>
                        $
                        {Math.round(school.total).toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })}
                      </TableCell>
                    </StripedTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
