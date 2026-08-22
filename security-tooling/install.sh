#!/usr/bin/env bash
set -euo pipefail

# Install only a scoped, defensive toolset. Do not run this against systems you
# do not own or have written authorization to assess.

SPIDERFOOT_VERSION="${SPIDERFOOT_VERSION:-4.0}"
GITLEAKS_VERSION="${GITLEAKS_VERSION:-8.30.1}"
TOOLS_ROOT="${TOOLS_ROOT:-${HOME}/.local/share/skones-security-tools}"
SPIDERFOOT_HOME="${TOOLS_ROOT}/spiderfoot-${SPIDERFOOT_VERSION}"
GITLEAKS_BIN="${TOOLS_ROOT}/bin/gitleaks"
SPIDERFOOT_URL="https://github.com/smicallef/spiderfoot/archive/refs/tags/v${SPIDERFOOT_VERSION}.tar.gz"
tmpdir=""
requirements_compat=""
gitleaks_tmp=""
cleanup() {
  [[ -z "$tmpdir" ]] || rm -rf "$tmpdir"
  [[ -z "$requirements_compat" ]] || rm -f "$requirements_compat"
  [[ -z "$gitleaks_tmp" ]] || rm -rf "$gitleaks_tmp"
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

if [[ ! -x "$GITLEAKS_BIN" ]] || [[ "$("$GITLEAKS_BIN" version 2>/dev/null || true)" != "$GITLEAKS_VERSION" ]]; then
  case "$(uname -m)" in
    x86_64) gitleaks_arch="x64" ;;
    aarch64|arm64) gitleaks_arch="arm64" ;;
    *) echo "Unsupported architecture for pinned Gitleaks release: $(uname -m)" >&2; exit 1 ;;
  esac
  gitleaks_name="gitleaks_${GITLEAKS_VERSION}_linux_${gitleaks_arch}"
  gitleaks_tmp="$(mktemp -d)"
  curl --fail --location --show-error --retry 3 \
    "https://github.com/gitleaks/gitleaks/releases/download/v${GITLEAKS_VERSION}/${gitleaks_name}.tar.gz" \
    --output "$gitleaks_tmp/${gitleaks_name}.tar.gz"
  curl --fail --location --show-error --retry 3 \
    "https://github.com/gitleaks/gitleaks/releases/download/v${GITLEAKS_VERSION}/gitleaks_${GITLEAKS_VERSION}_checksums.txt" \
    --output "$gitleaks_tmp/checksums.txt"
  expected_checksum="$(awk -v name="${gitleaks_name}.tar.gz" '$2 == name {print $1}' "$gitleaks_tmp/checksums.txt")"
  test -n "$expected_checksum"
  printf '%s  %s\n' "$expected_checksum" "$gitleaks_tmp/${gitleaks_name}.tar.gz" | sha256sum --check --status
  tar -xzf "$gitleaks_tmp/${gitleaks_name}.tar.gz" -C "$gitleaks_tmp"
  test -x "$gitleaks_tmp/gitleaks"
  mkdir -p "$(dirname "$GITLEAKS_BIN")"
  install -m 0755 "$gitleaks_tmp/gitleaks" "$GITLEAKS_BIN"
  gitleaks_tmp=""
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
export GITLEAKS_BIN=$(printf '%q' "$GITLEAKS_BIN")
export PATH=$(printf '%q' "$(dirname "$GITLEAKS_BIN")"):$SPIDERFOOT_HOME/.venv/bin:\$PATH
EOF

printf '\nInstallation complete. SpiderFoot is isolated at: %s\n' "$SPIDERFOOT_HOME"
printf 'To load its environment: source %q\n' "${TOOLS_ROOT}/env.sh"
printf 'Start SpiderFoot locally only: %q %q -l 127.0.0.1:5001\n' "$SPIDERFOOT_HOME/.venv/bin/python" "$SPIDERFOOT_HOME/sf.py"
