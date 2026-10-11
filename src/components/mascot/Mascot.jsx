import { useCallback, useEffect, useRef, useState } from "react";
import { useLabStatus } from "./useLabStatus";
import {
  pickLine,
  WAKE,
  QUESTIONS,
  FREE,
  FREE_UNTIL,
  BUSY,
  CLOSED,
} from "./lines";
import "./Mascot.css";

const SIZE = 88; // px, responsive display width
const MARGIN = 16;
const HOP_MS = 750;
const NUDGE_COOLDOWN = 8 * 60 * 1000; // at most one lab-status nudge per 8 min
const QUESTION_STAY_MS = 14000;
const MUTE_KEY = "mascot:muted";

const rand = (a, b) => a + Math.random() * (b - a);
const fmtTime = (d) =>
  d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const getDockPos = () => {
  if (typeof window === "undefined") return { x: 100, y: 24 };
  const isMobile = window.innerWidth < 768;
  // Android / mobile bottom navigation height is ~64px + safe area
  const bottomMargin = isMobile ? 86 : 32;
  // Move resting space comfortably away from the right screen boundary
  const rightMargin = isMobile ? 54 : 148;
  return {
    x: Math.max(MARGIN, window.innerWidth - SIZE - rightMargin),
    y: bottomMargin,
  };
};

const readMuted = () => {
  try {
    return localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    return false;
  }
};

const writeMuted = (v) => {
  try {
    localStorage.setItem(MUTE_KEY, v ? "1" : "0");
  } catch {
    /* storage unavailable */
  }
};

/**
 * MatteLab Interactive Person Mascot
 * - Dialogue box redesigned with clean editorial ivory speech balloon
 * - No default "Propose Event" button; options appear ONLY when explicitly asked for
 * - Character animations stay 100% on the person image
 */
