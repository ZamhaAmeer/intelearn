import { useRouter } from 'expo-router';
import { ArrowRight, Bell, BookOpen, Clock, Search, SlidersHorizontal } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import ReAnimated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

const TIMELINE_DATA = [
  {
    id: '1',
    date: 'SUNDAY, 17 MAY 2026',
    time: '16:00',
    title: 'Third Project Progress Journal Submission',
    course: 'Capstone Project',
    status: 'Due Soon',
    urgency: 'high',
  },
  {
    id: '2',
    date: 'MONDAY, 18 MAY 2026',
    time: '12:00',
    title: 'Quiz 02',
    course: 'IT Auditing',
    status: 'Incomplete',
    urgency: 'medium',
  },
  {
    id: '3',
    date: 'SATURDAY, 23 MAY 2026',
    time: '18:00',
    title: 'Assignment 02 Report Submission',
    course: 'IT Auditing',
    status: 'Upcoming',
    urgency: 'low',
  },
];


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
  React.useEffect(() => { progress.value = withSpring(isDark ? 1 : 0); }, [isDark]);

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


export default function Dashboard() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const filteredData = TIMELINE_DATA.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleMenu = () => setMenuVisible(!isMenuVisible);

  const getUrgencyStyles = (urgency) => {
    switch (urgency) {
      case 'high':
        return { bg: '#FFEBEE', text: '#D32F2F', indicator: '#EF5350' };
      case 'medium':
        return { bg: '#FFF3E0', text: '#E65100', indicator: '#FFB74D' };
      default:
        return { bg: '#E8F5E9', text: '#2E7D32', indicator: '#81C784' };
    }
  };

  return (
    <View style={[styles.container, isDark && { backgroundColor: '#121212' }]}>
      <StatusBar barStyle="light-content" backgroundColor={isDark ? '#1A1A1A' : '#4E33B3'} />

      
      <View style={[styles.header, isDark && { backgroundColor: '#1A1A1A' }]}>
        <SafeAreaView>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={toggleMenu} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Icon name="menu" size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.notificationBtn}>
              <Bell color="#FFF" size={24} />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>
          <Text style={styles.headerTitle}>Dashboard</Text>
        </SafeAreaView>
      </View>

    
      <View style={[styles.surfaceCard, isDark && { backgroundColor: '#121212' }]}>
        <View style={[styles.searchWrapper, isDark && { backgroundColor: '#2A2A2A' }]}>
          <Search color={isDark ? "#888" : "#AA99E5"} size={20} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, isDark && { color: '#FFF' }]}
            placeholder="Search activities or courses..."
            placeholderTextColor={isDark ? "#666" : "#A594F9"}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

  
        <View style={styles.timelineHeader}>
          <View>
            <Text style={[styles.timelineTitle, isDark && { color: '#FFF' }]}>Your Timeline</Text>
            <Text style={styles.timelineSubtitle}>{filteredData.length} active updates</Text>
          </View>
          <TouchableOpacity style={[styles.filterButton, isDark && { backgroundColor: '#333' }]}>
            <SlidersHorizontal color={isDark ? "#FFF" : "#4E33B3"} size={14} style={{ marginRight: 6 }} />
            <Text style={[styles.filterButtonText, isDark && { color: '#FFF' }]}>Next 30 days</Text>
          </TouchableOpacity>
        </View>

      
        <ScrollView 
          style={styles.feedScroll} 
          contentContainerStyle={{ paddingBottom: 130 }}
          showsVerticalScrollIndicator={false}
        >
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => {
              const theme = getUrgencyStyles(item.urgency);
              return (
                <View key={item.id} style={styles.timelineRow}>
                  
                  
                  <View style={styles.axisColumn}>
                    <View style={[styles.axisNode, { backgroundColor: theme.indicator }]} />
                    {index !== filteredData.length - 1 && <View style={[styles.axisTrack, isDark && { backgroundColor: '#333' }]} />}
                  </View>

                  
                  <Pressable 
                    style={({ pressed }) => [
                      styles.feedCard, 
                      isDark && { backgroundColor: '#1A1A1A', borderColor: '#2A2A2A' },
                      pressed && (isDark ? styles.cardPressedDark : styles.cardPressed)
                    ]}
                    onPress={() => alert(`Navigating to submission for: ${item.title}`)}
                  >
                    <View style={styles.cardTopBar}>
                      <View style={styles.metaRow}>
                        <Clock size={12} color="#7E57C2" style={{ marginRight: 4 }} />
                        <Text style={styles.cardTime}>{item.time} • </Text>
                        <Text style={styles.cardDate}>{item.date}</Text>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: theme.bg }]}>
                        <Text style={[styles.badgeText, { color: theme.text }]}>{item.status}</Text>
                      </View>
                    </View>

                    <Text style={[styles.assignmentTitle, isDark && { color: '#FFF' }]}>{item.title}</Text>

                    <View style={[styles.cardFooter, isDark && { borderTopColor: '#2A2A2A' }]}>
                      <View style={styles.courseTag}>
                        <BookOpen size={12} color="#4E33B3" style={{ marginRight: 6 }} />
                        <Text style={[styles.courseTitle, isDark && { color: '#B39DDB' }]} numberOfLines={1}>{item.course}</Text>
                      </View>
                      
                      <View style={styles.actionLink}>
                        <Text style={[styles.actionLinkText, isDark && { color: '#B39DDB' }]}>Submit</Text>
                        <ArrowRight size={14} color={isDark ? "#B39DDB" : "#4E33B3"} />
                      </View>
                    </View>
                  </Pressable>

                </View>
              );
            })
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Clear schedule! No tasks match your search.</Text>
            </View>
          )}
        </ScrollView>
      </View>

      
      <Modal transparent visible={isMenuVisible} animationType="fade" onRequestClose={toggleMenu}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={toggleMenu}>
          <View style={[styles.sideMenu, isDark && { backgroundColor: '#1A1A1A' }]} onStartShouldSetResponder={() => true}>
            <View style={styles.menuHeader}>
              <TouchableOpacity onPress={toggleMenu}>
                <Icon name="menu" size={30} color={isDark ? "white" : "#333"} />
              </TouchableOpacity>
            
            </View>

            <View style={styles.menuList}>
              <MenuOption iconName="home-variant" title="Home" onPress={() => {setMenuVisible(false); router.replace('/coursedetails')}} />
              <MenuOption iconName="account" title="Profile" onPress={() => {setMenuVisible(false); router.replace('/profilescreen_student')}} />
              <MenuOption iconName="view-dashboard" title="Dashboard" active onPress={() => {setMenuVisible(false); router.replace('/dashboard')}}  />
              <MenuOption iconName="controller-classic" title="Games" onPress={() => {setMenuVisible(false); router.replace('/minigamesection')}} />
              <MenuOption iconName="cog" title="Settings" onPress={() => {setMenuVisible(false); router.replace('/settings')}} />
            </View>
            
            <TouchableOpacity style={styles.logoutButton} onPress={() => {setMenuVisible(false); router.replace('/loginpage(student)') }}>
              <Text style={styles.logoutText}> Log Out    <Icon name="logout" size={24} color="grey" /></Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#4E33B3' },
  header: { backgroundColor: '#4E33B3', paddingHorizontal: 24, paddingBottom: 20 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  notificationBtn: { padding: 4, position: 'relative' },
  notificationDot: {
    position: 'absolute', top: 4, right: 4, width: 8, height: 8,
    backgroundColor: '#FF5252', borderRadius: 4, borderWidth: 1.5, borderColor: '#4E33B3',
  },
  headerTitle: { fontSize: 30, fontWeight: '800', color: '#FFF', marginTop: 15, letterSpacing: -0.5 },
  surfaceCard: {
    flex: 1, backgroundColor: '#FEFDF0', borderTopLeftRadius: 32, borderTopRightRadius: 32,
    paddingHorizontal: 24, paddingTop: 24,
  },
  searchWrapper: { flexDirection: 'row', backgroundColor: '#E8E4FF', borderRadius: 20, alignItems: 'center', height: 50, paddingHorizontal: 16, marginBottom: 24 },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, fontSize: 15, color: '#311B92', fontWeight: '500' },
  timelineHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  timelineTitle: { fontSize: 20, fontWeight: '800', color: '#1A1A1A' },
  timelineSubtitle: { fontSize: 12, color: '#757575', fontWeight: '500', marginTop: 2 },
  filterButton: { flexDirection: 'row', backgroundColor: '#C4B5FD', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, alignItems: 'center' },
  filterButtonText: { color: '#311B92', fontWeight: '700', fontSize: 12 },
  feedScroll: { flex: 1 },
  timelineRow: { flexDirection: 'row', minHeight: 125 },
  axisColumn: { alignItems: 'center', marginRight: 16, width: 16 },
  axisNode: { width: 12, height: 12, borderRadius: 6, marginTop: 20, zIndex: 2, borderWidth: 2, borderColor: '#FEFDF0' },
  axisTrack: { position: 'absolute', top: 26, bottom: -10, width: 2, backgroundColor: '#E2DFD2', zIndex: 1 },
  feedCard: {
    flex: 1, backgroundColor: '#FFF', borderRadius: 20, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#F4F2E4',
    shadowColor: '#4E33B3', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 2,
  },
  cardPressed: { transform: [{ scale: 0.99 }], backgroundColor: '#FAFAF5' },
  cardPressedDark: { transform: [{ scale: 0.99 }], backgroundColor: '#222' },
  cardTopBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  cardTime: { fontSize: 12, color: '#7E57C2', fontWeight: '700' },
  cardDate: { fontSize: 11, fontWeight: '600', color: '#888' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  badgeText: { fontSize: 10, fontWeight: '700' },
  assignmentTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A1A', lineHeight: 20, marginBottom: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#FDFCEF', paddingTop: 10 },
  courseTag: { flexDirection: 'row', alignItems: 'center', flex: 0.75 },
  courseTitle: { fontSize: 12, color: '#4E33B3', fontWeight: '600' },
  actionLink: { flexDirection: 'row', alignItems: 'center' },
  actionLinkText: { color: '#4E33B3', fontSize: 13, fontWeight: '700', marginRight: 4 },
  emptyContainer: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: '#7E57C2', fontSize: 14, fontWeight: '500' },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'flex-start' },
  sideMenu: { width: width * 0.7, height: '100%', backgroundColor: 'white', padding: 20, borderTopRightRadius: 20, borderBottomRightRadius: 20, elevation: 10 },
  menuHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, marginTop: 20 },
  menuList: { flex: 1 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 15, borderRadius: 12, marginBottom: 8 },
  activeMenuItem: { backgroundColor: '#E8E4FF' },
  pressedMenuItem: { backgroundColor: '#D1C4E9', transform: [{ scale: 0.97 }] },
  menuItemIcon: { marginRight: 15 },
  menuItemText: { fontSize: 16, color: '#333', fontWeight: '500' },
  activeMenuText: { color: '#4E33B3', fontWeight: 'bold' },
  logoutButton: { borderTopWidth: 1, borderTopColor: '#eee', paddingVertical: 20, alignItems: 'center' },
  logoutText: { fontSize: 18, color: 'grey' },
  toggleTrack: { width: 75, height: 38, borderRadius: 20, padding: 4, justifyContent: 'center' },
  toggleIconsLayer: { ...StyleSheet.absoluteFillObject, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10 },
  toggleThumb: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#4E33B3', justifyContent: 'center', alignItems: 'center', elevation: 4, zIndex: 2 },
});