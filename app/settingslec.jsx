import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

export default function LecturerSettingsScreen() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isMenuVisible, setMenuVisible] = useState(false);
  const toggleMenu = () => setMenuVisible(!isMenuVisible);

  // Lecturer-specific state preferences
  const [autoGenerateQuiz, setAutoGenerateQuiz] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [weeklyAnalytics, setWeeklyAnalytics] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const checkSessionAndFetch = async () => {
      try {
        // MATCHED: Reading 'lecturerEmail' populated by LoginPage
        const storedEmail = await AsyncStorage.getItem('lecturerEmail');
        
        if (storedEmail) {
          await fetchLecturerData(storedEmail);
        } else {
          setIsLoading(false);
          Alert.alert(
            "Session Missing",
            "Please sign in again to configure your application parameters.",
            [{ text: "Login", onPress: () => router.replace('/loginPage_Lecturer') }]
          );
        }
      } catch (e) {
        console.error("Settings profile link setup failed:", e);
        setIsLoading(false);
      }
    };

    checkSessionAndFetch();
  }, []);

  const fetchLecturerData = async (userEmail) => {
    try {
      setIsLoading(true);
      const url = `http://172.20.10.3:3000/get-profile?email=${encodeURIComponent(userEmail)}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        setFullName(data.full_name || 'INTELEARN Lecturer');
        setEmail(data.email || userEmail);
      } else {
        console.error("Database sync drop context mismatch inside parameters configuration.");
        // Fallback context values if the request drops but session email is real
        setFullName('Faculty Member');
        setEmail(userEmail);
      }
    } catch (error) {
      console.error("Network interface connection failure downstream:", error);
      // Ensure the text fallback updates if network times out completely
      setFullName('Faculty Member');
      setEmail(userEmail);
    } finally {
      setIsLoading(false);
    }
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
      {({ pressed }) => (
        <>
          <Icon name={iconName} size={22} color={active || pressed ? "#4E33B3" : "#7E57C2"} style={styles.menuItemIcon} />
          <Text style={[styles.menuItemText, (active || pressed) && styles.activeMenuText]}>{title}</Text>
        </>
      )}
    </Pressable>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4E33B3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      {/* Side Navigation Drawer */}
      <Modal transparent visible={isMenuVisible} animationType="fade" onRequestClose={toggleMenu}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={toggleMenu}>
          <View style={styles.sideMenu} onStartShouldSetResponder={() => true}>
            <View style={styles.menuHeader}>
              <TouchableOpacity onPress={toggleMenu}><Icon name="menu" size={30} color="#333" /></TouchableOpacity>
            </View>
            <View style={styles.menuList}>
              <MenuOption iconName="home-variant" title="Home" onPress={() => {setMenuVisible(false); router.replace('/coursedetailsforlecturer')}} />
              <MenuOption iconName="account" title="Profile" onPress={() => {setMenuVisible(false); router.replace('/profilescreen_lecturer')}} />
              <MenuOption iconName="view-dashboard" title="Dashboard" onPress={() => {setMenuVisible(false); router.replace('/dashboard_lecturer')}} />
              <MenuOption iconName="cog" title="Settings" active onPress={() => {setMenuVisible(false); router.replace('/settingslec')}}  />
            </View>
            <TouchableOpacity 
              style={styles.logoutButton} 
              onPress={async () => {
                setMenuVisible(false); 
                // Clean all lecturer context markers on log out
                await AsyncStorage.removeItem('lecturerEmail');
                await AsyncStorage.removeItem('token');
                await AsyncStorage.removeItem('fullName');
                router.replace('/loginPage_Lecturer)');
              }}
            >
              <Text style={styles.logoutText}> Log Out   <Icon name="logout" size={24} color="grey" /></Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
          <Icon name="menu" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Account Section */}
        <Text style={styles.sectionHeader}>FACULTY ACCOUNT</Text>
        <View style={styles.sectionCard}>
          <TouchableOpacity 
            style={styles.profileRow} 
            onPress={() => router.push('/profilescreen_lecturer')}
          >
            <Image 
              source={profileImage ? { uri: profileImage } : require("../src/assets/images/pr2.jpg")} 
              style={styles.avatar} 
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName} numberOfLines={1}>{fullName}</Text>
              <Text style={styles.profileEmail} numberOfLines={1}>{email}</Text>
            </View>
            <Text style={styles.arrow}>❯</Text>
          </TouchableOpacity>
          
          <View style={styles.separator} />
          
          <TouchableOpacity style={styles.itemRow}>
            <View style={[styles.iconBox, { backgroundColor: '#E8E4FF' }]}>
              <Text style={{color: '#4E33B3'}}>🏅</Text>
            </View>
            <Text style={styles.itemLabel}>Institution Access Plan</Text>
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumText}>FACULTY</Text>
            </View>
            <Text style={styles.arrow}>❯</Text>
          </TouchableOpacity>
        </View>

        {/* AI Educator Preferences */}
        <Text style={styles.sectionHeader}>AI GENERATION PREFERENCES</Text>
        <View style={styles.sectionCard}>
          <SettingItem icon="🧠" label="AI Assistant Tone" hasArrow />
          <View style={styles.separator} />
          <View style={styles.itemRow}>
            <View style={[styles.iconBox, { backgroundColor: '#E8E4FF' }]}>
              <Text>📝</Text>
            </View>
            <Text style={styles.itemLabel}>Auto-generate Question Banks</Text>
            <Switch
              value={autoGenerateQuiz}
              onValueChange={setAutoGenerateQuiz}
              trackColor={{ false: '#767577', true: '#4E33B3' }}
              thumbColor={'#fff'}
            />
          </View>
          <View style={styles.separator} />
          <SettingItem icon="文A" label="Preferred Evaluation Language" valueText="English (US)" hasArrow />
        </View>

        {/* Notification Settings */}
        <Text style={styles.sectionHeader}>NOTIFICATIONS</Text>
        <View style={styles.sectionCard}>
          <View style={styles.itemRow}>
             <View style={[styles.iconBox, { backgroundColor: '#E8E4FF' }]}><Text>🔔</Text></View>
             <Text style={styles.itemLabel}>Push Notifications</Text>
             <Switch value={pushNotifications} onValueChange={setPushNotifications} trackColor={{ false: '#767577', true: '#4E33B3' }} />
          </View>
          <View style={styles.separator} />
          <View style={styles.itemRow}>
             <View style={[styles.iconBox, { backgroundColor: '#E8E4FF' }]}><Text>📊</Text></View>
             <Text style={styles.itemLabel}>Weekly Batch Analytics Report</Text>
             <Switch value={weeklyAnalytics} onValueChange={setWeeklyAnalytics} trackColor={{ false: '#767577', true: '#4E33B3' }} />
          </View>
        </View>

        {/* Core App Settings */}
        <Text style={styles.sectionHeader}>APP SETTINGS</Text>
        <View style={styles.sectionCard}>
          <View style={styles.itemRow}>
             <View style={[styles.iconBox, { backgroundColor: '#E8E4FF' }]}><Text>🌙</Text></View>
             <Text style={styles.itemLabel}>Dark Mode</Text>
             <Switch value={darkMode} onValueChange={setDarkMode} trackColor={{ false: '#767577', true: '#4E33B3' }} />
          </View>
          <View style={styles.separator} />
          <TouchableOpacity 
            style={styles.itemRow}
            onPress={async () => {
              // Clean lecturer items explicitly on logout link
              await AsyncStorage.removeItem('lecturerEmail');
              await AsyncStorage.removeItem('token');
              await AsyncStorage.removeItem('fullName');
              router.replace('/loginPage_Lecturer');
            }}
          >
             <View style={[styles.iconBox, { backgroundColor: '#FFE8E8' }]}><Text>🚪</Text></View>
             <Text style={[styles.itemLabel, { color: '#FF4B4B' }]}>Sign Out</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const SettingItem = ({ icon, label, valueText, hasArrow }) => (
  <TouchableOpacity style={styles.itemRow}>
    <View style={[styles.iconBox, { backgroundColor: '#E8E4FF' }]}>
      <Text>{icon}</Text>
    </View>
    <Text style={styles.itemLabel}>{label}</Text>
    {valueText && <Text style={styles.valueText}>{valueText}</Text>}
    {hasArrow && <Text style={styles.arrow}>❯</Text>}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FEFDF0' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FEFDF0' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-start',
  },
  sideMenu: { width: width * 0.7, height: '100%', backgroundColor: 'white', padding: 20, borderTopRightRadius: 20, borderBottomRightRadius: 20, elevation: 10 },
  menuHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40, marginTop: 20 },
  menuList: { flex: 1 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 15, borderRadius: 12, marginBottom: 8 },
  activeMenuItem: { backgroundColor: '#E8E4FF' },
  pressedMenuItem: { backgroundColor: '#D1C4E9', transform: [{ scale: 0.97 }] },
  menuItemIcon: { marginRight: 15 },
  menuItemText: { fontSize: 16, color: '#333', fontWeight: '500' },
  activeMenuText: { color: '#4E33B3', fontWeight: 'bold' },
  logoutButton: { borderTopWidth: 1, borderTopColor: '#eee', paddingVertical: 20, alignItems: 'center' },
  logoutText: { fontSize: 18, color: 'grey' },

  header: {
    backgroundColor: '#4E33B3',
    height: 140,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -30,
  },
  menuButton: { position: 'absolute', left: 20, top: 40, marginTop: 40 },
  headerTitle: { color: 'white', fontSize: 24, fontWeight: 'bold', marginTop: 50 },
  scrollContent: { padding: 20 },
  sectionHeader: { fontSize: 14, fontWeight: 'bold', color: '#888', marginBottom: 10, marginTop: 20 },
  sectionCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  profileRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 20 },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  profileInfo: { flex: 1, marginLeft: 15 },
  profileName: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
  profileEmail: { fontSize: 13, color: '#888', marginTop: 2 },
  itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15 },
  iconBox: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  itemLabel: { flex: 1, fontSize: 16, marginLeft: 15, color: '#333' },
  arrow: { fontSize: 18, color: '#333', marginLeft: 10 },
  separator: { height: 1, backgroundColor: '#eee', width: '100%' },
  premiumBadge: { backgroundColor: '#C3B9EA', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  premiumText: { color: '#4E33B3', fontSize: 12, fontWeight: 'bold' },
  valueText: { color: '#888', fontSize: 14 },
});