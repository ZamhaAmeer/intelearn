import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    Modal,
    PanResponder,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const COURSES = [
<<<<<<< HEAD
  { id: '1', title: 'Fundamentals of IS', tags: 'Digital Transformation • Business Process', code: 'IS1101', type: 'Core', credits: '2 Credits', image: require("../src/assets/images/FIS.jpg"), color: '#FFCCBC' },
  { id: '2', title: 'Structured Programming(T)', tags: 'C Syntax • Logic & Control', code: 'IS1102', type: 'Core', credits: '2 Credits', image: require("../src/assets/images/STRT.jpg"), color: '#C8E6C9' },
  { id: '3', title: 'Structured Programming(P)', tags: 'Compilation • Data Structures', code: 'IS1103', type: 'Core', credits: '1 Credit', image: require("../src/assets/images/STRP.jpg"), color: '#CFD8DC' },
  { id: '4', title: 'Theories of IS', tags: 'Organizational Behavior • Frameworks', code: 'IS1104', type: 'Core', credits: '2 Credits', image: require("../src/assets/images/TIS.jpg"), color: '#B3E5FC' },
  { id: '5', title: 'Computer Organization', tags: 'CPU Architecture • Memory Hierarchy', code: 'IS1105', type: 'Core', credits: '2 Credits', image: require("../src/assets/images/CSO.jpeg"), color: '#D1C4E9' },
=======
  { id: '1', title: 'Fundamentals of IS', tags: 'Digital Transformation • Business Process', code: 'IS1101', type: 'Core', credits: '2 Credits', image: require('../src/assets/images/FIS.jpg'), color: '#FFCCBC' },
  { id: '2', title: 'Structured Programming(T)', tags: 'C Syntax • Logic & Control', code: 'IS1102', type: 'Core', credits: '2 Credits', image: require('../src/assets/images/STRT.jpg'), color: '#C8E6C9' },
  { id: '3', title: 'Structured Programming(P)', tags: 'Compilation • Data Structures', code: 'IS1103', type: 'Core', credits: '1 Credit', image: require('../src/assets/images/STRP.jpg'), color: '#CFD8DC' },
  { id: '4', title: 'Theories of IS', tags: 'Organizational Behavior • Frameworks', code: 'IS1104', type: 'Core', credits: '2 Credits', image: require('../src/assets/images/TIS.jpg'), color: '#B3E5FC' },
  { id: '5', title: 'Computer Organization', tags: 'CPU Architecture • Memory Hierarchy', code: 'IS1105', type: 'Core', credits: '2 Credits', image: require('../src/assets/images/CSO.jpeg'), color: '#D1C4E9' },
>>>>>>> e98ebc5214b7acba9e6831dc776403e332be250b
];

const MenuOption = ({ icon, title, active }) => (
    <View style={[styles.menuItem, active && styles.activeMenuItem]}>
        <Text style={styles.menuItemIcon}>{icon}</Text>
        <Text style={[styles.menuItemText, active && styles.activeMenuText]}>{title}</Text>
    </View>
);

const CourseCard = ({ item, onView }) => (
  <TouchableOpacity style={styles.cardContainer} onPress={() => onView(item)}>
    <View style={styles.imageCircleContainer}>
      <Image source={item.image} style={styles.courseImage} />
    </View>
    <View style={styles.infoCard}>
      <Text style={styles.courseTitle} numberOfLines={1}>{item.title}</Text>
      <Text style={styles.courseTags} numberOfLines={1}>{item.tags}</Text>
      
      <View style={styles.badgeRow}>
        <View style={[styles.statusBadge, { backgroundColor: '#FFCCBC' }]}>
          <Text style={styles.badgeText}>{item.code}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: '#C8E6C9' }]}>
          <Text style={styles.badgeText}>{item.type}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: '#CFD8DC' }]}>
          <Text style={styles.badgeText}>{item.credits}</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

