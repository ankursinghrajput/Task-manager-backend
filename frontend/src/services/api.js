import axios from 'axios';

const API_URL = 'http://localhost:5005';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('accessToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    register: (userData) => api.post('/api/users/register', userData),
    login: (credentials) => api.post('/api/users/login', credentials),
    getCurrentUser: () => api.get('/api/users/current'),
    changePassword: (data) => api.put('/api/users/change-password', data),
    deleteAccount: () => api.delete('/api/users/delete-user'),
    logout: () => api.post('/api/users/logout'),
    logoutAll: () => api.post('/api/users/logout-all'),
};

export const taskAPI = {
    getTasks: (params = {}) => api.get('/api/tasks', { params }),
    createTask: (taskData) => api.post('/api/tasks', taskData),
    updateTask: (id, taskData) => api.put(`/api/tasks/${id}`, taskData),
    deleteTask: (id) => api.delete(`/api/tasks/${id}`),
    getStats: () => api.get('/api/tasks/stats'),
    getOverdueTasks: () => api.get('/api/tasks/overdue'),
};

export default api;
