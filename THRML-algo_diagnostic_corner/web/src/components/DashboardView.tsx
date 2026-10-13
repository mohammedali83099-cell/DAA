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
  AlertTriangle
} from 'lucide-react';
import { SystemStatus, HistoryItem, RiskLevel } from '../types';
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
      {/* Mission Banner */}
      <div className="glass-panel" style={{
        padding: '28px 32px',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(240, 244, 254, 0.82) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 20
      }}>
        <div style={{ maxWidth: 780 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span className="badge-category" style={{ background: 'rgba(79, 70, 229, 0.1)', color: '#4f46e5' }}>
              DAA ASSIGNMENT 3
            </span>
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 500 }}>
              Software Assurance & Vulnerability Framework
            </span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: 10 }}>
            Algorithm Vulnerability & Stress-Testing Laboratory
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.6 }}>
            Testing not only whether syllabus algorithms give the correct answer, but <strong>under what input conditions they become slow, memory-intensive, or impractical</strong>. Exposing high operation counts, deep search trees, and non-linear scale explosion.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button 
            onClick={() => onSelectTab('compare')}
            className="btn-glass"
            style={{ padding: '10px 18px', fontWeight: 600 }}
          >
            <span>Compare MST & Knapsack</span>
            <ArrowRight size={16} />
          </button>
          <button 
            onClick={() => onSelectTab('lab')}
            className="btn-primary"
            style={{ padding: '10px 20px' }}
          >
            <FlaskConical size={16} />
            <span>Open Diagnostic Lab</span>
          </button>
        </div>
      </div>

      {/* Key Metric Tiles */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 16
      }}>
        <div className="glass-panel" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>SYLLABUS ALGORITHMS</span>
            <div style={{ padding: 8, borderRadius: 10, background: 'rgba(79, 70, 229, 0.08)', color: '#4f46e5' }}>
              <Layers size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>
            {status?.total_algorithms || 13}
          </div>
          <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
            Across Heaps, Trees, MST, Greedy, DP & Backtracking
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>TEST FAMILIES</span>
            <div style={{ padding: 8, borderRadius: 10, background: 'rgba(14, 165, 233, 0.08)', color: '#0284c7' }}>
              <FlaskConical size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>
            {status?.test_families?.length || 6}
          </div>
          <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
            Normal, Large, Pathological, Boundary, Structured, Scale
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>COMPLETED EXPERIMENTS</span>
            <div style={{ padding: 8, borderRadius: 10, background: 'rgba(16, 185, 129, 0.08)', color: '#059669' }}>
              <BarChart3 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>
            {history.length}
          </div>
          <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
            Recorded in current laboratory session
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>OBSERVED RISK SPECTRUM</span>
            <div style={{ padding: 8, borderRadius: 10, background: 'rgba(244, 63, 94, 0.08)', color: '#e11d48' }}>
              <ShieldAlert size={18} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <ShieldCheck size={16} color="#059669" />
              <span style={{ fontWeight: 700, color: '#059669' }}>{lowCount}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <AlertTriangle size={16} color="#d97706" />
              <span style={{ fontWeight: 700, color: '#d97706' }}>{modCount}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <AlertOctagon size={16} color="#e11d48" />
              <span style={{ fontWeight: 700, color: '#e11d48' }}>{highCount}</span>
            </div>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 6 }}>
            Low / Moderate / High vulnerability ratings
          </p>
        </div>
      </div>

      {/* Quick Stress Test Cards */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>
              Highlighted Syllabus Vulnerability Labs
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Launch targeted stress tests specifically designed for the assignment requirements
            </p>
          </div>
          <button onClick={() => onSelectTab('lab')} className="btn-glass" style={{ fontSize: '0.8rem' }}>
            <span>View All 13 Algorithms</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 16
        }}>
          {/* Floyd Warshall */}
          <div className="glass-panel glass-panel-interactive" style={{ padding: 22, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span className="badge-category">Dynamic Programming</span>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#4f46e5', fontWeight: 600 }}>O(V³)</span>
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                Floyd-Warshall Cubic Matrix Pressure
              </h4>
              <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5, marginBottom: 16 }}>
                Observes triple-nested loop updates across dense graph distance matrices as vertex count V scales past 100.
              </p>
            </div>
            <button 
              onClick={() => onQuickRun('floyd_warshall', { vertices: 100 })}
              className="btn-glass" 
              style={{ width: '100%', justifyContent: 'space-between', fontWeight: 600 }}
            >
              <span>Test V=100 Cubic Stress</span>
              <Flame size={15} color="#ea580c" />
            </button>
          </div>

          {/* TSP */}
          <div className="glass-panel glass-panel-interactive" style={{ padding: 22, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span className="badge-category">Backtracking / B&B</span>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#e11d48', fontWeight: 600 }}>NP-Hard / O(n!)</span>
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                TSP State-Space Combinatorial Explosion
              </h4>
              <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5, marginBottom: 16 }}>
                Tests factorial permutation search trees and records generated vs pruned branches up to safety timeout limits.
              </p>
            </div>
            <button 
              onClick={() => onQuickRun('tsp', { cities: 11 })}
              className="btn-glass" 
              style={{ width: '100%', justifyContent: 'space-between', fontWeight: 600 }}
            >
              <span>Stress N=11 Cities Tour</span>
              <AlertOctagon size={15} color="#e11d48" />
            </button>
          </div>

          {/* MST Prim vs Kruskal */}
          <div className="glass-panel glass-panel-interactive" style={{ padding: 22, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span className="badge-category">MST Comparison</span>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#059669', fontWeight: 600 }}>Sparse vs Dense</span>
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                Prim vs. Kruskal Graph Density Arena
              </h4>
              <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5, marginBottom: 16 }}>
                Demonstrates how edge sorting overhead in Kruskal contrasts with min-heap relaxations in Prim as density scales.
              </p>
            </div>
            <button 
              onClick={() => onSelectTab('compare')}
              className="btn-glass" 
              style={{ width: '100%', justifyContent: 'space-between', fontWeight: 600 }}
            >
              <span>Open Dual-Density Arena</span>
              <Zap size={15} color="#4f46e5" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent History Table Preview */}
      {history.length > 0 && (
        <div className="glass-panel" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
              Recent Laboratory Experiments
            </h3>
            <button onClick={() => onSelectTab('reports')} className="btn-glass" style={{ fontSize: '0.78rem' }}>
              <span>View All / Export</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(226, 232, 240, 0.8)', color: '#64748b' }}>
                  <th style={{ padding: '8px 12px' }}>ID</th>
                  <th style={{ padding: '8px 12px' }}>Algorithm</th>
                  <th style={{ padding: '8px 12px' }}>Workload</th>
                  <th style={{ padding: '8px 12px' }}>Runtime</th>
                  <th style={{ padding: '8px 12px' }}>Memory</th>
                  <th style={{ padding: '8px 12px' }}>Risk Verdict</th>
                </tr>
              </thead>
              <tbody>
                {history.slice(-5).reverse().map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid rgba(241, 245, 249, 0.8)' }}>
                    <td style={{ padding: '10px 12px', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>#{item.id}</td>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: '#0f172a' }}>{item.algorithm_name}</td>
                    <td style={{ padding: '10px 12px', color: '#64748b' }}>{item.input_size}</td>
                    <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)' }}>{item.runtime_ms} ms</td>
                    <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)' }}>{item.memory_kb} KB</td>
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
