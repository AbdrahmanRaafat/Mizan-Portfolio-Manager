#!/usr/bin/env bash
set -euo pipefail
mkdir -p server
cat bundle/part-*.b64 | tr -d '\r\n' | base64 -d > server/index.js.xz
echo "6ec0c0a81e04b6c02ae46d5a3456cfdb43e31e5293140c384e81e308fc98e650  server/index.js.xz" | sha256sum -c -
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
