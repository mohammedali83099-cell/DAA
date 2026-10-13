# THRML — USER MANUAL & OPERATING GUIDE

Welcome to **THRML: DAA Algorithm Vulnerability & Stress-Testing Laboratory**.

This user manual provides step-by-step instructions on how to install, launch, configure, and execute stress-testing experiments using THRML on macOS.

---

## TABLE OF CONTENTS

1. [Quick Start & Launch Guide](#1-quick-start--launch-guide)
2. [Interactive Shell Commands](#2-interactive-shell-commands)
3. [Algorithm Catalog (13 Syllabus Algorithms)](#3-algorithm-catalog)
4. [Running Stress Tests & Comparisons](#4-running-stress-tests--comparisons)
5. [Understanding Risk Classification (LOW, MODERATE, HIGH)](#5-understanding-risk-classification)
6. [Complexity Explorer](#6-complexity-explorer)
7. [Generating & Exporting Reports](#7-generating--exporting-reports)
8. [Automated Demonstration Mode](#8-automated-demonstration-mode)
9. [Troubleshooting & FAQs](#9-troubleshooting--faqs)

---

## 1. QUICK START & LAUNCH GUIDE

### Step 1: Open Terminal and Navigate to Project
Open your macOS Terminal application and change to the THRML repository folder:

```bash
cd /Users/mohammadsaalim/Documents/GitHub/thrml
```

### Step 2: Run the Installer (One-time Setup)
Run the automated installation script:

```bash
./install.sh
```

### Step 3: Launch THRML

You can launch THRML in interactive laboratory mode:

```bash
python3 main.py
```
*(or `./thrml.sh`)*

You will see the startup initialization sequence followed by the interactive shell prompt:

```text
Initializing THRML...

 Loading algorithm modules       ✓
 Loading test generators         ✓
 Loading benchmark engine        ✓
 Loading risk classifier         ✓
 Loading reporting engine        ✓

THRML LABORATORY READY

╔════════════════════════════════════════════════════════════╗
║                                                            ║
║              T H R M L   L A B O R A T O R Y              ║
║                                                            ║
║       DAA Algorithm Vulnerability & Stress Testing        ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

 Algorithms available: 13
 Test families:        6
 Experiments:          0
 Laboratory status:    ● READY

 Type 'help' for commands.

 thrml> _
```

---

## 2. INTERACTIVE SHELL COMMANDS

Once inside the `thrml> ` prompt, you can use the following commands:

| Command | Description | Example |
|---|---|---|
| `help` | Display command manual | `help` |
| `status` | Show laboratory status, algorithms loaded, and total experiments run | `status` |
| `algorithms` | Display all 13 algorithms grouped by category | `algorithms` |
| `test <algo>` | Run stress and scalability test for an algorithm or category | `test floyd`, `test tsp`, `test nqueen`, `test knapsack` |
| `compare <cat>` | Run side-by-side performance comparison for algorithm pairs | `compare mst`, `compare heaps`, `compare trees` |
| `benchmark <algo>` | Run multi-scale benchmark and display ASCII runtime growth graph | `benchmark floyd` |
| `complexity` | Open Complexity Explorer table showing theoretical time/space bounds | `complexity` |
| `full-test` | Run automated test suite across all 13 syllabus algorithms | `full-test` |
| `demo` | Run 5-minute automated laboratory demonstration tour | `demo` |
| `report` | Generate text report (`full_report.txt`) and CSV export (`benchmark_data.csv`) | `report` |
| `history` | List all completed experiments | `history` |
| `history <id>` | Inspect detailed risk assessment for experiment ID | `history 002` |
| `clear` | Clear terminal screen | `clear` |
| `exit` | Exit THRML console | `exit` |

---

## 3. ALGORITHM CATALOG

THRML implements instrumented versions of all 13 mandatory DAA syllabus algorithms:

```text
╭──────────────────────────────────────────────────────────╮
│ SELECT ALGORITHM                                         │
├──────────────────────────────────────────────────────────┤
│ 01  Binomial Heap          [Advanced Data Structures]     │
│ 02  Fibonacci Heap         [Advanced Data Structures]     │
│ 03  B-Tree                 [Advanced Data Structures]     │
│ 04  Red-Black Tree         [Advanced Data Structures]     │
│ 05  Prim's Algorithm       [Minimum Spanning Tree]        │
│ 06  Kruskal's Algorithm    [Minimum Spanning Tree]        │
│ 07  Fractional Knapsack    [Greedy]                       │
│ 08  0/1 Knapsack           [Dynamic Programming]          │
│ 09  Floyd-Warshall         [Dynamic Programming]          │
│ 10  Matrix Chain DP        [Dynamic Programming]          │
│ 11  Hamiltonian Problem    [Backtracking / Branch & Bound]│
│ 12  N-Queen                [Backtracking / Branch & Bound]│
│ 13  Travelling Salesperson [Backtracking / Branch & Bound]│
╰──────────────────────────────────────────────────────────╯
```

---

## 4. RUNNING STRESS TESTS & COMPARISONS

### Testing Cubic Growth: Floyd-Warshall
To observe how $O(V^3)$ cubic growth affects computation as graph size scales:

```text
thrml> test floyd
```

### Testing Exponential Search Space: TSP & N-Queen
To test how backtracking algorithms handle exponential/factorial state growth:

```text
thrml> test tsp
thrml> test nqueen
```

### Comparing Minimum Spanning Tree Algorithms: Prim vs Kruskal
To compare performance on sparse vs dense graphs:

```text
thrml> compare mst
```

### Comparing Heaps: Binomial vs Fibonacci Heap
To compare decrease-key, extract-min, and merge operations:

```text
thrml> compare heaps
```

---

## 5. UNDERSTANDING RISK CLASSIFICATION

After every experiment, THRML classifies the observed behavior into three risk levels:

- **LOW (Green)**: The algorithm stays within fast runtime ($< 0.1\text{s}$) and reasonable memory ($< 20\text{MB}$) with predictable growth.
- **MODERATE (Yellow)**: Runtime reaches $0.1\text{s} - 1.0\text{s}$, memory reaches $20\text{MB} - 100\text{MB}$, or noticeable polynomial growth curve appears (e.g. Floyd-Warshall $V \ge 60$).
- **HIGH (Red)**: Execution time exceeds $1.0\text{s}$, safety `TIMEOUT` limit triggers ($> 2.0\text{s}$ limit), memory $> 100\text{MB}$, or exponential search space explosion occurs.

Example Assessment Output:
```text
╭──────────────────────────────────────────────────────────╮
│ THRML RISK ASSESSMENT                                    │
├──────────────────────────────────────────────────────────┤
│ Algorithm:        Floyd-Warshall                         │
│ Input:            V=100 vertices (V³=1,000,000)          │
│ Execution Time:   1831.22 ms                             │
│ Peak Memory:      142.50 KB                              │
│ Total Operations: 51,780                                 │
│                                                          │
│ Runtime Growth:   HIGH                                   │
│ Memory Growth:    LOW                                    │
│ Scalability Risk: HIGH                                   │
│                                                          │
│ OVERALL RISK:     HIGH                                   │
│                                                          │
│ Reason: Cubic time complexity O(n³) causes steep growth │
│ as input size scales.                                    │
╰──────────────────────────────────────────────────────────╯
```

---

## 6. COMPLEXITY EXPLORER

To view theoretical time complexity, space bounds, and problem classifications:

```text
thrml> complexity
```

This displays a table explaining:
- **Polynomial**: Floyd-Warshall ($O(V^3)$), Matrix Chain ($O(n^3)$), Prim ($O(E \log V)$), Kruskal ($O(E \log V)$).
- **Pseudo-polynomial**: 0/1 Knapsack ($O(n \cdot W)$).
- **NP-Complete / NP-Hard**: TSP Optimization, Hamiltonian Cycle, N-Queen.

---

## 7. GENERATING & EXPORTING REPORTS

To export your experiment results into text and CSV files:

```text
thrml> report
```

Generated files are saved in `reports/`:
- `reports/full_report.txt`: Formatted human-readable laboratory report.
- `reports/benchmark_data.csv`: Raw benchmark data suitable for Excel or Python analysis.
- `reports/experiment_XXX.txt`: Detailed per-experiment reports.

---

## 8. AUTOMATED DEMONSTRATION MODE

If you are presenting THRML or want to see a full automated tour without typing commands:

Run directly from terminal:

```bash
python3 main.py --demo
```

This runs a 5-step automated sequence:
1. Floyd-Warshall cubic growth test.
2. N-Queens state space growth test.
3. TSP Branch & Bound stress test.
4. Prim vs Kruskal dense graph comparison.
5. Automated report export.

---

## 9. TROUBLESHOOTING & FAQS

**Q: Can a long test freeze my computer?**
*A: No. THRML implements safety timeouts (2.0s per test step) for backtracking algorithms (TSP, N-Queen, Hamiltonian). If an input is too large, THRML automatically stops and records `TIMEOUT` as a high-risk experimental result.*

**Q: How do I inspect a past experiment?**
*A: Type `history` to list all experiment IDs, then type `history <ID>` (e.g. `history 002`) to view the detailed metric card.*

**Q: Where are the report files saved?**
*A: In the `reports/` folder inside the project directory.*
