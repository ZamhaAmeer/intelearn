import { useRouter } from 'expo-router'; // Add this line
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const [searchQuery, setSearchQuery] = useState('');
const { width } = Dimensions.get('window');

const COURSES = [
  { id: '1', title: 'Web Development', tags: 'HTML • CSS • JavaScript', label: 'Essential', labelColor: '#F5B7B1', rating: '78%', image: require('../../assets/images/WB.jpeg') },
  { id: '2', title: 'Computer Networks', tags: 'OSI Model • TCP/IP • HTTP', label: 'Supporting', labelColor: '#F9E79F', rating: '62%', image: require('../../assets/images/CN.jpg') },
  { id: '3', title: 'Database Systems', tags: 'SQL • NoSQL • Schema', label: 'Core pillar', labelColor: '#A3BBEA', rating: '55%', image: require('../../assets/images/DS.jpg') },
  { id: '4', title: 'Operating Systems', tags: 'Process Management • File Systems', label: 'Foundational', labelColor: '#A3EAE9', rating: '40%', image: require('../../assets/images/OS.jpeg') },
  { id: '5', title: 'Software Engineering', tags: 'SDLC • Agile • Git', label: 'Crucial', labelColor: '#E6C3E7', rating: '26%', image: require('../../assets/images/SE.jpg') },
];

const CourseCard = ({ item }) => (
  <View style={styles.cardContainer}>
    <View style={styles.imageCircleContainer}>
      <Image source={item.image} style={styles.courseImage} />
    </View>
    <View style={styles.infoCard}>
      <Text style={styles.courseTitle}>{item.title}</Text>
      <Text style={styles.courseTags}>{item.tags}</Text>
      <View style={styles.cardFooter}>
        <View style={[styles.statusBadge, { backgroundColor: item.labelColor }]}>
          <Text style={styles.badgeText}>{item.label}</Text>
        </View>
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>⭐ {item.rating}</Text>
        </View>
        <TouchableOpacity style={styles.viewButton}>
          <Text style={styles.viewText}>View</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

export default function CourseDetailsScreen() {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isChatbotOptionsVisible, setChatbotOptionsVisible] = useState(false);
  const router = useRouter();

  const toggleMenu = () => setMenuVisible(!isMenuVisible);
  const [searchQuery, setSearchQuery] = useState('');
  const toggleChatbot = () => setChatbotOptionsVisible(!isChatbotOptionsVisible);

  const filteredCourses = COURSES.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.tags.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <View style={styles.container}>
      {/* Side Menu Modal */}
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
                <MenuOption icon="🏠" title="Home" active={true} />
              </TouchableOpacity>  
              <TouchableOpacity onPress={() => {setMenuVisible(false); router.replace('/profilescreen') }}>
                <MenuOption icon="👤" title="Profile" />
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

      <Modal
        transparent={true}
        visible={isChatbotOptionsVisible}
        animationType="fade"
        onRequestClose={toggleChatbot}
      >
        <TouchableOpacity 
          style={styles.chatbotOverlay} 
          activeOpacity={1} 
          onPress={toggleChatbot}
        >
          <View style={styles.chatbotPopup}>
            <TouchableOpacity style={styles.charOption}>
               {/* Replace with your character image assets if you have them */}
               <TouchableOpacity style={styles.charOption} onPress={() => {setChatbotOptionsVisible(false); router.replace('/chatbotmaya') }}><Text style={{fontSize: 30}}>👩‍💼</Text></TouchableOpacity>
               <Text style={styles.charText}>Maya</Text>
            </TouchableOpacity>
            
            <View style={styles.charSeparator} />

            <TouchableOpacity style={styles.charOption} onPress={() => {setChatbotOptionsVisible(false); router.replace('/chatbotdhruv') }}>
               <Text style={{fontSize: 30}}>👨‍🎓</Text>
               <Text style={styles.charText}>Dhruv</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity 
            onPress={() => setMenuVisible(true)} 
            style={{ padding: 15, marginLeft: -10,marginTop: 10 }} // Increases the clickable area
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} // Makes the invisible button area larger
>
  <Text style={styles.menuIcon}>☰</Text>
