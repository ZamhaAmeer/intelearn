import React, { useRef } from 'react';
import { StyleSheet, SafeAreaView, View, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function PacManGame() {
  const webViewRef = useRef(null);
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
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
            }, 50); // Check every 50ms to click instantly and prevent loading sound overlap

            // Robust Swipe to Keyboard Converter
            let touchStartX = 0;
            let touchStartY = 0;
            
            document.addEventListener('touchstart', (e) => {
              touchStartX = e.touches[0].clientX;
              touchStartY = e.touches[0].clientY;
            }, { passive: false });
            
            document.addEventListener('touchmove', (e) => {
              e.preventDefault(); // Prevent scrolling
              if (!touchStartX || !touchStartY) return;
              
              let touchEndX = e.touches[0].clientX;
              let touchEndY = e.touches[0].clientY;
              let dx = touchEndX - touchStartX;
              let dy = touchEndY - touchStartY;
              
              if (Math.abs(dx) > 25 || Math.abs(dy) > 25) {
                let key = '';
                let keyCode = 0;
                if (Math.abs(dx) > Math.abs(dy)) {
                  key = dx > 0 ? 'ArrowRight' : 'ArrowLeft';
                  keyCode = dx > 0 ? 39 : 37;
                } else {
                  key = dy > 0 ? 'ArrowDown' : 'ArrowUp';
                  keyCode = dy > 0 ? 40 : 38;
                }
                
                // Fire both KeyboardEvent and generic Event to maximize compatibility with older web games
                const eventDown = new KeyboardEvent('keydown', { key: key, code: key, keyCode: keyCode, which: keyCode, bubbles: true });
                window.dispatchEvent(eventDown);
                document.dispatchEvent(eventDown);
                
                // Reset to prevent spamming
                touchStartX = touchEndX;
                touchStartY = touchEndY;
              }
            }, { passive: false });
            
            document.addEventListener('touchend', () => {
              touchStartX = 0;
              touchStartY = 0;
            });

            true;
          `}
          onMessage={(event) => {
            try {
              const data = JSON.parse(event.nativeEvent.data);
              if (data.type === 'error') {
                console.log("PAC MAN WEBVIEW ERROR:", data.message);
                Alert.alert("Game Error", data.message);
              } else if (data.type === 'log') {
                console.log("PAC MAN LOG:", data.message);
              }
            } catch (e) {
              console.log("WEBVIEW MESSAGE (Raw):", event.nativeEvent.data);
            }
          }}
        />

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/MiniGames')}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={32} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000', // Pac Man background is typically black
  },
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#000000',
  },
  webview: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 22,
  },
});
