import React, { useState, useEffect } from 'react';
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header and Category Selector Chips */}
      <div className="calm-card" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className="eyebrow-label">SYLLABUS COMPARATIVE ARENA</span>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>• Empirical Asymptotic Trade-Offs</span>
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>
              Comparative Stress & Scaling Analysis
            </h3>
          </div>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[
              { id: 'mst', label: '1. MST: Prim vs. Kruskal' },
              { id: 'knapsack', label: '2. Knapsack: Greedy vs. 0/1 DP' },
              { id: 'heaps', label: '3. Heaps: Binomial vs. Fibonacci' },
              { id: 'trees', label: '4. Trees: B-Tree vs. Red-Black' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveArenaTab(tab.id as any)}
                className={`chip-item ${activeArenaTab === tab.id ? 'chip-item-active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="calm-card" style={{ padding: 60, textAlign: 'center' }}>
          <div style={{
            width: 28,
            height: 28,
            border: '3px solid #e2e8f0',
            borderTopColor: '#1e3a5f',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 14px'
          }} />
          <p style={{ color: '#64748b', fontSize: '0.86rem' }}>Running matched benchmarks and compiling curves...</p>
        </div>
      ) : data ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* TAB 1: MST PRIM VS KRUSKAL */}
          {activeArenaTab === 'mst' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Theory Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: 14 }}>
                <div className="calm-card" style={{ padding: 18, borderTop: '3px solid #1e3a5f' }}>
                  <span className="eyebrow-label" style={{ marginBottom: 6, display: 'block' }}>VERTEX-CENTRIC GRAPH TRAVERSAL</span>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
                    Prim's Algorithm (Adjacency List + Min-Heap)
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5, marginBottom: 8 }}>
                    Bound: <strong style={{ fontFamily: 'var(--font-mono)' }}>O(E log V)</strong>. Grows a single spanning tree by greedily adding minimum weight cut edges.
                  </p>
                  <div style={{ fontSize: '0.78rem', color: '#065f46', background: '#ecfdf5', padding: '6px 10px', borderRadius: 6 }}>
                    <strong>Observation:</strong> Dominates on <strong>dense graphs</strong> where E approaches V², avoiding edge sorting overhead.
                  </div>
                </div>

                <div className="calm-card" style={{ padding: 18, borderTop: '3px solid #0284c7' }}>
                  <span className="eyebrow-label" style={{ marginBottom: 6, display: 'block' }}>EDGE-CENTRIC FOREST UNION</span>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
                    Kruskal's Algorithm (Edge Sorting + DSU)
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5, marginBottom: 8 }}>
                    Bound: <strong style={{ fontFamily: 'var(--font-mono)' }}>O(E log E) = O(E log V)</strong>. Sorts all graph edges globally, then unions disjoint sets.
                  </p>
                  <div style={{ fontSize: '0.78rem', color: '#0369a1', background: '#f0f9ff', padding: '6px 10px', borderRadius: 6 }}>
                    <strong>Observation:</strong> Highly efficient on <strong>sparse graphs</strong> where E is small (E ≈ V), minimizing edge sort duration.
                  </div>
                </div>
              </div>

              {/* Dual Density Charts */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 16 }}>
                {/* Sparse Graph */}
                <div className="calm-card" style={{ padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div>
                      <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#0f172a' }}>
                        Sparse Graph Benchmark (Density 10%)
                      </h4>
                      <p style={{ fontSize: '0.76rem', color: '#64748b' }}>Few edges: Kruskal edge sorting excels</p>
                    </div>
                    <span className="chip-item" style={{ fontSize: '0.72rem', padding: '3px 8px' }}>E ≈ 0.1 · V²</span>
                  </div>
                  <div style={{ height: 260, width: '100%' }}>
                    <ResponsiveContainer>
                      <LineChart data={data.sparse_results} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="vertices" label={{ value: 'Vertices (V)', position: 'insideBottom', offset: -5 }} />
                        <YAxis label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="prim_ms" name="Prim (ms)" stroke="#1e3a5f" strokeWidth={2.5} dot={{ r: 4 }} />
                        <Line type="monotone" dataKey="kruskal_ms" name="Kruskal (ms)" stroke="#0284c7" strokeWidth={2.5} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Dense Graph */}
                <div className="calm-card" style={{ padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div>
                      <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#0f172a' }}>
                        Dense Graph Benchmark (Density 80%)
                      </h4>
                      <p style={{ fontSize: '0.76rem', color: '#64748b' }}>Many edges: Prim heap traversal outperforms</p>
                    </div>
                    <span className="chip-item" style={{ fontSize: '0.72rem', padding: '3px 8px' }}>E ≈ 0.8 · V²</span>
                  </div>
                  <div style={{ height: 260, width: '100%' }}>
                    <ResponsiveContainer>
                      <LineChart data={data.dense_results} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="vertices" label={{ value: 'Vertices (V)', position: 'insideBottom', offset: -5 }} />
                        <YAxis label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="prim_ms" name="Prim (ms)" stroke="#1e3a5f" strokeWidth={2.5} dot={{ r: 4 }} />
                        <Line type="monotone" dataKey="kruskal_ms" name="Kruskal (ms)" stroke="#0284c7" strokeWidth={2.5} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: KNAPSACK GREEDY VS 0/1 DP */}
          {activeArenaTab === 'knapsack' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: 14 }}>
                <div className="calm-card" style={{ padding: 18, borderTop: '3px solid #10b981' }}>
                  <span className="eyebrow-label" style={{ marginBottom: 6, display: 'block' }}>GREEDY OPTIMIZATION STRATEGY</span>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
                    Fractional Knapsack (Value/Weight Ratio Sorting)
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5, marginBottom: 8 }}>
                    Bound: <strong style={{ fontFamily: 'var(--font-mono)' }}>O(n log n)</strong>. Items are divisible; greedy choice property holds.
                  </p>
                  <div style={{ fontSize: '0.78rem', color: '#065f46', background: '#ecfdf5', padding: '6px 10px', borderRadius: 6 }}>
                    <strong>Capacity Invariance:</strong> Runtime is completely flat and unaffected by capacity W.
                  </div>
                </div>

                <div className="calm-card" style={{ padding: 18, borderTop: '3px solid #ef4444' }}>
                  <span className="eyebrow-label" style={{ marginBottom: 6, display: 'block' }}>DYNAMIC PROGRAMMING TABLE ALLOCATION</span>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
                    0/1 Knapsack (Indivisible Items)
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5, marginBottom: 8 }}>
                    Bound: <strong style={{ fontFamily: 'var(--font-mono)' }}>O(n · W)</strong>. Pseudo-polynomial complexity; greedy heuristic fails.
                  </p>
                  <div style={{ fontSize: '0.78rem', color: '#991b1b', background: '#fef2f2', padding: '6px 10px', borderRadius: 6 }}>
                    <strong>Pseudo-Polynomial Risk:</strong> Large capacity W forces DP table memory and computation to expand linearly with W.
                  </div>
                </div>
              </div>

              <div className="calm-card" style={{ padding: 22 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                      Capacity (W) Stress Test: Runtime & DP Table Allocation
                    </h4>
                    <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      Matched datasets (N=100 items) as knapsack capacity W scales from 100 to 3000
                    </p>
                  </div>
                  <span className="chip-item" style={{ fontSize: '0.72rem' }}>N = 100 Items Constant</span>
                </div>

                <div style={{ height: 280, width: '100%' }}>
                  <ResponsiveContainer>
                    <BarChart data={data.results} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="capacity" label={{ value: 'Capacity (W)', position: 'insideBottom', offset: -5 }} />
                      <YAxis label={{ value: 'Runtime (ms)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="fractional_ms" name="Fractional (Greedy) ms" fill="#10b981" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="knapsack01_ms" name="0/1 Knapsack (DP) ms" fill="#ef4444" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HEAPS */}
          {activeArenaTab === 'heaps' && (
            <div className="calm-card" style={{ padding: 22 }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
                Binomial Heap vs. Fibonacci Heap Operation Benchmark
              </h4>
              <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: 16 }}>
                Comparing tree consolidation overhead across scale sequences
              </p>

              <div style={{ height: 280, width: '100%' }}>
                <ResponsiveContainer>
                  <BarChart data={data.results} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="operations" label={{ value: 'Operations (N)', position: 'insideBottom', offset: -5 }} />
                    <YAxis label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="binomial_ms" name="Binomial Heap (ms)" fill="#1e3a5f" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="fibonacci_ms" name="Fibonacci Heap (ms)" fill="#0284c7" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* TAB 4: TREES */}
          {activeArenaTab === 'trees' && (
            <div className="calm-card" style={{ padding: 22 }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
                B-Tree (t=3) vs. Red-Black Tree (Pathological Pre-Sorted Insertion)
              </h4>
              <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: 16 }}>
                Tracking self-balancing mechanics: B-Tree splits vs. Red-Black rotations & recolorings
              </p>

              <div style={{ height: 280, width: '100%' }}>
                <ResponsiveContainer>
                  <BarChart data={data.results} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="keys" label={{ value: 'Inserted Keys (N)', position: 'insideBottom', offset: -5 }} />
                    <YAxis label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="btree_ms" name="B-Tree (ms)" fill="#1e3a5f" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="rbt_ms" name="Red-Black Tree (ms)" fill="#0284c7" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
