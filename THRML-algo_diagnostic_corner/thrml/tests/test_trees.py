import unittest
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from algorithms.trees.btree import BTree
from algorithms.trees.red_black_tree import RedBlackTree

class TestTrees(unittest.TestCase):
    def test_btree(self):
        btree = BTree(t=3)
        keys = [10, 20, 5, 6, 12, 30, 7, 17]
        for k in keys:
            btree.insert(k)

        res = btree.search(12)
        self.assertIsNotNone(res)
        self.assertEqual(res[0].keys[res[1]], 12)

        self.assertIsNone(btree.search(999))

    def test_red_black_tree(self):
        rbt = RedBlackTree()
        keys = [10, 20, 5, 6, 12, 30, 7, 17]
        for k in keys:
            rbt.insert(k)

        self.assertTrue(rbt.search(12))
        self.assertFalse(rbt.search(999))

if __name__ == '__main__':
    unittest.main()
