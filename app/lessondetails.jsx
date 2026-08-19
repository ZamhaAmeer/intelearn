import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StatusBar,
    Dimensions,
    Linking,
    Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useGlobalTheme } from './themeStore';

const { width } = Dimensions.get('window');

export default function LessonDetailScreen() {
    const router = useRouter();
    const [isDark] = useGlobalTheme();

    // 1. Fetch the data passed from the previous screen
    const { courseTitle, lessonTitle, description, mcqs, url, parentRoute, adaptedEmotion } = useLocalSearchParams();

    // Parse AI extracted MCQs
    let parsedQuestions = null;
    try {
        if (mcqs && mcqs !== 'undefined' && mcqs !== 'null') {
            parsedQuestions = JSON.parse(mcqs);
        }
    } catch (e) {
        console.log("Error parsing MCQs in lessondetails:", e);
    }
