---
name: osint-gateway-tooling
description: Safe, authorized OSINT and OpenAI-compatible gateway setup. Use when installing or documenting SpiderFoot and scoped reconnaissance tools, configuring a free or free-tier gateway such as OpenRouter, validating API connectivity, or reviewing security-tooling changes without exposing credentials.
---

# OSINT Gateway Tooling

## Overview

Use this skill to prepare a reproducible, defensive OSINT workstation and an optional OpenAI-compatible gateway configuration. Keep the setup isolated from production application code, require explicit authorization for every target, and never store API keys, cookies, tokens, private reports, or scan results in a repository.

## Operating rules

1. Treat all reconnaissance as authorized defensive work. Limit scans to assets owned by the user or covered by written permission, and prefer passive collection and low-impact queries.
2. Do not install or enable a full Kali bundle on an Ubuntu application host. Prefer a small, auditable package set and an isolated Python virtual environment. Use a disposable VM for tools that need a different operating system or elevated network capabilities.
3. Do not perform exploitation, credential attacks, stealth, persistence, evasion, destructive testing, or mass scanning. Do not add password-cracking, post-exploitation, social-engineering, or exploit-framework packages to a general-purpose project.
4. Keep secrets in environment variables or a secret manager. Never place real credentials in `.env.example`, shell history, command arguments, logs, skill files, Git, or generated reports.
5. Pin versions where practical, prefer official documentation and upstream repositories, and record the exact installation and verification commands.
6. Treat free gateway capacity as variable. Implement timeouts, retries with backoff, response-size limits, and a provider/model fallback rather than assuming unlimited availability.

## Workflow

### 1. Inspect the host and repository

Confirm the operating system, architecture, package manager, Python version, repository status, and whether the repository is public or production-connected. Do not modify `main` directly when a branch can be used. Check ignore rules before creating environment files or scan-output directories.

### 2. Select a scoped toolset

For Ubuntu, begin with `nmap`, `dnsutils`, `whois`, `jq`, and `whatweb` where available. Install SpiderFoot inside a dedicated virtual environment rather than into the system Python. Do not install a Kali metapackage unless the user explicitly requests an isolated Kali VM or container and understands its scope.

### 3. Configure the gateway safely

Use an OpenAI-compatible base URL and a model selected from the provider's current catalog. For OpenRouter, the documented endpoint is `https://openrouter.ai/api/v1` and the documented free router is `openrouter/free`. Store the key in `OPENROUTER_API_KEY`; keep the example file empty of real values. The application should fail closed with a clear message when the variable is missing.

Load provider documentation before creating a connector. A connector requiring a secret must use the actual secret supplied by the user; never reuse an environment token or invent a placeholder. If no key was supplied, provide a template and local verification command only.

### 4. Verify

Run version checks for every installed binary, import-check SpiderFoot without starting a public listener, and run the gateway health check only when a user-provided key is available. Use loopback-only binding for local web interfaces. Review the repository diff for secrets, generated scan data, and accidental production configuration.

### 5. Document and deliver

Record the selected versions, official source URLs, install commands, authorization boundary, environment variables, and rollback steps. Validate this skill with the skill validator and deliver its `SKILL.md` so it can be added to the user's skills collection.

## Bundled resources

- Read `references/openrouter.md` when implementing or reviewing the gateway adapter.
- Run `scripts/verify_setup.sh` after installation to print non-sensitive tool and configuration checks.

## Official references

- OpenRouter quickstart: https://openrouter.ai/docs/quickstart
- OpenRouter free models router: https://openrouter.ai/openrouter/free
- SpiderFoot upstream repository: https://github.com/smicallef/spiderfoot
- Kali Linux metapackages: https://www.kali.org/docs/general-use/metapackages/
