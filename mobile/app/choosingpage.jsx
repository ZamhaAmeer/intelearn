import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// Get screen height to scale the header appropriately
const { height } = Dimensions.get('window');

const ChoosingPage = () => {
  const router = useRouter();

  const handleNavigation = () => {
    // Navigate to your login page file
    router.push('/loginPage'); 
  };

  return (
    <View style={styles.container}>
      
      {/* New Header Section: Use ImageBackground to apply the multi-layer wave asset.
        Replace with your actual asset path.
      */}
      <ImageBackground 
        source={require('../src/assets/images/header-curve.png')} 
        style={styles.headerImageBackground}
        resizeMode="stretch" // This ensures the curve stretches across the full width
      >
        <View style={styles.logoContainer}>
            <Image 
                source={require("../src/assets/images/logo.png")} // Use your logo asset
                style={styles.logoImage}
                resizeMode="contain"
            />
            <Text style={styles.logoText}>INTELEARN</Text>
        </View>
      </ImageBackground>

      {/* Content Section below the header */}
      <View style={styles.content}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome to INTELEARN</Text>
          <Text style={styles.tagline}>Learn smart, Grow fast</Text>
        </View>

        {/* Path Section */}
        <View style={styles.pathSection}>
          <Text style={styles.pathTitle}>Engrave your path</Text>
          
          <View style={styles.optionsContainer}>
            {/* Student Option */}
            <TouchableOpacity 
              style={styles.optionButton}
              onPress={() => router.push('./loginpage_Student')} // Adjust paths as needed
            >
              <Ionicons name="school" size={35} color="black" style={styles.icon} />
              <Text style={styles.optionText}>I am a Student</Text>
            </TouchableOpacity>

            {/* Educator Option */}
            <TouchableOpacity 
              style={styles.optionButton}
              onPress={() => router.push("./loginPage_Lecturer")}
            >
              <Ionicons name="people" size={35} color="black" style={styles.icon} />
              <Text style={styles.optionText}>I am an Educator</Text>
            </TouchableOpacity>

            {/* Guest Option */}
            <TouchableOpacity 
              style={styles.optionButton}
              onPress={() => router.push('./coursedetailsforguest')}
            >
              <Ionicons name="person-outline" size={35} color="black" style={styles.icon} />
              <Text style={styles.optionText}>I am a Guest</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFCF0', // Main background color from your attached image
  },
  
  // NEW STYLES FOR THE IMAGE HEADER
  headerImageBackground: {
    width: '100%',
    // Set height relative to screen height (e.g., 28% of the screen)
    height: height * 0.5, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: -250, // Adjust this to position the logo vertically within the purple area
  },
  logoImage: {
    width: 170, // Match the logo size from your image
    height: 170,
    tintColor: 'white', // Ensure the logo is white against the purple
  },
  logoText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    marginTop: -50,
    textTransform: 'uppercase', // Match the uppercase look
    letterSpacing: 1,
  },

  // Remaining Styles (updated for alignment/sizing)
  content: {
    flex: 1,
    marginTop: -175, // Negative margin to bring content close to the wave dip
  },
  welcomeSection: {
    alignItems: 'center',
    marginTop: 30,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  tagline: {
    fontSize: 18,
    color: '#555',
    marginTop: 5,
    textAlign: 'center',
  },
  pathSection: {
    marginTop: 50,
    alignItems: 'center',
  },
  pathTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 40,
    textAlign: 'center',
  },
  optionsContainer: {
    width: '100%',
    paddingHorizontal: 40,
    gap: 15, // Creates consistent spacing between buttons
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D9D9D9', // Button background from your image
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25, // Create the pill shape
    width: '100%',
  },
  icon: {
    marginRight: 20,
    marginLeft: 10,
  },
  optionText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
  },
});

export default ChoosingPage;