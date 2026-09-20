#!/usr/bin/env bash
set -euo pipefail
mkdir -p server
cat bundle/part-{01..15}.b64 | tr -d '\r\n' | base64 -d > server/index.js.xz
echo "3738f2714bceb3f7e3507f02f5dc805d1c37252fba64d412c61b0691b034ad05  server/index.js.xz" | sha256sum -c -
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
