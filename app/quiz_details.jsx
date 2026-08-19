import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useGlobalTheme } from './themeStore';

export default function QuizDetailsScreen() {
  const router = useRouter();
  const [isDark] = useGlobalTheme();
  const { id } = useLocalSearchParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizDetails = async () => {
      if (!id) return;
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`http://172.22.236.72:3000/api/student/quizzes/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          const data = await response.json();
          setQuiz(data);
        } else {
          Alert.alert('Error', 'Failed to retrieve quiz details.');
        }
      } catch (err) {
        console.error("Error fetching quiz details:", err);
        Alert.alert('Error', 'Connection to server failed.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuizDetails();
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, isDark && { backgroundColor: '#121212' }]}>
        <ActivityIndicator size="large" color="#4E33B3" />
        <Text style={styles.loadingText}>Syncing Quiz Details...</Text>
      </View>
    );
  }

  if (!quiz) {
    return (
      <View style={[styles.loadingContainer, isDark && { backgroundColor: '#121212' }]}>
        <Text style={[styles.errorText, isDark && { color: '#AAAAAA' }]}>Quiz not found.</Text>
      </View>
    );
  }
