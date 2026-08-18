import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import { ArrowLeft, User, Mail, Phone, BookOpen, GraduationCap, Heart, AlertCircle, Calendar } from 'lucide-react';

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [emotions, setEmotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError('');
        const [profileRes, emotionsRes] = await Promise.all([
          axios.get(`/api/admin/students/${id}`),
          axios.get(`/api/admin/students/${id}/emotions`)
        ]);
        setStudent(profileRes.data);
        setEmotions(emotionsRes.data);
      } catch (err) {
        console.error('Failed to load student profile:', err);
        setError('Failed to retrieve student profile. Profile may not exist.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [id]);

  if (loading) {
    return <LoadingSpinner size="40px" />;
  }

  if (error || !student) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <AlertCircle size={48} color="var(--error)" style={{ margin: '0 auto 16px' }} />
        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Profile Error</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>{error || 'Student not found.'}</p>
        <button className="btn btn-secondary" onClick={() => navigate('/admin/students')}>
          Back to Students Directory
        </button>
      </div>
    );
  }

  // Custom colors matching the strict 4-emotion set
  const EMOTION_COLORS = {
    Happy: { bg: '#e8f5e9', text: '#2e7d32', emoji: '😊' },
    Neutral: { bg: '#eceff1', text: '#455a64', emoji: '😐' },
    Sad: { bg: '#e3f2fd', text: '#1565c0', emoji: '😢' },
    Frustrated: { bg: '#ffebee', text: '#c62828', emoji: '😤' }
  };

  return (
    <div>
      {/* Return button */}
      <button 
        className="btn btn-secondary" 
        onClick={() => navigate('/admin/students')}
        style={{ marginBottom: '24px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
      >
        <ArrowLeft size={16} />
        <span>Back to Directory</span>
      </button>

      {/* Main Grid: Info card and Emotional Logs */}
      <div style={styles.grid}>
        {/* Profile Card */}
        <div className="card" style={{ height: 'fit-content' }}>
          <div style={styles.avatarRow}>
            <div style={styles.largeAvatar}>
              {student.full_name ? student.full_name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div>
              <h2 style={styles.name}>{student.full_name}</h2>
              <p style={styles.studentId}>{student.student_id}</p>
              <span className="badge badge-success" style={{ marginTop: '8px' }}>
                {student.status}
              </span>
            </div>
          </div>

          <div style={styles.detailsList}>
            <div style={styles.detailItem}>
              <Mail size={16} color="var(--text-muted)" />
              <div>
                <div style={styles.detailLabel}>Email Address</div>
                <div style={styles.detailVal}>{student.email}</div>
              </div>
            </div>

            <div style={styles.detailItem}>
              <Phone size={16} color="var(--text-muted)" />
              <div>
                <div style={styles.detailLabel}>Phone Number</div>
                <div style={styles.detailVal}>{student.phone || 'None specified'}</div>
              </div>
            </div>

            <div style={styles.detailItem}>
              <Building2 size={16} color="var(--text-muted)" />
              <div>
                <div style={styles.detailLabel}>Faculty Name</div>
                <div style={styles.detailVal}>{student.faculty_name || 'Unassigned'}</div>
              </div>
            </div>

            <div style={styles.detailItem}>
              <BookOpen size={16} color="var(--text-muted)" />
              <div>
                <div style={styles.detailLabel}>Department / Major</div>
                <div style={styles.detailVal}>{student.department || 'N/A'}</div>
              </div>
            </div>

            <div style={styles.detailItem}>
              <GraduationCap size={16} color="var(--text-muted)" />
              <div>
                <div style={styles.detailLabel}>GPA & Semester</div>
                <div style={styles.detailVal}>
                  <strong>{parseFloat(student.gpa).toFixed(2)}</strong> / 4.00 (Semester {student.current_semester})
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Emotional Log Timeline */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
            <Heart size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Emotional Log History</h3>
          </div>

          {emotions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              No emotional history logs reported by this student yet.
            </div>
          ) : (
            <div style={styles.timeline}>
              {emotions.map((log) => {
                const emotionConf = EMOTION_COLORS[log.detected_emotion] || { bg: '#f5f5f5', text: '#616161', emoji: '❓' };
                return (
                  <div key={log.id} style={styles.timelineItem}>
                    <div style={styles.timelineMeta}>
                      <span style={{ fontSize: '20px' }}>{emotionConf.emoji}</span>
                      <div>
                        <div style={{ fontWeight: '700', color: emotionConf.text }}>
                          {log.detected_emotion} ({log.confidence_score}%)
                        </div>
                        <div style={styles.logTime}>
                          <Calendar size={12} style={{ marginRight: '4px' }} />
                          {new Date(log.reported_at).toLocaleString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                    {log.trigger_factors && (
                      <p style={styles.logText}>
                        <strong>Trigger: </strong>{log.trigger_factors}
                      </p>
                    )}
                    {log.notes && (
                      <p style={styles.logText}>
                        <strong>Remarks: </strong>{log.notes}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const Building2 = ({ size, color }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-building-2"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>
);

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '24px'
  },
  avatarRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '24px',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '20px'
  },
  largeAvatar: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary-light)',
    color: 'var(--primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: 'bold'
  },
  name: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--text-main)'
  },
  studentId: {
    fontSize: '13px',
    color: 'var(--text-muted)',
    marginTop: '2px'
  },
  detailsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  detailLabel: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    fontWeight: '600'
  },
  detailVal: {
    fontSize: '14px',
    color: 'var(--text-main)',
    marginTop: '2px'
  },
  timeline: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  timelineItem: {
    borderLeft: '2px solid var(--border)',
    paddingLeft: '16px',
    position: 'relative'
  },
  timelineMeta: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    marginBottom: '8px'
  },
  logTime: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '11px',
    color: 'var(--text-muted)',
    marginTop: '2px'
  },
  logText: {
    fontSize: '13px',
    color: 'var(--text-main)',
    marginTop: '4px',
    lineHeight: '1.4'
  }
};
