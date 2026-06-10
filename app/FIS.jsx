import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
}from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- HELPER COMPONENTS FOR MENU ---
// These ensure your menu renders properly if you haven't built them separately yet
const ThemeToggle = ({ isDark, onToggle }) => (
  <Switch value={isDark} onValueChange={onToggle} trackColor={{ false: "#767577", true: "#5C45C3" }} />
);