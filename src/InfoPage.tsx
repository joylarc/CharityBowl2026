import * as React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

const { useState, useEffect } = React;

const EVENT_START = new Date("2026-04-20T10:00:00-04:00");

function getTimeLeft() {
  const now = Date.now();
  const diff = EVENT_START.getTime() - now;
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <Box sx={{ textAlign: "center", minWidth: 60 }}>
      <Typography variant="h3" fontWeight="bold" color="#000" sx={{ fontVariantNumeric: "tabular-nums" }}>
        {String(value).padStart(2, "0")}
      </Typography>
      <Typography variant="caption" color="#000" sx={{ textTransform: "uppercase" }}>
        {label}
      </Typography>
    </Box>
  );
}

function Section({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ width: "100%", padding: "2rem 0" }}>
      {children}
    </Box>
  );
}

export default function InfoPage() {
  const isSmall = useMediaQuery("(max-width:500px)");
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  useEffect(() => {
    const id = setInterval(() => {
      const t = getTimeLeft();
      if (t === null) clearInterval(id);
      setTimeLeft(t);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <Box sx={{ minHeight: "100vh" }}>
      {/* Cyan hero area */}
      <Box sx={{ backgroundColor: "#00feff" }}>
        <Container maxWidth="lg" sx={{ padding: isSmall ? "1.5rem 1.5rem 1rem" : "2rem 2rem 1rem" }}>

          {/* Hero: tagline + countdown */}
          <Box sx={{ width: "100%", padding: "1rem 0" }}>
            <Typography
              variant={isSmall ? "h6" : "h5"}
              fontWeight="bold"
              color="#000"
              sx={{ textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "center", mb: 3 }}
            >
              Prove yourself better than your rival in the name of charity
            </Typography>
            {timeLeft ? (
              <Box sx={{ display: "flex", justifyContent: "center", gap: isSmall ? "0.75rem" : "1.5rem" }}>
                <CountdownUnit value={timeLeft.days} label="Days" />
                <CountdownUnit value={timeLeft.hours} label="Hours" />
                <CountdownUnit value={timeLeft.minutes} label="Min" />
                <CountdownUnit value={timeLeft.seconds} label="Sec" />
              </Box>
            ) : (
              <Typography variant="h5" fontWeight="bold" color="#000" sx={{ textAlign: "center" }}>
                The event has started!
              </Typography>
            )}
          </Box>

        </Container>
      </Box>

      {/* White body area */}
      <Box sx={{ backgroundColor: "#fff" }}>
        <Container maxWidth="lg" sx={{ padding: isSmall ? "0 1.5rem 2rem" : "0 2rem 3rem" }}>

          {/* Kickoff announcement */}
          <Section>
            <Typography variant="body1" color="#000" sx={{ fontSize: isSmall ? "1rem" : "1.1rem" }}>
              The <strong>2026 EDSBS Charity Bowl</strong> will kick off (football term) on <strong>Monday morning, April 20</strong>,
              via announcement on the New American Pathways{" "}
              <a href="https://bsky.app/profile/newap-georgia.bsky.social" target="_blank" style={{ color: "#00bfbf" }}>
                Bluesky feed
              </a>{" "}
              and{" "}
              <a href="https://www.instagram.com/newamericanpathways/" target="_blank" style={{ color: "#00bfbf" }}>
                Instagram grid
              </a>
            </Typography>
          </Section>

          <Divider sx={{ borderColor: "#00feff", borderWidth: 1.5 }} />

          {/* The game is the same */}
          <Section>
            <Typography variant={isSmall ? "h5" : "h4"} fontWeight="bold" color="#333" gutterBottom>
              The game is the same as it's always been
            </Typography>
            <Typography variant="body1" color="#000" sx={{ fontSize: isSmall ? "1rem" : "1.1rem", mb: 2 }}>
              <strong>After the Bowl launches on April 20</strong>, make a
              donation right here on edsbscharitybowl.com in the name of your favorite college football
              team.
            </Typography>
            <Typography variant="body1" color="#000" sx={{ fontSize: isSmall ? "1rem" : "1.1rem" }}>
              According to tradition donation should take the form of the score of a victory by
              your morally and physically superior team over a depraved, uncharitable and weaker rival.
            </Typography>
          </Section>

          <Divider sx={{ borderColor: "#00feff", borderWidth: 1.5 }} />

          {/* New American Pathways */}
          <Section>
            <Typography variant={isSmall ? "h5" : "h4"} fontWeight="bold" color="#333" gutterBottom>
              New American Pathways
            </Typography>
            <Typography variant="body1" color="#000" sx={{ fontSize: isSmall ? "1rem" : "1.1rem", mb: 2 }}>
              <a href="https://newamericanpathways.org/about/#mission" target="_blank" style={{ color: "#00bfbf" }}>
                New American Pathways
              </a>{" "}
              is an Atlanta-based nonprofit with the mission of helping refugees and Georgia thrive.
              They provide a continuum of services that supports new Americans on their individual
              pathways from arrival through citizenship, focusing on the key milestones of
              Safety and Stability, Self-Sufficiency, Success and Service.
            </Typography>
            <Typography variant="body1" color="#000" sx={{ fontSize: isSmall ? "1rem" : "1.1rem", mb: 2 }}>
              The second Trump administration has issued over 500 executive actions impacting immigrants
              and refugees in its first year alone, suspending new arrivals indefinitely, cutting off
              access to essential services, and creating challenges and uncertainty for refugee families
              trying to build stable lives here. For example, refugees are no longer eligible for SNAP
              benefits. Many are at risk of losing medical benefits. And any refugees who have not yet
              applied for a green card, which requires overcoming multiple financial and administrative
              hurdles, are at risk of detention.
            </Typography>
            <Typography variant="body1" color="#000" sx={{ fontSize: isSmall ? "1rem" : "1.1rem" }}>
              Through these setbacks, New American Pathways has adapted to respond to the increasing
              needs of the over 10,000 refugee families in Atlanta who have arrived in the last five
              years. The 2025 Charity Bowl was a key piece in the puzzle of replacing lost federal and
              state funding and essential services. Check out their{" "}
              <a href="https://www.facebook.com/NewAmericanPathways" target="_blank" style={{ color: "#00bfbf" }}>
                Facebook
              </a>{" "}
              and{" "}
              <a href="https://www.instagram.com/newamericanpathways/" target="_blank" style={{ color: "#00bfbf" }}>
                Instagram
              </a>{" "}
              pages to learn how their work shapes communities in and around Atlanta.
            </Typography>
          </Section>

          <Divider sx={{ borderColor: "#00feff", borderWidth: 1.5 }} />

          {/* Highlights */}
          <Section>
            <Box sx={{
              display: "flex",
              flexDirection: isSmall ? "column" : "row",
              gap: "2rem",
              alignItems: isSmall ? "stretch" : "flex-start",
            }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant={isSmall ? "h5" : "h4"} fontWeight="bold" color="#333" gutterBottom>
                  Some highlights from the past year include:
                </Typography>
                <Box component="ul" sx={{ color: "#000", fontSize: isSmall ? "1rem" : "1.1rem", pl: 3, m: 0 }}>
                  <li>Nearly 3,000 new Americans received individualized case management support through New AP's social adjustment and intensive case management programs</li>
                  <li>332 children enrolled in school</li>
                  <li>261 clients placed in jobs</li>
                  <li>595 individuals assisted with green card applications</li>
                  <li>270 households supported with emergency food during periods of food insecurity and government shutdowns</li>
                  <li>114 clients in New AP's Individual Development Account program saved enough to purchase a car or house</li>
                </Box>
              </Box>
              <Box sx={{
                width: isSmall ? "100%" : 280,
                flexShrink: 0,
              }}>
                <img
                  src={import.meta.env.BASE_URL + "IMG_1107.jpg"}
                  alt="New American Pathways"
                  style={{ width: "100%", borderRadius: 8, objectFit: "cover" }}
                />
              </Box>
            </Box>
          </Section>

          <Divider sx={{ borderColor: "#00feff", borderWidth: 1.5 }} />

          {/* Where is your money going */}
          <Section>
            <Box sx={{
              display: "flex",
              flexDirection: isSmall ? "column" : "row",
              gap: "2rem",
              alignItems: isSmall ? "stretch" : "flex-start",
            }}>
              <Box sx={{
                width: isSmall ? "100%" : 280,
                flexShrink: 0,
                order: isSmall ? 1 : 0,
              }}>
                <img
                  src={import.meta.env.BASE_URL + "IMG_1109.jpg"}
                  alt="New American Pathways"
                  style={{ width: "100%", borderRadius: 8, objectFit: "cover" }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant={isSmall ? "h5" : "h4"} fontWeight="bold" color="#333" gutterBottom>
                  Where is your money going?
                </Typography>
                <Box component="ul" sx={{ color: "#000", fontSize: isSmall ? "1rem" : "1.1rem", pl: 3, m: 0 }}>
                  <li>$100 provides a food box of essentials.</li>
                  <li>$200 provides grocery support for a family of four for a week.</li>
                  <li>$250 provides drop-in case management support to one family.</li>
                  <li>$350 funds green card application services for one person.</li>
                  <li>$500 provides enrichment supplies to after-school classrooms and summer camp materials.</li>
                  <li>$1,000 can support a one-time job placement for someone looking for work, including job prep and follow up.</li>
                  <li>$2,000 can help a person receive specialized employment training to move from job to career.</li>
                </Box>
              </Box>
            </Box>
          </Section>

          <Divider sx={{ borderColor: "#00feff", borderWidth: 1.5 }} />

          {/* It begins with spite */}
          <Section>
            <Typography
              variant={isSmall ? "h5" : "h4"}
              fontWeight="bold"
              color="#333"
              sx={{ textAlign: "center", mb: 2 }}
            >
              It begins with spite and it ends with hugs (and spite)
            </Typography>
            <Typography
              variant={isSmall ? "body1" : "h6"}
              color="#000"
              sx={{ textAlign: "center", fontSize: isSmall ? "1rem" : undefined }}
            >
              <a href={import.meta.env.BASE_URL + "results2025.html"} style={{ color: "#00bfbf" }}>
                View 2025 results here
              </a>
              {" | "}
              Donate beginning April 20, 2026
            </Typography>
          </Section>

        </Container>
      </Box>
    </Box>
  );
}
