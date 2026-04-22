import { useState, useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import useMediaQuery from "@mui/material/useMediaQuery";

/* ------------------------------------------------------------------ */
/*  Option A — Floating Hearts                                        */
/* ------------------------------------------------------------------ */
function FloatingHearts({ size, fromTop }: { size: number; fromTop?: boolean }) {
  const center = size / 2;
  const ringRadius = size / 2 - 10;
  const heartCount = fromTop ? 8 : 12;
  const animName = fromTop ? "floatUpTall" : "floatUp";

  // Generate hearts — either all around the ring or clustered at the top
  const hearts = useRef(
    Array.from({ length: heartCount }, (_, i) => {
      let x: number, y: number;
      if (fromTop) {
        // Cluster near the top of the ring (where circle closes) with slight horizontal spread
        const spread = (Math.random() - 0.5) * 40;
        x = center + spread;
        y = center - ringRadius + (Math.random() - 0.5) * 10;
      } else {
        const angle = (Math.PI * 2 * i) / heartCount + (Math.random() - 0.5) * 0.5;
        x = center + Math.cos(angle) * ringRadius;
        y = center + Math.sin(angle) * ringRadius;
      }
      return {
        id: i,
        x,
        y,
        size: 14 + Math.random() * 14,
        delay: Math.random() * 3,
        duration: 2.5 + Math.random() * 2,
      };
    })
  ).current;

  return (
    <>
      <style>{`
        @keyframes floatUp {
          0% { opacity: 0; transform: translateY(0) scale(0.5); }
          15% { opacity: 1; transform: translateY(-10px) scale(1); }
          85% { opacity: 0.8; transform: translateY(-60px) scale(1.1); }
          100% { opacity: 0; transform: translateY(-90px) scale(0.6); }
        }
        @keyframes floatUpTall {
          0% { opacity: 0; transform: translateY(0) scale(0.5) translateX(0); }
          15% { opacity: 1; transform: translateY(-15px) scale(1) translateX(0); }
          50% { opacity: 0.9; transform: translateY(-80px) scale(1.1) translateX(${Math.random() > 0.5 ? '' : '-'}8px); }
          85% { opacity: 0.5; transform: translateY(-130px) scale(0.9) translateX(${Math.random() > 0.5 ? '-' : ''}5px); }
          100% { opacity: 0; transform: translateY(-160px) scale(0.5) translateX(0); }
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
            left: h.x,
            top: h.y,
            fontSize: h.size,
            animation: `${animName} ${h.duration}s ease-in-out ${h.delay}s infinite`,
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          ❤️
        </div>
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Option C — Orbiting Hearts                                        */
/* ------------------------------------------------------------------ */
function OrbitingHearts({ size }: { size: number }) {
  const heartCount = 8;
  const orbitRadius = size / 2 + 5;
  const center = size / 2;

  return (
    <>
      <style>{`
        @keyframes orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes counterRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .orbit-container, .orbit-heart { animation: none !important; }
        }
      `}</style>
      <div
        className="orbit-container"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: size,
          height: size,
          animation: "orbit 12s linear infinite",
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        {Array.from({ length: heartCount }, (_, i) => {
          const angle = (Math.PI * 2 * i) / heartCount;
          const heartSize = 12 + (i % 3) * 4;
          return (
            <div
              key={i}
              className="orbit-heart"
              style={{
                position: "absolute",
                left: center + Math.cos(angle) * orbitRadius - heartSize / 2,
                top: center + Math.sin(angle) * orbitRadius - heartSize / 2,
                fontSize: heartSize,
                animation: "counterRotate 12s linear infinite",
              }}
            >
              ❤️
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Progress Circle                                                    */
/* ------------------------------------------------------------------ */
function ProgressCircle({
  totalRaised,
  goal,
  totalDonors,
  label,
  isSmall,
  heartsMode,
}: {
  totalRaised: number;
  goal: number;
  totalDonors: number;
  label: string;
  isSmall: boolean;
  heartsMode: "floating" | "floating-top" | "orbiting";
}) {
  const size = isSmall ? 280 : 400;
  const strokeWidth = 14;
  const overStrokeWidth = 20;
  const radius = (size - overStrokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const rawProgress = totalRaised / goal;
  const firstLap = Math.min(rawProgress, 1);
  const secondLap = rawProgress > 1 ? Math.min(rawProgress - 1, 1) : 0;
  const firstOffset = circumference * (1 - firstLap);
  const secondOffset = circumference * (1 - secondLap);
  const overGoal = rawProgress > 1;
  const showHearts = overGoal && totalRaised <= goal + 2000;

  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ mb: 2, color: "#aaa" }}>
        {label}
      </Typography>
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
        {showHearts && heartsMode === "floating" && <FloatingHearts size={size} />}
        {showHearts && heartsMode === "floating-top" && <FloatingHearts size={size} fromTop />}
        {showHearts && heartsMode === "orbiting" && <OrbitingHearts size={size} />}
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          {overGoal && (
            <defs>
              <filter id={`over-glow-${heartsMode}`} x="-50%" y="-50%" width="200%" height="200%">
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
            <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f0c040" strokeWidth={overStrokeWidth} strokeDasharray={circumference} strokeDashoffset={secondOffset} strokeLinecap="round" filter={`url(#over-glow-${heartsMode})`} style={{ transition: "stroke-dashoffset 1s ease", animation: "pulseGlow 2s ease-in-out infinite" }} />
          )}
        </svg>
        <Box sx={{
          position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
          display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: isSmall ? "0.25rem" : "0.5rem",
        }}>
          <Typography variant="caption" sx={{ textTransform: "uppercase", letterSpacing: 2, color: "#aaa" }}>
            Raised so far
          </Typography>
          <Typography variant={isSmall ? "h4" : "h3"} sx={{ fontWeight: "bold" }}>
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
                {totalDonors}
              </Typography>
            </Box>
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
  const isSmall = useMediaQuery("(max-width:900px)");
  const goal = 1_000_000;
  const [raised, setRaised] = useState(1_001_000);

  return (
    <Box sx={{ minHeight: "100vh", py: 4, px: 2 }}>
      <Typography variant="h4" sx={{ textAlign: "center", mb: 1, fontWeight: "bold" }}>
        Hearts Celebration Prototype
      </Typography>
      <Typography variant="body2" sx={{ textAlign: "center", mb: 4, color: "#aaa" }}>
        Hearts show when $1M {"<"} total {"≤"} $1,002,000 — drag the slider to test
      </Typography>

      <Box sx={{ maxWidth: 500, mx: "auto", mb: 6, px: 2 }}>
        <Typography variant="body2" sx={{ color: "#aaa", mb: 1 }}>
          Simulated total: <strong style={{ color: "#fff" }}>${raised.toLocaleString()}</strong>
          {raised > goal && raised <= goal + 2000 && (
            <span style={{ color: "#e74c6f", marginLeft: 8 }}>❤️ hearts active</span>
          )}
          {raised > goal + 2000 && (
            <span style={{ color: "#888", marginLeft: 8 }}>(hearts off — past $1,002,000)</span>
          )}
        </Typography>
        <Slider
          value={raised}
          onChange={(_, v) => setRaised(v as number)}
          min={990_000}
          max={1_010_000}
          step={100}
          sx={{
            color: raised > goal ? "#f0c040" : "#6ab648",
            "& .MuiSlider-thumb": { width: 20, height: 20 },
          }}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", color: "#888", fontSize: "0.75rem" }}>
          <span>$990K</span>
          <span>$1M (goal)</span>
          <span>$1.01M</span>
        </Box>
      </Box>

      <Box sx={{
        display: "flex",
        flexDirection: isSmall ? "column" : "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 6,
      }}>
        <ProgressCircle
          totalRaised={raised}
          goal={goal}
          totalDonors={1842}
          label="A1: Floating (all around)"
          isSmall={isSmall}
          heartsMode="floating"
        />
        <ProgressCircle
          totalRaised={raised}
          goal={goal}
          totalDonors={1842}
          label="A2: Floating (from top)"
          isSmall={isSmall}
          heartsMode="floating-top"
        />
        <ProgressCircle
          totalRaised={raised}
          goal={goal}
          totalDonors={1842}
          label="C: Orbiting Hearts"
          isSmall={isSmall}
          heartsMode="orbiting"
        />
      </Box>
    </Box>
  );
}
