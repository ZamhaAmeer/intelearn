import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Modal,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function MyStudyPlan() {
  // --- Animation State ---
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  // --- Input States ---
  const [startTime, setStartTime] = useState('09:00 AM');
  const [endTime, setEndTime] = useState('10:30 AM');
  const [category, setCategory] = useState('Reading');
  const [isPickerVisible, setPickerVisible] = useState(false);

  useEffect(() => {
    // Triggers progress bar animation on mount
    progressAnim.setValue(0);
    Animated.timing(progressAnim, {
      toValue: 25, 
      duration: 1500,
      useNativeDriver: false,
    }).start();
  }, []);

  const barWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* PURPLE HEADER - Profile Button Removed */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Feather name="menu" size={24} color="white" />
          <Text style={styles.headerTitle}>My Study Plan</Text>
          <View style={{ width: 24 }} /> {/* Spacer to keep title centered */}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        
        {/* DATE TABS */}
        <View style={styles.tabs}>
          <TouchableOpacity style={[styles.tab, styles.activeTab]}><Text style={styles.activeTabText}>Today</Text></TouchableOpacity>
          <TouchableOpacity style={styles.tab}><Text style={styles.tabText}>Tomorrow</Text></TouchableOpacity>
          <TouchableOpacity style={styles.tab}><Text style={styles.tabText}>May 12</Text></TouchableOpacity>
        </View>

        {/* DAILY PROGRESS CARD (ANIMATED) */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Daily Progress</Text>
            <View style={styles.badge}><Text style={styles.badgeText}>25%</Text></View>
          </View>
          <View style={styles.barBg}>
            <Animated.View style={[styles.barFill, { width: barWidth }]} />
          </View>
          <Text style={styles.subText}>1 of 4 tasks completed</Text>
        </View>

        {/* ADD NEW TASK SECTION */}
        <Text style={styles.sectionTitle}>Add New Task</Text>
        <View style={styles.formCard}>
          <Text style={styles.inputLabel}>TASK NAME</Text>
          <TextInput style={styles.input} placeholder="Enter task.." placeholderTextColor="#A0AEC0" />
          
          <View style={styles.row}>
            {/* EDITABLE START TIME */}
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.inputLabel}>START TIME</Text>
              <View style={styles.inputWrapper}>
                <TextInput style={styles.editableInput} value={startTime} onChangeText={setStartTime} />
                <Feather name="clock" size={16} color="#A0AEC0" />
              </View>
            </View>
            {/* EDITABLE END TIME */}
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>END TIME</Text>
              <View style={styles.inputWrapper}>
                <TextInput style={styles.editableInput} value={endTime} onChangeText={setEndTime} />
                <MaterialCommunityIcons name="clock-plus-outline" size={16} color="#A0AEC0" />
              </View>
            </View>
          </View>

          {/* CATEGORY & ADD TASK (ALIGNED) */}
          <View style={[styles.row, { alignItems: 'flex-end', marginBottom: 0 }]}>
            <View style={{ flex: 1.5, marginRight: 10 }}>
              <Text style={styles.inputLabel}>CATEGORY</Text>
              <TouchableOpacity style={styles.selector} onPress={() => setPickerVisible(true)}>
                <Text style={styles.selectorText}>{category}</Text>
                <Feather name="chevron-down" size={18} color="#718096" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>Add Task</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* AI SMART PLANNER BANNER */}
        <View style={styles.aiBanner}>
          <View style={styles.aiHeader}>
            <View style={styles.aiIconContainer}>
              <MaterialCommunityIcons name="lightbulb-on-outline" size={22} color="white" />
            </View>
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.aiTitle}>Plan smarter, not harder</Text>
              <Text style={styles.aiDesc}>Our AI can analyze your curriculum and deadlines to generate an optimized daily plan.</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.aiButton}>
            <Text style={styles.aiButtonText}>Auto Fill Plan</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* FLOATING ACTION BUTTON */}
      <TouchableOpacity style={styles.fab}><Feather name="plus" size={30} color="white" /></TouchableOpacity>

      {/* CATEGORY PICKER MODAL */}
      <Modal visible={isPickerVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setPickerVisible(false)}>
          <View style={styles.modalContent}>
            {['Reading', 'Lecture', 'Practice', 'Coding'].map(item => (
              <TouchableOpacity key={item} style={styles.modalItem} onPress={() => {setCategory(item); setPickerVisible(false);}}>
                <Text style={styles.modalText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FEFDF9' },
  header: { backgroundColor: '#4F33AF', height: 110, borderBottomLeftRadius: 40, borderBottomRightRadius: 40, justifyContent: 'center', paddingHorizontal: 20 },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  scrollBody: { padding: 20, paddingBottom: 100 },
  tabs: { flexDirection: 'row', marginBottom: 20 },
  tab: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#F0F2F8', marginRight: 10 },
  activeTab: { backgroundColor: '#5D5FEF' },
  activeTabText: { color: 'white', fontWeight: 'bold' },
  tabText: { color: '#718096' },
  card: { backgroundColor: '#F0F4F8', padding: 20, borderRadius: 25, marginBottom: 25 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  cardLabel: { fontWeight: 'bold', color: '#2D3748' },
  badge: { backgroundColor: '#C7D2FE', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  badgeText: { color: '#5D5FEF', fontSize: 12, fontWeight: 'bold' },
  barBg: { height: 10, backgroundColor: '#E2E8F0', borderRadius: 5, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: '#5D5FEF' },
  subText: { fontSize: 12, color: '#718096', marginTop: 8 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#2D3748', marginBottom: 15 },
  formCard: { backgroundColor: '#F0F4F8', padding: 20, borderRadius: 25, marginBottom: 25 },
  inputLabel: { fontSize: 10, color: '#A0AEC0', fontWeight: 'bold', marginBottom: 8 },
  input: { backgroundColor: '#E2E8F0', height: 45, borderRadius: 15, paddingHorizontal: 15, marginBottom: 15 },
  row: { flexDirection: 'row', marginBottom: 15 },
  inputWrapper: { backgroundColor: '#E2E8F0', height: 45, borderRadius: 15, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, flex: 1 },
  editableInput: { flex: 1, color: '#2D3748', fontSize: 14 },
  selector: { backgroundColor: '#E2E8F0', height: 45, borderRadius: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, flex: 1 },
  selectorText: { color: '#2D3748', fontSize: 14 },
  addButton: { flex: 1, backgroundColor: '#5D5FEF', height: 45, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  addButtonText: { color: 'white', fontWeight: 'bold' },
  aiBanner: { backgroundColor: '#6366F1', borderRadius: 30, padding: 20 },
  aiHeader: { flexDirection: 'row', marginBottom: 15 },
  aiIconContainer: { width: 35, height: 35, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  aiTitle: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  aiDesc: { color: 'white', fontSize: 11, opacity: 0.8, marginTop: 2 },
  aiButton: { backgroundColor: 'white', borderRadius: 20, height: 45, alignItems: 'center', justifyContent: 'center' },
  aiButtonText: { color: '#6366F1', fontWeight: 'bold' },
  fab: { position: 'absolute', bottom: 25, right: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: '#5D5FEF', alignItems: 'center', justifyContent: 'center', elevation: 5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: 'white', width: '80%', borderRadius: 20, padding: 20 },
  modalItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F0F2F8' },
  modalText: { textAlign: 'center', color: '#2D3748', fontSize: 16 },
});