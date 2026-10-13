import time
import tracemalloc
from typing import List, Tuple
from algorithms.base import BaseAlgorithm, MetricResult

class MatrixChainMultiplication(BaseAlgorithm):
    def __init__(self):
        super().__init__("Matrix Chain Multiplication", "Dynamic Programming")

    def run_chain(self, p: List[int]) -> MetricResult:
        # p is list of matrix dimensions e.g. [10, 30, 5, 60] -> A1=10x30, A2=30x5, A3=5x60
        self.reset_counters()

        tracemalloc.start()
        t0 = time.perf_counter()

        n = len(p) - 1
        m = [[0] * (n + 1) for _ in range(n + 1)]
        s = [[0] * (n + 1) for _ in range(n + 1)]

        for l in range(2, n + 1):  # l is chain length
            for i in range(1, n - l + 2):
                j = i + l - 1
                m[i][j] = float('inf')
                for k in range(i, j):
                    self.ops.dp_states += 1
                    q = m[i][k] + m[k + 1][j] + p[i - 1] * p[k] * p[j]
                    self.ops.comparisons += 1
                    if q < m[i][j]:
                        m[i][j] = q
                        s[i][j] = k

        min_mults = m[1][n]

        # Reconstruct optimal parenthesization
        def construct_parens(i: int, j: int) -> str:
            if i == j:
                return f"A{i}"
            else:
                return f"({construct_parens(i, s[i][j])} × {construct_parens(s[i][j] + 1, j)})"

        parens_str = construct_parens(1, n) if n > 0 else ""

        t1 = time.perf_counter()
        current, peak = tracemalloc.get_traced_memory()
        tracemalloc.stop()

        return MetricResult(
            algorithm_name=self.name,
            category=self.category,
            input_size_repr=f"Chain Length n={n}",
            input_n=n,
            runtime_seconds=t1 - t0,
            memory_bytes=peak,
            operations=self.ops,
            output_summary=f"Min Scalar Multiplications: {min_mults}, Expression: {parens_str}",
            details={"min_multiplications": min_mults, "chain_length": n, "expression": parens_str}
        )
