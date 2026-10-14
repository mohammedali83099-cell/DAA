# DAA — Algorithm Vulnerability & Stress-Testing Framework (THRML)

An interactive software assurance and stress-testing platform designed to expose worst-case performance, pathological input degradation, and scalability bottlenecks across core Design and Analysis of Algorithms (DAA) syllabus algorithms.

---

## What This Is Made For

In academic and production environments, algorithm evaluation is typically limited to functional correctness on small, well-behaved inputs. This platform is built for **software assurance**—providing empirical evidence on how algorithms behave under extreme stress across all mandatory syllabus categories:

1. **Advanced Data Structures**: Binomial Heap, Fibonacci Heap, B-Tree, Red-Black Tree.
2. **Minimum Spanning Tree (MST)**: Prim's Algorithm vs. Kruskal's Algorithm across varying graph densities.
3. **Knapsack Optimization**: Fractional Knapsack (Greedy) vs. 0/1 Knapsack (Dynamic Programming).
4. **Dynamic Programming**: Floyd-Warshall ($O(V^3)$) and Matrix Chain Multiplication ($O(n^3)$).
5. **Backtracking & Branch-and-Bound**: N-Queen, Travelling Salesperson Problem (TSP), and Hamiltonian Cycle.
6. **Complexity Classification**: Distinguishing decision vs. optimization formulations, validating $P$, $NP\text{-Complete}$, and $NP\text{-Hard}$ bounds, and classifying operational risk into **LOW**, **MODERATE**, or **HIGH**.

---

## What Problem It Solves

Standard unit tests cannot answer the question:
> *"Under what input or workload conditions does an algorithm become slow, memory-intensive, or practically infeasible?"*

THRML addresses this by:
- **Exposing Pathological Inputs**: Automatically generating adversarial distributions (e.g., pre-sorted insertions into search trees, dense complete graphs, high knapsack capacity $W$).
- **Deep Internal Telemetry**: Counting internal algorithm mechanics (node rotations, tree splits, relaxations, comparisons, generated states vs. pruned branches) rather than relying solely on wall-clock time.
- **Empirical Complexity Fitting**: Calculating the empirical scaling exponent $k$ where $T(n) \propto n^k$ to prove whether observed degradation matches theoretical cubic ($O(V^3)$) or exponential ($O(2^n)$) bounds.
- **State-Space Tree X-Ray**: Tracking combinatorial explosion and branch-and-bound pruning efficiency with built-in safety timeout interceptors.
- **Deterministic Risk Output**: Providing automated, rule-based risk classifications (**LOW**, **MODERATE**, **HIGH**) with plain-language assurance justifications.

---

## Codebase Architecture

```text
DAA/
├── README.md                              # Repository overview and documentation
├── .gitignore                             # Python, node, and OS artifact exclusions
└── THRML-algo_diagnostic_corner/
    ├── USER_MANUAL.md                     # Comprehensive operational guide & CLI reference
    ├── launch_web.bat                     # Windows 1-click Web UI launcher
    ├── launch_web.sh                      # macOS / Linux 1-click Web UI launcher
    ├── reports/                           # Exported CSV and text audit reports
    │   ├── benchmark_data.csv
    │   └── full_report.txt
    ├── thrml/                             # Core Python diagnostic engine & REST API
    │   ├── main.py                        # Terminal CLI entrypoint (UTF-8 safe)
    │   ├── api_server.py                  # Flask REST API bridge & static web server
    │   ├── install.sh / thrml.sh          # Shell installation & execution scripts
    │   ├── setup.py                       # Python package configuration
    │   ├── algorithms/                    # 13 instrumented syllabus algorithms
    │   │   ├── base.py                    # BaseAlgorithm & OperationCounters contract
    │   │   ├── heaps/                     # Binomial Heap & Fibonacci Heap
    │   │   ├── trees/                     # B-Tree & Red-Black Tree
    │   │   ├── mst/                       # Prim's & Kruskal's MST algorithms
    │   │   ├── greedy/                    # Fractional Knapsack
    │   │   ├── dynamic_programming/       # 0/1 Knapsack, Floyd-Warshall, Matrix Chain
    │   │   └── backtracking/              # Hamiltonian Cycle, N-Queen, TSP
    │   ├── benchmark/                     # Runner, metrics, and complexity analyzer
    │   │   ├── runner.py                  # Test execution, tracemalloc, & timeout guards
    │   │   ├── complexity.py              # Theoretical table & empirical exponent formula
    │   │   └── metrics.py                 # Telemetry dataclasses
    │   ├── generators/                    # Workload & pathological input generators
    │   │   ├── pathological_generator.py  # Sorted, reverse, & duplicate key sequences
    │   │   ├── graph_generator.py         # Sparse to dense weighted graphs
    │   │   ├── knapsack_generator.py      # Paired items & capacity stress workloads
    │   │   └── matrix_generator.py        # Matrix dimension chains
    │   ├── risk/                          # Deterministic risk classification engine
    │   │   └── classifier.py              # LOW / MODERATE / HIGH risk decision logic
    │   ├── reports/                       # Exporter for CSV and formatted text reports
    │   │   └── exporter.py
    │   ├── cli/                           # Interactive terminal REPL & ANSI UI
    │   │   ├── shell.py
    │   │   ├── commands.py
    │   │   └── ui.py
    │   └── tests/                         # Verification test suites across algorithm families
    └── web/                               # React + TypeScript Web Laboratory
        ├── index.html                     # Web entrypoint
        ├── vite.config.ts                 # Vite bundler & API proxy configuration
        ├── package.json                   # Dependencies (React, Recharts, Lucide-React)
        └── src/
            ├── App.tsx                    # Main application controller & tab router
            ├── index.css                  # Nordic Slate & Deep Marine design system
            ├── types/                     # Strong TypeScript domain interfaces
            ├── services/                  # REST API client
            └── components/                # Modular diagnostic views
                ├── Navbar.tsx             # Header, status pill, and navigation
                ├── DashboardView.tsx      # System overview & 3-column telemetry strip
                ├── AlgorithmLabView.tsx   # Hero stability index & workload tuning
                ├── ComparativeArenaView.tsx # MST & Knapsack dual-density comparisons
                ├── ComplexityView.tsx     # Theoretical matrix & asymptotic curve fitter
                ├── BacktrackingView.tsx   # States generated vs. pruned branch explorer
                ├── ReportsView.tsx        # Experiment ledger & export center
                └── RiskBadge.tsx          # Status dot risk pill badge
```

---

## Quick Start

### Option 1: Web Dashboard (Nordic Slate & Deep Marine UI)
```bash
# Windows
THRML-algo_diagnostic_corner\launch_web.bat

# macOS / Linux
./THRML-algo_diagnostic_corner/launch_web.sh

# Or directly:
python THRML-algo_diagnostic_corner/thrml/api_server.py
```
Open **http://localhost:5000** in your browser.

### Option 2: Interactive Terminal Laboratory (CLI)
```bash
cd THRML-algo_diagnostic_corner/thrml
python main.py
```
Run `help` inside the interactive shell or pass command-line flags (e.g. `python main.py --test floyd`, `python main.py --demo`).
