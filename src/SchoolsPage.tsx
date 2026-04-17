import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

const { useState, useEffect } = React;

const MID_MAJORS = new Set([
  "Clark Atlanta University",
  "Georgetown",
  "Marquette",
  "Villanova",
  "Washington & Lee",
  "Washington University in St. Louis (WashU)",
  "William & Mary",
]);

const EDSBS_EXTENDED_UNIVERSE = new Set([
  "Ireland Rugby",
  "Jetski Police Academy",
  "Make Spencer Eat Cheese University",
  "Naropa University",
  "Pay Them Kids Their Money",
  "Protect Trans Kids University",
  "Soviet Cat University",
  "University of Night Ham",
]);

type Categories = {
  fbs: string[];
  midMajors: string[];
  edsbs: string[];
};

function categorize(schools: string[]): Categories {
  const fbs: string[] = [];
  const midMajors: string[] = [];
  const edsbs: string[] = [];
  for (const s of schools) {
    if (MID_MAJORS.has(s)) midMajors.push(s);
    else if (EDSBS_EXTENDED_UNIVERSE.has(s)) edsbs.push(s);
    else fbs.push(s);
  }
  fbs.sort((a, b) => a.localeCompare(b));
  midMajors.sort((a, b) => a.localeCompare(b));
  edsbs.sort((a, b) => a.localeCompare(b));
  return { fbs, midMajors, edsbs };
}

function Column({ title, id, teams }: { title: string; id: string; teams: string[] }) {
  return (
    <Box id={id}>
      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "0.5rem", borderBottom: "2px solid #00feff", paddingBottom: "0.25rem", minHeight: "4rem", display: "flex", alignItems: "flex-end" }}>
        {title}
      </Typography>
      {teams.map((team) => (
        <Typography key={team} variant="body2" sx={{ padding: "0.2rem 0" }}>
          {team}
        </Typography>
      ))}
    </Box>
  );
}

export default function SchoolsPage() {
  const isSmall = useMediaQuery("(max-width:600px)");
  const [categories, setCategories] = useState<Categories>({ fbs: [], midMajors: [], edsbs: [] });

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + "schools.txt")
      .then((res) => res.text())
      .then((text) => {
        const list = text
          .split("\n")
          .map((s) => s.trim())
          .filter((s) => s.length > 0);
        setCategories(categorize(list));
      });
  }, []);

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Box sx={{ backgroundColor: "#00feff" }}>
        <Container maxWidth="lg" sx={{ padding: isSmall ? "1.5rem" : "2rem" }}>
          <Typography variant={isSmall ? "h5" : "h4"} fontWeight="bold" color="#000" sx={{ textAlign: "center" }}>
            2026 Charitibundi Bowl Eligible Teams
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ padding: isSmall ? "1rem 1.5rem" : "1.5rem 2rem" }}>
        {/* Jump links on mobile */}
        {isSmall && (
          <Box sx={{ display: "flex", justifyContent: "center", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
            <Button variant="contained" href="#fbs" sx={{ backgroundColor: "#000", color: "#00feff", borderRadius: "24px", "&:hover": { backgroundColor: "#333" } }}>
              FBS
            </Button>
            <Button variant="contained" href="#mid-majors" sx={{ backgroundColor: "#000", color: "#00feff", borderRadius: "24px", "&:hover": { backgroundColor: "#333" } }}>
              Mid-Majors
            </Button>
            <Button variant="contained" href="#edsbs" sx={{ backgroundColor: "#000", color: "#00feff", borderRadius: "24px", "&:hover": { backgroundColor: "#333" } }}>
              EDSBS Extended Universe
            </Button>
          </Box>
        )}

        {isSmall ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <Column title="FBS" id="fbs" teams={categories.fbs} />
            <Column title="Mid-Majors" id="mid-majors" teams={categories.midMajors} />
            <Column title="EDSBS Extended Universe" id="edsbs" teams={categories.edsbs} />
          </Box>
        ) : (
          <Box sx={{ display: "flex", gap: "3rem", alignItems: "flex-start" }}>
            <Box sx={{ flex: 1 }}>
              <Column title="FBS" id="fbs" teams={categories.fbs} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Column title="Mid-Majors" id="mid-majors" teams={categories.midMajors} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Column title="EDSBS Extended Universe" id="edsbs" teams={categories.edsbs} />
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}
