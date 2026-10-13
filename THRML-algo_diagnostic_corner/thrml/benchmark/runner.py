from typing import List, Dict, Any, Tuple
from algorithms.heaps.binomial_heap import BinomialHeap
from algorithms.heaps.fibonacci_heap import FibonacciHeap
from algorithms.trees.btree import BTree
from algorithms.trees.red_black_tree import RedBlackTree
from algorithms.mst.prim import PrimAlgorithm
from algorithms.mst.kruskal import KruskalAlgorithm
from algorithms.greedy.fractional_knapsack import FractionalKnapsack
from algorithms.dynamic_programming.knapsack_01 import Knapsack01
from algorithms.dynamic_programming.floyd_warshall import FloydWarshall
from algorithms.dynamic_programming.matrix_chain import MatrixChainMultiplication
from algorithms.backtracking.hamiltonian import HamiltonianProblem
from algorithms.backtracking.nqueen import NQueenProblem
from algorithms.backtracking.tsp import TSPProblem

from generators.pathological_generator import (
    generate_random_sequence, generate_sorted_sequence,
    generate_reverse_sorted_sequence, generate_duplicate_heavy_sequence
)
from generators.graph_generator import (
    generate_graph_adj_list, generate_dist_matrix, generate_hamiltonian_graph
)
from generators.knapsack_generator import generate_knapsack_items, generate_pathological_knapsack
from generators.matrix_generator import generate_matrix_chain_dims

from benchmark.complexity import estimate_growth_exponent
from benchmark.metrics import ScalabilitySeries
from risk.classifier import RiskClassifier, RiskAssessment

class BenchmarkRunner:
    def __init__(self):
        self.history = []

    def run_heap_benchmark(self, algo_name: str, n_ops: int, workload_type: str = "random") -> Tuple[Any, RiskAssessment]:
        if workload_type == "sorted":
            keys = generate_sorted_sequence(n_ops)
        elif workload_type == "reverse":
            keys = generate_reverse_sorted_sequence(n_ops)
        elif workload_type == "duplicates":
            keys = generate_duplicate_heavy_sequence(n_ops)
        else:
            keys = generate_random_sequence(n_ops)

        ops = [("insert", k) for k in keys]
        ops.extend([("extract_min", None) for _ in range(n_ops // 2)])

        if algo_name == "Binomial Heap":
            algo = BinomialHeap()
        else:
            algo = FibonacciHeap()

        result = algo.run_workload(ops)
        risk = RiskClassifier.classify(result)
        self.history.append((result, risk))
        return result, risk

    def run_tree_benchmark(self, algo_name: str, n: int, workload_type: str = "random") -> Tuple[Any, RiskAssessment]:
        if workload_type == "sorted":
            keys = generate_sorted_sequence(n)
        elif workload_type == "reverse":
            keys = generate_reverse_sorted_sequence(n)
        else:
            keys = generate_random_sequence(n)

        if algo_name == "B-Tree":
            algo = BTree(t=3)
        else:
            algo = RedBlackTree()

        result = algo.run_workload(keys)
        risk = RiskClassifier.classify(result)
        self.history.append((result, risk))
        return result, risk

    def run_mst_benchmark(self, algo_name: str, vertices: int, density: float = 0.3) -> Tuple[Any, RiskAssessment]:
        adj_list, edges = generate_graph_adj_list(vertices, density=density)
        if algo_name == "Prim":
            algo = PrimAlgorithm()
            result = algo.run_graph(vertices, adj_list)
        else:
            algo = KruskalAlgorithm()
            result = algo.run_graph(vertices, edges)

        risk = RiskClassifier.classify(result)
        self.history.append((result, risk))
        return result, risk

    def run_knapsack_benchmark(self, algo_name: str, n_items: int, capacity: float) -> Tuple[Any, RiskAssessment]:
        if algo_name == "Fractional Knapsack":
            algo = FractionalKnapsack()
            items = [(float(v), float(w)) for v, w in generate_knapsack_items(n_items)]
            result = algo.run_knapsack(capacity, items)
        else:
            algo = Knapsack01()
            items = generate_knapsack_items(n_items)
            result = algo.run_knapsack(int(capacity), items)

        risk = RiskClassifier.classify(result)
        self.history.append((result, risk))
        return result, risk

    def run_floyd_benchmark(self, vertices: int) -> Tuple[Any, RiskAssessment]:
        dist = generate_dist_matrix(vertices, density=0.5)
        algo = FloydWarshall()
        result = algo.run_matrix(dist)
        risk = RiskClassifier.classify(result)
        self.history.append((result, risk))
        return result, risk

    def run_matrix_benchmark(self, chain_length: int) -> Tuple[Any, RiskAssessment]:
        p = generate_matrix_chain_dims(chain_length)
        algo = MatrixChainMultiplication()
        result = algo.run_chain(p)
        risk = RiskClassifier.classify(result)
        self.history.append((result, risk))
        return result, risk

    def run_hamiltonian_benchmark(self, vertices: int, has_cycle: bool = True) -> Tuple[Any, RiskAssessment]:
        matrix = generate_hamiltonian_graph(vertices, has_cycle=has_cycle)
        algo = HamiltonianProblem()
        result = algo.run_graph(vertices, matrix, timeout_sec=2.0)
        risk = RiskClassifier.classify(result)
        self.history.append((result, risk))
        return result, risk

    def run_nqueen_benchmark(self, N: int) -> Tuple[Any, RiskAssessment]:
        algo = NQueenProblem()
        result = algo.run_nqueen(N, timeout_sec=2.0)
        risk = RiskClassifier.classify(result)
        self.history.append((result, risk))
        return result, risk

    def run_tsp_benchmark(self, cities: int) -> Tuple[Any, RiskAssessment]:
        dist = generate_dist_matrix(cities, density=0.8)
        algo = TSPProblem()
        result = algo.run_tsp(dist, timeout_sec=2.0)
        risk = RiskClassifier.classify(result)
        self.history.append((result, risk))
        return result, risk
