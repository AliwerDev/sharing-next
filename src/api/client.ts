import axios from 'axios';

// Create an Axios instance
const apiClient = axios.create({
  // Point to the Next.js API routes or the backend URL
  // If the backend is running separately (e.g., on port 3001), change this to 'http://localhost:3001/api' or use env vars
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor for API calls
apiClient.interceptors.request.use(
  async (config) => {
    // You can add auth tokens here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Handle global errors here (e.g., 401 Unauthorized -> redirect to login)
    return Promise.reject(error);
  }
);

export default apiClient;
