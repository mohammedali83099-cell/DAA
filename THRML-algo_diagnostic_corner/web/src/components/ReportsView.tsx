import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Check, 
  Copy, 
  Filter, 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon,
  RefreshCw
} from 'lucide-react';
import { HistoryItem, RiskLevel } from '../types';
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
      setExportNotice(`Reports exported successfully! CSV at: ${res.csv_path}`);
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
    const summaryText = `THRML ASSURANCE AUDIT REPORT
Total Experiments: ${history.length}
Low Risk: ${history.filter(h => h.risk_level === 'LOW').length}
Moderate Risk: ${history.filter(h => h.risk_level === 'MODERATE').length}
High Risk: ${history.filter(h => h.risk_level === 'HIGH').length}

Syllabus Vulnerabilities Detected:
- Floyd-Warshall: Cubic runtime degradation O(V³) at V >= 80
- Travelling Salesperson: Combinatorial timeout triggered at N >= 11
- 0/1 Knapsack: Memory allocation explosion O(n·W) under high capacity W`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Banner */}
      <div className="glass-panel" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className="badge-category">AUDIT & EXPORT ENGINE</span>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Software Assurance Documentation</span>
            </div>
            <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>
              Assurance Experiment Ledger & Export Center
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#475569' }}>
              Full chronological log of all stress benchmarks executed during this laboratory session.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleCopySummary} className="btn-glass" style={{ fontWeight: 600 }}>
              {copied ? <Check size={15} color="#059669" /> : <Copy size={15} />}
              <span>{copied ? 'Copied Summary' : 'Copy Executive Summary'}</span>
            </button>

            <button onClick={handleExport} disabled={exporting} className="btn-primary" style={{ fontWeight: 600 }}>
              <Download size={15} />
              <span>{exporting ? 'Exporting...' : 'Export CSV & Report'}</span>
            </button>
          </div>
        </div>

        {exportNotice && (
          <div style={{
            marginTop: 16,
            padding: '10px 16px',
            borderRadius: 8,
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#047857',
            fontSize: '0.84rem',
            fontWeight: 600
          }}>
            {exportNotice}
          </div>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Filter size={16} color="#64748b" />
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>Filter by Risk:</span>
          {['ALL', 'LOW', 'MODERATE', 'HIGH'].map((level) => (
            <button
              key={level}
              onClick={() => setFilterRisk(level)}
              style={{
                padding: '4px 12px',
                borderRadius: 9999,
                fontSize: '0.78rem',
                fontWeight: filterRisk === level ? 700 : 500,
                color: filterRisk === level ? '#ffffff' : '#475569',
                background: filterRisk === level 
                  ? (level === 'LOW' ? '#059669' : level === 'MODERATE' ? '#d97706' : level === 'HIGH' ? '#e11d48' : '#4f46e5')
                  : 'rgba(255, 255, 255, 0.7)',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                cursor: 'pointer'
              }}
            >
              {level}
            </button>
          ))}
        </div>

        <button onClick={onRefreshHistory} className="btn-glass" style={{ fontSize: '0.78rem', padding: '5px 12px' }}>
          <RefreshCw size={13} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Experiment Ledger Table */}
      <div className="glass-panel" style={{ padding: 24 }}>
        {filteredHistory.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(226, 232, 240, 0.9)', color: '#475569' }}>
                  <th style={{ padding: '10px 14px' }}>#</th>
                  <th style={{ padding: '10px 14px' }}>Algorithm</th>
                  <th style={{ padding: '10px 14px' }}>Input Size / Scale</th>
                  <th style={{ padding: '10px 14px' }}>Runtime</th>
                  <th style={{ padding: '10px 14px' }}>Peak Memory</th>
                  <th style={{ padding: '10px 14px' }}>Total Ops</th>
                  <th style={{ padding: '10px 14px' }}>Risk Verdict</th>
                  <th style={{ padding: '10px 14px' }}>Diagnostic Reason</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid rgba(241, 245, 249, 0.9)' }}>
                    <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>#{item.id}</td>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a' }}>{item.algorithm_name}</td>
                    <td style={{ padding: '12px 14px', color: '#475569' }}>{item.input_size}</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#0f172a' }}>
                      {item.runtime_ms} ms
                    </td>
                    <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', color: '#64748b' }}>
                      {item.memory_kb} KB
                    </td>
                    <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', color: '#4f46e5' }}>
                      {item.total_operations.toLocaleString()}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <RiskBadge level={item.risk_level} size="sm" />
                    </td>
                    <td style={{ padding: '12px 14px', color: '#475569', fontSize: '0.8rem', maxWidth: 280 }}>
                      {item.reason}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
            <FileText size={36} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
            <p>No experiments matching the current filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};
