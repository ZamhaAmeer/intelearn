import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions, 
  ActivityIndicator,
  Image
} from 'react-native';
import { Slot, useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

// Sidebar menu items list
const MENU_ITEMS = [
  { name: 'Dashboard', icon: 'grid-outline', route: '/admin/dashboard' },
  { name: 'Students', icon: 'school-outline', route: '/admin/students' },
  { name: 'Lecturers', icon: 'people-outline', route: '/admin/lecturers' },
  { name: 'Faculties', icon: 'business-outline', route: '/admin/faculties' },
  { name: 'Emotional Analytics', icon: 'analytics-outline', route: '/admin/emotions' },
  { name: 'Learning Resources', icon: 'folder-open-outline', route: '/admin/resources' },
  { name: 'Announcements', icon: 'megaphone-outline', route: '/admin/announcements' },
  { name: 'Settings', icon: 'settings-outline', route: '/admin/settings' },
];

export default function AdminLayout() {
  const router = useRouter();
  const pathname = usePathname();
  
  // Navigation states
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(null);
  const [adminProfile, setAdminProfile] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(width > 768);

  // Monitor screen resizing for web/native responsiveness
  useEffect(() => {
    const handleResize = ({ window }) => {
      setIsLargeScreen(window.width > 768);
    };

    const subscription = Dimensions.addEventListener('change', handleResize);
    return () => subscription.remove();
  }, []);

  // Authentication status check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('adminToken');
        const profile = await AsyncStorage.getItem('adminProfile');
        
        if (token) {
          setIsAdminLoggedIn(true);
          if (profile) {
            setAdminProfile(JSON.parse(profile));
          }
        } else {
          setIsAdminLoggedIn(false);
          // Only redirect if they are not already on the login page
          if (pathname !== '/admin') {
            router.replace('/admin');
          }
        }
      } catch (error) {
        console.error('Failed checking authentication', error);
        setIsAdminLoggedIn(false);
      }
    };
    
    checkAuth();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('adminToken');
      await AsyncStorage.removeItem('adminProfile');
      setIsAdminLoggedIn(false);
      setIsMobileMenuOpen(false);
      router.replace('/admin');
    } catch (error) {
      console.error('Logout error', error);
    }
  };

  // While checking login, show a loading wheel
  if (isAdminLoggedIn === null) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#5B3CC2" />
        <Text style={styles.loadingText}>Initializing admin panel...</Text>
      </View>
    );
  }

  // If on login screen, just render the login card directly without layout shells
  if (pathname === '/admin' || pathname === '/admin/') {
    return <Slot />;
  }

  const handleNavigate = (route) => {
    setIsMobileMenuOpen(false);
    router.push(route);
  };

  const getScreenTitle = () => {
    const item = MENU_ITEMS.find(m => m.route === pathname);
    return item ? item.name : 'Intelearn Admin';
  };

  const SidebarContent = () => (
    <View style={styles.sidebarInner}>
      {/* Brand Logo Header */}
      <View style={styles.sidebarHeader}>
        <Ionicons name="school" size={28} color="#FFFFFF" />
        <View style={styles.headerTextContainer}>
          <Text style={styles.brandTitle}>INTELEARN</Text>
          <Text style={styles.brandSubtitle}>Admin Dashboard</Text>
        </View>
      </View>

      {/* Admin Profile Widget */}
      {adminProfile && (
        <View style={styles.profileWidget}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {adminProfile.full_name ? adminProfile.full_name.charAt(0).toUpperCase() : 'A'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName} numberOfLines={1}>{adminProfile.full_name}</Text>
            <Text style={styles.profileRole}>{adminProfile.role || 'Administrator'}</Text>
          </View>
        </View>
      )}

      {/* Menu Options Scroll */}
      <ScrollView style={styles.menuScroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionHeader}>Navigation</Text>
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.route;
          return (
            <TouchableOpacity
              key={item.route}
              style={[styles.menuItem, isActive && styles.menuItemActive]}
              onPress={() => handleNavigate(item.route)}
              activeOpacity={0.7}
            >
              <Ionicons 
                name={item.icon} 
                size={22} 
                color={isActive ? '#FFFFFF' : 'rgba(255,255,255,0.7)'} 
                style={styles.menuIcon}
              />
              <Text style={[styles.menuText, isActive && styles.menuTextActive]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Sidebar Footer (Logout) */}
      <View style={styles.sidebarFooter}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={20} color="#FF6B6B" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 1. Desktop Layout (Static Left Sidebar) */}
      {isLargeScreen && (
        <View style={styles.desktopSidebar}>
          <SidebarContent />
        </View>
      )}

      {/* 2. Mobile Layout (Drawers Overlay) */}
      {!isLargeScreen && isMobileMenuOpen && (
        <View style={styles.drawerOverlay}>
          <TouchableOpacity 
            style={styles.drawerBackdrop} 
            onPress={() => setIsMobileMenuOpen(false)} 
            activeOpacity={1}
          />
          <View style={styles.mobileSidebar}>
            <SidebarContent />
            {/* Close icon inside drawer */}
            <TouchableOpacity 
              style={styles.closeDrawerButton} 
              onPress={() => setIsMobileMenuOpen(false)}
            >
              <Ionicons name="close" size={26} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Main Content Area */}
      <View style={styles.mainContent}>
        {/* Universal Top Header */}
        <View style={styles.topHeader}>
          {!isLargeScreen && (
            <TouchableOpacity 
              style={styles.menuToggleButton} 
              onPress={() => setIsMobileMenuOpen(true)}
            >
              <Ionicons name="menu" size={26} color="#1A1D20" />
            </TouchableOpacity>
          )}
          
          <Text style={styles.headerTitle}>{getScreenTitle()}</Text>
          
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.notificationIcon}>
              <Ionicons name="notifications-outline" size={22} color="#1A1D20" />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Child Screen viewport wrapper */}
        <View style={styles.screenBody}>
          <Slot />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F5F6FA',
  },
  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
  },
  loadingText: {
    marginTop: 12,
    color: '#6F767E',
    fontWeight: '500',
  },
  desktopSidebar: {
    width: 260,
    backgroundColor: '#2b0a90', // Custom Intelearn Purple Theme
    height: '100%',
  },
  drawerOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    flexDirection: 'row',
  },
  drawerBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  mobileSidebar: {
    width: 260,
    backgroundColor: '#2b0a90',
    height: '100%',
    zIndex: 1001,
  },
  closeDrawerButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    padding: 8,
  },
  sidebarInner: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  brandTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
  brandSubtitle: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 11,
    marginTop: 2,
  },
  profileWidget: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginHorizontal: 15,
    borderRadius: 12,
    marginBottom: 20,
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#5B3CC2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  profileRole: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    marginTop: 1,
  },
  menuScroll: {
    flex: 1,
    paddingHorizontal: 15,
  },
  sectionHeader: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    paddingLeft: 10,
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 6,
  },
  menuItemActive: {
    backgroundColor: '#5B3CC2', // Highlight active color
  },
  menuIcon: {
    marginRight: 12,
  },
  menuText: {
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
    fontSize: 14,
  },
  menuTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  sidebarFooter: {
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    paddingTop: 15,
    marginTop: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 107, 107, 0.08)',
    gap: 12,
  },
  logoutText: {
    color: '#FF6B6B',
    fontWeight: '600',
    fontSize: 14,
  },
  mainContent: {
    flex: 1,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  topHeader: {
    height: 70,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  menuToggleButton: {
    marginRight: 15,
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1D20',
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  notificationIcon: {
    padding: 6,
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B6B',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  screenBody: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
});
