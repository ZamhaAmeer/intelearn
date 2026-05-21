import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { interpolateColor, useSharedValue, withSpring } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import Icon from 'react-native-vector-icons/Ionicons';
const { width } = Dimensions.get('window');

export default function PrivacyScreen() {
  const router = useRouter();
  const [hasAgreed, setHasAgreed] = useState(false);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isDark, setIsDark] = useState(false);
  

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
        <View style={styles.trackStyle}>
          <Animated.View style={[styles.thumbStyle, rThumbStyle]} />
        </View>
      );
    };
  
    const toggleMenu = () => setMenuVisible(!isMenuVisible);
  
    const MenuOption = ({ iconName, title, active, onPress }) => (
      <TouchableOpacity style={[styles.menuItem, active && styles.activeMenuItem]} onPress={onPress}>
        <Icon name={iconName} size={22} color={active ? "#4E33B3" : "#666"} style={styles.menuItemIcon} />
        <Text style={[styles.menuItemText, active && styles.activeMenuText]}>{title}</Text>
      </TouchableOpacity>
    );
  
    return (
      <View style={styles.masterContainer}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        
        {/* 1. PRIMARY PURPLE HEADER */}
        <View style={styles.topPurpleHeader}>
        <SafeAreaView>
          <View style={styles.headerTopRow}>
        
          </View>
        </SafeAreaView>
      </View>

      {/* 2. SUB-HEADER */}
      <View style={styles.subHeader}>
        <TouchableOpacity onPress={() => router.replace('/register_Lecturer)')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#1A73E8" />
          <Text style={styles.subHeaderTitle}>Privacy & Data Policy</Text>
        </TouchableOpacity>
        <Feather name="info" size={20} color="#78849E" />
      </View>

      {/* 3. MAIN SCROLLABLE CONTENT */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.protocolTag}>INSTITUTIONAL PROTOCOL</Text>
        
        <Text style={styles.mainTitle}>
          Terms of{"\n"}Academic{"\n"}Service & Data{"\n"}Privacy
        </Text>
        
        <Text style={styles.introText}>
          Please review the Learnora digital governance framework. These statutes 
          define the bilateral obligations between the institution and the student body 
          regarding digital engagement.
        </Text>

        {/* 4. DOCUMENT CARD WITH FIXED SYNTAX */}
        <View style={styles.documentCard}>
          <Section 
            title="Section 1.0: Preamble" 
            text="This document constitutes a binding legal agreement governing the use of the Learnora Virtual Learning Environment (VLE). By authenticating your credentials, you acknowledge the sovereignty of these clauses in all academic and administrative digital interactions within the platform ecosystem."
          />
          <Section 
            title="Section 1.2: VLE Activity Logging" 
            text="The Learnora architecture maintains an immutable ledger of all user interactions. This includes, but is not limited to: login frequency, duration of resource access, navigational heatmaps, and asynchronous participation metrics. These data points are synthesized to evaluate student engagement and predict academic outcomes. Under this clause, users concede that inactivity for periods exceeding 14 academic days may trigger automatic intervention protocols from the Office of Academic Affairs."
          />
          <Section 
            title="Section 2.0: Intellectual Property of Contributions" 
            text="All scholarly outputs, discussion board contributions, and peer-review submissions transmitted via the VLE are subject to an irrevocable, non-exclusive license granted to Learnora for the purposes of pedagogical analysis and institutional archiving. Users retain moral rights to their work, but acknowledge that the platform may utilize anonymized fragments of such work for the refinement of Large Language Models (LLMs) used in institutional tutoring."
          />
          
          <Section 
            title="Section 5.1: Third-Party Academic Integrations" 
            text="Learnora leverages a network of secondary service providers for plagiarism detection, e-library indexing, and cloud-based laboratory environments. Personal identifiers—excluding sensitive financial data—may be shared with these entities to ensure a seamless academic experience. Each provider is audited for compliance with the Federal Student Data Privacy Act (FSDPA)."
          />
          <Section 
            title="Section 6.0: Termination of Access" 
            text="Failure to comply with the ethical conduct standards outlined in the Student Handbook, or a breach of the digital security protocols established herein, may result in the immediate revocation of VLE access. Reinstatement is subject to a formal hearing before the Digital Ethics Committee."
          />
          
          <View style={styles.footerInfo}>
            <Text style={styles.versionText}>Document Version: 2024.Q3.Institutional.Rev04</Text>
            <Text style={styles.versionText}>Last Updated: September 14, 2024</Text>
          </View>
        </View>

        {/* 5. AGREE SECTION */}
        <View style={styles.actionSection}>
          <TouchableOpacity 
            style={styles.checkboxRow} 
            onPress={() => setHasAgreed(!hasAgreed)}
          >
            <View style={[styles.checkbox, hasAgreed && styles.checkboxChecked]}>
              {hasAgreed && <Ionicons name="checkmark" size={14} color="white" />}
            </View>
            <Text style={styles.checkboxLabel}>I have read and agree to the terms</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.agreeBtn, !hasAgreed && styles.agreeBtnDisabled]}
            disabled={!hasAgreed}
            onPress={() => router.replace('/loginpage(lecturer)')}
          >
            <Text style={styles.agreeBtnText}>I AGREE & CONFIRM</Text>
          </TouchableOpacity>
        </View>
        
        

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const Section = ({ title, text }: { title: string, text: string }) => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Text style={styles.sectionBody}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  masterContainer: { flex: 1, backgroundColor: '#FEFDF9' },
  topPurpleHeader: {
    backgroundColor: '#4E33B3', 
    paddingHorizontal: 20,
    paddingBottom: 15,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 10,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
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
  backButton: { flexDirection: 'row', alignItems: 'center' },
  subHeaderTitle: { color: '#1A73E8', fontWeight: 'bold', marginLeft: 15, fontSize: 16 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 25, paddingTop: 30 },
  protocolTag: { fontSize: 11, color: '#9FA8DA', fontWeight: '800', letterSpacing: 1.5, marginBottom: 10 },
  mainTitle: { fontSize: 36, fontWeight: '800', color: '#0D1B60', lineHeight: 42, marginBottom: 20 },
  introText: { fontSize: 15, color: '#5C677D', lineHeight: 24, marginBottom: 40 },
  documentCard: { marginBottom: 40 },
  sectionContainer: { marginBottom: 30 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A237E', marginBottom: 10 },
  sectionBody: { fontSize: 14, color: '#78849E', lineHeight: 22 },
  footerInfo: { marginTop: 10, borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 15 },
  versionText: { fontSize: 11, color: '#9FA8DA', fontStyle: 'italic', marginBottom: 4 },
  actionSection: { paddingBottom: 20 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, borderColor: '#D1D5DB', marginRight: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' },
  checkboxChecked: { backgroundColor: '#1A237E', borderColor: '#1A237E' },
  checkboxLabel: { fontSize: 14, color: '#5C677D' },
  agreeBtn: { backgroundColor: '#1A237E', height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  agreeBtnDisabled: { backgroundColor: '#C5CAE9' },
  agreeBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});