import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

export default function PrivacyScreen() {
  const router = useRouter();
  const [hasAgreed, setHasAgreed] = useState(false);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isDark, setIsDark] = useState(false);
  
  const toggleMenu = () => setMenuVisible(!isMenuVisible);

  // 🔑 NEW: Dynamic scroll detector to auto-unlock mode at the page bottom
  const handleScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    
    // Check if the user is near or at the bottom layout threshold (within 20 pixels)
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    
    if (isCloseToBottom && !hasAgreed) {
      setHasAgreed(true);
    }
  };

  // 2. SUB-COMPONENTS
  const SunIcon = ({ color }) => (
    <Svg width="22" height="22" viewBox="0 0 512 512">
      <Path fill={color} d="M256,104c-83.813,0-152,68.187-152,152s68.187,152,152,152s152-68.187,152-152S339.813,104,256,104z M256,368c-61.757,0-112-50.243-112-112s50.243-112,112-112s112,50.243,112,112S317.757,368,256,368z M256,72c11.046,0,20-8.954,20-20V20c0-11.046-8.954-20-20-20s-20,8.954-20,20v32C236,63.046,244.954,72,256,72z M256,440c-11.046,0-20,8.954-20,20v32c0,11.046,8.954,20,20,20s20-8.954,20-20v-32C276,448.954,267.046,440,256,440z M440,256c0-11.046,8.954-20,20-20h32c11.046,0,20,8.954,20,20s-8.954,20-20,20h-32C448.954,276,440,267.046,440,256z M72,256c0,11.046-8.954,20-20,20H20c-11.046,0-20-8.954-20-20s8.954-20,20-20h32C63.046,236,72,244.954,72,256z"/>
    </Svg>
  );
  
  const MoonIcon = ({ color }) => (
    <Svg width="20" height="20" viewBox="0 0 512 512">
      <Path fill={color} d="M410,329.2c-73.4,0-132.8-59.4-132.8-132.8c0-33.8,12.6-64.6,33.4-88.1c-14.7-3.4-30.1-5.3-46-5.3c-110,0-199.1,89.2-199.1,199.1S154.6,501.2,264.6,501.2c78.8,0,147-45.7,179.3-111.9C434,329.1,422.3,329.2,410,329.2z"/>
    </Svg>
  );

   const ThemeToggle = ({ isDark, onToggle }) => {
    const progress = useSharedValue(isDark ? 1 : 0);
    useEffect(() => { progress.value = withSpring(isDark ? 1 : 0); }, [isDark]);
  
    const rTrackStyle = useAnimatedStyle(() => ({
      backgroundColor: interpolateColor(progress.value, [0, 1], ['#E0E0E0', '#333333']),
    }));
    const rThumbStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: progress.value * 34 }],
    }));

    return (
      <TouchableOpacity activeOpacity={0.8} onPress={onToggle}>
        <Animated.View style={[styles.trackStyle, rTrackStyle]}>
          <Animated.View style={[styles.thumbStyle, rThumbStyle]} />
        </Animated.View>
      </TouchableOpacity>
    );
  };