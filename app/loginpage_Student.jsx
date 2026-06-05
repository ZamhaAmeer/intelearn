import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from "@expo/vector-icons"; // For the close (X) icon
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
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

import ForgotPasswordModal from "./forgotpassword";

const { height } = Dimensions.get("window");

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [isModalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    // Basic frontend validation
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    console.log("Attempting login for:", email);

    try {
      
      const response = await fetch("http://10.19.66.72:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const rawText = await response.text();

      // Debugging logs to see exactly what the server said
    console.log("Server Status Code:", response.status);
    console.log("RAW SERVER RESPONSE:", rawText);

    // 3. Now safely try to convert it to JSON
      let data;
      try {
        data = JSON.parse(rawText);
      } catch (parseError) {
        console.error("Failed to parse JSON. The server sent HTML instead.");
        Alert.alert("Server Error", "Check your Expo terminal to see the raw HTML response.");
        return; 
      }

      // 3. The Logic Check
    if (response.status === 200) {

  await AsyncStorage.setItem('userEmail', email);

  console.log("Saved Email:", email);

  router.push("./coursedetails");
}
     else {
      // If status is 401 (Unauthorized) or 400 (Bad Request), show the error and DO NOT navigate
      console.log("Login rejected by server.");
      Alert.alert("Login Failed", data.error || "Incorrect email or password");
    }

  } catch (error) {
    console.error("Network or Fetch Error:", error);
    Alert.alert("Network Error", "Could not connect to the backend server. Is it running?");
  }
};


  return (
    <KeyboardAvoidingView 
    style={{ flex: 1, backgroundColor: "transparent" }} 
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
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

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
      


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
              returnKeyType="next"
            />
          </View>

          {/* Password* */}
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
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => router.push("/register(student)")}>
              <Text style={styles.signUpText}>Create an account</Text>
            </TouchableOpacity>
          </View>
        </View>
          
        </ScrollView>
        <ForgotPasswordModal 
          visible={isModalVisible} 
          onClose={() => setModalVisible(false)} 
        />
      </View>
      </KeyboardAvoidingView>
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