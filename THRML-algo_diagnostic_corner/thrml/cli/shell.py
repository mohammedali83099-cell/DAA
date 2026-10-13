import os
import sys
import shlex
from cli.commands import CommandHandler
from cli.ui import print_startup, print_banner

class THRMLShell:
    def __init__(self):
        self.handler = CommandHandler()

    def run(self):
        print_startup()
        print_banner(len(self.handler.runner.history))

        while True:
            try:
                line = input("thrml> ").strip()
            except (EOFError, KeyboardInterrupt):
                print("\nExiting THRML Laboratory.")
                break

            if not line:
                continue

            parts = line.split(maxsplit=1)
            cmd = parts[0].lower()
            arg = parts[1] if len(parts) > 1 else ""

            if cmd in ["exit", "quit"]:
                print("Exiting THRML Laboratory.")
                break
            elif cmd in ["clear", "cls"]:
                os.system("clear" if os.name != "nt" else "cls")
                print_banner(len(self.handler.runner.history))
            elif cmd == "help":
                self.handler.cmd_help()
            elif cmd == "status":
                self.handler.cmd_status()
            elif cmd == "algorithms":
                self.handler.cmd_algorithms()
            elif cmd == "complexity":
                self.handler.cmd_complexity()
            elif cmd == "test":
                self.handler.cmd_test(arg)
            elif cmd == "compare":
                self.handler.cmd_compare(arg)
            elif cmd == "benchmark":
                self.handler.cmd_benchmark(arg)
            elif cmd in ["full-test", "full_test", "fulltest"]:
                self.handler.cmd_full_test()
            elif cmd == "demo":
                self.handler.cmd_demo()
            elif cmd == "report":
                self.handler.cmd_report()
            elif cmd == "history":
                self.handler.cmd_history(arg)
            else:
                print(f"Unknown command: '{cmd}'. Type 'help' for available commands.")
