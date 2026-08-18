import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Switch, 
  Alert, 
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { authService } from './services/api';

export default function SettingsScreen() {
  const router = useRouter();
  
  // States
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Form password fields
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // System toggle states (simulated)
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [riskLogging, setRiskLogging] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedProfile = await AsyncStorage.getItem('adminProfile');
        if (storedProfile) {
          setProfile(JSON.parse(storedProfile));
        } else {
          // Fetch from API if not in cache
          const apiProfile = await authService.getProfile();
          setProfile(apiProfile);
        }
      } catch (err) {
        console.error('Failed loading setting profile', err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('Validation Error', 'All password fields are required.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Validation Error', 'New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters long.');
      return;
    }

    try {
      setUpdatingPassword(true);
      await authService.changePassword(oldPassword, newPassword);
      Alert.alert('Success', 'Password updated successfully.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Update password error', err);
      Alert.alert('Failed', err.response?.data?.error || 'Failed to change password.');
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to end your administrative session?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            await authService.logout();
            router.replace('/admin');
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5B3CC2" />
        <Text style={styles.loadingText}>Loading configurations...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <Text style={styles.subtitle}>Manage administrator profile, security credentials, and general platform parameters.</Text>

      {/* Profile Details Card */}
      {profile && (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Administrator Profile</Text>
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{profile.full_name?.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{profile.full_name}</Text>
              <Text style={styles.profileRole}>{profile.role?.toUpperCase() || 'ADMINISTRATOR'}</Text>
              <Text style={styles.profileEmail}>{profile.email}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Security Credentials Password update */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Update Credentials</Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Current Password</Text>
          <TextInput
            style={styles.input}
            value={oldPassword}
            onChangeText={setOldPassword}
            secureTextEntry={true}
            placeholder="••••••••"
            placeholderTextColor="#A0A0A0"
          />
        </View>

        <View style={styles.formRow}>
          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={styles.label}>New Password</Text>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={true}
              placeholder="Min. 6 characters"
              placeholderTextColor="#A0A0A0"
            />
          </View>
          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={true}
              placeholder="Min. 6 characters"
              placeholderTextColor="#A0A0A0"
            />
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.saveBtn, updatingPassword && styles.saveBtnDisabled]} 
          onPress={handleChangePassword}
          disabled={updatingPassword}
          activeOpacity={0.8}
        >
          {updatingPassword ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <>
              <Ionicons name="shield-checkmark" size={16} color="white" />
              <Text style={styles.saveBtnText}>Change Password</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Platform & System Settings */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>System Parameters</Text>
        
        <View style={styles.toggleRow}>
          <View style={styles.toggleText}>
            <Text style={styles.toggleTitle}>Maintenance Mode</Text>
            <Text style={styles.toggleDesc}>Puts student/lecturer applications offline for database maintenance.</Text>
          </View>
          <Switch
            value={maintenanceMode}
            onValueChange={setMaintenanceMode}
            trackColor={{ false: '#D1D1D6', true: '#B5A8E5' }}
            thumbColor={maintenanceMode ? '#5B3CC2' : '#F4F5F6'}
          />
        </View>

        <View style={styles.toggleRow}>
          <View style={styles.toggleText}>
            <Text style={styles.toggleTitle}>Email Notifications</Text>
            <Text style={styles.toggleDesc}>Dispatch automated warnings when emotional detection logs trigger high risk warnings.</Text>
          </View>
          <Switch
            value={emailNotifications}
            onValueChange={setEmailNotifications}
            trackColor={{ false: '#D1D1D6', true: '#B5A8E5' }}
            thumbColor={emailNotifications ? '#5B3CC2' : '#F4F5F6'}
          />
        </View>

        <View style={styles.toggleRow}>
          <View style={styles.toggleText}>
            <Text style={styles.toggleTitle}>Proactive Log Analytics</Text>
            <Text style={styles.toggleDesc}>Enables NLP filters to automatically flags critical words in student reports.</Text>
          </View>
          <Switch
            value={riskLogging}
            onValueChange={setRiskLogging}
            trackColor={{ false: '#D1D1D6', true: '#B5A8E5' }}
            thumbColor={riskLogging ? '#5B3CC2' : '#F4F5F6'}
          />
        </View>
      </View>

      {/* Logout Row */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
        <Ionicons name="log-out" size={20} color="#FF6B6B" />
        <Text style={styles.logoutBtnText}>End Administrative Session</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  contentContainer: {
    padding: 24,
    gap: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#6F767E',
    marginTop: -8,
    marginBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
  },
  loadingText: {
    marginTop: 12,
    color: '#6F767E',
    fontWeight: '500',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1D20',
    marginBottom: 16,
    borderBottomWidth: 1.5,
    borderBottomColor: '#F4F5F6',
    paddingBottom: 10,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E8E3FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#5B3CC2',
    fontWeight: 'bold',
    fontSize: 24,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1D20',
  },
  profileRole: {
    fontSize: 11,
    color: '#5B3CC2',
    fontWeight: 'bold',
    marginTop: 2,
  },
  profileEmail: {
    fontSize: 13,
    color: '#6F767E',
    marginTop: 4,
  },
  formGroup: {
    marginBottom: 16,
    gap: 6,
  },
  formRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1D20',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#EFEFEF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#FAFBFC',
  },
  saveBtn: {
    flexDirection: 'row',
    backgroundColor: '#5B3CC2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'flex-start',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  saveBtnDisabled: {
    backgroundColor: '#B5A8E5',
  },
  saveBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F4F5F6',
    paddingVertical: 14,
  },
  toggleText: {
    flex: 1,
    paddingRight: 16,
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1D20',
  },
  toggleDesc: {
    fontSize: 12,
    color: '#6F767E',
    marginTop: 4,
    lineHeight: 16,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF1F1',
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: '#FFEBEE',
    gap: 8,
    marginTop: 10,
  },
  logoutBtnText: {
    color: '#FF6B6B',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
