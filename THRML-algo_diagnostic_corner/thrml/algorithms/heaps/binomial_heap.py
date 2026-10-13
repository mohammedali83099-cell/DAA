from typing import Optional, List, Tuple, Any
from algorithms.base import BaseAlgorithm, OperationCounters, MetricResult

class BinomialNode:
    def __init__(self, key: int, value: object = None):
        self.key = key
        self.value = value
        self.degree = 0
        self.parent: Optional['BinomialNode'] = None
        self.child: Optional['BinomialNode'] = None
        self.sibling: Optional['BinomialNode'] = None

class BinomialHeap(BaseAlgorithm):
    def __init__(self):
        super().__init__("Binomial Heap", "Advanced Data Structures")
        self.head: Optional[BinomialNode] = None

    def _link_trees(self, min_node: BinomialNode, other: BinomialNode):
        self.ops.heap_ops += 1
        other.parent = min_node
        other.sibling = min_node.child
        min_node.child = other
        min_node.degree += 1

    def _merge_roots(self, h1: Optional[BinomialNode], h2: Optional[BinomialNode]) -> Optional[BinomialNode]:
        if not h1:
            return h2
        if not h2:
            return h1

        dummy = BinomialNode(0)
        tail = dummy

        curr1, curr2 = h1, h2
        while curr1 and curr2:
            self.ops.comparisons += 1
            if curr1.degree <= curr2.degree:
                tail.sibling = curr1
                curr1 = curr1.sibling
            else:
                tail.sibling = curr2
                curr2 = curr2.sibling
            tail = tail.sibling

        if curr1:
            tail.sibling = curr1
        else:
            tail.sibling = curr2

        return dummy.sibling

    def union(self, h2: Optional[BinomialNode]):
        self.ops.heap_ops += 1
        new_head = self._merge_roots(self.head, h2)
        if not new_head:
            self.head = None
            return

        prev = None
        curr = new_head
        next_node = curr.sibling

        while next_node:
            self.ops.comparisons += 1
            if (curr.degree != next_node.degree) or (next_node.sibling and next_node.sibling.degree == curr.degree):
                prev = curr
                curr = next_node
            else:
                self.ops.comparisons += 1
                if curr.key <= next_node.key:
                    curr.sibling = next_node.sibling
                    self._link_trees(curr, next_node)
                else:
                    if prev is None:
                        new_head = next_node
                    else:
                        prev.sibling = next_node
                    self._link_trees(next_node, curr)
                    curr = next_node
            next_node = curr.sibling

        self.head = new_head

    def insert(self, key: int, value: object = None) -> BinomialNode:
        self.ops.heap_ops += 1
        node = BinomialNode(key, value)
        self.union(node)
        return node

    def get_min(self) -> Optional[BinomialNode]:
        if not self.head:
            return None
        min_node = self.head
        curr = self.head.sibling
        while curr:
            self.ops.comparisons += 1
            if curr.key < min_node.key:
                min_node = curr
            curr = curr.sibling
        return min_node

    def extract_min(self) -> Optional[BinomialNode]:
        if not self.head:
            return None
        self.ops.heap_ops += 1

        min_node = self.head
        min_prev = None
        prev = self.head
        curr = self.head.sibling

        while curr:
            self.ops.comparisons += 1
            if curr.key < min_node.key:
                min_node = curr
                min_prev = prev
            prev = curr
            curr = curr.sibling

        if min_prev is None:
            self.head = min_node.sibling
        else:
            min_prev.sibling = min_node.sibling

        # Reverse children of min_node
        child = min_node.child
        rev_children = None
        while child:
            nxt = child.sibling
            child.sibling = rev_children
            child.parent = None
            rev_children = child
            child = nxt

        self.union(rev_children)
        return min_node

    def decrease_key(self, node: BinomialNode, new_key: int):
        self.ops.heap_ops += 1
        self.ops.comparisons += 1
        if new_key > node.key:
            raise ValueError("New key is greater than current key")
        node.key = new_key
        curr = node
        parent = curr.parent

        while parent:
            self.ops.comparisons += 1
            if curr.key < parent.key:
                self.ops.swaps += 1
                curr.key, parent.key = parent.key, curr.key
                curr.value, parent.value = parent.value, curr.value
                curr = parent
                parent = curr.parent
            else:
                break

    def delete(self, node: BinomialNode):
        self.ops.heap_ops += 1
        self.decrease_key(node, float('-inf'))
        self.extract_min()

    def run_workload(self, operations: List[Tuple[str, Any]]) -> MetricResult:
        import time, tracemalloc
        self.reset_counters()
        self.head = None

        tracemalloc.start()
        t0 = time.perf_counter()

        for op_type, arg in operations:
            if op_type == "insert":
                self.insert(arg)
            elif op_type == "extract_min":
                self.extract_min()
            elif op_type == "decrease_key":
                # arg is (node, new_key)
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
            output_summary=f"Final heap active: {self.head is not None}"
        )
