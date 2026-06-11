import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';
import * as DocumentPicker from 'expo-document-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CourseManagement = () => {
  const router = useRouter();
  
  // 1. Get the course ID passed from the dashboard navigation
  const { id } = useLocalSearchParams(); 

  // 2. States for fetched data and form inputs
  const [course, setCourse] = useState(null);
  const [loadingCourse, setLoadingCourse] = useState(true);
  
  const [lessonTitle, setLessonTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // 3. Separate reusable function to pull fresh course & materials data
  const fetchCourseData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'No error message provided' }));
        console.log("SERVER REJECTED REQUEST:", response.status, errorData);
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }
      
      const data = await response.json();
      setCourse(data);
    } catch (error) {
      console.error('DEBUG FETCH ERROR:', error.message);
    } finally {
      setLoadingCourse(false);
    }
  };

  useEffect(() => {
    if (id) fetchCourseData();
  }, [id]);

  // 4. Function to open phone/laptop file browser
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf', // Restrict to PDFs
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedFile(result.assets[0]);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document.');
    }
  };

  // 5. Function to upload the Title + PDF to the backend
  const handleUpload = async () => {
    if (!lessonTitle) return Alert.alert('Missing Field', 'Please enter a Chapter Title.');
    if (!selectedFile) return Alert.alert('Missing File', 'Please select a PDF file to upload.');

    setIsUploading(true);

    try {
      const token = await AsyncStorage.getItem('token');
      
      const formData = new FormData();
      formData.append('course_id', id);
      formData.append('title', lessonTitle);
      
      formData.append('file', {
        uri: selectedFile.uri,
        name: selectedFile.name,
        type: selectedFile.mimeType || 'application/pdf',
      });

      const response = await fetch(`${API_BASE_URL}/upload-material`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (response.ok) {
        Alert.alert('Success', 'Lesson material uploaded and processed by Gemini AI successfully!');
        setLessonTitle('');
        setSelectedFile(null);
        
        // 🌟 RE-FETCH: Instantly grab the new lesson list from backend to update UI live!
        fetchCourseData();
      } else {
        const errorData = await response.json();
        Alert.alert('Upload Failed', errorData.error || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Error uploading:', error);
      Alert.alert('Network Error', 'Could not connect to the server.');
    } finally {
      setIsUploading(false);
    }
  };

  if (loadingCourse) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#6044E4" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Curved Header Block Accent */}
      <View style={styles.topHeader} />

      {/* Light Sub-Header */}
      <View style={styles.subHeader}>
        <TouchableOpacity style={styles.subHeaderIcon} onPress={() => router.replace('/addnewcourse')}>
          <Icon name="arrow-back" size={24} color="#1E1E64" />
        </TouchableOpacity>
        <Text style={styles.subHeaderTitle}>Course Management</Text>
        <TouchableOpacity style={styles.subHeaderIcon}>
          <Icon name="ellipsis-vertical" size={22} color="#1E1E64" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Instructor Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Instructor</Text>
          <Text style={styles.subLabel}>Lecturer:</Text>
          <View style={styles.profileRow}>
            <Image
              source={{ 
                uri: course?.user?.gender === 'Female' 
                  ? 'https://randomuser.me/api/portraits/women/44.jpg' 
                  : 'https://randomuser.me/api/portraits/men/44.jpg' 
              }}
              style={styles.avatar}
            />
            <Text style={styles.profileName}>
              {course?.user?.full_name || 'Loading Instructor...'}
              {"\n"}
              <Text style={{ fontSize: 12, fontWeight: 'normal', color: '#718096' }}>
                {course?.user?.department || 'Information Systems'}
              </Text>
            </Text>
          </View>
        </View>

        {/* Dynamic Course Information Card */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Course Information</Text>
          <Text style={styles.cardSubLabel}>Course Title:</Text>
          <Text style={styles.courseTitleText}>
            {course?.title || 'Unknown Title'}
          </Text>
        </View>

        {/* Dynamic Course Description */}
        <View style={styles.sectionContainer}>
          <Text style={styles.descriptionLabel}>Course Description:</Text>
          <Text style={styles.descriptionText}>
            {course?.description || 'No description provided.'}
          </Text>
        </View>

        <View style={styles.dividerLine} />

        {/* --- ADD NEW LESSON INTERFACE --- */}
        <View style={styles.sectionContainer}>
          <Text style={styles.panelTitleHeader}>Add Course Material</Text>
          <Text style={styles.descriptionLabel}>Chapter / Lesson Title:</Text>
          <TextInput 
            style={styles.textInput}
            placeholder="e.g., Lesson 1: Introduction to SQL"
            placeholderTextColor="#8A92BA"
            value={lessonTitle}
            onChangeText={setLessonTitle}
          />
        </View>

        {/* File Upload Box */}
        <TouchableOpacity style={styles.uploadBox} onPress={pickDocument}>
          <View style={styles.uploadIconContainer}>
             <MaterialCommunityIcons 
               name={selectedFile ? "file-document-outline" : "file-upload-outline"} 
               size={40} 
               color="#6044E4" 
             />
          </View>
          {selectedFile ? (
            <>
              <Text style={styles.uploadMainText} numberOfLines={1}>{selectedFile.name}</Text>
              <Text style={styles.uploadSubtext}>Tap to change file</Text>
            </>
          ) : (
            <>
              <Text style={styles.uploadMainText}>Tap to Select PDF File</Text>
              <Text style={styles.uploadSubtext}>Max 10MB</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Add File Button */}
        <TouchableOpacity 
          style={[styles.primaryButton, isUploading && styles.disabledButton]} 
          onPress={handleUpload}
          disabled={isUploading}
        >
          {isUploading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.primaryButtonText}>Upload & Process Lesson</Text>
          )}
        </TouchableOpacity>

        <View style={styles.dividerLine} />

        {/* 🌟 NEW: LIVE UPLOADED CHAPTERS LIST SECTION 🌟 */}
        <View style={styles.lessonsContainer}>
          <View style={styles.lessonsHeaderRow}>
            <Text style={styles.panelTitleHeader}>Course Modules</Text>
            <View style={styles.moduleCountBadge}>
              <Text style={styles.moduleCountText}>
                {course?.materials ? course.materials.length : 0} Chapters
              </Text>
            </View>
          </View>

          {course?.materials && course.materials.length > 0 ? (
            course.materials.map((material, index) => (
              <View key={material.id.toString()} style={styles.liveLessonCard}>
                <View style={styles.liveLessonLeft}>
                  <View style={styles.indexCircle}>
                    <Text style={styles.indexCircleText}>{index + 1}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.liveLessonTitle} numberOfLines={1}>
                      {material.title}
                    </Text>
                    <Text style={styles.liveLessonSubtext} numberOfLines={1}>
                      {material.material_url.split('/').pop()}
                    </Text>
                  </View>
                </View>
                <View style={styles.statusCheckedContainer}>
                  <Icon name="checkmark-circle" size={22} color="#10B981" />
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyLessonsContainer}>
              <MaterialCommunityIcons name="folder-open-outline" size={44} color="#A0AEC0" />
              <Text style={styles.emptyLessonsText}>No lessons uploaded yet for this module.</Text>
            </View>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FCFCF5' },
  topHeader: {
    backgroundColor: '#6044E4', height: 120, borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15, marginTop: -60,
  },
  subHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 15, paddingVertical: 15, backgroundColor: '#F8F8F8',
  },
  subHeaderIcon: { padding: 5 },
  subHeaderTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E1E64' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 15, paddingBottom: 60 },
  sectionContainer: { marginBottom: 15 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E1E64', marginBottom: 10 },
  subLabel: { fontSize: 14, fontWeight: '600', color: '#1E1E64', marginBottom: 10 },
  profileRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  profileName: { fontSize: 16, fontWeight: 'bold', color: '#333', lineHeight: 22 },
  infoCard: {
    backgroundColor: '#FFF', borderRadius: 12, padding: 20, marginBottom: 15,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05,
    shadowRadius: 5, elevation: 2,
  },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#1E1E64', marginBottom: 12 },
  cardSubLabel: { fontSize: 13, fontWeight: '600', color: '#1E1E64', marginBottom: 5 },
  courseTitleText: { fontSize: 16, fontWeight: 'bold', color: '#4A5568', lineHeight: 24 },
  descriptionLabel: { fontSize: 14, fontWeight: 'bold', color: '#1E1E64', marginBottom: 8 },
  descriptionText: { fontSize: 15, color: '#3A4B5C', lineHeight: 24, fontWeight: '600' },
  panelTitleHeader: { fontSize: 18, fontWeight: '800', color: '#1E1E64', marginBottom: 15 },
  textInput: {
    backgroundColor: '#FFF', borderWidth: 1, borderColor: '#D3D9E5',
    borderRadius: 12, paddingHorizontal: 15, paddingVertical: 15,
    fontSize: 15, color: '#333'
  },
  uploadBox: {
    backgroundColor: '#F3F4F9', borderWidth: 1.5, borderColor: '#6044E4',
    borderStyle: 'dashed', borderRadius: 20, paddingVertical: 35,
    alignItems: 'center', marginBottom: 20, marginTop: 10, paddingHorizontal: 20
  },
  uploadIconContainer: { marginBottom: 10 },
  uploadMainText: { fontSize: 16, fontWeight: 'bold', color: '#312E4A', marginBottom: 5, textAlign: 'center' },
  uploadSubtext: { fontSize: 13, color: '#718096' },
  primaryButton: { backgroundColor: '#6044E4', borderRadius: 25, paddingVertical: 16, alignItems: 'center' },
  disabledButton: { backgroundColor: '#A496E3' },
  primaryButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  dividerLine: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 25 },
  
  // 🌟 NEW LIVE LESSON LIST OBJECT STYLES
  lessonsContainer: { marginBottom: 20 },
  lessonsHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  moduleCountBadge: { backgroundColor: '#EBF8FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  moduleCountText: { color: '#2B6CB0', fontSize: 12, fontWeight: 'bold' },
  liveLessonCard: {
    flexDirection: 'row', backgroundColor: '#FFF', padding: 15, borderRadius: 16,
    alignItems: 'center', justifyContent: 'space-between', marginBottom: 12,
    borderWidth: 1, borderColor: '#EDF2F7', elevation: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2,
  },
  liveLessonLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 10 },
  indexCircle: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#F0EDFF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  indexCircleText: { color: '#6044E4', fontWeight: 'bold', fontSize: 14 },
  liveLessonTitle: { fontSize: 15, fontWeight: '700', color: '#2D3748', marginBottom: 2 },
  liveLessonSubtext: { fontSize: 12, color: '#718096', fontWeight: '500' },
  statusCheckedContainer: { paddingLeft: 5 },
  emptyLessonsContainer: { alignItems: 'center', paddingVertical: 35, backgroundColor: '#F7FAFC', borderRadius: 16, borderWidth: 1, borderColor: '#EDF2F7', borderStyle: 'dashed' },
  emptyLessonsText: { color: '#718096', fontSize: 14, marginTop: 8, fontWeight: '500' }
});

export default CourseManagement;