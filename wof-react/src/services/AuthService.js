import axios from 'axios';
const API_URL = process.env.REACT_APP_BACKEND_URL;

const register = async (userData) => {
    const response = await axios.post(`${API_URL}/auth/user/create`, userData);
    return response.data;
};

const login = async (userData) => {
    const response = await axios.post(`${API_URL}/auth/user/login`, userData);
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

export const examinerLogin = async (username, password) => {
    try {
        const response = await fetch(`${API_URL}/auth/examiner/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
            credentials: 'include' // Ensure cookies are included with requests if needed for session management
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
};

const examinerRegister = async (userData) => {
    const token = localStorage.getItem('adminToken'); // Retrieve the admin token from localStorage
    const config = {
        headers: {
            'Authorization': `Bearer ${token}` // Attach the token as a Bearer token in the Authorization header
        }
    };
    const response = await axios.post(`${API_URL}/admin/register-examiner`, userData, config);
    return response.data;
};

const AuthService = {
    register,
    login,
    examinerLogin,
    examinerRegister
};

export default AuthService;
