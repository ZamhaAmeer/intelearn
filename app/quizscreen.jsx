import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ScrollView,
    Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useGlobalTheme } from './themeStore';

export default function QuizScreen() {
    const [isDark] = useGlobalTheme();
    const router = useRouter();

    // Normally, you'd pass your Gemini-generated MCQs through router params.
    // const { questionsParam, courseTitle } = useLocalSearchParams();
    // const parsedQuestions = questionsParam ? JSON.parse(questionsParam) : fallbackQuestions;

    const { courseTitle, mcqs, lessonTitle, description, url, parentRoute } = useLocalSearchParams();
    let parsedQuestions = null;
    try {
        if (mcqs && mcqs !== 'undefined' && mcqs !== 'null') {
            parsedQuestions = JSON.parse(mcqs);
        }
    } catch (e) {
        console.log("Error parsing MCQs:", e);
    }

    // Fallback data formatted exactly like your Gemini backend outputs
    const fallbackQuestions = [
        {
            question: "What is an Information System (IS)?",
            A: "A system used only for storing data",
            B: "A software used only by managers",
            C: "A system that replaces human decision making",
            D: "A set of interrelated components that collect, process, and distribute information",
            answer: "D"
        },
        {
            question: "Which of the following is NOT a core component of an Information System?",
            A: "Hardware",
            B: "People",
            C: "Air Conditioning",
            D: "Data",
            answer: "C"
        },
        {
            question: "What is the primary purpose of feedback in a system?",
            A: "To meet an objective",
            B: "To store unused data",
            C: "To slow down the processor",
            D: "To replace the manager",
            answer: "A"
        },
        {
            question: "Who uses Information Systems in an organization?",
            A: "Only Executives",
            B: "Only the IT Department",
            C: "Sales reps, Managers, Executives, and Advisors",
            D: "External customers only",
            answer: "C"
        },
        {
            question: "What does data manipulation entail in an IS?",
            A: "Deleting user accounts",
            B: "Transforming raw data into useful information",
            C: "Creating hardware components",
            D: "Fixing physical network cables",
            answer: "B"
        }
    ];

    const questions = (parsedQuestions && parsedQuestions.length > 0) ? parsedQuestions : fallbackQuestions;

    // --- STATE MANAGEMENT ---
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // --- NEW: RESET STATE WHEN LESSON CHANGES ---
    useEffect(() => {
        setCurrentIndex(0);        // Reset to the first question
        setSelectedOption(null);   // Clear any selected answer
        setIsSubmitted(false);     // Reset the submission status
    }, [lessonTitle]);           // This runs every time 'lessonTitle' changes

    const currentQ = questions[currentIndex];
    const progressPercentage = ((currentIndex + 1) / questions.length) * 100;

    const handleGoBack = () => {
        // FORCE the router to go to lessondetails and pass the data back.
        // We completely bypass router.back() because Tabs handle history differently.
        router.replace({
            pathname: '/lessondetails',
            params: {
                courseTitle: courseTitle,
                lessonTitle: lessonTitle,
                description: description,
                mcqs: mcqs,
                url: url,
                parentRoute: parentRoute
            }
        });
    };

    // --- HANDLERS ---
    const handleSelectOption = (letter) => {
        // Prevent changing answer after submission
        if (!isSubmitted) {
            setSelectedOption(letter);
        }
    };

    const handleActionBtn = () => {
        if (!selectedOption) {
            Alert.alert("Hold on!", "Please select an answer before submitting.");
            return;
        }

        if (!isSubmitted) {
            // Submit the answer
            setIsSubmitted(true);
        } else {
            // Next Question Logic
            if (currentIndex < questions.length - 1) {
                setCurrentIndex(currentIndex + 1);
                setSelectedOption(null);
                setIsSubmitted(false);
            } else {
                // Quiz Finished
                Alert.alert("Quiz Complete!", "You have finished all 5 questions.", [
                    { text: "Go Back", onPress: handleGoBack }
                ]);
            }
        }
    };

    const renderStars = () => (
        Array(5).fill(0).map((_, i) => (
            <Icon key={i} name="star" size={16} color="#FFD700" style={{ marginRight: 4 }} />
        ))
    );

    return (
        <View style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor="#4C35A5" />

            {/* --- HEADER SECTION --- */}
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.menuButton} onPress={handleGoBack}>
                    <Icon name="chevron-left" size={36} color="white" />
                </TouchableOpacity>

                <Text style={styles.courseTitle}>{courseTitle || "Course Quiz"}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* --- PROGRESS BAR SECTION --- */}
                <View style={styles.progressHeader}>
                    <Text style={[styles.progressLabel, isDark && { color: '#B39DDB' }]}>Quiz Progress</Text>
                    <Text style={[styles.progressStep, isDark && { color: '#AAAAAA' }]}>Question {currentIndex + 1} of {questions.length}</Text>
                </View>
                <View style={[styles.progressTrack, isDark && { backgroundColor: '#2A2A2A' }]}>
                    <LinearGradient
                        colors={['#4E33B3', '#9B86EE']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.progressFill, { width: `${progressPercentage}%` }]}
                    />
                </View>

                {/* --- QUESTION SECTION --- */}
                <Text style={[styles.questionText, isDark && { color: '#FFFFFF' }]}>
                    {currentIndex + 1}. {currentQ.question}
                </Text>
                <Text style={[styles.subText, isDark && { color: '#AAAAAA' }]}>Select one correct answer from the options below</Text>

                {/* --- OPTIONS SECTION --- */}
                <View style={styles.optionsContainer}>
                    {['A', 'B', 'C', 'D'].map((letter) => {
                        const isSelected = selectedOption === letter;
                        const isCorrectAnswer = currentQ.answer === letter;

                        let containerStyle = [styles.optionCard, isDark && { backgroundColor: '#1E1E1E', borderColor: '#2A2A2A' }];
                        let badgeStyle = [styles.optionBadge, isDark && { backgroundColor: '#2A2A2A', borderColor: '#333' }];
                        let showCheckmark = false;

                        if (isSubmitted) {
                            if (isCorrectAnswer) {
                                containerStyle = [styles.optionCard, styles.optionCorrectCard, isDark && { backgroundColor: '#1C3829', borderColor: '#00C853' }];
                                showCheckmark = true;
                            } else if (isSelected && !isCorrectAnswer) {
                                containerStyle = [styles.optionCard, styles.optionWrongCard, isDark && { backgroundColor: '#3E1C2B', borderColor: '#F44336' }];
                            }
                        } else if (isSelected) {
                            containerStyle = [styles.optionCard, styles.optionSelectedCard, isDark && { backgroundColor: '#2A2440', borderColor: '#6B52D1' }];
                            badgeStyle = [styles.optionBadge, styles.optionBadgeSelected];
                        }

                        return (
                            <TouchableOpacity
                                key={letter}
                                style={containerStyle}
                                activeOpacity={0.7}
                                onPress={() => handleSelectOption(letter)}
                            >
                                <View style={badgeStyle}>
                                    <Text style={[styles.badgeText, isDark && { color: '#FFF' }, isSelected && !isSubmitted && { color: 'white' }]}>
                                        {letter}
                                    </Text>
                                </View>
                                <Text style={[styles.optionText, isDark && { color: '#FFFFFF' }]}>{currentQ[letter]}</Text>

                                {showCheckmark && (
                                    <Icon name="check-bold" size={24} color="#00C853" style={styles.checkIcon} />
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            
            </ScrollView>

            {/* --- ACTION BUTTON --- */}
            <View style={[styles.bottomContainer, isDark && { backgroundColor: '#121212' }]}>
                <TouchableOpacity style={styles.submitBtn} onPress={handleActionBtn}>
                    <Text style={styles.submitBtnText}>
                        {!isSubmitted
                            ? "Submit Answer"
                            : currentIndex === questions.length - 1
                                ? "Finish Quiz"
                                : "Next Question"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
