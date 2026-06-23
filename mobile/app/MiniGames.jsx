
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  PanResponder,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Modal,
  Pressable
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

// --- Placeholder Icon Components ---
const BrainIcon = () => (
  <View style={styles.brainIconContainer}>
    <Text style={styles.brainEmoji}>🧠</Text>
  </View>
);

const PacManIcon = () => (
  <View style={[styles.gameIconBlock, { backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }]}>
    <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#FFD700' }} />
    <View style={{
      position: 'absolute',
      right: 6,
      width: 0,
      height: 0,
      borderTopWidth: 10,
      borderTopColor: 'transparent',
      borderBottomWidth: 10,
      borderBottomColor: 'transparent',
      borderRightWidth: 12,
      borderRightColor: '#000',
    }} />
  </View>
);

const BubbleShooterIcon = () => (
  <View style={[styles.gameIconBlock, { backgroundColor: '#1e1e2f' }]}>
    <View style={{width: 20, height: 20, borderRadius: 10, backgroundColor: '#ff0055', position: 'absolute', top: 5, left: 10}} />
    <View style={{width: 20, height: 20, borderRadius: 10, backgroundColor: '#00ff55', position: 'absolute', top: 15, left: 20}} />
    <View style={{width: 20, height: 20, borderRadius: 10, backgroundColor: '#00ffff', position: 'absolute', top: 22, left: 5}} />
  </View>
);

const TangoIcon = () => (
  <View style={[styles.gameIconBlock, { flexWrap: 'wrap', flexDirection: 'row' }]}>
    <View style={[styles.tangoSquare, { backgroundColor: '#7DAAF2', borderTopLeftRadius: 8 }]} />
    <View style={[styles.tangoSquare, { backgroundColor: '#FFF', borderTopRightRadius: 8 }]} />
    <View style={[styles.tangoSquare, { backgroundColor: '#FFF', borderBottomLeftRadius: 8 }]} />
    <View style={[styles.tangoSquare, { backgroundColor: '#F6A830', borderBottomRightRadius: 8 }]} />
  </View>
);

const FlappyBirdIcon = () => (
  <View style={[styles.gameIconBlock, { backgroundColor: '#71C5CF' }]}>
    <Image 
      source={{ uri: 'https://upload.wikimedia.org/wikipedia/en/0/0a/Flappy_Bird_icon.png' }} 
      style={{ width: '100%', height: '100%', resizeMode: 'cover' }} 
    />
  </View>
);

// --- Main Data Array ---
const GAMES = [
  {
    id: '1',
    title: 'Pac-Man',
    subtitle: 'Classic arcade fun',
    Icon: PacManIcon,
  },
  {
    id: '5',
    title: 'Bubble Shooter',
    subtitle: 'Pop to relax',
    Icon: BubbleShooterIcon,
  },
  {
    id: '2',
    title: 'Tango',
    subtitle: 'Blast away boredom',
    Icon: TangoIcon,
  },
  {
    id: '3',
    title: 'Flappy Bird',
    subtitle: 'Tap to fly',
    Icon: FlappyBirdIcon,
  },
];

const MenuOption = ({ iconName, title, active, onPress }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.menuOption,
      active && styles.menuOptionActive,
      pressed && { opacity: 0.7 }
    ]}
  >
    <Icon name={iconName} size={22} color={active ? "#4E33B3" : "#7E57C2"} />
    <Text style={[styles.menuOptionText, active && styles.menuOptionTextActive]}>{title}</Text>
  </Pressable>
);

import { useRouter } from 'expo-router';