export default function CourseDetailsScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [isMenuVisible, setMenuVisible] = useState(false);
    const [isChatbotOptionsVisible, setChatbotOptionsVisible] = useState(false);
    const [isDetailVisible, setDetailVisible] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

    // --- ANIMATION LOGIC ---
  const scrollY = useRef(new Animated.Value(0)).current;

  const stickyTitleOpacity = scrollY.interpolate({
    inputRange: [60, 110],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const mainTitleOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

    // --- SWIPE GESTURE LOGIC ---
    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                // Detect horizontal movement more than vertical to avoid scrolling issues
                return Math.abs(gestureState.dx) > 30 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
            },
            onPanResponderRelease: (evt, gestureState) => {
                // If the user swipes Left (negative dx) more than 60 pixels
                if (gestureState.dx < -60) {
                    router.push('/choosingPage');
                }
            },
        })
    ).current;

    const toggleMenu = () => setMenuVisible(!isMenuVisible);
    const toggleChatbot = () => setChatbotOptionsVisible(!isChatbotOptionsVisible);
    
    const handleViewCourse = (course) => {
        setSelectedCourse(course);
        setDetailVisible(true);
    };

    const filteredCourses = COURSES.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.tags.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={styles.container} {...panResponder.panHandlers}>
            <StatusBar barStyle="light-content" />

            {/* 1. STABLE TOP BAR (Hidden Title until scroll) */}
      <View style={styles.stableTopBar}>{/* Spacer to keep title centered */}
        <Animated.View style={{ opacity: stickyTitleOpacity }}>
          <Text style={styles.stickyTitleText}>Course Details</Text>
        </Animated.View>

      </View>

      {/* 2. SCROLLABLE CONTENT */}
      <Animated.ScrollView
        contentContainerStyle={styles.scrollList}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* SCROLLABLE HEADER (Big Text & Search) */}
        <View style={styles.headerContentSection}>
          <Animated.View style={{ opacity: mainTitleOpacity }}>
            <Text style={styles.headerTitle}>Course</Text>
            <Text style={styles.headerSubtitle}>Details</Text>
          </Animated.View>
          
          <View style={styles.searchSection}>
            <TextInput 
              style={styles.input} 
              placeholder="Explore your future" 
              placeholderTextColor="#888" 
              value={searchQuery} 
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <View style={styles.cardListWrapper}>
          {filteredCourses.length > 0 ? (
            filteredCourses.map(course => (
              <CourseCard key={course.id} item={course} onView={handleViewCourse} />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Icon name="magnify-close" size={50} color="#BBB" />
              <Text style={styles.emptyText}>No results found.</Text>
            </View>
          )}
        </View>
      </Animated.ScrollView>


            {/* Chatbot Selector */}
            <Modal transparent visible={isChatbotOptionsVisible} animationType="fade" onRequestClose={toggleChatbot}>
                <TouchableOpacity style={styles.chatbotOverlay} activeOpacity={1} onPress={toggleChatbot}>
                    <View style={styles.chatbotPopup}>
                        <TouchableOpacity 
                            style={styles.charOption} 
                            onPress={() => { 
                                setChatbotOptionsVisible(false);
                                setSelectedCourse({ title: "AI Assistant (Maya)", description: "Interact with Maya to get personalized guidance on your learning journey." });
                                setDetailVisible(true);
                            }}
                        >
                            <Text style={{ fontSize: 30 }}>👩‍💼</Text>
                            <Text style={styles.charText}>Maya</Text>
                        </TouchableOpacity>

                        <View style={styles.charSeparator} />

                        <TouchableOpacity 
                            style={styles.charOption} 
                            onPress={() => { 
                                setChatbotOptionsVisible(false);
                                setSelectedCourse({ title: "AI Assistant (Dhruv)", description: "Ask Dhruv anything about your courses, schedules, or technical questions." });
                                setDetailVisible(true);
                            }}
                        >
                            <Text style={{ fontSize: 30 }}>👨‍🎓</Text>
                            <Text style={styles.charText}>Dhruv</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Insight Modal */}
            <Modal transparent visible={isDetailVisible} animationType="fade" onRequestClose={() => setDetailVisible(false)}>
                <View style={styles.detailOverlay}>
                    <View style={styles.boostPopupCard}>
                        <View style={styles.boostHeader}>
                            <Text style={styles.boostIcon}>🧠</Text>
                            <Text style={styles.boostTitle}>COURSE INSIGHT ACTIVE</Text>
                            <TouchableOpacity onPress={() => setDetailVisible(false)} style={styles.closePopup}>
                                <Ionicons name="close" size={20} color="#5D47E0" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.boostCourseName}>{selectedCourse?.title}</Text>
                        <Text style={styles.boostDescription}>
                            {selectedCourse?.description}{"\n\n"}To access full course module or chatbot, please register using your university email.
                        </Text>
                        <TouchableOpacity 
                            style={styles.boostActionBtn} 
                            onPress={() => { setDetailVisible(false); router.push('/choosingPage'); }}
                        >
                            <Text style={styles.boostActionText}>Select your role</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

          


            <TouchableOpacity style={styles.fab} onPress={toggleChatbot}>
                    <Icon name="face-agent" size={30} color="white" />
                  </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FEFDF0' },

    // STABLE TOP BAR (Guest version - No menu/bell)
  stableTopBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: '#4E33B3',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 45,
    zIndex: 1000,
  },
  stickyTitleText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },

  // SCROLLABLE HEADER 
  headerContentSection: { 
    backgroundColor: '#4E33B3', 
    padding: 20, 
    paddingTop: 110, 
    borderBottomLeftRadius: 30, 
    borderBottomRightRadius: 30, 
    paddingBottom: 40,
  },
  headerTitle: { color: 'white', fontSize: 32, fontWeight: 'bold' },
  headerSubtitle: { color: '#A292FF', fontSize: 32, fontWeight: 'bold', marginTop: -10 },
  searchSection: { backgroundColor: 'white', borderRadius: 25, marginTop: 20, paddingHorizontal: 15, height: 45, justifyContent: 'center' },
  input: { color: '#000', fontSize: 14 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
    sideMenu: { width: width * 0.55, height: '100%', backgroundColor: 'white', padding: 20, borderTopRightRadius: 20, borderBottomRightRadius: 20, elevation: 10 },
    menuHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30, marginTop: 30 },
    closeMenuText: { fontSize: 24, color: '#333' },
    moonIcon: { fontSize: 18 },
    cardListWrapper: { padding: 20 },
    
    logoutButton: { borderTopWidth: 1, borderTopColor: '#eee', paddingVertical: 20, alignItems: 'center' },
    logoutText: { fontSize: 20, fontWeight: 'bold', color: '#000' },
    header: { backgroundColor: '#4E33B3', padding: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, paddingBottom: 40, paddingTop: Platform.OS === 'ios' ? 50 : 30 },
    headerTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    menuIcon: { color: 'white', fontSize: 24 },
    bellIcon: { color: 'white', fontSize: 24 },
    headerTitle: { color: 'white', fontSize: 32, fontWeight: 'bold' },
    headerSubtitle: { color: '#A292FF', fontSize: 32, fontWeight: 'bold', marginTop: -10 },
    searchSection: { backgroundColor: 'white', borderRadius: 25, marginTop: 20, paddingHorizontal: 15, height: 45, justifyContent: 'center', elevation: 3 },
    searchInput: { fontSize: 14, color: '#333' },
    scrollList: { paddingTop: 0, paddingBottom: 100 },
    cardContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
    imageCircleContainer: { 
    width: 85, 
    height: 85, 
    borderRadius: 42.5, 
    borderWidth: 4, 
    borderColor: 'white', 
    overflow: 'hidden', 
    zIndex: 2, 
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  courseImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  infoCard: { 
    flex: 1, 
    backgroundColor: 'white', 
    borderRadius: 20, 
    paddingVertical: 15,
    paddingLeft: 55, // Room for overlapping circle
    paddingRight: 15,
    marginLeft: -45, 
    elevation: 4, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1 
  },
  courseTitle: { fontSize: 17, fontWeight: 'bold', color: '#000' },
  courseTags: { fontSize: 11, color: '#555', marginVertical: 4 },
  badgeRow: { flexDirection: 'row', gap: 6, marginTop: 4 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 10, fontWeight: '700', color: '#444' },
    ratingBadge: { backgroundColor: '#F0F0F0', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
    ratingText: { fontSize: 9, fontWeight: 'bold' },
    viewButton: { backgroundColor: '#C9E227', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 10 },
    viewText: { fontWeight: 'bold', fontSize: 12, color: '#2B3D00' },
    fab: { position: 'absolute', bottom: 30, right: 30, backgroundColor: '#4E33B3', width: 65, height: 65, borderRadius: 33, justifyContent: 'center', alignItems: 'center', elevation: 8 },
    chatbotOverlay: { flex: 1, backgroundColor: 'transparent' },
    chatbotPopup: { position: 'absolute', bottom: 110, right: 30, backgroundColor: '#EEF0FF', borderRadius: 50, paddingVertical: 10, paddingHorizontal: 5, alignItems: 'center', elevation: 10, borderWidth: 2, borderColor: '#5D47E0' },
    charOption: { alignItems: 'center', padding: 10, width: 70 },
    charText: { fontSize: 10, fontWeight: 'bold', color: '#5D47E0', marginTop: 2 },
    charSeparator: { height: 1, width: '60%', backgroundColor: '#D0D7FF', marginVertical: 5 },
    detailOverlay: { flex: 1, backgroundColor: 'rgba(78, 51, 179, 0.2)', justifyContent: 'center', alignItems: 'center', padding: 30 },
    boostPopupCard: { backgroundColor: '#EEF0FF', borderRadius: 20, padding: 20, width: '90%', borderWidth: 1.5, borderColor: '#D0D7FF', elevation: 15 },
    boostHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    boostIcon: { fontSize: 18, marginRight: 8 },
    boostTitle: { color: '#5D47E0', fontWeight: '900', fontSize: 12, letterSpacing: 1, flex: 1 },
    boostCourseName: { fontSize: 20, fontWeight: 'bold', color: '#111', marginBottom: 8 },
    boostDescription: { color: '#444', fontSize: 14, lineHeight: 20, marginBottom: 15 },
    boostActionBtn: { backgroundColor: '#5D47E0', borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
    boostActionText: { color: 'white', fontWeight: 'bold', fontSize: 15 },
    emptyContainer: { alignItems: 'center', marginTop: 50 },
    emptyText: { color: '#999', fontSize: 14 }
});