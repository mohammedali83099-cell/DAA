from typing import Optional, List, Tuple, Any
from algorithms.base import BaseAlgorithm, OperationCounters, MetricResult

class BTreeNode:
    def __init__(self, t: int, leaf: bool = True):
        self.t = t  # Minimum degree
        self.leaf = leaf
        self.keys: List[int] = []
        self.children: List['BTreeNode'] = []

class BTree(BaseAlgorithm):
    def __init__(self, t: int = 3):
        super().__init__("B-Tree", "Advanced Data Structures")
        self.t = t
        self.root: Optional[BTreeNode] = None

    def search(self, k: int, node: Optional[BTreeNode] = None) -> Optional[Tuple[BTreeNode, int]]:
        if node is None:
            node = self.root
        if node is None:
            return None

        i = 0
        while i < len(node.keys):
            self.ops.comparisons += 1
            if k > node.keys[i]:
                i += 1
            else:
                break

        if i < len(node.keys) and node.keys[i] == k:
            return (node, i)

        if node.leaf:
            return None

        return self.search(k, node.children[i])

    def insert(self, k: int):
        self.ops.search_states += 1
        if self.root is None:
            self.root = BTreeNode(self.t, leaf=True)
            self.root.keys.append(k)
            return

        r = self.root
        if len(r.keys) == (2 * self.t - 1):
            s = BTreeNode(self.t, leaf=False)
            self.root = s
            s.children.append(r)
            self._split_child(s, 0, r)
            self._insert_non_full(s, k)
        else:
            self._insert_non_full(r, k)

    def _split_child(self, parent: BTreeNode, i: int, child: BTreeNode):
        self.ops.tree_splits += 1
        t = self.t
        z = BTreeNode(t, leaf=child.leaf)
        z.keys = child.keys[t:]
        child.keys = child.keys[:t - 1]

        if not child.leaf:
            z.children = child.children[t:]
            child.children = child.children[:t]

        parent.children.insert(i + 1, z)
        parent.keys.insert(i, child.keys.pop())

    def _insert_non_full(self, node: BTreeNode, k: int):
        i = len(node.keys) - 1
        if node.leaf:
            node.keys.append(0)
            while i >= 0 and k < node.keys[i]:
                self.ops.comparisons += 1
                self.ops.swaps += 1
                node.keys[i + 1] = node.keys[i]
                i -= 1
            if i >= 0:
                self.ops.comparisons += 1
            node.keys[i + 1] = k
        else:
            while i >= 0 and k < node.keys[i]:
                self.ops.comparisons += 1
                i -= 1
            if i >= 0:
                self.ops.comparisons += 1
            i += 1
            if len(node.children[i].keys) == (2 * self.t - 1):
                self._split_child(node, i, node.children[i])
                if k > node.keys[i]:
                    i += 1
            self._insert_non_full(node.children[i], k)

    def delete(self, k: int):
        # Simplified B-tree deletion tracking operation
        self.ops.search_states += 1
        if not self.root:
            return
        self._delete_key(self.root, k)
        if len(self.root.keys) == 0:
            if self.root.leaf:
                self.root = None
            else:
                self.root = self.root.children[0]

    def _delete_key(self, node: BTreeNode, k: int):
        idx = 0
        while idx < len(node.keys) and node.keys[idx] < k:
            self.ops.comparisons += 1
            idx += 1
        if idx < len(node.keys) and node.keys[idx] == k:
            self.ops.comparisons += 1
            if node.leaf:
                node.keys.pop(idx)
            else:
                # Replace with predecessor
                pred = node.children[idx]
                while not pred.leaf:
                    pred = pred.children[-1]
                pred_key = pred.keys[-1]
                node.keys[idx] = pred_key
                self._delete_key(node.children[idx], pred_key)
        elif not node.leaf:
            self._delete_key(node.children[idx], k)

    def run_workload(self, keys: List[int]) -> MetricResult:
        import time, tracemalloc
        self.reset_counters()
        self.root = None

        tracemalloc.start()
        t0 = time.perf_counter()

        for k in keys:
            self.insert(k)

        # Search half
        for k in keys[::2]:
            self.search(k)

        t1 = time.perf_counter()
        current, peak = tracemalloc.get_traced_memory()
        tracemalloc.stop()

        return MetricResult(
            algorithm_name=self.name,
            category=self.category,
            input_size_repr=f"N={len(keys)} keys, t={self.t}",
            input_n=len(keys),
            runtime_seconds=t1 - t0,
            memory_bytes=peak,
            operations=self.ops,
            output_summary=f"B-Tree built with {self.ops.tree_splits} node splits"
        )
