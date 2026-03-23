import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    Modal,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const COURSES = [
    { id: '1', title: 'Web Development', tags: 'HTML • CSS • JavaScript', label: 'Essential', labelColor: '#F5B7B1', rating: '78%', image: require('../../assets/images/WB.jpeg'), description: "Master the art of building modern, responsive websites from scratch using the latest web technologies." },
    { id: '2', title: 'Computer Networks', tags: 'OSI Model • TCP/IP • HTTP', label: 'Supporting', labelColor: '#F9E79F', rating: '62%', image: require('../../assets/images/CN.jpg'), description: "Understand how data travels across the globe and the protocols that keep the internet running smoothly." },
    { id: '3', title: 'Database Systems', tags: 'SQL • NoSQL • Schema', label: 'Core pillar', labelColor: '#A3BBEA', rating: '55%', image: require('../../assets/images/DS.jpg'), description: "Learn to design, implement, and manage complex data structures using both relational and non-relational systems." },
    { id: '4', title: 'Operating Systems', tags: 'Process Management • File Systems', label: 'Foundational', labelColor: '#A3EAE9', rating: '40%', image: require('../../assets/images/OS.jpeg'), description: "Dive into the heart of computing: how hardware and software interact to manage resources efficiently." },
    { id: '5', title: 'Software Engineering', tags: 'SDLC • Agile • Git', label: 'Crucial', labelColor: '#E6C3E7', rating: '26%', image: require('../../assets/images/SE.jpg'), description: "Explore professional software development methodologies, from agile planning to version control." },
];

const MenuOption = ({ icon, title, active }) => (
    <View style={[styles.menuItem, active && styles.activeMenuItem]}>
        <Text style={styles.menuItemIcon}>{icon}</Text>
        <Text style={[styles.menuItemText, active && styles.activeMenuText]}>{title}</Text>
    </View>
);

const CourseCard = ({ item, onView }) => (
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
                <TouchableOpacity style={styles.viewButton} onPress={() => onView(item)}>
                    <Text style={styles.viewText}>View</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
);

export default function CourseDetailsScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [isMenuVisible, setMenuVisible] = useState(false);
    const [isChatbotOptionsVisible, setChatbotOptionsVisible] = useState(false);
    const [isDetailVisible, setDetailVisible] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

    const toggleMenu = () => setMenuVisible(!isMenuVisible);
    const toggleChatbot = () => setChatbotOptionsVisible(!isChatbotOptionsVisible);
    
    const handleViewCourse = (course) => {
        setSelectedCourse(course);
        setDetailVisible(true);
    };

    const filteredCourses = COURSES.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.tags.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Side Menu */}
            <Modal transparent visible={isMenuVisible} animationType="fade" onRequestClose={toggleMenu}>
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={toggleMenu}>
                    <View style={styles.sideMenu}>
                        <View style={styles.menuHeader}>
                            <TouchableOpacity onPress={toggleMenu}><Text style={styles.closeMenuText}>☰</Text></TouchableOpacity>
                            <Text style={styles.moonIcon}>🌙</Text>
                        </View>
                        <View style={styles.menuList}>
                            <TouchableOpacity onPress={() => { setMenuVisible(false); router.replace('/coursedetails') }}><MenuOption icon="🏠" title="Home" active /></TouchableOpacity>
                            <TouchableOpacity onPress={() => { setMenuVisible(false); router.replace('/profilescreen') }}><MenuOption icon="👤" title="Profile" /></TouchableOpacity>
                            <MenuOption icon="📊" title="Dashboard" />
                             <MenuOption icon="🎮" title="Games" />
                            <MenuOption icon="🛡️" title="Privacy" />
                            <TouchableOpacity onPress={() => { setMenuVisible(false); router.replace('/settings') }}><MenuOption icon="⚙️" title="Settings" /></TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.logoutButton} onPress={() => { setMenuVisible(false); router.replace('/loginpage') }}>
                            <Text style={styles.logoutText}><Icon name="logout" size={24} color="red" /> Log Out</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Chatbot Selector */}
            {/* Chatbot Selector */}
