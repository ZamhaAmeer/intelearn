import React from 'react';

export default function LoadingSpinner({ size = '36px', color = 'var(--primary)' }) {
  const spinnerStyle = {
    width: size,
    height: size,
    border: '3px solid rgba(91, 60, 194, 0.1)',
    borderTop: `3px solid ${color}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '20px' }}>
      <div style={spinnerStyle} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
