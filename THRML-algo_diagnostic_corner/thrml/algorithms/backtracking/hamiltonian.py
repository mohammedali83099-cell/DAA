import time
import tracemalloc
from typing import List, Dict, Optional
from algorithms.base import BaseAlgorithm, MetricResult

class HamiltonianProblem(BaseAlgorithm):
    def __init__(self):
        super().__init__("Hamiltonian Problem", "Backtracking / Branch and Bound")

    def run_graph(self, num_vertices: int, adj_matrix: List[List[int]], timeout_sec: float = 3.0) -> MetricResult:
        self.reset_counters()

        tracemalloc.start()
        t0 = time.perf_counter()
        timed_out = False

        path = [-1] * num_vertices
        path[0] = 0
        visited = [False] * num_vertices
        visited[0] = True

        def is_valid(v: int, pos: int) -> bool:
            self.ops.comparisons += 1
            if adj_matrix[path[pos - 1]][v] == 0:
                return False
            if visited[v]:
                return False
            return True

        def solve(pos: int) -> bool:
            nonlocal timed_out
            self.ops.search_states += 1
            if time.perf_counter() - t0 > timeout_sec:
                timed_out = True
                return False

            if pos == num_vertices:
                # Check cycle back to start node 0
                self.ops.comparisons += 1
                return adj_matrix[path[pos - 1]][path[0]] == 1

            for v in range(1, num_vertices):
                self.ops.branches += 1
                if is_valid(v, pos):
                    path[pos] = v
                    visited[v] = True
                    if solve(pos + 1):
                        return True
                    visited[v] = False
                    path[pos] = -1
                    self.ops.pruned_states += 1
                if timed_out:
                    return False
            return False

        has_cycle = solve(1)

        t1 = time.perf_counter()
        current, peak = tracemalloc.get_traced_memory()
        tracemalloc.stop()

        status_str = "TIMEOUT" if timed_out else ("Cycle Found" if has_cycle else "No Cycle")

        return MetricResult(
            algorithm_name=self.name,
            category=self.category,
            input_size_repr=f"V={num_vertices} vertices",
            input_n=num_vertices,
            runtime_seconds=t1 - t0,
            memory_bytes=peak,
            operations=self.ops,
            output_summary=f"Result: {status_str}, Search States: {self.ops.search_states}",
            timed_out=timed_out,
            details={"vertices": num_vertices, "has_cycle": has_cycle, "path": path if has_cycle else []}
        )
