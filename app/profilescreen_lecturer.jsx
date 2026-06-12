import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');
const HEADER_MAX_HEIGHT = 160;
const HEADER_MIN_HEIGHT = 100;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default function LecturerProfileViewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Destructure parameter dependencies to maintain clean rendering loops
  const { 
    email: paramEmail, 
    fullName: paramFullName, 
    userName: paramUserName, 
    phone: paramPhone, 
    bio: paramBio, 
    department: paramDepartment, 
    gender: paramGender 
  } = params;

  const [fullName, setFullName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [department, setDepartment] = useState('');
  const [gender, setGender] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let isMounted = true;

    const checkSessionAndFetch = async () => {
      try {
        // If credentials are forwarded directly through navigation parameters
        if (paramEmail && paramFullName) {
          if (isMounted) {
            setFullName(paramFullName);
            setUserName(paramUserName || '');
            setEmail(paramEmail);
            setPhone(paramPhone || '');
            setBio(paramBio || '');
            setDepartment(paramDepartment || 'cis');
            setGender(paramGender || 'male');
            setIsLoading(false);
          }
        } else {
          // Read from our frontend lecturer storage namespace to pull the user account
          const storedLecturerEmail = await AsyncStorage.getItem('lecturerEmail');
          
          if (storedLecturerEmail) {
            await fetchUserData(storedLecturerEmail, isMounted);
          } else {
            if (isMounted) setIsLoading(false);
            handleNavToLogin();
          }
        }
      } catch (e) {
        console.error("Lecturer UI init error:", e);
        if (isMounted) setIsLoading(false);
      }
    };

    checkSessionAndFetch();

    return () => {
      isMounted = false;
    };
  }, [paramEmail, paramFullName, paramUserName, paramPhone, paramBio, paramDepartment, paramGender]);

  const fetchUserData = async (lookupEmail, isMounted) => {
    try {
      if (isMounted) setIsLoading(true);
      // Queries your single unified table endpoint using the standard email query parameter
      const url = `http://172.20.10.3:3000/get-profile?email=${encodeURIComponent(lookupEmail.trim())}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }); 
      
      let data = await response.json();
      console.log("LOG - Unified Table Payload Check:", data);

      if (!isMounted) return;

      if (response.ok) {
        
        // 🛠️ DEV WORKAROUND OVERRIDE:
        // Since your testing profile '22fis0574@ms.sab.ac.lk' currently contains a 'student' 
        // string value inside your database table row, we manually rewrite it in frontend memory 
        // to display what a true lecturer layout looks like.
        if (data.role === 'student' && data.email === '22fis0574@ms.sab.ac.lk') {
          console.log("LOG - Local testing match found. Simulating data array role transformation.");
          data = {
            ...data,
            role: 'lecturer',
            full_name: 'Dr. Gopan Thayaparan', 
            username: 'gopan_lecturer',
            department: 'is',
            bio: 'Senior Lecturer inside the Faculty of Computing. Areas of focus include full-stack architectures, interactive AI platform design, and logical database systems.'
          };
        }

        /* 🚨 UNCOMMENT THIS PROTECTION BLOCK ONCE YOU REMOVE TESTING OVERRIDES
        if (data.role === 'student') {
          console.log("LOG - Student profile blocked from lecturer space.");
          setIsLoading(false);
          handleNavToLogin();
          return;
        }
        */

        // Sets your local component states using fields mapped directly to your Sequelize model definitions
        setFullName(data.full_name || 'Not Provided');
        setUserName(data.username || 'Not Assigned');
        setEmail(data.email || lookupEmail);
        setPhone(data.phone || 'Optional');
        setBio(data.bio || 'No biography written yet.');
        setDepartment(data.department || 'cis');
        setGender(data.gender || 'male');
      } else {
        Alert.alert("Sync Defect", data.error || "Unable to acquire record entries.");
      }
    } catch (error) {
      if (isMounted) {
        Alert.alert("Connection Failure", "Could not connect to database endpoint.");
      }
    } finally {
      if (isMounted) setIsLoading(false);
    }
  };

  const handleNavToLogin = () => {
    Alert.alert(
      "Lecturer Session Required",
      "Please sign in with your lecturer credentials to access this view panel.",
      [{ text: "Login", onPress: () => router.replace('/loginpage(lecturer)') }]
    );
  };

  const formatDepartment = (deptCode) => {
    const values = { cis: 'CIS', is: 'IS', ds: 'DS', se: 'SE' };
    return values[deptCode?.toLowerCase()] || deptCode || 'Not Set';
  };

  const formatGender = (genderCode) => {
    const values = { male: 'Male', female: 'Female', other: 'Other' };
    return values[genderCode?.toLowerCase()] || genderCode || 'Not Set';
  };

  // --- ANIMATION INTERPOLATIONS ---
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const headerTitleSize = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [24, 18],
    extrapolate: 'clamp',
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4E33B3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4E33B3" />
      
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <View style={styles.headerTitleContainer}>
          <Animated.Text style={[styles.headerTitle, { fontSize: headerTitleSize }]}>
            Lecturer Profile Details
          </Animated.Text>
        </View>
      </Animated.View>

      <Animated.ScrollView 
        contentContainerStyle={{ paddingTop: HEADER_MAX_HEIGHT + 15 }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        <View style={styles.avatarCardSection}>
          <View style={styles.avatarOutlineRing}>
            <Image
              source={profileImage ? { uri: profileImage } : require('../src/assets/images/pr2.jpg")}
              style={styles.avatarImage}
            />
          </View>
          <Text style={styles.profileNameText}>{fullName}</Text>
          <Text style={styles.profileTaglineText}>@{userName || 'lecturer'}</Text>
        </View>

        <View style={styles.detailsSectionSurface}>
          <View style={styles.dataFieldBlock}>
            <View style={styles.labelRow}>
              <Icon name="account-tie-outline" size={18} color="#7E57C2" />
              <Text style={styles.fieldLabelText}>LECTURER NAME</Text>
            </View>
            <Text style={styles.fieldValueText}>{fullName}</Text>
          </View>

          <View style={styles.dataFieldBlock}>
            <View style={styles.labelRow}>
              <Icon name="card-account-details-outline" size={18} color="#7E57C2" />
              <Text style={styles.fieldLabelText}>USERNAME ID</Text>
            </View>
            <Text style={styles.fieldValueText}>{userName}</Text>
          </View>

          <View style={styles.dataFieldBlock}>
            <View style={styles.labelRow}>
              <Icon name="email-outline" size={18} color="#7E57C2" />
              <Text style={styles.fieldLabelText}>EMAIL ADDRESS</Text>
            </View>
            <Text style={styles.fieldValueText}>{email}</Text>
          </View>

          <View style={styles.dataFieldBlock}>
            <View style={styles.labelRow}>
              <Icon name="phone-outline" size={18} color="#7E57C2" />
              <Text style={styles.fieldLabelText}>TELEPHONE NUMBER</Text>
            </View>
            <Text style={styles.fieldValueText}>{phone}</Text>
          </View>

          <View style={styles.rowFieldsContainer}>
            <View style={[styles.dataFieldBlock, { flex: 1, marginRight: 16 }]}>
              <View style={styles.labelRow}>
                <Icon name="school-outline" size={18} color="#7E57C2" />
                <Text style={styles.fieldLabelText}>DEPARTMENT</Text>
              </View>
              <Text style={styles.fieldValueText}>{formatDepartment(department)}</Text>
            </View>
            <View style={[styles.dataFieldBlock, { flex: 1 }]}>
              <View style={styles.labelRow}>
                <Icon name="gender-male-female" size={18} color="#7E57C2" />
                <Text style={styles.fieldLabelText}>GENDER</Text>
              </View>
              <Text style={styles.fieldValueText}>{formatGender(gender)}</Text>
            </View>
          </View>

          <View style={[styles.dataFieldBlock, { borderBottomWidth: 0, paddingBottom: 5 }]}>
            <View style={styles.labelRow}>
              <Icon name="notebook-outline" size={18} color="#7E57C2" />
              <Text style={styles.fieldLabelText}>ACADEMIC BIOGRAPHY</Text>
            </View>
            <Text style={styles.bioContentText}>{bio}</Text>
          </View>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={styles.primaryActionButton} 
            onPress={() => router.push({ 
              pathname: '/profilescreen_edit', 
              params: { 
                email: email, 
                fullName: fullName,
                role: 'lecturer'
              } 
            })} 
          >
            <Text style={styles.primaryActionText}>Edit Lecturer Profile</Text>
            <Icon name="pencil" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryActionButton} onPress={() => router.replace('/coursedetailsforlecturer')}>
            <Text style={styles.secondaryActionText}>Return Home</Text>
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FEFDF0' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FEFDF0' },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#4E33B3',
    zIndex: 1000,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
    alignItems: 'center', 
    justifyContent: 'center',
  },
  headerTitle: { 
    fontWeight: 'bold', 
    color: '#FFFFFF',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  avatarCardSection: { alignItems: 'center', marginTop: 10, marginBottom: 24 },
  avatarOutlineRing: {
    width: 110, height: 110, borderRadius: 55, borderWidth: 4, borderColor: '#FFF',
    overflow: 'hidden', elevation: 8, shadowColor: '#4E33B3', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 8, backgroundColor: '#EAEAEA',
  },
  avatarImage: { width: '100%', height: '100%' },
  profileNameText: { fontSize: 22, fontWeight: '800', color: '#1A1A1A', marginTop: 14, paddingHorizontal: 20, textAlign: 'center' },
  profileTaglineText: { fontSize: 13, color: '#7E57C2', fontWeight: '600', marginTop: 2 },
  detailsSectionSurface: {
    backgroundColor: '#FFF', marginHorizontal: 24, borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F4F2E4',
    shadowColor: '#4E33B3', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 3,
  },
  dataFieldBlock: { borderBottomWidth: 1, borderBottomColor: '#F5F5F0', paddingBottom: 12, marginBottom: 14 },
  labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  fieldLabelText: { fontSize: 11, fontWeight: '700', color: '#9E9E9E', marginLeft: 8, letterSpacing: 0.5 },
  fieldValueText: { fontSize: 15, color: '#1A1A1A', fontWeight: '600', paddingLeft: 26 },
  rowFieldsContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  bioContentText: { fontSize: 14, color: '#555', lineHeight: 22, paddingLeft: 26, marginTop: 2 },
  actionContainer: { paddingHorizontal: 24, marginTop: 24, paddingBottom: 40 },
  primaryActionButton: {
    backgroundColor: '#4E33B3', borderRadius: 20, height: 52, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', elevation: 4, shadowColor: '#4E33B3', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 6,marginBottom: 12,
  },
  primaryActionText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  secondaryActionButton: { backgroundColor: '#C4B5FD', borderRadius: 20, height: 52, alignItems: 'center', justifyContent: 'center' },
  secondaryActionText: { color: '#311B92', fontSize: 15, fontWeight: '700' },
});