<Modal transparent visible={isChatbotOptionsVisible} animationType="fade" onRequestClose={toggleChatbot}>
    <TouchableOpacity style={styles.chatbotOverlay} activeOpacity={1} onPress={toggleChatbot}>
        <View style={styles.chatbotPopup}>
            
            {/* Maya Option */}
            <TouchableOpacity 
                style={styles.charOption} 
                onPress={() => { 
                    setChatbotOptionsVisible(false); // Close this popup
                    setSelectedCourse({ title: "AI Assistant (Maya)", description: "Interact with Maya to get personalized guidance on your learning journey." }); // Set dummy info or keep null
                    setDetailVisible(true); // Open the Insight Modal
                }}
            >
                <Text style={{ fontSize: 30 }}>👩‍💼</Text>
                <Text style={styles.charText}>Maya</Text>
            </TouchableOpacity>

            <View style={styles.charSeparator} />

            {/* Dhruv Option */}
            <TouchableOpacity 
                style={styles.charOption} 
                onPress={() => { 
                    setChatbotOptionsVisible(false); // Close this popup
                    setSelectedCourse({ title: "AI Assistant (Dhruv)", description: "Ask Dhruv anything about your courses, schedules, or technical questions." });
                    setDetailVisible(true); // Open the Insight Modal
                }}
            >
                <Text style={{ fontSize: 30 }}>👨‍🎓</Text>
                <Text style={styles.charText}>Dhruv</Text>
            </TouchableOpacity>
            
        </View>
    </TouchableOpacity>
