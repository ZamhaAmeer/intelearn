import * as ImagePicker from 'expo-image-picker'; // 1. Import the picker
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ReAnimated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Path, Stop, Text as SvgText } from 'react-native-svg';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const [fullName, setFullName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [department, setDepartment] = useState('cis'); 
  const [gender, setGender] = useState('male');
  const router = useRouter();

  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const toggleMenu = () => setMenuVisible(!isMenuVisible);
  
  // 3. State to store the selected image URI
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/150');
  const departmentData = [
  { label: 'CIS', value: 'cis' },
  { label: 'IS', value: 'is' },
  { label: 'DS', value: 'ds' },
  { label: 'SE', value: 'se' },
];

const genderData = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];

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


  // 4. Function to handle Image Selection
  const handleChangePhoto = () => {
    Alert.alert(
      "Select Profile Picture",
      "Choose an option",
      [
        { text: "Camera", onPress: openCamera },
        { text: "Gallery", onPress: openLibrary },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const openLibrary = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.granted) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
      }
    } else {
      alert("Permission to access gallery is required!");
    }
  };

  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.granted) {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
      }
    } else {
      alert("Permission to access camera is required!");
    }
  };
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

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}
      >
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
                      <MenuOption iconName="home-variant" title="Home" onPress={() => {setMenuVisible(false); router.replace('/courseDetails')}} />
                      <MenuOption iconName="account" title="Profile" active onPress={() => {setMenuVisible(false); router.replace('/profileScreen')}} />
                      <MenuOption iconName="view-dashboard" title="Dashboard" />
                      <MenuOption iconName="controller-classic" title="Games" onPress={() => {setMenuVisible(false); router.replace('/miniGames')}}/>
                      <MenuOption iconName="cog" title="Settings" onPress={() => {setMenuVisible(false); router.replace('/settings')}} />
                    </View>
                    <TouchableOpacity style={styles.logoutButton} onPress={() => {setMenuVisible(false); router.replace('/loginPage_Student') }}>
                      <Text style={styles.logoutText}> Log Out    <Icon name="logout" size={24} color="grey" /></Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </Modal>
                      
        
                
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.header}>
            <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
              <Icon name="menu" size={30} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Profile information</Text>
          </View>

          <View style={styles.contentCard}>
            <View style={styles.profileImageSection}>
              <View style={styles.imageWrapper}>
                {/* 5. Update Image source to use the state */}
                <TouchableOpacity onPress={handleChangePhoto}>
                  <Image 
                    source={require("../src/assets/images/pr2.jpg")} 
                    style={styles.profileImage}
                  />
                </TouchableOpacity>
              </View>
              {/* 6. Link the button to the function */}
              <TouchableOpacity 
                style={styles.changePhotoButton} 
                onPress={handleChangePhoto}
              >
                <Text style={styles.changePhotoText}>📷 Change photo</Text>
              </TouchableOpacity>
            </View>

            {/* ... rest of your form code ... */}
            <View style={styles.form}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />

              <Text style={styles.label}>User Name</Text>
              <TextInput style={styles.input} value={userName} onChangeText={setUserName} />

              <Text style={styles.label}>Email Address</Text>
              <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

              <Text style={styles.label}>Phone Number</Text>
              <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Optional" placeholderTextColor="#ccc" />

              <View style={styles.row}>
          
          {/* Department Dropdown */}
          <View style={styles.halfInput}>
            <Text style={styles.label}>Department</Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={departmentData}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Select"
              value={department}
              onChange={item => setDepartment(item.value)}
            />
          </View>

          {/* Gender Dropdown */}
          <View style={styles.halfInput}>
            <Text style={styles.label}>Gender</Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={genderData}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Select"
              value={gender}
              onChange={item => setGender(item.value)}
            />
          </View>
        </View>

              <Text style={styles.label}>BIO</Text>
              <TextInput 
                style={[styles.input, styles.bioInput]} 
                value={bio} 
                onChangeText={setBio} 
                multiline 
                numberOfLines={4} 
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          

            
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// ... Keep your existing styles ...
const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#F0F0F0', // Slight grey background to pop the card
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: '#4E33B3',
    height: 180,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: 'center',
    paddingTop: 20,
  },
  menuButton: {
    position: 'absolute',
    left: 20,
    top: 40,
  },
  menuIcon: {
    color: 'white',
    fontSize: 24,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 40,
  },
  contentCard: {
    backgroundColor: '#FEFDF0', // Matches your off-white background
    marginHorizontal: 20,
    marginTop: -40,
    borderRadius: 30,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  profileImageSection: {
    alignItems: 'center',
    marginTop: -60,
    marginBottom: 20,
  },
  imageWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 5,
    borderColor: '#FEFDF0',
    overflow: 'hidden',
    backgroundColor: '#ddd',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  changePhotoButton: {
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 5,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  changePhotoText: {
    fontSize: 12,
    color: '#333',
  },
  form: {
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 45,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  dropdown: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  saveButton: {
    backgroundColor: '#5C43C1',
    width: '55%',
    height: 55,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#D9D9D9',
    width: '40%',
    height: 55,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
  },
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
  toggleTrack: { 
    width: 75, 
    height: 38, 
    borderRadius: 20, 
    padding: 4, 
    justifyContent: 'center',
    backgroundColor: '#E0E0E0' // Add fallback background
  },
  toggleIconsLayer: { 
    ...StyleSheet.absoluteFillObject, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 10 
  },
  toggleThumb: { 
    width: 30, 
    height: 30, 
    borderRadius: 15, 
    backgroundColor: '#4E33B3', 
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 4, 
    zIndex: 2 
  },

});
