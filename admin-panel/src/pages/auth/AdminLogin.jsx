import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { School, User, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailOrUsername.trim() || !password.trim()) {
      setError('Please fill in all credentials.');
      return;
    }

    setLoading(true);
    setError('');

    const res = await login(emailOrUsername.trim(), password);
    if (res.success) {
      navigate('/admin/dashboard');
    } else {
      setError(res.error || 'Access denied.');
      setLoading(false);
    }
  };

  return (
    <div style={styles.authBg}>
      <div style={styles.authCard}>
        {/* Brand Header Logo */}
        <div style={styles.header}>
          <div style={styles.logoWrapper}>
            <School size={36} color="var(--primary)" />
          </div>
          <h1 style={styles.brand}>INTELEARN</h1>
          <p style={styles.subtitle}>Administrative Sign In</p>
        </div>

        {/* Error panel */}
        {error && (
          <div className="alert-banner alert-banner-error" style={{ marginBottom: '20px' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Form fields */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div className="form-group">
            <label className="form-label">Username or Email</label>
            <div className="input-wrapper">
              <User className="input-icon" size={18} />
              <input
                type="text"
                className="input-field"
                placeholder="Enter email or username"
                value={emailOrUsername}
                onChange={(e) => {
                  setEmailOrUsername(e.target.value);
                  setError('');
                }}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Password</label>
              <Link to="/admin/forgot-password" style={styles.forgotLink}>
                Forgot password?
              </Link>
            </div>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                className="input-field"
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                disabled={loading}
              />
              <button 
                type="button" 
                className="eye-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Authorizing Profile...' : 'Sign In'}
          </button>
        </form>

        <div style={styles.footer}>
          <p>Need access? <Link to="/admin/signup" style={styles.footerLink}>Request an account</Link></p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  authBg: {
    height: '100vh',
    width: '100%',
    backgroundColor: '#2b0a90', // Custom Intelearn Purple
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
    marginBottom: '28px',
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
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  submitBtn: {
    marginTop: '20px',
    padding: '12px',
    fontSize: '15px'
  },
  forgotLink: {
    fontSize: '12px',
    color: 'var(--primary)',
    fontWeight: '600',
    textDecoration: 'none'
  },
  footer: {
    marginTop: '24px',
    textAlign: 'center',
    fontSize: '13px',
    color: 'var(--text-muted)'
  },
  footerLink: {
    color: 'var(--primary)',
    fontWeight: '600',
    textDecoration: 'none'
  }
};
