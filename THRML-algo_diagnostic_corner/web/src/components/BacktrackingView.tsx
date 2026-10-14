import React, { useState } from 'react';
import { 
  GitFork, 
  Play, 
  Sliders, 
  Clock, 
  HelpCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';
import { runAlgorithmTest } from '../services/api';
import { MetricResult } from '../types';
import { RiskBadge } from './RiskBadge';

export const BacktrackingView: React.FC = () => {
  const [selectedAlgo, setSelectedAlgo] = useState<'nqueen' | 'tsp' | 'hamiltonian'>('nqueen');
  const [sizeN, setSizeN] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MetricResult | null>(null);

  const handleExecute = async () => {
    setLoading(true);
    try {
      let params: Record<string, any> = {};
      if (selectedAlgo === 'nqueen') params.n = sizeN;
      if (selectedAlgo === 'tsp') params.cities = sizeN;
      if (selectedAlgo === 'hamiltonian') {
        params.vertices = sizeN;
        params.has_cycle = true;
      }

      const res = await runAlgorithmTest(selectedAlgo, params);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = result ? [
    {
      name: result.input_size_repr,
      states_generated: result.operations.search_states || result.operations.branches || 0,
      states_pruned: result.operations.pruned_states || 0,
    }
  ] : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Banner */}
      <div className="calm-card" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span className="eyebrow-label">ASSIGNMENT REQUIREMENT 5</span>
          <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>• Combinatorial Explosion & Branch Pruning</span>
        </div>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>
          Backtracking & Branch-and-Bound State-Space Explorer
        </h3>
        <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.6, maxWidth: 880 }}>
          Testing difficult <strong>Hamiltonian Cycle</strong>, <strong>N-Queen</strong>, and <strong>Travelling Salesperson (TSP)</strong> instances. Measuring total search states generated, dead-ends pruned, latency, and observing combinatorial exhaustion when search tree depth scales.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: 20
      }}>
        {/* Controls */}
        <div className="calm-card" style={{ padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
            <Sliders size={16} color="#1e3a5f" />
            <span className="eyebrow-label">SEARCH TREE STRESS PARAMETERS</span>
          </div>

          {/* Algorithm Chips */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
            {[
              { id: 'nqueen', label: 'N-Queen', defaultVal: 10 },
              { id: 'tsp', label: 'TSP Tour', defaultVal: 9 },
              { id: 'hamiltonian', label: 'Hamiltonian', defaultVal: 12 },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedAlgo(item.id as any);
                  setSizeN(item.defaultVal);
                }}
                className={`chip-item ${selectedAlgo === item.id ? 'chip-item-active' : ''}`}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Scale Slider */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569' }}>
                {selectedAlgo === 'nqueen' && 'Board Size (N Queens)'}
                {selectedAlgo === 'tsp' && 'Tour Cities (Permutations n!)'}
                {selectedAlgo === 'hamiltonian' && 'Graph Vertices (V)'}
              </label>
              <span style={{ fontSize: '0.88rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#991b1b' }}>
                {sizeN}
              </span>
            </div>
            <input 
              type="range"
              min={selectedAlgo === 'nqueen' ? 6 : selectedAlgo === 'tsp' ? 4 : 6}
              max={selectedAlgo === 'nqueen' ? 14 : selectedAlgo === 'tsp' ? 13 : 18}
              step={1}
              value={sizeN}
              onChange={(e) => setSizeN(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#991b1b' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: '0.7rem', color: '#94a3b8' }}>
              <span>Feasible Range</span>
              <span style={{ color: '#991b1b', fontWeight: 600 }}>High Risk / Timeout Threshold</span>
            </div>
          </div>

          <button
            onClick={handleExecute}
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '10px 18px', fontSize: '0.86rem' }}
          >
            {loading ? (
              <span>Expanding Search Permutations...</span>
            ) : (
              <>
                <Play size={14} />
                <span>Probe Combinatorial Search Tree</span>
              </>
            )}
          </button>
        </div>

        {/* Telemetry & Pruning Chart */}
        <div>
          {result ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="calm-card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span className="eyebrow-label">SEARCH SPACE AUDIT</span>
                  <RiskBadge level={result.risk.risk_level} size="md" />
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>
                  {result.algorithm_name} — {result.input_size_repr}
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5 }}>
                  {result.risk.reason}
                </p>
              </div>

              {/* Chart */}
              <div className="calm-card" style={{ padding: 20 }}>
                <span className="eyebrow-label" style={{ marginBottom: 12, display: 'block' }}>
                  SEARCH STATES GENERATED VS. PRUNED BRANCHES
                </span>
                <div style={{ height: 220, width: '100%' }}>
                  <ResponsiveContainer>
                    <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="states_generated" name="Search States Generated" fill="#1e3a5f" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="states_pruned" name="Branches Pruned / Backtracked" fill="#10b981" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Stat Strip */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                <div className="calm-card" style={{ padding: 14, textAlign: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>Runtime</span>
                  <strong style={{ fontSize: '1.1rem', fontFamily: 'var(--font-mono)', color: '#0f172a' }}>
                    {result.runtime_ms} ms
                  </strong>
                </div>
                <div className="calm-card" style={{ padding: 14, textAlign: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>States Explored</span>
                  <strong style={{ fontSize: '1.1rem', fontFamily: 'var(--font-mono)', color: '#1e3a5f' }}>
                    {(result.operations.search_states || result.operations.branches || 0).toLocaleString()}
                  </strong>
                </div>
                <div className="calm-card" style={{ padding: 14, textAlign: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>Pruned Nodes</span>
                  <strong style={{ fontSize: '1.1rem', fontFamily: 'var(--font-mono)', color: '#065f46' }}>
                    {(result.operations.pruned_states || 0).toLocaleString()}
                  </strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="calm-card" style={{ padding: 48, textAlign: 'center' }}>
              <GitFork size={32} color="#94a3b8" style={{ margin: '0 auto 10px' }} />
              <h5 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
                Probe Combinatorial Search Space
              </h5>
              <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
                Select problem scale on the left and run the probe to visualize branch-and-bound pruning efficiency.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
