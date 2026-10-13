import unittest
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from algorithms.mst.prim import PrimAlgorithm
from algorithms.mst.kruskal import KruskalAlgorithm
from algorithms.dynamic_programming.floyd_warshall import FloydWarshall

class TestGraphAlgos(unittest.TestCase):
    def test_mst_prim_and_kruskal(self):
        # 4 vertices square with diagonal
        # 0-1 (1), 1-2 (2), 2-3 (3), 3-0 (4), 0-2 (5)
        adj_list = {
            0: [(1, 1.0), (3, 4.0), (2, 5.0)],
            1: [(0, 1.0), (2, 2.0)],
            2: [(1, 2.0), (3, 3.0), (0, 5.0)],
            3: [(2, 3.0), (0, 4.0)]
        }
        edges = [
            (1.0, 0, 1),
            (2.0, 1, 2),
            (3.0, 2, 3),
            (4.0, 3, 0),
            (5.0, 0, 2)
        ]

        prim = PrimAlgorithm()
        p_res = prim.run_graph(4, adj_list)

        kruskal = KruskalAlgorithm()
        k_res = kruskal.run_graph(4, edges)

        self.assertAlmostEqual(p_res.details["cost"], 6.0)
        self.assertAlmostEqual(k_res.details["cost"], 6.0)

    def test_floyd_warshall(self):
        INF = float('inf')
        dist = [
            [0.0, 3.0, INF, 7.0],
            [8.0, 0.0, 2.0, INF],
            [5.0, INF, 0.0, 1.0],
            [2.0, INF, INF, 0.0]
        ]
        fw = FloydWarshall()
        res = fw.run_matrix(dist)
        self.assertEqual(res.details["vertices"], 4)

if __name__ == '__main__':
    unittest.main()
