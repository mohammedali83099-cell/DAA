import React, { useState, useEffect } from 'react';
import { 
  GitCompare, 
  Zap, 
  BarChart2, 
  Layers, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle,
  HelpCircle,
  Play
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';
import { runComparison } from '../services/api';
import { RiskBadge } from './RiskBadge';

export const ComparativeArenaView: React.FC = () => {
  const [activeArenaTab, setActiveArenaTab] = useState<'mst' | 'knapsack' | 'heaps' | 'trees'>('mst');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const loadComparison = async (category: string) => {
    setLoading(true);
    try {
      const res = await runComparison(category);
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComparison(activeArenaTab);
  }, [activeArenaTab]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header and Category Tabs */}
      <div className="glass-panel" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className="badge-category">MANDATORY COMPARISON ARENA</span>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Side-by-Side Asymptotic & Architectural Trade-offs</span>
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
              Comparative Stress & Scaling Analysis
            </h3>
          </div>

          <div style={{
            display: 'flex',
            gap: 6,
            background: 'rgba(241, 245, 249, 0.7)',
            padding: 4,
            borderRadius: 12,
            border: '1px solid rgba(226, 232, 240, 0.8)'
          }}>
            {[
              { id: 'mst', label: '1. MST: Prim vs. Kruskal' },
              { id: 'knapsack', label: '2. Knapsack: Greedy vs. 0/1 DP' },
              { id: 'heaps', label: '3. Heaps: Binomial vs. Fibonacci' },
              { id: 'trees', label: '4. Trees: B-Tree vs. Red-Black' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveArenaTab(tab.id as any)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 8,
                  fontSize: '0.82rem',
                  fontWeight: activeArenaTab === tab.id ? 700 : 500,
                  color: activeArenaTab === tab.id ? '#4f46e5' : '#475569',
                  background: activeArenaTab === tab.id ? '#ffffff' : 'transparent',
                  border: activeArenaTab === tab.id ? '1px solid rgba(255, 255, 255, 0.9)' : 'none',
                  cursor: 'pointer',
                  boxShadow: activeArenaTab === tab.id ? '0 2px 8px rgba(15, 23, 42, 0.05)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="glass-panel" style={{ padding: 60, textAlign: 'center' }}>
          <div style={{
            width: 32,
            height: 32,
            border: '3px solid rgba(79, 70, 229, 0.2)',
            borderTopColor: '#4f46e5',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Executing comparative benchmarks and building charts...</p>
        </div>
      ) : data ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* TAB 1: MST PRIM VS KRUSKAL */}
          {activeArenaTab === 'mst' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Theory Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
                <div className="glass-panel" style={{ padding: 20, borderTop: '4px solid #4f46e5' }}>
                  <span className="badge-category" style={{ marginBottom: 8 }}>Vertex-Centric</span>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                    Prim's Algorithm (Adjacency List + Min-Heap)
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: 8 }}>
                    Time Complexity: <strong style={{ fontFamily: 'var(--font-mono)' }}>O(E log V)</strong>. Grows a single tree by relaxing cut edges.
                  </p>
                  <div style={{ fontSize: '0.8rem', color: '#059669', background: 'rgba(16, 185, 129, 0.08)', padding: '8px 12px', borderRadius: 8 }}>
                    <strong>Key Observation:</strong> Consistently superior on <strong>dense graphs</strong> where E approaches V², avoiding the high sorting overhead of large edge lists.
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: 20, borderTop: '4px solid #06b6d4' }}>
                  <span className="badge-category" style={{ marginBottom: 8 }}>Edge-Centric</span>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                    Kruskal's Algorithm (Edge Sorting + DSU)
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: 8 }}>
                    Time Complexity: <strong style={{ fontFamily: 'var(--font-mono)' }}>O(E log E) = O(E log V)</strong>. Sorts all edges, then unions forests.
                  </p>
                  <div style={{ fontSize: '0.8rem', color: '#0284c7', background: 'rgba(14, 165, 233, 0.08)', padding: '8px 12px', borderRadius: 8 }}>
                    <strong>Key Observation:</strong> Highly efficient on <strong>sparse graphs</strong> where E is small (E ≈ V), minimizing edge sort duration.
                  </div>
                </div>
              </div>

              {/* Dual Density Charts */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: 20 }}>
                {/* Sparse Graph Chart */}
                <div className="glass-panel" style={{ padding: 22 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                        Sparse Graph Benchmark (Density 10%)
                      </h4>
                      <p style={{ fontSize: '0.78rem', color: '#64748b' }}>Few edges: Kruskal edge sorting is fast</p>
                    </div>
                    <span className="badge-category" style={{ color: '#059669' }}>E ≈ 0.1 · V²</span>
                  </div>
                  <div style={{ height: 280, width: '100%' }}>
                    <ResponsiveContainer>
                      <LineChart data={data.sparse_results} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(226, 232, 240, 0.8)" />
                        <XAxis dataKey="vertices" label={{ value: 'Vertices (V)', position: 'insideBottom', offset: -5 }} />
                        <YAxis label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="prim_ms" name="Prim (ms)" stroke="#4f46e5" strokeWidth={2.5} dot={{ r: 4 }} />
                        <Line type="monotone" dataKey="kruskal_ms" name="Kruskal (ms)" stroke="#06b6d4" strokeWidth={2.5} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Dense Graph Chart */}
                <div className="glass-panel" style={{ padding: 22 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                        Dense Graph Benchmark (Density 80%)
                      </h4>
                      <p style={{ fontSize: '0.78rem', color: '#64748b' }}>Many edges: Prim heap traversal outperforms</p>
                    </div>
                    <span className="badge-category" style={{ color: '#4f46e5' }}>E ≈ 0.8 · V²</span>
                  </div>
                  <div style={{ height: 280, width: '100%' }}>
                    <ResponsiveContainer>
                      <LineChart data={data.dense_results} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(226, 232, 240, 0.8)" />
                        <XAxis dataKey="vertices" label={{ value: 'Vertices (V)', position: 'insideBottom', offset: -5 }} />
                        <YAxis label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="prim_ms" name="Prim (ms)" stroke="#4f46e5" strokeWidth={2.5} dot={{ r: 4 }} />
                        <Line type="monotone" dataKey="kruskal_ms" name="Kruskal (ms)" stroke="#06b6d4" strokeWidth={2.5} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: KNAPSACK GREEDY VS 0/1 DP */}
          {activeArenaTab === 'knapsack' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
                <div className="glass-panel" style={{ padding: 20, borderTop: '4px solid #10b981' }}>
                  <span className="badge-category" style={{ marginBottom: 8 }}>Greedy Strategy</span>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                    Fractional Knapsack (Value/Weight Greedy)
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: 8 }}>
                    Time Complexity: <strong style={{ fontFamily: 'var(--font-mono)' }}>O(n log n)</strong>. Items are divisible; optimal substructure & greedy choice property both hold.
                  </p>
                  <div style={{ fontSize: '0.8rem', color: '#059669', background: 'rgba(16, 185, 129, 0.08)', padding: '8px 12px', borderRadius: 8 }}>
                    <strong>Capacity Invariance:</strong> Runtime is completely unaffected by capacity W.
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: 20, borderTop: '4px solid #f43f5e' }}>
                  <span className="badge-category" style={{ marginBottom: 8 }}>Dynamic Programming</span>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                    0/1 Knapsack (DP Table Allocation)
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: 8 }}>
                    Time Complexity: <strong style={{ fontFamily: 'var(--font-mono)' }}>O(n · W)</strong>. Items are indivisible (NP-Complete decision variant); greedy heuristic fails.
                  </p>
                  <div style={{ fontSize: '0.8rem', color: '#be123c', background: 'rgba(244, 63, 94, 0.08)', padding: '8px 12px', borderRadius: 8 }}>
                    <strong>Pseudo-Polynomial Vulnerability:</strong> Large capacity W forces memory and table state computation to explode linearly with W.
                  </div>
                </div>
              </div>

              {/* Knapsack Capacity Growth Chart */}
              <div className="glass-panel" style={{ padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                      Capacity (W) Stress Test: Runtime & DP State Table Explosion
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
                      Testing matched datasets as knapsack capacity W scales from 100 to 3000
                    </p>
                  </div>
                  <span className="badge-category">N = 100 Items Constant</span>
                </div>

                <div style={{ height: 320, width: '100%' }}>
                  <ResponsiveContainer>
                    <BarChart data={data.results} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(226, 232, 240, 0.8)" />
                      <XAxis dataKey="capacity" label={{ value: 'Capacity (W)', position: 'insideBottom', offset: -5 }} />
                      <YAxis label={{ value: 'Runtime (ms)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="fractional_ms" name="Fractional (Greedy) ms" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="knapsack01_ms" name="0/1 Knapsack (DP) ms" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HEAPS */}
          {activeArenaTab === 'heaps' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="glass-panel" style={{ padding: 24 }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                  Binomial Heap vs. Fibonacci Heap Operation Benchmark
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: 18 }}>
                  Comparing tree consolidation overhead across scale sequences
                </p>

                <div style={{ height: 300, width: '100%' }}>
                  <ResponsiveContainer>
                    <BarChart data={data.results} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(226, 232, 240, 0.8)" />
                      <XAxis dataKey="operations" label={{ value: 'Operations (N)', position: 'insideBottom', offset: -5 }} />
                      <YAxis label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="binomial_ms" name="Binomial Heap (ms)" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="fibonacci_ms" name="Fibonacci Heap (ms)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TREES */}
          {activeArenaTab === 'trees' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="glass-panel" style={{ padding: 24 }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                  B-Tree (t=3) vs. Red-Black Tree (Pathological Pre-Sorted Insertion)
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: 18 }}>
                  Tracking self-balancing mechanics: B-Tree splits vs. Red-Black rotations & recolorings
                </p>

                <div style={{ height: 300, width: '100%' }}>
                  <ResponsiveContainer>
                    <BarChart data={data.results} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(226, 232, 240, 0.8)" />
                      <XAxis dataKey="keys" label={{ value: 'Inserted Keys (N)', position: 'insideBottom', offset: -5 }} />
                      <YAxis label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="btree_ms" name="B-Tree (ms)" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="rbt_ms" name="Red-Black Tree (ms)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
