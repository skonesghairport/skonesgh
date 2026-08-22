#!/usr/bin/env bash
set -euo pipefail

printf '%s\n' 'OSINT gateway tooling verification'
printf 'Host: '; uname -srm
printf 'Python: '; python3 --version 2>&1 || true

check_command() {
  local name="$1"
  if command -v "$name" >/dev/null 2>&1; then
    printf '%-12s %s\n' "$name" "$(command -v "$name")"
    case "$name" in
      nmap) nmap --version 2>/dev/null | head -1 || true ;;
      whatweb) whatweb --version 2>/dev/null | head -1 || true ;;
      whois) whois --version 2>/dev/null | head -1 || true ;;
      jq) jq --version 2>/dev/null || true ;;
      dig) dig -v 2>/dev/null | head -1 || true ;;
    esac
  else
    printf '%-12s %s\n' "$name" 'NOT FOUND'
  fi
}

for command_name in nmap dig whois jq whatweb; do
  check_command "$command_name"
done

if [[ -n "${SPIDERFOOT_HOME:-}" && -x "${SPIDERFOOT_HOME}/.venv/bin/python" ]]; then
  printf '%-12s %s\n' 'spiderfoot' "$SPIDERFOOT_HOME/.venv/bin/python"
  "$SPIDERFOOT_HOME/.venv/bin/python" - <<'PY'
import importlib.util
print('  sf.py:', 'available' if importlib.util.find_spec('sf') else 'not importable')
PY
else
  printf '%-12s %s\n' 'spiderfoot' 'NOT CONFIGURED (set SPIDERFOOT_HOME after installation)'
fi

if [[ -n "${OPENROUTER_API_KEY:-}" ]]; then
  printf '%-12s %s\n' 'gateway key' 'PRESENT (value hidden)'
else
  printf '%-12s %s\n' 'gateway key' 'NOT SET (template-only mode)'
fi
printf '%s\n' 'No network scan or gateway request was performed.'
