import time
import tracemalloc
from typing import List, Tuple
from algorithms.base import BaseAlgorithm, MetricResult

class FractionalKnapsack(BaseAlgorithm):
    def __init__(self):
        super().__init__("Fractional Knapsack", "Greedy")

    def run_knapsack(self, capacity: float, items: List[Tuple[float, float]]) -> MetricResult:
        # items: list of (value, weight)
        self.reset_counters()

        tracemalloc.start()
        t0 = time.perf_counter()

        # Calculate ratio and sort
        item_ratios = []
        for v, w in items:
            ratio = v / w if w > 0 else 0
            item_ratios.append((ratio, v, w))

        # Sort descending by ratio
        self.ops.comparisons += len(items) * max(1, int(len(items).bit_length()))
        item_ratios.sort(key=lambda x: x[0], reverse=True)

        total_value = 0.0
        rem_cap = capacity
        items_taken = 0

        for ratio, v, w in item_ratios:
            self.ops.branches += 1
            if rem_cap <= 0:
                break

            if w <= rem_cap:
                rem_cap -= w
                total_value += v
                items_taken += 1
            else:
                total_value += ratio * rem_cap
                rem_cap = 0
                items_taken += 1
                break

        t1 = time.perf_counter()
        current, peak = tracemalloc.get_traced_memory()
        tracemalloc.stop()

        return MetricResult(
            algorithm_name=self.name,
            category=self.category,
            input_size_repr=f"N={len(items)}, Cap={capacity}",
            input_n=len(items),
            runtime_seconds=t1 - t0,
            memory_bytes=peak,
            operations=self.ops,
            output_summary=f"Total Value: {total_value:.2f}, Items processed: {items_taken}",
            details={"value": total_value, "items_count": len(items), "capacity": capacity}
        )
