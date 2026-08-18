import React from 'react';

export default function DashboardCard({ title, value, icon: Icon, color = 'var(--primary)', trend, onClick }) {
  const Container = onClick ? 'div' : 'div';
  
  const cardStyle = {
    borderLeftColor: color,
    cursor: onClick ? 'pointer' : 'default'
  };

  return (
    <div 
      className="dashboard-card" 
      style={cardStyle}
      onClick={onClick}
    >
      <div>
        <div className="card-value">{value}</div>
        <div className="card-title">{title}</div>
        {trend && (
          <div style={{ marginTop: '12px', fontSize: '11px', color: '#10b981', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>📈</span> {trend}
          </div>
        )}
      </div>
      <div 
        className="card-icon-container" 
        style={{ backgroundColor: `${color}15`, color: color }}
      >
        {Icon && <Icon size={24} />}
      </div>
    </div>
  );
}
