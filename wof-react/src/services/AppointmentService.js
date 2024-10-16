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

const AdminToken = () => {
    const admin = JSON.parse(localStorage.getItem('adminToken'));
    return admin ? admin.token : null;
};

export const getAllAppointment = async () => {
    const token = AdminToken();
    try {
        const response = await axios.get(`${API_URL}/admin/get-all-appointments`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Failed to fetch appointments');
        }
    }
};

// New API Service to approve an appointment
export const approveAppointment = async (appointmentId) => {
    const headers = { Authorization: `Bearer ${ExaminerToken()}` };
    const response = await axios.post(`${API_URL}/examiner/approve-appointment/${appointmentId}`, {}, { headers });
    return response.data;
};

export const completeAppointment = async (_Id) => {
    const headers = { Authorization: `Bearer ${ExaminerToken()}` };
    const response = await axios.patch(`${API_URL}/examiner/complete-appointment/${_Id}`, {}, { headers });
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