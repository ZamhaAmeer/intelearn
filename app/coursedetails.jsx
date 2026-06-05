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
  { id: '51', title: 'Business Process Management', tags: 'Workflows • Modeling • Optimization', code: 'IS5105', type: 'Compulsory', credits: '2 Credits', image: require('../src/assets/images/CSO.jpeg'), color: '#E8EAF6' },
  { id: '52', title: 'UI/UX Practicum', tags: 'Prototyping • Wireframes • Usability', code: 'IS5106', type: 'Compulsory', credits: '1 Credit', image: require('../src/assets/images/CSO.jpeg'), color: '#FFF3E0' },
  { id: '53', title: 'Project Management Practicum', tags: 'Scheduling • Resources • Execution', code: 'IS5107', type: 'Compulsory', credits: '1 Credit', image: require('../src/assets/images/CSO.jpeg'), color: '#E0F7FA' },
  { id: '54', title: 'Business Intelligence', tags: 'Data Mining • Analytics • Dashboards', code: 'IS5108', type: 'Compulsory', credits: '2 Credits', image: require('../src/assets/images/CSO.jpeg'), color: '#F1F8E9' },
  { id: '55', title: 'IS Project for Community', tags: 'Social Impact • Real-world Sol', code: 'IS5109', type: 'Compulsory', credits: '1 Credit', image: require('../src/assets/images/CSO.jpeg'), color: '#FBE9E7' },
  { id: '56', title: 'Business English', tags: 'Corporate Comm • Proposals', code: 'IS-EBP-3101', type: 'Compulsory (Non-GPA)', credits: '2 Credits', image: require('../src/assets/images/CSO.jpeg'), color: '#EFEBE9' },
  { id: '57', title: 'Advanced Database Systems', tags: 'Distributed Data • Query Optimization', code: 'IS5110', type: 'Elective', credits: '2 Credits', image: require('../src/assets/images/CSO.jpeg'), color: '#FFF8E1' },
  { id: '58', title: 'Data Communication & Networks', tags: 'Protocols • Routing • Topologies', code: 'IS5111', type: 'Elective', credits: '2 Credits', image: require('../src/assets/images/CSO.jpeg'), color: '#F3E5F5' },
  { id: '59', title: 'Design Patterns & Anti-patterns', tags: 'GoF Patterns • Refactoring', code: 'IS5112', type: 'Elective', credits: '2 Credits', image: require('../src/assets/images/CSO.jpeg'), color: '#E8F5E9' },
  { id: '60', title: 'Software Quality Assurance', tags: 'Testing • Metrics • Automation', code: 'IS5113', type: 'Elective', credits: '2 Credits', image: require('../src/assets/images/CSO.jpeg'), color: '#E1F5FE' },
  { id: '61', title: 'Data Mining & Analytics', tags: 'Big Data • Predictive • Algorithms', code: 'IS5114', type: 'Elective', credits: '2 Credits', image: require('../src/assets/images/CSO.jpeg'), color: '#F0F4C3' },

    // --- SEMESTER VI ---
  { id: '61a', title: 'Industrial Training', tags: 'Internship • Industry Exposure', code: 'IS6101', type: 'Compulsory', credits: '6 Credits', image: require('../src/assets/images/CSO.jpeg'), color: '#CFD8DC' },

    // --- SEMESTER VII ---
  { id: '62', title: 'Research Methodologies', tags: 'Research Design • Literature Review', code: 'IS7101', type: 'Compulsory', credits: '2 Credits', image: require('../src/assets/images/CSO.jpeg'), color: '#E1BEE7' },
  { id: '63', title: 'IT Law', tags: 'Cyber Law • Regulations • Policy', code: 'IS7102', type: 'Compulsory', credits: '1 Credit', image: require('../src/assets/images/CSO.jpeg'), color: '#FFE082' },
  { id: '64', title: 'Business Process Simulation', tags: 'Queuing Theory • Modeling Tools', code: 'IS7103', type: 'Compulsory', credits: '2 Credits', image: require('../src/assets/images/CSO.jpeg'), color: '#C8E6C9' },
  { id: '65', title: 'Enterprise Modelling Ontologies', tags: 'Semantic Web • Knowledge Representation', code: 'IS7104', type: 'Compulsory', credits: '2 Credits', image: require('../src/assets/images/CSO.jpeg'), color: '#FFCCBC' },
  { id: '66', title: 'Organizational Behavior & Management', tags: 'Leadership • Culture • Motivation', code: 'IS7105', type: 'Compulsory', credits: '1 Credit', image: require('../src/assets/images/CSO.jpeg'), color: '#B3E5FC' },
  { id: '67', title: 'Cloud Computing', tags: 'AWS • Azure • Microservices', code: 'IS7106', type: 'Compulsory', credits: '2 Credits', image: require('../src/assets/images/CSO.jpeg'), color: '#D1C4E9' },
  { id: '68', title: 'Mobile Application Development', tags: 'Android • iOS • Cross-platform', code: 'IS7107', type: 'Elective', credits: '1 Credit', image: require('../src/assets/images/CSO.jpeg'), color: '#FFCDD2' },
  { id: '69', title: 'Web Service Technologies', tags: 'REST • SOAP • APIs', code: 'IS7108', type: 'Elective', credits: '2 Credits', image: require('../src/assets/images/CSO.jpeg'), color: '#F5F5F5' },
  { id: '70', title: 'Geographical Information Systems', tags: 'Mapping • Spatial Data • ArcGIS', code: 'IS7109', type: 'Elective', credits: '2 Credits', image: require('../src/assets/images/CSO.jpeg'), color: '#DCEDC8' },
  { id: '71', title: 'Statistical Distribution & Inferences', tags: 'Probability • Testing • Data', code: 'IS7110', type: 'Elective', credits: '1 Credit', image: require('../src/assets/images/CSO.jpeg'), color: '#E0F2F1' },
  { id: '72', title: 'Advanced Programming Practicum', tags: 'Optimization • Problem Solving', code: 'IS7111', type: 'Elective', credits: '1 Credit', image: require('../src/assets/images/CSO.jpeg'), color: '#FFF9C4' },
  { id: '73', title: 'Machine Learning', tags: 'AI • Deep Learning • Neural Nets', code: 'IS7112', type: 'Elective', credits: '2 Credits', image: require('../src/assets/images/CSO.jpeg'), color: '#E1F5FE' },

    // --- SEMESTER VIII ---
  { id: '74', title: 'Research Project in IS', tags: 'Thesis • Investigation • Discovery', code: 'IS8101', type: 'Compulsory', credits: '8 Credits', image: require('../src/assets/images/CSO.jpeg'), color: '#FCE4EC' },
  { id: '75', title: 'Business/IT Alignment', tags: 'Strategy • Operations • Sync', code: 'IS8102', type: 'Compulsory', credits: '2 Credits', image: require('../src/assets/images/CSO.jpeg'), color: '#E8F5E9' },
  { id: '76', title: 'Human Resource Management', tags: 'Recruitment • Performance • Culture', code: 'IS8103', type: 'Compulsory', credits: '2 Credits', image: require('../src/assets/images/CSO.jpeg'), color: '#FFF3E0' },
  { id: '77', title: 'Scientific Communication', tags: 'Publications • Journals • Writing', code: 'IS8104', type: 'Compulsory', credits: '1 Credit', image: require('../src/assets/images/CSO.jpeg'), color: '#E8EAF6' },
  { id: '78', title: 'IS Economics', tags: 'Markets • Tech Value • Investment', code: 'IS8105', type: 'Compulsory', credits: '2 Credits', image: require('../src/assets/images/CSO.jpeg'), color: '#F1F8E9' },
  { id: '79', title: 'Computer System Security', tags: 'Defense • Cyber • Access Control', code: 'IS8106', type: 'Compulsory', credits: '2 Credits', image: require('../src/assets/images/CSO.jpeg'), color: '#FBE9E7' },
  { id: '80', title: 'Supply Chain Management', tags: 'Logistics • Operations • Distribution', code: 'IS8107', type: 'Elective', credits: '2 Credits', image: require('../src/assets/images/CSO.jpeg'), color: '#E0F7FA' },
  { id: '81', title: 'Advanced Computer Networks', tags: 'IPv6 • Routing • Network Sec', code: 'IS8108', type: 'Elective', credits: '2 Credits', image: require('../src/assets/images/CSO.jpeg'), color: '#FFF8E1' },
  { id: '82', title: 'Process Mining', tags: 'Event Logs • Optimization • Discovery', code: 'IS8109', type: 'Elective', credits: '2 Credits', image: require('../src/assets/images/CSO.jpeg'), color: '#F3E5F5' },
  { id: '83', title: 'Digital Business Model', tags: 'Disruption • E-Commerce • Value', code: 'IS8110', type: 'Elective', credits: '1 Credit', image: require('../src/assets/images/CSO.jpeg'), color: '#E1F5FE' },
  { id: '84', title: 'Game Development', tags: 'Unity • 3D Design • Physics', code: 'IS8111', type: 'Elective', credits: '2 Credits', image: require('../src/assets/images/CSO.jpeg'), color: '#F0F4C3' }
];

