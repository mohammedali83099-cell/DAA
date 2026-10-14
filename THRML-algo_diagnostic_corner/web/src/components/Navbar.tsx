import React from 'react';
import { 
  Activity, 
  Layers, 
  GitCompare, 
  TrendingUp, 
  Cpu, 
  FileText,
  Play
} from 'lucide-react';
import { SystemStatus } from '../types';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  status: SystemStatus | null;
  onRunFullSuite: () => void;
  isRunningFullSuite: boolean;
}

export const Navbar: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  status,
  onRunFullSuite,
  isRunningFullSuite
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: Activity },
    { id: 'lab', label: 'Diagnostic Lab', icon: Layers },
    { id: 'compare', label: 'Comparative Arena', icon: GitCompare },
    { id: 'complexity', label: 'Complexity & Curves', icon: TrendingUp },
    { id: 'backtracking', label: 'State-Space Trees', icon: Cpu },
    { id: 'reports', label: 'Assurance Reports', icon: FileText },
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      padding: '12px 24px',
    }}>
      <div style={{
        maxWidth: 1360,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: '#1e3a5f',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
          }}>
            <Activity size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#0f172a' }}>
                THRML
              </h1>
              <span style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                color: '#1e3a5f',
                background: '#f1f5f9',
                padding: '2px 6px',
                borderRadius: 4,
                border: '1px solid #e2e8f0'
              }}>
                ASSURANCE LAB
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500 }}>
              DAA Algorithm Vulnerability & Stress-Testing Suite
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          background: '#f8fafc',
          padding: 3,
          borderRadius: 8,
          border: '1px solid #e2e8f0'
        }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 6,
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#0f172a' : '#64748b',
                  background: isActive ? '#ffffff' : 'transparent',
                  border: isActive ? '1px solid #e2e8f0' : '1px solid transparent',
                  boxShadow: isActive ? '0 1px 3px rgba(15, 23, 42, 0.04)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={15} color={isActive ? '#1e3a5f' : '#94a3b8'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Status & Trigger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 10px',
            borderRadius: 9999,
            background: '#f0fdf4',
            border: '1px solid #dcfce7',
            fontSize: '0.74rem',
            color: '#15803d',
            fontWeight: 600
          }}>
            <span style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#22c55e'
            }} />
            <span>{status?.status || 'READY'}</span>
          </div>

          <button
            onClick={onRunFullSuite}
            disabled={isRunningFullSuite}
            className="btn-primary"
            style={{ fontSize: '0.8rem', padding: '6px 14px' }}
          >
            <Play size={13} />
            <span>{isRunningFullSuite ? 'Running Audit...' : 'Run Full Suite'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
