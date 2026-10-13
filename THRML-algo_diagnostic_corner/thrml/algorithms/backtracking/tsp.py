import time
import tracemalloc
from typing import List
from algorithms.base import BaseAlgorithm, MetricResult

INF = float('inf')

class TSPProblem(BaseAlgorithm):
    def __init__(self):
        super().__init__("Travelling Salesperson Problem", "Backtracking / Branch and Bound")

    def run_tsp(self, dist_matrix: List[List[float]], timeout_sec: float = 3.0) -> MetricResult:
        self.reset_counters()

        tracemalloc.start()
        t0 = time.perf_counter()
        timed_out = False

        num_cities = len(dist_matrix)
        best_cost = INF
        best_path: List[int] = []

        visited = [False] * num_cities
        visited[0] = True
        current_path = [0]

        def search(u: int, count: int, current_cost: float):
            nonlocal best_cost, best_path, timed_out
            self.ops.search_states += 1

            if time.perf_counter() - t0 > timeout_sec:
                timed_out = True
                return

            # Branch and Bound Pruning
            self.ops.comparisons += 1
            if current_cost >= best_cost:
                self.ops.pruned_states += 1
                return

            if count == num_cities:
                self.ops.comparisons += 1
                return_cost = dist_matrix[u][0]
                if return_cost != INF and current_cost + return_cost < best_cost:
                    best_cost = current_cost + return_cost
                    best_path = current_path[:] + [0]
                return

            for v in range(num_cities):
                if not visited[v] and dist_matrix[u][v] != INF:
                    self.ops.branches += 1
                    visited[v] = True
                    current_path.append(v)

                    search(v, count + 1, current_cost + dist_matrix[u][v])

                    current_path.pop()
                    visited[v] = False

                    if timed_out:
                        return

        search(0, 1, 0.0)

        t1 = time.perf_counter()
        current, peak = tracemalloc.get_traced_memory()
        tracemalloc.stop()

        status_str = "TIMEOUT" if timed_out else (f"Optimal Tour Cost: {best_cost:.2f}" if best_cost < INF else "No Tour")

        return MetricResult(
            algorithm_name=self.name,
            category=self.category,
            input_size_repr=f"{num_cities} Cities (Search Space ~ ({num_cities-1})!)",
            input_n=num_cities,
            runtime_seconds=t1 - t0,
            memory_bytes=peak,
            operations=self.ops,
            output_summary=f"Result: {status_str}, States Generated: {self.ops.search_states}, Pruned: {self.ops.pruned_states}",
            timed_out=timed_out,
            details={"cities": num_cities, "best_cost": best_cost, "best_path": best_path}
        )
