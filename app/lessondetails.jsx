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

                {/* Description Text */}
                {description && description !== 'undefined' ? (
                    <View style={[styles.dynamicDescContainer, isDark && { backgroundColor: '#1E1E1E', borderColor: '#2A2A2A' }]}>
                        <Text style={[styles.sectionHeading, isDark && { color: '#FFFFFF' }]}>Lesson Notes & Material</Text>
                        <Text style={[styles.dynamicDescText, isDark && { color: '#DDDDDD' }]}>{description}</Text>
                    </View>
                ) : (
                    /* Default Static Material Fallback if no description passed */
                    <View>
                        {/* Section Header */}
                        <Text style={[styles.sectionTitle, isDark && { color: '#B39DDB' }]}>Introduction to Information Systems</Text>

                        {/* Bullet 1 */}
                        <View style={styles.bulletRow}>
                            <Icon name="circle-slice-8" size={16} color={isDark ? "#B39DDB" : "#1a1a1a"} style={styles.bulletIcon} />
                            <Text style={[styles.mainText, isDark && { color: '#FFFFFF' }]}>Key Concepts Covered in this Module</Text>
                        </View>
                        {[
                            "Definition of Data vs Information vs Knowledge",
                            "Components of an Information System (Hardware, Software, Data, People, Processes)",
                            "Role of Information Systems in modern business and digital transformation"
                        ].map((item, index) => (
                            <View key={index} style={styles.checkRow}>
                                <Icon name="check" size={18} color={isDark ? "#81C784" : "#1a1a1a"} style={styles.checkIcon} />
                                <Text style={[styles.checkText, isDark && { color: '#DDDDDD' }]}>{item}</Text>
                            </View>
                        ))}

                        {/* Definition Bullet */}
                        <View style={[styles.bulletRow, { marginTop: 15 }]}>
                            <Icon name="circle-slice-8" size={16} color={isDark ? "#B39DDB" : "#1a1a1a"} style={styles.bulletIcon} />
                            <Text style={[styles.mainText, isDark && { color: '#FFFFFF' }]}>Information Systems (IS)</Text>
                        </View>
                        <View style={styles.checkRow}>
                            <Icon name="check" size={18} color={isDark ? "#81C784" : "#1a1a1a"} style={styles.checkIcon} />
                            <Text style={[styles.checkText, isDark && { color: '#DDDDDD' }]}>
                                Definition: An information system is a set of interrelated components that collect, manipulate, and disseminate data and information and provide feedback to meet an objective.
                            </Text>
                        </View>
                    </View>
                )}

                {/* Extracted Practice Questions */}
                {parsedQuestions && parsedQuestions.length > 0 && (
                    <View style={styles.questionsContainer}>
                        <Text style={styles.questionsTitle}>Practice Questions (AI Extracted)</Text>
                        {parsedQuestions.map((q, idx) => (
                            <View key={idx} style={styles.questionCard}>
                                <Text style={styles.questionCardTitle}>
                                    {idx + 1}. {q.question || q.question_text}
                                </Text>
                                <View style={styles.optionsList}>
                                    {['A', 'B', 'C', 'D'].map((opt) => {
                                        const optionText = q[opt] || q[`option_${opt.toLowerCase()}`];
                                        const isCorrect = q.answer === opt || q.correct_answer === opt;
                                        if (!optionText) return null;
                                        return (
                                            <View key={opt} style={[styles.optionItem, isCorrect && styles.optionItemCorrect]}>
                                                <View style={[styles.optionBadge, isCorrect && styles.optionBadgeCorrect]}>
                                                    <Text style={[styles.optionBadgeText, isCorrect && { color: 'white' }]}>{opt}</Text>
                                                </View>
                                                <Text style={[styles.optionText, isCorrect && styles.optionTextCorrect]}>{optionText}</Text>
                                                {isCorrect && (
                                                    <Icon name="check-circle" size={18} color="#10B981" style={styles.correctIcon} />
                                                )}
                                            </View>
                                        );
                                    })}
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>

            {/* --- ATTEMPT QUIZ BUTTON --- */}
            <View style={styles.bottomContainer}>
                <TouchableOpacity
                    style={styles.quizButton}
                    onPress={() => {
                        router.push({
                            pathname: '/quizscreen',
                            params: {
                                courseTitle: courseTitle,
                                mcqs: mcqs,
                                lessonTitle: lessonTitle, // <--- Add this
                                description: description, // <--- Add this
                                url: url,
                                parentRoute: parentRoute // <--- Add this
                            }
                        });
                    }}
                >
                    <Text style={styles.quizButtonText}>Attempt Quiz</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}