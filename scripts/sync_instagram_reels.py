#!/usr/bin/env python3
"""Download latest Instagram reels from a profile into public/reels/."""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from http.cookiejar import MozillaCookieJar
from pathlib import Path

import browser_cookie3
import requests

ROOT = Path(__file__).resolve().parents[1]
REELS_DIR = ROOT / "public" / "reels"
MANIFEST = ROOT / "data" / "synced-instagram-reels.json"
DEFAULT_COOKIES_FILE = ROOT / "cookies" / "instagram.txt"
BROWSER_FALLBACKS = ("chrome", "brave", "chromium", "firefox", "safari", "edge")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Sync latest Instagram reels for a profile")
    parser.add_argument("--profile", required=True, help="Instagram username")
    parser.add_argument("--count", type=int, default=50, help="Number of latest reels")
    parser.add_argument("--browser", default="chrome", help="Browser to load cookies from")
    parser.add_argument(
        "--cookies-file",
        default=str(DEFAULT_COOKIES_FILE),
        help="Netscape cookies.txt path (preferred over browser cookies when file exists)",
    )
    return parser.parse_args()


def load_session_from_file(cookies_file: Path) -> tuple[requests.Session, str]:
    if not cookies_file.exists():
        raise FileNotFoundError(str(cookies_file))

    session = requests.Session()
    jar = MozillaCookieJar(str(cookies_file))
    jar.load(ignore_discard=True, ignore_expires=True)
    session.cookies.update(jar)

    csrf = session.cookies.get("csrftoken", domain=".instagram.com") or session.cookies.get("csrftoken")
    if not csrf:
        raise RuntimeError(f"No csrftoken found in {cookies_file}")

    print(f"Loaded Instagram cookies from {cookies_file}")
    return session, csrf


def load_session_from_browser(browser: str) -> tuple[requests.Session, str]:
    browsers = [browser, *[b for b in BROWSER_FALLBACKS if b != browser]]
    last_error: Exception | None = None

    for name in browsers:
        try:
            loader = getattr(browser_cookie3, name)
        except AttributeError:
            continue
        try:
            cookies = list(loader(domain_name="instagram.com"))
        except Exception as exc:  # noqa: BLE001
            last_error = exc
            continue
        if not cookies:
            continue

        session = requests.Session()
        for cookie in cookies:
            session.cookies.set(cookie.name, cookie.value, domain=cookie.domain)
        csrf = session.cookies.get("csrftoken", domain=".instagram.com") or session.cookies.get("csrftoken")
        if not csrf:
            continue
        print(f"Loaded Instagram cookies from {name}")
        return session, csrf

    if last_error:
        raise RuntimeError(f"Could not load Instagram cookies from any browser: {last_error}")
    raise RuntimeError(
        "No Instagram cookies found. Export cookies to cookies/instagram.txt or log in via browser."
    )


def load_session(browser: str, cookies_file: Path | None) -> tuple[requests.Session, str]:
    if cookies_file and cookies_file.exists():
        return load_session_from_file(cookies_file)
    return load_session_from_browser(browser)


def api_headers(csrf: str, referer: str) -> dict[str, str]:
    return {
        "User-Agent": (
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36"
        ),
        "X-CSRFToken": csrf,
        "X-IG-App-ID": "936619743392459",
        "X-Requested-With": "XMLHttpRequest",
        "Referer": referer,
        "Content-Type": "application/x-www-form-urlencoded",
    }


def fetch_user_id(session: requests.Session, csrf: str, profile: str) -> str:
    url = f"https://www.instagram.com/api/v1/users/web_profile_info/?username={profile}"
    response = session.get(url, headers=api_headers(csrf, f"https://www.instagram.com/{profile}/"))
    response.raise_for_status()
    data = response.json()
    return str(data["data"]["user"]["id"])


