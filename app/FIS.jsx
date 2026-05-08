import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
  Animated, Dimensions, Modal, PanResponder, Pressable,
  SafeAreaView,
  StatusBar, StyleSheet,
  Text, TouchableOpacity, View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

// Sub-components
const LessonItem = ({ number, title }) => (
  <TouchableOpacity style={styles.lessonCard}>
    <View style={styles.lessonLeft}>
      <View style={styles.numberCircle}>
        <Text style={styles.numberText}>{number}</Text>
      </View>
      <View style={styles.textWrapper}>
        <Text style={styles.lessonTitle} numberOfLines={1} ellipsizeMode="tail">
          {title}
        </Text>
      </View>
    </View>
    <ChevronRight color="#6b7280" size={20} />
  </TouchableOpacity>
);

const MenuOption = ({ iconName, title, active, onPress }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.menuItem,
      active && styles.activeMenuItem,
      pressed && styles.pressedMenuItem 
    ]}
  >
    <Icon name={iconName} size={22} color={active ? "#4E33B3" : "#7E57C2"} style={styles.menuItemIcon} />
    <Text style={[styles.menuItemText, active && styles.activeMenuText]}>{title}</Text>
  </Pressable>
);

// Simple ThemeToggle for the menu
const ThemeToggle = ({ isDark, onToggle }) => (
  <TouchableOpacity onPress={onToggle}>
    <Icon name={isDark ? "weather-night" : "weather-sunny"} size={24} color={isDark ? "white" : "#333"} />
  </TouchableOpacity>
);

