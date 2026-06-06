import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function ProfileViewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  
  const [fullName, setFullName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [department, setDepartment] = useState('');
  const [gender, setGender] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const toggleMenu = () => setMenuVisible(!isMenuVisible);

  
  useEffect(() => {
    const checkSessionAndFetch = async () => {
      try {
        if (params && params.email && params.fullName) {
          setFullName(params.fullName);
          setUserName(params.userName || '');
          setEmail(params.email);
          setPhone(params.phone || '');
          setBio(params.bio || '');
          setDepartment(params.department || 'cis');
          setGender(params.gender || 'male');
          setIsLoading(false);
        } else {
          
          const storedEmail = await AsyncStorage.getItem('userEmail');
          if (storedEmail) {
            await fetchUserData(storedEmail);
          } else {
            setIsLoading(false);
            Alert.alert(
              "Session Missing",
              "Please sign in again to access your profile data info.",
              [{ text: "Login", onPress: () => router.replace('/loginpage(student)') }]
            );
          }
        }
      } catch (e) {
        console.error("Initialization failed:", e);
        setIsLoading(false);
      }
    };

    checkSessionAndFetch();
  }, [params]);

  const fetchUserData = async (userEmail) => {
    try {
      setIsLoading(true);
      const url = `http://172.20.10.3:3000/get-profile?email=${encodeURIComponent(userEmail)}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }); 
      
      if (response.ok) {
        const data = await response.json();
        
        setFullName(data.full_name || 'Not Provided');
        setUserName(data.username || 'Not Assigned');
        setEmail(data.email || userEmail);
        setPhone(data.phone || 'Optional');
        setBio(data.bio || 'No bio written yet.');
        setDepartment(data.department || 'cis');
        setGender(data.gender || 'male');
      } else {
        const errorData = await response.json();
        console.error("Backend Profile Sync Error:", errorData.error);
        Alert.alert("Profile Sync Fail", errorData.error || "Could not retrieve user entries.");
      }
    } catch (error) {
      console.error("Network Link Error:", error);
      Alert.alert("Connection Failure", "Could not synchronize with the remote sequence node.");
    } finally {
      setIsLoading(false);
    }
  };

  
  const formatDepartment = (deptCode) => {
    const values = { cis: 'CIS', is: 'IS', ds: 'DS', se: 'SE' };
    return values[deptCode?.toLowerCase()] || deptCode || 'Not Set';
  };

  const formatGender = (genderCode) => {
    const values = { male: 'Male', female: 'Female', other: 'Other' };
    return values[genderCode?.toLowerCase()] || genderCode || 'Not Set';
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
        <ActivityIndicator size="large" color="#4A28B3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4A28B3" />
      
      {/* --- SIDEBAR NAVIGATION DRAWER --- */}
      <Modal transparent visible={isMenuVisible} animationType="fade" onRequestClose={toggleMenu}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={toggleMenu}>
          <View style={styles.sideMenu}>
            <View style={styles.menuHeader}>
              <TouchableOpacity onPress={toggleMenu}>
                <Icon name="menu" size={30} color="#333" />
              </TouchableOpacity>
              <Text style={styles.moonIcon}>🌙</Text>
            </View>
            <View style={styles.menuList}>
              <MenuOption iconName="home-variant" title="Home" onPress={() => { setMenuVisible(false); router.replace('/coursedetails'); }} />
              <MenuOption iconName="account" title="Profile" active onPress={() => setMenuVisible(false)} />
              <MenuOption iconName="view-dashboard" title="Dashboard" />
              <MenuOption iconName="controller-classic" title="Games" />
              <MenuOption iconName="shield-check" title="Privacy" onPress={() => { setMenuVisible(false); router.replace('/privacy'); }} />
              <MenuOption iconName="cog" title="Settings" onPress={() => { setMenuVisible(false); router.replace('/settings'); }} />
            </View>
            <TouchableOpacity 
              style={styles.logoutButton} 
              onPress={async () => { 
                setMenuVisible(false); 
                await AsyncStorage.removeItem('userEmail'); // Clean session storage cache on logout
                router.replace('/loginpage(student)'); 
              }}
            >
              <Text style={styles.logoutText}> Log Out   <Icon name="logout" size={24} color="grey" /></Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 🔑 STABLE HEADER BAR (Moved outside ScrollView) */}
      <View style={styles.header}>
        <View style={styles.headerTopBar}>
          <TouchableOpacity style={styles.iconButton} onPress={toggleMenu}>
            <Icon name="menu" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="bell" size={26} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>Profile Information</Text>
      </View>

      {/* --- MAIN SCROLLABLE CONTENT --- */}
      <ScrollView 
        style={styles.scrollContentWrapper} 
        contentContainerStyle={styles.scrollContainer} 
        bounces={false}
      >
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Image
              source={profileImage ? { uri: profileImage } : require("../../assets/images/pr2.jpg")}
              style={styles.avatar}
            />
            <Text style={styles.profileName} numberOfLines={2}>{fullName}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>FULL NAME</Text>
            <Text style={styles.fieldValue}>{fullName}</Text>
            <View style={styles.underline} />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>USER NAME</Text>
            <Text style={styles.fieldValue}>{userName}</Text>
            <View style={styles.underline} />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>EMAIL ADDRESS</Text>
            <Text style={styles.fieldValue}>{email}</Text>
            <View style={styles.underline} />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>PHONE NUMBER</Text>
            <Text style={styles.fieldValue}>{phone}</Text>
            <View style={styles.underline} />
          </View>

          <View style={styles.rowFields}>
            <View style={[styles.fieldContainer, { flex: 1, marginRight: 16 }]}>
              <Text style={styles.fieldLabel}>DEPARTMENT</Text>
              <Text style={styles.fieldValue}>{formatDepartment(department)}</Text>
              <View style={styles.underline} />
            </View>
            <View style={[styles.fieldContainer, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>GENDER</Text>
              <Text style={styles.fieldValue}>{formatGender(gender)}</Text>
              <View style={styles.underline} />
            </View>
          </View>

          <View style={styles.bioContainer}>
            <Text style={styles.fieldLabel}>BIO</Text>
            <Text style={styles.bioText}>{bio}</Text>
          </View>

          <TouchableOpacity 
            style={styles.editButton} 
            onPress={() => router.push({ pathname: '/profilescreen_edit', params: { email: email, fullName: fullName } })} 
          >
            <Text style={styles.editButtonText}>✎   Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/coursedetails')}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF9F5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAF9F5' },
  scrollContainer: { flexGrow: 1 },
  header: { backgroundColor: '#4A28B3', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 45, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  headerTopBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  iconButton: { padding: 6 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#FFFFFF', textAlign: 'center', marginTop: 2 },
  profileCard: { backgroundColor: '#FFFFFF', borderRadius: 28, marginTop: -25, marginHorizontal: 16, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 4, marginBottom: 24 },
  avatarContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  avatar: { width: 85, height: 85, borderRadius: 42.5, backgroundColor: '#E1E1E1', borderWidth: 2, borderColor: '#4A28B3' },
  profileName: { fontSize: 22, fontWeight: '700', color: '#1A1A1A', marginLeft: 18, flex: 1 },
  fieldContainer: { marginBottom: 18 },
  fieldLabel: { fontSize: 12, fontWeight: '700', color: '#71717A', marginBottom: 6, letterSpacing: 0.5 },
  fieldValue: { fontSize: 16, color: '#18181B', fontWeight: '500', paddingVertical: 1 },
  underline: { height: 1, backgroundColor: '#E4E4E7', marginTop: 6 },
  rowFields: { flexDirection: 'row', justifyContent: 'space-between' },
  bioContainer: { marginBottom: 32 },
  bioText: { fontSize: 14, color: '#4B5563', lineHeight: 22, marginTop: 4 },
  editButton: { backgroundColor: '#5229D2', borderRadius: 24, paddingVertical: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  editButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  backButton: { backgroundColor: '#E6E4DC', borderRadius: 24, paddingVertical: 16, alignItems: 'center', justifyContent: 'center' },
  backButtonText: { color: '#1A1A1A', fontSize: 16, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-start' },
  sideMenu: { width: width * 0.65, height: '100%', backgroundColor: 'white', padding: 20, borderTopRightRadius: 24, borderBottomRightRadius: 24, elevation: 10 },
  menuHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 35, marginTop: 20 },
  moonIcon: { fontSize: 20 },
  menuList: { flex: 1 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 15, borderRadius: 12, marginBottom: 8 },
  activeMenuItem: { backgroundColor: '#E8E4FF' },
  pressedMenuItem: { backgroundColor: '#D1C4E9', transform: [{ scale: 0.97 }] },
  menuItemIcon: { marginRight: 15 },
  menuItemText: { fontSize: 16, color: '#333', fontWeight: '500' },
  activeMenuText: { color: '#4E33B3', fontWeight: 'bold' },
  logoutButton: { borderTopWidth: 1, borderTopColor: '#eee', paddingVertical: 20, alignItems: 'center' },
  logoutText: { fontSize: 18, fontWeight: '450', color: 'grey' },
});