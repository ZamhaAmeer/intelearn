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

  return (
    <SafeAreaView style={[styles.safeArea, isDark && { backgroundColor: '#121212' }]}>
      <View style={[styles.header, isDark && { backgroundColor: '#1E1E1E' }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={isDark ? "white" : "#1E1E64"} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDark && { color: '#FFFFFF' }]} numberOfLines={1}>Quiz Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={[styles.container, isDark && { backgroundColor: '#121212' }]} contentContainerStyle={styles.scrollContent}>
        {/* General Details Card */}
        <View style={[styles.card, isDark && { backgroundColor: '#1E1E1E', borderColor: '#2A2A2A' }]}>
          <Text style={[styles.quizTitle, isDark && { color: '#FFFFFF' }]}>{quiz.title}</Text>
          {quiz.description ? <Text style={[styles.quizDesc, isDark && { color: '#AAAAAA' }]}>{quiz.description}</Text> : null}

          <View style={styles.divider} />

          <View style={styles.metaGrid}>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="clipboard-check-outline" size={20} color="#4E33B3" />
              <View style={styles.metaTextContainer}>
                <Text style={styles.metaLabel}>Total Marks</Text>
                <Text style={styles.metaValue}>{quiz.total_marks || 'N/A'}</Text>
              </View>
            </View>

            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="flag-outline" size={20} color="#4E33B3" />
              <View style={styles.metaTextContainer}>
                <Text style={styles.metaLabel}>Passing Marks</Text>
                <Text style={styles.metaValue}>{quiz.passing_marks || 'N/A'}</Text>
              </View>
            </View>

            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="clock-outline" size={20} color="#4E33B3" />
              <View style={styles.metaTextContainer}>
                <Text style={styles.metaLabel}>Duration</Text>
                <Text style={styles.metaValue}>{quiz.duration ? `${quiz.duration} mins` : 'N/A'}</Text>
              </View>
            </View>

            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="calendar-range" size={20} color="#4E33B3" />
              <View style={styles.metaTextContainer}>
                <Text style={styles.metaLabel}>Due Date</Text>
                <Text style={styles.metaValue}>{quiz.due_date || quiz.dueDate || 'N/A'}</Text>
              </View>
            </View>
          </View>
        </View>

         {/* Questions Header */}
        <View style={styles.questionsHeader}>
          <Text style={styles.questionsTitle}>Questions ({(quiz.questions || []).length})</Text>
        </View>

{/* Questions List */}
        {(quiz.questions || []).length === 0 ? (
          <Text style={styles.noQuestionsText}>No questions in this quiz.</Text>
        ) : (
          quiz.questions.map((q, idx) => (
            <View key={q.id ? q.id.toString() : String(idx)} style={styles.questionCard}>
              <View style={styles.questionHeaderRow}>
                <Text style={styles.questionNumber}>Question {idx + 1}</Text>
              </View>
              <Text style={styles.questionText}>{q.question}</Text>

              {/* Options */}
              {q.option_a || q.option_b || q.option_c || q.option_d ? (
                <View style={styles.optionsList}>
                  {['A', 'B', 'C', 'D'].map((letter) => {
                    const optionVal = q[`option_${letter.toLowerCase()}`];
                    if (!optionVal) return null;
                    const isCorrect = String(q.correct_answer).toUpperCase() === letter;

                    return (
                      <View
                        key={letter}
                        style={[
                          styles.optionItem,
                          isCorrect && styles.optionItemCorrect
                        ]}
                      >
                        <View
                          style={[
                            styles.optionLetterCircle,
                            isCorrect && styles.optionLetterCircleCorrect
                          ]}
                        >
                          <Text
                            style={[
                              styles.optionLetterText,
                              isCorrect && styles.optionLetterTextCorrect
                            ]}
                          >
                            {letter}
                          </Text>
                        </View>
                        <Text
                          style={[
                            styles.optionValueText,
                            isCorrect && styles.optionValueTextCorrect
                          ]}
                        >
                          {optionVal}
                        </Text>
                        {isCorrect && (
                          <MaterialCommunityIcons name="check-bold" size={16} color="#10B981" style={{ marginLeft: 'auto' }} />
                        )}
                      </View>
                    );
                  })}
                </View>
              ) : (
                <View style={styles.openQuestionBlock}>
                  <Text style={styles.correctAnswerLabel}>Correct Answer:</Text>
                  <Text style={styles.correctAnswerText}>{q.correct_answer || 'N/A'}</Text>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#4E33B3',
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '600',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E1E64',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 20,
  },
  quizTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  quizDesc: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metaItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
    metaTextContainer: {
    marginLeft: 10,
  },
  metaLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginTop: 2,
  },
    questionsHeader: {
    marginBottom: 12,
  },
  questionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  noQuestionsText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 20,
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },