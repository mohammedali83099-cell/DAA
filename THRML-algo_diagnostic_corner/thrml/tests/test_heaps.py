import unittest
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from algorithms.heaps.binomial_heap import BinomialHeap
from algorithms.heaps.fibonacci_heap import FibonacciHeap

class TestHeaps(unittest.TestCase):
    def test_binomial_heap_ops(self):
        heap = BinomialHeap()
        node10 = heap.insert(10)
        node5 = heap.insert(5)
        node20 = heap.insert(20)

        min_n = heap.get_min()
        self.assertIsNotNone(min_n)
        self.assertEqual(min_n.key, 5)

        ext = heap.extract_min()
        self.assertEqual(ext.key, 5)

        heap.decrease_key(node20, 2)
        min_n2 = heap.get_min()
        self.assertEqual(min_n2.key, 2)

    def test_fibonacci_heap_ops(self):
        heap = FibonacciHeap()
        node10 = heap.insert(10)
        node5 = heap.insert(5)
        node20 = heap.insert(20)

        self.assertEqual(heap.min_node.key, 5)

        ext = heap.extract_min()
        self.assertEqual(ext.key, 5)

        heap.decrease_key(node20, 1)
        self.assertEqual(heap.min_node.key, 1)

if __name__ == '__main__':
    unittest.main()
