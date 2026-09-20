#!/usr/bin/env bash
set -euo pipefail
mkdir -p server
cat bundle/part-{01..15}.b64 | tr -d '\r\n' | base64 -d > server/index.js.xz
echo "e2a8712bd85ebe6ffd7aba67f89504ec9b140f08969d6db1105e6d39f130a5ef  server/index.js.xz" | sha256sum -c -
if command -v xz >/dev/null 2>&1; then
  xz -d -f server/index.js.xz
elif command -v python3 >/dev/null 2>&1; then
  python3 - <<'PY'
import lzma, pathlib
p=pathlib.Path('server/index.js.xz')
pathlib.Path('server/index.js').write_bytes(lzma.decompress(p.read_bytes()))
p.unlink()
PY
else
  echo "Neither xz nor python3 is available to unpack the Mizan bundle." >&2
  exit 1
fi
test -s server/index.js
echo "Mizan private-session web bundle restored successfully."
