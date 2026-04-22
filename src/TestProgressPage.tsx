import { useState, useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import useMediaQuery from "@mui/material/useMediaQuery";

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
  const secondLap = rawProgress > 1 ? Math.min(rawProgress - 1, 1) : 0;
  const firstOffset = circumference * (1 - firstLap);
  const secondOffset = circumference * (1 - secondLap);
  const overGoal = rawProgress > 1;
  const showHearts = overGoal && totalRaised <= goal + 5000;

  return (
    <Box sx={{ position: "relative", width: size, height: size, margin: "0 auto" }}>
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

export default function TestProgressPage() {
  const isSmall = useMediaQuery("(max-width:600px)");
  const goal = 1_000_000;
  const [raised, setRaised] = useState(995_000);

  return (
    <Box sx={{ minHeight: "100vh", py: 4, px: 2 }}>
      <Typography variant="h4" sx={{ textAlign: "center", mb: 1, fontWeight: "bold" }}>
        Progress Circle Preview
      </Typography>
      <Typography variant="body2" sx={{ textAlign: "center", mb: 4, color: "#aaa" }}>
        Drag the slider to simulate donation total
      </Typography>

      <Box sx={{ maxWidth: 500, mx: "auto", mb: 6, px: 2 }}>
        <Typography variant="body2" sx={{ color: "#aaa", mb: 1 }}>
          Simulated total: <strong style={{ color: "#fff" }}>${raised.toLocaleString()}</strong>
        </Typography>
        <Slider
          value={raised}
          onChange={(_, v) => setRaised(v as number)}
          min={900_000}
          max={1_100_000}
          step={500}
          sx={{
            color: raised > goal ? "#f0c040" : "#6ab648",
            "& .MuiSlider-thumb": { width: 20, height: 20 },
          }}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", color: "#888", fontSize: "0.75rem" }}>
          <span>$900K</span>
          <span>$1M (goal)</span>
          <span>$1.1M</span>
        </Box>
      </Box>

      <ProgressCircle totalRaised={raised} goal={goal} isSmall={isSmall} />
    </Box>
  );
}
