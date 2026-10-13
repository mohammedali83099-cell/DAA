import random
from typing import Dict, List, Tuple

INF = float('inf')

def generate_graph_adj_list(vertices: int, density: float = 0.3, max_weight: float = 100.0) -> Tuple[Dict[int, List[Tuple[int, float]]], List[Tuple[float, int, int]]]:
    adj_list: Dict[int, List[Tuple[int, float]]] = {i: [] for i in range(vertices)}
    edges = []

    # Guarantee connected component first via spanning line
    for i in range(vertices - 1):
        w = round(random.uniform(1.0, max_weight), 2)
        adj_list[i].append((i + 1, w))
        adj_list[i + 1].append((i, w))
        edges.append((w, i, i + 1))

    # Add random edges according to density
    possible_edges = (vertices * (vertices - 1)) // 2
    target_edges = int(possible_edges * density)

    existing_set = set((min(u, v), max(u, v)) for u in range(vertices) for v, _ in adj_list[u])

    while len(edges) < target_edges and len(existing_set) < possible_edges:
        u = random.randint(0, vertices - 1)
        v = random.randint(0, vertices - 1)
        if u != v:
            edge_key = (min(u, v), max(u, v))
            if edge_key not in existing_set:
                existing_set.add(edge_key)
                w = round(random.uniform(1.0, max_weight), 2)
                adj_list[u].append((v, w))
                adj_list[v].append((u, w))
                edges.append((w, u, v))

    return adj_list, edges

def generate_dist_matrix(vertices: int, density: float = 0.5, max_weight: float = 50.0) -> List[List[float]]:
    adj_list, edges = generate_graph_adj_list(vertices, density, max_weight)
    dist = [[INF] * vertices for _ in range(vertices)]

    for i in range(vertices):
        dist[i][i] = 0.0

    for u in adj_list:
        for v, w in adj_list[u]:
            dist[u][v] = w

    return dist

def generate_hamiltonian_graph(vertices: int, has_cycle: bool = True, density: float = 0.3) -> List[List[int]]:
    matrix = [[0] * vertices for _ in range(vertices)]

    # Random density edges
    for i in range(vertices):
        for j in range(i + 1, vertices):
            if random.random() < density:
                matrix[i][j] = 1
                matrix[j][i] = 1

    if has_cycle:
        # Embed a Hamiltonian cycle 0 -> 1 -> 2 ... -> vertices-1 -> 0
        perm = list(range(vertices))
        random.shuffle(perm)
        for i in range(vertices):
            u = perm[i]
            v = perm[(i + 1) % vertices]
            matrix[u][v] = 1
            matrix[v][u] = 1

    return matrix
