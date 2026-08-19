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
