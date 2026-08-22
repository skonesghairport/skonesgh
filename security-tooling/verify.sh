#!/usr/bin/env bash
set -euo pipefail

printf '%s\n' 'Scoped OSINT tooling verification'
printf 'Host: '; uname -srm
printf 'Python: '; python3 --version 2>&1 || true

for command_name in nmap dig whois jq whatweb gitleaks; do
  if command -v "$command_name" >/dev/null 2>&1; then
    printf '%-10s %s\n' "$command_name" "$(command -v "$command_name")"
  else
    printf '%-10s %s\n' "$command_name" 'NOT FOUND'
  fi
done

if [[ -n "${SPIDERFOOT_HOME:-}" && -f "$SPIDERFOOT_HOME/sf.py" && -x "$SPIDERFOOT_HOME/.venv/bin/python" ]]; then
  printf '%-10s %s\n' 'spiderfoot' "$SPIDERFOOT_HOME/sf.py"
  "$SPIDERFOOT_HOME/.venv/bin/python" "$SPIDERFOOT_HOME/sf.py" --help >/dev/null
  printf '%-10s %s\n' 'sf import' 'OK'
else
  printf '%-10s %s\n' 'spiderfoot' 'NOT CONFIGURED'
fi

if [[ -n "${OPENROUTER_API_KEY:-}" ]]; then
  printf '%-10s %s\n' 'gateway' 'key present (hidden; run openrouter-health.sh to test)'
else
  printf '%-10s %s\n' 'gateway' 'template-only mode'
fi

printf '%s\n' 'No network scan or gateway request was performed by this verification script.'
