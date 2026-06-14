import { useLocalSearchParams, useRouter } from 'expo-router'; // Added useLocalSearchParams
import { ChevronRight } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react'; // Added useEffect
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Modal, PanResponder, Pressable,
  SafeAreaView,
  StatusBar, StyleSheet,
  Text, TouchableOpacity, View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');


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

// 2. SUB-COMPONENTS
const SunIcon = ({ color }) => (
  <Svg width="22" height="22" viewBox="0 0 512 512">
    <Path fill={color} d="M256,104c-83.813,0-152,68.187-152,152s68.187,152,152,152s152-68.187,152-152S339.813,104,256,104z M256,368c-61.757,0-112-50.243-112-112s50.243-112,112-112s112,50.243,112,112S317.757,368,256,368z M256,72c11.046,0,20-8.954,20-20V20c0-11.046-8.954-20-20-20s-20,8.954-20,20v32C236,63.046,244.954,72,256,72z M256,440c-11.046,0-20,8.954-20,20v32c0,11.046,8.954,20,20,20s20-8.954,20-20v-32C276,448.954,267.046,440,256,440z M440,256c0-11.046,8.954-20,20-20h32c11.046,0,20,8.954,20,20s-8.954,20-20,20h-32C448.954,276,440,267.046,440,256z M72,256c0,11.046-8.954,20-20,20H20c-11.046,0-20-8.954-20-20s8.954-20,20-20h32C63.046,236,72,244.954,72,256z"/>
  </Svg>
);

const MoonIcon = ({ color }) => (
  <Svg width="20" height="20" viewBox="0 0 512 512">
    <Path fill={color} d="M410,329.2c-73.4,0-132.8-59.4-132.8-132.8c0-33.8,12.6-64.6,33.4-88.1c-14.7-3.4-30.1-5.3-46-5.3c-110,0-199.1,89.2-199.1,199.1S154.6,501.2,264.6,501.2c78.8,0,147-45.7,179.3-111.9C434,329.1,422.3,329.2,410,329.2z"/>
  </Svg>
);

const ThemeToggle = ({ isDark, onToggle }) => {
  const progress = useSharedValue(isDark ? 1 : 0);
  useEffect(() => { progress.value = withSpring(isDark ? 1 : 0); }, [isDark]);

  const rTrackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], ['#E0E0E0', '#333333']),
  }));
  const rThumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * 34 }],
  }));

  return (
    <Pressable onPress={onToggle}>
      <ReAnimated.View style={[styles.toggleTrack, rTrackStyle]}>
        <View style={styles.toggleIconsLayer}>
           <SunIcon color="#999" />
           <MoonIcon color="#999" />
        </View>
        <ReAnimated.View style={[styles.toggleThumb, rThumbStyle]}>
           {isDark ? <MoonIcon color="white" /> : <SunIcon color="white" />}
        </ReAnimated.View>
      </ReAnimated.View>
    </Pressable>
  );
};

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

