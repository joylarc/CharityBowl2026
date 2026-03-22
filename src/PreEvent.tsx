import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function PreEvent() {
  const isSmall = useMediaQuery("(max-width:500px)");
  return (
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
      <Typography variant={isSmall ? "h4" : "h3"} fontWeight="bold">
        Coming Soon
      </Typography>
      <Typography variant="h6" color="text.secondary">
        The CharitiBundi Bowl 2026 leaderboard is almost here.
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 480 }}>
        Donations open April 2026. Follow along as schools compete to raise the
        most for New American Pathways.
      </Typography>
      <Box sx={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        <Button
          variant="contained"
          size="large"
          href="http://edsbscharitybowl.com"
          target="_blank"
        >
          Learn More
        </Button>
      </Box>
    </Container>
  );
}