</TouchableOpacity>
          <Text style={styles.bellIcon}>🔔</Text>
        </View>
        <Text style={styles.headerTitle}>Course</Text>
        <Text style={styles.headerSubtitle}>Details</Text>
        <View style={styles.searchSection}>
          <TextInput 
            style={styles.input}
            placeholder="Explore your future"
            placeholderTextColor="#888"
            value={searchQuery}          // Connect to state
            onChangeText={setSearchQuery} // Update state as user types
            clearButtonMode="while-editing" // Adds an 'X' to clear on iOS
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollList}>
        {filteredCourses.length > 0 ? (
          filteredCourses.map(course => <CourseCard key={course.id} item={course} />)
        ) : (
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <Text style={{ color: '#888' }}>No courses found for "{searchQuery}"</Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={toggleChatbot}>
        <Text style={{fontSize: 30}}>🤖</Text>
      </TouchableOpacity>
    
    </View>
  );
}

// Change this at the bottom of your code
const MenuOption = ({ icon, title, active }) => (
  <View style={[styles.menuItem, active && styles.activeMenuItem]}>
    <Text style={styles.menuItemIcon}>{icon}</Text>
    <Text style={[styles.menuItemText, active && styles.activeMenuText]}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FEFDF0' },
  // --- Modal Styles ---
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

  // --- Header Styles ---
  header: {
    backgroundColor: '#4E33B3',
    padding: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingBottom: 40,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  menuIcon: { color: 'white', fontSize: 24 },
  bellIcon: { color: 'white', fontSize: 24 },
  headerTitle: { color: 'white', fontSize: 32, fontWeight: 'bold' },
  headerSubtitle: { color: '#A292FF', fontSize: 32, fontWeight: 'bold', marginTop: -10 },
  searchSection: {
    backgroundColor: 'white',
    borderRadius: 25,
    marginTop: 20,
    paddingHorizontal: 15,
    height: 45,
    justifyContent: 'center',
  },
  scrollList: { padding: 20 },
  cardContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  imageCircleContainer: {
    width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: 'white',
    overflow: 'hidden', zIndex: 1, elevation: 10, shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3,
  },
  courseImage: { width: '100%', height: '100%' },
  infoCard: {
    flex: 1, backgroundColor: 'white', borderRadius: 20, padding: 15,
    paddingLeft: 40, marginLeft: -35, elevation: 5, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1,
  },
  courseTitle: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  courseTags: { fontSize: 12, color: '#666', marginVertical: 5 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  badgeText: { fontSize: 10, fontWeight: '600' },
  ratingBadge: { backgroundColor: '#D5DBDB', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  ratingText: { fontSize: 10 },
  viewButton: { backgroundColor: '#C9E227', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 10 },
  viewText: { fontWeight: 'bold', fontSize: 12 },
  fab: {
    position: 'absolute', bottom: 30, right: 30, backgroundColor: '#9B86EE',
    width: 65, height: 65, borderRadius: 33, justifyContent: 'center',
    alignItems: 'center', elevation: 8,
  },
  // --- Chatbot Popup Styles ---
  chatbotOverlay: {
    flex: 1,
    backgroundColor: 'transparent', // Transparent so it doesn't dim the screen if you prefer
  },
  chatbotPopup: {
    position: 'absolute',
    bottom: 110, // Positioned above the FAB
    right: 30,
    backgroundColor: '#E8E4FF', // Light purple background
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 5,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    borderWidth: 2,
    borderColor: '#9B86EE',
  },
  charOption: {
    alignItems: 'center',
    padding: 10,
    width: 70,
  },
  charText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4E33B3',
    marginTop: 2,
  },
  charSeparator: {
    height: 1,
    width: '60%',
    backgroundColor: '#9B86EE',
    marginVertical: 5,
  },
});