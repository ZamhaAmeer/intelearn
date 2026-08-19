import React, { useState, useRef } from 'react';
import { StyleSheet, SafeAreaView, View, Alert, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import tangoHtml from '../src/assets/Mini Games/tango/tangoHtml';
import BreakTimerOverlay from '../src/components/BreakTimerOverlay';
import { useGlobalTheme } from './themeStore';