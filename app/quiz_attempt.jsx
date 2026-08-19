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

  const renderOption = (qId, keyName, optionText, editable = true) => {
    const isSelected = selectedAnswers[qId] === keyName;
    return (
      <TouchableOpacity
        key={keyName}
        style={[
          styles.optionRow,
          isDark && { backgroundColor: '#2A2A2A', borderColor: '#333' },
          isSelected && styles.optionRowSelected,
          !editable && styles.optionRowReadOnly
        ]}
        onPress={() => editable && selectOption(qId, keyName)}
        disabled={!editable}
      >
        <View style={[styles.radioButton, isSelected && styles.radioButtonSelected]}>
          {isSelected && <View style={styles.radioInner} />}
        </View>
        <Text style={[styles.optionText, isDark && { color: '#FFFFFF' }, isSelected && styles.optionTextSelected]}>
          <Text style={{ fontWeight: 'bold' }}>{keyName.toUpperCase()}: </Text>
          {optionText}
        </Text>
      </TouchableOpacity>
    );
  };

    return (
    <SafeAreaView style={[styles.container, isDark && { backgroundColor: '#121212' }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Header Bar */}
      <View style={[styles.header, isDark && { backgroundColor: '#1E1E1E', borderBottomColor: '#2A2A2A' }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="arrow-left" size={24} color={isDark ? "#FFFFFF" : "#1E1B4B"} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDark && { color: '#FFFFFF' }]} numberOfLines={1}>{quiz.title}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Quiz General Information Card */}
        <View style={[styles.infoCard, isDark && { backgroundColor: '#1E1E1E', borderColor: '#2A2A2A' }]}>
          <View style={styles.infoRow}>
            <View style={styles.iconCircle}>
              <Icon name="clipboard-text-outline" size={24} color="#3B82F6" />
            </View>
            <View style={styles.infoDetails}>
              <Text style={[styles.assignTitle, isDark && { color: '#FFFFFF' }]}>{quiz.title}</Text>
              <Text style={[styles.assignCode, isDark && { color: '#AAAAAA' }]}>Course Quiz</Text>
            </View>
          </View>
          <View style={styles.divider} />

          <Text style={styles.descriptionLabel}>Quiz Instructions:</Text>
          <Text style={styles.description}>{quiz.description || "No specific instructions provided."}</Text>

          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{quiz.questions ? quiz.questions.length : 0} Questions</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{quiz.duration || 30} Mins Limit</Text>
            </View>
          </View>
        </View>

        {/* Quiz Attempt / Submission Logic */}
        {submission && !isEditing ? (
          /* Finished State (Show score & previous selections) */
          <View style={styles.submissionCard}>
            <View style={styles.scoreHeaderRow}>
              <View>
                <Text style={styles.completedLabel}>Quiz Completed</Text>
                <Text style={styles.submittedDateText}>
                  Submitted on: {new Date(submission.submission_date).toLocaleString()}
                </Text>
              </View>
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreValue}>{submission.score}%</Text>
                <Text style={styles.scoreLabel}>Score</Text>
              </View>
            </View>

            <View style={styles.divider} />
            <Text style={styles.sectionHeaderTitle}>Review Your Choices:</Text>

            {quiz.questions && quiz.questions.map((q, idx) => (
              <View key={q.id} style={styles.questionReviewBlock}>
                <Text style={styles.questionText}>
                  {idx + 1}. {q.question}
                </Text>
                <View style={{ marginTop: 8 }}>
                  {renderOption(q.id, 'A', q.option_a, false)}
                  {renderOption(q.id, 'B', q.option_b, false)}
                  {renderOption(q.id, 'C', q.option_c, false)}
                  {renderOption(q.id, 'D', q.option_d, false)}
                </View>
              </View>
            ))}

            <View style={styles.actionButtonsRow}>
              <TouchableOpacity
                style={styles.editBtnOption}
                onPress={() => setIsEditing(true)}
              >
                <Icon name="pencil" size={18} color="white" style={{ marginRight: 6 }} />
                <Text style={styles.editBtnOptionText}>Re-Attempt</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.removeBtnOption}
                onPress={handleRemoveSubmission}
              >
                <Icon name="trash-can" size={18} color="white" style={{ marginRight: 6 }} />
                <Text style={styles.removeBtnOptionText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* Incomplete Attempt / Editing Attempt Mode */
          <View style={styles.submissionCard}>
            {!attemptStarted && !isEditing ? (
              /* Pre-start Screen */
              <View style={{ alignItems: 'center', paddingVertical: 20 }}>
                <Icon name="clock-outline" size={50} color="#4E33B3" style={{ marginBottom: 12 }} />
                <Text style={styles.readyText}>Are you ready to start this quiz?</Text>
                <Text style={styles.readySubText}>
                  Once you start, please answer all questions and submit your attempt.
                </Text>
                <TouchableOpacity
                  style={styles.startAttemptBtn}
                  onPress={() => setAttemptStarted(true)}
                >
                  <Text style={styles.startAttemptBtnText}>Start Attempt Now</Text>
                </TouchableOpacity>
              </View>
            ) : (
              /* Attempt Questions Screen */
              <View>
                <Text style={styles.formLabel}>
                  {isEditing ? "Modify Your Attempt:" : "Answer the Questions:"}
                </Text>

                {quiz.questions && quiz.questions.map((q, idx) => (
                  <View key={q.id} style={styles.questionBlock}>
                    <Text style={styles.questionText}>
                      {idx + 1}. {q.question}
                    </Text>
                    <View style={{ marginTop: 8 }}>
                      {renderOption(q.id, 'A', q.option_a, true)}
                      {renderOption(q.id, 'B', q.option_b, true)}
                      {renderOption(q.id, 'C', q.option_c, true)}
                      {renderOption(q.id, 'D', q.option_d, true)}
                    </View>
                  </View>
                ))}

                {isEditing ? (
                  <View style={styles.actionButtonsRow}>
                    <TouchableOpacity
                      style={styles.submitBtn}
                      onPress={handleEditUpdate}
                      disabled={submitting}
                    >
                      {submitting ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        <>
                          <Icon name="cloud-upload" size={20} color="white" style={{ marginRight: 8 }} />
                          <Text style={styles.submitBtnText}>Update Attempt</Text>
                        </>
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.cancelBtn}
                      onPress={() => {
                        setIsEditing(false);
                        setSelectedAnswers(submission.answers || {});
                      }}
                    >
                      <Text style={styles.cancelBtnText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.submitBtn}
                    onPress={handleSubmit}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <>
                        <Icon name="checkbox-marked-circle-outline" size={20} color="white" style={{ marginRight: 8 }} />
                        <Text style={styles.submitBtnText}>Submit Quiz</Text>
                      </>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFDF0',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEFDF0',
  },
  errorText: {
    fontSize: 16,
    color: '#D1D5DB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 60,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#EDEBE6',
    elevation: 2,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E1B4B',
    flex: 1,
    textAlign: 'center',
  },
  scrollContent: {
    padding: 16,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E6DFD3',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#EBF3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  infoDetails: {
    flex: 1,
  },
  assignTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E1B4B',
  },
  assignCode: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
    marginTop: 2,
  },
