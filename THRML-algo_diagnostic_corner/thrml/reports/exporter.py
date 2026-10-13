import os
import csv
from typing import List, Tuple, Any
from algorithms.base import MetricResult
from risk.classifier import RiskAssessment

class ReportExporter:
    def __init__(self, output_dir: str = "reports"):
        self.output_dir = output_dir
        os.makedirs(self.output_dir, exist_ok=True)

    def export_single_experiment(self, exp_id: int, result: MetricResult, risk: RiskAssessment) -> str:
        filepath = os.path.join(self.output_dir, f"experiment_{exp_id:03d}.txt")
        content = [
            "=" * 60,
            f"  THRML LABORATORY EXPERIMENT REPORT #{exp_id:03d}",
            "=" * 60,
            f"Algorithm:           {result.algorithm_name}",
            f"Category:            {result.category}",
            f"Input Representation:{result.input_size_repr}",
            f"Input Size (n):      {result.input_n}",
            f"Execution Time:      {result.runtime_seconds * 1000:.3f} ms ({result.runtime_seconds:.6f} s)",
            f"Peak Memory:         {result.memory_bytes / 1024:.2f} KB",
            f"Status / Output:     {result.output_summary}",
            "-" * 60,
            "OPERATION COUNTERS",
            f"  Comparisons:       {result.operations.comparisons}",
            f"  Swaps:             {result.operations.swaps}",
            f"  Relaxations:       {result.operations.relaxations}",
            f"  DP States:         {result.operations.dp_states}",
            f"  Heap Operations:   {result.operations.heap_ops}",
            f"  Tree Rotations:    {result.operations.tree_rotations}",
            f"  Tree Recolors:     {result.operations.tree_recolors}",
            f"  Tree Splits:       {result.operations.tree_splits}",
            f"  Search States:     {result.operations.search_states}",
            f"  Branches / Cuts:   {result.operations.branches}",
            f"  Pruned States:     {result.operations.pruned_states}",
            f"  Total Operations:  {result.operations.total_operations()}",
            "-" * 60,
            "THRML RISK ASSESSMENT",
            f"  Runtime Growth:    {risk.runtime_growth}",
            f"  Memory Growth:     {risk.memory_growth}",
            f"  Scalability Risk:  {risk.scalability_risk}",
            f"  OVERALL RISK:      {risk.risk_level}",
            f"  Reason:            {risk.reason}",
            "=" * 60,
        ]

        with open(filepath, "w") as f:
            f.write("\n".join(content) + "\n")
        return filepath

    def export_full_report(self, history: List[Tuple[MetricResult, RiskAssessment]]) -> str:
        txt_path = os.path.join(self.output_dir, "full_report.txt")
        csv_path = os.path.join(self.output_dir, "benchmark_data.csv")

        lines = [
            "============================================================",
            "        T H R M L   L A B O R A T O R Y   R E P O R T       ",
            "         DAA Vulnerability & Stress Testing Summary          ",
            "============================================================",
            f"Total Experiments Executed: {len(history)}",
            "",
            f"{'ID':<4} {'Algorithm':<28} {'Input Size':<15} {'Time (ms)':<10} {'Risk':<10}",
            "-" * 72
        ]

        for i, (res, rsk) in enumerate(history, 1):
            lines.append(f"{i:03d}  {res.algorithm_name:<28} {res.input_n:<15} {res.runtime_seconds * 1000:<10.2f} {rsk.risk_level:<10}")

        lines.append("=" * 72)

        with open(txt_path, "w") as f:
            f.write("\n".join(lines) + "\n")

        # Export CSV
        with open(csv_path, "w", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(["ID", "Algorithm", "Category", "InputSize", "RuntimeSec", "MemoryBytes", "TotalOps", "RiskLevel", "Reason"])
            for i, (res, rsk) in enumerate(history, 1):
                writer.writerow([
                    i, res.algorithm_name, res.category, res.input_n,
                    res.runtime_seconds, res.memory_bytes, res.operations.total_operations(),
                    rsk.risk_level, rsk.reason
                ])

        return txt_path
