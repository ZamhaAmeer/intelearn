import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

const Ripple = ({ delay }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 4000,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const scale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 2.5],
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0, 0.3, 0],
  });

  return (
    <Animated.View style={[styles.rippleRing, { transform: [{ scale }], opacity }]} />
  );
};

const SplashScreen = () => {
  const router = useRouter();

  // Animation Values
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current; // Scale Spring
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(25)).current; // Vertical Translation
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleTranslateY = useRef(new Animated.Value(20)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const waveAnim = useRef(new Animated.Value(height)).current; // Background Reveal

  useEffect(() => {
    // 1. Staggered Entrance (Sequencing)
    Animated.sequence([
      // Step 1: Logo lands first with Scale Spring + Opacity
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.spring(logoScale, { toValue: 1, friction: 6, tension: 40, useNativeDriver: true }),
      ]),
      // Step 2: Title appears with Slide Up + Opacity
      Animated.parallel([
        Animated.timing(titleOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(titleTranslateY, { toValue: 0, duration: 600, easing: Easing.out(Easing.back(1.5)), useNativeDriver: true }),
      ]),
      // Step 3: Tagline follows with Slide Up
      Animated.parallel([
        Animated.timing(subtitleOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(subtitleTranslateY, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]),
      // Step 4: Background Dynamics (The Reveal)
      Animated.timing(waveAnim, { toValue: height * 0.6, duration: 1000, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      // Step 5: Final Button Fade
      Animated.timing(buttonOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleGetStarted = () => {
    router.replace("/choosingpage");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={require("../../assets/images/background.png")}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      >
        {/* --- Background Ripple Layers --- */}
        <View style={styles.rippleOverlay}>
          <Ripple delay={0} />
          <Ripple delay={1000} />
          <Ripple delay={2000} />
        </View>

        {/* --- Background Dynamics (Wave Reveal) --- */}
        <Animated.View style={[styles.wave, { transform: [{ translateY: waveAnim }] }]} />

        <View style={styles.content}>
          <Animated.View style={{ opacity: logoOpacity, transform: [{ scale: logoScale }], alignItems: "center" }}>
            <Image source={require("../../assets/images/logo.png")} style={styles.logo} resizeMode="contain" />
          </Animated.View>

          <Animated.Text style={[styles.title, { opacity: titleOpacity, transform: [{ translateY: titleTranslateY }] }]}>
            INTELEARN
          </Animated.Text>
          <Animated.Text style={[styles.subtitle, { opacity: subtitleOpacity, transform: [{ translateY: subtitleTranslateY }] }]}>
            Learn smart, Grow fast
          </Animated.Text>
        </View>

        <Animated.View style={{ opacity: buttonOpacity, alignItems: 'center' }}>
          <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={handleGetStarted}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </Animated.View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#2b0a90" },
  rippleOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', zIndex: 0 },
  rippleRing: {
    position: 'absolute',
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: (width * 0.7) / 2,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  wave: {
    position: 'absolute',
    bottom: -height * 0.1,
    right: -width * 0.2,
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width,
    backgroundColor: 'rgba(255, 255, 255, 0.08)', // Subtle contrast reveal
    zIndex: 1,
  },
  content: { flex: 1, alignItems: "center", justifyContent: "center", zIndex: 10 },
  logo: { width: 200, height: 200, marginBottom: 10 },
  title: { fontSize: 34, fontWeight: "bold", color: "white", letterSpacing: 3, textAlign: "center" },
  subtitle: { fontSize: 18, color: "rgba(255, 255, 255, 0.8)", marginTop: 10 },
  button: { backgroundColor: "#FFFFFF", paddingVertical: 16, paddingHorizontal: 60, borderRadius: 35, marginBottom: 80, elevation: 5, zIndex: 11 },
  buttonText: { fontSize: 18, fontWeight: "bold", color: "#2b0a90" },
});

export default SplashScreen;