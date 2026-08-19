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

   