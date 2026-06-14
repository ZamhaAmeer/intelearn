import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Image,
    Modal,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const ThemeToggle = ({ isDark, onToggle }) => (
  <TouchableOpacity onPress={onToggle}>
    <MaterialCommunityIcons name={isDark ? 'moon-waning-crescent' : 'white-balance-sunny'} size={24} color={isDark ? '#FFD700' : '#FFA500'} />
  </TouchableOpacity>
);

export default function SettingsScreen() {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isDark, setIsDark] = useState(false);
  
  const toggleMenu = () => setMenuVisible(!isMenuVisible);

  // Mock Data for the lists
  const accountSettings = [
    { id: '1', title: 'Personal Information', icon: 'person-outline' },
    { id: '2', title: 'Notifications & Chat', icon: 'notifications-outline' },
    { id: '3', title: 'Privacy & Permissions', icon: 'shield-checkmark-outline' },
    { id: '4', title: 'Data & Storage', icon: 'server-outline' },
    { id: '5', title: 'Password & Account', icon: 'lock-closed-outline' },
  ];

  const moreSettings = [
    { id: '6', title: 'Help', icon: 'help-circle-outline' },
    { id: '7', title: 'Feedback', icon: 'chatbox-ellipses-outline' },
    { id: '8', title: 'About', icon: 'information-circle-outline' },
    { id: '9', title: 'Invite a Friend', icon: 'share-social-outline' },
  ];

  const renderSettingItem = (item) => (
    <TouchableOpacity key={item.id} style={styles.itemContainer} activeOpacity={0.7}>
      <View style={styles.itemLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={item.icon} size={20} color="#FFFFFF" />
        </View>
        <Text style={styles.itemTitle}>{item.title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#C4C4C4" />
    </TouchableOpacity>
  );

  const MenuOption = ({ iconName, title, active, onPress }) => (
  <TouchableOpacity style={[styles.menuOption, active && styles.activeMenuOption]} onPress={onPress}>
    <MaterialCommunityIcons name={iconName} size={24} color={active ? '#5C45C3' : '#666'} />
    <Text style={[styles.menuOptionText, active && styles.activeMenuOptionText]}>{title}</Text>
  </TouchableOpacity>
);


  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#3b2396" />
      
      {/* Curved Background Header Trick */}
      <View style={styles.headerBackground} />

      <View style={styles.container}>
        {/* Header Navigation */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="menu" size={32} color="#FFFFFF" onPress={toggleMenu}/>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
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
                      <MenuOption iconName="cog" title="Settings" onPress={() => { setMenuVisible(false); router.replace('/settingslec'); }} />
                    </View>
        
                    <TouchableOpacity style={styles.logoutButton} onPress={() => { setMenuVisible(false); router.replace('/loginPage_Lecturer'); }}>
                      <Text style={styles.logoutText}> Log Out    <MaterialCommunityIcons name="logout" size={24} color="grey" /></Text>
                    </TouchableOpacity>
        
                  </View>
                </TouchableOpacity>
              </Modal>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }} // Placeholder image
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.editBadge} activeOpacity={0.8}>
                <MaterialIcons name="edit" size={12} color="#000" />
              </TouchableOpacity>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Kimberly Mastrangelo</Text>
              <Text style={styles.profileEmail}>kimberly.m@design.io</Text>
            </View>
          </View>

          {/* Account Settings Section */}
          <Text style={styles.sectionHeader}>ACCOUNT SETTINGS</Text>
          <View style={styles.sectionCard}>
            {accountSettings.map(renderSettingItem)}
          </View>

          {/* More Section */}
          <Text style={styles.sectionHeader}>MORE</Text>
          <View style={styles.sectionCard}>
            {moreSettings.map(renderSettingItem)}
          </View>
          
          <View style={{ height: 40 }} /> {/* Bottom Padding */}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FCFCF4', // Light cream background
  },
  container: {
    flex: 1,
  },
  headerBackground: {
    position: 'absolute',
    top: -150,
    left: '-25%',
    width: '150%',
    height: 350,
    backgroundColor: '#3b2396', // Deep purple
    borderRadius: 300,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20, // Adjust depending on platform/notch
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 15,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E1E1E1',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FCFCF4',
  },
  profileInfo: {
    marginLeft: 20,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#4DA6E8', // Light blue text
    fontWeight: '400',
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#666666',
    letterSpacing: 1,
    marginBottom: 10,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: '#F3F4F8', // Very light grayish-blue wrapper
    borderRadius: 20,
    padding: 8,
    marginBottom: 30,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 6, // Space between items inside the card
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#6A52D4', // Brighter purple for the icons
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
  },
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