import React from 'react';
import { 
  ShieldAlert, 
  Layers, 
  FlaskConical, 
  BarChart3, 
  ArrowRight, 
  Flame, 
  Zap, 
  AlertOctagon,
  ShieldCheck,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { SystemStatus, HistoryItem } from '../types';
import { RiskBadge } from './RiskBadge';

interface Props {
  status: SystemStatus | null;
  history: HistoryItem[];
  onSelectTab: (tab: string) => void;
  onQuickRun: (algoId: string, params: any) => void;
}

export const DashboardView: React.FC<Props> = ({
  status,
  history,
  onSelectTab,
  onQuickRun,
}) => {
  const lowCount = history.filter(h => h.risk_level === 'LOW').length;
  const modCount = history.filter(h => h.risk_level === 'MODERATE').length;
  const highCount = history.filter(h => h.risk_level === 'HIGH').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Executive Briefing Banner */}
      <div className="calm-card" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ maxWidth: 820 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span className="eyebrow-label">DAA ASSURANCE LABORATORY</span>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>• Asymptotic Stress & Vulnerability Assessment</span>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: 8 }}>
              Algorithmic Reliability & Stress-Testing Suite
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.6 }}>
              Systematically evaluates 13 core syllabus algorithms under adversarial input distributions, scale surges, and memory pressure. Exposes when an algorithm shifts from healthy polynomial scaling to computational exhaustion.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button 
              onClick={() => onSelectTab('compare')}
              className="btn-secondary"
            >
              <span>Comparative Arena</span>
              <ChevronRight size={15} color="#64748b" />
            </button>
            <button 
              onClick={() => onSelectTab('lab')}
              className="btn-primary"
            >
              <FlaskConical size={15} />
              <span>Diagnostic Lab</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Telemetry Row (Habitus-style 3-Column Metric Card) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span className="eyebrow-label" style={{ paddingLeft: 4 }}>
          SYSTEM COVERAGE & ACTIVITY
        </span>
        <div className="calm-card" style={{ padding: '20px 24px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 24,
            alignItems: 'center'
          }}>
            {/* Algorithms */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, color: '#64748b' }}>
                <Layers size={14} />
                <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>Syllabus Algorithms</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span className="hero-metric-number">{status?.total_algorithms || 13}</span>
                <span className="hero-metric-unit">instrumented</span>
              </div>
              <div className="progress-bar-track" style={{ marginTop: 8 }}>
                <div className="progress-bar-fill" style={{ width: '100%', backgroundColor: '#1e3a5f' }} />
              </div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginTop: 4 }}>
                100% mandatory coverage
              </span>
            </div>

            {/* Test Families */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, color: '#64748b' }}>
                <FlaskConical size={14} />
                <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>Test Families</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span className="hero-metric-number">{status?.test_families?.length || 6}</span>
                <span className="hero-metric-unit">workloads</span>
              </div>
              <div className="progress-bar-track" style={{ marginTop: 8 }}>
                <div className="progress-bar-fill" style={{ width: '100%', backgroundColor: '#0284c7' }} />
              </div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginTop: 4 }}>
                Normal, Pathological, Scale
              </span>
            </div>

            {/* Experiments Recorded */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, color: '#64748b' }}>
                <BarChart3 size={14} />
                <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>Session Experiments</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span className="hero-metric-number">{history.length}</span>
                <span className="hero-metric-unit">runs recorded</span>
              </div>
              <div className="progress-bar-track" style={{ marginTop: 8 }}>
                <div className="progress-bar-fill" style={{ width: `${Math.min(100, history.length * 10)}%`, backgroundColor: '#10b981' }} />
              </div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginTop: 4 }}>
                Tracked in session ledger
              </span>
            </div>

            {/* Risk Distribution */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, color: '#64748b' }}>
                <ShieldAlert size={14} />
                <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>Risk Tally</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                <span className="badge-risk badge-risk-low" style={{ fontSize: '0.72rem' }}>
                  <span className="badge-dot" style={{ backgroundColor: '#10b981' }} />
                  {lowCount} Low
                </span>
                <span className="badge-risk badge-risk-moderate" style={{ fontSize: '0.72rem' }}>
                  <span className="badge-dot" style={{ backgroundColor: '#f59e0b' }} />
                  {modCount} Mod
                </span>
                <span className="badge-risk badge-risk-high" style={{ fontSize: '0.72rem' }}>
                  <span className="badge-dot" style={{ backgroundColor: '#ef4444' }} />
                  {highCount} High
                </span>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginTop: 10 }}>
                Observed risk spectrum
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Highlighted Syllabus Stress Probes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 4, paddingRight: 4 }}>
          <span className="eyebrow-label">
            HIGHLIGHTED STRESS LABS
          </span>
          <button 
            onClick={() => onSelectTab('lab')} 
            style={{ 
              background: 'none', 
              border: 'none', 
              fontSize: '0.78rem', 
              color: '#1e3a5f', 
              fontWeight: 600, 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            <span>View All 13 Algorithms</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
          gap: 16
        }}>
          {/* Floyd-Warshall */}
          <div className="calm-card calm-card-interactive" style={{ padding: 22, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b' }}>Dynamic Programming</span>
                <span style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#1e3a5f', fontWeight: 700 }}>O(V³)</span>
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                Floyd-Warshall Cubic Matrix Pressure
              </h4>
              <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5, marginBottom: 16 }}>
                Measures triple-nested loop iterations across dense graph distance matrices as vertex count V scales past 100.
              </p>
            </div>
            <button 
              onClick={() => onQuickRun('floyd_warshall', { vertices: 100 })}
              className="btn-secondary" 
              style={{ width: '100%', justifyContent: 'space-between', fontSize: '0.82rem' }}
            >
              <span>Test V=100 Cubic Stress</span>
              <ChevronRight size={14} color="#64748b" />
            </button>
          </div>

          {/* TSP */}
          <div className="calm-card calm-card-interactive" style={{ padding: 22, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b' }}>Backtracking / B&B</span>
                <span style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#991b1b', fontWeight: 700 }}>NP-Hard / O(n!)</span>
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                TSP State-Space Factorial Explosion
              </h4>
              <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5, marginBottom: 16 }}>
                Tracks permutation search depth and records generated vs pruned branches up to safety timeout limits.
              </p>
            </div>
            <button 
              onClick={() => onQuickRun('tsp', { cities: 11 })}
              className="btn-secondary" 
              style={{ width: '100%', justifyContent: 'space-between', fontSize: '0.82rem' }}
            >
              <span>Test N=11 Cities Tour</span>
              <ChevronRight size={14} color="#64748b" />
            </button>
          </div>

          {/* MST Dual Arena */}
          <div className="calm-card calm-card-interactive" style={{ padding: 22, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b' }}>MST Comparison</span>
                <span style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#065f46', fontWeight: 700 }}>Sparse vs Dense</span>
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                Prim vs. Kruskal Graph Density Arena
              </h4>
              <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5, marginBottom: 16 }}>
                Demonstrates how edge sorting overhead in Kruskal contrasts with min-heap relaxations in Prim as density scales.
              </p>
            </div>
            <button 
              onClick={() => onSelectTab('compare')}
              className="btn-secondary" 
              style={{ width: '100%', justifyContent: 'space-between', fontSize: '0.82rem' }}
            >
              <span>Open Density Arena</span>
              <ChevronRight size={14} color="#64748b" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity Table Preview */}
      {history.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 4, paddingRight: 4 }}>
            <span className="eyebrow-label">
              RECENT EXPERIMENTS
            </span>
            <button 
              onClick={() => onSelectTab('reports')} 
              style={{ background: 'none', border: 'none', fontSize: '0.78rem', color: '#1e3a5f', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2 }}
            >
              <span>View Full Ledger</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="calm-card" style={{ padding: '16px 20px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                  <th style={{ padding: '8px 12px', fontWeight: 600 }}>ID</th>
                  <th style={{ padding: '8px 12px', fontWeight: 600 }}>Algorithm</th>
                  <th style={{ padding: '8px 12px', fontWeight: 600 }}>Workload Scale</th>
                  <th style={{ padding: '8px 12px', fontWeight: 600 }}>Runtime</th>
                  <th style={{ padding: '8px 12px', fontWeight: 600 }}>Memory</th>
                  <th style={{ padding: '8px 12px', fontWeight: 600 }}>Verdict</th>
                </tr>
              </thead>
              <tbody>
                {history.slice(-5).reverse().map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 12px', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>#{item.id}</td>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: '#0f172a' }}>{item.algorithm_name}</td>
                    <td style={{ padding: '10px 12px', color: '#475569' }}>{item.input_size}</td>
                    <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{item.runtime_ms} ms</td>
                    <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', color: '#64748b' }}>{item.memory_kb} KB</td>
                    <td style={{ padding: '10px 12px' }}>
                      <RiskBadge level={item.risk_level} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
