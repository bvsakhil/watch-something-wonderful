"use client";

import { useState, useRef, useEffect } from "react";
import { ReelPlayer } from "./ReelPlayer";
import { MANUAL_INSTAGRAM_REELS, YOUTUBE_VIDEOS, type Reel } from "./reels";

function shuffled<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function HomeClient() {
  const [reels, setReels] = useState<Reel[]>(() =>
    shuffled([...MANUAL_INSTAGRAM_REELS, ...YOUTUBE_VIDEOS]),
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Lazy-load synced reels manifest after first paint, then re-shuffle everything together
  useEffect(() => {
    import("../data/synced-instagram-reels.json").then(({ default: synced }) => {
      setReels(shuffled([...MANUAL_INSTAGRAM_REELS, ...YOUTUBE_VIDEOS, ...(synced as Reel[])]));
    });
  }, []);

  // Swipe animation state
  const [dragOffset, setDragOffset] = useState(0);       // px the player is shifted up
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(true);

  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  const touchStartTime = useRef(0);
  const isSwipingVertically = useRef<boolean | null>(null); // null = undecided

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Auto-hide swipe hint after animation completes
  useEffect(() => {
    if (!isMobile) return;
    const t = setTimeout(() => setShowSwipeHint(false), 2800);
    return () => clearTimeout(t);
  }, [isMobile]);

  const goNext = () => setCurrentIndex((i) => (i + 1) % reels.length);
  const goPrev = () => setCurrentIndex((i) => (i - 1 + reels.length) % reels.length);

  const triggerSwipeUp = () => {
    if (isTransitioning) return;
    setShowSwipeHint(false);
    // Phase 1: slide current video up off screen (200 ms)
    setIsTransitioning(true);
    setDragOffset(1000);
    setTimeout(() => {
      // Phase 2: change video, snap new one below screen (no transition)
      goNext();
      setIsTransitioning(false);
      setDragOffset(-1000);
      // Phase 3: animate new video in from below (220 ms)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
          setDragOffset(0);
          setTimeout(() => setIsTransitioning(false), 240);
        });
      });
    }, 200);
  };

  const triggerSwipeDown = () => {
    if (isTransitioning) return;
    setShowSwipeHint(false);
    // Phase 1: slide current video down off screen (200 ms)
    setIsTransitioning(true);
    setDragOffset(-1000);
    setTimeout(() => {
      // Phase 2: change to previous video, snap it above screen (no transition)
      goPrev();
      setIsTransitioning(false);
      setDragOffset(1000);
      // Phase 3: animate new video in from above (220 ms)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
          setDragOffset(0);
          setTimeout(() => setIsTransitioning(false), 240);
        });
      });
    }, 200);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    if (isTransitioning) return;
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
    touchStartTime.current = Date.now();
    isSwipingVertically.current = null;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (isTransitioning) return;
    const dy = touchStartY.current - e.touches[0].clientY;
    const dx = Math.abs(e.touches[0].clientX - touchStartX.current);

    // Lock direction on first move
    if (isSwipingVertically.current === null) {
      if (Math.abs(dy) < 6 && dx < 6) return; // too small to decide
      isSwipingVertically.current = Math.abs(dy) > dx;
    }

    if (!isSwipingVertically.current) return; // horizontal swipe — let browser handle

    e.preventDefault(); // prevent page scroll
    if (dy > 0) {
      // Swipe up
      setDragOffset(Math.min(dy * 0.88, 800));
    } else {
      // Swipe down
      setDragOffset(Math.max(dy * 0.88, -800));
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (isTransitioning) return;
    const dy = touchStartY.current - e.changedTouches[0].clientY;
    const elapsed = Date.now() - touchStartTime.current;
    const isFlickUp   = elapsed < 350 && dy >  35;
    const isDragUp    = dy >  110;
    const isFlickDown = elapsed < 350 && dy < -35;
    const isDragDown  = dy < -110;

    if (isFlickUp || isDragUp) {
      triggerSwipeUp();
    } else if (isFlickDown || isDragDown) {
      triggerSwipeDown();
    } else {
      // Snap back
      setIsTransitioning(true);
      setDragOffset(0);
      setTimeout(() => setIsTransitioning(false), 240);
    }
  };

  /* ── Mobile: full-width reel experience ── */
  if (isMobile) {
    return (
      <div
        className="relative flex-1 flex flex-col w-full overflow-hidden"
        style={{ touchAction: "none" }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Player frame is fixed — only video content inside slides */}
        <ReelPlayer
          reels={reels}
          index={currentIndex}
          isMobile
          mobileDragOffset={dragOffset}
          mobileIsTransitioning={isTransitioning}
        />

        {/* Swipe hint — fades out after 2.8 s or on first swipe */}
        {showSwipeHint && (
          <div
            className="swipe-hint absolute bottom-10 left-0 right-0 flex flex-col items-center gap-1 pointer-events-none"
            style={{ zIndex: 40 }}
          >
            <div className="swipe-hint-chevron">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" width={22} height={22}>
                <path d="M18 15l-6-6-6 6" />
              </svg>
            </div>
            <span
              style={{
                fontFamily: "'Awesome Serif', 'Cormorant Garamond', Georgia, serif",
                fontSize: "13px",
                color: "rgba(255,255,255,0.8)",
                letterSpacing: "0.06em",
              }}
            >
              swipe up
            </span>
          </div>
        )}
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
