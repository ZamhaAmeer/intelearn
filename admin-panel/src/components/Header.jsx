import React from 'react';
import { Menu, Bell, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header({ title = 'Dashboard', sidebarOpen, setSidebarOpen }) {
  const { adminProfile } = useAuth();

  return (
    <header className="top-header">
      <div className="header-left">
        <button 
          className="menu-toggle" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{ padding: '6px' }}
          title="Toggle Navigation"
        >
          <Menu size={24} />
        </button>
        <div className="header-title">
          <h2>{title}</h2>
        </div>
      </div>

      <div className="header-right">
        {/* Notifications trigger */}
        <button className="notifications-trigger" title="System Alerts">
          <Bell size={20} />
          <span className="notification-badge" />
        </button>

        {/* Admin profile label */}
        {adminProfile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderLeft: '1px solid var(--border)', paddingLeft: '16px' }}>
            <Shield size={16} color="var(--primary)" />
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>
              {adminProfile.username}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
