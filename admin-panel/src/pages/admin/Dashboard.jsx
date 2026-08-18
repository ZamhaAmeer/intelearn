import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardCard from '../../components/DashboardCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { 
  GraduationCap, 
  Users, 
  Building2, 
  HeartHandshake, 
  FolderOpen, 
  Megaphone, 
  Activity, 
  UserPlus, 
  PlusCircle,
  FileUp,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get('/api/admin/dashboard/statistics');
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to load dashboard metrics. Verify database is active.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading && !stats) {
    return <LoadingSpinner size="40px" />;
  }

  // Quick Action Buttons configs
  const QUICK_ACTIONS = [
    { name: 'Register Student', path: '/admin/students', icon: UserPlus, color: 'var(--primary)' },
    { name: 'Register Lecturer', path: '/admin/lecturers', icon: Users, color: '#1e88e5' },
    { name: 'Publish Notice', path: '/admin/announcements', icon: PlusCircle, color: '#4caf50' },
    { name: 'Upload Materials', path: '/admin/resources', icon: FileUp, color: '#9c27b0' }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h3 style={{ fontSize: '15px', color: 'var(--text-muted)', fontWeight: '500' }}>Platform Health Indicators</h3>
        </div>
        <button 
          className="btn btn-secondary" 
          onClick={loadDashboardData} 
          style={{ display: 'flex', gap: '6px', padding: '8px 12px' }}
        >
          <RefreshCw size={14} />
          <span>Reload</span>
        </button>
      </div>

      {error && (
        <div className="alert-banner alert-banner-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {stats && (
        <>
          {/* Statistical Metrics Cards */}
          <div className="metrics-grid">
            <DashboardCard 
              title="Total Students" 
              value={stats.counts.totalStudents} 
              icon={GraduationCap} 
              color="var(--primary)"
              onClick={() => navigate('/admin/students')}
            />
            <DashboardCard 
              title="Total Lecturers" 
              value={stats.counts.totalLecturers} 
              icon={Users} 
              color="#1e88e5"
              onClick={() => navigate('/admin/lecturers')}
            />
            <DashboardCard 
              title="Total Faculties" 
              value={stats.counts.totalFaculties} 
              icon={Building2} 
              color="#ff9800"
              onClick={() => navigate('/admin/faculties')}
            />
            <DashboardCard 
              title="Learning Resources" 
              value={stats.counts.totalLearningResources} 
              icon={FolderOpen} 
              color="#009688"
              onClick={() => navigate('/admin/resources')}
            />
            <DashboardCard 
              title="Emotional Reports" 
              value={stats.counts.totalEmotionalReports} 
              icon={HeartHandshake} 
              color="#ef4444"
              onClick={() => navigate('/admin/emotions')}
            />
            <DashboardCard 
              title="Announcements" 
              value={stats.counts.totalAnnouncements} 
              icon={Megaphone} 
              color="#9c27b0"
              onClick={() => navigate('/admin/announcements')}
            />
          </div>

          {/* Activity Feed & Quick Actions */}
          <div className="dashboard-split-grid">
            {/* Recent Activity Log */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                <Activity size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Recent Activity Log</h3>
              </div>

              {stats.recentActivities && stats.recentActivities.length > 0 ? (
                <div className="activity-feed">
                  {stats.recentActivities.map((act) => {
                    let actColor = 'var(--primary)';
                    if (act.type === 'emotion_detection') actColor = '#ef4444';
                    if (act.type === 'new_student') actColor = '#4caf50';

                    return (
                      <div key={act.id} className="activity-item">
                        <div className="activity-icon-wrapper" style={{ backgroundColor: `${actColor}15`, color: actColor }}>
                          <Activity size={14} />
                        </div>
                        <div>
                          <div className="activity-message">{act.message}</div>
                          <div className="activity-time">
                            {new Date(act.timestamp).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: '13px' }}>
                  No recent activities recorded.
                </div>
              )}
            </div>

            {/* Quick Actions Panel */}
            <div className="card">
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                Quick Administrative Actions
              </h3>
              <div className="quick-actions-grid">
                {QUICK_ACTIONS.map((action, idx) => {
                  const Icon = action.icon;
                  return (
                    <div 
                      key={idx} 
                      className="quick-action-card"
                      onClick={() => navigate(action.path)}
                    >
                      <div className="quick-action-icon" style={{ backgroundColor: `${action.color}15`, color: action.color }}>
                        <Icon size={20} />
                      </div>
                      <span className="quick-action-text">{action.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
