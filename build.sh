#!/usr/bin/env bash
set -euo pipefail
mkdir -p server
cat bundle/part-*.b64 | tr -d '\r\n' | base64 -d > server/index.js.xz
echo "169d96bf408c68f47b2429c48a81725fc50c52504f22de3638121ba24afacd38  server/index.js.xz" | sha256sum -c -
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
echo "Mizan original web bundle restored successfully."
