import React, { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  Sliders, 
  Layers, 
  Activity, 
  Cpu, 
  Clock, 
  HardDrive, 
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Flame
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

  // Workload state
  const [workloadType, setWorkloadType] = useState<string>('random');
  const [paramN, setParamN] = useState<number>(currentAlgo?.defaultParams?.n || 2000);
  const [paramVertices, setParamVertices] = useState<number>(currentAlgo?.defaultParams?.vertices || 100);
  const [paramDensity, setParamDensity] = useState<number>(currentAlgo?.defaultParams?.density || 0.3);
  const [paramCapacity, setParamCapacity] = useState<number>(currentAlgo?.defaultParams?.capacity || 500);
  const [paramChainLength, setParamChainLength] = useState<number>(currentAlgo?.defaultParams?.chain_length || 25);
  const [paramCities, setParamCities] = useState<number>(currentAlgo?.defaultParams?.cities || 9);

  // Group algorithms by category
  const categories = Array.from(new Set(algorithms.map(a => a.category)));

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Category Pills & Selector */}
      <div className="glass-panel" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            Algorithm Catalog:
          </span>
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
                  style={{
                    padding: '6px 14px',
                    borderRadius: 9999,
                    fontSize: '0.82rem',
                    fontWeight: isSelected ? 700 : 500,
                    color: isSelected ? '#ffffff' : '#334155',
                    background: isSelected ? 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' : 'rgba(255, 255, 255, 0.75)',
                    border: isSelected ? '1px solid rgba(255, 255, 255, 0.4)' : '1px solid rgba(226, 232, 240, 0.9)',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 4px 12px rgba(79, 70, 229, 0.25)' : 'none',
                    transition: 'all 0.18s ease'
                  }}
                >
                  {algo.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid: Configurator on Left, Results on Right */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: 24
      }}>
        {/* Left Column: Algorithm Specs & Stress Workload Config */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Algorithm Profile Card */}
          <div className="glass-panel" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span className="badge-category">{currentAlgo.category}</span>
              <span style={{
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                color: '#4f46e5',
                fontWeight: 600,
                background: 'rgba(79, 70, 229, 0.08)',
                padding: '3px 8px',
                borderRadius: 6
              }}>
                {currentAlgo.timeComplexity}
              </span>
            </div>

            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>
              {currentAlgo.name}
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.5, marginBottom: 18 }}>
              {currentAlgo.description}
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 12,
              padding: 14,
              borderRadius: 12,
              background: 'rgba(248, 250, 252, 0.8)',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              fontSize: '0.8rem'
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
                <span style={{ color: '#64748b', display: 'block', marginBottom: 2 }}>Variant:</span>
                <strong style={{ color: '#0f172a' }}>{currentAlgo.decisionOptimization}</strong>
              </div>
            </div>
          </div>

          {/* Stress Workload Controls */}
          <div className="glass-panel" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Sliders size={18} color="#4f46e5" />
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                Workload & Stress Generator
              </h4>
            </div>

            {/* Test Family Mode */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 8 }}>
                Workload Distribution / Test Family
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {[
                  { id: 'random', label: 'NORMAL (Random)' },
                  { id: 'sorted', label: 'PATHOLOGICAL (Sorted)' },
                  { id: 'duplicates', label: 'STRUCTURED (Duplicates)' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setWorkloadType(mode.id)}
                    style={{
                      padding: '8px 6px',
                      fontSize: '0.75rem',
                      fontWeight: workloadType === mode.id ? 700 : 500,
                      borderRadius: 8,
                      border: workloadType === mode.id ? '1px solid #4f46e5' : '1px solid rgba(226, 232, 240, 0.8)',
                      background: workloadType === mode.id ? 'rgba(79, 70, 229, 0.08)' : 'rgba(255, 255, 255, 0.6)',
                      color: workloadType === mode.id ? '#4f46e5' : '#475569',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Parametric Inputs */}
            {['binomial_heap', 'fibonacci_heap', 'btree', 'red_black_tree', 'fractional_knapsack', 'knapsack_01', 'nqueen'].includes(currentAlgo.id) && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569' }}>
                    {currentAlgo.id === 'nqueen' ? 'Board Size (N Queens)' : 'Workload Size (N operations / keys)'}
                  </label>
                  <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#4f46e5' }}>
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
                  style={{ width: '100%', accentColor: '#4f46e5' }}
                />
              </div>
            )}

            {['prim', 'kruskal', 'floyd_warshall', 'hamiltonian'].includes(currentAlgo.id) && (
              <>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569' }}>
                      Graph Vertices (V)
                    </label>
                    <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#4f46e5' }}>
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
                    style={{ width: '100%', accentColor: '#4f46e5' }}
                  />
                </div>

                {['prim', 'kruskal'].includes(currentAlgo.id) && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569' }}>
                        Edge Density (Sparse vs Dense)
                      </label>
                      <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#4f46e5' }}>
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
                      style={{ width: '100%', accentColor: '#4f46e5' }}
                    />
                  </div>
                )}
              </>
            )}

            {['fractional_knapsack', 'knapsack_01'].includes(currentAlgo.id) && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569' }}>
                    Knapsack Capacity (W)
                  </label>
                  <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#4f46e5' }}>
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
                  style={{ width: '100%', accentColor: '#4f46e5' }}
                />
              </div>
            )}

            {currentAlgo.id === 'matrix_chain' && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569' }}>
                    Matrix Chain Length (n)
                  </label>
                  <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#4f46e5' }}>
                    {paramChainLength} matrices
                  </span>
                </div>
                <input 
                  type="range"
                  min={5}
                  max={50}
                  step={1}
                  value={paramChainLength}
                  onChange={(e) => setParamChainLength(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#4f46e5' }}
                />
              </div>
            )}

            {currentAlgo.id === 'tsp' && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569' }}>
                    Tour Cities Count (Factorial Permutation Space)
                  </label>
                  <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#e11d48' }}>
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
                  style={{ width: '100%', accentColor: '#e11d48' }}
                />
              </div>
            )}

            <button
              onClick={handleRun}
              disabled={isRunning}
              className="btn-primary"
              style={{ width: '100%', padding: '12px 20px', marginTop: 10, fontSize: '0.95rem' }}
            >
              {isRunning ? (
                <>
                  <div style={{
                    width: 16,
                    height: 16,
                    border: '2px solid rgba(255, 255, 255, 0.4)',
                    borderTopColor: '#ffffff',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }} />
                  <span>Executing Stress Workload...</span>
                </>
              ) : (
                <>
                  <Play size={16} />
                  <span>Execute Diagnostic Stress Test</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Live Measurement & Risk Output */}
        <div>
          {currentResult ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Risk Verdict Banner */}
              <div className="glass-panel" style={{
                padding: 24,
                borderLeft: `6px solid ${
                  currentResult.risk.risk_level === 'LOW' ? '#059669' :
                  currentResult.risk.risk_level === 'MODERATE' ? '#d97706' : '#e11d48'
                }`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b' }}>
                    SOFTWARE ASSURANCE VERDICT
                  </span>
                  <RiskBadge level={currentResult.risk.risk_level} size="lg" />
                </div>
                
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>
                  {currentResult.risk.risk_level === 'LOW' && 'Verified Safe Scaling Profile'}
                  {currentResult.risk.risk_level === 'MODERATE' && 'Approaching Practical Latency / Scaling Limits'}
                  {currentResult.risk.risk_level === 'HIGH' && 'Severe Bottleneck / Combinatorial Exhaustion'}
                </h4>
                
                <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, marginBottom: 12 }}>
                  {currentResult.risk.reason}
                </p>

                {currentResult.timed_out && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 12px',
                    borderRadius: 8,
                    background: 'rgba(244, 63, 94, 0.1)',
                    border: '1px solid rgba(244, 63, 94, 0.25)',
                    color: '#e11d48',
                    fontSize: '0.82rem',
                    fontWeight: 600
                  }}>
                    <AlertCircle size={16} />
                    <span>SAFETY TIMEOUT TRIGGERED: Execution exceeded laboratory limit (&gt; 2.0s).</span>
                  </div>
                )}
              </div>

              {/* Core Telemetry Indicators */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                {/* Runtime */}
                <div className="glass-panel" style={{ padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748b', marginBottom: 8 }}>
                    <Clock size={16} color="#4f46e5" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>EXECUTION LATENCY</span>
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)' }}>
                    {currentResult.runtime_ms} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#64748b' }}>ms</span>
                  </div>
                  <div style={{ marginTop: 10, background: 'rgba(226, 232, 240, 0.8)', height: 6, borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.min(100, (currentResult.runtime_ms / 1000) * 100)}%`,
                      background: currentResult.runtime_ms > 1000 ? '#e11d48' : currentResult.runtime_ms > 100 ? '#d97706' : '#10b981'
                    }} />
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginTop: 4 }}>
                    Safety threshold limit: 2000 ms
                  </span>
                </div>

                {/* Memory */}
                <div className="glass-panel" style={{ padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748b', marginBottom: 8 }}>
                    <HardDrive size={16} color="#0284c7" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>PEAK MEMORY FOOTPRINT</span>
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)' }}>
                    {currentResult.memory_kb} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#64748b' }}>KB</span>
                  </div>
                  <div style={{ marginTop: 10, background: 'rgba(226, 232, 240, 0.8)', height: 6, borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.min(100, (currentResult.memory_kb / (100 * 1024)) * 100)}%`,
                      background: currentResult.memory_kb > (100 * 1024) ? '#e11d48' : '#0284c7'
                    }} />
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginTop: 4 }}>
                    Measured with Python tracemalloc
                  </span>
                </div>
              </div>

              {/* Internal Operation Counters Breakdown */}
              <div className="glass-panel" style={{ padding: 22 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Cpu size={18} color="#4f46e5" />
                    <h5 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0f172a' }}>
                      Internal Operation Counts & Tree Mechanics
                    </h5>
                  </div>
                  <span style={{
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    color: '#4f46e5',
                    background: 'rgba(79, 70, 229, 0.08)',
                    padding: '3px 8px',
                    borderRadius: 6
                  }}>
                    Total: {currentResult.operations.total_ops?.toLocaleString() || 0} ops
                  </span>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: 10
                }}>
                  {Object.entries(currentResult.operations).map(([opName, count]) => {
                    if (opName === 'total_ops' || count === 0) return null;
                    return (
                      <div key={opName} style={{
                        padding: '10px 12px',
                        borderRadius: 10,
                        background: 'rgba(248, 250, 252, 0.8)',
                        border: '1px solid rgba(226, 232, 240, 0.8)'
                      }}>
                        <span style={{
                          fontSize: '0.72rem',
                          color: '#64748b',
                          display: 'block',
                          textTransform: 'capitalize',
                          marginBottom: 2
                        }}>
                          {opName.replace('_', ' ')}
                        </span>
                        <strong style={{ fontSize: '1rem', fontFamily: 'var(--font-mono)', color: '#0f172a' }}>
                          {count?.toLocaleString()}
                        </strong>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="glass-panel" style={{
              padding: 48,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 380
            }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'rgba(79, 70, 229, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4f46e5',
                marginBottom: 16
              }}>
                <Flame size={28} />
              </div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>
                No Active Stress Test Result
              </h4>
              <p style={{ fontSize: '0.88rem', color: '#64748b', maxWidth: 360, lineHeight: 1.5, marginBottom: 20 }}>
                Configure the input workload generator on the left and click <strong>"Execute Diagnostic Stress Test"</strong> to measure runtime, memory, and risk.
              </p>
              <button onClick={handleRun} className="btn-primary" style={{ padding: '9px 20px' }}>
                <Play size={14} />
                <span>Run Default Workload</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
