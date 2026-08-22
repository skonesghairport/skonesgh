# Scoped OSINT and Gateway Tooling

This directory provides a reproducible, defensive setup for authorized asset inventory and OSINT workflows. It is intentionally scoped for an Ubuntu host and does not install a full Kali distribution or Kali metapackage. Use it only against systems and data that you own or are explicitly authorized to assess.

## Included tools

| Tool | Purpose | Usage boundary |
|---|---|---|
| `nmap` | Network and service discovery | Use only with written authorization; prefer narrow, low-rate scans |
| `dig` from `dnsutils` | DNS inspection | Prefer passive lookups and owned domains |
| `whois` | Registration and allocation records | Public-record lookup only |
| `jq` | JSON inspection | Local data processing |
| `whatweb` | Web technology fingerprinting | Use only on authorized sites |
| SpiderFoot | OSINT collection and correlation | Run on owned or authorized targets; keep its listener on loopback |

The installer places SpiderFoot in a dedicated virtual environment under `~/.local/share/skones-security-tools` and installs the command-line utilities through the host’s Ubuntu repositories.

## Install

```bash
./security-tooling/install.sh
source "$HOME/.local/share/skones-security-tools/env.sh"
./security-tooling/verify.sh
```

The installer is idempotent. It does not install `kali-linux-everything`, password-cracking packages, exploit frameworks, post-exploitation tools, stealth/evasion tooling, or persistence mechanisms. If a broader lab is required, use a disposable Kali VM or isolated container rather than this production application host.

## Run SpiderFoot locally

```bash
source "$HOME/.local/share/skones-security-tools/env.sh"
"$SPIDERFOOT_HOME/.venv/bin/python" "$SPIDERFOOT_HOME/sf.py" -l 127.0.0.1:5001
```

Do not bind SpiderFoot to `0.0.0.0` unless the service is separately authenticated and protected by a firewall and reverse proxy.

## Optional OpenRouter-compatible gateway

Copy `.env.example` to a local, ignored file and add a user-created key outside Git:

```bash
cp .env.example .env.local
set -a
source .env.local
set +a
./security-tooling/openrouter-health.sh
```

The health check uses `https://openrouter.ai/api/v1/chat/completions` and the `openrouter/free` model router by default. Free model availability and limits can change, so do not treat this configuration as a service-level guarantee. Keep all gateway calls server-side in application code and apply authentication, quotas, input validation, timeouts, and output limits before exposing them through a web route.

## Verification and cleanup

```bash
./security-tooling/verify.sh
```

Scan results, SpiderFoot databases, logs, virtual environments, and local environment files are ignored. Review the authorization scope before every scan, redact sensitive findings before sharing reports, and remove the tool directory with `rm -rf "$HOME/.local/share/skones-security-tools"` when the lab is no longer needed.

## References

[1]: https://openrouter.ai/docs/quickstart "OpenRouter Quickstart"
[2]: https://openrouter.ai/openrouter/free "OpenRouter Free Models Router"
[3]: https://github.com/smicallef/spiderfoot "SpiderFoot upstream repository"
[4]: https://www.kali.org/docs/general-use/metapackages/ "Kali Linux Metapackages"

OpenRouter’s compatible API and free router are documented in [1] and [2]. SpiderFoot’s upstream project and installation guidance are in [3]. Kali’s package-group documentation is in [4].
