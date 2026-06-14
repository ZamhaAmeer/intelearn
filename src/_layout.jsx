import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      
      {/* 1. Splash Screen (index) */}
      <Tabs.Screen
        name="index"
        options={{
          href: null, // This hides the icon completely from the bar
          tabBarStyle: { display: 'none' }, // This hides the bar when on this screen
        }}
      />

      {/* 2. Choosing Page */}
      <Tabs.Screen
        name="choosingpage" // Ensure this matches your filename exactly
        options={{
          href: null, // Hides the icon so users can't click it to get here
          tabBarStyle: { display: 'none' }, // Hides the bar on this screen
        }}
      />

      {/* 3. Explore (or other actual tab screens) */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          href: null,
           tabBarStyle: { display: 'none' },
        }}
      />

       <Tabs.Screen
        name="loginpage_Student)" // Ensure this matches your filename exactly
        options={{
          href: null, // Hides the icon so users can't click it to get here
          tabBarStyle: { display: 'none' }, // Hides the bar on this screen
        }}
      />
      <Tabs.Screen
        name="loginPage_Lecturer)" // Ensure this matches your filename exactly
        options={{
          href: null, // Hides the icon so users can't click it to get here
          tabBarStyle: { display: 'none' }, // Hides the bar on this screen
        }}
      />
      <Tabs.Screen
        name="register(student)" // Ensure this matches your filename exactly
        options={{
          href: null, // Hides the icon so users can't click it to get here
          tabBarStyle: { display: 'none' }, // Hides the bar on this screen
        }}
      />
      <Tabs.Screen
        name="register(lecturer)" // Ensure this matches your filename exactly
        options={{
          href: null, // Hides the icon so users can't click it to get here
          tabBarStyle: { display: 'none' }, // Hides the bar on this screen
        }}
      />
      <Tabs.Screen
        name="coursedetails" // Ensure this matches your filename exactly
        options={{
          href: null, // Hides the icon so users can't click it to get here
          tabBarStyle: { display: 'none' }, // Hides the bar on this screen
        }}
      />
      <Tabs.Screen
        name="profilescreen" // Ensure this matches your filename exactly
        options={{
          href: null, // Hides the icon so users can't click it to get here
          tabBarStyle: { display: 'none' }, // Hides the bar on this screen
        }}
      />
      <Tabs.Screen
        name="settings" // Ensure this matches your filename exactly
        options={{
          href: null, // Hides the icon so users can't click it to get here
          tabBarStyle: { display: 'none' }, // Hides the bar on this screen
        }}
      />
      <Tabs.Screen
        name="chatbotdhruv" // Ensure this matches your filename exactly
        options={{
          href: null, // Hides the icon so users can't click it to get here
          tabBarStyle: { display: 'none' }, // Hides the bar on this screen
        }}
      />
      <Tabs.Screen
        name="chatbotmaya" // Ensure this matches your filename exactly
        options={{
          href: null, // Hides the icon so users can't click it to get here
          tabBarStyle: { display: 'none' }, // Hides the bar on this screen
        }}
      />
      <Tabs.Screen
        name="coursedetailsforguest" // Ensure this matches your filename exactly
        options={{
          href: null, // Hides the icon so users can't click it to get here
          tabBarStyle: { display: 'none' }, // Hides the bar on this screen
        }}
      />
    </Tabs>

    

    
  );
}