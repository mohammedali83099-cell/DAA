import heapq
import time
import tracemalloc
from typing import Dict, List, Tuple
from algorithms.base import BaseAlgorithm, MetricResult

class PrimAlgorithm(BaseAlgorithm):
    def __init__(self):
        super().__init__("Prim's Algorithm", "Minimum Spanning Tree")

    def run_graph(self, num_vertices: int, adj_list: Dict[int, List[Tuple[int, float]]]) -> MetricResult:
        self.reset_counters()

        tracemalloc.start()
        t0 = time.perf_counter()

        if num_vertices == 0:
            tracemalloc.stop()
            return MetricResult(self.name, self.category, "V=0, E=0", 0, 0.0, 0, self.ops, "Empty graph")

        visited = [False] * num_vertices
        mst_cost = 0.0
        edges_in_mst = 0

        # Min-heap of (weight, u, v)
        pq = [(0.0, 0, -1)]

        while pq and edges_in_mst < num_vertices:
            self.ops.heap_ops += 1
            w, u, p = heapq.heappop(pq)

            if visited[u]:
                continue

            visited[u] = True
            mst_cost += w
            if p != -1:
                edges_in_mst += 1

            for neighbor, weight in adj_list.get(u, []):
                self.ops.relaxations += 1
                if not visited[neighbor]:
                    self.ops.heap_ops += 1
                    heapq.heappush(pq, (weight, neighbor, u))

        t1 = time.perf_counter()
        current, peak = tracemalloc.get_traced_memory()
        tracemalloc.stop()

        num_edges = sum(len(edges) for edges in adj_list.values()) // 2

        return MetricResult(
            algorithm_name=self.name,
            category=self.category,
            input_size_repr=f"V={num_vertices}, E={num_edges}",
            input_n=num_vertices,
            runtime_seconds=t1 - t0,
            memory_bytes=peak,
            operations=self.ops,
            output_summary=f"MST Cost: {mst_cost:.2f}, Edges: {edges_in_mst}",
            details={"cost": mst_cost, "v": num_vertices, "e": num_edges}
        )
