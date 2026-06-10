import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const ThemeToggle = ({ isDark, onToggle }) => (
  <Switch value={isDark} onValueChange={onToggle} trackColor={{ false: "#767577", true: "#5C45C3" }} />
);

const MenuOption = ({ iconName, title, active, onPress }) => (
  <TouchableOpacity style={[styles.menuOption, active && styles.activeMenuOption]} onPress={onPress}>
    <MaterialCommunityIcons name={iconName} size={24} color={active ? '#5C45C3' : '#666'} />
    <Text style={[styles.menuOptionText, active && styles.activeMenuOptionText]}>{title}</Text>
  </TouchableOpacity>
);
// 🌟 PRE-DEFINED INFORMATION SYSTEMS CURRICULUM DATA MAP FOR AUTOFILL
const CURRICULUM_MAP = {
  // --- SEMESTER I ---
  'IS1101': { name: 'Fundamentals of IS', tags: 'Digital Transformation • Business Process', sem: '1st' },
  'IS1102': { name: 'Structured Programming(T)', tags: 'C Syntax • Logic & Control', sem: '1st' },
  'IS1103': { name: 'Structured Programming(P)', tags: 'Compilation • Data Structures', sem: '1st' },
  'IS1104': { name: 'Theories of IS', tags: 'Organizational Behavior • Frameworks', sem: '1st' },
  'IS1105': { name: 'Computer System Organization', tags: 'CPU Architecture • Memory Hierarchy', sem: '1st' },
  'IS1106': { name: 'Foundations of Web Technologies', tags: 'HTML • CSS • Client-Side', sem: '1st' },
  'IS1107': { name: 'Personal Productivity with IT', tags: 'Tools • Documentation • Efficiency', sem: '1st' },
  'IS1108': { name: 'Fundamentals of Mathematics', tags: 'Algebra • Logic • Matrices', sem: '1st' },
  'IS1109': { name: 'Statistics & Probability Theory', tags: 'Data • Inference • Analysis', sem: '1st' },
  'IS1110': { name: 'Communication Skills I', tags: 'Written • Verbal • Professional', sem: '1st' },
  'IS1111': { name: 'Academic Integrity', tags: 'Ethics • Plagiarism • Research', sem: '1st' },
  'IS-EGP-1101': { name: 'General English I', tags: 'Grammar • Comprehension • Vocabulary', sem: '1st' },

  // --- SEMESTER II ---
  'IS2101': { name: 'Object Oriented Programming', tags: 'Classes • Inheritance • Polymorphism', sem: '2nd' },
  'IS2102': { name: 'Object Oriented Programming Practicum', tags: 'Java • IDE • Real-world coding', sem: '2nd' },
  'IS2103': { name: 'Emerging IS Technologies', tags: 'Cloud • DevOps • Blockchain', sem: '2nd' },
  'IS2104': { name: 'Database Systems', tags: 'SQL • ER Modeling • Normalization', sem: '2nd' },
  'IS2105': { name: 'Database Management Systems Practicum', tags: 'Queries • Joins • Implementation', sem: '2nd' },
  'IS2106': { name: 'System Analysis & Design', tags: 'SDLC • UML • Planning', sem: '2nd' },
  'IS2107': { name: 'Social & Professional Issues', tags: 'Ethics • Law • Intellectual Property', sem: '2nd' },
  'IS2108': { name: 'Human Computer Interaction', tags: 'UI/UX • Usability • Design', sem: '2nd' },
  'IS2109': { name: 'Information Assurance & Security', tags: 'CIA Triad • Encryption • Threats', sem: '2nd' },
  'IS2110': { name: 'Software Project Initiation & Planning', tags: 'Project Charter • WBS • Scoping', sem: '2nd' },
  'IS2111': { name: 'Advanced Mathematics', tags: 'Calculus • Graph Theory', sem: '2nd' },
  'IS2112': { name: 'Communication Skills II', tags: 'Presentations • Reports • Memos', sem: '2nd' },
  'IS-EGP-1201': { name: 'General English II', tags: 'Business Comm • Advanced Grammar', sem: '2nd' },

  // --- SEMESTER III ---
  'IS3101': { name: 'Object Oriented Analysis & Design', tags: 'UML Modeling • Design Patterns', sem: '3rd' },
  'IS3102': { name: 'Data Structures & Algorithms', tags: 'Trees • Graphs • Sorting', sem: '3rd' },
  'IS3103': { name: 'IT Governance', tags: 'COBIT • Compliance • Frameworks', sem: '3rd' },
  'IS3104': { name: 'Software Engineering', tags: 'Lifecycles • Requirements • Testing', sem: '3rd' },
  'IS3105': { name: 'IS Risk Management', tags: 'Assessment • Mitigation • Strategy', sem: '3rd' },
  'IS3106': { name: 'IS Sustainability', tags: 'Green IT • Lifecycle • Environmental', sem: '3rd' },
  'IS3107': { name: 'Management Information Systems', tags: 'Enterprise • CRM • SCM', sem: '3rd' },
  'IS3108': { name: 'E-Business', tags: 'E-commerce • Strategy • Infrastructure', sem: '3rd' },
  'IS3109': { name: 'Digital Innovation', tags: 'Transformation • Disruptive Tech', sem: '3rd' },
  'IS-EAP-2101': { name: 'Academic English I', tags: 'Research Writing • Comprehension', sem: '3rd' },

  // --- SEMESTER IV ---
  'IS4101': { name: 'IT Auditing', tags: 'Compliance • Controls • Frameworks', sem: '4th' },
  'IS4102': { name: 'Web Application Development', tags: 'Full-stack • PHP • Frameworks', sem: '4th' },
  'IS4103': { name: 'Operating Systems', tags: 'Processes • Memory • Concurrency', sem: '4th' },
  'IS4104': { name: 'System Administration and Maintenance', tags: 'Linux • Scripts • Infrastructure', sem: '4th' },
  'IS4105': { name: 'IT Procurement Management', tags: 'Contracts • Tenders • Sourcing', sem: '4th' },
  'IS4106': { name: 'Software Architecture', tags: 'Patterns • Microservices • Design', sem: '4th' },
  'IS4107': { name: 'Professionalism & Ethics in Computing', tags: 'Code of Conduct • Ethics', sem: '4th' },
  'IS4108': { name: 'IS Strategies', tags: 'Alignment • Business Goals • Planning', sem: '4th' },
  'IS4109': { name: 'Agile Software Development', tags: 'Scrum • Kanban • Sprints', sem: '4th' },
  'IS4110': { name: 'Capstone Project', tags: 'Implementation • Problem Solving', sem: '4th' },
  'IS-EAP-2201': { name: 'Academic English II', tags: 'Presentation • Professional Writing', sem: '4th' },
};

