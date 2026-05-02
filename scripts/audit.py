#!/usr/bin/env python3
"""
EventHive Security Audit Engine
=================================
Kirov Dynamics Technology — Local-first, zero-billing security scanner.
Scans connected repositories for leaked IPs, hardcoded secrets,
insecure CI/CD configs, and POPIA/GDPR compliance violations.

Usage:
    python3 audit.py --scan <path>
    python3 audit.py --scan <path> --report json
    python3 audit.py --tls <hostname>
"""

import os
import re
import sys
import json
import argparse
import hashlib
import datetime
from pathlib import Path
from dataclasses import dataclass, field, asdict
from typing import Optional

# ─── Severity Levels ──────────────────────────────────────────────────────────

CRITICAL = "CRITICAL"
HIGH     = "HIGH"
MEDIUM   = "MEDIUM"
LOW      = "LOW"
INFO     = "INFO"

# ─── ANSI Colours (terminal only) ─────────────────────────────────────────────

RED    = "\033[91m"
YELLOW = "\033[93m"
GREEN  = "\033[92m"
BLUE   = "\033[94m"
CYAN   = "\033[96m"
RESET  = "\033[0m"
BOLD   = "\033[1m"

def colour(text: str, code: str) -> str:
    return f"{code}{text}{RESET}" if sys.stdout.isatty() else text

# ─── Data Models ──────────────────────────────────────────────────────────────

@dataclass
class Finding:
    rule_id:   str
    severity:  str
    file:      str
    line:      int
    message:   str
    snippet:   str
    fix:       str

@dataclass
class AuditReport:
    scanned_at:   str = field(default_factory=lambda: datetime.datetime.utcnow().isoformat() + "Z")
    scan_root:    str = ""
    total_files:  int = 0
    total_lines:  int = 0
    findings:     list = field(default_factory=list)

    @property
    def critical_count(self) -> int:
        return sum(1 for f in self.findings if f.severity == CRITICAL)

    @property
    def high_count(self) -> int:
        return sum(1 for f in self.findings if f.severity == HIGH)

    @property
    def passed(self) -> bool:
        return self.critical_count == 0 and self.high_count == 0

# ─── Detection Rules ──────────────────────────────────────────────────────────

RULES = [
    {
        "id": "SEC-001",
        "severity": CRITICAL,
        "pattern": re.compile(
            r'(?:password|passwd|pwd)\s*[=:]\s*["\']?(?!<)[^\s"\'<>{}\[\]]{4,}',
            re.IGNORECASE
        ),
        "message": "Hardcoded password detected",
        "fix": "Move credentials to environment variables or a secrets manager. Never commit passwords.",
        "extensions": [".py", ".js", ".ts", ".jsx", ".tsx", ".env", ".yml", ".yaml", ".json"],
    },
    {
        "id": "SEC-002",
        "severity": CRITICAL,
        "pattern": re.compile(
            r'(?:api[_-]?key|apikey|access[_-]?token|secret[_-]?key)\s*[=:]\s*["\']?[A-Za-z0-9_\-]{16,}',
            re.IGNORECASE
        ),
        "message": "Potential API key or secret token hardcoded in source",
        "fix": "Use environment variables. Add the file to .gitignore. Rotate the exposed key immediately.",
        "extensions": [".py", ".js", ".ts", ".jsx", ".tsx", ".env", ".yml", ".yaml", ".json", ".sh"],
    },
    {
        "id": "SEC-003",
        "severity": HIGH,
        "pattern": re.compile(
            r'\b(?:192\.168|10\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01]))\.\d{1,3}\.\d{1,3}\b'
        ),
        "message": "Private network IP address found in committed file",
        "fix": "Replace with a placeholder like <YOUR_LOCAL_IP> or load from an environment variable.",
        "extensions": [".md", ".html", ".js", ".ts", ".py", ".sh", ".yml", ".yaml", ".json", ".txt"],
    },
    {
        "id": "SEC-004",
        "severity": HIGH,
        "pattern": re.compile(
            r'(?:-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----)',
        ),
        "message": "Private key material found in source file",
        "fix": "Remove the key immediately, rotate it, and add *.pem / *.key to .gitignore.",
        "extensions": [".pem", ".key", ".txt", ".env", ".sh"],
    },
    {
        "id": "SEC-005",
        "severity": MEDIUM,
        "pattern": re.compile(
            r'(?:eval|exec)\s*\(',
            re.IGNORECASE
        ),
        "message": "Unsafe eval/exec usage — potential code injection vector",
        "fix": "Avoid eval/exec with user input. Use safe parsing (ast.literal_eval in Python, JSON.parse in JS).",
        "extensions": [".py", ".js", ".ts"],
    },
    {
        "id": "SEC-006",
        "severity": MEDIUM,
        "pattern": re.compile(r'http://(?!localhost|127\.0\.0\.1|<YOUR)', re.IGNORECASE),
        "message": "Non-HTTPS endpoint — data transmitted in cleartext",
        "fix": "Switch to https:// to prevent man-in-the-middle attacks.",
        "extensions": [".md", ".html", ".js", ".ts", ".jsx", ".tsx", ".py", ".yml", ".yaml"],
    },
    {
        "id": "CI-001",
        "severity": HIGH,
        "pattern": re.compile(r'on:\s*\n\s+push:', re.MULTILINE),
        "message": "CI workflow triggers on every push — potential billing noise",
        "fix": "Restrict triggers to specific branches (branches: [main]) or use workflow_dispatch for manual runs.",
        "extensions": [".yml", ".yaml"],
    },
    {
        "id": "PII-001",
        "severity": MEDIUM,
        "pattern": re.compile(
            r'\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}\b'
        ),
        "message": "Email address found in source — potential PII/POPIA violation",
        "fix": "Do not commit personal email addresses. Use placeholder@example.com in docs and .gitignore for config files.",
        "extensions": [".md", ".html", ".js", ".ts", ".py", ".json", ".yml"],
    },
]