const getSemesterFromCode = (code) => {
  if (code === 'IS-EGP-1101') return '1st Sem';
  if (code === 'IS-EGP-1201') return '2nd Sem';
  if (code === 'IS-EAP-2101') return '3rd Sem';
  if (code === 'IS-EAP-2201') return '4th Sem';
  if (code === 'IS-EBP-3101') return '5th Sem';

  if (code.startsWith('IS1')) return '1st Sem';
  if (code.startsWith('IS2')) return '2nd Sem';
  if (code.startsWith('IS3')) return '3rd Sem';
  if (code.startsWith('IS4')) return '4th Sem';
  if (code.startsWith('IS5')) return '5th Sem';
  if (code.startsWith('IS6')) return '6th Sem';
  if (code.startsWith('IS7')) return '7th Sem';
  if (code.startsWith('IS8')) return '8th Sem';
  
  return 'Unknown';
};
// 2. SUB-COMPONENTS
const SunIcon = ({ color }) => (
  <Svg width="22" height="22" viewBox="0 0 512 512">
    <Path fill={color} d="M256,104c-83.813,0-152,68.187-152,152s68.187,152,152,152s152-68.187,152-152S339.813,104,256,104z M256,368c-61.757,0-112-50.243-112-112s50.243-112,112-112s112,50.243,112,112S317.757,368,256,368z M256,72c11.046,0,20-8.954,20-20V20c0-11.046-8.954-20-20-20s-20,8.954-20,20v32C236,63.046,244.954,72,256,72z M256,440c-11.046,0-20,8.954-20,20v32c0,11.046,8.954,20,20,20s20-8.954,20-20v-32C276,448.954,267.046,440,256,440z M440,256c0-11.046,8.954-20,20-20h32c11.046,0,20,8.954,20,20s-8.954,20-20,20h-32C448.954,276,440,267.046,440,256z M72,256c0,11.046-8.954,20-20,20H20c-11.046,0-20-8.954-20-20s8.954-20,20-20h32C63.046,236,72,244.954,72,256z"/>
  </Svg>
);

