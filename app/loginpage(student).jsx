import { Ionicons } from "@expo/vector-icons"; // For the close (X) icon
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import ForgotPasswordModal from "./forgotpassword";

const { height } = Dimensions.get("window");

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [isModalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    // Add your login logic here
    console.log("Login with:", email, password);
  };

  return (
    <View style={styles.container}>
      {/* Purple Header Section using your curve image */}
      <ImageBackground
        source={require("../src/assets/images/header-curve.png")}
        style={styles.headerBackground}
        resizeMode="stretch"
      >

        {/* 3. Back Button positioned absolutely */}
        <View style={styles.backButtonContainer}>
          <TouchableOpacity 
            onPress={() => router.replace('/choosingpage')} // Goes back to Choosing Page
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={30} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.logoContainer}>
          <Image
            source={require("../src/assets/images/logo.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.logoText}>INTELEARN</Text>
        </View>
      </ImageBackground>
      


      <View style={styles.content}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome to INTELEARN</Text>
          <Text style={styles.welcomeSubtitle}>Learn smart, Grow fast</Text>
        </View>

        {/* Login Form Card */}
        <View style={styles.formCard}>
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
              placeholder="@#$han&"
              placeholderTextColor="#A0A0A0"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
            />
          </View>

          {/* Remember Me & Forgot Password */}
          <View style={styles.row}>
            <TouchableOpacity 
              style={styles.checkboxRow} 
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>Remember Me</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>
          </View>
        </View>

        {/* Login Button */}
        <TouchableOpacity style={styles.loginButton} onPress={() => router.push("/coursedetails")}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.push("/register(student)")}>
            <Text style={styles.signUpText}>Create an account</Text>
          </TouchableOpacity>
        </View>
        <ForgotPasswordModal 
          visible={isModalVisible} 
          onClose={() => setModalVisible(false)} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFF0",
  },
  headerBackground: {
    width: "100%",
    height: height * 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: -250,
  },
  logoImage: {
    width: 170,
    height: 170,
    tintColor: "white",
    marginTop: 50
  },
  logoText: {
    color: "#FFF",
    fontSize: 26,
    fontWeight: "bold",
    letterSpacing: 1,
    marginTop: -50
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    marginTop: -160,
  },
  welcomeSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0B0C10",
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: "rgba(0, 0, 0, 0.6)",
    marginTop: 5,
  },
  formCard: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: "rgba(7, 0, 16, 0.9)",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "rgba(242, 231, 231, 0.2)",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 4,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#5B3CC2",
    borderColor: "#5B3CC2",
  },
  checkmark: {
    color: "white",
    fontSize: 12,
  },
  checkboxLabel: {
    fontSize: 12,
    color: "#5C5C57",
  },
  forgotText: {
    fontSize: 12,
    color: "#201A26",
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#5B3CC2",
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 30,
  },
  loginButtonText: {
    color: "#FFFFF0",
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    alignItems: "center",
    marginTop: 40,
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
  footerText: {
    color: "#000",
    fontSize: 15,
    fontWeight: "300",
  },
  signUpText: {
    color: "#3716A4",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
  },
});