#!/usr/bin/env python3
import os
import sys
import json
import time
from flask import Flask, request, jsonify, send_from_directory

# Ensure thrml root is in sys.path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from benchmark.runner import BenchmarkRunner
from benchmark.complexity import COMPLEXITY_TABLE, estimate_growth_exponent
from risk.classifier import RiskClassifier, RiskAssessment
from reports.exporter import ReportExporter

DIST_DIR = os.path.join(BASE_DIR, "..", "web", "dist")

app = Flask(__name__, static_folder=DIST_DIR if os.path.exists(DIST_DIR) else None)
runner = BenchmarkRunner()
exporter = ReportExporter()

@app.after_request
def after_request(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
    return response

# Catalog of the 13 syllabus algorithms
ALGORITHMS_CATALOG = [
    {
        "id": "binomial_heap",
        "name": "Binomial Heap",
        "category": "Advanced Data Structures",
        "timeComplexity": "O(log n)",
        "spaceComplexity": "O(n)",
        "problemClass": "Polynomial",
        "decisionOptimization": "N/A (Data Structure)",
        "description": "Collection of binomial trees satisfying min-heap property. Tracks binomial tree mergers and key comparisons.",
        "defaultParams": {"n": 2000, "workload": "random"}
    },
    {
        "id": "fibonacci_heap",
        "name": "Fibonacci Heap",
        "category": "Advanced Data Structures",
        "timeComplexity": "O(1) amortized insert / O(log n) extract-min",
        "spaceComplexity": "O(n)",
        "problemClass": "Polynomial",
        "decisionOptimization": "N/A (Data Structure)",
        "description": "Lazy tree structure with O(1) amortized insert/decrease-key. Tracks cascading cuts and root consolidations.",
        "defaultParams": {"n": 2000, "workload": "random"}
    },
    {
        "id": "btree",
        "name": "B-Tree",
        "category": "Advanced Data Structures",
        "timeComplexity": "O(log n)",
        "spaceComplexity": "O(n)",
        "problemClass": "Polynomial",
        "decisionOptimization": "N/A (Data Structure)",
        "description": "Self-balancing multi-way search tree (t=3). Measures key comparisons, node splits, and tree height.",
        "defaultParams": {"n": 2500, "workload": "sorted"}
    },
    {
        "id": "red_black_tree",
        "name": "Red-Black Tree",
        "category": "Advanced Data Structures",
        "timeComplexity": "O(log n)",
        "spaceComplexity": "O(n)",
        "problemClass": "Polynomial",
        "decisionOptimization": "N/A (Data Structure)",
        "description": "Balanced binary search tree with red/black invariants. Tracks left/right rotations and node recolorings.",
        "defaultParams": {"n": 2500, "workload": "sorted"}
    },
    {
        "id": "prim",
        "name": "Prim's Algorithm",
        "category": "Minimum Spanning Tree",
        "timeComplexity": "O(E log V)",
        "spaceComplexity": "O(V + E)",
        "problemClass": "Polynomial",
        "decisionOptimization": "Optimization",
        "description": "Greedy MST growth using priority queue and adjacency lists. Measures vertex visits and edge relaxations.",
        "defaultParams": {"vertices": 150, "density": 0.3}
    },
    {
        "id": "kruskal",
        "name": "Kruskal's Algorithm",
        "category": "Minimum Spanning Tree",
        "timeComplexity": "O(E log V)",
        "spaceComplexity": "O(V + E)",
        "problemClass": "Polynomial",
        "decisionOptimization": "Optimization",
        "description": "Greedy MST building by edge sorting and Disjoint Set Union (DSU) with path compression and union by rank.",
        "defaultParams": {"vertices": 150, "density": 0.3}
    },
    {
        "id": "fractional_knapsack",
        "name": "Fractional Knapsack",
        "category": "Greedy",
        "timeComplexity": "O(n log n)",
        "spaceComplexity": "O(n)",
        "problemClass": "Polynomial",
        "decisionOptimization": "Optimization (Exact Greedy)",
        "description": "Optimal divisible item selection via greedy value-to-weight ratio sorting.",
        "defaultParams": {"n_items": 150, "capacity": 500.0}
    },
    {
        "id": "knapsack_01",
        "name": "0/1 Knapsack",
        "category": "Dynamic Programming",
        "timeComplexity": "O(n · W) [Pseudo-polynomial]",
        "spaceComplexity": "O(n · W)",
        "problemClass": "Pseudo-polynomial (NP-Complete decision variant)",
        "decisionOptimization": "Optimization (Decision: Is Value >= K?)",
        "description": "Exact 0/1 optimization over indivisible items using a DP table. Exposes memory and time surges when capacity W scales.",
        "defaultParams": {"n_items": 150, "capacity": 500}
    },
    {
        "id": "floyd_warshall",
        "name": "Floyd-Warshall",
        "category": "Dynamic Programming",
        "timeComplexity": "O(V³)",
        "spaceComplexity": "O(V²)",
        "problemClass": "Polynomial (Cubic)",
        "decisionOptimization": "Optimization",
        "description": "All-pairs shortest paths via dynamic programming. Measures triple-nested loop iterations and matrix cell updates.",
        "defaultParams": {"vertices": 80}
    },
    {
        "id": "matrix_chain",
        "name": "Matrix Chain Multiplication",
        "category": "Dynamic Programming",
        "timeComplexity": "O(n³)",
        "spaceComplexity": "O(n²)",
        "problemClass": "Polynomial (Cubic)",
        "decisionOptimization": "Optimization",
        "description": "Computes optimal parenthesization of matrix chains. Tracks subproblem evaluations and scalar multiplication checks.",
        "defaultParams": {"chain_length": 25}
    },
    {
        "id": "hamiltonian",
        "name": "Hamiltonian Problem",
        "category": "Backtracking / Branch & Bound",
        "timeComplexity": "O(2ⁿ · n²)",
        "spaceComplexity": "O(n)",
        "problemClass": "NP-Complete (Decision)",
        "decisionOptimization": "Decision (Does a cycle exist?)",
        "description": "Backtracking search for a cycle visiting every vertex exactly once. Measures search states explored and dead-end backtracks.",
        "defaultParams": {"vertices": 12, "has_cycle": True}
    },
    {
        "id": "nqueen",
        "name": "N-Queen Problem",
        "category": "Backtracking / Branch & Bound",
        "timeComplexity": "O(N!) worst-case",
        "spaceComplexity": "O(N)",
        "problemClass": "Exponential / Factorial",
        "decisionOptimization": "Decision / Solution Search",
        "description": "Placement of N non-attacking queens on N×N board. Measures board states generated vs pruned and backtracks.",
        "defaultParams": {"n": 10}
    },
    {
        "id": "tsp",
        "name": "Travelling Salesperson Problem",
        "category": "Backtracking / Branch & Bound",
        "timeComplexity": "O(n! / 2ⁿ)",
        "spaceComplexity": "O(n)",
        "problemClass": "NP-Hard (Optimization) / NP-Complete (Decision)",
        "decisionOptimization": "Optimization (Decision: Is Tour <= L?)",
        "description": "Exact branch-and-bound / backtracking search for minimum distance tour. Measures explored vs pruned permutations.",
        "defaultParams": {"cities": 9}
    }
]

def format_result(res, risk: RiskAssessment):
    ops_dict = res.operations.to_dict() if hasattr(res.operations, "to_dict") else {}
    return {
        "algorithm_name": res.algorithm_name,
        "category": res.category,
        "input_size_repr": res.input_size_repr,
        "input_n": res.input_n,
        "runtime_seconds": res.runtime_seconds,
        "runtime_ms": round(res.runtime_seconds * 1000, 3),
        "memory_bytes": res.memory_bytes,
        "memory_kb": round(res.memory_bytes / 1024, 2),
        "memory_mb": round(res.memory_bytes / (1024 * 1024), 3),
        "timed_out": res.timed_out,
        "operations": ops_dict,
        "details": res.details,
        "risk": {
            "risk_level": risk.risk_level,
            "runtime_growth": risk.runtime_growth,
            "memory_growth": risk.memory_growth,
            "scalability_risk": risk.scalability_risk,
            "reason": risk.reason,
            "algorithm_name": risk.algorithm_name,
            "input_size_repr": risk.input_size_repr
        }
    }

@app.route("/api/status", methods=["GET"])
def get_status():
    return jsonify({
        "status": "READY",
        "total_algorithms": 13,
        "experiments_run": len(runner.history),
        "test_families": ["NORMAL", "LARGE", "PATHOLOGICAL", "BOUNDARY", "STRUCTURED", "SCALABILITY"]
    })

@app.route("/api/algorithms", methods=["GET"])
def get_algorithms():
    return jsonify(ALGORITHMS_CATALOG)

@app.route("/api/test", methods=["POST"])
def run_test():
    data = request.json or {}
    algo_id = data.get("algorithm", "floyd")
    params = data.get("params", {})
    workload = params.get("workload", "random")

    try:
        if algo_id in ["binomial_heap", "fibonacci_heap"]:
            algo_name = "Binomial Heap" if algo_id == "binomial_heap" else "Fibonacci Heap"
            n_ops = int(params.get("n", 2000))
            res, risk = runner.run_heap_benchmark(algo_name, n_ops, workload_type=workload)

        elif algo_id in ["btree", "red_black_tree"]:
            algo_name = "B-Tree" if algo_id == "btree" else "Red-Black Tree"
            n = int(params.get("n", 2500))
            res, risk = runner.run_tree_benchmark(algo_name, n, workload_type=workload)

        elif algo_id in ["prim", "kruskal"]:
            algo_name = "Prim" if algo_id == "prim" else "Kruskal"
            v = int(params.get("vertices", 150))
            density = float(params.get("density", 0.3))
            res, risk = runner.run_mst_benchmark(algo_name, v, density=density)

        elif algo_id == "fractional_knapsack":
            n_items = int(params.get("n_items", 150))
            capacity = float(params.get("capacity", 500.0))
            res, risk = runner.run_knapsack_benchmark("Fractional Knapsack", n_items, capacity)

        elif algo_id == "knapsack_01":
            n_items = int(params.get("n_items", 150))
            capacity = int(params.get("capacity", 500))
            res, risk = runner.run_knapsack_benchmark("0/1 Knapsack", n_items, capacity)

        elif algo_id == "floyd_warshall":
            v = int(params.get("vertices", 80))
            res, risk = runner.run_floyd_benchmark(v)

        elif algo_id == "matrix_chain":
            chain = int(params.get("chain_length", 25))
            res, risk = runner.run_matrix_benchmark(chain)

        elif algo_id == "hamiltonian":
            v = int(params.get("vertices", 12))
            has_cycle = bool(params.get("has_cycle", True))
            res, risk = runner.run_hamiltonian_benchmark(v, has_cycle=has_cycle)

        elif algo_id == "nqueen":
            n = int(params.get("n", 10))
            res, risk = runner.run_nqueen_benchmark(n)

        elif algo_id == "tsp":
            cities = int(params.get("cities", 9))
            res, risk = runner.run_tsp_benchmark(cities)

        else:
            return jsonify({"error": f"Unknown algorithm ID: {algo_id}"}), 400

        return jsonify(format_result(res, risk))

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/compare", methods=["POST"])
def run_compare():
    data = request.json or {}
    category = data.get("category", "mst").lower()

    try:
        if category == "mst":
            sparse_density = float(data.get("sparse_density", 0.1))
            dense_density = float(data.get("dense_density", 0.8))
            vertices_list = [50, 100, 200, 350]

            sparse_data = []
            for v in vertices_list:
                p_res, p_risk = runner.run_mst_benchmark("Prim", v, density=sparse_density)
                k_res, k_risk = runner.run_mst_benchmark("Kruskal", v, density=sparse_density)
                sparse_data.append({
                    "vertices": v,
                    "prim_ms": round(p_res.runtime_seconds * 1000, 3),
                    "kruskal_ms": round(k_res.runtime_seconds * 1000, 3),
                    "prim_risk": p_risk.risk_level,
                    "kruskal_risk": k_risk.risk_level,
                    "prim_ops": p_res.operations.total_operations(),
                    "kruskal_ops": k_res.operations.total_operations()
                })

            dense_data = []
            for v in vertices_list:
                p_res, p_risk = runner.run_mst_benchmark("Prim", v, density=dense_density)
                k_res, k_risk = runner.run_mst_benchmark("Kruskal", v, density=dense_density)
                dense_data.append({
                    "vertices": v,
                    "prim_ms": round(p_res.runtime_seconds * 1000, 3),
                    "kruskal_ms": round(k_res.runtime_seconds * 1000, 3),
                    "prim_risk": p_risk.risk_level,
                    "kruskal_risk": k_risk.risk_level,
                    "prim_ops": p_res.operations.total_operations(),
                    "kruskal_ops": k_res.operations.total_operations()
                })

            return jsonify({
                "category": "mst",
                "title": "Prim vs. Kruskal Minimum Spanning Tree",
                "sparse_density": sparse_density,
                "dense_density": dense_density,
                "sparse_results": sparse_data,
                "dense_results": dense_data,
                "theory": {
                    "prim": "O(E log V) with min-heap and adjacency lists; highly efficient for dense graphs where E ≈ V².",
                    "kruskal": "O(E log V) dominated by sorting edges; excels on sparse graphs with few edges where E ≈ V."
                }
            })

        elif category == "knapsack":
            capacities = [100, 500, 1500, 3000]
            items_count = 100
            results = []
            for cap in capacities:
                f_res, f_risk = runner.run_knapsack_benchmark("Fractional Knapsack", items_count, float(cap))
                k_res, k_risk = runner.run_knapsack_benchmark("0/1 Knapsack", items_count, cap)
                results.append({
                    "capacity": cap,
                    "items": items_count,
                    "fractional_ms": round(f_res.runtime_seconds * 1000, 3),
                    "knapsack01_ms": round(k_res.runtime_seconds * 1000, 3),
                    "fractional_mem_kb": round(f_res.memory_bytes / 1024, 2),
                    "knapsack01_mem_kb": round(k_res.memory_bytes / 1024, 2),
                    "knapsack01_dp_states": k_res.operations.dp_states,
                    "fractional_risk": f_risk.risk_level,
                    "knapsack01_risk": k_risk.risk_level
                })

            return jsonify({
                "category": "knapsack",
                "title": "Fractional (Greedy) vs. 0/1 (Dynamic Programming) Knapsack",
                "results": results,
                "theory": {
                    "fractional": "Greedy choice property holds (divisible items). O(n log n) time independent of capacity W.",
                    "knapsack01": "0/1 choice property requires DP table. O(n · W) pseudo-polynomial time: memory & runtime scale linearly with capacity W."
                }
            })

        elif category == "heaps":
            op_sizes = [1000, 3000, 6000, 10000]
            results = []
            for n in op_sizes:
                b_res, b_risk = runner.run_heap_benchmark("Binomial Heap", n, "random")
                f_res, f_risk = runner.run_heap_benchmark("Fibonacci Heap", n, "random")
                results.append({
                    "operations": n,
                    "binomial_ms": round(b_res.runtime_seconds * 1000, 3),
                    "fibonacci_ms": round(f_res.runtime_seconds * 1000, 3),
                    "binomial_heap_ops": b_res.operations.heap_ops,
                    "fibonacci_heap_ops": f_res.operations.heap_ops,
                    "binomial_risk": b_risk.risk_level,
                    "fibonacci_risk": f_risk.risk_level
                })

            return jsonify({
                "category": "heaps",
                "title": "Binomial Heap vs. Fibonacci Heap",
                "results": results,
                "theory": {
                    "binomial": "Rigid forest of binomial trees. Insert O(1) amortized / O(log n) worst, Extract-Min O(log n).",
                    "fibonacci": "Lazy min-tree list with cascading cuts. Insert O(1) amortized, Decrease-Key O(1) amortized, Extract-Min O(log n) amortized."
                }
            })

        elif category == "trees":
            sizes = [1000, 2500, 5000, 8000]
            results = []
            for n in sizes:
                b_res, b_risk = runner.run_tree_benchmark("B-Tree", n, "sorted")
                r_res, r_risk = runner.run_tree_benchmark("Red-Black Tree", n, "sorted")
                results.append({
                    "keys": n,
                    "btree_ms": round(b_res.runtime_seconds * 1000, 3),
                    "rbt_ms": round(r_res.runtime_seconds * 1000, 3),
                    "btree_splits": b_res.operations.tree_splits,
                    "rbt_rotations": r_res.operations.tree_rotations,
                    "rbt_recolors": r_res.operations.tree_recolors,
                    "btree_risk": b_risk.risk_level,
                    "rbt_risk": r_risk.risk_level
                })

            return jsonify({
                "category": "trees",
                "title": "B-Tree vs. Red-Black Tree (Pathological Sorted Keys)",
                "results": results,
                "theory": {
                    "btree": "Multi-way self-balancing search tree. Splits parent nodes on overflow. Ideal for disk and block caching.",
                    "rbt": "Binary search tree with Red-Black coloring. Left/Right rotations and recolorings prevent degenerate O(n) skew on pre-sorted input."
                }
            })

        return jsonify({"error": f"Unknown category: {category}"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/benchmark-series", methods=["POST"])
def run_benchmark_series():
    data = request.json or {}
    algo = data.get("algorithm", "floyd")
    
    sizes = data.get("sizes")
    if not sizes:
        if algo in ["floyd", "floyd_warshall"]:
            sizes = [20, 40, 70, 100, 140]
        elif algo in ["matrix_chain", "mcm"]:
            sizes = [10, 20, 30, 40, 50]
        elif algo == "nqueen":
            sizes = [6, 8, 10, 12, 13]
        elif algo == "tsp":
            sizes = [5, 7, 8, 9, 10]
        elif algo == "hamiltonian":
            sizes = [6, 8, 10, 12, 14]
        else:
            sizes = [50, 100, 200, 300, 400]

    series = []
    prev_n = None
    prev_t = None

    for s in sizes:
        if algo in ["floyd", "floyd_warshall"]:
            res, risk = runner.run_floyd_benchmark(s)
            theoretical_relative = (s / sizes[0]) ** 3
        elif algo in ["matrix_chain", "mcm"]:
            res, risk = runner.run_matrix_benchmark(s)
            theoretical_relative = (s / sizes[0]) ** 3
        elif algo == "nqueen":
            res, risk = runner.run_nqueen_benchmark(s)
            theoretical_relative = math.factorial(s) / math.factorial(sizes[0]) if s <= 12 else 1000
        elif algo == "tsp":
            res, risk = runner.run_tsp_benchmark(s)
            theoretical_relative = math.factorial(s) / math.factorial(sizes[0]) if s <= 10 else 1000
        elif algo == "hamiltonian":
            res, risk = runner.run_hamiltonian_benchmark(s)
            theoretical_relative = (2 ** s) / (2 ** sizes[0]) if s <= 14 else 1000
        else:
            res, risk = runner.run_mst_benchmark("Prim", s)
            theoretical_relative = (s / sizes[0]) * math.log2(max(2, s)) / math.log2(max(2, sizes[0]))

        cur_t = res.runtime_seconds
        exponent = 0.0
        if prev_n and prev_t and cur_t > 0 and prev_t > 0:
            exponent = estimate_growth_exponent(prev_n, prev_t, s, cur_t)
        prev_n = s
        prev_t = cur_t

        series.append({
            "size": s,
            "runtime_ms": round(cur_t * 1000, 3),
            "memory_kb": round(res.memory_bytes / 1024, 2),
            "theoretical_relative": round(theoretical_relative, 2),
            "operations": res.operations.total_operations(),
            "empirical_exponent": exponent,
            "risk_level": risk.risk_level,
            "timed_out": res.timed_out
        })

    return jsonify({
        "algorithm": algo,
        "series": series
    })

@app.route("/api/complexity-table", methods=["GET"])
def get_complexity_table():
    items = []
    for algo, data in COMPLEXITY_TABLE.items():
        items.append({
            "algorithm": algo,
            **data
        })
    return jsonify(items)

@app.route("/api/history", methods=["GET"])
def get_history():
    history_items = []
    for idx, (res, risk) in enumerate(runner.history):
        history_items.append({
            "id": idx + 1,
            "algorithm_name": res.algorithm_name,
            "input_size": res.input_size_repr,
            "runtime_ms": round(res.runtime_seconds * 1000, 3),
            "memory_kb": round(res.memory_bytes / 1024, 2),
            "risk_level": risk.risk_level,
            "reason": risk.reason,
            "timed_out": res.timed_out,
            "total_operations": res.operations.total_operations()
        })
    return jsonify(history_items)

@app.route("/api/export", methods=["POST"])
def export_reports():
    exporter.export_csv(runner.history)
    exporter.export_text_report(runner.history)
    return jsonify({
        "success": True,
        "csv_path": exporter.csv_path,
        "txt_path": exporter.txt_path,
        "records_count": len(runner.history)
    })

# Serve frontend build if dist exists
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    if os.path.exists(DIST_DIR):
        if path != "" and os.path.exists(os.path.join(DIST_DIR, path)):
            return send_from_directory(DIST_DIR, path)
        return send_from_directory(DIST_DIR, "index.html")
    return jsonify({"message": "THRML API Server Running. Start Vite dev server for frontend UI."})

if __name__ == "__main__":
    import math
    port = int(os.environ.get("PORT", 5000))
    print(f"[*] Starting THRML API Server on http://127.0.0.1:{port}")
    app.run(host="127.0.0.1", port=port, debug=False)
