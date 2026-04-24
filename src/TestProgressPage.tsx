import { useState, useRef, useCallback, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";

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
/*  Cascading Spencers — solitaire win animation                       */
/* ------------------------------------------------------------------ */
function CascadingSpencers({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const animRef = useRef<number>(0);
  const cardsRef = useRef<Array<{
    x: number; y: number; vx: number; vy: number;
    width: number; height: number; rotation: number; rotationSpeed: number;
    settled: boolean;
  }>>([]);
  const trailRef = useRef<Array<{ x: number; y: number; rotation: number; opacity: number; width: number; height: number }>>([]);
  const spawnTimer = useRef(0);
  const spawnIndex = useRef(0);

  if (!imgRef.current) {
    const img = new Image();
    img.src = import.meta.env.BASE_URL + "spenceroveralls.0.jpg";
    imgRef.current = img;
  }

  // Spawn points across the top
  const spawnPoints = useRef(
    Array.from({ length: 6 }, (_, i) => ({
      x: (i + 0.5) * (window.innerWidth / 6),
      y: -20,
    }))
  ).current;

  if (active && animRef.current === 0) {
    cardsRef.current = [];
    trailRef.current = [];
    spawnTimer.current = 0;
    spawnIndex.current = 0;

    let lastTime = 0;
    const gravity = 500;
    const bounceDamping = 0.75;
    const trailInterval = 3; // frames between trail snapshots
    let frameCount = 0;

    const animate = (time: number) => {
      if (!lastTime) lastTime = time;
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Spawn new cards periodically
      spawnTimer.current += dt;
      if (spawnTimer.current > 0.4 && cardsRef.current.length < 40) {
        spawnTimer.current = 0;
        const sp = spawnPoints[spawnIndex.current % spawnPoints.length];
        spawnIndex.current++;
        const cardW = 50 + Math.random() * 20;
        const cardH = cardW * 1.4;
        cardsRef.current.push({
          x: sp.x,
          y: sp.y,
          vx: (Math.random() - 0.5) * 200,
          vy: 50 + Math.random() * 100,
          width: cardW,
          height: cardH,
          rotation: 0,
          rotationSpeed: (Math.random() - 0.5) * 200,
          settled: false,
        });
      }

      // Update physics
      for (const card of cardsRef.current) {
        if (card.settled) continue;

        card.vy += gravity * dt;
        card.x += card.vx * dt;
        card.y += card.vy * dt;
        card.rotation += card.rotationSpeed * dt;

        // Bounce off bottom
        if (card.y + card.height / 2 > canvas.height) {
          card.y = canvas.height - card.height / 2;
          card.vy = -Math.abs(card.vy) * bounceDamping;
          card.vx += (Math.random() - 0.5) * 100;

          // Settle if bounce is tiny
          if (Math.abs(card.vy) < 20 && Math.abs(card.vx) < 10) {
            card.settled = true;
            card.vy = 0;
            card.vx = 0;
            card.rotationSpeed = 0;
          }
        }

        // Bounce off sides
        if (card.x < 0) { card.x = 0; card.vx = Math.abs(card.vx) * 0.8; }
        if (card.x > canvas.width) { card.x = canvas.width; card.vx = -Math.abs(card.vx) * 0.8; }
      }

      // Add trail snapshots
      frameCount++;
      if (frameCount % trailInterval === 0) {
        for (const card of cardsRef.current) {
          if (!card.settled && card.y > 0 && card.y < canvas.height + 50) {
            trailRef.current.push({
              x: card.x, y: card.y,
              rotation: card.rotation,
              opacity: 0.85,
              width: card.width, height: card.height,
            });
          }
        }
      }

      // Trails persist permanently — no fading

      // Draw
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const img = imgRef.current;
      if (!img || !img.complete) { animRef.current = requestAnimationFrame(animate); return; }

      // Draw trails
      for (const t of trailRef.current) {
        if (t.opacity <= 0) continue;
        ctx.save();
        ctx.globalAlpha = t.opacity;
        ctx.translate(t.x, t.y);
        ctx.rotate((t.rotation * Math.PI) / 180);
        ctx.drawImage(img, -t.width / 2, -t.height / 2, t.width, t.height);
        ctx.restore();
      }

      // Draw active cards
      for (const card of cardsRef.current) {
        ctx.save();
        ctx.globalAlpha = 1;
        ctx.translate(card.x, card.y);
        ctx.rotate((card.rotation * Math.PI) / 180);
        // Card border
        ctx.fillStyle = "white";
        ctx.fillRect(-card.width / 2 - 2, -card.height / 2 - 2, card.width + 4, card.height + 4);
        ctx.drawImage(img, -card.width / 2, -card.height / 2, card.width, card.height);
        ctx.restore();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
  }

  if (!active && animRef.current) {
    cancelAnimationFrame(animRef.current);
    animRef.current = 0;
    cardsRef.current = [];
    trailRef.current = [];
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 9998 }}
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
/*  Option A: Spencer head IS the bell                                 */
/* ------------------------------------------------------------------ */
function SpencerBellA({ onClick, ringing }: { onClick: (e: React.MouseEvent) => void; ringing: number }) {
  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="caption" sx={{ display: "block", color: "#aaa", mb: 1 }}>
        Option A: Spencer IS the bell
      </Typography>
      <Box
        onClick={onClick}
        sx={{
          display: "inline-block",
          cursor: "pointer",
          transition: "transform 0.15s",
          "&:hover": { transform: "scale(1.1)" },
        }}
      >
        <style>{`
          @keyframes rockBell {
            0% { transform: rotate(0deg); }
            10% { transform: rotate(15deg); }
            20% { transform: rotate(-12deg); }
            30% { transform: rotate(10deg); }
            40% { transform: rotate(-8deg); }
            50% { transform: rotate(5deg); }
            60% { transform: rotate(-3deg); }
            70% { transform: rotate(1deg); }
            100% { transform: rotate(0deg); }
          }
        `}</style>
        <div key={`bellA-${ringing}`} style={{
          animation: ringing ? `rockBell 0.8s ease-out` : "none",
          transformOrigin: "50% 0%",
        }}>
          {/* Handle/yoke */}
          <div style={{
            width: 20,
            height: 12,
            backgroundColor: "#f0c040",
            borderRadius: "10px 10px 0 0",
            margin: "0 auto",
          }} />
          <div style={{
            width: 4,
            height: 8,
            backgroundColor: "#f0c040",
            margin: "0 auto",
          }} />
          {/* Spencer head as bell body */}
          <div style={{
            width: 80,
            height: 80,
            borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%",
            overflow: "hidden",
            border: "3px solid #f0c040",
            margin: "0 auto",
          }}>
            <img
              src={import.meta.env.BASE_URL + "SpencerOveralls.jpg"}
              alt="Ring the bell"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          {/* Bell rim */}
          <div style={{
            width: 90,
            height: 6,
            backgroundColor: "#f0c040",
            borderRadius: 3,
            margin: "0 auto",
          }} />
        </div>
      </Box>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/*  Option B: Bell with Spencer clapper                                */
/* ------------------------------------------------------------------ */
function SpencerBellB({ onClick, ringing }: { onClick: (e: React.MouseEvent) => void; ringing: number }) {
  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="caption" sx={{ display: "block", color: "#aaa", mb: 1 }}>
        Option B: Spencer is the clapper
      </Typography>
      <Box
        onClick={onClick}
        sx={{
          display: "inline-block",
          cursor: "pointer",
          transition: "transform 0.15s",
          "&:hover": { transform: "scale(1.1)" },
        }}
      >
        <style>{`
          @keyframes rockBellB {
            0% { transform: rotate(0deg); }
            10% { transform: rotate(12deg); }
            20% { transform: rotate(-10deg); }
            30% { transform: rotate(8deg); }
            40% { transform: rotate(-6deg); }
            50% { transform: rotate(4deg); }
            60% { transform: rotate(-2deg); }
            100% { transform: rotate(0deg); }
          }
          @keyframes swingClapper {
            0% { transform: rotate(0deg); }
            8% { transform: rotate(-35deg); }
            16% { transform: rotate(30deg); }
            24% { transform: rotate(-25deg); }
            32% { transform: rotate(20deg); }
            40% { transform: rotate(-15deg); }
            48% { transform: rotate(10deg); }
            56% { transform: rotate(-6deg); }
            64% { transform: rotate(3deg); }
            100% { transform: rotate(0deg); }
          }
        `}</style>
        <div key={`bellB-${ringing}`} style={{
          animation: ringing ? `rockBellB 1.5s ease-out` : "none",
          transformOrigin: "50% 0%",
        }}>
          {/* Handle */}
          <div style={{
            width: 24,
            height: 14,
            backgroundColor: "#f0c040",
            borderRadius: "12px 12px 0 0",
            margin: "0 auto",
          }} />
          {/* Bell body */}
          <svg width="100" height="85" viewBox="0 0 100 85" style={{ display: "block", margin: "0 auto" }}>
            <path
              d="M15,70 Q15,15 50,10 Q85,15 85,70 Z"
              fill="#f0c040"
              stroke="#d4a030"
              strokeWidth="2"
            />
            {/* Bell opening */}
            <ellipse cx="50" cy="72" rx="42" ry="8" fill="#d4a030" />
          </svg>
          {/* Clapper — Spencer head swinging */}
          <div key={`clapper-${ringing}`} style={{
            position: "relative",
            top: -30,
            marginBottom: -20,
            animation: ringing ? `swingClapper 1.5s ease-out` : "none",
            transformOrigin: "50% -20px",
          }}>
            <div style={{
              width: 4,
              height: 16,
              backgroundColor: "#d4a030",
              margin: "0 auto",
            }} />
            <div style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              overflow: "hidden",
              margin: "0 auto",
              border: "2px solid #d4a030",
            }}>
              <img
                src={import.meta.env.BASE_URL + "SpencerOveralls.jpg"}
                alt="Ring the bell"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </Box>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/*  Progress Circle                                                    */
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
  const cyanStrokeWidth = 24;
  const radius = (size - cyanStrokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const rawProgress = totalRaised / goal;
  const firstLap = Math.min(rawProgress, 1);
  const secondLap = rawProgress > 1 ? Math.min((rawProgress - 1) * 2, 1) : 0;
  const thirdLap = rawProgress > 1.5 ? Math.min((rawProgress - 1.5) * 2, 1) : 0;
  const firstOffset = circumference * (1 - firstLap);
  const secondOffset = circumference * (1 - secondLap);
  const thirdOffset = circumference * (1 - thirdLap);
  const overGoal = rawProgress > 1;
  const showCyan = rawProgress > 1.5;

  // Shimmer effect for cyan ring
  const shimmerRef = useRef<SVGCircleElement>(null);
  useEffect(() => {
    if (!showCyan || !shimmerRef.current) return;
    let animId = 0;
    const animate = (time: number) => {
      const el = shimmerRef.current;
      if (!el) return;
      const t = (time / 1000) * 0.5;
      const wave = Math.sin(t * Math.PI * 2);
      el.setAttribute("stroke-opacity", String(0.5 + wave * 0.5));
      el.setAttribute("stroke-width", String(cyanStrokeWidth + wave * 3));
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [showCyan]);

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
            <filter id="cyan-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        )}
          {/* Background track */}
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#666" strokeWidth={strokeWidth} />
          {/* Green */}
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#6ab648" strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={firstOffset} strokeLinecap="round" />
          {/* Second lap: gold */}
          {overGoal && (
            <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f0c040" strokeWidth={overStrokeWidth} strokeDasharray={circumference} strokeDashoffset={secondOffset} strokeLinecap="round" filter={secondLap < 1 ? "url(#over-glow)" : undefined} style={{ transition: "stroke-dashoffset 0.5s ease", animation: secondLap < 1 ? "pulseGlow 2s ease-in-out infinite" : undefined }} />
          )}
          {/* Third lap: cyan with shimmer */}
          {showCyan && (
            <circle
              ref={shimmerRef}
              cx={size / 2} cy={size / 2} r={radius}
              fill="none" stroke="#00feff" strokeWidth={cyanStrokeWidth}
              strokeDasharray={circumference} strokeDashoffset={thirdOffset}
              strokeLinecap="round"
              filter="url(#cyan-glow)"
              style={{ transition: "stroke-dashoffset 1s ease" }}
            />
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
            <Typography variant="caption" sx={{ color: showCyan ? "#00feff" : "#f0c040", fontWeight: "bold" }}>
              New Goal: ${showCyan ? "2,000,000" : "1,500,000"}
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
                1,842
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
  );
}

/* ------------------------------------------------------------------ */
/*  Basketball Mini-Game                                                */
/* ------------------------------------------------------------------ */
function BasketballGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballRef = useRef({ x: 0, y: 0, vx: 0, vy: 0, dragging: false, launched: false, settled: false, scored: false });
  const dragStartRef = useRef({ x: 0, y: 0 });
  const hamBurstRef = useRef<Array<{ x: number; y: number; vx: number; vy: number; rotation: number; rotationSpeed: number; opacity: number; size: number }>>([]);
  const hoopImgRef = useRef<HTMLImageElement | null>(null);
  const hamImgRef = useRef<HTMLImageElement | null>(null);
  const animRef = useRef(0);
  const scoreRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Preload images
  if (!hoopImgRef.current) {
    const img = new Image();
    img.src = import.meta.env.BASE_URL + "basketball-hoop.png";
    hoopImgRef.current = img;
  }
  if (!hamImgRef.current) {
    const img = new Image();
    img.src = import.meta.env.BASE_URL + "ham.png";
    hamImgRef.current = img;
  }
  const stickRef = useRef<HTMLImageElement | null>(null);
  if (!stickRef.current) {
    const img = new Image();
    img.src = import.meta.env.BASE_URL + "stick-spencer.jpg";
    stickRef.current = img;
  }
  // Preload basketball audio clips into memory via fetch
  const hamAudioRef = useRef<Record<number, string>>({});
  const hamBlobsLoaded = useRef(false);
  useEffect(() => {
    if (hamBlobsLoaded.current) return;
    hamBlobsLoaded.current = true;
    const clips: Record<number, string> = {
      3: "I don't do romance.mp3",
      7: "very singular.mp3",
      13: "you wouldnt understand.mp3",
    };
    for (const [n, file] of Object.entries(clips)) {
      fetch(import.meta.env.BASE_URL + file)
        .then(r => r.blob())
        .then(blob => {
          hamAudioRef.current[Number(n)] = URL.createObjectURL(blob);
        });
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const container = containerRef.current;
      if (!container) return;
      canvas.width = container.offsetWidth;
      canvas.height = 400;
      resetBall();
    };

    const getHoopRect = () => {
      const w = canvas.width;
      const hoopW = 180;
      const hoopH = 130;
      return {
        x: w / 2 - hoopW / 2,
        y: 20,
        w: hoopW,
        h: hoopH,
        rimX: w / 2,
        rimY: 110,
        rimRadius: 40,
      };
    };

    const getBallStart = () => ({
      x: canvas.width / 2,
      y: canvas.height - 50,
    });

    const resetBall = () => {
      const start = getBallStart();
      const ball = ballRef.current;
      ball.x = start.x;
      ball.y = start.y;
      ball.vx = 0;
      ball.vy = 0;
      ball.dragging = false;
      ball.launched = false;
      ball.settled = false;
      ball.scored = false;
    };

    resize();
    window.addEventListener("resize", resize);

    // Pointer events
    const getPos = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    // Unlock audio on first touch (mobile requirement)
    let audioUnlocked = false;
    const unlockAudio = () => {
      if (audioUnlocked) return;
      audioUnlocked = true;
      for (const audio of Object.values(hamAudioRef.current)) {
        const a = new Audio(audio);
        a.volume = 0;
        a.play().then(() => a.pause()).catch(() => {});
      }
    };

    const onDown = (e: PointerEvent) => {
      unlockAudio();
      const pos = getPos(e);
      const ball = ballRef.current;
      const dx = pos.x - ball.x;
      const dy = pos.y - ball.y;
      if (Math.sqrt(dx * dx + dy * dy) < 30 && !ball.launched) {
        ball.dragging = true;
        dragStartRef.current = { x: pos.x, y: pos.y };
        canvas.setPointerCapture(e.pointerId);
      }
    };

    // Track last several positions for smooth velocity calculation
    const posHistory: Array<{ x: number; y: number; t: number }> = [];

    const onMove = (e: PointerEvent) => {
      const ball = ballRef.current;
      if (!ball.dragging) return;
      const pos = getPos(e);
      posHistory.push({ ...pos, t: performance.now() });
      // Keep last 10 positions
      if (posHistory.length > 10) posHistory.shift();
      ball.x = pos.x;
      ball.y = pos.y;
    };

    const onUp = () => {
      const ball = ballRef.current;
      if (!ball.dragging) return;
      ball.dragging = false;
      // Calculate velocity from recent position history
      if (posHistory.length < 2) { resetBall(); return; }
      // Use positions from ~50-100ms ago for stable velocity
      const now = performance.now();
      const recent = posHistory.filter(p => now - p.t < 150);
      if (recent.length < 2) { resetBall(); return; }
      const first = recent[0];
      const last = recent[recent.length - 1];
      const dt = (last.t - first.t) / 1000;
      if (dt < 0.01) { resetBall(); return; }
      const dx = (last.x - first.x) / dt;
      const dy = (last.y - first.y) / dt;
      const speed = Math.sqrt(dx * dx + dy * dy);
      if (speed < 50) { resetBall(); return; }
      ball.vx = dx * 0.25;
      ball.vy = dy * 0.4;
      ball.launched = true;
      posHistory.length = 0;
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);

    // Animation
    const gravity = 600;
    let lastTime = 0;

    const spawnHamBurst = (x: number, y: number) => {
      for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 * i) / 12 + (Math.random() - 0.5) * 0.5;
        const speed = 200 + Math.random() * 300;
        hamBurstRef.current.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 200,
          rotation: 0,
          rotationSpeed: (Math.random() - 0.5) * 500,
          opacity: 1,
          size: 20 + Math.random() * 25,
        });
      }
    };

    const animate = (time: number) => {
      if (!lastTime) lastTime = time;
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const ball = ballRef.current;
      const hoop = getHoopRect();

      // Update ball physics
      if (ball.launched && !ball.settled) {
        ball.vy += gravity * dt;
        ball.x += ball.vx * dt;
        ball.y += ball.vy * dt;

        // Check if ball goes through rim
        const dx = ball.x - hoop.rimX;
        const dy = ball.y - hoop.rimY;
        if (Math.abs(dx) < hoop.rimRadius && Math.abs(dy) < 20 && ball.vy > 0 && !ball.scored) {
          ball.scored = true;
          // Score!
          scoreRef.current++;
          spawnHamBurst(ball.x, ball.y);
          // Play audio at milestones
          const clipUrl = hamAudioRef.current[scoreRef.current];
          if (clipUrl) new Audio(clipUrl).play();
          resetBall();
        }

        // Off screen? Reset
        if (ball.y > canvas.height + 50 || ball.x < -50 || ball.x > canvas.width + 50) {
          resetBall();
        }
      }

      // Update ham burst particles
      for (const h of hamBurstRef.current) {
        if (h.opacity <= 0) continue;
        h.vy += gravity * 0.5 * dt;
        h.x += h.vx * dt;
        h.y += h.vy * dt;
        h.rotation += h.rotationSpeed * dt;
        h.opacity -= dt * 0.5;
      }
      hamBurstRef.current = hamBurstRef.current.filter(h => h.opacity > 0);

      // Draw hoop
      const hoopImg = hoopImgRef.current;
      if (hoopImg && hoopImg.complete) {
        ctx.drawImage(hoopImg, hoop.x, hoop.y, hoop.w, hoop.h);
      }

      // Draw stick-spencer on the left (after hoop so it's on top)
      const stickImg = stickRef.current;
      if (stickImg && stickImg.complete) {
        const stickH = 180;
        const stickW = stickH * (stickImg.naturalWidth / stickImg.naturalHeight);
        ctx.drawImage(stickImg, 15, canvas.height / 2 - stickH / 2, stickW, stickH);
      }

      // Draw aiming line when dragging
      if (ball.dragging && posHistory.length >= 2) {
        const first = posHistory[0];
        const last = posHistory[posHistory.length - 1];
        const dx = last.x - first.x;
        const dy = last.y - first.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len > 3) {
          const nx = dx / len;
          const ny = dy / len;
          ctx.beginPath();
          ctx.setLineDash([5, 5]);
          ctx.strokeStyle = "rgba(255,255,255,0.4)";
          ctx.lineWidth = 2;
          ctx.moveTo(ball.x, ball.y);
          ctx.lineTo(ball.x + nx * 80, ball.y + ny * 80);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // Draw ball
      ctx.font = "36px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🏀", ball.x, ball.y);

      // Draw ham burst
      const hamImg = hamImgRef.current;
      if (hamImg && hamImg.complete) {
        for (const h of hamBurstRef.current) {
          ctx.save();
          ctx.globalAlpha = h.opacity;
          ctx.translate(h.x, h.y);
          ctx.rotate((h.rotation * Math.PI) / 180);
          ctx.drawImage(hamImg, -h.size / 2, -h.size / 2, h.size, h.size);
          ctx.restore();
        }
      }

      // Draw score
      if (scoreRef.current > 0) {
        ctx.font = "bold 18px Montserrat, sans-serif";
        ctx.fillStyle = "#f0c040";
        ctx.textAlign = "right";
        ctx.textBaseline = "top";
        ctx.fillText(`🍖 ${scoreRef.current}`, canvas.width - 10, 10);
      }

      // Instructions
      if (!ball.launched && !ball.dragging) {
        ctx.font = "14px Montserrat, sans-serif";
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillText("Flick 🏀 toward the hoop!", canvas.width / 2, canvas.height - 10);
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <Box ref={containerRef} sx={{ width: "100%", maxWidth: 500, mx: "auto", mt: 4 }}>
      <Typography variant="h6" sx={{ textAlign: "center", mb: 1, fontWeight: "bold" }}>
        🏀 Shoot Some Hoops With Spencer
      </Typography>
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: 400,
          borderRadius: 8,
          backgroundColor: "#000",
          touchAction: "none",
          cursor: "grab",
        }}
      />
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/*  Test Page                                                          */
/* ------------------------------------------------------------------ */
export default function TestProgressPage() {
  const goal = 1_000_000;
  const [raised, setRaised] = useState(1_350_000);
  const [burstTrigger, setBurstTrigger] = useState(0);
  const [burstOrigin, setBurstOrigin] = useState({ x: 0, y: 0 });
  const [soundIndex, setSoundIndex] = useState(0);
  const [lastSound, setLastSound] = useState("");
  const [ringing, setRinging] = useState(0);
  const [showCascade, setShowCascade] = useState(false);

  const handleRing = useCallback((e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setBurstOrigin({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });

    playSound(soundIndex);
    setLastSound(SOUND_NAMES[soundIndex]);
    setSoundIndex((i) => (i + 1) % SOUND_FILES.length);

    setBurstTrigger((t) => t + 1);
    setRinging((r) => r + 1);
  }, [soundIndex]);

  return (
    <Box sx={{ minHeight: "100vh", py: 4, px: 2 }}>
      <Typography variant="h4" sx={{ textAlign: "center", mb: 1, fontWeight: "bold" }}>
        Cyan Third Lap — Glow Options
      </Typography>

      <Box sx={{ maxWidth: 500, mx: "auto", mb: 4, px: 2 }}>
        <Typography variant="body2" sx={{ color: "#aaa", mb: 1 }}>
          Simulated total: <strong style={{ color: "#fff" }}>${raised.toLocaleString()}</strong>
        </Typography>
        <Slider
          value={raised}
          onChange={(_, v) => setRaised(v as number)}
          min={1_400_000}
          max={2_000_000}
          step={1000}
          sx={{
            color: raised > 1_500_000 ? "#00feff" : "#f0c040",
            "& .MuiSlider-thumb": { width: 20, height: 20 },
          }}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", color: "#888", fontSize: "0.75rem" }}>
          <span>$1.4M</span>
          <span>$1.5M</span>
          <span>$2M</span>
        </Box>
      </Box>

      <ProgressCircle totalRaised={raised} goal={goal} isSmall={window.innerWidth <= 600} />

      {raised >= 1_370_251 && raised < 1_500_000 && (
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
      )}
      {raised >= 1_500_000 && (
      <Box sx={{ display: "flex", justifyContent: "center", gap: 8, mt: 4, flexWrap: "wrap" }}>
        <SpencerBellA onClick={() => { setRinging((r) => r + 1); }} ringing={ringing} />
        <SpencerBellB onClick={() => { setRinging((r) => r + 1); }} ringing={ringing} />
      </Box>
      )}

      <SpencerBurst originX={burstOrigin.x} originY={burstOrigin.y} trigger={burstTrigger} />

      {/* Solitaire cascade test */}
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Button
          variant="contained"
          onClick={() => setShowCascade((v) => !v)}
          sx={{ backgroundColor: showCascade ? "#c62828" : "#f0c040", color: "#000" }}
        >
          {showCascade ? "Stop Cascade" : "🃏 Test Solitaire Cascade"}
        </Button>
      </Box>
      <CascadingSpencers active={showCascade} />

      <BasketballGame />
    </Box>
  );
}
