import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// Reanimated for the smooth button slide
import ReAnimated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Path, Stop, Text as SvgText } from 'react-native-svg';
const { width, height } = Dimensions.get('window');

// 1. DATA DEFINITION
const COURSES = [
  // --- SEMESTER I ---
  { id: '1', title: 'Fundamentals of IS', tags: 'Digital Transformation • Business Process', code: 'IS1101', type: 'Compulsory', credits: '2 Credits', image: require('../src/assets/images/FIS.jpg'), color: '#FFCCBC' },
  { id: '2', title: 'Structured Programming(T)', tags: 'C Syntax • Logic & Control', code: 'IS1102', type: 'Compulsory', credits: '2 Credits', image: require('../src/assets/images/STRT.jpg'), color: '#C8E6C9' },