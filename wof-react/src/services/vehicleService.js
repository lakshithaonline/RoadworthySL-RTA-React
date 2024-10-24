import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const getAuthToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.token : null;
};

const AdminToken = () => {
    const admin = JSON.parse(localStorage.getItem('adminToken'));
    return admin ? admin.token : null;
};

export const getAllVehicles = async () => {
    const token = AdminToken();
        const response = await axios.get(`${API_URL}/admin/get-all-vehicles`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
};

export const getAllVehiclesWithDetails = async () => {
    const token = AdminToken();
    const response = await axios.get(`${API_URL}/admin/get-vehicles-users-wofs`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

export const registerVehicle = async (vehicleData) => {
    const token = getAuthToken();
    const response = await axios.post(`${API_URL}/user/vehicle-register`, vehicleData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

export const viewVehicle = async (registrationNumber) => {
    const token = getAuthToken();
    const response = await axios.get(`${API_URL}/user/vehicles`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

export const updateVehicle = async (registrationNumber, vehicleData) => {
    const token = getAuthToken();
    const response = await axios.put(`${API_URL}/user/vehicles/${registrationNumber}`, vehicleData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

export const deleteVehicle = async (registrationNumber) => {
    const token = getAuthToken();
    const response = await axios.delete(`${API_URL}/user/vehicles/${registrationNumber}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};
