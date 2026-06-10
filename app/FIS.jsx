import { useLocalSearchParams, useRouter } from 'expo-router'; // Added useLocalSearchParams
import { ChevronRight } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react'; // Added useEffect
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Modal, PanResponder, Pressable,
  SafeAreaView,
  StatusBar, StyleSheet,
  Text, TouchableOpacity, View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');