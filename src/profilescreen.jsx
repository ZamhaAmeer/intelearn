import * as ImagePicker from 'expo-image-picker'; // 1. Import the picker
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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

const MenuOption = ({ icon, title, active }) => (
  <View style={[styles.menuItem, active && styles.activeMenuItem]}>
    <Text style={styles.menuItemIcon}>{icon}</Text>
    <Text style={[styles.menuItemText, active && styles.activeMenuText]}>{title}</Text>
  </View>
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

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}
      >
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
                                      <MenuOption icon="👤" title="Profile" active={true}/>
                                    </TouchableOpacity>
                                    <MenuOption icon="📊" title="Dashboard" />
                                    <MenuOption icon="🎮" title="Games" />
                                    <MenuOption icon="🛡️" title="Privacy" />
                                     <TouchableOpacity onPress={() => {setMenuVisible(false); router.replace('/settings') }}>
                                                  <MenuOption icon="⚙️" title="Settings" />
                                                  </TouchableOpacity>
                      </View>
                      
        
                    <TouchableOpacity style={styles.logoutButton} onPress={() => {setMenuVisible(false); router.replace('/loginpage(student)') }}>
                     <Text style={styles.logoutText}><Icon name="logout" size={24} color="red" /> Log Out</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </Modal>
        
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.header}>
            <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
              <Text style={styles.menuIcon}>☰</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Profile information</Text>
          </View>

          <View style={styles.contentCard}>
            <View style={styles.profileImageSection}>
              <View style={styles.imageWrapper}>
                {/* 5. Update Image source to use the state */}
                <TouchableOpacity onPress={handleChangePhoto}>
                  <Image 
                    source={require('../src/assets/images/pr2.jpg")} 
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-start',
  },
  sideMenu: {
    width: width * 0.6, // 60% of screen width
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

});
