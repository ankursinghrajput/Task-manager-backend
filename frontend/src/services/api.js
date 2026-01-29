import axios from 'axios';

const API_URL = 'http://localhost:5005';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API calls
export const authAPI = {
    register: (userData) => api.post('/user/register', userData),
    login: (credentials) => api.post('/user/login', credentials),
    getCurrentUser: () => api.get('/user/current'),
    changePassword: (data) => api.put('/user/change-password', data),
    deleteAccount: () => api.delete('/user/delete-user'),
};

// Task API calls
export const taskAPI = {
    getTasks: (params = {}) => api.get('/tasks', { params }),
    createTask: (taskData) => api.post('/tasks', taskData),
    updateTask: (id, taskData) => api.put(`/tasks/${id}`, taskData),
    deleteTask: (id) => api.delete(`/tasks/${id}`),
    getStats: () => api.get('/tasks/stats'),
    getOverdueTasks: () => api.get('/tasks/overdue'),
};

export default api;
