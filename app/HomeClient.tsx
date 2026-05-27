"use client";

import { useState } from "react";
import { ReelPlayer } from "./ReelPlayer";
import { REELS } from "./reels";

export function HomeClient() {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <>
      <ReelPlayer reels={REELS} index={currentIndex} />

      <button
        type="button"
        onClick={() => setCurrentIndex((i) => (i + 1) % REELS.length)}
        className="btn-magic rounded-full cursor-pointer"
        style={{ marginTop: "clamp(28px, 6vh, 72px)", padding: "10px 26px" }}
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
