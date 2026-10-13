import unittest
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from algorithms.backtracking.nqueen import NQueenProblem
from algorithms.backtracking.hamiltonian import HamiltonianProblem
from algorithms.backtracking.tsp import TSPProblem
from generators.graph_generator import generate_dist_matrix

class TestBacktracking(unittest.TestCase):
    def test_nqueen(self):
        nq = NQueenProblem()
        res = nq.run_nqueen(4, timeout_sec=2.0)
        self.assertEqual(res.details["solution_count"], 2)

    def test_hamiltonian(self):
        # 4 vertices graph with cycle 0-1-2-3-0
        graph = [
            [0, 1, 0, 1],
            [1, 0, 1, 0],
            [0, 1, 0, 1],
            [1, 0, 1, 0]
        ]
        ham = HamiltonianProblem()
        res = ham.run_graph(4, graph, timeout_sec=2.0)
        self.assertTrue(res.details["has_cycle"])

    def test_tsp(self):
        dist = [
            [0.0, 10.0, 15.0, 20.0],
            [10.0, 0.0, 35.0, 25.0],
            [15.0, 35.0, 0.0, 30.0],
            [20.0, 25.0, 30.0, 0.0]
        ]
        tsp = TSPProblem()
        res = tsp.run_tsp(dist, timeout_sec=2.0)
        self.assertAlmostEqual(res.details["best_cost"], 80.0)

if __name__ == '__main__':
    unittest.main()
