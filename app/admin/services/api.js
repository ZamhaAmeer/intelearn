import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL configuration
// Replace with your local IP address if testing on physical devices (e.g. 'http://192.168.1.100:3000/api')
const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically attach authorization header
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('adminToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error fetching token from AsyncStorage', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API Services Layer
export const authService = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
  changePassword: async (oldPassword, newPassword) => {
    const response = await api.put('/auth/password', { oldPassword, newPassword });
    return response.data;
  },
  logout: async () => {
    await AsyncStorage.removeItem('adminToken');
    await AsyncStorage.removeItem('adminProfile');
  }
};

export const dashboardService = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  }
};

export const studentService = {
  getAll: async (search = '') => {
    const response = await api.get(`/students?search=${search}`);
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },
  create: async (studentData) => {
    const response = await api.post('/students', studentData);
    return response.data;
  },
  update: async (id, studentData) => {
    const response = await api.put(`/students/${id}`, studentData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  },
  getEmotions: async (id) => {
    const response = await api.get(`/students/${id}/emotions`);
    return response.data;
  },
  getAcademic: async (id) => {
    const response = await api.get(`/students/${id}/academic`);
    return response.data;
  }
};

export const lecturerService = {
  getAll: async (search = '') => {
    const response = await api.get(`/lecturers?search=${search}`);
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/lecturers/${id}`);
    return response.data;
  },
  create: async (lecturerData) => {
    const response = await api.post('/lecturers', lecturerData);
    return response.data;
  },
  update: async (id, lecturerData) => {
    const response = await api.put(`/lecturers/${id}`, lecturerData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/lecturers/${id}`);
    return response.data;
  },
  assignFaculty: async (id, facultyId, department) => {
    const response = await api.put(`/lecturers/${id}/assign`, { faculty_id: facultyId, department });
    return response.data;
  }
};

export const facultyService = {
  getAll: async () => {
    const response = await api.get('/faculties');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/faculties/${id}`);
    return response.data;
  },
  create: async (facultyData) => {
    const response = await api.post('/faculties', facultyData);
    return response.data;
  },
  update: async (id, facultyData) => {
    const response = await api.put(`/faculties/${id}`, facultyData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/faculties/${id}`);
    return response.data;
  },
  getLecturers: async (id) => {
    const response = await api.get(`/faculties/${id}/lecturers`);
    return response.data;
  }
};

export const emotionService = {
  getReports: async (emotion = '', studentId = '') => {
    const response = await api.get(`/emotions/reports?emotion=${emotion}&studentId=${studentId}`);
    return response.data;
  },
  getTrends: async () => {
    const response = await api.get('/emotions/trends');
    return response.data;
  },
  getRiskAlerts: async () => {
    const response = await api.get('/emotions/alerts');
    return response.data;
  }
};

export const resourceService = {
  getAll: async (search = '', category = '', facultyId = '') => {
    const response = await api.get(`/resources?search=${search}&category=${category}&facultyId=${facultyId}`);
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/resources/${id}`);
    return response.data;
  },
  create: async (resourceData) => {
    const response = await api.post('/resources', resourceData);
    return response.data;
  },
  update: async (id, resourceData) => {
    const response = await api.put(`/resources/${id}`, resourceData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/resources/${id}`);
    return response.data;
  }
};

export const announcementService = {
  getAll: async () => {
    const response = await api.get('/announcements');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/announcements/${id}`);
    return response.data;
  },
  create: async (announcementData) => {
    const response = await api.post('/announcements', announcementData);
    return response.data;
  },
  update: async (id, announcementData) => {
    const response = await api.put(`/announcements/${id}`, announcementData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/announcements/${id}`);
    return response.data;
  }
};

export default api;
