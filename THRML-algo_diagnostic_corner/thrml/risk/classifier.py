from dataclasses import dataclass
from typing import Dict, Any, Optional
from algorithms.base import MetricResult
from benchmark.complexity import COMPLEXITY_TABLE

@dataclass
class RiskAssessment:
    algorithm_name: str
    input_size_repr: str
    runtime_growth: str
    memory_growth: str
    scalability_risk: str
    risk_level: str  # "LOW", "MODERATE", "HIGH"
    reason: str

class RiskClassifier:
    """
    Methodology for THRML Risk Assessment:
    - LOW: Execution time < 0.1s, memory < 20MB, polynomial scaling behavior within normal limits.
    - MODERATE: Execution time 0.1s - 1.0s, memory 20MB - 100MB, or cubic growth detected (e.g. Floyd-Warshall V > 300).
    - HIGH: Execution time > 1.0s, TIMEOUT triggered, memory > 100MB, or exponential search space explosion (TSP/N-Queen/Hamiltonian).
    """

    @staticmethod
    def classify(result: MetricResult, empirical_exponent: Optional[float] = None) -> RiskAssessment:
        algo_name = result.algorithm_name
        runtime = result.runtime_seconds
        mem_mb = result.memory_bytes / (1024 * 1024)

        comp_info = COMPLEXITY_TABLE.get(algo_name, {})
        problem_class = comp_info.get("problem_class", "")

        runtime_growth = "LOW"
        memory_growth = "LOW"
        scalability_risk = "LOW"
        reasons = []

        if result.timed_out:
            return RiskAssessment(
                algorithm_name=algo_name,
                input_size_repr=result.input_size_repr,
                runtime_growth="HIGH",
                memory_growth="MODERATE",
                scalability_risk="HIGH",
                risk_level="HIGH",
                reason="Execution safety timeout reached due to combinatorial/search space explosion."
            )

        # Runtime evaluation
        if runtime > 1.0:
            runtime_growth = "HIGH"
            reasons.append(f"High execution time ({runtime:.3f}s)")
        elif runtime > 0.1:
            runtime_growth = "MODERATE"
            reasons.append(f"Moderate execution time ({runtime:.3f}s)")

        # Memory evaluation
        if mem_mb > 100:
            memory_growth = "HIGH"
            reasons.append(f"Severe memory consumption ({mem_mb:.1f} MB)")
        elif mem_mb > 20:
            memory_growth = "MODERATE"
            reasons.append(f"Substantial memory allocation ({mem_mb:.1f} MB)")

        # Exponent & Problem Class evaluation
        if "Exponential" in problem_class or "NP-" in problem_class or "Factorial" in problem_class:
            if result.input_n >= 10:
                scalability_risk = "HIGH"
                reasons.append("NP-Hard/Exponential growth causes rapid combinatorial search explosion.")
            elif result.input_n >= 7:
                scalability_risk = "MODERATE"
                reasons.append("Exponential search space requires severe input size restriction.")
        elif "Pseudo-polynomial" in problem_class:
            if result.details.get("capacity", 0) > 10000:
                scalability_risk = "HIGH"
                reasons.append("Pseudo-polynomial time scales with numeric capacity W rather than binary length.")
            elif result.details.get("capacity", 0) > 2000:
                scalability_risk = "MODERATE"
        elif "O(V³)" in comp_info.get("time", "") or "O(n³)" in comp_info.get("time", ""):
            if result.input_n >= 200:
                scalability_risk = "HIGH"
                reasons.append("Cubic time complexity O(n³) causes steep growth as input size scales.")
            elif result.input_n >= 80:
                scalability_risk = "MODERATE"
                reasons.append("Cubic time O(n³) displays notable growth curve.")

        if empirical_exponent and empirical_exponent >= 2.5:
            scalability_risk = "HIGH"
            reasons.append(f"Observed empirical growth rate n^{empirical_exponent:.1f}")

        # Overall Risk decision
        if runtime_growth == "HIGH" or memory_growth == "HIGH" or scalability_risk == "HIGH":
            risk_level = "HIGH"
        elif runtime_growth == "MODERATE" or memory_growth == "MODERATE" or scalability_risk == "MODERATE":
            risk_level = "MODERATE"
        else:
            risk_level = "LOW"

        if not reasons:
            reason = "Behavior remains practical and well-bounded for tested input size."
        else:
            reason = "; ".join(reasons) + "."

        return RiskAssessment(
            algorithm_name=algo_name,
            input_size_repr=result.input_size_repr,
            runtime_growth=runtime_growth,
            memory_growth=memory_growth,
            scalability_risk=scalability_risk,
            risk_level=risk_level,
            reason=reason
        )
