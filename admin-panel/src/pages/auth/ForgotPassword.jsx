import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { School, Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your registered email address.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const res = await forgotPassword(email.trim());
    if (res.success) {
      setSuccess(res.message || 'Reset link dispatched. Please check your email or console log.');
      setEmail('');
    } else {
      setError(res.error || 'Request failed.');
    }
    setLoading(false);
  };

  return (
    <div style={styles.authBg}>
      <div style={styles.authCard}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logoWrapper}>
            <School size={36} color="var(--primary)" />
          </div>
          <h1 style={styles.brand}>INTELEARN</h1>
          <p style={styles.subtitle}>Forgot Password Assistance</p>
        </div>

        {error && (
          <div className="alert-banner alert-banner-error" style={{ marginBottom: '20px' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert-banner alert-banner-success" style={{ marginBottom: '20px' }}>
            <CheckCircle size={18} style={{ flexShrink: 0 }} />
            <span>{success}</span>
          </div>
        )}

        <p style={styles.description}>
          Enter your registered administrator email address below. We will send you a secure link to reset your password.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input
                type="email"
                className="input-field"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                disabled={loading}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Requesting Reset Link...' : 'Send Reset Link'}
          </button>
        </form>

        <div style={styles.footer}>
          <Link to="/admin/login" style={styles.backLink}>
            <ArrowLeft size={16} />
            <span>Return to login</span>
          </Link>
        </div>
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
    maxWidth: '420px',
    padding: '40px 30px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.25)',
  },
  header: {
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px'
  },
  logoWrapper: {
    width: 60,
    height: 60,
    borderRadius: '50%',
    backgroundColor: 'rgba(91, 60, 194, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '8px'
  },
  brand: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#2b0a90',
    letterSpacing: '1px',
    lineHeight: '1'
  },
  subtitle: {
    fontSize: '13px',
    color: 'var(--text-muted)'
  },
  description: {
    fontSize: '13px',
    color: 'var(--text-muted)',
    lineHeight: '1.5',
    textAlign: 'center',
    marginBottom: '20px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  submitBtn: {
    marginTop: '16px',
    padding: '12px',
    fontSize: '15px'
  },
  footer: {
    marginTop: '24px',
    display: 'flex',
    justifyContent: 'center'
  },
  backLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: 'var(--primary)',
    fontWeight: '600',
    fontSize: '13px',
    textDecoration: 'none'
  }
};
