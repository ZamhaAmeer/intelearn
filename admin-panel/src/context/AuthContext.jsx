import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Configure dynamic API URL to support connections from both localhost and local Wi-Fi mobile devices
axios.defaults.baseURL = `http://${window.location.hostname}:3000`;

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || null);
  const [adminProfile, setAdminProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configure Axios defaults to automatically attach Authorization header
  useEffect(() => {
    if (adminToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${adminToken}`;
      // Fetch admin details to sync profile details
      fetchProfile();
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setAdminProfile(null);
      setLoading(false);
    }
  }, [adminToken]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/auth/me');
      setAdminProfile(res.data);
    } catch (err) {
      console.error('Failed to load admin profile:', err.response?.data?.error);
      logout(); // Force logout if token is expired/invalid
    } finally {
      setLoading(false);
    }
  };

  const login = async (emailOrUsername, password) => {
    try {
      const res = await axios.post('/api/admin/auth/login', { emailOrUsername, password });
      const { token, admin } = res.data;
      
      localStorage.setItem('adminToken', token);
      setAdminToken(token);
      setAdminProfile(admin);
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.error || 'Connection to API server failed.' 
      };
    }
  };

  const logout = async () => {
    try {
      if (adminToken) {
        await axios.post('/api/admin/auth/logout');
      }
    } catch (err) {
      console.error('Logout error:', err.message);
    } finally {
      localStorage.removeItem('adminToken');
      setAdminToken(null);
      setAdminProfile(null);
    }
  };

  const signup = async (username, email, password, confirmPassword, fullName) => {
    try {
      const res = await axios.post('/api/admin/auth/signup', {
        username,
        email,
        password,
        confirmPassword,
        full_name: fullName
      });
      return { success: true, message: res.data.message };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.error || 'Registration failed.' 
      };
    }
  };

  const verifyEmail = async (token) => {
    try {
      const res = await axios.post('/api/admin/auth/verify-email', { token });
      return { success: true, message: res.data.message };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.error || 'Verification failed.' 
      };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const res = await axios.post('/api/admin/auth/forgot-password', { email });
      return { success: true, message: res.data.message };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.error || 'Request failed.' 
      };
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      const res = await axios.post('/api/admin/auth/reset-password', { token, newPassword });
      return { success: true, message: res.data.message };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.error || 'Password reset failed.' 
      };
    }
  };

  const changePassword = async (oldPassword, newPassword) => {
    try {
      const res = await axios.put('/api/admin/auth/change-password', { oldPassword, newPassword });
      return { success: true, message: res.data.message };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to change password.' 
      };
    }
  };

  const value = {
    adminToken,
    adminProfile,
    isAuthenticated: !!adminToken,
    loading,
    login,
    logout,
    signup,
    verifyEmail,
    forgotPassword,
    resetPassword,
    changePassword,
    refreshProfile: fetchProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
