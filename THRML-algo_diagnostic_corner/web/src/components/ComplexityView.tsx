import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Table, 
  Play, 
  HelpCircle, 
  CheckCircle, 
  AlertOctagon,
  Sparkles,
  Info
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';
import { fetchComplexityTable, runBenchmarkSeries } from '../services/api';
import { ComplexityEntry, BenchmarkSeriesPoint } from '../types';
import { RiskBadge } from './RiskBadge';

export const ComplexityView: React.FC = () => {
  const [tableData, setTableData] = useState<ComplexityEntry[]>([]);
  const [selectedAlgo, setSelectedAlgo] = useState<string>('floyd_warshall');
  const [seriesData, setSeriesData] = useState<BenchmarkSeriesPoint[]>([]);
  const [loadingSeries, setLoadingSeries] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    fetchComplexityTable().then(setTableData).catch(console.error);
    handlePlotSeries('floyd_warshall');
  }, []);

  const handlePlotSeries = async (algo: string) => {
    setLoadingSeries(true);
    setSelectedAlgo(algo);
    try {
      const res = await runBenchmarkSeries(algo);
      setSeriesData(res.series);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSeries(false);
    }
  };

  const categories = ['all', ...Array.from(new Set(tableData.map(t => t.category)))];
  const filteredTable = filterCategory === 'all' 
    ? tableData 
    : tableData.filter(t => t.category === filterCategory);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span className="badge-category">DAA THEORETICAL FOUNDATIONS</span>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Complexity Classification & Asymptotic Curve Analysis</span>
        </div>
        <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>
          Theoretical Asymptotic Bounds & Empirical Growth Fitting
        </h3>
        <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, maxWidth: 900 }}>
          Relating empirical wall-clock measurements to theoretical complexity classes (P, NP-Complete, NP-Hard). Demonstrating why cubic algorithms (O(V³)) and combinatorial exponential algorithms (O(2ⁿ), O(N!)) experience severe operational degradation.
        </p>
      </div>

      {/* Dynamic Asymptotic Curve Fitter */}
      <div className="glass-panel" style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <TrendingUp size={18} color="#4f46e5" />
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>
                Scalability Growth Curve Fitter: Empirical vs. Asymptotic Bound
              </h4>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Computes empirical scaling exponent <strong>k = log(T₂/T₁) / log(N₂/N₁)</strong> where T(n) ∝ nᵏ
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <select
              value={selectedAlgo}
              onChange={(e) => handlePlotSeries(e.target.value)}
              className="glass-input"
              style={{ fontWeight: 600, color: '#0f172a' }}
            >
              <option value="floyd_warshall">Floyd-Warshall — Cubic O(V³)</option>
              <option value="matrix_chain">Matrix Chain Multiplication — Cubic O(n³)</option>
              <option value="nqueen">N-Queen Problem — Factorial O(N!)</option>
              <option value="tsp">Travelling Salesperson — Factorial/Exp O(n!)</option>
              <option value="hamiltonian">Hamiltonian Problem — Exponential O(2ⁿ)</option>
              <option value="prim">Prim's MST — Polynomial O(E log V)</option>
            </select>

            <button 
              onClick={() => handlePlotSeries(selectedAlgo)}
              disabled={loadingSeries}
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.84rem' }}
            >
              <Play size={14} />
              <span>{loadingSeries ? 'Plotting...' : 'Re-compute Curve'}</span>
            </button>
          </div>
        </div>

        {/* Growth Curve Chart */}
        <div style={{ height: 320, width: '100%', marginBottom: 16 }}>
          <ResponsiveContainer>
            <LineChart data={seriesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(226, 232, 240, 0.8)" />
              <XAxis dataKey="size" label={{ value: 'Input Scale (N or V)', position: 'insideBottom', offset: -5 }} />
              <YAxis yAxisId="left" label={{ value: 'Measured Time (ms)', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'Relative Theoretical Curve', angle: 90, position: 'insideRight' }} />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="runtime_ms" name="Measured Runtime (ms)" stroke="#4f46e5" strokeWidth={3} dot={{ r: 5 }} />
              <Line yAxisId="right" type="monotone" dataKey="theoretical_relative" name="Theoretical O(f(n)) Growth" stroke="#f43f5e" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Exponent & Data Table */}
        {seriesData.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 12,
            padding: 16,
            borderRadius: 12,
            background: 'rgba(248, 250, 252, 0.85)',
            border: '1px solid rgba(226, 232, 240, 0.8)'
          }}>
            {seriesData.map((pt, idx) => (
              <div key={idx} style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>Size N = {pt.size}</span>
                <strong style={{ fontSize: '0.95rem', fontFamily: 'var(--font-mono)', color: '#0f172a' }}>
                  {pt.runtime_ms} ms
                </strong>
                {pt.empirical_exponent > 0 && (
                  <span style={{ fontSize: '0.72rem', display: 'block', color: '#4f46e5', fontWeight: 600 }}>
                    k ≈ {pt.empirical_exponent}
                  </span>
                )}
                <div style={{ marginTop: 4 }}>
                  <RiskBadge level={pt.risk_level} size="sm" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Theoretical Complexity Explorer Table */}
      <div className="glass-panel" style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Table size={18} color="#4f46e5" />
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>
              Complexity Classification Reference Matrix (13 Algorithms)
            </h4>
          </div>

          {/* Category Filter */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  fontSize: '0.75rem',
                  fontWeight: filterCategory === cat ? 700 : 500,
                  color: filterCategory === cat ? '#ffffff' : '#475569',
                  background: filterCategory === cat ? '#4f46e5' : 'rgba(255, 255, 255, 0.7)',
                  border: '1px solid rgba(226, 232, 240, 0.8)',
                  cursor: 'pointer'
                }}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(226, 232, 240, 0.9)', color: '#475569' }}>
                <th style={{ padding: '10px 14px' }}>Algorithm</th>
                <th style={{ padding: '10px 14px' }}>Category</th>
                <th style={{ padding: '10px 14px' }}>Time Bound</th>
                <th style={{ padding: '10px 14px' }}>Space</th>
                <th style={{ padding: '10px 14px' }}>Problem Class</th>
              </tr>
            </thead>
            <tbody>
              {filteredTable.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(241, 245, 249, 0.9)' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a' }}>{item.algorithm}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span className="badge-category">{item.category}</span>
                  </td>
                  <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#4f46e5' }}>
                    {item.time || item.time_insert || 'O(log n)'}
                  </td>
                  <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', color: '#64748b' }}>{item.space}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{
                      fontWeight: 600,
                      color: item.problem_class.includes('NP') ? '#e11d48' : '#059669',
                      fontSize: '0.8rem'
                    }}>
                      {item.problem_class}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
