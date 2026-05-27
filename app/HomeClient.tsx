"use client";

import { useState } from "react";
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

  return (
    <>
      <ReelPlayer reels={reels} index={currentIndex} />

      <button
        type="button"
        onClick={() => setCurrentIndex((i) => (i + 1) % reels.length)}
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
