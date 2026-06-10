import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
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
        const response = await fetch('http://172.20.10.3:3000/lecturer/courses');
        
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
          ></TouchableOpacity>