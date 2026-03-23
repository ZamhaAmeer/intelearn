import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
    Dimensions,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function ForgotPasswordModal({ visible, onClose }) {
  const [step, setStep] = useState(1); // Step 1: Email, Step 2: OTP
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '']);
  
  // Refs for auto-focusing next OTP input
  const inputRefs = useRef([]);

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 4) {
      inputRefs.current[index + 1].focus();
    }
  };

  const resetModal = () => {
    setStep(1);
    setEmail('');
    setOtp(['', '', '', '', '']);
    onClose();
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={resetModal}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.dismissArea} activeOpacity={1} onPress={resetModal} />
        
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.bottomSheet}>
          <View style={styles.contentContainer}>
            <View style={styles.handle} />
            <TouchableOpacity style={styles.closeButton} onPress={resetModal}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>

            {step === 1 ? (
              /* --- STEP 1: FORGOT PASSWORD --- */
              <>
                <Text style={styles.title}>Forgot password</Text>
                <Text style={styles.description}>
                  Enter your email and we'll send a 5-digit verification code instantly.
                </Text>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email Address*</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="example@email.com"
                    placeholderTextColor="#A0A0A0"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
                <TouchableOpacity style={styles.primaryButton} onPress={() => setStep(2)}>
                  <Text style={styles.buttonText}>Send Code</Text>
                </TouchableOpacity>
                <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
              </>
            ) : (
              /* --- STEP 2: VERIFICATION (OTP) --- */
              <>
                <Text style={styles.title}>Verification</Text>
                <Text style={styles.description}>Enter the 5 digit code sent to your email</Text>
                
                <View style={styles.otpContainer}>
                  {otp.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      style={styles.otpInput}
                      keyboardType="number-pad"
                      maxLength={1}
                      value={digit}
                      onChangeText={(value) => handleOtpChange(value, index)}
                    />
                  ))}
                </View>

                <TouchableOpacity style={styles.primaryButton} onPress={() => console.log("Verify OTP:", otp.join(''))}>
                  <Text style={styles.buttonText}>Verify</Text>
                </TouchableOpacity>

                <View style={styles.footer}>
                  <Text style={styles.footerText}>Didn't receive code? </Text>
                  <TouchableOpacity><Text style={styles.linkText}>Resend Code</Text></TouchableOpacity>
                </View>

                <View style={styles.mailIconCircle}>
                  <Ionicons name="mail-outline" size={30} color="#5D3FD3" />
                </View>
              </>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  dismissArea: { flex: 1 },
  bottomSheet: { backgroundColor: '#FFFCF0', borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingBottom: 20 },
  contentContainer: { padding: 25, alignItems: 'center' },
  handle: { width: 40, height: 5, backgroundColor: '#CCC', borderRadius: 2.5, marginBottom: 10 },
  closeButton: { alignSelf: 'flex-end' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 15 },
  description: { fontSize: 16, color: '#444', textAlign: 'center', marginBottom: 30 },
  inputGroup: { width: '100%', marginBottom: 25 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#DDD', borderRadius: 12, padding: 15 },
  otpContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 40 },
  otpInput: { width: 55, height: 60, backgroundColor: '#F0F0E4', borderRadius: 12, textAlign: 'center', fontSize: 22, fontWeight: 'bold', borderWidth: 1, borderColor: '#E0E0E0' },
  primaryButton: { backgroundColor: '#5D3FD3', width: '100%', padding: 16, borderRadius: 25, alignItems: 'center', marginBottom: 25 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  footer: { alignItems: 'center', marginBottom: 20 },
  footerText: { color: '#666', fontSize: 15 },
  linkText: { color: '#5D3FD3', fontWeight: 'bold', marginTop: 5 },
  loginLink: {
    color: '#5D3FD3',
    fontWeight: 'bold',
  },
  mailIconCircle: { width: 70, height: 70, backgroundColor: '#EEEAFE', borderRadius: 35, justifyContent: 'center', alignItems: 'center', marginTop: 10 }
});