export default function CourseScreen() {
  const router = useRouter();
  
  // 1. All States and Refs must be inside the function
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isNotifVisible, setNotifVisible] = useState(false);
  const [notifications] = useState(3);
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const toggleMenu = () => setMenuVisible(!isMenuVisible);

  // Animation for sticky title
  const stickyTitleOpacity = scrollY.interpolate({ 
    inputRange: [60, 110], 
    outputRange: [0, 1], 
    extrapolate: 'clamp' 
  });

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 20 && Math.abs(gestureState.dy) < 20;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 50) {
          router.replace('/coursedetails'); 
        }
      },
    })
  ).current;

  return (
    <View style={[styles.container, isDark && { backgroundColor: '#121212' }]} {...panResponder.panHandlers}>
      <StatusBar barStyle="light-content" />

      {/* TOP BAR */}
      <View style={[styles.stableTopBar, isDark && { backgroundColor: '#1A1A1A' }]}>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Icon name="menu" size={30} color="white" />
        </TouchableOpacity>

        <Animated.View style={{ opacity: stickyTitleOpacity }}>
          <Text style={styles.stickyTitleText}>FIS</Text>
        </Animated.View>

        <TouchableOpacity onPress={() => setNotifVisible(true)} style={styles.notificationContainer}>
          <Icon name="bell-outline" size={28} color="white" />
          {notifications > 0 && (
            <View style={styles.badge}><Text style={styles.badgeTextSmall}>{notifications}</Text></View>
          )}
        </TouchableOpacity>
      </View>

      <Animated.ScrollView 
        contentContainerStyle={{ paddingTop: 100 }} 
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
      >
        <View style={[styles.headerContainer, isDark && { backgroundColor: '#1A1A1A' }]}>
          <SafeAreaView>
            <Text style={styles.headerTitle}>Fundamentals of Information System</Text>
            <View style={styles.moduleBadge1}>
              <Text style={styles.moduleBadgeText}>IS1101</Text>
            </View>
          </SafeAreaView>
        </View>

        <View style={styles.contentBody}>
          <Text style={[styles.sectionTitle, isDark && { color: 'white' }]}>Fundamentals of IS</Text>
          <Text style={[styles.description, isDark && { color: 'white' }]}>

            This course will introduce the fundamentals of information systems and the role of information

            processing in today's business environment. An overview is presented on information concepts,

            information systems, business information systems, systems development, competitive advantage,

            careers in information systems, and global challenges in information systems.

          </Text>

          <View style={styles.lessonHeader}>
            <Text style={[styles.sectionTitle, isDark && { color: 'white' }]}>Lessons</Text>
            <View style={styles.moduleBadge}>
              <Text style={styles.moduleBadgeText}>11 modules</Text>
            </View>
          </View>

          <LessonItem number="1" title="Course Outline" />
          <LessonItem number="2" title="Introduction" />
          <LessonItem number="3" title="Value & Importance of Information" />
          <LessonItem number="4" title="Information Systems Concepts" />
          
          <View style={{ height: 120 }} />
        </View>
      </Animated.ScrollView>

      {/* SIDE MENU MODAL */}
            <Modal transparent visible={isMenuVisible} animationType="fade" onRequestClose={toggleMenu}>
              <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={toggleMenu}>
                <View style={[styles.sideMenu, isDark && { backgroundColor: '#1A1A1A' }]}>
                  <View style={styles.menuHeader}>
                    <TouchableOpacity onPress={toggleMenu}>
                      <Icon name="menu" size={30} color={isDark ? "white" : "#333"} />
                    </TouchableOpacity>
                    
                    {/* DARK MODE TOGGLE REPLACING 🌙 */}
                    <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
                  </View>
      
                  <View style={styles.menuList}>
                    <MenuOption iconName="home-variant" title="Home" active onPress={() => {setMenuVisible(false); router.replace('/coursedetails')}} />
                    <MenuOption iconName="account" title="Profile" onPress={() => {setMenuVisible(false); router.replace('/profilescreen')}} />
                         <MenuOption iconName="view-dashboard" title="Dashboard" />
                    <MenuOption iconName="controller-classic" title="Games" />
                    <MenuOption iconName="shield-check" title="Privacy" />
                    <MenuOption iconName="cog" title="Settings" onPress={() => {setMenuVisible(false); router.replace('/settings')}} />
                  </View>
                  <TouchableOpacity style={styles.logoutButton} onPress={() => {setMenuVisible(false); router.replace('/loginpage(student)') }}>
                    <Text style={styles.logoutText}> Log Out    <Icon name="logout" size={24} color="grey" /></Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Modal>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.startBtn}>
          <Text style={styles.startBtnText}>Start Module</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFBEB' },
  stableTopBar: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 100,
    backgroundColor: '#5E35B1', flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 20, paddingTop: 40, zIndex: 1000,
  },
  stickyTitleText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  notificationContainer: { position: 'relative' },
  badge: { position: 'absolute', right: -2, top: -2, backgroundColor: 'red', borderRadius: 10, width: 18, height: 18, justifyContent: 'center', alignItems: 'center' },
  badgeTextSmall: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  headerContainer: { backgroundColor: '#5E35B1', paddingBottom: 40, paddingHorizontal: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: 'white', textAlign: 'center', marginTop: 10 },
  contentBody: { paddingHorizontal: 20, paddingTop: 30 },
  sectionTitle: { fontSize: 22, fontWeight: '800', color: '#1a1a1a', marginBottom: 10 },
  description: { fontSize: 14, color: '#4b5563', lineHeight: 22, marginBottom: 20 },
  lessonHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  moduleBadge: { backgroundColor: '#EDE9FE', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  moduleBadge1: { backgroundColor: '#EDE9FE', paddingHorizontal: 18, paddingVertical: 4, borderRadius: 20, alignSelf: 'center', marginTop: 10 },
  moduleBadgeText: { color: '#6D28D9', fontWeight: '600' },
  lessonCard: { flexDirection: 'row', backgroundColor: 'white', padding: 15, borderRadius: 20, alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, elevation: 4,  shadowColor: '#000',  shadowOffset: { width: 0, height: 2 },  shadowOpacity: 0.1  },
  lessonLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 10 },
  numberCircle: { width: 35, height: 35, borderRadius: 18, backgroundColor: '#FFFBEB', justifyContent: 'center', alignItems: 'center', marginRight: 15, borderWidth: 1, borderColor: '#FEF3C7' },
  numberText: { color: '#6D28D9', fontWeight: 'bold' },
  textWrapper: { flex: 1 },
  lessonTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  footer: { position: 'absolute', bottom: 30, left: 0, right: 0, paddingHorizontal: 30 },
  startBtn: { backgroundColor: '#6D28D9', paddingVertical: 18, borderRadius: 40, alignItems: 'center', elevation: 8 },
  startBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'flex-start' },
  sideMenu: { width: width * 0.7, height: '100%', backgroundColor: 'white', padding: 20, borderTopRightRadius: 20, borderBottomRightRadius: 20, elevation: 10 },
  menuHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, marginTop: 20 },
  menuList: { flex: 1 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 15, borderRadius: 12, marginBottom: 8 },
  activeMenuItem: { backgroundColor: '#E8E4FF' },
  menuItemIcon: { marginRight: 15 },
  menuItemText: { fontSize: 16, color: '#333',fontWeight: '500' },
  activeMenuText: { color: '#4E33B3', fontWeight: 'bold' },
  logoutButton: { borderTopWidth: 1, borderTopColor: '#eee', paddingVertical: 20, alignItems: 'center' },
  logoutText: { fontSize: 18, color: 'grey' },
});