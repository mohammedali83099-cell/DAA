import random
from typing import List

def generate_sorted_sequence(n: int) -> List[int]:
    return list(range(1, n + 1))

def generate_reverse_sorted_sequence(n: int) -> List[int]:
    return list(range(n, 0, -1))

def generate_duplicate_heavy_sequence(n: int, num_unique: int = 5) -> List[int]:
    choices = [random.randint(1, 100) for _ in range(num_unique)]
    return [random.choice(choices) for _ in range(n)]

def generate_random_sequence(n: int) -> List[int]:
    seq = list(range(1, n + 1))
    random.shuffle(seq)
    return seq
