import { router } from 'expo-router';
import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CourseManagement = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Dark Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity>
          <Icon name="menu" size={28} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="notifications-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Light Sub-Header */}
      <View style={styles.subHeader}>
        <TouchableOpacity style={styles.subHeaderIcon} onPress={() => router.push('/addNewCourse')}>
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
              source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }} // Placeholder image
              style={styles.avatar}
            />
            <Text style={styles.profileName}>Dr. Amali{"\n"}Perera</Text>
          </View>
        </View>

        {/* Course Information Card */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Course Information</Text>
          <Text style={styles.cardSubLabel}>Course Title:</Text>
          <Text style={styles.courseTitleText}>
            Advanced Software Architecture{"\n"}(IS4106)
          </Text>
        </View>

        {/* Course Description */}
        <View style={styles.sectionContainer}>
          <Text style={styles.descriptionLabel}>Course Description:</Text>
          <Text style={styles.descriptionText}>
            This course covers advanced principles and practices of software architecture
            for designing complex and scalable systems. It focuses on architectural
            patterns, system design, and key quality attributes such as performance,
            reliability, and maintainability. Students learn how to make effective
            architectural decisions and apply modern approaches like distributed and
            cloud-based systems.
          </Text>
        </View>

        {/* File Upload Box */}
        <TouchableOpacity style={styles.uploadBox}>
          <View style={styles.uploadIconContainer}>
             <MaterialCommunityIcons name="file-upload-outline" size={40} color="#8A92BA" />
          </View>
          <Text style={styles.uploadMainText}>Tap or Drag & Drop File</Text>
          <Text style={styles.uploadSubText}>PDF, DOCX, or ZIP (Max 25MB)</Text>
        </TouchableOpacity>

        {/* Add File Button */}
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Add File</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FCFCF5', // Cream background
  },
  topHeader: {
    backgroundColor: '#6044E4', // Deep purple
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 50,
    paddingBottom: 25,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    marginTop: -60,
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#F8F8F8', // Very light gray to distinguish from cream body
  },
  subHeaderIcon: {
    padding: 5,
  },
  subHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E1E64', // Deep navy/purple text
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 40,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E1E64',
    marginBottom: 10,
  },
  subLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E1E64',
    marginBottom: 10,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 22,
  },
  infoCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2, // For Android shadow
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1E1E64',
    marginBottom: 12,
  },
  cardSubLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E1E64',
    marginBottom: 5,
  },
  courseTitleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A5568',
    lineHeight: 24,
  },
  descriptionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E1E64',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 15,
    color: '#3A4B5C',
    lineHeight: 24,
    fontWeight: '600',
  },
  uploadBox: {
    borderWidth: 1.5,
    borderColor: '#BCC5D3',
    borderStyle: 'dashed',
    borderRadius: 20,
    paddingVertical: 35,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  uploadIconContainer: {
    marginBottom: 10,
  },
  uploadMainText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#312E4A',
    marginBottom: 5,
  },
  uploadSubText: {
    fontSize: 13,
    color: '#718096',
  },
  primaryButton: {
    backgroundColor: '#6044E4', // Primary purple action button
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CourseManagement;