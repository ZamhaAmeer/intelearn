import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from '../../components/DataTable';
import LoadingSpinner from '../../components/LoadingSpinner';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { Heart, AlertTriangle, List, Calendar, School, Filter, Mail, Phone, RefreshCw } from 'lucide-react';

export default function EmotionalAnalytics() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'alerts', 'logs'
  const [reports, setReports] = useState([]);
  const [trends, setTrends] = useState(null);
  const [riskAlerts, setRiskAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering states
  const [filterEmotion, setFilterEmotion] = useState('');
  const [filterFaculty, setFilterFaculty] = useState('');
  const [faculties, setFaculties] = useState([]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const [repRes, trendRes, alertRes, facRes] = await Promise.all([
        axios.get(`/api/admin/emotions/reports?emotion=${filterEmotion}`),
        axios.get('/api/admin/emotions/trends'),
        axios.get('/api/admin/emotions/alerts'),
        axios.get('/api/admin/faculties')
      ]);
      setReports(repRes.data);
      setTrends(trendRes.data);
      setRiskAlerts(alertRes.data);
      setFaculties(facRes.data);
    } catch (err) {
      console.error('Failed to load emotional analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalyticsData();
  }, [filterEmotion]);

  if (loading && !trends) {
    return <LoadingSpinner size="40px" />;
  }

  // Emotion configuration matching strict 4-emotion constraint
  const EMOTIONS = {
    Happy: { color: '#10b981', label: 'Happy', desc: 'Positive indicator', emoji: '😊' },
    Neutral: { color: '#64748b', label: 'Neutral', desc: 'Neutral indicator', emoji: '😐' },
    Sad: { color: '#3b82f6', label: 'Sad', desc: 'Negative indicator', emoji: '😢' },
    Frustrated: { color: '#ef4444', label: 'Frustrated', desc: 'Negative indicator', emoji: '😤' }
  };

  // Recharts formatted data for bar chart
  const barChartData = trends?.distribution.map(dist => ({
    name: dist.emotion,
    count: parseInt(dist.count),
    confidence: parseFloat(dist.avg_confidence),
    color: EMOTIONS[dist.emotion]?.color || '#cbd5e1'
  })) || [];

  // Pie chart formatted data
  const pieChartData = [
    { name: 'Positive & Neutral', value: parseInt(trends?.summary.positive_count) || 0, color: 'var(--primary)' },
    { name: 'Well-being Alerts', value: parseInt(trends?.summary.negative_count) || 0, color: '#ef4444' }
  ].filter(item => item.value > 0);

  // DataTable headers
  const headers = [
    { title: 'Student ID', width: '120px' },
    { title: 'Student Name', width: '180px' },
    { title: 'Faculty', width: '100px' },
    { title: 'Detected Emotion', width: '160px' },
    { title: 'Confidence', width: '100px' },
    { title: 'Triggers', width: '220px' },
    { title: 'Staff Notes', width: '220px' },
    { title: 'Reported At', width: '180px' }
  ];

  const renderReportRow = (log) => {
    const emo = EMOTIONS[log.detected_emotion] || { color: '#64748b', emoji: '❓' };
    return (
      <>
        <td style={{ fontWeight: 'bold' }}>{log.student_id}</td>
        <td>{log.student_name}</td>
        <td>
          <span className="badge badge-neutral">{log.faculty_code || 'N/A'}</span>
        </td>
        <td style={{ color: emo.color, fontWeight: '700' }}>
          <span style={{ marginRight: '6px' }}>{emo.emoji}</span>
          {log.detected_emotion}
        </td>
        <td style={{ textAlign: 'center', fontWeight: '600' }}>{log.confidence_score}%</td>
        <td>{log.trigger_factors || 'None specified'}</td>
        <td style={{ color: 'var(--text-muted)' }}>{log.notes || 'No comments.'}</td>
        <td>{new Date(log.reported_at).toLocaleString()}</td>
      </>
    );
  };

  return (
    <div>
      {/* Tabs list */}
      <div style={styles.tabBar}>
        <button 
          className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('dashboard')}
          style={styles.tabBtn}
        >
          <Heart size={16} />
          <span>Stats Dashboard</span>
        </button>
        <button 
          className={`btn ${activeTab === 'alerts' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('alerts')}
          style={styles.tabBtn}
        >
          <AlertTriangle size={16} />
          <span>Well-being Alerts ({riskAlerts.length})</span>
          {riskAlerts.length > 0 && <span style={styles.alertBadgeCount} />}
        </button>
        <button 
          className={`btn ${activeTab === 'logs' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('logs')}
          style={styles.tabBtn}
        >
          <List size={16} />
          <span>All Submissions</span>
        </button>
        
        <button 
          className="btn btn-secondary" 
          onClick={loadAnalyticsData}
          style={{ marginLeft: 'auto', display: 'flex', gap: '6px', padding: '8px 12px' }}
        >
          <RefreshCw size={14} />
          <span>Sync</span>
        </button>
      </div>

      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--text-muted)', fontSize: '13px' }}>
          <LoadingSpinner size="18px" />
          <span>Refreshing analytics cache...</span>
        </div>
      )}

      {/* ================= TAB 1: STATS DASHBOARD ================= */}
      {activeTab === 'dashboard' && trends && (
        <div style={styles.tabPanel}>
          <div style={styles.metricsSplit}>
            {/* Summary cards */}
            <div className="card" style={{ borderLeft: '4px solid var(--primary)', flex: '1' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Positive & Neutral logs</div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--primary)', margin: '10px 0' }}>
                {trends.summary.total_count > 0 
                  ? `${Math.round((parseInt(trends.summary.positive_count) / parseInt(trends.summary.total_count)) * 100)}%`
                  : '0%'
                }
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {trends.summary.positive_count} total logs (Happy, Neutral)
              </p>
            </div>

            <div className="card" style={{ borderLeft: '4px solid #ef4444', flex: '1' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Well-being Alert logs</div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#ef4444', margin: '10px 0' }}>
                {trends.summary.total_count > 0 
                  ? `${Math.round((parseInt(trends.summary.negative_count) / parseInt(trends.summary.total_count)) * 100)}%`
                  : '0%'
                }
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {trends.summary.negative_count} total logs (Sad, Frustrated)
              </p>
            </div>
          </div>

          <div style={styles.chartsGrid}>
            {/* Bar chart - Emotion distribution */}
            <div className="card">
              <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '20px' }}>Logs Count by Emotion</h3>
              <div style={{ height: '300px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                    <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {barChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie chart - Well-being Ratio */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '20px' }}>Total Well-being Ratio</h3>
              <div style={{ height: '220px', width: '100%', position: 'relative' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '16px' }}>
                {pieChartData.map((entry, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: entry.color }} />
                    <span>{entry.name} ({entry.value})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: RISK ALERTS ================= */}
      {activeTab === 'alerts' && (
        <div style={styles.tabPanel}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-main)' }}>Active Well-being Attention Indicators</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
              The following list highlights students displaying repeated negative emotional logs (Sad, Frustrated) over multiple intervals. This dashboard acts as a flag for academic guidance or student support advisors.
            </p>
          </div>

          {riskAlerts.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
              <Heart size={48} color="var(--success)" style={{ margin: '0 auto 16px', opacity: '0.8' }} />
              <h4 style={{ fontSize: '16px', fontWeight: '700' }}>All Clear</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '6px' }}>
                No active well-being flags recorded at this time.
              </p>
            </div>
          ) : (
            <div style={styles.alertsGrid}>
              {riskAlerts.map((student) => (
                <div key={student.student_id} className="card" style={styles.alertCard}>
                  {/* Alert Header */}
                  <div style={styles.alertHeader}>
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#c62828' }}>{student.full_name}</h4>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {student.student_code} | {student.faculty_code || 'General'}
                      </div>
                    </div>
                    <span className="badge badge-error">
                      {student.negative_reports_count} Logs Triggered
                    </span>
                  </div>

                  {/* Alert Body */}
                  <div style={styles.alertBody}>
                    <div style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
                      Recent Trigger Logs
                    </div>
                    {student.recent_negative_logs.map((log, index) => {
                      const emoConf = EMOTIONS[log.detected_emotion] || { color: '#ef4444', emoji: '⚠️' };
                      return (
                        <div key={index} style={styles.alertLogItem}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: '700', color: emoConf.color, fontSize: '13px' }}>
                              {emoConf.emoji} {log.detected_emotion} ({log.confidence_score}%)
                            </span>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                              {new Date(log.reported_at).toLocaleDateString()}
                            </span>
                          </div>
                          {log.trigger_factors && <p style={styles.alertLogText}><strong>Trigger: </strong>{log.trigger_factors}</p>}
                          {log.notes && <p style={styles.alertLogText}><strong>Notes: </strong>{log.notes}</p>}
                        </div>
                      );
                    })}
                  </div>

                  {/* Alert Footer Contact actions */}
                  <div style={styles.alertFooter}>
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => alert(`Email: ${student.email}\nPhone: ${student.phone || 'N/A'}`)}
                      style={{ flex: '1', padding: '8px', fontSize: '12px' }}
                    >
                      Show Contact Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 3: ALL SUBMISSIONS ================= */}
      {activeTab === 'logs' && (
        <div style={styles.tabPanel}>
          {/* Quick Filters toolbar */}
          <div className="card" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', padding: '16px 20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600' }}>
              <Filter size={16} color="var(--primary)" />
              <span>Filter logs:</span>
            </div>

            {/* Filter by emotion */}
            <select 
              className="input-field" 
              value={filterEmotion} 
              onChange={(e) => setFilterEmotion(e.target.value)}
              style={{ width: '180px' }}
            >
              <option value="">All Emotions</option>
              {Object.keys(EMOTIONS).map(emoKey => (
                <option key={emoKey} value={emoKey}>{emoKey}</option>
              ))}
            </select>
          </div>

          <DataTable
            headers={headers}
            data={reports}
            renderRow={renderReportRow}
            isLoading={loading && reports.length === 0}
            searchPlaceholder="Filter logs view..."
          />
        </div>
      )}
    </div>
  );
}

const styles = {
  tabBar: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '16px',
    flexWrap: 'wrap'
  },
  tabBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    position: 'relative'
  },
  alertBadgeCount: {
    position: 'absolute',
    top: '-3px',
    right: '-3px',
    width: '8px',
    height: '8px',
    backgroundColor: '#ef4444',
    borderRadius: '50%',
    border: '1.5px solid white'
  },
  tabPanel: {
    animation: 'fade 0.2s ease-in'
  },
  metricsSplit: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
    marginBottom: '24px'
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
    gap: '24px'
  },
  alertsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px'
  },
  alertCard: {
    borderColor: '#ffebee',
    borderWidth: '1.5px',
    padding: '0',
    overflow: 'hidden'
  },
  alertHeader: {
    backgroundColor: '#fff8f8',
    padding: '16px 20px',
    borderBottom: '1px solid #ffebee',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  alertBody: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  alertLogItem: {
    backgroundColor: '#fafbfc',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '10px 12px'
  },
  alertLogText: {
    fontSize: '12px',
    marginTop: '4px',
    color: '#334155'
  },
  alertFooter: {
    borderTop: '1px solid var(--border)',
    padding: '16px 20px',
    display: 'flex',
    gap: '12px'
  }
};
