import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Dimensions,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

const { height } = Dimensions.get("window");

export default function RegisterPage() {
  const router = useRouter();
  
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [agree, setAgree] = useState(false);

  
  const isLengthValid = password.length >= 8;
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
const showMatchError = confirmPassword.length > 0 && password !== confirmPassword;

  const handleRegister = async () => {

  if (!email || !password || !confirmPassword) {
    alert('Please fill in all required fields.');
    return;
  }

  const studentEmailRegex = /^\d{2}[a-zA-Z]{3}\d{4}@ms\.sab\.ac\.lk$/i;
    if (!studentEmailRegex.test(email.trim())) {
      alert('Invalid Email! Please use your official university email (e.g., 22fis0574@ms.sab.ac.lk).');
      return; 
    }

  
  if (password !== confirmPassword) {
    alert('Passwords do not match!');
    return;
  }
  try {
    
    const response = await fetch('http://172.20.10.3:3000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      
      body: JSON.stringify({ 
        full_name: fullName,
        email: email.trim().toLowerCase(),
        password: password, 
        role: 'student' 
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
      console.error('Registration failed:', data.error);
      alert('Error: ' + data.error);
    }
  } catch (error) {
    console.error('Network Error:', error);
    alert('Could not connect to server');
  }
};

  return (
    <View style={styles.container}>
       <ImageBackground
        source={require("../src/assets/images/header-curve.png")}
        style={styles.headerBackground}
        resizeMode="stretch"
      >
        <View style={styles.backButtonContainer}>
          <TouchableOpacity 
            onPress={() => router.replace('/loginpage(student)')} 
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
                  keyboardShouldPersistTaps="handled" 
                >
                

          <View style={styles.content}>
            
          
            <View style={styles.formCard}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name*</Text>
                <TextInput
                  style={styles.input}
                  placeholder="John Doe"
                  placeholderTextColor="#A0A0A0"
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address*</Text>
                <TextInput
                  style={styles.input}
                  placeholder="example@email.com"
                  placeholderTextColor="#A0A0A0"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Password*</Text>
                      <View style={styles.passwordInputWrapper}>
                        <TextInput
                          style={styles.flexInput}
                          placeholder="........"
                          placeholderTextColor="#A0A0A0"
                          value={password}
                          onChangeText={setPassword}
                          secureTextEntry={!showPassword} // Toggle visibility here
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                          <Ionicons 
                            name={showPassword ? "eye-outline" : "eye-off-outline"} 
                            size={22} 
                            color="#A0A0A0" 
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Confirm Password*</Text>
                      <View style={styles.passwordInputWrapper}>
                        <TextInput
                          style={styles.flexInput}
                          placeholder="........"
                          placeholderTextColor="#A0A0A0"
                          value={confirmPassword}
                          onChangeText={setConfirmPassword}
                          secureTextEntry={!showPassword} // Toggle visibility here
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                          <Ionicons 
                            name={showPassword ? "eye-outline" : "eye-off-outline"} 
                            size={22} 
                            color="#A0A0A0" 
                          />
                        </TouchableOpacity>
                                        {showMatchError && (
                          <Text style={styles.errorText}>Passwords do not match</Text>
                        )}
                      </View>
                    </View>
               
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
                   </View>

                  
            <View style={styles.privacyRow}>
              <TouchableOpacity 
                style={[styles.checkbox, agree && styles.checkboxChecked]} 
                onPress={() => setAgree(!agree)}
              >
                {agree && <Ionicons name="checkmark" size={14} color="white" />}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push("/privacy")}>
                <Text style={styles.privacyText}>
                  I agree to the <Text style={styles.privacyLink}>Privacy Policy</Text>
                </Text>
              </TouchableOpacity>
            </View>

           

            
            <TouchableOpacity 
              style={[styles.registerButton, !agree && styles.registerButtonDisabled]} 
              onPress={handleRegister}
              disabled={!agree} 
            >
              <Text style={styles.registerButtonText}>Register</Text>
            </TouchableOpacity>

            
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => router.push("/loginpage_Student")}>
                <Text style={styles.loginText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFCF0", 

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
    position: "relative", 
    zIndex: 1,            
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
    backgroundColor: "#A0A0A0", 
    opacity: 0.7, 
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
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6b7280',
  },
  requirementTextValid: {
    color: '#10b981', 
    fontWeight: '500', 
  },
  scrollView: {
    flex: 1,
    marginTop: -110, 
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
});