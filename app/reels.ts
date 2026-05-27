export const REELS = [
  {
    src: "/reels/reel-1.mp4",
    instagramUrl: "https://www.instagram.com/reel/DYzgERDNiQV/",
    creator: "mertzv2",
    creatorUrl: "https://www.instagram.com/mertzv2/",
  },
  {
    src: "/reels/reel-2.mp4",
    instagramUrl: "https://www.instagram.com/reel/DYt2v3ruVHZ/",
    creator: "mertzv2",
    creatorUrl: "https://www.instagram.com/mertzv2/",
  },
  {
    src: "/reels/reel-3.mp4",
    instagramUrl: "https://www.instagram.com/reel/DY1Uv5UhZ6S/",
    creator: "oli_main",
    creatorUrl: "https://www.instagram.com/oli_main/",
  },
  {
    src: "/reels/reel-4.mp4",
    instagramUrl: "https://www.instagram.com/reel/DYtf_MwBqK1/",
    creator: "oli_main",
    creatorUrl: "https://www.instagram.com/oli_main/",
  },
] as const;

export type Reel = (typeof REELS)[number];