const MoonIcon = ({ color }) => (
  <Svg width="20" height="20" viewBox="0 0 512 512">
    <Path fill={color} d="M410,329.2c-73.4,0-132.8-59.4-132.8-132.8c0-33.8,12.6-64.6,33.4-88.1c-14.7-3.4-30.1-5.3-46-5.3c-110,0-199.1,89.2-199.1,199.1S154.6,501.2,264.6,501.2c78.8,0,147-45.7,179.3-111.9C434,329.1,422.3,329.2,410,329.2z"/>
  </Svg>
);

const ThemeToggle = ({ isDark, onToggle }) => {
  const progress = useSharedValue(isDark ? 1 : 0);
  useEffect(() => { progress.value = withSpring(isDark ? 1 : 0); }, [isDark]);

const rTrackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], ['#E0E0E0', '#333333']),
  }));
const rThumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * 34 }],
  }));

  return (
    <Pressable onPress={onToggle}>
      <ReAnimated.View style={[styles.toggleTrack, rTrackStyle]}>
        <View style={styles.toggleIconsLayer}>
           <SunIcon color="#999" />
           <MoonIcon color="#999" />
        </View>
        <ReAnimated.View style={[styles.toggleThumb, rThumbStyle]}>
           {isDark ? <MoonIcon color="white" /> : <SunIcon color="white" />}
        </ReAnimated.View>
      </ReAnimated.View>
    </Pressable>
  );
};

