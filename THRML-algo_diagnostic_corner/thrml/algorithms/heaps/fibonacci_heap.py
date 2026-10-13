import math
from typing import Optional, List, Tuple, Any
from algorithms.base import BaseAlgorithm, OperationCounters, MetricResult

class FibNode:
    def __init__(self, key: int, value: Any = None):
        self.key = key
        self.value = value
        self.degree = 0
        self.mark = False
        self.parent: Optional['FibNode'] = None
        self.child: Optional['FibNode'] = None
        self.left: 'FibNode' = self
        self.right: 'FibNode' = self

class FibonacciHeap(BaseAlgorithm):
    def __init__(self):
        super().__init__("Fibonacci Heap", "Advanced Data Structures")
        self.min_node: Optional[FibNode] = None
        self.num_nodes = 0

    def insert(self, key: int, value: Any = None) -> FibNode:
        self.ops.heap_ops += 1
        node = FibNode(key, value)
        if not self.min_node:
            self.min_node = node
        else:
            self._add_to_root_list(node)
            self.ops.comparisons += 1
            if node.key < self.min_node.key:
                self.min_node = node
        self.num_nodes += 1
        return node

    def _add_to_root_list(self, node: FibNode):
        node.left = self.min_node
        node.right = self.min_node.right
        self.min_node.right.left = node
        self.min_node.right = node
        node.parent = None

    def _remove_from_root_list(self, node: FibNode):
        node.left.right = node.right
        node.right.left = node.left

    def merge(self, other: 'FibonacciHeap'):
        self.ops.heap_ops += 1
        if not other.min_node:
            return
        if not self.min_node:
            self.min_node = other.min_node
            self.num_nodes = other.num_nodes
            return

        # Concatenate root lists
        l1 = self.min_node
        r1 = self.min_node.right
        l2 = other.min_node
        r2 = other.min_node.right

        l1.right = r2
        r2.left = l1
        l2.left = r1
        r1.right = l2

        self.ops.comparisons += 1
        if other.min_node.key < self.min_node.key:
            self.min_node = other.min_node

        self.num_nodes += other.num_nodes

    def extract_min(self) -> Optional[FibNode]:
        z = self.min_node
        if z is not None:
            self.ops.heap_ops += 1
            if z.child is not None:
                # Add children to root list
                children = []
                c = z.child
                while True:
                    children.append(c)
                    c = c.right
                    if c == z.child:
                        break
                for child in children:
                    self._add_to_root_list(child)
                    child.parent = None

            self._remove_from_root_list(z)
            if z == z.right:
                self.min_node = None
            else:
                self.min_node = z.right
                self._consolidate()
            self.num_nodes -= 1
        return z

    def _consolidate(self):
        max_deg = int(math.log2(self.num_nodes + 1)) + 5
        A: List[Optional[FibNode]] = [None] * max_deg

        roots = []
        if self.min_node:
            curr = self.min_node
            while True:
                roots.append(curr)
                curr = curr.right
                if curr == self.min_node:
                    break

        for w in roots:
            x = w
            d = x.degree
            while d < len(A) and A[d] is not None:
                y = A[d]
                self.ops.comparisons += 1
                if x.key > y.key:
                    x, y = y, x
                self._heap_link(y, x)
                A[d] = None
                d += 1
            if d < len(A):
                A[d] = x

        self.min_node = None
        for i in range(len(A)):
            if A[i] is not None:
                node = A[i]
                if self.min_node is None:
                    self.min_node = node
                    node.left = node
                    node.right = node
                else:
                    self._add_to_root_list(node)
                    self.ops.comparisons += 1
                    if node.key < self.min_node.key:
                        self.min_node = node

    def _heap_link(self, y: FibNode, x: FibNode):
        self.ops.heap_ops += 1
        self._remove_from_root_list(y)
        y.left = y
        y.right = y
        y.parent = x

        if x.child is None:
            x.child = y
        else:
            y.left = x.child
            y.right = x.child.right
            x.child.right.left = y
            x.child.right = y

        x.degree += 1
        y.mark = False

    def decrease_key(self, x: FibNode, k: int):
        self.ops.heap_ops += 1
        self.ops.comparisons += 1
        if k > x.key:
            raise ValueError("New key is greater than current key")
        x.key = k
        y = x.parent
        if y is not None and x.key < y.key:
            self._cut(x, y)
            self._cascading_cut(y)

        self.ops.comparisons += 1
        if self.min_node and x.key < self.min_node.key:
            self.min_node = x

    def _cut(self, x: FibNode, y: FibNode):
        self.ops.branches += 1  # count cuts
        if x.right == x:
            y.child = None
        else:
            x.left.right = x.right
            x.right.left = x.left
            if y.child == x:
                y.child = x.right
        y.degree -= 1
        self._add_to_root_list(x)
        x.parent = None
        x.mark = False

    def _cascading_cut(self, y: FibNode):
        z = y.parent
        if z is not None:
            if not y.mark:
                y.mark = True
            else:
                self._cut(y, z)
                self._cascading_cut(z)

    def delete(self, x: FibNode):
        self.ops.heap_ops += 1
        self.decrease_key(x, float('-inf'))
        self.extract_min()

    def run_workload(self, operations: List[Tuple[str, Any]]) -> MetricResult:
        import time, tracemalloc
        self.reset_counters()
        self.min_node = None
        self.num_nodes = 0

        tracemalloc.start()
        t0 = time.perf_counter()

        for op_type, arg in operations:
            if op_type == "insert":
                self.insert(arg)
            elif op_type == "extract_min":
                self.extract_min()
            elif op_type == "decrease_key":
                node, new_k = arg
                self.decrease_key(node, new_k)

        t1 = time.perf_counter()
        current, peak = tracemalloc.get_traced_memory()
        tracemalloc.stop()

        return MetricResult(
            algorithm_name=self.name,
            category=self.category,
            input_size_repr=f"{len(operations)} operations",
            input_n=len(operations),
            runtime_seconds=t1 - t0,
            memory_bytes=peak,
            operations=self.ops,
            output_summary=f"Final heap size: {self.num_nodes}"
        )
