"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { Reel } from "./reels";

type Props = { reels: readonly Reel[]; index: number };

const SERIF = "'Awesome Serif', 'Cormorant Garamond', Georgia, serif";

function fmt(s: number) {
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

/* ── Icons ── */
function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={18} height={18}>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={18} height={18}>
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}
function VolumeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={18} height={18}>
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </svg>
  );
}
function MuteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={18} height={18}>
      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
    </svg>
  );
}
function ExpandIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={18} height={18}>
      <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
    </svg>
  );
}
function CollapseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={18} height={18}>
      <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={13} height={13}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

export function ReelPlayer({ reels, index }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldAutoPlay = useRef(false);
  const isFirstRender = useRef(true);
  const reel = reels[index];

  const [playing, setPlaying]       = useState(false);
  const [muted, setMuted]           = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration]     = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const progress = duration ? (currentTime / duration) * 100 : 0;

  /* Auto-hide controls 2.5 s after last activity while playing */
  const bumpControls = useCallback(() => {
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (playing) {
      hideTimer.current = setTimeout(() => setShowControls(false), 2500);
    }
  }, [playing]);

  useEffect(() => () => { if (hideTimer.current) clearTimeout(hideTimer.current); }, []);

  /* Reset state when reel changes; auto-play on navigation (not first mount) */
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      shouldAutoPlay.current = true;
    }
    setPlaying(false);
    setCurrentTime(0);
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
  }, [index]);

  /* Fullscreen change listener */
  useEffect(() => {
    const onFsChange = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    v.paused ? v.play() : v.pause();
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = parseFloat(e.target.value);
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    document.fullscreenElement ? document.exitFullscreen() : el.requestFullscreen();
  };

  return (
    <div
      ref={containerRef}
      className="crt-scanlines relative overflow-hidden bg-black select-none"
      style={{
        width: "min(760px, calc(100vw - 48px), calc((100dvh - 290px) * 760 / 480))",
        aspectRatio: "760 / 480",
        flexShrink: 0,
        marginTop: "clamp(20px, 4vh, 56px)",
        borderRadius: "clamp(12px, 3vw, 28px)",
        /* dark bezel ring */
        boxShadow: `
          inset 0 0 0 1px rgba(255,255,255,0.06),
          0 0 0 clamp(4px, 1.2vw, 9px) rgba(16,16,16,0.97),
          0 0 0 clamp(6px, 1.6vw, 12px) rgba(38,38,38,0.75),
          0 clamp(12px, 3vh, 28px) clamp(24px, 5vw, 60px) rgba(0,0,0,0.65)
        `,
      }}
      onMouseMove={bumpControls}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      {/* Video */}
      <video
        ref={videoRef}
        key={reel.src}
        src={reel.src}
        playsInline
        className="w-full h-full object-cover cursor-pointer"
        onPlay={() => { setPlaying(true); bumpControls(); }}
        onPause={() => { setPlaying(false); setShowControls(true); }}
        onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime ?? 0)}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration ?? 0)}
        onCanPlay={() => {
          if (shouldAutoPlay.current) {
            shouldAutoPlay.current = false;
            videoRef.current?.play();
          }
        }}
        onClick={togglePlay}
      />

      {/* CRT: edge vignette — simulates convex screen light falloff */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 38%, rgba(0,0,0,0.62) 100%)",
          borderRadius: "inherit",
          zIndex: 5,
        }}
      />

      {/* CRT: specular highlight — convex glass reflection */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 45% at 50% 10%, rgba(255,255,255,0.07) 0%, transparent 65%)",
          borderRadius: "inherit",
          zIndex: 6,
        }}
      />

      {/* Top-right tags: creator + Instagram */}
      <div
        className="absolute top-2 right-2 flex items-center gap-1.5"
        style={{ zIndex: 20 }}
      >
        {reel.creator && (
          <a
            href={reel.creatorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 transition-colors hover:text-white"
            style={{
              fontFamily: SERIF,
              fontSize: "clamp(10px, 2.5vw, 12px)",
              color: "rgba(255,255,255,0.82)",
              background: "rgba(0,0,0,0.38)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: 99,
              padding: "3px 8px",
              whiteSpace: "nowrap",
            }}
          >
            @{reel.creator}
          </a>
        )}
        <a
          href={reel.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 transition-colors hover:text-white"
          style={{
            fontFamily: SERIF,
            fontSize: "clamp(10px, 2.5vw, 12px)",
            color: "rgba(255,255,255,0.82)",
            background: "rgba(0,0,0,0.38)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: 99,
            padding: "3px 8px",
            whiteSpace: "nowrap",
          }}
        >
          <InstagramIcon />
          view on ig
        </a>
      </div>

      {/* Centre play button — small, clean, visible when paused */}
      <button
        onClick={togglePlay}
        aria-label={playing ? "Pause" : "Play"}
        className="absolute transition-all duration-200"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 46,
          height: 46,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.92)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 16px rgba(0,0,0,0.35)",
          opacity: playing ? 0 : 1,
          pointerEvents: playing ? "none" : "auto",
          zIndex: 15,
          color: "#1a1a1a",
        }}
      >
        <PlayIcon />
      </button>

      {/* Controls overlay */}
      <div
        className="absolute bottom-0 left-0 right-0 transition-opacity duration-300"
        style={{ opacity: showControls ? 1 : 0, pointerEvents: showControls ? "auto" : "none" }}
      >
        {/* Gradient fade */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 60%, transparent 100%)",
          }}
        />

        {/* Controls bar */}
        <div className="relative px-3 pb-3 flex flex-col gap-1.5">
          {/* Progress bar */}
          <div className="flex items-center gap-1.5">
            <span
              style={{
                fontFamily: SERIF,
                fontSize: "clamp(10px, 2.5vw, 12px)",
                color: "rgba(255,255,255,0.75)",
                minWidth: 28,
                textAlign: "right",
              }}
            >
              {fmt(currentTime)}
            </span>

            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.01}
              value={currentTime}
              onChange={seek}
              onMouseDown={bumpControls}
              className="video-progress flex-1"
              style={{
                background: `linear-gradient(to right, rgba(255,255,255,0.9) ${progress}%, rgba(255,255,255,0.25) ${progress}%)`,
              }}
            />

            <span
              style={{
                fontFamily: SERIF,
                fontSize: "clamp(10px, 2.5vw, 12px)",
                color: "rgba(255,255,255,0.5)",
                minWidth: 28,
              }}
            >
              {fmt(duration)}
            </span>
          </div>

          {/* Buttons row */}
          <div className="flex items-center justify-between">
            {/* Left: play + volume */}
            <div className="flex items-center gap-3 text-white/85">
              <button
                onClick={togglePlay}
                aria-label={playing ? "Pause" : "Play"}
                className="hover:text-white transition-colors"
              >
                {playing ? <PauseIcon /> : <PlayIcon />}
              </button>
              <button
                onClick={toggleMute}
                aria-label={muted ? "Unmute" : "Mute"}
                className="hover:text-white transition-colors"
              >
                {muted ? <MuteIcon /> : <VolumeIcon />}
              </button>
            </div>

            {/* Right: fullscreen */}
            <button
              onClick={toggleFullscreen}
              aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"}
              className="text-white/85 hover:text-white transition-colors"
            >
              {fullscreen ? <CollapseIcon /> : <ExpandIcon />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
