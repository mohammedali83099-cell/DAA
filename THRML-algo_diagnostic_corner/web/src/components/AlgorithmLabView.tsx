import React, { useState } from 'react';
import { 
  Play, 
  Sliders, 
  Cpu, 
  Clock, 
  HardDrive, 
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { AlgorithmCatalogItem, MetricResult } from '../types';
import { RiskBadge } from './RiskBadge';

interface Props {
  algorithms: AlgorithmCatalogItem[];
  selectedAlgoId: string;
  onSelectAlgorithm: (id: string) => void;
  onRunTest: (algoId: string, params: Record<string, any>) => Promise<MetricResult | null>;
  currentResult: MetricResult | null;
  isRunning: boolean;
}

export const AlgorithmLabView: React.FC<Props> = ({
  algorithms,
  selectedAlgoId,
  onSelectAlgorithm,
  onRunTest,
  currentResult,
  isRunning,
}) => {
  const currentAlgo = algorithms.find(a => a.id === selectedAlgoId) || algorithms[0];

  const [workloadType, setWorkloadType] = useState<string>('random');
  const [paramN, setParamN] = useState<number>(currentAlgo?.defaultParams?.n || 2000);
  const [paramVertices, setParamVertices] = useState<number>(currentAlgo?.defaultParams?.vertices || 100);
  const [paramDensity, setParamDensity] = useState<number>(currentAlgo?.defaultParams?.density || 0.3);
  const [paramCapacity, setParamCapacity] = useState<number>(currentAlgo?.defaultParams?.capacity || 500);
  const [paramChainLength, setParamChainLength] = useState<number>(currentAlgo?.defaultParams?.chain_length || 25);
  const [paramCities, setParamCities] = useState<number>(currentAlgo?.defaultParams?.cities || 9);

  const handleRun = () => {
    let params: Record<string, any> = { workload: workloadType };
    if (['binomial_heap', 'fibonacci_heap', 'btree', 'red_black_tree', 'nqueen'].includes(currentAlgo.id)) {
      params.n = paramN;
    }
    if (['prim', 'kruskal', 'floyd_warshall', 'hamiltonian'].includes(currentAlgo.id)) {
      params.vertices = paramVertices;
      params.density = paramDensity;
      params.has_cycle = true;
    }
    if (['fractional_knapsack', 'knapsack_01'].includes(currentAlgo.id)) {
      params.n_items = paramN;
      params.capacity = paramCapacity;
    }
    if (currentAlgo.id === 'matrix_chain') {
      params.chain_length = paramChainLength;
    }
    if (currentAlgo.id === 'tsp') {
      params.cities = paramCities;
    }

    onRunTest(currentAlgo.id, params);
  };

  // Compute stability index (0 to 100)
  const computeStabilityScore = (result: MetricResult | null) => {
    if (!result) return 90;
    if (result.timed_out) return 12;
    if (result.risk.risk_level === 'HIGH') return 34;
    if (result.risk.risk_level === 'MODERATE') return 68;
    return Math.max(82, 100 - Math.round(result.runtime_ms / 50));
  };

  const stabilityScore = computeStabilityScore(currentResult);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Algorithm Selector Bar */}
      <div className="calm-card" style={{ padding: '12px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span className="eyebrow-label">SELECT ALGORITHM:</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {algorithms.map((algo) => {
              const isSelected = algo.id === currentAlgo.id;
              return (
                <button
                  key={algo.id}
                  onClick={() => {
                    onSelectAlgorithm(algo.id);
                    if (algo.defaultParams?.n) setParamN(algo.defaultParams.n);
                    if (algo.defaultParams?.vertices) setParamVertices(algo.defaultParams.vertices);
                    if (algo.defaultParams?.capacity) setParamCapacity(algo.defaultParams.capacity);
                    if (algo.defaultParams?.chain_length) setParamChainLength(algo.defaultParams.chain_length);
                    if (algo.defaultParams?.cities) setParamCities(algo.defaultParams.cities);
                  }}
                  className={`chip-item ${isSelected ? 'chip-item-active' : ''}`}
                >
                  {algo.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid: Controls on Left, Results on Right */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: 20
      }}>
        {/* Left Column: Algorithm Specs & Workload Generator */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Algorithm Profile */}
          <div className="calm-card" style={{ padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span className="eyebrow-label">{currentAlgo.category}</span>
              <span style={{
                fontSize: '0.74rem',
                fontFamily: 'var(--font-mono)',
                color: '#1e3a5f',
                fontWeight: 700,
                background: '#f1f5f9',
                padding: '2px 8px',
                borderRadius: 4
              }}>
                {currentAlgo.timeComplexity}
              </span>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>
              {currentAlgo.name}
            </h3>
            <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.5, marginBottom: 16 }}>
              {currentAlgo.description}
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 10,
              padding: 12,
              borderRadius: 8,
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              fontSize: '0.78rem'
            }}>
              <div>
                <span style={{ color: '#64748b', display: 'block', marginBottom: 2 }}>Theoretical Time:</span>
                <strong style={{ fontFamily: 'var(--font-mono)', color: '#0f172a' }}>{currentAlgo.timeComplexity}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', marginBottom: 2 }}>Space Bound:</span>
                <strong style={{ fontFamily: 'var(--font-mono)', color: '#0f172a' }}>{currentAlgo.spaceComplexity}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', marginBottom: 2 }}>Problem Class:</span>
                <strong style={{ color: '#0f172a' }}>{currentAlgo.problemClass}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', marginBottom: 2 }}>Formulation:</span>
                <strong style={{ color: '#0f172a' }}>{currentAlgo.decisionOptimization}</strong>
              </div>
            </div>
          </div>

          {/* Workload Generator */}
          <div className="calm-card" style={{ padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
              <Sliders size={16} color="#1e3a5f" />
              <span className="eyebrow-label">WORKLOAD & ADVERSARIAL STRESS GENERATOR</span>
            </div>

            {/* Distribution Chips */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 8 }}>
                Input Workload Distribution:
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {[
                  { id: 'random', label: 'Random Normal' },
                  { id: 'sorted', label: 'Pathological Pre-Sorted' },
                  { id: 'duplicates', label: 'Duplicate-Heavy' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setWorkloadType(mode.id)}
                    className={`chip-item ${workloadType === mode.id ? 'chip-item-active' : ''}`}
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Parametric Sliders */}
            {['binomial_heap', 'fibonacci_heap', 'btree', 'red_black_tree', 'fractional_knapsack', 'knapsack_01', 'nqueen'].includes(currentAlgo.id) && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>
                    {currentAlgo.id === 'nqueen' ? 'Board Size (N Queens)' : 'Workload Size (N keys / operations)'}
                  </label>
                  <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#1e3a5f' }}>
                    {paramN}
                  </span>
                </div>
                <input 
                  type="range"
                  min={currentAlgo.id === 'nqueen' ? 4 : 100}
                  max={currentAlgo.id === 'nqueen' ? 14 : 10000}
                  step={currentAlgo.id === 'nqueen' ? 1 : 100}
                  value={paramN}
                  onChange={(e) => setParamN(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
            )}

            {['prim', 'kruskal', 'floyd_warshall', 'hamiltonian'].includes(currentAlgo.id) && (
              <>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>
                      Graph Vertices (V)
                    </label>
                    <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#1e3a5f' }}>
                      {paramVertices}
                    </span>
                  </div>
                  <input 
                    type="range"
                    min={currentAlgo.id === 'hamiltonian' ? 6 : 20}
                    max={currentAlgo.id === 'hamiltonian' ? 18 : currentAlgo.id === 'floyd_warshall' ? 200 : 400}
                    step={currentAlgo.id === 'hamiltonian' ? 1 : 10}
                    value={paramVertices}
                    onChange={(e) => setParamVertices(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>

                {['prim', 'kruskal'].includes(currentAlgo.id) && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>
                        Edge Density (Sparse vs Dense)
                      </label>
                      <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#1e3a5f' }}>
                        {Math.round(paramDensity * 100)}%
                      </span>
                    </div>
                    <input 
                      type="range"
                      min={0.05}
                      max={1.0}
                      step={0.05}
                      value={paramDensity}
                      onChange={(e) => setParamDensity(Number(e.target.value))}
                      style={{ width: '100%' }}
                    />
                  </div>
                )}
              </>
            )}

            {['fractional_knapsack', 'knapsack_01'].includes(currentAlgo.id) && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>
                    Knapsack Capacity (W)
                  </label>
                  <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#1e3a5f' }}>
                    {paramCapacity}
                  </span>
                </div>
                <input 
                  type="range"
                  min={50}
                  max={4000}
                  step={50}
                  value={paramCapacity}
                  onChange={(e) => setParamCapacity(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
            )}

            {currentAlgo.id === 'matrix_chain' && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>
                    Chain Length (n matrices)
                  </label>
                  <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#1e3a5f' }}>
                    {paramChainLength}
                  </span>
                </div>
                <input 
                  type="range"
                  min={5}
                  max={50}
                  step={1}
                  value={paramChainLength}
                  onChange={(e) => setParamChainLength(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
            )}

            {currentAlgo.id === 'tsp' && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>
                    Tour Cities (Factorial Permutations)
                  </label>
                  <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#991b1b' }}>
                    {paramCities} cities
                  </span>
                </div>
                <input 
                  type="range"
                  min={4}
                  max={13}
                  step={1}
                  value={paramCities}
                  onChange={(e) => setParamCities(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#991b1b' }}
                />
              </div>
            )}

            <button
              onClick={handleRun}
              disabled={isRunning}
              className="btn-primary"
              style={{ width: '100%', padding: '10px 18px', marginTop: 8 }}
            >
              {isRunning ? (
                <span>Executing Diagnostic Stress...</span>
              ) : (
                <>
                  <Play size={15} />
                  <span>Execute Diagnostic Stress Test</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Hero Score & Assurance Telemetry (Habitus-style Card) */}
        <div>
          {currentResult ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Hero Algorithmic Health Card */}
              <div className="calm-card" style={{ padding: 24 }}>
                <span className="eyebrow-label" style={{ marginBottom: 12, display: 'block' }}>
                  ALGORITHMIC STABILITY ASSESSMENT
                </span>

                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span className="hero-metric-number">{stabilityScore}</span>
                    <span className="hero-metric-unit">/100</span>
                  </div>

                  <RiskBadge level={currentResult.risk.risk_level} size="md" />
                </div>

                <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.6, marginBottom: 20 }}>
                  {currentResult.risk.reason}
                </p>

                {/* Sub-Metric Progress Bars (Habitus Style) */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 16,
                  paddingTop: 16,
                  borderTop: '1px solid #e2e8f0'
                }}>
                  {/* Runtime Budget */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', marginBottom: 4 }}>
                      <span style={{ color: '#64748b' }}>Runtime Budget</span>
                      <strong style={{ fontFamily: 'var(--font-mono)' }}>{currentResult.runtime_ms} ms</strong>
                    </div>
                    <div className="progress-bar-track">
                      <div 
                        className="progress-bar-fill" 
                        style={{ 
                          width: `${Math.min(100, (currentResult.runtime_ms / 2000) * 100)}%`,
                          backgroundColor: currentResult.runtime_ms > 1000 ? '#ef4444' : currentResult.runtime_ms > 100 ? '#f59e0b' : '#10b981'
                        }} 
                      />
                    </div>
                  </div>

                  {/* Memory Budget */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', marginBottom: 4 }}>
                      <span style={{ color: '#64748b' }}>Memory Headroom</span>
                      <strong style={{ fontFamily: 'var(--font-mono)' }}>{currentResult.memory_kb} KB</strong>
                    </div>
                    <div className="progress-bar-track">
                      <div 
                        className="progress-bar-fill" 
                        style={{ 
                          width: `${Math.min(100, (currentResult.memory_kb / (100 * 1024)) * 100)}%`,
                          backgroundColor: currentResult.memory_kb > (100 * 1024) ? '#ef4444' : '#0284c7'
                        }} 
                      />
                    </div>
                  </div>

                  {/* Safety Margin */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', marginBottom: 4 }}>
                      <span style={{ color: '#64748b' }}>Safety Headroom</span>
                      <strong style={{ fontFamily: 'var(--font-mono)' }}>
                        {currentResult.timed_out ? 'Exhausted' : '100% Intact'}
                      </strong>
                    </div>
                    <div className="progress-bar-track">
                      <div 
                        className="progress-bar-fill" 
                        style={{ 
                          width: currentResult.timed_out ? '100%' : '20%',
                          backgroundColor: currentResult.timed_out ? '#ef4444' : '#10b981'
                        }} 
                      />
                    </div>
                  </div>

                  {/* Operation Tally */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', marginBottom: 4 }}>
                      <span style={{ color: '#64748b' }}>Total Operations</span>
                      <strong style={{ fontFamily: 'var(--font-mono)' }}>
                        {currentResult.operations.total_ops?.toLocaleString()}
                      </strong>
                    </div>
                    <div className="progress-bar-track">
                      <div 
                        className="progress-bar-fill" 
                        style={{ 
                          width: '100%',
                          backgroundColor: '#1e3a5f'
                        }} 
                      />
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 14, textAlign: 'right', fontSize: '0.72rem', color: '#94a3b8' }}>
                  <span>🛡 Confidence: Deterministic Static Instrumentation</span>
                </div>
              </div>

              {/* Internal Operations Breakdown Micro-Grid */}
              <div className="calm-card" style={{ padding: 20 }}>
                <span className="eyebrow-label" style={{ marginBottom: 12, display: 'block' }}>
                  INTERNAL OPERATION COUNTERS
                </span>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                  gap: 8
                }}>
                  {Object.entries(currentResult.operations).map(([opName, count]) => {
                    if (opName === 'total_ops' || count === 0) return null;
                    return (
                      <div key={opName} style={{
                        padding: '8px 10px',
                        borderRadius: 6,
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0'
                      }}>
                        <span style={{
                          fontSize: '0.7rem',
                          color: '#64748b',
                          display: 'block',
                          textTransform: 'capitalize',
                          marginBottom: 2
                        }}>
                          {opName.replace('_', ' ')}
                        </span>
                        <strong style={{ fontSize: '0.92rem', fontFamily: 'var(--font-mono)', color: '#0f172a' }}>
                          {count?.toLocaleString()}
                        </strong>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actionable Architectural Mitigation Card (Habitus Recommendation Pattern) */}
              <div className="calm-card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span className="eyebrow-label">ARCHITECTURAL MITIGATION</span>
                  <span style={{ fontSize: '0.74rem', color: '#1e3a5f', fontWeight: 600, cursor: 'pointer' }}>
                    View Syllabus Notes &gt;
                  </span>
                </div>

                <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
                  {currentResult.risk.risk_level === 'LOW' && 'Optimal Asymptotic Formulation Confirmed'}
                  {currentResult.risk.risk_level === 'MODERATE' && 'Apply Workload Constraints or Structural Caching'}
                  {currentResult.risk.risk_level === 'HIGH' && 'Switch to Approximation (FPTAS) or Branch Pruning'}
                </h4>

                <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5, marginBottom: 12 }}>
                  {currentResult.risk.risk_level === 'LOW' 
                    ? 'Current algorithm configuration satisfies runtime SLA. Maintain default parameter bounds.'
                    : currentResult.risk.risk_level === 'MODERATE'
                    ? 'Growth trend indicates quadratic or cubic scaling. Restrict input sizes or consider adjacency-matrix memoization.'
                    : 'Combinatorial explosion triggered. For exact solutions, enforce strict timeout fallbacks or switch to heuristic approximations.'}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <span className="chip-item" style={{ fontSize: '0.72rem', padding: '4px 8px' }}>
                      Bounded Time
                    </span>
                    <span className="chip-item" style={{ fontSize: '0.72rem', padding: '4px 8px' }}>
                      Exact Algorithm
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '3px 8px',
                    borderRadius: 9999,
                    background: '#f1f5f9',
                    fontSize: '0.72rem',
                    color: '#1e3a5f',
                    fontWeight: 600
                  }}>
                    <Sparkles size={12} />
                    <span>Assurance Assistant</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="calm-card" style={{ padding: 48, textAlign: 'center' }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1e3a5f',
                margin: '0 auto 14px'
              }}>
                <Cpu size={24} />
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                Diagnostic Laboratory Ready
              </h4>
              <p style={{ fontSize: '0.84rem', color: '#64748b', maxWidth: 320, margin: '0 auto 16px', lineHeight: 1.5 }}>
                Select workload distribution and scale on the left to measure empirical metrics and compute the stability index.
              </p>
              <button onClick={handleRun} className="btn-primary" style={{ padding: '8px 18px' }}>
                <Play size={14} />
                <span>Run Default Stress Test</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