export default function App() {
  const router = useRouter();
  const [isMenuVisible, setMenuVisible] = useState(false);
  const toggleMenu = () => setMenuVisible(!isMenuVisible);

  const panResponder = useRef(
    PanResponder.create({
      // Explicitly ignore initial taps so buttons and ScrollView can work
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,

      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Only claim the swipe if horizontal movement is at least TWICE the vertical movement.
        // This ensures diagonal/messy scrolling down doesn't trigger the back swipe.
        const isHorizontalSwipe = Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 2;
        const isSignificantSwipe = Math.abs(gestureState.dx) > 20;
        
        return isHorizontalSwipe && isSignificantSwipe;
      },
      
      // We use the capture phase to ensure the ScrollView doesn't eat the horizontal swipe
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        const isHorizontalSwipe = Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 2;
        const isSignificantSwipe = Math.abs(gestureState.dx) > 20;
        
        return isHorizontalSwipe && isSignificantSwipe;
      },

      onPanResponderRelease: (evt, gestureState) => {
        // If swiped right by more than 60 pixels, navigate Home
        if (gestureState.dx > 60) {
          router.replace('/courseDetails');
        }
      },
    })
  ).current;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mainContainer} {...panResponder.panHandlers}>
      <View style={styles.mainContainer}>
        
        {/* Fixed Header Section (Includes Background and Brain) */}
        <View style={styles.headerWrapper}>
          <TouchableOpacity style={styles.menuIconButton} onPress={toggleMenu}>
            <Icon name="menu" size={30} color="white" />
          </TouchableOpacity>
          <View style={styles.headerBackground}>
            <Text style={styles.headerTitle}>Mindful Break</Text>
          </View>
          <View style={styles.brainPositioner}>
            <BrainIcon />
          </View>
        </View>

        {/* Scrollable Content - STARTS HERE */}
        <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false}>
          
          {/* Top Info Section */}
          <View style={styles.infoSection}>
            <Text style={styles.mainHeading}>Time for a quick reset ?</Text>
            <Text style={styles.description}>
              We noticed you might need a breather. Taking just 5 minutes to recharge can boost your focus by up to 40%
            </Text>
          </View>

          {/* Games List Section */}
          <View style={styles.listSection}>
            <Text style={styles.sectionTitle}>CHOOSE YOUR VIBE</Text>
            
            {GAMES.map((game) => (
              <View key={game.id} style={styles.card}>
                <View style={styles.cardLeft}>
                  <game.Icon />
                  <View style={styles.textContainer}>
                    <Text style={styles.gameTitle}>{game.title}</Text>
                    <Text style={styles.gameSubtitle}>{game.subtitle}</Text>
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={styles.playButton} 
                  activeOpacity={0.8}
                  onPress={() => {
                    if (game.id === '1') {
                      router.push('/PacManGame');
                    } else if (game.id === '2') {
                      router.push('/TangoGame');
                    } else if (game.id === '3') {
                      router.push('/FlappyBirdGame');
                    } else if (game.id === '5') {
                      router.push('/BubbleShooterGame');
                    }
                  }}
                >
                  <Text style={styles.playButtonText}>Play now</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

        </ScrollView>
      </View>
      </View>

      {/* SIDE MENU MODAL */}
      <Modal transparent visible={isMenuVisible} animationType="fade" onRequestClose={toggleMenu}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={toggleMenu}>
          <View style={styles.sideMenu}>
            <View style={styles.menuHeader}>
              <TouchableOpacity onPress={toggleMenu}>
                <Icon name="menu" size={30} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.menuList}>
              <MenuOption iconName="home-variant" title="Home" onPress={() => { setMenuVisible(false); router.replace('/coursedetails'); }} />
              <MenuOption iconName="account" title="Profile" onPress={() => { setMenuVisible(false); router.replace('/profilescreen_student'); }} />
              <MenuOption iconName="view-dashboard" title="Dashboard" onPress={() => { setMenuVisible(false); router.replace('/dashboard'); }} />
              <MenuOption iconName="controller-classic" title="Games" active onPress={() => { setMenuVisible(false); router.replace('/MiniGames'); }} />
              <MenuOption iconName="cog" title="Settings" onPress={() => { setMenuVisible(false); router.replace('/settings'); }} />
            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={() => { setMenuVisible(false); router.replace('/loginpage_Student'); }}>
              <Text style={styles.logoutText}> Log Out    <Icon name="logout" size={24} color="grey" /></Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#4E33B3', 
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#FDFBF4',
  },
  menuIconButton: {
    position: 'absolute',
    left: 20,
    top: 45, // Adjusted to sit visually nicely in the header
    zIndex: 20, // Must be higher than the background
  },
  headerWrapper: {
    alignItems: 'center',
    zIndex: 10, // Ensures header stays above scrolling content
  },
  headerBackground: {
    backgroundColor: '#4E33B3', 
    height: 140,
    width: width * 1.5, 
    alignSelf: 'center',
    borderBottomLeftRadius: width,
    borderBottomRightRadius: width,
    alignItems: 'center',
    paddingTop: 45,
  },
  // --- Modal Styles ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sideMenu: {
    width: width * 0.75,
    height: '100%',
    backgroundColor: '#FFFFFF',
    paddingTop: 60, // Account for safe area status bar
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  menuList: {
    flex: 1,
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    marginBottom: 8,
  },
  menuOptionActive: {
    backgroundColor: '#F0E6FF',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginLeft: -10, // Offset padding to keep icon aligned
  },
  menuOptionText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  menuOptionTextActive: {
    color: '#6542D2',
    fontWeight: 'bold',
  },
  logoutButton: {
    paddingVertical: 30,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    marginTop: 'auto',
  },
  logoutText: {
    fontSize: 16,
    color: 'grey',
    fontWeight: '600',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
  },
  brainPositioner: {
    marginTop: -30, // Pulls the brain up so it overlaps the purple background
  },
  brainIconContainer: {
    backgroundColor: '#D1C4E9',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    // Removed marginBottom since spacing is now handled by infoSection
  },
  brainEmoji: {
    fontSize: 28,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  infoSection: {
    alignItems: 'center',
    paddingHorizontal: 30,
    marginTop: 20, // Gives space between the fixed brain icon and the scrolling text
  },
  mainHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#757575',
    textAlign: 'center',
    lineHeight: 22,
  },
  listSection: {
    paddingHorizontal: 20,
    marginTop: 40,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4A4A4A',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textContainer: {
    marginLeft: 16,
    flex: 1,
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
  },
  gameSubtitle: {
    fontSize: 13,
    color: '#7A7A7A',
  },
  playButton: {
    backgroundColor: '#6542D2',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#6542D2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  playButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  // --- Temporary Icon Styles ---
  gameIconBlock: {
    width: 48,
    height: 48,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  tangoSquare: {
    width: '50%',
    height: '50%',
    borderWidth: 0.5,
    borderColor: '#CCC',
  },
});