const MenuOption = ({ iconName, title, active, onPress }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.menuItem,
      active && styles.activeMenuItem,
      pressed && styles.pressedMenuItem 
    ]}
  >
    <Icon name={iconName} size={22} color={active ? "#4E33B3" : "#7E57C2"} style={styles.menuItemIcon} />
    <Text style={[styles.menuItemText, active && styles.activeMenuText]}>{title}</Text>
  </Pressable>
);

const CourseCard = ({ item, onView }) => (
  <TouchableOpacity style={styles.cardContainer} onPress={() => onView(item)}>
    <View style={styles.imageCircleContainer}>
      <Image source={item.image} style={styles.courseImage} />
    </View>
    <View style={styles.infoCard}>
      <Text style={styles.courseTitle} numberOfLines={1}>{item.title}</Text>
      <Text style={styles.courseTags} numberOfLines={1}>{item.tags}</Text>
      <View style={styles.badgeRow}>
        <View style={[styles.statusBadge, { backgroundColor: '#FFCCBC' }]}><Text style={styles.badgeText}>{item.code}</Text></View>
        <View style={[styles.statusBadge, { backgroundColor: '#C8E6C9' }]}><Text style={styles.badgeText}>{item.type}</Text></View>
        <View style={[styles.statusBadge, { backgroundColor: '#CFD8DC' }]}><Text style={styles.badgeText}>{item.credits}</Text></View>
      </View>
    </View>
  </TouchableOpacity>
);

