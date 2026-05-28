"use client";

import { useState, useRef, useEffect } from "react";
import { ReelPlayer } from "./ReelPlayer";
import { REELS } from "./reels";

function shuffled<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function HomeClient() {
  const [reels] = useState(() => shuffled(REELS));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const goNext = () => setCurrentIndex((i) => (i + 1) % reels.length);
  const goPrev = () => setCurrentIndex((i) => (i - 1 + reels.length) % reels.length);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const deltaY = touchStartY.current - e.changedTouches[0].clientY;
    const elapsed = Date.now() - touchStartTime.current;
    if (elapsed < 600 && Math.abs(deltaY) > 50) {
      deltaY > 0 ? goNext() : goPrev();
    }
  };

  /* ── Mobile: vertical reel experience ── */
  if (isMobile) {
    return (
      <div
        className="flex-1 flex flex-col items-center justify-center w-full"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{ touchAction: "pan-x" }}
      >
        <ReelPlayer reels={reels} index={currentIndex} isMobile />

        {/* Swipe hint */}
        <p
          style={{
            fontFamily: "'Awesome Serif', 'Cormorant Garamond', Georgia, serif",
            fontSize: 12,
            color: "rgba(255,255,255,0.4)",
            marginTop: 12,
            letterSpacing: "0.04em",
          }}
        >
          swipe up for next
        </p>
      </div>
    );
  }

  /* ── Desktop: horizontal layout ── */
  return (
    <>
      <ReelPlayer reels={reels} index={currentIndex} />

      <button
        type="button"
        onClick={goNext}
        className="btn-magic rounded-full cursor-pointer"
        style={{ marginTop: "clamp(16px, 4vh, 72px)", padding: "10px 26px" }}
      >
        <span
          className="font-semibold capitalize"
          style={{
            fontFamily: "var(--font-serif), 'Cormorant Garamond', Georgia, serif",
            fontSize: "20px",
            color: "#4e4852",
            lineHeight: 1,
          }}
        >
          next
        </span>
      </button>
    </>
  );
}
