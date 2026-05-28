#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

if [[ -x "$ROOT_DIR/.venv/bin/python3" ]]; then
  PYTHON="$ROOT_DIR/.venv/bin/python3"
else
  PYTHON="python3"
fi

exec "$PYTHON" "$ROOT_DIR/scripts/sync_instagram_reels.py" "$@"
