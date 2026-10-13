import time
import tracemalloc
from typing import List
from algorithms.base import BaseAlgorithm, MetricResult

INF = float('inf')

class FloydWarshall(BaseAlgorithm):
    def __init__(self):
        super().__init__("Floyd-Warshall", "Dynamic Programming")

    def run_matrix(self, dist_matrix: List[List[float]]) -> MetricResult:
        self.reset_counters()

        tracemalloc.start()
        t0 = time.perf_counter()

        V = len(dist_matrix)
        # Deep copy distance matrix
        dist = [row[:] for row in dist_matrix]

        for k in range(V):
            for i in range(V):
                for j in range(V):
                    self.ops.dp_states += 1
                    if dist[i][k] != INF and dist[k][j] != INF:
                        self.ops.comparisons += 1
                        new_dist = dist[i][k] + dist[k][j]
                        if new_dist < dist[i][j]:
                            dist[i][j] = new_dist
                            self.ops.relaxations += 1

        t1 = time.perf_counter()
        current, peak = tracemalloc.get_traced_memory()
        tracemalloc.stop()

        return MetricResult(
            algorithm_name=self.name,
            category=self.category,
            input_size_repr=f"V={V} vertices (V³={V**3})",
            input_n=V,
            runtime_seconds=t1 - t0,
            memory_bytes=peak,
            operations=self.ops,
            output_summary=f"Shortest path matrix calculated ({self.ops.relaxations} relaxations)",
            details={"vertices": V, "relaxations": self.ops.relaxations}
        )
