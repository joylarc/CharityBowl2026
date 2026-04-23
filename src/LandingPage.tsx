import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import IconButton from "@mui/material/IconButton";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";

const { useState, useEffect, useRef, useCallback } = React;

// Bluesky SVG icon (no MUI icon available)
function BlueskyIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 600 530" fill="currentColor">
      <path d="m135.72 44.03c66.496 49.921 138.02 151.14 164.28 205.46 26.262-54.316 97.782-155.54 164.28-205.46 47.98-36.021 125.72-63.892 125.72 24.795 0 17.712-10.155 148.79-16.111 170.07-20.703 73.984-96.144 92.854-163.25 81.433 117.3 19.964 147.14 86.092 82.697 152.22-122.39 125.59-175.91-31.511-189.63-71.766-2.514-7.3797-3.6904-10.832-3.7077-7.8964-0.0174-2.9357-1.1937 0.51669-3.7077 7.8964-13.72 40.255-67.24 197.36-189.63 71.766-64.444-66.128-34.605-132.26 82.697-152.22-67.108 11.421-142.55-7.4491-163.25-81.433-5.9562-21.282-16.111-152.36-16.111-170.07 0-88.687 77.742-60.816 125.72-24.795z" />
    </svg>
  );
}

function SocialIcons({ size = 24 }: { size?: number }) {
  return (
    <Box sx={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <a href="https://www.facebook.com/NewAmericanPathways" target="_blank" style={{ color: "white" }}>
        <FacebookIcon sx={{ fontSize: size }} />
      </a>
      <a href="https://bsky.app/profile/newap-georgia.bsky.social" target="_blank" style={{ color: "white" }}>
        <BlueskyIcon size={size - 4} />
      </a>
      <a href="https://www.instagram.com/newamericanpathways/" target="_blank" style={{ color: "white" }}>
        <InstagramIcon sx={{ fontSize: size }} />
      </a>
    </Box>
  );
}

const DONATE_LIVE_TIME = new Date("2026-04-20T10:00:00-04:00").getTime();
const DONATE_URL = "https://fundraise.givesmart.com/form/9bJ4vg?vid=1pu113";

function GreenButton({ children, href, donate }: { children: React.ReactNode; href?: string; donate?: boolean }) {
  const isLive = donate ? Date.now() >= DONATE_LIVE_TIME : true;
  const activeHref = donate ? (isLive ? DONATE_URL : undefined) : href;
  const label = donate && !isLive ? "Donate Starting April 20" : children;
  const sx = {
    backgroundColor: "#6ab648",
    color: "#fff",
    fontWeight: "bold",
    textTransform: "uppercase" as const,
    borderRadius: 0,
    "&:hover": { backgroundColor: activeHref ? "#5a9e3e" : "#6ab648" },
    opacity: activeHref ? 1 : 0.7,
  };
  if (activeHref) {
    return (
      <Button variant="contained" href={activeHref} target="_blank" sx={sx}>
        {label}
      </Button>
    );
  }
  return (
    <Button variant="contained" disabled sx={sx}>
      {label}
    </Button>
  );
}

function Section({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <Box sx={{ backgroundColor: dark ? "#333" : "#444", padding: "3rem 0" }}>
      <Container maxWidth="lg" sx={{ padding: "0 2rem" }}>
        {children}
      </Container>
    </Box>
  );
}

function GreenBar() {
  return <Box sx={{ width: 50, height: 3, backgroundColor: "#6ab648", marginBottom: "1.5rem" }} />;
}

function FloatingHearts({ size }: { size: number }) {
  const center = size / 2;
  const ringRadius = size / 2 - 10;
  const heartCount = 20;
  const hearts = useRef(
    Array.from({ length: heartCount }, (_, i) => {
      const spread = (Math.random() - 0.5) * size * 0.1;
      const duration = 2.5 + Math.random() * 2.5;
      return {
        id: i,
        x: center + spread,
        y: center - ringRadius + (Math.random() - 0.5) * 14,
        size: i % 20 === 19 ? 20 : 10 + Math.random() * 30,
        delay: -(Math.random() * duration),
        duration,
      };
    })
  ).current;

  return (
    <>
      <style>{`
        @keyframes floatUpTall {
          0% { opacity: 0; transform: translateY(0) scale(0.5); }
          15% { opacity: 1; transform: translateY(-15px) scale(1); }
          50% { opacity: 0.9; transform: translateY(-120px) scale(1.1); }
          85% { opacity: 0.5; transform: translateY(-200px) scale(0.9); }
          100% { opacity: 0; transform: translateY(-250px) scale(0.5); }
        }
        @media (prefers-reduced-motion: reduce) {
          .floating-heart { animation: none !important; opacity: 0.7 !important; }
        }
      `}</style>
      {hearts.map((h) => (
        <div
          key={h.id}
          className="floating-heart"
          style={{
            position: "absolute",
            left: h.x - h.size / 2,
            top: h.y - h.size / 2,
            fontSize: h.size,
            animation: `floatUpTall ${h.duration}s ease-in-out ${h.delay}s infinite`,
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          {h.id % 20 === 19 ? (
            <img src={import.meta.env.BASE_URL + "SpencerOveralls.jpg"} alt="" style={{ width: h.size * 2.5, height: h.size * 2.5, objectFit: "cover", clipPath: "polygon(50% 12%, 40% 0%, 25% 0%, 10% 5%, 0% 18%, 0% 35%, 0% 50%, 8% 65%, 50% 100%, 92% 65%, 100% 50%, 100% 35%, 100% 18%, 90% 5%, 75% 0%, 60% 0%)" }} />
          ) : "❤️"}
        </div>
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Spencer Burst — confetti of Spencer hearts from bell click         */
/* ------------------------------------------------------------------ */
function SpencerBurst({ originX, originY, trigger }: { originX: number; originY: number; trigger: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgsRef = useRef<HTMLImageElement[]>([]);
  const prevTrigger = useRef(0);

  if (imgsRef.current.length === 0) {
    for (const src of ["SpencerOveralls.jpg", "kicker-spencer.jpg"]) {
      const img = new Image();
      img.src = import.meta.env.BASE_URL + src;
      imgsRef.current.push(img);
    }
  }

  if (trigger > 0 && trigger !== prevTrigger.current) {
    prevTrigger.current = trigger;

    const count = 18;
    const particles = Array.from({ length: count }, () => {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.2;
      const speed = 600 + Math.random() * 500;
      return {
        x: 0, y: 0,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 24 + Math.random() * 30,
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 600,
        opacity: 1,
        drag: 0.98 + Math.random() * 0.015,
        imgIndex: Math.random() > 0.5 ? 0 : 1,
      };
    });

    const gravity = 800;
    let lastTime = 0;

    const animate = (time: number) => {
      if (!lastTime) lastTime = time;
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      let anyAlive = false;
      for (const p of particles) {
        if (p.opacity <= 0) continue;
        anyAlive = true;
        p.vy += gravity * dt;
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rotation += p.rotationSpeed * dt;
        if (p.y > 100) p.opacity -= dt * 0.8;
      }

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const imgs = imgsRef.current;
          if (imgs.length > 0 && imgs[0].complete) {
            for (const p of particles) {
              if (p.opacity <= 0) continue;
              const img = imgs[p.imgIndex] && imgs[p.imgIndex].complete ? imgs[p.imgIndex] : imgs[0];
              ctx.save();
              ctx.globalAlpha = Math.max(0, p.opacity);
              ctx.translate(originX + p.x, originY + p.y);
              ctx.rotate((p.rotation * Math.PI) / 180);
              const s = p.size;
              ctx.beginPath();
              ctx.moveTo(0, -s * 0.35);
              ctx.bezierCurveTo(-s * 0.5, -s * 0.8, -s, -s * 0.2, 0, s * 0.45);
              ctx.moveTo(0, -s * 0.35);
              ctx.bezierCurveTo(s * 0.5, -s * 0.8, s, -s * 0.2, 0, s * 0.45);
              ctx.closePath();
              ctx.clip();
              ctx.drawImage(img, -s, -s, s * 2, s * 2);
              ctx.restore();
            }
          }
        }
      }

      if (anyAlive) {
        requestAnimationFrame(animate);
      } else if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    };

    requestAnimationFrame(animate);
  }

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 9999 }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Audio clips                                                        */
/* ------------------------------------------------------------------ */
const SOUND_FILES = [
  "Bell.mp3",
  "Welcome.mp3",
  "Just take those old records off the shelf.mp3",
  "Bell 2.mp3",
  "a cappella.mp3",
  "Never done that before.mp3",
  "oh no disaster.mp3",
];

function playSound(index: number) {
  const audio = new Audio(import.meta.env.BASE_URL + SOUND_FILES[index]);
  audio.play();
}

const BELL_THRESHOLD = 1_370_251;

export default function LandingPage() {
  const isSmall = useMediaQuery("(max-width:600px)");
  const [totalRaised, setTotalRaised] = useState(0);
  const [totalDonors, setTotalDonors] = useState(0);
  const goal = 1_000_000;
  const [burstTrigger, setBurstTrigger] = useState(0);
  const [burstOrigin, setBurstOrigin] = useState({ x: 0, y: 0 });
  const [soundIndex, setSoundIndex] = useState(0);
  const handleRing = useCallback((e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setBurstOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    playSound(soundIndex);
    setSoundIndex((i) => (i + 1) % SOUND_FILES.length);
    setBurstTrigger((t) => t + 1);
  }, [soundIndex]);

  useEffect(() => {
    // Auto-reload when donate buttons should go live
    const timeUntilLive = DONATE_LIVE_TIME - Date.now();
    if (timeUntilLive > 0) {
      const timer = setTimeout(() => window.location.reload(), timeUntilLive);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + "donations.csv")
      .then((res) => res.text())
      .then((text) => {
        const lines = text.split("\n");
        lines.shift(); // skip timestamp
        let total = 0;
        for (const line of lines) {
          const parts = line.split(",");
          if (parts.length !== 2) continue;
          const amount = parseFloat(parts[1].replace(/"/g, "").trim());
          if (!isNaN(amount) && amount > 0) {
            total += amount;
          }
        }
        setTotalRaised(total);
      });
    fetch(import.meta.env.BASE_URL + "stats.json")
      .then((res) => res.json())
      .then((data) => {
        setTotalDonors(data.unique_donors || 0);
      })
      .catch(() => {});
  }, []);

  return (
    <Box>
      {/* Nav bar */}
      <Box
        sx={{
          backgroundColor: "#326295",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.5rem 1.5rem",
        }}
      >
        <img
          src={import.meta.env.BASE_URL + "nap-logo-white.png"}
          alt="New American Pathways"
          style={{ height: 40, objectFit: "contain" }}
        />
        <Box sx={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <SocialIcons size={20} />
          <GreenButton donate>Donate</GreenButton>
        </Box>
      </Box>

      {/* Hero banner */}
      <Box
        sx={{
          position: "relative",
          height: isSmall ? "50vh" : "70vh",
          backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url(${import.meta.env.BASE_URL}IMG_1107.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <Typography
          variant="body1"
          sx={{ color: "#fff", fontWeight: "bold", letterSpacing: 2, textTransform: "uppercase", marginBottom: "1rem" }}
        >
          Prove yourself against your rivals. For good.
        </Typography>
        <Typography variant={isSmall ? "h4" : "h2"} sx={{ color: "white", fontWeight: "bold" }}>
          EDSBS Charity Bowl
        </Typography>
        <Typography variant={isSmall ? "h4" : "h2"} sx={{ color: "white", fontWeight: "bold" }}>
          April 20-24, 2026
        </Typography>
      </Box>

      {/* Section 2: Benefiting New American Pathways */}
      <Section dark>
        <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
          Benefiting <a href="https://newamericanpathways.org/" target="_blank" style={{ color: "inherit", textDecoration: "underline" }}>New American Pathways</a>
        </Typography>
        <GreenBar />
        <Typography variant="body1" sx={{ marginBottom: "1rem", fontWeight: "bold" }}>
          Give to New American Pathways in the name of your favorite college football team to win the 2026 EDSBS Charity Bowl — and bragging
          rights as the most generous fanbase in the country.
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: "1.5rem" }}>
          In honor of the 20th edition of the #CharitibundiBowl, we're returning the contest to its college football roots with a{" "}
          <strong>pre-set field of teams</strong>. This field will consist of all 138 schools scheduled to field FBS programs in 2026,
          a handful of mid-major schools with longstanding community ties to the Charity Bowl, and a few legacy programs that
          are, strictly speaking, imaginary. You can view the full list of eligible teams for 2026{" "}
          <a href="https://www.moneycannon.org/teams.html" target="_blank" style={{ color: "#6ab648" }}>
            here
          </a>
          .
        </Typography>
        <GreenButton donate>Donate</GreenButton>
      </Section>

      {/* Section 3: Where is the Leaderboard */}
      <Section>
        <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "0.25rem" }}>
          Where am I? What is this?
        </Typography>
        <GreenBar />
        <Typography variant="body1">
          Learn about the history of the Charity Bowl, as well as how to play, at our handy FAQ{" "}
          <a href={import.meta.env.BASE_URL + "faq.html"} style={{ color: "#6ab648" }}>
            here
          </a>
          .
        </Typography>
      </Section>

      {/* Section 4: What is the Charity Bowl */}
      <Section dark>
        <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "0.25rem" }}>
          What's the score?
        </Typography>
        <GreenBar />
        <Typography variant="body1">
          See how your team stacks up against its conference and non-conference rivals AND create custom rivalry leaderboards{" "}
          <a href="https://www.moneycannon.org" style={{ color: "#6ab648" }}>
            here
          </a>
          .
        </Typography>
      </Section>

      {/* Section 5: A Crippling Blow to Refugee Resettlement */}
      <Section>
        <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "1.5rem" }}>
          Refugees Under Siege
        </Typography>
        <Typography variant="body1" component="blockquote" sx={{ marginBottom: "1.5rem", fontStyle: "italic", borderLeft: "3px solid #6ab648", paddingLeft: "1.5rem", marginLeft: 0 }}>
          Fiscal year 2025 was a year full of change and challenges for New American Pathways and the clients we serve. Over the course of the year, there were more than 500 executive actions issued from the current administration that negatively impacted refugee and immigrant communities. Many of those fundamentally changed the work we do, resulting in us pivoting multiple times to ensure we were responding to current needs.
        </Typography>
        <a href={import.meta.env.BASE_URL + "2025impactreport.pdf"} target="_blank" style={{ color: "#6ab648", fontWeight: "bold", fontSize: "1rem" }}>
          Learn more
        </a>
      </Section>

      {/* Section 6+7: It begins with spite + progress circle */}
      <Box
        sx={{
          backgroundColor: "#555",
          padding: "3rem 0",
          textAlign: "center",
        }}
      >
        <Container maxWidth="lg" sx={{ padding: "0 2rem" }}>
          <Box sx={{ marginBottom: "2rem" }}>
            <GreenButton donate>Donate</GreenButton>
          </Box>
          <Typography variant={isSmall ? "h5" : "h4"} sx={{ fontWeight: "bold", fontSize: isSmall ? "1.875rem" : "2.625rem", marginBottom: "1.5rem" }}>
            It begins with spite and ends with hugs (and spite).
          </Typography>

          {/* Progress circle */}
          {(() => {
            const size = isSmall ? 320 : 450;
            const strokeWidth = 14;
            const overStrokeWidth = 20;
            const radius = (size - overStrokeWidth) / 2;
            const circumference = 2 * Math.PI * radius;
            const rawProgress = totalRaised / goal;
            const firstLap = Math.min(rawProgress, 1);
            const secondLap = rawProgress > 1 ? Math.min((rawProgress - 1) * 2, 1) : 0;
            const firstOffset = circumference * (1 - firstLap);
            const secondOffset = circumference * (1 - secondLap);
            const overGoal = rawProgress > 1;
            const showHearts = overGoal && totalRaised <= goal + 20000;
            return (
              <Box sx={{ position: "relative", width: size, height: size, margin: "2rem auto" }}>
                {showHearts && <FloatingHearts size={size} />}
                {overGoal && (
                  <style>{`
                    @keyframes pulseGlow {
                      0%, 100% { opacity: 0.35; }
                      50% { opacity: 1; }
                    }
                    @media (prefers-reduced-motion: reduce) {
                      * { animation: none !important; }
                    }
                  `}</style>
                )}
                <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
                  {overGoal && (
                    <defs>
                      <filter id="over-glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="5" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                  )}
                  {/* Background track */}
                  <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#666" strokeWidth={strokeWidth} />
                  {/* First lap: green */}
                  <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#6ab648" strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={firstOffset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease" }} />
                  {/* Second lap: gold, thicker, with pulsing glow */}
                  {overGoal && (
                    <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f0c040" strokeWidth={overStrokeWidth} strokeDasharray={circumference} strokeDashoffset={secondOffset} strokeLinecap="round" filter="url(#over-glow)" style={{ transition: "stroke-dashoffset 1s ease", animation: "pulseGlow 2s ease-in-out infinite" }} />
                  )}
                </svg>
                <Box sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: isSmall ? "0.25rem" : "0.5rem" }}>
                  <Typography variant="caption" sx={{ textTransform: "uppercase", letterSpacing: 2, color: "#aaa" }}>
                    Raised so far
                  </Typography>
                  <Typography variant={isSmall ? "h3" : "h2"} sx={{ fontWeight: "bold" }}>
                    ${Math.round(totalRaised).toLocaleString()}
                  </Typography>
                  {overGoal && (
                    <Typography variant="caption" sx={{ color: "#f0c040", fontWeight: "bold" }}>
                      New Goal: $1,500,000
                    </Typography>
                  )}
                  <Box sx={{ width: "60%", borderTop: "1px solid #666", marginTop: isSmall ? "0.25rem" : "0.5rem", paddingTop: isSmall ? "0.4rem" : "0.75rem", display: "flex", justifyContent: "center", gap: isSmall ? "1.5rem" : "3rem" }}>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography variant="caption" sx={{ textTransform: "uppercase", letterSpacing: 1, color: "#6ab648", fontSize: "0.65rem" }}>
                        Our Goal
                      </Typography>
                      <Typography variant={isSmall ? "body2" : "h6"} sx={{ fontWeight: "bold" }}>
                        ${goal.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography variant="caption" sx={{ textTransform: "uppercase", letterSpacing: 1, color: "#6ab648", fontSize: "0.65rem", whiteSpace: "nowrap" }}>
                        Total Donors
                      </Typography>
                      <Typography variant={isSmall ? "body2" : "h6"} sx={{ fontWeight: "bold" }}>
                        {totalDonors}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            );
          })()}
        </Container>
        {totalRaised >= BELL_THRESHOLD && (
          <Box sx={{ textAlign: "center", mt: 2, mb: 1 }}>
            <IconButton
              onClick={handleRing}
              sx={{
                fontSize: "3.5rem",
                transition: "transform 0.15s",
                "&:hover": { transform: "scale(1.15)" },
                "&:active": { transform: "scale(0.85)" },
              }}
            >
              🔔
            </IconButton>
            <Typography variant="caption" sx={{ display: "block", color: "#aaa" }}>
              Ring the bell to celebrate!
            </Typography>
          </Box>
        )}
      </Box>

      <SpencerBurst originX={burstOrigin.x} originY={burstOrigin.y} trigger={burstTrigger} />

      {/* Text to donate */}
      <Box sx={{ backgroundColor: "#555", textAlign: "center", padding: "2rem 0", borderTop: "3px solid #666" }}>
        <Typography variant="h5">
          Text <span style={{ color: "#6ab648", fontWeight: "bold" }}>charitybowl26</span> to{" "}
          <span style={{ fontWeight: "bold" }}>91999</span>
        </Typography>
        <Typography variant="caption" sx={{ color: "#aaa" }}>
          Msg & data rates may apply.
        </Typography>
      </Box>

      {/* Footer */}
      <Box sx={{ backgroundColor: "#333", padding: "2rem 1.5rem" }}>
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", flexDirection: isSmall ? "column" : "row", alignItems: "center", gap: "1.5rem" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
              <img
                src={import.meta.env.BASE_URL + "nap-logo-white.png"}
                alt="New American Pathways"
                style={{ height: 60, objectFit: "contain" }}
              />
              <a href="https://newamericanpathways.org/" target="_blank" style={{ color: "white", textDecoration: "none" }}>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  Get to Know Us
                </Typography>
              </a>
            </Box>
            <Box sx={{ marginLeft: isSmall ? 0 : "auto" }}>
              <SocialIcons size={18} />
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
