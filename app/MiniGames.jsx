import { router } from 'expo-router';
import React, { useRef } from 'react';
import {
  Dimensions,
  PanResponder,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

// --- Placeholder Icon Components ---
const BrainIcon = () => (
  <View style={styles.brainIconContainer}>
    <Text style={styles.brainEmoji}>🧠</Text>
  </View>
);

const ZipGameIcon = () => (
  <View style={[styles.gameIconBlock, { backgroundColor: '#111' }]}>
    <View style={styles.zipShape} />
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

const CrossclimbIcon = () => (
  <View style={[styles.gameIconBlock, { backgroundColor: '#E3F2F1', justifyContent: 'space-evenly', paddingVertical: 8 }]}>
    <View style={{ width: '80%', height: 6, backgroundColor: '#64C4D1', alignSelf: 'center' }} />
    <View style={{ width: '100%', height: 6, backgroundColor: '#F4BCA9' }} />
    <View style={{ width: '80%', height: 6, backgroundColor: '#64C4D1', alignSelf: 'center' }} />
  </View>
);

const PinpointIcon = () => (
  <View style={[styles.gameIconBlock, { backgroundColor: '#5D9CEC' }]}>
    <View style={{ width: '100%', height: '50%', backgroundColor: '#4A89DC', position: 'absolute', bottom: 0, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }} />
  </View>
);

// --- Main Data Array ---
const GAMES = [
  {
    id: '1',
    title: 'Zip Game',
    subtitle: 'Perfect for stress relief',
    Icon: ZipGameIcon,
  },
  {
    id: '2',
    title: 'Tango',
    subtitle: 'Blast away boredom',
    Icon: TangoIcon,
  },
  {
    id: '3',
    title: 'Crossclimb',
    subtitle: 'Sharpen your mind',
    Icon: CrossclimbIcon,
  },
  {
    id: '4',
    title: 'Pinpoint',
    subtitle: 'Instant calm',
    Icon: PinpointIcon,
  },
];



export default function App() {

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
          router.replace('/coursedetails');
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
                
                <TouchableOpacity style={styles.playButton} activeOpacity={0.8}>
                  <Text style={styles.playButtonText}>Play now</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

        </ScrollView>
      </View>
      </View>
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
  zipShape: {
    width: 24,
    height: 24,
    borderColor: '#FF1493',
    borderWidth: 4,
    borderBottomColor: '#00FFFF',
    borderRightColor: '#FF4500',
    borderRadius: 6,
    alignSelf: 'center',
    marginTop: 10,
    transform: [{ rotate: '45deg' }],
  },
  tangoSquare: {
    width: '50%',
    height: '50%',
    borderWidth: 0.5,
    borderColor: '#CCC',
  },
});