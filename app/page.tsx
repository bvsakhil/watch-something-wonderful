import { HomeClient } from "./HomeClient";

export default function Home() {
  return (
    <main className="relative h-[100dvh] w-full overflow-hidden flex flex-col items-center">
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

      {/* Title / logo */}
      <h1
        className="text-white text-center capitalize not-italic px-4"
        style={{
          fontFamily: "'Awesome Serif', 'Cormorant Garamond', Georgia, serif",
          fontWeight: 600,
          fontSize: "clamp(22px, 6vw, 42px)",
          lineHeight: 1.05,
          marginTop: "clamp(28px, 6vh, 88px)",
          marginBottom: "clamp(18px, 3vh, 32px)",
          letterSpacing: "0.01em",
          textShadow: `
            0 0 12px rgba(255, 255, 255, 0.55),
            0 0 28px rgba(255, 255, 255, 0.30),
            0 0 55px rgba(255, 255, 255, 0.15)
          `,
        }}
      >
        <span className="block">Watch Something</span>
        <span className="block">Wonderful</span>
      </h1>

      <HomeClient />

      <footer
        className="mt-auto pb-4 hidden sm:block"
        style={{
          fontFamily: "'Awesome Serif', 'Cormorant Garamond', Georgia, serif",
          fontSize: "clamp(12px, 2.5vw, 14px)",
          color: "rgba(255,255,255,0.65)",
          letterSpacing: "0.02em",
        }}
      >
        made by{" "}
        <a
          href="https://x.com/akhil_bvs"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          akhil
        </a>
        {" "}and claude code
      </footer>
    </main>
  );
}
