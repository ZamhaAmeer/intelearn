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

        return (
        <View style={[styles.safeArea, isDark && { backgroundColor: '#121212' }]}>
            <StatusBar barStyle="light-content" backgroundColor="#4E33B3" />

            {/* --- PURPLE HEADER CARD --- */}
            <View style={styles.headerContainer}>
                {/* Hamburger / Back icon */}
                <TouchableOpacity style={styles.menuButton} onPress={() => router.back()}>
                    <Icon name="arrow-left" size={28} color="white" />
                </TouchableOpacity>

                {/* Course Name */}
                <Text style={styles.courseTitle}>{courseTitle || "Information Systems"}</Text>

                {/* Subtitle / Rating */}
                <View style={styles.subHeaderRow}>
                    <Text style={styles.subHeaderTitle}>{lessonTitle || "Module Details"}</Text>
                    <View style={styles.starsRow}>
                        {renderStars()}
                    </View>
                </View>
            </View>

            {/* --- BODY CONTENT --- */}
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Adapted Emotion Badge (if present) */}
                {adaptedEmotion && (
                    <View style={[styles.emotionBadge, isDark && { backgroundColor: '#2A2440', borderColor: '#4C35A5' }]}>
                        <Icon name="brain" size={20} color="#7E57C2" />
                        <Text style={[styles.emotionBadgeText, isDark && { color: '#B39DDB' }]}>
                            Adaptive Content: Tailored for <Text style={{ fontWeight: 'bold' }}>{adaptedEmotion}</Text> state
                        </Text>
                    </View>
                )}

                {/* Attached Document Download Box */}
                {url && url !== 'undefined' && (
                    <TouchableOpacity style={[styles.pdfBox, isDark && { backgroundColor: '#1E1A33', borderColor: '#4C35A5' }]} onPress={handleOpenPDF} activeOpacity={0.8}>
                        <View style={styles.pdfIconContainer}>
                            <Icon name="file-pdf-box" size={36} color="#E53935" />
                        </View>
                        <View style={styles.pdfTextContainer}>
                            <Text style={[styles.pdfTitle, isDark && { color: '#FFFFFF' }]}>Lesson Document Attachment</Text>
                            <Text style={[styles.pdfSubtitle, isDark && { color: '#AAAAAA' }]}>Tap to open/download PDF file</Text>
                        </View>
                        <Icon name="download-outline" size={24} color={isDark ? "#B39DDB" : "#4E33B3"} />
                    </TouchableOpacity>
                )}