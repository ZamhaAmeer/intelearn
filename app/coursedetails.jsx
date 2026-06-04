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
  { id: '3', title: 'Structured Programming(P)', tags: 'Compilation • Data Structures', code: 'IS1103', type: 'Compulsory', credits: '1 Credit', image: require('../src/assets/images/STRP.jpg'), color: '#CFD8DC' },
  { id: '4', title: 'Theories of IS', tags: 'Organizational Behavior • Frameworks', code: 'IS1104', type: 'Compulsory', credits: '2 Credits', image: require('../src/assets/images/TIS.jpg'), color: '#B3E5FC' },
  { id: '5', title: 'Computer System Organization', tags: 'CPU Architecture • Memory Hierarchy', code: 'IS1105', type: 'Compulsory', credits: '2 Credits', image: require('../src/assets/images/CSO.jpeg'), color: '#D1C4E9' },
  { id: '6', title: 'Foundations of Web Technologies', tags: 'HTML • CSS • Client-Side', code: 'IS1106', type: 'Compulsory', credits: '2 Credits', image: require('../src/assets/images/WB.jpeg'), color: '#FFE082' },
  { id: '7', title: 'Personal Productivity with IT', tags: 'Tools • Documentation • Efficiency', code: 'IS1107', type: 'Compulsory', credits: '1 Credit', image: require('../src/assets/images/PPIT.jpeg'), color: '#F8BBD0' },
  { id: '8', title: 'Fundamentals of Mathematics', tags: 'Algebra • Logic • Matrices', code: 'IS1108', type: 'Compulsory', credits: '2 Credits', image: require('../src/assets/images/FOM.jpeg'), color: '#DCEDC8' },
  { id: '9', title: 'Statistics & Probability Theory', tags: 'Data • Inference • Analysis', code: 'IS1109', type: 'Compulsory', credits: '2 Credits', image: require('../src/assets/images/Stat.png'), color: '#B2EBF2' },
  { id: '10', title: 'Communication Skills I', tags: 'Written • Verbal • Professional', code: 'IS1110', type: 'Compulsory (Non-GPA)', credits: '2 Credits', image: require('../src/assets/images/comskills1.jpeg'), color: '#E1BEE7' },
