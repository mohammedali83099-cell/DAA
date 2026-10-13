import time
import tracemalloc
from typing import List, Tuple
from algorithms.base import BaseAlgorithm, MetricResult

class DSU:
    def __init__(self, n: int, ops_counter):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.ops = ops_counter

    def find(self, i: int) -> int:
        self.ops.search_states += 1
        if self.parent[i] == i:
            return i
        self.parent[i] = self.find(self.parent[i])
        return self.parent[i]

    def union(self, i: int, j: int) -> bool:
        self.ops.branches += 1
        root_i = self.find(i)
        root_j = self.find(j)

        if root_i != root_j:
            if self.rank[root_i] < self.rank[root_j]:
                root_i, root_j = root_j, root_i
            self.parent[root_j] = root_i
            if self.rank[root_i] == self.rank[root_j]:
                self.rank[root_i] += 1
            return True
        return False

class KruskalAlgorithm(BaseAlgorithm):
    def __init__(self):
        super().__init__("Kruskal's Algorithm", "Minimum Spanning Tree")

    def run_graph(self, num_vertices: int, edges: List[Tuple[float, int, int]]) -> MetricResult:
        self.reset_counters()

        tracemalloc.start()
        t0 = time.perf_counter()

        # Sort edges by weight
        self.ops.comparisons += len(edges) * max(1, int(len(edges).bit_length()))
        sorted_edges = sorted(edges, key=lambda x: x[0])

        dsu = DSU(num_vertices, self.ops)
        mst_cost = 0.0
        edges_in_mst = 0

        for w, u, v in sorted_edges:
            if dsu.union(u, v):
                mst_cost += w
                edges_in_mst += 1
                if edges_in_mst == num_vertices - 1:
                    break

        t1 = time.perf_counter()
        current, peak = tracemalloc.get_traced_memory()
        tracemalloc.stop()

        return MetricResult(
            algorithm_name=self.name,
            category=self.category,
            input_size_repr=f"V={num_vertices}, E={len(edges)}",
            input_n=num_vertices,
            runtime_seconds=t1 - t0,
            memory_bytes=peak,
            operations=self.ops,
            output_summary=f"MST Cost: {mst_cost:.2f}, Edges: {edges_in_mst}",
            details={"cost": mst_cost, "v": num_vertices, "e": len(edges)}
        )