export default function CourseScreen() {
  const router = useRouter();

  // If you are passing the course ID from the previous screen, you can grab it here.
  // For now, we will default to '1' if it's not provided.
  const { id } = useLocalSearchParams(); 
  const courseId = id || '1';
  
  // 1. All States and Refs must be inside the function
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isNotifVisible, setNotifVisible] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [courseData, setCourseData] = useState(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const toggleMenu = () => setMenuVisible(!isMenuVisible);

  const [loading, setLoading] = useState(true);
  const [activePopupTab, setActivePopupTab] = useState('notifications');

  // 3. Fetch Data from Backend
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        // REPLACE with your actual local IP address (e.g., 192.168.1.x)
        // If testing on an Android emulator, use 10.0.2.2 instead of localhost
        const response = await fetch(`http://172.20.10.3:3000/courses/${courseId}`, {
          method: 'GET',
          headers: {
            // You need to retrieve the actual token you saved during login (e.g., from AsyncStorage)
            'Authorization': `Bearer YOUR_SAVED_JWT_TOKEN_HERE`, 
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Failed to fetch data');

        const data = await response.json();
        setCourseData(data);
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

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

  // 4. Show loading screen while fetching
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }, isDark && { backgroundColor: '#121212' }]}>
        <ActivityIndicator size="large" color="#5E35B1" />
      </View>
    );
  }

  // Fallback if data fails to load
  if (!courseData) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{color: isDark ? 'white' : 'black'}}>Course not found.</Text>
      </View>
    );
  }

   const openPopup = (tab) => {
      setActivePopupTab(tab);
      setNotifVisible(true);
    } 
  
    // --- POPUP VIEWS RENDERING FUNCTIONS ---
    const renderNotificationsContent = () => (
      <View style={styles.popupContentArea}>
        <View style={styles.notifListItem}>
          <View style={[styles.notifIconCircle, { backgroundColor: '#E0D4FC' }]}>
            <Icon name="clipboard-text-outline" size={24} color="#6F42C1" />
          </View>
          <View style={styles.notifTextContainer}>
            <Text style={styles.notifTitle}>New assignment posted</Text>
            <Text style={styles.notifDesc}>Structured Programming: Unit 4 - Logic Gates</Text>
            <Text style={styles.notifTime}>2 HOURS AGO</Text>
          </View>
        </View>
  
        <View style={styles.notifListItem}>
          <View style={[styles.notifIconCircle, { backgroundColor: '#FCE4EC' }]}>
            <Icon name="calendar-month-outline" size={24} color="#D81B60" />
          </View>
          <View style={styles.notifTextContainer}>
            <Text style={styles.notifTitle}>Exam date reminder</Text>
            <Text style={styles.notifDesc}>Fundamentals of IS mid-term scheduled for Oct 12th.</Text>
            <Text style={styles.notifTimeRed}>YESTERDAY</Text>
          </View>
        </View>
  
        <View style={styles.notifListItem}>
          <View style={[styles.notifIconCircle, { backgroundColor: '#EDE7F6' }]}>
            <Icon name="message-text-outline" size={24} color="#7E57C2" />
          </View>
          <View style={styles.notifTextContainer}>
            <Text style={styles.notifTitle}>New grade available</Text>
            <Text style={styles.notifDesc}>Assignment 3: Modular Functions - Grade: A-</Text>
            <Text style={styles.notifTime}>2 DAYS AGO</Text>
          </View>
        </View>
  
        <TouchableOpacity style={styles.bottomActionBtn} onPress={() => {setNotifVisible(false); setNotifications(0);}}>
          <Text style={styles.bottomActionText}>MARK ALL AS READ</Text>
        </TouchableOpacity>
      </View>
    );
  
    const renderCalendarContent = () => (
      <View style={styles.popupContentArea}>
        <View style={styles.calHeader}>
          <Text style={styles.calMonthText}>November 2023</Text>
          <View style={styles.calArrows}>
            <Icon name="chevron-left" size={24} color="#555" />
            <Icon name="chevron-right" size={24} color="#555" />
          </View>
        </View>
        
        {/* Days Row */}
        <View style={styles.calDaysRow}>
          {['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'].map((day, i) => (
            <Text key={i} style={styles.calDayName}>{day}</Text>
          ))}
        </View>
  
        {/* Dates Grid (Hardcoded exactly to the image layout for this visual) */}
        <View style={styles.calDatesGrid}>
          <View style={styles.calDateRow}>
            <Text style={[styles.calDateText, styles.calDateDim]}>30</Text>
            <Text style={[styles.calDateText, styles.calDateDim]}>31</Text>
            <Text style={styles.calDateText}>1</Text>
            <Text style={styles.calDateText}>2</Text>
            <Text style={styles.calDateText}>3</Text>
            <Text style={styles.calDateText}>4</Text>
            <Text style={styles.calDateText}>5</Text>
          </View>
          <View style={styles.calDateRow}>
            <Text style={styles.calDateText}>6</Text>
            <TouchableOpacity onPress={() => {
              router.push("/assignment_submission");
              setNotifVisible(false);
            }}>
              <View style={[styles.calDateItem, styles.calDateHighlightPurpleLight]}>
                <Text style={[styles.calDateText, {color: '#6F42C1'}]}>7</Text>
                <View style={[styles.calDateDot, {backgroundColor: '#6F42C1'}]} />
              </View>
            </TouchableOpacity>
            <Text style={styles.calDateText}>8</Text>
            <Text style={styles.calDateText}>9</Text>
            <View style={[styles.calDateItem, styles.calDateHighlightPinkLight]}>
               <Text style={[styles.calDateText, {color: '#D81B60'}]}>10</Text>
               <View style={[styles.calDateDot, {backgroundColor: '#D81B60'}]} />
            </View>
            <Text style={styles.calDateText}>11</Text>
            <Text style={styles.calDateText}>12</Text>
          </View>
          <View style={styles.calDateRow}>
            <Text style={styles.calDateText}>13</Text>
            <View style={[styles.calDateItem, styles.calDateHighlightPurpleDark]}>
               <Text style={[styles.calDateText, {color: 'white'}]}>14</Text>
            </View>
            <Text style={styles.calDateText}>15</Text>
            <Text style={styles.calDateText}>16</Text>
            <Text style={styles.calDateText}>17</Text>
            <Text style={styles.calDateText}>18</Text>
            <Text style={styles.calDateText}>19</Text>
          </View>
          <View style={styles.calDateRow}>
            <Text style={styles.calDateText}>20</Text>
            <Text style={styles.calDateText}>21</Text>
            <Text style={styles.calDateText}>22</Text>
            <Text style={styles.calDateText}>23</Text>
            <Text style={styles.calDateText}>24</Text>
            <Text style={styles.calDateText}>25</Text>
            <Text style={styles.calDateText}>26</Text>
          </View>
        </View>
  
        {/* Tomorrow Event Card */}
        <View style={styles.calEventCard}>
          <View style={styles.calEventIconWrap}>
             <Icon name="calendar-text-outline" size={24} color="#6F42C1" />
          </View>
          <View style={styles.calEventInfo}>
             <Text style={styles.calEventLabel}>TOMORROW</Text>
             <Text style={styles.calEventTitle}>IS Final Review Session</Text>
          </View>
        </View>
  
        <TouchableOpacity style={styles.bottomActionBtn} onPress={() => setNotifVisible(false)}>
          <Text style={[styles.bottomActionText, {color: '#777'}]}>VIEW FULL SCHEDULE</Text>
        </TouchableOpacity>
      </View>
    );

  return (
    <View style={[styles.container, isDark && { backgroundColor: '#121212' }]} {...panResponder.panHandlers}>
      <StatusBar barStyle="light-content" />

      {/* TOP BAR */}
      <View style={[styles.stableTopBar, isDark && { backgroundColor: '#1A1A1A' }]}>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Icon name="menu" size={30} color="white" />
        </TouchableOpacity>

        <Animated.View style={{ opacity: stickyTitleOpacity }}>
          {/* Dynamically show an abbreviation or title snippet */}
          <Text style={styles.stickyTitleText}>
            {courseData.title.substring(0, 15)}...
          </Text>
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
        <View style={{
          position: 'absolute',
          top: -1000, 
          left: 0,
          right: 0,
          height: 1100, // Covers the negative top plus the 100 paddingTop
          backgroundColor: isDark ? '#1A1A1A' : '#5E35B1',
        }} />
        
        <View style={[styles.headerContainer, isDark && { backgroundColor: '#1A1A1A' }]}>
          <SafeAreaView>
            {/* DYNAMIC TITLE */}
            <Text style={styles.headerTitle}>{courseData.title}</Text>
            <View style={styles.moduleBadge1}>
              <Text style={styles.moduleBadgeText}>Course #{courseData.id}</Text>
            </View>
          </SafeAreaView>
        </View>

        <View style={styles.contentBody}>
          <Text style={[styles.sectionTitle, isDark && { color: 'white' }]}>About this Course</Text>
          
          {/* DYNAMIC DESCRIPTION */}
          <Text style={[styles.description, isDark && { color: 'white' }]}>
            {courseData.description}
          </Text>


          <View style={styles.lessonHeader}>
            <Text style={[styles.sectionTitle, isDark && { color: 'white' }]}>Lessons</Text>
            <View style={styles.moduleBadge}>
              <Text style={styles.moduleBadgeText}>
                {courseData.materials ? courseData.materials.length : 0} modules
              </Text>
            </View>
          </View>

          {/* DYNAMIC LESSON LIST */}
          {courseData.materials && courseData.materials.length > 0 ? (
            courseData.materials.map((material, index) => (
              <LessonItem 
                key={material.id.toString()} 
                number={(index + 1).toString()} 
                title={material.title || `Lesson ${index + 1}`} 
              />
            ))
          ) : (
            <Text style={[styles.description, isDark && { color: 'white' }]}>
              No materials uploaded yet.
            </Text>
          )}

          <View style={{ height: 120 }} />
        </View>
      </Animated.ScrollView>

      {/* NOTIFICATION / CALENDAR POPUP MODAL */}
            <Modal transparent visible={isNotifVisible} animationType="slide" onRequestClose={() => setNotifVisible(false)}>
              <TouchableOpacity style={styles.notifOverlay} activeOpacity={1} onPress={() => setNotifVisible(false)}>
                <View style={styles.popupMainContainer} onStartShouldSetResponder={() => true}>
                  
                  {/* Top Toggle Area */}
                  <View style={styles.popupToggleRow}>
                    <TouchableOpacity 
                      style={[styles.popupToggleBtn, activePopupTab === 'notifications' && styles.popupToggleBtnActive]} 
                      onPress={() => setActivePopupTab('notifications')}
                    >
                      <Icon name={activePopupTab === 'notifications' ? "bell" : "bell-outline"} size={22} color={activePopupTab === 'notifications' ? 'white' : '#6F42C1'} />
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.popupToggleBtn, activePopupTab === 'calendar' && styles.popupToggleBtnActive]} 
                      onPress={() => setActivePopupTab('calendar')}
                    >
                      <Icon name={activePopupTab === 'calendar' ? "calendar" : "calendar-month-outline"} size={22} color={activePopupTab === 'calendar' ? 'white' : '#6F42C1'} />
                    </TouchableOpacity>
                  </View>
      
                  {/* Render Specific Content based on Tab */}
                  {activePopupTab === 'notifications' ? renderNotificationsContent() : renderCalendarContent()}
      
                </View>
              </TouchableOpacity>
            </Modal>
            
            {/* NOTIFICATION MODAL */}
            <Modal transparent visible={isNotifVisible} animationType="slide" onRequestClose={() => setNotifVisible(false)}>
              <TouchableOpacity style={styles.notifOverlay} activeOpacity={1} onPress={() => setNotifVisible(false)}>
                <View style={styles.notifPanel}>
                  <Text style={styles.notifHeader}>Recent Notifications</Text>
                  <View style={styles.notifItem}>
                    <Icon name="book-open-variant" size={20} color="#4E33B3" />
                    <Text style={styles.notifText}>New lecture added in Web Dev</Text>
                  </View>
                  <TouchableOpacity style={styles.closeNotifBtn} onPress={() => {setNotifVisible(false); setNotifications(0);}}>
                    <Text style={styles.closeNotifText}>Mark all as read</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Modal>
      
            {/* SIDE MENU MODAL */}
            <Modal transparent visible={isMenuVisible} animationType="fade" onRequestClose={toggleMenu}>
              <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={toggleMenu}>
                <View style={[styles.sideMenu, isDark && { backgroundColor: '#1A1A1A' }]}>
                  <View style={styles.menuHeader}>
                    <TouchableOpacity onPress={toggleMenu}>
                      <Icon name="menu" size={30} color={isDark ? "white" : "#333"} />
                    </TouchableOpacity>
                    
                    <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
                  </View>
      
                  <View style={styles.menuList}>
                    <MenuOption iconName="home-variant" title="Home" active onPress={() => {setMenuVisible(false); router.replace('/coursedetails')}} />
                    <MenuOption iconName="account" title="Profile" onPress={() => {setMenuVisible(false); router.replace('/profilescreen')}} />
                    <MenuOption iconName="view-dashboard" title="Dashboard" />
                    <MenuOption iconName="controller-classic" title="Games" onPress={() => {setMenuVisible(false); router.replace('/minigamesection')}} />
                    <MenuOption iconName="shield-check" title="Privacy" onPress={() => {setMenuVisible(false); router.replace('/privacy')}} />
                    <MenuOption iconName="cog" title="Settings" onPress={() => {setMenuVisible(false); router.replace('/settings')}} />
                  </View>
                  <TouchableOpacity style={styles.logoutButton} onPress={() => {setMenuVisible(false); router.replace('/loginpage_Student') }}>
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
  // --- NEW UNIFIED POPUP STYLES ---
  notifOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  popupMainContainer: { width: width * 0.9, backgroundColor: '#EFEFEF', borderRadius: 30, paddingTop: 15, elevation: 20, overflow: 'hidden' },
  
  popupToggleRow: { flexDirection: 'row', justifyContent: 'space-evenly', marginHorizontal: 20, marginBottom: 15 },
  popupToggleBtn: { flex: 1, marginHorizontal: 5, paddingVertical: 12, alignItems: 'center', borderRadius: 25 },
  popupToggleBtnActive: { backgroundColor: '#6F42C1' },
  
  popupContentArea: { backgroundColor: '#EFEFEF', paddingBottom: 20 },

  // --- NOTIFICATION STYLES ---
  notifListItem: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 15 },
  notifIconCircle: { width: 45, height: 45, borderRadius: 22.5, justifyContent: 'center', alignItems: 'center' },
  notifTextContainer: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  notifTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  notifDesc: { fontSize: 13, color: '#666', marginTop: 2, lineHeight: 18 },
  notifTime: { fontSize: 11, fontWeight: 'bold', color: '#6F42C1', marginTop: 5 },
  notifTimeRed: { fontSize: 11, fontWeight: 'bold', color: '#D81B60', marginTop: 5 },
  
  // --- CALENDAR STYLES ---
  calHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, marginBottom: 15 },
  calMonthText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  calArrows: { flexDirection: 'row', gap: 15 },
  
  calDaysRow: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 15, marginBottom: 10 },
  calDayName: { fontSize: 11, fontWeight: 'bold', color: '#999', width: 30, textAlign: 'center' },
  
  calDatesGrid: { paddingHorizontal: 15, marginBottom: 20 },
  calDateRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  calDateItem: { width: 34, height: 34, justifyContent: 'center', alignItems: 'center', borderRadius: 17 },
  calDateText: { fontSize: 15, color: '#333', width: 34, textAlign: 'center', lineHeight: 34 },
  calDateDim: { color: '#CCC' },
  
  calDateHighlightPurpleLight: { backgroundColor: '#EAE2FD' },
  calDateHighlightPinkLight: { backgroundColor: '#FCE4EC' },
  calDateHighlightPurpleDark: { backgroundColor: '#6F42C1' },
  calDateDot: { width: 4, height: 4, borderRadius: 2, position: 'absolute', bottom: 4 },

  calEventCard: { backgroundColor: '#FDFBF3', marginHorizontal: 20, padding: 15, borderRadius: 20, flexDirection: 'row', alignItems: 'center', elevation: 2 },
  calEventIconWrap: { backgroundColor: '#EAE2FD', width: 40, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  calEventInfo: { marginLeft: 15 },
  calEventLabel: { fontSize: 11, fontWeight: 'bold', color: '#6F42C1' },
  calEventTitle: { fontSize: 15, fontWeight: 'bold', color: '#333', marginTop: 2 },

  // --- BOTTOM BUTTON STYLES ---
  bottomActionBtn: { marginTop: 10, alignSelf: 'center', paddingVertical: 15 },
  bottomActionText: { color: '#6F42C1', fontWeight: 'bold', fontSize: 13, letterSpacing: 0.5 },

});