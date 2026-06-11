import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Image,
  PanResponder,
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
  const [isLoading, setIsLoading] = useState(true);

  
  const scrollY = useRef(new Animated.Value(0)).current;

  
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 60 && Math.abs(gestureState.dy) < 30;
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 80) {
          router.replace('/dashboard');
        } else if (gestureState.dx < -80) {
          router.replace('/coursedetails');
        }
      },
    })
  ).current;

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
      const url = `${API_BASE_URL}/get-profile?email=${encodeURIComponent(userEmail)}`;
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
        Alert.alert("Profile Sync Fail", errorData.error || "Could not retrieve user entries.");
      }
    } catch (error) {
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

  
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const headerTitleSize = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [32, 18],
    extrapolate: 'clamp',
  });

  const headerPaddingTop = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [75, 45],
    extrapolate: 'clamp',
  });

  
  const headerPaddingLeft = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [24, 0], 
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
    <View style={styles.container} {...panResponder.panHandlers}>
      <StatusBar barStyle="light-content" backgroundColor="#4E33B3" />
      
      
      <Animated.View style={[styles.header, { height: headerHeight, paddingTop: headerPaddingTop, paddingLeft: headerPaddingLeft }]}>
        <View style={styles.headerTitleContainer}>
          <Animated.Text style={[styles.headerTitle, { fontSize: headerTitleSize }]}>
            Profile Details
          </Animated.Text>
        </View>
      </Animated.View>

    
      <Animated.ScrollView 
        style={styles.scrollContentWrapper} 
        contentContainerStyle={[styles.scrollContainer, { paddingTop: HEADER_MAX_HEIGHT + 15 }]} 
        showsVerticalScrollIndicator={false}
        bounces={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
      
        <View style={styles.avatarCardSection}>
          <View style={styles.avatarOutlineRing}>
            <Image
              source={profileImage ? { uri: profileImage } : require("../assets/images/pr2.jpg")}
              style={styles.avatarImage}
            />
          </View>
          <Text style={styles.profileNameText} numberOfLines={1}>{fullName}</Text>
          <Text style={styles.profileTaglineText}>@{userName || 'student'}</Text>
        </View>

      
        <View style={styles.detailsSectionSurface}>
          <View style={styles.dataFieldBlock}>
            <View style={styles.labelRow}>
              <Icon name="account-outline" size={18} color="#7E57C2" />
              <Text style={styles.fieldLabelText}>FULL NAME</Text>
            </View>
            <Text style={styles.fieldValueText}>{fullName}</Text>
          </View>

          <View style={styles.dataFieldBlock}>
            <View style={styles.labelRow}>
              <Icon name="card-account-details-outline" size={18} color="#7E57C2" />
              <Text style={styles.fieldLabelText}>USER NAME</Text>
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
              <Text style={styles.fieldLabelText}>PHONE NUMBER</Text>
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
              <Icon name="text-account" size={18} color="#7E57C2" />
              <Text style={styles.fieldLabelText}>BIOGRAPHY</Text>
            </View>
            <Text style={styles.bioContentText}>{bio}</Text>
          </View>
        </View>

        
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={styles.primaryActionButton} 
            onPress={() => router.push({ pathname: '/profilescreen_edit', params: { email: email, fullName: fullName } })} 
          >
            <Text style={styles.primaryActionText}>Edit Profile</Text>
            <Icon name="pencil" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryActionButton} onPress={() => router.replace('/coursedetails')}>
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
    paddingRight: 24, 
    zIndex: 1000,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: 'center',
  },
  headerTitleContainer: {
    width: '100%',
    alignItems: 'center', 
    justifyContent: 'center',
  },
  headerTitle: { 
    fontWeight: 'bold', 
    color: '#FFFFFF',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  
  scrollContentWrapper: { flex: 1 },
  scrollContainer: { paddingBottom: 40 },
  
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
  
  actionContainer: { paddingHorizontal: 24, marginTop: 24 },
  primaryActionButton: {
    backgroundColor: '#4E33B3', borderRadius: 20, height: 52, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', elevation: 4, shadowColor: '#4E33B3', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 6, marginBottom: 12,
  },
  primaryActionText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  secondaryActionButton: { backgroundColor: '#C4B5FD', borderRadius: 20, height: 52, alignItems: 'center', justifyContent: 'center' },
  secondaryActionText: { color: '#311B92', fontSize: 15, fontWeight: '700' },
});