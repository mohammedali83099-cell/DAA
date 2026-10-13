import React from 'react';
import { RiskLevel } from '../types';
import { ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';

interface Props {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<Props> = ({ level, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3.5 py-1.5'
  };

  if (level === 'LOW') {
    return (
      <span className={`badge-risk badge-risk-low ${sizeClasses[size]}`}>
        <ShieldCheck size={14} />
        <span>LOW RISK</span>
      </span>
    );
  }

  if (level === 'MODERATE') {
    return (
      <span className={`badge-risk badge-risk-moderate ${sizeClasses[size]}`}>
        <AlertTriangle size={14} />
        <span>MODERATE RISK</span>
      </span>
    );
  }

  return (
    <span className={`badge-risk badge-risk-high ${sizeClasses[size]}`}>
      <AlertOctagon size={14} />
      <span>HIGH RISK</span>
    </span>
  );
};