def fetch_latest_reels(
    session: requests.Session, csrf: str, profile: str, user_id: str, count: int
) -> list[dict]:
    reels: list[dict] = []
    max_id = ""
    headers = api_headers(csrf, f"https://www.instagram.com/{profile}/reels/")

    while len(reels) < count:
        payload: dict[str, str | int] = {
            "target_user_id": user_id,
            "page_size": min(12, count - len(reels)),
        }
        if max_id:
            payload["max_id"] = max_id

        response = session.post(
            "https://www.instagram.com/api/v1/clips/user/",
            data=payload,
            headers=headers,
        )
        response.raise_for_status()
        data = response.json()
        items = data.get("items") or []

        if not items:
            break

        for item in items:
            media = item.get("media") or item
            shortcode = media.get("code") or media.get("shortcode")
            versions = media.get("video_versions") or []
            if not shortcode or not versions:
                continue
            reels.append({"shortcode": shortcode, "video_url": versions[0]["url"]})
            if len(reels) >= count:
                break

        paging = data.get("paging_info") or {}
        if not paging.get("more_available") or len(reels) >= count:
            break
        max_id = paging.get("max_id") or ""
        if not max_id:
            break

    return reels


def profile_filename(profile: str, index: int) -> str:
    return f"{profile}-{index:02d}.mp4"


def remove_existing_profile_reels(profile: str) -> None:
    for path in REELS_DIR.glob(f"{profile}-*.mp4"):
        path.unlink()
        print(f"  removed old {path.name}")


def download_video(session: requests.Session, url: str, dest: Path) -> None:
    if dest.exists():
        print(f"  skip existing {dest.name}")
        return
    with session.get(url, stream=True, timeout=120) as response:
        response.raise_for_status()
        dest.write_bytes(response.content)
    print(f"  downloaded {dest.name}")


def ytdlp_download(cookies_file: Path | None, browser: str, shortcode: str, dest: Path) -> bool:
    if dest.exists():
        return True
    cmd = ["yt-dlp", "-f", "best[ext=mp4]/best", "-o", str(dest)]
    if cookies_file and cookies_file.exists():
        cmd.extend(["--cookies", str(cookies_file)])
    else:
        cmd.append(f"--cookies-from-browser={browser}")
    cmd.append(f"https://www.instagram.com/reel/{shortcode}/")
    try:
        subprocess.run(cmd, check=True, capture_output=True, text=True)
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False
    return dest.exists()


def load_manifest() -> list[dict]:
    if not MANIFEST.exists():
        return []
    try:
        data = json.loads(MANIFEST.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return []
    return data if isinstance(data, list) else []


def write_manifest(profile: str, entries: list[dict]) -> None:
    existing = [item for item in load_manifest() if item.get("creator") != profile]
    merged = existing + entries
    MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST.write_text(json.dumps(merged, indent=2) + "\n", encoding="utf-8")


def main() -> int:
    args = parse_args()
    profile = args.profile.strip().lstrip("@")
    creator_url = f"https://www.instagram.com/{profile}/"
    cookies_file = Path(args.cookies_file) if args.cookies_file else None

    REELS_DIR.mkdir(parents=True, exist_ok=True)

    try:
        session, csrf = load_session(args.browser, cookies_file)
        user_id = fetch_user_id(session, csrf, profile)
        reels = fetch_latest_reels(session, csrf, profile, user_id, args.count)
    except Exception as exc:  # noqa: BLE001
        print(f"Error fetching reels for @{profile}: {exc}", file=sys.stderr)
        return 1

    if not reels:
        print(f"Error: no reels found for @{profile}", file=sys.stderr)
        return 1

    print(f"Found {len(reels)} reel(s), saving as {profile}-01.mp4 … {profile}-{len(reels):02d}.mp4")
    remove_existing_profile_reels(profile)

    entries: list[dict] = []
    for index, reel in enumerate(reels, start=1):
        shortcode = reel["shortcode"]
        filename = profile_filename(profile, index)
        dest = REELS_DIR / filename

        try:
            download_video(session, reel["video_url"], dest)
        except Exception:
            if not ytdlp_download(cookies_file, args.browser, shortcode, dest):
                print(f"  failed to download {shortcode}", file=sys.stderr)
                continue

        if not dest.exists():
            continue

        entries.append(
            {
                "platform": "instagram",
                "src": f"/reels/{filename}",
                "platformUrl": f"https://www.instagram.com/reel/{shortcode}/",
                "creator": profile,
                "creatorUrl": creator_url,
            }
        )

    if not entries:
        print(f"Error: could not download any reels for @{profile}", file=sys.stderr)
        return 1

    write_manifest(profile, entries)
    print(f"Synced {len(entries)} reel(s) for @{profile}")
    for entry in entries[:5]:
        print(f"  - {entry['src']}")
    if len(entries) > 5:
        print(f"  … and {len(entries) - 5} more")
    print(f"Manifest updated: {MANIFEST}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
