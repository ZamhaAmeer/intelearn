import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import { useGlobalTheme } from './themeStore';
const { height } = Dimensions.get("window");

export default function RegisterPage() {
  const router = useRouter();
  const [isDark] = useGlobalTheme();

  // State for form inputs
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [agree, setAgree] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  const handleScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 30;
    if (isCloseToBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
    }
  };

  const openPrivacyModal = () => {
    if (!agree) {
      setHasScrolledToBottom(false);
    }
    setShowPrivacyModal(true);
  };

  // Password validation states
  const isLengthValid = password.length >= 8;
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
  const showMatchError = confirmPassword.length > 0 && password !== confirmPassword;

  const handleRegister = async () => {
    // 1. Check if fields are empty
    if (!email || !password || !confirmPassword) {
      alert('Please fill in all required fields.');
      return;
    }

    const studentEmailRegex = /^\d{2}[a-zA-Z]{3}\d{4}@ms\.sab\.ac\.lk$/i;
    if (!studentEmailRegex.test(email.trim())) {
      alert('Invalid Email! Please use your official university email (e.g., 22fis0574@ms.sab.ac.lk).');
      return; // Stops the registration process
    }

    // 2. Check if passwords match
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    try {
      // REPLACE the IP below with your actual IPv4 address
      const response = await fetch('http://172.22.236.72:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // 3. Send the ACTUAL state variables, not the hardcoded test strings!
        body: JSON.stringify({
          full_name: fullName,
          email: email.trim().toLowerCase(), // .trim() removes accidental spaces
          password: password,
          role: 'student' // Since this navigates to the student login, we hardcode 'student' here
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Success! User registered:', data);
        Alert.alert(
          "Registration Successful",
          "Your account has been created successfully.",
          [
            {
              text: "OK",
              onPress: () => {
                router.push({
                  pathname: '/profilescreen',
                  params: {
                    fullName: fullName,
                    email: email.trim().toLowerCase()
                  }
                });
              }
            }
          ]
        );
      } else {
        alert(data.error || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      alert('Could not connect to server');
    }
  };

  return (
    <View style={[styles.container, isDark && { backgroundColor: '#121212' }]}>
      {/* Header Section */}
      <ImageBackground
        source={require("../src/assets/images/header-curve.png")}
        style={styles.headerBackground}
        resizeMode="stretch"
      >
        <View style={styles.backButtonContainer}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={30} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Create Your Account</Text>
        </View>
      </ImageBackground>


      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled" // Allows tapping outside inputs to dismiss keyboard
        >


          <View style={styles.content}>

            {/* Registration Form Card */}
            <View style={[styles.formCard, isDark && { backgroundColor: '#1E1E1E' }]}>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, isDark && { color: '#EEEEEE' }]}>Full Name*</Text>
                <TextInput
                  style={[styles.input, isDark && { backgroundColor: '#2A2A2A', borderColor: '#333', color: '#FFF' }]}
                  placeholder="John Doe"
                  placeholderTextColor={isDark ? "#888" : "#A0A0A0"}
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, isDark && { color: '#EEEEEE' }]}>Email Address*</Text>
                <TextInput
                  style={[styles.input, isDark && { backgroundColor: '#2A2A2A', borderColor: '#333', color: '#FFF' }]}
                  placeholder="example@email.com"
                  placeholderTextColor={isDark ? "#888" : "#A0A0A0"}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Password* */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, isDark && { color: '#EEEEEE' }]}>Password*</Text>
                <View style={[styles.passwordInputWrapper, isDark && { backgroundColor: '#2A2A2A', borderColor: '#333' }]}>
                  <TextInput
                    style={[styles.flexInput, isDark && { color: '#FFF' }]}
                    placeholder="........"
                    placeholderTextColor={isDark ? "#888" : "#A0A0A0"}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword} // Toggle visibility here
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                      name={showPassword ? "eye-outline" : "eye-off-outline"}
                      size={22}
                      color={isDark ? "#888" : "#A0A0A0"}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password* */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, isDark && { color: '#EEEEEE' }]}>Confirm Password*</Text>
                <View style={[styles.passwordInputWrapper, isDark && { backgroundColor: '#2A2A2A', borderColor: '#333' }]}>
                  <TextInput
                    style={[styles.flexInput, isDark && { color: '#FFF' }]}
                    placeholder="........"
                    placeholderTextColor={isDark ? "#888" : "#A0A0A0"}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showPassword} // Toggle visibility here
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                      name={showPassword ? "eye-outline" : "eye-off-outline"}
                      size={22}
                      color={isDark ? "#888" : "#A0A0A0"}
                    />
                  </TouchableOpacity>
                  {showMatchError && (
                    <Text style={styles.errorText}>Passwords do not match</Text>
                  )}
                </View>
              </View>
              {/* Password Requirements Box */}
              <View style={[styles.requirementsBox, isDark && { backgroundColor: '#2A2440', borderColor: '#4C35A5' }]}>
                <Text style={[styles.requirementsTitle, isDark && { color: '#B39DDB' }]}>PASSWORD REQUIREMENTS</Text>

                <View style={styles.requirementRow}>
                  <Ionicons
                    name={isLengthValid ? "checkmark-circle" : "ellipse-outline"}
                    size={20}
                    // Use a bright green when valid, gray when invalid
                    color={isLengthValid ? "#10b981" : (isDark ? "#666" : "#d1d5db")}
                  />
                  <Text style={[
                    styles.requirementText,
                    isDark && { color: '#AAAAAA' },
                    isLengthValid && (isDark ? { color: '#A5D6A7' } : styles.requirementTextValid) // Apply valid style if true
                  ]}>
                    At least 8 characters long
                  </Text>
                </View>

                <View style={styles.requirementRow}>
                  <Ionicons
                    name={hasSpecialChar ? "checkmark-circle" : "ellipse-outline"}
                    size={20}
                    color={hasSpecialChar ? "#10b981" : (isDark ? "#666" : "#d1d5db")}
                  />
                  <Text style={[
                    styles.requirementText,
                    isDark && { color: '#AAAAAA' },
                    hasSpecialChar && (isDark ? { color: '#A5D6A7' } : styles.requirementTextValid)
                  ]}>
                    Include one special character
                  </Text>
                </View>
              </View>
            </View>

            {/* Privacy Policy Checkbox Row */}
            <View style={styles.privacyRow}>
              <TouchableOpacity
                style={[styles.checkbox, isDark && { borderColor: '#666' }, agree && styles.checkboxChecked]}
                onPress={() => agree ? setAgree(false) : openPrivacyModal()}
              >
                {agree && <Ionicons name="checkmark" size={14} color="white" />}
              </TouchableOpacity>
              <TouchableOpacity onPress={openPrivacyModal}>
                <Text style={[styles.privacyText, isDark && { color: '#AAAAAA' }]}>
                  I agree to the <Text style={[styles.privacyLink, isDark && { color: '#B39DDB' }]}>Privacy Policy</Text>
                </Text>
              </TouchableOpacity>
            </View>

            {/* Register Button */}
            <TouchableOpacity
              style={[styles.registerButton, !agree && styles.registerButtonDisabled]}
              onPress={handleRegister}
              disabled={!agree} // Disables the button if agree is false
            >
              <Text style={styles.registerButtonText}>Register</Text>
            </TouchableOpacity>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={[styles.footerText, isDark && { color: '#AAAAAA' }]}>Already have an account?</Text>
              <TouchableOpacity onPress={() => router.push("/loginpage(student)")}>
                <Text style={[styles.loginText, isDark && { color: '#B39DDB' }]}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Privacy Policy Modal */}
      <Modal
        visible={showPrivacyModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPrivacyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="shield-checkmark" size={24} color="#5D3FD3" style={{ marginRight: 8 }} />
                <Text style={styles.modalTitle}>Privacy & Data Policy</Text>
              </View>
              <TouchableOpacity onPress={() => setShowPrivacyModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalScrollView}
              showsVerticalScrollIndicator={true}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            >
              <Text style={styles.protocolTag}>INSTITUTIONAL PROTOCOL</Text>

              <Text style={styles.mainPolicyTitle}>
                Terms of Academic Service & Data Privacy
              </Text>

              <Text style={styles.introPolicyText}>
                Please review the Learnora digital governance framework. These statutes define the bilateral obligations between the institution and the student body regarding digital engagement.
              </Text>

              <View style={styles.policySectionContainer}>
                <Text style={styles.policySectionTitle}>Section 1.0: Preamble</Text>
                <Text style={styles.policyText}>
                  This document constitutes a binding legal agreement governing the use of the Learnora Virtual Learning Environment (VLE). By authenticating your credentials, you acknowledge the sovereignty of these clauses in all academic and administrative digital interactions within the platform ecosystem.
                </Text>
              </View>

              <View style={styles.policySectionContainer}>
                <Text style={styles.policySectionTitle}>Section 1.2: VLE Activity Logging</Text>
                <Text style={styles.policyText}>
                  The Learnora architecture maintains an immutable ledger of all user interactions. This includes, but is not limited to: login frequency, duration of resource access, navigational heatmaps, and asynchronous participation metrics. These data points are synthesized to evaluate student engagement and predict academic outcomes. Under this clause, users concede that inactivity for periods exceeding 14 academic days may trigger automatic intervention protocols from the Office of Academic Affairs.
                </Text>
              </View>

              <View style={styles.policySectionContainer}>
                <Text style={styles.policySectionTitle}>Section 2.0: Intellectual Property of Contributions</Text>
                <Text style={styles.policyText}>
                  All scholarly outputs, discussion board contributions, and peer-review submissions transmitted via the VLE are subject to an irrevocable, non-exclusive license granted to Learnora for the purposes of pedagogical analysis and institutional archiving. Users retain moral rights to their work, but acknowledge that the platform may utilize anonymized fragments of such work for the refinement of Large Language Models (LLMs) used in institutional tutoring.
                </Text>
              </View>

              <View style={styles.policySectionContainer}>
                <Text style={styles.policySectionTitle}>Section 4.5: Biometric Facial Processing</Text>
                <Text style={styles.policyText}>
                  In alignment with proctoring integrity standards, Learnora employs advanced biometric processing during synchronous assessment periods. This involves the real-time analysis of camera data to verify identity and maintain continuous presence detection. This 'Biometric Facial Processing' protocol captures micro-expression data points to ensure the integrity of the testing environment. Data extracted under this section is processed locally when possible, but high-assurance assessments may require encrypted transmission to institutional security servers for forensic auditing. By proceeding, you authorize the temporary activation of hardware imaging devices for these specific compliance checks.
                </Text>
              </View>

              <View style={styles.policySectionContainer}>
                <Text style={styles.policySectionTitle}>Section 5.1: Third-Party Academic Integrations</Text>
                <Text style={styles.policyText}>
                  Learnora leverages a network of secondary service providers for plagiarism detection, e-library indexing, and cloud-based laboratory environments. Personal identifiers—excluding sensitive financial data—may be shared with these entities to ensure a seamless academic experience. Each provider is audited for compliance with the Federal Student Data Privacy Act (FSDPA).
                </Text>
              </View>

              <View style={styles.policySectionContainer}>
                <Text style={styles.policySectionTitle}>Section 6.0: Termination of Access</Text>
                <Text style={styles.policyText}>
                  Failure to comply with the ethical conduct standards outlined in the Student Handbook, or a breach of the digital security protocols established herein, may result in the immediate revocation of VLE access. Reinstatement is subject to a formal hearing before the Digital Ethics Committee.
                </Text>
              </View>

              <View style={styles.footerInfo}>
                <Text style={styles.versionText}>Document Version: 2024.Q3.Institutional.Rev04</Text>
                <Text style={styles.versionText}>Last Updated: September 14, 2024</Text>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.declineButton}
                onPress={() => {
                  setAgree(false);
                  setShowPrivacyModal(false);
                }}
              >
                <Text style={styles.declineButtonText}>Decline</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  !hasScrolledToBottom && styles.confirmButtonDisabled
                ]}
                disabled={!hasScrolledToBottom}
                onPress={() => {
                  setAgree(true);
                  setShowPrivacyModal(false);
                }}
              >
                <Ionicons name="checkmark-circle" size={18} color="white" style={{ marginRight: 6 }} />
                <Text style={styles.confirmButtonText}>I AGREE & CONTINUE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFCF0", // Cream background

  },
  headerBackground: {
    width: "100%",
    height: height * 0.3,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },

  backButtonContainer: {
    position: 'absolute',
    top: 40,
    left: 10,
    zIndex: 10,
  },
  backButton: {
    padding: 10,
  },
  headerTextContainer: {
    marginTop: -35,
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  content: {
    paddingHorizontal: 30,
    marginTop: 25,
    paddingBottom: 40,
    position: "relative", // <-- ADD THIS
    zIndex: 1,            // <-- KEEP THIS
    elevation: 10,
  },
  formCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#000",
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  checkboxChecked: {
    backgroundColor: '#5D3FD3',
    borderColor: '#5D3FD3',
  },
  privacyText: {
    fontSize: 15,
    color: "#444",
  },
  privacyLink: {
    color: "#5D3FD3",
    textDecorationLine: 'underline',
  },
  registerButton: {
    backgroundColor: "#5D3FD3",
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 40,
  },
  registerButtonDisabled: {
    backgroundColor: "#A0A0A0", // Gray out the button
    opacity: 0.7, // Make it look slightly faded
  },
  registerButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    alignItems: "center",
    marginTop: 30,
  },
  footerText: {
    color: "#000",
    fontSize: 16,
  },
  loginText: {
    color: "#3716A4",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
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
  scrollView: {
    flex: 1,
    marginTop: -110, // Pulls the white card up over the bottom edge of the purple curve
  },
  scrollContainer: {
    flexGrow: 1,
  },
  passwordInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  flexInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: "#000",
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 5,
    fontWeight: '500',
    marginLeft: 4,
  },
  protocolTag: {
    fontSize: 11,
    color: '#5D3FD3',
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  mainPolicyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0D1B60',
    lineHeight: 26,
    marginBottom: 12,
  },
  introPolicyText: {
    fontSize: 13,
    color: '#5C677D',
    lineHeight: 19,
    marginBottom: 16,
  },
  policySectionContainer: {
    marginBottom: 16,
  },
  policySectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A237E',
    marginBottom: 4,
  },
  policyText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 19,
  },
  footerInfo: {
    marginTop: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    marginBottom: 15,
  },
  versionText: {
    fontSize: 11,
    color: '#888',
    fontStyle: 'italic',
  },
  scrollHintBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF3C7',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  scrollHintText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    width: "100%",
    maxHeight: "82%",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  modalScrollView: {
    marginVertical: 10,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    gap: 10,
  },
  declineButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#CCC",
    alignItems: "center",
  },
  declineButtonText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "600",
  },
  confirmButton: {
    flex: 1.6,
    backgroundColor: "#5D3FD3",
    paddingVertical: 12,
    borderRadius: 25,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmButtonDisabled: {
    backgroundColor: "#A0A0A0",
    opacity: 0.6,
  },
  confirmButtonText: {
    color: "white",
    fontSize: 13,
    fontWeight: "bold",
  },
});