SKIP_DIRS  = {".git", "node_modules", "__pycache__", ".next", "dist", "build", "venv", ".venv"}
SKIP_FILES = {"package-lock.json", "yarn.lock", "pnpm-lock.yaml"}

# ─── Scanner ──────────────────────────────────────────────────────────────────

def should_skip(path: Path) -> bool:
    for part in path.parts:
        if part in SKIP_DIRS:
            return True
    return path.name in SKIP_FILES

def scan_file(path: Path, report: AuditReport) -> None:
    ext = path.suffix.lower()
    applicable_rules = [r for r in RULES if not r["extensions"] or ext in r["extensions"]]
    if not applicable_rules:
        return

    try:
        lines = path.read_text(encoding="utf-8", errors="ignore").splitlines()
    except (PermissionError, OSError):
        return

    report.total_files += 1
    report.total_lines += len(lines)

    for lineno, line in enumerate(lines, start=1):
        for rule in applicable_rules:
            if rule["pattern"].search(line):
                report.findings.append(Finding(
                    rule_id=rule["id"],
                    severity=rule["severity"],
                    file=str(path),
                    line=lineno,
                    message=rule["message"],
                    snippet=line.strip()[:120],
                    fix=rule["fix"],
                ))

def scan_directory(root: str) -> AuditReport:
    report = AuditReport(scan_root=root)
    base = Path(root)

    for path in base.rglob("*"):
        if path.is_file() and not should_skip(path):
            scan_file(path, report)

    return report

# ─── Reporters ────────────────────────────────────────────────────────────────

SEV_COLOUR = {
    CRITICAL: RED,
    HIGH:     YELLOW,
    MEDIUM:   CYAN,
    LOW:      BLUE,
    INFO:     GREEN,
}

def print_terminal_report(report: AuditReport) -> None:
    print(f"\n{BOLD}{'═' * 60}{RESET}")
    print(f"{BOLD}  EventHive Security Audit — Kirov Dynamics Technology{RESET}")
    print(f"{'═' * 60}")
    print(f"  Scanned : {report.scan_root}")
    print(f"  At      : {report.scanned_at}")
    print(f"  Files   : {report.total_files:,}  |  Lines: {report.total_lines:,}")
    print(f"{'═' * 60}\n")

    if not report.findings:
        print(colour("  ✅  No issues found. Repository is clean.", GREEN))
    else:
        for f in report.findings:
            sev_col = SEV_COLOUR.get(f.severity, RESET)
            print(f"  {colour(f'[{f.severity}]', sev_col)} {colour(f.rule_id, BOLD)}")
            print(f"  File    : {f.file}:{f.line}")
            print(f"  Issue   : {f.message}")
            print(f"  Snippet : {colour(f.snippet, YELLOW)}")
            print(f"  Fix     : {f.fix}")
            print()

    status = colour("✅  PASSED", GREEN) if report.passed else colour("❌  FAILED", RED)
    print(f"\n  Result  : {status}")
    print(f"  Critical: {report.critical_count}  High: {report.high_count}  Total findings: {len(report.findings)}")
    print(f"{'═' * 60}\n")

def print_json_report(report: AuditReport) -> None:
    data = {
        "scanned_at": report.scanned_at,
        "scan_root": report.scan_root,
        "total_files": report.total_files,
        "total_lines": report.total_lines,
        "passed": report.passed,
        "summary": {
            "critical": report.critical_count,
            "high": report.high_count,
            "total": len(report.findings),
        },
        "findings": [asdict(f) for f in report.findings],
    }
    print(json.dumps(data, indent=2))

# ─── CLI ──────────────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(
        description="EventHive Security Audit Engine — Kirov Dynamics Technology"
    )
    parser.add_argument("--scan", metavar="PATH", help="Directory to scan", default=".")
    parser.add_argument("--report", choices=["terminal", "json"], default="terminal",
                        help="Output format (default: terminal)")
    args = parser.parse_args()

    scan_path = os.path.abspath(args.scan)
    if not os.path.isdir(scan_path):
        print(f"Error: '{scan_path}' is not a valid directory.", file=sys.stderr)
        sys.exit(1)

    report = scan_directory(scan_path)

    if args.report == "json":
        print_json_report(report)
    else:
        print_terminal_report(report)

    sys.exit(0 if report.passed else 1)

if __name__ == "__main__":
    main()
