import { useState, useRef, useCallback } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import useMediaQuery from "@mui/material/useMediaQuery";
import IconButton from "@mui/material/IconButton";

/* ------------------------------------------------------------------ */
/*  Spencer Burst — one-time confetti of Spencer hearts from a point   */
/* ------------------------------------------------------------------ */
function SpencerBurst({ originX, originY, trigger }: { originX: number; originY: number; trigger: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgsRef = useRef<HTMLImageElement[]>([]);
  const prevTrigger = useRef(0);

  // Preload both Spencer images
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
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.2; // mostly upward, spread ~70deg
      const speed = 600 + Math.random() * 500;
      return {
        x: 0,
        y: 0,
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
    let animId = 0;

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

        // Fade out once falling past origin
        if (p.y > 100) {
          p.opacity -= dt * 0.8;
        }
      }

      // Render to canvas
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

              // Draw heart-shaped clip
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
        animId = requestAnimationFrame(animate);
      } else if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    };

    // Cancel any previous animation
    cancelAnimationFrame(animId);
    requestAnimationFrame(animate);
  }

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Audio clips — cycle through on each bell click                     */
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

const SOUND_NAMES = [
  "🔔 Bell",
  "🎙️ Welcome",
  "🎵 Old Records Off the Shelf",
  "🔔 Bell 2",
  "🎤 A Cappella",
  "😮 Never Done That Before",
  "💥 Oh No Disaster",
];

function playSound(index: number) {
  const audio = new Audio(import.meta.env.BASE_URL + SOUND_FILES[index]);
  audio.play();
}

/* ------------------------------------------------------------------ */
/*  Progress Circle (simplified — no auto-hearts for this prototype)   */
/* ------------------------------------------------------------------ */
function ProgressCircle({
  totalRaised,
  goal,
  isSmall,
}: {
  totalRaised: number;
  goal: number;
  isSmall: boolean;
}) {
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

  return (
    <Box sx={{ position: "relative", width: size, height: size, margin: "0 auto" }}>
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
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#666" strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#6ab648" strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={firstOffset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease" }} />
        {overGoal && (
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f0c040" strokeWidth={overStrokeWidth} strokeDasharray={circumference} strokeDashoffset={secondOffset} strokeLinecap="round" filter="url(#over-glow)" style={{ transition: "stroke-dashoffset 1s ease", animation: "pulseGlow 2s ease-in-out infinite" }} />
        )}
      </svg>
      <Box sx={{
        position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
        display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: isSmall ? "0.25rem" : "0.5rem",
      }}>
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
        <Box sx={{
          width: "60%", borderTop: "1px solid #666", marginTop: isSmall ? "0.25rem" : "0.5rem", paddingTop: isSmall ? "0.4rem" : "0.75rem",
          display: "flex", justifyContent: "center", gap: isSmall ? "1.5rem" : "3rem",
        }}>
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
              1,842
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/*  Test Page                                                          */
/* ------------------------------------------------------------------ */
export default function TestProgressPage() {
  const isSmall = useMediaQuery("(max-width:600px)");
  const goal = 1_000_000;
  const [raised, setRaised] = useState(1_050_000);
  const [burstTrigger, setBurstTrigger] = useState(0);
  const [burstOrigin, setBurstOrigin] = useState({ x: 0, y: 0 });
  const [soundIndex, setSoundIndex] = useState(0);
  const [lastSound, setLastSound] = useState("");

  const handleRing = useCallback((e: React.MouseEvent) => {
    // Get bell position for burst origin
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setBurstOrigin({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });

    // Play the current sound
    playSound(soundIndex);
    setLastSound(SOUND_NAMES[soundIndex]);
    setSoundIndex((i) => (i + 1) % SOUND_FILES.length);

    // Trigger burst
    setBurstTrigger((t) => t + 1);
  }, [soundIndex]);

  return (
    <Box sx={{ minHeight: "100vh", py: 4, px: 2 }}>
      <Typography variant="h4" sx={{ textAlign: "center", mb: 1, fontWeight: "bold" }}>
        🔔 Ring the Bell Prototype
      </Typography>

      <Box sx={{ maxWidth: 500, mx: "auto", mb: 4, px: 2 }}>
        <Typography variant="body2" sx={{ color: "#aaa", mb: 1 }}>
          Simulated total: <strong style={{ color: "#fff" }}>${raised.toLocaleString()}</strong>
        </Typography>
        <Slider
          value={raised}
          onChange={(_, v) => setRaised(v as number)}
          min={900_000}
          max={1_500_000}
          step={500}
          sx={{
            color: raised > goal ? "#f0c040" : "#6ab648",
            "& .MuiSlider-thumb": { width: 20, height: 20 },
          }}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", color: "#888", fontSize: "0.75rem" }}>
          <span>$900K</span>
          <span>$1M</span>
          <span>$1.5M</span>
        </Box>
      </Box>

      <ProgressCircle totalRaised={raised} goal={goal} isSmall={isSmall} />

      <Box sx={{ textAlign: "center", mt: 3 }}>
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
        <Typography variant="caption" sx={{ display: "block", color: "#aaa", mt: 0.5 }}>
          Ring the bell to celebrate!
        </Typography>
        {lastSound && (
          <Typography variant="caption" sx={{ display: "block", color: "#f0c040", mt: 0.5 }}>
            Now playing: {lastSound}
          </Typography>
        )}
      </Box>

      <SpencerBurst originX={burstOrigin.x} originY={burstOrigin.y} trigger={burstTrigger} />
    </Box>
  );
}