</Modal>

            {/* Insight Modal */}
            <Modal transparent visible={isDetailVisible} animationType="fade" onRequestClose={() => setDetailVisible(false)}>
                <View style={styles.detailOverlay}>
                    <View style={styles.boostPopupCard}>
                        <View style={styles.boostHeader}>
                            <Text style={styles.boostIcon}>🧠</Text>
                            <Text style={styles.boostTitle}>COURSE INSIGHT ACTIVE</Text>
                            <TouchableOpacity onPress={() => setDetailVisible(false)} style={styles.closePopup}>
                                <Ionicons name="close" size={20} color="#5D47E0" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.boostCourseName}>{selectedCourse?.title}</Text>
                        <Text style={styles.boostDescription}>
                            {selectedCourse?.description}{"\n\n"}To access full course module or chatbot, please register using your university email.
                        </Text>
                        <TouchableOpacity 
                            style={styles.boostActionBtn} 
                            onPress={() => { setDetailVisible(false); router.push('/choosingpage'); }}
                        >
                            <Text style={styles.boostActionText}>Select your role</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.headerIconBtn}>
                        <Text style={styles.menuIcon}>☰</Text>
                    </TouchableOpacity>
                    <Text style={styles.bellIcon}>🔔</Text>
                </View>
                <Text style={styles.headerTitle}>Course</Text>
                <Text style={styles.headerSubtitle}>Details</Text>
                <View style={styles.searchSection}>
                    <TextInput 
                        style={styles.searchInput}
                        placeholder="Explore your future"
                        placeholderTextColor="#888"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollList}>
                {filteredCourses.length > 0 ? (
                    filteredCourses.map(course => (
                        <CourseCard key={course.id} item={course} onView={handleViewCourse} />
                    ))
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No results found.</Text>
                    </View>
                )}
            </ScrollView>

            <TouchableOpacity style={styles.fab} onPress={toggleChatbot}>
                <Text style={{ fontSize: 30}}>🤖</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FEFDF0' },
    
    // Side Menu
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
    sideMenu: { width: width * 0.55, height: '100%', backgroundColor: 'white', padding: 20, borderTopRightRadius: 20, borderBottomRightRadius: 20, elevation: 10 },
    menuHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30, marginTop: 30 },
    closeMenuText: { fontSize: 24, color: '#333' },
    moonIcon: { fontSize: 18 },
    menuList: { flex: 1 },
    menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 10, borderRadius: 10, marginBottom: 5 },
    activeMenuItem: { backgroundColor: '#E8E4FF' },
    menuItemIcon: { fontSize: 18, marginRight: 15 },
    menuItemText: { fontSize: 16, color: '#444', fontWeight: '500' },
    activeMenuText: { color: '#5D47E0', fontWeight: 'bold' },
    logoutButton: { borderTopWidth: 1, borderTopColor: '#eee', paddingVertical: 20, alignItems: 'center' },
    logoutText: { fontSize: 20, fontWeight: 'bold', color: '#000' },

    // Header
    header: { backgroundColor: '#4E33B3', padding: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, paddingBottom: 40, paddingTop: Platform.OS === 'ios' ? 50 : 30 },
    headerTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    menuIcon: { color: 'white', fontSize: 24 },
    bellIcon: { color: 'white', fontSize: 24 },
    headerTitle: { color: 'white', fontSize: 32, fontWeight: 'bold' },
    headerSubtitle: { color: '#A292FF', fontSize: 32, fontWeight: 'bold', marginTop: -10 },
    searchSection: { backgroundColor: 'white', borderRadius: 25, marginTop: 20, paddingHorizontal: 15, height: 45, justifyContent: 'center', elevation: 3 },
    searchInput: { fontSize: 14, color: '#333' },

    // Cards
    scrollList: { padding: 20, paddingBottom: 80 },
    cardContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
    imageCircleContainer: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: 'white', overflow: 'hidden', zIndex: 2, elevation: 5 },
    courseImage: { width: '100%', height: '100%' },
    infoCard: { flex: 1, backgroundColor: 'white', borderRadius: 20, padding: 15, paddingLeft: 40, marginLeft: -35, elevation: 5 , shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1},
    courseTitle: { fontSize: 18, fontWeight: 'bold', color: '#222' },
    courseTags: { fontSize: 12, color: '#777', marginVertical: 5 },
    cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
    badgeText: { fontSize: 10, fontWeight: '600', color: '#333' },
    ratingBadge: { backgroundColor: '#F0F0F0', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
    ratingText: { fontSize: 9, fontWeight: 'bold' },
    viewButton: { backgroundColor: '#C9E227', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 10 },
    viewText: { fontWeight: 'bold', fontSize: 12, color: '#2B3D00' },

    // FAB & Popup
    fab: { position: 'absolute', bottom: 30, right: 30, backgroundColor: '#9B86EE', width: 65, height: 65, borderRadius: 33, justifyContent: 'center', alignItems: 'center', elevation: 8 },
    chatbotOverlay: { flex: 1, backgroundColor: 'transparent' },
    chatbotPopup: { position: 'absolute', bottom: 110, right: 30, backgroundColor: '#EEF0FF', borderRadius: 50, paddingVertical: 10, paddingHorizontal: 5, alignItems: 'center', elevation: 10, borderWidth: 2, borderColor: '#5D47E0' },
    charOption: { alignItems: 'center', padding: 10, width: 70 },
    charText: { fontSize: 10, fontWeight: 'bold', color: '#5D47E0', marginTop: 2 },
    charSeparator: { height: 1, width: '60%', backgroundColor: '#D0D7FF', marginVertical: 5 },

    // Insight Modal
    detailOverlay: { flex: 1, backgroundColor: 'rgba(78, 51, 179, 0.2)', justifyContent: 'center', alignItems: 'center', padding: 30 },
    boostPopupCard: { backgroundColor: '#EEF0FF', borderRadius: 20, padding: 20, width: '90%', borderWidth: 1.5, borderColor: '#D0D7FF', elevation: 15 },
    boostHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    boostIcon: { fontSize: 18, marginRight: 8 },
    boostTitle: { color: '#5D47E0', fontWeight: '900', fontSize: 12, letterSpacing: 1, flex: 1 },
    boostCourseName: { fontSize: 20, fontWeight: 'bold', color: '#111', marginBottom: 8 },
    boostDescription: { color: '#444', fontSize: 14, lineHeight: 20, marginBottom: 15 },
    boostActionBtn: { backgroundColor: '#5D47E0', borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
    boostActionText: { color: 'white', fontWeight: 'bold', fontSize: 15 },
    
    emptyContainer: { alignItems: 'center', marginTop: 50 },
    emptyText: { color: '#999', fontSize: 14 }
});