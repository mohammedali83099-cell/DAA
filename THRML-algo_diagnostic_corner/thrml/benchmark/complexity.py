import math
from typing import Dict, Any, List

# Standard theoretical complexity lookup table for DAA algorithms
COMPLEXITY_TABLE: Dict[str, Dict[str, str]] = {
    "Binomial Heap": {
        "time_insert": "O(1) amortized / O(log n) worst",
        "time_extract_min": "O(log n)",
        "time_decrease_key": "O(log n)",
        "space": "O(n)",
        "problem_class": "Polynomial",
        "category": "Advanced Data Structures"
    },
    "Fibonacci Heap": {
        "time_insert": "O(1) amortized",
        "time_extract_min": "O(log n) amortized",
        "time_decrease_key": "O(1) amortized",
        "space": "O(n)",
        "problem_class": "Polynomial",
        "category": "Advanced Data Structures"
    },
    "B-Tree": {
        "time_insert": "O(log n)",
        "time_search": "O(log n)",
        "space": "O(n)",
        "problem_class": "Polynomial",
        "category": "Advanced Data Structures"
    },
    "Red-Black Tree": {
        "time_insert": "O(log n)",
        "time_search": "O(log n)",
        "space": "O(n)",
        "problem_class": "Polynomial",
        "category": "Advanced Data Structures"
    },
    "Prim's Algorithm": {
        "time": "O(E log V)",
        "space": "O(V + E)",
        "problem_class": "Polynomial",
        "category": "Minimum Spanning Tree"
    },
    "Kruskal's Algorithm": {
        "time": "O(E log E) = O(E log V)",
        "space": "O(V + E)",
        "problem_class": "Polynomial",
        "category": "Minimum Spanning Tree"
    },
    "Fractional Knapsack": {
        "time": "O(n log n)",
        "space": "O(n)",
        "problem_class": "Polynomial",
        "category": "Greedy"
    },
    "0/1 Knapsack": {
        "time": "O(n · W) [Pseudo-polynomial]",
        "space": "O(n · W)",
        "problem_class": "Pseudo-polynomial (NP-Complete decision variant)",
        "category": "Dynamic Programming"
    },
    "Floyd-Warshall": {
        "time": "O(V³)",
        "space": "O(V²)",
        "problem_class": "Polynomial",
        "category": "Dynamic Programming"
    },
    "Matrix Chain Multiplication": {
        "time": "O(n³)",
        "space": "O(n²)",
        "problem_class": "Polynomial",
        "category": "Dynamic Programming"
    },
    "Hamiltonian Problem": {
        "time": "O(2ⁿ · n²)",
        "space": "O(n)",
        "problem_class": "NP-Complete (Decision) / Exponential",
        "category": "Backtracking / Branch and Bound"
    },
    "N-Queen": {
        "time": "O(N!) worst-case",
        "space": "O(N)",
        "problem_class": "Exponential / Factorial",
        "category": "Backtracking / Branch and Bound"
    },
    "Travelling Salesperson Problem": {
        "time": "O(n! / 2ⁿ)",
        "space": "O(n)",
        "problem_class": "NP-Hard (Optimization) / NP-Complete (Decision)",
        "category": "Backtracking / Branch and Bound"
    }
}

def estimate_growth_exponent(n1: int, t1: float, n2: int, t2: float) -> float:
    """Calculates empirical growth exponent k where T(n) proportional to n^k."""
    if n1 <= 0 or n2 <= 0 or t1 <= 0 or t2 <= 0 or n1 == n2:
        return 0.0
    try:
        exponent = math.log(t2 / t1) / math.log(n2 / n1)
        return round(max(0.0, exponent), 2)
    except Exception:
        return 0.0
