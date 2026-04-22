import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import useMediaQuery from "@mui/material/useMediaQuery";

function ProgressCircle({
  totalRaised,
  goal,
  totalDonors,
  label,
  isSmall,
}: {
  totalRaised: number;
  goal: number;
  totalDonors: number;
  label: string;
  isSmall: boolean;
}) {
  const size = isSmall ? 280 : 400;
  const strokeWidth = 14;
  const overStrokeWidth = 20;
  // Use the larger stroke width for radius so the thicker second-lap ring fits
  const radius = (size - overStrokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const rawProgress = totalRaised / goal;
  const firstLap = Math.min(rawProgress, 1);
  const secondLap = rawProgress > 1 ? Math.min(rawProgress - 1, 1) : 0;
  const firstOffset = circumference * (1 - firstLap);
  const secondOffset = circumference * (1 - secondLap);
  const overGoal = rawProgress > 1;
  const pct = Math.round(rawProgress * 100);

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
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="#666" strokeWidth={strokeWidth}
          />
          {/* First lap: green */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="#6ab648" strokeWidth={strokeWidth}
            strokeDasharray={circumference} strokeDashoffset={firstOffset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
          {/* Second lap: gold, thicker, with pulsing glow */}
          {overGoal && (
            <circle
              cx={size / 2} cy={size / 2} r={radius}
              fill="none" stroke="#f0c040" strokeWidth={overStrokeWidth}
              strokeDasharray={circumference} strokeDashoffset={secondOffset}
              strokeLinecap="round"
              filter="url(#over-glow)"
              style={{
                transition: "stroke-dashoffset 1s ease",
                animation: "pulseGlow 2s ease-in-out infinite",
              }}
            />
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
              {pct}% of goal!
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

export default function TestProgressPage() {
  const isSmall = useMediaQuery("(max-width:600px)");
  const goal = 1_000_000;
  const [raised, setRaised] = useState(950_000);

  return (
    <Box sx={{ minHeight: "100vh", py: 4, px: 2 }}>
      <Typography variant="h4" sx={{ textAlign: "center", mb: 1, fontWeight: "bold" }}>
        Progress Circle Prototype
      </Typography>
      <Typography variant="body2" sx={{ textAlign: "center", mb: 4, color: "#aaa" }}>
        Drag the slider to simulate different donation totals
      </Typography>

      {/* Slider */}
      <Box sx={{ maxWidth: 500, mx: "auto", mb: 6, px: 2 }}>
        <Typography variant="body2" sx={{ color: "#aaa", mb: 1 }}>
          Simulated total: <strong style={{ color: "#fff" }}>${raised.toLocaleString()}</strong>
          {raised > goal && (
            <span style={{ color: "#f0c040", marginLeft: 8 }}>
              ({Math.round((raised / goal) * 100)}% of goal)
            </span>
          )}
        </Typography>
        <Slider
          value={raised}
          onChange={(_, v) => setRaised(v as number)}
          min={0}
          max={2_000_000}
          step={10_000}
          sx={{
            color: raised > goal ? "#f0c040" : "#6ab648",
            "& .MuiSlider-thumb": { width: 20, height: 20 },
          }}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", color: "#888", fontSize: "0.75rem" }}>
          <span>$0</span>
          <span>$1M (goal)</span>
          <span>$2M</span>
        </Box>
      </Box>

      {/* Circle */}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <ProgressCircle
          totalRaised={raised}
          goal={goal}
          totalDonors={1842}
          label="Gold second lap + pulsing glow"
          isSmall={isSmall}
        />
      </Box>
    </Box>
  );
}
