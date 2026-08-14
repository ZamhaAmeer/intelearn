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
  View,
  ScrollView,
} from "react-native";

const { height } = Dimensions.get("window");

export default function RegisterPage() {
  const router = useRouter();

  // State for form inputs
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);

  const handleRegister = () => {
    console.log("Registering:", fullName, email);
  };

  return (
    <View style={styles.container}>
      {/* Header Section matching image_694020.png */}
      <ImageBackground
        source={require("../src/assets/images/header-curve.png")}
        style={styles.headerBackground}
        resizeMode="stretch"
      >
        <View style={styles.menuButtonContainer}>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="menu" size={32} color="white" />
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
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
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

            {/* Privacy Policy Checkbox Row */}
            <View style={styles.privacyRow}>
              <TouchableOpacity 
                style={[styles.checkbox, agree && styles.checkboxChecked]} 
                onPress={() => setAgree(!agree)}
              >
                {agree && <Ionicons name="checkmark" size={14} color="white" />}
              </TouchableOpacity>
              <Text style={styles.privacyText}>
                I agree to the <Text style={styles.privacyLink}>Privacy Policy</Text>
              </Text>
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
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFCF5", // Slight cream tint as seen in image_694020.png
  },
  headerBackground: {
    width: "100%",
    height: height * 0.28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: -98, 
  },
  menuButtonContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  headerTextContainer: {
    marginTop: -20,
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
  },
  content: {
    paddingHorizontal: 25,
    marginTop: -40, // Overlap the card onto the header
  },
  formCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginTop: 55,
    // Soft shadow logic
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)'
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#444",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 12,
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
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 30,
  },
  registerButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  footer: {
    alignItems: "center",
    marginTop: 35,
  },
  footerText: {
    color: "#333",
    fontSize: 16,
  },
  loginText: {
    color: "#4826B9",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 4,
  },
});