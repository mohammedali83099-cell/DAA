import time
import tracemalloc
from typing import List, Tuple
from algorithms.base import BaseAlgorithm, MetricResult

class Knapsack01(BaseAlgorithm):
    def __init__(self):
        super().__init__("0/1 Knapsack", "Dynamic Programming")

    def run_knapsack(self, capacity: int, items: List[Tuple[int, int]]) -> MetricResult:
        # items: list of (value, weight)
        self.reset_counters()

        tracemalloc.start()
        t0 = time.perf_counter()

        n = len(items)
        W = int(capacity)

        # 2D DP Table to track state space
        dp = [[0] * (W + 1) for _ in range(n + 1)]

        for i in range(1, n + 1):
            val, wt = items[i - 1]
            for w in range(1, W + 1):
                self.ops.dp_states += 1
                if wt <= w:
                    self.ops.comparisons += 1
                    dp[i][w] = max(dp[i - 1][w], dp[i - 1][w - wt] + val)
                else:
                    dp[i][w] = dp[i - 1][w]

        max_val = dp[n][W]

        t1 = time.perf_counter()
        current, peak = tracemalloc.get_traced_memory()
        tracemalloc.stop()

        return MetricResult(
            algorithm_name=self.name,
            category=self.category,
            input_size_repr=f"N={n}, W={W} (Pseudo-Polynomial)",
            input_n=n,
            runtime_seconds=t1 - t0,
            memory_bytes=peak,
            operations=self.ops,
            output_summary=f"Max Value: {max_val}, DP States Evaluated: {self.ops.dp_states}",
            details={"value": max_val, "n": n, "capacity": W, "dp_table_size": (n + 1) * (W + 1)}
        )