export default function Mascot({
  db,
  image,
  openHour = 8.5,
  closeHour = 20,
  onNavigate,
  onOpenCreateModal,
}) {
  const lab = useLabStatus(db, { openHour, closeHour });
  const labRef = useRef(lab);
  labRef.current = lab;

  const [muted, setMuted] = useState(readMuted);
  const [mode, setMode] = useState("docked"); // "docked" | "active"
  const [animState, setAnimState] = useState("idle"); // "idle" | "waking" | "hopping" | "talking" | "poked"
  const [hopDirection, setHopDirection] = useState("center"); // "left" | "right" | "center"
  const [puff, setPuff] = useState(0); // celebratory energy ring burst
  const [pos, setPos] = useState(getDockPos);
  const [line, setLine] = useState(null); // { text, tag, action?, actionLabel? }

  const figureRef = useRef(null);
  const timers = useRef([]);
  const retireTimer = useRef(null);
  const busy = useRef(false);
  const lastNudge = useRef(0);

  const later = useCallback((fn, ms) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  }, []);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  // Squash-and-stretch character hop with directional lean
  const hop = useCallback((targetX = null, currentX = null) => {
    if (!figureRef.current) return;

    let lean = 0;
    if (targetX !== null && currentX !== null) {
      if (targetX > currentX + 10) lean = 8;
      else if (targetX < currentX - 10) lean = -8;
    }

    setAnimState("hopping");

    figureRef.current.animate(
      [
        { transform: "translateY(0) scale(1.15, 0.85) rotate(0deg)", offset: 0 },
        { transform: `translateY(-75px) scale(0.9, 1.15) rotate(${lean}deg)`, offset: 0.45 },
        { transform: `translateY(-30px) scale(0.96, 1.08) rotate(${lean * 0.5}deg)`, offset: 0.7 },
        { transform: "translateY(3px) scale(1.16, 0.86) rotate(0deg)", offset: 0.88 },
        { transform: "translateY(0) scale(1, 1) rotate(0deg)", offset: 1 },
      ],
      { duration: 680, easing: "cubic-bezier(0.25, 1, 0.5, 1)" }
    );
  }, []);

  // Playful poke reaction
  const playPokeAnim = useCallback(() => {
    if (!figureRef.current) return;
    setAnimState("poked");
    figureRef.current.animate(
      [
        { transform: "scale(1, 1) rotate(0deg)", offset: 0 },
        { transform: "scale(1.18, 0.84) rotate(-8deg)", offset: 0.2 },
        { transform: "translateY(-16px) scale(0.92, 1.14) rotate(7deg)", offset: 0.45 },
        { transform: "translateY(2px) scale(1.08, 0.94) rotate(-4deg)", offset: 0.75 },
        { transform: "translateY(0) scale(1, 1) rotate(0deg)", offset: 1 },
      ],
      { duration: 520, easing: "ease-out" }
    );
    later(() => {
      setAnimState(mode === "docked" ? "idle" : line ? "talking" : "idle");
    }, 530);
  }, [later, mode, line]);

  // Wake-up sequence on the person
  const playWakePop = useCallback(() => {
    if (!figureRef.current) return;
    setPuff((n) => n + 1);
    setAnimState("waking");
    figureRef.current.animate(
      [
        { transform: "scale(1, 1) translateY(0)", offset: 0 },
        { transform: "scale(1.18, 0.84) translateY(4px)", offset: 0.25 },
        { transform: "scale(0.92, 1.16) translateY(-28px)", offset: 0.55 },
        { transform: "scale(1.08, 0.94) translateY(1px)", offset: 0.82 },
        { transform: "scale(1, 1) translateY(0)", offset: 1 },
      ],
      { duration: 600, easing: "cubic-bezier(0.18, 0.89, 0.32, 1.28)" }
    );
  }, []);

  const retire = useCallback(() => {
    clearTimers();
    setLine(null);
    const dock = getDockPos();
    hop(dock.x, pos.x);
    setPos(dock);

    later(() => {
      setMode("docked");
      setAnimState("idle");
      busy.current = false;
    }, HOP_MS);
  }, [clearTimers, hop, later, pos.x]);

  const showQuestion = useCallback(() => {
    const picked = pickLine(QUESTIONS);
    setLine({
      text: picked.text,
      tag: "Maker Prompt",
      action: picked.action,
      actionLabel: picked.actionLabel,
    });
    setAnimState("talking");
    hop();
    clearTimeout(retireTimer.current);
    retireTimer.current = later(retire, QUESTION_STAY_MS);
  }, [hop, later, retire]);

  // Wake up: stays the person, perks up, hops around, and chats cleanly
  const activate = useCallback(() => {
    clearTimers();
    busy.current = true;
    setMode("active");
    playWakePop();

    later(() => {
      const picked = pickLine(WAKE);
      setLine({
        text: picked.text,
        tag: "MatteLab",
        action: picked.action,
        actionLabel: picked.actionLabel,
      });
      setAnimState("talking");
    }, 550);

    const isMobile = window.innerWidth < 768;
    const minY = isMobile ? 86 : 32;
    // Widen vertical wandering bounds across the canvas
    const maxY = isMobile
      ? Math.min(window.innerHeight * 0.65, window.innerHeight - 150)
      : Math.min(window.innerHeight * 0.78, window.innerHeight - 110);
    const hops = prefersReducedMotion() ? 0 : Math.round(rand(4, 7));

    let t = 800;
    let prevX = pos.x;

    const minX = isMobile ? 14 : 32;
    const maxX = Math.max(minX + 60, window.innerWidth - SIZE - (isMobile ? 24 : 48));

    // Diverse screen sectors for wide exploration
    const sectors = [
      [minX, Math.max(minX + 30, window.innerWidth * 0.28)],
      [window.innerWidth * 0.26, window.innerWidth * 0.50],
      [window.innerWidth * 0.48, window.innerWidth * 0.72],
      [Math.max(minX + 50, window.innerWidth * 0.70), maxX],
    ];

    let lastSectorIdx = prevX > window.innerWidth / 2 ? 3 : 0;

    // Distribute hops widely across opposite sectors of the screen
    for (let i = 0; i < hops; i++) {
      // Pick a non-adjacent sector to force expansive leaps
      let nextSectorIdx;
      do {
        nextSectorIdx = Math.floor(Math.random() * sectors.length);
      } while (nextSectorIdx === lastSectorIdx && sectors.length > 1);

      lastSectorIdx = nextSectorIdx;
      const [secMin, secMax] = sectors[nextSectorIdx];
      const nextX = Math.min(maxX, Math.max(minX, rand(secMin, Math.max(secMin + 20, secMax))));
      const nextY = rand(minY, maxY);
      const fromX = prevX;

      later(() => {
        setHopDirection(nextX > fromX ? "right" : "left");
        setPos({ x: nextX, y: nextY });
        hop(nextX, fromX);
      }, t);

      prevX = nextX;
      t += HOP_MS;
    }

    later(() => {
      setHopDirection("center");
      showQuestion();
    }, t);
  }, [clearTimers, playWakePop, later, pos.x, hop, showQuestion]);

  // Subtle lab status notification while staying the person
  const nudge = useCallback(() => {
    const l = labRef.current;
    let picked;

    if (l.state === "free") {
      picked =
        l.freeUntil && Math.random() < 0.6
          ? FREE_UNTIL(fmtTime(l.freeUntil))
          : pickLine(FREE);
    } else if (l.state === "busy") {
      picked = pickLine(BUSY);
    } else {
      picked = pickLine(CLOSED);
    }

    busy.current = true;
    setLine({
      text: picked.text,
      tag: "Lab Status",
      action: picked.action,
      actionLabel: picked.actionLabel,
    });
    setAnimState("talking");
    hop();

    later(() => {
      setLine(null);
      setAnimState("idle");
      busy.current = false;
    }, 7500);
  }, [hop, later]);

  // Idle cycle: occasionally nudge or perk up
  useEffect(() => {
    if (muted) return;
    let id;
    const loop = () => {
      id = setTimeout(() => {
        if (!busy.current && document.visibilityState === "visible") {
          const roll = Math.random();
          if (roll < 0.35 && !prefersReducedMotion()) {
            activate();
          } else if (roll < 0.75 && Date.now() - lastNudge.current > NUDGE_COOLDOWN) {
            lastNudge.current = Date.now();
            nudge();
          }
        }
        loop();
      }, rand(30000, 60000));
    };
    loop();
    return () => clearTimeout(id);
  }, [muted, activate, nudge]);

  // Window resize handler keeping mascot docked in the corner
  useEffect(() => {
    const onResize = () => {
      if (mode === "docked") setPos(getDockPos());
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [mode]);

  const onPoke = () => {
    playPokeAnim();
    if (mode === "docked") {
      later(activate, 280);
    } else {
      // If already active, advance to next thought and take a lively jump
      showQuestion();
      const isMobile = window.innerWidth < 768;
      const minX = isMobile ? 14 : 32;
      const maxX = Math.max(minX + 60, window.innerWidth - SIZE - (isMobile ? 24 : 48));
      const minY = isMobile ? 86 : 32;
      const maxY = isMobile ? window.innerHeight * 0.58 : window.innerHeight * 0.72;
      const nextX = rand(minX, maxX);
      const nextY = rand(minY, maxY);
      setHopDirection(nextX > pos.x ? "right" : "left");
      setPos({ x: nextX, y: nextY });
      hop(nextX, pos.x);
    }
  };

  const hide = () => {
    retire();
    writeMuted(true);
    setMuted(true);
  };

  if (muted) {
    const dock = getDockPos();
    const rightMargin = typeof window !== "undefined" && window.innerWidth < 768 ? 54 : 148;
    return (
      <button
        className="mascot-show"
        style={{ right: rightMargin, bottom: dock.y }}
        aria-label="Wake up MatteLab Mascot"
        title="Summon MatteLab Maker Mascot"
        onClick={() => {
          writeMuted(false);
          setMuted(false);
        }}
      >
        <img src={image} alt="Mascot icon" />
      </button>
    );
  }

  const side = pos.x > window.innerWidth / 2 ? "right" : "left";

  return (
    <div
      className="mascot"
      data-mode={mode}
      data-state={animState}
      data-dir={hopDirection}
      data-talking={Boolean(line)}
      style={{ left: pos.x, bottom: pos.y }}
    >
      {/* Redesigned Clean Editorial Dialogue Box */}
      {line && (
        <div className={`mascot-bubble ${side}`} role="status">
          {/* Header Row: Label & Dismiss Close Button */}
          <div className="mascot-bubble-header">
            <span className="mascot-bubble-tag">{line.tag || "MatteLab"}</span>
            <button
              type="button"
              className="mascot-bubble-close"
              onClick={() => {
                setLine(null);
                setAnimState("idle");
              }}
              aria-label="Dismiss message"
              title="Dismiss"
            >
              ×
            </button>
          </div>

          {/* Clean Message Body (No default buttons!) */}
          <p className="mascot-bubble-text">{line.text}</p>

          {/* Action Options ONLY if explicitly asked for by this line */}
          {line.action && (
            <div className="mascot-actions">
              {line.action === "propose_event" && onOpenCreateModal && (
                <button
                  type="button"
                  className="mascot-btn primary"
                  onClick={() => {
                    onOpenCreateModal();
                    setLine(null);
                    retire();
                  }}
                >
                  {line.actionLabel || "Propose Event"}
                </button>
              )}

              {line.action === "view_schedule" && onNavigate && (
                <button
                  type="button"
                  className="mascot-btn primary"
                  onClick={() => {
                    onNavigate("resources");
                    setLine(null);
                  }}
                >
                  {line.actionLabel || "View Schedule"}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Main Mascot Character (The Person) */}
      <button
        type="button"
        className="mascot-body"
        onClick={onPoke}
        aria-label="Interact with MatteLab Mascot"
        title="Poke me for maker inspiration!"
      >
        {/* Soft ground contact shadow */}
        <span className="mascot-shadow" aria-hidden="true" />

        {/* Celebration / Wake Energy Ring */}
        {puff > 0 && <span key={puff} className="mascot-puff" aria-hidden="true" />}

        {/* The Animated Person Figure */}
        <span ref={figureRef} className="mascot-figure">
          <img
            className="mascot-person"
            src={image}
            alt="MatteLab Maker Mascot"
            draggable="false"
          />
        </span>
      </button>
    </div>
  );
}
