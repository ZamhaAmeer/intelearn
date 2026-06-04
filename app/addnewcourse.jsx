import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const AddNewCourse = () => {
  const router = useRouter();
  const [courseName, setCourseName] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [selectedSem, setSelectedSem] = useState('2nd');
  const [publishImmediately, setPublishImmediately] = useState(true);


  const semesters = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];

  const data = [
    { label: '2023/24', value: '2023/24' },
    { label: '2022/23', value: '2022/23' },
    { label: '2021/22', value: '2021/22' },
    { label: '2020/21', value: '2020/21' },
  ];

  const SectionLabel = ({ title, required }) => (
    <View style={styles.sectionLabelContainer}>
      <View style={styles.labelLeft}>
        <View style={styles.purpleDot} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {required && <Text style={styles.requiredText}>REQUIRED</Text>}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Curved Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerCurve}>
          <TouchableOpacity style={styles.menuIcon}>
            <Icon name="menu" size={32} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add New Course</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Upload Thumbnail */}
        <TouchableOpacity style={styles.uploadContainer}>
          <View style={styles.uploadIconWrapper}>
            <FeatherIcon name="image" size={24} color="#6044E4" />
          </View>
          <Text style={styles.uploadText}>Upload Course Thumbnail</Text>
          <Text style={styles.uploadSubtext}>RECOMMENDED 1200X800PX</Text>
        </TouchableOpacity>

        {/* Course Name */}
        <SectionLabel title="Course Name" required={undefined} />
        <TextInput
          style={styles.textInput}
          placeholder="e.g. Advanced Data Structures"
          placeholderTextColor="#BDBDBD"
          value={courseName}
          onChangeText={setCourseName}
        />

        {/* Course Description */}
        <SectionLabel title="Course Description" required={undefined} />
        <TextInput
          style={[styles.textInput, styles.textArea]}
          placeholder="e.g. This course covers advanced..."
          placeholderTextColor="#BDBDBD"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={courseDesc}
          onChangeText={setCourseDesc}
        />

        {/* Semester Selection */}
        <SectionLabel title="Semester" required />
        <View style={styles.semesterContainer}>
          {semesters.map((sem) => {
            const isSelected = selectedSem === sem;
            return (
              <TouchableOpacity
                key={sem}
                style={[
                  styles.semesterChip,
                  isSelected && styles.semesterChipSelected,
                ]}
                onPress={() => setSelectedSem(sem)}
              >
                <Text style={[styles.semTextMain, isSelected && styles.semTextSelected]}>
                  {sem}
                </Text>
                <Text style={[styles.semTextSub, isSelected && styles.semTextSelected]}>
                  SEM
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Academic Year */}
        <SectionLabel title="Academic Year" />
        <TouchableOpacity style={styles.dropdownInput}>
          <Text style={styles.dropdownText}>2024/25</Text>
          <FeatherIcon name="chevron-down" size={20} color="#333" />
        </TouchableOpacity>

        {/* Visibility */}
        <SectionLabel title="Visibility" />
        <View style={styles.visibilityContainer}>
          <Text style={styles.visibilityText}>Publish Immediately</Text>
          <Switch
            trackColor={{ false: '#D3D3D3', true: '#B7A6F6' }}
            thumbColor={publishImmediately ? '#6044E4' : '#f4f3f4'}
            onValueChange={setPublishImmediately}
            value={publishImmediately}
          />
        </View>

        
        <View style={{ height: 100 }} /> 
      </ScrollView>

      
      <View style={styles.footerBar}>
        <TouchableOpacity style={styles.footerAction}>
          <FeatherIcon name="x" size={24} color="#555" />
          <Text style={styles.footerActionText}>Discard</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/lecturercoursemanagement')}>
          <View style={styles.primaryButtonContent}>
            <Text style={styles.primaryButtonText}>Create{"\n"}Course</Text>
            <FeatherIcon name="send" size={20} color="#FFF" style={{ marginLeft: 8 }} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerAction}>
          <FeatherIcon name="edit-2" size={20} color="#555" />
          <Text style={styles.footerActionText}>Save{"\n"}Draft</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FCFCF5', 
  },
  headerContainer: {
    backgroundColor: '#FCFCF5',
    overflow: 'hidden',
    paddingBottom: 20, 
    marginTop: -60, 
  },
  headerCurve: {
    backgroundColor: '#6044E4', 
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    height: 120,
    paddingTop: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
  },
  menuIcon: {
    position: 'absolute',
    left: 20,
    top: 55,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  uploadContainer: {
    backgroundColor: '#EAE6F9',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#D0C6F5',
    borderStyle: 'dashed',
    paddingVertical: 30,
    alignItems: 'center',
    marginBottom: 25,
  },
  uploadIconWrapper: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 50,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  uploadText: {
    color: '#6044E4',
    fontSize: 16,
    fontWeight: '600',
  },
  uploadSubtext: {
    color: '#8A8A8A',
    fontSize: 12,
    marginTop: 4,
  },
  sectionLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 5,
  },
  labelLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  purpleDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6044E4',
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  requiredText: {
    color: '#6044E4',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  textInput: {
    backgroundColor: '#F4F7E6', 
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  textArea: {
    height: 100,
  },
  semesterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  semesterChip: {
    backgroundColor: '#E6EEDA',
    width: (width - 70) / 4, 
    aspectRatio: 1,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  semesterChipSelected: {
    backgroundColor: '#BCA4FF',
  },
  semTextMain: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A4A4A',
  },
  semTextSub: {
    fontSize: 10,
    color: '#6B6B6B',
  },
  semTextSelected: {
    color: '#6044E4', 
  },
  dropdownInput: {
    flexDirection: 'row',
    backgroundColor: '#F4F7E6',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  visibilityContainer: {
    flexDirection: 'row',
    backgroundColor: '#F4F7E6',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  visibilityText: {
    fontSize: 16,
    color: '#333',
  },
  footerBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 15,
    paddingBottom: 25, // safe area padding
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  footerAction: {
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  footerActionText: {
    fontSize: 12,
    color: '#555',
    marginTop: 4,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#6044E4',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: -15, // Pop-out effect
  },
  primaryButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default AddNewCourse;