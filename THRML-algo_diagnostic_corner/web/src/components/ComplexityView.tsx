import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Table, 
  Play, 
  HelpCircle, 
  CheckCircle, 
  AlertOctagon
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header Banner */}
      <div className="calm-card" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span className="eyebrow-label">DAA THEORETICAL FOUNDATIONS</span>
          <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>• Asymptotic Growth & Complexity Classes</span>
        </div>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>
          Theoretical Asymptotic Bounds & Empirical Growth Fitting
        </h3>
        <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.6, maxWidth: 880 }}>
          Relating empirical measurements to theoretical complexity classes (P, NP-Complete, NP-Hard). Demonstrating why cubic algorithms (O(V³)) and combinatorial exponential algorithms (O(2ⁿ), O(N!)) experience severe operational degradation.
        </p>
      </div>

      {/* Dynamic Asymptotic Curve Fitter */}
      <div className="calm-card" style={{ padding: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14, marginBottom: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <TrendingUp size={16} color="#1e3a5f" />
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                Scalability Growth Curve Fitter: Empirical vs. Asymptotic Bound
              </h4>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Computes empirical scaling exponent <strong>k = log(T₂/T₁) / log(N₂/N₁)</strong> where T(n) ∝ nᵏ
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <select
              value={selectedAlgo}
              onChange={(e) => handlePlotSeries(e.target.value)}
              className="calm-input"
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
              style={{ padding: '7px 14px', fontSize: '0.8rem' }}
            >
              <Play size={13} />
              <span>{loadingSeries ? 'Plotting...' : 'Plot Curve'}</span>
            </button>
          </div>
        </div>

        {/* Growth Curve Chart */}
        <div style={{ height: 300, width: '100%', marginBottom: 16 }}>
          <ResponsiveContainer>
            <LineChart data={seriesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="size" label={{ value: 'Input Scale (N or V)', position: 'insideBottom', offset: -5 }} />
              <YAxis yAxisId="left" label={{ value: 'Measured Time (ms)', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'Theoretical Relative Curve', angle: 90, position: 'insideRight' }} />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="runtime_ms" name="Measured Runtime (ms)" stroke="#1e3a5f" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line yAxisId="right" type="monotone" dataKey="theoretical_relative" name="Theoretical O(f(n)) Bound" stroke="#991b1b" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Multi-point Metric Tally */}
        {seriesData.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 10,
            padding: 12,
            borderRadius: 8,
            background: '#f8fafc',
            border: '1px solid #e2e8f0'
          }}>
            {seriesData.map((pt, idx) => (
              <div key={idx} style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>Size N = {pt.size}</span>
                <strong style={{ fontSize: '0.9rem', fontFamily: 'var(--font-mono)', color: '#0f172a' }}>
                  {pt.runtime_ms} ms
                </strong>
                {pt.empirical_exponent > 0 && (
                  <span style={{ fontSize: '0.7rem', display: 'block', color: '#1e3a5f', fontWeight: 600 }}>
                    k ≈ {pt.empirical_exponent}
                  </span>
                )}
                <div style={{ marginTop: 3 }}>
                  <RiskBadge level={pt.risk_level} size="sm" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Theoretical Complexity Explorer Table */}
      <div className="calm-card" style={{ padding: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Table size={16} color="#1e3a5f" />
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
              Complexity Classification Reference Matrix (13 Algorithms)
            </h4>
          </div>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`chip-item ${filterCategory === cat ? 'chip-item-active' : ''}`}
                style={{ fontSize: '0.72rem', padding: '3px 8px' }}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                <th style={{ padding: '8px 12px', fontWeight: 600 }}>Algorithm</th>
                <th style={{ padding: '8px 12px', fontWeight: 600 }}>Category</th>
                <th style={{ padding: '8px 12px', fontWeight: 600 }}>Time Bound</th>
                <th style={{ padding: '8px 12px', fontWeight: 600 }}>Space Bound</th>
                <th style={{ padding: '8px 12px', fontWeight: 600 }}>Problem Class</th>
              </tr>
            </thead>
            <tbody>
              {filteredTable.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 700, color: '#0f172a' }}>{item.algorithm}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span className="chip-item" style={{ fontSize: '0.7rem', padding: '2px 6px' }}>{item.category}</span>
                  </td>
                  <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#1e3a5f' }}>
                    {item.time || item.time_insert || 'O(log n)'}
                  </td>
                  <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', color: '#64748b' }}>{item.space}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{
                      fontWeight: 600,
                      color: item.problem_class.includes('NP') ? '#991b1b' : '#065f46',
                      fontSize: '0.78rem'
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
