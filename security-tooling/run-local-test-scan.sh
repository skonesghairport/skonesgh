#!/usr/bin/env bash
set -euo pipefail

# Run only against a local fixture owned by this runner. This script does not
# accept a remote target and does not upload raw findings by itself.
OUT_DIR="${1:-${RUNNER_TEMP:-/tmp}/skones-local-security-report}"
FIXTURE_DIR="$(mktemp -d)"
SERVER_PID=""
cleanup() {
  if [[ -n "$SERVER_PID" ]]; then
    kill "$SERVER_PID" 2>/dev/null || true
    wait "$SERVER_PID" 2>/dev/null || true
  fi
  rm -rf "$FIXTURE_DIR"
}
trap cleanup EXIT

mkdir -p "$OUT_DIR"
cat > "$FIXTURE_DIR/index.html" <<'HTML'
<!doctype html>
<html lang="en">
  <head><meta charset="utf-8"><title>Authorized local security fixture</title></head>
  <body><h1>Authorized local security fixture</h1><p>Loopback-only test service.</p></body>
</html>
HTML

python3 -m http.server 18080 --bind 127.0.0.1 --directory "$FIXTURE_DIR" >"$OUT_DIR/http-server.log" 2>&1 &
SERVER_PID="$!"
for _ in $(seq 1 20); do
  if curl --silent --fail --max-time 1 http://127.0.0.1:18080/ >/dev/null; then break; fi
  sleep 0.25
done
curl --silent --fail --max-time 2 http://127.0.0.1:18080/ >/dev/null

nmap -sT -T2 -p 18080 --max-retries 1 --host-timeout 30s 127.0.0.1 -oN "$OUT_DIR/nmap.txt" >/dev/null
whatweb --no-errors --log-verbose="$OUT_DIR/whatweb.txt" http://127.0.0.1:18080/ >/dev/null 2>&1

source "$HOME/.local/share/skones-security-tools/env.sh"
python3 "$PWD/security-tooling/audit_http_headers.py" http://127.0.0.1:18080/ --output "$OUT_DIR/http_headers.json"
gitleaks_version="$(gitleaks version 2>/dev/null | head -1 || true)"
"$SPIDERFOOT_HOME/.venv/bin/python" "$SPIDERFOOT_HOME/sf.py" \
  -s 127.0.0.1 \
  -t IP_ADDRESS \
  -m sfp_portscan_tcp \
  -o json > "$OUT_DIR/spiderfoot.json"

nmap_version="$(nmap --version | head -1)"
whatweb_version="$(whatweb --version 2>&1 | head -1)"
gitleaks_version="${gitleaks_version:-not available}"
spiderfoot_version="$($SPIDERFOOT_HOME/.venv/bin/python "$SPIDERFOOT_HOME/sf.py" --help 2>&1 | head -1)"
generated_at="$(date -u +'%Y-%m-%dT%H:%M:%SZ')"
{
  printf '%s\n' '# Weekly Local Security Tooling Report' ''
  printf '%s\n' '- **Target:** `http://127.0.0.1:18080/` (ephemeral loopback fixture)'
  printf '%s\n' '- **Scope:** Nmap TCP check of port 18080, WhatWeb fingerprinting, SpiderFoot TCP port discovery, and a body-free HTTP metadata audit against loopback.'
  printf '%s\n' '- **Authorization:** The fixture is created and owned by this runner; no external host was scanned.'
  printf '%s\n' "- **Generated:** \`$generated_at\`" ''
  printf '%s\n' '## Tool versions' '' '| Tool | Version |' '|---|---|' "| Nmap | \`$nmap_version\` |" "| WhatWeb | \`$whatweb_version\` |" "| SpiderFoot | \`$spiderfoot_version\` |" ''
  printf '%s\n' '## Gitleaks version' '' "\`$gitleaks_version\`" '' '## HTTP metadata audit' '' '~~~json'
  cat "$OUT_DIR/http_headers.json"
  printf '%s\n' '~~~' '' '## Nmap result' '' '~~~text'
  cat "$OUT_DIR/nmap.txt"
  printf '%s\n' '~~~' '' '## WhatWeb result' '' '~~~text'
  cat "$OUT_DIR/whatweb.txt"
  printf '%s\n' '~~~' '' '## SpiderFoot result summary' '' 'The complete SpiderFoot JSON is retained only in the ephemeral runner workspace. The workflow uploads this Markdown report because it contains loopback-only fixture results.' '' '~~~json'
  python3 - "$OUT_DIR/spiderfoot.json" <<'PY'
import json
import sys
from pathlib import Path

path = Path(sys.argv[1])
try:
    data = json.loads(path.read_text())
except Exception as exc:
    print(json.dumps({"parse_error": str(exc)}))
    raise SystemExit(0)

if isinstance(data, list):
    print(json.dumps({"event_count": len(data), "sample_events": data[:10]}, indent=2)[:12000])
else:
    print(json.dumps({"result_type": type(data).__name__}, indent=2))
PY
  printf '%s\n' '~~~'
} > "$OUT_DIR/report.md"

test -s "$OUT_DIR/report.md"
printf 'Report written to %s\n' "$OUT_DIR/report.md"
