export const REELS = [
  {
    src: "/reels/reel-1.mp4",
    instagramUrl: "https://www.instagram.com/reel/DYzgERDNiQV/",
  },
  {
    src: "/reels/reel-2.mp4",
    instagramUrl: "https://www.instagram.com/reel/DYt2v3ruVHZ/",
  },
  {
    src: "/reels/reel-3.mp4",
    instagramUrl: "https://www.instagram.com/reel/DY1Uv5UhZ6S/",
  },
  {
    src: "/reels/reel-4.mp4",
    instagramUrl: "https://www.instagram.com/reel/DYtf_MwBqK1/",
  },
] as const;

export type Reel = (typeof REELS)[number];
