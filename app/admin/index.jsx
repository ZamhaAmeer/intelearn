import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from './services/api';

export default function AdminLoginScreen() {
  const router = useRouter();
  
  // Form input states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    // Front-end validations
    if (!username.trim() || !password.trim()) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const data = await authService.login(username.trim(), password);
      
      // Save auth payload locally
      await AsyncStorage.setItem('adminToken', data.token);
      await AsyncStorage.setItem('adminProfile', JSON.stringify(data.admin));

      console.log('Login successful for administrator', data.admin.username);
      
      // Redirect to Admin Dashboard page
      router.replace('/admin/dashboard');
    } catch (error) {
      console.error('Login error', error);
      const msg = error.response?.data?.error || 'Invalid credentials or connection refused.';
      setErrorMessage(msg);
      Alert.alert('Authentication Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.loginCard}>
          {/* Logo / Brand Header */}
          <View style={styles.brandContainer}>
            <View style={styles.iconWrapper}>
              <Ionicons name="school" size={40} color="#5B3CC2" />
            </View>
            <Text style={styles.brandName}>INTELEARN</Text>
            <Text style={styles.panelTitle}>Administrative Portal</Text>
            <Text style={styles.panelSubtitle}>Sign in to manage academic records and analytics</Text>
          </View>

          {/* Error Message Panel */}
          {errorMessage ? (
            <View style={styles.errorPanel}>
              <Ionicons name="alert-circle" size={18} color="#FF6B6B" />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* Form Fields */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Username</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color="#6F767E" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter admin username"
                placeholderTextColor="#A0A0A0"
                value={username}
                onChangeText={(val) => {
                  setUsername(val);
                  setErrorMessage('');
                }}
                autoCapitalize="none"
                editable={!loading}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#6F767E" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Enter password"
                placeholderTextColor="#A0A0A0"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(val) => {
                  setPassword(val);
                  setErrorMessage('');
                }}
                autoCapitalize="none"
                editable={!loading}
              />
              <TouchableOpacity 
                style={styles.eyeBtn} 
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons 
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'} 
                  size={20} 
                  color="#6F767E" 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity 
            style={[styles.loginBtn, loading && styles.loginBtnDisabled]} 
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.loginBtnText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/choosingpage')}>
            <Text style={styles.backBtnText}>Return to Portal Choice</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2b0a90', // Deep purple brand color
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loginCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    maxWidth: 420,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  iconWrapper: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(91, 60, 194, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  brandName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2b0a90',
    letterSpacing: 2,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1D20',
    marginTop: 6,
  },
  panelSubtitle: {
    fontSize: 12,
    color: '#6F767E',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 16,
  },
  errorPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F1',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    gap: 8,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1D20',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#EFEFEF',
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: '#FAFBFC',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1A1D20',
  },
  eyeBtn: {
    padding: 4,
  },
  loginBtn: {
    backgroundColor: '#5B3CC2',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginBtnDisabled: {
    backgroundColor: '#B5A8E5',
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backBtn: {
    alignItems: 'center',
    marginTop: 15,
  },
  backBtnText: {
    color: '#6F767E',
    fontSize: 13,
    textDecorationLine: 'underline',
  },
});
