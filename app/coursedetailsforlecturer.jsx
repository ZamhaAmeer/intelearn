import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { API_BASE_URL } from '../config';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- HELPER COMPONENTS FOR MENU ---
// These ensure your menu renders properly if you haven't built them separately yet
const ThemeToggle = ({ isDark, onToggle }) => (
  <Switch value={isDark} onValueChange={onToggle} trackColor={{ false: "#767577", true: "#5C45C3" }} />
);

const MenuOption = ({ iconName, title, active, onPress }) => (
  <TouchableOpacity style={[styles.menuOption, active && styles.activeMenuOption]} onPress={onPress}>
    <MaterialCommunityIcons name={iconName} size={24} color={active ? '#5C45C3' : '#666'} />
    <Text style={[styles.menuOptionText, active && styles.activeMenuOptionText]}>{title}</Text>
  </TouchableOpacity>
);

// --- MAIN SCREEN ---
export default function TeacherCoursesScreen() {
  const router = useRouter(); // Expo Router hook

  // State for the Menu Modal
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const [lecturerName, setLecturerName] = useState('Lecturer');

  const toggleMenu = () => setMenuVisible(!isMenuVisible);

  const handleCoursePress = (course) => {
    // Navigate to your specific course module page. 
    // Ensure you have a file at app/coursemodule.js or similar.
    router.push({ pathname: '/coursemodule', params: { id: course.id, title: course.title } });
  };

  React.useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedName = await AsyncStorage.getItem('fullName');
        if (storedName) {
          setLecturerName(storedName);
        }
      } catch (error) {
        console.error("Error loading user name:", error);
      }
    };
    loadUserData();

    const fetchLecturerCourses = async () => {
      try {
        // Hardcoded to your laptop's Wi-Fi IP address for local testing
        const response = await fetch(`${API_BASE_URL}/lecturer/courses`);
        
        if (!response.ok) throw new Error('Failed to fetch data');
        
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching lecturer courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLecturerCourses();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#5C45C3" />
      
      {/* --- HEADER --- */}
      <View style={styles.header}>
        {/* Changed this TouchableOpacity to trigger toggleMenu */}
        <TouchableOpacity style={styles.menuIcon} onPress={toggleMenu}>
          <Ionicons name="menu" size={32} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Welcome Back, {lecturerName}!</Text>
      </View>

      {/* --- COURSE LIST --- */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>My Courses</Text>

        {courses.map((course) => (
          <TouchableOpacity 
            key={course.id} 
            style={styles.courseWrapper}
            activeOpacity={0.7}
            onPress={() => handleCoursePress(course)}
          >
            <View style={styles.imageContainer}>
              <Image source={{ uri: course.image }} style={styles.courseImage} />
            </View>
            <View style={styles.connectingLine} />
            <View style={styles.courseCard}>
              <Text style={styles.courseTitle}>{course.title}</Text>
              <View style={styles.tagsRow}>
                <View style={[styles.tag, { backgroundColor: '#D6CFF9' }]}>
                  <Text style={[styles.tagText, { color: '#5C45C3' }]}>{course.year}</Text>
                </View>
                <View style={[styles.tag, { backgroundColor: '#C0F2F9' }]}>
                  <Text style={[styles.tagText, { color: '#007A99' }]}>{course.sem}</Text>
                </View>
                <View style={[styles.tag, { backgroundColor: '#A7F3D0' }]}>
                  <Text style={[styles.tagText, { color: '#065F46' }]}>{course.dept}</Text>
                </View>
                <View style={styles.studentsCount}>
                  <MaterialIcons name="people" size={16} color="#555" />
                  <Text style={styles.studentsText}>{course.students}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.createButton} onPress={() => router.push('/addnewcourse')}>
          <Ionicons name="add" size={50} color="#FFFFFF" alignItems="center" /> 
          <View>
            <Text style={styles.createButtonText}>Create New</Text>
            <Text style={styles.createButtonText}>Course</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

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
              <MenuOption iconName="cog" title="Settings" onPress={() => { setMenuVisible(false); router.replace('/settings'); }} />
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={() => { setMenuVisible(false); router.replace('/loginpage(lecturer)'); }}>
              <Text style={styles.logoutText}> Log Out    <MaterialCommunityIcons name="logout" size={24} color="grey" /></Text>
            </TouchableOpacity>

          </View>
        </TouchableOpacity>
      </Modal>

    </View>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  // Main Screen Styles
  container: { flex: 1, backgroundColor: '#FDFCEB' },
  header: {
    backgroundColor: '#5C45C3', height: 160, borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50, paddingHorizontal: 20, paddingTop: 40,
  },
  menuIcon: { marginBottom: 20 },
  headerTitle: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#000000', marginTop: 20, marginBottom: 20 },
  courseWrapper: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  imageContainer: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: '#FFFFFF', padding: 3,
    elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, zIndex: 2,
  },
  courseImage: { width: '100%', height: '100%', borderRadius: 40 },
  connectingLine: { width: 20, height: 3, backgroundColor: '#D3D3D3', marginLeft: -2, marginRight: -2, zIndex: 1 },
  courseCard: {
    flex: 1, backgroundColor: '#FFFFFF', borderRadius: 20, paddingVertical: 15, paddingHorizontal: 15,
    borderWidth: 1, borderColor: '#EAEAEA', elevation: 1, shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2,minHeight: 90,             // Forces the card to be at least this tall
    justifyContent: 'center',
  },
  courseTitle: { fontSize: 16, fontWeight: 'bold', color: '#000000', marginBottom: 10 },
  tagsRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  tagText: { fontSize: 10, fontWeight: 'bold' },
  studentsCount: { flexDirection: 'row', alignItems: 'center', marginLeft: 'auto' },
  studentsText: { fontSize: 12, color: '#555', marginLeft: 4, fontWeight: '600' },
  createButton: {
    backgroundColor: '#6146C6', borderRadius: 20, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', paddingVertical: 15, marginTop: 30, marginBottom: 20, elevation: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 4,
  },
  createButtonText: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold', marginLeft: 10, lineHeight: 28 },

  // Modal Menu Styles added here:
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sideMenu: {
    width: '70%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  menuList: {
    flex: 1,
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    marginBottom: 5,
  },
  activeMenuOption: {
    backgroundColor: '#F0EDFF',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  menuOptionText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#333',
  },
  activeMenuOptionText: {
    color: '#5C45C3',
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    marginBottom: 20, // To keep it above standard bottom bezels
  },
  logoutText: {
    fontSize: 16,
    color: 'grey',
    fontWeight: 'bold',
  }
});