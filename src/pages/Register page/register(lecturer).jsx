import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Dimensions,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

const { height } = Dimensions.get("window");

export default function RegisterPage() {
  const router = useRouter();
  
  // State for form inputs
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    // Add registration logic here
    console.log("Registering:", fullName, email);
  };

  return (
    <View style={styles.container}>
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
    

          <View style={styles.content}>
            
            {/* Registration Form Card */}
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
                <TextInput
                  style={styles.input}
                  placeholder="........"
                  placeholderTextColor="#A0A0A0"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={true}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm Password*</Text>
                <TextInput
                  style={styles.input}
                  placeholder="........"
                  placeholderTextColor="#A0A0A0"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={true}
                />
              </View>
            </View>

            {/* Register Button */}
            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.registerButtonText}>Register</Text>
            </TouchableOpacity>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => router.push("/loginPage_Lecturer")}>
                <Text style={styles.loginText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFCF0", // Cream background
  },
  headerBackground: {
    width: "100%",
    height: height * 0.3,
    justifyContent: "center",
    alignItems: "center",
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
    marginTop: -70,
    paddingBottom: 40,
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
  registerButton: {
    backgroundColor: "#5D3FD3",
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 40,
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
});
