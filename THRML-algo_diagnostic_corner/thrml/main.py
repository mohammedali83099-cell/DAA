#!/usr/bin/env python3
import sys
import os
import argparse

if sys.platform == "win32":
    import io
    if hasattr(sys.stdout, 'buffer'):
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    if hasattr(sys.stderr, 'buffer'):
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

from cli.shell import THRMLShell
from cli.commands import CommandHandler

def main():
    parser = argparse.ArgumentParser(description="THRML — DAA Algorithm Vulnerability & Stress-Testing Laboratory")
    parser.add_argument("--demo", action="store_true", help="Run automated laboratory demonstration and exit")
    parser.add_argument("--full-test", action="store_true", help="Run full test suite across all 13 algorithms and exit")
    parser.add_argument("--test", type=str, help="Run test for a specific algorithm e.g. floyd, tsp, mst")
    args = parser.parse_args()

    handler = CommandHandler()

    if args.demo:
        handler.cmd_demo()
        sys.exit(0)
    elif args.full_test:
        handler.cmd_full_test()
        sys.exit(0)
    elif args.test:
        handler.cmd_test(args.test)
        sys.exit(0)

    shell = THRMLShell()
    shell.run()

if __name__ == "__main__":
    main()
