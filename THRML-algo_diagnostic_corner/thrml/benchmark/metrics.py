from dataclasses import dataclass
from typing import Dict, Any, List
from algorithms.base import MetricResult

@dataclass
class ScalabilitySeries:
    algorithm_name: str
    category: str
    test_family: str
    input_sizes: List[int]
    runtimes: List[float]
    memory_usages: List[int]
    total_operations: List[int]
    results: List[MetricResult]
    empirical_exponent: float = 0.0
