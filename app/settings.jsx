import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { useGlobalTheme } from './themeStore';
import {
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
import { Ionicons, MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const LANGUAGES = [
  { code: 'English', label: 'English (US)', flag: '🇺🇸' },
  { code: 'Tamil', label: 'Tamil (தமிழ்)', flag: '🇱🇰' },
  { code: 'Sinhala', label: 'Sinhala (සිංහල)', flag: '🇱🇰' }
];

export default function SettingsScreen() {
  const router = useRouter();

  // Navigation Menu State
  const [isMenuVisible, setMenuVisible] = useState(false);
  const toggleMenu = () => setMenuVisible(!isMenuVisible);

  // States for toggle switches
  const [autoSummarize, setAutoSummarize] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkMode, setDarkMode] = useGlobalTheme();

  // Preferred AI Language State
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [isLangModalVisible, setLangModalVisible] = useState(false);

  // Profile data states
  const [profileName, setProfileName] = useState('Alex Rivera');
  const [profileEmail, setProfileEmail] = useState('alex.rivera@edu-mail.com');

  useEffect(() => {
    let isMounted = true;

    const loadSettingsData = async () => {
      try {
        // Load saved preferred language
        const savedLang = await AsyncStorage.getItem('aiLanguage');
        if (savedLang && isMounted) {
          setSelectedLanguage(savedLang);
        }

        const storedEmail = await AsyncStorage.getItem('userEmail');
        if (storedEmail) {
          const url = `http://172.22.236.72:3000/get-profile?email=${encodeURIComponent(storedEmail.trim())}`;
          const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          });
          if (response.ok) {
            const data = await response.json();
            if (isMounted) {
              setProfileName(data.full_name || 'Alex Rivera');
              setProfileEmail(data.email || storedEmail);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user data in settings:", error);
      }
    };

    loadSettingsData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectLanguage = async (lang) => {
    setSelectedLanguage(lang.code);
    try {
      await AsyncStorage.setItem('aiLanguage', lang.code);
    } catch (e) {
      console.error("Error saving language preference:", e);
    }
    setLangModalVisible(false);
  };

  const handleDarkModeToggle = async (val) => {
    setDarkMode(val);
  };

  const getLanguageLabel = () => {
    if (selectedLanguage === 'Tamil') return 'Tamil (தமிழ்)';
    if (selectedLanguage === 'Sinhala') return 'Sinhala (සිංහල)';
    return 'English (US)';
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

  return (
    <View style={[styles.container, darkMode && { backgroundColor: '#121212' }]}>

      {/* Side Menu Modal */}
      <Modal transparent visible={isMenuVisible} animationType="fade" onRequestClose={toggleMenu}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={toggleMenu}>
          <View style={[styles.sideMenu, darkMode && { backgroundColor: '#1E1E1E' }]}>
            <View style={styles.menuHeader}>
              <TouchableOpacity onPress={toggleMenu}>
                <Icon name="menu" size={30} color={darkMode ? "white" : "#333"} />
              </TouchableOpacity>
            </View>

            <View style={styles.menuList}>
              <MenuOption iconName="home-variant" title="Home" onPress={() => { setMenuVisible(false); router.replace('/coursedetails'); }} />
              <MenuOption iconName="account" title="Profile" onPress={() => { setMenuVisible(false); router.replace('/profilescreen_Student'); }} />
              <MenuOption iconName="view-dashboard" title="Dashboard" onPress={() => { setMenuVisible(false); router.replace('/dashboard_student'); }} />
              <MenuOption iconName="shield-check" title="Privacy" onPress={() => { setMenuVisible(false); router.replace('/privacy'); }} />
              <MenuOption iconName="cog" title="Settings" active onPress={() => { setMenuVisible(false); router.replace('/settings'); }} />
            </View>
            <TouchableOpacity style={[styles.logoutButton, darkMode && { borderTopColor: '#333' }]} onPress={() => { setMenuVisible(false); router.replace('/loginpage(student)'); }}>
              <Text style={[styles.logoutText, darkMode && { color: '#AAA' }]}> Log Out    <Icon name="logout" size={24} color={darkMode ? "#AAA" : "grey"} /></Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* LANGUAGE SELECTION MODAL */}
      <Modal transparent visible={isLangModalVisible} animationType="slide" onRequestClose={() => setLangModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setLangModalVisible(false)}>
          <View style={[styles.langModalPanel, darkMode && { backgroundColor: '#1E1E1E' }]} onStartShouldSetResponder={() => true}>
            <Text style={[styles.langModalTitle, darkMode && { color: '#FFF' }]}>Select Preferred AI Language</Text>
            <Text style={[styles.langModalSub, darkMode && { color: '#AAA' }]}>Chatbot Dhruv & Maya will converse with you in your selected language.</Text>

            {LANGUAGES.map((lang) => {
              const isSelected = selectedLanguage === lang.code;
              return (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.langOptionCard,
                    isSelected && styles.langOptionSelected,
                    darkMode && { backgroundColor: '#2A2A2A', borderColor: '#3A3A3A' },
                    isSelected && darkMode && { backgroundColor: '#2A2440', borderColor: '#B39DDB' }
                  ]}
                  onPress={() => handleSelectLanguage(lang)}
                >
                  <Text style={{ fontSize: 24, marginRight: 12 }}>{lang.flag}</Text>
                  <Text style={[styles.langOptionText, isSelected && styles.langOptionTextSelected, darkMode && { color: '#EEE' }, isSelected && darkMode && { color: '#B39DDB' }]}>
                    {lang.label}
                  </Text>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={22} color={darkMode ? "#B39DDB" : "#4E33B3"} style={{ marginLeft: 'auto' }} />
                  )}
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity style={styles.closeLangModalBtn} onPress={() => setLangModalVisible(false)}>
              <Text style={[styles.closeLangModalText, darkMode && { color: '#AAA' }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* --- HEADER SECTION --- */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
          <Ionicons name="menu" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* ACCOUNT SECTION */}
        <Text style={[styles.sectionHeader, darkMode && { color: '#B39DDB' }]}>ACCOUNT</Text>
        <View style={[styles.sectionCard, darkMode && { backgroundColor: '#1A1A1A', borderColor: '#2A2A2A' }]}>
          <TouchableOpacity
            style={styles.profileRow}
            onPress={() => router.push('/profilescreen_Student')}
          >
            <Image
              source={require("../src/assets/images/pr2.jpg")}
              style={styles.avatar}
            />
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, darkMode && { color: '#FFF' }]}>{profileName}</Text>
              <Text style={[styles.profileEmail, darkMode && { color: '#AAA' }]}>{profileEmail}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={darkMode ? "#AAA" : "#888"} />
          </TouchableOpacity>
        </View>

        {/* AI PREFERENCES SECTION */}
        <Text style={[styles.sectionHeader, darkMode && { color: '#B39DDB' }]}>AI PREFERENCES</Text>
        <View style={[styles.sectionCard, darkMode && { backgroundColor: '#1A1A1A', borderColor: '#2A2A2A' }]}>
          <View style={styles.itemRow}>
            <View style={[styles.iconBox, { backgroundColor: darkMode ? '#2A2A2A' : '#E8E4FF' }]}>
              <Ionicons name="book" size={20} color={darkMode ? '#B39DDB' : '#4E33B3'} />
            </View>
            <Text style={[styles.itemLabel, darkMode && { color: '#FFF' }]}>Auto-summarization</Text>
            <Switch
              value={autoSummarize}
              onValueChange={setAutoSummarize}
              trackColor={{ false: '#767577', true: '#4E33B3' }}
              thumbColor={'#fff'}
            />
          </View>
          <View style={styles.separator} />

          <SettingItem
            iconName="language"
            label="Preferred AI Language"
            valueText={getLanguageLabel()}
            hasArrow
            onPress={() => setLangModalVisible(true)}
            darkMode={darkMode}
          />
        </View>

        {/* NOTIFICATIONS SECTION */}
        <Text style={[styles.sectionHeader, darkMode && { color: '#B39DDB' }]}>NOTIFICATIONS</Text>
        <View style={[styles.sectionCard, darkMode && { backgroundColor: '#1A1A1A', borderColor: '#2A2A2A' }]}>
          <View style={styles.itemRow}>
            <View style={[styles.iconBox, { backgroundColor: darkMode ? '#2A2A2A' : '#E8E4FF' }]}>
              <Ionicons name="notifications" size={20} color={darkMode ? '#B39DDB' : '#4E33B3'} />
            </View>
            <Text style={[styles.itemLabel, darkMode && { color: '#FFF' }]}>Push Notifications</Text>
            <Switch value={pushNotifications} onValueChange={setPushNotifications} trackColor={{ false: '#767577', true: '#4E33B3' }} />
          </View>
        </View>

        {/* APP SETTINGS */}
        <Text style={[styles.sectionHeader, darkMode && { color: '#B39DDB' }]}>APP SETTINGS</Text>
        <View style={[styles.sectionCard, darkMode && { backgroundColor: '#1A1A1A', borderColor: '#2A2A2A' }]}>
          <View style={styles.itemRow}>
            <View style={[styles.iconBox, { backgroundColor: darkMode ? '#2A2A2A' : '#E8E4FF' }]}>
              <Ionicons name="moon" size={20} color={darkMode ? '#B39DDB' : '#4E33B3'} />
            </View>
            <Text style={[styles.itemLabel, darkMode && { color: '#FFF' }]}>Dark Mode</Text>
            <Switch value={darkMode} onValueChange={handleDarkModeToggle} trackColor={{ false: '#767577', true: '#4E33B3' }} />
          </View>
          <View style={styles.separator} />

          <SettingItem
            iconName="shield-checkmark"
            label="Privacy"
            hasArrow
            onPress={() => router.push('/privacy')}
            darkMode={darkMode}
          />

          <View style={styles.separator} />
          <TouchableOpacity
            style={styles.itemRow}
            onPress={() => router.replace('/loginpage(student)')}
          >
            <View style={[styles.iconBox, { backgroundColor: '#FFE8E8' }]}>
              <Ionicons name="log-out" size={20} color="#FF4B4B" />
            </View>
            <Text style={[styles.itemLabel, { color: '#FF4B4B' }]}>Sign Out</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

// Helper component for Setting Rows
const SettingItem = ({ iconName, label, valueText, hasArrow, onPress, darkMode }) => (
  <TouchableOpacity style={styles.itemRow} onPress={onPress}>
    <View style={[styles.iconBox, { backgroundColor: darkMode ? '#2A2A2A' : '#E8E4FF' }]}>
      <Ionicons name={iconName} size={20} color={darkMode ? '#B39DDB' : '#4E33B3'} />
    </View>
    <Text style={[styles.itemLabel, darkMode && { color: '#FFF' }]}>{label}</Text>
    {valueText && <Text style={[styles.valueText, darkMode && { color: '#B39DDB' }]}>{valueText}</Text>}
    {hasArrow && <Ionicons name="chevron-forward" size={18} color={darkMode ? "#AAA" : "#888"} />}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FEFDF0' },
  // --- SIDE MENU STYLES ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sideMenu: { width: width * 0.6, height: '100%', backgroundColor: 'white', padding: 20, borderTopRightRadius: 20, borderBottomRightRadius: 20, elevation: 10, alignSelf: 'flex-start' },
  menuHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40, marginTop: 20, alignItems: 'center' },
  menuList: { flex: 1 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 15, borderRadius: 12, marginBottom: 8 },
  activeMenuItem: { backgroundColor: '#E8E4FF' },
  pressedMenuItem: { backgroundColor: '#D1C4E9', transform: [{ scale: 0.97 }] },
  menuItemIcon: { marginRight: 15 },
  menuItemText: { fontSize: 16, color: '#333', fontWeight: '500' },
  activeMenuText: { color: '#4E33B3', fontWeight: 'bold' },
  logoutButton: { borderTopWidth: 1, borderTopColor: '#eee', paddingVertical: 20, alignItems: 'center' },
  logoutText: { fontSize: 18, fontWeight: '400', color: 'grey' },

  // --- SETTINGS STYLES ---
  header: {
    backgroundColor: '#4E33B3',
    height: 140,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -30,
  },
  menuButton: { position: 'absolute', left: 20, top: 40, marginTop: 40, },
  headerTitle: { color: 'white', fontSize: 24, fontWeight: 'bold', marginTop: 50 },
  scrollContent: { padding: 20 },
  sectionHeader: { fontSize: 12, fontWeight: 'bold', color: '#888', marginTop: 15, marginBottom: 8, marginLeft: 5 },
  sectionCard: { backgroundColor: 'white', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 4, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3 },
  profileRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  profileEmail: { fontSize: 12, color: '#888', marginTop: 2 },
  itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  iconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  itemLabel: { flex: 1, fontSize: 15, color: '#333', fontWeight: '500' },
  valueText: { fontSize: 13, color: '#888', marginRight: 6 },
  separator: { height: 1, backgroundColor: '#F0F0F0' },

  // --- LANGUAGE MODAL STYLES ---
  langModalPanel: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  langModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  langModalSub: {
    fontSize: 13,
    color: '#666',
    marginBottom: 20,
    lineHeight: 18,
  },
  langOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F8FF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E8E4FF',
  },
  langOptionSelected: {
    backgroundColor: '#EEF0FF',
    borderColor: '#4E33B3',
    borderWidth: 2,
  },
  langOptionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#444',
  },
  langOptionTextSelected: {
    color: '#4E33B3',
    fontWeight: 'bold',
  },
  closeLangModalBtn: {
    marginTop: 10,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  closeLangModalText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
  }
});