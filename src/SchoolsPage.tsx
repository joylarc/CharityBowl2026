import * as React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

const { useState, useEffect } = React;

export default function SchoolsPage() {
  const isSmall = useMediaQuery("(max-width:500px)");
  const [schools, setSchools] = useState<string[]>([]);

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + "schools.txt")
      .then((res) => res.text())
      .then((text) => {
        const list = text
          .split("\n")
          .map((s) => s.trim())
          .filter((s) => s.length > 0);
        list.sort((a, b) => a.localeCompare(b));
        setSchools(list);
      });
  }, []);

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Box sx={{ backgroundColor: "#00feff" }}>
        <Container maxWidth="lg" sx={{ padding: isSmall ? "1.5rem" : "2rem" }}>
          <Typography variant={isSmall ? "h5" : "h4"} fontWeight="bold" color="#000" sx={{ textAlign: "center" }}>
            Charitibundi Bowl Eligible Schools
          </Typography>
        </Container>
      </Box>
      <Container maxWidth="sm" sx={{ padding: isSmall ? "1rem 1.5rem" : "1.5rem 2rem" }}>
        {schools.map((school) => (
          <Typography key={school} variant="body1" sx={{ padding: "0.25rem 0" }}>
            {school}
          </Typography>
        ))}
      </Container>
    </Box>
  );
}
