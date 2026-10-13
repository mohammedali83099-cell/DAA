# THRML — DAA Algorithm Vulnerability & Stress-Testing Laboratory

**THRML** is an interactive, terminal-first laboratory application for testing the performance, scalability, memory consumption, operation counts, and pathological behaviors of data structures and algorithms from a Design and Analysis of Algorithms (DAA) syllabus.

---

## 1. Problem Statement

Most algorithms perform well on small or random inputs. However, in modern computing environments, algorithms often encounter:
- **Pathological input distributions** (e.g. pre-sorted data into unbalanced binary trees).
- **Scale explosion** (e.g. cubic graph algorithms or factorial search space in NP-Hard optimization).
- **Memory & cache locality pressure** (e.g. large dynamic programming matrices or cascading heap cuts).

When an algorithm encounters these workloads, execution time and memory growth can degrade system responsiveness or cause resource exhaustion. THRML addresses a core question:

> **"Under what input or workload conditions does a DAA algorithm become slow, resource-intensive, or impractical?"**

---

## 2. Solution: THRML Framework

THRML acts as an interactive laboratory console that systematically generates work-stressing inputs, runs algorithms under metric hooks (`time`, `tracemalloc`, operation counters), compares empirical growth against theoretical asymptotic bounds, and classifies performance risk into **LOW**, **MODERATE**, or **HIGH**.

---

## 3. Architecture

```text
       ┌────────────────────────┐
       │   INPUT GENERATOR      │
       │ (Normal/Pathological) │
       └───────────┬────────────┘
                   │
                   ▼
       ┌────────────────────────┐
       │      ALGORITHM         │
       │ (Instrumented Modules) │
       └───────────┬────────────┘
                   │
                   ▼
       ┌────────────────────────┐
       │    METRICS ENGINE      │
       │ (Time/Mem/Ops/States)  │
       └───────────┬────────────┘
                   │
                   ▼
       ┌────────────────────────┐
       │  COMPLEXITY ANALYZER   │
       │ (Theoretical/Empirical)│
       └───────────┬────────────┘
                   │
                   ▼
       ┌────────────────────────┐
       │    RISK CLASSIFIER     │
       │ (LOW / MODERATE / HIGH)│
       └───────────┬────────────┘
                   │
                   ▼
       ┌────────────────────────┐
       │     REPORT ENGINE      │
       │ (Console / Text / CSV) │
       └────────────────────────┘
```

---

## 4. Mandatory Syllabus Algorithms Implemented (13 Total)

### Advanced Data Structures
1. **Binomial Heap**: Forest of binomial trees ($B_k$). Supports `insert`, `extract_min`, `decrease_key`, `merge`, `delete`. Operation counts track tree merges and key comparisons.
2. **Fibonacci Heap**: Lazy tree structure with min-pointer. Supports $O(1)$ amortized `insert` and `decrease_key`, $O(\log n)$ `extract_min`, cascading cuts, and root list consolidation.
3. **B-Tree**: Self-balancing search tree of degree $t$. Tracks node splits, search key comparisons, and tree height.
4. **Red-Black Tree**: Self-balancing BST with Red/Black properties. Tracks left/right rotations, node recolorings, and tree height.

### Minimum Spanning Tree (MST)
5. **Prim's Algorithm**: Priority-queue based greedy graph traversal. Measures vertex visits, edge relaxations, and min-heap operations.
6. **Kruskal's Algorithm**: Disjoint Set Union (DSU) with path compression and rank. Measures edge sorting comparisons and union/find calls.

### Greedy
7. **Fractional Knapsack**: Greedy ratio sorting ($v_i / w_i$). Demonstrates optimal divisible item selection in $O(n \log n)$ time.

### Dynamic Programming
8. **0/1 Knapsack**: 2D/1D DP table. Demonstrates exact indivisible item optimization in $O(n \cdot W)$ pseudo-polynomial time.
9. **Floyd-Warshall**: All-pairs shortest path $O(V^3)$ algorithm. Measures matrix updates and triple loop relaxations.
10. **Matrix Chain Multiplication (MCM)**: Dynamic programming table $O(n^3)$ calculating optimal matrix multiplication parenthesization and scalar multiplication counts.

### Backtracking / Branch and Bound
11. **Hamiltonian Problem**: Backtracking search for a graph cycle visiting every vertex once. Tracks search states, branches, backtracks, and safe timeouts.
12. **N-Queen Problem**: Backtracking board placement algorithm for $N$ non-attacking queens. Tracks board state checks, valid placements, and backtracks.
13. **Travelling Salesperson Problem (TSP)**: Exact Branch & Bound / Backtracking search for the minimum distance tour. Tracks generated states, pruned branches, and optimal tour bounds.

---

## 5. Time & Space Complexity Reference

