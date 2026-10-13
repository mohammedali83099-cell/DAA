import time
import tracemalloc
from typing import List
from algorithms.base import BaseAlgorithm, MetricResult

class NQueenProblem(BaseAlgorithm):
    def __init__(self):
        super().__init__("N-Queen", "Backtracking / Branch and Bound")

    def run_nqueen(self, N: int, timeout_sec: float = 3.0) -> MetricResult:
        self.reset_counters()

        tracemalloc.start()
        t0 = time.perf_counter()
        timed_out = False

        solutions: List[List[int]] = []
        cols = set()
        diag1 = set()  # r - c
        diag2 = set()  # r + c

        board = [-1] * N

        def solve(r: int):
            nonlocal timed_out
            self.ops.search_states += 1
            if time.perf_counter() - t0 > timeout_sec:
                timed_out = True
                return

            if r == N:
                solutions.append(board[:])
                return

            for c in range(N):
                self.ops.branches += 1
                self.ops.comparisons += 1
                if c in cols or (r - c) in diag1 or (r + c) in diag2:
                    continue

                cols.add(c)
                diag1.add(r - c)
                diag2.add(r + c)
                board[r] = c

                solve(r + 1)

                cols.remove(c)
                diag1.remove(r - c)
                diag2.remove(r + c)
                board[r] = -1
                self.ops.pruned_states += 1

                if timed_out or len(solutions) >= 100:  # stop early if many solutions found
                    return

        solve(0)

        t1 = time.perf_counter()
        current, peak = tracemalloc.get_traced_memory()
        tracemalloc.stop()

        status_str = "TIMEOUT" if timed_out else f"Found {len(solutions)} solutions"

        return MetricResult(
            algorithm_name=self.name,
            category=self.category,
            input_size_repr=f"N={N} (Board {N}x{N})",
            input_n=N,
            runtime_seconds=t1 - t0,
            memory_bytes=peak,
            operations=self.ops,
            output_summary=f"Status: {status_str}, Search States: {self.ops.search_states}",
            timed_out=timed_out,
            details={"N": N, "solution_count": len(solutions)}
        )
