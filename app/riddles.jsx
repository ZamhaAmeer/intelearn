import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ScrollView,
    Alert,
    ActivityIndicator,
    Dimensions,
    Animated
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useGlobalTheme } from './themeStore';
import { generateGeminiRiddles, getRandomFallbackRiddles } from '../src/assets/API/gemini';

const { width, height } = Dimensions.get('window');
const CONFETTI_COLORS = ['#FFD700', '#FF4081', '#00E676', '#29B6F6', '#AB47BC', '#FF9100', '#7C4DFF', '#FF1744', '#00E5FF'];

// --- CONFETTI PARTICLE COMPONENT ---
const ConfettiParticle = ({ index }) => {
    const animY = useRef(new Animated.Value(-30)).current;
    const animX = useRef(new Animated.Value(0)).current;
    const animRotate = useRef(new Animated.Value(0)).current;
    const animOpacity = useRef(new Animated.Value(1)).current;

    const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
    const size = Math.floor(Math.random() * 8) + 8;
    const startX = Math.random() * (width - 40);
    const targetX = startX + (Math.random() * 160 - 80);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(animY, {
                toValue: height * 0.75 + Math.random() * 100,
                duration: 1600 + Math.random() * 800,
                useNativeDriver: true,
            }),
            Animated.timing(animX, {
                toValue: targetX - startX,
                duration: 1600 + Math.random() * 800,
                useNativeDriver: true,
            }),
            Animated.timing(animRotate, {
                toValue: 1,
                duration: 1400 + Math.random() * 800,
                useNativeDriver: true,
            }),
            Animated.timing(animOpacity, {
                toValue: 0,
                duration: 2000 + Math.random() * 500,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const spin = animRotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', `${index % 2 === 0 ? 720 : -720}deg`],
    });

    return (
        <Animated.View
            style={{
                position: 'absolute',
                left: startX,
                top: 0,
                width: index % 2 === 0 ? size : size * 1.4,
                height: size,
                borderRadius: index % 3 === 0 ? size / 2 : 2,
                backgroundColor: color,
                transform: [
                    { translateY: animY },
                    { translateX: animX },
                    { rotate: spin },
                ],
                opacity: animOpacity,
                zIndex: 999,
            }}
        />
    );
};

const ConfettiContainer = ({ active, keyId }) => {
    if (!active) return null;
    return (
        <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
            {Array.from({ length: 45 }).map((_, i) => (
                <ConfettiParticle key={`${keyId}-${i}`} index={i} />
            ))}
        </View>
    );
};
