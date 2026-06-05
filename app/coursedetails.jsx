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
  { id: '22', title: 'Software Project Initiation & Planning', tags: 'Project Charter • WBS • Scoping', code: 'IS2110', type: 'Compulsory', credits: '1 Credit', image: require('../src/assets/images/SIP.jpg'), color: '#FFCDD2' },
  { id: '23', title: 'Advanced Mathematics', tags: 'Calculus • Graph Theory', code: 'IS2111', type: 'Compulsory', credits: '2 Credits', image: require('../src/assets/images/AdvM.jpg'), color: '#F5F5F5' },
  { id: '24', title: 'Communication Skills II', tags: 'Presentations • Reports • Memos', code: 'IS2112', type: 'Compulsory (Non-GPA)', credits: '2 Credits', image: require('../src/assets/images/comskills2.png'), color: '#E0F2F1' },
  { id: '25', title: 'General English II', tags: 'Business Comm • Advanced Grammar', code: 'IS-EGP-1201', type: 'Compulsory (Non-GPA)', credits: '2 Credits', image: require('../src/assets/images/GE2.jpg'), color: '#FFF9C4' },

    // --- SEMESTER III ---
  { id: '26', title: 'Object Oriented Analysis & Design', tags: 'UML Modeling • Design Patterns', code: 'IS3101', type: 'Compulsory', credits: '2 Credits', image: require('../src/assets/images/OOAD.jpeg'), color: '#FFECB3' },
  { id: '27', title: 'Data Structures & Algorithms', tags: 'Trees • Graphs • Sorting', code: 'IS3102', type: 'Compulsory', credits: '2 Credits', image: require('../src/assets/images/DSA.jpeg'), color: '#E1F5FE' },
  { id: '28', title: 'IT Governance', tags: 'COBIT • Compliance • Frameworks', code: 'IS3103', type: 'Compulsory', credits: '2 Credits', image: require('../src/assets/images/ITG.jpeg'), color: '#E8F5E9' },
  { id: '29', title: 'Software Engineering', tags: 'Lifecycles • Requirements • Testing', code: 'IS3104', type: 'Compulsory', credits: '2 Credits', image: require('../src/assets/images/SE.jpg'), color: '#F3E5F5' },
  { id: '30', title: 'IS Risk Management', tags: 'Assessment • Mitigation • Strategy', code: 'IS3105', type: 'Compulsory', credits: '2 Credits', image: require('../src/assets/images/ISRM.jpeg'), color: '#FFF3E0' },
  { id: '31', title: 'IS Sustainability', tags: 'Green IT • Lifecycle • Environmental', code: 'IS3106', type: 'Compulsory', credits: '1 Credit', image: require('../src/assets/images/ISSt.jpeg'), color: '#E0F7FA' },
  { id: '32', title: 'Management Information Systems', tags: 'Enterprise • CRM • SCM', code: 'IS3107', type: 'Compulsory', credits: '2 Credits', image: require('../src/assets/images/MIS.jpeg'), color: '#FBE9E7' },
  { id: '33', title: 'E-Business', tags: 'E-commerce • Strategy • Infrastructure', code: 'IS3108', type: 'Compulsory', credits: '1 Credit', image: require('../src/assets/images/EB.jpg'), color: '#E8EAF6' },
  { id: '34', title: 'Digital Innovation', tags: 'Transformation • Disruptive Tech', code: 'IS3109', type: 'Compulsory', credits: '2 Credits', image: require('../src/assets/images/DI.png'), color: '#F1F8E9' },
  { id: '35', title: 'Academic English I', tags: 'Research Writing • Comprehension', code: 'IS-EAP-2101', type: 'Compulsory (Non-GPA)', credits: '2 Credits', image: require('../src/assets/images/ACE1.jpg'), color: '#FFEBEE' },

    // --- SEMESTER IV ---
  { id: '36', title: 'IT Auditing', tags: 'Compliance • Controls • Frameworks', code: 'IS4101', type: 'Compulsory', credits: '2 Credits', image: require('../src/assets/images/IT-audit.jpg'), color: '#F8BBD0' },
  { id: '37', title: 'Web Application Development', tags: 'Full-stack • PHP • Frameworks', code: 'IS4102', type: 'Compulsory', credits: '2 Credits', image: require('../src/assets/images/WB.jpeg'), color: '#C5CAE9' },
  { id: '38', title: 'Operating Systems', tags: 'Processes • Memory • Concurrency', code: 'IS4103', type: 'Compulsory', credits: '2 Credits', image: require('../src/assets/images/OS.jpeg'), color: '#D1C4E9' },
  { id: '39', title: 'System Administration and Maintenance', tags: 'Linux • Scripts • Infrastructure', code: 'IS4104', type: 'Compulsory', credits: '2 Credits', image: require('../src/assets/images/SAS.jpeg'), color: '#B3E5FC' },
  { id: '40', title: 'IT Procurement Management', tags: 'Contracts • Tenders • Sourcing', code: 'IS4105', type: 'Compulsory', credits: '1 Credit', image: require('../src/assets/images/IS4105.jpeg'), color: '#DCEDC8' },
  { id: '41', title: 'Software Architecture', tags: 'Patterns • Microservices • Design', code: 'IS4106', type: 'Compulsory', credits: '2 Credits', image: require('../src/assets/images/IS4106.jpg'), color: '#FFECB3' },
  { id: '42', title: 'Professionalism & Ethics in Computing', tags: 'Code of Conduct • Ethics', code: 'IS4107', type: 'Compulsory', credits: '1 Credit', image: require('../src/assets/images/IS4107.jpg'), color: '#F0F4C3' },
  { id: '43', title: 'IS Strategies', tags: 'Alignment • Business Goals • Planning', code: 'IS4108', type: 'Compulsory', credits: '1 Credit', image: require('../src/assets/images/IS4108.jpg'), color: '#E1F5FE' },
  { id: '44', title: 'Agile Software Development', tags: 'Scrum • Kanban • Sprints', code: 'IS4109', type: 'Compulsory', credits: '2 Credits', image: require('../src/assets/images/IS4109.jpg'), color: '#E8F5E9' },
  { id: '45', title: 'Capstone Project', tags: 'Implementation • Problem Solving', code: 'IS4110', type: 'Compulsory', credits: '2 Credits', image: require('../src/assets/images/IS4110.jpg'), color: '#FFCCBC' },
  { id: '46', title: 'Academic English II', tags: 'Presentation • Professional Writing', code: 'IS-EAP-2201', type: 'Compulsory (Non-GPA)', credits: '2 Credits', image: require('../src/assets/images/ACE2.jpeg'), color: '#FFF9C4' },

    // --- SEMESTER V ---
  { id: '47', title: 'Entrepreneurship & Innovation', tags: 'Startups • Ideation • Business Models', code: 'IS5101', type: 'Compulsory', credits: '1 Credit', image: require('../src/assets/images/CSO.jpeg'), color: '#BBDEFB' },
  { id: '48', title: 'Enterprise Architecture', tags: 'TOGAF • Systems Integration', code: 'IS5102', type: 'Compulsory', credits: '1 Credit', image: require('../src/assets/images/CSO.jpeg'), color: '#D7CCC8' },
  { id: '49', title: 'High Performance Computing', tags: 'Parallel Processing • GPU • Scaling', code: 'IS5103', type: 'Compulsory', credits: '2 Credits', image: require('../src/assets/images/CSO.jpeg'), color: '#E0F2F1' },
  { id: '50', title: 'Software Process Management', tags: 'CMMI • Quality • Process Improvement', code: 'IS5104', type: 'Compulsory', credits: '1 Credit', image: require('../src/assets/images/CSO.jpeg'), color: '#FCE4EC' },
  