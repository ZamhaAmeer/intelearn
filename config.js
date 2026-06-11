// Central configuration file for the Intelearn app
// The backend URL is read from the .env file (EXPO_PUBLIC_API_URL)
// To change the backend server, update .env and restart expo with: npx expo start -c

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.118.87.232:3000';
