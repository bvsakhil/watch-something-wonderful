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
        className="bg-white rounded-full hover:bg-white/90 active:scale-95 transition-all cursor-pointer"
        style={{ marginTop: "49px", padding: "16px 32px" }}
      >
        <span
          className="font-semibold capitalize"
          style={{
            fontFamily: "var(--font-serif), 'Cormorant Garamond', Georgia, serif",
            fontSize: "24px",
            color: "#6a91af",
            lineHeight: 1,
          }}
        >
          next
        </span>
      </button>
    </>
  );
}
