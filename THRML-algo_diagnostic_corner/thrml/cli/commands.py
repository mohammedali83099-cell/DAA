import sys
import time
from typing import List, Dict, Any
from benchmark.runner import BenchmarkRunner
from reports.exporter import ReportExporter
from cli.ui import (
    print_algorithm_selector, print_risk_assessment,
    print_complexity_table, render_ascii_graph, RICH_AVAILABLE
)

if RICH_AVAILABLE:
    from rich.console import Console
    from rich.table import Table
    console = Console()
else:
    console = None

class CommandHandler:
    def __init__(self):
        self.runner = BenchmarkRunner()
        self.exporter = ReportExporter()

    def cmd_help(self):
        print("""
===================================================================
                   T H R M L   C O M M A N D S                    
===================================================================
  help              Display this help manual
  status            Show laboratory status and experiment counts
  algorithms        List all 13 DAA syllabus algorithms
  test [algo]       Run stress/performance test for an algorithm
                    e.g. 'test floyd', 'test tsp', 'test nqueen',
                         'test knapsack', 'test matrix', 'test heaps',
                         'test trees', 'test mst'
  compare [cat]     Compare performance of algorithm pairs
                    e.g. 'compare mst', 'compare heaps',
                         'compare trees', 'compare knapsack'
  benchmark [algo]  Run multi-size benchmark graph for algorithm
  complexity        Display theoretical complexity explorer table
  full-test         Run full test suite across all 13 algorithms
  demo              Run a 5-7 minute automated laboratory tour
  report            Export text and CSV benchmark reports
  history [id]      View history of completed experiments
  clear             Clear terminal screen
  exit              Exit THRML Laboratory
===================================================================
""")

    def cmd_status(self):
        count = len(self.runner.history)
        print(f"\nLaboratory Status: ● READY")
        print(f"Algorithms Loaded: 13")
        print(f"Experiments Run:   {count}")
        print(f"Report Directory:  {self.exporter.output_dir}\n")

    def cmd_algorithms(self):
        print_algorithm_selector()

    def cmd_complexity(self):
        print_complexity_table()

    def cmd_test(self, target: str):
        target = target.lower().strip()
        if not target:
            print_algorithm_selector()
            return

        if target in ["floyd", "floyd-warshall", "9", "09"]:
            print("\n[FLOYD-WARSHALL STRESS LAB]")
            for v in [20, 50, 100, 150, 250]:
                res, risk = self.runner.run_floyd_benchmark(v)
                print_risk_assessment(risk, res)

        elif target in ["tsp", "13"]:
            print("\n[TRAVELLING SALESPERSON PROBLEM STRESS LAB]")
            print(f"{'Cities':<10} {'Search Space':<20} {'Runtime (ms)':<15} {'Risk':<10}")
            print("-" * 60)
            for c in [5, 8, 10, 12, 14]:
                res, risk = self.runner.run_tsp_benchmark(c)
                print(f"{c:<10} {res.input_size_repr:<20} {res.runtime_seconds * 1000:<15.2f} {risk.risk_level:<10}")

        elif target in ["nqueen", "nqueens", "12"]:
            print("\n[N-QUEEN STRESS LAB]")
            for n in [8, 10, 12, 14]:
                res, risk = self.runner.run_nqueen_benchmark(n)
                print_risk_assessment(risk, res)

        elif target in ["knapsack", "08", "07"]:
            print("\n[KNAPSACK COMPARISON LAB]")
            res1, risk1 = self.runner.run_knapsack_benchmark("Fractional Knapsack", 100, 500.0)
            res2, risk2 = self.runner.run_knapsack_benchmark("0/1 Knapsack", 100, 500)
            print_risk_assessment(risk1, res1)
            print_risk_assessment(risk2, res2)

        elif target in ["matrix", "mcm", "10"]:
            print("\n[MATRIX CHAIN MULTIPLICATION LAB]")
            for chain in [5, 10, 20, 40]:
                res, risk = self.runner.run_matrix_benchmark(chain)
                print_risk_assessment(risk, res)

        elif target in ["heaps", "heap", "01", "02"]:
            print("\n[HEAP STRESS LAB]")
            res1, risk1 = self.runner.run_heap_benchmark("Binomial Heap", 2000, "random")
            res2, risk2 = self.runner.run_heap_benchmark("Fibonacci Heap", 2000, "random")
            print_risk_assessment(risk1, res1)
            print_risk_assessment(risk2, res2)

        elif target in ["trees", "tree", "03", "04"]:
            print("\n[TREE STRESS LAB]")
            res1, risk1 = self.runner.run_tree_benchmark("B-Tree", 3000, "sorted")
            res2, risk2 = self.runner.run_tree_benchmark("Red-Black Tree", 3000, "sorted")
            print_risk_assessment(risk1, res1)
            print_risk_assessment(risk2, res2)

        elif target in ["mst", "05", "06"]:
            print("\n[MST STRESS LAB]")
            res1, risk1 = self.runner.run_mst_benchmark("Prim", 200, 0.2)
            res2, risk2 = self.runner.run_mst_benchmark("Kruskal", 200, 0.2)
            print_risk_assessment(risk1, res1)
            print_risk_assessment(risk2, res2)

        elif target in ["hamiltonian", "11"]:
            print("\n[HAMILTONIAN CYCLE LAB]")
            for v in [8, 12, 16, 20]:
                res, risk = self.runner.run_hamiltonian_benchmark(v, has_cycle=True)
                print_risk_assessment(risk, res)
        else:
            print(f"Unknown test target: '{target}'. Type 'test' to see all algorithms.")

    def cmd_compare(self, category: str):
        cat = category.lower().strip()
        if cat == "heaps":
            print("\n=== BINOMIAL vs FIBONACCI HEAP COMPARISON ===")
            print(f"{'Operation (N=5000)':<25} {'Binomial (ms)':<15} {'Fibonacci (ms)':<15}")
            print("-" * 58)
            b_res, _ = self.runner.run_heap_benchmark("Binomial Heap", 5000, "random")
            f_res, _ = self.runner.run_heap_benchmark("Fibonacci Heap", 5000, "random")
            print(f"{'Random Insert/Extract':<25} {b_res.runtime_seconds * 1000:<15.2f} {f_res.runtime_seconds * 1000:<15.2f}")

            print("\nTHEORETICAL COMPLEXITY TRADE-OFFS:")
            print("  Binomial Heap:  Insert O(1) amortized, Union O(log n), Extract-Min O(log n)")
            print("  Fibonacci Heap: Insert O(1) amortized, Union O(1), Decrease-Key O(1) amortized, Extract-Min O(log n) amortized")
            print("  OBSERVATION: Fibonacci heap has lower asymptotic bounds for decrease-key/union but higher constant factors in practice.")

        elif cat == "mst":
            print("\n=== PRIM vs KRUSKAL MST COMPARISON ===")
            print("\nGRAPH TYPE: SPARSE (Density 0.1)")
            print(f"{'Vertices':<12} {'Prim (ms)':<15} {'Kruskal (ms)':<15}")
            print("-" * 45)
            for v in [100, 250, 500]:
                p_res, _ = self.runner.run_mst_benchmark("Prim", v, density=0.1)
                k_res, _ = self.runner.run_mst_benchmark("Kruskal", v, density=0.1)
                print(f"{v:<12} {p_res.runtime_seconds * 1000:<15.2f} {k_res.runtime_seconds * 1000:<15.2f}")

            print("\nGRAPH TYPE: DENSE (Density 0.8)")
            print(f"{'Vertices':<12} {'Prim (ms)':<15} {'Kruskal (ms)':<15}")
            print("-" * 45)
            for v in [100, 250, 500]:
                p_res, _ = self.runner.run_mst_benchmark("Prim", v, density=0.8)
                k_res, _ = self.runner.run_mst_benchmark("Kruskal", v, density=0.8)
                print(f"{v:<12} {p_res.runtime_seconds * 1000:<15.2f} {k_res.runtime_seconds * 1000:<15.2f}")

            print("\nOBSERVATION: Kruskal excels on sparse graphs with edge sorting; Prim with adjacency list / heaps performs consistently well on dense graphs.")

        elif cat == "knapsack":
            print("\n=== GREEDY vs DYNAMIC PROGRAMMING KNAPSACK ===")
            print("Fractional Knapsack (Greedy): Divisible items, O(n log n) time, exact optimal for fractional.")
            print("0/1 Knapsack (DP): Indivisible items, O(n·W) pseudo-polynomial time.")
            res1, risk1 = self.runner.run_knapsack_benchmark("Fractional Knapsack", 200, 1000.0)
            res2, risk2 = self.runner.run_knapsack_benchmark("0/1 Knapsack", 200, 1000)
            print_risk_assessment(risk1, res1)
            print_risk_assessment(risk2, res2)

        elif cat == "trees":
            print("\n=== B-TREE vs RED-BLACK TREE COMPARISON ===")
            print("Testing Sequential Insertion (Pathological Sorted Input)")
            res1, risk1 = self.runner.run_tree_benchmark("B-Tree", 4000, "sorted")
            res2, risk2 = self.runner.run_tree_benchmark("Red-Black Tree", 4000, "sorted")
            print_risk_assessment(risk1, res1)
            print_risk_assessment(risk2, res2)
        else:
            print("Valid compare categories: 'heaps', 'mst', 'knapsack', 'trees'")

    def cmd_benchmark(self, algo: str):
        algo = algo.lower().strip()
        print(f"\n[BENCHMARK SCALABILITY GROWTH ENGINE: {algo.upper()}]")
        sizes = [20, 50, 100, 150, 200]
        times = []
        labels = []

        for s in sizes:
            if "floyd" in algo:
                res, _ = self.runner.run_floyd_benchmark(s)
            elif "matrix" in algo or "mcm" in algo:
                res, _ = self.runner.run_matrix_benchmark(s)
            elif "tsp" in algo:
                res, _ = self.runner.run_tsp_benchmark(min(s, 12))
            else:
                res, _ = self.runner.run_floyd_benchmark(s)
            times.append(res.runtime_seconds * 1000)
            labels.append(f"N={s}")

        render_ascii_graph(f"{algo.upper()} RUNTIME GROWTH (ms)", labels, times)

    def cmd_full_test(self):
        print("\n============================================================")
        print("          T H R M L   F U L L   L A B O R A T O R Y        ")
        print("============================================================")

        tests = [
            ("[1/13] Binomial Heap", lambda: self.runner.run_heap_benchmark("Binomial Heap", 1000)),
            ("[2/13] Fibonacci Heap", lambda: self.runner.run_heap_benchmark("Fibonacci Heap", 1000)),
            ("[3/13] B-Tree", lambda: self.runner.run_tree_benchmark("B-Tree", 1000)),
            ("[4/13] Red-Black Tree", lambda: self.runner.run_tree_benchmark("Red-Black Tree", 1000)),
            ("[5/13] Prim's Algorithm", lambda: self.runner.run_mst_benchmark("Prim", 150)),
            ("[6/13] Kruskal's Algorithm", lambda: self.runner.run_mst_benchmark("Kruskal", 150)),
            ("[7/13] Fractional Knapsack", lambda: self.runner.run_knapsack_benchmark("Fractional Knapsack", 100, 500)),
            ("[8/13] 0/1 Knapsack DP", lambda: self.runner.run_knapsack_benchmark("0/1 Knapsack", 100, 500)),
            ("[9/13] Floyd-Warshall", lambda: self.runner.run_floyd_benchmark(80)),
            ("[10/13] Matrix Chain DP", lambda: self.runner.run_matrix_benchmark(20)),
            ("[11/13] Hamiltonian Problem", lambda: self.runner.run_hamiltonian_benchmark(12)),
            ("[12/13] N-Queen Problem", lambda: self.runner.run_nqueen_benchmark(10)),
            ("[13/13] TSP Branch & Bound", lambda: self.runner.run_tsp_benchmark(10)),
        ]

        for label, fn in tests:
            print(f" {label:<35} ... ", end="", flush=True)
            res, risk = fn()
            status = "✓ TIMEOUT" if res.timed_out else "✓ OK"
            print(f"{status} (Risk: {risk.risk_level})")

        print("\n[LAB COMPLETE] Total 13 experiments completed and recorded.")

    def cmd_demo(self):
        print("\n============================================================")
        print("           T H R M L   D E M O N S T R A T I O N            ")
        print("============================================================")
        print("Running non-blocking automated DAA stress lab demonstration...\n")
        time.sleep(0.5)

        print("--> 1. Running Floyd-Warshall Cubic Scalability Test...")
        for v in [30, 60, 100]:
            res, risk = self.runner.run_floyd_benchmark(v)
            print(f"    V={v:<4} Runtime: {res.runtime_seconds*1000:6.2f} ms | Relaxations: {res.operations.relaxations:8,} | Risk: {risk.risk_level}")

        print("\n--> 2. Running N-Queens Search Space Explosion Test...")
        for n in [8, 10, 12]:
            res, risk = self.runner.run_nqueen_benchmark(n)
            print(f"    N={n:<4} Runtime: {res.runtime_seconds*1000:6.2f} ms | States: {res.operations.search_states:8,} | Risk: {risk.risk_level}")

        print("\n--> 3. Running TSP Branch & Bound Stress Test...")
        for c in [6, 9, 11]:
            res, risk = self.runner.run_tsp_benchmark(c)
            print(f"    Cities={c:<2} Runtime: {res.runtime_seconds*1000:6.2f} ms | States: {res.operations.search_states:8,} | Risk: {risk.risk_level}")

        print("\n--> 4. Comparing Prim vs Kruskal on Dense Graph (V=200)...")
        p_res, _ = self.runner.run_mst_benchmark("Prim", 200, 0.7)
        k_res, _ = self.runner.run_mst_benchmark("Kruskal", 200, 0.7)
        print(f"    Prim Time:    {p_res.runtime_seconds*1000:.2f} ms")
        print(f"    Kruskal Time: {k_res.runtime_seconds*1000:.2f} ms")

        print("\n--> 5. Generating Laboratory Summary Report...")
        txt_path = self.exporter.export_full_report(self.runner.history)
        print(f"    Report successfully exported to {txt_path}")
        print("\n[DEMO COMPLETE]")

    def cmd_report(self):
        if not self.runner.history:
            print("No experiments have been run yet. Run 'test', 'full-test', or 'demo' first.")
            return
        txt_path = self.exporter.export_full_report(self.runner.history)
        print(f"\n[REPORT GENERATED]")
        print(f"Summary Report: {txt_path}")
        print(f"CSV Data File:  {os.path.join(self.exporter.output_dir, 'benchmark_data.csv')}\n")

    def cmd_history(self, exp_id_str: str = ""):
        if not self.runner.history:
            print("No experiment history available.")
            return

        if exp_id_str.strip().isdigit():
            idx = int(exp_id_str.strip()) - 1
            if 0 <= idx < len(self.runner.history):
                res, risk = self.runner.history[idx]
                print_risk_assessment(risk, res)
            else:
                print(f"Invalid experiment ID. Total available: {len(self.runner.history)}")
            return

        print(f"\n{'ID':<4} {'Algorithm':<30} {'Input Size':<15} {'Time (ms)':<12} {'Risk':<10}")
        print("-" * 75)
        for i, (res, rsk) in enumerate(self.runner.history, 1):
            print(f"{i:03d}  {res.algorithm_name:<30} {res.input_n:<15} {res.runtime_seconds * 1000:<12.2f} {rsk.risk_level:<10}")
        print(f"\nType 'history <id>' to inspect a specific experiment.\n")
