import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, Lock, CheckCircle, AlertCircle, Eye, EyeOff, User } from 'lucide-react';

export default function Settings() {
  const { adminProfile, changePassword } = useAuth();

  // Change Password states
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // System parameters configurations states
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(false);

  const checkPasswordStrength = (pass) => {
    if (!pass) return '';
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) score++;

    if (score < 3) return 'weak';
    if (score < 5) return 'medium';
    return 'strong';
  };

  const newPassStrength = checkPasswordStrength(newPassword);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPassError('Please specify all password entries.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassError('New passwords do not match.');
      return;
    }

    if (newPassStrength !== 'strong') {
      setPassError('New password must satisfy strength metrics (8+ chars, uppercase, lowercase, numbers, symbols).');
      return;
    }

    setLoading(true);
    setPassError('');
    setPassSuccess('');

    const res = await changePassword(oldPassword, newPassword);
    if (res.success) {
      setPassSuccess('Password updated successfully.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPassError(res.error || 'Change password failed.');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      {/* 1. Admin Profile sheet */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
          <User size={18} color="var(--primary)" />
          <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Admin Profile Information</h3>
        </div>

        {adminProfile ? (
          <div style={styles.profileDetails}>
            <div style={styles.profileField}>
              <span style={styles.fieldLabel}>Full Name:</span>
              <span style={styles.fieldValue}>{adminProfile.full_name}</span>
            </div>
            <div style={styles.profileField}>
              <span style={styles.fieldLabel}>Username:</span>
              <span style={styles.fieldValue}>{adminProfile.username}</span>
            </div>
            <div style={styles.profileField}>
              <span style={styles.fieldLabel}>Email Address:</span>
              <span style={styles.fieldValue}>{adminProfile.email}</span>
            </div>
            <div style={styles.profileField}>
              <span style={styles.fieldLabel}>Status:</span>
              <span style={styles.fieldValue}>
                <span className="badge badge-success">
                  {adminProfile.is_verified || adminProfile.is_verified === undefined ? 'Verified Administrator' : 'Unverified'}
                </span>
              </span>
            </div>
          </div>
        ) : (
          <p>No active profile loaded.</p>
        )}
      </div>

      {/* 2. Change password sheet */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
          <Lock size={18} color="var(--primary)" />
          <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Modify Portal Password</h3>
        </div>

        {passError && (
          <div className="alert-banner alert-banner-error" style={{ marginBottom: '16px' }}>
            <AlertCircle size={18} />
            <span>{passError}</span>
          </div>
        )}

        {passSuccess && (
          <div className="alert-banner alert-banner-success" style={{ marginBottom: '16px' }}>
            <CheckCircle size={18} />
            <span>{passSuccess}</span>
          </div>
        )}

        <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <div className="input-wrapper">
              <input
                type={showPass ? 'text' : 'password'}
                className="input-field"
                placeholder="Enter current password"
                value={oldPassword}
                onChange={(e) => { setOldPassword(e.target.value); setPassError(''); }}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">New Password</label>
              <div className="input-wrapper">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input-field"
                  placeholder="Create new password"
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setPassError(''); }}
                  disabled={loading}
                />
                <button 
                  type="button" 
                  className="eye-toggle"
                  onClick={() => setShowPass(!showPass)}
                  tabIndex="-1"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {newPassword && (
                <div style={{ marginTop: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)' }}>
                    <span>Strength</span>
                    <span style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{newPassStrength}</span>
                  </div>
                  <div className="password-strength-meter">
                    <div className={`password-strength-bar strength-${newPassStrength}`} />
                  </div>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <div className="input-wrapper">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input-field"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setPassError(''); }}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ alignSelf: 'flex-start', padding: '10px 24px' }}
            disabled={loading}
          >
            {loading ? 'Saving new password...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* 3. System Mock Settings */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
          <Shield size={18} color="var(--primary)" />
          <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Advisory Preferences</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px' }}>
            <input 
              type="checkbox" 
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
            />
            <span>Email notifications on critical Well-being Alerts</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px' }}>
            <input 
              type="checkbox" 
              checked={pushAlerts}
              onChange={(e) => setPushAlerts(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
            />
            <span>System audio alert warnings on repeated negative sentiment reports</span>
          </label>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  profileDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },
  profileField: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '14px'
  },
  fieldLabel: {
    fontWeight: '600',
    color: 'var(--text-muted)',
    width: '120px',
    flexShrink: 0
  },
  fieldValue: {
    color: 'var(--text-main)'
  }
};
