import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

export default function SettingsScreen() {
  const router = useRouter();

  // Navigation Menu State
  const [isMenuVisible, setMenuVisible] = useState(false);
  const toggleMenu = () => setMenuVisible(!isMenuVisible);

  // States for toggle switches
  const [autoSummarize, setAutoSummarize] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <View style={styles.container}>
      
      {/* --- SIDE NAVIGATION MENU --- */}
      <Modal
        transparent={true}
        visible={isMenuVisible}
        animationType="fade"
        onRequestClose={toggleMenu}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={toggleMenu}
        >
          <View style={styles.sideMenu}>
            <View style={styles.menuHeader}>
              <TouchableOpacity onPress={toggleMenu}>
                 <Text style={styles.closeMenuText}>☰</Text>
              </TouchableOpacity>
              <Text style={styles.moonIcon}>🌙</Text>
            </View>

            <View style={styles.menuList}>
              <TouchableOpacity onPress={() => {setMenuVisible(false); router.replace('/coursedetails') }}>
                <MenuOption icon="🏠" title="Home" />
              </TouchableOpacity>  
              <TouchableOpacity onPress={() => {setMenuVisible(false); router.replace('/profilescreen') }}>
                <MenuOption icon="👤" title="Profile" />
              </TouchableOpacity>
              <MenuOption icon="📊" title="Dashboard" />
              <MenuOption icon="🎮" title="Games" />
              <MenuOption icon="🛡️" title="Privacy" />
              <TouchableOpacity onPress={toggleMenu}>
                <MenuOption icon="⚙️" title="Settings" active={true} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.logoutButton} 
              onPress={() => {setMenuVisible(false); router.replace('/loginpage(student)') }}
            >
              <Text style={styles.logoutText}><Icon name="logout" size={24} color="red" /> Log Out</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* --- HEADER SECTION --- */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* ACCOUNT SECTION */}
        <Text style={styles.sectionHeader}>ACCOUNT</Text>
        <View style={styles.sectionCard}>
          <TouchableOpacity 
            style={styles.profileRow} 
            onPress={() => router.push('/profilescreen')}
          >
            <Image 
              source={require("../../assets/images/pr2.jpg")} 
              style={styles.avatar} 
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Alex Rivera</Text>
              <Text style={styles.profileEmail}>alex.rivera@edu-mail.com</Text>
            </View>
            <Text style={styles.arrow}>❯</Text>
          </TouchableOpacity>
          
          <View style={styles.separator} />
          
          <TouchableOpacity style={styles.itemRow}>
            <View style={[styles.iconBox, { backgroundColor: '#E8E4FF' }]}>
              <Text style={{color: '#4E33B3'}}>🏅</Text>
            </View>
            <Text style={styles.itemLabel}>Subscription Plan</Text>
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumText}>PREMIUM</Text>
            </View>
            <Text style={styles.arrow}>❯</Text>
          </TouchableOpacity>
        </View>

        {/* AI PREFERENCES SECTION */}
        <Text style={styles.sectionHeader}>AI PREFERENCES</Text>
        <View style={styles.sectionCard}>
          <SettingItem icon="🧠" label="AI Tutor Personality" hasArrow />
          <View style={styles.separator} />
          <View style={styles.itemRow}>
            <View style={[styles.iconBox, { backgroundColor: '#E8E4FF' }]}>
              <Text>📖</Text>
            </View>
            <Text style={styles.itemLabel}>Auto-summarization</Text>
            <Switch
              value={autoSummarize}
              onValueChange={setAutoSummarize}
              trackColor={{ false: '#767577', true: '#4E33B3' }}
              thumbColor={'#fff'}
            />
          </View>
          <View style={styles.separator} />
          <SettingItem icon="文A" label="Prefered AI Language" valueText="English (US)" hasArrow />
        </View>

        {/* NOTIFICATIONS SECTION */}
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
             <Text style={styles.itemLabel}>Weekly Study Summary</Text>
             <Switch value={weeklySummary} onValueChange={setWeeklySummary} trackColor={{ false: '#767577', true: '#4E33B3' }} />
          </View>
        </View>

        {/* APP SETTINGS */}
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
            onPress={() => router.replace('/loginpage')}
          >
             <View style={[styles.iconBox, { backgroundColor: '#FFE8E8' }]}><Text>🚪</Text></View>
             <Text style={[styles.itemLabel, { color: '#FF4B4B' }]}>Sign Out</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

// Reusable component for Side Menu Items
const MenuOption = ({ icon, title, active }) => (
  <View style={[styles.menuItem, active && styles.activeMenuItem]}>
    <Text style={styles.menuItemIcon}>{icon}</Text>
    <Text style={[styles.menuItemText, active && styles.activeMenuText]}>{title}</Text>
  </View>
);

// Helper component for Setting Rows
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
  // --- SIDE MENU STYLES ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-start',
  },
  sideMenu: {
    width: width * 0.6,
    height: '100%',
    backgroundColor: 'white',
    padding: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 10,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    marginTop: 20,
  },
  closeMenuText: { fontSize: 24, color: '#333' },
  moonIcon: { fontSize: 20 },
  menuList: { flex: 1 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 5,
  },
  activeMenuItem: { backgroundColor: '#C3B9EA' },
  menuItemIcon: { fontSize: 18, marginRight: 15 },
  menuItemText: { fontSize: 16, color: '#333', fontWeight: '500' },
  activeMenuText: { color: '#000', fontWeight: 'bold' },
  logoutButton: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 20,
    alignItems: 'center',
  },
  logoutText: { fontSize: 18, fontWeight: 'bold', color: '#000' },

  // --- SETTINGS STYLES ---
  header: {
    backgroundColor: '#4E33B3',
    height: 140,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop : -30,
  },
  menuButton: { position: 'absolute', left: 20, top: 40 ,marginTop : 40,},
  menuIcon: { color: 'white', fontSize: 24 },
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
  profileName: { fontSize: 18, fontWeight: 'bold' },
  profileEmail: { fontSize: 13, color: '#888' },
  itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15 },
  iconBox: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  itemLabel: { flex: 1, fontSize: 16, marginLeft: 15, color: '#333' },
  arrow: { fontSize: 18, color: '#333', marginLeft: 10 },
  separator: { height: 1, backgroundColor: '#eee', width: '100%' },
  premiumBadge: { backgroundColor: '#C3B9EA', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  premiumText: { color: '#4E33B3', fontSize: 12, fontWeight: 'bold' },
  valueText: { color: '#888', fontSize: 14 },
});