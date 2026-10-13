import {
  SystemStatus,
  AlgorithmCatalogItem,
  MetricResult,
  ComplexityEntry,
  HistoryItem,
  BenchmarkSeriesPoint,
} from '../types';

const API_BASE = '/api';

export async function fetchStatus(): Promise<SystemStatus> {
  try {
    const res = await fetch(`${API_BASE}/status`);
    if (!res.ok) throw new Error('Status fetch failed');
    return await res.json();
  } catch {
    return {
      status: 'READY (LOCAL MODE)',
      total_algorithms: 13,
      experiments_run: 0,
      test_families: ['NORMAL', 'LARGE', 'PATHOLOGICAL', 'BOUNDARY', 'STRUCTURED', 'SCALABILITY']
    };
  }
}

export async function fetchAlgorithms(): Promise<AlgorithmCatalogItem[]> {
  try {
    const res = await fetch(`${API_BASE}/algorithms`);
    if (!res.ok) throw new Error('Algorithms fetch failed');
    return await res.json();
  } catch {
    return DEFAULT_ALGORITHMS;
  }
}

export async function runAlgorithmTest(
  algorithm: string,
  params: Record<string, any>
): Promise<MetricResult> {
  const res = await fetch(`${API_BASE}/test`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ algorithm, params }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Test execution failed' }));
    throw new Error(err.error || 'Test failed');
  }
  return await res.json();
}

