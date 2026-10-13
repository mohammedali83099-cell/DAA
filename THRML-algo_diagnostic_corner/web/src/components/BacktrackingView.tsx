import React, { useState } from 'react';
import { 
  Cpu, 
  GitFork, 
  AlertOctagon, 
  Play, 
  Sliders, 
  Clock, 
  CheckCircle,
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

  // Chart data for states generated vs pruned
  const chartData = result ? [
    {
      name: result.input_size_repr,
      states_generated: result.operations.search_states || result.operations.branches || 0,
      states_pruned: result.operations.pruned_states || 0,
    }
  ] : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Banner */}
      <div className="glass-panel" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span className="badge-category">ASSIGNMENT REQUIREMENT 5</span>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Combinatorial Explosion & Search Tree Pruning</span>
        </div>
        <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>
          Backtracking & Branch-and-Bound State-Space Explorer
        </h3>
        <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, maxWidth: 900 }}>
          Testing difficult <strong>Hamiltonian Cycle</strong>, <strong>N-Queen</strong>, and <strong>Travelling Salesperson (TSP)</strong> instances. Recording total search states generated, dead-ends pruned, execution latency, and observing combinatorial exhaustion when search tree depth scales.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: 24
      }}>
        {/* Controls Column */}
        <div className="glass-panel" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
            <Sliders size={18} color="#4f46e5" />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
              Backtracking Stress Controls
            </h4>
          </div>

          {/* Algorithm Tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {[
              { id: 'nqueen', label: 'N-Queen', min: 6, max: 14, defaultVal: 10 },
              { id: 'tsp', label: 'TSP Tour', min: 4, max: 13, defaultVal: 9 },
              { id: 'hamiltonian', label: 'Hamiltonian', min: 6, max: 18, defaultVal: 12 },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedAlgo(item.id as any);
                  setSizeN(item.defaultVal);
                }}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: 10,
                  fontSize: '0.82rem',
                  fontWeight: selectedAlgo === item.id ? 700 : 500,
                  color: selectedAlgo === item.id ? '#4f46e5' : '#475569',
                  background: selectedAlgo === item.id ? 'rgba(79, 70, 229, 0.08)' : 'rgba(255, 255, 255, 0.6)',
                  border: selectedAlgo === item.id ? '1px solid #4f46e5' : '1px solid rgba(226, 232, 240, 0.8)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Scale Slider */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>
                {selectedAlgo === 'nqueen' && 'Board Size (N Queens)'}
                {selectedAlgo === 'tsp' && 'Tour Cities (Permutations n!)'}
                {selectedAlgo === 'hamiltonian' && 'Graph Vertices (V)'}
              </label>
              <span style={{ fontSize: '0.9rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#e11d48' }}>
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
              style={{ width: '100%', accentColor: '#e11d48' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: '0.72rem', color: '#94a3b8' }}>
              <span>Feasible scale</span>
              <span style={{ color: '#e11d48', fontWeight: 600 }}>Exponential High Risk Zone</span>
            </div>
          </div>

          <button
            onClick={handleExecute}
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '12px 20px', fontSize: '0.95rem' }}
          >
            {loading ? (
              <span>Expanding Search Tree...</span>
            ) : (
              <>
                <Play size={16} />
                <span>Probe Combinatorial Search Tree</span>
              </>
            )}
          </button>
        </div>

        {/* Telemetry & Pruning Chart */}
        <div>
          {result ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Risk Badge & Summary */}
              <div className="glass-panel" style={{ padding: 22 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>
                    SEARCH SPACE AUDIT
                  </span>
                  <RiskBadge level={result.risk.risk_level} size="md" />
                </div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>
                  {result.algorithm_name} — {result.input_size_repr}
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
                  {result.risk.reason}
                </p>
              </div>

              {/* States Generated vs Pruned Chart */}
              <div className="glass-panel" style={{ padding: 22 }}>
                <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: 14 }}>
                  States Generated vs. Pruned Branch Count
                </h5>
                <div style={{ height: 240, width: '100%' }}>
                  <ResponsiveContainer>
                    <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(226, 232, 240, 0.8)" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="states_generated" name="Search States Generated" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="states_pruned" name="Branches Pruned / Backtracked" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Exact Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                <div className="glass-panel" style={{ padding: 16, textAlign: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>Runtime</span>
                  <strong style={{ fontSize: '1.2rem', fontFamily: 'var(--font-mono)', color: '#0f172a' }}>
                    {result.runtime_ms} ms
                  </strong>
                </div>
                <div className="glass-panel" style={{ padding: 16, textAlign: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>Search States</span>
                  <strong style={{ fontSize: '1.2rem', fontFamily: 'var(--font-mono)', color: '#4f46e5' }}>
                    {(result.operations.search_states || result.operations.branches || 0).toLocaleString()}
                  </strong>
                </div>
                <div className="glass-panel" style={{ padding: 16, textAlign: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>Pruned Nodes</span>
                  <strong style={{ fontSize: '1.2rem', fontFamily: 'var(--font-mono)', color: '#059669' }}>
                    {(result.operations.pruned_states || 0).toLocaleString()}
                  </strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: 48, textAlign: 'center' }}>
              <GitFork size={36} color="#64748b" style={{ margin: '0 auto 12px' }} />
              <h5 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                Probe a Combinatorial Problem
              </h5>
              <p style={{ fontSize: '0.84rem', color: '#64748b' }}>
                Select problem scale on the left and run the search tree probe to visualize states and pruning.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
