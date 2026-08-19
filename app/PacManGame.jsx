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

            // Hide ads and side nav
            const style = document.createElement('style');
            style.innerHTML = \`
              nav, #leftad, #rightad, header { display: none !important; }
              #full-page-container { width: 100vw !important; height: 100vh !important; }
              #game-container { transform: scale(1.2); transform-origin: top center; }
              #sound-button, .sound-button { margin-right: 20px !important; transform: translateX(-15px) !important; }
              #movement-buttons, .movement-buttons { display: none !important; }
              
              /* Aggressive Ad Blocking */
              iframe, ins, ins.adsbygoogle, [id*="google_ads"], [id*="ad-"], [class*="ad-"], #leftad, #rightad { 
                display: none !important; 
                visibility: hidden !important; 
                opacity: 0 !important; 
                pointer-events: none !important; 
              }

              /* Make loading bar small and quick */
              .loading-bar-container, #loading-bar-container { height: 5px !important; width: 40% !important; margin: 0 auto !important; }
              .loading-bar, #loading-bar { transition-duration: 0.05s !important; background-color: yellow !important; }
            \`;
            document.head.appendChild(style);

            // Auto-start game and hide menu
            const attemptStart = setInterval(() => {
              const startBtn = document.getElementById('game-start');
              // Only click if it's actually visible
              if (startBtn && window.getComputedStyle(startBtn).display !== 'none') {
                startBtn.click();
                clearInterval(attemptStart);
                const menu = document.getElementById('main-menu-container');
                if (menu) menu.style.display = 'none';
              }
            }, 50);