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

    // Helper to render the 5 gold stars

    const renderStars = () => {
        return Array(5).fill(0).map((_, i) => (
            <Icon key={i} name="star" size={16} color="#FFD700" style={styles.starIcon} />
        ));
    };

    // --- NEW: PDF Download/Open Handler ---
    const handleOpenPDF = () => {
        if (url && url !== 'undefined') {
            // Opens the URL in the phone's default browser / PDF viewer
            Linking.openURL(url).catch((err) => {
                console.error("Failed to open PDF URL:", err);
                Alert.alert("Error", "Could not open the PDF file.");
            });
        } else {
            Alert.alert("Notice", "No PDF attachment available for this lesson.");
        }
    };