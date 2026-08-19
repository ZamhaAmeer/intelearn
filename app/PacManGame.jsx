import React, { useRef } from 'react';
import { StyleSheet, SafeAreaView, View, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import BreakTimerOverlay from '../src/components/BreakTimerOverlay';
import { useGlobalTheme } from './themeStore';

export default function PacManGame() {
  const webViewRef = useRef(null);
  const router = useRouter();
  const [isDark] = useGlobalTheme();
  const params = useLocalSearchParams();
  const returnRoute = params?.returnRoute || '/coursedetails';
