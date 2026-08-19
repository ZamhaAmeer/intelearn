import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  StatusBar
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useGlobalTheme } from './themeStore';

export default function QuizAttemptScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [quiz, setQuiz] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { questionId: 'A' | 'B' | 'C' | 'D' }
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [attemptStarted, setAttemptStarted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const fetchQuizAndSubmission = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // 1. Fetch quiz details with questions
      const quizRes = await fetch(`http://172.22.236.72:3000/api/student/quizzes/${id}`, { headers });
      if (!quizRes.ok) {
        if (quizRes.status === 404) {
          throw new Error('Quiz not found');
        } else {
          throw new Error(`Failed to fetch quiz details (Status: ${quizRes.status})`);
        }
      }
      const quizData = await quizRes.json();
      setQuiz(quizData);

// 2. Fetch student submission status
      const subRes = await fetch(`http://172.22.236.72:3000/api/student/submission?quizId=${id}`, { headers });
      if (subRes.ok) {
        const subData = await subRes.json();
        if (subData && subData.id) {
          setSubmission(subData);
          setSelectedAnswers(subData.answers || {});
        } else {
          setSubmission(null);
          setSelectedAnswers({});
        }
      }
    } catch (error) {
      console.error("Error loading quiz details:", error);
      Alert.alert("Error", "Could not retrieve quiz context from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchQuizAndSubmission();
    }
  }, [id]);

  const selectOption = (questionId, optionKey) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionKey
    }));
  };

    const computeScore = () => {
    let score = 0;
    if (!quiz || !quiz.questions) return 0;

    quiz.questions.forEach(q => {
      const selected = selectedAnswers[q.id];
      const correct = q.correct_answer;
      if (selected && correct && selected.trim().toUpperCase() === correct.trim().toUpperCase()) {
        score++;
      }
    });

    const percent = Math.round((score / quiz.questions.length) * 100);
    return percent;
  };

  const handleSubmit = async () => {
    // Validate that all questions are answered
    if (quiz.questions && Object.keys(selectedAnswers).length < quiz.questions.length) {
      Alert.alert("Incomplete Attempt", "Please answer all questions before submitting.");
      return;
    }

    setSubmitting(true);
    const scoreVal = computeScore();

    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch('http://172.22.236.72:3000/api/student/submit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          quizId: id,
          answers: selectedAnswers,
          score: scoreVal
        })
      });

      const result = await response.json();
      if (response.ok) {
        Alert.alert("Quiz Completed", `You scored ${scoreVal}%! Submission saved.`);
        setAttemptStarted(false);
        fetchQuizAndSubmission();
      } else {
        throw new Error(result.error || "Submission failed");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditUpdate = async () => {
    if (quiz.questions && Object.keys(selectedAnswers).length < quiz.questions.length) {
      Alert.alert("Incomplete Attempt", "Please answer all questions before updating.");
      return;
    }

    setSubmitting(true);
    const scoreVal = computeScore();

    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`http://172.22.236.72:3000/api/student/submit/${submission.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          answers: selectedAnswers,
          score: scoreVal
        })
      });

      const result = await response.json();
      if (response.ok) {
        Alert.alert("Quiz Updated", `Attempt updated! New score is ${scoreVal}%.`);
        setIsEditing(false);
        fetchQuizAndSubmission();
      } else {
        throw new Error(result.error || "Update failed");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

    const handleRemoveSubmission = async () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to remove your quiz attempt? This will clear your record in the database, allowing you to start fresh.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            setSubmitting(true);
            try {
              const token = await AsyncStorage.getItem('token');
              const response = await fetch(`http://172.22.236.72:3000/api/student/submit/${submission.id}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              });

              if (response.ok) {
                Alert.alert("Removed", "Quiz attempt deleted successfully!");
                setSubmission(null);
                setSelectedAnswers({});
                setIsEditing(false);
                setAttemptStarted(false);
                fetchQuizAndSubmission();
              } else {
                const result = await response.json();
                throw new Error(result.error || "Delete failed");
              }
            } catch (error) {
              Alert.alert("Error", error.message);
            } finally {
              setSubmitting(false);
            }
          }
        }
      ]
    );
  };

    const [isDark] = useGlobalTheme();

  if (loading) {
    return (
      <View style={[styles.center, isDark && { backgroundColor: '#121212' }]}>
        <ActivityIndicator size="large" color="#4E33B3" />
      </View>
    );
  }

  if (!quiz) {
    return (
      <View style={[styles.center, isDark && { backgroundColor: '#121212' }]}>
        <Text style={[styles.errorText, isDark && { color: '#AAAAAA' }]}>Quiz not found.</Text>
      </View>
    );
  }