// 3. MAIN SCREEN
export default function CourseDetailsScreen() {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isChatbotOptionsVisible, setChatbotOptionsVisible] = useState(false);
  const [isNotifVisible, setNotifVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); 
  const [notifications, setNotifications] = useState(3);
  const [activePopupTab, setActivePopupTab] = useState('notifications');
  const router = useRouter();

  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef(null); 
  const headerHeight = useRef(100);
  const sectionOffsets = useRef({});

  const stickyTitleOpacity = scrollY.interpolate({ inputRange: [60, 110], outputRange: [0, 1], extrapolate: 'clamp' });
  const mainTitleOpacity = scrollY.interpolate({ inputRange: [0, 80], outputRange: [1, 0], extrapolate: 'clamp' });

  const toggleMenu = () => setMenuVisible(!isMenuVisible);
  const toggleChatbot = () => setChatbotOptionsVisible(!isChatbotOptionsVisible);

  const filteredCourses = COURSES.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.tags.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const semesters = ['1st Sem', '2nd Sem', '3rd Sem', '4th Sem', '5th Sem', '6th Sem', '7th Sem', '8th Sem'];
  const [activeSem, setActiveSem] = useState('1st Sem');

  const groupedCourses = semesters.map(sem => ({
    title: sem,
    data: filteredCourses.filter(c => getSemesterFromCode(c.code) === sem)
  }));

  // ==============================================================
  // THE MATHEMATICAL FALLBACK FIX
  // This calculates exactly where the screen needs to go, even if 
  // the app hasn't loaded the bottom of the screen yet!
  // ==============================================================
  const handleTabPress = (sem) => {
    setActiveSem(sem);
    
    setTimeout(() => {
      // 1. Get the known Header Height or fallback to a standard 280px
      const safeHeaderHeight = headerHeight.current || 280;
      
      // 2. Get the Y location from React Native (if it loaded)
      let yOffset = sectionOffsets.current[sem];

      // 3. IF THE APP DIDN'T LOAD THE LOCATION YET, DO THE MATH OURSELVES!
      if (yOffset === undefined) {
        let estimatedY = 0;
        for (let i = 0; i < groupedCourses.length; i++) {
          if (groupedCourses[i].title === sem) break;
          if (groupedCourses[i].data.length > 0) {
            estimatedY += 45; // Exact pixel height of the "1st Sem" title
            estimatedY += (groupedCourses[i].data.length * 125); // Math: number of courses * height of one card
          }
        }
        yOffset = estimatedY;
      }

      // 4. Calculate Final Destination
      let targetY = sem === '1st Sem' ? 0 : (safeHeaderHeight + yOffset - 110);
      if (targetY < 0) targetY = 0; // Never scroll above the ceiling

      // 5. Force the Scroll Command
      try {
        if (scrollRef.current?.scrollTo) {
          scrollRef.current.scrollTo({ y: targetY, animated: true });
        } else if (scrollRef.current?.getNode?.().scrollTo) {
          scrollRef.current.getNode().scrollTo({ y: targetY, animated: true });
        }
      } catch (err) {
        console.log("Scroll Failed:", err);
      }
    }, 50);
  };

 const openPopup = (tab) => {
    setActivePopupTab(tab);
    setNotifVisible(true);
  } 

  // --- POPUP VIEWS RENDERING FUNCTIONS ---
  const renderNotificationsContent = () => (
    <View style={styles.popupContentArea}>
      <View style={styles.notifListItem}>
        <View style={[styles.notifIconCircle, { backgroundColor: '#E0D4FC' }]}>
          <Icon name="clipboard-text-outline" size={24} color="#6F42C1" />
        </View>
        <View style={styles.notifTextContainer}>
          <Text style={styles.notifTitle}>New assignment posted</Text>
          <Text style={styles.notifDesc}>Structured Programming: Unit 4 - Logic Gates</Text>
          <Text style={styles.notifTime}>2 HOURS AGO</Text>
        </View>
      </View>

      <View style={styles.notifListItem}>
        <View style={[styles.notifIconCircle, { backgroundColor: '#FCE4EC' }]}>
          <Icon name="calendar-month-outline" size={24} color="#D81B60" />
        </View>
        <View style={styles.notifTextContainer}>
          <Text style={styles.notifTitle}>Exam date reminder</Text>
          <Text style={styles.notifDesc}>Fundamentals of IS mid-term scheduled for Oct 12th.</Text>
          <Text style={styles.notifTimeRed}>YESTERDAY</Text>
        </View>
      </View>

      <View style={styles.notifListItem}>
        <View style={[styles.notifIconCircle, { backgroundColor: '#EDE7F6' }]}>
          <Icon name="message-text-outline" size={24} color="#7E57C2" />
        </View>
        <View style={styles.notifTextContainer}>
          <Text style={styles.notifTitle}>New grade available</Text>
          <Text style={styles.notifDesc}>Assignment 3: Modular Functions - Grade: A-</Text>
          <Text style={styles.notifTime}>2 DAYS AGO</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.bottomActionBtn} onPress={() => {setNotifVisible(false); setNotifications(0);}}>
        <Text style={styles.bottomActionText}>MARK ALL AS READ</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCalendarContent = () => (
    <View style={styles.popupContentArea}>
      <View style={styles.calHeader}>
        <Text style={styles.calMonthText}>November 2023</Text>
        <View style={styles.calArrows}>
          <Icon name="chevron-left" size={24} color="#555" />
          <Icon name="chevron-right" size={24} color="#555" />
        </View>
      </View>
            
      {/* Days Row */}
      <View style={styles.calDaysRow}>
        {['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'].map((day, i) => (
          <Text key={i} style={styles.calDayName}>{day}</Text>
        ))}
      </View>

      {/* Dates Grid (Hardcoded exactly to the image layout for this visual) */}
      <View style={styles.calDatesGrid}>
        <View style={styles.calDateRow}>
          <Text style={[styles.calDateText, styles.calDateDim]}>30</Text>
          <Text style={[styles.calDateText, styles.calDateDim]}>31</Text>
          <Text style={styles.calDateText}>1</Text>
          <Text style={styles.calDateText}>2</Text>
          <Text style={styles.calDateText}>3</Text>
          <Text style={styles.calDateText}>4</Text>
          <Text style={styles.calDateText}>5</Text>
        </View>
        <View style={styles.calDateRow}>
          <Text style={styles.calDateText}>6</Text>
          <TouchableOpacity onPress={() => {
            router.push("/assignment_submission");
            setNotifVisible(false);
          }}>
            <View style={[styles.calDateItem, styles.calDateHighlightPurpleLight]}>
              <Text style={[styles.calDateText, {color: '#6F42C1'}]}>7</Text>
              <View style={[styles.calDateDot, {backgroundColor: '#6F42C1'}]} />
            </View>
          </TouchableOpacity>
          <Text style={styles.calDateText}>8</Text>
          <Text style={styles.calDateText}>9</Text>
          <View style={[styles.calDateItem, styles.calDateHighlightPinkLight]}>
             <Text style={[styles.calDateText, {color: '#D81B60'}]}>10</Text>
             <View style={[styles.calDateDot, {backgroundColor: '#D81B60'}]} />
          </View>
          <Text style={styles.calDateText}>11</Text>
          <Text style={styles.calDateText}>12</Text>
        </View>
        <View style={styles.calDateRow}>
          <Text style={styles.calDateText}>13</Text>
          <View style={[styles.calDateItem, styles.calDateHighlightPurpleDark]}>
             <Text style={[styles.calDateText, {color: 'white'}]}>14</Text>
          </View>
                    <Text style={styles.calDateText}>15</Text>
          <Text style={styles.calDateText}>16</Text>
          <Text style={styles.calDateText}>17</Text>
          <Text style={styles.calDateText}>18</Text>
          <Text style={styles.calDateText}>19</Text>
        </View>
        <View style={styles.calDateRow}>
          <Text style={styles.calDateText}>20</Text>
          <Text style={styles.calDateText}>21</Text>
          <Text style={styles.calDateText}>22</Text>
          <Text style={styles.calDateText}>23</Text>
          <Text style={styles.calDateText}>24</Text>
          <Text style={styles.calDateText}>25</Text>
          <Text style={styles.calDateText}>26</Text>
        </View>
      </View>

      {/* Tomorrow Event Card */}
      <View style={styles.calEventCard}>
        <View style={styles.calEventIconWrap}>
           <Icon name="calendar-text-outline" size={24} color="#6F42C1" />
        </View>
        <View style={styles.calEventInfo}>
           <Text style={styles.calEventLabel}>TOMORROW</Text>
           <Text style={styles.calEventTitle}>IS Final Review Session</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.bottomActionBtn} onPress={() => setNotifVisible(false)}>
        <Text style={[styles.bottomActionText, {color: '#777'}]}>VIEW FULL SCHEDULE</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, isDark && { backgroundColor: '#121212' }]}>

      {/* STABLE TOP BAR */}
      <View style={[styles.stableTopBar, isDark && { backgroundColor: '#1A1A1A' }]}>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Icon name="menu" size={30} color="white" />
        </TouchableOpacity>

        <Animated.View style={{ opacity: stickyTitleOpacity }}>
          <Text style={styles.stickyTitleText}>Course Details</Text>
        </Animated.View>

        <TouchableOpacity onPress={() => setNotifVisible(true)} style={styles.notificationContainer}>
          <Icon name="bell-outline" size={28} color="white" />
          {notifications > 0 && (
            <View style={styles.badge}><Text style={styles.badgeTextSmall}>{notifications}</Text></View>
          )}
        </TouchableOpacity>
      </View>

      <Animated.ScrollView 
        ref={scrollRef}
        contentContainerStyle={styles.scrollList} 
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
      >
        <View onLayout={(e) => { headerHeight.current = e.nativeEvent.layout.height; }}>
          <View style={[styles.headerContentSection, isDark && { backgroundColor: '#1A1A1A' }]}>
            <Animated.View style={{ opacity: mainTitleOpacity }}>
              <Text style={styles.headerTitle}>Course</Text>
              <Svg height="45" width="200" style={{marginTop: -5}}>
                <Defs>
                  <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                    <Stop offset="0" stopColor="#9B86EE" stopOpacity="1" />
                    <Stop offset="0.6" stopColor="#5CA0D3" stopOpacity="1" />
                    <Stop offset="1" stopColor="#31B998" stopOpacity="1" />
                  </LinearGradient>
                </Defs>
                <SvgText fill="url(#grad)" fontSize="38" fontWeight="bold" x="0" y="35">Details</SvgText>
              </Svg>
            </Animated.View>
                        
            <View style={styles.searchSection}>
              <TextInput 
                style={styles.input} 
                placeholder="Explore your future" 
                placeholderTextColor="#888" 
                value={searchQuery} 
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          {/* SEMESTER TABS */}
          <View style={styles.tabsWrapper}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
              {semesters.map((sem, index) => (
                <TouchableOpacity 
                  key={index} 
                  onPress={() => handleTabPress(sem)}
                  style={[styles.tabButton, activeSem === sem && styles.activeTabButton]}
                >
                  <Text style={[styles.tabText, activeSem === sem && styles.activeTabText]}>{sem}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* LIST RENDERED BY GROUPS TO TRACK Y POSITIONS */}
        <View style={styles.cardListWrapper}>
          {filteredCourses.length > 0 ? (
            groupedCourses.map(group => {
              if (group.data.length === 0) return null; 
              return (
                <View 
                  key={group.title} 
                  onLayout={(e) => { 
                    sectionOffsets.current[group.title] = e.nativeEvent.layout.y; 
                  }}
                >
                  <Text style={styles.sectionHeader}>{group.title}</Text>
                  
                  {group.data.map((course) => (
                    <CourseCard 
                      key={course.id} 
                      item={course} 
                      onView={(item) => {
                        switch (item.code) {
                          case 'IS1101': router.push('/FIS'); break;
                          case 'IS1102': router.push('/structured-t'); break;
                          case 'IS1103': router.push('/structured-p'); break;
                          case 'IS1104': router.push('/theories-is'); break;
                          case 'IS1105': router.push('/comp-org'); break;
                          case 'IS1106': router.push('/foundations-web-tech'); break;
                          case 'IS1107': router.push('/personal-productivity'); break;
                          case 'IS1108': router.push('/fundamentals-maths'); break;
                          case 'IS1109': router.push('/stats-probability'); break;
                          case 'IS1110': router.push('/comm-skills-1'); break;
                          case 'IS1111': router.push('/academic-integrity'); break;
                          case 'IS-EGP-1101': router.push('/gen-english-1'); break;

                          case 'IS2101': router.push('/oop'); break;
                          case 'IS2102': router.push('/oop-p'); break;
                          case 'IS2103': router.push('/emerging-tech'); break;
                          case 'IS2104': router.push('/dbms'); break;
                          case 'IS2105': router.push('/dbms-p'); break;
                          case 'IS2106': router.push('/sad'); break;
                          case 'IS2107': router.push('/social-prof-issues'); break;
                          case 'IS2108': router.push('/hci'); break;
                          case 'IS2109': router.push('/info-assurance-sec'); break;
                          case 'IS2110': router.push('/sw-project-planning'); break;
                          case 'IS2111': router.push('/adv-maths'); break;
                          case 'IS2112': router.push('/comm-skills-2'); break;
                          case 'IS-EGP-1201': router.push('/gen-english-2'); break;

                          case 'IS3101': router.push('/ooad'); break;
                          case 'IS3102': router.push('/dsa'); break;
                          case 'IS3103': router.push('/it-governance'); break;
                          case 'IS3104': router.push('/software-eng'); break;
                          case 'IS3105': router.push('/is-risk-mgt'); break;
                          case 'IS3106': router.push('/is-sustainability'); break;
                          case 'IS3107': router.push('/mis'); break;
                          case 'IS3108': router.push('/e-business'); break;
                          case 'IS3109': router.push('/digital-innovation'); break;
                          case 'IS-EAP-2101': router.push('/acad-english-1'); break;


