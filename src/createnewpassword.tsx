import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Simple validation checks for the UI checklist
  const isLengthValid = password.length >= 8;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const handleResetPassword = () => {
    // Add your actual password reset logic here
    setIsModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4229b8" />

      {/* KeyboardAvoidingView prevents the keyboard from hiding inputs */}
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >

      {/* Top Curved Header */}
      <View style={styles.headerBackground}>
        <Text style={styles.headerTitle}>Create New Password</Text>
      </View>

      {/* Added Back Button Here */}
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => router.push('/loginpage(student)')}
            >
              <Feather name="chevron-left" size={32} color="#FFFFFF" />
            </TouchableOpacity>
       {/* ScrollView enables the sliding/scrolling view */}
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled" // Allows tapping outside inputs to dismiss keyboard
        >

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Your new password must be unique and different from your previous
        credentials to ensure account safety.
      </Text>

      {/* Form Container */}
      <View style={styles.formContainer}>
        {/* New Password Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>New Password*</Text>
          <View style={styles.inputWrapper}>
            <Feather name="lock" size={20} color="#6b7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#9ca3af"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Feather
                name={showPassword ? "eye" : "eye-off"}
                size={20}
                color="#6b7280"
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Confirm New Password Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Confirm New Password*</Text>
          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons name="lock-reset" size={22} color="#6b7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholderTextColor="#9ca3af"
            />
          </View>
        </View>

       {/* Password Requirements Box */}
            <View style={styles.requirementsBox}>
              <Text style={styles.requirementsTitle}>PASSWORD REQUIREMENTS</Text>
              
              <View style={styles.requirementRow}>
                <Ionicons 
                  name={isLengthValid ? "checkmark-circle" : "ellipse-outline"} 
                  size={20} 
                  // Use a bright green when valid, gray when invalid
                  color={isLengthValid ? "#10b981" : "#d1d5db"} 
                />
                <Text style={[
                  styles.requirementText, 
                  isLengthValid && styles.requirementTextValid // Apply valid style if true
                ]}>
                  At least 8 characters long
                </Text>
              </View>

              <View style={styles.requirementRow}>
                <Ionicons 
                  name={hasSpecialChar ? "checkmark-circle" : "ellipse-outline"} 
                  size={20} 
                  color={hasSpecialChar ? "#10b981" : "#d1d5db"} 
                />
                <Text style={[
                  styles.requirementText, 
                  hasSpecialChar && styles.requirementTextValid
                ]}>
                  Include one special character
                </Text>
              </View>
            </View>

        {/* Reset Button */}
        <TouchableOpacity style={styles.resetButton} onPress={handleResetPassword}>
          <Text style={styles.resetButtonText}>Reset Password</Text>
        </TouchableOpacity>
      </View>

      {/* Footer Banner */}
      <View style={styles.footerBanner}>
        <Ionicons name="shield-checkmark" size={32} color="#4229b8" style={styles.footerIcon} />
        <Text style={styles.footerText}>
          Securing your intellectual journey with end-to-end encryption.
        </Text>
      </View>

      {/* Success Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Close Icon */}
            <TouchableOpacity 
              style={styles.closeModalBtn} 
              onPress={() => setIsModalVisible(false)}
            >
              <Feather name="x" size={24} color="#000" />
            </TouchableOpacity>

            {/* Success Icon */}
            <View style={styles.successIconContainer}>
              <View style={styles.successIconInner}>
                <MaterialCommunityIcons name="decagram" size={60} color="#4229b8" />
                <MaterialCommunityIcons name="check" size={28} color="#FFF" style={styles.checkMarkOverlay} />
              </View>
            </View>

            {/* Modal Text */}
            <Text style={styles.modalTitle}>Password Reset{'\n'}Successfully</Text>
            <Text style={styles.modalSubtitle}>
              Your account is now secure. You can log in with your new credentials.
            </Text>

            {/* Return to Login Button */}
            <TouchableOpacity 
              style={styles.returnButton}
              onPress={() => {
                setIsModalVisible(false);
                router.replace('/loginpage(student)');
              }}
            >
              <Text style={styles.returnButtonText}>Return to Login</Text>
              <Feather name="log-in" size={20} color="#FFF" style={styles.returnIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFCF7', // Light cream background
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  headerBackground: {
    backgroundColor: '#4229b8',
    height: 140,
    width: '100%',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    // Add a slight curve visual trick if needed by scaling
    transform: [{ scaleX: 1.1 }],
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    transform: [{ scaleX: 0.9 }], // Counteract the parent scale
  },
  // Added back button styles
  backButton: {
    position: 'absolute',
    left: 10, 
    top: 32, // Adjusted to vertically center it against the title
    zIndex: 10,
    padding: 5, // Increases touch target area
    transform: [{ scaleX: 0.9 }], // Counteracts the parent container's 1.1 stretch
  },
  subtitle: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 15,
    paddingHorizontal: 40,
    marginTop: 30,
    lineHeight: 22,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 30,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  eyeIcon: {
    marginLeft: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  requirementsBox: {
    backgroundColor: '#F5F5EC',
    padding: 16,
    borderRadius: 10,
    marginBottom: 24,
  },
  requirementsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
 // ... existing styles ...
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6b7280', // Default gray text
  },
  requirementTextValid: {
    color: '#10b981', // Turns green when the condition is met
    fontWeight: '500', 
  },
  resetButton: {
    backgroundColor: '#4229b8',
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerBanner: {
    marginHorizontal: 20,
    marginTop: 30,
    backgroundColor: '#b8b8b8', // Replaced with a solid gray acting as the frosted glass base
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8,
  },
  footerIcon: {
    marginBottom: 8,
  },
  footerText: {
    textAlign: 'center',
    color: '#4229b8',
    fontSize: 13,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.85,
    backgroundColor: '#FCFCF7',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    position: 'relative',
  },
  closeModalBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  successIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f3f0ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  successIconInner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMarkOverlay: {
    position: 'absolute',
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalSubtitle: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  returnButton: {
    backgroundColor: '#4229b8',
    height: 54,
    width: '100%',
    borderRadius: 27,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  returnButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});