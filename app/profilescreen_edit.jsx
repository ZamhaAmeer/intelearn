import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
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
  View
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();

  
  const [fullName, setFullName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [department, setDepartment] = useState('cis'); 
  const [gender, setGender] = useState('male');
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/150');
  
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const toggleMenu = () => setMenuVisible(!isMenuVisible);

  
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        
        if (params && params.email) {
          setEmail(params.email);
          await fetchUserData(params.email);
        } else {
          
          const storedEmail = await AsyncStorage.getItem('userEmail');
          if (storedEmail) {
            setEmail(storedEmail);
            await fetchUserData(storedEmail);
          } else {
            Alert.alert("Session Error", "Could not locate an active user session.");
            router.replace('/loginpage(student)');
          }
        }
      } catch (error) {
        console.error("Failed to load edit profile matrix:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, []);

  
  const fetchUserData = async (targetEmail) => {
    try {
      const url = `http://172.20.10.3:3000/get-profile?email=${encodeURIComponent(targetEmail)}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        setFullName(data.full_name || '');
        setUserName(data.username || '');
        setPhone(data.phone || '');
        setBio(data.bio || '');
        setDepartment(data.department || 'cis');
        setGender(data.gender || 'male');
      }
    } catch (error) {
      console.error("Error retrieving profile values:", error);
    }
  };

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
      {({ pressed }) => (
        <>
          <Icon name={iconName} size={22} color={active || pressed ? "#4E33B3" : "#7E57C2"} style={styles.menuItemIcon} />
          <Text style={[styles.menuItemText, (active || pressed) && styles.activeMenuText]}>{title}</Text>
        </>
      )}
    </Pressable>
  );

  const handleSaveChanges = async () => {
    try {
      const response = await fetch('http://172.20.10.3:3000/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          username: userName,
          email: email, 
          phone: phone,
          bio: bio,
          department: department,
          gender: gender
        }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const errorText = await response.text();
        console.error("Received non-JSON response:", errorText);
        throw new Error("Server returned non-JSON response");
      }

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          "Success", 
          "Profile updated successfully!", 
          [
            {
              text: "OK",
              onPress: () => {
                router.replace('/coursedetails'); 
              }
            }
          ]
        );
      } else {
        Alert.alert("Error", data.error || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not connect to server");
    }
  };

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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A28B3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}
      >
        <Modal transparent visible={isMenuVisible} animationType="fade" onRequestClose={toggleMenu}>
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={toggleMenu}>
            <View style={styles.sideMenu}>
              <View style={styles.menuHeader}>
                <Text style={styles.moonIcon}>🌙</Text>
              </View>
              <View style={styles.menuList}>
                <MenuOption iconName="home-variant" title="Home" onPress={() => {setMenuVisible(false); router.replace('/coursedetails')}} />
                <MenuOption iconName="account" title="Profile" active onPress={() => {setMenuVisible(false); router.replace('/profilescreen')}} />
                <MenuOption iconName="view-dashboard" title="Dashboard" />
                <MenuOption iconName="controller-classic" title="Games" />
                <MenuOption iconName="shield-check" title="Privacy" onPress={() => {setMenuVisible(false); router.replace('/privacy')}}/>
                <MenuOption iconName="cog" title="Settings" onPress={() => {setMenuVisible(false); router.replace('/settings')}} />
              </View>
              <TouchableOpacity style={styles.logoutButton} onPress={async () => {setMenuVisible(false); await AsyncStorage.removeItem('userEmail'); router.replace('/loginpage(student)') }}>
                <Text style={styles.logoutText}> Log Out   <Icon name="logout" size={24} color="grey" /></Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.menuButton} onPress={() => setMenuVisible(true)}>
              <Icon name="menu" size={30} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Profile information</Text>
          </View>

          <View style={styles.contentCard}>
            <View style={styles.profileImageSection}>
              <View style={styles.imageWrapper}>
                <TouchableOpacity onPress={handleChangePhoto}>
                  <Image 
                    source={profileImage.startsWith('http') || profileImage.startsWith('file') ? { uri: profileImage } : require("../../assets/images/pr2.jpg")} 
                    style={styles.profileImage}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity 
                style={styles.changePhotoButton} 
                onPress={handleChangePhoto}
              >
                <Text style={styles.changePhotoText}>📷 Change photo</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />

              <Text style={styles.label}>User Name</Text>
              <TextInput style={styles.input} value={userName} onChangeText={setUserName} />

            
              <Text style={styles.label}>Email Address (Read-Only)</Text>
              <TextInput style={[styles.input, { backgroundColor: '#F3F4F6', color: '#6B7280' }]} value={email} editable={false} />

              <Text style={styles.label}>Phone Number</Text>
              <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Optional" placeholderTextColor="#ccc" />

              <View style={styles.row}>
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

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => router.replace('/coursedetails')}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F0F0' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F0F0' },
  scrollContent: { paddingBottom: 40 },
  header: { backgroundColor: '#4E33B3', height: 180, borderBottomLeftRadius: 40, borderBottomRightRadius: 40, alignItems: 'center', paddingTop: 20 },
  menuButton: { position: 'absolute', left: 20, top: 40 },
  headerTitle: { color: 'white', fontSize: 24, fontWeight: 'bold', marginTop: 40 },
  contentCard: { backgroundColor: '#FEFDF0', marginHorizontal: 20, marginTop: -40, borderRadius: 30, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  profileImageSection: { alignItems: 'center', marginTop: -60, marginBottom: 20 },
  imageWrapper: { width: 120, height: 120, borderRadius: 60, borderWidth: 5, borderColor: '#FEFDF0', overflow: 'hidden', backgroundColor: '#ddd' },
  profileImage: { width: '100%', height: '100%' },
  changePhotoButton: { backgroundColor: 'white', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 5, marginTop: 10, borderWidth: 1, borderColor: '#eee' },
  changePhotoText: { fontSize: 12, color: '#333' },
  form: { marginTop: 10 },
  label: { fontSize: 14, color: '#555', marginBottom: 5, marginTop: 15 },
  input: { backgroundColor: 'white', borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 15, paddingHorizontal: 15, height: 45, color: '#333' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  halfInput: { width: '48%' },
  dropdown: { backgroundColor: 'white', borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 15, paddingHorizontal: 15, height: 45 },
  placeholderStyle: { fontSize: 14, color: '#ccc' },
  selectedTextStyle: { fontSize: 14, color: '#333' },
  bioInput: { height: 100, textAlignVertical: 'top', paddingTop: 10 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 },
  saveButton: { backgroundColor: '#5C43C1', width: '55%', height: 55, borderRadius: 27, justifyContent: 'center', alignItems: 'center' },
  saveButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  cancelButton: { backgroundColor: '#D9D9D9', width: '40%', height: 55, borderRadius: 27, justifyContent: 'center', alignItems: 'center' },
  cancelButtonText: { color: '#333', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'flex-start' },
  sideMenu: { width: width * 0.6, height: '100%', backgroundColor: 'white', padding: 20, borderTopRightRadius: 20, borderBottomRightRadius: 20, elevation: 10 },
  menuHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40, marginTop: 20 },
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