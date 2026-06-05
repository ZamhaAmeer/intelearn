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