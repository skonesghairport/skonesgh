#!/usr/bin/env bash
set -euo pipefail

# Install only a scoped, defensive toolset. Do not run this against systems you
# do not own or have written authorization to assess.

SPIDERFOOT_VERSION="${SPIDERFOOT_VERSION:-4.0}"
TOOLS_ROOT="${TOOLS_ROOT:-${HOME}/.local/share/skones-security-tools}"
SPIDERFOOT_HOME="${TOOLS_ROOT}/spiderfoot-${SPIDERFOOT_VERSION}"
SPIDERFOOT_URL="https://github.com/smicallef/spiderfoot/archive/refs/tags/v${SPIDERFOOT_VERSION}.tar.gz"
tmpdir=""
requirements_compat=""
cleanup() {
  [[ -z "$tmpdir" ]] || rm -rf "$tmpdir"
  [[ -z "$requirements_compat" ]] || rm -f "$requirements_compat"
}
trap cleanup EXIT

if [[ "$(id -u)" -eq 0 ]]; then
  SUDO=""
else
  SUDO="sudo"
fi

printf '%s\n' 'Installing scoped Ubuntu security and OSINT dependencies.'
$SUDO apt-get update -y
$SUDO apt-get install -y nmap dnsutils whois jq whatweb python3-venv python3-pip ca-certificates curl tar

mkdir -p "$TOOLS_ROOT"
if [[ ! -f "$SPIDERFOOT_HOME/sf.py" ]]; then
  archive="${TOOLS_ROOT}/spiderfoot-${SPIDERFOOT_VERSION}.tar.gz"
  tmpdir="$(mktemp -d)"
  curl --fail --location --show-error --retry 3 "$SPIDERFOOT_URL" --output "$archive"
  tar -xzf "$archive" -C "$tmpdir"
  extracted="${tmpdir}/spiderfoot-${SPIDERFOOT_VERSION}"
  test -f "$extracted/sf.py"
  mv "$extracted" "$SPIDERFOOT_HOME"
fi

python3 -m venv "$SPIDERFOOT_HOME/.venv"
"$SPIDERFOOT_HOME/.venv/bin/python" -m pip install --upgrade pip
requirements_compat="$(mktemp)"
# SpiderFoot 4.0 predates Python 3.12 and pins PyYAML <6, which has no
# compatible wheel for this host. Keep the upstream requirements visible while
# relaxing only that obsolete upper bound to a maintained compatible release.
sed -E 's/^pyyaml>=5\.4\.1,<6/pyyaml>=5.4.1,<7/I' "$SPIDERFOOT_HOME/requirements.txt" > "$requirements_compat"
"$SPIDERFOOT_HOME/.venv/bin/pip" install --requirement "$requirements_compat"

cat > "${TOOLS_ROOT}/env.sh" <<EOF
export SPIDERFOOT_HOME=$(printf '%q' "$SPIDERFOOT_HOME")
export PATH=$(printf '%q' "$SPIDERFOOT_HOME/.venv/bin"):\$PATH
EOF

printf '\nInstallation complete. SpiderFoot is isolated at: %s\n' "$SPIDERFOOT_HOME"
printf 'To load its environment: source %q\n' "${TOOLS_ROOT}/env.sh"
printf 'Start SpiderFoot locally only: %q %q -l 127.0.0.1:5001\n' "$SPIDERFOOT_HOME/.venv/bin/python" "$SPIDERFOOT_HOME/sf.py"
