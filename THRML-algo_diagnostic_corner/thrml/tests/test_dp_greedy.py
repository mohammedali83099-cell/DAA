import unittest
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from algorithms.greedy.fractional_knapsack import FractionalKnapsack
from algorithms.dynamic_programming.knapsack_01 import Knapsack01
from algorithms.dynamic_programming.matrix_chain import MatrixChainMultiplication

class TestDPGreedy(unittest.TestCase):
    def test_fractional_knapsack(self):
        items = [(60.0, 10.0), (100.0, 20.0), (120.0, 30.0)]
        fk = FractionalKnapsack()
        res = fk.run_knapsack(50.0, items)
        self.assertAlmostEqual(res.details["value"], 240.0)

    def test_knapsack_01(self):
        items = [(60, 10), (100, 20), (120, 30)]
        k01 = Knapsack01()
        res = k01.run_knapsack(50, items)
        self.assertEqual(res.details["value"], 220)

    def test_matrix_chain(self):
        p = [10, 30, 5, 60]
        mcm = MatrixChainMultiplication()
        res = mcm.run_chain(p)
        self.assertEqual(res.details["min_multiplications"], 4500)

if __name__ == '__main__':
    unittest.main()
