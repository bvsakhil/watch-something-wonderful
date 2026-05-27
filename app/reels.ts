type InstagramReel = {
  readonly platform: "instagram";
  readonly src: string;
  readonly platformUrl: string;
  readonly creator: string;
  readonly creatorUrl: string;
};

type YouTubeReel = {
  readonly platform: "youtube";
  readonly videoId: string;
  readonly platformUrl: string;
  readonly creator: string;
  readonly creatorUrl: string;
};

export type Reel = InstagramReel | YouTubeReel;

export const REELS: readonly Reel[] = [
  {
    platform: "instagram",
    src: "/reels/reel-1.mp4",
    platformUrl: "https://www.instagram.com/reel/DYzgERDNiQV/",
    creator: "mertzv2",
    creatorUrl: "https://www.instagram.com/mertzv2/",
  },
  {
    platform: "instagram",
    src: "/reels/reel-2.mp4",
    platformUrl: "https://www.instagram.com/reel/DYt2v3ruVHZ/",
    creator: "mertzv2",
    creatorUrl: "https://www.instagram.com/mertzv2/",
  },
  {
    platform: "instagram",
    src: "/reels/reel-3.mp4",
    platformUrl: "https://www.instagram.com/reel/DY1Uv5UhZ6S/",
    creator: "oli_main",
    creatorUrl: "https://www.instagram.com/oli_main/",
  },
  {
    platform: "instagram",
    src: "/reels/reel-4.mp4",
    platformUrl: "https://www.instagram.com/reel/DYtf_MwBqK1/",
    creator: "oli_main",
    creatorUrl: "https://www.instagram.com/oli_main/",
  },
  {
    platform: "instagram",
    src: "/reels/reel-5.mp4",
    platformUrl: "https://www.instagram.com/reel/DYXGjR2qj2q/",
    creator: "vera.aalbers",
    creatorUrl: "https://www.instagram.com/vera.aalbers/",
  },
  {
    platform: "instagram",
    src: "/reels/reel-6.mp4",
    platformUrl: "https://www.instagram.com/reel/DX68ineoVyW/",
    creator: "purav89",
    creatorUrl: "https://www.instagram.com/purav89/",
  },
  {
    platform: "youtube",
    videoId: "X5Izm1LQfw4",
    platformUrl: "https://www.youtube.com/watch?v=X5Izm1LQfw4",
    creator: "high5toons",
    creatorUrl: "https://www.youtube.com/@high5toons",
  },
];
