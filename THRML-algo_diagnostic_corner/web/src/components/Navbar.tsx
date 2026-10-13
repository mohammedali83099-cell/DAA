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
      background: 'rgba(255, 255, 255, 0.82)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.9)',
      boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.04)',
      padding: '12px 24px',
    }}>
      <div style={{
        maxWidth: 1400,
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
            width: 40,
            height: 40,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 6px 16px rgba(79, 70, 229, 0.25)'
          }}>
            <Activity size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#0f172a' }}>
                THRML
              </h1>
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: '#4f46e5',
                background: 'rgba(79, 70, 229, 0.08)',
                padding: '2px 6px',
                borderRadius: 4,
                border: '1px solid rgba(79, 70, 229, 0.15)'
              }}>
                LABORATORY
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>
              DAA Algorithm Vulnerability & Stress-Testing Suite
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(241, 245, 249, 0.7)',
          padding: 4,
          borderRadius: 14,
          border: '1px solid rgba(226, 232, 240, 0.8)'
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
                  padding: '7px 14px',
                  borderRadius: 10,
                  fontSize: '0.84rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#4f46e5' : '#475569',
                  background: isActive ? '#ffffff' : 'transparent',
                  border: isActive ? '1px solid rgba(255, 255, 255, 0.9)' : '1px solid transparent',
                  boxShadow: isActive ? '0 2px 8px rgba(15, 23, 42, 0.05)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease'
                }}
              >
                <Icon size={16} color={isActive ? '#4f46e5' : '#64748b'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action / Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(255, 255, 255, 0.8)',
            padding: '5px 12px',
            borderRadius: 9999,
            border: '1px solid rgba(226, 232, 240, 0.8)',
            fontSize: '0.78rem',
            color: '#059669',
            fontWeight: 600
          }}>
            <span style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.2)'
            }} />
            <span>{status?.status || 'READY'}</span>
          </div>

          <button
            onClick={onRunFullSuite}
            disabled={isRunningFullSuite}
            className="btn-primary"
            style={{ fontSize: '0.82rem', padding: '7px 14px' }}
          >
            <Play size={14} />
            <span>{isRunningFullSuite ? 'Running Audit...' : 'Run Full Suite'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
