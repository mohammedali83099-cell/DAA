import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { AlgorithmLabView } from './components/AlgorithmLabView';
import { ComparativeArenaView } from './components/ComparativeArenaView';
import { ComplexityView } from './components/ComplexityView';
import { BacktrackingView } from './components/BacktrackingView';
import { ReportsView } from './components/ReportsView';
import { 
  SystemStatus, 
  AlgorithmCatalogItem, 
  MetricResult, 
  HistoryItem 
} from './types';
import { 
  fetchStatus, 
  fetchAlgorithms, 
  fetchHistory, 
  runAlgorithmTest 
} from './services/api';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [algorithms, setAlgorithms] = useState<AlgorithmCatalogItem[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedAlgoId, setSelectedAlgoId] = useState<string>('floyd_warshall');
  const [currentResult, setCurrentResult] = useState<MetricResult | null>(null);
  const [isRunningTest, setIsRunningTest] = useState<boolean>(false);
  const [isRunningFullSuite, setIsRunningFullSuite] = useState<boolean>(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [statusRes, algosRes, histRes] = await Promise.all([
        fetchStatus(),
        fetchAlgorithms(),
        fetchHistory()
      ]);
      setStatus(statusRes);
      setAlgorithms(algosRes);
      setHistory(histRes);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  };

  const handleRunTest = async (algoId: string, params: Record<string, any>): Promise<MetricResult | null> => {
    setIsRunningTest(true);
    try {
      const res = await runAlgorithmTest(algoId, params);
      setCurrentResult(res);

      // Append to local history view
      const newHistoryItem: HistoryItem = {
        id: history.length + 1,
        algorithm_name: res.algorithm_name,
        input_size: res.input_size_repr,
        runtime_ms: res.runtime_ms,
        memory_kb: res.memory_kb,
        risk_level: res.risk.risk_level,
        reason: res.risk.reason,
        timed_out: res.timed_out,
        total_operations: res.operations.total_ops
      };
      setHistory(prev => [...prev, newHistoryItem]);
      return res;
    } catch (err) {
      console.error('Test run failed:', err);
      return null;
    } finally {
      setIsRunningTest(false);
    }
  };

  const handleQuickRun = (algoId: string, params: any) => {
    setSelectedAlgoId(algoId);
    setActiveTab('lab');
    handleRunTest(algoId, params);
  };

  const handleRunFullSuite = async () => {
    setIsRunningFullSuite(true);
    const suite = [
      { id: 'floyd_warshall', params: { vertices: 100 } },
      { id: 'prim', params: { vertices: 150, density: 0.3 } },
      { id: 'kruskal', params: { vertices: 150, density: 0.3 } },
      { id: 'fractional_knapsack', params: { n_items: 200, capacity: 500 } },
      { id: 'knapsack_01', params: { n_items: 200, capacity: 500 } },
      { id: 'matrix_chain', params: { chain_length: 25 } },
      { id: 'nqueen', params: { n: 11 } },
      { id: 'tsp', params: { cities: 10 } },
      { id: 'btree', params: { n: 2000, workload: 'sorted' } },
      { id: 'red_black_tree', params: { n: 2000, workload: 'sorted' } },
      { id: 'binomial_heap', params: { n: 2000, workload: 'random' } },
      { id: 'fibonacci_heap', params: { n: 2000, workload: 'random' } },
      { id: 'hamiltonian', params: { vertices: 12, has_cycle: true } },
    ];

    for (const test of suite) {
      try {
        await handleRunTest(test.id, test.params);
      } catch (e) {
        console.error(e);
      }
    }
    setIsRunningFullSuite(false);
    setActiveTab('reports');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        status={status}
        onRunFullSuite={handleRunFullSuite}
        isRunningFullSuite={isRunningFullSuite}
      />

      <main style={{
        maxWidth: 1400,
        width: '100%',
        margin: '0 auto',
        padding: '28px 24px 60px',
        flex: 1
      }}>
        {activeTab === 'dashboard' && (
          <DashboardView 
            status={status}
            history={history}
            onSelectTab={setActiveTab}
            onQuickRun={handleQuickRun}
          />
        )}

        {activeTab === 'lab' && (
          <AlgorithmLabView 
            algorithms={algorithms}
            selectedAlgoId={selectedAlgoId}
            onSelectAlgorithm={setSelectedAlgoId}
            onRunTest={handleRunTest}
            currentResult={currentResult}
            isRunning={isRunningTest}
          />
        )}

        {activeTab === 'compare' && (
          <ComparativeArenaView />
        )}

        {activeTab === 'complexity' && (
          <ComplexityView />
        )}

        {activeTab === 'backtracking' && (
          <BacktrackingView />
        )}

        {activeTab === 'reports' && (
          <ReportsView 
            history={history}
            onRefreshHistory={() => fetchHistory().then(setHistory)}
          />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.9)',
        background: 'rgba(255, 255, 255, 0.65)',
        backdropFilter: 'blur(16px)',
        padding: '16px 24px',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: '#64748b'
      }}>
        <span>THRML — DAA Algorithm Vulnerability & Stress-Testing Laboratory • 13 Syllabus Algorithms Fully Instrumented</span>
      </footer>
    </div>
  );
}

export default App;
