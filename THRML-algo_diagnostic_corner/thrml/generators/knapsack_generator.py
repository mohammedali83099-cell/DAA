import random
from typing import List, Tuple

def generate_knapsack_items(num_items: int, max_val: int = 100, max_wt: int = 50) -> List[Tuple[int, int]]:
    items = []
    for _ in range(num_items):
        v = random.randint(10, max_val)
        w = random.randint(1, max_wt)
        items.append((v, w))
    return items

def generate_pathological_knapsack(num_items: int, capacity: int) -> List[Tuple[int, int]]:
    # High capacity, large items where greedy and DP show contrast
    items = []
    for i in range(num_items):
        v = 10 + (i * 2)
        w = 5 + (i * 3)
        items.append((v, w))
    return items
