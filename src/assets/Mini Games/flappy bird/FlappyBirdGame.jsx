import React, { useRef } from 'react';
import { StyleSheet, SafeAreaView, View, TouchableOpacity, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import flappyHtml from './flappyHtml';

export default function FlappyBirdGame() {
  const webViewRef = useRef(null);
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar hidden={true} />
      <View style={styles.container}>
        <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html: flappyHtml, baseUrl: 'http://localhost/' }}
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
          onMessage={(event) => {
            try {
              const data = JSON.parse(event.nativeEvent.data);
              if (data.type === 'error') {
                console.log("FLAPPY BIRD WEBVIEW ERROR:", data.message);
                alert("Game Error: " + data.message);
              }
            } catch (e) {
              console.log("WEBVIEW MESSAGE:", event.nativeEvent.data);
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
    backgroundColor: '#71c5cf', // Match flappy bird sky color
  },
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#71c5cf',
  },
  webview: {
    flex: 1,
    backgroundColor: '#71c5cf',
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
