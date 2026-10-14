import React from 'react';
import { RiskLevel } from '../types';

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

  const dotColors = {
    LOW: '#10b981',
    MODERATE: '#f59e0b',
    HIGH: '#ef4444'
  };

  const badgeClass = {
    LOW: 'badge-risk-low',
    MODERATE: 'badge-risk-moderate',
    HIGH: 'badge-risk-high'
  }[level];

  const labelText = {
    LOW: 'Low Risk',
    MODERATE: 'Moderate Risk',
    HIGH: 'High Risk'
  }[level];

  return (
    <span className={`badge-risk ${badgeClass} ${sizeClasses[size]}`}>
      <span 
        className="badge-dot" 
        style={{ backgroundColor: dotColors[level] }} 
      />
      <span>{labelText}</span>
    </span>
  );
};
