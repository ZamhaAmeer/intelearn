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
  { id: '11', title: 'Academic Integrity', tags: 'Ethics • Plagiarism • Research', code: 'IS1111', type: 'Compulsory (Non-GPA)', credits: '1 Credit', image: require('../src/assets/images/AcIt1.jpeg'), color: '#FFECB3' },
  { id: '12', title: 'General English I', tags: 'Grammar • Comprehension • Vocabulary', code: 'IS-EGP-1101', type: 'Compulsory (Non-GPA)', credits: '2 Credits', image: require('../src/assets/images/GE1.png'), color: '#C5CAE9' },

    // --- SEMESTER II ---
  { id: '13', title: 'Object Oriented Programming', tags: 'Classes • Inheritance • Polymorphism', code: 'IS2101', type: 'Compulsory', credits: '2 Credits', image: require('../src/assets/images/OOP.jpg'), color: '#F0F4C3' },
  { id: '14', title: 'Object Oriented Programming Practicum', tags: 'Java • IDE • Real-world coding', code: 'IS2102', type: 'Compulsory', credits: '1 Credit', image: require('../src/assets/images/OOPPrac.jpeg'), color: '#D7CCC8' },
  { id: '15', title: 'Emerging IS Technologies', tags: 'Cloud • DevOps • Blockchain', code: 'IS2103', type: 'Compulsory', credits: '1 Credit', image: require('../src/assets/images/EIS.jpeg'), color: '#BBDEFB' },
  { id: '16', title: 'Database Systems', tags: 'SQL • ER Modeling • Normalization', code: 'IS2104', type: 'Compulsory', credits: '2 Credits', image: require('../src/assets/images/DBS.jpeg'), color: '#C8E6C9' },
  { id: '17', title: 'Database Management Systems Practicum', tags: 'Queries • Joins • Implementation', code: 'IS2105', type: 'Compulsory', credits: '1 Credit', image: require('../src/assets/images/DBMS.jpg'), color: '#E1BEE7' },
  { id: '18', title: 'System Analysis & Design', tags: 'SDLC • UML • Planning', code: 'IS2106', type: 'Compulsory', credits: '1 Credit', image: require('../src/assets/images/SAD.jpeg'), color: '#FFCCBC' },
  { id: '19', title: 'Social & Professional Issues', tags: 'Ethics • Law • Intellectual Property', code: 'IS2107', type: 'Compulsory', credits: '1 Credit', image: require('../src/assets/images/SPI.jpg'), color: '#CFD8DC' },
  { id: '20', title: 'Human Computer Interaction', tags: 'UI/UX • Usability • Design', code: 'IS2108', type: 'Compulsory', credits: '2 Credits', image: require('../src/assets/images/HCI.jpg'), color: '#B3E5FC' },
  { id: '21', title: 'Information Assurance & Security', tags: 'CIA Triad • Encryption • Threats', code: 'IS2109', type: 'Compulsory', credits: '2 Credits', image: require('../src/assets/images/images.jpeg'), color: '#D1C4E9' },
  