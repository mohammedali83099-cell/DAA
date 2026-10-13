import sys
import time
from typing import List, Dict, Any, Tuple
from algorithms.base import MetricResult
from risk.classifier import RiskAssessment
from benchmark.complexity import COMPLEXITY_TABLE

try:
    from rich.console import Console
    from rich.panel import Panel
    from rich.table import Table
    from rich.progress import Progress, SpinnerColumn, TextColumn, BarColumn, TimeRemainingColumn
    from rich.text import Text
    from rich.style import Style
    RICH_AVAILABLE = True
    console = Console()
except ImportError:
    RICH_AVAILABLE = False
    console = None

def print_startup():
    if RICH_AVAILABLE:
        console.print("[dim]Initializing THRML...[/dim]\n")
        time.sleep(0.1)
        steps = [
            ("Loading algorithm modules", "✓"),
            ("Loading test generators", "✓"),
            ("Loading benchmark engine", "✓"),
            ("Loading risk classifier", "✓"),
            ("Loading reporting engine", "✓")
        ]
        for name, status in steps:
            console.print(f" {name:<30} [bold green]{status}[/bold green]")
            time.sleep(0.05)
        console.print("\n[bold green]THRML LABORATORY READY[/bold green]\n")
    else:
        print("Initializing THRML...\n")
        print(" Loading algorithm modules       ✓")
        print(" Loading test generators         ✓")
        print(" Loading benchmark engine        ✓")
        print(" Loading risk classifier         ✓")
        print(" Loading reporting engine        ✓\n")
        print("THRML LABORATORY READY\n")

def print_banner(num_experiments: int = 0):
    banner_text = """
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║              T H R M L   L A B O R A T O R Y              ║
║                                                            ║
║       DAA Algorithm Vulnerability & Stress Testing        ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
"""
    if RICH_AVAILABLE:
        console.print(Panel(
            Text(banner_text, style="cyan bold"),
            border_style="cyan"
        ))
        console.print(" [cyan]Algorithms available:[/cyan] 13")
        console.print(" [cyan]Test families:[/cyan]        6")
        console.print(f" [cyan]Experiments:[/cyan]          {num_experiments}")
        console.print(" [cyan]Laboratory status:[/cyan]    [green]● READY[/green]\n")
        console.print(" Type [bold yellow]'help'[/bold yellow] for commands.\n")
    else:
        print(banner_text)
        print(" Algorithms available: 13")
        print(" Test families:        6")
        print(f" Experiments:          {num_experiments}")
        print(" Laboratory status:    ● READY\n")
        print(" Type 'help' for commands.\n")

def print_algorithm_selector():
    if RICH_AVAILABLE:
        table = Table(title="SELECT ALGORITHM", border_style="cyan", header_style="bold magenta")
        table.add_column("ID", style="bold yellow", width=4)
        table.add_column("Algorithm Name", style="bold white", width=35)
        table.add_column("Category", style="dim cyan", width=30)

        algos = [
            ("01", "Binomial Heap", "Advanced Data Structures"),
            ("02", "Fibonacci Heap", "Advanced Data Structures"),
            ("03", "B-Tree", "Advanced Data Structures"),
            ("04", "Red-Black Tree", "Advanced Data Structures"),
            ("05", "Prim's Algorithm", "Minimum Spanning Tree"),
            ("06", "Kruskal's Algorithm", "Minimum Spanning Tree"),
            ("07", "Fractional Knapsack", "Greedy"),
            ("08", "0/1 Knapsack", "Dynamic Programming"),
            ("09", "Floyd-Warshall", "Dynamic Programming"),
            ("10", "Matrix Chain Multiplication", "Dynamic Programming"),
            ("11", "Hamiltonian Problem", "Backtracking / Branch & Bound"),
            ("12", "N-Queen", "Backtracking / Branch & Bound"),
            ("13", "Travelling Salesperson Problem", "Backtracking / Branch & Bound"),
        ]

        for aid, name, cat in algos:
            table.add_row(aid, name, cat)

        console.print(table)
    else:
        print("""
╭──────────────────────────────────────────────────────────╮
│ SELECT ALGORITHM                                         │
├──────────────────────────────────────────────────────────┤
│ 01  Binomial Heap                                        │
│ 02  Fibonacci Heap                                       │
│ 03  B-Tree                                                │
│ 04  Red-Black Tree                                        │
│ 05  Prim's Algorithm                                      │
│ 06  Kruskal's Algorithm                                   │
│ 07  Fractional Knapsack                                   │
│ 08  0/1 Knapsack                                          │
│ 09  Floyd-Warshall                                        │
│ 10  Matrix Chain Multiplication                           │
│ 11  Hamiltonian Problem                                   │
│ 12  N-Queen                                                │
│ 13  Travelling Salesperson Problem                         │
╰──────────────────────────────────────────────────────────╯
""")

