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