| Algorithm | Category | Time Complexity | Space Complexity | Complexity Classification |
|---|---|---|---|---|
| **Binomial Heap** | Advanced Data Structures | $O(\log n)$ | $O(n)$ | Polynomial |
| **Fibonacci Heap** | Advanced Data Structures | $O(1)$ amortized insert, $O(\log n)$ extract-min | $O(n)$ | Polynomial |
| **B-Tree** | Advanced Data Structures | $O(\log n)$ | $O(n)$ | Polynomial |
| **Red-Black Tree** | Advanced Data Structures | $O(\log n)$ | $O(n)$ | Polynomial |
| **Prim's Algorithm** | Minimum Spanning Tree | $O(E \log V)$ | $O(V + E)$ | Polynomial |
| **Kruskal's Algorithm** | Minimum Spanning Tree | $O(E \log V)$ | $O(V + E)$ | Polynomial |
| **Fractional Knapsack** | Greedy | $O(n \log n)$ | $O(n)$ | Polynomial |
| **0/1 Knapsack** | Dynamic Programming | $O(n \cdot W)$ | $O(n \cdot W)$ | Pseudo-Polynomial (NP-Complete decision) |
| **Floyd-Warshall** | Dynamic Programming | $O(V^3)$ | $O(V^2)$ | Polynomial (Cubic) |
| **Matrix Chain DP** | Dynamic Programming | $O(n^3)$ | $O(n^2)$ | Polynomial (Cubic) |
| **Hamiltonian Problem** | Backtracking / Branch & Bound | $O(2^n \cdot n^2)$ | $O(n)$ | Exponential / NP-Complete |
| **N-Queen** | Backtracking / Branch & Bound | $O(N!)$ worst-case | $O(N)$ | Exponential / Factorial |
| **TSP Optimization** | Backtracking / Branch & Bound | $O(n! / 2^n)$ | $O(n)$ | NP-Hard |

---

## 6. Test Families

THRML generates 6 distinct test workloads:
- **NORMAL**: Average-case random structures.
- **LARGE**: High-scale inputs for scalability testing.
- **PATHOLOGICAL / WORST**: Inputs structured to trigger worst-case behavior (sorted sequence insertions into trees, dense complete graphs, high capacity $W$).
- **BOUNDARY**: Edge cases (minimal sizes, empty inputs, capacity 0).
- **STRUCTURED**: Sparse vs dense graphs, duplicate-heavy sequences.
- **SCALABILITY**: Automated growing size sequences $[n_1, n_2, n_3, \dots]$ computing empirical growth exponent $k = \frac{\log(T_2 / T_1)}{\log(N_2 / N_1)}$.

---

## 7. Deterministic Risk Classification Model

After each experiment, THRML evaluates performance metrics against explicit criteria:

- **LOW**: Execution time $< 0.1\text{s}$, memory $< 20\text{MB}$, empirical scaling within practical polynomial limits.
- **MODERATE**: Execution time $0.1\text{s} - 1.0\text{s}$, memory $20\text{MB} - 100\text{MB}$, or cubic growth detected (e.g. Floyd-Warshall $V \ge 60$).
- **HIGH**: Execution time $> 1.0\text{s}$, `TIMEOUT` safety limit triggered ($> 2.0\text{s}$), memory $> 100\text{MB}$, or exponential search space explosion (TSP, N-Queen, Hamiltonian).

---

## 8. Installation & Execution on macOS

### Prerequisites
- macOS Terminal (Zsh or Bash)
- Python 3.8+

### Setup Instructions

1. Clone the repository and navigate into the directory:
   ```bash
   cd thrml
   ```

2. Run the installer:
   ```bash
   ./install.sh
   ```

3. Launch THRML:
   ```bash
   python3 main.py
   ```
   Or using the executable helper:
   ```bash
   ./thrml.sh
   ```

---

## 9. Typical Interactive Commands

```text
thrml> help               # Show available commands
thrml> algorithms         # List all 13 algorithms grouped by category
thrml> test floyd         # Run Floyd-Warshall cubic stress test
thrml> test tsp           # Run Travelling Salesperson search space stress test
thrml> compare mst        # Compare Prim vs Kruskal on sparse & dense graphs
thrml> compare heaps      # Compare Binomial vs Fibonacci heap operation metrics
thrml> benchmark floyd    # Run multi-size scalability graph for Floyd-Warshall
thrml> complexity         # Open Complexity Explorer table
thrml> full-test          # Execute automated suite across all 13 algorithms
thrml> demo               # Launch 5-minute automated demonstration tour
thrml> report             # Export text and CSV laboratory reports
thrml> history            # View history of executed experiments
thrml> exit               # Exit THRML
```

---

## 10. Automated Demonstration

To run the automated non-blocking demonstration tour directly from the command line:

```bash
python3 main.py --demo
```

---

## 11. Experimental Limitations & Safety

- **Safety Timeouts**: Backtracking algorithms (TSP, N-Queen, Hamiltonian) employ a maximum execution timeout (2.0s - 3.0s per step). If the search space exceeds this limit, `TIMEOUT` is reported as a valid stress metric without freezing the machine.
- **Hardware Variation**: Execution timing measures CPU wall time using high-resolution timers (`time.perf_counter()`). Actual millisecond values vary across system hardware.
