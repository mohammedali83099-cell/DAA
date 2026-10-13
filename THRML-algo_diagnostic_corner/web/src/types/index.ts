export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH';

export interface OperationCounts {
  comparisons?: number;
  swaps?: number;
  relaxations?: number;
  dp_states?: number;
  heap_ops?: number;
  tree_rotations?: number;
  tree_recolors?: number;
  tree_splits?: number;
  search_states?: number;
  branches?: number;
  pruned_states?: number;
  total_ops: number;
}

export interface RiskAssessment {
  risk_level: RiskLevel;
  runtime_growth: string;
  memory_growth: string;
  scalability_risk: string;
  reason: string;
  algorithm_name?: string;
  input_size_repr?: string;
}

export interface MetricResult {
  algorithm_name: string;
  category: string;
  input_size_repr: string;
  input_n: number;
  runtime_seconds: number;
  runtime_ms: number;
  memory_bytes: number;
  memory_kb: number;
  memory_mb: number;
  timed_out: boolean;
  operations: OperationCounts;
  details?: Record<string, any>;
  risk: RiskAssessment;
}

export interface AlgorithmCatalogItem {
  id: string;
  name: string;
  category: string;
  timeComplexity: string;
  spaceComplexity: string;
  problemClass: string;
  decisionOptimization: string;
  description: string;
  defaultParams: Record<string, any>;
}

export interface ComplexityEntry {
  algorithm: string;
  time?: string;
  time_insert?: string;
  time_extract_min?: string;
  time_decrease_key?: string;
  time_search?: string;
  space: string;
  problem_class: string;
  category: string;
}

export interface HistoryItem {
  id: number;
  algorithm_name: string;
  input_size: string;
  runtime_ms: number;
  memory_kb: number;
  risk_level: RiskLevel;
  reason: string;
  timed_out: boolean;
  total_operations: number;
}

export interface BenchmarkSeriesPoint {
  size: number;
  runtime_ms: number;
  memory_kb: number;
  theoretical_relative: number;
  operations: number;
  empirical_exponent: number;
  risk_level: RiskLevel;
  timed_out: boolean;
}

export interface SystemStatus {
  status: string;
  total_algorithms: number;
  experiments_run: number;
  test_families: string[];
}
