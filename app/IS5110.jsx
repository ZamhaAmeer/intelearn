import React, { useEffect, useRef, useState } from 'react';
import {
  BackHandler,
  ActivityIndicator,
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useLocalSearchParams, useRouter, usePathname } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobalTheme } from './themeStore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ChevronRight } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const LessonItem = ({ number, title, onPress }) => {
  const [isDark] = useGlobalTheme();
  return (
    <TouchableOpacity
      style={[
        styles.lessonCard,
        isDark && { backgroundColor: '#131926', borderWidth: 1, borderColor: '#232D3F', shadowColor: 'transparent', elevation: 0 }
      ]}
      onPress={onPress}
    >
      <View style={styles.lessonLeft}>
        <View style={[styles.numberCircle, isDark && { backgroundColor: '#1A2333', borderColor: '#2D3A55' }]}>
          <Text style={[styles.numberText, isDark && { color: '#8E7AF4' }]}>{number}</Text>
        </View>
        <View style={styles.textWrapper}>
          <Text style={[styles.lessonTitle, isDark && { color: 'white' }]} numberOfLines={1} ellipsizeMode="tail">
            {title}
          </Text>
        </View>
      </View>
      <ChevronRight color={isDark ? "#8E7AF4" : "#6b7280"} size={20} />
    </TouchableOpacity>
  );
};

const SunIcon = ({ color }) => (
  <Svg width="22" height="22" viewBox="0 0 512 512">
    <Path fill={color} d="M256,104c-83.813,0-152,68.187-152,152s68.187,152,152,152s152-68.187,152-152S339.813,104,256,104z M256,368c-61.757,0-112-50.243-112-112s50.243-112,112-112s112,50.243,112,112S317.757,368,256,368z M256,72c11.046,0,20-8.954,20-20V20c0-11.046-8.954-20-20-20s-20,8.954-20,20v32C236,63.046,244.954,72,256,72z M256,440c-11.046,0-20,8.954-20,20v32c0,11.046,8.954,20,20,20s20-8.954,20-20v-32C276,448.954,267.046,440,256,440z M440,256c0-11.046,8.954-20,20-20h32c11.046,0,20,8.954,20,20s-8.954,20-20,20h-32C448.954,276,440,267.046,440,256z M72,256c0,11.046-8.954,20-20,20H20c-11.046,0-20-8.954-20-20s8.954-20,20-20h32C63.046,236,72,244.954,72,256z" />
  </Svg>
);

const MoonIcon = ({ color }) => (
  <Svg width="20" height="20" viewBox="0 0 512 512">
    <Path fill={color} d="M410,329.2c-73.4,0-132.8-59.4-132.8-132.8c0-33.8,12.6-64.6,33.4-88.1c-14.7-3.4-30.1-5.3-46-5.3c-110,0-199.1,89.2-199.1,199.1S154.6,501.2,264.6,501.2c78.8,0,147-45.7,179.3-111.9C434,329.1,422.3,329.2,410,329.2z" />
  </Svg>
);