def print_risk_assessment(risk: RiskAssessment, result: MetricResult):
    risk_color = "green" if risk.risk_level == "LOW" else ("yellow" if risk.risk_level == "MODERATE" else "bold red")

    if RICH_AVAILABLE:
        grid = Table.grid(expand=True)
        grid.add_column()
        grid.add_row(f"[bold white]Algorithm:[/bold white]      {risk.algorithm_name}")
        grid.add_row(f"[bold white]Input:[/bold white]          {risk.input_size_repr}")
        grid.add_row(f"[bold white]Execution Time:[/bold white] {result.runtime_seconds * 1000:.3f} ms")
        grid.add_row(f"[bold white]Memory Usage:[/bold white]   {result.memory_bytes / 1024:.2f} KB")
        grid.add_row(f"[bold white]Total Ops:[/bold white]      {result.operations.total_operations():,}")
        grid.add_row("")
        grid.add_row(f"[bold white]Runtime Growth:[/bold white]  {risk.runtime_growth}")
        grid.add_row(f"[bold white]Memory Growth:[/bold white]   {risk.memory_growth}")
        grid.add_row(f"[bold white]Scalability Risk:[/bold white]{risk.scalability_risk}")
        grid.add_row("")
        grid.add_row(f"[bold white]RISK LEVEL:[/bold white]       [{risk_color}]{risk.risk_level}[/{risk_color}]")
        grid.add_row("")
        grid.add_row(f"[dim]Reason: {risk.reason}[/dim]")

        console.print(Panel(grid, title="[bold cyan]THRML RISK ASSESSMENT[/bold cyan]", border_style=risk_color))
    else:
        print(f"""
╭──────────────────────────────────────────────────────────╮
│ THRML RISK ASSESSMENT                                    │
├──────────────────────────────────────────────────────────┤
│ Algorithm:        {risk.algorithm_name:<38} │
│ Input:            {risk.input_size_repr:<38} │
│ Execution Time:   {result.runtime_seconds * 1000:.3f} ms
│ Peak Memory:      {result.memory_bytes / 1024:.2f} KB
│ Total Operations: {result.operations.total_operations():,}
│                                                          │
│ Runtime Growth:   {risk.runtime_growth:<38} │
│ Memory Growth:    {risk.memory_growth:<38} │
│ Scalability Risk: {risk.scalability_risk:<38} │
│                                                          │
│ OVERALL RISK:     {risk.risk_level:<38} │
│                                                          │
│ Reason: {risk.reason}
╰──────────────────────────────────────────────────────────╯
""")

def print_complexity_table():
    if RICH_AVAILABLE:
        table = Table(title="COMPLEXITY EXPLORER", border_style="magenta", header_style="bold yellow")
        table.add_column("Algorithm / Problem", style="bold white", width=30)
        table.add_column("Category", style="cyan", width=25)
        table.add_column("Time Complexity", style="green", width=25)
        table.add_column("Space", style="yellow", width=12)
        table.add_column("Classification", style="bold magenta", width=28)

        for name, info in COMPLEXITY_TABLE.items():
            time_comp = info.get("time") or info.get("time_insert", "O(log n)")
            table.add_row(
                name,
                info.get("category", ""),
                time_comp,
                info.get("space", ""),
                info.get("problem_class", "")
            )

        console.print(table)
    else:
        print(f"{'ALGORITHM':<30} {'TIME':<25} {'CLASSIFICATION':<30}")
        print("-" * 85)
        for name, info in COMPLEXITY_TABLE.items():
            time_comp = info.get("time") or info.get("time_insert", "O(log n)")
            print(f"{name:<30} {time_comp:<25} {info.get('problem_class', ''):<30}")

def render_ascii_graph(title: str, labels: List[str], values: List[float]):
    if not values:
        return
    max_val = max(values) if max(values) > 0 else 1.0
    bar_max_len = 35

    print(f"\n--- {title} ---")
    for lbl, val in zip(labels, values):
        bar_len = int((val / max_val) * bar_max_len)
        bar = "█" * max(1, bar_len) if val > 0 else "."
        print(f"{lbl:<12} | {bar:<36} ({val:.3f} ms)")
    print()
