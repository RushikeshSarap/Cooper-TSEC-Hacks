import axios from "axios";

// Get API URL from environment with fallback
const BACKEND_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Enforce HTTPS in production
const isProduction = import.meta.env.PROD;
const API_URL = isProduction && BACKEND_API_URL.startsWith('http://')
    ? BACKEND_API_URL.replace('http://', 'https://')
    : BACKEND_API_URL;

export { API_URL };

// Create axios instance with enhanced configuration
const api = axios.create({
    baseURL: API_URL,
    timeout: 30000, // 30 second timeout
    headers: {
        "Content-Type": "application/json",
    },
});

// Add Authorization header to every request if token exists
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error("API Request Error:", error);
        return Promise.reject(error);
    }
);

// Add response interceptor to handle errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle network errors
        if (!error.response) {
            console.error("Network Error:", error.message);
            error.isNetworkError = true;
            error.message = "Network error. Please check your internet connection.";
        }
        
        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
        }
        
        return Promise.reject(error);
    }
);

// Export auth endpoints for centralized management
export const authEndpoints = {
    login: `${API_URL}/auth/login`,
    register: `${API_URL}/auth/register`,
    logout: `${API_URL}/auth/logout`,
};

export default api;
