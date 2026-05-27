import { HomeClient } from "./HomeClient";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden flex flex-col items-center">
      {/* Vimeo background — autoplay, loop, muted, no controls via background=1 */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <iframe
          src="https://player.vimeo.com/video/1196031149?autoplay=1&loop=1&background=1&muted=1"
          allow="autoplay; fullscreen"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "177.78vh",   /* 100/56.25 — keeps 16:9 ratio, fills height */
            minWidth: "100%",
            height: "56.25vw",   /* 100*9/16 — keeps 16:9 ratio, fills width */
            minHeight: "100%",
            transform: "translate(-50%, -50%)",
            border: "none",
          }}
        />
      </div>

      {/* Title */}
      <h1
        className="text-white font-semibold text-center capitalize not-italic"
        style={{
          fontFamily: "var(--font-serif), 'Cormorant Garamond', Georgia, serif",
          fontSize: "64px",
          lineHeight: 0.9,
          marginTop: "71px",
        }}
      >
        <span className="block">Watch Something</span>
        <span className="block">Wonderful</span>
      </h1>

      <HomeClient />
    </main>
  );
}