const AddNewCourse = () => {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState(''); 
  const [courseTags, setCourseTags] = useState(''); 
  const [courseDesc, setCourseDesc] = useState('');
  const [selectedSem, setSelectedSem] = useState('1st'); 
  const [publishImmediately, setPublishImmediately] = useState(true);
  
  const [academicYear, setAcademicYear] = useState('2024/25');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const academicYearsList = ['2023/24', '2024/25', '2025/26', '2026/27'];

  const [thumbnail, setThumbnail] = useState(null);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const toggleMenu = () => setMenuVisible(!isMenuVisible);

  const semesters = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];

  // 🌟 EFFECT HOOK: Watch courseCode changes and handle layout auto-completion
  useEffect(() => {
    const formattedCode = courseCode.trim().toUpperCase();
    if (CURRICULUM_MAP[formattedCode]) {
      const match = CURRICULUM_MAP[formattedCode];
      setCourseName(match.name);
      setCourseTags(match.tags);
      setSelectedSem(match.sem);
    }
  }, [courseCode]);

  const pickImage = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setThumbnail(result.assets[0].uri);
    }
  };

  const handleCreateCourse = async () => {
    if (!courseName || !courseCode || !selectedSem) {
      alert("Please fill in all the required fields (Course Name, Code, and Semester).");
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        alert("Authentication error. Please log in again.");
        return;
      }

      const formData = new FormData();
      formData.append('title', courseName);
      formData.append('code', courseCode.trim().toUpperCase()); 
      formData.append('tags', courseTags); 
      formData.append('description', courseDesc);
      formData.append('semester', `${selectedSem} Sem`); 
      formData.append('academic_year', academicYear);
      formData.append('is_published', publishImmediately);
      
      if (thumbnail) {
        const filename = thumbnail.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;
        
        formData.append('thumbnail', {
          uri: thumbnail,
          name: filename,
          type: type
        });
      }

      const response = await fetch(`http://172.20.10.3:3000/courses`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (response.ok) {
        const newCourse = await response.json(); 
        router.push({ 
          pathname: '/lecturercoursemanagement', 
          params: { id: newCourse.id } 
        }); 
      } else {
        const errorData = await response.json();
        alert(`Failed to create course: ${errorData.error || "Unknown server error"}`);
      }
    } catch (error) {
      console.error("Error creating course:", error);
      alert("Network error. Could not reach the server.");
    }
  };

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
      <View style={styles.headerContainer}>
        <View style={styles.headerCurve}>
          <TouchableOpacity style={styles.menuIcon} onPress={toggleMenu}>
            <Icon name="menu" size={32} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add New Course</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.uploadContainer} onPress={pickImage}>
          {thumbnail ? (
            <Image source={{ uri: thumbnail }} style={styles.previewImage} />
          ) : (
            <>
              <View style={styles.uploadIconWrapper}>
                <FeatherIcon name="image" size={24} color="#6044E4" />
              </View>
              <Text style={styles.uploadText}>Upload Course Thumbnail</Text>
              <Text style={styles.uploadSubtext}>RECOMMENDED 1200X800PX</Text>
            </>
          )}
        </TouchableOpacity>

        {/* 🌟 MOVED UP: Course Code Input (Logical flow since typing code autofills others) */}
        <SectionLabel title="Course Code" required />
        <TextInput
          style={styles.textInput}
          placeholder="e.g. IS2104"
          placeholderTextColor="#BDBDBD"
          value={courseCode}
          onChangeText={courseCode => setCourseCode(courseCode)}
          autoCapitalize="characters"
        />

        {/* Course Name */}
        <SectionLabel title="Course Name" required />
        <TextInput
          style={styles.textInput}
          placeholder="e.g. Advanced Data Structures"
          placeholderTextColor="#BDBDBD"
          value={courseName}
          onChangeText={setCourseName}
        />

        {/* Course Tags Input */}
        <SectionLabel title="Course Keywords / Tags" />
        <TextInput
          style={styles.textInput}
          placeholder="e.g. SQL • ER Modeling • Normalization"
          placeholderTextColor="#BDBDBD"
          value={courseTags}
          onChangeText={setCourseTags}
        />

        {/* Course Description */}
        <SectionLabel title="Course Description" />
        <TextInput
          style={[styles.textInput, styles.textArea]}
          placeholder="e.g. This course covers advanced databases..."
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

        {/* Academic Year Dropdown */}
        <SectionLabel title="Academic Year" />
        <View style={{ zIndex: 10 }}>
          <TouchableOpacity 
            style={styles.dropdownInput} 
            onPress={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <Text style={styles.dropdownText}>{academicYear}</Text>
            <FeatherIcon name={isDropdownOpen ? "chevron-up" : "chevron-down"} size={20} color="#333" />
          </TouchableOpacity>

          {isDropdownOpen && (
            <View style={styles.dropdownListContainer}>
              {academicYearsList.map((year) => (
                <TouchableOpacity 
                  key={year} 
                  style={styles.dropdownListItem}
                  onPress={() => {
                    setAcademicYear(year);
                    setIsDropdownOpen(false);
                  }}
                >
                  <Text style={[
                    styles.dropdownListText, 
                    academicYear === year && { color: '#6044E4', fontWeight: 'bold' }
                  ]}>
                    {year}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

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

      {/* Footer Bar */}
      <View style={styles.footerBar}>
        <TouchableOpacity style={styles.footerAction} onPress={() => router.back()}>
          <FeatherIcon name="x" size={24} color="#555" />
          <Text style={styles.footerActionText}>Discard</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryButton} onPress={handleCreateCourse}>
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

      {/* --- SIDE MENU MODAL --- */}
            <Modal transparent visible={isMenuVisible} animationType="fade" onRequestClose={toggleMenu}>
              <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={toggleMenu}>
                <View style={[styles.sideMenu, isDark && { backgroundColor: '#1A1A1A' }]}>
                  
                  <View style={styles.menuHeader}>
                    <TouchableOpacity onPress={toggleMenu}>
                      <MaterialCommunityIcons name="menu" size={30} color={isDark ? "white" : "#333"} />
                    </TouchableOpacity>
                    <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
                  </View>
      
                  <View style={styles.menuList}>
                    <MenuOption iconName="home-variant" title="Home" active onPress={() => { setMenuVisible(false); router.replace('/coursedetailsforlecturer'); }} />
                    <MenuOption iconName="account" title="Profile" onPress={() => { setMenuVisible(false); router.replace('/profilescreen'); }} />
                    <MenuOption iconName="view-dashboard" title="Dashboard" />
                    <MenuOption iconName="shield-check" title="Privacy" />
                    <MenuOption iconName="cog" title="Settings" onPress={() => { setMenuVisible(false); router.replace('/settingslec'); }} />
                  </View>
      
                  <TouchableOpacity style={styles.logoutButton} onPress={() => { setMenuVisible(false); router.replace('/loginpage(lecturer)'); }}>
                    <Text style={styles.logoutText}> Log Out    <MaterialCommunityIcons name="logout" size={24} color="grey" /></Text>
                  </TouchableOpacity>
      
                </View>
              </TouchableOpacity>
            </Modal>
    </SafeAreaView>
  );
};

// ... keep your exact same styles object as before intact below
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FCFCF5' },
  headerContainer: { backgroundColor: '#FCFCF5', overflow: 'hidden', paddingBottom: 20, marginTop: -60 },
  headerCurve: { backgroundColor: '#6044E4', borderBottomLeftRadius: 50, borderBottomRightRadius: 50, height: 120, paddingTop: 40, paddingHorizontal: 20, alignItems: 'center', flexDirection: 'row' },
  menuIcon: { position: 'absolute', left: 20, top: 55 },
  headerTitle: { flex: 1, textAlign: 'center', color: '#FFF', fontSize: 22, fontWeight: 'bold', marginTop: 10 },
  scrollContent: { paddingHorizontal: 20 },
  uploadContainer: { backgroundColor: '#EAE6F9', borderRadius: 20, borderWidth: 1.5, borderColor: '#D0C6F5', borderStyle: 'dashed', paddingVertical: 30, alignItems: 'center', marginBottom: 25, overflow: 'hidden', minHeight: 150, justifyContent: 'center' },
  previewImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  uploadIconWrapper: { backgroundColor: '#FFF', padding: 12, borderRadius: 50, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  uploadText: { color: '#6044E4', fontSize: 16, fontWeight: '600' },
  uploadSubtext: { color: '#8A8A8A', fontSize: 12, marginTop: 4 },
  sectionLabelContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, marginTop: 5 },
  labelLeft: { flexDirection: 'row', alignItems: 'center' },
  purpleDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#6044E4', marginRight: 8 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  requiredText: { color: '#6044E4', fontSize: 12, fontWeight: 'bold', letterSpacing: 0.5 },
  textInput: { backgroundColor: '#F4F7E6', borderRadius: 15, paddingHorizontal: 15, paddingVertical: 15, fontSize: 16, color: '#333', marginBottom: 20 },
  textArea: { height: 100 },
  semesterContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  semesterChip: { backgroundColor: '#E6EEDA', width: (width - 70) / 4, aspectRatio: 1, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 5 },
  semesterChipSelected: { backgroundColor: '#BCA4FF' },
  semTextMain: { fontSize: 16, fontWeight: 'bold', color: '#4A4A4A' },
  semTextSub: { fontSize: 10, color: '#6B6B6B' },
  semTextSelected: { color: '#6044E4' },
  dropdownInput: { flexDirection: 'row', backgroundColor: '#F4F7E6', borderRadius: 15, paddingHorizontal: 15, paddingVertical: 18, alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  dropdownText: { fontSize: 16, color: '#333' },
  dropdownListContainer: { backgroundColor: '#FFF', borderRadius: 15, borderWidth: 1, borderColor: '#EAEAEA', marginBottom: 20, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  dropdownListItem: { paddingVertical: 15, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#F4F4F4' },
  dropdownListText: { fontSize: 16, color: '#4A4A4A' },
  visibilityContainer: { flexDirection: 'row', backgroundColor: '#F4F7E6', borderRadius: 15, paddingHorizontal: 15, paddingVertical: 12, alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  visibilityText: { fontSize: 16, color: '#333' },
  footerBar: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 15, paddingBottom: 25, shadowColor: '#000', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 10 },
  footerAction: { alignItems: 'center', paddingHorizontal: 15 },
  footerActionText: { fontSize: 12, color: '#555', marginTop: 4, textAlign: 'center' },
  primaryButton: { backgroundColor: '#6044E4', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 30, marginTop: -15 },
  primaryButtonContent: { flexDirection: 'row', alignItems: 'center' },
  primaryButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 14, textAlign: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  sideMenu: { width: '70%', height: '100%', backgroundColor: '#FFFFFF', padding: 20, borderTopRightRadius: 20, borderBottomRightRadius: 20 },
  menuHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 40, marginBottom: 30 },
  menuList: { flex: 1 },
  menuOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, marginBottom: 5 },
  activeMenuOption: { backgroundColor: '#F0EDFF', borderRadius: 10, paddingHorizontal: 10 },
  menuOptionText: { fontSize: 16, marginLeft: 15, color: '#333' },
  activeMenuOptionText: { color: '#5C45C3', fontWeight: 'bold' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 20, borderTopWidth: 1, borderTopColor: '#EEE', marginBottom: 20 },
  logoutText: { fontSize: 16, color: 'grey', fontWeight: 'bold' }
});

export default AddNewCourse;