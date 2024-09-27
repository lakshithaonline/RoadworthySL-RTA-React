import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const getAuthToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.token : null;
};

const ExaminerToken = () => {
    const examiner = JSON.parse(localStorage.getItem('examinerToken'));
    return examiner ? examiner.token : null;
};

// New API Service to approve an appointment
export const approveAppointment = async (appointmentId) => {
    const headers = { Authorization: `Bearer ${ExaminerToken()}` };
    const response = await axios.post(`${API_URL}/examiner/approve-appointment/${appointmentId}`, {}, { headers });
    return response.data;
};


// New API Service to get appointments for an examiner
export const getExaminerAppointments = async () => {
    const headers = { Authorization: `Bearer ${ExaminerToken()}` };
    const response = await fetch(`${API_URL}/examiner/appointments`, { headers });
    return response.json();
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

export const editAppointment = async (appointmentId, date, time) => {
    const headers = { Authorization: `Bearer ${getAuthToken()}` };
    const response = await axios.put(`${API_URL}/user/edit-appointment/${appointmentId}`, { date, time }, { headers });
    return response.data;
};

export const deleteAppointment = async (appointmentId) => {
    const headers = { Authorization: `Bearer ${getAuthToken()}` };
    const response = await axios.delete(`${API_URL}/user/delete-appointment/${appointmentId}`, { headers });
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