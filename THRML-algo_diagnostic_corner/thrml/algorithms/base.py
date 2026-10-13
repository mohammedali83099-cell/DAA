import time
import tracemalloc
from typing import Dict, Any, Optional
from dataclasses import dataclass, field

@dataclass
class OperationCounters:
    comparisons: int = 0
    swaps: int = 0
    relaxations: int = 0
    dp_states: int = 0
    heap_ops: int = 0
    tree_rotations: int = 0
    tree_recolors: int = 0
    tree_splits: int = 0
    search_states: int = 0
    branches: int = 0
    pruned_states: int = 0

    def total_operations(self) -> int:
        return (
            self.comparisons + self.swaps + self.relaxations + self.dp_states +
            self.heap_ops + self.tree_rotations + self.tree_recolors + self.tree_splits +
            self.search_states + self.branches + self.pruned_states
        )

    def to_dict(self) -> Dict[str, int]:
        return {
            "comparisons": self.comparisons,
            "swaps": self.swaps,
            "relaxations": self.relaxations,
            "dp_states": self.dp_states,
            "heap_ops": self.heap_ops,
            "tree_rotations": self.tree_rotations,
            "tree_recolors": self.tree_recolors,
            "tree_splits": self.tree_splits,
            "search_states": self.search_states,
            "branches": self.branches,
            "pruned_states": self.pruned_states,
            "total_ops": self.total_operations()
        }

@dataclass
class MetricResult:
    algorithm_name: str
    category: str
    input_size_repr: str
    input_n: int
    runtime_seconds: float
    memory_bytes: int
    operations: OperationCounters
    output_summary: Any = None
    timed_out: bool = False
    details: Dict[str, Any] = field(default_factory=dict)

class BaseAlgorithm:
    def __init__(self, name: str, category: str):
        self.name = name
        self.category = category
        self.ops = OperationCounters()

    def reset_counters(self):
        self.ops = OperationCounters()

    def run(self, *args, **kwargs) -> MetricResult:
        raise NotImplementedError
