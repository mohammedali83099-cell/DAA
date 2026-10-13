from typing import Optional, List, Any
from algorithms.base import BaseAlgorithm, OperationCounters, MetricResult

RED = True
BLACK = False

class RBNode:
    def __init__(self, key: int, color: bool = RED):
        self.key = key
        self.color = color
        self.left: Optional['RBNode'] = None
        self.right: Optional['RBNode'] = None
        self.parent: Optional['RBNode'] = None

class RedBlackTree(BaseAlgorithm):
    def __init__(self):
        super().__init__("Red-Black Tree", "Advanced Data Structures")
        self.NIL = RBNode(0, color=BLACK)
        self.root: RBNode = self.NIL

    def _left_rotate(self, x: RBNode):
        self.ops.tree_rotations += 1
        y = x.right
        x.right = y.left
        if y.left != self.NIL:
            y.left.parent = x
        y.parent = x.parent
        if x.parent == self.NIL or x.parent is None:
            self.root = y
        elif x == x.parent.left:
            x.parent.left = y
        else:
            x.parent.right = y
        y.left = x
        x.parent = y

    def _right_rotate(self, x: RBNode):
        self.ops.tree_rotations += 1
        y = x.left
        x.left = y.right
        if y.right != self.NIL:
            y.right.parent = x
        y.parent = x.parent
        if x.parent == self.NIL or x.parent is None:
            self.root = y
        elif x == x.parent.right:
            x.parent.right = y
        else:
            x.parent.left = y
        y.right = x
        x.parent = y

    def insert(self, key: int):
        node = RBNode(key, color=RED)
        node.left = self.NIL
        node.right = self.NIL

        y = None
        x = self.root
        while x != self.NIL:
            y = x
            self.ops.comparisons += 1
            if node.key < x.key:
                x = x.left
            else:
                x = x.right

        node.parent = y
        if y is None or y == self.NIL:
            self.root = node
        elif node.key < y.key:
            y.left = node
        else:
            y.right = node

        if node.parent is None or node.parent == self.NIL:
            node.color = BLACK
            self.ops.tree_recolors += 1
            return

        if node.parent.parent is None or node.parent.parent == self.NIL:
            return

        self._insert_fixup(node)

    def _insert_fixup(self, k: RBNode):
        while k.parent and k.parent.color == RED:
            if k.parent == k.parent.parent.left:
                u = k.parent.parent.right
                if u.color == RED:
                    u.color = BLACK
                    k.parent.color = BLACK
                    k.parent.parent.color = RED
                    self.ops.tree_recolors += 3
                    k = k.parent.parent
                else:
                    if k == k.parent.right:
                        k = k.parent
                        self._left_rotate(k)
                    k.parent.color = BLACK
                    k.parent.parent.color = RED
                    self.ops.tree_recolors += 2
                    self._right_rotate(k.parent.parent)
            else:
                u = k.parent.parent.left
                if u.color == RED:
                    u.color = BLACK
                    k.parent.color = BLACK
                    k.parent.parent.color = RED
                    self.ops.tree_recolors += 3
                    k = k.parent.parent
                else:
                    if k == k.parent.left:
                        k = k.parent
                        self._right_rotate(k)
                    k.parent.color = BLACK
                    k.parent.parent.color = RED
                    self.ops.tree_recolors += 2
                    self._left_rotate(k.parent.parent)
            if k == self.root:
                break
        self.root.color = BLACK

    def search(self, key: int) -> bool:
        curr = self.root
        while curr != self.NIL:
            self.ops.comparisons += 1
            if key == curr.key:
                return True
            elif key < curr.key:
                curr = curr.left
            else:
                curr = curr.right
        return False

    def run_workload(self, keys: List[int]) -> MetricResult:
        import time, tracemalloc
        self.reset_counters()
        self.NIL = RBNode(0, color=BLACK)
        self.root = self.NIL

        tracemalloc.start()
        t0 = time.perf_counter()

        for k in keys:
            self.insert(k)

        for k in keys[::2]:
            self.search(k)

        t1 = time.perf_counter()
        current, peak = tracemalloc.get_traced_memory()
        tracemalloc.stop()

        return MetricResult(
            algorithm_name=self.name,
            category=self.category,
            input_size_repr=f"N={len(keys)} keys",
            input_n=len(keys),
            runtime_seconds=t1 - t0,
            memory_bytes=peak,
            operations=self.ops,
            output_summary=f"RB-Tree with {self.ops.tree_rotations} rotations, {self.ops.tree_recolors} recolors"
        )
