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

  return (
    <SafeAreaView style={[styles.safeArea, isDark && { backgroundColor: '#121212' }]}>
      <BreakTimerOverlay returnRoute={returnRoute} />
      <StatusBar hidden={true} />
      <View style={styles.container}>
        <WebView
          ref={webViewRef}
          source={{ uri: 'https://freepacman.org/' }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          bounces={false}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          setBuiltInZoomControls={false}
          androidLayerType="hardware"
          overScrollMode="never"
          mediaPlaybackRequiresUserAction={false}
          injectedJavaScript={`
            // Force 1x pixel ratio for massive performance boost on low-end androids
            Object.defineProperty(window, 'devicePixelRatio', { get: () => 1 });
            
            // Intercept console logs
            const originalLog = console.log;
            console.log = function(...args) {
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'log', message: args.join(' ') }));
              originalLog.apply(console, args);
            };