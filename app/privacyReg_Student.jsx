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
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

export default function PrivacyScreen() {
  const router = useRouter();
  const [hasAgreed, setHasAgreed] = useState(false);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isDark, setIsDark] = useState(false);
  
  const toggleMenu = () => setMenuVisible(!isMenuVisible);

  // 🔑 NEW: Dynamic scroll detector to auto-unlock mode at the page bottom
  const handleScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    
    // Check if the user is near or at the bottom layout threshold (within 20 pixels)
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    
    if (isCloseToBottom && !hasAgreed) {
      setHasAgreed(true);
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
      <TouchableOpacity activeOpacity={0.8} onPress={onToggle}>
        <Animated.View style={[styles.trackStyle, rTrackStyle]}>
          <Animated.View style={[styles.thumbStyle, rThumbStyle]} />
        </Animated.View>
      </TouchableOpacity>
    );
  };

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
            <TouchableOpacity onPress={toggleMenu}>
            </TouchableOpacity>
            <TouchableOpacity>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

    {/* 2. SUB-HEADER */}
      <View style={styles.subHeader}>
        <TouchableOpacity onPress={() => router.replace('/register(student)')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#1A73E8" />
          <Text style={styles.subHeaderTitle}>Privacy & Data Policy</Text>
        </TouchableOpacity>
        <Feather name="info" size={20} color="#78849E" />
      </View>

          {/* 3. MAIN SCROLLABLE CONTENT */}
      {/* 🔑 FIXED: Wired up onScroll processing with optimal frame throttling parameters */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16} 
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

         {/* 4. DOCUMENT CARD */}
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
            title="Section 4.5: Biometric Facial Processing" 
            text="In alignment with proctoring integrity standards, Learnora employs advanced biometric processing during synchronous assessment periods. This involves the real-time analysis of camera data to verify identity and maintain continuous presence detection. This 'Biometric Facial Processing' protocol captures micro-expression data points to ensure the integrity of the testing environment. Data extracted under this section is processed locally when possible, but high-assurance assessments may require encrypted transmission to institutional security servers for forensic auditing. By proceeding, you authorize the temporary activation of hardware imaging devices for these specific compliance checks."
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

        <View style={{ height: 120 }} />
      </ScrollView>