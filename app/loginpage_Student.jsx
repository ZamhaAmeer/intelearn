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