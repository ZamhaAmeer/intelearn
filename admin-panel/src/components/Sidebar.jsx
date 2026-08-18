import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Users, 
  Building2, 
  HeartHandshake, 
  FolderOpen, 
  Megaphone, 
  Settings, 
  LogOut,
  School
} from 'lucide-react';

export default function Sidebar({ isOpen, setIsOpen }) {
  const { adminProfile, logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Students', path: '/admin/students', icon: GraduationCap },
    { name: 'Lecturers', path: '/admin/lecturers', icon: Users },
    { name: 'Faculties', path: '/admin/faculties', icon: Building2 },
    { name: 'Emotional Analytics', path: '/admin/emotions', icon: HeartHandshake },
    { name: 'Learning Resources', path: '/admin/resources', icon: FolderOpen },
    { name: 'Announcements', path: '/admin/announcements', icon: Megaphone },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Brand Header Logo */}
        <div className="sidebar-header">
          <School size={28} className="sidebar-logo" />
          <div className="brand-text">
            <h1>INTELEARN</h1>
            <span>Admin Center</span>
          </div>
        </div>

        {/* Profile Card Widget */}
        {adminProfile && (
          <div className="admin-profile-widget">
            <div className="admin-avatar">
              {adminProfile.full_name ? adminProfile.full_name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="admin-info">
              <div className="admin-name" title={adminProfile.full_name}>{adminProfile.full_name}</div>
              <div className="admin-role">{adminProfile.role || 'Administrator'}</div>
            </div>
          </div>
        )}

        {/* Navigation List */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div className="menu-label">Main Navigation</div>
          <ul className="sidebar-menu">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path} className="menu-item" onClick={() => setIsOpen(false)}>
                  <NavLink 
                    to={item.path} 
                    className={({ isActive }) => isActive ? 'active' : ''}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout button */}
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={logout}>
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile drawer backdrop */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 90,
            backdropFilter: 'blur(2px)'
          }}
        />
      )}
    </>
  );
}
