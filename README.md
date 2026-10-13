# DAA — Design and Analysis of Algorithms

Repository containing implementations, stress-testing suites, benchmarks, and diagnostic laboratories for Design and Analysis of Algorithms (DAA).

---

## Projects in this Repository

### 1. [THRML: Algorithm Vulnerability & Stress-Testing Laboratory](THRML-algo_diagnostic_corner/USER_MANUAL.md)
Located in [`THRML-algo_diagnostic_corner/`](THRML-algo_diagnostic_corner/):
- **Core Concept**: An interactive, terminal-first laboratory for testing performance, memory consumption, scalability, and pathological edge cases of 13 syllabus algorithms.
- **Algorithms Covered**: Binomial Heap, Fibonacci Heap, B-Tree, Red-Black Tree, Prim's, Kruskal's, Fractional Knapsack, 0/1 Knapsack, Floyd-Warshall, Matrix Chain Multiplication, Hamiltonian Problem, N-Queen, and TSP.
- **Key Modules**: Input generators, empirical complexity analyzer, deterministic risk classifier (LOW, MODERATE, HIGH), and automated reporting.

#### Quick Start:
```bash
cd THRML-algo_diagnostic_corner/thrml
python3 main.py
```
For detailed usage, commands, and complexity references, see the [User Manual](THRML-algo_diagnostic_corner/USER_MANUAL.md).
