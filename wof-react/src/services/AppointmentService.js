import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const getAuthToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.token : null;
};

export const getVehicles = async () => {
    const headers = { Authorization: `Bearer ${getAuthToken()}` };
    const response = await axios.get(`${API_URL}/user/vehicles`, { headers });
    return response.data.vehicles;
};

export const createAppointment = async (date, time, registrationNumber) => {
    const headers = { Authorization: `Bearer ${getAuthToken()}` };
    const response = await axios.post(`${API_URL}/user/create`, { date, time, registrationNumber }, { headers });
    return response.data;
};

export const getAllBookedSlots = async () => {
    const response = await fetch(`${API_URL}/user/bookedSlots`, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }
    });
    return response.json();
};

export const getUserAppointments = async () => {
    const response = await fetch(`${API_URL}/user/appointments`, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }
    });
    return response.json();
};