export async function runComparison(category: string, options: Record<string, any> = {}): Promise<any> {
  const res = await fetch(`${API_BASE}/compare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ category, ...options }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Comparison failed' }));
    throw new Error(err.error || 'Comparison failed');
  }
  return await res.json();
}

export async function runBenchmarkSeries(
  algorithm: string,
  sizes?: number[]
): Promise<{ algorithm: string; series: BenchmarkSeriesPoint[] }> {
  const res = await fetch(`${API_BASE}/benchmark-series`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ algorithm, sizes }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Benchmark series failed' }));
    throw new Error(err.error || 'Benchmark series failed');
  }
  return await res.json();
}

export async function fetchComplexityTable(): Promise<ComplexityEntry[]> {
  try {
    const res = await fetch(`${API_BASE}/complexity-table`);
    if (!res.ok) throw new Error('Complexity table fetch failed');
    return await res.json();
  } catch {
    return [];
  }
}

export async function fetchHistory(): Promise<HistoryItem[]> {
  try {
    const res = await fetch(`${API_BASE}/history`);
    if (!res.ok) throw new Error('History fetch failed');
    return await res.json();
  } catch {
    return [];
  }
}

export async function exportReports(): Promise<{ success: boolean; csv_path: string; txt_path: string }> {
  const res = await fetch(`${API_BASE}/export`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Report export failed');
  return await res.json();
}

export const DEFAULT_ALGORITHMS: AlgorithmCatalogItem[] = [
  {
    id: "binomial_heap",
    name: "Binomial Heap",
    category: "Advanced Data Structures",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(n)",
    problemClass: "Polynomial",
    decisionOptimization: "N/A (Data Structure)",
    description: "Forest of binomial trees satisfying min-heap property. Tracks binomial tree mergers and key comparisons.",
    defaultParams: { n: 2000, workload: "random" }
  },
  {
    id: "fibonacci_heap",
    name: "Fibonacci Heap",
    category: "Advanced Data Structures",
    timeComplexity: "O(1) amortized insert / O(log n) extract-min",
    spaceComplexity: "O(n)",
    problemClass: "Polynomial",
    decisionOptimization: "N/A (Data Structure)",
    description: "Lazy tree structure with O(1) amortized insert/decrease-key. Tracks cascading cuts and root consolidations.",
    defaultParams: { n: 2000, workload: "random" }
  },
  {
    id: "btree",
    name: "B-Tree",
    category: "Advanced Data Structures",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(n)",
    problemClass: "Polynomial",
    decisionOptimization: "N/A (Data Structure)",
    description: "Self-balancing multi-way search tree (t=3). Measures key comparisons, node splits, and tree height.",
    defaultParams: { n: 2500, workload: "sorted" }
  },
  {
    id: "red_black_tree",
    name: "Red-Black Tree",
    category: "Advanced Data Structures",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(n)",
    problemClass: "Polynomial",
    decisionOptimization: "N/A (Data Structure)",
    description: "Balanced binary search tree with red/black invariants. Tracks left/right rotations and node recolorings.",
    defaultParams: { n: 2500, workload: "sorted" }
  },
  {
    id: "prim",
    name: "Prim's Algorithm",
    category: "Minimum Spanning Tree",
    timeComplexity: "O(E log V)",
    spaceComplexity: "O(V + E)",
    problemClass: "Polynomial",
    decisionOptimization: "Optimization",
    description: "Greedy MST growth using priority queue and adjacency lists. Measures vertex visits and edge relaxations.",
    defaultParams: { vertices: 150, density: 0.3 }
  },
  {
    id: "kruskal",
    name: "Kruskal's Algorithm",
    category: "Minimum Spanning Tree",
    timeComplexity: "O(E log V)",
    spaceComplexity: "O(V + E)",
    problemClass: "Polynomial",
    decisionOptimization: "Optimization",
    description: "Greedy MST building by edge sorting and Disjoint Set Union (DSU) with path compression and union by rank.",
    defaultParams: { vertices: 150, density: 0.3 }
  },
  {
    id: "fractional_knapsack",
    name: "Fractional Knapsack",
    category: "Greedy",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    problemClass: "Polynomial",
    decisionOptimization: "Optimization (Exact Greedy)",
    description: "Optimal divisible item selection via greedy value-to-weight ratio sorting.",
    defaultParams: { n_items: 150, capacity: 500.0 }
  },
  {
    id: "knapsack_01",
    name: "0/1 Knapsack",
    category: "Dynamic Programming",
    timeComplexity: "O(n · W) [Pseudo-polynomial]",
    spaceComplexity: "O(n · W)",
    problemClass: "Pseudo-polynomial (NP-Complete decision variant)",
    decisionOptimization: "Optimization (Decision: Is Value >= K?)",
    description: "Exact 0/1 optimization over indivisible items using a DP table. Exposes memory and time surges when capacity W scales.",
    defaultParams: { n_items: 150, capacity: 500 }
  },
  {
    id: "floyd_warshall",
    name: "Floyd-Warshall",
    category: "Dynamic Programming",
    timeComplexity: "O(V³)",
    spaceComplexity: "O(V²)",
    problemClass: "Polynomial (Cubic)",
    decisionOptimization: "Optimization",
    description: "All-pairs shortest paths via dynamic programming. Measures triple-nested loop iterations and matrix cell updates.",
    defaultParams: { vertices: 80 }
  },
  {
    id: "matrix_chain",
    name: "Matrix Chain Multiplication",
    category: "Dynamic Programming",
    timeComplexity: "O(n³)",
    spaceComplexity: "O(n²)",
    problemClass: "Polynomial (Cubic)",
    decisionOptimization: "Optimization",
    description: "Computes optimal parenthesization of matrix chains. Tracks subproblem evaluations and scalar multiplication checks.",
    defaultParams: { chain_length: 25 }
  },
  {
    id: "hamiltonian",
    name: "Hamiltonian Problem",
    category: "Backtracking / Branch & Bound",
    timeComplexity: "O(2ⁿ · n²)",
    spaceComplexity: "O(n)",
    problemClass: "NP-Complete (Decision)",
    decisionOptimization: "Decision (Does a cycle exist?)",
    description: "Backtracking search for a cycle visiting every vertex exactly once. Measures search states explored and dead-end backtracks.",
    defaultParams: { vertices: 12, has_cycle: true }
  },
  {
    id: "nqueen",
    name: "N-Queen Problem",
    category: "Backtracking / Branch & Bound",
    timeComplexity: "O(N!) worst-case",
    spaceComplexity: "O(N)",
    problemClass: "Exponential / Factorial",
    decisionOptimization: "Decision / Solution Search",
    description: "Placement of N non-attacking queens on N×N board. Measures board states generated vs pruned and backtracks.",
    defaultParams: { n: 10 }
  },
  {
    id: "tsp",
    name: "Travelling Salesperson Problem",
    category: "Backtracking / Branch & Bound",
    timeComplexity: "O(n! / 2ⁿ)",
    spaceComplexity: "O(n)",
    problemClass: "NP-Hard (Optimization) / NP-Complete (Decision)",
    decisionOptimization: "Optimization (Decision: Is Tour <= L?)",
    description: "Exact branch-and-bound / backtracking search for minimum distance tour. Measures explored vs pruned permutations.",
    defaultParams: { cities: 9 }
  }
];
