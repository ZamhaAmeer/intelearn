import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
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
  
  // State for form inputs
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

   const [agree, setAgree] = useState(false);

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

  const lecturerEmailRegex = /^[a-zA-Z0-9._-]+@ms\.sab\.ac\.lk$/i;
    if (!lecturerEmailRegex.test(email.trim())) {
      alert('Invalid Email! Please use your official university email (e.g., name@ms.sab.ac.lk).');
      return; // Stops the registration process
    }

  // 2. Check if passwords match
  if (password !== confirmPassword) {
    alert('Passwords do not match!');
    return;
  }
  try {
    // REPLACE the IP below with your actual IPv4 address
    const response = await fetch('http://10.19.66.72:3000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // 3. Send the ACTUAL state variables, not the hardcoded test strings!
      body: JSON.stringify({ 
        full_name: fullName,
        email: email.trim().toLowerCase(), // .trim() removes accidental spaces
        password: password, 
        role: 'lecturer' // Since this navigates to the lecturer login, we hardcode 'lecturer' here
      }),
    });