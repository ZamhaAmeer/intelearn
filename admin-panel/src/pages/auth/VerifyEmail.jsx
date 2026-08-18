import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, XCircle, Loader2, School } from 'lucide-react';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { verifyEmail } = useAuth();
  
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const executeVerification = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Verification token is missing in URL.');
        return;
      }

      const res = await verifyEmail(token);
      if (res.success) {
        setStatus('success');
        setMessage(res.message || 'Your administrator email has been verified successfully!');
      } else {
        setStatus('error');
        setMessage(res.error || 'The verification link is invalid or has expired.');
      }
    };

    executeVerification();
  }, [token]);

  return (
    <div style={styles.authBg}>
      <div style={styles.authCard}>
        <div style={styles.header}>
          <School size={40} color="var(--primary)" />
          <h1 style={styles.brand}>INTELEARN</h1>
          <p style={styles.subtitle}>Administrative Verification Center</p>
        </div>

        {status === 'verifying' && (
          <div style={styles.statusBox}>
            <Loader2 style={styles.spinIcon} size={48} />
            <h3 style={styles.title}>Verifying Credentials</h3>
            <p style={styles.text}>Please wait while we activate your administrative profile...</p>
          </div>
        )}

        {status === 'success' && (
          <div style={styles.statusBox}>
            <CheckCircle2 size={48} color="var(--success)" />
            <h3 style={{ ...styles.title, color: 'var(--success)' }}>Account Activated</h3>
            <p style={styles.text}>{message}</p>
            <Link to="/admin/login" className="btn btn-primary" style={styles.button}>
              Proceed to Sign In
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div style={styles.statusBox}>
            <XCircle size={48} color="var(--error)" />
            <h3 style={{ ...styles.title, color: 'var(--error)' }}>Verification Failed</h3>
            <p style={styles.text}>{message}</p>
            <Link to="/admin/signup" className="btn btn-secondary" style={styles.button}>
              Register New Profile
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  authBg: {
    height: '100vh',
    width: '100%',
    backgroundColor: '#2b0a90',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  },
  authCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '440px',
    padding: '40px 30px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.25)',
    textAlign: 'center'
  },
  header: {
    marginBottom: '30px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px'
  },
  brand: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#2b0a90',
    letterSpacing: '1px'
  },
  subtitle: {
    fontSize: '12px',
    color: 'var(--text-muted)'
  },
  statusBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px'
  },
  spinIcon: {
    color: 'var(--primary)',
    animation: 'spin 1.5s linear infinite'
  },
  title: {
    fontSize: '18px',
    fontWeight: '700'
  },
  text: {
    fontSize: '14px',
    color: 'var(--text-muted)',
    lineHeight: '1.5',
    marginBottom: '16px'
  },
  button: {
    textDecoration: 'none',
    width: '100%'
  }
};
