#!/usr/bin/env python3
"""Audit safe HTTP metadata for an explicitly loopback-only test service."""

from __future__ import annotations

import argparse
import ipaddress
import json
import socket
import sys
from datetime import datetime, timezone
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import HTTPRedirectHandler, Request, build_opener

SAFE_HEADERS = (
    "content-security-policy",
    "strict-transport-security",
    "x-content-type-options",
    "x-frame-options",
    "referrer-policy",
    "permissions-policy",
    "cache-control",
    "server",
    "x-powered-by",
)


class NoRedirectHandler(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def is_loopback_host(hostname: str) -> bool:
    if not hostname:
        return False
    try:
        addresses = socket.getaddrinfo(hostname, None)
        return bool(addresses) and all(ipaddress.ip_address(item[4][0]).is_loopback for item in addresses)
    except (socket.gaierror, ValueError):
        return False


def audit(url: str, timeout: float) -> dict[str, object]:
    parsed = urlparse(url)
    if parsed.scheme not in {"http", "https"}:
        raise ValueError("URL must use http or https")
    if not is_loopback_host(parsed.hostname or ""):
        raise ValueError("This module is loopback-only; refusing a non-loopback host")

    request = Request(url, method="HEAD", headers={"User-Agent": "skones-local-security-audit/1.0"})
    opener = build_opener(NoRedirectHandler)
    response_status = None
    headers: dict[str, str] = {}
    location = None
    error = None
    try:
        with opener.open(request, timeout=timeout) as response:
            response_status = response.status
            headers = {key.lower(): value for key, value in response.headers.items() if key.lower() in SAFE_HEADERS}
            location = response.headers.get("Location")
    except HTTPError as exc:
        response_status = exc.code
        headers = {key.lower(): value for key, value in exc.headers.items() if key.lower() in SAFE_HEADERS}
        location = exc.headers.get("Location")
    except (URLError, TimeoutError, OSError) as exc:
        error = str(exc)

    missing_headers = [header for header in SAFE_HEADERS[:5] if header not in headers]
    return {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "target": url,
        "loopback_only": True,
        "status": response_status,
        "redirect_location_present": bool(location),
        "headers": headers,
        "missing_common_security_headers": missing_headers,
        "error": error,
        "body_collected": False,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("url", help="Loopback HTTP(S) URL to inspect")
    parser.add_argument("--timeout", type=float, default=5.0)
    parser.add_argument("--output", help="Write JSON to this file instead of stdout")
    args = parser.parse_args()

    try:
        result = audit(args.url, args.timeout)
    except ValueError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2

    rendered = json.dumps(result, indent=2) + "\n"
    if args.output:
        with open(args.output, "w", encoding="utf-8") as output:
            output.write(rendered)
    else:
        print(rendered, end="")
    return 0 if result["error"] is None else 1


if __name__ == "__main__":
    raise SystemExit(main())
