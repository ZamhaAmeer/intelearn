import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SubmissionScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#4B2CBA" />
      
      {/* Top Purple Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity>
          <Feather name="menu" size={24} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Feather name="bell" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Sub Header (White) */}
      <View style={styles.subHeader}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/courseDetails')}>
          <Feather name="arrow-left" size={24} color="#0B1E4A" />
        </TouchableOpacity>
        <Text style={styles.subHeaderText}>IS4106: Quiz 01 Submission</Text>
        <TouchableOpacity>
          <Feather name="more-vertical" size={24} color="#0B1E4A" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Main Status Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Submission status</Text>

          {/* Submission Status */}
          <View style={styles.section}>
            <Text style={styles.label}>SUBMISSION STATUS</Text>
            <View style={styles.successBadge}>
              <MaterialCommunityIcons name="check-circle" size={18} color="#186A58" style={styles.badgeIcon} />
              <Text style={styles.successBadgeText}>Submitted for grading</Text>
            </View>
          </View>

          {/* Grading Status */}
          <View style={styles.section}>
            <Text style={styles.label}>GRADING STATUS</Text>
            <Text style={styles.valueText}>Not graded</Text>
          </View>

          {/* Time Remaining */}
          <View style={styles.section}>
            <Text style={styles.label}>TIME REMAINING</Text>
            <View style={styles.infoBadge}>
              <Text style={styles.infoBadgeText}>
                Assignment was submitted 11 mins 55 secs early
              </Text>
            </View>
          </View>

          {/* Last Modified */}
          <View style={styles.section}>
            <Text style={styles.label}>LAST MODIFIED</Text>
            <Text style={styles.valueText}>Monday, 9 March 2026, 12:03 PM</Text>
          </View>

          {/* File Submissions */}
          <View style={styles.section}>
            <Text style={styles.label}>FILE SUBMISSIONS</Text>
            <View style={styles.fileContainer}>
              <View style={styles.pdfIconWrapper}>
                <MaterialCommunityIcons name="file-pdf-box" size={28} color="#D32F2F" />
              </View>
              <View style={styles.fileDetails}>
                <Text style={styles.fileName}>22FIS0111.pdf</Text>
                <Text style={styles.fileDate}>9 March 2026, 12:03 PM</Text>
              </View>
              <TouchableOpacity>
                <Feather name="download" size={20} color="#0B1E4A" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Submission Comments */}
          <View style={[styles.section, styles.noBottomMargin]}>
            <View style={styles.commentsRow}>
              <Text style={styles.label}>SUBMISSION{"\n"}COMMENTS</Text>
              <View style={styles.commentsRight}>
                <View style={styles.commentBadge}>
                  <Text style={styles.commentBadgeText}>0</Text>
                </View>
                <Text style={styles.commentsText}>Comments{"\n"}(0)</Text>
                <Feather name="chevron-down" size={20} color="#0B1E4A" />
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.editButton}>
            <Feather name="edit-2" size={16} color="#FFF" />
            <Text style={styles.editButtonText}>Edit Submission</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.removeButton}>
            <Feather name="trash-2" size={16} color="#4A4A4A" />
            <Text style={styles.removeButtonText}>Remove Submission</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FCFDF8', // Light cream background
  },
  topHeader: {
    backgroundColor: '#4B2CBA',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 35,
    paddingVertical: 15,
    marginTop: -60,
  },
  subHeader: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    marginRight: 15,
  },
  subHeaderText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#3A158D',
  },
  scrollContainer: {
    padding: 15,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#F5F6FA', // Light greyish-blue card bg
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0B1E4A',
    marginBottom: 25,
  },
  section: {
    marginBottom: 25,
  },
  noBottomMargin: {
    marginBottom: 0,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6C757D',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  valueText: {
    fontSize: 15,
    color: '#0B1E4A',
  },
  successBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#B5EAE0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#186A58',
  },
  badgeIcon: {
    marginRight: 8,
  },
  successBadgeText: {
    color: '#186A58',
    fontWeight: '500',
    fontSize: 14,
  },
  infoBadge: {
    backgroundColor: '#B5EAE0',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#186A58',
  },
  infoBadgeText: {
    color: '#186A58',
    fontSize: 14,
    fontWeight: '400',
  },
  fileContainer: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pdfIconWrapper: {
    backgroundColor: '#FDECEC',
    padding: 10,
    borderRadius: 8,
    marginRight: 15,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0B1E4A',
    marginBottom: 4,
  },
  fileDate: {
    fontSize: 12,
    color: '#6C757D',
  },
  commentsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 20,
  },
  commentsRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentBadge: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 10,
  },
  commentBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4A4A4A',
  },
  commentsText: {
    fontSize: 14,
    color: '#0B1E4A',
    fontWeight: '500',
    marginRight: 10,
    textAlign: 'center',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    backgroundColor: '#4B2CBA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 25,
    borderRadius: 25,
    flex: 0.48,
  },
  editButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 8,
  },
  removeButton: {
    backgroundColor: '#EAEBEF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 25,
    flex: 0.48,
  },
  removeButtonText: {
    color: '#4A4A4A',
    fontWeight: '500',
    fontSize: 14,
    marginLeft: 8,
  },
});