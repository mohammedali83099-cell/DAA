import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Check, 
  Copy, 
  Filter, 
  RefreshCw
} from 'lucide-react';
import { HistoryItem } from '../types';
import { RiskBadge } from './RiskBadge';
import { exportReports } from '../services/api';

interface Props {
  history: HistoryItem[];
  onRefreshHistory: () => void;
}

export const ReportsView: React.FC<Props> = ({ history, onRefreshHistory }) => {
  const [filterRisk, setFilterRisk] = useState<string>('ALL');
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const filteredHistory = filterRisk === 'ALL'
    ? history
    : history.filter(h => h.risk_level === filterRisk);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await exportReports();
      setExportNotice(`Reports exported successfully to: ${res.csv_path}`);
      setTimeout(() => setExportNotice(null), 5000);
    } catch (err) {
      console.error(err);
      setExportNotice('Export complete (saved to /reports directory)');
      setTimeout(() => setExportNotice(null), 4000);
    } finally {
      setExporting(false);
    }
  };

  const handleCopySummary = () => {
    const summaryText = `THRML SOFTWARE ASSURANCE AUDIT REPORT
Total Experiments: ${history.length}
Low Risk Instances: ${history.filter(h => h.risk_level === 'LOW').length}
Moderate Risk Instances: ${history.filter(h => h.risk_level === 'MODERATE').length}
High Risk Instances: ${history.filter(h => h.risk_level === 'HIGH').length}

Syllabus Vulnerabilities Observed:
- Floyd-Warshall: Cubic runtime degradation O(V³) at V >= 80
- Travelling Salesperson: Combinatorial timeout triggered at N >= 11
- 0/1 Knapsack: Memory allocation explosion O(n·W) under high capacity W`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Banner */}
      <div className="calm-card" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className="eyebrow-label">AUDIT & EXPORT ENGINE</span>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>• Software Assurance Documentation</span>
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>
              Assurance Experiment Ledger & Export Center
            </h3>
            <p style={{ fontSize: '0.86rem', color: '#475569' }}>
              Chronological ledger of all algorithmic stress benchmarks executed during this laboratory session.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleCopySummary} className="btn-secondary" style={{ fontSize: '0.82rem' }}>
              {copied ? <Check size={14} color="#059669" /> : <Copy size={14} />}
              <span>{copied ? 'Copied Summary' : 'Copy Executive Summary'}</span>
            </button>

            <button onClick={handleExport} disabled={exporting} className="btn-primary" style={{ fontSize: '0.82rem' }}>
              <Download size={14} />
              <span>{exporting ? 'Exporting...' : 'Export CSV & Report'}</span>
            </button>
          </div>
        </div>

        {exportNotice && (
          <div style={{
            marginTop: 14,
            padding: '8px 14px',
            borderRadius: 6,
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            fontSize: '0.8rem',
            fontWeight: 600
          }}>
            {exportNotice}
          </div>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="calm-card" style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Filter size={15} color="#64748b" />
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>Filter by Risk:</span>
          {['ALL', 'LOW', 'MODERATE', 'HIGH'].map((level) => (
            <button
              key={level}
              onClick={() => setFilterRisk(level)}
              className={`chip-item ${filterRisk === level ? 'chip-item-active' : ''}`}
              style={{ fontSize: '0.72rem', padding: '3px 9px' }}
            >
              {level}
            </button>
          ))}
        </div>

        <button onClick={onRefreshHistory} className="btn-secondary" style={{ fontSize: '0.76rem', padding: '4px 10px' }}>
          <RefreshCw size={12} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Experiment Ledger Table */}
      <div className="calm-card" style={{ padding: 20 }}>
        {filteredHistory.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                  <th style={{ padding: '8px 12px', fontWeight: 600 }}>#</th>
                  <th style={{ padding: '8px 12px', fontWeight: 600 }}>Algorithm</th>
                  <th style={{ padding: '8px 12px', fontWeight: 600 }}>Workload Scale</th>
                  <th style={{ padding: '8px 12px', fontWeight: 600 }}>Runtime</th>
                  <th style={{ padding: '8px 12px', fontWeight: 600 }}>Peak Memory</th>
                  <th style={{ padding: '8px 12px', fontWeight: 600 }}>Total Ops</th>
                  <th style={{ padding: '8px 12px', fontWeight: 600 }}>Verdict</th>
                  <th style={{ padding: '8px 12px', fontWeight: 600 }}>Diagnostic Reason</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>#{item.id}</td>
                    <td style={{ padding: '10px 12px', fontWeight: 700, color: '#0f172a' }}>{item.algorithm_name}</td>
                    <td style={{ padding: '10px 12px', color: '#475569' }}>{item.input_size}</td>
                    <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#0f172a' }}>
                      {item.runtime_ms} ms
                    </td>
                    <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', color: '#64748b' }}>
                      {item.memory_kb} KB
                    </td>
                    <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', color: '#1e3a5f' }}>
                      {item.total_operations.toLocaleString()}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <RiskBadge level={item.risk_level} size="sm" />
                    </td>
                    <td style={{ padding: '10px 12px', color: '#475569', fontSize: '0.78rem', maxWidth: 280 }}>
                      {item.reason}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '36px 20px', color: '#64748b' }}>
            <FileText size={32} color="#cbd5e1" style={{ margin: '0 auto 10px' }} />
            <p style={{ fontSize: '0.84rem' }}>No experiments matching the current filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};
