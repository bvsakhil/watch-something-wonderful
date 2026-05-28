This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Sync Instagram Reels

To pull reels from an Instagram profile into the app feed:

### 1. Export cookies (recommended — use a burner account)

Do **not** paste cookies in chat. Save them to a local file instead.

1. Log into your **burner** Instagram account in Chrome.
2. Install the [Get cookies.txt LOCALLY](https://chromewebstore.google.com/detail/get-cookiestxt-locally/cclelndahbckbenkjhflpdbgdldlbecc) extension.
3. Go to [instagram.com](https://www.instagram.com) while logged in.
4. Click the extension → export cookies for `instagram.com`.
5. Save the file as `cookies/instagram.txt` in this project:

```bash
cp ~/Downloads/cookies.txt cookies/instagram.txt
```

Required cookies: `sessionid` and `csrftoken`. The file is gitignored.

### 2. Install Python dependencies (one-time)

```bash
python3 -m venv .venv
.venv/bin/pip install instaloader browser_cookie3 requests
```

### 3. Run the sync

```bash
npm run sync:instagram
```

This downloads the latest **50** reels from `@projetociberdelia` as:

- `public/reels/projetociberdelia-01.mp4`
- `public/reels/projetociberdelia-02.mp4`
- … through `projetociberdelia-50.mp4`

It updates `data/synced-instagram-reels.json` and merges them into the shuffled feed.

If `cookies/instagram.txt` is missing, the script falls back to Instagram cookies from Chrome/Brave/Firefox on this machine.

Re-run anytime to refresh. Each sync replaces that profile's numbered files and manifest entries.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
