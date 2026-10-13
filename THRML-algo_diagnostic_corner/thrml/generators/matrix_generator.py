import random
from typing import List

def generate_matrix_chain_dims(length: int, min_dim: int = 5, max_dim: int = 100) -> List[int]:
    return [random.randint(min_dim, max_dim) for _ in range(length + 1)]