const ThemeToggle = ({ isDark, onToggle }) => (
  <Pressable onPress={onToggle} style={{ padding: 4 }}>
    {isDark ? <SunIcon color="white" /> : <MoonIcon color="#333" />}
  </Pressable>
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

export default function CourseScreen() {
  useEffect(() => {
    const backAction = () => {
      router.replace('/coursedetails');
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);
  const router = useRouter();
  const pathname = usePathname();
  const { id } = useLocalSearchParams();
  const courseId = id || '57';
  const targetCode = 'IS5110';

  const [isMenuVisible, setMenuVisible] = useState(false);

  const [isDark, setIsDark] = useGlobalTheme();
  const [isNotifVisible, setNotifVisible] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePopupTab, setActivePopupTab] = useState('notifications');
  const [evaluations, setEvaluations] = useState([]);
  const [isEvaluationsExpanded, setIsEvaluationsExpanded] = useState(true);

  const scrollY = useRef(new Animated.Value(0)).current;
  const toggleMenu = () => setMenuVisible(!isMenuVisible);

  // Date formatter matching mockup e.g., '25 August 2026, 3:31 PM'
  const formatEvaluationDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;

      const day = date.getDate();
      const month = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear();

      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // 0 should be 12

      return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
    } catch (e) {
      return dateStr;
    }
  };

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        // Hits the code lookup route first
        const response = await fetch(`http://172.22.236.72:3000/courses/code/${targetCode}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Failed to fetch course by code');

        const data = await response.json();
        setCourseData(data);
      } catch (error) {
        console.error("Error fetching course data content, using local fallback:", error);
        // Fallback to local mock data so the app doesn't crash if the course is not in the DB
        setCourseData({
          id: 57,
          title: "Advanced Database Systems",
          code: "IS5110",
          description: "Advanced Database Systems - Distributed Data • Query Optimization (2 Credits)",
          materials: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [targetCode]);

  // Fetch evaluations (quizzes & assignments) when courseData is ready
  useEffect(() => {
    if (!courseData?.id) return;

    const fetchEvaluations = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        const [quizzesRes, assignmentsRes] = await Promise.all([
          fetch(`http://172.22.236.72:3000/api/student/quizzes?courseId=${courseData.id}`, { headers }),
          fetch(`http://172.22.236.72:3000/api/student/assignments?courseId=${courseData.id}`, { headers })
        ]);

        const quizzes = quizzesRes.ok ? await quizzesRes.json() : [];
        const assignments = assignmentsRes.ok ? await assignmentsRes.json() : [];

        let combined = [
          ...quizzes.map(q => ({ ...q, type: 'quiz' })),
          ...assignments.map(a => ({ ...a, type: 'assignment' }))
        ];

        setEvaluations(combined);
      } catch (err) {
        console.error("Error fetching evaluations:", err);
      }
    };

    fetchEvaluations();
  }, [courseData?.id]);

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

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }, isDark && { backgroundColor: '#090D16' }]}>
        <ActivityIndicator size="large" color="#4E33B3" />
      </View>
    );
  }

  if (!courseData) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: isDark ? 'white' : 'black' }}>Course data could not be retrieved.</Text>
      </View>
    );
  }

  // --- POPUP VIEWS RENDERING FUNCTIONS ---
  const renderNotificationsContent = () => (
    <View style={[styles.popupContentArea, isDark && { backgroundColor: "#1E1E1E" }]}>
      <View style={styles.notifListItem}>
        <View style={[styles.notifIconCircle, { backgroundColor: '#E0D4FC' }]}>
          <Icon name="clipboard-text-outline" size={24} color="#6F42C1" />
        </View>
        <View style={styles.notifTextContainer}>
          <Text style={[styles.notifTitle, isDark && { color: "#FFFFFF" }]}>New assignment posted</Text>
          <Text style={[styles.notifDesc, isDark && { color: "#AAAAAA" }]}>${courseData.title}: Unit 1</Text>
          <Text style={[styles.notifTime, isDark && { color: "#B39DDB" }]}>2 HOURS AGO</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.bottomActionBtn} onPress={() => {
        setNotifVisible(false); setNotifications(0);
      }}>
        <Text style={[styles.bottomActionText, isDark && { color: "#B39DDB" }]}>MARK ALL AS READ</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCalendarContent = () => (
    <View style={[styles.popupContentArea, isDark && { backgroundColor: "#1E1E1E" }]}>
      <View style={styles.calHeader}>
        <Text style={[styles.calMonthText, isDark && { color: "#FFFFFF" }]}>November 2023</Text>
      </View>
      <View style={styles.calDaysRow}>
        {['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'].map((day, i) => (
          <Text key={i} style={styles.calDayName}>{day}</Text>
        ))}
      </View>
      <View style={[styles.calEventCard, isDark && { backgroundColor: "#2A2A2A" }]}>
        <View style={[styles.calEventIconWrap, isDark && { backgroundColor: "#2A2440" }]}>
          <Icon name="calendar-text-outline" size={24} color="#6F42C1" />
        </View>
        <View style={styles.calEventInfo}>
          <Text style={[styles.calEventLabel, isDark && { color: "#B39DDB" }]}>TOMORROW</Text>
          <Text style={[styles.calEventTitle, isDark && { color: "#FFFFFF" }]}>${courseData.code} Review Session</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, isDark && { backgroundColor: '#090D16' }]} {...panResponder.panHandlers}>
      <StatusBar barStyle="light-content" />

      {/* TOP BAR */}
      <View style={styles.stableTopBar}>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Icon name="menu" size={30} color="white" />
        </TouchableOpacity>

        <Animated.View style={{ opacity: stickyTitleOpacity }}>
          <Text style={styles.stickyTitleText}>
            {courseData.title ? `${courseData.title.substring(0, 15)}...` : "Course"}
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
          height: 1100,
          backgroundColor: '#4E33B3',
        }} />

        <View style={styles.headerContainer}>
          <SafeAreaView>
            <Text style={styles.headerTitle}>{courseData.title}</Text>
            <View style={styles.moduleBadge1}>
              <Text style={[styles.moduleBadgeText, isDark && { color: '#8E7AF4' }]}>Course {courseData.code ? `• ${courseData.code}` : `#${courseData.id}`}</Text>
            </View>
          </SafeAreaView>
        </View>

        <View style={styles.contentBody}>
          <Text style={[styles.sectionTitle, isDark && { color: 'white' }]}>About this Course</Text>
          <Text style={[styles.description, isDark && { color: '#E0E0E0' }]}>
            {courseData.description || "No description layout available for this syllabus database module entry."}
          </Text>

          {/* Evaluations Accordion Section */}
          <View style={[styles.evaluationsCard, isDark && { backgroundColor: '#131926', borderColor: '#232D3F', shadowColor: 'transparent', elevation: 0 }]}>
            <TouchableOpacity
              style={[styles.accordionHeader, isDark && { borderBottomColor: '#1B2232' }]}
              onPress={() => setIsEvaluationsExpanded(!isEvaluationsExpanded)}
            >
              <View style={styles.accordionHeaderLeft}>
                <Icon
                  name={isEvaluationsExpanded ? "chevron-down" : "chevron-right"}
                  size={24}
                  color={isDark ? "white" : "#4b5563"}
                />
                <Text style={[styles.accordionTitle, isDark && { color: 'white' }]}>Evaluations</Text>
              </View>
              <Text style={[styles.accordionCount, isDark && { color: '#8C96A8' }]}>{evaluations.length} ITEMS</Text>
            </TouchableOpacity>

            {isEvaluationsExpanded && (
              <View style={[styles.accordionContent, isDark && { borderTopColor: '#1B2232' }]}>
                {evaluations.filter(item => !item.course_id || parseInt(item.course_id) === parseInt(courseData?.id)).length > 0 ? (
                  evaluations
                    .filter(item => !item.course_id || parseInt(item.course_id) === parseInt(courseData?.id))
                    .map((item, index, filteredArr) => {
                      const isLast = index === filteredArr.length - 1;
                      const isAssignment = item.type === 'assignment';
                      return (
                        <TouchableOpacity
                          key={item.id}
                          style={[styles.evalItem, isDark && { borderBottomColor: '#1B2232' }, isLast && styles.evalItemLast]}
                          onPress={() => {
                            if (isAssignment) {
                              router.push({ pathname: '/assignment_submit', params: { id: item.id } });
                            } else {
                              AsyncStorage.getItem('role').then(role => {
                                if (role === 'lecturer') {
                                  router.push({ pathname: '/quiz_details', params: { id: item.id } });
                                } else {
                                  router.push({ pathname: '/quiz_attempt', params: { id: item.id } });
                                }
                              });
                            }
                          }}
                        >
                          <View style={[
                            isAssignment ? styles.evalIconWrapperOrange : styles.evalIconWrapperBlue,
                            isDark && (isAssignment ? { backgroundColor: '#2B1D15' } : { backgroundColor: '#141F32' })
                          ]}>
                            <Icon
                              name={isAssignment ? "file-document-outline" : "clipboard-text-outline"}
                              size={24}
                              color={isAssignment ? "#F97316" : "#3B82F6"}
                            />
                          </View>
                          <View style={styles.evalInfo}>
                            <Text style={[styles.evalTitle, isDark && { color: 'white' }]}>{item.title}</Text>
                            <Text style={[styles.evalText, isDark && { color: '#8C96A8' }]}>
                              <Text style={[styles.evalLabel, isDark && { color: '#8C96A8' }]}>Opened: </Text>
                              {formatEvaluationDate(isAssignment ? (item.open_time || item.createdAt) : item.createdAt)}
                            </Text>
                            <Text style={[styles.evalText, isDark && { color: '#8C96A8' }]}>
                              <Text style={[styles.evalLabel, isDark && { color: '#8C96A8' }]}>{isAssignment ? "Due: " : "Closed: "}</Text>
                              {formatEvaluationDate(isAssignment ? (item.deadline || item.due_date) : item.due_date)}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })
                ) : (
                  <View style={{ padding: 20, alignItems: 'center' }}>
                    <Text style={{ color: isDark ? '#ccc' : '#777', fontSize: 14 }}>No active evaluations available</Text>
                  </View>
                )}
              </View>
            )}
          </View>

          <View style={styles.lessonHeader}>
            <Text style={[styles.sectionTitle, isDark && { color: 'white' }]}>Lessons</Text>
            <View style={[styles.moduleBadge, isDark && { backgroundColor: '#1C182A' }]}>
              <Text style={[styles.moduleBadgeText, isDark && { color: '#8E7AF4' }]}>
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
                onPress={() => {
                  const safeUrl = material.material_url.replace(/\\/g, '/');
                  const rawUrl = `http://172.22.236.72:3000/${safeUrl}`;

                  router.push({
                    pathname: '/lessondetails', params: {
                      courseTitle: courseData.title,
                      lessonTitle: material.title,
                      description: material.ai_description,
                      url: rawUrl,
                      mcqs: JSON.stringify(material.ai_mcqs),
                      parentRoute: pathname
                    }
                  });
                }}
              />
            ))
          ) : (
            <View style={[isDark && { backgroundColor: '#131926', borderWidth: 1, borderColor: '#232D3F', borderRadius: 20, paddingVertical: 40, alignItems: 'center', justifyContent: 'center', width: '100%' }]}>
              <Text style={[styles.description, { fontStyle: 'italic', marginBottom: 0 }, isDark && { color: '#8C96A8' }]}>
                No materials uploaded yet.
              </Text>
            </View>
          )}

          <View style={{ height: 120 }} />
        </View>
      </Animated.ScrollView>

      {/* NOTIFICATION / CALENDAR POPUP MODAL */}
      <Modal transparent visible={isNotifVisible} animationType="slide" onRequestClose={() => setNotifVisible(false)}>
        <TouchableOpacity style={styles.notifOverlay} activeOpacity={1} onPress={() => setNotifVisible(false)}>
          <View style={[styles.popupMainContainer, isDark && { backgroundColor: "#1E1E1E" }]} onStartShouldSetResponder={() => true}>
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

            {activePopupTab === 'notifications' ? renderNotificationsContent() : renderCalendarContent()}
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
            </View>

            <View style={styles.menuList}>
              <MenuOption iconName="home-variant" title="Home" active onPress={() => { setMenuVisible(false); router.replace('/coursedetails') }} />
              <MenuOption iconName="folder-open" title="Shared Notes" onPress={() => { setMenuVisible(false); router.push({ pathname: '/student_notes', params: { courseCode: courseData?.code || 'IS5110' } }) }} />
              <MenuOption iconName="account" title="Profile" onPress={() => { setMenuVisible(false); router.replace('/profilescreen') }} />
              <MenuOption iconName="view-dashboard" title="Dashboard" />
              <MenuOption iconName="shield-check" title="Privacy" onPress={() => { setMenuVisible(false); router.replace('/privacy') }} />
              <MenuOption iconName="cog" title="Settings" onPress={() => { setMenuVisible(false); router.replace('/settings') }} />
            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={() => { setMenuVisible(false); router.replace('/loginpage(student)') }}>
              <Text style={styles.logoutText}> Log Out    <Icon name="logout" size={24} color="grey" /></Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.startBtn}
          onPress={() => {
            if (courseData?.materials && courseData.materials.length > 0) {
              const firstMat = courseData.materials[0];
              const safeUrl = firstMat.material_url ? firstMat.material_url.replace(/\\/g, '/') : '';
              const rawUrl = safeUrl ? `http://172.22.236.72:3000/${safeUrl}` : '';
              router.push({
                pathname: '/lessondetails', params: {
                  courseTitle: courseData.title,
                  lessonTitle: firstMat.title,
                  description: firstMat.ai_description,
                  url: rawUrl,
                  mcqs: JSON.stringify(firstMat.ai_mcqs),
                  parentRoute: pathname
                }
              });
            }
          }}
        >
          <Text style={styles.startBtnText}>Start Module</Text>
        </TouchableOpacity>
      </View>


    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FEFDF0' },
  stableTopBar: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 100,
    backgroundColor: '#4E33B3', flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 20, paddingTop: 40, zIndex: 1000,
  },
  stickyTitleText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  notificationContainer: { position: 'relative' },
  badge: { position: 'absolute', right: -2, top: -2, backgroundColor: 'red', borderRadius: 10, width: 18, height: 18, justifyContent: 'center', alignItems: 'center' },
  badgeTextSmall: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  headerContainer: { backgroundColor: '#4E33B3', paddingBottom: 40, paddingHorizontal: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: 'white', textAlign: 'center', marginTop: 10 },
  contentBody: { paddingHorizontal: 20, paddingTop: 30 },
  sectionTitle: { fontSize: 22, fontWeight: '800', color: '#1a1a1a', marginBottom: 10 },
  description: { fontSize: 14, color: '#4b5563', lineHeight: 22, marginBottom: 20 },
  lessonHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  moduleBadge: { backgroundColor: '#EDE9FE', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  moduleBadge1: { backgroundColor: '#EDE9FE', paddingHorizontal: 18, paddingVertical: 4, borderRadius: 20, alignSelf: 'center', marginTop: 10 },
  moduleBadgeText: { color: '#4E33B3', fontWeight: '600' },
  lessonCard: { flexDirection: 'row', backgroundColor: 'white', padding: 15, borderRadius: 20, alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1 },
  lessonLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 10 },
  numberCircle: { width: 35, height: 35, borderRadius: 18, backgroundColor: '#FEFDF0', justifyContent: 'center', alignItems: 'center', marginRight: 15, borderWidth: 1, borderColor: '#FEF3C7' },
  numberText: { color: '#4E33B3', fontWeight: 'bold' },
  textWrapper: { flex: 1 },
  lessonTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  footer: { position: 'absolute', bottom: 30, left: 0, right: 0, paddingHorizontal: 30 },
  startBtn: { backgroundColor: '#4E33B3', paddingVertical: 18, borderRadius: 40, alignItems: 'center', elevation: 8 },
  startBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'flex-start' },
  sideMenu: { width: width * 0.7, height: '100%', backgroundColor: 'white', padding: 20, borderTopRightRadius: 20, borderBottomRightRadius: 20, elevation: 10 },
  menuHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, marginTop: 20 },
  menuList: { flex: 1 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 15, borderRadius: 12, marginBottom: 8 },
  activeMenuItem: { backgroundColor: '#E8E4FF' },
  menuItemIcon: { marginRight: 15 },
  menuItemText: { fontSize: 16, color: '#333', fontWeight: '500' },
  activeMenuText: { color: '#4E33B3', fontWeight: 'bold' },
  logoutButton: { borderTopWidth: 1, borderTopColor: '#eee', paddingVertical: 20, alignItems: 'center' },
  logoutText: { fontSize: 18, color: 'grey' },
  notifOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  popupMainContainer: { width: width * 0.9, backgroundColor: '#EFEFEF', borderRadius: 30, paddingTop: 15, elevation: 20, overflow: 'hidden' },
  popupToggleRow: { flexDirection: 'row', justifyContent: 'space-evenly', marginHorizontal: 20, marginBottom: 15 },
  popupToggleBtn: { flex: 1, marginHorizontal: 5, paddingVertical: 12, alignItems: 'center', borderRadius: 25 },
  popupToggleBtnActive: { backgroundColor: '#6F42C1' },
  popupContentArea: { backgroundColor: '#EFEFEF', paddingBottom: 20 },
  notifListItem: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 15 },
  notifIconCircle: { width: 45, height: 45, borderRadius: 22.5, justifyContent: 'center', alignItems: 'center' },
  notifTextContainer: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  notifTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  notifDesc: { fontSize: 13, color: '#666', marginTop: 2, lineHeight: 18 },
  notifTime: { fontSize: 11, fontWeight: 'bold', color: '#6F42C1', marginTop: 5 },
  notifTimeRed: { fontSize: 11, fontWeight: 'bold', color: '#D81B60', marginTop: 5 },
  calHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, marginBottom: 15 },
  calMonthText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  calDaysRow: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 15, marginBottom: 10 },
  calDayName: { fontSize: 11, fontWeight: 'bold', color: '#999', width: 30, textAlign: 'center' },
  calEventCard: { backgroundColor: '#FDFBF3', marginHorizontal: 20, padding: 15, borderRadius: 20, flexDirection: 'row', alignItems: 'center', elevation: 2 },
  calEventIconWrap: { backgroundColor: '#EAE2FD', width: 40, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  calEventInfo: { marginLeft: 15 },
  calEventLabel: { fontSize: 11, fontWeight: 'bold', color: '#6F42C1' },
  calEventTitle: { fontSize: 15, fontWeight: 'bold', color: '#333', marginTop: 2 },
  bottomActionBtn: { marginTop: 10, alignSelf: 'center', paddingVertical: 15 },
  bottomActionText: { color: '#6F42C1', fontWeight: 'bold', fontSize: 13, letterSpacing: 0.5 },
  evaluationsCard: {
    backgroundColor: '#FAF7F0',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E6DFD3',
    marginBottom: 25,
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  accordionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  accordionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D2D2D',
  },
  accordionCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8C8273',
    letterSpacing: 0.5,
  },
  accordionContent: {
    borderTopWidth: 1,
    borderTopColor: '#E6DFD3',
  },
  evalItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E6DFD3',
  },
  evalItemLast: {
    borderBottomWidth: 0,
  },
  evalIconWrapperOrange: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#FFEFE6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  evalIconWrapperBlue: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#EBF3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  evalInfo: {
    flex: 1,
  },
  evalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D2D2D',
    marginBottom: 6,
  },
  evalText: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  evalLabel: {
    fontWeight: 'bold',
    color: '#4B5563',
  },
});
